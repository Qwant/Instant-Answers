/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Iot_events (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Iot_events.prototype.run = function() {
        // function that's gonna run at runtime
    };

    /**
     * runs upon exit
     */
    Iot_events.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Iot_events;
}();