const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');
var proxyquire =  require('proxyquire');

describe('OpenFoodFacts', function() {
    it('Success reponse from API', function(done) {
        const OpenFoodFacts = proxyquire('../open_food_facts', {
            '../../redis_tools': { // redisTools
                // Simulate no cache
                getFromCache: function(cacheKey) {
                    return new Promise((resolve, reject) => {
                        resolve(null);
                    });
                },
            },
            '../../api_caller': { // apiCaller
                // Simulate success response from OpenFoodFacts API
                call: function(apiURL, responseStructure, proxyURL, timeout, redisTools) {
                    return new Promise((resolve, reject) => {
                        resolve({
                            'skip': 0,
                            'count': 199,
                            'page_size': '20',
                            'page': '1',
                            'products': [
                                {
                                    'product_name': 'Nutella from API',
                                    'image_front_small_url': 'https://static.openfoodfacts.org/images/products/301/762/042/9484/front_fr.219.200.jpg',
                                    'code': '3017620429484',
                                    'ingredients_text_en': 'Sugar, Palm Oil, Hazelnuts (13%), Fat-Reduced Cocoa (7.4%), Skimmed Milk Powder (6.6%), Whey Powder (Milk), Emulsifier: Lecithin (Soya), Vanillin',
                                    'url': 'https://fr.openfoodfacts.org/produit/3017620429484/nutella-ferrero',
                                    'nutriments': {
                                        'energy_100g': 2278,
                                        'fat': 31.6,
                                        'saturated-fat_100g': 11,
                                        'carbohydrates': 57.6,
                                        'sugars_value': 56.8,
                                        'proteins': 6,
                                        'salt': 0.114,
                                    },
                                },
                            ],
                        });
                    });
                },
            },
        });

        OpenFoodFacts.getData([ 'calories nutella', 'calories', 'nutella' ], '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                name: 'Nutella from API',
                image: 'https://static.openfoodfacts.org/images/products/301/762/042/9484/front_fr.219.200.jpg',
                code: '3017620429484',
                ingredients: '<p>Sugar, Palm Oil, Hazelnuts (13%), Fat-Reduced Cocoa (7.4%), Skimmed Milk Powder (6.6%), Whey Powder (Milk), Emulsifier: Lecithin (Soya), Vanillin</p>',
                url: 'https://fr.openfoodfacts.org/produit/3017620429484/nutella-ferrero',
                nutriments: {
                    energyJoules: '2,278 kJ',
                    energyCalories: '544 kcal',
                    fat: '31.6g',
                    saturatedFat: '11.0g',
                    carbohydrates: '57.6g',
                    carbohydratesSugars: '56.8g',
                    proteins: '6.0g',
                    salt: '0.11g',
                },
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Success reponse from cache', function(done) {
        const OpenFoodFacts = proxyquire('../open_food_facts', {
            '../../redis_tools': { // redisTools
                // Simulate cached data
                getFromCache: function(cacheKey) {
                    return new Promise((resolve, reject) => {
                        resolve(`{
                            "name": "Nutella from Cache",
                            "image": "https://static.openfoodfacts.org/images/products/301/762/042/9484/front_fr.219.200.jpg",
                            "code": "3017620429484",
                            "ingredients": "Sugar, Palm Oil, Hazelnuts (13%), Fat-Reduced Cocoa (7.4%), Skimmed Milk Powder (6.6%), Whey Powder (Milk), Emulsifier: Lecithin (Soya), Vanillin",
                            "url": "https://fr.openfoodfacts.org/produit/3017620429484/nutella-ferrero",
                            "nutriments": {
                                "energyJoules": 2278,
                                "energyCalories": 544.455,
                                "fat": 31.6,
                                "saturatedFat": 11,
                                "carbohydrates": 57.6,
                                "carbohydratesSugars": 56.8,
                                "proteins": 6,
                                "salt": 0.114
                            }
                        }`);
                    });
                },
            },
        });

        OpenFoodFacts.getData([ 'calories nutella', 'calories', 'nutella' ], '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                name: 'Nutella from Cache',
                image: 'https://static.openfoodfacts.org/images/products/301/762/042/9484/front_fr.219.200.jpg',
                code: '3017620429484',
                ingredients: '<p>Sugar, Palm Oil, Hazelnuts (13%), Fat-Reduced Cocoa (7.4%), Skimmed Milk Powder (6.6%), Whey Powder (Milk), Emulsifier: Lecithin (Soya), Vanillin</p>',
                url: 'https://fr.openfoodfacts.org/produit/3017620429484/nutella-ferrero',
                nutriments: {
                    energyJoules: '2,278 kJ',
                    energyCalories: '544 kcal',
                    fat: '31.6g',
                    saturatedFat: '11.0g',
                    carbohydrates: '57.6g',
                    carbohydratesSugars: '56.8g',
                    proteins: '6.0g',
                    salt: '0.11g',
                },
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Success empty reponse from API', function(done) {
        const OpenFoodFacts = proxyquire('../open_food_facts', {
            '../../redis_tools': { // redisTools
                // Simulate no cache
                getFromCache: function(cacheKey) {
                    return new Promise((resolve, reject) => {
                        resolve(null);
                    });
                },
            },
            '../../api_caller': { // apiCaller
                // Simulate success response from OpenFoodFacts API with no results
                call: function(apiURL, responseStructure, proxyURL, timeout, redisTools) {
                    return new Promise((resolve, reject) => {
                        resolve({
                            'skip': 0,
                            'count': 0,
                            'page_size': '20',
                            'page': '1',
                            'products': [],
                        });
                    });
                },
            },
        });

        OpenFoodFacts.getData([ 'calories nutella', 'calories', 'nutella' ], '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Error: No results.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Malformed reponse from API', function(done) {
        const OpenFoodFacts = proxyquire('../open_food_facts', {
            '../../redis_tools': { // redisTools
                // Simulate no cache
                getFromCache: function(cacheKey) {
                    return new Promise((resolve, reject) => {
                        resolve(null);
                    });
                },
            },
            '../../api_caller': { // apiCaller
                // Simulate success response from OpenFoodFacts API with no results
                call: function(apiURL, responseStructure, proxyURL, timeout, redisTools) {
                    return new Promise((resolve, reject) => {
                        resolve({
                            'code': 500,
                            'error': 'Fatal error',
                        });
                    });
                },
            },
        });

        OpenFoodFacts.getData([ 'calories nutella', 'calories', 'nutella' ], '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Error: Invalid API response.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Check successfully formated kilojoules', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedKilojoules = OpenFoodFacts._formatKilojoules(1762.18, i18n);

        assert.equal(formatedKilojoules, '1,762 kJ');

        done();
    });

    it('Check empty formated kilojoules', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedKilojoules = OpenFoodFacts._formatKilojoules(0, i18n);

        assert.equal(formatedKilojoules, '-');

        done();
    });

    it('Check successfully formated kilocalories', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedKilocalories = OpenFoodFacts._formatKilocalories(1762.18, i18n);

        assert.equal(formatedKilocalories, '1,762 kcal');

        done();
    });

    it('Check empty formated kilocalories', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedKilocalories = OpenFoodFacts._formatKilocalories(0, i18n);

        assert.equal(formatedKilocalories, '-');

        done();
    });

    it('Check successfully formated grams (lower than 1)', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedGrams = OpenFoodFacts._formatGrams(0.189, i18n);

        assert.equal(formatedGrams, '0.19g');

        done();
    });

    it('Check successfully formated grams (greater than 1)', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedGrams = OpenFoodFacts._formatGrams(87.189, i18n);

        assert.equal(formatedGrams, '87.2g');

        done();
    });

    it('Check empty formated grams', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        const formatedGrams = OpenFoodFacts._formatGrams(null, i18n);
        
        assert.equal(formatedGrams, '-');

        done();
    });

    it('Handling non supported country', function(done) {
        const OpenFoodFacts = require('../open_food_facts');

        let resultPromise = OpenFoodFacts.getData(['calories nutella', 'calories', 'nutella'], '', 'es_es', i18n);

        resultPromise.then((result) => {
            done('Error should be handled ' + result)
        }).catch((error) => {
            if (error === 'Open Food Facts isn\'t available for current country.') {
                done();
            } else {
                done(error);
            }
        })
    });
});