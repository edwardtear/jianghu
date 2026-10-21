/* 江湖一生 · the martial world: chances (机缘) and dangers of every size —
   caves and manuals, beasts and herbs, auctions, tournaments, spies, alliances, duels, hermits and long debts. */
'use strict';
const MWW=['wander'];
const mwHas=(s,id)=>s.items.some(x=>x.id===id);
const mwUse=(s,id)=>{const k=s.items.findIndex(x=>x.id===id);if(k>=0)s.items.splice(k,1)};
const mwST=k=>T(SECTS[k].en,SECTS[k].cn);
const mwGood=s=>Object.keys(SECTS).filter(k=>!SECTS[k].evil&&!SECTS[k].hidden&&k!==(s&&s.sect));
const mwBad=s=>Object.keys(SECTS).filter(k=>SECTS[k].evil&&k!==(s&&s.sect));
const mwLocalBad=s=>{const l=(typeof EVIL_SECTS!=='undefined'&&EVIL_SECTS[s.region])||[];const ok=l.filter(k=>SECTS[k]&&k!==s.sect);return ok.length?pick(ok):pick(mwBad(s))};
const mwMine=s=>s.sect&&SECTS[s.sect]?mwST(s.sect):T('your sect','本门');
const mwExile=s=>{const r=pick(REGIONS.filter(x=>x.id!==s.region));s.region=r.id;(s.trail=s.trail||[]).push(r.id);if(s.job&&!['assassin','official'].includes(s.job))s.job=null;
  say(s,`You make a new start in ${r.en}.`,`你在${r.cn}重新落脚。`,'muted')};
const mwItN=id=>ITEMS[id].n;

/* ======================================================================
   SMALL
   ====================================================================== */

/* beasts guarding rare herbs */
I({id:'mw_herbbeast',age:[16,70],cd:10,w:1,tags:MWW,when:s=>power(s)>=12,
 ctx:s=>{const c=scene();const r=s.region;
  c.herb=['west','north'].includes(r)?T('a snow lotus','一朵雪莲'):['shu','miao'].includes(r)?T('a blood-red lingzhi','一株血灵芝'):T('a thousand-year ginseng','一支千年人参');
  c.beast=['west','north'].includes(r)?T('a snow leopard','一头雪豹'):['shu','miao','jiangnan'].includes(r)?T('a python as thick as your thigh','一条大腿粗的巨蟒'):T('a black bear','一头黑熊');
  c.lv=PW(.95,1)(s);return c},
 text:c=>T(`On a ledge above a gorge you see ${c.herb.en}, the kind of thing a pharmacy would weigh against gold. Right beneath it lies ${c.beast.en}, half asleep and fully aware of you.`,`峡谷上方的一块岩台上，长着${c.herb.zh}，药铺里拿金子都换不来的东西。底下趴着${c.beast.zh}，似睡非睡，早就察觉到了你。`),
 opts:[{l:T('Fight the beast for it','和猛兽抢'),fight:FG((s,c)=>c.lv,'injury',T('The herb on the ledge','岩台夺药'),T('a beast guarding a herb','护药的猛兽'),c=>c.beast,true),
   win:[{w:2,t:c=>T(`The beast limps off. You wrap ${c.herb.en} in your shirt and eat it that night over a small fire. Warmth runs down every meridian.`,`猛兽一瘸一拐地走了。你用衣服包好${c.herb.zh}，当晚就着篝火吃了下去。一股暖流顺着经脉走遍全身。`),c:'gold',fx:{qi:[2,4],maxHealth:2}},
    {w:s=>s.smarts/40,t:T('You sell it in the next town to a pharmacist whose hands shake as he counts out the silver.','你在下一个镇子把它卖给了药铺掌柜。他数银子的手都在抖。'),c:'gold',fx:{money:[150,260]}}],
   lose:[{w:2,t:T('Claws open your arm to the bone. You crawl down the gorge with nothing but the wound.','一爪子把你胳膊抓得见了骨头。你两手空空地爬下了峡谷，只落下一身伤。'),c:'bad',fx:{f:s=>addCond(s,'wound',1)}},
    {w:s=>s.t.luck*.2,t:T('You lose the fight, but as you fall back a leaf of it comes away in your fist. Chewed, it stops the bleeding.','你打输了，可后退时手里攥下了一片叶子。嚼碎敷上，血竟止住了。'),c:'muted',fx:{qi:1,heal:10}}]},
  {l:T('Wait for it to sleep properly','等它睡熟'),out:[{w:s=>s.t.luck*.25+s.t.wit*.1,t:c=>T(`Near dawn its breathing slows. You climb past it with your heart in your mouth, and come away with ${c.herb.en}.`,`快天亮时它的鼻息沉了下去。你提心吊胆地从它身边爬过去，摘到了${c.herb.zh}。`),c:'good',fx:{qi:[2,3],heal:20}},
    {w:1.5,t:T('A pebble rolls. It wakes, and you leave the ledge much faster than you climbed it.','一颗石子滚了下去。它醒了，你下山的速度比上山快得多。'),c:'bad',fx:{hurt:[6,14],cause:T('a fall from a cliff ledge','从岩台上摔下')}}]},
  {l:T('Leave it be','由它去'),out:[{w:2,t:T('Some things are guarded for a reason. You go on your way.','有些东西被守着，是有缘故的。你接着赶路。'),c:'muted'},
    {w:s=>s.t.heart*.12,t:T('An old herb-gatherer you meet on the trail thanks you for leaving it. “It feeds the whole mountain,” he says, and gives you a pinch of something bitter.','山路上碰到个采药的老人，听说后谢了你："它养着一整座山呢。"说着塞给你一撮发苦的草药。'),c:'good',fx:{heal:15,happy:2}}]}]});

/* a cup of tea that smells wrong */
I({id:'mw_poisoncup',age:[16,75],cd:10,w:1,tags:['wander','town'],when:s=>power(s)>=15||s.fame>=15,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([6,17,23,26]),age:rint(25,55),lv:PW(.9,1)(s)});return c},
 text:c=>T(`At ${c.place.en}, ${c.npc.desc.en} named ${c.npc.en} brings your tea and lingers a moment too long. The tea smells faintly of bitter almonds.`,`在${c.place.zh}，一个叫${c.npc.zh}的${c.npc.desc.zh}给你端来了茶，站着不走，多待了那么一会儿。茶里隐隐有股苦杏仁味。`),
 opts:[{l:T('Pour it out quietly and watch','悄悄倒掉，暗中观察'),out:[{w:s=>s.smarts/25+s.t.wit*.1,t:c=>T(`When you do not fall over, ${c.npc.en} goes pale and runs, leaving behind a pouch of iron pellets. Somebody paid for your death, and did not pay much.`,`见你迟迟不倒，${c.npc.zh}脸色煞白，扭头就跑，落下一袋飞蝗石。有人买你的命，出价还不高。`),c:'good',fx:{item:'darts',fame:1}},
    {w:1,t:T('Nobody moves. Perhaps it was only bad tea. You go thirsty and suspicious all evening.','谁也没动。也许只是茶不好。你渴着肚子疑神疑鬼了一晚上。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Drink it. It’s probably nothing','喝。多半没事'),out:[{w:2,t:T('It is not nothing. Your stomach knots and your lips go numb. You live, but something stays in the blood.','有事。你肚子绞痛，嘴唇发麻。命是保住了，可毒还留在血里。'),c:'bad',fx:{hurt:[5,12],cause:T('poisoned tea','一杯毒茶'),f:s=>addCond(s,'poison',1)}},
    {w:s=>s.qi/25,t:T('Your inner energy rises on its own and drives the poison out through your fingertips in black drops. You feel stronger for it, oddly.','体内真气自行运转，把毒从指尖逼了出来，滴下几滴黑水。奇怪的是，你反倒觉得内力精进了些。'),c:'good',fx:{qi:1}}]},
  {l:T('Take an antidote first, then drink','先服解毒丹，再喝'),if:s=>mwHas(s,'antidote'),out:[{w:3,t:c=>T(`You drink and smile. When ${c.npc.en} comes back to check, you catch ${c.npc.him} by the wrist. ${c.npc.He} names a rival before you have even asked.`,`你喝了，还笑了笑。${c.npc.zh}回来查看时，被你一把扣住手腕。不等你问，${c.npc.ta}就把主使的名字供了出来。`),c:'good',fx:{f:s=>mwUse(s,'antidote'),fame:2,align:2}},
    {w:1,t:T('Wrong poison, wrong antidote. You are ill for a month.','毒不对路，解药也就不对路。你病了一个月。'),c:'bad',fx:{f:s=>{mwUse(s,'antidote');addCond(s,'poison',1)}}}]},
  {l:T('Swap cups with the next table','跟邻桌换个杯子'),out:[{w:1,t:T('A man at the next table drinks and folds up on the floor. You did not know him. You leave before anyone asks.','邻桌一个汉子喝了一口，就软倒在地。你不认识他。没等人问，你就走了。'),c:'bad',fx:{align:-5}},
    {w:s=>s.t.luck*.15,t:T('The man at the next table drinks, belches, and laughs. “Almond poison? Child’s stuff.” He is a poison-master himself, and gives you an antidote for the joke.','邻桌那人喝了，打了个嗝，哈哈大笑："苦杏仁毒？小孩子的玩意儿。"原来他自己就是个用毒的行家，冲这个笑话送了你一颗解毒丹。'),c:'good',fx:{item:'antidote',align:-1}}]}]});

/* the heir of a rival sect */
I({id:'mw_heir',age:[15,45],cd:8,w:1.2,tags:MWW,when:s=>!!s.sect&&power(s)>=12,
 ctx:s=>{const c=scene();c.k=pick(mwGood(s));c.npc=npc(s,{occ:11,age:rint(18,28),lv:PW(1,1)(s)});return c},
 text:(c,s)=>T(`${c.npc.en}, heir to the master of ${SECTS[c.k].en}, blocks your way in the market. “I hear ${SECTS[s.sect].en} teaches its people to run. Show me.”`,`${SZ(c.k)}掌门的独子${c.npc.zh}在集市上拦住了你。“听说${SZ(s.sect)}教出来的人只会跑。跑给我看看。”`),
 opts:[{l:T('Accept the bout','接下这一场'),fight:FG((s,c)=>c.npc.lv,'light',T('The heir’s challenge','少主挑战'),T('a young master’s challenge','少主挑衅')),
   win:[{w:2,t:c=>T(`${c.npc.en} lands on the fish stall. The crowd will tell this story for a month, and your elders hear it.`,`${c.npc.zh}一屁股坐进了鱼摊。围观的人能把这事说上一个月，门里的长辈也听说了。`),c:'good',fx:{fame:3,merit:3}},
    {w:s=>s.t.heart*.15,t:c=>T(`${c.npc.en} gets up laughing, bows properly, and buys you wine. Heirs are lonely; you are the first person who did not let ${c.npc.him} win.`,`${c.npc.zh}爬起来哈哈一笑，规规矩矩行了个礼，请你喝酒。少主们大多寂寞，你是头一个不肯让着${c.npc.ta}的人。`),c:'good',fx:{fame:2,meet:'friend',bond:60}}],
   lose:[{w:2,t:T('You end up in the fish stall. The story travels just as fast the other way.','坐进鱼摊的是你。这故事反着传，也一样快。'),c:'bad',fx:{fame:-2,happy:-4}},
    {w:1,t:c=>T(`${c.npc.en} wins and does not gloat. “Next year, again.” You have a rival now.`,`${c.npc.zh}赢了，却没有得意。“明年，再来。”你多了个对头。`),c:'muted',fx:{meet:'rival',bond:35}}]},
  {l:T('Turn it aside with a joke','一句玩笑带过'),out:[{w:s=>s.smarts/25+s.fame/40,t:T('“We don’t run. We just walk away from children.” The crowd laughs with you, and the heir goes red to the ears.','“我们不跑，我们只是不跟小孩一般见识。”众人跟着你笑，那少主红到了耳根。'),c:'good',fx:{fame:2}},
    {w:1.5,t:T('The joke falls flat. Someone in the crowd shouts “Coward!” and it sticks for a while.','玩笑没人笑。人群里有人喊了声“孬种”，这名号跟了你好一阵子。'),c:'bad',fx:{fame:-2,merit:-1}}]},
  {l:T('Walk past without a word','一言不发走过去'),out:[{w:2,t:T('You walk on. It itches for days.','你走了。心里痒痒了好几天。'),c:'muted',fx:{happy:-2}},
    {w:s=>s.t.heart*.15,t:c=>T(`A week later an elder of ${SECTS[c.k].en} sends a letter apologising for the boy. Your own elders are pleased with your restraint.`,`一个礼拜后，${SZ(c.k)}的长老来信替那孩子赔不是。门里的长辈都夸你沉得住气。`),c:'good',fx:{fame:1,merit:3}}]}]});

/* an old manual written in code */
I({id:'mw_cipher',age:[14,80],cd:15,w:1,tags:['wander','town'],
 ctx:s=>{const c=scene();c.art=pick(['swallow','knives','bagua','vajra','eagle'].filter(k=>ARTS[k]));c.npc=npc(s,{occ:pick([1,17,24]),age:rint(40,70)});return c},
 text:c=>T(`A bookstall at ${c.place.en} has a battered volume of nonsense: numbers, weather notes and bad poems about cranes. The seller swears it is a martial manual in code. He wants thirty taels.`,`${c.place.zh}的书摊上有本破册子，写满了胡话：一串串数字、天气记录，还有些写仙鹤的歪诗。摊主赌咒说这是用暗语写的武功秘籍，要价三十两。`),
 opts:[{l:T('Buy it and try to crack it','买下来，慢慢破解'),cost:30,out:[{w:s=>s.smarts/22+s.t.wit*.15,t:T('By the end of winter the cranes are stances and the numbers are breaths. You can do three of the moves already.','一个冬天下来，仙鹤成了招式，数字成了呼吸。其中三招你已经会了。'),c:'good',fx:{skill:[2,3],smarts:2}},
    {w:s=>s.t.wit*.05,t:c=>T(`The last poem unlocks all the others. It is ${ARTS[c.art].n}, whole and clear, hidden in plain sight.`,`最后一首诗一通，前面全通了。原来是一整套${ARTS[c.art].cn}，就明明白白藏在纸面上。`),c:'gold',fx:(s,c)=>({art:c.art,smarts:2})},
    {w:1.5,t:T('You crack it at last. It is a cookbook, in code, by a very paranoid cook. The fish recipe is excellent.','总算破解了。是本菜谱，出自一个疑心极重的厨子之手，用暗语写的。那道鱼做得真不错。'),c:'muted',fx:{happy:3,smarts:1}}]},
  {l:T('Read it at the stall while you haggle','边讲价边偷看'),out:[{w:s=>s.smarts/30,t:T('You memorise a page while arguing about the price. It turns out to be a breathing exercise, and a good one.','你一边砍价一边背下了一页。原来是一段吐纳法门，还挺管用。'),c:'good',fx:{qi:1,smarts:1}},
    {w:1.5,t:T('He snatches it back. “Reading is buying.” You leave with nothing but a scolding.','他一把夺了回去。“看了就得买。”你挨了顿数落，什么也没带走。'),c:'muted'}]},
  {l:T('Pass','不买'),out:[{w:2,t:T('There is a fool born every day, and you decide it will not be you.','天天都有冤大头，你决定今天不当。'),c:'muted'},
    {w:1,t:T('Months later you hear a student cracked a coded manual bought for thirty taels at that very stall. You think about it more than you would like.','几个月后听说，有个书生在那个摊子上花三十两买了本暗语秘籍，还真破解了。你想这事想得比自己愿意的多。'),c:'muted',fx:{happy:-2}}]}]});

