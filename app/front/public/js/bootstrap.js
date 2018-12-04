constants.AvailableLanguages = config_get('project.interface.languages');
constants.AvailableRegions   = config_get('project.regionalisation');

var detectedLanguage   = config_get('features.l10n.lang.default');
var preferredRegion    = config_get('features.l10n.region.default');
var preferredContinent = config_get('features.l10n.continent.default');

var browserLanguage = navigator.language || navigator.userLanguage;
var langMatch = Object.keys(constants.AvailableLanguages).filter(function (key) {
    // Reduce the array of available languages keys to only those that
    // match the browser language
    return browserLanguage.indexOf(constants.AvailableLanguages[key].shorthand) == 0;
});

if (langMatch && langMatch.length > 0) {
    // Take the first matched language from the filtered array
    detectedLanguage = langMatch.shift();
}

var splitTerritory = detectedTerritory.split('_');
preferredRegion = (LanguageHelper.getCountry(splitTerritory[1])) ? LanguageHelper.getCountry(splitTerritory[1]).code : preferredRegion;
preferredContinent = LanguageHelper.getContinentFromCountry(splitTerritory[1]);

/*
 * Detect whether or not localStorage is enabled
 */
var isReachableStore = true;
try {
    if (localStorage.getItem('user')) {
        var user = JSON.parse(localStorage.getItem('user'));
        if (user.userSetting && user.userSetting.interfaceLanguageKey) {
            detectedLanguage = user.userSetting.interfaceLanguageKey;
        }
    }
} catch (e) {
    isReachableStore = false;
}

// -- Begin URL settings parser -- //
/*
 * parseUri 1.2.2
 * (c) Steven Levithan <stevenlevithan.com>
 * MIT License
 */
function parseUri (str) {
    var o   = {
            strictMode: false,
            key       : ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q         : {
                name  : "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser    : {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose : /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        },
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) {
        uri[o.key[i]] = m[i] || "";
    }

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) {
            uri[o.q.name][$1] = $2;
        }
    });

    return uri;
}

var paramCallbacks = {},
    urlParams      = parseUri(window.location).queryKey,
    forcedLanguage = false;

if (Object.keys(urlParams).length > 0) {
    /*
     * Define the callbacks associated with the URL parameters
     */

    // Callback for the 'l' parameter
    paramCallbacks.l = function (locale) {
        if (!config_get('features.l10n.lang.switch.enabled')) {
            return false;
        }
        for (var lang in constants.AvailableLanguages) {
            if (constants.AvailableLanguages[lang].shorthand === locale) {
                forcedLanguage   = constants.AvailableLanguages[lang];
                detectedLanguage = forcedLanguage.code;
                break;
            }
        }
    };

    /*
     * Loop over the URL parameters and execute the
     * corresponding callbacks
     */
    for (var urlParam in urlParams) {
        // For each URL parameter, check to see if an associated callback exists
        for (var paramCallback in paramCallbacks) {
            // If the corresponding callback exists, execute it with the value of the URL parameter
            if (urlParam === paramCallback) {
                paramCallbacks[paramCallback](urlParams[urlParam]);
            }
        }
    }
}
// -- end URL settings parser -- //

/*
 * Initialize logger
 */
var l = Logger.getLogger(config_get('isDevelopmentMode') ? 'development' : 'production');
_initI18n({showMissingTranslation: config_get('isDevelopmentMode') && detectedLanguage !== 'en_gb'});

var languageFile = document.createElement('script');

