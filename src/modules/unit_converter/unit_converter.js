var math = require('mathjs');
var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

var binary = require('./unities/binary_constants');
var prefixed_shortened = require('./unities/shortened_prefixed_constants');
var constantsToTranslate = require('./translation/translated_constants');
var keywords = require('./translation/translated_keyword');

var binary_prefix = "(?:" + binary["prefix"].join("|") + ")";
var binary_constants = "(?:" + binary["constants"].join("|") + ")";
var prefixed_shortened_prefix = "(?:" + prefixed_shortened["prefix"].join("|") + ")";
var prefixed_shortened_constants = "(?:" + prefixed_shortened["constants"].join("|") + ")";

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

            // Get values from the match
            var number = values[1];
            var initialFirstConstant = values[3] || values[5] || values[7] || values[8] || '';
            var initialFirstPrefix = values[2] || values[4] || values[6] || '';
            var keyword = values[9];
            var initialSecondConstant = values[11] || values[13] || values[15] || values[16] || '';
            var initialSecondPrefix = values[10] || values[12] || values[14] || '';

            // Initiate values
            var firstConstant = initialFirstConstant;
            var firstPrefix = initialFirstPrefix;
            var resultConstant = initialSecondConstant;
            var resultPrefix = initialSecondPrefix;
            var firstConversion;
            var secondConversion;

            // Get the dictionary of available reverse unit
            var reverseFull = require('./reverse/reverse_full')();
            var reverseShortened = require('./reverse/reverse_shortened')();

            // Function used to convert value if founded in array. Otherwise, get initial value.
            var conversion = function(array, variable) {
                var found = false;
                if (array[variable]){
                    variable = array[variable];
                    found = true;
                }
                return {
                    value: variable,
                    found: found
                };
            };

            // Translate keyword for MathJs if needed
            keyword = conversion(keywords, keyword).value;

            // Translate values for MathJs if needed
            firstConstant = conversion(constantsToTranslate, firstConstant).value;
            resultConstant = conversion(constantsToTranslate, resultConstant).value;

            // Build query and get result
            try {
                var query = number + firstPrefix + firstConstant + " " + keyword + " " + resultPrefix + resultConstant;
                var result = math.eval(query);
            } catch (e) {
                reject("Your conversion isn't valid");
            }

            // Transform prefix into shortened prefix if exists
            firstPrefix = conversion(reverseShortened['shortenedPrefix'], firstPrefix).value;
            resultPrefix = conversion(reverseShortened['shortenedPrefix'], resultPrefix).value;

            // Transform constant into shortened constant if exists
            firstConversion = conversion(reverseShortened['shortenedConstant'], firstConstant);
            secondConversion = conversion(reverseShortened['shortenedConstant'], resultConstant);
            firstConstant = firstConversion.value;
            resultConstant = secondConversion.value;

            // If prefix and constant have been shortened, display the new unit. Otherwise, get initial value from query
            var firstUnit = (firstConversion.found) ? firstPrefix + firstConstant : initialFirstPrefix + initialFirstConstant;
            var resultUnit = (secondConversion.found) ? resultPrefix + resultConstant : initialSecondPrefix + initialSecondConstant;

            // Transform prefix into full prefix if exists
            firstPrefix = conversion(reverseFull['fullPrefix'], firstPrefix).value;
            resultPrefix = conversion(reverseFull['fullPrefix'], resultPrefix).value;

            // Transform constant into full constant if exists
            firstConversion = conversion(reverseFull['fullConstant'], firstConstant);
            secondConversion = conversion(reverseFull['fullConstant'], resultConstant);
            firstConstant = firstConversion.value;
            resultConstant = secondConversion.value;

            // If prefix and constant have been shortened, display the new family. Otherwise, get initial value from query
            var firstFamily = (firstConversion.found) ? firstPrefix + firstConstant : initialFirstPrefix + initialFirstConstant;
            var resultFamily = (secondConversion.found) ? resultPrefix + resultConstant : initialSecondPrefix + initialSecondConstant;

            // Uppercase the first letter of family
            firstFamily = firstFamily.charAt(0).toUpperCase() + firstFamily.slice(1);
            resultFamily = resultFamily.charAt(0).toUpperCase() + resultFamily.slice(1);

            resolve({
                number: number,
                firstUnit: firstUnit,
                firstFamily: firstFamily,
                resultUnit: resultUnit,
                resultFamily: resultFamily,
                result: result
            });
        });
    },

    /**
     * @returns the tab name translated
     */

    getName: function () {
        return _("unit converter", "unit converter");
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */

    getKeyword: function () {
        var prefixed = require('./unities/prefixed_constants')();
        var normal = require('./unities/normal_constants')();

        var prefixed_prefix = "(?:" + prefixed["prefix"].join("|") + ")";
        var prefixed_constants = "(?:" + prefixed["constants"].join("|") + ")";
        var normal_constants = "(?:" + normal["constants"].join("|") + ")";

        return "([0-9]+\\.?[0-9]*)\\s*(?:(" + prefixed_prefix + ")?(" + prefixed_constants
                + ")|(" + prefixed_shortened_prefix + ")?(" + prefixed_shortened_constants
                + ")|(" + binary_prefix + ")?(" + binary_constants + ")|(" + normal_constants + "))"
                + "\\s+(" + _("in", "unit converter") + "|" + _("to", "unit converter") + ")\\s+(?:("
                + prefixed_prefix + ")?(" + prefixed_constants
                + ")|(" + prefixed_shortened_prefix + ")?(" + prefixed_shortened_constants
                + ")|(" + binary_prefix + ")?(" + binary_constants + ")|(" + normal_constants + "))\\s*";
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