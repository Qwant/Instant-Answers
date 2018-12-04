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
instant_answer.prototype.buildPattern = function (i18n) {
    var keyword = (this.module.keyword) ? this.module.keyword : this.module.getKeyword(i18n);
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
instant_answer.prototype.testQuery = function (query, i18n) {
    return this.getPattern(i18n).test(query);
};

/**
 * @returns {RegExp} Call buildPattern to get the regex
 */
instant_answer.prototype.getPattern = function (i18n) {
    return this.buildPattern(i18n);
};

/**
 * @returns {string} Get the translated name
 */
instant_answer.prototype.getName = function (i18n) {
    return (this.module.name) ? this.module.name : this.module.getName(i18n);
};

/**
 * @returns {Array} Get all the capturing groups
 */
instant_answer.prototype.execQuery = function (query, i18n) {
    return this.getPattern(i18n).exec(query);
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
instant_answer.prototype.solveData = function (query, lang, i18n) {
    var it = this;
    return new Promise(function (resolve, reject) {
        var iaData = it.module.getData(query, it.proxyURL, lang, i18n);
        var isPromise = !!iaData["then"];
        if (!isPromise) iaData = Promise.resolve(iaData);

        iaData
            .then(function (response) {
                var moduleName = it.getName(i18n);
                var moduleFile = it.module.file;
                var moduleScript = it.module.script;
                var moduleExpiration = it.getCacheTime();
                var moduleURL = it.iaModuleBase + lang + '/' + moduleFile + '.js';
                var moduleScriptURL = it.iaScriptBase + lang + '/' + moduleScript + '.js';
                var moduleVersion = iaVersion;
                hasher.hashElement('../src/modules/' + moduleFile + '', __dirname, {encoding: 'hex'}).then(function (hash) {
                    if (hash.hash) moduleVersion = hash.hash;

                    var moduleImagesURL = it.iaImagesBase;
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
            .timeout(it.module.timeout)
            .catch(function (error) {
                if (error.message) error = error.message;
                reject({error: 200, status: "error", message: error});
            })
        ;
    });
};

module.exports = instant_answer;