/* 江湖一生 · a world that changes under you: harvests, prices, unrest, the cost of living; mounts that carry you rather than fight for you;
   animals that grow old; and hooks for richer description (filled by ev_texture.js) */
'use strict';

/* ---------- description hooks ---------- */
const TEXTURE=[];   /* {age:[a,b], w, when:s=>bool, t:s=>T(..)}: small everyday moments, about one a year */
const FLAVOR={};    /* FLAVOR[key] = [{when:s=>bool, t:s=>T(..)} | s=>T(..)]: how an action is described */
function flv(s,key,en,zh,cls){
  const pool=(FLAVOR[key]||[]).filter(f=>typeof f==='function'||!f.when||f.when(s));
  if(pool.length&&chance(.85)){s.flvSeen=s.flvSeen||[];const fresh=pool.filter(f=>!s.flvSeen.includes(key+FLAVOR[key].indexOf(f)));const f=pick(fresh.length?fresh:pool);
    s.flvSeen.push(key+FLAVOR[key].indexOf(f));if(s.flvSeen.length>40)s.flvSeen.shift();const t=(typeof f==='function'?f:f.t)(s);if(t&&t.en){say(s,t.en,t.zh,cls);return}}
  say(s,en,zh,cls)}
function texture(s){
  const pool=TEXTURE.filter(x=>(!x.age||(s.age>=x.age[0]&&s.age<=x.age[1]))&&(!x.when||x.when(s)));if(!pool.length)return;
  s.texSeen=s.texSeen||[];const fresh=pool.filter(x=>!s.texSeen.includes(TEXTURE.indexOf(x)));const x=wpick(fresh.length?fresh:pool,x=>x.w??1);if(!x)return;
  s.texSeen.push(TEXTURE.indexOf(x));if(s.texSeen.length>80)s.texSeen.shift();const t=x.t(s);if(t&&t.en)say(s,t.en,t.zh,'muted')}

/* ---------- mounts carry you; they do not fight for you ---------- */
Object.assign(ITEMS.donkey,{spd:0,travel:1,flee:.1,upkeep:2,life:20});
Object.assign(ITEMS.horse,{spd:0,travel:1,flee:.3,upkeep:8,life:16});
Object.assign(ITEMS.bloodhorse,{spd:0,travel:1,flee:.5,upkeep:20,life:20});
Object.assign(ITEMS.dog,{life:13});Object.assign(ITEMS.cat,{life:16});Object.assign(ITEMS.monkey,{life:20});Object.assign(ITEMS.falcon,{life:12});Object.assign(ITEMS.crane,{life:40});
gearStats=function(s){const w=best(s,'weapon','atk'),a=best(s,'armor','def');return{atk:w?w.atk:0,def:a?a.def:0,hp:a?a.hp:0,spd:0}};
const ride=s=>{const m=best(s,'mount','flee');return m||null};
const TRAVEL_ACTS=['wander','travel','sightsee','contract','robconvoy','famousdoc','master','org_contract','joinsect','joinevil'];
const _actCost=actCost;
actCost=function(s,a){const c=_actCost(s,a);return typeof c==='number'&&c>=2&&TRAVEL_ACTS.includes(a.id)&&ride(s)?c-1:c};
/* a horse under you is the best way out of a fight you are losing */
const _fightLife=fightLife;
fightLife=function(s,foe,o){
  const m=ride(s),stakes=(o&&o.stakes)||'injury';
  if(!m||stakes!=='death')return _fightLife(s,foe,o);
  const h0=s.health,r=_fightLife(s,foe,o);
  if(!r.win&&s.health<=0&&chance(m.flee)){s.health=Math.max(1,Math.min(h0,rint(4,12)));say(s,`Bleeding, you throw yourself onto your ${m.n.en.toLowerCase()} and ride until the shouting fades.`,`你浑身是血，翻身上了${m.n.zh}，一路狂奔，直到喊杀声远去。`,'bad')}
  return r};

/* ---------- the year’s fortunes: harvest, prices, unrest ---------- */
const HARVEST=[T('a terrible year','大荒之年'),T('a poor harvest','歉收'),T('an ordinary year','平年'),T('a good harvest','丰年'),T('a bumper harvest','大丰收')];
const UNREST=[T('peaceful','太平'),T('restless','不太平'),T('lawless','盗匪横行'),T('in turmoil','天下大乱')];
const PRICE=[2.4,1.6,1,.85,.75];
function rollWorld(s){
  const w=s.world||{h:0,u:0};
  const r=R();let h=r<.07?-2:r<.25?-1:r<.75?0:r<.93?1:2;if(chance(.3))h=w.h;
  let u=w.u+(chance(.1+(h<=-1?.2:0)+(s.flags.b_war!=null?.4:0))?1:0)-(chance(.25)?1:0);u=clamp(u,0,3);
  s.world={h,u,p:Math.round(PRICE[h+2]*(1+u*.15)*100)/100};return{old:w,w:s.world}}
