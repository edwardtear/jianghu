/* 江湖一生 · when you beat someone who deserved it (bandits, robbers, hired killers, a man who came for your family),
   the fight does not simply end: they are on the ground and you decide. Kill them, let them go, cripple their martial
   arts, or hand them to the yamen. Whatever you choose is remembered, and years later it comes back: a son with a
   sword, a gang, a bounty, a widow and her child, a reformed man who repays you, or the same man back with friends. */
'use strict';
const KL_RE=/山贼|劫|匪|马贼|强盗|盗|恶霸|打手|杀手|刺客|仇家|仇人|灭门|魔教|邪派|伏击|寻仇|贼|人贩|讨债|蒙面|强人|追杀|采花|水寇|响马|黑店|恶徒|歹人|倭寇|逃犯|凶手|内鬼|伏兵|出卖|用毒|鬼店|假银|剪径|拐子|恶少|淫|毒手/;
const klVillain=(foe,o)=>{if(!o||['spar','light'].includes(o.stakes))return false;if(foe&&foe.pid)return false;
  const t=[o.cause,o.title,foe&&foe.name].map(x=>x?(x.zh||String(x)):'').join(' ');return KL_RE.test(t)};
/* the fight is won: hand the choice to the player */
(()=>{const f0=fightLife;fightLife=function(s,foe,o){const r=f0.apply(this,arguments);
  if(r&&r.win&&s.alive&&!s.klBusy&&s.queue.length<5&&klVillain(foe,o)){const vn=foe.name&&foe.name.zh?foe.name:T(String(foe.name||'the man'),String(foe.name||'那人'));
    runIncident(s,INC_BY.kl_mercy,Object.assign(scene(),{vn,lv:foe.lv||power(s),why:o.cause||null}))}
  return r}})();
const klRec=(s,c,kind)=>{(s.kl=s.kl||[]).push({n:c.vn,lv:c.lv,at:s.age,kind,st:0,reg:s.region});if(s.kl.length>12)s.kl.shift()};
const VN=c=>c.vn;
/* what is on him: always some silver, often his weapon (as rolled as any shop piece), sometimes darts, pills, a charm,
   and once in a while the manual he learned from */
function klLoot(s,c){const lv=Math.max(5,c.lv||power(s)),got=[];const money=Math.round(rint(10,40)+lv*(.8+R()*1.6));pay(s,money);got.push(T(`${money} taels`,`${money}两银子`));
  const add=(id,extra)=>{const d=ITEMS[id];if(!d)return;let it=Object.assign({id,age:s.age},extra||{});if(typeof rollItem==='function')it=rollItem(s,it);
    if(d.cat==='anqi'&&d.cnt0){const n=extra&&extra.cnt||rint(3,d.cnt0);const old=s.items.find(x=>x.id===id);if(old){old.cnt=(old.cnt??d.cnt0)+n;got.push(T(`${d.n.en} ×${n}`,`${d.n.zh}×${n}`));return}it.cnt=n}
    s.items.push(it);const dd=typeof instDef==='function'?instDef(it):d;got.push(it.cnt?T(`${dd.n.en} ×${it.cnt}`,`${dd.n.zh}×${it.cnt}`):T(dd.n.en,dd.n.zh))};
  const pool=(cat,cap,rare)=>Object.keys(ITEMS).filter(k=>{const d=ITEMS[k];return d.cat===cat&&d.price<=cap&&(rare?true:!d.rare)&&d.price>=(cat==='weapon'?20:0)});
  if(chance(.5)){const w=pool('weapon',Math.max(60,lv*8)).concat(chance(.1)?pool('weapon',lv*20,1):[]);if(w.length)add(pick(w))}
  if(chance(.3)){const a=pool('anqi',lv*4+60);if(a.length)add(pick(a))}
  if(chance(.35)){const p=['salve','bonepaste','antidote','hushin','incense'].concat(lv>=60?['jadedew']:[]).filter(k=>ITEMS[k]);add(pick(p))}
  if(chance(.1)){const ch=pool('charm',lv*10,lv>=90);if(ch.length)add(pick(ch))}
  if(chance(.08)&&typeof lnPick==='function'){const k=(chance(.5)&&lnPick(s,'anqi',2))||lnPick(s,null,2);if(k){s.items.push({id:'book:'+k,age:s.age});got.push(T(`a manual: ${ARTS[k].n}`,`秘籍《${ARTS[k].cn}》`))}}
  say(s,`You search the body: ${got.map(x=>x.en).join(', ')}.`,`你从尸身上搜出：${got.map(x=>x.zh).join('、')}。`,'good')}
