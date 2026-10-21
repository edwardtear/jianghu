/* 江湖一生 · side quests: multi-year story chains with branches and different endings */
'use strict';

/* helpers (all prefixed q to avoid clashing with other files) */
const qW=(f,n)=>s=>s.flags[f]!=null&&s.age-s.flags[f]>=n;
const qTag=t=>(s,c)=>{const p=c.pid&&person(s,c.pid);if(p)p.qtag=t;if(c.npc)qSet(s,'who_'+t,{n:c.npc.n,sex:c.npc.sex,d:c.npc.age-s.age})};
const qWho=(s,t)=>s.people.find(p=>p.qtag===t&&p.alive);
const qCtx=(t,o)=>s=>{const c=scene();const p=qWho(s,t);
  const q=qGet(s,'who_'+t);
  if(p){c.npc=npc(s,Object.assign({},o||{},{name:p.n,sex:p.sex,age:p.age,lv:p.lv}));c.pid=p.id}
  else c.npc=npc(s,Object.assign({},o||{},q?{name:q.n,sex:q.sex,age:Math.max(8,s.age+q.d)}:{}));return c};
const qSet=(s,k,v)=>{(s.qn=s.qn||{})[k]=v};
const qGet=(s,k)=>(s.qn&&s.qn[k])||null;
const qFoe=(s,k)=>qGet(s,k)||foeName();
const qPR=(c,m,f,zm,zf)=>c.npc.sex==='m'?T(m,zm):T(f,zf);

/* =====================================================================
   1. The runaway in the woodshed (childhood, open to all)
   ===================================================================== */
QHINT.q_prince_1=T('The child with the dragon pendant is still hiding in your woodshed.','柴房里那个戴龙纹玉佩的孩子还藏着。');
QHINT.q_prince_2a=T('Your royal friend escaped. Will they remember you?','落难的小伙伴逃走了。会记得你吗？');
QHINT.q_prince_2b=T('You fought for your friend at the woodshed door. They promised to come back.','你在柴房门口为朋友拼过命。对方说会回来。');
I({id:'q_prince',age:[7,12],w:1.3,once:1,
 ctx:s=>{const c=scene();const sx=chance(.5)?'f':'m';c.npc=npc(s,{occ:sx==='f'?20:21,sex:sx,age:clamp(s.age+rint(-1,1),6,13),lv:2});return c},
 text:c=>T(`A filthy child is hiding in your family’s woodshed. ${c.npc.He} eats like a wolf but talks like a scholar, and says ${c.npc.his} name is ${c.npc.en}. Under the rags you glimpse a jade pendant carved with a dragon.`,`你家柴房里躲着个脏兮兮的孩子，吃起东西狼吞虎咽，说起话来却文绉绉的，自称${c.npc.zh}。破衣裳底下露出一块雕着龙纹的玉佩。`),
 opts:[{l:T('Share your food and keep the secret','分饭给这孩子，守住秘密'),out:[{t:c=>T(`All summer you smuggle rice to ${c.npc.en} in your sleeve. You teach ${c.npc.him} to catch frogs. ${c.npc.He} teaches you to write your name properly.`,`整整一个夏天，你把饭藏在袖子里带给${c.npc.zh}。你教${c.npc.ta}捉青蛙，${c.npc.ta}教你把名字写端正。`),c:'good',fx:{meet:'friend',bond:75,happy:6,smarts:2,flag:'q_prince_1',f:qTag('prince')}}]},
  {l:T('Tell the grown-ups','告诉大人'),out:[{t:T('Your father goes white at the sight of the pendant. That night riders take the child away. Suddenly your family has silver for a new roof, and nobody will say why.','父亲一看那玉佩，脸都白了。当夜就有人骑马把孩子接走了。家里忽然有了修屋顶的银子，可谁也不肯说为什么。'),c:'muted',fx:{money:30,happy:-3}}]},
  {l:T('Chase the little thief away','把这小贼赶走'),out:[{t:T('The child goes without a word. Years later you still think about that dragon pendant.','那孩子一声不吭地走了。很多年后，你还会想起那块龙纹玉佩。'),c:'muted'}]}]});
I({id:'q_prince_hunt',need:'q_prince_1',age:[8,95],w:6,once:1,when:qW('q_prince_1',1),ctx:qCtx('prince'),
 text:c=>T(`Men in black ride into the village asking about a child with a dragon pendant. In the woodshed, ${c.npc.en} is shaking.`,`一群黑衣人骑马进了村，打听一个戴龙纹玉佩的孩子。柴房里，${c.npc.zh}浑身发抖。`),
 opts:[{l:T('Send them the wrong way','把他们支到别处'),out:[{w:s=>2+s.t.wit/3,t:c=>T(`You swear you saw a child running towards the river. They gallop off. That night ${c.npc.en} slips away, whispering, “I won’t forget.”`,`你赌咒说看见一个孩子往河边跑了。他们策马而去。当夜，${c.npc.zh}悄悄离开，低声说："我不会忘的。"`),c:'good',fx:{smarts:1,bond:10,unflag:'q_prince_1',flag:'q_prince_2a'}},
   {w:1,t:c=>T(`They don’t believe you. One slaps you so hard your ears ring. But by the time they search the shed, ${c.npc.en} is gone.`,`他们不信，一巴掌把你扇得耳朵嗡嗡响。可等他们搜柴房时，${c.npc.zh}已经不见了。`),c:'bad',fx:{hurt:[3,8],cause:T('a slap from a man in black','黑衣人的一巴掌'),bond:15,unflag:'q_prince_1',flag:'q_prince_2a'}}]},
  {l:T('Stand in the doorway with a hoe','抄起锄头堵在门口'),fight:FG(PW(.85,2),'injury',T('Men in black at the woodshed','柴房外的黑衣人'),T('a beating from men in black','黑衣人的拳脚'),()=>T('a man in black','黑衣人')),
   win:[{t:c=>T(`You crack the first one across the shins and the rest decide a screaming child isn’t worth it. At dawn ${c.npc.en} presses the pendant’s red tassel into your hand. “I’ll come back for you. I swear it.”`,`你一锄头敲在头一个人的小腿上，其余的人觉得为个哭喊的孩子不值当。天亮时，${c.npc.zh}把玉佩上的红穗子塞进你手里："我会回来找你的，我发誓。"`),c:'good',fx:{fame:2,bond:20,unflag:'q_prince_1',flag:'q_prince_2b'}}],
   lose:[{t:c=>T(`You are knocked flat in the mud. But the scuffle buys enough time. ${c.npc.en} is out the back and over the wall.`,`你被一拳打倒在泥里。可这一闹，给${c.npc.zh}争取了时间，${c.npc.ta}从后门翻墙跑了。`),c:'bad',fx:{bond:15,unflag:'q_prince_1',flag:'q_prince_2a'}}]},
  {l:T('Point at the woodshed','指向柴房'),out:[{t:c=>T(`They drag ${c.npc.en} out. ${c.npc.He} looks at you once and says nothing. A man drops a heavy purse at your feet. You never sleep well near that shed again.`,`他们把${c.npc.zh}拖了出来。${c.npc.ta}只看了你一眼，什么也没说。有人把一只沉甸甸的钱袋丢在你脚边。从此你再也没在柴房附近睡安稳过。`),c:'bad',fx:{money:[60,120],align:-10,happy:-8,bond:-60,unflag:'q_prince_1'}}]}]});
I({id:'q_prince_letter',tags:['town'],need:'q_prince_2a',age:[10,95],w:6,once:1,when:qW('q_prince_2a',2),ctx:qCtx('prince'),
 text:c=>T(`A courier in palace livery asks for you by name. The child from the woodshed was the emperor’s lost ${c.npc.sex==='m'?'son':'daughter'}, and has been brought home.`,`一个穿宫中服色的信差点名找你。当年柴房里那个孩子，竟是流落民间的${c.npc.sex==='m'?'皇子':'公主'}，如今已经回宫了。`),
 out:[{w:3,t:c=>T(`The letter is short and in a familiar clumsy hand: “Frogs are not served at the palace. I miss you.” There is silver with it.`,`信很短，字迹还是那么歪："宫里不吃青蛙。我想你。"随信附了银子。`),c:'gold',fx:{money:[150,300],happy:8,bond:10,unflag:'q_prince_2a',deed:T('Hid a runaway royal child in the family woodshed','曾把落难的皇家骨肉藏在自家柴房')}},
  {w:1,t:T('The letter thanks you in very correct, very cold language. Someone else wrote it. The silver is real, at least.','信写得极客气，也极冷淡，一看就是别人代笔。好在银子是真的。'),c:'muted',fx:{money:[100,200],happy:-2,unflag:'q_prince_2a'}}]});
I({id:'q_prince_court',tags:['wander'],need:'q_prince_2b',age:[12,95],w:6,once:1,when:qW('q_prince_2b',2),ctx:qCtx('prince'),
 text:c=>T(`A procession under yellow banners stops at your gate. ${c.npc.en} steps down from the carriage, now a ${c.npc.sex==='m'?'prince':'princess'} of the realm, and holds up a red tassel. “You held the door for me.”`,`一列打着黄旗的仪仗停在你家门口。${c.npc.zh}走下马车，如今已是当朝${c.npc.sex==='m'?'皇子':'公主'}。${c.npc.ta}举起一缕红穗子："那天，是你替我守的门。"`),
 opts:[{l:T('Swear to be sworn siblings','结为异姓兄弟姐妹'),out:[{t:c=>T(`You kneel side by side before heaven and earth, like two children playing at heroes, except that this time it is real. ${c.npc.en} gives you a horse from the imperial stables.`,`你们并肩跪拜天地，像两个玩英雄游戏的孩子，只是这一回是真的。${c.npc.zh}送了你一匹御厩里的宝马。`),c:'gold',fx:{meet:'sworn',bond:95,item:'bloodhorse',fame:8,happy:10,unflag:'q_prince_2b',deed:c=>T(`Became sworn sibling to ${c.npc.en} of the imperial house`,`与皇家${c.npc.zh}义结金兰`)}}]},
  {l:T('Ask for the village’s taxes to be forgiven','请免了村里的赋税'),out:[{t:T('Three years without taxes. The village puts up a little stone with your name on it. Children climb on it.','全村免赋三年。村口立了一块小石碑，刻着你的名字。孩子们爱在上面爬。'),c:'good',fx:{align:8,fame:6,happy:6,bond:10,unflag:'q_prince_2b',deed:T('Won the home village three years free of tax','为家乡求得免赋三年')}}]},
  {l:T('Ask for silver','要些银子'),out:[{t:c=>T(`${c.npc.en} laughs and gives you more than you asked for. Something in ${c.npc.his} face closes a little, though.`,`${c.npc.zh}笑着给了你比你要的更多的银子。只是${c.npc.ta}的神情，好像淡了一点。`),c:'muted',fx:{money:[500,900],bond:-10,unflag:'q_prince_2b'}}]}]});

/* =====================================================================
   2. The rival in the practice yard (sect members, teens)
   ===================================================================== */
QHINT.q_rival_1=T('Your sect rival is waiting for the youth tournament.','同门对头在等少年比武大会。');
QHINT.q_rival_2a=T('Your beaten rival left the sect, still bitter.','输给你的对头愤然出走了。');
QHINT.q_rival_2b=T('Your old rival respects you now. Keep an ear out for news.','昔日的对头如今敬你几分。留意对方的消息。');
I({id:'q_rival',age:[10,20],w:1.3,once:1,when:s=>!!s.sect,
 ctx:s=>{const c=scene();const sx=chance(.5)?'f':'m';c.npc=npc(s,{occ:sx==='f'?14:13,sex:sx,age:clamp(s.age+rint(-1,1),9,22),lv:power(s)+rint(2,6)});return c},
 text:(c,s)=>T(`${c.npc.en}, who entered ${SECTS[s.sect].en} the same year as you, mocks your stance in front of the whole practice yard.`,`和你同年入${SECTS[s.sect].cn}的${c.npc.zh}，当着整个练武场的面嘲笑你的架势。`),
 opts:[{l:T('Challenge them on the spot','当场挑战'),fight:FG(PW(1.0,3),'spar',T('Practice-yard challenge','练武场上的挑战'),T('a practice bout','比武切磋')),
   win:[{t:c=>T(`You knock ${c.npc.en} into the water trough. The yard roars. ${c.npc.He} climbs out dripping, and from that day watches you like a hawk.`,`你一掌把${c.npc.zh}打进了水槽。满场哄笑。${c.npc.ta}湿淋淋地爬出来，从此像鹰一样盯着你。`),c:'good',fx:{meet:'rival',bond:20,skill:1,flag:'q_rival_1',f:qTag('rival')}}],
   lose:[{t:c=>T(`${c.npc.en} beats you without breaking a sweat. “Again next year?” It is somehow worse than a sneer.`,`${c.npc.zh}不费吹灰之力就赢了你。"明年再来？"这比冷笑还难受。`),c:'muted',fx:{meet:'rival',bond:30,skill:2,flag:'q_rival_1',f:qTag('rival')}}]},
  {l:T('Say nothing. Practise harder','不吭声，加倍苦练'),out:[{t:c=>T(`You practise until moonrise every night. ${c.npc.en} notices, and stops laughing.`,`你每晚练到月上中天。${c.npc.zh}看在眼里，不再笑了。`),c:'good',fx:{meet:'rival',bond:40,skill:3,flag:'q_rival_1',f:qTag('rival')}}]}]});
