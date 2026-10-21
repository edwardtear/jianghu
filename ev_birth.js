/* 江湖一生 · births, early childhood and quiet years: so no two lives open the same way */
'use strict';

/* ---------- the birth scene: when, where, how, what people said, how you got your name ---------- */
const B_WHEN=[
 ['On the coldest night of the twelfth month','腊月里最冷的一夜'],['As the spring ploughing began','开春犁地的时候'],['During a thunderstorm that split the old locust tree','一场雷雨劈开了村口老槐树的那天'],
 ['At the hour of the rooster, as the cooking smoke rose','酉时，家家炊烟升起的时候'],['On the first morning of the new year, between firecrackers','大年初一的早晨，鞭炮声里'],['In the middle of the wheat harvest','麦收正忙的时候'],
 ['During a drought so long the well ran dry','大旱之年，井都见了底'],['On the night of the Qingming festival, while the family swept the graves','清明那天夜里，家人刚扫完墓回来'],['In plum-rain season, when everything smelled of mould','黄梅天里，处处都是霉味'],
 ['Under a blood-red moon that frightened the dogs','一轮血月当空，狗都吓得不敢叫'],['At first light, as the cock crowed for the third time','天刚蒙蒙亮，鸡叫三遍'],['In the deep of a winter so snowy the door would not open','大雪封门的深冬'],
 ['On the Double Ninth festival, as the chrysanthemums opened','重阳节，菊花正开'],['In the heat of the dog days','三伏天里'],['As the first swallows came back to the eaves','头一批燕子回到屋檐下的时候'],
 ['On the night of the Ghost Festival, when the river was full of lanterns','中元节夜里，河上漂满了河灯'],['In the year the locusts came','蝗虫过境的那一年'],['While an eclipse darkened the noon sky','正午日食，天地一片昏暗'],
 ['During the autumn rains','秋雨连绵的时节'],['In the small hours, when even the watchman was asleep','后半夜，连打更的都睡着了']
];
const B_PLACE={
 central:[['the Central Plains, where the Yellow River bends past old capitals and older temples','中原，黄河九曲、古都与古刹并立之地'],['a loess village in the Central Plains, where houses are dug into the hillside','中原的一个黄土村子，人家都住在窑洞里'],['a market town on the old Luoyang road','洛阳古道边的一个集镇'],['the shadow of Mount Song, close enough to hear the Shaolin bells','嵩山脚下，听得见少林的钟声']],
 jiangnan:[['Jiangnan, a land of canals, rain and silk','江南，小桥流水、烟雨丝绸之乡'],['a water town in Jiangnan where every house has a boat at the back door','江南水乡，家家后门都拴着一条船'],['a tea village in the hills above West Lake','西湖边山上的一个茶村'],['a busy lane in Suzhou, between a silk shop and a noodle stall','苏州的一条小巷，左边绸缎庄，右边面摊']],
 shu:[['Shu, behind mountain roads so steep they are said to climb into the sky','蜀中，蜀道之难，难于上青天'],['a misty valley in Shu where the pepper bushes grow wild','蜀中雾气蒙蒙的山谷，花椒树漫山遍野'],['a town in Shu so damp the walls grow moss','蜀中一个潮湿的小城，墙上长满青苔'],['a village under Mount Emei, where monkeys steal laundry','峨眉山下的村子，猴子常来偷晾的衣服']],
 north:[['the Northern Frontier, where the Great Wall holds back the steppe','塞北，长城之外，朔风卷着草原'],['a garrison town on the Great Wall','长城上的一座戍边小城'],['a felt tent on the edge of the grasslands','草原边上的一顶毡帐'],['a frontier town where the wind never stops','塞外一个风从来不停的小镇']],
 west:[['the Western Regions, among the oasis towns of the Silk Road','西域，丝路上的绿洲城邦之间'],['a caravanserai on the Silk Road, full of camels and strangers','丝路上的一座驿站，满是骆驼和异乡人'],['an oasis town at the edge of the great desert','大漠边缘的一个绿洲小城'],['a village under the snowy Tianshan','天山雪峰脚下的村落']],
 miao:[['the Miao Borderlands, in misty valleys famous for poison and Gu','苗疆，雾谷之中，以毒与蛊闻名'],['a stilt house above a fast green river in the Miao hills','苗岭湍急碧河上的一座吊脚楼'],['a terraced-field village in the Miao Borderlands','苗疆梯田间的一个寨子'],['a valley where the silver-makers of the Miao live','苗家银匠聚居的山谷']],
 east:[['the Eastern Sea, on a fishing isle off the coast','东海外的一座渔岛'],['a fishing village where nets dry on every wall','一个渔村，墙上都晾着渔网'],['a salt-pan town on the eastern shore','东海边一个晒盐的小镇'],['a port full of foreign ships and tall tales','一个港口，满是番船和奇谈']],
 capital:[['the Capital, inside the walls of the imperial city','京城，天子脚下'],['a narrow hutong in the Capital','京城的一条窄胡同'],['the Capital, a street away from the Ministry of Justice','京城，离刑部衙门只隔一条街'],['the outer city of the Capital, among the pedlars and acrobats','京城外城，货郎和杂耍艺人中间']]
};
const B_FAMILY={
 peasant:[['Your parents farm a rented plot. The harvest decides whether winter is hungry.','爹娘租种着几亩薄田。收成好坏，决定这个冬天会不会挨饿。'],['Your father owns one ox and loves it more than anything. Your mother says you come second.','父亲有一头牛，宝贝得不得了。母亲说你排第二。'],['You are the fifth child. Your parents are glad, and worried.','你是家里第五个孩子。爹娘既高兴，又发愁。'],['The landlord sends a bag of rice for your birth. Your father knows it will appear on the rent.','地主送来一袋米贺喜。父亲知道，这袋米迟早要算进租子里。']],
 hunter:[['Your father hunts the hills. You learn early how to move quietly.','父亲靠打猎为生。你很早就学会了怎样悄无声息地走路。'],['Your cradle is lined with a wolf skin your father took himself.','你的摇篮里垫着一张狼皮，是父亲亲手打来的。'],['Your mother hunts too. She is the better shot, though nobody says so.','母亲也打猎，而且枪法更准，只是没人说破。']],
 merchant:[['Your family trades salt and tea. There is always money, and always worry about money.','家里贩盐贩茶。钱从来不缺，为钱发愁也从来不缺。'],['Your father is away with a caravan. He hears about you three months later.','父亲跟着商队在外，三个月后才知道你出生了。'],['Your grandmother counts your fingers, then reaches for the abacus out of habit.','祖母数了数你的手指头，又习惯性地去摸算盘。']],
 scholar:[['Your grandfather passed the imperial exams. Books outnumber the furniture.','祖父当年中过进士。家里的书比家具还多。'],['Your father failed the exams nine times. He has great hopes for you.','父亲考了九次科举都落了榜。他把希望全寄托在你身上。'],['The family is old and respected, and the roof leaks.','书香门第，家世清白，屋顶漏雨。']],
 beggar:[['You were born under a bridge. Nobody wrote down the date.','你生在桥洞底下，没有人记下日子。'],['The beggars of the district pass you from arm to arm and argue over who will feed you.','这一片的乞丐把你抱来抱去，争着要喂你。'],['Your mother wraps you in the only good thing she owns: a silk sash from some better life.','母亲用她唯一的好东西裹住你：一条丝带，像是从前好日子里留下的。']],
 escort:[['Your father’s escort agency guards silver on the roads. Its banner and its name are its only real capital.','父亲开镖局，替人押送银两。镖旗和名号，就是镖局全部的本钱。'],['The escorts fire a celebratory volley of arrows over the courtyard.','镖师们朝院子上空放了一排响箭贺喜。'],['Your father was out on a run. A rider brings the news to him at an inn three hundred li away.','父亲正在走镖。一个快马把消息送到三百里外的客栈。']],
 temple:[['You were left in a basket at a temple gate. The monks took you in.','你被放在寺门口的竹篮里，和尚们收留了你。'],['In the basket with you: a half-eaten bun and a jade bead.','篮子里还有半个馒头和一颗玉珠。'],['The abbot reads the note pinned to your blanket, then burns it.','方丈读了别在襁褓上的字条，然后把它烧了。']],
 clan:[['Your clan has produced swordsmen for six generations. The expectations arrived before your first tooth.','你家六代都出剑客。你还没长出第一颗牙，家里的期望就已经压了下来。'],['The clan elders gather to look at your hands and argue about your bones.','族中长老围过来看你的手，又为你的根骨争论起来。'],['A sword is laid in your cradle, as is the custom. You try to eat it.','按祖上规矩，摇篮里放了一柄剑。你想去咬它。']],
 cult:[['Your parents serve the Crimson Sky Cult. The righteous sects call your family demons.','爹娘效忠赤霄教，名门正派都管你们家叫魔头。'],['A cult elder arrives in the night to mark your forehead with cinnabar.','一位赤霄教长老连夜赶来，在你额头点了一点朱砂。'],['Your parents move house the week you are born. They do this often.','你出生那个礼拜，爹娘又搬了家。他们常搬。']],
 noble:[['You were born in a prince’s mansion: a hundred servants and a thousand rules.','你生在王府里：上百个仆人，上千条规矩。'],['The palace sends a jade lock for your neck. Three wet nurses compete for you.','宫里赐下一把长命玉锁，三个奶娘争着抱你。'],['Your father’s concubines count the days on their fingers and say nothing.','父亲的几房姨娘掐着指头算日子，谁也不吭声。']]
};
/* how it went: some births change a little about the life that follows */
const B_HOW=[
 {w:6,t:['It is a quick, easy birth. Your mother is back at the stove by evening.','生得又快又顺，母亲傍晚就下了灶。']},
 {w:4,t:['The labour lasts two days. The midwife says you were in no hurry.','折腾了两天两夜。接生婆说，你一点也不着急。']},
 {w:2,t:['You are born feet first. The midwife mutters that you will walk your own road.','你是脚先出来的。接生婆嘀咕说，这孩子将来要走自己的路。'],fx:{align:1}},
 {w:2,t:['You arrive a month early, tiny and furious.','你早产了一个月，又小又凶。'],fx:{maxHealth:-4}},
 {w:2,t:['You are an enormous baby. The neighbours come to look.','你是个大胖娃娃，邻居们都跑来看。'],fx:{maxHealth:4}},
 {w:1.5,t:['You are a twin. Your sibling does not live through the night.','你是双生子，另一个没能熬过那一夜。'],fx:{happy:-3}},
 {w:1.5,t:['You are born on a boat, in the middle of the river.','你生在一条船上，船正在河中央。'],fx:{f:s=>s.flags.riverborn=s.age}},
 {w:1.5,t:['You are born on the road, in an ox cart, while the family flees a flood.','全家逃水灾的路上，你生在一辆牛车里。'],fx:{money:-3}},
 {w:1,t:['Bandits raid the village that night. Your mother hides you in the rice jar.','那天夜里土匪进了村。母亲把你藏在米缸里。'],fx:{f:s=>s.flags.ricejar=s.age}},
 {w:1,t:['You do not cry. The midwife holds you upside down until you do.','你没哭。接生婆把你倒提起来，直到你哭出声。']},
 {w:1,t:['You are born with a caul over your face. Old women say you will see ghosts.','你出生时脸上蒙着一层胎衣。老人们说，你将来看得见鬼。'],fx:{qi:2}},
 {w:1,t:['You are born with a tooth already in your mouth.','你生下来嘴里就有一颗牙。'],fx:{fame:1}},
 {w:1,t:['A travelling doctor happens to be passing and saves your mother’s life.','一位游方郎中恰好路过，救了你母亲一命。'],fx:{f:s=>storeNpc(s,{npc:npc(s,{occ:10,age:rint(35,60)})},'acq',60)}},
 {w:1,t:['The midwife is drunk. Your grandmother delivers you herself.','接生婆喝醉了，是祖母亲手把你接下来的。']},
 {w:1,t:['The house catches fire the same night. Everyone gets out, with you.','当夜家里失了火。人都逃了出来，也抱出了你。'],fx:{money:-5}},
 {w:1,t:['You are born during a funeral in the house next door. The two families never quite agree what it means.','你出生时，隔壁正在办丧事。两家人始终说不清这算什么兆头。']}
];
const B_OMEN=[
 ['A white crane circles the roof three times.','一只白鹤绕着屋顶飞了三圈。'],['The well water turns sweet for a day.','井水甜了一整天。'],['All the dogs in the village howl at once.','全村的狗一齐叫了起来。'],
 ['A fortune teller passing by stops, stares at the house, and walks on quickly.','一个算命先生路过，盯着你家看了半天，然后快步走开了。'],['A rainbow stands over the house for an hour.','一道彩虹在屋顶上挂了一个时辰。'],
 ['The old sword on the wall falls down by itself.','墙上那把旧剑自己掉了下来。'],['A fox sits at the edge of the courtyard all night, watching.','一只狐狸在院子边坐了一整夜，一直看着。'],
 ['The temple bell rings, though nobody is there to ring it.','庙里的钟响了，可那时没人在敲。'],['A shooting star falls toward the western hills.','一颗流星朝西山坠了下去。'],
 ['The peach tree in the yard flowers out of season.','院里的桃树不合时令地开了花。'],['A stranger in a bamboo hat leaves a copper coin on the doorstep and is gone.','一个戴斗笠的陌生人在门槛上放了一枚铜钱，转眼就不见了。'],
 ['A swarm of bees settles in the eaves and does not sting anyone.','一窝蜜蜂落在屋檐下，谁也没蜇。'],['The family’s rooster crows at midnight.','家里的公鸡半夜打鸣。'],['Your grandfather dreams of a tiger walking into the house.','祖父梦见一只老虎走进了家门。']
];
const B_NAME=[
 ['Your grandfather chooses your name from the Book of Songs.','祖父从《诗经》里给你挑了名字。'],['Your name comes from the first thing your father saw that morning.','你的名字，取自父亲那天早上看到的第一样东西。'],
 ['A fortune teller is paid three coppers to choose your name.','家里花了三文钱，请算命先生给你起名。'],['Your parents argue for a month about your name. Your mother wins.','爹娘为你的名字吵了一个月，最后母亲赢了。'],
 ['You are called by a cheap milk-name to fool the ghosts, and your real name comes later.','家里先给你起了个贱名，好骗过小鬼，正名以后再说。'],['You are named after an uncle who died young. People look at you a little sadly.','你随了一位早逝的叔叔的名字。大家看你的眼神，总有点伤感。'],
 ['The village teacher names you in exchange for a chicken.','村里的教书先生给你起了名，换走一只鸡。'],['Your name is written on a red paper and pasted on the door for the whole street to see.','你的名字写在红纸上，贴在门口，整条街都看得见。']
];
function birth(s){
  const reg=region(s),fam=family(s),Pk=a=>T(a[0],a[1]);
  const when=pick(B_WHEN),where=pick(B_PLACE[reg.id]||[[reg.en,reg.cn]]);
  say(s,`${when[0]}, you are born in ${where[0]}, to ${fam.en}.`,`${when[1]}，在${where[1]}，${fam.birth}`);
  sayT(s,Pk(pick(B_FAMILY[fam.id]||[[fam.line.en,fam.line.zh]])));
  const how=wpick(B_HOW,h=>h.w);sayT(s,Pk(how.t),how.fx&&how.fx.maxHealth<0?'bad':'');if(how.fx){applyFx(s,how.fx,{});s.health=Math.min(s.health,s.maxHealth)}
  if(chance(.45))sayT(s,Pk(pick(B_OMEN)),'muted');
  if(chance(.5))sayT(s,Pk(pick(B_NAME)),'muted');
  const t=s.t;if(t.root>=8)say(s,'The midwife says she has never felt bones like yours.','接生婆说，她从没摸过这样好的根骨。','good');if(t.root<=2)say(s,'You are small and sickly. The midwife lights incense for you.','你又瘦又小，接生婆为你点了一炷香。','bad');
  if(t.wit>=9)say(s,'You watch everything with unsettling attention.','你看什么都目不转睛，专注得叫人发毛。','good');if(t.luck>=9)say(s,'A magpie lands on the roof the moment you cry. Everyone agrees it is a good omen.','你啼哭的那一刻，一只喜鹊落在了屋顶。人人都说这是吉兆。','good');
  if(t.heart>=9)say(s,'You hardly ever cry. Your mother finds it a little uncanny.','你几乎不哭。母亲觉得有点不可思议。','good');
}

