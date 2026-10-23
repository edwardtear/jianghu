/* 江湖一生 · people as people: what you can do depends on how things stand between you; how the dead died;
   news of the jianghu, your sect and the people you know each year; a jianghu where most people are weaker than a master;
   and the ledger that books every coin */
'use strict';

/* ---------- relationship groups ---------- */
const REL_GROUPS=[
 ['family',T('Family','家人'),['father','mother','sibling','spouse','child']],
 ['school',T('Master & disciples','师门'),['master','fellow','disciple']],
 ['love',T('Love','情缘'),['lover','ex']],
 ['friends',T('Friends','朋友'),['sworn','friend']],
 ['acq',T('Acquaintances','相识'),['acq']],
 ['foes',T('Rivals & enemies','对头'),['rival','enemy']]];
const hostile=p=>p.rel==='enemy';
const cold=p=>p.bond<25;
const family_=p=>['father','mother','sibling','spouse','child'].includes(p.rel);

/* what you can do with someone depends on where you stand with them */
(()=>{const G=(id,f)=>{const a=PACT_BY[id];if(!a)return;const if0=a.if;a.if=(s,p)=>(!if0||if0(s,p))&&f(s,p)};
 const O=(id,f)=>{const a=PACT_BY[id];if(!a)return;const ok0=a.ok;a.ok=(s,p)=>{const r=f(s,p);if(r!==true)return r;return ok0?ok0(s,p):true}};
 G('chat',(s,p)=>!hostile(p));
 O('chat',(s,p)=>cold(p)&&!family_(p)?T('They want nothing to do with you','对方不想理你'):true);
 G('gift',(s,p)=>!hostile(p));
 G('date',(s,p)=>true);O('date',(s,p)=>p.bond<35?T('Things are too cold between you','你们之间太冷淡了'):true);
 G('spar',(s,p)=>!hostile(p));O('spar',(s,p)=>p.bond<20?T('They refuse to cross hands with you','对方不肯跟你过招'):true);
 O('teach',(s,p)=>p.bond<45?T('They are in no mood to teach you','对方没心情教你'):true);
 O('money',(s,p)=>p.bond<30?T('Not after how things have gone','都闹成这样了，免谈'):true);
 G('confess',(s,p)=>p.rel!=='rival'||p.bond>=60);
 G('disciple',(s,p)=>p.bond>=40);
 G('argue',(s,p)=>!hostile(p));
 G('kill',(s,p)=>p.rel!=='acq'||p.bond<20);
})();
/* enemies and estranged people get their own options */
PACTS.push(
 {id:'reconcile',n:T('Try to make peace','设法和解'),if:(s,p)=>s.age>=8&&(hostile(p)||(p.bond<25&&p.rel!=='acq')),ok:s=>s.money<30?T('Needs 30 taels for a peace offering','需三十两备礼赔罪'):true,run(s,p){
   pay(s,-30);const t=TRAITS[p.trait][0];const ch=.18+p.bond/150+(t==='gentle'||t==='cheerful'?.15:0)-(t==='cold'||t==='arrogant'||t==='scheming'?.1:0)+(s.fame>40?.08:0);
   if(chance(ch)){addBond(p,rint(15,25));if(p.rel==='enemy')p.rel='acq';say(s,`You bring wine and an apology. After a long silence, ${p.n.py} pours two cups.`,`你提着酒登门赔罪。沉默良久，${p.n.cn}斟了两杯。`,'good')}
   else{addBond(p,-3);say(s,`${p.n.py} keeps the door shut. Your gift is left in the street.`,`${p.n.cn}闭门不见。你的礼被扔在了街上。`,'bad')}}},
 {id:'avoid',n:T('Keep out of their way','避而远之'),ap:0,if:(s,p)=>hostile(p),run(s,p){p.avoid=s.age;say(s,`You take the long way round wherever ${p.n.py} might be.`,`凡是${p.n.cn}可能出现的地方，你都绕道走。`,'muted')}},
 {id:'spy',n:T('Have them watched (20 taels)','派人打探（二十两）'),if:(s,p)=>hostile(p)&&s.age>=16,ok:s=>s.money<20?T('Needs 20 taels','需二十两'):true,run(s,p){
   pay(s,-20);p.known=1;say(s,`Your informant reports: ${p.n.py} is ${p.age} years old, at about power ${p.lv}, and ${p.lv>power(s)?'stronger than you':'not as strong as you'}.`,`探子回报：${p.n.cn}今年${cnNum(p.age)}岁，功力约${p.lv}，${p.lv>power(s)?'比你强':'不如你'}。`,'muted')}});