I({id:'q_rival_cup',need:'q_rival_1',age:[11,95],w:6,once:1,when:qW('q_rival_1',1),ctx:qCtx('rival',{occ:13}),
 text:c=>T(`The youth tournament. You fight your way to the final, and of course ${c.npc.en} is waiting there.`,`少年比武大会。你一路打进决赛，对面站着的，果然是${c.npc.zh}。`),
 opts:[{l:T('Fight with everything you have','全力以赴'),fight:FG(PW(1.05,4),'spar',T('Youth tournament final','少年比武决赛'),T('the tournament final','比武决赛')),
   win:[{t:c=>T(`You win. Your master nods once, which from him is a speech. ${c.npc.en} leaves the ring without bowing.`,`你赢了。师父点了一下头，对他来说这已算长篇大论。${c.npc.zh}没行礼就下了台。`),c:'good',fx:{fame:3,skill:2,bond:-15,unflag:'q_rival_1',flag:'q_rival_2a'}}],
   lose:[{t:c=>T(`You lose by a hair. ${c.npc.en} offers you a hand up, and for once there is no sneer.`,`你惜败一招。${c.npc.zh}伸手拉你起来，这一回，脸上没有讥笑。`),c:'muted',fx:{skill:2,bond:20,unflag:'q_rival_1',flag:'q_rival_2b'}}]},
  {l:T('Let them win','让对方赢'),sub:T('They seem to need it more than you','对方好像比你更需要这场胜利'),out:[{t:c=>T(`You drop your guard at the last moment. Nobody notices except ${c.npc.en}, who corners you afterwards. “Why?” You shrug. ${c.npc.He} doesn’t forget it.`,`最后关头你故意露了个破绽。没人看出来，只有${c.npc.zh}事后堵住你："为什么？"你耸耸肩。${c.npc.ta}记住了。`),fx:{bond:25,align:3,unflag:'q_rival_1',flag:'q_rival_2b'}}]}]});
I({id:'q_rival_road',need:'q_rival_2a',age:[13,95],w:6,once:1,tags:['wander'],when:qW('q_rival_2a',2),ctx:qCtx('rival',{occ:13}),
 text:c=>T(`On a mountain road, ${c.npc.en} steps out of the trees. ${c.npc.He} left the sect after that final and has trained alone ever since. “Again. Properly, this time.”`,`山路上，${c.npc.zh}从林子里走了出来。那场决赛之后${c.npc.ta}便离开了师门，独自苦练至今。"再来。这回来真的。"`),
 opts:[{l:T('Draw and fight','拔剑应战'),fight:FG(PW(1.1,6),'injury',T('A grudge from the practice yard','练武场结下的旧怨'),T('an old rival’s blade','宿敌的剑')),
   win:[{t:c=>T(`You win again. This time ${c.npc.en} laughs instead of sulking. “All these years I only wanted to know if I could.” You get drunk together on the roadside and swear brotherhood. ${c.npc.He} teaches you the sword form ${c.npc.he} invented just to beat you.`,`你又赢了。这一次${c.npc.zh}没有赌气，反而大笑："这些年，我只是想知道自己行不行。"你们在路边喝得大醉，结为金兰。${c.npc.ta}把专为赢你而创的剑法教给了你。`),c:'gold',fx:{meet:'sworn',bond:85,fame:4,art:'goose',unflag:'q_rival_2a',deed:c=>T(`Turned a lifelong rival, ${c.npc.en}, into a sworn sibling`,`化宿敌${c.npc.zh}为结义金兰`)}}],
   lose:[{t:c=>T(`${c.npc.en} cuts you across the arm and sheathes the sword. “Now we’re even.” ${c.npc.He} walks off lighter than ${c.npc.he} came.`,`${c.npc.zh}一剑划破你的手臂，收剑入鞘："这下扯平了。"${c.npc.ta}走的时候，比来时轻松多了。`),c:'bad',fx:{hurt:[8,18],cause:T('an old rival’s blade','宿敌的剑'),bond:15,unflag:'q_rival_2a'}}]},
  {l:T('Walk past without a word','一言不发走过去'),out:[{t:c=>T(`You walk past. ${c.npc.en} doesn’t strike your back. But you hear ${c.npc.him} swear that one day you’ll pay for this.`,`你从${c.npc.zh}身边走了过去。${c.npc.ta}没有从背后出手，可你听见${c.npc.ta}发誓，总有一天要你付出代价。`),c:'muted',fx:{enemy:1,unflag:'q_rival_2a'}}]}]});
I({id:'q_rival_rescue',need:'q_rival_2b',age:[13,95],w:6,once:1,when:qW('q_rival_2b',2),ctx:s=>{const c=qCtx('rival',{occ:13})(s);c.foe=foeName();return c},
 text:c=>T(`A message in ${c.npc.en}’s handwriting: wounded on a mission, pinned down by ${c.foe.en}’s bandits near ${c.place.en}.`,`${c.npc.zh}捎来一封亲笔信：出任务受了伤，被${c.foe.zh}的山贼困在${c.place.zh}附近。`),
 opts:[{l:T('Ride to help','赶去相救'),fight:FG(PW(0.95,4),'injury',T('Rescue at the bandit camp','山寨救人'),T('bandit blades','山贼的刀'),c=>c.foe),
   win:[{t:c=>T(`You cut your way in and carry ${c.npc.en} out on your back. ${c.npc.His} uncle, a sect elder, is so grateful he spends a month correcting every bad habit you have.`,`你杀进山寨，把${c.npc.zh}背了出来。${c.npc.ta}的叔父是位长老，感激之下花了一个月，把你身上的毛病一一纠正。`),c:'gold',fx:{meet:'friend',bond:90,skill:4,qi:4,fame:3,unflag:'q_rival_2b',deed:c=>T(`Rescued a former rival, ${c.npc.en}, from a bandit camp`,`从山寨中救出昔日对头${c.npc.zh}`)}}],
   lose:[{t:c=>T(`It goes badly, but the two of you escape together, bleeding and laughing like idiots.`,`打得一塌糊涂，可你们俩总算一起逃了出来，浑身是血，笑得像两个傻子。`),c:'muted',fx:{meet:'friend',bond:70,unflag:'q_rival_2b'}}]},
  {l:T('Send silver for a doctor instead','寄些银两请大夫'),cost:40,out:[{t:c=>T(`${c.npc.en} recovers and sends back a stiff thank-you note. You never quite become friends. Still, good rivals are rarer than friends.`,`${c.npc.zh}伤好后回了一封客客气气的谢帖。你们终究没成朋友。不过，好对手比朋友更难得。`),fx:{bond:10,unflag:'q_rival_2b'}}]}]});

/* =====================================================================
   3. The stolen sword manual (jianghu, open to all)
   ===================================================================== */
QHINT.q_manual_1=T('You are carrying a stolen sword manual. Mount Hua will come asking.','你身上藏着一本被盗的剑谱。华山派迟早会找来。');
QHINT.q_manual_2=T('You kept the manual from Mount Hua. The Crimson Sky Cult is next.','剑谱没交给华山。下一个找来的是赤霄教。');
QHINT.q_manual_3=T('Three sects have bled for the manual. Someone must end it.','三派为这本剑谱流了血。总得有个了断。');
I({id:'q_manual',age:[16,55],w:1.1,once:1,tags:['wander'],
 text:c=>T(`At ${c.place.en}, a dying man presses an oilcloth bundle into your hands: a half-burned sword manual. “Mount Hua… Emei… the Crimson Sky Cult… they all want it. Don’t let—” He dies before the end of the sentence.`,`在${c.place.zh}，一个垂死的人把一个油布包塞进你手里：半本烧焦的剑谱。"华山……峨眉……赤霄教……都在找它。别让——"话没说完，人就断了气。`),
 opts:[{l:T('Keep it hidden','藏起来'),out:[{t:T('You sew it into the lining of your coat. It feels heavier than paper should.','你把它缝进了衣服夹层。几页纸，却沉得不像纸。'),fx:{flag:'q_manual_1'}}]},
  {l:T('Burn it here and now','当场烧掉'),out:[{t:T('The pages curl and go black. For years afterwards, three sects will hunt for a book that no longer exists.','书页卷曲、焦黑。此后多年，三大门派还在追查一本早已不存在的书。'),c:'muted',fx:{align:2,qi:1}}]},
  {l:T('Sell it to a fence','卖给销赃的'),out:[{t:T('The fence pays without haggling, which tells you that you asked too little.','销赃的连价都没还就付了钱，你这才知道要少了。'),c:'muted',fx:{money:[80,200],align:-4}}]}]});
I({id:'q_manual_hua',need:'q_manual_1',age:[16,95],w:6,once:1,tags:['wander'],when:qW('q_manual_1',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,age:rint(25,40),lv:PW(.95,3)(s)});return c},
 text:c=>T(`Three Mount Hua disciples in blue are waiting at your door. Their leader, ${c.npc.en}, smiles thinly. “You have something of ours.”`,`三个青衫华山弟子等在你门口。为首的${c.npc.zh}皮笑肉不笑："阁下拿了我们的东西。"`),
 opts:[{l:T('Hand it back','交还'),out:[{t:T('They bow very low. “Mount Hua remembers its friends.” They leave you a purse and an invitation to visit.','他们深深一揖："华山不忘朋友。"留下一袋银子和一张拜帖。'),c:'good',fx:{fame:4,align:4,money:40,unflag:'q_manual_1'}}]},
  {l:T('Lie to their faces','当面撒谎'),out:[{w:s=>1+s.t.wit/2,t:T('You look so honestly baffled that they apologise for disturbing you.','你一脸茫然，装得太真，他们反倒赔礼道歉走了。'),c:'good',fx:{smarts:1,unflag:'q_manual_1',flag:'q_manual_2'}},
   {w:2,t:T('They search the house, find it in your coat, and leave you with a black eye as a souvenir.','他们搜了屋子，从你衣服夹层里翻出剑谱，临走还送了你一只乌青眼圈。'),c:'bad',fx:{hurt:[5,12],cause:T('a beating from Mount Hua disciples','华山弟子的一顿打'),unflag:'q_manual_1'}}]},
  {l:T('Fight them for it','动手'),fight:FG((s,c)=>c.npc.lv,'injury',T('Mount Hua disciples at the door','华山弟子登门'),T('Mount Hua swords','华山剑')),
   win:[{t:T('Three blue robes flee down the street. Word spreads that someone stood up to Mount Hua.','三件青衫狼狈逃过长街。江湖上传开了：有人敢跟华山叫板。'),c:'good',fx:{fame:3,unflag:'q_manual_1',flag:'q_manual_2'}}],
   lose:[{t:T('They take the manual from your bleeding hands.','他们从你流血的手里拿走了剑谱。'),c:'bad',fx:{unflag:'q_manual_1'}}]}]});
I({id:'q_manual_cult',need:'q_manual_2',age:[16,95],w:6,once:1,tags:['wander'],when:qW('q_manual_2',1),ctx:s=>{const c=scene();c.foe=foeName();return c},
 text:c=>T(`At midnight, torches surround your inn. ${c.foe.en} of the Crimson Sky Cult calls up to your window: “A thousand taels for the manual. Or nothing, and we take it anyway.”`,`半夜，火把围住了你投宿的客栈。赤霄教的${c.foe.zh}朝你窗口喊话："剑谱换一千两。不换，我们照样拿走。"`),
 opts:[{l:T('Sell it to the cult','卖给赤霄教'),out:[{t:T('They pay less than a thousand, of course. You hear later what they did with it, and wish you hadn’t.','给的当然不到一千两。后来你听说他们拿剑谱干了什么，真希望自己没听说。'),c:'bad',fx:{money:[300,500],align:-12,unflag:'q_manual_2'}}]},
  {l:T('Fight your way out','杀出去'),fight:FG(PW(1.05,6),'injury',T('Night raid by the Crimson Sky Cult','赤霄教夜袭'),T('a Crimson Sky Cult blade','赤霄教的刀'),c=>c.foe),
   win:[{t:c=>T(`You leave ${c.foe.en} in the stable trough and ride off with the manual.`,`你把${c.foe.zh}撂在马槽里，带着剑谱扬长而去。`),c:'good',fx:{fame:4,unflag:'q_manual_2',flag:'q_manual_3'}}],
   lose:[{t:T('They tear the inn apart and the manual with it. You crawl out of the rubble at dawn.','他们把客栈拆了个底朝天，剑谱也被抢走。天亮时你才从废墟里爬出来。'),c:'bad',fx:{hurt:[10,20],cause:T('a Crimson Sky Cult raid','赤霄教夜袭'),unflag:'q_manual_2'}}]},
  {l:T('Climb out the back window','从后窗溜走'),out:[{w:s=>1+s.t.luck/3,t:T('Over the roofs, down a drainpipe, into a passing hay cart. You get away.','翻屋顶，顺水管滑下，跳进一辆过路的草车。你逃掉了。'),fx:{happy:-2,unflag:'q_manual_2',flag:'q_manual_3'}},
   {w:1,t:T('A cultist is waiting under the window. You get away, but not in one piece.','窗下有人守着。你逃是逃了，却挂了彩。'),c:'bad',fx:{hurt:[6,14],cause:T('a cultist waiting under a window','守在窗下的赤霄教教众'),unflag:'q_manual_2',flag:'q_manual_3'}}]}]});