/* ---------- the first years ---------- */
I({id:'zhoushui',age:[1,1],w:1.5,once:1,text:()=>T('You take your first steps.','你迈出了人生第一步。'),
 out:[{w:3,t:T('Three steps, straight into your grandmother’s arms.','走了三步，正好扑进祖母怀里。'),c:'good',fx:{happy:3}},{w:2,t:T('Straight into the chicken coop.','一头扎进了鸡窝。'),fx:{happy:1}},{w:1,t:T('You walk before you crawl. The old people say it means a restless life.','你还没学会爬就会走了。老人说这孩子一辈子闲不住。'),fx:{skill:1}},{w:1,t:T('Late, and wobbly, but you get there.','晚了些，摇摇晃晃，但总算走起来了。'),c:'muted'}]});
I({id:'babyfever',age:[1,3],once:1,text:()=>T('You run a high fever for three days.','你发了三天高烧。'),
 out:[{w:4,t:T('Your mother sits up with you every night. On the fourth morning you ask for porridge.','母亲夜夜守着你。第四天早上，你嚷着要喝粥。'),fx:{hurt:[4,10],cause:T('a childhood fever','幼时的高烧')}},{w:1,t:T('A village healer burns mugwort on your palms. It works, or something does.','村里的郎中在你手心烧艾，管用了，或者说总有什么管用了。'),fx:{hurt:[2,6],cause:T('a childhood fever','幼时的高烧')}},{w:1,t:T('It nearly kills you. You come out of it quieter.','差一点要了你的命。病好后，你安静了许多。'),c:'bad',fx:{hurt:[12,22],cause:T('a childhood fever','幼时的高烧'),smarts:2}}]});
