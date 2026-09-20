/**
 * Service Worker - PWA Offline Support
 * تصميم وبرمجة: عبد الباسط خدومة
 */

const CACHE_NAME = 'anime-summaries-v1';
const ASSETS = [
  './',
  './index.html',
  './arc.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './js/arc.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// تثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// تفعيل - حذف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// استراتيجية: Cache First ثم Network
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // لا نخزن استجابات غير ناجحة أو غير أساسية
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });

        return response;
      }).catch(() => {
        // إذا فشل الشبكة والصفحة غير موجودة في الكاش
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
