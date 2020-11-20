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

   _Note: If you choose a different URL prefix you have to change the example code. See below._

3. Open the Experience Builder of the new community and in the _Settings_ panel activate _Public Access_ for the community.
4. Open the Guest User Profile of the new community and add the Visualforce page `scpwa_CommunityServiceWorker` to the section _Enabled Visualforce Page Access_.
5. In the _Settings_ panel of the Experience Builder open the _Advanced_ section and click the button _Edit Head Markup_.
6. Enter the following HTML code in the editor and save it.

   ```html
   <meta name="theme-color" content="#fece49" />
   <script
     src="/pwa/resource/1605881641041/scpwa_CommunityResources/pwa-loader.js"
     defer
   ></script>
   ```

7. Optionally drag a _HTML Editor_ component to a community page and insert the following HTML code to display an install button.

   ```html
   <button class="pwa-install-button" type="button">Install app</button>
   ```

8. Open the Workspaces of the new community, go to _Administration_ and activate the community.

## Concepts

### Loader Script

A progressive web app must meet certain [criteria to be installable](https://web.dev/install-criteria/) on the user's client. There are two of them which are especially challenging in the context of a Lightning Community.

- Registering a [service worker](https://web.dev/offline-fallback-page/) to handle requests sent from the browser to the server.
- Providing a [web app manifest](https://web.dev/add-manifest/) describing the application (name, icons, etc.).

In this project these additional resources are included in the page using the separate loader script `pwa-loader.js` provided by the static resource `scpwa_CommunityResources`. The responsibility of the script is to register the service worker for the context of the community and to include a link to the manifest file in the HTML document.

There are several reasons why this separate script makes sense.

- The script can automatically handle the URL prefix of the community to generate the proper URLs for the service worker and the manifest.
- There is only one single `<script>` tag which needs to be included as head markup in Experience Builder. This simple configuration is easier to maintain.
- Using a `<script>` file reference instead of an inline script allows the strict CSP security level to be used for the community.

### Service Worker

In this project the service worker is only registered to satisfy the requirement of having one in order to be installable. However, a service worker is a powerful mechanism allowing the implementation great capabilities which are beyond the scope of this project:

- Caching of resources to enable offline access when users do not have any network connection
- Push notifications sent by the server to inform users about updates
- And potentially more features making the web app feel like a native app

The integration of a service worker in general is a bit tricky in a Lightning Community. The reason is that the scope of a service worker is limited to the directory its JavaScript file is loaded from. As a naive approach one could be tempted to put a service worker JavaScript file into a static resource and then register the worker using the following script in the community page.

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    '/pwa/resource/1605881641041/service-worker.js'
  );
}
```

**DON'T DO THIS!** This will not work because the implicit scope of the worker is restricted to `/pwa/resource/1605881641041/`. It will never be able to handle network requests for community pages and other resources.

The JavaScript code for the service worker must be provided by some URL path which is a direct child path in the community context. For a community with an URL prefix `pwa` it can be `/pwa/sw` but not `/pwa/sub/sw`. This is where a custom Visualforce page comes into play because such pages can be accessed directly by their name in the root path of the community.

The project contains a Visualforce page `scpwa_CommunityServiceWorker` which is intended to be accessed directly by community guest users in order to load the service worker JavaScript code. Under the covers, it uses an Apex class as controller which queries the static resource `scpwa_CommunityServiceWorker` containing the real JavaScript content and returns it to the page.

This way it is possible to provide the service worker JavaScript code with the URL path `/pwa/scpwa_CommunityServiceWorker` giving the worker control over the whole community context `/pwa`.

### Web App Manifest

Another important criterion for an installable progressive web app is the manifest. This is ja simple JSON file containing some meta information about the application (e.g. name, icons, colors, start URL).

For the sake of simplicity this manifest is stored as `manifest.webmanifest` in the static resource `scpwa_CommunityResources`. The loader script just includes a `<link>` tag referring to this file in the community page.

One caveat of this approach is that the manifest must declare the scope and start URL of the app and therefore must be aware of the community URL prefix. In this project the manifest file contains the hard-coded `"scope": "/pwa/"` and `"start_url": "/pwa/s/"`. Also note that the manifest contains static links to the icon image files in the static resource. If those icons are changed the timestamp in the URL should be changed in the manifest as well.

This static approach may be alright for projects with stable URL prefixes and stable icons. Otherwise, the Visualforce page approach could be used to generate the manifest dynamically.

## License

[MIT License](https://opensource.org/licenses/MIT)
