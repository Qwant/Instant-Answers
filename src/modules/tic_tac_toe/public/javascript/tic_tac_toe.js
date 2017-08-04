/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Tic_tac_toe (iaData) {

    }

    /**
     * runs at runtime
     */
    Tic_tac_toe.prototype.run = function() {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        var idInterval = 0;
        can.style.display = "none";
        cross.style.display = "none";
        play.addEventListener("click", function(){
            if (state === 0){
                elem.style.height = "800px";
                setTimeout(function(){
                    can.style.display = "block";
                    cross.style.display = "block";
                }, 800);
                play.style.cursor = "default";
                play.style.display = "none";
                idInterval = scope.game();
                state = 1;
            }
        });
        cross.addEventListener("click", function(){
            if(state === 1){
                elem.style.height = "200px";
                can.style.display = "none";
                cross.style.display = "none";
                setTimeout(function(){
                    play.style.cursor = "pointer";
                }, 800);
                state = 0;
                clearInterval(idInterval);
                play.style.display = "block";
            }
        })
    };

    /**
     * runs upon exit
     */
    Tic_tac_toe.prototype.stop = function() {

    };

    Tic_tac_toe.prototype.game = function() {
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;
        var game = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        var screen = 0;
        var xCurs = 0;
        var yCurs = 0;
        var click = false;
        var iaMode = true;
        var result = "Result";
        var pion = 1;

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX - canvas.offsetLeft;
            yCurs = e.pageY - canvas.offsetTop;
        });
        window.addEventListener('click', function () {
            click = true;
        });

        function checkLoseWin(char, max) {
            var nb = 0;
            var i;
            var j = 0;
            var index = 0;
            var save;

            for (i = 0; i < 3; ++i) {
                for (j = 0; j < 3; ++j) {
                    if (game[index] === char) {
                        ++nb;
                    }
                    if (nb === max) {
                        if (max === 3) {
                            return (1);
                        }
                        save = i * 3 + 2;
                        while (game[save] === char) {
                            --save;
                        }
                        if (game[save] === 0) {
                            return (save);
                        }
                    }
                    ++index;
                }
                nb = 0;
            }

            index = 0;
            for (i = 0; i < 3; ++i) {
                for (j = 0; j < 3; ++j) {
                    if (game[index] === char) {
                        ++nb;
                    }
                    if (nb === max) {
                        if (max === 3) {
                            return (1);
                        }
                        save = i + 3 * 2;
                        while (game[save] === char) {
                            save -= 3;
                        }
                        if (game[save] === 0) {
                            return (save);
                        }
                    }
                    index = (index + 3) % 9;
                }
                ++index;
                nb = 0;
            }

            index = 0;
            for (i = 0; i < 3; ++i) {
                if (game[index] === char) {
                    ++nb;
                }
                if (nb === max) {
                    if (max === 3) {
                        return (1);
                    }
                    save = 8;
                    while (game[save] === char) {
                        save -= 4;
                    }
                    if (game[save] === 0) {
                        return (save);
                    }
                }
                index += 4;
            }

            nb = 0;
            index = 6;
            for (i = 0; i < 3; ++i) {
                if (game[index] === char) {
                    ++nb;
                }
                if (nb === max) {
                    if (max === 3) {
                        return (1);
                    }
                    save = 2;
                    while (game[save] === char) {
                        save += 2;
                    }
                    if (game[save] === 0) {
                        return (save);
                    }
                }
                index -= 2;
            }

            return (-1);
        }

        function findCaseToCounter(turn) {
            var i = 1;
            while (i < 9) {
                if (game[i] === 0 && game[i - 1] === turn) {
                    return (i);
                }
                ++i;
            }
            return (-1);
        }

        function centerStrat(turn) {
            if (game[4] === 0) {
                return (4);
            }
            else if (game[4] === turn) {
                if (game[0] === 0) {
                    return (0);
                }
                else if (game[2] === 0) {
                    return (2);
                }
                else if (game[6] === 0) {
                    return (6);
                }
                else if (game[8] === 0) {
                    return (8);
                }
            }
            return (-1);
        }

        function drawMatch() {
            var i = 0;
            while (i < 9) {
                if (game[i] === 0) {
                    return (false);
                }
                ++i;
            }
            return (true);
        }

        function ia() {
            var save;
            var enemy = 1 + pion % 2;

            if ((save = checkLoseWin(pion, 2)) !== -1) {
                game[save] = pion;
            }
            else if ((save = checkLoseWin(enemy, 2)) !== -1) {
                game[save] = pion;
            }
            else if ((save = centerStrat(enemy)) !== -1) {
                game[save] = pion;
            }
            else if ((save = findCaseToCounter(enemy)) !== -1) {
                game[save] = pion;
            }
            else {
                var i = 0;
                while (i < 9) {
                    if (game[i] === 0) {
                        game[i] = pion;
                        break;
                    }
                    ++i;
                }
            }
            pion = 1 + pion % 2;
        }

        function drawGame() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            for (var i = 0; i < 4; ++i) {
                if (i === 3) {
                    ctx.rect(0, i * canvas.height / 3 - 1, canvas.height, 1);
                }
                else {
                    ctx.rect(0, i * canvas.height / 3, canvas.height, 1);
                }
                ctx.fill();
            }
            for (i = 0; i < 4; ++i) {
                ctx.rect(i * canvas.height / 3, 0, 1, canvas.height);
                ctx.fill();
            }
            ctx.closePath();
            for (i = 0; i < 9; ++i) {
                ctx.beginPath();
                ctx.font = "180px Arial";
                if (game[i] === 1) {
                    var textWidth = ctx.measureText("O").width;

                    ctx.fillStyle = "#ff0000";
                    ctx.fillText("O", (i % 3) * (canvas.height / 3) + (canvas.height / 6) - textWidth / 2, Math.trunc(i / 3) * (canvas.height / 3) + (canvas.height / 6) + textWidth / 2);
                }
                else if (game[i] === 2) {
                    textWidth = ctx.measureText("X").width;

                    ctx.fillStyle = "#0000ff";
                    ctx.fillText("X", (i % 3) * (canvas.height / 3) + (canvas.height / 6) - textWidth / 2, Math.trunc(i / 3) * (canvas.height / 3) + (canvas.height / 6) + textWidth / 2);
                }
                ctx.closePath();
            }
        }

        function drawMode() {
            ctx.beginPath();
            ctx.font = "70px Arial";
            if (iaMode) {
                var textWidth = ctx.measureText("IA").width;

                ctx.fillStyle = "#000000";
                ctx.fillText("IA", 700 - textWidth / 2, 100 + textWidth / 2);
            }
            else {
                textWidth = ctx.measureText("1V1").width;

                ctx.fillStyle = "#000000";
                ctx.fillText("1V1", 700 - textWidth / 2, 130);
            }
            ctx.closePath();
        }

        function drawResult() {
            ctx.beginPath();
            ctx.font = "50px Arial";
            var textWidth = ctx.measureText(result).width;
            ctx.fillStyle = "#000000";
            ctx.fillText(result, 700 - textWidth / 2, 300);
            ctx.closePath();
        }

        function drawReset() {
            ctx.beginPath();
            ctx.font = "50px Arial";
            var textWidth = ctx.measureText("Reset").width;
            ctx.fillStyle = "#000000";
            ctx.fillText("Reset", 700 - textWidth / 2, 500);
            ctx.closePath();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (screen === 0) {
                ctx.beginPath();
                ctx.font = "20px Arial";
                ctx.fillText("Start!", canvas.width / 2 - 25, canvas.height / 2);
                ctx.closePath();
                if (click && xCurs > canvas.width / 3 && xCurs < 2 * canvas.width / 3 && yCurs > canvas.height / 3 && yCurs < 2 * canvas.height / 3) {
                    screen = (screen + 1) % 3;
                }
            }
            else if (screen === 1) {
                drawGame();
                drawMode();
                drawResult();
                drawReset();
                if (click && xCurs >= 0 && yCurs >= 0) {
                    var played = false;
                    var x = Math.trunc(xCurs / 200);
                    var y = Math.trunc(yCurs / 200);
                    if (x >= 0 && x < 3 && y >= 0 && y < 3 && game[y * 3 + x] === 0) {
                        game[y * 3 + x] = pion;
                        pion = 1 + pion % 2;
                        played = true;
                    }
                    if (x === 3 && y === 0) {
                        iaMode = !iaMode;
                    }
                    if (x === 3 && y === 2) {
                        for (var i = 0; i < 9; ++i) {
                            game[i] = 0;
                            pion = 1;
                            result = "Result";
                        }
                    }
                    if (iaMode && played) {
                        ia();
                    }
                }
                if (checkLoseWin(1, 3) === 1) {
                    result = "O Wins";
                }
                else if (checkLoseWin(2, 3) === 1) {
                    result = "X Wins";
                }
                else if (drawMatch() === true) {
                    result = "Draw";
                }
            }
            click = false;
        }
        var idInterval = setInterval(draw, 10);
        return (idInterval);
    };

    return Tic_tac_toe;
}();