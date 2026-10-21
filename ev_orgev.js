/* 江湖一生 · incidents: your own house (a sect you founded, or an escort agency), the newer jobs, and a few opportunities */
'use strict';
const OGT=['org'];
const ogS=s=>!!(s.org&&s.org.type==='sect'&&!s.org.evil);
const ogE=s=>!!(s.org&&s.org.type==='sect'&&s.org.evil);
const ogX=s=>!!(s.org&&s.org.type==='escort');
const ogA=s=>!!s.org;
/* change reputation (0–100) and head count (never below 1, never past the halls’ room) */
function ogAdj(s,rep,mem){if(!s.org)return;const o=s.org;
  if(rep)o.rep=clamp(o.rep+rep,0,100);
  if(mem>0)o.members=Math.max(o.members,Math.min(o.lv*15,o.members+mem));else if(mem<0)o.members=Math.max(1,o.members+mem)}
const OG=(rep,mem)=>s=>ogAdj(s,rep,mem);
/* a story that ends the house */
function ogEnd(s){if(!s.org)return;s.flags.formerOrg=s.org.name;s.org=null}
const ogC=o=>s=>{const c=scene();c.on=s.org?s.org.name:T('your house','你的门户');if(o)c.npc=npc(s,typeof o==='function'?o(s):o);return c};
const OGN=c=>c.on||T('your house','你的门户');
const ogLv=(m,a)=>s=>Math.max(5,Math.round(power(s)*m+(a||0)+rint(-4,4)));

