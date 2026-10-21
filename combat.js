/* 江湖一生 · fights leave marks: internal injuries, lingering poison, broken bones, open wounds, damaged meridians and a shaken spirit.
   They weaken you in later fights and in daily life, heal or worsen with time, and can be treated. Plus more things to own and use. */
'use strict';

/* ---------- lasting injuries ---------- */
const CONDS={
 inner:{n:T('Internal injury','内伤'),d:T('Qi damage lodged in the organs. You take more damage and hit softer with qi; costs health each year; hard training can make it worse.','真气震伤脏腑。战斗中更不经打、内劲减弱；每年损耗气血；勉强苦练可能加重。'),heal:.22,
  cure:T('Heart-Guarding Pill, Jade Dew Pill, a good doctor, or healing yourself with inner energy while you cultivate.','护心丹、玉露丸、好大夫，或修炼时运功疗伤。')},
 poison:{n:T('Lingering poison','余毒未清'),d:T('Poison still in the blood. Weaker in fights, and it eats at your health every year.','毒未清尽。战斗中力弱，每年侵蚀气血。'),heal:.28,cure:T('Antidote Pill, Jade Dew Pill, or a doctor.','解毒丹、玉露丸，或请大夫。')},
 fracture:{n:T('Broken bone','骨折'),d:T('Slower, weaker blows, harder to dodge. Training is half as useful. May set crooked if left alone.','出手慢、力道弱、难以闪避。练功事倍功半。放着不管可能长歪。'),heal:.45,cure:T('Bone-Setting Paste, or a bonesetter.','接骨膏，或找跌打大夫。')},
 wound:{n:T('Open wound','刀伤未愈'),d:T('Your guard is weaker and the wound may fester.','防御减弱，伤口可能溃烂。'),heal:.55,cure:T('Wound Salve, Jade Dew Pill, or a doctor.','金疮药、玉露丸，或请大夫。')},
 meridian:{n:T('Damaged meridians','经脉受损'),d:T('True qi is smaller and gathers slowly; inner energy grows slowly. Very slow to heal on its own.','真气上限和气聚都降低，内力增长变慢。自己极难痊愈。'),heal:.05,cure:T('Meridian-Mending Pill, or a famous physician.','续脉丹，或求访神医。')},
 shaken:{n:T('Shaken spirit','心神受创'),d:T('Hesitant in fights, low in spirits.','出手犹豫，心情低落。'),heal:.38,cure:T('Calming Incense, time, or people who care about you.','安神香、时间，或身边人的关心。')}};
const SEVN=[null,T('mild','轻'),T('serious','中'),T('grave','重')];
function addCond(s,k,sev,quiet){if(!CONDS[k]||!s.alive)return;s.conds=s.conds||{};const was=s.conds[k]||0;s.conds[k]=Math.min(3,was+(sev||1));
  if(!quiet)say(s,was?`Your ${CONDS[k].n.en.toLowerCase()} gets worse (${SEVN[s.conds[k]].en}).`:`You are left with ${CONDS[k].n.en.toLowerCase()} (${SEVN[s.conds[k]].en}).`,was?`你的${CONDS[k].n.zh}加重了（${SEVN[s.conds[k]].zh}）。`:`你落下了${CONDS[k].n.zh}（${SEVN[s.conds[k]].zh}）。`,'bad')}
function easeCond(s,k,n,why){if(!s.conds||!s.conds[k])return false;s.conds[k]-=n||1;if(s.conds[k]<=0){delete s.conds[k];say(s,`Your ${CONDS[k].n.en.toLowerCase()} has healed${why?` (${why.en})`:''}.`,`你的${CONDS[k].n.zh}痊愈了${why?`（${why.zh}）`:''}。`,'good')}
  else say(s,`Your ${CONDS[k].n.en.toLowerCase()} eases (${SEVN[s.conds[k]].en}).`,`你的${CONDS[k].n.zh}减轻了（${SEVN[s.conds[k]].zh}）。`,'good');return true}
const condKeys=s=>Object.keys(s.conds||{});

