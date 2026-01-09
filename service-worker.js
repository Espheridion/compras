
const CACHE_NAME = 'hendaya-offline-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Al instalar, precacheamos los recursos críticos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Al activar, reclamamos el control de los clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Interceptamos todas las peticiones de red
self.addEventListener('fetch', (event) => {
  // Solo manejamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si existe en caché, lo devolvemos
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no, hacemos la petición a la red
      return fetch(event.request).then((networkResponse) => {
        // Verificamos que la respuesta sea válida
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Clonamos la respuesta para guardarla en caché
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Guardamos en caché para uso futuro offline
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback opcional si falla la red y no está en caché
        console.log('Fallo de red y no en caché:', event.request.url);
      });
    })
  );
});
