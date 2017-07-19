/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Minesweeper (iaData) {

    }

    /**
     * runs at runtime
     */
    Minesweeper.prototype.run = function() {
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
    Minesweeper.prototype.stop = function() {

    };

    Minesweeper.prototype.game = function () {
        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
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

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX - canvas.offsetLeft;
            yCurs = e.pageY - canvas.offsetTop;
        });
        window.addEventListener('mousedown', function (e) {
            if(e.button === 1 || e.button === 0){
                e.preventDefault();
                click = true;
            }
        }, false);
        window.addEventListener('mouseup', function (e) {
            if(e.button === 1 || e.button === 0){
                click = false;
            }
            else {
                rightClick = false;
            }
        }, false);
        window.addEventListener('contextmenu', function(e) {
            if (screen !== 1) {
                return;
            }
            e.preventDefault();
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
                        if (columns.length > 0 ) {
                            columns = columns.slice(0, -1);
                        }
                        break;
                    }
                    case 2: {
                        if (rows.length > 0 ) {
                            rows = rows.slice(0, -1);
                        }
                        break;
                    }
                    case 3: {
                        if (nbMines.length > 0 ) {
                            nbMines = nbMines.slice(0, -1);
                        }
                        break;
                    }
                }
            }
            if (e.keyCode >= 96 && e.keyCode <= 105) {
                switch (cursor) {
                    case 1: {
                        if (columns.length < 2 ) {
                            columns += String.fromCharCode(e.keyCode - 48);
                        }
                        break;
                    }
                    case 2: {
                        if (rows.length < 2 ) {
                            rows += String.fromCharCode(e.keyCode - 48);
                        }
                        break;
                    }
                    case 3: {
                        if (nbMines.length < 3 ) {
                            nbMines += String.fromCharCode(e.keyCode - 48);
                        }
                        break;
                    }
                }
            }
            else if (e.keyCode >= 48 && e.keyCode <= 57) {
                switch (cursor) {
                    case 1: {
                        if (columns.length < 2 ) {
                            columns += String.fromCharCode(e.keyCode);
                        }
                        break;
                    }
                    case 2: {
                        if (rows.length < 2 ) {
                            rows += String.fromCharCode(e.keyCode);
                        }
                        break;
                    }
                    case 3: {
                        if (nbMines.length < 3 ) {
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
            if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
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
                    newRow.push({value : 0, status: 0});
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
            if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
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
            if (x < 0 || y < 0 || x >= intColumns || y >= intRows) {
                return;
            }
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
                    if (!intNbMines || intNbMines < 5 || intNbMines >= intRows * intColumns) {
                        intNbMines = Math.trunc(intRows * intColumns / 4);
                    }
                    tile = Math.trunc((canvas.width - 2) / intColumns);
                    if (tile > Math.trunc((canvas.height - 102) / intRows)) {
                        tile = Math.trunc((canvas.height - 102) / intRows);
                    }
                    startX = (canvas.width - (tile * intColumns)) / 2;
                    startY = (canvas.height - (tile * intRows)) / 2;
                    gameOver = 0;
                    generateGame();
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
        var idInterval = setInterval(draw, 10);
        return (idInterval);
    };
    return Minesweeper;
}();