/* a duel at dawn: the loser leaves the region */
I({id:'mw_dawnduel',age:[18,60],cd:12,w:1,tags:MWW,when:s=>power(s)>=20,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([13,14,8,28]),age:rint(25,45),lv:PW(1,1)(s)});return c},
 text:(c,s)=>T(`A spilled cup at an inn turns into words, and the words turn cold. ${c.npc.en} sets down a coin. “The old rule, then. Dawn, by the river. Whoever loses leaves ${region(s).en} and never comes back.”`,`客栈里洒了一杯酒，吵着吵着，话就冷了。${c.npc.zh}拍下一枚铜钱：“那就按老规矩。明早天亮，河边见。输的人离开${region(s).cn}，永不回来。”`),
 opts:[{l:T('Be at the river at dawn','天亮去河边'),fight:FG((s,c)=>c.npc.lv,'injury',T('A duel at dawn','黎明之约'),T('a duel at dawn','黎明决斗')),
   win:[{w:2,t:c=>T(`${c.npc.en} picks up ${c.npc.his} sword, bows, and walks east without looking back. The innkeeper tells everyone.`,`${c.npc.zh}拾起剑，躬身一礼，头也不回地往东去了。掌柜的逢人便讲。`),c:'good',fx:{fame:3}},
    {w:s=>s.t.heart*.12,t:c=>T(`${c.npc.en} keeps the bargain with a strange dignity. Years later a letter arrives from far away: ${c.npc.he} has a school there now, and thanks you for the push.`,`${c.npc.zh}守约守得有几分体面。多年后从远方寄来一封信：${c.npc.ta}在那边开了武馆，还谢你当年推了一把。`),c:'good',fx:{fame:3,meet:'acq',bond:55}}],
   lose:[{w:s=>s.align>=0?2.5:1,t:T('You keep your word. You pack before noon and leave, and the river is the last thing you look at.','你守了约。不到晌午就收拾好行李走了，最后看了一眼那条河。'),c:'bad',fx:{fame:1,happy:-5,f:mwExile}},
    {w:s=>s.align<0?2.5:1,t:T('You do not leave. Everyone knows. People stop shaking your hand.','你没走。人人都知道。从此没人跟你拱手了。'),c:'bad',fx:{fame:-5,align:-3}}]},
  {l:T('Apologise before it goes that far','趁早赔个不是'),out:[{w:s=>s.smarts/30+s.t.heart*.1,t:c=>T(`You buy the next jug and admit the cup was yours. ${c.npc.en} stares, then laughs. You drink until the inn closes.`,`你叫了下一壶酒，认了那杯是你洒的。${c.npc.zh}愣了愣，大笑起来。你们一直喝到客栈打烊。`),c:'good',fx:{meet:'friend',bond:55}},
    {w:1,t:c=>T(`${c.npc.en} spits on the floor. “I thought so.” The inn decides you are a coward.`,`${c.npc.zh}往地上啐了一口：“我就知道。”一屋子人都认定你是个怂包。`),c:'bad',fx:{fame:-2}}]},
  {l:T('Slip away before dawn','天不亮就溜'),out:[{w:2,t:T('You are gone by the fourth watch. The story of the one who ran is told with relish.','四更天你就走了。临阵脱逃的故事，被人讲得津津有味。'),c:'bad',fx:{fame:-3}},
    {w:s=>s.t.luck*.12,t:c=>T(`On the road out of town you meet ${c.npc.en}, also leaving, also early. You look at each other for a long moment and walk off in opposite directions.`,`出镇的路上，你撞见了${c.npc.zh}——也在走，也起了个大早。两人对视了好一会儿，各自往相反的方向去了。`),c:'muted',fx:{happy:3}}]}]});

/* a sword-casting contest */
I({id:'mw_swordcast',age:[14,75],cd:12,w:1,tags:['wander','town'],
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:25,sex:'m',age:rint(60,78)});return c},
 text:c=>T(`The smiths of three counties hold a sword-casting contest in a river town. Twenty furnaces roar at once. The favourite is a young smith with rich patrons; the quiet one is an old man called ${c.npc.en} who has not said a word all day.`,`三个县的铁匠在一座河镇上比铸剑。二十座炉子一齐呼呼地烧。大热门是个有阔东家撑腰的年轻铁匠；冷门是个叫${c.npc.zh}的老头，一整天没说过一句话。`),
 opts:[{l:T('Bet on the old man','押那个老头'),cost:20,out:[{w:s=>s.t.luck*.2+s.smarts/60,t:T('His blade cuts a hanging silk scarf in two. The favourite’s does not. You collect four times your stake.','他的剑把一条悬着的丝巾一挥两断，热门那口剑却不行。你赢了四倍的注。'),c:'good',fx:{money:80}},
    {w:1.2,t:T('He is very old, and he was very drunk. His blade cracks in the quench.','他太老了，而且喝得太多。剑在淬火时裂了。'),c:'bad'}]},
  {l:T('Volunteer to test the blades','自告奋勇试剑'),out:[{w:s=>power(s)/40,t:c=>T(`You cut through a bundle of reeds, a pig carcass and an iron bar. ${c.npc.en} wins, and gives you the blade you tested for him.`,`你一剑劈开一捆芦苇、半扇猪、一根铁条。${c.npc.zh}赢了，把你替他试的那口剑送了你。`),c:'gold',fx:{item:'steelsword',fame:2}},
    {w:1,t:T('A bad blade shatters in your hand. A sliver opens your palm.','一口次剑在你手里炸开了。一块碎片划开了你的手掌。'),c:'bad',fx:{hurt:[3,8],cause:T('a shattering blade','崩裂的剑'),f:s=>{if(chance(.5))addCond(s,'wound',1)}}}]},
  {l:T('Buy a runner-up’s blade cheaply','低价买一口落选的剑'),cost:60,out:[{w:s=>s.smarts/30,t:T('You pick the one the judges misjudged. It is better steel than anything in the market.','你挑中了评判看走眼的那一口。比市面上哪口剑都好。'),c:'good',fx:{item:'steelsword'}},
    {w:1.5,t:T('It is a decent iron sword. Exactly what you paid for.','一口还过得去的铁剑。一分钱一分货。'),c:'muted',fx:{item:'ironsword'}}]}]});

