/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Color_game (iaData) {

    }

    /**
     * runs at runtime
     */
    Color_game.prototype.run = function() {
        this.game();
    };

    /**
     * runs upon exit
     */
    Color_game.prototype.stop = function() {

    };

    Color_game.prototype.game = function() {
        var canvas = document.getElementById("colorgame");
        var ctx = canvas.getContext("2d");
        var screen = 0;

        function drawStart() {
            ctx.openPath();
        }

        function draw() {
            if (screen === 0) {
                drawStart();
            }
        }

    };

    return Color_game;
}();