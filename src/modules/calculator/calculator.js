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
     *		* values[0] = "test working?"
     *		* values[1] = "test"
     *		* values[2] = "working?"
     *  But, if you use the trigger "strict", there will be only one value in this array (values[0] = "test working?")
     *  - proxyURL : If you need to call an external API, use the package "request" with proxyURL as value for
     *  "proxy" attribute (you can refer to weather IA to check how to use it properly)
     *  - language : Current language called
     * @returns data to be displayed.
     */

    getData: function (values) {
        var getNumberWithRadix = this.getNumberWithRadix;
        return new Promise(function (resolve, reject) {
            if(!isNaN(values[0])) {
                reject("Don't allow function identity", {module : "calculator"});
			} else if(/^[a-z]+\s+to/i.test(values[0])) {
                // conversion expression: <base A> to <base B> <number>
				var expression = /^(bin|hex|dec|oct)\s+to\s+(bin|hex|dec|oct)\s+([0-9a-f]+)$/i.exec(values[0]);
				if(!expression) {
					reject("This conversion is invalid", {module : "calculator"});
                } else {
                    var radices = { 'bin': 2, 'oct': 8, 'dec': 10, 'hex': 16 };
                    var sourceRadix = radices[expression[1].toLowerCase()];
                    var targetRadix = radices[expression[2].toLowerCase()];
                    var queryString = getNumberWithRadix(expression[3], sourceRadix);
                    var resultString = getNumberWithRadix(expression[3], sourceRadix, targetRadix);
                    if(sourceRadix != targetRadix && queryString && resultString) {
                        resolve({ query: queryString, result: resultString });
                    } else {
                        reject("This conversion is incoherent", {module : "calculator"});
                    }
				}
            } else {
                values[0] = values[0].toLowerCase();
                values[0] = values[0].replace("×","*");
                values[0] = values[0].replace("÷","/");
                try {
                    var response = math.eval(values[0]);
                    response = math.format(response, {notation: "fixed", precision: 14});
                    response = parseFloat(response); // remove extra zero precision
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

    getName: function () {
        return _("calculator", "calculator");
    },

    /**
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(\\+|\\-|\\*|\\/|×|÷|[0-9a-f]|\\(|\\)|\\.|\\s|E|PI|PHI|cos|sin|sqrt|log|tan|exp|\\^|to|bin|hex|dec|oct)*",

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     *          start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "strict",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     *			- g : global
     *			- m : multi-line
     *			- i : insensitive
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
     * converts the string representation of an integer from one base to another,
     * appending the radix as subscript
     *
     *   number : Input number as a string
     *   sourceRadix : Radix of the input number
     *   targetRadix : Destination radix (can be omitted for no conversion)
     */

    getNumberWithRadix: function (number, sourceRadix, targetRadix = null) {
        if(targetRadix) {
            number = parseInt(number, sourceRadix);
            if(!Number.isFinite(number)) {
                return null;
            }
            number = number.toString(targetRadix);
        } else {
            targetRadix = sourceRadix;
        }
        var radix = '';
        while(targetRadix > 0) {
            radix = String.fromCharCode(0x2080 + targetRadix%10)+radix;
            targetRadix = Math.floor(targetRadix / 10);
        }
        return number+radix;
    }
};
