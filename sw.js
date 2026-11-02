// Service worker do MyCoin.
// Regra que não pode ser quebrada: /api nunca é cacheado. São dados financeiros,
// e servir uma resposta velha aqui seria pior do que falhar.

const VERSAO = 'mycoin-v1';
const CACHE_APP = `${VERSAO}-app`;
const PAGINA = '/index.html';

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_APP)
      .then(cache => cache.addAll([PAGINA, '/']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(
        nomes.filter(n => !n.startsWith(VERSAO)).map(n => caches.delete(n)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', evento => {
  if (evento.data === 'pular-espera') self.skipWaiting();
});

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) return;

  // Navegação: tenta a rede primeiro, para pegar deploy novo assim que houver.
  if (req.mode === 'navigate') {
    evento.respondWith(
      fetch(req)
        .then(resposta => {
          guardar(CACHE_APP, PAGINA, resposta.clone());
          return resposta;
        })
        .catch(async () => (await caches.match(PAGINA)) || Response.error()),
    );
    return;
  }

  // Demais recursos (código do app e CDNs): serve do cache e revalida ao fundo.
  evento.respondWith(
    caches.match(req).then(emCache => {
      const daRede = fetch(req)
        .then(resposta => {
          if (resposta && (resposta.ok || resposta.type === 'opaque')) {
            guardar(CACHE_APP, req, resposta.clone());
          }
          return resposta;
        })
        .catch(() => emCache || Response.error());
      return emCache || daRede;
    }),
  );
});

function guardar(nomeCache, chave, resposta) {
  caches.open(nomeCache).then(cache => cache.put(chave, resposta)).catch(() => {});
}
