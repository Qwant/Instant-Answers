const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotEngine = require('express-dot-engine');
const fs = require('fs');
const loremIpsum = require('lorem-ipsum');
const searchconfig = require('./config/search');
const sandboxConfig = require('./config/sandbox.json');
const index = require('./routes/index');
const replace = require('./routes/replace');
const app = express();

const MODULE_PATH = process.env.MODULE_PATH;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dot');
app.engine('dot', dotEngine.__express);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(replace);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req,res,next) => {
  res.locals.loremIpsum = loremIpsum;
  res.locals.config = {};
  res.locals.config.search = searchconfig;
  res.locals.config.sandbox = sandboxConfig;
  next();
});
app.use('/', index);
try{
  const fullPath = `${__dirname}/../../${MODULE_PATH}`;
  const modules = fs.readdirSync(fullPath);
  modules.forEach((module)=> {
    app.use('/css', express.static(path.join(MODULE_PATH, module, 'public', 'css')));
    app.use('/javascript', express.static(path.join(MODULE_PATH, module, 'public', 'javascript')));
    app.use('/img/' + module, express.static(path.join(MODULE_PATH, module, 'public', 'img')));
  })
} catch (e) {
  throw `modules not found at ${MODULE_PATH}`
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.status = err.status || 500;
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(res.locals.status);

  // render the error page
  res.render('error');
});

module.exports = app;
