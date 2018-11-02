let CACHE = 'test-cache';


self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
                        // Fetch webpack manifest file
            return fetch('/build/manifest.json').then(function(responce) {
                return responce.json();
            }).then(function(json) {
                console.log('[Install] Fetch json');
                // Create an array with only file paths
                let files = Object.keys(json).map(function(key) {
                    return json[key];
                });
                files.push('/de/');
                // Cache webpack assets from generated file list
                return cache.addAll(files);
            }).then(function() {
                console.log('[Install] Add current page to cache');
                //Cache current page
                // return cache.addAll(['/']);
            });
        }).then(function() {
            console.log('[Install] Skip waiting');
            return self.skipWaiting();
        }),
    );
});

self.addEventListener('fetch', function(evt) {
        evt.respondWith(fromNetwork(evt.request, 600).catch(function () {
        console.log('[Fetch] Catch error with cache');
        return fromCache(evt.request).catch(function() {
            return useFallback();
        });
    }));
});

function fromNetwork(request, timeout) {
    console.log('[Network] Function');
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then(function (response) {
            console.log('[Fetch] Fetch');
            clearTimeout(timeoutId);
            caches.open(CACHE).then(function(cache){
                console.log('[Fetch] Add request to cache');
                cache.put(request, response.clone());
                fulfill(response);
            });
        }, reject);
    });
}

function fromCache(request) {
    console.log('[Cache] Cache open');
    return caches.open(CACHE).then(function (cache) {
        console.log('[Cache] Return cache if matching');
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}

var FALLBACK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180" stroke-linejoin="round">' +
    '  <path stroke="#DDD" stroke-width="25" d="M99,18 15,162H183z"/>' +
    '  <path stroke-width="17" fill="#FFF" d="M99,18 15,162H183z" stroke="#eee"/>' +
    '  <path d="M91,70a9,9 0 0,1 18,0l-5,50a4,4 0 0,1-8,0z" fill="#aaa"/>' +
    '  <circle cy="138" r="9" cx="100" fill="#aaa"/>' +
    '</svg>';

function useFallback() {
    console.log('[Fallback] Use Fallback');
    return Promise.resolve(new Response(FALLBACK, { headers: {
            'Content-Type': 'image/svg+xml'
        }}));
}

self.addEventListener('activate', function(event) {
    console.log('[activate] Activating service worker!');
    // console.log('[activate] Claiming this service worker!');
    // event.waitUntil(self.clients.claim());
});