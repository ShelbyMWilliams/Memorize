const C="memorize-v2";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>clients.claim())));
// Cache first (instant, works with no/slow connection), refresh in the background
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||e.request.method!=="GET")return;
e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
const net=fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>hit);
return hit||net}))});
