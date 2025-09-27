const CACHE_NAME = 'student-tracker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap',
  'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
  'https://picsum.photos/seed/studenttracker/192/192.jpg',
  'https://picsum.photos/seed/studenttracker/512/512.jpg'
];

// تثبيت Service Worker وتخزين الملفات في الذاكرة المؤقتة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker وحذف الذاكرة المؤقتة القديمة
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// الاستجابة للطلبات من الذاكرة المؤقتة أولاً، ثم من الشبكة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع النسخة المخزنة إذا كانت موجودة
        if (response) {
          return response;
        }
        
        // وإلا، قم بطلب الملف من الشبكة
        return fetch(event.request);
      })
  );
});