/* ====================== your own sect: righteous ====================== */
I({id:'og_firstdisc',age:[20,90],once:1,w:1.5,tags:OGT,when:ogS,ctx:ogC(),
 text:c=>T(`Your first three disciples are fighting over who gets to be called “Eldest Brother” of ${OGN(c).en}. One of them has a black eye already.`,`${OGN(c).zh}最早的三个弟子，为了谁当“大师兄”吵翻了天。已经有一个挂了个乌眼青。`),
 opts:[{l:T('Whoever came first is eldest','先入门者为长'),out:[{w:2,t:T('Seniority settles it. The loser sulks for a week, then brings you tea like nothing happened.','论资排辈，就此定了。输的那个闷了一个星期，后来照常给你端茶。'),c:'good',fx:{f:OG(3,0)}},{w:1,t:T('The one who came second insists he arrived the night before and slept by the gate. Nobody can prove otherwise. The argument lives forever.','排第二的坚称自己头天夜里就到了，在门口睡了一宿。谁也证明不了。这场争论从此没完没了。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Let them spar for it','让他们比试定夺'),out:[{w:2,t:T('The smallest one wins with a trick you never taught. You are both proud and worried.','个头最小的那个用一招你从没教过的怪招赢了。你又骄傲又发愁。'),c:'good',fx:{f:OG(4,0),skill:1}},{w:1,t:T('All three end up in the herb room. The title stays empty for a year.','三个人全进了药房。大师兄的位子空了一年。'),c:'muted',fx:{money:-20}}]},
  {l:T('“There is no eldest. There is only practice.”','“没有大师兄，只有练功。”'),out:[{t:T('They stare at you, then at each other, then go back to the training yard. It works for almost a month.','他们看看你，又看看彼此，回练武场去了。这招管用了将近一个月。'),fx:{qi:2,f:OG(2,0)}}]}]});

I({id:'og_prodigy',age:[22,90],once:1,tags:OGT,when:ogS,ctx:ogC({occ:21,age:11}),
 text:c=>T(`A ragged boy, ${c.npc.en}, climbs your mountain alone. He watched your disciples practise through the fence for one afternoon, and now he does the whole form back to you — better.`,`一个衣衫褴褛的男孩${c.npc.zh}独自爬上山来。他隔着篱笆看了你的弟子们一下午，此刻把整套拳原样打给你看——打得比他们还好。`),
 opts:[{l:T('Take him as your personal disciple','收为亲传弟子'),out:[{w:3,t:T('You give him your own room’s lamp to study by. The older disciples grumble, then try harder.','你把自己房里的灯给他读书用。师兄们发了几句牢骚，然后练得更狠了。'),c:'gold',fx:{meet:'disciple',bond:70,f:OG(6,1),fame:2}},{w:1,t:T('He learns everything in a year and asks, “Is that all?” You lie awake that night.','他一年就学完了全部，问你：“就这些？”那天夜里你失眠了。'),c:'gold',fx:{meet:'disciple',bond:55,f:OG(5,1),skill:2}}]},
  {l:T('Treat him like everyone else','一视同仁'),out:[{w:2,t:T('He sweeps the yard with the others and never complains. In ten years he will be the pillar of the house.','他和大家一样扫院子，从不抱怨。十年后，他会是门里的顶梁柱。'),c:'good',fx:{f:OG(3,1),align:2}},{w:1,t:T('He gets bored and leaves for a bigger sect. You hear his name everywhere later.','他觉得无聊，投了大派。后来你到处都能听见他的名字。'),c:'muted',fx:{f:OG(-2,0)}}]},
  {l:T('Send him to Shaolin with a letter','写封信荐他去少林'),out:[{t:T('Years later, a famous monk bows to you at a temple fair. “You sent me. Thank you.”','多年后，一位有名的高僧在庙会上向你合十：“当年是您送我去的，多谢。”'),c:'good',fx:{align:4,fame:1}}]}]});

I({id:'og_lovers',age:[22,90],cd:15,tags:OGT,when:ogS,ctx:ogC({sex:'f',age:20,occ:14}),
 text:c=>T(`Your best disciple has fallen in love with ${c.npc.en}, a daughter of the rival sect across the valley. The two houses have not spoken in thirty years.`,`你最得意的弟子爱上了${c.npc.zh}——山谷对面那个死对头门派的女儿。两家已经三十年不说话了。`),
 opts:[{l:T('Bless them, and go propose to her father','成全他们，亲自登门提亲'),out:[{w:2,t:T('Her father throws your gifts in the river. Then he fishes them out. The wedding is in spring, and the feud is over.','对方掌门把你的礼扔进了河里，又捞了上来。婚礼定在开春，三十年的恩怨就此了结。'),c:'gold',fx:{f:OG(10,2),fame:3,align:3,happy:5}},{w:1,t:T('He slams the gate. That night the couple elope. Now both houses blame you.','他关上了大门。当夜两人私奔了。现在两家都怪你。'),c:'bad',fx:{f:OG(-6,-1)}}]},
  {l:T('Forbid it','不许'),out:[{w:2,t:T('Your disciple obeys and practises like a man trying to break the floor. He never smiles again in your presence.','弟子听了话，练起功来像要把地砖踩碎。从此在你面前再没笑过。'),c:'muted',fx:{f:OG(-2,0),happy:-2}},{w:1,t:T('One morning his bed is empty. A note: “Forgive me, Master.”','一天早上他的床空了。留了张条子：“师父恕罪。”'),c:'bad',fx:{f:OG(-4,-1),happy:-4}}]},
  {l:T('Arrange a duel: if he wins, they marry','比武招亲：赢了就成'),fight:FG(ogLv(.9,0),'light',T('A duel for a bride','比武招亲'),T('a wedding duel','比武招亲'),()=>T('her eldest brother','她的大哥')),
   win:[{t:T('You fight her brother in your disciple’s place, and win. Everyone agrees this is not how it is supposed to work. They marry anyway.','你替弟子出战，赢了她大哥。大家都说规矩不是这么定的，婚还是结了。'),c:'good',fx:{f:OG(6,1),fame:2}}],
   lose:[{t:T('You lose. The couple marry anyway, and her family enjoys telling everyone how.','你输了。他们照样成了亲，女方家逢人便讲这段故事。'),c:'muted',fx:{f:OG(-3,0)}}]}]});

I({id:'og_murder',age:[22,90],cd:15,tags:OGT,when:ogS,ctx:ogC({occ:11,age:25}),
 text:c=>T(`One of your disciples has killed a man in town: ${c.npc.en}, a rich man’s son who beat a fruit-seller half to death. The magistrate wants the killer. The town wants to give him a medal. Everyone waits for your judgement.`,`你的一个弟子在镇上杀了人——死的是富家子${c.npc.zh}，那人刚把一个卖果子的打得半死。县太爷要拿凶手，镇上的人想给他送匾。大家都在等你发话。`),
 opts:[{l:T('Hand him to the magistrate','交给官府'),out:[{w:2,t:T('He walks down the mountain in chains without a word. The law is satisfied. Your disciples are very quiet.','他戴着镣铐一言不发地下了山。王法是交代了，弟子们都沉默了。'),c:'muted',fx:{f:OG(2,-1),align:2,happy:-4}},{w:1,t:T('The magistrate, impressed, quietly lets him serve two years instead of the noose.','县太爷敬你秉公，暗中只判了两年，免了死罪。'),c:'good',fx:{f:OG(5,0),align:3}}]},
  {l:T('Judge him yourself: cripple his arts, keep him','门规处置：废其武功，留在门中'),out:[{t:T('You press his meridians closed with two fingers. He thanks you. He will be a gardener here until he dies.','你两指封了他的经脉。他向你磕头谢恩。此后他会在山上种一辈子菜。'),c:'muted',fx:{f:OG(4,0),align:1,happy:-3}}]},
  {l:T('Hide him and deny everything','把人藏起来，一口咬定不知'),out:[{w:2,t:T('The constables search the mountain and find nothing. The town quietly loves you. The rich family does not.','捕快搜了山，一无所获。镇上的人暗暗敬你，富户家却记恨上了。'),c:'good',fx:{f:OG(3,0),align:-2,enemy:1}},{w:1,t:T('He is found in the woodshed. Now you are accused of harbouring a killer.','人在柴房被搜了出来。这下你成了窝藏凶犯。'),c:'bad',fx:{f:OG(-8,-1),wanted:1,money:-100}}]}]});

I({id:'og_rules',age:[20,90],once:1,w:1.4,tags:OGT,when:ogS,ctx:ogC(),
 text:c=>T(`Your disciples ask for the rules of ${OGN(c).en}, carved in stone at the gate, like every proper sect has.`,`弟子们请你立下${OGN(c).zh}的门规，刻在山门石碑上，像别的名门大派一样。`),
 opts:[{l:T('Ten strict commandments','立十大戒律'),out:[{t:T('No theft, no lechery, no bullying the weak, no betraying the house… The stonemason charges by the character. Visitors read it and nod.','不偷、不淫、不欺弱、不叛门……石匠按字收钱。来客读了都点头。'),c:'good',fx:{money:-40,align:3,f:OG(6,0)}}]},
  {l:T('Three rules, short and clear','约法三章'),out:[{w:2,t:T('“Do not shame the house. Do not abandon a brother. Do not hurt the helpless.” Even the slowest disciple remembers them.','“不辱师门，不弃同门，不欺弱小。”最笨的弟子也背得出来。'),c:'good',fx:{align:2,f:OG(4,0),qi:1}},{w:1,t:T('A clever disciple finds a loophole in rule two within the week.','不到一个星期，就有个机灵弟子从第二条里钻出了空子。'),c:'muted',fx:{happy:2}}]},
  {l:T('One rule: “Be someone your master is not ashamed of.”','只一条：“莫叫师父蒙羞。”'),out:[{t:T('It is very moving and completely unenforceable. Your disciples take it more seriously than any law.','这条门规感人至深，又全然无从执行。弟子们却比遵守任何律法都认真。'),c:'good',fx:{f:OG(3,0),fame:1}}]}]});

I({id:'og_submit',age:[22,90],cd:20,tags:OGT,when:s=>ogS(s)&&s.org.lv<=3,ctx:ogC({occ:13,age:50}),
 text:c=>T(`An envoy from a great sect, ${c.npc.en}, arrives with twenty swordsmen. “Small houses on our mountain should become branches of ours. Submit, merge, or be cleared away.”`,`大派使者${c.npc.zh}带着二十名剑手上山。“我派山下的小门小户，都该归我派做分支。归顺、并派，或者被扫平。”`),
 opts:[{l:T('Refuse, and prove it with the sword','断然拒绝，以剑说话'),fight:FG(ogLv(1.05,6),'injury',T('Defending the gate','保卫山门'),T('defending your sect’s gate','保卫山门')),
   win:[{t:T('The envoy leaves without his sword. Half the jianghu laughs at the great sect, and the other half asks where your mountain is.','使者连剑都没带走。半个江湖笑话那个大派，另外半个在打听你的山门在哪。'),c:'gold',fx:{fame:5,f:OG(12,2)}}],
   lose:[{t:T('You are beaten in your own courtyard. They take a tribute of silver and leave you your name — for now.','你在自家院子里落败。他们收了一笔贡银走了，门派的名号暂且留给你。'),c:'bad',fx:{money:-150,f:OG(-10,-1)}}]},
  {l:T('Become their branch','归为分支'),out:[{t:T('Your banner gets a smaller banner above it. The silver is steadier; the disciples feel smaller.','你的旗子上头多了一面更大的旗。银子来得稳了，弟子们却觉得矮了一截。'),c:'muted',fx:{money:200,f:OG(-6,0),happy:-4}}]},
  {l:T('Merge, and let your house end','并入大派，门户就此终结'),out:[{t:c=>T(`You fold ${OGN(c).en} into the great sect. Your disciples get better rice and a bigger library. You get a seat as an honoured elder, which is a polite word for retired.`,`你把${OGN(c).zh}并入了大派。弟子们吃得更好，藏书更多。你得了个客卿长老的位子——说好听点，就是退休。`),c:'muted',fx:{money:400,happy:-6,f:s=>ogEnd(s),deed:T('Merged their sect into a great one','门派并入大派')}}]},
  {l:T('Talk them into an alliance instead','说服对方改为结盟'),out:[{w:s=>s.smarts/30,t:T('Three days of tea and flattery. You end up allies, not vassals, and their master calls you “little brother”.','三天的茶和好话。最后成了盟友而非附庸，对方掌门还叫你一声“老弟”。'),c:'good',fx:{f:OG(6,0),smarts:1}},{w:1,t:T('They tire of talking. You pay them to tire of it more slowly.','对方听烦了。你花钱让他们烦得慢一点。'),c:'bad',fx:{money:-120,f:OG(-4,0)}}]}]});

I({id:'og_assembly',age:[25,90],cd:12,tags:OGT,when:s=>ogS(s)&&s.org.rep>=25,ctx:ogC(),
 text:c=>T(`A gold-lettered invitation: the master of ${OGN(c).en} is invited to the Martial Assembly on Mount Song, to sit among the heads of the great sects.`,`一张烫金请柬：恭请${OGN(c).zh}掌门赴嵩山武林大会，与各大派掌门同席。`),
 opts:[{l:T('Go, and take the stage','赴会，上台比试'),fight:FG(ogLv(1.0,8),'light',T('The Martial Assembly','武林大会'),T('a bout at the Martial Assembly','武林大会比武'),()=>T('a famous sect master','一位成名掌门')),
   win:[{t:T('You win your bout before ten thousand people. For a year, every boy in the land wants to join your sect.','你在万人面前赢了一场。此后一年，天下的少年都想拜入你门下。'),c:'gold',fx:{fame:8,f:OG(12,3),deed:T('Won a bout at the Martial Assembly as a sect master','以掌门身份在武林大会上胜出')}}],
   lose:[{t:T('You lose, but fairly and with style. People remember the fight more than the result.','你输了，但输得光明磊落、漂亮。人们记住的是那场打斗，不是胜负。'),c:'muted',fx:{fame:2,f:OG(2,0)}}]},
  {l:T('Go, and speak instead of fighting','赴会，只论道不比武'),out:[{w:s=>s.smarts/30,t:T('You speak about the duties of a sect to the poor. The old abbot of Shaolin nods twice. That is a great deal.','你讲门派对百姓的本分。少林老方丈点了两次头——这已是极大的面子。'),c:'good',fx:{fame:4,align:3,f:OG(6,0)}},{w:1,t:T('Nobody hears you over the shouting about who insulted whose grandfather.','会上大家吵着谁骂了谁的祖宗，没人听得见你说话。'),c:'muted',fx:{f:OG(1,0)}}]},
  {l:T('Decline, and stay home','婉拒，留山清修'),out:[{t:T('Your disciples are disappointed. You get a whole quiet month of practice.','弟子们很失望。你得了整整一个月的清静练功。'),c:'muted',fx:{qi:3,skill:1,f:OG(-2,0)}}]}]});

I({id:'og_swordhall',age:[22,90],once:1,tags:OGT,when:ogS,ctx:ogC(),
 text:c=>T(`Your disciples practise in the rain on a yard of mud. An architect offers to build ${OGN(c).en} a proper sword hall.`,`弟子们在泥地里冒雨练剑。一位匠师说可以给${OGN(c).zh}盖一座像样的剑堂。`),
 opts:[{l:T('Stone and cedar, the finest (400 taels)','青石柏木，最好的（四百两）'),cost:400,out:[{t:T('A hall with a roof like a crane’s wings. Visitors stop at the gate just to look. Your disciples practise twice as long, out of pride.','屋檐如鹤翼展开。来客走到门口都要停步看一会儿。弟子们出于自豪，练得比从前久一倍。'),c:'gold',fx:{f:s=>{ogAdj(s,10,0);if(s.org&&s.org.lv<5)s.org.lv++},fame:2}}]},
  {l:T('Timber and thatch (120 taels)','木头茅草（一百二十两）'),cost:120,out:[{w:3,t:T('Not beautiful, but dry.','不好看，但不漏雨。'),c:'good',fx:{f:OG(4,0)}},{w:1,t:T('The first winter wind takes the roof off. Your disciples call it “the Hall of Heaven’s View”.','头一场冬风就把屋顶掀了。弟子们管它叫“观天堂”。'),c:'muted',fx:{happy:2}}]},
  {l:T('Build it yourselves','自己动手盖'),out:[{t:T('A summer of carrying stones. Crooked walls, strong shoulders, a house that feels like theirs.','一夏天都在搬石头。墙歪了，肩膀练硬了，这房子大家都觉得是自己的。'),c:'good',fx:{skill:1,f:OG(5,0),happy:2}}]}]});

I({id:'og_successor',age:[50,95],once:1,w:1.5,tags:OGT,when:s=>ogS(s)&&s.org.members>=3,ctx:ogC({age:30,occ:13}),
 text:c=>T(`You are not getting younger. It is time to name who will lead ${OGN(c).en} after you. Your disciples pretend not to be listening at the window.`,`你年纪不小了，该定下${OGN(c).zh}的继承人了。弟子们装作没在窗外偷听。`),
 opts:[{l:T('The eldest: loyal, steady, ordinary','大弟子：忠厚、稳重、资质平平'),out:[{t:T('He weeps and swears to keep everything exactly as it is. He will. For better and worse.','他哭着发誓一切照旧。他会做到的——好也是它，坏也是它。'),c:'good',fx:{f:OG(4,0),align:2,happy:3,deed:T('Named a loyal successor','立下忠厚的传人')}}]},
  {l:T('The most gifted: brilliant and ambitious','天分最高的：聪明、有野心'),out:[{w:2,t:c=>T(`${c.npc.en} bows a little too fast. Under him, your house will be famous — or ruined. You will not be there to see which.`,`${c.npc.zh}拜得太快了点。在他手里，门派要么名扬天下，要么毁于一旦。是哪一种，你是看不到了。`),c:'gold',fx:{f:OG(8,0),fame:2}},{w:1,t:T('The eldest leaves in protest, taking three disciples with him.','大弟子愤而出走，带走了三个师弟。'),c:'bad',fx:{f:OG(-4,-3)}}]},
  {l:T('Your own child, if they want it','自己的孩子，若他愿意'),if:s=>living(s,'child').length>0,out:[{w:1,t:T('Your child says yes. The disciples say nothing, which says plenty.','孩子答应了。弟子们一言不发——这已说明了一切。'),c:'muted',fx:{f:OG(-3,0),happy:4}},{w:1,t:T('Your child says no, gently, and goes back to their own life. You are prouder than you expected.','孩子温和地拒绝了，回去过自己的日子。你比想象中更为他骄傲。'),c:'good',fx:{happy:3}}]},
  {l:T('Hold a contest among them','比武决定'),out:[{t:T('Seven days of bouts. The winner is the quiet girl who cooks. Nobody saw it coming, which is why she won.','比了七天，赢的是那个不声不响做饭的姑娘。谁也没料到——所以她赢了。'),c:'good',fx:{f:OG(6,0),happy:3}}]}]});

I({id:'og_manualthief',age:[22,90],cd:15,tags:OGT,when:s=>ogS(s)&&s.org.members>=2,ctx:ogC({occ:13,age:24}),
 text:c=>T(`Your secret manual is gone, and so is ${c.npc.en}, the disciple you trusted to copy it. He was seen on the north road at dawn.`,`你的秘籍不见了，一同不见的还有你信任的抄书弟子${c.npc.zh}。天亮时有人看见他上了北边的大路。`),
 opts:[{l:T('Ride after him','追'),fight:FG(ogLv(.85,2),'injury',T('The disciple who stole the manual','盗谱的叛徒'),T('a traitorous disciple','叛门弟子')),
   win:[{t:T('You catch him at a ferry. He drops the book and his eyes. You bring both home.','你在渡口追上了他。他扔下书，低下了头。你把人和书都带了回来。'),c:'good',fx:{f:OG(5,-1),fame:1}},{w:1,t:T('You catch him, take the book, and let him go. “Never use my name.”','你追上他，拿回了书，放他走了。“别再报我的名号。”'),c:'muted',fx:{align:2,f:OG(2,-1)}}],
   lose:[{t:T('He was better than you knew. He leaves you in the dust with your own technique. Within a year, a rival sect is using it.','他比你以为的厉害。他用你教的招式把你打倒在尘土里。一年内，对头门派就用上了你的武功。'),c:'bad',fx:{f:OG(-10,-1),enemy:1}}]},
  {l:T('Let him go','由他去'),out:[{t:T('“A manual is only paper,” you tell your disciples. You do not quite believe it yet.','“秘籍不过是纸。”你对弟子们说。你自己还不太信。'),c:'muted',fx:{f:OG(-4,-1),qi:2}}]},
  {l:T('Publish the manual to everyone','索性公开秘籍'),out:[{t:T('You have it printed and given away at the market. A stolen secret is worth nothing when everyone has it. The thief is furious. The jianghu is astonished.','你把秘籍刻版印出，在集市上白送。人人都有的秘密不值钱。盗书的人气疯了，江湖震动了。'),c:'gold',fx:{fame:6,align:4,money:-60,f:OG(4,-1)}}]}]});

I({id:'og_famine',age:[22,90],cd:15,tags:OGT,when:ogS,ctx:ogC(),
 text:c=>T(`A famine year. Families from the valley camp below the gate of ${OGN(c).en}. Your granary is full enough to last your own people until spring.`,`荒年。山谷里的人家拖儿带女，在${OGN(c).zh}山门下搭了棚子。你的粮仓刚够自家人吃到开春。`),
 opts:[{l:T('Open the granary','开仓放粮'),out:[{w:2,t:T('Your disciples ladle porridge until their arms give out. Nobody in the valley forgets. Three of the hungry boys come back to join you when they are grown.','弟子们舀粥舀到胳膊抬不起来。山谷里的人谁也没忘。后来有三个吃过粥的孩子长大了来拜师。'),c:'gold',fx:{money:-150,align:8,fame:4,f:OG(10,3),deed:T('Fed the starving in a famine year','荒年开仓赈济饥民')}},{w:1,t:T('The grain runs out by midwinter. Your disciples eat bark with the villagers and do not complain.','粮食到隆冬就吃光了。弟子们和村民一起啃树皮，没一个抱怨。'),c:'good',fx:{money:-150,align:8,f:OG(8,0),hurt:[3,8],cause:T('a famine winter','荒年寒冬')}}]},
  {l:T('Feed the children only','只管孩子'),out:[{t:T('A careful kindness. Some call it wise, some call it stingy. Everyone calls it better than nothing.','有分寸的善心。有人说明智，有人说小气，都说比什么都不做强。'),c:'good',fx:{money:-60,align:4,f:OG(4,0)}}]},
  {l:T('Sell grain at famine prices','高价卖粮'),out:[{t:T('You get rich. The valley names a dog after you.','你发了财。山谷里有人拿你的名字给狗起名。'),c:'bad',fx:{money:300,align:-8,f:OG(-12,-1)}}]}]});

I({id:'og_court',age:[25,90],cd:15,tags:OGT,when:s=>ogS(s)&&s.org.rep>=30,ctx:ogC({occ:31,age:50}),
 text:c=>T(`A eunuch, ${c.npc.en}, arrives in a sedan chair with an imperial scroll: the court wishes to enlist ${OGN(c).en} as a “loyal militia”, with salaries, titles — and orders.`,`太监${c.npc.zh}坐着轿子来了，捧着圣旨：朝廷要招${OGN(c).zh}为“忠义乡勇”，给俸禄，给官衔——也给差遣。`),
 opts:[{l:T('Accept the court’s silver','接旨受禄'),out:[{w:2,t:T('Your disciples wear government sashes. The silver is good. The first order is to break up a peasants’ protest.','弟子们系上了官府的腰带。银子很丰厚。头一道差遣是驱散请愿的农民。'),c:'muted',fx:{money:400,fame:3,align:-6,f:OG(-3,2)}},{w:1,t:T('A title for you, a plaque for the gate, and very few orders, as long as you bow when the prefect visits.','你得了官衔，山门得了御匾。差遣不多，只要知府来时你肯弯腰。'),c:'good',fx:{money:300,fame:5,align:-2,f:OG(4,0)}}]},
  {l:T('Decline with deep bows','磕头谢恩，婉言推辞'),out:[{w:2,t:T('“We are simple people of the mountain.” The eunuch’s smile does not move. He leaves. Nothing happens. Yet.','“山野粗人，不堪大用。”太监笑容不变，走了。什么事也没发生——暂时。'),c:'muted',fx:{f:OG(2,0)}},{w:1,t:T('The refusal is noticed. Your sect’s taxes double the next year.','这次推辞被记下了。第二年门派的赋税翻了一倍。'),c:'bad',fx:{money:-150}}]},
  {l:T('Tear up the scroll','当场撕了圣旨'),out:[{t:T('The jianghu toasts your courage. The court posts your face at every gate.','江湖上人人为你的胆气干杯。朝廷在每座城门贴上了你的画像。'),c:'bad',fx:{fame:6,align:4,wanted:2,f:OG(8,0)}}]}]});

I({id:'og_gamblers',age:[22,90],cd:8,tags:OGT,when:s=>ogS(s)&&s.org.members>=3,ctx:ogC(),
 text:()=>T('You find half your disciples’ beds stuffed with straw dummies. The real ones are at a gambling den in town.','你发现一半弟子的被窝里塞着稻草人。真人在镇上的赌坊里。'),
 opts:[{l:T('Drag them home by the ears','揪着耳朵拎回来'),out:[{w:2,t:T('A hundred laps of the mountain each. Nobody sneaks out again for a year.','每人绕山跑一百圈。此后一年没人再敢溜出去。'),c:'good',fx:{f:OG(2,0),skill:1}},{w:1,t:T('The den owner says they owe forty taels. You pay, and then the laps begin.','赌坊老板说他们欠了四十两。你付了钱，然后开始跑圈。'),c:'muted',fx:{money:-40,f:OG(1,0)}}]},
  {l:T('Sit down and play with them','坐下陪他们赌'),out:[{w:1,t:T('You win back everything they lost, and then some. They are deeply impressed and slightly frightened.','你把他们输的全赢了回来，还多赢了些。他们佩服得五体投地，又有点怕。'),c:'good',fx:{money:[20,60],happy:4,f:OG(2,0)}},{w:1,t:T('You lose more than all of them together. Discipline is never quite the same again.','你一个人输得比他们加起来还多。从此门规再也不那么硬气了。'),c:'bad',fx:{money:[-80,-30],f:OG(-4,0)}}]},
  {l:T('Close the gambling den','把赌坊端了'),fight:FG(ogLv(.8,2),'light',T('Clearing the gambling den','大闹赌坊'),T('a brawl in a gambling den','赌坊斗殴'),()=>T('the den’s bouncers','赌坊打手')),
   win:[{t:T('The den shuts. The town’s wives send your sect a pig.','赌坊关门了。镇上的媳妇们给你门里送来一头猪。'),c:'good',fx:{align:3,fame:2,f:OG(5,0)}}],lose:[{t:T('You and your disciples are thrown into the street together. A bonding experience.','你和弟子们一起被扔到了大街上。也算同甘共苦。'),c:'muted',fx:{f:OG(-3,0)}}]}]});

I({id:'og_gatechallenge',age:[22,90],cd:6,tags:OGT,when:ogS,ctx:ogC(s=>({occ:13,age:rint(20,30),lv:ogLv(.95,3)(s)})),
 text:c=>T(`A young swordsman, ${c.npc.en}, stands at your gate and shouts that ${OGN(c).en} is a nest of frauds. He wants the master.`,`年轻剑客${c.npc.zh}站在山门外大喊，说${OGN(c).zh}是一窝骗子，要掌门出来。`),
 opts:[{l:T('Go out yourself','亲自出门'),fight:FG((s,c)=>c.npc.lv,'light',T('A challenger at the gate','山门挑战'),T('a challenge at the gate','山门比武')),
   win:[{w:2,t:c=>T(`${c.npc.en} lies in the dust and asks, in a much smaller voice, whether you take disciples.`,`${c.npc.zh}躺在尘土里，小声问你还收不收徒弟。`),c:'good',fx:{fame:2,f:OG(5,1)}},{w:1,t:T('He bows and leaves without a word. Your disciples talk of nothing else for a month.','他一言不发地行礼离去。弟子们足足议论了一个月。'),c:'good',fx:{fame:3,f:OG(6,0)}}],
   lose:[{t:T('He wins and walks off laughing. Two disciples pack their bags that night.','他赢了，笑着走了。当晚就有两个弟子收拾了行李。'),c:'bad',fx:{f:OG(-8,-2)}}]},
  {l:T('Send your best disciple','派大弟子出战'),out:[{w:1,t:T('Your disciple wins! You pretend you expected it.','大弟子赢了！你装作早就料到。'),c:'good',fx:{f:OG(6,0)}},{w:1,t:T('Your disciple loses, and you must go out after all, now with less face to spare.','大弟子输了，你还得亲自出马，脸面已经少了一层。'),c:'bad',fx:{f:OG(-4,0)}}]},
  {l:T('Ignore him','不理他'),out:[{t:T('He shouts until sunset, then asks for water. You send some out. He leaves confused.','他喊到太阳落山，然后讨水喝。你派人送了一碗。他满脸困惑地走了。'),c:'muted',fx:{qi:1,f:OG(-1,0)}}]}]});

I({id:'og_spy',age:[22,90],cd:15,tags:OGT,when:s=>ogS(s)&&s.org.members>=4,ctx:ogC({age:22}),
 text:c=>T(`You catch ${c.npc.en}, a quiet disciple of two years, copying your sect’s secret formations by moonlight. A letter in his sleeve is addressed to a rival master.`,`你撞见入门两年、平时不声不响的弟子${c.npc.zh}在月下偷抄本门阵法。他袖子里有封信，是写给对头掌门的。`),
 opts:[{l:T('Turn him: feed his master false formations','将计就计，传假阵图'),out:[{w:s=>s.smarts/25,t:T('For a year the rival sect drills a formation that walks them into a pond. You have never laughed so hard.','整整一年，对头门派苦练一套会把自己人带进池塘的阵法。你从没笑得这么厉害过。'),c:'good',fx:{smarts:2,f:OG(6,0),happy:4}},{w:1,t:T('He runs the first night. The rival sect learns only that you know.','他头一晚就跑了。对方只知道了一件事：你已经察觉。'),c:'muted',fx:{f:OG(0,-1)}}]},
  {l:T('Expel him publicly','当众逐出师门'),out:[{t:T('You break his practice sword before everyone and send him down the mountain. The disciples close ranks.','你当众折断他的练功剑，赶他下山。弟子们更抱团了。'),c:'good',fx:{f:OG(3,-1)}}]},
  {l:T('Ask why','问他为什么'),out:[{t:c=>T(`His family is held by the rival master. You ride over and get them out; ${c.npc.en} becomes the most loyal disciple you will ever have.`,`他一家老小被对头扣着。你连夜去把人救了出来。从此${c.npc.zh}成了你最忠心的弟子。`),c:'gold',fx:{meet:'disciple',bond:85,align:4,f:OG(4,0)}}]}]});

I({id:'og_disciplefame',age:[25,90],cd:10,tags:OGT,when:s=>ogS(s)&&s.org.rep>=20,ctx:ogC({age:22}),
 text:c=>T(`News comes down the road: your disciple ${c.npc.en} killed a notorious bandit alone, and told everyone which sect taught him.`,`消息从路上传来：你的弟子${c.npc.zh}独自除掉了一个有名的山贼，还逢人便说师从哪门哪派。`),
 out:[{w:2,t:c=>T(`Letters arrive from parents all over the province. ${OGN(c).en} has a waiting list.`,`全省各地都有家长来信。${OGN(c).zh}开始要排队才能进了。`),c:'gold',fx:{fame:2,f:OG(8,2)}},
  {w:1,t:T('The bandit’s brothers also heard which sect taught him.','山贼的兄弟们也听说了他是哪门哪派的。'),c:'bad',fx:{f:OG(4,0),enemy:1}},
  {w:1,t:T('He comes home insufferably proud. You make him clean the latrines for a month, out of love.','他回来时得意忘形。你出于爱护，罚他扫了一个月茅房。'),fx:{f:OG(5,0),happy:2}}]});

/* ====================== your own sect: a dark house ====================== */
I({id:'og_racket',age:[20,90],cd:6,tags:OGT,when:ogE,ctx:ogC(),
 text:c=>T(`The market town below ${OGN(c).en} is late with its “protection silver” again. Your lieutenants want to make an example.`,`山下镇子又拖欠了${OGN(c).zh}的“平安银子”。手下的头目们想杀鸡儆猴。`),
 opts:[{l:T('Burn one shop as a lesson','烧一间铺子立威'),out:[{t:T('The silver arrives early for the next three years. The town’s children run when they see your colours.','此后三年，银子都提前送到。镇上的孩子看见你们的衣裳就跑。'),c:'bad',fx:{money:200,align:-6,f:OG(5,0),wanted:1}}]},
  {l:T('Double the rate','加倍收'),out:[{w:2,t:T('They pay, and hate you, and pay.','他们交了，恨你，接着交。'),c:'muted',fx:{money:150,align:-3}},{w:1,t:T('Half the town moves away in the night. Empty streets pay nothing.','半个镇子连夜搬走了。空街交不出银子。'),c:'bad',fx:{money:-50,f:OG(-4,0)}}]},
  {l:T('Let them off this year','今年免了'),out:[{t:T('Your lieutenants mutter that you are going soft. The town’s grandmothers burn incense for you, which is confusing for everyone.','头目们嘀咕你心软了。镇上的老太太却给你烧香，大家都很困惑。'),c:'muted',fx:{align:4,f:OG(-3,0)}}]}]});

I({id:'og_siege',age:[22,90],cd:15,tags:OGT,when:s=>ogE(s)&&s.org.rep>=15,ctx:ogC(),
 text:c=>T(`Four righteous sects have sworn an oath to wipe out ${OGN(c).en}. Their torches ring your mountain tonight.`,`四大正派歃血为盟，誓要剿灭${OGN(c).zh}。今夜，他们的火把围住了你的山。`),
 opts:[{l:T('Break the siege at its strongest point','从最硬处突围'),fight:FG(ogLv(1.1,8),'injury',T('Siege of the dark sect','围剿魔门'),T('a siege by the righteous sects','正派围剿'),()=>T('the allied sect masters','正派联盟的掌门们')),
   win:[{t:T('You cut through their best and they break. For years, the righteous call you a demon in a frightened whisper.','你击溃了他们的精锐，联军溃散。此后多年，正派提起你都压低了嗓子叫魔头。'),c:'gold',fx:{fame:8,align:-4,f:OG(12,-1)}}],
   lose:[{t:T('Your halls burn. You escape through the back gorge with a handful of loyal people.','你的殿宇烧起来了。你带着几个死忠从后山峡谷逃了出去。'),c:'bad',fx:{money:-200,f:s=>{ogAdj(s,-20,-Math.ceil((s.org?s.org.members:0)/2))}}}]},
  {l:T('Slip away through the secret tunnel','从密道撤走'),out:[{t:T('They storm an empty mountain and burn it. You rebuild elsewhere, smaller and angrier.','他们攻上一座空山，放了把火。你换了个地方重起炉灶，小了，也更狠了。'),c:'muted',fx:{money:-150,f:OG(-10,-2)}}]},
  {l:T('Offer them the worst of your men','交出手下最恶的几个人'),out:[{t:T('They accept the heads and leave. Your remaining followers watch you very carefully now.','他们收下人头退了兵。剩下的部下如今看你的眼神都格外小心。'),c:'muted',fx:{align:2,f:OG(-6,-2)}}]}]});

I({id:'og_gostraight',age:[22,90],cd:12,tags:OGT,when:s=>ogE(s)&&s.org.members>=2,ctx:ogC({age:26}),
 text:c=>T(`${c.npc.en}, one of your fiercest followers, kneels before you. ${c.npc.He} has met a girl in the village and wants to leave the cult and grow vegetables.`,`${c.npc.zh}是你手下最凶的一个，如今跪在你面前。${c.npc.ta}在村里认识了个姑娘，想退出本教回去种菜。`),
 opts:[{l:T('Let him go, with silver','放他走，送他盘缠'),out:[{w:2,t:T('He leaves weeping. Others notice that leaving is possible.','他哭着走了。别的人也看在眼里：原来是可以走的。'),c:'good',fx:{money:-50,align:6,f:OG(-3,-1)}},{w:1,t:T('Years later a box of vegetables arrives at your gate every autumn.','此后每年秋天，你门口都会多一筐青菜。'),c:'good',fx:{money:-50,align:6,happy:3,f:OG(-2,-1)}}]},
  {l:T('The rule is: nobody leaves','规矩就是规矩：进来就别想走'),out:[{t:T('He does not leave. Nobody ever asks again. Something in your house goes quiet and cold.','他没能离开。再也没人提过这事。你门里有样东西从此冷了、静了。'),c:'bad',fx:{align:-8,f:OG(2,-1),happy:-3}}]},
  {l:T('Make him fight his way out','让他打出去'),fight:FG(ogLv(.85,0),'light',T('A follower who wants out','叛教的门人'),T('a deserter’s last stand','叛教者拼命')),
   win:[{t:T('You beat him, then open the gate anyway. “Now you have nothing to prove.”','你打赢了，却还是打开了门。“现在你什么都不欠了。”'),c:'good',fx:{align:4,f:OG(2,-1)}}],
   lose:[{t:T('He beats you and walks out. Your followers saw.','他打赢你走了出去。部下们都看见了。'),c:'bad',fx:{f:OG(-8,-1)}}]}]});

I({id:'og_hostage',age:[22,90],cd:10,tags:OGT,when:ogE,ctx:ogC({occ:12,age:18,sex:'f'}),
 text:c=>T(`Your men have brought home ${c.npc.en}, daughter of a rich salt merchant. Her father offers 500 taels. She offers you a lecture on manners.`,`手下绑回了盐商的千金${c.npc.zh}。她爹愿出五百两赎金。她本人则给你上了一堂礼数课。`),
 opts:[{l:T('Take the ransom','收赎金'),out:[{w:2,t:T('The silver arrives on a mule. So, a month later, does a constable with a warrant.','银子用骡子驮来了。一个月后，捕快也拿着海捕文书来了。'),c:'gold',fx:{money:500,align:-6,wanted:1}},{w:1,t:T('Her father sends 500 taels of lead painted silver. Your men are too embarrassed to mention it.','她爹送来的是五百两涂了银粉的铅。手下们羞得不敢提。'),c:'muted',fx:{f:OG(-4,0),happy:-2}}]},
  {l:T('Send her home free','放她回家'),out:[{t:T('Your men call you mad. Her father, astonished, quietly pays your taxes for a year.','手下都说你疯了。她爹又惊又喜，悄悄替你交了一年的税。'),c:'good',fx:{align:6,money:100,f:OG(-3,0)}}]},
  {l:T('Keep her and make her the cult’s accountant','把她留下当账房'),if:s=>s.smarts>=40,out:[{t:c=>T(`${c.npc.en} finds that your lieutenants have been stealing a third of everything. She stays, by choice, to make them pay it back.`,`${c.npc.zh}查出头目们贪了三成。她自愿留了下来，要他们一文一文吐出来。`),c:'gold',fx:{money:250,meet:'acq',bond:55,f:OG(3,0)}}]}]});

I({id:'og_bounty',age:[22,90],cd:10,tags:OGT,when:ogE,ctx:ogC(s=>({occ:9,age:35,lv:ogLv(1.0,6)(s)})),
 text:c=>T(`The court has put 3,000 taels on the head of the master of ${OGN(c).en}. The first to try for it is ${c.npc.en}, a constable who does not take bribes.`,`朝廷悬赏三千两，取${OGN(c).zh}教主的人头。第一个来的是捕头${c.npc.zh}，一个不收银子的人。`),
 opts:[{l:T('Meet him blade to blade','以刀相迎'),fight:FG((s,c)=>c.npc.lv,'injury',T('The court’s bounty','朝廷悬赏'),T('a bounty hunter','赏金捕头')),
   win:[{t:T('You beat him and leave him alive, which frightens the next ten more than killing him would.','你打败了他，留了他一命。这比杀了他更让后来者胆寒。'),c:'good',fx:{fame:4,f:OG(5,0)}},{w:1,t:T('He does not survive. The bounty doubles.','他没能活下来。赏金翻了一倍。'),c:'bad',fx:{fame:3,align:-5,wanted:1}}],
   lose:[{t:T('You escape with a wound and a lesson. Your followers whisper.','你带伤逃脱，长了教训。部下们在背后议论。'),c:'bad',fx:{f:OG(-8,-1)}}]},
  {l:T('Buy off his superiors','买通他的上司'),cost:300,out:[{t:T('The constable is transferred to a remote county. He sends you a letter: “Later.”','那捕头被调去了偏远县份。他给你捎了封信：“后会有期。”'),c:'muted',fx:{wanted:-1,enemy:1}}]}]});

I({id:'og_coup',age:[25,90],cd:15,tags:OGT,when:s=>ogE(s)&&s.org.members>=4,ctx:ogC(s=>({age:40,occ:13,lv:ogLv(.95,4)(s)})),
 text:c=>T(`Your right-hand man, ${c.npc.en}, has been meeting the other lieutenants at night. Your cook tells you the soup will be poisoned on the fifteenth.`,`你的左膀右臂${c.npc.zh}最近夜夜和几个头目密会。厨子告诉你，十五那天的汤里会有毒。`),
 opts:[{l:T('Strike first','先下手为强'),fight:FG((s,c)=>c.npc.lv,'injury',T('A coup in the dark sect','教中叛乱'),T('a lieutenant’s coup','手下篡位')),
   win:[{t:T('By morning there is one less chair at your table and much more loyalty.','天亮时你的桌边少了一把椅子，多了一屋子的忠心。'),c:'good',fx:{f:OG(6,-2),align:-3}}],
   lose:[{t:T('You barely escape your own hall. You return a month later with the cook and a grudge, and take it back — but not everyone comes back with you.','你险些死在自家大殿里。一个月后你带着厨子和满腔恨意杀回来，夺回了位子——但不是所有人都回来了。'),c:'bad',fx:{f:OG(-10,-3)}}]},
  {l:T('Drink the soup and smile','把汤喝了，笑一笑'),if:s=>s.qi>=40,out:[{t:T('You force the poison out through your fingertips at the table. Nobody touches their bowl. The plot ends without a word.','你当众运功，把毒从指尖逼了出来。满桌没人敢碰碗。一场谋反，就此无声无息。'),c:'gold',fx:{fame:3,f:OG(8,0),hurt:[3,10],cause:T('poisoned soup','毒汤')}}]},
  {l:T('Bribe the other lieutenants','收买其他头目'),cost:250,out:[{t:c=>T(`On the fifteenth ${c.npc.en} raises his cup alone. Nobody follows. He leaves the mountain that night.`,`十五那天${c.npc.zh}独自举起了杯，没人响应。当夜他就下了山。`),c:'good',fx:{f:OG(3,-1),enemy:1}}]}]});

I({id:'og_jailbreak',age:[22,90],cd:12,tags:OGT,when:ogE,ctx:ogC(),
 text:()=>T('The prefecture jail holds a dozen hard men awaiting execution. A jailbreak would give you a dozen grateful recruits.','府衙大牢里关着十几个等着问斩的亡命徒。劫个牢，就能多十几个感恩戴德的手下。'),
 opts:[{l:T('Break them out','劫牢'),fight:FG(ogLv(.9,4),'injury',T('Jailbreak','劫狱'),T('a jailbreak','劫狱'),()=>T('the prison guards','狱卒')),
   win:[{t:T('Doors open, guards tied, a dozen killers kneel to you in the snow.','牢门大开，狱卒绑了一地。十几个亡命徒在雪地里向你下跪。'),c:'gold',fx:{wanted:2,align:-6,fame:3,f:OG(4,5)}}],
   lose:[{t:T('The alarm bell rings too early. You escape. Two of your own do not.','警钟响得太早。你跑了，自家两个兄弟没跑掉。'),c:'bad',fx:{wanted:1,f:OG(-6,-2)}}]},
  {l:T('Bribe the jailer to lose the keys','买通狱卒“丢”了钥匙'),cost:200,out:[{w:2,t:T('Six of them walk out on a dark night. The jailer buys a farm.','六个人在一个黑夜里走了出来。狱卒买了块地。'),c:'good',fx:{align:-4,f:OG(2,4)}},{w:1,t:T('The jailer takes the silver and reports you.','狱卒收了银子，转身就告了官。'),c:'bad',fx:{wanted:1}}]},
  {l:T('Leave them to their fate','随他们去'),out:[{t:T('Fewer recruits, fewer problems.','少几个手下，也少几桩麻烦。'),c:'muted'}]}]});

I({id:'og_poisonwell',age:[22,90],cd:12,tags:OGT,when:ogE,ctx:ogC(),
 text:()=>T('A rival gang holds the river crossing. Your poison master suggests their well. “Nobody will know it was us.”','一个对头帮派占着渡口。你手下的毒师提议往他们井里下药。“没人知道是咱们干的。”'),
 opts:[{l:T('Do it','干'),out:[{w:2,t:T('The rival gang sickens and scatters. So does half a village downstream, which also drank from that well.','对头帮派病倒的病倒，散的散。下游半个村子也喝那口井的水。'),c:'bad',fx:{align:-10,money:150,f:OG(6,0)}},{w:1,t:T('Everybody knows it was you.','谁都知道是你们干的。'),c:'bad',fx:{align:-8,wanted:1,f:OG(3,0)}}]},
  {l:T('Take the crossing by fighting','明刀明枪抢渡口'),fight:FG(ogLv(.95,3),'injury',T('The river crossing','争夺渡口'),T('a gang war at a ferry','渡口帮战'),()=>T('the rival gang chief','对头帮主')),
   win:[{t:T('The crossing is yours. The ferrymen pay you now, and at least nobody’s well was touched.','渡口归你了。船家们改交你的钱，至少没人的井遭殃。'),c:'good',fx:{money:120,f:OG(6,0)}}],lose:[{t:T('You are driven back into the reeds.','你被赶回了芦苇荡。'),c:'bad',fx:{f:OG(-5,-1)}}]},
  {l:T('Forbid poison in your house','门中禁毒'),out:[{t:T('The poison master leaves in disgust. Your followers think you have strange rules for a demon.','毒师一气之下走了。部下们觉得你这魔头的规矩真怪。'),c:'muted',fx:{align:5,f:OG(-2,-1)}}]}]});

/* ====================== your escort agency ====================== */
I({id:'og_redgoods',age:[20,90],cd:8,tags:OGT,when:ogX,ctx:ogC({occ:11,age:40}),
 text:c=>T(`${c.npc.en}, a steward of a prince, lays a sealed lacquer box on your counter. “Red goods. Jade for the emperor’s birthday. Two thousand li. If it arrives, your banner will be famous. If not…” He does not finish.`,`王府管家${c.npc.zh}把一只封好的漆盒放在柜上。“红货。给皇上贺寿的玉器，两千里路。送到了，你的镖旗天下扬名；送不到……”他没往下说。`),
 opts:[{l:T('Take it, and ride yourself','接了，亲自押镖'),fight:FG(ogLv(1.05,8),'injury',T('Red goods on the road','红货镖'),T('robbers after red goods','劫红货的强盗'),()=>T('the robbers of Seven Star Ridge','七星岭的劫匪')),
   win:[{t:c=>T(`Seven Star Ridge, a night ambush, your saber, and dawn. The jade arrives without a scratch. Every merchant in the province wants the banner of ${OGN(c).en} on their carts.`,`七星岭夜伏，你的刀，然后天亮了。玉器毫发无损。全省的商家都想让${OGN(c).zh}的镖旗插在自家车上。`),c:'gold',fx:{money:800,fame:6,f:OG(15,2),deed:T('Delivered red goods for the emperor’s birthday','押送贺寿红货，一路无失')}}],
   lose:[{t:T('The box is gone. You sell half your horses to pay the prince, and he is still not happy.','漆盒丢了。你卖了一半马匹赔给王府，王爷还是不满意。'),c:'bad',fx:{money:-600,f:OG(-18,-2),hurt:[5,15],cause:T('robbers on a red-goods run','劫红货的强盗')}}]},
  {l:T('Take it, with every escort you have','接了，倾巢出动'),out:[{w:3,t:T('Forty spears around one box. No robber is mad enough. The silver is splendid.','四十杆长枪围着一只盒子，没哪个劫匪疯到敢动手。镖银丰厚。'),c:'gold',fx:{money:600,f:OG(10,0)}},{w:1,t:T('While your whole agency is on the road, someone robs the agency.','你全局出动的时候，有人把你的镖局给偷了。'),c:'bad',fx:{money:200,f:OG(2,0)}}]},
  {l:T('Decline. Some cargo is too heavy.','推了。有的镖太重。'),out:[{t:T('A rival agency takes it. You hear later they lost it, and their master hanged himself. You pour a cup of wine on the ground.','对家镖局接了。后来听说丢了，他们的总镖头上了吊。你往地上洒了一杯酒。'),c:'muted',fx:{f:OG(-2,0)}}]}]});

I({id:'og_liecargo',age:[20,90],cd:10,tags:OGT,when:ogX,ctx:ogC({occ:5,age:45}),
 text:c=>T(`Halfway to the capital, one of the “tea crates” for ${c.npc.en} sneezes.`,`进京走到一半，替${c.npc.zh}押运的一只“茶叶箱”打了个喷嚏。`),
 opts:[{l:T('Open the crate','开箱'),out:[{w:2,t:T('Inside: a terrified girl sold to a brothel in the capital. Your escorts look at you.','里面是个吓坏了的姑娘，被卖去京城的青楼。镖师们都看着你。'),c:'bad',next:'og_liecargo2',keep:1},{w:1,t:T('Inside: a very surprised smuggled monkey. You charge the client for its feed.','里面是只走私的猴子，比你还惊讶。你让雇主另付了猴粮钱。'),c:'good',fx:{money:40,happy:4}}]},
  {l:T('“A sealed crate is sealed.” Deliver it.','“镖不开封。”照送'),out:[{t:T('You deliver, collect, and do not ask. For years you sometimes hear a sneeze in your sleep.','你送到、收钱、不问。此后多年，你睡梦里有时会听见一声喷嚏。'),c:'muted',fx:{money:150,align:-5,happy:-3}}]}]});
I({id:'og_liecargo2',age:[20,90],only:1,tags:[],when:ogX,text:c=>T(`The client, ${c.npc.en}, rides up with his men. “That crate is paid for.”`,`雇主${c.npc.zh}带着人追了上来。“那箱子是付了钱的。”`),
 opts:[{l:T('Free her and refund him','放了姑娘，退他镖银'),out:[{t:T('You throw his silver in the road. He swears revenge. The girl goes home to her mother in Suzhou.','你把镖银扔在路上。他发誓报复。姑娘回了苏州她娘身边。'),c:'good',fx:{align:8,money:-150,enemy:1,f:OG(4,0),fame:1}}]},
  {l:T('Fight his men','跟他的人动手'),fight:FG(ogLv(.85,2),'injury',T('The crate that sneezed','打喷嚏的镖箱'),T('a slave-trader’s guards','人贩子的打手')),win:[{t:T('You tie him to his own crate and deliver him to the magistrate instead.','你把他绑进了他自己的箱子，转送去了衙门。'),c:'gold',fx:{align:8,fame:3,f:OG(8,0)}}],lose:[{t:T('They beat you and take the girl. You never find her.','他们打倒了你，抢走了姑娘。你再也没找到她。'),c:'bad',fx:{happy:-8,f:OG(-6,0)}}]},
  {l:T('Deliver her after all','还是照送'),out:[{t:T('You take the silver. Two of your escorts quit on the spot.','你收了镖银。当场有两个镖师辞了工。'),c:'bad',fx:{money:150,align:-12,f:OG(-6,-2)}}]}]});

I({id:'og_baishan',age:[20,90],cd:8,tags:OGT,when:ogX,ctx:ogC(s=>({occ:13,age:45,lv:ogLv(1.0,4)(s)})),
 text:c=>T(`At Tiger’s Mouth Pass a man sits on a rock with a great curved saber across his knees: ${c.npc.en}, chief of the pass. He has not drawn. By the old rules, he is waiting for you to pay your respects (拜山).`,`虎口关前，一人坐在石头上，膝上横着一柄大弯刀——是关上的寨主${c.npc.zh}。他没拔刀。按老规矩，他在等你拜山。`),
 opts:[{l:T('Dismount, bow, and recite the old words','下马抱拳，念老规矩的切口'),out:[{w:3,t:T('“Friends of the green forest, the road is long, may our banners pass.” He grins, passes you a gourd of wine, and lets you through for a token fee.','“绿林朋友，路远山高，借道一过。”他咧嘴一笑，递过酒葫芦，象征性收了点过路钱就放行了。'),c:'good',fx:{money:-30,f:OG(3,0)}},{w:1,t:T('You get one word of the old greeting wrong. He laughs until he cries, then lets you through for free.','你念错了一个字。他笑出了眼泪，分文不取放你过去了。'),c:'good',fx:{happy:3}}]},
  {l:T('Challenge him under the code: one bout, no killing','按规矩单挑一场，点到为止'),fight:FG((s,c)=>c.npc.lv,'light',T('A bout under the green-forest code','绿林规矩的比斗'),T('a bandit chief’s saber','寨主的弯刀')),
   win:[{t:c=>T(`${c.npc.en} sheathes his saber and laughs. “Your banner passes free on my mountain, as long as I live.”`,`${c.npc.zh}收刀大笑。“只要我活着，你的镖旗在我山上一路通行。”`),c:'gold',fx:{fame:2,f:s=>{ogAdj(s,6,0);if(s.org)s.org.safe=Math.max(s.org.safe||0,s.age+3)},meet:'acq',bond:60}}],
   lose:[{t:T('He takes a tenth of the cargo, as the code allows, and gives you a drink for your bruises.','他按规矩抽了一成镖货，又请你喝了一碗酒压惊。'),c:'muted',fx:{money:-80}}]},
  {l:T('Ride straight through','硬闯'),fight:FG(ogLv(1.1,6),'injury',T('Forcing Tiger’s Mouth Pass','硬闯虎口关'),T('bandits at a mountain pass','关口山贼'),()=>T('the whole stronghold','整座山寨')),
   win:[{t:T('You force the pass. Every stronghold on the road now hates your banner.','你硬闯过了关。如今沿路的山寨个个恨你的镖旗。'),c:'muted',fx:{fame:2,f:OG(0,0),enemy:1}}],
   lose:[{t:T('You lose the cargo and two horses. The chief sends a note: “Manners cost less.”','镖货丢了，还赔了两匹马。寨主捎来一句话：“讲礼数便宜多了。”'),c:'bad',fx:{money:-200,f:OG(-10,-1)}}]}]});

I({id:'og_escortthief',age:[20,90],cd:12,tags:OGT,when:s=>ogX(s)&&s.org.members>=2,ctx:ogC(s=>({occ:8,age:30,lv:ogLv(.85,0)(s)})),
 text:c=>T(`${c.npc.en}, an escort of five years, has disappeared with three hundred taels of the client’s silver. His wife comes to you crying; she did not know.`,`干了五年的镖师${c.npc.zh}卷了雇主三百两镖银跑了。他媳妇哭着来找你，说她什么也不知道。`),
 opts:[{l:T('Hunt him down','追捕'),fight:FG((s,c)=>c.npc.lv,'injury',T('The escort who stole','监守自盗的镖师'),T('a thieving escort','监守自盗的镖师')),
   win:[{t:T('You find him in a gambling den, half the silver gone. You bring him and the rest home.','你在赌坊里找到他，银子已经输掉一半。人和剩下的银子都带了回来。'),c:'good',fx:{money:-150,f:OG(4,-1)}},{w:1,t:T('He has debts to men who threatened his children. You pay them yourself, and he works for nothing for three years.','他欠了人家的债，对方拿他的孩子要挟。你替他还了，他白干三年。'),c:'good',fx:{money:-200,align:5,f:OG(5,0)}}],
   lose:[{t:T('He escapes over the border. You repay the client from your own chest.','他逃出了省界。你自掏腰包赔了雇主。'),c:'bad',fx:{money:-300,f:OG(-8,-1)}}]},
  {l:T('Repay the client and post his name','先赔雇主，再贴他的名字'),out:[{t:T('Every agency in the land will refuse him now. Your clients note that you pay your debts.','如今天下镖局没一家会再用他。雇主们都记住了你说话算数。'),c:'good',fx:{money:-300,f:OG(6,-1)}}]},
  {l:T('Look after his wife and children','照顾他的妻儿'),out:[{t:T('You pay the client and put his wife to work in the kitchen. Five years later, he comes back and kneels at your gate.','你赔了雇主，让他媳妇在伙房干活。五年后，他回来跪在你门前。'),c:'gold',fx:{money:-320,align:6,f:OG(4,0)}}]}]});

I({id:'og_framed',age:[20,90],cd:15,tags:OGT,when:ogX,ctx:ogC(s=>({occ:5,age:50,lv:ogLv(.9,0)(s)})),
 text:c=>T(`A shipment of silver you never carried is “lost” — and the seals on the empty boxes are forgeries of yours. ${c.npc.en} demands two thousand taels, and the magistrate is his cousin.`,`一批你从没接过的镖银“丢了”——空箱上的封条是仿你镖局的假封。${c.npc.zh}要你赔两千两，县太爷是他表兄。`),
 opts:[{l:T('Investigate','追查'),out:[{w:s=>s.smarts/25,t:T('The forger’s ink has a smell of Persian cinnabar. You trace it to a rival agency and to the merchant himself, who robbed his own boxes. The magistrate cousin is suddenly very busy elsewhere.','假封的印泥有股波斯朱砂味。你一路查到对家镖局，又查到那商人自己——是他监守自盗。县太爷表兄忽然公务繁忙。'),c:'gold',fx:{smarts:2,fame:4,f:OG(10,0)}},{w:1,t:T('The trail goes cold. You pay half, and the story follows your banner for years.','线索断了。你赔了一半，这事跟了你的镖旗好些年。'),c:'bad',fx:{money:-500,f:OG(-12,0)}}]},
  {l:T('Pay, to save your name','赔钱保名声'),out:[{t:T('You pay. People whisper that only the guilty pay so fast.','你赔了。人们嘀咕：只有心虚的才赔得这么快。'),c:'bad',fx:{money:-800,f:OG(-6,0)}}]},
  {l:T('Pay the merchant a midnight visit','半夜去拜访那商人'),fight:FG((s,c)=>c.npc.lv,'injury',T('The framing merchant','栽赃的商人'),T('a merchant’s bodyguards','商人的护院'),()=>T('the merchant’s bodyguards','商人的护院')),
   win:[{t:T('By dawn he has signed a confession, and his guards are tied in the well-house.','天亮时他已在供状上画了押，护院都绑在井房里。'),c:'good',fx:{f:OG(6,0),align:-1}}],lose:[{t:T('Now you are accused of fraud and housebreaking.','这下你又多了个私闯民宅的罪名。'),c:'bad',fx:{money:-400,wanted:1,f:OG(-10,0)}}]}]});

I({id:'og_undercut',age:[20,90],cd:10,tags:OGT,when:ogX,ctx:ogC(s=>({occ:8,age:40,lv:ogLv(1.0,3)(s)})),
 text:c=>T(`A new agency across the street, run by ${c.npc.en}, is carrying goods at half your price. Your clients are drifting over.`,`对街新开了一家镖局，总镖头是${c.npc.zh}，镖价只要你的一半。你的老主顾一个个往那边走。`),
 opts:[{l:T('Cut prices too','跟着降价'),out:[{w:1,t:T('A price war. Both agencies bleed silver for a year. Then his collapses.','一场价格战。两家镖局都流了一年的血，然后他那家撑不住了。'),c:'muted',fx:{money:-200,f:OG(4,1)}},{w:1,t:T('Yours collapses first. Not entirely, but you lose good men.','你这边先撑不住了。没倒，但走了几个好手。'),c:'bad',fx:{money:-200,f:OG(-6,-2)}}]},
  {l:T('Challenge him to a contest before the merchants','当着商户们比武'),fight:FG((s,c)=>c.npc.lv,'light',T('Rival agency masters','两家总镖头比武'),T('a rival escort master','对家总镖头')),
   win:[{t:T('The merchants have seen who will defend their silver. They come back, and pay full price.','商户们看清了谁能护住他们的银子，都回来了，而且照原价付钱。'),c:'gold',fx:{fame:3,f:OG(8,0)}}],lose:[{t:T('The merchants have seen. Half of them stay over there.','商户们都看见了。一半人留在了对面。'),c:'bad',fx:{f:OG(-8,0)}}]},
  {l:T('Find out how he does it','打听他凭什么这么便宜'),out:[{t:T('He does not pay the mountain strongholds; he pays a constable to look away. You tip off the strongholds, and his carts stop arriving.','他不拜山，只买通了一个捕头装瞎。你给山寨递了个话，他的镖车再没送到过。'),c:'muted',fx:{align:-3,f:OG(6,0),enemy:1}}]},
  {l:T('Propose a partnership','提议合伙'),out:[{t:c=>T(`${c.npc.en} was losing money on every run. Together you split the routes and both get rich.`,`${c.npc.zh}其实每一趟都在亏。你们分了线路，一起发了财。`),c:'good',fx:{money:150,meet:'friend',bond:60,f:OG(3,1)}}]}]});

I({id:'og_princess',age:[20,90],once:1,tags:OGT,when:ogX,ctx:ogC({sex:'f',age:19,occ:12}),
 text:c=>T(`A young “merchant’s son” with very soft hands hires your agency to escort him — or her, obviously — to the northern frontier. Calls herself ${c.npc.en}. Pays in palace gold.`,`一位手比豆腐还嫩的“商家少爷”雇你的镖局护送他——明摆着是她——去北方边关。自称${c.npc.zh}，付的是宫里的金子。`),
 opts:[{l:T('Escort her and ask no questions','接镖，什么也不问'),fight:FG(ogLv(1.0,6),'injury',T('Pursuers from the palace','宫中追兵'),T('palace guards in pursuit','宫中追兵'),()=>T('palace guards in plain clothes','便装的大内侍卫')),
   win:[{t:c=>T(`At the frontier she reveals herself: a princess fleeing a marriage to a man three times her age. She gives you her jade pendant. “If you ever need the palace, show this.”`,`到了边关，她才亮明身份：逃婚的公主，不愿嫁给比她大三倍的人。她把玉佩交给你。“若有一日用得着宫里，拿这个来。”`),c:'gold',fx:{money:500,fame:3,f:OG(8,0),flag:'og_princesstoken',meet:'friend',bond:70}}],
   lose:[{t:T('The guards take her back. You are beaten, fined and lucky to be alive.','侍卫把她带了回去。你挨了打、罚了银子，能活着已是万幸。'),c:'bad',fx:{money:-300,f:OG(-8,0)}}]},
  {l:T('Tell her you know, and help her plan','点破她身份，帮她谋划'),if:s=>s.smarts>=45,out:[{t:T('Disguised as a funeral procession, nobody stops you. She laughs all the way to the Great Wall.','扮成出殡的队伍，一路没人拦。她一路笑到了长城脚下。'),c:'gold',fx:{money:400,smarts:1,happy:4,f:OG(6,0)}}]},
  {l:T('Refuse: royal trouble is the worst trouble','推了：皇家的麻烦最麻烦'),out:[{t:T('She hires another agency. You hear nothing more. Some nights you wonder.','她雇了别家。此后再无音讯。有些晚上你会想起她。'),c:'muted'}]}]});

I({id:'og_commandeer',age:[20,90],cd:12,tags:OGT,when:ogX,ctx:ogC({occ:28,age:40}),
 text:()=>T('A frontier army officer marches into your yard with a requisition order: every cart, mule and escort, to haul grain to the front. Pay “after the war”.','一个边军军官带兵进了你的院子，拿着征调令：所有车、骡子、镖师都要拉去给前线运粮。钱“等打完仗再给”。'),
 opts:[{l:T('Comply, and go with them','遵命，亲自随军'),out:[{w:2,t:T('A hard winter on the frontier. The army pays a third of what it promised and gives your agency a banner of commendation.','边关苦了一冬。军中只付了三成，另送了你镖局一面嘉奖旗。'),c:'good',fx:{money:-100,fame:4,align:3,f:OG(5,0)}},{w:1,t:T('A cart overturns in a river crossing. You lose two escorts and all the mules.','一辆车在渡河时翻了。你折了两个镖师和全部骡子。'),c:'bad',fx:{money:-250,f:OG(-4,-2)}}]},
  {l:T('Bribe him to take someone else’s carts','塞钱让他去征别家'),cost:150,out:[{t:T('He takes your rival’s carts instead. Your rival is never told why.','他转头征了你对家的车。对家始终不知道为什么。'),c:'muted',fx:{align:-3}}]},
  {l:T('Hide the carts in the hills','把车藏进山里'),out:[{w:1,t:T('He finds an empty yard and a very polite agency master. He goes away swearing.','他只看见一座空院子，和一个特别客气的总镖头。他骂骂咧咧地走了。'),c:'good',fx:{happy:3}},{w:1,t:T('A neighbour reports you. Fined, and the carts taken anyway.','邻居告了密。罚了银子，车还是被拉走了。'),c:'bad',fx:{money:-200,f:OG(-4,0)}}]}]});

I({id:'og_retire',age:[25,90],cd:12,tags:OGT,when:s=>ogX(s)&&s.org.members>=2,ctx:ogC({occ:8,age:62,sex:'m'}),
 text:c=>T(`Old ${c.npc.en} has walked the roads for forty years, twenty of them under your banner. His knees are done. He asks to hang up his saber.`,`老镖师${c.npc.zh}走了四十年镖路，二十年在你旗下。膝盖不行了，他请求挂刀。`),
 opts:[{l:T('A banquet and a fat purse','设宴送行，厚赠盘缠'),out:[{t:T('Every escort gets drunk and cries. Young men watch and decide this is a house that keeps faith.','镖师们个个喝醉了哭。年轻人看在眼里：这家镖局讲情义。'),c:'good',fx:{money:-120,f:OG(6,0),happy:3}}]},
  {l:T('Keep him on to teach the young ones','留他教新人'),out:[{w:2,t:T('He teaches them the bandit cant, the roads, which inns poison you. Your losses drop for years.','他教新人江湖黑话、道路地形、哪家客栈下蒙汗药。此后好几年你的损失都少了。'),c:'good',fx:{f:s=>{ogAdj(s,4,0);if(s.org)s.org.safe=Math.max(s.org.safe||0,s.age+2)}}},{w:1,t:T('He teaches them to drink. Also useful, in its way.','他教会了他们喝酒。某种意义上也有用。'),c:'muted',fx:{happy:2}}]},
  {l:T('Let him go with his wages','照工钱结清，让他走'),out:[{t:T('He goes. The others notice how little you said.','他走了。别人都注意到你话说得有多少。'),c:'muted',fx:{f:OG(-3,-1)}}]}]});

I({id:'og_widows',age:[22,90],cd:15,tags:OGT,when:ogX,ctx:ogC(),
 text:()=>T('Three widows of escorts killed on your runs come to the agency together. They are not crying. They want to know what you will do.','三个在走镖中殉职的镖师遗孀一起来到镖局。她们没哭，只问你打算怎么办。'),
 opts:[{l:T('A pension for life','养她们一辈子'),out:[{t:T('It costs every year. Your escorts fight harder knowing their families will not starve.','每年都是一笔开销。镖师们知道家小不会挨饿，拼起命来更狠了。'),c:'good',fx:{money:-200,align:5,f:OG(8,0)}}]},
  {l:T('Give them work at the agency','让她们在镖局做事'),out:[{w:2,t:T('One takes over the kitchen, one the accounts, one the stables. The agency has never been better run.','一个管伙房，一个管账，一个管马厩。镖局从没这么井井有条过。'),c:'gold',fx:{f:OG(6,1),money:50}},{w:1,t:T('One of them turns out to be a better fighter than her husband was. She rides the next run.','其中一个比她丈夫还能打。下一趟镖她就上了路。'),c:'gold',fx:{f:OG(5,1)}}]},
  {l:T('A one-time payment, and goodbye','一次结清，好聚好散'),out:[{t:T('Fair by the contract. The whole street knows it was only fair by the contract.','按契约是公道的。整条街都知道，也只是按契约公道。'),c:'muted',fx:{money:-60,f:OG(-4,0)}}]}]});

I({id:'og_champions',age:[20,90],cd:8,tags:OGT,when:ogX,ctx:ogC(s=>({occ:8,age:35,lv:ogLv(1.0,4)(s)})),
 text:c=>T(`The escort agencies of the province hold their contest of champions. The winning agency carries the governor’s tax silver for three years. ${c.npc.en} of the Iron Lion Agency is the favourite.`,`全省镖局举行镖头比武，胜者三年内承运巡抚的税银。铁狮镖局的${c.npc.zh}最被看好。`),
 opts:[{l:T('Fight as your agency’s champion','亲自出战'),fight:FG((s,c)=>c.npc.lv,'light',T('Contest of agency champions','镖局擂台'),T('an escort contest','镖局比武')),
   win:[{t:c=>T(`You win the final. Three years of the governor’s silver ride under ${OGN(c).en}.`,`你赢了决赛。此后三年，巡抚的税银都插${OGN(c).zh}的旗。`),c:'gold',fx:{fame:4,money:300,f:OG(12,2)}}],
   lose:[{t:T('Second place. The governor’s silver goes to the Iron Lions, and you go to the bath house to soak your ribs.','屈居第二。税银归了铁狮，你去澡堂泡肋骨。'),c:'muted',fx:{fame:1,f:OG(-2,0)}}]},
  {l:T('Send your best young escort','派最好的年轻镖师'),out:[{w:1,t:T('He wins! The youngest champion in twenty years. Recruits arrive within the month.','他赢了！二十年来最年轻的擂主。不到一个月新人就上门了。'),c:'gold',fx:{f:OG(8,2),fame:2}},{w:2,t:T('He loses in the second round, nobly. You buy him dinner.','他第二轮输了，输得不丢人。你请他吃了顿饭。'),c:'muted',fx:{money:-10}}]}]});

I({id:'og_coffin',age:[20,90],cd:12,tags:OGT,when:ogX,ctx:ogC({occ:27,age:40,sex:'f'}),
 text:c=>T(`${c.npc.en}, a widow in white, hires you to carry her husband’s coffin home to Shu. On the third night, the coffin knocks.`,`一身缟素的寡妇${c.npc.zh}雇你把丈夫的棺材送回蜀中老家。第三天夜里，棺材里响了一声。`),
 opts:[{l:T('Open it','开棺'),out:[{w:2,t:T('The “corpse” is a very much alive man wanted for treason, and the widow is his wife. They beg you. You think of your own family.','“死人”是个活人，朝廷钦犯，寡妇正是他妻子。两人苦苦哀求。你想起了自己的家人。'),c:'muted',next:'og_coffin2',keep:1},{w:1,t:T('It is a cat. How it got in nobody can explain. The widow is very upset.','是只猫。怎么进去的，谁也说不清。寡妇很不高兴。'),c:'muted',fx:{happy:3}}]},
  {l:T('Nail it shut and keep going','钉死，接着走'),out:[{t:T('The knocking stops on the fifth day. You deliver. You will never know.','第五天，敲声停了。你送到了。你永远不会知道。'),c:'muted',fx:{money:120,happy:-4}}]}]});
I({id:'og_coffin2',age:[20,90],only:1,when:ogX,text:()=>T('Soldiers are searching every cart at the next checkpoint.','下一个关卡，官兵正在挨车搜查。'),
 opts:[{l:T('Get them through','护他们过关'),out:[{w:s=>1+s.smarts/40,t:T('Your escorts start a loud quarrel at the gate. In the confusion, the coffin rolls through. The couple vanish into Shu with a bow.','镖师们在关口吵成一团，乱中棺材滚了过去。夫妻俩深深一揖，消失在蜀道里。'),c:'gold',fx:{align:6,money:150,f:OG(3,0)}},{w:1,t:T('Caught. The man is taken. You are fined and your banner is shamed.','被查出来了。人被抓走，你被罚了银子，镖旗也蒙了羞。'),c:'bad',fx:{money:-200,f:OG(-10,0),wanted:1}}]},
  {l:T('Turn them in','交给官兵'),out:[{t:T('A reward, a commendation, and a widow’s curse that you hear in your dreams.','有赏银，有嘉奖，还有一句寡妇的诅咒，常在你梦里响。'),c:'bad',fx:{money:200,align:-6,happy:-5}}]}]});

I({id:'og_banner',age:[20,90],cd:10,tags:OGT,when:ogX,ctx:ogC(s=>({occ:13,age:22,lv:ogLv(.9,0)(s)})),
 text:c=>T(`Someone has stolen the banner from over your gate — the banner of ${OGN(c).en}. It is found hanging from a brothel window, with a note: “Come and get it.” Signed ${c.npc.en}.`,`有人偷走了你门楼上的镖旗——${OGN(c).zh}的旗。后来在一家青楼窗口挂着，附张字条：“有种来拿。”落款${c.npc.zh}。`),
 opts:[{l:T('Go and get it','去拿'),fight:FG((s,c)=>c.npc.lv,'light',T('The stolen banner','夺旗'),T('a young braggart','狂妄少年')),
   win:[{t:c=>T(`${c.npc.en} turns out to be a rival master’s son on a dare. You bring the banner and the boy home, and his father pays to have him back.`,`${c.npc.zh}原来是对家总镖头的儿子，跟人打赌来的。你把旗和人一起拎回来，他爹掏钱赎了儿子。`),c:'good',fx:{money:100,fame:2,f:OG(6,0)}}],
   lose:[{t:T('You lose, in the street, under your own banner. The whole town is laughing.','你在大街上、在自家旗子底下输了。全城都在笑。'),c:'bad',fx:{f:OG(-10,0)}}]},
  {l:T('Have a new one made, twice as big','做一面新的，大一倍'),out:[{t:T('The new banner is enormous. People come just to look. The thief is very disappointed.','新旗大得出奇，有人专门跑来看。偷旗的人大失所望。'),c:'good',fx:{money:-40,f:OG(2,0),happy:2}}]}]});

I({id:'og_wolfpass',age:[20,90],cd:10,tags:OGT,when:ogX,ctx:ogC(),
 text:()=>T('Snow on the northern road. Your carts are stopped by a pack of wolves that do not run from fire.','北路下雪了。你的镖车被一群不怕火的狼拦住了。'),
 opts:[{l:T('Fight them off','杀出去'),fight:FG(ogLv(.8,4),'injury',T('Wolves on the snow road','雪路狼群'),T('a wolf pack','狼群'),()=>T('the wolf pack','狼群'),true),
   win:[{t:T('You kill the lead wolf. The pack melts into the snow. The wolf-skin hangs in your hall afterwards.','你杀了头狼，狼群散入雪中。那张狼皮后来挂在了你的大堂里。'),c:'good',fx:{fame:2,f:OG(4,0)}}],
   lose:[{t:T('You lose a horse and some blood before they are satisfied.','赔了一匹马、流了不少血，它们才肯罢休。'),c:'bad',fx:{money:-60}}]},
  {l:T('Sacrifice a mule and drive on','舍一头骡子，赶车快走'),out:[{t:T('The wolves take the mule. You arrive a day early and very quiet.','狼叼走了骡子。你们早到了一天，一路无言。'),c:'muted',fx:{money:-30}}]}]});

I({id:'og_linfamily',age:[22,90],once:1,tags:OGT,when:s=>ogX(s)&&s.org.rep>=20,ctx:ogC({occ:11,age:18,sex:'m'}),
 text:c=>T(`A filthy young man stumbles into your yard: ${c.npc.en}, only son of a famous agency in Fuzhou. In one night his whole family was killed by men who wanted their sword manual. He begs you to hide him.`,`一个满身污泥的少年跌进你的院子——福州一家大镖局的独子${c.npc.zh}。一夜之间满门被杀，凶手为的是他家的剑谱。他求你收留。`),
 opts:[{l:T('Take him in','收留他'),out:[{w:2,t:c=>T(`He sweeps your stables and practises alone at night with terrible fury. You hope he finds peace. You suspect he will find revenge.`,`他白天扫马厩，夜里独自练剑，狠得吓人。你盼他得个安宁，却猜他要的是报仇。`),c:'muted',fx:{align:5,meet:'disciple',bond:60,f:OG(2,1)}},{w:1,t:T('A month later, masked men come asking for him. You say you have never heard the name.','一个月后，蒙面人上门来问他。你说从没听过这个名字。'),c:'bad',fx:{align:5,enemy:1,meet:'friend',bond:70}}]},
  {l:T('Give him silver and send him on','给些银子，打发他走'),out:[{t:T('Years later you hear his name again. It is not a good story.','多年后你又听到了他的名字。那不是一个好故事。'),c:'muted',fx:{money:-50}}]},
  {l:T('Ask to see the sword manual','要看看那本剑谱'),out:[{t:T('He looks at you as if you were one of them. He is gone by morning. You are ashamed for a long time.','他看你的眼神，像在看那些凶手。第二天一早他就不见了。你羞愧了很久。'),c:'bad',fx:{align:-4,happy:-4}}]}]});

I({id:'og_taxsilver',age:[22,90],cd:15,tags:OGT,when:s=>ogX(s)&&s.org.rep>=40,ctx:ogC(),
 text:()=>T('The provincial treasury needs fifty thousand taels of tax silver carried to the capital. The army is busy. They offer the job to your agency.','布政司有五万两税银要解送京城，官军抽不开身，问你的镖局接不接。'),
 opts:[{l:T('Take it: every escort, every cart','接：倾全局之力'),fight:FG(ogLv(1.1,10),'injury',T('Fifty thousand taels','五万两税银'),T('the robbery of the tax silver','劫税银的大盗'),()=>T('the Green Forest alliance','绿林联手')),
   win:[{t:T('Three hundred robbers, one night, one river ford. You hold. The emperor hears your agency’s name.','三百劫匪，一夜，一处渡口。你守住了。你镖局的名号传到了皇上耳朵里。'),c:'gold',fx:{money:1200,fame:8,f:OG(15,2),deed:T('Escorted fifty thousand taels of tax silver to the capital','押解五万两税银进京')}}],
   lose:[{t:T('The silver is lost. The treasury takes your agency’s property as payment and you are lucky to avoid the cangue.','税银丢了。官府抄了镖局的产业抵账，你没戴枷已算侥幸。'),c:'bad',fx:{money:-800,f:OG(-20,-3)}}]},
  {l:T('Decline: that silver has a curse on it','推了：那银子带着煞'),out:[{t:T('A month later the army carries it and is robbed. You light incense.','一个月后官军自己押，被劫了。你上了一炷香。'),c:'muted',fx:{f:OG(-2,0)}}]}]});

I({id:'og_newescort',age:[20,90],cd:8,tags:OGT,when:ogX,ctx:ogC({occ:14,sex:'f',age:20}),
 text:c=>T(`${c.npc.en}, a young woman with a spear taller than she is, asks to join your agency. Your escorts laugh. She asks which of them wants to go first.`,`一个姑娘${c.npc.zh}拎着比她人还高的长枪，要进你的镖局。镖师们都笑了。她问谁先来。`),
 opts:[{l:T('Let her try out','让她试试'),out:[{w:2,t:T('She puts three of them on the ground. Nobody laughs again.','她撂倒了三个。再没人笑了。'),c:'good',fx:{f:OG(5,1),meet:'acq',bond:55}},{w:1,t:T('She loses, but stands up four times. You hire her for that.','她输了，但爬起来四回。你就冲这个雇了她。'),c:'good',fx:{f:OG(3,1)}}]},
  {l:T('“The road is no place for a girl.”','“走镖不是姑娘家干的。”'),out:[{t:T('She joins the agency across the street and becomes its best escort. Your men hear about it every day.','她进了对街的镖局，成了那边最好的镖师。你的人天天听人提起。'),c:'bad',fx:{f:OG(-4,0)}}]}]});

/* ====================== either kind of house ====================== */
I({id:'og_taxmen',age:[20,90],cd:8,tags:OGT,when:ogA,ctx:ogC({occ:9,age:45}),
 text:c=>T(`Tax collectors arrive with an abacus and a long face. By their count, ${OGN(c).en} owes three years of back taxes nobody ever mentioned.`,`收税的拿着算盘、拉着长脸来了。照他们的算法，${OGN(c).zh}欠了三年谁也没提过的旧税。`),
 opts:[{l:T('Pay what they ask','照数缴纳'),out:[{t:T('Painful, and legal. They leave you alone for a long time.','肉疼，但合法。此后很久他们都没再来找麻烦。'),c:'muted',fx:{money:-200}}]},
  {l:T('Invite them to dinner','请他们吃饭'),cost:50,out:[{w:2,t:T('After the fourth jar, the three years become one, and then a rounding error.','四坛酒下肚，三年变成了一年，后来又变成了零头。'),c:'good',fx:{money:-40}},{w:1,t:T('One of them is honest and very offended. You pay a fine as well.','其中一个是清官，大为光火。你还多交了一笔罚银。'),c:'bad',fx:{money:-280}}]},
  {l:T('Show them the books — your books','给他们看账——你做的账'),if:s=>s.smarts>=40,out:[{w:s=>s.smarts/30,t:T('By the end of the afternoon the collector owes you money and does not understand why.','一下午下来，收税的倒欠了你钱，自己还没弄明白怎么回事。'),c:'good',fx:{money:30,happy:3}},{w:1,t:T('They take the books with them. That is worse.','他们把账本带走了。这下更糟。'),c:'bad',fx:{money:-300}}]}]});

I({id:'og_fire',age:[20,90],cd:15,tags:OGT,when:ogA,ctx:ogC(),
 text:c=>T(`Fire! In the night the halls of ${OGN(c).en} go up like dry straw.`,`走水了！夜里${OGN(c).zh}的房子像干草一样烧了起来。`),
 opts:[{l:T('Run into the flames to get people out','冲进火里救人'),out:[{w:3,t:T('You carry out the last two sleepers with your eyebrows on fire. Everyone lives. The halls do not.','你眉毛着着火，把最后两个睡死的人扛了出来。人都活着，房子没了。'),c:'good',fx:{hurt:[5,15],cause:T('a burning hall','火场'),money:-200,align:3,f:OG(6,0)}},{w:1,t:T('The roof falls as you come out. You live; your back is never quite right again.','你刚出来房梁就塌了。你活了下来，后背从此落了病根。'),c:'bad',fx:{hurt:[15,30],cause:T('a burning hall','火场'),maxHealth:-3,money:-200,f:OG(6,0)}}]},
  {l:T('Save the ledgers and the silver chest','先抢账本和银箱'),out:[{t:T('The silver is safe. The people saved themselves. They remember which you went for.','银子保住了。人是自己逃出来的。他们记得你先去抢的是什么。'),c:'muted',fx:{money:-80,f:OG(-6,-1)}}]},
  {l:T('Find out who set it','查是谁放的火'),out:[{w:1,t:T('A rival paid a drunk to do it. You make the rival pay for the rebuilding, one way or another.','是对头花钱雇了个醉汉放的。你想方设法让对头出了重建的钱。'),c:'good',fx:{money:100,f:OG(2,0)}},{w:1,t:T('It was a disciple’s candle. You build again, with a well in every yard.','是一个徒弟的蜡烛。你重新盖，每个院子都打了口井。'),c:'muted',fx:{money:-250}}]}]});

I({id:'og_visitor',age:[22,90],cd:15,tags:OGT,when:s=>ogA(s)&&s.org.rep>=20,ctx:ogC({occ:13,age:60}),
 text:c=>T(`A legend of the jianghu, ${c.npc.en}, arrives unannounced at ${OGN(c).en}, says he heard of the place, and asks for a bed and good wine.`,`江湖上的传奇人物${c.npc.zh}不请自来，说久闻${OGN(c).zh}大名，要一张床、一壶好酒。`),
 opts:[{l:T('Give him your best room and best wine','上房好酒款待'),out:[{w:2,t:T('He stays a month, drinks you dry, and on the last night shows your people one move each. They will talk about it at your funeral.','他住了一个月，把你的酒喝了个精光。临走那夜，他给每个人各指点了一招。到你出殡那天他们还会讲这事。'),c:'gold',fx:{money:-100,skill:2,fame:3,f:OG(10,0)}},{w:1,t:T('He was an impostor. The real one turns up a year later, very amused.','是个冒牌货。一年后正主来了，乐不可支。'),c:'muted',fx:{money:-100,happy:2}}]},
  {l:T('Ask him for a duel','请教一二'),fight:FG(ogLv(1.2,10),'spar',T('A legend’s lesson','高人指点'),T('a friendly bout','切磋')),
   win:[{t:T('You land one touch on him. He laughs and writes you a calligraphy scroll: “Not bad.” It hangs at your gate forever.','你碰到了他一下。他大笑，挥毫写下两个字：“不坏。”这幅字从此挂在你门口。'),c:'gold',fx:{fame:5,f:OG(10,0)}}],
   lose:[{t:T('He beats you in three moves and then explains each one. It is the best lesson of your life.','三招之内你就输了，他又逐招讲给你听。那是你一生中最好的一课。'),c:'good',fx:{skill:3,qi:2}}]}]});

I({id:'og_lawsuit',age:[22,90],cd:12,tags:OGT,when:ogA,ctx:ogC({occ:5,age:55}),
 text:c=>T(`${c.npc.en}, a landowner, sues ${OGN(c).en}, claiming your land was his grandfather’s. He has a deed. It looks very new.`,`地主${c.npc.zh}把${OGN(c).zh}告上了公堂，说你那块地是他祖父的。他有地契——看上去新得很。`),
 opts:[{l:T('Fight it in court','对簿公堂'),out:[{w:s=>s.smarts/30,t:T('You point out the deed is written on paper from a mill that opened last year. The court laughs him out.','你指出那地契用的纸，出自去年才开张的纸坊。满堂哄笑，把他轰了出去。'),c:'good',fx:{smarts:1,f:OG(3,0)}},{w:1,t:T('The judge has had a good dinner at his house. You lose a strip of land.','县官在他家吃过好饭。你输掉了一条地。'),c:'bad',fx:{money:-150,f:OG(-3,0)}}]},
  {l:T('Settle with silver','花钱了事'),out:[{t:T('He goes away richer. Two more landowners discover grandfathers.','他得了钱走了。又有两个地主忽然想起了祖父。'),c:'muted',fx:{money:-120}}]},
  {l:T('Pay him a polite visit with twenty of your people','带二十个人上门客气客气'),out:[{w:2,t:T('He withdraws the suit and sends cakes.','他撤了状子，还送来几盒点心。'),c:'muted',fx:{align:-3}},{w:1,t:T('He adds intimidation to the suit.','他在状子上又加了一条恐吓。'),c:'bad',fx:{money:-200,align:-3,f:OG(-4,0)}}]}]});

I({id:'og_festival',age:[20,90],cd:6,tags:OGT,when:ogA,ctx:ogC(),
 text:c=>T(`It is ${OGN(c).en}’s founding day. Your people want a festival: lanterns, lion dancers, a feast for the whole town.`,`今天是${OGN(c).zh}的开山之日。大家想办场热闹：挂灯笼、舞狮子，请全镇吃席。`),
 opts:[{l:T('The biggest feast the town has seen (150 taels)','办全镇最大的席（一百五十两）'),cost:150,out:[{w:3,t:T('Three hundred tables. The lions leap from roof to roof. Children who were there will join you when they are grown.','三百桌酒席，狮子在屋顶间腾跃。那天在场的孩子，长大了都想来投你。'),c:'gold',fx:{happy:6,fame:2,f:OG(8,2)}},{w:1,t:T('A firecracker sets the stable on fire. Everyone agrees it was the best part.','一挂鞭炮点着了马厩。大家都说那是最精彩的一段。'),c:'good',fx:{happy:4,money:-30,f:OG(5,0)}}]},
  {l:T('A modest dinner for your own people','自家人简单吃顿饭'),out:[{t:T('Dumplings, wine, and an old song. Small and warm.','饺子、酒，还有一支老歌。小而暖。'),c:'good',fx:{money:-20,happy:4,f:OG(2,0)}}]},
  {l:T('A martial display open to all','办一场公开演武'),out:[{w:2,t:T('Your people show what they can do. Recruits ask about joining before the dust settles.','门人们各显身手，尘土还没落定就有人来打听入门。'),c:'good',fx:{f:OG(5,2),fame:1}},{w:1,t:T('A guest climbs up to “join in” and breaks your best man’s arm. It is a very memorable festival.','一个客人跳上台来“凑热闹”，打断了你手下最好那人的胳膊。这节过得叫人难忘。'),c:'bad',fx:{f:OG(-3,0)}}]}]});

/* ====================== the newer jobs ====================== */
const jbJob=j=>s=>s.job===j;
const jbPerf=n=>s=>{if(s.job)s.perf=clamp((s.perf||50)+n,0,100)};

I({id:'jb_boat_fugitive',age:[13,80],w:2,cd:8,when:jbJob('boatman'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:28,age:rint(25,40),lv:Math.max(5,Math.round(power(s)*.9))});return c},
 text:c=>T(`Midnight. A man in a torn officer’s coat, ${c.npc.en}, begs you to row him across. Torches are coming down the bank.`,`半夜，一个穿着破官袍的人${c.npc.zh}求你渡他过河。河岸上火把正往这边来。`),
 opts:[{l:T('Row, fast','快划'),out:[{w:2,t:T('He jumps ashore on the far side and presses a gold ring into your hand. You never learn his crime, or his innocence.','他在对岸跳下船，往你手里塞了枚金戒指。他犯了什么罪，或者是不是冤枉，你永远不知道。'),c:'good',fx:{money:60,align:2}},{w:1,t:T('Arrows hiss into the water around you. He makes it. Your boat has eleven new holes.','箭嗖嗖地扎进水里。他逃掉了，你的船多了十一个窟窿。'),c:'bad',fx:{money:-30,hurt:[3,10],cause:T('arrows on the river','河上的乱箭')}}]},
  {l:T('Shout for the torches','冲火把大喊'),out:[{t:T('The soldiers take him and give you three hundred coppers. He looks back at you once.','官兵抓走了他，赏了你三百文。他回头看了你一眼。'),c:'muted',fx:{money:30,align:-4}}]},
  {l:T('“Swim.”','“自己游。”'),fight:FG((s,c)=>c.npc.lv,'light',T('A desperate passenger','急红眼的乘客'),T('a desperate fugitive','亡命之徒')),
   win:[{t:T('He goes into the river. You do not watch which bank he reaches.','他落了水。他游向哪边，你没去看。'),c:'muted'}],lose:[{t:T('He takes your boat and leaves you on the bank to explain.','他抢了你的船，留你在岸上跟官兵解释。'),c:'bad',fx:{money:-50}}]}]});
