// 术语闪卡 Service Worker：HTML 网络优先（拿新版），静态资源缓存优先；API/跨域不拦截
const CACHE = "shuyu-flashcards-v2";
const ASSETS = ["./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const isHtml = e.request.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/" || url.pathname.endsWith("/");
  if (isHtml) {
    // 网络优先：有新版本立刻用上，离线时回退缓存
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(h => h || caches.match("./index.html")))
    );
  } else {
    // 图标/manifest 缓存优先
    e.respondWith(
      caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }))
    );
  }
});
