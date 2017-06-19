/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */
var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var CountryData = require('./Data/Capital_country')();
var keyCountry = Object.keys(CountryData);
var Country = "(?:" +keyCountry.join("|") + ")";
var util = require("util");
var request = require("request");

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

    getData: function (values, proxyURL, language) {
        return new Promise(function (resolve, reject) {
            console.log(keyCountry);
            var matchCapital = values[3].toLowerCase();
            var matchCountry = values[8];
            var resultData = Object.values(CountryData);
            var CountryCap = CountryData[matchCountry];
            var CountryCapPop = resultData[1];
            var CountryCapPopInit = 0;
            var CountryCapDens = resultData[2];
            var CountryCapHour = resultData[3];
            var CountryCapSup = resultData[4];
            var CountryCapPic = resultData[5];
            console.log(CountryCapPop);
            console.log(resultData);
            var _URL = "https://api.qwant.com/api/search/ia?safesearch=1&locale=%s&q=%s&t=all&lang=%s";
            var _QUERY = CountryCap;
            var _MODULE = matchCapital;

            var knowledgeApiUrl = util.format(_URL, "en_gb", encodeURIComponent(_QUERY), "en_gb");
            var requestParams = {
                url: knowledgeApiUrl,
                timeout: 3000,
                headers: {
                    'User-Agent': 'Qwantify'
                }
            };

            if (proxyURL != '') {
                requestParams.proxy = proxyURL;
            }

            request(requestParams, function (error, response) {
                if (error) {
                    logger.error("bad knowledge response", {module: "_MODULE"});
                    reject(error);
                    return;
                }

                var knowledgeResponse = {};

                try {
                    var parsedBody = JSON.parse(response.body);
                    knowledgeResponse.data = parsedBody.data.result.items[0].data[0]
                } catch (e) {
                    e.msg = response.body;
                    throw e;
                }
                knowledgeResponse.Country = {
                    matchCountry: matchCountry,
                    CountryCap: CountryCap,
                    CountryCapPop: CountryCapPop,
                    CountryCapPopInit: CountryCapPopInit,
                    CountryCapDens: CountryCapDens,
                    CountryCapHour: CountryCapHour,
                    CountryCapSup: CountryCapSup,
                    CountryCapPic: CountryCapPic
                };
                resolve(knowledgeResponse);
            });


        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("Capital", "capital");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Capital",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function () {

        return "(Capital|capitale)(\\s)((of?)(\\s))?("+Country+")";


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

    trigger: "any",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     * 			- g : global
     * 			- m : multi-line
     * 			- i : insensitive
     */

    flag: "i",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 10000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800,

    /**
     * (NEEDED)
     * canBeDisplayedVertically : This attribute is used for the "web" tab only. If your IA can be displayed
     * vertically, like this https://www.qwant.com/?q=m%C3%A9t%C3%A9o%20nice&t=web, toggle it as true.
     * If not, like this https://www.qwant.com/?q=2*5&t=web, toggle it as false.
     */

    canBeDisplayedVertically: false,
    script: "script"
};
