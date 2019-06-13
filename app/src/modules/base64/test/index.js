const Base64 = require('../base64');
const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');

describe('Base64', function() {
    it('Explicit encode', function(done) {
        const values = [
            'base64 encode lorem ipsum',
            'base64 encode',
            ' encode',
            ' ',
            undefined,
            'lorem ipsum',
        ];

        Base64.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                action: 'encode',
                data: 'lorem ipsum',
                result: 'bG9yZW0gaXBzdW0=',
                type: 'text',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Implicit encode', function(done) {
        const values = [
            'base64 lorem ipsum',
            'base64',
            '',
            undefined,
            undefined,
            'lorem ipsum',
        ];

        Base64.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                action: 'encode',
                data: 'lorem ipsum',
                result: 'bG9yZW0gaXBzdW0=',
                type: 'text',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Explicit decode', function(done) {
        const values = [
            'base64 decode bG9yZW0gaXBzdW0=',
            'base64 decode',
            ' decode',
            ' ',
            undefined,
            'bG9yZW0gaXBzdW0=',
        ];

        Base64.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                action: 'decode',
                data: 'bG9yZW0gaXBzdW0=',
                result: 'lorem ipsum',
                type: 'text',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Implicit decode', function(done) {
        const values = [
            'base64 bG9yZW0gaXBzdW0=',
            'base64',
            '',
            undefined,
            undefined,
            'bG9yZW0gaXBzdW0=',
        ];

        Base64.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                action: 'decode',
                data: 'bG9yZW0gaXBzdW0=',
                result: 'lorem ipsum',
                type: 'text',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });
});