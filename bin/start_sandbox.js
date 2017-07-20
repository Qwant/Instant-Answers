const config = require('@qwant/config');
config.import('app');

require('./../src/binder')();
Object.keys(config).forEach(function(elem) {
    config_set(elem, config[elem]);
});

var path = require('path');
const spawn = require('child_process').spawn;
const chalk = require('chalk');
const error = chalk.bold.red;

const nodePath = process.execPath;
const sandBoxCommand = `${path.join(__dirname,'..', 'node_modules', '@qwant', 'ia-sandbox', 'bin', 'www')}`;
const iaCommand = `${path.join(__dirname, '..', 'bin', 'www')}`;


const SANDBOX_HOST_PORT = config_get('app.qwant-ia.sandbox-port');
const API_PORT = config_get('app.qwant-ia.server-port');
const MODULE_PATH = config_get('app.qwant-ia.modules-paths');

console.log(chalk.green('Start test Server'));
console.log(chalk.green('Spawning sandbox at', `http://localhost:${SANDBOX_HOST_PORT}`));

var sandBox;

sandBox = spawn(nodePath, [sandBoxCommand], {env : {API_PORT : API_PORT, MODULE_PATH: MODULE_PATH, SANDBOX_HOST_PORT : SANDBOX_HOST_PORT}});

sandBox.stdout.on('data', (data) => {
    console.log(chalk.green(data.toString().replace('\n', '').replace('\r', '')))
});

sandBox.stderr.on('data', (data) => {
    console.log(error('Error with the sandbox... Don\'t forget to `npm install` first!'));
    process.exit(1);
});

sandBox.on('close', (code) => {
    console.log(chalk.green(`child process exited with code ${code}`));
});

const ia = spawn(nodePath, [iaCommand]);

ia.stdout.on('data', (data) => {
    console.log(chalk.magenta(data.toString().replace('\n', '').replace('\r', '')))
});

ia.stderr.on('data', (data) => {
    console.log(error(data.toString().replace('\n', '').replace('\r', '')))
});

ia.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

