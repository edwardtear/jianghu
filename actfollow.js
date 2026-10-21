/* 江湖一生 · activity follow-ups: small incidents that can happen right after the player does something from the menu.
   The engine calls pickIncident(s,'af_'+activityId) when an activity ends with nothing else pending.
   Every incident here is only:1 and tagged af_<activity>; stage incidents (two-step chains) are only:1 with no tags. */
'use strict';
const AF=d=>{d.only=1;d.cd=d.cd??8;I(d)};
const AFS=d=>{d.only=1;d.noThread=1;d.noRipple=1;I(d)};
const afN=o=>s=>{const c=scene();c.npc=npc(s,typeof o==='function'?o(s):(o||{}));return c};
const afPerf=(s,n)=>{s.perf=clamp((s.perf||0)+n,0,100)};
const afJob=s=>JOBS[s.job].n[s.jobLv||0];
const afSect=s=>SECTS[s.sect];

/* ================= practice 修炼 ================= */
AF({id:'af_pr_onlooker',age:[14,90],cd:8,tags:['af_practice'],ctx:afN({occ:21,age:9}),
 text:c=>T(`A small boy, ${c.npc.en}, has been watching you train from behind a woodpile. When you stop, he copies your last move, badly, and asks you to teach him.`,`一个叫${c.npc.zh}的小男孩躲在柴堆后面看你练功。你一收势，他就学着比划了一下你最后那招，比得歪歪扭扭，然后求你教他。`),
 opts:[{l:T('Show him a few moves','教他几招'),out:[{w:s=>.5+s.t.heart*.25,t:T('He is hopeless and delighted. Explaining the basics out loud makes you notice a flaw in your own footwork.','他笨得要命，乐得要命。你把基本功一句句讲出来，反倒发现自己步法里有个毛病。'),c:'good',fx:{skill:2,happy:3,meet:'acq',bond:65}},
   {w:1,t:T('His mother finds you and gives you a piece of her mind for filling his head with fighting.','他娘找上门来，把你数落了一顿，说你教坏了她儿子。'),c:'muted',fx:{happy:-2,align:1}},
   {w:s=>s.fame/40,t:T('By next week there are six of them, all waiting at the woodpile.','到了下个礼拜，柴堆后面蹲着六个了。'),c:'good',fx:{fame:1,happy:2}}]},
  {l:T('Shoo him away','把他轰走'),out:[{w:1,t:T('He goes. He is back the next day, quieter.','他走了。第二天又来了，只是躲得更深。'),c:'muted'},{w:1,t:T('He tells the whole lane you are a mean old thing.','他跟整条巷子说你是个凶巴巴的人。'),c:'muted',fx:{happy:-1}}]}]});
AF({id:'af_pr_strain',age:[10,90],cd:8,tags:['af_practice'],
 text:()=>T('On the last repetition something in your shoulder pulls hot and tight.','最后一遍时，你肩头一紧，一阵火辣辣的抽痛。'),
 opts:[{l:T('Push through it','咬牙练完'),out:[{w:s=>s.t.root*.25,t:T('The pain fades into warmth. Something stubborn in the move finally gives.','疼劲慢慢化成一股热流。那招里一直别扭的地方，终于顺了。'),c:'good',fx:{skill:2}},
   {w:1.5,t:T('You hear it before you feel it. The shoulder will remember this for a long time.','你先听见一声响，后才觉出疼。这肩膀往后好长一段时间都会记得今天。'),c:'bad',fx:{hurt:[4,10],cause:T('overtraining','练功过度'),f:s=>addCond(s,'wound',1)}}]},
  {l:T('Stop and rest it','停下歇着'),out:[{w:2,t:T('You ice it with well water. By morning it is only stiff.','你用井水敷了一夜，第二天只是有点僵。'),c:'muted',fx:{heal:3}},{w:s=>s.t.heart*.15,t:T('Sitting still, you go over the form in your head and see what you were doing wrong.','坐着不动的时候，你在脑子里把招式过了一遍，看出了毛病在哪。'),c:'good',fx:{skill:1,smarts:1}}]}]});
