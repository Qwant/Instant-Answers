var fs = require('fs');
var path = require('path');
var npm = require('npm');

require('./binder')();

var config = require('@qwant/config');
config.import('app');
config.import('languages');

Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

npm.load(function(err) {
    if(err) {
        console.error('Unreachable npm !' + err)
    } else {
        var modules = config_get('modules');

        installModule(modules, function(status) {

            console.log(status.data.length + '/' + (status.data.length + status.errors.length) + ' package installed.');
            if(status.errors.length > 0) {
                status.errors.forEach(function(error) {
                    console.error('Package : ' + error.pkgid + ' not correctly installed. ' + error.message + ' caught !')
                })
            }
            log(status);
        });

    }
});

/* recursive install  */
function installModule(modules, cb, npmData, errors) {
    if(!errors) {
        errors = [];npmData = [];
    }
    if(modules.length == 0) {
        /* callback when stack is empty */
        cb({data : npmData, errors: errors});
    } else {
        /* unstack */
        var module = modules.pop();
        console.log('install : ' + module.name);
        /* call npm : install format : package_name@ package_version */
        npm.commands.install([module.name + '@' + module.version], function(error, data) {

            if(error) {
                errors.push(error)
            } else {
                npmData.push(data[0])
            }
            /* call for the next package */
            installModule(modules, cb, npmData, errors)
        });
    }
}

/* Write install log for complete error analytic & init successful installed packages */
function log(status) {
    var time = new Date().getTime();
    try {
        fs.mkdirSync(path.resolve(__dirname, '..', 'log'));
    } catch (e) {
        console.error('Log folder already exist');
    }
    var logFileName = 'ia_' + time + '.log.json';
    fs.open(path.resolve(__dirname, '..', 'log', logFileName), 'w','0666',  function(error, logFileHandler) {
        if(error) {
            console.error('Problem opening file : ' + logFileName)
        } else {

            var installLog = {};
            installLog.createdAt = time;

            installLog.success = [];
            status.data.forEach(function(success) {
                var rawPackage = success[0].split('@');
                var packageName = rawPackage[0];
                var packageVersion = rawPackage[1];
                installLog.success.push({name : packageName, version : packageVersion})
            });

            installLog.fails = [];
            status.errors.forEach(function(error) {
                var packageName = error.pkgid;
                var errorCode = error.code;
                installLog.fails.push({name : packageName, error : errorCode})
            });

            fs.writeSync(logFileHandler, JSON.stringify(installLog,null, 4));
            fs.close(logFileHandler);
        }
    });
}