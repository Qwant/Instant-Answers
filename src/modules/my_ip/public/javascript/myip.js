/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function My_ip (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    My_ip.prototype.run = function() {
        // function that's gonna run at runtime
    };

    /**
     * runs upon exit
     */
    My_ip.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return My_ip;
}();