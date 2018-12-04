/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Ia_test (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Ia_test.prototype.run = function() {
        // function that's gonna run at runtime
    };

    /**
     * runs upon exit
     */
    Ia_test.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Ia_test;
}();