/* 江湖一生 · acts: things you choose to do with your year (BitLife-style menus) */
'use strict';
const JOBS={
 waiter:{n:[T('Inn Waiter','店小二'),T('Head Waiter','跑堂领班'),T('Inn Manager','客栈掌柜')],pay:[25,45,90],req:s=>s.age>=12,rq:T('Age 12+','年满十二岁'),year:s=>happy(s,-1)},
 porter:{n:[T('Dock Porter','码头苦力'),T('Porter Boss','脚行把头'),T('Dock Master','码头总管')],pay:[22,45,90],req:s=>s.age>=14,rq:T('Age 14+','年满十四岁'),year:s=>{happy(s,-2);s.skill+=.6}},
 smith:{n:[T('Smith’s Apprentice','铁匠学徒'),T('Blacksmith','铁匠'),T('Master Swordsmith','铸剑师')],pay:[18,60,180],req:s=>s.age>=12&&s.t.root>=4,rq:T('Age 12+, Bones 4+','年满十二，根骨4+'),year:s=>{s.skill+=.5}},
 clerk:{n:[T('Bookkeeper','账房先生'),T('Chief Accountant','大账房'),T('Steward','大管家')],pay:[60,110,220],req:s=>s.age>=15&&s.smarts>=50,rq:T('Smarts 50+','学识50+')},
 tutor:{n:[T('Village Tutor','私塾先生'),T('Academy Lecturer','书院讲郎'),T('Academy Head','书院山长')],pay:[45,85,160],req:s=>s.age>=18&&s.smarts>=60,rq:T('Age 18+, Smarts 60+','年满十八，学识60+'),year:s=>{s.smarts=clamp(s.smarts+1,0,100)}},
 doctor:{n:[T('Country Doctor','郎中'),T('Physician','大夫'),T('Imperial Physician','御医')],pay:[70,160,420],req:s=>s.age>=18&&s.smarts>=65,rq:T('Age 18+, Smarts 65+','年满十八，学识65+'),year:s=>{heal(s,4);s.align+=1}},
 story:{n:[T('Storyteller','说书人'),T('Famous Storyteller','名嘴'),T('Teahouse Owner','茶楼东家')],pay:[30,75,170],req:s=>s.age>=14&&s.smarts>=40,rq:T('Smarts 40+','学识40+'),year:s=>happy(s,2)},
 actor:{n:[T('Opera Extra','戏班龙套'),T('Opera Star','名角'),T('Troupe Master','班主')],pay:[25,100,220],req:s=>s.age>=12&&s.looks>=60,rq:T('Looks 60+','容貌60+'),year:s=>{s.fame+=1}},
 guard:{n:[T('House Guard','护院'),T('Guard Instructor','护院教头'),T('Palace Guard','大内侍卫')],pay:[40,85,260],req:s=>s.age>=15&&power(s)>=15,rq:T('Power 15+','功力15+'),year:s=>{s.skill+=.8}},
 constable:{n:[T('Constable','捕快'),T('Head Constable','捕头'),T('Chief Inspector','总捕头')],pay:[50,105,240],req:s=>s.age>=16&&power(s)>=20&&s.wanted===0&&s.align>-30,rq:T('Power 20+, not wanted','功力20+，未被通缉'),year:s=>{s.align+=1;s.skill+=.6}},
 escort:{n:[T('Escort Guard','镖师'),T('Senior Escort','镖头'),T('Chief Escort','总镖头')],pay:[70,150,320],req:s=>s.age>=16&&power(s)>=35,rq:T('Power 35+','功力35+'),year:s=>{s.skill+=1}},
 assassin:{n:[T('Hired Blade','杀手'),T('Gold-Medal Killer','金牌杀手'),T('Master of the Killers’ Hall','杀手楼主')],pay:[160,420,1100],req:s=>s.age>=16&&power(s)>=50&&s.align<=-10,rq:T('Power 50+, Unorthodox','功力50+，行事偏邪'),year:s=>{s.align-=3;if(chance(.2))s.wanted=Math.min(5,s.wanted+1)}},
 official:{n:[T('County Magistrate','县令'),T('Prefect','知府'),T('Minister','尚书')],pay:[150,420,1300],req:s=>!!s.flags.exam,rq:T('Pass the imperial exam','须金榜题名'),year:s=>{s.fame+=1}}
};
const actOk=(s,a)=>a.ok?a.ok(s):true;
/* repeating the same training in one year helps less each time */
function fatigue(s,key){s.reps=s.reps&&s.reps.age===s.age?s.reps:{age:s.age};const n=s.reps[key]=(s.reps[key]||0)+1;
  if(n===3)say(s,'You are getting stale doing the same thing; it helps less now.','同样的功夫练多了，收效渐微。','muted');return 1/(1+(n-1))}
const needAge=(s,n)=>s.age>=n?true:T(`Age ${n}+`,`年满${cnNum(n)}岁`);
const notJail=s=>s.jail>0?T('Not while in prison','身在牢中'):true;

/* ---------- casino helpers ---------- */
function betOpts(s){return[10,50,200,1000,5000].filter(b=>b<=s.money).map(b=>({k:'b'+b,l:T(`Bet ${b} taels`,`押${b}两`)})).concat(s.money>0?[{k:'ball',l:T(`Bet everything (${fmtMoney(s.money)})`,`全部押上（${fmtMoney(s.money)}两）`)}]:[],[{k:'leave',l:T('Walk away','起身离开')}])}
const betOf=(s,k)=>k==='ball'?s.money:+k.slice(1);
const DICE='⚀⚁⚂⚃⚄⚅';
const CRICKETS=[['Green-Head General','青头将军'],['Ironback','铁背'],['Red Fang','红牙'],['Black Vajra','黑金刚'],['White Hemp-Head','白麻头'],['Golden Wing','金翅'],['Purple Robe','紫袍'],['Bronze Bell','铜铃']];