/* a gang that charges a toll for martial folk */
I({id:'mw_bridge',age:[16,70],cd:10,w:1,tags:MWW,when:s=>power(s)>=10,
 ctx:s=>{const c=scene();c.k=mwLocalBad(s);c.lv=PW(.9,1)(s);return c},
 text:c=>T(`Four toughs from ${SECTS[c.k].en} have strung a rope across a mountain bridge. “Anyone carrying a weapon pays the martial toll. Ten taels.”`,`四个${SZ(c.k)}的混混在山间一座桥上拉了根绳子。“带家伙的，交武林过路钱。十两。”`),
 opts:[{l:T('Pay the toll','交钱'),cost:10,out:[{w:2,t:T('You pay. They wave you through like a pig to market.','你交了。他们像赶猪进集似的挥手放你过去。'),c:'muted'},
    {w:s=>s.fame/30,t:T('The leader looks at you twice, goes pale, and hands the silver back with a bow. “Didn’t recognise you, hero.”','领头的看了你两眼，脸一白，躬身把银子还了回来。“有眼不识泰山，大侠请。”'),c:'good',fx:{money:10,fame:1}}]},
  {l:T('Cut the rope','砍断绳子'),fight:FG((s,c)=>c.lv,'light',T('The toll bridge','断桥收钱'),T('bridge toughs','桥头混混'),()=>T('the toll gang','收钱的混混')),
   win:[{w:2,t:T('One goes in the river. The other three decide the toll is waived today. The farmers queued behind you cheer.','一个掉进了河里，另外三个当即决定今天免收。你身后排队的农夫们一阵叫好。'),c:'good',fx:{fame:2,align:2}},
    {w:1,t:T('You win, and the leader swears his elder will hear of this. Probably he will.','你赢了。领头的发誓要禀报他家长老。大概真会。'),c:'muted',fx:{fame:2,align:1,enemy:1}}],
   lose:[{w:2,t:T('They take the toll, and your purse, and throw your sandals in the river for luck.','他们收了过路钱，连钱袋也拿了，还把你的鞋扔进河里图个吉利。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,rint(10,40))),happy:-3}},
    {w:1,t:T('They beat you and let you cross for free, which is somehow worse.','他们把你揍了一顿，倒是免费放你过去了。这比交钱还难受。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Take the long way round','绕远路'),out:[{w:1.5,t:T('It costs you a week of mountain paths and a sprained ankle.','多走了一个礼拜的山路，还扭了脚。'),c:'muted',fx:{happy:-2,hurt:[2,4],cause:T('a mountain path','山路')}},
    {w:s=>s.t.luck*.15,t:T('The long way passes a spring so cold it makes your teeth ache. You sit by it for an afternoon and leave feeling clear inside.','绕远路经过一眼冰得牙疼的泉水。你在那儿坐了一下午，走的时候只觉浑身通透。'),c:'good',fx:{qi:1,happy:2}}]}]});

/* ======================================================================
   MEDIUM
   ====================================================================== */

/* a famous blade at auction */
I({id:'mw_auction',age:[18,80],cd:15,w:1,tags:['wander','town'],when:s=>s.money>=150||s.fame>=25,
 ctx:s=>{const c=scene();c.it=pick(['coldsaber','heavysword','brush','twinhooks']);c.k=pick(mwGood(s));c.lv=PW(1,2)(s);return c},
 text:c=>T(`At ${c.place.en}, a dead general’s ${mwItN(c.it).en} goes under the hammer. The bidders are an elder of ${SECTS[c.k].en}, a salt merchant with rings on every finger, and a woman in a veil who has not lifted her paddle once.`,`${c.place.zh}拍卖一位亡故将军的${mwItN(c.it).zh}。竞价的有${SZ(c.k)}的一位长老、一个十个指头戴满戒指的盐商，还有个戴面纱的女人，一次牌子都没举过。`),
 opts:[{l:T('Bid (400 taels)','出价（四百两）'),cost:400,out:[{w:s=>1+s.fame/40,t:c=>T(`The hall goes quiet at your number. The elder nods to you, the merchant curses, and the ${mwItN(c.it).en} is yours.`,`你一报价，满堂鸦雀无声。长老冲你点了点头，盐商骂了一句，${mwItN(c.it).zh}归你了。`),c:'gold',fx:(s,c)=>({item:c.it,fame:2})},
    {w:1.3,t:T('The merchant doubles you without blinking. Your silver comes back, minus the house’s fee for the excitement.','盐商眼都不眨就翻了一倍。你的银子退了回来，被拍卖行扣了一笔“茶水钱”。'),c:'muted',fx:{money:370}}]},
  {l:T('Watch who wins, then follow','看谁拍走，跟上去'),out:[{w:s=>s.smarts/25+.6,t:T('The elder wins. The veiled woman slips out a moment before he does. You slip out a moment after her.','长老拍得了。蒙面女人比他早一步出了门。你比她晚一步。'),c:'muted',next:'mw_auction2',keep:1},
    {w:1,t:T('You lose them all in the crowd outside. Somebody steps on your foot and apologises beautifully.','门外人山人海，你把他们全跟丢了。有人踩了你一脚，赔礼赔得很漂亮。'),c:'muted'}]},
  {l:T('Just watch','只看热闹'),out:[{w:2,t:T('You learn more about steel in an afternoon of listening to rich men lie than in a year at the forge.','听了一下午阔佬吹牛，你对兵刃的见识比在铁匠铺干一年还长。'),c:'muted',fx:{smarts:1}},
    {w:s=>s.t.luck*.1,t:T('In the confusion a minor lot is left unclaimed. The auctioneer, eager to close, lets you have it for a song: a heart-guarding mirror.','乱哄哄中有件小拍品没人要。拍卖师急着收场，几乎白送给了你：一面护心镜。'),c:'good',fx:{item:'mirror'}}]}]});
I({id:'mw_auction2',only:1,noThread:1,
 text:c=>T(`In an alley behind the hall, the veiled woman and two men in black stop the elder of ${SECTS[c.k].en}. The blade is on his back. Nobody has seen you yet.`,`拍卖行后巷，蒙面女人和两个黑衣人截住了${SZ(c.k)}的长老。那口兵刃就背在他身上。还没人发现你。`),
 opts:[{l:T('Help the elder','帮长老'),fight:FG((s,c)=>c.lv,'injury',T('The alley behind the auction','拍卖行后巷'),T('robbers in an alley','后巷劫匪'),()=>T('the veiled woman','蒙面女人')),
   win:[{w:2,t:c=>T(`The robbers scatter. The elder presses a heavy purse on you and tells ${SECTS[c.k].en} your name.`,`劫匪四散。长老硬塞给你一袋沉甸甸的银子，还把你的名字报给了${SZ(c.k)}。`),c:'good',fx:{money:120,fame:3,align:3}},
    {w:s=>s.t.luck*.08,t:c=>T(`“A blade should go to the hand that saved it,” the old man says, and will not take no. The ${mwItN(c.it).en} is yours.`,`“兵刃该归救下它的人。”老人说着，执意不肯收回。${mwItN(c.it).zh}归了你。`),c:'gold',fx:(s,c)=>({item:c.it,fame:3,align:3})}],
   lose:[{w:2,t:T('A blade in the dark finds your side. The robbers vanish with the prize. The elder drags you to a doctor himself.','黑暗中一刀捅进你的腰侧。劫匪带着宝贝跑了。长老亲自把你拖去看了大夫。'),c:'bad',fx:{f:s=>addCond(s,'wound',1),align:2}},
    {w:1,t:T('You lose, but you slow them long enough for the watch to come. Half a victory.','你输了，可拖住了他们，等来了巡夜的。也算赢了一半。'),c:'muted',fx:{fame:1,align:2}}]},
  {l:T('Let it happen','袖手旁观'),out:[{w:1.5,t:T('The veiled woman passes your hiding place on the way out and leaves a silver ingot on the ground for your silence.','蒙面女人出巷时经过你藏身的地方，在地上留了一锭银子，买你闭嘴。'),c:'muted',fx:{money:50,align:-2}},
    {w:1,t:T('In the morning the elder is found dead. You did not do anything, and that is exactly what you did.','第二天一早，长老被发现死了。你什么都没做——你做的正是这个。'),c:'bad',fx:{align:-4,happy:-4}}]},
  {l:T('Grab the blade in the confusion','趁乱夺刀'),out:[{w:s=>s.t.luck*.2+s.smarts/50,t:c=>T(`You come off the wall, snatch the ${mwItN(c.it).en} and are three streets away before either side understands. Now both of them are looking for you.`,`你从墙头扑下，一把抢走${mwItN(c.it).zh}，等两拨人回过神来你已经跑出三条街了。如今两拨人都在找你。`),c:'bad',fx:(s,c)=>({item:c.it,align:-6,wanted:1})},
    {w:1.5,t:T('Both sides stop fighting each other to deal with you. You get away with your life and a lot of bruises.','两拨人不打了，一起来收拾你。你捡回一条命，外加一身青紫。'),c:'bad',fx:{hurt:[10,20],cause:T('a brawl over a famous blade','争夺名刃的混战'),align:-2}}]}]});

/* a tournament between two named sects */
I({id:'mw_tourney',age:[14,60],cd:8,w:1.1,tags:MWW,when:s=>s.age>=16||!!s.sect,
 ctx:s=>{const c=scene();const g=Object.keys(SECTS).filter(k=>!SECTS[k].evil&&!SECTS[k].hidden);
  c.a=(s.sect&&!isEvil(s.sect)&&SECTS[s.sect]&&!SECTS[s.sect].hidden)?s.sect:pick(g);c.b=pick(g.filter(k=>k!==c.a));c.lv=PW(1,1)(s);return c},
 text:c=>T(`${SECTS[c.a].en} and ${SECTS[c.b].en} have argued for ten years over a mountain spring. This autumn they settle it with a tournament on a stage of pine planks, and half the province comes to watch.`,`${SZ(c.a)}和${SZ(c.b)}为了一眼山泉争了十年。今年秋天，两家搭起松木擂台比武定夺，半个省的人都来看热闹。`),
 opts:[{l:T('Fight for your sect','为本门出战'),if:(s,c)=>c.a===s.sect,fight:FG((s,c)=>c.lv,'light',T('The spring tournament','争泉擂台'),T('a sect tournament','门派比武'),c=>T(`a disciple of ${SECTS[c.b].en}`,`${SZ(c.b)}弟子`)),
   win:[{w:2,t:T('Your opponent goes off the end of the stage. Your elders stand up in their seats. The spring is yours, for another ten years.','对手从台边摔了下去。门里的长辈们在座位上站了起来。那眼泉，又归本门十年了。'),c:'gold',fx:{merit:6,fame:4}},
    {w:s=>s.fame/40,t:T('You win so cleanly that the other sect’s master asks your name, and remembers it.','你赢得干净利落，对方掌门特意问了你的名字，还记住了。'),c:'gold',fx:{merit:5,fame:6}}],
   lose:[{w:2,t:T('You lose your bout, and the tournament with it. Nobody says it was your fault. Nobody has to.','你输了这一场，整场比试也跟着输了。没人说是你的错，也用不着说。'),c:'bad',fx:{merit:1,happy:-4}},
    {w:s=>s.t.heart*.15,t:T('You lose, but you get up four times. Your master puts a hand on your shoulder on the walk home and says nothing, which is more than praise.','你输了，可你爬起来了四回。回去的路上师父按了按你的肩，什么也没说，这比夸你还强。'),c:'muted',fx:{merit:3}}]},
  {l:T('Enter the open bouts','报名打擂'),if:(s,c)=>c.a!==s.sect,fight:FG((s,c)=>c.lv,'light',T('The open bouts','擂台散打'),T('a tournament stage','擂台'),c=>T(`a disciple of ${SECTS[c.b].en}`,`${SZ(c.b)}弟子`)),
   win:[{w:2,t:T('An outsider beating sect disciples on their own stage is the best thing the crowd has seen all day.','外人在人家自己的擂台上打赢了门派弟子，这是看客们一整天最过瘾的一幕。'),c:'good',fx:{fame:5}},
    {w:1,t:c=>T(`Afterwards an elder of ${SECTS[c.a].en} asks, very politely, whether you have a master.`,`散场后，${SZ(c.a)}的一位长老客客气气地问你，可曾拜过师父。`),c:'good',fx:{fame:4,happy:3}}],
   lose:[{w:2,t:T('You last three exchanges. The crowd is kind about it, mostly.','你撑了三个回合。看客们大多还算厚道。'),c:'muted',fx:{fame:1}},
    {w:1,t:T('You are thrown into the front row, onto a fat man’s lunch.','你被扔下了台，正砸在前排一个胖子的午饭上。'),c:'bad',fx:{happy:-3,hurt:[2,5],cause:T('a tournament stage','擂台')}}]},
  {l:T('Bet on the outcome','押注'),cost:20,out:[{w:s=>s.smarts/30+s.t.luck*.1,t:T('You watched them warm up and picked right. Sixty taels.','你看了他们热身，押对了。赢六十两。'),c:'good',fx:{money:60}},
    {w:1.2,t:T('The favourite twists an ankle on the first step. So much for watching them warm up.','热门第一步就崴了脚。热身白看了。'),c:'bad'}]},
  {l:T('Watch closely and learn','细看偷师'),out:[{w:s=>s.t.root*.15+s.t.wit*.1,t:T('By the end of the day you have stolen a footwork pattern from one side and a feint from the other.','一天下来，你从这家偷了一套步法，从那家偷了一个虚招。'),c:'good',fx:{skill:[1,2]}},
    {w:1,t:T('A good day out. You eat too many sesame cakes.','热热闹闹玩了一天，芝麻饼吃多了。'),c:'muted',fx:{happy:3}}]}]});

/* a spy inside your sect */
I({id:'mw_spy',age:[15,65],cd:15,w:.6,tags:['chore'],when:s=>!!s.sect&&power(s)>=10,
 ctx:s=>{const c=scene();c.cul=rint(0,2);c.foe=isEvil(s.sect)?pick(mwGood(s)):mwLocalBad(s);c.lv=PW(1,1)(s);
  c.npc=npc(s,{occ:[26,13,21][c.cul],age:[50,35,17][c.cul],lv:c.lv});return c},
 text:(c,s)=>T(`Someone inside ${SECTS[s.sect].en} is selling secrets to ${SECTS[c.foe].en}: twice now, a party has walked into an ambush on a road only the sect knew. The elders suspect the cook, a quiet senior, and the newest disciple.`,`${SZ(s.sect)}里出了内鬼，把消息卖给了${SZ(c.foe)}：已经两回了，门里的人走在只有自家知道的路上，偏偏撞进了埋伏。长老们怀疑三个人：伙房的厨子、一个闷声不响的师兄、新来的小师弟。`),
 opts:[{l:T('Watch the manual room at night','夜里守着存放秘籍的屋子'),out:[{w:s=>s.smarts/25+s.t.wit*.1,t:T('On the fifth night a lamp moves where no lamp should be. You follow it.','第五天夜里，一盏灯在不该有灯的地方晃了晃。你跟了上去。'),c:'muted',next:'mw_spy2',keep:1},
    {w:1,t:T('Ten cold nights, nothing but a cat. You catch a chill.','守了十个冷夜，只等来一只猫。你着了凉。'),c:'muted',fx:{ill:'cold',merit:1}}]},
  {l:T('Point at the newcomer','指认新来的'),out:[{w:(s,c)=>c.cul===2?3:.6,t:T('His bedroll holds a copied map. He breaks down and confesses. The elders are pleased with you.','他铺盖卷里藏着一张抄的地图。他当场崩溃，全招了。长老们对你很满意。'),c:'good',fx:{merit:6}},
    {w:(s,c)=>c.cul===2?.5:2,t:T('He is punished and sent home in disgrace. A month later another ambush happens. He was only a boy who missed his mother.','他挨了罚，被灰溜溜赶回了家。一个月后又出了一回埋伏。他不过是个想娘的孩子。'),c:'bad',fx:{merit:-2,align:-3}}]},
  {l:T('Leave a false map where all three will see it','放一张假地图，让三人都看见'),out:[{w:s=>s.smarts/30+.3,t:c=>T(`${SECTS[c.foe].en} ambushes an empty valley. Only one of the three saw that particular map. The elders know who; you get the credit.`,`${SZ(c.foe)}在一条空山谷里扑了个空。那张地图三个人里只有一个看过。长老们心里有数，功劳记在你头上。`),c:'good',fx:{merit:8,fame:2}},
    {w:1,t:T('Nobody takes the bait. Perhaps the spy is cleverer than you.','没人上钩。也许内鬼比你聪明。'),c:'muted',fx:{merit:1}}]}]});
I({id:'mw_spy2',only:1,noThread:1,
 text:c=>T(`The lamp belongs to ${c.npc.en}, ${['the cook','the quiet senior','the newest disciple'][c.cul]}, copying the duty roster by its light. ${c.npc.He} sees you, and ${c.npc.his} hand goes to a knife.`,`提灯的是${c.npc.zh}——${['伙房的厨子','那个闷声不响的师兄','新来的小师弟'][c.cul]}，正就着灯抄值守的名册。${c.npc.ta}看见了你，手摸向了刀。`),
 opts:[{l:T('Take the spy alive','活捉内鬼'),fight:FG((s,c)=>c.npc.lv,'injury',T('The lamp in the manual room','秘籍房的灯'),T('a cornered spy','狗急跳墙的内鬼')),
   win:[{w:2,t:T('You drag the spy before the elders at dawn. The ambushes stop. Your name goes into the sect’s book of merit.','天亮时你把内鬼押到了长老面前。埋伏再没出过。你的名字记进了门里的功劳簿。'),c:'gold',fx:{merit:9,fame:2}},
    {w:1,t:c=>T(`Before the elders, ${c.npc.en} explains: ${c.npc.his} family is held hostage. The sect sends people to free them. You are thanked twice.`,`在长老面前，${c.npc.zh}说出了实情：${c.npc.ta}一家老小被人扣着当人质。门里派人去救了出来。你得了两份谢。`),c:'gold',fx:{merit:8,align:4}}],
   lose:[{w:2,t:T('The knife finds you and the spy finds the wall. By morning there is only a rope left hanging.','刀扎中了你，内鬼翻过了墙。第二天早上只剩下一根挂着的绳子。'),c:'bad',fx:{merit:2,f:s=>addCond(s,'wound',1)}},
    {w:1,t:T('You lose, but your shout wakes the dormitory. The spy is caught at the gate.','你打输了，可一嗓子喊醒了一院子人。内鬼在山门口被逮住了。'),c:'muted',fx:{merit:5}}]},
  {l:T('Let them go if they swear to vanish','让其发誓远走，放了'),out:[{w:s=>s.t.heart*.2,t:c=>T(`${c.npc.en} goes. A year later an unsigned letter warns the sect of a raid, in time.`,`${c.npc.zh}走了。一年后，一封没署名的信及时提醒门里有人要来偷袭。`),c:'good',fx:{align:4,merit:2}},
    {w:1,t:c=>T(`${c.npc.en} comes back in the spring, with friends from ${SECTS[c.foe].en}. Mercy has a price, and the sect pays it.`,`开春时${c.npc.zh}回来了，还带着${SZ(c.foe)}的人。慈悲是要付代价的，门里替你付了。`),c:'bad',fx:{merit:-3,enemy:1}}]}]});

/* a poison-master’s wager */
I({id:'mw_poisoner',age:[16,70],cd:12,w:1,tags:MWW,when:s=>power(s)>=15,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([10,18,19,29]),age:rint(50,75),lv:PW(1,0)(s)});return c},
 text:c=>T(`In a bamboo hut that smells of a hundred bitter things, a poison-master called ${c.npc.en} sets out three cups. “One is poisoned. Pick right and I’ll give you something useful. Pick wrong and I’ll learn something useful.”`,`一间竹屋里弥漫着上百种苦味。一个叫${c.npc.zh}的用毒老手摆出三只杯子：“一杯有毒。挑对了，我送你点有用的；挑错了，我学点有用的。”`),
 opts:[{l:T('Pick a cup','挑一杯'),out:[{w:s=>s.t.luck*.2+s.smarts/50,t:T('You choose the cup with the fewest fingerprints. Nothing happens. Delighted, the master hands you two pills that will cure most of what he makes.','你挑了指印最少的那杯。什么事也没有。老毒物乐坏了，塞给你两颗丹药，说他配的毒大半都能解。'),c:'good',fx:{item:['antidote','antidote'],money:20}},
    {w:1,t:c=>T(`Wrong cup. You wake on ${c.npc.his} floor three days later, very ill, while ${c.npc.he} takes notes. ${c.npc.He} cures most of it.`,`挑错了。三天后你在${c.npc.ta}的地上醒来，病得厉害，${c.npc.ta}正在一旁记笔记。毒解了大半。`),c:'bad',fx:{hurt:[8,16],cause:T('a poison-master’s wager','毒师的赌局'),f:s=>addCond(s,'poison',1)}}]},
  {l:T('Ask to learn about poisons instead','改求学几手辨毒的本事'),out:[{w:s=>s.smarts/25,t:T('You spend a season grinding roots for the master. You come away able to smell death in a cup, and a pill or two besides.','你给老毒物碾了一季的草根，出师时已能闻出杯里的死味儿，还得了一颗解毒丹。'),c:'good',fx:{smarts:3,item:'antidote'}},
    {w:1.2,t:T('He makes you clean jars for a month and teaches you nothing, on purpose, to see if you will stay. You do not.','他让你刷了一个月的罐子，故意什么都不教，看你留不留。你没留。'),c:'muted',fx:{smarts:1,happy:-2}}]},
  {l:T('Overturn the table','掀了桌子'),fight:FG((s,c)=>c.npc.lv,'injury',T('The bamboo hut','竹屋斗毒'),T('a poison-master','用毒老手')),
   win:[{w:2,t:T('He yields, coughing green smoke. The village below has been missing children’s dogs for years; now you know why. They thank you.','他咳着绿烟认了输。山下村子这些年总丢狗，现在你知道原因了。村里人谢了你。'),c:'good',fx:{fame:3,align:3}},
    {w:1,t:T('He yields and, oddly pleased, gives you an antidote. “Nobody has tried that in twenty years.”','他认了输，竟还挺高兴，送你一颗解毒丹。“二十年没人敢掀我的桌子了。”'),c:'good',fx:{fame:2,item:'antidote'}}],
   lose:[{w:2,t:T('He does not even stand up. A puff of powder, and you are crawling outside.','他连屁股都没抬。一口药粉吹过来，你就爬着出了门。'),c:'bad',fx:{f:s=>addCond(s,'poison',1)}},
    {w:1,t:T('He beats you with a broom, then makes you tea. Real tea, he promises.','他拿扫帚把你揍了一顿，又给你泡了茶。说是真茶。'),c:'muted',fx:{happy:-2,heal:5}}]}]});

/* a hidden cave with half a manual */
I({id:'mw_cave',age:[14,60],cd:20,w:.9,tags:MWW,
 ctx:s=>{const c=scene();c.art=pick(['vajra','eagle','swallow','spring','turtle','heartbreak','lightning'].filter(k=>ARTS[k]));return c},
 text:c=>T(`A ledge gives way and you slide into a ravine. Behind a curtain of ivy there is a cave, and in it a skeleton sitting cross-legged before a wall carved with figures. The second half of the wall has been chiselled smooth.`,`脚下一块岩石塌了，你滑进了山沟。藤蔓后面有个山洞，洞里一具白骨盘膝而坐，面对着一面刻满小人的石壁。石壁后半截被凿得平平整整。`),
 opts:[{l:T('Study the half that is left','研习剩下的半壁'),out:[{w:s=>s.t.root*.25,t:T('You stay until your food runs out, tracing the figures with your finger. Half an art is still more than you had.','你一直待到干粮吃完，用手指一遍遍描那些小人。半套功夫，也比你原来的多。'),c:'good',fx:{skill:[2,3],qi:[1,2]}},
    {w:s=>s.t.root*.04+s.t.wit*.03,t:c=>T(`On the last day you see it: the missing half is implied by the first, the way a shadow implies a body. It is ${ARTS[c.art].n}.`,`最后一天你忽然看明白了：后半截就藏在前半截里，像影子暗示着身形。这是${ARTS[c.art].cn}。`),c:'gold',fx:(s,c)=>({art:c.art,qi:1})},
    {w:1.2,t:T('Practising half an art sends your qi down a road with no end. Something tears inside you.','练半套功夫，真气走进了一条没有尽头的路。体内有什么东西撕裂了。'),c:'bad',fx:{qi:1,f:s=>addCond(s,'meridian',1)}}]},
  {l:T('Search the cave for the missing half','在洞里找后半部'),out:[{w:1.5,t:T('Only bones and a rusted sword. You bury the old one properly, which seems the least you can do.','只有白骨和一把锈剑。你把前辈好好埋了，这是最起码的。'),c:'muted',fx:{align:2,happy:1}},
    {w:s=>s.t.luck*.07,t:T('Under the skeleton’s hands, a pearl that glows in the dark. Whoever chiselled the wall missed it.','白骨手底下压着一颗夜里会发光的珠子。凿墙的人漏了它。'),c:'gold',fx:{item:'pearl'}},
    {w:s=>s.smarts/40,t:T('Chisel marks, a dropped tool with a smith’s stamp, and a date. Somebody is out there with the other half. You copy the stamp down.','凿痕、一把掉落的凿子，上面有铁匠铺的戳记和年月。另外半部在某个人手里。你把戳记抄了下来。'),c:'muted',fx:{smarts:2}}]},
  {l:T('Climb out at once','立刻爬出去'),out:[{w:s=>power(s)/40+1,t:T('You get out with torn hands and a story nobody believes.','你爬了出来，两手磨得稀烂，还多了个没人信的故事。'),c:'muted',fx:{hurt:[2,5],cause:T('a ravine','山沟')}},
    {w:1,t:T('Halfway up, the ivy gives. You land badly.','爬到一半，藤蔓断了。你摔得不轻。'),c:'bad',fx:{hurt:[5,10],cause:T('a fall into a ravine','跌落山沟'),f:s=>addCond(s,'fracture',1)}}]}]});

/* a martial assembly */
I({id:'mw_assembly',age:[18,70],cd:12,w:1,tags:MWW,when:s=>power(s)>=30,
 ctx:s=>{const c=scene();c.host=pick(mwGood(s));c.lv=PW(1.05,2)(s);return c},
 text:c=>T(`${SECTS[c.host].en} hosts a martial assembly. Every sect sends someone, every inn for thirty li is full, and on the last day anyone may climb the stage and test themselves against all comers.`,`${SZ(c.host)}做东，召开武林大会。各门各派都来了人，方圆三十里的客栈全住满了。最后一天，谁都可以上台，与天下英雄过招。`),
 opts:[{l:T('Climb the stage','上台'),fight:FG((s,c)=>c.lv,'light',T('The martial assembly','武林大会'),T('the assembly stage','大会擂台'),()=>foeName()),
   win:[{w:2,t:T('You hold the stage through three challengers. By evening strangers are calling you by a nickname you did not choose.','你连守三场。到了傍晚，陌生人已经用一个你没给自己起过的外号叫你了。'),c:'gold',fx:{fame:8,deed:T('Held the stage at a martial assembly','武林大会上连守三场')}},
    {w:s=>s.fame/40,t:c=>T(`You win, and the elders of ${SECTS[c.host].en} send a purse and an invitation to sit at the high table next time.`,`你赢了，${SZ(c.host)}的长老们送来一袋银子，请你下回坐上席。`),c:'gold',fx:{fame:6,money:100}}],
   lose:[{w:2,t:T('Your first challenger is very good. You go down in front of everyone.','第一个上来的就是高手。你当着天下人的面倒下了。'),c:'bad',fx:{fame:1,happy:-3}},
    {w:s=>s.t.heart*.15,t:T('You lose, but so well that people talk about the fight more than the winner.','你输了，可输得漂亮，大家谈论那一场比谈论赢家还多。'),c:'muted',fx:{fame:3}}]},
  {l:T('Watch the factions instead of the fights','不看比武，看人'),out:[{w:s=>s.smarts/25,t:T('You notice who sits with whom, who will not look at whom, and that the final was arranged over dinner. Useful to know.','你看出了谁跟谁坐一块儿，谁不看谁，还有决赛是饭桌上就定好了的。这些都有用。'),c:'good',fx:{smarts:2}},
    {w:1,t:T('You watch the fights after all. They are very good fights.','看着看着还是看起了比武。打得真好。'),c:'muted',fx:{skill:1}}]},
  {l:T('Sell steamed buns to the crowd','给看客卖包子'),out:[{w:s=>s.smarts/40+1,t:T('Ten thousand hungry martial artists. You sell out by noon three days running.','上万个饿肚子的江湖人。一连三天，你的包子不到晌午就卖光了。'),c:'good',fx:{money:[50,90]}},
    {w:1,t:T('It rains on the first day. You eat a great many buns yourself.','头一天就下雨。你自己吃了好多包子。'),c:'muted',fx:{money:-10}}]}]});

/* an old spearman and a hundred days of water */
I({id:'mw_spearman',age:[14,45],cd:20,w:.9,tags:MWW,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,sex:'m',age:rint(68,80),lv:PW(1.4,15)(s)});return c},
 text:c=>T(`An old frontier soldier, ${c.npc.en}, lives alone by a spring with a red-tasselled spear on the wall. He watches you drink. “Carry my water for a hundred days, and I’ll show you why the spear is king of weapons.”`,`一个边关退下来的老兵${c.npc.zh}独自住在泉边，墙上挂着一杆红缨枪。他看你喝水，开口道：“给我挑一百天水，我就让你见识见识，枪为什么是百兵之王。”`),
 opts:[{l:T('Carry the water','挑水'),out:[{w:s=>s.t.heart*.25,t:T('On the hundredth day he takes the spear down and shows you. On the hundred and first he gives it to you. “My hands are done with it.”','第一百天，他取下枪练给你看。第一百零一天，他把枪给了你。“我这双手，用不动它了。”'),c:'gold',fx:{skill:[2,4],maxHealth:2,item:'spear'}},
    {w:1,t:T('You quit on day forty. He shrugs and shows you one thrust anyway, because he is lonely.','第四十天你撂了挑子。他耸耸肩，还是教了你一记扎枪——他太寂寞了。'),c:'muted',fx:{skill:1}}]},
  {l:T('Ask him to just show you','直接求他露一手'),out:[{w:s=>s.smarts/30+s.looks/80,t:T('He laughs at your nerve and shows you one move, very slowly. You will be practising it for years.','他笑你脸皮厚，还是慢慢地使了一招。这一招够你练好几年了。'),c:'good',fx:{skill:1}},
    {w:1.2,t:T('He throws a bucket at you. It is the fastest thing you have ever seen.','他抄起水桶朝你扔了过来。这是你见过最快的东西。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Thank him and go on','谢过他，赶路'),out:[{w:2,t:T('He nods, as if he expected it.','他点点头，像是早料到了。'),c:'muted'},
    {w:1,t:T('Years later you pass that spring again. The hut is fallen in, and the spear is gone.','多年后你又路过那眼泉。草屋塌了，那杆枪也不见了。'),c:'muted',fx:{happy:-2}}]}]});