I({id:'kl_mercy',sys:1,noThread:1,
 text:c=>T(`${c.vn.en} is on the ground, out of breath, your blade at the throat. ${pick(['Nobody else is watching.','The road is empty.','The onlookers have fled.'])} It is up to you.`,`${c.vn.zh}倒在地上，喘着粗气，你的刀就抵在${pick(['他','那人'])}喉咙上。${pick(['四下无人。','路上空荡荡的。','看热闹的早跑光了。'])}怎么处置，全凭你一句话。`),
 opts:[
  {l:T('Finish it','结果了他'),sub:T('One less of his kind in the world, and whatever he carried is yours. Not everyone will see it that way.','世上少一个祸害，他身上的东西也归你。不是人人都这么看。'),
   out:[{t:c=>T(`It is quick. ${c.vn.en} will not trouble anyone again.`,`干脆利落。${c.vn.zh}再也祸害不了谁了。`),c:'bad',fx:(s,c)=>({align:s.align>=40?-1:-3,fame:2,happy:s.align>=40?-2:0,f:s=>{klRec(s,c,'killed');deed(s,`Killed ${c.vn.en}`,`手刃${c.vn.zh}`);klLoot(s,c)}})}]},
  {l:T('Let him go','放他一条生路'),sub:T('Maybe he will change. Maybe he will come back.','也许他会改。也许他会回来。'),
   out:[{t:c=>T(`You step back. ${c.vn.en} stares at you, then runs, and does not look back.`,`你收了刀。${c.vn.zh}愣愣地看了你一眼，扭头就跑，没敢回头。`),c:'muted',fx:(s,c)=>({align:2,f:s=>klRec(s,c,'spared')})}]},
  {l:T('Cripple his martial arts','废了他的武功'),sub:T('He lives, but he will never hurt anyone with his fists again.','留他一命，可他这辈子再也伤不了人。'),
   out:[{t:c=>T(`You break the meridians at his wrists. ${c.vn.en} will live, as an ordinary man.`,`你震断了他手腕上的经脉。${c.vn.zh}能活下去，只是从此成了个普通人。`),c:'muted',fx:(s,c)=>({align:-1,fame:1,f:s=>klRec(s,c,'crippled')})}]},
  {l:T('Drag him to the yamen','押送官府'),if:s=>s.wanted<=0,sub:T('Let the law deal with him. There may be a reward.','交给王法处置。兴许还有赏银。'),
   out:[{t:c=>T(`The magistrate is delighted. ${c.vn.en} goes into a cell, and a purse comes out to you.`,`县太爷大喜。${c.vn.zh}进了大牢，一袋赏银到了你手里。`),c:'good',fx:(s,c)=>({money:rint(20,80),fame:1,align:1,f:s=>klRec(s,c,'jailed')})}]}]});

/* ---------- years later ---------- */
const klFoe=(s,r,m)=>({name:genName('m',null,'jh'),lv:Math.max(5,Math.round(Math.max(r.lv||0,power(s))*m))});
const KL_NEXT={
 killed:['kl_k_son','kl_k_gang','kl_k_bounty','kl_k_widow','kl_k_dream'],
 spared:['kl_s_repay','kl_s_back','kl_s_tip','kl_s_save'],
 crippled:['kl_c_beggar','kl_c_master'],
 jailed:['kl_j_escape','kl_j_free']};
