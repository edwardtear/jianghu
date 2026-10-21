/* 江湖一生 · people are not vending machines: what you do with someone lands differently depending on who they are and how things
   stand between you, and the people in your life bring their own troubles, favours and secrets to your door */
'use strict';
const TR=p=>TRAITS[p.trait][0];
const PN=p=>T(p.n.py,p.n.cn);
function relDie(s,p){if(!p||!p.alive)return;p.alive=false;p.diedAt=s.age;p.cause=T('a long illness','久病不愈');p.causeSet=1;onDeath(s,p)}
const near=s=>s.people.filter(p=>p.alive&&!p.temp&&!p.gone);

/* ---------- interactions with uncertain outcomes ---------- */
function relWrap(id,fn){const a=PACT_BY[id];if(!a)return;const r0=a.run;a.run=function(s,p){if(fn(s,p,r0)===false)r0.call(a,s,p);maybeRelEvent(s,p,.15)}}
relWrap('chat',(s,p,r0)=>{if(p.talked===s.age)return false;const r=R();const tr=TR(p);
  if(r<.12+(tr==='cold'?.1:0)){p.talked=s.age;addBond(p,-rint(2,5));say(s,`You say something that ${p.n.py} takes the wrong way. The talk goes cold.`,`你说了句话，${p.n.cn}听岔了，气氛一下子冷了。`,'muted');return}
  if(r<.24&&p.bond>=50){p.talked=s.age;addBond(p,rint(7,12));happy(s,3);say(s,`What starts as small talk with ${p.n.py} turns into the best conversation you have had in years.`,`本来只是和${p.n.cn}随便聊聊，结果聊成了这几年最痛快的一回。`,'good');if(chance(.5))relEvent(s,p,'confide');return}
  return false});
relWrap('gift',(s,p)=>{pay(s,-20);const tr=TR(p),r=R();
  if((tr==='upright'||tr==='cold')&&r<.3){addBond(p,-2);say(s,`${p.n.py} refuses the gift. "Between us there is no need for this."`,`${p.n.cn}没收。"你我之间，用不着这个。"`,'muted');pay(s,20);return}
  if(tr==='greedy'&&r<.35){addBond(p,rint(2,5));say(s,`${p.n.py} weighs the gift in one hand and looks at you as if expecting more.`,`${p.n.cn}掂了掂礼物，看你的眼神像是还在等下文。`,'muted');return}
  if(r<.15){addBond(p,1);say(s,`${p.n.py} already has one exactly like it, and is too polite to say so. Almost.`,`${p.n.cn}已经有一件一模一样的，客气得没好意思说。差一点就说了。`,'muted');return}
  if(r<.32){addBond(p,rint(14,20));happy(s,2);say(s,`It is exactly what ${p.n.py} needed, though you could not have known. ${PRON[p.sex].He} is moved.`,`这正是${p.n.cn}眼下最需要的，你本不可能知道。${PRON[p.sex].ta}很感动。`,'good');return}
  addBond(p,rint(5,12));say(s,`${p.n.py} is pleased with the gift.`,`${p.n.cn}很喜欢你送的礼物。`,'good')});
relWrap('date',(s,p)=>{const r=R();
  if(r<.15){addBond(p,-rint(3,6));happy(s,-2);say(s,`The evening goes wrong from the first word. You walk home in two separate silences.`,`从第一句话起就不对劲。回家路上，两个人各自沉默。`,'bad');return}
  if(r<.27){addBond(p,rint(1,4));say(s,`It rains on the boat, the lanterns go out, and you both laugh until you cannot breathe.`,`船上下起了雨，河灯全灭了，你们笑得喘不过气。`,'good');return}
  if(r<.35&&p.rel==='lover'){relEvent(s,p,'jealous');return}
  return false});
