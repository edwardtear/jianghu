/* 江湖一生 · more of the jianghu on the road: new arts (above all 暗器, which almost nobody could learn before), more ways
   to learn without a master (a peddler’s battered manual, an old dart thrower in a village, a beggar who throws stones,
   a duel you happen to watch, a wall carving in a ruined temple, a fellow traveller who trades a move for a move), and
   far more meetings with the people of other sects. All of them come up when you head out. Original content. */
'use strict';
/* ---------- new arts ---------- */
Object.assign(ARTS,{
 plumneedle:{n:'Plum-Blossom Needles',cn:'梅花针',tier:1,sk:'anqi',cat:'anqi'},
 locuststone:{n:'Locust Stones',cn:'飞蝗石',tier:1,sk:'anqi',cat:'anqi'},
 sleevedart:{n:'Sleeve Darts',cn:'袖里镖',tier:1,sk:'anqi',cat:'anqi'},
 lotusseed:{n:'Returning Lotus Seeds',cn:'回旋莲子',tier:2,sk:'anqi',cat:'anqi'},
 starrain:{n:'Sky Full of Stars',cn:'漫天星雨',tier:2,sk:'anqi',cat:'anqi'},
 shadowpin:{n:'Shadowless Pin',cn:'无影针',tier:3,sk:'anqi',cat:'anqi'},
 cloudstep:{n:'Cloud-Treading Step',cn:'踏云步',tier:1,sk:'lingbo',cat:'qing'},
 reedcross:{n:'Crossing on a Reed',cn:'一苇渡江',tier:2,sk:'lingbo',cat:'qing'},
 breathart:{n:'Breath of the Valley',cn:'谷神吐纳',tier:1,sk:'heal',cat:'nei'},
 longfist:{n:'Founder’s Long Fist',cn:'太祖长拳',tier:1,sk:'lianhuan',cat:'wai'},
 tigersaber:{n:'Five-Tiger Saber',cn:'五虎断门刀',tier:1,sk:'kuaijian',cat:'wai'},
 yangspear:{n:'Yang Family Spear',cn:'杨家枪法',tier:2,sk:'hengsao',cat:'wai'}});
['梅花针','飞蝗石','袖里镖','回旋莲子','漫天星雨','无影针'].forEach(n=>ART_CAT_FIX[n]='anqi');ART_CAT_FIX['踏云步']='qing';ART_CAT_FIX['一苇渡江']='qing';ART_CAT_FIX['谷神吐纳']='nei';
const lnKnown=(s,k)=>s.arts.some(a=>a.cn===ARTS[k].cn)||(s.studies||[]).some(x=>x.cn===ARTS[k].cn);
const noAnqi=s=>!s.arts.some(a=>artCat(a)==='anqi');
function lnPick(s,kind,maxT){const ks=Object.keys(ARTS).filter(k=>{const a=ARTS[k];return!a.rare&&!a.bad&&(!kind||artCat(a)===kind)&&(a.tier||0)<=(maxT??2)&&!lnKnown(s,k)&&!['familysword','escortsaber','prisonart','street'].includes(k)});return ks.length?pick(ks):null}
const lnArtN=c=>T(ARTS[c.art].n,ARTS[c.art].cn);
const lnTeach=(s,c)=>{if(c.art&&ARTS[c.art])tryLearn(s,ARTS[c.art],'taught')};
const oSect=(s,evil)=>{let ks=(typeof regSects==='function'?regSects(s):Object.keys(SECTS)).filter(k=>SECTS[k]&&!SECTS[k].hidden&&k!==s.sect&&!!SECTS[k].evil===!!evil);
  if(!ks.length)ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&k!==s.sect&&!!SECTS[k].evil===!!evil);return pick(ks)};
