const GPSCoordinates = require('../gps_coordinates');
const assert = require('assert');
let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');

var formatSearchTerms = function(terms) {
    var regExp = new RegExp(GPSCoordinates.getKeyword(i18n), 'i');

    return regExp.exec(terms);
};

describe('GPSCoordinates', function() {
    it('Positive decimals coordinate to degrees coordinates', function(done) {
        const values = formatSearchTerms('48.8583701235,2.2922926153');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                latitude: 48.8583701,
                longitude: 2.2922926,
                degrees: '48° 51\' 30.1324" N, 2° 17\' 32.2534" E',
                url: 'https://www.qwant.com/maps/#map=18.00/48.8583701/2.2922926',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Negative decimals coordinate to degrees coordinates', function(done) {
        const values = formatSearchTerms('-22.9519161234,-43.2104872478');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                latitude: -22.9519161,
                longitude: -43.2104872,
                degrees: '22° 57\' 06.898" S, 43° 12\' 37.7541" W',
                url: 'https://www.qwant.com/maps/#map=18.00/-22.9519161/-43.2104872',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Positive degrees coordinate to decimals coordinates', function(done) {
        const values = formatSearchTerms('48° 51\' 30.1324" N 2° 17\' 32.2534" E');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                latitude: 48.8583701,
                longitude: 2.2922926,
                degrees: '48° 51\' 30.1324" N, 2° 17\' 32.2534" E',
                url: 'https://www.qwant.com/maps/#map=18.00/48.8583701/2.2922926',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Negative degrees coordinate to decimals coordinates', function(done) {
        const values = formatSearchTerms('22° 57\' 06.898" S 43° 12\' 37.7541" W');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            assert.deepStrictEqual({
                latitude: -22.9519161,
                longitude: -43.2104872,
                degrees: '22° 57\' 06.898" S, 43° 12\' 37.7541" W',
                url: 'https://www.qwant.com/maps/#map=18.00/-22.9519161/-43.2104872',
            }, result);

            done();
        }, (error) => {
            done(error);
        });
    });

    it('Invalid decimals coordinates', function(done) {
        const values = formatSearchTerms('5379.1579234574,1232.8369487232');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Invalid decimals coordinates.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Invalid degrees coordinates', function(done) {
        const values = formatSearchTerms('753° 75\' 86.2683" N 923° 88\' 67.4218" W');

        GPSCoordinates.getData(values, '', 'en_gb', i18n).then((result) => {
            done('Error should be handled.');
        }, (error) => {
            if (error === 'Invalid degrees coordinates.') {
                done();
            } else {
                done(error);
            }
        });
    });

    it('Convert positive decimal to degree', function(done) {
        const degree = GPSCoordinates._decimalToDegree(48.8583701, 'N', 'S');

        assert.equal(degree, '48° 51\' 30.1324" N');

        done();
    });

    it('Convert negative decimal to degree', function(done) {
        const degree = GPSCoordinates._decimalToDegree(-22.9519161, 'N', 'S');

        assert.equal(degree, '22° 57\' 06.898" S');

        done();
    });

    it('Convert positive degree to decimal', function(done) {
        const decimal = GPSCoordinates._degreeToDecimal(48, 51, 30.1324, true);

        assert.equal(decimal, 48.8583701);

        done();
    });

    it('Convert negative degree to decimal', function(done) {
        const decimal = GPSCoordinates._degreeToDecimal(22, 57, 6.898, false);

        assert.equal(decimal, -22.9519161);

        done();
    });
});