relWrap('befriend',(s,p)=>{const ch=clamp(.35+(p.bond-55)/50+(TR(p)==='cheerful'||TR(p)==='bold'?.15:0)-(TR(p)==='cold'?.2:0),.15,.95);
  if(chance(ch)){p.rel='friend';say(s,`You and ${p.n.py} are friends now.`,`你和${p.n.cn}成了朋友。`,'good')}
  else{addBond(p,-2);say(s,`${p.n.py} is friendly enough, but keeps a little distance. Not yet, it seems.`,`${p.n.cn}待你还算客气，却总隔着一点距离。看来时候未到。`,'muted')}});
relWrap('argue',(s,p,r0)=>{const r=R();
  if(r<.2&&p.bond>=40){addBond(p,rint(2,6));say(s,`You shout it all out, and afterwards, strangely, things are better between you.`,`你们把话全吼了出来。说来奇怪，吵完之后反倒好了。`,'good');return}
  if(r<.32&&p.age>=14&&!family_(p)){const f=fightLife(s,{name:PN(p),lv:p.lv,fixed:1},{stakes:'light',title:T('Words become blows','话不投机'),cause:T('a quarrel that came to blows','口角动手')});addBond(p,-rint(10,20));if(p.bond<10&&chance(.5)){p.rel='enemy';say(s,`After that, ${p.n.py} counts you an enemy.`,`从此${p.n.cn}把你当成了仇人。`,'bad')}return}
  return false});

/* ---------- the people in your life bring their own stories ---------- */
function relEvent(s,p,k){const inc=INC_BY['rl_'+k];if(!inc||!p)return false;(s.relCd=s.relCd||{})[k]=s.age;const c=Object.assign(scene(),inc.ctx?inc.ctx(s):{});c.pid=p.id;c.p=p;c.npc=Object.assign(npc(s),{en:p.n.py,zh:p.n.cn,n:p.n,sex:p.sex,he:PRON[p.sex].he,ta:PRON[p.sex].ta});runIncident(s,inc,c);return true}
function relKinds(s,p){const k=[];const r=p.rel;
  if(['friend','sworn','acq','fellow'].includes(r)){if(s.age>=16&&p.age>=16)k.push('loan','trouble','confide');if(p.bond<45)k.push('drift')}
  if(['father','mother'].includes(r)&&p.age>=55)k.push('ill');
  if(['father','mother'].includes(r)&&s.age>=18&&s.age<=32&&!spouseOf(s))k.push('nag');
  if(r==='sibling'&&p.age>=16&&s.age>=16)k.push('loan','sibmatch');
  if(['lover','spouse'].includes(r))k.push('jealous','spousewish');
  if(r==='child'&&p.age>=6&&p.age<=17)k.push('childtrouble');
  if(r==='master')k.push('mastertest');
  if(r==='disciple')k.push('discipleq');
  if(r==='rival')k.push('rivalnews');
  /* the same kind of trouble does not come round again for some years */
  const cd=s.relCd||{};return k.filter(x=>INC_BY['rl_'+x]&&s.age-(cd[x]??-99)>=(x==='loan'?10:7))}
function maybeRelEvent(s,p,ch){if(!s.alive||s.queue.length>2||!chance(ch))return;const ks=relKinds(s,p);if(ks.length)relEvent(s,p,pick(ks))}
/* about once in three years somebody close needs something from you */
const _yearlyRel=yearly;
yearly=function(s){_yearlyRel(s);if(!s.alive||s.jail>0||s.age<8||s.queue.length>2||!chance(.25))return;
  const ps=near(s).filter(p=>relKinds(s,p).length&&!hostile(p));if(!ps.length)return;const p=wpick(ps,p=>1+p.bond/30);maybeRelEvent(s,p,1)};

