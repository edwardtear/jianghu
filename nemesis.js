/* 江湖一生 · 宿敌: a rival who does not go away.
   One person at a time becomes your nemesis, always out of something that really happened: someone you beat in front of
   others, someone you wronged, or an enemy you already have. They train, their grudge (恨意) grows every year, and it
   escalates step by step: a public vow, rumours, sabotage, threats to the people you love, an ambush, hired blades, and
   at last a duel at an appointed place. It can also end in peace: an apology, or a rescue when they are in trouble.
   If you kill them, their child may take up the grudge years later. State: s.nem = {pid,at,heat,stage,last,why,beat,lost}. */
'use strict';
const NM=s=>s.nem&&s.nem.pid?s.nem:null;
const nmP=s=>{const n=NM(s);return n?person(s,n.pid):null};
const nmCtx=s=>{const p=nmP(s);const c=scene();if(!p)return c;c.npc=npc(s,{name:p.n,sex:p.sex,age:p.age,lv:p.lv});c.pid=p.id;c.p=p;c.nm=s.nem;return c};
const NMI=d=>{d.only=1;d.noThread=1;d.noRipple=1;d.cd=0;I(d)};
const heatAdd=(s,n)=>{const m=NM(s);if(m)m.heat=clamp(m.heat+n,0,100)};
const WHY={beat:T('you beat them in front of everyone','你当众打败了对方'),wronged:T('you did them a wrong they never forgave','你做了一件对方永远不肯原谅的事'),enemy:T('the old enmity between you','你们之间的旧怨'),lost:T('they beat you once and want to prove it was no accident','对方赢过你一次，想证明那不是侥幸'),heir:T('you killed their parent','你杀了对方的父亲或母亲')};
/* end the feud: how it ended goes into the record of past nemeses */
function nmEnd(s,how){const m=NM(s),p=nmP(s);if(!m)return;(s.nemPast=s.nemPast||[]).push({pid:m.pid,n:p?p.n:null,at:m.at,end:s.age,how});
  if(p){delete p.nem;if(how==='peace'){p.rel='rival';p.bond=Math.max(p.bond,45)}if(how==='respect'){p.rel='rival';p.bond=Math.max(p.bond,55)}}
  s.nem=null;s.flags.nemCD=s.age}
/* who could become your nemesis: from your own record */
function nmCandidate(s){const recent=(s.mem||[]).filter(r=>s.age-r.at<=10&&['beat','wronged','lostTo'].includes(r.kind)&&r.who&&r.who.n);
  const rec=recent.length?pick(recent):null;const en=living(s,'enemy').filter(p=>p.age>=16&&p.age<70&&!family_(p));
  if(rec&&(chance(.6)||!en.length)){let p=rec.pid&&person(s,rec.pid);if(p&&(!p.alive||family_(p)||MEM_NOCALL.includes(p.rel)))return null;
    if(!p){const w=rec.who,yrs=s.age-rec.at;p=mkPerson(s,{rel:'enemy',sex:w.sex,name:w.n,age:Math.max(16,(w.age||25)+yrs),lv:Math.max(5,w.lv||power(s)),bond:5,occ:w.occ});s.people.push(p);rec.pid=p.id}
    return{p,why:rec.kind==='lostTo'?'lost':rec.kind}}
  if(en.length)return{p:pick(en),why:'enemy'};return null}
function nmStart(s,c0){const cand=c0||nmCandidate(s);if(!cand)return false;const p=cand.p;p.rel='enemy';p.bond=Math.min(p.bond,10);p.nem=1;
  p.lv=Math.max(p.lv,Math.round(power(s)*(.8+R()*.25)));
  s.nem={pid:p.id,at:s.age,heat:cand.why==='heir'?55:30,stage:0,last:s.age,why:cand.why,beat:0,lost:0};
  runIncident(s,INC_BY.nm_vow,nmCtx(s));return true}

