/* 江湖一生 · what your name, face, mood and mind do for you, and to you.
   Being unknown means nobody trusts you, and also nobody is watching; being famous opens doors and draws trouble.
   Looks, spirits, learning and insight change through events, and change how events go. */
'use strict';
const lowFame=s=>s.fame<15,midFame=s=>s.fame>=20&&s.fame<60,highFame=s=>s.fame>=60;
const FW=['wander','town'];

/* ================= fame: unknown ================= */
I({id:'fm_nobodywarn',age:[16,70],cd:12,w:1.6,tags:FW,when:lowFame,ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(55,70)});c.lv=PW(1,4)(s);return c},
 text:c=>T(`You overhear bandits planning to raid a village tonight. You run to warn the headman, ${c.npc.en}, who looks you up and down: "And who are you, exactly?"`,`你偷听到山贼今夜要洗劫一个村子，赶去报信。村长${c.npc.zh}上下打量你："你又是哪位？"`),
 opts:[{l:T('Convince him','设法说服他'),out:[{w:s=>s.smarts/25+s.looks/50,t:T('Something in how you say it gets through. The village is ready; the bandits turn back. Afterwards, they ask your name.','你说话的样子让人信了。村里早有防备，山贼掉头走了。事后，村里人问起你的名字。'),c:'good',fx:{fame:3,align:3}},
   {w:2,t:T('He laughs you off. In the morning half the village is burning, and the headman will not meet your eye.','他一笑置之。第二天一早，半个村子在烧，村长不敢看你。'),c:'bad',fx:{happy:-6}}]},
  {l:T('Defend it yourself','自己去守'),fight:FG((s,c)=>c.lv,'injury',T('A village at night','守村之夜'),T('the bandits','山贼'),()=>T('the bandits','山贼')),
   win:[{t:T('You hold the bridge alone until dawn. Nobody doubts you after that.','你一个人守着桥头直到天亮。从此没人再怀疑你。'),c:'gold',fx:{fame:6,align:4}}],
   lose:[{t:T('You are one person. You do what one person can.','你只是一个人，尽了一个人能尽的力。'),c:'bad',fx:{align:2}}]},
  {l:T('Not your village','不是你的村子'),out:[{t:T('You walk on. That night you see the glow on the horizon.','你走了。那天夜里，你看见天边一片红光。'),c:'muted',fx:{align:-3}}]}]});
I({id:'fm_nobodyjob',age:[16,60],cd:8,w:1.6,tags:FW,when:s=>lowFame(s)&&power(s)>=20,ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:rint(35,55)});return c},
 text:c=>T(`A salt merchant, ${c.npc.en}, needs a guard. He offers the job to a known escort for 80 taels, and to you, a nobody, for 20.`,`盐商${c.npc.zh}要雇护卫。给有名号的镖师开价八十两，给你这个无名小卒只开二十两。`),
 opts:[{l:T('Show him what you can do','露一手给他看'),out:[{w:s=>power(s)/40,t:T('You split a stone post with your palm. He doubles the offer without a word.','你一掌劈裂了一根石桩。他一言不发，把价钱翻了一倍。'),c:'good',fx:{money:40,fame:1}},{w:1.5,t:T('Your demonstration goes badly. He keeps the offer at twenty, out of pity.','你露的那一手不太成功。他出于同情，还是给二十两。'),c:'muted',fx:{money:20,happy:-2}}]},
  {l:T('Take twenty and prove it on the road','先拿二十两，路上见分晓'),out:[{w:2,t:T('Bandits come; you see them off. At the end he pays sixty and remembers your name.','路上来了劫匪，被你打发了。到头他付了六十两，记住了你的名字。'),c:'good',fx:{money:60,fame:2}},{w:1,t:T('An uneventful trip. Twenty taels, and no story to tell.','一路无事。二十两，也没什么可讲的。'),c:'muted',fx:{money:20}}]},
  {l:T('Refuse to be cheapened','不肯贱卖'),out:[{t:T('He shrugs and hires someone else. Pride is expensive.','他耸耸肩，雇了别人。骨气是要花钱的。'),c:'muted'}]}]});
I({id:'fm_nobodyspy',age:[16,60],cd:10,w:1.4,tags:FW,when:lowFame,ctx:s=>{const c=scene();c.npc=npc(s,{occ:9,age:rint(30,50)});return c},
 text:c=>T(`Constable ${c.npc.en} needs someone nobody would recognise to sit in a gang’s gambling den and listen. "Your face is perfect. Nobody knows it."`,`捕头${c.npc.zh}需要一个没人认得的人，混进帮会的赌坊里打听消息。"你这张脸正好，谁也不认得。"`),
 opts:[{l:T('Do it','答应'),out:[{w:s=>2+s.smarts/40-s.looks/60,t:T('For a month you are furniture. You hear everything. The gang is broken; you are paid well and quietly.','一个月里你就像屋里的一件家具，什么都听见了。帮会被一锅端，你得了一笔不声张的赏钱。'),c:'good',fx:{money:[60,120],align:3,smarts:2}},
   {w:s=>s.looks/40,t:T('Someone remembers your face after all: too handsome to be a gambler. You leave through a window.','到底还是有人记住了你的脸：长得太周正，不像赌徒。你翻窗逃了出去。'),c:'bad',fx:{hurt:[5,14],cause:T('a den of gamblers','赌坊之祸')}}]},
  {l:T('Decline','推辞'),out:[{t:T('He finds someone plainer.','他另找了个更不起眼的人。'),c:'muted'}]}]});

