/**
 * This is your main script file. Please refer to the documentation for more information.
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


var IARuntime = function() {
    function Sudoku (iaData) {
        // constructor
    //}
    //var Shuffle = function() {
        //var a[81];
        var a = [];
        var table = document.getElementById("dokutab");
        for (var i=0, row; row=table.rows[i]; i++) {
            for (var j=0, col; col=row.cells[j]; j++) {
                a[9*i + j] = col.innerText;
            }
        }
        for (var i=0; i<getRandomInt(3,20); i++)
        {
            fi = getRandomInt(0,3);
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
                //}
                default:break;
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
                    /*
                case 3: this.shuffeDiagMin();break;
                */
            }
        }
        for (var i=0, row; row=table.rows[i]; i++) {
            for (var j=0, col; col=row.cells[j]; j++) {
                col.innerText = a[9*i + j];
            }
        }
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

    };

    /**
     * runs upon exit
     */
    Sudoku.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Sudoku;
}();
