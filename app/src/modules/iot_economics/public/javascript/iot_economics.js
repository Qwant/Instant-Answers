/**
 * This is your main script file. Please refer to the documentation for more information.
 */

// const Chart = require('chart.js');

var IARuntime = function() {

  function getChartLabels(data) {
      const labels = [];
      data.forEach(item => {
          labels.push(item[0])
      });
      return labels;
  }

  function getChartDatas(data) {
      const datas = [];
      data.forEach(item => {
          datas.push(item[1])
      });
      return datas;
  }


  function getOptions(chartData) {

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        legendCallback: chart => {
            const legends = [];

            // TODO -> to replace -> used for POC
            chart.data.datasets.map((dataset, i) => {
                if (i === 0) {
                    legends.push('<div style="background-color: #f2f4f8; padding: 10px 15px; height: 80px; width: 180px; border-bottom: solid 1px #e0e1e6;">');
                } else {
                    legends.push('<div style="padding: 10px 15px; height: 80px; width: 180px; border-bottom: solid 1px #e0e1e6;">');
                }
                legends.push('<div style="padding-bottom: 12px">');
                legends.push(`<img src="./img/iot_economics/${dataset.label.toLowerCase().trim()}.svg"} style="vertical-align: middle;"/>`)
                legends.push(`<span style="color: ${  dataset.borderColor  }; vertical-align: top; margin-left: 13.6px; font-size: 12px; text-transform: uppercase;">${  dataset.label  }</span>`)
                legends.push('<span></span>')
                legends.push('</div>');
                legends.push('<div>');
                if (i === 0) {
                    legends.push(`<div style="display: inline-block; margin-left: 45.5px; background-color: ${  dataset.borderColor  }; width:20px; height: 3px;"></div>`);
                } else {
                    legends.push(`<div style="display: inline-block; margin-left: 45.5px; background-color: ${  dataset.borderColor  }; width:20px; height: 3px;"></div>`);
                }
                legends.push(`<div style="display: inline; font-size: 16px; vertical-align: bottom; text-align: center; margin-left: 6px;">${  dataset.data[dataset.data.length - 1]  } ${dataset.unit}</div>`)
                legends.push('</div>');
                legends.push('</div>');
                return true;
            });

            return legends.join("");
        },
        scales: {
            xAxes: [{
                gridLines: {
                    display: true,
                },
            }],
            yAxes: [{
                gridLines: {
                    color: "#e0e1e6",
                },
            }]
        },
    };

    return options
  }

    function getData(result) {

      console.log(result);
      var chartData = {
        datasets: [],
      };

      result.forEach(function(economic) {
          chartData.labels = getChartLabels(economic.values)
          var color = "#" + Math.random().toString(16).substr(-6);
          chartData.datasets.push({
              borderColor: color,
              borderWidth: 2,
              pointBackgroundColor: color,
              pointBorderWidth: 0,
              pointRadius: 0,
              pointHitRadius: 5,
              label: economic.id.split("-")[0],
              fill: false,
              data: getChartDatas(economic.values),
              unit: '%'
            })
          })
          console.log(chartData)
          return chartData
    }

    function Iot_economics (iaData) {

        console.log('data: ');
        const datas = getData(iaData.result);
        const options = getOptions(datas);

        console.log(datas);
        console.log(options);

        getScript("./javascript/chart.js").then(function () {
          var ctx = document.getElementById('myChart');
          var chart = new Chart(ctx, {type: 'line', data: datas, options: options});
          document.getElementById('legend').innerHTML = chart.generateLegend();
        });
        console.log("1");

        // this.Chart = iaData.chart;
    }

    /**
     * runs at runtime
     */
    Iot_economics.prototype.run = function() {



    };

    /**
     * runs upon exit
     */
    Iot_economics.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Iot_economics;
}();


/*
var test = {
  datasets: [{
  borderColor: "#f56367",
  borderWidth: 2,
  data: [["2018-01", "9.2"],
        ["2018-02", "9.2"],
        ["2018-03", "9.2"],
        ["2018-04", "9.2"],
        ["2018-05", "9"],
        ["2018-06", "9"],
        ["2018-07", "9.1"],
        ["2018-08", "9.1"],
        ["2018-09", "9.1"]],
  fill: false,
  label: "France ",
  pointBackgroundColor: "#f56367",
  pointBorderWidth: 0,
  pointHitRadius: 5,
  pointRadius: 0,
  unit: "%"}
]
}
 */