const klC=(s,r,i)=>Object.assign(scene(),{vn:r.n,ri:i,ago:s.age-r.at});
const klDone=(s,c,st)=>{const r=s.kl&&s.kl[c.ri];if(r)r.st=st??9};
const AGO=c=>T(c.ago>1?`${c.ago} years ago`:'last year',c.ago>1?`${cnNum(c.ago)}年前`:'去年');
/* killed */
I({id:'kl_k_son',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A young man blocks your path, sword drawn, hands shaking. “${AGO(c).en} you killed ${c.vn.en}. I am his son.”`,`一个年轻人拔剑拦住了你的去路，手在发抖。“${AGO(c).zh}你杀了${c.vn.zh}。我是他儿子。”`),
 opts:[{l:T('Fight him','跟他打'),fight:(s,c)=>({foe:{name:T(`${c.vn.en}’s son`,`${c.vn.zh}之子`),lv:Math.round(power(s)*.85)+rint(-3,3),fixed:1},stakes:'injury',title:T('A son’s revenge','子报父仇'),cause:T('a son’s revenge','子报父仇')}),
   win:[{t:T('You disarm him and walk away. He shouts after you that he will train ten more years.','你夺下了他的剑，转身走了。他在后头喊，他会再练十年。'),c:'muted',fx:(s,c)=>({f:s=>klDone(s,c,1)})}],
   lose:[{t:T('He beats you, and stands over you, and cannot do it. He leaves you in the road.','他打倒了你，站在你身前，却下不了手。他把你扔在路上走了。'),c:'bad',fx:(s,c)=>({happy:-4,f:s=>klDone(s,c)})}]},
  {l:T('Tell him what his father did','告诉他他父亲做过什么'),out:[
   {w:s=>s.t.wit/3+1,t:T('He listens. He did not know. He lowers the sword and walks away into the evening, a different man.','他听着。他不知道。他放下剑，走进了暮色里，像换了个人。'),c:'good',fx:(s,c)=>({align:2,f:s=>klDone(s,c)})},
   {w:2,t:T('“Liar,” he says, and comes at you anyway.','“你撒谎。”他说完，还是扑了上来。'),c:'bad',fx:(s,c)=>({heal:-8,f:s=>klDone(s,c,1)})}]},
  {l:T('Let him strike once','让他砍一刀'),sub:T('A debt paid in blood, if he will take it.','拿血还这笔账，看他认不认。'),out:[{t:T('He cuts you across the arm, and weeps, and says it is finished. It is.','他在你胳膊上划了一刀，哭了，说这就算了结了。确实了结了。'),c:'muted',fx:(s,c)=>({heal:-10,align:3,fame:2,f:s=>klDone(s,c)})}]}]});
I({id:'kl_k_gang',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`Five men on the road, and one of them was with ${c.vn.en} the day you killed him. They have been waiting.`,`路上站着五个人。其中一个，当年就跟在${c.vn.zh}身边。他们等你很久了。`),
 opts:[{l:T('Fight your way through','杀出一条路'),fight:(s,c)=>({foe:{name:T(`${c.vn.en}’s old gang`,`${c.vn.zh}的旧部`),lv:Math.round(power(s)*1.05)+rint(0,8),fixed:1},stakes:'injury',title:T('The old gang','旧部寻仇'),cause:T('an old gang’s revenge','旧部寻仇')}),
   win:[{t:T('They scatter, leaving their saddlebags. Some of the silver in them was probably stolen from people like you.','他们四散而逃，丢下了鞍袋。里面的银子，多半也是从别人那里抢来的。'),c:'good',fx:(s,c)=>({money:rint(40,120),fame:2,f:s=>klDone(s,c)})}],
   lose:[{t:T('They leave you for dead and take your purse.','他们把你打得半死，抢走了钱袋。'),c:'bad',fx:(s,c)=>({money:-Math.min(s.money,rint(30,100)),f:s=>klDone(s,c)})}]},
  {l:T('Run','跑'),out:[{t:T('You run. They will not forget, but they will not catch you today.','你跑了。他们不会忘，可今天追不上你。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'kl_k_bounty',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A notice at the yamen gate: a reward for ${c.vn.en}, dead or alive. The man you killed ${AGO(c).en} was wanted in three counties.`,`衙门口贴着一张告示：缉拿${c.vn.zh}，生死不论。原来你${AGO(c).zh}杀的那人，三个县都在通缉。`),
 opts:[{l:T('Go in and claim it','进去领赏'),if:s=>s.wanted<=0,out:[{t:T('It takes a week of paperwork and a witness, but the silver is real.','磨了七天公文，找了个证人，银子倒是实打实的。'),c:'good',fx:(s,c)=>({money:rint(80,200),fame:2,f:s=>klDone(s,c)})}]},
  {l:T('Leave it','算了'),out:[{t:s=>s.wanted>0?T('You are wanted yourself. You keep walking.','你自己还在通缉榜上，接着走吧。'):T('You did not do it for silver.','你又不是为了赏银。'),c:'muted',fx:(s,c)=>({align:1,f:s=>klDone(s,c)})}]}]});
