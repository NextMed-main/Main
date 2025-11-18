// NextMed Service Worker with Workbox Caching Strategies
// This Service Worker implements the caching strategies defined in the PWA requirements

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;
const FONT_CACHE = `font-cache-${CACHE_VERSION}`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that don't match current version
              return !cacheName.includes(CACHE_VERSION);
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    // CacheFirst strategy for static assets (CSS, JS)
    event.respondWith(cacheFirst(request, STATIC_CACHE, 30 * 24 * 60 * 60 * 1000, 100));
  } else if (isImage(url)) {
    // CacheFirst strategy for images (maxEntries: 60)
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 30 * 24 * 60 * 60 * 1000, 60));
  } else if (isFont(url)) {
    // CacheFirst strategy for fonts
    event.respondWith(cacheFirst(request, FONT_CACHE, 365 * 24 * 60 * 60 * 1000, 20));
  } else if (isAPIRequest(url)) {
    // NetworkFirst strategy for API requests
    event.respondWith(networkFirst(request, API_CACHE, 10000, 5 * 60 * 1000, 50));
  } else {
    // Default: NetworkFirst for navigation and other requests
    event.respondWith(networkFirst(request, STATIC_CACHE, 10000, 5 * 60 * 1000, 100));
  }
});

// Helper: Check if request is for static assets
function isStaticAsset(url) {
  return /\.(css|js)$/i.test(url.pathname);
}

// Helper: Check if request is for images
function isImage(url) {
  return /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname);
}

// Helper: Check if request is for fonts
function isFont(url) {
  return /\.(woff|woff2|ttf|otf|eot)$/i.test(url.pathname);
}

// Helper: Check if request is for API
function isAPIRequest(url) {
  return url.pathname.startsWith('/api/');
}

// CacheFirst strategy implementation
async function cacheFirst(request, cacheName, maxAge, maxEntries) {
  try {
    // Try to get from cache first
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0).getTime();
      const now = Date.now();
      
      if (now - cachedTime < maxAge) {
        console.log('[Service Worker] Cache hit:', request.url);
        return cachedResponse;
      }
    }

    // Cache miss or expired, fetch from network
    console.log('[Service Worker] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);
    
    // Cache the response if successful
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      
      // Add timestamp header
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cached-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      // Manage cache size
      await manageCacheSize(cache, maxEntries);
      await cache.put(request, modifiedResponse);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] CacheFirst error:', error);
    
    // Try to return cached response even if expired
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// NetworkFirst strategy implementation
async function networkFirst(request, cacheName, timeout, maxAge, maxEntries) {
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);
    
    // Cache the response if successful
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp header
      const headers = new Headers(responseToCache.headers);
      headers.append('sw-cached-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      // Manage cache size
      await manageCacheSize(cache, maxEntries);
      await cache.put(request, modifiedResponse);
    }
    
    console.log('[Service Worker] Network success:', request.url);
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    
    // Network failed, try cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const cachedTime = new Date(cachedResponse.headers.get('sw-cached-time') || 0).getTime();
      const now = Date.now();
      
      if (now - cachedTime < maxAge) {
        console.log('[Service Worker] Returning cached response:', request.url);
        return cachedResponse;
      }
    }
    
    // If navigation request and no cache, return offline page
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Helper: Manage cache size by removing oldest entries
async function manageCacheSize(cache, maxEntries) {
  const keys = await cache.keys();
  
  if (keys.length >= maxEntries) {
    // Remove oldest entries (FIFO)
    const entriesToRemove = keys.length - maxEntries + 1;
    for (let i = 0; i < entriesToRemove; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[Service Worker] Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Push notification handler (for future implementation)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
