'use_strict'

var inquirer = require('inquirer');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var slug = require('slugify');
var iaCoreName = require('../package.json').name;
var iaCoreVersion = require('../package.json').version;
let i18n = require('../src/setup_i18n')("en_gb", "en_gb");

require('../src/binder')();

var config = require('@qwant/config');
config.import('app');
config.import('languages');

Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

function getModules(){
    return fs.readdirSync('src/modules/')
            .filter(file => fs.statSync(path.join('src/modules/', file)).isDirectory());
}

function checkKeywordUsed(keyword){
    var modules = getModules();
    for (var k in modules) {
        var filePath = path.join('../src/modules/', modules[k], modules[k] + '.js');
        try {
            var module = require(filePath);
        } catch (err) {
            throw err;
        }
        var keywords = (module.keyword) ? module.keyword : module.getKeyword(i18n);
        if (keywords.indexOf(keyword) !== -1) {
            console.warn("\n[WARNING] The keyword(s) might be used in another module (" + modules[k] + "), beware of conflicts.");
            return true;
        }
    }

    return true;
}

console.info('\n%s v%s - IA Generator\n', iaCoreName, iaCoreVersion);
console.info('-----------HELP SECTION-----------\n');
console.info('Name:\t\t\tName of your Instant Answer');
console.info('Description:\t\tDescription of your Instant Answer');
console.info('Keyword:\t\tWHAT keyword should trigger the IA ? ex: "weather Paris", weather is the keyword');
console.info('Trigger:\t\tWHERE should the keyword be expected in a query ? ex: "weather Paris" = start');
console.info('Modifiers:\t\tRegex modifier(s), see https://www.w3schools.com/jsref/jsref_obj_regexp.asp');
console.info('Javascript script:\tFront script, used to interact with how your IA displays, can be modified later');
console.info('Timeout:\t\tTime before your response is considered as canceled (in milliseconds)');
console.info('Cache:\t\t\tDuration of the cached data (in seconds)');
console.info('Order:\t\t\tOrder in the IA hierarchy (0 = first, 1 = second, ... no order = added at the end, alphabetically)\n')

var questions = [
    {
        type: 'input',
        name: 'ianame',
        message: 'Name',
        validate: function (value) {
            if (value.length <= 0) {
                return false;
            }
            var ianame = value.trim();
            if (getModules().indexOf(slug(ianame, {replacement: '_', lower: true})) === -1) {
                return true;
            }
            return "Invalid IA Name. IA Name may be already used.";
        }
    },
    {
        type: 'input',
        name: 'description',
        message: 'Description',
        validate: function (value) {
            return value.length > 0;
        }
    },
    {
        type: 'input',
        name: 'keyword',
        message: 'Keyword',
        validate: function (value) {
            if (value.length <= 0) {
                return false;
            }
            return checkKeywordUsed(value);
        }

    },
    {
        type: 'rawlist',
        name: 'trigger',
        message: 'Trigger',
        choices: [
            'start (keyword + string)',
            'end (string + keyword)',
            'any (string + keyword + string)',
            'strict (perfect match with keyword)'
        ],
        filter: function(value) {
            var answers = {
                'start (keyword + string)': 'start',
                'end (string + keyword)': 'end',
                'any (string + keyword + string)': 'any',
                'strict (perfect match with keyword)': 'strict'
            };

            return answers[value];
        }
    },
    {
        type: 'checkbox',
        name: 'flag',
        message: 'Modifiers',
        choices: [
            {
                name: 'g (global matching)'
            },
            {
                name: 'm (multiline matching)'
            },
            {
                name: 'i (case insensitive matching)'
            }
        ],
        filter: function (value) {
            var answers = {
                'g (global matching)': 'g',
                'm (multiline matching)': 'm',
                'i (case insensitive matching)': 'i'
            };

            var flags = '';

            value.forEach(function(val){
                if (answers[val]){
                    flags += answers[val];
                }
            });

            return flags;
        }
    },
    {
        type: 'confirm',
        name: 'script',
        message: 'Javascript script',
        default: true
    },
    {
        type: 'input',
        name: 'scriptname',
        message: 'Javascript script filename',
        when: function (answers) {
            return answers.script;
        },
        validate: function (value) {
            return value.length > 0;
        },
        filter: function (value) {
            if (value.indexOf('.js') !== -1) {
                value = value.substring(0, value.lastIndexOf('.'))
            }
            return value;
        }

    },
    {
        type: 'input',
        name: 'timeout',
        message: 'Timeout (in milliseconds)',
        validate: function (value) {
            var valid = !isNaN(parseInt(value));
            return valid || 'Please enter a number'
        },
        filter: Number,
        default: 3600
    },
    {
        type: 'input',
        name: 'cache',
        message: 'Cache duration (in seconds)',
        validate: function (value) {
            var valid = !isNaN(parseInt(value));
            return valid || 'Please enter a number'
        },
        filter: Number,
        default: 3600 * 3
    },
    {
        type: 'input',
        name: 'order',
        message: 'Order in the hierarchy (integer or hit enter for no order)',
        validate: function (value) {
            var valid = !isNaN(parseInt(value));
            if (value === '' || valid)
                return true;
            else
                return 'Please enter a valid input (integer or empty string)';
        },
        default: ''
    }
];

