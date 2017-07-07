module.exports = function(app, iaSolver){
    var winston = require('winston');
    var logger = winston.loggers.get('logger');
    var defaultLanguage = config_get('languages.options.default'); // languages.yml
	var availableLanguages = config_get('languages.languages'); // languages.yml
    var Promise = require("bluebird");

    return new Promise(function (resolve, reject) {

        /** For every call of IA, setup i18n with the right dictionary **/
        app.use(function (req, res, next) {
            var lang = (req.query.lang) ? req.query.lang : defaultLanguage;
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
            require('./setup_i18n')(lang);
			req.query.lang = lang;
            next();
        });

        /** Return response from ia matched by pattern **/
        app.get('/', function (req, res, next) {
            var query = req.query.q;
            var lang = (req.query.lang) ? req.query.lang : defaultLanguage;
            if (query) {
                iaSolver.solveByQuery(res, query, lang);
            } else {
                logger.warn('No query given');
                res.status(200).send({error: 200, message: 'No query given'});
            }
        });

        /** Return response from ia by name **/
        app.get('/solve', function (req, res, next) {
            var query = req.query.q;
            var ia = req.query.ia;
            var lang = (req.query.lang) ? req.query.lang : defaultLanguage;
            if (ia && query) {
                iaSolver.solveByIaAndQuery(res, query, ia, lang)
            } else {
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