I({id:'q_manual_end',need:'q_manual_3',age:[16,95],w:6,once:1,when:qW('q_manual_3',2),ctx:s=>{const c=scene();c.npc=npc(s,{occ:3,age:rint(50,70),lv:PW(1.3,10)(s)});return c},
 text:c=>T(`An Emei abbess, ${c.npc.en}, finds you. She is very calm. “Three sects have buried people over that book. Let us end it.”`,`峨眉派的${c.npc.zh}师太找到了你，神色平静："为了这本书，三派都埋过人了。该有个了断。"`),
 opts:[{l:T('Burn it before witnesses from all three sects','当着三派的面烧掉'),out:[{t:T('Mount Hua, Emei and the cult stand in a ruined temple and watch it burn. Nobody draws a sword. That alone is a kind of miracle.','华山、峨眉、赤霄教的人站在破庙里，看着它烧成灰。没有人拔剑。这本身就是个奇迹。'),c:'gold',fx:{fame:10,align:10,happy:5,unflag:'q_manual_3',deed:T('Ended the three-sect feud over a stolen sword manual','了结三派争夺剑谱的血仇')}}]},
  {l:T('Study it in secret before giving it up','先偷偷参悟，再交出去'),sub:T('Only half the pages survive. Takes wit.','只剩半本，全看悟性'),out:[{w:s=>s.t.wit,t:T('You read it a hundred times in one night. Half a manual, and you fill in the other half yourself. Your blade gets frighteningly fast.','你一夜读了一百遍。半本剑谱，另一半你自己悟了出来。你的刀快得吓人。'),c:'gold',fx:{art:'lightning',wanted:1,align:-3,unflag:'q_manual_3',deed:T('Rebuilt a lost saber art from half a burned manual','凭半本残谱悟出失传刀法')}},
   {w:4,t:T('The missing pages were missing for a reason. Your qi runs the wrong way and you cough blood for a month.','缺的那几页，缺得有道理。你真气逆行，咳了一个月的血。'),c:'bad',fx:{hurt:[10,25],cause:T('qi deviation from a half-burned manual','残谱练岔了气'),qi:-3,unflag:'q_manual_3'}}]},
  {l:T('Give it to the abbess','交给师太'),out:[{t:T('She tucks it into her sleeve and gives you a vial of Emei medicine in return. “You did the hard part.”','她把剑谱收进袖中，回赠你一瓶峨眉灵药："难的那一半，你已经做了。"'),c:'good',fx:{align:5,fame:4,item:'jadedew',unflag:'q_manual_3'}}]}]});

/* =====================================================================
   4. Avenging your first teacher (family-gated)
   ===================================================================== */
QHINT.q_avenge_1=T('Your first teacher’s killer is still out there.','杀害你启蒙恩师的凶手还逍遥法外。');
QHINT.q_avenge_2=T('You know where the killer is. Time to face them.','你已知道凶手的下落。该去面对了。');
I({id:'q_avenge',age:[15,45],w:1.2,once:1,when:s=>['escort','hunter','peasant','clan','beggar','temple'].includes(s.family),ctx:s=>{const c=scene();c.foe=foeName();return c},
 text:c=>T(`Old Uncle Wei, the boxing teacher who first taught you to stand in a horse stance, is found dead in his yard. There is a nine-ring saber notch in the door frame. The neighbours whisper a name: ${c.foe.en}.`,`当年教你扎第一个马步的拳师魏老伯，被人发现死在自家院里。门框上留着一道九环刀的砍痕。街坊们低声说出一个名字：${c.foe.zh}。`),
 opts:[{l:T('Swear vengeance at his grave','在坟前立誓报仇'),out:[{t:T('You burn incense and make a promise you cannot take back.','你烧了香，许下一个收不回的誓言。'),fx:{align:2,happy:-4,flag:'q_avenge_1',f:(s,c)=>qSet(s,'avenge',c.foe)}}]},
  {l:T('Leave it to the magistrate','交给官府'),out:[{t:T('The constables write a report, shrug, and file it. Uncle Wei deserved better. So did you.','捕快写了份文书，耸耸肩就归档了。魏老伯不该这样，你也不该这样。'),c:'muted',fx:{happy:-5}}]}]});
I({id:'q_avenge_trail',need:'q_avenge_1',age:[15,95],w:6,once:1,tags:['wander'],when:qW('q_avenge_1',1),ctx:s=>{const c=scene();c.foe=qFoe(s,'avenge');c.npc=npc(s,{occ:7});return c},
 text:c=>T(`Uncle Wei’s silver pipe turns up in a pawnshop window. The pawn ticket leads to one of ${c.foe.en}’s henchmen.`,`魏老伯的银烟袋出现在一家当铺的橱窗里。顺着当票，你找到了${c.foe.zh}手下的一个喽啰。`),
 opts:[{l:T('Pay a beggar to follow him','花钱请乞丐盯梢'),cost:40,out:[{t:c=>T(`The beggar ${c.npc.en} is worth every coin. Within a month you know where ${c.foe.en} sleeps, eats and drinks.`,`乞丐${c.npc.zh}这钱花得值。不出一个月，${c.foe.zh}在哪儿吃、在哪儿睡、在哪儿喝酒，你都一清二楚。`),c:'good',fx:{unflag:'q_avenge_1',flag:'q_avenge_2'}}]},
  {l:T('Beat it out of the henchman','把喽啰揍到开口'),fight:FG(PW(.8,2),'light',T('A talk in a back alley','后巷里的“谈话”'),T('a back-alley brawl','后巷斗殴'),()=>T('the henchman','喽啰')),
   win:[{t:c=>T(`He talks, and keeps talking. You learn more about ${c.foe.en} than you wanted to.`,`他开了口，就收不住了。关于${c.foe.zh}，你知道的比你想知道的还多。`),fx:{align:-2,unflag:'q_avenge_1',flag:'q_avenge_2'}}],
   lose:[{t:c=>T(`He beats you, then brags about it in a tavern, loudly enough that you overhear where ${c.foe.en} is staying.`,`他把你揍了一顿，又在酒馆里大声吹嘘，正好让你听见了${c.foe.zh}落脚的地方。`),c:'muted',fx:{unflag:'q_avenge_1',flag:'q_avenge_2'}}]},
  {l:T('Let it go. Revenge is a poison','算了。仇恨是毒药'),out:[{t:T('You put the pipe on Uncle Wei’s grave and walk away. Some nights you still dream of the notch in the door frame.','你把烟袋放在魏老伯坟前，转身离开。有些夜里，你还会梦见门框上那道刀痕。'),c:'muted',fx:{align:3,happy:-3,unflag:'q_avenge_1'}}]}]});
I({id:'q_avenge_end',need:'q_avenge_2',age:[15,95],w:6,once:1,tags:['wander'],when:qW('q_avenge_2',1),ctx:s=>{const c=scene();c.foe=qFoe(s,'avenge');return c},
 text:c=>T(`You find ${c.foe.en} at ${c.place.en}. Grey now, drinking alone. Seeing you, the old killer only sighs. “Wei crippled my father in a duel forty years ago. I waited a long time too.”`,`你在${c.place.zh}找到了${c.foe.zh}。两鬓已白，独自喝酒。见到你，这个老凶手只是叹了口气："四十年前，魏老头比武废了我爹。我也等了很久。"`),
 opts:[{l:T('Duel to the death','生死决斗'),fight:FG(PW(1.05,8),'death',T('Vengeance for Uncle Wei','为魏老伯报仇'),T('a duel of vengeance','复仇之战'),c=>c.foe),
   win:[{t:c=>T(`${c.foe.en} falls. You take the nine-ring saber to Uncle Wei’s grave and leave it there. It does not feel the way you thought it would.`,`${c.foe.zh}倒下了。你把那柄九环刀带到魏老伯坟前，插在那里。感觉和你想的不一样。`),c:'gold',fx:{fame:8,skill:4,qi:3,unflag:'q_avenge_2',deed:T('Avenged the murdered teacher who first trained them','为惨死的启蒙恩师报了血仇')}}],
   lose:[{t:c=>T(`${c.foe.en} stands over you and does not finish it. “Now you know how it feels to wait forty years.” Somehow that is worse.`,`${c.foe.zh}站在你面前，没有下杀手。"现在你知道等四十年是什么滋味了。"这比死还难受。`),c:'bad',fx:{happy:-8,unflag:'q_avenge_2',enemy:1}}]},
  {l:T('Drag them to the magistrate','押去见官'),sub:T('Needs evidence and a clear head','需要证据，也需要冷静'),out:[{w:s=>1+s.smarts/25,t:c=>T(`With the pawn ticket and the saber notch, the magistrate has no choice. ${c.foe.en} goes to the execution ground. Justice, the slow kind.`,`有当票，有刀痕，县官不得不判。${c.foe.zh}被押上了刑场。公道来得慢，但来了。`),c:'good',fx:{align:6,fame:4,unflag:'q_avenge_2',deed:T('Brought their teacher’s killer to justice','将杀师凶手绳之以法')}},
   {w:2,t:c=>T(`${c.foe.en} bribes the magistrate and walks free within the month, smirking.`,`${c.foe.zh}买通了县官，不到一个月就大摇大摆地出来了，还冲你笑。`),c:'bad',fx:{happy:-6,unflag:'q_avenge_2'}}]},
  {l:T('Pour two cups and forgive','斟两杯酒，原谅他'),out:[{t:T('You drink with your teacher’s killer and talk about two dead men who were both stubborn. The hate leaves you. So does something else you can’t name.','你和杀师仇人对饮，聊着两个同样倔强的死人。恨意散了，还有些说不清的东西也跟着散了。'),c:'muted',fx:{align:8,qi:4,happy:4,unflag:'q_avenge_2'}}]}]});

/* =====================================================================
   5. The masked swordsman who keeps saving you (open to all)
   ===================================================================== */
QHINT.q_mask_1=T('A masked swordsman saved your life. Who are they?','一个蒙面剑客救了你的命。那是谁？');
QHINT.q_mask_2a=T('You saw a scar on the masked swordsman’s wrist.','你看见了蒙面剑客手腕上的伤疤。');
QHINT.q_mask_2b=T('You let the masked swordsman go without asking.','你没有追问，放蒙面剑客走了。');
I({id:'q_mask',age:[15,45],w:1.2,once:1,tags:['wander'],ctx:s=>{const c=scene();c.foe=foeName();return c},
 text:c=>T(`${c.intro.en}, ${c.foe.en} and five bandits trap you at ${c.place.en}. Before the first blade lands, a swordsman in a grey mask drops from nowhere, cuts them to pieces, and is gone.`,`${c.intro.zh}，${c.foe.zh}带着五个山贼把你堵在${c.place.zh}。刀还没落下，一个戴灰面具的剑客从天而降，转眼把他们杀得七零八落，随即不见了踪影。`),
 out:[{t:T('All that is left is a single grey thread caught on a thorn bush.','只剩荆棘上挂着的一缕灰线。'),c:'gold',fx:{flag:'q_mask_1',happy:3}}]});
I({id:'q_mask_again',need:'q_mask_1',age:[15,95],w:6,once:1,tags:['wander'],when:qW('q_mask_1',1),
 text:()=>T('A poisoned dart takes you in the neck on a lonely road. As the world goes dark, a grey mask leans over you and forces a bitter herb between your teeth.','荒路上一支毒镖射中你的脖子。眼前发黑时，一张灰面具俯下身来，把一颗苦涩的药丸塞进你嘴里。'),
 opts:[{l:T('Grab their sleeve','一把抓住对方的袖子'),out:[{w:s=>1+s.t.luck/3,t:T('The sleeve tears. On the wrist underneath is an old burn scar shaped like a crescent moon. Your father had a story about a scar like that.','袖子撕开了，手腕上有一道弯月形的旧烫疤。你父亲讲过一个有这样伤疤的人的故事。'),c:'good',fx:{heal:10,flag:'q_mask_2a',unflag:'q_mask_1'}},
   {w:1,t:T('Your fingers close on air. The herb works, though. You wake up alive, which is the main thing.','你抓了个空。好在药管用。你醒来时还活着，这才是要紧的。'),c:'muted',fx:{heal:5,flag:'q_mask_2b',unflag:'q_mask_1'}}]},
  {l:T('Let them go','随对方去'),out:[{t:T('You whisper thanks. The mask nods once, and is gone again.','你低声道谢。面具点了点头，又一次消失了。'),fx:{heal:10,align:2,flag:'q_mask_2b',unflag:'q_mask_1'}}]}]});
I({id:'q_mask_scar',need:'q_mask_2a',age:[15,95],w:6,once:1,when:qW('q_mask_2a',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:13,sex:'m',age:rint(60,75),lv:PW(1.5,25)(s)});return c},
 text:c=>T(`You go to the old shrine your father mentioned and wait. At midnight the grey mask comes, and takes it off. ${c.npc.en}: the swordsman who once fought your grandfather to a draw, and swore to guard his line for a lifetime.`,`你去了父亲提过的那座老祠堂，一直等。半夜，灰面具来了，然后摘了下来。是${c.npc.zh}：当年与你祖父战成平手，并发誓终生守护你家血脉的那位剑客。`),
 opts:[{l:T('Ask to become his disciple','请求拜他为师'),fight:FG((s,c)=>Math.round(power(s)*1.2+8),'spar',T('The masked swordsman’s test','蒙面剑客的考验'),T('a test of skill','考较武功')),
   win:[{t:c=>T(`“Your grandfather would have laughed to see this.” ${c.npc.en} takes you as his last disciple, and teaches you the steps that let a body be in two places at once.`,`"你祖父看到这一幕，定要大笑。"${c.npc.zh}收你为关门弟子，传你一套身形如分化两处的步法。`),c:'gold',fx:{meet:'master',bond:80,art:'shadow',fame:5,unflag:'q_mask_2a',deed:c=>T(`Became the last disciple of the masked swordsman ${c.npc.en}`,`成为蒙面剑客${c.npc.zh}的关门弟子`)}}],
   lose:[{t:c=>T(`“Not yet.” But ${c.npc.en} stays a season anyway, and corrects your footwork until you dream about it.`,`"还不行。"可${c.npc.zh}还是留了一季，纠正你的步法，纠正到你做梦都在走步。`),c:'good',fx:{meet:'master',bond:55,skill:4,unflag:'q_mask_2a'}}]},
  {l:T('Tell him the debt is paid','告诉他，这份恩情已经还清了'),out:[{t:c=>T(`${c.npc.en} is quiet for a long time. Then he bows, puts the mask in your hands, and walks off into the hills a free man.`,`${c.npc.zh}沉默良久，然后深深一揖，把面具放进你手里，作为一个自由的人走进了山里。`),c:'good',fx:{meet:'friend',bond:80,align:5,happy:6,unflag:'q_mask_2a'}}]}]});
