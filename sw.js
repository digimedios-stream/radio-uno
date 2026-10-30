const CACHE_NAME = 'radio-uno-v9';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './src/styles.css?v=9',
    './src/app.js?v=9',
    './src/audio-visualizer.js?v=9',
    './src/equalizer.js?v=9',
    './src/pwa-installer.js?v=9',
    './assets/logo.png'
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
    // Forzar al nuevo SW a tomar el control inmediatamente
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
    
    // Estrategia: Network first evitando caché HTTP de disco en móviles, fallback to cache
    event.respondWith(
        fetch(event.request, { cache: 'no-cache' })
            .then((response) => {
                // Validar la respuesta
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                
                // Cachear respuesta exitosa para uso offline futuro
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                
                return response;
            })
            .catch(() => {
                // Si el usuario no tiene internet (falla fetch), servir desde el cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        
                        // Fallback genérico para vistas HTML
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('./index.html');
                        }
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
