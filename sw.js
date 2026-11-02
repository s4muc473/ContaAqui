// Service worker do MyCoin.
//
// Duas regras que não podem ser quebradas:
// 1. /api nunca é cacheado. São dados financeiros, e servir uma resposta velha
//    ali seria pior do que falhar.
// 2. O código do app é sempre buscado na rede primeiro. Servir JS do cache junto
//    com um HTML novo mistura duas versões e quebra a tela de formas difíceis de
//    diagnosticar. O cache do app existe como rede de segurança offline, não
//    como fonte preferencial.

const VERSAO = 'mycoin-v2';
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

self.addEventListener('fetch', evento => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const mesmaOrigem = url.origin === location.origin;

  if (mesmaOrigem && url.pathname.startsWith('/api/')) return;

  // CDNs versionam na própria URL, então o conteúdo nunca muda: cache serve.
  evento.respondWith(mesmaOrigem ? redePrimeiro(req) : cachePrimeiro(req));
});

async function redePrimeiro(req) {
  const chave = req.mode === 'navigate' ? PAGINA : req;
  try {
    const resposta = await fetch(req);
    if (resposta.ok) guardar(chave, resposta.clone());
    return resposta;
  } catch (e) {
    return (await caches.match(chave)) || Response.error();
  }
}

async function cachePrimeiro(req) {
  const emCache = await caches.match(req);
  if (emCache) return emCache;
  try {
    const resposta = await fetch(req);
    if (resposta.ok || resposta.type === 'opaque') guardar(req, resposta.clone());
    return resposta;
  } catch (e) {
    return Response.error();
  }
}

function guardar(chave, resposta) {
  caches.open(CACHE_APP).then(cache => cache.put(chave, resposta)).catch(() => {});
}