I({id:'q_mask_hut',need:'q_mask_2b',age:[15,95],w:6,once:1,tags:['wander'],when:qW('q_mask_2b',2),
 text:()=>T('In a burned-out hut by the road you see a grey mask hanging on a nail. Below it, on a straw mat, an old swordsman is dying of wounds that never healed.','路边一间烧塌的草屋里，钉子上挂着一张灰面具。底下的草席上，一个老剑客正被经年未愈的旧伤拖向死亡。'),
 opts:[{l:T('Pay for a doctor','请大夫来'),cost:60,out:[{w:1,t:T('The doctor buys him a month. He uses it to tell you your grandfather’s real story, then dies smiling, and leaves you his sword.','大夫让他多活了一个月。他用这个月给你讲了你祖父真正的故事，然后含笑而逝，把剑留给了你。'),c:'gold',fx:{item:'steelsword',happy:3,unflag:'q_mask_2b',deed:T('Sat with the masked swordsman in his last days','陪蒙面剑客走完了最后的日子')}},
   {w:1,t:T('The doctor shakes his head at the door. The old man only wanted company anyway. He dies holding your hand.','大夫在门口就摇了摇头。老人其实只想有人陪着。他握着你的手走了。'),c:'muted',fx:{happy:-3,qi:3,unflag:'q_mask_2b'}}]},
  {l:T('Sit with him until the end','陪他到最后'),out:[{t:T('He never says who he is. You bury him under the mask, and leave the sword in the grave where it belongs.','他到最后也没说自己是谁。你把他和面具葬在一起，剑也留在了墓里，那是它该在的地方。'),c:'muted',fx:{align:4,happy:-4,unflag:'q_mask_2b'}}]}]});

/* =====================================================================
   6. Escorting a black coffin (escort families and the north/west roads)
   ===================================================================== */
QHINT.q_coffin_1=T('You are escorting a black coffin a thousand li. Do not open it.','你正护送一口黑棺材走千里路。不许打开。');
QHINT.q_coffin_2=T('Something inside the coffin knocked.','棺材里，有东西在敲。');
QHINT.q_coffin_3a=T('The general’s child from the coffin is still being hunted.','从棺材里出来的将军之后，仍被追杀。');
QHINT.q_coffin_3b=T('Deliver the coffin and collect your pay.','把棺材送到，领你的酬金。');
I({id:'q_coffin',age:[17,55],w:1.2,once:1,tags:['wander'],when:s=>s.family==='escort'||['north','west','central'].includes(s.region),ctx:s=>{const c=scene();c.npc=npc(s,{occ:8,age:rint(40,60)});return c},
 text:c=>T(`Escort master ${c.npc.en} offers you 250 taels to take a black lacquered coffin a thousand li west. One rule: never open it. The mountain passes are snowed in, so it will be years, not months.`,`镖头${c.npc.zh}出二百五十两，请你把一口黑漆棺材往西送一千里。只有一条规矩：绝不许开棺。山口大雪封路，这趟镖要走的是年，不是月。`),
 opts:[{l:T('Take the job','接下这趟镖'),out:[{t:T('Half the pay up front. The coffin is heavier than a dead man should be.','先付一半。这棺材比一个死人该有的分量重。'),fx:{money:60,flag:'q_coffin_1'}}]},
  {l:T('Refuse','推辞'),out:[{t:T('You hear later that nobody else would take it either.','后来你听说，别人也没人敢接。'),c:'muted'}]}]});
I({id:'q_coffin_road',need:'q_coffin_1',age:[17,95],w:6,once:1,tags:['wander'],when:qW('q_coffin_1',1),ctx:s=>{const c=scene();c.foe=foeName();return c},
 text:c=>T(`${c.foe.en}’s gang blocks the pass. “Graves are full of treasure. Coffins too. Leave it.”`,`${c.foe.zh}一伙人堵住了山口："坟里有宝，棺材里也有。把它留下。"`),
 opts:[{l:T('Defend the coffin','护住棺材'),fight:FG(PW(.95,4),'injury',T('Ambush at the pass','山口伏击'),T('road bandits','拦路的山贼'),c=>c.foe),
   win:[{t:T('They scatter. As you right the cart, you could swear something inside the coffin shifted.','山贼四散。你扶正车子的时候，分明觉得棺材里有什么动了一下。'),c:'good',fx:{fame:2,unflag:'q_coffin_1',flag:'q_coffin_2'}}],
   lose:[{t:T('They pry the lid an inch, then scream and run. You never find out what they saw. Neither, quite, do you want to.','他们撬开一寸棺盖，惨叫着跑了。你始终不知道他们看见了什么，也不太想知道。'),c:'bad',fx:{hurt:[6,14],cause:T('road bandits','拦路的山贼'),unflag:'q_coffin_1',flag:'q_coffin_2'}}]},
  {l:T('Pay the toll','交买路钱'),cost:50,out:[{t:T('The bandits count the silver and wave you through, glad not to touch a coffin.','山贼数过银子，挥手放行，倒也乐得不碰棺材。'),fx:{unflag:'q_coffin_1',flag:'q_coffin_2'}}]},
  {l:T('Abandon the coffin and run','丢下棺材逃走'),out:[{t:T('You run. The escort master never pays the rest, and never speaks your name again.','你跑了。镖头没付剩下的酬金，此后也再没提过你的名字。'),c:'bad',fx:{fame:-3,happy:-4,unflag:'q_coffin_1'}}]}]});
I({id:'q_coffin_knock',tags:['wander'],need:'q_coffin_2',age:[17,95],w:6,once:1,when:qW('q_coffin_2',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([12,11]),age:rint(16,24)});return c},
 text:()=>T('Snowed in at a way station, you hear it clearly in the night: three soft knocks from inside the coffin.','大雪困在驿站，夜里你听得清清楚楚：棺材里传来三下轻轻的敲击声。'),
 opts:[{l:T('Open it','开棺'),out:[{t:c=>T(`Inside, drugged and half-frozen, is ${c.npc.en}: the child of a general executed for treason, smuggled out of the capital as a corpse.`,`棺材里躺着被下了药、冻得半僵的${c.npc.zh}：一位以谋逆罪被斩的将军的骨肉，装成死人偷运出京。`),c:'gold',fx:{meet:'friend',bond:60,unflag:'q_coffin_2',flag:'q_coffin_3a',f:qTag('coffin')}}]},
  {l:T('A rule is a rule. Keep it shut','规矩就是规矩，不开'),out:[{t:T('You stuff cotton in your ears. The knocking stops after the third night.','你往耳朵里塞了棉花。第三夜之后，敲击声停了。'),c:'muted',fx:{align:-3,unflag:'q_coffin_2',flag:'q_coffin_3b'}}]}]});
I({id:'q_coffin_hunt',need:'q_coffin_3a',age:[17,95],w:6,once:1,tags:['wander'],when:qW('q_coffin_3a',1),ctx:s=>{const c=qCtx('coffin')(s);c.foe=T('an imperial agent','锦衣卫');return c},
 text:c=>T(`Imperial agents catch up with you at a river crossing. They want ${c.npc.en}, and they have orders to leave no witnesses.`,`锦衣卫在渡口追上了你们。他们要的是${c.npc.zh}，奉命不留活口。`),
 opts:[{l:T('Hold the crossing','守住渡口'),fight:FG(PW(1.1,8),'injury',T('Imperial agents at the ferry','渡口截杀'),T('imperial agents','锦衣卫'),c=>c.foe),
   win:[{t:c=>T(`The agents go into the river. ${c.npc.en} reaches the general’s old soldiers in the west, who send you their master’s own armour in thanks.`,`锦衣卫落了水。${c.npc.zh}平安投奔西边将军的旧部。他们把老将军的贴身宝甲送给你作谢礼。`),c:'gold',fx:{item:'goldsilk',fame:8,align:8,bond:20,wanted:1,unflag:'q_coffin_3a',deed:c=>T(`Smuggled ${c.npc.en}, a condemned general’s child, out of the empire’s reach`,`护送罪臣之后${c.npc.zh}逃出生天`)}}],
   lose:[{t:c=>T(`You are taken. ${c.npc.en} slips away in the confusion. In prison you wonder whether it was worth it, and decide it was.`,`你被拿下了。${c.npc.zh}趁乱逃走。牢里你想过值不值，最后觉得值。`),c:'bad',fx:{jail:2,unflag:'q_coffin_3a'}}]},
  {l:T('Hand them over','把人交出去'),out:[{t:c=>T(`The agents pay you well. ${c.npc.en} doesn’t struggle, which is the worst part.`,`锦衣卫赏得很厚。${c.npc.zh}没有挣扎，这才是最难受的。`),c:'bad',fx:{money:[200,400],align:-12,happy:-8,bond:-60,unflag:'q_coffin_3a'}}]}]});
I({id:'q_coffin_deliver',tags:['wander'],need:'q_coffin_3b',age:[17,95],w:6,once:1,when:qW('q_coffin_3b',1),
 text:()=>T('A year late, you deliver the coffin to a silent house in the west. A woman pays you in full, then asks if you heard anything on the road.','晚了一年，你把棺材送到西边一座静悄悄的宅子。一个女人付清了酬金，然后问你路上有没有听见什么。'),
 opts:[{l:T('“Nothing.”','"什么也没听见。"'),out:[{t:T('She looks at you a long time and shuts the door. You take the money and don’t look back.','她盯着你看了很久，关上了门。你拿了钱，没有回头。'),c:'muted',fx:{money:190,align:-2,happy:-3,unflag:'q_coffin_3b'}}]},
  {l:T('Tell her about the knocking','告诉她敲棺材的事'),out:[{t:T('She sinks to the floor. “They told me my son was dead before they sealed it.” You leave the silver on the step.','她瘫坐在地上："他们封棺前跟我说，我儿子已经死了。"你把银子放在台阶上走了。'),c:'bad',fx:{align:3,happy:-8,unflag:'q_coffin_3b'}}]}]});

/* =====================================================================
   7. A love across enemy sects (sect members, unmarried)
   ===================================================================== */
