/* 江湖一生 · mastery and the arts you fight with.
   Every art you know has a level, 一成火候 (1) to 十成火候 (10). It rises with practice, closed-door training and real fights,
   faster with good 根骨 and 悟性 and for your own sect's arts, slower the higher the art's tier.
   You choose which arts to take into a fight: one 轻功, one 内功, three 外功 and one 暗器. If you never choose, your strongest
   of each kind are used. Arts left out of the fight still count toward your power, but only fighting arts improve
   from fights and training. */
'use strict';
const ART_LV=[null].concat([1,2,3,4,5,6,7,8,9,10].map(n=>T(`Mastery ${n}/10`,`${'一二三四五六七八九十'[n-1]}成火候`)));
const artLv=a=>{if(a.lv==null)a.lv=3;return a.lv};
const artNeed=a=>Math.round(12*(1+(a.tier||0)*.45)*artLv(a));
/* three kinds of art, as in the classic novels: 外功 (fists, palms, weapons, hidden weapons: the attacks), 内功 (inner force,
   breathing, hard-body training) and 轻功 (footwork and lightness). You fight with one 轻功, one 内功 and three 外功. */
const ART_CAT_N={wai:T('Outer arts','外功'),nei:T('Inner arts','内功'),qing:T('Lightness arts','轻功'),anqi:T('Hidden weapons','暗器')};
const ART_CAT_SLOTS={qing:1,nei:1,wai:3,anqi:1};
const ART_CAT_FIX={'石壁玄文':'nei','迷魂术':'nei','惊魂曲':'nei','满天花雨':'anqi','寒冰符':'anqi','耐寒功':'nei','飞刀术':'anqi','金针术':'anqi','笑里藏刀':'anqi','峨眉刺':'wai','一刀封喉':'wai','易容匕':'wai','流星锤':'wai','镖局刀法':'wai'};
function artCat(a){if(a.cat&&ART_CAT_SLOTS[a.cat])return a.cat;const cn=a.cn||'',en=a.n||'',sk=a.sk;let c=ART_CAT_FIX[cn];
  if(!c&&(sk==='anqi'||/暗器|飞刀|(?<!镖局)镖(?!局)|袖箭|飞蝗|霹雳弹|梅花针|银针/.test(cn)))c='anqi';
  if(!c){if(/\b(sword|saber|blade|fist|fists|palms?|fingers?|claws?|kicks?|staff|spear|whip|hooks?|darts?|needles?|knife|knives|daggers?|hammer|axe|brush|flute|strikes?|hand|boxing|cudgel|arrows?|pellets|rings|wheel|thorns|grapple|forms)\b/i.test(en))c='wai';
    else if(/\b(steps?|lightness|leap|footwork|skims?|walking|climb|runner)\b/i.test(en))c='qing';
    else if(/\b(qi|breath|sutra|canon|classic|manual|method|inner|energy|shirt|bell|heart|force|yang|yin|stance|skin|body|meditation|alchemy|formula)\b/i.test(en))c='nei';
    else if(/剑|刀|枪|棍|杖|拳|掌|指|爪|腿|鞭|钩|镖|针|锤|斧|笔|箫|环|轮|弓|箭|手|刺|匕|毒/.test(cn))c='wai';
    else if(/步|身法|轻功|踏|凌波|梯云|草上飞|神行|水上漂|燕子|纵/.test(cn))c='qing';
    else if(/功|经|心法|诀|气|吐纳|息|罩|衫|禅|桩|丹/.test(cn))c='nei';
    else c=['lingbo','fenshen'].includes(sk)?'qing':['heal','jinzhong','xixing','shihou','huiguang'].includes(sk)?'nei':'wai'}
  return c}
