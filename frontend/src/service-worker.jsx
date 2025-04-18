self.addEventListener('install', (event) => {
    console.log("✅ Service Worker installed");
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/', // root
          '/index.html',
          '/styles.css',
          '/app.js',
          // Add any other static assets here (like logo, icons etc.)
        ]);
      })
    );
  });
  
  self.addEventListener('activate', (event) => {
    console.log("✅ Service Worker activated");
    // Optional: Cleanup old caches here if needed
  });
  
  self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
  
    // ✅ Let API requests go directly to the server with cookies
    if (requestUrl.pathname.startsWith('/api/')) {
      event.respondWith(
        fetch(event.request, {
          credentials: 'include', // 🍪 Include cookies!
        })
      );
      return;
    }
  
    // ✅ Cache-first for static files (but fallback to network)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  });
  