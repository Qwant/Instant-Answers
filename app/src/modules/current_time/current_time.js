/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */
var Promise = require("bluebird");

var config = require('@qwant/config');
config.import('current_time'); // language config file (config/current_time.yml)
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});


var winston = require('winston');
var logger = winston.loggers.get('logger');

var elasticsearch = require('elasticsearch');

var path = require('path');
var countriesbylangFile = path.join(__dirname, "countriesbylang.json");
var countriesbylang = require(countriesbylangFile);

function getCountryCorrelationTable(lan) {
    if (countriesbylang[lan] !== undefined) {
        return countriesbylang[lan];
    }
    return countriesbylang["en"];
}

//TODO : fichier config && logger

function getCountryCode(lan, values2) {
    var country = '';
    var tbl1 = getCountryCorrelationTable(lan);
    var tbl2 = getCountryCorrelationTable("en");
    var tbl3 = getCountryCorrelationTable("alias");
    for (var cn in tbl1) {
        cn = cn.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        var regcn = new RegExp("([a-zA-Z]*) *" + cn + "$", "gi");
        if (regcn.test(values2)) {
            country = cn;
            return {cc: tbl1[country], country: country};
        }
    }
    for (var cn in tbl2) {
        cn = cn.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        var regcn = new RegExp("([a-zA-Z]*)* " + cn + "$", "gi");
        if (regcn.test(values2)) {
            return {cc: tbl2[country], country: country};
        }
    }
    for (var cn in tbl3) {
        cn = cn.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        var regcn = new RegExp("([a-zA-Z]*)* " + cn + "$", "gi");
        if (regcn.test(values2)) {
            country = cn;
            return {cc: tbl3[country], country: country};
        }
    }
    return {cc: '', country: ''};
}

function getEmptyString(lan, values2, tabOfAliases, name) {
    if((tabOfAliases && ((tabOfAliases[lan] && tabOfAliases[lan].length > 0) || (tabOfAliases.en && tabOfAliases.en.length > 0) || (tabOfAliases.global && tabOfAliases.global.length > 0)))
        || name) {
        //Traitement de la ville afin de la rendre "normale"
        values2 = values2.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();

        var regTirets = new RegExp("( ?- ?| )", "gi");

        if (name) {
            //On tente d'abord avec le name !
            name = name.replace(regTirets, "( ?- ?| )").normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();

            var regName = new RegExp(name + "$", "gi");

            if (regName.test(values2)) {
                values2 = values2.replace(regName, "").trim();
                return values2;
            }
        }

        if (tabOfAliases) {
            //Récupération des différents aliases existants pour une seule ville selon la langue du moteur de recherche de l'utilisateur

            var reg;
            if (lan !== "en" && tabOfAliases[lan]) {
                for (var nom in tabOfAliases[lan]) {
                    tabOfAliases[lan][nom] = tabOfAliases[lan][nom].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(regTirets, "( ?- ?| )").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();
                    reg = new RegExp(tabOfAliases[lan][nom] + "$", "gi");
                    if (reg.test(values2) === true) {
                        return values2.replace(reg, '').trim();
                    }
                }
            }
            if (tabOfAliases['en']) {
                for (var nom in tabOfAliases["en"]) {
                    tabOfAliases["en"][nom] = tabOfAliases["en"][nom].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(regTirets, "( ?- ?| )").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();
                    reg = new RegExp(tabOfAliases["en"][nom] + "$", "gi");

                    if (reg.test(values2) === true) {
                        return values2.replace(reg, '').trim();
                    }
                }
            }
            if (tabOfAliases['global']) {
                for (var nom in tabOfAliases["global"]) {
                    tabOfAliases["global"][nom] = tabOfAliases["global"][nom].normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(regTirets, "( ?- ?| )").replace("\.", "\.?").replace(",", ",?").toLowerCase().trim();
                    reg = new RegExp(tabOfAliases["global"][nom] + "$", "gi");

                    if (reg.test(values2) === true) {
                        return values2.replace(reg, '').trim();
                    }
                }
            }
        }

    }
    return false;

}

