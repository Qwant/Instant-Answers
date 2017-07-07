/**
 * builds the language dictionnaries from language settings
 * @param lang
 */

module.exports = function (lang) {

    var i18n = require('@qwant/front-i18n');
    var path = require('path');
    var isDevelopmentMode = process.env.ENV === 'dev';

    var langOrder = [lang, config_get('languages.options.default')];
    var winston = require('winston');
    var logger = winston.loggers.get('logger');
    var dictionnaries = {};

    langOrder.forEach(function (langkey) {
        var langFileName = path.join('..', 'lang', langkey + ".js");
        try {
            dictionnaries[langkey] = require(langFileName)() || {};
        } catch (e) {
            logger.critical('LANGUAGE FILE NOT FOUND : ' + langFileName);
        }
    });

    try {
        i18n.setup({
            isDevelopmentMode: isDevelopmentMode,
            langOrder: langOrder,
            dictionnaries: dictionnaries
        });
    } catch (e) {
        logger.error(e);
    }
};