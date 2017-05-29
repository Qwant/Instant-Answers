var _ = require('@qwant/front-i18n')._;
var config = require('@qwant/config');
config.import('weather'); // language config file (config/weather.yml)
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

module.exports = function(weatherResponse, openWeatherRawResponseForecast, city) {
    var forecastFive = [];
    
    /* current weather forecast */
    var currentWeather = new Forecast(weatherResponse);
    currentWeather.temperatures = {
        current : weatherResponse.main.temp
    };

    var localisation = { city : city.name, country : city.country };

    try {
        weatherResponse = JSON.parse(openWeatherRawResponseForecast.body);
    } catch(e) {
        e.msg = openWeatherRawResponseForecast.body;
        throw e;
    }

    var forecastFiveData = weatherResponse.list;
    var baseTime = new Date(forecastFiveData[0].dt * 1000);
    var baseDay = baseTime.getDay();
    var minTemp = {t : forecastFiveData[0].main.temp,c : baseDay, d : baseTime.getHours()};
    var maxTemp = {t : forecastFiveData[0].main.temp, c : baseDay, d : baseTime.getHours()};

    if(baseTime.getHours() < 18) {
        var skipFirstDayFoMinTemp = true
    }

    var maxTempCurrentDay = baseDay;
    var minTempCurrentDay = baseDay;
    var minTemperatures = [];
    var maxTemperatures = [];

    /* min temp is from 18h to 18h / max temp is form 6h to 6h */
    /* current day min / max */
    var currentDayMinTemp = currentWeather.temperatures.current;
    var currentDayMaxTemp = currentWeather.temperatures.current;

    forecastFiveData.forEach(function(forecastData) {
        var forecastTime = new Date(forecastData.dt * 1000);
        var forecastDay = forecastTime.getDay();
        var forecastHour = forecastTime.getHours() + forecastTime.getTimezoneOffset() / 60;

        /* min curr day before 18 */
        if(forecastDay == baseDay && forecastHour < 18 && currentDayMinTemp > forecastData.main.temp) {
            currentDayMinTemp = forecastData.main.temp;
        }

        /* cur day after 6 or cur day + 1 before 9 */
        if(((forecastDay == baseDay && forecastHour > 6) || (forecastDay == baseDay + 1 && forecastHour < 6)) && currentDayMaxTemp < forecastData.main.temp) {
            currentDayMaxTemp = forecastData.main.temp;
        }
    });

    currentWeather.temperatures.min = currentDayMinTemp;
    currentWeather.temperatures.max = currentDayMaxTemp;
    var MIN_TEMP_TIME = 18;
    var MAX_TEMP_TIME = 6;

    forecastFiveData.forEach(function(forecastData, index) {
        var forecastTime = new Date(forecastData.dt * 1000);
        var forecastDay = forecastTime.getDay();
        var forecastHour = forecastTime.getHours() + forecastTime.getTimezoneOffset() / 60;

        /* min temp */
        if(minTemp.t > forecastData.main.temp) {
            minTemp = {t : forecastData.main.temp, c : minTempCurrentDay, d : forecastHour};
        }

        /* max temp */
        if(maxTemp.t < forecastData.main.temp) {
            maxTemp = {t : forecastData.main.temp, c : maxTempCurrentDay, d : forecastHour};
        }

        if(forecastHour == MIN_TEMP_TIME || forecastFiveData.length == index + 1) {
            if(!skipFirstDayFoMinTemp) {
                minTemperatures.push(minTemp);
                minTempCurrentDay += 1;
                minTemp= {t : forecastData.main.temp};
            } else {
                skipFirstDayFoMinTemp = false
            }
        }

        if(forecastHour == MAX_TEMP_TIME || forecastFiveData.length == index + 1) {
            maxTemperatures.push(maxTemp);
            maxTempCurrentDay += 1;
            maxTemp = {t : forecastData.main.temp};
        }

        if(!config_get('weather.openWeather.forecastTime')) {
            throw "MISSING FORECAST TIME CONFIGURATION";
        }

        if(forecastDay != baseDay && forecastHour == config_get('weather.openWeather.forecastTime')) {
            /* get next day at */
            forecastFive.push(new Forecast(forecastData));
        }
    });

    minTemperatures = minTemperatures.filter(function(minTemperature) {
        return minTemperature.c != baseDay;
    });

    maxTemperatures = maxTemperatures.filter(function(maxTemperature) {
        return maxTemperature.c != baseDay;
    });

    forecastFive = forecastFive.map(function(forecast,index) {
        var minTemperature,maxTemperature = 0;

        if(minTemperatures[index]) {
            minTemperature = minTemperatures[index].t;
        }

        if(maxTemperatures[index]) {
            maxTemperature = maxTemperatures[index].t;
        }

        forecast.temperatures = {min : minTemperature, max : maxTemperature};
        return forecast
    });

    return { localisation : localisation, currentWeather : currentWeather, forecastFive : forecastFive };
};

function Forecast(forecastData) {
    return {
        date : forecastData.dt,
        wind : {
            value : forecastData.wind ? forecastData.wind.speed : null,
            label: (function() {
                return _("Wind", "ia-weather");
            })()
        },
        humidity : {
            value : forecastData.main.humidity,
            label: (function() {
                return _("Humidity", "ia-weather");
            })()
        },
        rain : {
            value : forecastData.main.rain,
            label: (function() {
                return _("Rain", "ia-weather");
            })()
        },
        pressure : {
            value : forecastData.main.pressure,
            label: (function() {
                return _("Pressure", "ia-weather");
            })()
        },
        weather : {
            iconId : forecastData.weather ? forecastData.weather[0].icon : null,
            status : forecastData.weather ? forecastData.weather[0].description : null
        }
    }
}