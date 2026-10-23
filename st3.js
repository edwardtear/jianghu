/* 江湖一生 · 江湖见闻: one-off encounters tied to a region, a festival, or just the comedy of life. Each happens at most
   once a life, only where it belongs, and every one you find is kept in the 江湖奇遇录. */
'use strict';
const ENC={},ENC_ORDER=[];
const ENC_GROUP={central:T('the Central Plains','中原'),jiangnan:T('Jiangnan','江南'),shu:T('Shu','蜀中'),north:T('the Northern Frontier','塞北'),west:T('the Western Regions','西域'),
  miao:T('the Miao Borderlands','苗疆'),east:T('the Eastern Sea','东海'),capital:T('the Capital','京城'),fest:T('Festivals','节令'),odd:T('Oddities','趣事')};
function EN(d){const id=d.id;ENC[id]={n:d.n,g:d.g};ENC_ORDER.push(id);d.id='en_'+id;d.once=1;d.enc=id;d.noThread=1;d.w=d.w??(d.g==='fest'||d.g==='odd'?1.6:3.5);if(typeof d.text!=='function'){const t=d.text;d.text=()=>t}
  const w=d.when,g=d.g;d.when=s=>(!ENC_GROUP[g]||g==='fest'||g==='odd'||s.region===g)&&s.jail<=0&&(!w||w(s));I(d)}
(()=>{const ri=runIncident;runIncident=function(s,inc,c){const r=ri.apply(this,arguments);if(r&&inc&&inc.enc){(s.loreNew=s.loreNew||[]).push(['@',inc.enc]);
  const q=s.queue[s.queue.length-1];if(q&&q.id===inc.id)q.tagline=T(`Encounter · ${ENC[inc.enc].n.en}`,`见闻 · ${ENC[inc.enc].n.zh}`)}return r}})();

/* ---------- 中原 ---------- */
EN({id:'sweeper',g:'central',n:T('The Sweeping Monk','扫地僧'),age:[14,80],tags:['wander','town'],
 text:T('At the foot of Mount Song, an old monk is sweeping the same stretch of path he swept yesterday. As you pass, he says, without looking up: “Your breath is too high.”','嵩山脚下，一个老和尚在扫昨天已经扫过的那段路。你经过时，他头也不抬地说：“施主，气提得太高了。”'),
 opts:[{l:T('Stop and ask what he means','停下来请教'),out:[{w:s=>s.t.heart,t:T('He shows you, with the broom, where breath should sit. It changes your training for good.','他用扫帚柄点了点，告诉你气该沉在哪里。你的练法从此不一样了。'),c:'gold',fx:{qi:[3,6],talent:{heart:1}}},{w:s=>11-s.t.heart,t:T('He goes on sweeping as if you were not there.','他接着扫地，好像你不存在。'),c:'muted'}]},
  {l:T('Walk on','走自己的路'),out:[{t:T('Behind you, the broom keeps its rhythm.','身后，扫帚声一下一下，不紧不慢。'),c:'muted'}]}]});
