const CACHE_NAME = 'brotes-appshell-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/activities.html',
  '/css/home.css',
  '/css/styles.css',
  '/css/dashboard.css',
  '/css/admin.css',
  '/js/auth.js',
  '/js/dashboard.js',
  '/js/admin.js',
  '/js/activities.js',
  '/img/Logo.png',
  '/img/huerto.jpg',
  '/img/hojas-textura.jpg',
  '/manifest.json'  
];

// cache del appshell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// limpiar versiones viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignorar peticiones del navegador tipo navegación (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // No cachear login ni profile
  if (request.url.includes('/api/login') || request.url.includes('/api/profile')) {
    event.respondWith(
      fetch(request)
        .then(response => response)
        .catch(() => new Response(JSON.stringify({ error: 'No hay conexión' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  //Para el resto de assets, usar cache first
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(request).then(response => {
          // Evitar cachear respuestas redirigidas u opacas
          if (response.type === 'opaqueredirect') return response;
          return response;
        })
      );
    })
  );
});