/* ================= fame: known in the region ================= */
I({id:'fm_impostor',age:[18,80],cd:15,tags:FW,when:s=>s.fame>=20,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(20,40)});c.lv=PW(.85,2)(s);return c},
 text:(c,s)=>T(`In a town you have never visited, people greet you oddly. A man has been using your name, ${s.name}, to borrow money, eat on credit, and court a widow.`,`你从没去过的一个镇上，人们见了你神色古怪。原来有个人冒用你的名号${s.cn}，借钱、赊账，还向一个寡妇提了亲。`),
 opts:[{l:T('Find him','找到他'),fight:FG((s,c)=>c.lv,'light',T('The other you','冒名之人'),T('the impostor','冒名者')),
   win:[{w:2,t:T('You march him round town to repay everyone. The widow is disappointed in both of you.','你押着他挨家挨户还钱。那个寡妇对你们俩都很失望。'),c:'good',fx:{fame:2,align:2}},{w:1,t:T('He weeps that he only did it because your name opened doors his never could. You let him keep a little of it.','他哭着说，只是因为你的名字能敲开他敲不开的门。你让他留了一点体面。'),c:'muted',fx:{align:3}}],
   lose:[{t:T('The impostor beats you. Now the town is not sure which of you is real.','冒牌货把你打败了。这下镇上的人更分不清哪个是真的了。'),c:'bad',fx:{fame:-4}}]},
  {l:T('Pay his debts to protect your name','替他还债，保住名声'),cost:80,out:[{t:T('Your name is clean again, and eighty taels lighter.','你的名声干净了，钱袋轻了八十两。'),c:'muted',fx:{fame:1}}]},
  {l:T('Ignore it','不理'),out:[{w:1,t:T('He moves on to another town. Your name goes with him, a little dirtier each time.','他换了个镇子接着干。你的名字跟着他走，每到一处就脏一点。'),c:'bad',fx:{fame:-3,align:-1}},{w:1,t:T('He is caught on his own, and the story makes you laugh for years.','他自己栽了。这事你笑了好几年。'),c:'muted',fx:{happy:3}}]}]});
I({id:'fm_plea',age:[18,85],cd:8,tags:FW,when:s=>s.fame>=20,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([0,27,18]),age:rint(40,70)});c.foe=foeName();c.lv=PW(1,4)(s);return c},
 text:c=>T(`${c.npc.desc.en} ${c.npc.en} has walked two days to find you. "They say you are fair. ${c.foe.en} took our land and beat my son. Nobody else will help."`,`${c.npc.desc.zh}${c.npc.zh}走了两天路来找你。"都说您公道。${c.foe.zh}占了我家的地，打伤了我儿子。没人肯管。"`),
 opts:[{l:T('Go and settle it','去主持公道'),fight:FG((s,c)=>c.lv,'injury',T('A wrong set right','打抱不平'),T('the land-grabber','恶霸')),
   win:[{t:T('The land is returned. Your name means a little more in that county now.','地还回来了。从此你的名字在那个县里更有分量。'),c:'good',fx:{fame:3,align:4}}],
   lose:[{t:T('You fail them. The story of that travels too.','你没能帮上忙。这事也传开了。'),c:'bad',fx:{fame:-3}}]},
  {l:T('Write a letter in your name','以你的名义写封信'),if:s=>s.fame>=35,out:[{w:s=>s.fame/30,t:T('The letter alone is enough. The land-grabber backs down rather than cross you.','光是这封信就够了。恶霸宁可让步，也不愿得罪你。'),c:'good',fx:{fame:1,align:3}},{w:1.5,t:T('He tears the letter up in public. Now it is about your name.','他当众把信撕了。这下事关你的脸面了。'),c:'bad',fx:{fame:-2}}]},
  {l:T('Send them away','打发走'),out:[{t:T('“So much for fairness,” the old man says, and goes home.','"什么公道。"老人说完，回家去了。'),c:'muted',fx:{fame:-2,align:-2}}]}]});
I({id:'fm_patron',age:[20,80],cd:12,when:s=>s.fame>=25,ctx:s=>{const c=scene();c.npc=npc(s,{occ:11,age:rint(40,60)});return c},
 text:c=>T(`A rich man, ${c.npc.en}, wants you at his table: your name will make his banquet. He presses a purse of silver on you for coming.`,`富户${c.npc.zh}请你赴宴：有你在，他的宴席就有面子。光是赏脸来坐坐，就塞给你一袋银子。`),
 opts:[{l:T('Take the silver and the seat','收下银子，赴宴'),out:[{w:2,t:T('An easy evening and a full purse.','一个轻松的晚上，一袋沉甸甸的银子。'),c:'good',fx:{money:[40,120]}},{w:1,t:T('A year later he asks a favour: frighten a tenant who will not pay. You are in his debt.','一年后他开口求你一件事：去吓唬一个交不起租的佃户。你欠着他的情。'),c:'muted',fx:{money:[40,120],align:-3,happy:-2}}]},
  {l:T('Come, but refuse the silver','赴宴，但不收钱'),out:[{t:T('He is confused, then impressed. Your name is worth more for not being for sale.','他先是不解，后来是佩服。不肯卖的名字，反倒更值钱。'),c:'good',fx:{fame:2}}]},
  {l:T('Decline','不去'),out:[{t:T('He finds another famous guest. There are always more.','他另请了一位有名的客人。有名的人总是有的。'),c:'muted'}]}]});

