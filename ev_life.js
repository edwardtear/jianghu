/* 江湖一生 · incidents I: milestones, childhood, family, love, old age */
'use strict';
const PW=(m,a)=>s=>Math.max(3,Math.round(power(s)*m+(a||0)+rint(-3,3)));
const FG=(lv,stakes,title,cause,nameFn,beast)=>(s,c)=>({foe:{name:nameFn?nameFn(c,s):T(c.npc.en,c.npc.zh),lv:typeof lv==='function'?lv(s,c):lv,beast:beast?1:0},stakes,title,cause});
const N=c=>T(c.npc.en,c.npc.zh);

/* ---------- milestones ---------- */
I({id:'zhuazhou',force:1,age:[1,1],text:()=>T('At your first-birthday ceremony (抓周) the family lays out a brush, an abacus, an official seal and a wooden sword.','周岁抓周，家人在你面前摆了毛笔、算盘、官印和一柄木剑。'),
 out:[{w:s=>s.t.root,t:T('You crawl straight to the wooden sword and refuse to let go.','你径直爬向木剑，抱住就不肯撒手。'),fx:{skill:1,flag:'zz_sword'}},
  {w:s=>s.t.wit,t:T('You grab the brush and paint your own face. Grandmother declares you a future scholar.','你抓起毛笔，把自己画成了大花脸。祖母说你将来必是读书人。'),fx:{smarts:5}},
  {w:s=>s.t.luck,t:T('You shake the abacus like a rattle. Your uncle says you will be rich.','你抓起算盘当拨浪鼓摇。叔叔说你将来定会发财。'),fx:{money:5}},
  {w:s=>s.t.heart,t:T('You sit on the official seal. Everyone laughs and calls you a little magistrate.','你一屁股坐在官印上。满堂大笑，都叫你小县太爷。'),fx:{happy:5}},
  {w:1,t:T('You ignore all four and eat a fistful of the birthday noodles.','四样东西你一样没碰，抓了一把长寿面就往嘴里塞。'),fx:{happy:3,maxHealth:2}}]});
I({id:'clanbasics',force:1,age:[5,5],when:s=>['clan','escort'].includes(s.family),text:(c,s)=>T('Your training begins.','你开始习武了。'),
 out:[{if:s=>s.family==='clan',t:(c,s)=>T(`Your father teaches you the ${s.sur[1]} family sword, older than the dynasty.`,`父亲传你${s.sur[0]}家剑法，比这个朝代还要古老。`),fx:{art:{n:'Family Sword',cn:'家传剑法',tier:1,sk:'lianhuan'}}},
  {if:s=>s.family==='escort',t:T('Your father hands you a wooden saber. Escort work starts with knowing how to hold one.','父亲递给你一把木刀：走镖的第一课，是学会怎么握刀。'),fx:{art:'escortsaber'}}]});
I({id:'temple',force:1,age:[6,6],when:s=>s.family==='temple',text:()=>T('The temple turns out to be a branch of Shaolin.','原来这座寺是少林的下院。'),
 out:[{t:T('The abbot shaves your head and enrolls you as a novice.','方丈为你剃度，收你做了小沙弥。'),c:'good',fx:{f:s=>joinSect(s,'shaolin')}}]});
I({id:'cultkid',force:1,age:[8,8],when:s=>s.family==='cult'&&!s.sect,text:()=>T('At eight you are brought before the altar of the Crimson Sky Cult.','八岁那年，你被带到赤霄教的神坛前。'),
 opts:[{l:T('Swallow the Heart-Eating Pill','吞下噬心丹'),sub:T('Loyalty, power, and a leash.','忠诚、力量，还有一根拴绳。'),out:[{t:T('You swear the oath. You do not understand it yet. You will.','你立下了誓言。你还不懂它的分量，将来会懂的。'),c:'bad',fx:{align:-10,f:s=>joinSect(s,'sunmoon')}}]},
  {l:T('Spit it out and run','吐出来，逃跑'),sub:T('You are eight.','你才八岁。'),out:[{w:s=>s.t.luck,t:T('You squeeze through a drain and run until dawn. A farmer takes you in.','你从排水沟钻了出去，一直跑到天亮。一个农夫收留了你。'),c:'good',fx:{align:10,happy:-10,f:s=>{s.family='peasant';s.people.filter(p=>['father','mother'].includes(p.rel)).forEach(p=>{p.bond=10})}}},
   {w:5,t:T('You are caught at the gate. They make you swallow two pills instead of one.','你在门口被抓住了。他们逼你吞下了两颗。'),c:'bad',fx:{align:-12,hurt:[5,15],cause:T('the cult’s punishment','赤霄教的责罚'),f:s=>joinSect(s,'sunmoon')}}]}]});
I({id:'trial',force:1,age:[10,10],when:s=>!s.sect&&!['temple','cult'].includes(s.family),ctx:s=>({}),
 text:(c,s)=>T(`Recruiters from the sects of ${region(s).en} hold entrance trials in the town square. Masters walk the line of children, pressing wrists and checking bones.`,`${region(s).cn}各大门派来镇上招收弟子。孩子们在广场上排成一列，师父们挨个捏腕摸骨。`),
 opts:[0,1,2].map(i=>({if:s=>region(s).sects[i],l:(c,s)=>T(SE(region(s).sects[i]),'拜入'+SZ(region(s).sects[i])),sub:(c,s)=>SECTS[region(s).sects[i]].blurb,
   out:[{w:s=>3+(s.t.root+s.t.wit)/2+(SECTS[region(s).sects[i]].easy?6:0)+(s.family==='clan'?4:0),t:(c,s)=>T(`The examiner holds your wrist a long moment, then nods. You are now an outer disciple of ${SE(region(s).sects[i])}.`,`考官握着你的手腕许久，终于点了点头。你成了${SZ(region(s).sects[i])}的外门弟子。`),c:'good',fx:{f:s=>joinSect(s,region(s).sects[i])}},
    {w:6,t:T('The examiner presses your wrist and shakes his head. "Ordinary bones." You walk home without looking back.','考官捏了捏你的手腕，摇了摇头："根骨平平。"你头也不回地走回了家。'),c:'bad',fx:{happy:-8}},
    {w:s=>s.t.luck/3,t:T('You fail the bone test, but an old sweeper at the gate says, "Come find me at the back hill."','你没通过摸骨，可门口扫地的老头低声说："来后山找我。"'),c:'gold',fx:{f:s=>{const m=mkPerson(s,{rel:'master',age:rint(70,90),bond:65,lv:rint(140,200),extra:{art:pick(['vajra','bagua','spring','swallow'])}});s.people.push(m)}}}]})).concat([
  {l:(c,s)=>s.family==='scholar'?T('Stay home and study for the exams','留在家中，苦读应考'):T('Stay with your family','留在爹娘身边'),sub:T('A quieter road. Maybe a longer one.','一条更平静的路，也许更长。'),out:[{t:T('You go home. The square empties by evening.','你回家了。傍晚时，广场上的人散尽了。'),c:'muted',fx:{smarts:3}}]}])});
