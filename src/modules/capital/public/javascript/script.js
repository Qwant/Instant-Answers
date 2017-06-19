/**
 * This is your main script file. Please refer to the documentation for more information.
 */
var IARuntime = function() {
    function Capital (iaData) {
        // constructor
        var it = this;
        it.data = iaData;
    }

    /**
     * runs at runtime
     */
    Capital.prototype.animateNumber = function (id,max){
        var counter = 0;
        var max= max;
        var interval = setInterval(function(){
            counter += max/50;
            if(counter > max){
                clearInterval(interval);
                max = new Intl.NumberFormat("en",{useGrouping: true}).format(max);
                console.log(max);

                document.getElementById(id).innerHTML = max;
            }
            else{
                document.getElementById(id).innerHTML = counter.toFixed();
            }
        },16)
    };
    Capital.prototype.addZero = function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    Capital.prototype.getHorloge = function(id,Dateid) {
        var d = new Date();
        var x = document.getElementById(id);
        var date = document.getElementById(Dateid);
        var h = d.getHours()+this.data.Country.CountryCapHour;
        var m = d.getMinutes()+(d.getTimezoneOffset());
        console.log(m);
        console.log(h);
        if (m >= (+60)) {
            while (m >= (+60)) {
                m = m - 60;
                h = h + 1;
            }
        }
        console.log(m);
        console.log(h);
        if (m <= (-60)) {
            while (m <= (-60)) {
                m = m + 60;
                h = h - 1;
            }
        }
       if (m < 0){
            h -= 1;
            m = 60+m;
       }
        console.log(m);
        console.log(h);
        var day = d.getDate();
        if (h >= 24){
            h = h-24;
            day = d.getDate()+1;
        }
        console.log(h);
        if (h <=0){
            h = h+24;
            day = d.getDate()-1;
        }
        date.innerHTML = day+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
        x.innerHTML = h + ":" + m;

    };
    Capital.prototype.run = function() {
        this.animateNumber("Pop_Number",this.data.Country.CountryCapPop);
        this.animateNumber("Area_Number",this.data.Country.CountryCapSup);
        this.animateNumber("Dens_Number",this.data.Country.CountryCapDens);
        this.getHorloge("Horloge","Date");
    };

    /**
     * runs upon exit
     */
    Capital.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Capital;
}();