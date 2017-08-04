var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');

module.exports = function (ia_interface, modelPath) {

    this.logger = require('@qwant/front-logger')(config_get('app.qwant-ia.logConfig'));  // setup Logger configuration (see app.yml)
    this.ia_interface = ia_interface;
    this.modelPath = modelPath;

    return readModels.bind(this)()
        .then(require_models.bind(this))
        .then(wrap_models.bind(this))
        ;
};

/**
 * Get modules from modules folder
 * @returns {promise}
 */
function readModels() {
    var modelPath = path.resolve(__dirname,'../', this.modelPath);
    var logger = this.logger;
    return new Promise(function (resolve, reject) {
        fs.readdir(modelPath, function (err, files) {
            if (err) {
                logger.error('Failed reading modules from init in directory: ' + modelPath);
                reject(false);
            }
            resolve({nativeModels : files});
        });
    });

}

/**
 * Tests if modules are valid and loads them with require()
 * @param models
 * @returns {*|bluebird}
 */
function require_models(models) {
    var nativeModels = models.nativeModels;
    var modelPath = this.modelPath;

    return new Promise(function (resolve, reject) {
        var modules = [];
        nativeModels.forEach(function(nativeModel) {
            var nativeModulePath = path.resolve(__dirname, '../', modelPath, nativeModel, nativeModel);
            modules.push(loadModule(nativeModel, nativeModulePath));
        });

        modules = modules.filter(function(module) {
            return !!module
        });

        resolve(modules);
    });
}

/**
 * Load specific module
 * @param modelName
 * @param path
 * @returns {module}
 */
function loadModule(modelName, path) {

    var module;

    try {
        if (config_get('app.qwant-ia.excludedIA').indexOf(modelName) == -1) {
            module = require(path);
        } else {
            throw modelName + ' not loaded (excluded)';
        }
    } catch (e) {
        logger.info(e.toString(), {module: "ia module loader"});
        return null;
    }

    module.file = modelName;
    logger.info(modelName + ' loaded');
    return module

}

/**
 * Wraps modules inside interface (see ia_interface.js)
 * @param modules
 * @returns {*|bluebird}
 */
function wrap_models(modules) {
    var ia_interface = this.ia_interface;

    return new Promise(function (resolve, reject) {
        var wrapped = modules.map(function (module) {
            return new ia_interface(module);
        });
        resolve(wrapped);
    })
}