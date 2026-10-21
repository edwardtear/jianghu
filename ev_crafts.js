/* 江湖一生 · livelihoods, crafts, arts and pleasures: the parts of life that are not fighting.
   Kitchens and contests, brushes and forgeries, opera and poetry, medicine, tea and wine, dice, guilds and caravans. */
'use strict';
const CR_T=['town'],CR_W=['wander'];
const crP=s=>s.world&&s.world.p?s.world.p:1;
const crReg=s=>region(s)||{en:'these parts',cn:'此地'};
const crJob=(s,...j)=>j.includes(s.job);
const crBiz=s=>owned(s,'biz').length;

/* ================= small ================= */

/* 1. noodle contest at the fair */
I({id:'cr_noodle',age:[14,70],cd:8,w:1.1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(40,60)});return c},
 text:c=>T(`At the temple fair, ${c.npc.en}’s noodle shop holds a contest: whoever pulls the thinnest noodles before one stick of incense burns down wins 30 taels. Entry is 5.`,`庙会上，${c.npc.zh}的面馆摆擂：一炷香之内，谁拉的面最细，赏银三十两。报名费五两。`),
 opts:[{l:T('Enter (5 taels)','报名（五两）'),cost:5,out:[
   {w:s=>s.smarts/40+s.t.luck*.15+(crJob(s,'cook')?3:0),t:T('Your noodles come out fine as silk thread. The judge holds one up to the light and the crowd roars.','你的面拉得细如丝线。评判挑起一根对着日头看，围观的人一片叫好。'),c:'good',fx:{money:30,fame:1,happy:4}},
   {w:2,t:T('The dough fights you, then snaps. A child shouts that your noodles look like a broken rope. Everyone agrees.','面团跟你较劲，最后啪地断了。一个孩子大喊你的面像断了的麻绳，大伙儿都觉得很像。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.looks/50,t:T('Your noodles are as thick as chopsticks, but the owner’s old mother likes your face and gives you a free bowl anyway.','你的面粗得像筷子，可掌柜的老娘看你顺眼，还是白送了你一大碗。'),c:'muted',fx:{happy:3}}]},
  {l:T('Just eat and watch','只吃面看热闹'),out:[
   {w:2,t:T('A big bowl with chili oil, and a good show. Worth the walk.','一大碗红油面，一场好热闹，没白来。'),c:'good',fx:{happy:3,money:-1}},
   {w:s=>s.smarts/40,t:T('You notice the winner puts lye water in his dough. You file the trick away.','你注意到夺魁的那人往面里兑了碱水。这一招你记下了。'),c:'muted',fx:{smarts:1,happy:1}}]}]});

/* 2. a signboard */
I({id:'cr_signboard',age:[16,85],cd:10,w:1,tags:CR_T,when:s=>s.smarts>=35,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([17,26,5]),age:rint(30,55)});return c},
 text:c=>T(`${c.npc.en} is opening a shop and has heard you write a decent hand. ${c.npc.He} offers 10 taels for the signboard.`,`${c.npc.zh}要开张新铺子，听说你字写得不错，出十两银子请你题块招牌。`),
 opts:[{l:T('Write it in your best hand','用心写好'),out:[
   {w:s=>s.smarts/25,t:T('Big, calm characters. Passers-by stop to look. The owner pays fifteen instead of ten.','字大而稳，路人都停下来看。东家给了十五两，不是十两。'),c:'good',fx:{money:15,fame:1}},
   {w:1.5,t:T('A passing scholar points out, very loudly, that one stroke is wrong. The owner pays five and looks at you sadly.','一个路过的书生大声指出有一笔写错了。东家只给了五两，眼神很是哀怨。'),c:'muted',fx:{money:5,happy:-3}},
   {w:s=>s.t.luck*.12,t:T('The shop does so well that people call your sign lucky. Every New Year the owner sends you a gift.','铺子生意好得出奇，人人说是招牌旺。此后每逢过年，东家都给你送礼。'),c:'gold',fx:{money:25,happy:3,fame:1}}]},
  {l:T('Write something witty','写得俏皮些'),out:[
   {w:s=>s.smarts/30,t:T('You add a pun on the owner’s name. The whole street repeats it, and the shop is full for a month.','你在招牌里藏了东家名字的谐音。整条街都在念叨，铺子热闹了一个月。'),c:'good',fx:{money:10,fame:2}},
   {w:1.5,t:T('The pun is ruder than you meant. The owner takes the board down and does not pay.','这谐音比你想的要粗俗。东家把招牌摘了，一文钱没给。'),c:'bad',fx:{happy:-2}}]}]});

/* 3. poetry gathering */
I({id:'cr_poetry',age:[16,75],cd:8,w:1,tags:CR_T,when:s=>s.smarts>=40,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(60,72),sex:'m'});c.theme=pick([['willows','柳'],['the moon on water','水中月'],['a cold plum tree','寒梅'],['autumn geese','秋雁']]);return c},
 text:c=>T(`A retired official, ${c.npc.en}, hosts a poetry gathering at a lakeside pavilion. Today’s theme: ${c.theme[0]}. Wine goes round; brushes are wet.`,`告老还乡的${c.npc.zh}在湖边亭子里办诗会，今日以“${c.theme[1]}”为题。酒过三巡，笔已蘸墨。`),
 opts:[{l:T('Compose a serious verse','认真作一首'),out:[
   {w:s=>s.smarts/20,t:T('Your last line makes the old man put his cup down. Your poem is copied out and passed around the county.','你的末句让老先生放下了酒杯。这首诗被人抄了去，在县里传开了。'),c:'good',fx:{fame:2,smarts:1,happy:4}},
   {w:2,t:T('A decent poem. Nobody remembers it by evening. The host’s nephew wins with something about his own sleeves.','诗还过得去，到傍晚就没人记得了。东道主的侄子凭一首咏自己袖子的诗拔了头筹。'),c:'muted',fx:{happy:-1}},
   {w:s=>s.looks/45,t:T('The poem is middling, but the young ladies behind the screen copy it out anyway. Possibly not for the words.','诗写得平平，屏风后的小姐们却都抄了一份。恐怕不是为了诗。'),c:'muted',fx:{fame:1,happy:3}}]},
  {l:T('Pass off a half-forgotten poem as yours','拿一首半生不熟的古诗充数'),out:[
   {w:s=>s.smarts/40,t:T('Nobody catches it. You feel clever, and a little dirty.','没人发现。你觉得自己挺机灵，又有点不干净。'),c:'muted',fx:{fame:1,align:-2}},
   {w:1.5,t:T('An old man at the back finishes the poem for you, aloud, from memory, and names the dead poet who wrote it.','后排一位老者替你把整首诗背完了，还报出了作者的名字。那人已经死了两百年。'),c:'bad',fx:{fame:-1,happy:-5}}]},
  {l:T('Just drink','只喝酒'),out:[
   {w:2,t:T('Good wine, bad poems, a soft wind off the lake.','好酒，烂诗，湖上一阵软风。'),c:'good',fx:{happy:3}},
   {w:s=>s.t.luck*.2,t:c=>T(`You end up arguing about rhymes with a shabby young scholar until dawn. ${c.npc.en} says you two deserve each other.`,`你和一个穷书生为韵脚争到天亮。${c.npc.zh}说你们俩真是一对活宝。`),c:'good',fx:{happy:3,smarts:1,f:s=>{const c2={npc:npc(s,{occ:1,age:rint(18,30)})};storeNpc(s,c2,'acq',50)}}}]}]});

/* 4. a storyteller wants your story */
I({id:'cr_teller',age:[25,90],cd:15,w:1,tags:CR_T,when:s=>s.fame>=8,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(50,70),sex:'m'});return c},
 text:c=>T(`A travelling storyteller, ${c.npc.en}, buys you tea. He has heard of you. He wants your life story for his act: "Every teahouse from here to the coast will know your name."`,`游走四方的说书先生${c.npc.zh}请你喝茶。他听说过你，想把你的生平编成书段子：“从这儿到海边，每家茶馆都会知道你的名字。”`),
 opts:[{l:T('Tell it straight','照实说'),out:[
   {w:s=>s.t.heart*.3,t:T('You tell it plainly, the good and the shameful. When he performs it, the listeners go quiet. Some cry.','你平平实实地说了，好的丑的都说了。他开讲那天，台下鸦雀无声，有人抹眼泪。'),c:'good',fx:{fame:2,happy:3}},
   {w:1.5,t:T('Your life, told straight, is a bit dull. He adds a dragon and two princesses. It sells.','照实讲，你这辈子有点平淡。他给你添了一条龙、两位公主。书倒是卖得动。'),c:'muted',fx:{fame:1}}]},
  {l:T('Embellish freely','添油加醋'),out:[
   {w:s=>1+s.fame/40,t:T('In his version you killed nine bandits with a chopstick. Teahouse crowds love it. You become a little bit of a legend.','在他嘴里，你拿一根筷子杀了九个山贼。茶客们爱听极了，你也算成了半个传说。'),c:'gold',fx:{fame:4,happy:2}},
   {w:1.5,t:T('Now every drunk in the county wants to test the hero who killed nine bandits with a chopstick.','这下全县的醉汉都想来会会“筷子杀九贼”的大英雄。'),c:'bad',fx:{fame:2,happy:-3,hurt:[2,8],cause:T('a drunk who believed the story','信了书段子的醉汉')}}]},
  {l:T('Make him pay for it','要他付钱'),out:[
   {w:s=>s.smarts/40,t:T('You haggle like a fishwife. He pays 20 taels and calls you a bandit.','你像鱼市大婶一样跟他砍价。他付了二十两，骂你是土匪。'),c:'good',fx:{money:20}},
   {w:1.5,t:T('He shrugs and tells your story anyway, for free, getting everything wrong.','他耸耸肩，照样去讲了，分文不给，还全讲错了。'),c:'muted',fx:{fame:1,happy:-2}}]}]});

