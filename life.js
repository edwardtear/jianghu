/* 江湖一生 · life: the yearly loop, incidents, fights, effects, death */
'use strict';
const BATTLES={};          // replays kept in memory for the "watch" buttons
const SHOW=[];             // battles the UI should play next
function say(s,en,zh,c,extra){const L=s.log[s.log.length-1];if(!L)return;L.lines.push(Object.assign({t:T(en,zh),c},extra||{}))}
function sayT(s,t,c,extra){if(t)say(s,t.en,t.zh,c,extra)}
function eraLabel(s){return T(`Year ${s.eraYear} of ${s.era.py}`,`${s.era.cn}${s.eraYear===1?'元':cnNum(s.eraYear)}年`)}
const deed=(s,en,zh)=>s.deeds.push(T(en,zh));
const ageF=a=>a<6?0:a<13?.6:a<36?1:a<51?.8:a<66?.5:.25;
function trainGain(s,f){return(s.t.wit*.5+s.t.root*.5)*.3*mult(s)*ageF(s.age)*f*(.8+R()*.4)/(1+s.skill/(25+(s.t.wit+s.t.root)*4))}
function qiGain(s,f){return(s.t.root*.3+s.t.heart*.25)*.4*ageF(s.age)*f*(s.flags.qiBonus?1.5:1)*(.8+R()*.4)/(1+s.qi/(20+s.t.root*6))}
function wound(s,lo,hi,cause){const n=rint(lo,hi);s.health-=n;if(cause)s.cause=T(cause.en,'死于'+cause.zh);
  return n>=40?T('grievous wounds','重伤'):n>=22?T('serious wounds','不轻的伤'):T('cuts and bruises','些许皮外伤')}
const heal=(s,n)=>{s.health=Math.min(s.maxHealth,s.health+n)};
const happy=(s,n)=>{s.happy=clamp(s.happy+n,0,100)};
/* every coin in or out is booked under whatever the player was doing (LTAG), so the ledger can show where money goes */
var LTAG='other',LSUB=null;
/* LSUB, when set, also books the coin to one named thing (which shop), so the ledger can break a category down */
const pay=(s,n)=>{const v=Math.max(0,Math.round(s.money+n))-s.money;s.money+=v;if(v&&s.ledger){const L=s.ledger.items;L[LTAG]=(L[LTAG]||0)+v;
  if(LSUB){const D=s.ledger.sub=s.ledger.sub||{},k=LTAG+'|'+LSUB.zh;(D[k]=D[k]||{c:LTAG,n:LSUB,v:0}).v+=v}}};
/* a shop's name in the books: 茶摊（一）, 茶摊（二）… when you own several of the same kind */
const bizLabel=(s,it)=>{const d=itemDef(it.id);const same=s.items.filter(x=>x.id===it.id);
  /* the number stays with the shop, so selling one does not renumber the others */
  same.forEach(x=>{if(!x.no)x.no=Math.max(0,...same.map(y=>y.no||0))+1});if(same.length<2)return T(d.n.en,d.n.zh);return T(`${d.n.en} #${it.no}`,`${d.n.zh}（${cnNum(it.no)}）`)};
const payT=(s,n,k)=>{const o=LTAG;LTAG=k;pay(s,n);LTAG=o};
const fmtMoney=n=>Math.round(n).toLocaleString('en-US');

