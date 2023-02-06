// autogen script
(()=>{var p=Object.create;var l=Object.defineProperty;var m=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var f=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty;var h=e=>l(e,"__esModule",{value:!0});var v=(e=>typeof require!="undefined"?require:typeof Proxy!="undefined"?new Proxy(e,{get:(t,n)=>(typeof require!="undefined"?require:t)[n]}):e)(function(e){if(typeof require!="undefined")return require.apply(this,arguments);throw new Error('Dynamic require of "'+e+'" is not supported')});var k=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of u(t))!g.call(e,i)&&(n||i!=="default")&&l(e,i,{get:()=>t[i],enumerable:!(r=m(t,i))||r.enumerable});return e},b=(e,t)=>k(h(l(e!=null?p(f(e)):{},"default",!t&&e&&e.__esModule?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var w="neilatools",x="1.3.0",y="1",E=!0,W={dev:"next dev",build:"next build",start:"next start",lint:"next lint",genWorker:'echo "// autogen script" > public/service-worker.js && esbuild components/service-worker.js --bundle --minify >> public/service-worker.js'},$={"@emotion/react":"^11.10.5","@emotion/styled":"^11.10.5","@fontsource/roboto":"^4.5.8","@mui/icons-material":"^5.11.0","@mui/material":"^5.11.7",filepond:"^4.30.4","filepond-plugin-file-rename":"^1.1.8","filepond-plugin-image-crop":"^2.0.6","filepond-plugin-image-edit":"^1.6.3","filepond-plugin-image-preview":"^4.6.11","filepond-plugin-image-resize":"^2.0.10","lp-logger":"github:neila-a/lp-logger-no-window",mathjs:"^11.5.1",moment:"^2.29.4",next:"13.0.3",pi:"^2.0.4",react:"18.2.0","react-dom":"18.2.0","react-filepond":"^7.1.2",sass:"^1.58.0"},j={"@types/node":"18.11.9","@types/react":"18.0.25","@types/react-dom":"18.0.8",eslint:"8.27.0","eslint-config-next":"13.0.3",typescript:"4.8.4"},a={name:w,version:x,devVersion:y,private:E,scripts:W,dependencies:$,devDependencies:j};var c=b(v("https://cdn.skypack.dev/lp-logger")),L=self,U=new c.default({name:"ServiceWorker",level:"log"});L.toolsTo=["audiotools","countletter","clock","pi","reversal","shaizi","filter","keycode","readnumber"];var{version:T,devVersion:d}=a,s=`NeilaTools-${T}-${d!=0?`dev${d}`:"prod"}`,q=["/",...toolsTo.map(e=>`/tools/${tool.to}`),"/index.webmanifest","/favicon.png"],S=()=>caches.open(s).then(e=>e.addAll(q)),z=()=>caches.keys().then(e=>Promise.all(e.filter(t=>t!==s).map(t=>caches.delete(t))));self.addEventListener("install",e=>e.waitUntil(S().then(()=>self.skipWaiting())));self.addEventListener("activate",e=>e.waitUntil(z().then(()=>self.clients.claim())));self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;let{url:t}=e.request;e.respondWith(caches.open(s).then(n=>n.match(e.request).then(r=>r||fetch(e.request).then(i=>(console.log("%cServiceWorker","background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em",`Network fetch: ${t}`),i.ok&&n.put(e.request,i.clone()),i)).catch(console.error))))});})();
