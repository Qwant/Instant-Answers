/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Flappy_qwant (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Flappy_qwant.prototype.run = function() {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        var idInterval = 0;
        can.style.display = "none";
        cross.style.display = "none";
        play.addEventListener("click", function(){
            if (state === 0){
                elem.style.height = "800px";
                setTimeout(function(){
                    can.style.display = "block";
                    cross.style.display = "block";
                }, 800);
                play.style.cursor = "default";
                play.style.display = "none";
                idInterval = scope.game();
                state = 1;
            }
        });
        cross.addEventListener("click", function(){
            if(state === 1){
                elem.style.height = "200px";
                can.style.display = "none";
                cross.style.display = "none";
                setTimeout(function(){
                    play.style.cursor = "pointer";
                }, 800);
                state = 0;
                play.style.display = "block";
                clearInterval(idInterval);
            }
        })
    };

    /**
     * runs upon exit
     */
    Flappy_qwant.prototype.stop = function() {
        // function that's gonna run upon exit
    };
    Flappy_qwant.prototype.game = function() {
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        var W = canvas.width = 800;
        var H = canvas.height = 600;
        var flapY = 0;
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
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillRect(flapX,flapY, flapW,flapH);
            ctx.closePath();
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
                gameOver();
            }
        }
        var gameOver = function (){
            clearInterval(idInterval);
            ctx.fillStyle = "white";
            ctx.font="50px Verdana";
            ctx.fillText("GAME OVER!!",250,300);

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


        }
        var draw = function (){
            if (flapY  >= canvas.height) {
                flapY = 540;
                // traction here
            }
            ctx.clearRect(0,0,W,H);

            drawGame();



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
                }
            }
            return false;
        }
        function keyboardBackSpace(e) {
            if (e.keyCode === 32){
                e.preventDefault();
                vy = -8;
            }

        }
        window.addEventListener('keydown', keyboardBackSpace, false);
        setInterval(animate, 10);
        var idInterval = setInterval(draw, 1000/60);
        return

    }


    return Flappy_qwant;
}();