/* 5. the fishing village */
I({id:'cr_fishing',age:[12,65],cd:8,w:s=>['east','jiangnan'].includes(s.region)?1.5:.7,tags:CR_W,ctx:s=>{const c=scene();c.npc=npc(s,{occ:16,age:rint(45,65)});return c},
 text:c=>T(`In a fishing village, the boats go out before dawn. An old fisherman, ${c.npc.en}, offers you a place on his boat if you will haul nets.`,`渔村里，天不亮船就出海了。老渔夫${c.npc.zh}说，你肯拉网，就让你上他的船。`),
 opts:[{l:T('Go out with the boats','跟船出海'),out:[
   {w:s=>2+s.t.luck*.2,t:T('Silver fish by the basket. Your share is 8 taels and a fish stew you will remember for years.','银鱼成筐。你分了八两，还有一锅让你记好几年的鱼汤。'),c:'good',fx:{money:8,happy:4}},
   {w:1,t:T('A squall catches you a mile out. You bail water until your arms stop working. Everyone gets home, barely.','离岸一里遇上了狂风。你舀水舀到胳膊都抬不起来。总算人人都回来了。'),c:'bad',fx:{hurt:[3,8],cause:T('a squall at sea','海上狂风'),happy:-2}},
   {w:s=>s.t.luck*.1,t:T('The net drags up a crusted bronze box from an old wreck. Inside: coins nobody has used for a hundred years. The old man insists you split it.','网拖上来一只长满锈的铜匣子，是沉船里的。里面是百年前的老钱。老渔夫坚持和你对半分。'),c:'gold',fx:{money:[30,80],happy:5}}]},
  {l:T('Stay ashore and mend nets','留在岸上补网'),out:[
   {w:2,t:T('The women mending nets know everything: who is cheating whom, and where the pirates drink. Free education.','补网的大婶们什么都知道：谁骗了谁，海盗在哪儿喝酒。白听了一肚子学问。'),c:'muted',fx:{smarts:1,happy:2}},
   {w:s=>s.looks/45,t:T('By noon three of them are trying to marry you to a niece. You escape with dried fish and no fiancé.','不到晌午，三位大婶都要把侄女说给你。你带着一包鱼干逃了，没定亲。'),c:'good',fx:{happy:3}}]}]});

/* 6. a blind tea tasting */
I({id:'cr_tea',age:[16,85],cd:8,w:s=>['jiangnan','shu'].includes(s.region)?1.4:.8,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(40,65)});return c},
 text:(c,s)=>T(`A teahouse in ${crReg(s).en} holds a blind tasting: five cups, five teas. Name them all and ${c.npc.en} gives you a tin of the best leaf in the house.`,`${crReg(s).cn}一家茶楼办斗茶：五只杯，五样茶。全都说中的，${c.npc.zh}送一罐店里最好的茶叶。`),
 opts:[{l:T('Take the challenge','应战'),out:[
   {w:s=>s.smarts/30+(['jiangnan','shu'].includes(s.region)?1:0),t:T('Green, smoked, pressed, flower, and one picked by monkeys on a cliff. You get all five. The tin is worth twenty taels.','绿茶、烟熏、紧压、花茶，还有一杯是崖上猴子采的。你五样全中，那罐茶叶值二十两。'),c:'good',fx:{money:20,fame:1,happy:3}},
   {w:2,t:T('You call the cheapest tea the most expensive one, with great confidence. The room enjoys it more than you do.','你满怀信心地把最便宜的茶说成了最贵的。满屋子人比你开心多了。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.t.luck*.12,t:c=>T(`You get every cup wrong, so wrongly and so cheerfully that ${c.npc.en} gives you the tin anyway, for the entertainment.`,`你五杯全错，错得理直气壮、兴高采烈。${c.npc.zh}看得高兴，照样把茶给了你。`),c:'good',fx:{money:10,happy:4}}]},
  {l:T('Just drink tea and listen','喝茶听人斗'),out:[
   {w:2,t:T('You learn there are eleven ways to describe the smell of wet stone.','你学到了，湿石头的味道有十一种说法。'),c:'muted',fx:{smarts:1,happy:1}},
   {w:s=>s.t.luck*.15,t:T('The tea master notices you watching and quietly pours you the best cup of the day.','茶博士看你看得认真，悄悄给你斟了今日最好的一杯。'),c:'good',fx:{happy:4}}]}]});

/* 7. the pear crop */
I({id:'cr_orchard',age:[18,80],cd:10,w:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(60,75)});return c},
 text:c=>T(`Your neighbour ${c.npc.en} is too old to pick his pears this year. He offers you the whole crop, still on the trees, for 30 taels.`,`邻居${c.npc.zh}年纪大了，今年的梨摘不动了。他说整园梨连树上的果子，三十两包给你。`),
 opts:[{l:T('Buy the crop (30 taels)','包下（三十两）'),cost:30,out:[
   {w:s=>(s.world?s.world.h+2:2)*.7+s.t.luck*.1,t:T('A fat year. You sell pears from a cart for weeks and clear a good profit.','好年景。你推着车卖了好几个礼拜的梨，赚了一笔。'),c:'good',fx:s=>({money:Math.round(65*crP(s)),happy:3})},
   {w:s=>(2-(s.world?s.world.h:0))*.5+.4,t:T('Hail in early summer, worms in late summer. You sell what is left for pig feed.','初夏一场冰雹，夏末一场虫灾。剩下的梨只能卖去喂猪。'),c:'bad',fx:{money:10,happy:-3}},
   {w:s=>s.smarts/50,t:T('You boil the bruised ones into pear syrup and sell it to apothecaries for coughs. It earns more than the good fruit.','你把磕坏的梨熬成梨膏，卖给药铺治咳嗽，比好梨还赚钱。'),c:'gold',fx:s=>({money:Math.round(90*crP(s)),smarts:1})}]},
  {l:T('Help him pick, for a share','帮他摘，分一份'),out:[
   {w:s=>s.t.heart*.3,t:c=>T(`Three days up ladders. ${c.npc.en} gives you a cart of pears and tells everyone you are a decent sort.`,`在梯子上爬了三天。${c.npc.zh}送了你一车梨，逢人便夸你厚道。`),c:'good',fx:{money:8,happy:3,align:2}},
   {w:1,t:T('You fall off the ladder on the second day. The pears are excellent; your back is not.','第二天你从梯子上摔了下来。梨很甜，腰不太行。'),c:'muted',fx:{hurt:[2,6],cause:T('a fall from a pear tree','从梨树上摔下'),money:5}}]}]});

/* 8. the horse fair */
I({id:'cr_horse',age:[16,70],cd:10,w:s=>['north','west'].includes(s.region)?1.4:.8,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([17,23,15]),age:rint(30,55),sex:'m'});return c},
 text:c=>T(`At the horse fair, ${c.npc.en} is selling a scruffy, bony colt for 25 taels. "Western blood," he swears. The colt bites him.`,`马市上，${c.npc.zh}牵着一匹又瘦又邋遢的小马驹，要价二十五两。“西域的种！”他赌咒发誓。小马驹回头咬了他一口。`),
 opts:[{l:T('Buy the colt (25 taels)','买下（二十五两）'),cost:25,out:[
   {w:s=>s.smarts/45+s.t.luck*.15,t:T('A year of good feed and the colt fills out into a fine yellow horse. He still bites, but only other people.','喂了一年好料，小马驹长成了一匹漂亮的黄骠马。还是咬人，不过只咬别人。'),c:'gold',fx:{item:'horse',happy:5}},
   {w:2,t:T('It is lame in the left foreleg, which he hid with a clever shoe. You sell it on at a loss.','它左前腿是瘸的，被他用一只巧做的马掌遮住了。你亏本转手卖了。'),c:'bad',fx:{money:8,happy:-3}},
   {w:1,t:T('It is not a colt at all. It is a mule. Stubborn, loyal, and yours.','它根本不是马驹，是头骡子。倔，忠心，归你了。'),c:'muted',fx:{item:'donkey',happy:1}}]},
  {l:T('Haggle hard','狠狠砍价'),out:[
   {w:s=>s.smarts/30+s.looks/70,t:T('You get him down to twelve, then sell the colt to a farmer for twenty before you leave the fair.','你把价砍到十二两，还没出马市就转手卖给一个农户，得了二十两。'),c:'good',fx:{money:8}},
   {w:1.5,t:T('He calls you a cheapskate, and so does the colt, in its own way.','他骂你抠门。小马驹也用它自己的方式骂了你。'),c:'muted',fx:{happy:-1}}]}]});

/* 9. standing in for the opera */
I({id:'cr_opera',age:[14,55],cd:10,w:1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:30,age:rint(40,60)});c.role=s.gender==='f'?['the wronged maiden','苦命小姐']:['the young general','少年将军'];return c},
 text:c=>T(`A travelling opera troupe’s lead has a fever. The troupe master, ${c.npc.en}, grabs your sleeve: "You. You have the face for it. Can you play ${c.role[0]} tonight?"`,`一个跑码头的戏班子，台柱子发了烧。班主${c.npc.zh}一把拽住你的袖子：“你！你这张脸行。今晚能不能顶一出${c.role[1]}？”`),
 opts:[{l:T('Go on stage','上台'),out:[
   {w:s=>s.looks/30+(crJob(s,'actor')?3:0),t:T('Under the paint and the lamps, something takes over. The crowd throws coins. Old women weep.','油彩一抹，灯一亮，你像换了个人。台下扔铜钱，老太太们哭成一片。'),c:'gold',fx:{money:15,fame:2,happy:5}},
   {w:1.5,t:T('You forget your lines twice. The drummer covers for you. The crowd laughs in all the wrong places, but they stay.','你忘了两回词，全靠鼓佬救场。台下笑得不是地方，好歹没走。'),c:'muted',fx:{money:5,happy:-1}}]},
  {l:T('Stage a real sword fight instead','改演一场真刀真枪'),if:s=>power(s)>=20,out:[
   {w:s=>power(s)/40,t:T('Nobody in this town has seen real swordplay on stage. The troupe asks you to stay a month.','这镇上谁也没在戏台上见过真功夫。戏班求你留一个月。'),c:'good',fx:{money:20,fame:2,happy:3}},
   {w:1,t:T('You break the troupe’s only prop spear and part of the stage. You pay for both.','你把戏班唯一一杆道具枪和半个台子都打坏了，只好赔钱。'),c:'bad',fx:{money:-12,happy:-2}}]},
  {l:T('Decline','推辞'),out:[
   {w:2,t:T('He finds a nervous waiter instead. You hear the waiter was terrible and the crowd loved him.','他另拉了个店小二上台。听说演得一塌糊涂，台下却爱得不行。'),c:'muted'},
   {w:s=>s.t.luck*.1,t:T('He presses a free ticket into your hand anyway. It is a good show, fever and all.','他还是塞给你一张戏票。那晚的戏很好，带着高烧也唱得好。'),c:'good',fx:{happy:3}}]}]});

