const tools = require('./api_caller_tools');
const Promise = require("bluebird");
const request = require("request");
const winston = require('winston');
const logger = winston.loggers.get('logger');
const Url = require('url');
const NUMBER_TIMEOUT_BY_HOUR_ALLOWED = 10;

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
    call: function (apiRequest, structure, proxyURL, timeout, redisTools) {
        return new Promise(function (resolve, reject) {
            let requestParams = {
                url: apiRequest,
                timeout: parseInt(timeout),
                followAllRedirects: true
            };
            let host = tools.isValidURL(apiRequest);
            if (host && redisTools) {
                redisTools.checkAPI(host).then((res) => {
                    if (!res) {
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
                                redisTools.callAPITimeout(Url.parse(apiRequest).hostname, NUMBER_TIMEOUT_BY_HOUR_ALLOWED);
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
                            if (apiResponse && apiResponse.error) {
                                logger.error(apiResponse.error);
                            }
                        } catch(e) {
                            logger.error("error API message: " + response.body);
                            reject(e);
                            return;
                        }

                        if(!tools.hasValidStructure(apiResponse, structure, apiRequest)) {
                            redisTools.blacklistAPI(response.request.uri.host, "Invalid structure");
                            logger.error("Reject API response [" + apiRequest + "], bad structure", {"module": "api-caller"});
                            reject("Reject API response [" + apiRequest + "], bad structure", {"module": "api-caller"});
                            return;
                        }
                        resolve(apiResponse);
                    });
                }).catch((err) => {
                    reject(err);
                });;
            } else {
                reject("Invalid URL.");
            }
        });
    }
};
