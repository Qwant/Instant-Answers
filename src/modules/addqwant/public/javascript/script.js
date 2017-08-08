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
        var browser;
        // console.log(home.className);
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        if (isOpera === true){
            browser = "opera";
        }else if(isFirefox === true){
            browser = "firefox";
        }else if(isSafari === true){
            browser = "safari";
        }else if(isIE === true){
            browser = "ie";
        }else if(isEdge === true){
            browser = "edge";
        }else if(isChrome === true){
            browser = "chrome";
        }else if(isBlink === true){
            browser = "blink";
        }else{
            browser = "unknown";
        }
        // main_content.innerHTML = text['firefox'];
        extension.addEventListener('click',function(){
            extension.className = "navigator_style_on";
            // console.log(home.className)
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