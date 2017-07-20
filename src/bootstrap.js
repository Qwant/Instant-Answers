/** instantiates express app  */

var express = require('express')
    , iaPath = config_get('app.qwant-ia.modules-paths')
    , ia_interface = require("./ia_interface")
    , app = express()
    ;

/** loads modules, launches the IA Solver and launches the app */
function bootstrap() {
    var winston = require('winston');
    var logger = winston.loggers.get('logger');
    logger.info("Loading modules...");
    return require('./ia_module_loader')(ia_interface, iaPath)
            .then(function (loadedModules) {
                return require("./ia_solver")(loadedModules);
            })
            .then(function (ia_solver) {
                return require("./app")(app, ia_solver);
            });
}


module.exports = bootstrap;