/*
 * Service worker installed for the Lightning Community.
 */

self.addEventListener('install', (event) => {
  // This is the place to populate caches with offline resources.
});

self.addEventListener('activate', (event) => {
  // This is the place to cleanup old resources or take over clients.
});

self.addEventListener('fetch', (event) => {
  // Fetching can be extended to support fallback to cached offline resources.
  event.respondWith(fetch(event.request));
});
