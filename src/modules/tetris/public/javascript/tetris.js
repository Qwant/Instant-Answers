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
        var x = 40;
        var y = 0;
        var dy = 10;
        var canHold = true;
        var block = createBlock();
        var hold = "";
        var next = createBlock();
        var score = 0;
        var start = false;

        document.addEventListener("keydown", keyDownHandler, false);

        function createBlock() {
            var number = Math.trunc(Math.random() * 1000) % 7;
            var block = {};

            switch (number) {
                case 0:
                {
                    block = {
                        id : 0,
                        color : "#007ba7",
                        x : [0, 0, 0, -1],
                        y : [0, -1, 1, 1]
                    };
                    return (block);
                }
                case 1:
                {
                    block = {
                        id : 1,
                        color : "#ff8847",
                        x : [0, 0, 0, 1],
                        y : [0, -1, 1, 1]
                    };
                    return (block);
                }
                case 2:
                {
                    block = {
                        id : 2,
                        color : "#ecc831",
                        x : [0, 0, -1, -1],
                        y : [0, -1, -1, 0]
                    };
                    return (block);
                }
                case 3:
                {
                    block = {
                        id : 3,
                        color : "#bbc6ce",
                        x : [0, -1, 1, 0],
                        y : [0, 0, 0, -1]
                    };
                    return (block);
                }
                case 4:
                {
                    block = {
                        id : 4,
                        color : "#e33232",
                        x : [0, 0, 0, 0],
                        y : [0, -1, 1, 2]
                    };
                    return (block);
                }
                case 5:
                {
                    block = {
                        id : 5,
                        color : "#1c945a",
                        x : [0, -1, -1, 0],
                        y : [0, 0, 1, -1]
                    };
                    return (block);
                }
                default:
                {
                    block = {
                        id : 6,
                        color : "#660066",
                        x : [0, 0, 1, 1],
                        y : [0, -1, 0, 1]
                    };
                    return (block);
                }
            }
        }

        function isCollideRow(tmpX) {
            for (var i = 0; i < 4; ++i) {
                if (block.x[i] * 10 + tmpX < 0 || block.x[i] * 10 + tmpX >= 100) {
                    return (true);
                }
            }
            for (i = 0; i < blocks.length; ++i) {
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
            if (!start) {
                return;
            }
            if(e.keyCode === 39) {
                e.preventDefault();
                if (!isCollideRow(x + 10)) {
                    x += 10;
                }
            }
            if(e.keyCode === 37) {
                e.preventDefault();
                if (!isCollideRow(x - 10)) {
                    x -= 10;
                }
            }
            if(e.keyCode === 38 && block.id !== 2) {
                e.preventDefault();
                var saveBlock = {
                    id : block.id,
                    color : block.color,
                    x : block.x.slice(),
                    y : block.y.slice()
                };
                if (block.id === 4 && block.x[1] === 1) {
                    block = {
                        id : 4,
                        color : "#e33232",
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
                }
                if (isAnyCollide()) {
                    saveX = x;
                    saveY = y;
                    x = saveX + 10;
                    if (isAnyCollide()) {
                        x = saveX + 20;
                    }
                    if (isAnyCollide()) {
                        x = saveX - 10;
                    }
                    if (isAnyCollide()) {
                        x = saveX - 20;
                    }
                    if (isAnyCollide()) {
                        x = saveX;
                        y = saveY - dy;
                    }
                    if (isAnyCollide()) {
                        y = saveY - 2 * dy;
                    }
                    if (isAnyCollide()) {
                        y = saveY - 3 * dy;
                    }
                    if (isAnyCollide()) {
                        y = saveY - 4 * dy;
                    }
                    if (isAnyCollide()) {
                        y = saveY;
                        block = saveBlock;
                    }
                }
            }
            if (e.keyCode === 67 && canHold) {
                e.preventDefault();
                if (hold.length === 0) {
                    hold = block;
                    block = createBlock();
                }
                else {
                    var save = block;
                    block = hold;
                    hold = save;
                }
                x = 40;
                y = 0;
                canHold = false;
            }
            if (e.keyCode === 32) {
                e.preventDefault();
                var maxY = 0;
                for (i = 0; i < 4; ++i) {
                    if (maxY < block.y[i]) {
                        maxY = block.y[i];
                    }
                }
                while (!(y + dy + maxY * 10 >= canvas.height || isCollide())) {
                    y += dy;
                }

                for (i = 0; i < 4; ++i) {
                    block.x[i] = block.x[i] * 10 + x;
                    block.y[i] = block.y[i] * 10 + y;
                }
                canHold = true;
                blocks.push(block);
                block = next;
                next = createBlock();
                deleteLine();
                y = 0;
                x = 40;
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

        function isAnyCollide() {
            for (var k = 0; k < 4; ++k) {
                if (block.x[k] * 10 + x < 0 || block.x[k] * 10 + x >= 100 || block.y[k] * 10 + y + dy >= canvas.height) {
                    return (true);
                }
            }
            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (k = 0; k < 4; ++k) {
                        if (block.x[k] * 10 + x === blocks[i].x[j] &&
                            block.y[k] * 10 + y + 10 === blocks[i].y[j]) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function drawBlocks() {
            ctx.beginPath();
            for (var i = 0; i < 4; ++i) {
                ctx.rect(block.x[i] * 10 + x, block.y[i] * 10 + y, 10, 10);
                ctx.fillStyle = block.color;
                ctx.fill();
            }
            ctx.closePath();
            for (i = 0; i < blocks.length; ++i) {
                ctx.beginPath();
                for (var j = 0; j < 4; ++j) {
                    if (blocks[i].y[j] !== -1) {
                        ctx.rect(blocks[i].x[j], blocks[i].y[j], 10, 10);
                        ctx.fillStyle = blocks[i].color;
                        ctx.fill();
                    }
                }
                ctx.closePath();
            }

        }

        function drawHold() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "15px Arial";
            ctx.fillText("Hold:(C)", 120, 20);
            ctx.closePath();
            if (hold.length !== 0) {
                ctx.beginPath();
                for (var i = 0; i < 4; ++i) {
                    ctx.rect(hold.x[i] * 10 + 135, hold.y[i] * 10 + 40, 10, 10);
                    ctx.fillStyle = hold.color;
                    ctx.fill();
                }
                ctx.closePath();
            }
            ctx.beginPath();
            for (i = 0; i < canvas.height; i += 5) {
                ctx.rect(100, i, 5, 5);
                ctx.fillStyle = "#000000";
                ctx.fill();
            }
            ctx.closePath();
        }

        function drawNext() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "15px Arial";
            ctx.fillText("Next:", 120, 90);
            ctx.closePath();
            ctx.beginPath();
            for (var i = 0; i < 4; ++i) {
                ctx.rect(next.x[i] * 10 + 135, next.y[i] * 10 + 110, 10, 10);
                ctx.fillStyle = next.color;
                ctx.fill();
            }
            ctx.closePath();
        }

        function drawScore() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "15px Arial";
            ctx.fillText("Score:".concat(score.toString()), 190, 65);
            ctx.closePath();
        }

        function drawGameOver() {
            ctx.beginPath();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.font = "35px Arial";
            ctx.fillText("Game Over", 50, canvas.height / 2 - 30);
            ctx.fillText("Score:", 90, canvas.height / 2);
            ctx.fillText(score.toString(), (canvas.width / 2 - 25) - (score.toString().length / 2) * 10, canvas.height / 2 + 50);
            ctx.closePath();
        }

        function move() {
            if (!start) {
                return;
            }
            var maxY = 0;
            for (var i = 0; i < 4; ++i) {
                if (maxY < block.y[i]) {
                    maxY = block.y[i];
                }
            }
            if (y === 0 && isCollide()) {
                clearInterval(id1);
                clearInterval(id2);
                drawGameOver();
                start = false;
                document.getElementById("start").innerHTML = "Restart";
            }
            else if (y + dy + maxY * 10 >= canvas.height || isCollide()) {
                for (i = 0; i < 4; ++i) {
                    block.x[i] = block.x[i] * 10 + x;
                    block.y[i] = block.y[i] * 10 + y;
                }
                canHold = true;
                blocks.push(block);
                block = next;
                next = createBlock();
                deleteLine();
                y = 0;
                x = 40;
            }
            else {
                y += dy;
            }
        }

        function deleteLine() {
            var addScore = 0;
            for (var t = 10; t <= canvas.height; t += 10) {
                var test = 0;
                for (var i = 0; i < 10; ++i) {
                    for (var j = 0; j < blocks.length; ++j) {
                        for (var k = 0; k < 4; ++k) {
                            if (blocks[j].y[k] + dy === t &&
                                blocks[j].x[k] === i * 10) {
                                ++test;
                            }
                        }
                    }
                }
                if (test === 10) {
                    addScore *= 1.3;
                    addScore += 10;
                    for (i = 0; i < 10; ++i) {
                        for (j = 0; j < blocks.length; ++j) {
                            for (k = 0; k < 4; ++k) {
                                if (blocks[j].y[k] + dy === t &&
                                    blocks[j].x[k] === i * 10) {
                                    blocks[j].y[k] = -1;
                                }
                            }
                        }
                    }
                    for (j = 0; j < blocks.length; ++j) {
                        for (k = 0; k < 4; ++k) {
                            if (blocks[j].y[k] !== -1 && blocks[j].y[k] + dy < t) {
                                blocks[j].y[k] += 10;
                            }
                        }
                    }
                }
            }
            score += Math.trunc(addScore);
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBlocks();
            drawHold();
            drawNext();
            drawScore();
        }

        function startGame() {
            blocks = [];
            x = 40;
            y = 0;
            dy = 10;
            canHold = true;
            block = createBlock();
            hold = "";
            next = createBlock();
            score = 0;
            clearInterval(id1);
            clearInterval(id2);
            id1 = setInterval(draw, 10);
            id2 = setInterval(move, 300);
            start = true;
        }

        document.getElementById("start").onclick = function () { startGame(); };
        var id1 = setInterval(draw, 10);
        var id2 = setInterval(move, 300);
    };
    return Tetris;
}();