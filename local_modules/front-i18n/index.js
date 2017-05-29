var tools = require('./tool');

module.exports = function () {

    function _(key, context, placeholders) {

        if (key === undefined || key === "") {
            return  "<span style=\'color:#D25717\'>Nothing to translate</span>";
        }

        if (langOrder[0] === "en_gb") {
            return replacePlaceholders(key, placeholders);
        }
        var options = getDictionnary(key,context);
        var i18n = options.i18n;
        var nbFallbacks = options.nbFallbacks;
        if (i18n) {
            if (isDevelopmentMode && nbFallbacks === 1)
                return replacePlaceholders(i18n.entries[context][key], placeholders) + '<span style=\'color:#D25717\'>*</span>';
            if (isDevelopmentMode && nbFallbacks > 1)
                return replacePlaceholders(i18n.entries[context][key], placeholders) + '<span style=\'color:#D25717\'>**</span>';
            return replacePlaceholders(i18n.entries[context][key], placeholders);
        }


        else if (isDevelopmentMode)
            return replacePlaceholders(key, placeholders) + '<span style=\'color:#D25717\'>*o</span>';
        else
            return replacePlaceholders(key, placeholders);
    }



    /**
     * pluralize gettext function
     * @param key1 dictionary key singular
     * @param key2 dictionary key plural
     * @param count cardinality
     * @param context : poedit context
     * @param placeholders : data for placeholders {}
     * @returns string translated using singular or plural
     * @private
     */
        function _n(key1, key2, count, context, placeholders) {
        context = context || '';

        var options = getDictionnary(key2,context);
        var i18n = options.i18n;
        var nbFallbacks = options.nbFallbacks;
        var langCode = options.langCode;

        if ((langOrder[0] === "en_gb" ||  langCode == 'en_gb') && count == 1) {
            key1 = replacePlaceholders(key1, placeholders);
            return key1.replace(/%d/g, count);
        }


        if (i18n) {
            var pluralKey = +(i18n.getPlural(count));
            if (i18n["entries"][context][key2]
                && i18n["entries"][context][key2][pluralKey]) {
                return replacePlaceholders(i18n["entries"][context][key2][pluralKey], placeholders).replace(/%d/g, count);
            }
            var tmp = count == 1 ? key1 : key2;
            key2 = replacePlaceholders(tmp, placeholders);

            var key = key2.replace(/%d/g, count);
            if (langCode != 'en_gb' && isDevelopmentMode == true) {
                return key + '<span style=\'color:#D25717\'>*</span>';
            }
            return key;
        }

        var tmp = count == 1 ? key1 : key2;
        key2 = replacePlaceholders(tmp, placeholders);
        return key2.replace(/%d/g, count);
    }

    return {
        tools : tools,
        isDevelopmentMode : null,
        langOrder : null,
        dictionnaries : null,
        i18n : null,

        setup : function(options)
        {

            isDevelopmentMode =    options.isDevelopmentMode;
            langOrder =            options.langOrder;
            dictionnaries =        options.dictionnaries;

        },
        _ : _,
        _n : _n,
        generateDictionary : require('./tasks/generate-dictionary'),
        monitor : require('./tasks/monitor')


/**
 * gettext function
 * @param key dictionary key
 * @param context : hidden param for poedit context
 * @param placeholders : data for placeholders
 * @returns string translated
 * @private
 */

    };

    function replacePlaceholders(string, placeholders) {
        for (var placeholdersKey in placeholders) {
            var placeholder = new RegExp('{' + placeholdersKey + '}', 'g');
            string = string.replace(placeholder, placeholders[placeholdersKey])
        }
        return string;
    }

    function getPlural (count){
        return 0;
    }

    function getDictionnary (key, context) {

        var i18n = false;
        var nbFallbacks = 0;
        var langCode = false;


        for (var langkey in langOrder){
            if (dictionnaries[langOrder[langkey]] == undefined || dictionnaries[langOrder[langkey]] == undefined){
                continue;
            }

            if(typeof dictionnaries[langOrder[langkey]]["entries"][context] !== "undefined" && typeof dictionnaries[langOrder[langkey]]["entries"][context][key] !== "undefined" && !(dictionnaries[langOrder[langkey]]["entries"][context][key].length === 0)){
                i18n = dictionnaries[langOrder[langkey]];
                langCode = langOrder[langkey];
                break;
            }
            nbFallbacks++;
        }

        return {
            langCode : langCode,
            i18n : i18n,
            nbFallbacks : nbFallbacks
        };

    }

}();
