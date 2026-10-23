/* 江湖一生 · nothing is certain: outcomes bend with luck and ability, a manual is not an art until you have mastered it,
   fights leave something to settle afterwards, and the teahouse is a place where you see who is there before you decide */
'use strict';

/* ---------- 1. fortune turns: even a single written outcome can go better or worse than it looks ---------- */
const TWIST={
 better:{money:['Counting it later, there is more than you thought.','事后清点，比你以为的还多。'],moneyLoss:['In the end it costs less than you feared.','最后花得比你担心的少。'],
  hurt:['The wound looks worse than it is, and heals clean.','伤口看着吓人，其实没伤筋动骨，好得也快。'],meet:['You get on better than either of you expected.','你们比预想的还投缘。'],
  skill:['It stays with you, and teaches you more than you expected.','这事让你领悟的比预想的还多。'],fame:['The story spreads, and grows in the telling.','这事越传越神。'],
  happy:['For days afterwards you find yourself smiling about it.','此后好几天，你想起这事就想笑。'],any:['Luck is on your side this time.','这一回，运气站在你这边。']},
 worse:{money:['Later you find some of the silver is clipped, or lead inside.','事后才发现，有几锭银子是灌了铅的。'],moneyLoss:['It ends up costing more than you expected.','结果花得比预想的多。'],
  hurt:['The wound festers. It takes a long time to heal.','伤口化了脓，好得很慢。'],meet:['Something about them does not sit right with you.','此人总有什么地方让你放心不下。'],
  skill:['What felt like a great lesson turns out to be a small one.','当时觉得大有收获，事后才发现没多少。'],fame:['Nobody much hears about it.','这事没怎么传开。'],
  happy:['It leaves a sourer taste than you expected.','事后回想，心里有点不是滋味。'],any:['It does not go quite as well as it first seems.','事情并不像一开始看着那么顺。']}};
const NUMK=['money','fame','skill','qi','happy','smarts','heal'];
const TWIST_NEG={better:{moneyLoss:TWIST.better.moneyLoss,happy:['It stings less than you expected.','心里没想象中那么难受。'],fame:['Fewer people hear about it than you feared.','知道这事的人，比你担心的少。'],skill:['You lose less ground than you feared.','退步得没你担心的那么多。'],hurt:TWIST.better.hurt,any:['It could have been worse.','本来可能更糟。']},
 worse:{moneyLoss:TWIST.worse.moneyLoss,happy:['It stays with you longer than it should.','这事在你心里压了很久。'],fame:['Everyone seems to hear about it.','好像人人都听说了。'],skill:['You lose more ground than you thought.','退步得比你以为的还多。'],hurt:TWIST.worse.hurt,any:['It is worse than it first looks.','事情比乍看之下更糟。']}};
function twistFx(s,fx,dir){const e=Object.assign({},fx);let key=null,neg=false;const up=dir==='better';
  const sc=(v,pos)=>{const m=pos?(up?1.5:.4):(up?.5:1.5);return Array.isArray(v)?v.map(x=>Math.round(x*m)):Math.round(v*m)};
  for(const k of NUMK){if(e[k]==null)continue;const v=Array.isArray(e[k])?e[k][1]:e[k];if(!v)continue;e[k]=sc(e[k],v>0);
    if(!key){key=k==='money'?(v>0?'money':'moneyLoss'):k==='qi'||k==='smarts'?'skill':k==='heal'?'any':k;neg=v<0}}
  if(e.hurt){e.hurt=e.hurt.map(x=>Math.max(1,Math.round(x*(up?.5:1.4))));key=key||'hurt';if(!up&&chance(.3))key='hurt'}
  if(e.meet){e.bond=clamp((e.bond??65)+(up?12:-18),5,95);key=key||'meet'}
  return{e,key:key||'any',neg}}
