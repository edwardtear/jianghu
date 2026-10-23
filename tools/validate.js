/* 江湖一生 · content validator. node tools/validate.js <dir> [lives]
   Checks: every game file loads; incident ids are unique; option/outcome references resolve; story stages and endings
   referenced in the source exist; people-event ids exist; no one-language text literals; then plays lives (choosing
   at random) to check every printed line is bilingual and free of undefined/NaN, that the queue never piles up,
   and that a save taken in the middle of a pending decision loads and carries on. */
const fs=require('fs'),vm=require('vm');
const dir=process.argv[2]||'jh',N=+process.argv[3]||150;
const page=fs.existsSync(dir+'/page.html')?dir+'/page.html':dir+'/index.html';const files=[...fs.readFileSync(page,'utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(f=>!/^(ui|mobile|tips|cloud|slots|audio|firebase)/.test(f)&&fs.existsSync(dir+'/'+f));
const srcAll=files.map(f=>fs.readFileSync(dir+'/'+f,'utf8')).join('\n;\n');
const problems=[],warn=[];const P=(m)=>problems.push(m),W=(m)=>warn.push(m);
let ctx={console,Math};vm.createContext(ctx);
try{vm.runInContext(srcAll+';this.X={INC,INC_BY,STORY,PE,newLife,ageUp,choose,doAct,doPact,ACTS,canAct,canPact,PACT_BY,living};',ctx)}catch(e){console.log('LOAD FAILED:',e.message);process.exit(1)}
const X=ctx.X;
/* 1. unique ids: I() renames a clash to id_2, which hides a bug */
X.INC.forEach(i=>{if(/_\d+$/.test(i.id)&&X.INC_BY[i.id.replace(/_\d+$/,'')]&&!/^(af_|rp_)/.test(i.id))W('possible duplicate id renamed: '+i.id)});
/* 2. references */
const outs=i=>(i.opts||[]).flatMap(o=>[].concat(o.out||[],o.win||[],o.lose||[])).concat(i.out||[]);
X.INC.forEach(i=>{if(typeof i.text!=='function')P('text is not a function: '+i.id);outs(i).forEach(o=>{if(o.next&&!X.INC_BY[o.next])P(`${i.id}: next → missing ${o.next}`)})});
/* story stages and endings named in the source */
for(const m of srcAll.matchAll(/st(?:Go|Begin)\(s,'(\w+)',(?:c,)?'(\w+)'/g)){const[ ,id,st]=m;if(!X.STORY[id])P('unknown story '+id);else if(!X.INC_BY[id+'_'+st])P(`story ${id}: stage '${st}' is used but not defined`)}
for(const m of srcAll.matchAll(/stEnd\(s,'(\w+)','(\w+)'/g)){const[ ,id,e]=m;if(!X.STORY[id])P('unknown story '+id);else if(!X.STORY[id].ends[e])P(`story ${id}: ending '${e}' is used but not defined`)}
for(const id in X.STORY){const D=X.STORY[id];if(!D.n||!D.n.en||!D.n.zh)P('story title missing a language: '+id);for(const k in D.ends){const n=D.ends[k].n;if(!n||!n.en||!n.zh)P(`story ${id} ending ${k} missing a language`)}
  if(D.hint)for(const k in D.hint)if(D.hint[k]&&!X.INC_BY[id+'_'+k])W(`story ${id}: hint for undefined stage ${k}`)}
for(const m of srcAll.matchAll(/peRun\(s,[^,]+,'(\w+)'\)/g))if(!X.PE[m[1]])P('peRun of unknown people event '+m[1]);
/* 3. one-language literals */
const one=(srcAll.match(/T\(''\s*,\s*'[^']+'\)|T\('[^']+'\s*,\s*''\)/g)||[]);if(one.length)P('T() with one language empty: '+one.slice(0,5).join(' '));
/* 4. play */
const bad=/undefined|NaN|\[object|null\b/;const chk=(t,w)=>{if(!t||typeof t.en!=='string'||typeof t.zh!=='string')return P('bad text object at '+w);if(t.en===''&&t.zh==='')return;if(!t.en||!t.zh)P('one language empty at '+w+': '+JSON.stringify(t));if(bad.test(t.en)||bad.test(t.zh))P('bad text at '+w+': '+(t.zh||t.en).slice(0,80))};
let maxQ=0,reloads=0;const seen={};
for(let i=0;i<N;i++){let s=X.newLife();let g=0;
  while(s.alive&&g++<150){X.ageUp(s);maxQ=Math.max(maxQ,s.queue.length);let k=0;
    while(s.alive&&k++<40){if(s.queue.length){const q=s.queue[0];q.opts.forEach(o=>chk(o.l,'option of '+q.id));if(q.text)chk(q.text,'prompt of '+q.id);
        /* now and then, save and reload in the middle of a decision */
        if(Math.random()<.03){s=JSON.parse(JSON.stringify(s));reloads++}
        try{X.choose(s,q.opts[Math.floor(Math.random()*q.opts.length)].k)}catch(e){P(`crash choosing in ${q.id}: ${e.message}`);s.queue.shift()}continue}
      if(s.ap<=0)break;const r=Math.random(),ps=X.living(s).filter(p=>p.age>=14);
      try{if(r<.15&&ps.length){const p=ps[Math.floor(Math.random()*ps.length)];const a=['chat','ask'][Math.floor(Math.random()*2)];if(X.canPact(s,p,X.PACT_BY[a])===true){X.doPact(s,p.id,a);continue}}
        const ok=X.ACTS.filter(a=>X.canAct(s,a)===true&&!['contract'].includes(a.id));if(!ok.length)break;X.doAct(s,ok[Math.floor(Math.random()*ok.length)].id)}catch(e){P('crash in activity: '+e.message);break}}}
  for(const L of s.log)for(const l of L.lines)chk(l.t,'line @'+L.age);for(const k in s.seen)seen[k]=(seen[k]||0)+1}
const prefix=process.argv[4];
console.log(`files ${files.length} · incidents ${X.INC.length} · stories ${Object.keys(X.STORY).length} · people events ${Object.keys(X.PE).length}`);
console.log(`played ${N} lives · reloaded mid-decision ${reloads} times · largest queue ${maxQ}`);
if(prefix){const ids=X.INC.filter(i=>new RegExp(prefix).test(i.id)).map(i=>i.id);const never=ids.filter(id=>!seen[id]);console.log(`${ids.length} incidents match /${prefix}/ · never reached in ${N} lives: ${never.length?never.join(', '):'none'}`)}
console.log(problems.length?`PROBLEMS (${problems.length}):\n  `+[...new Set(problems)].slice(0,30).join('\n  '):'no problems found');
if(warn.length)console.log(`warnings (${warn.length}):\n  `+[...new Set(warn)].slice(0,20).join('\n  '));
process.exit(problems.length?1:0);
