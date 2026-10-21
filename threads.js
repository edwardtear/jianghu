/* 江湖一生 · consequences: what you choose comes back; fame draws challengers; the people closest to you can betray you */
'use strict';

/* ---------- people from your past, remembered ---------- */
const memOf=c=>c&&c.npc&&c.npc.n?{n:c.npc.n,sex:c.npc.sex,lv:c.npc.lv||worldLv(),age:c.npc.age||30}:null;
function addThread(s,type,c,mem,delay){s.threads=s.threads||[];if(s.threads.length>=5)return;const m=memOf(c);if(!m)return;
  s.threads.push(Object.assign({t:type,due:s.age+(delay||rint(1,6)),at:s.age,mem},m))}
const threadCtx=th=>s=>{const c=scene();c.npc=npc(s,{name:th.n,sex:th.sex,age:Math.max(10,th.age+(s.age-(th.at??s.age))),lv:th.lv});c.th=th;return c};
const ago=(s,th)=>{const n=s.age-(th.at??s.age);return n>0?T(`${n} year${n>1?'s':''} ago: `,`${cnNum(n)}年前，`):T('','')};
const memLine=(s,th)=>{if(th.mem&&th.mem.en){const a=ago(s,th);say(s,`(You remember, ${a.en}${th.mem.en})`,`（往事：${a.zh}${th.mem.zh}）`,'muted')}};

/* a few words of what happens right after a choice, so it does not just stop */
const AFTER={
 good:[['Word of what you did travels faster than you do.','你做的事，比你的脚程传得还快。'],['That night you sleep better than you have in months.','那天夜里，你睡得比几个月来都踏实。'],['Someone in the crowd remembers your face.','人群里有人记住了你的脸。'],['An old woman presses a boiled egg into your hand and will not take it back.','一个老婆婆硬往你手里塞了个煮鸡蛋，怎么也不肯收回。']],
 bad:[['You wash your hands three times that night and they do not feel clean.','那天夜里你洗了三遍手，还是觉得洗不干净。'],['Somebody saw. You are almost sure of it.','有人看见了。你几乎可以肯定。'],['The silver feels heavier in your purse than it should.','钱袋里的银子，沉得不太对劲。'],['A child stares at you in the street, and you look away first.','街上一个孩子盯着你看，你先移开了目光。']],
 win:[['Your knuckles ache for days. You replay every move in your head.','你的指节疼了好几天，脑子里一遍遍过着那几招。'],['By the next market day, the story has grown: you fought five men, not one.','到下个集日，故事已经变了：你一个人打了五个。'],['Your opponent’s eyes, as they went down, stay with you.','对手倒下时的眼神，你一直忘不掉。']],
 lose:[['You lie awake working out what went wrong. You think you know.','你睁眼躺着，琢磨到底哪里错了。你觉得自己想明白了。'],['The bruises fade in a week. The shame takes longer.','伤一个礼拜就消了，丢的脸要久得多。'],['Next time, you tell yourself. Next time.','下一回，你对自己说。下一回。']]
};
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){
  const a0=s.align,m0=s.money,c=q.c;const r=ci(s,q,k);
  if(!c||!c.npc||!c.npc.n||(INC_BY[q.id]&&INC_BY[q.id].noThread)||String(q.id).startsWith('th_'))return r;
  const da=s.align-a0,dm=s.money-m0,fw=c.fightWon;const mem=q.text;
  const nm=c.npc,qt=q.text?(q.text.zh||'')+(q.text.en||''):'',named=!!(nm.zh&&qt.includes(nm.zh))||!!(nm.en&&qt.includes(nm.en));
  const f=c['f'+k],fn=f&&f.foe&&f.foe.name,foeIsNpc=!!fn&&!(f.foe&&f.foe.beast)&&(fn.zh===nm.zh||fn.en===nm.en);
  if(s.age<12||(fw!=null?!foeIsNpc:!named))return r;
  let kind=null;
  if(fw===true){kind='win';if(chance(.18))addThread(s,'grudge',c,mem);else if(chance(.14))addThread(s,'admirer',c,mem)}
  else if(fw===false){kind='lose';if(chance(.28))addThread(s,'rematch',c,mem,rint(2,6))}
  else if(da>=3){kind='good';if(chance(.3))addThread(s,'grateful',c,mem)}
  else if(da<=-4||(dm>=40&&da<0)){kind='bad';if(chance(.3))addThread(s,'grudge',c,mem)}
  if(kind&&s.alive&&chance(.35)){const l=pick(AFTER[kind]);say(s,l[0],l[1],'muted')}
  return r}})();

