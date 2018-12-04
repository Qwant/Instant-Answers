module.exports = function (i18n) {
    const _ = i18n._;
    return {
        "constants": {
            "BTC": [_("bitcoins?", "currency_converter"), "BTC"],
            "XBT": ["XBT"],
            "ETH": [_("ethereums?", "currency_converter"), "ETH"],
            "BCH": [_("bitcoins? cash", "currency_converter"), "BCH"],
            "XRP": [_("ripples?", "currency_converter"), "XRP"],
            "DASH": [_("dashs?", "currency_converter"), "DASH"],
            "LTC": [_("litecoins?", "currency_converter"), "LTC"],
            "XMR": [_("moneros?", "currency_converter"), "XMR"],
            "NEO": [_("neos?", "currency_converter"), "NEO"],
            "XEM": [_("nems?", "currency_converter"), "XEM"]
        },

        "labels_symbols": {
            "BTC": [_("Bitcoin", "currency_converter"), _("Bitcoins", "currency_converter"), "BTC"],
            "ETH": [_("Ethereum", "currency_converter"), _("Ethereums", "currency_converter"), "ETH"],
            "BCH": [_("Bitcoin Cash", "currency_converter"), _("Bitcoins Cash", "currency_converter"), "BCH"],
            "XRP": [_("Ripple", "currency_converter"), _("Ripples", "currency_converter"), "XRP"],
            "DASH": [_("Dash", "currency_converter"), _("Dashs", "currency_converter"), "DASH"],
            "LTC": [_("Litecoin", "currency_converter"), _("Litecoins", "currency_converter"), "LTC"],
            "XMR": [_("Monero", "currency_converter"), _("Moneros", "currency_converter"), "XMR"],
            "NEO": [_("NEO", "currency_converter"), _("NEOs", "currency_converter"), "NEO"],
            "XEM": [_("NEM", "currency_converter"), _("NEMs", "currency_converter"), "XEM"]
        }
    }
};