I({id:'comingofage',force:1,age:[15,15],text:(c,s)=>T(`Your coming-of-age ceremony (${s.gender==='m'?'冠礼':'笄礼'}). The elders ask what you mean to make of your life.`,`你行${s.gender==='m'?'冠礼':'笄礼'}，长辈们问你，这一生想做个什么样的人。`),
 opts:[{l:T('"A hero who rights wrongs."','"做一个锄强扶弱的侠客。"'),out:[{t:T('The old men nod. One of them laughs.','老人们点头，有一个笑出了声。'),fx:{align:6,fame:1,flag:'aim_hero'}}]},
  {l:T('"Rich. Very rich."','"发财，发大财。"'),out:[{t:T('Your uncle slips you a few coins for honesty.','叔叔为你的实诚塞了几个铜板。'),fx:{money:[5,30],flag:'aim_rich'}}]},
  {l:T('"The strongest under heaven."','"天下第一。"'),out:[{t:T('Silence. Then someone coughs.','一片寂静，接着有人咳嗽了一声。'),fx:{skill:2,flag:'aim_strong'}}]},
  {l:T('"Free. Nobody’s servant."','"自由自在，谁也不伺候。"'),out:[{t:T('Your mother looks worried. Your father looks proud.','母亲一脸担忧，父亲却面露骄傲。'),fx:{happy:8,flag:'aim_free'}}]},
  {l:T('"A good family and a long life."','"家庭和睦，长命百岁。"'),out:[{t:T('Grandmother cries a little.','祖母落了泪。'),fx:{happy:5,lifespan:1,flag:'aim_home'}}]}]});
I({id:'wulin',force:1,repeat:1,when:s=>s.cal%10===0&&s.age>=20&&s.age<=62&&power(s)>=35&&!s.retired&&s.jail<=0&&!s.flags.alliance&&s.seen.wulin!==s.age,ctx:s=>({}),
 text:()=>T('Heroes gather at Mount Song for the Martial Assembly (武林大会), held once a decade, to choose a Leader of the Martial Alliance.','天下英雄齐聚嵩山，参加十年一度的武林大会，推举武林盟主。'),
 opts:[{l:T('Compete','登台比武'),sub:T('Three rounds against the best of your generation.','连闯三轮，对手都是你这一代最强的人。'),out:[{t:T('You step onto the platform.','你跃上擂台。'),fx:{f:(s,c)=>{
   const lv=[85,145,215];for(let i=0;i<3;i++){const nm=foeName();const r=fightLife(s,{name:nm,lv:Math.round(lv[i]*(.9+R()*.2))},{stakes:'light',title:T(`Martial Assembly · round ${i+1}`,`武林大会 · 第${cnNum(i+1)}轮`),cause:T('the Martial Assembly','武林大会上的比武')});
    if(!r.win){s.fame+=5*(i+1);say(s,i?`You win ${i} round${i>1?'s':''} before falling. The jianghu remembers.`:'You fall in the first round.',i?`你连胜${cnNum(i)}轮后落败。江湖记住了你。`:'你第一轮就落败了。',i?'':'muted');return}}
   s.flags.alliance=s.age;s.fame+=60;say(s,'You win all three rounds. The heroes of the world bow to you as Leader of the Martial Alliance (武林盟主).','你连胜三轮。天下英雄向你抱拳，尊你为武林盟主。','gold');deed(s,'Became Leader of the Martial Alliance','当选武林盟主')}}}]},
  {l:T('Watch from the crowd','在台下观战'),sub:T('Learn by watching.','看，也是一种学。'),out:[{t:()=>{const f=foeName();return T(`${f.en} wins the title. You learn a great deal just watching.`,`${f.zh}夺得了盟主之位。你光是在台下看，就学到了不少。`)},c:'muted',fx:{qi:3,skill:2}}]}]});
I({id:'elder',age:[35,90],w:6,once:1,when:s=>s.sect&&s.rank===2&&power(s)>=85&&!s.retired,text:(c,s)=>T(`The elders of ${SE(s.sect)} meet behind closed doors. Your name comes up.`,`${SZ(s.sect)}的长老们闭门议事，提到了你的名字。`),
 out:[{w:3,t:(c,s)=>T(`You are named an elder (长老) of ${SE(s.sect)}.`,`你被推举为${SZ(s.sect)}长老。`),c:'good',fx:{fame:10,f:s=>{s.rank=3;deed(s,`Became an elder of ${SECTS[s.sect].en}`,`成为${SZ(s.sect)}长老`)}}},
  {w:1,t:T('Someone with better connections gets the seat. Next time.','位子给了一个关系更硬的人。下次吧。'),c:'muted',fx:{happy:-5}}]});
I({id:'sectmaster',age:[42,90],w:6,once:1,when:s=>s.sect&&s.rank===3&&power(s)>=140&&!s.retired,text:(c,s)=>T(`The master of ${SE(s.sect)} is dying, and has not named an heir.`,`${SZ(s.sect)}掌门病重，尚未指定继承人。`),
 opts:[{l:T('Claim the succession','争夺掌门之位'),sub:T('Another elder will fight you for it.','另一位长老会与你争。'),fight:FG(s=>Math.round(power(s)*(.85+R()*.3)),'injury',T('Succession duel','掌门之争'),T('a succession duel','掌门之争'),()=>T('Elder '+pick(SUR)[1],pick(SUR)[0]+'长老')),
   win:[{t:(c,s)=>T(`You win. The old master presses the token of office into your hand. You are the master (掌门) of ${SE(s.sect)}.`,`你赢了。老掌门把掌门信物交到你手中。你成了${SZ(s.sect)}掌门。`),c:'gold',fx:{fame:30,f:s=>{s.rank=4;deed(s,`Became sect master of ${SECTS[s.sect].en}`,`执掌${SZ(s.sect)}`)}}}],
   lose:[{t:T('You lose, and bow to the new master. Some disciples still call you master in private.','你输了，向新掌门行礼。私下里，仍有弟子叫你一声掌门。'),c:'muted',fx:{happy:-6}},{w:.4,t:T('You lose, and the new master expels your faction.','你输了，新掌门把你这一派赶出了山门。'),c:'bad',fx:{f:leaveSect,enemy:1}}]},
  {l:T('Support a younger elder','扶持年轻长老'),out:[{t:T('Your candidate wins and owes you everything.','你扶持的人当上了掌门，对你感恩戴德。'),c:'good',fx:{fame:6,happy:4}},{w:.5,t:T('Your candidate loses. The new master watches you closely.','你扶持的人输了。新掌门对你多有提防。'),fx:{happy:-4}}]}]});