const OSN=c=>T(SECTS[c.k].en,SECTS[c.k].cn);
const ENC_T=['wander','town'];
/* ---------- learning without a master ---------- */
I({id:'ln_peddler',age:[10,80],cd:6,w:s=>noAnqi(s)?3:1.6,tags:ENC_T,when:s=>!!lnPick(s,null,2),ctx:s=>{const art=(noAnqi(s)&&chance(.6)&&lnPick(s,'anqi',2))||lnPick(s,null,2);return{art,price:BOOK_PRICE[ARTS[art].tier]>>1}},
 text:c=>T(`A peddler at the crossroads has, among the combs and needles, a stained manual: “${lnArtN(c).en}”. He wants ${c.price} taels and swears it is genuine. He swears everything is genuine.`,`十字路口的货郎担子里，梳子针线中间压着一本发黄的秘籍：《${lnArtN(c).zh}》。他要${c.price}两，赌咒说是真的。他什么都赌咒说是真的。`),
 opts:[{l:c=>T(`Buy it (${c.price} taels)`,`买下（${c.price}两）`),if:(s,c)=>s.money>=c.price,out:[{t:T('You pay and leaf through it on the spot. Some pages are missing. The rest is real.','你付了钱，当场翻看。缺了几页，剩下的倒是真的。'),c:'good',fx:(s,c)=>({money:-c.price,f:s=>s.items.push({id:'book:'+c.art,age:s.age,paid:c.price})})}]},
  {l:T('Haggle hard','狠狠砍价'),out:[{w:s=>1+s.t.wit/4,t:T('You get it for half, and he throws in a comb.','你砍到了一半的价，他还搭了把梳子。'),c:'good',fx:(s,c)=>({money:-Math.round(c.price/2),f:s=>s.items.push({id:'book:'+c.art,age:s.age})})},{w:2,t:T('He is offended and packs up his things.','他恼了，收起担子走了。'),c:'muted'}]},
  {l:T('Walk on','走开'),out:[{t:T('Probably a fake anyway.','多半是假的。'),c:'muted'}]}]});
I({id:'ln_dartman',age:[10,70],cd:10,w:s=>noAnqi(s)?4:1.2,tags:ENC_T,when:s=>!!lnPick(s,'anqi',2),ctx:s=>({art:lnPick(s,'anqi',2),npc:npc(s,{age:rint(62,80),sex:'m'})}),
 text:c=>T(`In a village by the road, an old man knocks a wasp out of the air with a dried pea, without looking up from his tea. ${c.npc.en} used to do this for a living, he says, a long time ago. ${lnArtN(c).en}.`,`路边村子里，一个老人头也不抬地喝着茶，随手弹出一粒干豆，把一只马蜂打落在地。${c.npc.zh}说，他年轻时是吃这碗饭的。那门功夫叫${lnArtN(c).zh}。`),
 opts:[{l:T('Ask him to teach you','求他教你'),out:[{w:3,t:T('He makes you chop his wood and carry his water for a season first. Then he teaches you, grumbling the whole time.','他先让你给他劈了一季的柴、挑了一季的水，然后才一边嘟囔一边教你。'),c:'gold',fx:(s,c)=>({happy:2,meet:'acq',bond:65,f:s=>lnTeach(s,c)})},
   {w:1,t:T('“Too old to teach, and you are too old to learn.” He goes back to his tea.','“我老得教不动了，你也老得学不会了。”他接着喝茶去了。'),c:'muted'}]},
  {l:T('Challenge him to a contest of aim','跟他比准头'),out:[{t:T('You lose, badly, and he laughs so hard he agrees to show you how it is done.','你输得一塌糊涂。他笑得前仰后合，倒答应教你两手。'),c:'good',fx:(s,c)=>({happy:3,f:s=>lnTeach(s,c)})}]}]});