/* the follow-ups themselves */
I({id:'th_grateful',only:1,noThread:1,text:c=>T(`${c.npc.en} finds you. "You won’t remember me," they say. You do.`,`${c.npc.zh}找到了你。"您大概不记得我了。"你记得。`),
 opts:[{l:T('Ask how they have been','问问近况'),out:[{w:3,t:c=>T(`${c.npc.en} has done well since then and insists on repaying you.`,`${c.npc.zh}这些年过得不错，执意要报答你。`),c:'good',fx:{money:[30,150],meet:'friend',bond:75}},
   {w:1,t:c=>T(`${c.npc.en} has heard of trouble heading your way and came to warn you.`,`${c.npc.zh}听说有人要对你不利，特地赶来报信。`),c:'good',fx:{meet:'friend',bond:80,f:s=>{if(s.wanted>0)s.wanted--;else s.fame+=1}}},
   {w:1,t:c=>T(`${c.npc.en} brings a family heirloom: an old manual they cannot read.`,`${c.npc.zh}带来一件传家之物：一本他们看不懂的旧拳谱。`),c:'gold',fx:{skill:4,qi:3,meet:'friend',bond:75}}]},
  {l:T('Say it was nothing','说不足挂齿'),out:[{t:c=>T(`${c.npc.en} bows deeply. You hear later that they tell the story to everyone.`,`${c.npc.zh}深深一揖。后来你听说，${c.npc.zh}逢人便讲这件事。`),c:'good',fx:{fame:3,align:2}}]}]});
I({id:'th_grudge',only:1,noThread:1,ctx:s=>({}),text:c=>T(`${c.kin.en} stands in your path. "${c.npc.en} was my ${c.rel.en}. You remember what you did."`,`${c.kin.zh}拦住了你的去路。"${c.npc.zh}是我${c.rel.zh}。你做过什么，你自己清楚。"`),
 opts:[{l:T('Fight','动手'),fight:(s,c)=>({foe:{name:c.kin,lv:Math.max(10,Math.round(power(s)*(.85+R()*.35))),fixed:1},stakes:'injury',title:T('An old debt','旧债'),cause:T('revenge for an old wrong','旧怨寻仇')}),
   win:[{t:T('You win, and know this is not the end of it.','你赢了，却知道这事没完。'),c:'muted',fx:{fame:1,f:(s,c)=>{storeNpc(s,{npc:Object.assign(npc(s),{n:{cn:c.kin.zh,py:c.kin.en,sur:['','']}})},'enemy',0)}}}],
   lose:[{t:T('They leave you in the dust and spit beside you. "Now we are even."','对方把你打倒在地，朝旁边啐了一口。"这下两清了。"'),c:'bad'}]},
  {l:T('Apologise and pay (80 taels)','赔礼道歉（八十两）'),cost:80,out:[{w:2,t:T('They take the silver and your bow, and go. It is enough, for them.','对方收下银子，受了你一拜，走了。对他们来说，够了。'),fx:{align:3}},{w:1,t:T('They throw the silver at your feet. "I didn’t come for money."','对方把银子摔在你脚下。"我不是来要钱的。"'),c:'bad',fx:{enemy:1}}]},
  {l:T('Run','跑'),out:[{w:2,t:T('You slip away through the market. You will be looking over your shoulder for a while.','你从集市里溜走了。往后一阵子，你走路都得回头看。'),c:'muted',fx:{happy:-4}},{w:1,t:T('They catch you at the city gate.','对方在城门口追上了你。'),c:'bad',fx:{hurt:[8,20],cause:T('revenge for an old wrong','旧怨寻仇')}}]}]});
INC_BY.th_grudge.ctx=s=>{const th=s._th;const g=genName(chance(.6)?'m':'f',th&&th.n.sur);const rel=pick([T('brother','兄弟'),T('sister','姐妹'),T('father','父亲'),T('master','师父'),T('sworn brother','结义兄弟')]);
  const c=threadCtx(th)(s);c.kin=T(g.py,g.cn);c.rel=rel;return c};
