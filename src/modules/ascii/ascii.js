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

    getData: function (values, proxyURL, language) {
        return new Promise(function (resolve, reject) {
            resolve([{ octal : "000", dec : 0  , hex : "00", char : "NUL \'\\0\' (null character)" },
                { octal : "001", dec : 1  , hex : "01", char : "SOH (start of heading)" },
                { octal : "002", dec : 2  , hex : "02", char : "STX (start of text)" },
                { octal : "003", dec : 3  , hex : "03", char : "ETX (end of text)" },
                { octal : "004", dec : 4  , hex : "04", char : "EOT (end of transmission)" },
                { octal : "005", dec : 5  , hex : "05", char : "ENQ (enquiry)" },
                { octal : "006", dec : 6  , hex : "06", char : "ACK (acknowledge)" },
                { octal : "007", dec : 7  , hex : "07", char : "BEL \'\\a\' (bell)" },
                { octal : "010", dec : 8  , hex : "08", char : "BS  \'\\b\' (backspace)" },
                { octal : "011", dec : 9  , hex : "09", char : "HT  \'\\t\' (horizontal tab)" },
                { octal : "012", dec : 10 , hex : "0A", char : "LF  \'\\n\' (new line)" },
                { octal : "013", dec : 11 , hex : "0B", char : "VT  \'\\v\' (vertical tab)" },
                { octal : "014", dec : 12 , hex : "0C", char : "FF  \'\\f\' (form feed)" },
                { octal : "015", dec : 13 , hex : "0D", char : "CR  \'\\r\' (carriage ret)" },
                { octal : "016", dec : 14 , hex : "0E", char : "SO  (shift out)" },
                { octal : "017", dec : 15 , hex : "0F", char : "SI  (shift in)" },
                { octal : "020", dec : 16 , hex : "10", char : "DLE (data link escape)" },
                { octal : "021", dec : 17 , hex : "11", char : "DC1 (device control 1)" },
                { octal : "022", dec : 18 , hex : "12", char : "DC2 (device control 2)" },
                { octal : "023", dec : 19 , hex : "13", char : "DC3 (device control 3)" },
                { octal : "024", dec : 20 , hex : "14", char : "DC4 (device control 4)" },
                { octal : "025", dec : 21 , hex : "15", char : "NAK (negative ack.)" },
                { octal : "026", dec : 22 , hex : "16", char : "SYN (synchronous idle)" },
                { octal : "027", dec : 23 , hex : "17", char : "ETB (end of trans. blk)" },
                { octal : "030", dec : 24 , hex : "18", char : "CAN (cancel)" },
                { octal : "031", dec : 25 , hex : "19", char : "EM  (end of medium)" },
                { octal : "032", dec : 26 , hex : "1A", char : "SUB (substitute)" },
                { octal : "033", dec : 27 , hex : "1B", char : "ESC (escape)" },
                { octal : "034", dec : 28 , hex : "1C", char : "FS  (file separator)" },
                { octal : "035", dec : 29 , hex : "1D", char : "GS  (group separator)" },
                { octal : "036", dec : 30 , hex : "1E", char : "RS  (record separator)" },
                { octal : "037", dec : 31 , hex : "1F", char : "US  (unit separator)" },
                { octal : "040", dec : 32 , hex : "20", char : "SPACE" },
                { octal : "041", dec : 33 , hex : "21", char : "!" },
                { octal : "042", dec : 34 , hex : "22", char : "\"" },
                { octal : "043", dec : 35 , hex : "23", char : "#" },
                { octal : "044", dec : 36 , hex : "24", char : "$" },
                { octal : "045", dec : 37 , hex : "25", char : "%" },
                { octal : "046", dec : 38 , hex : "26", char : "&" },
                { octal : "047", dec : 39 , hex : "27", char : "'" },
                { octal : "050", dec : 40 , hex : "28", char : "(" },
                { octal : "051", dec : 41 , hex : "29", char : ")" },
                { octal : "052", dec : 42 , hex : "2A", char : "*" },
                { octal : "053", dec : 43 , hex : "2B", char : "+" },
                { octal : "054", dec : 44 , hex : "2C", char : "," },
                { octal : "055", dec : 45 , hex : "2D", char : "-" },
                { octal : "056", dec : 46 , hex : "2E", char : "." },
                { octal : "057", dec : 47 , hex : "2F", char : "/" },
                { octal : "060", dec : 48 , hex : "30", char : "0" },
                { octal : "061", dec : 49 , hex : "31", char : "1" },
                { octal : "062", dec : 50 , hex : "32", char : "2" },
                { octal : "063", dec : 51 , hex : "33", char : "3" },
                { octal : "064", dec : 52 , hex : "34", char : "4" },
                { octal : "065", dec : 53 , hex : "35", char : "5" },
                { octal : "066", dec : 54 , hex : "36", char : "6" },
                { octal : "067", dec : 55 , hex : "37", char : "7" },
                { octal : "070", dec : 56 , hex : "38", char : "8" },
                { octal : "071", dec : 57 , hex : "39", char : "9" },
                { octal : "072", dec : 58 , hex : "3A", char : ":" },
                { octal : "073", dec : 59 , hex : "3B", char : ";" },
                { octal : "074", dec : 60 , hex : "3C", char : "<" },
                { octal : "075", dec : 61 , hex : "3D", char : "=" },
                { octal : "076", dec : 62 , hex : "3E", char : ">" },
                { octal : "077", dec : 63 , hex : "3F", char : "?" },
                { octal : "100", dec : 64 , hex : "40", char : "@" },
                { octal : "101", dec : 65 , hex : "41", char : "A" },
                { octal : "102", dec : 66 , hex : "42", char : "B" },
                { octal : "103", dec : 67 , hex : "43", char : "C" },
                { octal : "104", dec : 68 , hex : "44", char : "D" },
                { octal : "105", dec : 69 , hex : "45", char : "E" },
                { octal : "106", dec : 70 , hex : "46", char : "F" },
                { octal : "107", dec : 71 , hex : "47", char : "G" },
                { octal : "110", dec : 72 , hex : "48", char : "H" },
                { octal : "111", dec : 73 , hex : "49", char : "I" },
                { octal : "112", dec : 74 , hex : "4A", char : "J" },
                { octal : "113", dec : 75 , hex : "4B", char : "K" },
                { octal : "114", dec : 76 , hex : "4C", char : "L" },
                { octal : "115", dec : 77 , hex : "4D", char : "M" },
                { octal : "116", dec : 78 , hex : "4E", char : "N" },
                { octal : "117", dec : 79 , hex : "4F", char : "O" },
                { octal : "120", dec : 80 , hex : "50", char : "P" },
                { octal : "121", dec : 81 , hex : "51", char : "Q" },
                { octal : "122", dec : 82 , hex : "52", char : "R" },
                { octal : "123", dec : 83 , hex : "53", char : "S" },
                { octal : "124", dec : 84 , hex : "54", char : "T" },
                { octal : "125", dec : 85 , hex : "55", char : "U" },
                { octal : "126", dec : 86 , hex : "56", char : "V" },
                { octal : "127", dec : 87 , hex : "57", char : "W" },
                { octal : "130", dec : 88 , hex : "58", char : "X" },
                { octal : "131", dec : 89 , hex : "59", char : "Y" },
                { octal : "132", dec : 90 , hex : "5A", char : "Z" },
                { octal : "133", dec : 91 , hex : "5B", char : "[" },
                { octal : "134", dec : 92 , hex : "5C", char : "\\  \'\\\\\'" },
                { octal : "135", dec : 93 , hex : "5D", char : "]" },
                { octal : "136", dec : 94 , hex : "5E", char : "^" },
                { octal : "137", dec : 95 , hex : "5F", char : "_" },
                { octal : "140", dec : 96 , hex : "60", char : "`" },
                { octal : "141", dec : 97 , hex : "61", char : "a" },
                { octal : "142", dec : 98 , hex : "62", char : "b" },
                { octal : "143", dec : 99 , hex : "63", char : "c" },
                { octal : "144", dec : 100, hex : "64", char : "d" },
                { octal : "145", dec : 101, hex : "65", char : "e" },
                { octal : "146", dec : 102, hex : "66", char : "f" },
                { octal : "147", dec : 103, hex : "67", char : "g" },
                { octal : "150", dec : 104, hex : "68", char : "h" },
                { octal : "151", dec : 105, hex : "69", char : "i" },
                { octal : "152", dec : 106, hex : "6A", char : "j" },
                { octal : "153", dec : 107, hex : "6B", char : "k" },
                { octal : "154", dec : 108, hex : "6C", char : "l" },
                { octal : "155", dec : 109, hex : "6D", char : "m" },
                { octal : "156", dec : 110, hex : "6E", char : "n" },
                { octal : "157", dec : 111, hex : "6F", char : "o" },
                { octal : "160", dec : 112, hex : "70", char : "p" },
                { octal : "161", dec : 113, hex : "71", char : "q" },
                { octal : "162", dec : 114, hex : "72", char : "r" },
                { octal : "163", dec : 115, hex : "73", char : "s" },
                { octal : "164", dec : 116, hex : "74", char : "t" },
                { octal : "165", dec : 117, hex : "75", char : "u" },
                { octal : "166", dec : 118, hex : "76", char : "v" },
                { octal : "167", dec : 119, hex : "77", char : "w" },
                { octal : "170", dec : 120, hex : "78", char : "x" },
                { octal : "171", dec : 121, hex : "79", char : "y" },
                { octal : "172", dec : 122, hex : "7A", char : "z" },
                { octal : "173", dec : 123, hex : "7B", char : "{" },
                { octal : "174", dec : 124, hex : "7C", char : "|" },
                { octal : "175", dec : 125, hex : "7D", char : "}" },
                { octal : "176", dec : 126, hex : "7E", char : "~" },
                { octal : "177", dec : 127, hex : "7F", char : "DEL" }]);
        });
    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function () {
        return _("ascii", "ascii");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "ascii",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function () {
        return _("ascii", "ascii");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "ascii",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    script: "ascii",

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

    canBeDisplayedVertically: false
};
