(() => {
  // Find community prefix path
  const prefixPathMatch = location.pathname.match(/(^.*?)\/s/i);
  const prefixPath = prefixPathMatch ? prefixPathMatch[1] : '';
  const serviceWorkerPath = `${prefixPath}/scpwa_CommunityServiceWorker`;
  const manifestPath = `${prefixPath}/resource/scpwa_CommunityResources/manifest.webmanifest`;

  // Add web app manifest link
  const manifestLink = document.createElement('link');
  manifestLink.rel = 'manifest';
  manifestLink.href = manifestPath;
  document.head.appendChild(manifestLink);

  let deferredBeforeInstallPromptEvent;
  window.addEventListener('beforeinstallprompt', (event) => {
    deferredBeforeInstallPromptEvent = event;
  });

  window.addEventListener('load', () => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath);
    }

    // Look for install button after 3 seconds.
    // For real projects better listen for custom event which is dispatched by
    // a web component once it has rendered the button.
    setTimeout(() => {
      const installButton = document.querySelector('.pwa-install-button');
      if (installButton) {
        installButton.addEventListener('click', () => {
          if (deferredBeforeInstallPromptEvent) {
            // Prompt user to install app when install button is clicked
            deferredBeforeInstallPromptEvent.prompt();
          }
        });
      }
    }, 3000);
  });
})();