const twistChance=(s,n)=>{const L=s.t?s.t.luck:5;const base=n===1?.3:.1;return{better:base*(.4+L*.08),worse:base*(1.3-L*.07)}};
resolve=function(s,outs,c){
  if(!outs||!outs.length)return;
  const ok=outs.filter(o=>!o.if||o.if(s,c));
  const o=wpick(ok,o=>typeof o.w==='function'?o.w(s,c):(o.w??1))||ok[0];
  if(!o)return;
  sayT(s,lab(o.t,c,s),o.c);
  let fx=typeof o.fx==='function'?o.fx(s,c):o.fx;
  /* a twist needs something to twist: outcomes that only run story logic are left alone */
  if(fx&&typeof fx==='object'&&!o.sure&&Object.keys(fx).some(k=>!['f','flag','unflag','deed','meet','item','art','cure','ill','die','jail','enemy'].includes(k))){const p=twistChance(s,ok.length),r=R();const dir=r<p.better?'better':r<p.better+p.worse?'worse':null;
    if(dir){const tw=twistFx(s,fx,dir);fx=tw.e;const l=tw.neg?(TWIST_NEG[dir][tw.key]||TWIST_NEG[dir].any):(TWIST[dir][tw.key]||TWIST[dir].any);applyFx(s,fx,c);say(s,l[0],l[1],dir==='better'?'good':'muted');if(o.next){const n=INC_BY[o.next];if(n)runIncident(s,n,o.keep?c:null)}return}}
  applyFx(s,fx,c);
  if(o.next){const n=INC_BY[o.next];if(n)runIncident(s,n,o.keep?c:null)}
};

/* ---------- 2. a manual is not an art: comprehension, half-learned arts, and the long road to mastering them ---------- */
const studyOdds=(s,a)=>clamp(.88-a.tier*.18+(s.t.wit-5)*.035+(s.t.root-5)*.02+(s.smarts-50)/300,.08,.95);
function tryLearn(s,a,how){
  if(!a||s.arts.some(x=>x.cn===a.cn))return false;
  const p=studyOdds(s,a)+(how==='taught'?.15:0);
  if(chance(p)){learn(s,a);say(s,`You grasp it: ${a.n} (${a.cn}) is yours.`,`你领悟了，${a.cn}从此是你的了。`,'gold');return true}
  startStudy(s,a,rint(15,45));
  if(a.tier>=2&&chance(.18)){const w=wound(s,6,16,T('forcing an art too fast','强练武功'));say(s,`You try to swallow ${a.cn} whole and your qi rebels (${w.en}).`,`你想一口吞下${a.cn}，真气反噬（${w.zh}）。`,'bad')}
  return false}
function startStudy(s,a,prog){s.studies=s.studies||[];const key=Object.keys(ARTS).find(k=>ARTS[k].cn===a.cn);let st=s.studies.find(x=>x.cn===a.cn);
  if(!st){st={cn:a.cn,key,art:a,prog:0,crux:false};s.studies.push(st);
    say(s,`You have the opening of ${a.n} (${a.cn}), but mastering it will take time and work.`,`你摸到了${a.cn}的门径，可要真正练成，还得下苦功。`,'muted')}
  st.prog=Math.max(st.prog,prog||0);return st}
/* each session of training or study moves the hardest unfinished art along */
function advanceStudy(s,amt,quiet){
  if(!s.studies||!s.studies.length)return;const st=s.studies[0];const a=st.art;
  const g=Math.round(amt*(1+(s.t.wit-5)*.08)*(1-a.tier*.12));st.prog+=Math.max(1,g);
  if(!st.crux&&st.prog>=55&&INC_BY.st_crux){st.crux=true;s._st=st;runIncident(s,INC_BY.st_crux);return}
  if(st.prog>=100){s.studies.shift();learn(s,a);say(s,`After long work, ${a.n} (${a.cn}) finally comes together.`,`下了这么久的苦功，${a.cn}终于练成了。`,'gold');if(st.deed)s.deeds.push(st.deed);else deed(s,`Mastered ${a.n} through long study`,`苦修多年，练成${a.cn}`)}
  else if(!quiet&&chance(.4))say(s,`Progress on ${a.cn}: about ${Math.floor(st.prog/10)}/10.`,`${a.cn}已练到${cnNum(Math.floor(st.prog/10))}成火候。`,'muted')}
