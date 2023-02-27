// autogen script
(()=>{var a={name:"neilatools",version:"1.3.0",devVersion:"256",dev:!0,private:!0,description:"Something useless tools",scripts:{dev:"next dev",build:"next build",start:"next start",lint:"next lint",genWorker:'echo "// autogen script" > public/service-worker.js && esbuild components/service-worker.js --bundle --minify >> public/service-worker.js'},dependencies:{"@emotion/react":"^11.10.5","@emotion/styled":"^11.10.5","@mui/icons-material":"^5.11.0","@mui/material":"^5.11.10","@mui/styled-engine-sc":"^5.11.9",eruda:"^2.11.2",filepond:"^4.30.4","filepond-plugin-file-rename":"^1.1.8","filepond-plugin-image-crop":"^2.0.6","filepond-plugin-image-edit":"^1.6.3","filepond-plugin-image-preview":"^4.6.11","filepond-plugin-image-resize":"^2.0.10","lp-logger":"github:neila-a/lp-logger-no-window",mathjs:"^11.5.1",moment:"^2.29.4",next:"13.2.1",nzh:"^1.0.8",pi:"^2.0.4",react:"18.2.0","react-dom":"18.2.0","react-draggable":"^4.4.5","react-filepond":"^7.1.2",sass:"^1.58.0",sharp:"^0.31.3","styled-components":"^5.3.6"},devDependencies:{"@types/node":"18.14.2","@types/react":"18.0.28","@types/react-dom":"18.0.11",eslint:"8.35.0","eslint-config-next":"13.2.1",typescript:"4.9.5"},homepage:"https://tools.neila.ga/"};var{version:d,devVersion:p,dev:u}=a,i=`NeilaTools-${d}-${u==!0?`dev${p}`:"prod"}`,l=e=>console.log("%cServiceWorker","background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em",e),g=()=>caches.open(i).then(e=>e.addAll(h).catch(console.error)),m=()=>caches.keys().then(e=>Promise.all(e.filter(t=>t!==i).map(t=>(l(`\u5DF2\u5220\u9664\u7F13\u5B58\u201C${t}\u201D`),caches.delete(t))))),h=["/","/tool","/settings","/index.webmanifest","/image/favicon.png"];l(`\u7248\u672C\u4E3A${i}`);self.addEventListener("install",e=>{e.waitUntil(g().then(()=>self.skipWaiting()))});self.addEventListener("activate",e=>e.waitUntil(m().then(()=>self.clients.claim())));self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;let{requrl:t}=e.request,n=String(t);e.respondWith(caches.open(i).then(s=>s.match(e.request).then(o=>o||fetch(e.request).then(r=>(n.replace(/\/\?searchText=.*/g,"")==""||n.replace(/chrome-extension.*/g,"")==""==""||(l(`Network fetch: ${n}`),r.ok&&s.put(e.request,r.clone())),r)).catch(console.error))))});var b=i;})();