I({id:'babylost',age:[2,5],once:1,text:()=>T('At a temple fair you let go of your mother’s hand.','庙会上，你松开了母亲的手。'),
 out:[{w:3,t:T('A sweet-seller keeps you on his stall until she comes running back.','一个卖糖的把你放在摊子上，直到母亲跑回来。'),c:'good',fx:{happy:2}},{w:2,t:T('You are found three hours later, asleep in a puppet theatre.','三个时辰后，大人们在木偶戏台底下找到了睡着的你。'),fx:{happy:1}},{w:1,t:T('A woman picks you up and starts walking. A constable stops her at the gate.','一个女人抱起你就走，在城门口被捕快拦了下来。'),c:'bad',fx:{happy:-3}}]});
I({id:'babydog',age:[1,5],cd:5,text:()=>T('The family dog has decided you are its puppy.','家里的狗认定你是它的崽。'),
 out:[{w:3,t:T('It sleeps across your doorway every night.','它每天夜里都横躺在你门口睡。'),c:'good',fx:{happy:3}},{w:1,t:T('It steals your rice cakes and you forgive it every time.','它偷你的年糕，你每次都原谅它。'),fx:{happy:2}},{w:1,t:T('It drives off a snake that slid in under the door.','一条蛇从门缝里钻进来，被它赶了出去。'),c:'good',fx:{happy:2}}]});
