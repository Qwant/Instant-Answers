var request = require("request");
var Promise = require("bluebird");

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

    getData: function (values, proxyURL) {
        return new Promise(function (resolve, reject) {
            var npm_module_name = encodeURIComponent(values[2]);
            npm_module_name = npm_module_name.toLowerCase();
            var link = 'http://registry.npmjs.org/' + npm_module_name + '/latest';
            var requestParams = {
                url: link,
                timeout: 3000
            };

            if (proxyURL != '') {
                requestParams.proxy = proxyURL;
            }

            function checkAuthors(body_parsed) {
                if ((!body_parsed.author || !body_parsed.author.name) && (!body_parsed.authors)) return "";
                var authors = "";
                if (body_parsed.authors) {
                    body_parsed.authors.forEach(function(author){
                        if (author.name) {
                            if (authors !== "") authors += ", ";
                            authors += author.name;
                        }
                    });
                } else {
                    authors = body_parsed.author.name;
                }
                return authors;
            }

            request(requestParams,
                function (error, response, body) {
                    if (error) {
                        reject(error);
                    } else if (body === "") {
                        reject("Unexpected API answer");

                    } else if (response.statusCode === "404") {
                        reject("NPM package not found");
                    } else {
                        try {
                            var body_parsed = JSON.parse(body);
                        } catch (e) {
                            reject(e);
                        }
                        if (body_parsed) {
                            var authors = checkAuthors(body_parsed);
                            if (!body_parsed.name) reject("There is no name in json file");
                            else if (!body_parsed.version) reject("There is no version in json file");
                            else if (!body_parsed.description) reject("There is no description in json file");
                            else if (authors === "") reject("There is no author or author name in json file");
                            else {
                                resolve({
                                    npm_module: body_parsed.name,
                                    version: body_parsed.version,
                                    description: body_parsed.description,
                                    author: authors
                                });
                            }
                        } else {
                            reject("There is a truthy json");
                        }
                    }

                }
            );
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * if your name doesn't need to be translated, use this attribute. Otherwise, use getName: function(){ return _("name", "context"); }
     */

    name: 'npm',

    /**
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: 'npm',

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

    timeout: 3000,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 200
};