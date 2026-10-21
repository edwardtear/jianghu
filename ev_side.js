/* 江湖一生 · incidents: side roads — standalone road, town, sect, job and regional stories, plus small callbacks */
'use strict';
const S2W=['wander'],S2T=['town'];
const s2gap=(f,n)=>s=>s.flags[f]!=null&&s.age-s.flags[f]>=n;
const s2sect=s=>s.sect?T(SECTS[s.sect].en,SECTS[s.sect].cn):T('your sect','本门');

/* ====================== jianghu & the road ====================== */
I({id:'s2_plankbridge',age:[16,60],tags:S2W,cd:12,ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:rint(25,45)});return c},
 text:c=>T(`A swordsman, ${c.npc.en}, sits cross-legged in the middle of a one-plank bridge. "Answer one question or beat me. Otherwise, swim."`,`游侠${c.npc.zh}盘腿坐在独木桥正中。"答我一问，或者打赢我。不然就游过去。"`),
 opts:[{l:T('Hear the question','听他出题'),out:[{w:s=>s.smarts/20,t:T('"What is heavier, a sword or a promise?" You say, "The one you carry longest." He bows and steps aside.','"剑重还是诺重？"你答："背得最久的那个。"他起身作揖，让开了路。'),c:'good',fx:{smarts:2,fame:1}},
   {w:2,t:T('He asks what he had for breakfast. You get it wrong. He laughs so hard he falls off the bridge.','他问你他早饭吃了什么。你答错了。他笑得从桥上翻了下去。'),fx:{happy:4}},
   {w:1,t:T('The question has no answer. You argue until dark and part as friends.','那题根本无解。你们争到天黑，竟成了朋友。'),c:'good',fx:{meet:'friend',bond:55}}]},
  {l:T('Fight him on the plank','在桥上过招'),fight:FG(PW(1.0,4),'light',T('The one-plank bridge','独木桥上'),T('a fall from a plank bridge','从独木桥上跌落')),
   win:[{t:T('He goes into the river with a splash and climbs out grinning. "Good footwork."','他扑通一声落了水，爬上来时咧嘴笑："好步法。"'),c:'good',fx:{fame:2,skill:1}}],
   lose:[{t:T('You go into the river. Your boots float away in different directions.','你掉进了河里，两只靴子各漂各的。'),c:'bad',fx:{happy:-3}}]},
  {l:T('Swim across','游过去'),out:[{w:2,t:T('Cold, wet, and spared the conversation.','又冷又湿，但省了口舌。'),c:'muted',fx:{happy:-1}},{w:1,t:T('Halfway across you catch a fat carp with your bare hands. Dinner.','游到一半，你空手抓了条大鲤鱼。晚饭有着落了。'),c:'good',fx:{happy:3}}]}]});

I({id:'s2_wrongroom',age:[16,50],tags:S2W,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:14,sex:'f',age:rint(20,32)});return c},
 text:c=>T(`Tired from the road, you open the wrong door at an inn. A woman in black, ${c.npc.en}, is counting a pile of pearls by candlelight. Neither of you moves.`,`赶了一天路，你在客栈推错了门。一个黑衣女子正就着烛光数一堆珍珠——她叫${c.npc.zh}。你们谁都没动。`),
 opts:[{l:T('Apologise and back out','道个歉退出去'),out:[{w:2,t:T('By dawn she is gone. Her window is open, and one pearl sits on your pillow.','天亮时她已不见了。窗户开着，你枕头上放着一颗珍珠。'),c:'good',fx:{money:30,flag:'s2_pearlthief'}},
   {w:1,t:T('The constables search the inn at noon. You say nothing. You never quite know why.','中午捕快来搜店，你一个字也没说。你自己也说不清为什么。'),c:'muted',fx:{align:-1,flag:'s2_pearlthief'}}]},
  {l:T('Pretend to be drunk','装醉'),out:[{w:2,t:T('You sing a bawdy song and sway. She helps you to your room, kindly, and takes your purse on the way. "Bad actor," says a note.','你唱着荤曲摇摇晃晃。她好心扶你回房，顺手摸走了你的钱袋。留了张字条："演得真差。"'),fx:{money:[-25,-5],happy:2,flag:'s2_pearlthief'}},
   {w:1,t:T('You overdo it and actually fall asleep in her doorway. She steps over you all night.','你装过了头，真在她门口睡着了。她跨过你进出了一整夜。'),c:'muted'}]},
  {l:T('Seize the pearls','夺下珍珠'),fight:FG(PW(1.05,5),'injury',T('Pearls by candlelight','烛下明珠'),T('a thief’s hidden blade','女贼的袖中刀')),
   win:[{t:T('You hand the pearls to the magistrate. The jeweller weeps and pays a reward.','你把珍珠交给了县衙。珠宝商喜极而泣，赏了你一笔银子。'),c:'good',fx:{money:60,align:4,fame:2}}],
   lose:[{t:T('She is out of the window before you hit the floor.','你还没倒地，她已经翻窗走了。'),c:'bad'}]}]});

I({id:'s2_maskmaker',age:[16,60],tags:S2W,cd:15,ctx:s=>{const c=scene();c.npc=npc(s,{occ:30,age:rint(55,75)});return c},
 text:c=>T(`An old mask-maker, ${c.npc.en}, offers to make you a face so good your own mother would walk past you. Free, if you wear it for a day and tell him what happens.`,`老面具匠${c.npc.zh}说能给你做一张脸，好到亲娘都认不出你。不要钱，只要你戴一天，回来讲给他听。`),
 opts:[{l:T('Wear the face','戴上'),out:[{w:2,t:T('A woman slaps you, kisses you, then walks off crying. You never learn who you were.','一个女人扇了你一巴掌，又亲了你一口，哭着走了。你始终不知道自己扮的是谁。'),fx:{happy:2}},
   {w:2,t:T('Guards bow to you all day. The face belongs to the prefect’s nephew. You eat four free lunches.','卫兵整天对你鞠躬。这张脸是知府的侄子。你白吃了四顿午饭。'),c:'good',fx:{money:15,happy:4}},
   {w:1,t:T('Three debt collectors recognise the face. You run until the glue melts.','三个讨债的认出了这张脸。你一路狂奔，跑到胶都化了。'),c:'bad',fx:{hurt:[3,8],cause:T('someone else’s debts','替别人挨的债')}},
   {w:1,t:T('Nobody looks at you twice all day. It is the most peaceful day of your life.','一整天没人多看你一眼。那是你一生中最安宁的一天。'),c:'good',fx:{happy:6,qi:2}}]},
  {l:T('Decline politely','婉拒'),out:[{t:T('"Pity," he says. "You have a very borrowable face."','"可惜，"他说，"你这张脸很适合借用。"'),c:'muted'}]}]});

I({id:'s2_blindsunset',age:[16,60],tags:S2W,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(70,90)});return c},
 text:c=>T(`On a hilltop, a blind old man, ${c.npc.en}, asks you to describe the sunset to him.`,`山顶上，一位盲眼老人${c.npc.zh}请你把落日讲给他听。`),
 opts:[{l:T('Describe it plainly','照实说'),out:[{w:2,t:T('He nods along. Then he teaches you to breathe "the way the sun goes down: slowly, without regret."','他边听边点头，然后教你吐纳："像太阳落山那样，慢，不留恋。"'),c:'good',fx:{qi:4}},{w:1,t:T('He says, "Thank you," and falls asleep. You watch the rest alone.','他说了声"多谢"就睡着了。剩下的落日你独自看完。'),c:'muted',fx:{happy:2}}]},
  {l:T('Make it a poem','说成一首诗'),out:[{w:s=>s.smarts/25,t:T('He weeps. "I was a swordsman once. I had forgotten red." He shows you one move, slowly, with his cane.','他哭了。"我从前是个剑客，早忘了红色是什么样。"他用拐杖慢慢比给你一招。'),c:'gold',fx:{skill:3,align:2}},{w:2,t:T('"Too many words," he says. "The sun is not that complicated."','"话太多了，"他说，"太阳没那么复杂。"'),fx:{smarts:1}}]},
  {l:T('Tell him it is raining','骗他说在下雨'),out:[{t:T('"It is warm on my face, liar." His cane taps your chest once. You cannot move until moonrise, and somehow you feel better for it.','"脸上暖洋洋的，骗子。"他用拐杖点了你胸口一下。你一直动弹不得，直到月亮升起——却莫名觉得通体舒畅。'),c:'muted',fx:{align:-1,qi:2,heal:10}}]}]});

I({id:'s2_poisontea',age:[16,60],tags:S2W,cd:12,ctx:s=>{const c=scene();c.npc=npc(s,{occ:29,sex:'f',age:rint(30,60)});return c},
 text:c=>T(`A roadside stall: "Free tea to anyone who can name the poison in it." The owner, ${c.npc.en}, is knitting.`,`路边一个茶摊挂着牌子："能说出茶里是什么毒，分文不取。"摊主${c.npc.zh}正在织毛活。`),
 opts:[{l:T('Drink and guess','喝一口猜猜'),out:[{w:s=>s.smarts/20,t:T('"Snake-gall vine, a pinch." She claps and hands you the antidote, and a second cup to keep.','"蛇胆藤，一小撮。"她拍手叫好，递上解药，又送了你一杯。'),c:'good',fx:{smarts:2,maxHealth:1}},
   {w:2,t:T('Wrong. You spend the afternoon seeing three of everything.','猜错了。整个下午你看什么都是三个。'),c:'bad',fx:{hurt:[5,15],cause:T('a poisoner’s tea','毒茶')}},
   {w:1,t:T('"There is no poison," she admits. "It is just my tea. People keep guessing." It is truly awful.','"没有毒，"她承认，"就是我泡的茶。可总有人猜。"确实难喝至极。'),fx:{happy:3}}]},
  {l:T('Swap cups with her','跟她换杯子'),out:[{t:c=>T(`${c.npc.en} drinks without blinking. "I am immune to everything except good manners." She likes you.`,`${c.npc.zh}眼都不眨就喝了。"我百毒不侵，就是受不了有礼貌的人。"她挺喜欢你。`),c:'good',fx:{meet:'acq',bond:55}}]},
  {l:T('Walk on','走开'),out:[{t:T('"Wise," she says. "Most are not."','"聪明，"她说，"大多数人没这么聪明。"'),c:'muted'}]}]});

I({id:'s2_millstone',age:[16,60],tags:S2W,cd:12,text:()=>T('Two martial artists have bet fifty taels on who can split a millstone with one palm. They need a judge, and you are the only stranger in sight.','两个练家子赌了五十两，看谁能一掌劈开磨盘。他们需要个公证人，而方圆几里只有你一个生人。'),
 opts:[{l:T('Judge honestly','秉公裁判'),out:[{w:2,t:T('Both fail. They split the silver on wine and make you drink it with them.','两人都没劈开。他们用赌银买了酒，非拉你一起喝。'),c:'good',fx:{happy:4,meet:'acq',bond:50}},{w:1,t:T('The thin one splits it. The fat one says you blinked. He gives you a thump to remember him by.','瘦的那个劈开了。胖子说你眨了眼，捶了你一拳让你长记性。'),c:'bad',fx:{hurt:[3,8],cause:T('a sore loser','输不起的人')}}]},
  {l:T('Take a bribe from the bigger one','收大个子的贿赂'),out:[{w:2,t:T('The small one splits the stone clean. Everyone saw it. You have to call it, and now both of them hate you.','小个子干净利落地劈开了，大家都看见了。你只能照实判，结果两人都恨上了你。'),c:'bad',fx:{money:10,align:-3,happy:-2}},{w:1,t:T('Nobody splits anything. You keep the bribe and feel cheap all week.','谁也没劈开。贿赂你留着了，可整个星期都觉得自己廉价。'),fx:{money:20,align:-3}}]},
  {l:T('Try it yourself','自己试试'),out:[{if:s=>power(s)>=80,t:T('The millstone breaks into four neat pieces. They pay you the wager in stunned silence.','磨盘裂成整整齐齐的四块。两人目瞪口呆地把赌银交给了你。'),c:'gold',fx:{money:50,fame:3}},{if:s=>power(s)<80,t:T('Your palm meets granite. Granite wins. They are very kind about it.','手掌碰上了花岗岩，花岗岩赢了。他们倒是很体贴。'),c:'bad',fx:{hurt:[4,10],cause:T('a millstone','磨盘'),happy:1}}]}]});

