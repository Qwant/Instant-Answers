/**
 * Brainfuck interpreter Instant Answers
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

/**
 * Brainfuck interpreter.
 *
 * @param {String} sourceCode Source code to execute.
 * 
 * @return {Object} Public method (run).
 * @public
 */
var Interpreter = function(sourceCode) {
    const _sourceCode = sourceCode;
    var _codeIndex = 0;
    var _memoryData = [];
    var _memoryIndex = 0;
    var _loopBuffer = [];
    var _loopLimit = 0;
    var _result = '';

    /**
     * Execute code.
     *
     * @return {String} Execution result.
     * @public
     */
    var run = function() {
        while (_codeIndex < _sourceCode.length) {
            _run();
            _codeIndex++;
        }

        return _result;
    };

    /**
     * Execute current instruction.
     *
     * @private
     */
    var _run = function() {
        _loopLimit++;

        if (_loopLimit > 10000) {
            throw new Error('Too much instructions.');
        } else {
            if (_memoryData[_memoryIndex] === undefined) {
                _memoryData[_memoryIndex] = 0;
            }

            try {
                switch (_sourceCode[_codeIndex]) {
                    case '>':
                        _memoryIndex++;
                        break;
                    case '<':
                        _memoryIndex--;
                        if (_memoryIndex < 0) {
                            throw new Error();
                        }
                        break;
                    case '+':
                        _memoryData[_memoryIndex]++;
                        if (_memoryData[_memoryIndex] > 255) {
                            _memoryData[_memoryIndex] = 0;
                        }
                        break;
                    case '-':
                        _memoryData[_memoryIndex]--;
                        if (_memoryData[_memoryIndex] < 0) {
                            _memoryData[_memoryIndex] = 255;
                        }
                        break;
                    case '.':
                        _result += String.fromCharCode(_memoryData[_memoryIndex]);
                        break;
                    case '[':
                        if (_memoryData[_memoryIndex] === 0) {
                            let delta = 1; // For loop inside other loop
                            while ((delta > 0) && (_codeIndex < _sourceCode.length)) {
                                _codeIndex++;
                                if (_sourceCode[_codeIndex] === '[') {
                                    delta++;
                                } else if (_sourceCode[_codeIndex] === ']') {
                                    delta--;
                                }
                            }
                        } else {
                            _loopBuffer.push(_codeIndex);
                        }
                        break;
                    case ']':
                        if (_loopBuffer.length > 0) {
                            _codeIndex = (_loopBuffer.pop() - 1);
                        } else {
                            throw new Error();
                        }
                        break;
                }
            } catch (e) {
                throw new Error('Syntax error at char ' + _codeIndex + '.');
            }
        }
    }

    return {
        run: run
    };
};

module.exports = {
    /**
     * Run Brainfuck code.
     *
     * @param {Array} values Brainfuck code to execute.
     * @param {String} proxyURL Proxy to use for external API.
     * @param {String} language Current language.
     * @param {Object} i18n Translator.
     * 
     * @return {Object} Execution result to be displayed.
     * @public
     */
    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;
        return new Promise(function (resolve, reject) {
            const interpreter = new Interpreter(values[1]);

            try {
                const result = interpreter.run();

                if (result) {
                    resolve({
                        result: result
                    });
                } else {
                    reject('Empty result.');
                }
            } catch (e) {
                reject(e.toString());
            }
        });
    },

    /**
     * IA's name.
     * @public
     */
    name: "Brainfuck Interpreter",

    /**
     * IA's keywords.
     * @public
     */
    keyword: "([><\\+-\\.\\[\\]]+)",

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