I({id:'babyword2',age:[2,4],once:1,text:()=>T('You start asking "why" about everything.','你开始对什么都问"为什么"。'),
 out:[{w:2,t:T('"Why is the sky up?" Your father has no answer and buys you a sugar figure instead.','"天为什么在上面？"父亲答不上来，只好给你买了个糖人。'),fx:{smarts:2,happy:1}},{w:1,t:T('An old scholar next door answers every single question. You are friends for life.','隔壁的老秀才每个问题都认真回答。你们成了忘年交。'),c:'good',fx:{smarts:4,meet:'friend',bond:65}},{w:1,t:T('You are told to be quiet so often that you stop asking out loud.','大人总叫你闭嘴，后来你就只在心里问了。'),c:'muted',fx:{smarts:2,happy:-1}}]});
I({id:'babysnow',age:[2,6],cd:3,text:()=>T('You see snow fall for the first time you can remember.','这是你记事以来第一次看见下雪。'),
 out:[{w:3,t:T('You try to catch every flake with your tongue.','你张着嘴去接每一片雪花。'),c:'good',fx:{happy:3}},{w:1,t:T('You build a snow lion and cry when it melts.','你堆了一只雪狮子，化了的时候哭了一场。'),fx:{happy:1}},{w:1,t:T('You stay out until your fingers go white.','你在外面玩到手指发白。'),fx:{hurt:[2,5],cause:T('frostbite','冻伤')}}]});
I({id:'babystory',age:[3,6],cd:3,text:()=>T('Every night an old relative tells you stories of the jianghu.','每天晚上，家里一位老人都给你讲江湖故事。'),
 out:[{w:2,t:T('Tales of the Eight Immortals crossing the sea. You dream of floating.','八仙过海的故事。你梦见自己飘在海上。'),fx:{happy:2}},{w:2,t:T('Tales of a sword that could cut the moon. You practise with a stick.','能劈开月亮的宝剑。你拿根树枝天天比划。'),fx:{skill:1}},{w:1,t:T('Tales of fox spirits. You are afraid of the dark for a year.','狐仙的故事。你一年都不敢摸黑。'),c:'muted',fx:{happy:-1}},{w:1,t:T('Tales of a righteous outlaw who robbed the rich. You decide to be like him.','劫富济贫的义贼。你暗暗决定以后也要那样。'),fx:{align:2}}]});
I({id:'babyfall',age:[2,6],once:1,text:()=>T('You climb onto the well wall to see your reflection.','你爬上井沿，想看看自己的倒影。'),
 out:[{w:3,t:T('Your uncle grabs you by the collar just in time.','叔叔一把揪住你的衣领，及时把你拉了回来。'),fx:{happy:-1}},{w:1,t:T('You fall in. A bucket and a lot of shouting get you out.','你掉了下去。一只水桶加上一阵叫喊，才把你弄上来。'),c:'bad',fx:{hurt:[5,12],cause:T('a fall into a well','跌落井中')}},{w:1,t:T('You see a face that is not quite yours, and run.','你看到一张不太像自己的脸，吓得跑开了。'),c:'muted',fx:{qi:1}}]});
I({id:'babycandy',age:[2,6],cd:4,text:()=>T('A sugar-painter sets up his stall at the crossroads.','十字路口来了个画糖人的。'),
 out:[{w:2,t:T('He draws you a golden dragon in sugar. You do not eat it for a week.','他给你画了一条金灿灿的糖龙。你舍不得吃，留了一个礼拜。'),c:'good',fx:{happy:4}},{w:2,t:T('You spin the wheel and win a sugar rabbit.','你转了转盘，中了一只糖兔子。'),fx:{happy:2}},{w:1,t:T('You have no coppers. You watch until he packs up.','你没钱，就一直看到他收摊。'),c:'muted'}]});
