var fs = require('fs');
var winston = require('winston');
var logger = winston.loggers.get('logger');
var BLACKLIST_PATH_FILE = 'config/blacklistAPIs.json';
const NUMBER_TIMEOUT_BY_HOUR_ALLOWED = 10;
const OPTIONAL_FIELD_START = "@_";

module.exports = {

    /**
     *  Get APIs blacklisted .
     *  @returns hosts blacklisted.
     */
    getAPIsBlacklisted: function () {
        var blacklistAPIs = '';
        try {
            blacklistAPIs = fs.readFileSync(BLACKLIST_PATH_FILE, 'utf8');
        } catch (err) {
            if (err.code === 'ENOENT') {
                logger.error("Couldn't load blacklist file", {module: "api_caller"});
            }
            throw err;
        }
        return JSON.parse(blacklistAPIs);
    },

    /**
     *  Check if API is authorized by Qwant
     *	This function uses 1 parameter :
     *	- key: This is the URL of the API.
     *  @returns boolean.
     */
    isAuthorized: function (apiRequest) {
        var blacklistAPIs = this.getAPIsBlacklisted();
        let apiAllowed = true;
        blacklistAPIs.apis.forEach( function(api) {
            if(apiRequest.toLowerCase().includes(api)) {
                apiAllowed = false;
            }
        });
        return apiAllowed;
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
            if(itemO1 == null) {
                return true;
            }
            var itemStructureType = itemO2.split(",");
            var typeItemO1 = Array.isArray(itemO1) ? "Array" : typeof itemO1;
            for(var type in itemStructureType) {
                if ( typeItemO1.toLowerCase() == itemStructureType[type].replace(/\s+/g, '').toLowerCase()) {
                    return true;
                }
            }
            return false;
        }

        function checkNumberFieldsMatch(o1, o2) {
            if(Object.keys(o1).length != Object.keys(o2).length && !Array.isArray(o1)) {
                var structureLength = Object.keys(o2).length;
                // Removes optional fields that are not in the answer
                Object.keys(o2).forEach( function(item) {
                    if (item.startsWith(OPTIONAL_FIELD_START) && !o1.hasOwnProperty(item.slice(2))) {
                        structureLength--;
                    }
                });

                if(structureLength != Object.keys(o1).length) {
                    logger.error("["+apiRequest+"] Missing " + Math.abs(structureLength - Object.keys(o1).length) + " in the API response.", {module: "api_caller"});
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
                    logger.error("["+apiRequest+"] Type doesn't match for " + item+ " (expected: " + o2[itemStructure] + ", got:" + typeof o1[item] + ")", {module: "api_caller"});
                }
                return type;
            }
        }

        return compareObjects(response, structure);
    },

    /**
     *  Add a host to the the blacklist
     *	This function uses 1 parameter :
     *	- host: the host URL.
     */
    blacklistAPI: function (host) {
        fs.open(BLACKLIST_PATH_FILE, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    logger.error("Couldn't load blacklist file", {"module": "api-caller"});
                }
                throw err;
            }
            fs.readFile(fd, 'utf8', (err, data) => {
            if (err) throw err;
        let blacklistAPIs = JSON.parse(data);
        blacklistAPIs.apis.push(host);
        let blacklistAPIsJson = JSON.stringify(blacklistAPIs);
        fs.writeFile(BLACKLIST_PATH_FILE, blacklistAPIsJson, (err) => {
            if (err) throw err;
        logger.info('[' + host + '] added to the blacklist', {"module": "api-caller"});
    });
    });
    });
    },

    /**
     *	Blacklist rules for an API that exceeds the timeout :
     *  If an API has more than NUMBER_TIMEOUT_BY_HOUR_ALLOWED (default: 10) calls in timeout per hour, it is blacklisted
     */
    callAPITimeout: function (host) {
        function algoBLtimeout(host, data) {
            var blacklistAPIs = data;
            var apiAlreadyExist = false;

            blacklistAPIs.timeout.forEach( function(api) {
                if(host.toLowerCase().includes(api.host)) {
                    apiAlreadyExist = true;
                    api.numberTimeout += 1;

                    if (api.numberTimeout >= NUMBER_TIMEOUT_BY_HOUR_ALLOWED) {
                        var now = new Date().getTime();
                        var differenceBetweenDate = now - api.dateTimeFirstTimeout;
                        var oneHour =  1 * 60 * 60 * 1000;
                        if(differenceBetweenDate < oneHour) {
                            blacklistAPIs.apis.push(host);
                        } else {
                            api.numberTimeout = 1;
                            api.dateTimeFirstTimeout = now;
                        }
                    }
                }
            });

            // Create new timeout entry
            if (!apiAlreadyExist) {
                let newAPITimeout = {
                    host: host,
                    numberTimeout: 1,
                    dateTimeFirstTimeout: new Date().getTime()
                };
                blacklistAPIs.timeout.push(newAPITimeout);
            }
            return blacklistAPIs;
        }

        fs.open(BLACKLIST_PATH_FILE, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    logger.error("Couldn't load blacklist file", {"module": "api-caller"});
                }
                throw err;
            }
            fs.readFile(fd, 'utf8', (err, data) => {
            if (err) throw err;
        let blacklistAPIs = algoBLtimeout(host, JSON.parse(data));
        let blacklistAPIsJson = JSON.stringify(blacklistAPIs);
        fs.writeFile(BLACKLIST_PATH_FILE, blacklistAPIsJson, (err) => {
            if (err) throw err;
    });
    });
    });
    }
};