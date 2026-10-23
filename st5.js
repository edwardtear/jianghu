/* 江湖一生 · content batch 1, multi-stage stories: a sealed room, a witness who changes her story, the road where
   convoys vanish, a master's secret, a childhood promise, and letters from someone with your name */
'use strict';

/* ===================== 密室 · The Sealed Room ===================== */
SDEF('room',{n:T('The Sealed Room','密室'),theme:T('A man dead in a room bolted from the inside. Everyone has a theory; only one of them is true.','一个人死在从里面闩死的屋子里。人人都有说法，只有一个是真的。'),
 ends:{solved:{n:T('The truth, proved','真相大白'),tone:'good'},wrong:{n:T('The wrong man hanged','错判了人'),tone:'bad'},bought:{n:T('Paid to look away','收钱闭眼'),tone:'bad'},mercy:{n:T('A truth kept quiet','知情不报，留了条生路'),tone:'mixed'},lapsed:{n:T('Never solved','悬案'),tone:'mixed'}},
 hint:{b:T('Look over the sealed room again. (Visit town.)','再去那间密室看看。（下一步：进城）'),c:T('You think you know how it was done. (Visit town.)','你觉得自己想通了是怎么做到的。（下一步：进城）')},exp:6});
SOPEN('room',{age:[18,70],w:2.5,tags:['town'],when:s=>s.smarts>=35||s.fame>=25,
 ctx:s=>{const n=genName('m');return{dead:T(n.py,n.cn),how:rint(0,2),sus:pick([T('the steward','管家'),T('the young widow','年轻的继室'),T('the eldest son','大公子')])}},
 text:c=>T(`The wool merchant ${c.dead.en} has been found dead in his counting room, the door bolted from inside, the window latched. The magistrate is about to arrest ${c.sus.en}. A clerk who has heard of you asks if you would take a look first.`,`布商${c.dead.zh}死在账房里，门从里面闩着，窗也扣得好好的。县太爷正要拿${c.sus.zh}问罪。一个听说过你的书办，悄悄请你先去看一眼。`),
 opts:[{l:T('Look at the room','去看看'),out:[{t:T('Dust on the sill, a cold brazier, a cup with a faint smell, and a roof tile slightly out of line.','窗台上的灰、冷了的火盆、一只有股怪味的茶杯，还有一片没放正的瓦。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'room',c,'b',{dead:c.dead,how:c.how,sus:c.sus},0)}}]},
  {l:T('Not your business','不关你的事'),out:[{t:T('You hear later that the arrest went ahead.','后来听说，人还是被抓了。'),c:'muted'}]}]});
STI('room','b',{tags:['town'],self:1,
 text:c=>T(`You go over the room again. Three things could matter: the roof tile, the cup, and the brazier. You have time to follow one properly.`,`你把屋子又细看了一遍。有三样东西可能要紧：那片瓦、那只杯子、那个火盆。你只来得及把其中一样查到底。`),
 opts:[{l:T('The roof tile','那片瓦'),out:[{t:c=>c.f.how===0?T('Fresh scratches on the beam above. Someone came in through the roof.','房梁上有新刮痕。有人是从房顶下来的。'):T('A cat, probably. Nothing else.','多半是猫。别的没有。'),c:'muted',fx:{f:(s,c)=>stGo(s,'room','c',{clue:'tile',right:c.f.how===0?1:0},[0,1])}}]},
  {l:T('The cup','那只杯子'),out:[{t:c=>c.f.how===1?T('An apothecary friend sniffs it and goes pale: a slow poison, taken hours before. He bolted the door himself, already dying.','你托一个药铺的朋友闻了闻，他脸都白了：是慢毒，几个时辰前就喝下了。门是他自己闩的，那时已经快不行了。'):T('Bitter tea, nothing more.','只是一杯苦茶。'),c:'muted',fx:{f:(s,c)=>stGo(s,'room','c',{clue:'cup',right:c.f.how===1?1:0},[0,1])}}]},
  {l:T('The brazier','那个火盆'),out:[{t:c=>c.f.how===2?T('Ash of a letter, half burned: a farewell. He meant to go, and arranged it to look like murder, to ruin someone.','火盆里有半封烧剩的信：是绝笔。他是自尽，却布置成被人杀害的样子，好拖一个人下水。'):T('Ashes of old accounts. Nothing.','烧掉的旧账本。没什么。'),c:'muted',fx:{f:(s,c)=>stGo(s,'room','c',{clue:'ash',right:c.f.how===2?1:0},[0,1])}}]}]});
const ROOM_TRUTH=[T('a thief came through the roof, killed him, and left the way he came','一个贼从房顶下来，杀了人，又原路出去'),T('he was poisoned hours before, and bolted the door himself','他几个时辰前就中了毒，门是自己闩的'),T('he killed himself and staged it to destroy a rival','他是自尽，却布置成凶案，要嫁祸仇家')];
STI('room','c',{tags:['town'],self:1,
 ctx:s=>{const c=stCtx(s,'room');c.bribe=rint(8,16)*10;return c},
 text:c=>c.f.right?T(`You are sure now: ${ROOM_TRUTH[c.f.how].en}. The arrest is tomorrow. That evening, a family member visits you with a heavy purse and asks you to let it go.`,`你现在确定了：${ROOM_TRUTH[c.f.how].zh}。明天就要拿人。当晚，死者的一个家里人带着一袋沉甸甸的银子来见你，请你别再管了。`)
  :T(`You have a theory built on the wrong clue. Tomorrow ${c.f.sus.en} will be arrested. Do you speak up anyway?`,`你的推断建立在一条错线索上。明天${c.f.sus.zh}就要被拿了。你还要不要出头？`),
 opts:[{l:T('Lay it all out before the magistrate','到县太爷面前说个明白'),out:[{w:(s,c)=>c.f.right?5:1,t:T('The pieces fit. The magistrate releases the accused and thanks you, stiffly.','前后都对得上。县太爷放了人，别别扭扭地谢了你。'),c:'gold',fx:{fame:4,align:3,smarts:2,f:(s,c)=>stEnd(s,'room','solved')}},
   {w:(s,c)=>c.f.right?0:3,t:c=>T(`Your theory collapses under questions, and ${c.f.sus.en} is convicted after all.`,`你的说法经不起几句追问，${c.f.sus.zh}还是被定了罪。`),c:'bad',fx:{fame:-3,f:(s,c)=>stEnd(s,'room','wrong')}}]},
  {l:c=>T(`Take the purse (${c.bribe} taels)`,`收下银子（${c.bribe}两）`),if:(s,c)=>c.f.right,out:[{t:T('You say nothing. The accused goes to the execution ground.','你一言不发。被冤的人上了刑场。'),c:'bad',fx:(s,c)=>({money:c.bribe,align:-12,f:(s,c)=>stEnd(s,'room','bought')})}]},
  {l:T('Tell only the accused, and help them get away','只告诉被冤的人，帮其脱身'),if:(s,c)=>c.f.right&&c.f.how===2,out:[{t:T('No scandal, no trial. The family keeps its name; the accused keeps their life.','没有丑闻，也没有公堂。那家人保住了脸面，被冤的人保住了命。'),c:'muted',fx:{align:2,f:(s,c)=>stEnd(s,'room','mercy')}}]}]});

/* ===================== 改口的证人 · The Witness Who Changed Her Story ===================== */
SDEF('witn',{n:T('The Witness Who Changed Her Story','改口的证人'),theme:T('You both saw it. Now she says she saw nothing, and you need to know why.','你们都看见了。现在她说什么也没看见，你得弄明白为什么。'),
 ends:{protected:{n:T('She told the truth, and lived','她说了真话，也活了下来'),tone:'good'},exposed:{n:T('The man who threatened her, exposed','威胁她的人被揭穿'),tone:'good'},silent:{n:T('Two witnesses, both silent','两个证人，都闭了嘴'),tone:'bad'},alone:{n:T('Your word alone','只有你一个人的证词'),tone:'mixed'},lapsed:{n:T('The case went cold','案子不了了之'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Find out why ${r.facts.w.en} changed her story. (Visit town.)`,`弄清楚${r.facts.w.zh}为什么改口。（下一步：进城）`)},exp:5});
SOPEN('witn',{age:[16,70],w:2,tags:['town'],
 ctx:s=>{const w=genName('f'),b=genName('m');return{w:T(w.py,w.cn),bully:T(b.py,b.cn),why:rint(0,1)}},
 text:c=>T(`You and a seamstress, ${c.w.en}, both saw ${c.bully.en}'s men beat a shopkeeper half to death. At the yamen today, she says she saw nothing at all, and will not look at you.`,`你和一个叫${c.w.zh}的绣娘，都亲眼看见${c.bully.zh}的手下把一个掌柜打得半死。今天在衙门里，她却说什么也没看见，看都不敢看你。`),
 opts:[{l:T('Find out why','去弄清楚'),out:[{t:T('You follow her home, at a distance.','你远远地跟着她回家。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'witn',c,'b',{w:c.w,bully:c.bully,why:c.why},[0,1])}}]},
  {l:T('Testify alone','一个人作证'),out:[{w:s=>1+s.fame/30,t:T('Your word is enough, just. The case goes forward.','你一个人的话，勉强够了。案子接着审。'),c:'muted',fx:{align:2}},{w:1,t:T('It is your word against his. The case is dropped.','你一个人的话，抵不过他。案子撤了。'),c:'muted'}]},
  {l:T('Keep quiet too','你也不说了'),out:[{t:T('Two witnesses, both silent. The shopkeeper never walks properly again.','两个证人，都闭了嘴。那掌柜再没能好好走路。'),c:'bad',fx:{align:-4}}]}]});
STI('witn','b',{tags:['town'],self:1,ctx:s=>{const c=stCtx(s,'witn');c.lv=stFoe(s,.9,10);return c},
 text:c=>c.f.why===0?T(`You find out: ${c.f.bully.en}'s men told ${c.f.w.en} her little brother works on the docks, and accidents happen on docks.`,`你打听到了：${c.f.bully.zh}的人跟${c.f.w.zh}说，她弟弟在码头上做活，码头上常出意外。`)
  :T(`You find out: ${c.f.w.en} owes ${c.f.bully.en} money, and he has offered to forget it.`,`你打听到了：${c.f.w.zh}欠着${c.f.bully.zh}的钱，他答应一笔勾销。`),
 opts:[{l:T('Get her brother somewhere safe','把她弟弟安顿到安全的地方'),if:(s,c)=>c.f.why===0,out:[{t:T('With her brother out of reach, she finds her voice.','弟弟到了安全地方，她终于敢开口了。'),c:'gold',fx:{align:4,fame:2,money:-20,f:(s,c)=>stEnd(s,'witn','protected')}}]},
  {l:T('Pay off her debt (60 taels)','替她还了这笔债（六十两）'),if:(s,c)=>c.f.why===1,cost:60,out:[{t:T('Owing him nothing, she testifies.','不再欠他什么，她上堂作了证。'),c:'gold',fx:{align:3,fame:2,f:(s,c)=>stEnd(s,'witn','protected')}}]},
  {l:T('Go after the man himself','直接去找那个人'),fight:(s,c)=>({foe:{name:c.f.bully,lv:c.lv,fixed:1},stakes:'injury',title:T('The man behind it','幕后的人'),cause:T('a local bully','地头蛇')}),
   win:[{t:T('His threats come out in front of half the street. The yamen cannot ignore it now.','他那些威胁当着半条街的人抖了出来。衙门这下没法装看不见了。'),c:'gold',fx:{fame:3,align:2,f:(s,c)=>stEnd(s,'witn','exposed')}}],
   lose:[{t:T('You are beaten in front of her window. She does not testify.','你在她窗前被打倒。她终究没有作证。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'witn','silent')}}]},
  {l:T('Leave her be; testify alone','别为难她，你一个人作证'),out:[{t:T('Your word alone. It carries a little.','只有你一个人的证词。多少有点分量。'),c:'muted',fx:{align:1,f:(s,c)=>stEnd(s,'witn','alone')}}]}]});

/* ===================== 断镖路 · The Road Where Convoys Vanish ===================== */
SDEF('route',{n:T('The Road Where Convoys Vanish','断镖路'),theme:T('Three convoys gone on the same road in a year. The locals say ghosts. The answer is less comfortable.','一年里同一条路丢了三趟镖。当地人说是闹鬼。真相更叫人难受。'),
 ends:{cleared:{n:T('The road is safe again','路又通了'),tone:'good'},inside:{n:T('The rot was inside the agency','烂在镖局自己身上'),tone:'good'},cut:{n:T('You took a cut','你分了一杯羹'),tone:'bad'},failed:{n:T('The road claims another','这条路又吞了一趟'),tone:'bad'},lapsed:{n:T('Still a haunted road','还是那条闹鬼的路'),tone:'mixed'}},
 hint:{b:T('Ride the haunted road and see for yourself. (Roam or travel.)','亲自走一趟那条闹鬼的路。（下一步：游历或远行）')},exp:6});
SOPEN('route',{age:[18,65],w:1.4,tags:['town'],when:s=>power(s)>=25,
 ctx:s=>({inside:chance(.45),pay:rint(10,20)*10}),
 text:c=>T(`An escort agency chief is desperate: three convoys have vanished on the old mountain road this year, men and cargo, no bodies. The locals say the road is haunted. He offers ${c.pay} taels to anyone who finds out.`,`一家镖局的总镖头急得团团转：今年老山道上已经丢了三趟镖，人和货都没了，连尸首都找不到。当地人说那条路闹鬼。他出${c.pay}两，请人查个明白。`),
 opts:[{l:T('Take the job','接下'),out:[{t:T('He shakes your hand too long.','他握着你的手半天不放。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'route',c,'b',{inside:c.inside,pay:c.pay},[0,1])}}]},{l:T('Leave it to someone else','留给别人吧'),out:[{t:T('You hear of a fourth convoy, a month later.','一个月后，你听说第四趟也丢了。'),c:'muted'}]}]});
STI('route','b',{tags:['wander','af_travel'],self:1,ctx:s=>{const c=stCtx(s,'route');c.lv=stFoe(s,1.05,15);return c},
 text:c=>c.f.inside?T(`Halfway up the road, in a ruined shrine, you find the missing cargo, neatly stacked, and the agency's own second-in-command counting it.`,`走到半山，一座破山神庙里，你找到了丢失的货，码得整整齐齐，正在清点的是那家镖局的副总镖头。`)
  :T(`Halfway up the road, a white figure drifts between the trees and wails. Behind it, a dozen men with blades who are very much alive.`,`走到半山，一个白影在林子里飘来飘去，凄凄惨惨地叫。白影后头，是十几个提着刀、活得好好的汉子。`),
 opts:[{l:T('Take them on','动手'),fight:(s,c)=>({foe:{name:c.f.inside?T('the second-in-command','副总镖头'):T('the “ghosts”','“鬼”们'),lv:c.lv,fixed:1},stakes:'injury',title:T('The haunted road','闹鬼的路'),cause:T('the haunted road','闹鬼的山道')}),
   win:[{t:c=>c.f.inside?T(`He confesses everything: the robberies were staged, the cargo resold, the dead men paid to vanish. The chief weeps.`,`他全招了：劫镖是自导自演，货转手卖了，那些“死人”是拿了钱远走高飞。总镖头当场哭了。`):T(`The ghosts take off their sheets and run. The road is open again.`,`“鬼”们扯掉白布就跑。山道又通了。`),c:'gold',fx:(s,c)=>({money:c.f.pay,fame:4,align:2,f:(s,c)=>stEnd(s,'route',c.f.inside?'inside':'cleared')})}],
   lose:[{t:T('You barely get down the mountain. The road keeps its secret.','你好不容易才逃下山。那条路的秘密还在。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'route','failed')}}]},
  {l:T('Accept a share to keep quiet','收一份，闭上嘴'),if:(s,c)=>c.f.inside,out:[{t:T('Your share is generous. The chief pays you too, for finding nothing.','你那一份很丰厚。总镖头还因为你“什么也没查到”付了你钱。'),c:'bad',fx:(s,c)=>({money:c.f.pay*2,align:-10,f:(s,c)=>stEnd(s,'route','cut')})}]},
  {l:T('Slip away and report it','悄悄退下，回去报信'),out:[{w:2,t:T('With what you saw, the chief brings twenty men and the constables. It is over in an hour.','凭你看到的，总镖头带了二十个人和捕快上山。一个时辰就了结了。'),c:'good',fx:(s,c)=>({money:Math.round(c.f.pay/2),fame:2,f:(s,c)=>stEnd(s,'route',c.f.inside?'inside':'cleared')})},{w:1,t:T('By the time anyone goes back, they are gone, and so is the cargo.','等人回去时，人和货都没了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'route','failed')}}]}]});

/* ===================== 师父的秘密 · A Master's Secret ===================== */
SDEF('hush',{n:T('A Master’s Secret','高人的秘密'),theme:T('A respected master asks you to forget what you saw. Years later you learn what it was.','一位德高望重的前辈请你忘掉看见的事。多年后，你才知道那是什么。'),
 ends:{peace:{n:T('You kept a secret that kept the peace','你守住的秘密，保住了太平'),tone:'good'},trap:{n:T('You exposed a traitor','你揭穿了一个内奸'),tone:'good'},harm:{n:T('Your silence cost lives','你的沉默害了人'),tone:'bad'},spoke:{n:T('You spoke, and were wrong','你说了出去，却说错了'),tone:'bad'},lapsed:{n:T('You never learned what it was','始终不知道那是怎么回事'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`You are keeping ${r.facts.m.en}'s secret.`,`你替${r.facts.m.zh}守着一个秘密。`)},exp:12});
SOPEN('hush',{age:[16,60],w:2,tags:['wander','af_sectmission'],
 ctx:s=>{const n=genName('m'),evil=pick(Object.keys(SECTS).filter(k=>SECTS[k].evil));return{m:T(n.py,n.cn),evil,truth:chance(.6)?'peace':'trap',lv:stFoe(s,1.3,30)}},
 text:c=>T(`At dawn in a bamboo grove you see Elder ${c.m.en}, respected by every righteous sect, quietly handing a letter to a disciple of ${SECTS[c.evil].en}. He sees you. Later he finds you alone: “I ask you, as a favour to an old man, to forget this morning.”`,`拂晓时分，你在竹林里看见了各大正派都敬重的${c.m.zh}长老，正悄悄把一封信交给${SECTS[c.evil].cn}的弟子。他也看见了你。后来他单独找到你：“老朽求你一件事：忘了今天早上。”`),
 opts:[{l:T('Promise to forget','答应忘掉'),out:[{t:T('He bows to you, which an elder does not do.','他向你躬身行礼。长老是不向晚辈行礼的。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'hush',c,'b',{m:c.m,evil:c.evil,truth:c.truth,lv:c.lv,kept:1},[3,7])}}]},
  {l:T('Ask him what it was','问他那是怎么回事'),out:[{t:T('“If I told you, you would have to keep it too. Better you do not know.”','“告诉你，你就得跟着一起守。还是不知道的好。”'),c:'muted',fx:{f:(s,c)=>stBegin(s,'hush',c,'b',{m:c.m,evil:c.evil,truth:c.truth,lv:c.lv,kept:1,asked:1},[3,7])}}]},
  {l:T('Tell the sects what you saw','把看见的告诉各派'),out:[{t:T('Uproar. The elder says nothing in his defence, and withdraws from the jianghu.','一片哗然。长老一句辩解也没有，从此退出了江湖。'),c:'muted',fx:{fame:2,f:(s,c)=>stBegin(s,'hush',c,'b',{m:c.m,evil:c.evil,truth:c.truth,told:1},[2,5])}}]}]});
STI('hush','b',{self:1,
 text:c=>{const f=c.f,e=SECTS[f.evil];if(f.truth==='peace')return f.told?T(`Word comes: the war between the righteous sects and ${e.en} has broken out after all. The talks Elder ${f.m.en} had been holding in secret ended the day you spoke.`,`消息传来：正派与${e.cn}的大战终究还是打起来了。${f.m.zh}长老暗中主持的议和，在你说出去的那天就断了。`)
  :T(`The jianghu is astonished: a truce between the righteous sects and ${e.en}, years in the making. Elder ${f.m.en} sends you a single line: “Thank you for forgetting.”`,`江湖震动：正派与${e.cn}议和了，背后谈了好些年。${f.m.zh}长老给你捎来一句话：“多谢你忘了。”`);
  return f.told?T(`It comes out: Elder ${f.m.en} had been selling the righteous sects' plans to ${e.en} for years. Your word, years ago, was the first crack.`,`真相大白：${f.m.zh}长老多年来一直把正派的部署卖给${e.cn}。你当年那句话，是第一道裂缝。`)
  :T(`A massacre at a sect gathering: ${e.en} knew exactly where everyone would be. You think of a letter handed over in a bamboo grove.`,`一场正派聚会遭了血洗：${e.cn}对每个人在哪儿都一清二楚。你想起竹林里递过去的那封信。`)},
 opts:[{l:T('So that was it','原来如此'),out:[{t:T('You understand, finally, what you were part of.','你终于明白，自己也是这件事的一部分。'),c:'muted',fx:(s,c)=>{const f=c.f;const e=f.truth==='peace'?(f.told?'spoke':'peace'):(f.told?'trap':'harm');return{align:e==='peace'||e==='trap'?3:-3,fame:e==='trap'?4:0,f:(s,c)=>stEnd(s,'hush',e)}}}]},
  {l:T('Go after the elder','去找那位长老'),if:(s,c)=>c.f.truth==='trap'&&!c.f.told,fight:(s,c)=>({foe:{name:c.f.m,lv:c.f.lv||40,fixed:1},stakes:'injury',title:T('The traitor elder','内奸长老'),cause:T('a traitor elder','内奸长老')}),
   win:[{t:T('You bring him before the sects. It does not bring back the dead, but it ends it.','你把他押到各派面前。死者回不来了，可这事总算了了。'),c:'gold',fx:{fame:5,align:4,f:(s,c)=>stEnd(s,'hush','trap')}}],
   lose:[{t:T('He escapes, and you carry your silence like a stone.','他逃了。你的沉默像块石头压在心上。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'hush','harm')}}]}]});

/* ===================== 儿时之约 · A Childhood Promise ===================== */
SDEF('promise',{n:T('A Childhood Promise','儿时之约'),theme:T('Two children make a promise under a tree. Twenty years later, one of them remembers.','两个孩子在一棵树下许了个约。二十年后，其中一个还记得。'),
 ends:{kept:{n:T('Under the same tree','还在那棵树下'),tone:'good'},late:{n:T('A day too late','晚了一天'),tone:'mixed'},forgot:{n:T('Only one remembered','只有一个人记得'),tone:'bad'},laugh:{n:T('Two grown fools laughing','两个大人笑得像傻子'),tone:'good'},lapsed:{n:T('The tree was cut down','那棵树被砍了'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`You promised ${r.facts.kid.en} to meet under the old tree when you were both grown.`,`你答应过${r.facts.kid.zh}，长大了在老树下见。`)},exp:16});
SOPEN('promise',{age:[7,12],w:2.5,
 ctx:s=>{const g=chance(.5)?'m':'f',n=genName(g);return{kid:{en:n.py,zh:n.cn,sex:g},what:rint(0,2)}},
 text:c=>{const k=c.kid,w=[T('to become the greatest heroes in the jianghu, together','将来一起做天下第一的大侠'),T('to marry each other, which seems obvious at the time','长大了要做夫妻，当时觉得这再自然不过'),T('to meet here again in twenty years, no matter what','二十年后，不管怎样，都回这里见面')][c.what];
  return T(`Under the old camphor tree at the edge of town, you and ${k.en} swear ${w.en}. You both spit on your palms and shake on it.`,`镇口的老樟树下，你和${k.zh}发誓${w.zh}。两人往手心啐了口唾沫，击掌为誓。`)},
 opts:[{l:T('Carve it into the bark','把誓言刻在树皮上'),out:[{t:T('Two names, badly carved.','两个名字，刻得歪歪扭扭。'),c:'good',fx:{happy:3,f:(s,c)=>stBegin(s,'promise',c,'b',{kid:c.kid,what:c.what,carved:1},[16,22])}}]},
  {l:T('Pinky swear','拉钩'),out:[{t:T('A hundred years, no takebacks.','拉钩上吊，一百年不许变。'),c:'good',fx:{happy:2,f:(s,c)=>stBegin(s,'promise',c,'b',{kid:c.kid,what:c.what},[16,22])}}]}]});
STI('promise','b',{self:1,when:s=>s.age>=24,
 ctx:s=>{const c=stCtx(s,'promise');c.v=wpick([{v:0,w:3},{v:1,w:2},{v:2,w:1.2}]).v;return c},
 text:(c,s)=>{const k=c.f.kid,yrs=s.age-c.r.at,P=k.sex==='f'?['she','her','她']:['he','him','他'];
  return[T(`A note arrives, in an adult hand you have never seen: “The tree is still there. Are you?” It is signed ${k.en}.`,`一张字条，字迹陌生，已经是大人的手笔：“树还在。你呢？”落款是${k.zh}。`),
   T(`You pass through your old town and, without meaning to, walk to the camphor tree. ${c.f.carved?'The names are still there, stretched by twenty years of growth.':''} Someone left flowers there yesterday.`,`你路过老家，不知不觉走到了那棵老樟树下。${c.f.carved?'那两个名字还在，被二十年的树长得变了形。':''}昨天有人在这儿放了一束花。`),
   T(`You meet ${k.en} by chance in the market. ${P[0].replace(/^./,x=>x.toUpperCase())} does not seem to know you at all.`,`你在集市上偶然碰见了${k.zh}。${P[2]}好像完全不认得你了。`)][c.v]},
 opts:[{l:T('Go to the tree','去老树下'),if:(s,c)=>c.v===0,out:[{t:c=>c.f.what===1?T('You are both married to other people. You laugh until you cry, and then just cry a little.','你们都已经各自成了家。两个人笑到流泪，然后又真哭了一会儿。'):T('Two grown people sit under a tree and are children again for an afternoon.','两个大人坐在树下，做了一下午的孩子。'),c:'gold',fx:(s,c)=>({happy:10,f:(s,c)=>{c.npc=npc(s,{name:{cn:c.f.kid.zh,py:c.f.kid.en},sex:c.f.kid.sex,age:s.age+rint(-1,1)});applyFx(s,{meet:'friend',bond:80},c);stEnd(s,'promise',c.f.what===1?'laugh':'kept')}})}]},
  {l:T('Ask around about the flowers','打听是谁放的花'),if:(s,c)=>c.v===1,out:[{t:c=>T(`${c.f.kid.en} came yesterday, waited all day, and left this morning. Nobody knows where.`,`${c.f.kid.zh}昨天来过，等了一整天，今天一早走了。没人知道去了哪儿。`),c:'bad',fx:{happy:-4,f:(s,c)=>stEnd(s,'promise','late')}}]},
  {l:T('Remind them','提起当年'),if:(s,c)=>c.v===2,out:[{w:2,t:T('A blank look, then a polite smile. They really do not remember.','先是一脸茫然，然后礼貌地笑笑。对方是真的不记得了。'),c:'bad',fx:{happy:-3,f:(s,c)=>stEnd(s,'promise','forgot')}},{w:1,t:T('Their face changes. “The camphor tree.” They grab your hands and do not let go.','对方脸色变了。“老樟树。”一把抓住你的手，不肯放。'),c:'gold',fx:(s,c)=>({happy:8,f:(s,c)=>{c.npc=npc(s,{name:{cn:c.f.kid.zh,py:c.f.kid.en},sex:c.f.kid.sex,age:s.age});applyFx(s,{meet:'friend',bond:75},c);stEnd(s,'promise','kept')}})}]},
  {l:T('Let it be','由它去'),out:[{t:T('Some promises are kept just by remembering them.','有些约，记得就算守了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'promise','forgot')}}]}]});

/* ===================== 同名之人 · Letters to Someone With Your Name ===================== */
SDEF('pen',{n:T('Letters to Someone With Your Name','同名之人'),theme:T('A courier brings you a letter meant for someone in another province who shares your name. You write back.','驿卒送错了信：收信人是外省一个跟你同名同姓的人。你回了信。'),
 ends:{met:{n:T('Two people with one name, at one table','同名的两个人，坐到了一张桌上'),tone:'good'},faded:{n:T('The letters stopped','信断了'),tone:'mixed'},helped:{n:T('A stranger saved by a stranger','素不相识，却救了一命'),tone:'good'},lapsed:{n:T('The letters stopped','信断了'),tone:'mixed'}},
 hint:{b:T('A reply might come from your namesake.','你的“同名人”也许会回信。')},exp:10});
SOPEN('pen',{age:[14,70],w:2,
 ctx:s=>{const R=REGIONS.filter(r=>r.id!==s.region);const r=pick(R);return{pl:T(r.en,r.cn)}},
 text:(c,s)=>T(`The courier hands you a letter addressed to ${s.name}. It is meant for someone of exactly your name in ${c.pl.en}: a long, worried letter from a mother you do not have.`,`驿卒递来一封写着“${s.cn}亲启”的信。收信人是${c.pl.zh}一个跟你同名同姓的人：一封很长、满是牵挂的家书，写信的“娘”不是你的娘。`),
 opts:[{l:T('Forward it, with a note of your own','转寄过去，附上自己的一封信'),out:[{t:T('“Your mother worries. So, now, do I. Who are you?”','“你娘很挂念你。现在我也有点挂念了。你是什么人？”'),c:'good',fx:{f:(s,c)=>stBegin(s,'pen',c,'b',{pl:c.pl},[1,3])}}]},
  {l:T('Send it back to the courier station','退回驿站'),out:[{t:T('Correct, and slightly sad.','办得对，就是有点可惜。'),c:'muted'}]}]});
STI('pen','b',{self:1,ctx:s=>{const c=stCtx(s,'pen');c.v=wpick([{v:0,w:3},{v:1,w:1.5},{v:2,w:1}]).v;return c},
 text:(c,s)=>[T(`A reply from ${c.f.pl.en}, from the other ${s.name}: funny, warm, and full of questions. You have been writing for years now, it turns out, and they are coming through your town next month.`,`${c.f.pl.zh}的那个${s.cn}回信了：风趣、热络，问题一大堆。算起来，你们已经通了好几年信。下个月，对方要路过你这里。`),
  T(`The letters from the other ${s.name} grow shorter, then stop.`,`那个${s.cn}的信越来越短，后来就断了。`),
  T(`An urgent letter from the other ${s.name}: they are ill, alone, and out of money. They are embarrassed to ask.`,`那个${s.cn}来了封急信：病了，一个人，钱也花光了。开口求人，对方自己都觉得难为情。`)][c.v],
 opts:[{l:T('Meet them','见面'),if:(s,c)=>c.v===0,out:[{t:T('Two people, one name, one table. The innkeeper is very confused all evening.','两个人，一个名字，一张桌子。掌柜的一晚上都没搞明白。'),c:'gold',fx:(s,c)=>({happy:8,f:(s,c)=>{c.npc=npc(s,{name:{cn:s.cn,py:s.name},sex:chance(.5)?'m':'f',age:s.age+rint(-6,6)});applyFx(s,{meet:'friend',bond:75},c);stEnd(s,'pen','met')}})}]},
  {l:T('Write once more, then let it go','再写一封，便罢了'),if:(s,c)=>c.v===1,out:[{t:T('No answer. You keep the letters in a box.','没有回音。你把那些信收进了一只匣子。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'pen','faded')}}]},
  {l:T('Send money and a doctor (60 taels)','寄钱，再托人请大夫（六十两）'),if:(s,c)=>c.v===2,cost:60,out:[{t:T('Months later, a letter in a stronger hand: “I am alive because a stranger had my name.”','几个月后来了封信，字迹有力了许多：“我能活下来，是因为有个陌生人跟我同名。”'),c:'gold',fx:{align:4,happy:6,f:(s,c)=>stEnd(s,'pen','helped')}}]},
  {l:T('Send what kind words you can','只能寄几句宽心话'),if:(s,c)=>c.v===2,out:[{t:T('You never hear again.','从此再没了音信。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'pen','faded')}}]}]});
