// ✅ Install event: pre-cache static assets
self.addEventListener('install', (event) => {
  console.log("✅ Service Worker installed");
  event.waitUntil(
    caches.open('static-cache-v1').then((cache) => {
      return cache.addAll([
        '/styles.css',
        '/app.js',
        '/icons/twitter.png',
        '/offline.html' // optional offline fallback
      ]);
    })
  );
  self.skipWaiting();
});

// ✅ Activate event
self.addEventListener('activate', (event) => {
  console.log("✅ Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'static-cache-v1') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ✅ Fetch event
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Network-only for API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req, { credentials: 'include' }).catch((err) => {
        console.error("API request failed:", err);
        return new Response(JSON.stringify({ error: "Offline or server error" }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network-first for HTML pages (like /, /login, etc.)
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).catch(() => caches.match('/offline.html')) // fallback page
    );
    return;
  }

  // Cache-first for static assets (CSS, JS, icons)
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      return cachedResponse || fetch(req);
    })
  );
});