PACT_BY.reconcile=PACTS[PACTS.length-3];PACT_BY.avoid=PACTS[PACTS.length-2];PACT_BY.spy=PACTS[PACTS.length-1];
/* an estranged spouse or parent does not chat like a happy one */
(()=>{const C=PACT_BY.chat;const run0=C.run;C.run=(s,p)=>{if(cold(p)&&family_(p)){p.talked=s.age;
   if(chance(.3+p.bond/100)){addBond(p,rint(4,8));say(s,`It is awkward, and it is a start. ${p.n.py} almost smiles before you leave.`,`气氛很僵，但总算开了个头。你走的时候，${p.n.cn}差点笑了。`,'muted')}
   else{addBond(p,-2);say(s,`You try to talk. ${p.n.py} answers in single words and finds a reason to leave.`,`你想说说话，${p.n.cn}只是嗯啊几声，找个借口走开了。`,'muted')}return}
  run0(s,p)}})();

/* ---------- how people die ---------- */
const NPC_DEATH={
 old:[T('old age, in their sleep','寿终正寝'),T('a stroke','中风'),T('a long winter cough','一场久咳不愈的冬咳'),T('a failing heart','心疾'),T('a fall in the courtyard','在院中跌了一跤')],
 mid:[T('consumption','痨病'),T('a fever','热病'),T('an accident on the river','江上的意外'),T('a fall from a horse','坠马'),T('an infected wound','伤口溃烂'),T('the plague','瘟疫')],
 jh:[T('a duel','一场比武'),T('an ambush on the road','路上遭了埋伏'),T('poison','中毒'),T('an old enemy’s blade','仇家的刀')],
 young:[T('a childhood fever','幼时的高烧'),T('drowning','溺水'),T('smallpox','天花')]
};
function npcCause(s,p){
  if(p.age<12)return pick(NPC_DEATH.young);
  if(p.age>=65)return pick(NPC_DEATH.old);
  if(p.lv>=60&&chance(.45))return pick(NPC_DEATH.jh);
  if(s.world&&s.world.h<=-2&&chance(.4))return T('famine','饥荒');
  return pick(NPC_DEATH.mid)}
(()=>{const od=onDeath;onDeath=function(s,p){if(!p.cause)p.cause=npcCause(s,p);const r=relLabel(s,p);
  say(s,`Your ${r.en.toLowerCase()} ${p.n.py} has died, aged ${p.age}: ${p.cause.en}.`,`你的${r.zh}${p.n.cn}去世了，享年${cnNum(p.age)}岁，死于${p.cause.zh}。`,'bad');
  /* the original also announces the death; keep its other effects but not a second announcement */
  const L=s.log[s.log.length-1],n=L?L.lines.length:0;od(s,p);if(L&&L.lines.length>n)L.lines.splice(n,1)}})();