AF({id:'af_pr_critic',age:[12,90],cd:10,tags:['af_practice'],ctx:afN({occ:19,age:68,lv:120}),
 text:c=>T(`An old man with a gourd of wine has been watching. "Your weight is on the wrong foot," says ${c.npc.en}. "Has been the whole time."`,`一个拎着酒葫芦的老头看了半天。"重心放错脚了，"${c.npc.zh}说，"从头错到尾。"`),
 opts:[{l:T('Ask him to show you','请他指点'),out:[{w:s=>.6+s.t.wit*.2,t:T('He taps your knee with the gourd and moves your heel an inch. Suddenly the whole form makes sense.','他用酒葫芦敲了敲你的膝盖，把你的脚跟挪了一寸。整套招式忽然通了。'),c:'good',fx:{skill:2},next:'af_pr_critic2',keep:1},
   {w:1,t:T('He talks for an hour about a fight forty years ago, then falls asleep.','他絮絮叨叨讲了一个时辰四十年前的一场架，然后睡着了。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Ask him to prove it','让他露一手'),fight:FG(PW(1.05,4),'spar',T('An old man with a gourd','酒葫芦老头'),T('a friendly bout','切磋')),
   win:[{t:T('He laughs, wipes his mouth and says you have a little talent after all.','他哈哈一笑，抹抹嘴，说你倒还有点天分。'),c:'good',fx:{fame:1,meet:'acq',bond:60}}],
   lose:[{w:1,t:T('He puts you on your back with one finger, exactly where he said your weight was wrong.','他一根手指就把你放倒了，戳的正是他说你重心不对的地方。'),c:'muted',fx:{skill:1,smarts:1}},{w:1,t:T('He wins and drinks to it, and you are too sore to mind.','他赢了，喝了一大口庆祝。你疼得顾不上生气。'),c:'muted',fx:{hurt:[2,6],cause:T('a friendly bout','切磋')}}]},
  {l:T('Ignore him','不理他'),out:[{w:1,t:T('He shrugs and wanders off. Later you notice he was right.','他耸耸肩走了。后来你发现他说得没错。'),c:'muted',fx:{smarts:1}},{w:1,t:T('He keeps commenting until you go home.','他一直在旁边说个不停，直到你收工回家。'),c:'muted',fx:{happy:-1}}]}]});
AFS({id:'af_pr_critic2',
 text:c=>T(`${c.npc.en} shakes the empty gourd. "There is one more thing I could show you. It is thirsty work."`,`${c.npc.zh}晃了晃空葫芦："还有一手可以教你。只是这活儿费口水。"`),
 opts:[{l:T('Fill his gourd (10 taels)','给他打满一葫芦酒（十两）'),cost:10,out:[{w:s=>.6+s.t.root*.15+s.t.wit*.1,t:T('He drinks half and teaches you a breathing trick that makes your strikes land heavier.','他喝了半葫芦，教了你一个运气的窍门，出手一下子沉了许多。'),c:'good',fx:{qi:2,skill:1,meet:'acq',bond:70}},
   {w:1,t:T('He drinks all of it and forgets what he was going to say.','他一口气喝光了，忘了自己要说什么。'),c:'muted',fx:{happy:1}}]},
  {l:T('Thank him and go','道谢告辞'),out:[{w:1,t:T('He waves you off. "Pity."','他摆摆手："可惜了。"'),c:'muted'},{w:1,t:T('He calls after you one last tip, half of which you catch.','他在后面又喊了一句要诀，你听清了一半。'),c:'good',fx:{skill:1}}]}]});

/* ================= sparring 切磋 ================= */
AF({id:'af_sp_ribs',age:[12,80],cd:8,tags:['af_sparring'],ctx:afN({}),
 text:c=>T(`Your sparring partner, ${c.npc.en}, is still holding ${c.npc.his} ribs an hour after the bout. You may have hit harder than friendly.`,`切磋完一个时辰了，对手${c.npc.zh}还捂着肋下。你那一下，恐怕重了点。`),
 opts:[{l:T('Pay for medicine (10 taels)','出钱买药（十两）'),cost:10,out:[{w:s=>.8+s.t.heart*.2,t:T('Touched, they insist on buying the wine next time. A friendship starts over a bruise.','对方很感动，说下回一定请你喝酒。一段交情就这么从一块淤青开始了。'),c:'good',fx:{meet:'friend',bond:65,align:1}},{w:1,t:T('It was only a bruise. They pocket the money anyway.','其实就是块淤青。钱对方照收不误。'),c:'muted'}]},
  {l:T('Laugh it off','一笑了之'),out:[{w:s=>.5+s.fame/40,t:T('They decide you are worth beating one day. A rival is born.','对方暗暗发誓，总有一天要赢回来。你多了个对头。'),c:'muted',fx:{meet:'rival',bond:35}},{w:1,t:T('They laugh too, wincing. No harm done.','对方也跟着笑，笑得龇牙咧嘴。没什么大碍。'),c:'muted',fx:{happy:1}}]}]});
AF({id:'af_sp_scout',age:[14,70],cd:10,tags:['af_sparring'],ctx:afN({occ:8,age:45}),
 text:c=>T(`A broad-shouldered escort chief, ${c.npc.en}, was watching your bout. "Not bad. Do that again, harder, against me."`,`一个膀大腰圆的镖头${c.npc.zh}一直在旁边看。"不错。再来一遍，使上全力，冲我来。"`),
 opts:[{l:T('Show him','露一手'),fight:FG(PW(1.0,3),'spar',T('The escort chief’s test','镖头试招'),T('a friendly bout','切磋')),
   win:[{w:2,t:T('He offers you work on his next run and a little silver in advance.','他请你跟下一趟镖，还先给了点定钱。'),c:'good',fx:{money:[20,50],fame:1,meet:'acq',bond:60}},{w:1,t:T('He nods, impressed, and tells his men about you.','他点点头，挺服气，回去跟手下提起了你。'),c:'good',fx:{fame:2}}],
   lose:[{w:1,t:T('He lets you down gently and tells you what to work on.','他手下留情，还告诉你该在哪儿下功夫。'),c:'muted',fx:{skill:1}},{w:1,t:T('He was not gentle.','他可没手下留情。'),c:'bad',fx:{hurt:[3,8],cause:T('an escort chief’s test','镖头试招')}}]},
  {l:T('You are tired','今天累了'),out:[{w:1,t:T('"Another time, then." He seems to mean it.','"那改天吧。"他像是真的会再来。'),c:'muted'},{w:1,t:T('He shrugs. He has seen plenty of tired people.','他耸耸肩。累的人他见多了。'),c:'muted'}]}]});
AF({id:'af_sp_trick',age:[12,80],cd:10,tags:['af_sparring'],ctx:afN({}),
 text:c=>T(`Near the end, ${c.npc.en} used a twisting move you have never seen. It put you down before you knew what happened.`,`快结束时，${c.npc.zh}用了一招你从没见过的拧身法，你还没回过神就被放倒了。`),
 opts:[{l:T('Ask about it','开口请教'),out:[{w:s=>.5+s.smarts/40+s.looks/80,t:T('They are flattered and walk you through it twice.','对方被问得挺高兴，给你从头讲了两遍。'),c:'good',fx:{skill:2,meet:'acq',bond:60}},{w:1,t:T('"Family secret." Their face closes like a door.','"家传的。"对方脸色一下子关上了门。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Work it out alone at night','夜里自己琢磨'),out:[{w:s=>.4+s.t.wit*.2,t:T('By the third night you have it, or something just as good.','到第三个晚上，你琢磨出来了，或者说琢磨出了一招差不多的。'),c:'good',fx:{skill:2,smarts:1}},
   {w:1,t:T('You twist the wrong way and something inside goes cold and sour.','你拧反了方向，体内一股气走岔了，又冷又涩。'),c:'bad',fx:{hurt:[3,8],cause:T('a move practised wrong','练岔了招'),f:s=>addCond(s,'inner',1)}}]}]});

/* ================= seclusion 闭关 ================= */
AF({id:'af_sc_emerge',age:[14,95],cd:10,tags:['af_seclusion'],
 text:()=>T('You come out blinking into daylight. A whole season has passed. Somebody has been telling people you died in there.','你眯着眼走出关来。外面已经过了一季。有人到处说你死在里头了。'),
 opts:[{l:T('Go and see your friends','去看朋友'),out:[{w:s=>.8+s.t.heart*.2,t:T('They are loud with relief. You had not realised how much you were missed.','大家又惊又喜，吵成一片。你这才知道自己被人惦记着。'),c:'good',fx:{happy:5,f:s=>living(s,['friend','sworn']).forEach(p=>addBond(p,3))}},{w:1,t:T('Life went on without you. It is strange how little room there is now.','没有你，日子照样过。如今你发现，自己的位置小了很多。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Hold on to the stillness','守住这份清静'),out:[{w:s=>.5+s.t.heart*.2,t:T('For a few more days the calm stays with you, and your energy settles deeper.','那份平静又陪了你几天，内力也沉得更深了。'),c:'good',fx:{qi:2,happy:2}},{w:1,t:T('The noise of the world comes back all at once. You cannot sleep for days.','外面的嘈杂一下子全涌了回来。你好几天睡不着。'),c:'bad',fx:{happy:-3,f:s=>addCond(s,'shaken',1)}}]}]});
AF({id:'af_sc_voice',age:[14,95],cd:12,tags:['af_seclusion'],
 text:()=>T('On the fortieth night in seclusion you dreamed a figure moving through a form you have never learned. You still remember most of it.','闭关第四十夜，你梦见一个人影在练一套你从没学过的功夫。醒来大半还记得。'),
 opts:[{l:T('Write it down carefully','仔细记下来'),out:[{w:s=>.5+s.smarts/40,t:T('On paper it holds together. There is something real in it.','写在纸上，居然前后连贯。里头确有真东西。'),c:'good',fx:{skill:2,smarts:1}},{w:1,t:T('By daylight it reads like nonsense. You keep the pages anyway.','白天一看，全是胡话。可你还是把纸留着了。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Try it at once','立刻照着练'),out:[{w:s=>.4+s.t.root*.2,t:T('Your energy follows the dream as if it knew the way.','内力跟着梦里的路子走，像是认得路一样。'),c:'good',fx:{qi:3}},{w:1,t:T('Halfway through, your qi turns on itself. You spit blood and lie down for a week.','练到一半，内力倒冲回来。你吐了口血，躺了七天。'),c:'bad',fx:{hurt:[6,14],cause:T('qi deviation','走火入魔'),f:s=>addCond(s,'inner',1)}}]}]});

/* ================= study 研读秘籍 ================= */
AF({id:'af_st_margin',age:[10,95],cd:10,tags:['af_study'],
 text:()=>T('Someone who owned this manual before you wrote in the margins. In three places the notes say the text is wrong.','这本秘籍的前一个主人在页边写了批注，有三处说正文是错的。'),
 opts:[{l:T('Follow the notes','照批注练'),out:[{w:s=>.4+s.t.wit*.2,t:T('The notes were right. Whoever they were, they saw further than the author.','批注是对的。不管写的人是谁，眼光比作者还高。'),c:'good',fx:{skill:3}},{w:1,t:T('The notes were wrong, and confidently so. Your meridians ache for a month.','批注错了，还错得理直气壮。你经脉疼了一个月。'),c:'bad',fx:{hurt:[3,8],cause:T('a wrong note in a manual','秘籍批注有误'),f:s=>addCond(s,'inner',1)}}]},
  {l:T('Trust the printed text','照正文练'),out:[{w:2,t:T('Slow and safe. You make honest progress.','稳稳当当，一步一个脚印。'),c:'muted',fx:{skill:1}},{w:s=>s.smarts/50,t:T('Comparing the two, you understand why the author wrote it the way he did.','两相对照，你明白了作者为什么那样写。'),c:'good',fx:{skill:1,smarts:2}}]}]});
AF({id:'af_st_buyer',age:[14,95],cd:10,tags:['af_study'],ctx:s=>{const c=afN({age:35})(s);c.lv=PW(.95,3)(s);return c},
 text:c=>T(`Word gets around that you own a manual. ${c.npc.en} turns up at your door, very polite, offering 60 taels for a copy.`,`你手里有秘籍的事传了出去。${c.npc.zh}找上门来，客客气气，出六十两要一份抄本。`),
 opts:[{l:T('Sell a copy','卖一份抄本'),out:[{w:s=>.6+s.smarts/50,t:T('You copy it with a few small mistakes in the hard parts. Sixty taels, and your edge stays yours.','你抄的时候，在要紧处故意错了几笔。六十两到手，绝活还是你的。'),c:'good',fx:{money:60,align:-1}},{w:1,t:T('A month later the same move is all over town. Everyone knows it now.','一个月后，那一招满城都是。人人都会了。'),c:'muted',fx:{money:60,fame:-1}}]},
  {l:T('Refuse','不卖'),out:[{w:s=>.8+s.fame/30,t:c=>T(`Polite to the end, ${c.npc.he} leaves.`,'对方客客气气地走了。'),c:'muted'},{w:1,t:T('Polite turns to not polite. That night someone tries your window.','客气变成了不客气。当天夜里，有人来撬你的窗。'),c:'bad',next:'af_st_buyer2',keep:1}]}]});
AFS({id:'af_st_buyer2',
 text:c=>T(`It is ${c.npc.en}, masked badly, already halfway into the room.`,`是${c.npc.zh}，蒙着块破布，半个身子已经进了屋。`),
 opts:[{l:T('Fight','动手'),fight:FG((s,c)=>c.lv,'light',T('A thief at the window','窗前的贼'),T('a thief','窃贼')),
   win:[{w:1,t:T('You throw them back out the window. They do not come back.','你把对方从窗口扔了出去。再也没来过。'),c:'good',fx:{fame:1}},{w:1,t:T('You pin them down; they beg and pay you to keep quiet.','你把对方按在地上，对方求饶，还掏钱求你别声张。'),c:'good',fx:{money:[10,30]}}],
   lose:[{t:T('They get away with a few pages. You get a black eye.','对方抢走了几页纸跑了，你挨了一拳，眼眶乌青。'),c:'bad',fx:{hurt:[3,8],cause:T('a thief','窃贼'),looks:-1}}]},
  {l:T('Shout for the neighbours','大喊邻居'),out:[{w:1,t:T('Lamps go on all down the lane. The thief is gone in a heartbeat.','整条巷子的灯一下子都亮了，贼眨眼就没了影。'),c:'muted'},{w:1,t:T('The neighbours come, and the thief is caught in the hen house.','邻居们都来了，在鸡窝里把贼逮了个正着。'),c:'good',fx:{happy:2}}]}]});

/* ================= read 读书 ================= */
AF({id:'af_rd_scholar',age:[12,95],cd:8,tags:['af_read'],ctx:afN({occ:1,age:40}),
 text:c=>T(`A thin scholar, ${c.npc.en}, sees what you are reading and says the commentary you are using is famous for being wrong.`,`一个瘦书生${c.npc.zh}看见你读的书，说你用的那本注疏是出了名的谬误。`),
 opts:[{l:T('Argue the point','跟他辩'),out:[{w:s=>s.smarts/30,t:T('You hold your ground until dusk. He goes away beaten and asks if you will drink with him tomorrow.','你一直辩到天黑。他输了，临走问你明天肯不肯一起喝酒。'),c:'good',fx:{smarts:2,fame:1,meet:'friend',bond:60}},{w:1,t:T('He takes you apart in front of the whole teahouse.','他当着满茶馆的人把你驳得体无完肤。'),c:'bad',fx:{happy:-3,smarts:1}}]},
  {l:T('Ask what he recommends','请教他'),out:[{w:2,t:T('He lends you a better book, with a list of rules for its return.','他借给你一本更好的书，附上一张还书的规矩。'),c:'good',fx:{smarts:2}},{w:1,t:T('He recommends his own book. It is not good.','他推荐的是他自己写的书。写得并不好。'),c:'muted',fx:{happy:-1}}]}]});
AF({id:'af_rd_pamphlet',age:[14,95],cd:10,tags:['af_read'],
 text:()=>T('Folded inside a secondhand book is a pamphlet calling the county magistrate a thief, with names and numbers.','二手书里夹着一张传单，骂县太爷是贼，有名有姓，有数有目。'),
 opts:[{l:T('Read it closely','仔细读'),out:[{w:s=>.8+s.t.luck*.15,t:T('It is well argued, and true. You look at the yamen differently now.','写得有理有据，而且是真的。你从此看衙门的眼光不一样了。'),c:'muted',fx:{smarts:2,align:1}},{w:1,t:T('The bookseller saw you. A constable comes asking where you got it.','书贩子看见了。没多久就有捕快来问你东西从哪来的。'),c:'bad',fx:{wanted:1}}]},
  {l:T('Take it to the yamen','交到衙门'),out:[{w:s=>.5+s.fame/30,t:T('They thank you with a few taels and a long look.','衙门赏了你几两银子，多看了你几眼。'),c:'muted',fx:{money:[5,15],align:-2}},{w:1,t:T('They decide you must know the author. It takes a day to talk your way out.','他们认定你认得写传单的人。你费了一整天口舌才脱身。'),c:'bad',fx:{happy:-3}}]},
  {l:T('Burn it','烧了'),out:[{w:2,t:T('Ash, and nothing more.','一把灰，再没别的。'),c:'muted'},{w:1,t:T('You remember every word of it anyway.','可那上面的字，你一个都没忘。'),c:'muted',fx:{smarts:1}}]}]});

/* ================= rest 休养 ================= */
AF({id:'af_rs_soup',age:[8,99],cd:8,tags:['af_rest'],ctx:afN({occ:18,age:65,sex:'f'}),
 text:c=>T(`Old ${c.npc.en} from next door brings soup and settles in for a long talk.`,`隔壁的${c.npc.zh}婆婆端来一碗汤，拉了凳子坐下，看样子要聊很久。`),
 opts:[{l:T('Let her talk','陪她聊'),out:[{w:s=>.8+s.t.heart*.2,t:T('The soup is good and the gossip is better. You learn who owes whom in this whole town.','汤好喝，闲话更好听。全镇谁欠谁的，你都知道了。'),c:'good',fx:{happy:3,heal:3,smarts:1,meet:'acq',bond:65}},{w:1,t:T('By evening the whole street knows exactly what is wrong with you, and some things that are not.','到了晚上，整条街都知道你哪里不舒服，还附带了几样你根本没有的毛病。'),c:'muted',fx:{fame:-1,heal:2}}]},
  {l:T('Say you need to sleep','说你要睡了'),out:[{w:1,t:T('She leaves the soup. You sleep fourteen hours.','她留下汤走了。你一觉睡了七个时辰。'),c:'good',fx:{heal:5}},{w:1,t:T('She leaves, a little hurt, and takes the soup.','她有点不高兴，端着汤走了。'),c:'muted',fx:{happy:-1}}]}]});
AF({id:'af_rs_dream',age:[8,99],cd:10,tags:['af_rest'],
 text:()=>T('After days of sleep you have a dream so clear it follows you around the house: a white crane on a burning roof.','睡了好几天，你做了个清清楚楚的梦，醒来满屋子都是它：一只白鹤站在着火的屋顶上。'),
 opts:[{l:T('Have it read at the temple (5 taels)','到庙里解梦（五两）'),cost:5,out:[{w:s=>.5+s.t.luck*.2,t:T('"A great fortune, coming the hard way." You feel better than you have in months.','"大吉，只是来得不容易。"你好几个月没这么舒坦了。'),c:'good',fx:{happy:5}},{w:1,t:T('The monk frowns and will not say. That is worse than any answer.','和尚皱着眉不肯说。这比什么答案都吓人。'),c:'bad',fx:{happy:-3,f:s=>addCond(s,'shaken',1)}}]},
  {l:T('Shake it off','别管它'),out:[{w:2,t:T('By lunch it has faded.','到中午就淡了。'),c:'muted'},{w:1,t:T('You paint the crane, badly, and feel strangely lighter.','你把那只鹤画了下来，画得很糟，心里却莫名轻松了。'),c:'good',fx:{happy:2}}]}]});

/* ================= jobs 找差事 ================= */
AF({id:'af_jb_shady',age:[14,70],cd:10,tags:['af_jobs'],ctx:afN({occ:5,age:40}),
 text:c=>T(`As you leave the hiring board, ${c.npc.en} falls into step. "Carry one box across the river tonight. Thirty taels. Do not open it."`,`你刚离开招工告示，${c.npc.zh}就跟了上来。"今晚帮我把一只箱子送过河，三十两。别打开。"`),
 opts:[{l:T('Take the job','接了'),out:[{w:s=>.6+s.t.luck*.15,t:T('Nobody stops you. You never learn what was inside, and decide not to wonder.','一路没人拦。箱子里是什么，你始终不知道，也决定不去想。'),c:'muted',fx:{money:30,align:-2}},{w:1,t:T('A patrol stops you at the ferry. You drop the box in the river and run.','渡口有巡丁盘查。你把箱子扔进河里，拔腿就跑。'),c:'bad',fx:{wanted:1,align:-2}}]},
  {l:T('Say no','不干'),out:[{w:1,t:T('He shrugs and finds someone hungrier.','他耸耸肩，去找更缺钱的人了。'),c:'muted',fx:{align:1}},{w:s=>s.smarts/60,t:T('You note his face. Two days later the constables pay you a few taels for it.','你记下了他的长相。两天后，捕快为这个情报给了你几两银子。'),c:'good',fx:{money:[5,15],align:1}}]}]});
AF({id:'af_jb_line',age:[12,70],cd:8,tags:['af_jobs'],ctx:afN({occ:19,age:60}),
 text:c=>T(`Twenty people want the last place on a dock crew. Two of them start shoving an old man, ${c.npc.en}, out of the line.`,`码头只剩一个空缺，二十个人抢。两个壮汉在推搡一个叫${c.npc.zh}的老头，要把他挤出队伍。`),
 opts:[{l:T('Step in','出手拦'),out:[{w:s=>.4+power(s)/40,t:T('One look and they back off. The foreman hires you both on the spot.','你一瞪眼，他俩就退了。工头当场把你和老头都收了。'),c:'good',fx:{money:10,align:2,fame:1,meet:'acq',bond:65}},{w:1,t:T('It turns into a brawl and the foreman sends all of you away.','打成了一团，工头把所有人都轰走了。'),c:'bad',fx:{hurt:[2,6],cause:T('a brawl in a hiring line','抢工打架'),align:1}}]},
  {l:T('Give him your place','把位置让给他'),out:[{w:s=>.5+s.align/40,t:T('The foreman saw. "I have another job for someone like you."','工头都看在眼里："我还有份活，正缺你这样的人。"'),c:'good',fx:{money:[8,20],align:2}},{w:1,t:T('He gets the job; you get nothing but a warm feeling.','他得了活，你只落了个心里暖和。'),c:'muted',fx:{align:2,happy:1}}]}]});

/* ================= workhard 卖力干活 ================= */
AF({id:'af_wk_boss',age:[12,80],cd:8,tags:['af_workhard'],when:s=>!!s.job,
 text:(c,s)=>T(`Your employer stops by your station. "You have been working like two people. As ${afJob(s).en}, what do you want?"`,`东家走到你跟前："你一个人干了两个人的活。你这个${afJob(s).zh}，想要什么？"`),
 opts:[{l:T('Ask for a raise','要加工钱'),out:[{w:s=>.4+s.smarts/50+s.looks/80,t:T('A small bonus, and a smaller smile. Still, money.','一笔小赏钱，外加一个更小的笑脸。钱就是钱。'),c:'good',fx:{money:[15,40]}},{w:1,t:T('"I meant a kind word, not silver." He walks off; your standing drops a notch.','"我说的是夸你两句，不是给钱。"他走开了，你在他心里掉了一档。'),c:'bad',fx:{f:s=>afPerf(s,-8)}}]},
  {l:T('Ask for more responsibility','要更重的担子'),out:[{w:s=>.6+s.smarts/50,t:T('He gives it to you, and watches what you do with it.','他把担子交给了你，看你怎么挑。'),c:'good',fx:{f:s=>afPerf(s,12)}},{w:1,t:T('More responsibility turns out to mean more hours.','更重的担子，说白了就是更长的工时。'),c:'muted',fx:{happy:-3,f:s=>afPerf(s,6)}}]},
  {l:T('Say it is only your duty','说这是本分'),out:[{w:2,t:T('He likes that very much.','他很中意这句话。'),c:'good',fx:{f:s=>afPerf(s,8)}},{w:1,t:T('He takes you at your word and gives you nothing.','他当了真，什么也没给。'),c:'muted'}]}]});
AF({id:'af_wk_credit',age:[12,80],cd:8,tags:['af_workhard'],when:s=>!!s.job,ctx:afN({}),
 text:c=>T(`You hear ${c.npc.en}, a co-worker, telling the boss that the extra work this month was ${c.npc.his} idea and ${c.npc.his} sweat.`,`你听见同事${c.npc.zh}正跟东家说，这个月多干的活全是${c.npc.ta}出的主意、流的汗。`),
 opts:[{l:T('Confront them in front of the boss','当着东家的面对质'),out:[{w:s=>.4+s.smarts/40+s.fame/50,t:T('Your details are better than theirs. The boss believes you.','你说得比对方细，东家信了你。'),c:'good',fx:{f:s=>afPerf(s,10)}},{w:1,t:T('It turns ugly. The boss is annoyed with you both, and you have an enemy.','闹得很难看。东家两个都烦，你还多了个仇人。'),c:'bad',fx:{enemy:1,f:s=>afPerf(s,-5)}}]},
  {l:T('Let it go','算了'),out:[{w:s=>s.t.heart*.25,t:T('The boss is not a fool. Next week he gives you the job that matters.','东家又不傻。下个礼拜，要紧的差事交给了你。'),c:'good',fx:{f:s=>afPerf(s,6)}},{w:1,t:T('It works for them. You stew about it for weeks.','对方得逞了。你憋了好几个礼拜的气。'),c:'muted',fx:{happy:-3}}]},
  {l:T('Quietly make them look bad','暗中给对方下绊'),out:[{w:s=>.3+s.t.wit*.15,t:T('A misplaced ledger, a missed delivery. The boss stops trusting them.','一本放错的账，一趟误了的货。东家不再信对方了。'),c:'muted',fx:{align:-4,f:s=>afPerf(s,6)}},{w:1,t:T('They catch you at it. Now it is you who looks bad.','被对方逮个正着。这下丢脸的成了你。'),c:'bad',fx:{align:-3,enemy:1,f:s=>afPerf(s,-10)}}]}]});
AF({id:'af_wk_accident',age:[12,80],cd:10,tags:['af_workhard'],when:s=>!!s.job,ctx:afN({age:22}),
 text:c=>T(`Tired at the end of a long day, you hear a rope creak overhead. A load is about to come down right where ${c.npc.en} is standing.`,`累了一整天，收工时你听见头顶的绳子嘎吱作响。一担重货眼看就要砸在${c.npc.zh}站的地方。`),
 opts:[{l:T('Shove them clear','把人推开'),out:[{w:s=>.6+power(s)/50+s.t.luck*.1,t:T('You both hit the ground and the load smashes where they stood.','你们俩扑倒在地，重货砸在对方刚才站的位置。'),c:'good',fx:{fame:1,align:2,f:s=>afPerf(s,5)},next:'af_wk_accident2',keep:1},{w:1,t:T('You get them clear. The load catches your arm on the way down.','你把人推开了，自己的胳膊却被砸了个正着。'),c:'bad',fx:{hurt:[6,14],cause:T('a falling load','重货砸伤'),align:3,f:s=>addCond(s,'fracture',1)}}]},
  {l:T('Shout a warning','大喊一声'),out:[{w:s=>.5+s.t.luck*.15,t:T('They jump at your shout. A near thing.','对方听见喊声一跳，险险躲过。'),c:'good',fx:{align:1}},{w:1,t:T('Too late. They will live, but they will not work for months.','晚了。人没事，可好几个月干不了活。'),c:'bad',fx:{happy:-4}}]}]});
AFS({id:'af_wk_accident2',
 text:c=>T(`A week later ${c.npc.en} invites you home. ${c.npc.His} whole family has cooked for two days.`,`过了一个礼拜，${c.npc.zh}请你到家里吃饭。${c.npc.ta}一家人为这顿饭忙了两天。`),
 opts:[{l:T('Go','去'),out:[{w:2,t:T('You eat until you hurt. You have a friend for life.','你吃得撑到肚子疼。从此多了个一辈子的朋友。'),c:'good',fx:{meet:'friend',bond:80,happy:4}},{w:s=>s.age>=16&&!spouseOf(s)?s.looks/50:0,t:c=>T(`Somewhere between the fish and the dumplings, you and ${c.npc.en} stop looking at the food.`,`吃到鱼和饺子之间的什么时候，你和${c.npc.zh}都不再看菜了。`),c:'good',fx:{meet:'lover',bond:70,happy:5}}]},
  {l:T('Politely decline','婉言谢绝'),out:[{w:1,t:T('They send the food to your door anyway.','他们还是把饭菜送到了你门口。'),c:'good',fx:{happy:2}},{w:1,t:T('They are a little hurt, but still grateful.','对方有点失落，可仍然感激。'),c:'muted',fx:{align:1}}]}]});

/* ================= exam 科举 ================= */
AF({id:'af_ex_leak',age:[15,80],cd:12,tags:['af_exam'],ctx:afN({occ:1,age:28}),
 text:c=>T(`Outside the examination hall, a candidate named ${c.npc.en} is shouting that the questions were sold in advance, and asks you to swear to it with him.`,`考场外头，一个叫${c.npc.zh}的考生正大喊题目提前被人卖了，拉着你要一起作证。`),
 opts:[{l:T('Stand with him','跟他一起作证'),out:[{w:s=>.4+s.fame/40+Math.max(0,s.align)/40,t:T('The prefect opens an inquiry. Two examiners lose their posts, and the scholars remember your name.','知府立案查办，两名考官丢了官。读书人都记住了你的名字。'),c:'good',fx:{fame:3,align:3,meet:'friend',bond:65}},{w:1,t:T('The inquiry fizzles. Someone important now knows exactly who you are.','案子不了了之。某位大人物倒是把你记得清清楚楚。'),c:'bad',fx:{enemy:1,align:2}}]},
  {l:T('Keep out of it','不掺和'),out:[{w:1,t:T('He looks at you with contempt and moves on to the next candidate.','他鄙夷地看了你一眼，去拉下一个人。'),c:'muted',fx:{align:-1}},{w:1,t:T('Probably wise. He is arrested that night for disturbing the peace.','大概是明智的。当晚他就以扰乱考场的罪名被抓了。'),c:'muted',fx:{smarts:1}}]}]});
AF({id:'af_ex_broke',age:[15,80],cd:10,tags:['af_exam'],ctx:afN({occ:1,age:24}),
 text:c=>T(`Waiting for results at the inn, you meet ${c.npc.en}, a candidate who walked three hundred li and cannot pay for another night.`,`在客栈等放榜，你遇见考生${c.npc.zh}。${c.npc.ta}走了三百里路来赶考，已经付不起下一晚的房钱。`),
 opts:[{l:T('Pay for their room (15 taels)','替对方付房钱（十五两）'),cost:15,out:[{w:s=>.6+s.t.luck*.15,t:T('They pass, and never forget it. Years later a letter arrives with silver in it.','对方中了，一直记着这份情。多年后寄来一封信，里头夹着银子。'),c:'good',fx:{meet:'friend',bond:75,money:[20,50],align:2}},{w:1,t:T('They fail and go home. They thank you with a poem, which is quite good.','对方落榜回乡了，临走送了你一首诗，写得还真不错。'),c:'muted',fx:{align:2,smarts:1,meet:'acq',bond:60}}]},
  {l:T('Share a jug and some poems','请喝一壶，对几首诗'),out:[{w:s=>.5+s.smarts/40,t:T('You match each other line for line all night.','你们一句接一句，对到天亮。'),c:'good',fx:{smarts:2,happy:3,meet:'acq',bond:60}},{w:1,t:T('A pleasant evening, and a terrible morning.','晚上很愉快，早上很难受。'),c:'muted',fx:{happy:1,hurt:[1,3],cause:T('a hangover','宿醉')}}]}]});

/* ================= sightsee 游山玩水 ================= */
AF({id:'af_ss_lost',age:[12,90],cd:8,tags:['af_sightsee'],
 text:()=>T('The mountain path forks, forks again, and then stops being a path. You are lost, and the light is going.','山路分了岔，又分了岔，后来干脆没了路。你迷路了，天也快黑了。'),
 opts:[{l:T('Follow the stream down','顺着溪水往下走'),out:[{w:s=>.5+s.t.wit*.2,t:T('The stream leads to a hermit’s hut. The old woman feeds you and shows you a way of breathing on the climb.','溪水把你领到一间草庐。里面的老婆婆给你饭吃，还教了你一个登山时的吐纳法子。'),c:'good',fx:{qi:2,happy:3}},{w:1,t:T('A cold night on wet rocks. You find the road at dawn with a fever.','你在湿石头上冻了一夜，天亮找到路时已经发起烧来。'),c:'bad',fx:{ill:'cold',happy:-2}}]},
  {l:T('Climb for a view','爬到高处看路'),out:[{w:s=>.5+s.t.root*.2,t:T('From the top you see the whole valley in sunset, and the road home.','从山顶望下去，整个山谷都在夕阳里，回去的路也看见了。'),c:'good',fx:{happy:6}},{w:1,t:T('A rock turns under your foot. You get down, but your ankle is never quite the same.','脚下一块石头一滚。你是下来了，可脚踝从此落下了毛病。'),c:'bad',fx:{hurt:[4,10],cause:T('a fall in the mountains','山中失足'),f:s=>addCond(s,'wound',1)}}]}]});
AF({id:'af_ss_boat',age:[14,90],cd:8,tags:['af_sightsee'],ctx:afN({age:24}),
 text:c=>T(`On the ferry home you share a bench with ${c.npc.en}, ${c.npc.desc.en.toLowerCase()}, who is going your way and seems glad of the company.`,`回程的渡船上，你跟${c.npc.zh}坐同一条板凳。对方是个${c.npc.desc.zh}，正好同路，似乎很乐意有个伴。`),
 opts:[{l:T('Travel together','结伴同行'),out:[{w:s=>.5+s.looks/50,t:c=>T(`Three days on the road with ${c.npc.en} go by too fast.`,`跟${c.npc.zh}同行的三天，过得太快了。`),c:'good',fx:{meet:'friend',bond:70,happy:4}},{w:s=>s.age>=16&&!spouseOf(s)?s.looks/70:0,t:T('By the last stop, neither of you wants to say goodbye.','到了最后一站，谁都不想说再见。'),c:'good',fx:{meet:'lover',bond:70,happy:6}},{w:s=>Math.max(.3,(8-s.t.luck)*.15),t:T('You wake on the second morning to find them gone, and your purse with them.','第二天早上醒来，人不见了，你的钱袋也不见了。'),c:'bad',fx:{money:[-40,-10]}}]},
  {l:T('Keep to yourself','自己走'),out:[{w:1,t:T('A quiet trip. You watch the river and think about nothing.','一路清静。你看着江水，什么也不想。'),c:'muted',fx:{happy:2}},{w:1,t:T('You wonder afterwards what you might have heard.','事后你想，要是聊了，不知会听到些什么。'),c:'muted'}]}]});
AF({id:'af_ss_ruin',age:[12,90],cd:10,tags:['af_sightsee'],
 text:()=>T('Off the path, half swallowed by bamboo, you find a shrine nobody has swept in a hundred years.','离开山道不远，半掩在竹林里，有一座百年没人打扫过的破庙。'),
 opts:[{l:T('Search inside','进去找找'),out:[{w:s=>.5+s.t.luck*.15,t:T('Under the altar, a rusted box of old coins.','供桌底下有个锈铁盒，里面是一把古钱。'),c:'gold',fx:{money:[20,70]}},{w:s=>.4+s.smarts/60,t:T('On the back wall, under the moss, someone has carved figures in fighting stances.','后墙的青苔底下，有人刻了一排练武的人形。'),c:'good',next:'af_ss_ruin2',keep:1},{w:1,t:T('A snake in the rafters drops onto your neck.','房梁上掉下一条蛇，正落在你脖子上。'),c:'bad',fx:{hurt:[3,8],cause:T('a snake bite','蛇咬'),f:s=>addCond(s,'poison',1)}}]},
  {l:T('Light incense and leave','上炷香就走'),out:[{w:2,t:T('It feels right. You walk home lighter.','心里踏实。你一身轻松地回了家。'),c:'good',fx:{happy:3,align:1}},{w:1,t:T('The incense will not stay lit. You leave quickly.','香怎么也点不着。你赶紧走了。'),c:'muted',fx:{happy:-1}}]}]});
AFS({id:'af_ss_ruin2',
 text:()=>T('The carved figures go round the wall in order. It is a whole sword form, cut in stone by someone who did not want it lost.','石刻人形沿着墙一个接一个排下去，是一整套剑法。刻的人显然不想它失传。'),
 opts:[{l:T('Study it until dark','一直看到天黑'),out:[{w:s=>.5+s.t.wit*.2,t:T('Your hand moves with the stone. You come away with something nobody else alive knows.','你的手跟着石刻比划，带走了一样世上再没人会的东西。'),c:'gold',fx:{skill:3,smarts:1}},{w:1,t:T('You force the moves before you understand them, and your qi knots.','你没看懂就硬练，内力打了结。'),c:'bad',fx:{skill:1,f:s=>addCond(s,'inner',1)}}]},
  {l:T('Copy it and go','拓下来就走'),out:[{w:s=>.5+s.smarts/50,t:T('Your rubbing is clear. You will work through it at home.','拓片很清楚，回家慢慢琢磨。'),c:'good',fx:{skill:2}},{w:1,t:T('Rain gets into your pack on the way home. Half of it is a grey smear.','回去路上下雨，包里进了水，拓片糊了一半。'),c:'muted',fx:{skill:1,happy:-1}}]}]});

/* ================= fortune 求签 ================= */
AF({id:'af_ft_dissolve',age:[8,99],cd:10,tags:['af_fortune'],ctx:afN({occ:24,age:60}),
 text:c=>T(`A fortune-teller, ${c.npc.en}, catches up with you at the temple gate. "That stick you drew. I can dissolve its bad luck, for thirty taels."`,`算命先生${c.npc.zh}在庙门口追上你："你抽的那支签，我能替你化解，三十两。"`),
 opts:[{l:T('Pay (30 taels)','给钱（三十两）'),cost:30,out:[{w:s=>.5+s.t.luck*.15,t:T('He burns paper and mutters. You feel, irrationally, much better.','他烧了几张黄纸，念念有词。你莫名其妙地觉得好多了。'),c:'good',fx:{happy:5}},{w:1,t:T('An hour later you see him in the teahouse, laughing and counting coins.','一个时辰后，你在茶馆看见他，正笑着数钱。'),c:'bad',fx:{smarts:1,happy:-2}}]},
  {l:T('Laugh at him','笑他'),out:[{w:s=>.5+s.t.heart*.2,t:T('He laughs too. "You will be fine. People who laugh usually are."','他也笑了："你没事的。会笑的人通常都没事。"'),c:'good',fx:{happy:2}},{w:1,t:T('He shouts a curse after you. It sticks in your head for days.','他在你身后骂了句咒语。那句话在你脑子里转了好几天。'),c:'bad',fx:{happy:-3}}]}]});
AF({id:'af_ft_same',age:[12,99],cd:10,tags:['af_fortune'],ctx:afN({age:30}),
 text:c=>T(`${c.npc.en} drew the very same stick right after you, and holds it up with a rueful smile.`,`${c.npc.zh}紧跟着你，也抽到了同一支签，举着签无奈地冲你笑。`),
 opts:[{l:T('Compare notes','聊聊'),out:[{w:s=>.6+s.looks/60+s.t.heart*.1,t:T('You talk until the monks start sweeping around you.','你们一直聊到和尚开始在你们脚边扫地。'),c:'good',fx:{meet:'friend',bond:65,happy:3}},{w:1,t:T('Their troubles are much worse than yours. Somehow that helps.','对方的烦心事比你大多了。不知怎么，你反倒宽心了。'),c:'muted',fx:{happy:1,align:1}}]},
  {l:T('Nod and leave','点头离开'),out:[{w:1,t:T('You never see them again, and wonder about them sometimes.','你再没见过对方，偶尔还会想起。'),c:'muted'},{w:1,t:T('You see them again next month, drawing the same stick.','下个月你又碰见对方，还是抽到那支签。'),c:'muted',fx:{happy:1}}]}]});

/* ================= matchmaker 找媒婆 ================= */
AF({id:'af_mm_rival',age:[16,70],cd:10,tags:['af_matchmaker'],ctx:s=>{const c=afN({age:s.age+rint(-3,3)})(s);c.lv=PW(.9,2)(s);return c},
 text:c=>T(`${c.npc.en} stops you outside the matchmaker’s house. "I was courting that family first. Back off."`,`${c.npc.zh}在媒婆家门口拦住你："那户人家是我先提的亲。你让开。"`),
 opts:[{l:T('Talk it out','好好谈'),out:[{w:s=>.5+s.smarts/40,t:T('It turns out you were matched with different daughters. You end up laughing about it over wine.','原来你们说的是那家的两个不同女儿。最后你们一起喝酒笑了一场。'),c:'good',fx:{meet:'acq',bond:60,happy:2}},{w:1,t:T('They will not listen. They leave swearing at you.','对方听不进去，骂骂咧咧地走了。'),c:'muted',fx:{meet:'rival',bond:25}}]},
  {l:T('Settle it with fists','拳头上见分晓'),fight:FG((s,c)=>c.lv,'light',T('A matchmaking quarrel','争亲'),T('a matchmaking quarrel','争亲斗殴')),
   win:[{w:1,t:T('You win. The family hears about it and is not impressed.','你赢了。那户人家听说后，可一点都不欣赏。'),c:'muted',fx:{fame:1,happy:-1}},{w:1,t:T('You win, and they slink off. The matchmaker raises her fee.','你赢了，对方灰溜溜地走了。媒婆趁机涨了价。'),c:'muted',fx:{money:-10}}],
   lose:[{t:T('You lose, with a black eye to show for it.','你输了，还落了个乌眼青。'),c:'bad',fx:{looks:-1,hurt:[2,6],cause:T('a matchmaking quarrel','争亲斗殴')}}]},
  {l:T('Step aside','让给对方'),out:[{w:1,t:T('They are so surprised they thank you.','对方吃了一惊，居然向你道谢。'),c:'muted',fx:{align:1}},{w:1,t:T('The matchmaker sighs and opens her book again.','媒婆叹口气，又翻开了她的本子。'),c:'muted'}]}]});
AF({id:'af_mm_gossip',age:[16,70],cd:10,tags:['af_matchmaker'],
 text:()=>T('The matchmaker has been talking about you all over town, with improvements.','媒婆满城说你的事，还添油加醋。'),
 opts:[{l:T('Pay her to stop (10 taels)','给她十两，让她闭嘴'),cost:10,out:[{w:2,t:T('She takes it and talks about someone else.','她收了钱，改说别人去了。'),c:'muted'},{w:1,t:T('She takes it and adds that you paid her to stop.','她收了钱，还添了一句：这人给钱让我别说。'),c:'bad',fx:{fame:-1}}]},
  {l:T('Let her talk','由她说'),out:[{w:s=>.3+s.looks/40,t:T('Her version of you is rather handsome. People start smiling at you in the street.','她嘴里的你相当出挑。街上开始有人冲你笑。'),c:'good',fx:{happy:3,fame:1}},{w:1,t:T('Her version of you is a fool. Children giggle when you pass.','她嘴里的你是个呆子。你一路过，孩子们就偷笑。'),c:'bad',fx:{happy:-3}}]}]});

/* ================= dice 掷骰子 ================= */
AF({id:'af_dc_cheat',age:[14,90],cd:8,tags:['af_dice'],ctx:s=>{const c=afN({occ:28,age:35})(s);c.lv=PW(.9,3)(s);return c},
 text:c=>T(`You have won five throws in a row. ${c.npc.en}, a big man who has lost all five, grabs your wrist. "Show me your sleeves."`,`你连赢了五把。一连输了五把的大汉${c.npc.zh}一把攥住你的手腕："把袖子亮出来。"`),
 opts:[{l:T('Open your hands','摊开双手'),out:[{w:s=>.5+s.t.luck*.15+s.fame/40,t:T('Nothing up your sleeves. The room laughs at him, and he buys you a drink to make it stop.','袖子里什么也没有。满屋人都笑他，他只好请你喝一杯堵大家的嘴。'),c:'good',fx:{happy:2,fame:1}},{w:1,t:T('He does not care what your sleeves show. He and his friends take your winnings anyway.','他才不管你袖子里有什么。他和同伙照样把你赢的钱抢走了。'),c:'bad',fx:{money:[-30,-10],hurt:[2,6],cause:T('a gambling brawl','赌场斗殴')}}]},
  {l:T('Break his grip','甩开他'),fight:FG((s,c)=>c.lv,'light',T('A sore loser','输急了的赌徒'),T('a gambling brawl','赌场斗殴')),
   win:[{w:1,t:T('He sits down hard. Nobody else questions your luck tonight.','他一屁股坐在地上。今晚再没人质疑你的手气。'),c:'good',fx:{fame:1}},{w:1,t:T('You win the fight, and the house bans you for the trouble.','架是打赢了，赌坊却嫌你闹事，不让你再来。'),c:'muted',fx:{fame:1,happy:-1}}],
   lose:[{t:T('You end up on the floor and your winnings end up in his pocket.','你躺在地上，赢的钱进了他的口袋。'),c:'bad',fx:{money:[-30,-10],hurt:[3,8],cause:T('a gambling brawl','赌场斗殴')}}]},
  {l:T('Leave your winnings and go','钱留下，人走'),out:[{w:1,t:T('A clean exit, and lighter pockets.','走得干干净净，口袋也轻了。'),c:'muted',fx:{money:[-20,-5]}},{w:1,t:T('He is so surprised he lets you keep half.','他愣住了，竟让你拿走一半。'),c:'muted',fx:{money:[-10,-3]}}]}]});
AF({id:'af_dc_loan',age:[16,90],cd:10,tags:['af_dice','af_cricket','af_betfight'],ctx:afN({occ:26,age:45}),
 text:c=>T(`A soft-voiced man, ${c.npc.en}, sits beside you. "Your luck is about to turn. Fifty taels on credit, to ride it? Small interest."`,`一个说话轻声细语的人${c.npc.zh}在你身边坐下："你的手气要转了。先借你五十两乘势而上，利息不多。"`),
 opts:[{l:T('Borrow fifty','借五十两'),out:[{w:s=>.3+s.t.luck*.12,t:T('Your luck does turn. You pay him back and walk out with a fat purse.','手气果然转了。你还清了钱，揣着鼓鼓的钱袋走了出去。'),c:'gold',fx:{money:[40,120]}},{w:1,t:T('The fifty is gone in an hour. He smiles and says he will come by.','五十两一个时辰就没了。他笑着说，改天上门拜访。'),c:'bad',next:'af_dc_loan2',keep:1}]},
  {l:T('No thank you','不必了'),out:[{w:2,t:T('He smiles and moves on to the next seat.','他笑了笑，挪到下一个座位去了。'),c:'muted'},{w:s=>s.smarts/60,t:T('You watch who takes his offer. By the end of the night, three people owe him their houses.','你看着谁接了他的钱。到散场时，已经有三个人把房子押给了他。'),c:'muted',fx:{smarts:1}}]}]});
AFS({id:'af_dc_loan2',
 text:c=>T(`Three weeks later, ${c.npc.en} comes by with two large friends. With interest it is now eighty taels.`,`三个礼拜后，${c.npc.zh}带着两个壮汉上门了。连本带利，如今是八十两。`),
 opts:[{l:T('Pay (80 taels)','还钱（八十两）'),cost:80,out:[{w:2,t:T('Paid. You will never forget the number eighty.','还清了。"八十"这个数，你这辈子忘不了。'),c:'muted',fx:{smarts:1}},{w:1,t:T('Paid, and he hands you his card in case you need him again.','还清了。他还递给你一张帖子，说下回有需要再找他。'),c:'muted'}]},
  {l:T('Fight the collectors','跟打手动手'),fight:FG(PW(.95,4),'injury',T('The loan shark’s men','放债人的打手'),T('debt collectors','讨债打手'),()=>T('the collectors','讨债打手')),
   win:[{t:T('They limp away. He will not lend to you again, and he will not forget you.','打手们一瘸一拐地走了。他不会再借钱给你，也不会忘了你。'),c:'muted',fx:{enemy:1,fame:1}}],
   lose:[{w:1,t:T('They take what you have, and a little more from your hand.','他们拿走了你身上所有的钱，还在你手上留了点记号。'),c:'bad',fx:{money:-50,hurt:[4,10],cause:T('debt collectors','讨债打手'),f:s=>addCond(s,'fracture',1)}},{w:1,t:T('They beat you, take forty and call it settled.','他们揍了你一顿，拿走四十两，说这笔账就算了了。'),c:'bad',fx:{money:-40,hurt:[3,8],cause:T('debt collectors','讨债打手')}}]},
  {l:T('Talk your way into more time','求宽限'),out:[{w:s=>.3+s.smarts/50+s.fame/50,t:T('He agrees to half now. You find twenty and he goes away, for now.','他同意先还一半。你凑了二十两，他暂时走了。'),c:'muted',fx:{money:-20}},{w:1,t:T('He is not a patient man. They wreck your room on the way out.','他可不是个有耐心的人。打手们临走把你的屋子砸了个稀烂。'),c:'bad',fx:{money:-30,happy:-4}}]}]});
AF({id:'af_dc_loaded',age:[14,90],cd:10,tags:['af_dice'],
 text:()=>T('Watching the dealer, you are sure of it: one of the dice rolls a fraction too slowly. They are loaded.','你盯着庄家看了半天，敢肯定：有一颗骰子滚得慢了那么一丝。骰子灌了铅。'),
 opts:[{l:T('Expose it','当场揭穿'),out:[{w:s=>.4+s.fame/40+power(s)/80,t:T('You crack the die on the table and lead shows in the break. The room roars; the house pays everyone back.','你把骰子往桌上一磕，裂口里露出铅来。满屋哗然，赌坊只好把钱都退了。'),c:'good',fx:{fame:2,align:2,money:[10,30]}},{w:1,t:T('The house’s men drag you out the back before you can finish the sentence.','你话没说完，就被赌坊的打手从后门拖了出去。'),c:'bad',fx:{hurt:[4,10],cause:T('a casino’s bouncers','赌坊打手'),f:s=>addCond(s,'wound',1)}}]},
  {l:T('Quietly ask for a share','私下要分成'),out:[{w:s=>.3+power(s)/60+s.smarts/80,t:T('The owner looks at you a long time, then slides a purse across.','老板盯着你看了很久，推过来一个钱袋。'),c:'muted',fx:{money:[30,60],align:-3}},{w:1,t:T('The owner smiles and says he will think about it. That night you are jumped in an alley.','老板笑着说考虑考虑。当晚你在巷子里被人堵了。'),c:'bad',fx:{hurt:[4,10],cause:T('an ambush in an alley','巷中遇袭'),enemy:1}}]},
  {l:T('Just bet against the dealer','跟着庄家反着押'),out:[{w:s=>.4+s.t.wit*.15,t:T('Knowing the trick, you win steadily and leave before anyone notices.','看穿了门道，你稳稳地赢，没等人察觉就走了。'),c:'good',fx:{money:[15,45]}},{w:1,t:T('The dealer switches dice. You lose the lot.','庄家换了骰子。你输了个精光。'),c:'bad',fx:{money:[-30,-10]}}]}]});

/* ================= cricket 斗蛐蛐 ================= */
AF({id:'af_ck_buyer',age:[10,90],cd:8,tags:['af_cricket'],ctx:afN({occ:11,age:20}),
 text:c=>T(`A young rich man, ${c.npc.en}, wants to buy the cricket that just won. He opens at ten taels.`,`富家公子${c.npc.zh}想买刚才赢了的那只蛐蛐，开口十两。`),
 opts:[{l:T('Haggle','讨价还价'),out:[{w:s=>.5+s.smarts/40,t:T('He goes to forty before he even notices. The cricket chirps goodbye.','不知不觉他就加到了四十两。蛐蛐叫了一声，算是告别。'),c:'good',fx:{money:40}},{w:1,t:T('You push too hard. He walks off and buys another.','你要得太狠，他扭头买别人的去了。'),c:'muted'}]},
  {l:T('Keep your champion','留着自己的大将军'),out:[{w:s=>.5+s.t.luck*.12,t:T('It wins again next week, and the week after.','下个礼拜它又赢了，再下个礼拜还赢。'),c:'good',fx:{money:[10,30],happy:3}},{w:1,t:T('It dies in the cold snap. You bury it in a matchbox.','一场倒春寒，它死了。你把它埋在一个小盒子里。'),c:'muted',fx:{happy:-3}}]}]});
AF({id:'af_ck_boy',age:[10,90],cd:8,tags:['af_cricket'],ctx:afN({occ:21,age:10}),
 text:c=>T(`A barefoot boy, ${c.npc.en}, shows you a cricket in a gourd. "I caught him at the graveyard. He is a killer. Five taels?"`,`光脚的小男孩${c.npc.zh}捧着一个葫芦给你看："我在坟地里抓的，是个狠角色。五两？"`),
 opts:[{l:T('Buy it (5 taels)','买下（五两）'),cost:5,out:[{w:s=>.4+s.t.luck*.15,t:T('He is a killer. You win sixty taels with him before winter.','还真是狠角色。入冬前它给你赢了六十两。'),c:'gold',fx:{money:60,happy:3}},{w:1,t:T('It is a perfectly ordinary cricket, and it eats your rice.','就是只普普通通的蛐蛐，还吃你的米。'),c:'muted',fx:{happy:1}}]},
  {l:T('Teach him how to judge one','教他怎么相蛐蛐'),out:[{w:s=>.5+s.t.heart*.2,t:T('He listens with his whole face. He will be back with a better one.','他听得聚精会神。下回会捉只更好的来。'),c:'good',fx:{align:1,happy:2,meet:'acq',bond:60}},{w:1,t:T('He gets bored halfway and sells it to someone else.','他听到一半不耐烦了，转手卖给了别人。'),c:'muted'}]}]});

/* ================= betfight 押擂台 ================= */
AF({id:'af_bf_fixed',age:[14,90],cd:10,tags:['af_betfight'],ctx:afN({occ:8,age:30}),
 text:c=>T(`Behind the stand you overhear the bookmaker paying a fighter to lose next week. The other fighter, ${c.npc.en}, has no idea.`,`你在看台后面听见庄家正在买通一个拳手，让他下礼拜认输。另一位拳手${c.npc.zh}却毫不知情。`),
 opts:[{l:T('Warn the honest fighter','提醒老实的那位'),out:[{w:s=>.5+Math.max(0,s.align)/30,t:T('They change their training and win anyway. They do not forget who told them.','对方改了练法，照样赢了。也记住了是谁通的风。'),c:'good',fx:{align:3,meet:'friend',bond:65}},{w:1,t:T('Word gets back to the bookmaker. His men know your face now.','话传到了庄家耳朵里。他的人认得你了。'),c:'bad',fx:{align:2,enemy:1}}]},
  {l:T('Bet on the fix','押那场假拳'),out:[{w:s=>.5+s.t.luck*.15,t:T('It goes exactly as arranged. You make a tidy sum and feel slightly dirty.','果然按剧本走。你赚了一笔，心里有点不干净。'),c:'muted',fx:{money:[30,70],align:-3}},{w:1,t:T('The fighter double-crosses the bookmaker. Everyone in on it loses.','那拳手临场反水，知情下注的人全赔了。'),c:'bad',fx:{money:[-40,-15]}}]}]});
AF({id:'af_bf_loser',age:[14,90],cd:8,tags:['af_betfight','af_arena'],ctx:afN({occ:13,age:28,lv:60}),
 text:c=>T(`One of the beaten fighters, ${c.npc.en}, sits alone behind the stage, bleeding through a rag.`,`输了的那位拳手${c.npc.zh}一个人坐在擂台后面，伤口的血渗透了破布。`),
 opts:[{l:T('Buy them medicine (10 taels)','给对方买药（十两）'),cost:10,out:[{w:s=>.6+s.t.heart*.2,t:T('They look at you as if nobody has ever done this. In thanks they teach you the move that nearly won.','对方看你的眼神，好像从没人这样待过他。为了答谢，教了你那招差点赢下来的手法。'),c:'good',fx:{meet:'friend',bond:70,skill:1,align:2}},{w:1,t:T('They take it without a word. Some people do not know how to say thank you.','对方一言不发地收下了。有些人就是不会说谢谢。'),c:'muted',fx:{align:2}}]},
  {l:T('Ask what went wrong','问对方输在哪'),out:[{w:s=>.5+s.smarts/50,t:T('They explain it bitterly and well. You learn more than from the fight itself.','对方说得又苦又透。你学到的比看整场比赛还多。'),c:'good',fx:{skill:1,smarts:1}},{w:1,t:T('"Go away." Fair enough.','"滚。"也是情理之中。'),c:'muted'}]}]});

/* ================= pickpocket 顺手牵羊 ================= */
AF({id:'af_pp_letter',age:[10,90],cd:10,tags:['af_pickpocket'],
 text:()=>T('The purse you lifted holds three coins and a letter: a widow begging her brother for money to bury her son.','你摸来的钱袋里只有三枚铜钱，还有一封信：一个寡妇求她兄弟借钱葬子。'),
 opts:[{l:T('Return it, with something extra','还回去，再添点钱'),out:[{w:s=>.6+s.t.luck*.15,t:T('You drop it at her door with ten taels inside. You sleep well that night.','你把钱袋塞到她门口，里面添了十两。那晚你睡得很好。'),c:'good',fx:{money:-10,align:5,happy:3}},{w:1,t:T('She opens the door as you bend down. She knows exactly who you are, and says nothing.','你弯腰的时候，她正好开门。她一眼就明白了你是谁，却什么都没说。'),c:'muted',fx:{money:-10,align:4}}]},
  {l:T('Keep the coins, toss the letter','留钱扔信'),out:[{w:1,t:T('Three coins. You do not think about the letter.','三枚铜钱。你没去想那封信。'),c:'muted',fx:{align:-2}},{w:s=>s.t.heart*.15,t:T('You do think about the letter. For weeks.','你还是想着那封信，想了好几个礼拜。'),c:'bad',fx:{align:-1,happy:-3}}]}]});
AF({id:'af_pp_gang',age:[10,90],cd:10,tags:['af_pickpocket','af_burgle'],ctx:s=>{const c=afN({occ:7,age:30})(s);c.lv=PW(.9,2)(s);return c},
 text:c=>T(`${c.npc.en}, who runs the thieves on this street, steps out of a doorway. "You work my patch, you pay my cut."`,`管这条街扒手的${c.npc.zh}从门洞里闪出来："在我的地盘上干活，得给我抽成。"`),
 opts:[{l:T('Pay the cut','交份子钱'),out:[{w:2,t:T('Half of today. He says you can work here on his terms.','交了今天的一半。他说往后照他的规矩，你可以在这儿干。'),c:'muted',fx:{money:[-20,-5]}},{w:s=>s.smarts/60,t:T('He likes your manners and takes you in. Now you know the whole street’s secrets.','他喜欢你识相，收了你入伙。这条街的门道你全知道了。'),c:'muted',fx:{money:-10,meet:'acq',bond:55,align:-2}}]},
  {l:T('Refuse','不给'),fight:FG((s,c)=>c.lv,'light',T('A thieves’ boss','扒手头子'),T('a street fight','街头斗殴')),
   win:[{w:1,t:T('He goes down. The street is yours now, for what that is worth.','他倒下了。这条街从此归你，不管这值多少。'),c:'muted',fx:{fame:1,align:-1}},{w:1,t:T('He goes down, and swears revenge from the gutter.','他倒在阴沟里，发誓要报仇。'),c:'muted',fx:{enemy:1}}],
   lose:[{t:T('His boys hold you down while he empties your pockets.','他的手下按住你，他把你兜里的钱全掏了。'),c:'bad',fx:{money:[-30,-10],hurt:[2,6],cause:T('a street fight','街头斗殴')}}]}]});

/* ================= burgle 夜入豪宅 ================= */
AF({id:'af_bg_morning',age:[14,90],cd:8,tags:['af_burgle'],ctx:afN({occ:9,age:40}),
 text:()=>T('By morning the whole town is talking about the burglary, and constables are going door to door.','第二天一早，满城都在说那桩入室盗窃案，捕快挨家挨户地查。'),
 opts:[{l:T('Lie low at home','在家躲着'),out:[{w:s=>.5+s.t.luck*.15,t:T('They knock, look at you, and move on.','他们敲了门，看了你一眼，走了。'),c:'muted'},{w:1,t:T('A constable finds mud from the garden on your boots.','一个捕快在你鞋上发现了那家花园的泥。'),c:'bad',fx:{wanted:1}}]},
  {l:T('Fence the goods fast','赶紧销赃'),out:[{w:s=>.5+s.smarts/40,t:T('The fence pays fair, for a fence.','销赃的给的价，在这一行里也算公道了。'),c:'muted',fx:{money:[20,60]}},{w:1,t:T('The fence pays half and sells your name to the constables.','销赃的只给一半，转头就把你卖给了捕快。'),c:'bad',fx:{money:[10,25],wanted:1}}]},
  {l:T('Leave town for a month (15 taels)','出城躲一个月（十五两）'),cost:15,out:[{w:2,t:T('By the time you come back the trail is cold.','等你回来，风头已经过了。'),c:'muted',fx:{wanted:-1}},{w:1,t:T('Leaving was the most suspicious thing you could have done.','偏偏这时出城，最惹人怀疑。'),c:'bad',fx:{wanted:1}}]}]});
AF({id:'af_bg_ledger',age:[16,90],cd:12,tags:['af_burgle'],ctx:s=>{const c=afN({occ:5,age:50})(s);c.lv=PW(1,4)(s);return c},
 text:c=>T(`Among the loot is a ledger. ${c.npc.en}, the house’s owner, has been bribing half the yamen.`,`赃物里有一本账簿。宅子的主人${c.npc.zh}，买通了半个衙门。`),
 opts:[{l:T('Sell it back to him','卖回给他'),out:[{w:s=>.4+s.smarts/50,t:T('A note under his door, a meeting at a temple, a heavy purse. He never sees your face.','门缝塞张字条，庙里碰个头，一个沉甸甸的钱袋。他始终没见到你的脸。'),c:'gold',fx:{money:[80,160],align:-3}},{w:1,t:T('He brings men to the meeting.','他带着人来赴约了。'),c:'bad',next:'af_bg_ledger2',keep:1}]},
  {l:T('Leave it at the prefect’s gate','丢到知府衙门口'),out:[{w:s=>.5+Math.max(0,s.align)/40,t:T('Three officials fall. Nobody ever learns who the hero was, which is how you like it.','三个官员落马。谁也不知道是哪位侠士干的，你正喜欢这样。'),c:'good',fx:{align:6,fame:1}},{w:1,t:T('The prefect is in the ledger too. It disappears, and the search for the burglar doubles.','原来知府也在账上。账簿不见了，抓贼的人手倒加了一倍。'),c:'bad',fx:{wanted:1,align:2}}]},
  {l:T('Burn it','烧掉'),out:[{w:1,t:T('Safest. You feel you wasted something.','最稳妥。可你总觉得浪费了什么。'),c:'muted'},{w:1,t:T('You burn it, but remember a few names. That could be useful someday.','烧是烧了，几个名字你记下了。说不定哪天用得着。'),c:'muted',fx:{smarts:1}}]}]});
AFS({id:'af_bg_ledger2',
 text:c=>T(`${c.npc.en}’s hired swords fan out around the temple yard.`,`${c.npc.zh}雇来的打手在庙院里散开，围住了你。`),
 opts:[{l:T('Fight your way out','杀出去'),fight:FG((s,c)=>c.lv,'injury',T('An ambush at the temple','庙中埋伏'),T('hired swords','雇来的打手'),()=>T('the hired swords','打手')),
   win:[{t:T('You break through and keep the ledger. He will want it back very badly.','你冲了出去，账簿还在手里。他一定想要回去想疯了。'),c:'muted',fx:{fame:1,enemy:1}}],
   lose:[{t:T('They take the ledger and leave you in the courtyard with a cracked rib.','他们抢回账簿，把你扔在院子里，断了根肋骨。'),c:'bad',fx:{hurt:[6,14],cause:T('hired swords','雇来的打手'),f:s=>addCond(s,'fracture',1)}}]},
  {l:T('Throw it down and run','扔下账簿就跑'),out:[{w:s=>.5+s.t.luck*.15,t:T('While they scramble for it, you are over the wall.','他们抢账簿的工夫，你已经翻过了墙。'),c:'muted'},{w:1,t:T('One of them is faster than you. You get away with a gash.','有个打手比你还快。你逃了，背上挨了一刀。'),c:'bad',fx:{hurt:[4,10],cause:T('hired swords','雇来的打手'),f:s=>addCond(s,'wound',1)}}]}]});

/* ================= arena 打擂台 ================= */
AF({id:'af_ar_brother',age:[14,80],cd:8,tags:['af_arena'],ctx:s=>{const c=afN({occ:13,age:30,sex:'m'})(s);c.lv=PW(1.05,4)(s);return c},
 text:c=>T(`The brother of the man you just beat, ${c.npc.en}, is waiting outside the arena. "Now try someone who is not tired."`,`刚被你打败那人的哥哥${c.npc.zh}在擂台外等着你："来，试试一个没累的。"`),
 opts:[{l:T('Fight him','打'),fight:FG((s,c)=>c.lv,'injury',T('A brother’s grudge','兄弟寻仇'),T('a grudge fight','寻仇')),
   win:[{w:1,t:T('Two in one day. The crowd follows you to the inn.','一天赢了两场。人群一路跟着你到了客栈。'),c:'good',fx:{fame:3}},{w:1,t:T('You win, and he shakes your hand. The family feud ends there.','你赢了，他跟你握了手。两家的过节到此为止。'),c:'good',fx:{fame:1,meet:'acq',bond:55}}],
   lose:[{t:T('He was not tired. You limp home.','他确实不累。你一瘸一拐地回了家。'),c:'bad',fx:{hurt:[4,12],cause:T('a grudge fight','寻仇'),fame:-1}}]},
  {l:T('Talk him down','劝他'),out:[{w:s=>.4+s.fame/40+s.smarts/60,t:T('"It was a fair fight, and your brother fought well." He hears it, and goes home.','"那是一场公平的比试，你兄弟打得很好。"他听进去了，回家了。'),c:'good',fx:{align:2}},{w:1,t:T('He spits at your feet and tells the town you are a coward.','他往你脚下啐了一口，满城说你是个怂包。'),c:'muted',fx:{fame:-1,meet:'rival',bond:20}}]}]});
AF({id:'af_ar_throw',age:[14,80],cd:10,tags:['af_arena'],ctx:afN({occ:5,age:50}),
 text:c=>T(`A silk-robed man, ${c.npc.en}, invites you to tea. "Next month, you will lose in the third round. Eighty taels."`,`一个穿绸袍的人${c.npc.zh}请你喝茶："下个月，第三轮你输。八十两。"`),
 opts:[{l:T('Take the money','收钱'),out:[{w:s=>.5+s.t.luck*.12,t:T('You lose convincingly. Nobody suspects a thing.','你输得很像回事，谁也没起疑。'),c:'muted',fx:{money:80,align:-4}},{w:1,t:T('Someone sees the payment. The arena bans you, and the town knows why.','有人看见了交钱。擂台不让你再上，全城都知道为什么。'),c:'bad',fx:{money:80,align:-4,fame:-4}}]},
  {l:T('Refuse','不干'),out:[{w:s=>.5+power(s)/80,t:T('He shrugs. "A pity." He finds someone else, and you win the tournament.','他耸耸肩："可惜了。"他另找了人，结果你拿了魁首。'),c:'good',fx:{money:[20,50],fame:2,align:2}},{w:1,t:T('He does not like being refused. Your next opponent has been paid to hurt you.','他不喜欢被拒绝。你下一个对手收了钱，专门往你身上下狠手。'),c:'bad',fx:{hurt:[4,10],cause:T('a bought opponent','被收买的对手'),enemy:1,align:2}}]}]});

/* ================= master 寻访名师 ================= */
AF({id:'af_ms_water',age:[10,70],cd:10,tags:['af_master'],ctx:afN({occ:2,age:70,lv:150}),
 text:c=>T(`On the way down from the hills, a Daoist named ${c.npc.en} tells you to carry water up to his hut for three days. He does not say why.`,`下山路上，一个叫${c.npc.zh}的道士让你往他的茅屋挑三天水，也不说为什么。`),
 opts:[{l:T('Carry the water','挑水'),out:[{w:s=>.5+s.t.heart*.2,t:T('On the third evening he corrects how you breathe on the stairs. It changes everything.','第三天傍晚，他纠正了你上台阶时的呼吸。一下子全变了。'),c:'good',fx:{qi:3,skill:1,meet:'acq',bond:65}},{w:1,t:T('He just needed water. He thanks you warmly.','他就是缺水。他很热情地谢了你。'),c:'muted',fx:{maxHealth:1,happy:-1}}]},
  {l:T('Refuse','不干'),out:[{w:1,t:T('He nods as if you passed a different test.','他点点头，好像你通过了另一道考验。'),c:'muted',fx:{happy:1}},{w:1,t:T('He shrugs and asks the next person.','他耸耸肩，去问下一个人了。'),c:'muted'}]}]});
AF({id:'af_ms_fraud',age:[10,70],cd:8,tags:['af_master'],ctx:s=>{const c=afN({occ:13,age:45})(s);c.lv=PW(.85,0)(s);return c},
 text:c=>T(`In the market, ${c.npc.en} has a banner: "Secret Arts of the Nine Heavens. Lessons, 20 taels."`,`集市上，${c.npc.zh}挂了块招牌："九天秘传绝学。授课一次，二十两。"`),
 opts:[{l:T('Pay for a lesson (20 taels)','交钱上一课（二十两）'),cost:20,out:[{w:s=>.3+s.t.luck*.12,t:T('Under the nonsense, there is one real thing. You find it.','一堆胡说八道下面，确实藏着一点真东西。你找到了。'),c:'good',fx:{skill:2}},{w:1,t:T('It is street tumbling with fancy names.','就是街头翻跟头，起了些唬人的名字。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Test him','试试他'),fight:FG((s,c)=>c.lv,'spar',T('A market master','集市高人'),T('a friendly bout','切磋')),
   win:[{w:1,t:T('He goes down in three moves. The crowd asks for refunds.','三招就倒了。围观的人纷纷要退钱。'),c:'good',fx:{fame:2,align:1}},{w:1,t:T('He goes down, then begs you not to ruin him. He has children.','他倒下了，求你别砸他饭碗，说家里还有孩子。'),c:'muted',fx:{align:2}}],
   lose:[{t:T('He is better than his banner. You pay the twenty and learn something.','他比招牌还靠谱。你乖乖交了二十两，倒也学到了东西。'),c:'muted',fx:{money:-20,skill:2}}]}]});

/* ================= seekmaster 寻访名家切磋 ================= */
AF({id:'af_sm_disciple',age:[16,90],cd:10,tags:['af_seekmaster'],when:s=>power(s)>=100,ctx:s=>{const c=afN({occ:13,age:26})(s);c.lv=PW(.95,5)(s);return c},
 text:c=>T(`At the foot of the mountain, the master’s top disciple, ${c.npc.en}, blocks the path. "My master went easy on you. I will not."`,`山脚下，那位名家的大弟子${c.npc.zh}拦住了路："家师对你手下留情，我可不会。"`),
 opts:[{l:T('Accept','应战'),fight:FG((s,c)=>c.lv,'spar',T('The disciple’s challenge','大弟子挑战'),T('a bout','比试')),
   win:[{w:1,t:T('The disciple bows low. The story goes up the mountain before you go down it.','对方深深一揖。你还没下山，这事已经传上了山。'),c:'good',fx:{fame:3}},{w:1,t:T('You win, and gain a friend who will one day be a master.','你赢了，还交了个将来必成名家的朋友。'),c:'good',fx:{fame:1,meet:'friend',bond:60}}],
   lose:[{w:1,t:T('You lose to the student after holding the teacher. It teaches you about tiredness.','跟师父打平，却输给了徒弟。你算是明白了疲惫二字。'),c:'muted',fx:{skill:2,fame:-1}},{w:1,t:T('They are proud of it for years.','对方为此得意了好些年。'),c:'muted',fx:{meet:'rival',bond:40}}]},
  {l:T('Decline with a bow','拱手谢绝'),out:[{w:s=>.5+s.fame/40,t:T('"Another day." It sounds like respect, not fear.','"改日再会。"听起来是敬重，不是怯。'),c:'muted',fx:{align:1}},{w:1,t:T('They call after you that you were afraid.','对方在后面喊，说你怕了。'),c:'muted',fx:{fame:-1}}]}]});
AF({id:'af_sm_words',age:[16,95],cd:10,tags:['af_seekmaster'],when:s=>power(s)>=100,
 text:()=>T('The master’s parting words keep coming back to you: “You fight as if you have somewhere else to be.”','那位名家临别的一句话一直在你耳边："你出手的时候，好像急着要去别的地方。"'),
 opts:[{l:T('Sit with them','静心参悟'),out:[{w:s=>.4+s.t.heart*.15+s.t.wit*.1,t:T('A month later, sitting by a pond, you understand. You stop hurrying.','一个月后，坐在池塘边，你懂了。你不再赶了。'),c:'gold',fx:{qi:3,skill:2}},{w:1,t:T('The more you think, the less you understand. It nags at your sleep.','越想越不明白。夜里睡不安稳。'),c:'muted',fx:{happy:-2,qi:1}}]},
  {l:T('Drink to them with friends','跟朋友喝酒说起'),out:[{w:2,t:T('By the third cup the saying is a joke, and a good one. Everyone retells it.','三杯下肚，那句话成了个笑话，还是个好笑话。人人都在转述。'),c:'good',fx:{happy:3,fame:1}},{w:1,t:T('A drunk friend says something stupid that turns out to be exactly the answer.','一个喝醉的朋友说了句傻话，偏偏就是答案。'),c:'good',fx:{skill:1,happy:2}}]}]});

/* ================= doctor 看大夫 ================= */
AF({id:'af_dr_mixup',age:[6,99],cd:10,tags:['af_doctor'],
 text:()=>T('The medicine from the doctor tastes nothing like last time. You suspect the apprentice mixed up the drawers.','这回的药跟上回味道完全不一样。你怀疑是药童抓错了药屉。'),
 opts:[{l:T('Go back and complain','回去找大夫'),out:[{w:s=>.5+s.smarts/40,t:T('You were right. The doctor turns red, refunds you and gives you the good stuff.','你没猜错。大夫脸都红了，退了钱，换了好药。'),c:'good',fx:{money:15,heal:6}},{w:1,t:T('He swears it is correct. You drink it, and spend two days sick.','他赌咒说没抓错。你喝了，病了两天。'),c:'bad',fx:{hurt:[3,8],cause:T('the wrong medicine','抓错了药'),f:s=>addCond(s,'poison',1)}}]},
  {l:T('Drink it anyway','照喝不误'),out:[{w:s=>.4+s.t.root*.15,t:T('Whatever it was, it worked.','管它是什么，反正管用。'),c:'good',fx:{heal:8}},{w:1,t:T('Your stomach turns over for a week.','你的肚子翻江倒海了一个礼拜。'),c:'bad',fx:{hurt:[3,8],cause:T('the wrong medicine','抓错了药'),f:s=>addCond(s,'poison',1)}}]}]});
AF({id:'af_dr_message',age:[10,99],cd:10,tags:['af_doctor'],ctx:afN({occ:19,age:78}),
 text:c=>T(`In the doctor’s waiting room, old ${c.npc.en}, who knows he will not leave the bed again, asks you to carry a message to the son he has not spoken to in twenty years.`,`在医馆候诊时，老人${c.npc.zh}知道自己下不了床了，托你给二十年没说过话的儿子捎句话。`),
 opts:[{l:T('Carry it','答应捎话'),out:[{w:s=>.5+s.t.heart*.2+s.smarts/80,t:T('The son weeps, and comes. You were there when they made peace.','儿子哭了，赶了过来。父子和好时，你就在旁边。'),c:'good',fx:{align:4,happy:4,fame:1}},{w:1,t:T('The son slams the door on you. You lie to the old man that he is coming.','儿子当着你的面摔上了门。你骗老人说，他儿子在路上了。'),c:'muted',fx:{align:2,happy:-2}}]},
  {l:T('Say you cannot','推说没空'),out:[{w:1,t:T('He nods and asks the next person. You feel worse than you expected.','他点点头，去托下一个人。你心里比想象中难受。'),c:'muted',fx:{happy:-2}},{w:1,t:T('He understands. "Everyone is busy," he says, without bitterness.','他理解。"谁都忙，"他说，一点怨气都没有。'),c:'muted'}]}]});

/* ================= travel 迁居他乡 ================= */
AF({id:'af_tv_neighbours',age:[16,95],cd:8,tags:['af_travel'],ctx:afN({age:45}),
 text:c=>T(`Your new neighbour, ${c.npc.en}, watches you unpack, arms folded. Outsiders are not much loved here.`,`新邻居${c.npc.zh}抱着胳膊，看你搬东西。这地方不怎么待见外乡人。`),
 opts:[{l:T('Bring a gift (10 taels)','送份见面礼（十两）'),cost:10,out:[{w:s=>.6+s.looks/60+s.t.heart*.1,t:T('The arms unfold. By evening you know everyone on the lane.','胳膊放下了。到了晚上，整条巷子的人你都认识了。'),c:'good',fx:{meet:'friend',bond:60,happy:3}},{w:1,t:T('They take the gift and remain suspicious, with a gift.','礼收下了，提防照旧，只是多了份礼。'),c:'muted'}]},
  {l:T('Keep to yourself','各过各的'),out:[{w:1,t:T('Peace and quiet. Nobody bothers you, and nobody helps you either.','清净。没人找你麻烦，也没人帮你。'),c:'muted'},{w:s=>Math.max(.3,1-s.fame/60),t:T('The rumour starts that you are on the run from something.','有了传言，说你是在外头犯了事才逃到这儿来的。'),c:'bad',fx:{fame:-1,happy:-2}}]}]});
AF({id:'af_tv_toll',age:[16,95],cd:8,tags:['af_travel'],ctx:s=>{const c=afN({occ:28,age:35})(s);c.lv=PW(.9,3)(s);return c},
 text:c=>T(`On the road to your new home, ${c.npc.en} and two ragged men have stretched a rope across a bridge. “Toll.”`,`去新家的路上，${c.npc.zh}和两个衣衫破烂的汉子在桥头拉了根绳子。"过桥费。"`),
 opts:[{l:T('Pay (15 taels)','给钱（十五两）'),cost:15,out:[{w:2,t:T('They lift the rope. Cheaper than a fight.','他们放下了绳子。总比打一架便宜。'),c:'muted'},{w:1,t:T('They take it, then ask for your coat too.','钱收了，又要你的外衣。'),c:'bad',fx:{money:-5,happy:-2}}]},
  {l:T('Fight','动手'),fight:FG((s,c)=>c.lv,'injury',T('Toll at the bridge','桥头拦路'),T('road bandits','拦路匪'),()=>T('the road bandits','拦路匪')),
   win:[{t:T('They scatter into the reeds. The next travellers thank you.','他们四散钻进了芦苇丛。后面的行人都向你道谢。'),c:'good',fx:{fame:1,align:2}}],
   lose:[{t:T('They take your purse and leave you on the bridge.','他们抢了你的钱袋，把你扔在桥上。'),c:'bad',fx:{money:[-30,-10],hurt:[3,8],cause:T('road bandits','拦路匪')}}]},
  {l:T('Talk your way across','设法说过去'),out:[{w:s=>.4+s.smarts/50+s.fame/40,t:T('By the end they are giving you directions.','说到最后，他们还给你指了路。'),c:'good',fx:{smarts:1}},{w:1,t:T('They are not interested in talking.','他们没兴趣听你说话。'),c:'bad',fx:{money:[-20,-10]}}]}]});

/* ================= sectchores 门派杂务 ================= */
AF({id:'af_ch_elder',age:[10,80],cd:8,tags:['af_sectchores'],when:s=>!!s.sect,ctx:afN({age:66}),
 text:(c,s)=>T(`An elder of ${afSect(s).en}, ${c.npc.en}, has been watching you sweep the training yard. "You sweep with your arms. Sweep with your waist."`,`${afSect(s).cn}的长老${c.npc.zh}看你扫演武场看了半天："你是用胳膊扫的。要用腰扫。"`),
 opts:[{l:T('Ask what that means','请教其中道理'),out:[{w:s=>.5+s.t.wit*.15+s.smarts/80,t:T('It means the same thing as half your sect’s first form. Suddenly it makes sense.','这跟本门入门第一式是一个道理。你一下子开了窍。'),c:'good',fx:{skill:2,merit:2}},{w:1,t:T('It means sweep again. And the stairs.','意思是重扫一遍。还有台阶。'),c:'muted',fx:{merit:2,happy:-2}}]},
  {l:T('Just keep sweeping','闷头接着扫'),out:[{w:2,t:T('The elder grunts, which from him is high praise.','长老哼了一声。从他嘴里出来，这就算大加夸奖了。'),c:'good',fx:{merit:3}},{w:1,t:T('He sighs and walks on.','他叹了口气走了。'),c:'muted',fx:{merit:1}}]}]});
AF({id:'af_ch_quarrel',age:[10,80],cd:8,tags:['af_sectchores'],when:s=>!!s.sect,
 text:()=>T('Two junior disciples are shouting over whose turn it is to clean the latrines. Soon it will be fists.','两个小师弟为轮到谁去刷茅房吵了起来，眼看就要动手。'),
 opts:[{l:T('Settle it','出面调解'),out:[{w:s=>.5+s.t.heart*.15+s.fame/50,t:T('You draw up a rota on the spot. It is still on the wall years later.','你当场排了张值日表。好多年后它还贴在墙上。'),c:'good',fx:{merit:3,f:s=>living(s,'fellow').slice(0,2).forEach(p=>addBond(p,3))}},{w:1,t:T('Both of them decide you are the problem.','两个人都认定，问题出在你身上。'),c:'muted',fx:{happy:-2,merit:1}}]},
  {l:T('Do it yourself','自己去刷'),out:[{w:1,t:T('They are ashamed. The story gets around, and the elders approve.','两人都羞愧了。这事传开，长老们都点头。'),c:'good',fx:{merit:4,align:1,happy:-1}},{w:1,t:T('They are delighted, and try the same trick next week.','他俩高兴坏了，下个礼拜又来这一套。'),c:'muted',fx:{merit:2,happy:-2}}]},
  {l:T('Report them','报给师长'),out:[{w:1,t:T('They are punished. You are thanked, and quietly disliked.','两人受了罚。你得了一句夸，背后也招了人嫌。'),c:'muted',fx:{merit:2,f:s=>living(s,'fellow').slice(0,2).forEach(p=>addBond(p,-3))}},{w:1,t:T('The elder is busy and tells you to sort it out yourself.','长老正忙，叫你自己看着办。'),c:'muted'}]}]});

/* ================= sectmission 门派任务 ================= */
AF({id:'af_mi_report',age:[12,80],cd:8,tags:['af_sectmission'],when:s=>!!s.sect,
 text:(c,s)=>T(`Back at ${afSect(s).en}, you have to write up the mission. It went fine. It could have gone better on paper.`,`回到${afSect(s).cn}，你得把这趟任务写成文书。差事办得还行，写在纸上可以更好看些。`),
 opts:[{l:T('Write it honestly','照实写'),out:[{w:s=>.5+Math.max(0,s.align)/40,t:T('Your master reads it twice and says he values a plain report above a pretty one.','师父看了两遍，说他宁要实在的，不要好看的。'),c:'good',fx:{merit:3,align:1}},{w:1,t:T('It is filed and forgotten.','文书归了档，没人再看。'),c:'muted',fx:{merit:1}}]},
  {l:T('Polish it a little','润色一番'),out:[{w:s=>.4+s.smarts/50+s.t.luck*.1,t:T('It reads like a small epic. You are mentioned at the evening meal.','读起来像一段小史诗。晚饭时还有人提起你。'),c:'good',fx:{merit:5,fame:1}},{w:1,t:T('A fellow disciple was there and remembers it differently.','一个同门当时也在场，记得的可不是这么回事。'),c:'bad',fx:{merit:-3,align:-2}}]}]});
AF({id:'af_mi_survivor',age:[14,80],cd:10,tags:['af_sectmission'],when:s=>!!s.sect,ctx:s=>{const c=afN({occ:13,age:28})(s);c.lv=PW(.95,3)(s);return c},
 text:c=>T(`On the way back you find ${c.npc.en}, from a rival sect, lying wounded in a ditch.`,`回程路上，你发现敌对门派的${c.npc.zh}受了伤，倒在路边沟里。`),
 opts:[{l:T('Help them','救人'),out:[{w:s=>.6+s.t.heart*.2,t:T('You bind the wound and leave them at a farm. A year later, a debt of honour is repaid.','你替对方包扎好，送到一户农家。一年后，这份恩情还了回来。'),c:'good',fx:{align:4,meet:'friend',bond:65}},{w:1,t:T('It is a trap. They come up out of the ditch with a knife.','是个圈套。对方从沟里一跃而起，手里握着刀。'),c:'bad',next:'af_mi_survivor2',keep:1}]},
  {l:T('Walk on','走开'),out:[{w:1,t:T('You do not look back.','你没有回头。'),c:'muted',fx:{align:-1}},{w:1,t:T('You hear later that someone else stopped.','后来你听说，有别人停下了脚步。'),c:'muted',fx:{align:-1}}]},
  {l:T('Report it to your sect','回去禀报'),out:[{w:1,t:T('Your sect sends people. You do not ask what for.','门派派了人去。去做什么，你没问。'),c:'muted',fx:{merit:3,align:-2}},{w:1,t:T('By the time they arrive the ditch is empty.','等人赶到，沟里已经空了。'),c:'muted',fx:{merit:1}}]}]});
AFS({id:'af_mi_survivor2',
 text:c=>T(`${c.npc.en} is not as wounded as ${c.npc.he} looked.`,`${c.npc.zh}伤得远没有看上去那么重。`),
 opts:[{l:T('Fight','动手'),fight:FG((s,c)=>c.lv,'injury',T('An ambush in a ditch','沟边埋伏'),T('an ambush','伏击')),
   win:[{w:1,t:T('You disarm them and leave them tied to a tree for their own sect to find.','你夺了对方的刀，把人绑在树上，留给对方的门派去收拾。'),c:'good',fx:{merit:3,fame:1}},{w:1,t:T('You win, and they swear a feud between your sects.','你赢了，对方发誓两派这仇结定了。'),c:'muted',fx:{merit:2,enemy:1}}],
   lose:[{t:T('They leave you in the ditch you found them in.','对方把你扔进了你发现对方的那条沟里。'),c:'bad',fx:{hurt:[5,12],cause:T('an ambush','伏击'),f:s=>addCond(s,'wound',1)}}]},
  {l:T('Run','逃'),out:[{w:s=>.5+s.t.luck*.12,t:T('You make it to the road and a passing cart.','你跑到大路上，跳上了一辆路过的马车。'),c:'muted'},{w:1,t:T('The knife catches you between the shoulders.','刀扎在了你两肩之间。'),c:'bad',fx:{hurt:[4,10],cause:T('an ambush','伏击')}}]}]});

/* ================= peddle 摆摊 ================= */
AF({id:'af_pd_tax',age:[12,90],cd:8,tags:['af_peddle'],ctx:afN({occ:9,age:40}),
 text:c=>T(`${c.npc.en}, the market tax man, says your stall is two feet over the line. That is a fine.`,`收市税的${c.npc.zh}说你的摊子越线了两尺，要罚钱。`),
 opts:[{l:T('Pay the fine (8 taels)','认罚（八两）'),cost:8,out:[{w:2,t:T('He moves on to the next stall, which is also two feet over.','他走向下一个摊子，那个也越线两尺。'),c:'muted'},{w:1,t:T('He comes back next week. The line has moved.','下个礼拜他又来了。线又挪了。'),c:'bad',fx:{money:-8}}]},
  {l:T('Argue','跟他理论'),out:[{w:s=>.4+s.smarts/40+s.fame/50,t:T('You pace it out in front of everyone. He is wrong, and the crowd enjoys it.','你当众一步步量过去。是他错了，围观的人看得开心。'),c:'good',fx:{happy:2,fame:1}},{w:1,t:T('The fine doubles for insolence.','以顶撞为由，罚金翻倍。'),c:'bad',fx:{money:-16}}]}]});
AF({id:'af_pd_order',age:[12,90],cd:8,tags:['af_peddle','af_trade'],ctx:afN({occ:26,age:45}),
 text:c=>T(`${c.npc.en}, who runs an inn across town, wants ten times your usual stock, on credit until the end of the month.`,`城那头开客栈的${c.npc.zh}要订你平常十倍的货，月底结账。`),
 opts:[{l:T('Take the order','接单'),out:[{w:s=>.5+s.smarts/50+s.t.luck*.1,t:T('He pays on the day, and orders again.','他按时结了账，还接着订。'),c:'good',fx:{money:[30,60]}},{w:1,t:T('At the end of the month the inn has a new owner, who has never heard of you.','到了月底，客栈换了东家，新东家根本不认得你。'),c:'bad',fx:{money:[-30,-15]}}]},
  {l:T('Cash only','只收现钱'),out:[{w:1,t:T('He pays cash for a smaller order. Small and sure.','他用现钱订了少一些。量小，稳当。'),c:'muted',fx:{money:[8,15]}},{w:1,t:T('He takes his business elsewhere.','他去别家订了。'),c:'muted'}]}]});

/* ================= perform 街头卖艺 ================= */
AF({id:'af_pf_toughs',age:[12,80],cd:8,tags:['af_perform'],ctx:s=>{const c=afN({occ:28,age:28,sex:'m'})(s);c.lv=PW(.85,2)(s);return c},
 text:c=>T(`${c.npc.en} and his friends push through your crowd. "Nice show. This corner costs half your bowl."`,`${c.npc.zh}带着几个人挤进人群："耍得不错。这块地，得交一半赏钱。"`),
 opts:[{l:T('Pay','交钱'),out:[{w:2,t:T('They take it and wander off.','他们拿了钱，晃荡着走了。'),c:'muted',fx:{money:[-15,-5]}},{w:1,t:T('They take it and stay to heckle.','钱拿了，人还不走，在旁边起哄。'),c:'bad',fx:{money:[-15,-5],happy:-2}}]},
  {l:T('Make him part of the act','把他编进节目里'),fight:FG((s,c)=>c.lv,'light',T('A show with a volunteer','请人上台'),T('a street brawl','街头斗殴')),
   win:[{t:T('You throw him around for the crowd’s pleasure. The bowl fills up twice.','你当众把他摔来摔去，看得人群直叫好。碗满了两回。'),c:'good',fx:{money:[15,35],fame:2}}],
   lose:[{t:T('The crowd thinks his part of the act was better.','观众觉得他演得比你好。'),c:'bad',fx:{hurt:[2,6],cause:T('a street brawl','街头斗殴'),money:[-15,-5],fame:-1}}]}]});
AF({id:'af_pf_troupe',age:[12,70],cd:10,tags:['af_perform'],ctx:afN({occ:30,age:50}),
 text:c=>T(`${c.npc.en}, master of a touring troupe, was in your crowd. "One night in our show. Something with knives."`,`走江湖的戏班班主${c.npc.zh}也在人群里："来我们班子里演一晚。耍刀的那种。"`),
 opts:[{l:T('Do it','去'),out:[{w:s=>.5+s.looks/50+power(s)/100,t:T('The whole town comes. Your name is on the troupe’s next poster.','全城的人都来了。戏班下一张海报上有你的名字。'),c:'good',fx:{money:[20,50],fame:3}},{w:1,t:T('The knife slips in the second act. You finish the show, bleeding on cue.','第二幕刀一滑。你带着血演完了，看着倒像是事先排好的。'),c:'bad',fx:{money:[10,20],hurt:[3,8],cause:T('a stage knife','台上失手'),f:s=>addCond(s,'wound',1)}}]},
  {l:T('Decline','不去'),out:[{w:1,t:T('He leaves a card, in case you change your mind.','他留了张帖子，说你改主意了就来。'),c:'muted'},{w:1,t:T('He hires the juggler from the next corner instead, who becomes famous.','他转头雇了隔壁街口耍杂技的，那人后来出了名。'),c:'muted',fx:{happy:-1}}]}]});

/* ================= scribe 代写书信 ================= */
AF({id:'af_sb_plot',age:[12,95],cd:10,tags:['af_scribe'],ctx:afN({occ:5,age:45,sex:'m'}),
 text:c=>T(`The letter ${c.npc.en} dictated to you lays out, very calmly, how he will cheat his younger brother out of their father’s land.`,`${c.npc.zh}口述让你写的信，心平气和地交代了怎么把他弟弟那份祖田骗到手。`),
 opts:[{l:T('Warn the brother','提醒他弟弟'),out:[{w:s=>.5+s.smarts/50+Math.max(0,s.align)/50,t:T('The brother takes it to the clan elders. The plot dies; you never get paid for the letter.','弟弟把事情捅到族老那里，阴谋落了空。那封信的钱你自然没拿到。'),c:'good',fx:{align:4,fame:1}},{w:1,t:T('He finds out who warned his brother.','他查出了是谁通的风。'),c:'bad',fx:{align:3,enemy:1}}]},
  {l:T('A scribe keeps secrets','替人保密是本分'),out:[{w:1,t:T('You take his money. The land changes hands.','你收了钱。地易了主。'),c:'muted',fx:{money:5,align:-2}},{w:s=>s.t.heart*.15,t:T('You keep the secret, and it keeps you awake.','你守住了秘密，秘密也让你睡不着。'),c:'muted',fx:{money:5,happy:-3}}]},
  {l:T('Ask him for hush money','向他要封口费'),out:[{w:s=>.3+power(s)/80+s.smarts/80,t:T('He pays, hating you.','他给了，心里恨死你。'),c:'muted',fx:{money:[30,60],align:-4,enemy:1}},{w:1,t:T('He goes straight to the yamen and says you threatened him.','他转身就去衙门告你勒索。'),c:'bad',fx:{wanted:1,align:-3}}]}]});
AF({id:'af_sb_love',age:[14,95],cd:10,tags:['af_scribe'],ctx:afN({age:19}),
 text:c=>T(`A shy young customer, ${c.npc.en}, wants a love letter written, and cannot say a single thing about the person it is for without blushing.`,`腼腆的年轻主顾${c.npc.zh}要你代写一封情书。可一说起那个人，${c.npc.ta}就满脸通红，一句整话都说不出来。`),
 opts:[{l:T('Write something beautiful','用心写一封好的'),out:[{w:s=>.4+s.smarts/40,t:T('It works. They come back in spring to ask you to write the wedding invitations.','成了。开春对方又来，请你写喜帖。'),c:'good',fx:{money:[5,15],happy:4,fame:1}},{w:s=>.2+s.looks/80,t:T('It works too well. The recipient wants to meet whoever wrote it.','写得太好了。收信的人非要见见执笔的人。'),c:'muted',fx:{happy:2,fame:1}},{w:1,t:T('The recipient laughs at it. Your customer never comes back.','收信的人看了直笑。那位主顾再没来过。'),c:'bad',fx:{happy:-2}}]},
  {l:T('Coach them to write it themself','教对方自己写'),out:[{w:s=>.5+s.t.heart*.15,t:T('It takes all afternoon and it is clumsy and true. It works.','磨了一下午，写得笨拙，却真心。成了。'),c:'good',fx:{align:1,happy:3,meet:'acq',bond:60}},{w:1,t:T('They give up and go to a cheaper scribe.','对方放弃了，找了个更便宜的代笔。'),c:'muted'}]}]});

/* ================= banquet 设宴请客 ================= */
AF({id:'af_bq_brawl',age:[18,95],cd:8,tags:['af_banquet'],ctx:afN({occ:11,age:30,sex:'m'}),
 text:c=>T(`Deep in the wine, ${c.npc.en} insults another guest’s mother. Two tables stand up at once.`,`酒过三巡，${c.npc.zh}骂了另一位客人的娘。两桌人呼啦一下全站了起来。`),
 opts:[{l:T('Step between them','站到中间'),out:[{w:s=>.4+power(s)/40,t:T('You hold them apart, one hand each, until they laugh. People talk about your banquet for months.','你一手一个把两人分开，直到他们都笑了。这场宴席，大家说了好几个月。'),c:'good',fx:{fame:2,happy:2}},{w:1,t:T('You catch a wine jug meant for someone else.','你替别人挨了一酒壶。'),c:'bad',fx:{hurt:[2,6],cause:T('a flying wine jug','飞来的酒壶'),looks:-1}}]},
  {l:T('Propose a toast','举杯打圆场'),out:[{w:s=>.4+s.smarts/50+s.looks/60,t:T('Your toast is so good that the insulted man drinks to it first.','你这杯酒敬得太漂亮了，挨骂的那位第一个干了。'),c:'good',fx:{fame:1,happy:3}},{w:1,t:T('Nobody hears you over the breaking furniture.','桌椅砸得噼里啪啦，谁也没听见你说什么。'),c:'bad',fx:{money:[-30,-10]}}]}]});
AF({id:'af_bq_favour',age:[18,95],cd:10,tags:['af_banquet'],ctx:afN({age:40}),
 text:c=>T(`After the guests leave, ${c.npc.en} lingers. ${c.npc.He} needs forty taels until autumn.`,`客人散了，${c.npc.zh}却留了下来。${c.npc.ta}想借四十两，秋后还。`),
 opts:[{l:T('Lend it (40 taels)','借（四十两）'),cost:40,out:[{w:s=>.5+s.t.luck*.15,t:T('In autumn they repay sixty, with a gift of new rice.','秋后对方还了六十两，还送来一担新米。'),c:'good',fx:{money:60,meet:'friend',bond:70}},{w:1,t:T('In autumn they cross the street when they see you.','到了秋后，对方远远看见你就绕道走。'),c:'bad',fx:{happy:-3,smarts:1}}]},
  {l:T('Refuse kindly','婉拒'),out:[{w:s=>.5+s.smarts/50,t:T('You say it so well that they thank you for the banquet and mean it.','你话说得周到，对方还真心谢了你这顿饭。'),c:'muted'},{w:1,t:T('They are offended, and tell people your banquet was stingy.','对方不高兴了，到处说你的宴席小气。'),c:'bad',fx:{fame:-1}}]}]});

/* ================= trade 贩货 ================= */
AF({id:'af_td_customs',age:[16,90],cd:8,tags:['af_trade'],ctx:afN({occ:9,age:40}),
 text:c=>T(`At the customs post, ${c.npc.en} finds that your paperwork is missing a stamp that may or may not exist.`,`关卡上，${c.npc.zh}说你的文书缺了一个章。这个章，可能根本就没有。`),
 opts:[{l:T('Pay the “stamp fee” (15 taels)','交"盖章费"（十五两）'),cost:15,out:[{w:2,t:T('The stamp is found. It is a thumbprint.','章找到了，是个手指印。'),c:'muted'},{w:1,t:T('He stamps it, then his colleague at the next post wants the same.','他盖了章，下一个关卡的同僚也要一样的。'),c:'bad',fx:{money:-15}}]},
  {l:T('Argue the regulations','据理力争'),out:[{w:s=>.4+s.smarts/40,t:T('You quote the regulations at him until he waves you through to get rid of you.','你把条例一条条背给他听，他烦得挥手放行。'),c:'good',fx:{smarts:1}},{w:1,t:T('He seizes part of the cargo for inspection. It never comes back.','他扣下一部分货，说要查验。再也没还回来。'),c:'bad',fx:{money:[-50,-20]}}]}]});
AF({id:'af_td_partner',age:[16,90],cd:10,tags:['af_trade','af_lend'],ctx:afN({occ:23,age:40}),
 text:c=>T(`A foreign merchant, ${c.npc.en}, proposes a partnership: you put up fifty taels, ${c.npc.he} brings goods from the far west, and you split the profit.`,`一个胡商${c.npc.zh}提议合伙：你出五十两，${c.npc.ta}从西边运货来，赚了对半分。`),
 opts:[{l:T('Put in fifty','出五十两'),cost:50,out:[{w:s=>.4+s.smarts/60+s.t.luck*.12,t:T('A caravan of spices and glass comes back. Your share is more than double.','一队驮着香料和琉璃的骆驼回来了。你分到的翻了一倍还多。'),c:'gold',fx:{money:[100,160],meet:'acq',bond:60}},{w:1,t:T('The caravan is "lost in a sandstorm". So, it seems, is your partner.','驼队说是"在沙暴里失踪了"。看样子，你的合伙人也一起失踪了。'),c:'bad',fx:{smarts:1,happy:-3}}]},
  {l:T('Decline','婉拒'),out:[{w:1,t:T('He bows and tries the next merchant.','他躬身一礼，去找下一个商人。'),c:'muted'},{w:1,t:T('A year later you hear he made someone rich.','一年后你听说，他让某个人发了大财。'),c:'muted',fx:{happy:-1}}]}]});

/* ================= lend 放贷 ================= */
AF({id:'af_ld_beg',age:[16,95],cd:8,tags:['af_lend'],ctx:s=>{const c=afN({occ:0,age:45})(s);c.lv=PW(.8,0)(s);return c},
 text:c=>T(`${c.npc.en}, a woodcutter who owes you money, is on your doorstep with his hat in his hands. His child is sick. He needs more time.`,`欠你钱的樵夫${c.npc.zh}捏着帽子站在你门口。孩子病了，求你宽限些日子。`),
 opts:[{l:T('Give him time','宽限他'),out:[{w:s=>.5+s.t.luck*.15,t:T('He pays back every coin by winter, and brings firewood every year after.','入冬前他一个子儿不少地还清了，此后年年给你送柴。'),c:'good',fx:{money:[10,25],align:2,meet:'acq',bond:65}},{w:1,t:T('He never pays. You never ask again.','他一直没还。你也没再要。'),c:'muted',fx:{align:2}}]},
  {l:T('Forgive the debt','免了这笔债'),out:[{w:s=>.5+s.fame/40,t:T('The story goes round the valley. People think better of moneylenders, or at least of one.','这事在山谷里传开了。大家对放贷的看法好了一点，至少对你一个是这样。'),c:'good',fx:{align:5,fame:2,happy:3}},{w:1,t:T('Three more debtors come the next day with sick children.','第二天，又来了三个欠债的，家里也都有孩子病了。'),c:'muted',fx:{align:3,smarts:1}}]},
  {l:T('Collect anyway','照收不误'),out:[{w:s=>.5+power(s)/60,t:T('He sells his axe to pay you. You have the money.','他卖了斧头还你钱。钱你是拿到了。'),c:'muted',fx:{money:[15,30],align:-5}},{w:1,t:T('His neighbours come out with sticks. You leave without the money.','他的邻居们拎着棍子出来了。你空着手走了。'),c:'bad',fx:{align:-3,fame:-1}}]}]});
AF({id:'af_ld_bigshot',age:[18,95],cd:10,tags:['af_lend'],ctx:afN({occ:11,age:35}),
 text:c=>T(`${c.npc.en}, son of an important family, wants to borrow a hundred taels at your best rate. He is charming, and a little drunk.`,`大户人家的公子${c.npc.zh}要按你最好的利钱借一百两。人很讨喜，就是有点醉。`),
 opts:[{l:T('Lend it (100 taels)','借（一百两）'),cost:100,out:[{w:s=>.4+s.fame/50+s.t.luck*.1,t:T('His father pays it back with interest, and an invitation to dinner.','他爹连本带利还了钱，还请你吃了顿饭。'),c:'gold',fx:{money:[140,180],meet:'acq',bond:60,fame:1}},{w:1,t:T('He denies ever borrowing it. His family’s lawyers agree with him.','他死活不认借过钱。他家的讼师也这么说。'),c:'bad',fx:{enemy:1,happy:-4}}]},
  {l:T('Ask for collateral first','先要抵押'),out:[{w:s=>.5+s.smarts/50,t:T('He leaves a jade pendant worth twice the loan. He pays back in a month.','他押了块值两倍的玉佩，一个月就还了。'),c:'good',fx:{money:[15,30]}},{w:1,t:T('Insulted, he takes his business and his charm elsewhere.','他觉得受了侮辱，带着他的生意和他的讨喜劲儿走了。'),c:'muted'}]}]});
