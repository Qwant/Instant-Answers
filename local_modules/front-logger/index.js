var request = require('request');
var elasticsearch = require('elasticsearch');


/**
 *
 * @constructor
 * options
 *  - logServer {String} elastic remote adress
 *  - indexName {String} elastic index name
 *  - environment {String} environment express : app.get('env')
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


module.exports = function(logConfig){
    logConfig = logConfig || {};
    var logServer = logConfig.server || false;
    var cliLogSeverity = logConfig.cliLogSeverity || ["critical"];
    var elasticLogSeverity = logConfig.cliLogSeverity || ["critical"];
    var logClient = false;

    if(logServer) {
        logClient = new elasticsearch.Client({
            host: logServer.url + ':' + logServer.port
        });
    }

    var SEVERITY = {
        EMERGENCY : {code : 0, head : 'emergency'},
        ALERT : {code : 1, head : 'alert'},
        CRITICAL : {code : 2, head : 'critical'},
        ERROR : {code : 3, head : 'error'},
        WARNING : {code : 4, head : 'warning'},
        NOTICE : {code : 5, head : 'notice'},
        INFO : {code : 6, head : 'info'},
        DEBUG : {code : 7, head : 'debug'}
    };

    return {

        critical : function(message, options) {
            log(SEVERITY.CRITICAL, message, options)
        },

        alert : function(message, options) {
            log(SEVERITY.ALERT, message, options)
        },

        emergency : function(message, options) {
            log(SEVERITY.EMERGENCY, message, options)
        },

        error : function(message, options) {
            log(SEVERITY.ERROR, message, options)
        },

        warning : function(message, options) {
            log(SEVERITY.WARNING, message, options)
        },

        notice : function(message, options) {
            log(SEVERITY.NOTICE, message, options)
        },

        info : function(message, options) {
            log(SEVERITY.INFO, message, options)
        },

        debug : function(message, options) {
            log(SEVERITY.DEBUG, message, options)
        }
    };

    /**
     *
     * @param severity severity of the operation
     * @param message message content
     * @param options
     *  - userAgent {String} user agent
     *  - uri {String} current URI
     *  - context {Array} error contect
     *  - tags {Array} tag list
     */

    function log(severity, message, options) {
        options = options || {};
        if(cliLogSeverity.indexOf(severity.head) != -1) {
            console.log('[' + severity.head + '] ' + message);
        }


        if(logClient && elasticLogSeverity.indexOf(severity.head) != -1) {
            var template = require('./log_template')(severity.head, message, options.module, options.trace, options.createdAt)
            try  {
                logClient.create({
                    index : logServer.indexName,
                    type : logServer.indexType,
                    body: template
                }, function(error, response) {
                    if(error) console.log(error)
                })
            } catch (e) {
                console.log(e)
            }

        }
    }
};