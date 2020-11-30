# Salesforce Community PWA Example

> Example project to demonstrate how to turn a Salesforce Lightning Community into a Progressive Web App

- [Salesforce Community PWA Example](#salesforce-community-pwa-example)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Concepts](#concepts)
    - [Loader Script](#loader-script)
    - [Service Worker](#service-worker)
    - [Web App Manifest](#web-app-manifest)
  - [License](#license)

## Overview

This SFDX project contains the components required to build a Progressive Web App into a Salesforce Lightning Community. The following sections explain the concepts and how to try it out in your own Salesforce org.

## Features

- Upgrade a Lightning Community to an installable Progressive Web App
- Web app manifest to define custom icons for the installed app
- Simple service worker which can be enhanced for offline support

## Installation

1. Deploy the SFDX project to your Salesforce org. For example, use Salesforce CLI for deployment.

   ```bash
   sfdx force:source:deploy -p ./force-app
   ```

2. Create a Lightning Community using the template _Build Your Own_. Use the URL prefix `pwa` for the community.

   _Note: If you choose a different URL prefix you have to adapt the configuration in the following steps accordingly._

3. Open the Experience Builder of the new community and in the _Settings_ panel activate _Public Access_ for the community.
4. Open the Guest User Profile of the new community and add the following Visualforce pages to the section _Enabled Visualforce Page Access_.

   - `scpwa_CommunityManifest`
   - `scpwa_CommunityPwaLoader`
   - `scpwa_CommunityServiceWorker`
   - `scpwa_CommunityOfflinePage`

5. In the _Settings_ panel of the Experience Builder open the _Advanced_ section and click the button _Edit Head Markup_.
6. Enter the following HTML code in the editor and save it.

   ```html
   <meta name="theme-color" content="#fece49" />
   <link rel="manifest" href="/pwa/scpwa_CommunityManifest?urlPrefix=%2Fpwa" />
   <script src="/pwa/scpwa_CommunityPwaLoader" defer></script>
   ```

   _Note: If you have chosen a community URL prefix other than `pwa` you must adjust the references to the manifest and loader script accordingly._

7. Optionally drag a _HTML Editor_ component to a community page and insert the following HTML code to display an install button.

   ```html
   <button class="pwa-install-button" type="button">Install app</button>
   ```

8. Publish the changes made to the new community.
9. Open the Workspaces of the new community, go to _Administration_ and activate the community.

## Concepts

A progressive web app must meet certain [criteria to be installable](https://web.dev/install-criteria/) on the user's client. There are two of them which are especially challenging in the context of a Lightning Community.

- Registering a [service worker](https://web.dev/offline-fallback-page/) to handle requests sent from the browser to the server.
- Providing a [web app manifest](https://web.dev/add-manifest/) describing the application (name, icons, start URL, etc.).

### Loader Script

The registration of a service worker requires a little bit of JavaScript code to be executed when the page has been loaded. This loader script is located in the static resource `scpwa_CommunityPwaLoader`. The resource is loaded in the community page using a `<script>` tag in the head markup. This is preferred instead of an inline script because it allows us to keep the strict CSP security setting for the community.

The content of the static resource is loaded using a dedicated Visualforce page named `scpwa_CommunityPwaLoader`. It uses a custom Apex controller to perform a SOQL query for the static resource body and returns it as response.

This approach is preferred over a direct reference to the static resource via `/resource/` URL because it allows us to make changes to the loader script without having to update the URL of the script in the head markup. When using a resource URL the response is cached by Salesforce and changes to the underlying static resource may not take effect until we change the timestamp in the URL.

Furthermore, the loader script takes responsibility for providing a manual installation option. For demonstration purposes it just looks for an element with the CSS class `pwa-install-button` in the page and registers a click listener on this element. However, in a real project we should rather listen for a custom event which can be dispatched by a web component when it has rendered the button.

### Service Worker

The JavaScript code for the service worker is located in the static resource `scpwa_CommunityServiceWorker`.

However, registration of a service worker in general is a little bit tricky in a Lightning Community. The reason is that the scope of a service worker is limited to the directory its JavaScript file is loaded from. For example, if we used the following JavaScript code relying on a static resource URL the worker would only be scoped to `/pwa/resource/1605881641041/`.

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    '/pwa/resource/1605881641041/scpwa_CommunityServiceWorker'
  );
}
```

But we want the scope of the service worker to be `/pwa/` so that it can handle all server requests for the whole community. This is why the JavaScript code for the service worker must be provided by a URL which has only one child path segment under the community root context. For this reason the static resource content is loaded via the dedicated Visualforce page `scpwa_CommunityServiceWorker`. This page can be addressed directly by the URL path `/pwa/scpwa_CommunityServiceWorker` which meets the requirements.

The service worker in this project provides a basic fallback to an offline page for all navigation requests. See the [MDN documentation on using service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) for further information how to use caches for offline support.

### Offline Page

The service worker provided by the static resource `scpwa_CommunityServiceWorker` implements a basic fallback to an offline page for all navigation requests in case the client is offline.

The offline page is provided by the Visualforce page `scpwa_CommunityOfflinePage` because it allows us to serve a self-contained HTML document with all required styles embedded. This is an advantage compared to Experience Builder pages which would require offline caching of the whole Aura and Lightning framework as well to make them display properly.

### Web App Manifest

Another important criterion for an installable progressive web app is the manifest. This is a JSON file containing some meta information about the application (e.g. name, icons, colors, start URL). See the [MDN documentation on web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) for more details.

The manifest in this project is stored as a template in the static resource `scpwa_CommunityManifest`. This JSON file can contain two specific placeholders.

- `{urlPrefix}` is resolved to the URL prefix of the community. This is required to compose valid icons URLs and a proper scope and start URL.
- `{resourcesLastModified}` is resolved to the timestamp when the static resource `scpwa_CommunityResources` was last changed. This is required to generate up-to-date resource URLs for the icons.

The manifest resource is loaded in the community page using a `<link>` tag in the head markup. Since we need to resolve the placeholders before the file can be served to the client the content is loaded via the dedicated Visualforce page `scpwa_CommunityManifest`. This page makes use of a custom Apex controller which loads the static resource body and then replaces the variables. The URL prefix is expected to be passed as URL query parameter `urlPrefix` to the page. The last modified date of the static resource `scpwa_CommunityResources` is determined using a SOQL query.

With this approach we can also keep the head markup of the community fixed even when the manifest has changed. There is no need to update the manifest manually when the icons are updated because the Apex controller determines the new timestamp for the resource URLs.

## License

[MIT License](https://opensource.org/licenses/MIT)