/* ---------- gear & items ---------- */
const ITEMS={
 woodsword:{cat:'weapon',n:T('Wooden Sword','木剑'),price:5,atk:2},
 ironsword:{cat:'weapon',n:T('Iron Sword','铁剑'),price:40,atk:6},
 steelsword:{cat:'weapon',n:T('Green Steel Sword','青钢剑'),price:160,atk:12},
 coldsaber:{cat:'weapon',n:T('Cold Iron Saber','寒铁刀'),price:480,atk:20,rare:.7},
 heavysword:{cat:'weapon',n:T('Black-Gold Heavy Sword','乌金重剑'),price:1600,atk:32,rare:.35},
 yitian:{cat:'weapon',n:T('Mountain-Pressing Sword','镇岳剑'),price:6500,atk:50,rare:.07},
 tulong:{cat:'weapon',n:T('Sky-Splitting Saber','裂天刀'),price:8000,atk:58,rare:.05},
 leather:{cat:'armor',n:T('Leather Vest','皮甲'),price:30,def:4,hp:10},
 chain:{cat:'armor',n:T('Chainmail','锁子甲'),price:240,def:10,hp:25},
 hedgehog:{cat:'armor',n:T('Gold-Thread Vest','金丝软甲'),price:1900,def:20,hp:50,rare:.3},
 goldsilk:{cat:'armor',n:T('Gold-Silk Armor','金丝甲'),price:4200,def:28,hp:80,rare:.12},
 donkey:{cat:'mount',n:T('Donkey','毛驴'),price:20,spd:2,happy:2},
 horse:{cat:'mount',n:T('Yellow Horse','黄骠马'),price:170,spd:5,happy:3},
 bloodhorse:{cat:'mount',n:T('Blood-Sweating Horse','汗血宝马'),price:2400,spd:10,happy:6,rare:.3},
 hut:{cat:'house',n:T('Thatched Hut','茅屋'),price:80,happy:4,upkeep:1},
 courtyard:{cat:'house',n:T('Courtyard House','小院'),price:480,happy:8,upkeep:5},
 mansion:{cat:'house',n:T('Mansion','大宅'),price:3200,happy:14,upkeep:30},
 manor:{cat:'house',n:T('Mountain Manor','山庄'),price:12000,happy:20,upkeep:100,rare:.5},
 teastall:{cat:'biz',n:T('Tea Stall','茶摊'),price:100,inc:[4,26]},
 tavern:{cat:'biz',n:T('Tavern','酒楼'),price:1500,inc:[40,320],risk:.08},
 escortco:{cat:'biz',n:T('Escort Agency','镖局'),price:5000,inc:[150,950],risk:.12},
 bank:{cat:'biz',n:T('Money Shop','钱庄'),price:20000,inc:[700,2800],risk:.05,rare:.5},
 salve:{cat:'pill',n:T('Wound Salve','金疮药'),price:12,use:{heal:22}},
 jadedew:{cat:'pill',n:T('Jade Dew Pill','玉露丸'),price:260,use:{heal:70,cure:1}},
 bigreturn:{cat:'pill',n:T('Great Return Pill','大还丹'),price:650,use:{qi:22},rare:.5},
 lifepill:{cat:'pill',n:T('Life-Extending Pill','续命丹'),price:3200,use:{life:5},rare:.2},
 falcon:{cat:'pet',n:T('Hunting Falcon','猎鹰'),price:120,happy:4},
 monkey:{cat:'pet',n:T('Clever Monkey','灵猴'),price:60,happy:5},
 cat:{cat:'pet',n:T('Lazy Cat','懒猫'),price:8,happy:3},
 dog:{cat:'pet',n:T('Scruffy Dog','土狗'),price:5,happy:4},
 crane:{cat:'pet',n:T('White Crane','白鹤'),price:200,happy:6}
};
const BOOK_PRICE=[150,350,1300,7000];
function itemDef(id){if(id.startsWith('book:')){const a=ARTS[id.slice(5)];return{cat:'book',n:T(`Manual: ${a.n}`,`秘籍《${a.cn}》`),price:BOOK_PRICE[a.tier],art:id.slice(5)}}return ITEMS[id]}
const owned=(s,cat)=>s.items.map(x=>Object.assign({key:x.id},itemDef(x.id),x)).filter(x=>!cat||x.cat===cat);
/* weapons, armour, mounts and charms: you own as many as you like, but only one of each is in use */
const SLOTS={weapon:'atk',armor:'def',mount:'flee',charm:'happy'};
function eqItem(s,cat){const its=s.items.filter(x=>{const d=itemDef(x.id);return d&&d.cat===cat});if(!its.length)return undefined;
  let e=its.find(x=>x.eq);if(!e){const k=SLOTS[cat];e=its.slice().sort((a,b)=>((itemDef(b.id)[k]||0)-(itemDef(a.id)[k]||0))||((itemDef(b.id).price||0)-(itemDef(a.id).price||0)))[0];e.eq=true}
  its.forEach(x=>{if(x!==e&&x.eq)delete x.eq});return Object.assign({key:e.id},itemDef(e.id),e)}
function equip(s,i){const it=s.items[i];if(!it)return;const d=itemDef(it.id);if(!d||!SLOTS[d.cat])return;s.items.forEach(x=>{const dx=itemDef(x.id);if(dx&&dx.cat===d.cat)delete x.eq});it.eq=true}
const eqHas=(s,id)=>{const d=itemDef(id);const e=d&&SLOTS[d.cat]?eqItem(s,d.cat):null;return!!e&&e.id===id};
const best=(s,cat,k)=>SLOTS[cat]?eqItem(s,cat):owned(s,cat).sort((a,b)=>(b[k]||0)-(a[k]||0))[0];
function gearStats(s){const w=best(s,'weapon','atk'),a=best(s,'armor','def'),m=best(s,'mount','spd');return{atk:w?w.atk:0,def:a?a.def:0,hp:a?a.hp:0,spd:m?m.spd:0}}
function homeHappy(s){const h=best(s,'house','happy');return(h?h.happy:0)+owned(s,'pet').reduce((t,p)=>t+p.happy,0)+(best(s,'mount','happy')||{happy:0}).happy}
/* the market sells everyday goods only; anything rare has to find you */
const MARKET=['woodsword','ironsword','steelsword','leather','chain','donkey','horse','hut','courtyard','mansion','teastall','tavern','salve','jadedew'];
const RARE=['coldsaber','heavysword','yitian','tulong','hedgehog','goldsilk','bloodhorse','manor','escortco','bank','bigreturn','lifepill','falcon','monkey','crane'];
function rollStock(s){
  const ids=MARKET.filter(k=>!['steelsword','chain','mansion','tavern','jadedew'].includes(k)||chance(.75));
  s.stock={age:s.age,ids,mkt:.8+R()*.45};
}
/* a secret seller: three rare things, steep prices, and not everything is what it seems */
function rareOffer(s){
  const pool=shuffle(RARE.filter(k=>!(['yitian','tulong'].includes(k)&&!chance(.25))&&!(k==='bank'&&s.money<15000)));
  const books=shuffle(Object.keys(ARTS).filter(k=>!ARTS[k].rare&&!ARTS[k].bad&&!['familysword','escortsaber','prisonart','street','ninesun','nineyin','beiming','lingboweibu','sixmeridian'].includes(k)||(ARTS[k].tier===3&&chance(.06)&&!ARTS[k].rare&&!ARTS[k].bad&&!['prisonart','familysword'].includes(k)))).map(k=>'book:'+k);
  const ids=pool.slice(0,2).concat(books.slice(0,1));
  return ids.map(id=>({id,price:Math.round(itemDef(id).price*(1.1+R()*.5)),fake:chance(.15)}));
}

/* ---------- people ---------- */
const REL={father:T('Father','父亲'),mother:T('Mother','母亲'),master:T('Master','师父'),fellow:T('Fellow disciple','同门'),friend:T('Friend','朋友'),sworn:T('Sworn sibling','结义'),
  lover:T('Sweetheart','心上人'),ex:T('Former lover','旧情人'),disciple:T('Disciple','徒弟'),rival:T('Rival','对手'),enemy:T('Enemy','仇人'),acq:T('Acquaintance','相识')};