I({id:'babyteeth',age:[5,7],once:1,text:()=>T('Your first tooth falls out.','你掉了第一颗牙。'),
 out:[{w:2,t:T('You throw it on the roof, as custom says, so the new one grows straight.','你按规矩把它扔上屋顶，好让新牙长得直。'),fx:{happy:1}},{w:1,t:T('You swallow it with your rice.','你连饭带牙一起吞了。'),fx:{happy:1}},{w:1,t:T('A crow takes it from the roof. Your grandmother is uneasy for days.','一只乌鸦把它从屋顶叼走了。祖母为此不安了好几天。'),c:'muted'}]});
I({id:'babyopera',age:[3,8],cd:4,text:()=>T('A travelling opera troupe sets up a stage in the threshing ground.','一个戏班子在打谷场上搭了台子。'),
 out:[{w:2,t:T('You watch the Monkey King from your father’s shoulders and somersault all the way home.','你骑在父亲脖子上看了《大闹天宫》，一路翻着跟头回家。'),c:'good',fx:{happy:4,skill:1}},{w:1,t:T('The painted faces terrify you. You hide under the bench.','花脸把你吓坏了，你躲到了板凳底下。'),fx:{happy:-1}},{w:1,t:T('An actor lets you try on a general’s helmet.','一个演员让你戴了戴将军的头盔。'),c:'good',fx:{happy:3}}]});
I({id:'babysibling',age:[2,7],once:1,w:1.2,when:s=>!family(s).orphan&&!family(s).nofather,ctx:s=>({npc:npc(s,{sur:s.sur,age:0,lv:1})}),text:()=>T('A younger sibling is born.','你多了一个弟弟或妹妹。'),
 opts:[{l:T('Help look after the baby','帮着照看'),out:[{w:3,t:T('You rock the cradle for hours and feel very important.','你摇了好几个时辰的摇篮，觉得自己很了不起。'),c:'good',fx:{meet:'sibling',bond:75,happy:2,align:1}},{w:1,t:T('You drop them, once, onto the bed. Nobody ever finds out.','你失手把小家伙掉在了床上，就一次，谁也不知道。'),fx:{meet:'sibling',bond:65}}]},
  {l:T('Sulk; you were here first','闹别扭：我先来的'),out:[{w:2,t:T('Nobody pays you any attention for a year.','一年里谁也没顾得上理你。'),c:'muted',fx:{meet:'sibling',bond:45,happy:-3}},{w:1,t:T('You come round when the baby laughs at you.','小家伙冲你一笑，你就消气了。'),fx:{meet:'sibling',bond:60}}]}]});
I({id:'babyhide',age:[3,7],cd:3,text:()=>T('You play hide-and-seek with the other children.','你和别的孩子玩捉迷藏。'),
 out:[{w:2,t:T('You hide so well nobody finds you until dinner.','你藏得太好，直到开饭都没人找到你。'),fx:{happy:2,skill:1}},{w:1,t:T('You hide in an empty coffin in the carpenter’s yard and fall asleep.','你躲进木匠院子里一口空棺材，睡着了。'),c:'muted',fx:{happy:1}},{w:1,t:T('You find a hole in the old city wall with something wrapped in oilcloth inside.','你在老城墙的洞里发现一个油布包。'),c:'good',fx:{money:[3,10]}}]});
I({id:'babyrice',age:[3,8],cd:5,when:s=>family(s).rich<=1,text:()=>T('A lean year. There is only thin gruel to eat.','荒年，家里只有稀粥。'),
 out:[{w:2,t:T('Your mother gives you her share and says she is not hungry.','母亲把她那份给了你，说自己不饿。'),fx:{happy:-2}},{w:1,t:T('You learn which wild greens are safe to eat.','你学会了分辨哪些野菜能吃。'),fx:{smarts:2,maxHealth:1}},{w:1,t:T('A temple sets up a soup kitchen. You stand in line every day.','庙里开了粥棚，你天天去排队。'),c:'muted',fx:{align:1}}]});
I({id:'babyrich',age:[3,8],cd:5,when:s=>family(s).rich>=3,text:()=>T('You are given a whole room of toys and a tutor you hate.','你有满满一屋子玩具，还有一个你讨厌的先生。'),
 out:[{w:2,t:T('You learn to recite the Thousand Character Classic, mostly to make him go away.','你背会了《千字文》，主要是为了让他快点走。'),fx:{smarts:4}},{w:1,t:T('You give your toys away to the servants’ children. Your mother is furious, your grandmother proud.','你把玩具都送给了仆人的孩子。母亲气坏了，祖母却很欣慰。'),c:'good',fx:{align:3}},{w:1,t:T('You put a frog in the tutor’s teacup. He resigns.','你在先生的茶杯里放了只青蛙，他辞馆走了。'),fx:{happy:3,smarts:-1}}]});
I({id:'babyfire',age:[4,9],cd:6,text:()=>T('At New Year, the older children let you light a firecracker.','过年时，大孩子们让你点一个炮仗。'),
 out:[{w:3,t:T('BANG. You run, screaming with joy.','"砰！"你尖叫着跑开，乐坏了。'),c:'good',fx:{happy:3}},{w:1,t:T('It goes off in your hand. Your eyebrows grow back eventually.','炮仗在你手里炸了。眉毛后来总算长了回来。'),c:'bad',fx:{hurt:[3,8],cause:T('a firecracker','炮仗'),looks:-1}}]});
