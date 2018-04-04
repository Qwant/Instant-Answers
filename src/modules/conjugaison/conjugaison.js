/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var fs = require('fs')

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
            values = values.filter(function(n){ return n !== undefined });
            function removeAccent(letter) {
                const accents = {
                    'a': ['à','á','â','ã','ä','å','æ'],
                    'c': ['ç'],
                    'e': ['è','é','ê','ë'],
                    'i': ['ì','í','î','ï'],
                    'o': ['ð','ò','ó','ô','õ','ö'],
                    'n': ['n'],
                    'u': ['ù','ú','û','ü']
                }

                Object.keys(accents).forEach((acc) => {
                    if (accents[acc].indexOf(letter) !== -1) {
                        letter = acc
                    }
                })

                return letter
            }

            if (values[0] && values[1] && values[2]) {
                let dictionary
                let verb = values[2].toLowerCase()

                if (verb.substring(0, 3) === "se " || verb.substring(0, 2) === "s'") {
                    dictionary = 'se_'
                } else {
                    dictionary = removeAccent(verb[0])
                }

                const stream = fs.createReadStream(`${__dirname}/conjugaisons/${dictionary}.json`, {flags: 'r', encoding: 'utf-8'})
                let buf = ''

                stream.on('data', function(d) {
                    buf += d.toString()
                }).on('end', function() {
                    const json = JSON.parse(buf)
                    if (json[verb]) {
                        resolve(json[verb])
                    } else {
                        reject('No conjugation found')
                    }
                }).on('error', function(err) {
                    reject('No dictionary for that')
                })
            } else {
                reject('Nothing to do')
            }
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("Conjugaison", "conjugaison");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Conjugaison",

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(conjug(?:uer|aison) (?:(?:au |(a|à) l' )?(?:pr(e|é)sent|passé|futur|futur ant(e|é)rieur|imparfait|passé(-| )composé|plus(-| )que(-| )parfait|passé ant(e|é)rieur|futur proche|conditionnel( pr(e|é)sent|passé)?|subjonctif( pr(e|é)sent|imparfait|plus(-| )que(-| )parfait|passé)?|imp(e|é)ratif( pr(e|ésent)?|participe passé)) )?((?:(?:(?:s|m|t)e |s'|m'|t'))?(?:[a-zàáâãäåæçèéêëìíîïðñòóôõöùúûü]+)?))",

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

    trigger: "strict",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     * 			- g : global
     * 			- m : multi-line
     * 			- i : insensitive
     */

    flag: "gi",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 10800,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800
};
