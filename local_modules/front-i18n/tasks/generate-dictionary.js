var fs = require('fs');
var CONCAT_FLAG = 'a';
var path = require('path');

module.exports = function (options) {

    var i18Chain = '_("%label%","%context%")\n';
    var count = 0;


    function writeI18n(i18n, outputFile) {
        var fd = fs.openSync(outputFile, CONCAT_FLAG)
        fs.writeSync(fd, i18Chain.replace('%label%', i18n.label).replace('%context%', i18n.context));
        count += 1;
        fs.closeSync(fd);
    }

    function i18nChainLookFor(tree, outputFile) {
        for (var parameterKey in tree) {
            var subTree = tree[parameterKey];

            if (parameterKey === 'i18n') {
                writeI18n(subTree, outputFile);
            } else if(typeof subTree != 'string') {
                i18nChainLookFor(subTree, outputFile);
            }
        }
    }

    return {
        start : function(config) {
            var treeParams = config.tree;
            var outputFile = config.outputFilePath;
            i18nChainLookFor(treeParams, outputFile);
            console.log("total world write : " + count)
        }
    }


    //var parameterTree = container.parameters;
    // i18nChainLookFor(parameterTree);

};



