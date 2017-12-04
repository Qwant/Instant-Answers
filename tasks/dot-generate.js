/**
 * dot-generate generates a templated file (.js) from .dot files (see dist/template/xx_xx/xxxx.js)
 */

var fs = require('fs');
var path = require('path');
var _ = require('@qwant/front-i18n')._;

require('../src/binder')();

var config = require('@qwant/config');
config.import('languages');

Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

module.exports = function (grunt, gruntDotItem) {

    var languageList = config_get('languages.languages');
    var modules = fs.readdirSync(path.join('src', 'modules'));
    modules.forEach(function (moduleName) {
        var modelPath = path.join('src', 'modules', moduleName);
        if (fs.lstatSync(modelPath).isDirectory()) {
            var publicPath = path.join('src', 'modules', moduleName, 'public');
            if (fs.lstatSync(publicPath).isDirectory()) {
                var publicFiles = fs.readdirSync(publicPath);
                publicFiles.forEach(function (moduleFileName) {
                    if (moduleFileName.indexOf(".dot") != -1) {
                        var dotFilePath = path.join('src', 'modules', moduleName, 'public', moduleFileName);
                        var tempFile = grunt.file.read(dotFilePath);
                        var cssSourcePattern = /href="(.*)\/(.*\.css)"/;
                        var cssFilePattern = /<link.*>/g;
                        var cssFiles = tempFile.match(cssFilePattern);
                        if (cssFiles) {
                            cssFiles.forEach(function (file) {
                                var source = file.match(cssSourcePattern);
                                var sourcePath = path.join('src', 'modules', moduleName, 'public', source[1], source[2]);
                                tempFile = tempFile.replace(file, "<style>" + grunt.file.read(sourcePath) + "</style>");
                            });
                        }
                        var translationPattern = /_\(\s*(?:"|')(?:\w|:|\?|,|;|!|\s|-|'|_)+(?:"|')\s*,\s*(?:"|')(?:\w|:|\?|,|;|!|\s|-|'|_)+(?:"|')\s*\)/g;
                        var translations = tempFile.match(translationPattern);
                        Object.keys(languageList).forEach(function(key){
                            var language = languageList[key];
                            require('../src/setup_i18n')(language.code);
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
                            var destFilePath = path.join('dist', 'template', language.code, moduleName + '.js');
                            var newFilePath = path.join("tmp", language.code, moduleName, moduleFileName);
                            grunt.file.write(newFilePath, translatedTempFile);
                            if (!gruntDotItem[language.code]) gruntDotItem[language.code] = {};
                            gruntDotItem[moduleName + language.code] = {
                                options: {variable: "tmpl_ia"},
                                src: newFilePath,
                                dest: destFilePath
                            }
                        });
                    }
                });
            }
        }
    });
    return gruntDotItem;
};