/* 10. the pawn ticket */
I({id:'cr_pawn',age:[18,80],cd:10,w:1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:27,age:rint(24,40),sex:'f'});c.con=chance(.25);return c},
 text:c=>T(`Outside a pawnshop, a young widow, ${c.npc.en}, is crying. She pawned her late husband’s jade pendant; the ticket runs out tomorrow and she is 15 taels short.`,`当铺门口，年轻寡妇${c.npc.zh}在哭。她把亡夫的玉佩当了，当票明天就到期，还差十五两赎不回来。`),
 opts:[{l:T('Pay the 15 taels','替她出十五两'),cost:15,out:[
   {w:(s,c)=>c.con?.5:s.t.heart*.3+1,t:T('She presses the pendant to her chest. A month later a pair of embroidered shoes arrives, in exactly your size.','她把玉佩紧紧贴在胸口。一个月后，你收到一双绣花鞋，尺码分毫不差。'),c:'good',fx:{align:3,happy:3}},
   {w:(s,c)=>c.con?3:.4,t:T('Two days later you see her outside another pawnshop, crying the same tears over the same pendant. She and the pawnbroker are partners.','两天后，你在另一家当铺门口又看见了她，对着同一块玉佩，流着同样的眼泪。原来她和当铺掌柜是一伙的。'),c:'bad',fx:{happy:-4,smarts:1}},
   {w:s=>s.t.luck*.08,t:T('The pendant carries the seal of an old family. Her in-laws, who had disowned her, hear of your kindness and send 40 taels with an apology.','玉佩上刻着一个老世家的印记。当初不认她的婆家听说了你的善举，送来四十两，还赔了不是。'),c:'gold',fx:{money:40,align:3}}]},
  {l:T('Argue with the pawnbroker for her','去跟掌柜理论'),out:[
   {w:s=>s.fame/30+s.smarts/50,t:T('He does not want a scene with someone people have heard of. The ticket is extended a month.','他不想跟有点名气的人闹僵，把当期宽限了一个月。'),c:'good',fx:{align:2,fame:1}},
   {w:1.5,t:T('He laughs at you and shuts the door. She thanks you anyway, which is worse.','他冲你一笑，关上了门。她还是谢了你，这更难受。'),c:'muted',fx:{happy:-2,align:1}}]},
  {l:T('Walk past','走开'),out:[
   {w:2,t:T('Her crying follows you to the end of the street.','她的哭声一直跟你到街尾。'),c:'muted',fx:{align:-1}},
   {w:(s,c)=>c.con?2:.3,t:T('An hour later you see her laughing in a wine shop with the pawnbroker. You are glad you kept your silver.','一个时辰后，你看见她和当铺掌柜在酒铺里有说有笑。幸好你没掏钱。'),c:'muted',fx:{smarts:1}}]}]});

/* ================= medium ================= */

/* 11. the loaded dice (two steps) */
I({id:'cr_dice',age:[16,70],cd:10,w:1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([11,17,28]),age:rint(25,45),sex:'m'});c.lv2=PW(.9,3)(s);return c},
 text:c=>T(`In a gambling den, a young man, ${c.npc.en}, has lost his family’s rent money in an hour. Watching the dealer, you see why: the dice land six-six whenever the pot is big.`,`赌坊里，一个叫${c.npc.zh}的后生一个时辰就输光了家里的租钱。你盯着庄家看了一会儿，明白了：只要赌注一大，骰子就是双六。`),
 opts:[{l:T('Call it out in front of everyone','当众揭穿'),out:[
   {w:s=>power(s)/50+s.fame/40,t:T('You grab the dice and crack one on the table. Lead. The room goes very quiet, then very loud.','你一把抓过骰子往桌上一磕。灌了铅。满屋子先是死一般静，接着炸了锅。'),c:'muted',next:'cr_dice2',keep:1},
   {w:1.2,t:T('Before you finish the sentence, two men take your arms. You are walked out the back.','你话没说完，就被两个汉子架住胳膊，从后门“请”了出去。'),c:'bad',fx:{hurt:[3,9],cause:T('the den’s doormen','赌坊打手')},next:'cr_dice2',keep:1}]},
  {l:T('Bet with the dealer’s pattern','跟着庄家的路数下注'),out:[
   {w:s=>s.smarts/30,t:T('You bet small when the pot is small and big when it is big. You leave with forty taels before he works it out.','小注跟小，大注跟大。等他回过味来，你已经揣着四十两走了。'),c:'good',fx:{money:[30,50],align:-2}},
   {w:1.5,t:T('He notices. The dice change. So does your luck.','他察觉了。骰子换了，你的手气也换了。'),c:'bad',fx:{f:s=>payT(s,-Math.min(s.money,rint(20,40)),'events'),happy:-3}}]},
  {l:T('Quietly tell the young man and leave','悄悄提醒那后生，走人'),out:[
   {w:s=>s.t.heart*.25,t:c=>T(`${c.npc.en} goes white, then red, then quietly leaves with what he has left. Outside, he bows to you.`,`${c.npc.zh}脸色先白后红，揣着剩下的钱悄悄走了。出了门，他给你作了个揖。`),c:'good',fx:{align:2}},
   {w:1.5,t:c=>T(`${c.npc.en} does not believe you. He is winning back his money any minute now. You leave him to it.`,`${c.npc.zh}不信，说马上就能翻本。你由他去了。`),c:'muted',fx:{happy:-1}}]}]});
I({id:'cr_dice2',only:1,noThread:1,
 text:c=>T('The den’s owner comes out from the back room, wiping his hands. Behind him, four men with clubs. "Let’s talk about this somewhere private."','赌坊老板擦着手从后屋出来，身后跟着四个提棍子的汉子。“这事儿，咱们找个清静地方说。”'),
 opts:[{l:T('Fight your way out','打出去'),fight:FG((s,c)=>c.lv2,'injury',T('The gambling den','大闹赌坊'),T('a gambling den’s clubs','赌坊棍棒'),()=>T('the den’s thugs','赌坊打手')),
   win:[{w:s=>1+s.fame/30,t:c=>T(`You leave four men on the floor and the owner under a table. Word spreads; the den closes within a month. ${c.npc.en}’s family send you a ham.`,`你撂倒了四个，老板钻到了桌子底下。消息传开，不到一个月赌坊就关了门。${c.npc.zh}家里给你送了一条火腿。`),c:'gold',fx:{fame:3,align:4,happy:3}},
    {w:s=>.8+s.t.luck*.1,t:T('You get out, and the crowd of cheated gamblers follows you, cheering, and then robs the den blind.','你打了出来。一屋子被骗的赌客跟着你欢呼，转头就把赌坊抢了个精光。'),c:'good',fx:{fame:2,align:2,money:[10,30]}}],
   lose:[{t:T('They are thorough. You wake up in an alley with a swollen face and no purse.','他们下手很仔细。你在小巷里醒来，脸肿着，钱袋没了。'),c:'bad',fx:{f:s=>{payT(s,-Math.min(s.money,rint(15,50)),'events');s.looks=clamp(s.looks-2,0,100)}}}]},
  {l:T('Take his hush money','收他的封口钱'),out:[
   {w:s=>s.smarts/40+1,t:T('Fifty taels to forget what you saw. You forget it. The young man does not.','五十两，买你忘了刚才的事。你忘了，那后生忘不了。'),c:'muted',fx:{money:50,align:-5}},
   {w:1,t:T('He pays you in coins that turn out to be lead too. You have to admire it.','他付给你的铜钱，回头一看也是灌了铅的。你不得不佩服。'),c:'bad',fx:{align:-3,happy:-2}}]},
  {l:T('Threaten to fetch the constables','扬言报官'),out:[
   {w:s=>s.fame/30+(crJob(s,'constable')?4:0),t:T('He knows your name, and he knows the constables do too. He refunds the young man and smiles very hard at you.','他知道你的名号，也知道衙门里的人知道。他把后生的钱退了，冲你笑得脸都僵了。'),c:'good',fx:{align:3,fame:1}},
   {w:1.5,t:T('"The constables drink here on Thursdays," he says. You leave. Quickly.','“捕快们每逢初五都来这儿喝酒。”他说。你走了，走得很快。'),c:'muted',fx:{happy:-3}}]}]});

/* 12. the forgery commission */
I({id:'cr_forgery',age:[18,75],cd:12,w:1,tags:CR_T,when:s=>s.smarts>=45||crJob(s,'clerk','tutor','story'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([11,17,23,5]),age:rint(35,55),sex:'m'});c.artist=pick([['the Hermit of Cold Creek','寒溪山人'],['Old Mo of the Stone Gate','石门老墨'],['the Lame Monk of Yunshan','云山跛僧']]);return c},
 text:c=>T(`An art dealer, ${c.npc.en}, unrolls a landscape by ${c.artist[0]}, dead sixty years. "I need a copy. A very good copy. Eighty taels. It is only a copy, after all."`,`字画商${c.npc.zh}展开一幅山水，落款“${c.artist[1]}”，此人已经死了六十年。“我要一幅临本，要临得极好。八十两。不过是临摹嘛。”`),
 opts:[{l:T('Paint it','接下这活'),out:[
   {w:s=>s.smarts/25,t:T('Your copy is so good the dealer sells it to a magistrate as the original. You get your eighty and try not to think about it.','你临得太好，字画商当真迹卖给了一位知府。八十两到手，你尽量不去想这事。'),c:'muted',fx:{money:80,align:-4,smarts:1}},
   {w:1.2,t:T('It sells as genuine. A year later, constables come asking who painted it. You are fined, and the dealer has vanished.','画当真迹卖了。一年后捕快上门，问这画是谁画的。你挨了罚，字画商早没了影。'),c:'bad',fx:{money:30,align:-4,wanted:1}},
   {w:1,t:T('Your mountains look like steamed buns. He pays twenty and hangs it in his privy.','你画的山像一屉馒头。他给了二十两，挂在了茅房里。'),c:'muted',fx:{money:20,happy:-2}}]},
  {l:T('Paint it, and hide your own name in the rocks','画，但把自己的名字藏在石头缝里'),out:[
   {w:s=>s.smarts/30,t:T('It sells as genuine. Years later a collector finds your tiny name in the rocks, and you become famous as the forger with a sense of humour.','画当真迹卖了。多年后有个藏家在石缝里找到了你的小字，你从此以“会开玩笑的作伪高手”出了名。'),c:'gold',fx:{money:80,fame:3,align:-1}},
   {w:1.2,t:T('The dealer goes over it with a magnifying glass, finds you in the rocks, and refuses to pay.','字画商拿着放大镜一寸寸看，在石缝里找到了你，一文钱不给。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Report him to the yamen','告到衙门'),out:[
   {w:s=>s.fame/30+(s.align>20?1.5:.5),t:T('The constables find a whole storeroom of dead masters. You get a 30-tael reward and a nod from the magistrate.','捕快搜出了一屋子“古人真迹”。你得了三十两赏银，知县还冲你点了点头。'),c:'good',fx:{money:30,align:3}},
   {w:1.5,t:T('He has friends in the yamen. You are the one fined, for wasting the court’s time.','他在衙门里有人。挨罚的反倒是你，罪名是“诬告扰官”。'),c:'bad',fx:{money:-20,happy:-3}}]}]});

