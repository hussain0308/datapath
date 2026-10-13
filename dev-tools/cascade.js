// Cascade equivalence: for real rendered pages, compute which declarations apply to every element (and pseudo-element)
// at several viewport widths, ordered by the CSS cascade (importance, specificity, source order), once using the ORIGINAL
// stylesheet order and once using the REFACTORED file order (main, layout, components). They must be identical.
const fs=require('fs'), postcss=require('postcss'), {calculate}=require('specificity'); const {load,go,tick}=require('./harness');
const P=require('./paths'); const ORIG_DIR=P.BACKUP_DIR, ORIG=P.BACKUP_FILE; const NEW=P.ROOT+'/';
const origHtml=fs.readFileSync(ORIG_DIR+'/'+ORIG,'utf8'); const origCss=origHtml.slice(origHtml.indexOf('<style>')+7,origHtml.indexOf('</style>'));
function rules(css){ const out=[]; postcss.parse(css).walkRules(r=>{ const media=r.parent.type==='atrule'?r.parent.params.replace(/\s+/g,''):null; const decls=r.nodes.filter(x=>x.type==='decl').map(d=>({p:d.prop,v:d.value,i:!!d.important})); out.push({sel:r.selector,media,decls}); }); return out; }
const R0=rules(origCss), R1=rules(['main','layout','components'].map(f=>fs.readFileSync(NEW+'assets/css/'+f+'.css','utf8')).join('\n'));
const key=r=>(r.media||'')+'|'+r.sel.replace(/\s+/g,' ')+'|'+r.decls.map(d=>d.p+':'+d.v+d.i).join(';');
const q=new Map(); R1.forEach((r,j)=>{ const k=key(r); (q.get(k)||q.set(k,[]).get(k)).push(j); });
const map0to1=R0.map(r=>q.get(key(r)).shift()); // original index -> new index
const split=sel=>sel.split(',').map(s=>s.trim());
const PSEUDO=/::(before|after|marker|placeholder|-webkit-details-marker)\b/, STATE=/:(hover|focus-visible|focus|active)\b/g;
function mediaOn(m,env){ if(!m) return true; if(/prefers-color-scheme:dark/.test(m)) return env.dark; if(/prefers-reduced-motion/.test(m)) return env.reduce; let mm; if((mm=m.match(/min-width:(\d+)px/))) return env.w>=+mm[1]; if((mm=m.match(/max-width:(\d+)px/))) return env.w<=+mm[1]; throw new Error('media '+m); }
const spec=s=>{ const r=calculate(s); return [r.A,r.B,r.C]; };
const cmp=(a,b)=>{ for(let i=0;i<a.length;i++) if(a[i]!==b[i]) return a[i]-b[i]; return 0; };
const parts0=R0.map(r=>split(r.sel).map(s=>({s,spec:spec(s),pseudo:(s.match(PSEUDO)||[])[1]||'',base:s.replace(PSEUDO,'').replace(STATE,'')||'*'})));
let diffs=0, comps=0; const seenDiff=new Set();
function pageCheck(w,label){
  const doc=w.document; const elId=new Map(); let n=0; const id=e=>{ if(!elId.has(e)) elId.set(e,n++); return elId.get(e); };
  const matches=new Map(); // elementKey -> [{ri,spec}]
  R0.forEach((r,ri)=>parts0[ri].forEach(p=>{ let list; try{ list=doc.querySelectorAll(p.base); }catch(e){ throw new Error('selector '+p.base); } list.forEach(el=>{ const k=id(el)+'#'+p.pseudo; (matches.get(k)||matches.set(k,[]).get(k)).push({ri,spec:p.spec}); }); }));
  const root=doc.documentElement; if(root.matches(':root')){ /* querySelectorAll does not match the root for ':root' in some engines */ }
  for(const env of [{w:400},{w:700},{w:1000},{w:1400}].flatMap(e=>[{...e,dark:false,reduce:false},{...e,dark:true,reduce:true}])){
    for(const [k,list] of matches){ const fam=new Map();
      const entries=list.filter(m=>mediaOn(R0[m.ri].media,env));
      const build=(orderOf)=>{ const f=new Map(); entries.forEach(m=>R0[m.ri].decls.forEach(d=>{ const fm=d.p.startsWith('--')?d.p:d.p.split('-')[0]; (f.get(fm)||f.set(fm,[]).get(fm)).push({imp:d.i?1:0,spec:m.spec,ord:orderOf(m.ri),p:d.p,v:d.v}); })); const out={}; f.forEach((arr,fm)=>{ arr.sort((a,b)=>a.imp-b.imp||cmp(a.spec,b.spec)||a.ord-b.ord); out[fm]=arr.map(x=>x.p+':'+x.v).join('|'); }); return out; };
      const A=build(ri=>ri), B=build(ri=>map0to1[ri]); comps++;
      for(const fm of Object.keys(A)) if(A[fm]!==B[fm]){ const sig=fm+'@'+R0.filter((_,i)=>entries.some(m=>m.ri===i)).length+k; diffs++; const dk=label+fm+k.split('#')[1]; if(!seenDiff.has(dk)&&seenDiff.size<8){ seenDiff.add(dk); const el=[...elId.entries()].find(([e,i])=>i===+k.split('#')[0])[0]; console.log('DIFF',label,'<'+el.tagName.toLowerCase()+' class="'+el.className+'"> pseudo='+k.split('#')[1],'family',fm,'width',env.w,'\n   orig:',A[fm].slice(-110),'\n   new :',B[fm].slice(-110)); } }
    }
  }
  return n;
}
(async()=>{
  const B=await load({dir:NEW,file:'index.html'}); const lessons=['vlookup','inner-join','column-chart','combo-chart','pie-chart','line-chart','dashboard','row-number','left-join','if','recursive-cte','sum'];
  const pages=[['#/','landing'],['#/learn','learn'],['#/module/excel','module'],['#/module/sql','module-sql'],...lessons.map(l=>['#/lesson/'+l,'lesson:'+l])];
  let totalEls=0;
  for(const [h,label] of pages){ await go(B,h); const d=B.w.document;
    if(label.startsWith('lesson:')){ d.querySelectorAll('.opt').forEach((b,i)=>{ if(!b.disabled&&i%3===0) b.click(); }); await tick(); d.querySelectorAll('details').forEach(x=>x.setAttribute('open','')); if(label==='lesson:vlookup'){ const s=d.getElementById('search'); s.value='join'; s.dispatchEvent(new B.w.Event('input',{bubbles:true})); await tick(); } }
    if(label==='lesson:sum') d.body.classList.add('drawer');
    totalEls+=pageCheck(B.w,label); }
  console.log('pages checked:',pages.length,'| elements x widths x schemes compared:',comps,'| style differences:',diffs); process.exit(diffs?1:0);
})().catch(e=>{ console.error('ERR',e); process.exit(2); });
