/**
 * This is your main script file. Please refer to the documentation for more information.
 */
function    get_empty_cell(grid)
{
    for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
            if (grid[i][j] == 0)
                return [j, i];
        }
    }
    return null
}

function    is_play_valid(grid, ec, p) {
    var [x, y] = ec;
    for (var i = 0; i < 9; i++) {
        if (grid[y][i] == p)
            return false;
        if (grid[i][x] == p)
            return false;
    }
    x = Math.floor(x / 3) * 3;
    y = Math.floor(y / 3) * 3;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
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

function    bt(grid, rec) {
    if (rec > 999)
        return true;
    ec = get_empty_cell(grid);
    if (ec == null)
        return true; // No empty cell left, a solution has been reached!
    pool = [1,2,3,4,5,6,7,8,9];
    shuffle(pool);
    for (var i = 0; i < 9; i++) {
        if (is_play_valid(grid, ec, pool[i])) {
            var [x, y] = ec;
            grid[y][x] = pool[i];
            var r = bt(grid, rec + 1);
            if (r)
                return true;
            else
                grid[y][x] = 0;
        }
    }
    return false;
}

function    getRandomInt (min, max) {
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
    for (var i=0;i<9;i++)
    {
        console.log(grid[i]);
    }
}

function    getSudokuGrid() {
    var grid = [];
    for (var i = 0; i < 9; i++) {
        grid[i] = [];
        for (var j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }
    var i = 0;
    while (i < 0) {
        if (randomInsert(grid))
            i++;
    }
    dbgDisp(grid);
    // Solve it
    if (!bt(grid, 0)) {
        return null;
    }
    // Put holes
    i = 0;
    j = 0;
    rmn = 2*9**2/3;
    while (i < rmn) {
        if (randomRemove(grid))
            i++;
        j++;
        if (j > 10 * rmn)
            break;
    }
    return (grid);
}

function checkGrid() {
    var table = document.getElementById("dokutab");
    for (var i=0; i<9; i++) {
        var bh = 0, bv = 0;
        for (var j=0; j<9; j++) {
            bh |= (1 << table.rows[i].cells[j].innerText);
            bv |= (1 << table.rows[j].cells[i].innerText);
        }
        if (bh != 1022 || bv != 1022)
            return false;
        // TODO: Redify bad number
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

function    grid2table(g, tab)
{
    for (var i=0; i<9; i++) {
        for (var j=0; j<9; j++) {
            if (g[i][j]) {
                tab.rows[j].cells[i].innerText = g[i][j];
                tab.rows[j].cells[i].style.fontWeight = "bold";
                tab.rows[j].cells[i].style.color = "black";
                tab.rows[j].cells[i].setAttribute("class", "number");
            }
            else {
                tab.rows[j].cells[i].innerText = '';
                tab.rows[j].cells[i].style.fontWeight = "normal";
                tab.rows[j].cells[i].style.color = "#888888";
                tab.rows[j].cells[i].setAttribute("class", "empty");
            }
        }
    }
}

function    Generate() {
    var table = document.getElementById("dokutab");

    g = getSudokuGrid();
    console.log(g);
    if (g) {
        grid2table(g, table);
    }
}

var IARuntime = function() {
    function Sudoku (iaData) {
        // constructor
    }
    /**
     * runs at runtime
     */
    Sudoku.prototype.run = function() {
        // function that's gonna run at runtime
        var table = document.getElementById("dokutab");
        var btn = document.getElementById("dokucheck");
        var sts = document.getElementById("dokustatus");

        Generate();
        btn.addEventListener('click', function(e) {
            r = checkGrid();
            if (r) {
                sts.innerText = "Great!";
            }
            else {
                sts.innerText = "Nope. :(";
                var tmr = setInterval(restSts, 1000);
                function restSts() {
                    sts.innerText = "Try again!";
                    clearInterval(tmr);
                }
            }
        });

        table.addEventListener('mouseup', function(e){
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
                e.target.style.fontWeight = "normal";
            }
        });

        var btnnew = document.getElementById("dokunew");
        btnnew.addEventListener('click', function(e){
            Generate();
            //ClearPlays();
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
