// ✅ Install event: pre-cache static assets
self.addEventListener('install', (event) => {
    console.log("✅ Service Worker installed");
    event.waitUntil(
      caches.open('static-cache-v1').then((cache) => {
        return cache.addAll([
          '/styles.css',
          '/app.js',
          '/icons/icon-192.png',
          '/icons/icon-512.png',
          // Add more static files here
          // ⚠️ DON'T add `/index.html` or `/` — we want to fetch that fresh
        ]);
      })
    );
    self.skipWaiting();
  });
  
  // ✅ Activate event
  self.addEventListener('activate', (event) => {
    console.log("✅ Service Worker activated");
    // Optional: clean old caches
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
  
  // ✅ Fetch event handler
  self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
  
    // ✅ Bypass service worker for API calls — always go to network with cookies
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(req, {
          credentials: 'include',
        }).catch((err) => {
          console.error("API request failed:", err);
          return new Response(JSON.stringify({ error: "Offline or server error" }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
      );
      return;
    }
  
    // ✅ Network-first strategy for HTML (SPA routes like /, /login, etc.)
    if (req.headers.get('accept')?.includes('text/html')) {
      event.respondWith(
        fetch(req).catch(() => caches.match('/offline.html')) // optional offline fallback
      );
      return;
    }
  
    // ✅ Cache-first strategy for static files
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        return cachedResponse || fetch(req);
      })
    );
  });
  