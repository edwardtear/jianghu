/* 江湖一生 · a wider world: more places, moments and things, local colour, and more of adult and old life */
'use strict';

PLACES.push(['a drum tower','鼓楼下'],['a salt-smugglers’ jetty','私盐码头'],['a dyeing workshop','染坊'],['a courier post station','驿站'],
 ['a crowded noodle stall','面摊前'],['an abandoned granary','废弃的粮仓'],['a lantern shop','灯笼铺'],['a calligraphy stall','字画摊'],
 ['a riverside laundry','河边的洗衣石'],['an archery ground','校场'],['a candle-lit ancestral hall','祠堂'],['a frozen river','冰封的河面'],['a reed marsh','芦苇荡'],
 ['an oil-paper umbrella shop','油纸伞铺'],['a pagoda courtyard','塔院'],['a ruined beacon tower','废烽火台'],['a pawnshop back room','当铺后堂']);
INTROS.push(['As peach blossoms fall','桃花纷落时'],['In a sandstorm','风沙漫天时'],['Under a sky full of kites','漫天纸鸢下'],['As the river ice cracks','江上冰裂之时'],
 ['In a heatwave that melts the road tar','酷暑难当的日子'],['In the hour before a thunderstorm','雷雨将至的那个时辰'],['On a morning white with frost','霜白的清晨'],['At the hour of the evening drum','暮鼓响起时'],['In the season of falling ginkgo leaves','银杏叶落的时节'],
 ['As a funeral procession passes','一支送葬队伍经过时'],['During a solar eclipse','日食时分'],['While the rice is being planted','插秧时节'],['On the Qixi festival night','七夕之夜'],['With the city gates about to close','城门将闭时'],
 ['In a drizzle so fine it is almost fog','细雨如雾的时候'],['On a market day','逢集的日子'],['After a sleepless night','一夜未眠之后'],['As the cicadas fall silent','蝉声歇下之时'],['At the turn of the year','岁末年初']);
OBJECTS.push(['a carved walnut','一枚雕花核桃'],['a cracked bronze mirror','一面裂开的铜镜'],['an oil lamp that never runs dry','一盏总也不灭的油灯'],['a bag of foreign coins','一袋番邦银币'],
 ['a pawn ticket','一张当票'],['a half-burned letter','一封烧了一半的信'],['a wooden fish','一只木鱼'],['a tattered banner','一面破旗'],['a snuff bottle','一只鼻烟壶'],['a lock of hair tied with red string','一缕用红绳系着的头发'],
 ['an iron key','一把铁钥匙'],['a sutra written in blood','一卷血书佛经'],['a gourd of strong wine','一葫芦烈酒'],['a white jade chess piece','一枚白玉棋子']);
/* places that only exist where you are: a third of scenes happen somewhere local */
const LOCAL={
 central:[['the Shaolin foothills','少林山脚'],['an old Luoyang wine shop','洛阳老酒肆'],['the Yellow River ferry','黄河渡口'],['a loess cave dwelling','黄土窑洞'],['the ruins of an old capital','古都废墟']],
 jiangnan:[['a painted pleasure boat','画舫上'],['the Broken Bridge on West Lake','西湖断桥'],['a Suzhou garden','苏州园林'],['a silk-weaving house','织造坊'],['a tea terrace in the rain','雨中的茶园']],
 shu:[['a hot-pot stall','火锅摊'],['the plank roads of Shu','蜀道栈道'],['a bamboo-sea inn','竹海客栈'],['a teahouse full of storytellers','说书人满座的茶馆'],['a riverside spice market','江边香料市']],
 north:[['a garrison gate on the Great Wall','长城关口'],['a nomad camp','游牧营地'],['a frozen frontier market','冰天雪地的边市'],['a beacon tower','烽火台'],['a horse-trading ground','马市']],
 west:[['a caravanserai','驿站客栈'],['an oasis well','绿洲水井'],['a cave temple full of painted Buddhas','壁画满墙的石窟'],['a desert bazaar','大漠集市'],['the foot of the Tianshan','天山脚下']],
 miao:[['a stilt-house village','吊脚楼寨子'],['a misty valley','雾谷'],['a Miao silver market','苗银集市'],['a bridge of vines','藤桥'],['a terraced rice field','梯田']],
 east:[['a fishing harbour','渔港'],['a lighthouse','灯塔下'],['a salt pan','盐场'],['a pirate cove','海盗湾'],['a tide-washed beach','潮水冲刷的沙滩']],
 capital:[['a hutong teahouse','胡同茶馆'],['the Ministry gates','六部衙门前'],['a palace side gate','宫墙侧门'],['the Bridge of Heaven market','天桥市场'],['a prince’s garden','王府花园']]
};
var CUR_S=null;
scene=function(){
  const loc=CUR_S&&LOCAL[CUR_S.region]&&chance(.33)?pick(LOCAL[CUR_S.region]):pick(PLACES);
  return{intro:P(pick(INTROS)),place:P(loc),obj:P(pick(OBJECTS))};
};