I({id:'th_rematch',only:1,noThread:1,text:c=>T(`${c.npc.en}, who beat you years ago, is drinking in the same inn. They raise their cup to you, smiling.`,`当年打败你的${c.npc.zh}正在同一家客栈喝酒，笑着冲你举了举杯。`),
 opts:[{l:T('Challenge them again','再战一场'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.max(c.npc.lv,Math.round(power(s)*(.9+R()*.25))),fixed:1},stakes:'light',title:T('The rematch','再战'),cause:T('a rematch','再战')}),
   win:[{t:c=>T(`This time you win. ${c.npc.en} laughs, pays for the wine, and calls you a friend.`,`这一回你赢了。${c.npc.zh}哈哈大笑，结了酒钱，认了你这个朋友。`),c:'gold',fx:{fame:3,happy:6,meet:'friend',bond:65}}],
   lose:[{t:c=>T(`${c.npc.en} wins again, more easily than before. You are no longer sure you were ever close.`,`${c.npc.zh}又赢了，比上回还轻松。你开始怀疑自己从来就没追上过。`),c:'bad',fx:{happy:-4,meet:'rival',bond:30}}]},
  {l:T('Raise your cup back','举杯回敬'),out:[{t:T('You drink together and talk about that fight until midnight. It is better than winning.','你们一起喝酒，聊那场架聊到半夜。这比赢还痛快。'),c:'good',fx:{meet:'friend',bond:60,happy:4}}]}]});
I({id:'th_admirer',only:1,noThread:1,text:c=>T(`${c.npc.en}, whom you once defeated, comes to your door with a gift and a bowed head. "Teach me how you did it."`,`曾败在你手下的${c.npc.zh}提着礼物登门，低着头说："请教我，您是怎么做到的。"`),
 opts:[{l:T('Take them on','收下'),if:s=>s.age>=25,out:[{t:c=>T(`${c.npc.en} becomes your student, and the hardest-working one you will ever have.`,`${c.npc.zh}成了你的学生，也是你教过最肯吃苦的一个。`),c:'good',fx:{meet:'disciple',bond:70,fame:2}}]},
  {l:T('Spar with them as an equal','以平辈切磋'),out:[{t:T('You spar every week for a season. You both improve.','你们每周切磋一回，练了一季，两人都有长进。'),c:'good',fx:{skill:2,meet:'friend',bond:65}}]},
  {l:T('Send them away','打发走'),out:[{t:T('They leave the gift on your doorstep anyway.','礼物还是被留在了你门口。'),c:'muted',fx:{money:[5,20]}}]}]});
/* the year’s due threads */
const _yearlyTh=yearly;
yearly=function(s){_yearlyTh(s);if(!s.alive||s.jail>0||!s.threads)return;
  const due=s.threads.filter(t=>t.due<=s.age);if(!due.length)return;const th=due[0];s.threads=s.threads.filter(t=>t!==th);
  const inc=INC_BY['th_'+th.t];if(!inc)return;s._th=th;const c=th.t==='grudge'?inc.ctx(s):threadCtx(th)(s);delete s._th;
  runIncident(s,inc,c);const q=s.queue[s.queue.length-1];
  if(q&&q.id===inc.id&&th.mem&&th.mem.en&&q.text){const a=ago(s,th);q.text=T(`${q.text.en} (You remember, ${a.en}${th.mem.en})`,`${q.text.zh}（往事：${a.zh}${th.mem.zh}）`)}else memLine(s,th)};