/* your injuries come with you into every fight */
const _youFighterC=youFighter;
youFighter=function(s){const f=_youFighterC(s);const C=s.conds||{};f.conds=Object.keys(C);
  if(C.inner){f.tough=Math.max(.75,f.tough*(1-.08*C.inner));f.nei=Math.round(f.nei*(1-.1*C.inner))}
  if(C.poison){f.atk=Math.round(f.atk*(1-.05*C.poison));f.tough=Math.max(.75,f.tough*(1-.04*C.poison))}
  if(C.fracture){f.spd=Math.round(f.spd*(1-.15*C.fracture));f.atk=Math.round(f.atk*(1-.08*C.fracture));f.dodge*=.6}
  if(C.wound)f.def=Math.round(f.def*(1-.1*C.wound));
  if(C.meridian){f.mpMax=Math.round(f.mpMax*(1-.2*C.meridian));f.mp=f.mpMax;f.regen=Math.round(f.regen*(1-.2*C.meridian)*10)/10}
  if(C.shaken){f.int*=1-.2*C.shaken;f.crit*=.7}
  LAST_ME=f;return f};
var LAST_ME=null,FIGHT_CTX=null;

/* ---------- gear that acts on its own in a fight ---------- */
const _runBattleC=runBattle;
runBattle=function(teams,opts){
  const ctx=FIGHT_CTX;FIGHT_CTX=null;const me=teams[0]&&teams[0][0];const pre=[];
  if(ctx&&me&&me.you&&ctx.stakes!=='spar'){const s=ctx.s;const foes=teams.slice(1).flat();
    const use=id=>{const i=s.items.findIndex(x=>x.id===id);if(i<0)return false;s.items.splice(i,1);return true};
    /* hidden weapons are thrown from the pouch slot: see anqi.js */
    if(foes.length&&chance(.6)&&use('caltrops')){foes.forEach(f=>f.spd=Math.round(f.spd*.8));pre.push(T('You scatter caltrops. Your opponents have to watch their feet.','你撒出一把铁蒺藜，对手只得步步留神。'))}}
  const r=_runBattleC(teams,opts);
  if(pre.length&&r.frames.length){const f0=r.frames[0];pre.reverse().forEach(t=>r.frames.unshift(Object.assign({},f0,{t,c:'sk'})))}
  if(ctx&&me&&me.you&&ctx.stakes==='death'&&r.winner!==0&&r.final[0].hp<=0){const s=ctx.s;const i=s.items.findIndex(x=>x.id==='smoke');
    if(i>=0){s.items.splice(i,1);r.final[0].hp=Math.max(1,Math.round(me.maxHp*.2));const last=r.frames[r.frames.length-1];
      r.frames.push(Object.assign({},last,{t:T('At the last moment you throw a smoke bomb and vanish.','千钧一发之际，你掷出一颗烟雾弹，趁乱脱身。'),c:'gold'}));r.escaped=1}}
  return r};

/* ---------- what a fight leaves behind ---------- */
const _fightLifeC=fightLife;
fightLife=function(s,foe,o){
  const stakes=(o&&o.stakes)||'injury';FIGHT_CTX={s,stakes};LAST_ME=null;
  const r=_fightLifeC(s,foe,o);FIGHT_CTX=null;const me=LAST_ME;
  if(!me||!s.alive||stakes==='spar')return r;
  const base=(stakes==='death'?1.3:stakes==='injury'?1:.35)*(eqHas(s,'jadecharm')?.75:1);const lost=!r.win;
  const roll=p=>chance(clamp(p*base,0,.9));
  if((me.qiTaken||0)>=me.maxHp*.2&&roll(.3+.4*Math.min(1,me.qiTaken/me.maxHp)))addCond(s,'inner',me.qiTaken>me.maxHp*.5?2:1);
  if(me.poisoned&&roll(.45))addCond(s,'poison',1);
  if((me.bigHits||0)>=2&&lost&&roll(.35))addCond(s,'fracture',1);
  if(r.dmg>=s.maxHealth*.25&&roll(.35))addCond(s,'wound',1);
  if(me.drained&&roll(.3))addCond(s,'meridian',1);
  if((me.shaken||(lost&&stakes==='death'))&&roll(.3))addCond(s,'shaken',1);
  return r};
