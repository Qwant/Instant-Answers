/**
 * This is your main script file. Please refer to the documentation for more information.
 */
function    get_empty_cell(grid)
{
    for (i=0; i<9; i++) {
        for (j=0; j<9; j++) {
            if (grid[i][j] == 0)
                return [j, i];
        }
    }
    return null
}

function    is_play_valid(grid, ec, p) {
    var [x, y] = ec;
    for (i = 0; i < 9; i++) {
        if (grid[y][i] == p)
            return false;
        if (grid[i][x] == p)
            return false;
    }
    x = Math.floor(x / 3) * 3;
    y = Math.floor(y / 3) * 3;
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            if (grid[y + i][x + j] == p)
                return false;
        }
    }
    return true;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function    bt(grid, r) {
    if (r > 999)
        return true;
    ec = get_empty_cell(grid);
    if (ec == null)
        return true; // A solution has been reached
    //pool = _.range(1,10);
    pool = [1,2,3,4,5,6,7,8,9];
    shuffle(pool);
    for (i = 0; i < 9; i++) {
        if (is_play_valid(grid, ec, pool[i])) {
            var [x, y] = ec;
            grid[y][x] = pool[i];
            var r = bt(grid, r + 1);
            if (r)
                return true;
            else
                grid[y][x] = 0;
        }
    }
    return false;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function    randomInsert(grid) {
    wherex = getRandomInt(0, 8);
    wherey = getRandomInt(0, 8);
    whichn = getRandomInt(1, 9);
    if (is_play_valid(grid, [wherex, wherey], whichn)) {
        grid[wherey][wherex] = whichn;
        return true;
    }
    return false;
}

function    randomRemove(grid) {
    x = getRandomInt(0, 8);
    y = getRandomInt(0, 8);
    if (grid[y][x] != 0) {
        grid[y][x] = 0;
        return true;
    }
    return false;
}

function    dbgDisp(grid) {
    for (i=0;i<9;i++)
    {
        console.log(grid[i]);
    }
}

function    getSudokuGrid() {
    var grid = [];
    for (i = 0; i < 9; i++) {
        grid[i] = [];
        console.log(grid);
        for (j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
        console.log(grid);
    }
    console.log("Empty grid:");
    dbgDisp(grid);
    var i = 0;
    while (i < 8) {
        console.log("RandomInsert");
        if (randomInsert(grid))
            i++;
    }
    dbgDisp(grid);
    // Solve it
    if (!bt(grid, 0))
        return null;
    else
        console.log("solved!");
    // Put holes
    dbgDisp(grid);
    i = 0;
    j = 0;
    while (i < 2*9**2/3) {
        if (randomRemove(grid))
            i++;
        j++;
        if (j > 10 * 2*9**2/3)
            break;
    }
    return (grid);
}

function checkGrid() {
    var table = document.getElementById("dokutab");
    for (var i=0; i<9; i++) {
        var bh = 0, bv = 0;
        for (var j=0; j<9; j++) {
            bh |= (1 << table.rows[i].cells[j].innerText)
                //bv |= table.rows[i].cells[j];
                bv |= (1 << table.rows[j].cells[i].innerText)
                /*if (bh != 1022) {
                  table.rows[i].style.backgroundColor = "red";
                  return false;
                  }
                  if (bv != 1022) {
                  table.rows[j].style.backgroundColor = "red";
                  return false;
                  }*/
                if (bh != 1022 || bv != 1022)
                    return false;
            //colorer la ligne/col
        }
    }
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            var b = 0;
            for (var k=0; k<3; k++) {
                for (var l=0; l<3; l++) {
                    b |= (1 << table.rows[i*3 + k].cells[j*3 + l].innerText);
                }
            }
            if (b != 1022)
                return false;
        }
    }
    return true;
}

function ClearPlays() {
    var table = document.getElementById("dokutab");
    for (var i=0; i<9; i++) {
        var bh = 0, bv = 0;
        for (var j=0; j<9; j++) {
            if (table.rows[i].cells[j].style.fontWeight == "normal") {
                table.rows[i].cells[j].innerText = "";
            }
        }
    } 
}

