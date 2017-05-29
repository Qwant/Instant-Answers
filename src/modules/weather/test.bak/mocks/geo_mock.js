const lunaCity = require('../fake_data/city.json')

module.exports = {

	solve: function (options) {
		return new Promise(function(done) {
			done({
				latitude: lunaCity.latitude,
				longitude: lunaCity.longitude,
			})
		})
	}
}