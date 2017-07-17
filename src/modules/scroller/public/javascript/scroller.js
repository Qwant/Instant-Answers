var IARuntime = function() {
    function Scroller (iaData) {
    }

    Scroller.prototype.run = function() {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        var item = 0;
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
                item = scope.game();
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
                clearInterval(item.id);
                item.musicStart.pause();
                item.music.pause();
                item.musicStop.pause();
            }
        })
    };

    Scroller.prototype.stop = function() {

    };

    Scroller.prototype.game = function() {
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
        var spike = document.getElementById("spike");
        var pattern = ctx.createPattern(block, "repeat");
        var player = document.getElementById("player");
        var die = document.getElementById("die");
        var index = 0;
        var last = 0;
        var go = 0;
        var posSpike = -32;
        var dieIndex = 0;
        var explosion = document.getElementById("explosion");
        var mustDie = false;

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
            go = 4;
            if(e.keyCode === 39) {
                right = true;
                last = 0;
            }
            if(e.keyCode === 37) {
                left = true;
                last = 1;
            }
            if (e.keyCode === 32) {
                space = true;
                if (vGravite === 0 || calcCollision(playerPosX + 5, playerPosY) || calcCollision(playerPosX - 5, playerPosY)) {
                    vGravite = -15;
                }
            }
        }

        function keyUpHandler(e) {
            if (screen !==1) {
                return;
            }
            e.preventDefault();
            if(e.keyCode === 39) {
                right = false;
                index = 0;
            }
            if(e.keyCode === 37) {
                left = false;
                index = 0;
            }
            if (e.keyCode === 32) {
                space = false;
            }
        }

        function drawBlocks() {
            ctx.beginPath();
            for (var i = 0; i < blocks.length; ++i) {
                ctx.save();
                ctx.translate(-(camX / 100 * size), 0);
                ctx.fillStyle = pattern;
                ctx.fillRect(blocks[i].x * size, blocks[i].y * size, blocks[i].xsize * size, blocks[i].ysize * size);
                ctx.fill();
                ctx.restore();
            }
            for (i = 0; i < dynamicBlocks.length; ++i) {
                ctx.save();
                ctx.translate(-(camX / 100 * size), 0);
                ctx.fillStyle = pattern;
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
            while (x < 40 + Math.trunc(camX / 100)) {
                if (x === 0) {
                    blocks.push({x : 0, y : 11, xsize : 7, ysize : 1});
                    x += 4;
                }
                else {
                    var rand = Math.trunc(Math.random() * 1000) % 8;
                    if (rand === lastBlock) {
                        rand = (rand + 1) % 8;
                    }
                    lastBlock = rand;
                    switch (rand) {
                        case 0: {
                            blocks.push({x : x, y : 0, xsize : 2, ysize : 1.8});
                            blocks.push({x : x, y : 3, xsize : 2, ysize : 13});
                            blocks.push({x : x + 3, y : 0, xsize : 1, ysize : 10.5});
                            blocks.push({x : x + 3, y : 12, xsize : 3, ysize : 1});
                            x += 6;
                            break;
                        }
                        case 1: {
                            blocks.push({x : x, y : 0, xsize : 2, ysize : 6});
                            blocks.push({x : x + 1, y : 6, xsize : 1, ysize : 1.9});
                            blocks.push({x : x, y : 9, xsize : 3, ysize : 6});
                            x += 3;
                            break;
                        }
                        case 2: {
                            blocks.push({x : x, y : 11 ,xsize : 7, ysize : 1});
                            x += 7;
                            break;
                        }
                        case 3: {
                            blocks.push({x : x, y : 1, xsize : 1, ysize : 14});
                            blocks.push({x : x + 1, y : 1, xsize : 4, ysize : 1});
                            blocks.push({x : x + 6, y : 0, xsize : 1, ysize : 10});
                            blocks.push({x : x + 2, y : 10, xsize : 7, ysize : 1});
                            blocks.push({x : x + 1, y : 14, xsize : 1, ysize : 1});
                            blocks.push({x : x + 6, y : 13, xsize : 4, ysize : 1});
                            blocks.push({x : x + 8, y : 12.1, xsize : 1, ysize : 0.9});
                            x += 11;
                            break;
                        }
                        case 4: {
                            blocks.push({x : x - 2, y : 4, xsize : 3, ysize : 2});
                            blocks.push({x : x + 3, y : 8, xsize : 3, ysize : 2});
                            blocks.push({x : x + 8, y : 1, xsize : 1, ysize : 15});
                            blocks.push({x : x + 4, y : 1, xsize : 5, ysize : 1});
                            x += 9;
                            break;
                        }
                        case 5: {
                            blocks.push({x : x, y : 13, xsize : 2, ysize : 2});
                            blocks.push({x : x + 4, y : 8, xsize : 2, ysize : 2});
                            blocks.push({x : x + 8, y : 3, xsize : 2, ysize : 3});
                            x += 10;
                            break;
                        }
                        case 6: {
                            blocks.push({x : x, y : 0, xsize : 2, ysize : 12.5});
                            blocks.push({x : x, y : 14, xsize : 2, ysize : 1});
                            blocks.push({x : x + 3, y : 0, xsize : 1, ysize : 2.8});
                            blocks.push({x : x + 3, y : 4, xsize : 1, ysize : 11});
                            x += 5;
                            break;
                        }
                        case 7 : {
                            blocks.push({x : x + 10, y : 2, xsize : 1, ysize : 11});
                            blocks.push({x : x + 11, y : 12, xsize : 4, ysize : 1});
                            blocks.push({x : x + 12, y : 0, xsize : 1, ysize : 10.9});
                            blocks.push({x : x + 14, y : 0, xsize : 1, ysize : 5.8});
                            blocks.push({x : x + 15, y : 5, xsize : 5, ysize : 0.8});
                            blocks.push({x : x + 14, y : 7, xsize : 1, ysize : 5});
                            blocks.push({x : x + 20, y : 5, xsize : 1, ysize : 6.8});
                            blocks.push({x : x + 25, y : 2, xsize : 1, ysize : 12});
                            blocks.push({x : x + 20, y : 2, xsize : 5, ysize : 1});


                            blocks.push({x : x + 32, y : 0, xsize : 1, ysize : 10.9});
                            blocks.push({x : x + 32, y : 9.9, xsize : 5, ysize : 1});
                            blocks.push({x : x + 34, y : 4, xsize : 6, ysize : 1});
                            blocks.push({x : x + 40, y : 4, xsize : 1, ysize : 9});
                            dynamicBlocks.push({x : x, y : 13, xsize : 5, ysize: 1, xspeed: -1, yspeed: 0, xmax : x + 50, ymax : 0, move : false});
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
                var rect2 = {x: blocks[i].x * 100, y: (blocks[i].y + 1) * 100, width: blocks[i].xsize * 100, height: blocks[i].ysize * 100};
                if (rect1.y < 75 || (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.height + rect1.y > rect2.y)) {
                    return (true);
                }
            }
            for (i = 0; i < dynamicBlocks.length; ++i) {
                rect2 = {x: dynamicBlocks[i].x * 100, y: (dynamicBlocks[i].y + 1) * 100, width: dynamicBlocks[i].xsize * 100, height: dynamicBlocks[i].ysize * 100};
                if (rect1.y < 75 || (rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.height + rect1.y > rect2.y)) {
                    dynamicBlocks[i].move = true;
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
            if (!(playerPosX - camX < 22 || playerPosY > 1650)) {
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
                    id   = setInterval(move, 8);
                    screen = (screen + 1) % 3;
                }
            }
            else if (screen === 1) {
                ctx.drawImage(background, 0, 0);
                generateMap();
                moveDynamic();
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
        var idInterval = setInterval(draw, 25);
        return ( {id: idInterval, musicStart: musicStart, music: music, musicStop: musicStop});
    };
    return Scroller;
}();