QHINT.q_love_1=T('You are secretly seeing someone from an enemy sect.','你在和敌对门派的人私下来往。');
QHINT.q_love_2a=T('Your master gave you a chance to win approval for your love.','师父给了你一个机会，争取这门亲事。');
QHINT.q_love_2b=T('You eloped. Both sects are hunting you.','你私奔了。两派都在追捕你们。');
const qEnemySect=s=>['sunmoon','wudu'].includes(s.sect)?pick(['emei','wudang','huashan']):pick(['sunmoon','wudu']);
const qLS=s=>{const k=qGet(s,'lovesect')||'sunmoon';return SECTS[k]||SECTS.sunmoon};
I({id:'q_love',age:[16,30],w:1.2,once:1,tags:['wander'],when:s=>!!s.sect&&!spouseOf(s),
 ctx:s=>{const c=scene();const sx=s.gender==='m'?'f':'m';c.npc=npc(s,{occ:sx==='f'?14:13,sex:sx,age:clamp(s.age+rint(-2,3),16,35)});c.es=qEnemySect(s);return c},
 text:c=>T(`${c.intro.en}, you share a boat across a misty lake with ${c.npc.en}. Halfway across you both notice the other’s sect badge: ${SECTS[c.es].en}. Your sects have been killing each other for three generations. Neither of you moves to a weapon.`,`${c.intro.zh}，你和${c.npc.zh}同乘一条小船过湖。船到湖心，你们才看清对方的门派腰牌：${SECTS[c.es].cn}。两派已经互相厮杀了三代人。谁也没有去摸兵器。`),
 opts:[{l:T('Arrange to meet again, secretly','约好下次偷偷再见'),out:[{t:c=>T(`You meet at the old pagoda every full moon. ${c.npc.en} brings plum wine. You bring bad jokes. It is the best year of your life.`,`每逢月圆，你们就在古塔下相会。${c.npc.zh}带来梅子酒，你带来蹩脚的笑话。那是你一生中最好的一年。`),c:'gold',fx:{meet:'lover',bond:75,happy:10,flag:'q_love_1',f:(s,c)=>{qTag('love')(s,c);qSet(s,'lovesect',c.es)}}}]},
  {l:T('Row to shore and forget it','靠岸，然后忘掉'),out:[{t:T('You do forget, mostly. Every misty morning on the water, not quite.','你差不多忘了。只是每个起雾的早晨，在水上，总忘不干净。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'q_love_found',tags:['wander'],need:'q_love_1',age:[16,95],w:6,once:1,when:qW('q_love_1',1),ctx:qCtx('love'),
 text:(c,s)=>T(`Someone saw you and ${c.npc.en} at the pagoda. Your elders know. So do the elders of ${qLS(s).en}.`,`有人看见了你和${c.npc.zh}在古塔下相会。你的师门长辈知道了，${qLS(s).cn}那边也知道了。`),
 opts:[{l:T('Deny everything and break it off','矢口否认，一刀两断'),out:[{t:c=>T(`You send ${c.npc.en} a single line: “It was a mistake.” You get no reply. You did not expect one, and it still hurts.`,`你给${c.npc.zh}捎去一句话："是我错了。"没有回音。你本就没指望有，可还是心痛。`),c:'bad',fx:{bond:-40,happy:-12,unflag:'q_love_1',f:(s,c)=>{const p=person(s,c.pid);if(p)p.rel='ex'}}}]},
  {l:T('Kneel before your master and ask for a blessing','跪求师父成全'),out:[{w:s=>1+s.smarts/30,t:T('Your master is silent a long time. “Then prove the match is worth a feud. When their elders come, stand your ground.”','师父沉默良久："那就证明这门亲事值得一场恩怨。等对方长老上门，你得站得住。"'),fx:{unflag:'q_love_1',flag:'q_love_2a'}},
   {w:1,t:T('Your master throws a teacup at your head, then, after a night’s thought, says you may try. You are to stand your ground when their elders come.','师父一只茶碗砸在你头上。想了一夜之后，又说你可以试试：对方长老上门时，你得站得住。'),fx:{hurt:[2,5],cause:T('a flying teacup','飞来的茶碗'),unflag:'q_love_1',flag:'q_love_2a'}}]},
  {l:T('Run away together','一起私奔'),out:[{t:c=>T(`You and ${c.npc.en} leave before dawn with one bundle each. Neither sect will forgive this.`,`天亮之前，你和${c.npc.zh}各背一个包袱走了。两派都不会原谅你们。`),c:'gold',fx:{happy:6,wanted:1,unflag:'q_love_1',flag:'q_love_2b',f:s=>{if(s.sect)leaveSect(s)}}}]}]});
I({id:'q_love_elder',tags:['wander'],need:'q_love_2a',age:[16,95],w:6,once:1,when:qW('q_love_2a',1),ctx:qCtx('love'),
 text:(c,s)=>T(`An elder of ${qLS(s).en} arrives to drag ${c.npc.en} home, and challenges you in front of both sects.`,`${qLS(s).cn}的一位长老亲自来要带${c.npc.zh}回去，当着两派的面向你挑战。`),
 opts:[{l:T('Stand your ground','寸步不让'),fight:FG(PW(1.15,10),'injury',T('The elder’s challenge','长老的挑战'),T('an enemy elder’s palm','敌派长老的掌力'),(c,s)=>T(`an elder of ${qLS(s).en}`,`${qLS(s).cn}长老`)),
   win:[{if:s=>!spouseOf(s),t:c=>T(`The elder picks himself up, looks at the two of you, and laughs. “Three generations of fighting, and it ends with a wedding.” You marry ${c.npc.en} with both sects grumbling at the banquet.`,`长老爬起来，看看你们俩，大笑："斗了三代人，竟以一场喜酒收场。"你和${c.npc.zh}成了亲，两派的人在喜宴上嘟嘟囔囔。`),c:'gold',fx:{happy:15,fame:8,align:5,unflag:'q_love_2a',f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='spouse';p.bond=95}},deed:c=>T(`Married ${c.npc.en} and ended a three-generation sect feud`,`与${c.npc.zh}成亲，化解了三代门派仇怨`)}},
    {if:s=>!!spouseOf(s),t:c=>T(`You win, but you are already married. ${c.npc.en} smiles sadly. “It was enough to see you fight for it.” The feud quiets down anyway.`,`你赢了，可你早已成了家。${c.npc.zh}苦笑："能看你为它一战，就够了。"两派的仇倒也就此淡了。`),c:'muted',fx:{fame:6,bond:10,unflag:'q_love_2a'}}],
   lose:[{t:c=>T(`You lose. ${c.npc.en} is taken home. Once a year, a letter comes, smelling of plum wine.`,`你输了。${c.npc.zh}被带了回去。此后每年都有一封信寄来，带着梅子酒的香气。`),c:'bad',fx:{happy:-10,bond:10,unflag:'q_love_2a'}}]},
  {l:T('Step aside','让开'),out:[{t:c=>T(`You step aside. ${c.npc.en} looks back only once, at the gate.`,`你让开了。${c.npc.zh}只在门口回头看了一眼。`),c:'bad',fx:{happy:-12,bond:-50,unflag:'q_love_2a',f:(s,c)=>{const p=person(s,c.pid);if(p)p.rel='ex'}}}]}]});
I({id:'q_love_hiding',need:'q_love_2b',age:[16,95],w:6,once:1,tags:['wander'],when:qW('q_love_2b',1),ctx:qCtx('love'),
 text:c=>T(`You and ${c.npc.en} have built a little life in a valley under false names. Then hunters from both sects find you on the same day.`,`你和${c.npc.zh}隐姓埋名，在一处山谷里过起了小日子。直到有一天，两派的追兵同时找上门来。`),
 opts:[{l:T('Fight side by side','并肩迎敌'),fight:FG(PW(1.0,6),'injury',T('Hunters from both sects','两派追兵'),T('sect hunters','门派追兵'),()=>T('the sect hunters','门派追兵')),
   win:[{if:s=>!spouseOf(s),t:c=>T(`When it is over, ${c.npc.en} says, “Well. Now we should probably get married.” You do, the next morning, with a farmer and his ox as witnesses.`,`打完了，${c.npc.zh}说："好了，现在咱们大概该成亲了。"第二天一早你们就拜了堂，证婚的是一个农夫和他的牛。`),c:'gold',fx:{happy:15,fame:3,unflag:'q_love_2b',f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='spouse';p.bond=95}},deed:c=>T(`Eloped across sect lines with ${c.npc.en}`,`与敌派的${c.npc.zh}私奔成亲`)}},
    {if:s=>!!spouseOf(s),t:c=>T(`You drive them off. ${c.npc.en} goes on alone after that, so the hunters will follow one trail instead of two.`,`你们打退了追兵。此后${c.npc.zh}独自远走，好让追兵只跟一条路。`),c:'muted',fx:{bond:10,unflag:'q_love_2b'}}],
   lose:[{t:c=>T(`${c.npc.en} takes a blade meant for you. ${c.npc.He} lives, barely. You move further into the mountains, and nobody finds you there again.`,`${c.npc.zh}替你挡了一刀，捡回半条命。你们搬进了更深的山里，再也没人找到过。`),c:'bad',fx:{happy:-4,bond:20,unflag:'q_love_2b'}}]},
  {l:T('Give yourself up so they spare your love','自首，求他们放过心上人'),out:[{t:c=>T(`They take you back and leave ${c.npc.en} alone. Your elders are not gentle.`,`他们把你押了回去，放过了${c.npc.zh}。师门的长辈下手可不轻。`),c:'bad',fx:{hurt:[10,20],cause:T('sect punishment','门规责罚'),align:4,unflag:'q_love_2b'}}]}]});

/* =====================================================================
   8. The sibling sold in a famine (open to all)
   ===================================================================== */
QHINT.q_sib_1=T('Somewhere out there is a sibling you never knew.','世上某处，有一个你从不知道的骨肉至亲。');
QHINT.q_sib_2a=T('Your lost sibling may be in an opera troupe.','失散的手足可能在一个戏班里。');
QHINT.q_sib_2b=T('Your lost sibling may be with the bandits of Black Wind Fort.','失散的手足可能在黑风寨的山贼里。');
const qSibCtx=s=>{const c=scene();const q=qGet(s,'sib');c.npc=q?npc(s,{name:q.n,sex:q.sex,age:Math.max(16,s.age+q.d),occ:q.sex==='f'?30:13}):npc(s);return c};
I({id:'q_sib',age:[18,55],w:1.1,once:1,ctx:s=>{const c=scene();c.npc=npc(s,{occ:18,age:rint(70,85)});c.sx=chance(.5)?'f':'m';return c},
 text:c=>T(`On her deathbed, the old midwife ${c.npc.en} grips your wrist. “In the famine year, your parents sold a baby. Your ${c.sx==='m'?'brother':'sister'}. It was the only way any of you lived.”`,`老接生婆${c.npc.zh}临终前抓住你的手腕："荒年那会儿，你爹娘卖了一个孩子。是你${c.sx==='m'?'哥哥':'姐姐'}。不卖，一家人谁都活不成。"`),
 opts:[{l:T('Start searching','开始寻找'),out:[{t:T('You ask everyone who remembers the famine. It is a long list of sad old people.','你挨个去问记得那场饥荒的人。那是一长串伤心的老人。'),fx:{flag:'q_sib_1',f:(s,c)=>{const g=genName(c.sx);qSet(s,'sib',{n:{cn:g.cn,py:g.py,sur:g.sur},sex:c.sx,d:rint(1,4)})}}}]},
  {l:T('Leave the past buried','让往事埋着吧'),out:[{t:T('You never mention it to anyone. Some nights you set an extra bowl at the table without knowing why.','你没跟任何人提起。有些晚上，你会不知不觉多摆一副碗筷。'),c:'muted',fx:{happy:-3}}]}]});
I({id:'q_sib_lead',need:'q_sib_1',age:[18,95],w:6,once:1,tags:['wander'],when:qW('q_sib_1',1),
 text:()=>T('Two leads, both thin. A travelling opera troupe bought a baby that year. So did the bandit chief of Black Wind Fort.','两条线索，都很渺茫。那一年，一个走江湖的戏班买过一个婴儿；黑风寨的寨主也买过一个。'),
 opts:[{l:T('Follow the opera troupe','去追戏班'),out:[{t:T('You follow painted wagons from town to town.','你跟着那些彩绘的车子，一个镇子一个镇子地追。'),fx:{unflag:'q_sib_1',flag:'q_sib_2a'}}]},
  {l:T('Ride to Black Wind Fort','去黑风寨'),out:[{t:T('You sharpen your blade and ride for the hills.','你磨快了刀，策马进山。'),fx:{unflag:'q_sib_1',flag:'q_sib_2b'}}]},
  {l:T('Give up','放弃'),out:[{t:T('Some doors stay shut. You let this one.','有些门注定关着。你没再去推。'),c:'muted',fx:{happy:-4,unflag:'q_sib_1'}}]}]});
I({id:'q_sib_opera',need:'q_sib_2a',age:[18,95],w:6,once:1,tags:['wander'],when:qW('q_sib_2a',1),ctx:qSibCtx,
 text:c=>T(`The troupe’s star, ${c.npc.en}, takes off ${c.npc.his} stage paint, and it is like looking into a mirror. ${c.npc.He} already knows. ${c.npc.He} has known for years and never came looking.`,`戏班的头牌${c.npc.zh}卸了妆，你像在照镜子。${c.npc.ta}早就知道了，知道了很多年，却从没来找过。`),
 opts:[{l:T('Ask why','问为什么'),out:[{w:2,t:c=>T(`“I was angry. Then I was afraid you wouldn’t want me.” You sit on the stage until dawn. ${c.npc.en} is family now, properly.`,`"我恨过。后来又怕你们不认我。"你们在戏台上坐到天亮。从此，${c.npc.zh}是你实实在在的亲人了。`),c:'gold',fx:{meet:'sibling',bond:75,happy:12,unflag:'q_sib_2a',deed:c=>T(`Found ${c.npc.en}, the sibling sold in a famine`,`寻回了荒年被卖的手足${c.npc.zh}`)}},
   {w:1,t:c=>T(`“Because I already have a family. Them.” ${c.npc.en} points at the troupe. ${c.npc.He} gives you a free ticket and nothing else.`,`"因为我已经有家了，就是他们。"${c.npc.zh}指了指戏班的人。${c.npc.ta}送你一张戏票，别的什么也没给。`),c:'muted',fx:{meet:'acq',bond:40,happy:-5,unflag:'q_sib_2a'}}]},
  {l:T('Leave a letter and go','留封信就走'),out:[{t:T('You leave a letter with the doorman. A year later a reply comes, with a pressed flower from the stage.','你把信交给看门的。一年后来了回信，里面夹着一朵戏台上的干花。'),c:'good',fx:{happy:5,unflag:'q_sib_2a'}}]}]});
I({id:'q_sib_fort',need:'q_sib_2b',age:[18,95],w:6,once:1,tags:['wander'],when:qW('q_sib_2b',1),ctx:s=>{const c=qSibCtx(s);c.npc.lv=PW(1.0,5)(s);return c},
 text:c=>T(`The second-in-command of Black Wind Fort is ${c.npc.en}. Same eyes as your mother. ${c.npc.He} draws a blade when you explain. “I don’t need a family that sold me.”`,`黑风寨的二当家叫${c.npc.zh}，眉眼和你娘一模一样。听你说完，${c.npc.ta}拔出了刀："一个把我卖掉的家，我不稀罕。"`),
 opts:[{l:T('Fight to drag them home','打一场，把人带回家'),fight:FG((s,c)=>c.npc.lv,'light',T('A fight with your own blood','和亲骨肉交手'),T('a sibling’s blade','手足的刀')),
   win:[{t:c=>T(`You disarm ${c.npc.en} and refuse to finish it. ${c.npc.He} weeps for the first time since childhood, and comes home with you.`,`你打落了${c.npc.zh}的刀，却不肯下手。${c.npc.ta}哭了，这是${c.npc.ta}懂事以来头一回哭，然后跟你回了家。`),c:'gold',fx:{meet:'sibling',bond:70,align:5,fame:3,happy:10,unflag:'q_sib_2b',deed:c=>T(`Brought a lost sibling, ${c.npc.en}, home from a bandit fort`,`从山寨中带回了失散的手足${c.npc.zh}`)}}],
   lose:[{t:c=>T(`${c.npc.en} knocks you down and stands there breathing hard. “Go home.” But every New Year after, a bag of silver turns up on your doorstep.`,`${c.npc.zh}把你打倒，站在那里喘着粗气："回去吧。"可此后每到年关，你家门口都会多出一袋银子。`),c:'muted',fx:{money:[60,120],meet:'acq',bond:45,unflag:'q_sib_2b'}}]},
  {l:T('Say your piece and leave','把话说完就走'),out:[{t:T('You tell the story of the famine and walk out. Nobody stops you. You never hear from the fort again.','你讲完那年饥荒的事，转身就走。没人拦你。从此黑风寨再没有消息。'),c:'muted',fx:{happy:-4,unflag:'q_sib_2b'}}]}]});

/* =====================================================================
   9. The child who runs off to the jianghu (parents)
   ===================================================================== */
QHINT.q_child_1=T('Your child ran off to the jianghu. Wait for news.','孩子跑去闯江湖了。等消息吧。');
QHINT.q_child_2a=T('You rescued your child from bandits. Will the lesson stick?','你从山贼手里救回了孩子。这一课能记住吗？');
QHINT.q_child_2b=T('You paid your child’s ransom. They have some growing up to do.','你付了孩子的赎金。孩子还得慢慢长大。');
I({id:'q_child',age:[30,80],w:2,once:1,when:s=>living(s,'child').some(p=>p.age>=12&&p.age<=30),
 ctx:s=>{const c=scene();const k=pick(living(s,'child').filter(p=>p.age>=12&&p.age<=30));c.npc=npc(s,{name:k.n,sex:k.sex,age:k.age,lv:k.lv});c.pid=k.id;return c},
 text:c=>T(`You find a note under the teapot in ${c.npc.en}’s handwriting: “Gone to be a hero. Don’t look for me.”`,`你在茶壶底下发现一张字条，是${c.npc.zh}的笔迹："我去当大侠了。别找我。"`),
 opts:[{l:T('Let them go','随孩子去吧'),out:[{t:T('You sit up all night with the lamp lit, the way your own parents probably did.','你点着灯坐了一夜，大概当年你爹娘也是这样。'),c:'muted',fx:{happy:-6,flag:'q_child_1',f:qTag('child')}}]},
  {l:T('Ride after them','骑马去追'),out:[{w:1,t:c=>T(`You catch up at the county border and drag ${c.npc.en} home by the ear. ${c.npc.He} doesn’t speak to you for a month. That is the end of it, for now.`,`你在县界追上了，揪着耳朵把${c.npc.zh}拎回了家。${c.npc.ta}一个月没跟你说话。这事暂时算了结了。`),c:'muted',fx:{bond:-15}},
   {w:2,t:c=>T(`${c.npc.en} has already crossed the river. The ferryman says your child paid with a very bad poem.`,`${c.npc.zh}已经过了河。船夫说，孩子是用一首很烂的诗付的船钱。`),fx:{happy:-4,flag:'q_child_1',f:qTag('child')}}]}]});
I({id:'q_child_trouble',tags:['town'],need:'q_child_1',age:[30,95],w:6,once:1,when:qW('q_child_1',1),ctx:s=>{const c=qCtx('child')(s);c.foe=foeName();return c},
 text:c=>T(`A ransom note: ${c.foe.en}’s gang has ${c.npc.en}. 120 taels, or else.`,`一封勒索信：${c.npc.zh}落在了${c.foe.zh}一伙人手里。一百二十两，不然……`),
 opts:[{l:T('Pay the ransom','付赎金'),cost:120,out:[{t:c=>T(`${c.npc.en} comes home thin, embarrassed and very quiet.`,`${c.npc.zh}回来了，又瘦又羞，一句话也不说。`),fx:{bond:5,unflag:'q_child_1',flag:'q_child_2b'}}]},
  {l:T('Ride to the rescue','亲自去救'),fight:FG(PW(1.0,5),'injury',T('A parent’s rescue','救子之战'),T('kidnappers','绑匪'),c=>c.foe),
   win:[{t:c=>T(`You come through the door like a storm. ${c.npc.en} has never seen you fight before, and stares at you as if meeting you for the first time.`,`你像一阵狂风破门而入。${c.npc.zh}从没见过你出手，盯着你，像第一次认识你。`),c:'good',fx:{fame:3,bond:20,unflag:'q_child_1',flag:'q_child_2a'}}],
   lose:[{t:c=>T(`They beat you badly, but while they do, ${c.npc.en} slips the ropes and runs. You both limp home.`,`他们把你打得不轻，可就在这当口，${c.npc.zh}挣脱绳子跑了。你们一瘸一拐地回了家。`),c:'bad',fx:{bond:15,unflag:'q_child_1',flag:'q_child_2b'}}]},
  {l:T('Refuse. They chose this','不管。路是孩子自己选的'),out:[{t:c=>T(`Weeks later ${c.npc.en} escapes on ${c.npc.his} own, and doesn’t write to you for years.`,`几周后${c.npc.zh}自己逃了出来，此后好几年没给你写过一个字。`),c:'bad',fx:{bond:-40,happy:-6,unflag:'q_child_1'}}]}]});
I({id:'q_child_hero',tags:['town'],need:'q_child_2a',age:[30,95],w:6,once:1,when:qW('q_child_2a',2),ctx:qCtx('child'),
 text:c=>T(`${c.npc.en} leaves again, this time with your blessing, and comes back years later with a name the storytellers know.`,`${c.npc.zh}又走了，这回带着你的祝福。几年后回来时，说书人嘴里已经有了${c.npc.ta}的名号。`),
 out:[{t:c=>T(`“I copied everything you did that night,” ${c.npc.en} says. You pretend there is dust in your eye.`,`"那天晚上你怎么打的，我全学下来了。"${c.npc.zh}说。你假装眼里进了沙子。`),c:'gold',fx:{happy:12,fame:5,bond:25,unflag:'q_child_2a',f:(s,c)=>{const p=person(s,c.pid);if(p)p.lv+=rint(25,45)},deed:c=>T(`Raised ${c.npc.en}, who became a hero of the jianghu`,`养出了一位江湖侠客${c.npc.zh}`)}}]});
I({id:'q_child_home',tags:['town'],need:'q_child_2b',age:[30,95],w:6,once:1,when:qW('q_child_2b',2),ctx:qCtx('child'),
 text:c=>T(`${c.npc.en} opens a little noodle shop in town and stops talking about being a hero.`,`${c.npc.zh}在镇上开了间小面馆，再也不提当大侠的事了。`),
 opts:[{l:T('Tell them that is a fine life','告诉孩子，这样的日子也很好'),out:[{t:c=>T(`${c.npc.en} looks relieved. The noodles are excellent. You eat there every week.`,`${c.npc.zh}松了口气。面做得极好，你每周都去吃。`),c:'good',fx:{happy:8,bond:20,unflag:'q_child_2b'}}]},
  {l:T('Push them to try again','劝孩子再闯一闯'),out:[{w:1,t:c=>T(`${c.npc.en} tries again, and does better this time. ${c.npc.He} sends home a letter from every town.`,`${c.npc.zh}又出去闯了，这回闯出了点样子，每到一个地方都写信回来。`),c:'good',fx:{happy:4,bond:5,unflag:'q_child_2b',f:(s,c)=>{const p=person(s,c.pid);if(p)p.lv+=rint(10,20)}}},
   {w:1,t:c=>T(`${c.npc.en} shuts the shop door in your face. You were not invited to the wedding.`,`${c.npc.zh}当着你的面关上了店门。后来${c.npc.ta}成亲，都没请你。`),c:'bad',fx:{happy:-6,bond:-30,unflag:'q_child_2b'}}]}]});

/* =====================================================================
   10. Building an inn into a famous one (town, open)
   ===================================================================== */
QHINT.q_inn_1=T('Your run-down inn needs a reason for people to come.','你那间破客栈，得有个让人上门的理由。');
QHINT.q_inn_2=T('A rival innkeeper is after your customers.','对面的客栈老板盯上了你的客人。');
QHINT.q_inn_2b=T('You have been watering the wine. Someone will notice.','你一直在往酒里兑水。迟早有人发觉。');
QHINT.q_inn_3=T('Your inn is doing well. Every guest counts.','客栈生意正好。每位客人都要紧。');
I({id:'q_inn',age:[20,60],w:1.1,once:1,tags:['town'],
 text:c=>T(`A dusty inn at ${c.place.en} is for sale for 120 taels. The sign has lost two characters and the cook has lost his teeth.`,`${c.place.zh}有间灰扑扑的客栈要卖，一百二十两。招牌掉了两个字，厨子掉了满口牙。`),
 opts:[{l:T('Buy it','买下'),cost:120,out:[{t:T('You hang a new sign. It says THE LUCKY CRANE. Nobody is lucky yet.','你挂上新招牌：鹤运客栈。眼下谁也不走运。'),c:'good',fx:{happy:4,flag:'q_inn_1'}}]},
  {l:T('Walk on','走开'),out:[{t:T('A year later it is a pig farm. Probably for the best.','一年后那里成了猪圈。也许这样最好。'),c:'muted'}]}]});
I({id:'q_inn_dish',need:'q_inn_1',age:[20,95],w:6,once:1,tags:['town'],when:qW('q_inn_1',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(45,65)});return c},
 text:()=>T('The inn is losing money. You need something people will travel for.','客栈一直赔钱。得有点让人专程赶来的东西。'),
 opts:[{l:T('Hire the drunk cook everyone warns you about','雇那个人人都劝你别雇的醉厨子'),out:[{w:2,t:c=>T(`${c.npc.en} is drunk by noon and cooks the best braised pork in three counties. People start coming.`,`${c.npc.zh}不到晌午就喝醉了，烧出来的红烧肉却是三县第一。客人开始上门。`),c:'good',fx:{money:[20,60],flag:'q_inn_2',unflag:'q_inn_1'}},
   {w:1,t:c=>T(`${c.npc.en} sets the kitchen on fire on day one, but the smoked duck that comes out of the ashes is a sensation.`,`${c.npc.zh}上工头一天就把厨房点着了，可从灰里扒出来的熏鸭竟大受欢迎。`),c:'good',fx:{money:[-20,20],flag:'q_inn_2',unflag:'q_inn_1'}}]},
  {l:T('Make it a meeting place for the jianghu','做成江湖人落脚的地方'),out:[{t:T('You put up a notice board for bounties and a rack for swords. The customers are loud, scarred and tip well.','你挂了张悬赏榜，摆了个剑架。客人们嗓门大、伤疤多，赏钱也大方。'),c:'good',fx:{fame:3,money:[10,40],flag:'q_inn_2',unflag:'q_inn_1'}}]},
  {l:T('Water the wine','往酒里兑水'),out:[{t:T('Profits double. You tell yourself everyone does it.','利润翻了一番。你告诉自己，人人都这么干。'),c:'muted',fx:{money:[40,80],align:-3,flag:'q_inn_2b',unflag:'q_inn_1'}}]}]});