/* ---------- activities ---------- */
const ACTS=[
 /* training */
 {id:'practice',cat:'train',n:T('Practise martial arts','练功'),d:T('Steady progress; a small chance of strain.','稳步精进，偶有拉伤。'),ok:s=>needAge(s,6),run(s){
   const fz=fatigue(s,'train');const g=(trainGain(s,.5)+.35)*fz;s.skill+=g;s.qi+=qiGain(s,.15)*fz;
   if(chance(.07)&&s.health>25){const w=wound(s,4,14,T('a training accident','练功时受的伤'));say(s,`You push too hard and end up with ${w.en}.`,`你练得太狠，落下${w.zh}。`,'bad')}
   else flv(s,'practice','You drill your forms until dusk.','你一直练到天黑。')}},
 {id:'sparring',cat:'train',n:T('Spar with a partner','切磋'),d:T('A friendly bout that stops when someone yields. You learn from it, win or lose.','点到为止的比试，有人认输就停。输赢都有长进。'),ok:s=>needAge(s,8),run(s){
   const p=Math.max(4,power(s));
   const hall=[[T('a junior at the martial hall','武馆里的师弟'),.7],[T('a fellow student at the martial hall','武馆里的同伴'),1],[T('the martial hall’s instructor','武馆教头'),1.35]].map(([name,m])=>({name,lv:Math.max(3,Math.round(p*m*(.9+R()*.2)))}));
   const known=living(s,['master','fellow','sworn','friend','sibling','spouse','disciple','rival']).filter(x=>x.age>=8&&x.age<75).sort((a,b)=>b.lv-a.lv).slice(0,3).map(x=>({pid:x.id,name:pn(x),lv:x.lv}));
   const c={opts:hall.concat(known)};
   ask(s,'sparring',c,c.opts.map((o,i)=>({k:'o'+i,l:T(o.name.en.replace(/^./,m=>m.toUpperCase()),o.name.zh),sub:o.pid?T('Someone you know.','你认识的人。'):null,fight:{foe:o.lv,me:power(s),stakes:'spar'}})))},
  choose(s,k,c){const o=c.opts[+k.slice(1)];
   const r=fightLife(s,{name:o.name,lv:o.lv},{stakes:'spar',title:T('Sparring','切磋'),cause:T('a sparring accident','切磋失手')});
   const g=(trainGain(s,.5*clamp(o.lv/Math.max(5,power(s)),.5,1.6))+.5)*fatigue(s,'train');s.skill+=g*(r.win?1:1.3);s.qi+=qiGain(s,.05);
   if(o.pid)addBond(person(s,o.pid),3);
   if(r.win)say(s,'You win, and notice a flaw in your own footwork too.','你赢了，也看出了自己步法里的破绽。','good');else say(s,'You lose, and learn more from it than from any win.','你输了，却比赢一场学到的还多。')}},
 {id:'meditate',cat:'train',n:T('Meditate','打坐'),d:T('Builds inner energy and calms the mind.','增长内力，平心静气。'),ok:s=>needAge(s,8),run(s){
   s.qi+=(qiGain(s,.7)+.6)*fatigue(s,'meditate');happy(s,3);flv(s,'meditate','You sit cross-legged until your qi runs warm through every meridian.','你盘膝而坐，直到真气在经脉中运转温热。')}},
 {id:'seclusion',cat:'train',n:T('Closed-door cultivation','闭关'),d:T('Uses the whole year’s energy. Big gains or qi deviation.','耗尽一年行动力。要么突飞猛进，要么走火入魔。'),ap:'all',ok:s=>s.age<18?needAge(s,18):s.ap<s.apMax?T('Needs a full year of energy','需要整年的行动力'):true,run(s){
   const r=R()+s.t.heart*.01;
   if(r>.45){s.skill+=6+s.t.wit;s.qi+=10;say(s,'After a year in darkness, the wall cracks. You walk out lighter than you went in.','在黑暗中苦修一年后，那堵墙裂开了。你出关时，身轻如燕。','good')}
   else if(r>.15){s.skill+=5;say(s,'A year of silence brings small, solid progress.','一年的静修，带来了虽小却扎实的进步。')}
   else{s.skill=Math.max(0,s.skill-8);const w=wound(s,25,50,T('qi deviation in seclusion','闭关时走火入魔'));say(s,`Your qi runs backward. Qi deviation (走火入魔) leaves you with ${w.en}.`,`真气逆行，你走火入魔，落下${w.zh}。`,'bad')}}},
 {id:'study',ap:2,cat:'train',n:T('Study a manual','研读秘籍'),d:T('Learn an art from a manual you own.','从手中的秘籍里学武功。'),ok:s=>owned(s,'book').some(b=>!s.arts.some(a=>a.cn===ARTS[b.art].cn))?true:T('You own no unread manuals','没有未读的秘籍'),run(s){
   const bs=owned(s,'book').filter(b=>!s.arts.some(a=>a.cn===ARTS[b.art].cn));
   ask(s,'study',{},bs.map(b=>({k:b.art,l:b.n,sub:T(`Tier ${ARTS[b.art].tier}`,`品阶${cnNum(ARTS[b.art].tier)}`)})))},
  choose(s,k){const a=ARTS[k];const p=clamp(.25+s.smarts/160+s.t.wit/25-a.tier*.12,.05,.95);
   if(chance(p)){learn(s,a);say(s,`You master ${a.n} (${a.cn}).`,`你练成了${a.cn}。`,'gold')}
   else if(chance(.15)){const w=wound(s,10,25,T('a misread manual','练错了秘籍'));say(s,`You misread a passage and your qi goes astray (${w.en}).`,`你读岔了一句心法，真气乱窜（${w.zh}）。`,'bad')}
   else say(s,'The words swim on the page. You understand a little more, not enough.','字句在眼前游动。你多懂了一点，但还不够。','muted')}},
 /* the jianghu */
 {id:'wander',ap:2,cat:'jh',n:T('Roam the jianghu','闯荡江湖'),d:T('Go out and see what finds you.','出门走走，看会遇上什么。'),ok:s=>needAge(s,13),run(s){
   const i=pickIncident(s,'wander')||pickIncident(s);if(i)runIncident(s,i);else quietYear(s)}},
 {id:'arena',cat:'jh',n:T('Fight on the arena stage','打擂台'),d:T('Pick an opponent. Win silver and fame.','挑一个对手，赢银子和名声。'),ok:s=>needAge(s,14),run(s){
   const p=Math.max(5,power(s));const c={foes:[.7,1,1.3].map(m=>({name:foeName(),lv:Math.round(p*m*(.9+R()*.2)+3)}))};
   ask(s,'arena',c,c.foes.map((f,i)=>({k:'f'+i,l:T(`${f.name.en} (power ${f.lv})`,`${f.name.zh}（功力${f.lv}）`),sub:[T('An easy purse: 15 taels','奖金十五两，稳妥'),T('A fair fight: 50 taels','势均力敌，奖金五十两'),T('A hard fight: 150 taels','硬仗，奖金一百五十两')][i]})).concat([{k:'leave',l:T('Just watch','只看不打')}]))},
  choose(s,k,c){if(k==='leave'){say(s,'You watch from the crowd and cheer for the loser.','你在台下看热闹，替输家喝彩。','muted');return}
   const i=+k.slice(1),f=c.foes[i];const r=fightLife(s,f,{stakes:'light',title:T('Arena stage','擂台'),cause:T('a fall from the arena stage','擂台比武')});
   if(r.win){const pr=[15,50,150][i];pay(s,pr);s.fame+=[1,3,6][i];say(s,`The crowd roars. You collect ${pr} taels.`,`台下一片叫好。你领了${pr}两彩头。`,'good')}else{s.fame=Math.max(0,s.fame-1);say(s,'You are knocked off the stage. The crowd laughs.','你被打下了擂台，台下一片哄笑。','muted')}}},
 {id:'gooddeed',cat:'jh',n:T('Do a good deed','行侠仗义'),d:T('Look for someone who needs help.','去找需要帮助的人。'),ok:s=>needAge(s,12),run(s){const i=pickIncident(s,'good');if(i)runIncident(s,i);else{s.align+=2;say(s,'You help an old man carry water. Small deeds count too.','你帮一位老人挑水。小事也是侠义。','good')}}},
 {id:'master',ap:2,cat:'jh',n:T('Seek a master','寻访名师'),d:T('Find someone who will teach you.','找一位肯教你的人。'),ok:s=>s.age<10?needAge(s,10):masterOf(s)?T('You already have a master','你已有师父'):true,run(s){
   const p=clamp(.15+s.t.luck/30+s.fame/200+(s.t.root+s.t.wit)/60,.05,.8);
   if(chance(p)){const art=pick(['ironshirt','eagle','bagua','swallow','vajra','knives','drunk','spring','goose','lightning']);
     const m=mkPerson(s,{rel:'master',age:rint(50,85),bond:rint(55,75),lv:rint(80,160),extra:{art}});s.people.push(m);
     say(s,`After months of searching you find ${m.n.py} (${m.n.cn}), a recluse who agrees to take you as a student. ${m.sex==='m'?'He':'She'} is known for ${ARTS[art].n}.`,`寻访数月，你找到了隐居的${m.n.cn}，对方答应收你为徒。此人以${ARTS[art].cn}闻名。`,'good')}
   else say(s,pick(['The hermit on the mountain throws a teapot at you.','You wait three days outside a gate that never opens.','The master you sought died last spring.']),pick(['山上的隐士朝你扔了一把茶壶。','你在一扇门外等了三天，门始终没开。','你要找的那位高人，去年春天已经过世了。']),'muted')}},
 {id:'joinsect',ap:2,cat:'jh',n:T('Ask to join a sect','投奔门派'),d:T('Try the entrance trial of a sect in your region.','去本地门派参加入门考核。'),ok:s=>s.sect?T('You already belong to a sect','你已有门派'):s.age<10?needAge(s,10):s.age>35?T('Too old to start','年纪太大了'):true,run(s){
   ask(s,'joinsect',{},region(s).sects.map(id=>({k:id,l:T(SE(id),SZ(id)),sub:SECTS[id].blurb})).concat([{k:'leave',l:T('Not now','改日再说')}]))},
  choose(s,k){if(k==='leave')return;const S=SECTS[k];const p=.15+(s.t.root+s.t.wit)/30+s.t.luck/60+(S.easy||0)-(s.age>20?(s.age-20)*.02:0)+(s.flags.formerSect?-.2:0)+(s.fame>30?.1:0);
   if(chance(p)){joinSect(s,k);say(s,`The examiner nods. You are now an outer disciple of ${SE(k)}.`,`考官点了点头。你成了${SZ(k)}的外门弟子。`,'good')}
   else say(s,'The examiner shakes his head. "Come back when your bones are better."','考官摇了摇头："根骨不行，回去吧。"','bad')}},
 {id:'travel',ap:2,cat:'jh',n:T('Move to another region','迁居他乡'),d:T('Start over somewhere new. Costs 30 taels.','换个地方重新开始，盘缠三十两。'),ok:s=>s.age<16?needAge(s,16):s.money<30?T('Needs 30 taels','需三十两'):true,run(s){
   ask(s,'travel',{},REGIONS.filter(r=>r.id!==s.region).map(r=>({k:r.id,l:T(r.en,r.cn),sub:r.desc})).concat([{k:'leave',l:T('Stay','留下')}]))},
  choose(s,k){if(k==='leave')return;pay(s,-30);s.region=k;(s.trail=s.trail||[]).push(k);const r=region(s);if(s.job&&!['assassin','official'].includes(s.job)){s.job=null}s.wanted=Math.max(0,s.wanted-2);
   say(s,`You pack up and move to ${r.en}.`,`你收拾行囊，迁居${r.cn}。`,'good');happy(s,4)}},
 /* sect */
 {id:'askmaster',cat:'sect',n:T('Ask your master to teach you','求师父传艺'),d:T('Learn the next art of your sect.','学习本门下一门武功。'),if:s=>!!s.sect,ok:s=>sectArtCount(s)>=3?T('You have learned every art','本门武功已学全'):sectArtCount(s)>s.rank?T('Earn a promotion first','需先晋升'):true,run(s){
   const a=sectArt(s.sect,sectArtCount(s));
   if(chance(.35+s.t.wit/22+(masterOf(s)?masterOf(s).bond/400:0))){learn(s,a);say(s,`Your master teaches you ${a.n} (${a.cn}).`,`师父传了你${a.cn}。`,'good');if(a.tier===2)deed(s,`Mastered ${a.n} (${a.cn})`,`练成${SZ(s.sect)}绝学${a.cn}`)}
   else say(s,`You ask to learn ${a.n}. Your master says your foundation is not ready.`,`你求师父传授${a.cn}，师父说你根基未稳。`,'muted')}},
 {id:'promotion',cat:'sect',n:T('Take the promotion test','参加晋升考核'),d:T('Fight a senior to rise in rank.','与师兄师姐过招，争取晋升。'),if:s=>!!s.sect,ok:s=>s.rank>=2?T('Higher ranks come with age and deeds','更高职位要靠资历和功绩'):needAge(s,12),run(s){
   const who=pick(SUR),b=chance(.5),nm=T(`${b?'Senior Brother':'Senior Sister'} ${who[1]}`,who[0]+(b?'师兄':'师姐'));
   const r=fightLife(s,{name:nm,lv:[18,48][s.rank]+rint(0,10)},{stakes:'spar',title:T('Promotion test','晋升考核')});
   if(r.win){s.rank++;s.fame+=3;say(s,`You pass. You are now ${rankName(s).en} (${rankName(s).zh}).`,`你通过了考核，晋升为${rankName(s).zh}。`,'good')}else say(s,'You fail the test. Next year, then.','你没能通过考核。明年再来。','muted')}},
 {id:'sectmission',cat:'sect',n:T('Take a sect mission','领取门派任务'),d:T('Fight for the sect. Silver, merit, risk.','为门派出力。有银子，有功劳，也有风险。'),if:s=>!!s.sect,ok:s=>needAge(s,14),run(s){const i=pickIncident(s,'sect');if(i)runIncident(s,i)}},
 {id:'leavesect',cat:'sect',n:T('Leave the sect','离开门派'),d:T('Go your own way.','从此自立门户。'),ap:0,if:s=>!!s.sect,run(s){
   ask(s,'leavesect',{},[{k:'go',l:T('Leave for good','就此离开'),sub:T('Your master will not be pleased.','师父不会高兴的。')},{k:'no',l:T('Stay','留下')}])},
  choose(s,k){if(k!=='go')return;const m=masterOf(s);if(m)addBond(m,-40);say(s,`You bow three times and leave ${SE(s.sect)}.`,`你磕了三个头，离开了${SZ(s.sect)}。`);leaveSect(s);happy(s,-3)}},
 /* work */
 {id:'jobs',cat:'work',n:T('Look for work','找差事'),d:T('See who is hiring.','看看哪里招人。'),ok:s=>s.age<12?needAge(s,12):notJail(s),run(s){
   const ids=shuffle(Object.keys(JOBS).filter(k=>k!==s.job)).slice(0,6);
   ask(s,'jobs',{},ids.map(k=>{const J=JOBS[k];const ok=J.req(s);return{k,l:T(`${J.n[0].en} · ${J.pay[0]} taels/yr`,`${J.n[0].zh} · 年俸${J.pay[0]}两`),sub:ok?T('You qualify.','你符合条件。'):T('Needs: '+J.rq.en,'要求：'+J.rq.zh)}}).concat([{k:'leave',l:T('Not now','改日再说')}]))},
  choose(s,k){if(k==='leave')return;const J=JOBS[k];
   if(!J.req(s)){say(s,`They turn you away. (${J.rq.en})`,`对方不收你。（${J.rq.zh}）`,'bad');return}
   if(chance(.7+s.looks/500)){s.job=k;s.jobLv=0;s.jobYears=0;s.perf=50;say(s,`You are hired as ${J.n[0].en}.`,`你当上了${J.n[0].zh}。`,'good')}
   else say(s,'Someone else got the job.','差事被别人抢先了。','muted')}},
 {id:'workhard',cat:'work',n:T('Work hard','卖力干活'),d:T('Impress your employer.','好好表现。'),if:s=>!!s.job,run(s){s.perf=clamp(s.perf+rint(8,20),0,100);happy(s,-2);flv(s,'work_'+s.job,`You put in long hours as ${JOBS[s.job].n[s.jobLv].en}.`,`你兢兢业业地当${JOBS[s.job].n[s.jobLv].zh}。`)}},
 {id:'quitjob',cat:'work',n:T('Quit your job','辞工'),d:T('Walk out.','不干了。'),ap:0,if:s=>!!s.job,run(s){say(s,`You quit your post as ${JOBS[s.job].n[s.jobLv].en}.`,`你辞去了${JOBS[s.job].n[s.jobLv].zh}的差事。`);s.job=null;happy(s,3)}},
 {id:'exam',ap:3,cat:'work',n:T('Sit the imperial exam','参加科举'),d:T('Three days in a tiny cell. Held every third year.','号舍里考三天三夜。三年一考。'),if:s=>!s.flags.exam,ok:s=>s.age<15?needAge(s,15):s.cal%3!==0?T('Not an exam year','今年不开科'):s.smarts<45?T('Smarts 45+','学识45+'):true,run(s){
   if(chance(clamp((s.smarts-45)/70,.03,.8))){s.flags.exam=s.age;s.fame+=10;s.job='official';s.jobLv=0;s.jobYears=0;s.perf=55;say(s,'Your name is on the golden list! You are appointed a county magistrate.','金榜题名！你被授为一县县令。','gold');deed(s,'Passed the imperial examination','金榜题名')}
   else{happy(s,-6);say(s,'Your name is not on the list.','榜上无名。','muted')}}},
 /* leisure */
 {id:'teahouse',cat:'fun',n:T('Teahouse','茶馆听书'),d:T('Hear stories and rumours.','听书，打听消息。'),ok:s=>needAge(s,6),run(s){happy(s,5);
   const r=pick([['The storyteller tells of a sword that cuts through iron like tofu.','说书人讲起一柄削铁如泥的宝剑。'],['A rumour: a sect master has been poisoned.','有传言说，某派掌门被人下了毒。'],['Someone at the next table claims to have seen a flying immortal.','邻桌有人说他亲眼见过飞仙。'],['The storyteller tells a tale about you. It is mostly wrong.','说书人讲了一段你的故事，大半是瞎编的。']]);
   say(s,r[0],r[1]);if(chance(.3)){const i=pickIncident(s,'town');if(i)runIncident(s,i)}}},
 {id:'tavern',cat:'fun',n:T('Drink at a tavern','酒楼买醉'),d:T('Happiness up, health down. You might meet someone.','心情变好，身体变差。也许会结识什么人。'),ok:s=>needAge(s,14),run(s){happy(s,8);s.health-=2;pay(s,-5);
   if(chance(.45)){const p=mkPerson(s,{rel:'acq',bond:rint(40,60)});s.people.push(p);say(s,`You share a jar of wine with ${p.n.py} (${p.n.cn}), ${P(TRAITS[p.trait]).en} and good company.`,`你和${p.n.cn}共饮了一坛酒。此人${TRAITS[p.trait][1]}，很投缘。`,'good')}
   else say(s,'You drink until the lanterns blur.','你喝到灯笼都成了重影。')}},
 {id:'sightsee',ap:2,cat:'fun',n:T('Travel for pleasure','游山玩水'),d:T('Costs 20 taels. Happiness, and maybe an adventure.','花费二十两。心情大好，也许还有奇遇。'),ok:s=>s.age<12?needAge(s,12):s.money<20?T('Needs 20 taels','需二十两'):true,run(s){pay(s,-20);happy(s,12);
   const r=pick([['You climb Mount Tai and watch the sun rise over a sea of clouds.','你登上泰山，看日出云海。'],['You float down the river past the Three Gorges.','你乘舟顺流而下，穿过三峡。'],['You visit West Lake and write a bad poem on a pavilion wall.','你游西湖，在亭柱上题了一首歪诗。'],['You watch the tide at Qiantang. It is louder than war drums.','你去钱塘观潮，潮声比战鼓还响。']]);
   say(s,r[0],r[1],'good');if(chance(.35)){const i=pickIncident(s,'wander');if(i)runIncident(s,i)}}},
 {id:'read',cat:'fun',n:T('Read books','读书'),d:T('Smarts up.','增长学识。'),ok:s=>needAge(s,6),run(s){s.smarts=clamp(s.smarts+rint(2,5),0,100);flv(s,'read','You read the Analects by lamplight.','你挑灯夜读《论语》。')}},
 {id:'fortune',cat:'fun',n:T('Draw a fortune stick','求签'),d:T('Shake the bamboo tube at the temple.','到庙里摇签筒。'),ok:s=>needAge(s,8),run(s){
   const f=pick([['Top-top fortune (上上签): "The dragon rises from the deep."','上上签："潜龙出渊。"',4,1],['Good fortune (上签): "Spring wind, a swift horse."','上签："春风得意马蹄疾。"',3,0],['Middling (中签): "Clouds hide the moon, but not for ever."','中签："云遮月，终有时。"',0,0],['Poor fortune (下签): "Do not cross water this year."','下签："今年莫过江。"',-3,0],['Worst fortune (下下签): "A tiger waits in the bamboo."','下下签："竹林有虎。"',-6,0]]);
   say(s,f[0],f[1],f[2]>0?'good':f[2]<0?'bad':'');happy(s,f[2]);if(f[3])s.flags.luckyYear=s.age}},
 {id:'matchmaker',cat:'fun',n:T('Visit a matchmaker','找媒婆说亲'),d:T('Costs 20 taels. She knows someone.','花二十两，媒婆总能找到人。'),ok:s=>s.age<16?needAge(s,16):spouseOf(s)?T('You are married','你已成亲'):s.money<20?T('Needs 20 taels','需二十两'):true,run(s){
   pay(s,-20);const cs=[0,1,2].map(()=>mkPerson(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-5,5),16,80),bond:rint(30,50),rel:'acq'}));
   ask(s,'matchmaker',{cs},cs.map((p,i)=>({k:'p'+i,l:T(`${p.n.py}, ${p.age}`,`${p.n.cn}，${cnNum(p.age)}岁`),sub:T(`Said to be ${TRAITS[p.trait][0]}.`,`据说为人${TRAITS[p.trait][1]}。`)})).concat([{k:'leave',l:T('None of them','都不合意')}]))},
  choose(s,k,c){if(k==='leave'){say(s,'The matchmaker sighs and keeps your silver.','媒婆叹了口气，银子却没退。','muted');return}
   const p=c.cs[+k.slice(1)];p.id=++s.pid;
   if(chance(.45+s.looks/250+(s.money>300?.1:0))){p.rel='lover';p.bond=rint(55,75);s.people.push(p);say(s,`You meet ${p.n.py} (${p.n.cn}). There is something there.`,`你见到了${p.n.cn}。两人一见如故。`,'good')}
   else{say(s,`${p.n.py} (${p.n.cn}) is not interested.`,`${p.n.cn}对你没有兴趣。`,'muted')}}},
 /* casino */
 {id:'dice',cat:'casino',n:T('Dice: big or small','掷骰子：押大小'),d:T('Three dice. Big pays 1:1, a triple pays 24:1.','三颗骰子。大小一赔一，豹子一赔二十四。'),ok:s=>s.age<14?needAge(s,14):s.money<10?T('Needs 10 taels','至少十两'):true,run(s){ask(s,'dice',{},betOpts(s))},
  choose(s,k,c){if(k==='leave')return;
   if(!c.bet){c.bet=betOf(s,k);return{c,opts:[{k:'big',l:T('Big (11–17)','大（十一至十七）')},{k:'small',l:T('Small (4–10)','小（四至十）')},{k:'triple',l:T('Any triple','豹子')}]}}
   const d=[rint(1,6),rint(1,6),rint(1,6)],sum=d[0]+d[1]+d[2],tri=d[0]===d[1]&&d[1]===d[2];
   const win=k==='triple'?tri:!tri&&(k==='big'?sum>=11:sum<=10);const face=d.map(x=>DICE[x-1]).join(' ');
   if(win){const g=c.bet*(k==='triple'?24:1);pay(s,g);happy(s,6);say(s,`${face} — ${sum}${tri?', a triple':''}. You win ${g} taels!`,`${face}，${sum}点${tri?'，豹子':''}。你赢了${g}两！`,'good')}
   else{pay(s,-c.bet);happy(s,-4);say(s,`${face} — ${sum}${tri?', a triple':''}. You lose ${c.bet} taels.`,`${face}，${sum}点${tri?'，豹子':''}。你输了${c.bet}两。`,'bad');if(s.money===0&&chance(.5)){const i=INC_BY.debt;if(i)runIncident(s,i)}}}},
 {id:'cricket',cat:'casino',n:T('Cricket fighting','斗蛐蛐'),d:T('Pick a cricket. Long odds pay more.','挑一只蛐蛐，赔率越高赚得越多。'),ok:s=>s.age<10?needAge(s,10):s.money<10?T('Needs 10 taels','至少十两'):true,run(s){
   const cs=shuffle(CRICKETS).slice(0,3);const ps=[.5,.32,.18];const c={cs,ps};
   ask(s,'cricket',c,cs.map((x,i)=>({k:'c'+i,l:T(`${x[0]} · pays ${(0.92/ps[i]).toFixed(1)}×`,`${x[1]} · 赔率${(0.92/ps[i]).toFixed(1)}倍`),sub:[T('The favourite.','热门。'),T('A scrappy one.','能打。'),T('Small, but its eyes are mean.','个小，眼神凶。')][i]})).concat([{k:'leave',l:T('Walk away','起身离开')}]))},
  choose(s,k,c){if(k==='leave')return;
   if(c.pick==null){c.pick=+k.slice(1);return{c,opts:betOpts(s)}}
   const bet=betOf(s,k);const r=R();let w=0,acc=0;for(let i=0;i<3;i++){acc+=c.ps[i];if(r<acc){w=i;break}}
   const W=c.cs[w],M=c.cs[c.pick];
   say(s,`The crickets circle. ${W[0]} bites first and does not let go.`,`两只蛐蛐绕着罐子转了几圈。${W[1]}抢先一口咬住，再不松嘴。`);
   if(w===c.pick){const g=Math.round(bet*(0.92/c.ps[c.pick]))-bet;pay(s,g);happy(s,6);say(s,`${M[0]} wins! You take ${g} taels.`,`${M[1]}赢了！你赚了${g}两。`,'good')}
   else{pay(s,-bet);happy(s,-3);say(s,`${M[0]} loses. ${bet} taels gone.`,`${M[1]}输了。${bet}两打了水漂。`,'bad')}}},
 {id:'betfight',cat:'casino',n:T('Bet on an arena fight','押擂台'),d:T('Two fighters, live odds. Watch and win.','两位高手对决，现场开盘。'),ok:s=>s.age<14?needAge(s,14):s.money<10?T('Needs 10 taels','至少十两'):true,run(s){
   const a={name:foeName(),lv:rint(20,140)},b={name:foeName(),lv:Math.max(5,Math.round(a.lv*(.75+R()*.5)))};
   const p=clamp(winRate(()=>npcFighter(a.name,a.lv),()=>npcFighter(b.name,b.lv),30),.08,.92);const c={a,b,p};
   ask(s,'betfight',c,[{k:'a',l:T(`${a.name.en} · pays ${(0.9/p).toFixed(2)}×`,`${a.name.zh} · 赔率${(0.9/p).toFixed(2)}倍`),sub:T(`Power ${a.lv}`,`功力${a.lv}`)},{k:'b',l:T(`${b.name.en} · pays ${(0.9/(1-p)).toFixed(2)}×`,`${b.name.zh} · 赔率${(0.9/(1-p)).toFixed(2)}倍`),sub:T(`Power ${b.lv}`,`功力${b.lv}`)},{k:'leave',l:T('Walk away','起身离开')}])},
  choose(s,k,c){if(k==='leave')return;
   if(!c.side){c.side=k;return{c,opts:betOpts(s)}}
   const bet=betOf(s,k);const r=runBattle([[npcFighter(c.a.name,c.a.lv)],[npcFighter(c.b.name,c.b.lv)]]);
   const id=++s.bt;r.title=T('Arena bet','押擂台');BATTLES[id]=r;SHOW.push(id);
   const won=(r.winner===0)===(c.side==='a');const W=r.winner===0?c.a:c.b;const pr=c.side==='a'?c.p:1-c.p;
   say(s,`⚔ ${W.name.en} wins the bout.`,`⚔ ${W.name.zh}赢下了这一场。`,'fight',{b:id});
   if(won){const g=Math.round(bet*.9/pr)-bet;pay(s,g);happy(s,6);say(s,`Your bet pays ${g} taels.`,`你押中了，赚了${g}两。`,'good')}else{pay(s,-bet);happy(s,-3);say(s,`You lose ${bet} taels.`,`你输了${bet}两。`,'bad')}}},
 /* crime */
 {id:'pickpocket',cat:'crime',n:T('Pickpocket','顺手牵羊'),d:T('Small money, small risk.','小钱，小风险。'),ok:s=>s.age<10?needAge(s,10):notJail(s),run(s){s.align-=2;
   if(chance(.55+s.t.luck/40+power(s)/600)){const g=rint(3,40);pay(s,g);say(s,`You lift a purse with ${g} taels in it.`,`你摸走一个钱袋，里面有${g}两。`,'good')}
   else if(chance(.5)){const w=wound(s,5,15,T('a beating in the market','在集市挨的一顿打'));say(s,`Caught! The crowd beats you (${w.en}).`,`被抓了个正着！众人把你痛打一顿（${w.zh}）。`,'bad')}
   else{s.wanted=Math.min(5,s.wanted+1);say(s,'A constable sees you and gives chase. You escape, but your face is known.','捕快看见了，一路追你。你逃掉了，可脸已经被人记住了。','bad')}}},
 {id:'burgle',ap:2,cat:'crime',n:T('Burgle a rich house','夜入豪宅'),d:T('Good money. Guards.','油水足，但有护院。'),ok:s=>s.age<14?needAge(s,14):notJail(s),run(s){s.align-=5;
   if(chance(.35+s.t.luck/40+power(s)/300)){const g=rint(60,320);pay(s,g);say(s,`You slip in over the wall and out with ${g} taels of silver.`,`你翻墙而入，带着${g}两银子全身而退。`,'good');if(chance(.12))s.items.push({id:pick(['salve','jadedew','steelsword']),age:s.age})}
   else{const r=fightLife(s,{name:T('the house guards','护院'),lv:Math.round(15+power(s)*.6)},{stakes:'injury',title:T('Caught in the act','失手被擒'),cause:T('the guards of a rich house','豪宅护院的围攻')});
     if(r.win){s.wanted=Math.min(5,s.wanted+1);say(s,'You fight your way out empty-handed.','你空手杀了出去。','muted')}else applyFx(s,{jail:rint(1,3)})}}},
 {id:'robconvoy',ap:2,cat:'crime',n:T('Rob an escort convoy','劫镖'),d:T('Big money. The escorts will fight.','大买卖，镖师可不好惹。'),ok:s=>s.age<16?needAge(s,16):notJail(s),run(s){s.align-=10;
   const r=fightLife(s,{name:T('the escort chief','总镖头'),lv:Math.round(25+power(s)*.85)},{stakes:'injury',title:T('Convoy robbery','劫镖'),cause:T('an escort chief’s saber','总镖头的刀')});
   if(r.win){const g=rint(250,900);pay(s,g);s.wanted=Math.min(5,s.wanted+2);s.fame+=2;say(s,`The escorts scatter. You ride off with ${g} taels.`,`镖师四散。你带着${g}两扬长而去。`,'good')}
   else{s.wanted=Math.min(5,s.wanted+1);say(s,'You flee into the hills with nothing.','你一无所获，逃进了山里。','bad')}}},
 {id:'contract',ap:2,cat:'crime',n:T('Take an assassination contract','接暗杀令'),d:T('Kill for money. Heavy on the soul.','拿钱买命。损阴德。'),ok:s=>s.age<16?needAge(s,16):notJail(s),run(s){
   const p=Math.max(10,power(s));const c={t:[.6,.95,1.3].map((m,i)=>({name:foeName(),lv:Math.round(p*m+5),pay:[120,400,1200][i]+rint(0,80)}))};
   ask(s,'contract',c,c.t.map((t,i)=>({k:'t'+i,l:T(`${t.name.en} · ${t.pay} taels`,`${t.name.zh} · ${t.pay}两`),sub:T(`Power about ${t.lv}`,`功力约${t.lv}`)})).concat([{k:'leave',l:T('Refuse','不接')}]))},
  choose(s,k,c){if(k==='leave'){s.align+=1;return}
   const t=c.t[+k.slice(1)];s.align-=12;
   const r=fightLife(s,t,{stakes:'death',title:T('Assassination','行刺'),cause:T(`an assassination gone wrong`,'行刺失手')});
   if(r.win){pay(s,t.pay);if(chance(.3))s.wanted=Math.min(5,s.wanted+1);say(s,`${t.name.en} is dead. The client pays ${t.pay} taels.`,`${t.name.zh}死了。雇主付了${t.pay}两。`,'bad');if(t.lv>120)deed(s,`Assassinated ${t.name.en}`,`刺杀了${t.name.zh}`)}
   else say(s,'The target was ready for you. You barely escape.','目标早有防备。你侥幸逃脱。','bad')}},
 /* prison */
 {id:'escape',ap:2,cat:'jail',n:T('Try to escape','越狱'),d:T('Fight the warden. Fail and your sentence grows.','打倒狱卒。失败会加刑。'),if:s=>s.jail>0,run(s){
   const r=fightLife(s,{name:T('the warden','牢头'),lv:Math.round(20+power(s)*.7)},{stakes:'injury',title:T('Prison break','越狱'),cause:T('a failed prison break','越狱失败')});
   if(r.win){s.jail=0;s.wanted=Math.min(5,s.wanted+2);say(s,'You go over the wall and vanish into the night.','你翻过高墙，消失在夜色里。','good')}else{s.jail+=2;say(s,'You are dragged back to your cell. Two more years.','你被拖回牢房，加刑两年。','bad')}}},
 {id:'bribe',cat:'jail',n:T('Bribe the jailer','贿赂狱卒'),d:T('100 taels per year left.','每年刑期一百两。'),if:s=>s.jail>0,ok:s=>s.money<s.jail*100?T(`Needs ${s.jail*100} taels`,`需${s.jail*100}两`):true,run(s){
   pay(s,-s.jail*100);if(chance(.75)){s.jail=0;say(s,'The jailer counts the silver twice and unlocks the door.','狱卒把银子数了两遍，打开了牢门。','good')}else say(s,'The jailer takes the silver and does nothing.','狱卒收了银子，什么都没做。','bad')}},
 {id:'prisonyard',cat:'jail',n:T('Make friends in the yard','结交狱友'),d:T('Prison has its own jianghu.','牢里也有江湖。'),if:s=>s.jail>0,run(s){const i=pickIncident(s,'jail');if(i)runIncident(s,i);else say(s,'Nobody wants to talk to you today.','今天没人理你。','muted')}},
 /* health */
 {id:'rest',cat:'health',n:T('Rest and recover','休养'),d:T('Free. Recover 10 + your Bones in health, and a little happiness.','不花钱。恢复10＋根骨的气血，心情也好一些。'),run(s){
   heal(s,10+s.t.root);happy(s,2);flv(s,'rest','You sleep late and eat well for a month.','你睡到日上三竿，好好吃了一个月。','good')}},
 {id:'doctor',cat:'health',n:T('See a doctor','看大夫'),d:T('20 taels. Heals wounds; may cure illness.','二十两。治伤，或许能治病。'),ok:s=>s.money<20?T('Needs 20 taels','需二十两'):true,run(s){
   pay(s,-20);heal(s,25);if(s.ill&&chance(.4)){say(s,`The doctor cures your ${ILLS[s.ill].cause.en}.`,`大夫治好了你的病。`,'good');s.ill=null}else flv(s,'doctor','The doctor bandages you and prescribes bitter soup.','大夫给你包扎，开了一碗苦药。','good')}},
 {id:'famousdoc',ap:2,cat:'health',n:T('Visit a famous physician','求访神医'),d:T('300 taels. Cures almost anything.','三百两。几乎药到病除。'),ok:s=>s.money<300?T('Needs 300 taels','需三百两'):true,run(s){
   pay(s,-300);heal(s,80);if(s.ill){s.ill=null;say(s,'The physician presses three needles into your neck. The illness is gone.','神医在你颈后扎了三针，病就好了。','good')}else{s.maxHealth=Math.min(140,s.maxHealth+3);say(s,'The physician tells you to sleep more and charges you anyway.','神医让你多睡觉，钱照收不误。','good')}}},
 {id:'retire',cat:'life',n:T('Golden-basin retirement','金盆洗手'),d:T('Leave the jianghu for good. Fewer fights, more years.','从此退出江湖。少些打斗，多些寿数。'),ap:0,if:s=>!s.retired&&s.age>=40&&s.fame>=15,run(s){
   s.retired=true;s.lifespan+=3;if(s.sect)s.flags.retiredFrom=s.sect;happy(s,6);say(s,'Before a hall full of guests you wash your hands in a golden basin and break your sword.','你在满堂宾客面前于金盆中洗手，折断了佩剑。','good');deed(s,'Retired with the golden-basin ceremony','金盆洗手，退隐江湖')}}
];
/* not on any menu: the secret seller reached through incidents */
ACTS.push({id:'ghostmarket',cat:'hidden',n:T('Secret seller','神秘卖家'),d:T('',''),if:()=>false,run(){},
  choose(s,k,c){if(k==='leave'){say(s,'You walk away. When you look back, the stall is gone.','你转身离开。回头再看，摊子已经不见了。','muted');return}
   const o=c.offer[+k.slice(1)];const d=itemDef(o.id);if(s.money<o.price){say(s,'You cannot afford it.','你买不起。','muted');return}
   pay(s,-o.price);
   if(o.fake){const cheap=d.cat==='weapon'?'ironsword':d.cat==='armor'?'leather':d.cat==='mount'?'donkey':d.cat==='book'?null:'salve';if(cheap)s.items.push({id:cheap,age:s.age});
     say(s,`You hand over ${fmtMoney(o.price)} taels. In daylight, the ${d.n.en} turns out to be a fake.`,`你付了${fmtMoney(o.price)}两。到了白天才发现，那${d.n.zh}是假的。`,'bad');happy(s,-8);return}
   s.items.push({id:o.id,age:s.age,paid:o.price});happy(s,6);
   say(s,`You pay ${fmtMoney(o.price)} taels for the ${d.n.en}. It is real.`,`你花${fmtMoney(o.price)}两买下了${d.n.zh}。货真价实。`,'gold');if(['yitian','tulong'].includes(o.id))deed(s,`Acquired the ${d.n.en}`,`得到${d.n.zh}`)}});
