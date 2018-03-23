/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var winston = require('winston');
var logger = winston.loggers.get('logger');
var _ = require('@qwant/front-i18n')._;
var cachedApi = [];
const TIMEOUT_CURRENCY_CONVERTER = 10800;
const CACHE_CURRENCY_CONVERTER = 10800;

module.exports = {

    /**
     * (NEEDED)
     *	This function uses 3 parameters :
     *	- values : This is an array of values caught by regex.
     *	For example, if you use the keyword "test" with the trigger "start", and you type "test working?",
     *  values would be like this :
     *  	* values[0] = "test working?"
     *  	* values[1] = "test"
     *  	* values[2] = "working?"
     *  But, if you use the trigger "strict", there will be only one value in this array (values[0] = "test working?")
     *  - proxyURL : If you need to call an external API, use the package "request" with proxyURL as value for
     *  "proxy" attribute (you can refer to weather IA to check how to use it properly)
     *  - language : Current language called
     * @returns data to be displayed.
     */


    getData: function (values, proxyURL) {
        return new Promise(function (resolve, reject) {
            var currencies = require('./currencies/currencies')();
            function formatArray(res) {
                if (!isNaN(res[3])) {
                    res[1] = res[1] + (res[3] / 100);
                    if (res[4]) {
                        res[3] = res[4];
                        res.splice(4,4);
                    }
                } else if (res[1] && isNaN(res[1])) {
                    if (res[2] === "") {
                        res[2] = res[1];
                        res[1] = 1;
                    } else {
                        var tmp = res[1];
                        res[1] = res[2];
                        res[2] = tmp;
                    }
                }

                return res;
            }

            function findCurrencies(res) {
                var constants = currencies["constants"];
                for (var i = 2; i <= 3; ++i) {
                    if (res[i] === "$") res[i] = "\\$";
                    if (Object.keys(constants).indexOf(res[i]) === -1) {
                        var results = [];
                        Object.keys(constants).forEach(function(key) {
                            if (constants[key].indexOf(res[i]) !== -1) {
                                results.push(key);
                            } else {
                                var reg = new RegExp("^(?:" + constants[key].join('|') + ")?$", "mi");
                                var ret_regex = reg.exec(res[i]);
                                if (ret_regex) {
                                    results.push(key);
                                }
                            }
                        });
                        if (results.length) {
                            res[i] = (results.length > 1) ? results : results[0];
                        }
                    }
                }

                return res;
            }

            function pullApi(from) {
                var cacheKey = "fixer_" + from;
                var fromCache = false;

                if ((cachedApi[cacheKey] && Object.keys(cachedApi[cacheKey]["data"]).length > 0
                     && (new Date().getTime() - cachedApi[cacheKey]["lastUpdate"]) > (CACHE_CURRENCY_CONVERTER * 1000))
                    || !cachedApi[cacheKey] || Object.keys(cachedApi[cacheKey]["data"]).length === 0)
                {
                    var apiCaller = require('../../api_caller');
                    var api_request = 'http://api.fixer.io/latest?base=' + from;
                    var structure = {
                        "base": "String",
                        "date": "String",
                        "rates": {
                            "AUD": "number",
                            "BGN": "number",
                            "BRL": "number",
                            "CAD": "number",
                            "CHF": "number",
                            "CNY": "number",
                            "CZK": "number",
                            "DKK": "number",
                            "GBP": "number",
                            "HKD": "number",
                            "HRK": "number",
                            "HUF": "number",
                            "IDR": "number",
                            "ILS": "number",
                            "INR": "number",
                            "JPY": "number",
                            "KRW": "number",
                            "MXN": "number",
                            "MYR": "number",
                            "NOK": "number",
                            "NZD": "number",
                            "PHP": "number",
                            "PLN": "number",
                            "RON": "number",
                            "RUB": "number",
                            "SEK": "number",
                            "SGD": "number",
                            "THB": "number",
                            "TRY": "number",
                            "ZAR": "number",
                            "EUR": "number",
                            "USD": "number"
                        }
                    };
                    delete structure["rates"][from];
                    var apiPromise = apiCaller.call(api_request, structure, proxyURL, TIMEOUT_CURRENCY_CONVERTER);
                } else {
                    fromCache = true;
                    var apiPromise = new Promise(function(resolve, reject) { resolve(cachedApi[cacheKey]["data"]); });
                }

                return apiPromise.then(function(apiRes){
                    if (!fromCache) {
                        cachedApi[cacheKey] = [];
                        cachedApi[cacheKey]["data"] = apiRes;
                        cachedApi[cacheKey]["lastUpdate"] = new Date().getTime();
                    }

                    return apiRes;
                });
            }

            function convertCurrency(rates, amount, from, to) {
                if (from === to) {
                    var rate = 1;
                } else {
                    var rate = rates["rates"][to];
                }

                var converted = amount * rate;
                var plural = 0;
                if (amount > 1) plural = 1;
                var from_label = currencies["labels_symbols"][from][plural];
                var from_symbol = currencies["labels_symbols"][from][2];
                plural = 0;
                if (converted > 1) plural = 1;
                var to_label = currencies["labels_symbols"][to][plural];
                var to_symbol = currencies["labels_symbols"][to][2];

                return {
                    amount: amount,
                    from: from,
                    from_label: from_label,
                    from_symbol: from_symbol,
                    to: to,
                    to_label: to_label,
                    to_symbol: to_symbol,
                    rate: rate,
                    result: converted,
                    lastUpdate: rates["date"]
                };
            }

            var res = values;
            res = res.filter(function(n){ return n !== undefined; });
            res.forEach(function(key,i) {
                res[i] = (res[i] !== '' && !isNaN(res[i])) ? parseFloat(res[i]) : res[i];
            });

            res = formatArray(res);
            res = findCurrencies(res);

            var amount = res[1];
            var from = res[2];
            var to = res[3];

            var promises = [];
            var tmp_promise;

            if (from instanceof Array) {
                from.forEach(function(k) {
                    tmp_promise = pullApi(k).then(function(apiRes){
                        var resArray = [];
                        if (to instanceof Array) {
                            to.forEach(function(l) {
                                resArray.push(convertCurrency(apiRes, amount, k, l));
                            });
                        } else {
                            resArray.push(convertCurrency(apiRes, amount, k, to));
                        }

                        return resArray;
                    }).catch(function (err) {
                        console.log(err);
                    });
                    promises.push(tmp_promise);
                });
            } else {
                tmp_promise = pullApi(from).then(function(apiRes){
                    var resArray = [];
                    if (to instanceof Array) {
                        to.forEach(function(l) {
                            resArray.push(convertCurrency(apiRes, amount, from, l));
                        });
                    } else {
                        resArray.push(convertCurrency(apiRes, amount, from, to));
                    }

                    return resArray;
                }).catch(function (err) {
                    console.log(err);
                });
                promises.push(tmp_promise);
            }

            Promise.all(promises).done(function(resArray){
                var res = [];
                if (resArray instanceof Array) {
                    resArray.forEach(function(arrays){
                        if (arrays instanceof Array){
                            arrays.forEach(function(arr){
                                res.push(arr);
                            });
                        } else if(arrays != null) {
                            res.push(arrays);
                        }
                    });
                    if(res.length === 0) {
                        logger.error("Error from fixer.io: API response with null data", {module : "currency_converter"});
                        reject("Error from fixer.io: API response with null data");
                        return;
                    }
                    resolve(res);
                } else {
                    resolve(resArray);
                }

            });
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("Currency converter", "currency_converter");
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function () {
        var currencies = require('./currencies/currencies')();
        var constants = "";

        Object.keys(currencies["constants"]).forEach(function (key) {
            if (constants !== "")
                constants += "|";
            constants = constants + currencies["constants"][key].join("|");
        });

        var link_words = _("in|to|for", "currency_converter");

        return "(?:[a-z ]* +)?(?:(?:(" + constants + ")+[ ]*([0-9]*(?:\\.|,)?[0-9]*))|"
            + "(?:([0-9]+(?:\\.|,)*[0-9]*)[ ]*(" + constants + ")+([0-9]*)?))[ ]+(?:" + link_words + ")?[ ]*(?:("
            + constants + ")+)";
    },

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     * 			start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "strict",
    script: "currency_converter",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     * 			- g : global
     * 			- m : multi-line
     * 			- i : insensitive
     */

    flag: "im",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: TIMEOUT_CURRENCY_CONVERTER,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: CACHE_CURRENCY_CONVERTER
};
