var Promise = require("bluebird");
var request = require("request");
var util = require("util");
var join = Promise.join;
var wetter = require('./drivers/wetter.js');
var geoSolver = require('./geocoder/geo_solver');
var winston = require('winston');
var logger = winston.loggers.get('logger');
var config = require('@qwant/config');
config.import('weather'); // language config file (config/weather.yml)
Object.keys(config).forEach(function (elem) {
    config_set(elem, config[elem]);
});

module.exports = {
    getData: function (values, proxyURL, localisation, i18n) {
        const _ = i18n._;
        var lang = localisation.substring(0, 2);

        return new Promise(function (resolve, reject) {

            if (lang === 'de') {
                var w = new wetter(values[2].toLowerCase(), proxyURL, i18n);
                var forecastPromise = w.forecastFive();
                forecastPromise.then(function (forecast) {
                    resolve(forecast);
                }).catch(function (error) {
                    reject(error);
                });
                return;
            }

            var openWeatherConfig = config_get('weather.openWeather');
            var apiUrlFormat = openWeatherConfig.url;
            var apiKey = openWeatherConfig.key;
            var weatherGeoCoderQuery = encodeURIComponent(values[2]).toLowerCase();

            geoSolver.solve(weatherGeoCoderQuery, localisation)
                .then(function (city) {
                    var apiWeatherRequestUrl = util.format(apiUrlFormat, "weather", city.latitude, city.longitude, apiKey, lang);
                    var apiForecastRequestUrl = util.format(apiUrlFormat, "forecast", city.latitude, city.longitude, apiKey, lang);

                    var apiWeatherPromise = new Promise(function (resolveWeather, rejectWeather) {
                        var requestParams = {
                            url: apiWeatherRequestUrl,
                            timeout: 3000
                        };

                        if (proxyURL != '') {
                            logger.info("proxyURL: " + proxyURL);
                            requestParams.proxy = proxyURL;
                        }

                        request(requestParams, function (error, response) {
                            if (error) {
                                logger.error("bad weather current response", {module: "weather"});
                                rejectWeather(error);
                                return;
                            }

                            var openWeatherResponse;

                            try {
                                openWeatherResponse = JSON.parse(response.body);
                            } catch (e) {
                                e.msg = response.body;
                                throw e;
                            }

                            resolveWeather(openWeatherResponse)
                        })
                    });

                    var apiWeatherForecastPromise = new Promise(function (resolveForecast, rejectForecast) {
                        setTimeout(function () {
                            var requestParams = {
                                url: apiForecastRequestUrl,
                                timeout: 3000
                            };

                            if (proxyURL != '') {
                                requestParams.proxy = proxyURL;
                            }

                            request(requestParams, function (error, response) {
                                if (error) {
                                    logger.error("bad forecast current response", {module: "weather"});
                                    rejectForecast(error);
                                    return;
                                }
                                resolveForecast(response)
                            })
                        }, 200)
                    });

                    join(apiWeatherPromise, apiWeatherForecastPromise, function (openWeatherData, forecastData) {
                        try {
                            var defaultProvider = openWeatherConfig.provider_info;
                            var weatherData = null;

                            weatherData = openWeatherData;
                            var weather = require("./forecast")(weatherData, forecastData, city, i18n);
                            weather.defaultProvider = defaultProvider;
                            // weather.netatmoProvider = netatmoProvider;
                            resolve(weather);
                        } catch (e) {
                            logger.error("error building weather", {module: "weather", trace: [e]});
                            reject(e);
                        }
                    });
                }).catch(function (error) {
                reject(error);
            });
        });
    },
    getName: function (i18n) {
        const _ = i18n._;
        return _("Weather", "weather");
    },
    getKeyword: function (i18n) {
        const _ = i18n._;
        return "wetter in|wetter|meteo à|meteo a|meteo de|météo à|météo a|météo de|meteo|météo|weather in|weather at|weather of|weather|" + _("weather", "weather");
    },
    trigger: "start",
    script: "weather",
    flag: "i",
    timeout: 3000,
    cache: 1800,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    order: 90,
};