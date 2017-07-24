/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Sudoku (iaData) {

    }

    /**
     * runs at runtime
     */
    Sudoku.prototype.run = function() {
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
                play.style.display = "block";
                clearInterval(idInterval);
            }
        })
    };

    /**
     * runs upon exit
     */
    Sudoku.prototype.stop = function() {

    };

    Sudoku.prototype.game = function() {
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;

        var screen = 0;
        var xCurs = 0;
        var yCurs = 0;
        var click = false;
        var size = Math.trunc((canvas.height - 150) / 9);
        var startX = (canvas.width - size * 9) / 2;
        var startY = (canvas.height - size * 9) / 2;
        var mode = false;
        var game = [];
        var x = 0;
        var y = 0;

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX - canvas.offsetLeft;
            yCurs = e.pageY - canvas.offsetTop;
        });
        window.addEventListener('click', function () {
            click = true;
        });
        window.addEventListener("keydown", keyDownHandler, false);

        function keyDownHandler(e) {
            if (screen !==1) {
                return;
            }
            if (((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 107) || e.keyCode === 8) && game[y * 9 + x].isSelected) {
                e.preventDefault();
                if (!mode) {
                    if (e.keyCode === 8 || e.keyCode % 48 === 0) {
                        game[y * 9 + x].nb = 0;
                        game[y * 9 + x].isLock = false;
                    }
                    else {
                        game[y * 9 + x].nb = e.keyCode % 48;
                        game[y * 9 + x].isLock = true;
                    }
                }
                else if (mode && !game[y * 9 + x].isLock) {
                    if (e.keyCode === 8) {
                        game[y * 9 + x].nb = 0;
                    }
                    else {
                        game[y * 9 + x].nb = e.keyCode % 48;
                    }
                }
            }
        }

        function drawCadri() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            for (var i = 0; i <= 9; ++i) {
                if (i % 3 !== 0) {
                    ctx.fillRect(startX + i * size, startY, 1, 9 * size);
                }
                else {
                    ctx.fillRect(startX + i * size, startY, 3, 9 * size);
                }
            }
            for (i = 0; i <= 9; ++i) {
                if (i % 3 !== 0) {
                    ctx.fillRect(startX, startY + i * size, 9 * size, 1);
                }
                else
                {
                    ctx.fillRect(startX, startY + i * size, 9 * size + 3, 3);
                }
            }
            ctx.closePath();
        }

        function drawNumber() {
            ctx.beginPath();
            ctx.font="30px Arial";
            for (var i = 0; i < 81; ++i) {
                if (game[i].isSelected) {
                    ctx.fillStyle = "#FFFF00";
                    ctx.fillRect(startX + (i % 9) * size, startY + Math.trunc(i / 9) * size, size, size);
                }
                if (game[i].isError) {
                    ctx.fillStyle = "#FF0000";
                    ctx.fillRect(startX + (i % 9) * size, startY + Math.trunc(i / 9) * size, size, size);
                }
                if (game[i].nb !== 0) {
                    if (game[i].isLock === true) {
                        ctx.fillStyle = "#000000";
                    }
                    else {
                        ctx.fillStyle = "#0000FF";
                    }
                    var txt = game[i].nb.toString();
                    var widthText = ctx.measureText(txt).width;
                    ctx.fillText(game[i].nb.toString(), startX + (i % 9) * size + size / 2 - widthText / 2, startY + Math.trunc(i / 9) * size + size / 2 + 15);
                }
            }
            ctx.closePath();
        }

        function isInRow(nb, index) {
            var test = 0;

            index = Math.trunc(index / 9);
            index *= 9;
            for (var i = index; i < index + 9 && i < 81; ++i) {
                if (game[i].nb === nb) {
                    ++test;
                }
            }
            return (test);
        }

        function isInColumn(nb, index) {
            var test = 0;

            index %= 9;
            for (var i = index; i < 81; i += 9) {
                if (game[i].nb === nb) {
                    ++test;
                }
            }
            return (test);
        }

        function isInSquare(nb, index) {
            var test = 0;
            var yTmp = Math.trunc(index / 9);
            var xTmp = index % 9;

            xTmp = Math.trunc(xTmp / 3) * 3;
            yTmp = Math.trunc(yTmp / 3) * 3;
            for (var i = yTmp; i < yTmp + 3; ++i) {
                for (var j = xTmp; j < xTmp + 3; ++j) {
                    if (game[i * 9 + j].nb === nb)
                        ++test;
                }
            }
            return (test);
        }

        function calcError() {
            var test = false;
            for (var i = 0; i < 81; ++i) {
                if (game[i].nb !== 0) {
                    game[i].isError = isInRow(game[i].nb, i) > 1 || isInColumn(game[i].nb, i) > 1 || isInSquare(game[i].nb, i) > 1;
                    if (game[i].isError) {
                        test = true;
                    }
                }
                else {
                    game[i].isError = false;
                }
            }
            return (test);
        }

        function drawSolve() {
            ctx.beginPath();
            ctx.font="30px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("Solve!", canvas.width - startX + 40, startY + 2 * size - 15);
            ctx.closePath();
        }

        function drawClearSolve() {
            ctx.beginPath();
            ctx.font="26px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("Clear Solve!", canvas.width - startX + 15, startY + 5 * size - 13);
            ctx.closePath();
        }

        function drawClearAll() {
            ctx.beginPath();
            ctx.font="30px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("Clear All!", canvas.width - startX + 20, startY + 8 * size - 15);
            ctx.closePath();
        }

        function drawMenu() {
            ctx.beginPath();
            ctx.font="35px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("Menu", 45, startY + 5 * size - 13);
            ctx.closePath();
        }

        function drawSection() {
            calcError();
            drawNumber();
            drawCadri();
                drawSolve();
                drawClearSolve();
            if (!mode) {
                drawClearAll();
            }
            drawMenu();
        }

        function isNotEnd() {
            for (var i = 0; i < 81; ++i)
            if (game[i].nb === 0)
                return (true);
            return (false);
        }

        function givePossibleNumber(index) {
            var vec = [];
            for (var i = 1; i < 10; ++i) {
                if (isInRow(i, index) < 1 && isInColumn(i, index) < 1 && isInSquare(i, index) < 1) {
                    var test = true;
                    for (var j = 0; j < game[index].restrict.length; ++j) {
                        if (i === game[index].restrict[j])
                            test = false;
                    }
                    if (test)
                        vec.push(i);
                }
            }
            return (vec);
        }

        function solveSudoku() {
            var index;
            var nb = 0;
            var vec = [];

            if (calcError()) {
                alert("Fix errors first!");
                return;
            }
            clearSolve();
            index = 0;
            while (game[index].isLock) {
                ++index;
            }
            while (isNotEnd(game))
            {
                vec = givePossibleNumber(index);
                if (vec.length !== 0)
                {
                    nb = vec[Math.trunc(Math.random() * 1000) % vec.length];
                    if (isInRow(nb, game, index) < 2 && isInColumn(nb, game, index) < 2 && isInSquare(nb, game, index) < 2)
                    {
                        game[index].nb = nb;
                        ++index;
                        while (index < 81 && game[index].isLock)
                            ++index;
                    }
                }
                else
                {
                    game[index].restrict = [];
                    --index;
                    while (index !== 0 && game[index].isLock)
                        --index;
                    if (index === 0 && game[index].isLock)
                    {
                        alert("Sudoku Impossible!");
                        break;
                    }
                    game[index].restrict.push(game[index].nb);
                    game[index].nb = 0;
                }
            }

        }

        function clearSolve() {
            for (var i = 0; i < 81; ++i) {
                if (!game[i].isLock) {
                    game[i].nb = 0;
                }
            }
        }

        function clearAll() {
            for (var i = 0; i < 81; ++i) {
                game[i].nb = 0;
                game[i].isError = false;
                game[i].isSelected = false;
                game[i].isLock = false;
            }
        }

        function generateSudoku() {
            var max = 81 - (16 + Math.trunc(Math.random() * 1000) % 20);
            solveSudoku();
            for (var i = 0; i < max; ++i) {
                var index = Math.trunc(Math.random() * 1000) % 81;
                if (game[index].nb === 0) {
                    --i;
                }
                else {
                    game[index].nb = 0;
                }
            }
            for (i = 0; i < 81; ++i) {
                if (game[i].nb !== 0) {
                    game[i].isLock = true;
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (screen === 0) {
                ctx.beginPath();
                ctx.font = "20px Arial";
                ctx.fillText("Normal Sudoku", canvas.width / 4, canvas.height / 2);
                ctx.fillText("Solver Sudoku", canvas.width / 2 + 80, canvas.height / 2);
                ctx.closePath();
                if (click && xCurs > 0 && xCurs < canvas.width / 2) {
                    game = [];
                    mode = true;
                    for (var i = 0; i < 81; ++i) {
                        game.push({nb: 0, isLock: false, restrict: [], isSelected: false, isError: false});
                    }
                    generateSudoku();
                    screen = 1;
                }
                else if (click && xCurs > canvas.width / 2 && xCurs < canvas.width) {
                    game = [];
                    mode = false;
                    for (i = 0; i < 81; ++i) {
                        game.push({nb: 0, isLock: false, restrict: [], isSelected: false, isError: false});
                    }
                    screen = 1;
                }
            }
            else if (screen === 1) {
                drawSection();
                if (click && xCurs > startX && xCurs <= canvas.width - startX && yCurs > startY && yCurs <= canvas.height - startY) {
                    game[y * 9 + x].isSelected = false;
                    x = Math.trunc((xCurs - startX) / size);
                    y = Math.trunc((yCurs - startY) / size);
                    game[y * 9 + x].isSelected = true;
                }
                else if (click) {
                    game[y * 9 + x].isSelected = false;
                    if (xCurs > canvas.width - startX && xCurs < canvas.width) {
                        if (yCurs > startY && yCurs <= startY + 3 * size) {
                            solveSudoku();
                        }
                        else if (yCurs > startY + 3 * size && yCurs <= startY + 6 * size) {
                            clearSolve();
                        }
                        else if (!mode && yCurs > startY + 6 * size) {
                            clearAll();
                        }
                    }
                }
                if (click && xCurs < startX && xCurs > 0 && yCurs > startY + 3 * size && yCurs < startY + 6 * size) {
                    screen = 0;
                }
            }
            click = false;
        }
        var idInterval = setInterval(draw, 100);
        return (idInterval);
    };
    return Sudoku;
}();