function relLabel(s,p){
  if(p.rel==='sibling'){const older=p.age>s.age;return p.sex==='m'?(older?T('Older brother','哥哥'):T('Younger brother','弟弟')):(older?T('Older sister','姐姐'):T('Younger sister','妹妹'))}
  if(p.rel==='spouse')return p.sex==='m'?T('Husband','丈夫'):T('Wife','妻子');
  if(p.rel==='child')return p.sex==='m'?T('Son','儿子'):T('Daughter','女儿');
  return REL[p.rel]||REL.acq;
}
function storeNpc(s,c,rel,bond){
  const n=c.npc;if(!n)return null;
  /* meeting someone you already know never demotes them: your mother stays your mother, she just likes you more */
  if(c.pid){const p=person(s,c.pid);if(p){if(!p.sect){const sd=n.sect||c.sect||((rel==='fellow'||c.sib)&&s.sect);if(sd&&SECTS[sd])p.sect=sd}const keep=['father','mother','sibling','spouse','child','lover','master','disciple'].includes(p.rel)&&['friend','acq','sworn','rival','fellow'].includes(rel);
    if(keep){if(bond!=null)p.bond=Math.max(p.bond,bond);return p}p.rel=rel;if(bond!=null)p.bond=bond;return p}}
  /* someone known only by a nickname still gets a surname slot, taken from the name itself */
  const nn=Object.assign({},n.n||{cn:n.zh||'?',py:n.en||'?'});if(!nn.sur||!nn.sur[0])nn.sur=[(nn.cn||'?')[0],String(nn.py||'').split(' ')[0]||''];
  const p={id:++s.pid,n:nn,sex:n.sex,age:n.age,rel,bond:bond??60,alive:true,trait:n.trait,lv:n.lv,occ:n.occ,met:s.age,talked:-1};
  /* their sect comes with them; a fellow disciple, or someone the scene calls your senior or junior, is of your own sect */
  const sid=n.sect||c.sect||((rel==='fellow'||c.sib)&&s.sect)||null;if(sid&&SECTS[sid])p.sect=sid;
  s.people.push(p);c.pid=p.id;return p;
}
function addBond(p,n){if(p)p.bond=clamp(p.bond+n,0,100)}
const pn=p=>T(p.n.py,p.n.cn);

/* ---------- fights ---------- */
const STAKES={spar:10,light:20,injury:36,death:60};
function fightLife(s,foe,o){
  o=o||{};const stakes=o.stakes||'injury';
  const me=effFighter(youFighter(s)),start=me.hp;
  const allies=(o.allies||[]).map(a=>npcFighter(a.name,a.lv,a));
  const them=[npcFighter(foe.name,Math.max(1,Math.round(foe.lv)),foe)].concat((foe.extra||[]).map(a=>npcFighter(a.name,a.lv,a)));
  const r=runBattle([[me].concat(allies),them],{open:o.open,stakes});
  const id=++s.bt;r.title=o.title||T('A fight','交手');r.stakes=stakes;BATTLES[id]=r;SHOW.push(id);
  const keys=Object.keys(BATTLES);if(keys.length>40)delete BATTLES[keys[0]];
  const win=r.winner===0,end=Math.max(0,Math.round(r.final[0].hp));
  /* what the fight took is what you lose; bruises from a friendly bout mostly heal by evening */
  let dmg=Math.round((start-end)/(me.k||1)*(stakes==='spar'?.4:stakes==='light'?.7:1)),leftForDead=false;
  if(stakes==='death'&&end<=0){if(chance(.45+s.t.luck*.03)){leftForDead=true;dmg=s.health-rint(2,6)}else dmg=s.health}
  dmg=clamp(dmg,0,Math.max(0,s.health));s.health-=dmg;
  if(dmg>0)s.cause=T(o.cause?o.cause.en:'wounds from a fight','死于'+(o.cause?o.cause.zh:'一场恶斗留下的伤'));
  const foeN=foe.name;
  say(s,`⚔ ${win?'You defeat':'You lose to'} ${foeN.en||foeN}${dmg>0?` (−${dmg} health)`:''}.`,`⚔ 你${win?'击败了':'败给了'}${foeN.zh||foeN}${dmg>0?`（气血−${dmg}）`:''}。`,win?'fight win':'fight lose',{b:id});
  if(leftForDead)say(s,'You are left for dead, and somehow wake up the next morning.','你被当作死人丢在路边，第二天早上竟醒了过来。','bad');
  return{win,id,dmg};
}
const STAKE_T={spar:T('a friendly bout','点到为止'),light:T('not lethal','不伤性命'),injury:T('dangerous','凶险'),death:T('to the death','生死相搏')};
function fightHint(s,f){const fl=Math.round(f.foe.lv)+(f.foe.extra||[]).reduce((t,x)=>t+x.lv,0),me=power(s)+(f.allies||[]).reduce((t,x)=>t+x.lv,0);
  return{foe:fl,me,stakes:f.stakes||'injury'}}