/* ---------- fame draws challengers ---------- */
I({id:'fm_challenger',only:1,noThread:1,ctx:s=>{const c=scene();c.foe=foeName();c.lv=Math.max(10,Math.round(power(s)*(.8+R()*.4)));return c},
 text:(c,s)=>T(`${c.foe.en} arrives with a challenge letter. Everyone knows your name now, and beating you would make theirs.`,`${c.foe.zh}递来一封战书。如今江湖上谁都知道你的名字，赢了你，他就出名了。`),
 opts:[{l:T('Accept, in public','当众应战'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv,fixed:1},stakes:'light',title:T('A challenge','挑战'),cause:T('a challenger','挑战者')}),
   win:[{t:T('The crowd roars. Your name grows a little larger, and the next challenger a little hungrier.','围观的人一片叫好。你的名头又大了一点，下一个挑战者也更饿了一点。'),c:'good',fx:{fame:4,happy:3}}],
   lose:[{t:c=>T(`${c.foe.en} wins, and the story is in every teahouse by nightfall.`,`${c.foe.zh}赢了，天黑前这事就传遍了各家茶馆。`),c:'bad',fx:{fame:-6,happy:-6,f:(s,c)=>{storeNpc(s,{npc:Object.assign(npc(s),{n:{cn:c.foe.zh,py:c.foe.en,sur:['','']}})},'rival',30)}}}]},
  {l:T('Send a disciple in your place','派弟子出战'),if:s=>s.people.some(p=>p.alive&&p.rel==='disciple')||(s.org&&s.org.type==='sect'),out:[{w:1,t:T('Your disciple wins. The challenger leaves humbled; your school’s name rises.','你的弟子赢了。挑战者灰溜溜地走了，门下声望大涨。'),c:'good',fx:{fame:2,f:s=>{if(s.org)s.org.rep=clamp(s.org.rep+5,0,100)}}},{w:1,t:T('Your disciple loses. People say the master hid behind the student.','你的弟子输了。人们说师父躲在徒弟后面。'),c:'bad',fx:{fame:-4}}]},
  {l:T('Decline','拒不应战'),out:[{t:T('“Afraid,” they say in the teahouses. Maybe you are just tired.','茶馆里都说你"怕了"。也许你只是累了。'),c:'muted',fx:{fame:-3}}]}]});
I({id:'fm_kickgate',only:1,noThread:1,ctx:s=>{const c=scene();c.foe=foeName();c.lv=Math.max(10,Math.round(power(s)*(.75+R()*.45)));c.hall=pick([T('the Iron Fist Hall','铁拳门'),T('the Five Tigers Gate','五虎门'),T('the Thunder Sword Pavilion','奔雷剑阁'),T('the Black Water Gang','黑水帮')]);return c},
 text:(c,s)=>T(`${c.foe.en} of ${c.hall.en} comes to kick down the gate of ${s.org?s.org.name.en:'your sect'}, with forty men behind them, to take your banner.`,`${c.hall.zh}的${c.foe.zh}带着四十来号人上门踢馆，要摘${s.org?s.org.name.zh:'你们'}的招牌。`),
 opts:[{l:T('Meet them yourself','亲自迎战'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv,fixed:1},stakes:'injury',title:T('Kicking the gate','踢馆'),cause:T('defending your gate','守护山门')}),
   win:[{t:T('Their banner is now nailed to your wall.','对方的旗子如今钉在了你的墙上。'),c:'gold',fx:{fame:5,f:s=>{if(s.org){s.org.rep=clamp(s.org.rep+10,0,100);s.org.members=Math.min(s.org.lv*15,s.org.members+rint(1,3))}}}}],
   lose:[{t:T('They take your banner. Several people leave you that week.','招牌被摘走了。那个礼拜，好几个人离你而去。'),c:'bad',fx:{fame:-5,f:s=>{if(s.org){s.org.rep=clamp(s.org.rep-15,0,100);s.org.members=Math.max(1,s.org.members-rint(1,3))}}}}]},
  {l:T('Pay them to go away (150 taels)','花钱打发（一百五十两）'),cost:150,out:[{t:T('They leave. Everyone knows why.','他们走了。谁都知道为什么。'),c:'muted',fx:{fame:-3,f:s=>{if(s.org)s.org.rep=clamp(s.org.rep-5,0,100)}}}]}]});

/* ---------- betrayal and deception by those closest to you ---------- */
const TRUST={scheming:3,greedy:2,cold:1.4,arrogant:1.2,'a heavy drinker':1.2,devoted:.25,upright:.25,gentle:.5};
function closeOne(s,rels,cond){const ps=s.people.filter(p=>p.alive&&!p.gone&&rels.includes(p.rel)&&p.age>=14&&(!cond||cond(p)));if(!ps.length)return null;
  return wpick(ps,p=>(TRUST[TRAITS[p.trait][0]]||1)*(p.bond<40?2:1))}
