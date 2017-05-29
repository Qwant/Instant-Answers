var math = require('mathjs');
var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

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

    getData: function (values) {
        return new Promise(function (resolve, reject) {
            if(!isNaN(values[0])) {
                reject("Don't allow function identity");
            } else {
                values[0] = values[0].replace("×","*");
                values[0] = values[0].replace("÷","/");
                try {
                    var response = math.eval(values[0]);
                    if (response === Infinity) {
                        throw 500;
                    } else {
                        resolve(response);
                    }
                } catch (e) {
                    reject("Your formula isn't valid");
                }
            }
        });
    },

    /**
     * @returns the tab name translated
     */

    getName: function () {
        return _("calculator", "calculator");
    },

    /**
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(\\+|\\-|\\*|\\/|×|÷|[0-9]|\\(|\\)|\\.|\\s|E|PI|cos|sin|sqrt|log|tan|exp|\\^|e)*",

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

    flag: "",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 30,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 200
};