/* 13. the patient */
I({id:'cr_patient',age:[20,80],cd:8,w:s=>crJob(s,'doctor','herbalist')?2:1,when:s=>crJob(s,'doctor','herbalist')||s.smarts>=55,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([0,15,17]),age:rint(28,45),sex:'m'});return c},
 text:c=>T(`A farmer, ${c.npc.en}, carries in his son: burning fever, red spots, a dry cough. It could be heat in the blood, or it could be something worse. He has heard you know medicine.`,`农夫${c.npc.zh}抱着儿子闯进来：高烧，红疹，干咳。可能是血热，也可能是更凶的东西。他听说你懂医。`),
 opts:[{l:T('Cooling herbs and rest','清热的方子，静养'),out:[
   {w:s=>s.smarts/20+(crJob(s,'doctor')?2:0),t:T('You guess right. In five days the boy is shouting in the yard again. The father brings you a chicken every month for a year.','你判断对了。五天后孩子又在院子里大呼小叫。此后一年，他父亲每月给你送只鸡。'),c:'good',fx:{money:15,fame:2,align:2,happy:3}},
   {w:1,t:T('It was not heat. The boy gets worse. Another doctor saves him at the last moment and tells the whole market what you got wrong.','不是血热。孩子越来越重，最后被别的大夫救了回来。那大夫在集上把你的错处讲了个遍。'),c:'bad',fx:{fame:-2,happy:-6,smarts:1}}]},
  {l:T('Needles and bleeding, fast and hard','下猛药，针刺放血'),out:[
   {w:s=>s.smarts/40+(crJob(s,'doctor')?1:0),t:T('Brutal, and right. The fever breaks that night. You sit with the boy until dawn anyway.','手段狠，但对了。当夜烧就退了。你还是守着孩子坐到了天亮。'),c:'good',fx:{fame:3,align:2,money:10}},
   {w:1.4,t:T('The boy dies before morning. The father takes you to court. You lose the case, and something else you cannot name.','孩子没熬过天亮。他父亲把你告上了公堂。官司你输了，还丢了一样说不出名字的东西。'),c:'bad',fx:{f:s=>payT(s,-Math.min(s.money,rint(40,100)),'events'),happy:-10,fame:-3}}]},
  {l:T('Send them to a better doctor','荐他们去找高明的大夫'),out:[
   {w:2,t:T('The honest choice. You hear the boy recovered, and nobody remembers your part in it.','这是老实的做法。听说孩子好了，没人记得你那一份。'),c:'muted',fx:{align:1}},
   {w:s=>s.t.luck*.1+.3,t:T('The famous doctor across town turns out to be a fraud who sells ash pills. You run after them and treat the boy yourself, just in time.','城那头的名医原来是个卖香灰丸子的骗子。你追了过去，亲手给孩子治，总算赶上了。'),c:'good',fx:{align:3,fame:1,smarts:1}}]}]});

/* 14. the would-be apprentice */
I({id:'cr_apprentice',age:[28,75],cd:12,w:1.1,when:s=>crJob(s,'smith','cook','doctor','herbalist','actor','story','merchant','tutor')||crBiz(s)>0,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([20,21]),age:rint(12,15),lv:3});c.trade=crJob(s,'smith')?['the forge','打铁']:crJob(s,'cook')?['the kitchen','掌勺']:crJob(s,'doctor','herbalist')?['medicine','医术']:crJob(s,'actor')?['the stage','唱戏']:crJob(s,'story')?['storytelling','说书']:crJob(s,'tutor')?['letters','读书写字']:['the trade','做买卖'];return c},
 text:c=>T(`A thin child, ${c.npc.en}, has been waiting outside your door since dawn. ${c.npc.He} wants to learn ${c.trade[0]} from you. ${c.npc.He} has nothing but a bundle and a very stubborn chin.`,`一个瘦瘦的孩子${c.npc.zh}，天不亮就守在你门口，说要跟你学${c.trade[1]}。${c.npc.ta}只有一个小包袱，和一个倔得要命的下巴。`),
 opts:[{l:T('Take the child on','收下'),out:[
   {w:s=>s.t.heart*.3,t:c=>T(`${c.npc.en} sweeps, carries, watches, and learns. Within two years you trust ${c.npc.him} with things you trust nobody else with.`,`${c.npc.zh}扫地、挑水、在一旁看，学得飞快。不到两年，有些事你只放心交给${c.npc.ta}。`),c:'good',fx:{meet:'disciple',bond:65,happy:3}},
   {w:1.4,t:c=>T(`${c.npc.en} eats like three people and breaks a great deal. But ${c.npc.he} stays.`,`${c.npc.zh}一个人吃三个人的饭，还打碎了不少东西。可${c.npc.ta}没走。`),c:'muted',fx:{meet:'disciple',bond:50,money:-15,happy:-1}},
   {w:s=>s.t.luck*.1,t:c=>T(`${c.npc.en} has a gift. In a few years people come asking for ${c.npc.him}, not you. You find you do not mind.`,`${c.npc.zh}是块料。没几年，上门的人点名要找${c.npc.ta}，不找你了。你发现自己并不介意。`),c:'gold',fx:{meet:'disciple',bond:75,fame:2,happy:4}}]},
  {l:T('Set a hard test first','先出道难题'),out:[
   {w:s=>s.smarts/40+.5,t:c=>T(`You set an impossible task. ${c.npc.en} fails it in a way that shows real talent. You take ${c.npc.him} on.`,`你出了一道做不成的题。${c.npc.zh}没做成，可那做法透出真本事。你收下了${c.npc.ta}。`),c:'good',fx:{meet:'disciple',bond:70,smarts:1}},
   {w:1.5,t:c=>T(`${c.npc.en} fails, cries, and walks away down the road. You think about it more than you expected.`,`${c.npc.zh}没过，哭着沿路走了。你比自己想的更常想起这件事。`),c:'muted',fx:{align:-1,happy:-2}}]},
  {l:T('Send the child away with some coins','给几个钱打发走'),out:[
   {w:2,t:T('The child takes the coins and does not look back.','孩子接了钱，头也不回地走了。'),c:'muted',fx:{money:-2}},
   {w:s=>s.t.luck*.1,t:T('Years later a successful merchant reminds you of the coins you gave a child at your door. He pays them back a hundredfold.','多年后，一位发了财的商人提起你当年在门口给过一个孩子几个铜板。他百倍奉还。'),c:'gold',fx:{money:[40,80],happy:3}}]}]});

/* 15. the vintage bet */
I({id:'cr_vintage',age:[20,85],cd:10,w:1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(40,60)});return c},
 text:c=>T(`${c.npc.en}, who runs a wine shop, pours a cup of old yellow wine from a muddy jar. "Fifty taels says you can’t tell me how many years it slept underground. Within three."`,`酒铺掌柜${c.npc.zh}从一只满是泥的坛子里倒了一杯老黄酒。“赌五十两，你说不出它在地下埋了几年。差三年以内都算你赢。”`),
 opts:[{l:T('Taste and bet 50 taels','品，押五十两'),cost:50,out:[
   {w:s=>s.smarts/40+s.t.luck*.2,t:T('“Eighteen years. A daughter’s-wedding jar.” The owner swears and pays a hundred.','“十八年。嫁女儿时开的那种坛子。”掌柜骂了一声，付了一百两。'),c:'good',fx:{money:100,fame:1,happy:3}},
   {w:2,t:T('You say twelve. It was thirty. He keeps your fifty and pours you another cup, out of pity.','你说十二年，其实是三十年。他收了你的五十两，出于同情又给你倒了一杯。'),c:'bad',fx:{happy:-3}},
   {w:s=>s.smarts/70,t:T('It tastes young. You check the jar: fresh mud, old seal. He has been running this bet on travellers for years. He pays you double to keep quiet.','这酒喝着嫩。你一看坛子：泥是新抹的，封口是旧的。他拿这招坑过路客好多年了，赔你双倍求你别声张。'),c:'gold',fx:{money:150,align:-1}}]},
  {l:T('Drink, decline the bet','酒喝了，赌不打'),out:[
   {w:2,t:T('He charges you for the cup. Fair enough; it was very good.','他收了你一杯的钱。也公道，酒是真好。'),c:'muted',fx:{money:-2,happy:2}},
   {w:s=>s.looks/50+s.fame/50,t:T('He likes you, so the cup is free, and then the next one, and you wake up under his counter.','他看你顺眼，这杯不要钱，下一杯也不要钱，第二天你在他柜台底下醒来。'),c:'good',fx:{happy:4}}]}]});