const artSlots=()=>6;
/* how quickly this person learns this art */
function artRate(s,a){let m=.55+(s.t.root||5)*.05+(s.t.wit||5)*.05;if(a.sect&&a.sect===s.sect)m*=1.3;if(a.bad)m*=.8;return m}
function artGain(s,a,amt,quiet){if(!a||artLv(a)>=10)return;a.xp=(a.xp||0)+amt*artRate(s,a);
  while(a.lv<10&&a.xp>=artNeed(a)){a.xp-=artNeed(a);a.lv++;
    if(!quiet&&s.log&&s.log.length)say(s,`Your ${a.n} reaches mastery ${a.lv}/10.`,`你的${a.cn}练到了${ART_LV[a.lv].zh}。`,a.lv>=7?'gold':'good');
    if(a.lv===10&&typeof deed==='function')deed(s,`Fully mastered ${a.n}`,`将${a.cn}练至十成火候`)}
  if(a.lv>=10)a.xp=0}
/* the arts that go into a fight: your choice if you made one, otherwise the strongest of each kind */
const artScore=a=>(a.tier||0)*3+artLv(a);
function combatArts(s){const all=(s.arts||[]).filter(a=>a.sk),used={qing:0,nei:0,wai:0,anqi:0},out=[];
  const take=a=>{const c=artCat(a);if(used[c]<ART_CAT_SLOTS[c]){used[c]++;out.push(a)}};
  if(Array.isArray(s.loadout))s.loadout.map(cn=>all.find(a=>a.cn===cn)).filter(Boolean).forEach(take);
  else all.slice().sort((a,b)=>artScore(b)-artScore(a)).forEach(take);
  return out}
/* technique strength in a fight from tier and mastery */
const skLvOf=a=>clamp(Math.round(1+(a.tier||0)*.75+(artLv(a)-4)*.22),1,5);
const skPwOf=a=>Math.max(.75,1+.28*((a.tier||0)*.75+(artLv(a)-4)*.22));
(()=>{const y0=youFighter;youFighter=function(s){const f=y0(s);const use=combatArts(s);
  const byName=new Map(use.map(a=>[a.cn,a]));
  f.skills=f.skills.filter(x=>x.innate||(x.label&&byName.has(x.label.zh))).map(x=>{if(x.innate)return x;const a=byName.get(x.label.zh);return Object.assign({},x,{lv:skLvOf(a),pw:skPwOf(a),alv:artLv(a)})});
  /* an inner art deepens your inner force; a lightness art makes you quicker and harder to hit */
  use.forEach(a=>{const c=artCat(a),t=a.tier||0,l=artLv(a);
    if(c==='nei'){f.nei+=Math.round(2+t*2+l*.6);f.mpMax+=Math.round(5+l*3);f.mp=f.mpMax}
    if(c==='qing'){f.spd+=Math.round(1+t+l*.3);f.dodge=clamp(f.dodge+.005*(1+t)+l*.002,0,.45)}});
  return f}})();
/* training and fighting raise the arts you fight with */
(()=>{const d0=doAct;doAct=function(s,id){const r=d0.apply(this,arguments);if(r!==true||!s.alive)return r;
  /* practice trains the outer arts most, meditation the inner art; closed-door training trains everything */
  const amt={practice:8,seclusion:30,meditate:8,sectchores:2,sectteach:3}[id];const W={practice:{wai:1,qing:.8,nei:.5,anqi:.8},meditate:{wai:.25,qing:.25,nei:1,anqi:.25}}[id];
  if(amt)combatArts(s).forEach(a=>artGain(s,a,amt*(W?W[artCat(a)]:1)));
  return r}})();
(()=>{const f0=fightLife;fightLife=function(s,foe,o){const r=f0.apply(this,arguments);if(s&&s.alive)combatArts(s).forEach(a=>artGain(s,a,(o&&o.stakes==='spar')?4:3,true));return r}})();
/* a newly learned art starts at the beginning */
(()=>{const l0=learn;learn=function(s,art){const r=l0.apply(this,arguments);if(r){const a=s.arts[s.arts.length-1];if(a&&a.lv==null){a.lv=1;a.xp=0}
  if(Array.isArray(s.loadout)&&a&&a.sk&&!s.loadout.includes(a.cn)){const c=artCat(a),n=s.loadout.filter(cn=>{const b=s.arts.find(x=>x.cn===cn);return b&&artCat(b)===c}).length;if(n<ART_CAT_SLOTS[c])s.loadout.push(a.cn)}}return r}})();
