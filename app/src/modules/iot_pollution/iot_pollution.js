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
config.import('iot_pollution');
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
          const apiAddress = config_get('iot_pollution.api').iotAPI

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
                "@_content": {
                  "@_AreaClassification": "String",
                  "@_Code": "String",
                  "@_Country": "String",
                  "@_CountryCode": "String",
                  "@_Location": "String",
                  "@_Name": "String",
                  "@_NO2": "number",
                  "@_Name": "String",
                  "@_O3": "number",
                  "@_OrganisationUrl": "String",
                  "@_PM10": "number",
                  "@_PM2": "number",
                  "@_SO2": "number",
                  "@_StationClassification": "String",
                  "@_X": "number",
                  "@_Y": "number",
                  "@_date": "String",
                  "@_geo_loc": {
                    "@_lat": "number",
                    "@_lon": "number",
                  },
                },
                "@_headers": "object",
                "meta": {
                  "active": "boolean",
                  "author": "String",
                  "updater": "String",
                  "updatedAt": "String",
                  "deletedAt": "String",
                  "createdAt": "number",
                }
              }
            ],
            "@_aggregations": {
              "NO2": {
                "value": "number",
              },
              "O3": {
                  "value": "number",
              },
              "SO2": {
                  "value": "number",
              },
              "PM2.5": {
                  "value": "number",
              },
              "PM10": {
                  "value": "number",
              }
            }
          };
          // Call the API and get back data
          apiCaller.call(api_request, structure, proxyURL, this.timeout, redisTools).then((apiRes) => {
            
            Object.keys(apiRes.aggregations).map(aggregation => {
              return apiRes.aggregations[aggregation].value = apiRes.aggregations[aggregation].value ? Number.parseFloat(apiRes.aggregations[aggregation].value).toFixed(2) : null;
            });
            apiRes.result.forEach(function(data) {
              data.content.date = moment(data.content.date).locale(language).format('dddd Do MMM YYYY');
              });
            apiRes.fromCache = false;
            resolve({result: apiRes.result, aggregations: apiRes.aggregations});
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

    name: "iot_pollution",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("datapollution", "iot_pollution");
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

    flag: "i",

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

    order: 11
};