I({id:'kl_k_widow',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A woman and a thin child beg at the temple gate. Someone tells you whose widow she is: ${c.vn.en}’s.`,`庙门口有个妇人带着个瘦孩子在讨饭。有人告诉你，她是${c.vn.zh}的遗孀。`),
 opts:[{l:T('Give them silver, without saying who you are','给些银子，不说你是谁'),if:s=>s.money>=30,out:[{t:T('She thanks you over and over. You walk away quickly.','她一遍遍地道谢。你快步走开了。'),c:'muted',fx:(s,c)=>({money:-30,align:3,f:s=>klDone(s,c)})}]},
  {l:T('Take the child in as your disciple','收那孩子为徒'),if:s=>s.age>=25,sub:T('Raise the son of the man you killed. What could go wrong?','把仇人的孩子养大。能出什么事呢？'),out:[{t:T('The mother hesitates, then lets him go with you. He does not know. Not yet.','那母亲犹豫了很久，还是让孩子跟你走了。孩子还不知道。现在还不知道。'),c:'gold',
   fx:(s,c)=>({align:2,f:s=>{const p=mkPerson(s,{rel:'disciple',age:rint(8,12),bond:rint(45,60),lv:rint(3,8)});p.klSon=1;s.people.push(p);if(typeof potOf==='function')p.pot=potOf(p);klDone(s,c)}})}]},
  {l:T('Walk on','走开'),out:[{t:T('You walk on. You think about it that night, and the next.','你走开了。那天夜里你想着这事，第二天夜里也想着。'),c:'muted',fx:(s,c)=>({happy:s.align>=0?-3:0,f:s=>klDone(s,c)})}]}]});
I({id:'kl_k_dream',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`${c.vn.en} has started visiting you in your sleep. Not angry. Just standing there.`,`${c.vn.zh}开始在你梦里出现了。也不发怒，就那么站着。`),
 opts:[{l:T('Burn incense at his grave','去他坟前上炷香'),out:[{t:T('Nobody else has been. You clear the weeds. The dreams stop.','坟前没人来过。你拔了杂草。那些梦就不再来了。'),c:'muted',fx:(s,c)=>({align:1,happy:2,f:s=>klDone(s,c)})}]},
  {l:T('Drink until you sleep without dreaming','喝到睡着就不做梦'),out:[{t:T('It works, more or less, for a while.','管用。大概管用。管用一阵子。'),c:'bad',fx:(s,c)=>({happy:-2,heal:-4,f:s=>klDone(s,c)})}]}]});
/* spared */
I({id:'kl_s_repay',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A respectable-looking man bows to you in the market. It takes you a moment: ${c.vn.en}, the man you spared ${AGO(c).en}. He runs a rice shop now.`,`集上有个体面的人朝你深深一揖。你愣了一下才认出来：是${AGO(c).zh}你饶过的${c.vn.zh}。他如今开了家米铺。`),
 opts:[{l:T('Accept his thanks','受了他的谢'),out:[{t:T('He presses a heavy purse on you and will not take it back. “You gave me my life. This is only silver.”','他硬塞给你一个沉甸甸的钱袋，说什么也不肯收回去。“你给了我一条命，这不过是银子。”'),c:'good',fx:(s,c)=>({money:rint(50,150),happy:3,align:1,f:s=>klDone(s,c)})}]},
  {l:T('Ask him to look after the poor instead','让他拿去接济穷人'),out:[{t:T('He does. For years, the rice shop gives a bowl to anyone who asks, and people say your name when they eat it.','他照做了。那家米铺好些年都给讨饭的人一碗米，人们吃饭时都念着你的名字。'),c:'gold',fx:(s,c)=>({fame:3,align:3,f:s=>klDone(s,c)})}]}]});
I({id:'kl_s_back',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`${c.vn.en} is back, with friends this time, and a grin. “You should have finished it.”`,`${c.vn.zh}回来了，这回带着帮手，还咧着嘴笑。“你当初就该一刀了结我。”`),
 opts:[{l:T('Finish it now','这回了结'),fight:(s,c)=>({foe:{name:T(`${c.vn.en} and his friends`,`${c.vn.zh}一伙`),lv:Math.round(power(s)*1.05)+rint(0,6),fixed:1},stakes:'injury',title:T('He came back','他回来了'),cause:T('a man you once spared','当年饶过的人')}),
   win:[{t:T('You beat them all. This time you do not hesitate.','你把他们全打倒了。这一回，你没有犹豫。'),c:'good',fx:(s,c)=>({fame:2,align:-1,f:s=>klDone(s,c)})}],
   lose:[{t:T('He laughs as he takes your purse. “Now we are even.”','他笑着拿走了你的钱袋。“这下扯平了。”'),c:'bad',fx:(s,c)=>({money:-Math.min(s.money,rint(30,90)),happy:-4,f:s=>klDone(s,c)})}]}]});