/* 16. a friend’s failing shop */
I({id:'cr_shop',age:[22,75],cd:15,w:s=>living(s,'friend').length?1.4:.8,when:s=>crBiz(s)<3&&s.money>=80,ctx:s=>{const c=scene();const fr=living(s,['friend','sworn']);c.p=fr.length?pick(fr):null;c.npc=npc(s,{occ:17,age:rint(30,55)});c.fn=c.p?T(c.p.n.py,c.p.n.cn):T(c.npc.en,c.npc.zh);c.ta=c.p?PRON[c.p.sex].ta:c.npc.ta;return c},
 text:c=>T(`${c.fn.en}’s grocery shop is going under: bad debts, a cheating partner, and a roof that leaks onto the rice. ${c.fn.en} offers it to you for 200 taels, stock and all, "before the creditors take it for nothing."`,`${c.fn.zh}的杂货铺撑不下去了：烂账、合伙人卷钱、屋顶漏雨漏到米缸里。${c.fn.zh}说两百两连货带铺盘给你，“总比让债主白拿去强。”`),
 opts:[{l:T('Buy the shop (200 taels)','盘下铺子（二百两）'),cost:200,out:[
   {w:s=>s.smarts/30,t:T('You fix the roof, sack the partner’s cousin, and read every page of the books. The shop starts paying its way.','你修了屋顶，辞了合伙人的表亲，把账本一页页翻了个遍。铺子开始见钱了。'),c:'good',fx:(s,c)=>({item:'grocery',happy:3,f:()=>addBond(c.p,10)})},
   {w:1.5,t:T('The debts come with the shop. Nobody mentioned that part.','债也一并盘了过来。这一节，谁也没提过。'),c:'bad',fx:(s,c)=>({item:'grocery',money:-rint(30,80),happy:-3,f:()=>addBond(c.p,5)})},
   {w:s=>s.t.heart*.2,t:c=>T(`You keep ${c.fn.en} on to run the counter. It is the best decision you make that year.`,`你留${c.fn.zh}在铺子里照看柜台。这是你那一年做得最对的一件事。`),c:'good',fx:(s,c)=>({item:'grocery',align:2,happy:4,f:()=>addBond(c.p,15)})}]},
  {l:T('Lend 60 taels to keep it afloat','借六十两让铺子撑下去'),cost:60,out:[
   {w:s=>s.t.heart*.25+s.t.luck*.1,t:c=>T(`It is just enough. Two years later ${c.fn.en} repays you eighty, and will not hear of less.`,`刚好够。两年后${c.fn.zh}还了你八十两，少一文都不肯。`),c:'good',fx:(s,c)=>({money:80,f:()=>addBond(c.p,12)})},
   {w:1.5,t:c=>T(`The shop fails anyway. ${c.fn.en} cannot meet your eye for a long time.`,`铺子到底还是倒了。${c.fn.zh}很久都不敢正眼看你。`),c:'bad',fx:(s,c)=>({happy:-2,f:()=>addBond(c.p,5)})}]},
  {l:T('Say you can’t help','说帮不上'),out:[
   {w:2,t:c=>T(`${c.fn.en} nods. Things are cooler between you after that.`,`${c.fn.zh}点点头。此后你们之间淡了些。`),c:'muted',fx:(s,c)=>({f:()=>addBond(c.p,-10)})},
   {w:s=>s.t.luck*.15,t:c=>T(`${c.fn.en} finds another buyer the next week, at a better price, and buys you dinner with the difference.`,`第二周${c.fn.zh}找到了别的买主，价钱还更好，拿多出来的钱请你吃了顿饭。`),c:'good',fx:{happy:2}}]}]});

/* 17. the antique bowl */
I({id:'cr_antique',age:[20,85],cd:10,w:1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([17,19,23]),age:rint(40,70)});c.real=chance(.2+s.t.luck*.015);return c},
 text:c=>T(`At a street stall, ${c.npc.en} has a celadon bowl the colour of rain clouds. "From the old imperial kilns," ${c.npc.he} says. "Forty taels. I need the money for my mother." Everybody needs money for their mother.`,`街边小摊上，${c.npc.zh}摆着一只雨过天青色的青瓷碗。“官窑的老东西，”${c.npc.ta}说，“四十两。我娘等钱治病。”谁的娘不等钱治病呢。`),
 opts:[{l:T('Buy it (40 taels)','买下（四十两）'),cost:40,out:[
   {w:(s,c)=>c.real?3:.1,t:T('A collector in the city goes pale when he sees it. He pays more than you have ever held at once.','城里一位藏家一见这碗，脸都白了。他付的钱，是你这辈子一次见过最多的。'),c:'gold',fx:{money:[200,400],happy:6}},
   {w:(s,c)=>c.real?.3:2.5,t:T('Fake, of course. But it is a lovely bowl for rice, and you eat from it for years.','当然是假的。不过拿来盛饭挺好看，你用了好多年。'),c:'muted',fx:{happy:1}},
   {w:(s,c)=>c.real?0:1,t:T('Fake, and it leaks. Soup runs down your sleeve at the first meal.','假的，还漏。第一顿饭汤就顺着袖子流了下来。'),c:'bad',fx:{happy:-2}}]},
  {l:T('Examine it closely first','先仔细看看'),out:[
   {w:(s,c)=>c.real?s.smarts/25:0,t:T('The foot ring, the crackle, the weight: it is real, and the seller does not know it. You pay the forty, then sell it in the city for a fortune.','圈足、开片、分量，都对：是真的，卖主自己却不知道。你付了四十两，转手在城里卖出了天价。'),c:'gold',fx:{money:[180,320],align:-1}},
   {w:(s,c)=>c.real?0:s.smarts/30,t:T('Tea stains rubbed into fresh glaze. You hand it back with a smile, and the seller packs up early.','新釉上抹了茶垢做旧。你笑着把碗还了回去，摊主提早收了摊。'),c:'good',fx:{smarts:1,happy:1}},
   {w:1,t:c=>T(`You turn it over and over and cannot tell. ${c.npc.en} gets offended and doubles the price.`,`你翻来覆去看了半天也看不出名堂。${c.npc.zh}不高兴了，价钱翻了一倍。`),c:'muted',fx:{happy:-1}}]},
  {l:T('Walk on','走开'),out:[
   {w:(s,c)=>c.real?2:.3,t:T('Months later you hear a stall bowl sold to a collector for six hundred taels. You think about it every time you eat rice.','几个月后你听说，有只地摊上的碗卖给藏家卖了六百两。从此每回吃饭你都会想起这事。'),c:'muted',fx:{happy:-2}},
   {w:(s,c)=>c.real?.3:2,t:T('The next day the same seller has an identical bowl. And the day after.','第二天，同一个摊主又摆出了一模一样的碗。第三天也是。'),c:'muted',fx:{smarts:1}}]}]});

/* 18. the magistrate’s banquet */
I({id:'cr_banquet',age:[16,70],cd:10,w:s=>crJob(s,'cook','waiter')?2.2:.8,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(40,60),sex:'m'});return c},
 text:c=>T(`The magistrate’s birthday banquet is tonight. The hired cook has run off, the fish has turned, and the steward, ${c.npc.en}, has heard you can cook. He grabs you by both shoulders.`,`今晚是县太爷的寿宴。请来的厨子跑了，鱼也有点不新鲜了。管家${c.npc.zh}听说你会做菜，一把抓住你的两只肩膀。`),
 opts:[{l:T('Cook the fish with plenty of ginger and vinegar','多放姜醋，硬着头皮做鱼'),out:[
   {w:s=>s.smarts/40+(crJob(s,'cook')?2.5:0),t:T('Ginger, vinegar, a fierce fire and a prayer. Nobody notices. The magistrate asks for seconds.','姜、醋、猛火，再加一声祷告。谁也没吃出来，县太爷还要了第二碗。'),c:'good',fx:s=>({money:Math.round(30*crP(s)),fame:1})},
   {w:1.5,t:T('Half the guests spend the night in the privy. The steward pays nothing and remembers your face.','一半的客人在茅房里过了一夜。管家一文没给，还记住了你的脸。'),c:'bad',fx:{happy:-4,fame:-1}}]},
  {l:T('Throw out the fish and invent a dish','扔了鱼，现编一道菜'),out:[
   {w:s=>s.smarts/30+s.t.luck*.2,t:T('Tofu, wine lees and pork fat, steamed in lotus leaf. You call it Magistrate’s Long Life. It is on every menu in the county by spring.','豆腐、酒糟、猪油，荷叶包了蒸。你给它取名“太爷长寿”。开春时全县馆子的菜单上都有了。'),c:'gold',fx:s=>({money:Math.round(40*crP(s)),fame:2,happy:3})},
   {w:1.5,t:T('The magistrate dislikes it and says so to the whole table. You are paid half.','县太爷不喜欢，当着满桌人说了出来。你只拿到一半工钱。'),c:'muted',fx:{money:10,happy:-2}}]},
  {l:T('Tell the steward the fish is bad','跟管家说鱼坏了'),out:[
   {w:s=>s.t.heart*.3,t:T('He curses, then sends a boy running for fresh fish. Afterwards he pays you well and tells the magistrate who saved the night.','他骂了一句，赶紧打发小厮去买新鱼。事后他给了你一份厚赏，还跟县太爷说是谁救的场。'),c:'good',fx:{money:20,align:1,fame:1}},
   {w:1,t:T('He does not want to hear it. You are thrown out of the kitchen, and the banquet goes ahead without you, badly.','他不想听。你被轰出了厨房，寿宴照办，办得一塌糊涂。'),c:'muted',fx:{happy:-2}}]}]});

/* 19. the poor scholar */
I({id:'cr_scholar',age:[18,80],cd:12,w:1,tags:CR_W,ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:rint(20,30),sex:'m'});return c},
 text:c=>T(`On the road to the capital, a scholar, ${c.npc.en}, has run out of money a month short of the imperial exam. He shows you his essays and asks for 30 taels. "I will repay you a hundred times."`,`进京的路上，书生${c.npc.zh}离大考还有一个月，盘缠却花光了。他拿出自己的文章给你看，想借三十两。“他日必百倍奉还。”`),
 opts:[{l:T('Give him 30 taels','给他三十两'),cost:30,out:[
   {w:s=>s.t.luck*.15+.2,t:T('He passes high. Years later an official’s letter arrives with a hundred taels and a poem about a stranger on the road.','他高中了。多年后寄来一封官府的书信，附银一百两，还有一首写路上那位陌生人的诗。'),c:'gold',fx:{money:100,fame:2,align:2,meet:'friend',bond:75}},
   {w:2,t:T('He fails, and writes you a sad, beautiful letter promising to try again in three years.','他落榜了，给你写了一封又悲又美的信，说三年后再考。'),c:'muted',fx:{align:2,meet:'acq',bond:60}},
   {w:1,t:T('You later hear he spent it all in a single night on the pleasure boats. He never sat the exam.','后来你听说，他在花船上一夜就把钱花光了，考场的门都没进。'),c:'bad',fx:{align:1,happy:-2}}]},
  {l:T('Tutor him on the road instead','路上给他讲讲文章'),if:s=>s.smarts>=55,out:[
   {w:s=>s.smarts/25,t:T('You spend a week arguing about the classics. A question you drilled him on comes up in the exam. He passes and never forgets you.','你们一路争了七天的经义。你逼他反复练的一道题，正好考到了。他中了，一辈子记着你。'),c:'good',fx:{smarts:2,fame:1,meet:'friend',bond:70}},
   {w:1.5,t:T('He takes your advice, ignores it on the day, and fails anyway.','他听了你的，到了考场又全忘了，照样落榜。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Wish him luck','祝他好运'),out:[
   {w:2,t:T('He bows and walks on, thinner than his own shadow.','他作了个揖，往前走了，人比影子还瘦。'),c:'muted'},
   {w:s=>s.t.luck*.1,t:T('Years later you see his name on a list of successful candidates, and feel oddly proud of a man you did not help.','多年后你在一张金榜上看到了他的名字，莫名其妙地为一个自己没帮过的人感到骄傲。'),c:'muted',fx:{happy:2}}]}]});