I({id:'jb_boat_flood',age:[13,80],w:2,cd:10,when:jbJob('boatman'),text:()=>T('The river floods. Whole villages are on their roofs. You have the only boat for miles.','河水暴涨，一村一村的人都爬上了屋顶。方圆几里只有你一条船。'),
 opts:[{l:T('Row all night, for free','连夜划，分文不取'),out:[{w:3,t:T('Thirty-one people. Your hands bleed through the oar grips. A village names a well after you.','三十一个人。你的手把桨柄都染红了。一个村子拿你的名字给一口井命名。'),c:'gold',fx:{align:8,fame:3,hurt:[3,8],cause:T('rowing through a flood','洪水中划船'),deed:T('Rowed thirty-one people out of a flood','洪水中救出三十一人')}},{w:1,t:T('Your boat capsizes at the last roof. A woman you saved earlier pulls you out.','到最后一户屋顶时船翻了。是你先前救上来的一个妇人把你拉了上来。'),c:'good',fx:{align:6,hurt:[8,15],cause:T('a capsized boat','翻船')}}]},
  {l:T('Charge a fair price','收公道价'),out:[{t:T('Nobody argues. Some pay in hens. You row until dawn.','没人还价，有人拿母鸡抵船钱。你一直划到天亮。'),c:'good',fx:{money:40,align:1}}]},
  {l:T('Charge what they will pay','趁水涨价'),out:[{t:T('A rich man pays fifty taels for one seat. A poor family waits on a roof that does not last.','一个富户一个座位付了五十两。一户穷人家在屋顶上等着，屋顶没撑住。'),c:'bad',fx:{money:150,align:-10,happy:-5}}]}]});

