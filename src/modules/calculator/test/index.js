const Calculator = require('../calculator');
const assert = require('assert');


describe('Calculator', function() {
	it('Respond with matching records (3x2 = 6)', function(done) {
		let resultPromise = Calculator.getData(['3*2']);
		resultPromise.then((result) => {
			assert.equal(result, 6);
			done()
		}).catch((error) => {
			done(error)
		})
	});

	it('Handling error', function(done) {
		let resultPromise = Calculator.getData(['3****2']);
		resultPromise.then((result) => {
			// assert(false, 'Error should be handled')
			done('Error should be handled')
		}).catch((error) => {
			done()
		})
	});
});