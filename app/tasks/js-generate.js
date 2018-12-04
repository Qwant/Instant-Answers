/**
 * translates needed strings in templated .js files
 */

var fs = require('fs');
var path = require('path');

require('../src/binder')();

var config = require('@qwant/config');
config.import('languages');

Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

module.exports = function (grunt, gruntCopyFiles) {

    var languageList = config_get('languages.languages');

    var modules = fs.readdirSync(path.join('src', 'modules'));
    modules.forEach(function (moduleName) {
        var modelPath = path.join('src', 'modules', moduleName);
        if (fs.lstatSync(modelPath).isDirectory()) {
            var publicPath = path.join('src', 'modules', moduleName, 'public');
            if (fs.lstatSync(publicPath).isDirectory()) {
                var publicFiles = fs.readdirSync(publicPath);
                publicFiles.forEach(function (javascriptDirectory) {
                    if (javascriptDirectory === 'javascript') {
                        var javascriptDirectoryPath = path.join('src', 'modules', moduleName, 'public', 'javascript');
                        var javascriptFiles = fs.readdirSync(javascriptDirectoryPath);
                        javascriptFiles.forEach(function (javascriptFile) {
                            var javascriptPath = path.join('src', 'modules', moduleName, 'public', 'javascript', javascriptFile);
                            var tempFile = grunt.file.read(javascriptPath);
                            var translationPattern = /_\(\s*(?:"|')(?:\w|\s|-|_)+(?:"|')\s*,\s*(?:"|')(?:\w|\s|-|_)+(?:"|')\s*\)/g;
                            var translations = tempFile.match(translationPattern);
                            Object.keys(languageList).forEach(function(key){
                                var language = languageList[key];
                                var i18n = require('../src/setup_i18n')(language.code, config_get('languages.options.default'));
                                var _ = i18n._;
                                var translatedTempFile = tempFile;
                                if (translations) {
                                    translations.forEach(function (translation) {
                                        var keywords = translation.match(/(?:"|')(.+)(?:"|')\s*,\s*(?:"|')(.+)(?:"|')/);
                                        var key = keywords[1];
                                        var context = keywords[2];
                                        var translated = _(key, context);
                                        translatedTempFile = translatedTempFile.replace(translation, '"' + translated + '"');
                                    });
                                }
                                var newFilePath = path.join("tmp", language.code, moduleName, javascriptFile);
                                var destFilePath = path.join("dist", "javascript", language.code, javascriptFile);
                                grunt.file.write(newFilePath, translatedTempFile);
                                gruntCopyFiles[moduleName + '-' + language.code] = {
                                    src: newFilePath,
                                    dest: destFilePath
                                }
                            });
                        });
                    }
                });
            }
        }
    });
    return gruntCopyFiles;
};