/* ---------- adult life ---------- */
I({id:'oldfriendvisit',age:[25,80],cd:6,ctx:s=>{const c=scene();c.npc=npc(s,{age:s.age+rint(-3,3)});return c},text:c=>T(`${c.npc.en}, a childhood friend you had forgotten, turns up at your door.`,`儿时的玩伴${c.npc.zh}突然找上门来，你差点没认出来。`),
 opts:[{l:T('Drink together all night','通宵对饮'),out:[{w:3,t:T('You talk until the lamp burns out. Nothing has changed, and everything has.','你们聊到灯油耗尽。什么都没变，又什么都变了。'),c:'good',fx:{meet:'friend',bond:70,happy:6}},{w:1,t:c=>T(`At dawn ${c.npc.en} asks to borrow money.`,`天亮时，${c.npc.zh}开口借钱。`),fx:{money:[-30,-10],meet:'friend',bond:60}}]},
  {l:T('Be polite, and brief','客气几句'),out:[{t:T('They leave. You wonder about them for a while.','对方走了。你惦记了一阵子。'),c:'muted'}]}]});
I({id:'roofcollapse',age:[20,90],cd:12,text:()=>T('After a week of rain, part of your roof comes down in the night.','连下一周雨，夜里屋顶塌了一角。'),
 opts:[{l:T('Pay a builder','请工匠'),cost:25,out:[{t:T('Fixed properly. You sleep better than before.','修得结结实实，你睡得比以前还香。'),c:'good',fx:{happy:2}}]},
  {l:T('Fix it yourself','自己动手'),out:[{w:2,t:T('It leaks, but less.','还漏，但漏得少了。'),fx:{happy:-1}},{w:1,t:T('You fall off the ladder.','你从梯子上摔了下来。'),c:'bad',fx:{hurt:[4,12],cause:T('a fall from a roof','从屋顶跌落')}},{w:1,t:T('You find a sealed jar of old coins in the rafters.','你在房梁上发现一罐封好的旧钱。'),c:'gold',fx:{money:[20,60]}}]}]});
