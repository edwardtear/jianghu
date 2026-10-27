/* 江湖一生 · 相处: spend time with someone, and let the day decide what happens. What you end up doing depends on who they
   are (parent, child, spouse, lover, friend, fellow disciple, master), what they do for a living, their temperament, the
   season, and how things stand between you. They speak in their own voice (talk.js), the same line does not come back
   twice in a row, and the outcome is not fixed: most days bring you closer, some bring a small gain, a few go wrong. */
'use strict';
const HSEA=(s)=>typeof seasonOn==='function'&&seasonOn(s)?(s.season|0):[0,1,2,3][s.age%4];
const isAdult=p=>p.age>=16;
const HV=(p,en,zh,tone)=>voice(p,T(en,zh),tone);
/* each scene: when it fits, how likely, and what happens */
const HANG=[
 {id:'meal',w:(s,p)=>3,f:(s,p)=>{const k=HSEA(s);const dish=[[T('spring bamboo shoots','春笋'),T('the first greens of the year','头茬野菜')],[T('cold mung-bean soup','冰镇绿豆汤'),T('watermelon cooled in the well','井里镇过的西瓜')],[T('river crabs','河蟹'),T('mooncakes left over from the festival','节后剩下的月饼')],[T('a mutton hotpot','羊肉锅子'),T('hot wine and roast chestnuts','热酒和糖炒栗子')]][k];const d=pick(dish);
   const drink=isAdult(p)&&s.age>=16&&(tkTrait(p)==='a heavy drinker'||chance(.4));
   const q=tkPick(s,p,'hm',drink?[[`One more cup. Just one. You said that last time too.`,`再来一杯，就一杯。你上回也是这么说的。`],[`The wine is better when someone is listening.`,`有人听着，酒才好喝。`],[`To nothing in particular. Those are the best toasts.`,`不为什么，干了。这种酒最好喝。`]]:[[`You have not been eating properly. I can tell.`,`你没好好吃饭，我看得出来。`],[`Try this. No, try it first, then make a face.`,`尝尝这个。别，先尝，再皱眉。`],[`This is the first meal I have enjoyed in a month.`,`这是我一个月来吃得最香的一顿。`]]);
   return{l:[T(`You share ${d.en}${drink?' and a jug of wine':''} with ${p.n.py}.`,`你和${p.n.cn}一起吃${d.zh}${drink?'，还喝了一壶酒':''}。`),HV(p,q[0],q[1])],bond:rint(3,7),happy:2}}},
 {id:'outing',w:(s,p)=>s.age>=6?2.5:0,f:(s,p)=>{const k=HSEA(s);const o=pick([[T('fly a kite on the river bank','在河堤上放风筝'),T('walk among the peach blossom','去桃林里走走')],[T('row a boat out among the lotus','划船钻进荷叶深处'),T('sit by the well in the evening cool','傍晚坐在井边纳凉')],[T('climb the hill to look at the maples','爬上山看枫叶'),T('watch the harvest moon from a roof','爬上屋顶赏月')],[T('walk through new snow','踩着新雪走一走'),T('sit by a fire and roast sweet potatoes','围着火盆烤红薯')]][k]);
   const q=tkPick(s,p,'ho',[[`We should do this more often.`,`咱们该常这样。`],[`I had forgotten this place was here.`,`我都忘了还有这么个地方。`],[`Do not tell anyone I enjoyed this.`,`别跟人说我玩得挺高兴。`],[`When we are old, this is what I will remember.`,`等老了，我记得的就是这样的日子。`]]);
   return{l:[T(`You and ${p.n.py} ${o.en}.`,`你和${p.n.cn}${o.zh}。`),HV(p,q[0],q[1])],bond:rint(4,8),happy:3}}},
 {id:'work',w:(s,p)=>isAdult(p)&&s.age>=10?2:0,f:(s,p)=>{const g=p.age>=65?'elder':OCC_GROUP(p.occ)||'labour';
   const W={trade:[T(`You help ${p.n.py} count stock and argue with a customer.`,`你帮${p.n.cn}盘货，还替${p.n.cn}跟客人讨了半天价。`),{money:rint(3,15)}],martial:[T(`${p.n.py} drills you with the youngsters until your arms shake.`,`${p.n.cn}拉你跟后生们一起操练，练得你胳膊直抖。`),{skill:.6}],
    scholar:[T(`You help ${p.n.py} copy out an old book by lamplight.`,`你在灯下帮${p.n.cn}抄一本旧书。`),{smarts:1}],religious:[T(`You sweep the temple courtyard with ${p.n.py} at dawn.`,`天刚亮，你陪${p.n.cn}扫庙前的院子。`),{happy:3}],
    labour:[T(`You spend a day working beside ${p.n.py}. Your back will remember it.`,`你陪${p.n.cn}干了一整天活。你的腰会记得这一天。`),{money:rint(2,8)}],entertain:[T(`You hold the lantern while ${p.n.py} rehearses until midnight.`,`${p.n.cn}排戏排到半夜，你一直替${p.n.cn}掌着灯。`),{happy:3}],
    official:[T(`You help ${p.n.py} sort a mountain of case files.`,`你帮${p.n.cn}整理堆成山的案卷。`),{smarts:1}],doctor:[T(`You grind herbs for ${p.n.py} all afternoon.`,`你给${p.n.cn}碾了一下午的药。`),{heal:4}],
    rich:[T(`${p.n.py} drags you to a banquet full of people you do not like.`,`${p.n.cn}硬拉你去赴一场宴，满座都是你不喜欢的人。`),{happy:-1,money:0}],beggar:[T(`You sit with ${p.n.py} by the temple gate and share what you have.`,`你陪${p.n.cn}坐在庙门口，把手头的吃食分了。`),{align:1}],
    elder:[T(`You sit with ${p.n.py} while ${tkP(p).he} tells the same story as last time, with a new ending.`,`你陪${p.n.cn}坐着，听${tkP(p).ta}把上回那个故事又讲了一遍，结尾却换了。`),{happy:2}]};
   const w=W[g]||W.labour;return{l:[w[0]],bond:rint(3,6),fx:w[1]}}},
 {id:'train',w:(s,p)=>(p.lv>=15||OCC_GROUP(p.occ)==='martial'||p.rel==='fellow'||p.rel==='master')&&s.age>=8&&p.age>=8&&p.age<75?2.5:0,f:(s,p)=>{const stronger=p.lv>power(s);
   const q=tkPick(s,p,'ht',stronger?[[`Your feet. Always your feet.`,`脚下。永远是脚下的毛病。`],[`Again. Slower. Now faster.`,`再来。慢一点。现在快一点。`],[`Not bad. Do not let it go to your head.`,`还行。别让这两个字冲昏了头。`]]:[[`You have improved. I hate it.`,`你长进了。我恨死了。`],[`Show me that again. Where did you learn it?`,`那一招再来一遍。你从哪儿学的？`],[`One day I will beat you. Not today.`,`总有一天我会赢你。不是今天。`]]);
   return{l:[T(`You train together with ${p.n.py} until both of you are soaked.`,`你和${p.n.cn}一起练功，练到两人都浑身湿透。`),HV(p,q[0],q[1])],bond:rint(3,6),fx:{skill:stronger?1:.5}}}},
 {id:'heart',w:(s,p)=>p.bond>=55&&p.age>=12?2.2:0,f:(s,p)=>{const q=tkPick(s,p,'hh',[[`Sometimes I think I chose the wrong life. Then I see people like you and think, no.`,`有时候我觉得自己选错了活法。可一看到你这样的人，又觉得没错。`],[`I have never told anyone this. When I was small, I was afraid of the dark. I still am.`,`这话我没跟人说过。我小时候怕黑。现在也怕。`],[`I worry about you. There. I said it.`,`我担心你。好了，说出来了。`],[`If anything happens to me, look after the people I leave behind.`,`要是我有个三长两短，替我照看留下的人。`],[`I am happier than I look. I just do not show it.`,`我比看上去要快活。只是不爱露出来。`]]);
   return{l:[T(`Late at night, ${p.n.py} says something ${tkP(p).he} has never said before.`,`夜深了，${p.n.cn}说了一句从没说过的话。`),HV(p,q[0],q[1],'care')],bond:rint(6,10),happy:3}}},
 {id:'gossip',w:(s,p)=>p.age>=12&&living(s).filter(o=>o.id!==p.id&&!o.gone&&o.age>=12).length?1.8:0,f:(s,p)=>{const o=pick(living(s).filter(o=>o.id!==p.id&&!o.gone&&o.age>=12));const good=p.bond>40&&chance(.6);
   const q=good?tkPick(s,p,'hg',[[`${o.n.py}? A good sort. Hides it well.`,`${o.n.cn}？是个好人。藏得挺深。`],[`I saw ${o.n.py} help an old woman with her cart. Do not tell ${PRON[o.sex].him} I saw.`,`我看见${o.n.cn}帮一个老太太推车。别告诉${PRON[o.sex].ta}我看见了。`]]):tkPick(s,p,'hb',[[`${o.n.py} owes half the street money, you know.`,`你知道吗，${o.n.cn}欠了半条街的钱。`],[`I do not trust ${o.n.py}. Call it a feeling.`,`我信不过${o.n.cn}。说不上来，就是感觉。`]]);
   return{l:[T(`You and ${p.n.py} end up talking about ${o.n.py}.`,`你和${p.n.cn}聊着聊着，说到了${o.n.cn}。`),HV(p,q[0],q[1])],bond:rint(2,5),fx:{f:()=>addBond(o,good?2:-2)}}}},
 {id:'family',w:(s,p)=>['father','mother','child','sibling','grandparent','spouse'].includes(p.rel)?3:0,f:(s,p)=>{const r=p.rel,kid=p.age<16;
   const L=r==='father'||r==='mother'||r==='grandparent'?(p.age>=60?[[`Sit. Let me look at you. You are thinner.`,`坐下，让我好好看看你。瘦了。`],[`When are you going to settle down? I am only asking. Every time.`,`你什么时候成家？我就问问。每回都问。`],[`I was not much older than you when I had you. I was terrified.`,`我生你的时候，也没比你现在大多少。吓得要命。`]]:[[`Eat. You never eat when you are here.`,`吃。你一回来就不吃饭。`],[`Your old room is the same. I kept it.`,`你那间屋子还是老样子，我一直留着。`],[`Tell me everything. Leave out the parts that would worry me.`,`都跟我说说。叫我担心的那些就别说了。`]]):
    r==='child'?(kid?[[`Can I come with you next time? Please? I will be quiet. Mostly.`,`下回带我去好不好？求你了，我会很安静的。大概吧。`],[`I drew you. This is your sword. This is a dragon. You are winning.`,`我画了你。这是你的剑，这是一条龙。你赢了。`],[`Why do grown-ups never climb trees?`,`为什么大人都不爬树？`]]:[[`I am not a child any more. I just still like it when you visit.`,`我不是小孩子了。只是你来看我，我还是高兴。`],[`I met someone. Do not make that face.`,`我认识了一个人。别摆出那种脸。`],[`I want to make my own way. Like you did.`,`我想自己闯出一条路来。像你当年那样。`]]):
    r==='spouse'?[[`The roof needs fixing and so do you. Sit down.`,`屋顶要修，你也要修。坐下。`],[`I married you for your face. I stayed for the rest.`,`当初嫁给你是图你的模样，后来留下，是因为别的。`],[`Do not go away so long next time.`,`下回别走这么久。`]]:
    [[`Remember when we broke Mother’s jar and blamed the cat?`,`还记得咱们打碎了娘的坛子，赖到猫身上吗？`],[`You were always the lucky one. I do not mind. Much.`,`你从小运气就好。我不在乎。不太在乎。`],[`Whatever happens, we are still family.`,`不管出什么事，咱们还是一家人。`]];
   const q=tkPick(s,p,'hf'+r,L);return{l:[T(`You spend the day at home with ${p.n.py}.`,`你在家陪了${p.n.cn}一整天。`),HV(p,q[0],q[1])],bond:rint(4,8),happy:3}}},
 {id:'romance',w:(s,p)=>['lover','spouse'].includes(p.rel)?3:0,f:(s,p)=>{const k=HSEA(s);const sc=pick([[T('under the plum blossom','在梅花底下'),T('in the willow rain','在杨柳细雨里')],[T('on a boat under the lotus leaves','在荷叶下的小船上'),T('watching fireflies','一起看萤火虫')],[T('on a hill under the full moon','在满月下的山坡上'),T('among the falling leaves','在满地落叶里')],[T('by the stove while snow falls','下雪天守着炉子'),T('walking home through the lantern-lit streets','提着灯笼走回家')]][k]);
   const q=tkPick(s,p,'hr',[[`Stay. Just a little longer.`,`别走。再待一会儿。`],[`I thought about you every day. Every single one.`,`我每天都在想你。每一天。`],[`If you laugh at me, I will push you in the river.`,`你要是笑我，我就把你推下河。`],[`I am glad it is you.`,`幸好是你。`]]);
   return{l:[T(`You spend an evening with ${p.n.py} ${sc.en}.`,`你和${p.n.cn}${sc.zh}度过了一个晚上。`),HV(p,q[0],q[1])],bond:rint(5,10),happy:5}}},
 {id:'quarrel',w:(s,p)=>{const hard=['arrogant','cold','scheming','bold'].includes(tkTrait(p));return p.bond<20?1.5:(p.bond<40&&hard)?1.2:0},f:(s,p)=>{const q=tkPick(s,p,'hq',[[`You only come when you want something.`,`你只有用得着我的时候才来。`],[`Do not tell me what I should have done.`,`别跟我说我该怎么做。`],[`You have changed, and not for the better.`,`你变了，没变好。`],[`I am tired. Can we not do this today?`,`我累了。今天能不吵吗？`]]);
   const mend=chance(.4);return{l:[T(`A small thing turns into an argument with ${p.n.py}.`,`一件小事，和${p.n.cn}吵了起来。`),HV(p,q[0],q[1]),mend?T(`By evening, you have both apologised, more or less.`,`到了晚上，两人都算是赔了个不是。`):T(`You leave without finishing your tea.`,`你茶没喝完就走了。`)],bond:mend?rint(0,2):-rint(3,7),happy:mend?0:-2,c:mend?'muted':'bad'}}},
 {id:'favour',w:(s,p)=>isAdult(p)&&p.bond>=30?1.2:0,f:(s,p)=>{const amt=rint(5,30);const can=s.money>=amt;const q=tkPick(s,p,'hv',[[`I hate to ask. I am asking anyway.`,`我实在不想开口，可还是得开口。`],[`It is only until the harvest. Probably.`,`就借到秋收。大概吧。`]]);
   return{l:[HV(p,q[0],q[1]),can?T(`You lend ${p.n.py} ${amt} taels.`,`你借给${p.n.cn}${amt}两。`):T(`You cannot spare it, and say so. ${p.n.py} understands, mostly.`,`你手头也紧，就直说了。${p.n.cn}大体上能体谅。`)],bond:can?rint(5,9):-1,fx:can?{money:-amt}:{}}}},
 {id:'talk',w:(s,p)=>p.talked!==s.age&&PACT_BY.chat?2:0,f:(s,p)=>{PACT_BY.chat.run(s,p);return{l:[],bond:0,done:1}}}];
