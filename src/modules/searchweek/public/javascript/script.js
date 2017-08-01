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
            document.getElementById('result').innerHTML = weekNr;
            var tab_mois= ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            var today = new Date();
            var dd = today.getDate();
            var mm = tab_mois[today.getMonth()]; //January is 0!
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            }
            today = dd + ' ' + mm + ' ' + yyyy;
            document.getElementById('current_date').innerHTML = today;

        }
        test(new Date());
    };

    /**
     * runs upon exit
     */
    Searchday.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Searchday;
}();