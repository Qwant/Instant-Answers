var csv = require('fast-csv');
var fs = require('fs');

var elasticCities = fs.openSync('elastic_cities.json', 'w');
var cities1K = fs.createReadStream("cities1000.csv");
var lines = 0;
var citiesCsvStream = csv
    .parse({
        delimiter: "\t",
        quote: null
    })
    .on("data", function (data) {
        var elasticIndex = {
            "index": {
                "_index": "cities_codes",
                "_type": "city",
                "_id": (data[2] + '_' + data[8]).toLowerCase()
            }
        };
        var aliases = data[3].split(',').length > 0 ? data[3].split(',') : [];
        aliases.push(data[1], data[2]);
        var elasticCity = {
            "city": data[1],
            "alias": aliases,
            "country_code": data[8],
            "population": parseInt(data[14]),
            "latitude": parseFloat(data[4]),
            "longitude": parseFloat(data[5])
        };

        fs.write(elasticCities, JSON.stringify(elasticIndex) + '\n' + JSON.stringify(elasticCity) + '\n');

        lines += 1;
    })
    .on("end", function () {
        console.log("Job done x_x \n\nCities : ", lines);
        fs.close(elasticCities)
    });

cities1K.pipe(citiesCsvStream);