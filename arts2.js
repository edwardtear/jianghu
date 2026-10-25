/* 江湖一生 · mastery and the arts you fight with.
   Every art you know has a level, 一成火候 (1) to 十成火候 (10). It rises with practice, closed-door training and real fights,
   faster with good 根骨 and 悟性 and for your own sect's arts, slower the higher the art's tier.
   You choose which arts to take into a fight; the number of slots grows with your realm. If you never choose, your
   strongest arts are used. Arts left out of the fight still count toward your power, but only fighting arts improve
   from fights and training. */
'use strict';
const ART_LV=[null].concat([1,2,3,4,5,6,7,8,9,10].map(n=>T(`Mastery ${n}/10`,`${'一二三四五六七八九十'[n-1]}成火候`)));
const artLv=a=>{if(a.lv==null)a.lv=3;return a.lv};
const artNeed=a=>Math.round(12*(1+(a.tier||0)*.45)*artLv(a));
const artSlots=s=>s.realm>=5?6:s.realm>=4?5:s.realm>=3?4:s.realm>=2?3:2;
/* how quickly this person learns this art */
function artRate(s,a){let m=.55+(s.t.root||5)*.05+(s.t.wit||5)*.05;if(a.sect&&a.sect===s.sect)m*=1.3;if(a.bad)m*=.8;return m}
function artGain(s,a,amt,quiet){if(!a||artLv(a)>=10)return;a.xp=(a.xp||0)+amt*artRate(s,a);
  while(a.lv<10&&a.xp>=artNeed(a)){a.xp-=artNeed(a);a.lv++;
    if(!quiet&&s.log&&s.log.length)say(s,`Your ${a.n} reaches mastery ${a.lv}/10.`,`你的${a.cn}练到了${ART_LV[a.lv].zh}。`,a.lv>=7?'gold':'good');
    if(a.lv===10&&typeof deed==='function')deed(s,`Fully mastered ${a.n}`,`将${a.cn}练至十成火候`)}
  if(a.lv>=10)a.xp=0}
/* the arts that go into a fight: your choice if you made one, otherwise the strongest */
function combatArts(s){const all=(s.arts||[]).filter(a=>a.sk);const n=artSlots(s);
  if(Array.isArray(s.loadout)){const pick=s.loadout.map(cn=>all.find(a=>a.cn===cn)).filter(Boolean);return pick.slice(0,n)}
  return all.slice().sort((a,b)=>((b.tier||0)*3+artLv(b))-((a.tier||0)*3+artLv(a))).slice(0,n)}
/* technique strength in a fight from tier and mastery */
const skLvOf=a=>clamp(Math.round(1+(a.tier||0)*.75+(artLv(a)-4)*.22),1,5);
const skPwOf=a=>Math.max(.75,1+.28*((a.tier||0)*.75+(artLv(a)-4)*.22));
(()=>{const y0=youFighter;youFighter=function(s){const f=y0(s);const use=combatArts(s);
  const byName=new Map(use.map(a=>[a.cn,a]));
  f.skills=f.skills.filter(x=>x.innate||(x.label&&byName.has(x.label.zh))).map(x=>{if(x.innate)return x;const a=byName.get(x.label.zh);return Object.assign({},x,{lv:skLvOf(a),pw:skPwOf(a),alv:artLv(a)})});
  return f}})();
/* training and fighting raise the arts you fight with */
(()=>{const d0=doAct;doAct=function(s,id){const r=d0.apply(this,arguments);if(r!==true||!s.alive)return r;
  const amt={practice:8,seclusion:30,meditate:3,sectchores:2,sectteach:3}[id];if(amt)combatArts(s).forEach(a=>artGain(s,a,amt*(id==='meditate'&&!/功|经|心法|吐纳|息/.test(a.cn)?.5:1)));
  return r}})();
(()=>{const f0=fightLife;fightLife=function(s,foe,o){const r=f0.apply(this,arguments);if(s&&s.alive)combatArts(s).forEach(a=>artGain(s,a,(o&&o.stakes==='spar')?4:3,true));return r}})();
/* a newly learned art starts at the beginning */
(()=>{const l0=learn;learn=function(s,art){const r=l0.apply(this,arguments);if(r){const a=s.arts[s.arts.length-1];if(a&&a.lv==null){a.lv=1;a.xp=0}
  if(Array.isArray(s.loadout)&&a&&a.sk&&s.loadout.length<artSlots(s)&&!s.loadout.includes(a.cn))s.loadout.push(a.cn)}return r}})();
