const CACHE_NAME = "random-user-cache-v1";
const STATIC_ASSETS = [
  "./",
  "index.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icons/icon-192x.png",
  "icons/icon-512x.png",
  "icons/splash-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});