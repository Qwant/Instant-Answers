/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Base_conversion (iaData) {

    }

    /**
     * runs at runtime
     */
    Base_conversion.prototype.run = function() {
        this.convert();
    };

    /**
     * runs upon exit
     */
    Base_conversion.prototype.stop = function() {

    };

    Base_conversion.prototype.convert = function() {
        alert(document.getElementById("test").innerHTML);
        alert(document.getElementById("test").value);
    };

    return Base_conversion;
}();