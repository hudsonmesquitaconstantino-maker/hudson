/* Financeiro — modo offline. Busca sempre a versão nova quando há internet; sem internet, usa a cópia guardada. */
var CACHE='finH-v2';
var ASSETS=['./','./index.html','./manifest.json','./icone-180.png','./icone-192.png','./icone-512.png'];
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){})}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k.indexOf('finH-')===0&&k!==CACHE)return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 if(e.request.method!=='GET')return;
 var u=new URL(e.request.url);if(u.origin!==location.origin||u.pathname.indexOf('/financas/')<0)return;
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(function(r){if(r&&r.ok){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp).catch(function(){})})}return r})
  .catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('./index.html')})}));
});