/* ---------- effects ---------- */
function applyFx(s,e,c){
  if(!e)return;c=c||{};
  const n=v=>typeof v==='function'?v(s,c):Array.isArray(v)?rint(v[0],v[1]):v;
  if(e.money!=null)pay(s,n(e.money));
  if(e.happy!=null)happy(s,n(e.happy));
  if(e.smarts!=null)s.smarts=clamp(s.smarts+n(e.smarts),0,100);
  if(e.looks!=null)s.looks=clamp(s.looks+n(e.looks),0,100);
  if(e.fame!=null)s.fame=Math.max(0,s.fame+n(e.fame));
  if(e.align!=null)s.align=clamp(s.align+n(e.align),-100,100);
  if(e.skill!=null)s.skill=Math.max(0,s.skill+n(e.skill));
  if(e.qi!=null)s.qi=Math.max(0,s.qi+n(e.qi));
  if(e.heal!=null)heal(s,n(e.heal));
  if(e.hurt){const cause=e.cause||c.cause||T('an accident','一场意外');wound(s,e.hurt[0],e.hurt[1],cause)}
  if(e.wanted!=null)s.wanted=clamp(s.wanted+n(e.wanted),0,5);
  if(e.lifespan!=null)s.lifespan+=n(e.lifespan);
  if(e.maxHealth!=null)s.maxHealth=clamp(s.maxHealth+n(e.maxHealth),20,140);
  if(e.talent)for(const k in e.talent)s.t[k]=clamp(s.t[k]+e.talent[k],1,10);
  if(e.meet){const p=storeNpc(s,c,e.meet,e.bond??rint(55,75));if(p&&e.lv)p.lv=e.lv}
  else if(e.bond!=null){const p=c.pid?person(s,c.pid):(c.who?person(s,c.who):null);addBond(p,n(e.bond))}
  if(e.art){const a=typeof e.art==='string'?ARTS[e.art]:e.art;if(a&&learn(s,a))say(s,`You learned ${a.n} (${a.cn}).`,`你学会了${a.cn}。`,'gold')}
  if(e.item){[].concat(e.item).forEach(id=>s.items.push({id,age:s.age}))}
  if(e.ill)s.ill=e.ill;
  if(e.cure)s.ill=null;
  if(e.flag)[].concat(e.flag).forEach(f=>s.flags[f]=s.age);
  if(e.unflag)[].concat(e.unflag).forEach(f=>delete s.flags[f]);
  if(e.deed){const d=typeof e.deed==='function'?e.deed(c,s):e.deed;s.deeds.push(d)}
  if(e.jail){const y=n(e.jail);s.jail=Math.max(s.jail,y);s.job=null;say(s,`You are thrown into prison for ${y} year${y>1?'s':''}.`,`你被打入大牢，刑期${cnNum(y)}年。`,'bad')}
  if(e.enemy){storeNpc(s,c,'enemy',rint(0,10))}
  if(e.die){s.health=0;s.cause=e.die}
  if(e.f)e.f(s,c);
}

/* ---------- incidents ---------- */
const INC=[],INC_BY={};
/* side quests: a flag with a hint here shows under "Unfinished business" until it is cleared */
const QHINT={};
/* two incidents may never share an id: a choice would be resolved by the wrong one */
function I(d){d.cd=d.cd??10;if(INC_BY[d.id]){let n=2;while(INC_BY[d.id+'_'+n])n++;d.id=d.id+'_'+n}INC.push(d);INC_BY[d.id]=d}
function defaultCtx(s){const c=scene();c.npc=npc(s);return c}
function eligible(s,i,tag){
  if(i.force||i.sys)return false;
  if(tag?!(i.tags||[]).includes(tag):i.only)return false;
  if(i.age&&(s.age<i.age[0]||s.age>i.age[1]))return false;
  if(s.jail>0&&!(i.tags||[]).includes('jail'))return false;
  if(s.jail<=0&&(i.tags||[]).includes('jail'))return false;
  const last=s.seen[i.id];
  if(last!=null&&(i.once||s.age-last<i.cd))return false;
  if(i.need&&!s.flags[i.need])return false;
  if(i.when&&!i.when(s))return false;
  return true;
}
function pickIncident(s,tag){
  const pool=INC.filter(i=>eligible(s,i,tag));
  /* things you have never lived through come up more often than repeats */
  return wpick(pool,i=>(typeof i.w==='function'?i.w(s):(i.w??1))*(s.seen[i.id]==null?1.6:1));
}
function runIncident(s,inc,c){
  if(!inc)return false;
  s.seen[inc.id]=s.age;
  if(!c){if(typeof CUR_S!=='undefined')CUR_S=s;c=Object.assign(scene(),inc.ctx?inc.ctx(s):{});if(!c.npc)c.npc=npc(s)}
  const text=inc.text(c,s);
  if(inc.opts){
    const vis=inc.opts.map((o,k)=>({o,k})).filter(x=>(!x.o.if||x.o.if(s,c))&&(!x.o.cost||s.money>=x.o.cost));
    vis.forEach(x=>{if(x.o.fight)c['f'+x.k]=x.o.fight(s,c)});
    s.queue.push({src:'inc',id:inc.id,c,text,opts:vis.map(x=>({k:x.k,l:lab(x.o.l,c,s),sub:x.o.sub?lab(x.o.sub,c,s):null,fight:x.o.fight?fightHint(s,c['f'+x.k]):null}))});
  }else{sayT(s,text,inc.c||'');resolve(s,inc.out,c)}
  return true;
}
const lab=(x,c,s)=>typeof x==='function'?x(c,s):x;
function resolve(s,outs,c){
  if(!outs||!outs.length)return;
  const ok=outs.filter(o=>!o.if||o.if(s,c));
  const o=wpick(ok,o=>typeof o.w==='function'?o.w(s,c):(o.w??1))||ok[0];
  if(!o)return;
  sayT(s,lab(o.t,c,s),o.c);
  applyFx(s,typeof o.fx==='function'?o.fx(s,c):o.fx,c);
  if(o.next){const n=INC_BY[o.next];if(n)runIncident(s,n,o.keep?c:null)}
}
function chooseInc(s,q,k){
  const inc=INC_BY[q.id],o=inc.opts[k],c=q.c;
  if(o.cost){if(s.money<o.cost){say(s,'You cannot afford it, so you do nothing.','你囊中羞涩，只得作罢。','muted');return}pay(s,-o.cost)}
  if(o.fight){const f=c['f'+k]||o.fight(s,c);const r=fightLife(s,f.foe,f);c.fightWon=r.win;resolve(s,r.win?o.win:o.lose,c)}
  else resolve(s,o.out,c);
}

