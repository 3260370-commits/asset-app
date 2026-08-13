// ═══════════════════════════════════════════════════════════
// sw.js — 오프라인 캐시 (PWA, 자산관리 포트폴리오 관리 앱 전용)
// ═══════════════════════════════════════════════════════════

const CACHE = 'asset-app-v5';
const CACHED_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CACHED_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 외부 요청(GitHub API 등)은 서비스워커가 건드리지 않음
  if (!e.request.url.startsWith(self.location.origin)) return;
  // POST 요청도 건드리지 않음
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
