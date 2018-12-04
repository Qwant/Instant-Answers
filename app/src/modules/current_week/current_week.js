/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");

var moment = require('moment');

var winston = require('winston');
var logger = winston.loggers.get('logger');

var lux = require("luxon");
var DT = lux.DateTime ;


function getParams(query) { //Recupère les dates format de début et de fin de la semaine qu'on voudrait étudier

    var regan = new RegExp('[0-2][0-9]{3}$','gi');
    if(regan.test(query.trim())) { //si on overwrite avec l'année qu'on choisit
        var resin = query.split(' ');
        return [resin[0], resin[1]];
    }
    var resyo = query.trim();
    var yo = moment().format('YYYY');
    return [resyo, yo];
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
        const self = this;
        return new Promise(function (resolve, reject) {
            var aTraiter = values.input;
            const regKeywords = self.getKeyword(i18n);
            aTraiter = aTraiter.replace(new RegExp(regKeywords, 'gi'), '').trim();
            var reg = new RegExp('^[0-5]?[0-9]( [0-2][0-9]{3})?$','gi');
            if(aTraiter && reg.test(aTraiter)) {
                var params = getParams(aTraiter);
                if (params && params[0] < 53 && params[0] > 0) {
                    aTraiter = aTraiter.replace(params[0], '').replace(params[1], '').trim();

                    if (aTraiter === '') { //Is the query valid ?
                        var weekNumber = params[0];
                        var year = params[1];

                        var datun = DT.fromObject({weekNumber: parseInt(weekNumber), weekYear: parseInt(year)}); //Récupérer un format datetime

                        var dd = datun.day;
                        var mm = datun.month;
                        var yyyy = datun.year;

                        if (dd < 10) {
                            dd = "0" + dd;
                        }
                        if (mm < 10) {
                            mm = "0" + mm;
                        }

                        var date = moment(yyyy.toString() + mm.toString() + dd.toString(), 'YYYYMMDD').locale(language);
                        var monform = date.format('dddd')[0].toUpperCase() +  date.format('dddd').substring(1) + ' ' + date.format('LL');
                        date.add(6, 'days');
                        resolve({
                            wN: weekNumber,
                            day: [monform, date.format('dddd')[0].toUpperCase() + date.format('dddd').substring(1) + ' ' + date.format('LL')]
                        });
                    } else {
                        logger.error("Wrong query", {module: 'current_week'});
                        reject("Wrong query !");
                    }
                }
                else {
                    logger.error("Weeknumber out of range", {module: 'current_week'});
                    reject("Weeknumber out of range.")
                }
            }

            var res = moment().isoWeek();

            if(aTraiter === '') {
                resolve({
                    wN: res,
                    day: moment().locale(language).format('dddd')[0].toUpperCase() + moment().locale(language).format('dddd').substring(1) + ' ' + moment().locale(language.split('_')[0]).format('Do MMMM YYYY')
                });
            }
            else {
                logger.error("Query not valid", {module: 'current_week'});
                reject("Query not valid.");
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
        return _("Current Week", "current_week");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Current Week",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("week number", "current_week");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    //keyword: "week number",

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

    cache: 10800,
    order: 103
};
