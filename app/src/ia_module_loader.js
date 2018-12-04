var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var winston = require('winston');
var logger = winston.loggers.get('logger');

module.exports = function (ia_interface, modelPath) {

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
        var leftovers = [];
        nativeModels.forEach(function(nativeModel) {
            var nativeModulePath = path.resolve(__dirname, '../', modelPath, nativeModel, nativeModel);
            modules.push(loadModule(nativeModel, nativeModulePath));
        });

        leftovers = modules.filter(function(module) {
            return !!module && isNaN(module.order);
        });

        modules = modules.filter(function(module) {
            return !!module && !isNaN(module.order);
        });

        modules = modules.sort(function(a, b) {
            if (a.order === null) {
                return 1;
            } else if (b.order === null) {
                return -1;
            } else {
                return a.order - b.order;
            }
        });

        modules = modules.concat(leftovers);

        logger.info("IA Order:", modules.map((mod) => { return `${!isNaN(mod.order) ? mod.order : `no order`}: ${mod.file}` }).join(', '));

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