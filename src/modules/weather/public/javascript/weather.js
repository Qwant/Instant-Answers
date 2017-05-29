var IARuntime = function() {
    function Weather(iaData) {
        var it = this;
        it.temperatures = [];

        iaData.forecastFive.forEach(function(forecast) {
            it.temperatures.push(forecast.temperatures.max)
        });

        it.isHorizontal = iaData.isHorizontal;
        it.boxeCount = it.temperatures.length * 2;
        it.canvas = {
            w : 0,
            h : 120,
            chartHeight : 30
        }
    }

    Weather.prototype.run = function() {
        this.initDraw();
        this.draw();
        this.initSlideShow();
    };

    Weather.prototype.stop = function() {
        window.removeEventListener('resize', this.resizeWeather);
    };

    Weather.prototype.setSize = function() {

        if(!this.isHorizontal) {
            this.canvas.w = 300 * this.temperatures.length;
        } else {
            /*
                92 -> sidebar width
                450 -> ia-weather-current width
             */
            this.canvas.w = window.innerWidth - 92 - 450 - 20;
            if(this.canvas.w > 880) this.canvas.w = 880; /* keeper */
        }

        var forecastCells = document.getElementsByClassName('ia-weather-forecast-container');
        for(var i = 0; i < forecastCells.length; i += 1) {
            var forecastCell = forecastCells[i];
            var nl = this.canvas.w / this.temperatures.length;
            forecastCell.style.width = nl + 'px';
        }

        var forecastContainer = document.getElementById('ia-weather-forecast-five');
        if(this.canvas.w < 440) {
            forecastContainer.style.display = 'none';
            return;
        } else if(forecastContainer.style.display === 'none') {
            forecastContainer.style.display = 'block';
        }

        document.getElementById('ia-weather-temperature-chart').style.width = this.canvas.w + 'px';
        //forecastContainer.style.width =  this.canvas.w + 'px';
    };

    Weather.prototype.initDraw = function() {
        var it = this;
        it.setSize();
        if(!it.isHorizontal) {
            return;
        }

        it.resizeWeather = function () {
            it.setSize();
            it.draw();
        };

        window.addEventListener('resize', it.resizeWeather);
    };


    Weather.prototype.draw = function() {
        var c = document.getElementById('ia-weather-temperature-chart');

        c.width = this.canvas.w ;
        c.height = this.canvas.h;
        var ctx = c.getContext("2d");

        ctx.clearRect(0, 0, c.width, c.height);

        var min = this.temperatures[0],
            max = this.temperatures[0];
        this.temperatures.forEach(function(temperature) {
            if(temperature < min) min = temperature;
            if(temperature >  max) max = temperature;
        });

        var vtxs = [];
        var it = this;
        this.temperatures.forEach(function(temperature, index) {
            /* draw circle */
            var vtxX = it.canvas.w / it.temperatures.length * (index + 1) - it.canvas.w / it.boxeCount; // canvas.w / it.temperatures.length * (index + 1) - canvas.w / 12;
            var vtxY = it.canvas.h - (it.canvas.chartHeight / (max - min) * (temperature - min)) - 80;
            vtxs.push({x : vtxX, y :vtxY});

            ctx.beginPath();
            ctx.arc(vtxX,vtxY,4,0,2*Math.PI);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        /* line */
        vtxs.forEach(function(vtx, index) {
            if(index == 0) {
                ctx.beginPath();

                ctx.moveTo(1 / (2 * it.boxeCount) * it.canvas.w,vtx.y);
            }

            ctx.lineTo(vtx.x,vtx.y);

            if(index == vtxs.length - 1) {
                ctx.moveTo(vtx.x,vtx.y);
                var grad = ctx.createLinearGradient(1 / (2 * it.boxeCount) * it.canvas.w,0, (2 * it.boxeCount - 1)/(2 * it.boxeCount) * it.canvas.w,0);
                grad.addColorStop(0,"rgba(255,255,255,0)");
                grad.addColorStop(1 / it.boxeCount,"rgba(255,255,255,0.3)");
                grad.addColorStop((it.boxeCount - 1) / it.boxeCount,"rgba(255,255,255,0.3)");
                grad.addColorStop(1,"rgba(255,255,255,0)");

                ctx.strokeStyle = grad;
                ctx.lineTo((2 * it.boxeCount - 1) / (2 * it.boxeCount) * it.canvas.w,vtx.y);
                ctx.stroke();
                ctx.closePath();
            }
        });

        var fillAlphas = [0.11,0.24,0.17,0.11,0.03,0,0];
        var fillAlpha = fillAlphas[0];
        ctx.fillStyle = "rgba(255,255,255," + fillAlpha + ")";
        ctx.beginPath();
        ctx.moveTo(0, this.canvas.h);
        ctx.lineTo(0,vtxs[0].y);
        ctx.lineTo( this.canvas.w / it.boxeCount, vtxs[0].y);
        ctx.lineTo( this.canvas.w / it.boxeCount, this.canvas.h);
        ctx.fill();
        ctx.closePath();
        vtxs.forEach(function(vtx,index) {
            ctx.beginPath();
            fillAlpha = fillAlphas[index + 1];
            ctx.fillStyle = "rgba(255,255,255," + fillAlpha + ")";
            if(fillAlphas[index] != 0 && (index != vtxs.length - 1)) {
                ctx.moveTo(vtx.x,it.canvas.h);
                ctx.lineTo(vtx.x,vtx.y);
                ctx.lineTo(vtxs[index + 1].x, vtxs[index + 1].y);
                ctx.lineTo(vtxs[index + 1].x, it.canvas.h);
                ctx.fill();
            }
            ctx.closePath();
        });
    };

    Weather.prototype.initSlideShow = function() {
        var slideStep = 0;
        var slideShow = document.getElementById('ia-weather-forecast-five');
        var it = this;
        var slides = document.getElementsByClassName("ia-weather-forecast-five-container-cross-fade-helper");
        var slideShowSize = it.temperatures.length;

        function slide() {
            var weatherCanvasOffset = slideStep * it.canvas.w / slideShowSize;
            slideShow.style.marginLeft = '-' + weatherCanvasOffset + 'px';
            for(var i = 0; i < slides.length; i += 1) {
                var slide = slides[i];
                if(i == slideStep) {
                    slide.style.opacity = 1;
                } else{
                    slide.style.opacity = 0;
                }
            }
        }

        var leftNavButton = document.getElementById('ia-weather-forecast-nav--left');
        var rightNavButton = document.getElementById('ia-weather-forecast-nav--right');
        leftNavButton.onclick = function() {
            slideStep = slideStep - 1 < 0 ? slideShowSize - 1 : slideStep - 1;
            slide();
        };
        rightNavButton.onclick = function () {
            slideStep = slideStep + 1 > slideShowSize - 1 ? 0 : slideStep + 1;
            slide();
        }
    };



    return Weather;

}();