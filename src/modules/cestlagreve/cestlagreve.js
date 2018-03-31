/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var cachedApi = [];
const CESTLAGREVE_CACHE_REQUEST = 14400 // in seconds, 14400 = 4 hrs

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
            if (values[0]) {
                const request = require('request')
                const cheerio = require('cheerio')
                const cacheKey = "cestlagreve"

                const url = "http://www.cestlagreve.fr"

                if ((cachedApi[cacheKey] && Object.keys(cachedApi[cacheKey]["data"]).length > 0
                        && (new Date().getTime() - cachedApi[cacheKey]["lastUpdate"]) > (CESTLAGREVE_CACHE_REQUEST * 1000))
                    || !cachedApi[cacheKey] || Object.keys(cachedApi[cacheKey]["data"]).length === 0) {
                    request(url, function(error, response, html) {
                        if (!error) {
                            const $ = cheerio.load(html, {
                                normalizeWhitespace: true,
                            })
                            const res = {}
                            const oncoming_events_html = $('#oncoming_events ul').html()
                            const upcoming_events_html = $('#upcoming_events ul').html()

                            const oncoming_events = $(oncoming_events_html).text().trim().replace(/\t/g,'').split('\n').filter((n) => n !== '')
                            const oncoming_events_links = $(oncoming_events_html).find('a')
                            const upcoming_events = $(upcoming_events_html).text().trim().replace(/\t/g,'').split('\n').filter((n) => n !== '')
                            const upcoming_events_links = $(upcoming_events_html).find('a')

                            if (!oncoming_events.length && !upcoming_events.length) {
                                reject(`${url} didn't have the expected DOM elements...`)
                            }

                            if (oncoming_events) {
                                let new_oncoming_events = []
                                oncoming_events.forEach((event, i) => {
                                    new_oncoming_events.push(
                                        {
                                            title: (event.indexOf(':') !== -1 ? event.split(':')[1].trim() : event),
                                            date: (event.indexOf(':') !== -1 ? event.split(':')[0].trim() : ''),
                                            url: (oncoming_events_links[i] && oncoming_events_links[i].attribs
                                                && oncoming_events_links[i].attribs.href)
                                                ? oncoming_events_links[i].attribs.href
                                                : ''
                                        }
                                    )
                                })
                                res.oncoming_events = new_oncoming_events
                            }

                            if (upcoming_events) {
                                let merged_upcoming_events = []
                                let new_upcoming_events = []
                                for (let i = 0; i < upcoming_events.length; i+=2) {
                                    merged_upcoming_events.push(`${upcoming_events[i]}${upcoming_events[i + 1]}`)
                                }
                                merged_upcoming_events.forEach((event, i) => {
                                    new_upcoming_events.push(
                                        {
                                            title: (event.indexOf(':') !== -1 ? event.split(':')[1].trim() : event),
                                            date: (event.indexOf(':') !== -1 ? event.split(':')[0].trim() : ''),
                                            url: (upcoming_events_links[i] && upcoming_events_links[i].attribs
                                                && upcoming_events_links[i].attribs.href)
                                                ? upcoming_events_links[i].attribs.href
                                                : ''
                                        }
                                    )
                                })
                                res.upcoming_events = new_upcoming_events
                            }

                            cachedApi[cacheKey] = []
                            cachedApi[cacheKey]["data"] = res
                            cachedApi[cacheKey]["lastUpdate"] = new Date().getTime()

                            resolve(res)
                        } else {
                            reject(`${url} didn't respond correctly...`)
                        }
                    })
                } else {
                    resolve(cachedApi[cacheKey]["data"])
                }
            } else {
                reject("Unknown error!")
            }
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("C'est la grève?", "cestlagreve");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "cestlagreve",

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "(?:calendrier )?(?:sncf )?gr(?:e|ève)(?: sncf)?(?: calendrier)?(?: sncf)?",

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

    timeout: 4000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 14400 // 14400 = 4 hrs
};
