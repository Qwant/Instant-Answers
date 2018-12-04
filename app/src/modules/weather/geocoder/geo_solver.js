var http = require('http');
var Promise = require('bluebird');
var esTemplate = require('./es_templates.json');
var elasticsearch = require('elasticsearch');
var winston = require('winston');
var logger = winston.loggers.get('logger');

module.exports = function () {

    var geoSolverConfig = config_get('weather.geoCoder');
    var geoDataClient = new elasticsearch.Client({
        host: geoSolverConfig.baseUrl + ':' + geoSolverConfig.port
    });

    function getEmptyString(lan, values2, tabOfAliases, name) {

        var tabs = null;
        if (tabOfAliases) {
            if (tabOfAliases[lan] && tabOfAliases[lan].length > 0) {
                tabs = tabOfAliases[lan];
            } else if (tabOfAliases['en'] && tabOfAliases['en'].length > 0) {
                tabs = tabOfAliases["en"];
            } else if (tabOfAliases['global'] && tabOfAliases['global'].length > 0) {
                tabs = tabOfAliases["global"];
            }
        }

        if (tabs !== null || name) {
            //Traitement de la ville afin de la rendre "normale"
            values2 = values2.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();

            var regTirets = new RegExp("( ?- ?| )", "gi");

            if (name) {
                //On tente d'abord avec le name !
                name = name.replace(regTirets, "( ?- ?| )").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();
                var regName = new RegExp(name + "$", "gi");
                if (regName.test(values2)) {
                    values2 = values2.replace(regName, "").trim();
                    return values2;
                }
            }

            //Récupération des différents aliases existants pour une seule ville selon la langue du moteur de recherche de l'utilisateur
            var reg;

            for (var nom in tabs) {
                tabs[nom] = tabs[nom].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(regTirets, "( ?- ?| )").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();
                reg = new RegExp(tabs[nom] + "$", "gi");
                if (reg.test(values2) === true) {
                    return values2.replace(reg, '').trim();
                }
            }

        }
        return false;

    }


    function buildAliases(query) {
        var aliases = combine(query);
        var queries = aliases.map(function (alias) {
            var queryTemplate = {

                "match": {
                    "alias": alias
                }

            };
            queryTemplate.match.alias = alias;
            return queryTemplate;
        });

        return queries

    }

    function solveCountry(rawCountryName) {
        var countryTime = process.hrtime();
        var countryName = rawCountryName.trim();
        var countryQuery = esTemplate.country;
        countryQuery.query.bool.must[0].dis_max.queries[0].match.alias.query = countryName;
        countryQuery.query.bool.must[0].dis_max.queries[1].match.country.query = countryName;

        return new Promise(function (resolve, reject) {

            geoDataClient.search({
                index: geoSolverConfig.countryIndex,
                body: countryQuery
            })
                .then(function (resp) {
                    if (resp.hits.hits.length > 0) {
                        var hits = resp.hits.hits;
                        var country = hits[0]._source;
                        country.time = process.hrtime(countryTime);
                        country.took = resp.took;
                        resolve(country)
                    } else {
                        resolve(false);
                    }
                })
                .catch(function (err) {
                    reject("Err : " + err + "\nNo country found for " + countryName);
                })

        });
    }

    /* countryCode : optional */
    function solveCity(localisation, rawCityName, countryCode) {
        var arrLocal = localisation.split('_');
        var lan = 'fr';
        var user_country = 'fr';
        if (typeof(arrLocal[0]) !== 'undefined' && arrLocal[0] !== null) {
            lan = arrLocal[0];
        }
        if (typeof(arrLocal[1]) !== 'undefined' && arrLocal[1] !== null) {
            user_country = arrLocal[1];
        }
        return new Promise(function (resolve, reject) {
            if (rawCityName === '') {
                reject("no city name given")
            }
            var cityName = rawCityName.trim();
            var cityNames = buildAliases(cityName);

            var cityQuery;
            if (countryCode) {
                cityQuery = esTemplate.cityCountry;
                cityQuery.query.bool.must[0].dis_max.queries = cityNames;
                cityQuery.query.bool.must[1].term.country_code.value = countryCode;
            } else {
                cityQuery = esTemplate.city;
                cityQuery.query.dis_max.queries = cityNames;
            }

            var countryTime = process.hrtime();
            const hostConf = config_get('weather.elasticsearch.host');
            if (hostConf) {
                var elasticClient = new elasticsearch.Client({
                    host: hostConf
                });

                elasticClient.searchTemplate({
                    index: 'cities',
                    from: 0,
                    size: 1,
                    body: { // les params à envoyer à notre template 'cities_query'
                        'id': 'cities_query',
                        'params': {
                            "query": cityName,
                            "user_lang": lan,
                            "user_country": '',
                            "query_country": countryCode
                        }
                    }
                }).then(function (resp) {
                        if (resp.hits.hits.length > 0) { // si hits.hits n'est pas vide, c'est que l'ES a trouvé une réponse
                            var hits = resp.hits.hits[0]._source;
                            var isRestEmpty = getEmptyString(lan, cityName, hits.aliases, hits.name);

                            if (isRestEmpty === false) {
                                reject("Couldn't find the name in the tab of names.");
                            }

                            if (isRestEmpty && isRestEmpty.trim() !== '') {
                                reject("Useless characters.");
                            }
                            var TIMEZONE = hits.timezone;
                            var moment = require('moment-timezone');
                            var utcc = (moment.tz(moment.utc(), TIMEZONE).utcOffset()) / 60;

                            resolve({
                                country_code: hits.country_code.toUpperCase().trim(),
                                city: hits.name,
                                latitude: hits.location.lat,
                                alias: hits.aliases,
                                longitude: hits.location.lon,
                                population: hits.population,
                                utc: (utcc > 0 ? '+' : '') + utcc,
                                timezone: TIMEZONE,
                                time: process.hrtime(countryTime),
                                took: resp.took
                            });
                        }
                        reject("[weather] No response found."); // si l'ES n'a rien trouvé

                    }, function (err) {
                        logger.error('Error connecting to elastic client', {module: 'weather'}); // erreur de connexion à l'ES
                        reject(err);
                    }
                );
            } else {
                logger.error('No config', {module: 'weather'}); // erreur de connexion à l'ES
                reject("No config");
            }

        });
    }

    function combine(name) {
        var cityNames = [name];
        if (name.indexOf('-') != -1) {
            cityNames.push(name.replace(/-/g, ' '));
        }
        cityNames.forEach(function (cityName) {
            if (cityName.indexOf(' ') != -1) {
                cityNames.push(cityName.replace(/ /g, '-'));
            }
        });

        cityNames.forEach(function (cityName) {
            if (cityName.indexOf('st') != -1) {
                cityNames.push(cityName.replace(/st/g, 'saint'));
            }
        });

        cityNames.forEach(function (cityName) {
            if (cityName.indexOf('saint') != -1) {
                cityNames.push(cityName.replace(/saint/g, 'st'));
            }
        });
        return cityNames;
    }


    return {
        solve: function (geoQuery, lang) {

            var solveTime = process.hrtime();

            return new Promise(function (resolve, reject) {
                var queryData = geoQuery.replace(/%2c/g, ' ');
                var decodedQueryData = decodeURI(queryData).toLowerCase();
                var countryTime = false;
                var countryTook;

                solveCountry(decodedQueryData)
                    .then(function (countryResponse) {
                        var cityQuery = decodedQueryData;

                        if (countryResponse) {
                            countryTime = countryResponse.time;
                            countryTook = countryResponse.took;
                            countryResponse.alias.forEach(function (aliasName) {
                                if (decodedQueryData.indexOf(aliasName.toLowerCase()) != -1) {
                                    cityQuery = decodedQueryData.replace(aliasName.toLowerCase(), '');
                                    cityQuery = cityQuery.trim();
                                    return 1;
                                }
                            });

                            if (cityQuery === '') {
                                cityQuery = decodedQueryData;
                            }

                            return solveCity(lang, cityQuery, countryResponse.code)
                        } else {
                            return solveCity(lang, cityQuery)
                        }

                    })
                    .then(function (cityResponse) {
                        var solveDiff = process.hrtime(solveTime);
                        var times = "total : " + (solveDiff[0] * 1e9 + solveDiff[1]) / 1e6 + 'ms' +
                            "\ncountry : " +
                            (countryTime ? (countryTime[0] * 1e9 + countryTime[1]) / 1e6 + ' ms (time), ' + countryTook + "ms (took)" : '(no country)') +
                            "\ncity : " +
                            (cityResponse.time[0] * 1e9 + cityResponse.time[1]) / 1e6 + 'ms (time), ' + cityResponse.took + "ms (took)";
                        resolve({
                            latitude: cityResponse.latitude,
                            longitude: cityResponse.longitude,
                            name: cityResponse.city,
                            country: cityResponse.country_code,
                            utc: cityResponse.utc
                        });
                    })
                    .catch(function (error) {
                        reject(error);
                    })


            })
        }
    }
}();