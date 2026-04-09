const CACHE_NAME = 'comms-quiz-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './quiz.html',
  './module_hub.html',
  './dynamic_knowledge.html',
  './exam_paper.html',
  './styles.css',
  './knowledge.css',
  './chatbot.css',
  './app.js',
  './dashboard.js',
  './module_hub.js',
  './ai_service.js',
  './chatbot.js',
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

// Fetch event - Network-First strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Check if we received a valid response
        if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Unbelievably crucial: Clone the response because the stream can only be consumed once!
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME)
          .then(cache => {
            // Update the cache immediately with fresh network response
            cache.put(event.request, responseToCache);
          });

        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if user is offline or network fails
        return caches.match(event.request);
      })
  );
});