I({id:'arrest',sys:1,ctx:s=>({}),text:()=>T('Constables bang on your door at dawn. There is a warrant with your name on it.','天还没亮，捕快就来砸门了。海捕文书上写着你的名字。'),
 opts:[{l:T('Fight your way out','杀出去'),fight:FG(PW(.8,10),'injury',T('Resisting arrest','拒捕'),T('resisting arrest','拒捕'),()=>T('the head constable','捕头')),
   win:[{t:T('You leave three constables groaning in the street and flee.','你打翻了三个捕快，夺路而逃。'),c:'muted',fx:{wanted:1,fame:2}}],lose:[{t:T('They drag you to the yamen in chains.','他们把你锁去了衙门。'),c:'bad',fx:{f:s=>{applyFx(s,{jail:Math.max(1,s.wanted+rint(0,2))});s.wanted=0}}}]},
  {l:T('Surrender','束手就擒'),out:[{t:T('You hold out your wrists.','你伸出了双手。'),c:'muted',fx:{f:s=>{applyFx(s,{jail:Math.max(1,s.wanted)});s.wanted=0}}}]},
  {l:T('Bribe them (80 taels per warrant level)','塞银子（每级通缉八十两）'),if:s=>s.money>=s.wanted*80,out:[{w:4,t:T('The head constable pockets the silver and loses the warrant.','捕头揣起银子，那张文书就"丢"了。'),fx:{f:s=>{pay(s,-s.wanted*80);s.wanted=0}}},{w:1,t:T('He takes the silver and arrests you anyway.','他收了银子，还是把你抓了。'),c:'bad',fx:{f:s=>{pay(s,-s.wanted*80);applyFx(s,{jail:s.wanted});s.wanted=0}}}]}]});
I({id:'debt',sys:1,text:()=>T('You have lost everything at the tables. A loan shark offers you 100 taels. In a year, he says, you will owe him 300.','你在赌桌上输得精光。一个放印子钱的说可以借你一百两，一年后连本带利还三百两。'),
 opts:[{l:T('Take the loan','借'),out:[{t:T('You take it. The interest will find you.','你借了。利息会找上门的。'),fx:{money:100,flag:'loanshark'}}]},{l:T('Walk away broke','空手离开'),out:[{t:T('You walk home with empty pockets and a clear head.','你两手空空地回家，脑子倒是清醒了。'),fx:{happy:-4}}]}]});
I({id:'loancollect',need:'loanshark',w:8,age:[14,90],once:1,when:s=>s.age-(s.flags.loanshark??s.age)>=1,text:()=>T('The loan shark’s men are waiting at your door. You owe 300 taels now.','放印子钱的打手堵在你家门口。利滚利，你如今欠三百两了。'),
 opts:[{l:T('Pay 300 taels','还三百两'),if:s=>s.money>=300,out:[{t:T('You pay. They leave, smiling.','你还了钱。他们笑着走了。'),fx:{money:-300}}]},
  {l:T('Fight them','动手'),fight:FG(PW(.7,5),'injury',T('Debt collectors','讨债'),T('the loan shark’s thugs','讨债打手的围攻'),()=>T('the loan shark’s thugs','讨债打手')),win:[{t:T('You throw them into the canal. The debt is not mentioned again.','你把他们扔进了河里。这笔债再也没人提起。'),c:'good',fx:{fame:2}}],lose:[{t:T('They break two of your fingers and take what you have.','他们掰断了你两根手指，拿走了你身上所有的钱。'),c:'bad',fx:{f:s=>{s.money=0},hurt:[10,20],cause:T('debt collectors','讨债打手')}}]},
  {l:T('Run','跑'),out:[{w:s=>s.t.luck,t:T('You leave town by night. The debt stays behind.','你连夜出城。债留在了身后。'),fx:{happy:-5}},{w:3,t:T('They catch you at the city gate.','他们在城门口把你截住了。'),c:'bad',fx:{hurt:[15,30],cause:T('debt collectors','讨债打手'),f:s=>{s.money=0}}}]}]});

/* ---------- childhood ---------- */
I({id:'fever',age:[1,6],once:1,w:s=>s.t.root<=3?3:.4,text:()=>T('A fever burns for nine days.','你发了九天高烧。'),
 out:[{w:s=>s.t.root+3,t:T('Your mother sits by you every night. On the tenth day it breaks.','母亲夜夜守在床边，第十天，烧终于退了。'),c:'good',fx:{hurt:[15,35],cause:T('a fever in early childhood','幼时的一场高烧')}},
  {w:2,t:T('A wandering doctor cures you with a single bitter pill and refuses payment.','一位游方郎中用一颗苦药丸治好了你，分文不取。'),c:'good',fx:{hurt:[5,15],cause:T('a fever in early childhood','幼时的一场高烧'),maxHealth:3}},
  {w:s=>s.t.root<=3?2:.3,t:T('The fever leaves you weak for years.','这场高烧让你虚弱了好几年。'),c:'bad',fx:{hurt:[30,60],cause:T('a fever in early childhood','幼时的一场高烧'),maxHealth:-8}}]});
I({id:'famine',age:[2,14],once:1,when:s=>family(s).rich<=1,text:()=>T('Locusts eat the harvest. The village faces a hungry winter.','蝗虫吃光了庄稼，全村要挨饿过冬了。'),
 opts:[{l:T('Share your food with a sick neighbour','把口粮分给生病的邻居'),out:[{t:T('You go hungry. The neighbour lives, and never forgets.','你饿着肚子，邻居活下来了，一辈子记着你的好。'),c:'good',fx:{align:6,hurt:[10,20],cause:T('hunger in a famine year','荒年饥馑'),talent:{heart:1}}}]},
  {l:T('Steal grain from the landlord','去地主家偷粮'),out:[{w:s=>s.t.luck,t:T('You come back with a sack of millet. Your family eats.','你背回一袋小米，一家人有饭吃了。'),c:'good',fx:{align:-3,heal:10}},{w:4,t:T('The landlord’s dogs catch you.','地主家的狗追上了你。'),c:'bad',fx:{hurt:[10,25],cause:T('the landlord’s dogs','地主家的恶狗')}}]},
  {l:T('Eat bark and wait','啃树皮熬过去'),out:[{t:T('That winter you learn what bark tastes like.','那年冬天，你知道了树皮是什么滋味。'),c:'bad',fx:{hurt:[10,25],cause:T('hunger in a famine year','荒年饥馑'),talent:{heart:1}}}]}]});