/* ================= fame: famous across the jianghu ================= */
I({id:'fm_arbiter',age:[25,95],cd:10,when:highFame,ctx:s=>{const ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&k!==s.sect);const c=scene();c.a=pick(ks);c.b=pick(ks.filter(k=>k!==c.a));return c},
 text:c=>T(`${SECTS[c.a].en} and ${SECTS[c.b].en} are close to open war over a disputed mountain spring. Both have agreed to accept your judgement. Both expect to win.`,`${SECTS[c.a].cn}和${SECTS[c.b].cn}为一处山泉争得快要动刀。双方都答应听你裁决，也都以为自己会赢。`),
 opts:[{l:T('Judge fairly, and split it','秉公裁决，各让一步'),out:[{w:s=>1+s.smarts/40,t:T('Both sides grumble, which is how you know it was fair. War is avoided.','两边都有怨言，可见是公道的。一场干戈就此化解。'),c:'good',fx:{fame:4,align:3}},{w:1,t:T('Both sides feel cheated and both now resent you a little.','两边都觉得吃了亏，也都对你有了点怨气。'),c:'muted',fx:{fame:-2}}]},
  {l:T('Side with the stronger sect','偏向势大的一方'),out:[{t:(c)=>T(`${SECTS[c.a].en} is grateful and generous. ${SECTS[c.b].en} will not forget.`,`${SECTS[c.a].cn}感激不尽，出手大方。${SECTS[c.b].cn}不会忘记这件事。`),c:'muted',fx:{money:[100,250],align:-4,enemy:1}}]},
  {l:T('Refuse to be dragged in','不趟这浑水'),out:[{t:T('They fight. People say you could have stopped it.','他们打了起来。人们说，你本可以拦住的。'),c:'bad',fx:{fame:-4}}]}]});
I({id:'fm_youngblood',age:[25,95],cd:6,when:highFame,ctx:s=>{const c=scene();c.npc=npc(s,{sex:'m',age:rint(17,24),lv:PW(rint(75,100)/100,0)(s)});return c},
 text:c=>T(`A young swordsman, ${c.npc.en}, blocks the road. "If I beat you, everyone will know my name." Fame has made you a stepping stone.`,`一个年轻剑客${c.npc.zh}拦在路上。"打赢了你，天下就都知道我的名字了。"名气大了，你就成了别人的垫脚石。`),
 opts:[{l:T('Teach the lesson gently','点到为止，教训一下'),fight:FG((s,c)=>c.npc.lv,'spar',T('A young challenger','少年挑战'),T('the young challenger','少年剑客')),
   win:[{w:2,t:T('You disarm him and give the sword back. He bows, and leaves wiser.','你缴了他的剑，又还给他。他行了一礼，走时懂事了些。'),c:'good',fx:{fame:1,meet:'acq',bond:60}},{w:1,t:T('You win. He swears he will be back in ten years. He means it.','你赢了。他发誓十年后再来。他是认真的。'),c:'muted',fx:{fame:1}}],
   lose:[{t:T('The boy wins. By nightfall the whole jianghu knows his name, and how he got it.','少年赢了。天黑之前，整个江湖都知道了他的名字，以及他是怎么出的名。'),c:'bad',fx:{fame:-8,happy:-6}}]},
  {l:T('Refuse to fight a child','不跟孩子动手'),out:[{w:2,t:T('He calls you a coward to anyone who will listen. Few believe him.','他逢人便说你是胆小鬼。没几个人信。'),c:'muted',fx:{fame:-1}},{w:1,t:T('He follows you for a week, then asks to be taught instead.','他跟了你一个星期，后来改口求你教他。'),c:'good',fx:{meet:'disciple',bond:55}}]}]});