/* a brawl between two sects in an inn */
I({id:'mw_innbrawl',age:[14,70],cd:8,w:1,tags:['wander','town'],
 ctx:s=>{const c=scene();const g=mwGood(s);c.a=pick(g);c.b=pick(g.filter(k=>k!==c.a));c.lv=PW(.95,1)(s);return c},
 text:c=>T(`At ${c.place.en}, disciples of ${SECTS[c.a].en} and ${SECTS[c.b].en} fall out over who sat down first. Benches are already in the air.`,`在${c.place.zh}，${SZ(c.a)}和${SZ(c.b)}的弟子为了谁先落座吵翻了。板凳已经飞起来了。`),
 opts:[{l:T('Step in and make peace','出面劝和'),out:[{w:s=>s.fame/25+s.smarts/50,t:T('“Gentlemen. The innkeeper has children.” Both sides stop, and pay for the benches. Somehow it becomes your treat.','“诸位，掌柜的家里还有孩子。”两边都住了手，赔了板凳。不知怎么，最后成了你请客。'),c:'good',fx:{fame:3,money:-10}},
    {w:1.3,t:T('Nobody knows who you are. A bench hits you from each side, which is at least fair.','谁也不认识你。两边各飞来一条板凳砸在你身上，倒也公平。'),c:'bad',fx:{hurt:[4,9],cause:T('an inn brawl','客栈群殴')}}]},
  {l:T('Take a side','帮一边'),fight:FG((s,c)=>c.lv,'light',T('The inn brawl','客栈群殴'),T('an inn brawl','客栈群殴'),c=>T(`disciples of ${SECTS[c.b].en}`,`${SZ(c.b)}弟子`)),
   win:[{w:2,t:c=>T(`The ${SECTS[c.b].en} lot retreat. The others pour you wine and swear you are one of them now.`,`${SZ(c.b)}的人退了。另一边的人给你斟酒，拍着胸脯说你从此就是自己人。`),c:'good',fx:{fame:2}},
    {w:1,t:c=>T(`You win the brawl, and ${SECTS[c.b].en} remembers your face.`,`架打赢了，${SZ(c.b)}也记住了你这张脸。`),c:'muted',fx:{fame:2,happy:2}}],
   lose:[{w:2,t:T('You are thrown through a paper window into the yard. Your side loses too.','你被扔出了纸糊的窗户，摔进院子里。你帮的那边也输了。'),c:'bad',fx:{happy:-3}},
    {w:1,t:T('You lose, and the innkeeper makes you pay for the window.','你输了，掌柜的还让你赔窗户。'),c:'bad',fx:{money:-15}}]},
  {l:T('Lift a few purses while they fight','趁乱摸几个钱袋'),out:[{w:s=>s.t.luck*.15+s.smarts/60,t:T('Sect disciples carry good silver and do not watch their belts in a fight.','门派弟子身上银子不少，打起架来顾不上腰带。'),c:'muted',fx:{money:[30,70],align:-4}},
    {w:1.2,t:T('Both sides catch you at once. For a moment they are united.','两边同时逮住了你。那一刻他们倒团结起来了。'),c:'bad',fx:{hurt:[6,12],cause:T('being caught stealing in a brawl','趁乱偷钱被逮'),align:-3}}]}]});

/* a peddler of hidden weapons */
I({id:'mw_hidden',age:[14,70],cd:12,w:.9,tags:['wander','town'],
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:17,age:rint(30,60)});return c},
 text:c=>T(`A peddler called ${c.npc.en} opens a fur coat lined with little pockets. “Caltrops, throwing stones, smoke balls. Everything a careful person needs. Forty taels for the set, a free demonstration if you ask nicely.”`,`一个叫${c.npc.zh}的货郎掀开皮袄，里面缝满了小口袋。“铁蒺藜、飞蝗石、烟雾弹，小心人用得着的都在这儿。一套四十两，客气点问，我还给你演示。”`),
 opts:[{l:T('Buy the set','买一套'),cost:40,out:[{w:s=>1+s.smarts/50,t:T('Real goods, well made. You feel a little safer on the road.','货真价实，做工也好。走在路上你觉得踏实了些。'),c:'good',fx:{item:['caltrops','darts','smoke']}},
    {w:1,t:T('The smoke balls are clay full of flour. The caltrops are real, at least.','烟雾弹是泥丸子里塞的面粉。铁蒺藜倒是真的。'),c:'muted',fx:{item:'caltrops'}}]},
  {l:T('Ask for the demonstration','请他演示'),out:[{w:s=>s.t.wit*.15+s.smarts/50,t:T('You watch his wrist, not his hand. By evening you can put a pebble through a hanging coin.','你盯着他的手腕，而不是手。到了傍晚，你也能一石子穿过吊着的铜钱了。'),c:'good',fx:{skill:1,smarts:1}},
    {w:1,t:T('He demonstrates the smoke ball. When the smoke clears he is gone, and so is your lunch.','他演示了一颗烟雾弹。烟散了，人没了，你的午饭也没了。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Ask who sold him the stock','问他货是从哪来的'),out:[{w:s=>s.fame/30+s.smarts/50,t:T('He lowers his voice: a dark faction’s armoury was robbed last month. You pass it to the right people, and they are grateful.','他压低声音说：上个月一个邪派的兵器库被人抢了。你把消息转给了该知道的人，人家很承情。'),c:'good',fx:{fame:2,align:2}},
    {w:1,t:T('He closes his coat. “From my uncle.” He does not have an uncle.','他把皮袄一裹。“我舅舅那儿来的。”他没有舅舅。'),c:'muted'}]}]});

/* ======================================================================
   BIG: multi-step
   ====================================================================== */

/* the hermit who tests you three times */
I({id:'mw_hermit1',age:[16,55],once:1,w:.9,tags:MWW,when:s=>power(s)>=10,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,sex:'m',age:rint(75,92),lv:PW(1.1,2)(s)});c.score=0;c.art=pick(['roar','shadow','lastlight','heartbreak','lightning','spring'].filter(k=>ARTS[k]));return c},
 text:c=>T(`By a still mountain pool an old man fishes with a line that has no hook. Without turning round he says, “Sit down. Don’t talk.”`,`山间一潭静水边，一个老人在钓鱼，鱼线上没有钩。他头也不回地说：“坐下。别说话。”`),
 opts:[{l:T('Sit and wait','坐下等'),out:[{w:s=>s.t.heart*.25,t:T('You sit for three days. On the third evening he says, “Hm,” which you understand is a great deal.','你坐了三天。第三天傍晚，他“嗯”了一声。你明白，这已经很了不起了。'),c:'good',fx:{f:(s,c)=>{c.score++}},next:'mw_hermit2',keep:1},
    {w:1,t:T('On the second day you go to find food. When you come back he says, “Well. You came back.”','第二天你去找吃的了。回来时他说：“哦，还知道回来。”'),c:'muted',next:'mw_hermit2',keep:1}]},
  {l:T('Ask him what he wants','直接问他想干什么'),out:[{w:s=>s.smarts/40,t:T('“Clever is not the same as patient,” he says. But he lets you stay.','“聪明不等于沉得住气。”他说。但还是让你留下了。'),c:'muted',next:'mw_hermit2',keep:1},
    {w:1,t:T('He does not answer. After an hour of being ignored, you leave.','他不理你。被晾了一个时辰，你走了。'),c:'muted'}]},
  {l:T('Walk on','走开'),out:[{w:2,t:T('Mad old men by pools are not your business.','潭边的疯老头，与你无关。'),c:'muted'},
    {w:s=>s.t.luck*.1,t:T('As you go, a fish leaps out of the pool and lands at your feet. “Even the pool pities you,” he calls after you.','你刚转身，一条鱼从潭里跳出来，落在你脚边。“连这潭水都可怜你。”他在你身后说。'),c:'muted',fx:{happy:2}}]}]});
