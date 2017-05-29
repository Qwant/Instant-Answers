var Promise = require("bluebird");
var request = require("request");
var _ = require('@qwant/front-i18n')._;
var md5 = require('md5');
var util = require('util');
var config = require('@qwant/config');
config.import('weather'); // language config file (config/weather.yml)
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

var wetterConfig = config_get('weather.wetter');

function Wetter(localisation, proxyURL) {
    this.query = localisation;
    this.proxyURL = proxyURL;
    this.url = wetterConfig.url;
}

Wetter.prototype.forecastFive = function() {
    var it = this;
    var city;

    return this.promiseCityCode(this.query).then(function(cityData) {
        city = cityData;
        return it.promiseForecast(cityData)
    }).then(function(forecast) {
        return it.convertForecast(forecast, city)
    })
};

Wetter.prototype.convertForecast = function(wetterForecasts, city) {
    var data = {};
    var baseDay;

    /* localisation */
    data.localisation = {
        city: city.name,
        country: city.country_code
    };

    /* add provider info */
    data.defaultProvider = wetterConfig.provider_info;
    data.forecastFive = [];

    /* add forecast (8 O'clock) */
    Object.keys(wetterForecasts).map(function(key) {
        return wetterForecasts[key]
    }).forEach(function(wetterForecast, index) {
        var weather = {
            date : wetterForecast.d,
            wind : {
                value : wetterForecast.ws,
                label: (function() {
                    return _("Wind", "ia-weather");
                })()
            },
            humidity : {
                value : wetterForecast.rh,
                label: (function() {
                    return _("Humidity", "ia-weather");
                })()
            },
            weather : {
                iconId: getIconId(wetterForecast.w),
                status: wetterForecast.w_txt
            },
            temperatures : {
                min : parseFloat(wetterForecast.tn) + 273.15,
                current : parseFloat(wetterForecast.tn) + 273.15,
                max : parseFloat(wetterForecast.tx) + 273.15
            }
        };
        var date = new Date(parseInt(wetterForecast.d) * 1000);

        /* current weather is the first forecast */
        if(index === 0) {
            data.currentWeather = weather;
            baseDay = date.getDate();
        }

        if(!config_get('weather.openWeather.forecastTime')) {
            throw "MISSING FORECAST TIME CONFIGURATION";
        }

        /* forecast weather */
        if(date.getDate() !== baseDay && index < 5) {
            /* get next day at */
            data.forecastFive.push(weather);
        }
    });
    return data;
};

Wetter.prototype.promiseCityCode = function(name) {
    var it = this;
    return new Promise(function(resolve, reject) {

        name = name.toLowerCase();

        var requestParams = {
            url: it.url + '/location/index/search/' + encodeURIComponent(name) + getUserString(name),
            timeout: 3000
        };

        if (it.proxyURL !== '') {
            requestParams.proxy = it.proxyURL;
        }

        request(requestParams, function(error, response, rawBody) {
            if (error) {
                if (error.message) {
                    error.message = requestParams.url + ' : ' + error.message;
                }
                reject(error);
            } else {
                try {
                    var body = JSON.parse(rawBody);
                    var results = body.search.result;
                    if(results.length > 0) {
                        resolve(results[0])
                    } else {
                        reject('empty result');
                    }
                } catch (error) {
                    if (error.message) {
                        error.message = requestParams.url + ' : ' + error.message;
                    }
                    reject(error);
                }
            }
        })
    })
};

Wetter.prototype.promiseForecast = function(city) {
    var it = this;
    return new Promise(function(resolve, reject) {

        var requestParams = {
            url: it.url + '/forecast/weather/city/' + city.city_code + getUserString(city.city_code),
            timeout: 3000
        };

        if (it.proxyURL !== '') {
            requestParams.proxy = it.proxyURL;
        }

        request(requestParams, function(error, response, rawBody) {
            if(error) {
                reject(error);
            } else {
                try {
                    var body = JSON.parse(rawBody);
                    resolve(body.city.forecast);
                } catch (e) {
                    reject(e);
                }
            }
        })
    })
};

function getUserString(query) {
    var name = wetterConfig.name;
    var password = wetterConfig.password;
    var cs = md5(name + password + query);

    return util.format("/user/%s/cs/%s", name, cs);
}

/* get the corresponding number for Qwant weather code */
function getIconId(wetterIconId) {
    var iconIdPrefix = wetterIconId[0];
    var iconId = parseInt(iconIdPrefix);

    if(iconId == 0)
        return "01";
    if(iconId <= 3)
        return "02";
    if(iconId == 4)
        return "04";
    if(iconId <= 6)
        return "09";
    if(iconId <= 7)
        return "13";
    if(iconId <= 8)
        return "09";
    if(iconId == 9) {
        return "11"
    }

    return 0;
}

module.exports = Wetter;