const DISASTER={central:[T('drought','大旱'),T('the Yellow River floods','黄河决口')],jiangnan:[T('floods','大水'),T('a typhoon','台风')],shu:[T('landslides','山崩'),T('drought','大旱')],north:[T('a white blizzard','白灾'),T('drought','大旱')],
 west:[T('sandstorms','沙暴'),T('a dry well-year','井枯')],miao:[T('a plague of rats','鼠患'),T('floods','山洪')],east:[T('a typhoon','台风'),T('red tide','赤潮')],capital:[T('locusts','蝗灾'),T('drought','大旱')]};
function worldLines(s,old){
  const w=s.world,reg=region(s),d=pick(DISASTER[s.region]||[T('drought','大旱')]);
  if(w.h===-2)say(s,`${reg.en}: ${d.en}. Rice costs ${w.p} times what it did; people eat bark.`,`${reg.cn}${d.zh}，米价涨到往年的${w.p}倍，有人开始吃树皮。`,'bad');
  else if(w.h===-1&&old.h>-1)say(s,`A poor harvest in ${reg.en}. Prices creep up.`,`${reg.cn}歉收，物价一点点往上涨。`,'muted');
  else if(w.h===2)say(s,`A bumper harvest. Granaries overflow and wine is cheap.`,`大丰收。粮仓满得堆不下，酒也便宜了。`,'good');
  if(w.u>old.u)say(s,w.u>=3?`The whole region is in turmoil. Nobody travels without a blade.`:w.u===2?`Bandits own the roads now. Even the post riders travel in groups.`:`Refugees on the roads; the price of a good lock goes up.`,w.u>=3?`天下大乱，出门没人不带刀。`:w.u===2?`如今道上是土匪的天下，连驿卒都结伴而行。`:`路上多了流民，好锁的价钱都涨了。`,'muted');
  else if(w.u<old.u&&w.u===0)say(s,'The roads are quiet again.','路上又太平了。','muted');
}
/* living costs money once you live on your own */
function livingCost(s){
  if(s.age<16||s.jail>0)return;
  const fam=family(s),home=parents2(s)&&s.age<22&&!spouseOf(s);
  const base=s.sect&&!s.retired?3:home?2:fam.rich>=4&&s.age<25?0:7;
  const cost=Math.round(base*s.world.p);if(!cost)return;
  if(s.money>=cost){payT(s,-cost,'living');if(s.world.p>=1.5)say(s,`Food alone costs you ${cost} taels this year.`,`光是吃饭，今年就花了${cost}两。`,'muted')}
  else if(parents2(s)&&s.age<30){pay(s,-s.money);happy(s,-2);say(s,'You are short of money; your parents quietly feed you again.','你手头紧，爹娘又默默管了你的饭。','muted')}
  else{pay(s,-s.money);happy(s,-6);s.health=Math.max(Math.min(s.health,12),s.health-rint(3,8));say(s,'You cannot afford enough to eat. Some days there is nothing at all.','你吃不饱饭，有些日子干脆什么也没得吃。','bad')}
}
const parents2=s=>s.people.some(p=>p.alive&&(p.rel==='father'||p.rel==='mother'));

/* animals grow old */
function animals(s){
  for(let i=s.items.length-1;i>=0;i--){const it=s.items[i],d=ITEMS[it.id];if(!d||!d.life||!['mount','pet'].includes(d.cat))continue;
    const yrs=s.age-(it.age??s.age);if(yrs>=d.life-3&&chance(.12+(yrs-(d.life-3))*.12)){s.items.splice(i,1);happy(s,d.cat==='pet'?-6:-3);
      say(s,d.cat==='pet'?`Your ${d.n.en.toLowerCase()} dies of old age, curled up in its favourite spot. You bury it under the plum tree.`:`Your ${d.n.en.toLowerCase()} grows too old to carry you, and one morning does not get up.`,
        d.cat==='pet'?`你的${d.n.zh}老死了，蜷在它最喜欢的角落。你把它埋在了梅树下。`:`你的${d.n.zh}老得驮不动你了，某天早上再也没站起来。`,'bad')}}
  owned(s,'mount').forEach(m=>{if(m.upkeep)payT(s,-Math.round(m.upkeep*(s.world?s.world.p:1)),'mount')});
}

const _yearly2=yearly;
yearly=function(s){
  const {old}=rollWorld(s);
  _yearly2(s);
  if(!s.alive)return;
  if(s.age>=6)worldLines(s,old);
  livingCost(s);animals(s);
  /* bad years have consequences of their own */
  if(s.age>=14&&s.jail<=0){
    if(s.world.h===-2&&INC_BY.w_famine&&s.seen.w_famine==null&&chance(.5))runIncident(s,INC_BY.w_famine);
    else if(s.world.u>=2&&INC_BY.banditroad&&chance(.2)&&(s.seen.banditroad==null||s.age-s.seen.banditroad>=3))runIncident(s,INC_BY.banditroad);
  }
  if(s.world.h<=-1&&family(s).rich<=1&&s.age<16)happy(s,-3);
  if(s.age>=2&&chance(s.age<6?.5:.7))texture(s);
};