I({id:'s2_boar',age:[16,60],tags:S2W,cd:10,text:()=>T('In the oak woods a wild boar the size of a cart lowers its tusks at you.','橡树林里，一头车那么大的野猪冲你垂下了獠牙。'),
 opts:[{l:T('Stand and fight','迎战'),fight:FG(PW(.9,4),'injury',T('Boar in the oak woods','橡林野猪'),T('a wild boar’s tusks','野猪獠牙'),()=>T('the wild boar','野猪'),true),
   win:[{t:T('The village feasts on boar for three days and toasts you every night.','全村吃了三天野猪肉，每晚都给你敬酒。'),c:'good',fx:{fame:2,happy:5,money:15}}],lose:[{t:T('It tosses you into a bramble bush and trots off, satisfied.','它把你挑进荆棘丛，心满意足地走了。'),c:'bad'}]},
  {l:T('Climb a tree','爬树'),out:[{w:2,t:T('It waits under the tree all night. So do you. At dawn you are both tired of each other.','它在树下守了一夜，你在树上也守了一夜。天亮时你们都烦透了对方。'),c:'muted',fx:{happy:-2}},{w:1,t:T('The tree has a wasp nest. The boar watches you come down very fast.','树上有个马蜂窝。野猪看着你飞快地滑了下来。'),c:'bad',fx:{hurt:[4,10],cause:T('wasps','马蜂')}}]},
  {l:T('Throw it your dried meat','扔肉干给它'),out:[{w:2,t:T('It eats, then follows you for three li hoping for more, like a very large dog.','它吃完了，又跟了你三里路想要更多，像一条特大号的狗。'),fx:{happy:3}},{w:1,t:T('It eats the meat and the bag, and leaves you alone.','它连肉带袋子一起吃了，然后放过了你。'),c:'muted'}]}]});

I({id:'s2_roofthief',age:[16,55],tags:S2W,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:21,age:rint(10,13)});return c},
 text:c=>T(`A skinny boy snatches your purse and runs straight up a wall.`,`一个瘦小子抢了你的钱袋，蹭蹭几下就上了墙。`),
 opts:[{l:T('Chase him over the rooftops','追上屋顶'),out:[{w:2,t:c=>T(`You corner him on a ridge tile. ${c.npc.en} is crying: his sister has a fever. You give him the purse back, and a little more.`,`你在屋脊上堵住了他。${c.npc.zh}哭了：他妹妹在发烧。你把钱袋还给了他，又多给了些。`),c:'good',fx:{money:-10,align:4,flag:'s2_roofboy'}},
   {w:1,t:T('You crash through a roof into a family’s dinner. You pay for the tiles and they make you finish the soup.','你踩穿屋顶，掉进了一家人的饭桌。赔了瓦钱，他们还非让你把汤喝完。'),fx:{money:-15,happy:2}},
   {w:1,t:T('You catch him and hand him to the constables. It feels less good than you expected.','你抓住他交给了捕快。心里没你以为的那么痛快。'),c:'muted',fx:{align:1}}]},
  {l:T('Let him go','由他去'),out:[{t:T('Later you see him in the herbalist’s shop, buying medicine with your silver.','后来你在药铺看见他，正拿你的银子抓药。'),c:'muted',fx:{money:[-20,-5],align:2,flag:'s2_roofboy'}}]},
  {l:T('Shout "Thief!"','大喊"抓贼"'),out:[{t:T('Half the street gives chase. He drops the purse in a water butt. You fish it out, soggy.','半条街的人都追了上去。他把钱袋丢进了水缸。你捞出来时湿透了。'),c:'muted'}]}]});

I({id:'s2_rivalpath',age:[16,60],tags:S2W,cd:12,ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:rint(18,30)});return c},
 text:()=>T('On a narrow mountain path, two young disciples from rival sects stand nose to nose. Neither will step aside. A queue of mules waits behind them.','狭窄的山道上，两个敌对门派的年轻弟子鼻尖对鼻尖站着，谁也不肯让路。后面已经排起了一串骡子。'),
 opts:[{l:T('Mediate','从中调停'),out:[{w:s=>s.smarts/25,t:T('You suggest they both step aside at once, on a count of three. They do. Everyone pretends this was obvious.','你提议数到三，两人同时让开。他们照做了。大家都装作这是理所当然的事。'),c:'good',fx:{fame:1,align:2}},{w:2,t:T('They agree to settle it later and both turn on you for interrupting.','两人约好改日再算，然后一齐转过来怪你多事。'),c:'bad',fx:{hurt:[3,8],cause:T('two angry disciples','两个恼火的弟子')}},{w:1,t:T('A muleteer loses patience and drives his mules straight through all three of you.','赶骡子的等不及了，赶着骡子从你们三个中间直接穿了过去。'),fx:{happy:3}}]},
  {l:T('Take one side','帮一边'),fight:FG(PW(.95,3),'light',T('The narrow path','山道相争'),T('a sect quarrel','门派争执')),
   win:[{t:T('The one you helped bows deeply and gives you his name. The other limps off to tell his elders.','你帮的那人深深一揖，报上了名号。另一个一瘸一拐地回去告状了。'),c:'good',fx:{fame:2,meet:'acq',bond:55}}],lose:[{t:T('You both end up in the bushes. The mules pass.','你们俩都滚进了草丛。骡子们过去了。'),c:'bad'}]},
  {l:T('Take the long way round','绕远路'),out:[{w:2,t:T('Two extra days. Your feet hate you.','多走了两天，脚很恨你。'),c:'muted'},{w:1,t:T('On the long way you find a patch of wild ginseng.','绕路时你发现了一片野山参。'),c:'good',fx:{heal:15,money:20}}]}]});

I({id:'s2_digmaster',age:[16,45],tags:S2W,w:1.3,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(65,85)});return c},
 text:c=>T(`An old man in a straw hut, ${c.npc.en}, says he will teach you something if you dig him a hole. Every day. For a month. He does not say what for.`,`草屋里的老头${c.npc.zh}说，你若肯天天给他挖坑，挖满一个月，他就教你点东西。他没说挖来做什么。`),
 opts:[{l:T('Dig','挖'),out:[{w:3,t:T('On the thirtieth day he plants a peach sapling in the hole, thanks you, and that is all. You are oddly happy.','第三十天，他在坑里栽了一棵桃树苗，道了声谢，就没下文了。你却莫名地高兴。'),c:'good',fx:{happy:4,maxHealth:1,flag:'s2_digtree'}},
   {w:2,t:T('Your arms turn to iron. "That was the lesson," he says. You throw a clod at him.','你的胳膊练得跟铁一样。"这就是功课，"他说。你朝他扔了块土。'),c:'good',fx:{skill:3,maxHealth:2}},
   {w:1,t:T('On day nineteen your spade hits a sealed jar. Wine his own master buried sixty years ago. You share it.','第十九天，铁锹碰上一个封口的坛子，是他师父六十年前埋的酒。你们一起喝了。'),c:'gold',fx:{qi:5,happy:4}}]},
  {l:T('Ask why first','先问为什么'),out:[{t:T('"To see if you would ask," he says, and closes the door.','"看你问不问，"他说完就关上了门。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Refuse','不干'),out:[{t:T('He shrugs and digs it himself, much faster than you could have.','他耸耸肩自己挖了，比你快多了。'),c:'muted'}]}]});

I({id:'s2_starved',age:[16,60],tags:S2W,cd:12,text:()=>T('Men with hoes and kitchen knives jump out of the barley. "Your money!" Their hands are shaking.','几个拿锄头菜刀的汉子从麦地里跳出来。"把钱交出来！"他们的手在抖。'),
 opts:[{l:T('Fight them off','打退他们'),fight:FG(PW(.6,2),'light',T('Barley-field robbers','麦地劫道'),T('a desperate farmer’s hoe','饥民的锄头'),()=>T('the hungry farmers','饥民')),
   win:[{t:T('They scatter. Later you pass their village. There is no smoke from any chimney.','他们四散逃了。后来你路过他们的村子，没有一户冒炊烟。'),c:'muted',fx:{align:-1,happy:-2}}],lose:[{t:T('They take your bag, apologise, and run.','他们拿走了你的包袱，道了个歉，跑了。'),c:'bad',fx:{money:[-30,-10]}}]},
  {l:T('Give them food and silver','给他们粮食和银子'),cost:20,out:[{w:2,t:T('They kneel. One walks you to the next town to keep you safe.','他们跪下了。有一个一直把你送到下个镇子。'),c:'good',fx:{align:5}},{w:1,t:T('Word spreads. Next week twenty more are waiting by the road.','消息传开了。下个礼拜，路边等着的人多了二十个。'),c:'muted',fx:{align:4,happy:-1}}]},
  {l:T('Roar at them','大喝一声'),out:[{if:s=>power(s)>=40,t:T('Leaves fall from the trees. So do two of the robbers.','树叶簌簌落下，两个劫匪也跟着跌倒了。'),c:'good',fx:{fame:1}},{if:s=>power(s)<40,t:T('Your voice cracks. They laugh, and somehow that ends it. They let you pass.','你的嗓子劈了。他们笑了，事情就这么了了，放你过去了。'),fx:{happy:1}}]}]});

I({id:'s2_bear',age:[16,60],tags:S2W,cd:12,ctx:s=>{const c=scene();c.npc=npc(s,{occ:18,age:rint(55,75)});return c},
 text:c=>T(`A black bear is tearing open the hives of a beekeeper, ${c.npc.en}. She beats a pot and begs you to help.`,`一头黑熊在扒养蜂婆婆${c.npc.zh}的蜂箱。她敲着锅求你帮忙。`),
 opts:[{l:T('Drive the bear off','赶走黑熊'),fight:FG(PW(1.0,5),'injury',T('The honey thief','偷蜜的熊'),T('a black bear','黑熊'),()=>T('the black bear','黑熊'),true),
   win:[{t:T('The bear lumbers into the hills. She gives you a crock of honey and a hug that smells of smoke.','黑熊摇摇晃晃逃进了山。她送了你一罐蜂蜜，还给了你一个带着烟味的拥抱。'),c:'good',fx:{fame:1,align:3,happy:4,heal:5}}],
   lose:[{t:T('The bear wins. The bees then sting both of you, impartially.','熊赢了。然后蜜蜂不偏不倚地把你俩都蜇了。'),c:'bad'}]},
  {l:T('Smoke it out','用烟熏'),out:[{w:s=>s.smarts/25,t:T('Wet leaves and a lot of smoke. The bear sneezes and leaves in disgust.','湿树叶，一大股浓烟。黑熊打了个喷嚏，嫌弃地走了。'),c:'good',fx:{align:2,money:5}},{w:2,t:T('You smoke out the bees instead. They know exactly who did it.','你把蜜蜂熏出来了。它们很清楚是谁干的。'),c:'bad',fx:{hurt:[5,12],cause:T('angry bees','蜂群')}}]},
  {l:T('Not your bear','关我什么事'),out:[{t:T('You walk on. The pot-beating follows you for a long way.','你走了。敲锅声跟了你很远。'),c:'muted',fx:{align:-1}}]}]});

I({id:'s2_treesword',age:[16,60],tags:S2W,once:1,text:()=>T('By the road, an old sword is buried to the hilt in a camphor tree. A sign says: "Many have tried."','路边一棵樟树上插着一柄古剑，没至剑柄。旁边立着牌子："试者甚众。"'),
 opts:[{l:T('Pull it out','拔剑'),out:[{w:s=>s.t.root/3,t:T('It slides out with a sigh. Rusty, but the steel underneath is good.','剑叹息般滑了出来。锈迹斑斑，底下却是好钢。'),c:'gold',fx:{item:'ironsword',fame:2}},
   {w:2,t:T('It does not move. A villager appears and charges you one copper for the attempt.','纹丝不动。一个村民冒出来，收了你一文钱的"试剑费"。'),c:'muted',fx:{money:-1}},
   {w:1,t:T('It comes out. So does the tree. The villagers who lived off the sign are furious.','剑拔出来了，树也倒了。靠那块牌子吃饭的村民气坏了。'),c:'bad',fx:{money:-30,fame:1}}]},
  {l:T('Charge others to try','向别人收试剑费'),out:[{w:2,t:T('You sit by the tree for a week. Business is good.','你在树边坐了一个星期，生意不错。'),fx:{money:[10,40],align:-1}},{w:1,t:T('The real owner of the racket arrives with three cousins.','真正的地头蛇带着三个表兄弟来了。'),c:'bad',fx:{hurt:[3,10],cause:T('a roadside racket','路边的营生')}}]},
  {l:T('Leave it','走开'),out:[{t:T('Some swords are better where they are.','有些剑，还是留在原处好。'),c:'muted'}]}]});