/* ---------- the year’s news: the jianghu, your sect, the people you know ---------- */
const NEWS_JH=[
 c=>T(`${c.a.en} defeats seven challengers in a row at Luoyang and is now called "${c.e.en}".`,`${c.a.zh}在洛阳连败七名高手，人称"${c.e.zh}"。`),
 c=>T(`${c.s1.en} and ${c.s2.en} quarrel over a disputed manual; three disciples die before the elders intervene.`,`${c.s1.zh}与${c.s2.zh}为一本秘籍起了争执，死了三名弟子，长老们才出面调停。`),
 c=>T(`The head of ${c.s1.en} goes into closed-door cultivation. Rumour says the sect is leaderless.`,`${c.s1.zh}掌门闭关，江湖传言该派群龙无首。`),
 c=>T(`${c.a.en} washes their hands in a golden basin and retires from the jianghu. Half the martial world attends.`,`${c.a.zh}金盆洗手，退出江湖，半个武林都去观礼。`),
 c=>T(`A flower thief terrorises ${c.r.en}. The constables offer a thousand taels for his head.`,`${c.r.zh}出了个采花大盗，官府悬赏千两要他的人头。`),
 c=>T(`Word spreads that a lost manual has surfaced in ${c.r.en}. Every inn is suddenly full of swordsmen.`,`传说${c.r.zh}有失传秘籍现世，各家客栈一夜之间住满了带剑的人。`),
 c=>T(`The salt gangs and the Grand Canal boatmen fight a pitched battle at a ferry. The river runs red.`,`盐帮与漕帮在渡口火并，河水都染红了。`),
 c=>T(`${c.a.en}, once a famous hero, is found dead in a ditch. Nobody claims the killing.`,`昔日名侠${c.a.zh}被人发现死在路边沟里，没人认这桩血案。`),
 c=>T(`The court bans martial gatherings in ${c.r.en} after a riot. The sects ignore it.`,`${c.r.zh}出了一场骚乱，朝廷下令禁止武林聚会。各派都当耳边风。`),
 c=>T(`A young swordsman named ${c.a.en} challenges the master of ${c.s1.en} and loses in three moves, then is taken in as a disciple.`,`一个叫${c.a.zh}的少年剑客挑战${c.s1.zh}掌门，三招落败，反被收为弟子。`),
 c=>T(`${c.s1.en} holds its great assembly. The new head is said to be ruthless.`,`${c.s1.zh}召开大会，新掌门据说手段狠辣。`),
 c=>T(`A storyteller in the capital is arrested for a tale that mocked the Embroidered Guard.`,`京城一个说书人编排锦衣卫，被抓了起来。`),
 c=>T(`Japanese pirates raid the coast again. ${c.a.en} leads villagers to drive them back.`,`倭寇又来犯边，${c.a.zh}率乡勇把他们打了回去。`),
 c=>T(`The Crimson Sky Cult raids a righteous sect’s hall in the night. The righteous sects swear revenge.`,`赤霄教夜袭一处正派分舵，各大门派誓言报复。`)
];
const NEWS_SECT_GOOD=[
 c=>T(`${c.f.en} is promoted. The whole sect drinks to it.`,`${c.f.zh}升了职，全派上下为之举杯。`),
 c=>T('Twelve new outer disciples arrive, terrified and homesick.','新来了十二名外门弟子，个个又怕又想家。'),
 c=>T('Your master’s old injury flares up; the elders take over the lessons for a season.','师父旧伤复发，这一季由长老们代为授课。'),
 c=>T(`${c.f.en} goes down the mountain to train in the world and does not write.`,`${c.f.zh}下山历练，一封信也没寄回来。`),
 c=>T('A visiting master from another sect stays a month. The juniors follow him everywhere.','别派一位高人来访，住了一个月，小弟子们整天跟在他后面。'),
 c=>T('The sect’s finances are tight; the rice in the dining hall gets thinner.','门派银钱吃紧，饭堂的粥越来越稀。'),
 c=>T(`${c.f.en} and a disciple of a rival sect are caught meeting in secret. There is a great scandal.`,`${c.f.zh}被人撞见与别派弟子私会，闹得满门风雨。`)
];
const NEWS_SECT_EVIL=[
 c=>T(`A hall master is executed for disloyalty. Everyone smiles a little wider at the next assembly.`,`一位堂主以不忠之罪被处死。下一次集会，人人笑得更用力了。`),
 c=>T(`${c.f.en} vanishes after a failed mission. Nobody asks where.`,`${c.f.zh}任务失手后失踪了，没人敢问去了哪里。`),
 c=>T('The lord demands double tribute this year. The followers squeeze the towns harder.','教主今年要双倍贡奉，教众们对各镇压榨得更狠了。'),
 c=>T('Righteous sects ambush a supply caravan. The lord is furious.','正派截了一支补给车队，教主大怒。')
];
function newsCtx(s){const ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden);const s1=pick(ks);let s2=pick(ks);if(s2===s1)s2=pick(ks);const e=pick(EPI);const a=genName(chance(.5)?'m':'f');
  const rg=pick(REGIONS);return{a:T(a.py,a.cn),e:T(e[0],e[1]),s1:T(SECTS[s1].en,SECTS[s1].cn),s2:T(SECTS[s2].en,SECTS[s2].cn),r:T(rg.en,rg.cn)}}
