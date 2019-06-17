const BrainfuckInterpreter = require('../brainfuck_interpreter');
const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');

describe('BrainfuckInterpreter', function() {
    it('Working code with result', function(done) {
        const values = [
            '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.',
            '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.',
        ];

        BrainfuckInterpreter.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.equal(result.result, 'Hello World!');

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Working code without result', function(done) {
        const values = [
            '++++++++++[>+++++++>++++++++++>+++>+<<<<-]',
            '++++++++++[>+++++++>++++++++++>+++>+<<<<-]',
        ];

        BrainfuckInterpreter.getData(values, '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Empty result.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Inifinite loop', function(done) {
        const values = [
            '++++++++++[>+++++++>++++]++++++>+++>+<<<<-]',
            '++++++++++[>+++++++>++++]++++++>+++>+<<<<-]',
        ];

        BrainfuckInterpreter.getData(values, '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Error: Too much instructions.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Syntax error', function(done) {
        const values = [
            '<<<[>+++++++>++++++++++>+++>+<<<<-]',
            '<<<[>+++++++>++++++++++>+++>+<<<<-]',
        ];

        BrainfuckInterpreter.getData(values, '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Error: Syntax error at char 0.') {
                done();
            } else {
                done(error);
            }
        });
    });
});