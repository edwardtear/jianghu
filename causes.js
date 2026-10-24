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