/* ================= big: the chef’s secret ================= */
I({id:'cr_recipe1',age:[18,70],once:1,w:1.1,tags:CR_T,ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(66,80)});return c},
 text:c=>T(`Old ${c.npc.en} of the Lotus Wind House is famous for one dish: an eight-treasure duck nobody can copy. ${c.npc.He} is dying, and has no heir. ${c.npc.He} serves you the apprentice’s version and asks: "What is missing?"`,`荷风楼的老东家${c.npc.zh}，凭一道八宝鸭名满一方，谁也仿不出来。${c.npc.ta}病得不轻，又没有传人。${c.npc.ta}端上徒弟做的那一只，问你：“缺了什么？”`),
 opts:[{l:T('Taste it carefully and answer','细细品了再答'),out:[
   {w:s=>s.smarts/30+s.t.luck*.15+(crJob(s,'cook')?2:0),t:T('“Tangerine peel. Three years old, not one.” The old cook laughs until coughing stops it, and tells you to come back tomorrow.','“陈皮。要三年的，不是一年的。”老人笑得咳了起来，叫你明天再来。'),c:'good',fx:{f:(s,c)=>{c.good=1}},next:'cr_recipe2',keep:1},
   {w:2,t:T('You say salt. It is not salt. The old cook sighs, but says you are the first person honest enough to admit you have no idea. Come back tomorrow.','你说盐。不是盐。老人叹了口气，却说你是头一个老实承认不知道的人。明天再来吧。'),c:'muted',next:'cr_recipe2',keep:1}]},
  {l:T('Praise it to the skies','把菜夸上天'),out:[
   {w:s=>s.looks/40+s.fame/50,t:T('The old cook is amused despite everything, and gives you a lesser recipe, for pickled radish, just to get rid of you.','老人到底被你逗乐了，给了你一个腌萝卜的方子，好打发你走。'),c:'muted',fx:{smarts:1,happy:2}},
   {w:1.5,t:T('“Flatterer.” A bowl hits the door frame beside your head as you leave.','“马屁精。”你出门时，一只碗砸在你脑袋边的门框上。'),c:'bad',fx:{happy:-2}}]},
  {l:T('Leave the old cook in peace','不打扰老人家'),out:[
   {w:2,t:T('A month later the Lotus Wind House is shuttered. The duck is gone from the world.','一个月后，荷风楼关了门。那道鸭子从此失传。'),c:'muted',fx:{happy:-1}},
   {w:s=>s.t.luck*.15,t:T('Before you leave, the old cook wraps a duck leg in lotus leaf for your journey. It is the best thing you have ever eaten.','临走时老人用荷叶包了一只鸭腿给你路上吃。那是你这辈子吃过最好的东西。'),c:'good',fx:{happy:4}}]}]});
I({id:'cr_recipe2',only:1,noThread:1,
 text:c=>T(`For a season you work in ${c.npc.en}’s kitchen. The apprentice glares. Then the owner of the rival Golden Tripod comes to you quietly: 300 taels for the recipe, written down, before the old cook dies.`,`一整季，你在${c.npc.zh}的灶间帮工。徒弟看你的眼神像刀子。后来，对家金鼎阁的东家悄悄找上你：趁老人还在，把方子写下来，三百两。`),
 opts:[{l:T('Learn it properly and keep the secret','好好学，守住秘方'),out:[
   {w:s=>s.smarts/30+(s.t.heart*.1),t:T('Twelve ingredients, two days, and a temper you must never lose. You get it right on the ninth try.','十二样料，两天工夫，外加一副绝不能发作的好脾气。第九回，你做成了。'),c:'good',fx:{f:(s,c)=>{c.good=1},smarts:1},next:'cr_recipe3',keep:1},
   {w:1.2,t:T('You burn twenty ducks. The twenty-first is almost right. The old cook says almost is how everyone starts.','你烧糊了二十只鸭子。第二十一只差不多了。老人说，人人都是从“差不多”开始的。'),c:'muted',next:'cr_recipe3',keep:1}]},
  {l:T('Sell it to the Golden Tripod','卖给金鼎阁'),out:[
   {w:s=>s.smarts/40+.5,t:c=>T(`Three hundred taels. ${c.npc.en} dies that winter, and you hear ${c.npc.his} last words were about you. They were not kind.`,`三百两到手。那年冬天${c.npc.zh}走了。听说${c.npc.ta}临终最后几句话说的是你，不是好话。`),c:'muted',fx:{money:300,align:-8,happy:-3}},
   {w:1.2,t:T('They pay a hundred, then claim the recipe is fake and send men to get the money back. You keep the money and lose two teeth.','他们付了一百两，转头说方子是假的，派人来讨钱。钱你保住了，牙掉了两颗。'),c:'bad',fx:{money:100,align:-6,looks:-2,hurt:[5,12],cause:T('the Golden Tripod’s men','金鼎阁的打手')}}]},
  {l:T('Persuade the old cook to teach the apprentice','劝老人把手艺传给徒弟'),out:[
   {w:s=>s.t.heart*.3+s.smarts/60,t:c=>T(`It takes a week of talking. In the end the apprentice weeps at ${c.npc.en}’s bedside, and the Lotus Wind House lives on. The apprentice sends you a duck every New Year.`,`劝了七天。最后徒弟跪在${c.npc.zh}床前哭了，荷风楼的招牌保住了。此后每年过年，徒弟都给你送一只鸭子。`),c:'gold',fx:{align:5,fame:2,happy:4,deed:T('Saved the Lotus Wind House’s duck from being lost','保住了荷风楼八宝鸭的手艺')}},
   {w:1,t:T('The old cook agrees. Within a month the apprentice has sold the recipe to the Golden Tripod and left town.','老人答应了。不到一个月，徒弟就把方子卖给了金鼎阁，跑了。'),c:'bad',fx:{align:2,happy:-4}}]}]});
I({id:'cr_recipe3',only:1,noThread:1,
 text:c=>T(`${c.npc.en} dies in the first snow, and leaves you the recipe and a cracked clay pot. What will you do with them?`,`初雪那天，${c.npc.zh}走了，留给你那道方子和一只裂了缝的砂锅。你打算怎么办？`),
 opts:[{l:T('Open a duck stall (50 taels)','开个鸭子摊（五十两）'),cost:50,out:[
   {w:(s,c)=>s.smarts/30+(c.good?2:0)+(crP(s)<1.3?1:0),t:T('There is a queue by noon on the first day. By the end of the year your stall has paid for itself several times.','开张头一天，不到晌午就排起了长队。到年底，这摊子已经回本好几回了。'),c:'gold',fx:s=>({money:Math.round(rint(120,220)*crP(s)),fame:2,item:'teastall',happy:4})},
   {w:(s,c)=>1+(crP(s)>=1.3?1.5:0),t:T('Nobody buys eight-treasure duck in a year when rice is this dear. You eat a lot of duck.','米价这么贵的年头，谁还买八宝鸭。你自己吃了好多鸭子。'),c:'muted',fx:{money:30,happy:-1}}]},
  {l:T('Enter the provincial cooking contest','去参加府里的厨艺大赛'),out:[
   {w:(s,c)=>s.smarts/30+(c.good?2:0)+(crJob(s,'cook')?1:0),t:c=>T(`You win, and when they ask the dish’s name, you give ${c.npc.en}’s. The prize is 120 taels. The name is worth more.`,`你夺了魁。人家问菜名，你报了${c.npc.zh}的名字。赏银一百二十两，那个名字比银子值钱。`),c:'gold',fx:{money:120,fame:5,happy:5,deed:T('Won the provincial cooking contest with an old master’s duck','以老厨神的八宝鸭夺得府里厨艺大赛头名')}},
   {w:1.5,t:T('The Golden Tripod’s cook wins. Two judges are his cousins. You come second, and you are furious for a year.','金鼎阁的厨子拿了头名，两位评判是他表亲。你屈居第二，气了一整年。'),c:'muted',fx:{money:30,fame:1,happy:-3}}]},
  {l:T('Keep it for family feasts','留着逢年过节自家做'),out:[
   {w:s=>s.t.heart*.3,t:T('Every New Year, the duck. Children grow up thinking all ducks taste like this. They are disappointed for the rest of their lives.','每年过年都做这道鸭子。孩子们从小以为天下的鸭子都这个味儿，往后一辈子吃别家的都失望。'),c:'good',fx:{happy:8}},
   {w:1,t:T('You make it once a year and never quite get it right again. It is still the best thing on the table.','你一年做一回，再也没做得像当初那么好。可它仍是桌上最好的一道菜。'),c:'muted',fx:{happy:4}}]}]});