I({id:'mw_hermit2',only:1,noThread:1,
 text:()=>T('The next morning, while you are washing your face, his staff whistles at your head without warning.','第二天早上，你正在洗脸，他的竹杖毫无预兆地朝你脑袋抽了过来。'),
 opts:[{l:T('Stand and fight','站住，接招'),fight:FG((s,c)=>c.npc.lv,'spar',T('The hermit’s staff','隐士的竹杖'),T('an old man’s staff','老人的竹杖')),
   win:[{w:2,t:T('You catch the staff. He looks at your hand on it for a long moment. “Good.”','你攥住了竹杖。他盯着你握杖的手看了好一会儿。“好。”'),c:'good',fx:{f:(s,c)=>{c.score++}},next:'mw_hermit3',keep:1},
    {w:1,t:T('You win, and he is not pleased. “You won because I am old. Don’t enjoy it.” But he lets you stay.','你赢了，他却不高兴。“你赢是因为我老了。别得意。”不过还是让你留下了。'),c:'muted',fx:{f:(s,c)=>{c.score++}},next:'mw_hermit3',keep:1}],
   lose:[{w:s=>s.t.heart*.2,t:T('He knocks you down. You get up. He knocks you down. You get up. At the ninth time he stops. “That’s the test,” he says. “Not the falling.”','他把你打倒，你爬起来；再打倒，再爬起来。第九回，他停了手。“考的是这个，”他说，“不是摔不摔。”'),c:'good',fx:{f:(s,c)=>{c.score++}},next:'mw_hermit3',keep:1},
    {w:1,t:T('You stay down. He goes back to fishing as if nothing happened.','你没再起来。他回去钓鱼，好像什么也没发生过。'),c:'muted',next:'mw_hermit3',keep:1}]},
  {l:T('Dodge and run','躲开就跑'),out:[{w:s=>s.t.wit*.15,t:T('You run twenty paces, then circle back and come at him from behind the pine. He laughs out loud for the first time.','你跑了二十步，又绕回来，从松树后面扑向他。他头一回笑出了声。'),c:'good',fx:{f:(s,c)=>{c.score++}},next:'mw_hermit3',keep:1},
    {w:1,t:T('You run. “Come back for lunch,” he shouts. You do, embarrassed.','你跑了。“回来吃饭！”他喊。你红着脸回去了。'),c:'muted',next:'mw_hermit3',keep:1}]}]});
I({id:'mw_hermit3',only:1,noThread:1,
 text:()=>T('On the third day a ragged man stumbles to the pool with a sack of stolen rice, a mob of villagers shouting behind him. The old man puts his staff in your hand. “Your choice.”','第三天，一个衣衫褴褛的人背着一袋偷来的米跌跌撞撞跑到潭边，后面一群村民喊着追来。老人把竹杖塞到你手里：“你来定。”'),
 opts:[{l:T('Return the rice, then let the thief go','米还回去，人放走'),out:[{w:s=>s.smarts/30+s.fame/50,t:T('You give the rice back and talk the villagers down. The thief has three children; you make sure they hear that too.','你把米还了，劝住了村民。小偷家里有三个孩子——这话你也让村民们听见了。'),c:'good',fx:{align:3,f:(s,c)=>{c.score++}},next:'mw_hermit4',keep:1},
    {w:1,t:T('The villagers want blood and take some of yours instead. The thief gets away. The old man binds your cuts without a word.','村民们要见血，最后见的是你的。小偷跑了。老人一声不吭地给你包扎伤口。'),c:'muted',fx:{align:3,hurt:[4,8],cause:T('an angry mob','一群愤怒的村民'),f:(s,c)=>{c.score++}},next:'mw_hermit4',keep:1}]},
  {l:T('Hand him to the villagers','把人交给村民'),out:[{w:1,t:T('They beat him and let him go. The old man watches and says nothing at all.','他们揍了他一顿，放了。老人在一旁看着，一言不发。'),c:'muted',next:'mw_hermit4',keep:1},
    {w:s=>s.align<0?2:.6,t:T('They hang him from a tree by the pool. The old man looks at you for a long time.','他们把他吊死在潭边的树上。老人看了你很久。'),c:'bad',fx:{align:-3},next:'mw_hermit4',keep:1}]},
  {l:T('Strike the thief down yourself','亲手打死小偷'),out:[{w:2,t:T('It is quick. When you turn round, the old man and his fishing line are gone. The pool is very still.','很快就完了。你一转身，老人和他的鱼线都不见了。潭水一动不动。'),c:'bad',fx:{align:-6}},
    {w:s=>s.t.luck*.1,t:T('The thief is faster than he looks and is gone into the trees. The old man is gone too, as if he never was.','小偷比看上去快得多，一头钻进了树林。老人也不见了，像从没来过。'),c:'muted',fx:{align:-3}}]}]});
I({id:'mw_hermit4',only:1,noThread:1,
 text:()=>T('That night the old man builds a fire, looks at you over it, and makes up his mind.','那天夜里，老人生了堆火，隔着火光打量你，心里有了主意。'),
 out:[{if:(s,c)=>c.score>=3,w:s=>s.t.root*.15,t:c=>T(`“Three for three. I have waited eleven years for this.” Until spring he teaches you ${ARTS[c.art].n}, the thing he swore he would take to his grave. Then he takes his hookless line and goes.`,`“三考三过。我等了十一年。”直到开春，他把那套发誓要带进棺材的${ARTS[c.art].cn}教给了你。然后他拿着那根没钩的鱼线，走了。`),c:'gold',fx:(s,c)=>({art:c.art,qi:[3,5],deed:T('Passed a hermit’s three tests','通过隐士三重考验')})},
  {if:(s,c)=>c.score>=3,w:1,t:T('“Three for three.” He spends the winter rebuilding your breathing from the bottom up. You leave a different fighter.','“三考三过。”他花了一冬天，从根上重塑你的吐纳。下山时，你已判若两人。'),c:'gold',fx:{qi:[4,5],skill:[2,3],maxHealth:3,deed:T('Passed a hermit’s three tests','通过隐士三重考验')}},
  {if:(s,c)=>c.score===2,w:2,t:T('“Two out of three. Not bad, not enough.” He gives you a month of corrections and sends you away with a pat on the head.','“三考过二。不坏，也不够。”他给你纠正了一个月招式，拍拍你的脑袋，打发你下了山。'),c:'good',fx:{qi:[2,3],skill:2}},
  {if:(s,c)=>c.score===2,w:s=>s.t.luck*.15,t:T('“Two out of three.” He presses a red pill into your palm. “For the day you need a third.”','“三考过二。”他往你手心里按了一颗红丸。“等你哪天差那第三考的时候用。”'),c:'good',fx:{item:'hushin',qi:2}},
  {if:(s,c)=>c.score<=1,w:2,t:T('“Come back in ten years,” he says, and is gone by morning.','“十年后再来。”他说完，天亮前人就不见了。'),c:'muted',fx:{skill:1}},
  {if:(s,c)=>c.score<=1,w:1,t:T('He shares his fish with you and talks about his wife, who died fifty years ago. It is a good evening, and that is all it is.','他把鱼分给你吃，讲起他五十年前过世的老伴。那是个不错的夜晚，仅此而已。'),c:'muted',fx:{happy:3}}]});

/* an expedition for a once-in-sixty-years herb */
I({id:'mw_lotus1',age:[18,60],cd:20,w:.9,tags:MWW,when:s=>power(s)>=25,
 ctx:s=>{const c=scene();const cold=['west','north'].includes(s.region);
  c.herb=cold?T('snow lotus','雪莲'):T('thousand-year ginseng','千年人参');c.where=cold?T('above the glacier','冰川之上'):T('in the deepest forest','老林最深处');
  c.beast=cold?T('a white ape','一头白猿'):T('a black bear','一头黑熊');c.blv=PW(1,0)(s);c.easy=0;
  c.npc=npc(s,{occ:pick([13,14]),age:rint(22,35),lv:PW(1,1)(s)});return c},
 text:c=>T(`An old herb-gatherer, his feet ruined by frostbite, tells you where a ${c.herb.en} will flower this month ${c.where.en}: once in sixty years. “I can’t climb any more. Bring me one petal and the rest is yours.”`,`一个双脚冻坏了的老采药人告诉你，这个月${c.where.zh}有株${c.herb.zh}要开了，六十年才开一回。“我爬不动了。给我带一片回来，剩下的都归你。”`),
 opts:[{l:T('Go after it','去找'),out:[{w:2,t:T('You set off at dawn with his map and a week of dried meat.','天一亮你就揣着他的图、背着一礼拜的肉干出发了。'),c:'muted',next:'mw_lotus2',keep:1},
    {w:s=>s.t.luck*.12,t:T('The weather holds as if someone ordered it. You make good time.','天气好得像有人特意安排过。你走得很顺。'),c:'good',fx:{f:(s,c)=>{c.easy=1}},next:'mw_lotus2',keep:1}]},
  {l:T('Sell the secret to a pharmacy','把消息卖给药铺'),out:[{w:s=>s.smarts/30,t:T('The pharmacy pays well and sends six porters up the mountain. You feel the old man’s eyes on your back.','药铺出了好价钱，派了六个脚夫上山。你觉得背后有老人的目光。'),c:'muted',fx:{money:120,align:-2}},
    {w:1,t:T('The pharmacist laughs. “Every old man in this town has a map.” Ten taels for the story.','药铺掌柜笑了。“这镇上哪个老头没张图？”给了你十两，当听个故事。'),c:'muted',fx:{money:10}}]},
  {l:T('Help him home instead','先送他回家'),out:[{w:2,t:T('You carry him down to his daughter’s house. He talks the whole way about the flower he will never see.','你把他背到他女儿家。一路上他都在讲那朵他再也见不着的花。'),c:'good',fx:{align:3,happy:2}},
    {w:s=>s.t.luck*.15,t:T('His daughter insists you take a ginseng root from the rafters, “a small one, only three hundred years old.”','他女儿硬是从房梁上取下一根人参给你，“小的，才三百年。”'),c:'good',fx:{align:3,qi:1,heal:30}}]}]});
I({id:'mw_lotus2',only:1,noThread:1,
 text:c=>T(`Near the top, where the map ends, you find the place. You also find ${c.beast.en}, sitting on the only path as though it has been waiting sixty years too.`,`快到顶上，图画到头的地方，你找到了。你还找到了${c.beast.zh}，蹲在唯一的那条路上，好像它也等了六十年。`),
 opts:[{l:T('Fight your way past','杀过去'),fight:FG((s,c)=>c.blv,'injury',T('The guardian of the herb','守药灵兽'),T('a beast on a mountain','山中猛兽'),c=>c.beast,true),
   win:[{w:2,t:T('It gives way at last and lopes off over the rocks. The path is open.','它终于让开了，一纵一纵地跳上了乱石。路通了。'),c:'good',next:'mw_lotus3',keep:1},
    {w:1,t:T('It retreats, but not before leaving its mark across your shoulder. You climb on, bleeding.','它退了，可走前在你肩上留了道口子。你流着血接着爬。'),c:'muted',fx:{hurt:[4,8],cause:T('a mountain beast','山中猛兽')},next:'mw_lotus3',keep:1}],
   lose:[{w:2,t:T('It throws you down the scree. You lie at the bottom a long time, listening to something in your leg that should not click.','它把你掀下了碎石坡。你在坡底躺了很久，听着腿里不该响的地方咔哒作响。'),c:'bad',fx:{f:s=>addCond(s,'fracture',1)}},
    {w:s=>s.t.luck*.15,t:T('You lose, but while it chases you round a boulder you double back and reach the top first.','你打不过，可趁它绕着大石头追你，你折回去先上了顶。'),c:'muted',next:'mw_lotus3',keep:1}]},
  {l:T('Climb round by the cliff face','从峭壁绕过去'),out:[{w:(s,c)=>power(s)/50+(c.easy?1.5:.5),t:T('Finger by finger, toe by toe, with nothing below you but cloud. You reach the top shaking.','一指一指、一脚一脚，脚下只有云。到顶时你浑身都在抖。'),c:'good',next:'mw_lotus3',keep:1},
    {w:1,t:T('A handhold breaks. You fall a long way and land on a ledge, which is the only luck you get today.','一块抓手的石头断了。你摔下去很远，落在一块岩台上——这是你今天唯一的运气。'),c:'bad',fx:{hurt:[8,15],cause:T('a fall from a cliff','坠崖'),f:s=>addCond(s,'fracture',1)}}]}]});
I({id:'mw_lotus3',only:1,noThread:1,
 text:c=>T(`The ${c.herb.en} is there, pale and perfect. So is ${c.npc.en}, a sect disciple who climbed the other side, gasping. “My master is dying. Only this will do. Please.”`,`${c.herb.zh}就在那里，素净无瑕。${c.npc.zh}也在，一个从另一侧爬上来的门派弟子，喘着粗气。“我师父快不行了，只有它能救。求你了。”`),
 opts:[{l:T('Eat it here and now','当场吃了'),out:[{w:s=>s.t.root*.2,t:T('It tastes of snow and iron. Heat floods every channel in your body and stays there.','它尝起来是雪和铁的味道。一股热流灌满了全身经脉，久久不散。'),c:'gold',fx:{qi:[4,5],maxHealth:4,lifespan:2,align:-3}},
    {w:1,t:T('It is far too strong for you. You get some of its strength, and spend the night coughing blood.','药性太烈，你受不住。得了些好处，却咳了一夜的血。'),c:'bad',fx:{qi:3,align:-3,f:s=>addCond(s,'inner',1)}}]},
  {l:(c)=>T(`Give it to ${c.npc.en}`,`给${c.npc.zh}`),out:[{w:s=>s.t.heart*.2,t:c=>T(`${c.npc.en} weeps and kneels and asks you to be ${c.npc.his} sworn sibling. You save a petal for the old herb-gatherer.`,`${c.npc.zh}哭着跪下，要和你结为异姓兄弟。你留了一片花瓣给那个老采药人。`),c:'gold',fx:{align:6,fame:2,meet:'sworn',bond:80}},
    {w:1,t:c=>T(`${c.npc.en} takes it and is gone before you can blink. Months later you hear the master lived, and told everyone a stranger saved him.`,`${c.npc.zh}接过去，眨眼就没了影。几个月后你听说那位师父活了下来，逢人便说是个陌生人救了他。`),c:'good',fx:{align:4,fame:2}}]},
  {l:T('Fight for it','动手抢'),fight:FG((s,c)=>c.npc.lv,'injury',T('Above the clouds','云上夺药'),T('a fight over a rare herb','争夺灵药')),
   win:[{w:2,t:c=>T(`You win and take it. ${c.npc.en} climbs down without a word. You do not ask what happened to the master.`,`你赢了，药归你。${c.npc.zh}一言不发地下了山。你没问那位师父后来怎样。`),c:'muted',fx:{qi:[3,4],align:-4,enemy:1}},
    {w:1,t:T('You win, and sell it in town. The price could buy a house.','你赢了，拿到镇上卖了。那价钱够买一座宅子。'),c:'gold',fx:{money:[300,500],align:-4}}],
   lose:[{w:2,t:T('You lose, and the herb with it. The climb down is very long.','你输了，药也没了。下山的路很长。'),c:'bad',fx:{happy:-4}},
    {w:1,t:c=>T(`${c.npc.en} wins, then hesitates, and tears off one leaf for you. “For your trouble.”`,`${c.npc.zh}赢了，迟疑了一下，掐了一片叶子给你。“辛苦你了。”`),c:'muted',fx:{qi:1,heal:15}}]}]});