/* the people you know get on with their lives too */
function peopleNews(s){
  const al=s.people.filter(p=>p.alive&&!p.gone&&p.age>=6);if(!al.length)return;
  const p=pick(al),nm=T(p.n.py,p.n.cn),r=relLabel(s,p);const pre=T(`${r.en} ${p.n.py}`,`${r.zh}${p.n.cn}`);
  const opts=[];
  if(p.age>=18&&p.age<=40&&!['spouse','child','father','mother'].includes(p.rel)&&!p.married)opts.push(()=>{p.married=s.age;say(s,`${pre.en} gets married. You ${p.bond>=50?'are invited to the wedding':'hear about it later'}.`,`${pre.zh}成亲了。${p.bond>=50?'请你去喝了喜酒':'你是后来才听说的'}。`,'news');if(p.rel==='lover'){p.rel='ex';happy(s,-12)}});
  if(p.age>=20&&p.age<=45&&p.married&&!['father','mother'].includes(p.rel))opts.push(()=>say(s,`${pre.en} has a new baby and looks exhausted and proud.`,`${pre.zh}添了个孩子，累得不行，又得意得不行。`,'news'));
  if(p.lv>=20&&p.age<70)opts.push(()=>{const g=rint(3,12);p.lv+=g;say(s,`${pre.en} has been training hard. People say ${p.sex==='f'?'she':'he'} is much stronger now.`,`听说${pre.zh}这一年苦练不辍，功夫大有长进。`,'news')});
  if(p.age>=50)opts.push(()=>say(s,`${pre.en} is ailing this year and walks with a stick.`,`${pre.zh}今年身体不大好，出门拄上了拐杖。`,'news'));
  if(['friend','acq','fellow','sworn'].includes(p.rel))opts.push(()=>{addBond(p,-5);say(s,`${pre.en} moves to another town. You promise to write.`,`${pre.zh}搬去了别的地方。你们约好要写信。`,'news')});
  if(p.rel==='enemy')opts.push(()=>{p.lv+=rint(5,15);say(s,`You hear ${p.n.py} has been asking where you live.`,`你听说${p.n.cn}一直在打听你的住处。`,'news')});
  if(p.rel==='rival')opts.push(()=>say(s,`${p.n.py} wins a tournament and makes sure you hear about it.`,`${p.n.cn}赢了一场比武，还特意让人传到你耳朵里。`,'news'));
  if(p.rel==='child'&&p.age===15)opts.push(()=>say(s,`${pre.en} comes of age. You see your own face at fifteen.`,`${pre.zh}成年了。你在那张脸上看见了十五岁的自己。`,'news'));
  if(p.rel==='child'&&p.age>=8&&p.age<=14)opts.push(()=>{p.lv+=rint(1,4);say(s,`${pre.en} gets into a fight at school and wins. You pretend to be angry.`,`${pre.zh}在学堂跟人打架打赢了。你装作生气。`,'news')});
  if(['father','mother'].includes(p.rel)&&p.age>=55)opts.push(()=>say(s,`${pre.en} keeps asking when you will visit.`,`${pre.zh}总念叨你什么时候回家看看。`,'news'));
  if(opts.length)pick(opts)()}
function yearNews(s){
  if(s.age<10||!s.alive)return;
  if(chance(.6)){const c=newsCtx(s);s.newsSeen=s.newsSeen||[];const ix=NEWS_JH.map((_,i)=>i).filter(i=>!s.newsSeen.includes(i));const i=pick(ix.length?ix:NEWS_JH.map((_,i)=>i));s.newsSeen.push(i);if(s.newsSeen.length>9)s.newsSeen.shift();const t=NEWS_JH[i](c);say(s,'【Jianghu】'+t.en,'【江湖】'+t.zh,'news')}
  if(s.sect&&!s.retired&&chance(.55)){const f=pick(living(s,'fellow'))||{n:genName(chance(.5)?'m':'f')};const nm=f.n.py?T(f.n.py,f.n.cn):T(f.n.py,f.n.cn);
    const t=pick(isEvil(s.sect)?NEWS_SECT_EVIL:NEWS_SECT_GOOD)({f:nm});say(s,'【Sect】'+t.en,'【门派】'+t.zh,'news')}
  if(chance(.7)){const L=s.log[s.log.length-1],n=L.lines.length;peopleNews(s);if(L.lines.length>n){const l=L.lines[n];l.t=T('【People】'+l.t.en,'【人情】'+l.t.zh)}}
}