I({id:'s2_drunkard',age:[16,55],tags:S2W,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:rint(50,65)});return c},
 text:c=>T(`A drunk sprawled at a crossroads, ${c.npc.en}, challenges every passer-by. Nobody takes him seriously.`,`十字路口躺着个醉汉${c.npc.zh}，见人就挑战。谁也没把他当回事。`),
 opts:[{l:T('Accept','应战'),fight:FG(PW(1.15,10),'spar',T('The crossroads drunk','路口醉汉'),T('a drunk’s gourd','醉汉的酒葫芦')),
   win:[{t:T('He stops laughing. He looks at you properly, sober for a moment, and shows you how you won.','他不笑了，认真地看了你一眼，仿佛清醒了片刻，然后把你赢在哪里讲给你听。'),c:'gold',fx:{skill:2,fame:1}}],
   lose:[{t:T('He beats you with a wine gourd without spilling a drop. You learn something anyway.','他拿酒葫芦把你打趴下，一滴酒没洒。你还是学到了点东西。'),c:'muted',fx:{skill:1}}]},
  {l:T('Carry him to an inn','把他扛去客栈'),out:[{w:4,t:T('He snores all night. At dawn he is gone. Scratched into the table: "I owe you one."','他打了一夜呼噜，天亮时人已不见。桌上刻着："欠你一回。"'),c:'good',fx:{money:-3,flag:'s2_drunkmaster'}},{w:1,t:T('He throws up on you. Twice.','他吐了你一身，两回。'),c:'bad',fx:{happy:-3}}]},
  {l:T('Step over him','跨过去'),out:[{t:T('"Coward!" he calls, cheerfully.','"胆小鬼！"他快活地喊。'),c:'muted'}]}]});

I({id:'s2_signpost',age:[16,60],tags:S2W,cd:15,text:()=>T('At a fork in the road, both signs say "Peace Town, 10 li".','岔路口，两块路牌都写着"太平镇，十里"。'),
 opts:[{l:T('Go left','走左边'),out:[{w:1,t:T('Left leads to a bandit camp. They put up the signs. They are embarrassed you found them and give you tea.','左边通向一个山贼窝，路牌是他们插的。被你撞见，他们怪不好意思的，请你喝了茶。'),fx:{happy:4}},{w:1,t:T('Left leads to a bandit camp. They charge you a "signpost fee".','左边通向一个山贼窝。他们收了你一笔"路牌钱"。'),c:'bad',fx:{money:[-20,-5]}}]},
  {l:T('Go right','走右边'),out:[{w:2,t:T('Ten li later: Peace Town. Everyone is at a funeral. You stay for the noodles.','十里之后，到了太平镇。全镇都在办丧事。你留下吃了碗面。'),c:'muted'},{w:1,t:T('Twenty li later: a different town that is also called Peace Town. There are four, it turns out.','二十里后，到了另一个也叫太平镇的地方。原来一共有四个。'),fx:{happy:2,smarts:1}}]},
  {l:T('Sit and wait','坐下等等'),out:[{t:c=>T(`A travelling monk arrives and stares at the signs too. ${c.npc.en} and you walk on together, arguing about which way all day.`,`一个云游和尚也走来，盯着路牌发愣。你和${c.npc.zh}结伴同行，一路争论该往哪走。`),c:'good',fx:{meet:'acq',bond:55,happy:2}}]}]});

I({id:'s2_runaway',age:[18,50],tags:S2W,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:12,sex:'f',age:rint(17,20)});return c},
 text:c=>T(`A rich family offers 80 taels to whoever brings back their runaway bride. You find ${c.npc.en} at a ferry, in men’s clothes, with a bundle and a terrible fake moustache.`,`一户富人家悬赏八十两，找逃婚的新娘。你在渡口找到了${c.npc.zh}：一身男装，一个包袱，一撇糟糕透顶的假胡子。`),
 opts:[{l:T('Take her back','把她带回去'),out:[{t:T('You collect the silver. She does not say a word to you the whole way. You hear the wedding drums from the next street.','你领了银子。一路上她一句话也没跟你说。隔着一条街，你听见了迎亲的锣鼓。'),c:'bad',fx:{money:80,align:-5,happy:-3}}]},
  {l:T('Let her go','放她走'),out:[{t:T('You fix her moustache and wave the ferry off.','你帮她把胡子贴正，挥手送走了渡船。'),c:'good',fx:{align:3,happy:3,flag:'s2_runawaybride'}}]},
  {l:T('Take her to her sweetheart','送她去见心上人'),out:[{w:2,t:T('He is a penniless scholar with ink on his nose. They bow to you together, very seriously.','那是个鼻尖沾墨的穷书生。两人一本正经地一起向你行礼。'),c:'good',fx:{align:4,happy:4,flag:'s2_runawaybride'}},{w:1,t:T('He never comes. She waits until dusk, then takes the ferry alone. "Thank you anyway."','他始终没来。她一直等到黄昏，独自上了渡船。"还是谢谢你。"'),c:'muted',fx:{align:3,happy:-2,flag:'s2_runawaybride'}}]}]});

I({id:'s2_badwell',age:[16,60],tags:S2W,cd:15,text:()=>T('The village well has been poisoned. You are the only stranger in the village, and the villagers have ropes.','村里的井被人下了毒。你是村里唯一的外人，而村民们手里拿着绳子。'),
 opts:[{l:T('Find the real cause','查明真相'),out:[{w:s=>s.smarts/20,t:T('You follow the stream uphill to a new dye-works dumping its vats. The villagers march up the hill instead.','你顺着溪水往上找，找到一家新开的染坊在倒废水。村民们调头冲上了山。'),c:'good',fx:{align:4,fame:2}},
   {w:1,t:T('A dead badger in the bucket rope. Embarrassing for everyone. They feed you dinner by way of apology.','原来是井绳里缠着一只死獾。大家都很尴尬，请你吃了顿饭赔罪。'),c:'good',fx:{happy:3}},
   {w:1,t:T('You ask too many questions. They tie you up for two days before the magistrate sorts it out.','你问得太多了。他们把你绑了两天，县官才来理清。'),c:'bad',fx:{happy:-4,hurt:[3,8],cause:T('an angry village','愤怒的村民')}}]},
  {l:T('Drink from the well to prove it','喝井水以示清白'),out:[{t:T('You are sick for a week. They believe you. Some of them visit with soup.','你病了一个星期。他们信了你，有人还端着汤来看你。'),c:'muted',fx:{hurt:[8,18],cause:T('a poisoned well','毒井'),align:2,fame:1}}]},
  {l:T('Run','跑'),out:[{t:T('You get away. In the next county, the posters describe you surprisingly well.','你逃掉了。到了邻县，告示上画的你还挺像。'),c:'bad',fx:{wanted:1}}]}]});

I({id:'s2_maskedtest',age:[18,60],tags:S2W,cd:15,when:s=>power(s)>=20,ctx:s=>{const c=scene();c.npc=npc(s,{occ:14,sex:'f',age:rint(50,70)});return c},
 text:()=>T('A masked figure drops from the eaves at midnight. "Show me what you have learned." The voice is old and amused.','半夜，一个蒙面人从屋檐上落下。"让我看看你学了些什么。"声音苍老，带着笑意。'),
 opts:[{l:T('Show them','亮招'),fight:FG(PW(1.0,8),'light',T('The masked visitor','蒙面来客'),T('a masked visitor','蒙面来客'),()=>T('the masked figure','蒙面人')),
   win:[{t:T('Under the mask: a grey-haired woman. "Not bad." She vanishes. In the morning there is a jar of good medicine at your door.','面具下是一个白发妇人。"不坏。"她一闪就不见了。第二天早上，你门口放着一罐好药。'),c:'good',fx:{heal:20,skill:1}}],
   lose:[{t:T('She taps your forehead. "Train harder." In the morning you find a list of your weaknesses pinned to your sleeve.','她在你额头点了一下："多练练。"第二天早上，你发现袖子上别着一张纸，列着你的破绽。'),c:'muted',fx:{skill:2}}]},
  {l:T('Shut the window','关窗'),out:[{t:T('"Rude," says the voice. You wonder about it for years.','"没礼貌，"那声音说。你琢磨了好些年。'),c:'muted'}]}]});

/* ====================== town life ====================== */
I({id:'s2_monkeyguan',age:[16,60],tags:S2T,cd:12,text:()=>T('Two old men in the teahouse demand you settle it: could the Monkey King beat Lord Guan?','茶馆里两个老头拉住你评理：孙猴子打不打得过关老爷？'),
 opts:[{l:T('The Monkey King','孙猴子'),out:[{t:T('One sulks. The other buys you tea for a month.','一个生了闷气，另一个请你喝了一个月的茶。'),fx:{happy:3}}]},
  {l:T('Lord Guan','关老爷'),out:[{t:T('One sulks. The other buys you tea for a month. It is a different one from last time.','一个生了闷气，另一个请你喝了一个月的茶。跟上回请茶的不是同一个。'),fx:{happy:3}}]},
  {l:T('"They would swear brotherhood"','"他们会结拜"'),out:[{w:2,t:T('Both are delighted. The story spreads. A storyteller uses it, badly.','两个老头乐坏了。这说法传开了，还被说书先生拿去用，讲得很烂。'),c:'good',fx:{fame:1,happy:4}},{w:1,t:T('Both pour their tea on you for dodging the question.','两人都嫌你耍滑头，一人泼了你一杯茶。'),c:'bad',fx:{happy:-2}}]}]});

I({id:'s2_relic',age:[16,60],tags:S2T,cd:12,ctx:s=>{const c=scene();c.npc=npc(s,{occ:24,age:rint(35,60)});return c},
 text:c=>T(`${c.npc.en} is selling "the very sandal Bodhidharma left behind" from a blanket in the market. Thirty taels.`,`${c.npc.zh}在集市上铺了块布，卖"达摩祖师留下的那只草鞋"。三十两。`),
 opts:[{l:T('Buy it','买下'),cost:30,out:[{w:2,t:T('It falls apart in a week.','一个星期就散架了。'),c:'muted'},{w:1,t:T('You hang it over your bed. Strangely, you sleep better than you have in years.','你把它挂在床头。说来也怪，你睡得比这些年都好。'),c:'good',fx:{heal:10,happy:4}},{w:.5,t:T('A Shaolin monk sees it, goes white, and pays you a hundred taels for it on the spot.','一个少林和尚看见了，脸色一白，当场出了一百两买走。'),c:'gold',fx:{money:100}}]},
  {l:T('Expose him','当众拆穿'),out:[{w:2,t:T('The crowd turns on him. He leaves his blanket behind.','众人哄了起来。他连布都没拿就跑了。'),c:'good',fx:{fame:1,align:2}},{w:1,t:T('The crowd turns on you. They wanted to believe it.','众人反倒冲你来了。他们愿意相信。'),c:'bad',fx:{happy:-3}}]},
  {l:T('Pay him to teach the trick','花钱学这手艺'),cost:10,out:[{t:T('Tea, soot, and a story told with a straight face. You learn more about people than about sandals.','茶水、锅灰，再加一个板着脸讲的故事。你学到的是人心，不是草鞋。'),fx:{smarts:2,align:-2}}]}]});