/* ---------- the scenes ---------- */
NMI({id:'nm_vow',text:c=>{const w=WHY[c.nm.why]||WHY.enemy;return T(`Word reaches you that ${c.npc.en} has sworn, in a crowded teahouse, to settle things with you. The reason: ${w.en}. ${c.npc.He} has been training every day since.`,`有人传话来：${c.npc.zh}在人满为患的茶馆里当众发誓，要跟你把账算清。起因是${w.zh}。从那天起，${c.npc.ta}每天都在苦练。`)},
 opts:[{l:T('Pay it no mind','不放在心上'),out:[{t:T('You go on with your life. The grudge does not.','你照常过日子。那份恨意却没停。'),c:'muted',fx:{f:s=>heatAdd(s,3)}}]},
  {l:T('Send a gift and an apology (40 taels)','托人送礼赔罪（四十两）'),cost:40,out:[{w:2,t:c=>T(`The gift comes back unopened. ${c.npc.en} wants something money cannot buy.`,`礼原封不动退了回来。${c.npc.zh}要的不是钱。`),c:'muted',fx:{f:s=>heatAdd(s,-6)}},{w:s=>s.t.heart*.15,t:c=>T(`${c.npc.en} keeps the gift and says nothing. Maybe that is enough.`,`${c.npc.zh}收下了礼，一句话也没说。也许这样就够了。`),c:'good',fx:{f:s=>heatAdd(s,-22)}}]},
  {l:T('Send word back: any time, any place','放话回去：随时奉陪'),out:[{t:T('The whole town hears it by evening. Some admire you; everyone waits.','当晚整个镇子都听说了。有人佩服你，人人都在等着看。'),c:'gold',fx:{fame:2,f:s=>heatAdd(s,12)}}]}]});
/* rumours */
NMI({id:'nm_rumor',text:c=>T(`Stories about you are going round: that you won your fights by cheating, that you owe money everywhere. They all lead back to ${c.npc.en}.`,`江湖上传开了一些关于你的闲话：说你比武靠的是暗算，说你到处欠钱。追根溯源，都是${c.npc.zh}放出来的。`),
 opts:[{l:T('Let your deeds answer','让做的事替你说话'),out:[{w:2,t:T('It takes a year, but people stop repeating it.','过了一年，没人再提了。'),c:'muted',fx:{fame:-2}},{w:1,t:T('Some of it sticks.','有些话就这么传下去了。'),c:'bad',fx:{fame:-5}}]},
  {l:T('Go and confront them','找上门去对质'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.p.lv,fixed:1},stakes:'injury',title:T('Settle the rumours','当面对质'),cause:T('a quarrel with a rival','与宿敌争斗')}),
   win:[{t:c=>T(`You beat ${c.npc.en} in front of witnesses. The rumours die; the grudge does not.`,`你当着众人打败了${c.npc.zh}。闲话没了，恨意却更深了。`),c:'good',fx:{fame:3,f:s=>{heatAdd(s,10);s.nem.beat++}}}],
   lose:[{t:c=>T(`${c.npc.en} wins, and now the stories have a witness.`,`${c.npc.zh}赢了。这下，那些闲话有了人证。`),c:'bad',fx:{fame:-4,f:s=>{heatAdd(s,-8);s.nem.lost++}}}]},
  {l:T('Spread a few stories of your own','以牙还牙，也放些风声'),out:[{t:T('Two liars, and the jianghu enjoys it enormously.','两个人互相泼脏水，江湖上看得津津有味。'),c:'muted',fx:{align:-3,f:s=>heatAdd(s,8)}}]}]});