I({id:'ln_beggar',age:[8,60],cd:12,w:s=>noAnqi(s)?2.5:1,tags:ENC_T,when:s=>!lnKnown(s,'locuststone'),ctx:s=>({art:'locuststone',npc:npc(s,{age:rint(40,70),occ:12})}),
 text:c=>T(`A beggar under the bridge brings down a pigeon with a pebble, and offers to share it with you. ${c.npc.en} says ${c.npc.he} could teach you, for a meal a day.`,`桥洞底下的乞丐一颗石子打下一只鸽子，还要分给你吃。${c.npc.zh}说，你要是管${c.npc.ta}一天一顿饭，就教你这手。`),
 opts:[{l:T('Feed him and learn','管饭，学艺'),if:s=>s.money>=15,out:[{t:T('Fifteen taels of noodles later, you can hit a crow at thirty paces.','吃掉你十五两的面之后，你已能在三十步外打中乌鸦。'),c:'gold',fx:(s,c)=>({money:-15,align:1,meet:'acq',bond:60,f:s=>lnTeach(s,c)})}]},
  {l:T('Share the pigeon, and leave','分了鸽子吃，走人'),out:[{t:T('It is a very good pigeon.','鸽子很香。'),c:'muted',fx:{happy:2}}]}]});
I({id:'ln_watchduel',age:[12,80],cd:8,w:1.6,tags:ENC_T,ctx:s=>({art:lnPick(s,null,2),a:genName('m',null,'jh'),b:genName(chance(.5)?'m':'f',null,'jh')}),when:s=>!!lnPick(s,null,2),
 text:c=>T(`On a hillside you come upon two masters, ${c.a.py} and ${c.b.py}, fighting a duel of honour with no one watching but you. One of them uses ${lnArtN(c).en}.`,`山坡上，你撞见${c.a.cn}和${c.b.cn}两位高手在比一场名誉之战，旁边除了你没别人。其中一人用的是${lnArtN(c).zh}。`),
 opts:[{l:T('Hide and watch every move','藏起来，一招一式地看'),out:[{w:s=>s.t.wit/3,t:T('You watch until dark, and walk home moving your hands in the air. Something has stuck.','你一直看到天黑，回去的路上手还在空中比划。有些东西记住了。'),c:'gold',fx:(s,c)=>({f:s=>{if(ARTS[c.art])startStudy(s,ARTS[c.art],rint(20,45))}})},
   {w:2,t:T('They notice you, stop, and both turn on you for spying.','他们发现了你，停了手，一起冲你来了。'),c:'bad',fx:{heal:-8}}]},
  {l:T('Leave them to it','别多管闲事'),out:[{t:T('Other people’s honour is other people’s business.','别人的名声，是别人的事。'),c:'muted'}]}]});
I({id:'ln_ruin',age:[12,80],cd:12,w:1.4,tags:['wander'],ctx:s=>({art:lnPick(s,chance(.5)?'qing':'nei',2)||lnPick(s,null,2)}),when:s=>!!lnPick(s,null,2),
 text:c=>T(`Sheltering from rain in a ruined temple, you find figures carved into the back wall, moving through some art. Under them, half worn away: ${lnArtN(c).en}.`,`你在一座破庙里避雨，发现后墙上刻着一排小人，正在演练某种武功。下面的字快磨没了：${lnArtN(c).zh}。`),
 opts:[{l:T('Stay and study the wall','留下来研究这面墙'),out:[{t:T('You stay three days, copying the figures with charcoal.','你在庙里住了三天，拿木炭把那些小人一个个描了下来。'),c:'gold',fx:(s,c)=>({happy:2,f:s=>{if(ARTS[c.art])tryLearn(s,ARTS[c.art],'event')}})}]},
  {l:T('Wait out the rain and go','雨停就走'),out:[{t:T('Probably some bored monk’s doodles.','多半是哪个闲得发慌的和尚画着玩的。'),c:'muted'}]}]});
I({id:'ln_trade',age:[16,80],cd:8,w:1.6,tags:ENC_T,when:s=>s.arts.length>0&&!!lnPick(s,null,2),ctx:s=>({art:(noAnqi(s)&&chance(.5)&&lnPick(s,'anqi',2))||lnPick(s,null,2),npc:npc(s,{age:rint(22,45)})}),
 text:c=>T(`A fellow traveller, ${c.npc.en}, watches you practise at the inn and proposes a trade: a move of yours for a move of ${c.npc.his}. ${c.npc.He} knows ${lnArtN(c).en}.`,`客栈里同住的${c.npc.zh}看你练功，提议换一换：你教${c.npc.ta}一招，${c.npc.ta}教你一招。${c.npc.ta}会的是${lnArtN(c).zh}。`),
 opts:[{l:T('Trade','换'),out:[{t:T('You spend an evening in the yard, teaching and learning. You both go away richer.','你们在院子里耗了一晚上，教的教，学的学。两人都有收获。'),c:'gold',fx:(s,c)=>({meet:'friend',bond:62,f:s=>lnTeach(s,c)})}]},
  {l:T('Keep your arts to yourself','自家功夫不外传'),out:[{t:T('“Suit yourself.” You notice later that you never did learn anything from anyone that way.','“随你。”你后来发现，靠这样，你也从没跟谁学到过什么。'),c:'muted'}]}]});