I({id:'jb_cook_poison',age:[12,80],w:2,cd:12,when:jbJob('cook'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:31,age:50});return c},
 text:c=>T(`${c.npc.en}, a smiling man in palace silks, puts a paper packet and twenty taels on your chopping board. “For the magistrate’s soup tonight. He will just feel tired. For ever.”`,`一个穿宫缎、笑眯眯的人${c.npc.zh}把一包药粉和二十两银子放在你的砧板上。“今晚县太爷的汤里。他只会觉得乏，永远地乏。”`),
 opts:[{l:T('Pour the powder into the river','把药倒进河里'),out:[{w:2,t:T('You cook the soup clean and say nothing. Two weeks later the smiling man is arrested for something else. You breathe again.','你干干净净地做了汤，一句没提。两星期后，那笑脸人因别的事被抓了。你这才喘过气来。'),c:'good',fx:{align:5}},{w:1,t:T('He comes back to ask why the magistrate is still well. You need a new job, in a new town.','他回来问县太爷怎么还好好的。你得换个差事，还得换个地方。'),c:'bad',fx:{align:5,f:s=>{s.job=null},enemy:1}}]},
  {l:T('Warn the magistrate','告诉县太爷'),out:[{t:T('The magistrate eats nothing for a month, then promotes you to head of his kitchen.','县太爷一个月不敢吃东西，后来把你提拔成了大厨。'),c:'gold',fx:{align:6,money:50,f:jbPerf(40)}}]},
  {l:T('Do it','照办'),out:[{t:T('The magistrate dies in his sleep. The twenty taels feel heavier every year.','县太爷在睡梦中死了。那二十两银子一年比一年重。'),c:'bad',fx:{money:20,align:-20,happy:-8,wanted:1}}]}]});
