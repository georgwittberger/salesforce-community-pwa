(() => {
  // Find community prefix path
  const prefixPathMatch = location.pathname.match(/(^.*?)\/s/i);
  const prefixPath = prefixPathMatch ? prefixPathMatch[1] : '';
  const serviceWorkerPath = `${prefixPath}/scpwa_CommunityServiceWorker`;

  // Save the app installation prompt event
  let deferredInstallPrompt;
  window.addEventListener('beforeinstallprompt', (event) => {
    deferredInstallPrompt = event;
  });

  window.addEventListener('load', () => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(serviceWorkerPath);
    }

    // Try to find install button after 3 seconds.
    // For real projects better listen for a custom event which is dispatched
    // by a web component once it has rendered the button.
    setTimeout(() => {
      const installButton = document.querySelector('.pwa-install-button');
      if (installButton) {
        // Prompt user to install app when install button is clicked
        installButton.addEventListener('click', () => {
          if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
          }
        });
      }
    }, 3000);
  });
})();
