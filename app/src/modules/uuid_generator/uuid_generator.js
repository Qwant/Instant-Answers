/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var uuidv4 = require('uuid/v4');

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
        return new Promise.resolve(uuidv4());
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("UUID Generator", "uuid_generator");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(new|(random|generate)( new)?) (guid|uuid)",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "uuidGenerator.js",

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

    timeout: 100,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 0
};