I({id:'babyduck',age:[3,7],cd:6,text:()=>T('You are put in charge of the family’s ducklings.','家里让你照看小鸭子。'),
 out:[{w:2,t:T('They follow you everywhere. You feel like a general.','它们走到哪儿都跟着你。你觉得自己像个将军。'),c:'good',fx:{happy:3}},{w:1,t:T('A hawk takes one. You cry, and then you learn to watch the sky.','一只鹰叼走了一只。你哭了，后来就学会了盯着天。'),fx:{smarts:1,happy:-2}},{w:1,t:T('You lose all of them and find them, hours later, at the neighbour’s pond.','你把它们全弄丢了，几个时辰后才在邻居家的池塘里找到。'),c:'muted'}]});
I({id:'babyshadow',age:[3,9],cd:6,text:()=>T('A shadow-puppet show comes to town.','镇上来了皮影戏。'),
 out:[{w:2,t:T('You make shadow birds on the wall for months afterwards.','之后好几个月，你都在墙上比划手影鸟。'),fx:{happy:2,smarts:1}},{w:1,t:T('The puppeteer shows you how the figures move. Your fingers are quick.','艺人教你怎么操纵皮影。你的手指很灵巧。'),c:'good',fx:{skill:1,smarts:1}},{w:1,t:T('You fall asleep before the hero arrives.','英雄还没出场，你就睡着了。'),c:'muted'}]});
I({id:'babybully',age:[4,9],cd:5,text:()=>T('A bigger child keeps pushing you into puddles.','一个大孩子老把你推进水坑。'),
 opts:[{l:T('Push back','推回去'),out:[{w:s=>s.t.root,t:T('You both end up in the puddle. After that, you are friends.','你俩一起栽进了水坑。从那以后，你们成了朋友。'),c:'good',fx:{meet:'friend',bond:55,skill:1}},{w:3,t:T('You end up in the puddle again, with a bloody nose.','你又进了水坑，还流了鼻血。'),fx:{hurt:[2,5],cause:T('a scuffle','打架')}}]},
  {l:T('Tell a grown-up','告诉大人'),out:[{w:2,t:T('It stops. You are called a tattletale for a while.','事情停了。只是有一阵子大家都叫你"告状精"。'),c:'muted'},{w:1,t:T('The bully’s father beats him. You feel worse than before.','那孩子被他爹揍了一顿。你心里反倒更难受。'),fx:{align:1,happy:-1}}]},
  {l:T('Take a different road home','绕路回家'),out:[{t:T('You learn every back alley in the district.','你把这一片的小巷子都摸熟了。'),fx:{smarts:1}}]}]});
I({id:'babyhealer',age:[2,8],once:1,w:.7,ctx:s=>{const c=scene();c.npc=npc(s,{occ:10,age:rint(50,80)});return c},text:c=>T(`A wandering physician, ${c.npc.en}, takes your pulse for fun and frowns.`,`一位游方郎中${c.npc.zh}随手给你把了把脉，皱起眉头。`),
 out:[{w:2,t:T('"Strong meridians. A pity if they are wasted." He leaves a recipe for a tonic.','"经脉强健，荒废了可惜。"他留下一张补药方子。'),c:'good',fx:{maxHealth:3}},{w:2,t:T('"Weak lungs. Keep this child out of the cold." Your mother sews thicker clothes.','"肺气弱，别让孩子受凉。"母亲给你缝了厚衣裳。'),fx:{maxHealth:1}},{w:1,t:T('"Interesting." He says nothing else, and asks your name twice.','"有意思。"他再没多说，只问了你两遍名字。'),c:'muted',fx:{qi:1}}]});
I({id:'babyswallow',age:[3,8],cd:6,text:()=>T('Swallows build a nest above your bed.','燕子在你床头的梁上筑了窝。'),
 out:[{w:3,t:T('You watch the chicks every morning until they fly.','你每天早上都看小燕子，直到它们飞走。'),c:'good',fx:{happy:3}},{w:1,t:T('A chick falls out. You raise it in a shoe box. It lives.','一只雏燕掉了下来。你把它养在鞋盒里，它活了。'),c:'good',fx:{align:2,happy:3}}]});
I({id:'babyfestival',age:[2,8],cd:3,text:c=>T(`${c.intro.en}, your family takes you to the temple fair.`,`${c.intro.zh}，家里带你去赶庙会。`),
 out:[{w:2,t:T('You ride on a wooden horse and eat a whole skewer of candied hawthorns.','你骑了木马，吃了一整串糖葫芦。'),c:'good',fx:{happy:3}},{w:1,t:T('A monk gives you a red string for your wrist. "For a long life."','一位和尚在你手腕系了一根红绳。"保你长命。"'),fx:{lifespan:1}},{w:1,t:T('You see a stilt-walker fall and decide you will never trust tall people.','你看见一个踩高跷的摔了下来，从此觉得高个子都靠不住。'),c:'muted'},{w:1,t:T('A strongman lifts you over his head with one hand.','一个大力士单手把你举过了头顶。'),fx:{happy:2,skill:1}}]});
I({id:'babyclan',age:[4,7],once:1,when:s=>family(s).martial,text:()=>T('Your father puts a wooden sword in your hand and shows you the first stance.','父亲把一柄木剑塞进你手里，教你第一个架势。'),
 out:[{w:s=>s.t.root+s.t.wit,t:T('You hold it until your arms shake. He says nothing, but his eyes are pleased.','你一直举到胳膊发抖。父亲没说话，眼里却有笑意。'),c:'good',fx:{skill:3}},{w:6,t:T('You get bored and use it to knock down persimmons.','你玩腻了，拿它去打柿子。'),fx:{skill:1,happy:2}}]});
I({id:'babytemple',age:[3,8],cd:4,when:s=>family(s).id==='temple',text:()=>T('The monks let you strike the morning bell.','和尚们让你去撞晨钟。'),
 out:[{w:2,t:T('The whole valley hears it. You are proud for a week.','整个山谷都听见了。你得意了一个礼拜。'),c:'good',fx:{happy:3,qi:1}},{w:1,t:T('You swing too hard and fall off the platform.','你使劲太猛，从台子上摔了下来。'),fx:{hurt:[2,5],cause:T('a fall','摔伤')}},{w:1,t:T('An old monk teaches you to breathe with the bell.','一位老和尚教你跟着钟声吐纳。'),c:'good',fx:{qi:3}}]});