/* sabotage */
NMI({id:'nm_sabotage',when:s=>owned(s,'biz').length>0||owned(s,'house').length>0,
 text:c=>T(`Fire in the night. Someone has set light to your property, and a neighbour saw ${c.npc.en} leaving with an empty oil jar.`,`半夜起了火。有人在你的产业上放了一把火，邻居看见${c.npc.zh}提着空油罐走了。`),
 opts:[{l:T('Put out the fire, count the cost','先救火，再算损失'),out:[{t:T('Most of it is saved. The rest you rebuild.','大半保住了。剩下的，你重新修。'),c:'bad',fx:(s,c)=>({money:-Math.min(s.money,rint(60,200))})}]},
  {l:T('Go after them tonight','连夜追上去'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.p.lv,fixed:1},stakes:'injury',title:T('After the arsonist','追放火的人'),cause:T('chasing an arsonist','追捕放火之人')}),
   win:[{t:c=>T(`You catch ${c.npc.en} on the bridge. ${c.npc.He} pays for the damage, through gritted teeth.`,`你在桥上追上了${c.npc.zh}。${c.npc.ta}咬着牙赔了损失。`),c:'good',fx:{money:[40,120],f:s=>{heatAdd(s,12);s.nem.beat++}}}],
   lose:[{t:T('They get away, and the fire did its work.','人跑了，火也烧完了。'),c:'bad',fx:(s,c)=>({money:-Math.min(s.money,rint(80,240)),f:s=>s.nem.lost++})}]},
  {l:T('Report it to the magistrate','报官'),out:[{w:s=>1+s.fame/40,t:c=>T(`${c.npc.en} spends a season in the cells and comes out angrier.`,`${c.npc.zh}在牢里蹲了一季，出来时火气更大了。`),c:'muted',fx:{f:s=>heatAdd(s,10)}},{w:1,t:T('No proof, says the magistrate, and pockets your fee.','县官说没有证据，顺手收下了你的银子。'),c:'bad',fx:{money:-30}}]}]});
/* the people you love */
NMI({id:'nm_family',when:s=>!!spouseOf(s)||living(s,'child').length>0,
 ctx:s=>{const c=nmCtx(s);const fam=spouseOf(s)||pick(living(s,'child'));c.fam=T(fam.n.py,fam.n.cn);c.famId=fam.id;return c},
 text:c=>T(`${c.fam.en} says a stranger has been standing across the road from the house for three days. You know who it is: ${c.npc.en}.`,`${c.fam.zh}说，一个陌生人在家门对面站了三天了。你知道那是谁：${c.npc.zh}。`),
 opts:[{l:T('Go out and face them now','立刻出门去会会'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.p.lv,fixed:1},stakes:'injury',title:T('At your own door','家门口'),cause:T('a fight at your own door','家门口的一场恶斗')}),
   win:[{t:c=>T(`${c.npc.en} goes, and does not come back to the house. The feud goes on elsewhere.`,`${c.npc.zh}走了，再没来过你家。可这笔账换了个地方接着算。`),c:'good',fx:{f:(s,c)=>{heatAdd(s,8);s.nem.beat++;addBond(person(s,c.famId),6)}}}],
   lose:[{t:c=>T(`${c.npc.en} leaves you in the dust in front of your own family, and walks away laughing.`,`${c.npc.zh}当着你家人的面把你打翻在地，笑着走了。`),c:'bad',fx:{happy:-8,f:s=>{s.nem.lost++;heatAdd(s,-5)}}}]},
  {l:T('Send the family to stay with relatives (60 taels)','把家人送去亲戚家住一阵（六十两）'),cost:60,out:[{t:T('The house is empty and safe. You hate how quiet it is.','家里空了，也安全了。你讨厌这份安静。'),c:'muted',fx:{happy:-4}}]},
  {l:T('Ask your friends to keep watch','请朋友们轮流守着'),if:s=>living(s,['sworn','friend']).length>=2,out:[{t:c=>T(`Your friends take turns at the gate. After a week ${c.npc.en} stops coming.`,`朋友们轮流守在门口。一个礼拜后，${c.npc.zh}不来了。`),c:'good',fx:{f:s=>{living(s,['sworn','friend']).forEach(p=>addBond(p,3));heatAdd(s,4)}}}]}]});
/* slander to your sect */
NMI({id:'nm_sect',when:s=>!!s.sect,text:c=>T(`Your sect elders call you in. A letter has come, signed by ${c.npc.en}, accusing you of selling the sect’s secrets.`,`门中长辈把你叫了去。有人寄来一封信，署名${c.npc.zh}，告你出卖本门机密。`),
 opts:[{l:T('Answer every charge, calmly','一条一条，平心静气地辩白'),out:[{w:s=>.6+s.t.wit*.15,t:T('The elders believe you, and remember who wrote the letter.','长辈们信了你，也记住了写信的人。'),c:'good',fx:{f:s=>{if(typeof sAdj==='function')sAdj(s,s.sect,4,1);heatAdd(s,6)}}},{w:1,t:T('They are not sure. You are watched for a year.','他们拿不准。你被盯了一年。'),c:'bad',fx:{f:s=>{if(typeof sAdj==='function')sAdj(s,s.sect,-8,1)}}}]},
  {l:T('Demand to face your accuser','要求和写信的人当面对质'),out:[{w:1,t:c=>T(`${c.npc.en} never comes. The elders draw their own conclusion.`,`${c.npc.zh}始终没露面。长辈们心里有了数。`),c:'good',fx:{f:s=>{if(typeof sAdj==='function')sAdj(s,s.sect,6,1);heatAdd(s,10)}}}]}]});
