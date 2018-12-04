var IARuntime = function() {
    function CurrencyConverter(iaData) {
        // constructor
    }

    CurrencyConverter.prototype.run = function() {
        var moreOthers = $('.ia__currency_converter--others__see_more');
        var othersBlock = $('.ia__currency_converter--others_lines');
        if (moreOthers && moreOthers[0]
            && othersBlock && othersBlock[0]) {
            moreOthers[0].addEventListener('click', function(e) {
                toggleClass(othersBlock[0], 'others_lines_expanded');
                moreOthers[0].innerHTML = (moreOthers[0].innerHTML === _("See more", "currency_converter")) ? _("See less", "currency_converter") : _("See more", "currency_converter");
            });
        }
    };

    CurrencyConverter.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return CurrencyConverter;
}();