I({id:'bully',age:[6,12],once:1,ctx:s=>({npc:npc(s,{occ:21,age:s.age+2,lv:rint(3,8)})}),text:()=>T('The butcher’s son, a head taller than you, takes your lunch every day.','屠户家的儿子比你高一个头，天天抢你的午饭。'),
 opts:[{l:T('Fight back','还手'),fight:FG(s=>rint(3,8),'spar',T('Schoolyard fight','孩童打架'),T('a schoolyard fight','孩童间的打架'),()=>T('the butcher’s son','屠户家的儿子')),
   win:[{t:T('You knock him into the duck pond. He never bothers you again.','你把他推进了鸭塘。从此他再没找过你麻烦。'),c:'good',fx:{fame:1,align:2,happy:5}},{w:.5,t:T('You win, and he becomes your loyal shadow for years.','你赢了，从此他成了你的跟班。'),c:'good',fx:{meet:'friend',bond:60}}],
   lose:[{t:T('He beats you soundly. You go home bloody, and oddly proud.','他把你揍了一顿。你满脸是血地回家，心里却莫名有些骄傲。'),fx:{happy:-3}}]},
  {l:T('Endure it','忍了'),out:[{t:T('An old monk who saw it tells you that endurance is the first martial art.','一位看见此事的老和尚说：忍，是武学的第一课。'),fx:{qi:3,align:1}},{w:.6,t:T('You endure. It gets worse.','你忍了，他变本加厉。'),c:'bad',fx:{happy:-8}}]},
  {l:T('Outwit him','智取'),out:[{w:s=>s.smarts/10,t:T('You hide chili paste in the rice. He cries for an hour and leaves you alone.','你在饭里拌了辣椒酱，他哭了一个时辰，从此对你敬而远之。'),c:'good',fx:{happy:5}},{w:4,t:T('He sees through the trick. The beating is worse for it.','他识破了你的伎俩，这顿揍比往常更狠。'),c:'bad',fx:{hurt:[5,12],cause:T('a schoolyard fight','孩童间的打架')}}]},
  {l:T('Tell your parents','告诉爹娘'),out:[{t:T('Your mother marches to the butcher’s shop. Nobody in the street forgets it.','母亲直奔肉铺，那一幕整条街的人都忘不了。'),fx:{happy:3}},{w:.5,t:T('Your father says to handle it yourself, then teaches you a punch.','父亲叫你自己解决，然后教了你一记直拳。'),fx:{skill:2}}]}]});
I({id:'hermit',age:[6,15],once:1,w:s=>s.t.luck*.3,ctx:s=>({npc:npc(s,{occ:19,age:rint(70,95)})}),text:()=>T('A ragged old man sits by the road and asks you for something to eat.','路边坐着一个衣衫褴褛的老头，向你讨口吃的。'),
 opts:[{l:T('Give him your steamed bun','把你的馒头给他'),sub:T('It is the only food you have today.','那是你今天唯一的口粮。'),out:[
   {w:s=>2+s.t.luck/3,t:T('He eats it in two bites, then presses two fingers to your back. Warmth floods your meridians. "Breathe like this," he says, and teaches you until sunset.','他两口吃完，伸出两指按在你背上，一股暖流涌遍经脉。"照这样呼吸。"他一直教到日落。'),c:'gold',fx:{art:'turtle',qi:15,flag:'qiBonus',deed:T('Was taught by a hidden master as a child','幼年得遇隐世高人传功')}},
   {w:6,t:T('He eats it, belches, and falls asleep. Some beggars are just beggars.','他吃完打了个饱嗝，倒头就睡。有些乞丐，真的只是乞丐。'),c:'muted',fx:{align:3}},
   {w:2,t:T('He eats it and gives you a rusty copper coin "for luck". You keep it all your life.','他吃完塞给你一枚生锈的铜钱，说是"压运"。你留了一辈子。'),fx:{align:3,talent:{luck:1}}}]},
  {l:T('Walk past','视而不见'),out:[{t:T('You walk on. Years later you sometimes wonder about him.','你走开了。多年以后，你偶尔还会想起他。'),c:'muted'}]}]});
I({id:'drowning',age:[7,16],cd:30,text:c=>T(`${c.intro.en}, a child slips off the bank of the river and goes under.`,`${c.intro.zh}，一个孩子从河岸滑进水里，沉了下去。`),
 opts:[{l:T('Jump in','跳下去救'),out:[{w:s=>s.t.root,t:T('You drag the child out by the hair. The whole village comes to thank you.','你揪着头发把孩子拖上了岸。全村人都来道谢。'),c:'good',fx:{fame:3,align:6,happy:6}},
   {w:3,t:T('You both nearly drown. A fisherman pulls you out with a pole.','你们俩差点都淹死，被一个渔夫用竹竿捞了上来。'),fx:{hurt:[8,20],cause:T('drowning','溺水'),align:4}},
   {w:1,t:T('The child turns out to be the magistrate’s son. His father sends a bolt of silk and ten taels.','原来那孩子是县太爷的儿子。县太爷送来一匹绸缎和十两银子。'),c:'good',fx:{money:10,fame:4,align:5}}]},
  {l:T('Shout for adults','大声喊人'),out:[{w:3,t:T('A boatman hears you and saves the child.','一个船夫听见了，救起了孩子。'),fx:{align:2}},{w:1,t:T('By the time anyone comes, it is too late. You dream about it for years.','等大人赶到，已经晚了。你做了好多年噩梦。'),c:'bad',fx:{happy:-12}}]},
  {l:T('Run away','跑开'),out:[{t:T('You run. Nobody saw you there. You saw yourself.','你跑了。没人看见你，可你自己看见了。'),c:'bad',fx:{align:-6,happy:-6}}]}]});
I({id:'lostmtn',age:[7,15],cd:20,text:()=>T('You chase a rabbit into the mountains and lose the path. Night falls.','你追一只兔子进了山，迷了路。天黑了。'),
 out:[{w:3,t:T('You follow the stream down and are home by midnight, scratched and starving.','你顺着溪水下山，半夜才到家，浑身划伤，饿得发慌。'),fx:{hurt:[2,8],cause:T('a night lost in the mountains','山中迷路')}},
  {w:s=>s.t.luck/3,t:T('A white ape leads you to a ledge of red fruit. You eat until you sleep. You wake stronger.','一只白猿把你领到一片结满红果的石台。你吃饱就睡，醒来浑身是劲。'),c:'gold',fx:{qi:10,maxHealth:5}},
  {w:s=>s.t.luck/4,t:T('You shelter in a cave whose walls are carved with tiny leaping figures. You copy their steps all night.','你躲进一个山洞，洞壁上刻满跳跃的小人。你照着练了一整夜。'),c:'gold',fx:{art:'swallow'}},
  {w:2,t:T('Wolves. You climb a tree and wait for dawn.','狼来了。你爬上树等到天亮。'),c:'bad',fx:{happy:-5,hurt:[3,10],cause:T('a wolf bite','狼咬')}},
  {w:1,t:T('A hunter finds you and carries you home on his shoulders.','一个猎户找到了你，把你扛回了家。'),fx:{meet:'acq',bond:65}}]});
