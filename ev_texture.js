/* 江湖一生 · the texture of ordinary days: how training, reading and rest actually feel, and the small moments that fill a year */
'use strict';
const tx=(en,zh)=>()=>T(en,zh);
const W_=s=>s.sect?SECTS[s.sect].wpn:null;
const hurtNow=s=>s.health<s.maxHealth*.5;

/* ---------- how an action feels ---------- */
FLAVOR.practice=[
 tx('You drill the same three forms until the light goes and your shadow disappears into the yard.','你把同样三式翻来覆去地练，练到天光散尽，影子融进了院子里。'),
 tx('Rain all afternoon. You practise anyway; the mud teaches your feet more than the master ever did.','下了一下午的雨。你照练不误，泥地教给你脚下的，比师父教的还多。'),
 tx('You punch a sandbag filled with iron filings until your knuckles split, then wrap them and go on.','你一拳拳打着装满铁砂的沙袋，指节裂开了，裹上布条接着打。'),
 tx('You walk the top of the courtyard wall, back and forth, until you stop looking at your feet.','你在院墙顶上来回走，直到不再低头看脚。'),
 tx('A cold dawn. Your breath steams as you hold the horse stance and count to a thousand.','寒冷的清晨。你扎着马步数到一千，呼出的气一团团白雾。'),
 tx('You practise alone by the river. A heron watches you the whole time and is not impressed.','你独自在河边练功。一只鹭鸶看了你整整一下午，不以为然。'),
 tx('You go over a single move a hundred times. On the hundred-and-first, something finally clicks.','一招练了一百遍，到第一百零一遍，忽然通了。'),
 tx('The summer heat is brutal. You train in the shade of the well and soak your head between sets.','暑气逼人。你在井边的树荫下练，练一阵就把头浸进水桶里。'),
 {when:s=>!!W_(s),t:s=>T(`You work the ${W_(s).en.toLowerCase()} forms of your sect until the movements stop being something you remember and start being something you are.`,`你练本门的${W_(s).zh}法，练到招式不再需要去记，而是长在了身上。`)},
 {when:s=>s.age<13,t:tx('You copy the grown-ups’ stances with a stick for a sword. Your arms shake, but you do not drop it.','你拿根树枝当剑，学大人摆架势。胳膊直发抖，可就是不撒手。')},
 {when:s=>s.age<13,t:tx('You practise kicks against the old elm until the bark is worn smooth at the height of your knee.','你对着老榆树练踢腿，树皮在你膝盖那么高的地方磨得光溜溜的。')},
 {when:s=>s.age>=60,t:tx('Slower now. You move through the forms like water finding its way downhill, and waste nothing.','如今慢了。你一招一式，像水往低处流，一分力气也不浪费。')},
 {when:s=>s.age>=60,t:tx('Your knees complain on the low stances. Your hands, though, are faster than they were at forty.','低桩时膝盖直叫苦。可你的手，比四十岁时还快。')},
 {when:hurtNow,t:tx('You train around the wound, favouring one side. It is slow, and it is still worth doing.','你避着伤处练，偏着一边使劲。慢是慢，但不能停。')},
 {when:s=>s.realm>=4,t:tx('You stand in the yard and practise nothing at all, only intention. A leaf falls; you could have cut it twice.','你站在院中，一招不出，只练意。一片叶子落下，你本可以斩它两回。')},
 {when:s=>s.region==='north'||s.region==='west',t:tx('You practise in a wind so strong it pushes you off balance. By evening you have learned to lean into it.','风大得能把人推倒。你在风里练，到傍晚已学会顺着风势借力。')},
 {when:s=>s.region==='jiangnan'||s.region==='east',t:tx('You practise footwork on the wet stones of the canal steps, where one slip means a swim.','你在河埠头湿滑的石阶上练步法，一脚踩空就得下水。')},
 {when:s=>s.region==='shu'||s.region==='miao',t:tx('Mist so thick you cannot see your own hand at full stretch. You practise by feel.','雾浓得伸直了手都看不见指尖。你凭感觉练。')}
];
FLAVOR.meditate=[
 tx('You sit until the noises of the house fade one by one: the kitchen, the dog, the wind, your own heartbeat.','你静坐着，屋里的声音一样样远去：灶房、狗吠、风声，最后是自己的心跳。'),
 tx('Your legs go numb, then stop mattering. A thread of warmth moves slowly up your spine.','腿先麻了，后来就顾不上了。一缕暖意沿着脊背慢慢往上走。'),
 tx('You meditate at dawn, facing east. The first light on your eyelids feels like something entering.','你清晨面东打坐。第一缕光落在眼皮上，像有什么东西流了进来。'),
 tx('Your mind will not settle. You count breaths, lose count, start again. Somewhere after the fortieth try, it settles.','心总定不下来。你数呼吸，数乱了，重来。不知第几十回，它自己定了。'),
 tx('You sit under the eaves while it rains. Each drop is a single, separate sound.','你坐在屋檐下听雨。每一滴都是单独的一声。'),
 {when:s=>s.age>=60,t:tx('Meditation comes easily now. It is the getting up afterwards that takes effort.','如今入定容易了。难的是坐完之后站起来。')},
 {when:s=>s.sect==='shaolin'||s.sect==='emei',t:tx('The evening chanting drifts through the hall as you sit. You let the sound carry your breath.','你打坐时，晚课的诵经声从殿里飘来。你让呼吸随着那声音起落。')},
 {when:s=>s.sect==='wudang'||s.sect==='quanzhen',t:tx('You sit on the cliff platform where the Daoists greet the sun, and try to be as still as the rock.','你坐在道士们迎日的崖台上，想像石头一样纹丝不动。')},
 {when:hurtNow,t:tx('You guide your qi around the injury, slowly, like leading water around a stone.','你引着真气绕过伤处，慢慢地，像引水绕开一块石头。')}
];
FLAVOR.read=[
 tx('You read the Analects by lamplight until the oil runs low and the characters swim.','你挑灯读《论语》，读到灯油将尽、字在眼前晃。'),
 tx('You read a military treatise and spend the evening arranging teacups into battle formations.','你读了一部兵书，一晚上都在拿茶杯摆阵。'),
 tx('You copy out an old medical text, slowly, and learn three herbs you have walked past all your life.','你一笔一划抄一本古医书，认出了三种你天天路过却不认识的草药。'),
 tx('You read poetry until you fall asleep on the page and wake with a line printed on your cheek.','你读诗读到伏案睡去，醒来脸上印着半句诗。'),
 tx('You read a travel diary by a monk who walked to India. You did not know the world was so wide.','你读一个和尚西行天竺的游记，才知道天下这样大。'),
 tx('You borrow a book of strange tales and read it in one night with the door barred.','你借来一本志怪笔记，闩上门一夜读完。'),
 {when:s=>s.age<13,t:tx('You learn twenty new characters and write them in the dust with your finger, over and over.','你学了二十个新字，用手指在尘土上一遍遍地写。')},
 {when:s=>s.age>=60,t:tx('You need the window light now, and your finger to keep your place. The words are as good as ever.','如今得凑着窗光，还得用手指按着行。可书还是那么好。')},
 {when:s=>s.smarts>=70,t:tx('You read a commentary and find a mistake in it that nobody has noticed for three hundred years.','你读一部注疏，发现了一处三百年来没人留意的错。')}
];
FLAVOR.rest=[
 tx('You sleep until noon, eat a whole steamed fish, and sleep again.','你一觉睡到晌午，吃了一整条清蒸鱼，又接着睡。'),
 tx('You lie in the courtyard and watch the clouds change shape all afternoon. Your body mends.','你躺在院子里看了一下午的云。身子慢慢养好了。'),
 tx('You soak in hot water with ginger and salt until the bruises stop aching.','你泡在加了姜和盐的热水里，泡到瘀青不再作痛。'),
 tx('You do nothing at all for a month. It is harder than it sounds, and it works.','你整整一个月什么也没干。这比听起来难，但管用。'),
 {when:s=>!!spouseOf(s),t:s=>T('Your spouse refuses to let you out of bed and brings you broth three times a day.','你的另一半不许你下床，一天端三回汤来。')},
 {when:s=>owned(s,'pet').length>0,t:tx('You rest with your pet curled against your side, which is the best medicine there is.','你歇着，宠物蜷在你身边。这是最好的药。')},
 {when:s=>s.age>=60,t:tx('You rest in the sun like an old cat. The neighbours’ children tiptoe past.','你像只老猫一样晒着太阳歇着。邻家孩子都踮着脚走过去。')}
];
FLAVOR.doctor=[
 tx('The doctor feels your pulse for a long time, sighs, and writes a prescription with nine ingredients.','大夫给你把了很久的脉，叹了口气，开了个九味药的方子。'),
 tx('The doctor sets your bones with a crunch that you hear more than feel, then gives you foul-smelling plasters.','大夫给你正骨，咔嚓一声你听得比疼得还清楚，然后给你贴上臭烘烘的膏药。'),
 tx('Acupuncture: a dozen needles, a strange heaviness, then sleep.','针灸：扎了十来根针，浑身一阵沉，然后就睡着了。'),
 tx('The medicine is so bitter you cannot believe anything that tastes like that could help. It does.','药苦得你不信这东西能治病。可它真治好了。'),
 {when:s=>s.region==='miao',t:tx('The Miao healer burns a bundle of herbs over you and mutters in a language you do not know.','苗医在你身上熏了一把草药，嘴里念着你听不懂的话。')}
];
FLAVOR.chore=[
 tx('You carry water up eight hundred stone steps before breakfast. By the last bucket your legs are someone else’s.','早饭前你挑水上八百级石阶。到最后一担，腿已经不是自己的了。'),
 tx('You sweep the training ground before the morning bell. The leaves keep falling; you keep sweeping.','晨钟响前你打扫练武场。叶子一直落，你就一直扫。'),
 tx('You copy out the sect rules by lamplight. Your brush hand is steadier than your sword hand, which worries you.','你在灯下抄写门规。握笔的手比握剑的手还稳，这让你有点担心。'),
 tx('Night watch at the mountain gate. Nothing comes but an owl and, near dawn, a very confused pilgrim.','夜里守山门。除了一只猫头鹰，就是天亮前一个迷了路的香客。'),
 tx('You chop firewood for the kitchens until the pile is taller than you and the cook finally nods.','你给伙房劈柴，劈到柴堆比你还高，伙头才终于点了点头。'),
 tx('You help the elders sort medicinal herbs, and are scolded twice for mixing up two roots that look identical.','你帮长老们分拣药材，有两样根长得一模一样，你弄混了，挨了两回骂。'),
 {when:s=>s.sect==='beggar',t:tx('You go begging with the juniors to keep the old customs, and come back with rice, gossip and a dog.','你按老规矩带着师弟们去讨饭，带回来米、闲话，还有一条狗。')},
 {when:s=>s.sect==='peach',t:tx('You prune the peach trees in the maze. Get one branch wrong and visitors walk out instead of in.','你去修剪迷阵里的桃树。剪错一根枝，客人就会走出去而不是走进来。')},
 {when:s=>s.sect==='gumu',t:tx('You tend the orchid bees. They know you by now, and only sting you on bad days.','你照看幽兰蜂。它们认得你了，只在你心情不好时才蜇你。')}
];
FLAVOR.chore_evil=[
 tx('You collect protection money from the night market. Nobody argues. You do not enjoy how easy it is.','你去夜市收保护费。没人敢吭声。这么容易，反倒让你不舒服。'),
 tx('You stand guard over the cellar where they keep the prisoners. Someone down there hums the same tune all night.','你在关押囚犯的地窖口站岗。下面有人一整夜都在哼同一支曲子。'),
 tx('You carry a sealed box to a man in a teahouse. You are told not to look inside, and you do not.','你把一只封好的匣子送到茶馆里一个人手上。上头说别看，你就没看。'),
 tx('At the morning assembly you shout the lord’s praises with everyone else, and watch who shouts too quietly.','早会上你跟着众人高喊教主圣明，一边留意谁喊得太小声。'),
 tx('You mix poisons under supervision. One wrong measure and the man next to you goes blind. Not this time.','你在人监督下配毒。一钱之差，身边的人就会瞎。这回没有。')
];
const JOBF={
 waiter:[['You run plates up and down the stairs from dawn till the last drunk is carried home.','你从天亮跑堂跑到最后一个醉鬼被抬回家，楼梯上下不知多少趟。'],['A guest in a bamboo hat tips you a silver piece for keeping his table quiet.','一个戴斗笠的客人赏了你一块碎银，只因你替他把那桌清净守住了。']],
 porter:[['You carry sacks of rice off the boats until your shoulders are raw and the foreman calls it a day.','你从船上扛米包，扛到肩膀磨破，监工才喊收工。'],['You learn to tell a smuggler’s crate by its weight.','你学会了掂分量就能认出私货箱子。']],
 smith:[['You work the bellows until the iron glows white and your eyebrows are a memory.','你拉风箱拉到铁烧得发白，眉毛都快没了。'],['You quench a blade and listen to it sing as it cools.','你淬了一把刀，听它在冷水里嘶嘶作响。']],
 clerk:[['You balance the ledgers by candlelight and find seven taels nobody can explain.','你挑灯对账，查出七两银子来路不明。'],['You learn more about the town from its account books than from its gossip.','你从账本上了解这个镇子，比听闲话知道得还多。']],
 tutor:[['You teach a roomful of children the Thousand Character Classic. One of them is actually listening.','你教满屋孩子念《千字文》，其中一个是真在听。'],['A pupil asks why heaven is round and earth square. You do not have a good answer.','学生问你为什么天圆地方，你答不上来。']],
 doctor:[['You go out at midnight in the rain to a farmhouse where a child has a fever.','半夜冒雨出诊，去一户农家看发烧的孩子。'],['You set a broken arm, stitch a cut and argue with a patient who wants a charm instead.','你接了一条断臂，缝了一道伤口，还跟一个只想求符的病人争了半天。']],
 story:[['Your tale of the hero of Liangshan has the teahouse holding its breath.','你讲梁山好汉，满茶馆的人都屏住了气。'],['You get the ending wrong on purpose so they come back tomorrow.','你故意把结尾留个扣子，好让他们明天再来。']],
 actor:[['You rehearse the same aria a hundred times until the troupe master stops wincing.','同一段唱腔你练了一百遍，班主终于不再皱眉。'],['The painted face takes an hour to put on and a minute to sweat off under the lanterns.','脸谱画了一个时辰，在灯笼底下一分钟就被汗冲花了。']],
 guard:[['You walk the walls of the rich man’s house all night and see nothing but cats.','你在富户家的墙头巡了一夜，只看见几只猫。'],['A thief tries the back gate; your shout is enough to send him running.','有个贼来撬后门，你一嗓子就把他吓跑了。']],
 constable:[['You chase a pickpocket through three markets and catch him with a fish in each hand.','你追一个扒手追过三个集市，抓住他时他两手各拎着一条鱼。'],['You spend the day writing reports nobody will read about a stolen chicken.','你花了一整天写一只鸡被偷的公文，不会有人看。']],
 escort:[['A long, dusty run through the hills, singing the escort chant at every pass so the bandits know who you are.','一趟又长又累的镖，每过一个山口都喊镖号，好让山上的人知道是谁。'],['You sleep with one hand on the silver chest and wake at every owl.','你一只手搭在镖箱上睡觉，猫头鹰一叫就醒。']],
 assassin:[['You wait three days on a rooftop for a man who never comes out. Patience is most of the job.','你在屋顶上等了三天，那人始终没出门。这行当大半是耐性。'],['You burn the name you were given, as is the custom, and go to work.','你按规矩烧了写着名字的纸条，然后去干活。']],
 official:[['You hear petitions all morning: a stolen ox, a disputed well, a widow cheated of her land.','你一上午都在听人告状：丢了的牛、争水的井、被骗走田地的寡妇。'],['A rich man sends a box of “tea” that is suspiciously heavy.','一个富户送来一盒"茶叶"，沉得可疑。']],
 boatman:[['You pole the ferry across forty times. The river is calm, and the passengers are not.','你撑船来回渡了四十趟。河水平静，乘客可不平静。'],['Fog on the river. You steer by the sound of the bank dogs.','江上起雾。你听着岸边的狗叫掌舵。']],
 cook:[['You bone forty ducks before noon, and the head cook says your knife work is “almost acceptable”.','晌午前你剔了四十只鸭子，大厨说你的刀工"勉强能看"。'],['A guest sends back the soup. You taste it, and he is right.','一位客人把汤退了回来。你尝了一口，他说得对。']],
 herbalist:[['You climb the cliffs at dawn for a herb that only opens in the first light.','你天不亮就爬上山崖，去采一种只在晨光里开花的药。'],['You grind roots in the back of the shop until everything you own smells of ginseng.','你在铺子后头碾药根，碾到身上的衣服都一股人参味。']],
 hunter:[['You track a deer for a whole day and let it go when you see it has a fawn.','你追一头鹿追了一整天，看见它带着小鹿，就放它走了。'],['You set snares along the stream and come home with two hares and wet boots.','你沿溪下套，带回两只野兔和一双湿鞋。']],
 courier:[['You ride through the night with a sealed dispatch and change horses at three stations.','你连夜送一封封好的公文，换了三站的马。'],['Your horse throws a shoe in the mountains; you walk the last twenty li with the satchel on your back.','马在山里掉了掌，你背着信袋走完了最后二十里。']],
 fortune:[['You read the palm of a nervous bride and tell her only the good parts.','你给一个紧张的新娘看手相，只挑好的说。'],['A soldier asks if he will survive the war. You look at his hand for a long time.','一个兵问你他能不能活过这场仗。你盯着他的手看了很久。']],
 merchant:[['You haggle for three hours over a shipment of tea and win by two coppers a catty.','你为一批茶叶讨价还价了三个时辰，每斤赢了两文。'],['You count the silver twice and the risk three times.','银子你数两遍，风险你算三遍。']],
 instructor:[['You correct the same stance in twenty students. One of them finally gets it.','同一个架势你给二十个学生纠了一遍，终于有一个对了。'],['A rich man’s son demands to learn the secret move on the first day. You give him a broom.','一个富家公子头一天就要学绝招。你递给他一把扫帚。']],
 bounty:[['You follow a wanted man’s trail through four counties and find him asleep in a temple.','你追一个通缉犯追过四个县，在一座庙里找到了睡着的他。'],['The poster says dead or alive. You prefer alive; it is less paperwork, and you sleep better.','告示上写着死活不论。你更喜欢活的：手续少，也睡得踏实。']],
 enforcer:[['You stand in the doorway of the gambling den and look large. It is most of the job.','你往赌坊门口一站，显得块头大。这差事大半就是这样。'],['A man who lost everything tries to burn the place down. You stop him, and feel worse than he does.','一个输光了的人要烧赌坊。你拦下了他，心里比他还难受。']],
 smuggler:[['You move a boat of salt down a back channel at night with no lamps and no talking.','你夜里摸黑走小河道运一船私盐，不点灯，也不说话。'],['You bribe a customs clerk with his favourite wine. He drinks it in front of you and waves you through.','你拿关卡小吏最爱的酒贿赂他。他当着你的面喝了，挥手放行。']],
 jinyiwei:[['You stand behind a screen and listen to an official talk himself into prison.','你站在屏风后面，听一个官员自己把自己说进了大牢。'],['You wear the flying-fish robe through the market and watch the crowd part without a word.','你穿着飞鱼服走过集市，人群一声不吭地让开了路。']]
};
Object.keys(JOBF).forEach(k=>{FLAVOR['work_'+k]=JOBF[k].map(l=>tx(l[0],l[1]))});