/* ambush */
NMI({id:'nm_ambush',text:c=>T(`On a lonely road, ${c.npc.en} steps out from behind a tree with a drawn blade. “No witnesses this time.”`,`荒路上，${c.npc.zh}拔刀从树后走了出来。“这回没有旁人了。”`),
 opts:[{l:T('Fight','拔刀迎战'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.round(c.p.lv*1.05),fixed:1},stakes:'injury',title:T('Ambush','伏击'),cause:T('an ambush by a sworn rival','宿敌的伏击')}),
   win:[{t:c=>T(`${c.npc.en} limps into the woods. ${c.npc.He} will be back, and better.`,`${c.npc.zh}一瘸一拐地逃进了林子。${c.npc.ta}还会回来，而且会更强。`),c:'good',fx:{fame:2,f:s=>{s.nem.beat++;heatAdd(s,10)}}}],
   lose:[{t:c=>T(`You wake in a ditch with your purse gone. ${c.npc.en} has left a note: “Next time, properly.”`,`你在沟里醒来，钱袋没了。${c.npc.zh}留了张字条：“下回，来真的。”`),c:'bad',fx:(s,c)=>({money:-Math.min(s.money,rint(20,90)),f:s=>{s.nem.lost++;heatAdd(s,-4)}})}]},
  {l:T('Run','掉头就跑'),out:[{w:2,t:T('You get away. It does not feel like winning.','你跑掉了。感觉一点也不像赢。'),c:'muted',fx:{fame:-2,f:s=>heatAdd(s,4)}},{w:1,t:T('Not fast enough.','没跑掉。'),c:'bad',fx:{hurt:[8,18],cause:T('an ambush by a sworn rival','宿敌的伏击')}}]}]});
/* hired blades */
NMI({id:'nm_gang',text:c=>T(`${c.npc.en} has found friends: three hired blades stand with ${c.npc.him} at the crossroads, and one of them is already grinning.`,`${c.npc.zh}找了帮手：三个拿钱办事的刀客跟${c.npc.ta}一起堵在路口，其中一个已经在笑了。`),
 opts:[{l:T('Fight them all','以一敌众'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.p.lv,fixed:1,extra:[{name:T('Hired blade','刀客'),lv:Math.round(power(s)*.55)},{name:T('Hired blade','刀客'),lv:Math.round(power(s)*.5)}]},stakes:'injury',title:T('Outnumbered','以寡敌众'),cause:T('a fight against hired blades','以寡敌众的恶战')}),
   win:[{t:T('The hired blades run when the first one falls. Word of it travels for months.','头一个倒下，其余的刀客就跑了。这件事传了好几个月。'),c:'gold',fx:{fame:6,f:s=>{s.nem.beat++;heatAdd(s,15)}}}],
   lose:[{t:T('You are beaten badly, and they take their time about it.','你被打得很惨，他们一点也不着急。'),c:'bad',fx:{hurt:[6,14],cause:T('a beating by hired blades','被刀客围殴'),f:s=>{s.nem.lost++;heatAdd(s,-6)}}}]},
  {l:T('Bring your own friends','叫上自己的朋友'),if:s=>living(s,['sworn','friend','disciple']).length>=2,fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.p.lv,fixed:1,extra:[{name:T('Hired blade','刀客'),lv:Math.round(power(s)*.55)},{name:T('Hired blade','刀客'),lv:Math.round(power(s)*.5)}]},allies:living(s,['sworn','friend','disciple']).sort((a,b)=>b.lv-a.lv).slice(0,2).map(p=>({name:T(p.n.py,p.n.cn),lv:p.lv})),stakes:'injury',title:T('Friends at your side','有朋友并肩'),cause:T('a brawl between two gangs','两帮人的混战')}),
   win:[{t:T('Your friends at your back, the hired blades scatter. You buy everyone dinner.','有朋友在身后，刀客们一哄而散。你请大家吃了顿好的。'),c:'gold',fx:{fame:3,f:s=>{s.nem.beat++;heatAdd(s,8);living(s,['sworn','friend']).forEach(p=>addBond(p,3))}}}],
   lose:[{t:T('Even together you lose. At least no one is left alone in the dust.','一起上也输了。好在没有谁是一个人倒在地上。'),c:'bad',fx:{hurt:[4,10],cause:T('a brawl between two gangs','两帮人的混战'),f:s=>s.nem.lost++}}]},
  {l:T('Pay them off (150 taels)','花钱打发（一百五十两）'),cost:150,out:[{t:c=>T(`The hired blades take your money and leave ${c.npc.en} standing alone, furious.`,`刀客们收了你的钱，丢下${c.npc.zh}一个人气得发抖。`),c:'muted',fx:{f:s=>heatAdd(s,10)}}]}]});
