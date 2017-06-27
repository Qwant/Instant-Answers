/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

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

    getData: function (values, proxyURL, language) {
        return new Promise(function (resolve, reject) {

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }

            function onlyLeapyear(value, index, self) {
                var test = false;
                if (value % 4 === 0) {
                    test = true;
                }
                if (value % 100 === 0) {
                    test = false;
                }
                if (value % 400 === 0) {
                    test = true;
                }
                return (test);
            }

            var start = [];
            var end = [];
            var tab = values[0].split(" ");
            var years = [];
            var year;
            for (var i = 0; i < tab.length; ++i) {
                if (tab[i].indexOf("-") !== -1) {
                    var tmpTab = tab[i].split("-");
                    if (tmpTab.length > 1) {
                        if (parseInt(tmpTab[0]) <= parseInt(tmpTab[1])) {
                            start.push(parseInt(tmpTab[0]));
                            end.push(parseInt(tmpTab[1]));
                        }
                        else {
                            start.push(parseInt(tmpTab[1]));
                            end.push(parseInt(tmpTab[0]));
                        }
                    }
                }
                year = parseInt(tab[i]);
                if (year) {
                    years.push(year);
                }
            }
            if (years.length === 0) {
                for (i = 1750; i < 2250; ++i) {
                    years.push(i);
                }
            }
            else {
                if (start.length > 0) {
                    for (var j = 0; j < start.length; ++j) {
                        for (i = start[j]; i <= end[j]; ++i) {
                            years.push(i);
                        }
                    }
                }
                years = years.filter(onlyUnique);
            }
            years = years.filter(onlyLeapyear);

            resolve(years);
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("leapyear", "leapyear");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "leapyear",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function () {
        return _("leapyear", "leapyear");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "leapyear",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "leapyear",

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     * 			start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "any",

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
     * (NEEDED)
     * canBeDisplayedVertically : This attribute is used for the "web" tab only. If your IA can be displayed
     * vertically, like this https://www.qwant.com/?q=m%C3%A9t%C3%A9o%20nice&t=web, toggle it as true.
     * If not, like this https://www.qwant.com/?q=2*5&t=web, toggle it as false.
     */

    canBeDisplayedVertically: false
};