const RT=['rel'];
I({id:'rl_loan',only:1,tags:RT,ctx:s=>({amt:rint(3,12)*10}),
 text:c=>T(`${c.npc.en} comes to you, embarrassed, needing ${c.amt} taels. "I will pay you back by autumn. I swear it."`,`${c.npc.zh}不好意思地找上门，要借${c.amt}两。"秋天一定还，我发誓。"`),
 opts:[{l:T('Lend it','借钱给对方'),if:(s,c)=>s.money>=c.amt,out:[{w:(s,c)=>TR(c.p)==='upright'||TR(c.p)==='devoted'?5:3,t:c=>T(`${c.npc.en} pays it back on the first day of autumn, with a jar of wine as interest.`,`立秋那天，${c.npc.zh}把钱还了，还捎了一坛酒当利息。`),c:'good',fx:{bond:10,f:(s,c)=>{}}},
   {w:(s,c)=>TR(c.p)==='greedy'||TR(c.p)==='scheming'?4:1.5,t:c=>T(`Autumn comes and goes. ${c.npc.en} starts crossing the street when they see you.`,`秋天过去了。${c.npc.zh}远远看见你就绕道走。`),c:'bad',fx:{bond:-15,f:(s,c)=>pay(s,-c.amt)}},
   {w:1,t:c=>T(`${c.npc.en} cannot pay, and is so ashamed that you forgive the debt. It costs you the silver and wins you something better.`,`${c.npc.zh}还不上，羞愧得不行。你把债免了，丢了银子，换来更好的东西。`),c:'muted',fx:{bond:18,f:(s,c)=>pay(s,-c.amt)}}]},
  {l:T('Give it, not lend it','送给对方，不用还'),if:(s,c)=>s.money>=c.amt,out:[{w:3,t:c=>T(`${c.npc.en} will not forget this.`,`${c.npc.zh}不会忘记这件事。`),c:'good',fx:{bond:20,align:2,f:(s,c)=>pay(s,-c.amt)}},{w:1,t:c=>T(`${c.npc.en} takes it, and is back next year asking for more.`,`${c.npc.zh}收下了，第二年又来借了。`),c:'muted',fx:{bond:8,f:(s,c)=>pay(s,-c.amt)}}]},
  {l:T('Refuse','回绝'),out:[{w:2,t:c=>T(`${c.npc.en} says they understand. They do not quite.`,`${c.npc.zh}说能理解。其实不太能。`),c:'muted',fx:{bond:-8}},{w:1,t:c=>T(`${c.npc.en} gets the money elsewhere, from people you would not borrow from.`,`${c.npc.zh}从别处借到了钱，借的是你绝不会去借的那种人。`),c:'muted',fx:{bond:-5}}]}]});
/* the person who comes is the person you know */
I({id:'rl_trouble',only:1,tags:RT,ctx:s=>({foe:foeName(),lv:PW(.95,4)(s)}),
 text:c=>T(`${c.npc.en} is in trouble: ${c.foe.en} says ${c.npc.en} owes a gambling debt and has given three days to pay, or lose a hand.`,`${c.npc.zh}惹上了麻烦：${c.foe.zh}说${c.npc.zh}欠了一笔赌债，限三天还清，不然剁一只手。`),
 opts:[{l:T('Face the creditor','去会会债主'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv},stakes:'light',title:T('A friend’s debt','朋友的赌债'),cause:T('a friend’s gambling debt','替友出头')}),
   win:[{w:3,t:c=>T(`The creditor tears up the note. ${c.npc.en} cannot stop thanking you.`,`债主把借据撕了。${c.npc.zh}千恩万谢。`),c:'good',fx:{bond:15,fame:1}},{w:1,t:c=>T(`You win, and then learn the debt was real and ${c.npc.en} lied to you about it.`,`你赢了，事后才知道那笔债是真的，${c.npc.zh}对你撒了谎。`),c:'muted',fx:{bond:-6,align:-1}}],
   lose:[{t:c=>T(`You both end up beaten. ${c.npc.en} pays in the end, and blames you a little.`,`你们俩都挨了打。最后还是${c.npc.zh}还了钱，还有点怪你。`),c:'bad',fx:{bond:-3}}]},
  {l:T('Pay it off (60 taels)','替对方还了（六十两）'),cost:60,out:[{w:3,t:c=>T(`The debt is cleared. ${c.npc.en} swears never to gamble again.`,`债清了。${c.npc.zh}发誓再也不赌。`),c:'good',fx:{bond:12}},{w:1,t:c=>T(`The debt is cleared. Within a year ${c.npc.en} is back at the tables.`,`债清了。不到一年，${c.npc.zh}又上了赌桌。`),c:'muted',fx:{bond:5}}]},
  {l:T('It is their own mess','自作自受，不管'),out:[{w:2,t:c=>T(`${c.npc.en} finds the money somehow. Things are never quite the same between you.`,`${c.npc.zh}不知从哪弄到了钱。你们之间再也回不到从前。`),c:'muted',fx:{bond:-12}},{w:1,t:c=>T(`${c.npc.en} loses two fingers. You hear about it later.`,`${c.npc.zh}丢了两根手指。你是后来才听说的。`),c:'bad',fx:{bond:-20,happy:-4}}]}]});