I({id:'lawsuit',age:[22,85],cd:10,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([5,11,26])});return c},text:c=>T(`${c.npc.en} files a lawsuit against you over a boundary stone.`,`${c.npc.zh}为了一块界石把你告上了衙门。`),
 opts:[{l:T('Bribe the clerk','打点书吏'),cost:30,out:[{w:3,t:T('The case is quietly dropped.','官司悄悄撤了。'),fx:{align:-2}},{w:1,t:T('The clerk takes your silver and theirs too. You lose.','书吏两头收钱，你还是输了。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Argue it before the magistrate','公堂对质'),out:[{w:s=>s.smarts/20,t:T('You win, and the magistrate compliments your reasoning.','你赢了，县太爷还夸你条理分明。'),c:'good',fx:{fame:1,happy:4}},{w:2,t:T('You lose. The stone moves three feet.','你输了，界石往你这边挪了三尺。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Settle it over wine','请吃酒私了'),out:[{w:2,t:T('You split the difference and become wary friends.','各退一步，成了互相提防的朋友。'),fx:{money:-8,meet:'acq'}},{w:1,t:T('They take the wine and the lawsuit.','酒照喝，官司照打。'),c:'muted',fx:{money:-8}}]}]});
I({id:'midnightknock',age:[18,80],cd:8,ctx:s=>{const c=scene();c.npc=npc(s,{lv:Math.round(power(s)*.6+rint(5,20))});return c},text:c=>T(`Past midnight, a wounded stranger begs to be let in. Torches are moving in the street.`,`半夜，一个受伤的陌生人求你开门。街上火把晃动。`),
 opts:[{l:T('Hide them','收留藏起来'),out:[{w:2,t:T('The searchers pass. In the morning the stranger is gone, and there is a silver ingot on your table.','搜捕的人过去了。天亮时陌生人已走，桌上留了一锭银子。'),c:'good',fx:{money:[20,50],align:3}},{w:1,t:T('They were a wanted murderer. You are questioned for days.','那是个通缉的杀人犯。你被盘问了好几天。'),c:'bad',fx:{wanted:1,align:1}},{w:1,t:c=>T(`They were a rebel. ${c.npc.en} swears you a debt of life.`,`那是个义军。${c.npc.zh}发誓以命相报。`),c:'gold',fx:{meet:'sworn',bond:80,align:3}}]},
  {l:T('Keep the door shut','闭门不理'),out:[{w:2,t:T('You hear a struggle, then nothing.','你听见一阵扭打，然后什么声音都没了。'),c:'muted',fx:{happy:-3}},{w:1,t:T('Nothing happens, and you sleep well.','什么事也没发生，你睡得挺好。'),c:'muted'}]},
  {l:T('Call the watch','喊巡夜的'),out:[{t:T('A reward of five taels. You do not feel good about it.','得了五两赏银。你心里并不痛快。'),fx:{money:5,align:-3}}]}]});
I({id:'w_famine',age:[16,90],cd:15,w:.7,text:()=>T('The harvest fails across the province. Grain prices triple.','全省歉收，粮价涨了三倍。'),
 opts:[{l:T('Hoard and sell high','囤粮高卖'),if:s=>s.money>=40,out:[{w:2,t:T('You make a fortune, and many enemies.','你发了一笔大财，也结下许多仇。'),fx:{money:[60,150],align:-8}},{w:1,t:T('A mob breaks into your storehouse.','饥民砸开了你的粮仓。'),c:'bad',fx:{money:-40,hurt:[5,15],cause:T('a hungry mob','饥民')}}]},
  {l:T('Share what you have','分粮给人'),out:[{t:T('You go hungry yourself. The village never forgets.','你自己也挨饿了。村里人永远记得这份情。'),c:'good',fx:{money:-15,align:6,fame:2,maxHealth:-2}}]},
  {l:T('Tighten your belt','勒紧裤腰带'),out:[{t:T('A thin, frightened year.','一个又瘦又怕的年头。'),c:'muted',fx:{happy:-5,maxHealth:-2}}]}]});
I({id:'w_plague',age:[10,90],cd:20,w:.5,text:()=>T('A plague comes through the district. Doors are marked with white paper.','一场瘟疫传遍了这一带，家家门口贴着白纸。'),
 opts:[{l:T('Flee to the hills','逃进山里'),out:[{w:3,t:T('You wait it out in a hut, and come back to a quieter town.','你在山里的草棚里熬过去了，回来时镇上冷清了许多。'),c:'muted',fx:{happy:-4}},{w:1,t:T('It catches you on the road.','病在路上追上了你。'),c:'bad',fx:{hurt:[15,35],cause:T('the plague','瘟疫')}}]},
  {l:T('Help nurse the sick','留下照顾病人'),out:[{w:s=>s.t.root,t:T('You never catch it. People call you blessed.','你始终没染上。人们说你有福。'),c:'good',fx:{align:6,fame:3}},{w:4,t:T('You catch it, and pull through.','你染上了，又挺了过来。'),c:'bad',fx:{hurt:[15,35],cause:T('the plague','瘟疫'),align:6,fame:2}}]},
  {l:T('Lock yourself in','闭门不出'),out:[{w:3,t:T('Months of silence. You survive.','几个月闭门不出，你活了下来。'),c:'muted',fx:{happy:-6}},{w:1,t:T('It gets in anyway.','瘟疫还是进了门。'),c:'bad',fx:{hurt:[10,30],cause:T('the plague','瘟疫')}}]}]});
I({id:'w_treasuremap',age:[16,70],cd:15,w:.6,text:c=>T(`At ${c.place.en}, a dying pedlar presses a map into your hand.`,`在${c.place.zh}，一个垂死的货郎把一张地图塞进你手里。`),
 opts:[{l:T('Follow it','按图寻宝'),out:[{w:2,t:T('Three weeks of digging. An empty box, and a note: "Too late."','挖了三个星期，只挖出一个空箱子，里面有张字条："来迟了。"'),c:'muted',fx:{happy:-2}},{w:1,t:T('A buried urn of silver.','一坛埋着的银子。'),c:'gold',fx:{money:[80,200]}},{w:1,t:T('Others have the same map. There is a fight in the dark.','别人也有同样的地图。黑暗里打了一场。'),c:'bad',fx:{hurt:[8,20],cause:T('treasure hunters','寻宝人')}},{w:.5,t:T('A martial manual, wrapped in oilcloth.','一本用油布包着的武功秘籍。'),c:'gold',fx:{skill:6,qi:6}}]},
  {l:T('Sell it','卖了'),out:[{t:T('A collector pays well, and grins too widely.','收藏家出了高价，笑得有点过分。'),fx:{money:[15,40]}}]},{l:T('Burn it','烧掉'),out:[{t:T('Some doors are better left shut.','有些门还是不开为好。'),c:'muted',fx:{qi:1}}]}]});
I({id:'midlifeart',age:[30,60],cd:8,text:()=>T('You wake one morning wanting to learn something entirely new.','某天早上醒来，你突然想学点全新的东西。'),
 opts:[{l:T('Calligraphy','书法'),out:[{t:T('Your brush strokes slowly lose their tremble.','你的笔画慢慢不再发抖。'),c:'good',fx:{smarts:3,qi:2,happy:3}}]},{l:T('The guqin','古琴'),out:[{w:2,t:T('You learn three pieces. The neighbours learn patience.','你学会了三首曲子，邻居们学会了忍耐。'),fx:{happy:4}},{w:1,t:T('A master hears you and says you have a heart for it.','一位琴师听了，说你有琴心。'),c:'good',fx:{happy:5,qi:3}}]},{l:T('Cooking','厨艺'),out:[{t:T('Your braised pork becomes locally famous.','你的红烧肉在这一带出了名。'),c:'good',fx:{happy:4,fame:1}}]},{l:T('Never mind','算了'),out:[{t:T('The feeling passes.','这个念头过去了。'),c:'muted'}]}]});
I({id:'w_storyteller',age:[10,90],cd:5,text:c=>T(`At ${c.place.en}, a storyteller is telling a tale about a hero who sounds a lot like you.`,`在${c.place.zh}，一个说书人正讲一位侠客的故事，听着很像你。`),when:s=>s.fame>=15,
 out:[{w:2,t:T('He has made you three heads taller and given you a horse you never owned.','他把你说得高了三个头，还给了你一匹你从没有过的马。'),fx:{happy:4,fame:1}},{w:1,t:T('In his version you are the villain.','在他嘴里，你是个恶人。'),c:'bad',fx:{happy:-3}},{w:1,t:T('You tip him. He does not recognise you.','你打赏了他，他没认出你来。'),c:'muted',fx:{money:-1,happy:2}}]});
I({id:'flood2',age:[8,90],cd:12,w:.7,text:()=>T('The river bursts its banks. The water rises in the night.','江河决堤，夜里水涨了起来。'),
 opts:[{l:T('Save your belongings','抢救家当'),out:[{w:2,t:T('You save the money box and lose everything else.','你抢出了钱匣子，别的都没了。'),fx:{happy:-5}},{w:1,t:T('The current takes you a mile downstream.','水流把你冲出去一里地。'),c:'bad',fx:{hurt:[8,20],cause:T('the flood','洪水')}}]},
  {l:T('Help the neighbours','救邻居'),out:[{w:3,t:T('You carry two children and an old man to the temple on the hill.','你把两个孩子和一位老人背上了山上的庙。'),c:'good',fx:{align:5,fame:2,money:-10}},{w:1,t:T('You save them, and nearly drown.','人救上来了，你却差点淹死。'),c:'bad',fx:{align:5,fame:2,hurt:[10,25],cause:T('the flood','洪水')}}]}]});
I({id:'banditroad',age:[16,80],cd:9,ctx:s=>{const c=scene();c.npc=npc(s,{occ:28,lv:Math.round(Math.max(8,power(s)*rint(6,12)/10))});return c},text:c=>T(`On the road, ${c.npc.en} and two others step out from the trees. "Your silver, or your legs."`,`路上，${c.npc.zh}带着两个人从林子里窜出来。"留下银子，或者留下腿。"`),
 opts:[{l:T('Fight','动手'),fight:FG((s,c)=>c.npc.lv,'injury',T('Highway robbery','剪径'),T('highwaymen','剪径强人')),win:[{t:T('They scatter into the trees. One drops a purse.','他们四散逃进树林，有人掉了个钱袋。'),c:'good',fx:{money:[5,25],fame:1}}],lose:[{t:T('They take everything, even your shoes.','他们把你抢了个精光，连鞋都没留。'),c:'bad',fx:{money:-30}}]},
  {l:T('Pay','给钱'),out:[{t:T('They count it carefully and wish you a good journey.','他们仔细数了钱，还祝你一路顺风。'),c:'muted',fx:{money:[-30,-10]}}]},
  {l:T('Talk your way out','好言周旋'),out:[{w:s=>s.smarts/25,t:T('You talk about their mothers until they let you pass.','你跟他们聊起各自的娘，他们就放你走了。'),c:'good',fx:{smarts:1}},{w:2,t:T('They are not in the mood.','他们没心情听。'),c:'bad',fx:{money:-20,hurt:[3,8],cause:T('highwaymen','剪径强人')}}]}]});
I({id:'gamblingfriend',age:[18,70],cd:7,ctx:s=>{const c=scene();c.npc=npc(s,{age:s.age+rint(-5,5)});return c},text:c=>T(`${c.npc.en}, a friend, has lost their house at dice and is going to drown themself.`,`朋友${c.npc.zh}赌骰子输掉了房子，要去投河。`),
 opts:[{l:T('Pay the debt','替他还债'),cost:60,out:[{t:c=>T(`${c.npc.en} weeps and swears never to gamble again. Probably true.`,`${c.npc.zh}痛哭流涕，发誓再也不赌了。多半是真的。`),c:'good',fx:{meet:'sworn',bond:85,align:4}}]},
  {l:T('Talk them down','劝下来'),out:[{w:2,t:T('You sit on the bridge all night. By morning they are ready to try again.','你在桥上陪了一整夜。天亮时，对方愿意重新来过。'),c:'good',fx:{meet:'friend',bond:70,align:2}},{w:1,t:T('They promise to live, then vanish from town.','对方答应好好活着，第二天就离开了镇子。'),c:'muted'}]},
  {l:T('Win it back at the same table','去那张赌桌赢回来'),out:[{w:s=>s.t.luck,t:T('Three throws, three wins. You tear up the deed in front of the dealer.','三把三赢。你当着庄家的面撕了房契。'),c:'gold',fx:{meet:'sworn',bond:85,fame:1}},{w:6,t:T('Now you both owe money.','现在你俩都欠钱了。'),c:'bad',fx:{money:-40}}]}]});
I({id:'officialbanquet',age:[25,80],cd:8,when:s=>s.fame>=20||s.money>=300,text:()=>T('You are invited to a magistrate’s banquet.','县太爷请你赴宴。'),
 opts:[{l:T('Flatter the magistrate','奉承县太爷'),out:[{w:2,t:T('He remembers your name. Doors open.','他记住了你的名字，处处方便了许多。'),fx:{fame:2,align:-2,money:[5,20]}},{w:1,t:T('You overdo it. Everyone notices.','你拍得过了头，人人都看在眼里。'),c:'muted',fx:{fame:-1}}]},
  {l:T('Speak frankly about the taxes','直言赋税之弊'),out:[{w:1,t:T('He laughs and lowers the grain levy.','他哈哈一笑，竟真减了粮税。'),c:'gold',fx:{fame:4,align:4}},{w:2,t:T('You are not invited again.','此后再没请过你。'),c:'muted',fx:{align:3}}]},
  {l:T('Eat a lot and say little','多吃少说'),out:[{t:T('The duck was excellent.','鸭子真不错。'),fx:{happy:3}}]}]});
I({id:'stolenhorse',age:[18,75],cd:8,text:()=>T('Someone has stolen a horse from the inn, and the innkeeper is pointing at you.','客栈的马被偷了，掌柜的指着你。'),
 opts:[{l:T('Track the real thief','追查真凶'),out:[{w:s=>s.smarts/20+s.t.wit/3,t:T('Hoofprints, a muddy boot, a stable boy with new shoes. Case closed.','马蹄印、带泥的靴子、马夫脚上的新鞋，真相大白。'),c:'good',fx:{fame:2,smarts:2}},{w:2,t:T('The trail goes cold. You pay for the horse to end it.','线索断了。你赔了马钱，了结此事。'),fx:{money:-20}}]},
  {l:T('Leave town fast','赶紧离开'),out:[{w:2,t:T('You are gone before the constables arrive.','捕快来之前你就走了。'),c:'muted',fx:{wanted:1}},{w:1,t:T('The horse is found the next day. You look guilty for nothing.','第二天马找到了。你白白落了个心虚的名声。'),fx:{fame:-1}}]}]});
I({id:'fortuneteller2',age:[14,90],cd:6,text:c=>T(`At ${c.place.en}, a blind fortune teller grabs your wrist.`,`在${c.place.zh}，一个瞎眼算命先生一把抓住你的手腕。`),
 out:[{w:2,t:T('"Beware water in your forty-third year." You will remember that.','"四十三岁那年，当心水。"你会记住这句话的。'),c:'muted'},{w:2,t:T('"A noble person will cross your path." He asks for ten coppers.','"命里会遇贵人。"他伸手要十文钱。'),fx:{money:-1}},{w:1,t:T('He lets go suddenly and refuses to say anything.','他突然松了手，什么也不肯说。'),c:'muted',fx:{happy:-2}},{w:1,t:T('"Your name was chosen well." He smiles, and you feel lighter.','"你这名字起得好。"他笑了，你心里一松。'),c:'good',fx:{happy:3}}]});
I({id:'neighbourfeud',age:[22,85],cd:8,ctx:s=>{const c=scene();c.npc=npc(s,{age:s.age+rint(-10,10)});return c},text:c=>T(`${c.npc.en} next door has started throwing rubbish over your wall.`,`隔壁的${c.npc.zh}开始把垃圾往你院里扔。`),
 opts:[{l:T('Throw it back','扔回去'),out:[{w:2,t:T('A year-long war of rubbish follows.','一场持续一年的垃圾大战开始了。'),c:'muted',fx:{happy:-3,enemy:1}},{w:1,t:T('They take the hint.','对方识趣地收手了。'),fx:{happy:2}}]},
  {l:T('Bring them a gift','送份礼过去'),out:[{w:2,t:c=>T(`It turns out ${c.npc.en} thought you had insulted their mother. It is cleared up.`,`原来${c.npc.zh}以为你骂过他娘。误会解开了。`),c:'good',fx:{meet:'friend',bond:60,money:-5}},{w:1,t:T('They take the gift and keep throwing rubbish.','礼收了，垃圾照扔。'),c:'muted',fx:{money:-5}}]},
  {l:T('Build the wall higher','把墙加高'),out:[{t:T('Expensive, and effective.','花钱，但管用。'),fx:{money:-15,happy:2}}]}]});
I({id:'dreamteacher',age:[12,80],cd:12,w:.6,text:()=>T('For seven nights, an old man in white teaches you a sword form in your dreams.','一连七夜，一位白衣老人在梦里教你一套剑法。'),
 out:[{w:s=>s.t.wit,t:T('On the eighth morning, your hands remember it.','第八天早上，你的手竟然记得。'),c:'gold',fx:{skill:5}},{w:6,t:T('By morning it slips away like water.','一醒来，就像水一样从指缝间流走了。'),c:'muted'},{w:1,t:T('On the seventh night, he tells you his name. It is carved on a grave nearby.','第七夜，他说出了自己的名字。附近有座坟上刻着这个名字。'),c:'muted',fx:{qi:3}}]});
I({id:'bridgebuild',age:[25,85],cd:15,when:s=>s.money>=120,text:()=>T('The old bridge has washed away. The village elders come to you for money to rebuild it.','老桥被冲垮了。村里的长老来找你出钱重修。'),
 opts:[{l:T('Pay for it all','全数捐出'),cost:100,out:[{t:T('They carve your name on the bridge stone.','他们把你的名字刻在了桥头石上。'),c:'gold',fx:{fame:5,align:6,deed:T('Paid for a bridge','捐资修桥')}}]},
  {l:T('Give something','出一份'),cost:25,out:[{t:T('A respectable contribution.','一份体面的捐助。'),c:'good',fx:{align:2,fame:1}}]},{l:T('Refuse','拒绝'),out:[{t:T('You hear the grumbling for years.','此后好几年你都听得见闲话。'),c:'muted',fx:{fame:-1}}]}]});
I({id:'pilgrimage',age:[30,90],cd:10,text:()=>T('You feel called to make a pilgrimage to a sacred mountain.','你心里一动，想去名山朝圣。'),
 opts:[{l:T('Go to Mount Tai','去泰山'),out:[{w:2,t:T('You watch the sunrise from the summit and weep without knowing why.','你在山顶看日出，不知为何泪流满面。'),c:'good',fx:{qi:4,happy:5,money:-15}},{w:1,t:T('You meet an old Daoist on the stairs who walks with you all day.','你在石阶上遇到一位老道，陪你走了一整天。'),c:'good',fx:{qi:6,money:-15}}]},
  {l:T('Go to Mount Wutai','去五台山'),out:[{t:T('Five terraces, five temples, five days of silence.','五座台顶，五座寺，五天不说话。'),c:'good',fx:{qi:5,align:2,money:-15}}]},{l:T('Stay home','留在家里'),out:[{t:T('Maybe next year.','或许明年吧。'),c:'muted'}]}]});
I({id:'cookingcontest',age:[16,80],cd:8,text:c=>T(`${c.place.en} is holding a cooking contest. The prize is a whole pig.`,`${c.place.zh}在办厨艺比赛，头奖是一整头猪。`),
 opts:[{l:T('Enter','参加'),out:[{w:1,t:T('Your noodles win. You carry the pig home in triumph.','你的面赢了。你得意洋洋地把猪扛回了家。'),c:'gold',fx:{happy:6,fame:1,money:10}},{w:2,t:T('You come third, and get a jar of pickles.','你得了第三名，奖了一坛咸菜。'),fx:{happy:2}},{w:1,t:T('You set the stall on fire.','你把灶台点着了。'),c:'bad',fx:{happy:-3,money:-5}}]},
  {l:T('Watch and eat','看热闹、蹭吃'),out:[{t:T('You taste everything and pay for nothing.','你样样都尝了，一文没花。'),fx:{happy:3}}]}]});
I({id:'abandonedchild',age:[20,75],cd:12,w:.7,text:()=>T('You find a baby in a basket at your door.','你在门口发现一只竹篮，里面有个婴儿。'),
 opts:[{l:T('Raise the child','收养'),out:[{t:T('Your life changes shape around a small, loud person.','你的日子围着一个又小又吵的人转了起来。'),c:'good',fx:{f:s=>{const p=mkPerson(s,{rel:'child',sur:s.sur,age:0,bond:80,lv:1});s.people.push(p)},happy:4,align:5,money:-10}}]},
  {l:T('Take it to the temple','送去庙里'),out:[{t:T('The monks take it in, as they always do.','和尚们收下了，一如既往。'),fx:{align:1}}]},{l:T('Find a family for it','找户人家'),out:[{t:T('A childless couple in the next village weep with joy.','邻村一对没孩子的夫妇喜极而泣。'),c:'good',fx:{align:3}}]}]});

/* ---------- old age ---------- */
I({id:'oldmemoir',age:[55,100],once:1,text:()=>T('You think about writing down your life.','你想把自己这一生写下来。'),
 opts:[{l:T('Write it honestly','照实写'),out:[{t:T('It is not flattering. It is good.','写得并不光彩，但写得很好。'),c:'good',fx:{smarts:3,happy:4,fame:1}}]},{l:T('Improve on it a little','稍加润色'),out:[{t:T('Copies sell in three towns.','抄本在三个镇上都有人买。'),fx:{money:[10,40],fame:2}}]},{l:T('Leave it unwritten','不写了'),out:[{t:T('Some things are for remembering, not reading.','有些事只宜记着，不宜读。'),c:'muted'}]}]});
I({id:'oldstudent',age:[50,95],cd:8,when:s=>power(s)>=40,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(12,18),lv:3});return c},text:c=>T(`A barefoot youth, ${c.npc.en}, has followed you for three days, begging to be taught.`,`一个赤脚少年${c.npc.zh}跟了你三天，求你收他为徒。`),
 opts:[{l:T('Teach them','收下'),out:[{w:2,t:T('They are clumsy and tireless. You start to look forward to mornings.','少年笨手笨脚，却不知疲倦。你开始盼着每天早上。'),c:'good',fx:{meet:'disciple',bond:75,happy:5}},{w:1,t:T('They learn quickly, and leave one night with your best manual.','学得很快，有天夜里带着你最好的秘籍跑了。'),c:'bad',fx:{meet:'enemy',bond:5,happy:-5}}]},
  {l:T('Send them away','打发走'),out:[{t:T('They bow nine times at your gate before going.','少年在你门口磕了九个头，才离去。'),c:'muted'}]}]});
