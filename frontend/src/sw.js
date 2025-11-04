const CACHE_NAME = 'deepcheck-v1.0.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.js',
  '/polyfills.js',
  '/styles.css',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-256x256.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/favicon.ico'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        // Failed to cache resources
      })
  );
});

// Activate service worker
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
});

// Fetch event - cache first strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  // Skip API requests for fresh data
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          // Return a custom offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/offline.html') || new Response(
              `<!DOCTYPE html>
              <html>
              <head>
                <title>DeepCheck - Offline</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                  .offline-icon { font-size: 64px; margin-bottom: 20px; }
                  .offline-message { color: #666; margin-bottom: 20px; }
                  .retry-button { 
                    background: #007bff; color: white; border: none; 
                    padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                  }
                </style>
              </head>
              <body>
                <div class="offline-icon">📱</div>
                <h1>DeepCheck</h1>
                <p class="offline-message">You're currently offline. Please check your internet connection.</p>
                <button class="retry-button" onclick="window.location.reload()">Try Again</button>
              </body>
              </html>`,
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
        });
      })
  );
});

// Background sync for failed analysis requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'analysis-retry') {
    event.waitUntil(
      // Retry failed analysis requests from IndexedDB
      retryFailedAnalysis()
    );
  }
});

// Push notifications (for future features)
self.addEventListener('push', (event) => {
  
  const options = {
    body: event.data ? event.data.text() : 'Analysis complete!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Results',
        icon: '/assets/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('DeepCheck', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to retry failed analysis
async function retryFailedAnalysis() {
  try {
    // This would integrate with IndexedDB to retry failed requests
    // Implementation would go here
  } catch (error) {
    // Failed to retry analysis
  }
}

// Update notification for new version
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    // Notify clients that update is complete
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'SW_UPDATED_COMPLETE' });
      });
    });
  }
});
