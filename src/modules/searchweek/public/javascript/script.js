/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Searchday (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Searchday.prototype.run = function() {

        var test = function( d ) {

            var target  = new Date(d.valueOf());
            console.log(target);
            var dayNr   = (d.getDay() + 6) % 7;
            console.log(dayNr);
            target.setDate(target.getDate() - dayNr + 3);
            console.log(target);
            var jan4    = new Date(target.getFullYear(), 0, 4);
            console.log(jan4);
            var dayDiff = (target - jan4) / 86400000;
            console.log(dayDiff);
            var weekNr = Math.ceil(dayDiff / 7);
            console.log(weekNr);

        }
        test(new Date("2017-02-2T03:24:00"));
    };

    /**
     * runs upon exit
     */
    Searchday.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Searchday;
}();