/* other ways to get hurt leave marks too */
const _woundC=wound;
wound=function(s,lo,hi,cause){const r=_woundC(s,lo,hi,cause);const z=cause&&cause.zh||'';
  if(s.alive!==false&&!/余毒|旧日内伤|溃烂/.test(z)){if(/走火入魔|反噬|强练/.test(z)&&chance(.35))addCond(s,chance(.5)?'meridian':'inner',1);
    else if(/毒|蛇|蝎/.test(z)&&chance(.35))addCond(s,'poison',1);else if(/坠|摔|跌|落/.test(z)&&chance(.25))addCond(s,'fracture',1)}
  return r};

/* ---------- time: things heal, or get worse ---------- */
const _yearlyC=yearly;
yearly=function(s){_yearlyC(s);if(!s.alive||!s.conds)return;const C=s.conds;
  for(const k of Object.keys(C)){const sev=C[k],D=CONDS[k];
    const floor=Math.round(s.maxHealth*.15);
    if(k==='inner'&&s.health>floor){wound(s,sev,3*sev,T('an old internal injury','旧日内伤'));s.health=Math.max(s.health,floor)}
    if(k==='poison'&&s.health>floor){wound(s,2*sev,4*sev,T('poison that never left','余毒发作'));s.health=Math.max(s.health,floor)}
    if(k==='shaken')happy(s,-3*sev);
    if(!s.alive)return;
    let p=D.heal*(1+(s.t.root-5)*.06);if(k==='shaken'&&eqHas(s,'beads'))p+=.2;if(k==='inner')p+=Math.min(.2,s.qi/400);
    if(chance(p)){if(k==='fracture'&&chance(.15)){delete C[k];s.maxHealth=Math.max(25,s.maxHealth-3);say(s,'The bone has knitted, but crooked. It aches when rain is coming.','骨头长好了，却长歪了。一到阴雨天就隐隐作痛。','muted')}else easeCond(s,k,1)}
    else if(k==='wound'&&chance(.15)){wound(s,5,12,T('a festering wound','伤口溃烂'));say(s,'The wound festers. You run a fever for a week.','伤口溃烂了，你发了一个星期的烧。','bad')}
    else if(k==='poison'&&sev<3&&chance(.12))addCond(s,'poison',1)}};
/* the body slows training; inner energy can help heal from inside */
const _trainGainC=trainGain,_qiGainC=qiGain;
trainGain=function(s,f){return _trainGainC(s,f)*(s.conds&&s.conds.fracture?.5:1)};
qiGain=function(s,f){return _qiGainC(s,f)*(s.conds&&s.conds.meridian?1-.25*s.conds.meridian:1)};
(()=>{const A=ACT_BY.practice;if(!A)return;const r0=A.run;A.run=function(s){
  if(s.conds&&s.conds.inner){if(s.qi>=40&&chance(.22)){say(s,'You guide your inner energy around the damaged places, slowly, like water around stones.','你引导真气绕过受损之处，慢慢地，像水绕过石头。','good');easeCond(s,'inner',1,T('healing yourself with inner energy','运功疗伤'))}
    else if(chance(.12)){say(s,'You push too hard with an injury inside you.','你带着内伤苦练，用力过猛。','bad');addCond(s,'inner',1)}}
  return r0.call(A,s)}})();

