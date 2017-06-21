var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;
var CountryData = require('./Data/Capital_country')();
var keyCountry = Object.keys(CountryData);
var Country = "(?:" +keyCountry.join("|") + ")";
var util = require("util");
var request = require("request");
var infobox = require('wiki-infobox');

function script (matchCountry){
    return new Promise(function (resolve, reject) {
        var matchCountry = matchCountry.replace("-"," ");
        matchCountry = setMajToAllWords(true, matchCountry);
        var matchCountry = matchCountry.replace(" ","-");
        // var resultData = Object.values(CountryData);
        var CountryCap = CountryData[matchCountry];
        var language = 'en';
        var CountryCapPop;
        var CountryCapDens;
        var CountryCapHour;
        var CountryCapSup;

        infobox(CountryCap, language, function(err, data) {
            if (err) {
                // Oh no! Something goes wrong!
                return;
            }
            console.log(data);
            if (typeof data.population_total === "object"){
                CountryCapPop = data.population_total.value;
                CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
                CountryCapPop = parseInt(CountryCapPop);
            }
            else if (typeof data.population === "object") {
                CountryCapPop = data.population.value;
                CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
                CountryCapPop = parseInt(CountryCapPop);
            }
            else if (typeof data.population_estimate === "object") {
                CountryCapPop = data.population_estimate.value;
                CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
                CountryCapPop = parseInt(CountryCapPop);
            }
            console.log(CountryCapPop);
            if (typeof data.municipality_name === 'object' && data.municipality_name.value === "Bern"){
                CountryCapPop = 131554;

            }
            // if (typeof data.population_total === "object" && data.name.value === "Ottawa"){
            //
            //     CountryCapPop = data.population_total[0].value;
            //     CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
            //     CountryCapPop = parseInt(CountryCapPop);
            // }
            // if (typeof data.population_total === "object" && data.name.value === "Islamabad"){
            //
            //     CountryCapPop = data.population_urban.value;
            //     CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
            //     CountryCapPop = parseInt(CountryCapPop);
            // }
            console.log(CountryCapPop);
            if (typeof data['area km2'] === "object"){
                CountryCapSup = data['area km2'].value;
            }
            else if (typeof data.area_total_km2 === "object"){
                CountryCapSup = data.area_total_km2.value;
                CountryCapSup = parseInt(CountryCapSup);
            }
            else if (typeof data.area === "object"){
                CountryCapSup = data.area.value;
                CountryCapSup = parseInt(CountryCapSup);
            }
            else if (typeof data.area_total_sq_mi === "object"){
                CountryCapSup = data.area_total_sq_mi.value;
                CountryCapSup = parseInt(CountryCapSup);
            }
            var CountryCapPopInit = 0;
            var _URL = "https://api.qwant.com/api/search/ia?safesearch=1&locale=%s&q=%s&t=all&lang=%s";
            var _QUERY = CountryCap;
            var _MODULE = matchCapital;

            var knowledgeApiUrl = util.format(_URL, "en_gb", encodeURIComponent(_QUERY), "en_gb");
            var requestParams = {
                url: knowledgeApiUrl,
                timeout: 3000,
                headers: {
                    'User-Agent': 'Qwantify'
                }
            };

            if (proxyURL != '') {
                requestParams.proxy = proxyURL;
            }

            request(requestParams, function (error, response) {
                if (error) {
                    logger.error("bad knowledge response", {module: "_MODULE"});
                    reject(error);
                    return;
                }

                var knowledgeResponse = {};

                try {
                    var parsedBody = JSON.parse(response.body);
                    knowledgeResponse.data = parsedBody.data.result.items[0].data[0]
                } catch (e) {
                    e.msg = response.body;
                    throw e;
                }
                knowledgeResponse.Country = {
                    matchCountry: matchCountry,
                    CountryCap: CountryCap,
                    CountryCapPop: CountryCapPop,
                    CountryCapPopInit: CountryCapPopInit,
                    CountryCapSup: CountryCapSup
                };
                resolve(knowledgeResponse);
            });
        });



    });
}
script();