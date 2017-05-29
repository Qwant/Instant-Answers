/**
 * ia_solver serves the answers to the server from tab builder
 * @param iaLoadedModules
 * @returns {{solveByIaAndQuery: solveByIaAndQuery, solveByQuery: solveByQuery, getPatterns: getPatterns}}
 */

module.exports = function (iaLoadedModules) {

    var tabBuilder = require('./tab_builder')(iaLoadedModules);

    return {
        solveByIaAndQuery: function (res, query, ia, lang) {
            var moduleResponsePromise = tabBuilder.solveByIaModuleName(query, ia, lang);

            moduleResponsePromise
                    .then(function (iaResult) {
                        res.send(iaResult);
                    })
                    .catch(function (error) {
                        if (error.error == 200) {
                            res.status(200).send(error);
                        } else {
                            res.status(500).send(error);
                        }
                    })

        },
        solveByQuery: function (res, query, lang) {
            var iaResultPromise = tabBuilder.getSmartQueryResponse(query, lang);

            iaResultPromise
                    .then(function (iaResult) {
                        res.send(iaResult);
                    })
                    .catch(function (error) {
                        if (error.error == 200) {
                            res.status(200).send(error);
                        } else {
                            res.status(500).send(error);
                        }


                    });
        },
        getPatterns: function (res) {
            var patternResponsePromise = tabBuilder.getPatterns();

            patternResponsePromise
                    .then(function (patternResult) {
                        res.send(patternResult);
                    })
                    .catch(function (error) {
                        if (error.error == 200) {
							res.status(200).send(error);
						} else {
							res.status(500).send(error);
						}
                    });
        }
    };
};