I({id:'q_inn_rival',need:'q_inn_2',age:[20,95],w:6,once:1,tags:['town'],when:qW('q_inn_2',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(35,55)});return c},
 text:c=>T(`${c.npc.en}, who runs the big inn across the road, sends four thugs to break your tables.`,`对街大客栈的掌柜${c.npc.zh}派了四个打手来砸你的桌子。`),
 opts:[{l:T('Throw them out','把他们扔出去'),fight:FG(PW(.9,3),'light',T('A brawl in your own inn','自家店里的群殴'),T('a tavern brawl','酒楼斗殴'),()=>T('the hired thugs','打手们')),
   win:[{t:T('The thugs go out through the window. Your regulars cheer and order another round.','打手们是从窗户出去的。熟客们拍手叫好，又叫了一轮酒。'),c:'good',fx:{fame:3,unflag:'q_inn_2',flag:'q_inn_3'}}],
   lose:[{t:T('They wreck the place. Your regulars help you rebuild it. You did not know you had friends like that.','店被砸了个稀烂。熟客们帮你重新收拾起来。你这才知道自己有这样的朋友。'),c:'muted',fx:{money:-50,happy:2,unflag:'q_inn_2',flag:'q_inn_3'}}]},
  {l:T('Pay for protection','花钱买平安'),cost:60,out:[{t:c=>T(`You pay a local strongman. ${c.npc.en}’s thugs suddenly find other work.`,`你给地头蛇交了钱，${c.npc.zh}的打手忽然都去忙别的了。`),fx:{align:-1,unflag:'q_inn_2',flag:'q_inn_3'}}]},
  {l:T('Sell up','把店盘出去'),out:[{t:T('You sell to your rival for a fair price and a bad feeling.','你把店盘给了对头，价钱公道，心里不是滋味。'),c:'muted',fx:{money:[150,220],happy:-3,unflag:'q_inn_2'}}]}]});
I({id:'q_inn_guest',need:'q_inn_3',age:[20,95],w:6,once:1,tags:['town'],when:qW('q_inn_3',2),ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(70,85),lv:250});return c},
 text:c=>T(`A shabby old man, ${c.npc.en}, eats your best dishes for a week and then admits he has no money at all.`,`一个衣衫褴褛的老头${c.npc.zh}，在你店里吃了一个礼拜的好菜，然后承认自己身无分文。`),
 opts:[{l:T('Let him stay as long as he likes','让他想住多久住多久'),out:[{t:c=>T(`Months later, the Sword Saint’s disciples arrive to collect ${c.npc.en}, their master. He writes the inn a new signboard himself, and for the rest of your life people travel a thousand li to drink under it. Before he goes, he shows you how he fights when drunk.`,`几个月后，剑圣的弟子们来接他们的师父${c.npc.zh}。老人亲手给客栈题了块新招牌。从此千里之外都有人专程来这块招牌下喝酒。临走前，他还把醉后打拳的法子教给了你。`),c:'gold',fx:{item:'tavern',fame:10,money:[100,300],art:'drunk',happy:10,unflag:'q_inn_3',deed:T('Built the Lucky Crane into the most famous inn under heaven','把鹤运客栈经营成了天下闻名的老店')}}]},
  {l:T('Make him wash dishes to pay','让他洗碗抵账'),out:[{t:T('He washes dishes beautifully for a month, then vanishes. Later you hear who he was. The inn does fine. Just fine.','他洗了一个月的碗，洗得极好，然后不见了。后来你才听说他是谁。客栈生意还行。也就是还行。'),c:'muted',fx:{money:[80,150],unflag:'q_inn_3'}}]},
  {l:T('Throw him out','把他赶出去'),out:[{t:T('He goes without complaint. The next week your signboard falls down in a calm wind, split clean in two as if by a sword.','他二话不说走了。第二周，风平浪静，你的招牌却掉了下来，齐齐整整断成两截，像是被剑劈的。'),c:'bad',fx:{happy:-4,unflag:'q_inn_3'}}]}]});
I({id:'q_inn_sick',need:'q_inn_2b',age:[20,95],w:6,once:1,tags:['town'],when:qW('q_inn_2b',1),
 text:()=>T('A guest falls sick from your cheap watered wine. The constables come sniffing.','有客人喝了你兑水的劣酒病倒了。捕快闻着味儿就来了。'),
 opts:[{l:T('Bribe the constables','打点捕快'),cost:50,out:[{t:T('The matter goes away. So do most of your customers. The inn limps on, and so do you.','事情压下去了，客人也走了大半。客栈半死不活地开着，你也一样。'),c:'muted',fx:{align:-2,unflag:'q_inn_2b'}}]},
  {l:T('Confess and close the inn','认错，关门'),out:[{t:T('You pay the sick man’s doctor and take down the sign yourself. It feels like the first honest thing you have done in years.','你出了病人的药钱，亲手摘下招牌。像是好几年来做的第一件老实事。'),fx:{align:5,money:-30,happy:2,unflag:'q_inn_2b'}}]}]});

/* =====================================================================
   11. Exposing a corrupt magistrate (town, open)
   ===================================================================== */
