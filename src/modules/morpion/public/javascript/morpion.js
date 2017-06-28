/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Morpion (iaData) {
        this.id = [];
        this.id[0] = document.getElementById('morpion--case0');
        this.id[1] = document.getElementById('morpion--case1');
        this.id[2] = document.getElementById('morpion--case2');
        this.id[3] = document.getElementById('morpion--case3');
        this.id[4] = document.getElementById('morpion--case4');
        this.id[5] = document.getElementById('morpion--case5');
        this.id[6] = document.getElementById('morpion--case6');
        this.id[7] = document.getElementById('morpion--case7');
        this.id[8] = document.getElementById('morpion--case8');
    }

    /**
     * runs at runtime
     */
    Morpion.prototype.run = function() {
        this.reset();
        this.game();
        this.changeMode();
    };

    /**
     * runs upon exit
     */
    Morpion.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    Morpion.prototype.reset = function() {
        document.getElementById('morpion--reset').onclick = function() {
            var i = 0;
            while (i < 9) {
                document.getElementById('morpion--case'.concat(i.toString())).innerHTML = '';
                ++i;
            }
            document.getElementById('morpion--result').innerHTML = '';
        }
    };

    Morpion.prototype.changeMode = function() {
        function change() {
            if (document.getElementById('morpion--mode').innerHTML === 'VS IA') {
                document.getElementById('morpion--mode').innerHTML = '1 VS 1';
            }
            else {
                document.getElementById('morpion--mode').innerHTML = 'VS IA';
            }
        }

        document.getElementById('morpion--mode').onclick = function() { change(); };
    };

    Morpion.prototype.game = function() {

        function checkLoseWin(char, max) {
            var nb = 0;
            var i;
            var j = 0;
            var index = 0;
            var id = [];
            var save;

            id[0] = document.getElementById('morpion--case0');
            id[1] = document.getElementById('morpion--case1');
            id[2] = document.getElementById('morpion--case2');
            id[3] = document.getElementById('morpion--case3');
            id[4] = document.getElementById('morpion--case4');
            id[5] = document.getElementById('morpion--case5');
            id[6] = document.getElementById('morpion--case6');
            id[7] = document.getElementById('morpion--case7');
            id[8] = document.getElementById('morpion--case8');
            for (i = 0; i < 3; ++i) {
                for (j = 0; j < 3; ++j) {
                    if (id[index].innerHTML === char) {
                        ++nb;
                    }
                    if (nb === max) {
                        if (max === 3) {
                            return (1);
                        }
                        save = i * 3 + 2;
                        while (id[save].innerHTML === char) {
                            --save;
                        }
                        if (id[save].innerHTML === '') {
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
                    if (id[index].innerHTML === char) {
                        ++nb;
                    }
                    if (nb === max) {
                        if (max === 3) {
                            return (1);
                        }
                        save = i + 3 * 2;
                        while (id[save].innerHTML === char) {
                            save -= 3;
                        }
                        if (id[save].innerHTML === '') {
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
                if (id[index].innerHTML === char) {
                    ++nb;
                }
                if (nb === max) {
                    if (max === 3) {
                        return (1);
                    }
                    save = 8;
                    while (id[save].innerHTML === char) {
                        save -= 4;
                    }
                    if (id[save].innerHTML === '') {
                        return (save);
                    }
                }
                index += 4;
            }

            nb = 0;
            index = 6;
            for (i = 0; i < 3; ++i) {
                if (id[index].innerHTML === char) {
                    ++nb;
                }
                if (nb === max) {
                    if (max === 3) {
                        return (1);
                    }
                    save = 2;
                    while (id[save].innerHTML === char) {
                        save += 2;
                    }
                    if (id[save].innerHTML === '') {
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
                if (document.getElementById('morpion--case'.concat(i.toString())).innerHTML === '' &&
                    document.getElementById('morpion--case'.concat((i - 1).toString())).innerHTML === turn) {
                    return (i);
                }
                ++i;
            }
            return (-1);
        }

        function centerStrat(turn) {
            if (document.getElementById("morpion--case4").innerHTML === '') {
                return (4);
            }
            else if (document.getElementById("morpion--case4").innerHTML === turn) {
                if (document.getElementById("morpion--case0").innerHTML === '') {
                    return (0);
                }
                else if (document.getElementById("morpion--case2").innerHTML === '') {
                    return (2);
                }
                else if (document.getElementById("morpion--case6").innerHTML === '') {
                    return (6);
                }
                else if (document.getElementById("morpion--case8").innerHTML === '') {
                    return (8);
                }
            }
            return (-1);
        }

        function draw() {
            var i = 0;
            while (i < 9) {
                if (document.getElementById('morpion--case'.concat(i.toString())).innerHTML === '') {
                    return (false);
                }
                ++i;
            }
            return (true);
        }

        function boardIsEmpty() {
            var i = 0;
            while (i < 9) {
                if (document.getElementById('morpion--case'.concat(i.toString())).innerHTML !== '') {
                    return (false);
                }
                ++i;
            }
            return (true);
        }

        function ia(str) {
            var save = 0;
            if (typeof ia.turn === 'undefined' || boardIsEmpty() === true) {
                ia.turn = 'o';
                ia.antiturn = 'x';
            }
            if (document.getElementById(str).innerHTML === '') {
                document.getElementById(str).innerHTML = ia.turn;
                if (checkLoseWin('x', 3) === 1) {
                    document.getElementById('morpion--result').innerHTML = "Winner : X";
                    return;
                }
                else if (checkLoseWin('o', 3) === 1) {
                    document.getElementById('morpion--result').innerHTML = "Winner : O";
                    return;
                }
                else if (draw() === true) {
                    document.getElementById('morpion--result').innerHTML = "DRAW";
                    return;
                }
                if (document.getElementById('morpion--mode').innerHTML === 'VS IA') {
                    if ((save = checkLoseWin(ia.antiturn, 2)) !== -1) {
                        document.getElementById("morpion--case".concat(save.toString())).innerHTML = ia.antiturn;
                    }
                    else if ((save = checkLoseWin(ia.turn, 2)) !== -1) {
                        document.getElementById("morpion--case".concat(save.toString())).innerHTML = ia.antiturn;
                    }
                    else if ((save = centerStrat(ia.turn)) !== -1) {
                        document.getElementById("morpion--case".concat(save.toString())).innerHTML = ia.antiturn;
                    }
                    else if ((save = findCaseToCounter(ia.turn)) !== -1) {
                        document.getElementById("morpion--case".concat(save.toString())).innerHTML = ia.antiturn;
                    }
                    else {
                        var i = 0;
                        while (i < 9) {
                            if (document.getElementById('morpion--case'.concat(i.toString())).innerHTML === '') {
                                document.getElementById('morpion--case'.concat(i.toString())).innerHTML = ia.antiturn;
                                break;
                            }
                            ++i;
                        }
                    }
                }
                else {
                    if (ia.turn === 'o') {
                        ia.turn = 'x';
                        ia.antiturn = 'o';
                    }
                    else {
                        ia.turn = 'o';
                        ia.antiturn = 'x';
                    }
                }
                if (checkLoseWin('x', 3) === 1) {
                    document.getElementById('morpion--result').innerHTML = "Winner : X";
                }
                else if (checkLoseWin('o', 3) === 1) {
                    document.getElementById('morpion--result').innerHTML = "Winner : O";
                }
                else if (draw() === true) {
                    document.getElementById('morpion--result').innerHTML = "DRAW";
                }
            }
        }

        this.id[0].onclick = function() { ia('morpion--case0'); };
        this.id[1].onclick = function() { ia('morpion--case1'); };
        this.id[2].onclick = function() { ia('morpion--case2'); };
        this.id[3].onclick = function() { ia('morpion--case3'); };
        this.id[4].onclick = function() { ia('morpion--case4'); };
        this.id[5].onclick = function() { ia('morpion--case5'); };
        this.id[6].onclick = function() { ia('morpion--case6'); };
        this.id[7].onclick = function() { ia('morpion--case7'); };
        this.id[8].onclick = function() { ia('morpion--case8'); };
    };

    return Morpion;
}();