/* ---------- the small moments that fill a year ---------- */
const TX=(a,b,en,zh,when,w)=>TEXTURE.push({age:[a,b],w:w||1,when,t:tx(en,zh)});
/* childhood */
TX(2,6,'You learn that the stove is hot. Once is enough.','你知道了灶台是烫的。一次就够了。');
TX(3,8,'The first cicada of summer starts up in the locust tree while you are still half asleep.','你还没睡醒，院里老槐树上就响起了今夏第一声蝉鸣。');
TX(3,9,'You lose a tooth in a rice cake and are prouder of it than of anything so far.','你啃年糕崩掉一颗牙，比这辈子任何事都得意。');
TX(3,10,'A peddler’s drum sounds in the lane and every child on the street runs out at once.','巷子里响起货郎鼓，满街的孩子一齐跑了出来。');
TX(4,10,'You spend a whole afternoon watching ants carry a dead beetle home.','你看了一下午的蚂蚁搬一只死甲虫回家。');
TX(4,10,'Your grandmother teaches you a counting rhyme about seven fierce ducks.','祖母教你一首数七只凶鸭子的童谣。');
TX(4,11,'You fall asleep on the threshing floor and someone carries you home without waking you.','你在打谷场上睡着了，有人把你抱回家，你都没醒。');
TX(5,11,'You learn to whistle with a blade of grass and do not stop for a week.','你学会了用草叶吹哨，一个礼拜都没停。');
TX(5,12,'You find a turtle in the ditch and keep it in a basin until your mother makes you put it back.','你在沟里捉到一只乌龟，养在盆里，直到娘逼着你放回去。');
TX(5,12,'A thunderstorm in the night. You and your siblings count between the flash and the roar.','夜里打雷。你和兄弟姐妹数着闪电和雷声之间隔了几下。','',1);
TX(6,12,'You are sent to buy soy sauce and come back two hours later with a story and no soy sauce.','家里让你去打酱油，两个时辰后你回来了，带着一肚子故事，没带酱油。');
TX(6,12,'You watch a travelling acrobat balance a stack of bowls on his forehead and try it at home with one.','你看杂耍艺人用额头顶一摞碗，回家拿一只碗试了试。');
TX(6,12,'Your first winter chilblains. Your mother rubs them with chili-soaked wine every night.','你头一回生冻疮。娘每晚用泡了辣椒的酒给你搓。');
TX(6,12,'You and a friend bury a "treasure" box and swear to dig it up in ten years.','你和伙伴埋下一只"宝盒"，发誓十年后一起挖出来。');
TX(7,12,'You learn that the river is deeper than it looks, the hard way.','你吃了苦头才知道，河比看上去深。');
TX(7,12,'A kite gets caught in the tallest tree in the village. You climb half way and think better of it.','风筝挂在了村里最高的树上。你爬到一半，又想了想，下来了。');
/* teens */
TX(13,17,'Your voice cracks in the middle of reciting a poem in front of the whole family.','你当着全家人背诗，声音背到一半劈了。');
TX(13,17,'You grow so fast this year that your trousers are always too short.','这一年你长得太快，裤子总是短一截。');
TX(13,17,'You climb onto the roof at night to look at the stars and think large, vague thoughts.','你夜里爬上屋顶看星星，想着些又大又模糊的事。');
TX(13,18,'You notice someone at the well every morning and start going for water at exactly that time.','你发现每天早上井边都有那个人，于是你也恰好在那时候去打水。');
TX(13,18,'You and your friends dare each other to walk through the graveyard at midnight. Nobody quite makes it.','你和伙伴们打赌半夜穿过坟地。谁也没走完。');
TX(14,18,'You read a martial novel under the blanket by moonlight and dream of rooftops.','你借着月光躲在被子里看武侠话本，梦里全是屋檐。');
TX(14,18,'You argue with your father about your future. Neither of you wins; both of you sulk.','你跟父亲争你的前程。谁也没赢，两个都赌气。');
TX(14,18,'You try your first cup of strong wine at a wedding and spend the night regretting it.','你在喜宴上头一回喝烈酒，后悔了一整夜。');
/* adult */
TX(18,59,'The plum rains come late and stay long. Everything you own smells faintly of mould.','黄梅雨来得晚、走得迟。你的东西全带着一股霉味。');
TX(18,59,'A neighbour’s rooster crows at the wrong hour all spring. Nobody has the heart to eat it.','邻居家的公鸡一整个春天都乱打鸣，谁也狠不下心吃了它。');
TX(18,59,'You mend a torn sleeve yourself, badly, and wear it with pride.','你自己补了破袖子，补得难看，穿得得意。');
TX(18,59,'An old friend writes from far away. The letter took four months and says almost nothing, and you read it five times.','远方的老友来信，走了四个月，说的几乎都是废话。你读了五遍。');
TX(18,59,'You eat a bowl of noodles at a stall by the river at midnight and decide it is the best thing you have ever tasted.','半夜在河边摊子上吃了一碗面，你觉得这是这辈子吃过最好吃的东西。');
TX(18,59,'You hear a famous swordsman has died. People talk about him for a month, and then they don’t.','听说一位成名剑客死了。人们议论了一个月，后来就没人提了。');
TX(18,59,'Your sandals wear through on a long walk and you finish the journey barefoot.','走长路磨穿了鞋，你赤着脚走完了剩下的路。');
TX(18,59,'You stand on a bridge and watch the lantern boats go by and feel, for no reason, completely content.','你站在桥上看灯船驶过，没来由地觉得什么都好。');
TX(18,59,'A stray cat adopts your doorstep. You pretend not to feed it.','一只野猫认定了你家门槛。你假装没有喂它。');
TX(18,59,'You get caught in a sudden summer storm and arrive home soaked and laughing.','你遇上一场夏天的急雨，浑身湿透地笑着跑回了家。');
TX(18,59,'Someone carves a crude sword on the wall of the teahouse and writes your name under it. You never find out who.','有人在茶馆墙上刻了一把歪歪扭扭的剑，下面写着你的名字。你始终不知道是谁。','',.5);
TX(18,59,'You buy a new pair of boots and they hurt for a month and then become the best boots you have ever owned.','你买了双新靴子，磨了一个月脚，后来成了你穿过最好的靴子。');
TX(18,59,'An earthquake rattles the cups at dawn. Nothing falls, but the whole street talks about it for days.','清晨一阵地震，杯子哐哐作响。什么也没倒，可整条街议论了好几天。','',.6);
TX(18,59,'You lend a book to a friend and never see it again. You still think about that book.','你借给朋友一本书，再也没见着。你至今还惦记那本书。');
TX(25,59,'You notice you have started saying things your father used to say.','你发现自己开始说父亲以前爱说的那些话了。');
TX(25,59,'A young swordsman bows to you on the road and calls you “senior”. It takes you a moment to realise he means you.','路上一个年轻剑客向你行礼，叫你"前辈"。你愣了一下才明白说的是自己。');
TX(30,59,'You find your first grey hair and decide it makes you look experienced.','你发现了第一根白头发，决定认为这显得老练。');
TX(30,59,'You catch yourself lecturing a younger person about how things were better in your day.','你发现自己在跟年轻人念叨"想当年如何如何"。');
TX(35,59,'An injury from years ago starts aching whenever it is going to rain. You are now a weather prophet.','多年前的旧伤，一要下雨就隐隐作痛。你成了半个天气先生。');
/* old age */
TX(60,110,'You wake before dawn now, every day, whether you want to or not.','如今你天天天不亮就醒，想睡也睡不着。');
TX(60,110,'You sit by the gate and greet everyone who passes. Half of them are children of people you knew.','你坐在门口跟每个过路人打招呼。一半是你故人的孩子。');
TX(60,110,'You tell a young person a story from your youth and realise, halfway through, that everyone in it is dead.','你给年轻人讲年轻时的事，讲到一半才发现故事里的人都已不在了。');
TX(60,110,'Your hands are spotted and slow, but they still remember every form.','你的手长了老人斑，也慢了，可每一招都还记得。');
TX(60,110,'You plant chrysanthemums along the wall and fuss over them like grandchildren.','你沿墙种了一排菊花，宝贝得像孙辈。');
TX(60,110,'A winter cough settles in your chest and stays until the peach blossoms.','一场冬咳落在胸口，直到桃花开了才走。');
TX(60,110,'You go to a funeral and someone says “you’ll be next, old one”, kindly, and you laugh.','你去吊丧，有人笑着说"老人家，下一个就是你了"，你也笑了。');
TX(60,110,'You give away your old sword to a boy who will not stop asking about it.','你把旧剑送给了一个缠着你问东问西的少年。');
TX(65,110,'You forget a name in the middle of a sentence and decide it did not matter.','话说到一半忘了一个人名，你决定那不重要。');
/* circumstances */
TX(16,90,'Rice is so dear this year that you count every grain into the pot.','今年米贵，下锅时你一粒粒地数。',s=>s.world&&s.world.h<=-1,2);
TX(16,90,'Beggars at every gate this year, more than anyone can feed.','今年家家门口都有讨饭的，多得喂不过来。',s=>s.world&&s.world.h<=-1,1.5);
TX(16,90,'A good year: the market is loud, the wine is cheap and the matchmakers are busy.','好年景：集市喧闹，酒价便宜，媒婆忙得脚不沾地。',s=>s.world&&s.world.h>=1,1.5);
TX(16,90,'You start sleeping with a blade under the pillow. Everyone does, these days.','你开始枕刀而眠。这年头，人人都这样。',s=>s.world&&s.world.u>=2,2);
TX(16,90,'The city gates close at dusk now, and the watch questions anyone out late.','如今城门黄昏就关，夜里在外头走都要被盘问。',s=>s.world&&s.world.u>=1,1.5);
TX(16,90,'Your horse knows the road home better than you do, and takes it when you doze off.','你的马比你还认得回家的路，你打个盹它就自己走回去了。',s=>owned(s,'mount').length>0,1.2);
TX(16,90,'You spend an evening brushing your horse, and it is the calmest hour of your week.','你花一个晚上给马刷毛，这是你一礼拜里最安静的一个时辰。',s=>owned(s,'mount').length>0);
TX(5,90,'Your pet sleeps on your feet every night and you have not been cold since.','你的宠物每晚都睡在你脚上，从那以后你再没冷过。',s=>owned(s,'pet').length>0,1.2);
TX(18,90,'You lie awake listening to your spouse breathe and feel lucky in a way you cannot explain.','你醒着听身边人的呼吸，有一种说不出的幸运。',s=>!!spouseOf(s),1.5);
TX(18,90,'You and your spouse quarrel over salt in the soup, and make up over the dishes.','你和另一半为汤里的盐吵了一架，洗碗时又和好了。',s=>!!spouseOf(s),1.3);
TX(18,90,'Your child takes their first steps toward you and falls into your arms.','孩子朝你迈出了第一步，扑进你怀里。',s=>living(s,'child').some(c=>c.age<=2),2);
TX(18,90,'Your child asks you to teach them to fight. You teach them to run first.','孩子求你教打架。你先教了怎么跑。',s=>living(s,'child').some(c=>c.age>=6&&c.age<=14),1.5);
TX(30,90,'Your grown child visits and you notice they have started to look like you.','成年的孩子回来看你，你发现孩子越来越像你了。',s=>living(s,'child').some(c=>c.age>=20),1.3);
TX(16,90,'People stop talking when you walk into the teahouse. Some of them are afraid, some just curious.','你一走进茶馆，人们就不说话了。有的是怕，有的是好奇。',s=>s.fame>=40,1.5);
TX(16,90,'A child follows you down the street pretending to be you, sword and all.','一个孩子跟在你后面，学你走路，连剑都比划着。',s=>s.fame>=40);
TX(16,90,'You check the doors twice before sleeping. Old habits from a wanted life.','睡前你把门检查两遍。被通缉留下的老习惯。',s=>s.wanted>0,1.5);
TX(16,90,'The mountain mist rolls into the sect at dawn and the bells sound like they are under water.','清晨山雾漫进门派，钟声像是从水底传来。',s=>!!s.sect&&!isEvil(s.sect),1.3);
TX(16,90,'The fellow disciples share a jar of forbidden wine behind the scripture hall and swear each other to secrecy.','师兄弟们躲在经堂后面偷喝一坛禁酒，互相发誓不说出去。',s=>!!s.sect&&!isEvil(s.sect));
TX(16,90,'In the faction, nobody trusts anybody, and everybody smiles.','在这个教里，谁也不信谁，人人都在笑。',s=>isEvil(s.sect),1.5);
TX(16,90,'You catch a fellow follower going through your things. Neither of you says anything.','你撞见一个同教在翻你的东西。你们谁也没吭声。',s=>isEvil(s.sect));
TX(16,90,'Your own disciples argue about whose turn it is to cook. You pretend not to hear.','你自己的弟子为轮到谁做饭吵起来，你装作没听见。',s=>s.org&&s.org.type==='sect',1.3);
TX(16,90,'The escort banner over your gate is faded by the sun. You have a new one sewn, bigger.','门楼上的镖旗被太阳晒褪了色。你让人缝了一面新的，更大。',s=>s.org&&s.org.type==='escort',1.3);
TX(5,90,'The wind off the steppe smells of grass and snow even in summer.','从草原吹来的风，连夏天都带着草和雪的气味。',s=>s.region==='north',1.2);
TX(5,90,'You eat mutton boiled with nothing but salt and think it is the best thing in the world.','你吃了一锅只放盐的手把肉，觉得天下没有比这更好吃的了。',s=>s.region==='north'||s.region==='west');
TX(5,90,'A caravan of a hundred camels passes the town, bells ringing for an hour.','一支上百头骆驼的商队经过镇子，驼铃响了整整一个时辰。',s=>s.region==='west',1.2);
TX(5,90,'Grape harvest: the whole town smells sweet and slightly drunk.','葡萄熟了：整个镇子都甜甜的，还有点醉意。',s=>s.region==='west');
TX(5,90,'The rain on the canal goes on so long that the boatmen start telling ghost stories to pass the time.','河上的雨下个没完，船家们开始讲鬼故事打发时间。',s=>s.region==='jiangnan',1.2);
TX(5,90,'You buy a lotus seedpod from a girl in a little boat and eat the seeds one by one on the bridge.','你从小船上的姑娘手里买了个莲蓬，站在桥上一颗颗剥着吃。',s=>s.region==='jiangnan');
TX(5,90,'You eat something so numbingly spicy that you cannot feel your lips until evening.','你吃了一口麻辣的东西，嘴唇一直麻到傍晚。',s=>s.region==='shu',1.2);
TX(5,90,'The teahouse storyteller in Shu changes faces mid-sentence, and the whole room gasps.','蜀中茶馆的说书人一句话没说完就变了脸，满座惊呼。',s=>s.region==='shu');
TX(5,90,'The Miao girls’ silver headdresses flash in the sun at the festival. You can hear them coming.','节日里苗家姑娘的银冠在太阳下闪闪发亮，人还没到，叮当声先到了。',s=>s.region==='miao',1.2);
TX(5,90,'An old woman warns you never to accept food from a stranger in these valleys. You take it seriously.','一个老婆婆告诫你，在这些山谷里千万别吃生人给的东西。你记住了。',s=>s.region==='miao');
TX(5,90,'You eat fish so fresh it was swimming when you sat down.','你吃的鱼新鲜得很，你坐下时它还在游。',s=>s.region==='east',1.2);
TX(5,90,'A typhoon season: the fishing boats stay tied up and the whole village mends nets together.','台风季：渔船都拴着，全村人坐在一起补网。',s=>s.region==='east');
TX(5,90,'You see an official’s procession clear the whole street, and wonder what it is like to be that important.','你看见一位大官的仪仗清空了整条街，心想做那么大的官是什么滋味。',s=>s.region==='capital',1.2);
TX(5,90,'You eat roast duck from a famous shop and talk about it for a month.','你吃了一回名店的烤鸭，念叨了一个月。',s=>s.region==='capital');
TX(5,90,'You climb to a temple on the loess hills and see a hundred villages laid out in the dust.','你登上黄土坡上的一座庙，看见上百个村子散落在尘土里。',s=>s.region==='central',1.2);
TX(5,90,'The Yellow River runs so thick with silt this year that the ferrymen say you could walk across it.','今年黄河泥沙多得很，渡口的人说都能踩着过河了。',s=>s.region==='central');
/* festivals */
TX(3,110,'New Year: firecrackers all night, dumplings at midnight, and a red envelope with a single copper in it.','过年：鞭炮响了一夜，半夜吃饺子，红包里只有一文钱。');
TX(3,110,'The Lantern Festival: you guess three riddles and win a paper rabbit.','元宵节：你猜中三个灯谜，赢了一只纸兔子灯。');
TX(3,110,'At Qingming you sweep the family graves and leave a bowl of rice and a cup of wine.','清明时你去扫墓，摆上一碗饭、一杯酒。');
TX(3,110,'Dragon Boat Festival: the drums on the river make your chest shake, and the zongzi are too salty.','端午：河上的鼓声震得你胸口发颤，粽子咸了点。');
TX(13,110,'On Qixi night, the girls of the street thread needles by moonlight and pray for clever hands.','七夕夜里，街上的姑娘们对着月亮穿针，求一双巧手。');
TX(3,110,'Mid-Autumn: the moon is so bright you can read by it, and someone always cries.','中秋：月亮亮得能看书，总有人掉眼泪。');
TX(10,110,'On the Double Ninth you climb a hill with friends and drink chrysanthemum wine at the top.','重阳节你和朋友登高，在山顶喝菊花酒。');
TX(3,110,'Winter solstice: a bowl of mutton soup and the long night, and everyone goes to bed early.','冬至：一碗羊肉汤，一个长夜，大家都早早睡了。');