/* ---------- the people of other sects ---------- */
const OS=(id,o)=>I(Object.assign({id,age:[12,85],cd:7,w:1.8,tags:ENC_T},o,{ctx:s=>{const k=oSect(s,o.evil);const x=o.ctx?o.ctx(s,k):{};return Object.assign({k,npc:npc(s,Object.assign({age:rint(18,40),extra:{sect:k}},x.np||{}))},x)},when:s=>!!oSect(s,o.evil)&&(!o.when||o.when(s))}));
OS('os_wounded',{text:c=>T(`Two young disciples of ${OSN(c).en} are carrying a wounded elder down the road, and they are lost.`,`两个${OSN(c).zh}的年轻弟子抬着一位受伤的长老在路上走，迷了路。`),
 opts:[{l:T('Guide them and help carry','给他们带路，帮着抬'),out:[{t:c=>T(`You get the elder to a doctor in time. ${OSN(c).en} sends a letter of thanks, sealed with the sect’s seal.`,`你及时把长老送到了大夫那儿。${OSN(c).zh}派人送来一封盖着门派印信的谢帖。`),c:'good',fx:(s,c)=>({align:2,fame:1,meet:'acq',bond:65,f:s=>sAdj(s,c.k,10)})}]},
  {l:T('Point the way and go on','指了路就走'),out:[{t:T('They thank you and hurry off.','他们道了谢，匆匆走了。'),c:'muted',fx:(s,c)=>({f:s=>sAdj(s,c.k,2,1)})}]}]});
OS('os_brawl',{ctx:(s,k)=>{let k2=oSect(s,false);if(k2===k)k2=oSect(s,true);return{k2}},when:s=>true,
 text:c=>T(`In a tavern, disciples of ${OSN(c).en} and ${SECTS[c.k2]?SECTS[c.k2].en:'another sect'} are a word away from drawn swords.`,`酒楼里，${OSN(c).zh}和${SECTS[c.k2]?SECTS[c.k2].cn:'另一派'}的弟子吵得只差拔剑了。`),
 opts:[{l:T('Step between them and talk them down','站到中间劝和'),out:[{w:s=>1+s.fame/40,t:T('Somehow it works. Both sides pay for their own wine and leave muttering.','居然劝住了。两边各付各的酒钱，嘟嘟囔囔地走了。'),c:'good',fx:(s,c)=>({fame:2,f:s=>{sAdj(s,c.k,4,1);if(SECTS[c.k2])sAdj(s,c.k2,4,1)}})},
   {w:1,t:T('Both sides turn on you instead.','两边倒一起冲你来了。'),c:'bad',fx:{heal:-8}}]},
  {l:c=>T(`Side with ${OSN(c).en}`,`帮${OSN(c).zh}`),out:[{t:T('It turns into a brawl, and your side wins.','打成了一场群架，你这边赢了。'),c:'muted',fx:(s,c)=>({f:s=>{sAdj(s,c.k,8);if(SECTS[c.k2])sAdj(s,c.k2,-8)}})}]},
  {l:T('Drink up and leave','喝完就走'),out:[{t:T('You hear the crash of tables behind you as you go.','你走的时候，身后传来掀桌子的声音。'),c:'muted'}]}]});