I({id:'s2_pawnticket',age:[16,60],tags:S2T,cd:20,text:()=>T('In the lining of a second-hand coat you find a pawn ticket, forty years old.','你在一件旧棉袄的夹层里摸出一张当票，四十年前的。'),
 opts:[{l:T('Try to redeem it','去赎'),cost:15,out:[{w:1,t:T('A sword, wrapped in oiled cloth. Still sharp.','一柄剑，裹着油布，依然锋利。'),c:'gold',fx:{item:'ironsword'}},{w:2,t:T('A bundle of love letters from a long-dead official to a singing girl. You read them all in one night.','一捆情书，是一位早已作古的官员写给一个歌女的。你一夜看完了。'),c:'good',fx:{happy:3,smarts:1}},{w:1,t:T('A wooden box holding one egg. It is very, very old. You do not open it.','一只木盒，里面装着一个鸡蛋。非常非常老的鸡蛋。你没有打开。'),fx:{happy:2}},{w:1,t:T('The deed to a scrap of land by the river. Someone pays you well for it.','一张河边一小块地的地契。有人出了个好价钱买去。'),c:'good',fx:{money:60}}]},
  {l:T('Sell the ticket','把当票卖了'),out:[{t:T('A collector of curiosities gives you five taels and a strange look.','一个收古怪玩意儿的人给了你五两银子，神情古怪。'),fx:{money:5}}]},
  {l:T('Throw it away','扔了'),out:[{t:T('Somewhere, an old pawnbroker sighs.','某处，一个老朝奉叹了口气。'),c:'muted'}]}]});

I({id:'s2_matchmaker',age:[17,40],tags:S2T,cd:6,when:s=>!spouseOf(s),ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-3,3),16,45)});return c},
 text:c=>T(`Matchmaker Wang has followed you for three streets. "${c.npc.en}. Good family, good teeth, born under a matching star. Just one cup of tea!"`,`王媒婆跟了你三条街。"${c.npc.zh}，人家好、牙口好，八字还和你配。就喝一杯茶！"`),
 opts:[{l:T('One cup of tea','就喝一杯'),out:[{w:2,t:c=>T(`${c.npc.en} is shy for exactly one cup, then very funny. You order a second pot.`,`${c.npc.zh}只害羞了一杯茶的工夫，然后就妙语连珠。你们又叫了一壶。`),c:'good',fx:{meet:'lover',bond:55,happy:5}},
   {w:1,t:c=>T(`${c.npc.en} admits they only came to make their parents stop nagging. So did you. You become firm friends.`,`${c.npc.zh}坦白说，来只是为了让爹娘别再唠叨。你也是。你俩成了铁哥们。`),c:'good',fx:{meet:'friend',bond:65,happy:3}},
   {w:1,t:T('It is someone you once beat in a fight. The tea is very quiet.','对方是你以前打过的人。那杯茶喝得非常安静。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Refuse','拒绝'),out:[{t:T('She curses your eight characters loudly in the street. You hear it repeated for weeks.','她当街大骂你的八字。这话在街坊间传了好几个礼拜。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Pay her to go away','给钱打发她'),cost:5,out:[{t:T('She pockets it, then follows you anyway. "That was for today."','她收了钱，还是跟着你。"那是今天的份。"'),fx:{happy:1}}]}]});

I({id:'s2_loadeddice',age:[16,60],tags:S2T,cd:10,ctx:s=>{const c=scene();c.npc=npc(s,{occ:28,age:rint(25,45)});return c},
 text:()=>T('In a gambling den you notice the house dice land on six a little too often. One of them is heavier.','在赌坊里，你发现庄家的骰子出六点的次数多了点。其中一颗沉了些。'),
 opts:[{l:T('Expose it loudly','当众揭穿'),fight:FG(PW(.85,3),'light',T('Loaded dice','灌铅骰子'),T('gambling-den thugs','赌坊打手'),()=>T('the house thugs','赌坊打手')),
   win:[{t:T('The gamblers carry you round the room on their shoulders and take back their losses. Some of it ends up in your sleeve.','赌客们把你扛在肩上绕场一周，把输的钱都拿了回来，有一些进了你的袖子。'),c:'good',fx:{money:30,fame:2}}],
   lose:[{t:T('You are thrown into the street. The door shuts. The dice keep rolling.','你被扔到了街上。门关上了，骰子还在响。'),c:'bad'}]},
  {l:T('Bet with the house','跟着庄家押'),out:[{w:2,t:T('You win steadily and quietly. You do not feel clever.','你一直赢，不声不响。可你不觉得自己聪明。'),fx:{money:[20,60],align:-2}},{w:1,t:T('The house notices you noticing. Two large men walk you to the back.','庄家发现你看出来了。两个大汉把你请到了后院。'),c:'bad',fx:{hurt:[5,12],cause:T('a gambling den','赌坊'),money:-20}}]},
  {l:T('Leave','走人'),out:[{t:T('You keep your money, which in a gambling den counts as winning.','你一文钱没输。在赌坊里，这就算赢了。'),c:'muted'}]}]});

I({id:'s2_magistratepoem',age:[16,60],tags:S2T,once:1,text:()=>T('The new magistrate holds a poetry contest in the yamen garden. Everyone knows the winning poem will be the one that praises him most.','新到任的县太爷在衙门花园办诗会。谁都知道，夸他夸得最好的那首准赢。'),
 opts:[{l:T('Flatter him in verse','作诗颂扬'),out:[{w:s=>s.smarts/20,t:T('"A clear sky over the county." He has it carved on a board. You win twenty taels and feel slightly greasy.','"一县晴空。"他让人刻成了匾。你得了二十两银子，觉得自己有点油腻。'),c:'good',fx:{money:20,fame:1,align:-1,flag:'s2_poemflatter'}},{w:1,t:T('Someone else flatters harder. You come second to a man who compared him to the sun.','有人拍得更响。你输给了一个把他比作太阳的人。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Write about the broken dike','写决口的河堤'),out:[{w:1,t:T('The garden goes silent. Then he walks to the river himself. The dike is mended by autumn.','花园里一片死寂。然后他亲自去了河边。入秋前，河堤修好了。'),c:'gold',fx:{align:5,fame:3}},{w:1,t:T('You are fined for "disturbing the harmony of the occasion".','你以"有伤雅集"为由被罚了银子。'),c:'bad',fx:{money:-20,align:3}},{w:1,t:T('He ignores it, but your poem is copied onto walls all over town.','他没理会，但你的诗被人抄满了全城的墙。'),c:'good',fx:{fame:3,align:2}}]},
  {l:T('Just eat the snacks','只管吃点心'),out:[{t:T('The almond cakes are excellent. You take some home.','杏仁酥非常好吃。你还揣了几块回家。'),fx:{happy:3}}]}]});

I({id:'s2_coffinmaker',age:[25,60],tags:S2T,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(55,75)});return c},
 text:c=>T(`The town coffin-maker, ${c.npc.en}, keeps looking you up and down. "Just measuring," he says. "Professional habit."`,`镇上的棺材匠${c.npc.zh}一直上下打量你。"量量尺寸，"他说，"职业习惯。"`),
 opts:[{l:T('Let him measure','随他量'),out:[{t:T('"A big one," he decides. "But not for a long, long time. Good bones." You feel oddly reassured.','"得做个大的，"他断定，"不过还早，早得很。骨头好。"你竟然觉得挺安心。'),c:'good',fx:{happy:3}}]},
  {l:T('Order one in advance','先订一口'),cost:20,out:[{t:T('He promises the best cedar and a discount for living customers. "You will be the envy of the graveyard."','他保证用最好的杉木，活人订还打折。"保管全坟地都羡慕你。"'),fx:{happy:2,flag:'s2_coffin'}}]},
  {l:T('Take offence','发火'),out:[{t:T('You shout at him. He writes something in his little book.','你冲他嚷了一通。他在小本子上记了点什么。'),c:'muted',fx:{happy:-1}}]}]});

I({id:'s2_stonechest',age:[16,60],tags:S2T,cd:10,text:()=>T('A street strongman lies on a bed of nails with a slab of stone on his chest. He asks for a volunteer to swing the hammer.','街头卖艺的壮汉躺在钉板上，胸口压着一块石板，请人上来抡锤。'),
 opts:[{l:T('Swing the hammer','抡锤'),out:[{if:s=>power(s)>=60,t:T('You hit too hard. The stone, the bench and the nail-bed all break. He is fine, and furious.','你使劲大了。石板、板凳、钉板全碎了。他毫发无伤，气得要命。'),c:'muted',fx:{money:-10,fame:1}},{if:s=>power(s)<60,t:T('Crack. The stone splits, he leaps up, the crowd roars. He shares the coins with you.','咔嚓一声，石板裂开，他一跃而起，众人喝彩。赏钱分了你一份。'),c:'good',fx:{money:5,happy:4}}]},
  {l:T('Lie under the stone yourself','自己躺上去'),out:[{w:s=>s.qi/20+1,t:T('You breathe out at the right moment. The stone breaks and you do not. The crowd throws coins.','你在恰好的一刻吐气。石板碎了，你没事。众人扔来铜钱。'),c:'good',fx:{money:8,fame:1,qi:1}},{w:1,t:T('You breathe out at the wrong moment.','你吐气的时机不对。'),c:'bad',fx:{hurt:[6,15],cause:T('a street act gone wrong','卖艺失手')}}]},
  {l:T('Heckle','起哄'),out:[{t:T('He invites you to lift the slab. You cannot. The crowd enjoys this more than the act.','他请你把石板抬起来。你抬不动。众人看得比表演还起劲。'),c:'muted',fx:{happy:-2}}]}]});

I({id:'s2_dumplings',age:[16,60],tags:S2T,cd:10,text:()=>T('The dumpling shop holds an eating contest. Ten taels to the winner. Among the contestants is a tiny old woman.','饺子铺办吃饺子大赛，头名十两银子。参赛的人里有一个瘦小的老太太。'),
 opts:[{l:T('Compete','报名'),out:[{w:1,t:T('You win with sixty-two. You cannot look at a dumpling for a year.','你吃了六十二个，赢了。之后一年你看见饺子就怕。'),c:'good',fx:{money:10,fame:1,hurt:[2,6],cause:T('too many dumplings','饺子吃撑了')}},{w:2,t:T('The tiny old woman eats ninety and asks if there is soup.','瘦小的老太太吃了九十个，问还有没有汤。'),c:'muted',fx:{happy:2}},{w:1,t:T('You are disqualified for hiding dumplings in your sleeves. You claim they fell in.','你因为往袖子里藏饺子被取消了资格。你坚持说是掉进去的。'),fx:{happy:3}}]},
  {l:T('Bet on the old woman','押老太太'),out:[{w:3,t:T('Easy money. She winks at you afterwards.','钱赚得轻巧。赛后她冲你眨了眨眼。'),c:'good',fx:{money:[10,30]}},{w:1,t:T('She stops at forty. "My grandson is watching," she says. You lose.','她吃到四十个就停了。"我孙子看着呢。"你输了。'),c:'bad',fx:{money:-15}}]},
  {l:T('Just watch','看热闹'),out:[{t:T('It is the best show in town this year.','这是今年城里最好看的一场戏。'),fx:{happy:3}}]}]});

I({id:'s2_ownfuneral',age:[20,60],tags:S2T,once:1,text:()=>T('You come back to town after a trip and find a funeral in progress. It is yours. Someone said you drowned.','出了趟远门回来，你发现镇上在办丧事——办的是你的。有人说你淹死了。'),
 opts:[{l:T('Walk in during the service','在灵堂上现身'),out:[{w:2,t:T('Two mourners faint. One confesses he owed you money, and pays on the spot.','两个吊丧的当场晕倒。还有一个当场承认欠你钱，立刻还了。'),fx:{money:20,happy:5}},{w:1,t:T('Your rival is crying the loudest. You are both deeply embarrassed.','哭得最响的是你的对头。你们俩都尴尬得要命。'),c:'good',fx:{happy:4}}]},
  {l:T('Listen from behind a pillar','躲在柱子后面听'),out:[{if:s=>s.align>=10,t:T('They say kind things. More than you expected. You go home quietly and sit for a long time.','他们说了不少好话，比你想的多。你悄悄回家，坐了很久。'),c:'good',fx:{happy:8}},{if:s=>s.align<10,t:T('They mostly discuss who gets your chair.','他们主要在商量你的椅子归谁。'),c:'bad',fx:{happy:-6}}]},
  {l:T('Leave town for a while','先避一阵'),out:[{t:T('You come back a month later and enjoy the screaming.','一个月后你回来，享受了一番众人的尖叫。'),fx:{happy:3}}]}]});

I({id:'s2_forger',age:[16,60],tags:S2T,cd:15,ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:rint(30,55)});return c},
 text:c=>T(`A painting dealer, ${c.npc.en}, wants you to pose as a famous painter’s grandson for one afternoon and "recognise" a scroll for a rich buyer.`,`字画贩子${c.npc.zh}想请你冒充一位名画家的孙子，陪他见一位阔买家，当场"认出"一幅画来。`),
 opts:[{l:T('Do it','干了'),out:[{w:2,t:T('You weep convincingly over "Grandfather’s brushwork". Your cut is fifty taels.','你对着"祖父的笔墨"哭得情真意切，分到了五十两。'),fx:{money:50,align:-3}},{w:1,t:T('The buyer is the real grandson. The afternoon goes very badly.','买家就是那位真孙子。那个下午过得非常糟糕。'),c:'bad',fx:{money:-40,happy:-4}}]},
  {l:T('Refuse','不干'),out:[{t:T('"Pity. You have an honest face." He means it as an insult.','"可惜了，你长着一张老实脸。"他这话是骂人的。'),c:'muted'}]},
  {l:T('Warn the buyer','提醒买家'),out:[{w:2,t:T('The buyer is grateful and sends you a real scroll as thanks.','买家很感激，送了你一幅真画作谢礼。'),c:'good',fx:{align:3,money:30}},{w:1,t:c=>T(`${c.npc.en} finds out who warned him.`,`${c.npc.zh}查出了是谁报的信。`),c:'bad',fx:{align:3,enemy:1}}]}]});

