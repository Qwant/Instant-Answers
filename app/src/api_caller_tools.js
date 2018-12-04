var fs = require('fs');
var Url = require('url');
var winston = require('winston');
var logger = winston.loggers.get('logger');
const OPTIONAL_FIELD_START = "@_";

module.exports = {

    /**
     *  Check if API is authorized by Qwant
     *	This function uses 1 parameter :
     *	- key: This is the URL of the API.
     *  @returns boolean.
     */
    isValidURL: function (apiRequest) {
        let host;

        try {
            host = Url.parse(apiRequest).hostname
        } catch (e) {
            logger.error("API URL is not valid", {module: "api_caller"});
            return false;
        }

        return host;
    },

    /**
     *  Checked that the structure of the API response is valid
     *	This function uses 3 parameters :
     *	- response: Response of the API.
     *	- structure: Corresponds to the structure of a normal response.
     *  @returns boolean.
     */
    hasValidStructure: function (response, structure, apiRequest) {
        var equal = true;

        function compareType(itemO1, itemO2) {
            if(itemO1 === null) {
                return true;
            }
            var itemStructureType = itemO2.split(",");
            var typeItemO1 = Array.isArray(itemO1) ? "Array" : typeof itemO1;
            for(var type in itemStructureType) {
                if ( typeItemO1.toLowerCase() === itemStructureType[type].replace(/\s+/g, '').toLowerCase()) {
                    return true;
                }
            }
            return false;
        }

        function getDiff(o1, o2) {
            return Object.keys(o1).filter((key) => {
                return !o2.hasOwnProperty(key)
            })
        }

        function checkNumberFieldsMatch(o1, o2) {
            if(Object.keys(o1).length !== Object.keys(o2).length && !Array.isArray(o1)) {
                var structureLength = Object.keys(o2).length;
                // Removes optional fields that are not in the answer
                Object.keys(o2).forEach( function(item) {
                    if (item.startsWith(OPTIONAL_FIELD_START) && !o1.hasOwnProperty(item.slice(2))) {
                        structureLength--;
                    }
                });

                if(structureLength !== Object.keys(o1).length) {
                    const diff = (getDiff(o1, o2).length ? getDiff(o1, o2) : getDiff(o2, o1)).toString()
                    logger.error("["+apiRequest+"] Missing " + Math.abs(structureLength - Object.keys(o1).length) + " (" + diff + ") in the API response.", {module: "api_caller"});
                    return false;
                }
            }
            return true;
        }

        function compareObjects(o1, o2) {
            if(!checkNumberFieldsMatch(o1, o2)) {
                return equal = false;
            }

            // Check response match structure
            Object.keys(o1).forEach( function(item) {
                if (equal) {
                    equal = compareItem(o1, o2, item);
                }
            });
            return equal;
        }

        function compareItem(o1, o2, item) {
            var itemStructure = !isNaN(item) ? 0 : item; // Compares a list of data to the first element of the structure, avoid duplicating the structure
            itemStructure = o2.hasOwnProperty(OPTIONAL_FIELD_START + itemStructure) ? OPTIONAL_FIELD_START + itemStructure : itemStructure;

            // compare keys
            if ( !o2.hasOwnProperty(itemStructure) ) {
                logger.error("["+apiRequest+"] The key [" + item + "] isn't in the structure.", {module: "api_caller"});
                return false;
                // compare sub object
            } else if (typeof o1[item] === "object" && typeof o2[itemStructure] === "object") {
                return compareObjects(o1[item], o2[itemStructure]);
                // compare type of value
            } else {
                var type = compareType(o1[item], o2[itemStructure]);
                if(!type) {
                    logger.error("["+apiRequest+"] Type doesn't match for " + item + " (expected: " + o2[itemStructure] + ", got:" + typeof o1[item] + ")", {module: "api_caller"});
                }
                return type;
            }
        }

        return compareObjects(response, structure);
    },
};