/* in trouble: the way out of a feud */
NMI({id:'nm_peril',text:c=>T(`You come upon ${c.npc.en} by chance: wounded, cornered in a gully by men from some other quarrel. ${c.npc.He} sees you, and says nothing.`,`你偶然撞见了${c.npc.zh}：受了伤，被另一拨仇家堵在山沟里。${c.npc.ta}看见了你，一句话也没说。`),
 opts:[{l:T('Help them','出手相救'),fight:(s,c)=>({foe:{name:T('The attackers','围攻者'),lv:Math.round(power(s)*.85),fixed:1},stakes:'injury',title:T('For your enemy','为了仇人'),cause:T('a rescue gone wrong','一场救援')}),
   win:[{w:3,t:c=>T(`Afterwards ${c.npc.en} sits by the fire a long time, then says, “We are even.” The feud is over.`,`事后，${c.npc.zh}在火边坐了很久，说：“咱们两清了。”这段仇，就此了结。`),c:'gold',fx:{align:6,fame:3,f:s=>nmEnd(s,'peace'),deed:T('Saved the life of a sworn enemy','救下了自己的宿敌')}},{w:1,t:c=>T(`${c.npc.en} thanks no one and limps away. But the hatred has gone out of it.`,`${c.npc.zh}谁也没谢，一瘸一拐地走了。但那股恨意，已经淡了。`),c:'good',fx:{align:4,f:s=>heatAdd(s,-45)}}],
   lose:[{t:T('Both of you are beaten, and both of you live. Neither says thank you.','你们俩都挨了打，也都活了下来。谁也没说谢谢。'),c:'muted',fx:{f:s=>heatAdd(s,-25)}}]},
  {l:T('Walk away','转身离开'),out:[{t:T('Whatever happens in that gully, it is not your doing.','山沟里怎么样，不是你的事。'),c:'muted',fx:{}}]},
  {l:T('Finish it yourself','趁机了结'),out:[{t:c=>T(`It is quick. You do not feel the way you thought you would.`,`很快就结束了。你没有想象中那种痛快。`),c:'bad',fx:{align:-10,fame:-2,f:s=>{const p=nmP(s);if(p){p.alive=false;p.diedAt=s.age;p.killed=1;p.cause=T('killed by you','死在你手里')}nmEnd(s,'killed')}}}]}]});
