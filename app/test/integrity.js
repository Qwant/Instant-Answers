const assert = require('assert');
const fs = require('fs');
const path = require('path');
const getFolderSize = require('get-folder-size');
const modules = fs.readdirSync('./src/modules/');

const REQUIRE_TIMEOUT = 2000; /* break with 2s */
const GET_DATA_TIMEOUT = 1000; /* break with 1s */

require('../src/binder')(); // require binder for easy access to config properties
var config = require('@qwant/config');
// config.import('weather');
config.import('app');

Object.keys(config).forEach(function(elem) {
	config_set(elem, config[elem]);
});

const excludedIAList = config_get('app.qwant-ia.excludedIA');

describe('Integrity', function() {

	describe('Require time', function () {
		describe(`Require time`, function() {
			modules.forEach((module) => {
				if (excludedIAList.indexOf(module) == -1) {
					this.timeout(REQUIRE_TIMEOUT);
					it(`Module ${module} takes less than ${REQUIRE_TIMEOUT} ms to be required`, function () {
						require(`../src/modules/${module}/${module}`);
					})
				}
			})

		})
	});

	describe('Module size', function () {
		modules.forEach(function (module) {
            if (excludedIAList.indexOf(module) == -1) {
                it(`Module ${module} directory is less than 5 mo`, function (done) {
                    let moduleFolderPath = path.join(__dirname, '..', 'src', 'modules', module);
                    getFolderSize(moduleFolderPath, function (error, size) {
                        assert(size < (1024 * 1024) * 5);
                        done()
                    })
                })
            }
		})

	});
});