I({id:'jb_cook_critic',age:[12,80],w:2,cd:8,when:jbJob('cook'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:60});return c},
 text:c=>T(`A famous gourmet, ${c.npc.en}, whose single poem can make or ruin a restaurant, orders “whatever the cook thinks I deserve”.`,`有名的老饕${c.npc.zh}来了——他一首诗能捧红一家馆子，也能毁掉一家。他点菜：“厨子觉得我配吃什么就上什么。”`),
 opts:[{l:T('Cook the dish your mother made','做你娘做的那道家常菜'),out:[{w:2,t:T('He eats in silence and then, with wet eyes, writes a poem on the wall. The queue goes round the block for a year.','他默默吃完，红着眼眶在墙上题了一首诗。此后一年，门口的队排到了街角。'),c:'gold',fx:{fame:2,money:40,f:jbPerf(30),happy:5}},{w:1,t:T('“Peasant food,” he says, and eats three bowls.','“乡下饭。”他说，然后吃了三碗。'),fx:{happy:3}}]},
  {l:T('Thirty-six courses of everything rare','三十六道山珍海味'),out:[{w:1,t:T('He writes that the kitchen “tries very hard”. Your employer throws a pan at you.','他写道：这家厨房“非常努力”。东家拿锅砸了你。'),c:'bad',fx:{f:jbPerf(-20)}},{w:1,t:T('He loves it, and charges it to the prefect. Everyone wins.','他很满意，账记在了知府头上。皆大欢喜。'),c:'good',fx:{f:jbPerf(15),money:20}}]},
  {l:T('Serve him plain rice','只给他一碗白饭'),out:[{t:T('He stares at it a long time, eats every grain, and leaves you a single line: “Courage is the rarest seasoning.” Your employer does not find it funny.','他盯着那碗饭看了很久，一粒不剩地吃完，留了一句：“胆子是最稀罕的佐料。”东家可不觉得好笑。'),c:'muted',fx:{fame:1,f:jbPerf(-10),smarts:1}}]}]});