I({id:'rl_confide',only:1,tags:RT,ctx:s=>({sec:pick([0,1,2,3])}),
 text:c=>[T(`Late one night ${c.npc.en} tells you a secret: years ago they ran from a sect, and someone is still looking for them.`,`一天深夜，${c.npc.zh}告诉你一个秘密：多年前曾叛出一个门派，至今还有人在找。`),T(`${c.npc.en} confesses they are in love with someone already married.`,`${c.npc.zh}向你坦白：自己爱上了一个有夫之妇（或有妇之夫）。`),T(`${c.npc.en} admits they took money from the place they work, meaning to put it back, and cannot.`,`${c.npc.zh}承认挪用了东家的钱，本想还上，却还不上了。`),T(`${c.npc.en} tells you they are ill, and have not told their family.`,`${c.npc.zh}说自己得了病，还没告诉家里人。`)][c.sec],
 opts:[{l:T('Keep the secret and stand by them','守口如瓶，站在对方这边'),out:[{w:3,t:c=>T(`${c.npc.en} squeezes your hand. You carry it together now.`,`${c.npc.zh}握了握你的手。从此这事你们一起扛。`),c:'good',fx:{bond:12}},{w:1,t:c=>T(`Keeping it costs you, later, when someone asks you straight out and you have to lie.`,`后来有人当面问你，你只好撒谎。守这个秘密，是有代价的。`),c:'muted',fx:{bond:8,align:-1,happy:-2}}]},
  {l:T('Urge them to set it right','劝对方把事情摆平'),out:[{w:s=>1+s.smarts/40,t:c=>T(`${c.npc.en} takes your advice. It is hard, and it works.`,`${c.npc.zh}听了你的劝。过程很难，可终于摆平了。`),c:'good',fx:{bond:8,align:2}},{w:1.5,t:c=>T(`${c.npc.en} wanted comfort, not advice, and goes quiet.`,`${c.npc.zh}要的是安慰，不是劝告，从此话少了。`),c:'muted',fx:{bond:-4}}]},
  {l:T('Use what you know','把这事当成把柄'),if:s=>s.align<=10,out:[{w:2,t:c=>T(`${c.npc.en} pays you to stay quiet, and hates you for it.`,`${c.npc.zh}花钱买你闭嘴，心里恨透了你。`),c:'bad',fx:{money:[30,90],align:-6,f:(s,c)=>{const p=person(s,c.pid);if(p){p.bond=5;if(chance(.5))p.rel='enemy'}}}},{w:1,t:c=>T(`${c.npc.en} tells everyone first. You are the one who looks bad.`,`${c.npc.zh}抢先把事情说了出去。难看的反倒是你。`),c:'bad',fx:{bond:-30,fame:-2}}]}]});