I({id:'fm_noprivacy',age:[25,95],cd:12,when:highFame,
 text:()=>T('Your fame has a cost: strangers come to your door every day, asking for money, lessons, judgements, or just to look at you. Your family cannot go to market in peace.','名气是有代价的：天天有生人上门，借钱的、拜师的、求你评理的，还有单纯来看你一眼的。家里人连上街买菜都不得清静。'),
 opts:[{l:T('Hire a gatekeeper (60 taels a year)','雇个门房（每年六十两）'),cost:60,out:[{t:T('The gatekeeper is stern and slightly deaf. Peace returns, and a little of your reputation for kindness goes.','门房板着脸，耳朵还有点背。清静回来了，你"待人宽厚"的名声也少了一点。'),c:'muted',fx:{happy:4,fame:-1}}]},
  {l:T('Move somewhere quieter','搬个清静地方'),out:[{t:T('A valley where nobody reads the news. You miss being someone, a little.','搬到一个没人听说过你的山谷。有时候，你会有点怀念被人认得的日子。'),c:'muted',fx:{happy:5,fame:-5}}]},
  {l:T('Let them come','由他们来'),out:[{w:2,t:T('You see everyone. It exhausts you, and it is the most good you do all year.','你挨个见了。累得够呛，却也是你今年做的最多好事。'),c:'good',fx:{happy:-5,align:3,fame:2}},{w:1,t:T('One of the visitors is not what he seems. Your house is robbed that night.','来客里有一个不怀好意。当夜你家就失了窃。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,rint(50,200)))}}]}]});
I({id:'fm_smear',age:[25,95],cd:12,when:s=>s.fame>=40,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(30,60)});return c},
 text:c=>T(`A story is going around: that you won your most famous fight by poison. It started with ${c.npc.en}, who has reasons to want you smaller.`,`江湖上传开一个说法：你最出名的那一战，是靠下毒赢的。始作俑者是${c.npc.zh}，此人巴不得你栽跟头。`),
 opts:[{l:T('Answer it in public, calmly','当众从容澄清'),out:[{w:s=>s.smarts/30+s.align/40,t:T('You lay out what happened, with witnesses. The story turns on its teller.','你把经过一五一十摆出来，还有人作证。流言反咬了散布它的人。'),c:'good',fx:{fame:3}},{w:1.5,t:T('Denials only spread it further.','越辩解，传得越远。'),c:'bad',fx:{fame:-4}}]},
  {l:T('Challenge the teller','找造谣者算账'),fight:FG(PW(.9,3),'injury',T('Answering a lie','以武证名'),T('the slanderer','造谣者')),
   win:[{t:T('Nobody repeats the story in your hearing again. Some repeat it elsewhere.','从此没人当着你的面再提。背地里还是有人说。'),c:'muted',fx:{fame:1}}],lose:[{t:T('Losing seems to confirm it.','这一败，倒像是坐实了流言。'),c:'bad',fx:{fame:-6}}]},
  {l:T('Ignore it','置之不理'),out:[{w:1,t:T('It dies down by spring. Mostly.','开春时差不多就淡了。差不多。'),c:'muted',fx:{fame:-1}},{w:1,t:T('It hardens into something people “just know”.','它成了人人"都知道"的事。'),c:'bad',fx:{fame:-5}}]}]});
I({id:'fm_credit',age:[22,90],cd:12,when:s=>s.fame>=50,ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:rint(40,60)});return c},
 text:c=>T(`Because of your name, the merchant ${c.npc.en} offers to make you a partner in a silk venture: your name on the banner, his money in the bales, the profit split.`,`冲着你的名号，商人${c.npc.zh}提出与你合伙做丝绸买卖：旗号用你的名字，本钱他出，赚了对半分。`),
 opts:[{l:T('Agree','答应'),out:[{w:3,t:T('Your name sells silk. Your share is generous.','你的名字真能卖丝绸。你分得的那份很可观。'),c:'good',fx:{money:[150,400]}},{w:1,t:T('The venture fails, and the creditors come to the name on the banner: yours.','买卖赔了。债主们找上门来，找的是旗号上那个名字——你的。'),c:'bad',fx:{money:-150,fame:-3}}]},
  {l:T('Decline','婉拒'),out:[{t:T('Your name stays yours.','你的名字还是你自己的。'),c:'muted'}]}]});

/* fame changes how the world treats you every year, quietly */
const _yearlyFame=yearly;
yearly=function(s){_yearlyFame(s);if(!s.alive||s.age<16)return;
  if(s.fame>=60&&chance(.15)){const g=rint(10,40);pay(s,g);say(s,`Because of your name, a shopkeeper will not take your money. (${g} taels saved this year.)`,`冲着你的名号，有家铺子坚决不收你的钱。（今年省了${g}两）`,'muted')}
  else if(s.fame<5&&s.age>=20&&chance(.08))say(s,'Nobody notices you come or go. Some days it is a relief; some days it is lonely.','你来来去去，没人留意。有些日子是种解脱，有些日子是种寂寞。','muted');
  /* fame fades if you do nothing to earn it */
  if(s.fame>30&&chance(.5))s.fame=Math.max(0,s.fame-1)};

/* ================= looks ================= */
I({id:'st_scar',age:[16,70],cd:30,once:1,w:.7,when:s=>s.looks>=30&&s.bt>=5,
 text:()=>T('An old blade wound on your face heals badly, leaving a scar from brow to jaw.','脸上一道旧刀伤长得不好，从眉骨到下颌留下一道疤。'),
 opts:[{l:T('Grow a beard or wear a veil','留胡子或蒙面纱'),out:[{t:T('You hide it well. Most people never notice.','你遮得很好，多数人根本看不出来。'),c:'muted',fx:{looks:-3}}]},
  {l:T('Wear it openly','大大方方露着'),out:[{w:2,t:T('People step aside for you in the street now. Bullies think twice.','如今走在街上，人们会给你让路。地痞也要掂量掂量。'),c:'muted',fx:{looks:-10,fame:2}},{w:1,t:T('Children stare. One asks if it hurt. You tell the truth.','孩子们盯着看。有一个问你疼不疼。你照实说了。'),c:'muted',fx:{looks:-10,happy:-2}}]}]});
I({id:'st_pox',age:[3,30],cd:40,once:1,w:.5,
 text:()=>T('Smallpox comes through the district. Half the children on your street are sick, and you are next.','天花在这一带流行。你那条街上一半的孩子都病了，接下来就轮到你。'),
 opts:[{l:T('Let a doctor try the new method','让大夫用新法子种痘'),cost:30,out:[{w:4,t:T('A mild fever, then nothing. You are safe for life.','发了一场低烧，就没事了。从此终身不再得这病。'),c:'good'},{w:1,t:T('The method gives you the disease anyway, though mildly. A few marks remain.','种痘还是让你染上了，好在轻些。留下了几个小麻子。'),c:'muted',fx:{looks:-5,hurt:[5,12],cause:T('smallpox','天花')}}]},
  {l:T('Pray and wait','祈祷，听天由命'),out:[{w:s=>s.t.luck,t:T('It passes you by.','它绕过了你。'),c:'good'},{w:5,t:T('You live. Your face carries the marks for the rest of your life.','你活了下来，脸上的麻子却跟了你一辈子。'),c:'bad',fx:{looks:-15,f:s=>{wound(s,8,20,T('smallpox','天花'));s.health=Math.max(s.health,5)}}}]}]});
I({id:'st_beauty',age:[16,40],cd:10,when:s=>s.looks>=75&&!spouseOf(s),ctx:s=>{const c=scene();c.npc=npc(s,{occ:s.gender==='m'?12:11,age:s.age+rint(-3,6)});return c},
 text:(c,s)=>T(`Your looks have caught the eye of ${c.npc.en}, the only ${s.gender==='m'?'daughter':'son'} of a very rich family. A matchmaker arrives with gifts and an offer: marry in, and never want for anything.`,`你的容貌入了${c.npc.zh}的眼。对方是一户巨富人家的独${s.gender==='m'?'女':'子'}。媒婆提着礼上门：${s.gender==='m'?'入赘过去':'嫁过去'}，一辈子吃穿不愁。`),
 opts:[{l:T('Accept','答应'),out:[{w:2,t:T('A lavish wedding and a soft life. Some days the cage feels gilded; some days just comfortable.','一场风光的婚礼，一段安逸的日子。有些日子觉得像金丝笼，有些日子只觉得舒服。'),c:'muted',fx:{money:[500,1200],meet:'spouse',bond:55,happy:2}},{w:1,t:T('You find you actually like each other. It was luck, not wisdom.','没想到你们是真心投缘。这是运气，不是眼光。'),c:'good',fx:{money:[500,1200],meet:'spouse',bond:80,happy:8}}]},
  {l:T('Refuse','回绝'),out:[{w:2,t:T('The family is offended, and makes sure the district knows it.','对方觉得受了辱，弄得满城皆知。'),c:'muted',fx:{happy:-1}},{w:1,t:T('They send a second matchmaker, then a third. You start using the back door.','对方又派了第二个、第三个媒婆。你开始改走后门了。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'st_beautytrap',age:[16,50],cd:12,tags:FW,when:s=>s.looks>=65,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(20,35),lv:PW(.9,2)(s)});return c},
 text:c=>T(`${c.npc.en} has been very charming to you all evening, and suggests a quiet walk by the river. Your purse is heavy tonight.`,`${c.npc.zh}整晚对你殷勤备至，提议去河边走走，清静些。你今晚钱袋正沉。`),
 opts:[{l:T('Go','去'),out:[{w:s=>s.smarts/40+s.t.wit*.1,t:T('You notice the two men following, and turn back in time. The charm was bait.','你察觉有两个人跟在后面，及时折返。那份殷勤原来是饵。'),c:'good',fx:{smarts:1}},{w:2,t:T('By the river, friends of theirs are waiting. You wake with a headache and an empty purse.','河边早埋伏着对方的同伙。你醒来时头痛欲裂，钱袋空了。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,rint(30,150))),hurt:[3,8],cause:T('a honey trap','美人局')}},{w:1,t:T('It is only a walk, and a pleasant one. Not everyone is a trap.','真的只是散步，还挺愉快。不是人人都是陷阱。'),c:'good',fx:{happy:4,meet:'acq',bond:60}}]},
  {l:T('Politely say goodnight','客气告辞'),out:[{t:T('You will never know which it was.','你永远不会知道那是哪一种。'),c:'muted'}]}]});
I({id:'st_plainface',age:[18,60],cd:15,when:s=>s.looks<=35,
 text:()=>T('The matchmaker sighs over your portrait. "We will need a very good dowry, or a very poor family."','媒婆对着你的画像直叹气："要么彩礼得很厚，要么得找个很穷的人家。"'),
 opts:[{l:T('Take it in good humour','一笑置之'),out:[{t:T('You laugh. Later you notice that plain people are trusted faster at markets. There are compensations.','你笑了。后来你发现，长相平平的人在集市上反倒更容易被信任。总有些补偿。'),c:'muted',fx:{happy:1,smarts:1}}]},
  {l:T('Work on yourself instead','在自己身上下功夫'),out:[{w:2,t:T('Good clothes, straight posture, a ready laugh. It is surprising how much of a face is how you carry it.','好衣裳，挺直的腰，爽朗的笑。原来一张脸好不好看，大半在于怎么"带"着它。'),c:'good',fx:{looks:6,money:-30}},{w:1,t:T('The tailor overcharges and the clothes do not help.','裁缝多收了钱，衣服也没顶用。'),c:'muted',fx:{money:-30}}]}]});
I({id:'st_pearl',age:[16,60],cd:10,when:s=>s.money>=100,
 text:()=>T('A pedlar of cosmetics swears by his pearl powder and herbal masks: “Ten years off your face.”','卖脂粉的货郎拍胸脯担保他的珍珠粉和草药面膏："抹了年轻十岁。"'),
 opts:[{l:T('Buy the expensive set (80 taels)','买一整套（八十两）'),cost:80,out:[{w:2,t:T('It works, more or less. You look rested and bright.','还真有点用。你看上去容光焕发。'),c:'good',fx:{looks:5,happy:2}},{w:1,t:T('A rash. For a month you look worse than before.','起了一脸疹子。一个月里比之前还难看。'),c:'bad',fx:{looks:-3,happy:-3}},{w:1,t:T('Nothing happens at all. He is two towns away by then.','一点用也没有。那时货郎早已走出两个镇子了。'),c:'muted'}]},
  {l:T('Laugh him off','一笑了之'),out:[{t:T('Your face stays your face.','你的脸还是你的脸。'),c:'muted'}]}]});

/* ================= spirits ================= */
I({id:'st_gloom',age:[14,95],cd:5,w:2,when:s=>s.happy<35,
 text:()=>T('For weeks you have not wanted to get out of bed. Food tastes of nothing. Even training feels pointless.','好几个星期了，你连床都不想下。吃什么都没味道，连练功都觉得没意思。'),
 opts:[{l:T('Drink it away','借酒浇愁'),out:[{w:2,t:T('It helps for an evening at a time. Your health pays the rest.','每次能管一个晚上。剩下的，身体来还。'),c:'bad',fx:{happy:4,heal:-6}},{w:1,t:T('You wake in a ditch and laugh at yourself for the first time in months.','你在沟里醒来，几个月来头一回笑话起了自己。'),c:'muted',fx:{happy:8,heal:-4}}]},
  {l:T('Talk to someone','找个人说说'),if:s=>s.people.some(p=>p.alive&&p.bond>=60&&!hostile(p)),out:[{w:3,t:T('They mostly listen. It is enough. Slowly the colour comes back.','对方大多只是听着。这就够了。慢慢地，日子又有了颜色。'),c:'good',fx:{happy:15,f:s=>{const p=pick(s.people.filter(p=>p.alive&&p.bond>=60&&!hostile(p)));if(p)addBond(p,6)}}},{w:1,t:T('They do not understand, and you feel more alone.','对方不懂，你反而更孤单了。'),c:'muted',fx:{happy:2}}]},
  {l:T('Walk into the mountains for a month','进山走上一个月'),out:[{w:s=>s.t.heart*.4,t:T('Somewhere above the clouds you put it down, whatever it was.','在云层之上的某处，你把那份重负放下了。'),c:'good',fx:{happy:18,qi:2}},{w:2,t:T('The mountains are beautiful and do not help.','山很美，却没什么用。'),c:'muted',fx:{happy:4}}]},
  {l:T('Bury yourself in work','埋头干活'),out:[{t:T('You earn well and feel nothing. It is something.','钱挣了不少，心里还是空的。好歹算点什么。'),c:'muted',fx:{money:[20,60],happy:1}}]}]});
I({id:'st_elation',age:[14,95],cd:6,w:1.5,when:s=>s.happy>=75,
 text:()=>T('Everything is going well. You wake early, sing on the road, and see the world clearly.','诸事顺遂。你一早就醒，路上哼着歌，看什么都格外清楚。'),
 opts:[{l:T('Pour it into your training','把劲头用在练功上'),out:[{w:3,t:T('Moves that were stuck for years come loose.','卡了好几年的招式忽然通了。'),c:'good',fx:{skill:2,qi:2}},{w:s=>s.t.heart*.12,t:T('In a moment of pure lightness you understand something about how arts are built. It stays with you.','在一个极轻快的瞬间，你领悟了武功是怎么搭起来的。这份领悟一直留着。'),c:'gold',fx:{talent:{wit:1}}}]},
  {l:T('Share it around','分给身边的人'),out:[{t:T('Gifts, visits, a party. Everyone remembers this year fondly.','送礼、串门、请客。人人都记得这美好的一年。'),c:'good',fx:{money:-40,f:s=>s.people.filter(p=>p.alive&&!hostile(p)).forEach(p=>addBond(p,4))}}]},
  {l:T('Take a big gamble while luck is running','趁手气好，赌一把大的'),out:[{w:1,t:T('Luck holds. You double your stake.','手气没断，你翻了一倍。'),c:'good',fx:{f:s=>pay(s,Math.min(300,Math.round(s.money*.5)))}},{w:1.3,t:T('Luck does not care how you feel.','运气才不管你心情好不好。'),c:'bad',fx:{f:s=>pay(s,-Math.min(300,Math.round(s.money*.5))),happy:-15}}]}]});

/* ================= learning and insight ================= */
I({id:'st_debate',age:[16,85],cd:8,tags:['town'],when:s=>s.smarts>=45,ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,age:rint(25,60)});return c},
 text:c=>T(`In a teahouse, the scholar ${c.npc.en} is holding forth that martial people are all brutes who cannot read. He looks straight at you.`,`茶馆里，书生${c.npc.zh}高谈阔论，说武人都是不识字的莽夫，眼睛直勾勾看着你。`),
 opts:[{l:T('Debate him','跟他辩'),out:[{w:s=>s.smarts/25,t:T('You quote the classics back at him, then the military treatises he has never read. The room applauds.','你先引经据典，又搬出他没读过的兵书。满堂喝彩。'),c:'good',fx:{fame:2,smarts:2,happy:4}},{w:2,t:T('He is quicker than you. You leave to laughter.','他嘴皮子比你快。你在哄笑声中离开。'),c:'bad',fx:{happy:-4,smarts:1}}]},
  {l:T('Break his teacup with a flick','弹指震碎他的茶杯'),if:s=>power(s)>=30,out:[{t:T('“Brutes,” you agree, and leave. He does not finish his sentence.','"莽夫。"你附和一声，走了。他那句话没说完。'),c:'muted',fx:{fame:1}}]},
  {l:T('Ignore him','不理他'),out:[{t:T('He takes your silence as victory. You take it as tea.','他把你的沉默当成认输。你只当是喝了杯茶。'),c:'muted'}]}]});
I({id:'st_con',age:[14,80],cd:6,tags:FW,when:s=>s.money>=50,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([24,17,22]),age:rint(30,60)});c.amt=Math.min(200,Math.round(s.money*.3));return c},
 text:c=>T(`${c.npc.en} has a map to a bandit’s buried silver, and will sell you a half share for only ${c.amt} taels. He seems very sincere.`,`${c.npc.zh}手里有张山贼埋银的地图，只要${c.amt}两就分你一半。他看上去十分诚恳。`),
 opts:[{l:T('Buy in','掏钱'),out:[{w:s=>Math.max(.5,(70-s.smarts)/15),t:T('The map leads to a field already dug up by twenty other buyers.','地图指向一块地，早被另外二十个买主挖遍了。'),c:'bad',fx:{f:(s,c)=>pay(s,-c.amt),smarts:2}},{w:.3,t:T('Against all odds, there is a little silver there.','出乎意料，那里真有一点银子。'),c:'good',fx:{f:(s,c)=>pay(s,Math.round(c.amt*.8))}}]},
  {l:T('Ask some sharp questions','问几个刁钻的问题'),out:[{w:s=>s.smarts/20,t:T('His story falls apart on the third question. He leaves fast.','问到第三句他就编不圆了，溜得飞快。'),c:'good',fx:{smarts:1}},{w:1,t:T('He has an answer for everything. That alone should have told you.','他样样都答得上来。光这一点就该让你起疑。'),c:'muted'}]},
  {l:T('Walk away','走开'),out:[{t:T('He finds another buyer within the hour.','不到一个时辰，他就找到了下一个买主。'),c:'muted'}]}]});
I({id:'st_tutor',age:[18,70],cd:12,when:s=>s.smarts>=60,ctx:s=>{const c=scene();c.npc=npc(s,{occ:11,age:rint(40,60)});c.kid=npc(s,{age:rint(9,14)});return c},
 text:c=>T(`A wealthy family wants a tutor for their son ${c.kid.en}: letters in the morning, a little swordplay in the afternoon. The pay is good, and the boy is said to be impossible.`,`一户富人家要给儿子${c.kid.zh}请个先生：上午读书，下午学点剑术。束脩丰厚，听说那孩子极难管教。`),
 opts:[{l:T('Take the post for a year','应聘一年'),out:[{w:2,t:T('The boy is impossible for a month, then devoted. You learn as much as he does.','那孩子顽劣了一个月，后来对你死心塌地。你学到的不比他少。'),c:'good',fx:{money:[120,200],smarts:3,meet:'disciple',bond:65}},{w:1,t:T('The boy stays impossible. You earn every tael.','那孩子一直顽劣。你挣的每一两都不容易。'),c:'muted',fx:{money:[120,200],happy:-4}}]},
  {l:T('Decline','推辞'),out:[{t:T('They find a stricter tutor. The boy runs away within a month.','他们请了个更严的先生。不到一个月，孩子就跑了。'),c:'muted'}]}]});
I({id:'st_headblow',age:[14,85],cd:30,once:1,w:.5,when:s=>s.bt>=8,
 text:()=>T('A blow to the head in a fight leaves you dizzy for weeks. Words slip away mid-sentence.','打斗中头上挨了一下，好几个星期都头晕目眩，话说到一半就忘了词。'),
 opts:[{l:T('Rest properly','好好静养'),out:[{w:3,t:T('It passes. You are a little slower with names for the rest of your life.','慢慢好了。此后记人名总是慢半拍。'),c:'muted',fx:{smarts:-3,heal:10}},{w:1,t:T('It passes completely.','完全好了。'),c:'good',fx:{heal:10}}]},
  {l:T('Carry on as if nothing happened','照常过日子'),out:[{w:2,t:T('It lingers. Something is lost and does not come back.','一直没好利索。有些东西丢了，再也回不来。'),c:'bad',fx:{smarts:-6,talent:{wit:-1}}},{w:1,t:T('You were lucky.','你运气好。'),c:'muted',fx:{smarts:-2}}]}]});
I({id:'st_epiphany',age:[12,90],cd:12,w:.8,when:s=>s.t.wit<10,ctx:s=>({sc:pick([0,1,2,3])}),
 text:c=>[T('You watch water find its way around a stone in the stream, again and again, and something in you goes very still.','你看溪水一次又一次绕过一块石头，心里有什么东西忽然静了下来。'),T('A cook in the market cuts a whole ox without hitting a bone. You watch for an hour.','集市上一个厨子解一整头牛，刀刀不碰骨头。你看了一个时辰。'),T('Children are playing a clapping game, fast and complicated, and never miss.','孩子们在玩拍手游戏，又快又复杂，却从不出错。'),T('An old woman is weaving, and the pattern only appears when she is nearly done.','一个老婆婆在织布，花样要到快织完时才显出来。')][c.sc],
 opts:[{l:T('Stay and look until you understand','留下来，看到明白为止'),out:[{w:s=>s.t.heart*.15+s.happy/100,t:T('You understand. Afterwards you learn everything a little faster.','你明白了。此后学什么都快了一点。'),c:'gold',fx:{talent:{wit:1}}},{w:2,t:T('You almost understand. It is still worth the afternoon.','差一点就明白了。这个下午还是值得的。'),c:'good',fx:{skill:1,qi:1}}]},
  {l:T('Move on, you are busy','走吧，忙着呢'),out:[{t:T('You never think of it again. Or almost never.','你再也没想起过这件事。几乎没有。'),c:'muted'}]}]});
I({id:'st_dulling',age:[66,100],cd:8,when:s=>s.t.wit>2,
 text:()=>T('You notice you have read the same page three times. Names, dates and forms are getting harder to hold.','你发现同一页书读了三遍。人名、日子、招式，越来越记不住了。'),
 opts:[{l:T('Keep the mind working: study, chess, teaching','勤用脑子：读书、下棋、教人'),out:[{w:3,t:T('It slows. Your mind stays yours for years yet.','衰退慢了下来。你的心智还能清明好些年。'),c:'good',fx:{smarts:1}},{w:1,t:T('It comes anyway, but gently.','该来的还是来了，好在来得温和。'),c:'muted',fx:{smarts:-3}}]},
  {l:T('Accept it','顺其自然'),out:[{w:2,t:T('You let the small things go. You are calmer for it, and forget more.','你不再计较小事，心里平静了，忘得也多了。'),c:'muted',fx:{smarts:-5,happy:3}},{w:1,t:T('Insight fades along with memory.','悟性随着记性一起消退了。'),c:'bad',fx:{smarts:-5,talent:{wit:-1}}}]}]});
I({id:'st_master_eye',age:[10,40],cd:20,once:1,when:s=>s.t.wit>=7,ctx:s=>{const c=scene();c.npc=npc(s,{occ:2,age:rint(60,80),lv:rint(150,230)});return c},
 text:c=>T(`An old Daoist, ${c.npc.en}, watches you practise and says: "Quick mind, lazy feet. Give me three days and I will tell you which matters."`,`一位老道${c.npc.zh}看你练功，说："脑子快，脚底懒。给我三天，我告诉你哪个要紧。"`),
 opts:[{l:T('Give him three days','给他三天'),out:[{w:s=>s.t.wit*.3,t:T('Three days of riddles and footwork. You come out sharper in both.','三天的谜题和步法。你两样都长进了。'),c:'gold',fx:{talent:{wit:1},skill:2}},{w:2,t:T('Three days of what feels like nothing. Months later, it starts to make sense.','三天里好像什么也没学到。几个月后，才慢慢回过味来。'),c:'good',fx:{skill:2,smarts:2}}]},
  {l:T('Thank him, and keep to your own way','谢过，照自己的路子练'),out:[{t:T('He smiles as if he expected it.','他笑了笑，像是早就料到。'),c:'muted'}]}]});

/* ---------- systemic: your name affects who repays you and who robs you ---------- */
(()=>{if(typeof loansYear!=='function')return;const L0=loansYear;loansYear=function(s){(s.loans||[]).forEach(L=>{if(L._f==null){L._f=1;L.risk=clamp(L.risk*(s.fame<10?1.25:s.fame>=60?.6:s.fame>=30?.85:1),.02,.9)}});L0(s)}})();
