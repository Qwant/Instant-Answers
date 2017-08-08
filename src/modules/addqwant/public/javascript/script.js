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
        var content_addextension = document.getElementById('caddextension');
        var content_addhome = document.getElementById('caddhome');
        var content_adddefault = document.getElementById('cadddefault');
        content_addextension.style.display = "block";
        content_adddefault.style.display = "none";
        content_addhome.style.display = "none";

        // console.log(home.className);

        // main_content.innerHTML = text['firefox'];
        // winowsadd.addEventListener('click',function(){
        //
        // },false)
        extension.addEventListener('click',function(){
            extension.className = "navigator_style_on";
            home.className = "navigator_style_off";
            add_default.className = "navigator_style_off";
            content_addextension.style.display = "block";
            content_adddefault.style.display = "none";
            content_addhome.style.display = "none";


        })
        home.addEventListener('click',function(){
            home.className = "navigator_style_on";
            extension.className = "navigator_style_off";
            add_default.className = "navigator_style_off";
            content_addextension.style.display = "none";
            content_adddefault.style.display = "none";
            content_addhome.style.display = "block";
        })
        add_default.addEventListener('click',function(){
            add_default.className = "navigator_style_on";
            extension.className = "navigator_style_off";
            home.className = "navigator_style_off";
            content_addextension.style.display = "none";
            content_adddefault.style.display = "block";
            content_addhome.style.display = "none";
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