I({id:'school',age:[6,13],cd:4,when:s=>family(s).rich>=1,text:()=>T('At the village school the tutor asks you to recite the Thousand Character Classic.','私塾先生让你背《千字文》。'),
 out:[{w:s=>s.smarts/10,t:T('You recite it perfectly, and then backwards. The tutor stares.','你一字不差地背完，又倒着背了一遍。先生看呆了。'),c:'good',fx:{smarts:4,happy:3}},
  {w:3,t:T('You stumble at line forty and get the ruler across your palm.','你背到第四十句卡住了，挨了一戒尺。'),fx:{happy:-3,smarts:1}},
  {w:1,t:T('You write a poem instead. It is passed around the county.','你没背书，写了一首诗。诗在全县传开了。'),c:'good',fx:{smarts:3,fame:2}},
  {w:2,t:T('You fall asleep. The tutor lets you; he is asleep too.','你睡着了。先生也没管，他自己也睡着了。'),c:'muted'}]});
I({id:'firecracker',age:[4,12],once:1,text:()=>T('At New Year the boys dare you to light the biggest firecracker.','过年时，男孩们怂恿你去点最大的那挂炮仗。'),
 opts:[{l:T('Light it','点'),out:[{w:3,t:T('BOOM. You are a legend among the children of the street.','轰！你成了整条街孩子心中的英雄。'),c:'good',fx:{happy:6}},{w:1,t:T('It goes off in your hand.','炮仗在你手里炸了。'),c:'bad',fx:{hurt:[5,15],cause:T('a firecracker','炮仗'),looks:-5}}]},
  {l:T('Refuse','不点'),out:[{t:T('They call you a coward until the Lantern Festival.','他们一直笑你胆小，笑到元宵节。'),fx:{happy:-2}}]}]});
I({id:'stickswords',age:[5,11],cd:3,text:()=>T('The village children play at being heroes with stick swords.','村里的孩子们拿着木棍扮大侠。'),
 out:[{w:s=>s.t.root,t:T('You beat everyone. They make you the leader of the "Bamboo Sect".','你把所有人都打赢了，他们推你做"竹竿派"掌门。'),c:'good',fx:{skill:1,happy:4}},{w:3,t:T('You play the villain every time. You are very good at it.','你每次都演坏人，演得极好。'),fx:{happy:2}},{w:1,t:T('You poke a boy in the eye. His mother is still angry.','你戳到了一个男孩的眼睛。他娘到现在还生气。'),c:'bad',fx:{align:-1}}]});
I({id:'facereading',age:[3,40],cd:30,ctx:s=>({npc:npc(s,{occ:24})}),text:c=>T(`At ${c.place.en}, ${c.npc.desc.en} grabs your arm and studies your face.`,`在${c.place.zh}，一个${c.npc.desc.zh}一把拉住你，端详你的面相。`),
 out:[{w:2,t:T('"Dragon brows, phoenix eyes! You will shake the jianghu." He asks for ten coppers.','"龙眉凤目！你将来要震动江湖。"他伸手要十文钱。'),fx:{happy:5,flag:'prophecy_great'}},
  {w:2,t:T('"A blood debt follows you. Beware a man with one eye."','"你命里有一笔血债。小心一只眼的人。"'),fx:{happy:-4,flag:'prophecy_eye'}},
  {w:2,t:T('"Long life, many children, no fame at all." He seems to think that is good news.','"长寿，多子，一辈子无名。"他好像觉得这是好消息。'),fx:{lifespan:1}},
  {w:1,t:T('"I see nothing. Nothing at all." He gives your coin back and leaves quickly.','"我什么都看不出来。什么都没有。"他把钱还给你，匆匆走了。'),c:'muted'}]});
I({id:'peaches',age:[6,13],once:1,text:()=>T('The rich man’s orchard is heavy with peaches, and the wall is low.','财主家的桃园结满了桃子，院墙又矮。'),
 opts:[{l:T('Climb in','翻进去'),out:[{w:3,t:T('You eat until you are sick. Worth it.','你吃到肚子疼。值了。'),fx:{happy:5,align:-1}},{w:2,t:T('The gardener catches you and makes you weed the orchard for a month.','园丁抓住了你，罚你在园子里拔了一个月草。'),fx:{happy:-3,skill:1}},{w:1,t:T('You fall off the wall.','你从墙上摔了下来。'),c:'bad',fx:{hurt:[5,15],cause:T('a fall from an orchard wall','从院墙上摔下')}}]},
  {l:T('Knock and ask','敲门讨几个'),out:[{w:2,t:T('The rich man’s wife gives you a basket. Her husband is furious.','财主太太给了你一篮。财主气坏了。'),c:'good',fx:{happy:4}},{w:2,t:T('They set the dogs on you.','他们放狗咬你。'),c:'bad',fx:{hurt:[3,10],cause:T('a rich man’s dog','财主家的狗')}}]},
  {l:T('Leave it','算了'),out:[{t:T('You walk past, mouth watering.','你咽着口水走开了。'),c:'muted',fx:{align:1}}]}]});
I({id:'graveyard',age:[8,15],once:1,text:()=>T('The older children dare you to spend a night in the burial ground.','大孩子们赌你不敢在乱葬岗过一夜。'),
 opts:[{l:T('Go','去'),out:[{w:3,t:T('Nothing happens except owls. You win their respect and three sweets.','除了猫头鹰什么都没有。你赢得了他们的敬佩和三块糖。'),c:'good',fx:{happy:5,talent:{heart:1}}},{w:1,t:T('A pale figure rises between the graves. It is a grave robber, more scared than you.','坟堆间站起一个白影。原来是个盗墓贼，比你还害怕。'),fx:{happy:3,money:[2,10]}},{w:1,t:T('You see something you never tell anyone about.','你看到了一些东西，这辈子都没跟人说过。'),c:'muted',fx:{qi:3,happy:-3}}]},
  {l:T('Refuse','不去'),out:[{t:T('You go home and sleep soundly. Cowards live longer.','你回家睡得很香。胆小的人活得久。'),c:'muted'}]}]});
I({id:'injuredbird',age:[5,14],once:1,text:()=>T('You find a crane with a broken wing in the reeds.','你在芦苇荡里发现一只折了翅膀的白鹤。'),
 out:[{w:3,t:T('You nurse it all winter. In spring it circles your house three times before flying away.','你养了它一冬。开春时，它绕着你家飞了三圈才离去。'),c:'good',fx:{happy:6,talent:{luck:1},flag:'nursedcrane'}},{w:1,t:T('It dies in your hands. You bury it under the willow.','它死在了你手里。你把它埋在柳树下。'),c:'bad',fx:{happy:-6}},{w:1,t:T('A Daoist priest sees you caring for it and teaches you a breathing exercise "cranes use".','一位道长见你照料白鹤，教了你一套"仙鹤吐纳法"。'),c:'gold',fx:{qi:8}}]});
