/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");

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
        return new Promise(function (resolve, reject) {
            if(values[2]) {
                resolve(values[2]);
            } else {
                resolve("World");
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
        return _("Hello world", "demo");
    },

	/**
	 * (OPTIONAL/NEEDED)
	 * Otherwise, if your name doesn't need to be translated, use this attribute.
	 */

	name: "Hello world",

    /**
	 * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */

    getKeyword: function (i18n) {
    	console.log(i18n);
        const _ = i18n._;
        return _("Hello", "demo");
    },

	/**
	 * (OPTIONAL/NEEDED)
	 * Otherwise, if your keyword doesn't need to be translated, use this attribute.
	 * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
	 */

	keyword: "hello",

    /**
	 * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "hello_world",

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

    timeout: 3000,

	/**
	 * (NEEDED)
	 * cache : Duration of the data cached (in seconds)
	 */

    cache: 3600 * 3
};


