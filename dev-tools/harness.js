// Loads a Datapath build into jsdom with deterministic randomness.
const fs=require('fs'), path=require('path'), {JSDOM, VirtualConsole}=require('jsdom');
/* Inline every <script src> and stylesheet of a multi-file build, in order. Throws if any referenced file is missing. */
function inlineBuild(dir,file){ let html=fs.readFileSync(path.join(dir,file),'utf8'); const missing=[];
  html=html.replace(/<script src="([^"]+)"><\/script>/g,(m,src)=>{ const p=path.join(dir,src); if(!fs.existsSync(p)){ missing.push(src); return ''; } const t=fs.readFileSync(p,'utf8'); if(t.includes('</script')) throw new Error('script text contains </script: '+src); return '<script>\n'+t+'\n</script>'; });
  html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(m,href)=>{ const p=path.join(dir,href); if(!fs.existsSync(p)){ missing.push(href); return ''; } return '<style>\n'+fs.readFileSync(p,'utf8')+'\n</style>'; });
  if(missing.length) throw new Error('missing files referenced from '+file+': '+missing.join(', '));
  return html; }
function seeded(){ let s=12345; return ()=>{ s=(s*1664525+1013904223)%4294967296; return s/4294967296; }; }
async function load({dir,file,instrument,storage}){
  const errors=[]; const vc=new VirtualConsole();
  vc.on('jsdomError',e=>errors.push('jsdomError: '+(e.detail&&e.detail.stack||e.message)));
  vc.on('error',(...a)=>errors.push('console.error: '+a.join(' ')));
  vc.on('warn',(...a)=>errors.push('console.warn: '+a.join(' ')));
  let html=inlineBuild(dir,file);
  if(instrument){ html=html.replace("updateTopProgress();\nroute();\n})();", instrument+"\nupdateTopProgress();\nroute();\n})();"); if(!html.includes('__dp')) throw new Error('instrument failed'); }
  const dom=new JSDOM(html,{url:'http://localhost/'+file,runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
    beforeParse(w){ const r=seeded(); w.Math.random=r; w.__resetSeed=()=>{ const r2=seeded(); w.Math.random=r2; };
      w.scrollTo=()=>{}; w.HTMLElement.prototype.scrollIntoView=function(){};
      if(storage) Object.entries(storage).forEach(([k,v])=>{ try{w.localStorage.setItem(k,v);}catch(e){} }); } });
  await new Promise(res=>{ const w=dom.window; if(w.document.readyState==='complete') return res(); w.addEventListener('load',()=>res()); });
  await new Promise(r=>setTimeout(r,50));
  return {dom,w:dom.window,errors};
}
const tick=()=>new Promise(r=>setTimeout(r,0));
async function go(app,hash){ app.w.__resetSeed(); app.w.location.hash=hash; await tick(); await tick(); }
function snap(w){ const d=w.document; return JSON.stringify({ title:d.title, body:d.body.className, side:d.getElementById('sidebar').innerHTML, view:d.getElementById('view').innerHTML,
  prog:d.getElementById('progText').textContent, bar:d.getElementById('progBar').style.width, theme:d.documentElement.getAttribute('data-theme'), hash:w.location.hash }); }
module.exports={load,go,snap,tick,inlineBuild};
