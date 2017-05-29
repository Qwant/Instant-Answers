module.exports = {
	callQwantCastApi : function() {
		return new Promise(function(done) {
			done({data: require('../fake_data/luna_weather.json').forecast.city.list[0]})
		})
	}
};