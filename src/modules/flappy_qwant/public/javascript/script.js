/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Flappy_qwant (iaData) {

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
        var img_gameOver=document.getElementById("scream");
        var img_restart = document.getElementById("restart");
        var img_backGround=document.getElementById("style_back_game");
        var img_birdO=document.getElementById("style_bird_one");
        var img_birdT=document.getElementById("style_bird_two");
        img_birdO.style.display = "none";
        img_restart.style.display = "none";
        img_birdT.style.display = "none";
        img_gameOver.style.display = "none";
        img_backGround.style.display = "none";
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
            console.log(screen);
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
                    id = setInterval(animate, 10);
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
        // var intervalAnime = setInterval(animate, 10);
        var idInterval = setInterval(draw, 1000/60);
        return (idInterval);

    }


    return Flappy_qwant;
}();