/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var moment = require('moment');
var config = require('@qwant/config');
config.import('iot_cantina');
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});


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
    const request = values[2]
    console.log(request);
    return new Promise(function (resolve, reject) {
      if (values && values[0]) {
        // when generating our IA, we chose a "strict" trigger with "bikes" as the keyword.
        // It means it will trigger the IA if the query is strictly equal to "bikes", and nothing else.
        // So when using a "strict" trigger, you don't need to check values[2] as it doesn't exist.
        const requestUser = values[2]
        const apiAddress = config_get('iot_cantina.api').iotAPI
        // Declare redisTools
        const CACHE_KEY = 'iot-cantina-cache';
        const CACHE_EXPIRE = 7200;
        const redisTools = require('../../redis_tools');
        redisTools.initRedis();

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
            console.log(api_request)
            // Defines the structure of the answer
            var structure = {
              "result": [
                {
                  "collection": "String",
                  "id": "String",
                  "content":{
                    "@_bread_code": "String",
                    "@_bread_info": "String",
                    "@_bread_label": "String",
                    "@_dessert_code": "String",
                    "@_dessert_info": "String",
                    "@_dessert_label": "String",
                    "@_dish_order": "String",
                    "@_garnish_code": "String",
                    "@_garnish_info": "String",
                    "@_garnish_label": "String",
                    "@_main_dish_code": "String",
                    "@_main_dish_alternative": "String",
                    "@_main_dish_info": "String",
                    "@_main_dish_label": "String",
                    "@_others_info": "String",
                    "@_others_label": "String",
                    "@_starter_alternative": "String",
                    "@_starter_label": "String",
                    "@_starter_info": "String",
                    "@_starter_code": "String",
                    "@_dairy_code": "String",
                    "@_dairy_info": "String",
                    "@_dairy_label": "String",
                    "@_snack_code": "String",
                    "@_snack_info": "String",
                    "@_snack_label": "String",
                    "@_type": "String",
                    "@_sector": "String",
                    "@_date_opening": "String",
                    "@_date_meal": "String",
                    "@_date_day": "String",
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
              "@_aggregations": {}
            };
            // Call the API and get back data
            apiCaller.call(api_request, structure, proxyURL, this.timeout, redisTools).then((apiRes) => {
              // format date
              apiRes.result.forEach(function(data) {
                data.content.date_meal = moment(data.content.date_meal).locale(language).format('dddd Do MMM YYYY');
              });
              console.log(apiRes);
              redisTools.saveToCache(CACHE_KEY, apiRes.result, CACHE_EXPIRE);
              apiRes.fromCache = false;
              resolve(apiRes.result);
            }).catch((error) => {
              reject(error);
            });
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
    return _("iot_cantina", "iot_cantina");
  },

  /**
   * (OPTIONAL/NEEDED)
   * Otherwise, if your name doesn't need to be translated, use this attribute.
   */

  name: "iot_cantina",

  /**
   * (OPTIONAL/NEEDED)
   * If your keyword needs to be translated, use this function getKeyword().
   * @returns keyword translated
   */
  getKeyword: function (i18n) {
    const _ = i18n._;
    return _("datacantina", "iot_cantina");
  },

  /**
   * (OPTIONAL/NEEDED)
   * Otherwise, if your keyword doesn't need to be translated, use this attribute.
   * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
   */

  keyword: "datacantina",

  /**
   * (OPTIONAL)
   * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
   */

  script: "index",

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

  timeout: 500,

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