/* ================= big: the guild war ================= */
I({id:'cr_guild1',age:[20,70],once:1,w:s=>crJob(s,'merchant','clerk','porter','boatman','courier')?2:1,tags:CR_T,when:s=>s.money>=50||crJob(s,'merchant','clerk','porter','boatman','courier'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:rint(40,60),sex:'m'});c.lv2=PW(.95,3)(s);return c},
 text:(c,s)=>T(`In the river city of ${crReg(s).en}, the Silk Guild and the Tea Guild are at war over the best wharf. Prices are ${crP(s)>=1.3?'already wild':'starting to jump'}. ${c.npc.en}, master of the Silk Guild, offers you 40 taels to keep an eye on the Tea Guild’s warehouses.`,`${crReg(s).cn}的河港城里，丝行和茶行为了争最好的码头斗得不可开交，物价${crP(s)>=1.3?'早已飞涨':'眼看着往上蹿'}。丝行会首${c.npc.zh}出四十两，请你盯着茶行的货栈。`),
 opts:[{l:T('Take the Silk Guild’s money','收丝行的钱'),out:[
   {w:s=>s.smarts/40+power(s)/80,t:T('You learn the Tea Guild plans to burn the Silk Guild’s bales on the night of the full moon.','你打听到，茶行打算在月圆之夜放火烧丝行的货包。'),c:'muted',fx:{money:40,f:(s,c)=>{c.side='silk';c.intel=1}},next:'cr_guild2',keep:1},
   {w:1,t:T('You learn very little, but someone has noticed you watching.','你没打听到什么，却有人注意到你在盯梢。'),c:'muted',fx:{money:40,f:(s,c)=>{c.side='silk'}},next:'cr_guild2',keep:1}]},
  {l:T('Warn the Tea Guild instead','反去给茶行报信'),out:[
   {w:s=>s.t.heart*.2+s.smarts/50,t:T('The Tea Guild master thanks you, pays you double, and tells you the Silk Guild means to burn their warehouse first.','茶行会首谢了你，给了双倍，还告诉你：丝行打算先下手烧他们的货栈。'),c:'muted',fx:{money:80,align:-1,f:(s,c)=>{c.side='tea';c.intel=1}},next:'cr_guild2',keep:1},
   {w:1,t:T('The Tea Guild master assumes you are a spy, but a useful one. He pays you twenty and watches you closely.','茶行会首认定你是奸细，不过是个有用的奸细。他给了二十两，把你盯得死死的。'),c:'muted',fx:{money:20,align:-2,f:(s,c)=>{c.side='tea'}},next:'cr_guild2',keep:1}]},
  {l:T('Stay out, and buy cheap goods during the war (50 taels)','不掺和，趁乱低价进货（五十两）'),cost:50,out:[
   {w:s=>s.smarts/30+s.t.luck*.1,t:T('Both guilds dump stock to raise money. You buy low and sell when the dust settles, and nobody even knows your name.','两家都在甩货筹钱。你低进高出，等尘埃落定才出手，谁都不知道你是谁。'),c:'good',fx:s=>({money:Math.round(110*crP(s)),smarts:1})},
   {w:1.5,t:T('Your tea gets wet in a warehouse fire that was not meant for you. You sell what is left at a loss.','一场冲着别人去的仓库大火，浇湿了你的茶。剩下的你亏本卖了。'),c:'bad',fx:{money:20,happy:-3}}]}]});
I({id:'cr_guild2',only:1,noThread:1,
 text:c=>T(`The night of the full moon. On the wharf, men with oil jars move between the warehouses. ${c.intel?'You knew they were coming; you are waiting.':'You stumble on them by chance.'}`,`月圆之夜。码头上，几条汉子提着油罐在货栈之间穿行。${c.intel?'你早知道他们要来，正在这儿等着。':'你是碰巧撞上的。'}`),
 opts:[{l:T('Stop the arsonists','拦住放火的人'),fight:FG((s,c)=>c.intel?Math.round(c.lv2*.9):c.lv2,'injury',T('Fire on the wharf','码头夜火'),T('arsonists on the wharf','码头纵火的人'),()=>T('the arsonists','纵火的汉子')),
   win:[{t:T('Oil jars smash into the river. By dawn the whole wharf knows who stood in the way.','油罐一个个砸进河里。天亮时，整个码头都知道是谁挡下了这一把火。'),c:'good',fx:{fame:2,f:(s,c)=>{c.won=1}},next:'cr_guild3',keep:1}],
   lose:[{t:T('They knock you into the river and the warehouse burns. You crawl out half-drowned, smelling of oil and smoke.','你被打进了河里，货栈烧了。你半死不活地爬上岸，一身油味烟味。'),c:'bad',fx:{f:(s,c)=>{c.won=0}},next:'cr_guild3',keep:1}]},
  {l:T('Call both masters to the wharf and broker a truce','把两位会首叫到码头讲和'),out:[
   {w:s=>s.smarts/25+s.fame/40,t:T('Two old men in nightclothes, shouting at each other by torchlight. Then, slowly, talking. By dawn they split the wharf by the week.','两个穿着睡衣的老头在火把下对吼，后来慢慢地说上了话。天亮时，他们定下按旬轮用码头。'),c:'gold',fx:{fame:3,align:3,f:(s,c)=>{c.truce=1;c.won=1}},next:'cr_guild3',keep:1},
   {w:1.5,t:T('They both insult you, then each other, then go home. The warehouse burns while they argue.','两人先骂你，再互骂，然后各自回家。吵的工夫，货栈烧着了。'),c:'bad',fx:{happy:-3,f:(s,c)=>{c.won=0}},next:'cr_guild3',keep:1}]},
  {l:T('Light the other guild’s warehouse yourself','自己去点对家的货栈'),out:[
   {w:s=>s.t.luck*.2+.3,t:T('Nobody sees you. The flames are beautiful and terrible. Your employer is very, very pleased.','没人看见你。火光又美又吓人。你的东家高兴得不得了。'),c:'muted',fx:{align:-10,f:(s,c)=>{c.won=1;c.dark=1}},next:'cr_guild3',keep:1},
   {w:1,t:T('A night watchman sees you clearly. Wanted posters follow, with a fair likeness.','一个更夫把你看得清清楚楚。没几天就贴出了告示，画像还挺像。'),c:'bad',fx:{align:-8,wanted:1,f:(s,c)=>{c.won=0;c.dark=1}},next:'cr_guild3',keep:1}]}]});
I({id:'cr_guild3',only:1,noThread:1,
 text:c=>c.truce?T('With the wharf shared, both guilds want to reward you, mostly to make sure you stay on their side.','码头分好了，两家都想谢你，主要是想让你站在自己这边。')
  :c.won?T(`The ${c.side==='tea'?'Tea':'Silk'} Guild wins the wharf. Its master sends for you.`,`${c.side==='tea'?'茶行':'丝行'}拿下了码头。会首派人来请你。`)
  :T(`The ${c.side==='tea'?'Tea':'Silk'} Guild loses the wharf. Its master still owes you something, and knows it.`,`${c.side==='tea'?'茶行':'丝行'}丢了码头。会首自知还欠你一份情。`),
 opts:[{l:T('Take your pay','拿钱走人'),out:[
   {w:(s,c)=>c.won?3:.5,t:c=>T(`A heavy purse${c.dark?', and a look that says he will never trust you':''}.`,`沉甸甸一袋银子${c.dark?'，外加一个“此人再也信不得”的眼神':''}。`),c:'good',fx:(s,c)=>({money:c.truce?rint(120,180):rint(80,140)})},
   {w:(s,c)=>c.won?.5:3,t:T('A light purse and an apology. Losing is expensive for everyone.','一袋轻飘飘的银子，外加一句抱歉。输了的那方，谁都赔不起。'),c:'muted',fx:{money:[15,35]}}]},
  {l:T('Ask for a share in the guild instead','不要钱，要入股'),out:[
   {w:(s,c)=>(c.won?1:.2)*(s.smarts/30+s.fame/40),t:T('He hesitates, then agrees. Your little share pays out handsomely the next year, and the year after.','他犹豫了一下，答应了。你那一小股，第二年、第三年都分了不少红。'),c:'gold',fx:s=>({money:Math.round(rint(150,260)*crP(s)),fame:1})},
   {w:1.5,t:T('He laughs. "A share? You?" He pays you forty and shows you the door.','他笑了。“入股？就你？”他给了四十两，把你送出了门。'),c:'muted',fx:{money:40,happy:-2}}]}]});

/* ================= big: the caravan venture ================= */
I({id:'cr_caravan1',age:[20,70],cd:20,w:s=>crJob(s,'merchant','escort','boatman')?2.5:1.4,tags:CR_T,when:s=>s.money>=120,ctx:s=>{const c=scene();c.sea=['east','jiangnan'].includes(s.region);c.npc=npc(s,{occ:c.sea?5:23,age:rint(35,55),sex:'m'});c.lv2=PW(.9,4)(s);c.ok=1;return c},
 text:c=>c.sea?T(`${c.npc.en} is fitting out a junk for the southern islands: silk out, pepper and sandalwood back. Shares are 100 taels. "Three times your money, if the sea is kind."`,`${c.npc.zh}在装一条去南洋诸岛的大船：运丝绸出去，换胡椒檀香回来。一股一百两。“海神爷赏脸，本钱翻三番。”`)
  :T(`${c.npc.en}, a western merchant, is putting together a caravan over the passes: tea and porcelain out, jade and horses back. Shares are 100 taels. "Three times your money, if the road is kind."`,`西域商人${c.npc.zh}在攒一支翻山的商队：运茶叶瓷器出去，换玉石马匹回来。一股一百两。“路上太平，本钱翻三番。”`),
 opts:[{l:T('Buy a share (100 taels)','入一股（一百两）'),cost:100,out:[
   {w:s=>s.smarts/30,t:T('You insist on a written contract with a clause for losses. He grumbles and signs.','你坚持立字据，写明亏了怎么赔。他嘟囔着签了字。'),c:'muted',fx:{f:(s,c)=>{c.contract=1}},next:'cr_caravan2',keep:1},
   {w:2,t:T('A handshake and a cup of wine. The venture sets off without you.','击掌为誓，一杯酒下肚。货队出发了，你留在原地等消息。'),c:'muted',next:'cr_caravan2',keep:1}]},
  {l:T('Buy a share and go along as a guard (100 taels)','入一股，还跟着去押货（一百两）'),cost:100,if:s=>power(s)>=25,out:[
   {w:s=>power(s)/50,t:T('The men respect you from the first day. You sleep with your hand on your sword.','头一天起伙计们就服你。你睡觉时手都按在剑上。'),c:'muted',fx:{f:(s,c)=>{c.along=1}},next:'cr_caravan2',keep:1},
   {w:1,t:T('The men think you are a rich fool playing at adventure. You will have to show them.','伙计们觉得你是个有钱没处花、出来找乐子的傻子。得让他们见识见识。'),c:'muted',fx:{f:(s,c)=>{c.along=1}},next:'cr_caravan2',keep:1}]},
  {l:T('Decline','不入股'),out:[
   {w:2,t:T('You keep your silver. You never learn how it went, which is its own small torment.','银子没动。你始终不知道那趟买卖怎样了，这本身就是种小小的折磨。'),c:'muted'},
   {w:s=>s.t.luck*.15,t:T('A year later you hear the whole venture was lost. You light a stick of incense for the men, and for your luck.','一年后你听说那一趟全军覆没。你为那些人点了一炷香，也为自己的运气。'),c:'muted',fx:{happy:2}}]}]});
