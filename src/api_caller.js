var tools = require('./api_caller_tools');
var Promise = require("bluebird");
var request = require("request");
var winston = require('winston');
var logger = winston.loggers.get('logger');
var Url = require('url');

module.exports = {

    /**
     *  Call an API
     *	This function uses 4 parameters :
     *	- apiRequest: This is the API request URL,
     *  - structure: This is the structure of the data returned by the API,
     *  - proxyURL
     *  - timeout
     * @returns data to be processed.
     */
    call: function (apiRequest, structure, proxyURL, timeout) {
        return new Promise(function (resolve, reject) {
                var requestParams = {
                    url: apiRequest,
                    timeout: timeout
                };

                if(!tools.isAuthorized(apiRequest)) {
                    logger.error('Your API [' + apiRequest + '] is not authorized by Qwant rules.', {"module": "api-caller"});
                    reject('Your API [' + apiRequest + '] is not authorized by Qwant rules.', {"module": "api-caller"});
                    return;
                }

                if (proxyURL !== '') {
                    logger.info("proxyURL: " + proxyURL);
                    requestParams.proxy = proxyURL;
                }

                request(requestParams, function(error, response) {
                    if (error) {
                        if (error.code === 'ETIMEDOUT') {
                            tools.callAPITimeout(Url.parse(apiRequest).hostname);
                            logger.error("The call to the API exceed the timeout [" + apiRequest + "] ", {"module": "api-caller"});
                        } else {
                            logger.error("Bad API call [" + apiRequest + "] ", {"module": "api-caller"});
                        }
                        reject(error);
                        return;
                    }

                    var apiResponse;
                    try {
                        apiResponse = JSON.parse(response.body);
                        if (apiResponse && apiResponse.error)
                            logger.error(apiResponse.error);
                    } catch(e) {
                        logger.error(e);
                        logger.error("error API message: " + response.body);
                        reject(e);
                        return;
                    }

                    if(!tools.hasValidStructure(apiResponse, structure, apiRequest)) {
                        tools.blacklistAPI(response.request.uri.host);
                        logger.error("Reject API response [" + apiRequest + "], bad structure", {"module": "api-caller"});
                        reject("Reject API response [" + apiRequest + "], bad structure", {"module": "api-caller"});
                        return;
                    }
                    resolve(apiResponse);
                });
        });
    }
};

