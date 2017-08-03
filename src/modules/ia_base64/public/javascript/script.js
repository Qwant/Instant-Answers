var IARuntime = function() {
    function Ia_base64 (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Ia_base64.prototype.run = function() {
        var button_crypt = document.getElementById("go");
        var button_decrypt = document.getElementById("go_decrypt");
        var change_crypt = document.getElementById("change_cript");
        var screen = 0;
        document.getElementById("go_decrypt").style.display = "none";
        button_crypt.onclick = function (){
            var text = document.getElementById("text").value;
            var result = btoa(text);
            document.getElementById('result').innerHTML = result;

        }
        button_decrypt.onclick = function (){
            var text = document.getElementById("text").value;
            var result = atob(text);
            document.getElementById('result').innerHTML = result;


        }
        change_crypt.onclick = function (){
            document.getElementById("text").value = "";
            document.getElementById("result").value = "";
            if(screen === 0){
                document.getElementById("go").style.display = "none";
                document.getElementById("go_decrypt").style.display = "block";
                screen = 1;

            } else if(screen === 1){
                document.getElementById("go_decrypt").style.display = "none";
                document.getElementById("go").style.display = "block";
                screen = 0;
            }



        }
    };

    /**
     * runs upon exit
     */
    Ia_base64.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Ia_base64;
}();