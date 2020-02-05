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
    "revision": "823947e8d5a7de152aa72534efa2c173"
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
    "url": "assets/js/10.6736cc39.js",
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
    "url": "assets/js/6.2fb4c635.js",
    "revision": "5e07e93933b60e71952272af2dc88b25"
  },
  {
    "url": "assets/js/7.e787cb84.js",
    "revision": "81fbc4e3aaceae23676b7e48cf302a86"
  },
  {
    "url": "assets/js/8.9301c1bf.js",
    "revision": "177497e9c51e2eac83923d14a2b4b32d"
  },
  {
    "url": "assets/js/9.4959d42d.js",
    "revision": "44b0c2bb19e5a6e9f6749efb09ec671a"
  },
  {
    "url": "assets/js/app.1f693d34.js",
    "revision": "984d015da3617e27395b114fe382b86e"
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
    "revision": "8c87dd5b97d0c203b0eacdd8bf8f809c"
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
    "url": "vue/v2/prepare/build.html",
    "revision": "17fa2e4456c156847fd5a9b5772698f3"
  },
  {
    "url": "vue/v2/prepare/constructor.html",
    "revision": "adef8aaf76af9bdab0b8f529caf82338"
  },
  {
    "url": "vue/v2/prepare/directory.html",
    "revision": "3a45f35d69519356f3ddd487c666ba85"
  },
  {
    "url": "vue/v2/prepare/index.html",
    "revision": "9cf8981d750921c08bc4c79202c70e2a"
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
