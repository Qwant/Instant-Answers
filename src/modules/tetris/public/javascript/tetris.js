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
        var canvas = document.getElementById("tetrisCanvas");
        var ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = 600;

        var screen = 0;
        var xCurs = 0;
        var yCurs = 0;
        var click = false;

        var x;
        var y = 0;
        var dy = canvas.height / 20;
        var canHold = true;
        var block = createBlock();
        var blocks = [];
        var hold = "";
        var next = createBlock();
        var score = 0;
        var id = -1;
        var withoutBar = 0;
        var level = 0;

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX - canvas.offsetLeft;
            yCurs = e.pageY - canvas.offsetTop;
        });
        window.addEventListener('click', function () {
            click = true;
        });
        window.addEventListener("keydown", keyDownHandler, false);
        function createBlock() {
            var number = Math.trunc(Math.random() * 1000) % 7;
            var block = {};

            if (withoutBar > 7) {
                number = 4;
            }
            switch (number) {
                case 0:
                {
                    block = {
                        id : 0,
                        color : "#007ba7",
                        x : [0, 0, 0, -1],
                        y : [0, -1, 1, 1]
                    };
                    ++withoutBar;
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
                    ++withoutBar;
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
                    ++withoutBar;
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
                    ++withoutBar;
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
                    withoutBar = 0;
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
                    ++withoutBar;
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
                    ++withoutBar;
                    return (block);
                }
            }
        }

        function isCollideRow(tmpX) {
            for (var i = 0; i < 4; ++i) {
                if (block.x[i] * dy + tmpX < 0 || block.x[i] * dy + tmpX >= 10 * dy) {
                    return (true);
                }
            }
            for (i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (var k = 0; k < 4; ++k) {
                        if (blocks[i].x[j] === block.x[k] * dy + tmpX &&
                            blocks[i].y[j] === block.y[k] * dy + y) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function isAnyCollide() {
            for (var k = 0; k < 4; ++k) {
                if (block.x[k] * dy + x < 0 || block.x[k] * dy + x >= dy * 10 || block.y[k] * dy + y + dy >= canvas.height) {
                    return (true);
                }
            }
            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (k = 0; k < 4; ++k) {
                        if (block.x[k] * dy + x === blocks[i].x[j] &&
                            block.y[k] * dy + y + dy === blocks[i].y[j]) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function deleteLine() {
            var addScore = 0;
            for (var t = dy; t <= canvas.height; t += dy) {
                var test = 0;
                for (var i = 0; i < 10; ++i) {
                    for (var j = 0; j < blocks.length; ++j) {
                        for (var k = 0; k < 4; ++k) {
                            if (blocks[j].y[k] + dy === t &&
                                blocks[j].x[k] === i * dy) {
                                ++test;
                            }
                        }
                    }
                }
                if (test === 10) {
                    addScore *= 1.3;
                    addScore += 100;
                    for (i = 0; i < 10; ++i) {
                        for (j = 0; j < blocks.length; ++j) {
                            for (k = 0; k < 4; ++k) {
                                if (blocks[j].y[k] + dy === t &&
                                    blocks[j].x[k] === i * dy) {
                                    blocks[j].y[k] = -1;
                                }
                            }
                        }
                    }
                    for (j = 0; j < blocks.length; ++j) {
                        for (k = 0; k < 4; ++k) {
                            if (blocks[j].y[k] !== -1 && blocks[j].y[k] + dy < t) {
                                blocks[j].y[k] += dy;
                            }
                        }
                    }
                }
            }
            score += Math.trunc(addScore);
            if (Math.trunc(score / 700) !== level) {
                level = Math.trunc(score / 700);
                clearInterval(id);
                id   = setInterval(move, 500 - (level * 30));
            }
        }

        function keyDownHandler(e) {
            if (screen !==1) {
                return;
            }
            if(e.keyCode === 39) {
                e.preventDefault();
                if (!isCollideRow(x + dy)) {
                    x += dy;
                }
            }
            if(e.keyCode === 37) {
                e.preventDefault();
                if (!isCollideRow(x - dy)) {
                    x -= dy;
                }
            }
            if(e.keyCode === 40) {
                e.preventDefault();
                var maxY = 0;
                for (i = 0; i < 4; ++i) {
                    if (maxY < block.y[i]) {
                        maxY = block.y[i];
                    }
                }
                if (!(y + dy + maxY * dy >= canvas.height || isCollide())) {
                    y += dy;
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
                    x = saveX + dy;
                    for (i = 1; i < 3; ++i) {
                        if (isAnyCollide()) {
                            x = saveX + (i * dy);
                        }
                    }
                    for (i = 1; i < 3; ++i) {
                        if (isAnyCollide()) {
                            x = saveX - (i * dy);
                        }
                    }
                    if (isAnyCollide()) {
                        x = saveX;
                        for (i = 1; i < 3; ++i) {
                            if (isAnyCollide()) {
                                y = saveY - (i * dy);
                            }
                        }
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
                x = 4 * dy;
                y = 0;
                canHold = false;
            }
            if (e.keyCode === 32) {
                e.preventDefault();
                maxY = 0;
                for (i = 0; i < 4; ++i) {
                    if (maxY < block.y[i]) {
                        maxY = block.y[i];
                    }
                }
                while (!(y + dy + maxY * dy >= canvas.height || isCollide())) {
                    y += dy;
                }

                for (i = 0; i < 4; ++i) {
                    block.x[i] = block.x[i] * dy + x;
                    block.y[i] = block.y[i] * dy + y;
                }
                canHold = true;
                blocks.push(block);
                block = next;
                next = createBlock();
                deleteLine();
                y = 0;
                x = 4 * dy;
            }
        }

        function drawBlocks() {
            ctx.beginPath();
            for (var i = 0; i < 4; ++i) {
                ctx.rect(block.x[i] * dy + x, block.y[i] * dy + y, dy, dy);
                ctx.fillStyle = block.color;
                ctx.fill();
            }
            ctx.closePath();
            for (i = 0; i < blocks.length; ++i) {
                ctx.beginPath();
                for (var j = 0; j < 4; ++j) {
                    if (blocks[i].y[j] !== -1) {
                        ctx.rect(blocks[i].x[j], blocks[i].y[j], dy, dy);
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
            ctx.font = "30px Arial";
            ctx.fillText("Hold:(C)", 10 * dy + 20, 40);
            ctx.closePath();
            if (hold.length !== 0) {
                ctx.beginPath();
                for (var i = 0; i < 4; ++i) {
                    ctx.rect(hold.x[i] * dy + 10 * dy + 60, hold.y[i] * dy + 120, dy, dy);
                    ctx.fillStyle = hold.color;
                    ctx.fill();
                }
                ctx.closePath();
            }
            ctx.beginPath();
            ctx.rect(10 * dy, 0, 5, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.fill();
            ctx.closePath();
        }

        function drawNext() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "30px Arial";
            ctx.fillText("Next:", 10 * dy + 20, canvas.height / 2);
            ctx.closePath();
            ctx.beginPath();
            for (var i = 0; i < 4; ++i) {
                ctx.rect(next.x[i] * dy + 10 * dy + 60, next.y[i] * dy + canvas.height / 2 + 80, dy, dy);
                ctx.fillStyle = next.color;
                ctx.fill();
            }
            ctx.closePath();
        }

        function drawScore() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "30px Arial";
            ctx.fillText("Score:".concat(score.toString()), 2 * canvas.width / 3, canvas.height / 2);
            ctx.closePath();
        }

        function drawCadri() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            for (var i = 0; i <= 20; ++i) {
                if (i === 20) {
                    ctx.rect(0, i * dy - 1, 10 * dy, 1);
                }
                else {
                    ctx.rect(0, i * dy, 10 * dy, 1);
                }
                ctx.fill();
            }
            for (i = 0; i < 10; ++i) {
                ctx.rect(i * dy, 0, 1, 20 * dy);
                ctx.fill();
            }
            ctx.closePath();
        }

        function drawPreview() {
            var maxY = 0;
            for (var i = 0; i < 4; ++i) {
                if (maxY < block.y[i]) {
                    maxY = block.y[i];
                }
            }
            var saveY = y;
            while (!(saveY + dy + maxY * dy >= canvas.height || isCollidePrev(saveY))) {
                saveY += dy;
            }
            ctx.beginPath();
            for (i = 0; i < 4; ++i) {
                ctx.rect(block.x[i] * dy + x, block.y[i] * dy + saveY, dy, dy);
                ctx.fillStyle = "#888888";
                ctx.fill();
            }
            ctx.closePath();
        }

        function drawLevel() {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.font = "30px Arial";
            ctx.fillText("Level: ".concat((level + 1).toString()), 2 * canvas.width / 3, 80);
            ctx.closePath();
        }

        function drawSection() {
            drawPreview();
            drawBlocks();
            drawHold();
            drawNext();
            drawScore();
            drawCadri();
            drawLevel();
        }

        function isCollide() {
            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (var k = 0; k < 4; ++k) {
                        if (block.x[k] * dy + x === blocks[i].x[j] &&
                            block.y[k] * dy + y + dy === blocks[i].y[j]) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function isCollidePrev(yBlock) {
            for (var i = 0; i < blocks.length; ++i) {
                for (var j = 0; j < 4; ++j) {
                    for (var k = 0; k < 4; ++k) {
                        if (block.x[k] * dy + x === blocks[i].x[j] &&
                            block.y[k] * dy + yBlock + dy === blocks[i].y[j]) {
                            return (true);
                        }
                    }
                }
            }
            return (false);
        }

        function move() {
            var maxY = 0;
            for (var i = 0; i < 4; ++i) {
                if (maxY < block.y[i]) {
                    maxY = block.y[i];
                }
            }
            if (y === 0 && isCollide()) {
                screen = (screen + 1) % 3;
            }
            else if (y + dy + maxY * dy >= canvas.height || isCollide()) {
                for (i = 0; i < 4; ++i) {
                    block.x[i] = block.x[i] * dy + x;
                    block.y[i] = block.y[i] * dy + y;
                }
                canHold = true;
                blocks.push(block);
                block = next;
                next = createBlock();
                deleteLine();
                y = 0;
                x = 4 * dy;
            }
            else {
                y += dy;
            }
        }

        function drawGameOver() {
            ctx.beginPath();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.font = "35px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 50);
            ctx.fillText("Score:", canvas.width / 2 - 55, canvas.height / 2 - 20);
            ctx.fillText(score.toString(), (canvas.width / 2 - 20) - (score.toString().length / 2) * 10, canvas.height / 2 + 10);
            ctx.fillText("Retry?", (canvas.width / 2 - 60), (canvas.height - 30));
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
                    blocks  = [];
                    x       = 4 * dy;
                    y       = 0;
                    canHold = true;
                    block   = createBlock();
                    hold    = "";
                    next    = createBlock();
                    score   = 0;
                    id   = setInterval(move, 500);
                }
            }
            else if (screen === 1) {
                drawSection();
            }
            else if (screen === 2) {
                clearInterval(id);
                drawGameOver();
                if (click && xCurs > 0 && xCurs < canvas.width && yCurs > 0 && canvas.height) {
                    screen = (screen + 1) % 3;
                }
            }
            click = false;
        }
        setInterval(draw, 10);
    };
    return Tetris;
}();