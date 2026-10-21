/* 江湖一生 · the activity menu: no separate "opportunities" list (they now find you while you roam), the jianghu first,
   and activities that can lead somewhere: after doing something, a follow-up may come of it, shaped by who you are */
'use strict';

/* ---------- menu order: the jianghu first, opportunities folded into roaming ---------- */
(()=>{const i=ACT_CATS.findIndex(c=>c[0]==='opp');if(i>=0)ACT_CATS.splice(i,1);const j=ACT_CATS.findIndex(c=>c[0]==='jh');if(j>0)ACT_CATS.unshift(ACT_CATS.splice(j,1)[0])})();

/* an opportunity heard about on the road: go now, or let it pass */
function offerOpp(s,oid){const a=ACT_BY[oid];if(!a||!(s.opps||[]).includes(oid))return false;
  s.queue.push({src:'act',id:'oppoffer',c:{oid},text:T(`On the road you hear: ${a.n.en.replace(/^./,x=>x.toLowerCase())}. ${a.d.en}`,`路上听人说起：${a.n.zh}。${a.d.zh}`),
    opts:[{k:'go',l:T('Go and see','去看看')},{k:'no',l:T('Let it pass','错过就错过吧')}]});return true}
addAct({id:'oppoffer',cat:'jh',n:T('An opportunity','机缘'),d:'',if:()=>false,run(){},
 choose(s,k,c){const a=ACT_BY[c.oid];if(!a)return;if(k!=='go'){s.opps=(s.opps||[]).filter(x=>x!==c.oid);say(s,'You let it go. Perhaps another time.','你没去。也许下回吧。','muted');return}
  if(a.if0&&!a.if0(s)){s.opps=(s.opps||[]).filter(x=>x!==c.oid);say(s,'By the time you get there, it is over.','等你赶到，事情已经结束了。','muted');return}
  a.run(s)}});
(()=>{const W=ACT_BY.wander;if(!W)return;const r0=W.run;
 W.run=function(s){const ops=(s.opps||[]).filter(id=>ACT_BY[id]&&(!ACT_BY[id].if0||ACT_BY[id].if0(s)));
  const tip=s.oppTip&&ops.includes(s.oppTip)?s.oppTip:null;
  if(ops.length&&chance(tip?.7:.3)){const id=tip||pick(ops);delete s.oppTip;if(offerOpp(s,id))return}
  return r0.call(W,s)}})();
/* tips you pick up elsewhere come back to you on the road */
(()=>{const r=rollOpps;rollOpps=function(s){const keep=(s.opps||[]).filter(id=>id===s.oppTip);r(s);keep.forEach(id=>{if(!s.opps.includes(id))s.opps.push(id)})}})();

/* ---------- what an activity can lead to ---------- */
const AF_P=.22;
function actFollow(s,id){if(!s.alive||s.queue.length||s.jail>0||!chance(AF_P))return;const i=pickIncident(s,'af_'+id);if(i)runIncident(s,i)}
(()=>{const d0=doAct;doAct=function(s,id){const r=d0(s,id);if(r===true&&!s.queue.length)actFollow(s,id);return r}})();
(()=>{const ch=choose;choose=function(s,k){const q=s.queue[0];const r=ch(s,k);
  if(q&&q.src==='act'&&ACT_BY[q.id]&&q.id!=='oppoffer'&&!s.queue.length)actFollow(s,q.id);return r}})();
