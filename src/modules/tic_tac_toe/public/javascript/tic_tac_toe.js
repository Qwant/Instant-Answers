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
        //this.reset();
        this.game();
        //this.changeMode();
    };

    /**
     * runs upon exit
     */
    Tic_tac_toe.prototype.stop = function() {

    };

    // Tic_tac_toe.prototype.reset = function() {
    //     document.getElementById('tictactoe--reset').onclick = function() {
    //         var i = 0;
    //         while (i < 9) {
    //             document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML = '';
    //             ++i;
    //         }
    //         document.getElementById('tictactoe--result').innerHTML = '';
    //     }
    // };
    //
    // Tic_tac_toe.prototype.changeMode = function() {
    //     function change() {
    //         if (document.getElementById('tictactoe--mode').innerHTML === 'VS IA') {
    //             document.getElementById('tictactoe--mode').innerHTML = '1 VS 1';
    //         }
    //         else {
    //             document.getElementById('tictactoe--mode').innerHTML = 'VS IA';
    //         }
    //     }
    //
    //     document.getElementById('tictactoe--mode').onclick = function() { change(); };
    // };

    Tic_tac_toe.prototype.game = function() {
        var canvas = document.getElementById("tictactoeCanvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;
        var game = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        var screen = 0;
        var xCurs = 0;
        var yCurs = 0;
        var click = false;
        var ia = true;

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX - 123;
            yCurs = e.pageY - 144;
        });
        window.addEventListener('click', function () {
            click = true;
        });

        // function checkLoseWin(char, max) {
        //     var nb = 0;
        //     var i;
        //     var j = 0;
        //     var index = 0;
        //     var id = [];
        //     var save;
        //
        //     id[0] = document.getElementById('tictactoe--case0');
        //     id[1] = document.getElementById('tictactoe--case1');
        //     id[2] = document.getElementById('tictactoe--case2');
        //     id[3] = document.getElementById('tictactoe--case3');
        //     id[4] = document.getElementById('tictactoe--case4');
        //     id[5] = document.getElementById('tictactoe--case5');
        //     id[6] = document.getElementById('tictactoe--case6');
        //     id[7] = document.getElementById('tictactoe--case7');
        //     id[8] = document.getElementById('tictactoe--case8');
        //     for (i = 0; i < 3; ++i) {
        //         for (j = 0; j < 3; ++j) {
        //             if (id[index].innerHTML === char) {
        //                 ++nb;
        //             }
        //             if (nb === max) {
        //                 if (max === 3) {
        //                     return (1);
        //                 }
        //                 save = i * 3 + 2;
        //                 while (id[save].innerHTML === char) {
        //                     --save;
        //                 }
        //                 if (id[save].innerHTML === '') {
        //                     return (save);
        //                 }
        //             }
        //             ++index;
        //         }
        //         nb = 0;
        //     }
        //
        //     index = 0;
        //     for (i = 0; i < 3; ++i) {
        //         for (j = 0; j < 3; ++j) {
        //             if (id[index].innerHTML === char) {
        //                 ++nb;
        //             }
        //             if (nb === max) {
        //                 if (max === 3) {
        //                     return (1);
        //                 }
        //                 save = i + 3 * 2;
        //                 while (id[save].innerHTML === char) {
        //                     save -= 3;
        //                 }
        //                 if (id[save].innerHTML === '') {
        //                     return (save);
        //                 }
        //             }
        //             index = (index + 3) % 9;
        //         }
        //         ++index;
        //         nb = 0;
        //     }
        //
        //     index = 0;
        //     for (i = 0; i < 3; ++i) {
        //         if (id[index].innerHTML === char) {
        //             ++nb;
        //         }
        //         if (nb === max) {
        //             if (max === 3) {
        //                 return (1);
        //             }
        //             save = 8;
        //             while (id[save].innerHTML === char) {
        //                 save -= 4;
        //             }
        //             if (id[save].innerHTML === '') {
        //                 return (save);
        //             }
        //         }
        //         index += 4;
        //     }
        //
        //     nb = 0;
        //     index = 6;
        //     for (i = 0; i < 3; ++i) {
        //         if (id[index].innerHTML === char) {
        //             ++nb;
        //         }
        //         if (nb === max) {
        //             if (max === 3) {
        //                 return (1);
        //             }
        //             save = 2;
        //             while (id[save].innerHTML === char) {
        //                 save += 2;
        //             }
        //             if (id[save].innerHTML === '') {
        //                 return (save);
        //             }
        //         }
        //         index -= 2;
        //     }
        //
        //     return (-1);
        // }
        //
        // function findCaseToCounter(turn) {
        //     var i = 1;
        //     while (i < 9) {
        //         if (document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML === '' &&
        //             document.getElementById('tictactoe--case'.concat((i - 1).toString())).innerHTML === turn) {
        //             return (i);
        //         }
        //         ++i;
        //     }
        //     return (-1);
        // }
        //
        // function centerStrat(turn) {
        //     if (document.getElementById("tictactoe--case4").innerHTML === '') {
        //         return (4);
        //     }
        //     else if (document.getElementById("tictactoe--case4").innerHTML === turn) {
        //         if (document.getElementById("tictactoe--case0").innerHTML === '') {
        //             return (0);
        //         }
        //         else if (document.getElementById("tictactoe--case2").innerHTML === '') {
        //             return (2);
        //         }
        //         else if (document.getElementById("tictactoe--case6").innerHTML === '') {
        //             return (6);
        //         }
        //         else if (document.getElementById("tictactoe--case8").innerHTML === '') {
        //             return (8);
        //         }
        //     }
        //     return (-1);
        // }
        //
        // function draw() {
        //     var i = 0;
        //     while (i < 9) {
        //         if (document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML === '') {
        //             return (false);
        //         }
        //         ++i;
        //     }
        //     return (true);
        // }
        //
        // function boardIsEmpty() {
        //     var i = 0;
        //     while (i < 9) {
        //         if (document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML !== '') {
        //             return (false);
        //         }
        //         ++i;
        //     }
        //     return (true);
        // }
        //
        // function ia(str) {
        //     var save = 0;
        //     if (typeof ia.turn === 'undefined' || boardIsEmpty() === true) {
        //         ia.turn = 'o';
        //         ia.antiturn = 'x';
        //     }
        //     if (document.getElementById(str).innerHTML === '') {
        //         document.getElementById(str).innerHTML = ia.turn;
        //         if (checkLoseWin('x', 3) === 1) {
        //             document.getElementById('tictactoe--result').innerHTML = "Winner : X";
        //             return;
        //         }
        //         else if (checkLoseWin('o', 3) === 1) {
        //             document.getElementById('tictactoe--result').innerHTML = "Winner : O";
        //             return;
        //         }
        //         else if (draw() === true) {
        //             document.getElementById('tictactoe--result').innerHTML = "DRAW";
        //             return;
        //         }
        //         if (document.getElementById('tictactoe--mode').innerHTML === 'VS IA') {
        //             if ((save = checkLoseWin(ia.antiturn, 2)) !== -1) {
        //                 document.getElementById("tictactoe--case".concat(save.toString())).innerHTML = ia.antiturn;
        //             }
        //             else if ((save = checkLoseWin(ia.turn, 2)) !== -1) {
        //                 document.getElementById("tictactoe--case".concat(save.toString())).innerHTML = ia.antiturn;
        //             }
        //             else if ((save = centerStrat(ia.turn)) !== -1) {
        //                 document.getElementById("tictactoe--case".concat(save.toString())).innerHTML = ia.antiturn;
        //             }
        //             else if ((save = findCaseToCounter(ia.turn)) !== -1) {
        //                 document.getElementById("tictactoe--case".concat(save.toString())).innerHTML = ia.antiturn;
        //             }
        //             else {
        //                 var i = 0;
        //                 while (i < 9) {
        //                     if (document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML === '') {
        //                         document.getElementById('tictactoe--case'.concat(i.toString())).innerHTML = ia.antiturn;
        //                         break;
        //                     }
        //                     ++i;
        //                 }
        //             }
        //         }
        //         else {
        //             if (ia.turn === 'o') {
        //                 ia.turn = 'x';
        //                 ia.antiturn = 'o';
        //             }
        //             else {
        //                 ia.turn = 'o';
        //                 ia.antiturn = 'x';
        //             }
        //         }
        //         if (checkLoseWin('x', 3) === 1) {
        //             document.getElementById('tictactoe--result').innerHTML = "Winner : X";
        //         }
        //         else if (checkLoseWin('o', 3) === 1) {
        //             document.getElementById('tictactoe--result').innerHTML = "Winner : O";
        //         }
        //         else if (draw() === true) {
        //             document.getElementById('tictactoe--result').innerHTML = "DRAW";
        //         }
        //     }
        // }
        //
        // this.id[0].onclick = function() { ia('tictactoe--case0'); };
        // this.id[1].onclick = function() { ia('tictactoe--case1'); };
        // this.id[2].onclick = function() { ia('tictactoe--case2'); };
        // this.id[3].onclick = function() { ia('tictactoe--case3'); };
        // this.id[4].onclick = function() { ia('tictactoe--case4'); };
        // this.id[5].onclick = function() { ia('tictactoe--case5'); };
        // this.id[6].onclick = function() { ia('tictactoe--case6'); };
        // this.id[7].onclick = function() { ia('tictactoe--case7'); };
        // this.id[8].onclick = function() { ia('tictactoe--case8'); };
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
                    ctx.fillText("O", (i % 3) * (canvas.height / 3) + (canvas.height / 6) - textWidth / 2, Math.trunc(i / 3) * (canvas.height / 3) + (canvas.height / 6) + textWidth / 2);
                }
                ctx.closePath();
            }
        }

        function drawMode() {
            ctx.beginPath();
            ctx.font = "100px Arial";
            if (ia) {
                var textWidth = ctx.measureText("IA").width;

                ctx.fillStyle = "#000000";
                ctx.fillText("IA", 700 - textWidth / 2, 100 + textWidth / 2);
            }
            else {
                textWidth = ctx.measureText("1V1").width;

                ctx.fillStyle = "#000000";
                ctx.fillText("1V1", 700 - textWidth / 2, 100 + textWidth / 2);
            }
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
                // drawReset();
                // drawResult();
            }
        }
        setInterval(draw, 10);
    };

    return Tic_tac_toe;
}();