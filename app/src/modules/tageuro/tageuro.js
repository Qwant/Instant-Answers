/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

accentsTidy = function(s){
    var r=s.toLowerCase();
    r = r.replace(new RegExp(/\s/g),"");
    r = r.replace(new RegExp(/[àáâãäå]/g),"a");
    r = r.replace(new RegExp(/æ/g),"ae");
    r = r.replace(new RegExp(/ç/g),"c");
    r = r.replace(new RegExp(/[èéêë]/g),"e");
    r = r.replace(new RegExp(/[ìíîï]/g),"i");
    r = r.replace(new RegExp(/ñ/g),"n");                
    r = r.replace(new RegExp(/[òóôõö]/g),"o");
    r = r.replace(new RegExp(/œ/g),"oe");
    r = r.replace(new RegExp(/[ùúûü]/g),"u");
    r = r.replace(new RegExp(/[ýÿ]/g),"y");
    r = r.replace(new RegExp(/\W/g),"");

    return r;
};

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

            if (values[0]) {
                const CACHE_KEY = 'tageuro-cache';
                const CACHE_EXPIRE = 10;
                const redisTools = require('../../redis_tools');
                redisTools.initRedis();
                             
                // Checking the cache to avoid requesting the API
                redisTools.getFromCache(CACHE_KEY).then((cached) => {
                    if (cached) { // we already have a recent answer
                        cached = JSON.parse(cached);
                        if (cached) {
                            cached.fromCache = true;
                            resolve(cached);
                        } else {
                            reject("Error: something went wrong while fetching cached response");
                        }
                    } else { // no cache
                    
                        // Declares the API Caller
                        var apiCaller = require('../../api_caller');

                        var result = encodeURI(values[0]);
                        var api_request = 'https://www.sentimantic.net/qwant/apiReqIA/image?fid='+result;

                        // Defines the structure of the answer
                        var structure = {
                            "image":  "String"
                        };
                            

                        // Call the API and get back data
                        apiCaller.call(api_request, structure, proxyURL, this.timeout, redisTools).then((apiRes) => {
                             redisTools.saveToCache(CACHE_KEY, apiRes, CACHE_EXPIRE);
                            apiRes.fromCache = false;
                            resolve(apiRes);
                        }).catch((error) => {
                            reject(error);
                        });
                            
                    }
                });
            } else {
                reject("Couldn't process query.")
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
        return _("TagEuro", "tageuro");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "TagEuro",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        var finalKeywords = ""
        keywords.forEach(function(element) {
            finalKeywords += element + "|"
        });

        finalKeywords = finalKeywords.substr(0, oldStr.length-1);
        return _("Nicolas Dupont(\-| )Aignan", "tageuro");//finalKeywords;
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(N|n)icolas (D|d)upont(\-| )(A|a)ignan|(F|f)lorian (P|p)hilippot|(R|r)apha(\ë|e)l (G|g)lucksmann|(J|j)ean (C|c)hristophe (L|l)agarde|(F|f)ran(\ç|c)ois (A|a)sselineau|(I|i)an (B|b)rossat|(J|j)ean (L|l)assalle|(Y|y)annick (J|j)adot|(F|f)ran(\ç|c)ois (X|x)avier (B|b)ellamy|(N|n)athalie (L|l)oiseau|(J|j)ordan (B|b)ardella|(M|m)anon (A|a)ubry|(N|n)athalie (A|a)rthaud",
    //keyword: "Nicolas Dupont(\-| )Aignan",
    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    //script: "js",

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

    flag: "gim",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 5000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 600,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    
};
