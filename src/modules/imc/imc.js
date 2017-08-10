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

    getData: function (values) {
        var tallweight = values[2];
        var tempnum = tallweight.indexOf(" ");

        var tall = "";
        var weight = "";
        for (var i=0;i<tallweight.length; ++i){
            if(i<tempnum){

                tall += tallweight[i];
            }else if(i>tempnum){
                weight += tallweight[i];
            }
        }
        tall = parseInt(tall);
        weight = parseInt(weight);
            tall = tall/100;
            var imc = weight / (Math.pow(tall, 2));
            imc = Math.round(imc);
            if (isNaN(imc)) {
                imc = "Veuillez remplir correctement les champs ci-dessus"
            }
            if (imc <= 16) {
                var OMS = "ANOREXIE OU DENUTRITION"
            } else if (imc > 16 && imc <= 18.5) {
                var OMS = "MAIGREUR"
            } else if (imc > 18.5 && imc <= 25) {
                var OMS = "CORPULENCE NORMALE"
            } else if (imc > 25 && imc <= 30) {
                var OMS = "SURPOIDS"
            } else if (imc > 30 && imc <= 35) {
                var OMS = "OBESITE MODEREE (CLASSE 1)"
            } else if (imc > 35 && imc <= 40) {
                var OMS = "OBESITE ELEVE (CLASSE 2)"
            } else if (imc > 40) {
                var OMS = "OBESITE MORBIDE OU MASSIVE"
            }
            return {
                OMS : OMS,
                IMC : imc
            };

    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("IMC", "imc");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "IMC",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function () {
        return _("imc", "imc");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "imc",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "script",

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

    canBeDisplayedVertically: false,
};
