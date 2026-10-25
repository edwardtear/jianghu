/* 江湖一生 · cause and effect, recorded as it happens (never reconstructed afterwards).
   1. When someone from an old memory record comes back, the record also keeps what happened this time: rec.back.
   2. Every choice made inside a story series is kept on that story's record: r.picks.
   The end-of-life 因果 section (endview.js) reads only these records. */
'use strict';
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){
  const inc=INC_BY[q.id],c=q.c,qo=(q.opts||[]).find(x=>x.k===k),o=inc&&inc.opts&&inc.opts[k];
  const label=qo&&qo.l&&qo.l.zh?qo.l:o?lab(o.l,c,s):null;const E0=s.log[s.log.length-1],i0=E0?E0.lines.length:0;
  const r=ci(s,q,k);
  if(!label||!inc)return r;
  const E=s.log[s.log.length-1],ls=(E&&E===E0?E.lines.slice(i0):E?E.lines:[]).filter(l=>!/prompt|you|act/.test(l.c||'')&&l.t&&l.t.zh);
  const out=ls[0]?memSnip(ls[0].t):null;
  /* a memory record came back: what you did this time, and how it went */
  if(c&&c.rec&&c.rec.id!=null&&typeof memById==='function'){const rec=memById(s,c.rec.id);if(rec){rec.back=rec.back||[];if(rec.back.length<3)rec.back.push({at:s.age,id:q.id,chose:label,out})}}
  /* a step of a story series: keep the choice on the story's own record */
  const sid=inc.story||inc.sopen;if(sid&&s.story&&s.story[sid]){const sr=s.story[sid];if(sr.at<=s.age){sr.picks=sr.picks||[];if(sr.picks.length<12)sr.picks.push({at:s.age,stage:inc.stage||'open',chose:label,out})}}
  return r}})();
/* a person the scene calls your senior or junior (师兄、师姐、师弟、师妹、同门) belongs to your sect. New meetings are read
   from the scene itself; people already in an older save are read from your shared history once. */
const SIB_RE=/(师兄|师姐|师弟|师妹|同门|师叔|师伯)/;
function sibSect(s){return s.sect||s.flags.formerSect||s.leftSect||null}
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){const r=ci(s,q,k);const c=q.c,sid=sibSect(s);
  if(c&&c.pid&&sid&&SECTS[sid]){const p=person(s,c.pid);const tx=q.text&&q.text.zh||'';if(p&&!p.sect&&p.n&&p.n.cn&&tx.includes(p.n.cn)&&new RegExp('(师兄|师姐|师弟|师妹|同门|师叔|师伯)'+p.n.cn).test(tx))p.sect=sid}
  return r}})();
function fixSibSects(s){if(!s||s.sibFixed)return;s.sibFixed=1;const sid=sibSect(s);if(!sid||!SECTS[sid])return;
  (s.people||[]).forEach(p=>{if(p.sect||!p.n||!p.n.cn)return;
    if(p.rel==='fellow'){p.sect=sid;return}
    const hit=(s.mem||[]).some(r=>(r.pid===p.id||(r.who&&r.who.n&&r.who.n.cn===p.n.cn))&&r.what&&new RegExp('(师兄|师姐|师弟|师妹|同门|师叔|师伯)'+p.n.cn).test(r.what.zh||''));
    if(hit)p.sect=sid})}
(()=>{const y=yearly;yearly=function(s){fixSibSects(s);return y(s)}})();
