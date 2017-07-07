var elasticsearch = require('elasticsearch');
var winston = require('winston');
var winstonElastic = require('winston-elasticsearch');
var winstonFastRabbitMq = require('winston-fast-rabbitmq');
var os = require('os');
var crypto = require('crypto');
var fs = require('fs');
var iaCoreVersion = require('../../../package.json').version;

var const_hostname = os.hostname();

var Logger = {};

Logger.init = function(logConfig, projectRootPath) {
    if (logConfig) {
        if (logConfig.hasOwnProperty('rabbitMQ')) {
            var rabbitMQ = logConfig.rabbitMQ;
            winston.loggers.add('datahub', {
                transports: [
                    new (winstonFastRabbitMq)({
                        silent: true,
                        host: rabbitMQ.host,
                        exchangeType: 'direct',
                        exchangeName: rabbitMQ.target,
                        durable: true,
                        level: rabbitMQ.level,
                        formatter: function(logData) {
                            var message = logData.message;
                            var level = logData.level;
                            var meta = logData.meta;
                            message = message.replace('.', '_') + '_' + level;
                            var event = {
                                client : {},
                                date: Math.floor(new Date().getTime() / 1000),
                                name : 'ia_' + message,
                                id: 'ia-' + level + '-' + crypto.randomBytes(4).toString('hex'),
                                product: {
                                    module: 'core',
                                    name: 'ia',
                                    stage: process.env.ENVIRONMENT || 'dev',
                                    version: iaCoreVersion
                                },
                                request: {
                                    server: const_hostname
                                }
                            };

                            if (meta.hasOwnProperty('error') && typeof meta.error === 'object') {
                                Object.getOwnPropertyNames(meta.error).forEach(function (key) {
                                    if (key !== 'stack') meta['error_' + key] = meta.error[key];
                                }, this);

                                delete meta.error;
                            }

                            if (meta.hasOwnProperty('path')) meta.path = meta.path.toString().replace(projectRootPath, '');

                            event['data'] = meta;

                            return JSON.stringify(event);
                        }
                    })
                ]
            });
        }

        if (logConfig.hasOwnProperty('cli')) {
            var cli = logConfig.cli;

            var loggers = {
                console: {
                    level: cli.level,
                    colorize: true
                }
            };

            if (logConfig.hasOwnProperty('elasticSearch')) {
                var elastic = logConfig.elasticSearch;
                var logClient = new elasticsearch.Client({
                    host: elastic.url + ':' + elastic.port
                });
                loggers.transports = [
                    new (winstonElastic)({
                        index: elastic.indexName,
                        messageType: elastic.indexType,
                        client: logClient,
                        transformer: function (logData) {
                            var severity = logData.level.toLowerCase();
                            var trace = logData.meta.trace || [];
                            if(!Array.isArray(trace)) {
                                trace = [trace];
                            }
                            var moduleName = logData.meta.module || '';
                            var message = logData.message || '';
                            var createdAt = logData.meta.createdAt || new Date().getTime();
                            var severities = [
                                'emergency',
                                'alert',
                                'critical',
                                'error',
                                'warning',
                                'notice',
                                'info',
                                'debug'
                            ]
                            if(severities.indexOf(severity) == -1) {
                                severity = severities[0];
                            }
                            return {
                                "created_at": createdAt,
                                "module": moduleName,
                                "severity": severity,
                                "message": message,
                                "trace": trace
                            }
                        }
                    })
                ];
            }

            winston.loggers.add('logger', loggers);
        }
    }
};

module.exports = Logger;

/**
 *
 * @constructor
 * options
 *  - logServer {String} elastic remote adress
 *
 * @returns a logger with severity handling message
 *  - debug
 *  - info
 *  - notice
 *  - warning
 *  - error
 *  - emergency
 *  - alert
 *  - critical
 *
 *  # Usage
 *  var logger = require('qwant-front-logger')({logServer : config.logger.logServer, indexName : config.logger.indexName, environment : app.get('env')});
 *  logger.error("message")
 */