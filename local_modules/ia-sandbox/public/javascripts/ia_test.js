
function appLoaded() {
    _initI18n();
    loadApp(true);
}
function toggle(category){
    var isAll = window.location.hash.match(/all/);
    console.log(category);
    if (category === "All") {
        loadApp(true);
        window.location.hash = 'all'
    } else {
        loadApp(false);
        window.location.hash = 'web'
    }
}

function loadApp(isAll) {
    var newsColumn = document.getElementById('news-column');
	var iaHTML = template({data : data, query : query, images_path: "/img"});
    var ribbonTabs = document.getElementById('ribbon_tabs');
    if(isAll) {
        var iaContainer = document.getElementById('ia_container--horizontal');
        var iaContainerW = document.getElementById('ia_container--web');
        var itemStyleA = document.getElementById('cat-sidebar--All');
        var itemStyleW = document.getElementById('cat-sidebar--Web');
        itemStyleA.style.backgroundPosition = "-44px -304px";
        itemStyleA.style.opacity = "1";
        itemStyleW.style.opacity = "0.54";
        itemStyleW.style.backgroundPosition = "0px -348px"
        iaContainer.style.display= 'block';
        iaContainerW.style.display = 'none';
        iaContainer.classList.add("ia_container--h");
        newsColumn.classList.add("news-column--active");
        ribbonTabs.style.display= 'block';
    } else {
        var iaContainer = document.getElementById('ia_container--horizontal');
        var iaContainerW = document.getElementById('ia_container--web');
        var itemStyleA = document.getElementById('cat-sidebar--All');
        var itemStyleW = document.getElementById('cat-sidebar--Web');
        var styleColumnWeb = document.getElementById('full-it-id');
        styleColumnWeb.style.marginTop = "25px";
        itemStyleA.style.backgroundPosition = "0px -304px";
        itemStyleA.style.opacity = "0.54";
        itemStyleW.style.opacity = "1";
        itemStyleW.style.backgroundPosition = "-44px -348px"
        iaContainer.style.display= 'none';
        iaContainerW.style.display = 'block';
        newsColumn.classList.remove("news-column--active");
        ribbonTabs.style.display= 'block';
        var iaContainer = document.getElementById('ia_container--web');

    }

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