/* the queue holds anything waiting on a decision: incidents, activities, people */
function choose(s,k){
  const q=s.queue.shift();if(!q)return;
  const o=(q.opts||[]).find(x=>x.k===k);const before=snap(s);
  if(q.text)sayT(s,q.text,q.follow?'prompt follow':'prompt');
  if(o)say(s,'You chose: '+o.l.en,'你选择：'+o.l.zh,'you');
  if(q.src==='inc')chooseInc(s,q,k);
  else if(q.src==='act'){const r=ACT_BY[q.id].choose(s,k,q.c);if(r&&r.opts)s.queue.unshift({src:'act',id:q.id,c:r.c||q.c,opts:r.opts})}
  report(s,before);after(s);
}
function ask(s,id,c,opts){s.queue.push({src:'act',id,c,opts})}

/* ---------- a year passes ---------- */
function yearly(s){
  const fam=family(s);
  /* training you get just by living the life you have */
  const tf=s.jail>0?.15:(s.sect&&!s.retired)?1:masterOf(s)?.6:(fam.martial&&s.age<16&&s.age>=5)?.5:.08;
  s.skill+=trainGain(s,tf*.45);s.qi+=qiGain(s,tf*.45);
  /* body */
  if(s.age>45)s.maxHealth=Math.max(25,s.maxHealth-(1.7-s.t.root*.08));
  heal(s,8+s.t.root);
  if(s.ill){const il=ILLS[s.ill];wound(s,il.dmg[0],il.dmg[1],il.cause);happy(s,-4);say(s,il.year.en,il.year.zh,'bad');if(chance(il.pass)){s.ill=null;say(s,'The illness finally leaves you.','病总算好了。','good')}}
  else if(s.age>3&&chance(s.age>55?.12:.035)){s.ill=pick(Object.keys(ILLS).filter(k=>!ILLS[k].old||s.age>50));const il=ILLS[s.ill];say(s,il.get.en,il.get.zh,'bad')}
  if(s.age<16)s.looks=clamp(s.looks+rint(-2,3),0,100);else if(s.age>38)s.looks=clamp(s.looks-rint(0,2),0,100);
  if(s.age>=6&&s.age<=15&&fam.rich>=1)s.smarts=clamp(s.smarts+rint(0,3),0,100);
  /* happiness drifts toward how good your life is */
  const target=45+homeHappy(s)+(spouseOf(s)?(spouseOf(s).bond-50)/4:0)-(s.ill?10:0)-(s.jail>0?25:0)+(s.money>500?5:0)+(s.money<5&&s.age>16?-8:0);
  s.happy=clamp(Math.round(s.happy+(target-s.happy)*.25),0,100);
  /* money */
  if(s.age>=16&&s.age<18&&fam.rich>=2&&!s.flags.allowance){s.flags.allowance=1;const a=[0,10,40,120,400,2000][fam.rich];payT(s,a,'family');say(s,`Your family gives you ${a} taels of pocket money.`,`家里给了你${a}两零花钱。`)}
  if(s.job&&s.jail<=0){const J=JOBS[s.job];const w=J.pay[s.jobLv];payT(s,w,'job');s.jobYears++;s.perf=clamp(s.perf+rint(-8,6),0,100);J.year&&J.year(s);
    if(s.perf>=78&&s.jobLv<2&&s.jobYears>=3&&chance(.6)){s.jobLv++;s.jobYears=0;s.perf=55;say(s,`You are promoted to ${J.n[s.jobLv].en}. Pay: ${J.pay[s.jobLv]} taels a year.`,`你升任${J.n[s.jobLv].zh}，年俸${J.pay[s.jobLv]}两。`,'good')}
    else if(s.perf<12){say(s,`You are dismissed from your post as ${J.n[s.jobLv].en}.`,`你被辞退了，丢了${J.n[s.jobLv].zh}的差事。`,'bad');s.job=null;happy(s,-8)}}
  if(s.sect&&!s.retired&&s.jail<=0)payT(s,2+s.rank*6,'sect');
  owned(s,'house').forEach(h=>payT(s,-h.upkeep,'house'));
  /* each shop is booked on its own, under a numbered name when you own more than one of a kind */
  {const o=LTAG;LTAG='biz';s.items.forEach(it=>{const d=itemDef(it.id);if(!d||d.cat!=='biz')return;const b=Object.assign({},d,it),nm=bizLabel(s,it);LSUB=nm;
    if(b.risk&&chance(b.risk)){const loss=Math.round(b.price*.15);pay(s,-loss);say(s,`Bad year for your ${nm.en}: you lose ${loss} taels.`,`你的${nm.zh}今年亏了${loss}两。`,'bad')}
    else{const g=rint(b.inc[0],b.inc[1]);pay(s,g);if(g>100)say(s,`Your ${nm.en} earns ${g} taels.`,`你的${nm.zh}今年赚了${g}两。`,'good')}});LSUB=null;LTAG=o}
  /* people grow old */
  s.people.forEach(p=>{if(!p.alive)return;p.age++;
    if(['friend','acq','fellow','rival','lover','sworn'].includes(p.rel))p.bond=clamp(p.bond-rint(1,4),0,100);
    if(['child','disciple'].includes(p.rel)&&p.age<30)p.lv+=rint(1,4);
    const dp=p.age<55?.002:Math.pow((p.age-55)/35,2)*.5;
    if(chance(dp)){p.alive=false;p.diedAt=s.age;onDeath(s,p)}});
  /* prison and the law */
  if(s.jail>0){s.jail--;if(s.jail===0){say(s,'Your sentence ends. You walk out of the prison gate into daylight.','刑满释放。你走出牢门，阳光刺眼。','good');s.wanted=0}}
  else if(s.wanted>0){if(chance(s.wanted*.12))runIncident(s,INC_BY.arrest);else if(chance(.25))s.wanted--}
  /* the world */
  s.cal++;s.eraYear++;
  if(s.eraYear>s.eraLen){const e=pick(ERAS.filter(x=>x[0]!==s.era.cn));s.era={cn:e[0],py:e[1]};s.eraYear=1;s.eraLen=rint(15,40);
    s.log[s.log.length-1].era=eraLabel(s);say(s,`The old emperor has died. The new reign is named ${e[1]} (${e[0]}).`,`老皇帝驾崩了。新君即位，改元${e[0]}。`,'muted')}
  if(s.arts.some(a=>a.bad)&&chance(.07)){s.skill=Math.max(0,s.skill-6);const w=wound(s,25,55,T('qi deviation from the Red Blade Classic','《赤刃经》反噬'));say(s,`The Red Blade Classic turns on you. Qi deviation (走火入魔) leaves you with ${w.en}.`,`《赤刃经》反噬，你走火入魔，落下${w.zh}。`,'bad')}
  s.align=clamp(s.align,-100,100);
  const E=energyFor(s);s.apMax=E.n;s.ap=E.n;
  if(s.age>=6&&E.why.length)say(s,`Energy this year: ${E.n} (${E.why.map(w=>w.en).join(', ')}).`,`今年行动力 ${E.n}（${E.why.map(w=>w.zh).join('、')}）。`,'muted');
  rollOpps(s);
  if(!s.stock||s.stock.age!==s.age)rollStock(s);
}
/* energy depends on age, body and mood, plus a little luck */
function energyFor(s){
  if(s.age<6)return{n:0,why:[]};
  if(s.jail>0)return{n:3,why:[T('in prison','身陷囹圄')]};
  let n=s.age<13?3:s.age<16?6:s.age<60?8:s.age<75?7:5;const why=[];
  const hp=s.health/s.maxHealth;
  if(hp<.3){n-=2;why.push(T('badly hurt','伤重'))}else if(hp<.6){n--;why.push(T('not fully healed','伤未痊愈'))}
  if(s.ill){n--;why.push(T('ill','染病'))}
  if(s.happy>=80){n++;why.push(T('in high spirits','意气风发'))}else if(s.happy<25){n--;why.push(T('low in spirits','心情低落'))}
  const r=R();if(r<.18){n++;why.push(T('full of vigour','精力充沛'))}else if(r>.86){n--;why.push(T('a sluggish year','浑身乏力'))}
  return{n:clamp(n,1,11),why};
}
/* what changed: shown after training, sparring, resting and choices */
function snap(s){return{p:power(s),sk:s.skill,qi:s.qi,h:Math.round(s.health),bt:s.bt}}
function report(s,a){
  if(!s.alive||!a)return;const b=snap(s);const en=[],zh=[];
  const dsk=b.sk-a.sk,dqi=b.qi-a.qi,f1=x=>(x>0?'+':'')+(Math.round(x*10)/10);
  if(b.p!==a.p||Math.abs(dsk)>=.05||Math.abs(dqi)>=.05){
    const sub=[[dsk,'technique','外功'],[dqi,'inner energy','内力']].filter(x=>Math.abs(x[0])>=.05);
    en.push(`Martial power ${a.p} → ${b.p}${sub.length?` (${sub.map(x=>x[1]+' '+f1(x[0])).join(', ')})`:''}`);
    zh.push(`功力 ${a.p} → ${b.p}${sub.length?`（${sub.map(x=>x[2]+f1(x[0])).join('，')}）`:''}`)}
  if(b.h!==a.h&&b.bt===a.bt){en.push(`Health ${a.h} → ${b.h}`);zh.push(`气血 ${a.h} → ${b.h}`)}
  if(en.length)say(s,'↳ '+en.join(' · '),'↳ '+zh.join(' · '),'delta');
}
const ILLS={
 cold:{get:T('You catch a bad chill.','你染上了风寒。'),year:T('The chill lingers in your chest.','风寒缠绵不去。'),dmg:[4,12],pass:.6,cause:T('a chill that would not lift','一场久治不愈的风寒')},
 fever:{get:T('A summer fever lays you low.','你得了一场热病。'),year:T('The fever comes and goes.','热病时好时坏。'),dmg:[8,20],pass:.5,cause:T('a fever','热病')},
 lung:{get:T('You start coughing blood. The doctor says consumption.','你开始咳血，大夫说是痨病。'),year:T('Your cough is worse.','咳得更厉害了。'),dmg:[10,22],pass:.15,cause:T('consumption','痨病')},
 inner:{get:T('Old internal injuries flare up.','旧日的内伤发作了。'),year:T('Your meridians ache with the old injury.','内伤隐隐作痛。'),dmg:[6,16],pass:.3,cause:T('an old internal injury','旧日内伤')},
 rheum:{get:T('Your joints swell with rheumatism.','你得了风湿，关节肿痛。'),year:T('Every rainy day is agony.','每逢阴雨天便痛不欲生。'),dmg:[3,9],pass:.1,old:1,cause:T('the ailments of age','年老体衰')},
 heart:{get:T('Your heart begins to flutter and fail.','你的心口时常绞痛。'),year:T('Your heart is weaker this year.','心疾又重了几分。'),dmg:[10,26],pass:.08,old:1,cause:T('a failing heart','心疾')}
};
function onDeath(s,p){
  const r=relLabel(s,p);
  say(s,`Your ${r.en.toLowerCase()} ${p.n.py} has died, aged ${p.age}.`,`你的${r.zh}${p.n.cn}去世了，享年${cnNum(p.age)}岁。`,'bad');
  if(['father','mother','spouse','child','sworn','master'].includes(p.rel)){happy(s,-(10+Math.round(p.bond/5)));
    if(['father','mother'].includes(p.rel)){const fam=family(s);const inh=Math.round([0,15,60,300,900,5000][fam.rich]*(.5+R()));if(inh>0&&s.age>=12){payT(s,inh,'family');say(s,`You inherit ${inh} taels.`,`你继承了${inh}两遗产。`)}}}
  if(p.rel==='enemy')happy(s,4);
}

