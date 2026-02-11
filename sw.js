const CACHE_NAME = 'achille-ai-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx'
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // We attempt to cache core files, but don't fail if one is missing in dev environment
        return cache.addAll(urlsToCache).catch(err => console.log('Cache addAll error (non-fatal):', err));
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // For API requests or external resources, go to network first
  if (event.request.url.includes('generativelanguage.googleapis.com') || 
      event.request.url.includes('esm.sh') || 
      event.request.url.includes('tailwindcss')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For app shell, try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});