/* an escort run gone strange */
I({id:'mw_escort1',age:[18,60],cd:15,w:1,tags:MWW,when:s=>power(s)>=15,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:8,sex:'m',age:rint(40,55)});c.truth=pick(['child','ashes','gu']);c.lv=PW(1.05,2)(s);return c},
 text:c=>T(`An escort master, ${c.npc.en}, is two men short and desperate. The job: one lacquered box to the coast. The rules: never open it, never stop at Willow Ferry, never ask.`,`镖头${c.npc.zh}缺两个人手，急得团团转。这趟镖只有一只漆盒，送到海边。规矩三条：不许开盒，不许在柳渡停留，不许问。`),
 opts:[{l:T('Take the job','接下'),out:[{w:2,t:T('You shoulder a spear and join the wagon. The box rides on a cushion, like a guest.','你扛起一杆枪跟着镖车上了路。漆盒放在软垫上，像位客人。'),c:'muted',next:'mw_escort2',keep:1},
    {w:s=>s.fame/40,t:T('Your name makes him so happy he pays you half in advance.','听了你的名号，他高兴得先付了一半镖银。'),c:'good',fx:{money:30},next:'mw_escort2',keep:1}]},
  {l:T('Decline','不接'),out:[{w:2,t:T('Rules like those mean money like that. You are not that poor.','规矩这么多，镖银一定不少。你还没穷到那份上。'),c:'muted'},
    {w:1,t:T('A month later you hear the whole wagon vanished on the coast road. Nobody knows what was in the box.','一个月后听说，那趟镖连人带车在海边的路上没了踪影。谁也不知道盒子里装的是什么。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'mw_escort2',only:1,noThread:1,
 text:()=>T('On the third night, on guard by the wagon, you hear the box knock. Twice. From the inside.','第三天夜里，你在镖车边守夜，听见那盒子响了。两下。从里面敲的。'),
 opts:[{l:T('Open it','打开'),out:[
    {if:(s,c)=>c.truth==='child',w:1,t:T('Inside, curled on silk, is a girl of four with a jade lock round her neck, who asks you very politely for water.','里面绸缎上蜷着个四岁的小姑娘，脖子上挂着块玉锁，很有礼貌地向你讨水喝。'),c:'muted',next:'mw_escort3',keep:1},
    {if:(s,c)=>c.truth==='child',w:1,t:c=>T(`A small child, half-stifled. You let her breathe. ${c.npc.en} finds you and does not shout. “Now you know. Now you’re in it.”`,`一个快闷坏了的孩子。你让她透了口气。${c.npc.zh}找过来，却没骂人。“这下你知道了。你也脱不了身了。”`),c:'muted',next:'mw_escort3',keep:1},
    {if:(s,c)=>c.truth==='ashes',w:1,t:T('An urn of ashes and a sect master’s token. The knocking was the urn shifting on the road. Probably.','一只骨灰坛，外加一位掌门的令牌。响声是坛子在路上颠的。大概吧。'),c:'muted',next:'mw_escort3',keep:1},
    {if:(s,c)=>c.truth==='ashes',w:s=>s.smarts/40,t:T('An urn and a token. You read the token and understand: whoever holds these ashes names the next master of a sect.','一只骨灰坛，一块令牌。你看了令牌就明白了：谁捧着这坛骨灰，谁就能定下一任掌门。'),c:'muted',fx:{smarts:1},next:'mw_escort3',keep:1},
    {if:(s,c)=>c.truth==='gu',w:s=>s.t.luck*.2,t:T('Something black and many-legged lunges. You slam the lid just in time.','一个漆黑的多脚东西扑了出来。你及时扣上了盖子。'),c:'muted',next:'mw_escort3',keep:1},
    {if:(s,c)=>c.truth==='gu',w:1,t:T('Something black and many-legged bites your thumb before you slam the lid. A poison-master’s Gu, being sent home.','你还没扣上盖，一个漆黑的多脚东西就咬了你拇指一口。是哪个蛊师的蛊虫，正往家送。'),c:'bad',fx:{f:s=>addCond(s,'poison',2)},next:'mw_escort3',keep:1}]},
  {l:T('Leave it shut and keep watch','不开，接着守'),out:[{w:2,t:T('The knocking stops before dawn. You do not sleep.','天亮前响声停了。你一夜没合眼。'),c:'muted',next:'mw_escort3',keep:1},
    {w:s=>s.smarts/30,t:c=>T(`You see ${c.npc.en} slip to the wagon and whisper to the box. Whatever is in there, he knows it can hear.`,`你看见${c.npc.zh}悄悄走到车边，对着盒子说悄悄话。不管里面是什么，他知道它听得见。`),c:'muted',fx:{smarts:1},next:'mw_escort3',keep:1}]}]});
I({id:'mw_escort3',only:1,noThread:1,
 text:c=>T(`A flood closes the road and the wagon is forced to stop at Willow Ferry after all. At midnight, men in black come out of the reeds. “The box. Nobody else needs to die.” ${c.npc.en} looks at you.`,`大水冲断了路，镖车到底还是停在了柳渡。半夜，芦苇丛里钻出一群黑衣人。“把盒子交出来，就不用再死人。”${c.npc.zh}看向你。`),
 opts:[{l:T('Defend the box','护镖'),fight:FG((s,c)=>c.lv,'injury',T('Night at Willow Ferry','夜战柳渡'),T('raiders at Willow Ferry','柳渡劫镖人'),()=>T('the men in black','黑衣人')),
   win:[{w:2,t:c=>c.truth==='child'?T('You hold the ferry till dawn. On the coast, a family of exiled nobles takes their daughter back and weeps on your hands.','你守渡口守到了天亮。到了海边，一户落难的官宦人家接回女儿，捧着你的手直掉眼泪。'):c.truth==='ashes'?T('You hold the ferry. On the coast, a sect’s mourning disciples receive their master, and remember who brought him.','你守住了渡口。到了海边，一派披麻戴孝的弟子接回了他们的师父，记住了是谁送来的。'):T('You hold the ferry. On the coast, a hooded woman takes the box and pays in gold, and you decide not to ask.','你守住了渡口。到了海边，一个戴兜帽的女人接过盒子，付的是金子。你决定不问。'),c:'gold',fx:(s,c)=>({money:150,fame:4,align:c.truth==='gu'?-1:4})},
    {w:1,t:c=>T(`Afterwards ${c.npc.en} offers you a permanent place with the agency, and when you refuse, a cup of wine that lasts all night.`,`事后${c.npc.zh}请你留在镖局长干。你推了，他就拉着你喝了一整夜的酒。`),c:'good',fx:{money:120,fame:3,meet:'friend',bond:65}}],
   lose:[{w:2,t:T('They cut through you and take the box into the reeds. The escort master lives. The rest of the job does not.','他们砍翻了你，带着盒子钻进了芦苇荡。镖头活了下来，这趟镖算是完了。'),c:'bad',fx:{f:s=>addCond(s,'wound',1),fame:-1}},
    {w:s=>s.t.luck*.15,t:T('You go down, but in the dark you roll the box into the river and pull it out downstream an hour later. The job is saved, just.','你倒下了，可趁黑把盒子推进了河里，一个时辰后在下游捞了上来。总算保住了这趟镖。'),c:'good',fx:{money:80,fame:2,hurt:[5,10],cause:T('raiders at Willow Ferry','柳渡劫镖人')}}]},
  {l:T('Hand it over and save the men','交出盒子，保住人'),out:[{w:s=>s.smarts/30+s.fame/50,t:T('You bargain hard: the box for every man’s life and the wagon. They agree. Nobody speaks on the road home.','你咬住价钱：盒子换所有人的命和镖车。他们答应了。回去的路上谁也不说话。'),c:'muted',fx:{align:-1}},
    {w:1,t:c=>T(`They take the box, and then kill ${c.npc.en} anyway, because he saw their faces. You run.`,`他们拿了盒子，还是杀了${c.npc.zh}——因为他看见了他们的脸。你跑了。`),c:'bad',fx:{happy:-6,align:-2,f:s=>addCond(s,'shaken',1)}}]}]});

/* alliance meeting against a dark faction, and the raid that follows */
I({id:'mw_alliance',age:[20,70],cd:15,w:1.1,tags:MWW,when:s=>s.fame>=20&&power(s)>=25,
 ctx:s=>{const c=scene();c.host=pick(mwGood(s));c.dark=isEvil(s.sect)?s.sect:mwLocalBad(s);c.lv=PW(.95,1)(s);c.lv2=PW(1.08,2)(s);return c},
 text:c=>T(`The righteous sects meet in the great hall of ${SECTS[c.host].en} to swear an alliance against ${SECTS[c.dark].en}, who burned two villages this spring. You have been invited because people know your name.`,`各大正派齐聚${SZ(c.host)}大殿，歃血结盟，共讨今春烧了两个村子的${SZ(c.dark)}。你也收到了请帖——江湖上有人知道你的名字了。`),
 opts:[{l:T('Volunteer for the vanguard','请缨打头阵'),if:s=>!isEvil(s.sect),out:[{w:s=>power(s)/50+s.fame/60,t:T('The hall goes quiet, then roars. You will lead the first party up the mountain.','大殿里先是一静，接着轰然叫好。上山的第一队由你带。'),c:'good',fx:{fame:3},next:'mw_raid1',keep:1},
    {w:1,t:T('They choose someone more famous for the vanguard, and give you a place in the second party.','头阵给了名气更大的人，你被编进了第二队。'),c:'muted',fx:{fame:1},next:'mw_raid1',keep:1}]},
  {l:T('Speak for caution','主张慎重'),if:s=>!isEvil(s.sect),out:[{w:s=>s.smarts/25+s.fame/50,t:T('You point out that half the “dark faction” are farmers they press-ganged. The plan changes: fewer dead, more prisoners. People remember who said it.','你指出那“邪派”里一半是被强拉进去的庄稼汉。计划改了：少杀人，多抓人。大家记住了是谁说的。'),c:'good',fx:{fame:3,smarts:1,align:3}},
    {w:1.5,t:T('“Fear dressed up as wisdom,” someone says, and the hall laughs. You sit down.','“胆小装成稳重。”有人说。满堂哄笑。你坐了回去。'),c:'bad',fx:{fame:-2}}]},
  {l:T('Sit in disguise and carry word home','乔装赴会，回去报信'),if:s=>isEvil(s.sect),out:[{w:s=>s.smarts/25+s.t.wit*.1,t:T('You drink the oath wine with them and are home in three days with every name and every road. Your leader smiles for the first time in a year.','你和他们一起喝了血酒，三天后带着所有名字、所有路线回了总坛。教主一年来头一回笑了。'),c:'gold',fx:{merit:10,align:-4}},
    {w:1,t:T('An old abbot knows your walk. You fight your way out of the hall with half the jianghu behind you.','一个老方丈认出了你的步态。你半个江湖追在身后，杀出了大殿。'),c:'bad',fx:{hurt:[10,20],cause:T('being unmasked at an alliance','结盟大会上被识破'),wanted:1,fame:2}}]},
  {l:T('Slip out of the hall','悄悄离席'),out:[{w:2,t:T('Speeches are long and wine is free. You take the wine and skip the speeches.','讲话太长，酒是白喝的。你喝了酒，没听讲话。'),c:'muted'},
    {w:s=>s.t.luck*.12,t:T('In the garden you meet an elder who also hates speeches. He shows you a trick with the wrist while you share a jug.','你在后园碰见一位同样讨厌听讲的长老。你们分着一壶酒，他教了你一手腕上的巧劲。'),c:'good',fx:{skill:1,happy:2}}]}]});
I({id:'mw_raid1',only:1,noThread:1,
 text:c=>T(`Night on the mountain of ${SECTS[c.dark].en}. Torches above, a single path, and four sentries at the gate drinking to keep warm.`,`${SZ(c.dark)}的山上，夜。头顶有火把，只有一条路，山门口四个哨兵正在喝酒取暖。`),
 opts:[{l:T('Take the sentries quietly','悄悄放倒哨兵'),out:[{w:s=>s.t.wit*.15+s.t.luck*.1,t:T('One by one, with a hand over each mouth. The gate opens without a sound.','一个一个，捂着嘴放倒。山门无声无息地开了。'),c:'good',next:'mw_raid2',keep:1},
    {w:1,t:T('The fourth one shouts. Bells ring all over the mountain. You go in anyway.','第四个喊出了声。满山的钟都响了。你们还是冲了进去。'),c:'muted',fx:{hurt:[4,10],cause:T('a raid on a dark faction','攻打邪派')},next:'mw_raid2',keep:1}]},
  {l:T('Charge the gate','强攻山门'),fight:FG((s,c)=>c.lv,'injury',T('The mountain gate','强攻山门'),T('the gate of a dark faction','邪派山门'),c=>T(`sentries of ${SECTS[c.dark].en}`,`${SZ(c.dark)}哨兵`)),
   win:[{w:2,t:T('The gate falls. Behind you the alliance pours in.','山门破了。联军在你身后涌了进来。'),c:'good',fx:{fame:2},next:'mw_raid2',keep:1},
    {w:1,t:T('You break through with a cut across the ribs and keep going.','你冲了进去，肋下挨了一刀，没停。'),c:'muted',fx:{hurt:[5,10],cause:T('a raid on a dark faction','攻打邪派')},next:'mw_raid2',keep:1}],
   lose:[{w:2,t:T('You fall at the gate. Others carry the fight past you, and carry you down the mountain afterwards.','你倒在了山门前。别人从你身边冲了过去，事后又把你抬下了山。'),c:'bad',fx:{fame:1,f:s=>addCond(s,'wound',1)}},
    {w:1,t:T('You are beaten back, and the attack stalls. The alliance retreats at dawn, arguing about whose fault it was.','你被打了回来，攻势也停了。天亮时联军撤了，一路吵着是谁的错。'),c:'bad',fx:{happy:-4}}]}]});
I({id:'mw_raid2',only:1,noThread:1,
 text:c=>T(`Inside, a courtyard full of prisoners in chains, and in front of the inner hall a guardian of ${SECTS[c.dark].en} with a weapon in each hand, waiting for you in particular.`,`里面是个院子，关满了戴锁链的人。内堂门前，${SZ(c.dark)}的一位护法双手各持兵刃，专门在等你。`),
 opts:[{l:T('Face the guardian','迎战护法'),fight:FG((s,c)=>c.lv2,'injury',T('Before the inner hall','内堂门前'),T('a dark faction’s guardian','邪派护法'),c=>T(`a guardian of ${SECTS[c.dark].en}`,`${SZ(c.dark)}护法`)),
   win:[{w:2,t:T('The guardian drops to one knee and then to both. The inner hall is open.','护法先跪下一条腿，又跪下了另一条。内堂的门开了。'),c:'gold',fx:{fame:5},next:'mw_raid3',keep:1},
    {w:1,t:T('You win, but a palm strike lands on your chest as he falls. Something inside you is not right.','你赢了，可他倒下时一掌印在你胸口。体内有什么不对劲了。'),c:'muted',fx:{fame:5,f:s=>addCond(s,'inner',1)},next:'mw_raid3',keep:1}],
   lose:[{w:2,t:T('He is better than you. You are thrown into the courtyard, among the chained men, and others finish what you started.','他比你强。你被扔进了院子，倒在戴锁链的人中间，别人替你收了尾。'),c:'bad',fx:{f:s=>addCond(s,'inner',1),fame:1}},
    {w:s=>s.t.luck*.12,t:T('You lose, but a chained prisoner trips him as he steps in to finish you. You get up. He does not.','你输了，可他上前要结果你时，一个戴锁链的犯人绊了他一跤。你爬起来了，他没有。'),c:'good',fx:{fame:3},next:'mw_raid3',keep:1}]},
  {l:T('Free the prisoners first','先放了被关的人'),out:[{w:s=>s.t.heart*.2,t:T('You break chains while others fight. Forty farmers go down the mountain alive, and tell everyone your name.','别人在打，你在砸锁。四十个庄稼汉活着下了山，见人就说你的名字。'),c:'gold',fx:{align:6,fame:3},next:'mw_raid3',keep:1},
    {w:1,t:T('The guardian sees you at the chains and comes for you. You get half of them out before he arrives.','护法看见你在砸锁，扑了过来。他赶到之前，你放走了一半。'),c:'muted',fx:{align:4,hurt:[8,15],cause:T('a dark faction’s guardian','邪派护法')},next:'mw_raid3',keep:1}]}]});
I({id:'mw_raid3',only:1,noThread:1,
 text:c=>T(`The stronghold of ${SECTS[c.dark].en} burns. In the leader’s room you find a ledger: payments, for years, to three elders of the righteous sects sitting in the alliance’s hall.`,`${SZ(c.dark)}的老巢烧起来了。在头领的屋里，你找到一本账簿：多年来，按时付给联盟大殿上三位正派长老的银子。`),
 opts:[{l:T('Read it out to the whole alliance','当着全盟念出来'),out:[{w:s=>s.fame/30+s.align/60,t:T('The hall erupts. Two elders are expelled; one flees. You have made enemies for life, and a name for longer.','大殿炸了锅。两位长老被逐出门墙，一个连夜跑了。你结下了一辈子的仇，也留下了比一辈子更长的名声。'),c:'gold',fx:{fame:8,align:5,enemy:1,deed:T('Exposed traitors in the righteous alliance','揭破正派联盟中的内奸')}},
    {w:1,t:T('Nobody believes a ledger from a demon’s room. You are quietly not invited to the victory feast.','谁会信魔头屋里的账本？庆功宴上，你悄悄地没被邀请。'),c:'bad',fx:{fame:-2,align:3}}]},
  {l:T('Burn it with the rest','和别的一起烧了'),out:[{w:2,t:T('Peace in the alliance is worth something too. You watch the pages curl.','联盟里的太平，也是值点什么的。你看着纸页卷起来。'),c:'muted',fx:{fame:3,align:-1}},
    {w:s=>s.smarts/40,t:T('You burn it, but you remember the names. One day that will matter.','你烧了它，可名字都记下了。总有一天用得上。'),c:'muted',fx:{fame:3,smarts:1}}]},
  {l:T('Keep it, and send each of them a page','留着，给每人寄去一页'),out:[{w:s=>s.smarts/30+s.t.luck*.1,t:T('Three elders pay generously for their pages, every year.','三位长老为了自己那一页，年年出手大方。'),c:'muted',fx:{money:[300,500],align:-8}},
    {w:1,t:T('One of them pays. One of them sends a killer. You survive, barely, and burn the rest of the book.','一个付了钱，一个派来了刺客。你死里逃生，把剩下的账本烧了。'),c:'bad',fx:{money:150,align:-6,hurt:[15,25],cause:T('an assassin sent by a blackmailed elder','被要挟长老派来的刺客')}}]}]});

/* protecting a witness */
I({id:'mw_witness1',age:[18,65],cd:15,w:1,tags:MWW,when:s=>power(s)>=20,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,sex:'m',age:rint(25,45)});c.k=pick(mwGood(s));c.help=0;c.lv=PW(1.05,2)(s);return c},
 text:c=>T(`A trembling clerk, ${c.npc.en}, grabs your sleeve. He saw an elder of ${SECTS[c.k].en} kill a magistrate, and the provincial court will hear him in ten days if he lives that long. Three men have already tried to stop him.`,`一个浑身发抖的书吏${c.npc.zh}拽住了你的袖子。他亲眼看见${SZ(c.k)}的一位长老杀了县令。十天后省里开堂，只要他能活到那天。已经有三拨人想让他闭嘴了。`),
 opts:[{l:T('Escort him to the court','护送他去省城'),out:[{w:2,t:T('You set off by the river road, his hand never far from your sleeve.','你们沿河道上了路，他的手一直不离你的袖子。'),c:'muted',next:'mw_witness2',keep:1},
    {w:s=>s.t.luck*.1+s.fame/60,t:T('An escort agency heading the same way offers two of its men, for the story of it.','一家同路的镖局派了两个镖师同行，说是图个故事。'),c:'good',fx:{f:(s,c)=>{c.help=1;c.lv=PW(.92,0)(s)}},next:'mw_witness2',keep:1}]},
  {l:T('Hide him in a temple','把他藏进寺里'),out:[{w:s=>s.smarts/25,t:T('The monks keep him for ten days. The killers search every inn and never the temple. He testifies.','僧人们把他藏了十天。杀手搜遍了客栈，偏偏没搜寺庙。他上堂作了证。'),c:'good',fx:{fame:2,align:4}},
    {w:1,t:T('A novice sells him for five taels. You find out a week later.','一个小沙弥五两银子就把他卖了。你一个礼拜后才知道。'),c:'bad',fx:{align:1,happy:-5}}]},
  {l:T('Not your fight','不关你的事'),out:[{w:2,t:T('You shake off his hand. Somebody else will help him, you tell yourself.','你甩开了他的手。总会有别人帮他，你这么告诉自己。'),c:'muted',fx:{align:-2}},
    {w:1,t:T('Ten days later you see his name on a notice: drowned, drunk, an accident.','十天后你在告示上看见了他的名字：酒后失足，溺水身亡。'),c:'bad',fx:{align:-2,happy:-4}}]}]});
