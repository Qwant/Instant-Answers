/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Tetris (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Tetris.prototype.run = function() {
        this.game();
    };

    /**
     * runs upon exit
     */
    Tetris.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    Tetris.prototype.game = function () {
        var canvas = document.getElementById("myCanvas");
        var blocks = [];
        var ctx = canvas.getContext("2d");
        var x = 230;
        var y = 0;
        var dy = +10;
        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var block = createBlock();

        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        function createBlock() {
            var number = Math.trunc(Math.random() * 1000) % 7;
            var block = {};

            switch (number) {
                case 0:
                {
                    block = {
                        id: 0,
                        x : [0, 0, 0, -1],
                        y : [0, -1, 1, 1]
                    };
                    return (block);
                }
                case 1:
                {
                    block = {
                        id: 1,
                        x : [0, 0, 0, 1],
                        y : [0, -1, 1, 1]
                    };
                    return (block);
                }
                case 2:
                {
                    block = {
                        id: 2,
                        x : [0, 0, -1, -1],
                        y : [0, -1, -1, 0]
                    };
                    return (block);
                }
                case 3:
                {
                    block = {
                        id: 3,
                        x : [0, -1, 1, 0],
                        y : [0, 0, 0, -1]
                    };
                    return (block);
                }
                case 4:
                {
                    block = {
                        id: 4,
                        x : [0, 0, 0, 0],
                        y : [0, -1, 1, 2]
                    };
                    return (block);
                }
                case 5:
                {
                    block = {
                        id: 5,
                        x : [0, -1, -1, 0],
                        y : [0, 0, 1, -1]
                    };
                    return (block);
                }
                default:
                {
                    block = {
                        id: 6,
                        x : [0, 0, 1, 1],
                        y : [0, -1, 0, 1]
                    };
                    return (block);
                }
            }
        }

        function isCollideRow(tmpX) {
            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (var k = 0; k < 4; ++k) {
                        if (blocks[i].x[j] === block.x[k] * 10 + tmpX &&
                            blocks[i].y[j] === block.y[k] * 10 + y) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function keyDownHandler(e) {
            if(e.keyCode == 39) {
                rightPressed = true;
                if (!isCollideRow(x + 10)) {
                    x += 10;
                }
            }
            if(e.keyCode == 37) {
                leftPressed = true;
                if (!isCollideRow(x - 10)) {
                    x -= 10;
                }
            }
            if(e.keyCode == 38 && block.id !== 2) {
                if (block.id === 4 && block.x[1] === 1) {
                    block = {
                        id: 4,
                        x : [0, 0, 0, 0],
                        y : [0, -1, 1, 2]
                    };
                }
                else {
                    var saveX;
                    var saveY;
                    for (var i = 0; i < 4; ++i) {
                        saveX      = block.x[i];
                        saveY      = block.y[i];
                        block.x[i] = saveY * -1;
                        block.y[i] = saveX * 1;
                    }
                    upPressed = true;
                }
            }
        }

        function keyUpHandler(e) {
            if(e.keyCode == 39) {
                rightPressed = false;
            }
            if(e.keyCode == 37) {
                leftPressed = false;
            }
            if(e.keyCode == 38) {
                upPressed = false;
            }
        }

        function isCollide() {

            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (var k = 0; k < 4; ++k) {
                        if (block.x[k] * 10 + x === blocks[i].x[j] &&
                            block.y[k] * 10 + y + 10 === blocks[i].y[j]) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function drawBall() {
            ctx.beginPath();
            for (var i = 0; i < 4; ++i) {
                ctx.rect(block.x[i] * 10 + x, block.y[i] * 10 + y, 10, 10);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
            }
            for (i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    ctx.rect(blocks[i].x[j], blocks[i].y[j], 10, 10);
                    ctx.fillStyle = "#0095DD";
                    ctx.fill();
                }
            }
            ctx.closePath();
        }

        function move() {
            var maxY = 0;
            for (var i = 0; i < 4; ++i) {
                if (maxY < block.y[i]) {
                    maxY = block.y[i];
                }
            }
            if (y === 0 && isCollide()) {
                alert("game over");
            }
            else if (y + dy + maxY * 10 >= canvas.height || isCollide()) {
                for (i = 0; i < 4; ++i) {
                    block.x[i] = block.x[i] * 10 + x;
                    block.y[i] = block.y[i] * 10 + y;
                }
                blocks.push(block);
                block = createBlock();
                y = 0;
                x = 230;
            }
            else {
                y += dy;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBall();
        }
        setInterval(draw, 10);
        setInterval(move, 300);
    };
    return Tetris;
}();