EN({id:'peony',g:'central',n:T('The Peony Fair','牡丹花会'),age:[12,80],tags:['town'],
 text:T('Luoyang’s peony fair. A rich man is offering a hundred taels for anyone who can write a couplet worthy of his black peony.','洛阳牡丹花会。一个富户悬赏一百两，求一副配得上他那株墨牡丹的对联。'),
 opts:[{l:T('Try a couplet','试着对一副'),out:[{w:s=>s.smarts/25,t:T('Your couplet is hung beside the flower. The silver is real.','你的对联挂在了花旁。银子也是真的。'),c:'gold',fx:{money:100,fame:2,smarts:1}},{w:1,t:T('The crowd laughs, kindly. A girl corrects your tones.','众人笑了，倒也没恶意。一个姑娘帮你纠正了平仄。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Just enjoy the flowers','只管赏花'),out:[{t:T('A whole city of flowers. You stay till dark.','满城都是花。你一直待到天黑。'),c:'good',fx:{happy:6}}]}]});
/* ---------- 江南 ---------- */
EN({id:'bridge',g:'jiangnan',n:T('Rain on the Broken Bridge','断桥借伞'),age:[14,60],tags:['wander','town'],
 text:T('Sudden rain on the Broken Bridge. A stranger in white, with no umbrella, looks at yours.','断桥上忽然下起雨来。一个白衣人没带伞，看着你的伞。'),
 opts:[{l:T('Lend the umbrella','把伞借出去'),out:[{w:3,t:T('Three days later the umbrella comes back, with a jar of the best tea you have ever had.','三天后伞还回来了，还附了一罐你这辈子喝过最好的茶。'),c:'good',fx:{happy:5,meet:'friend',bond:55}},{w:1,t:T('You never see the umbrella again. You decide it was a good umbrella to lose.','那把伞再没回来。你觉得，丢在这样的雨里也值。'),c:'muted',fx:{happy:2}}]},
  {l:T('Share it across the bridge','一起撑过桥'),out:[{t:T('You walk slowly. Neither of you mentions the rain has stopped.','你们走得很慢。雨停了，谁也没提。'),c:'good',fx:{happy:7,meet:'friend',bond:60}}]}]});
EN({id:'saltfeast',g:'jiangnan',n:T('The Salt Merchants’ Feud','盐商斗富'),age:[16,70],tags:['town'],
 text:T('Two Yangzhou salt merchants are trying to out-spend each other. One is throwing gold leaf into the canal. The other wants a bodyguard who looks expensive.','扬州两个盐商在斗富。一个往运河里撒金箔，另一个要雇个“看着就贵”的保镖。'),
 opts:[{l:T('Stand there looking expensive (one day)','站在那儿装贵（一天）'),out:[{t:T('You stand very still in a borrowed silk robe for nine hours. It pays shockingly well.','你穿着借来的绸袍，一动不动站了九个时辰。工钱高得吓人。'),c:'good',fx:{money:[40,80]}}]},
  {l:T('Fish the gold leaf out of the canal','去运河里捞金箔'),out:[{w:2,t:T('You and half the town’s children. You come out with enough for a good dinner.','你和半城的小孩一起捞。捞出来的够吃顿好的。'),c:'good',fx:{money:[5,20],happy:3}},{w:1,t:T('You fall in. The merchants laugh until they cry, and tip you.','你掉进了河里。两个盐商笑得前仰后合，还打赏了你。'),c:'muted',fx:{money:[10,30]}}]}]});
/* ---------- 蜀中 ---------- */
EN({id:'plankroad',g:'shu',n:T('The Plank Road','栈道断木'),age:[14,70],tags:['wander','af_travel'],
 text:T('On the plank road over the gorge, a board gives way under the mule ahead. The muleteer is hanging on to the harness, and the mule is going over.','峡谷上的栈道，前头一头骡子踩断了木板。赶骡人死死拽着缰绳，骡子正往下坠。'),
 opts:[{l:T('Grab the muleteer','拽住赶骡人'),out:[{w:3,t:T('You haul him up. The mule goes, with all his goods. He is alive, and says so many times.','你把他拖了上来。骡子连同货物都掉下去了。他活着，嘴里一遍遍念叨着。'),c:'good',fx:{align:3}},{w:1,t:T('You both nearly go over. Your arm will remember it.','你们俩差点一起掉下去。你那条胳膊会记得这事。'),c:'muted',fx:{align:3,hurt:[5,12],cause:T('a fall on the plank road','栈道上一跤')}}]},
  {l:T('Save the mule and the man both','人和骡子都要救'),out:[{w:s=>power(s)/40,t:T('Somehow, you do. Muleteers on this road will tell the story for years.','你居然做到了。这条路上的赶骡人，往后讲了好多年。'),c:'gold',fx:{fame:3,align:3,money:20}},{w:2,t:T('You lose the mule and most of your skin.','骡子没保住，你也蹭掉了好几块皮。'),c:'bad',fx:{hurt:[10,22],cause:T('a fall on the plank road','栈道上一跤')}}]}]});
EN({id:'facechange',g:'shu',n:T('The Face-Changer','变脸'),age:[10,80],tags:['town'],
 text:T('A Sichuan opera face-changer flicks through seven faces in a breath. Afterwards you see him in the alley, changing them back for a man in a hurry, for money.','川剧变脸，一口气换了七张脸。散场后你在巷子里又看见他：一个神色匆匆的人塞给他钱，请他帮着“换张脸”。'),
 opts:[{l:T('Follow the man in a hurry','跟上那个神色匆匆的人'),out:[{w:2,t:T('He is a debtor running from a loan shark, not a criminal. You let him go.','那人只是个躲高利贷的，算不上坏人。你放他走了。'),c:'muted'},{w:1,t:T('He is wanted for murder. The constables pay a reward.','那人背着人命官司。官府给了你一笔赏钱。'),c:'good',fx:{money:50,fame:2}}]},
  {l:T('Ask the actor to teach you a face','请艺人教你一张脸'),out:[{t:T('He teaches you one. It takes a month and you are terrible at it.','他教了你一张。学了一个月，你还是变得很烂。'),c:'good',fx:{happy:5,looks:1}}]}]});
/* ---------- 塞北 ---------- */
EN({id:'wolves',g:'north',n:T('Wolves Beyond Yanmen','雁门狼群'),age:[14,70],tags:['wander','af_travel'],
 text:T('Night beyond Yanmen Pass. The fire is low, and there are eyes at the edge of the light. Many of them.','雁门关外的夜。篝火快灭了，火光边缘全是眼睛，好多双。'),
 opts:[{l:T('Build up the fire and wait for dawn','添柴，熬到天亮'),out:[{w:s=>s.t.heart,t:T('You do not sleep, and you do not move. At dawn they are gone.','你一夜没合眼，也一动没动。天亮时它们走了。'),c:'good',fx:{qi:2}},{w:2,t:T('The fire holds, mostly. One gets your leg before it runs.','火大体守住了。有一头逃走前咬了你的腿。'),c:'muted',fx:{hurt:[8,18],cause:T('wolves beyond the pass','关外狼群')}}]},
  {l:T('Go out and kill the leader','出去宰了头狼'),fight:s=>({foe:{name:T('the grey wolf king','灰狼王'),lv:Math.max(15,Math.round(power(s)*.9)),fixed:1,beast:1},stakes:'injury',title:T('Wolves','狼群'),cause:T('wolves beyond the pass','关外狼群')}),
   win:[{t:T('The pack scatters. You keep the pelt.','狼群散了。那张狼皮你留下了。'),c:'gold',fx:{fame:2,money:30}}],lose:[{t:T('You make it back to the fire, barely.','你总算爬回了火堆边。'),c:'bad'}]}]});
EN({id:'oldsoldier',g:'north',n:T('The Old Soldier','老兵'),age:[16,80],tags:['wander','town'],
 text:T('An old soldier at the frontier post has served forty years and has a letter of discharge that nobody will honour. He wants only to see the south once before he dies.','边关驿站里，一个老兵当了四十年兵，手里的退役文书没人认。他只想死前回南边看一眼。'),
 opts:[{l:T('Pay his way south (40 taels)','出钱送他南下（四十两）'),cost:40,out:[{t:T('He sends you a letter from a village in the south, in someone else’s handwriting. It says the rice is green.','后来他从南边一个村子托人写了封信给你，说稻子是绿的。'),c:'good',fx:{align:3,happy:5}}]},
  {l:T('Take his papers to the commandant','拿着文书去找守将'),out:[{w:s=>1+s.fame/30,t:T('Your name gets you through the door, and his papers get honoured.','凭你的名头进了门，他的文书也被认了。'),c:'good',fx:{align:3,fame:1}},{w:1,t:T('You are thrown out. So is he.','你被轰了出来。他也是。'),c:'muted'}]},
  {l:T('Drink with him','陪他喝几杯'),out:[{t:T('He tells you about a girl in the south. You let him tell it twice.','他给你讲南边的一个姑娘。你听他讲了两遍。'),c:'good',fx:{happy:3}}]}]});
/* ---------- 西域 ---------- */
EN({id:'mural',g:'west',n:T('The Cave Painter','敦煌画师'),age:[14,70],tags:['town','wander'],
 text:T('In the Dunhuang caves, a painter is working on a guardian king and needs a model with the right stance. He has been watching you.','敦煌石窟里，一个画师正在画天王像，缺一个架势对的模特。他已经盯了你好一会儿。'),
 opts:[{l:T('Pose for him','给他当模特'),out:[{t:T('A month standing on one leg. A thousand years from now, people will look up at you.','单腿站了一个月。一千年以后，还会有人抬头看你。'),c:'gold',fx:{fame:2,happy:6,maxHealth:2}}]},
  {l:T('Decline','婉拒'),out:[{t:T('He finds a camel driver instead. The guardian king has a very long face.','他另找了个赶骆驼的。那天王的脸长得出奇。'),c:'muted'}]}]});
EN({id:'caravan',g:'west',n:T('The Lost Caravan','迷路的商队'),age:[16,70],tags:['wander','af_travel'],
 text:T('A Persian caravan has lost the track in a sandstorm. Their water will last two days. Yours, one.','一支波斯商队在沙暴里迷了路。他们的水还能撑两天，你的只够一天。'),
 opts:[{l:T('Lead them by the stars','看星星带路'),out:[{w:s=>s.smarts/30+s.t.luck*.2,t:T('Three nights by the stars, and the oasis. They pay you in silk and a story.','照着星星走了三夜，到了绿洲。他们用丝绸和一个故事来报答你。'),c:'gold',fx:{money:[60,120],meet:'friend',bond:60}},{w:1,t:T('You find the oasis on the fifth day, more dead than alive.','第五天才找到绿洲，人已经去了半条命。'),c:'bad',fx:{hurt:[15,30],cause:T('thirst in the desert','大漠焦渴')}}]},
  {l:T('Go on alone','独自上路'),out:[{t:T('You make it. You do not know if they did.','你走出来了。他们有没有，你不知道。'),c:'muted',fx:{align:-2}}]}]});
/* ---------- 苗疆 ---------- */
EN({id:'gucup',g:'miao',n:T('The Gu Girl’s Cup','蛊女的酒'),age:[16,50],tags:['wander','town'],
 text:T('A Miao girl at the market pours you a cup and says, smiling, that it may or may not have Gu in it. Everyone around is watching to see what you do.','集市上，一个苗家姑娘给你倒了一杯酒，笑着说里面可能有蛊，也可能没有。周围的人都在看你怎么办。'),
 opts:[{l:T('Drink it','一口喝了'),out:[{w:3,t:T('There is nothing in it. That was the test. The market cheers.','里面什么也没有。这就是考验。满集市的人都叫好。'),c:'good',fx:{fame:1,happy:4,meet:'friend',bond:60}},{w:1,t:T('There was something in it. You are sick for a month, and she nurses you, laughing.','里面真有东西。你病了一个月，她一边照顾你一边笑。'),c:'muted',fx:{hurt:[6,14],cause:T('a Gu girl’s joke','蛊女的玩笑'),meet:'friend',bond:65}}]},
  {l:T('Pour it on the ground','倒在地上'),out:[{t:T('She shrugs. The watching faces lose interest in you.','她耸耸肩。围观的人对你没了兴趣。'),c:'muted'}]}]});
EN({id:'songfest',g:'miao',n:T('The Third of the Third','三月三对歌'),age:[14,40],tags:['town','wander'],ctx:s=>({npc:npc(s,{sex:s.gender==='m'?'f':'m',age:s.age+rint(-3,3)})}),
 text:T('The third day of the third month: young people on both sides of the river sing to each other. Someone across the water has picked you.','三月三，河两岸的年轻人隔水对歌。对岸有人挑中了你。'),
 opts:[{l:T('Sing back','对唱回去'),out:[{w:s=>1+s.looks/40,t:T('You sing badly, and with feeling. It goes on till dark.','你唱得很烂，但很用心。一直对到天黑。'),c:'good',fx:{happy:8,meet:'lover',bond:55}},{w:1,t:T('The other side laughs so hard they cannot finish the verse.','对岸笑得唱不下去了。'),c:'muted',fx:{happy:3}}]},
  {l:T('Hide behind a tree','躲到树后'),out:[{t:T('They sing a verse about the coward behind the tree.','对岸又唱了一段，唱的是树后那个胆小鬼。'),c:'muted'}]}]});
/* ---------- 东海 ---------- */
EN({id:'mirage',g:'east',n:T('A City on the Sea','海市蜃楼'),age:[8,90],tags:['wander','af_sightsee'],
 text:T('At dawn, a whole city stands on the sea: towers, gates, a pagoda. The fishermen go quiet. In an hour it is gone.','黎明时分，海上立起一整座城：楼阁、城门、宝塔。渔民们都不说话了。一个时辰后，城就散了。'),
 opts:[{l:T('Watch until it fades','一直看到它散去'),out:[{t:T('You never forget it. Some nights you dream you are walking its streets.','你一辈子都忘不了。有些夜里，你会梦见自己走在那座城的街上。'),c:'gold',fx:{happy:8,smarts:1}}]},
  {l:T('Row out towards it','划船过去'),out:[{t:T('It recedes exactly as fast as you row. The fishermen think you are very funny.','你划多快，它就退多快。渔民们觉得你很好笑。'),c:'muted',fx:{happy:3}}]}]});
EN({id:'pirates',g:'east',n:T('Pirates at the Fishing Village','海寇登岸'),age:[16,70],tags:['wander','town'],
 text:T('Sails on the horizon: pirates, coming for the fishing village. The men are at sea. There are old people, women and children, and you.','天边出现了帆：海寇要来抢渔村了。男人们都出海了。村里只剩老人、女人、孩子，还有你。'),
 opts:[{l:T('Hold the beach','守住海滩'),fight:s=>({foe:{name:T('the pirate captain','海寇头目'),lv:Math.max(15,Math.round(power(s)*1.05)),fixed:1},stakes:'injury',title:T('The beach','海滩'),cause:T('pirates','海寇')}),
   win:[{t:T('They row away. The village feeds you for a week.','他们划走了。全村请你吃了一个礼拜。'),c:'gold',fx:{fame:4,align:5}}],lose:[{t:T('You hold them long enough for everyone to reach the hills.','你拖住了他们，大家都来得及逃上了山。'),c:'muted',fx:{align:4,fame:2}}]},
  {l:T('Lead everyone to the hills','带大家上山躲'),out:[{t:T('The village burns. Everyone in it lives.','村子烧了，人都活着。'),c:'good',fx:{align:3}}]}]});
/* ---------- 京城 ---------- */
EN({id:'tianqiao',g:'capital',n:T('The Stone on the Chest','胸口碎大石'),age:[16,60],tags:['town'],
 text:T('At Tianqiao, a strongman lies under a millstone and invites anyone to break it with a hammer. His partner is passing round a bowl. The hammer looks suspiciously light.','天桥底下，一个壮汉躺着，胸口压块大石，请人抡锤砸。他搭档端着碗收钱。那锤子看着轻得可疑。'),
 opts:[{l:T('Swing the hammer','抡锤'),out:[{w:2,t:T('The stone breaks. The strongman bows. Everyone pays.','石头碎了。壮汉起身作揖。大家纷纷掏钱。'),c:'good',fx:{happy:4}},{w:s=>power(s)/50,t:T('You swing too hard, and the hammer, the stone and the stand all break. He gives you money to go away.','你用力太猛，锤子、石头、架子一起碎了。他塞钱请你赶紧走。'),c:'good',fx:{money:20,fame:1}}]},
  {l:T('Lie under the stone yourself','自己躺上去'),out:[{w:s=>s.t.root*.3,t:T('You stand up afterwards. The crowd loses its mind.','砸完你站了起来。人群炸了锅。'),c:'gold',fx:{money:[20,40],fame:1}},{w:1,t:T('You do not stand up for a while.','你好一阵子没站起来。'),c:'bad',fx:{hurt:[8,16],cause:T('a street act gone wrong','街头卖艺失手')}}]}]});
EN({id:'parade',g:'capital',n:T('The Top Scholar’s Parade','状元游街'),age:[14,80],tags:['town'],
 text:T('The new top scholar rides through the streets in red. You look closer: it is the boy who sat next to you at the village school, the one everyone said was hopeless.','新科状元披红游街。你仔细一看：是当年私塾里坐你旁边、谁都说没出息的那个孩子。'),
 opts:[{l:T('Shout his old nickname','喊他当年的外号'),out:[{w:2,t:T('He looks round, sees you, and laughs out loud on his horse. That evening a note comes inviting you to dinner.','他回过头，看见你，在马上大笑起来。当晚就有人送来请帖。'),c:'good',fx:{happy:6,meet:'friend',bond:65}},{w:1,t:T('The guards are not amused.','卫兵可不觉得好笑。'),c:'muted'}]},
  {l:T('Watch quietly','默默看着'),out:[{t:T('You are glad for him. You are surprised how glad.','你替他高兴。高兴得连自己都意外。'),c:'good',fx:{happy:4}}]}]});
/* ---------- 节令 ---------- */
EN({id:'lantern',g:'fest',n:T('Lantern Riddles','元宵灯谜'),age:[8,90],tags:['town'],
 text:T('Lantern Festival. The streets are rivers of light, and every lantern has a riddle under it. A stall keeper offers a prize for ten in a row.','元宵节，满街灯火如河，每盏灯下都挂着谜条。有个摊主说，连猜中十条有彩头。'),
 opts:[{l:T('Guess riddles all night','猜一整夜'),out:[{w:s=>s.smarts/25,t:T('Ten in a row. The prize is a rabbit lantern, which you carry home very seriously.','连中十条。彩头是一盏兔子灯，你一本正经地提回了家。'),c:'gold',fx:{happy:7,smarts:1}},{w:1,t:T('You get three. The answers, when you read them, are infuriating.','只猜中三条。看了谜底，气得牙痒痒。'),c:'muted',fx:{happy:3}}]},
  {l:T('Just walk under the lights','只管看灯'),out:[{t:T('For one night, the whole town is beautiful.','这一夜，整座城都是好看的。'),c:'good',fx:{happy:5}}]}]});
EN({id:'dragonboat',g:'fest',n:T('The Dragon Boat Race','端午赛龙舟'),age:[14,55],tags:['town','wander'],
 text:T('Dragon Boat Festival. One of the crews is a man short, and the drummer is pointing at you.','端午节赛龙舟。有条船少了一个桨手，打鼓的正指着你。'),
 opts:[{l:T('Grab a paddle','抄起桨'),out:[{w:s=>s.t.root*.3+power(s)/60,t:T('You win by a head. You will be sore for a week and proud for a year.','领先一个船头赢了。你会酸痛一个礼拜，得意一整年。'),c:'gold',fx:{happy:8,fame:1}},{w:2,t:T('You come third, soaked. Rice dumplings for everyone anyway.','得了第三，浑身湿透。粽子照样人人有份。'),c:'good',fx:{happy:5}}]},
  {l:T('Cheer from the bank','在岸上喊加油'),out:[{t:T('You lose your voice. Worth it.','嗓子喊哑了。值。'),c:'good',fx:{happy:3}}]}]});
EN({id:'midautumn',g:'fest',n:T('Mid-Autumn Moon','中秋望月'),age:[16,90],
 text:(c,s)=>living(s,['father','mother','spouse','child','sibling']).length?T('Mid-Autumn. The moon is enormous, and the family is all at one table, for once.','中秋。月亮又大又圆，一家人难得都坐在一张桌上。'):T('Mid-Autumn. The moon is enormous. Everyone else has somewhere to be.','中秋。月亮又大又圆。别人都有地方可去。'),
 opts:[{l:T('Stay up late under it','在月下坐到很晚'),out:[{t:(c,s)=>living(s,['father','mother','spouse','child','sibling']).length?T('Nobody says anything important. It is one of the best nights of your life.','没人说什么要紧的话。那却是你这辈子最好的夜晚之一。'):T('You buy one mooncake and share it with a stray dog. It is not as sad as it sounds.','你买了一块月饼，分给一条野狗。其实没有听上去那么凄凉。'),c:'good',fx:{happy:6}}]},
  {l:T('Write a letter to someone far away','给远方的人写封信'),out:[{t:T('You write three pages and send one.','写了三页，寄出去一页。'),c:'good',fx:{happy:4,smarts:1}}]}]});
EN({id:'newyear',g:'fest',n:T('New Year’s Eve Vigil','除夕守岁'),age:[6,90],
 text:T('New Year’s Eve. The firecrackers start at dusk and do not stop. Tradition says you stay awake till dawn to see the old year out.','除夕。黄昏起鞭炮就没停过。老规矩，要守岁守到天亮，把旧年送走。'),
 opts:[{l:T('Keep the vigil','守到天亮'),out:[{w:s=>s.t.heart,t:T('You see the first light of the new year with clear eyes.','你清清醒醒地看见了新年的第一缕光。'),c:'good',fx:{happy:5,qi:1}},{w:3,t:T('You fall asleep at the fourth watch and wake with firecracker paper in your hair.','四更天你就睡着了，醒来头发里全是鞭炮屑。'),c:'muted',fx:{happy:3}}]},
  {l:T('Set off the biggest firecracker in the street','放整条街最大的炮仗'),out:[{w:3,t:T('It is magnificent. Dogs three villages away bark.','壮观极了。三个村外的狗都叫了起来。'),c:'good',fx:{happy:6,money:-5}},{w:1,t:T('It is magnificent, and it takes your eyebrows.','壮观极了，顺带燎掉了你的眉毛。'),c:'muted',fx:{looks:-2,happy:4}}]}]});
/* ---------- 趣事 ---------- */
EN({id:'drinkduel',g:'odd',n:T('The Drinking Duel','斗酒'),age:[18,70],tags:['town'],
 text:T('A big man at the tavern has drunk eleven men under the table tonight and is looking for a twelfth. His eyes land on you.','酒馆里一个大汉今晚已经喝趴了十一个人，正找第十二个。他的眼睛落到了你身上。'),
 opts:[{l:T('Accept, and drink honestly','应战，老老实实喝'),out:[{w:s=>s.t.root*.25,t:T('Jar after jar. He goes down like a felled tree. The tavern will not let you pay for a year.','一坛接一坛。他像棵树一样轰然倒下。这家酒馆一年都不收你的钱。'),c:'gold',fx:{fame:2,happy:6}},{w:2,t:T('You wake up under a table in a different tavern, with no idea how.','你在另一家酒馆的桌子底下醒来，完全想不起是怎么过来的。'),c:'muted',fx:{happy:2,money:-10}}]},
  {l:T('Accept, and push the wine out through your fingertips','应战，暗中用内力把酒从指尖逼出去'),if:s=>s.qi>=20,out:[{t:T('Wine drips quietly from your left hand under the table. You win, and feel slightly ashamed.','酒顺着你左手指尖悄悄滴到桌下。你赢了，有点心虚。'),c:'good',fx:{fame:2,align:-1}}]},
  {l:T('Decline','不喝'),out:[{t:T('He calls you a coward, and buys you a drink anyway.','他骂你胆小鬼，还是请了你一杯。'),c:'muted'}]}]});
EN({id:'rooster',g:'odd',n:T('The Undefeated Rooster','常胜鸡'),age:[8,80],tags:['town'],
 text:T('A farmer’s rooster has won forty-one cockfights in a row and is for sale. It is small, ugly and has one eye. It looks at you as if it knows something.','一个农户的公鸡连赢了四十一场斗鸡，要卖。个头小，长得丑，还瞎了一只眼。它看着你，像是知道些什么。'),
 opts:[{l:T('Buy it (15 taels)','买下（十五两）'),cost:15,out:[{w:2,t:T('It wins eleven more fights for you, then retires to your yard and bullies the dog.','它又替你赢了十一场，然后退隐到你院子里，专欺负狗。'),c:'good',fx:{money:[30,60],happy:5}},{w:1,t:T('It loses its first fight for you, and gives you a look of complete contempt.','它替你打的第一场就输了，还用一种极其鄙视的眼神看着你。'),c:'muted',fx:{happy:2}}]},
  {l:T('Leave it be','算了'),out:[{t:T('As you walk away, you could swear it shrugs.','你走开时，敢发誓它耸了耸肩。'),c:'muted'}]}]});
EN({id:'fraud',g:'odd',n:T('The Secret Manual Seller','卖秘籍的'),age:[12,80],tags:['town','wander'],
 text:T('A man in a long beard is selling “the lost Nine Yang Manual” for only three taels. He has a whole basket of them.','一个长胡子的人在卖“失传的九阳真经”，只要三两。他有满满一筐。'),
 opts:[{l:T('Buy one, for fun (3 taels)','买一本玩玩（三两）'),cost:3,out:[{w:4,t:T('It is a cookery book with a new cover. The recipes are surprisingly good.','是本换了封皮的菜谱。不过菜谱写得出奇地好。'),c:'muted',fx:{happy:3}},{w:1,t:T('It is a cookery book, but someone has scribbled breathing notes in the margins that actually work.','是本菜谱，可页边有人写了几行吐纳心得，居然管用。'),c:'gold',fx:{qi:[2,4]}}]},
  {l:T('Expose him to the crowd','当众揭穿他'),out:[{w:s=>s.smarts/30,t:T('The crowd takes their three taels back. He shakes your hand on the way out, professionally.','众人纷纷把三两要了回去。他走之前还跟你握了握手，很是敬业。'),c:'good',fx:{fame:1}},{w:1,t:T('The crowd decides you are jealous and buys two each.','众人觉得你是眼红，一人买了两本。'),c:'muted'}]}]});
EN({id:'matchmaker',g:'odd',n:T('The Matchmaker Who Would Not Give Up','死缠烂打的媒婆'),age:[24,60],when:s=>!spouseOf(s),tags:['town'],ctx:s=>({npc:npc(s,{sex:s.gender==='m'?'f':'m',age:s.age+rint(-4,4)})}),
 text:T('Auntie Wang the matchmaker has decided your being unmarried is a personal insult. She has brought a list. It is very long.','王媒婆认定你不成亲是在跟她过不去。她带来了一份名单，很长很长。'),
 opts:[{l:T('Let her try','让她试试'),out:[{w:2,t:T('After nine disastrous meetings, the tenth is someone you actually like.','九次相亲都砸了，第十个居然是你真心喜欢的。'),c:'good',fx:{happy:5,meet:'lover',bond:60}},{w:1,t:T('After twelve meetings even she gives up, and sends you a consolation duck.','相了十二回，连她都放弃了，还送了你一只鸭子以示安慰。'),c:'muted',fx:{happy:2}}]},
  {l:T('Climb out of the back window','从后窗翻出去'),out:[{t:T('She is waiting in the alley. She has a second list.','她在巷子里等着你。手里又是一份名单。'),c:'muted',fx:{happy:1}}]}]});
