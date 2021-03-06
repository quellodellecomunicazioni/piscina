const cacheName = 'pool-v1'

const staticAssets = [
    './index.html',
    './agosto.html',
    './assegna.html',
    './giugno.html',
    './luglio.html',
    './manifest.webmanifest',
    './mesi.html',
    './orario.html',
    './prenota.html',
    './settembre.html',
    './stato.html',
    './style.css',
    './media/pool.jpg',
    './media/icon64.png',
    './media/icon128.png',
    './media/icon256.png'
]

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    self.clients.claim();
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}