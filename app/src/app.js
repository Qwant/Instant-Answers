module.exports = function(app, iaSolver){
    var winston = require('winston');
    var logger = winston.loggers.get('logger');
    var defaultLanguage = config_get('languages.options.default'); // languages.yml
    var availableLanguages = config_get('languages.languages'); // languages.yml
    var Promise = require("bluebird");

    return new Promise(function (resolve, reject) {
        /** Return response from ia matched by pattern **/
        app.get('/', function (req, res, next) {
            var query = req.query.q;
            var lang = (req.query.locale) ? req.query.locale.toLowerCase() : defaultLanguage;
            var existingLanguage = false;
            if(availableLanguages) {
                Object.keys(availableLanguages).forEach(function (key) {
                    var language = availableLanguages[key];
                    if (lang === language.code) {
                        existingLanguage = true;
                        return 1;
                    }
                });
            }
            if (!existingLanguage) {
                lang = defaultLanguage;
            }

            let i18n = require('./setup_i18n')(lang, config_get('languages.options.default'));
            if (query && i18n) {
                iaSolver.solveByQuery(res, query, lang, i18n);
            } else {
                logger.warn('No query given');
                res.status(200).send({error: 200, message: 'No query given'});
            }

        });

        app.get('/cache/remove', function (req, res, next) {
            var key = req.query.key;
            var redisTools = require('./redis_tools');
            redisTools.initRedis();

            if (key) {
                redisTools.deleteFromCache(key);
                res.status(200).send({});
            } else {
                res.status(400).send({error: 400, message: 'Could not be removed from cache'});
            }
        });

        /** remove from blacklist **/
        app.get('/blacklist/remove', function (req, res, next) {
            var host = req.query.host;
            var redisTools = require('./redis_tools');
            redisTools.initRedis();

            if (host) {
                redisTools.removeFromBlacklist(host);
                res.status(200).send({});
            } else {
                res.status(400).send({error: 400, message: '' + host + ' could not be removed from blacklist'});
            }
        });

        /** purge blacklist **/
        app.get('/blacklist/purge', function (req, res, next) {
            var redisTools = require('./redis_tools');
            redisTools.initRedis();
            redisTools.emptyBlacklist();
            res.status(200).send({})
        })

        /** Return response from ia by name **/
        app.get('/solve', function (req, res, next) {
            var query = req.query.q;
            var ia = req.query.ia;
            var lang = (req.query.locale) ? req.query.locale.toLowerCase() : defaultLanguage;
            var existingLanguage = false;
            if(availableLanguages) {
                Object.keys(availableLanguages).forEach(function (key) {
                    var language = availableLanguages[key];
                    if (lang === language.code) {
                        existingLanguage = true;
                        return 1;
                    }
                });
            }
            if (!existingLanguage) {
                lang = defaultLanguage;
            }
            let i18n = require('./setup_i18n')(lang, config_get('languages.options.default'));
            if (ia && query && i18n) {
                iaSolver.solveByIaAndQuery(res, query, ia, lang, i18n)
            } else {
                console.log(ia, query, i18n);
                logger.warn('No module name or query given');
                res.status(200).send({error: 200, message: 'No module name or query given'});
            }
        });

        /** Return the list of patterns from ia **/
        app.get('/patterns', function (req, res, next) {
            iaSolver.getPatterns(res);
        });

        /** If there is an error, display it **/
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({"error": err.message});
        });

        resolve(app);
    });
};

