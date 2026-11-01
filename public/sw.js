const version = 'xly-shell-v6';
const files = ['index.html', 'main.js', 'apps-config.js', 'styles.css', 'manifest.webmanifest',
  ...['campus.svg','xly-icon.svg','print_logo.svg','delivery.svg','tools.svg','lost.svg','more.svg',
      'icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'].map(name => 'icons/' + name)];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(version).then(cache => cache.addAll(files)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('xly-shell-') && key !== version) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  const path = url.pathname.slice(1) || 'index.html';
  if (!files.includes(path) && !path.startsWith('icons/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(version);
    try {
      const response = await fetch(req, {cache:'no-cache'});
      if (response.ok && response.type === 'basic') await cache.put(path, response.clone());
      return response;
    } catch (error) {
      return await cache.match(path) || Response.error();
    }
  })());
});
