/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    var iaData = {};

    function Beautify (iaData) {
      this.iaData = iaData;
    }

    /**
     * runs at runtime
     */
    Beautify.prototype.run = function() {
        console.log('Beautify.run()');
        console.log(this.iaData);
        var structureId = 0;
        var result = $(".ia__beautify .result");
        3 != this.iaData.template && result.find(".json").find(".sBrace, .sBracket").each(function(i) {
            "{" == $(this).text() || "[" == $(this).text() ? ($(this).addClass("structure-" + ++structureId),
            $(this).append(' <a href="javascript:;"><i class="fa fa-minus-square-o"></i></a> ')) : "}" != $(this).text() && "]" != $(this).text() || $(this).addClass("structure-" + structureId--)
        });
    };

    /**
     * runs upon exit
     */
    Beautify.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Beautify;
}();