/* the appointed duel */
NMI({id:'nm_duel',ctx:s=>{const c=nmCtx(s);c.where=pick([T('on the peak at the next full moon','下个月圆之夜，山巅之上'),T('at the old ferry at dawn','黎明时分，旧渡口'),T('in the ruined temple outside town','镇外那座破庙'),T('on the frozen lake when the snow stops','雪停之后，结冰的湖面上')]);return c},
 text:c=>T(`A letter, in ${c.npc.en}’s hand: ${c.where.en}. Come alone. One of us walks away.`,`一封信，是${c.npc.zh}的笔迹：${c.where.zh}。一个人来。只有一个能走着回去。`),
 opts:[{l:T('Go, and fight to the end','赴约，一决生死'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.round(c.p.lv*1.08),fixed:1},stakes:'death',title:T('The appointed duel','约战'),cause:T('a duel with a sworn rival','与宿敌的生死决斗')}),
   win:[{w:1,t:c=>T(`${c.npc.en} falls. You stay until the sun is up, then bury ${c.npc.him} yourself.`,`${c.npc.zh}倒下了。你一直守到天亮，亲手把${c.npc.ta}埋了。`),c:'gold',fx:{fame:10,deed:T('Ended a long feud in an appointed duel','约战了断一段宿怨'),f:(s,c)=>{const p=nmP(s);if(p){p.alive=false;p.diedAt=s.age;p.killed=1;p.cause=T('a duel with you','与你决斗')}nmEnd(s,'killed')}}}],
   lose:[{t:c=>T(`You lose. ${c.npc.en} stands over you a long moment, then sheathes the blade. “Live with it.”`,`你输了。${c.npc.zh}站在你面前看了很久，收刀入鞘。“带着这个活下去吧。”`),c:'bad',fx:{fame:-6,happy:-10,hurt:[10,22],cause:T('a duel with a sworn rival','与宿敌的生死决斗'),f:s=>{nmEnd(s,'lost')}}}]},
  {l:T('Go, but fight only until one yields','赴约，点到为止'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.round(c.p.lv*1.05),fixed:1},stakes:'injury',title:T('The appointed duel','约战'),cause:T('a duel with a sworn rival','与宿敌的决斗')}),
   win:[{w:2,t:c=>T(`${c.npc.en} yields, and for the first time looks at you without hatred. “Again, in ten years?” It is almost friendly.`,`${c.npc.zh}认输了，头一回不带恨意地看着你。“十年后再比？”这话说得几乎像朋友。`),c:'gold',fx:{fame:6,f:s=>nmEnd(s,'respect')}},{w:1,t:c=>T(`${c.npc.en} yields, spits, and leaves. It is not over.`,`${c.npc.zh}认了输，啐了一口，走了。还没完。`),c:'muted',fx:{fame:4,f:s=>{s.nem.beat++;s.nem.heat=40;s.nem.stage=1}}}],
   lose:[{t:c=>T(`You yield. ${c.npc.en} has what ${c.npc.he} wanted, and the jianghu knows it.`,`你认输了。${c.npc.zh}得偿所愿，江湖上人人都知道了。`),c:'bad',fx:{fame:-5,f:s=>nmEnd(s,'lost')}}]},
  {l:T('Do not go','不去'),out:[{t:c=>T(`${c.npc.en} waits all night and tells everyone you were afraid. Maybe you were.`,`${c.npc.zh}等了一夜，然后逢人便说你怕了。也许你真的怕了。`),c:'bad',fx:{fame:-8,f:s=>heatAdd(s,15)}}]}]});
/* news of an old nemesis, and a grudge inherited */
NMI({id:'nm_gone',text:c=>T(`News comes that ${c.npc.en} has died, of age and illness, far away. Whatever was between you is finished.`,`消息传来：${c.npc.zh}在远方病逝了。你们之间的一切，就此了结。`),
 opts:[{l:T('Drink to them','为对方喝一杯'),out:[{t:T('You find you are not glad.','你发现自己并不高兴。'),c:'muted',fx:{f:s=>{const p=nmP(s);if(p){p.alive=false;p.diedAt=s.age;p.cause=T('old age and illness','年老病逝')}nmEnd(s,'died')}}}]}]});
