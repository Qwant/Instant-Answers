/*
 *
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
    x = (x / 3) * 3;
    y = (y / 3) * 3;
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

function    bt(grid) {
    ec = get_empty_cell(grid);
    if (ec == null)
        return true; // A solution has been reached
    pool = _.range(1,10);
    shuffle(pool);
    for (i = 0; i < 9; i++) {
        if is_play_valid(grid, ec, pool[i]) {
            var [x, y] = ec;
            grid[y][x] = pool[i];
            var r = bt(grid);
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
    wherex = getRandomInt(0, 9);
    wherey = getRandomInt(0, 9);
    whichn = getRandomInt(1, 10);
    if (is_play_valid(grid, [wherex, wherey], whichn)) {
        grid[y][x] = whichn;
        return true;
    }
    return false;
}

function    randomRemove(grid) {
    x = getRandomInt(0, 9);
    y = getRandomInt(0, 9);
    if (grid[y][x] != 0) {
        grid[y][x] = 0;
        return true;
    }
    return false;
}

function    getSudokuGrid() {
    var grid = [];
    for (i = 0; i < 9; i++) {
        grid[i] = [];
        for (j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }
    i = 0;
    while (i < 8) {
        if (randomInsert(grid))
            i++;
    }
    // Solve it
    bt(grid);
    // Put holes
    i = 0;
    while (i < 2*9**2/3) {
        if (randomRemove(grid))
            i++;
    }
    return (grid);
}