I({id:'jb_herb_ginseng',age:[12,80],w:2,cd:10,when:jbJob('herbalist'),text:()=>T('On a cliff ledge you find a wild ginseng root shaped like a little man. Such a root is worth a fortune. It is also at the edge of a long drop.','你在崖边石缝里找到一棵人形的野山参。这样的参值一大笔钱，可它长在万丈悬崖的边上。'),
 opts:[{l:T('Climb down for it','下去挖'),out:[{w:s=>s.t.root,t:T('You dig it out with your fingers. Six hundred taels at the capital market.','你用手指一点点抠了出来。在京城集市上卖了六百两。'),c:'gold',fx:{money:600}},{w:3,t:T('The ledge gives way. You keep the ginseng and lose a summer to a broken leg.','石缝塌了。参是保住了，你断了腿，躺了一夏天。'),c:'bad',fx:{money:300,hurt:[15,30],cause:T('a fall from a cliff','坠崖')}},{w:1,t:T('You eat it on the spot, for no reason you can explain. You feel ten years younger.','你鬼使神差地当场就吃了。整个人像年轻了十岁。'),c:'gold',fx:{lifespan:2,qi:4,heal:30}}]},
  {l:T('Mark the place and come back with rope','做个记号，带绳子再来'),out:[{w:1,t:T('You come back with rope. A deer has eaten the leaves, and nobody can find a root without leaves.','你带着绳子回来了。叶子被鹿啃了，没叶子谁也找不着参。'),c:'muted'},{w:1,t:T('You come back with rope and get it safely. Four hundred taels and two whole legs.','你带着绳子回来，平平安安挖到了。四百两，两条腿也好好的。'),c:'good',fx:{money:400}}]}]});
I({id:'jb_herb_poison',age:[12,80],w:2,cd:12,when:jbJob('herbalist'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:27,sex:'f',age:rint(25,40)});return c},
 text:c=>T(`${c.npc.en}, a young wife with bruises on her wrists, asks very quietly for “something for rats”. Enough for a large rat.`,`一个手腕上带着淤青的小媳妇${c.npc.zh}，压低声音要“耗子药”，要够毒一只“大耗子”的量。`),
 opts:[{l:T('Sell her flour and ask about the bruises','卖她一包面粉，问问淤青'),out:[{t:c=>T(`She tells you. You find her a place with your cousin in the next county. Her husband, it is said, drinks himself into the river that winter.`,`她都说了。你托表亲在邻县给她找了落脚处。听说那年冬天，她男人喝醉了掉进了河里。`),c:'good',fx:{align:6,meet:'friend',bond:60}}]},
  {l:T('Sell her what she asks','照她要的卖'),out:[{t:T('The town talks for months about the butcher who died so suddenly. Nobody asks the herbalist anything.','镇上议论了好几个月，那个屠户怎么死得这么突然。没人来问药铺。'),c:'muted',fx:{money:5,align:-5}}]},
  {l:T('Refuse and tell the constable','拒卖，并告诉捕快'),out:[{t:T('The constable laughs and tells her husband. You see her once more, in the market, and she does not look at you.','捕快笑了笑，转告了她男人。你后来在集上见过她一次，她没看你。'),c:'bad',fx:{align:-2,happy:-4}}]}]});