QHINT.q_mag_1=T('You need proof of the magistrate’s crimes.','你需要县官贪赃枉法的证据。');
QHINT.q_mag_2=T('You have the magistrate’s secret ledger. He knows.','你拿到了县官的私账。他知道了。');
QHINT.q_mag_3=T('Take the ledger to the capital.','把账本送到京城去。');
I({id:'q_mag',age:[18,65],w:1.1,once:1,tags:['town'],ctx:s=>{const c=scene();c.npc=npc(s,{occ:27,age:rint(30,50)});return c},
 text:c=>T(`The county magistrate seizes the widow ${c.npc.en}’s land for “unpaid taxes”. It is the third family this year. The land always ends up with his brother-in-law.`,`县太爷以"欠税"为名，强占了寡妇${c.npc.zh}的田地。今年这已是第三家了，地最后都归了他小舅子。`),
 opts:[{l:T('Start gathering evidence','开始搜集证据'),out:[{t:T('You talk to the other families quietly, one at a time, after dark.','你趁天黑，悄悄地一家一家去问。'),fx:{align:3,flag:'q_mag_1'}}]},
  {l:T('Give the widow some silver','给寡妇一些银子'),cost:20,out:[{t:T('It helps a little. It changes nothing.','帮了一点忙，什么也没改变。'),c:'muted',fx:{align:2}}]},
  {l:T('Mind your own business','少管闲事'),out:[{t:T('You keep your head down, like everyone else.','你和大家一样，低着头过日子。'),c:'muted'}]}]});
I({id:'q_mag_ledger',need:'q_mag_1',age:[18,95],w:6,once:1,tags:['town'],when:qW('q_mag_1',1),
 text:()=>T('Everyone says the magistrate keeps a second ledger in his study.','人人都说县太爷书房里藏着一本私账。'),
 opts:[{l:T('Break in at night','夜里潜进去'),out:[{w:s=>2+s.t.luck/3+s.skill/30,t:T('A window, a sleeping guard, a locked drawer that is not locked enough. You have it.','一扇窗，一个打盹的守卫，一只锁得不够牢的抽屉。到手了。'),c:'good',fx:{unflag:'q_mag_1',flag:'q_mag_2'}},
   {w:2,t:T('A dog. Then many dogs. Then the cells.','一条狗。然后是一群狗。然后是大牢。'),c:'bad',fx:{unflag:'q_mag_1',jail:1}}]},
  {l:T('Bribe the clerk','买通书吏'),cost:80,out:[{t:T('The clerk hates the magistrate even more than you do. He copies the whole ledger for you, with notes.','书吏比你还恨县太爷，把整本账誊抄给你，还加了批注。'),c:'good',fx:{unflag:'q_mag_1',flag:'q_mag_2'}}]},
  {l:T('Drop it','算了'),out:[{t:T('It is not your fight. You tell yourself that often.','这不关你的事。你常这样对自己说。'),c:'muted',fx:{align:-1,unflag:'q_mag_1'}}]}]});
I({id:'q_mag_assassins',tags:['town'],need:'q_mag_2',age:[18,95],w:6,once:1,when:qW('q_mag_2',1),ctx:s=>{const c=scene();c.foe=foeName();return c},
 text:c=>T(`The magistrate knows the ledger is gone. ${c.foe.en}, a hired blade, kicks in your door at midnight.`,`县太爷发现账本丢了。半夜，被雇来的杀手${c.foe.zh}一脚踹开了你的门。`),
 opts:[{l:T('Fight','迎战'),fight:FG(PW(1.0,5),'injury',T('A midnight visitor','午夜来客'),T('a hired killer','雇来的杀手'),c=>c.foe),
   win:[{t:T('The killer flees. He drops a purse of silver with the magistrate’s seal on it. More evidence.','杀手逃了，掉下一袋盖着县衙官印的银子。又是一桩证据。'),c:'good',fx:{fame:2,unflag:'q_mag_2',flag:'q_mag_3'}}],
   lose:[{t:T('You survive by rolling into the well. The ledger, wrapped in oilcloth, survives with you.','你滚进了井里才捡回一条命。用油布包好的账本也保住了。'),c:'bad',fx:{unflag:'q_mag_2',flag:'q_mag_3'}}]},
  {l:T('Sell the ledger back to him','把账本卖回给他'),out:[{t:T('He pays six hundred taels and smiles at you in the street ever after. You smile back. Both of you know what you are.','他出了六百两。此后在街上碰见，他总冲你笑，你也冲他笑。你们都清楚彼此是什么人。'),c:'bad',fx:{money:600,align:-15,unflag:'q_mag_2'}}]}]});
I({id:'q_mag_drum',need:'q_mag_3',age:[18,95],w:6,once:1,tags:['wander'],when:qW('q_mag_3',1),
 text:()=>T('You reach the capital. Outside the Censorate hangs the Grievance Drum. Anyone who beats it receives twenty strokes of the cane first, before they are heard.','你到了京城。都察院门外挂着一面登闻鼓。凡击鼓鸣冤者，须先挨二十杖，才能开口。'),
 opts:[{l:T('Beat the drum','击鼓鸣冤'),out:[{t:T('Twenty strokes. Then you are heard. Within the season the magistrate is stripped of office and his brother-in-law gives back every field. The widows send you a basket of eggs.','二十杖挨完，你终于开了口。不出一季，县太爷被革职，他小舅子把田地一亩不少地吐了出来。寡妇们给你送来一篮鸡蛋。'),c:'gold',fx:{hurt:[8,16],cause:T('twenty strokes of the cane','二十杖'),fame:10,align:10,happy:8,unflag:'q_mag_3',deed:T('Beat the Grievance Drum and brought down a corrupt magistrate','击登闻鼓，扳倒了贪官')}}]},
  {l:T('Give the ledger to a famous censor','把账本交给一位有名的御史'),out:[{w:1,t:T('The censor is as honest as his reputation. The magistrate falls. Nobody remembers your name, which is safer.','这位御史果然名不虚传。贪官倒了。没人记得你的名字，这样反倒安全。'),c:'good',fx:{align:6,fame:2,unflag:'q_mag_3'}},
   {w:1,t:T('The censor turns out to be the magistrate’s cousin. You go home with nothing but a warning.','那御史竟是县太爷的表兄。你两手空空回了家，只带回一句警告。'),c:'bad',fx:{happy:-6,wanted:1,unflag:'q_mag_3'}}]}]});

/* =====================================================================
   12. The village where people vanish (remote regions)
   ===================================================================== */
QHINT.q_vanish_1=T('People keep vanishing from a mountain village.','山村里不断有人失踪。');
QHINT.q_vanish_2=T('You found the hidden silver mine. The captives are inside.','你找到了那座私矿。被掳的人都在里面。');
QHINT.q_vanish_3=T('You are a prisoner in the silver mine. Find a way out.','你被关在银矿里。得想法子逃出去。');
I({id:'q_vanish',age:[16,60],w:1.3,once:1,tags:['wander'],when:s=>['miao','shu','west','north'].includes(s.region),ctx:s=>{const c=scene();c.npc=npc(s,{occ:18,age:rint(55,75)});return c},
 text:c=>T(`In a mountain village, ${c.npc.en} begs you for help. Eleven people have vanished in two years. The villagers blame a mountain ghost and leave rice at the crossroads.`,`在一个山村里，${c.npc.zh}拉着你求救。两年里失踪了十一个人。村里人说是山鬼作祟，天天往路口供米。`),
 opts:[{l:T('Promise to find out','答应查个明白'),out:[{t:T('You walk the paths at night with a lantern, feeling foolish and then, slowly, not foolish at all.','你提着灯笼夜里巡山路。起初觉得自己傻，后来慢慢地，一点也不觉得了。'),fx:{flag:'q_vanish_1'}}]},
  {l:T('Leave rice at the crossroads too','也去路口供碗米'),out:[{t:T('It does not help. Two more go missing after you leave.','没用。你走后，又少了两个人。'),c:'muted',fx:{happy:-2}}]}]});
I({id:'q_vanish_tracks',need:'q_vanish_1',age:[16,95],w:6,once:1,tags:['wander'],when:qW('q_vanish_1',1),
 text:()=>T('Ghosts do not leave cart tracks. You follow the ruts to a hidden valley full of smoke: an illegal silver mine, worked by people in chains.','鬼可不会留下车辙。你顺着车辙找到一处烟雾弥漫的山谷：一座私开的银矿，干活的人都戴着镣铐。'),
 opts:[{l:T('Report it to the county','报官'),out:[{w:1,t:T('The county sends soldiers. The mine is closed and the captives come home. The officials take the credit, and the silver.','县里派了兵，矿封了，被掳的人回了家。功劳和银子都归了当官的。'),c:'good',fx:{align:5,happy:4,unflag:'q_vanish_1'}},
   {w:2,t:T('The magistrate thanks you warmly. Next month the mine is still running, with better guards.','县官热情地谢了你。下个月，矿照开，守卫还更多了。'),c:'bad',fx:{happy:-6,unflag:'q_vanish_1'}}]},
  {l:T('Sneak in yourself','亲自潜进去'),out:[{w:3,t:T('You smear soot on your face and slip in with the night shift.','你往脸上抹了把煤灰，混进了夜班。'),fx:{unflag:'q_vanish_1',flag:'q_vanish_2'}},{w:1,t:T('You smear soot on your face and slip in, and a guard with a lantern looks straight at you. You wake up in chains.','你往脸上抹了把煤灰混进去，一个提灯的守卫正好照见了你。醒来时，你已戴上了镣铐。'),c:'bad',fx:{happy:-8,unflag:'q_vanish_1',flag:'q_vanish_3'}}]}]});
I({id:'q_vanish_mine',tags:['wander'],need:'q_vanish_2',age:[16,95],w:6,once:1,when:qW('q_vanish_2',1),ctx:s=>{const c=scene();c.foe=T('the Mountain Ghost','山鬼');return c},
 text:()=>T('Deep in the mine, the overseer everyone calls the Mountain Ghost catches you unchaining a boy. He wears a white mask and carries a miner’s pick.','矿洞深处，人称"山鬼"的监工撞见你正给一个少年解镣铐。他戴着白面具，手里提着一把矿镐。'),
 opts:[{l:T('Fight him in the dark','在黑暗中与他交手'),fight:FG(PW(1.1,8),'injury',T('The Mountain Ghost','山鬼'),T('the Mountain Ghost’s pick','山鬼的矿镐'),c=>c.foe),
   win:[{t:T('The Ghost is just a man under the mask. You lead forty captives out into the daylight. Among them is an old monk who was kidnapped for his strong back, and who teaches you a finger technique as thanks.','面具底下不过是个人。你领着四十个被掳的人走进阳光。里面有个因力气大被抓来的老和尚，为了谢你，传了你一门指法。'),c:'gold',fx:{fame:10,align:10,money:[100,300],art:'vajra',unflag:'q_vanish_2',deed:T('Freed forty captives from a hidden silver mine','从私矿中救出四十名被掳百姓')}}],
   lose:[{t:T('You wake up in chains, with a pick in your hands.','你醒来时，手脚戴着镣铐，手里握着一把镐。'),c:'bad',fx:{happy:-10,unflag:'q_vanish_2',flag:'q_vanish_3'}}]},
  {l:T('Slip out with the boy only','只带那少年溜出去'),out:[{t:T('You get one boy out. His mother cannot stop crying. You cannot stop thinking about the other thirty-nine.','你只救出了一个孩子。他娘哭个不停。你却忘不了剩下的三十九个。'),c:'muted',fx:{align:4,happy:-2,unflag:'q_vanish_2'}}]}]});
I({id:'q_vanish_escape',need:'q_vanish_3',age:[16,95],w:6,once:1,when:qW('q_vanish_3',1),
 text:()=>T('A year of breaking rock in the dark. You know every guard’s habits now, and the captives trust you.','在黑暗中凿了一年石头。每个守卫的习惯你都摸清了，被掳的人也都信你。'),
 opts:[{l:T('Lead a breakout','带头越狱'),out:[{w:3,t:T('On the night of the new moon, forty people walk out of the mountain together. The guards do not stop them. There are not enough guards in the world.','朔月之夜，四十个人一起走出了大山。守卫拦不住。天底下没有那么多守卫。'),c:'gold',fx:{fame:8,align:8,maxHealth:-3,unflag:'q_vanish_3',deed:T('Led forty captives out of a hidden silver mine','带领四十名矿奴逃出私矿')}},
   {w:1,t:T('Most get out. Some do not. You carry that, along with the scars.','大多数人逃了出来，有些没有。你背着这份愧疚，也背着一身伤疤。'),c:'muted',fx:{fame:4,align:4,hurt:[8,16],cause:T('a mine breakout','矿洞越狱'),unflag:'q_vanish_3'}}]},
  {l:T('Escape alone','一个人逃'),out:[{t:T('You squeeze out through a ventilation shaft. Nobody follows. Nobody else could fit.','你从一个通风口挤了出去。没人跟来，也没人挤得进来。'),c:'muted',fx:{align:-4,maxHealth:-2,unflag:'q_vanish_3'}}]}]});

/* =====================================================================
   13. The painting that changes (scholarly and wealthy families)
   ===================================================================== */
QHINT.q_paint_1=T('The tiny figure in your painting keeps moving.','你那幅画里的小人一直在走。');
QHINT.q_paint_2=T('The old painter is finishing his picture in your house.','老画师正在你家里画完他的画。');
I({id:'q_paint',age:[12,60],w:1.3,once:1,when:s=>['scholar','noble','merchant','clan'].includes(s.family),
 text:()=>T('You inherit an old landscape scroll: mountains, a river, and a tiny traveller with a bundle at the foot of the path. A year later, you would swear he has moved a few steps up.','你继承了一幅旧山水画：群山、一条河，山路脚下有个背包袱的小小行人。一年后，你敢发誓他往上走了几步。'),
 opts:[{l:T('Hang it and keep watching','挂起来，继续看着'),out:[{t:T('You mark his position with a pinprick on the back of the scroll.','你在画轴背面扎了个小针眼，记下他的位置。'),fx:{flag:'q_paint_1'}}]},
  {l:T('Sell it. It gives you chills','卖掉，看着发毛'),out:[{t:T('A collector pays well and asks no questions. In his house, they say, the traveller never moves again.','一个收藏家出了好价钱，什么也没问。听说到了他家，画里的人再也没动过。'),c:'muted',fx:{money:[60,120]}}]}]});
