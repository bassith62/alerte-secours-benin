/* Service Worker — l'app doit rester utilisable même sans réseau.
   Stratégie :
   - fichiers de l'app : cache d'abord (démarrage instantané, hors-ligne garanti)
   - navigation : si le réseau échoue, on sert l'app depuis le cache
   - ressources externes (carte, etc.) : réseau avec repli cache
*/

const CACHE = 'alerte-secours-v5';
const FICHIERS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

// Installe : on met tout en cache immédiatement
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FICHIERS)).catch(() => {})
  );
  self.skipWaiting();
});

// Active : purge des anciens caches + prise de contrôle des pages ouvertes
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', event => {
  const requete = event.request;

  // Seules les requêtes GET sont mises en cache
  if (requete.method !== 'GET') return;

  // 1. Navigation (ouverture de l'app, rechargement) : cache, sinon réseau,
  //    et si les deux échouent → l'app en cache (jamais d'écran blanc)
  if (requete.mode === 'navigate') {
    event.respondWith(
      fetch(requete)
        .then(reponse => {
          const copie = reponse.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copie)).catch(() => {});
          return reponse;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE);
          return (await cache.match('./index.html')) ||
                 (await cache.match('./')) ||
                 new Response('<h1>Hors ligne</h1>', { headers: { 'Content-Type': 'text/html' } });
        })
    );
    return;
  }

  // 2. Fichiers de l'app : cache d'abord, puis réseau (et on met en cache au passage)
  event.respondWith(
    caches.match(requete).then(enCache => {
      if (enCache) return enCache;
      return fetch(requete)
        .then(reponse => {
          if (reponse && reponse.status === 200) {
            const copie = reponse.clone();
            caches.open(CACHE).then(c => c.put(requete, copie)).catch(() => {});
          }
          return reponse;
        })
        .catch(() => enCache); // rien de disponible : on laisse échouer proprement
    })
  );
});
