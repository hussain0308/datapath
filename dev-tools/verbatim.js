// Every original lesson/deep/dataset/curriculum source text must appear unchanged in the refactored files.
const fs=require('fs'), path=require('path'), acorn=require('acorn');
const src=require('./paths').origScript();
const body=acorn.parse(src,{ecmaVersion:2022}).body[0].expression.callee.body.body; const get=n=>src.slice(n.start,n.end);
const dir=process.argv[2]||path.join(require('./paths').ROOT,'courses'); let all=''; (function w(d){ fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{ const p=path.join(d,e.name); e.isDirectory()?w(p):/\.js$/.test(e.name)&&(all+=fs.readFileSync(p,'utf8')+'\n'); }); })(dir);
let n=0,miss=[],chars=0; const chk=(label,t)=>{ n++; chars+=t.length; if(!all.includes(t)) miss.push(label); };
const lessDecl=body.find(x=>x.type==='VariableDeclaration'&&x.declarations[0].id.name==='LESSONS');
lessDecl.declarations[0].init.properties.forEach(p=>chk('lesson '+(p.key.value),get(p)));
body.forEach(x=>{ if(x.type!=='ExpressionStatement')return; const e=x.expression; if(e.type==='AssignmentExpression'&&get(e.left).startsWith('DEEP[')) chk('deep '+e.left.property.value,get(x)); else if(e.type==='CallExpression'&&e.callee.name==='D') chk('deep '+e.arguments[0].value,get(x)); });
const SKIP=new Set(['CURRICULUM','LESSONS','ORDER','withHl','T','X','P','Q','FL','RT','DEEP','mem','store','progress']);
const cs=body.findIndex(x=>x.type==='VariableDeclaration'&&x.declarations[0].id.name==='CURRICULUM'), ce=body.indexOf(lessDecl);
body.slice(cs+1,ce).forEach(x=>{ if(x.type==='VariableDeclaration'&&!SKIP.has(x.declarations[0].id.name)) chk('dataset '+x.declarations[0].id.name,get(x)); });
const cur=body[cs].declarations[0].init.elements; cur.forEach(el=>{ const sec=el.properties.find(p=>p.key.name==='sections'); chk('sections of '+el.properties[0].value.value,get(sec.value)); });
console.log('verbatim source blocks checked:',n,'('+Math.round(chars/1024)+' KB of original lesson/data source)','missing:',miss.length); miss.forEach(m=>console.log('  MISSING',m)); process.exit(miss.length?1:0);
