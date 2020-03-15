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
    "revision": "1b2d50553ef13fbae7b81f1f798cbbb8"
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
    "url": "assets/js/14.1f2cd136.js",
    "revision": "991bbfafeedded703e80b1d7f62cd125"
  },
  {
    "url": "assets/js/15.378b3b44.js",
    "revision": "d842c5c10201091005ec4011316ee5fc"
  },
  {
    "url": "assets/js/16.a355d78b.js",
    "revision": "4d07ac5a2ffd3340c96aa9ba89b147c3"
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
    "url": "assets/js/4.6e78cf19.js",
    "revision": "256ce84f2571be937718976ffa754108"
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
    "url": "assets/js/app.9bc7718c.js",
    "revision": "78c4edf659d0baf5aa72ccac98842ca2"
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
    "revision": "8a20ea4ce2f909dda3e8be4f95f08b2a"
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
    "revision": "96b6efe23ca347b89398a97821931aa0"
  },
  {
    "url": "vue_v2/component_merge.html",
    "revision": "48350557473b49511b945d70c705fa40"
  },
  {
    "url": "vue_v2/constructor.html",
    "revision": "e93625654686c289ab152382bf04d181"
  },
  {
    "url": "vue_v2/directory.html",
    "revision": "3f81b116b4e9ce0cbf5aba52890941c5"
  },
  {
    "url": "vue_v2/index.html",
    "revision": "7da1933ff6f7ea161ae0688ba84c38e1"
  },
  {
    "url": "vue_v2/mergeOptions.html",
    "revision": "fab95f8d9927ad76abea6c8379d4a44b"
  },
  {
    "url": "vue_v2/new_vue.html",
    "revision": "0963add32ad00300deee39b28b153c44"
  },
  {
    "url": "vue_v2/proxy.html",
    "revision": "aa326c4ca6ad7f5016750399458af80e"
  },
  {
    "url": "vue_v2/strats.html",
    "revision": "088cf6f734e8d07884d02a57f3fe18d6"
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
