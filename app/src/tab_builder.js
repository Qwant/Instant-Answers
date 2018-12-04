/**
 * tab_builder builds answers to the query
 * ia_solver uses this answer to pass it to the server
 */

var Promise = require('bluebird');
var fs = require('fs');

module.exports = function (iaLoadedModules) {

    var availableLanguages = config_get('languages.languages'); // see config/languages.yml
    var excludedIAList = config_get('app.qwant-ia.excludedIA'); // see config/app.yml

    return {
        getSmartQueryResponse: function (query, lang, i18n) {
            return new Promise(function (resolve, reject) {
                /** For each module, checks if regex match, and answers if it matches **/
                var moduleMatched = false;
                var modulePromise = null;
                var moduleLanguages = null;
                iaLoadedModules.forEach(function (ia) {
                    if (ia.testQuery(query, i18n) && !moduleMatched) {
                        moduleLanguages = ia.module.language;
                        moduleMatched = ia;
                        var moduleProcess = ia.execQuery(query, i18n);
                        if (!moduleLanguages || moduleLanguages.indexOf(lang) > -1) {
                            modulePromise = ia.solveData(moduleProcess, lang, i18n);
                        }
                    }
                });
                if (moduleMatched && modulePromise) {
                    modulePromise
                        .then(function (moduleData) {
                            resolve(moduleData);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                } else {
                    reject({error: 500, status: "error", message: 'No module match the query: ' + query});
                }
            });
        },
        solveByIaModuleName: function (query, iaModuleName, lang, i18n) {
            return new Promise(function (resolve, reject) {
                var isModuleExist = false;
                var modulePromise = null;
                var moduleLanguages = null;
                iaLoadedModules.forEach(function (ia) {
                    if (ia.testQuery(query, i18n) && ia.initialName === iaModuleName) {
                        moduleLanguages = ia.module.language;
                        isModuleExist = true;
                        var moduleProcess = ia.execQuery(query, i18n);
                        if (!moduleLanguages || moduleLanguages.indexOf(lang) > -1) {
                            modulePromise = ia.solveData(moduleProcess, lang, i18n);
                        }
                    }
                });
                if (isModuleExist && modulePromise) {
                    modulePromise
                        .then(function (moduleData) {
                            resolve(moduleData);
                        })
                        .catch(function (error) {
                            reject(error);
                        });
                } else {
                    reject({
                        error: 500,
                        status: "error",
                        message: 'module ' + iaModuleName + ' doesn\'t exist or bad query'
                    });
                }
            });
        },
        getPatterns: function () {
            return new Promise(function (resolve, reject) {
                var patterns = {};
                Object.keys(availableLanguages).forEach(function (key) {
                    var locale = availableLanguages[key];
                    var region = locale.code;
                    var i18n = require('./setup_i18n')(region, config_get('languages.options.default'));
                    var language = locale.match;
                    if (!patterns[language]) patterns[language] = {};
                    var moduleLanguages = null;
                    iaLoadedModules
                        .forEach(function (ia) {
                            moduleLanguages = ia.module.language;
                            var initialName = ia.initialName;
                            if (excludedIAList.indexOf(initialName) === -1 && (!moduleLanguages || moduleLanguages.indexOf(region) > -1)) patterns[language][initialName] = ia.getPattern(i18n).toString();
                        })
                });

                resolve(patterns);
            });
        }
    }
};