function generateLangs(ianame, iaslug){
    var pathToLang = path.join('src/modules', iaslug, 'lang_src');
    mkdirp(pathToLang, function(err) {
        if (err) return console.error(err);
        console.info(pathToLang + " created.");
        var langs = config_get('languages.languages');
        Object.keys(langs).forEach(function (key) {
            var langSrc = path.join(pathToLang, langs[key].match + '.po');
            if (!fs.existsSync(langSrc)) {
                try {
                    fs.writeFileSync(langSrc, "#\n# This is your "+ langs[key].code +" language file. Please refer to the documentation for more information.\n#\n");
                } catch (err) {
                    if (err.code !== 'ENOENT') throw err;
                    console.error("Error: cannot write " + langSrc);
                }
                console.info(langSrc + " created.");
            }
        });
        console.info("\nIA \"" + ianame + "\" generated.");
    });
}

inquirer.prompt(questions).then(function (answers) {
    console.info("\nGenerating \"" + answers['ianame'] + "\" IA...\n");

    var iaslug = slug(answers['ianame'], {replacement: '_', lower: true});
    var pathToModule = path.join('src/modules', iaslug);
    mkdirp(pathToModule, function(err) {
        if (err) return console.error(err);
        console.info(pathToModule + " created");
        var iaTemplatePath = path.join('src/ia_templates/server_side');
        var iaTemplateMain = path.join(iaTemplatePath, 'ia.js');
        var iaMain = path.join(pathToModule, iaslug + '.js');
        fs.readFile(iaTemplateMain, 'utf8', function (err, data) {
            if (err) return console.error(err);
            data = data.replace(/{{ianame}}/g, answers['ianame']);
            data = data.replace(/{{ianameslug}}/g, iaslug);
            data = data.replace(/{{iakeyword}}/g, answers['keyword']);
            if (answers['script']) {
                data = data.replace(/{{iascript}}/g, 'script: "' + answers['scriptname'] + '.js",');
            } else {
                data = data.replace(/{{iascript}}/g, '');
            }
            data = data.replace(/{{iatrigger}}/g, answers['trigger']);
            data = data.replace(/{{iaflag}}/g, answers['flag']);
            data = data.replace(/{{iatimeout}}/g, answers['timeout']);
            data = data.replace(/{{iacache}}/g, answers['cache']);
            data = data.replace(/{{iaorder}}/g, answers['order']);
            fs.writeFile(iaMain, data, 'utf8', function(err){
                if (err) return console.error(err);
                console.info(iaMain + " created");
                var pathToPublic = path.join('src/modules', iaslug, 'public');
                mkdirp(pathToPublic, function (err) {
                    if (err) return console.error(err);
                    console.info(pathToPublic + " created");
                    var pathToDot = path.join(pathToPublic, iaslug + '.dot');
                    var templateContent = "<!--\n This is your main template file. Please refer to the documentation for more information.\n-->\n";
                    templateContent += "<link rel=\"stylesheet\" href=\"css/" + iaslug + ".css\" type=\"text/css\">\n";
                    if (answers['script']) {
                        templateContent += "<script src=\"javascript/" + answers['scriptname'] + ".js\"></script>\n";
                    }
                    fs.writeFile(pathToDot, templateContent, function (err) {
                        if (err) return console.error(err);
                        console.info(pathToDot + " created");
                        var pathToCSS = path.join(pathToPublic, 'css');
                        mkdirp(pathToCSS, function(err) {
                            if (err) return console.error(err);
                            console.info(pathToCSS + " created");
                            var pathToCSSfile = path.join(pathToCSS, iaslug + '.scss');
                            fs.writeFile(pathToCSSfile, "/**\n* This is your main SCSS file. Please refer to the documentation for more information.\n*/\n", function (err) {
                                if (err) return console.error(err);
                                console.info(pathToCSSfile + " created");
                                if (answers['script']) {
                                    var pathToScript = path.join('src/modules', iaslug, 'public', 'javascript');
                                    mkdirp(pathToScript, function (err) {
                                        if (err) console.error(err);
                                        else {
                                            console.info(pathToScript + " created");
                                            var pathToScriptJS = path.join(pathToScript, answers['scriptname'] + '.js');
                                            var iaTemplateScript = path.join(iaTemplatePath, 'script.js');
                                            fs.readFile(iaTemplateScript, 'utf8', function (err, data) {
                                                if (err) return console.error(err);
                                                data = data.replace(/{{ianame}}/g, iaslug.charAt(0).toUpperCase() + iaslug.slice(1));
                                                fs.writeFile(pathToScriptJS, data, function (err) {
                                                    if (err) return console.error(err);
                                                    console.info(pathToScriptJS + " created");
                                                    generateLangs(answers['ianame'], iaslug);
                                                });
                                            });
                                        }
                                    });
                                } else {
                                    generateLangs(answers['ianame'], iaslug);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});
