var IARuntime = function() {
    function Lyrics(iaData) {
        // constructor
    }

    Lyrics.prototype.run = function() {
        var defaultHeight = 395; // 20 * 19 + 15 (20 lines plus padding)
        var lyrics = $(".ia__lyrics_body")[0];
        var lyricsHeight = lyrics.scrollHeight;

        if (lyricsHeight > (defaultHeight + 38)) {
            lyrics.style.height = defaultHeight.toString() + 'px';
            lyrics.style.overflow = 'hidden';

            var moreLink = $(".ia__lyrics_show_more")[0];
            moreLink.style.display = 'inline-block';
            moreLink.text = 'Show more';
            moreLink.addEventListener("click", function() {
                var newHeight = 0;
                if (hasClass(lyrics, "active")) {
                    newHeight = defaultHeight;
                    removeClass(lyrics, "active");
                    moreLink.text = 'Show more';
                } else {
                    newHeight = lyricsHeight;
                    addClass(lyrics, "active");
                    moreLink.text = 'Show less';
                }
                lyrics.style.height = newHeight.toString() + 'px';
            });
        }
    };

    Lyrics.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Lyrics;
}();
