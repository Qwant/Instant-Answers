/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Imc (iaData) {
        // constructor
    }
    Imc.prototype.test = function() {


    }
    /**
     * runs at runtime
     */
    Imc.prototype.run = function() {
        this.test();
    };

    /**
     * runs upon exit
     */
    Imc.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Imc;
}();