I({id:'babybeggar',age:[3,9],cd:4,when:s=>family(s).id==='beggar',text:()=>T('The old beggars teach you the songs that get the most coins.','老乞丐们教你唱最能讨到钱的莲花落。'),
 out:[{w:2,t:T('You sing so sweetly a rich lady gives you a whole silver tael.','你唱得太甜，一位阔太太给了你整整一两银子。'),c:'good',fx:{money:1,happy:3}},{w:2,t:T('You learn to read a face before it speaks.','你学会了看人脸色，不等对方开口就知道。'),fx:{smarts:2}},{w:1,t:T('A rival gang chases you off the bridge.','另一伙乞丐把你从桥上赶走了。'),c:'muted',fx:{happy:-2}}]});
I({id:'babyfisher',age:[4,9],cd:4,when:s=>region(s).id==='east'||region(s).id==='jiangnan',text:()=>T('You go out on the boat with the fishermen for the first time.','你第一次跟渔夫们出船。'),
 out:[{w:2,t:T('You are sick over the side all day, and love it anyway.','你吐了一整天，可还是喜欢。'),fx:{happy:2}},{w:2,t:T('You pull in a fish bigger than your arm.','你拉上来一条比你胳膊还长的鱼。'),c:'good',fx:{happy:4,skill:1}},{w:1,t:T('A squall comes up. The old fisherman ties you to the mast and sings.','起了风暴。老渔夫把你绑在桅杆上，自己唱起歌来。'),c:'muted',fx:{qi:1}}]});
I({id:'babysteppe',age:[4,9],cd:4,when:s=>region(s).id==='north'||region(s).id==='west',text:()=>T('You are put on a horse for the first time.','你第一次被扶上马背。'),
 out:[{w:2,t:T('You ride before you can read.','你还没识字，就先会骑马了。'),c:'good',fx:{skill:2,happy:2}},{w:1,t:T('The horse bolts. You hang on and are carried a mile across the grass.','马惊了。你死死抱住，被驮着在草原上跑了一里地。'),fx:{skill:1,happy:3}},{w:1,t:T('You fall and break your arm.','你摔下来，摔断了胳膊。'),c:'bad',fx:{hurt:[6,14],cause:T('a fall from a horse','坠马')}}]});
I({id:'babymiao',age:[4,9],cd:4,when:s=>region(s).id==='miao'||region(s).id==='shu',text:()=>T('An old woman shows you which mushrooms kill and which only make you see things.','一位老婆婆告诉你，哪些蘑菇吃了会死，哪些吃了只会见到幻象。'),
 out:[{w:2,t:T('You remember every one.','你一个不落全记住了。'),c:'good',fx:{smarts:3}},{w:1,t:T('You test one of the second kind. You see little men for an afternoon.','你偷尝了一个后一种。整个下午都看见小人儿在跳舞。'),c:'muted',fx:{happy:2}},{w:1,t:T('She also shows you a black beetle and tells you never to touch it.','她还指给你看一只黑甲虫，叮嘱你千万别碰。'),fx:{smarts:1}}]});
I({id:'babycapital',age:[4,9],cd:4,when:s=>region(s).id==='capital',text:()=>T('An imperial procession passes down your street.','皇家的仪仗从你家门前的街上经过。'),
 out:[{w:2,t:T('You kneel with everyone else and peek. You see a yellow sleeve.','你跟着大家跪下，偷偷抬眼，看见了一只明黄的袖子。'),fx:{happy:2}},{w:1,t:T('You do not kneel fast enough. A guard cuffs you.','你跪得慢了，挨了侍卫一巴掌。'),c:'bad',fx:{hurt:[1,4],cause:T('a guard','侍卫'),align:-1}},{w:1,t:T('A eunuch throws coins to the children. You catch three.','一个太监朝孩子们撒钱，你接住了三枚。'),c:'good',fx:{money:3}}]});

