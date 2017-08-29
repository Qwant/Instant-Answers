var Promise = require("bluebird");
var iaVersion = require('../package.json').version;
var fs = require('fs');
var hasher = require('folder-hash');

/** Constructor interface **/
function instant_answer(module) {
    this.iaModuleBase = config_get('app.qwant-ia.modules-base');
    this.iaScriptBase = config_get('app.qwant-ia.script-base');
    this.iaImagesBase = config_get('app.qwant-ia.images-base');

    // To use a proxy server, edit config/app.yml with the correct settings
    this.proxyURL = '';
    if (config_get('app.qwant-ia.proxy.enabled') === true) {
        var proxyServer = config_get('app.qwant-ia.proxy');
        this.proxyURL = proxyServer.address + ':' + proxyServer.port;
    }

    this.initialName = module.file;
    this.module = module;
}

/**
 * @returns {RegExp} Build the pattern with the good keyword ( translated or not )
 */
instant_answer.prototype.buildPattern = function () {
    var keyword = (this.module.keyword) ? this.module.keyword : this.module.getKeyword();
    var pattern = '^';
    switch (this.module.trigger) {
        case 'strict':
            pattern = pattern + keyword;
            break;
        case 'any':
            pattern = pattern + '(?:(.+)\\s+)?(' + keyword + ')(?:\\s+(.+))?';
            break;
        case 'start':
            pattern = pattern + '(' + keyword + ')\\s+(.+)';
            break;
        case 'end':
            pattern = pattern + '(.+)\\s+(' + keyword + ')';
            break;
    }
    pattern = pattern + '$';
    return new RegExp(pattern, this.module.flag);
};

/**
 * @returns {boolean} Test to match query
 */
instant_answer.prototype.testQuery = function (query) {
    return this.getPattern().test(query);
};

/**
 * @returns {function} Call buildPattern to get the regex
 */
instant_answer.prototype.getPattern = function () {
    return this.buildPattern();
};

/**
 * @returns {string} Get the translated name
 */
instant_answer.prototype.getName = function () {
    return (this.module.name) ? this.module.name : this.module.getName();
};

/**
 * @returns {Array} Get all the capturing groups
 */
instant_answer.prototype.execQuery = function (query) {
    return this.getPattern().exec(query);
};

/**
 * @returns {number} Get cache time
 */
instant_answer.prototype.getCacheTime = function () {
    return this.module.cache || -1;
};
/**
 * @returns {exports} Get data from IA
 */
instant_answer.prototype.solveData = function (query, lang) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var iaData = self.module.getData(query, self.proxyURL, lang);
        var isPromise = !!iaData["then"];
        if (!isPromise) iaData = Promise.resolve(iaData);

        iaData
                .then(function (response) {
                    var moduleName = self.getName();
                    var moduleFile = self.module.file;
                    var moduleScript = self.module.script;
                    var moduleExpiration = self.getCacheTime();
                    var moduleURL = self.iaModuleBase + lang + '/' + moduleFile + '.js';
                    var moduleScriptURL = self.iaScriptBase + lang + '/' + moduleScript + '.js';
                    var moduleVersion = iaVersion;
                    hasher.hashElement('../src/modules/' + moduleFile + '', __dirname, {encoding: 'hex'}).then(function (hash) {
                        if (hash.hash) moduleVersion = hash.hash;

                        var moduleImagesURL = self.iaImagesBase;
                        var realQuery = query[0];

                        var jsonResponse = {
                            runtime: "nodejs",
                            template_name: moduleFile,
                            display_name: moduleName,
                            images_path: moduleImagesURL,
                            data: response,
                            query: realQuery,
                            status: "success",
                            cacheExpirationTime: moduleExpiration
                        };

                        if (moduleScript) {
                            jsonResponse.files = [
                                {
                                    "url": moduleURL + '?' + moduleVersion,
                                    "type": "template"
                                },
                                {
                                    "url": moduleScriptURL + '?' + moduleVersion,
                                    "type": "script"
                                }
                            ];
                        } else {
                            jsonResponse.files = [
                                {
                                    "url": moduleURL + '?' + moduleVersion,
                                    "type": "template"
                                }
                            ];
                        }

                        resolve(jsonResponse);
                    });
                })
                .timeout(self.module.timeout, 'Timeout on module')
                .catch(function (error) {
                    if (error.message) error = error.message;
                    reject({error: 200, status: "error", message: error});
                })
        ;
    });
};

module.exports = instant_answer;