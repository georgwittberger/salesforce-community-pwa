(() => {
  window.addEventListener('load', () => {
    // Find community prefix path
    const prefixPathMatch = location.pathname.match(/(^.*?)\/s/i);
    const prefixPath = prefixPathMatch ? prefixPathMatch[1] : '';
    const currentTimestamp = new Date().getTime();
    const serviceWorkerPath = `${prefixPath}/scpwa_CommunityServiceWorker`;
    const manifestPath = `${prefixPath}/resource/${currentTimestamp}/scpwa_CommunityResources/manifest.webmanifest`;

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath);
    }

    // Add web app manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = manifestPath;
    document.head.appendChild(manifestLink);
  });
})();
