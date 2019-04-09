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
config.import('iot_events');
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
      const apiAddress = config_get('iot_events.api').iotAPI

      return new Promise(function (resolve, reject) {
              if (values && values[0]) {
                  // when generating our IA, we chose a "strict" trigger with "bikes" as the keyword.
                  // It means it will trigger the IA if the query is strictly equal to "bikes", and nothing else.
                  // So when using a "strict" trigger, you don't need to check values[2] as it doesn't exist.
                  const requestUser = values[2]
                  // Declare redisTools

                  // Declares the API Caller
                  var apiCaller = require('../../api_caller');
                  // Your request
                  var api_request = apiAddress+requestUser;
                  // Defines the structure of the answer
                  var structure = {
                      "result": [
                          {
                            "collection": "String",
                            "id": "String",
                            "content":{
                              "@_date_start": "String",
                              "@_date_end": "String",
                              "@_pricing_info": "String",
                              "@_city": "String",
                              "@_description": "String",
                              "@_free_text": "String",
                              "@_title": "String",
                              "@_address": "String",
                              "@_department": "String",
                              "@_geo_loc": {
                                "lat": "number",
                                "lon": "number"
                              },
                              "@_image": "String",
                              "@_image_thumb": "String",
                              "@_lang": "String",
                              "@_link": "String",
                              "@_placename": "String",
                              "@_region": "String",
                              "@_space_time_info": "String",
                              "@_timetable": "String",
                              "@_uid": "String",
                              "@_updated_at": "String",
                              "@_tags": "String",
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
                        data.content.date_start = moment(data.content.date_start).locale(language).format('DD MMM YYYY');
                        data.content.date_end = moment(data.content.date_end).locale(language).format('DD MMM YYYY');
                      });
                      redisTools.saveToCache(CACHE_KEY, apiRes.result, CACHE_EXPIRE);
                      apiRes.fromCache = false;
                      resolve(apiRes.result);
                  }).catch((error) => {
                      reject(error);
                  });
              } else {
                  reject("Couldn't process query.")
              }
          });
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "iot_events",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("dataevents", "iot_events");
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

    order: 11
};