I({id:'mw_witness2',only:1,noThread:1,
 text:()=>T('At a ferry crossing, the ferryman pushes off and three men come up from under the tarpaulin with knives.','到了一处渡口，船家刚撑离岸，三个汉子就从油布底下钻了出来，手里都握着刀。'),
 opts:[{l:T('Fight on the boat','船上迎敌'),fight:FG((s,c)=>c.lv,'injury',T('The ferry','渡船截杀'),T('assassins on a ferry','渡船上的刺客'),()=>T('the assassins','刺客')),
   win:[{w:2,t:T('Two go over the side. The third jumps. The clerk is sick into the river and thanks you between heaves.','两个被打下了船，第三个自己跳了。书吏趴在船边吐，边吐边谢你。'),c:'good',next:'mw_witness3',keep:1},
    {w:1,t:T('You win, with a knife cut across your forearm that will leave a scar.','你赢了，小臂上挨了一刀，以后会留疤。'),c:'muted',fx:{looks:-1,hurt:[3,7],cause:T('assassins on a ferry','渡船上的刺客')},next:'mw_witness3',keep:1}],
   lose:[{w:2,t:T('You go down and so does the clerk. You wake on the bank. He does not wake at all.','你倒下了，书吏也倒下了。你在岸边醒了过来，他再也没醒。'),c:'bad',fx:{happy:-6,f:s=>addCond(s,'wound',1)}},
    {w:s=>s.t.luck*.2,t:T('Losing, you grab the clerk and go over the side. You come up half a mile downstream, alive, together.','眼看要输，你抓起书吏就跳了河。在下游半里地冒出头来——两个人都活着。'),c:'muted',fx:{hurt:[4,8],cause:T('a river','河水')},next:'mw_witness3',keep:1}]},
  {l:T('Jump ashore and take the mountain path','跳上岸，改走山路'),out:[{w:s=>s.t.wit*.12+power(s)/80,t:T('You drag him ashore before the boat is out of reach. The mountain path costs three days and saves two lives.','船还没离远，你就把他拽上了岸。山路多走了三天，救了两条命。'),c:'good',next:'mw_witness3',keep:1},
    {w:1,t:T('The mountain path is cold and he falls ill. You carry him the last day.','山路又冷，他病倒了。最后一天是你背着他走的。'),c:'muted',fx:{hurt:[2,5],cause:T('a hard road','山路艰难')},next:'mw_witness3',keep:1}]}]});
I({id:'mw_witness3',only:1,noThread:1,
 text:c=>T(`The night before the hearing, a polite man from ${SECTS[c.k].en} visits your inn with a box. Five hundred taels, he says, if the clerk remembers things differently, and nobody else need be hurt.`,`开堂前一夜，${SZ(c.k)}来了个彬彬有礼的人，带着一只箱子找到你的客栈。五百两，他说，只要书吏记性差一点，就不必再伤人了。`),
 opts:[{l:T('Throw him out','把他轰出去'),out:[{w:s=>s.fame/30+s.align/50+.5,t:c=>T(`The clerk testifies, voice shaking. The elder is stripped of rank and handed to the court. ${SECTS[c.k].en} will not forgive you, and the county will not forget you.`,`书吏声音发颤，还是作了证。那位长老被革去名位，交给了官府。${SZ(c.k)}不会原谅你，这个县也忘不了你。`),c:'gold',fx:{fame:6,align:5,enemy:1,deed:T('Brought a witness alive to court','护送证人活着上堂')}},
    {w:1,t:T('He testifies, and the magistrate, who has also been visited, dismisses it. You did everything right, and it did not matter.','他作了证，可主审的官老爷也被人“拜访”过，当堂驳了回来。你什么都做对了，却一点用也没有。'),c:'bad',fx:{align:3,happy:-5}}]},
  {l:T('Take the money','收钱'),out:[{w:2,t:T('The clerk remembers things differently. He looks at you once, in the corridor, and never again.','书吏的记性果然差了。他在走廊里看了你一眼，以后再没看过。'),c:'bad',fx:{money:500,align:-8}},
    {w:1,t:T('They pay you, and then the clerk drowns anyway. You were never part of the plan, only the price.','他们给了钱，书吏还是淹死了。你从来不在人家的盘算里，只是个价码。'),c:'bad',fx:{money:500,align:-10,happy:-6}}]}]});

/* a dying master’s last request: a quest across years */
QHINT.mw_dy_1=T('A dying swordsman asked you to find his child and tell them who killed him.','一位垂死的剑客托你找到他的孩子，告诉孩子是谁杀了他。');
QHINT.mw_dy_2=T('You and the dead swordsman’s child are hunting the scarred man who killed him.','你和那剑客的孩子正在追查杀他的刀疤汉子。');
I({id:'mw_dying1',age:[16,60],once:1,w:.9,tags:MWW,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,sex:'m',age:rint(55,70)});c.kid=npc(s,{age:rint(18,26)});c.foe=foeName();return c},
 text:c=>T(`In a ditch by the road lies a grey-haired swordsman with black lips. “Poison… a man with a scar, ${c.foe.en}. My child, ${c.kid.en}, doesn’t know. Find ${c.kid.him}. Tell ${c.kid.him}.” He presses a jade token into your hand.`,`路边沟里躺着个须发花白的剑客，嘴唇发黑。“毒……一个刀疤脸，叫${c.foe.zh}。我的孩子${c.kid.zh}还不知道。找到${c.kid.ta}。告诉${c.kid.ta}。”他把一块玉牌塞进了你手里。`),
 opts:[{l:T('Promise him','答应他'),out:[{w:2,t:T('He dies holding your sleeve. You bury him under a pine and keep the token.','他攥着你的袖子咽了气。你把他葬在一棵松树下，收好了玉牌。'),c:'muted',fx:{align:3,flag:'mw_dy_1',f:(s,c)=>{s.mwDy={kid:{en:c.kid.en,zh:c.kid.zh,ta:c.kid.ta,him:c.kid.him},foe:c.foe}}}},
    {w:s=>s.t.heart*.15,t:T('He lives long enough to show you one sword form with a shaking hand. “So you’ll know it is really from me.”','他撑着最后一口气，用发抖的手给你比划了一式剑招。“这样孩子就知道，真是我托的你。”'),c:'muted',fx:{skill:1,align:3,flag:'mw_dy_1',f:(s,c)=>{s.mwDy={kid:{en:c.kid.en,zh:c.kid.zh,ta:c.kid.ta,him:c.kid.him},foe:c.foe}}}}]},
  {l:T('Try to save him','设法救他'),out:[{w:s=>s.smarts/30,t:T('The poison is too deep, but you recognise it: snake-flower, from the southwest. He dies. You promise anyway.','毒入得太深，可你认出来了：西南的蛇花毒。他还是死了。你照样答应了他。'),c:'muted',fx:{smarts:1,align:3,flag:'mw_dy_1',f:(s,c)=>{s.mwDy={kid:{en:c.kid.en,zh:c.kid.zh,ta:c.kid.ta,him:c.kid.him},foe:c.foe}}}},
    {w:s=>s.t.luck*.06,t:c=>T(`Against all sense, he lives. When he can sit up, ${c.npc.en} looks at you a long time. “I owe you a life. I can pay it in swordsmanship.”`,`他竟然活了过来。能坐起身时，${c.npc.zh}盯着你看了许久。“我欠你一条命，拿剑法还吧。”`),c:'gold',fx:{meet:'master',bond:75,skill:2,align:4}},
    {w:1,t:T('You do what you can. It is not enough. You keep his token and do not quite promise.','你尽了力，还是不够。你收下了玉牌，却没敢把话说死。'),c:'muted',fx:{item:'jadecharm'}}]},
  {l:T('Take the token and go','拿了玉牌走人'),out:[{w:2,t:T('It is good jade. It is also, in some way you cannot explain, very heavy.','是块好玉。可不知怎的，沉得很。'),c:'bad',fx:{item:'jadecharm',align:-4}},
    {w:1,t:T('The token turns out to be painted glass. Whatever you were hoping for, this is what you get.','那玉牌原来是上了色的玻璃。你想要的是什么都好，你拿到的就是这个。'),c:'muted',fx:{align:-3}}]}]});
