
const CACHE_NAME = 'g21-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME));
});
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
