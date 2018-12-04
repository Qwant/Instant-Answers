var IARuntime = function() {

    function Weather(iaData) {

        var it = this;
        it.iaData = iaData;
        it.temperatures = [];

        if(iaData.forecastFive.length > 0){
            iaData.forecastFive.forEach(function(forecast) {
                it.temperatures.push(forecast.temperatures.max)
            });
        }

        it.boxeCount = it.temperatures.length * 2;
        it.canvas = {
            w : 0,
            h : 120,
            chartHeight : 30
        }
    }

    Weather.prototype.run = function() {

        if(this.iaData.defaultProvider.label == "wetter.com") {
            // Old template (wetter + de_DE)
            this.initDraw();
            this.draw();
            this.initSlideShow();
        } else {
            // New template (openweathermap + NOT de_DE)
            this.weather_day = 0;
            this.weather_hour = 0;
            this.tomorrow = 0;
            var it = this;

            // Fill the information in each day button and make each day button clickable

            var weatherDayIcon = $i("weather_day_icon_0");
            var weatherDayName = $i("weather_day_name_0");
            var weatherDayMax = $i("weather_day_max_0");
            var weatherDayMin = $i("weather_day_min_0");
            if(weatherDayIcon) {
                weatherDayIcon.innerHTML = this.icon(it.iaData.currentWeather.main.weather.iconId, it.iaData.currentWeather.main.weather.status, 35, 35, 32, 32);
            }
            if(weatherDayName) {
                weatherDayName.innerHTML = _("Today", "ia-weather");
            }
            if(weatherDayMax) {
                weatherDayMax.innerHTML = this.temp(it.iaData.currentWeather.main.temperatures.max);
            }
            if(weatherDayMin) {
                weatherDayMin.innerHTML = this.temp(it.iaData.currentWeather.main.temperatures.min) + ' <span>' + _("min", "ia-weather") + '</span>';
            }

            var weatherDay = $i("day_0");
            if(weatherDay) {
                weatherDay.addEventListener("click", function () {
                    it.show_day(0);

                    LinkHelper.logHandler(this, Event, {AjaxRoute: 'ribbon', ia_name: 'weather', ia_link: 'day'});

                });
            }

            for(var weatherItemIndex in this.iaData.forecastFive){

                // Save the first day of the list as "tomorrow"
                if(this.tomorrow == 0){
                    this.tomorrow = weatherItemIndex;
                }

                $i("weather_day_icon_" + weatherItemIndex).innerHTML = this.icon(it.iaData.forecastFive[weatherItemIndex].main.weather.iconId, it.iaData.currentWeather.main.weather.status, 35, 35, 32, 32);
                $i("weather_day_name_" + weatherItemIndex).innerHTML = this.weekDay(it.iaData.forecastFive[weatherItemIndex].main.day);
                $i("weather_day_max_" + weatherItemIndex).innerHTML = this.temp(Math.round(it.iaData.forecastFive[weatherItemIndex].main.temperatures.max));
                $i("weather_day_min_" + weatherItemIndex).innerHTML = this.temp(it.iaData.forecastFive[weatherItemIndex].main.temperatures.min) + ' <span>' + _("min", "ia-weather") + '</span>';
                $i("day_" + weatherItemIndex).addEventListener("click", (function(n) {
                    return function () {
                        it.show_day(n);
                        LinkHelper.logHandler(this, Event, {AjaxRoute: 'ribbon', ia_name: 'weather', ia_link: 'day'});
                    };

                })(weatherItemIndex));
            }

            // Make tabs clickable
            $i("weather_tab_temperature").addEventListener("click", function() {
                it.weather_show_temperatures();
                LinkHelper.logHandler(this, Event, {AjaxRoute: 'ribbon', ia_name: 'weather', ia_link: 'tab_temperatures'});
            });
            $i("weather_tab_rain").addEventListener("click", function(){
                it.weather_show_rain();
                LinkHelper.logHandler(this, Event, {AjaxRoute: 'ribbon', ia_name: 'weather', ia_link: 'tab_rain'});
            });

            // Show current day
            this.show_day(0);
        }

    };

    // Old template (wetter + de_DE)
    // =============================

    Weather.prototype.stop = function() {
        window.removeEventListener('resize', this.resizeWeather);
    };

    Weather.prototype.setSize = function() {

        /*
            92 -> sidebar width
            450 -> ia-weather-current width
         */
        this.canvas.w = window.innerWidth - 92 - 450 - 20;
        if(this.canvas.w > 880) this.canvas.w = 880; /* keeper */

        var forecastCells = document.getElementsByClassName('ia-weather-forecast-container');
        for(var i = 0; i < forecastCells.length; i += 1) {
            var forecastCell = forecastCells[i];
            var nl = this.canvas.w / this.temperatures.length;
            forecastCell.style.width = nl + 'px';
        }

        var forecastContainer = document.getElementById('ia-weather-forecast-five');
        if(forecastContainer) {
            if (this.canvas.w < 440) {
                forecastContainer.style.display = 'none';
                return;
            } else if (forecastContainer.style.display === 'none') {
                forecastContainer.style.display = 'block';
            }
        }

        if(document.getElementById('ia-weather-temperature-chart')) {
            document.getElementById('ia-weather-temperature-chart').style.width = this.canvas.w + 'px';
        }
    };

    Weather.prototype.initDraw = function() {
        var it = this;
        it.setSize();

        it.resizeWeather = function () {
            it.setSize();
            it.draw();
        };

        window.addEventListener('resize', it.resizeWeather);
    };

    Weather.prototype.draw = function() {
        var c = document.getElementById('ia-weather-temperature-chart');

        if(c) {
            c.width = this.canvas.w;
            c.height = this.canvas.h;
            var ctx = c.getContext("2d");

            ctx.clearRect(0, 0, c.width, c.height);

            var min = this.temperatures[0],
                max = this.temperatures[0];
            this.temperatures.forEach(function (temperature) {
                if (temperature < min) min = temperature;
                if (temperature > max) max = temperature;
            });

            var vtxs = [];
            var it = this;
            this.temperatures.forEach(function (temperature, index) {
                /* draw circle */
                var vtxX = it.canvas.w / it.temperatures.length * (index + 1) - it.canvas.w / it.boxeCount; // canvas.w / it.temperatures.length * (index + 1) - canvas.w / 12;
                var vtxY = it.canvas.h - (it.canvas.chartHeight / (max - min) * (temperature - min)) - 80;
                vtxs.push({x: vtxX, y: vtxY});

                ctx.beginPath();
                ctx.arc(vtxX, vtxY, 4, 0, 2 * Math.PI);
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.stroke();
            });

            /* line */
            vtxs.forEach(function (vtx, index) {
                if (index === 0) {
                    ctx.beginPath();
                    ctx.moveTo(1 / (2 * it.boxeCount) * it.canvas.w, vtx.y);
                }

                ctx.lineTo(vtx.x, vtx.y);

                if (index == vtxs.length - 1) {
                    ctx.moveTo(vtx.x, vtx.y);
                    var grad = ctx.createLinearGradient(1 / (2 * it.boxeCount) * it.canvas.w, 0, (2 * it.boxeCount - 1) / (2 * it.boxeCount) * it.canvas.w, 0);
                    grad.addColorStop(0, "rgba(255,255,255,0)");
                    grad.addColorStop(1 / it.boxeCount, "rgba(255,255,255,0.3)");
                    grad.addColorStop((it.boxeCount - 1) / it.boxeCount, "rgba(255,255,255,0.3)");
                    grad.addColorStop(1, "rgba(255,255,255,0)");

                    ctx.strokeStyle = grad;
                    ctx.lineTo((2 * it.boxeCount - 1) / (2 * it.boxeCount) * it.canvas.w, vtx.y);
                    ctx.stroke();
                    ctx.closePath();
                }
            });

            var fillAlphas = [0.11, 0.24, 0.17, 0.11, 0.03, 0, 0];
            var fillAlpha = fillAlphas[0];
            ctx.fillStyle = "rgba(255,255,255," + fillAlpha + ")";
            ctx.beginPath();
            ctx.moveTo(0, this.canvas.h);
            ctx.lineTo(0, vtxs[0].y);
            ctx.lineTo(this.canvas.w / it.boxeCount, vtxs[0].y);
            ctx.lineTo(this.canvas.w / it.boxeCount, this.canvas.h);
            ctx.fill();
            ctx.closePath();
            vtxs.forEach(function (vtx, index) {
                ctx.beginPath();
                fillAlpha = fillAlphas[index + 1];
                ctx.fillStyle = "rgba(255,255,255," + fillAlpha + ")";
                if (fillAlphas[index] != 0 && (index != vtxs.length - 1)) {
                    ctx.moveTo(vtx.x, it.canvas.h);
                    ctx.lineTo(vtx.x, vtx.y);
                    ctx.lineTo(vtxs[index + 1].x, vtxs[index + 1].y);
                    ctx.lineTo(vtxs[index + 1].x, it.canvas.h);
                    ctx.fill();
                }
                ctx.closePath();
            });
        }
    };

    Weather.prototype.initSlideShow = function() {
        if(uxVersions.indexOf('v4') > -1) {
            return;
        }
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


    // New template (openweathermap + NOT de_DE)
    // =========================================

    Weather.prototype.show_day = function(n){

        var it = this;

        this.weather_day = n;

        // Mark current day
        removeClass($(".weather_day.current")[0], "current");
        addClass($i("day_" + this.weather_day), "current");

        // Get the right dataset
        var day_data = this.weather_day == 0 ? this.iaData.currentWeather : this.iaData.forecastFive[this.weather_day];

        // Place
        $i("weather_info_place").innerHTML = this.iaData.localisation.city + ", " + this.iaData.localisation.country.toUpperCase();

        // Temperatures
        // ------------
        var temp = [];

        // Default scale
        var min = 99;
        var max = -99;

        for(var i = 0; i < 8; i++){
            temp[i] = Math.round(day_data.list[i].temperature - 273.15);
            if(temp[i] < min) min = temp[i];
            if(temp[i] > max) max = temp[i];
        }

        // A total height of 85px is available to represent all the temperature range
        // If all the temperatures are positive the minimum is 0°C
        // If all the temperatures are negative the maximum is 0°C
        // In the div, y=0 represents the max and y=85 represents the min.
        // dh is the height of 1°C
        var dh = 80 / (Math.max(max, 2) - Math.min(min, 0));

        // Rain
        // ----
        var rain = [];

        // Default scale
        var rain_max = 5;

        for(var i = 0; i < 8; i++){
            rain[i] = Math.round(day_data.list[i].rain * 10);
            if(rain[i] > rain_max) rain_max = rain[i];
        }

        // A total height of 85px is available to represent all the rain range
        // The minimum is 0mm
        // In the div, y=0 represents the max and y=85 represents the min.
        // rain_dh is the height of 1mm
        var rain_dh = 80 / rain_max;

        // Draw each column
        var columns = $i("weather_hour_columns");
        if(columns) {
            columns.innerHTML = "";
        }

        for(i = 0; i < 8; i++){

            // Columns
            if(columns) {
                columns.innerHTML += "<div class='weather_hour_column' id='weather_hour_column" + i + "'></div>"
            }

            var column = $i("weather_hour_column" + i);

            if(column) {

                // Hours
                column.innerHTML += "<div class='weather_hour_column_hour'>" + day_data.list[i].hour + "H</div>";

                // Icons
                column.innerHTML += "<div class='weather_hour_column_icon'>" + this.icon(day_data.list[i].weather.iconId, day_data.list[i].weather.status, 25, 20, 32, 32, day_data.list[i].hour) + "</div>";

                // Temperatures
                column.innerHTML += "<div class='weather_hour_column_temperature_container'><div class='weather_hour_column_temperature" + (temp[i] < 0 ? " negative" : " positive") + "' style='top: " +  ((temp[i] < 0 ? Math.max(max, 2) : (Math.max(max, 2) - temp[i])) * dh + 25)  + "px; height: " + (Math.abs(temp[i]) * dh + 1) + "px;'><span class='" + ((temp[i] == max || temp[i] == min) ? "minmax" : "") + "'>" + this.temp(day_data.list[i].temperature, 1) + "°</span></div></div>";

                // Rain
                column.innerHTML += "<div class='weather_hour_column_rain_container'><div class='weather_hour_column_rain positive' style='top: " + ((rain_max - (rain[i] == 0 ? (day_data.list[i].rain * 10) : rain[i])) * rain_dh + 25) + "px; height: " + ((rain[i] == 0 ? (day_data.list[i].rain * 10) : rain[i]) * rain_dh + 1) + "px;'><span class='" + ((rain[i] == rain_max) ? "minmax" : "") + "'>" + (rain[i] == 0 ? (day_data.list[i].rain == 0 ? "0mm" : "<1mm") : rain[i] + "mm") + "</span></div></div>";
            }
        }

        // Click listeners on each column to show the hour detail
        for(i = 0; i < 8; i++){
            $i("weather_hour_column" + i).addEventListener("click", (function(n){
                return function(){
                    it.show_hour(n);
                    LinkHelper.logHandler(this, Event, {AjaxRoute: 'ribbon', ia_name: 'weather', ia_link: 'hour'});
                };
            })(i));
        }

        // Show the info for the default hour for that day
        if(this.weather_day == 0){
            this.show_hour(0);
        } else {
            for(var i = 0; i < 8; i++){
                if(day_data.list[i].hour == day_data.main.hour){
                    this.show_hour(i);
                }
            }
        }

        // Day's max/min
        $i("weather_info_max").innerHTML = this.temp(day_data.main.temperatures.max);
        $i("weather_info_min").innerHTML = this.temp(day_data.main.temperatures.min) + ' <span>' + _("min", "ia-weather") + '</span>';

        // Remove hour on top after day name
        $i("weather_info_day").innerHTML = this.weather_day == 0 ? _("Today", "ia-weather") : this.weekDay(this.iaData.forecastFive[this.weather_day].main.day);

        // Remove max temp margin
        removeClass($i("weather_info_max"), "maxOnly");
    };

    Weather.prototype.show_hour = function(n){

        this.weather_hour = n;

        var current_hour = $(".weather_hour_column.current")[0];
        if(current_hour){
            removeClass(current_hour, "current");
        }

        addClass($i("weather_hour_column" + this.weather_hour), "current");

        // Move highlight marker on desktop
        if(window.innerWidth >= 1024 && (window.innerWidth <= 1200 || window.innerWidth >= 1440)){
            $i("weather_hour_highlight").style.left = (this.weather_hour * (420 * 0.125)) + "px";
        }

        var day_name = "";

        var hour_data = this.weather_day == 0 ? this.iaData.currentWeather.list[this.weather_hour] : this.iaData.forecastFive[this.weather_day].list[this.weather_hour];

        if(this.weather_day == 0 && (this.iaData.currentWeather.list[this.weather_hour].hour <= this.iaData.currentWeather.main.hour || this.weather_hour == 7)){
            // On the current day, if the hour is lower than current hour or if it's the last column, the selected day is actually tomorrow
            day_name = this.weekDay(this.iaData.forecastFive[this.tomorrow].main.day);
        } else if(this.weather_day == 0) {
            // Else, current day
            day_name = _("Today", "ia-weather");
        } else {
            // Else, other day
            day_name = this.weekDay(this.iaData.forecastFive[this.weather_day].main.day);
        }

        // Add hour after the day's name
        day_name = day_name + ', ' + hour_data.hour + "h";

        $i("weather_info_day").innerHTML = day_name;

        // Icon
        $i("weather_info_icon").innerHTML = this.icon(hour_data.weather.iconId, hour_data.weather.status, 75, 70, 32, 32, hour_data.hour);

        // Max
        $i("weather_info_max").innerHTML = this.temp(hour_data.temperature);

        // Min
        $i("weather_info_min").innerHTML = "";

        // Humidity
        $i("weather_info_humidity").innerHTML = hour_data.humidity + "%";

        // Pressure
        $i("weather_info_pressure").innerHTML = Math.round(hour_data.pressure) + "hPa";

        // Rain
        $i("weather_info_rain").innerHTML = (Math.round(hour_data.rain * 10) == 0 ? (hour_data.rain == 0 ? "0mm" : "<1mm") : Math.round(hour_data.rain * 10) + "mm");

        // Wind
        $i("weather_info_wind").innerHTML = Math.round(hour_data.wind) + "km/h";

        // Add a margin to the max temp because there's no min temp for a given hour
        addClass($i("weather_info_max"), "maxOnly");
    };

    Weather.prototype.weather_show_temperatures = function(){
        addClass($i("weather_hour_columns"),"temperature");
        removeClass($i("weather_hour_columns"),"rain");

        addClass($i("weather_tab_temperature"),"current");
        removeClass($i("weather_tab_rain"),"current");
    };

    Weather.prototype.weather_show_rain = function(){
        addClass($i("weather_hour_columns"), "rain");
        removeClass($i("weather_hour_columns"), "temperature");

        removeClass($i("weather_tab_temperature"), "current");
        addClass($i("weather_tab_rain"), "current");
    };

    // Temperature and date functions for the new template
    Weather.prototype.kToC = function(k){
        return k - 273.15;
    };

    Weather.prototype.kToF = function(k){
        return k * 9 / 5 - 459.67;
    };

    Weather.prototype.temp = function(temperature, hideUnit, isPrimary, unit){
        if(isNaN(temperature)) {
            return 'N/A'
        }
        var isFahrenheit = applicationState.user.userSetting.searchRegionKey === "US";
        if(!isFahrenheit) {
            temperature = this.kToC(temperature);
            unit = 'C'
        } else {
            temperature = this.kToF(temperature);
            unit = 'F'
        }
        return Math.round(temperature) + (hideUnit ? "" : '&deg;' + unit);
    };

    Weather.prototype.icon = function(icon, status, w, h, vw, vh, hour){

        var iconId = icon.substring(0,2);

        // Icons 01, 02 and 03 have a night version.
        // The API returns a sunrise and a sunset hour (or -1 by default),
        // in certain regions of the world and certain periods of the year,
        // the sunset can happen after midnight and the sunrise before midnight.
        // The polar night and days don't seem to be known by openweathermap,
        // so this case is not covered here.

        if(!(this.iaData.currentWeather.main.sunrise == -1 || this.iaData.currentWeather.main.sunset == -1)){

            // Normal case: sunrise < sunset in a 0-24h period
            if(this.iaData.currentWeather.main.sunrise < this.iaData.currentWeather.main.sunset){
                if((iconId == "01" || iconId == "02" || iconId == "03") && (hour > this.iaData.currentWeather.main.sunset || hour <= this.iaData.currentWeather.main.sunrise)){
                    iconId += "-night";
                }
            }

            // Edge case: sunset < sunrise in a 0-24h period
            if(this.iaData.currentWeather.main.sunset < this.iaData.currentWeather.main.sunrise){
                if((iconId == "01" || iconId == "02" || iconId == "03") && (hour > this.iaData.currentWeather.main.sunset && hour <= this.iaData.currentWeather.main.sunrise)){
                    iconId += "-night";
                }
            }
        }

        return  '<svg class="ribbon-knowledge-weather-icon" title="'+ status + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + vw + ' ' + vh + '">' +
                '  <use xlink:href="/img/v4/icon-spritesheet-weather.svg#icon-weather-' + iconId + '"></use>' +
                '</svg>';
    };

    // Old template (get day name based on a timestamp)
    Weather.prototype.dateDay = function(dateTime){
        var date = new Date(dateTime);
        return ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][date.getDay()].replace(/^./, function(initial){return initial.toUpperCase()});
    };

    // New template (get day name based on a number from 0 (sunday) to 7 (saturday))
    Weather.prototype.weekDay = function(day){
        return [_("Sunday", "ia-weather"), _("Monday", "ia-weather"), _("Tuesday", "ia-weather"), _("Wednesday", "ia-weather"), _("Thursday", "ia-weather"), _("Friday", "ia-weather"), _("Saturday", "ia-weather")][day].replace(/^./, function(initial){return initial.toUpperCase()});
    };

    return Weather;

}();