/* ---------- yearly focus (1in8B-style): where your year's attention goes ---------- */
const FOCUS={
 martial:{n:T('Martial arts','习武'),d:T('Steady training on top of everything else.','在其他事之外，持续练功。'),min:6,f(s){s.skill+=trainGain(s,.35);s.qi+=qiGain(s,.15)}},
 study:{n:T('Study','读书'),d:T('Smarts grow.','学识渐长。'),min:6,f(s){s.smarts=clamp(s.smarts+rint(2,4),0,100)}},
 work:{n:T('Livelihood','营生'),d:T('Work harder, earn more.','勤恳营生，多挣些钱。'),min:13,f(s){if(s.job){s.perf=clamp(s.perf+8,0,100);pay(s,Math.round(JOBS[s.job].pay[s.jobLv]*.15))}else pay(s,rint(2,12))}},
 bonds:{n:T('Family & friends','情义'),d:T('Everyone you care about feels it.','身边的人都感受得到。'),min:6,f(s){living(s).forEach(p=>{if(!['enemy','rival'].includes(p.rel))addBond(p,3)});happy(s,2)}},
 leisure:{n:T('Enjoy life','逍遥'),d:T('Happier and healthier.','心情好，身体也好。'),min:6,f(s){happy(s,6);heal(s,4)}},
 roam:{n:T('Adventure','闯荡'),d:T('More happens to you. Not all of it good.','遇到的事更多，未必都是好事。'),min:13,f(s){s.fame+=.5}},
 spirit:{n:T('Cultivate the heart','修心'),d:T('Inner power, calm, and a kinder hand.','内力渐深，心平气和，出手留情。'),min:10,f(s){s.qi+=qiGain(s,.25);s.align=clamp(s.align+1.5,-100,100);happy(s,2)}}
};
/* share of a cohort still alive at each age: harsh infancy, a dangerous jianghu, then old age */
const SURVIVAL=(()=>{const S=[1];for(let a=0;a<110;a++){const q=a===0?.17:a<5?.025:a<15?.006:a<45?.012:Math.min(1,.012*Math.exp(.078*(a-45)));S.push(S[a]*(1-q))}return S})();
const outlived=age=>Math.round((1-SURVIVAL[Math.min(age,110)])*100);

