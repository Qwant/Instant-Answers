var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var moment = require('moment');
var path = require('path');
var zodiacFile = path.join(__dirname, "zodiac.json");
var zodiac = require(zodiacFile);

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getSign(bday, langue){
    var formatlocale = langue.split('_').join('-');
    var theDate = bday.split(" ").join(',').split('/').join(',').split('-').join(',').split('.').join(',').split(',');
    var month = 13;
    var day = 0;
    var year = 0;
        if (theDate[0].length === 4) {
            var year = theDate[0];
            var month = theDate[1];
            var day = theDate[2];                
        } else if (langue != "en_us" && theDate[1] < "13") {
            var year = theDate[2];
            var month = theDate[1];
            var day = theDate[0];
        }
        if (theDate[0] <= 12 && langue == "en_us") {
            var year = theDate[2];
            var month = theDate[0];
            var day = theDate[1];
        } 
        if (month > "12" || day == "0" || year == "0") {
            return(null);
        }
    for (var i=0; i <= 12; i++) {
        if ((month == zodiac["signs"][i]["start"]["monthNumber"]) && (day >= zodiac["signs"][i]["start"]["date"])) {
            return{ name:    zodiac["signs"][i]["zodiacName"], 
                    description: zodiac["descriptions"][i]["description"], 
                    keywords: zodiac["descriptions"][i]["keywords"],
                    element: zodiac["descriptions"][i]["element"],
                    position: i
                };
        } else if (month == zodiac["signs"][i]["end"]["monthNumber"] && day <= zodiac["signs"][i]["end"]["date"]) {
            return{ name: zodiac["signs"][i]["zodiacName"], 
                    description: zodiac["descriptions"][i]["description"], 
                    keywords: zodiac["descriptions"][i]["keywords"],
                    element: zodiac["descriptions"][i]["element"],
                    position: i
                };
        }
    }
}

function getRange(position, langue){
    let formatlocale = langue.split('_').join('-');
    let range = zodiac["descriptions"][position]["range"];
    let rangesplit = range.split('-');
    let startdate = moment(rangesplit[0]);
    let enddate = moment(rangesplit[1]);
    let therange =  {   start: startdate.format('DD MMMM '), 
                        end: enddate.format('DD MMMM ') 
                    }
    return(therange);
}

function getSvg(sign){
    
    let svg = { matrix: zodiac["svg"][sign]["matrix"],
                d: zodiac["svg"][sign]["d"]
            };
    return(svg);
}

module.exports = {
     getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            if (values[2]) {
                moment.locale(language);
                var sign = getSign(values[2], language);
                if (sign === null) {
                    reject("Couldn't process query.");
                }
                var range = getRange(sign["position"], language);
                var svg = getSvg(sign["name"]);
                resolve({
                    sign_name: sign["name"], 
                    sign_description: sign["description"],
                    sign_keywords: sign["keywords"],
                    sign_start: range["start"],
                    sign_end: range["end"],
                    sign_svg: svg,
                    sign_element: sign["element"]
                });
            } else {
                reject("Couldn't process query.")
            }
        
        });
    },

    getName: function (i18n) {
        const _ = i18n._;
        return _("astro", "astro");
    },

    name: "astro",
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("astro", "astro");
    },

    keyword: "astro",
    trigger: "start",
    flag: "i",
    timeout: 3600,
    cache: 10800,   
};
