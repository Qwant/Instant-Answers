/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Addqwant (iaData) {

    }

    /**
     * runs at runtime
     */
    Addqwant.prototype.run = function() {
        var extension = document.getElementById('extension');
        var home = document.getElementById('home');
        var add_default = document.getElementById('add_default');
        var main_content = document.getElementById('main_content');
        console.log(home.className);
        console.log(this.data);
        main_content.innerHTML = text['firefox'];
        extension.addEventListener('click',function(){
            extension.className = "navigator_style_on";
            console.log(home.className)
            home.className = "navigator_style_off";
            add_default.className = "navigator_style_off";

        })
        home.addEventListener('click',function(){
            home.className = "navigator_style_on";
            extension.className = "navigator_style_off";
            add_default.className = "navigator_style_off";
        })
        add_default.addEventListener('click',function(){
            add_default.className = "navigator_style_on";
            extension.className = "navigator_style_off";
            home.className = "navigator_style_off";
        })

    };

    /**
     * runs upon exit
     */
    Addqwant.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Addqwant;
}();