const CACHE_NAME = 'expense-tracker-v3';

const PRECACHE_ASSETS = [
    '/',
    '/globals.css',
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Trying to cache core assets, but we won't fail if some missing
            // because Next.js build hashes change filenames often.
            // We will rely more on runtime caching.
            return cache.addAll(PRECACHE_ASSETS).catch(error => {
                console.error("Precatch failed:", error);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Skip next.js specific requests that shouldn't be cached agressively without logic
    if (event.request.url.includes('/_next/static/development')) return;


    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Cache hit - return response
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone the response
                const responseToCache = networkResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // Return offline fallback page if network fails for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
