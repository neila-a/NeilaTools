const
    version = '1.1.0',
    dev = true,
    devVersion = 8
    CACHE = `NeilaTools-${version}-${dev ? `dev-${devVersion}` : "prod"}`,
    installFilesEssential = [
        '/',
        '/audiotools',
        '/bigtime',
        '/pi',
        "/filter",
        '/reversal',
        '/shaizi',
        '/manifest.json',
        '/favicon.png',
    ];
// install static assets
function installStaticFiles() {
    return caches.open(CACHE).then(cache => {
        return cache.addAll(installFilesEssential);
    });
}
function clearOldCaches() {
    return caches.keys().then(keylist => {
        return Promise.all(
            keylist
                .filter(key => key !== CACHE)
                .map(key => caches.delete(key))
        );
    });
}
self.addEventListener('install', event => event.waitUntil(installStaticFiles().then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(clearOldCaches().then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    let url = event.request.url;
    event.respondWith(
        caches.open(CACHE).then(cache => {
            return cache.match(event.request).then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(newreq => {
                    console.log(`network fetch: ${url}`);
                    if (newreq.ok) cache.put(event.request, newreq.clone());
                    return newreq;
                }).catch(() => null);
            });
        })
    );
});
