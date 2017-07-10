var Promise = require("bluebird");
var capitals = require("./capitals.json");
var infobox = require('wiki-infobox');
var fs = require('fs');
var util = require("util");
var request = require("request");
var countriesTab = require('./countries.json');

function script (matchCountry, proxyURL){
    return new Promise(function (resolve, reject) {
        var CountryMatch = capitals.countries.find(function (country){
            return country.name === matchCountry;
        });
        var CountryCap =  CountryMatch.capital;
        // resolve(true);return;//
        var language = 'en';
        var CountryCapPop;
        var CountryCapSup = -1;

        infobox(CountryCap, language, function(err, data) {
            if (err) {
                // Oh no! Something goes wrong!
                resolve({error: true, error_object: err});
            }
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
            else if (typeof data.population_metro === "object") {
                CountryCapPop = data.population_metro.value;
                CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
                CountryCapPop = parseInt(CountryCapPop);
            }
            if (typeof data.municipality_name === 'object' && data.municipality_name.value === "Bern"){
                CountryCapPop = 131554;

            }
            if (typeof data.name === 'object' && data.name.value === "Jerusalem"){
                CountryCapPop = data.population_metro.value;
                CountryCapPop = CountryCapPop.replace(/[\D]/g,'');
                CountryCapPop = parseInt(CountryCapPop);

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
            if (typeof data['area km2'] === "object"){
                CountryCapSup = data['area km2'].value;
            }
            else if (typeof data.area_total_km2 === "object"){
                CountryCapSup = data.area_total_km2.value;
                CountryCapSup = parseInt(CountryCapSup);
            }
            else if (typeof data.area_total_dunam === "object"){
                CountryCapSup = data.area_total_dunam.value;
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
            var _MODULE = CountryMatch;

            var knowledgeApiUrl = util.format(_URL, "en_gb", encodeURIComponent(_QUERY), "en_gb");
            var requestParams = {
                url: knowledgeApiUrl,
                timeout: 3000,
                headers: {
                    'User-Agent': 'Qwantify'
                }
            };

            request(requestParams, function (error, response) {
                if (error) {
                    resolve({error: true, error_object: error });
                    return;
                }

                var knowledgeResponse = {};

                try {
                    var parsedBody = JSON.parse(response.body);
                    knowledgeResponse.data = parsedBody.data.result.items[0].data[0]
                } catch (e) {
                    e.msg = response.body;
                    resolve ({error: true, error_object: e});
                }
                var country = {name: matchCountry, capital:{name: CountryCap, area: CountryCapSup, population: CountryCapPop}};
                resolve (country);
            });
        });





    });
}

var countryPromises = [];
// console.log(capitals["countries"][1].name);
var i = 0;
var countries = [];
console.log("start", capitals.countries.length);
(function aa() {
    var countryName = capitals["countries"][i].name;
    var countryPromise = script(countryName);
    countryPromise.then(function(country) {
        console.log(`${countryName} ${i} on ${capitals.countries.length}`);
        i++;
        countries.push(country);
        if (capitals.countries.length > i) {
            aa();
        }else{
            var fd = fs.openSync("./countries.json","w+");
            fs.appendFileSync(fd,JSON.stringify({countries : countries}, null, '\t'));
        }
    })
})();