I({id:'oldvisit',age:[60,100],cd:6,text:()=>T('People you once helped come to visit you, bringing grandchildren.','当年受过你恩惠的人带着孙辈来看你。'),when:s=>s.align>=20,
 out:[{w:3,t:T('The house is full of noise for a day. You are tired and very happy.','屋里热闹了一整天。你累了，可很高兴。'),c:'good',fx:{happy:6}},{w:1,t:T('One of them presses a purse on you and will not take it back.','其中一人硬塞给你一个钱袋，怎么也不肯收回。'),c:'good',fx:{money:[20,60],happy:4}}]});
I({id:'oldillness',age:[60,100],cd:5,text:()=>T('You fall ill over the winter, and for a while it is uncertain.','入冬后你病倒了，有一阵子很是凶险。'),
 out:[{w:s=>s.t.root,t:T('You recover. Your appetite comes back first.','你挺了过来，先回来的是胃口。'),fx:{hurt:[6,14],cause:T('a winter illness','冬日的病')}},{w:4,t:T('You recover slowly, and never quite all the way.','你慢慢好了，却始终没好全。'),c:'bad',fx:{hurt:[10,22],cause:T('a winter illness','冬日的病'),maxHealth:-3}}]});
I({id:'oldduelinvite',age:[55,90],cd:10,when:s=>power(s)>=85,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(20,30),lv:Math.round(power(s)*rint(8,12)/10)});return c},text:c=>T(`A young champion, ${c.npc.en}, challenges you to prove that the old masters are finished.`,`年轻高手${c.npc.zh}向你挑战，要证明老一辈已经不行了。`),
 opts:[{l:T('Accept','应战'),fight:FG((s,c)=>c.npc.lv,'light',T('Old against new','长江后浪'),T('a duel','比武')),win:[{t:T('You win with one move you learned sixty years ago.','你用六十年前学的一招赢了。'),c:'gold',fx:{fame:5,happy:6}}],lose:[{t:T('You lose, and shake their hand, and feel oddly proud.','你输了，和对方握了握手，竟有些欣慰。'),fx:{fame:1,happy:2}}]},
  {l:T('Decline with a smile','笑而不答'),out:[{t:T('"I have nothing left to prove." They leave, unsure whether they won.','"我已无须证明什么。"对方走了，也不知道自己算不算赢。'),c:'muted',fx:{qi:2}}]}]});
