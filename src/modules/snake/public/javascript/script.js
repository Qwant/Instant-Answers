/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Snake(iaData) {

        // constructor
    }

    /**
     * runs at runtime
     */
    Snake.prototype.run = function () {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        can.style.display = "none";
        cross.style.display = "none";
        play.addEventListener("click", function(){
            if (state === 0){
                elem.style.height = "800px";
                setTimeout(function(){
                    can.style.display = "block";
                    cross.style.display = "block";
                }, 800)
                play.style.cursor = "default";
                scope.game();

                state = 1;
            }
        })
        cross.addEventListener("click", function(){
            if(state === 1){
                elem.style.height = "200px";
                can.style.display = "none";
                cross.style.display = "none";
                setTimeout(function(){
                play.style.cursor = "pointer";
                }, 800)
                state = 0;

            }
        })
    };
    // function that's gonna run at runtime

    Snake.prototype.game = function () {
        var mycanvas = document.getElementById('mycanvas');
        var ctx = mycanvas.getContext('2d');
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



    /**
     * runs upon exit
     */
    Snake.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Snake;
}();