I({id:'st_crux',only:1,noThread:1,ctx:s=>({st:s._st}),
 text:c=>T(`Halfway into ${c.st.art.n} (${c.st.cn}) you hit a wall. The next passage makes no sense, and your qi stalls in the same place every time.`,`${c.st.cn}练到一半，你撞上了一堵墙：下一段心法怎么也读不通，真气每回都卡在同一处。`),
 opts:[{l:T('Go slowly, one step at a time','循序渐进，慢慢磨'),out:[{w:3,t:T('Months of patient work. The wall wears down like stone under water.','几个月的水磨工夫，那堵墙像水下的石头一样一点点磨平了。'),c:'good',fx:{f:(s,c)=>{c.st.prog+=15}}},{w:1,t:T('Patience gets you nowhere this year. The passage stays shut.','今年耐心也没用，那段心法仍旧不通。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Force your qi through the blockage','强运真气，冲关'),sub:T('Fast if it works. Dangerous if it does not.','成则一日千里，败则走火入魔。'),out:[{w:s=>s.t.root*.6+s.qi/40,t:T('The blockage bursts. Warmth floods meridians you did not know you had.','关口冲开了，暖流涌进你从不知道的经脉。'),c:'gold',fx:{qi:4,f:(s,c)=>{c.st.prog+=40}}},
   {w:s=>4-s.t.root*.25,t:T('Your qi turns back on itself. Qi deviation: you cough blood for a month, and lose ground.','真气倒冲，走火入魔。你咳了一个月的血，功夫也退了。'),c:'bad',fx:{hurt:[15,35],cause:T('qi deviation','走火入魔'),f:(s,c)=>{c.st.prog=Math.max(10,c.st.prog-25)}}}]},
  {l:T('Ask someone who knows','向人请教'),if:s=>!!masterOf(s)||s.money>=60,sub:T('Your master, or a paid teacher (60 taels).','找师父，或花六十两请人指点。'),out:[{w:3,t:T('One sentence from someone who has walked the road, and the passage opens.','过来人一句话，那段心法就通了。'),c:'good',fx:{f:(s,c)=>{c.st.prog+=25;const m=masterOf(s);if(m)addBond(m,3);else pay(s,-60)}}},
   {w:1,t:T('They read it, frown, and admit they cannot follow it either.','对方看了半天，皱着眉承认自己也看不懂。'),c:'muted',fx:{f:s=>{if(!masterOf(s))pay(s,-60)}}}]},
  {l:T('Give it up','放弃'),out:[{t:T('You put it away. Some arts are not meant for some people.','你把它收了起来。有些武功，不是给每个人练的。'),c:'muted',sure:1,fx:{f:(s,c)=>{s.studies=(s.studies||[]).filter(x=>x!==c.st)}}}]}]});
/* arts that arrive through events are understood, half-understood, or not yet */
const _applyFxF=applyFx;
applyFx=function(s,e,c){
  if(e&&e.art&&!e.artSure){const a=typeof e.art==='string'?ARTS[e.art]:e.art;const e2=Object.assign({},e);delete e2.art;
    if(a&&!s.arts.some(x=>x.cn===a.cn)){const d=e.deed?(typeof e.deed==='function'?e.deed(c,s):e.deed):null;delete e2.deed;_applyFxF(s,e2,c);
      if(tryLearn(s,a,e.taught?'taught':'event')){if(d)s.deeds.push(d)}else{const st=(s.studies||[]).find(x=>x.cn===a.cn);if(st&&d)st.deed=d}return}
    _applyFxF(s,e2,c);return}
  _applyFxF(s,e,c)};
/* the unfinished arts appear among your unfinished business */
const _openQuests=openQuests;
openQuests=function(s){const q=_openQuests(s);(s.studies||[]).forEach(st=>q.push(T(`Mastering ${st.art.n} (${st.cn}): about ${Math.min(9,Math.floor(st.prog/10))}/10.`,`修习${st.cn}：约${cnNum(Math.min(9,Math.floor(st.prog/10)))}成火候。`)));return q};

/* ---------- 3. one cultivation: forms and inner energy trained together ---------- */
(()=>{const P0=ACT_BY.practice,M0=ACT_BY.meditate;if(!P0)return;
 Object.assign(P0,{n:T('Cultivate','修炼'),d:T('Train forms and inner energy together, and work on any art you have not yet mastered.','练招式，也练内力；手上有没练成的武功，也一并下工夫。'),
  run(s){const fz=fatigue(s,'train'),fm=fz;
   s.skill+=(trainGain(s,.38)+.25)*fz;s.qi+=(qiGain(s,.45)+.35)*fm;happy(s,1);
   if(chance(.06)&&s.health>25){const w=wound(s,4,14,T('a training accident','练功时受的伤'));say(s,`You push too hard and end up with ${w.en}.`,`你练得太狠，落下${w.zh}。`,'bad')}
   else if(chance(.03+s.t.wit*.004)){s.skill+=1.5;s.qi+=1.5;say(s,'Something you have done a thousand times suddenly makes sense. A small breakthrough.','一个练了上千遍的动作，忽然想通了。小有顿悟。','good')}
   else flv(s,chance(.5)?'practice':'meditate','You train until dusk, then sit until your qi runs warm.','你练到天黑，又打坐到真气温热。');
   advanceStudy(s,rint(6,14))}});
 if(M0)M0.if=()=>false;
 const S0=ACT_BY.study;if(S0){S0.ok=s=>owned(s,'book').some(b=>!s.arts.some(a=>a.cn===ARTS[b.art].cn))||(s.studies&&s.studies.length)?true:T('No unread manuals or unfinished arts','没有未读的秘籍，也没有未练成的武功');
  S0.run=s=>{const bs=owned(s,'book').filter(b=>!s.arts.some(a=>a.cn===ARTS[b.art].cn)&&!(s.studies||[]).some(x=>x.cn===ARTS[b.art].cn));
   const opts=(s.studies||[]).map((st,i)=>({k:'s'+i,l:T(`Keep working on ${st.art.n}`,`继续修习${st.cn}`),sub:T(`About ${Math.floor(st.prog/10)}/10`,`约${cnNum(Math.floor(st.prog/10))}成`)})).concat(bs.map(b=>({k:'b'+b.art,l:b.n,sub:T(`Tier ${ARTS[b.art].tier}`,`品阶${cnNum(ARTS[b.art].tier)}`)})));
   if(opts.length)ask(s,'study',{},opts)};
  S0.choose=(s,k)=>{if(k[0]==='s'){const st=s.studies[+k.slice(1)];if(!st)return;s.studies.splice(s.studies.indexOf(st),1);s.studies.unshift(st);advanceStudy(s,rint(18,32));return}
   const a=ARTS[k.slice(1)];if(!a)return;
   if(chance(.07)){say(s,`Halfway through, you realise the manual is incomplete: the last pages were torn out long ago.`,`读到一半你才发现，这本秘籍不全，后面几页早被人撕了。`,'bad');startStudy(s,a,10);return}
   if(!tryLearn(s,a))advanceStudy(s,rint(10,20),true)}}
})();

/* ---------- 4. roaming is where the chances to do good find you ---------- */
(()=>{const W=ACT_BY.wander,G=ACT_BY.gooddeed;if(!W)return;
 W.d=T('Go out and see what finds you: people in trouble, trouble itself, chances. What you do about it is up to you.','出门走走，看会遇上什么：有人遇难，有麻烦找上门，也有机缘。遇上了怎么做，由你。');
 W.run=s=>{const i=(chance(.4)&&pickIncident(s,'good'))||pickIncident(s,'wander')||pickIncident(s);if(i)runIncident(s,i);else quietYear(s)};
 if(G)G.if=()=>false})();

/* ---------- 5. after a fight, something is left to settle ---------- */
addAct({id:'fx_after',cat:'jh',n:T('Aftermath','善后'),d:T('',''),if:()=>false,run(){},
 choose(s,k,c){const nm=c.foe;const fake={npc:Object.assign(npc(s,{age:c.age||30,lv:c.lv}),{n:{cn:nm.zh,py:nm.en,sur:['','']}})};
  const out=(w)=>wpick(w,x=>x[0]);let r;
  switch(k){
   case'spare':r=out([[3+s.t.heart*.2,()=>{addThread(s,'grateful',fake,T(`You spared ${nm.en} when you could have killed them.`,`你本可以要${nm.zh}的命，却放了一条生路。`));say(s,`${nm.en} bows, gets up and limps away without a word.`,`${nm.zh}磕了个头，一瘸一拐地走了，一句话也没说。`,'muted');s.align+=2}],
     [2,()=>{addThread(s,'grudge',fake,T(`You beat ${nm.en} and let them go; they did not forgive the shame.`,`你打败了${nm.zh}又放走了，那份羞辱对方没忘。`));say(s,`${nm.en} looks back once as they go. You remember that look.`,`${nm.zh}走时回头看了你一眼。那眼神你记住了。`,'muted')}],
     [2,()=>{say(s,`You never see ${nm.en} again.`,`此后你再没见过${nm.zh}。`,'muted');s.align+=1}]]);break;
   case'court':r=out([[3,()=>{const g=rint(20,80);pay(s,g);s.fame+=1;say(s,`The magistrate pays a ${g}-tael reward. ${nm.en} goes to the cells.`,`县衙赏了你${g}两，${nm.zh}下了大牢。`,'good')}],
     [2,()=>{addThread(s,'grudge',fake,T(`You handed ${nm.en} to the magistrate.`,`你把${nm.zh}送了官。`));say(s,`A week later ${nm.en} walks out of the yamen. Someone paid. Someone always pays.`,`一个礼拜后，${nm.zh}大摇大摆走出了衙门。有人使了银子，总有人使银子。`,'bad')}],
     [1,()=>{happy(s,-2);s.align+=1;say(s,'The magistrate keeps you a month as a witness. Justice is slow and boring.','县太爷留你作证，一耗就是一个月。公道来得又慢又无聊。','muted')}]]);break;
   case'ask':r=out([[s.smarts/25+s.t.wit*.2,()=>{if(OPPS.length&&chance(.6)){const pool=OPPS.filter(o=>s.age>=o.age[0]&&s.age<=o.age[1]&&(!o.if||o.if(s))&&!(s.opps||[]).includes(o.id));if(pool.length){const o=pick(pool);(s.opps=s.opps||[]).push(o.id);s.oppTip=o.id;say(s,`Under questioning ${nm.en} talks, and lets slip something worth knowing: ${o.n.en.toLowerCase()}.`,`一番逼问，${nm.zh}招了，还漏出一条有用的消息：${o.n.zh}。`,'good');return}}
       const g=rint(15,60);pay(s,g);say(s,`${nm.en} gives up where the stolen silver is hidden: ${g} taels.`,`${nm.zh}供出了藏赃的地方：${g}两银子。`,'good')}],
     [2,()=>say(s,`${nm.en} tells you a long story. Later you find every word of it was a lie.`,`${nm.zh}跟你讲了一长串。后来你才知道，没一句是真的。`,'muted')],
     [.6,()=>{s.align-=1;say(s,`${nm.en} bites down on something hidden in a tooth, and is dead before you can stop it. Someone was afraid of what they would say.`,`${nm.zh}咬碎了藏在牙里的东西，你还没来得及拦就断了气。有人怕他开口。`,'bad')}]]);break;
   case'purse':{const g=rint(5,50);pay(s,g);s.align-=3;say(s,`You take ${nm.en}’s purse: ${g} taels. It does not feel like much.`,`你搜走了${nm.zh}的钱袋：${g}两。说多也不多。`,'muted');if(chance(.3))addThread(s,'grudge',fake,T(`You robbed ${nm.en} after beating them.`,`你打赢了${nm.zh}，还搜走了钱袋。`));break}
   case'up':r=out([[2,()=>{heal(s,5);say(s,'You lie in the dust until you can stand, and walk home slowly.','你在土里躺到站得起来，才慢慢走回去。','muted')}],
     [1.5,()=>{const p=mkPerson(s,{rel:'acq',bond:rint(55,70)});s.people.push(p);heal(s,10);say(s,`${p.n.py} finds you on the road, binds your wounds and will not take money for it.`,`${p.n.cn}在路边发现了你，给你包扎好伤口，分文不取。`,'good')}],
     [1,()=>{const l=Math.min(s.money,rint(10,60));pay(s,-l);say(s,l?`While you lie there someone takes your purse (${l} taels).`:'While you lie there someone goes through your pockets and finds nothing.',l?`你躺着的时候，有人摸走了你的钱袋（${l}两）。`:'你躺着的时候，有人翻了你的口袋，什么也没翻到。','bad')}]]);break;
   case'vow':addThread(s,'rematch',fake,T(`${nm.en} beat you, and you swore it would not happen twice.`,`你败给了${nm.zh}，发誓不会有第二回。`),rint(2,5));happy(s,-2);s.skill+=.5;say(s,`You fix ${nm.en}’s face in your memory and train twice as hard that winter.`,`你把${nm.zh}的样子刻在心里，那个冬天加倍苦练。`,'muted');break;
   case'learn':r=out([[2,()=>{s.skill+=2;say(s,`${nm.en} looks at you, then shows you, briefly, what you did wrong.`,`${nm.zh}看了你一眼，三言两语点破了你错在哪里。`,'good')}],[2,()=>say(s,`${nm.en} laughs and walks off.`,`${nm.zh}哈哈一笑，走了。`,'muted')],[1,()=>{happy(s,-3);say(s,`${nm.en} answers with an insult you will remember for years.`,`${nm.zh}回了你一句难听话，你记了好几年。`,'bad')}]]);break}
  if(r)r[1]()}});
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){
  const r=ci(s,q,k);const inc=INC_BY[q.id],c=q.c;if(!inc||inc.noThread||!s.alive||!c)return r;
  const o=inc.opts&&inc.opts[k];if(!o||!o.fight)return r;const f=c['f'+k];if(!f||!f.foe||f.foe.beast||f.stakes==='spar'||!f.foe.name||!f.foe.name.en)return r;
  if(c.fightWon===true&&chance(.3))s.queue.push({src:'act',id:'fx_after',c:{foe:f.foe.name,lv:f.foe.lv},text:T(`${f.foe.name.en} is down and at your mercy.`,`${f.foe.name.zh}倒在地上，任你处置。`),
    opts:[{k:'spare',l:T('Let them go','放他一条生路')},{k:'court',l:T('Hand them to the magistrate','押送官府')},{k:'ask',l:T('Question them','逼问来历')},{k:'purse',l:T('Take their purse','搜走钱袋')}]});
  else if(c.fightWon===false&&s.health>0&&chance(.3))s.queue.push({src:'act',id:'fx_after',c:{foe:f.foe.name,lv:f.foe.lv},text:T(`You are on the ground. ${f.foe.name.en} stands over you, then walks away.`,`你倒在地上。${f.foe.name.zh}站着看了你一会儿，转身走了。`),
    opts:[{k:'up',l:T('Pick yourself up','咬牙爬起来')},{k:'vow',l:T('Remember their face','记住这张脸')},{k:'learn',l:T('Call after them: “What did I do wrong?”','追问一句："我错在哪？"')}]});
  return r}})();

