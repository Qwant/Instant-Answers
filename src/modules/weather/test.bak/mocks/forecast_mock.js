const Promise = require('bluebird');
const forecastData = require('../fake_data/luna_weather.json').forecast;

module.exports = () => {
	return new Promise((resolve) => {
		resolve(forecastData.city.list[0].weather[0])
	})
};