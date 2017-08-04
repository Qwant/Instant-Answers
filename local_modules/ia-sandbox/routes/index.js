const express = require('express');
const router = express.Router();
const doT = require('dot');
const fs = require('fs');
const path = require('path');
const iaApiUrl = `http://localhost:${process.env.API_PORT}`;
const request = require('request');


/* GET home page. */
router.get('/', (req, res, next) => {
  let q = req.query.q;

  if(typeof req.query.q === 'undefined') {
    res.redirect('/?q=hello world#horizontal')
    return
  }

  request.get({url : `${iaApiUrl}/?q=${q}`, json : true}, (error, body, ia) => {
    if(ia && !ia.runtime && !ia.error) {
      next({status : 500, message : 'Unexpected ia response'});
      return
    } else if(ia && ia.error) {
      next({status : ia.error, message : ia.message});
      return
    }
    if(null === error && ia.status === 'success') {
      res.render('index', { query : q, ia : ia, });
    } else if(error) {
      error.status = 500;
      next(error);
    } else {
      next({status : 500, message : 'Unhandled error'});
    }
  });
});

router.get('/view/:name.js', (req,res, next) => {
  let rootPath = '/';
  let templateName = path.join(process.env.MODULE_PATH, req.params.name, 'public', `${req.params.name}.dot`);
  fs.readFile(templateName, (err, fd) => {
    if(null === err) {
      let dotContent = fd.toString();
      let templateFunction = doT.template(dotContent);
      res.send('var template = ' +  templateFunction.toString())
    } else {
      next({status : 500, message : err.toString()})
    }
  })
});

module.exports = router;
