var config = require('@qwant/config');
config.import('weather'); // language config file (config/weather.yml)
Object.keys(config).forEach(function (elem) {
    config_set(elem, config[elem]);
});

module.exports = function (weatherResponse, openWeatherRawResponseForecast, city, i18n) {
    const _ = i18n._;
    var forecastFive = {};
    var today = new Date();

    /* current weather forecast */
    var currentWeather = {'main': new Forecast(weatherResponse, i18n, city)};
    delete currentWeather.main.temperature;
    currentWeather.main.temperatures = {
        current: (typeof weatherResponse.main.temp === 'undefined') ? 'N/A' : weatherResponse.main.temp,
        min: null,
        max: null
    };

    if (typeof weatherResponse.sys.sunrise === 'undefined') {
        currentWeather.main.sunrise = -1;
    } else {
        var sunriseTime = new Date((weatherResponse.sys.sunrise + (3600 * city.utc)) * 1000);
        currentWeather.main.sunrise = sunriseTime.getUTCHours();
    }

    if (typeof weatherResponse.sys.sunset === 'undefined') {
        currentWeather.main.sunset = -1;
    } else {
        var sunsetTime = new Date((weatherResponse.sys.sunset + (3600 * city.utc)) * 1000);
        currentWeather.main.sunset = sunsetTime.getUTCHours();
    }

    currentWeather.list = [];

    var localisation = {city: city.name, country: city.country};

    try {
        weatherResponse = JSON.parse(openWeatherRawResponseForecast.body);
    } catch (e) {
        e.msg = openWeatherRawResponseForecast.body;
        throw e;
    }

    var forecastFiveData = weatherResponse.list;

    var currentMin = currentWeather.main.temperatures.current;
    var currentMax = currentWeather.main.temperatures.current;

    forecastFiveData.forEach(function (forecastData, index) {
        var baseTime = new Date((forecastData.dt + (3600 * city.utc)) * 1000);
        var longDay = baseTime.getUTCDate() > 10 ? baseTime.getUTCDate() : '0' + baseTime.getUTCDate();
        var longMonth = baseTime.getUTCMonth() > 10 ? baseTime.getUTCMonth() : '0' + baseTime.getUTCMonth();
        var baseDay = baseTime.getUTCFullYear() + '_' + longMonth + '_' + longDay;
        var hour = baseTime.getUTCHours();

        if (currentWeather.list.length < 8) {
            if (currentMax == null || forecastData.main.temp > currentMax) {
                currentMax = forecastData.main.temp;
            }
            if (currentMin == null || forecastData.main.temp < currentMin) {
                currentMin = forecastData.main.temp;
            }
            currentWeather.list.push(new Forecast(forecastData, i18n, city));
        }
        if (baseTime.getUTCDate() != today.getUTCDate()) {
            if (typeof forecastFive[baseDay] === 'undefined') {
                if (Object.keys(forecastFive).length < 4) {
                    forecastFive[baseDay] = {list: [], main: {}};
                    forecastFive[baseDay].main.temperatures = {min: null, max: null};
                } else {
                    return;
                }
            }

            if (forecastFive[baseDay].main.temperatures.max == null || forecastData.main.temp > forecastFive[baseDay].main.temperatures.max) {
                forecastFive[baseDay].main.temperatures.max = forecastData.main.temp;
            }
            if (forecastFive[baseDay].main.temperatures.min == null || forecastData.main.temp < forecastFive[baseDay].main.temperatures.min) {
                forecastFive[baseDay].main.temperatures.min = forecastData.main.temp;
            }

            if (hour >= 12 && hour <= 14) {
                forecastFive[baseDay].main = Object.assign(forecastFive[baseDay].main, new Forecast(forecastData, i18n, city));
                delete forecastFive[baseDay].main.temperature;
            }

            forecastFive[baseDay].list.push(new Forecast(forecastData, i18n, city));
        }
    });

    currentWeather.main.temperatures.min = currentMin;
    currentWeather.main.temperatures.max = currentMax;

    return {localisation: localisation, currentWeather: currentWeather, forecastFive: forecastFive};
};

function Forecast(forecastData, i18n, city) {
    const _ = i18n._;
    var baseTime = new Date((forecastData.dt + (3600 * city.utc)) * 1000);

    // Some icons are identical:
    // - icon 03x must be renamed 02x
    // - icon 10x must be renamed 09x
    forecastData.weather[0].icon = forecastData.weather[0].icon.replace("03", "02").replace("10", "09")

    return {
        date: forecastData.dt,
        wind: forecastData.wind ? forecastData.wind.speed : null,
        humidity: forecastData.main.humidity,
        pressure: forecastData.main.pressure,
        weather: {
            iconId: forecastData.weather ? forecastData.weather[0].icon : null,
            status: forecastData.weather ? forecastData.weather[0].description : null
        },
        rain: getRainValue(forecastData),
        temperature: forecastData.main.temp,
        hour: baseTime.getUTCHours(),
        day: baseTime.getUTCDay()
    }
}

function getRainValue(data) {
    if (typeof data.rain !== 'undefined') {
        if (typeof data.rain["3h"] !== 'undefined') {
            return data.rain["3h"];
        }
    }
    return 0;
}