/* ---------- birth, a year, after effects ---------- */
function ageUp(s){
  if(!s.alive||s.queue.length)return;
  s.age++;s.log.push({age:s.age,era:eraLabel(s),lines:[]});
  if(s.age===0){birth(s);
    rollStock(s);return}
  yearly(s);
  if(s.focus&&FOCUS[s.focus]&&s.age>=FOCUS[s.focus].min&&s.jail<=0)FOCUS[s.focus].f(s);
  /* milestones first, then one or two things happen to you */
  const forced=INC.filter(i=>i.force&&(s.seen[i.id]==null||i.repeat)&&(!i.age||(s.age>=i.age[0]&&s.age<=i.age[1]))&&(!i.when||i.when(s)));
  forced.forEach(i=>runIncident(s,i));
  if(!forced.length||chance(.3)){
    const n=s.age<5?(chance(.8)?1:0):1+(chance(.35)?1:0);
    for(let k=0;k<n&&s.health>0;k++){const inc=pickIncident(s);if(inc)runIncident(s,inc);else if(k===0)quietYear(s)}
  }
  if(s.focus==='roam'&&s.age>=13&&s.jail<=0&&chance(.55)){const i=pickIncident(s,'wander');if(i)runIncident(s,i)}
  const E=s.log[s.log.length-1];if(!E.lines.length&&!s.queue.length)quietYear(s);
  after(s);
}
const QUIET={
 child:[['You chased dragonflies along the river.','你在河边追蜻蜓。'],['You learned to write the characters for heaven and earth.','你学会了写"天"和"地"两个字。'],['You climbed the tallest tree in the village and could not get down.','你爬上村里最高的树，却下不来了。'],
  ['You spent the summer barefoot.','你光着脚丫过了一个夏天。'],['You learned to count to a hundred, then a thousand.','你学会了数到一百，又数到一千。'],['You made a whistle from a willow branch.','你用柳枝做了一只哨子。'],['You followed the ducks around the pond all spring.','你一整个春天都跟在鸭子后面转。'],
  ['You had a cough all winter and drank a great deal of ginger soup.','你咳了一冬，喝了好多姜汤。'],['You watched the grown-ups play chess and thought you understood it.','你看大人下棋，自以为看懂了。'],['You caught a fish with your hands.','你徒手抓到了一条鱼。']],
 adult:[['The year passed without anything worth telling.','这一年平平淡淡，没什么可说的。'],['You worked, ate, slept, and grew a little older.','做活、吃饭、睡觉，你又老了一岁。'],['Rain came on time this year. Everyone was in a good mood.','今年风调雨顺，人人心情都好。'],
  ['You repaired the roof and it held all through the rainy season.','你修好了屋顶，整个雨季都没漏。'],['You found a quiet place by the river and went there often.','你在河边找到一个清静处，常去坐坐。'],['A long, cold winter. You read by the stove.','漫长寒冷的冬天，你在炉边读书。'],
  ['You planted a peach tree. It will fruit in three years.','你种了一棵桃树，三年后就能结果。'],['You took up the bamboo flute, badly.','你学起了吹笛子，吹得很难听。'],['You spent a season helping a neighbour rebuild their house.','你花了一季帮邻居重盖房子。'],
  ['Nothing happened, and you were grateful.','什么事也没发生，你心存感激。'],['You walked the hills every morning.','你每天早上都去山里走走。'],['You learned to cook one dish very well.','你把一道菜做到了拿手。']]
};
function quietYear(s){const q=pick(s.age<10?QUIET.child:QUIET.adult);say(s,q[0],q[1],'muted')}
function after(s){
  const r=realmOf(s);if(r>s.realm){s.realm=r;say(s,`You break through to a new realm: ${REALMS[r][2]} (${REALMS[r][1]}).`,`你突破了境界，臻至「${REALMS[r][1]}」。`,'gold');if(r>=4)deed(s,`Reached the realm of ${REALMS[r][2]} (${REALMS[r][1]})`,`臻至${REALMS[r][1]}之境`)}
  record(s);
  if(s.health<=0&&s.alive){die(s,s.cause&&s.cause.en?s.cause:T('wounds','死于伤重'));return}
  if(s.alive&&!s.queue.length&&s.age>s.lifespan&&chance(.15+(s.age-s.lifespan)*.06))die(s,T('old age, peacefully, in your sleep','寿终正寝'));
}
function record(s){if(s.age<0)return;s.hist=s.hist||[];const h={a:s.age,h:Math.max(0,Math.round(s.health/s.maxHealth*100)),j:Math.round(s.happy),p:power(s),m:Math.round(s.money)};const L=s.hist[s.hist.length-1];if(L&&L.a===s.age)s.hist[s.hist.length-1]=h;else s.hist.push(h)}
function die(s,cause){s.alive=false;s.queue=[];s.health=0;s.cause=cause;s.nick=nickname(s);
  say(s,`You died at ${s.age}, of ${cause.en}.`,`你享年${cnNum(s.age)}岁，${cause.zh}。`,'bad')}

