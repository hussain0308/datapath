// Accounts for every top-level name of the original script and every original CSS rule.
const fs=require('fs'), path=require('path'), acorn=require('acorn'), postcss=require('postcss');
const src=require('./paths').origScript(); const body=acorn.parse(src,{ecmaVersion:2022}).body[0].expression.callee.body.body;
const D=require('./paths').ROOT+'/'; let js=''; (function w(d){ fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{ const p=path.join(d,e.name); e.isDirectory()?w(p):/\.js$/.test(e.name)&&(js+=fs.readFileSync(p,'utf8')+'\n'); }); })(D+'assets/js'); (function w(d){ fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{ const p=path.join(d,e.name); e.isDirectory()?w(p):/\.js$/.test(e.name)&&(js+=fs.readFileSync(p,'utf8')+'\n'); }); })(D+'courses');
const names=[]; body.forEach(n=>{ if(n.type==='FunctionDeclaration') names.push(n.id.name); if(n.type==='VariableDeclaration') n.declarations.forEach(d=>names.push(d.id.name)); });
const missing=names.filter(nm=>!new RegExp('(?<![\\w$])'+nm.replace('$','\\$')+'(?![\\w$])').test(js)); console.log('original top-level names:',names.length,'| not found anywhere in new JS:',missing.length?missing.join(', '):'none');
// event listeners and storage keys
['hashchange','menuBtn','scrim','themeBtn','datapath_progress_v1','datapath_theme','prefers-color-scheme'].forEach(k=>console.log('  present in new JS:',k,js.includes(k)));
// CSS rules
const html=require('./paths').backupHtml(); const oc=postcss.parse(html.slice(html.indexOf('<style>')+7,html.indexOf('</style>')));
const nc=['main','layout','components'].map(f=>fs.readFileSync(D+'assets/css/'+f+'.css','utf8')).join('\n');
const norm=r=>r.selector.replace(/\s+/g,' ')+'{'+r.nodes.filter(x=>x.type==='decl').map(d=>d.prop+':'+d.value+(d.important?'!':'')).join(';')+'}';
const ol=[]; oc.walkRules(r=>{ ol.push((r.parent.type==='atrule'?'@'+r.parent.params+' ':'')+norm(r)); });
const nl=[]; postcss.parse(nc).walkRules(r=>{ nl.push((r.parent.type==='atrule'?'@'+r.parent.params+' ':'')+norm(r)); });
const so=ol.slice().sort(), sn=nl.slice().sort(); console.log('CSS rules original:',ol.length,'refactored:',nl.length,'| identical multiset:',JSON.stringify(so)===JSON.stringify(sn));
// body markup identical?
const cut=h=>h.slice(h.indexOf('<body>'),h.indexOf('<script')).replace(/\s+/g,' ').trim(); const ni=fs.readFileSync(D+'index.html','utf8'); const nb=ni.slice(ni.indexOf('<body>'),ni.indexOf('<!-- 1. Core')).replace(/\s+/g,' ').trim(); console.log('HTML shell (header, sidebar, main, scrim) identical:',cut(html)===nb);
const hd=h=>h.slice(0,h.indexOf('<style>')).replace(/\s+/g,' '); console.log('head (title, viewport, fonts) identical up to stylesheet links:',hd(html)===ni.slice(0,ni.indexOf('<link rel="stylesheet"')).replace(/\s+/g,' '));
