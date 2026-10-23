/* 江湖一生 · story series, second batch: a meal repaid, a promise at the ferry, an honest merchant, a stolen name,
   a family keepsake, and the old man next door */
'use strict';
const nmOf=n=>T(n.py,n.cn);

/* ===================== 一饭之恩 · One Meal Repaid ===================== */
SDEF('meal',{n:T('One Meal Repaid','一饭之恩'),theme:T('A stranger fed you once, when you were small and hungry. Decades later, you meet again.','小时候饿肚子，一个陌生人给过你一口吃的。几十年后，你们又遇上了。'),
 ends:{repaid:{n:T('The debt repaid','恩情还上了'),tone:'good'},cared:{n:T('You looked after them to the end','你给对方养老送终'),tone:'good'},spared:{n:T('A word at the right moment','关键时刻说了句话'),tone:'good'},
  passedon:{n:T('Passed on to another child','传给了另一个孩子'),tone:'good'},forgotten:{n:T('Only you remembered','只有你还记得'),tone:'mixed'},unpaid:{n:T('You walked past','你走了过去'),tone:'bad'},lapsed:{n:T('A debt carried to the grave','这份恩带进了坟里'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`You still remember the name ${r.facts.who.en}, the stranger who fed you.`,`你还记得那个名字：${r.facts.who.zh}，当年给你饭吃的人。`)},exp:35});
SOPEN('meal',{age:[5,12],w:4,when:s=>(family(s).rich||0)<=1,
 ctx:s=>{const o=pick([17,8,27,19,13,26]),n=npc(s,{occ:o,age:rint(28,45)});return{npc:n,food:pick([T('half a steamed bun','半个馒头'),T('a bowl of millet porridge','一碗小米粥'),T('a roasted sweet potato','一个烤红薯'),T('a handful of dried dates','一把干枣')])}},
 text:c=>T(`A hungry winter. At the roadside, a stranger, ${c.npc.desc.en}, breaks off ${c.food.en} and gives it to you, and asks for nothing. You ask the name. “${c.npc.en}.”`,`那年冬天饿得厉害。路边一个陌生人，${c.npc.desc.zh}，掰了${c.food.zh}给你，什么也没要。你问对方叫什么。“${c.npc.zh}。”`),
 opts:[{l:T('Bow, and say you will remember','磕个头，说一定记着'),out:[{t:T('The stranger laughs and ruffles your hair, and is gone.','那人笑着揉了揉你的头，走了。'),c:'good',fx:{f:(s,c)=>stBegin(s,'meal',c,'b',{who:nmOf(c.npc.n),bowed:1},[16,26])}}]},
  {l:T('Share it with your brother or sister','分给兄弟姐妹'),if:s=>living(s,'sibling').length>0,out:[{t:T('It is very little, split two ways. It is the best thing you have eaten all winter.','分成两份，就更少了。可那是你一冬天吃过最好的东西。'),c:'good',fx:{f:(s,c)=>stBegin(s,'meal',c,'b',{who:nmOf(c.npc.n),shared:1},[16,26])}}]},
  {l:T('Grab it and run','抓过来就跑'),out:[{t:T('You eat it behind a wall, fast. You remember the face anyway.','你躲在墙后几口吞了。那张脸你还是记住了。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'meal',c,'b',{who:nmOf(c.npc.n)},[16,26])}}]}]});
STI('meal','b',{tags:['town','wander'],self:1,when:s=>s.age>=24,
 ctx:s=>{const c=stCtx(s,'meal');c.v=c.npc.age>58?0:pick([0,1,2]);return c},
 text:(c,s)=>{const w=c.f.who,yrs=s.age-c.r.at;return[T(`An old beggar on the temple steps, ${yrs} years older. You know the face before you know why: ${w.en}.`,`庙前台阶上坐着个老乞丐，老了${cnYrs(yrs)}岁。你先认出了那张脸，才想起是谁：${w.zh}。`),
  T(`Constables are dragging ${c.npc.sex==='f'?'a woman':'a man'} to the yamen for stealing rice. You know the face: ${w.en}. ${c.npc.He} does not know yours.`,`捕快正拖着一个偷米的人往衙门去。那张脸你认得：${w.zh}。对方却不认得你。`),
  T(`${w.en} is a wealthy ${c.npc.sex==='f'?'woman':'man'} now, and passes you in a sedan chair without a glance. At the gate, ${c.npc.he} has the servants drive off a hungry child.`,`${w.zh}如今阔了，坐着轿子从你身边过去，看都没看一眼。到了门口，还叫下人把一个讨饭的孩子轰走了。`)][c.v]},
 opts:[{l:T('Take them home and look after them','接回家，养起来'),if:(s,c)=>c.v===0,out:[{t:c=>T(`${c.f.who.en} does not remember the bun, or the child. It does not matter.`,`${c.f.who.zh}早不记得那口吃的，也不记得那个孩子了。这不要紧。`),c:'gold',fx:{money:-40,happy:8,align:4,meet:'friend',bond:80,f:(s,c)=>stEnd(s,'meal','cared')}}]},
  {l:T('Give them silver, and tell them why (50 taels)','给些银子，告诉对方缘由（五十两）'),if:(s,c)=>c.v===0,cost:50,out:[{t:T('The old face works through it slowly, and then cries.','那张老脸慢慢想起来，然后哭了。'),c:'good',fx:{align:3,happy:5,f:(s,c)=>stEnd(s,'meal','repaid')}}]},
  {l:T('Pay the fine (60 taels)','替对方交罚银（六十两）'),if:(s,c)=>c.v===1,cost:60,out:[{t:c=>T(`Outside, ${c.f.who.en} asks why. You tell ${c.npc.him} about a winter road.`,`出了衙门，${c.f.who.zh}问你为什么。你给${c.npc.ta}讲了那年冬天的路边。`),c:'good',fx:{align:3,f:(s,c)=>stEnd(s,'meal','repaid')}}]},
  {l:T('Vouch for them to the magistrate','去县太爷面前替对方担保'),if:(s,c)=>c.v===1,out:[{w:s=>1+s.fame/25+s.smarts/50,t:c=>T(`Your word is enough. ${c.npc.He} is let go with a warning.`,`你一句话就够了。${c.npc.ta}挨了几句训，被放了。`),c:'good',fx:{fame:1,f:(s,c)=>stEnd(s,'meal','spared')}},{w:1,t:c=>T(`The magistrate is not interested in your word. ${c.npc.He} gets twenty strokes.`,`县太爷根本不理你那一套。${c.npc.ta}挨了二十板子。`),c:'bad',fx:{f:(s,c)=>stEnd(s,'meal','unpaid')}}]},
  {l:T('Feed the child at the gate yourself','自己去喂那个被轰走的孩子'),if:(s,c)=>c.v===2,out:[{t:T('You give the child a bun and ask for nothing. When they ask your name, you tell them.','你给了那孩子一个馒头，什么也没要。孩子问你叫什么，你告诉了。'),c:'gold',fx:{align:4,happy:6,f:(s,c)=>stEnd(s,'meal','passedon')}}]},
  {l:T('Remind them who you are','上前提起当年'),if:(s,c)=>c.v===2,out:[{t:T('A polite, blank smile. “I am sure I did. Good day.”','一个客气又茫然的笑。“想必是有的吧。告辞。”'),c:'muted',fx:{f:(s,c)=>stEnd(s,'meal','forgotten')}}]},
  {l:T('Walk past','走过去'),if:(s,c)=>c.v<2,out:[{t:T('You tell yourself you might be wrong about the face.','你跟自己说，也许认错人了。'),c:'bad',fx:{align:-3,f:(s,c)=>stEnd(s,'meal','unpaid')}}]}]});

/* ===================== 渡口之约 · A Promise at the Ferry ===================== */
SDEF('ferry',{n:T('A Promise at the Ferry','渡口之约'),theme:T('An old ferryman asks you to find his daughter and bring back word. He will wait.','老船夫托你去找他女儿，带句话回来。他说他会等。'),
 ends:{kept:{n:T('Word brought back in time','话带回来了，赶上了'),tone:'good'},reunion:{n:T('Father and daughter on one boat','父女同船'),tone:'good'},toolate:{n:T('Word for a grave','话只能说给坟听'),tone:'bad'},
  broken:{n:T('He is still waiting','他还在等'),tone:'bad'},lapsed:{n:T('He is still waiting','他还在等'),tone:'bad'}},
 hint:{b:(s,r)=>T(`Find ${r.facts.dau.en} in ${r.facts.place.en} for the old ferryman. (Travel or roam.)`,`替老船夫去${r.facts.place.zh}找他女儿${r.facts.dau.zh}。（下一步：远行或游历）`),
  c:(s,r)=>T(`Go back to the ferry: ${r.facts.who.en} is waiting for word. (Roam or travel.)`,`回渡口去：${r.facts.who.zh}还在等消息。（下一步：游历或远行）`)},
 exp:6,lapse:T('You never go back to the ferry. Somewhere, an old man still looks up at every boat.','你再也没回那个渡口。某个地方，一个老人还在抬头看每一条船。')});
SOPEN('ferry',{age:[16,60],w:3,tags:['wander','af_travel'],
 ctx:s=>{const d=genName('f'),regs=REGIONS.filter(r=>r.id!==s.region),pl=pick(regs);return{npc:npc(s,{occ:16,sex:'m',age:rint(62,72)}),dau:T(d.py,d.cn),place:T(pl.en,pl.cn)}},
 text:c=>T(`The old ferryman, ${c.npc.en}, will not take your fare. His daughter ${c.dau.en} married into ${c.place.en} eleven years ago and stopped writing. Would you take her this wooden comb he carved, and bring back word? “I will be here. I am always here.”`,`老船夫${c.npc.zh}不肯收你的船钱。他女儿${c.dau.zh}十一年前嫁到了${c.place.zh}，后来就断了音信。能不能把他刻的这把木梳带给她，再捎句话回来？“我就在这儿。我一直在这儿。”`),
 opts:[{l:T('Promise','答应'),out:[{t:T('He presses the comb into your hand with both of his.','他用两只手把梳子按进你手心。'),c:'good',fx:{f:(s,c)=>stBegin(s,'ferry',c,'b',{who:nmOf(c.npc.n),dau:c.dau,place:c.place},[0,1])}}]},
  {l:T('Say you cannot promise that','说你不敢应承'),out:[{t:T('He nods, and takes your fare after all.','他点点头，还是收了你的船钱。'),c:'muted'}]}]});
STI('ferry','b',{tags:['af_travel','wander'],
 ctx:s=>{const c=stCtx(s,'ferry');c.v=pick([0,0,1,2]);c.lv=stFoe(s,.8,10);return c},
 text:c=>{const d=c.f.dau;return[T(`You find ${d.en} in ${c.f.place.en}, with three children and flour on her arms. At the sight of the comb she sits down on the doorstep and cannot speak.`,`你在${c.f.place.zh}找到了${d.zh}，带着三个孩子，胳膊上沾着面粉。一看见那把梳子，她就坐在门槛上说不出话了。`),
  T(`You find ${d.en} in ${c.f.place.en}. Her husband does not let her out of the house; the letters were never posted. She looks at the comb, then at the door.`,`你在${c.f.place.zh}找到了${d.zh}。她丈夫不许她出门，她写的信从来没寄出去过。她看看梳子，又看看门。`),
  T(`In ${c.f.place.en} you learn that ${d.en} died two winters ago. Her son, twelve, has her eyes, and asks who the comb is for.`,`在${c.f.place.zh}，你得知${d.zh}两年前的冬天就过世了。她儿子十二岁，眉眼像她，问你这梳子是给谁的。`)][c.v]},
 opts:[{l:T('Take back her letter','带上她的回信'),if:(s,c)=>c.v===0,out:[{t:T('She writes all night. The letter is very thick.','她写了一整夜。那封信厚厚的。'),c:'good',fx:{f:(s,c)=>stGo(s,'ferry','c',{v:0},[0,1])}}]},
  {l:T('Get her out of there','带她走'),if:(s,c)=>c.v===1,fight:(s,c)=>({foe:{name:T('the husband and his brothers','丈夫和他的兄弟们'),lv:c.lv,fixed:1},stakes:'light',title:T('The ferryman’s daughter','船夫的女儿'),cause:T('a family quarrel','人家的家务事')}),
   win:[{t:T('She walks out with one bundle and does not look back.','她只拿了一个包袱就走了，没回头。'),c:'good',fx:{align:3,f:(s,c)=>stGo(s,'ferry','c',{v:1,rescued:1},[0,1])}}],
   lose:[{t:T('You are thrown into the street. Through the window she mouths: tell him I am alive.','你被扔到了街上。隔着窗子，她用口型说：告诉他，我还活着。'),c:'muted',fx:{f:(s,c)=>stGo(s,'ferry','c',{v:1},[0,1])}}]},
  {l:T('Just take word back','只把话带回去'),if:(s,c)=>c.v===1,out:[{t:T('“Tell him I am well,” she says, which is not true.','“告诉他我很好。”她说。这不是真话。'),c:'muted',fx:{f:(s,c)=>stGo(s,'ferry','c',{v:1},[0,1])}}]},
  {l:T('Take the boy to his grandfather','带孩子去见外公'),if:(s,c)=>c.v===2,out:[{t:T('The boy’s father is long gone too. He packs in five minutes.','孩子的爹也早没了。他一会儿就收拾好了。'),c:'good',fx:{f:(s,c)=>stGo(s,'ferry','c',{v:2,boy:1},[0,1])}}]},
  {l:T('Go back with the news','带着噩耗回去'),if:(s,c)=>c.v===2,out:[{t:T('You keep the comb. You do not know what else to do with it.','你把梳子留着。不知道还能拿它怎么办。'),c:'muted',fx:{f:(s,c)=>stGo(s,'ferry','c',{v:2},[0,1])}}]}]});
STI('ferry','c',{tags:['wander','af_travel'],
 ctx:s=>{const c=stCtx(s,'ferry');c.late=s.age-c.r.at>4||chance(.12);return c},
 text:(c,s)=>{const f=c.f,w=f.who;if(c.late)return T(`The ferry has a new man on it. ${w.en} died last winter, still waiting, he says. There is a grave on the bank.`,`渡口换了个新船夫。他说${w.zh}去年冬天走了，到死都在等。河岸上有座坟。`);
  return f.rescued||f.boy?T(`${w.en} is at the ferry, as he said. He sees who is in the boat with you, and drops the pole.`,`${w.zh}果然还在渡口。他看见你船上坐着的人，篙子掉进了水里。`)
   :T(`${w.en} is at the ferry, as he said. You tell him everything.`,`${w.zh}果然还在渡口。你把一切都告诉了他。`)},
 opts:[{l:T('Bring them together','让他们相见'),if:(s,c)=>!c.late&&(c.f.rescued||c.f.boy),out:[{t:T('For a long time nobody needs a ferry. Afterwards, he never again takes your fare, anywhere on this river.','好长一阵子，谁也顾不上撑船。从此在这条河上，他再没收过你一文船钱。'),c:'gold',fx:{happy:12,align:3,meet:'friend',bond:85,f:(s,c)=>stEnd(s,'ferry','reunion')}}]},
  {l:T('Give him the letter, or the truth','把信，或者实话，交给他'),if:(s,c)=>!c.late&&!c.f.rescued&&!c.f.boy,out:[{t:c=>c.f.v===2?T('He takes it quietly. “Then I know. Knowing is better.”','他平静地听完了。“那我就知道了。知道总比不知道好。”'):T('He reads it on the bank, moving his lips.','他坐在岸边读信，嘴唇一动一动的。'),c:'good',fx:{happy:5,meet:'friend',bond:75,f:(s,c)=>stEnd(s,'ferry','kept')}}]},
  {l:T('Read the letter at his grave','在坟前把信念给他听'),if:(s,c)=>c.late,out:[{t:T('You read it aloud to the river. The new ferryman takes off his hat.','你对着河水把信念了出来。新船夫摘下了帽子。'),c:'bad',fx:{happy:-5,f:(s,c)=>stEnd(s,'ferry','toolate')}}]}]});

/* ===================== 诚信商人 · The Honest Merchant ===================== */
SDEF('merch',{n:T('The Honest Merchant','诚信商人'),theme:T('A merchant counts out too much silver. What you do with it travels further than you think.','商人多给了你银子。你怎么处置，会传得比你想的还远。'),
 ends:{partner:{n:T('Partners for life','一辈子的生意伙伴'),tone:'good'},warned:{n:T('A warning in time','及时的一句提醒'),tone:'good'},forgiven:{n:T('Mistake owned, mistake forgiven','认了错，也得了原谅'),tone:'good'},
  lost:{n:T('An honest loss','亏得明明白白'),tone:'mixed'},blacklisted:{n:T('No one will trade with you','没人肯跟你做买卖'),tone:'bad'},lapsed:{n:T('Two strangers again','又成了陌路'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Merchant ${r.facts.who.en} has not forgotten you. (Visit town or trade.)`,`商人${r.facts.who.zh}没忘了你。（下一步：进城或做买卖）`),c:(s,r)=>T(`Your dealings with ${r.facts.who.en} are not finished.`,`你跟${r.facts.who.zh}的生意还没了结。`)}});
SOPEN('merch',{age:[16,65],w:2,tags:['town'],when:s=>s.age>=16,
 ctx:s=>({npc:npc(s,{occ:pick([5,23,17]),sex:'m',age:rint(35,55)}),amt:rint(20,40)}),
 text:c=>T(`Paying you for some goods, the merchant ${c.npc.en} counts out ${c.amt} taels too many. He is busy shouting at a porter and does not notice.`,`商人${c.npc.zh}付你货钱，多数了${c.amt}两。他正忙着吼一个挑夫，没察觉。`),
 opts:[{l:T('Point out the mistake','提醒他数错了'),out:[{t:T('He stares at you, then at the silver, then laughs. “Where are you from? I want to remember.”','他瞪着你，又瞪着银子，然后笑了。“你是哪里人？我得记住你。”'),c:'good',fx:{align:2,f:(s,c)=>stBegin(s,'merch',c,'b',{who:nmOf(c.npc.n),honest:1},[1,3])}}]},
  {l:T('Pocket it quietly','悄悄揣进兜里'),out:[{t:T('A good day.','今天运气不错。'),c:'muted',fx:{f:(s,c)=>{pay(s,c.amt);stBegin(s,'merch',c,'b',{who:nmOf(c.npc.n),kept:1,amt:c.amt},[1,2])}}}]},
  {l:T('Claim he still owes you more','反说他还少给了'),out:[{t:T('Flustered, he pays again. A boy sweeping the shop watches the whole thing.','他一慌，又付了一遍。扫地的伙计从头看到了尾。'),c:'bad',fx:{align:-4,f:(s,c)=>{pay(s,c.amt*2);stBegin(s,'merch',c,'b',{who:nmOf(c.npc.n),cheat:1},[1,2])}}}]}]});
STI('merch','b',{tags:['town','af_trade','af_peddle'],self:1,
 text:c=>{const w=c.f.who;return c.f.honest?T(`${w.en} finds you. He has a venture on the southern salt route and wants one partner he does not have to watch.`,`${w.zh}找上门来。他要做一趟南路的盐生意，想找个不用提防的合伙人。`)
  :c.f.kept?T(`${w.en} finds you. His books came up short by exactly the sum he overpaid you. He asks, quite calmly, whether you noticed.`,`${w.zh}找上门来。他的账正好短了多给你的那个数。他很平静地问你，当时有没有察觉。`)
  :T(`Word has gone round: the shop boy talked. In this town, merchants put their hands over their scales when you come in.`,`消息传开了：那个伙计说出去了。在这座城里，你一进门，商家都用手捂住秤。`)},
 opts:[{l:T('Invest with him (100 taels)','入一股（一百两）'),if:(s,c)=>c.f.honest,cost:100,out:[{t:T('You shake on it. No paper.','你们击掌为誓，没立字据。'),c:'good',fx:{f:(s,c)=>stGo(s,'merch','c',{invested:1},[2,4])}}]},
  {l:T('Decline kindly, but keep in touch','婉拒，但常来往'),if:(s,c)=>c.f.honest,out:[{t:T('He is disappointed and sends you a jar of good tea anyway.','他有点失望，还是送了你一罐好茶。'),c:'good',fx:{meet:'friend',bond:60,f:(s,c)=>stGo(s,'merch','c',{friend:1},[2,4])}}]},
  {l:T('Admit it and give it back','承认，把钱还给他'),if:(s,c)=>c.f.kept,out:[{t:T('He takes it back and, after a moment, offers you a drink.','他收了回去，顿了一下，请你喝了一杯。'),c:'good',fx:{f:(s,c)=>{pay(s,-(c.f.amt||30));stEnd(s,'merch','forgiven')}}}]},
  {l:T('Say you noticed nothing','说没注意到'),if:(s,c)=>c.f.kept,out:[{t:T('He nods slowly. He does not believe you.','他慢慢点了点头。他不信。'),c:'muted',fx:{f:(s,c)=>stGo(s,'merch','c',{denied:1},[2,4])}}]},
  {l:T('Make amends: repay him double','补救：加倍还他'),if:(s,c)=>c.f.cheat,out:[{w:2,t:T('It takes a year of good behaviour, but the scales come uncovered.','你规规矩矩了一年，商家们的秤终于不捂了。'),c:'good',fx:{money:-80,align:3,f:(s,c)=>stEnd(s,'merch','forgiven')}},{w:1,t:T('He takes the money. The town does not forget.','钱他收了。城里人可没忘。'),c:'muted',fx:{money:-80,f:(s,c)=>stGo(s,'merch','c',{denied:1},[1,3])}}]},
  {l:T('Stare them down','不理，照样横着走'),if:(s,c)=>c.f.cheat,out:[{t:T('You stare them down. They raise their prices.','你瞪回去。他们就涨价。'),c:'bad',fx:{f:(s,c)=>stGo(s,'merch','c',{denied:1},[1,3])}}]}]});
STI('merch','c',{tags:['town','af_trade','wander'],self:1,
 text:c=>{const w=c.f.who;return c.f.invested?T(`News from the salt route. ${w.en} comes in person, which means it is either very good or very bad.`,`盐路上来了消息。${w.zh}亲自登门，不是大好就是大坏。`)
  :c.f.friend?T(`A boy brings a note from ${w.en}: “Do not take the river road this month. Trust me.”`,`一个小伙计送来${w.zh}的字条：“这个月别走水路。信我。”`)
  :T(`In a town three hundred li away, a merchant you have never met refuses to sell to you. He has heard about you from ${w.en}'s shop boy, who has a cousin here.`,`在三百里外的一个城里，一个素不相识的商人不肯卖东西给你。他从${w.zh}那个伙计那儿听说过你：伙计的表哥就在这儿。`)},
 opts:[{l:T('Hear him out','听他说'),if:(s,c)=>c.f.invested,out:[{w:s=>2+s.t.luck*.2,t:T('Three times what you put in, and he has already found the next route.','赚了三倍，而且他已经找好了下一条路子。'),c:'gold',fx:{money:[250,380],meet:'friend',bond:80,f:(s,c)=>stEnd(s,'merch','partner')}},
   {w:1,t:T('His partner ran off with the takings. He pays you back every tael out of his own purse, and apologises.','他的合伙人卷了钱跑了。他自掏腰包，一文不少地还了你，还赔了不是。'),c:'muted',fx:{money:100,meet:'friend',bond:85,f:(s,c)=>stEnd(s,'merch','lost')}}]},
  {l:T('Take his advice','听他的'),if:(s,c)=>c.f.friend,out:[{t:T('That month, river pirates take every boat on the lower river.','那个月，下游的船全被水匪劫了。'),c:'gold',fx:{bond:10,f:(s,c)=>stEnd(s,'merch','warned')}}]},
  {l:T('Go elsewhere','换个地方买'),if:(s,c)=>!c.f.invested&&!c.f.friend,out:[{t:T('Everything costs you a little more from now on.','往后买什么都要贵上几分。'),c:'bad',fx:{money:[-60,-25],fame:-1,f:(s,c)=>stEnd(s,'merch','blacklisted')}}]}]});

/* ===================== 冒名 · The Borrowed Name ===================== */
SDEF('name',{n:T('The Borrowed Name','冒名'),theme:T('Someone is committing crimes under your name. Finding them is the easy part.','有人借你的名号作恶。找到这个人还算容易，难的是之后。'),
 ends:{cleared:{n:T('Name cleared','洗清了名声'),tone:'good'},ally:{n:T('The impostor became your man','冒名的人成了你的人'),tone:'good'},rival:{n:T('A rival who wears your name','顶着你名号的对头'),tone:'bad'},
  rumour:{n:T('A rumour that never quite dies','总也散不尽的流言'),tone:'mixed'},lapsed:{n:T('A rumour that never quite dies','总也散不尽的流言'),tone:'mixed'}},
 hint:{b:T('Someone is using your name. Find out who. (Visit town or roam.)','有人冒你的名。查出是谁。（下一步：进城或游历）'),c:T('You have a trail. Follow it. (Roam or travel.)','有线索了，追下去。（下一步：游历或远行）')},
 exp:8,lapseF:(s,r)=>{say(s,'You never find the one who used your name. For years, strangers look at you oddly.','你始终没找到冒名的人。好些年里，陌生人看你的眼神都怪怪的。','muted');s.fame=Math.max(0,s.fame-3);stEnd(s,'name','rumour')}});
SOPEN('name',{age:[20,70],w:3,tags:['town'],when:s=>s.fame>=25,
 ctx:s=>({crime:pick([T('robbed a pawnshop','抢了当铺'),T('beaten a constable half to death','把一个捕快打得半死'),T('run off with a temple’s donations','卷走了寺庙的香火钱')])}),
 text:(c,s)=>T(`A notice on the city wall: “${s.name}, wanted. Has ${c.crime.en}.” You were nowhere near. Someone is wearing your name.`,`城墙上贴着告示：“缉拿${s.cn}。此人${c.crime.zh}。”你压根不在那儿。有人在冒你的名。`),
 opts:[{l:T('Go to the yamen and protest','去衙门喊冤'),out:[{w:s=>1+s.smarts/40,t:T('The clerk believes you, roughly. He takes the notice down, mostly.','书办大致信了你，告示也大致撕了。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'name',c,'b',{crime:c.crime},[0,1])}},{w:1,t:T('They decide the simplest thing is to hold you instead.','他们觉得最省事的办法，就是先把你扣下。'),c:'bad',fx:{wanted:1,f:(s,c)=>stBegin(s,'name',c,'b',{crime:c.crime},[0,1])}}]},
  {l:T('Find the impostor yourself','自己去找这个冒名的'),out:[{t:T('You tear the notice down and fold it into your sleeve.','你把告示撕下来，叠好塞进袖子。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'name',c,'b',{crime:c.crime,hunt:1},0)}}]},
  {l:T('Ignore it. It will blow over','不理，过阵子就没事了'),out:[{t:T('It does not blow over.','并没有过去。'),c:'bad',fx:{wanted:1,fame:-2,f:(s,c)=>stBegin(s,'name',c,'b',{crime:c.crime,ignored:1},[1,2])}}]}]});
STI('name','b',{tags:['town','wander'],
 ctx:s=>{const c=stCtx(s,'name');c.wit=npc(s,{occ:pick([6,26,18])});return c},
 text:c=>T(`${c.wit.en}, ${c.wit.desc.en}, saw “you” the night it happened. “Younger than you. A scar through one eyebrow. Used your name loudly, as if he wanted to be heard.” ${c.wit.He} knows which way he went.`,`${c.wit.zh}，${c.wit.desc.zh}，那晚见过“你”。“比你年轻，一边眉毛上有道疤。把你的名字喊得震天响，像是生怕别人听不见。”${c.wit.ta}知道那人往哪儿去了。`),
 opts:[{l:T('Pay them to testify later (30 taels)','给钱，请对方日后作证（三十两）'),cost:30,out:[{t:T('They promise. They seem to mean it.','对方答应了，看样子是真心的。'),c:'good',fx:{f:(s,c)=>stGo(s,'name','c',{witness:1},[0,1])}}]},
  {l:T('Thank them and follow the trail','道谢，顺着线索追下去'),out:[{t:T('East, then. You go east.','那就往东。你往东去了。'),c:'muted',fx:{f:(s,c)=>stGo(s,'name','c',{},[0,1])}}]}]});
STI('name','c',{tags:['wander','af_travel'],
 ctx:s=>{const c=stCtx(s,'name');c.v=chance(.55)?0:1;const n=genName('m');c.imp=T(n.py,n.cn);c.lv=c.v?stFoe(s,1,12):stFoe(s,.5,5);return c},
 text:c=>c.v===0?T(`You find him in a ruined temple: ${c.imp.en}, nineteen, with two little sisters asleep behind him. “Nobody pays a nobody. Your name opened doors.”`,`你在一座破庙里找到了他：${c.imp.zh}，十九岁，身后睡着两个小妹妹。“没人给无名小卒饭吃。你的名字能敲开门。”`)
  :T(`You find him at an inn, holding court: ${c.imp.en}, who lost to you once, years ago, and has hated you since. “I wanted them to see what you really are.”`,`你在一家客栈里找到了他：${c.imp.zh}，多年前输给过你，从此就恨上了你。他正高谈阔论。“我就是要让他们看看，你到底是什么货色。”`),
 opts:[{l:T('Drag him to the yamen','押去衙门'),if:(s,c)=>c.v===0,out:[{t:T('Your name is cleared. You try not to think about the sisters.','你的名声洗清了。你尽量不去想那两个小妹妹。'),c:'muted',fx:{f:(s,c)=>{s.wanted=Math.max(0,s.wanted-1);stEnd(s,'name','cleared')}}}]},
  {l:T('Pay his debts and give him honest work','替他还债，给他找份正经活'),if:(s,c)=>c.v===0,out:[{t:T('He takes the work. Years later, he is the most loyal man you know.','他接了活。多年以后，他是你认识的人里最靠得住的一个。'),c:'gold',fx:{money:-60,align:4,f:(s,c)=>{c.npc=npc(s,{name:genName('m'),sex:'m',age:19,occ:28});applyFx(s,{meet:'friend',bond:80},c);if(c.f.witness||chance(.6))s.wanted=Math.max(0,s.wanted-1);stEnd(s,'name','ally')}}}]},
  {l:T('Unmask him in front of everyone','当众揭穿'),if:(s,c)=>c.v===1,fight:(s,c)=>({foe:{name:c.imp,lv:c.lv,fixed:1},stakes:'injury',title:T('The real one','真的那一个'),cause:T('a fight with an impostor','与冒名者一战')}),
   win:[{t:T('The whole inn watched. By morning, the whole county knows which one was the real one.','整个客栈都看见了。第二天一早，全县都知道哪个才是真的。'),c:'gold',fx:{fame:3,f:(s,c)=>{s.wanted=Math.max(0,s.wanted-(c.f.witness?2:1));stEnd(s,'name','cleared')}}}],
   lose:[{t:T('He wins, wearing your name. The story goes round that you beat yourself.','他赢了，顶着你的名字赢的。外头都传你自己把自己打败了。'),c:'bad',fx:{fame:-4,f:(s,c)=>stEnd(s,'name','rival')}}]},
  {l:T('Let him be','由他去'),if:(s,c)=>c.v===1,out:[{t:T('He keeps using your name, here and there, for years.','此后好些年，他时不时还在冒你的名。'),c:'bad',fx:{fame:-2,f:(s,c)=>stEnd(s,'name','rival')}}]}]});

/* ===================== 传家之物 · The Family Keepsake ===================== */
SDEF('keep',{n:T('The Family Keepsake','传家之物'),theme:T('An object hidden in your family’s chest, and the half-truths around it.','藏在家里箱底的一件东西，和围绕着它的半真半假。'),
 ends:{legacy:{n:T('A forebear’s lost art','先人留下的武功'),tone:'good'},sold:{n:T('Sold for silver','换了银子'),tone:'mixed'},betrothed:{n:T('A childhood promise kept','娃娃亲成了真'),tone:'good'},
  released:{n:T('A childhood promise returned','娃娃亲退了'),tone:'mixed'},collected:{n:T('The debt collected','债收回来了'),tone:'mixed'},forgave:{n:T('The debt forgiven','债一笔勾销'),tone:'good'},lapsed:{n:T('Some things stay unknown','有些事终究不得而知'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Nobody will tell you about the ${KEEP_S[r.facts.v].en}. Yet.`,`那${KEEP_S[r.facts.v].zh}的来历，还没人肯告诉你。`),c:(s,r)=>[T('Find the place the token belongs to. (Roam or travel.)','去找那块令牌所属的地方。（下一步：游历或远行）'),T('Find the family that holds the other half. (Visit town or travel.)','去找拿着另一半的那户人家。（下一步：进城或远行）'),T('Find the family named in the note. (Visit town or travel.)','去找借据上写的那户人家。（下一步：进城或远行）')][r.facts.v]},exp:14});
const KEEP_OBJ=[T('an iron token with a sect mark nobody uses any more','一块刻着早已没人用的门派记号的铁令牌'),T('half of a jade pendant, broken clean down the middle','半块玉佩，从正中齐齐断开'),T('a locked lacquer box','一只上了锁的漆盒')];
const KEEP_S=[T('iron token','铁令牌'),T('half pendant','半块玉佩'),T('lacquer box','漆盒')];
SOPEN('keep',{age:[10,18],w:3,
 ctx:s=>{const v=rint(0,2),par=living(s,['father','mother'])[0];return{v,obj:KEEP_OBJ[v],par:par?relLabel(s,par):null}},
 text:c=>c.par?T(`At the bottom of a chest you find ${c.obj.en}. When you ask your ${c.par.en.toLowerCase()}, they go quiet and say: later.`,`你在箱底翻出${c.obj.zh}。问${c.par.zh}，${c.par.zh}沉默了半天，只说：以后再告诉你。`)
  :T(`Among the few things that came with you as a baby is ${c.obj.en}. Nobody has ever explained it.`,`你襁褓里带来的那点东西里，有${c.obj.zh}。从来没人跟你说过它的来历。`),
 opts:[{l:T('Keep asking','追着问'),out:[{t:T('You are told to stop asking. You do not stop.','大人叫你别问了。你偏不。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'keep',c,'b',{v:c.v,obj:c.obj},[2,5])}}]},
  {l:T('Take it and keep it hidden','偷偷收起来'),out:[{t:T('It lives under your pillow from now on.','从此它就压在你的枕头底下。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'keep',c,'b',{v:c.v,obj:c.obj,hid:1},[3,6])}}]},
  {l:T('Put it back','放回去'),out:[{t:T('Some things are not yours to open.','有些东西不该你去打开。'),c:'muted'}]}]});
STI('keep','b',{self:1,
 ctx:s=>{const c=stCtx(s,'keep');const g=living(s,['grandparent','father','mother','master']);c.who=g.length?relLabel(s,g[0]):T('an old neighbour','一个老街坊');const n=genName(chance(.5)?'m':'f');c.fam=T(n.py.split(' ')[0],n.cn[0]);const pl=pick(REGIONS);c.place=T(pl.en,pl.cn);return c},
 text:c=>[T(`Late one night, your ${c.who.en.toLowerCase()} tells you part of it: one of your forebears was a disciple of a sect wiped out fifty years ago. The token opens a place in ${c.place.en} where he hid what was left.`,`一天深夜，${c.who.zh}告诉了你一部分：你家一位先人，是五十年前被灭门的一个门派的弟子。这块令牌，能打开他在${c.place.zh}藏东西的地方。`),
  T(`Your ${c.who.en.toLowerCase()} finally tells you: before you were born, you were promised to a child of the ${c.fam.en} family, and they hold the other half of the pendant.`,`${c.who.zh}终于说了：你还没出生，就跟${c.fam.zh}家的孩子定了亲。另一半玉佩在他们家。`),
  T(`The box holds a note of debt: the ${c.fam.en} family borrowed a fortune from yours, long ago, and never paid. The note is still good.`,`盒子里是一张借据：很多年前，${c.fam.zh}家向你家借了一大笔钱，一直没还。借据还作数。`)][c.f.v],
 opts:[{l:T('Go and find out the rest','去弄个明白'),out:[{t:T('You make up your mind to go.','你打定主意要去。'),c:'muted',fx:{f:(s,c)=>stGo(s,'keep','c',{fam:c.fam,place:c.place},[1,3])}}]},
  {l:T('Sell the thing','把东西卖了'),if:(s,c)=>c.f.v!==2,out:[{t:T('A collector pays well, and asks where you got it.','一个藏家出了好价钱，还问你东西是哪来的。'),c:'muted',fx:{money:[60,140],f:(s,c)=>stEnd(s,'keep','sold')}}]}]});
STI('keep','c',{tags:['wander','af_travel','town'],
 ctx:s=>{const c=stCtx(s,'keep');c.rich=chance(.5);return c},
 text:c=>{const f=c.f;return[T(`Behind a waterfall in ${f.place.en}, the token fits a stone slot. Inside: a sealed jar, a dead man’s robe, and a manual wrapped in oilcloth.`,`在${f.place.zh}一道瀑布后面，令牌正好嵌进石槽。里面有一只封好的坛子、一件死人的长袍，还有一本用油布裹着的秘籍。`),
  T(`You find the ${f.fam.en} family. They are ${c.rich?'rich now, and nervous to see you':'poor now, and ashamed to see you'}. Their child, grown, has the other half of the pendant on a cord.`,`你找到了${f.fam.zh}家。他们${c.rich?'如今富了，见了你有些不安':'如今穷了，见了你有些难为情'}。他家孩子已经长大了，脖子上挂着另一半玉佩。`),
  T(`You find the ${f.fam.en} family. They are ${c.rich?'rich, and would rather the note did not exist':'very poor, and the note would ruin them'}.`,`你找到了${f.fam.zh}家。他们${c.rich?'家大业大，巴不得那张借据不存在':'穷得叮当响，那张借据能要了他们的命'}。`)][f.v]},
 opts:[{l:T('Study the manual','研读秘籍'),if:(s,c)=>c.f.v===0,out:[{t:T('A forebear’s hand is in the margins.','页边是先人的笔迹。'),c:'gold',fx:(s,c)=>({art:{n:'Family Lost Art',cn:'祖传绝学',tier:s.t.wit>=6?2:1,sk:pick(['jianqi','dianxue','neishang'])},f:(s,c)=>stEnd(s,'keep','legacy')})}]},
  {l:T('Honour the promise','认下这门亲'),if:(s,c)=>c.f.v===1&&!spouseOf(s),out:[{t:T('Two halves of a pendant, finally on one table.','两半玉佩，终于放在了同一张桌上。'),c:'gold',fx:(s,c)=>{c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:s.age+rint(-3,3),name:genName(s.gender==='m'?'f':'m',[c.f.fam.zh,c.f.fam.en])});return{meet:'lover',bond:70,happy:6,f:(s,c)=>stEnd(s,'keep','betrothed')}}}]},
  {l:T('Return their half of the promise','把婚约退了'),if:(s,c)=>c.f.v===1,out:[{t:T('Everyone is a little relieved, and a little sorry.','大家都松了口气，也都有点惋惜。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'keep','released')}}]},
  {l:T('Collect the debt','收债'),if:(s,c)=>c.f.v===2,out:[{t:(c)=>c.rich?T('They pay, coldly.','他们冷着脸付了。'):T('They sell their land to pay.','他们卖了地来还。'),c:'muted',fx:(s,c)=>({money:c.rich?[300,500]:[80,140],align:c.rich?0:-5,f:(s,c)=>stEnd(s,'keep','collected')})}]},
  {l:T('Burn the note in front of them','当着他们的面烧了借据'),if:(s,c)=>c.f.v===2,out:[{t:T('Three generations of a family bow to you.','一家三代人向你行礼。'),c:'gold',fx:{align:5,fame:2,meet:'friend',bond:70,f:(s,c)=>stEnd(s,'keep','forgave')}}]}]});

/* ===================== 退隐之人 · The Old Man Next Door ===================== */
SDEF('hermit',{n:T('The Old Man Next Door','退隐之人'),theme:T('The old farmer next door is someone the jianghu thinks is dead. Only patience gets anything out of him.','隔壁种地的老头，是江湖上以为早就死了的人。只有沉得住气，才能从他那儿学到东西。'),
 ends:{taught:{n:T('The last student of a dead legend','一代传奇的关门弟子'),tone:'good'},friend:{n:T('Just two old neighbours','就是两个老邻居'),tone:'good'},refused:{n:T('The door closed','门关上了'),tone:'mixed'},
  exposed:{n:T('You gave him away','是你泄露了他'),tone:'bad'},lapsed:{n:T('He moved on one night','他在一个夜里搬走了'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Old ${r.facts.who.en} next door is testing your patience. (Practise.)`,`隔壁的${r.facts.who.zh}老头在磨你的性子。（下一步：练功）`),c:(s,r)=>T(`Old ${r.facts.who.en} has something to tell you.`,`${r.facts.who.zh}老头有话要跟你说。`)},
 gone:(s,r,p)=>{say(s,`Old ${p.n.py} dies in his sleep, his secret with him.`,`${p.n.cn}老头在睡梦中走了，带走了他的秘密。`,'muted');stEnd(s,'hermit','lapsed')}});
SOPEN('hermit',{age:[15,50],w:2.5,tags:['wander','town'],when:s=>power(s)>=8,
 ctx:s=>({npc:npc(s,{occ:19,sex:'m',age:rint(70,82),lv:rint(220,280)}),ep:pick([T('the Withered Branch Sword','枯枝剑'),T('the Hundred-Li Palm','百里掌'),T('the Ghost of the Northern Pass','北关鬼影')])}),
 text:c=>T(`Your new neighbour, old ${c.npc.en}, splits firewood with one tap of the axe, along the grain, every time. Once you saw him catch a falling roof tile without looking up.`,`新邻居${c.npc.zh}老头劈柴，斧子轻轻一碰，木头就顺着纹裂开，回回如此。有一次你还看见他头也不抬，就接住了一片掉下来的瓦。`),
 opts:[{l:T('Ask him to teach you','求他教你'),out:[{t:T('He laughs at you, and asks if you know anything about turnips.','他笑你，问你懂不懂种萝卜。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'hermit',c,'b',{who:nmOf(c.npc.n),ep:c.ep},[0,1])}}]},
  {l:T('Say nothing, help with his fields','什么也不说，去帮他种地'),out:[{t:T('He lets you, without comment.','他由着你，一句话也没说。'),c:'good',fx:{f:(s,c)=>stBegin(s,'hermit',c,'b',{who:nmOf(c.npc.n),ep:c.ep,quiet:1},[0,1])}}]},
  {l:T('Tell your friends about the strange old man','跟朋友们讲这个怪老头'),out:[{t:T('It makes a good story at the teahouse.','在茶馆里，这是个好段子。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'hermit',c,'b',{who:nmOf(c.npc.n),ep:c.ep,talked:1},[0,1])}}]}]});
STI('hermit','b',{tags:['af_practice','af_meditate'],self:1,
 text:c=>T(`Old ${c.f.who.en} hands you two buckets. “The well is at the bottom of the hill. The jar is at the top. Fill it.” The jar has a crack in it.${c.f.tries?' He has given you this chore before.':''}`,`${c.f.who.zh}老头递给你两只桶。“井在山脚，缸在山顶。挑满它。”那口缸是裂的。${c.f.tries?'这活他之前也叫你干过。':''}`),
 opts:[{l:T('Carry water, without complaint, for as long as it takes','一声不吭地挑，挑到哪天算哪天'),out:[{w:s=>s.t.heart,t:T('A season. Then one morning the crack has been mended, and he is waiting at the top.','挑了一季。有一天早上，缸上的裂缝补好了，他在山顶等你。'),c:'gold',fx:{maxHealth:3,f:(s,c)=>stGo(s,'hermit','c',{passed:1},[0,1])}},
   {w:s=>11-s.t.heart,t:T('After a month you lose your temper and kick the jar. He watches, and goes back to his turnips.','挑了一个月，你发了火，一脚踢翻了缸。他看着，又回去种萝卜了。'),c:'muted',fx:{f:(s,c)=>{const t=(c.f.tries||0)+1;if(t>=2)stEnd(s,'hermit','refused',{tries:t});else stGo(s,'hermit','b',{tries:t},[1,2])}}}]},
  {l:T('Ask what the point is','问这有什么用'),out:[{t:T('“None,” he says, and goes inside.','“没用。”他说完就进屋了。'),c:'muted',fx:{f:(s,c)=>{const t=(c.f.tries||0)+1;if(t>=2)stEnd(s,'hermit','refused',{tries:t});else stGo(s,'hermit','b',{tries:t},[1,2])}}}]}]});
STI('hermit','c',{self:1,
 ctx:s=>{const c=stCtx(s,'hermit');c.lv=stFoe(s,1.1,20);return c},
 text:c=>c.f.talked?T(`Strangers in good boots have been asking about old ${c.f.who.en} at the teahouse, using a name the jianghu has not said in forty years: ${c.f.ep.en}. Tonight, they come over the wall.`,`茶馆里来了几个穿好靴子的生人，打听${c.f.who.zh}老头，嘴里说的是一个江湖上四十年没人提过的名号：${c.f.ep.zh}。今夜，他们翻墙进来了。`)
  :T(`Old ${c.f.who.en} pours two cups. “Forty years ago they called me ${c.f.ep.en}. I came here to stop being him. But it would be a waste to take it all into the ground.”`,`${c.f.who.zh}老头倒了两杯酒。“四十年前，他们叫我${c.f.ep.zh}。我来这儿，就是为了不再做他。可要全带进土里，也可惜了。”`),
 opts:[{l:T('Fight beside him','跟他并肩迎敌'),if:(s,c)=>c.f.talked,fight:(s,c)=>({foe:{name:T('the men in good boots','穿好靴子的人'),lv:c.lv,fixed:1},stakes:'injury',title:T('An old man’s old enemies','老人的旧仇'),cause:T('an old man’s old enemies','老人的旧仇')}),
   win:[{t:T('Afterwards he looks at you for a long time. “You talked. And you came back. Sit down.” He teaches you until dawn.','打完了，他看了你很久。“是你说出去的。可你也回来了。坐吧。”他教了你一整夜。'),c:'gold',fx:(s,c)=>({art:{n:c.f.ep.en.replace(/^the /,''),cn:c.f.ep.zh,tier:2,sk:pick(['jianqi','kuaijian','neishang'])},f:(s,c)=>stEnd(s,'hermit','taught')})}],
   lose:[{t:T('When you wake, the house next door is burned, and he is gone.','你醒来时，隔壁的屋子烧了，老人也不见了。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'hermit','exposed')}}]},
  {l:T('Learn from him','跟他学'),if:(s,c)=>!c.f.talked,out:[{t:T('He teaches you one thing, slowly, all winter. It is enough.','他教了你一样东西，教了一整个冬天，慢慢地。这就够了。'),c:'gold',fx:(s,c)=>({art:{n:c.f.ep.en.replace(/^the /,''),cn:c.f.ep.zh,tier:2,sk:pick(['jianqi','kuaijian','neishang'])},meet:'master',bond:75,f:(s,c)=>stEnd(s,'hermit','taught')})}]},
  {l:T('Say you would rather just keep him company','说你只想陪陪他'),if:(s,c)=>!c.f.talked,out:[{t:T('He laughs, really laughs, for the first time. You drink until the jar is empty.','他头一回真心大笑起来。你们一直喝到酒坛见底。'),c:'good',fx:{happy:10,meet:'friend',bond:85,f:(s,c)=>stEnd(s,'hermit','friend')}}]}]});
