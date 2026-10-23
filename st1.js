/* 江湖一生 · story series, first batch: a village, a student, a letter, a storyteller, an old case, a torn manual */
'use strict';
const stName=g=>{const n=genName(g||(chance(.5)?'m':'f'));return{n,en:n.py,zh:n.cn,sex:g||null}};
const stPr=sex=>PRON[sex]||PRON.m;
const stKid=sex=>{const n=genName(sex),gv=n.cn.slice(1);return{en:n.py.split(' ').slice(1).join(' '),zh:(gv.length>1?gv.slice(-1):gv),full:n,sex}};
const stFoe=(s,k,lo)=>Math.max(lo||8,Math.round(power(s)*k*(.9+R()*.25)));

/* ===================== 记得你的村子 · The Village That Remembers ===================== */
SDEF('vil',{n:T('The Village That Remembers','记得你的村子'),theme:T('A village in trouble, and what it becomes because of you.','一个遭难的村子，因你而成了什么样子。'),
 ends:{prosper:{n:T('Your name on the village stone','村口碑上有你的名字'),tone:'good'},welcome:{n:T('Always a bowl of rice for you','永远有你一碗饭'),tone:'good'},
  indifferent:{n:T('Nobody remembers','没人记得了'),tone:'mixed'},redeemed:{n:T('Forgiven, late','迟来的原谅'),tone:'mixed'},hostile:{n:T('The village that curses you','咒你的村子'),tone:'bad'},lapsed:{n:T('You never went back','你再没回去过'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`You wonder how ${r.facts.vil.en} is getting on. (Roam to pass by again.)`,`不知道${r.facts.vil.zh}如今怎样了。（下一步：游历时路过）`),
  c:(s,r)=>T(`Years have gone by since you last saw ${r.facts.vil.en}.`,`离上次去${r.facts.vil.zh}，已经很多年了。`)},
 exp:14,lapse:T('Years pass, and the road never takes you back to that village.','一年年过去，你的路再没经过那个村子。')});
const VIL_SUF=[['Village','村'],['Hamlet','庄'],['Hollow','坳'],['Stockade','堡']];
const VIL_TR=[T('Bandits from the hills have come down for the grain, and given the village three days.','山上的土匪下来要粮，限村里三天交齐。'),
  T('The river dike broke in the night. Half the fields are under water, and the water is still rising.','河堤夜里决了口，半个村的田都泡在水里，水还在涨。'),
  T('A fever is going through the houses. Four have died this week, and there is no doctor within a day’s walk.','村里闹起了热病，这个礼拜已经死了四个，一天路程之内都没有大夫。')];
SOPEN('vil',{age:[16,60],w:3,tags:['wander'],
 ctx:s=>{const su=pick(SUR),x=pick(VIL_SUF),k=stKid(chance(.5)?'m':'f');return{vil:T(`${su[1]} ${x[0]}`,`${su[0]}家${x[1]}`),tr:rint(0,2),kid:k,lv:stFoe(s,.85,10)}},
 text:c=>T(`${c.intro.en}, you pass through ${c.vil.en}. People are crowded at the gate. ${VIL_TR[c.tr].en} A ${c.kid.sex==='f'?'girl':'boy'} of about eight, Little ${c.kid.en}, has hold of your sleeve and will not let go.`,
  `${c.intro.zh}，你路过${c.vil.zh}。村口围满了人。${VIL_TR[c.tr].zh}一个八九岁的${c.kid.sex==='f'?'小姑娘':'小男孩'}，叫小${c.kid.zh}，拽着你的袖子不肯撒手。`),
 opts:[
  {l:T('Stand with the village against the bandits','替村子出头，会会那帮土匪'),if:(s,c)=>c.tr===0,fight:(s,c)=>({foe:{name:T('the bandit chief','土匪头子'),lv:c.lv,fixed:1},stakes:'injury',title:T('For a village','为一村人出头'),cause:T('defending a village','护村一战')}),
   win:[{t:T('The chief goes back up the hill with his arm in a sling. The village rings the bell for you.','土匪头子吊着胳膊回了山。村里为你敲了钟。'),c:'good',fx:{fame:2,align:4,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'help'},[2,4])}}],
   lose:[{t:T('You are beaten, but the bandits have had enough of a fight and take only half. The villagers hide you in a cellar until you can walk.','你被打倒了，可土匪也不想再拼，只抢了一半就走。村民把你藏进地窖，养到你能走路。'),c:'muted',fx:{align:3,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'help'},[2,4])}}]},
  {l:T('Stay and help build up the dike','留下来帮着筑堤'),if:(s,c)=>c.tr===1,out:[{t:T('Five days of mud and sandbags. The water stops a hand’s width from the granary.','五天的泥浆和沙袋。水在离粮仓一掌的地方停住了。'),c:'good',fx:{hurt:[4,12],cause:T('exhaustion','积劳'),align:4,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'help'},[2,4])}}]},
  {l:T('Pay for a doctor and medicine (40 taels)','出钱请大夫、抓药（四十两）'),if:(s,c)=>c.tr===2,cost:40,out:[{t:T('You fetch a doctor from the next county yourself. The dying stops within the week.','你亲自去邻县请来大夫。不出七天，就不再死人了。'),c:'good',fx:{align:4,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'help'},[2,4])}}]},
  {l:T('Leave a few taels and go (10 taels)','留下几两银子就走（十两）'),cost:10,out:[{t:T('It is something. The child lets go of your sleeve.','聊胜于无。那孩子松开了你的袖子。'),c:'muted',fx:{align:1,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'coin'},[2,4])}}]},
  {l:T('Not your business. Keep walking','不关你的事，继续赶路'),out:[{t:T('You pull your sleeve free. You do not look back.','你抽回袖子，没有回头。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'ignore'},[3,5])}}]},
  {l:c=>c.tr===0?T('Take the bandits’ money to collect the grain for them','收土匪的钱，替他们收粮'):T('Sell them your food and medicine at five times the price','把干粮和药卖给他们，要五倍的价'),
   out:[{t:T('The money is good. The child watches you count it.','钱来得容易。那孩子看着你数钱。'),c:'bad',fx:{money:[40,90],align:-7,f:(s,c)=>stBegin(s,'vil',c,'b',{vil:c.vil,kid:c.kid,how:'exploit'},[2,4])}}]}]});
STI('vil','b',{tags:['wander'],
 text:c=>{const f=c.f,k=f.kid,yrs=c.since;return[
  T(`You pass through ${f.vil.en} again, ${yrs} years on. The fields are green. At the gate is a new stone: “In thanks to the stranger who stood with us.” Little ${k.en} is taller now, and runs to fetch the elders.`,`时隔${cnYrs(yrs)}年，你又路过${f.vil.zh}。田里一片绿。村口立了块新碑：“谢当年仗义相助的过路人”。小${k.zh}长高了，一溜烟跑去叫村里的老人。`),
  T(`You pass through ${f.vil.en} again. It has scraped through. Little ${k.en} recognises you: “You gave us money once.” It is said without much feeling either way.`,`你又路过${f.vil.zh}。村子总算熬过来了。小${k.zh}认出了你：“你给过我们钱。”说得不冷不热。`),
  T(`You pass through ${f.vil.en} again. Half the houses stand empty, their doors banging in the wind. Little ${k.en} is thin, and looks at you as if trying to remember where you have met.`,`你又路过${f.vil.zh}。一半的屋子空了，门在风里乒乓作响。小${k.zh}瘦了，看着你，像在想在哪儿见过你。`),
  T(`You pass through ${f.vil.en} again. Someone shouts, and doors close all along the street. Little ${k.en}, older now, stands in the road and stares at you without blinking.`,`你又路过${f.vil.zh}。有人喊了一声，一整条街的门都关上了。长大了些的小${k.zh}站在路中间，一眨不眨地盯着你。`)][{help:0,coin:1,ignore:2,exploit:3}[f.how]]},
 opts:[
  {l:T('Teach the children a few moves','教村里孩子几招'),if:(s,c)=>c.f.how==='help'||c.f.how==='coin',out:[{t:c=>T(`You stay a week. Little ${c.f.kid.en} is the last to stop practising every evening.`,`你住了七天。每天傍晚，小${c.f.kid.zh}都是最后一个收手的。`),c:'good',fx:{happy:6,f:(s,c)=>stGo(s,'vil','c',{taught:1},[8,13])}}]},
  {l:T('Pay to mend the road and the well (50 taels)','出钱修路、修井（五十两）'),cost:50,out:[{t:T('The elders argue about whether to take it, then take it.','老人们争了一阵要不要收，最后收下了。'),c:'good',fx:{align:2,f:(s,c)=>stGo(s,'vil','c',{gave:1},[8,13])}}]},
  {l:T('Say sorry, and leave a purse (100 taels)','赔个不是，留下一袋银子（一百两）'),if:(s,c)=>c.f.how==='exploit'||c.f.how==='ignore',cost:100,out:[{t:T('Nobody takes it from your hand. When you look back, someone has picked it up.','没人从你手里接过去。你回头时，有人已经把它捡起来了。'),c:'muted',fx:{align:3,f:(s,c)=>stGo(s,'vil','c',{amends:1},[8,13])}}]},
  {l:T('Eat a meal and move on','吃顿饭就走'),if:(s,c)=>c.f.how==='help'||c.f.how==='coin',out:[{t:T('They feed you too much. You leave heavier.','他们给你盛得太多了。你走的时候撑得慌。'),c:'good',fx:{happy:3,f:(s,c)=>stGo(s,'vil','c',{},[8,13])}}]},
  {l:T('There is nothing to say. Walk on','无话可说，走吧'),if:(s,c)=>c.f.how==='exploit'||c.f.how==='ignore',out:[{t:T('You walk on.','你走了。'),c:'muted',fx:{f:(s,c)=>stGo(s,'vil','c',{},[8,13])}}]},
  {l:T('Teach them some manners','教教他们规矩'),if:(s,c)=>c.f.how==='exploit',out:[{t:c=>T(`You kick in a door to make a point. Little ${c.f.kid.en} does not look away once.`,`你踹开一扇门，给他们点颜色看。小${c.f.kid.zh}从头到尾没移开过眼睛。`),c:'bad',fx:{align:-5,f:(s,c)=>stGo(s,'vil','c',{cruel:1},[8,13])}}]}]});
const vilScore=f=>({help:2,coin:1,ignore:0,exploit:-2}[f.how]||0)+(f.taught?1:0)+(f.gave?1:0)+(f.amends?1:0)-(f.cruel?2:0);
STI('vil','c',{tags:['wander'],self:1,
 ctx:s=>{const c=stCtx(s,'vil');c.sc=vilScore(c.f);c.lv=stFoe(s,1.05,15);return c},
 text:(c,s)=>{const f=c.f,k=f.kid,yrs=s.age-c.r.at,g=k.sex==='f';const nm=T(k.full.py,k.full.cn);
  if(c.sc>=3)return T(`Word reaches you from ${f.vil.en}: they are asking for you. You go. It is a market town now, with a school. The village head is ${nm.en}, the child who held your sleeve ${yrs} years ago. ${g?'She':'He'} has kept a room for you.`,`${f.vil.zh}托人捎信来，请你去一趟。你去了。那里如今是个有集市、有学堂的镇子了。村长是${nm.zh}，${cnYrs(yrs)}年前拽着你袖子的那个孩子。${g?'她':'他'}给你留着一间屋子。`);
  if(c.sc>=1)return T(`You pass ${f.vil.en} once more. It is a modest, decent place. ${nm.en} has a family now, and insists you eat with them.`,`你又一次经过${f.vil.zh}。不大，但日子过得去。${nm.zh}已经成了家，非要留你吃饭。`);
  if(c.sc>=0)return T(`You pass ${f.vil.en} again after ${yrs} years. New faces. Nobody knows you, and ${nm.en} moved away long ago.`,`时隔${cnYrs(yrs)}年，你又经过${f.vil.zh}。都是生面孔，没人认得你。${nm.zh}早就搬走了。`);
  return T(`On the road near ${f.vil.en}, armed men block your way. Their leader is ${nm.en}, grown hard, with a scar across the jaw. “I was eight. I watched you.” ${g?'She':'He'} draws.`,`在${f.vil.zh}附近的路上，一伙带刀的人拦住了你。为首的是${nm.zh}，长大了，脸上横着一道疤。“那年我八岁。我看着你。”${g?'她':'他'}拔出了刀。`)},
 opts:[
  {l:T('Accept the honour','受了这份情'),if:(s,c)=>c.sc>=3,out:[{t:T('They carve your name on the stone at the gate, under the old words. Children are told the story.','他们把你的名字刻在村口那块碑上，就在当年那句话下面。孩子们都听过这个故事。'),c:'gold',fx:{fame:4,happy:12,f:(s,c)=>stEnd(s,'vil','prosper')}}]},
  {l:T('Ask them to keep it small','请他们别声张'),if:(s,c)=>c.sc>=3,out:[{t:T('They agree, and carve it anyway. Smaller.','他们答应了，还是刻了，刻得小一点。'),c:'gold',fx:{happy:10,align:2,f:(s,c)=>stEnd(s,'vil','prosper')}}]},
  {l:T('Stay for dinner','留下吃饭'),if:(s,c)=>c.sc>=1&&c.sc<3,out:[{t:T('The children want to see a move. You show them one. Next time, they say, stay longer.','孩子们要看你露一手。你露了一手。他们说，下回多住几天。'),c:'good',fx:{happy:8,f:(s,c)=>stEnd(s,'vil','welcome')}}]},
  {l:T('Walk on through','穿村而过'),if:(s,c)=>c.sc===0,out:[{t:T('Some things leave no mark at all.','有些事，连痕迹都不会留下。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'vil','indifferent')}}]},
  {l:T('Lower your weapon and apologise','放下兵器，赔罪'),if:(s,c)=>c.sc<0,out:[
   {w:(s,c)=>c.f.amends?3:1,t:T('A long silence. Then the blade goes back into its sheath. “You came back once and paid. I remember that too.”','良久的沉默。刀回了鞘。“你回来过一次，赔了钱。那个我也记得。”'),c:'good',fx:{align:3,happy:4,f:(s,c)=>stEnd(s,'vil','redeemed')}},
   {w:2,t:T('“Words are cheap.” The first blow lands before you can raise your hands.','“说得轻巧。”你还没抬起手，第一刀已经到了。'),c:'bad',fx:{hurt:[12,28],cause:T('an old village’s revenge','旧村子的报复'),f:(s,c)=>stEnd(s,'vil','hostile')}}]},
  {l:T('Fight','动手'),if:(s,c)=>c.sc<0,fight:(s,c)=>({foe:{name:T(c.f.kid.full.py,c.f.kid.full.cn),lv:c.lv,fixed:1},stakes:'injury',title:T('The child from the village','当年村里的孩子'),cause:T('an old village’s revenge','旧村子的报复')}),
   win:[{t:T('You win. Behind the fallen leader, the whole village is watching.','你赢了。倒下的人身后，整个村子都在看。'),c:'bad',fx:{align:-3,f:(s,c)=>stEnd(s,'vil','hostile')}}],
   lose:[{t:T('You are left in the road. Nobody from the village comes to help.','你被扔在路上。村里没有一个人出来扶你。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'vil','hostile')}}]}]});

/* ===================== 赖着不走的徒弟 · The Student Who Wouldn't Leave ===================== */
SDEF('stu',{n:T('The Student Who Wouldn’t Leave','赖着不走的徒弟'),theme:T('A child follows you home. What they become is what you showed them.','一个孩子跟你回了家。他后来成了什么人，取决于你让他看见了什么。'),
 ends:{ally:{n:T('A student to be proud of','教出了好徒弟'),tone:'good'},surpassed:{n:T('Surpassed by your student','青出于蓝'),tone:'good'},critic:{n:T('“You taught me otherwise”','“你当年不是这么教的”'),tone:'mixed'},
  villain:{n:T('You made a monster','你教出了一个魔头'),tone:'bad'},redeemed:{n:T('Turned back in time','及时回头'),tone:'good'},elsewhere:{n:T('Found another master','另投名师'),tone:'good'},never:{n:T('The door stayed shut','门始终没开'),tone:'mixed'},lost:{n:T('Gone before you','走在了你前头'),tone:'bad'},lapsed:{n:T('Drifted apart','渐行渐远'),tone:'mixed'}},
 hint:{h:T('A child is kneeling outside your door.','有个孩子跪在你门外。'),b:(s,r)=>T(`Your student ${r.facts.kid.en} is learning from everything you do. (Practise to keep an eye on them.)`,`徒弟${r.facts.kid.zh}什么都学你。（下一步：练功时留意）`),
  c:(s,r)=>T(`${r.facts.kid.en} is nearly grown.`,`${r.facts.kid.zh}快长大了。`),d:(s,r)=>T(`${r.facts.kid.en} is out making a name. One day they will come back.`,`${r.facts.kid.zh}在外闯荡。总有一天会回来。`)},
 gone:(s,r,p)=>{if(p.gone){stEnd(s,'stu','lapsed');return}if(!p.killed){say(s,`Word comes that ${p.n.py}, your student, is dead.`,`传来消息：你的徒弟${p.n.cn}死了。`,'bad');happy(s,-10)}stEnd(s,'stu','lost')}});
SOPEN('stu',{age:[22,62],w:2.5,tags:['af_arena','town'],when:s=>power(s)>=25,
 ctx:s=>{const g=chance(.6)?'m':'f',k=stKid(g);return{kid:k,npc:npc(s,{name:k.full,sex:g,age:13,occ:g==='m'?21:20,lv:3})}},
 text:c=>T(`A ${c.kid.sex==='f'?'girl':'boy'} of thirteen has been following you for three days, ever since ${c.kid.sex==='f'?'she':'he'} watched you train. Tonight ${c.kid.sex==='f'?'she':'he'} is kneeling at your door in the rain. “My name is ${c.kid.full.py}. Teach me.”`,`一个十三岁的${c.kid.sex==='f'?'姑娘':'少年'}跟了你三天，自从看过你练功就再没走开。今夜${c.kid.sex==='f'?'她':'他'}跪在你门口，淋着雨。“我叫${c.kid.full.cn}。求你教我。”`),
 opts:[{l:T('Take them in','收下'),out:[{t:T('You open the door. The child is inside before you finish the word.','你开了门。话还没说完，孩子已经进来了。'),c:'good',fx:{meet:'disciple',bond:65,f:(s,c)=>stBegin(s,'stu',c,'b',{kid:c.kid,a0:s.align},[1,2])}}]},
  {l:T('Kindly send them home','好言劝回家'),out:[{t:T('You give the child dry clothes and a meal and a few honest words about this life. In the morning the door is empty.','你给孩子换了干衣裳，吃了顿饭，说了几句实在话。第二天一早，门口空了。'),c:'muted',fx:{align:1,f:(s,c)=>stBegin(s,'stu',c,'k',{kid:c.kid,kind:1},[6,10])}}]},
  {l:T('Shut the door on them','把门关上'),out:[{t:T('You bar the door and go to bed.','你闩上门，睡了。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'stu',c,'h',{kid:c.kid},0)}}]}]});
STI('stu','h',{self:1,
 text:c=>T(`Three days of snow. The child is still kneeling outside, blue at the lips.`,`下了三天雪。那孩子还跪在门外，嘴唇都冻紫了。`),
 opts:[{l:T('Open the door','开门'),out:[{t:T('You carry them in. When they can speak, the first thing they say is “thank you, Master.”','你把孩子抱了进来。等能开口了，第一句话是“谢谢师父”。'),c:'good',fx:{meet:'disciple',bond:75,f:(s,c)=>{stGo(s,'stu','b',{a0:s.align,stubborn:1},[1,2]);const r=stRec(s,'stu');if(r&&c.pid)r.pid=c.pid}}}]},
  {l:T('Leave it shut','不开'),out:[{t:T('On the fourth morning, there is only a dent in the snow.','第四天早上，雪地里只剩一个跪出来的坑。'),c:'muted',fx:{align:-2,f:(s,c)=>stEnd(s,'stu','never')}}]}]});
STI('stu','k',{tags:['town','wander'],self:1,
 text:(c,s)=>T(`A young ${c.f.kid.sex==='f'?'woman':'man'} in a sect’s colours bows to you in the street. “You sent me home once, with dry clothes. I went to a proper school instead. You were right.”`,`街上，一个穿着门派服色的年轻${c.f.kid.sex==='f'?'姑娘':'人'}向你行礼。“当年你给了我干衣裳，劝我回家。我后来进了正经门派。你说得对。”`),
 opts:[{l:T('Buy them a drink','请对方喝一杯'),out:[{t:T('You talk until the lamps are lit.','你们一直聊到掌灯。'),c:'good',fx:{meet:'friend',bond:70,happy:5,f:(s,c)=>stEnd(s,'stu','elsewhere')}}]}]});
STI('stu','b',{tags:['af_practice','af_teach'],
 ctx:s=>{const c=stCtx(s,'stu');c.v=s.align>=20?0:s.align<=-20?1:2;return c},
 text:c=>{const k=c.f.kid;return[T(`${k.en} comes home bruised. ${k.sex==='f'?'She':'He'} stepped in for a beggar boy against three men twice ${k.sex==='f'?'her':'his'} size. “You would have.”`,`${k.zh}一身青紫地回来了。${k.sex==='f'?'她':'他'}替一个小乞丐出头，对面是三个比${k.sex==='f'?'她':'他'}大一倍的汉子。“换了师父，也会这么做。”`),
   T(`A stallholder comes to complain: ${k.en} took what ${k.sex==='f'?'she':'he'} wanted and knocked the man down when he objected. “That is how you do it,” ${k.en} says, puzzled.`,`一个摊贩找上门来告状：${k.zh}看中什么拿什么，人家不让，就把人打翻在地。“师父不也是这样？”${k.zh}一脸不解。`),
   T(`${k.en} has started standing like you, eating like you, and swearing like you. ${k.sex==='f'?'She':'He'} has no idea ${k.sex==='f'?'she':'he'} does it.`,`${k.zh}站姿像你，吃相像你，骂人也像你，自己却浑然不觉。`)][c.v]},
 opts:[{l:T('Praise them','夸几句'),out:[{t:T('They glow for a week.','孩子乐了一个礼拜。'),c:'good',fx:{bond:6,f:(s,c)=>stGo(s,'stu','c',{lesson:'praise',a1:s.align},[2,3])}}]},
  {l:T('Scold them hard','狠狠训一顿'),out:[{t:T('They take it without a word, and train until midnight.','孩子一声不吭地受着，练到了半夜。'),c:'muted',fx:{bond:-4,f:(s,c)=>stGo(s,'stu','c',{lesson:'hard',a1:s.align},[2,3])}}]},
  {l:T('Go with them and set it right together','带着孩子一起去把事情摆平'),out:[{t:T('You make it right together, whatever it takes. On the way home, they are very quiet.','不管费多少周折，你们一起把事情摆平了。回家路上，孩子一句话也没说。'),c:'good',fx:{align:2,bond:4,f:(s,c)=>stGo(s,'stu','c',{lesson:'example',a1:s.align},[2,3])}}]}]});
STI('stu','c',{tags:['af_practice','af_teach'],self:1,
 text:c=>T(`${c.f.kid.en} is eighteen, and has been quiet for a month. Tonight ${c.f.kid.sex==='f'?'she':'he'} asks to go out into the jianghu alone.`,`${c.f.kid.zh}十八岁了，闷了一个月。今晚，${c.f.kid.sex==='f'?'她':'他'}说想一个人出去闯闯。`),
 opts:[{l:T('Give your blessing, and your weapon','准了，把自己的兵器给孩子'),if:s=>!!eqItem(s,'weapon'),out:[{t:T('They leave at dawn with your weapon on their back. They do not look back, which is right.','天一亮，孩子背着你的兵器走了，没回头。这样才对。'),c:'good',fx:{bond:12,f:(s,c)=>stGo(s,'stu','d',{gift:1},[8,13])}}]},
  {l:T('Give your blessing','准了'),out:[{t:T('You walk them to the crossroads.','你把孩子送到了路口。'),c:'good',fx:{bond:6,f:(s,c)=>stGo(s,'stu','d',{},[8,13])}}]},
  {l:T('Forbid it','不准'),out:[{t:T('In the morning the bed is empty and your second-best sword is gone.','第二天早上，床空了，你那把次好的剑也不见了。'),c:'muted',fx:{bond:-20,f:(s,c)=>stGo(s,'stu','d',{forbid:1},[8,13])}}]}]});
/* who the student becomes: the example you set, the lesson you gave, and whether you still live by it */
function stuFate(s,f){const ex=(f.a1??f.a0??0)+(f.lesson==='example'?35:f.lesson==='hard'?12:0)+(f.forbid?-10:0)+(f.gift?8:0);
  const bad=ex<-10,flip=Math.sign(s.align||1)!==Math.sign(f.a1??f.a0??1)&&Math.abs(s.align-(f.a1??f.a0??0))>=40;return{bad,flip}}
STI('stu','d',{tags:['town','wander'],self:1,
 ctx:s=>{const c=stCtx(s,'stu');Object.assign(c,stuFate(s,c.f));c.lv=c.p?Math.max(c.p.lv,stFoe(s,.85)):stFoe(s,.9);return c},
 text:(c,s)=>{const k=c.f.kid,yrs=s.age-c.r.adv,g=k.sex==='f',P=g?'She':'He',zp=g?'她':'他';const wpn=c.f.gift?T(` Your old weapon is still on ${g?'her':'his'} back.`,`背上还是你那把旧兵器。`):T('','');
  if(c.flip)return T(`${k.full.py} is back after ${yrs} years, with a name of ${g?'her':'his'} own. ${P} has heard what you have been doing. “You taught me the opposite. Which of you was lying?”${wpn.en}`,`${k.full.cn}时隔${cnYrs(yrs)}年回来了，已经闯出了名号。${zp}听说了你这些年的作为。“你当年教我的正好相反。哪一个才是真的你？”${wpn.zh}`);
  if(c.bad)return T(`${k.full.py} is back after ${yrs} years. People cross the street to avoid ${g?'her':'him'}. ${P} bows low to you. “Everything I am, I learned from you.” It is not a compliment.${wpn.en}`,`${k.full.cn}时隔${cnYrs(yrs)}年回来了。路人见了${zp}都绕着走。${zp}向你深深一拜：“我这身本事、这副脾气，都是跟师父学的。”这话听着并不像夸奖。${wpn.zh}`);
  return T(`${k.full.py} is back after ${yrs} years. The jianghu knows the name now, and speaks it well. ${P} asks, half joking, for one more bout with the old master.${wpn.en}`,`${k.full.cn}时隔${cnYrs(yrs)}年回来了。如今江湖上提起这个名字，都是好话。${zp}半开玩笑地说，想再跟师父过几招。${wpn.zh}`)},
 opts:[{l:T('Spar, for old times’ sake','切磋几招，叙叙旧'),if:(s,c)=>!c.bad&&!c.flip,fight:(s,c)=>({foe:{name:T(c.f.kid.full.py,c.f.kid.full.cn),lv:c.lv,fixed:1},stakes:'spar',title:T('Master and student','师徒过招'),cause:T('a sparring match','切磋')}),
   win:[{t:T('You still have it, just. They laugh and bow, and stay a month.','你还压得住，险险的。徒弟笑着行礼，住了一个月。'),c:'gold',fx:{bond:15,happy:8,fame:2,f:(s,c)=>stEnd(s,'stu','ally')}}],
   lose:[{t:T('They beat you, cleanly. It is the proudest you have ever been.','徒弟干干净净地赢了你。你这辈子没这么得意过。'),c:'gold',fx:{bond:15,happy:10,fame:3,f:(s,c)=>stEnd(s,'stu','surpassed')}}]},
  {l:T('Tell them the truth: you changed','说实话：是你变了'),if:(s,c)=>c.flip,out:[{w:2,t:T('They listen to all of it. “Then I will be what you were.” They leave without anger, which is worse.','徒弟听完了。“那我就做当年的你。”说完走了，没有动气，这反倒更难受。'),c:'muted',fx:{bond:-10,f:(s,c)=>stEnd(s,'stu','critic')}},{w:1,t:T('They are quiet a long time. “People can change back,” they say, and stay.','徒弟沉默了很久。“人也可以变回去。”说完，留了下来。'),c:'good',fx:{bond:5,f:(s,c)=>stEnd(s,'stu','critic')}}]},
  {l:T('Defend yourself','替自己辩解'),if:(s,c)=>c.flip,out:[{t:T('Words go back and forth until there is nothing left to say. They leave at night.','话来话去，直到再无话可说。徒弟夜里走了。'),c:'muted',fx:{bond:-25,f:(s,c)=>stEnd(s,'stu','critic')}}]},
  {l:T('Try to turn them back','设法劝他回头'),if:(s,c)=>c.bad,out:[{w:(s,c)=>s.align>=20?3:1,t:T('It takes a year and nearly costs you an arm. Then one morning they bring back what they stole, all of it.','花了一年，差点搭上一条胳膊。后来一天早上，徒弟把抢来的东西全都还了回去。'),c:'good',fx:{hurt:[5,15],align:4,bond:10,f:(s,c)=>stEnd(s,'stu','redeemed')}},
   {w:2,t:T('They laugh at you. “Too late, Master.”','徒弟大笑：“晚了，师父。”'),c:'bad',fx:{bond:-20,f:(s,c)=>stEnd(s,'stu','villain')}}]},
  {l:T('Stop them, by force','以武力拦下'),if:(s,c)=>c.bad,fight:(s,c)=>({foe:{name:T(c.f.kid.full.py,c.f.kid.full.cn),lv:c.lv,fixed:1},stakes:'injury',title:T('Cleaning your own house','清理门户'),cause:T('fighting your own student','与徒弟反目')}),
   win:[{t:T('You break their sword arm. It is the hardest thing you have ever done.','你废了徒弟的持剑手。这是你这辈子做过最难的事。'),c:'bad',fx:{fame:3,happy:-10,align:3,f:(s,c)=>{const p=c.pid&&person(s,c.pid);if(p){p.rel='enemy';p.bond=5}stEnd(s,'stu','villain')}}}],
   lose:[{t:T('They spare you, which is its own answer.','徒弟饶了你一命。这本身就是答案。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'stu','villain')}}]}]});

/* ===================== 未寄之信 · The Letter Never Sent ===================== */
SDEF('let',{n:T('The Letter Never Sent','未寄之信'),theme:T('A letter someone close to you never sent, and what time does to it.','一个故人生前没寄出的信，和时间对它做了什么。'),
 ends:{reconciled:{n:T('Two people at one grave','坟前的两个人'),tone:'good'},understood:{n:T('A quiet understanding','无声的谅解'),tone:'good'},distance:{n:T('It changed nothing','什么也没改变'),tone:'mixed'},
  unanswered:{n:T('A question never answered','一个永远没有答案的问题'),tone:'mixed'},toolate:{n:T('Too late','晚了一步'),tone:'bad'},burnedtruth:{n:T('Ashes, and the truth','灰烬与实话'),tone:'mixed'},lapsed:{n:T('Still in the drawer','还在抽屉里'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`${r.facts.dead.en}'s letter to ${r.facts.to.en} in ${r.facts.place.en} is still undelivered. (Travel or roam to take it.)`,`${r.facts.dead.zh}写给${r.facts.place.zh}${r.facts.to.zh}的信，还没送到。（下一步：远行或游历）`),
  c:(s,r)=>T(`You delivered ${r.facts.dead.en}'s letter. Whether anything comes of it is up to ${r.facts.to.en}.`,`${r.facts.dead.zh}的信已经送到了。会不会有下文，就看${r.facts.to.zh}了。`),z:null},
 exp:16});
const LET_K=[T('a younger brother they had not spoken to in twenty years','二十年没说过话的弟弟'),T('someone they had once meant to marry','当年差点成亲的人'),T('someone they had wronged long ago','早年对不起过的人')];
const LET_BODY=[T('It is an apology for something said at their mother’s funeral, and an invitation home.','信里为母亲丧礼上说过的一句话道歉，又请对方回家看看。'),
  T('It says they never stopped thinking about the person, and that they were a coward, and are sorry.','信里说一直没忘了对方，说自己当年是个懦夫，对不住。'),
  T('It confesses to something done long ago that cost the other person dearly, and asks nothing in return.','信里承认了多年前做过的一件事，那件事让对方付出了很大代价。信里什么也没求。')];
(()=>{const d0=onDeath;onDeath=function(s,p){d0(s,p);try{if(s.alive&&s.age>=16&&(!s._letPend||s.age-s._letPend.at>3)&&stCan(s,'let')&&['friend','sworn','master','father','mother','sibling','spouse','fellow'].includes(p.rel)&&p.bond>=35&&chance(.45))
  s._letPend={dead:T(p.n.py,p.n.cn),rel:relLabel(s,p),at:s.age}}catch(e){}}})();
SOPEN('let',{w:12,when:s=>!!s._letPend&&s.age-s._letPend.at<=3,
 ctx:s=>{const P=s._letPend,k=rint(0,2),g=chance(.5)?'m':'f',to=genName(k===0?'m':g),regs=REGIONS.filter(r=>r.id!==s.region),pl=pick(regs.length?regs:REGIONS);
  return{dead:P.dead,rel:P.rel,k,to:T(to.py,to.cn),tosex:k===0?'m':g,place:T(pl.en,pl.cn),npc:npc(s,{name:to,sex:k===0?'m':g,age:rint(40,60)})}},
 text:c=>T(`Going through the things of ${c.dead.en}, your ${c.rel.en.toLowerCase()}, you find a letter, sealed and never sent. On the front: “To ${c.to.en}, ${c.place.en}.” It is addressed to ${LET_K[c.k].en}.`,`收拾${c.rel.zh}${c.dead.zh}的遗物时，你翻出一封信，封着口，从没寄出去。信封上写着：“${c.place.zh}　${c.to.zh}　亲启”。收信的是${LET_K[c.k].zh}。`),
 opts:[{l:T('Deliver it yourself','亲自送去'),out:[{t:T('You put it inside your coat.','你把信揣进怀里。'),c:'muted',fx:{f:(s,c)=>{stBegin(s,'let',c,'b',{dead:c.dead,to:c.to,tosex:c.tosex,place:c.place,k:c.k},[0,1]);delete s._letPend}}}]},
  {l:T('Open it first','先拆开看看'),out:[{t:c=>LET_BODY[c.k],c:'muted',fx:{f:(s,c)=>{stBegin(s,'let',c,'b',{dead:c.dead,to:c.to,tosex:c.tosex,place:c.place,k:c.k,read:1},[0,1]);delete s._letPend}}}]},
  {l:T('Put it away for now','先收起来再说'),out:[{t:T('It goes into the bottom of a chest.','信压进了箱底。'),c:'muted',fx:{f:(s,c)=>{stBegin(s,'let',c,'b',{dead:c.dead,to:c.to,tosex:c.tosex,place:c.place,k:c.k,shelved:1},[4,8]);delete s._letPend}}}]},
  {l:T('Burn it','烧了'),out:[{t:T('The dead have had their say. You watch it curl.','死者的话已经说完了。你看着它卷曲成灰。'),c:'muted',fx:{f:(s,c)=>{stBegin(s,'let',c,'z',{dead:c.dead,to:c.to,tosex:c.tosex,place:c.place,k:c.k,burned:1},[8,14]);delete s._letPend}}}]}]});
STI('let','b',{tags:['af_travel','wander'],
 ctx:s=>{const c=stCtx(s,'let');c.late=c.f.shelved&&c.since>=6&&chance(.45);return c},
 text:(c,s)=>{const f=c.f,yrs=s.age-c.r.at,pre=f.shelved?T(`The letter has been in your chest for ${yrs} years. `,`这封信在你箱底压了${cnYrs(yrs)}年。`):T('','');
  if(c.late)return T(`${pre.en}In ${f.place.en} you find the house of ${f.to.en}. A stranger answers: ${f.to.en} died last winter. There is a grown child, who looks at the envelope for a long time.`,`${pre.zh}你在${f.place.zh}找到了${f.to.zh}的家。开门的是个陌生人：${f.to.zh}去年冬天过世了。家里有个已经成人的孩子，盯着那个信封看了很久。`);
  return T(`${pre.en}In ${f.place.en} you find ${f.to.en}, older than you expected. You say whose letter you carry.`,`${pre.zh}你在${f.place.zh}找到了${f.to.zh}，比你想的要老。你说明了这是谁的信。`)},
 opts:[{l:T('Give the child the letter','把信交给那孩子'),if:(s,c)=>c.late,out:[{t:T('“They waited for this,” the child says, and closes the door gently.','“他一直在等这个。”孩子说完，轻轻关上了门。'),c:'bad',fx:{happy:-6,f:(s,c)=>stEnd(s,'let','toolate')}}]},
  {l:T('Hand it over as it is','原样交给对方'),if:(s,c)=>!c.late,out:[{t:T('They read it standing in the doorway. When they look up, they are someone else.','对方站在门口读完了。抬起头来，像是换了一个人。'),c:'muted',fx:{f:(s,c)=>stGo(s,'let','c',{delivered:1},[2,5])}}]},
  {l:T('Soften it: say they were forgiven','说得好听些：说死者早就原谅了一切'),if:(s,c)=>!c.late&&c.f.read,out:[{t:T('You add words that were not in the letter. They are grateful.','你添了些信里没有的话。对方很感激。'),c:'muted',fx:{f:(s,c)=>stGo(s,'let','c',{delivered:1,softened:1},[2,5])}}]},
  {l:T('Say the letter was lost','说信弄丢了'),if:(s,c)=>!c.late&&c.f.read,out:[{t:T('You keep it. Some things, you decide, are better not known.','你把信留下了。你觉得，有些事不知道更好。'),c:'muted',fx:{f:(s,c)=>stGo(s,'let','c',{withheld:1},[3,6])}}]}]});
STI('let','c',{self:1,
 text:(c,s)=>{const f=c.f;return f.withheld?T(`${f.to.en} has come all the way from ${f.place.en} to ask you one thing. “Did ${f.dead.en} ever say anything about me? Anything at all?”`,`${f.to.zh}从${f.place.zh}一路找来，只问你一句：“${f.dead.zh}生前，提起过我吗？哪怕一句？”`)
  :T(`A visitor from ${f.place.en}: ${f.to.en}, carrying incense. “I would like to see the grave.”`,`${f.place.zh}来了位客人：${f.to.zh}，手里拿着香。“我想去坟上看看。”`)},
 opts:[{l:T('Take them to the grave','带对方去坟前'),if:(s,c)=>!c.f.withheld,out:[
   {w:(s,c)=>c.f.softened?1:3,t:T('You stand together a long time. Afterwards they stay three days, and you become friends.','你们在坟前站了很久。之后对方住了三天，你们成了朋友。'),c:'good',fx:{meet:'friend',bond:70,happy:5,f:(s,c)=>stEnd(s,'let','reconciled')}},
   {w:2,t:T('They bow three times and leave without a word. It is enough.','对方磕了三个头，一句话没说就走了。这就够了。'),c:'good',fx:{f:(s,c)=>stEnd(s,'let','understood')}},
   {w:(s,c)=>c.f.softened?3:1,t:T('At the grave they say, “You changed his words, didn’t you? He would never have forgiven me.” They leave.','在坟前，对方说：“你改了他的话，是不是？他不会原谅我的。”说完走了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'let','distance')}}]},
  {l:T('Give them the letter now','把信交出来'),if:(s,c)=>c.f.withheld,out:[{t:T('They read it in your doorway, years too late, and thank you anyway.','对方在你门口读完了，晚了好些年，还是谢了你。'),c:'muted',fx:{align:1,f:(s,c)=>stEnd(s,'let','understood')}}]},
  {l:T('Say no, nothing','说没有，一句也没有'),if:(s,c)=>c.f.withheld,out:[{t:T('They nod as if they expected it, and go.','对方点点头，像是早料到了，走了。'),c:'muted',fx:{align:-1,f:(s,c)=>stEnd(s,'let','unanswered')}}]}]});
STI('let','z',{self:1,
 text:(c,s)=>T(`A stranger from ${c.f.place.en} comes to your door: ${c.f.to.en}. “I heard ${c.f.dead.en} died years ago. Did they ever write to me?”`,`一个从${c.f.place.zh}来的陌生人找上门：${c.f.to.zh}。“听说${c.f.dead.zh}多年前就过世了。他有没有给我写过信？”`),
 opts:[{l:T('Tell the truth: there was a letter, and you burned it','说实话：有过一封，被你烧了'),out:[{t:c=>T(`You tell them what you can remember of it. ${LET_BODY[c.f.k].en} They are angry, then not.`,`你把记得的说了。${LET_BODY[c.f.k].zh}对方先是生气，后来就不气了。`),c:'muted',fx:{align:2,f:(s,c)=>stEnd(s,'let','burnedtruth')}}]},
  {l:T('Say there was nothing','说什么都没有'),out:[{t:T('They thank you for your time.','对方谢过你，走了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'let','unanswered')}}]}]});

/* ===================== 江湖说书人 · The Storyteller ===================== */
SDEF('tale',{n:T('The Storyteller','江湖说书人'),theme:T('A teahouse storyteller makes you a legend, or a villain. The story grows on its own.','茶馆说书人把你说成了英雄，或者魔头。故事自己会长大。'),
 ends:{legend:{n:T('A legend bigger than you','比你本人还大的传说'),tone:'good'},truetale:{n:T('The true story','真实的故事'),tone:'good'},villaintale:{n:T('The villain of the tale','书里的大反派'),tone:'mixed'},
  silenced:{n:T('Every copy bought up','书全被你买断了'),tone:'mixed'},forgotten:{n:T('A tale that faded','故事慢慢没人讲了'),tone:'mixed'},lapsed:{n:T('A tale that faded','故事慢慢没人讲了'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Master ${r.facts.teller.en} is still telling stories about you. (Visit a teahouse.)`,`${r.facts.teller.zh}先生还在茶馆里讲你的故事。（下一步：去茶馆）`),c:(s,r)=>T(`Master ${r.facts.teller.en} is said to be writing a book.`,`听说${r.facts.teller.zh}先生在写书。`)}});
const TALE_V=[T('killed a tiger with a pair of chopsticks and turned down a princess the same afternoon','用一双筷子打死了老虎，当天下午又回绝了公主的婚事'),T('drinks the blood of the men it kills and keeps their ears on a string','喝死人的血，还把人耳朵串成一串挂着')];
SOPEN('tale',{age:[18,75],w:3,tags:['town'],when:s=>s.fame>=15,
 ctx:s=>{const t=genName('m');return{teller:T(t.py.split(' ')[0],t.cn[0]),v:s.align>=20?0:s.align<=-20?1:(chance(.5)?0:1)}},
 text:(c,s)=>T(`At the teahouse, Master ${c.teller.en} slaps the table: “…and that is how ${s.name}” (you nearly drop your cup) “${TALE_V[c.v].en}!” The room roars.`,`茶馆里，${c.teller.zh}先生一拍醒木：“……这就是${s.cn}”，你差点把茶碗掉了，“${TALE_V[c.v].zh}！”满堂喝彩。`),
 opts:[{l:T('Stand up and correct him','站起来当众纠正'),out:[{t:T('The room laughs at you, not with you. The storyteller asks, very politely, to speak with you afterwards.','满堂哄笑，笑的是你。说书先生客客气气地说，散场后想跟你聊聊。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'tale',c,'b',{teller:c.teller,v:c.v,corrected:1},[0,1])}}]},
  {l:T('Slip him 20 taels to make it grander','塞二十两，让他讲得更威风'),cost:20,if:(s,c)=>c.v===0,out:[{t:T('By next week you have killed two tigers.','下个礼拜，你打死的老虎变成了两只。'),c:'muted',fx:{fame:2,f:(s,c)=>stBegin(s,'tale',c,'b',{teller:c.teller,v:c.v,paid:1},[1,3])}}]},
  {l:T('Smile and let it be','笑笑，由他去'),out:[{t:T('You pay for your tea and leave him to it.','你付了茶钱，由他讲去。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'tale',c,'b',{teller:c.teller,v:c.v,let:1},[1,3])}}]},
  {l:T('Have a word with him after, in the alley','散场后去巷子里跟他“聊聊”'),out:[{t:T('He promises to stop. He does not look you in the eye.','他保证不再讲了，眼睛却不敢看你。'),c:'bad',fx:{align:-3,f:(s,c)=>stBegin(s,'tale',c,'b',{teller:c.teller,v:c.v,threat:1},[1,3])}}]}]});
STI('tale','b',{tags:['town','wander'],
 ctx:s=>{const c=stCtx(s,'tale');c.lv=stFoe(s,1,10);const ch=genName('m');c.ch=T(ch.py,ch.cn);return c},
 text:(c,s)=>{const f=c.f;
  if(f.corrected)return T(`Master ${f.teller.en} finds you. “The true story, then. I will tell it exactly as you say. But I warn you: true stories sell worse.”`,`${f.teller.zh}先生找到了你。“那就讲真的吧。你怎么说，我就怎么讲。不过丑话说在前头：真事不好卖。”`);
  if(f.threat)return T(`Master ${f.teller.en} has a new story: a bully who threatens old storytellers in alleys. Everyone knows who he means.`,`${f.teller.zh}先生换了个新段子：有个恶霸，专在巷子里吓唬说书的老头。谁都知道他说的是谁。`);
  if(f.v===1)return T(`A family turns up at your door, furious: their uncle, they say, was one of the men in the story whose ears you took. There never was any such man, but they have walked four days.`,`有一家人怒气冲冲地找上门：说他们叔叔就是书里被你割了耳朵的那个人。根本没有这个人，可他们走了四天的路。`);
  return T(`A young swordsman named ${c.ch.en} has come a long way to find the hero who kills tigers with chopsticks. He would like a demonstration, on himself.`,`一个叫${c.ch.zh}的年轻剑客远道而来，要找那位用筷子打死老虎的大侠。他想亲身领教一下。`)},
 opts:[{l:T('Tell it all, the shameful parts too','全讲，丢人的也讲'),if:(s,c)=>c.f.corrected,out:[{t:T('He writes for three nights. You did not know you remembered so much.','他记了三个晚上。你都不知道自己记得这么多。'),c:'good',fx:{smarts:2,f:(s,c)=>stGo(s,'tale','c',{truth:1},[4,8])}}]},
  {l:T('Give him a polished version','讲个体面的版本'),if:(s,c)=>c.f.corrected,out:[{t:T('He nods, and writes, and you both know.','他点头记下，你们心照不宣。'),c:'muted',fx:{f:(s,c)=>stGo(s,'tale','c',{polish:1},[4,8])}}]},
  {l:T('Apologise to him, with 30 taels','给他赔个不是，再给三十两'),if:(s,c)=>c.f.threat,cost:30,out:[{t:T('He takes the money and, after a while, the apology.','他收了钱。过了一阵，也收下了这个歉意。'),c:'good',fx:{align:2,f:(s,c)=>stGo(s,'tale','c',{apologised:1},[4,8])}}]},
  {l:T('Lean on him harder','再吓他一回'),if:(s,c)=>c.f.threat,out:[{t:T('He stops telling the story. Everyone else starts.','他不讲了，别人全讲开了。'),c:'bad',fx:{align:-3,fame:2,f:(s,c)=>stGo(s,'tale','c',{threat2:1},[4,8])}}]},
  {l:T('Talk it through with the family','跟那家人把话说开'),if:(s,c)=>!c.f.corrected&&!c.f.threat&&c.f.v===1,out:[{w:(s,c)=>1+s.smarts/40,t:T('It takes all day. They leave believing you, mostly.','费了一整天。他们走的时候，大体上信了你。'),c:'good',fx:{f:(s,c)=>stGo(s,'tale','c',{},[4,8])}},{w:1,t:T('They leave believing the story.','他们走的时候，还是信那个故事。'),c:'muted',fx:{fame:1,f:(s,c)=>stGo(s,'tale','c',{},[4,8])}}]},
  {l:T('Show him a tiger-killer','让他见识见识'),if:(s,c)=>!c.f.corrected&&!c.f.threat&&c.f.v===0,fight:(s,c)=>({foe:{name:c.ch,lv:c.lv,fixed:1},stakes:'light',title:T('Living up to the story','名不虚传？'),cause:T('a challenge','比试')}),
   win:[{t:T('He goes away and tells everyone the story is true. Now there are three tigers.','他回去逢人便说那故事是真的。现在老虎变成三只了。'),c:'good',fx:{fame:3,f:(s,c)=>stGo(s,'tale','c',{},[4,8])}}],
   lose:[{t:T('He goes away and tells everyone the story is a lie.','他回去逢人便说那故事是假的。'),c:'muted',fx:{fame:-3,f:(s,c)=>stGo(s,'tale','c',{shamed:1},[4,8])}}]},
  {l:T('Laugh it off','一笑了之'),if:(s,c)=>!c.f.corrected&&!c.f.threat,out:[{t:T('Nobody leaves satisfied, but nobody is hurt.','谁都不太满意，好在谁也没受伤。'),c:'muted',fx:{f:(s,c)=>stGo(s,'tale','c',{},[4,8])}}]}]});
STI('tale','c',{tags:['town'],self:1,
 ctx:s=>{const c=stCtx(s,'tale');const f=c.f;c.kind=f.truth||f.apologised?'true':f.threat2||(f.v===1&&!f.corrected)?'villain':f.shamed?'faded':'legend';return c},
 text:(c,s)=>{const t={true:T(`a plain, honest book that sells slowly and is still being read`,`一本朴实的书，卖得慢，却一直有人在读`),legend:T(`a thick book of wonders, half of which you have never done`,`厚厚一本奇事，一半你压根没干过`),villain:T(`a book in which you are the villain, and a very good one`,`一本把你写成大反派的书，而且写得很精彩`),faded:T(`a thin book nobody much buys`,`薄薄一本，没什么人买`)}[c.kind];
  return T(`Master ${c.f.teller.en} has finished it: “The Tale of ${s.name}”. It is ${t.en}.`,`${c.f.teller.zh}先生的书写成了：《${s.cn}传》。是${t.zh}。`)},
 opts:[{l:T('Let it be read','由它流传'),out:[{t:T('It is your life, or something like it, in other people’s hands now.','那是你的人生，或者差不多是。如今它在别人手里了。'),c:'gold',fx:{f:(s,c)=>{const e={true:'truetale',legend:'legend',villain:'villaintale',faded:'forgotten'}[c.kind];applyFx(s,{fame:{truetale:4,legend:7,villaintale:5,forgotten:0}[e],align:e==='villaintale'?-3:0},c);if(e!=='forgotten')deed(s,`Became the subject of “The Tale of ${s.name}”`,`成了《${s.cn}传》里的人物`);stEnd(s,'tale',e)}}}]},
  {l:T('Buy up every copy (100 taels)','把书全部买断（一百两）'),cost:100,out:[{t:T('You burn a cartload of books in your yard. A few copies are already in other provinces.','你在院子里烧了一车书。还是有几本，已经流到外省去了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'tale','silenced')}}]}]});

/* ===================== 师门旧案 · The Sect's Old Case ===================== */
SDEF('case',{n:T('The Sect’s Old Case','师门旧案'),theme:T('An old disgrace in your own sect does not add up. Clues come from different places; act too early and you may blame the wrong person.','门中一桩旧案对不上。线索散在各处；太早下定论，可能冤枉好人。'),
 ends:{exposed:{n:T('The truth, in front of everyone','当众真相大白'),tone:'good'},amends:{n:T('Quiet amends','暗中补偿'),tone:'good'},buried:{n:T('You took the deal','你收下了封口'),tone:'bad'},
  wrongful:{n:T('You accused the wrong person','冤枉了好人'),tone:'bad'},silenced:{n:T('Silenced','被压了下去'),tone:'bad'},cold:{n:T('A cold case','悬案'),tone:'mixed'},lapsed:{n:T('A cold case','悬案'),tone:'mixed'}},
 hint:{c1:T('Someone in the sect may remember that night. (Do sect chores or visit a teahouse.)','门里或许有人记得那一夜。（下一步：门派杂务或去茶馆）'),c2:(s,r)=>T(`Find ${r.facts.acc.en}, the disciple who was expelled. (Travel or roam.)`,`去找当年被逐出师门的${r.facts.acc.zh}。（下一步：远行或游历）`),v:T('You know enough to act. (Do sect chores or a sect mission.)','你知道的已经够下决断了。（下一步：门派杂务或门派任务）')},
 check:(s,r)=>{if(s.sect!==r.facts.sect){say(s,'Having left the sect, you can no longer reach its old records. The case goes cold.','离开了师门，旧卷宗再也碰不到了。这桩案子成了悬案。','muted');stEnd(s,'case','cold');return false}},
 exp:10,lapse:T('You let the old case lie. Nobody else will reopen it.','你没再追查那桩旧案。往后也不会有人再提了。')});
SOPEN('case',{age:[17,60],w:4,tags:['af_sectchores','af_sectmission'],when:s=>!!s.sect&&s.rank>=1,
 ctx:s=>{const a=genName(chance(.7)?'m':'f'),m=masterOf(s),cul=m&&chance(.35)?'master':chance(.7)?'elder':'dead',e=genName('m');
  return{acc:T(a.py,a.cn),accN:a,cul,culN:cul==='master'?T(m.n.py,m.n.cn):T(e.py,e.cn),mpid:cul==='master'?m.id:null,yrs:rint(12,22),item:pick([T('the Inner Scripture','内门心法'),T('the founder’s jade seal','祖师玉印'),T('a phial of the sect’s secret medicine','门中秘药')])}},
 text:(c,s)=>T(`Cleaning the archive, you find the record of an old disgrace: ${c.yrs} years ago a disciple named ${c.acc.en} was expelled for stealing ${c.item.en}. But the duty roster from that same night puts ${c.acc.en} on the far gate, an hour’s walk away.`,`整理藏卷时，你翻到一桩旧案：${cnYrs(c.yrs)}年前，一名叫${c.acc.zh}的弟子因偷了${c.item.zh}被逐出师门。可同一夜的值守簿上写着，${c.acc.zh}守的是后山门，离那儿有一个时辰的路。`),
 opts:[{l:T('Look into it quietly','悄悄查下去'),out:[{t:T('You copy the page and put the book back exactly where it was.','你把那页抄了下来，原样放回。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'case',c,'c1',{acc:c.acc,accN:c.accN,cul:c.cul,culN:c.culN,mpid:c.mpid,item:c.item,sect:s.sect,yrs:c.yrs},[0,1])}}]},
  {l:T('Report it to your master','禀告师父'),out:[{t:(c,s)=>c.cul==='master'?T('Your master reads it, goes very still, and tells you old matters are best left alone.','师父看完，一动不动地坐了好一会儿，说陈年旧事，不必再提。'):T('Your master frowns and says to look into it, carefully.','师父皱了皱眉，让你小心查一查。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'case',c,'c1',{acc:c.acc,accN:c.accN,cul:c.cul,culN:c.culN,mpid:c.mpid,item:c.item,sect:s.sect,yrs:c.yrs,reported:1,warned:c.cul==='master'?1:0},[0,1])}}]},
  {l:T('Old matters. Leave it','陈年旧事，算了'),out:[{t:T('You put the book back.','你把卷宗放了回去。'),c:'muted'}]}]});
STI('case','c1',{tags:['af_sectchores','town'],
 text:c=>c.f.warned?T(`You go looking for the old cook who served that year, and find she was sent away to a farm last month, quite suddenly.`,`你去找那年在伙房的老厨娘，才知道她上个月突然被打发到庄子上去了。`)
  :T(`The old cook remembers that night: “Not ${c.f.acc.en}. I saw someone come out of the hall with a bundle, in ${c.f.cul==='dead'?'the robes of a senior who died the next spring':'senior’s robes'}. I was told to forget it.”`,`老厨娘记得那一夜：“不是${c.f.acc.zh}。我看见有人抱着包袱从大殿出来，穿的是${c.f.cul==='dead'?'一位第二年开春就过世了的师叔的衣裳':'长辈的衣裳'}。后来有人叫我忘了这事。”`),
 opts:[{l:T('Ask who told her to forget','问是谁叫她忘了的'),if:(s,c)=>!c.f.warned,out:[{t:c=>c.f.cul==='dead'?T('“Doesn’t matter now. He’s in the ground.”','“如今说也无妨，人都入土了。”'):T(`She whispers a name: ${c.f.culN.en}.`,`她压低声音说了个名字：${c.f.culN.zh}。`),c:'gold',fx:{f:(s,c)=>stGo(s,'case','c2',{clue1:1},[1,2])}}]},
  {l:T('Thank her and leave it there','谢过她，不再多问'),if:(s,c)=>!c.f.warned,out:[{t:T('It is enough to know it was not the boy.','知道不是那孩子干的，就够了。'),c:'muted',fx:{f:(s,c)=>stGo(s,'case','c2',{half:1},[1,2])}}]},
  {l:T('Note who sent her away','记下是谁把她打发走的'),if:(s,c)=>c.f.warned,out:[{t:T('The order was signed by your master.','手令上是师父的名字。'),c:'gold',fx:{f:(s,c)=>stGo(s,'case','c2',{clue1:1},[1,2])}}]}]});
STI('case','c2',{tags:['af_travel','wander'],
 text:(c,s)=>T(`You find ${c.f.acc.en} running a ferry, missing two fingers. At your sect’s name they go pale, then listen. At the end: “I always knew. I could never prove it.”`,`你找到了${c.f.acc.zh}，在渡口撑船，少了两根手指。听到你师门的名字，对方脸色一白，还是听你说完了。“我一直知道。只是拿不出证据。”`),
 opts:[{l:T('Ask for everything they remember','请对方把记得的都说出来'),out:[{t:T('A detail about a boot-print in the snow, and who was the only one in the sect with boots like that.','雪地里一个靴印，以及门里只有谁才穿那样的靴子。'),c:'gold',fx:{f:(s,c)=>stGo(s,'case','v',{clue2:1},[0,2])}}]},
  {l:T('Promise to clear their name','答应替对方洗清冤屈'),out:[{t:T('They do not believe you, and thank you anyway.','对方不信，还是谢了你。'),c:'muted',fx:{f:(s,c)=>stGo(s,'case','v',{clue2:1,promised:1},[0,2])}}]},
  {l:T('Leave them money and go (30 taels)','留下银子就走（三十两）'),cost:30,out:[{t:T('They take it without looking at you.','对方收下了，没看你。'),c:'muted',fx:{align:1,f:(s,c)=>stGo(s,'case','v',{paid:1},[0,2])}}]}]});
const caseClues=f=>(f.clue1?1:0)+(f.clue2?1:0)+(f.half?.5:0);
STI('case','v',{tags:['af_sectchores','af_sectmission'],self:1,
 ctx:s=>{const c=stCtx(s,'case');c.cl=caseClues(c.f);c.lv=c.f.cul==='master'?Math.max(stFoe(s,1.1),(person(s,c.f.mpid)||{}).lv||0):stFoe(s,1.05,15);return c},
 text:c=>T(`You have ${c.cl>=2?'enough to be sure':c.cl>=1?'something, but not proof':'only a feeling'}. ${c.f.cul==='dead'?'The one who did it is dead.':`${c.f.culN.en} is ${c.f.cul==='master'?'your own master':'an elder of the sect'}.`} The sect gathers for the spring rites tomorrow.`,
  `你手里的东西${c.cl>=2?'足以确定':c.cl>=1?'有一些，但算不上铁证':'只够一个直觉'}。${c.f.cul==='dead'?'真凶已经死了。':`${c.f.culN.zh}是${c.f.cul==='master'?'你自己的师父':'门中的长老'}。`}明天，全门上下要聚在一起行春祭。`),
 opts:[{l:T('Speak up at the rites, in front of everyone','在春祭上当众说出来'),out:[
   {w:(s,c)=>c.cl>=2?6:c.cl>=1?2:1,t:c=>T(`You lay it all out. ${c.f.cul==='dead'?'The dead senior’s name is struck from the hall.':c.f.culN.en+' does not deny it.'} ${c.f.acc.en}'s name is restored.`,`你把来龙去脉一一摆出。${c.f.cul==='dead'?'那位已故师叔的名字被从祠堂里除了。':c.f.culN.zh+'没有否认。'}${c.f.acc.zh}的名字恢复了。`),c:'gold',fx:{fame:4,align:5,f:(s,c)=>{sAdj(s,c.f.sect,c.f.cul==='master'?-4:6);if(c.f.cul==='master'){const p=person(s,c.f.mpid);if(p){p.rel='acq';p.bond=10}}stEnd(s,'case','exposed')}}},
   {w:(s,c)=>c.cl>=2?0:c.cl>=1?2:4,t:T('It falls apart under questions. The person you named turns out to have been elsewhere that night. You have accused an innocent.','几句追问下来就站不住了。你点名的人那一夜根本不在场。你冤枉了好人。'),c:'bad',fx:{fame:-4,f:(s,c)=>{sAdj(s,c.f.sect,-8);stEnd(s,'case','wrongful')}}}]},
  {l:T('Confront them privately','私下对质'),if:(s,c)=>c.f.cul!=='dead',fight:(s,c)=>({foe:{name:c.f.culN,lv:c.lv,fixed:1},stakes:'injury',title:T('The old case','旧案'),cause:T('an old case in the sect','师门旧案')}),
   win:[{t:c=>T(`Beaten, ${c.f.culN.en} confesses, and you make them confess again in front of the sect.`,`${c.f.culN.zh}败了，认了罪。你逼着对方在全门上下面前再认一遍。`),c:'gold',fx:{fame:3,align:4,f:(s,c)=>{sAdj(s,c.f.sect,2);stEnd(s,'case','exposed')}}}],
   lose:[{t:T('You wake in your room with a broken rib. The archive page you copied is gone. Nobody will speak of it.','你在自己屋里醒来，断了一根肋骨。你抄的那页纸不见了。没人再提这件事。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.f.sect,-3);stEnd(s,'case','silenced')}}}]},
  {l:T('Accept what they offer to keep quiet','收下对方的封口'),if:(s,c)=>c.f.cul!=='dead'&&c.cl>=1,out:[{t:c=>T(`${c.f.culN.en} arranges a promotion and a purse. ${c.f.promised?`You think of ${c.f.acc.en} on the ferry.`:''}`,`${c.f.culN.zh}替你安排了一次升迁，外加一袋银子。${c.f.promised?`你想起了渡口上的${c.f.acc.zh}。`:''}`),c:'bad',fx:{money:[120,260],align:-6,f:(s,c)=>{sAdj(s,c.f.sect,3);stEnd(s,'case','buried')}}}]},
  {l:T('Say nothing, and quietly look after the ferryman (80 taels)','不声张，暗中照顾渡口那人（八十两）'),cost:80,out:[{t:c=>T(`Every year from now on, money reaches ${c.f.acc.en} with no name on it.`,`此后每年，都有一笔不署名的钱送到${c.f.acc.zh}手里。`),c:'good',fx:{align:3,f:(s,c)=>stEnd(s,'case','amends')}}]}]});

/* ===================== 残页 · The Missing Page ===================== */
SDEF('page',{n:T('The Missing Page','残页'),theme:T('A damaged manual with a page torn out and two hands arguing in the margins.','一本缺了一页的残谱，页边两种笔迹在打架。'),
 ends:{complete:{n:T('The art made whole','补全了武功'),tone:'good'},shared:{n:T('Shared with the jianghu','公之于江湖'),tone:'good'},partial:{n:T('Half an art','只练成了一半'),tone:'mixed'},
  flawed:{n:T('Trained it wrong','练岔了'),tone:'bad'},open:{n:T('A mystery left open','留下一个谜'),tone:'mixed'},lapsed:{n:T('A mystery left open','留下一个谜'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`The damaged copy of ${r.facts.art.n} is on your desk. (Read or study.)`,`残缺的《${r.facts.art.cn}》还在你案头。（下一步：研读或读书）`),c:(s,r)=>T(`Somewhere is the missing page of ${r.facts.art.n}. (Travel, roam or visit a town.)`,`《${r.facts.art.cn}》缺的那一页，总在什么地方。（下一步：远行、游历或进城）`),
  d:(s,r)=>T(`Time to train ${r.facts.art.n} properly. (Practise or go into seclusion.)`,`该好好练练《${r.facts.art.cn}》了。（下一步：练功或闭关）`)},
 exp:10,lapseF:(s,r)=>{say(s,`The damaged manual of ${r.facts.art.n} gathers dust. You never learn what was on the missing page.`,`《${r.facts.art.cn}》残卷落满了灰。缺的那一页上写了什么，你终究没能知道。`,'muted');stEnd(s,'page','open')}});
const PAGE_ARTS=[['Cold River Sword','寒江剑谱','kuaijian'],['Ninefold Return Art','九转归元功','heal'],['Plum-Breaking Hand','折梅手','dianxue'],['Drifting Cloud Step','流云步','lingbo'],['Thunder Palm','惊雷掌','neishang'],['Coiled Dragon Staff','盘龙棍法','lianhuan']];
SOPEN('page',{age:[14,70],w:3,tags:['town'],when:s=>s.smarts>=25,
 ctx:s=>{const a=pick(PAGE_ARTS.filter(x=>!s.arts.some(y=>y.cn===x[1])))||PAGE_ARTS[0];return{art:{n:a[0],cn:a[1],sk:a[2]}}},
 text:c=>T(`At a bookstall, under a pile of almanacs: a manual of ${c.art.n}, water-stained, with a page torn out. The margins are full of notes in two inks, red and black, and they disagree with each other.`,`书摊上，一摞黄历底下压着一本《${c.art.cn}》，泡过水，缺了一页。页边密密麻麻写满批注，红墨和黑墨两种笔迹，彼此唱反调。`),
 opts:[{l:T('Buy it (30 taels)','买下（三十两）'),cost:30,out:[{t:T('The stallholder seems glad to be rid of it.','摊主像是巴不得脱手。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'page',c,'b',{art:c.art},[0,1])}}]},
  {l:T('Copy what you can, standing there','站在摊前，能抄多少抄多少'),out:[{t:T('You get most of it before the stallholder chases you off.','摊主赶人之前，你抄下了大半。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'page',c,'b',{art:c.art,copied:1},[0,1])}}]},
  {l:T('Leave it','不感兴趣'),out:[{t:T('Someone else will buy it.','自会有别人买的。'),c:'muted'}]}]});
STI('page','b',{tags:['af_read','af_study','af_seclusion'],
 text:c=>T(`You work through ${c.f.art.n}. At the crucial passage, the red ink says “drive the qi through the shoulder, hard,” and the black ink beside it says “never.” The page that would settle it is the missing one.`,`你一页页啃《${c.f.art.cn}》。到了关键一段，红墨写着“气走肩井，猛冲”，旁边的黑墨只有两个字：“万万不可”。能定夺的那一页，偏偏缺了。`),
 opts:[{l:T('Follow the red ink','照红墨练'),out:[{t:T('Progress is fast. Too fast, maybe.','进境很快。也许太快了。'),c:'muted',fx:{skill:[1,3],f:(s,c)=>stGo(s,'page','c',{ink:'red'},[1,3])}}]},
  {l:T('Follow the black ink','照黑墨练'),out:[{t:T('Slow, and nothing seems to happen.','进展很慢，像是什么也没发生。'),c:'muted',fx:{f:(s,c)=>stGo(s,'page','c',{ink:'black'},[1,3])}}]},
  {l:T('Take it to a scholar (20 taels)','拿去请教一位老学究（二十两）'),cost:20,out:[{w:(s,c)=>s.smarts/30,t:T('The old man holds it to the light. “The red ink is twenty years younger than the book. Someone added it.”','老先生把书对着光看了看。“红墨比这书晚了二十年。是后人添上去的。”'),c:'gold',fx:{f:(s,c)=>stGo(s,'page','c',{ink:'black',scholar:1},[1,3])}},
   {w:1,t:T('He talks for an hour and settles nothing.','他讲了一个时辰，什么也没讲清楚。'),c:'muted',fx:{f:(s,c)=>stGo(s,'page','c',{},[1,3])}}]}]});
STI('page','c',{tags:['af_travel','wander','town'],
 ctx:s=>{const c=stCtx(s,'page');c.who=rint(0,2);return c},
 text:c=>T(`${['In a mountain temple, an old monk','At an auction, a rich collector','In a village, the grandson of the manual’s first owner'][c.who]} has a single loose page: the missing page of ${c.f.art.n}.`.replace(/^./,x=>x.toUpperCase()),`${['山中古寺里，一位老和尚','一场拍卖会上，一个阔气的藏家','一个村子里，这本书原主人的孙子'][c.who]}手里，有一张散页：正是《${c.f.art.cn}》缺的那一页。`),
 opts:[{l:T('Buy it (80 taels)','买下（八十两）'),cost:80,out:[{t:T('You hold the two halves together. They fit.','你把两半对在一起。严丝合缝。'),c:'gold',fx:{f:(s,c)=>stGo(s,'page','d',{page:1},[0,1])}}]},
  {l:T('Offer a copy of your half in trade','拿你那半本的抄本交换'),out:[{t:T('They agree. Now there are two complete copies in the world, and one is not yours.','对方答应了。如今世上有了两本完整的，其中一本不归你。'),c:'good',fx:{f:(s,c)=>stGo(s,'page','d',{page:1,shared:1},[0,1])}}]},
  {l:T('Take it when no one is looking','趁人不注意拿走'),out:[{w:3,t:T('Nobody sees.','没人看见。'),c:'bad',fx:{align:-5,f:(s,c)=>stGo(s,'page','d',{page:1,stolen:1},[0,1])}},{w:1,t:T('You are seen, and chased, and keep it anyway.','被人看见了，一路追打，你还是攥着没撒手。'),c:'bad',fx:{align:-5,wanted:1,hurt:[5,12],cause:T('a theft gone wrong','偷东西失了手'),f:(s,c)=>stGo(s,'page','d',{page:1,stolen:1},[0,1])}}]},
  {l:T('Let it go. Make do without','算了，没有也罢'),out:[{t:T('You will have to work out the rest yourself.','剩下的只能靠自己琢磨了。'),c:'muted',fx:{f:(s,c)=>stGo(s,'page','d',{},[0,1])}}]}]});
STI('page','d',{tags:['af_practice','af_seclusion','af_meditate'],self:1,
 text:c=>{const f=c.f;return f.page?T(`With the missing page in hand, the passage reads plainly: ${f.ink==='red'?'the red ink was wrong, and you have been training it backwards':'the black ink was right'}.`,`有了缺页，那一段一目了然：${f.ink==='red'?'红墨是错的，你一直在倒着练':'黑墨说得对'}。`)
  :T(`You train ${f.art.n} as best you can, filling the gap with guesses.`,`你尽力去练《${f.art.cn}》，缺的地方只能靠猜。`)},
 opts:[{l:T('Train it properly now','从头好好练'),out:[{t:(c,s)=>{const f=c.f;return f.page&&f.ink==='red'?T('Undoing a year’s wrong habits hurts, but it works.','改掉一年的错练法很疼，但改过来了。'):f.page?T('It comes together.','融会贯通。'):f.ink==='red'?T('Something tears in your shoulder. Qi deviation (走火入魔).','肩井一阵撕裂般的剧痛。你走火入魔了。'):T('It works, up to a point, and then nothing.','练到某个地步就再也上不去了。')},
   c:'gold',fx:(s,c)=>{const f=c.f,A=f.art,end=f.page?(f.shared?'shared':'complete'):f.ink==='red'?'flawed':'partial';const tier=end==='complete'||end==='shared'?(s.smarts>=60||f.scholar?2:1):0;
    const e={art:{n:A.n,cn:A.cn,tier,sk:A.sk},f:(s,c)=>{if(end==='shared')s.fame+=4;stEnd(s,'page',end)}};if(end==='flawed'){e.hurt=[18,34];e.cause=T('qi deviation','走火入魔');e.maxHealth=-6}if(f.page&&f.ink==='red'){e.hurt=[5,12];e.cause=T('qi deviation','走火入魔')}return e}}]}]});