const fromP=(s,p)=>{const c=scene();c.npc=npc(s,{name:p.n,sex:p.sex,age:p.age,lv:p.lv});c.pid=p.id;c.p=p;return c};
const betW=rels=>s=>{const ps=s.people.filter(p=>p.alive&&rels.includes(p.rel)&&p.age>=14);if(!ps.length)return 0;return .5*Math.max(...ps.map(p=>(TRUST[TRAITS[p.trait][0]]||1)*(p.bond<40?2:1)))};
const turn=(rel,bond)=>(s,c)=>{const p=c.pid&&person(s,c.pid);if(p){p.rel=rel;p.bond=bond}};
I({id:'bt_loan',age:[18,85],cd:12,w:betW(['friend','sworn','acq','sibling']),when:s=>s.money>=120,ctx:s=>fromP(s,closeOne(s,['friend','sworn','acq','sibling'])),
 text:c=>T(`${c.npc.en} comes to you in a hurry: a sure investment, a sick parent, a debt to dangerous men. They need 100 taels and swear to repay it in a year.`,`${c.npc.zh}急匆匆来找你：说是稳赚的买卖、病重的老娘、欠了不该欠的人。要借一百两，发誓一年内还清。`),
 opts:[{l:T('Lend it','借给他'),out:[{w:s=>2,t:T('A year later, the silver comes back with a jar of good wine as interest.','一年后，银子如数还来，还多了一坛好酒当利息。'),c:'good',fx:{bond:15}},
   {w:(s,c)=>c.p?((TRUST[TRAITS[c.p.trait][0]]||1)*1.5):1.5,t:c=>T(`A year later, ${c.npc.en} has moved away and left no address. The "sick parent" was seen at the gambling den.`,`一年后，${c.npc.zh}搬走了，连个地址也没留。那位"病重的老娘"有人在赌坊见过。`),c:'bad',fx:{money:-100,happy:-6,f:turn('enemy',5)}},
   {w:1,t:c=>T(`${c.npc.en} repays half, and avoids your eyes ever after.`,`${c.npc.zh}只还了一半，从此见了你就躲。`),c:'muted',fx:{money:-50,bond:-20}}],if:s=>s.money>=100},
  {l:T('Refuse','拒绝'),out:[{w:2,t:c=>T(`${c.npc.en} goes cold. "I see what kind of friend you are."`,`${c.npc.zh}脸一沉。"我算看清你是什么朋友了。"`),c:'muted',fx:{bond:-15}},{w:1,t:T('Later you learn the "investment" was a swindle. You were right.','后来你才知道，那桩"买卖"是个骗局。你没借是对的。'),c:'good'}]}]});
I({id:'bt_sellout',age:[18,80],cd:15,w:betW(['sworn','friend']),when:s=>s.wanted>0||s.people.some(p=>p.alive&&p.rel==='enemy')||isEvil(s.sect),ctx:s=>fromP(s,closeOne(s,['sworn','friend'])),
 text:c=>T(`You arrive at the meeting place ${c.npc.en} chose. ${c.npc.en} is not there. Twelve armed men are.`,`你按${c.npc.zh}约的地方赴约。${c.npc.zh}没来，来的是十二个持刀的人。`),
 opts:[{l:T('Fight your way out','杀出去'),fight:(s,c)=>({foe:{name:T('the ambushers','伏兵'),lv:Math.max(12,Math.round(power(s)*(.85+R()*.3))),fixed:1},stakes:'injury',title:T('Betrayed','出卖'),cause:T('an ambush set up by a friend','朋友设下的埋伏')}),
   win:[{t:c=>T(`You cut your way out. One of them, dying, tells you who sold you, and for how much: ${c.npc.en}, for thirty taels.`,`你杀出了重围。一个快死的伏兵告诉你是谁出卖了你、卖了多少：${c.npc.zh}，三十两。`),c:'bad',fx:{fame:2,happy:-10,f:turn('enemy',0)}}],
   lose:[{t:c=>T(`You are beaten and robbed, and lie in the mud thinking about ${c.npc.en}.`,`你被打倒抢光，躺在泥地里，满脑子都是${c.npc.zh}。`),c:'bad',fx:{money:-60,happy:-12,f:turn('enemy',0)}}]}]});