I({id:'sibfight',age:[5,20],cd:6,when:s=>living(s,'sibling').length>0,ctx:s=>({sib:pick(living(s,'sibling'))}),text:(c,s)=>T(`You and your ${relLabel(s,c.sib).en.toLowerCase()} ${c.sib.n.py} fight over a ${pick(['kite','pair of shoes','bowl of dumplings','wooden sword'])}.`,`你和${relLabel(s,c.sib).zh}${c.sib.n.cn}为了${pick(['一只风筝','一双鞋','一碗饺子','一把木剑'])}打了起来。`),
 out:[{w:2,t:T('Your mother punishes both of you. You end up laughing about it.','娘把你们俩都罚了。后来你们笑成一团。'),fx:{f:(s,c)=>addBond(person(s,c.sib.id),5)}},{w:2,t:T('You win, and feel bad about it later.','你赢了，事后又觉得过意不去。'),fx:{f:(s,c)=>addBond(person(s,c.sib.id),-6)}},{w:1,t:T('It turns into a real grudge.','这件事结下了真仇。'),c:'bad',fx:{f:(s,c)=>addBond(person(s,c.sib.id),-15)}}]});
I({id:'kite',age:[4,12],cd:5,text:c=>T(`${c.intro.en}, you fly a paper kite shaped like a ${pick(['swallow','centipede','carp','phoenix'])}.`,`${c.intro.zh}，你放了一只${pick(['燕子','蜈蚣','鲤鱼','凤凰'])}风筝。`),
 out:[{w:3,t:T('It flies higher than anyone’s.','它飞得比谁的都高。'),c:'good',fx:{happy:5}},{w:2,t:T('The string snaps and it sails away over the hills.','线断了，风筝飘过了山头。'),fx:{happy:-2}},{w:1,t:T('It lands in the courtyard of a beautiful mansion. The girl inside returns it with a smile.','它落进一座大宅的院子。院里的小姐笑着把它递了出来。'),fx:{happy:4,flag:'kitegirl'}}]});
I({id:'storyteller',age:[5,14],once:1,ctx:s=>({npc:npc(s,{occ:19,age:rint(60,80)})}),text:()=>T('An old storyteller stays a winter in your village.','一位老说书人在你们村过冬。'),
 out:[{w:2,t:T('He teaches you to read using the tale of the Three Kingdoms.','他用《三国》教你认字。'),c:'good',fx:{smarts:8}},{w:2,t:T('His stories fill your head with heroes. You can think of nothing else.','他的故事让你满脑子都是英雄。你再也想不了别的。'),fx:{happy:5,align:3}},{w:1,t:T('He was a famous swordsman once. Before he leaves he shows you one move.','他年轻时是有名的剑客。临走前教了你一招。'),c:'gold',fx:{skill:4}}]});

/* ---------- family ---------- */
I({id:'parentill',age:[10,70],cd:12,when:s=>living(s,['father','mother']).length>0,ctx:s=>({p:pick(living(s,['father','mother']))}),text:(c,s)=>T(`Your ${c.p.rel} ${c.p.n.py} falls seriously ill. The doctor wants 80 taels for the good medicine.`,`你的${relLabel(s,c.p).zh}${c.p.n.cn}病重，大夫说好药要八十两。`),
 opts:[{l:T('Pay for the medicine','花钱买药'),cost:80,out:[{w:4,t:T('The medicine works.','药起效了。'),c:'good',fx:{f:(s,c)=>{const p=person(s,c.p.id);addBond(p,15);p.age=Math.max(30,p.age-3)}}},{w:1,t:T('Even the best medicine cannot help.','再好的药也没用了。'),c:'bad',fx:{f:(s,c)=>{const p=person(s,c.p.id);p.alive=false;onDeath(s,p)}}}]},
  {l:T('Find herbs in the mountains yourself','自己进山采药'),out:[{w:s=>s.t.luck,t:T('You find the herb on a cliff edge. The fever breaks.','你在悬崖边找到了药草。病退了。'),c:'good',fx:{f:(s,c)=>addBond(person(s,c.p.id),20)}},{w:3,t:T('You fall and come home empty-handed and hurt.','你摔下山坡，空手而归，还受了伤。'),c:'bad',fx:{hurt:[10,25],cause:T('a fall while gathering herbs','采药时坠崖')}}]},
  {l:T('You cannot afford it','实在拿不出钱'),out:[{w:2,t:T('They recover slowly on their own.','靠自己慢慢熬好了。'),fx:{happy:-4}},{w:1,t:T('They die that winter.','那年冬天，人走了。'),c:'bad',fx:{f:(s,c)=>{const p=person(s,c.p.id);p.alive=false;onDeath(s,p)}}}]}]});
I({id:'sibmarry',age:[12,60],cd:15,when:s=>living(s,'sibling').some(p=>p.age>=17),ctx:s=>({sib:pick(living(s,'sibling').filter(p=>p.age>=17))}),text:(c,s)=>T(`Your ${relLabel(s,c.sib).en.toLowerCase()} ${c.sib.n.py} is getting married.`,`你的${relLabel(s,c.sib).zh}${c.sib.n.cn}要成亲了。`),
 opts:[{l:T('Give a generous gift (50 taels)','送份厚礼（五十两）'),cost:50,out:[{t:T('The whole family talks about your gift for years.','这份礼让全家念叨了好几年。'),c:'good',fx:{f:(s,c)=>addBond(person(s,c.sib.id),15)}}]},
  {l:T('Get drunk at the banquet','在喜宴上喝个痛快'),out:[{w:2,t:T('You sing, badly. Everyone loves it.','你扯着嗓子唱歌，难听极了，大家却很开心。'),fx:{happy:6}},{w:1,t:T('You fall into the pond with the groom’s uncle.','你和新郎的舅舅一起掉进了池塘。'),fx:{happy:3,f:(s,c)=>addBond(person(s,c.sib.id),-3)}},{w:1,t:T('You meet someone interesting at the next table.','你在邻桌认识了一个有意思的人。'),c:'good',fx:{meet:'acq'}}]},
  {l:T('Skip it','不去'),out:[{t:T('They notice you were not there.','他们注意到你没来。'),c:'bad',fx:{f:(s,c)=>addBond(person(s,c.sib.id),-12)}}]}]});
