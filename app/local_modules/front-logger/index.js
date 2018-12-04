var elasticsearch = require('elasticsearch');
var winston = require('winston');
var winstonElastic = require('winston-elasticsearch');

var Logger = {};

Logger.init = function(logConfig, projectRootPath) {
    if (logConfig) {
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