/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Password (iaData) {

    }

    /**
     * runs at runtime
     */
    Password.prototype.run = function() {
        this.start();
    };

    /**
     * runs upon exit
     */
    Password.prototype.stop = function() {

    };

    Password.prototype.start = function(e) {
        var xCurs  = 0;
        var yCurs  = 0;

        window.addEventListener('mousemove', function (e) {
            xCurs = e.pageX;
            yCurs = e.pageY;
        });

        //Delete submit if you merge it
        window.addEventListener('submit', function(e) {
            e.preventDefault();
        }, false);

        window.addEventListener('keydown', function(event) {
            if(event.keyCode === 13) {
                var value  = parseInt(document.getElementById('value').value);
                var result = document.getElementById('result');

                if (value !== false && value > 0) {
                    var password = "";
                    var charlist = "!#$%&()*+,-./0123456789:;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
                    for (var i = 0; i < value; ++i) {
                        var code = Math.trunc((Math.random() * 1000 + xCurs * yCurs) % charlist.length;
                        password += charlist.charAt(code);
                    }
                    result.value = password;
                }
            }
        }, false);
    };
    return Password;
}();