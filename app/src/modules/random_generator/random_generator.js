/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

/**
 * determines which random algorithm is going to be used depending on the query we're getting
 * @param query
 * @returns {*}
 */
function getRandomAlgo(query) {
    var regex_from = /from \(((?:[^,]*\s*,?\s*)*)\)/;
    var regex_between = /between (\d+) and (\d+)/;
    var from_values;
    var between_values;
    if (query === "toss" || query === "shifumi") return [query, ''];
    if ((from_values = query.match(regex_from))) return ["from", from_values];
    if ((between_values = query.match(regex_between))) return ["between", between_values];

    return null;
}

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
            if (values[2]) {
                var random_algo = getRandomAlgo(values[2]); // depending on the query, we determine which algorithm to use
                if (random_algo) {
                    switch (random_algo[0]) {
                        case "toss": // example: "random toss"
                            // we just need a random of 2. 0 = "heads", 1 = "tails"
                            resolve((Math.floor(Math.random() * 2) === 0) ? "heads" : "tails");
                            break;

                        case "shifumi": // example: "random shifumi"
                            // we need a random of 3. 0 = "rock", 1 = "paper", 2 = "scissors"
                            var shifumi = ["rock", "paper", "scissors"];
                            var chance = Math.floor(Math.random() * 3);
                            resolve(shifumi[chance]);
                            break;

                        case "from": // example: "random from (X, Y, Z)" where X, Y and Z can be anything
                            // we need to split the string returned by the regex which contains "X, Y, Z"
                            if (random_algo[1] && random_algo[1][1]) {
                                var from = random_algo[1][1].split(",");
                                // we then do a random of the number of items in "from"
                                var rand = (Math.floor(Math.random() * from.length));
                                resolve(from[rand].trim()); // 0 = X, 1 = Y, 2 = Z... trimmed to remove whitespaces
                            } else {
                                reject("Couldn't process query.");
                            }
                            break;

                        case "between": // example: "random between X and Y" where X and Y are integers
                            if (random_algo[1].length > 1) {
                                // we're getting X and Y thanks to the regex in getRandomAlgo()
                                var random_min = parseInt(random_algo[1][1]);
                                var random_max = parseInt(random_algo[1][2]);

                                if (random_min > random_max) {
                                    var tmp = random_min;
                                    random_min = random_max;
                                    random_max = tmp;
                                }

                                // we then do a random to get a number in this range
                                resolve((Math.floor(Math.random() * (random_max - random_min + 1)) + random_min));
                            } else {
                                reject("Couldn't process query.");
                            }
                            break;
                    }
                } else {
                    reject("Couldn't process query.");
                }
            } else {
                reject("Couldn't process query.");
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
        return _("Random generator", "random_generator");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Random generator",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("random", "random_generator");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "random",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    

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

    timeout: 3600,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800
};
