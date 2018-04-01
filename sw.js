const staticCacheName = 'restaurant-review-app-v1';

const filesToCache = [
    '/',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'js/main.js',
    'js/dbhelper.js',
    'js/restaurant_info.js',
    'manifest.json',
    '/img/',
    'http://fonts.googleapis.com/css?family=Google+Sans:400|Roboto:400,400italic,500,500italic,700,700italic|Roboto+Mono:400,500,700|Material+Icons',
    'https://maps.googleapis.com/maps-api-v3/api/js/32/6/intl/en_gb/map.js'
];

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-review-app-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(staticCacheName).then(function (cache) {
            return cache.match(event.request).then(function (response) {

                return response || fetch(event.request).then(function (response) {

                    if (response.status === 404) {
                        return new Response("Whoops, not found");
                    }
                    cache.put(event.request, response.clone());
                    return response;
                }).catch(function () {
                    return new Response("Uh oh, that totoally failed!");
                });
            });
        })
    );
});
