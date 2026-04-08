const CACHE_NAME = 'comms-quiz-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quiz.html',
  './module_hub.html',
  './dynamic_knowledge.html',
  './exam_paper.html',
  './styles.css',
  './knowledge.css',
  './app.js',
  './dashboard.js',
  './module_hub.js',
  './ai_service.js',
  './data.js',
  './knowledge.js',
  './manifest.json',
  './icon.png'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches if we update the version
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Cache-First strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then(networkResponse => {
            // Check if we received a valid response
            if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Unbelievably crucial: Clone the response because the stream can only be consumed once!
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Optionally cache external requests like google fonts here if we want completely pure offline
                // But generally caching local assets is robust.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
        });
      })
  );
});