I({id:'cr_caravan2',only:1,noThread:1,
 text:c=>c.along?(c.sea?T('Off the coast, a pirate junk runs up beside you, hooks ready.','出海没多远，一条海盗船靠了上来，挠钩都备好了。'):T('In a high pass, riders come over the ridge, bows strung.','在高高的山口，一伙马贼从山梁上冲了下来，弓都上了弦。'))
  :T(`Months pass with no word from ${c.npc.en}. Then a letter: the venture is stuck, and they need 30 more taels from each partner for ${c.sea?'harbour fees and repairs':'tolls and fresh camels'}.`,`几个月没有${c.npc.zh}的音信。后来来了一封信：货队卡住了，每个股东得再出三十两，${c.sea?'交港口税、修船':'交关税、换骆驼'}。`),
 opts:[{l:T('Fight them off','打退他们'),if:(s,c)=>!!c.along,fight:FG((s,c)=>c.lv2,'injury',T('Raiders on the route','商路遇劫'),T('raiders on the trade route','劫道的强人'),(c)=>c.sea?T('the pirates','海盗'):T('the raiders','马贼')),
   win:[{t:T('They break off. The men drink to you every night for the rest of the trip.','他们退了。剩下的一路，伙计们每晚都敬你一碗酒。'),c:'good',fx:{fame:2,f:(s,c)=>{c.ok=2}},next:'cr_caravan3',keep:1}],
   lose:[{t:T('They take a third of the cargo, and nearly you with it.','他们抢走了三成的货，差点连你也一起抢走。'),c:'bad',fx:{f:(s,c)=>{c.ok=0}},next:'cr_caravan3',keep:1}]},
  {l:T('Pay 30 more taels','再出三十两'),cost:30,out:[
   {w:s=>s.smarts/40+1,t:T('The money arrives in time. The venture moves again.','钱及时到了，货队又动起来了。'),c:'muted',fx:{f:(s,c)=>{c.ok=2}},next:'cr_caravan3',keep:1},
   {w:1,t:T('The money is spent, and then more is needed. You begin to wonder.','钱花了，接着又要钱。你开始犯嘀咕。'),c:'muted',fx:{f:(s,c)=>{c.ok=1}},next:'cr_caravan3',keep:1}]},
  {l:c=>c.along?T('Hide the best cargo and parley','藏好细货，跟他们谈'):T('Refuse, and wait','不出钱，等着'),out:[
   {w:s=>s.t.luck*.3+s.smarts/60,t:T('Somehow, it works out. Luck or cunning, nobody can say.','不知怎的，事情竟顺过去了。是运气还是心眼，谁也说不清。'),c:'muted',fx:{f:(s,c)=>{c.ok=2}},next:'cr_caravan3',keep:1},
   {w:1.5,t:T('Things go slowly wrong, the way they do.','事情一点点坏下去，向来如此。'),c:'muted',fx:{f:(s,c)=>{c.ok=chance(.5)?1:0}},next:'cr_caravan3',keep:1}]}]});
I({id:'cr_caravan3',only:1,noThread:1,
 text:c=>c.ok===2?T(`The venture returns, heavy with ${c.sea?'pepper and sandalwood':'jade and fine horses'}. ${c.npc.en} is grinning.`,`货队回来了，满载${c.sea?'胡椒檀香':'玉石良马'}。${c.npc.zh}笑得合不拢嘴。`)
  :c.ok===1?T('The venture limps home, half its cargo sold off along the way to pay for trouble.','货队一瘸一拐地回来了，一半的货在路上为了平事卖掉了。')
  :T(`The venture comes back as three men and a mule. ${c.npc.en} will not look at you.`,`回来的只剩三个人一头骡子。${c.npc.zh}不敢看你。`),
 opts:[{l:T('Take your share in silver','分银子'),out:[
   {w:s=>1+s.t.luck*.15,t:c=>T(c.ok===2?'Prices are good this season. Your share is better than promised.':c.ok===1?'You get most of your stake back, and a little over.':c.contract?'The contract clause saves you: he pays back sixty, grimly.':'Nothing. A handshake was worth exactly what you paid for it.',c.ok===2?'这一季行情好，你分的比说好的还多。':c.ok===1?'本钱大半回来了，还略有赚头。':c.contract?'字据救了你：他咬着牙退了六十两。':'一文没有。那一击掌，值的正好是你付的钱。'),c:'muted',fx:(s,c)=>({money:Math.round((c.ok===2?rint(300,420):c.ok===1?rint(110,150):c.contract?60:0)*Math.min(1.5,crP(s))),happy:c.ok===2?6:c.ok===1?1:-5})},
   {w:2,t:c=>T(c.ok===2?'Three times your money, as promised.':c.ok===1?'Your stake back and not much else.':c.contract?'The contract saves you sixty taels.':'Nothing at all.',c.ok===2?'本钱翻了三番，说话算话。':c.ok===1?'本钱回来了，别的没有。':c.contract?'字据给你保住了六十两。':'什么都没剩下。'),c:'muted',fx:(s,c)=>({money:c.ok===2?rint(260,320):c.ok===1?rint(90,120):c.contract?60:0,happy:c.ok===2?5:c.ok===1?0:-5})}]},
  {l:T('Take your share in goods and sell them yourself','分货，自己去卖'),if:(s,c)=>c.ok>0,out:[
   {w:s=>s.smarts/30,t:T('You know exactly who will pay what. You make far more than the silver would have been.','谁出什么价你心里有数。比直接分银子赚得多多了。'),c:'gold',fx:(s,c)=>({money:Math.round((c.ok===2?rint(380,520):rint(150,200))*Math.min(1.5,crP(s))),smarts:1,happy:5})},
   {w:1.5,t:T('Everyone else had the same idea. The market is flooded and you sell at a loss.','别人也都这么想。市面上全是这种货，你只能贱卖。'),c:'bad',fx:(s,c)=>({money:c.ok===2?rint(150,200):rint(60,80),happy:-2})}]}]});

/* ================= big: the courtesan’s salon ================= */
I({id:'cr_salon1',age:[18,60],once:1,w:1.2,tags:CR_T,when:s=>s.fame>=15||s.looks>=60||s.smarts>=60,ctx:s=>{const c=scene();c.npc=npc(s,{occ:6,age:rint(22,30),sex:'f'});return c},
 text:c=>T(`${c.npc.en} is the most famous courtesan on the river. Poets fight duels over her opinions. Her salon admits only those she finds interesting, and tonight there is a card with your name on it, if you can earn it.`,`${c.npc.zh}是这条河上最有名的花魁。诗人们为她一句评语能打起来。她的雅集只请她觉得有意思的人，今晚有一张帖子写着你的名字，就看你配不配得上。`),
 opts:[{l:T('Bring a poem','带一首诗去'),out:[
   {w:s=>s.smarts/25+s.looks/80,t:T('She reads it twice, then sends the others home early.','她读了两遍，然后打发别的客人早些回去。'),c:'good',fx:{fame:1},next:'cr_salon2',keep:1},
   {w:1.5,t:T('She smiles politely and moves on to a man with a better poem and worse teeth.','她客气地笑了笑，转身去看一个诗写得更好、牙长得更差的人。'),c:'muted',fx:{happy:2}}]},
  {l:T('Bring an expensive gift (60 taels)','带一份厚礼（六十两）'),cost:60,out:[
   {w:s=>s.looks/40+s.fame/40,t:T('The gift buys you the door. Your conversation buys you the inner room.','礼物让你进了门，谈吐让你进了内室。'),c:'good',next:'cr_salon2',keep:1},
   {w:1.5,t:T('She sends the gift back with a note: "I can be bought, but not by you." Half the price comes back with it.','她把礼退了回来，附了张字条：“我可以被买，但不是被你。”退回来的还有一半的钱。'),c:'bad',fx:{money:30,happy:-4}}]},
  {l:T('Not your kind of evening','这种场合不适合你'),out:[
   {w:2,t:T('You spend the evening in a noodle shop. The noodles are excellent and nobody judges your poetry.','你在面馆里过了一晚。面很好，没人评你的诗。'),c:'muted'},
   {w:s=>s.fame/40,t:T('Your absence is noticed. In the river city, not coming is its own kind of statement.','你没去，倒被人注意到了。在这河港城里，不去本身就是一种表态。'),c:'muted',fx:{fame:1}}]}]});
I({id:'cr_salon2',only:1,noThread:1,
 text:c=>T(`Late, with the other guests gone, ${c.npc.en} drops the act. A minister’s son means to buy her contract and carry her off. She has saved 200 taels to buy her own freedom first, but the madam will not take it from her hand. She needs someone to make the offer for her.`,`夜深客散，${c.npc.zh}卸下了笑脸。一位尚书的公子要替她赎身，把她带走。她攒了二百两，想抢先给自己赎身，可鸨母不肯从她手里收钱。她需要一个人替她出面。`),
 opts:[{l:T('Do it, honestly','照实替她办'),out:[
   {w:s=>s.fame/30+s.smarts/40,t:c=>T(`The madam takes the silver and signs. ${c.npc.en} leaves the river at dawn with one trunk. Her letters come from the south for years.`,`鸨母收了银子，画了押。天亮时${c.npc.zh}提着一只箱子离开了这条河。此后多年，她的信从南方寄来。`),c:'gold',fx:{align:5,fame:2,meet:'friend',bond:80,deed:T('Helped a famous courtesan buy her own freedom','助一代花魁自赎其身')}},
   {w:1.5,t:c=>T(`The minister’s son bids higher. You put in fifty of your own to close the deal. ${c.npc.en} says she will repay you. You both know she cannot.`,`尚书公子加了价。你自掏五十两才把事办成。${c.npc.zh}说一定还你。你们俩都知道她还不了。`),c:'good',fx:{money:-50,align:6,meet:'friend',bond:85}}]},
  {l:T('Keep the 200 taels','把二百两吞了'),out:[
   {w:s=>s.t.luck*.2,t:T('You vanish with the silver. On quiet nights you hear a lute on the river and leave the room.','你带着银子消失了。夜深人静时听到河上的琵琶声，你就起身出门。'),c:'muted',fx:{money:200,align:-12,happy:-3}},
   {w:1.5,t:T('She expected it. Half her regular guests are constables. You are caught before you reach the city gate.','她早料到了。她的常客里一半是捕快。你还没到城门就被拿下了。'),c:'bad',fx:{align:-10,fame:-2,jail:1}}]},
  {l:T('Tell her to wait and see','劝她再等等看'),out:[
   {w:2,t:T('She thanks you coolly. A month later her boat is gone from the river, and nobody will say where.','她淡淡地谢了你。一个月后，她的画舫从河上消失了，没人肯说去了哪儿。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.t.luck*.12,t:T('She does it herself, through someone braver. Years later you see her running a teahouse, laughing, and she waves.','她找了个更有胆的人，自己办成了。多年后你见她开了家茶楼，笑得很响，还冲你招手。'),c:'muted',fx:{happy:2}}]}]});
