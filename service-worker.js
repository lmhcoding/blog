/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "57957aba8ae912fee86a134a4fca6228"
  },
  {
    "url": "assets/css/0.styles.48263c0b.css",
    "revision": "10b4406095c107b065c9c00b171523d1"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.a6345a3b.js",
    "revision": "c44aa588cf41ada59a1500a44dbb816d"
  },
  {
    "url": "assets/js/11.1d6bcda9.js",
    "revision": "bc4d625bcc5484c68a57de92a68d8a67"
  },
  {
    "url": "assets/js/12.cad74b5c.js",
    "revision": "228cac6d115befdd8a34e5d4f8066abe"
  },
  {
    "url": "assets/js/13.805acaa7.js",
    "revision": "d1eb0547f28faed0d2e4221b5dd32580"
  },
  {
    "url": "assets/js/14.2e5c2139.js",
    "revision": "bd24572359e69a89ce71cb14fa176f0e"
  },
  {
    "url": "assets/js/15.7c6ba7f7.js",
    "revision": "891555a224e31116a22a5688e2d4ff6c"
  },
  {
    "url": "assets/js/2.c5bb9098.js",
    "revision": "2ef4385a29e65f8ed965a766058cafc4"
  },
  {
    "url": "assets/js/3.198e4c55.js",
    "revision": "02da2182c26b07379c86a06e4a963de9"
  },
  {
    "url": "assets/js/4.b9f182d3.js",
    "revision": "f0c608b314f45b062db7efaee302f20f"
  },
  {
    "url": "assets/js/5.822361f8.js",
    "revision": "42a1658734baeb5388bac41bf22144e7"
  },
  {
    "url": "assets/js/6.3c9c8e22.js",
    "revision": "5e07e93933b60e71952272af2dc88b25"
  },
  {
    "url": "assets/js/7.21cd4e7b.js",
    "revision": "bc2501dd324fc58b4b94e57a50b2ac37"
  },
  {
    "url": "assets/js/8.c1ba0fe9.js",
    "revision": "8f91a1e4b352cdd8e4a964112b3230c9"
  },
  {
    "url": "assets/js/9.8af815aa.js",
    "revision": "1fd2dcf38162397336786bd861cc4b02"
  },
  {
    "url": "assets/js/app.e825d7b3.js",
    "revision": "986dd4f7fb8733f493959bf98d5c8195"
  },
  {
    "url": "icons/android-chrome-192x192.png",
    "revision": "f130a0b70e386170cf6f011c0ca8c4f4"
  },
  {
    "url": "icons/android-chrome-512x512.png",
    "revision": "0ff1bc4d14e5c9abcacba7c600d97814"
  },
  {
    "url": "icons/apple-touch-icon-120x120.png",
    "revision": "936d6e411cabd71f0e627011c3f18fe2"
  },
  {
    "url": "icons/apple-touch-icon-152x152.png",
    "revision": "1a034e64d80905128113e5272a5ab95e"
  },
  {
    "url": "icons/apple-touch-icon-180x180.png",
    "revision": "c43cd371a49ee4ca17ab3a60e72bdd51"
  },
  {
    "url": "icons/apple-touch-icon-60x60.png",
    "revision": "9a2b5c0f19de617685b7b5b42464e7db"
  },
  {
    "url": "icons/apple-touch-icon-76x76.png",
    "revision": "af28d69d59284dd202aa55e57227b11b"
  },
  {
    "url": "icons/apple-touch-icon.png",
    "revision": "66830ea6be8e7e94fb55df9f7b778f2e"
  },
  {
    "url": "icons/favicon-16x16.png",
    "revision": "4bb1a55479d61843b89a2fdafa7849b3"
  },
  {
    "url": "icons/favicon-32x32.png",
    "revision": "98b614336d9a12cb3f7bedb001da6fca"
  },
  {
    "url": "icons/msapplication-icon-144x144.png",
    "revision": "b89032a4a5a1879f30ba05a13947f26f"
  },
  {
    "url": "icons/mstile-150x150.png",
    "revision": "058a3335d15a3eb84e7ae3707ba09620"
  },
  {
    "url": "icons/safari-pinned-tab.svg",
    "revision": "f22d501a35a87d9f21701cb031f6ea17"
  },
  {
    "url": "index.html",
    "revision": "a977ef94332c2233dfc247e6fb43a2e6"
  },
  {
    "url": "learning.jpeg",
    "revision": "2e43423a38cfa4ace9fc2781f81573f7"
  },
  {
    "url": "pen.png",
    "revision": "0bd0993f0db81799c5c9bf322b525fb8"
  },
  {
    "url": "vue_v2/build.html",
    "revision": "e0dacbd22bd10018cdd075b01d489517"
  },
  {
    "url": "vue_v2/component_merge.html",
    "revision": "afef68dd0b96f05b1eb1a1547889360b"
  },
  {
    "url": "vue_v2/constructor.html",
    "revision": "d01173097c608b08202d9a6ec79e364b"
  },
  {
    "url": "vue_v2/directory.html",
    "revision": "48bb32c0e4d29954bdca711a6546dfff"
  },
  {
    "url": "vue_v2/index.html",
    "revision": "ae51ea42be5827eaba80afc4999432c8"
  },
  {
    "url": "vue_v2/mergeOptions.html",
    "revision": "4e7027427ae5c220efc917372e6586d1"
  },
  {
    "url": "vue_v2/new_vue.html",
    "revision": "79a717bf65a42e310e734a1a572e6218"
  },
  {
    "url": "vue_v2/strats.html",
    "revision": "0ac74849b9a276814bfb20851def25af"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
