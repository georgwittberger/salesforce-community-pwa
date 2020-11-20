/*
 * Service worker installed for the Lightning Community.
 */

self.addEventListener('install', (event) => {
  // Maybe populate caches with offline resources.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Maybe extend fetching to fall back to cached offline resources.
  event.respondWith(fetch(event.request));
});