/* ---------- a realistic jianghu: once you are strong, most people you meet are weaker than you ---------- */
var FIXED_FIGHT=false;
const _fightLife2=fightLife;
fightLife=function(s,foe,o){
  const p=power(s),stakes=(o&&o.stakes)||'injury';
  if(!FIXED_FIGHT&&!(o&&o.fixed)&&!foe.fixed&&stakes!=='spar'&&p>=25&&foe.lv){
    const r=foe.lv/p,f=clamp(40/p+(r-1)*2.5,.2,1);
    if(f<1){const w=worldLv();foe=Object.assign({},foe,{lv:Math.max(3,Math.min(foe.lv,Math.round(foe.lv*f+w*(1-f))))})}}
  return _fightLife2(s,foe,o)};
['spar','duel','kill'].forEach(id=>{const a=PACT_BY[id];if(!a)return;const r0=a.run;a.run=(s,p)=>{FIXED_FIGHT=true;try{r0(s,p)}finally{FIXED_FIGHT=false}}});
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){const fixed=['wulin','b_revenge2','oldduelinvite','deserter_hunt'].includes(q.id);if(fixed)FIXED_FIGHT=true;try{return ci(s,q,k)}finally{if(fixed)FIXED_FIGHT=false}}})();
/* the martial hall and the arena have a ceiling: nobody there can match a true master */
(()=>{const A=ACT_BY.sparring;const r0=A.run;A.run=s=>{r0(s);const q=s.queue[s.queue.length-1];if(!q||q.id!=='sparring')return;const caps=[40,75,120];
   q.c.opts.forEach((o,i)=>{if(i<3&&!o.pid&&o.lv>caps[i])o.lv=caps[i]-rint(0,8)});q.opts.forEach((o,i)=>{if(i<3&&o.fight)o.fight.foe=q.c.opts[i].lv});
   if(power(s)>140)say(s,'Nobody at the martial hall can give you a real fight any more. You will have to seek out masters.','武馆里已经没人能跟你过上几招了。要切磋，只能去寻访高人。','muted')}})();
(()=>{const A=ACT_BY.arena;const r0=A.run;A.run=s=>{r0(s);const q=s.queue[s.queue.length-1];if(!q||q.id!=='arena')return;const caps=[60,110,170];
   q.c.foes.forEach((f,i)=>{if(f.lv>caps[i])f.lv=caps[i]-rint(0,10);f.fixed=1});q.opts.forEach((o,i)=>{if(q.c.foes[i])o.l=T(`${q.c.foes[i].name.en} (power ${q.c.foes[i].lv})`,`${q.c.foes[i].name.zh}（功力${q.c.foes[i].lv}）`)});
   if(power(s)>230){s.queue.pop();s.fame+=2;pay(s,30);say(s,'When you step up to the stage, the challengers quietly melt away. The organisers pay you 30 taels just to sit as judge.','你一上擂台，挑战者们便悄悄散了。主办的人付你三十两，请你坐下当评判。','good')}}})();
/* seeking out a true master to test yourself, once you have outgrown everyone nearby */
addAct({id:'seekmaster',ap:2,cat:'train',n:T('Seek out a famous master to cross hands','寻访名家切磋'),d:T('For the truly strong. A real test, and real lessons.','高手专属。真正的考验，真正的长进。'),if:s=>power(s)>=120,ok:s=>s.jail>0?notJail(s):true,run(s){
  const p=power(s);const lv=Math.round(p*(.95+R()*.25));const nm=foeName();
  const r=fightLife(s,{name:nm,lv,fixed:1},{stakes:'spar',title:T('Crossing hands with a master','名家切磋')});
  const g=(trainGain(s,.9)+1)*fatigue(s,'train');s.skill+=g*(r.win?1:1.4);s.fame+=r.win?3:1;
  say(s,r.win?`You win by a hair. ${nm.en} laughs and shares a jar of wine and three secrets of the trade.`:`${nm.en} beats you cleanly and shows you exactly how.`,r.win?`你险胜一招。${nm.zh}大笑，和你分了一坛酒，还说了三句压箱底的心得。`:`${nm.zh}干净利落地赢了你，又把破绽一处处指给你看。`,'good')}});

