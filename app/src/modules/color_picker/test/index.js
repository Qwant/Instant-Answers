const ColorPicker = require('../color_picker');
const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');

describe('Colorpicker', function() {
    it('Respond with the color asked at the end of the query', function(done) {
        let resultPromise = ColorPicker.getData(['color picker red',null,'color picker','color picker','red'], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result, "red");
            done()
        }).catch((error) => {
            done(error)
        })
    });

    it('Respond with the color asked at the beginning of the query', function(done) {
        let resultPromise = ColorPicker.getData(['orange color picker','orange','color picker','color picker',null], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result,"orange");
            done()
        }).catch((error) => {
            done(error)
        })
    });

    it('Respond with the color asked at the end of the query when two colors are asked (end and beginning)', function(done) {
        let resultPromise = ColorPicker.getData(['green color picker yellow','green','color picker','color picker','yellow'], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result,"yellow");
            done()
        }).catch((error) => {
            done(error)
        })
    });

    it('Respond with the default color when no color is asked in the query', function(done) {
        let resultPromise = ColorPicker.getData(['color picker',null,'color picker','color picker',null], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result, "blue");
            done()
        }).catch((error) => {
            done(error)
        })
    });

    it('Respond with the color asked at the beginning of the query when IA is called with picker color', function(done) {
        let resultPromise = ColorPicker.getData(['orange picker color','orange','picker color','picker color',null], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result,"orange");
            done()
        }).catch((error) => {
            done(error)
        })
    });
});