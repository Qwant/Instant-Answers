var math = require('mathjs');
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
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            if(!isNaN(values[0])) {
                reject("Don't allow function identity", {module : "calculator"});
            } else {
                values[0] = values[0].toLowerCase();
                values[0] = values[0].replace("×","*");
                values[0] = values[0].replace("÷","/");
                values[0] = values[0].replace("¹", "^1");
                values[0] = values[0].replace("²", "^2");
                values[0] = values[0].replace("³", "^3");
                try {
                    var response = math.eval(values[0]);
                    response = math.format(response, {precision: 14});
                    if(response === 'function') {
                        reject("The query is poorly formulated", {module : "calculator"});
                    }
                    if (response['signatures']) {
                        resolve(0);
                    } else {
                        if (response === Infinity) {
                            throw 500;
                        } else {
                            resolve(response.toString());
                        }
                    }
                } catch (e) {
                    reject("Your formula isn't valid", {module : "calculator"});
                }
            }
        });
    },

    /**
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("calculator", "calculator");
    },

    /**
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(\\+|\\-|\\*|\\/|×|÷|¹|²|³|[0-9]|\\(|\\)|\\.|\\s|E|PI|PHI|cos|sin|sqrt|log|tan|exp|\\^)*",

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

    timeout: 30,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 200,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    order: 0
};