I({id:'bt_disciple',age:[30,95],cd:15,w:betW(['disciple']),ctx:s=>fromP(s,closeOne(s,['disciple'])),
 text:c=>T(`You wake to find your manuals gone, and ${c.npc.en} with them. By noon you hear they have joined a rival school and are teaching your arts as their own.`,`一觉醒来，你的秘籍不见了，${c.npc.zh}也不见了。到中午你才听说，${c.npc.zh}投了对头门下，把你的武功当成自己的在教。`),
 opts:[{l:T('Hunt them down','追回来'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.max(c.npc.lv,Math.round(power(s)*.7)),fixed:1},stakes:'injury',title:T('The faithless student','叛徒'),cause:T('a faithless student','叛出师门的徒弟')}),
   win:[{t:T('You take back the manuals and their right to call you master.','你夺回了秘籍，也收回了他叫你一声师父的资格。'),c:'good',fx:{fame:3,f:turn('enemy',0)}}],
   lose:[{t:T('They have learned more than you knew. You go home with nothing.','对方学到的比你以为的多。你空手而归。'),c:'bad',fx:{fame:-4,happy:-10,f:turn('enemy',0)}}]},
  {l:T('Let them go','由他去'),out:[{t:T('"What I taught will not make them good." You start again with the others.','"我教的东西，不会让他变好。"你接着教剩下的人。'),c:'muted',fx:{qi:3,happy:-6,f:turn('enemy',10)}}]}]});
I({id:'bt_affair',age:[22,75],cd:15,w:s=>{const p=spouseOf(s);return p?(p.bond<45?1.6:.25)*(TRUST[TRAITS[p.trait][0]]||1):0},ctx:s=>fromP(s,spouseOf(s)),
 text:c=>T(`A letter falls out of ${c.npc.en}’s sleeve. It is not from you, and it is not about the weather.`,`${c.npc.zh}袖子里掉出一封信。不是你写的，写的也不是天气。`),
 opts:[{l:T('Confront them','当面质问'),out:[{w:1,t:T('They confess, and cry, and ask for another chance.','对方承认了，哭着求你再给一次机会。'),fx:{bond:-20,happy:-12}},{w:1,t:T('They deny everything so smoothly that you start to doubt the letter.','对方矢口否认，说得天衣无缝，你都开始怀疑那封信了。'),c:'muted',fx:{bond:-10,happy:-8}},{w:1,t:T('They do not deny it. They are leaving anyway.','对方没有否认。反正也要走了。'),c:'bad',fx:{happy:-18,f:turn('ex',10)}}]},
  {l:T('Find the other person','去找那个人'),fight:(s,c)=>({foe:{name:T('the other one','那个人'),lv:Math.max(10,worldLv()),fixed:1},stakes:'injury',title:T('A matter of honour','名誉之争'),cause:T('a jealous fight','争风吃醋')}),
   win:[{t:T('They leave town. Your home is very quiet for a long time.','那人离开了镇子。家里很长一段时间都静悄悄的。'),fx:{bond:-15,happy:-6}}],lose:[{t:T('You lose, and the whole street knows why.','你输了，整条街都知道为什么。'),c:'bad',fx:{fame:-3,happy:-12}}]},
  {l:T('Burn the letter and say nothing','烧了信，什么也不说'),out:[{t:T('You never mention it. It sits between you at every meal.','你从没提起。可它坐在你们每一顿饭中间。'),c:'muted',fx:{happy:-8,bond:-5}}]}]});
I({id:'bt_poison',age:[25,85],cd:25,w:s=>{const p=spouseOf(s);return p&&p.bond<25&&TRAITS[p.trait][0]==='scheming'?1.2:0},ctx:s=>fromP(s,spouseOf(s)),
 text:c=>T(`The soup ${c.npc.en} brings you tastes faintly of almonds. Your hands start to tingle.`,`${c.npc.zh}端来的汤有一股淡淡的杏仁味。你的手开始发麻。`),
 out:[{w:s=>s.t.root+s.qi/20,t:T('You force the poison out with your inner energy, vomiting black blood. When you look up, they are gone.','你运功逼出毒来，吐了一口黑血。等你抬头，人已经不见了。'),c:'bad',fx:{hurt:[15,30],cause:T('poison in the soup','汤里的毒'),f:turn('enemy',0)}},
  {w:3,t:T('You collapse. A neighbour finds you and fetches the doctor just in time. They have fled with the silver.','你倒了下去。邻居发现了你，及时请来了大夫。那人卷了银子跑了。'),c:'bad',fx:{hurt:[25,45],cause:T('poison in the soup','汤里的毒'),money:[-200,-30],f:turn('enemy',0)}}]});
