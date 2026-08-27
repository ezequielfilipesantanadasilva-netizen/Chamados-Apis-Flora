/**
 * Service Worker do Apis Flora — Central de Chamados
 * -----------------------------------------------------
 * Só existe pra UMA coisa: garantir que o navegador NUNCA sirva uma cópia
 * antiga guardada em cache desse sistema. Ele não guarda nada, não deixa
 * nada offline — toda requisição é sempre buscada direto da rede.
 *
 * Isso resolve o problema de "só funciona em aba anônima": em aba normal,
 * o navegador às vezes insiste em reaproveitar uma versão antiga do site
 * que ficou guardada localmente. Esse arquivo desliga esse comportamento
 * de vez para este site.
 *
 * COMO PUBLICAR:
 * 1. Coloque este arquivo (sw.js) na MESMA pasta do apis-flora-chamados.html
 *    no seu repositório do GitHub Pages.
 * 2. Não precisa fazer mais nada — o próprio HTML já tenta registrar esse
 *    arquivo sozinho, se ele existir.
 * 3. Depois de publicar, quem já tinha o site aberto precisa fechar e abrir
 *    a aba de novo uma vez pra esse Service Worker entrar em ação (é assim
 *    que Service Worker funciona em todo navegador, não é algo que dá pra
 *    evitar). Da segunda vez em diante, o cache nunca mais vai atrapalhar.
 */

// entra em ação imediatamente, sem esperar todas as abas antigas fecharem
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// toda requisição feita pela página (o próprio HTML, imagens, etc.)
// é sempre buscada direto da rede, nunca do cache do navegador.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => {
      // se não tiver internet nesse instante, não tem cache pra recorrer
      // (de propósito — esse service worker não guarda nada)
      return new Response(
        'Sem conexão com a internet no momento. Tente de novo em alguns segundos.',
        { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
      );
    })
  );
});