function openRare(s,intro){const offer=rareOffer(s);
  const list=offer.map(o=>{const d=itemDef(o.id);return[`${d.n.en} (${fmtMoney(o.price)} taels)`,`${d.n.zh}（${fmtMoney(o.price)}两）`]});
  say(s,`On the cloth: ${list.map(x=>x[0]).join(', ')}.`,`布上摆着：${list.map(x=>x[1]).join('、')}。`);
  const can=offer.map((o,i)=>({o,i})).filter(x=>s.money>=x.o.price);
  if(!can.length){say(s,'You cannot afford any of it, and walk away wishing.','你一样也买不起，只能眼馋着走开。','muted');return}
  ask(s,'ghostmarket',{offer},can.map(({o,i})=>{const d=itemDef(o.id);return{k:'o'+i,l:T(`Buy the ${d.n.en} · ${fmtMoney(o.price)} taels`,`买下${d.n.zh} · ${fmtMoney(o.price)}两`),sub:T('The seller will not haggle.','卖家一口价。')}}).concat([{k:'leave',l:T('Walk away','转身离开')}]))}
/* ---------- this year's opportunities: a few one-off chances that change every year ---------- */
const OPPS=[
 {id:'o_master',ap:2,age:[8,70],n:T('A wandering master teaches at the temple','游方高人在庙里授艺'),d:T('A rare lesson. Big training gain; you might learn an art.','难得的指点。练功大有长进，或许还能学到一门武功。'),run(s){
   s.skill+=trainGain(s,1)+1;s.qi+=qiGain(s,.3);
   const can=['ironshirt','eagle','bagua','swallow','vajra','knives','drunk','spring','goose'].filter(k=>!s.arts.some(a=>a.cn===ARTS[k].cn));
   if(can.length&&chance(.2+s.t.wit/40)){const k=pick(can);learn(s,ARTS[k]);say(s,`The master takes a liking to you and teaches you ${ARTS[k].n} (${ARTS[k].cn}).`,`高人对你青眼有加，传了你${ARTS[k].cn}。`,'gold')}
   else say(s,'You train with the master for a month. Your stance will never be the same.','你跟着高人练了一个月，架势从此不同了。','good')}},
 {id:'o_waterfall',ap:2,age:[14,65],n:T('Train under a waterfall','瀑布下练功'),d:T('Inner energy grows fast. The cold can hurt.','内力大进，但寒水伤身。'),run(s){
   s.qi+=qiGain(s,1)+1.5;if(chance(.2)){const w=wound(s,5,15,T('cold water under a waterfall','瀑布寒水'));say(s,`You sit under the falls until your lips turn blue (${w.en}).`,`你在瀑布下坐到嘴唇发紫（${w.zh}）。`,'bad')}else say(s,'The falls pound your shoulders. Your qi settles like still water.','瀑布砸在肩头，你的真气却静如止水。','good')}},
 {id:'o_herbs',ap:1,age:[8,80],n:T('Herbs are in season on the mountain','山上草药正当季'),d:T('Gather herbs to keep or sell.','采些草药，自用或卖钱。'),run(s){
   if(chance(.5)){s.items.push({id:'salve',age:s.age});if(chance(.4))s.items.push({id:'salve',age:s.age});say(s,'You make wound salve from what you gather.','你用采来的草药做了金疮药。','good')}else{const g=rint(10,40);pay(s,g);say(s,`You sell the herbs for ${g} taels.`,`草药卖了${g}两。`,'good')}}},
 {id:'o_guard',ap:2,age:[15,60],n:T('A merchant is hiring guards','商人雇人押货'),d:T('Good pay. The road may not be quiet.','报酬不错，路上未必太平。'),run(s){
   const g=rint(30,80);pay(s,g);say(s,`You guard a merchant’s goods for ${g} taels.`,`你替商人押货，得了${g}两。`,'good');
   if(chance(.4)){const r=fightLife(s,{name:foeName(),lv:PW(.8,6)(s)},{stakes:'injury',title:T('Guarding the goods','押货'),cause:T('robbers on the road','路上的强盗')});if(r.win){pay(s,20);s.fame+=2}}}},
 {id:'o_spring',ap:1,age:[6,95],n:T('A hot spring nearby','附近有温泉'),d:T('Heal and relax.','养伤，放松。'),run(s){heal(s,20+s.t.root);happy(s,5);say(s,'You soak until every ache is gone.','你泡到浑身的酸痛都没了。','good')}},
 {id:'o_library',ap:1,age:[8,90],n:T('The county academy opens its library','县学开放藏书楼'),d:T('Smarts grow fast.','学识大进。'),run(s){s.smarts=clamp(s.smarts+rint(5,8),0,100);say(s,'You read from opening to closing every day for a week.','你一连一个星期，从开门读到关门。','good')}},
 {id:'o_fair',ap:1,age:[4,95],n:T('The temple fair is on','庙会开了'),d:T('Fun, food, and who knows who you will meet.','好吃好玩，说不定还能遇上谁。'),run(s){happy(s,6);say(s,'Acrobats, sugar figures, and too much noise.','杂耍、糖人，还有满耳的喧闹。','good');if(chance(.5)){const i=pickIncident(s,'town');if(i)runIncident(s,i)}}},
 {id:'o_tourney',ap:1,age:[14,50],n:T('A county tournament this year','今年县里办比武'),d:T('Prize money and fame.','有彩头，有名声。'),run(s){runIncident(s,INC_BY.tournamentlocal)}},
 {id:'o_ghost',ap:1,age:[16,90],n:T('Rumours of a ghost market','听说有鬼市'),d:T('Rare goods, steep prices, some fakes.','稀罕货，价钱高，有真有假。'),run(s){runIncident(s,INC_BY.ghostmarket)}},
 {id:'o_camp',ap:2,age:[11,60],if:s=>!!s.sect,n:T('Your sect holds a training camp','门派开集训'),d:T('Hard training with your fellow disciples.','和同门一起苦练。'),run(s){s.skill+=trainGain(s,.9)+.5;living(s,'fellow').forEach(p=>addBond(p,4));say(s,'A month of drills at dawn and dusk.','一个月的早晚操练。','good')}},
 {id:'o_harvest',ap:1,age:[8,80],n:T('Neighbours need help with the harvest','邻居秋收缺人手'),d:T('A little silver and a lot of goodwill.','挣点小钱，攒些人缘。'),run(s){pay(s,rint(5,15));s.align+=2;living(s).forEach(p=>{if(['friend','acq'].includes(p.rel))addBond(p,2)});say(s,'Your back aches. The neighbours bring you a basket of eggs.','腰酸背痛。邻居送来一篮鸡蛋。','good')}},
 {id:'o_story',ap:1,age:[12,90],if:s=>s.smarts>=40,n:T('A storytelling contest at the teahouse','茶馆举办说书比赛'),d:T('Win fame and a purse with a good story.','讲得好，名利双收。'),run(s){if(chance(.3+s.smarts/200)){pay(s,30);s.fame+=3;say(s,'Your story wins. The teahouse invites you back every month.','你的故事拔得头筹，茶馆请你每月都来。','good')}else say(s,'A ten-year-old with a story about a talking goose beats you.','你输给了一个讲会说话的鹅的十岁孩子。','muted')}}
];
OPPS.forEach(o=>ACTS.push(Object.assign({cat:'opp',if0:o.if},o,{if:s=>(s.opps||[]).includes(o.id),run:(fn=>s=>{s.opps=(s.opps||[]).filter(x=>x!==o.id);fn(s)})(o.run)})));
function rollOpps(s){
  if(s.age<4||s.jail>0){s.opps=[];return}
  const pool=OPPS.filter(o=>s.age>=o.age[0]&&s.age<=o.age[1]&&(!o.if||o.if(s)));
  s.opps=shuffle(pool).slice(0,2+(chance(s.t.luck/12)?1:0)).map(o=>o.id);
}
const ACT_BY=Object.fromEntries(ACTS.map(a=>[a.id,a]));
const ACT_CATS=[['opp',T('This year’s opportunities','今年的机缘')],['train',T('Training','修炼')],['jh',T('The jianghu','江湖')],['sect',T('Sect','门派')],['work',T('Work','营生')],['fun',T('Leisure','消遣')],['casino',T('Gambling den','赌坊')],['crime',T('Crime','黑道')],['jail',T('Prison','牢狱')],['health',T('Health','医馆')],['life',T('Life','人生')]];
function actCost(s,a){return a.ap==='all'?s.apMax:(a.ap??1)}
function canAct(s,a){
  if(!s.alive||s.queue.length)return T('Decide first','先做决定');
  if(a.if&&!a.if(s))return false;
  if(s.jail>0&&!['jail','train'].includes(a.cat)&&a.id!=='doctor')return T('Not while in prison','身在牢中');
  const ok=actOk(s,a);if(ok!==true)return ok;
  if(actCost(s,a)>s.ap)return T('No energy left this year','今年的行动力已用完');
  return true;
}
function doAct(s,id){
  const a=ACT_BY[id];const ok=canAct(s,a);if(ok!==true)return ok;
  s.ap-=actCost(s,a);
  say(s,'▸ '+a.n.en,'▸ '+a.n.zh,'act');
  const before=snap(s);a.run(s);if(!s.queue.length)report(s,before);after(s);return true;
}