NMI({id:'nm_heir',ctx:s=>{const c=scene();const past=(s.nemPast||[]).filter(x=>x.how==='killed'&&x.n).slice(-1)[0];c.old=past?T(past.n.py,past.n.cn):T('your old enemy','你当年的仇人');
   const kid=mkPerson(s,{rel:'enemy',sur:past&&past.n?past.n.sur:null,age:rint(18,26),lv:Math.round(power(s)*.85),bond:0});s.people.push(kid);c.kid=kid;c.npc=npc(s,{name:kid.n,sex:kid.sex,age:kid.age,lv:kid.lv});c.pid=kid.id;return c},
 text:c=>T(`A young stranger stops you in the street: ${c.npc.en}, child of ${c.old.en}. “I was a child when you killed my ${c.kid.sex==='m'?'father':'mother'}. I am not a child now.”`,`一个年轻的陌生人在街上拦住了你：${c.npc.zh}，${c.old.zh}的孩子。“你杀我爹娘的时候，我还是个孩子。现在不是了。”`),
 opts:[{l:T('Tell them the whole story','把当年的事原原本本告诉对方'),out:[{w:s=>.5+s.t.heart*.1,t:c=>T(`${c.npc.en} listens to the end, and leaves without a word. Perhaps that is the end of it.`,`${c.npc.zh}从头听到尾，一言不发地走了。也许就这样结束了。`),c:'muted',fx:{f:(s,c)=>{c.kid.rel='acq';c.kid.bond=20}}},{w:1,t:c=>T(`“That changes nothing.”`,`“这改变不了什么。”`),c:'bad',fx:{f:(s,c)=>nmStart(s,{p:c.kid,why:'heir'})}}]},
  {l:T('“Then come at me.”','“那就来吧。”'),out:[{t:T('A new grudge begins, older than the one who carries it.','一段新的仇恨开始了，它比背负它的人还要老。'),c:'bad',fx:{f:(s,c)=>nmStart(s,{p:c.kid,why:'heir'})}}]}]});

/* ---------- each year: the grudge grows, and something happens ---------- */
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.jail>0||s.queue.length>1||s.age<16)return;
  const m=NM(s);
  if(!m){if(s.age>70)return;if(s.flags.nemCD!=null&&s.age-s.flags.nemCD<6)return;
    if((s.nemPast||[]).some(x=>x.how==='killed'&&s.age-x.end>=12&&s.age-x.end<=30)&&!s.flags.nemHeir&&chance(.08)){s.flags.nemHeir=s.age;runIncident(s,INC_BY.nm_heir);return}
    if(chance(.09+Math.min(.06,s.fame/1500)))nmStart(s);return}
  const p=nmP(s);if(!p||!p.alive){nmEnd(s,p&&p.killed?'killed':'died');return}
  if(p.age>=74&&chance(.25)){runIncident(s,INC_BY.nm_gone,nmCtx(s));return}
  /* they get stronger, and angrier */
  p.lv=Math.max(p.lv,Math.round(p.lv+Math.max(1,(power(s)*1.05-p.lv)*.12)));
  heatAdd(s,rint(4,9)+(s.fame>=60?3:0));
  if(s.age-m.last<1||!chance(.38+m.heat/300))return;
  m.last=s.age;
  let id;
  if(m.heat<=8){nmEnd(s,'faded');say(s,`You realise you have not heard of ${p.n.py} in years. The feud has simply worn out.`,`你忽然发觉，已经好几年没听到${p.n.cn}的消息了。这段恩怨，就这么淡了。`,'muted');return}
  if(chance(.1)&&m.stage>=1)id='nm_peril';
  else if(m.heat>=85||m.stage>=4)id='nm_duel';
  else if(m.heat>=60&&m.stage>=2)id='nm_gang';
  else{const pool=['nm_rumor','nm_ambush'];if(INC_BY.nm_sabotage.when(s))pool.push('nm_sabotage');if(INC_BY.nm_family.when(s))pool.push('nm_family');if(INC_BY.nm_sect.when(s))pool.push('nm_sect');id=pick(pool)}
  m.stage++;const inc=INC_BY[id];const c=nmCtx(s);if(inc.ctx&&id!=='nm_heir')Object.assign(c,inc.ctx(s));runIncident(s,inc,c)}})();
/* your nemesis is labelled as such */
(()=>{const r0=relLabel;relLabel=function(s,p){if(p&&p.nem&&p.alive)return T('Nemesis','宿敌');return r0(s,p)}})();
/* you cannot simply stop seeing someone who is hunting you */
(()=>{const P=PACTS.find(a=>a.id==='cut');if(!P)return;const i0=P.if;P.if=(s,p)=>!p.nem&&(!i0||i0(s,p))})();
