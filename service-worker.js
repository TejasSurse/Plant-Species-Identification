self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',               // Homepage
                '/styles/main.css', // CSS file(s)
                '/index.ejs',       // HTML for plant upload
                '/result.ejs',      // HTML for results display
                '/js/main.js',      // JavaScript file(s)
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
