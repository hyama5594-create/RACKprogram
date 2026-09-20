/* キャッシュ名を変えると更新が配信されます（rack-v5 → rack-v6 …） */
const CACHE = 'rack-v5';
const ASSETS = ['./','./index.html','./manifest.json',
  './icon-180.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png',
  './man-today.png','./man-menu.png','./man-group.png','./man-session.png',
  './man-focus.png','./man-timer.png','./man-timerset.png','./man-plan.png','./man-log.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const cp = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
