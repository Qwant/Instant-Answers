var http = require('http');
var Promise = require('bluebird');
var esTemplate = require('./es_templates.json');
var elasticsearch = require('elasticsearch');
//var logger = require('qwant-front-logger')(container.getParameter('logConfig'));

module.exports = function() {

    var geoSolverConfig = config_get('weather.geoCoder');
    var geoDataClient = new elasticsearch.Client({
        host: geoSolverConfig.baseUrl + ':' + geoSolverConfig.port
    });


    function buildAliases(query) {
        var aliases = combine(query);
            var queries = aliases.map(function(alias) {
            var queryTemplate = {

                "match" : {
                    "alias" : alias
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

        return new Promise(function(resolve, reject) {

            geoDataClient.search({
                index: geoSolverConfig.countryIndex,
                body: countryQuery
            })
                .then(function (resp) {
                    if(resp.hits.hits.length > 0) {
                        var hits = resp.hits.hits;
                        var country = hits[0]._source;
                        country.time = process.hrtime(countryTime);
                        country.took = resp.took;
                        resolve(country)
                    } else {
                        resolve(false);
                    }})
                .catch(function(err) {
                    reject("Err : " + err + "\nNo country found for " + countryName);
                })

        });
    }
    /* countryCode : optional */
    function solveCity(rawCityName, countryCode) {

        var cityTime = process.hrtime();

        return new Promise(function(resolve, reject) {
            if(rawCityName === '') {
                reject("no city name given")
            }
            var cityName = rawCityName.trim();
            var cityNames = buildAliases(cityName);

            var cityQuery;
            if(countryCode) {
                cityQuery = esTemplate.cityCountry;
                cityQuery.query.bool.must[0].dis_max.queries = cityNames;
                cityQuery.query.bool.must[1].term.country_code.value = countryCode;
            } else {
                cityQuery = esTemplate.city;
                cityQuery.query.dis_max.queries = cityNames;
            }

            geoDataClient.search({
                index: geoSolverConfig.cityIndex,
                body: cityQuery
            })
                .then(function (cityResponse) {
                    if(cityResponse.hits.hits.length > 0) {
                        var city = cityResponse.hits.hits[0]._source;
                        city.time = process.hrtime(cityTime);
                        city.took = cityResponse.took;
                        resolve(city);
                    } else {
                        reject("city not found " + rawCityName);
                    }
                    })
                .catch(function(err) {
                    reject("city geoCode request error \n" + err);
            })

        });
    }

    function combine(name) {
        var cityNames = [name];
        if(name.indexOf('-') != -1) {
            cityNames.push(name.replace(/-/g, ' '));
        }
        cityNames.forEach(function(cityName) {
            if(cityName.indexOf(' ') != -1) {
                cityNames.push(cityName.replace(/ /g, '-'));
            }
        });

        cityNames.forEach(function(cityName) {
            if(cityName.indexOf('st') !=-1) {
                cityNames.push(cityName.replace(/st/g, 'saint'));
            }
        });

        cityNames.forEach(function(cityName) {
            if(cityName.indexOf('saint') !=-1) {
                cityNames.push(cityName.replace(/saint/g, 'st'));
            }
        });
        return cityNames;
    }



  return {
      solve : function(geoQuery) {

          var solveTime = process.hrtime();

          return new Promise(function(resolve, reject) {
              var queryData = geoQuery.replace(/%2c/g,' ');
              var decodedQueryData = decodeURI(queryData).toLowerCase();
              var countryTime = false;
              var countryTook;

                  solveCountry(decodedQueryData)
                      .then(function(countryResponse) {
                          var cityQuery = decodedQueryData;

                          if(countryResponse) {
                              countryTime = countryResponse.time;
                              countryTook = countryResponse.took;
                              countryResponse.alias.forEach(function(aliasName) {
                                  if(decodedQueryData.indexOf(aliasName.toLowerCase()) != -1) {
                                      cityQuery = decodedQueryData.replace(aliasName.toLowerCase(), '');
                                      cityQuery = cityQuery.trim();
                                      return 1;
                                  }
                              });

                              if(cityQuery === '') {
                                  cityQuery = decodedQueryData;
                              }

                              return solveCity(cityQuery, countryResponse.code)
                          } else {
                              return solveCity(cityQuery)
                          }

                      })
                      .then(function(cityResponse) {
                          var solveDiff = process.hrtime(solveTime);
                          var times = "total : " +(solveDiff[0] * 1e9 + solveDiff[1]) / 1e6 + 'ms' +
                              "\ncountry : " +
                              (countryTime ? (countryTime[0] * 1e9 + countryTime[1]) / 1e6 + ' ms (time), ' + countryTook + "ms (took)" : '(no country)') +
                              "\ncity : " +
                              (cityResponse.time[0] * 1e9 + cityResponse.time[1]) / 1e6 + 'ms (time), ' + cityResponse.took + "ms (took)";
                          //logger.info(times, {module : "weather"});
                          resolve({latitude : cityResponse.latitude, longitude : cityResponse.longitude, name : cityResponse.city, country : cityResponse.country_code});
                      })
                      .catch(function(error) {
                          reject(error);
                      })


          })
      }
  }
}();