I({id:'mw_dying2',need:'mw_dy_1',once:1,w:7,tags:MWW,when:s=>s.age-s.flags.mw_dy_1>=1&&!!s.mwDy,
 text:(c,s)=>{const d=s.mwDy;return T(`After a year of asking, you find ${d.kid.en} selling noodles in a market town. You show the token. Then you tell ${d.kid.him} about the ditch, and the scar, and the name ${d.foe.en}.`,`打听了一年，你终于在一个集镇上找到了${d.kid.zh}，正在摆摊卖面。你亮出玉牌，然后讲了那条沟、那道疤，还有${d.foe.zh}这个名字。`)},
 opts:[{l:T('Help hunt the killer','帮着找凶手'),out:[{w:2,t:T('The noodle stall is sold by evening. You set out together.','面摊当天傍晚就盘了出去。你们一同上了路。'),c:'muted',fx:{unflag:'mw_dy_1',flag:'mw_dy_2',align:2}},
    {w:s=>s.smarts/30,t:T('You start with the poison. Snake-flower is sold in only three towns. It is a short list.','你们从毒查起。蛇花毒只有三个镇子有卖。名单不长。'),c:'good',fx:{unflag:'mw_dy_1',flag:'mw_dy_2',smarts:1}}]},
  {l:T('Urge them to let it go','劝其放下'),out:[{w:s=>s.t.heart*.2,t:T('It takes all night. In the morning the token goes into the family shrine and the noodle stall opens on time. You eat there whenever you pass.','劝了一整夜。第二天早上，玉牌供进了祖先牌位前，面摊照常开张。往后你每回路过都去吃一碗。'),c:'good',fx:{unflag:'mw_dy_1',align:4,happy:3,f:s=>{delete s.mwDy}}},
    {w:1,t:T('They hear you out politely, and leave alone that same night. You set off after them.','对方客客气气听你说完，当夜就一个人走了。你只好跟了上去。'),c:'muted',fx:{unflag:'mw_dy_1',flag:'mw_dy_2'}}]}]});
I({id:'mw_dying3',need:'mw_dy_2',once:1,w:7,tags:MWW,when:s=>s.age-s.flags.mw_dy_2>=1&&!!s.mwDy,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,sex:'m',age:rint(55,68),lv:PW(1.05,2)(s)});const d=s.mwDy;c.npc.en=d.foe.en;c.npc.zh=d.foe.zh;c.d=d;return c},
 text:c=>T(`You find ${c.d.foe.en} at last: white-haired now, a respected elder about to hand his school to his son, surrounded by grandchildren. The scar is still there. ${c.d.kid.en} has a hand on a knife.`,`你们终于找到了${c.d.foe.zh}：如今头发全白，是个受人敬重的老前辈，正要把武馆传给儿子，膝下孙儿成群。那道疤还在。${c.d.kid.zh}的手按在了刀上。`),
 opts:[{l:T('Challenge him openly','当面下战书'),fight:FG((s,c)=>c.npc.lv,'injury',T('The old debt','旧债'),T('an old murderer','当年的凶手')),
   win:[{w:2,t:c=>T(`He falls in his own courtyard. ${c.d.kid.en} finishes it. Nobody in the school stops you; some of them had wondered for years.`,`他倒在了自家院子里。${c.d.kid.zh}了结了这桩事。武馆里没人拦你们——有些人心里早就疑了好些年。`),c:'gold',fx:{fame:5,align:2,unflag:'mw_dy_2',deed:T('Kept a promise to a dying stranger','守住了对一个垂死陌生人的承诺'),f:s=>{delete s.mwDy}}},
    {w:s=>s.t.heart*.15,t:c=>T(`You beat him, then catch ${c.d.kid.en}’s wrist. On his knees, in front of his grandchildren, the old man confesses. That is worse for him than dying.`,`你打倒了他，又攥住了${c.d.kid.zh}的手腕。老头当着孙儿们的面跪下认了罪。这比死还叫他难受。`),c:'gold',fx:{fame:4,align:6,unflag:'mw_dy_2',deed:T('Kept a promise to a dying stranger','守住了对一个垂死陌生人的承诺'),f:s=>{delete s.mwDy}}}],
   lose:[{w:2,t:T('He is old but he is not slow. He spares you, which you will think about for the rest of your life.','他老了，可一点也不慢。他饶了你一命——这件事你会想一辈子。'),c:'bad',fx:{unflag:'mw_dy_2',f:s=>{addCond(s,'inner',1);delete s.mwDy}}},
    {w:1,t:c=>T(`While he is busy with you, ${c.d.kid.en} slips behind him. It is over before you can get up. You are not sure how you feel.`,`他正忙着对付你，${c.d.kid.zh}绕到了他身后。你还没爬起来，事情就完了。你说不清心里是什么滋味。`),c:'muted',fx:{unflag:'mw_dy_2',fame:2,f:s=>{delete s.mwDy}}}]},
  {l:T('Expose him before the whole town','当着全镇揭穿他'),out:[{w:s=>s.fame/30+s.smarts/50,t:T('You bring the poison-seller, the token and the dates. The town turns its back on him. He leaves within the month, alone.','你带来了卖毒的人、那块玉牌和年月日。全镇人都背过了身。不到一个月，他一个人走了。'),c:'good',fx:{fame:4,align:4,unflag:'mw_dy_2',f:s=>{delete s.mwDy}}},
    {w:1,t:T('Nobody believes a stranger over a grandfather. You are run out of town.','谁会信外人而不信一位老爷爷？你被赶出了镇子。'),c:'bad',fx:{fame:-2,unflag:'mw_dy_2',f:s=>{delete s.mwDy}}}]},
  {l:T('Walk away','转身离开'),out:[{w:1,t:c=>T(`${c.d.kid.en} calls you a coward and stays. You never learn how it ended.`,`${c.d.kid.zh}骂你是懦夫，自己留了下来。你始终不知道后来怎样了。`),c:'muted',fx:{align:-1,unflag:'mw_dy_2',f:s=>{delete s.mwDy}}},
    {w:s=>s.t.heart*.15,t:c=>T(`${c.d.kid.en} watches the grandchildren for a long time, then takes your arm and walks away with you. “He’ll die soon enough. Let them have him till then.”`,`${c.d.kid.zh}看着那些孙儿看了许久，挽起你的胳膊，跟你一起走了。“他也活不了多久了。就让孩子们再有他几年吧。”`),c:'good',fx:{align:4,unflag:'mw_dy_2',f:s=>{delete s.mwDy}}}]}]});

/* star-iron for an old swordsmith: a quest across years */
QHINT.mw_fg_1=T('An old swordsmith will forge you a blade if you bring him star-iron.','老铸剑师答应，你若寻来天外陨铁，便为你铸一口剑。');
QHINT.mw_fg_2=T('The star-iron is in the swordsmith’s furnace. The blade will take a year.','陨铁已入了铸剑师的炉子，剑要一年才成。');
I({id:'mw_forge1',age:[18,60],once:1,w:.9,tags:['wander','town'],when:s=>power(s)>=20,
 text:()=>T('A famous old swordsmith, retired for twenty years, watches you practise and says he has one sword left in his hands. “Bring me star-iron from the crater at Fallen Star Ridge, and it is yours.”','一位封炉二十年的老铸剑师看你练剑，开口说他手上还剩最后一口剑的力气。“去落星岭的陨坑给我取块天外陨铁来，剑就是你的。”'),
 opts:[{l:T('Promise to bring it','答应去取'),out:[{w:2,t:T('He nods and goes back inside. He does not ask your name; he says he will know you.','他点点头回了屋。他没问你的名字，说到时候认得出你。'),c:'muted',fx:{flag:'mw_fg_1'}},
    {w:s=>s.smarts/40,t:T('He draws you a map on the back of a receipt, and warns you that the crater has a keeper.','他在一张收据背面给你画了张图，还提醒你陨坑有人守着。'),c:'muted',fx:{flag:'mw_fg_1',smarts:1}}]},
  {l:T('Decline politely','婉拒'),out:[{w:2,t:T('“Then someone else will have it,” he says, without much interest.','“那就给别人。”他说，并不怎么在意。'),c:'muted'},
    {w:1,t:T('You hear years later that his last sword went to a girl from the hills, who became famous with it.','多年后你听说，他那最后一口剑给了山里来的一个姑娘，她凭着那口剑出了名。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'mw_forge2',need:'mw_fg_1',once:1,w:7,tags:MWW,when:s=>s.age-s.flags.mw_fg_1>=1,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:4,sex:'m',age:rint(45,65),lv:PW(1,1)(s)});return c},
 text:c=>T(`At Fallen Star Ridge the crater is guarded by a monk, ${c.npc.en}, who has kept it for thirty years. “The star fell for a reason,” he says. “Tell me yours.”`,`落星岭的陨坑有个和尚守着，法号${c.npc.zh}，守了三十年。“星星落下来，是有缘故的。”他说，“说说你的。”`),
 opts:[{l:T('Offer silver for the temple (200 taels)','给寺里捐银子（二百两）'),cost:200,out:[{w:2,t:T('He weighs the silver in his hand, then cuts you a piece the size of a fist.','他掂了掂银子，给你凿下拳头大的一块。'),c:'good',fx:{unflag:'mw_fg_1',flag:'mw_fg_2'}},
    {w:s=>s.t.luck*.15,t:T('He gives you the piece and returns half your silver. “The roof only needs a hundred.”','他给了你陨铁，又退了一半银子。“房顶修修，一百两就够。”'),c:'good',fx:{money:100,unflag:'mw_fg_1',flag:'mw_fg_2'}}]},
  {l:T('Steal a piece at night','夜里偷一块'),out:[{w:s=>s.t.luck*.2+s.smarts/50,t:T('You are out of the crater before the night bell. The iron is warm in your bag, or you imagine it is.','夜钟响之前你就出了陨坑。包里的陨铁是温的，也许只是你的错觉。'),c:'muted',fx:{align:-3,unflag:'mw_fg_1',flag:'mw_fg_2'}},
    {w:1.2,t:T('The monk is sitting on the very stone you came for. He says nothing. You leave with nothing, and the promise goes cold.','和尚就坐在你要偷的那块石头上，一言不发。你空手而回，那桩约定也就凉了。'),c:'bad',fx:{align:-2,happy:-4,unflag:'mw_fg_1'}}]},
  {l:T('Ask to test yourself against him','请与他过招'),fight:FG((s,c)=>c.npc.lv,'light',T('The keeper of the crater','守坑僧'),T('a crater’s keeper','守坑老僧')),
   win:[{w:2,t:T('He bows when it is done. “That is a reason.” He gives you the iron himself.','打完他合十一礼。“这就是缘故。”亲手把陨铁给了你。'),c:'good',fx:{fame:2,unflag:'mw_fg_1',flag:'mw_fg_2'}},
    {w:1,t:T('He gives you the iron and a lecture about humility, in that order.','他先给了你陨铁，然后讲了一通谦逊的道理。'),c:'good',fx:{unflag:'mw_fg_1',flag:'mw_fg_2',smarts:1}}],
   lose:[{w:2,t:T('“Not yet,” he says, kindly. The swordsmith dies that winter, still waiting.','“还不到时候。”他和气地说。那年冬天，铸剑师还没等到，就走了。'),c:'bad',fx:{unflag:'mw_fg_1',happy:-4}},
    {w:s=>s.t.heart*.15,t:T('You lose, and thank him, and he gives you a small piece anyway for the thanking.','你输了，道了声谢。冲这一声谢，他还是给了你一小块。'),c:'muted',fx:{unflag:'mw_fg_1',flag:'mw_fg_2'}}]}]});
I({id:'mw_forge3',need:'mw_fg_2',once:1,w:7,tags:MWW,when:s=>s.age-s.flags.mw_fg_2>=1,
 text:()=>T('The swordsmith sends word: it is done. You find him grey and thin at his forge, the blade on the anvil black as a winter night. “It needs tempering. In water, or in blood. The blade will remember which.”','铸剑师捎来话：成了。你见他又瘦又灰地坐在炉边，砧上的剑黑得像冬夜。“还差一道淬火。用水，还是用血。剑会记住的。”'),
 opts:[{l:T('Temper it with your own blood','以自己的血淬剑'),out:[{w:s=>s.t.heart*.2,t:T('You open your palm over the blade. It drinks, and rings, and goes cold as ice. It will never cut you.','你在剑上割开掌心。剑吸了血，铮然作响，转眼冷得像冰。它永远不会伤你。'),c:'gold',fx:{item:'coldsaber',qi:2,maxHealth:-2,unflag:'mw_fg_2',deed:T('Carried the last blade of an old master smith','佩着老铸剑师的封炉之作')}},
    {w:1,t:T('It drinks more than you meant to give. You faint by the anvil. The blade is magnificent; you are pale for a year.','它喝的比你想给的多。你晕倒在砧边。剑好得惊人，你却苍白了一整年。'),c:'muted',fx:{item:'coldsaber',maxHealth:-4,unflag:'mw_fg_2'}}]},
  {l:T('Temper it in spring water','用泉水淬火'),out:[{w:2,t:T('The steam fills the forge. The blade comes out true and bright, a fine sword by any measure.','蒸汽灌满了铸剑房。剑出水时笔直明亮，怎么看都是一口好剑。'),c:'good',fx:{item:'steelsword',unflag:'mw_fg_2'}},
    {w:s=>s.t.luck*.2,t:T('The water is from a spring under the star-crater. The blade comes out as cold and dark as the night it fell.','那泉水正出自陨坑底下。剑出水时又冷又暗，就像陨星坠落的那个夜晚。'),c:'gold',fx:{item:'coldsaber',unflag:'mw_fg_2'}}]},
  {l:T('Ask him to keep it as his last work','请他留下，作封炉之作'),out:[{w:2,t:T('He weeps, hangs it over his bed, and dies under it that spring, smiling. His sons send you his hammer.','他哭了，把剑挂在床头。那年春天，他在剑下含笑而逝。他的儿子们给你送来了他的铁锤。'),c:'good',fx:{align:4,fame:2,happy:2,unflag:'mw_fg_2'}},
    {w:s=>s.t.heart*.12,t:T('“No,” he says. “A sword on a wall is a dead sword.” He makes you take a different one, heavier, from under the bed. “This one I was saving.”','“不，”他说，“挂在墙上的剑是死剑。”他从床底下拖出另一口更沉的剑，硬塞给你。“这口，我一直留着。”'),c:'gold',fx:{item:'heavysword',unflag:'mw_fg_2'}}]}]});
