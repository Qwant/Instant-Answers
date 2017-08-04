var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var request = require("request");
var util = require("util");
var join = Promise.join;
var qwantCast = require('./drivers/qwantCast.js');
var path = require('path');
var wetter = require('./drivers/wetter.js');
var geoSolver = require('./geocoder/geo_solver');
var winston = require('winston');
var logger = winston.loggers.get('logger');
var config = require('@qwant/config');
config.import('weather'); // language config file (config/weather.yml)
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

module.exports = {
    getData: function (values, proxyURL, localisation) {
        var lang = localisation.substring(0,2);

        return new Promise(function (resolve, reject) {

            if(lang === 'de') {
                var w = new wetter(values[2].toLowerCase(), proxyURL);
                var forecastPromise = w.forecastFive();
                forecastPromise.then(function(forecast) {
                    resolve(forecast);
                }).catch(function(error) {
                    reject(error);
                });
                return;
            }

            var openWeatherConfig = config_get('weather.openWeather');
            var qwantCastConfig = config_get('weather.qwantCast');
            var apiUrlFormat =  openWeatherConfig.url;
            var apiKey = openWeatherConfig.key;
            var qwantCastUrlFormat = qwantCastConfig.url;
            var weatherGeoCoderQuery = encodeURIComponent(values[2]).toLowerCase();

            geoSolver.solve(weatherGeoCoderQuery)
                .then(function(city) {
                	var apiQwantCastRequestUrl = util.format(qwantCastUrlFormat, "search", city.latitude, city.longitude);
                	var apiWeatherRequestUrl = util.format(apiUrlFormat, "weather", city.latitude, city.longitude, apiKey, lang);
                    var apiForecastRequestUrl = util.format(apiUrlFormat, "forecast", city.latitude, city.longitude, apiKey, lang);
                    var qwantCastPromise = qwantCast.callQwantCastApi(apiQwantCastRequestUrl, proxyURL);

                    var apiWeatherPromise = new Promise(function(resolveWeather, rejectWeather) {
                    	var requestParams = {
                            url: apiWeatherRequestUrl,
                            timeout: 3000
                        };

                        if (proxyURL != '') {
                            logger.info("proxyURL: " + proxyURL);
                            requestParams.proxy = proxyURL;
                        }

                        request(requestParams, function(error, response) {
							if(error) {
                                logger.error("bad weather current response", {module : "weather"});
                                rejectWeather(error);
                                return;
                            }

                            var openWeatherResponse;

						    try {
						        openWeatherResponse = JSON.parse(response.body);
						    } catch(e) {
						        e.msg = response.body;
						        throw e;
						    }

                            resolveWeather(openWeatherResponse)
                        })
                    });

                    var solveTimeForecast = process.hrtime();

                    var apiWeatherForecastPromise = new Promise(function(resolveForecast, rejectForecast) {
                        setTimeout(function() {
                            var requestParams = {
                                url: apiForecastRequestUrl,
                                timeout: 3000
                            };

                            if (proxyURL != '') {
                                requestParams.proxy = proxyURL;
                            }

                            request(requestParams, function(error, response) {
                                if (error) {
                                    logger.error("bad forecast current response", {module : "weather"});
                                    rejectForecast(error);
                                    return;
                                }
                                resolveForecast(response)
                            })
                        }, 200)
                    });

                    join(apiWeatherPromise, qwantCastPromise, apiWeatherForecastPromise, function(openWeatherData, qwantCastData, forecastData) {
                        try {
                            var defaultProvider = openWeatherConfig.provider_info;
                            var netatmoProvider = null;
                            var weatherData = null;


                        	if (qwantCastData.data) {
                        		qwantCastData.data.main.temp += 273;
                        		weatherData = qwantCastData.data;
                        		weatherData.weather = openWeatherData.weather;
                                netatmoProvider = qwantCastConfig.provider_info;
                        	} else {
                        		weatherData = openWeatherData;
                        	}

                            var weather = require("./forecast")(weatherData, forecastData, city);
                            weather.defaultProvider = defaultProvider;
                            weather.netatmoProvider = netatmoProvider;
                            resolve(weather);
                        } catch(e) {
                            logger.error("error building weather", {module : "weather", trace : [e]});
                            reject(e);
                        }
                    });
                }).catch(function(error){
                    reject(error);
                });
        });
    },
    getName: function () {
        return _("Weather", "weather");
    },
    getKeyword: function () {
        return "météo|meteo|méteo|metéo|weather|" + _("weather", "weather");
    },
    trigger: "start",
    script: "weather",
    flag: "i",
    timeout: 3000,
    cache: 1800
};