OS('os_challenge',{age:[16,70],text:c=>T(`A proud young disciple of ${OSN(c).en}, ${c.npc.en}, has heard of you and wants to see if the stories are true.`,`${OSN(c).zh}一个心高气傲的年轻弟子${c.npc.zh}听说过你，想看看传言是不是真的。`),
 opts:[{l:T('Accept the bout','应战'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.round(power(s)*(.85+R()*.3)),fixed:1},stakes:'spar',title:T('A young challenger','年轻人的挑战'),cause:T('a bout with a young challenger','与后生切磋')}),
   win:[{t:T('You win, and tell him where he went wrong. He bows deeply.','你赢了，还指出他哪里错了。他深深一揖。'),c:'good',fx:(s,c)=>({fame:2,meet:'acq',bond:60,f:s=>sAdj(s,c.k,4,1)})}],lose:[{t:T('He wins and is unbearable about it.','他赢了，得意得不行。'),c:'muted',fx:{fame:-1}}]},
  {l:T('Decline politely','客气地推辞'),out:[{t:T('He calls you a coward to anyone who will listen. Not many listen.','他逢人就说你是胆小鬼。听的人不多。'),c:'muted'}]}]});
OS('os_hunted',{text:c=>T(`A young disciple of ${OSN(c).en}, ${c.npc.en}, runs past you, bleeding. Behind ${c.npc.him}, three men with knives.`,`${OSN(c).zh}的年轻弟子${c.npc.zh}带着伤从你身边跑过。后面追着三个拿刀的人。`),
 opts:[{l:T('Stop the men','拦住那三个人'),fight:(s,c)=>({foe:{name:T('three hired killers','三个杀手'),lv:PW(1,3)(s),fixed:1},stakes:'injury',title:T('Hired killers','杀手追人'),cause:T('hired killers','杀手')}),
   win:[{t:c=>T(`${c.npc.en} owes you a life, and ${OSN(c).en} knows it.`,`${c.npc.zh}欠你一条命，${OSN(c).zh}也知道这事。`),c:'good',fx:(s,c)=>({fame:2,align:2,meet:'friend',bond:70,f:s=>sAdj(s,c.k,12)})}],lose:[{t:T('They beat you and go after the youngster anyway.','他们打倒了你，还是追那孩子去了。'),c:'bad',fx:(s,c)=>({f:s=>sAdj(s,c.k,2,1)})}]},
  {l:T('Stay out of it','不掺和'),out:[{t:T('You hear later what happened. You wish you had not.','后来你听说了结果，真希望自己没听说。'),c:'bad',fx:{happy:-3}}]}]});
OS('os_manual',{age:[16,80],text:c=>T(`A nervous disciple of ${OSN(c).en} offers to sell you a copy of the sect’s ${SECTS[c.k].arts&&SECTS[c.k].arts[1]?SECTS[c.k].arts[1][0]:'art'}, copied in secret. 120 taels.`,`一个慌里慌张的${OSN(c).zh}弟子要卖给你一本偷抄的本门${SECTS[c.k].arts&&SECTS[c.k].arts[1]?'《'+SECTS[c.k].arts[1][1]+'》':'武功'}。一百二十两。`),
 when:s=>true,opts:[{l:T('Buy it (120 taels)','买下（一百二十两）'),if:s=>s.money>=120,out:[{t:T('You hide it well. If his sect ever finds out, it will not be pleasant.','你把它藏得很好。要是让他门派知道了，可不好收场。'),c:'muted',fx:(s,c)=>({money:-120,align:-2,f:s=>{const a=SECTS[c.k].arts&&SECTS[c.k].arts[1]?sectArt(c.k,1):null;if(a)tryLearn(s,a,'event');if(chance(.3))sAdj(s,c.k,-12)}})}]},
  {l:T('Refuse, and tell him to put it back','拒绝，让他放回去'),out:[{t:T('He goes pale and thanks you. You hope he does.','他脸都白了，连声道谢。但愿他真放回去了。'),c:'good',fx:(s,c)=>({align:2,f:s=>sAdj(s,c.k,3,1)})}]},
  {l:T('Turn him in to his sect','把他交给他的门派'),out:[{t:T('His sect thanks you. He does not.','他的门派谢了你。他可没谢你。'),c:'muted',fx:(s,c)=>({f:s=>sAdj(s,c.k,10)})}]}]});
