var IARuntime = function() {
    function game (iaData) {
        var it = this;

        window.addEventListener('keydown', function(e) {
            if (e.keyCode === 87 || e.keyCode === 38) { // w or up arrow
                e.preventDefault();
                it.move('up');
            } else if (e.keyCode === 65 || e.keyCode === 37) { // a or left arrow
                e.preventDefault();
                it.move('left');
            } else if (e.keyCode === 83 || e.keyCode === 40) { // s or down arrow
                e.preventDefault();
                it.move('down');
            } else if (e.keyCode === 68 || e.keyCode === 39) { // d or right arrow
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
                    } else {
                        left ? j++ : j--;
                    }
                } else {
                    if ((up && i >= 3) || (down && i <= 0)) {
                        j++;
                        i = up ? 0 : 3;
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

                        it.moveTo(tile, i, j);
                        it.matrix[previousI][previousJ] = 0;
                        it.matrix[i][j] = id;
                        moving = false;
                    } else if (it.matrix[i][j] !== 0) {
                        moving = false;

                        var blockingID = it.matrix[i][j];
                        var blockingTile = document.getElementById(blockingID);
                        var blockingTileValue = parseInt(blockingTile.innerHTML);

                        if (blockingTileValue === tileValue) {
                            it.matrix[previousI][previousJ] = 0;
                            it.mergeTiles(blockingTileValue, blockingTile, tile, i, j);
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

                            it.moveTo(tile, i, j);
                            it.matrix[previousI][previousJ] = 0;
                            it.matrix[i][j] = id;
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

        this.createNewTile();
    };

    game.prototype.mergeTiles = function(value, mergedTile, toDelete, mergedTileIPos, mergedTileJPos) {
        var newValue = value + value;
        mergedTile.innerHTML = newValue;
        mergedTile.className = 'tile newTile number-' + newValue;
        this.moveTo(toDelete, mergedTileIPos, mergedTileJPos);

        toDelete.style.opacity = 0;

        this.numberOfTiles --;

        setTimeout(function(){
            toDelete.parentNode.removeChild(toDelete);
        }, 150);
    };

    game.prototype.createNewTile = function() {
        var random = this.random(this.max - this.numberOfTiles);
        var it = this;
        var counter = 0;
        var created = false;

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
                    div.className = 'tile newTile number-' + it.initValue;
                    div.innerHTML = it.initValue;
                    board.appendChild(div);
                    it.moveTo(div, i, j);

                    created = true;
                }
            })
        });
    };

    game.prototype.moveTo = function(div, i, j) {
        div.style.top = i * (75 + 10) + 'px';
        div.style.left = j * (75 + 10) + 'px';
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
        this.initValue = 2;
        this.id = 0;
        this.numberOfTiles = 0;

        this.createNewTile();
    };

    /**
     * runs upon exit
     */
    game.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return game;
}();