/* ---------- how a life is remembered ---------- */
function titleOf(s){
  const reg=region(s),S=s.sect&&SECTS[s.sect];
  if(s.flags.alliance)return[T('武林盟主','武林盟主'),T('Leader of the Martial Alliance','号令天下群雄')];
  if(s.realm>=6)return[T('天下第一','天下第一'),T('First under heaven','举世无敌')];
  if(s.rank===4&&S)return[T(S.cn+'掌门',S.cn+'掌门'),T('Master of '+S.en,'一派宗主')];
  if(s.align<=-50&&s.fame>=45)return[T('魔头','魔头'),T('The demon of '+reg.en,reg.cn+'人人闻之色变')];
  if(s.align>=45&&s.fame>=45)return[T('大侠','大侠'),T('Great hero of '+reg.en,reg.cn+'人人传颂')];
  if(s.money>=20000)return[T('富甲一方','富甲一方'),T('The richest person in '+reg.en,reg.cn+'首富')];
  if(s.fame>=75)return[T('名震江湖','名震江湖'),T('A name that shook the jianghu','江湖上无人不知')];
  if(s.job==='official'||s.flags.exam)return[T('官','朝廷命官'),T('An official of the court','一身官服')];
  if(s.job==='assassin')return[T('杀手','杀手'),T('A killer for hire','拿钱买命的人')];
  if(power(s)>=40)return s.gender==='f'?[T('女侠','女侠'),T('A wandering swordswoman','仗剑天涯')]:[T('游侠','游侠'),T('A wandering swordsman','仗剑天涯')];
  if(s.age<16)return[T('夭','早夭'),T('Gone too young','来不及长大')];
  return[T('布衣','布衣'),T('An ordinary person of '+reg.en,reg.cn+'的一个寻常人')];
}
function nickname(s){if(s.fame<20)return null;
  const adj=pick(s.align>=25?[['Jade','玉'],['Pure Wind','清风'],['Cloud','白云'],['Thousand-Mile','千里'],['Righteous','正气']]:s.align<=-25?[['Bloody','血'],['Black','黑'],['Ghost','鬼'],['Venom','毒'],['Nine-Hells','九幽']]:[['Wandering','浪子'],['Drunken','醉'],['Lone','孤'],['Laughing','笑'],['Grey','灰衣']]);
  const w=s.sect?SECTS[s.sect].wpn:P(pick([['Blade','刀'],['Sword','剑'],['Fist','拳']]));
  return T(adj[0]+' '+w.en,adj[1]+w.zh)}
function alignLabel(a){return a<=-60?T('Demonic','魔道'):a<=-20?T('Unorthodox','邪派'):a<20?T('Neither','亦正亦邪'):a<60?T('Righteous','正道'):T('Heroic','侠义')}
function fameLabel(f){return f<10?T('Unknown','籍籍无名'):f<30?T('Known locally','小有名气'):f<80?T('Known in the jianghu','闻名江湖'):f<150?T('Famous','声名远播'):T('Legendary','名垂千古')}
function joinSect(s,id){const S=SECTS[id];s.sect=id;s.rank=0;learn(s,sectArt(id,0));s.align=clamp(s.align+S.align*5,-100,100);s.joinedAt=s.age;
  s.people.filter(p=>p.alive&&(p.rel==='master'||p.rel==='fellow')).forEach(p=>p.rel='acq');
  const m=mkPerson(s,{rel:'master',age:rint(45,75),bond:rint(50,70),lv:rint(90,170),extra:{sect:id}});s.people.push(m);
  for(let i=0;i<rint(1,2);i++)s.people.push(mkPerson(s,{rel:'fellow',age:s.age+rint(-2,5),bond:rint(40,65),lv:Math.max(3,power(s)+rint(-5,15)),extra:{sect:id}}));
}
function leaveSect(s){s.people.filter(p=>p.alive&&(p.rel==='master'||p.rel==='fellow')&&p.sect===s.sect).forEach(p=>{p.rel=p.rel==='master'?'acq':'acq'});s.flags.formerSect=s.sect;s.sect=null;s.rank=0}