/* ---------- 6. the teahouse and the wine house: see who is there, then decide ---------- */
(()=>{const TH=ACT_BY.teahouse,TV=ACT_BY.tavern;if(!TH)return;
 const VEN=[['a riverside teahouse','河边茶馆'],['the wine house on South Street','城南酒楼'],['a roadside wine shop','路边酒肆'],['the teahouse by the opera stage','戏园子旁的茶楼'],['an inn’s crowded front room','客栈前堂']];
 const STR_OCC=[1,2,5,6,8,9,10,13,14,16,17,24,26,27,28,29,30];
 Object.assign(TH,{n:T('Teahouse & wine house','茶馆酒楼'),d:T('See who is there today, then decide what to do.','看看今天谁在，再决定做什么。'),ok:s=>needAge(s,8),
  run(s){const c={v:P2(pick(s.age<14?VEN.filter(v=>/茶/.test(v[1])):VEN))};const seen=[];const opts=[];
   c.st=npc(s,{occ:pick(STR_OCC)});seen.push(T(`${c.st.desc.en}, ${c.st.en}, sits alone by the window, looking ${c.st.tr.en}`,`靠窗独坐着一个${c.st.desc.zh}${c.st.zh}，看着${c.st.tr.zh}`));
   opts.push({k:'stranger',l:T(`Talk to ${c.st.en}`,`和${c.st.zh}搭话`)});
   const kn=s.people.filter(p=>p.alive&&!p.temp&&['friend','sworn','acq','rival','enemy','fellow','lover','ex'].includes(p.rel));
   if(kn.length&&chance(.45)){const p=pick(kn);c.pid=p.id;seen.push(T(`${p.n.py} is here too`,`${p.n.cn}也在`));opts.push({k:'known',l:hostile(p)?T(`Face ${p.n.py}`,`去会会${p.n.cn}`):T(`Join ${p.n.py}`,`过去和${p.n.cn}坐`)})}
   seen.push(T('the storyteller is warming up','说书人正在开场'));opts.push({k:'listen',l:T('Listen to the storyteller and the gossip','听书，打听消息')});
   if(chance(.5)||(typeof townQuest==='function'&&townQuest(s))){seen.push(T('voices are rising at the next table','邻桌嗓门越来越大'));opts.push({k:'trouble',l:T('See what the shouting is about','看看邻桌在吵什么')})}
   if(s.age>=14)opts.push({k:'drink',l:T('Drink','喝酒')});
   opts.push({k:'leave',l:T('Finish your tea and go','喝完茶就走')});
   happy(s,2);
   s.queue.push({src:'act',id:'teahouse',c,text:T(`You go to ${c.v.en}. ${seen.map(x=>x.en).join('; ')}.`,`你去了${c.v.zh}。${seen.map(x=>x.zh).join('；')}。`),opts})},
  choose(s,k,c){const st=c.st;const p=c.pid&&person(s,c.pid);
   if(k==='leave'){happy(s,2);return}
   if(k==='listen'){const t=TH._talk?TH._talk(s):null;if(t)say(s,t.en,t.zh);if(chance(.22)){const pool=OPPS.filter(o=>s.age>=o.age[0]&&s.age<=o.age[1]&&(!o.if||o.if(s))&&!(s.opps||[]).includes(o.id));if(pool.length){const o=pick(pool);(s.opps=s.opps||[]).push(o.id);s.oppTip=o.id;say(s,`You also overhear something useful: ${o.n.en.toLowerCase()}.`,`你还听到一条有用的消息：${o.n.zh}。`,'good')}}return}
   if(k==='trouble'){const i=pickIncident(s,'town');if(i)runIncident(s,i);else say(s,'By the time you look, they have made up and are buying each other drinks.','等你转过头去，他们已经和好，互相敬起酒来了。','muted');return}
   if(k==='drink'){happy(s,6);s.health-=2;pay(s,-5);const r=R();
     if(r<.3){const q=mkPerson(s,{rel:'acq',bond:rint(45,65)});s.people.push(q);say(s,`You end up sharing a jar with ${q.n.py}, ${TRAITS[q.trait][0]} and good company.`,`你和${q.n.cn}拼了一坛酒。此人${TRAITS[q.trait][1]}，很投缘。`,'good')}
     else if(r<.42){const f=fightLife(s,{name:foeName(),lv:PW(.8,3)(s)},{stakes:'light',title:T('A drunken brawl','酒后斗殴'),cause:T('a drunken brawl','酒后斗殴')});say(s,f.win?'You win the brawl and lose the respect of the innkeeper.':'You wake up in the street with no memory of the second half of the evening.',f.win?'架打赢了，掌柜的却再也不待见你。':'你在大街上醒来，后半夜的事一点也想不起来了。','muted')}
     else if(r<.52){s.fame=Math.max(0,s.fame-1);say(s,'You say something very loud and very foolish. Half the town hears about it.','你喝多了，大声说了句蠢话。半个镇子都知道了。','bad')}
     else say(s,'You drink until the lanterns blur.','你喝到灯笼都成了重影。');return}
   if(k==='known'&&p){if(hostile(p)){const r=R();if(r<.4){say(s,`You and ${p.n.py} stare at each other across the room until ${PRON[p.sex].he} pays and leaves.`,`你和${p.n.cn}隔着屋子对视，直到对方结账走人。`,'muted')}
       else if(r<.7){const f=fightLife(s,{name:T(p.n.py,p.n.cn),lv:p.lv,fixed:1},{stakes:'injury',title:T('Old enemies','冤家路窄'),cause:T('a teahouse fight','茶馆斗殴')});if(f.win)s.fame+=1;say(s,f.win?'The teahouse will be talking about it for a month.':'You leave by the back door, holding your ribs.',f.win?'这一架，茶馆里说了一个月。':'你捂着肋骨从后门走了。','muted')}
       else{addBond(p,8);say(s,`${p.n.py} raises a cup to you, stiffly. It is not peace, but it is something.`,`${p.n.cn}僵硬地朝你举了举杯。不算和解，可也算点什么。`,'muted')}}
     else{const r=R();addBond(p,r<.7?rint(3,7):-3);say(s,r<.7?`You and ${p.n.py} talk until the lamps are lit.`:`${p.n.py} is in a bad mood and you leave early.`,r<.7?`你和${p.n.cn}一直聊到掌灯。`:`${p.n.cn}心情不好，你早早走了。`,r<.7?'good':'muted')}return}
   if(k==='stranger'){const r=R(),t=st.trait;
     if(t===1&&r<.45){const l=Math.min(s.money,rint(10,80));pay(s,-l);say(s,`${st.en} is charming, and buys you tea. Only later do you notice your purse is ${l} taels lighter.`,`${st.zh}谈吐风趣，还请你喝茶。事后你才发现钱袋轻了${l}两。`,'bad');return}
     if(t===9&&r<.35){const f=fightLife(s,{name:T(st.en,st.zh),lv:st.lv},{stakes:'light',title:T('A word too many','一言不合'),cause:T('a teahouse quarrel','茶馆口角')});say(s,f.win?`${st.en} insults you, and loses.`:`${st.en} insults you, and wins.`,f.win?`${st.zh}出言不逊，被你教训了。`:`${st.zh}出言不逊，你还打不过。`,'muted');return}
     if(r<.45){const q=storeNpc(s,{npc:st},'acq',rint(50,70));say(s,`You and ${st.en} hit it off. You part promising to meet again.`,`你和${st.zh}一见如故，分手时约好下回再聚。`,'good');return}
     if(r<.65){const pool=OPPS.filter(o=>s.age>=o.age[0]&&s.age<=o.age[1]&&(!o.if||o.if(s))&&!(s.opps||[]).includes(o.id));if(pool.length){const o=pick(pool);(s.opps=s.opps||[]).push(o.id);s.oppTip=o.id;say(s,`${st.en} mentions, in passing, something you can use: ${o.n.en.toLowerCase()}.`,`${st.zh}随口提了一件你用得上的事：${o.n.zh}。`,'good');return}}
     if(r<.8&&s.age>=16){const i=pickIncident(s,'town');if(i){say(s,`${st.en} turns out to be in some trouble of their own.`,`原来${st.zh}自己也惹上了点麻烦。`,'muted');runIncident(s,i);return}}
     say(s,`${st.en} answers politely and goes back to their tea. Not everyone wants to talk.`,`${st.zh}客气地应了两句，又低头喝茶了。不是人人都想聊天。`,'muted')}}});
 if(TV)TV.if=()=>false;
})();
