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
    "url": "$root.jpg",
    "revision": "098b73d8a3b51dfbb3c2833a900ac80c"
  },
  {
    "url": "404.html",
    "revision": "17f3b4d0e49b31b1a944bb185362c88e"
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
    "url": "assets/js/12.ccf5b6b4.js",
    "revision": "c14c4a098e111f1e6c180579e5fd7bce"
  },
  {
    "url": "assets/js/13.c823062d.js",
    "revision": "f9167cbb83574de7a5de11dd097f8a2c"
  },
  {
    "url": "assets/js/14.1e1e2752.js",
    "revision": "46809119933c18d2fcaee1dab808f102"
  },
  {
    "url": "assets/js/15.31b83f28.js",
    "revision": "38ab752dfd5c023ebeb8331ced80c4aa"
  },
  {
    "url": "assets/js/16.d2dee094.js",
    "revision": "6f57c5a615a22699f62404c2d562495b"
  },
  {
    "url": "assets/js/17.ddcc8c79.js",
    "revision": "55811a816ff8472e1f2a6787593f9a99"
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
    "url": "assets/js/4.8be81cf4.js",
    "revision": "4eb7bfa64fae89f7be79303935a1aa68"
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
    "url": "assets/js/app.72bc0fac.js",
    "revision": "41926cfe53289601f7654bf2fee4e8df"
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
    "revision": "f5158b868b36f5b6887486fd6aec73b1"
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
    "url": "proxy_error.jpg",
    "revision": "8b2875dbe0daa968e24892dcafdfa302"
  },
  {
    "url": "proxy_has.jpg",
    "revision": "4cf7b71933d599e8a65969cdfe09b441"
  },
  {
    "url": "render.jpg",
    "revision": "185a5ef4e8226be332548aae44d532d0"
  },
  {
    "url": "vue_v2/build.html",
    "revision": "8654c1bb8d8758cacf7ef5f4f6821063"
  },
  {
    "url": "vue_v2/component_merge.html",
    "revision": "555fe62d0a74962e0b0ba31a7a7c72df"
  },
  {
    "url": "vue_v2/constructor.html",
    "revision": "44a68e5c51ebd081a95122e00ef9dcd8"
  },
  {
    "url": "vue_v2/directory.html",
    "revision": "b6b6c51f8ed7f56635009c17f4c4de03"
  },
  {
    "url": "vue_v2/index.html",
    "revision": "badc5c4914f8a43c14bfd01e4e90bf57"
  },
  {
    "url": "vue_v2/init.html",
    "revision": "ea618be428ba64df539f68973a3db4ac"
  },
  {
    "url": "vue_v2/mergeOptions.html",
    "revision": "841de35591ece8c93588029113430a2a"
  },
  {
    "url": "vue_v2/new_vue.html",
    "revision": "02a08d3d8bfc3b2e623f814d3fd398ad"
  },
  {
    "url": "vue_v2/proxy.html",
    "revision": "b2ddaa8add63083d340b33ba9d7d6c3a"
  },
  {
    "url": "vue_v2/strats.html",
    "revision": "6cfa74dd504afd11cad3e4d89d47fed5"
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
