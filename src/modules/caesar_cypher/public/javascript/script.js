/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Caesar_cypher (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Caesar_cypher.prototype.run = function() {
        var alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
        var button_crypt = document.getElementById("go");
        var button_decrypt = document.getElementById("go_decrypt");
        var change_crypt = document.getElementById("change_cript");
        var screen = 0;
        document.getElementById("go_decrypt").style.display = "none";

        button_crypt.onclick = function (){
            var tab = [];
            var key = document.getElementById("key").value;
            var text = document.getElementById("text").value;
            key = parseInt(key);
            if(!Number.isInteger(key)){
                return alert("bad key");
            }
            for(var i=0;i<text.length;i++){
                for(var j=0;j<alphabet.length;j++){
                    if(text[i] === alphabet[j]){

                            var result = alphabet[(j+key)%26];
                            tab.push(result);

                    }
                }

                console.log(result);

            }
            tab = tab.toString();
            for (var i = 0;i<tab.length; i++){
                tab = tab.replace(',','');
            }
            console.log(typeof tab);
            document.getElementById("result").value = tab;

        }
        button_decrypt.onclick = function (){
            console.log("on est la");
            var tab = [];
            var key = document.getElementById("key").value;
            var text = document.getElementById("text").value;
            key = parseInt(key);
            if(!Number.isInteger(key)){
                return alert("bad key");
            }
            for(var i=0;i<text.length;i++){
                for(var j=0;j<alphabet.length;j++){
                    if(text[i] === alphabet[j]){

                        var result = alphabet[(26 + j + (-key % 26)) % 26];
                        tab.push(result);

                    }
                }

                console.log(result);

            }
            tab = tab.toString();
            for (var i = 0;i<tab.length; i++){
                tab = tab.replace(',','');
            }
            console.log(typeof tab);
            document.getElementById("result").value = tab;


        }
        change_crypt.onclick = function (){
            document.getElementById("key").value = "";
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
    Caesar_cypher.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Caesar_cypher;
}();