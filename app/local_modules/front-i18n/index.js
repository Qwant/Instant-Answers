let tools = require('./tool');

module.exports = Front_i18n;

function Front_i18n () {
    this.isDevelopmentMode = null;
    this.langOrder = null;
    this.dictionnaries = null;
    this.i18n = null;
    this.tools = tools;
    this.generateDictionary = require('./tasks/generate-dictionary');
    this.monitor = require('./tasks/monitor');
    this._ = this._.bind(this);
    this._n = this._n.bind(this);
}

Front_i18n.prototype._ = function (key, context, placeholders) {
    if (key === undefined || key === "") {
        return  "<span style=\'color:#D25717\'>Nothing to translate</span>";
    }

    var options = this.getDictionnary(key,context);
    var i18n = options.i18n;
    var nbFallbacks = options.nbFallbacks;
    if (i18n) {
        if (this.langOrder[0] === "en_gb" && i18n.entries[context][key] === "")
            return this.replacePlaceholders(key, placeholders);
        if (this.isDevelopmentMode && nbFallbacks === 1)
            return this.replacePlaceholders(i18n.entries[context][key], placeholders) + '<span style=\'color:#D25717\'>*</span>';
        if (this.isDevelopmentMode && nbFallbacks > 1)
            return this.replacePlaceholders(i18n.entries[context][key], placeholders) + '<span style=\'color:#D25717\'>**</span>';
        return this.replacePlaceholders(i18n.entries[context][key], placeholders);
    }


    else if (this.isDevelopmentMode)
        return this.replacePlaceholders(key, placeholders) + '<span style=\'color:#D25717\'>*o</span>';
    else
        return this.replacePlaceholders(key, placeholders);
};

Front_i18n.prototype.setup = function (options) {
    this.isDevelopmentMode =    options.isDevelopmentMode;
    this.langOrder =            options.langOrder;
    this.dictionnaries =        options.dictionnaries;

    return this;
};

Front_i18n.prototype.replacePlaceholders = function (string, placeholders) {
    for (var placeholdersKey in placeholders) {
        var placeholder = new RegExp('{' + placeholdersKey + '}', 'g');
        string = string.replace(placeholder, placeholders[placeholdersKey])
    }
    return string;
};

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
Front_i18n.prototype._n = function (key1, key2, count, context, placeholders) {
    context = context || '';

    var options = this.getDictionnary(key2,context);
    var i18n = options.i18n;
    var langCode = options.langCode;

    if ((this.langOrder[0] === "en_gb" ||  langCode === 'en_gb') && count === 1) {
        key1 = this.replacePlaceholders(key1, placeholders);
        return key1.replace(/%d/g, count);
    }

    var tmp;
    if (i18n) {
        var pluralKey = +(i18n.getPlural(count));
        if (i18n["entries"][context][key2]
            && i18n["entries"][context][key2][0]) {
            return this.replacePlaceholders(i18n["entries"][context][key2][pluralKey], placeholders).replace(/%d/g, count);
        }
        tmp = count === 1 ? key1 : key2;
        key2 = this.replacePlaceholders(tmp, placeholders);

        var key = key2.replace(/%d/g, count);
        if (langCode !== 'en_gb' && this.isDevelopmentMode === true) {
            return key + '<span style=\'color:#D25717\'>*</span>';
        }
        return key;
    }

    tmp = count === 1 ? key1 : key2;
    key2 = this.replacePlaceholders(tmp, placeholders);
    return key2.replace(/%d/g, count);
};

Front_i18n.prototype.getPlural = function (count){
    return 0;
};

Front_i18n.prototype.getDictionnary = function (key, context) {

    var i18n = false;
    var nbFallbacks = 0;
    var langCode = false;

    for (var langkey in this.langOrder) {
        if (this.dictionnaries[this.langOrder[langkey]] === undefined || this.dictionnaries[this.langOrder[langkey]] === undefined){
            continue;
        }

        if(typeof this.dictionnaries[this.langOrder[langkey]]["entries"][context] !== "undefined" && typeof this.dictionnaries[this.langOrder[langkey]]["entries"][context][key] !== "undefined" && !(this.dictionnaries[this.langOrder[langkey]]["entries"][context][key].length === 0)){
            i18n = this.dictionnaries[this.langOrder[langkey]];
            langCode = this.langOrder[langkey];
            break;
        }
        nbFallbacks++;
    }

    return {
        langCode : langCode,
        i18n : i18n,
        nbFallbacks : nbFallbacks
    };

};