I({id:'s2_doortax',age:[18,60],tags:S2T,cd:10,ctx:s=>{const c=scene();c.npc=npc(s,{occ:9,age:rint(30,50)});return c},
 text:c=>T(`A yamen clerk, ${c.npc.en}, is going door to door collecting a "door tax". Nobody has heard of it before today.`,`衙门的书吏${c.npc.zh}挨家挨户收"门税"。在今天以前，谁也没听说过这个税。`),
 opts:[{l:T('Pay','交钱'),cost:10,out:[{t:T('He gives you a receipt with no seal on it.','他给了你一张没盖印的收据。'),c:'muted'}]},
  {l:T('Quote the law at him','跟他讲律法'),out:[{if:s=>s.smarts>=55,t:T('You cite the Code chapter and article. He goes pale and skips the rest of the street.','你把律例第几章第几条背给他听。他脸都白了，剩下半条街都没敢收。'),c:'good',fx:{align:2,fame:1}},{if:s=>s.smarts<55,t:T('You get the article wrong. He fines you for "slandering the law".','你把条文记错了。他罚你一个"诬枉律例"。'),c:'bad',fx:{money:-15}}]},
  {l:T('Rally the neighbours','招呼街坊'),out:[{w:2,t:T('Forty neighbours with brooms. The door tax is abolished the same afternoon.','四十个街坊拎着扫帚出来。门税当天下午就废了。'),c:'good',fx:{align:3,happy:4}},{w:1,t:T('The clerk comes back with constables. You are the one they fine.','书吏带着捕快回来了。挨罚的是你。'),c:'bad',fx:{money:-25,align:2}}]}]});

I({id:'s2_parrot',age:[16,55],tags:S2T,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:17,age:rint(30,60)});return c},
 text:()=>T('A bird-seller’s parrot keeps saying the same words: "Under the well. Under the well."','卖鸟的笼子里有只鹦鹉，翻来覆去就一句话："井底下。井底下。"'),
 opts:[{l:T('Buy the parrot','买下鹦鹉'),cost:15,out:[{t:T('It rides home on your shoulder and bites your ear once, for form’s sake.','它站在你肩头回了家，象征性地啄了你耳朵一下。'),c:'good',fx:{happy:4,flag:'s2_parrot'}}]},
  {l:T('Tell the constable','告诉捕快'),out:[{w:2,t:T('He laughs at you for a full minute.','他对着你笑了足足一盏茶的工夫。'),c:'muted'},{w:1,t:T('He checks, grumbling. There is something under the well. You do not ask what.','他嘟囔着去查了。井底下真有东西。你没敢问是什么。'),c:'good',fx:{fame:2,align:2}}]},
  {l:T('Walk on','走开'),out:[{t:T('The words follow you down the street.','那句话一路跟着你到了街尾。'),c:'muted'}]}]});

I({id:'s2_bunwar',age:[16,60],tags:S2T,cd:15,text:()=>T('Two bun shops face each other across the street, at war. Each owner secretly offers you ten taels to say theirs is better.','街两边的两家包子铺斗得正凶。两家老板都偷偷塞给你十两，要你说他家的好。'),
 opts:[{l:T('Praise one','夸一家'),out:[{t:T('You take the silver. The other shop now refuses to sell to you, for life.','你收了银子。另一家从此终身不卖你包子。'),fx:{money:10,align:-1}}]},
  {l:T('Praise both','两家都夸'),out:[{w:2,t:T('Both are furious. Both start giving you free buns to win you back.','两家都气坏了，都开始送你包子，想把你争取回去。'),c:'good',fx:{money:20,happy:4}},{w:1,t:T('Both owners chase you down the street together. It is the first thing they have done as a team.','两家老板一起追着你跑了半条街。这是他们第一次同心协力。'),c:'bad',fx:{happy:-1}}]},
  {l:T('Tell them to merge','劝他们合伙'),out:[{w:1,t:T('They stare at each other. Six months later you are invited to their wedding.','两人互相瞪着。半年后，你收到了他们的喜帖。'),c:'gold',fx:{happy:6,align:2}},{w:2,t:T('They laugh you out of both shops.','两家一起把你笑出了门。'),c:'muted'}]}]});

/* ====================== sect & occupation ====================== */
I({id:'s2_sectkitchen',age:[16,45],w:1.4,cd:12,when:s=>!!s.sect&&!s.retired,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(60,80)});return c},
 text:(c,s)=>T(`It is your turn for kitchen duty at ${SECTS[s.sect].en}. The old cook, ${c.npc.en}, chops vegetables in a way that makes the hair on your arms stand up.`,`轮到你在${SECTS[s.sect].cn}的伙房当值。老厨子${c.npc.zh}切菜的手法，看得你汗毛直竖。`),
 opts:[{l:T('Watch him closely','偷偷细看'),out:[{w:2,t:T('His chopping is a sword form. By the end of the month, so is yours.','他切菜用的是一路剑法。一个月下来，你也会了。'),c:'gold',fx:{skill:3,qi:1}},{w:1,t:T('He catches you staring and has you peel a thousand turnips. Your wrists have never been stronger.','他发现你在偷看，罚你削了一千个萝卜。你的手腕从没这么有劲过。'),fx:{happy:-2,maxHealth:1}}]},
  {l:T('Ask him to teach you','请他指点'),out:[{w:1,t:T('"Cut," he says, and gives you the knife. That is the whole lesson. It is a good lesson.','"切，"他把刀递给你。这就是全部的教诲。是很好的教诲。'),c:'good',fx:{skill:2,smarts:1}},{w:1,t:T('"I am a cook," he says. He is lying, but he means it.','"我就是个厨子，"他说。他在撒谎，可他是认真的。'),c:'muted'}]},
  {l:T('Slack off','偷懒'),out:[{t:T('The rice burns. Two hundred disciples know your name by supper.','饭烧糊了。到晚饭时，两百个弟子都知道了你的名字。'),c:'bad',fx:{happy:1,fame:-1}}]}]});