I({id:'bt_lover_spy',age:[16,50],cd:20,w:s=>s.sect&&s.people.some(p=>p.alive&&p.rel==='lover')?.6:0,ctx:s=>fromP(s,s.people.find(p=>p.alive&&p.rel==='lover')),
 text:(c,s)=>T(`You catch ${c.npc.en} copying the map of ${SE(s.sect)}’s secret paths. They were sent to you, from the start.`,`你撞见${c.npc.zh}在偷抄${SZ(s.sect)}秘道的地图。原来从一开始，就是有人派来接近你的。`),
 opts:[{l:T('Turn them in to the sect','交给门派'),out:[{t:T('The elders praise your loyalty. You do not sleep for a week.','长老们夸你忠心。你一个礼拜没合眼。'),c:'muted',fx:{merit:10,happy:-14,f:turn('enemy',0)}}]},
  {l:T('Let them go, and keep quiet','放人走，守口如瓶'),out:[{w:2,t:T('They kiss you once and are gone before dawn. Nobody ever knows.','对方吻了你一下，天亮前就走了。谁也不知道。'),c:'muted',fx:{happy:-10,f:turn('ex',40)}},{w:1,t:T('Someone else saw. You are accused of helping a spy.','还有别人看见了。你被指为私通奸细。'),c:'bad',fx:{merit:-20,happy:-10,f:turn('ex',40)}}]},
  {l:T('Ask them to choose you instead','要对方为你回头'),out:[{w:1,t:T('They burn the map. Whoever sent them will come looking.','对方烧了地图。派他来的人，迟早会找上门。'),c:'gold',fx:{bond:20,enemy:1}},{w:2,t:T('They laugh, not unkindly, and leave.','对方笑了笑，倒也没恶意，转身走了。'),c:'bad',fx:{happy:-12,f:turn('ex',20)}}]}]});
I({id:'bt_steward',age:[25,90],cd:12,w:s=>owned(s,'biz').length||s.org?.8:0,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([5,26,1]),age:rint(30,55)});return c},
 text:(c,s)=>T(`Your accounts do not add up. ${c.npc.en}, who has kept your books for years, has been skimming silver all along.`,`账对不上。替你管了多年账的${c.npc.zh}，一直在偷偷挪钱。`),
 opts:[{l:T('Take them to the magistrate','送官'),out:[{t:T('You get some of it back. The trial is long and humiliating for everyone.','追回了一部分。官司拖得很长，谁脸上都不好看。'),fx:{money:[-150,-40]}}]},
  {l:T('Make them work it off','让他做工抵债'),out:[{w:1,t:T('They work like a mule and become the most honest steward in the province.','他做牛做马，后来成了全省最老实的账房。'),c:'good',fx:{money:[-60,-20],align:3}},{w:1,t:T('They run off in the night with what was left.','他半夜卷着剩下的钱跑了。'),c:'bad',fx:{money:[-250,-80]}}]},
  {l:T('Deal with it the jianghu way','按江湖规矩办'),out:[{t:T('Nobody steals from you again. Nobody looks you in the eye, either.','从此再没人敢偷你的钱。也没人敢正眼看你。'),c:'bad',fx:{align:-8,fame:2,money:[-80,-20]}}]}]});
I({id:'bt_frame',age:[16,70],cd:15,w:betW(['fellow','friend','rival']),ctx:s=>fromP(s,closeOne(s,['fellow','friend','rival'])),
 text:c=>T(`A jade token goes missing, and it is found in your room. ${c.npc.en} is the one who suggested looking there.`,`一块玉佩不见了，结果在你房里搜了出来。提议去你房里找的，正是${c.npc.zh}。`),
 opts:[{l:T('Prove it was planted','证明有人栽赃'),out:[{w:s=>s.smarts/30+1,t:c=>T(`You find the locksmith ${c.npc.en} paid. The truth comes out, and so does ${c.npc.en}’s reputation.`,`你找到了${c.npc.zh}收买的锁匠。真相大白，${c.npc.zh}也身败名裂。`),c:'good',fx:{fame:2,merit:5,f:turn('enemy',0)}},{w:2,t:T('Nobody believes you. The stain stays.','没人信你。污点洗不掉了。'),c:'bad',fx:{fame:-3,merit:-10,wanted:1,f:turn('enemy',5)}}]},
  {l:T('Take the blame quietly','默默认下'),out:[{t:c=>T(`You are punished. Years later ${c.npc.en} confesses, drunk, to someone who tells you.`,`你受了罚。多年后${c.npc.zh}喝醉了说漏嘴，有人把话传给了你。`),c:'muted',fx:{merit:-8,align:3,bond:-30}}]}]});
