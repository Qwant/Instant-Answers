var _ = require('@qwant/front-i18n')._;
var sha1 = require('sha1');
var createHash = require('sha.js');
var md5 = require('md5');

var commonEntities = [
    {char : "<", html : "&lt;"},
    {char : ">", html : "&gt;"},
    {char : '"', html : "&quot;"},
    {char : "&", html : "&amp;"}
];

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
        var hash = values[1].toUpperCase();
        var stringToHash = values[2];

        commonEntities.forEach(function(entity) {
			stringToHash = stringToHash.replace(entity.html, entity.char);
        });

        var result = '';
        switch(hash){
            case 'SHA1':
                result = sha1(stringToHash);
                break;
            case 'SHA256':
                var sha256 = createHash('sha256');
                result = sha256.update(stringToHash, 'utf8').digest('hex');
                break;
            case 'MD5':
                result = md5(stringToHash);
                break;
        }
        return {
            result: result,
            stringToHash: stringToHash,
            hash: hash
        };

    },

    /**
     * @returns the tab name translated
     */

    getName: function () {
        return _("hash", "encryption");
    },

    /**
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "sha1|sha256|md5",

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

    timeout: 30,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 200
};