module.exports = {
    /**
     * (NEEDED)
     *    This function uses 3 parameters :
     *    - values : This is an array of values caught by regex.
     *    For example, if you use the keyword "test" with the trigger "start", and you type "test working?",
     *  values would be like this :
     *    * values[0] = "test working?"
     *    * values[1] = "test"
     *    * values[2] = "working?"
     *  But, if you use the trigger "strict", there will be only one value in this array (values[0] = "test working?")
     *  - proxyURL : If you need to call an external API, use the package "request" with proxyURL as value for
     *  "proxy" attribute (you can refer to weather IA to check how to use it properly)
     *  - language : Current language called
     * @returns data to be displayed.
     */
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            language = language.split('_');
            if (language && language.length === 2) {
                var lan = language[1];
                var ville;
                var countryInfos = getCountryCode(lan, values[(lan === "fr" ? 5 : 2)]);
                var cntry = countryInfos.country;
                var country_code = countryInfos.cc;
                ville = values[(lan === "fr" ? 5 : 2)].replace(cntry, '').trim();

                var hostConf = config_get('current_time.elasticsearch.host');
                if (hostConf) {

                    var elasticClient = new elasticsearch.Client({
                        host: hostConf
                    });

                    elasticClient.searchTemplate({
                        index: 'cities',
                        from: 0,
                        size: 1,
                        body: { // les params à envoyer à notre template 'cities_query'
                            'id': 'cities_query',
                            'params': {
                                "query": ville,
                                "user_lang": lan,
                                "user_country": lan,
                                "query_country": country_code
                            }
                        }
                    }).then(function (resp) {
                            if (resp.hits.hits.length > 0) { // si hits.hits n'est pas vide, c'est que l'ES a trouvé une réponse
                                var hits = resp.hits.hits[0]._source;
                                var isRestEmpty = getEmptyString(lan, ville, hits.aliases, hits.name);

                                if (isRestEmpty === false) {
                                    reject("Couldn't find the name in the tab of names.");
                                }

                                if (isRestEmpty && isRestEmpty.trim() !== '') {
                                    reject("Useless characters.");
                                }
                                var TIMEZONE = hits.timezone;
                                var moment = require('moment-timezone');
                                var utcc = (moment.tz(moment.utc(), TIMEZONE).utcOffset()) / 60;

                                resolve({
                                    result: moment().locale(lan).tz(TIMEZONE).format('LT'),
                                    day: moment().locale(lan).tz(TIMEZONE).format('dddd')[0].toUpperCase() + moment().locale(lan).tz(TIMEZONE).format('dddd').substring(1).toLowerCase() + ' ' + moment().locale(lan).tz(TIMEZONE).format('Do MMMM YYYY'),
                                    ct: hits.name,
                                    tzz: TIMEZONE,
                                    cc: hits.country_code.toUpperCase().trim(),
                                    utc: (utcc > 0 ? '+' : '') + utcc,
                                    week: moment().isoWeek()
                                });
                            }
                            reject("[current_time] No response found."); // si l'ES n'a rien trouvé

                        }, function (err) {
                            logger.error('Error connecting to elastic client', {module: 'current_time'}); // erreur de connexion à l'ES
                            reject(err);
                        }
                    );
                } else {
                    logger.error('No config', {module: 'current_time'}); // erreur de connexion à l'ES
                    reject("No config");
                }
            } else {
                logger.error('No lang', {module: 'current_time'}); // erreur de connexion à l'ES
                reject("No language");
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
        return _("Current Time", "current_time");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Current Time",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("time in", "current_time");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    //keyword: "time in",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */


    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     *            start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "start",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     *            - g : global
     *            - m : multi-line
     *            - i : insensitive
     */

    flag: "i",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 5000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800,
    order: 82
};
