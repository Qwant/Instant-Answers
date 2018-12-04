var IARuntime = function() {
    function Encryption (iaData) {
    }

    /**
     * gets a string, sets it to the fake textarea and copies it to the clipboard
     * @param text
     */
    Encryption.prototype.copyHash = function(text) {
        var it = this;
        it.existsTextarea.value = text;
        it.existsTextarea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            throw err
        }
    };

    /**
     * runs at runtime
     */
    Encryption.prototype.run = function() {
        var it = this;
        // declares our fake textarea
        it.textArea_id = "copy-hash-clipboard";
        it.existsTextarea = document.getElementById(it.textArea_id);
        if(!it.existsTextarea){
            // if it doesn't exist, creates it
            var textarea = document.createElement("textarea");
            textarea.id = it.textArea_id;

            // place in top-left corner of screen
            textarea.style.position = 'fixed';
            textarea.style.top = 0;
            textarea.style.left = 0;

            // give it a 1px² size so it's not visible, remove borders etc.
            textarea.style.width = '1px';
            textarea.style.height = '1px';
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';

            // append it to the page
            document.querySelector("body").appendChild(textarea);
            it.existsTextarea = document.getElementById(it.textArea_id);
        }

        // handling clicks on "copy-hash" link
        var hashLink = document.getElementById("copy-hash");
        hashLink.addEventListener('click', function(e){
            it.copyHash(e.target.innerHTML);
        });
    };

    /**
     * runs upon exit
     */
    Encryption.prototype.stop = function() {
        var it = this;
        if (it.existsTextarea){
            var elem = document.getElementById(it.textArea_id);
            elem.parentNode.removeChild(elem);
        }
    };

    return Encryption;
}();