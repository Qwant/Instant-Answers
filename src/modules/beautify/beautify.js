var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var S = require('string');
var request = require("request");

var commonEntities = [
    {char : "<", html : "&lt;"},
    {char : ">", html : "&gt;"},
    {char : '"', html : "&quot;"},
    {char : "&", html : "&amp;"},
    {char : "{", html : "%7B"},
    {char : "}", html : "%7D"}
];

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
      console.log("===> BEAUTIFY("+values[1]+")");
        return new Promise(function (resolve, reject) {
            S.extendPrototype();
            var stringToBeautify = values[1];
            commonEntities.forEach(function(entity) {
              stringToBeautify = stringToBeautify.replace(entity.html, entity.char);
            });
            if(
              (stringToBeautify.startsWith('{') && stringToBeautify.endsWith('}'))
                ||
              (stringToBeautify.startsWith('[') && stringToBeautify.endsWith(']'))
            ){
                var url = "https://jsonformatter.curiousconcept.com/process";
                var standards = {
                  RFC_4627: 1,
                  RFC_7159: 2,
                  ECMA_404: 3,
                  DONT_VALIDATE: 0
                }
                var templates = {
                  FOUR_SPACES : 0,
                  THREE_SPACES : 1,
                  TWO_SPACES : 2,
                  COMPACT : 3,
                };
                var form = {
                  jsondata:stringToBeautify,
                  jsonstandard:standards.RFC_4627,
                  jsontemplate:templates.TWO_SPACES
                };
                var requestParams = {
                    url: url,
                    timeout: 5*1000,
                    form:form
                };

                 if (proxyURL !== '') {
                     requestParams.proxy = proxyURL;
                 }

                 console.log("requestParams",requestParams);

                 request.post(url, requestParams,function (error, response) {
                   if(error){
                     console.log("error",error);
                     reject(error);
                   }
                   var json = JSON.parse(response.body);
                   console.log("json.result",json.result);
                   resolve(json.result);
                 });
            } else {
              reject('unknown string format')
            }
            // S.restorePrototype();
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */
    getName: function () {
        return _("Beautify", "beautify");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Beautify",


    /**
     * (NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(({.+})|(\\[.+\\]))",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "beautify",

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

    timeout: 10*1000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 200


};