/* ---------- the ledger: a year of money, booked by what you were doing ---------- */
const LCAT={job:T('Wages','工钱'),sect:T('Sect stipend','门派月例'),biz:T('Businesses','产业'),org:T('Your own house','自家门户'),family:T('Family & inheritance','家人与遗产'),
 living:T('Food and lodging','衣食住行'),house:T('Property upkeep','房产开销'),mount:T('Mount feed','坐骑草料'),shop:T('Purchases','买东西'),sell:T('Sales','变卖'),
 health:T('Doctors & medicine','看病吃药'),fun:T('Leisure','消遣'),gamble:T('Gambling','赌博'),crime:T('Crime','黑道'),jh:T('The jianghu','江湖营生'),train:T('Training','修炼'),
 work:T('Work','营生'),life:T('Life','人生'),jail:T('Prison','牢狱'),opp:T('Opportunities','机缘'),events:T('Life events','人生际遇'),other:T('Other','其他'),people:T('People','人情往来')};
/* the first line of each year: what came in and went out last year, and the biggest of each */
function yearMoney(s,lg){if(!s.alive||s.age<8)return;const it=Object.entries(lg.items).filter(([k,v])=>v);
  const inc=it.filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]),exp=it.filter(x=>x[1]<0).sort((a,b)=>a[1]-b[1]);if(!inc.length&&!exp.length)return;
  const ti=inc.reduce((t,x)=>t+x[1],0),te=Math.abs(exp.reduce((t,x)=>t+x[1],0)),net=ti-te,nm=k=>LCAT[k]||LCAT.other,m=fmtMoney,sg=v=>(v>0?'+':'−')+m(Math.abs(v));
  const top=(a,en,zh)=>a.length>1?[` (${en} ${nm(a[0][0]).en.toLowerCase()})`,`（${zh}${nm(a[0][0]).zh}）`]:['',''];const ti1=top(inc,'mostly','主要是'),te1=top(exp,'mostly','大头是');
  /* each shop on its own, so you can see which one carries you and which one bleeds */
  /* shops: just the total here; the 收支 tab has each one */
  const bz=lg.items.biz||0;
  const en=`Last year's money: ${m(ti)} tael${ti===1?'':'s'} in${ti1[0]}, ${m(te)} out${te1[0]}. ${net?(net>0?'Up ':'Down ')+m(Math.abs(net)):'Even'}.${bz?` Shops: ${sg(bz)} in all.`:''} You ended the year with ${m(s.money)}.`;
  const zh=`去年进账${m(ti)}两${ti1[1]}，花销${m(te)}两${te1[1]}，${net?(net>0?'结余':'亏空')+m(Math.abs(net))+'两':'收支相抵'}。${bz?`产业合计${sg(bz)}两。`:''}年底手头剩${m(s.money)}两。`;
  say(s,en,zh,net>=0?'money':'money neg')}
const _yearly3=yearly;
yearly=function(s){
  if(s.ledger){s.ledgerLast=s.ledger;yearMoney(s,s.ledger)}s.ledger={age:s.age,items:{}};
  _yearly3(s);
  yearNews(s);
};
(()=>{const da=doAct;doAct=function(s,id){const a=ACT_BY[id];const o=LTAG;LTAG=a?(a.cat==='casino'?'gamble':a.cat):'other';try{return da(s,id)}finally{LTAG=o}};
 const dp=doPact;doPact=function(s,pid,id){const o=LTAG;LTAG='people';try{return dp(s,pid,id)}finally{LTAG=o}};
 const ch=choose;choose=function(s,k){const q=s.queue[0];const o=LTAG;LTAG=q&&q.src==='act'&&ACT_BY[q.id]?(ACT_BY[q.id].cat==='casino'?'gamble':ACT_BY[q.id].cat):'events';try{return ch(s,k)}finally{LTAG=o}};
 const b0=buy;buy=function(s,id){const o=LTAG;LTAG='shop';try{return b0(s,id)}finally{LTAG=o}};
 const s0=sell;sell=function(s,i){const o=LTAG;LTAG='sell';try{return s0(s,i)}finally{LTAG=o}};
 const u0=useItem;useItem=function(s,i){const o=LTAG;LTAG='health';try{return u0(s,i)}finally{LTAG=o}};
})();
