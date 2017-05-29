var fs = require("fs")
    , Promise = require("bluebird")
    , childProcess = require('child_process')
    , path = require('path')
    , mkdirp = require("mkdirp")
    , rimraf = Promise.promisifyAll(require("rimraf"))
    , util = require("util")
    ;


module.exports = function (options, done) {
    options = options || {};
    var poFilePaths = options.src;

    var monitor = new I18nMonitor(options, done);

    return monitor
        .processPo(poFilePaths, monitor)
        .then(function(poStatus){
            var success = poStatus
                .every(function(value){
                    return !value;
                })

            rimraf.sync(monitor.tempDir);
            monitor.done(success);
        }.bind(this))
};


function I18nMonitor(options, done) {
    this.tempDir = path.join(process.cwd(), "tmp/i18n/");
    this.gettextCmdPattern = "xgettext --language=Python --force-po -o @@po_file_path --keyword=_n:1,2,4c --keyword=_:1,2c --keyword=_n:1,2 --from-code=UTF-8 @@directories";
    this.mergeCmdPattern = "msgmerge -N @@origin_files > @@clean_file";
    this.statisticCmdPattern = "LANGUAGE=en_GB msgfmt --statistics @@dest_file -o " + path.join(this.tempDir,  "tmp_statistic.mo");

    fs.existsSync(this.tempDir) && rimraf.sync(this.tempDir)
    mkdirp(this.tempDir);

    this.done = done;
    this.fullSupportExpected = options.fullSupportExpected || [];
}

I18nMonitor.prototype.processPo = function (poFilePaths, i18nInstance) {
    var poFiles = fs.readdirSync(poFilePaths);
    var isSuccess = true;
    var self = this;

    return Promise.all(poFiles
        .map(function (poFileName) {
            if (poFileName.indexOf('.po') > -1) {
                return path.join('', poFilePaths, poFileName); // was poFilePath
            }
        })
        .filter(function(value){
            return value && value.length > 0;
        })
        .map(function(poFilePath){
            return self
                .processSynch(poFilePath, poFilePaths, i18nInstance)
                .then(function(msgStat){
                   return i18nInstance.testTranslation(msgStat, poFilePath);
                });
        })
    )
    ;
};

I18nMonitor.prototype.processSynch = function (poFilePath, srcFileRootPath, i18nInstance) {
    var segments = poFilePath.split('/');
    var fileName = segments.pop();

    var generatePath = path.join(this.tempDir, 'g_' + fileName);
    var mergedFilePath = path.join(this.tempDir, 'm_' + fileName);

    return i18nInstance
        .getPoMetaDatas(poFilePath)
        .then(function (poMetaDatas) {
            var files = I18nMonitor.prototype.getFileList(srcFileRootPath, poMetaDatas);
            return i18nInstance.generatePoFiles(files, generatePath);
        })
        .then(function () {
            return i18nInstance.mergePoFiles([poFilePath, generatePath], mergedFilePath);
        })
        .then(function () {
            return i18nInstance.statsFile(mergedFilePath)
        })
        ;
}

I18nMonitor.prototype.testTranslation = function (msgPoStat, poFileName, fullSupportExpected) {
    var poStats = msgPoStat.split(',')
    var err = false;

    var untranslated = false;
    var fuzzy = false;
    var poName = path.basename(poFileName).split('.')[0];

    var errOnFullSuportFile = false;
    var it = this;

    var errors = {
        fuzzy: 0
        , untranslated: 0
    }

    poStats.forEach(function (poStat) {


        if (poStat.indexOf('fuzzy') != -1) {
            errors.fuzzy = poStat.match(/(\d+)/)[1];
            err = true;
        } else if (poStat.indexOf('untranslated') != -1) {
            errors.untranslated = poStat.match(/(\d+)/)[1];
            err = true;
        }

        if (err && it.fullSupportExpected.indexOf(poName) != -1) {
            errOnFullSuportFile = true
        }
    });

    if (errors.untranslated || errors.fuzzy) {
        console.log(util.format("Error: --translation missing-- on '%s': %s", poName, util.inspect(errors)));
    }

    return errOnFullSuportFile;

}

I18nMonitor.prototype.getFileList = function (rootPath, poMetaDatas) {
    var walker = function (filePath) {
        var files = [];
        var nodes = fs.readdirSync(filePath);

        nodes.forEach(function (file) {
            file = filePath + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                files = files.concat(walker(file))
            }
            else files.push(file)
        });

        return files
    };

    var files = [];

    poMetaDatas.sources.forEach(function (filePath) {
        walker(path.join(rootPath, poMetaDatas.basePath, filePath)).forEach(function (walkedFile) {
            files.push(walkedFile);
        });
    });
    return files;
};

I18nMonitor.prototype.getPoMetaDatas = function (srcDir) {
    return new Promise(function (resolve, reject) {
        var sources = [];
        var basePath, kewords, charset, rootPath;

        fs.readFile(srcDir, function (err, poContent) {
            var poLines = poContent.toString().split("\n");
            poLines.forEach(function (poLine) {

                if (sourceBasePath = poLine.match(/X-Poedit-Basepath: (.*)\\n/)) {
                    basePath = sourceBasePath[1];
                } else if (keyWordList = poLine.match(/X-Poedit-KeywordsList: (.*)\\n/)) {
                    kewords = keyWordList[1]
                } else if (sourceCharSet = poLine.match(/X-Poedit-SourceCharset: (.*)\\n/)) {
                    charset = sourceCharSet[1];
                } else if (searchPath = poLine.match(/X-Poedit-SearchPath-[\d]+: (.*)\\n/)) {
                    sources.push(searchPath[1]);
                }
            });

            resolve({
                sources: sources,
                basePath: basePath,
                kewords: kewords,
                charset: charset,
                rootPath: rootPath
            });
        });
    });
};

I18nMonitor.prototype.generatePoFiles = function (files, poGeneratedFilePath) {
    return new Promise(function (resolve, reject) {

        var gettextCmd = this.gettextCmdPattern
                .replace("@@po_file_path", poGeneratedFilePath)
                .replace("@@directories", files.join(' '))
            ;

        childProcess.exec(gettextCmd, function (error, stdio, stdError) {
            resolve(error + stdio + stdError);
        });

    }.bind(this));
};

I18nMonitor.prototype.mergePoFiles = function (originFiles, mergedFilePath) {
    return new Promise(function (resolve, reject) {
        var mergeCmd = this.mergeCmdPattern
                .replace("@@origin_files", originFiles.join(' '))
                .replace("@@clean_file", mergedFilePath)
            ;

        childProcess.exec(mergeCmd, function (error, stdio, stdError) {
            resolve(error + stdio + stdError);
        });

    }.bind(this));

};

I18nMonitor.prototype.statsFile = function (mergedFilePath) {
    return new Promise(function (resolve, reject) {
        var statisticCmd = this.statisticCmdPattern.replace("@@dest_file", mergedFilePath);

        childProcess.exec(statisticCmd, function (stderr, err, stdio) {
            resolve(stdio);
        });

    }.bind(this));
};