I({id:'rl_drift',only:1,tags:RT,
 text:c=>T(`You realise you have not really talked to ${c.npc.en} in a long time. A letter would be easy. So would letting it go.`,`你忽然意识到，已经很久没和${c.npc.zh}好好说过话了。写封信不难，就此淡了也不难。`),
 opts:[{l:T('Write, and visit','写信，登门'),out:[{w:3,t:c=>T(`${c.npc.en} is delighted. It is as if no time has passed.`,`${c.npc.zh}高兴极了。就像从没分开过。`),c:'good',fx:{bond:15}},{w:1,t:c=>T(`You visit. You are both polite. Whatever you had is not there any more.`,`你去了。两人都很客气。从前的那份情，已经不在了。`),c:'muted',fx:{bond:2,happy:-2}}]},
  {l:T('Let it go','随它去'),out:[{t:c=>T(`Some friendships are for a season. You think of ${c.npc.en} now and then, kindly.`,`有些交情只陪你一程。你偶尔会想起${c.npc.zh}，心里是暖的。`),c:'muted',fx:{bond:-10}}]}]});
I({id:'rl_ill',only:1,tags:RT,
 text:c=>T(`Word comes that ${c.npc.en} is seriously ill. The doctor in the village shakes his head; the good one in the city costs money.`,`消息传来，${c.npc.zh}病得很重。村里的郎中直摇头；城里的名医，得花大钱。`),
 opts:[{l:T('Fetch the city doctor (120 taels)','请城里的名医（一百二十两）'),cost:120,out:[{w:3,t:c=>T(`The doctor is worth every tael. ${c.npc.en} is up by the New Year.`,`名医没白请。过年时${c.npc.zh}已经能下地了。`),c:'good',fx:{bond:15,f:(s,c)=>{const p=person(s,c.pid);if(p)p.sick=0}}},{w:1,t:c=>T(`The doctor does everything right. It is not enough. ${c.npc.en} dies in the spring, with you there.`,`名医尽了全力，还是没能留住。开春时${c.npc.zh}走了，你守在身边。`),c:'bad',fx:{f:(s,c)=>{const p=person(s,c.pid);relDie(s,p)}}}]},
  {l:T('Go home and nurse them yourself','回家亲自照料'),out:[{w:2,t:c=>T(`A winter of broth and nights without sleep. ${c.npc.en} recovers, slowly, and holds your hand longer than usual when you leave.`,`一个冬天的汤药和无眠的夜。${c.npc.zh}慢慢好了，你走时拉着你的手不肯放。`),c:'good',fx:{bond:20,happy:-2,f:s=>{s.ap=Math.max(0,s.ap-2)}}},{w:1,t:c=>T(`You are there at the end. It matters more than you can say.`,`最后那段日子，你一直在。这比什么都要紧。`),c:'muted',fx:{f:(s,c)=>{relDie(s,person(s,c.pid));happy(s,-6)}}}]},
  {l:T('Send money and stay where you are','寄钱回去，人不回'),out:[{w:2,t:c=>T(`${c.npc.en} recovers. When you next visit, there is a coolness you had not expected.`,`${c.npc.zh}病好了。下回你回家时，感到了一丝没料到的冷淡。`),c:'muted',fx:{money:-40,bond:-8}},{w:1,t:c=>T(`The next letter is from a neighbour. ${c.npc.en} is gone.`,`下一封信是邻居写的：${c.npc.zh}已经走了。`),c:'bad',fx:{money:-40,happy:-8,f:(s,c)=>{relDie(s,person(s,c.pid))}}}]}]});