I({id:'jb_hunt_tiger',age:[14,80],w:2,cd:10,when:jbJob('hunter'),text:()=>T('A man-eating tiger has taken four people from the villages. The magistrate offers a hundred taels for its skin.','一头吃人的老虎已经叼走了四个村民。县太爷悬赏一百两要它的皮。'),
 opts:[{l:T('Hunt it alone','独自去猎'),fight:FG(PW(1.05,8),'injury',T('The man-eater','吃人的老虎'),T('a man-eating tiger','吃人虎'),()=>T('the man-eating tiger','吃人虎'),true),
   win:[{t:T('Three days in a tree, one arrow, one spear. The villages carry you and the skin into town on their shoulders.','在树上蹲了三天，一箭一枪。村民们把你和虎皮一起扛进了城。'),c:'gold',fx:{money:100,fame:4,f:jbPerf(30),deed:T('Killed a man-eating tiger','猎杀吃人猛虎')}}],
   lose:[{t:T('It finds you first. You live, which most do not.','它先发现了你。你活了下来——大多数人活不下来。'),c:'bad',fx:{f:jbPerf(-10)}}]},
  {l:T('Set a pit trap with the villagers','和村民挖陷阱'),out:[{w:2,t:T('A week of digging and it walks right in. The reward is split twenty ways and everyone is happy.','挖了一个星期，它径直走了进去。赏银二十个人分，大家都很高兴。'),c:'good',fx:{money:10,align:2,f:jbPerf(10)}},{w:1,t:T('The magistrate’s horse finds the pit first.','先掉进坑里的是县太爷的马。'),c:'bad',fx:{money:-30,f:jbPerf(-15)}}]}]});
I({id:'jb_hunt_poachers',age:[14,80],w:2,cd:12,when:jbJob('hunter'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:15,age:rint(14,18)});return c},
 text:c=>T(`On the prince’s hunting ground you catch ${c.npc.en}, a starving boy with a snared hare. The penalty for poaching here is a hand.`,`在王府的猎场里，你逮住了一个饿得皮包骨的少年${c.npc.zh}，他套了一只野兔。在这里偷猎，要剁一只手。`),
 opts:[{l:T('Let him go, and the hare','放了他，兔子也让他带走'),out:[{w:3,t:T('He runs. Months later you find a basket of mushrooms on your doorstep.','他跑了。几个月后你家门口多了一篮蘑菇。'),c:'good',fx:{align:4}},{w:1,t:T('The steward saw. You are docked a month’s pay.','管事看见了。你被扣了一个月的工钱。'),c:'bad',fx:{align:4,money:-15,f:jbPerf(-15)}}]},
  {l:T('Teach him to hunt properly, off the prince’s land','教他到王府地界外好好打猎'),out:[{t:c=>T(`${c.npc.en} becomes your apprentice and the best tracker in three counties.`,`${c.npc.zh}成了你的徒弟，后来是三个县里最好的追踪手。`),c:'good',fx:{meet:'disciple',bond:70,align:3}}]},
  {l:T('Hand him over','交出去'),out:[{t:T('Rules are rules. The steward praises you. You do not hunt well for a long time.','规矩就是规矩。管事夸了你。之后很久，你打猎都不顺手。'),c:'bad',fx:{align:-8,f:jbPerf(15),happy:-5}}]}]});

I({id:'jb_courier_edict',age:[16,80],w:2,cd:12,when:jbJob('courier'),text:()=>T('You carry a sealed edict to the frontier general. At an inn, a drop of rain smears the seal, and you see the wax is a forgery. Someone wants the general to “retire” by his own sword.','你送一道密封的圣旨去边关大帅处。在客栈里，一滴雨水洇开了封蜡，你看出那是假的。有人要大帅“自裁谢罪”。'),
 opts:[{l:T('Deliver it, and whisper what you saw','照送，悄悄说出你看见的'),out:[{w:2,t:T('The general reads it, looks at you, and burns it. Next month the minister who wrote it is arrested. You are quietly promoted.','大帅看完，看了你一眼，把它烧了。下个月写这道旨的大臣被抓了。你悄悄升了官。'),c:'gold',fx:{align:6,fame:2,f:s=>{if(s.job==='courier'&&s.jobLv<2){s.jobLv++;s.perf=55}}}},{w:1,t:T('The general does not believe you, and obeys. The frontier falls that autumn.','大帅不信你，奉旨自尽了。那年秋天边关失守。'),c:'bad',fx:{happy:-8,align:3}}]},
  {l:T('Lose the edict in a river','把圣旨“掉”进河里'),out:[{t:T('You are flogged for carelessness. The general lives. Nobody ever knows why, except you.','你因失职挨了顿板子。大帅活了下来，除了你没人知道为什么。'),c:'muted',fx:{hurt:[5,12],cause:T('a flogging','杖刑'),align:5,f:jbPerf(-25)}}]},
  {l:T('Deliver it and know nothing','照送，什么都不知道'),out:[{t:T('You are not paid enough to have opinions. You remind yourself of this often.','你挣的那点钱不够你有看法。你经常这样提醒自己。'),c:'muted',fx:{align:-4,f:jbPerf(5)}}]}]});
I({id:'jb_courier_snow',age:[16,80],w:2,cd:10,when:jbJob('courier'),text:()=>T('An urgent dispatch, a blizzard in the pass, and a horse that will not go on.','十万火急的公文，山口里的暴风雪，还有一匹不肯再走的马。'),
 opts:[{l:T('Go on foot','徒步往前'),out:[{w:s=>s.t.root,t:T('Two days through snow up to your waist. You arrive with frostbitten ears and the dispatch dry inside your shirt.','雪没到腰，走了两天。你冻坏了耳朵，公文却在怀里干干的。'),c:'gold',fx:{f:jbPerf(35),hurt:[5,12],cause:T('frostbite','冻伤'),fame:1}},{w:1,t:T('You are found by shepherds, half dead. The dispatch arrives a week late.','几个牧人发现你时你只剩半条命。公文晚到了一个星期。'),c:'bad',fx:{hurt:[15,25],cause:T('a blizzard','暴风雪'),f:jbPerf(-15)}}]},
  {l:T('Wait it out at the post station','在驿站等雪停'),out:[{t:T('Late, but alive. Your superior writes your name in a book of disappointments.','晚是晚了，人还活着。上司把你的名字记进了一本“失望簿”。'),c:'muted',fx:{f:jbPerf(-15)}}]}]});

I({id:'jb_fortune_general',age:[18,85],w:2,cd:12,when:jbJob('fortune'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:28,age:50,sex:'m'});return c},
 text:c=>T(`A general, ${c.npc.en}, sits at your table in disguise. He wants to know if he will win the coming battle. His guards behind him want to know too.`,`一位乔装的将军${c.npc.zh}坐到了你的卦摊前。他想知道下一仗能不能打赢。他身后的亲兵也想知道。`),
 opts:[{l:T('Tell him what the hexagram says: defeat','照卦直说：败'),out:[{w:1,t:T('He goes pale, changes his plans, and wins. He sends you a hundred taels and a note: “You were right, by being wrong.”','他脸色发白，改了战法，打赢了。他送来一百两和一张条子：“你说错了，所以你说对了。”'),c:'gold',fx:{money:100,fame:2,f:jbPerf(20)}},{w:1,t:T('He has you beaten for bad luck.','他嫌你晦气，让人打了你一顿。'),c:'bad',fx:{hurt:[5,12],cause:T('an angry general','恼怒的将军')}}]},
  {l:T('Tell him what he wants: victory','说他爱听的：胜'),out:[{w:1,t:T('He wins and comes back with gold. You are now “the Oracle of the Market”.','他打了胜仗，带着金子回来。你成了“市口神算”。'),c:'gold',fx:{money:150,fame:3,f:jbPerf(30)}},{w:1,t:T('He loses. His widow wants a word with you.','他打了败仗。他的遗孀要找你谈谈。'),c:'bad',fx:{f:jbPerf(-30),enemy:1}}]},
  {l:T('Read his face, not the coins','不看卦，看面相'),if:s=>s.smarts>=55,out:[{t:T('“Your second-in-command smiles too much.” Three days later the man is caught selling maps to the enemy.','“你的副将笑得太多了。”三天后，那人被抓住在给敌军卖地图。'),c:'gold',fx:{money:120,smarts:2,fame:2,f:jbPerf(30)}}]}]});
I({id:'jb_fortune_fraud',age:[18,85],w:2,cd:12,when:jbJob('fortune'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:24,age:60});return c},
 text:c=>T(`A rival fortune teller, ${c.npc.en}, challenges you in the square: each of you predicts tomorrow’s weather, and the loser leaves town.`,`同行${c.npc.zh}在广场上向你叫板：两人各断明日阴晴，输的人滚出城去。`),
 opts:[{l:T('Ask the old fishermen first','先去问问老渔翁'),out:[{w:3,t:T('The fishermen are never wrong. Rain at noon. Your rival leaves town wet.','渔翁从来没错过。正午下雨。你的对手淋着雨出了城。'),c:'good',fx:{f:jbPerf(20),fame:1,smarts:1}},{w:1,t:T('The fishermen are wrong, once in forty years. Today.','渔翁四十年来错了一次，就是今天。'),c:'bad',fx:{f:s=>{s.job=null},happy:-5}}]},
  {l:T('Predict “a change in the weather”','断曰：“天有不测风云”'),out:[{t:T('The crowd finds this unbearable and throws vegetables at both of you. You both stay, and become friends.','围观的人受不了，朝你们俩扔烂菜。结果谁也没走，你们倒成了朋友。'),c:'muted',fx:{meet:'friend',bond:55,happy:3}}]}]});

I({id:'jb_merch_famine',age:[18,85],w:2,cd:12,when:jbJob('merchant'),text:()=>T('Drought in the south. You have a warehouse full of rice, and the price triples every week.','南方大旱。你有一仓库的米，米价每星期翻三倍。'),
 opts:[{l:T('Hold out for the top price','囤着等最高价'),out:[{w:2,t:T('You sell at ten times cost. You are now very rich. People spit at your sedan chair.','你以十倍价钱卖出，发了大财。你的轿子路过时有人吐口水。'),c:'bad',fx:{money:800,align:-10}},{w:1,t:T('The governor seizes your warehouse “for the people”. You get a receipt.','巡抚以“为民”之名封了你的仓库。你得了一张收条。'),c:'bad',fx:{money:-200,align:-4}}]},
  {l:T('Sell at the normal price','照平价卖'),out:[{t:T('A modest profit. The governor gives you a plaque: “Benevolent Merchant”. It brings customers for twenty years.','小赚一笔。巡抚送你一块匾：“仁义商家”。它给你招了二十年的客。'),c:'good',fx:{money:150,align:6,fame:3,f:jbPerf(20)}}]},
  {l:T('Give half away','捐一半'),out:[{t:T('You make no profit and gain a province of friends.','你一文没赚，却交了一省的朋友。'),c:'gold',fx:{align:10,fame:4,happy:4,deed:T('Gave rice away in a drought','大旱之年舍米赈灾')}}]}]});
I({id:'jb_merch_partner',age:[18,85],w:2,cd:10,when:jbJob('merchant'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:23,age:40});return c},
 text:c=>T(`${c.npc.en}, a Persian trader, proposes a partnership: your silk, his camels, half the profit from the far west.`,`波斯商人${c.npc.zh}提议合伙：你出丝绸，他出骆驼，西域的利润对半分。`),
 opts:[{l:T('Invest 300 taels','投三百两'),cost:300,out:[{w:2,t:T('A year later a caravan returns with glass, spices and twice your silver.','一年后商队回来了，带着琉璃、香料，还有你本钱的两倍。'),c:'gold',fx:{money:650,f:jbPerf(20),meet:'friend',bond:60}},{w:1,t:T('The caravan is lost in a sandstorm. He comes back alone, on foot, and pays you back over ten years. You did not expect that.','商队在沙暴里没了。他独自走回来，用十年时间还清了你的钱。你没想到。'),c:'muted',fx:{money:300,meet:'friend',bond:75}},{w:1,t:T('Neither he nor the camels are seen again.','人和骆驼都再没出现过。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Decline','不做'),out:[{t:T('He finds another partner and gets rich. He sends you a postcard, of sorts: a dried date.','他找了别人合伙，发了财。还给你捎来一颗干枣，算是问候。'),c:'muted'}]}]});

I({id:'jb_instr_brat',age:[20,85],w:2,cd:10,when:jbJob('instructor'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:11,age:17});return c},
 text:c=>T(`${c.npc.en}, the prefect’s son, pays triple fees and expects to win every sparring match. Today he wants to fight you.`,`知府公子${c.npc.zh}交三倍学费，指望每场切磋都赢。今天他要跟你过招。`),
 opts:[{l:T('Let him win','让他赢'),out:[{w:2,t:T('He boasts all over town. The hall’s fees go up. Your best students quietly leave.','他满城吹嘘。武馆学费涨了，最好的几个学生悄悄走了。'),c:'muted',fx:{money:60,align:-2,f:jbPerf(10)}},{w:1,t:T('He picks a fight in town, sure he is invincible, and is beaten half to death. The prefect blames you.','他自以为天下无敌，上街找人打架，被揍了个半死。知府怪到你头上。'),c:'bad',fx:{f:jbPerf(-30)}}]},
  {l:T('Beat him, gently and completely','温和而彻底地打败他'),out:[{w:2,t:T('He cries, then comes back the next morning before dawn. In three years he is your best student.','他哭了，第二天天不亮又来了。三年后他是你最好的学生。'),c:'gold',fx:{f:jbPerf(20),align:3,meet:'disciple',bond:60}},{w:1,t:T('His father removes him, and the hall’s licence.','他爹把他领走了，顺手吊销了武馆的执照。'),c:'bad',fx:{f:s=>{s.job=null},align:3}}]}]});

I({id:'jb_bounty_innocent',age:[18,80],w:2,cd:10,when:jbJob('bounty'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:30,lv:Math.max(5,Math.round(power(s)*.5))});return c},
 text:c=>T(`You track down ${c.npc.en}, wanted for murder, 200 taels. He is teaching village children to read. The more you learn, the clearer it is: the man who posted the bounty did the killing.`,`你追到了悬赏二百两的杀人犯${c.npc.zh}。他在村里教孩子识字。你越查越清楚：真正的凶手，就是出赏银的那个人。`),
 opts:[{l:T('Bring him in anyway; the court can decide','照样拿人，让官府去断'),out:[{t:T('The court decides in favour of the man with money. You collect 200 taels and stop sleeping well.','官府判了有钱的那个赢。你拿了二百两，从此睡不安稳。'),c:'bad',fx:{money:200,align:-8,happy:-5}}]},
  {l:T('Go after the man who posted it','去找出赏银的人'),fight:FG(PW(1.0,5),'injury',T('The real killer','真凶'),T('a rich murderer’s guards','富家凶手的护卫'),()=>T('the real killer’s guards','真凶的护卫')),
   win:[{t:T('You drag the real killer to the magistrate with his own bloody sleeve as evidence. The teacher keeps teaching.','你把真凶连同他那只带血的袖子一起拖到了县衙。教书先生继续教书。'),c:'gold',fx:{align:8,fame:4,f:jbPerf(20),deed:T('Cleared an innocent man of murder','为蒙冤者洗清杀人之罪')}}],
   lose:[{t:T('Now there is a bounty on you, posted by the same man.','如今你头上也有了悬赏，出钱的还是那个人。'),c:'bad',fx:{wanted:1,enemy:1}}]},
  {l:T('Tell him to run','叫他快逃'),out:[{t:T('He goes over the mountains that night. Another hunter will come. You hope he is slower than you.','他当夜翻山走了。还会有别的赏金客来。你只盼那人比你慢。'),c:'muted',fx:{align:5,f:jbPerf(-15)}}]}]});
I({id:'jb_bounty_bigfish',age:[18,80],w:2,cd:12,when:s=>s.job==='bounty'&&power(s)>=55,ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:45,lv:Math.round(power(s)*1.1+6)});return c},
 text:c=>T(`The poster says 1,500 taels for ${c.npc.en}, the “Laughing Butcher”, killer of thirty. He is drinking alone in the inn across the street.`,`告示上写着：缉拿“笑面屠夫”${c.npc.zh}，杀人三十，赏银一千五百两。他正独自在对街客栈里喝酒。`),
 opts:[{l:T('Sit down at his table','坐到他桌上'),fight:FG((s,c)=>c.npc.lv,'injury',T('The Laughing Butcher','笑面屠夫'),T('the Laughing Butcher','笑面屠夫')),
   win:[{t:T('He is still laughing when he goes down. The 1,500 taels come in a box that takes two men to carry.','他倒下时还在笑。一千五百两装了一箱，得两个人抬。'),c:'gold',fx:{money:1500,fame:6,f:jbPerf(40)}}],
   lose:[{t:T('He pours you a cup of wine as you lie on the floor. “Next time, bring friends.”','你躺在地上，他给你倒了一杯酒。“下回带几个朋友来。”'),c:'bad',fx:{f:jbPerf(-10)}}]},
  {l:T('Wait and gather other hunters','先等等，叫上几个同行'),out:[{w:1,t:T('Five of you take him in the stables. The reward split five ways is still more than a year’s pay.','你们五个在马厩里拿下了他。赏银五个人分，仍抵得上一年的工钱。'),c:'good',fx:{money:300,f:jbPerf(15)}},{w:1,t:T('By the time you are ready, he is gone, and so is the innkeeper’s daughter.','等你们准备好，人早没了，客栈老板的女儿也不见了。'),c:'bad',fx:{happy:-4}}]}]});

