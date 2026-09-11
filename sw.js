/* =========================================================
   Abdallah Abas Blog — Service Worker
   Cache-first للأصول، Network-first للصفحات
   ========================================================= */

const VERSION = 'aab-v1.0.0';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/articles.html',
  '/categories.html',
  '/about.html',
  '/contact.html',
  '/search.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/js/data.js',
  '/assets/js/app.js',
  '/assets/img/logo.svg',
  '/manifest.webmanifest'
];

/* Install */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Precache failed', err))
  );
});

/* Activate — حذف الكاشات القديمة */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Fetch */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  /* تجاهل الطلبات غير GET والدومينات الخارجية */
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin) &&
      !req.url.startsWith('https://fonts.')) return;

  /* الصفحات: Network-first */
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/404.html')))
    );
    return;
  }

  /* الأصول: Cache-first */
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(RUNTIME_CACHE).then(c => c.put(req, clone));
        return res;
      });
    })
  );
});
