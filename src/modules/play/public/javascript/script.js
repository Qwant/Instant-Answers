var IARuntime = function() {
    function Play (iaData) {
        IARuntime.ids = {
            id:[],
            idmusic : []
        };
    }

    /**
     * runs at runtime
     */

    Play.prototype.run = function () {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var catgames = document.getElementById("cat_games");
        var can_style = document.getElementById("mycanvas");
        var ctx = can_style.getContext("2d");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        can.style.display = "none";
        cross.style.display = "none";
        catgames.style.display = "none";
        play.addEventListener("click", function(){
            if (state === 0){
                elem.style.height = "800px";
                setTimeout(function(){
                    catgames.style.display = "flex";
                    cross.style.display = "block";
                    can.style.display = "block";
                    scope.qwantsole();
                }, 800)
                play.style.cursor = "default";
                play.style.display = "none";
                state = 1;
            }
        })
        cross.addEventListener("click", function(){
            if(state === 1){
                elem.style.height = "200px";
                can.style.display = "none";
                cross.style.display = "none";
                catgames.style.display = "none";
                can_style.style.backgroundColor = "black";
                setTimeout(function(){
                    play.style.cursor = "pointer";
                }, 800)
                state = 0;
                play.style.display = "block";
                for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                    clearInterval(IARuntime.ids.id[i]);
                }
                for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                    IARuntime.ids.idmusic[i].pause();
                }
                IARuntime.ids.id = [];
                IARuntime.ids.idmusic = [];
                ctx.clearRect(0,0,800,600);
            }
        })
    };
    Play.prototype.qwantsole = function () {
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        var link = document.createElement('link');
        var scope = this;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P';
        document.getElementsByTagName('head')[0].appendChild(link);
        link.onload = function () {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = '15px "Press Start 2P"';
            var textString = "INSERT COIN 0",
                textWidth = ctx.measureText(textString).width;
            ctx.fillText(textString, (canvas.width / 2) - (textWidth / 2), 300);
        };
        var color = document.getElementById("insert_color");
        var snake = document.getElementById("insert_snake");
        var tetris = document.getElementById("insert_tetris");
        var morpion = document.getElementById("insert_morpion");
        var minesweeper = document.getElementById("insert_minesweeper");
        var scroller = document.getElementById("insert_scroller");
        var flappy = document.getElementById("insert_flappy");


        color.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
            var colorGame = function () {

                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext("2d");
                canvas.style.backgroundColor = "white";
                canvas.height = 600;
                canvas.width = 800;
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
                            return ({r: 85, g: 170, b: 85});
                        case 1:
                            return ({r: 170, g: 85, b: 85});
                        case 2:
                            return ({r: 85, g: 85, b: 170});
                        case 3:
                            return ({r: 170, g: 170, b: 85});
                        case 4:
                            return ({r: 85, g: 170, b: 170});
                        case 5:
                            return ({r: 170, g: 85, b: 170});
                        case 6:
                            return ({r: 85, g: 85, b: 85});
                        default:
                            return ({r: 170, g: 170, b: 170});
                    }
                }

                function rgb(r, g, b) {
                    return "rgb(" + r + "," + g + "," + b + ")";
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

                function drawChrono() {
                    end = new Date();
                    diff = end - start;
                    diff = new Date(diff);
                    var str = (90 - (diff.getSeconds() + diff.getMinutes() * 60)).toString().concat(" seconds");
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "30px Arial";
                    var textWidth = ctx.measureText("Timer").width;
                    ctx.fillText("Timer", 700 - textWidth / 2, 150);
                    textWidth = ctx.measureText(str).width;
                    ctx.fillText(str, 700 - textWidth / 2, 180);
                    ctx.closePath();
                    if (90 - (diff.getSeconds() + diff.getMinutes() * 60) <= 0) {
                        screen = (screen + 1) % 3;
                    }
                }

                function drawReset() {
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "30px Arial";
                    var textWidth = ctx.measureText("Reset").width;
                    ctx.fillText("Reset", 700 - textWidth / 2, 450);
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
                            start = new Date();
                        }
                    }
                    else if (screen === 1) {
                        drawGame();
                        drawCadri();
                        drawChrono();
                        drawReset();
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
                        if (x >= 600 && x < 800 && y >= 300 && y < 600 && click) {
                            row = 2;
                            column = 2;
                            level = 1;
                            pos = Math.trunc(Math.random() * 10000) % (row * column);
                            color = randomColor();
                            lumi = Math.trunc(Math.random() * 10000) % 2;
                            start = new Date();
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

                IARuntime.ids.id.push(setInterval(draw, 10));
            };
            colorGame();
        })
        snake.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
            var snakeGame = function () {
                var mycanvas = document.getElementById('mycanvas');
                var id = 0;
                var ctx = mycanvas.getContext('2d');
                canvas.style.backgroundColor = "white";
                var snakeSize = 20;
                mycanvas.width = 800;
                mycanvas.height = 600;
                var w = 800;
                var h = 600;
                var score = 0;
                var snake;
                var food;
                var bonbon;
                var screen = 0;
                var x = 0;
                var y = 0;
                var click = false;

                window.addEventListener('mousemove', function (e) {
                    x = e.pageX - canvas.offsetLeft;
                    y = e.pageY - canvas.offsetTop;
                });
                window.addEventListener('click', function () {
                    click = true;
                });

                var bodySnake = function (x, y) {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
                    ctx.strokeStyle = 'darkgreen';
                    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
                }

                var pizza = function (x, y) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x * snakeSize + 1, y * snakeSize + 1, snakeSize - 2, snakeSize - 2);
                }
                var bonus = function (x, y) {
                    ctx.fillStyle = 'pink';
                    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
                    ctx.strokeStyle = 'blue';
                    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
                }

                var scoreText = function () {
                    var score_text = "Score: " + score;
                    ctx.font = '12pt Calibri,Geneva,Arial';
                    ctx.fillStyle = 'blue';
                    ctx.fillText(score_text, mycanvas.width - 80, mycanvas.height - 15);
                }

                var drawSnake = function () {
                    var length = 4;
                    snake = [];
                    for (var i = length - 1; i >= 0; i--) {
                        snake.push({x: i, y: 0});
                    }
                }

                var paint = function () {
                    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);

                    ctx.fillStyle = 'lightgrey';
                    ctx.fillRect(0, 0, w, h);
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(0, 0, w, h);
                    var snakeX = snake[0].x;
                    var snakeY = snake[0].y;

                    if (direction == 'right') {
                        snakeX++;
                    }
                    else if (direction == 'left') {
                        snakeX--;
                    }
                    else if (direction == 'up') {
                        snakeY--;
                    } else if (direction == 'down') {
                        snakeY++;
                    }

                    if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake)) {
                        gameOver();
                    }

                    if (snakeX == food.x && snakeY == food.y) {
                        var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
                        score++;
                        createFood(); //Create new food
                        if (bonbon.x == -1 && Math.trunc((Math.random() * 1000) % 8) == 0) {
                            createBonus(); //Create new food
                        }
                    } else if (snakeX == bonbon.x && snakeY == bonbon.y) {
                        var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
                        score += 10;
                        bonbon = {
                            x: -1,
                            y: -1
                        };
                    } else {
                        var tail = snake.pop(); //pops out the last cell
                        tail.x = snakeX;
                        tail.y = snakeY;
                    }
                    //The snake can now eat the food.
                    snake.unshift(tail); //puts back the tail as the first cell

                    for (var i = 0; i < snake.length; i++) {
                        bodySnake(snake[i].x, snake[i].y);
                    }

                    pizza(food.x, food.y);
                    bonus(bonbon.x, bonbon.y);
                    scoreText();

                    console.log(mycanvas.offsetLeft);

                }
                var start = function () {
                    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '20pt Calibri,Geneva,Arial';
                    var textString = "Start",
                        textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, (mycanvas.width / 2) - (textWidth / 2), 300);

                }
                var gameOver = function () {
                    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                    clearInterval(id);
                    ctx.fillStyle = "#000000";
                    ctx.font = '20pt Calibri,Geneva,Arial';

                    var textString = "GAMEOVER!!!\n Click To Restart",
                        textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, (mycanvas.width / 2) - (textWidth / 2), 300);
                    screen = 0;
                }


                var createFood = function () {
                    var seekX = 0;
                    var seekY = 0;
                    var testPos = true;

                    for (var i = 0; i < 50 && testPos; ++i) {
                        seekX = Math.floor((Math.random() * 10000) % (mycanvas.width / 20));
                        seekY = Math.floor((Math.random() * 10000) % (mycanvas.height / 20));
                        testPos = false;
                        for (var j = 0; j < snake.length; ++j) {
                            if (snake[j].x == seekX && snake[j].y == seekY) {
                                testPos = true;
                            }
                        }
                    }
                    if (testPos) {
                        for (i = 0; i < Math.trunc(mycanvas.height / 20) && testPos; ++i) {
                            for (j = 0; j < Math.trunc(mycanvas.width / 20) && testPos; ++j) {
                                testPos = false;
                                for (var k = 0; k < snake.length; ++k) {
                                    if (snake[k].x == j && snake[k].y == i) {
                                        testPos = true;
                                    }
                                }
                                if (!testPos) {
                                    seekX = j;
                                    seekY = i;
                                }
                            }
                        }
                    }
                    food = {
                        x: seekX,
                        y: seekY
                    }
                }
                var createBonus = function () {
                    var seekX = 0;
                    var seekY = 0;
                    var testPos = true;

                    for (var i = 0; i < 50 && testPos; ++i) {
                        seekX = Math.floor((Math.random() * 10000) % (mycanvas.width / 20));
                        seekY = Math.floor((Math.random() * 10000) % (mycanvas.height / 20));
                        testPos = false;
                        for (var j = 0; j < snake.length; ++j) {
                            if ((snake[j].x == seekX && snake[j].y == seekY) ||
                                (food.x == seekX && food.y == seekX)) {
                                testPos = true;
                            }
                        }
                    }
                    if (testPos) {
                        for (i = 0; i < Math.trunc(mycanvas.height / 20) && testPos; ++i) {
                            for (j = 0; j < Math.trunc(mycanvas.width / 20) && testPos; ++j) {
                                testPos = false;
                                for (var k = 0; k < snake.length; ++k) {
                                    if ((snake[k].x == j && snake[k].y == i) ||
                                        (food.x == seekX && food.y == seekX)) {
                                        testPos = true;
                                    }
                                }
                                if (!testPos) {
                                    seekX = j;
                                    seekY = i;
                                }
                            }
                        }
                    }
                    bonbon = {
                        x: seekX,
                        y: seekY
                    }
                }

                var checkCollision = function (x, y, array) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].x === x && array[i].y === y) {
                            return true;
                        }

                    }
                    return false;
                }

                function keyDownHandler(e) {

                    switch (e.keyCode) {

                        case 37:
                            if (screen == 1) {
                                e.preventDefault();
                            }
                            if (snake[0].x - 1 != snake[1].x || snake[0].y != snake[1].y) {
                                direction = 'left';
                            }
                            console.log('left');
                            break;

                        case 39:
                            if (screen == 1) {
                                e.preventDefault();
                            }
                            if (snake[0].x + 1 != snake[1].x || snake[0].y != snake[1].y) {
                                direction = 'right';
                                console.log('right');
                            }
                            break;

                        case 38:
                            if (screen == 1) {
                                e.preventDefault();
                            }
                            if (snake[0].x != snake[1].x || snake[0].y - 1 != snake[1].y) {
                                direction = 'up';
                                console.log('up');
                            }
                            break;

                        case 40:
                            if (screen == 1) {
                                e.preventDefault();
                            }
                            if (snake[0].x != snake[1].x || snake[0].y + 1 != snake[1].y) {
                                direction = 'down';
                                console.log('down');
                            }
                            break;
                    }
                }

                ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                start();
                function draw() {
                    if (screen === 0 && click && x > 0 && x < 800 && y > 0 && y < 600) {
                        screen = 1;
                        direction = 'down';
                        score = 0;
                        drawSnake();
                        createFood();
                        bonbon = {
                            x: -1,
                            y: -1
                        };

                        id = setInterval(paint, 80);
                        IARuntime.ids.id.push(id);
                        window.addEventListener("keydown", keyDownHandler, false);
                    }
                    click = false;
                }
                IARuntime.ids.id.push(setInterval(draw, 10));
            };
            snakeGame();
        })
        tetris.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
            var tetrisGame = function () {
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext("2d");
                canvas.style.backgroundColor = "white";
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                        case 0: {
                            block = {
                                id: 0,
                                color: "#007ba7",
                                x: [0, 0, 0, -1],
                                y: [0, -1, 1, 1]
                            };
                            ++withoutBar;
                            return (block);
                        }
                        case 1: {
                            block = {
                                id: 1,
                                color: "#ff8847",
                                x: [0, 0, 0, 1],
                                y: [0, -1, 1, 1]
                            };
                            ++withoutBar;
                            return (block);
                        }
                        case 2: {
                            block = {
                                id: 2,
                                color: "#ecc831",
                                x: [0, 0, -1, -1],
                                y: [0, -1, -1, 0]
                            };
                            ++withoutBar;
                            return (block);
                        }
                        case 3: {
                            block = {
                                id: 3,
                                color: "#bbc6ce",
                                x: [0, -1, 1, 0],
                                y: [0, 0, 0, -1]
                            };
                            ++withoutBar;
                            return (block);
                        }
                        case 4: {
                            block = {
                                id: 4,
                                color: "#e33232",
                                x: [0, 0, 0, 0],
                                y: [0, -1, 1, 2]
                            };
                            withoutBar = 0;
                            return (block);
                        }
                        case 5: {
                            block = {
                                id: 5,
                                color: "#1c945a",
                                x: [0, -1, -1, 0],
                                y: [0, 0, 1, -1]
                            };
                            ++withoutBar;
                            return (block);
                        }
                        default: {
                            block = {
                                id: 6,
                                color: "#660066",
                                x: [0, 0, 1, 1],
                                y: [0, -1, 0, 1]
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
                        id = setInterval(move, 500 - (level * 30));
                        IARuntime.ids.id.push(id);
                    }
                }

                function keyDownHandler(e) {
                    if (screen !== 1) {
                        return;
                    }
                    if (e.keyCode === 39) {
                        e.preventDefault();
                        if (!isCollideRow(x + dy)) {
                            x += dy;
                        }
                    }
                    if (e.keyCode === 37) {
                        e.preventDefault();
                        if (!isCollideRow(x - dy)) {
                            x -= dy;
                        }
                    }
                    if (e.keyCode === 40) {
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
                    if (e.keyCode === 38 && block.id !== 2) {
                        e.preventDefault();
                        var saveBlock = {
                            id: block.id,
                            color: block.color,
                            x: block.x.slice(),
                            y: block.y.slice()
                        };
                        if (block.id === 4 && block.x[1] === 1) {
                            block = {
                                id: 4,
                                color: "#e33232",
                                x: [0, 0, 0, 0],
                                y: [0, -1, 1, 2]
                            };
                        }
                        else {
                            var saveX;
                            var saveY;
                            for (var i = 0; i < 4; ++i) {
                                saveX = block.x[i];
                                saveY = block.y[i];
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
                            blocks = [];
                            x = 4 * dy;
                            y = 0;
                            canHold = true;
                            block = createBlock();
                            hold = "";
                            next = createBlock();
                            score = 0;
                            id = setInterval(move, 500);
                            IARuntime.ids.id.push(id);
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
                IARuntime.ids.id.push(setInterval(draw, 10));
            };
            tetrisGame();
        })
        morpion.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            IARuntime.ids.id = [];
            var morpionGame = function () {
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext("2d");
                canvas.style.backgroundColor = "white";
                ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                IARuntime.ids.id.push(setInterval(draw, 10));
            };
            morpionGame();
        })
        minesweeper.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
            var minesweeperGame = function () {
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext("2d");
                canvas.style.backgroundColor = "white";
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 800;
                canvas.height = 600;
                var screen = 0;
                var xCurs = 0;
                var yCurs = 0;
                var click = false;
                var id = -1;
                var columns = "20";
                var rows = "15";
                var nbMines = "30";
                var intColumns;
                var intRows;
                var intNbMines;
                var cursor = -1;
                var loop = 0;
                var disp = true;
                var tile;
                var startX;
                var startY;
                var sprite = document.getElementById("sprite");
                var win = document.getElementById("win");
                var lose = document.getElementById("lose");
                var game = [];
                var rightClick = false;
                var gameOver = 0;
                var start;
                var diff;

                window.addEventListener('mousemove', function (e) {
                    xCurs = e.pageX - canvas.offsetLeft;
                    yCurs = e.pageY - canvas.offsetTop;
                });
                window.addEventListener('mousedown', function (e) {
                    if (e.button === 1 || e.button === 0) {
                        click = true;
                    }
                }, false);
                window.addEventListener('mouseup', function (e) {
                    if (e.button === 1 || e.button === 0) {
                        click = false;
                    }
                    else {
                        rightClick = false;
                    }
                }, false);
                window.addEventListener('contextmenu', function (e) {
                    if (xCurs >= 0 && xCurs <= canvas.width && yCurs >= 0 && yCurs <= canvas.height) {
                        e.preventDefault();
                    }
                    rightClick = true;
                    return (false);
                }, false);
                window.addEventListener("keydown", keyDownHandler, false);

                function keyDownHandler(e) {
                    if (screen !== 0) {
                        return;
                    }
                    e.preventDefault();
                    if (e.keyCode === 8) {
                        switch (cursor) {
                            case 1: {
                                if (columns.length > 0) {
                                    columns = columns.slice(0, -1);
                                }
                                break;
                            }
                            case 2: {
                                if (rows.length > 0) {
                                    rows = rows.slice(0, -1);
                                }
                                break;
                            }
                            case 3: {
                                if (nbMines.length > 0) {
                                    nbMines = nbMines.slice(0, -1);
                                }
                                break;
                            }
                        }
                    }
                    if (e.keyCode >= 96 && e.keyCode <= 105) {
                        switch (cursor) {
                            case 1: {
                                if (columns.length < 2) {
                                    columns += String.fromCharCode(e.keyCode - 48);
                                }
                                break;
                            }
                            case 2: {
                                if (rows.length < 2) {
                                    rows += String.fromCharCode(e.keyCode - 48);
                                }
                                break;
                            }
                            case 3: {
                                if (nbMines.length < 3) {
                                    nbMines += String.fromCharCode(e.keyCode - 48);
                                }
                                break;
                            }
                        }
                    }
                    else if (e.keyCode >= 48 && e.keyCode <= 57) {
                        switch (cursor) {
                            case 1: {
                                if (columns.length < 2) {
                                    columns += String.fromCharCode(e.keyCode);
                                }
                                break;
                            }
                            case 2: {
                                if (rows.length < 2) {
                                    rows += String.fromCharCode(e.keyCode);
                                }
                                break;
                            }
                            case 3: {
                                if (nbMines.length < 3) {
                                    nbMines += String.fromCharCode(e.keyCode);
                                }
                                break;
                            }
                        }
                    }
                }

                function drawGame() {
                    for (var i = 0; i < intRows; ++i) {
                        for (var j = 0; j < intColumns; ++j) {
                            if (game[i][j].status === 0) {
                                ctx.drawImage(sprite, 0, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                            }
                            else if (game[i][j].status === 1) {
                                ctx.drawImage(sprite, 16, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                            }
                            else if (game[i][j].status === 2) {
                                ctx.drawImage(sprite, 32, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                            }
                            else if (game[i][j].status === 3) {
                                if (game[i][j].value === -1) {
                                    ctx.drawImage(sprite, 48, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                                }
                                else if (game[i][j].value === -2) {
                                    ctx.drawImage(sprite, 64, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                                }
                                else if (game[i][j].value === 0) {
                                    ctx.drawImage(sprite, 112, 0, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                                }
                                else {
                                    ctx.drawImage(sprite, (game[i][j].value - 1) * 16, 16, 16, 16, startX + j * tile, startY + i * tile, tile, tile);
                                }
                            }
                        }
                    }
                }

                function drawCadri() {
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    for (var i = 0; i <= intColumns; ++i) {
                        ctx.fillRect(startX + i * tile, startY, 1, intRows * tile);
                    }
                    for (i = 0; i <= intRows; ++i) {
                        ctx.fillRect(startX, startY + i * tile, intColumns * tile, 1);
                    }
                    ctx.closePath();
                }

                function drawTimer() {
                    if (gameOver === 0) {
                        var end = new Date();
                        diff = end - start;
                        diff = new Date(diff);
                    }
                    var str = "Timer : " + diff.getMinutes() + ":" + diff.getSeconds();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "30px Arial";
                    var textWidth = ctx.measureText(str).width;
                    ctx.fillText(str, canvas.width / 2 - textWidth / 2, 50);
                    ctx.closePath();
                }

                function drawSection() {
                    drawGame();
                    drawCadri();
                    drawTimer();
                    drawGameOver();
                }

                function drawGameOver() {
                    if (gameOver !== 0) {
                        ctx.beginPath();
                        if (gameOver === 1) {
                            ctx.drawImage(lose, canvas.width / 2 - 207, canvas.height / 2 - 45);
                        }
                        else {
                            ctx.drawImage(win, canvas.width / 2 - 194.5, canvas.height / 2 - 44.5);
                        }
                        ctx.closePath();
                    }
                }

                function drawStart() {
                    ctx.beginPath();
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("Start!", canvas.width / 2 - 25, canvas.height / 2 + 50);
                    ctx.closePath();
                }

                function drawNbColumn() {
                    ctx.beginPath();
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("Columns:", canvas.width / 6 - 25, canvas.height / 6);
                    ctx.fillStyle = "white";
                    ctx.fillRect(canvas.width / 6 - 45, canvas.height / 6 + 25, 100, 50);
                    ctx.fillStyle = "black";
                    if (disp && cursor === 1) {
                        ctx.fillText(columns + "|", canvas.width / 6 - 10, canvas.height / 6 + 55);
                    }
                    else {
                        ctx.fillText(columns, canvas.width / 6 - 10, canvas.height / 6 + 55);
                    }
                    ctx.closePath();
                }

                function drawNbRow() {
                    ctx.beginPath();
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("Rows:", canvas.width / 2 - 25, canvas.height / 6);
                    ctx.fillStyle = "white";
                    ctx.fillRect(canvas.width / 2 - 45, canvas.height / 6 + 25, 100, 50);
                    ctx.fillStyle = "black";
                    if (disp && cursor === 2) {
                        ctx.fillText(rows + "|", canvas.width / 2 - 10, canvas.height / 6 + 55);
                    }
                    else {
                        ctx.fillText(rows, canvas.width / 2 - 10, canvas.height / 6 + 55);
                    }
                    ctx.closePath();
                }

                function drawNbMine() {
                    ctx.beginPath();
                    ctx.font = "20px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("Mines:", 5 * canvas.width / 6 - 25, canvas.height / 6);
                    ctx.fillStyle = "white";
                    ctx.fillRect(5 * canvas.width / 6 - 45, canvas.height / 6 + 25, 100, 50);
                    ctx.fillStyle = "black";
                    if (disp && cursor === 3) {
                        ctx.fillText(nbMines + "|", 5 * canvas.width / 6 - 10, canvas.height / 6 + 55);
                    }
                    else {
                        ctx.fillText(nbMines, 5 * canvas.width / 6 - 10, canvas.height / 6 + 55);
                    }
                    ctx.closePath();
                }

                function drawCursor() {
                    if (click && xCurs >= canvas.width / 6 - 25 && xCurs <= canvas.width / 6 + 75 && yCurs >= canvas.height / 6 + 25 && yCurs <= canvas.height / 6 + 75) {
                        cursor = 1;
                    }
                    else if (click && xCurs >= canvas.width / 2 - 25 && xCurs <= canvas.width / 2 + 75 && yCurs >= canvas.height / 6 + 25 && yCurs <= canvas.height / 6 + 75) {
                        cursor = 2;
                    }
                    else if (click && xCurs >= 5 * canvas.width / 6 - 25 && xCurs <= 5 * canvas.width / 6 + 75 && yCurs >= canvas.height / 6 + 25 && yCurs <= canvas.height / 6 + 75) {
                        cursor = 3;
                    }
                    else if (click) {
                        cursor = -1;
                    }
                    loop = (loop + 1) % 50;
                    if (loop === 0) {
                        disp = !disp;
                    }
                }

                function putNumber(x, y) {
                    if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
                        return;
                    }
                    if (game[y][x].value !== -1) {
                        ++game[y][x].value;
                    }
                }

                function generateGame() {
                    for (var i = 0; i < intRows; ++i) {
                        var newRow = [];
                        for (var j = 0; j < intColumns; ++j) {
                            newRow.push({value: 0, status: 0});
                        }
                        game.push(newRow);
                    }
                    i = 0;
                    while (i < intNbMines) {
                        var x = Math.trunc(Math.random() * 1000) % intColumns;
                        var y = Math.trunc(Math.random() * 1000) % intRows;
                        if (game[y][x].value !== -1) {
                            game[y][x].value = -1;
                            ++i;
                        }
                    }
                    for (i = 0; i < intRows; ++i) {
                        for (j = 0; j < intColumns; ++j) {
                            if (game[i][j].value === -1) {
                                putNumber(j - 1, i - 1);
                                putNumber(j, i - 1);
                                putNumber(j + 1, i - 1);
                                putNumber(j - 1, i);
                                putNumber(j + 1, i);
                                putNumber(j - 1, i + 1);
                                putNumber(j, i + 1);
                                putNumber(j + 1, i + 1);
                            }
                        }
                    }
                    for (i = 0; i < intRows; ++i) {
                        console.log(game[i]);
                    }
                }

                function expandZero(x, y) {
                    if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
                        return;
                    }
                    var tmp = game[y][x].status;
                    game[y][x].status = 3;
                    if (game[y][x].value === 0 && tmp !== 3) {
                        expandZero(x - 1, y - 1);
                        expandZero(x, y - 1);
                        expandZero(x + 1, y - 1);
                        expandZero(x - 1, y);
                        expandZero(x + 1, y);
                        expandZero(x - 1, y + 1);
                        expandZero(x, y + 1);
                        expandZero(x + 1, y + 1);
                    }
                }

                function checkWin() {
                    for (var i = 0; i < intRows; ++i) {
                        for (var j = 0; j < intColumns; ++j) {
                            if (game[i][j].value !== -1 && game[i][j].status !== 3) {
                                return (false);
                            }
                        }
                    }
                    return (true);
                }

                function discoverArround(x, y) {
                    if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
                        return;
                    }
                    if (game[y][x].status === 0) {
                        game[y][x].status = 3;
                        if (game[y][x].value === 0) {
                            discoverArround(x - 1, y - 1);
                            discoverArround(x, y - 1);
                            discoverArround(x + 1, y - 1);
                            discoverArround(x - 1, y);
                            discoverArround(x + 1, y);
                            discoverArround(x - 1, y + 1);
                            discoverArround(x, y + 1);
                            discoverArround(x + 1, y + 1);
                        }
                    }
                }

                function checkGameOver() {
                    for (var i = 0; i < intRows; ++i) {
                        for (var j = 0; j < intColumns; ++j) {
                            if (game[i][j].value === -1 && game[i][j].status === 3) {
                                for (var y = 0; y < intRows; ++y) {
                                    for (var x = 0; x < intColumns; ++x) {
                                        game[y][x].status = 3;
                                        if (game[y][x].value === -1) {
                                            game[y][x].value = -2;
                                        }
                                    }
                                }
                                gameOver = 1;
                                return;
                            }
                        }
                    }
                }

                function draw() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (screen === 0) {
                        drawStart();
                        drawNbColumn();
                        drawNbRow();
                        drawNbMine();
                        drawCursor();
                        if (click && xCurs > canvas.width / 3 && xCurs < 2 * canvas.width / 3 && yCurs > canvas.height / 3 && yCurs < 2 * canvas.height / 2) {
                            screen = (screen + 1) % 3;
                            intColumns = parseInt(columns);
                            intRows = parseInt(rows);
                            intNbMines = parseInt(nbMines);
                            game = [];
                            if (!intColumns || intColumns < 5) {
                                intColumns = 5;
                            }
                            if (!intRows || intRows < 5) {
                                intRows = 5;
                            }
                            if (!intNbMines || intNbMines < 1 || intNbMines >= intRows * intColumns) {
                                intNbMines = Math.trunc(intRows * intColumns / 4);
                            }
                            tile = Math.trunc((canvas.width - 2) / intColumns);
                            if (tile > Math.trunc((canvas.height - 102) / intRows)) {
                                tile = Math.trunc((canvas.height - 102) / intRows);
                            }
                            startX = (canvas.width - (tile * intColumns)) / 2;
                            startY = (canvas.height - (tile * intRows)) / 2 + 35;
                            gameOver = 0;
                            generateGame();
                            start = new Date();
                        }
                    }
                    else if (screen === 1) {
                        drawSection();
                        if (gameOver === 0) {
                            if (click && xCurs >= startX && xCurs < startX + intColumns * tile && yCurs >= startY && yCurs < startY + intRows * tile) {
                                var y = Math.trunc((yCurs - startY) / tile);
                                var x = Math.trunc((xCurs - startX) / tile);
                                if (game[y][x].status === 0) {
                                    game[y][x].status = 3;
                                    if (game[y][x].value === 0) {
                                        expandZero(x - 1, y - 1);
                                        expandZero(x, y - 1);
                                        expandZero(x + 1, y - 1);
                                        expandZero(x - 1, y);
                                        expandZero(x + 1, y);
                                        expandZero(x - 1, y + 1);
                                        expandZero(x, y + 1);
                                        expandZero(x + 1, y + 1);
                                    }
                                }
                                else if (game[y][x].status === 3 && game[y][x].value > 0) {
                                    discoverArround(x - 1, y - 1);
                                    discoverArround(x, y - 1);
                                    discoverArround(x + 1, y - 1);
                                    discoverArround(x - 1, y);
                                    discoverArround(x + 1, y);
                                    discoverArround(x - 1, y + 1);
                                    discoverArround(x, y + 1);
                                    discoverArround(x + 1, y + 1);
                                }
                                if (gameOver === 0 && checkWin()) {
                                    gameOver = 2;
                                }
                            }
                            else if (rightClick && xCurs >= startX && xCurs < startX + intColumns * tile && yCurs >= startY && yCurs < startY + intRows * tile) {
                                y = Math.trunc((yCurs - startY) / tile);
                                x = Math.trunc((xCurs - startX) / tile);
                                if (game[y][x].status !== 3) {
                                    game[y][x].status = (game[y][x].status + 1) % 3;
                                }
                            }
                        }
                        else if (click) {
                            screen = 0;
                        }
                        checkGameOver();
                    }
                    click = false;
                    rightClick = false;
                }
                IARuntime.ids.id.push(setInterval(draw, 10));
            };
            minesweeperGame();
        })
        scroller.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
            var scrollerGame = function () {
                var canvas = document.getElementById("mycanvas");
                var ctx = canvas.getContext("2d");
                canvas.width = 800;
                canvas.height = 600;

                var screen = 0;
                var xCurs = 0;
                var yCurs = 0;
                var click = false;

                var dv = 5;
                var x = 0;
                var size = 40;
                var blocks = [];
                var dynamicBlocks = [];
                var obstacles = [];
                var score = 0;
                var id = -1;
                var camX = 0;
                var playerPosX = 100;
                var playerPosY = 100;
                var gravite = 0.3;
                var vGravite = 0;
                var left = false;
                var right = false;
                var space = false;
                var lastBlock = -1;
                var musicStart = document.getElementById("music_start");
                var music = document.getElementById("music");
                var musicStop = document.getElementById("music_stop");
                musicStart.loop = true;
                music.loop = true;
                musicStop.loop = true;
                var backgroundStart = document.getElementById("background_start");
                var background = document.getElementById("background");
                var backgroundStop = document.getElementById("background_stop");
                var block = document.getElementById("block");
                var dynamicBlock = document.getElementById("dynamic_block");
                var spike = document.getElementById("spike");
                var pattern = ctx.createPattern(block, "repeat");
                var dynPattern = ctx.createPattern(dynamicBlock, "repeat");
                var player = document.getElementById("player");
                var obstacle = document.getElementById("obstacle");
                var die = document.getElementById("die");
                var index = 0;
                var last = 0;
                var go = 0;
                var posSpike = -32;
                var dieIndex = 0;
                var explosion = document.getElementById("explosion");
                var mustDie = false;

                IARuntime.ids.idmusic.push(musicStart);
                IARuntime.ids.idmusic.push(music);
                IARuntime.ids.idmusic.push(musicStop);
                window.addEventListener('mousemove', function (e) {
                    xCurs = e.pageX - canvas.offsetLeft;
                    yCurs = e.pageY - canvas.offsetTop;
                });
                window.addEventListener('click', function () {
                    click = true;
                });
                window.addEventListener("keydown", keyDownHandler, false);
                window.addEventListener("keyup", keyUpHandler, false);

                function keyDownHandler(e) {
                    if (screen !== 1 && (screen !== 2 && e.keyCode !== 32)) {
                        return;
                    }
                    e.preventDefault();
                    go = 5;
                    if (e.keyCode === 32) {
                        space = true;
                        if (vGravite === 0 || calcCollision(playerPosX + 15, playerPosY) || calcCollision(playerPosX - 15, playerPosY)) {
                            vGravite = -15;
                        }
                    }
                    if (e.keyCode === 39) {
                        right = true;
                        last = 0;
                    }
                    if (e.keyCode === 37) {
                        left = true;
                        last = 1;
                    }
                }

                function keyUpHandler(e) {
                    if (screen !== 1) {
                        return;
                    }
                    e.preventDefault();
                    if (e.keyCode === 32) {
                        space = false;
                    }
                    if (e.keyCode === 39) {
                        right = false;
                        index = 0;
                    }
                    if (e.keyCode === 37) {
                        left = false;
                        index = 0;
                    }
                }

                function drawBlocks() {
                    ctx.beginPath();
                    for (var i = 0; i < obstacles.length; ++i) {
                        ctx.drawImage(obstacle, 0, 0, size, size, (obstacles[i].x - camX / 100) * size, obstacles[i].y * size, obstacles[i].xsize * size, obstacles[i].ysize * size);
                        ctx.fill();
                    }
                    for (i = 0; i < blocks.length; ++i) {
                        ctx.save();
                        ctx.translate(-(camX / 100 * size), 0);
                        ctx.fillStyle = pattern;
                        ctx.fillRect(blocks[i].x * size, blocks[i].y * size, blocks[i].xsize * size, blocks[i].ysize * size);
                        ctx.fill();
                        ctx.restore();
                    }
                    for (i = 0; i < dynamicBlocks.length; ++i) {
                        ctx.save();
                        ctx.translate(-((camX / 100) * size), 0);
                        ctx.fillStyle = dynPattern;
                        ctx.fillRect(dynamicBlocks[i].x * size, dynamicBlocks[i].y * size, dynamicBlocks[i].xsize * size, dynamicBlocks[i].ysize * size);
                        ctx.fill();
                        ctx.restore();
                    }
                    ctx.closePath();
                }

                function drawScore() {
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "20px Arial";
                    ctx.fillText("Score:".concat(score.toString()), 50, 50);
                    ctx.closePath();
                }

                function drawSpike() {
                    ctx.beginPath();
                    ctx.drawImage(spike, posSpike, 0);
                    ctx.closePath();
                    if (go) {
                        ++posSpike;
                        if (posSpike > -10) {
                            posSpike = -10;
                        }
                    }
                }

                function drawSection() {
                    drawBlocks();
                    drawScore();
                    if (!(mustDie || playerPosX - camX < 22 || playerPosY > 1650)) {
                        moveDynamic();
                        drawGuy();
                    }
                    drawSpike();
                }

                function drawGameOver() {
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.font = "40px Palatino";
                    ctx.fillText(score.toString(), (canvas.width / 2 - 20) - (score.toString().length / 2) * 10, canvas.height / 2 - 35);
                    ctx.fillText("Retry?", (canvas.width / 2 - 60), canvas.height / 2 + 30);
                    ctx.closePath();
                }

                function generateMap() {
                    while (blocks.length > 0 && (blocks[0].x - Math.trunc(camX / 100)) * size - ((camX % 100) / 100 * size) < -700) {
                        blocks.shift();
                    }
                    while (dynamicBlocks.length > 0 && (dynamicBlocks[0].x - Math.trunc(camX / 100)) * size - ((camX % 100) / 100 * size) < -700) {
                        dynamicBlocks.shift();
                    }
                    while (obstacles.length > 0 && (obstacles[0].x - Math.trunc(camX / 100)) * size - ((camX % 100) / 100 * size) < -700) {
                        obstacles.shift();
                    }
                    while (x < 40 + Math.trunc(camX / 100)) {
                        if (x === 0) {
                            blocks.push({x: 0, y: 11, xsize: 7, ysize: 1});
                            x += 7;
                        }
                        else {
                            var rand = Math.trunc(Math.random() * 1000) % 8;
                            if (rand === lastBlock) {
                                rand = (rand + 1) % 8;
                            }
                            lastBlock = rand;
                            switch (rand) {
                                case 0: {
                                    blocks.push({x: x, y: 0, xsize: 2, ysize: 1.8});
                                    blocks.push({x: x, y: 3, xsize: 2, ysize: 13});
                                    obstacles.push({x: x + 2, y: 0.8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x - 1, y: 11, xsize: 1, ysize: 1});
                                    blocks.push({x: x + 3, y: 0, xsize: 1, ysize: 10.5});
                                    blocks.push({x: x + 3, y: 12, xsize: 3, ysize: 1});
                                    x += 6;
                                    break;
                                }
                                case 1: {
                                    blocks.push({x: x, y: 0, xsize: 2, ysize: 6});
                                    blocks.push({x: x + 1, y: 6, xsize: 1, ysize: 1.9});
                                    blocks.push({x: x, y: 9, xsize: 3, ysize: 6});
                                    x += 3;
                                    break;
                                }
                                case 2: {
                                    blocks.push({x: x, y: 11, xsize: 7, ysize: 1});
                                    x += 7;
                                    break;
                                }
                                case 3: {
                                    blocks.push({x: x, y: 1, xsize: 1, ysize: 14});
                                    blocks.push({x: x + 1, y: 1, xsize: 4, ysize: 1});
                                    blocks.push({x: x + 6, y: 0, xsize: 1, ysize: 10});
                                    blocks.push({x: x + 2, y: 10, xsize: 7, ysize: 1});
                                    blocks.push({x: x + 1, y: 14, xsize: 1, ysize: 1});
                                    blocks.push({x: x + 6, y: 13, xsize: 4, ysize: 1});
                                    blocks.push({x: x + 8, y: 12.1, xsize: 1, ysize: 0.9});
                                    obstacles.push({x: x + 5, y: 8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 4, y: 9, xsize: 1, ysize: 1});
                                    x += 11;
                                    break;
                                }
                                case 4: {
                                    blocks.push({x: x - 2, y: 4, xsize: 3, ysize: 2});
                                    blocks.push({x: x + 3, y: 8, xsize: 3, ysize: 2});
                                    obstacles.push({x: x + 6, y: 8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 7, y: 8, xsize: 1, ysize: 1});
                                    blocks.push({x: x + 8, y: 1, xsize: 1, ysize: 15});
                                    blocks.push({x: x + 4, y: 1, xsize: 5, ysize: 1});
                                    x += 9;
                                    break;
                                }
                                case 5: {
                                    blocks.push({x: x, y: 13, xsize: 2, ysize: 2});
                                    blocks.push({x: x + 4, y: 8, xsize: 2, ysize: 2});
                                    blocks.push({x: x + 8, y: 3, xsize: 2, ysize: 3});
                                    obstacles.push({x: x + 8, y: 6, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 9, y: 7, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 8, y: 8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 9, y: 9, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 8, y: 10, xsize: 1, ysize: 1});
                                    x += 10;
                                    break;
                                }
                                case 6: {
                                    blocks.push({x: x, y: 0, xsize: 2, ysize: 12.5});
                                    blocks.push({x: x, y: 14, xsize: 2, ysize: 1});
                                    obstacles.push({x: x + 2, y: 1.8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x - 1, y: 14, xsize: 1, ysize: 1});
                                    blocks.push({x: x + 3, y: 0, xsize: 1, ysize: 2.8});
                                    blocks.push({x: x + 3, y: 4, xsize: 1, ysize: 11});
                                    x += 5;
                                    break;
                                }
                                case 7 : {
                                    blocks.push({x: x + 6, y: 4, xsize: 1, ysize: 4});
                                    blocks.push({x: x + 10, y: 2, xsize: 1, ysize: 11});
                                    blocks.push({x: x + 11, y: 12, xsize: 4, ysize: 1});
                                    blocks.push({x: x + 12, y: 0, xsize: 1, ysize: 10.9});
                                    blocks.push({x: x + 14, y: 0, xsize: 1, ysize: 5.8});
                                    blocks.push({x: x + 15, y: 5, xsize: 5, ysize: 0.8});
                                    blocks.push({x: x + 14, y: 7, xsize: 1, ysize: 5});
                                    blocks.push({x: x + 20, y: 5, xsize: 1, ysize: 6.8});
                                    blocks.push({x: x + 25, y: 2, xsize: 1, ysize: 12});
                                    blocks.push({x: x + 20, y: 2, xsize: 5, ysize: 1});
                                    blocks.push({x: x + 32, y: 0, xsize: 1, ysize: 10.9});
                                    blocks.push({x: x + 32, y: 10, xsize: 5, ysize: 1});
                                    blocks.push({x: x + 34, y: 4, xsize: 6, ysize: 1});
                                    blocks.push({x: x + 40, y: 4, xsize: 1, ysize: 9});
                                    obstacles.push({x: x + 37, y: 3.5, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 33, y: 9.5, xsize: 1, ysize: 1});
                                    dynamicBlocks.push({
                                        x: x,
                                        y: 13,
                                        xsize: 5,
                                        ysize: 1,
                                        xspeed: -1,
                                        yspeed: 0,
                                        xmax: x + 50,
                                        ymax: 0,
                                        move: false
                                    });
                                    obstacles.push({x: x, y: 12, xsize: 1, ysize: 1});
                                    obstacles.push({x: x, y: 11, xsize: 1, ysize: 1});
                                    obstacles.push({x: x, y: 10, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 9.5, y: 6, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 13, y: 4, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 19.5, y: 10, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 20.5, y: 10, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 24.5, y: 6, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 28, y: 7, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 28, y: 8, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 28, y: 9, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 45, y: 9, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 49, y: 12, xsize: 1, ysize: 1});
                                    obstacles.push({x: x + 49, y: 11, xsize: 1, ysize: 1});
                                    x += 56;
                                }
                            }
                        }
                        x += (1 + Math.trunc(Math.random() * 1000) % 4);
                    }
                }

                function drawGuy() {
                    var xPos = Math.trunc(playerPosX / 100);
                    var dxPos = ((playerPosX % 100) / 100) * size;
                    var yPos = Math.trunc(playerPosY / 100) + 1;
                    var dyPos = ((playerPosY % 100) / 100) * size;

                    ctx.beginPath();
                    if (!left && !right && vGravite === 0) {
                        ctx.drawImage(player, 0, last * size, 40, 40, (xPos - Math.trunc(camX / 100)) * size + dxPos - ((camX % 100) / 100 * size), (yPos + 1) * size + dyPos - (2 * size), size, size);
                    }
                    else if (vGravite === 0) {
                        ctx.drawImage(player, (1 + index) * size, last * size, 40, 40, (xPos - Math.trunc(camX / 100)) * size + dxPos - ((camX % 100) / 100 * size), (yPos + 1) * size + dyPos - (2 * size), size, size);
                        index = (index + 1) % 7;
                    }
                    else if (vGravite < 0) {
                        ctx.drawImage(player, 8 * size, last * size, 40, 40, (xPos - Math.trunc(camX / 100)) * size + dxPos - ((camX % 100) / 100 * size), (yPos + 1) * size + dyPos - (2 * size), size, size);
                    }
                    else if (vGravite > 0) {
                        ctx.drawImage(player, 9 * size, last * size, 40, 40, (xPos - Math.trunc(camX / 100)) * size + dxPos - ((camX % 100) / 100 * size), (yPos + 1) * size + dyPos - (2 * size), size, size);
                    }
                    ctx.fill();
                    ctx.closePath();
                }

                function calcCollision(x, y) {
                    var rect1 = {x: x, y: y + 100, width: 100, height: 100};
                    for (var i = 0; i < blocks.length; ++i) {
                        var rect2 = {
                            x: blocks[i].x * 100,
                            y: (blocks[i].y + 1) * 100,
                            width: blocks[i].xsize * 100,
                            height: blocks[i].ysize * 100
                        };
                        if (rect1.y < 75 || (rect1.x < rect2.x + rect2.width &&
                            rect1.x + rect1.width > rect2.x &&
                            rect1.y < rect2.y + rect2.height &&
                            rect1.height + rect1.y > rect2.y)) {
                            return (true);
                        }
                    }
                    for (i = 0; i < dynamicBlocks.length; ++i) {
                        rect2 = {
                            x: dynamicBlocks[i].x * 100,
                            y: (dynamicBlocks[i].y + 1) * 100,
                            width: dynamicBlocks[i].xsize * 100,
                            height: dynamicBlocks[i].ysize * 100
                        };
                        if (rect1.y < 75 || (rect1.x < rect2.x + rect2.width &&
                            rect1.x + rect1.width > rect2.x &&
                            rect1.y < rect2.y + rect2.height &&
                            rect1.height + rect1.y > rect2.y)) {
                            dynamicBlocks[i].move = true;
                            return (true);
                        }
                    }
                    for (i = 0; i < obstacles.length; ++i) {
                        rect2 = {
                            x: obstacles[i].x * 100,
                            y: (obstacles[i].y + 1) * 100,
                            width: obstacles[i].xsize * 100,
                            height: obstacles[i].ysize * 100
                        };
                        if (rect1.y < 75 || (rect1.x < rect2.x + rect2.width &&
                            rect1.x + rect1.width > rect2.x &&
                            rect1.y < rect2.y + rect2.height &&
                            rect1.height + rect1.y > rect2.y)) {
                            mustDie = true;
                            return (true);
                        }
                    }
                    return (false);
                }

                function calcGravite() {
                    if (!calcCollision(playerPosX, playerPosY + 1) || !calcCollision(playerPosX, playerPosY + vGravite + gravite)) {
                        vGravite += gravite;
                        var vSave = vGravite;
                        playerPosY += vGravite;
                        if (vGravite < 0 && calcCollision(playerPosX, playerPosY)) {
                            vGravite = 0;
                        }
                        if (calcCollision(playerPosX, playerPosY) && !calcCollision(playerPosX, Math.trunc(playerPosY / 100) * 100)) {
                            playerPosY = Math.trunc(playerPosY / 100) * 100;
                            playerPosY = Math.trunc(playerPosY / 100) * 100;
                        }
                        else if (calcCollision(playerPosX, playerPosY)) {
                            playerPosY -= vSave;
                            vGravite = 0;
                        }
                    }
                    else {
                        vGravite = 0;
                    }
                }

                function move() {
                    if (!(mustDie || playerPosX - camX < 22 || playerPosY > 1650)) {
                        calcGravite();
                        if (right && !calcCollision(playerPosX + 10, playerPosY)) {
                            playerPosX += 10;
                        }
                        if (left && !calcCollision(playerPosX - 10, playerPosY)) {
                            playerPosX -= 10;
                        }
                        if (playerPosX % 10 !== 0) {
                            playerPosX = Math.trunc(playerPosX / 10) * 10;
                        }
                    }
                }

                function moveDynamic() {
                    for (var i = 0; i < dynamicBlocks.length; ++i) {
                        if (dynamicBlocks[i].move) {
                            if (dynamicBlocks[i].x < dynamicBlocks[i].xmax) {
                                var before = calcCollision(playerPosX, playerPosY);
                                if (before) {
                                    mustDie = true;
                                }
                                if (dynamicBlocks[i].xspeed === -1) {
                                    dynamicBlocks[i].x += (dv / 100);
                                }
                                else {
                                    dynamicBlocks[i].x += dynamicBlocks[i].xspeed;
                                }
                                if (!before && calcCollision(playerPosX, playerPosY)) {
                                    playerPosX += 10;
                                }
                            }
                            if (dynamicBlocks[i].y < dynamicBlocks[i].ymax) {
                                dynamicBlocks[i].y += dynamicBlocks[i].yspeed;
                            }
                        }
                    }
                }

                function draw() {
                    if (screen === 0) {
                        ctx.drawImage(backgroundStart, 0, 0);
                        if (space || (click && xCurs > 0 && xCurs < canvas.width && yCurs > 0 && canvas.height)) {
                            x = 0;
                            camX = 0;
                            dv = 0;
                            go = 0;
                            score = 0;
                            posSpike = -32;
                            blocks = [];
                            dynamicBlocks = [];
                            obstacles = [];
                            lastBlock = -1;
                            playerPosX = 300;
                            playerPosY = 100;
                            vGravite = 0;
                            dieIndex = 0;
                            left = false;
                            right = false;
                            space = false;
                            mustDie = false;
                            musicStart.pause();
                            music.load();
                            generateMap();
                            id = setInterval(move, 8);
                            IARuntime.ids.id.push(id);
                            screen = (screen + 1) % 3;
                        }
                    }
                    else if (screen === 1) {
                        ctx.drawImage(background, 0, 0);
                        generateMap();
                        drawSection();
                        if (!(playerPosX - camX < 22 || playerPosY > 1650)) {
                            camX += dv;
                        }
                        dv = go + Math.trunc(score / 500);
                        if (dv > 10) {
                            dv = 10;
                        }
                        if (go !== 0) {
                            music.play();
                            ++score;
                        }
                        if (mustDie || playerPosX - camX < 22 || playerPosY > 1650) {
                            if (dieIndex < 24) {
                                if (dieIndex === 0) {
                                    explosion.load();
                                    explosion.play();
                                }
                                var xPos = Math.trunc(playerPosX / 100);
                                var dxPos = ((playerPosX % 100) / 100) * size;
                                var yPos = Math.trunc(playerPosY / 100) + 1;
                                var dyPos = ((playerPosY % 100) / 100) * size;
                                ctx.drawImage(die, dieIndex * 64, 0, 64, 64, (xPos - Math.trunc(camX / 100)) * size + dxPos - ((camX % 100) / 100 * size) - 24, (yPos + 1) * size + dyPos - (2 * size) - 64, 128, 128);
                                ++dieIndex;
                            }
                            else {
                                music.pause();
                                musicStop.load();
                                musicStop.play();
                                screen = (screen + 1) % 3;
                            }
                        }
                    }
                    else if (screen === 2) {
                        ctx.drawImage(backgroundStop, 0, 0);
                        clearInterval(id);
                        drawGameOver();
                        if (space || (click && xCurs > 0 && xCurs < canvas.width && yCurs > 0 && canvas.height)) {
                            space = false;
                            musicStop.pause();
                            musicStart.load();
                            musicStart.play();
                            screen = (screen + 1) % 3;
                        }
                    }
                    click = false;
                }

                musicStart.load();
                musicStart.play();
                IARuntime.ids.id.push(setInterval(draw, 25));
            };
            scrollerGame();
        })
        flappy.addEventListener("click", function () {
            for (var i = 0; i < IARuntime.ids.id.length; ++i) {
                clearInterval(IARuntime.ids.id[i]);
            }
            for (i = 0; i < IARuntime.ids.idmusic.length; ++i) {
                IARuntime.ids.idmusic[i].pause();
            }
            IARuntime.ids.id = [];
            IARuntime.ids.idmusic = [];
        var flappyGame = function() {
            var canvas = document.getElementById("mycanvas");
            var ctx = canvas.getContext("2d");
            canvas.style.backgroundColor = "white";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var W = canvas.width = 800;
            var H = canvas.height = 600;
            var flapY = 300;
            var flapX = 200
            var flapW = 60;
            var flapH = 60;
            var PipeX = 1500;
            var sizePipeT = 0;
            var sizePipeB = 0;
            var number = 450;
            var min = Math.ceil(50);
            var max = Math.floor(350);
            var TotalSize = 0;
            var tabPipe = [];
            var score = 0;
            var space = false;
            var id= 0;


            for (var i =0; i < 1000; ++i){
                sizePipeT = Math.floor(Math.random()*(max-min))+min;
                tabPipe[i] = sizePipeT;
            }





            // console.log(sizePipeB);
            // console.log(sizePipeT);


            var screen = 0;

            // Velocity y
            var vy = 0;
            var gravity = 0.4;
            var drawFlap = function(){
                if (vy < 0){
                    ctx.beginPath();
                    var img = document.getElementById("style_bird_two");
                    ctx.drawImage(img,flapX,flapY, flapW,flapH);
                    ctx.closePath();
                }else{
                    ctx.beginPath();
                    var img = document.getElementById("style_bird_one");
                    ctx.drawImage(img,flapX,flapY, flapW,flapH);
                    ctx.closePath();
                }

            }
            var moveFlap = function (){
                vy += gravity;
                flapY += vy;
            }
            var movePipe = function (){
                PipeX -= 3;
            }

            var animate = function(){
                movePipe();
                moveFlap();
                if (checkCollision()) {
                    screen = 2;
                    console.log(screen)
                }else{
                    score += 1;
                }
            }
            var gameOver = function (){
                var img=document.getElementById("scream");
                var imgRestart = document.getElementById("restart");
                ctx.fillText("Your Score :"+ score,200,100)
                ctx.drawImage(img,250,275);
                ctx.drawImage(imgRestart,200,330,395,21);


            }
            var drawScore = function (){
                ctx.beginPath();
                ctx.font = "50px Verdana";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText(score,350,580);
                ctx.closePath();
            }

            var drawPipe = function() {
                for (var i = 0; i < 1000; ++i) {

                    ctx.beginPath();
                    ctx.fillStyle = "#015615";
                    ctx.fillRect(PipeX + 500 * i, 0, 70, tabPipe[i]);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.fillStyle = "#015615";
                    ctx.fillRect(PipeX + 500 * i, tabPipe[i] + 200, 70, 600 - (tabPipe[i] + 200));
                    ctx.closePath();


                }

            }
            var drawGame = function (){
                drawFlap();
                drawPipe();
                drawScore();


            }
            var draw = function (){
                ctx.clearRect(0,0,W,H);
                var img=document.getElementById("style_back_game");
                ctx.drawImage(img,0,0);
                if (screen === 0){
                    drawFlap();
                    ctx.beginPath();
                    ctx.fillStyle = "black"
                    ctx.font = "50px Arial";
                    ctx.fillText("Enter Space to Start!", 200,270);
                    ctx.closePath();
                    vy = 0;
                    flapY = 300;
                    score = 0;
                    PipeX = 900;
                    if(space === true){
                        id = setInterval(animate, 10)
                        IARuntime.ids.id.push(id);
                        vy = -8;
                        screen = 1;
                    }


                }else if (screen === 1){

                    drawGame();
                }else if (screen === 2){
                    clearInterval(id);
                    gameOver();
                    if(space){
                        screen = 0;
                    }
                }
                space = false;




            }


            var checkCollision = function () {
                for (var i = 0; i < tabPipe.length; i++) {
                    var rect1 = {x: flapX, y: flapY, width: 60, height: 60};
                    var rect2 = {x: PipeX + 500 * i, y: 0, width: 70, height: tabPipe[i]};
                    var rect3 = {x: PipeX + 500 * i, y: tabPipe[i] + 200, width: 70, height: 1500};


                    if (rect1.x < rect2.x + rect2.width &&
                        rect1.x + rect1.width > rect2.x &&
                        rect1.y < rect2.y + rect2.height &&
                        rect1.height + rect1.y > rect2.y) {
                        return (true)
                    }
                    else if (rect1.x < rect3.x + rect3.width &&
                        rect1.x + rect1.width > rect3.x &&
                        rect1.y < rect3.y + rect3.height &&
                        rect1.height + rect1.y > rect3.y) {
                        return (true)
                    } else if (flapY  >= canvas.height + 60) {
                        return (true)
                    } else if(flapY <= -60){
                        return(true)
                    }
                }
                return false;
            }
            function keyboardBackSpace(e) {
                if (e.keyCode === 32){
                    e.preventDefault();
                    space = true;
                    vy = -8;
                }

            }
            window.addEventListener('keydown', keyboardBackSpace, false);
            IARuntime.ids.id.push(setInterval(draw, 1000/60));
            }
            flappyGame();
        })
    }

    /**
     * runs upon exit
     */
    Play.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Play;
}();