I({id:'rl_nag',only:1,tags:RT,
 text:c=>T(`${c.npc.en} has found you a match, again, and this time has already sent the matchmaker round.`,`${c.npc.zh}又给你相中了一门亲事，这回连媒婆都已经派出去了。`),
 opts:[{l:T('Meet them, to keep the peace','去见一面，免得吵'),out:[{w:2,t:T('Polite tea, polite silence. Nothing comes of it, and everyone is relieved.','客气的茶，客气的沉默。什么也没成，大家都松了口气。'),c:'muted',fx:{bond:3}},{w:1,t:T('To your great surprise, you like them.','出乎意料，你竟有几分喜欢对方。'),c:'good',fx:{bond:5,f:s=>{const q=mkPerson(s,{rel:'acq',bond:rint(55,70),sex:s.gender==='m'?'f':'m',age:s.age+rint(-3,3)});s.people.push(q);say(s,`You come away thinking about ${q.n.py}.`,`回来后你一直想着${q.n.cn}。`,'good')}}}]},
  {l:T('Refuse, firmly','坚决不去'),out:[{w:2,t:T('There is a scene. It blows over in a month.','闹了一场。一个月后就过去了。'),c:'muted',fx:{bond:-6}},{w:1,t:T('There is a scene that does not blow over.','闹了一场，而且一直没过去。'),c:'bad',fx:{bond:-15}}]}]});
I({id:'rl_sibmatch',only:1,tags:RT,
 text:c=>T(`${c.npc.en} wants to marry someone the rest of the family says is beneath them. Everyone is waiting to see whose side you take.`,`${c.npc.zh}想娶（嫁）一个家里人都看不上的人。全家都在等你表态。`),
 opts:[{l:T('Stand with your sibling','站在手足这边'),out:[{w:3,t:c=>T(`The wedding happens. Years later the family admits they were wrong, almost.`,`婚事成了。多年后家里人差不多承认当初看走了眼。`),c:'good',fx:{bond:18}},{w:1,t:c=>T(`The wedding happens, and the family was right. ${c.npc.en} never says so, but never forgets you stood by them.`,`婚事成了，家里人说对了。${c.npc.zh}嘴上不说，可一直记得你当初站在自己这边。`),c:'muted',fx:{bond:12}}]},
  {l:T('Side with the family','站在家里这边'),out:[{w:2,t:c=>T(`${c.npc.en} gives in, and is cool to you for years.`,`${c.npc.zh}让了步，此后好几年都对你冷冷的。`),c:'muted',fx:{bond:-15}},{w:1,t:c=>T(`${c.npc.en} runs off with them anyway. A letter comes, years later, from a town you have never heard of.`,`${c.npc.zh}还是跟人走了。多年后从一个你没听过的小地方寄来一封信。`),c:'bad',fx:{bond:-10}}]}]});
I({id:'rl_jealous',only:1,tags:RT,
 text:c=>T(`${c.npc.en} has heard you were seen laughing with someone at the market, and wants to know who.`,`${c.npc.zh}听说有人看见你在集市上和别人有说有笑，要你说清楚是谁。`),
 opts:[{l:T('Explain, patiently','耐心解释'),out:[{w:(s,c)=>1+c.p.bond/30,t:c=>T(`It was a cousin. ${c.npc.en} is embarrassed, and sweet about it.`,`那是个表亲。${c.npc.zh}不好意思起来，反倒格外温柔。`),c:'good',fx:{bond:6}},{w:1,t:c=>T(`${c.npc.en} believes you, mostly. A small doubt stays.`,`${c.npc.zh}大体信了。心里还留着一点疑影。`),c:'muted',fx:{bond:-3}}]},
  {l:T('Be offended that they asked','你竟然问我这个？'),out:[{w:1,t:c=>T(`A real fight, the first one. You make up, but you both remember it.`,`头一回真吵。后来和好了，可两人都记着。`),c:'bad',fx:{bond:-10}},{w:1,t:c=>T(`${c.npc.en} apologises for doubting you. You feel worse than if they had not.`,`${c.npc.zh}为怀疑你道了歉。你心里反倒更不是滋味。`),c:'muted',fx:{bond:2,happy:-2}}]}]});