I({id:'s2_sectsuccession',age:[25,60],w:1.5,once:1,when:s=>!!s.sect&&!s.retired&&s.rank>=1&&s.rank<4,
 text:(c,s)=>T(`The master of ${SECTS[s.sect].en} is old. Two elders are gathering support to succeed him: one stern, one kind. Both have asked for yours.`,`${SECTS[s.sect].cn}掌门年事已高。两位长老都在拉拢人心想接位：一位严厉，一位宽厚。两人都找上了你。`),
 opts:[{l:T('Back the stern elder','支持严厉的那位'),out:[{w:1,t:T('He wins. The sect grows stricter and stronger. He remembers who stood with him.','他赢了。门规更严，门派更强。他记得谁站在他这边。'),c:'good',fx:{fame:2,skill:2}},{w:1,t:T('He loses. You are sent to guard the back mountain for a year. The quiet is good for your inner energy.','他输了。你被打发去后山看守一年。那份清静倒正好养气。'),c:'muted',fx:{qi:5,happy:-3}}]},
  {l:T('Back the kind elder','支持宽厚的那位'),out:[{w:1,t:T('She wins. The younger disciples smile more. So do you.','她赢了。年轻弟子们笑容多了，你也一样。'),c:'good',fx:{happy:5,align:2}},{w:1,t:T('She loses. The new master is polite to you in a way that feels like winter.','她输了。新掌门对你很客气，客气得像冬天。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Stay neutral','两不相帮'),out:[{w:2,t:T('Both distrust you. It is very restful.','两边都不信任你。倒落得清净。'),c:'muted'},{w:1,t:T('The fight drags on so long that someone suggests you as a compromise candidate. You decline, very fast.','两边僵持太久，有人居然提议让你当折中人选。你推辞得飞快。'),fx:{fame:3,happy:2}}]}]});

I({id:'s2_sectscripture',age:[16,50],w:1.2,cd:15,when:s=>!!s.sect&&!s.retired,
 text:(c,s)=>T(`Copying the manuals of ${SECTS[s.sect].en}, you notice one character that looks wrong. If it is a mistake, a whole technique has been taught backwards for a generation.`,`在抄录${SECTS[s.sect].cn}的秘籍时，你发现有一个字不太对。若真是错字，那一整招已经倒着教了一代人。`),
 opts:[{l:T('Report it to the elders','禀告长老'),out:[{w:s=>s.smarts/25,t:T('You are right. The elders argue for a week, then quietly correct it. Your master pats your head like a child.','你是对的。长老们吵了一个星期，然后悄悄改了。师父像拍孩子似的拍了拍你的头。'),c:'gold',fx:{skill:3,qi:2,fame:1}},{w:2,t:T('It was not a mistake. It was an old way of writing. You are told to copy the chapter forty times.','那不是错字，是古写法。你被罚把那一章抄四十遍。'),c:'bad',fx:{happy:-3,smarts:2}}]},
  {l:T('Copy it as written','照抄'),out:[{t:T('It is not your job to fix the world. It is your job to copy.','匡正天下不是你的事。你的事是抄书。'),c:'muted'}]},
  {l:T('Practise it secretly both ways','私下两种都练'),out:[{w:2,t:T('The "wrong" way is better. You keep this to yourself.','"错"的那种更好。你没跟任何人说。'),c:'good',fx:{skill:4,align:-1}},{w:1,t:T('Both ways at once tangle your meridians.','两种同时练，经脉拧成了一团。'),c:'bad',fx:{hurt:[8,18],cause:T('tangled meridians','经脉错乱'),ill:'inner'}}]}]});

I({id:'s2_sectfix',age:[16,40],w:1.3,cd:10,when:s=>!!s.sect&&!s.retired,ctx:s=>{const c=scene();c.npc=npc(s,{age:clamp(s.age+rint(1,6),16,50),lv:Math.max(5,power(s)+rint(-5,10))});return c},
 text:c=>T(`Before the sect’s annual contest, your senior, ${c.npc.en}, takes you aside. "Lose to me in the second round. I need this. I will make it up to you."`,`门中年比之前，师兄${c.npc.zh}把你拉到一边。"第二轮输给我。我需要这一场。以后补报你。"`),
 opts:[{l:T('Agree','答应'),out:[{w:2,t:c=>T(`You lose convincingly. ${c.npc.en} keeps the promise.`,`你输得像模像样。${c.npc.zh}说话算话。`),fx:{align:-2,meet:'friend',bond:60,money:20}},{w:1,t:T('You lose. Nobody makes anything up to you.','你输了。谁也没补报你什么。'),c:'bad',fx:{align:-2,happy:-4}}]},
  {l:T('Refuse and fight honestly','拒绝，堂堂正正地比'),fight:FG((s,c)=>c.npc.lv,'spar',T('The annual contest','门中年比'),T('a sect contest','门中比武')),
   win:[{t:T('You win in front of the whole sect. Your senior bows stiffly and never quite forgives you.','你当着全派的面赢了。师兄僵硬地行了礼，从此再没真正原谅你。'),c:'good',fx:{fame:3,meet:'rival',bond:30}}],
   lose:[{t:T('He wins fairly. Afterwards he looks relieved and a little ashamed.','他赢得光明正大。事后他看上去松了口气，又有些惭愧。'),c:'muted',fx:{align:1}}]},
  {l:T('Tell the master','告诉师父'),out:[{t:c=>T(`${c.npc.en} is barred from the contest. The whole sect knows who told.`,`${c.npc.zh}被取消了比武资格。全派都知道是谁告的状。`),c:'muted',fx:{align:3,enemy:1}}]}]});

I({id:'s2_escortcoffin',age:[16,60],w:2,cd:10,when:s=>s.job==='escort'||s.family==='escort',ctx:s=>{const c=scene();c.npc=npc(s,{occ:12,sex:'f',age:rint(16,24)});return c},
 text:()=>T('You are guarding a coffin on its way home for burial. On the third night, it knocks.','你押送一口棺材回乡安葬。第三天夜里，棺材里有人敲了三下。'),
 opts:[{l:T('Open it','开棺'),out:[{w:2,t:c=>T(`Inside is ${c.npc.en}, very much alive, escaping a marriage to a man of sixty. She asks you not to tell.`,`里面躺着${c.npc.zh}，活得好好的，正在逃一桩嫁给六十岁老头的婚事。她求你别说出去。`),c:'good',fx:{align:3,meet:'acq',bond:60}},{w:1,t:T('Inside is a very startled smuggler sitting on two hundred taels of salt. He offers you half.','里面是个吓坏了的私盐贩子，屁股底下坐着二百两的盐。他说分你一半。'),fx:{money:60,align:-3}},{w:1,t:T('It is a dead man. The knocking was a rat. You do not sleep for the rest of the trip.','是个死人。敲棺材的是只老鼠。后半程你再没合过眼。'),c:'muted',fx:{happy:-3}}]},
  {l:T('Keep going and say nothing','继续走，什么也不说'),out:[{t:T('You deliver it. The family weeps. The knocking stops at the graveside. You will never know.','你把棺材送到了。家属痛哭。到了坟边，敲声停了。你永远不会知道是怎么回事。'),c:'muted',fx:{money:30}}]}]});

I({id:'s2_doctorkiller',age:[18,60],w:3,cd:12,when:s=>s.job==='doctor',ctx:s=>{const c=scene();c.npc=npc(s,{occ:28,age:rint(25,45)});return c},
 text:c=>T(`At midnight a man with a knife wound in his side climbs through your window. You recognise ${c.npc.en} from the wanted posters.`,`半夜，一个腰上带刀伤的人翻窗进来。你认得他——告示上画的${c.npc.zh}。`),
 opts:[{l:T('Treat him','医治'),out:[{w:2,t:T('He leaves before dawn. On your table: a gold bar and a single word, "Debt."','他天亮前走了。桌上留着一根金条和一个字："债。"'),c:'gold',fx:{money:100,align:-1}},{w:1,t:T('He is found two streets away. The constables want to know who stitched him.','他在两条街外被抓了。捕快想知道是谁给他缝的伤口。'),c:'bad',fx:{wanted:1}}]},
  {l:T('Treat him, then call the constables','治好再报官'),out:[{w:1,t:T('He is taken in his sleep. The reward is generous.','他在睡梦中被擒。赏银丰厚。'),c:'good',fx:{money:50,align:3,fame:1}},{w:1,t:T('He wakes first. He leaves, and promises to come back.','他先醒了。他走了，说还会回来。'),c:'bad',fx:{enemy:1}}]},
  {l:T('Refuse','不治'),out:[{t:T('He climbs back out. Somewhere a doctor’s oath feels heavier.','他又翻了出去。医者的誓言在你心上重了几分。'),c:'muted',fx:{align:-2}}]}]});

I({id:'s2_monkeycase',age:[16,60],w:3,cd:12,when:s=>s.job==='constable'||s.job==='guard',
 text:()=>T('A string of thefts from upper-storey windows. No ladder marks. No footprints. Just banana peel.','接连几起楼上窗口失窃。没有梯子印，没有脚印，只有香蕉皮。'),
 opts:[{l:T('Stake out the rooftops','埋伏屋顶'),out:[{w:2,t:T('The thief is a trained monkey from a travelling opera troupe. The magistrate sentences the monkey to ten strokes. The monkey bites him.','贼是个流动戏班养的猴子。县官判了猴子十板子，猴子咬了县官一口。'),c:'good',fx:{fame:2,happy:4}},{w:1,t:T('You fall asleep on a roof and wake up without your boots.','你在屋顶上睡着了，醒来时靴子没了。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Arrest the troupe master','抓戏班班主'),out:[{t:T('He confesses and returns everything. The monkey looks smug.','他招了，把东西都还了。猴子一脸得意。'),c:'good',fx:{align:1,money:10}}]},
  {l:T('Let it slide','睁一只眼闭一只眼'),out:[{t:T('Your superior notices. So does the monkey, who starts leaving you bananas.','上司注意到了。猴子也注意到了，开始给你留香蕉。'),c:'muted',fx:{f:s=>{s.perf=clamp(s.perf-10,0,100)}}}]}]});

I({id:'s2_sealedbox',age:[16,60],w:2,cd:15,when:s=>['waiter','porter','clerk'].includes(s.job),
 text:()=>T('A guest leaves a heavy sealed box in your keeping. "Back in three days." It has been three months.','一位客人把一只沉甸甸的封箱交你保管。"三天就回来。"已经三个月了。'),
 opts:[{l:T('Open it','打开'),out:[{w:1,t:T('Silver ingots, and a list of names with lines through most of them.','银锭，还有一张名单，大多数名字已被划去。'),c:'muted',fx:{money:80,align:-2}},{w:1,t:T('Stones. Very carefully wrapped stones.','石头。包得仔仔细细的石头。'),fx:{happy:2}},{w:1,t:T('A manual of breathing exercises, annotated in an angry hand.','一本吐纳心法，页边写满了气冲冲的批注。'),c:'good',fx:{qi:5}}]},
  {l:T('Keep waiting','继续等'),out:[{w:1,t:T('After a year, a woman in mourning comes for it. She pays you for every day you waited.','一年后，一个披麻戴孝的女人来取。她按你等的每一天付了钱。'),c:'good',fx:{money:40,align:2}},{w:1,t:T('Nobody ever comes. The box becomes a stool.','一直没人来。那箱子后来成了凳子。'),c:'muted'}]},
  {l:T('Hand it to the magistrate','交给官府'),out:[{t:T('Paperwork. A great deal of paperwork.','一堆文书。非常多的文书。'),c:'muted',fx:{align:1}}]}]});

I({id:'s2_genealogy',age:[25,60],w:1.3,once:1,when:s=>['clan','noble','merchant','scholar'].includes(s.family),
 text:()=>T('The family is revising its genealogy. A cousin wants to remove the founder of the family fortune, who was, it turns out, a highway robber.','家里在重修族谱。一个堂亲想把发家的老祖宗删掉——原来他是个剪径的强盗。'),
 opts:[{l:T('Keep the robber in','留着强盗祖宗'),out:[{t:T('"Without him, we would all be farmers." The old women agree with you, which ends the argument.','"没他，咱们全家都还在种地。"老太太们都站在你这边，这事就定了。'),c:'good',fx:{align:2,happy:3}}]},
  {l:T('Remove him','删掉'),out:[{t:T('That night you dream of a man with a red sash, shaking his head at you.','当晚你梦见一个系红腰带的汉子，冲你直摇头。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Add a more impressive ancestor','添个体面的祖宗'),out:[{w:1,t:T('You invent a Tang-dynasty general. Three generations later, people will believe it.','你编了个唐朝大将军。三代之后，人们会信以为真的。'),fx:{fame:1,align:-1,happy:3}},{w:1,t:T('A scholar at the clan banquet asks which battle the general fought. You name the wrong dynasty.','族宴上一个读书人问那位将军打过哪一仗。你说错了朝代。'),c:'bad',fx:{happy:-4}}]}]});

I({id:'s2_stagecritic',age:[16,60],w:3.2,cd:10,when:s=>s.job==='actor'||s.job==='story',ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:rint(25,45),lv:Math.max(5,power(s)+rint(-5,5))});return c},
 text:c=>T(`Mid-performance, a man in the front row stands up. ${c.npc.en} belongs to the sect you are making fun of, and he has a sword.`,`演到一半，前排有人站了起来。${c.npc.zh}正是你戏里挖苦的那个门派的人，手里还握着剑。`),
 opts:[{l:T('Change the story on the spot','当场改戏'),out:[{w:s=>s.smarts/20,t:T('The villain becomes a hero halfway through. The audience calls it a daring new interpretation.','反派演到一半成了英雄。观众说这是大胆的新解。'),c:'good',fx:{fame:2,happy:3}},{w:1,t:T('The story now makes no sense. He sits down, confused. That is enough.','故事完全讲不通了。他一头雾水地坐下了。这也就够了。'),c:'muted'}]},
  {l:T('Keep going','照演不误'),fight:FG((s,c)=>c.npc.lv,'light',T('A critic in the front row','台下的看客'),T('an offended swordsman','被冒犯的剑客')),
   win:[{t:T('You disarm him with a prop spear. The audience thinks it is part of the show and demands it every night.','你用道具枪下了他的剑。观众以为是戏的一部分，以后每晚都要看这一出。'),c:'good',fx:{fame:3,money:20}}],lose:[{t:T('The show ends early. The reviews are mixed.','戏提前散了场。评价褒贬不一。'),c:'bad'}]},
  {l:T('Invite him on stage','请他上台'),out:[{t:c=>T(`${c.npc.en} is a terrible actor and loves it. He comes back every week.`,`${c.npc.zh}演得奇烂无比，却乐在其中。从此每周都来。`),c:'good',fx:{meet:'friend',bond:60,happy:4}}]}]});

/* ====================== regions ====================== */
I({id:'s2_rg_tomb',age:[16,60],tags:S2W,w:1.3,cd:15,when:inRegion('central'),
 text:()=>T('Near Luoyang, men with long half-pipe shovels ask if you want to come down into an old tomb with them. "Han dynasty. Very good."','洛阳城外，几个扛着洛阳铲的汉子问你要不要一起下古墓。"汉墓，好货。"'),
 opts:[{l:T('Go down','下墓'),out:[{w:2,t:T('Bronze mirrors and jade cicadas. You will not sleep well, but you will sleep rich.','铜镜和玉蝉。你睡不安稳了，但睡得很阔气。'),c:'gold',fx:{money:[100,300],align:-4}},{w:1,t:T('A trap fires a rusted crossbow. It still works.','机关射出一支生锈的弩箭。居然还能用。'),c:'bad',fx:{hurt:[10,25],cause:T('a tomb trap','墓中机关')}},{w:1,t:T('The tomb was robbed a thousand years ago. The earlier robbers left a note: "Too late."','这墓一千年前就被盗过了。前人留了张字条："来晚了。"'),fx:{happy:3}}]},
  {l:T('Report them','报官'),out:[{t:T('The magistrate gives you a reward and a lecture on the dignity of the dead.','县官赏了你银子，还讲了一通逝者尊严的大道理。'),c:'good',fx:{money:20,align:3}}]},
  {l:T('Decline','不去'),out:[{t:T('Their shovels clink away into the night.','他们的铲子叮叮当当地消失在夜色里。'),c:'muted'}]}]});

I({id:'s2_rg_lotussong',age:[16,50],tags:S2W,w:1.3,cd:12,when:inRegion('jiangnan'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:16,sex:'f',age:rint(17,30)});return c},
 text:c=>T(`On the canal, a lotus-picking girl, ${c.npc.en}, sings as her boat passes yours. The words are odd: "The moon is early at the third bridge. Do not cross."`,`河道上，采莲女${c.npc.zh}的船从你身边划过，她唱着歌，词儿却怪："三桥月早，莫过桥。"`),
 opts:[{l:T('Heed the warning','听她的'),out:[{w:2,t:T('That night salt smugglers rob everyone who crosses the third bridge. You were not one of them.','那晚，私盐贩子劫了所有过第三座桥的人。你不在其中。'),c:'good',fx:{happy:3}},{w:1,t:c=>T(`You find ${c.npc.en} later and thank her. She is an informer for the river patrol, and she likes your manners.`,`后来你找到${c.npc.zh}道谢。她是水上巡检的眼线，挺喜欢你的礼数。`),c:'good',fx:{meet:'acq',bond:60}}]},
  {l:T('Sing back','对歌'),out:[{w:2,t:T('It turns into a singing match that lasts all afternoon. Boats gather. You lose, beautifully.','对着对着成了一场赛歌，唱了一下午。船越聚越多。你输了，输得很好听。'),c:'good',fx:{happy:6,fame:1}},{w:1,t:T('Your voice frightens the ducks.','你的嗓子吓飞了一群鸭子。'),fx:{happy:2}}]},
  {l:T('Ignore it and cross','不理，照过'),out:[{t:T('At the third bridge, the moon is indeed early. So are the smugglers.','到了第三座桥，月亮果然出得早，私盐贩子也是。'),c:'bad',fx:{money:[-40,-10],hurt:[3,10],cause:T('river smugglers','私盐贩子')}}]}]});

I({id:'s2_rg_facechange',age:[16,50],tags:S2T,w:1.3,cd:15,when:inRegion('shu'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:30,sex:'m',age:rint(45,70)});return c},
 text:c=>T(`In Chengdu, the opera master ${c.npc.en} changes his face seven times in one turn of his head. The secret is passed only from father to son.`,`在成都，川剧名角${c.npc.zh}一扭头就变了七张脸。这门绝活只传儿子，不传外人。`),
 opts:[{l:T('Ask to be his apprentice','拜师'),out:[{w:2,t:T('He lets you carry his chests for a year and teaches you nothing. On the last day, he shows you one flick of the sleeve. It is enough.','他让你扛了一年箱子，什么都没教。最后一天，他给你看了一下甩袖。够了。'),c:'good',fx:{smarts:2,skill:2}},{w:1,t:T('"I have three sons and they are all useless," he says. "No."','"我有三个儿子，个个不成器，"他说，"不行。"'),c:'muted'}]},
  {l:T('Sneak backstage','溜进后台'),out:[{w:1,t:T('You see silk masks folded thinner than paper. Then you see him, seeing you.','你看见比纸还薄的绸面叠在一起。然后你看见他正看着你。'),c:'bad',fx:{align:-2,happy:-2}},{w:1,t:T('You find his son practising alone and crying. You end up teaching each other card tricks.','你撞见他儿子一个人边练边哭。最后你们互相教起了纸牌戏法。'),c:'good',fx:{happy:4}}]},
  {l:T('Just applaud','只管叫好'),out:[{t:T('Some things are better not understood.','有些事，不懂才好。'),fx:{happy:4}}]}]});

