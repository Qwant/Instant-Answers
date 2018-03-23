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
        getSmartQueryResponse: function (query, lang) {
            return new Promise(function (resolve, reject) {
                /** For each module, checks if regex match, and answers if it matches **/
                var moduleMatched = false;
                var modulePromise = null;
                var moduleLanguages = null;
                iaLoadedModules.forEach(function (ia) {
                    if (ia.testQuery(query) && !moduleMatched) {
                        moduleLanguages = ia.module.language;
                        moduleMatched = ia;
                        var moduleProcess = ia.execQuery(query);
                        if (!moduleLanguages || moduleLanguages.indexOf(lang) > -1) {
                            modulePromise = ia.solveData(moduleProcess, lang);
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
        solveByIaModuleName: function (query, iaModuleName, lang) {
            return new Promise(function (resolve, reject) {
                var isModuleExist = false;
                var modulePromise = null;
                var moduleLanguages = null;
                iaLoadedModules.forEach(function (ia) {
                    if (ia.testQuery(query) && ia.initialName === iaModuleName) {
                        moduleLanguages = ia.module.language;
                        isModuleExist = true;
                        var moduleProcess = ia.execQuery(query);
                        if (!moduleLanguages || moduleLanguages.indexOf(lang) > -1) {
                            modulePromise = ia.solveData(moduleProcess, lang);
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
					require('./setup_i18n')(region);
					var language = locale.match;
					if (!patterns[language]) patterns[language] = {};
                    var moduleLanguages = null;
					iaLoadedModules
							.forEach(function (ia) {
                                moduleLanguages = ia.module.language;
								var initialName = ia.initialName;
                                if (excludedIAList.indexOf(initialName) === -1 && (!moduleLanguages || moduleLanguages.indexOf(region) > -1)) patterns[language][initialName] = ia.getPattern().toString();
							})
				});

				/* FIX #IA-477 */
                var sortedPatterns = {};
                var stackoverflow = '';
                for (var language in patterns) {
                    sortedPatterns[language] = {};
                    for (var ia in patterns[language]) {
                        if(ia === 'stackoverflow') {
                            stackoverflow = patterns[language][ia];
                        } else {
                            sortedPatterns[language][ia] = patterns[language][ia];
                        }
                    }
                    if(stackoverflow && stackoverflow.length !== 0) {
                        sortedPatterns[language]['stackoverflow'] = stackoverflow;
                        stackoverflow = '';
                    }
                }

				resolve(sortedPatterns);
			});
        }
    }
};