I({id:'bt_will',age:[20,80],cd:30,once:1,w:s=>!s.people.some(p=>p.alive&&['father','mother'].includes(p.rel))&&s.people.some(p=>p.alive&&p.rel==='sibling')&&family(s).rich>=1?1:0,ctx:s=>fromP(s,closeOne(s,['sibling'])),
 text:c=>T(`At the reading of your parents’ will, ${c.npc.en} produces a second, newer will. It leaves everything to ${c.npc.en}. The handwriting is almost right.`,`宣读爹娘遗嘱时，${c.npc.zh}拿出了一份更新的遗嘱，把家产全留给了自己。字迹只差一点点就像了。`),
 opts:[{l:T('Take it to court','打官司'),out:[{w:s=>1+s.smarts/40,t:T('The forgery is exposed. You get your share, and lose a sibling.','伪造败露。你拿回了自己那份，也失去了一个手足。'),c:'good',fx:{money:[50,300],f:turn('enemy',5)}},{w:1,t:T('The magistrate has been paid. The forgery stands.','县太爷早被打点过了。假遗嘱照样作数。'),c:'bad',fx:{happy:-10,f:turn('enemy',5)}}]},
  {l:T('Let them have it','让给他'),out:[{t:T('Family is family, you tell yourself. You tell yourself that often.','一家人嘛，你对自己说。你常常这样对自己说。'),c:'muted',fx:{happy:-6,align:3,bond:-15}}]}]});
I({id:'bt_master',age:[14,45],cd:30,once:1,w:s=>{const m=masterOf(s);return m&&m.bond<50?.8:0},ctx:s=>fromP(s,masterOf(s)),
 text:c=>T(`Your master, ${c.npc.en}, sends you to deliver a parcel to a rival sect. Halfway there you open it: a forged letter in your hand, accusing you of treason. They needed someone to blame.`,`师父${c.npc.zh}派你给对头门派送一个包裹。半路上你拆开一看：一封仿你笔迹的伪信，坐实你叛门的罪名。师父需要一个替罪羊。`),
 opts:[{l:T('Confront your master before the elders','在长老面前对质'),out:[{w:s=>1+s.fame/30,t:T('The elders believe you. Your master is disgraced, and you are the one they look at now.','长老们信了你。师父身败名裂，众人的目光都落到了你身上。'),c:'gold',fx:{merit:15,fame:3,f:turn('enemy',0)}},{w:2,t:T('They believe your master. You are expelled.','他们信了师父。你被逐出了师门。'),c:'bad',fx:{f:(s,c)=>{turn('enemy',0)(s,c);if(s.sect)leaveSect(s)}}}]},
  {l:T('Burn the letter and disappear','烧信远走'),out:[{t:T('You leave the sect that night and never go back.','你当夜离开门派，再也没回去。'),c:'muted',fx:{f:(s,c)=>{turn('enemy',0)(s,c);if(s.sect)leaveSect(s)}}}]}]});
/* betrayals only happen when there is someone to do the betraying */
['bt_loan','bt_sellout','bt_disciple','bt_frame','bt_will'].forEach(id=>{const i=INC_BY[id],w0=i.when,rels={bt_loan:['friend','sworn','acq','sibling'],bt_sellout:['sworn','friend'],bt_disciple:['disciple'],bt_frame:['fellow','friend','rival'],bt_will:['sibling']}[id];
  i.when=s=>!!closeOne(s,rels)&&(!w0||w0(s))});
INC_BY.bt_affair.when=s=>!!spouseOf(s);INC_BY.bt_poison.when=s=>!!spouseOf(s);INC_BY.bt_lover_spy.when=s=>!!s.sect&&s.people.some(p=>p.alive&&p.rel==='lover');INC_BY.bt_master.when=s=>!!masterOf(s);
/* fame and your house bring challengers, betrayal finds the trusting */
const _yearlyFm=yearly;
yearly=function(s){_yearlyFm(s);if(!s.alive||s.jail>0||s.age<16||s.retired)return;
  if(s.fame>=30&&chance(Math.min(.35,(s.fame-20)/250)))runIncident(s,INC_BY.fm_challenger);
  else if(s.org&&s.org.type==='sect'&&s.org.rep>=40&&chance(Math.min(.25,s.org.rep/400)))runIncident(s,INC_BY.fm_kickgate)};
