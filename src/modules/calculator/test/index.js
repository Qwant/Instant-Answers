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

	it('Respond with fixed notation (1 * 100000 = 100000)', function(done) {
		let resultPromise = Calculator.getData(['1 * 100000']);
		resultPromise.then((result) => {
			assert.equal(result, 100000);
			assert.notEqual(result.toString(), '1e+5');
			done()
		}).catch((error) => {
			done(error)
		})
	});

	it('Respond with no extra zero precision (1 * 1.10 = 1.1)', function(done) {
		let resultPromise = Calculator.getData(['1 * 1.10']);
		resultPromise.then((result) => {
			assert.equal(result, 1.1);
			assert.notEqual(result.toString(), '1.10');
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