I({id:'s2_rg_plankroad',age:[16,60],tags:S2W,w:1.3,cd:12,when:inRegion('shu'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:16,sex:'m',age:rint(30,55)});return c},
 text:()=>T('On a plank road bolted to a cliff above the gorge, a board snaps under the mule ahead of you. The mule hangs by its harness.','栈道钉在悬崖上，下面是峡谷。你前头那头骡子踩断了一块木板，挂在缰绳上晃荡。'),
 opts:[{l:T('Grab the harness','抓住缰绳'),out:[{w:s=>s.t.root/3,t:T('You haul the mule up. The muleteer kisses you on both cheeks and refuses to let you pay for anything for a week.','你把骡子拽了上来。赶骡人在你两边脸上各亲了一口，一个星期不让你花一文钱。'),c:'good',fx:{align:3,money:20,happy:3}},{w:1,t:T('You save the mule and nearly go over yourself. Your hands shake until evening.','骡子救上来了，你自己差点掉下去。你的手一直抖到傍晚。'),c:'muted',fx:{hurt:[4,12],cause:T('the cliff road','栈道'),align:3}}]},
  {l:T('Hug the cliff','贴紧崖壁'),out:[{t:T('The muleteer saves it alone, then looks at you for a long time.','赶骡人一个人把骡子救了上来，然后久久地看着你。'),c:'muted',fx:{align:-1,happy:-2}}]}]});

I({id:'s2_rg_wrestle',age:[16,50],tags:S2W,w:1.3,cd:10,when:inRegion('north'),
 text:()=>T('At a summer fair on the grassland, wrestlers in leather vests stomp in a circle like eagles. One beckons to you.','草原上的夏日集会，穿皮坎肩的摔跤手像鹰一样踏着步子绕场。其中一个朝你招手。'),
 opts:[{l:T('Wrestle','下场摔'),fight:FG(PW(1.0,5),'spar',T('Grassland wrestling','草原摔跤'),T('a grassland wrestler','草原摔跤手'),()=>T('the grassland wrestler','摔跤手')),
   win:[{t:T('You throw him. The crowd roars. You win a sheep, which follows you everywhere.','你把他摔倒了。全场欢呼。你赢了一只羊，它从此跟着你走。'),c:'good',fx:{fame:2,money:30,happy:5}}],
   lose:[{t:T('You fly. The crowd cheers anyway, and someone hands you a bowl of fermented mare’s milk.','你飞了出去。大家照样欢呼，有人递来一碗马奶酒。'),c:'muted',fx:{happy:3}}]},
  {l:T('Drink kumis and watch','喝马奶酒看热闹'),out:[{w:2,t:T('Sour, fizzy, strong. By sunset you are singing in a language you do not speak.','酸，冒泡，冲。到日落时，你在用一种你不会的语言唱歌。'),fx:{happy:5}},{w:1,t:T('Your stomach disagrees with kumis. Loudly.','你的肚子跟马奶酒合不来，闹得很响。'),c:'bad',fx:{hurt:[2,6],cause:T('fermented mare’s milk','马奶酒')}}]}]});

I({id:'s2_rg_icefish',age:[16,60],tags:S2W,w:1.3,cd:12,when:inRegion('north'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:15,age:rint(20,50)});return c},
 text:c=>T(`Ice fishing on a frozen lake, you hear a crack. ${c.npc.en}, a few holes over, goes through the ice.`,`你在冰湖上凿洞钓鱼，忽听咔嚓一声。隔着几个冰洞的${c.npc.zh}掉进了冰窟窿。`),
 opts:[{l:T('Crawl out and grab him','爬过去拉他'),out:[{w:2,t:c=>T(`You drag ${c.npc.en} out. You both shake by the fire all night and become friends for life.`,`你把${c.npc.zh}拖了上来。两人在火边抖了一夜，成了一辈子的朋友。`),c:'good',fx:{align:4,meet:'friend',bond:70,ill:'cold'}},{w:1,t:T('The ice breaks under you too. You both get out. Barely.','你身下的冰也裂了。两人都爬了上来，差一点。'),c:'bad',fx:{align:4,hurt:[8,18],cause:T('a frozen lake','冰湖'),ill:'cold'}}]},
  {l:T('Throw your fishing line','扔钓线'),out:[{w:1,t:T('It holds. He climbs out, and so does the biggest fish of the winter, still on the hook.','线没断。他爬了上来，还带上来一条整个冬天最大的鱼，就挂在钩上。'),c:'good',fx:{align:3,happy:5}},{w:1,t:T('The line snaps. Others pull him out. Nobody looks at you.','线断了。别人把他拉了上来。没人看你一眼。'),c:'muted',fx:{happy:-3}}]}]});

I({id:'s2_rg_mirage',age:[16,60],tags:S2W,w:1.3,cd:12,when:inRegion('west'),
 text:()=>T('In the desert, a city with green gates and a busy inn shimmers on the horizon. The caravan leader says it is not there.','沙漠里，地平线上浮着一座城，绿色的城门，热闹的客栈。驼队首领说那是假的。'),
 opts:[{l:T('Walk toward it','走过去'),out:[{w:1,t:T('It is real: a tiny oasis and an inn run by a Persian widow who has waited years for a guest. She will not let you pay.','是真的：一小片绿洲，一家客栈，一个波斯寡妇等客人等了好些年。她不肯收你的钱。'),c:'good',fx:{heal:20,happy:6}},{w:2,t:T('It walks away as fast as you walk toward it. You come back thirsty and humbled.','你走多快，它就退多快。你回来时又渴又惭愧。'),c:'bad',fx:{hurt:[5,12],cause:T('thirst in the desert','沙漠里的焦渴')}},{w:1,t:T('No city, but half-buried ruins with old Buddhist murals. A painted monk seems to be breathing in a particular way.','没有城，只有半埋的废墟和古老的佛窟壁画。画中一个僧人像是在用一种特别的法子呼吸。'),c:'gold',fx:{qi:5,smarts:2}}]},
  {l:T('Stay with the caravan','跟着驼队'),out:[{t:T('The camels do not even look at it. Wise animals.','骆驼连看都不看一眼。聪明的牲口。'),c:'muted'}]}]});

I({id:'s2_rg_sisterrice',age:[16,40],tags:S2T,w:1.6,cd:6,when:inRegion('miao'),ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-3,3),16,45)});return c},
 text:c=>T(`At the Sisters’ Meal festival, ${c.npc.en} hands you a packet of five-coloured rice. What is hidden inside is the answer.`,`姊妹节上，${c.npc.zh}递给你一包五色糯米饭。里面藏着的东西，就是答案。`),
 opts:[{l:T('Open it','打开'),out:[{w:2,if:s=>!spouseOf(s),t:c=>T(`A pair of chopsticks. A pair means yes. ${c.npc.en} is already blushing.`,`一双筷子。成双就是愿意。${c.npc.zh}的脸已经红了。`),c:'gold',fx:{meet:'lover',bond:60,happy:6}},{w:1,t:T('A red chilli. It means no. Everybody laughs, including you, eventually.','一个红辣椒。意思是不行。大家都笑了，最后你也笑了。'),fx:{happy:1}},{w:1,t:c=>T(`A single chopstick. Friends, then. ${c.npc.en} teaches you the festival songs all night.`,`一根筷子。那就做朋友吧。${c.npc.zh}教了你一夜的节日歌。`),c:'good',fx:{meet:'friend',bond:60,happy:3}}]},
  {l:T('Sing a song in return','回唱一首'),out:[{t:T('The whole village joins in. You are not sure what you agreed to, but it was beautiful.','全寨子都跟着唱了起来。你不确定自己答应了什么，但很好听。'),c:'good',fx:{happy:5}}]}]});

I({id:'s2_rg_tidalbore',age:[16,50],tags:S2W,w:1.3,cd:10,when:inRegion('east'),
 text:()=>T('At the autumn tide the river runs backwards in a wall of water. Young men with red flags dive in to ride it.','秋潮到了，江水倒灌，立起一堵水墙。年轻人举着红旗跳进去弄潮。'),
 opts:[{l:T('Ride the tide','下水弄潮'),out:[{w:s=>s.t.root/3,t:T('You come up on the crest with your flag dry. The bank roars your name.','你踏着浪头冒了出来，手里的旗子一点没湿。岸上齐声喊你的名字。'),c:'gold',fx:{fame:4,happy:5}},{w:2,t:T('The tide takes you two li upriver and leaves you in a fish trap.','潮水把你冲到上游两里，扔进了一个鱼笼。'),c:'bad',fx:{hurt:[8,22],cause:T('the tidal bore','钱塘潮')}}]},
  {l:T('Watch from the seawall','在海塘上看'),out:[{w:2,t:T('It is the loudest thing you have ever heard. You feel very small and very happy.','那是你听过最响的声音。你觉得自己很渺小，也很快乐。'),fx:{happy:5}},{w:1,t:T('A child slips off the wall. You catch his collar just in time.','一个孩子从塘上滑了下去。你及时揪住了他的衣领。'),c:'good',fx:{align:4,fame:1}}]}]});

