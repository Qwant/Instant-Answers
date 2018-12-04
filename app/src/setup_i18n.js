/**
 * builds the language dictionnaries from language settings
 * @param lang
 */

module.exports = function (lang, defaultLang) {
    var i18n = require('@qwant/front-i18n');
    i18n = new i18n();
    var path = require('path');
    var isDevelopmentMode = process.env.ENV === 'dev';

    var langOrder = [lang, defaultLang];
    var winston = require('winston');
    var logger = winston.loggers.get('logger');
    var dictionnaries = {};

    langOrder.forEach(function (langkey) {
        var langFileName = path.join('..', 'lang', langkey + ".js");
        try {
            dictionnaries[langkey] = require(langFileName)() || {};
        } catch (e) {
            logger.error('LANGUAGE FILE NOT FOUND : ' + langFileName);
        }
    });

    try {
        i18n = i18n.setup({
            isDevelopmentMode: isDevelopmentMode,
            langOrder: langOrder,
            dictionnaries: dictionnaries
        });

        return i18n;
    } catch (e) {
        logger.error(e);
        return null;
    }
};