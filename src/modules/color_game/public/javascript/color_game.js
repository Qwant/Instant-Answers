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
        canvas.width = 800;
        canvas.height = 600;

        var screen = 0;
        var x = 0;
        var y = 0;
        var click = false;
        var level = 1;
        var pos;
        var color;
        var row;
        var column;
        var lumi;
        var start;
        var end;
        var diff;

        window.addEventListener('mousemove', function (e) {
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;
        });
        window.addEventListener('click', function () {
            click = true;
        });

        function randomColor() {
            var number = Math.trunc(Math.random() * 10000) % 8;

            switch (number) {
                case 0:
                    return ({ r : 85, g : 170, b : 85});
                case 1:
                    return ({ r : 170, g : 85, b : 85});
                case 2:
                    return ({ r : 85, g : 85, b : 170});
                case 3:
                    return ({ r : 170, g : 170, b : 85});
                case 4:
                    return ({ r : 85, g : 170, b : 170});
                case 5:
                    return ({ r : 170, g : 85, b : 170});
                case 6:
                    return ({ r : 85, g : 85, b : 85});
                default:
                    return ({ r : 170, g : 170, b : 170});
            }
        }

        function rgb(r, g, b){
            return "rgb("+r+","+g+","+b+")";
        }

        function drawStart() {
            ctx.beginPath();
            ctx.fillStyle = rgb(0, 0, 0);
            ctx.font = "20px Arial";
            ctx.fillText("Start!", canvas.width / 2 - 25, canvas.height / 2);
            ctx.closePath();
        }

        function drawEnd() {
            ctx.beginPath();
            ctx.fillStyle = rgb(0, 0, 0);
            ctx.font = "20px Arial";
            ctx.fillText("Score: ".concat((level - 1).toString()), canvas.width / 2 - 40, canvas.height / 2);
            ctx.fillText("Click To Continue!", canvas.width / 2 - 70, canvas.height / 2 + 30);
            ctx.closePath();
        }

        function luminosity(col) {
            var neg = 1;
            if (lumi === 0) {
                neg = -1;
            }
            return (rgb(col.r + ((50 - level) * neg), col.g + ((50 - level) * neg), col.b + ((50 - level) * neg)));
        }

        function drawGame() {
            var tmpCol;
            for (var i = 0; i < row; ++i) {
                for (var j = 0; j < column; ++j) {
                    if (pos === i * column + j) {
                        tmpCol = luminosity(color);
                    }
                    else {
                        tmpCol = rgb(color.r, color.g, color.b);
                    }
                    ctx.beginPath();
                    ctx.fillStyle = tmpCol;
                    ctx.rect(j * Math.trunc(canvas.height / column), i * Math.trunc(canvas.height / row), Math.trunc(canvas.height / column), Math.trunc(canvas.height / row));
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }

        function drawCadri() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            var tmpLevel = level;
            if (level >= 14) {
                tmpLevel = 13;
            }
            tmpLevel = (tmpLevel + 1) * Math.trunc(canvas.height / row);
            for (var i = 0; i <= canvas.height; i += Math.trunc(canvas.height / row)) {
                ctx.rect(0, i, tmpLevel, 1);
                ctx.rect(i, 0, 1, tmpLevel);
                ctx.fill();
            }
            ctx.closePath();

        }

        function drawChrono(str) {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "50px Arial";
            var textWidth = ctx.measureText("Timer");
            ctx.fillText("Timer", 700 - textWidth / 2, 320);
            textWidth = ctx.measureText(str);
            ctx.fillText(str, 700 - textWidth / 2, 350);
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (screen === 0) {
                drawStart();
                if (x >= canvas.width / 3 && x < 2 * canvas.width / 3 && y >= canvas.height / 3 && y < 2 * canvas.height / 3 && click) {
                    row = 2;
                    column = 2;
                    level = 1;
                    pos = Math.trunc(Math.random() * 10000) % (row * column);
                    color = randomColor();
                    screen = (screen + 1) % 3;
                    lumi = Math.trunc(Math.random() * 10000) % 2;
                    document.getElementById("chrono").innerHTML = "90 seconds";
                    start = new Date();
                }
            }
            else if (screen === 1) {
                drawGame();
                drawCadri();
                if ((x >= (pos % column) * Math.trunc(canvas.height / column) && x < (1 + (pos % column)) * Math.trunc(canvas.height / column)) &&
                    (y >= Math.trunc(pos / column) * Math.trunc(canvas.height / row) && y < (1 + Math.trunc(pos / column)) * Math.trunc(canvas.height / row)) && click) {
                    ++level;
                        if (row < 14 && column < 14) {
                            ++row;
                            ++column;
                        }
                    pos = Math.trunc(Math.random() * 10000) % (row * column);
                    color = randomColor();
                    lumi = Math.trunc(Math.random() * 10000) % 2;
                    if (level === 50) {
                        screen = (screen + 1) % 3;
                    }
                }
                end = new Date();
                diff = end - start;
                diff = new Date(diff);
                drawChrono((90 - (diff.getSeconds() + diff.getMinutes() * 60)).toString().concat(" seconds"));
                if (90 - (diff.getSeconds() + diff.getMinutes() * 60) <= 0) {
                    screen = (screen + 1) % 3;
                }
            }
            else if (screen === 2) {
                drawEnd();
                if (x >= canvas.width / 3 && x < 2 * canvas.width / 3 && y >= canvas.height / 3 && y < 2 * canvas.height / 3 && click) {
                    row = 2;
                    column = 2;
                    pos = Math.trunc(Math.random() * 10000) % (row * column);
                    color = randomColor();
                    screen = (screen + 1) % 3;
                    lumi = Math.trunc(Math.random() * 10000) % 2;
                }
            }
            click = false;
        }
        setInterval(draw, 10);
    };

    return Color_game;
}();