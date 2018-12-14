var IARuntime = function() {
    function game (iaData) {
        var it = this;

        document.getElementById('continue-button').addEventListener('click', function() {
            var win = document.getElementById('win');
            win.style.opacity = 0;

            setTimeout(function() {
                win.style.display = "none";
            }, 500);

            it.win = false;
            it.continue = true;
        });

        document.getElementById('reset-button').addEventListener('click', function() {
            it.matrix.forEach(function(a) {
                a.forEach(function (b) {
                    if (b !== 0) {
                        var tile = document.getElementById(b);

                        tile.parentNode.removeChild(tile);
                    }
                });
            });

            if (it.gameover) {
                var lost = document.getElementById('lost');
                lost.style.opacity = 0;

                setTimeout(function() {
                    lost.style.display = "none";
                }, 500);
            }

            if (it.win) {
                var win = document.getElementById('win');
                win.style.opacity = 0;

                setTimeout(function() {
                    win.style.display = "none";
                }, 500);
            }

            it.matrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
            it.id = 0;
            it.numberOfTiles = 0;
            it.win = false;
            it.gameover = false;
            it.continue = false;
            it.score = 0;
            it.updateScore(0);

            it.createNewTile();
        });

        window.addEventListener('keydown', function(e) {
            if (!it.continue && (it.gameover || it.win)) {
                return false;
            }

            // up arrow
            if (e.keyCode === 38) {
                e.preventDefault();
                it.move('up');
            // left arrow
            } else if (e.keyCode === 37) {
                e.preventDefault();
                it.move('left');
            // down arrow
            } else if (e.keyCode === 40) {
                e.preventDefault();
                it.move('down');
            // right arrow
            } else if (e.keyCode === 39) {
                e.preventDefault();
                it.move('right');
            }

            return false;
        })
    }

    game.prototype.move = function(direction) {
        var left = direction === 'left';
        var right = direction === 'right';
        var up = direction === 'up';
        var down = direction === 'down';
        var i = down ? 3 : 0;
        var j = right ? 3 : 0;
        var clear = false;
        var it = this;
        var blockingMerge = false;
        var hasMoved = false;

        while (!clear) {
            if ((left && j === 3 && i === 3)
                || (right && j === 0 && i === 3)
                || (down && j === 3 && i === 0)
                || (up && j === 3 && i === 3)
            ) {
                clear = true;
            }

            if (i < 0 || i > 3 || j < 0 || j > 3 || it.matrix[i][j] === 0) {
                if (left || right) {
                    if ((left && j >= 3) || (right && j <= 0)) {
                        i++;
                        j = left ? 0 : 3;
                        blockingMerge = false;
                    } else {
                        left ? j++ : j--;
                    }
                } else {
                    if ((up && i >= 3) || (down && i <= 0)) {
                        j++;
                        i = up ? 0 : 3;
                        blockingMerge = false;
                    } else {
                        up ? i++ : i--;
                    }
                }
            } else {
                var moving = true;
                var previousI = i;
                var previousJ = j;
                var id = it.matrix[i][j];
                var tile = document.getElementById(id);
                var tileValue = parseInt(tile.innerHTML);

                while(moving) {
                    if (left) {
                        moving ? j-- : j++;
                    } else if (right) {
                        moving ? j++ : j--;
                    } else if (down) {
                        moving ? i++ : i--;
                    } else if (up) {
                        moving ? i-- : i++;
                    }

                    if (i < 0 || i > 3 || j < 0 || j > 3) {
                        if (i < 0) {
                            i = 0;
                        } else if (i > 3) {
                            i = 3;
                        } else if (j < 0) {
                            j = 0;
                        } else if (j > 3) {
                            j = 3;
                        }

                        if (previousI !== i || previousJ !== j) {
                            it.moveTo(tile, i, j);
                            it.matrix[previousI][previousJ] = 0;
                            it.matrix[i][j] = id;
                            hasMoved = true;
                        }

                        moving = false;
                    } else if (it.matrix[i][j] !== 0) {
                        moving = false;

                        var blockingID = it.matrix[i][j];
                        var blockingTile = document.getElementById(blockingID);
                        var blockingTileValue = parseInt(blockingTile.innerHTML);

                        if (blockingTileValue === tileValue && !blockingMerge) {
                            it.matrix[previousI][previousJ] = 0;
                            it.mergeTiles(blockingTileValue, blockingTile, tile, i, j);
                            blockingMerge = true;
                            hasMoved = true;
                        } else {
                            if (left) {
                                j++;
                            } else if (right) {
                                j--;
                            } else if (down) {
                                i--;
                            } else if (up) {
                                i++;
                            }

                            if (previousI !== i || previousJ !== j) {
                                it.moveTo(tile, i, j);
                                it.matrix[previousI][previousJ] = 0;
                                it.matrix[i][j] = id;
                                hasMoved = true;
                            }

                            blockingMerge = false;
                        }
                    }

                    if (!moving) {
                        if (left) {
                            j++;
                        } else if (right) {
                            j--;
                        } else if (down) {
                            i--;
                        } else if (up) {
                            i++;
                        }
                    }
                }
            }
        }

        this.checkEndConditions();

        if (hasMoved) {
            this.createNewTile();
        }
    };

    game.prototype.checkEndConditions = function() {
        this.gameover = true;

        var it = this;

        this.matrix.forEach(function(a, i){
            a.forEach(function(b, j){
                if (it.matrix[i][j] === 0) {
                    it.gameover = false;
                } else {
                    var currentTileID = it.matrix[i][j];
                    var currentTile = document.getElementById(currentTileID);
                    var currentTileValue = parseInt(currentTile.innerHTML);
                }

                if (i + 1 <= 3) {
                    if (it.matrix[i + 1][j] === 0) {
                        it.gameover = false;
                    } else {
                        var bottomTileID = it.matrix[i + 1][j];
                        var bottomTile = document.getElementById(bottomTileID);
                        var bottomTileValue = parseInt(bottomTile.innerHTML);
                    }
                }

                if (j + 1 <= 3) {
                    if (it.matrix[i][j + 1] === 0) {
                        it.gameover = false;
                    } else {
                        var rightTileID    = it.matrix[i][j + 1];
                        var rightTile      = document.getElementById(rightTileID);
                        var rightTileValue = parseInt(rightTile.innerHTML);
                    }
                }

                if (currentTileValue) {
                    if ((bottomTileValue && bottomTileValue === currentTileValue) || (rightTileValue && rightTileValue === currentTileValue)) {
                        it.gameover = false;
                    }

                    if (currentTileValue >= 2048) {
                        it.win = true;
                    }
                }
            });
        });

        if (this.gameover) {
            var lost = document.getElementById('lost');
            lost.style.display = "block";

            setTimeout(function() {
                lost.style.opacity = 1;
            }, 500);
        }

        if (this.win && !it.continue) {
            var win = document.getElementById('win');
            win.style.display = "block";

            setTimeout(function() {
                win.style.opacity = 1;
            }, 500);
        }
    };

    game.prototype.mergeTiles = function(value, mergedTile, toDelete, mergedTileIPos, mergedTileJPos) {
        var newValue = value + value;
        mergedTile.innerHTML = newValue;
        mergedTile.className = 'tile newTile number-' + newValue;
        this.moveTo(toDelete, mergedTileIPos, mergedTileJPos);

        toDelete.style.opacity = 0;

        this.numberOfTiles --;

        this.updateScore(newValue);

        setTimeout(function(){
            toDelete.parentNode.removeChild(toDelete);
        }, 150);
    };

    game.prototype.updateScore = function(value) {
        var score = document.getElementById('score');

        this.score += value;

        score.className = 'board-score board-score--updating';
        score.innerHTML = this.score;

        setTimeout(function(){
            score.className = 'board-score';
        }, 150);
    };

    game.prototype.createNewTile = function() {
        var random = this.random(this.max - this.numberOfTiles);
        var it = this;
        var counter = 0;
        var created = false;
        var initValue = it.randomInitValue();

        this.matrix.forEach(function(a, i){
            a.forEach(function(b, j){
                if (b === 0) {
                    counter ++;
                }

                if (counter === random && !created) {
                    it.id ++;
                    it.numberOfTiles ++;
                    it.matrix[i][j] = it.id;
                    var board = $('.board-game')[0];
                    var div = document.createElement('div');
                    div.id = it.id;
                    div.className = 'tile newTile number-' + initValue;
                    div.innerHTML = initValue;
                    board.appendChild(div);
                    it.moveTo(div, i, j);

                    setTimeout(function(){
                        div.style.opacity = 1;
                    }, 50);

                    created = true;
                }
            })
        });
    };

    game.prototype.moveTo = function(div, i, j) {
        var length = window.innerWidth > 640 ? 75 : 50;
        div.style.top = i * (length + 10) + 'px';
        div.style.left = j * (length + 10) + 'px';
    };

    game.prototype.randomInitValue = function() {
        // 20% chance of getting a 4 instead of a 2
        return Math.floor(Math.random() * 100) < 20 ? 4 : 2;
    };

    game.prototype.random = function(max) {
        return Math.floor(Math.random() * max) + 1;
    };

    /**
     * runs at runtime
     */
    game.prototype.run = function() {
        this.matrix = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
        this.max = 16;
        this.id = 0;
        this.numberOfTiles = 0;
        this.win = false;
        this.gameover = false;
        this.continue = false;
        this.score = 0;

        this.createNewTile();

        //this.testDoubleMerge();
        //this.oneMoveWin();
        //this.allColor();
    };

    game.prototype.allColor = function() {
        this.matrix[0][0] = 1;
        this.matrix[0][1] = 2;
        this.matrix[0][2] = 3;
        this.matrix[0][3] = 4;
        this.matrix[1][0] = 5;
        this.matrix[1][1] = 6;
        this.matrix[1][2] = 7;
        this.matrix[1][3] = 8;
        this.matrix[2][0] = 9;
        this.matrix[2][1] = 10;
        this.matrix[2][2] = 11;
        this.matrix[2][3] = 12;

        this.id = 12;

        var board = $('.board-game')[0];

        var div = document.createElement('div');
        div.id = 1;
        div.className = 'tile newTile number-' + 2;
        div.innerHTML = 2;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 0);

        div = document.createElement('div');
        div.id = 2;
        div.className = 'tile newTile number-' + 4;
        div.innerHTML = 4;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 1);

        div = document.createElement('div');
        div.id = 3;
        div.className = 'tile newTile number-' + 8;
        div.innerHTML = 8;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 2);

        div = document.createElement('div');
        div.id = 4;
        div.className = 'tile newTile number-' + 16;
        div.innerHTML = 16;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 3);

        div = document.createElement('div');
        div.id = 5;
        div.className = 'tile newTile number-' + 32;
        div.innerHTML = 32;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 1, 0);

        div = document.createElement('div');
        div.id = 6;
        div.className = 'tile newTile number-' + 64;
        div.innerHTML = 64;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 1, 1);

        div = document.createElement('div');
        div.id = 7;
        div.className = 'tile newTile number-' + 128;
        div.innerHTML = 128;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 1, 2);

        div = document.createElement('div');
        div.id = 8;
        div.className = 'tile newTile number-' + 256;
        div.innerHTML = 256;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 1, 3);

        div = document.createElement('div');
        div.id = 9;
        div.className = 'tile newTile number-' + 512;
        div.innerHTML = 512;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 2, 0);

        div = document.createElement('div');
        div.id = 10;
        div.className = 'tile newTile number-' + 1024;
        div.innerHTML = 1024;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 2, 1);

        div = document.createElement('div');
        div.id = 11;
        div.className = 'tile newTile number-' + 2048;
        div.innerHTML = 2048;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 2, 2);

        div = document.createElement('div');
        div.id = 12;
        div.className = 'tile newTile number-' + 4096;
        div.innerHTML = 4096;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 2, 3);
    };

    game.prototype.oneMoveWin = function() {
        this.matrix[0][0] = 1;
        this.matrix[0][1] = 2;

        this.id = 2;

        var board = $('.board-game')[0];

        var div = document.createElement('div');
        div.id = 1;
        div.className = 'tile newTile number-' + 1024;
        div.innerHTML = 1024;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 0);

        div = document.createElement('div');
        div.id = 2;
        div.className = 'tile newTile number-' + 1024;
        div.innerHTML = 1024;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 1);
    };

    game.prototype.testDoubleMerge = function() {
        this.matrix[0][0] = 1;
        this.matrix[0][1] = 2;
        this.matrix[0][2] = 3;
        this.matrix[0][3] = 4;

        this.id = 4;

        var board = $('.board-game')[0];

        var div = document.createElement('div');
        div.id = 1;
        div.className = 'tile newTile number-' + 8;
        div.innerHTML = 8;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 0);

        div = document.createElement('div');
        div.id = 2;
        div.className = 'tile newTile number-' + 4;
        div.innerHTML = 4;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 1);

        div = document.createElement('div');
        div.id = 3;
        div.className = 'tile newTile number-' + 2;
        div.innerHTML = 2;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 2);

        div = document.createElement('div');
        div.id = 4;
        div.className = 'tile newTile number-' + 2;
        div.innerHTML = 2;
        board.appendChild(div);
        div.style.opacity = 1;
        this.moveTo(div, 0, 3);
    };

    /**
     * runs upon exit
     */
    game.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return game;
}();