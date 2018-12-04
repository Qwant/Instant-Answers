const Calculator = require('../calculator');
const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');

describe('Calculator', function() {
    it('Respond with matching records (3x2 = 6)', function(done) {
        let resultPromise = Calculator.getData(['3*2'], '', "en_gb", i18n);
        resultPromise.then((result) => {
            assert.equal(result, 6);
            done()
        }).catch((error) => {
            done(error)
        })
    });

    it('Handling error', function(done) {
        let resultPromise = Calculator.getData(['3****2'], '', "en_gb", i18n);
        resultPromise.then((result) => {
            done('Error should be handled ' + result)
        }).catch((error) => {
            if (error === "Your formula isn't valid") {
                done()
            } else {
                done(error)
            }
        })
    });
});