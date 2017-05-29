const city = require('../fake_data/city.json');
const country = require('../fake_data/country.json');

module.exports = {
	Client : function(){
		return {
			search: function (options) {
				return new Promise(function (done) {
					if(options.index === 'geocode_countries') {
						done(country)
					} else {
						done(city)
					}
				})
			}
		}
	}
}