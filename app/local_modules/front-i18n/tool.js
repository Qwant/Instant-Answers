module.exports = function () {
    return {
        detectLanguage : function(req, availableLanguages) {
            var acceptLanguage = req.headers["accept-language"];
            var simpleLanguageCode = acceptLanguage.substring(0, 2);
            var foundLanguage = "en_gb";
            availableLanguages.forEach(function(availableLanguage) {
                if(availableLanguage.match === simpleLanguageCode) {
                    foundLanguage = availableLanguage.code
                }
            });
            return foundLanguage;
        }
    }
}();