/* spend time together: the day picks the scene */
function hangOut(s,p){const fresh=p.hangT===tIdx(s);const pool=HANG.filter(h=>h.w(s,p)>0);const h=wpick(pool,x=>x.w(s,p))||HANG[0];
  const r=h.f(s,p);p.hangT=tIdx(s);if(r.done)return;
  r.l.forEach((t,i)=>say(s,t.en,t.zh,i===0?(r.c||''):(r.c==='bad'?'bad':'')));
  const b=fresh&&r.bond>0?Math.ceil(r.bond/2):r.bond;if(b)addBond(p,b);if(r.happy)happy(s,r.happy);
  if(r.fx)applyFx(s,r.fx,{});
  if(fresh&&r.bond>0)say(s,`(You have already spent time with ${p.n.py} this season; it means a little less.)`,`（这一季已经陪过${p.n.cn}了，这回情分涨得少些。）`,'muted')}
PACTS.unshift({id:'hang',n:T('Spend time together','相处'),if:(s,p)=>s.age>=4&&p.age>=2&&!hostile(p)&&p.rel!=='ex',run:(s,p)=>hangOut(s,p)});
PACT_BY.hang=PACTS[0];
/* the older of the two 'become friends' actions goes: one is enough */
{const i=PACTS.findIndex(a=>a.id==='befriend'&&a.n&&a.n.zh==='交个朋友');if(i>=0)PACTS.splice(i,1)}
/* which actions are everyday ones, kept under 更多 on a person's page */
const PACT_MINOR=new Set(['chat','gift','spar','teach','money','date','ask','spy','avoid']);
/* no picking a quarrel on purpose: arguments only happen in 相处, and only when the bond is poor (or the temperament difficult and the bond middling) */
{const i=PACTS.findIndex(a=>a.id==='argue');if(i>=0)PACTS.splice(i,1)}
