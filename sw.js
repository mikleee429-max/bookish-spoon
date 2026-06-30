const CACHE_NAME = 'fuzzy-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/js/main.js',
  '/js/games/sudoku.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request)).catch(() => fetch(event.request))
  );
});
