function appLoaded(){
    this.iaContainerDesktop = document.getElementById('ia--container-desktop');
    this.iaContainerMobile = document.getElementById('ia--container-mobile');
    this.iaHTML = "";
    this.mode = "";
    if (data !== '') {
        this.iaHTML = template({data : data, query : query, images_path: "/img"});

        buildIA();

        window.addEventListener('resize', function() {
            buildIA();
        });
    }
}

/**
 * Add className of a given dom element or a dom element collection
 * @param {DomElement} elements an dom element or a elements collection
 * @param {String} className
 */
function addClass (elements, className) {
    if(!elements) {
        return;
    }
    var internAddClass = function(elem, className) {
        if (!hasClass(elem, className)) {
            elem.className += ' ' + className;
        }
    };
    if(elements.length) {
        for(var length = elements.length, i = 0; i < length; i += 1) {
            var elem = elements[i];
            internAddClass(elem, className);
        }
    } else {
        internAddClass(elements, className);
    }
}

/**
 * Remove className of a given dom element or a dom element collection
 * @param {DomElement} elements an dom element or a elements collection
 * @param {String} className
 */
function removeClass(elements, className) {
    if(!elements) {
        return;
    }
    var internRemoveClass = function(elem, className) {
        if(elem && elem.className) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
            if (hasClass(elem, className)) {
                while (newClass.indexOf(' ' + className + ' ') >= 0) {
                    newClass = newClass.replace(' ' + className + ' ', ' ');
                }
                elem.className = newClass.replace(/^\s+|\s+$/g, '');
            }
        }
    };

    if(elements.length) {
        for(var length = elements.length, i = 0; i < length; i += 1) {
            var elem = elements[i];
            internRemoveClass(elem, className);
        }
    } else {
        internRemoveClass(elements, className);
    }
}

function hasClass(elements, className) {
    if(!elements) {
        return;
    }
    var internHasClass = function(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
    };
    if(elements.length) {
        for(var length = elements.length, i = 0; i < length; i += 1) {
            var elem = elements[i];
            if(internHasClass(elem, className)) {
                return true;
            }
        }
        return false;
    } else {
        return internHasClass(elements, className);
    }
}

function buildIA() {
    let reload = false;

    if (window.innerWidth > 1210 && this.mode !== "desktop") {
        removeClass(document.body, "device");
        removeClass(document.body, "device--mobile");
        removeClass(document.body, "device--tablet");
        this.mode = "desktop";
        this.iaContainerDesktop.style.display = "block";
        this.iaContainerDesktop.innerHTML = "<div id=\"ia--container\" class=\"ia_container-web_desktop results-ia-ribbon-nodejs\"></div>";
        this.iaContainerMobile.style.display = "none";
        this.iaContainerMobile.innerHTML = "";
        reload = true;
    } else if (window.innerWidth > 1024 && window.innerWidth <= 1210 && this.mode !== "inter") {
        removeClass(document.body, "device");
        removeClass(document.body, "device--mobile");
        removeClass(document.body, "device--tablet");
        this.mode = "inter";
        this.iaContainerDesktop.style.display = "none";
        this.iaContainerDesktop.innerHTML = "";
        this.iaContainerMobile.style.display = "block";
        this.iaContainerMobile.innerHTML = "<div id=\"ia--container\" class=\"ia_container-web_desktop results-ia-ribbon-nodejs\"></div>";
        reload = true;
    } else if (window.innerWidth > 640 && window.innerWidth <= 1024 && this.mode !== "tablet") {
        removeClass(document.body, "device");
        removeClass(document.body, "device--mobile");
        removeClass(document.body, "device--tablet");
        addClass(document.body, "device--tablet");
        addClass(document.body, "device");
        this.mode = "tablet";
        this.iaContainerMobile.style.display = "block";
        this.iaContainerMobile.innerHTML = "<div id=\"ia--container\" class=\"ia_container-web_desktop results-ia-ribbon-nodejs\"></div>";
        this.iaContainerDesktop.style.display = "none";
        this.iaContainerDesktop.innerHTML = "";
        reload = true;
    } else if (window.innerWidth <= 640 && this.mode !== "mobile") {
        removeClass(document.body, "device");
        removeClass(document.body, "device--mobile");
        removeClass(document.body, "device--tablet");
        addClass(document.body, "device--mobile");
        addClass(document.body, "device");
        this.mode = "mobile";
        this.iaContainerMobile.style.display = "block";
        this.iaContainerMobile.innerHTML = "<div id=\"ia--container\" class=\"ia_container-web_desktop results-ia-ribbon-nodejs\"></div>";
        this.iaContainerDesktop.style.display = "none";
        this.iaContainerDesktop.innerHTML = "";
        reload = true;
    }

    if (reload) {
        let iaContainer = document.getElementById('ia--container');
        iaContainer.innerHTML = this.iaHTML;
        iaContainer.style.display = "block";

        externalFiles.forEach(function(externalFile) {
            var externalScript = document.createElement("script");
            externalScript.setAttribute("onload", "runIA()");
            var fileNameMatch = externalFile.url.match(/([^\/]*)\.js/)[1];
            externalScript.setAttribute("src", "javascript/" + fileNameMatch + ".js");

            iaContainer.appendChild(externalScript);
        });
    }
}

function runIA() {
    new IARuntime(data).run();
}

function _(text, context) {
    if (i18n && lang && i18n['dictionnaries'][lang]['entries'][context] && i18n['dictionnaries'][lang]['entries'][context][text]) {
        return i18n['dictionnaries'][lang]['entries'][context][text];
    }
    return text;
}

var SecurityHelper = {
    targetBlank: function() {}
};

var LinkHelper = {
    logHandler: function() {},
    clickHandler: function() {}
};

function $(a,b) {
    return "#" == a[0] && -1 === a.indexOf(" ") ? document.getElementById(a.slice(1)) : (b||document).querySelectorAll(a);
}

function getScript (url, o) {
  o = o || {};
  return  new Promise((resolve, reject) => {
    var d = document.createElement("script");
    d.src = url

    d.onload = function() {
      resolve(null, o)
    }
    document.head.appendChild(d)
  })
}

window.addEventListener("resize", function() {
    // mobile -> innerHTML mobile
});
