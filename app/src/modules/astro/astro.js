/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

 // REGEX: ^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var moment = require('moment');

// var bday_regex = "^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/";

//Load the json file containing Astrological data
var path = require('path');
var zodiacFile = path.join(__dirname, "zodiac.json");
var zodiac = require(zodiacFile);

// Transform first Letter of string to UPPERCASE
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}





//Function to get the astrological sign by date

function getElement(){

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

// get date range
function getRange(position, langue){
    let formatlocale = langue.split('_').join('-');
    let range = zodiac["descriptions"][position]["range"];
    let rangesplit = range.split('-');
    let startdate = moment(rangesplit[0]);
    let enddate = moment(rangesplit[1]);
    //var datelocale = themoment.locale(langue);
    


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

    /**
     * (NEEDED)
     *  This function uses 3 parameters :
     *  - values : This is an array of values caught by regex.
     *  For example, if you use the keyword "test" with the trigger "start", and you type "test working?",
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

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("astro", "astro");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "astro",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("astro", "astro");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "astro",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     *      start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "start",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     *      - g : global
     *      - m : multi-line
     *      - i : insensitive
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

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    
};