OS('os_tourney',{age:[16,60],text:c=>T(`${OSN(c).en} is holding an open contest at its gate this season. Anyone may enter.`,`这一季，${OSN(c).zh}在山门前摆了擂台，谁都可以上去比试。`),
 opts:[{l:T('Enter','报名'),fight:(s,c)=>({foe:{name:T(`a champion of ${SECTS[c.k].en}`,`${SECTS[c.k].cn}的高手`),lv:Math.round(power(s)*(.95+R()*.25)),fixed:1},stakes:'light',title:T('The open contest','比武大会'),cause:T('an open contest','比武大会')}),
   win:[{t:T('You take the prize, and the sect’s elders take note of your name.','你拿了头彩，那一派的长老们记住了你的名字。'),c:'gold',fx:(s,c)=>({money:rint(40,120),fame:4,f:s=>sAdj(s,c.k,6)})}],lose:[{t:T('You lose in the third round. The food was good.','你在第三轮输了。饭菜倒是不错。'),c:'muted',fx:{fame:1}}]},
  {l:T('Watch from the crowd','在台下看'),out:[{t:T('You learn a great deal about who is good in this part of the world.','这一带谁有真本事，你心里有数了。'),c:'muted',fx:{smarts:1}}]}]});
OS('os_traitor',{age:[16,80],text:c=>T(`A man in torn robes begs you to hide him: ${c.npc.en}, a deserter from ${OSN(c).en}. Their pursuers are an hour behind.`,`一个衣衫褴褛的人求你把他藏起来：他叫${c.npc.zh}，是${OSN(c).zh}的叛徒。追他的人只落后一个时辰。`),
 opts:[{l:T('Hide him','藏起他'),out:[{t:T('The pursuers pass. He tells you why he ran, and you believe him.','追兵过去了。他告诉你为什么要逃，你信了。'),c:'muted',fx:(s,c)=>({align:1,meet:'friend',bond:65,f:s=>{if(chance(.4))sAdj(s,c.k,-10)}})}]},
  {l:T('Hand him over when they arrive','等追兵来了把他交出去'),out:[{t:T('They thank you formally. He does not look at you as they take him.','他们客客气气地谢了你。被带走时，他看都没看你一眼。'),c:'muted',fx:(s,c)=>({align:-1,f:s=>sAdj(s,c.k,8)})}]}]});
OS('os_healer',{age:[10,90],when:s=>s.health<s.maxHealth*.75||condKeys(s).length>0,np:{age:rint(40,65)},
 text:c=>T(`A travelling healer of ${OSN(c).en}, ${c.npc.en}, sees how you are walking and insists on looking at you.`,`${OSN(c).zh}一位游方的医者${c.npc.zh}看你走路的样子，非要给你瞧瞧。`),
 opts:[{l:T('Let them','让他瞧'),out:[{t:T('Needles, a bitter draught, and a lecture. You feel better than you have in months.','几针下去，一碗苦药，外加一顿数落。你几个月没这么舒坦过了。'),c:'good',fx:(s,c)=>({heal:[15,30],meet:'acq',bond:60,f:s=>{if(typeof easeCond==='function'&&condKeys(s).length)easeCond(s,condKeys(s)[0],1,T('a sect healer','门派医者'))}})}]},
  {l:T('Refuse','谢绝'),out:[{t:T('“Your funeral,” they say, not unkindly.','“随你，命是你的。”语气倒不算凶。'),c:'muted'}]}]});
