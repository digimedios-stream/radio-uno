const CACHE_NAME = 'radio-uno-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/styles.css',
    '/src/app.js',
    '/src/audio-visualizer.js',
    '/src/equalizer.js',
    '/src/pwa-installer.js',
    '/assets/logo.png'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache).catch(err => {
                    console.log('Error al cachear archivos:', err);
                    // Continuar incluso si algunos archivos fallan
                    return Promise.resolve();
                });
            })
    );
    self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
    // No cachear requests de audio streaming
    if (event.request.url.includes('stream.zeno.fm') || 
        event.request.url.includes('zeno.fm')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return new Response('Error de conexión', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                })
        );
        return;
    }
    
    // Estrategia: Cache first, fallback to network
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then((response) => {
                        // No cachear requests fallidas
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }
                        
                        // Cachear respuesta exitosa
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Fallback offline
                        return caches.match('/index.html');
                    });
            })
    );
});

// Mensaje desde el cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
