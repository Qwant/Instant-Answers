/** instantiates express app  */

require('./binder')(); // require binder for easy access to config properties

var config = require('@qwant/config');
config.import('app'); // main config file (config/app.yml)
config.import('languages'); // language config file (config/languages.yml)

/** sets imported config properties so we can access them easily with config_get */
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

var express = require('express')
    , iaPath = config_get('app.qwant-ia.modules-paths')
    , ia_interface = require("./ia_interface")
    , app = express()
    ;

/** loads modules, launches the IA Solver and launches the app */
function bootstrap() {
    console.info("Loading modules...");
    return require('./ia_module_loader')(ia_interface, iaPath)
            .then(function (loadedModules) {
                return require("./ia_solver")(loadedModules);
            })
            .then(function (ia_solver) {
                return require("./app")(app, ia_solver);
            });
}


module.exports = bootstrap;