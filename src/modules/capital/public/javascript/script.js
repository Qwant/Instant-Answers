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
    Capital.prototype.run = function() {
        this.animateNumber("Pop_Number",this.data.Country.CountryCapPop);
        this.animateNumber("Area_Number",this.data.Country.CountryCapSup);
    };

    /**
     * runs upon exit
     */
    Capital.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Capital;
}();