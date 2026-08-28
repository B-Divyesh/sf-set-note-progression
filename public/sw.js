const VERSION = 'snp-shell-v4';
const SHELL = ['/', '/offline.html', '/offline.css', '/manifest.webmanifest', '/favicon.svg', '/art/load-constellation.webp', '/art/load-constellation-768.webp'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    const response = await fetch('/index.html');
    const html = await response.text();
    await cache.put('/index.html', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
    const builtAssets = Array.from(html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g), (match) => match[1]);
    await cache.addAll([...SHELL, ...builtAssets]);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => ![VERSION, 'snp-loaded-v2'].includes(key)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone(); caches.open(VERSION).then((cache) => cache.put('/index.html', copy)); return response;
    }).catch(async () => (await caches.match('/index.html')) || (await caches.match('/offline.html'))));
    return;
  }
  event.respondWith(caches.match(url.href, { ignoreSearch: true }).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) { const copy = response.clone(); caches.open(VERSION).then((cache) => cache.put(request, copy)); }
    return response;
  })));
});
