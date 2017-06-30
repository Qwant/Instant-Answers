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
        var x = 0;
        var y = 0;
        window.addEventListener('mousemove', function (e) {
            x = e.pageX;
            y = e.pageY;
        });

        function drawStart() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "20px Arial";
            ctx.fillText("Start!".concat(x.toString()), canvas.width / 2 - 25, canvas.height / 2);
            ctx.closePath();
        }

        function draw() {
            if (screen === 0) {
                drawStart();
            }
        }

        setInterval(draw, 100);
    };

    return Color_game;
}();