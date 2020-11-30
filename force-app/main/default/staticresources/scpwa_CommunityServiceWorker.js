const OFFLINE_CACHE_NAME = 'offline-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE_NAME)
      .then((offlineCache) => offlineCache.addAll([getOfflinePageUrl()]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch((error) => {
      if (event.request.mode !== 'navigate') throw error;
      return caches.open(OFFLINE_CACHE_NAME).then((offlineCache) =>
        offlineCache.match(getOfflinePageUrl()).then((offlineResponse) => {
          if (offlineResponse) return offlineResponse;
          throw error;
        })
      );
    })
  );
});

function getUrlPrefix() {
  const scopePath = new URL(self.registration.scope).pathname;
  return scopePath.endsWith('/')
    ? scopePath.substr(0, scopePath.length - 1)
    : scopePath;
}

function getOfflinePageUrl() {
  return `${getUrlPrefix()}/scpwa_CommunityOfflinePage`;
}