I({id:'kl_s_tip',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A note under your door, in bad handwriting: “The men at the Black Pine crossing are waiting for you. Go round. We are even. — ${c.vn.en}”`,`门缝底下塞着一张字条，字写得歪歪扭扭：“黑松岔口有人等着你。绕道走。咱们两清了。——${c.vn.zh}”`),
 opts:[{l:T('Go round','绕道'),out:[{t:T('You go the long way. Later you hear what happened to the next traveller at the crossing.','你绕了远路。后来听说，下一个经过岔口的人出了事。'),c:'good',fx:(s,c)=>({happy:2,f:s=>klDone(s,c)})}]},
  {l:T('Go straight through and deal with them','直接过去收拾他们'),fight:(s,c)=>({foe:{name:T('the men at Black Pine crossing','黑松岔口的埋伏'),lv:Math.round(power(s)*1.1)+rint(0,6),fixed:1},stakes:'injury',title:T('Black Pine crossing','黑松岔口'),cause:T('an ambush at a crossing','岔口伏击')}),
   win:[{t:T('Forewarned, you take them by surprise instead.','你早有防备，反倒打了他们个措手不及。'),c:'good',fx:(s,c)=>({fame:3,money:rint(20,60),f:s=>klDone(s,c)})}],lose:[{t:T('Warned or not, there were too many.','有没有人报信都一样，人太多了。'),c:'bad',fx:(s,c)=>({f:s=>klDone(s,c)})}]}]});
I({id:'kl_s_save',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`You are cornered, hurt, outnumbered, and then someone drops from the roof and evens the odds. It is ${c.vn.en}.`,`你被堵在死角，带着伤，寡不敌众。这时有人从屋顶跳下来，扭转了局面。是${c.vn.zh}。`),
 opts:[{l:T('Thank him','谢他'),out:[{t:T('“A life for a life,” he says, and is gone before you can say anything else.','“一命还一命。”他说完，不等你再开口就走了。'),c:'gold',fx:(s,c)=>({heal:10,happy:4,f:s=>klDone(s,c)})}]},
  {l:T('Ask him to join you','请他留下'),out:[{w:1,t:T('He thinks about it, and stays. Your strangest friendship begins.','他想了想，留下了。你这辈子最古怪的一段交情就此开始。'),c:'gold',fx:(s,c)=>({f:s=>{const p=mkPerson(s,{rel:'friend',age:rint(30,50),bond:rint(55,70),lv:Math.round(power(s)*.7)});const ep=/^「[^」]*」/.test(c.vn.zh),cn=c.vn.zh.replace(/^「[^」]*」/,''),py=ep?c.vn.en.split(' ').slice(-2).join(' '):c.vn.en;if(cn&&cn.length<=4)p.n=Object.assign({},p.n,{cn,py});s.people.push(p);klDone(s,c)}})},
   {w:1,t:T('He laughs. “Me? With you?” And he is gone.','他笑了。“我？跟你？”说完人就不见了。'),c:'muted',fx:(s,c)=>({f:s=>klDone(s,c)})}]}]});
/* crippled */
I({id:'kl_c_beggar',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A beggar with useless hands sits by the bridge. ${c.vn.en}. He recognises you too.`,`桥头坐着个双手无力的乞丐。是${c.vn.zh}。他也认出了你。`),
 opts:[{l:T('Drop some silver in his bowl','往他碗里放些银子'),out:[{t:T('He looks at the silver for a long time. “It was what I deserved,” he says. “But thank you.”','他盯着那些银子看了很久。“我是活该，”他说，“不过，谢谢你。”'),c:'muted',fx:(s,c)=>({money:-15,align:2,f:s=>klDone(s,c)})}]},
  {l:T('Walk past','走过去'),out:[{t:T('He spits after you. You do not turn around.','他冲着你的背影啐了一口。你没回头。'),c:'muted',fx:(s,c)=>({f:s=>klDone(s,c)})}]}]});
