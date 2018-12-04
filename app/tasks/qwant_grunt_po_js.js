/**
 * sets language files to generate (.js) from .po files
 */

module.exports = function () {
    var options = {};
    options.nodeModule = true;
    options.target = {};
    options.target.files = {};

    require('../src/binder')();

    var config = require('@qwant/config');
    config.import('languages');

    Object.keys(config).forEach(function(elem) {
        config_set(elem, config[elem]);
    });

    var languages = config_get('languages.languages');

    Object.keys(languages).forEach(function(key){
        var language = languages[key];
        var poName = language.match;
        var code = language.code;
        options.target.files["lang/" + code + ".js"] = "./lang_src/" + poName + ".po";
    });

    return options;
};