I({id:'childtrouble',age:[25,80],cd:6,when:s=>living(s,'child').some(p=>p.age>=8&&p.age<=25),ctx:s=>({k:pick(living(s,'child').filter(p=>p.age>=8&&p.age<=25))}),text:(c,s)=>T(`Your ${c.k.sex==='m'?'son':'daughter'} ${c.k.n.py} ${pick(['has been caught gambling','beat up a magistrate’s nephew','wants to run away and join a sect','fell in love with someone unsuitable'])}.`,`你的${c.k.sex==='m'?'儿子':'女儿'}${c.k.n.cn}${pick(['被抓到在赌钱','把县太爷的侄子打了','想离家出走去拜师','爱上了一个门不当户不对的人'])}。`),
 opts:[{l:T('Be strict','严加管教'),out:[{w:2,t:T('They sulk for a month and then thank you, years later.','孩子赌气了一个月，多年后才向你道谢。'),fx:{f:(s,c)=>addBond(person(s,c.k.id),-5)}},{w:1,t:T('They stop speaking to you.','孩子不再跟你说话了。'),c:'bad',fx:{f:(s,c)=>addBond(person(s,c.k.id),-15)}}]},
  {l:T('Talk it through','好好谈谈'),out:[{w:3,t:T('You listen more than you talk. It helps.','你听得比说得多，这有用。'),c:'good',fx:{f:(s,c)=>addBond(person(s,c.k.id),8)}},{w:1,t:T('They do it anyway, but they tell you first.','孩子还是照做了，但先告诉了你。'),fx:{f:(s,c)=>addBond(person(s,c.k.id),3)}}]},
  {l:T('Pay to make it go away (60 taels)','花钱摆平（六十两）'),cost:60,out:[{t:T('The problem disappears. The lesson does too.','麻烦没了，教训也没了。'),fx:{f:(s,c)=>addBond(person(s,c.k.id),4)}}]}]});
I({id:'grandchild',age:[45,100],cd:5,when:s=>living(s,'child').some(p=>p.age>=20),text:()=>T('A grandchild is born.','你抱上了孙辈。'),out:[{t:T('You hold the baby and feel every one of your years, in a good way.','你抱着孩子，第一次觉得老了也挺好。'),c:'good',fx:{happy:10}}]});

