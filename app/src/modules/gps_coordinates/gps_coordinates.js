/**
 * GPS Coordinates Instant Answers
 * 
 * Improvements ideas:
 *  - Add Qwant Maps screenshot.
 *  - Add location's name.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

module.exports = {
    /**
     * Convert coordinates (degrees or decimals).
     *
     * @param {Array} values Coordinates to convert, caught by regex.
     * @param {String} proxyURL Proxy to use for external API.
     * @param {String} language Current language.
     * @param {Object} i18n Translator.
     * 
     * @return {Object} Data to be displayed.
     * @public
     */
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;

        const N = _('N', 'gps_coordinates');
        const S = _('S', 'gps_coordinates');
        const E = _('E', 'gps_coordinates');
        const W = _('W', 'gps_coordinates');

        return new Promise((resolve, reject) => {
            if (values[2] !== undefined) { // Convert decimals to degrees
                const latitude = parseFloat(values[2] + values[3] + '.' + values[5]);
                const longitude = parseFloat(values[7] + values[8] + '.' + values[10]);

                if ((latitude >= -90) && (latitude <= 90) && (longitude >= -180) && (longitude <= 180)) {
                    resolve({
                        latitude: this._formatDecimal(latitude),
                        longitude: this._formatDecimal(longitude),
                        degrees: this._decimalToDegree(latitude, N, S) + ', ' + this._decimalToDegree(longitude, E, W),
                        url: this._getQwantMapsURL(latitude, longitude),
                    });
                } else {
                    reject('Invalid decimals coordinates.');
                }
            } else if (values[11] !== undefined) { // Convert degrees to decimals
                const latitudeDegree = parseInt(values[11]);
                const latitudeMinutes = parseInt(values[12]);
                const latitudeSeconds = parseFloat(values[13] + '.' + values[14]);
                const latitudeCharacter = (values[15] === 'N' || values[15] === N ? N : S);

                const longitudeDegree = parseInt(values[16]);
                const longitudeMinutes = parseInt(values[17]);
                const longitudeSeconds = parseFloat(values[18] + '.' + values[19]);
                const longitudeCharacter = (values[20] === 'E' || values[20] === E ? E : W);

                if ((latitudeDegree <= 90) && (longitudeDegree <= 180) && (latitudeMinutes <= 60) && (latitudeSeconds <= 60) && (longitudeMinutes <= 60) && (longitudeSeconds <= 60)) {
                    const latitude = this._degreeToDecimal(latitudeDegree, latitudeMinutes, latitudeSeconds, (latitudeCharacter === N));
                    const longitude = this._degreeToDecimal(longitudeDegree, longitudeMinutes, longitudeSeconds, (longitudeCharacter === E));

                    resolve({
                        latitude: latitude,
                        longitude: longitude,
                        degrees: this._formatDegree(latitudeDegree, latitudeMinutes, latitudeSeconds, latitudeCharacter) + ', ' + this._formatDegree(longitudeDegree, longitudeMinutes, longitudeSeconds, longitudeCharacter),
                        url: this._getQwantMapsURL(latitude, longitude),
                    });
                } else {
                    reject('Invalid degrees coordinates.');
                }
            } else {
                // Should never happen
                reject('Unexpected values.');
            }
        });
    },

    /**
     * Convert decimal to degree.
     * 
     * @param {Float} decimal Decimal to convert to degree.
     * @param {String} positiveChar Character to use if decimal is positive.
     * @param {String} negativeChar Character to use if decimal is negative.
     * 
     * @return {String} Degree.
     * @public
     */
    _decimalToDegree: function(decimal, positiveChar, negativeChar) {
        const split = Math.abs(decimal).toString().split('.');

        const degree = split[0];

        let rest = (parseFloat('0.' + (split.length > 1 ? split[1] : '0')) * 3600);

        const minutes = Math.floor(rest / 60);
        const seconds = (Math.round((rest - (minutes * 60)) * 10000) / 10000);

        return this._formatDegree(degree, minutes, seconds, (decimal > 0 ? positiveChar : negativeChar));
    },

    /**
     * Convert degree to decimal.
     * 
     * @param {Integer} degree Degree to convert to decimal.
     * @param {Integer} minutes Minutes to convert to decimal.
     * @param {Float} seconds Seconds to convert to decimal.
     * @param {Boolean} positive Decimal should be positive or negative.
     * 
     * @return {Float} Decimal.
     * @public
     */
    _degreeToDecimal: function(degree, minutes, seconds, positive) {
        if (positive) {
            return this._formatDecimal(parseFloat(degree + (((minutes * 60) + seconds) / 3600)));
        } else {
            return this._formatDecimal(-parseFloat(degree + (((minutes * 60) + seconds) / 3600)));
        }
    },

    /**
     * Format decimal.
     * 
     * @param {Float} decimal Decimal.
     * 
     * @return {Float} Decimal.
     * @public
     */
    _formatDecimal: function(decimal) {
        return (Math.round(decimal * 10000000) / 10000000);
    },

    /**
     * Format degree.
     * 
     * @param {Integer} degree Degree.
     * @param {Integer} minutes Minutes.
     * @param {Float} seconds Seconds.
     * @param {String} character Character.
     * 
     * @return {String} Degree.
     * @public
     */
    _formatDegree: function(degree, minutes, seconds, character) {
        return degree + '° ' + (minutes < 10 ? '0' : '') + minutes + '\' ' + (seconds < 10 ? '0' : '') + seconds + '" ' + character;
    },

    /**
     * Return direct access to Qwant Maps centered on specified coordinates.
     * 
     * @param {Float} latitude Latitude.
     * @param {Float} longitude Longitude.
     * 
     * @return {String} Qwant Maps URL.
     * @public
     */
    _getQwantMapsURL: function(latitude, longitude) {
        return 'https://www.qwant.com/maps/#map=18.00/' + this._formatDecimal(latitude) + '/' + this._formatDecimal(longitude);
    },

    /**
     * IA's name.
     * 
     * @param {Object} i18n Translator.
     * 
     * @return {String} Name.
     * @public
     */
    getName: function (i18n) {
        const _ = i18n._;
        return _("GPS Coordinates", "gps_coordinates");
    },

    /**
     * IA's keywords to convert decimals to degrees:
     * "48.8583701,2.2922926": Convert latitude 48.8583701 and longitude 2.2922926.
     * "48,8583701 2,2922926": Convert latitude 48.8583701 and longitude 2.2922926.
     * IA's keywords to convert degrees to decimals:
     * "48° 51' 30.1324" N 2° 17' 32.2534" W"
     * "48° 51' 30.1324", N 2° 17' 32.2534" W"
     * "48°51'30.1324"N2°17'32.2534" W"
     * 
     * @param {Object} i18n Translator.
     * 
     * @return {String} Keyword.
     * @public
     */
    getKeyword: function (i18n) {
        const _ = i18n._;

        const N = _('N', 'gps_coordinates');
        const S = _('S', 'gps_coordinates');
        const E = _('E', 'gps_coordinates');
        const W = _('W', 'gps_coordinates');

        const decimalsKeyword = '(-|)([0-9]+)(\.|,)([0-9]+)(,|[ ]+)(-|)([0-9]+)(\.|,)([0-9]+)';
        const degreesKeyword = '([0-9]+)°[ ]*([0-9]+)\'[ ]*([0-9]+)\.([0-9]+)"[ ]*(' + N + '|' + S + '|N|S)[,]?[ ]*([0-9]+)°[ ]*([0-9]+)\'[ ]*([0-9]+)\.([0-9]+)"[ ]*(' + E + '|' + W + '|E|W)[ ]*';

        return '(' + decimalsKeyword + '|' + degreesKeyword + ')'
    },

    /**
     * IA's trigger: perfect match with keyword
     * @public
     */
    trigger: "strict",

    /**
     * Insensitive trigger.
     * @public
     */
    flag: "i",

    /**
     * Time before the response is considered as canceled (800 milliseconds).
     * @public
     */
    timeout: 800,

    /**
     * Cache duration.
     * @public
     */
    cache: 10800,
};