function Shuffle() {
    var a = [];
    var table = document.getElementById("dokutab");
    for (var i=0, row; row=table.rows[i]; i++) {
        for (var j=0, col; col=row.cells[j]; j++) {
            a[9*i + j] = col.innerText;
        }
    }
    for (var i=0; i<getRandomInt(10,50); i++)
    {
        fi = getRandomInt(0,4);
        switch (fi) {
            case 0: //this.shuffleVertical();break;
                for (var i=0; i<81; i++) {
                    if (i % 9 < 4) {
                        var tmp = a[i];
                        div9 = Math.floor(i / 9);
                        tmpIx = (9 * div9 + 8) - (i - (9 * div9));
                        a[i] = a[tmpIx];
                        a[tmpIx] = tmp;
                    }
                }
                break;
            case 1: //this.shuffleHorizontal();break;
                for (var i=0; i<81; i++) {
                    if (Math.floor(i / 9) < 4) {
                        mod9 = Math.floor(i % 9);
                        div9 = Math.floor(i / 9);
                        tmp = a[i];
                        tmpIx = mod9 + (8 - div9) * 9;
                        a[i] = a[tmpIx];
                        a[tmpIx] = tmp;
                    }
                }
                break;
            case 2: //this.shuffleDiagMaj();break;
                for (var i=0; i<81; i++) {
                    if ((Math.floor(i / 9) + (i % 9)) < 8) {
                        mod9 = Math.floor(i % 9);
                        div9 = Math.floor(i / 9);
                        tmp = a[i];
                        tmpIx = (8 - mod9) * 9 + 8 - div9;
                        a[i] = a[tmpIx];
                        a[tmpIx] = tmp;
                    }
                }
                break;
            case 3: //this.shuffeDiagMin();break;
                for (var i=0; i<81; i++) {
                    if (Math.floor(i / 9) < i % 9) {
                        mod9 = Math.floor(i % 9);
                        div9 = Math.floor(i / 9);
                        tmp = a[i];
                        tmpIx = div9 + mod9 * 9;
                        a[i] = a[tmpIx];
                        a[tmpIx] = tmp;
                    }
                }
        }
    }
    for (var i=0, row; row=table.rows[i]; i++) {
        for (var j=0, col; col=row.cells[j]; j++) {
            col.innerText = a[9*i + j];
            col.style.fontWeight = "bold";
        }
    }
}

var IARuntime = function() {
    function Sudoku (iaData) {
        // constructor
        //}
};

/**
 * runs at runtime
 */
Sudoku.prototype.run = function() {
    // function that's gonna run at runtime
    var table = document.getElementById("dokutab");
    Shuffle();

    getSudokuGrid();

    var btn = document.getElementById("dokucheck");
    var sts = document.getElementById("dokustatus");
    btn.addEventListener('click', function(e){
        r = checkGrid();
        if (r) {
            sts.innerText = "Great!";
        }
        else {
            sts.innerText = "Nope. :(";
            var tmr = setInterval(restSts, 2000);
            function restSts() {
                sts.innerText = "Try again!";
                clearInterval(tmr);
            }
        }
    });

    table.addEventListener('mouseup', function(e){
        console.log(e);
        console.log(e.target);
        //if (e.target.innerText=="" || e.target.style.color == "red") {
        if (e.target.innerText=="" || e.target.style.fontWeight == "normal") {
            if (e.button != 2 /* right */) {
                if (e.target.innerText < 9)
                    e.target.innerText++;
                else
                    e.target.innerText = "";
            }
            else {
                if (e.target.innerText > 1)
                    e.target.innerText--;
                else
                    e.target.innerText = "";
            }
            //e.target.style.color = "red";
            e.target.style.fontWeight = "normal";
        }
    });

    var btnnew = document.getElementById("dokunew");
    btnnew.addEventListener('click', function(e){
        ClearPlays();
        Shuffle();
        sts.innerHTML = "Status: playing";
    });

    };

    /**
     * runs upon exit
     */
    Sudoku.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Sudoku;
}();