I({id:'jb_enforcer_widow',age:[16,80],w:2,cd:10,when:jbJob('enforcer'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:27,age:40,sex:'f'});return c},
 text:c=>T(`Your boss sends you to collect a dead gambler’s debt from his widow, ${c.npc.en}. She has two children and one hen.`,`老板派你去向一个死了的赌鬼的遗孀${c.npc.zh}讨债。她有两个孩子和一只母鸡。`),
 opts:[{l:T('Take the hen and go','拿走母鸡交差'),out:[{t:T('Your boss laughs at the hen. The children do not.','老板看着母鸡哈哈大笑。孩子们没笑。'),c:'muted',fx:{align:-3,f:jbPerf(5)}}]},
  {l:T('Pay the debt yourself','自己掏钱替她还'),out:[{t:T('Fifty taels from your own pocket. Your boss is suspicious of kindness and watches you after that.','你自掏了五十两。老板疑心你心软，从此盯着你。'),c:'good',fx:{money:-50,align:6,f:jbPerf(-10)}}]},
  {l:T('Tell your boss she has already fled','回去说她已经跑了'),out:[{w:2,t:T('He shrugs. Debts die all the time.','他耸耸肩。债死了的多了。'),c:'good',fx:{align:3}},{w:1,t:T('He sends someone else to check. Now you owe the debt.','他另派人去查。现在这笔债算到了你头上。'),c:'bad',fx:{money:-80,f:jbPerf(-25)}}]}]});

I({id:'jb_smug_raid',age:[16,80],w:2,cd:8,when:jbJob('smuggler'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:9,age:40,lv:Math.max(5,Math.round(power(s)*.95+4))});return c},
 text:c=>T(`A night run with forty sacks of salt on three boats. Halfway up the canal, lanterns flare: a customs raid, led by ${c.npc.en}.`,`夜里三条船、四十袋私盐。运河走到一半，灯笼骤然亮起——是${c.npc.zh}带人来查缉私盐。`),
 opts:[{l:T('Dump the salt in the canal','把盐倒进河里'),out:[{t:T('Forty sacks of salt sink in a fizzing cloud. They find empty boats and three innocent boatmen. Your boss is not pleased.','四十袋盐咕嘟嘟沉了下去。他们只搜到空船和三个“老实”船夫。老板很不高兴。'),c:'muted',fx:{money:-100,f:jbPerf(-10)}}]},
  {l:T('Fight through','杀出去'),fight:FG((s,c)=>c.npc.lv,'injury',T('Customs raid on the canal','运河缉私'),T('salt-customs officers','缉私官兵')),
   win:[{t:T('The customs boat goes into the reeds. You arrive with every sack, and a reputation.','缉私船被撞进了芦苇荡。你一袋不少地到了地方，还挣了名头。'),c:'gold',fx:{money:200,wanted:1,f:jbPerf(30)}}],
   lose:[{t:T('Caught with the salt.','人赃并获。'),c:'bad',fx:{jail:2}}]},
  {l:T('Bribe the officer','贿赂官差'),cost:80,out:[{w:2,t:c=>T(`${c.npc.en} counts the silver and his lanterns go out one by one.`,`${c.npc.zh}点清了银子，灯笼一盏一盏地灭了。`),c:'good',fx:{f:jbPerf(10)}},{w:1,t:T('He is new and honest. You add bribery to smuggling.','他是新来的，还是个清官。你的罪名在走私之外又添了行贿。'),c:'bad',fx:{wanted:1,jail:1}}]}]});
I({id:'jb_smug_famine',age:[16,80],w:2,cd:12,when:jbJob('smuggler'),text:()=>T('A mountain town has had no salt for months: the official salt is too dear. People are sick. You have a full cart.','山里一个镇子几个月没盐吃了——官盐太贵，人都病了。你有一满车私盐。'),
 opts:[{l:T('Sell at cost','按本钱卖'),out:[{t:T('Your boss loses money on the run. The town names you “the Salt Bodhisattva” and hides you from the constables for life.','老板这趟赔了钱。镇上管你叫“盐菩萨”，一辈子替你瞒着捕快。'),c:'gold',fx:{align:8,wanted:-1,f:jbPerf(-15)}}]},
  {l:T('Sell at full price','照价卖'),out:[{t:T('Business is business. The town pays, and remembers.','生意归生意。镇上人付了钱，也记住了你。'),c:'muted',fx:{money:120,f:jbPerf(15)}}]}]});

I({id:'jb_jyw_arrest',age:[18,80],w:2,cd:12,when:jbJob('jinyiwei'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:60,sex:'m'});return c},
 text:c=>T(`Orders from the Eastern Depot: arrest Censor ${c.npc.en} for “treason”. His crime is a memorial criticising the chief eunuch. Everyone knows he is the most honest man at court.`,`东厂的命令：以“谋逆”罪拿下御史${c.npc.zh}。他的罪名是上折子参了掌印太监。满朝都知道，他是最清白的一个。`),
 opts:[{l:T('Arrest him','拿人'),out:[{t:T('He walks to the cart with his head up and says, “Thank you for not using chains.” You use chains anyway, as ordered. You are promoted.','他昂首走向囚车，说：“谢你不用铁链。”可上头有令，你还是用了。你升了官。'),c:'bad',fx:{align:-12,happy:-6,f:s=>{if(s.job==='jinyiwei'&&s.jobLv<2){s.jobLv++;s.perf=55}}}}]},
  {l:T('Warn him the night before','前一夜通风报信'),out:[{w:2,t:T('By dawn he has fled south. You report finding an empty house. Your commander’s eyes rest on you a moment too long.','天亮前他已南逃。你回报说扑了个空。指挥使的目光在你身上多停了一会儿。'),c:'good',fx:{align:10,f:jbPerf(-25)}},{w:1,t:T('He refuses to flee. “Then who would speak?” He is arrested the next day by someone else.','他不肯走。“我走了，谁来说话？”第二天他被别人抓走了。'),c:'muted',fx:{align:6,happy:-5}}]},
  {l:T('Refuse the order','抗命'),out:[{t:T('You hand in your embroidered robe and spring-blade sword. You leave the capital with your life, which is more than many get.','你交还了飞鱼服和绣春刀，活着离开了京城——这已比很多人强。'),c:'muted',fx:{align:8,fame:2,f:s=>{s.job=null},enemy:1}}]}]});
I({id:'jb_jyw_torture',age:[18,80],w:2,cd:10,when:jbJob('jinyiwei'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:30});return c},
 text:c=>T(`In the Guard’s prison, ${c.npc.en}, a captured swordsman, will not name his accomplices. Your superior hands you the irons.`,`锦衣卫诏狱里，被擒的剑客${c.npc.zh}死活不肯供出同党。上司把刑具递到了你手上。`),
 opts:[{l:T('Use the irons','用刑'),out:[{t:T('He talks on the third day. Six men are arrested. You stop sleeping in the dark.','第三天他招了，抓了六个人。从此你不敢熄灯睡觉。'),c:'bad',fx:{align:-10,happy:-6,f:jbPerf(25)}}]},
  {l:T('Talk to him instead','跟他聊'),out:[{w:s=>s.smarts/30,t:T('You share a jug of wine and a lot of silence. He names nobody, but tells you where the stolen tax silver is. Your superior is satisfied.','你们分了一壶酒，长久地沉默。他一个人也没供，却告诉你被劫的税银藏在哪。上司很满意。'),c:'good',fx:{f:jbPerf(20),smarts:1}},{w:1,t:T('He says nothing. Your superior does the job himself, and notes your softness.','他一言不发。上司亲自动了手，还记下了你的心软。'),c:'muted',fx:{f:jbPerf(-15)}}]},
  {l:T('Help him escape','放他走'),out:[{w:1,t:T('The cell is empty by morning. Nobody suspects you. Somewhere, a swordsman owes you his life.','天亮时牢房空了，没人怀疑你。江湖上有个剑客欠了你一条命。'),c:'gold',fx:{align:8,meet:'friend',bond:80}},{w:1,t:T('You are caught on the stairs.','你在台阶上被逮住了。'),c:'bad',fx:{align:6,jail:3}}]}]});

/* ====================== opportunities ====================== */
I({id:'og_buyagency',age:[18,90],only:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:8,age:65,sex:'m'});c.nm=pick(ORG_NAMES.escort);return c},
 text:c=>T(`Old ${c.npc.en} wants to sell the ${c.nm[0]} Escort Agency: two carts, one lame horse, two loyal escorts, and a banner with a hole in it. 250 taels, and it is yours.`,`老镖头${c.npc.zh}要盘出${c.nm[1]}镖局：两辆车，一匹瘸马，两个忠心的镖师，一面破了个洞的镖旗。二百五十两就归你。`),
 opts:[{l:T('Buy it (250 taels)','盘下来（二百五十两）'),cost:250,if:s=>!s.org,out:[{t:c=>T(`You hang the patched banner of the ${c.nm[0]} Escort Agency back over the gate. The two escorts bow. The horse does not.`,`你把补好的${c.nm[1]}镖局旗重新挂上门楼。两个镖师躬身行礼，马没理你。`),c:'gold',
   fx:{f:(s,c)=>{if(s.org)return;const name=T(`${c.nm[0]} Escort Agency`,`${c.nm[1]}镖局`);s.org={type:'escort',name,evil:false,age0:s.age,members:2,rep:8,lv:1};if(s.job==='escort')s.job=null;deed(s,`Took over ${name.en}`,`盘下${name.zh}`)}}}]},
  {l:T('Haggle him down','砍价'),if:s=>!s.org&&s.money>=150,out:[{w:1,t:T('He sighs and takes 150. “It was my father’s. Treat it well.”','他叹口气收了一百五十两。“这是我爹传下来的，好生待它。”'),c:'gold',
   fx:{money:-150,f:(s,c)=>{if(s.org)return;const name=T(`${c.nm[0]} Escort Agency`,`${c.nm[1]}镖局`);s.org={type:'escort',name,evil:false,age0:s.age,members:2,rep:5,lv:1};if(s.job==='escort')s.job=null;deed(s,`Took over ${name.en}`,`盘下${name.zh}`)}}},{w:1,t:T('He is insulted and sells it to a pawnbroker the next day.','他觉得受了侮辱，第二天就卖给了当铺老板。'),c:'muted'}]},
  {l:T('Pass','算了'),out:[{t:T('The banner comes down for good a month later.','一个月后，那面旗彻底摘了。'),c:'muted'}]}]});
addOpp({id:'og_o_agency',ap:1,age:[20,70],if:s=>!s.org&&power(s)>=30&&s.money>=150,n:T('A failing escort agency is for sale','有家破落镖局要盘出'),d:T('Cheap, shabby, and yours if you want it.','便宜、破旧，你要就归你。'),run(s){runIncident(s,INC_BY.og_buyagency)}});

I({id:'og_mountainhall',age:[25,95],only:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:2,age:82,sex:'m'});const ev=s.align<=-30;c.nm=pick(ev?ORG_NAMES.evil:ORG_NAMES.sect);c.nx=pick(ev?ORG_NAMES.evilx:ORG_NAMES.sectx);return c},
 text:c=>T(`${c.npc.en}, a retired sect master, has watched you for years. “My disciples are old and my hall is empty. Take the ${c.nm[0]} ${c.nx[0]}. Make it live again.”`,`归隐的老掌门${c.npc.zh}留意你多年了。“我的弟子都老了，山堂空了。把${c.nm[1]}${c.nx[1]}接过去吧，让它重新热闹起来。”`),
 opts:[{l:T('Accept the hall','接下山堂'),if:s=>!s.org,out:[{t:c=>T(`You kneel and take the old master’s seal. ${c.npc.en} walks down the mountain lighter than you have ever seen a man walk.`,`你跪下接过老掌门的印信。${c.npc.zh}下山时，步子轻得你从没见过。`),c:'gold',
   fx:{fame:4,f:(s,c)=>{if(s.org)return;if(s.sect){const m=masterOf(s);if(m)addBond(m,-20);leaveSect(s)}const name=T(`${c.nm[0]} ${c.nx[0]}`,c.nm[1]+c.nx[1]);s.org={type:'sect',name,evil:s.align<=-30,age0:s.age,members:4,rep:30,lv:2};deed(s,`Inherited ${name.en} (${name.zh}) from its old master`,`承接老掌门衣钵，执掌${name.zh}`)}}}]},
  {l:T('Refuse humbly','谦辞'),out:[{t:T('He nods. “Humility is a good start. Too bad.” He gives the hall to a temple.','他点点头。“谦逊是好开头，可惜了。”他把山堂捐给了寺庙。'),c:'muted',fx:{align:2}}]}]});
addOpp({id:'og_o_hall',ap:1,age:[25,80],if:s=>!s.org&&power(s)>=85&&s.fame>=15,n:T('A retired master offers you his mountain hall','老掌门要把山堂传给你'),d:T('A sect of your own, already built. You would leave your current sect.','现成的门派。你得脱离现在的师门。'),run(s){runIncident(s,INC_BY.og_mountainhall)}});

I({id:'og_guild',age:[18,90],only:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:55});return c},
 text:c=>T(`${c.npc.en} of the Huizhou merchant guild is looking for partners with silver and a strong arm. A share costs 300 taels.`,`徽州商帮的${c.npc.zh}在找既有银子又有拳头的合伙人。一股三百两。`),
 opts:[{l:T('Buy a share (300 taels)','入一股（三百两）'),cost:300,out:[{w:2,t:T('Salt, tea and silk move under the guild’s seal. Your share returns double within the year.','盐、茶、丝在商帮的印下流转。一年之内，你那一股翻了一倍。'),c:'gold',fx:{money:620,smarts:1,meet:'acq',bond:55}},
   {w:1,t:(c,s)=>s.org?T('The guild hires your house for every run. Your people are never idle.','商帮的买卖全交给你的门户去办，你的人一刻也闲不下来。'):T('The guild teaches you to read a ledger like a battlefield. You come out ahead.','商帮教你把账本当战场来看。你小赚了一笔。'),c:'good',fx:{money:400,f:OG(6,1)}},
   {w:1,t:T('A ship sinks off Ningbo with the guild’s goods. Your share sinks with it.','一艘装着商帮货物的船在宁波外海沉了。你那一股也跟着沉了。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Offer your protection instead of silver','以护卫入股，不出银子'),if:s=>power(s)>=60,fight:FG(PW(1.0,6),'injury',T('Guarding the guild’s convoy','护送商帮货队'),T('pirates on the coast road','沿海的海盗'),()=>T('Black Tide pirates','黑潮帮海盗')),
   win:[{t:T('You beat off pirates on the coast road. The guild gives you a share for nothing.','你在海边路上打退了海盗。商帮白送了你一股。'),c:'gold',fx:{money:300,fame:2}}],lose:[{t:T('The convoy is lost. The guild is polite, and cold.','货队丢了。商帮客客气气，冷冰冰的。'),c:'bad'}]},
  {l:T('Not for you','不感兴趣'),out:[{t:T('Merchants, you think, are more dangerous than swordsmen.','你想：商人比剑客还危险。'),c:'muted'}]}]});
addOpp({id:'og_o_guild',ap:1,age:[20,80],if:s=>s.money>=200,n:T('A merchant guild seeks partners','商帮招合伙人'),d:T('Silver or a strong arm buys a share.','出银子或出力气都能入股。'),run(s){runIncident(s,INC_BY.og_guild)}});

I({id:'og_martialhall',age:[20,90],only:1,ctx:ogC({occ:19,age:70}),
 text:c=>T(`The town’s old martial hall is for sale: a yard, a rack of rusty spears, and a sign that says “Invincible Under Heaven”. ${c.npc.en} wants 400 taels.`,`镇上的老武馆要卖了：一个院子，一架生锈的长枪，一块写着“天下无敌”的牌匾。${c.npc.zh}要四百两。`),
 opts:[{l:T('Buy it and teach (400 taels)','买下来开馆授徒（四百两）'),cost:400,if:s=>power(s)>=60,out:[{t:T('You repaint the sign to say something more modest. Students come anyway. You are now a Hall Master.','你把牌匾改成了谦虚些的字。学生照样来了。你成了武馆馆主。'),c:'gold',fx:{fame:2,f:s=>{s.job='instructor';s.jobLv=1;s.jobYears=0;s.perf=60}}}]},
  {l:T('Buy it for your house','买下来给自家门户'),cost:400,if:s=>!!s.org,out:[{t:c=>T(`It becomes the town branch of ${OGN(c).en}. Recruits walk in off the street.`,`它成了${OGN(c).zh}在镇上的分舵，路过的人就进来拜师。`),c:'gold',fx:{f:OG(6,3)}}]},
  {l:T('Walk on','走开'),out:[{t:T('A noodle shop opens there instead. The noodles are excellent.','后来那里开了家面馆，面很好吃。'),c:'muted'}]}]});
addOpp({id:'og_o_hall2',ap:1,age:[20,80],if:s=>s.money>=400&&(power(s)>=60||!!s.org),n:T('A martial hall is for sale','有座武馆要卖'),d:T('Become a Hall Master, or open a branch of your house.','当馆主，或给自家门户开个分舵。'),run(s){runIncident(s,INC_BY.og_martialhall)}});
