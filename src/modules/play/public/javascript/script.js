/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Play (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */

    Play.prototype.run = function () {
        var play = document.getElementById('start');
        var can = document.getElementById("game");
        var cross = document.getElementById("cross");
        var elem = document.getElementById("background_games");
        var state = 0; // 0 = little interface 1= big interface
        var scope = this;
        can.style.display = "none";
        cross.style.display = "none";
        play.addEventListener("click", function(){
            if (state === 0){
                elem.style.height = "800px";
                setTimeout(function(){

                    cross.style.display = "block";
                }, 800)
                play.style.cursor = "default";
                play.style.display = "none";
                // scope.game();

                state = 1;
            }
        })
        cross.addEventListener("click", function(){
            if(state === 1){
                elem.style.height = "200px";
                can.style.display = "none";
                cross.style.display = "none";
                setTimeout(function(){
                    play.style.cursor = "pointer";
                }, 800)
                state = 0;
                play.style.display = "block";

            }
        })
    };

    /**
     * runs upon exit
     */
    Play.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Play;
}();