/* ---------- treatment ---------- */
const TREAT={wound:[20,.8],fracture:[40,.7],poison:[50,.6],shaken:[20,.5],inner:[70,.45],meridian:[0,0]};
(()=>{const D=ACT_BY.doctor;if(!D)return;const r0=D.run;
 D.run=function(s){const ks=condKeys(s);if(!ks.length)return r0.call(D,s);
  ask(s,'doctor',{},ks.map(k=>({k,l:TREAT[k][0]?T(`Treat ${CONDS[k].n.en.toLowerCase()} (${TREAT[k][0]} taels)`,`医治${CONDS[k].n.zh}（${TREAT[k][0]}两）`):T(`Ask about ${CONDS[k].n.en.toLowerCase()}`,`问问${CONDS[k].n.zh}`),sub:T(`${SEVN[s.conds[k]].en}. ${CONDS[k].d.en}`,`${SEVN[s.conds[k]].zh}。${CONDS[k].d.zh}`)})).concat([{k:'gen',l:T('A general check-up (20 taels)','寻常看诊（二十两）')}]))};
 D.choose=function(s,k){if(k==='gen'){r0.call(D,s);return}const t=TREAT[k];if(!t)return;
  if(!t[0]){say(s,'The doctor shakes his head. "Meridians are beyond me. You need a famous physician, or a very rare medicine."','大夫摇头："经脉之伤，非我所能。你得去找神医，或者一味极难得的药。"','muted');return}
  if(s.money<t[0]){say(s,'You cannot afford the treatment.','你付不起诊金。','muted');return}payT(s,-t[0],'health');
  const r=R();if(r<.1){say(s,'The doctor is a quack. His treatment makes it worse.','这大夫是个庸医，越治越糟。','bad');addCond(s,k,1,true);return}
  if(r<.1+t[1]+(s.conds[k]===1?.15:0))easeCond(s,k,chance(.5)?2:1,T('treatment','医治'));else say(s,'The treatment does not take. Maybe next time.','这回没见效。也许下回。','muted')}})();
(()=>{const F=ACT_BY.famousdoc;if(!F)return;const r0=F.run;F.run=function(s){const had=condKeys(s);const out=r0.call(F,s);
  had.forEach(k=>{if(s.conds&&s.conds[k]&&chance(k==='meridian'?.55:.9))easeCond(s,k,3,T('the famous physician','神医妙手'))});return out}})();
/* friends and family help a shaken spirit */
(()=>{const C=PACT_BY.chat;if(!C)return;const r0=C.run;C.run=function(s,p){const r=r0.call(C,s,p);if(s.conds&&s.conds.shaken&&p.bond>=60&&chance(.25))easeCond(s,'shaken',1,T(`talking with ${p.n.py}`,`和${p.n.cn}谈心`));return r}})();

/* ---------- more things to own ---------- */
Object.assign(ITEMS,{
 spear:{cat:'weapon',n:T('Red-Tasselled Spear','红缨枪'),price:110,atk:9},
 ghostsaber:{cat:'weapon',n:T('Ghost-Head Saber','鬼头刀'),price:90,atk:8},
 chainwhip:{cat:'weapon',n:T('Nine-Section Whip','九节鞭'),price:70,atk:7},
 brush:{cat:'weapon',n:T('Judge’s Brush','判官笔'),price:320,atk:13,rare:.6},
 twinhooks:{cat:'weapon',n:T('Twin Hooks','护手双钩'),price:280,atk:13,rare:.7},
 rattan:{cat:'armor',n:T('Rattan Armour','藤甲'),price:60,def:6,hp:12},
 mirror:{cat:'armor',n:T('Heart-Guarding Mirror','护心镜'),price:150,def:8,hp:30},
 bonepaste:{cat:'pill',n:T('Bone-Setting Paste','接骨膏'),price:40,use:{cond:'fracture',amt:2}},
 antidote:{cat:'pill',n:T('Antidote Pill','解毒丹'),price:60,use:{cond:'poison',amt:3}},
 hushin:{cat:'pill',n:T('Heart-Guarding Pill','护心丹'),price:180,use:{cond:'inner',amt:1,heal:20}},
 incense:{cat:'pill',n:T('Calming Incense','安神香'),price:30,use:{cond:'shaken',amt:2,happy:3}},
 meridianpill:{cat:'pill',n:T('Meridian-Mending Pill','续脉丹'),price:1500,use:{cond:'meridian',amt:3},rare:.2},
 jadecharm:{cat:'charm',n:T('Safe-Journey Jade','平安玉佩'),price:80,happy:1,desc:T('Fewer lasting injuries from fights.','打斗后较少落下伤病。')},
 beads:{cat:'charm',n:T('Sandalwood Prayer Beads','檀香佛珠'),price:120,happy:2,desc:T('A shaken spirit heals faster.','心神受创好得更快。')},
 pearl:{cat:'charm',n:T('Night-Shining Pearl','夜明珠'),price:900,happy:4,rare:.3,desc:T('Beautiful, valuable, and coveted by thieves.','美丽贵重，也招贼惦记。')},
 smoke:{cat:'tool',n:T('Smoke Bomb','烟雾弹'),price:40,desc:T('Used by itself when you are about to die in a fight: you escape.','生死相搏将要落败时自动使用，借烟脱身。')},
 caltrops:{cat:'tool',n:T('Caltrops','铁蒺藜'),price:25,desc:T('Often scattered at the start of a real fight: opponents slow down.','真打起来时常会先撒出去，拖慢对手。')},
 darts:{cat:'tool',n:T('Throwing Stones','飞蝗石'),price:15,desc:T('Often thrown at the start of a real fight for a little free damage.','真打起来时常会先甩出去，先伤对方一点。')}});
