/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Play (iaData) {
        // constructor
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
                    can.sty
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
                setTimeout(function(){
                    play.style.cursor = "pointer";
                }, 800)
                state = 0;
                play.style.display = "block";

            }
        })
    };
    Play.prototype.qwantsole = function (){
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://fonts.googleapis.com/css?family=Press+Start+2P';
        document.getElementsByTagName('head')[0].appendChild(link);
        var image = new Image;
        image.src = link.href;
        image.onerror = function() {
            ctx.fillStyle="#FFFFFF";
            ctx.font = '15px "Press Start 2P"';
            var textString = "INSERT COIN 0",
                textWidth = ctx.measureText(textString ).width;
            ctx.fillText(textString , (canvas.width/2) - (textWidth / 2), 300);
        };
        var color = document.getElementById("insert_color");
        var snake = document.getElementById("insert_snake");
        var tetris = document.getElementById("insert_tetris");
        var morpion = document.getElementById("insert_morpion");


        color.addEventListener("click",function(){
           var colorGame = function() {

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
                            return ({ r : 85, g : 170, b : 85});
                        case 1:
                            return ({ r : 170, g : 85, b : 85});
                        case 2:
                            return ({ r : 85, g : 85, b : 170});
                        case 3:
                            return ({ r : 170, g : 170, b : 85});
                        case 4:
                            return ({ r : 85, g : 170, b : 170});
                        case 5:
                            return ({ r : 170, g : 85, b : 170});
                        case 6:
                            return ({ r : 85, g : 85, b : 85});
                        default:
                            return ({ r : 170, g : 170, b : 170});
                    }
                }

                function rgb(r, g, b){
                    return "rgb("+r+","+g+","+b+")";
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
                            row    = 2;
                            column = 2;
                            level  = 1;
                            pos    = Math.trunc(Math.random() * 10000) % (row * column);
                            color  = randomColor();
                            screen = (screen + 1) % 3;
                            lumi   = Math.trunc(Math.random() * 10000) % 2;
                            start  = new Date();
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
                            pos   = Math.trunc(Math.random() * 10000) % (row * column);
                            color = randomColor();
                            lumi  = Math.trunc(Math.random() * 10000) % 2;
                            if (level === 50) {
                                screen = (screen + 1) % 3;
                            }
                        }
                        if (x >= 600 && x < 800 && y >= 300 && y < 600 && click) {
                            row    = 2;
                            column = 2;
                            level  = 1;
                            pos    = Math.trunc(Math.random() * 10000) % (row * column);
                            color  = randomColor();
                            lumi   = Math.trunc(Math.random() * 10000) % 2;
                            start  = new Date();
                        }
                    }
                    else if (screen === 2) {
                        drawEnd();
                        if (x >= canvas.width / 3 && x < 2 * canvas.width / 3 && y >= canvas.height / 3 && y < 2 * canvas.height / 3 && click) {
                            row    = 2;
                            column = 2;
                            pos    = Math.trunc(Math.random() * 10000) % (row * column);
                            color  = randomColor();
                            screen = (screen + 1) % 3;
                            lumi   = Math.trunc(Math.random() * 10000) % 2;
                        }
                    }
                    click = false;
                }
                var idInteverval = setInterval(draw, 10);
                return (idInteverval);
            };
            colorGame();
        })
        snake.addEventListener("click",function(){
            var snakeGame = function () {
                var mycanvas = document.getElementById('mycanvas');
                var ctx = mycanvas.getContext('2d');
                canvas.style.backgroundColor = "white";
                ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                var snakeSize = 10;
                mycanvas.width = 800;
                mycanvas.height = 600;
                var w = 800;
                var h = 600;
                var score = 0;
                var snake;
                var food;
                var bonbon;
                var screen = 0;
                var gameloop;

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
                }

                var scoreText = function () {
                    var score_text = "Score: " + score;
                    ctx.font = '8pt Calibri,Geneva,Arial';
                    ctx.fillStyle = 'blue';
                    ctx.fillText(score_text, 145, h - 5);
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
                        //restart game
                        gameOver();
                    }

                    if (snakeX == food.x && snakeY == food.y) {
                        var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
                        score++;

                        createFood(); //Create new food
                    } else if (snakeX == bonbon.x && snakeY == bonbon.y) {
                        var tail = {x: snakeX, y: snakeY}; //Create a new head instead of moving the tail
                        score += 10;
                        createBonus(); //Create new food
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
                var gameOver = function() {
                    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                    gameloop = clearInterval(gameloop);
                    ctx.fillStyle = "#000000";
                    ctx.font = '20pt Calibri,Geneva,Arial';

                    var textString = "GAMEOVER!!!\n Click To Restart",
                        textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, (mycanvas.width / 2) - (textWidth / 2), 300);
                    screen = 2;
                }
                var start = function () {
                    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                    ctx.fillStyle = "#000000";
                    ctx.font = '20pt Calibri,Geneva,Arial';
                    var textString = "Start",
                        textWidth = ctx.measureText(textString).width;
                    ctx.fillText(textString, (mycanvas.width / 2) - (textWidth / 2), 300);

                }

                var createFood = function () {
                    food = {
                        x: Math.floor((Math.random() * 50) + 1),
                        y: Math.floor((Math.random() * 50) + 1)
                    }

                    for (var i = 0; i > snake.length; i++) {
                        var snakeX = snake[i].x;
                        var snakeY = snake[i].y;

                        if (food.x === snakeX && food.y === snakeY || food.y === snakeY && food.x === snakeX) {
                            food.x = Math.floor((Math.random() * 50) + 1);
                            food.y = Math.floor((Math.random() * 50) + 1);
                        }
                    }
                }
                var createBonus = function () {
                    bonbon = {
                        x: Math.floor((Math.random() * 50) + 1),
                        y: Math.floor((Math.random() * 50) + 1)
                    }

                    for (var i = 0; i > snake.length; i++) {
                        var snakeX = snake[i].x;
                        var snakeY = snake[i].y;

                        if (bonbon.x === snakeX && bonbon.y === snakeY || bonbon.y === snakeY && bonbon.x === snakeX) {
                            setTimeout(function () {
                                bonbon.x = Math.floor((Math.random() * 50) + 1);
                                bonbon.y = Math.floor((Math.random() * 50) + 1);
                            }, 500)
                        }
                    }
                }

                var checkCollision = function (x, y, array) {
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].x === x && array[i].y === y){
                            return true;
                        }

                    }
                    return false;
                }
                ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
                start();
                mycanvas.addEventListener("click",function(e){
                    var x = e.pageX - mycanvas.offsetLeft;
                    var y = e.pageY - mycanvas.offsetTop;
                    if (screen === 0) {
                        screen = 1;
                        direction = 'down';
                        score = 0;
                        drawSnake();
                        createFood();
                        createBonus();

                        gameloop = setInterval(paint, 80);
                        window.addEventListener("keydown", keyDownHandler, false);

                    } else if(screen === 2){
                        screen = 0;
                        start();
                    }


                })




                function keyDownHandler(e) {

                    switch (e.keyCode) {

                        case 37:
                            if (direction != 'right') {
                                e.preventDefault();
                                direction = 'left';
                            }
                            console.log('left');
                            break;

                        case 39:
                            if (direction != 'left') {
                                e.preventDefault();
                                direction = 'right';
                                console.log('right');
                            }
                            break;

                        case 38:
                            if (direction != 'down') {
                                e.preventDefault();
                                direction = 'up';
                                console.log('up');
                            }
                            break;

                        case 40:
                            if (direction != 'up') {
                                e.preventDefault();
                                direction = 'down';
                                console.log('down');
                            }
                            break;
                    }
                }
            };
            snakeGame();

        })
        tetris.addEventListener("click",function(){
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
                var idInterval = setInterval(draw, 10);
                return (idInterval);
            };
            tetrisGame();
        })
        morpion.addEventListener("click",function(){
            var morpionGame = function() {
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
                var idInterval = setInterval(draw, 10);
                return (idInterval);
            };
            morpionGame();

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