I({id:'oldgarden',age:[55,100],cd:6,text:()=>T('You put all your patience into a small garden.','你把全部的耐心都花在一个小园子上。'),
 out:[{w:2,t:T('Your chrysanthemums are the best in the district.','你的菊花是这一带最好的。'),c:'good',fx:{happy:5}},{w:1,t:T('Rabbits eat everything. You admire their persistence.','兔子把什么都吃光了。你倒佩服它们的毅力。'),c:'muted',fx:{happy:1}},{w:1,t:T('An old monk stops by to admire the plum tree, and stays for tea every week.','一位老和尚路过赏梅，此后每周都来喝茶。'),c:'good',fx:{meet:'friend',bond:65,qi:2}}]});

/* older story threads, listed under "Unfinished business" until their payoff happens */
Object.assign(QHINT,{
 hostcontract:{t:T('A rich banquet host has your measure. He may send for you.','宴席上那位富商记住了你，迟早会派人来找。'),done:'hostcontract'},
 kitegirl:{t:T('Somewhere, someone still has the kite you lost as a child.','你小时候丢的那只风筝，或许还在某人手里。'),done:'kitereunion'},
 ironpalmfavour:{t:T('The Iron Palm Hall owes you a favour.','铁掌堂欠你一个人情。'),done:'ironpalm'},
 prophecy_eye:{t:T('A fortune teller warned you of a one-eyed man and a blood debt.','算命先生说你命里有笔血债，要小心独眼之人。'),done:'oneeye'},
 prisontreasure:{t:T('An old prisoner told you where his treasure is buried.','狱中老囚告诉过你他埋宝的地方。'),done:'prisongold'},
 mastersin:{t:T('Your master once wronged a widow. She may still be alive.','师父当年辜负过一个寡妇，她或许还在世。'),done:'mastersin'}
});
function openQuests(s){return Object.keys(QHINT).filter(k=>{if(s.flags[k]==null)return false;const h=QHINT[k];return !(h.done&&s.seen[h.done]!=null)}).map(k=>QHINT[k].t||QHINT[k])}