OS('os_feast',{age:[18,90],when:s=>s.fame>=30,text:c=>T(`${OSN(c).en} invites you to the master’s birthday feast. You are seated far from the head table, but you are seated.`,`${OSN(c).zh}请你去喝掌门的寿酒。你的座位离主桌很远，可总归有你一个座。`),
 opts:[{l:T('Go, with a good gift','带份厚礼去'),if:s=>s.money>=60,out:[{t:T('Your gift is read out. People look round to see who you are.','唱礼的人念到你的名字，满堂的人都回头看你是谁。'),c:'good',fx:(s,c)=>({money:-60,fame:3,f:s=>sAdj(s,c.k,8)})}]},
  {l:T('Go, and just eat','去，光吃'),out:[{t:T('The food is excellent and nobody notices you. Ideal.','菜很好，没人注意你。正合适。'),c:'muted',fx:(s,c)=>({happy:3,f:s=>sAdj(s,c.k,2,1)})}]},
  {l:T('Send regrets','托辞不去'),out:[{t:T('They will hardly notice.','他们大概都不会发觉。'),c:'muted'}]}]});
OS('os_pointers',{age:[14,70],text:c=>T(`At a well, a disciple of ${OSN(c).en}, ${c.npc.en}, is practising the sect’s basic form. ${c.npc.He} offers to show you, if you show ${c.npc.him} something in return.`,`井边，${OSN(c).zh}的弟子${c.npc.zh}正在练本门的入门功夫。${c.npc.ta}说，你要是也教${c.npc.ta}一手，${c.npc.ta}就把这套教给你。`),
 opts:[{l:T('Trade a move for a move','一招换一招'),out:[{t:T('You both learn something you are not supposed to know.','你们都学到了些本不该知道的东西。'),c:'good',fx:(s,c)=>({meet:'friend',bond:60,f:s=>{const a=SECTS[c.k].arts&&SECTS[c.k].arts[0]?sectArt(c.k,0):null;if(a)tryLearn(s,a,'taught')}})}]},
  {l:T('Just watch','光看看'),out:[{t:T('Interesting footwork. Not your style.','步法挺有意思，可不是你的路数。'),c:'muted',fx:{smarts:1}}]}]});
OS('os_evil',{evil:true,age:[14,85],text:c=>T(`Men of ${OSN(c).en} are taking “contributions” from a village by force. An old man is already on the ground.`,`${OSN(c).zh}的人在村里强行“化缘”，一个老人已经被打倒在地。`),
 opts:[{l:T('Drive them off','把他们赶走'),fight:(s,c)=>({foe:{name:T(`thugs of ${SECTS[c.k].en}`,`${SECTS[c.k].cn}的恶徒`),lv:PW(1.05,3)(s),fixed:1},stakes:'injury',title:T('The village','欺压村民'),cause:T('dark-sect thugs','邪派恶徒')}),
   win:[{t:T('The village feeds you for three days and will not hear of payment.','村里管了你三天饭，死活不肯收钱。'),c:'good',fx:(s,c)=>({fame:3,align:3,f:s=>sAdj(s,c.k,-10)})}],lose:[{t:T('They beat you, and the village pays double for your trouble.','他们打倒了你，村子还因为你多交了一倍。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Keep your head down','低头走过'),out:[{t:T('You walk past. The old man’s face stays with you.','你走过去了。那老人的脸，你一直忘不掉。'),c:'bad',fx:{happy:-3,align:-1}}]}]});
OS('os_letter',{age:[14,80],text:c=>T(`A messenger of ${OSN(c).en} asks you to carry a sealed letter to a village two days away. He is lame, and it is urgent.`,`${OSN(c).zh}的一个信使腿脚不便，求你把一封封好的信送到两天路程外的村子，事情很急。`),
 opts:[{l:T('Take the letter','接下这封信'),out:[{w:3,t:T('You deliver it. The recipient reads it, weeps, and gives you a jade token for your trouble.','你送到了。收信人读完哭了，送你一块玉牌作谢礼。'),c:'good',fx:(s,c)=>({money:rint(20,60),f:s=>sAdj(s,c.k,6)})},
   {w:1,t:T('Someone ambushes you on the road for it. You keep the letter, barely.','路上有人为这封信截杀你。信保住了，险得很。'),c:'bad',fx:(s,c)=>({heal:-8,f:s=>sAdj(s,c.k,10)})}]},
  {l:T('Decline','推辞'),out:[{t:T('He finds someone else, eventually.','他总算找了别人。'),c:'muted'}]}]});
