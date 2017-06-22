/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Morpion (iaData) {
        this.id = [];
        this.id[0] = document.getElementById('morpion--case1');
        this.id[1] = document.getElementById('morpion--case2');
        this.id[2] = document.getElementById('morpion--case3');
        this.id[3] = document.getElementById('morpion--case4');
        this.id[4] = document.getElementById('morpion--case5');
        this.id[5] = document.getElementById('morpion--case6');
        this.id[6] = document.getElementById('morpion--case7');
        this.id[7] = document.getElementById('morpion--case8');
        this.id[8] = document.getElementById('morpion--case9');
    }

    /**
     * runs at runtime
     */
    Morpion.prototype.run = function() {
        this.changeText();
    };

    /**
     * runs upon exit
     */
    Morpion.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    Morpion.prototype.changeText = function() {
        this.id[0].onclick = function() { document.getElementById('morpion--case1').innerHTML = "O"; };
        this.id[1].onclick = function() { document.getElementById('morpion--case2').innerHTML = "O"; };
        this.id[2].onclick = function() { document.getElementById('morpion--case3').innerHTML = "O"; };
        this.id[3].onclick = function() { document.getElementById('morpion--case4').innerHTML = "O"; };
        this.id[4].onclick = function() { document.getElementById('morpion--case5').innerHTML = "O"; };
        this.id[5].onclick = function() { document.getElementById('morpion--case6').innerHTML = "O"; };
        this.id[6].onclick = function() { document.getElementById('morpion--case7').innerHTML = "O"; };
        this.id[7].onclick = function() { document.getElementById('morpion--case8').innerHTML = "O"; };
        this.id[8].onclick = function() { document.getElementById('morpion--case9').innerHTML = "O"; };
    };

    return Morpion;
}();