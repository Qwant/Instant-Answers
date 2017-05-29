/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function {{ianame}} (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    {{ianame}}.prototype.run = function() {
        // function that's gonna run at runtime
    };

    /**
     * runs upon exit
     */
    {{ianame}}.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return {{ianame}};
}();