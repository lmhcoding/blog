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
    "revision": "d8adc91f6d16017ca80f7c8277304d1c"
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
    "url": "assets/js/10.583fd3ea.js",
    "revision": "9989e6a7170e9294b1d41bede159fd85"
  },
  {
    "url": "assets/js/11.43b05f3b.js",
    "revision": "f1b5155c23b15282174b8ffeb05618ca"
  },
  {
    "url": "assets/js/2.44ac8053.js",
    "revision": "2ef4385a29e65f8ed965a766058cafc4"
  },
  {
    "url": "assets/js/3.734f836f.js",
    "revision": "02da2182c26b07379c86a06e4a963de9"
  },
  {
    "url": "assets/js/4.c288b124.js",
    "revision": "6069dd2300d7584bc59a35e9eabc2cfd"
  },
  {
    "url": "assets/js/5.d8b811b5.js",
    "revision": "42a1658734baeb5388bac41bf22144e7"
  },
  {
    "url": "assets/js/6.6e6df333.js",
    "revision": "6979342a761ee3d51feea8017cb4759b"
  },
  {
    "url": "assets/js/7.bd463a33.js",
    "revision": "04b29fa7f9bad1108d9caf09c232799b"
  },
  {
    "url": "assets/js/8.2798e0ad.js",
    "revision": "e20fc47311ce17f99f2744006ac8e1eb"
  },
  {
    "url": "assets/js/9.e03a4e61.js",
    "revision": "67fe288b90d11a8fa2edf80f780b005c"
  },
  {
    "url": "assets/js/app.c22f7c2b.js",
    "revision": "7ca6e0be48a6cf1fd83f51634748b3ff"
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
    "revision": "5d37df258d5977a2a610c2e8d5b302b6"
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
    "revision": "ce1ddd3444f5a26d7f4dfe1ad51e7a77"
  },
  {
    "url": "vue_v2/constructor.html",
    "revision": "2922a6a30c9048d89bed4f6aacc3c0b7"
  },
  {
    "url": "vue_v2/directory.html",
    "revision": "c96488cf55280d999f8a077be718304f"
  },
  {
    "url": "vue_v2/index.html",
    "revision": "961b83c57990aefe11d647df7ed7deb7"
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