/* ---------- the years when nothing much happens, which should still feel like your years ---------- */
const QUIET2={
 child:[['You learned the names of all the stars your grandfather knew.','你记住了祖父认得的所有星星的名字。'],['You spent the year asking to be taller.','你这一年都在盼着长高。'],['You and the neighbour’s children dug a "secret tunnel". It was a hole.','你和邻居家孩子挖了一条"秘道"，其实就是个坑。'],
  ['You learned to whistle through your fingers.','你学会了用手指吹口哨。'],['You were sick for a month and read every book in the house.','你病了一个月，把家里的书都翻遍了。'],['You fed a stray cat until it decided it lived with you.','你喂一只野猫，喂到它认定这里是自己家。'],
  ['You flew a paper kite higher than anyone in the village.','你放的纸鸢比村里谁都高。'],['You watched the blacksmith for hours, every day.','你天天在铁匠铺门口一看就是几个时辰。'],['You learned a dirty song and sang it at dinner.','你学会了一首荤曲儿，还在饭桌上唱了出来。'],
  ['You helped with the harvest and were paid in sweet potatoes.','你帮着收庄稼，工钱是几个红薯。'],['You collected cicada shells and sold them to the herbalist.','你捡蝉蜕卖给了药铺。'],['You learned to tie seven kinds of knot.','你学会了打七种绳结。'],
  ['You spent the winter by the stove, listening to the grown-ups gossip.','你整个冬天都守在炉子边，听大人们说闲话。'],['You were sure there was a dragon in the river. You watched for it all summer.','你认定河里有条龙，守了整整一个夏天。'],['You fell in love with the sound of the erhu.','你迷上了二胡的声音。'],
  ['You copied characters in sand with a stick until your letters were neat.','你用树枝在沙地上练字，直到写得工工整整。'],['You learned to swim like a frog, then like a fish.','你先学会了狗刨，后来游得像条鱼。'],['You had nightmares about a man with no face.','你做噩梦，梦见一个没有脸的人。'],
  ['You learned to carry water without spilling a drop.','你学会了挑水，一滴不洒。'],['You and your friends played at being heroes of the Water Margin all year.','你和伙伴们演了一整年的梁山好汉。']],
 teen:[['You grew a hand’s breadth this year.','你今年长高了一大截。'],['You spent the year arguing with your parents about everything.','这一年你和爹娘什么都吵。'],['You had a secret place on the hill where you went to think.','你在山坡上有个秘密的地方，常去发呆。'],
  ['Your voice changed, embarrassingly.','你变声了，很难为情。'],['You read the same martial novel four times.','同一本武侠话本，你看了四遍。'],['You walked to the next town and back just to see it.','你走到邻镇再走回来，只为看一眼。'],
  ['You learned to drink tea properly, and to pretend you liked it bitter.','你学会了正经喝茶，也学会了假装喜欢苦味。'],['You practised a kick in the yard every evening until it was clean.','你每天傍晚在院里练一个踢腿，直到干净利落。'],['You fell out with your best friend over nothing, and made up over less.','你和最好的朋友为一点小事闹翻了，又为更小的事和好了。'],
  ['You took on more work around the house and found you did not mind it.','你分担了更多家务，发现自己并不讨厌。'],['You spent a lot of the year staring at the moon.','这一年你常常对着月亮发呆。'],['You learned to cook rice without burning it.','你学会了焖饭不糊锅。'],
  ['You copied out a whole book of poems in your best hand.','你用最好的字抄完了一整本诗集。'],['You began to notice how the adults lie to each other.','你开始察觉大人们是怎样彼此说谎的。'],['You swore an oath of brotherhood with two friends over a cup of water.','你和两个朋友以水代酒，结拜为兄弟。']],
 adult:[['The year went by in work and small pleasures.','这一年在劳作和小小的快乐中过去了。'],['You took in an old dog nobody wanted.','你收留了一条没人要的老狗。'],['You made peace with an old rival over a bowl of noodles.','你和一个老对头吃了碗面，算是和解了。'],
  ['A long dry summer. You carried water every evening.','漫长干旱的夏天，你每晚都去挑水。'],['You learned a new craft, just for the pleasure of it.','你学了一门新手艺，纯粹图个乐。'],['You spent the winter mending everything that was broken.','你花了一个冬天把坏了的东西都修好。'],
  ['You sat with a dying neighbour through their last nights.','邻居临终前的几个夜晚，你一直陪着。'],['You gave up wine for a year, mostly.','你戒了一年酒，大体上算是戒了。'],['You started keeping a diary, and stopped in the third month.','你开始写日记，写到第三个月就停了。'],
  ['You visited your parents’ graves and told them how things were going.','你去爹娘坟前，跟他们说了说近况。'],['A good harvest. Prices fell. Everyone grumbled anyway.','丰年，粮价跌了，大家照样发牢骚。'],['You walked to a famous temple on a pilgrimage and came back with sore feet.','你徒步去名寺进香，回来时脚都磨破了。'],
  ['You spent more time with your friends than you have in years.','这是好些年来你和朋友们待在一起最多的一年。'],['A flood came up to the doorstep and went away again.','大水漫到了门槛，又退了。'],['You found a grey hair and pulled it out.','你发现了一根白头发，把它拔了。'],
  ['You copied out a sutra for a sick friend. They got better.','你为生病的朋友抄了一卷经，朋友后来好了。'],['You learned the names of the birds that come to your window.','你认全了来窗前的那些鸟。'],['Taxes went up again. You tightened your belt.','赋税又涨了，你勒紧了裤腰带。'],
  ['You grew vegetables and gave most of them away.','你种了菜，大半都送了人。'],['Rumours of war came and went. Nothing happened here.','打仗的风声来了又走，这里什么也没发生。']],
 old:[['Your knees told you about the weather before it came.','天还没变，你的膝盖就先知道了。'],['You sat in the sun most afternoons, and found it enough.','你多半个下午都坐着晒太阳，觉得这样就够了。'],['Children came to hear your stories of the jianghu. You exaggerated, a little.','孩子们来听你讲江湖往事。你稍稍夸大了一点。'],
  ['You outlived another old friend this year.','这一年，又一位老朋友走在了你前头。'],['You started to forget names, but never faces.','你开始记不住名字，可脸从来不忘。'],['You planted a tree you will never see grow tall.','你种下一棵树，明知看不到它长高。'],
  ['You gave away things you no longer needed, one at a time.','你把用不着的东西一件件送了人。'],['You slept less and remembered more.','你睡得少了，想起的事却多了。'],['A grandchild climbed into your lap and fell asleep.','一个孙辈爬进你怀里睡着了。'],
  ['You wrote down a few things you wanted remembered.','你写下了几件希望后人记住的事。'],['You made your own coffin, carefully, of good wood.','你用好木料，仔细地给自己做了一口寿材。'],['A winter cough lasted until spring.','一场冬咳拖到了开春。'],
  ['You went back to the place you were born. It was smaller than you remembered.','你回了一趟出生的地方。比记忆里小多了。'],['You forgave someone you had sworn never to forgive.','你原谅了一个曾发誓永不原谅的人。'],['You played chess in the square every day and lost gracefully.','你天天在广场上下棋，输得心平气和。']]
};
/* replaces the plain quiet year: the right kind of nothing for your age */
quietYear=function(s){
  const a=s.age,pool=a<13?QUIET.child.concat(QUIET2.child):a<18?QUIET2.teen:a<60?QUIET.adult.concat(QUIET2.adult):QUIET2.old.concat(QUIET.adult.slice(3,9));
  const q=pick(pool);say(s,q[0],q[1],'muted');
};