/* ---------- love ---------- */
I({id:'crush',age:[14,40],cd:5,when:s=>!living(s,['lover','spouse']).length,ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-4,4),14,60)});return c},
 text:c=>T(`${c.intro.en}, at ${c.place.en}, you meet ${c.npc.en} (${c.npc.zh}), ${c.npc.tr.en} and impossible to stop looking at.`,`${c.intro.zh}，在${c.place.zh}，你遇见了${c.npc.zh}。此人${c.npc.tr.zh}，叫你挪不开眼。`),
 opts:[{l:T('Start a conversation','上前搭话'),out:[{w:s=>2+s.looks/30,t:c=>T(`You talk until the lanterns go out. ${c.npc.en} asks to see you again.`,`你们一直聊到灯笼熄灭。${c.npc.zh}约你下次再见。`),c:'good',fx:{meet:'lover',bond:60,happy:8}},
   {w:2,t:c=>T(`${c.npc.en} is polite and leaves quickly.`,`${c.npc.zh}客客气气，很快就走了。`),c:'muted',fx:{meet:'acq',bond:40}},
   {w:1,t:c=>T(`${c.npc.en} is already married, and ${c.npc.his} spouse is standing right behind you.`,`${c.npc.zh}早已成亲，${c.npc.ta}的另一半就站在你身后。`),c:'bad',fx:{happy:-4}}]},
  {l:T('Write a poem and leave it','写首诗留下'),out:[{w:s=>s.smarts/15,t:T('The poem works. A reply arrives three days later.','诗起了作用，三天后收到了回信。'),c:'good',fx:{meet:'lover',bond:55}},{w:3,t:T('Nobody ever mentions it.','此后再没人提起这首诗。'),c:'muted'}]},
  {l:T('Let the moment pass','让这一刻过去'),out:[{t:T('You think about that face for a year.','那张脸你想了整整一年。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'lovertrouble',age:[16,60],cd:4,when:s=>living(s,'lover').length>0,ctx:s=>({p:living(s,'lover')[0]}),text:c=>T(`${c.p.n.py}’s family has arranged a marriage for ${c.p.sex==='m'?'him':'her'} with someone else.`,`${c.p.n.cn}的家人给${c.p.sex==='m'?'他':'她'}另订了一门亲事。`),
 opts:[{l:T('Elope','私奔'),out:[{w:3,t:c=>T(`You run away together and marry in a little temple. ${c.p.n.py} is now your spouse.`,`你们一起私奔，在一座小庙里拜了堂。`),c:'gold',fx:{happy:12,f:(s,c)=>{const p=person(s,c.p.id);p.rel='spouse';deed(s,`Eloped with ${p.n.py}`,`与${p.n.cn}私奔成亲`)}}},{w:1,t:T('Their family’s guards catch you on the road.','对方家里的护院在路上截住了你们。'),c:'bad',fx:{hurt:[15,30],cause:T('angry in-laws','愤怒的亲家'),f:(s,c)=>{const p=person(s,c.p.id);p.rel='ex'}}}]},
  {l:T('Ask the family for permission','登门求亲'),out:[{w:s=>1+s.fame/30+s.money/400,t:T('Somehow, they agree.','不知怎的，对方家里竟然答应了。'),c:'gold',fx:{f:(s,c)=>{const p=person(s,c.p.id);p.rel='spouse';deed(s,`Married ${p.n.py}`,`与${p.n.cn}结为夫妻`)}}},{w:3,t:T('They laugh you out of the house.','他们把你笑着轰出了门。'),c:'bad',fx:{f:(s,c)=>{person(s,c.p.id).rel='ex'},happy:-12}}]},
  {l:T('Let them go','放手'),out:[{t:T('You attend the wedding and smile all through it.','你去喝了喜酒，从头笑到尾。'),c:'muted',fx:{happy:-10,f:(s,c)=>{person(s,c.p.id).rel='ex'}}}]}]});
I({id:'spousequarrel',age:[18,90],cd:4,when:s=>!!spouseOf(s),ctx:s=>({p:spouseOf(s)}),text:c=>T(`${c.p.n.py} says you spend more time with your sword than with ${c.p.sex==='m'?'him':'her'}.`,`${c.p.n.cn}抱怨你陪剑的时间比陪${c.p.sex==='m'?'他':'她'}还多。`),
 opts:[{l:T('Apologise and stay home a month','认错，在家陪一个月'),out:[{t:T('It was a good month.','那是很好的一个月。'),c:'good',fx:{happy:5,f:(s,c)=>addBond(person(s,c.p.id),10),skill:-1}}]},
  {l:T('Argue back','顶嘴'),out:[{w:2,t:T('You sleep in the stable for a week.','你在马厩里睡了一个星期。'),c:'bad',fx:{f:(s,c)=>addBond(person(s,c.p.id),-10)}},{w:1,t:T('It ends in laughter, somehow.','不知怎的，最后两人都笑了。'),fx:{f:(s,c)=>addBond(person(s,c.p.id),3)}}]},
  {l:T('Buy a jade bracelet (60 taels)','买只玉镯（六十两）'),cost:60,out:[{t:T('The bracelet is accepted. The point is noted.','镯子收下了，话也记下了。'),fx:{f:(s,c)=>addBond(person(s,c.p.id),8)}}]}]});
I({id:'oldflame',age:[25,70],cd:15,when:s=>s.people.some(p=>p.alive&&p.rel==='ex'),ctx:s=>({p:pick(s.people.filter(p=>p.alive&&p.rel==='ex'))}),text:c=>T(`You run into ${c.p.n.py}, your old love, at the ferry.`,`你在渡口遇见了旧情人${c.p.n.cn}。`),
 out:[{w:2,t:T('You talk like no time has passed.','你们聊着，仿佛岁月从未流逝。'),fx:{happy:4,f:(s,c)=>addBond(person(s,c.p.id),12)}},{w:2,t:T('You nod at each other and look away.','你们点头示意，又各自移开了目光。'),c:'muted'},{w:1,t:T('The old spark is still there.','那团旧火还没灭。'),c:'good',fx:{f:(s,c)=>{if(!spouseOf(s)){const p=person(s,c.p.id);p.rel='lover';p.bond=60}}}}]});

/* ---------- old age ---------- */
I({id:'upstart',age:[50,90],cd:6,when:s=>power(s)>=40&&s.fame>=15,ctx:s=>({npc:npc(s,{age:rint(19,26),occ:pick([13,14])})}),text:c=>T(`A young fighter, ${c.npc.en}, comes to your gate demanding to test "the old legend".`,`一个叫${c.npc.zh}的年轻人找上门来，要会会"这位老前辈"。`),
 opts:[{l:T('Teach the youngster a lesson','教训一下这后生'),fight:FG(s=>Math.round(power(s)*(.75+R()*.4)),'light',T('Old versus young','老少过招'),T('a challenge from a young fighter','年轻人的挑战')),
   win:[{t:c=>T(`Three moves. ${c.npc.en} kneels and asks to become your disciple.`,`三招。${c.npc.zh}跪下求你收徒。`),c:'good',fx:{fame:4,meet:'disciple',bond:70}},{w:.6,t:T('You win, barely. Your knees will hurt for a week.','你赢了，赢得很勉强。膝盖要疼一个星期。'),fx:{fame:3}}],
   lose:[{t:c=>T(`${c.npc.en} wins and tells the whole jianghu.`,`${c.npc.zh}赢了，传遍了整个江湖。`),c:'bad',fx:{fame:-5,happy:-8}}]},
  {l:T('Serve tea and decline','奉茶婉拒'),out:[{w:2,t:T('The youngster leaves, puzzled and a little ashamed.','年轻人摸不着头脑，有点惭愧地走了。'),fx:{align:2}},{w:1,t:T('The youngster calls you a coward in the teahouses.','年轻人在茶馆里说你是缩头乌龟。'),c:'bad',fx:{fame:-3}}]}]});
I({id:'memoir',age:[55,100],once:1,when:s=>s.smarts>=40,text:()=>T('You think about writing down what you have learned.','你想把这辈子所学写下来。'),
 opts:[{l:T('Write a martial manual','著一部武学心得'),if:s=>power(s)>=60,out:[{t:T('It takes three winters. Young fighters will copy it for a hundred years.','写了三个冬天。此后百年，年轻武人争相传抄。'),c:'gold',fx:{fame:15,deed:T('Wrote a martial arts manual','著有武学心得一部')}}]},
  {l:T('Write a memoir','写一部回忆录'),out:[{w:2,t:T('It is honest, which makes several old friends angry.','写得太实诚，得罪了好几个老朋友。'),fx:{fame:4,happy:4}},{w:1,t:T('The storytellers turn it into a hit.','说书人把它改成了热门段子。'),c:'good',fx:{fame:10,money:[20,120]}}]},
  {l:T('Burn your notes','把笔记烧了'),out:[{t:T('Some things should end with you.','有些东西，就该随你而去。'),c:'muted',fx:{happy:3}}]}]});
I({id:'oldfriend',age:[50,100],cd:8,text:()=>{const n=genName(chance(.5)?'m':'f');return T(`An old friend from your youth, ${n.py}, turns up at your door with a jar of wine.`,`年少时的老朋友${n.cn}提着一坛酒来敲你的门。`)},
 out:[{w:3,t:T('You drink and talk about people who are gone.','你们喝着酒，聊起那些已经不在的人。'),c:'good',fx:{happy:8}},{w:1,t:T('The visit turns out to be about borrowing money. You lend it anyway.','原来是来借钱的。你还是借了。'),fx:{money:[-80,-10],happy:2}},{w:1,t:T('It turns out to be a goodbye.','原来这是来道别的。'),c:'muted',fx:{happy:-3}}]});
I({id:'donate',age:[50,100],once:1,when:s=>s.money>=500,text:()=>T('The abbot of a ruined temple asks if you will pay to rebuild it.','一座破庙的住持问你肯不肯出钱重修庙宇。'),
 opts:[{l:T('Donate 300 taels','捐三百两'),cost:300,out:[{t:T('Your name is carved on the new stele.','你的名字刻在了新立的石碑上。'),c:'good',fx:{align:10,fame:6,lifespan:1,happy:5}}]},
  {l:T('Decline','婉拒'),out:[{t:T('The abbot bows anyway.','住持还是向你合十行礼。'),c:'muted'}]}]});
I({id:'lastwish',age:[70,110],once:1,text:()=>T('You wake one morning knowing your time is short.','一天清晨醒来，你知道自己时日无多了。'),
 opts:[{l:T('Visit your birthplace once more','回故乡看看'),out:[{t:T('The village is different. The river is the same.','村子变了，河还是那条河。'),c:'good',fx:{happy:12}}]},
  {l:T('Gather your family','把家人叫到身边'),out:[{t:T('Everyone comes. Even the ones you argued with.','大家都来了，连吵过架的也来了。'),c:'good',fx:{happy:15,f:s=>living(s,['child','spouse','sibling']).forEach(p=>addBond(p,10))}}]},
  {l:T('Climb a mountain alone','独自登山'),out:[{t:T('At the top you sit and watch the clouds for a whole day.','你在山顶坐了一整天，看云。'),c:'good',fx:{happy:10,qi:5}}]}]});

QHINT.loanshark={t:T('You owe a loan shark: 100 taels borrowed, 300 to repay. His men will come within the year or two.','你欠着印子钱：借了一百两，要还三百两。打手一两年内就会上门。'),done:'loancollect'};