/* ---------- people ---------- */
const PACTS=[
 {id:'chat',n:T('Chat','闲聊'),ap:0,if:(s,p)=>p.age>=3&&s.age>=3,ok:(s,p)=>p.talked===s.age?T('Already talked this year','今年已聊过'):true,run(s,p){p.talked=s.age;addBond(p,rint(2,7));happy(s,1);
   const l=pick([['You talk about the weather and the price of rice.','你们聊了天气和米价。'],['You trade stories late into the night.','你们聊到深夜。'],['You laugh about something stupid from years ago.','你们笑起多年前的一件蠢事。'],['They tell you a secret and swear you to silence.','对方告诉你一个秘密，要你发誓保密。']]);say(s,l[0],l[1])}},
 {id:'gift',n:T('Give a gift (20 taels)','送礼（二十两）'),if:(s,p)=>s.age>=8,ok:s=>s.money<20?T('Needs 20 taels','需二十两'):true,run(s,p){pay(s,-20);const g=TRAITS[p.trait][0]==='greedy'?rint(12,20):rint(5,12);addBond(p,g);say(s,`${p.n.py} is pleased with the gift.`,`${p.n.cn}很喜欢你送的礼物。`,'good')}},
 {id:'spar',n:T('Spar','切磋武艺'),if:(s,p)=>s.age>=8&&p.age>=8&&p.age<75,run(s,p){
   const r=fightLife(s,{name:pn(p),lv:p.lv},{stakes:'spar',title:T('Sparring','切磋')});addBond(p,r.win?(TRAITS[p.trait][0]==='arrogant'?-6:2):3);
   if(r.win){s.fame+=p.lv>power(s)?2:0;say(s,`You win the bout. ${p.n.py} bows.`,`你赢了。${p.n.cn}抱拳认输。`,'good')}else{s.skill+=.5;say(s,`${p.n.py} wins. You learn something from losing.`,`${p.n.cn}赢了。输了也有收获。`)}}},
 {id:'teach',n:T('Ask to be taught','请教武功'),if:(s,p)=>s.age>=8&&(p.rel==='master'||(p.lv>power(s)+20&&p.bond>=70&&['friend','sworn','father','mother','spouse','lover'].includes(p.rel))),run(s,p){
   const g=(trainGain(s,.7)+1)*fatigue(s,'train');s.skill+=g;
   if(p.art&&!s.arts.some(a=>a.cn===ARTS[p.art].cn)&&chance(.3+p.bond/300+s.t.wit/40)){learn(s,ARTS[p.art]);say(s,`${p.n.py} teaches you ${ARTS[p.art].n} (${ARTS[p.art].cn}).`,`${p.n.cn}传了你${ARTS[p.art].cn}。`,'gold')}
   else say(s,`${p.n.py} corrects your stance for an afternoon.`,`${p.n.cn}花了一下午纠正你的架势。`,'good');addBond(p,2)}},
 {id:'money',n:T('Ask for money','讨要银子'),if:(s,p)=>['father','mother','spouse','sworn'].includes(p.rel)&&s.age>=6,run(s,p){
   const fam=family(s);const base=['father','mother'].includes(p.rel)?[2,8,30,80,200,900][fam.rich]:rint(5,50);
   if(chance(p.bond/120)){const g=Math.max(1,Math.round(base*(.5+R())));pay(s,g);addBond(p,-3);say(s,`${p.n.py} gives you ${g} taels.`,`${p.n.cn}给了你${g}两。`,'good')}else{addBond(p,-6);say(s,`${p.n.py} refuses and lectures you about thrift.`,`${p.n.cn}不给，还教训你要节俭。`,'muted')}}},
 {id:'confess',n:T('Confess your feelings','表白'),if:(s,p)=>s.age>=15&&p.age>=15&&['acq','friend','fellow','sworn','ex','rival'].includes(p.rel)&&!spouseOf(s)&&Math.abs(p.age-s.age)<25,run(s,p){
   if(chance(p.bond/130+s.looks/400)){p.rel='lover';addBond(p,10);happy(s,8);say(s,`${p.n.py} blushes and says yes.`,`${p.n.cn}红着脸答应了。`,'good')}else{addBond(p,-10);happy(s,-8);say(s,`${p.n.py} turns you down gently.`,`${p.n.cn}婉拒了你。`,'bad')}}},
 {id:'date',n:T('Go on a date','约会'),if:(s,p)=>['lover','spouse'].includes(p.rel),run(s,p){addBond(p,rint(4,10));happy(s,5);const l=pick([['You row a little boat out under the lotus leaves.','你们划着小船钻进荷叶深处。'],['You watch the lanterns float down the river.','你们看河灯顺水漂走。'],['You climb a hill to watch the stars.','你们爬上山坡看星星。']]);say(s,l[0],l[1],'good')}},
 {id:'propose',n:T('Propose marriage','求亲'),if:(s,p)=>p.rel==='lover'&&!spouseOf(s)&&s.age>=16,run(s,p){
   if(p.bond>=65&&chance(.4+p.bond/200)){p.rel='spouse';happy(s,15);const cost=Math.min(s.money,rint(20,80));pay(s,-cost);say(s,`${p.n.py} says yes! The wedding costs ${cost} taels and is worth every coin.`,`${p.n.cn}答应了！婚礼花了${cost}两，值得。`,'gold');deed(s,`Married ${p.n.py}`,`与${p.n.cn}结为夫妻`)}
   else{addBond(p,-12);happy(s,-8);say(s,`${p.n.py} says it is too soon.`,`${p.n.cn}说，还太早了。`,'bad')}}},
 {id:'baby',n:T('Try for a child','要个孩子'),if:(s,p)=>p.rel==='spouse'&&s.age>=17&&s.age<=(s.gender==='f'?45:65)&&p.age<=(p.sex==='f'?45:70),run(s,p){
   if(chance(.45)){const g=chance(.5)?'m':'f';const c=mkPerson(s,{rel:'child',sex:g,sur:s.gender==='m'?s.sur:p.n.sur,age:0,bond:rint(70,95),lv:1});s.people.push(c);happy(s,12);
     say(s,`A ${g==='m'?'son':'daughter'} is born! You name ${g==='m'?'him':'her'} ${c.n.py} (${c.n.cn}).`,`${g==='m'?'儿子':'女儿'}出生了！你取名${c.n.cn}。`,'gold')}
   else say(s,'No luck this year.','今年没能如愿。','muted')}},
 {id:'teachkid',n:T('Teach your martial arts','传授武功'),if:(s,p)=>['child','disciple'].includes(p.rel)&&p.age>=5&&power(s)>p.lv,run(s,p){p.lv+=rint(3,8)+Math.round(power(s)/40);addBond(p,4);say(s,`You teach ${p.n.py} for a season. ${p.sex==='m'?'He':'She'} is getting good.`,`你教了${p.n.cn}一季武功。${p.sex==='m'?'他':'她'}进步很快。`,'good')}},
 {id:'disciple',n:T('Take as a disciple','收为徒弟'),if:(s,p)=>s.age>=30&&power(s)>=60&&['acq','friend'].includes(p.rel)&&p.age<30&&p.lv<power(s),run(s,p){
   if(chance(.5+p.bond/200)){p.rel='disciple';s.fame+=2;say(s,`${p.n.py} kneels and offers you tea. You have a disciple.`,`${p.n.cn}跪下给你敬茶。你收了一个徒弟。`,'good')}else say(s,`${p.n.py} politely declines.`,`${p.n.cn}婉言谢绝了。`,'muted')}},
 {id:'sworn',n:T('Swear brotherhood','结拜'),if:(s,p)=>['friend','acq','fellow'].includes(p.rel)&&s.age>=14&&p.age>=14,ok:(s,p)=>p.bond<75?T('Needs a closer bond (75+)','交情不够（需75+）'):true,run(s,p){p.rel='sworn';addBond(p,10);happy(s,6);say(s,`You and ${p.n.py} burn incense and swear to live and die together.`,`你与${p.n.cn}焚香结拜，誓同生死。`,'gold');deed(s,`Swore brotherhood with ${p.n.py}`,`与${p.n.cn}义结金兰`)}},
 {id:'befriend',n:T('Become friends','交个朋友'),if:(s,p)=>p.rel==='acq',ok:(s,p)=>p.bond<55?T('Needs a closer bond (55+)','交情不够（需55+）'):true,run(s,p){p.rel='friend';say(s,`You and ${p.n.py} are friends now.`,`你和${p.n.cn}成了朋友。`,'good')}},
 {id:'argue',n:T('Argue','争吵'),if:(s,p)=>s.age>=6&&p.age>=6,run(s,p){addBond(p,-rint(6,15));happy(s,-3);const l=pick([['You shout until the neighbours bang on the wall.','你们吵得邻居直敲墙。'],['You say something you cannot take back.','你说了一句收不回的话。'],['They storm out and slam the door.','对方摔门而去。']]);say(s,l[0],l[1],'bad');
   if(p.bond<10&&!['father','mother','child'].includes(p.rel)){p.rel='enemy';say(s,`${p.n.py} now counts you as an enemy.`,`${p.n.cn}从此把你当作仇人。`,'bad')}}},
 {id:'duel',n:T('Challenge to a duel','下战书'),if:(s,p)=>['enemy','rival'].includes(p.rel)&&s.age>=14,run(s,p){
   const r=fightLife(s,{name:pn(p),lv:p.lv},{stakes:'injury',title:T('Duel','决斗'),cause:T(`a duel with ${p.n.py}`,`与${p.n.cn}的决斗`)});
   if(r.win){s.fame+=Math.round(3+p.lv/20);addBond(p,p.rel==='rival'?8:-5);if(p.rel==='rival'&&p.bond>50)p.rel='friend';say(s,`You beat ${p.n.py} in front of witnesses.`,`你当众击败了${p.n.cn}。`,'good')}
   else say(s,`${p.n.py} beats you.`,`${p.n.cn}打败了你。`,'bad')}},
 {id:'kill',n:T('Kill','下杀手'),if:(s,p)=>s.age>=14&&['enemy','rival','acq','ex'].includes(p.rel)&&p.age>=14,run(s,p){
   s.align-=p.rel==='enemy'?4:15;
   const r=fightLife(s,{name:pn(p),lv:p.lv},{stakes:'death',title:T('To the death','生死相搏'),cause:T(`a fight to the death with ${p.n.py}`,`与${p.n.cn}的生死相搏`)});
   if(r.win){p.alive=false;p.diedAt=s.age;p.killed=1;say(s,`${p.n.py} is dead by your hand.`,`${p.n.cn}死在你手里。`,'bad');if(p.rel!=='enemy'){s.wanted=Math.min(5,s.wanted+2)}else happy(s,5)}
   else{p.rel='enemy';say(s,`${p.n.py} survives, and will not forget.`,`${p.n.cn}活了下来，这笔账记下了。`,'bad')}}},
 {id:'cut',n:T('Cut ties','断绝来往'),ap:0,if:(s,p)=>!['father','mother','child','spouse'].includes(p.rel),run(s,p){p.alive=false;p.gone=1;say(s,`You stop seeing ${p.n.py}.`,`你和${p.n.cn}从此不再来往。`,'muted')}},
 {id:'breakup',n:T('Break up','分手'),ap:0,if:(s,p)=>p.rel==='lover',run(s,p){p.rel='ex';addBond(p,-25);happy(s,-6);say(s,`You and ${p.n.py} part ways.`,`你和${p.n.cn}分开了。`,'bad')}},
 {id:'divorce',n:T('Divorce','和离'),if:(s,p)=>p.rel==='spouse',run(s,p){p.rel='ex';addBond(p,-30);happy(s,-10);const half=Math.round(s.money*.3);pay(s,-half);say(s,`You and ${p.n.py} sign the letter of divorce. It costs you ${half} taels.`,`你和${p.n.cn}签了和离书，花了${half}两。`,'bad')}}
];
const PACT_BY=Object.fromEntries(PACTS.map(a=>[a.id,a]));
function canPact(s,p,a){
  if(!s.alive||s.queue.length)return T('Decide first','先做决定');
  if(!p.alive)return false;if(a.if&&!a.if(s,p))return false;
  if(s.jail>0&&!['chat'].includes(a.id))return T('Not while in prison','身在牢中');
  const ok=a.ok?a.ok(s,p):true;if(ok!==true)return ok;
  if((a.ap??1)>s.ap)return T('No energy left this year','今年的行动力已用完');
  return true;
}
function doPact(s,pid,id){const p=person(s,pid),a=PACT_BY[id];const ok=canPact(s,p,a);if(ok!==true)return ok;
  s.ap-=(a.ap??1);say(s,`▸ ${a.n.en}: ${p.n.py}`,`▸ ${a.n.zh}：${p.n.cn}`,'act');const before=snap(s);a.run(s,p);report(s,before);after(s);return true}