I({id:'rl_spousewish',only:1,tags:RT,ctx:s=>({w:pick([0,1,2])}),
 text:c=>[T(`${c.npc.en} wants to move closer to their own family.`,`${c.npc.zh}想搬到离自己娘家（老家）近些的地方。`),T(`${c.npc.en} wants you to stop taking dangerous work.`,`${c.npc.zh}希望你别再接那些要命的活。`),T(`${c.npc.en} wants a child, or another child.`,`${c.npc.zh}想要个孩子，或者再要一个。`)][c.w],
 opts:[{l:T('Agree','答应'),out:[{w:3,t:T('It is not what you would have chosen. It is the right thing, mostly.','这不是你会选的路。大体上，是对的。'),c:'good',fx:{bond:12,f:(s,c)=>{if(c.w===2&&typeof INC_BY.baby!=='undefined'&&chance(.5)&&s.people.filter(p=>p.rel==='child').length<6){const k=mkPerson(s,{rel:'child',age:0,sur:s.sur,bond:85,lv:1});s.people.push(k);say(s,`A year later, ${k.n.py} is born.`,`一年后，${k.n.cn}出生了。`,'gold')}}}},{w:1,t:T('You agree, and come to resent it a little.','你答应了，心里却渐渐有些不甘。'),c:'muted',fx:{bond:6,happy:-3}}]},
  {l:T('Refuse','不答应'),out:[{w:2,t:T('A long cold week. Then life goes on.','冷了一个漫长的礼拜。然后日子照过。'),c:'muted',fx:{bond:-8}},{w:1,t:T('It becomes the thing you fight about for years.','这成了你们吵了好几年的那件事。'),c:'bad',fx:{bond:-15}}]},
  {l:T('Find a middle way','找个折中'),if:s=>s.smarts>=40,out:[{w:2,t:T('Nobody gets everything. Both of you get enough.','谁也没得到全部，可两人都得到了够用的。'),c:'good',fx:{bond:8}},{w:1,t:T('The middle way pleases nobody.','折中的办法谁都不满意。'),c:'muted',fx:{bond:-2}}]}]});
I({id:'rl_childtrouble',only:1,tags:RT,ctx:s=>({w:pick([0,1,2])}),
 text:c=>[T(`${c.npc.en} has been fighting at school and broke a boy’s nose. The boy’s father is at your door.`,`${c.npc.zh}在学堂打架，打断了人家孩子的鼻梁。那孩子的爹找上门来了。`),T(`${c.npc.en} wants to run away and join a travelling troupe.`,`${c.npc.zh}想跟着走江湖的戏班子跑。`),T(`${c.npc.en} begs you to teach them to fight properly.`,`${c.npc.zh}缠着你，要你正经教自己武功。`)][c.w],
 opts:[{l:T('Take their side','护着孩子'),out:[{w:2,t:T('They grow up sure you will always be there. Mostly you are.','孩子长大后笃信你永远会护着自己。大多数时候，你确实在。'),c:'good',fx:{bond:12}},{w:1,t:T('They learn that you will always clean up after them, and act on it.','孩子学会了：闯了祸自有你收拾。后来果然常闯祸。'),c:'muted',fx:{bond:6,money:-20}}]},
  {l:T('Be strict','严加管教'),out:[{w:2,t:T('They sulk for a month and turn out better for it.','孩子闷了一个月，后来反倒长进了。'),c:'good',fx:{bond:-2,f:(s,c)=>{const p=person(s,c.pid);if(p)p.lv+=2}}},{w:1,t:T('They stop telling you things.','孩子从此什么都不跟你说了。'),c:'bad',fx:{bond:-12}}]},
  {l:T('Sit down and listen first','先坐下听孩子说'),out:[{w:3,t:T('There is more to it than you thought. You handle it together.','事情比你想的复杂。你们一起把它办妥了。'),c:'good',fx:{bond:15}},{w:1,t:T('They do not want to talk. But they know you tried.','孩子不想说。可孩子知道你试过了。'),c:'muted',fx:{bond:5}}]}]});