Object.assign(ITEMS.salve,{use:{heal:22,cond:'wound',amt:1}});
Object.assign(ITEMS.jadedew,{use:{heal:70,cure:1,cond:['inner','poison','wound'],amt:1}});
Object.assign(ITEMS.bigreturn,{use:{qi:22,cond:'inner',amt:2}});
MARKET.push('spear','ghostsaber','chainwhip','rattan','mirror','bonepaste','antidote','incense','jadecharm','beads','smoke','caltrops','darts');
RARE.push('brush','twinhooks','meridianpill','pearl','hushin');
(()=>{const rs=rollStock;rollStock=function(s){rs(s);if(chance(.5))s.stock.ids.push('hushin');if(chance(.3))s.stock.ids.push(pick(['brush','twinhooks']))}})();
/* medicines that treat injuries */
const _useItemC=useItem;
useItem=function(s,idx){const it=s.items[idx];const d=it&&itemDef(it.id);const u=d&&d.use;const ks=u&&u.cond?[].concat(u.cond):[];
  _useItemC(s,idx);if(u&&u.happy)happy(s,u.happy);ks.forEach(k=>{if(s.conds&&s.conds[k])easeCond(s,k,u.amt||1)})};
/* charms count toward how settled you feel at home */
const _homeHappyC=homeHappy;homeHappy=function(s){const c=best(s,'charm');return _homeHappyC(s)+(c&&c.happy||0)};
/* a night-shining pearl draws thieves */
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive)return;const i=s.items.findIndex(x=>x.id==='pearl');if(i>=0&&chance(.06)){s.items.splice(i,1);say(s,'Your night-shining pearl is stolen. The thief left the lamp burning.','你的夜明珠被偷了。贼走时连灯都没吹。','bad')}}})();

/* ---------- for the interface ---------- */
const STS={poison:[T('Poisoned','中毒'),'bad'],stun:[T('Locked','被点穴'),'bad'],conf:[T('Confused','神志不清'),'bad'],dodge:[T('Evasive','身法飘忽'),'good'],shield:[T('Qi shield','护体真气'),'good'],
 atkUp:[T('Frenzied','狂暴'),'good'],atkDown:[T('Weakened','力竭'),'bad'],defUp:[T('Guarded','守势'),'good'],defDown:[T('Guard broken','破防'),'bad'],spdUp:[T('Quickened','加速'),'good'],spdDown:[T('Slowed','迟缓'),'bad'],noqi:[T('Out of qi','真气不济'),'bad']};
Object.keys(CONDS).forEach(k=>STS['c_'+k]=[CONDS[k].n,'scar']);
function stChips(tags){return(tags||[]).map(k=>STS[k]?`<span class="stc ${STS[k][1]}">${tr(STS[k][0])}</span>`:'').join('')}
function condBox(s){const ks=condKeys(s);if(!ks.length||!s.alive)return'';
  return`<div class="quests condbox"><span class="lbl">${zh()?'伤病':'Injuries'}</span><ul>${ks.map(k=>`<li title="${esc(tr(CONDS[k].cure))}"><b>${tr(CONDS[k].n)}</b>（${tr(SEVN[s.conds[k]])}）<span class="muted"> ${tr(CONDS[k].d)} ${zh()?'医治：':'Treatment: '}${tr(CONDS[k].cure)}</span></li>`).join('')}</ul></div>`}
