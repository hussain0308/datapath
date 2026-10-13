const path=require('path'), fs=require('fs'); const {load,go,snap,tick}=require('./harness');
const P=require('./paths'); const ORIG_DIR=P.BACKUP_DIR, ORIG=P.BACKUP_FILE;
const NEW_DIR=process.argv[2]||P.ROOT;
let fails=0, checks=0; const ok=(c,msg)=>{ checks++; if(!c){ fails++; console.log('FAIL:',msg);} };
(async()=>{
  const INSTR="window.__dp={CURRICULUM,LESSONS,DEEP,ORDER,MODBLURB,PRODUCTS,SALES,STAFF,MONTHLY,EMP,DEPT,CUST,ORD,MONTHS5,SALESLOG,CODEST:CODEST('x','y')};";
  const A=await load({dir:ORIG_DIR,file:ORIG,instrument:INSTR}), B=await load({dir:NEW_DIR,file:'index.html'});
  console.log('load errors  original:',A.errors.length,' refactored:',B.errors.length); A.errors.concat(B.errors).forEach(e=>console.log('  ',e.slice(0,300)));
  // ---------- data equality
  const a=A.w.__dp, b=B.w.Datapath;
  const J=x=>JSON.stringify(x);
  const aIds=Object.keys(a.LESSONS), bIds=Object.keys(b.lessons);
  ok(aIds.length===178&&bIds.length===178,'lesson count '+aIds.length+' / '+bIds.length);
  ok(J(aIds.slice().sort())===J(bIds.slice().sort()),'same lesson id sets');
  let diffL=0,diffD=0; aIds.forEach(id=>{ if(J(a.LESSONS[id])!==J(b.lessons[id])){ diffL++; console.log('  core differs',id);} if(J(a.DEEP[id])!==J(b.deep[id])){ diffD++; console.log('  deep differs',id);} });
  ok(diffL===0,'core lesson content identical for all ids ('+diffL+' differ)'); ok(diffD===0,'extended content identical for all ids ('+diffD+' differ)');
  ok(Object.keys(a.DEEP).length===Object.keys(b.deep).length,'deep count');
  ok(J(a.ORDER)===J(b.curriculum.ORDER),'ORDER identical (learning order)');
  const stripBlurb=c=>({id:c.id,title:c.title,planned:c.planned,open:c.open,sections:c.sections});
  ok(J(a.CURRICULUM.map(stripBlurb))===J(b.courses.map(stripBlurb)),'CURRICULUM identical (ids, titles, sections, lesson ids)');
  ok(J(a.CURRICULUM.map(c=>a.MODBLURB[c.id]))===J(b.courses.map(c=>c.blurb)),'module blurbs identical');
  ['PRODUCTS','SALES','STAFF','MONTHLY','MONTHS5','SALESLOG'].forEach(k=>ok(J(a[k])===J(b.datasets.excel[k]),'dataset '+k));
  ['EMP','DEPT','CUST','ORD'].forEach(k=>ok(J(a[k])===J(b.datasets.sql[k]),'dataset '+k));
  // ---------- every route renders identically
  const routes=['#/','#/learn','#/module/excel','#/module/sql','#/module/python','#/module/nope','#/lesson/nope'].concat(aIds.map(i=>'#/lesson/'+i));
  let renderDiff=0;
  for(const r of routes){ await go(A,r); await go(B,r); const sa=snap(A.w), sb=snap(B.w); if(sa!==sb){ renderDiff++; console.log('  RENDER DIFF at',r); if(renderDiff<4){ const ja=JSON.parse(sa), jb=JSON.parse(sb); for(const k of Object.keys(ja)) if(ja[k]!==jb[k]){ let i=0; while(i<ja[k].length&&ja[k][i]===jb[k][i])i++; console.log('    field',k,'at',i,'\n     A:',ja[k].slice(Math.max(0,i-60),i+80),'\n     B:',jb[k].slice(Math.max(0,i-60),i+80)); } } } }
  ok(renderDiff===0,'rendered HTML (view+sidebar+title+body class+progress) identical for '+routes.length+' routes ('+renderDiff+' differ)');
  // ---------- interactions
  const both=async fn=>{ const ra=await fn(A), rb=await fn(B); return [ra,rb]; };
  // search
  await go(A,'#/lesson/vlookup'); await go(B,'#/lesson/vlookup');
  for(const q of ['join','sum','zzzz','Window','']){ const [x,y]=await both(async app=>{ const s=app.w.document.getElementById('search'); s.value=q; s.dispatchEvent(new app.w.Event('input',{bubbles:true})); await tick(); return app.w.document.getElementById('sidebar').innerHTML; }); ok(x===y,'search "'+q+'" sidebar identical ('+(x.match(/class="lnk/g)||[]).length+' hits)'); }
  // module/section toggles
  for(const sel of ['.mod-head[data-mod="sql"]','.mod-head[data-mod="excel"]','.sec-head']){ const [x,y]=await both(async app=>{ const el=app.w.document.querySelector(sel); el.click(); await tick(); return app.w.document.getElementById('sidebar').innerHTML; }); ok(x===y,'sidebar toggle '+sel); }
  // quiz: answer q1..q5 with first option, then compare score, progress storage, sidebar
  await go(A,'#/lesson/vlookup'); await go(B,'#/lesson/vlookup');
  const quiz=async app=>{ const d=app.w.document; for(let qi=0;qi<5;qi++){ const btn=d.querySelector('.opt[data-q="'+qi+'"]:not([disabled])'); btn.click(); } await tick(); return {quiz:d.getElementById('quiz').innerHTML, store:app.w.localStorage.getItem('datapath_progress_v1'), prog:d.getElementById('progText').textContent, bar:d.getElementById('progBar').style.width, side:d.getElementById('sidebar').innerHTML}; };
  const [qa,qb]=await both(quiz); ok(J(qa)===J(qb),'quiz answering, score, saved progress, top bar and sidebar completion identical'); console.log('   saved progress (refactored):',qb.store,'|',qb.prog);
  const [ra,rb]=await both(async app=>{ app.w.document.getElementById('retry').click(); await tick(); return app.w.document.getElementById('quiz').innerHTML; }); ok(ra===rb,'quiz retry identical');
  // second lesson with worse score keeps best
  await go(A,'#/lesson/sum'); await go(B,'#/lesson/sum'); const [qa2,qb2]=await both(quiz); ok(J(qa2)===J(qb2),'second lesson quiz identical'); console.log('   saved progress (refactored):',qb2.store,'|',qb2.prog);
  // theme
  const [ta,tb]=await both(async app=>{ const out=[]; app.w.document.getElementById('themeBtn').click(); out.push(app.w.document.documentElement.getAttribute('data-theme'),app.w.localStorage.getItem('datapath_theme')); app.w.document.getElementById('themeBtn').click(); out.push(app.w.document.documentElement.getAttribute('data-theme'),app.w.localStorage.getItem('datapath_theme')); return out; }); ok(J(ta)===J(tb),'theme toggle + storage key identical '+J(tb));
  // drawer
  const [da,db]=await both(async app=>{ const d=app.w.document; d.getElementById('menuBtn').click(); const o=d.body.classList.contains('drawer'); d.getElementById('scrim').click(); return [o,d.body.classList.contains('drawer')]; }); ok(J(da)===J(db)&&db[0]===true&&db[1]===false,'mobile drawer open/close');
  // data-scroll buttons exist and do not throw
  await go(B,'#/'); const sc=B.w.document.querySelector('[data-scroll]'); ok(!!sc,'landing scroll button present'); sc.click();
  B.w.close(); A.w.close();
  // ---------- saved progress from the ORIGINAL site is read by the refactor (storage key compatibility)
  const seeded={ datapath_progress_v1: JSON.stringify({vlookup:{best:5,total:5},cte:{best:3,total:5}}), datapath_theme:'dark' };
  const A2=await load({dir:ORIG_DIR,file:ORIG,storage:seeded}), B2=await load({dir:NEW_DIR,file:'index.html',storage:seeded});
  await go(A2,'#/lesson/cte'); await go(B2,'#/lesson/cte'); ok(snap(A2.w)===snap(B2.w),'pre-existing saved progress + saved dark theme restored identically'); console.log('   restored:',JSON.parse(snap(B2.w)).prog,'| theme',JSON.parse(snap(B2.w)).theme);
  // unfinished courses stay unfinished
  const learn=await(async()=>{ await go(B2,'#/learn'); return B2.w.document.getElementById('view').innerHTML; })();
  const soon=(learn.match(/modcard soon/g)||[]).length; ok(soon===6,'six unfinished modules show "Coming soon" ('+soon+')');
  console.log('\nchecks:',checks,' failures:',fails); process.exit(fails?1:0);
})().catch(e=>{ console.error('HARNESS ERROR',e); process.exit(2); });
