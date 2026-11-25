const CACHE_NAME = "elizabeth-nails-v3";

const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/style.css",
    "./js/script.js",
    "./images/gallery/icons/icon-192.png",
    "./images/gallery/icons/icon-512.png",
    "./images/gallery/hero-marble.jpg",
    "./images/gallery/design%20options/plain-finish.jpg",
    "./images/gallery/design%20options/full-design.jpg"
];

// Install service worker and cache essential files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activate service worker and remove old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => self.clients.claim())
    );
});

// Serve cached files when offline
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const requestURL = new URL(event.request.url);

    // Only cache requests from this website
    if (requestURL.origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request);
        })
    );
});