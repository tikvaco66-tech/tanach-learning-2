const CACHE = "masa-batanach-v21";
const ASSETS = [
 "./","./index.html","./style.css?v=12","./app.js?v=14","./chapter-menu.js?v=1",
 "./interactive-games.js?v=1","./depth-extended-games.js?v=1","./depth-library.js?v=2",
 "./chapters.html","./all-required-chapters.html","./curriculum-grades-3-6.html",
 "./grade3-genesis-24.html","./grade3-genesis-25.html","./grade3-genvat-habrachot.html",
 "./grade4-exodus-1-5.html","./grade4-exodus-complete.html",
 "./grade5-cloud-and-fire.html","./grade5-complaints-and-elders.html","./grade5-leviticus-19.html",
 "./grade6-joshua-3.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match("./index.html"))));
});
