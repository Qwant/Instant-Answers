/**
 * This is your main script file. Please refer to the documentation for more information.
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
        //console.log(bh);
        //console.log(bv);
    }
    for (var i=0; i<3; i++) {
        for (var j=0; j<3; j++) {
            var b = 0;
            for (var k=0; k<3; k++) {
                for (var l=0; l<3; l++) {
                    b |= (1 << table.rows[i*3 + k].cells[j*3 + l].innerText);
                    //b += table.rows[i*3 + k].cells[j*3 + l].innerText;
                }
            }
            if (b != 1022)
                return false;
            //console.log(b);
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
        //var a[81];
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
                    //Sudoku.prototype.shuffleVertical = function() {
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
	//document.alert("test");
        var table = document.getElementById("dokutab");
        /*for (var i=0, row; row=table.rows[i]; i++) {
            for (var j=0, col; col=row.cells[j]; j++) {
                col.innerText=(1+i)*(1+j);//"%d"%(i+j);
                console.log(col);
            }
        }*/
        Shuffle();

        var btn = document.getElementById("dokucheck");
        btn.addEventListener('click', function(e){
            r = checkGrid();
            if (r) {
                btn.innerText = "Great!";
            }
            else {
                btn.innerText = "Nope. :(";
            }
        });
        
        //table.addEventListener('click', function(e){
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
