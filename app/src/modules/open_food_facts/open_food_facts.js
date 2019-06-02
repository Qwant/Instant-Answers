/**
 * OpenFoodFacts Instant Answers
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

var markdown = require( "markdown" ).markdown;

var accounting = require('accounting');

const redisTools = require('../../redis_tools');
redisTools.initRedis();

var apiCaller = require('../../api_caller');

const CACHE_KEY = 'open_food_facts-cache';
const CACHE_EXPIRE = 10800;

module.exports = {
    /**
     * Process requested terms by calling OpenFoodFacts API or with cached data.
     *
     * @param {Array} values Terms to search, caught by regex.
     * @param {String} proxyURL Proxy to use for external API.
     * @param {String} language Current language.
     * @param {Object} i18n Translator.
     * 
     * @return {Object} Data to be displayed.
     * @public
     */
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;

        return new Promise((resolve, reject) => {
            var countryCode;

            // Check if current country is available on Open Food Facts
            // TODO Add missing countries
            switch (language.split('_').pop()) {
                case 'fr':
                    countryCode = 'fr';
                    break;
                case 'it':
                    countryCode = 'it';
                    break;
                case 'gb':
                    countryCode = 'uk';
                    break;
                case 'us':
                    countryCode = 'us';
                    break;
            }

            if (countryCode) {
                const searchTerms = values[values.length - 1];

                const cacheKey = CACHE_KEY + '|' + countryCode + '|' + searchTerms;

                // Use cache to avoid too many requests
                redisTools.getFromCache(cacheKey).then((cachedData) => {
                    var cachedProduct;

                    if (cachedData) {
                        try {
                            cachedProduct = JSON.parse(cachedData);
                        } catch (e) {
                            // Do nothing, we will try to call the API
                        }
                    }
                    
                    if (cachedProduct) {
                        resolve(this._formatProduct(cachedProduct, i18n));
                    } else {
                        let apiURL = 'https://' + countryCode + '.openfoodfacts.org/cgi/search.pl?search_terms=' + encodeURIComponent(searchTerms) + '&search_simple=1&action=process&json=1';

                        const responseStructure = {
                            count:      'number',
                            page_size:  'string',
                            skip:       'number',
                            page:       'string',
                            products: [
                                'object'
                            ]
                        };

                        apiCaller.call(apiURL, responseStructure, proxyURL, this.timeout, redisTools).then((response) => {
                            if (response && response.products) {
                                if (response.products.length > 0) {
                                    const languageCode = language.split('_').shift();

                                    const product = {
                                        name:           response.products[0]['product_name'],
                                        image:          response.products[0]['image_front_small_url'],
                                        code:           response.products[0]['code'],
                                        ingredients:    response.products[0]['ingredients_text_' + languageCode],
                                        url:            response.products[0]['url'],
                                        nutriments:     {
                                            energyJoules:           response.products[0].nutriments['energy_100g'],
                                            energyCalories:         (response.products[0].nutriments['energy_100g'] ? response.products[0].nutriments['energy_100g'] / 4.184 : null), // In theory we can use "energy_value" field, but sometimes the value is incorrect
                                            fat:                    response.products[0].nutriments['fat'],
                                            saturatedFat:           response.products[0].nutriments['saturated-fat_100g'],
                                            carbohydrates:          response.products[0].nutriments['carbohydrates'],
                                            carbohydratesSugars:    response.products[0].nutriments['sugars_value'],
                                            proteins:               response.products[0].nutriments['proteins'],
                                            salt:                   response.products[0].nutriments['salt'],
                                        },
                                    };

                                    redisTools.saveToCache(cacheKey, product, CACHE_EXPIRE);

                                    resolve(this._formatProduct(product, i18n));
                                } else {
                                    reject('Error: No results.');
                                }
                            } else {
                                reject('Error: Invalid API response.');
                            }
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                });
            } else {
                reject('Open Food Facts isn\'t available for current country.');
            }
        });
    },

    /**
     * Format a product to be ready to be displayed on view.
     *
     * @param {Object} product Product to format.
     * @param {Object} i18n Translator.
     * 
     * @return {Object} Formated product for view.
     * @private
     */
    _formatProduct: function(product, i18n) {
        var ingredients = null;

        if (product.ingredients) {
            try {
                ingredients = markdown.toHTML(product.ingredients)
            } catch (e) {
            }
        }

        return {
            name:           product.name,
            image:          product.image,
            code:           product.code,
            ingredients:    ingredients,
            url:            product.url,
            nutriments:     {
                energyJoules:           this._formatKilojoules(product.nutriments.energyJoules, i18n),
                energyCalories:         this._formatKilocalories(product.nutriments.energyCalories, i18n),
                fat:                    this._formatGrams(product.nutriments.fat, i18n),
                saturatedFat:           this._formatGrams(product.nutriments.saturatedFat, i18n),
                carbohydrates:          this._formatGrams(product.nutriments.carbohydrates, i18n),
                carbohydratesSugars:    this._formatGrams(product.nutriments.carbohydratesSugars, i18n),
                proteins:               this._formatGrams(product.nutriments.proteins, i18n),
                salt:                   this._formatGrams(product.nutriments.salt, i18n),
            }
        }
    },

    /**
     * Format number of kilojoules.
     *
     * @param {Number} kilojoules Number of kilojoules.
     * @param {Object} i18n Translator.
     * 
     * @return {String} Formated kilojoules.
     * @private
     */
    _formatKilojoules: function(kilojoules, i18n) {
        if ((kilojoules === undefined) || (kilojoules === null) || (kilojoules <= 0)) {
            return '-';
        } else {
            return i18n._('kilojoules_number', 'open_food_facts', { value: this._formatNumber(kilojoules, i18n, 0) });
        }
    },

    /**
     * Format number of kilocalories.
     *
     * @param {Number} kilocalories Number of kilocalories.
     * @param {Object} i18n Translator.
     * 
     * @return {String} Formated kilocalories.
     * @private
     */
    _formatKilocalories: function(kilocalories, i18n) {
        if ((kilocalories === undefined) || (kilocalories === null) || (kilocalories <= 0)) {
            return '-';
        } else {
            return i18n._('kilocalories_number', 'open_food_facts', { value: this._formatNumber(kilocalories, i18n, 0) });
        }
    },

    /**
     * Format number of grams.
     *
     * @param {Number} grams Number of grams.
     * @param {Object} i18n Translator.
     * 
     * @return {String} Formated grams.
     * @private
     */
    _formatGrams: function(grams, i18n) {
        if ((grams === undefined) || (grams === null)) {
            return '-';
        } else {
            return i18n._('grams_number', 'open_food_facts', { value: this._formatNumber(grams, i18n, (grams > 1 ? 1 : 2)) });
        }
    },

    /**
     * Format number for view, with correct thousand separator, decimals separator...).
     *
     * @param {Number} number Number to format.
     * @param {Object} i18n Translator.
     * @param {Number} precision Number to format.
     * 
     * @return {String} Formated number.
     * @private
     */
    _formatNumber: function(number, i18n, precision) {
        return accounting.formatNumber(number, {
            precision: precision,
            decimal: i18n._('decimal_point', 'open_food_facts'),
            thousand: i18n._('thousands_separator', 'open_food_facts')
        });
    },

    /**
     * IA's name.
     * @public
     */
    name: "Open Food Facts",

    /**
     * Keyword to activate IA.
     * 
     * @param {Object} i18n Translator.
     * 
     * @return {String} Keyword.
     * @public
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("keyword", "open_food_facts");
    },

    /**
     * IA's public script.
     * @public
     */
    script: "open_food_facts",

    /**
     * IA's trigger: keyword + string
     * @public
     */
    trigger: "start",

    /**
     * Insensitive trigger.
     * @public
     */
    flag: "i",

    /**
     * Time before the response is considered as canceled (in milliseconds).
     * FIXME The API is very slow and not usable on production environment.
     * @public
     */
    timeout: 36000,

    /**
     * Cache duration.
     * @public
     */
    cache: CACHE_EXPIRE,
};
