
function appLoaded() {
	_initI18n();

	/* toggle view */
	var toggleModeDom = document.getElementById('sandbox-toggle-orientation-input');
	var isHorizontal = window.location.hash.match(/horizontal/);
    var isVertical = window.location.hash.match(/vertical/);

    if (!isHorizontal && !isVertical) isHorizontal = true;

	if(isHorizontal) {
		toggleModeDom.checked='checked'
	}

	loadApp(isHorizontal);

	toggleModeDom.onclick = function() {

		if(toggleModeDom.checked) {
			loadApp(true);
			window.location.hash = 'horizontal'
		} else {
			loadApp(false);
			window.location.hash = 'vertical'
		}

	}

}

function loadApp(isHorizontal) {
    var newsColumn = document.getElementById('news-column');
	var iaHTML = template({data : data, query : query, images_path: "/img"});
    var ribbonTabs = document.getElementById('ribbon_tabs');

	if(isHorizontal) {
		var iaContainer = document.getElementById('ia_container--horizontal');
        iaContainer.classList.add("ia_container--h");
		var willBeCleanContainer = document.getElementById('ia_container--vertical');
		newsColumn.classList.add("news-column--active");
        ribbonTabs.style.display = 'block';
	} else {
		var iaContainer = document.getElementById('ia_container--vertical');
		var willBeCleanContainer = document.getElementById('ia_container--horizontal');
		willBeCleanContainer.classList.remove("ia_container--h");
        newsColumn.classList.remove("news-column--active");
        ribbonTabs.style.display = 'none';
	}

	willBeCleanContainer.innerHTML = '';
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