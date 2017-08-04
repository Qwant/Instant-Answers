
function appLoaded() {
    _initI18n();
    loadApp();
}

function loadApp() {
    var newsColumn = document.getElementById('news-column');
    var iaHTML = template({data : data, query : query, images_path: "/img"});
    var ribbonTabs = document.getElementById('ribbon_tabs');

    var iaContainer = document.getElementById('ia_container--horizontal');
    iaContainer.classList.add("ia_container--h");
    newsColumn.classList.add("news-column--active");
    ribbonTabs.style.display = 'block';

    iaContainer.innerHTML = iaHTML;

    /* start dynamic ia script */
    externalFiles.forEach(function(externalFile) {
        var externalScript = document.createElement("script");
        externalScript.setAttribute("onload", "runIA()");
        var fileNameMatch = externalFile.url.match(/([^\/]*)\.js/)[1];
        externalScript.setAttribute("src", "javascript/" + fileNameMatch + ".js");

        iaContainer.appendChild(externalScript);
    });
}

function runIA() {
    new IARuntime(data).run();
}