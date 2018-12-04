/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var winston = require('winston');
var logger = winston.loggers.get('logger');
var accounting = require('accounting');
var config = require('@qwant/config');
var utils = require('../../utils.js');
config.import('currency_converter'); // language config file (config/currency_converter.yml)
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});
var rates;
const TIMEOUT_CURRENCY_CONVERTER = 5000;
const CACHE_CURRENCY_CONVERTER = 3600;
const CACHE_KEY = "cache-currency_converter";

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


    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            const redisTools = require('../../redis_tools');
            redisTools.initRedis();
            var currencies = require('./currencies/currencies')(i18n);
            var crypto_currencies = require('./currencies/cryptocurrencies')(i18n);
            var apiCaller = require('../../api_caller');

            function formatArray(res) {
                var separators = utils.countSeparators(res[1])
                var tmpres = res[1]
                if (utils.separatorsCross(tmpres)) {
                    reject("Error: number format not handled")
                }
                if (separators.points === 0 && separators.comas === 1) {
                    tmpres = parseFloat(tmpres.replace(/,/g, '.'))
                } else if (separators.points === 0 && separators.comas > 1) {
                    tmpres = parseFloat(tmpres.replace(/,/g, ''))
                } else if (separators.points === 1 && separators.comas > 1) {
                    tmpres = parseFloat(tmpres.replace(/,/g, ''))
                } else if (separators.points > 1 && separators.comas === 1) {
                    tmpres = parseFloat(tmpres.replace(/,/g, '_').replace(/\./g, '').replace(/_/g, '.'))
                } else if (separators.points > 1 && separators.comas === 0) {
                    tmpres = parseFloat(tmpres.replace(/\./g, ''))
                } else if (separators.points === 1 && separators.comas === 1) {
                    if (tmpres.indexOf('.') > tmpres.indexOf(',')) {
                        tmpres = parseFloat(tmpres.replace(/,/g, ''))
                    } else {
                        tmpres = parseFloat(tmpres.replace(/,/g, '_').replace(/\./g, '').replace(/_/g, '.'))
                    }
                }

                if (!isNaN(res[3])) {
                    res[1] = tmpres
                    res[1] = parseFloat(res[1]) + parseFloat('0.' + res[3]);
                    if (res[4]) {
                        res[3] = res[4];
                        res.splice(4,4);
                    }
                } else if (res[1] && isNaN(tmpres)) {
                    if (res[2] === "") {
                        res[2] = res[1];
                        res[1] = 1;
                    } else {
                        var tmp = res[1];
                        res[1] = res[2];
                        res[2] = tmp;
                    }
                } else {
                    res[1] = tmpres
                }

                return res;
            }

            function findCurrencies(res) {
                var constants = Object.assign(currencies["constants"], crypto_currencies["constants"]);
                for (var i = 2; i <= 3; ++i) {
                    if (res[i] === "$") res[i] = "\\$";
                    if (res[i].toLowerCase() === "xbt") res[i] = "BTC"
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

            function isCryptoCurrency(currency) {
                var constants = crypto_currencies["constants"];
                if (Object.keys(constants).indexOf(currency) !== -1) {
                    return true
                }
                return false;
            }

            function saveToCache(apiRes) {
                redisTools.saveToCache(CACHE_KEY, apiRes, CACHE_CURRENCY_CONVERTER);
            }

            function getCryptoRates(base, to) {
                var api_request = config_get('currency_converter.cryptonator.url') + base + '-' + to;
                var structure = {
                    "ticker": {
                        "base": "String",
                        "target": "String",
                        "price": "String",
                        "volume": "String",
                        "change": "String"
                    },
                    "timestamp": "number",
                    "success": "boolean",
                    "error": "String"
                }

                return apiCaller.call(api_request, structure, proxyURL, TIMEOUT_CURRENCY_CONVERTER, redisTools).then(function(apiRes) {
                    var date = new Date(apiRes["timestamp"] * 1000);
                    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

                    var res = {
                        "base": apiRes["ticker"]["base"],
                        "date": date,
                        "rates": {}
                    };

                    res['rates'][to] = parseFloat(apiRes["ticker"]["price"]);

                    return res;
                })
            }

            function convertRates(base, rates) {
                var newBase = rates[base]; // if 1 EUR = 0.68 USD, newBase = 0.68
                var newRates = {}
                Object.keys(rates).forEach(function(rate) {
                    newRates[rate] = parseFloat(rates[rate] / newBase);
                })
                return newRates
            }

            function initRates() {
                var api_request = config_get('currency_converter.fixer.url') + config_get('currency_converter.fixer.access_key')
                var structure = {
                    "success": "boolean",
                    "timestamp": "number",
                    "base": "String",
                    "date": "String",
                    "rates": {
                        "AED": "number",
                        "AFN": "number",
                        "ALL": "number",
                        "AMD": "number",
                        "ANG": "number",
                        "AOA": "number",
                        "ARS": "number",
                        "AUD": "number",
                        "AWG": "number",
                        "AZN": "number",
                        "BAM": "number",
                        "BBD": "number",
                        "BDT": "number",
                        "BGN": "number",
                        "BHD": "number",
                        "BIF": "number",
                        "BMD": "number",
                        "BND": "number",
                        "BOB": "number",
                        "BRL": "number",
                        "BSD": "number",
                        "BTC": "number",
                        "BTN": "number",
                        "BWP": "number",
                        "BYN": "number",
                        "BYR": "number",
                        "BZD": "number",
                        "CAD": "number",
                        "CDF": "number",
                        "CHF": "number",
                        "CLF": "number",
                        "CLP": "number",
                        "CNY": "number",
                        "COP": "number",
                        "CRC": "number",
                        "CUC": "number",
                        "CUP": "number",
                        "CVE": "number",
                        "CZK": "number",
                        "DJF": "number",
                        "DKK": "number",
                        "DOP": "number",
                        "DZD": "number",
                        "EGP": "number",
                        "ERN": "number",
                        "ETB": "number",
                        "EUR": "number",
                        "FJD": "number",
                        "FKP": "number",
                        "GBP": "number",
                        "GEL": "number",
                        "GGP": "number",
                        "GHS": "number",
                        "GIP": "number",
                        "GMD": "number",
                        "GNF": "number",
                        "GTQ": "number",
                        "GYD": "number",
                        "HKD": "number",
                        "HNL": "number",
                        "HRK": "number",
                        "HTG": "number",
                        "HUF": "number",
                        "IDR": "number",
                        "ILS": "number",
                        "IMP": "number",
                        "INR": "number",
                        "IQD": "number",
                        "IRR": "number",
                        "ISK": "number",
                        "JEP": "number",
                        "JMD": "number",
                        "JOD": "number",
                        "JPY": "number",
                        "KES": "number",
                        "KGS": "number",
                        "KHR": "number",
                        "KMF": "number",
                        "KPW": "number",
                        "KRW": "number",
                        "KWD": "number",
                        "KYD": "number",
                        "KZT": "number",
                        "LAK": "number",
                        "LBP": "number",
                        "LKR": "number",
                        "LRD": "number",
                        "LSL": "number",
                        "LTL": "number",
                        "LVL": "number",
                        "LYD": "number",
                        "MAD": "number",
                        "MDL": "number",
                        "MGA": "number",
                        "MKD": "number",
                        "MMK": "number",
                        "MNT": "number",
                        "MOP": "number",
                        "MRO": "number",
                        "MUR": "number",
                        "MVR": "number",
                        "MWK": "number",
                        "MXN": "number",
                        "MYR": "number",
                        "MZN": "number",
                        "NAD": "number",
                        "NGN": "number",
                        "NIO": "number",
                        "NOK": "number",
                        "NPR": "number",
                        "NZD": "number",
                        "OMR": "number",
                        "PAB": "number",
                        "PEN": "number",
                        "PGK": "number",
                        "PHP": "number",
                        "PKR": "number",
                        "PLN": "number",
                        "PYG": "number",
                        "QAR": "number",
                        "RON": "number",
                        "RSD": "number",
                        "RUB": "number",
                        "RWF": "number",
                        "SAR": "number",
                        "SBD": "number",
                        "SCR": "number",
                        "SDG": "number",
                        "SEK": "number",
                        "SGD": "number",
                        "SHP": "number",
                        "SLL": "number",
                        "SOS": "number",
                        "SRD": "number",
                        "STD": "number",
                        "SVC": "number",
                        "SYP": "number",
                        "SZL": "number",
                        "THB": "number",
                        "TJS": "number",
                        "TMT": "number",
                        "TND": "number",
                        "TOP": "number",
                        "TRY": "number",
                        "TTD": "number",
                        "TWD": "number",
                        "TZS": "number",
                        "UAH": "number",
                        "UGX": "number",
                        "USD": "number",
                        "UYU": "number",
                        "UZS": "number",
                        "VEF": "number",
                        "VND": "number",
                        "VUV": "number",
                        "WST": "number",
                        "XAF": "number",
                        "XAG": "number",
                        "XAU": "number",
                        "XCD": "number",
                        "XDR": "number",
                        "XOF": "number",
                        "XPF": "number",
                        "YER": "number",
                        "ZAR": "number",
                        "ZMK": "number",
                        "ZMW": "number",
                        "ZWL": "number"
                    }
                };

                return apiCaller.call(api_request, structure, proxyURL, TIMEOUT_CURRENCY_CONVERTER, redisTools);
            }

            function getMixedRates(from, to, isFromCrypto) {
                if (isFromCrypto) {
                    var apiCryptoPromise = getCryptoRates(from, "EUR");
                } else {
                    var apiCryptoPromise = getCryptoRates("EUR", to);
                }

                return apiCryptoPromise.then(function(apiCryptoRes) {
                    if (isFromCrypto) {
                        if (to === "EUR")
                            var apiFixerPromise = new Promise(function(resolve, reject) { resolve({rates:{"EUR": 1}}); });
                        else
                            var apiFixerPromise = getRates(to);
                    } else {
                        if (from === "EUR")
                            var apiFixerPromise = new Promise(function(resolve, reject) { resolve({rates:{"EUR": 1}}); });
                        else
                            var apiFixerPromise = getRates(from);
                    }

                    return apiFixerPromise.then(function(apiFixerRes) {
                        var res = {
                            "base": from,
                            "date": apiCryptoRes["date"],
                            "rates": {}
                        };

                        res["rates"][to] = apiCryptoRes["rates"][(isFromCrypto ? "EUR" : to)] / apiFixerRes["rates"]["EUR"];

                        return res;
                    });
                })
            }

            function getRates(base) {
                var apiRes = rates
                if (base !== "EUR" && rates && rates['success']) {
                    apiRes = {
                        "success": rates["success"],
                        "timestamp": rates["timestamp"],
                        "base": base,
                        "date": rates["date"],
                        "rates": convertRates(base, rates["rates"])
                    };
                }

                return new Promise(function (resolve, reject) {
                    resolve(apiRes);
                });
            }

            function pullApi(from, to) {
                var apiPromise

                if (from.toLowerCase() === to.toLowerCase()) {
                    var date = new Date();
                    date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

                    var res = {
                        "base": from,
                        "date": date,
                        "rates": {}
                    };

                    res['rates'][to] = 1;

                    apiPromise = new Promise(function(resolve, reject) { resolve(res); });
                } else {
                    var isFromCrypto = isCryptoCurrency(from);
                    var isToCrypto = isCryptoCurrency(to);

                    if (isFromCrypto && isToCrypto) {
                        apiPromise = getCryptoRates(from, to);
                    } else if (isFromCrypto || isToCrypto) {
                        apiPromise = getMixedRates(from, to, isFromCrypto);
                    } else {
                        apiPromise = getRates(from)
                    }
                }

                return apiPromise.then(function(apiRes){
                    return apiRes;
                })
            }

            function convertCurrency(rates, amount, from, to) {
                var isFromCrypto = isCryptoCurrency(from);
                var isToCrypto = isCryptoCurrency(to);

                var currencies_from = (isFromCrypto ? crypto_currencies : currencies)
                var currencies_to = (isToCrypto ? crypto_currencies : currencies)

                if (from === to) {
                    var rate = 1;
                } else {
                    var rate = rates["rates"][to];
                }

                var converted = amount * rate;
                var plural = 0;
                if (amount > 1) plural = 1;
                var from_label = currencies_from["labels_symbols"][from][plural];
                var from_symbol = currencies_from["labels_symbols"][from][2];
                plural = 0;
                if (converted > 1) plural = 1;
                var to_label = currencies_to["labels_symbols"][to][plural];
                var to_symbol = currencies_to["labels_symbols"][to][2];
                var date

                if (rates["dates"]) {
                    date = rates["dates"]
                } else if (rates["timestamp"]) {
                    date = utils.getDate(rates["timestamp"])
                } else {
                    date = utils.getDate()
                }

                return {
                    amount: accounting.formatNumber(amount, {
                        precision: (utils.countPrecision(amount.toString(), true) > 0) ? utils.countPrecision(amount.toString(), true) : 0,
                        thousand: " "
                    }),
                    from: from,
                    from_label: from_label,
                    from_symbol: from_symbol,
                    to: to,
                    to_label: to_label,
                    to_symbol: to_symbol,
                    rate: rate,
                    result: accounting.formatNumber(converted, {
                        precision: (utils.countPrecision(converted) > 0) ? utils.countPrecision(converted) + 1 : 0,
                        thousand: " "
                    }),
                    lastUpdate: date,
                    fromCache: fromCache
                };
            }

            var res = values;
            res = res.filter(function(n){ return n !== undefined; });

            res = formatArray(res);
            res = findCurrencies(res);

            let ratesPromise;
            let fromCache = false;

            redisTools.getFromCache(CACHE_KEY).then((cached) => {
                if (cached) {
                    ratesPromise = new Promise((resolve, reject) => {
                        fromCache = true;
                        try {
                            cached = JSON.parse(cached);
                        } catch (e) {
                            cached = null;
                        }

                        if (cached) {
                            resolve(cached);
                        } else {
                            logger.error("Couldn't parse cached JSON: " + e, { module: "currency_converter" });
                            reject("Couldn't parse cached JSON.");
                        }
                    });
                } else {
                    ratesPromise = initRates();
                }

                var amount = res[1];
                var from = res[2];
                var to = res[3];

                var promises = [];
                var tmp_promise;

                ratesPromise.then((apiRes) => {
                    if (!fromCache) {
                        saveToCache(apiRes);
                    }

                    rates = apiRes;
                    if (from instanceof Array) {
                        from.forEach(function(k) {
                            if (to instanceof Array) {
                                to = to[0] // only getting the first one, which is prioritary
                            }
                            tmp_promise = pullApi(k, to).then(function(apiRes) {
                                var resArray = [];
                                resArray.push(convertCurrency(apiRes, amount, k, to));
                                return resArray;
                            })
                            promises.push(tmp_promise);
                        })
                    } else {
                        if (to instanceof Array) {
                            to.forEach(function(k) {
                                tmp_promise = pullApi(from, k).then(function(apiRes){
                                    var resArray = [];
                                    if (from instanceof Array) {
                                        from.forEach(function(l) {
                                            resArray.push(convertCurrency(apiRes, amount, l, k));
                                        });
                                    } else {
                                        resArray.push(convertCurrency(apiRes, amount, from, k));
                                    }

                                    return resArray;
                                })
                                promises.push(tmp_promise);
                            })
                        } else {
                            tmp_promise = pullApi(from, to).then(function(apiRes){
                                var resArray = [];
                                resArray.push(convertCurrency(apiRes, amount, from, to));
                                return resArray;
                            });
                            promises.push(tmp_promise);
                        }
                    }

                    Promise.all(promises).then(function(resArray){
                        var res = [];
                        if (resArray instanceof Array) {
                            resArray.forEach(function(arrays){
                                if (arrays instanceof Array){
                                    arrays.forEach(function(arr){
                                        res.push(arr);
                                    });
                                } else if(arrays !== null) {
                                    res.push(arrays);
                                }
                            });
                            if(res.filter((n) => (n !== undefined)).length === 0) {
                                logger.error("Error: API response with null data", {module : "currency_converter"});
                                reject("Error: API response with null data");
                                return;
                            }
                            resolve(res);
                        } else {
                            resolve(resArray);
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("Currency converter", "currency_converter");
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        var currencies = require('./currencies/currencies')(i18n);
        var crypto_currencies = require('./currencies/cryptocurrencies')(i18n);
        var constants = "";

        Object.keys(currencies["constants"]).forEach(function (key) {
            if (constants !== "")
                constants += "|";
            constants = constants + currencies["constants"][key].join("|");
        });

        Object.keys(crypto_currencies["constants"]).forEach(function (key) {
            if (constants !== "")
                constants += "|";
            constants = constants + crypto_currencies["constants"][key].join("|");
        });

        var link_words ="in|to|for|en|pour";

        return "(?:[a-z ]* +)?(?:(?:(" + constants + ")?[ ]*([0-9]*(?:\\.|,)?[0-9]*))|"
            + "(?:([0-9]*(?:\\.|,)*[0-9]*(?:\\.|,)*[0-9]*(?:\\.|,)*[0-9]*(?:\\.|,)*[0-9]*)[ ]*(" + constants + ")?([0-9]*)?)) (?:(?:" + link_words + ") )?(?:("
            + constants + ")?)";
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

    cache: CACHE_CURRENCY_CONVERTER,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    order: 20,
};
