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
    "revision": "81d8bccac8d1de888f4a6a4a26537f0a"
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
    "url": "assets/js/10.bd5f5607.js",
    "revision": "c9b4cbb77cd8a94d9ec8a0305b5b9619"
  },
  {
    "url": "assets/js/11.396bbf02.js",
    "revision": "77f36d24d30df2249fc17838b08858fd"
  },
  {
    "url": "assets/js/12.75269b8a.js",
    "revision": "cb5bfa97a86c9e211a73037c3ed669df"
  },
  {
    "url": "assets/js/13.495f7b28.js",
    "revision": "e032fdb5ffdca49a5bb08ed0f2bb51ee"
  },
  {
    "url": "assets/js/14.d78bfe9c.js",
    "revision": "57af3a4c4aae47d47f26d81ce45632fa"
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
    "url": "assets/js/4.46a478a8.js",
    "revision": "0c9e9c1f1f07e098158f3e1ef70030f1"
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
    "url": "assets/js/9.91a99494.js",
    "revision": "860885f3952e056eab96493aff450070"
  },
  {
    "url": "assets/js/app.e2a594f6.js",
    "revision": "587619f5a9603c5b648d6125516a0845"
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
    "revision": "e56abdad711bea432c854db35535525c"
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
    "revision": "8852ff637d593785e646b674ba68fd53"
  },
  {
    "url": "vue_v2/constructor.html",
    "revision": "05f8333a26fd3142c1326f3efc21a0f4"
  },
  {
    "url": "vue_v2/directory.html",
    "revision": "ef32348c55876c6e709bb625a6ded909"
  },
  {
    "url": "vue_v2/index.html",
    "revision": "7d942df587dfb26aaef26b0b4a016ba4"
  },
  {
    "url": "vue_v2/mergeOptions.html",
    "revision": "321ba194c32ddc36e668c06511ff23d2"
  },
  {
    "url": "vue_v2/new_vue.html",
    "revision": "61f85988cfcc4d7af50d36a05df54ac5"
  },
  {
    "url": "vue_v2/strats.html",
    "revision": "41270d6100521cb61364eecfc8e9d4b5"
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
