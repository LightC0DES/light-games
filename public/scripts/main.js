let isLight = true;

function toLight() {
    if (isLight == false)
    {
        isLight = true
        document.body.classList.add("light")
        document.body.classList.remove("dark")
    }
    localStorage.setItem("isLight", String(isLight))
}

function toDark() {
    if (isLight == true)
    {
        isLight = false
        document.body.classList.remove("light")
        document.body.classList.add("dark")
    }
    localStorage.setItem("isLight", String(isLight))
}

function onLoaded() {
    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
        document.getElementsByTagName("body")[0].removeChild(document.getElementsByClassName("topbar")[0])
    }
    if (navigator.userAgent.indexOf("SamsungBrowser") !== -1) {
        toDark()
        return
    }
    const cachedIsLight = localStorage.getItem("isLight")
    if (cachedIsLight === undefined) {
        localStorage.setItem("isLight", String(isLight))
    }
    else {
        if (cachedIsLight == "true") {
            toLight()
        }
        else {
            toDark()
        }
    }
}

if (document.readyState == "complete")
{
    onLoaded()
}

document.addEventListener('readystatechange', (event) => {
    if (document.readyState == "complete") {
        onLoaded()
    }
})