// {"fr_fr":"/js/lang/fr_fr.js?8b21838598269220e6b0712252c294e6b9f52df9","en_gb":"/js/lang/en_gb.js?05802acb626792057b3cddb9577f42477407f75b","de_de":"/js/lang/de_de.js?2e0b11e53d3abb0f5fa98b6db73ee6aed6d03030","it_it":"/js/lang/it_it.js?6ca5588b579809b9dbfd27174b67ddaadf033597","br_fr":"/js/lang/br_fr.js?4816ff87adbfb734aed779178d0d8e5efb0563f1","ca_es":"/js/lang/ca_es.js?64377ff1f78df4436c140e5166d34ac0493d2542","co_fr":"/js/lang/co_fr.js?b2505e3a8427997f1633b848c701638a237aaad2","es_es":"/js/lang/es_es.js?6ef6ae0ead8347aa03a4d577c0d8092461572b88","eu_es":"/js/lang/eu_es.js?b72e7f550e9c4b4c56686fea336b5c39ab968a42","nl_nl":"/js/lang/nl_nl.js?cea1876a2c4fb439805c37aef3b7f5ab400eda00","pl_pl":"/js/lang/pl_pl.js?65e20385524782ddcacfcc0bcdac14941ceddd8a","pt_pt":"/js/lang/pt_pt.js?191c18e2e163a1bd7d9d3b4ff05b74c6031ec9ea","ru_ru":"/js/lang/ru_ru.js?2dfe8207876e0f986036bd07d9411a60a769ed24"} is generated during build
// Because the filename of each language file is required in order to append the <checksum> component, the list is
// generated during build and gets substituted to {"fr_fr":"/js/lang/fr_fr.js?8b21838598269220e6b0712252c294e6b9f52df9","en_gb":"/js/lang/en_gb.js?05802acb626792057b3cddb9577f42477407f75b","de_de":"/js/lang/de_de.js?2e0b11e53d3abb0f5fa98b6db73ee6aed6d03030","it_it":"/js/lang/it_it.js?6ca5588b579809b9dbfd27174b67ddaadf033597","br_fr":"/js/lang/br_fr.js?4816ff87adbfb734aed779178d0d8e5efb0563f1","ca_es":"/js/lang/ca_es.js?64377ff1f78df4436c140e5166d34ac0493d2542","co_fr":"/js/lang/co_fr.js?b2505e3a8427997f1633b848c701638a237aaad2","es_es":"/js/lang/es_es.js?6ef6ae0ead8347aa03a4d577c0d8092461572b88","eu_es":"/js/lang/eu_es.js?b72e7f550e9c4b4c56686fea336b5c39ab968a42","nl_nl":"/js/lang/nl_nl.js?cea1876a2c4fb439805c37aef3b7f5ab400eda00","pl_pl":"/js/lang/pl_pl.js?65e20385524782ddcacfcc0bcdac14941ceddd8a","pt_pt":"/js/lang/pt_pt.js?191c18e2e163a1bd7d9d3b4ff05b74c6031ec9ea","ru_ru":"/js/lang/ru_ru.js?2dfe8207876e0f986036bd07d9411a60a769ed24"}.
// see: #1701102123JB
// noinspection JSUnresolvedVariable
languageFile.src = {"fr_fr":"/js/lang/fr_fr.js?8b21838598269220e6b0712252c294e6b9f52df9","en_gb":"/js/lang/en_gb.js?05802acb626792057b3cddb9577f42477407f75b","de_de":"/js/lang/de_de.js?2e0b11e53d3abb0f5fa98b6db73ee6aed6d03030","it_it":"/js/lang/it_it.js?6ca5588b579809b9dbfd27174b67ddaadf033597","br_fr":"/js/lang/br_fr.js?4816ff87adbfb734aed779178d0d8e5efb0563f1","ca_es":"/js/lang/ca_es.js?64377ff1f78df4436c140e5166d34ac0493d2542","co_fr":"/js/lang/co_fr.js?b2505e3a8427997f1633b848c701638a237aaad2","es_es":"/js/lang/es_es.js?6ef6ae0ead8347aa03a4d577c0d8092461572b88","eu_es":"/js/lang/eu_es.js?b72e7f550e9c4b4c56686fea336b5c39ab968a42","nl_nl":"/js/lang/nl_nl.js?cea1876a2c4fb439805c37aef3b7f5ab400eda00","pl_pl":"/js/lang/pl_pl.js?65e20385524782ddcacfcc0bcdac14941ceddd8a","pt_pt":"/js/lang/pt_pt.js?191c18e2e163a1bd7d9d3b4ff05b74c6031ec9ea","ru_ru":"/js/lang/ru_ru.js?2dfe8207876e0f986036bd07d9411a60a769ed24"}[detectedLanguage];
document.documentElement.setAttribute("lang", detectedLanguage.substr(0, 2));

var applicationState = null;

function initApplication () {
    Model.setup(false);
    var userPromise = UserModel
        .getUser();

    userPromise
        .then(function (user) {
            return startApplication(user);
        })
        .then(function (error, needsRefresh) {
            // Refresh the application if we need to force an interface language
            if (needsRefresh) {
                applicationState.user.update();
                Application.rootComponent.refresh();
            }

            // Notify the user if their browser will soon be deprecated
            if (soonToBeDeprecatedBrowser) {
                AlertComponent.info(_('You are using an outdated and potentially unsecure browser. As of 3/13/2017, your browser will no longer be supported by Qwant.<br/>Please consider using <a href="{f4qUrl}">Firefox for Qwant</a>, or any other up-to-date browser. If you absolutely need to use this browser, you can use <a href="{liteUrl}">lite.qwant.com</a>.',
                    'homepage',
                    {f4qUrl: '/firefoxqwant/download', liteUrl: config_get('liteUrl')}
                ));
            }
        });
}

function startApplication (user) {
    applicationState = {
        rootUrl         : window.location.protocol + '//' + window.location.host,
        user            : user,
        timeMillisOffset: serverTime - new Date().getTime()
    };

    var application = new Application(new AppComponent(window.location.pathname), document.getElementById('app'));

    if (Dispatcher.route.params["client"]) {
        AjaxParameters.putPrefix("client", Dispatcher.route.params["client"])
    }

    var appStateInit = new promise.Promise();
    if (forcedLanguage) {
        appStateInit = applicationState.user.updateLang(forcedLanguage);
    } else {
        appStateInit.done(false, false);
    }
    return appStateInit;
}

languageFile.onerror = function () {
    document.body.removeChild(languageFile);
    var defaultLanguageFile    = document.createElement('script');
    defaultLanguageFile.src    = '/js/lang/' + config_get('features.l10n.lang.default') + '.js?1539790295919';
    defaultLanguageFile.onload = languageFileLoad;
    document.body.appendChild(defaultLanguageFile);
};

languageFile.onload = languageFileLoad;

function languageFileLoad () {
    try {
        var userExt = JSON.parse(localStorage.getItem("userExtension"));
    } catch (e) {
        userExt = null;
    }
    if (userExt !== null) {
        userExt.source = "extension";
        AjaxManager.post(ajax.user.extensionLogin(), new AjaxParameters(userExt).getParameters())
            .then(function (error, data) {
                if (!error && data.status === "success") {
                    var userModel = new UserModel(JSON.stringify(data));
                    return startApplication(userModel)
                        .then(function (error, needsRefresh) {
                            // Refresh the application if we need to force an interface language
                            if (needsRefresh) {
                                applicationState.user.update();
                                Application.rootComponent.refresh();
                            }
                        });
                } else {
                    try {
                        localStorage.removeItem("userExtension");
                    } catch (e) {}
                    initApplication();
                }
            });
    } else {
        initApplication();
    }
}

document.body.appendChild(languageFile);

document.addEventListener("qwant_extension_login", function () {
    window.location.reload();
});

document.addEventListener("qwant_extension_logout", function () {
    window.location.reload();
});