I({id:'kl_c_master',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`An old man with a long staff waits at your gate. “I taught ${c.vn.en} everything he knew. You took it from him. Explain.”`,`一位拄着长杖的老人在你门口等着。“${c.vn.zh}的本事都是我教的。你把它废了。说说吧。”`),
 opts:[{l:T('Explain what he was doing with it','说出他拿这本事干了什么'),out:[{w:s=>1+s.t.wit/4,t:T('The old man is silent a long time. Then he bows, and goes.','老人沉默了很久，然后朝你一揖，走了。'),c:'good',fx:(s,c)=>({align:1,f:s=>klDone(s,c)})},
   {w:1,t:T('“That was mine to punish, not yours.” He raises the staff.','“那该由我来罚，轮不到你。”他举起了长杖。'),c:'bad',fx:(s,c)=>({heal:-12,f:s=>klDone(s,c)})}]},
  {l:T('Fight him','跟他打'),fight:(s,c)=>({foe:{name:T(`${c.vn.en}’s master`,`${c.vn.zh}的师父`),lv:Math.round(power(s)*1.2)+rint(0,10),fixed:1},stakes:'injury',title:T('The master','师父上门'),cause:T('a crippled man’s master','被废之人的师父')}),
   win:[{t:T('He lowers the staff. “You are better than he ever was.” He leaves you a book.','他收了长杖。“你比他强多了。”临走留下了一本书。'),c:'gold',fx:(s,c)=>({fame:3,smarts:2,f:s=>klDone(s,c)})}],lose:[{t:T('He breaks your arm, very precisely, and leaves.','他非常精准地打断了你一条胳膊，走了。'),c:'bad',fx:(s,c)=>({f:s=>klDone(s,c)})}]}]});
/* jailed */
I({id:'kl_j_escape',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`News from the county: ${c.vn.en} has broken out of jail. Everyone knows who put him there.`,`县里传来消息：${c.vn.zh}越狱了。谁把他送进去的，人人都知道。`),
 opts:[{l:T('Go after him before he comes after you','先下手为强'),fight:(s,c)=>({foe:{name:c.vn,lv:Math.round(power(s)*1)+rint(0,6),fixed:1},stakes:'injury',title:T('The jailbreak','越狱之后'),cause:T('an escaped prisoner','越狱的犯人')}),
   win:[{t:T('You drag him back yourself. The jailer will not meet your eyes.','你亲手把他押了回去。狱卒都不敢看你。'),c:'good',fx:(s,c)=>({fame:2,money:rint(20,60),f:s=>klDone(s,c)})}],lose:[{t:T('He gets away again, and leaves you a reminder.','他又跑了，还给你留了个记号。'),c:'bad',fx:(s,c)=>({f:s=>klDone(s,c)})}]},
  {l:T('Lie low for a while','先避一避'),out:[{t:T('You keep off the roads until he is caught again, three months later.','你避开大路，直到三个月后他又被抓了回去。'),c:'muted',fx:(s,c)=>({happy:-2,f:s=>klDone(s,c)})}]}]});
I({id:'kl_j_free',sys:1,noThread:1,ctx:s=>({}),
 text:c=>T(`A thin man out of prison clothes stops you in the street: ${c.vn.en}. He served every day of it.`,`街上一个刚换下囚衣的瘦子拦住了你：是${c.vn.zh}。他把刑期一天不少地坐完了。`),
 opts:[{l:T('Hear him out','听他说'),out:[{w:2,t:T('He says the cell was the first time anyone made him stop and think. He wanted you to know.','他说牢里那几年，是头一回有人逼他停下来想想。他想让你知道这个。'),c:'good',fx:(s,c)=>({align:2,happy:3,f:s=>klDone(s,c)})},
   {w:1,t:T('He says he is going to make you pay, slowly. Then he laughs and says he is joking. You are not sure.','他说要让你慢慢偿还。然后又笑着说是开玩笑的。你拿不准。'),c:'muted',fx:(s,c)=>({happy:-2,f:s=>klDone(s,c)})}]}]});
/* each year, one old choice may come back */
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);if(!s.alive||!s.kl||s.jail>0||s.queue.length>2)return r;
  const open=s.kl.map((x,i)=>[x,i]).filter(([x])=>x.st<9&&s.age-x.at>=2&&s.age-x.at<=25);if(!open.length||!chance(.22))return r;
  const [x,i]=pick(open);let ids=KL_NEXT[x.kind]||[];if(x.st===1)ids=x.kind==='killed'?['kl_k_son','kl_k_gang']:ids;const id=pick(ids.filter(k=>INC_BY[k]));if(!id)return r;
  s.klBusy=1;try{runIncident(s,INC_BY[id],klC(s,x,i))}finally{s.klBusy=0}
  if(x.st<1)x.st=x.kind==='killed'&&id==='kl_k_son'?x.st:Math.max(x.st,0);return r}})();
