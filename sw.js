const C="memorize-v3";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>clients.claim())));
// Network first (always gets your newest files when online); falls back to the saved copy offline or on a very slow connection
self.addEventListener("fetch",e=>{
  const req=e.request,u=new URL(req.url);
  if(u.origin!==location.origin||req.method!=="GET")return;
  e.respondWith(new Promise(res=>{
    let done=false;
    const saved=()=>caches.match(req,{ignoreSearch:true});
    const t=setTimeout(()=>{saved().then(h=>{if(h&&!done){done=true;res(h)}})},4000);
    fetch(u.href,{cache:"no-store"}).then(r=>{
      if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(req,c))}
      clearTimeout(t);if(!done){done=true;res(r)}
    }).catch(()=>{
      clearTimeout(t);
      saved().then(h=>{if(!done){done=true;res(h||Response.error())}});
    });
  }));
});
