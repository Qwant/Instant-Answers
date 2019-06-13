/**
 * Base64 Instant Answers
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

var mmm = require('mmmagic');
var Magic = mmm.Magic;
var magic = new Magic(mmm.MAGIC_MIME_TYPE);

const ACTION_ENCODE = 1;
const ACTION_DECODE = 2;

module.exports = {
    /**
     * Encode or decode requested terms.
     *
     * @param {Array} values Terms to encode/decode, caught by regex.
     * @param {String} proxyURL Proxy to use for external API.
     * @param {String} language Current language.
     * @param {Object} i18n Translator.
     * 
     * @return {Object} Data to be displayed.
     * @public
     */
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        // console.log(values);

        return new Promise((resolve, reject) => {
            const data = values[values.length - 1].trim();

            if (data) {
                let action;

                if (values[1].toLowerCase() === 'base64') {
                    if (data.match(/^([a-z0-9\+\/]+)[=]{0,2}$/i)) {
                        action = ACTION_DECODE;
                    } else {
                        action = ACTION_ENCODE;
                    }
                } else if (values[2].toLowerCase().replace(/_/g, '').trim() === 'encode') {
                    action = ACTION_ENCODE;
                } else if (values[2].toLowerCase().replace(/_/g, '').trim() === 'decode') {
                    action = ACTION_DECODE;
                }

                this._process(action, data).then(resolve).catch(reject);
            } else {
                reject('No data to encode/decode.');
            }
        });
    },

    /**
     * Encode or decode data.
     *
     * @param {Integer} action Action to process (encode or decode).
     * @param {String} data data to encode/decode.
     * 
     * @return {Object} Data to be displayed.
     * @private
     */
    _process: function(action, data) {
        return new Promise((resolve, reject) => {
            switch (action) {
                case ACTION_ENCODE:
                    this._encode(data).then(resolve).catch(reject);
                    break;
                case ACTION_DECODE:
                    this._decode(data).then(resolve).catch(reject);
                    break;
                default:
                    // Should never happen
                    reject('Unknow requested action.');
                    break;
            }
        });
    },

    /**
     * Encode data.
     *
     * @param {String} data data to encode.
     * 
     * @return {Object} Data to be displayed.
     * @private
     */
    _encode: function(data) {
        return new Promise((resolve, reject) => {
            resolve({
                action: 'encode',
                data: data,
                result: Buffer.from(data).toString('base64'),
                type: 'text',
            });
        });
    },

    /**
     * Decode data.
     *
     * @param {String} data data to decode.
     * 
     * @return {Object} Data to be displayed.
     * @private
     */
    _decode: function(data) {
        return new Promise((resolve, reject) => {
            const buffer = Buffer.from(data, 'base64');

            magic.detect(buffer, function(error, mimeType) {
                let type = 'text';

                if (!error) {
                    switch (mimeType) {
                        case 'image/png':
                            type = 'png';
                            break;
                        case 'image/jpeg':
                            type = 'jpeg';
                            break;
                    }
                }

                resolve({
                    action: 'decode',
                    data: data,
                    result: buffer.toString('utf8'),
                    type: type,
                });
            });
        });
    },

    /**
     * IA's name.
     * @public
     */
    name: "Base64",

    /**
     * IA's keywords to encode:
     * "base64 lorem ipsum": Encode "lorem ipsum".
     * "base64encode lorem ipsum": Encode "lorem ipsum".
     * "base64_encode lorem ipsum": Encode "lorem ipsum".
     * "base64 encode lorem ipsum": Encode "lorem ipsum".
     * IA's keywords to decode:
     * "base64 bG9yZW0gaXBzdW0=": Decode "bG9yZW0gaXBzdW0=".
     * "base64decode bG9yZW0gaXBzdW0=": Decode "bG9yZW0gaXBzdW0=".
     * "base64_decode bG9yZW0gaXBzdW0=": Decode "bG9yZW0gaXBzdW0=".
     * "base64 decode bG9yZW0gaXBzdW0=": Decode "bG9yZW0gaXBzdW0=".
     * @public
     */
    keyword: "base64(([ ]*|_|)encode|([ ]*|_|)decode|)",

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
