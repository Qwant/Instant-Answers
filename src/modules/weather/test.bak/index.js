require('../../../binder')(); // require binder for easy access to config properties
var config = require('@qwant/config');
config.import('weather');

Object.keys(config).forEach(function(elem) {
	config_set(elem, config[elem]);
});


const proxyquire = require('proxyquire');
const util = require('util');
const sinon = require('sinon');
const assert = require('assert');

const i18nMock = require('./mocks/i18n_mock');
const elasticMock = require('./mocks/elastic_mock');
const geoMock = require('./mocks/geo_mock');
const forecastMock = require('./mocks/forecast_mock');
const qwantCastMock = require('./mocks/qwant_cast');
const lunaWeather = require('./fake_data/luna_weather.json');
/* init request mock with matching url and data */
const requestMock = require('./mocks/simple_request_mock');
const weatherRequestMock = requestMock.mock({url : '/data/2.5/weather'}, lunaWeather.current);
	requestMock.mock({url : '/data/2.5/forecast'}, lunaWeather.forecast);

/* init  */
const geoSolver = proxyquire('../geocoder/geo_solver', {'elasticsearch':elasticMock});
/* init weather with mock */
const Weather = proxyquire('../weather', {'geoSolver':geoMock, 'request' : weatherRequestMock, '@qwant/front-i18n' : i18nMock, './forecast':forecastMock, './drivers/qwantCast.js' : qwantCastMock});


describe('Weather', function() {
	describe('Geo solver', function () {
		it('should return a city object', function (done) {
			let geoPromise = geoSolver.solve('luna');
			geoPromise.then(function (data) {
				assert(data.latitude  === 100.6 && data.longitude === 94.4);
				done();
			});
		});
	});

	describe('Luna current weather', function () {
		it('should return weather for luna', function (done) {
			let wetherPromise = Weather.getData('luna', {}, 'en_GB');
			wetherPromise.then(function (data) {
				assert(data.description === 'overcast clouds' && data.main === 'clouds');
				done();
			});
		});
	});
});


