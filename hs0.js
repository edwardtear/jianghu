/* 江湖一生 · 相处 scenes by relationship. Each kind of person (your parents and grandparents, your spouse, a lover, a
   young child, a grown child, a sibling, a friend, an acquaintance, your master, your disciple, a fellow disciple) has
   their own long list of scenes, many tied to the season or to how your life stands: famous or unknown, rich or broke,
   wanted, hurt, in office, running a house, old. A scene does not come back with the same person until you have seen
   most of the others, and the ones that fit your situation right now are the likeliest. Scenes live in hs1–hs4.js. */
'use strict';
const HS=[];
/* g: group; k: when it fits (or null); en/zh: what happens; q: what they say [en,zh]; fx: effects (b: bond range) */
function hs(g,k,en,zh,q,fx){HS.push({i:HS.length,g,k,en,zh,q,fx:fx||{},w:k?2.4:1})}
const HS_GROUP={father:'elder',mother:'elder',grandparent:'elder',spouse:'spouse',lover:'lover',sibling:'sib',friend:'friend',sworn:'friend',master:'master',disciple:'disc',fellow:'fellow',acq:'acq'};
function hsGroup(p){const r=p.rel;if(['child','godchild','nephew'].includes(r))return p.age<16?'kid':'grown';return HS_GROUP[r]||null}
/* situations */
const sea=s=>HSEA(s),SP=s=>sea(s)===0,SU=s=>sea(s)===1,AU=s=>sea(s)===2,WI=s=>sea(s)===3;
const FAM=s=>s.fame>=80,UNK=s=>s.fame<15,WNT=s=>s.wanted>0,RICH=s=>s.money>=3000,POOR=s=>s.money<60,HURT=s=>s.health<s.maxHealth*.5||(typeof condKeys==='function'&&condKeys(s).length>0),
 OFF=s=>['official','constable','jinyiwei'].includes(s.job),ORG=s=>!!s.org,ALI=s=>!!s.alias,OLDME=s=>s.age>=50,MAR=s=>!!(typeof spouseOf==='function'&&spouseOf(s)),
 KIDS=s=>s.people.some(x=>x.alive&&x.rel==='child'),SECT=s=>!!s.sect,EVIL=s=>s.align<=-30,GOOD=s=>s.align>=40,STRONG=s=>power(s)>=110;
const OLD=(s,p)=>p.age>=65,CLOSE=(s,p)=>p.bond>=80,COOL=(s,p)=>p.bond<35,YOUNGP=(s,p)=>p.age<25;
const and=(...f)=>(s,p)=>f.every(g=>g(s,p));
function hsFill(t,p,s,zhx){const P=PRON[p.sex]||PRON.m;return t.replace(/\{n\}/g,zhx?p.n.cn:p.n.py).replace(/\{he\}/g,P.he).replace(/\{He\}/g,P.He).replace(/\{him\}/g,P.him).replace(/\{his\}/g,P.his).replace(/\{His\}/g,P.His).replace(/\{himself\}/g,P.him==='her'?'herself':'himself').replace(/\{ta\}/g,P.ta)
  .replace(/\{a\}/g,s.alias?(zhx?s.alias.zh:s.alias.en):'').replace(/\{me\}/g,zhx?s.cn:s.name).replace(/\{reg\}/g,(()=>{const r=region(s);return r?(zhx?r.cn:r.en):''})())}
function hsPool(s,p){const g=hsGroup(p);if(!g)return[];return HS.filter(e=>e.g===g&&(!e.k||e.k(s,p)))}
HANG.push({id:'rich',w:(s,p)=>{const n=hsPool(s,p).length;return n?Math.min(22,8+n/3):0},f:(s,p)=>{const pool=hsPool(s,p);p.hsSeen=p.hsSeen||[];const rec=s.hsRecent||(s.hsRecent=[]);
  let c=pool.filter(e=>!p.hsSeen.includes(e.i)&&!rec.includes(e.i));if(!c.length)c=pool.filter(e=>!p.hsSeen.includes(e.i));if(!c.length){p.hsSeen=[];c=pool}
  const e=wpick(c,x=>x.w);p.hsSeen.push(e.i);if(p.hsSeen.length>Math.max(4,pool.length-3))p.hsSeen.shift();rec.push(e.i);if(rec.length>24)rec.shift();
  const L=[T(hsFill(e.en,p,s),hsFill(e.zh,p,s,1))];if(e.q)L.push(voice(p,T(hsFill(e.q[0],p,s),hsFill(e.q[1],p,s,1)),e.fx.tone));
  const b=e.fx.b?rint(e.fx.b[0],e.fx.b[1]):rint(3,7);const fx={};['money','smarts','skill','heal','qi','fame','align','looks'].forEach(k=>{if(e.fx[k]!=null)fx[k]=Array.isArray(e.fx[k])?rint(e.fx[k][0],e.fx[k][1]):e.fx[k]});
  return{l:L,bond:b,happy:e.fx.happy??2,fx:Object.keys(fx).length?fx:null,c:e.fx.c||''}}});
/* the old generic family day gives way to the new scenes */
(()=>{[['family',.35],['heart',.45],['work',.6],['meal',.7],['train',.45],['outing',.7]].forEach(([id,m])=>{const f=HANG.find(x=>x.id===id);if(f){const w0=f.w;f.w=(s,p)=>w0(s,p)*m}})})();
