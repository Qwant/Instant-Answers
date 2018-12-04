var Promise = require("bluebird");
var winston = require('winston');
var logger = winston.loggers.get('logger');

function callQwantCastApi (apiQwantCastRequestUrl, proxyURL) {
	return new Promise(function(resolve, reject){
		var request = require("request");

		var requestParams = {
            url: apiQwantCastRequestUrl,
            timeout: 3000
        };

        if (proxyURL !== '' && (process.env.ENV === 'plive' || process.env.ENV === 'prod' )) {
            requestParams.proxy = proxyURL;
        }

        request(requestParams, function(error, response) {
			if (error) {
                logger.error(JSON.stringify(requestParams), {module : "weather"});
                logger.error("Response: " + response, {module : "weather"});
                logger.error("Error from QwantCast API", {module : "weather"});
                reject(error);
                return;
            }

            var qwantCastResponse = null;

            try {
		        qwantCastResponse = JSON.parse(response.body);
		    } catch(e) {
		        e.msg = response.body;
		        throw e;
		    }

            resolve(qwantCastResponse);
        })
	});
}

exports.callQwantCastApi = callQwantCastApi;