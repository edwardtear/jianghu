/* 江湖一生 · a sect and an escort agency can stand side by side. When you have both, the sect is your house (s.org) and
   the agency is kept beside it (s.org2); the agency's own actions are listed as 镖局·…, earn its own silver each year,
   and work exactly as they do when it is your only house. */
'use strict';
function withO2(s,f){const o=s.org;s.org=s.org2;try{return f()}finally{s.org2=s.org||null;s.org=o;normOrg(s)}}
function normOrg(s){if(!s.org&&s.org2){s.org=s.org2;s.org2=null}}
/* the agency's copies of the house actions */
function cloneO2(id){const a=ACT_BY[id];if(!a)return;const nid=id+'2';
  addAct(Object.assign({},a,{id:nid,n:T(`Agency: ${a.n.en}`,`镖局·${a.n.zh}`),
    if:s=>!!s.org2&&withO2(s,()=>!a.if||!!a.if(s)),ok:a.ok?s=>withO2(s,()=>a.ok(s)):undefined,
    run(s){const q0=s.queue.length;withO2(s,()=>a.run(s));s.queue.slice(q0).forEach(q=>{if(q.src==='act'&&q.id===id)q.id=nid})},
    choose:a.choose?function(s,k,c){return withO2(s,()=>a.choose(s,k,c))}:undefined}))}
['org_recruit','org_build','org_venture','org_contract','org_bandits','org_close'].forEach(cloneO2);
/* founding the other kind of house no longer means giving up the one you have */
(()=>{const f=ACT_BY.foundsect;f.if=s=>!(s.org&&s.org.type==='sect')&&s.age>=20;const ok0=f.ok;f.ok=s=>{if(s.org&&s.org.type==='escort'){const o=s.org;s.org=null;try{return ok0(s)}finally{s.org=o}}return ok0(s)};
  const c0=f.choose;f.choose=function(s,k,c){if(k==='leave'||!(s.org&&s.org.type==='escort'))return c0.apply(this,arguments);s.org2=s.org;s.org=null;const r=c0.apply(this,arguments);normOrg(s);return r}})();
(()=>{const f=ACT_BY.foundescort;f.if=s=>!(s.org&&s.org.type==='escort')&&!s.org2&&s.age>=18;const ok0=f.ok;f.ok=s=>{if(s.org&&s.org.type==='sect'){const o=s.org;s.org=null;try{return ok0(s)}finally{s.org=o}}return ok0(s)};
  const c0=f.choose;f.choose=function(s,k,c){if(k==='leave'||!(s.org&&s.org.type==='sect'))return c0.apply(this,arguments);const sect=s.org;s.org=null;const r=c0.apply(this,arguments);s.org2=s.org;s.org=sect;return r}})();
/* the agency's year: its silver, its name, the people who drift away */
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);if(!s.alive||!s.org2)return r;const o=s.org2;
  const inc=Math.round(o.members*8*(o.rep/50)-o.members*2);if(inc)payT(s,inc,'org');
  say(s,inc>=0?`${o.name.en} brings in ${inc} taels this year.`:`${o.name.en} costs you ${-inc} taels this year.`,inc>=0?`${o.name.zh}今年进账${inc}两。`:`${o.name.zh}今年亏了${-inc}两。`,'muted');
  if(o.rep<10&&o.members>0&&chance(.5))o.members--;o.rep=clamp(o.rep+(o.rep>40?-1:0),0,100);
  if(o.members<=0){say(s,`${o.name.en} has no one left. It is over.`,`${o.name.zh}已经没人了，就此散了。`,'bad');s.org2=null}
  return r}})();
(()=>{const a0=after;after=function(s){normOrg(s);return a0.apply(this,arguments)}})();
/* the second house on the character sheet */
if(typeof addEventListener==='function')addEventListener('load',()=>{if(typeof sideHTML!=='function')return;const h0=sideHTML;sideHTML=function(s){const h=h0.apply(this,arguments);if(!s.org2)return h;
  const o=s.org;s.org=s.org2;let h2;try{h2=h0.apply(this,arguments)}finally{s.org=o}
  const m=h2.match(/<div class="orgbox">[\s\S]*?<\/div><\/div>(?:<div class="orgst">[\s\S]*?<\/div>)?<\/div>/);const i=h.indexOf('<div class="orgbox">');if(!m||i<0)return h;
  const m1=h.slice(i).match(/<div class="orgbox">[\s\S]*?<\/div><\/div>(?:<div class="orgst">[\s\S]*?<\/div>)?<\/div>/);if(!m1)return h;const end=i+m1[0].length;return h.slice(0,end)+m[0]+h.slice(end)};try{update(false)}catch(e){}});