I({id:'rl_mastertest',only:1,tags:RT,
 text:c=>T(`Without warning, your master attacks you at breakfast with a chopstick. "Defend yourself."`,`吃早饭时，师父毫无预兆地拿筷子朝你刺来。"接着。"`),
 opts:[{l:T('Defend','招架'),out:[{w:s=>1+power(s)/60,t:T('You block with your bowl and do not spill the soup. Your master grunts, which is high praise.','你用碗挡住了，汤一滴没洒。师父哼了一声，这已是极高的称赞。'),c:'good',fx:{bond:8,skill:2}},{w:2,t:T('Soup everywhere. "Again tomorrow," says your master.','汤洒了一身。"明天再来。"师父说。'),c:'muted',fx:{skill:1}}]},
  {l:T('Keep eating, unmoved','照吃不误，不动如山'),out:[{w:s=>s.t.heart*.3,t:T('The chopstick stops a hair from your eye. Your master laughs for the first time in years.','筷子停在你眼前一根头发远。师父多年来第一次大笑。'),c:'gold',fx:{bond:12,qi:3}},{w:2,t:T('The chopstick does not stop. Your master is unrepentant.','筷子没停。师父毫无悔意。'),c:'bad',fx:{hurt:[2,6],cause:T('a chopstick','一根筷子'),bond:2}}]}]});
I({id:'rl_discipleq',only:1,tags:RT,
 text:c=>T(`Your disciple ${c.npc.en} asks whether they may leave for a year to see the world.`,`徒弟${c.npc.zh}问你能不能放自己出去闯荡一年。`),
 opts:[{l:T('Let them go','放徒弟去'),out:[{w:2,t:T('They come back older, scarred, and better. They bring you a gift from every province.','徒弟一年后回来，长大了，带着伤疤，也更出色了，每到一省都给你带了礼物。'),c:'good',fx:{bond:12,f:(s,c)=>{const p=person(s,c.pid);if(p)p.lv+=rint(5,15)}}},{w:1,t:T('They do not come back. A letter, a year later: they have found another master.','徒弟没回来。一年后来了封信：已另投了师门。'),c:'bad',fx:{f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='acq';p.bond-=10}}}}]},
  {l:T('Not yet','还不是时候'),out:[{w:2,t:T('They accept it, and train harder to prove themselves.','徒弟认了，练得更狠，想证明自己。'),c:'muted',fx:{bond:-2,f:(s,c)=>{const p=person(s,c.pid);if(p)p.lv+=3}}},{w:1,t:T('They go anyway, in the night.','徒弟还是半夜走了。'),c:'bad',fx:{f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='acq';p.bond-=20}}}}]}]});
I({id:'rl_rivalnews',only:1,tags:RT,
 text:c=>T(`Your rival ${c.npc.en} has just won something you wanted: a title, a match, a place. The whole town is talking about it.`,`你的对头${c.npc.zh}刚刚拿下了你想要的东西——名号、比试、位子。满城都在议论。`),
 opts:[{l:T('Congratulate them, in person','亲自登门道贺'),out:[{w:2,t:T('It costs you something to say it. It earns you more.','这句话说出口不容易，换来的却更多。'),c:'good',fx:{bond:15,align:2}},{w:1,t:c=>T(`${c.npc.en} takes it as mockery.`,`${c.npc.zh}以为你是来嘲讽的。`),c:'bad',fx:{bond:-10}}]},
  {l:T('Train harder','闭门苦练'),out:[{t:T('You train until your hands bleed. Next time.','你练到手掌磨出了血。下一回。'),c:'muted',fx:{skill:2,happy:-2}}]},
  {l:T('Spread a story about them','散播对方的闲话'),if:s=>s.align<=20,out:[{w:1,t:T('It sticks. You feel worse than you expected.','闲话传开了。你心里比预想的还难受。'),c:'muted',fx:{align:-4,bond:-15}},{w:1,t:T('It is traced back to you.','闲话被人追查到了你头上。'),c:'bad',fx:{align:-4,fame:-3,bond:-25}}]}]});
