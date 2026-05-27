// ── Service Worker — Calculateur PWA ────────────────────────
const CACHE_NAME = 'calculateur-v1';

// Fichiers à mettre en cache pour fonctionner hors-ligne
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Installation : mise en cache des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: mise en cache des ressources');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Interception des requêtes : Cache First, puis réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        // Si hors-ligne et ressource non en cache : retourne index.html
        return caches.match('./index.html');
      });
    })
  );
});
