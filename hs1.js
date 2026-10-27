/* 江湖一生 · 相处 scenes: parents and grandparents */
'use strict';
const E='elder',ISM=(s,p)=>p.rel==='mother',ISF=(s,p)=>p.rel==='father',ISG=(s,p)=>p.rel==='grandparent';
/* spring */
hs(E,SP,'You help {n} plant the vegetable patch. {He} redoes every row you plant.','你帮{n}种菜。你种的每一垄，{ta}都重新种了一遍。',['You plant like you fight. Too fast.','你种菜跟你打架一样，太急。']);
hs(E,SP,'{n} takes you to sweep the family graves for Qingming. {He} tells you who each one was.','清明，{n}带你去扫墓，一座一座告诉你埋的是谁。',['Remember them. One day someone will have to remember me.','记着他们。总有一天，也得有人记着我。'],{b:[5,9]});
hs(E,and(SP,ISM),'{n} is airing the winter quilts in the yard and makes you beat them with a stick.','{n}在院里晒冬被，硬让你拿棍子拍灰。',['Harder. You hit people harder than that, I’ve heard.','使点劲。听说你打人可比这狠。']);
hs(E,and(SP,ISF),'{n} wants to fix the roof before the rains. You hold the ladder and get rained on anyway.','{n}要赶在雨季前修屋顶。你扶着梯子，还是被淋了一身。');
hs(E,SP,'The first bamboo shoots are up. {n} digs a basket of them and cooks them three ways.','头茬春笋冒出来了。{n}挖了一篮，做了三样菜。',['Eat. You look like you live on wind.','吃。你瘦得像是喝西北风过日子的。'],{happy:3});
hs(E,and(SP,OLD),'{n} wants to see the peach blossom one more time. You carry {him} halfway up the hill.','{n}说想再看一回桃花。你背着{ta}上了半山。',null,{b:[6,10],happy:3});
/* summer */
hs(E,SU,'You and {n} sit under the eaves eating cold melon while it storms.','暴雨天，你和{n}坐在屋檐下吃凉瓜。',['Someone came to propose to me in weather like this once. Fool.','当年也有人冒着这样的雨上门提亲。傻子。']);
hs(E,SU,'{n} fans you to sleep like {he} did when you were small. You pretend not to notice.','{n}拿着蒲扇给你扇风，就像你小时候那样。你装作没察觉。',null,{b:[5,9],happy:3});
hs(E,and(SU,ISF),'You take {n} fishing at dawn. {He} catches three and you catch a cold.','天不亮你就陪{n}去钓鱼。{ta}钓了三条，你钓了一场伤风。',['Patience. That is all fishing is. That is all anything is.','耐心。钓鱼就这么点学问，什么事都是这么点学问。']);
hs(E,and(SU,ISM),'{n} is pickling vegetables for the winter. You chop until your hands smell of garlic for days.','{n}在腌冬天吃的菜。你切到手上的蒜味好几天都没散。');
hs(E,SU,'Mosquitoes all night. {n} burns mugwort and tells you ghost stories you have heard a hundred times.','蚊子闹了一夜。{n}点了艾草，又讲起你听过一百遍的鬼故事。',null,{happy:3});
/* autumn */
hs(E,AU,'Harvest. You and {n} work the threshing floor until the stars are out.','秋收。你和{n}在打谷场上干到星星都出来了。',['You still remember how. Good.','手艺还没丢。好。'],{money:[2,8]});
hs(E,AU,'Mid-Autumn. {n} sets out mooncakes and a cup for everyone who is not here.','中秋。{n}摆上月饼，又给不在的人一人斟了一杯。',null,{b:[5,10]});
hs(E,and(AU,ISM),'{n} is mending your old clothes without being asked. You find coins sewn into the hem later.','{n}没等你开口就把你的旧衣裳补好了。后来你在衣角里摸出了缝进去的铜钱。',null,{b:[6,9],money:[5,20]});
hs(E,AU,'You climb the hill with {n} for the Double Ninth. {He} stops to rest more than last year.','重阳，你陪{n}登高。{ta}这回歇的次数比去年多。',null,{b:[5,8]});
hs(E,and(AU,OLD),'{n} gives away {his} chrysanthemums to the neighbours, one pot each, and saves the best for you.','{n}把菊花分给左邻右舍，一家一盆，最好的那盆留给了你。');
/* winter */
hs(E,WI,'Snow. {n} warms wine on the brazier and makes you tell {him} everything. Everything.','下雪了。{n}在炭盆上温着酒，非要你把这些年的事从头讲一遍。',['And then? And then what?','然后呢？然后怎么样了？'],{b:[6,10]});
hs(E,WI,'You and {n} make dumplings for the New Year. {His} are perfect. Yours look like wounded animals.','过年包饺子。{n}包的个个周正，你包的像受了伤的小动物。',null,{happy:4});
hs(E,and(WI,ISF),'{n} wants to write the New Year couplets. {He} makes you grind the ink and criticises your calligraphy.','{n}要写春联，让你磨墨，顺便把你的字批评了一顿。',['Your strokes have no bones. Like your excuses.','你的字没骨头，跟你找的借口一样。'],{smarts:1});
hs(E,WI,'Winter solstice. {n} sits up with you all night, the way the old customs say.','冬至。{n}照老规矩，陪你守了一夜。');
hs(E,and(WI,OLD),'{n}’s joints hurt in the cold. You rub them with warm oil while {he} grumbles.','天一冷，{n}的关节就疼。你给{ta}抹热油揉着，{ta}一边嘟囔。',null,{b:[6,9]});
/* how your life stands */
hs(E,FAM,'Neighbours you have never met keep dropping by to look at you. {n} pretends to be annoyed and is delighted.','不认识的街坊一个接一个上门来看你。{n}嘴上嫌烦，心里乐开了花。',['My child. Yes, that one. Yes.','我家的。对，就是那个。对。'],{happy:3});
hs(E,FAM,'{n} has kept every story told about you in the teahouses, written down by a paid scribe.','{n}花钱请人把茶馆里说你的书一段一段都抄了下来，存着。',null,{b:[6,9]});
hs(E,ALI,'{n} refuses to call you “{a}”. {He} uses your milk name instead, loudly, in front of everyone.','{n}偏不叫你「{a}」，当着众人的面大声喊你的小名。',null,{happy:3});
hs(E,WNT,'Constables came asking about you. {n} told them you died years ago and cried convincingly.','捕快上门打听你。{n}说你早几年就死了，还哭得像真的一样。',['I have had practice worrying.','担心你担心惯了，哭得出来。'],{b:[6,10]});
hs(E,WNT,'{n} has packed a bag for you and hidden it by the back door. Just in case.','{n}收拾了一个包袱，藏在后门边上。以防万一。',null,{b:[5,9]});
hs(E,RICH,'You offer {n} a bigger house. {He} refuses and asks for a new kettle instead.','你要给{n}换个大宅子。{ta}不要，只要一把新水壶。',['What would I do with more rooms? Lose you in them?','房子再大有什么用？好让你在里头躲着我？'],{money:-15});
hs(E,RICH,'{n} worries your silver came from somewhere bad. You spend the evening explaining.','{n}担心你的银子来路不正。你解释了一晚上。',null,{b:[2,5]});
hs(E,POOR,'{n} quietly slips you a few strings of cash and will not hear a word about it.','{n}悄悄塞给你几串钱，一句推辞都不让你说。',['I am your parent. It is my job until I die.','我是你爹娘。这是我的事，到死都是。'],{money:[20,60],b:[5,8]});
hs(E,POOR,'There is only rice and pickles. {n} serves it like a feast and you eat it like one.','家里只有米饭和咸菜。{n}端上来像摆宴席，你吃得也像赴宴。');
hs(E,HURT,'{n} sees your wound and goes white. Then {he} goes for the herbal man without a word.','{n}看见你的伤，脸都白了，二话不说就去请郎中。',['Sit. Do not argue with me.','坐着。别跟我争。'],{heal:[5,10],b:[5,9]});
hs(E,HURT,'{n} makes the bone soup from your childhood and watches you drink it all.','{n}熬了你小时候喝的那种骨头汤，盯着你喝完。',null,{heal:[3,8]});
hs(E,OFF,'{n} keeps your seal of office on the family altar, which is not where it goes.','{n}把你的官印供在了自家神龛上，那可不是放官印的地方。',null,{happy:3});
hs(E,OFF,'{n} asks you to settle a dispute with the neighbours over a chicken. You are, after all, an official.','{n}为一只鸡跟邻居吵起来，非要你这个当官的来断。',null,{happy:2});
hs(E,ORG,'{n} visits your house and inspects your people like a general. Two of them are terrified.','{n}来你的门户转了一圈，跟检阅兵马似的，吓坏了两个弟子。',['That one does not eat enough. Feed him.','那个孩子吃得太少。多给他吃点。']);
hs(E,MAR,'{n} takes your spouse aside and tells {him} every embarrassing thing you did as a child.','{n}把你的另一半拉到一边，把你小时候的糗事全抖了出来。',null,{happy:3});
hs(E,KIDS,'{n} spoils your children rotten and blames you when they misbehave.','{n}把你的孩子宠上了天，孩子一淘气，又怪到你头上。',['You were worse.','你小时候更不像话。'],{happy:3});
hs(E,and(KIDS,OLD),'{n} teaches your child the song {he} sang to you. You had forgotten every word.','{n}教你的孩子唱当年哄你睡觉的那支歌。你一句都不记得了。',null,{b:[6,10]});
hs(E,EVIL,'{n} has heard what people say about you. {He} asks you straight out if it is true.','{n}听说了外头怎么议论你，直截了当地问你是不是真的。',['Look at me when you answer.','回答的时候，看着我。'],{b:[-2,4]});
hs(E,GOOD,'A stranger brings {n} a gift to thank you for something you did. {n} weeps a little.','一个陌生人提着礼物上门，说是谢你当年的恩情。{n}眼圈都红了。',null,{b:[5,9]});
hs(E,STRONG,'{n} asks you to show {him} what you can do. You split a log with one palm. {He} asks you to do the rest of the woodpile.','{n}要看看你的本事。你一掌劈开了一根木头。{ta}说，那正好，把那堆柴都劈了吧。',null,{happy:3});
hs(E,OLDME,'You are both grey now. {n} still reaches over to straighten your collar.','你们都白了头。{n}还是伸手过来，替你理了理衣领。',null,{b:[6,10]});
hs(E,UNK,'{n} asks when you will make something of yourself. {He} asks gently, which is worse.','{n}问你什么时候能有点出息。问得很温和，反倒更扎心。',null,{b:[1,4],happy:-1});
/* the people they are */
hs(E,OLD,'{n} forgets your name for a moment, then remembers, and laughs it off. You do not laugh.','{n}一时想不起你的名字，过了会儿想起来了，笑着岔过去。你笑不出来。',null,{b:[5,9],happy:-2});
hs(E,OLD,'{n} wants to talk about what should happen after {he} dies. You keep changing the subject. {He} keeps changing it back.','{n}想说说身后事。你一次次岔开，{ta}一次次又拉回来。',['Listen to me while I can still make you.','趁我还管得了你，好好听着。'],{b:[5,9]});
hs(E,OLD,'{n} shows you where the family deeds and the good silver are hidden. Twice, to be sure.','{n}领你看了地契和压箱底的银子藏在哪儿，还领了两遍，生怕你记不住。');
hs(E,ISG,'{n} tells you about the famine year, when {he} was your age, and what {he} ate. You eat everything on your plate after.','{n}讲起{ta}像你这么大时的荒年，吃过什么。之后你把碗里的饭吃得干干净净。');
hs(E,ISG,'{n} slips you sweets as if you were still six. You eat them as if you still were.','{n}偷偷塞给你糖，好像你还是六岁。你也像六岁那样吃了。',null,{happy:3});
hs(E,ISF,'{n} takes out an old sword from under the bed. {He} was in the jianghu once, it turns out, for about a month.','{n}从床底下抽出一把旧剑。原来{ta}也闯过江湖，闯了大约一个月。',['I ran home. Best decision I ever made. Second best.','我跑回家了。这辈子最对的决定。第二对的。'],{happy:3});
hs(E,ISF,'You and {n} drink in silence. It is the longest talk you have had in years.','你和{n}对坐喝酒，谁也不说话。这是你们这些年说得最多的一回。',null,{b:[6,10]});
hs(E,ISF,'{n} wants your opinion on a business deal. {He} does the opposite of what you say. It works.','{n}问你一桩买卖该不该做。{ta}照你说的反着做了，结果还成了。',null,{happy:2});
hs(E,ISM,'{n} has made you new shoes, again, in the size you were ten years ago.','{n}又给你做了双新鞋，是你十年前的尺码。',['Your feet were always growing. I could never keep up.','你的脚老是长，我总也赶不上。'],{b:[5,9]});
hs(E,ISM,'{n} reads your fortune in tea leaves and does not like what {he} sees. {He} reads them again until {he} does.','{n}拿茶叶给你算命，不喜欢算出来的结果，就一遍遍重算，直到满意为止。',null,{happy:3});
hs(E,ISM,'{n} braids your hair the way {he} did before your first day of school. Neither of you mentions it.','{n}照你头一回上学那天的样子给你梳了头。你们谁都没提。',null,{b:[6,9]});
hs(E,CLOSE,'You tell {n} something you have never told anyone. {He} just nods, as if {he} always knew.','你把一件从没对人说过的事告诉了{n}。{ta}只是点点头，好像早就知道。',null,{b:[6,10],happy:3});
hs(E,COOL,'The old argument comes up again. This time, for once, you both stop before it turns ugly.','那件老事又被提起来了。这一回，两人难得都在吵起来之前住了口。',null,{b:[4,8]});
hs(E,COOL,'{n} is stiff with you all day. At the gate {he} says, too quietly, to come back soon.','{n}一整天都对你冷冷的。送到门口，才小声说了句，早点回来。',null,{b:[4,8]});
hs(E,null,'You repair the fence with {n}. {He} tells you about every fence {he} has ever repaired.','你陪{n}修篱笆。{ta}把这辈子修过的每一道篱笆都讲了一遍。');
hs(E,null,'{n} takes you to the market and introduces you to every stall holder, by your childhood name.','{n}领你去赶集，逢摊就介绍，用的还是你的小名。',null,{happy:2});
hs(E,null,'{n} cooks your favourite dish, the one from when you were nine. It still is.','{n}做了你九岁时最爱吃的那道菜。现在也还是最爱。',null,{happy:3});
hs(E,null,'You read the almanac to {n}, whose eyes are going. {He} argues with every prediction.','{n}眼睛不好了，你念黄历给{ta}听。{ta}每一条都要跟黄历抬杠。');
hs(E,null,'{n} walks you to the edge of the village when you leave, and further, and further.','你走的时候，{n}送你到村口，又送了一程，又送了一程。',null,{b:[5,9]});
