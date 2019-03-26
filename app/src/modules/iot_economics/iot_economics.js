/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
// const request = require("request");
const { lowerCase, trim, take }= require('lodash');
var config = require('@qwant/config');
config.import('iot_economics');
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

const apiRes = [{
    id:"France - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "2.449"], ["2007", "2.425"], ["2008", "0.255"], ["2009", "-2.873"], ["2010", "1.949"], ["2011", "2.193"], ["2012", "0.313"], ["2013", "0.576"], ["2014", "1.014"], ["2015", "1.037"], ["2016", "1.103"], ["2017", "2.335"], ["2018", "1.564"]],
    provider_code:"IMF",
    series_code:"FRA.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}, {
    id:"Germany - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "3.887"], ["2007", "3.367"], ["2008", "0.813"], ["2009", "-5.56"], ["2010", "3.938"], ["2011", "3.72"], ["2012", "0.691"], ["2013", "0.607"], ["2014", "2.177"], ["2015", "1.482"], ["2016", "2.157"], ["2017", "2.456"], ["2018", "1.911"]],
    provider_code:"IMF",
    series_code:"DEU.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}, {
    id:"Italy - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "2.007"], ["2007", "1.474"], ["2008", "-1.05"], ["2009", "-5.482"], ["2010", "1.687"], ["2011", "0.577"], ["2012", "-2.819"], ["2013", "-1.728"], ["2014", "0.114"], ["2015", "0.952"], ["2016", "0.858"], ["2017", "1.502"], ["2018", "1.174"]],
    provider_code:"IMF",
    series_code:"ITA.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}, {
    id:"USA - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "2.855"], ["2007", "1.876"], ["2008", "-0.137"], ["2009", "-2.537"], ["2010", "2.564"], ["2011", "1.551"], ["2012", "2.249"], ["2013", "1.842"], ["2014", "2.452"], ["2015", "2.881"], ["2016", "1.567"], ["2017", "2.217"], ["2018", "2.884"]],
    provider_code:"IMF",
    series_code:"USA.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}, {
    id:"China - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "12.7"], ["2007", "14.2"], ["2008", "9.6"], ["2009", "9.2"], ["2010", "10.606"], ["2011", "9.5"], ["2012", "7.9"], ["2013", "7.8"], ["2014", "7.3"], ["2015", "6.9"], ["2016", "6.72"], ["2017", "6.856"], ["2018", "6.585"]],
    provider_code:"IMF",
    series_code:"CHN.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}, {
    id:"UK - Gross domestic product - Percent change",
    name:"WEO by countries",
    frequency:"annual",
    values:[["2006", "2.548"], ["2007", "2.546"], ["2008", "-0.346"], ["2009", "-4.247"], ["2010", "1.711"], ["2011", "1.645"], ["2012", "1.447"], ["2013", "2.046"], ["2014", "2.948"], ["2015", "2.349"], ["2016", "1.789"], ["2017", "1.656"], ["2018", "1.359"]],
    provider_code:"IMF",
    series_code:"GBR.NGDP_RPCH",
    dataset_code:"WEO",
    date_register:"2019-02-08T12:08:29.633Z",
    unit: "%"
}]

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
          if (values && values[0]) {
            // when generating our IA, we chose a "strict" trigger with "bikes" as the keyword.
            // It means it will trigger the IA if the query is strictly equal to "bikes", and nothing else.
            // So when using a "strict" trigger, you don't need to check values[2] as it doesn't exist.
            const requestUser = values[2]
            // Declare redisTools
            const CACHE_KEY = 'iot-economics-cache';
            const CACHE_EXPIRE = 7200;
            const redisTools = require('../../redis_tools');
            redisTools.initRedis();
            const apiAddress = config_get('iot_economics.api').iotAPI

            // Checking the cache to avoid requesting the API

            redisTools.getFromCache(CACHE_KEY).then((cached) => {
              if (cached) { // we already have a recent answer
                cached = JSON.parse(cached);
                if (cached) {
                  cached.fromCache = true;
                  resolve(cached);
                } else {
                  reject("Error: something went wrong while fetching cached response");
                }
              } else { // no cache
                // Declares the API Caller
                var apiCaller = require('../../api_caller');
                // Your request
                var api_request = apiAddress+requestUser;
                // ?method=post&query={"query": {"match_all": {}}}
                console.log(api_request)
                // Defines the structure of the answer
                var structure = {
                  "requestId": "String",
                  "status": "number",
                  "error": "object",
                  "controller": "String",
                  "action": "String",
                  "collection": "String",
                  "index": "String",
                  "volatile": "object",
                  "result": {
                    "@_took": "number",
                    "@_timed_out": "boolean",
                    "@__shard": "object",
                    "hits": [
                      {
                        "collection": "String",
                        "id": "String",
                        "content":{
                          "@_dataset_code": "String",
                          "@_date_register": "String",
                          "@_frequency": "String",
                          "@_id": "String",
                          "@_name": "String",
                          "@_provider_code": "String",
                          "@_series_code": "String",
                          "@_values": "Array",
                        },
                        "@_headers": "object",
                        "meta": {
                          "active": "boolean",
                          "author": "String",
                          "updater": "String",
                          "updatedAt": "String",
                          "deletedAt": "String",
                          "createdAt": "number"
                        }
                      }
                    ],
                    "total": "number",
                    "max_score": "number"
                    }
                };
                // Call the API and get back data
                //apiCaller.call(api_request, structure, proxyURL, this.timeout, redisTools).then((apiRes) => {
                //request.post({ "headers": "{'content-type' : 'application/json'}", "url": api_request, "body": '{"query": {"match_all": {}}}'}).then((apiRes) => {
                try {
                  console.log(apiRes);
                  const limitedData = take(apiRes, 5)
                  // const datas = getData(apiRes);
                  // const options = getOptions(datas);

                  redisTools.saveToCache(CACHE_KEY, { result: limitedData }, CACHE_EXPIRE);
                  apiRes.fromCache = false;
                  console.log(apiRes);
                  resolve({ result: limitedData });
                } catch(error) {
                  reject(error);
                };
              }
          });
        } else {
            reject("Couldn't process query.")
        }
    });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("iot_economics", "iot_economics");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "iot_economics",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("dataeconomics", "iot_economics");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "dataeconomics",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "iot_economics",

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     * 			start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "start",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     * 			- g : global
     * 			- m : multi-line
     * 			- i : insensitive
     */

    flag: "",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 3600,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    order: 0
};
