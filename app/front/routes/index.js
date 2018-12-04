const express = require('express');
const router = express.Router();
const doT = require('dot');
const fs = require('fs');
const path = require('path');
const iaApiUrl = `http://localhost:3002`;
const request = require('request');


/* GET home page. */
router.get('/', (req, res, next) => {
    let q = req.query.q;
    let lang = (req.query.locale) ? req.query.locale : "en_gb";

    if (typeof req.query.q === 'undefined') {
        res.redirect('/?q=hello world')
        return
    }

    request.get({
        url: `${iaApiUrl}/?q=${encodeURIComponent(q)}&lang=${lang}&locale=${lang}`,
        json: true
    }, (error, body, ia) => {
        let i18n = require('../../src/setup_i18n')(lang, 'en_gb');
        if (ia && !ia.runtime && !ia.error) {
            res.render('index', {query: q, ia: '', lang: lang, i18n: i18n, error: "Unexpected ia response"});
            return;
        } else if (ia && ia.error) {
            res.render('index', {query: q, ia: '', lang: lang, i18n: i18n, error: ia.error + ' - ' + ia.message});
            return;
        }

        if (null === error && ia.status === 'success') {
            res.render('index', {query: q, ia: ia, lang: lang, i18n: i18n});
        } else if (error) {
            res.render('index', {query: q, ia: '', lang: lang, i18n: i18n, error: error.message});
        } else {
            res.render('index', {query: q, ia: '', lang: lang, i18n: i18n, error: "Unhandled error"});
        }
    });
});

router.get('/view/:name.js', (req, res, next) => {
    let rootPath = '/';
    let templateName = path.join('/src/src/modules', req.params.name, 'public', `${req.params.name}.dot`);
    fs.readFile(templateName, (err, fd) => {
        if (null === err) {
            let dotContent = fd.toString().replace(/ {4}|\t|\n|\r/gm, '');
            let templateFunction = doT.template(dotContent);
            res.send('var template = ' + templateFunction.toString())
        } else {
            next({status: 500, message: err.toString()})
        }
    })
});

module.exports = router;