I({id:'s2_rg_examring',age:[16,45],tags:S2T,w:1.3,cd:12,when:inRegion('capital'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:rint(25,50)});return c},
 text:c=>T(`In a capital wineshop, ${c.npc.en} whispers that he has this year’s exam questions. A hundred taels.`,`京城的酒肆里，${c.npc.zh}悄声说他有今年的考题。一百两。`),
 opts:[{l:T('Buy them','买'),cost:100,out:[{w:2,t:T('The questions are copied from a book of last century’s exams. You have been had.','那些题是从上个世纪的考卷集里抄的。你上当了。'),c:'bad',fx:{happy:-4}},{w:1,t:T('They are real. You resell them to three nervous candidates and double your money.','是真的。你转手卖给三个惶惶不安的考生，赚了一倍。'),fx:{money:200,align:-5}},{w:.5,t:T('The censors raid the shop as you pay.','你付钱的当口，御史台的人冲了进来。'),c:'bad',fx:{jail:1}}]},
  {l:T('Report him to the censors','举报到御史台'),out:[{w:2,t:T('A whole cheating ring falls. Your name is mentioned in a memorial to the throne.','整个舞弊团伙被一锅端了。奏折里提到了你的名字。'),c:'gold',fx:{align:5,fame:3}},{w:1,t:T('The censor is in on it. You are politely asked to leave the capital.','御史也有份。你被客客气气地请出了京城。'),c:'bad',fx:{happy:-4,align:3}}]},
  {l:T('Laugh and leave','一笑了之'),out:[{t:T('The capital is full of men selling heaven by the ounce.','京城到处都是按两卖天的人。'),c:'muted'}]}]});

/* ====================== callbacks (setup flags are set above) ====================== */
I({id:'s2_cb_pearls',need:'s2_pearlthief',w:4,once:1,age:[20,70],when:s2gap('s2_pearlthief',3),
 text:()=>T('A carriage stops beside you. The woman inside, in silk and jade, is the pearl thief from the inn. She is married to the prefect now.','一辆马车在你身边停下。车里那位绫罗满身的夫人，正是当年客栈里的女贼。如今她是知府夫人了。'),
 opts:[{l:T('Greet her as an old friend','像老朋友那样问好'),out:[{w:2,t:T('She laughs, and for a moment she is the girl in black again. A purse lands in your hands. "For your silence. Again."','她笑了，那一刻又成了当年的黑衣姑娘。一只钱袋落在你手里。"封口费。又一次。"'),c:'good',fx:{money:80,happy:4,unflag:'s2_pearlthief'}},{w:1,if:s=>s.wanted>0,t:T('She says a word to her husband. Your warrant quietly disappears.','她跟丈夫说了句话。你的海捕文书悄悄撤了。'),c:'gold',fx:{f:s=>{s.wanted=0},unflag:'s2_pearlthief'}}]},
  {l:T('Pretend not to know her','装作不认识'),out:[{t:T('She nods, very slightly. A week later a single pearl arrives, with no note.','她微微点了点头。一周后，送来一颗珍珠，没有字条。'),c:'good',fx:{money:30,align:1,unflag:'s2_pearlthief'}}]},
  {l:T('Blackmail her','敲她一笔'),out:[{w:1,t:T('She pays. She also never forgets.','她给了。她也永远不会忘。'),c:'bad',fx:{money:200,align:-6,enemy:1,unflag:'s2_pearlthief'}},{w:1,t:T('"Who would believe you?" She is right. The carriage rolls on.','"谁会信你？"她说得对。马车走了。'),c:'muted',fx:{align:-3,unflag:'s2_pearlthief'}}]}]});

I({id:'s2_cb_roofboy',need:'s2_roofboy',w:4,once:1,age:[20,70],when:s2gap('s2_roofboy',5),ctx:s=>{const c=scene();c.npc=npc(s,{occ:9,sex:'m',age:rint(19,24)});return c},
 text:c=>T(`A young man stops you in the street and bows low. It takes you a moment: the boy from the rooftops, grown. His name is ${c.npc.en}.`,`一个年轻人在街上拦住你，深深一揖。你愣了片刻才认出来：当年屋顶上那个孩子，已经长大了。他叫${c.npc.zh}。`),
 out:[{w:2,t:T('He is a constable now. "My sister lived," he says. He has been looking for you for years.','他如今是个捕快了。"我妹妹活下来了，"他说。他找了你好些年。'),c:'gold',fx:{meet:'friend',bond:75,happy:6,unflag:'s2_roofboy'}},
  {w:1,t:T('He presses ten times your silver into your hands and refuses to take it back. You do not ask how he earns it.','他把十倍的银子塞给你，怎么也不肯收回。你没问他靠什么挣的。'),c:'good',fx:{money:100,unflag:'s2_roofboy'}},
  {w:1,t:T('He is the best thief in the province now, and very polite about it. He warns you that your house is on someone’s list.','他如今是全省最好的贼，还彬彬有礼。他提醒你，你家上了别人的名单。'),fx:{happy:3,meet:'acq',bond:60,unflag:'s2_roofboy'}}]});

I({id:'s2_cb_drunk',need:'s2_drunkmaster',w:4,once:1,age:[18,75],when:s2gap('s2_drunkmaster',3),
 text:()=>T('A man staggers up to you on the road and grabs your sleeve. The drunk from the crossroads. "I owe you one," he slurs.','路上一个人踉踉跄跄地扑过来，揪住你的袖子。是当年路口那个醉汉。"欠你一回，"他含混地说。'),
 out:[{w:2,t:T('He sobers up for exactly one afternoon and teaches you more than any master has. Then he asks where the wine is.','他整整清醒了一个下午，教你的比哪个师父都多。然后问酒在哪儿。'),c:'gold',fx:{skill:4,qi:3,unflag:'s2_drunkmaster'}},
  {w:1,t:T('He pays the debt by drinking all your wine, leaving one copper coin, and telling you it was an honour.','他用喝光你所有的酒来还债，留下一文钱，说这是你的荣幸。'),fx:{money:-5,happy:3,unflag:'s2_drunkmaster'}},
  {w:1,t:T('He is dying, and knows it. He gives you his wine gourd. "It has never been empty," he says. It never is.','他快死了，自己也知道。他把酒葫芦给了你。"它从没空过，"他说。确实从没空过。'),c:'muted',fx:{happy:-2,qi:3,lifespan:1,unflag:'s2_drunkmaster'}}]});

I({id:'s2_cb_bride',need:'s2_runawaybride',w:4,once:1,age:[20,75],when:s2gap('s2_runawaybride',4),
 text:()=>T('A letter reaches you, years after the ferry. It is from the runaway bride.','渡口那件事过去好些年后，你收到一封信，是那个逃婚的新娘写来的。'),
 out:[{w:2,t:T('She runs a teahouse in another province. Enclosed: silver, and "the moustache, for luck".','她在外省开了家茶馆。信里夹着银票，还有"那撇胡子，图个吉利"。'),c:'good',fx:{money:50,happy:6,unflag:'s2_runawaybride'}},
  {w:1,t:T('She has a son. She named him after you, which will confuse him for life.','她生了个儿子，用你的名字起的名，这孩子要糊涂一辈子了。'),c:'gold',fx:{happy:8,align:2,unflag:'s2_runawaybride'}},
  {w:1,t:T('"I went home in the end," she writes. "But I had one year that was mine. Thank you for it."','"我最后还是回家了，"她写道，"可我有过一年属于自己的日子。谢谢你。"'),c:'muted',fx:{happy:-1,align:1,unflag:'s2_runawaybride'}}]});

I({id:'s2_cb_coffin',need:'s2_coffin',w:4,once:1,age:[30,80],when:s2gap('s2_coffin',4),
 text:()=>T('The coffin-maker has died. His apprentice delivers the coffin you ordered years ago. It is beautiful, and it is in your hall.','老棺材匠过世了。他的徒弟把你多年前订的棺材送来了。做得很美，就摆在你的厅堂里。'),
 opts:[{l:T('Keep it','留着'),out:[{t:T('You nap in it on hot afternoons. It is the coolest place in the house. Visitors stop visiting.','热天的午后你就在里面睡午觉，那是全家最凉快的地方。客人从此不大来了。'),fx:{happy:3,lifespan:1,unflag:'s2_coffin'}}]},
  {l:T('Sell it','卖了'),out:[{t:T('A rich man whose father died suddenly pays three times the price. "Cedar like this cannot be found."','一个刚死了爹的富户出了三倍的价。"这样的杉木找不到了。"'),c:'good',fx:{money:60,unflag:'s2_coffin'}}]},
  {l:T('Give it to a poor widow','送给贫寒的寡妇'),out:[{t:T('Her husband goes into the ground like a lord. She bows to you at every festival after.','她丈夫像个老爷一样风光下葬。此后每逢节日她都来给你行礼。'),c:'good',fx:{align:6,unflag:'s2_coffin'}}]}]});

I({id:'s2_cb_parrot',need:'s2_parrot',w:4,once:1,age:[20,75],when:s2gap('s2_parrot',3),
 text:()=>T('One evening the parrot says something new. A name.','一天傍晚，鹦鹉说了句新话——一个名字。'),
 out:[{w:2,t:T('An old woman passing your door hears it and drops her basket. It is her son’s name. The well. The body. The man who did it is still alive. The magistrate thanks you.','门口路过的老太太听见了，篮子掉在地上——那是她儿子的名字。井、尸首、凶手，凶手还活着。县官向你道谢。'),c:'gold',fx:{align:5,fame:3,unflag:'s2_parrot'}},
  {w:1,t:T('It is the name of its first owner, who turns up a week later, weeping, and pays you thirty taels to take it home.','那是它头一个主人的名字。一周后那人找上门来，哭着付了你三十两把它领回去。'),c:'good',fx:{money:30,happy:-1,unflag:'s2_parrot'}},
  {w:1,t:T('It is your name. It says it once more that night, and in the morning it is gone.','是你的名字。那晚它又说了一遍，第二天早上它就死了。'),c:'muted',fx:{happy:-4,unflag:'s2_parrot'}}]});

I({id:'s2_cb_peach',need:'s2_digtree',w:4,once:1,age:[20,75],when:s2gap('s2_digtree',4),
 text:()=>T('You pass the old man’s hut again. The old man is gone. The peach tree in the hole you dug is heavy with fruit.','你又路过那间草屋。老人已经不在了。你挖的那个坑里，桃树结满了果子。'),
 out:[{w:2,t:T('You eat one under the tree. It is the best peach of your life. You feel younger for a whole year.','你在树下吃了一个。那是你这辈子吃过最好的桃子。整整一年你都觉得自己年轻了。'),c:'gold',fx:{lifespan:1,happy:5,heal:15,unflag:'s2_digtree'}},
  {w:1,t:T('A girl living there now calls you "the hole-digger" and hands you a letter he left. Inside: a breathing method, and "Thank you for not asking."','如今住在那儿的小姑娘叫你"挖坑的"，递给你一封他留下的信。里面是一套吐纳法，还有一句："谢谢你没问。"'),c:'gold',fx:{qi:6,skill:2,unflag:'s2_digtree'}},
  {w:1,t:T('Someone has cut the tree down for firewood. Only the stump is left. You sit on it for an hour.','有人把树砍去当了柴。只剩一个树桩。你在上面坐了一个时辰。'),c:'muted',fx:{happy:-3,unflag:'s2_digtree'}}]});

I({id:'s2_cb_poem',need:'s2_poemflatter',w:4,once:1,age:[20,80],when:s2gap('s2_poemflatter',4),
 text:()=>T('News of the magistrate you once praised in verse.','有了那位你曾作诗颂扬的县太爷的消息。'),
 out:[{w:1,t:T('He has risen to the capital. A box of tea arrives with a copy of your poem, framed.','他已调进京城。送来一箱好茶，外加一幅装裱好的你那首诗。'),c:'good',fx:{money:60,fame:1,unflag:'s2_poemflatter'}},
  {w:1,t:T('He has been impeached for embezzlement. Your poem is read aloud at his trial, to great laughter.','他因贪墨被弹劾了。审案时有人当堂念了你的诗，满堂大笑。'),c:'bad',fx:{fame:-1,happy:-4,unflag:'s2_poemflatter'}},
  {w:1,t:T('He is old, poor and retired. He recites your poem to you from memory. It was the only praise anyone ever gave him.','他已老迈清贫，辞官在家。他把你那首诗一字不差地背给你听。那是他一辈子得到的唯一赞美。'),c:'muted',fx:{happy:2,align:1,unflag:'s2_poemflatter'}}]});