/* ---------- shop ---------- */
function buy(s,id){const d=itemDef(id);if(!d)return false;const price=Math.round(d.price*(['house','biz'].includes(d.cat)?s.stock.mkt:1));
  if(s.money<price)return T('Not enough silver','银子不够');if(s.age<10&&d.cat!=='pet'&&d.cat!=='pill')return T('Too young to buy this','年纪太小');
  pay(s,-price);s.items.push({id,age:s.age,paid:price});happy(s,3);say(s,`You buy ${d.n.en} for ${fmtMoney(price)} taels.`,`你花${fmtMoney(price)}两买下了${d.n.zh}。`);return true}
function sellPrice(s,it){const d=itemDef(it.id);return Math.round(d.price*(['house','biz'].includes(d.cat)?s.stock.mkt:.5))}
function sell(s,idx){const it=s.items[idx];if(!it)return;const d=itemDef(it.id),g=sellPrice(s,it);s.items.splice(idx,1);pay(s,g);say(s,`You sell ${d.n.en} for ${fmtMoney(g)} taels.`,`你把${d.n.zh}卖了${fmtMoney(g)}两。`)}
function useItem(s,idx){const it=s.items[idx];const d=itemDef(it.id);if(!d.use)return;s.items.splice(idx,1);const u=d.use;
  if(u.heal)heal(s,u.heal);if(u.cure)s.ill=null;if(u.qi)s.qi+=u.qi;if(u.life)s.lifespan+=u.life;
  say(s,`You take the ${d.n.en}.`,`你服下了${d.n.zh}。`,'good');after(s)}
