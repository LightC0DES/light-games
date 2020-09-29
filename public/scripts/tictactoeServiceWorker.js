self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["../tic-tac-toe", "../css/style.css", "../images/icon.png", "../scripts/main.js"])
        }).catch(err => {
            console.log("Failed to cache static data!")
            return
        })
    )
})

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return fetch(event.request).catch((err) => {console.log("Error fetching the data!")}) || response
        })
    )
})