I({id:'q_paint_night',tags:['town'],need:'q_paint_1',age:[12,95],w:6,once:1,when:qW('q_paint_1',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,sex:'m',age:rint(65,80)});return c},
 text:c=>T(`You stay up all night to watch the scroll. At the third watch, a thin old man climbs in through the window with a brush. ${c.npc.en}, once a court painter, has been sneaking in once a year to paint one more step.`,`你守了一整夜。三更时分，一个瘦老头拿着毛笔从窗户爬了进来。他叫${c.npc.zh}，曾是宫廷画师，每年偷偷进来一次，给画中人添上一步。`),
 opts:[{l:T('Let him finish his painting','让他把画画完'),out:[{t:c=>T(`${c.npc.en} weeps. “This is the only painting I have ever done for myself.” He moves into your spare room.`,`${c.npc.zh}哭了："这是我这辈子唯一一幅为自己画的画。"他搬进了你家的空房。`),c:'good',fx:{meet:'friend',bond:60,align:3,unflag:'q_paint_1',flag:'q_paint_2',f:qTag('paint')}}]},
  {l:T('Call the watch','叫巡夜的来'),out:[{t:T('They drag him off. The traveller stays stuck halfway up the mountain forever, and the painting seems to look at you reproachfully.','他被拖走了。画中人永远停在了半山腰，那幅画好像总在责怪地看着你。'),c:'bad',fx:{align:-3,happy:-3,unflag:'q_paint_1'}}]}]});
I({id:'q_paint_peak',tags:['wander'],need:'q_paint_2',age:[12,95],w:6,once:1,when:qW('q_paint_2',2),
 text:()=>T('The old painter dies the week the traveller reaches the summit. On the back he has written: “This place is real. Go and see.” The river, the pass, the cave at the top, all with names.','画中人登顶的那个礼拜，老画师过世了。画背面写着："此地是真的。去看看吧。"河、山口、山顶的洞，都标了名字。'),
 opts:[{l:T('Go and find it','照着画去找'),fight:FG(PW(1.0,5),'injury',T('A tiger on the painted path','画中山路上的猛虎'),T('a mountain tiger','山中猛虎'),()=>T('a mountain tiger','猛虎'),true),
   win:[{w:s=>3,t:T('Past the tiger, the cave is exactly as painted. Inside, carved on the walls, a pair of footprints repeats in a strange, lovely pattern. You walk it for a month until your feet know it.','过了猛虎这关，山洞和画上一模一样。洞壁上刻着一对对脚印，排成奇妙而优美的图案。你照着走了一个月，直到脚自己记住了。'),c:'gold',fx:{art:'swallow',qi:6,happy:8,unflag:'q_paint_2',deed:T('Followed a dead painter’s scroll to a real hidden valley','循着亡友画中的山路，找到了真实的秘境')}},
    {w:s=>s.t.wit>=8?1:0,t:T('The footprints on the cave wall are no ordinary steps. They are the lost Wave-Treading Steps, and you understand them.','洞壁上的脚印绝非寻常步法，竟是失传的踏波步，而你看懂了。'),c:'gold',fx:{art:'lingboweibu',qi:8,happy:10,unflag:'q_paint_2',deed:T('Found the lost Wave-Treading Steps through a painting','循一幅画寻得失传的踏波步')}}],
   lose:[{t:T('The tiger chases you back down the mountain. You get home with the scroll torn and your pride worse. But you saw the river, and it was real.','老虎把你撵下了山。你回到家，画撕破了，面子更是碎了一地。不过你看见了那条河，它是真的。'),c:'bad',fx:{hurt:[8,18],cause:T('a mountain tiger','山中猛虎'),happy:2,unflag:'q_paint_2'}}]},
  {l:T('Just hang it and remember him','只把画挂起，记着他'),out:[{t:T('Every evening you look at the little traveller resting at the top, and feel that he has earned it.','每天傍晚，你看着那个歇在山顶的小人，觉得他配得上这份安歇。'),c:'good',fx:{happy:8,smarts:3,unflag:'q_paint_2'}}]}]});

/* =====================================================================
   14. The Hall of Silent Rain (dark path, open to the not-too-righteous)
   ===================================================================== */
QHINT.q_guild_1=T('The Hall of Silent Rain is waiting for your first contract.','听雨堂在等你接第一单生意。');
QHINT.q_guild_2=T('The Hall wants you among its Seven Umbrellas. There is a final test.','听雨堂要你做"七把伞"之一。还差最后一关。');
QHINT.q_guild_2b=T('You betrayed the Hall of Silent Rain. They will come.','你背叛了听雨堂。他们会来的。');
QHINT.q_guild_3=T('You are high in the Hall. The Hall Master is watching you.','你在听雨堂里位高权重。堂主在盯着你。');
I({id:'q_guild',age:[17,45],w:1.1,once:1,tags:['wander'],when:s=>s.align<30,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([17,24,5]),age:rint(30,50)});return c},
 text:c=>T(`In a teahouse, ${c.npc.en} slides a black jade token across the table. “The Hall of Silent Rain is looking for hands that don’t shake.”`,`茶馆里，${c.npc.zh}把一枚黑玉令牌推到你面前："听雨堂正缺几双不会发抖的手。"`),
 opts:[{l:T('Take the token','收下令牌'),out:[{t:T('It is cold, and heavier than jade should be. A purse of silver comes with it.','令牌冰凉，比玉该有的分量沉。还附了一袋银子。'),c:'bad',fx:{align:-5,money:50,flag:'q_guild_1'}}]},
  {l:T('Slide it back','推回去'),out:[{t:T('He shrugs and drinks his tea. You notice later that he never paid for it.','他耸耸肩，喝完了茶。后来你才发现，他没付茶钱。'),c:'muted'}]},
  {l:T('Report him to the constables','报官'),out:[{t:T('When they arrive the table is empty, except for a single wet umbrella.','捕快赶到时，桌边空无一人，只有一把湿漉漉的伞。'),c:'muted',fx:{align:2,happy:-2}}]}]});
I({id:'q_guild_first',need:'q_guild_1',age:[17,95],w:6,once:1,tags:['wander'],when:qW('q_guild_1',1),ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:rint(40,60)});c.foe=T('the merchant’s bodyguard','盐商的保镖');return c},
 text:c=>T(`Your first contract: the salt merchant ${c.npc.en}, who poisoned a well to buy a village cheap. His bodyguard is good.`,`第一单生意：盐商${c.npc.zh}。他往井里投毒，好贱价买下一整个村子。他的保镖可不好对付。`),
 opts:[{l:T('Do the job','动手'),fight:FG(PW(.95,4),'injury',T('The first contract','第一单生意'),T('a bodyguard’s blade','保镖的刀'),c=>c.foe),
   win:[{t:T('It is quick. Afterwards you scrub your hands for a long time. The Hall pays well and promotes you.','很快就完事了。事后你洗了很久的手。听雨堂出手大方，还给你升了位子。'),c:'bad',fx:{money:200,align:-8,skill:2,unflag:'q_guild_1',flag:'q_guild_2'}}],
   lose:[{t:T('The bodyguard leaves you bleeding in a ditch. The Hall pulls you out. “Everyone gets one mistake.”','保镖把你砍翻在水沟里。听雨堂的人把你拖了出来："每人有一次犯错的机会。"'),c:'bad',fx:{align:-4,unflag:'q_guild_1',flag:'q_guild_2'}}]},
  {l:T('Warn the target instead','反去给目标报信'),out:[{t:c=>T(`${c.npc.en} flees the county that night. The Hall does not forgive a warning.`,`${c.npc.zh}当夜逃出了县城。听雨堂从不原谅通风报信的人。`),c:'muted',fx:{align:6,unflag:'q_guild_1',flag:'q_guild_2b'}}]}]});
I({id:'q_guild_test',need:'q_guild_2',age:[17,95],w:6,once:1,tags:['wander'],when:qW('q_guild_2',2),ctx:s=>{const c=scene();c.npc=npc(s,{occ:9,age:rint(30,55)});return c},
 text:c=>T(`To join the Seven Umbrellas, there is one last name. It is ${c.npc.en}, the honest constable who once shared his umbrella with you in the rain.`,`要入"七把伞"，还差最后一个名字：${c.npc.zh}。那个曾在雨里把伞分你一半的正直捕快。`),
 opts:[{l:T('Do it','下手'),out:[{t:T('You are one of the Seven Umbrellas now. The money is extraordinary. You stop carrying an umbrella of your own.','你如今是"七把伞"之一了。银子多得吓人。你自己却再也不打伞了。'),c:'bad',fx:{money:[800,1200],align:-20,happy:-10,wanted:1,unflag:'q_guild_2',flag:'q_guild_3'}}]},
  {l:T('Refuse, and run','拒绝，然后逃'),out:[{t:c=>T(`You tell ${c.npc.en} to leave town and then leave yourself. Behind you, the Hall sharpens its knives.`,`你叫${c.npc.zh}赶紧离开县城，自己也跑了。身后，听雨堂正在磨刀。`),c:'muted',fx:{align:8,unflag:'q_guild_2',flag:'q_guild_2b'}}]}]});
I({id:'q_guild_hunted',need:'q_guild_2b',age:[17,95],w:6,once:1,tags:['wander'],when:qW('q_guild_2b',1),ctx:s=>{const c=scene();c.foe=T('a Silent Rain assassin','听雨堂杀手');return c},
 text:()=>T('It is raining. A figure under a black umbrella waits at the end of the bridge.','下雨了。桥那头，一个人影撑着黑伞在等你。'),
 opts:[{l:T('Face them','迎上去'),fight:FG(PW(1.05,6),'injury',T('The Hall collects','听雨堂索命'),T('a Silent Rain assassin','听雨堂杀手'),c=>c.foe),
   win:[{t:T('The umbrella floats away down the river. The Hall decides you cost more than you are worth, and lets you go. You are free.','黑伞顺着河水漂走了。听雨堂掂量过后，觉得杀你不划算，就此作罢。你自由了。'),c:'good',fx:{fame:4,align:4,unflag:'q_guild_2b',deed:T('Walked away from an assassins’ guild alive','从杀手组织全身而退')}}],
   lose:[{t:T('You wake up in the river shallows, alive by a hair. The Hall thinks you are dead. Let them.','你在浅滩上醒来，只剩一口气。听雨堂以为你死了。那就让他们这么以为吧。'),c:'bad',fx:{maxHealth:-4,unflag:'q_guild_2b'}}]},
  {l:T('Fake your death','诈死'),out:[{w:s=>1+s.t.wit/3,t:T('A borrowed corpse, a burned house, a weeping “widow” paid in advance. You start again in another province with a new name.','借来的尸体，烧掉的房子，提前付了钱的"遗孀"哭得很真。你换了个名字，到别的州府重新来过。'),c:'muted',fx:{fame:-5,happy:-3,unflag:'q_guild_2b'}},
   {w:1,t:T('They are not fooled. But they are impressed enough to let you live, with a scar to remember them by.','他们没上当。不过倒也佩服，留了你一命，外加一道疤让你记着。'),c:'bad',fx:{hurt:[10,20],cause:T('a Silent Rain warning','听雨堂的警告'),unflag:'q_guild_2b'}}]}]});
I({id:'q_guild_master',tags:['wander'],need:'q_guild_3',age:[17,95],w:6,once:1,when:qW('q_guild_3',3),ctx:s=>{const c=scene();c.foe=T('the Hall Master of Silent Rain','听雨堂主');return c},
 text:()=>T('You notice the tea tastes faintly of almonds. The Hall Master has decided you have become too good.','你察觉茶里有一丝杏仁味。堂主认定你已经太出色了。'),
 opts:[{l:T('Spit it out and go for the Master','吐掉茶，直取堂主'),fight:FG(PW(1.15,12),'death',T('Rain over the Hall','听雨堂夜雨'),T('the Hall Master’s blade','听雨堂主的剑'),c=>c.foe),
   win:[{t:T('The Master falls under his own umbrella. The other six kneel. You are the Hall of Silent Rain now: its gold, its secrets, its steps that leave no shadow. Every night you check your tea.','堂主倒在自己的伞下。其余六把伞跪了下来。如今你就是听雨堂：它的金子、它的秘密、它那无影的步法。只是从此每晚，你都要先验一验茶。'),c:'gold',fx:{money:[1500,2500],art:'shadow',align:-15,fame:6,wanted:1,unflag:'q_guild_3',deed:T('Became Master of the Hall of Silent Rain','成为听雨堂主')}}],
   lose:[{t:T('You crawl out through the rain. The poison stays in your blood for the rest of your life.','你冒雨爬了出去。那毒却在你血里留了一辈子。'),c:'bad',fx:{maxHealth:-6,lifespan:-3,unflag:'q_guild_3'}}]},
  {l:T('Swallow it, and vanish','喝下去，然后消失'),sub:T('You know the antidote. Probably.','你知道解药。大概吧。'),out:[{w:2,t:T('You collapse in the street, then wake in a temple three provinces away, cured, and done with all of it. You spend the rest of your life trying to be someone else.','你倒在街上，醒来已在三州之外的一座寺里。毒解了，一切也都结束了。余生，你都在努力做另一个人。'),c:'muted',fx:{align:10,lifespan:-1,happy:-4,unflag:'q_guild_3'}},
   {w:1,t:T('The antidote was the wrong one. You live, but only just, and never fully recover.','解药配错了。你活了下来，可只是勉强活着，再没完全复原。'),c:'bad',fx:{maxHealth:-8,ill:'inner',unflag:'q_guild_3'}}]}]});
