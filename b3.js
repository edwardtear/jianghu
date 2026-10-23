/* 江湖一生 · content batch 3: what a life leaves behind. When you go on as your child, the heir now carries a record
   of the parent (friends, deeds, people helped and wronged, debts owed, unfinished stories), and the world remembers.
   Also new late-life scenes that the earlier ones did not cover. The two stories that can pass to an heir are in st7.js. */
'use strict';
const B3=d=>{d.w=d.w??2;d.cd=d.cd??12;if(typeof d.text!=='function'){const t=d.text;d.text=()=>t}I(d)};

/* ---------- the legacy record, made when the heir takes over ---------- */
const pcopy=p=>({n:{cn:p.n.cn,py:p.n.py,sur:p.n.sur},sex:p.sex,age:p.age,lv:p.lv,trait:p.trait,occ:p.occ,bond:p.bond,rel:p.rel});
const memCopy=r=>({n:r.who&&r.who.n?{cn:r.who.n.cn,py:r.who.n.py,sur:r.who.n.sur||['','']}:null,sex:(r.who&&r.who.sex)||'m',occ:r.who?r.who.occ:null,age:r.who?r.who.age:30,at:r.at,reg:r.reg,what:r.what,yrs:0});
function legacyOf(prev){const L={cn:prev.cn,py:prev.name,sex:prev.gender,age:prev.age,nick:prev.nick||null,fame:prev.fame,align:prev.align,gen:prev.gen||1,region:prev.region,
  cause:prev.cause||null,deeds:(prev.deeds||[]).slice(-4),arts:(prev.arts||[]).map(a=>({n:a.n,cn:a.cn,tier:a.tier})),sect:prev.sect||prev.flags.formerSect||null,
  friends:prev.people.filter(p=>p.alive&&['friend','sworn','disciple','fellow'].includes(p.rel)&&p.bond>=50&&p.age>=20).sort((a,b)=>b.bond-a.bond).slice(0,3).map(pcopy),
  helped:(prev.mem||[]).filter(r=>r.kind==='helped'&&r.who&&r.who.n).slice(-6).map(memCopy),wronged:(prev.mem||[]).filter(r=>r.kind==='wronged'&&r.who&&r.who.n).slice(-6).map(memCopy),
  stories:Object.keys(prev.story||{}).filter(k=>prev.story[k].st==='on'&&STORY[k]).map(k=>({id:k,stage:prev.story[k].stage,facts:Object.assign({},prev.story[k].facts),who:prev.story[k].who||null,next:prev.story[k].next})),
  manual:prev.flags.b3_manual!=null?prev.b3manual||null:null,letter:prev.flags.b3_letter!=null,prev:prev.legacy?{cn:prev.legacy.cn,py:prev.legacy.py,sex:prev.legacy.sex}:null};
  return L}
(()=>{const h0=heirLife;heirLife=function(prev,pid){const s=h0.apply(this,arguments);if(!s)return s;s.legacy=legacyOf(prev);s.people.forEach(p=>{if(p.rel==='enemy')p.inherited=1});
  /* money owed to the parent is now owed to you */
  const owed=(prev.loans||[]).map(x=>Object.assign({},x,{due:s.age+Math.max(0,x.due-prev.age)}));
  if(owed.length){s.loans=owed;const t=owed.reduce((a,x)=>a+x.amt,0);const E=s.log[s.log.length-1];
    if(E)E.lines.splice(1,0,{t:T(`People still owe the family ${t} taels from loans your parent made. Those debts are yours to collect now.`,`当年${prev.gender==='m'?'父亲':'母亲'}借出去的钱，还有${t}两没收回来。这些债，如今归你收了。`),c:'muted'})}
  return s}})();
const LG=s=>s.legacy;
const parW=s=>s.legacy.sex==='m'?T('your father','父亲'):T('your mother','母亲');
const parN=s=>T(s.legacy.py,s.legacy.cn);
const fromRec=(s,r,o)=>{const c=npc(s,Object.assign({sex:r.sex,occ:r.occ,age:Math.min(88,(r.age||30)+Math.max(0,(s.legacy.age||50)-(r.at||0))+2)},o||{}));if(r.n){c.n=r.n;c.en=r.n.py;c.zh=r.n.cn}return c};

/* ---------- the heir’s world remembers ---------- */
B3({id:'h3_friend',age:[14,40],once:1,w:3,when:s=>LG(s)&&LG(s).friends.length>0,
 ctx:s=>{const f=LG(s).friends[0];const c=npc(s,{sex:f.sex,occ:f.occ,age:f.age+2,lv:f.lv});c.n=f.n;c.en=f.n.py;c.zh=f.n.cn;return{npc:c,pw:parW(s),pn:parN(s),rel:f.rel}},
 text:c=>T(`${c.npc.en}, ${c.rel==='sworn'?'who swore brotherhood with':c.rel==='disciple'?'who was a disciple of':'who was a close friend of'} ${c.pw.en}, comes to the house in mourning white. ${cap(c.npc.he)} looks at you for a long time. “You have ${c.pw.en.replace('your ','')}’s way of standing.”`,`${c.npc.zh}穿着孝服来到家里。${c.rel==='sworn'?`${c.npc.ta}和${c.pw.zh}拜过把子`:c.rel==='disciple'?`${c.npc.ta}是${c.pw.zh}的徒弟`:`${c.npc.ta}是${c.pw.zh}最要好的朋友`}。${c.npc.ta}看了你很久。"你站着的样子，跟你${c.pw.zh==='父亲'?'爹':'娘'}一模一样。"`),
 opts:[{l:T('Ask about your parent when young','问问爹娘年轻时的事'),out:[{t:c=>T(`${c.npc.en} stays three days and tells you things nobody else alive knows. Some of them you will never repeat. Before leaving, ${c.npc.he} says: “Whatever you need. I owed ${c.pn.en} more than once.”`,`${c.npc.zh}住了三天，讲了些世上再没别人知道的事，有几件你一辈子都不会往外说。临走时说："有什么事，尽管来找我。我欠${c.pn.zh}的，不止一回。"`),c:'good',fx:{meet:'friend',bond:70,happy:4}}]},
  {l:T('Ask to be taught what they taught each other','求教当年他们俩切磋出来的功夫'),out:[{t:c=>T(`${c.npc.en} laughs, a little wet-eyed, and shows you a move the two of them worked out one drunk night thirty years ago. It is a very good move.`,`${c.npc.zh}笑了，眼眶有点红，教了你一招：三十年前一个喝醉的晚上，他们俩琢磨出来的。是很好的一招。`),c:'gold',fx:{skill:2,meet:'friend',bond:65}}]},
  {l:T('Thank them politely','客客气气地道谢'),out:[{t:c=>T(`${c.npc.en} understands. Grief is not something you share with strangers. ${cap(c.npc.he)} leaves an address.`,`${c.npc.zh}明白。伤心事，不是跟生人说的。${c.npc.ta}留下了一个住处。`),c:'muted',fx:{meet:'acq',bond:55}}]}]});
B3({id:'h3_grave',age:[14,90],cd:15,w:2.2,when:s=>!!LG(s)&&s.jail<=0,
 ctx:s=>({v:LG(s).align>=20?0:LG(s).align<=-25?1:2,pw:parW(s)}),
 text:c=>[T(`At Qingming you go to sweep ${c.pw.en}’s grave and find someone has been there first: incense still burning, a bowl of rice, a pair of straw sandals, and no name.`,`清明去给${c.pw.zh}扫墓，发现已经有人先来过了：香还燃着，一碗饭，一双草鞋，没留名字。`),
  T(`At Qingming you go to sweep ${c.pw.en}’s grave and find the headstone has been defaced. Someone has carved one word into it.`,`清明去给${c.pw.zh}扫墓，发现墓碑被人划花了，上面刻了一个字。`),
  T(`At Qingming you sweep ${c.pw.en}’s grave. It is a quiet day. An old man at the next grave asks who is buried here.`,`清明给${c.pw.zh}扫墓。很安静的一天。隔壁坟前的老人问你，这里埋的是谁。`)][c.v],
 opts:[{l:c=>[T('Wait to see who comes back','等着看是谁'),T('Leave the word and clean the rest','那个字留着，别处擦干净'),T('Tell him','跟他说说')][c.v],out:[{t:c=>[T('Late in the afternoon a woman with a limp comes up the hill. Twenty years ago your parent carried her out of a burning house. She comes every year. Now she will come to you, too.','傍晚，一个跛脚的女人爬上山来。二十年前，你爹娘从着火的房子里把她背了出来。她每年都来。往后，她也会来看你。'),T('You leave it. It is not untrue. You come back every year anyway.','你没动它。那个字也不算冤枉。可你还是每年都来。'),T('He listens to the whole story, nods, and tells you about his own father. You walk down the hill together.','他听完了，点点头，又讲了讲他自己的父亲。你们一起走下了山。')][c.v],c:'good',fx:(s,c)=>[{happy:5,align:2},{align:2,happy:-2},{happy:3}][c.v]}]},
  {l:c=>[T('Leave your own offering beside theirs','把你的供品摆在旁边'),T('Find out who did it','查查是谁干的'),T('Sweep in silence','默默扫完')][c.v],out:[{t:c=>[T('Two bowls of rice, side by side. You feel your parent was a better person than you knew.','两碗饭并排摆着。你觉得爹娘比你知道的还要好。'),T('A family your parent ruined, long ago. Their son is your age, and very tired of hating. You talk for an hour.','是当年被你爹娘害得家破人亡的一户人家。他们的儿子跟你一般大，恨也恨累了。你们说了一个时辰的话。'),T('The wind does most of the talking.','话大多让风说了。')][c.v],c:'muted',fx:(s,c)=>[{happy:3},{align:4,happy:2},{happy:1}][c.v]}]}]});
B3({id:'h3_wronged',age:[16,80],once:1,w:2.6,when:s=>LG(s)&&LG(s).wronged.length>0&&s.jail<=0,
 ctx:s=>{const r=pick(LG(s).wronged);const c=fromRec(s,r);return{npc:c,r,pw:parW(s),amt:rint(5,15)*10}},
 text:c=>T(`${c.npc.en} stops you in the street. “You are ${c.pw.en.replace('your ','')=='father'?'his':'her'} child.” Years ago, ${c.pw.en} did ${c.npc.him} a wrong: “${c.r.what.en}” ${cap(c.npc.he)} has waited a long time for someone to answer for it.`,`${c.npc.zh}在街上拦住你。"你是${c.pw.zh==='父亲'?'他':'她'}的孩子。"当年${c.pw.zh}亏欠过${c.npc.ta}：「${c.r.what.zh}」${c.npc.ta}等这一天，等了很多年。`),
 opts:[{l:c=>T(`Make it right: ${c.amt} taels`,`替爹娘赔：${c.amt}两`),if:(s,c)=>s.money>=c.amt,out:[{t:c=>T(`${c.npc.en} takes it, and then gives half back. “It was never the money.” You part with something closer to peace.`,`${c.npc.zh}收下了，又退回一半。"从来就不是为了钱。"你们分开时，差不多算是和了。`),c:'good',fx:(s,c)=>({money:-Math.round(c.amt/2),align:5})}]},
  {l:T('Apologise for them','替爹娘赔个不是'),out:[{w:2,t:c=>T(`${c.npc.en} did not expect that. ${cap(c.npc.he)} nods, once, and walks away lighter.`,`${c.npc.zh}没想到你会这样。${c.npc.ta}点了一下头，走的时候脚步轻了。`),c:'good',fx:{align:3}},{w:1,t:T('An apology from a child is not enough. It will have to do anyway.','一个孩子的道歉，不够。可也只能这样了。'),c:'muted'}]},
  {l:T('Say the dead answer for themselves','说：死人的账，死人自己算'),out:[{t:c=>T(`${c.npc.en} spits in the road. You have inherited an enemy along with the house.`,`${c.npc.zh}往地上啐了一口。你继承的，除了房子，还有一个仇人。`),c:'bad',fx:{enemy:1}}]}]});
B3({id:'h3_grateful',age:[14,80],once:1,w:2.6,when:s=>LG(s)&&LG(s).helped.length>0,
 ctx:s=>{const r=pick(LG(s).helped);const c=fromRec(s,r);return{npc:c,r,pw:parW(s)}},
 text:c=>T(`${c.npc.en}, a stranger, has come a long way to find you. Years ago ${c.pw.en} helped ${c.npc.him}: “${c.r.what.en}” ${cap(c.npc.he)} never repaid it, and now ${c.npc.he} cannot repay the one who did it.`,`素不相识的${c.npc.zh}，大老远找到了你。当年${c.pw.zh}帮过${c.npc.ta}：「${c.r.what.zh}」这份情一直没还上，如今想还，人已经不在了。`),
 opts:[{l:T('Say there is no debt','说这份情不用还'),out:[{t:c=>T(`${c.npc.en} insists on leaving something anyway, and does: a letter of introduction to every inn in the province. Doors open for you for years.`,`${c.npc.zh}还是坚持留了点东西：一封写给全省客栈的荐书。往后好些年，处处有人给你开门。`),c:'good',fx:{fame:3,meet:'friend',bond:60}}]},
  {l:T('Accept whatever they brought','对方带来什么，就收下什么'),out:[{t:T('A purse, a good knife, and a story about your parent you will tell your own children.','一袋银子，一把好刀，还有一个关于你爹娘的故事，往后你会讲给自己的孩子听。'),c:'good',fx:{money:[40,120],happy:4}}]},
  {l:T('Ask them to pass it on to someone else','请对方把这份情转给别人'),out:[{t:c=>T(`${c.npc.en} thinks about it, and promises. It is the kind of thing your parent would have said. You realise you have never sounded more like them.`,`${c.npc.zh}想了想，答应了。这正像是你爹娘会说的话。你忽然觉得，自己从没这么像过他们。`),c:'gold',fx:{align:6,happy:3}}]}]});
B3({id:'h3_shadow',age:[15,30],once:1,w:3,when:s=>LG(s)&&LG(s).fame>=40,
 ctx:s=>({pw:parW(s),pn:parN(s),nk:LG(s).nick}),
 text:c=>T(`Everywhere you go, people say the same thing: “${c.pn.en}’s child! Are you as good as ${c.pw.en.replace('your ','')=='father'?'he':'she'} was?” They do not wait for the answer. They have already decided it is no.`,`你走到哪儿，人家都是同一句："这就是${c.pn.zh}${c.nk?'——'+c.nk.zh+'——':''}的孩子！功夫有你${c.pw.zh==='父亲'?'爹':'娘'}一半好吗？"他们不等你回答，心里早认定了：没有。`),
 opts:[{l:T('Live up to the name','把这块招牌扛起来'),out:[{t:T('You train twice as hard as anyone and fight anyone who asks. Some days it feels like your parent is still alive, watching. Some days it feels like a weight.','你比谁都多练一倍，谁来挑战都应。有些日子觉得爹娘还活着，在一旁看着。有些日子，觉得压得喘不过气。'),c:'good',fx:{skill:2,fame:4,happy:-3}}]},
  {l:T('Use a different name on the road','出门换个名字'),out:[{t:T('For a while you are nobody in particular, and it is wonderful. What you build under the other name is yours alone.','有一阵子，你谁也不是，这感觉好极了。用那个名字攒下的东西，全是你自己的。'),c:'good',fx:{happy:6,fame:-3,flag:'h3_ownname'}}]},
  {l:T('Say you are not your parent','说：我不是我爹娘'),out:[{t:T('It does not stop them asking. It changes how you hear it.','人家照样问。可你听着，感觉不一样了。'),c:'muted',fx:{happy:2,smarts:1}}]}]});
B3({id:'h3_letter',age:[16,60],once:1,w:2.4,when:s=>!!LG(s),
 ctx:s=>({pw:parW(s),v:LG(s).friends.length?rint(0,2):rint(1,2),f:LG(s).friends[0]||null}),
 text:c=>[T(`Sorting through ${c.pw.en}’s papers you find a letter, sealed and never sent, addressed to ${c.f?c.f.n.py:'an old friend'}. It begins: “I was wrong, and I have known it for twenty years.”`,`整理${c.pw.zh}的遗物，你翻出一封封好了却从没寄出的信，收信人是${c.f?c.f.n.cn:'一位老朋友'}。开头一句："是我错了。这一点，我心里明白了二十年。"`),
  T(`Sorting through ${c.pw.en}’s papers you find a bundle of letters to someone whose name you have never heard, all unsent, the last one dated the year you were born.`,`整理${c.pw.zh}的遗物，你翻出一捆信，写给一个你从没听说过的人，一封也没寄出去。最后一封的日子，是你出生那年。`),
  T(`Sorting through ${c.pw.en}’s papers you find a list in their handwriting: “Things I meant to do.” Most are crossed out. Three are not.`,`整理${c.pw.zh}的遗物，你翻出一张单子，是亲笔写的："想做的事"。大多已经划掉了，还剩三件没划。`)][c.v],
 opts:[{l:c=>[T('Deliver the letter','把信送去'),T('Find out who they were','去查查那是谁'),T('Do the three things','把那三件事做了')][c.v],out:[{t:c=>[T('The friend reads it on the doorstep, sits down on the step, and cannot speak for a while. “I was wrong too,” they say at last. “Tell— well. I suppose I am telling you.”','那位老友在门口读完，坐在台阶上，好一阵说不出话。"我也错了，"最后说，"你替我告诉——唉。我这不就是在告诉你吗。"'),T('An old woman in another county, who married someone else and never moved. She asks if your parent was happy. You find you know the answer.','是外县的一个老太太，后来嫁了别人，一辈子没挪过窝。她问你爹娘这辈子过得开心吗。你发现自己知道答案。'),T('To see the sea. To apologise to a brother. To plant a pear tree. It takes you two years. You understand your parent better at the end of it than in all the years before.','去看一回海。给一个兄弟赔个不是。种一棵梨树。你花了两年。做完的时候，你比之前那么多年都更懂你爹娘了。')][c.v],c:'gold',fx:{happy:6,align:3}}]},
  {l:T('Burn it unread, as they must have meant to','没看就烧了——他们本来大概也想烧'),out:[{t:T('Some things are allowed to stay private, even from family.','有些事，就算是家里人，也该让它一直是秘密。'),c:'muted',fx:{happy:1}}]}]});
B3({id:'h3_manual',age:[14,60],once:1,w:4,when:s=>LG(s)&&LG(s).manual,
 ctx:s=>({pw:parW(s),m:LG(s).manual}),
 text:c=>T(`In ${c.pw.en}’s trunk, wrapped in oilcloth, is the manual ${c.pw.en.replace('your ','')=='father'?'he':'she'} wrote in old age: ${c.m.n} (${c.m.cn}), every move drawn by hand, with notes in the margins addressed to you by name.`,`${c.pw.zh}的箱底，用油布包着那本晚年写下的秘籍：${c.m.cn}。每一招都是亲手画的，页边的批注，写的是你的名字。`),
 opts:[{l:T('Study it','研读'),out:[{t:T('It takes you a year. Some of the margin notes are about the art. Some are just about you.','你花了一年。页边的批注，有的讲武功，有的只是在说你。'),c:'gold',fx:(s,c)=>({skill:3,happy:5,f:s=>{const a=(typeof ARTS!=='undefined'&&Object.values(ARTS).find(x=>x.cn===c.m.cn));if(a&&learn(s,a))say(s,`You learned ${a.n} (${a.cn}).`,`你学会了${a.cn}。`,'gold')}})}]}]});
B3({id:'h3_enemy',age:[16,60],once:1,w:3,when:s=>!!LG(s)&&s.people.some(p=>p.alive&&p.rel==='enemy'&&p.inherited)&&s.jail<=0,
 ctx:s=>{const e=s.people.find(p=>p.alive&&p.rel==='enemy'&&p.inherited);const c=scene();c.pid=e.id;c.p=e;c.npc=Object.assign(npc(s),{en:e.n.py,zh:e.n.cn,n:e.n,sex:e.sex,he:PRON[e.sex].he,him:PRON[e.sex].him,his:PRON[e.sex].his,He:PRON[e.sex].He,ta:PRON[e.sex].ta,lv:e.lv});c.pw=parW(s);return c},
 text:c=>T(`${c.npc.en}, who was ${c.pw.en}’s enemy for twenty years, is waiting at the crossroads outside town. “I meant to settle it with your parent. Heaven settled it first. So: is it finished, or is it yours now?”`,`和${c.pw.zh}结了二十年仇的${c.npc.zh}，在镇外的岔路口等你。"我本想跟你爹娘了断。老天抢先了一步。那么——这事算完了，还是轮到你了？"`),
 opts:[{l:T('It is finished','算完了'),out:[{w:2,t:c=>T(`${c.npc.en} looks at you for a long time, then bows, the old-fashioned way, and walks off down the other road. The feud ends at the crossroads.`,`${c.npc.zh}看了你很久，按老规矩抱拳一礼，转身走上了另一条路。这段仇，在岔路口了结了。`),c:'good',fx:{f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='acq';p.bond=40}},happy:4}},{w:1,t:c=>T(`“Not for me,” says ${c.npc.en}. It is not finished after all.`,`"对我来说没完。"${c.npc.zh}说。原来并没有完。`),c:'bad',next:'h3_enemy2',keep:1}]},
  {l:T('Then it is mine','那就是我的事'),out:[{t:T('So be it.','那就来吧。'),c:'muted',next:'h3_enemy2',keep:1}]}]});
B3({id:'h3_enemy2',only:1,cd:0,
 text:c=>T(`${c.npc.en} draws.`,`${c.npc.zh}拔出了兵器。`),
 opts:[{l:T('Fight','动手'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.npc.lv||PW(1.1,5)(s),fixed:1},stakes:'injury',title:T('An inherited feud','父辈的仇'),cause:T('an inherited feud','父辈留下的仇')}),
   win:[{t:c=>T(`${c.npc.en} goes down and stays down. “Your parent never beat me,” ${c.npc.he} says from the dust. “Tell them.” You will, at the grave.`,`${c.npc.zh}倒在地上，没再起来。"你爹娘从没赢过我，"${c.npc.ta}躺在尘土里说，"告诉他们。"你会的，在坟前。`),c:'gold',fx:{fame:5,f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='acq';p.bond=30}}}}],
   lose:[{t:T('You lose. The feud goes on, one generation further down.','你输了。这段仇，又往下传了一代。'),c:'bad',fx:{happy:-5}}]}]});
B3({id:'h3_house',age:[18,70],once:1,w:2,when:s=>LG(s)&&s.items.some(it=>{const d=itemDef(it.id);return d&&d.cat==='house'}),
 ctx:s=>({pw:parW(s),amt:rint(6,14)*10}),
 text:c=>T(`The old family house needs a new roof. The neighbours, who have lived next to it for forty years, tell you which beam ${c.pw.en} carved their initials into as a child, and which wall the family hid behind in the war.`,`老宅的屋顶该换了。住了四十年的老邻居们告诉你：哪根梁上刻着${c.pw.zh}小时候的名字，打仗那年一家人躲在哪面墙后头。`),
 opts:[{l:c=>T(`Repair it properly (${c.amt} taels)`,`好好修（${c.amt}两）`),if:(s,c)=>s.money>=c.amt,out:[{t:T('You keep the carved beam. The new roof does not leak. You sleep better in that house than anywhere else.','刻字的那根梁你留下了。新屋顶不漏了。在那座房子里，你睡得比哪儿都踏实。'),c:'good',fx:(s,c)=>({money:-c.amt,happy:6})}]},
  {l:T('Sell it while it still stands','趁还没塌，卖了'),out:[{t:T('A merchant buys it and pulls it down for a shop. You walk past once, years later, and keep walking.','一个商人买下来，拆了盖铺子。多年后你路过一回，没停脚。'),c:'muted',fx:{money:[60,140],happy:-4}}]}]});
B3({id:'h3_grandparent',age:[20,70],once:1,w:2.5,when:s=>LG(s)&&LG(s).prev,
 ctx:s=>({g:LG(s).prev,pw:parW(s)}),
 text:c=>T(`An old storyteller in the market is telling a tale about a fighter named ${c.g.py}, three generations back. It takes you a while to realise it is your grandparent, and a while longer to realise how much of it is made up.`,`集市上有个老说书人在讲一个叫${c.g.cn}的江湖人，说是三代以前的事。你听了好一会儿才反应过来：那是你的祖辈。又听了好一会儿才明白：有一大半是编的。`),
 opts:[{l:T('Correct him afterwards','散场后去纠正他'),out:[{t:T('He is delighted. He has a real descendant now, and the next version of the story has you in it, also mostly made up.','他高兴坏了：总算有个正经后人了。下一回讲这段书，里头多了个你，也是一大半是编的。'),c:'good',fx:{fame:2,happy:4}}]},
  {l:T('Let the legend be','由它去，传说就是传说'),out:[{t:T('You pay for the old man’s tea. Some stories are better than the truth, and do the family no harm.','你替老头付了茶钱。有些故事比真事好听，也不伤这个家的面子。'),c:'muted',fx:{happy:2}}]}]});
B3({id:'h3_unfinished',age:[16,70],once:1,w:3.5,when:s=>LG(s)&&LG(s).stories.length>0&&!(s.story&&Object.keys(s.story).some(k=>LG(s).stories.some(x=>x.id===k))),
 ctx:s=>{const x=pick(LG(s).stories);return{x,pw:parW(s),sn:STORY[x.id].n}},
 text:c=>T(`Among ${c.pw.en}’s papers are notes on something they never finished: 【${c.sn.en}】. Names, places, dates, and at the bottom, in a shakier hand: “Someone should see this through.”`,`${c.pw.zh}的遗物里有几页笔记，记着一件没办完的事：【${c.sn.zh}】。人名、地名、日子，最底下一行，字迹已经发抖："这件事，总得有人办完。"`),
 opts:[{l:T('Take it up','接过来'),out:[{t:c=>STORY_INHERIT[c.x.id]?T('You read the notes three times and start where they stopped.','你把笔记读了三遍，从他们停下的地方接着走。'):T('You follow the notes as far as they go. The trail is cold, but at the end of it you understand what your parent was trying to do, and finish it in your own way.','你顺着笔记一路查下去。线索早就冷了，可到了尽头，你明白了爹娘想做的是什么，用你自己的法子把它了结了。'),c:'good',fx:(s,c)=>({f:s=>{if(STORY_INHERIT[c.x.id])STORY_INHERIT[c.x.id](s,c.x);else applyFx(s,{fame:2,align:3,happy:4},c)}})}]},
  {l:T('Let it rest with them','让它跟着爹娘一起入土'),out:[{t:T('You put the notes back in the trunk. Some things are allowed to end unfinished.','你把笔记放回箱子里。有些事，没办完也就没办完吧。'),c:'muted'}]}]});
/* stories in st7.js add themselves here, so an heir can pick them up mid-way */
const STORY_INHERIT={};

/* ---------- late life: what the earlier scenes did not cover ---------- */
B3({id:'b3_eyes',age:[55,100],once:1,w:2.2,
 text:T('The characters in books have started to swim, and you misjudge the edge of a step. Your eyes are going.','书上的字开始发飘，迈台阶也踩不准边了。你的眼睛不行了。'),
 opts:[{l:T('Train to fight by sound','练听声辨位'),out:[{w:s=>.6+s.t.heart*.12,t:T('A year of blindfolded practice in the courtyard. You are, if anything, harder to hit than before. Your grandchildren think it is the best trick they have ever seen.','蒙着眼在院里练了一年。说起来，你反倒比从前更难打中了。孙辈们觉得这是他们见过最神的本事。'),c:'gold',fx:{skill:1.5,happy:4}},{w:1,t:T('You get better at it, slowly, and at bumping into furniture, quickly.','这本事你学得很慢，撞家具倒学得很快。'),c:'muted',fx:{skill:.5,hurt:[1,3],cause:T('a chair you did not see','一把没看见的椅子')}}]},
  {l:T('Buy foreign crystal spectacles','买一副西洋水晶眼镜'),if:s=>s.money>=80,out:[{t:T('The world comes back into focus. You look very scholarly and slightly ridiculous, and can read again.','世界又清楚了。你看上去很有学问，又有点滑稽，总之又能看书了。'),c:'good',fx:{money:-80,happy:5,smarts:1}}]},
  {l:T('Have someone read to you','让人念给你听'),out:[{t:T('A grandchild, a neighbour’s child, whoever is around. You learn a great deal about what young people find boring.','孙辈也好，邻家孩子也好，谁在就谁念。你倒是知道了不少年轻人嫌闷的东西。'),c:'muted',fx:{happy:3}}]}]});
B3({id:'b3_ears',age:[60,110],once:1,w:2,
 text:T('Your hearing is going. Conversations happen around you now, and people have stopped repeating themselves.','你的耳朵背了。大家说话都绕着你，也没人再肯重复第二遍。'),
 opts:[{l:T('Pretend to hear everything','装作什么都听见了'),out:[{t:T('You agree to three things you did not hear. One is a wedding. You attend, and it is very nice.','你答应了三件根本没听清的事。其中一件是婚事。你去了，挺好的。'),c:'muted',fx:{happy:2}}]},
  {l:T('Make everyone come closer','让大家都凑近点说'),out:[{t:T('Conversations get quieter, closer and kinder. You notice people tell you more now.','说话的声音小了，人靠得近了，话也软了。你发现大家跟你说的反倒多了。'),c:'good',fx:{happy:4}}]},
  {l:T('Use it, shamelessly, to avoid things','厚着脸皮拿这个躲事'),out:[{t:T('“Eh? What? I can’t hear you.” It works for years. Your family knows, and lets it.','"啊？什么？听不见。"这一招管用了好些年。家里人心知肚明，也由着你。'),c:'muted',fx:{happy:5}}]}]});
PEV('caregiver',{w:3,gap:15,who:(s,p)=>p.rel==='spouse'&&p.age>=58&&s.age>=55,
 text:c=>T(`${c.npc.en} falls ill in the winter and does not get better. The doctor says it may be years, or months. Someone will have to do everything.`,`入冬后${c.npc.zh}病倒了，一直没见好。郎中说，也许还有几年，也许只有几个月。总得有人什么都管。`),
 opts:[{l:T('Do it yourself','自己来'),out:[{t:c=>T(`You learn to cook properly, to lift without hurting, to sit up at night without falling asleep. ${c.npc.en} is embarrassed, then grateful, then just glad you are there. These turn out to be some of the closest years you have.`,`你学会了好好做饭，学会了怎么扶人不弄疼，学会了守夜不打盹。${c.npc.zh}先是难为情，后来是感激，再后来，只是庆幸你在。这几年，竟成了你们最亲近的日子。`),c:'good',fx:{bond:15,happy:-3,skill:-.5}}]},
  {l:T('Hire help and keep your own life','请人照顾，自己的日子照过'),out:[{t:c=>T(`The nurse is kind and capable. ${c.npc.en} never complains. You catch ${c.npc.him} watching the door some evenings.`,`请来的人又和气又能干。${c.npc.zh}从不抱怨。有些晚上，你看见${c.npc.ta}一直望着门口。`),c:'muted',fx:{money:-60,bond:-4}}]},
  {l:T('Call the whole family home','把一家人都叫回来'),out:[{t:T('The children come back from three provinces. The house is crowded and loud and nobody sleeps. It is the last time you are all in one place.','孩子们从三个省赶了回来。家里挤得满满当当，吵吵闹闹，谁也睡不好。那是你们一家最后一次聚得这么齐。'),c:'gold',fx:{bond:10,happy:4,f:s=>kidsOf(s).forEach(k=>addBond(k,6))}}]}]});
B3({id:'b3_widowed',age:[45,110],once:1,w:3,when:s=>s.people.some(p=>p.rel==='spouse'&&!p.alive)&&!s.people.some(p=>p.rel==='spouse'&&p.alive),
 ctx:s=>{const p=s.people.filter(p=>p.rel==='spouse'&&!p.alive).pop();return{w:T(p.n.py,p.n.cn)}},
 text:c=>T(`The house is very quiet without ${c.w.en}. You still set out two cups some mornings. You have never in your life cooked rice properly, and now there is no one to laugh at you for it.`,`没了${c.w.zh}，家里静得很。有些早上你还是摆两个杯子。你这辈子都没正经煮过一锅饭，如今连个笑你的人都没有了。`),
 opts:[{l:T('Learn to cook, badly, then less badly','学做饭，先难吃，后来没那么难吃'),out:[{t:T('By spring you can make three dishes. One of them is the one they used to make. It is not right, but it is close.','到开春，你会做三道菜了。其中一道，是那个人以前常做的。味道不对，可也差不多了。'),c:'good',fx:{happy:4}}]},
  {l:T('Go travelling','出去走走'),out:[{t:T('You go to all the places you always said you would go together. You talk to them on the road, quietly. It helps more than you thought.','你把当年说好要一起去的地方都走了一遍。一路上你小声跟那个人说话。比你想的管用。'),c:'good',fx:{happy:5,money:-30}}]},
  {l:T('Keep the house exactly as it was','家里什么都不动'),out:[{t:T('Nothing moves. The dust settles on everything evenly. Your children start visiting more often, and do not say why.','什么都没挪过地方。灰均匀地落在每一样东西上。孩子们来得勤了，也不说为什么。'),c:'muted',fx:{happy:-3}}]}]});
B3({id:'b3_lastfriend',age:[62,110],once:1,w:2.5,when:s=>s.people.filter(p=>!p.alive&&['friend','sworn'].includes(p.rel)).length>=2,
 ctx:s=>{const d=s.people.filter(p=>!p.alive&&['friend','sworn'].includes(p.rel));const p=d[d.length-1];return{f:T(p.n.py,p.n.cn),n:d.length}},
 text:c=>T(`At ${c.f.en}’s funeral, you realise that of everyone you ran around the jianghu with when you were young, you are the last one left. The family asks if you would say a few words.`,`在${c.f.zh}的丧礼上，你忽然意识到：年轻时一起闯江湖的那些人，只剩你一个了。家里人问你，能不能说几句。`),
 opts:[{l:T('Tell the funny stories','讲那些好笑的事'),out:[{t:T('The time with the goose. The time with the magistrate’s hat. The mourners laugh until they cry, and then just cry. Afterwards three young people ask you to tell them more.','那回大鹅的事。那回县太爷帽子的事。吊唁的人笑着笑着就哭了，后来就只是哭。散了以后，有三个年轻人求你再多讲一些。'),c:'gold',fx:{happy:3,fame:1}}]},
  {l:T('Say one sentence and sit down','说一句话，就坐下'),out:[{t:c=>T(`“${c.f.en} was the bravest of us, and the only one who never pretended otherwise.” It is enough. It is exactly enough.`,`"${c.f.zh}是我们当中最有胆的，也是唯一一个从不装模作样的。"够了。刚刚好。`),c:'good',fx:{happy:1}}]},
  {l:T('Find you cannot speak','发现自己说不出话'),out:[{t:T('You stand there, and the room waits, and then someone takes your arm and leads you back to your seat. Nobody minds.','你站在那儿，满屋子的人等着。后来有人扶着你回了座位。谁也没在意。'),c:'muted',fx:{happy:-4}}]}]});
B3({id:'b3_legend',age:[55,110],once:1,w:2.2,when:s=>s.fame>=40,
 text:T('In a teahouse, a group of young swordsmen are arguing about a legendary fighter from the old days. It takes you a minute to realise it is you. According to them, you were nine feet tall and killed a tiger with a chopstick.','茶馆里，一群年轻剑客在争论一位老辈的传奇高手。你听了一会儿才反应过来：说的是你。照他们的说法，你身高九尺，拿一根筷子戳死过老虎。'),
 opts:[{l:T('Introduce yourself','自报家门'),out:[{w:1,t:T('They do not believe you. You are far too short. One of them kindly buys you a cup of tea for the joke.','没人信。你个子太矮了。有个后生还好心请你喝了杯茶，就当你开了个玩笑。'),c:'muted',fx:{happy:3}},{w:1,t:T('One of them recognises your sword. The teahouse goes completely silent. You spend the rest of the afternoon being asked about the tiger.','有人认出了你的剑。茶馆里一下子鸦雀无声。整个下午，你都在被追问那只老虎。'),c:'gold',fx:{fame:2,happy:5}}]},
  {l:T('Correct the details from the next table','在邻桌纠正细节'),out:[{t:T('“It was a wild boar, and it was a spoon.” They argue with you for an hour. The legend survives, slightly revised.','"是头野猪，用的是勺子。"他们跟你争了一个时辰。传说保住了，略有修订。'),c:'good',fx:{happy:5}}]},
  {l:T('Drink your tea and say nothing','喝你的茶，一言不发'),out:[{t:T('It is a better story than the one that happened. You leave it with them.','这故事比真事好听。你把它留给他们了。'),c:'muted',fx:{happy:2}}]}]});
B3({id:'b3_writeart',age:[55,100],once:1,w:2.5,when:s=>s.arts&&s.arts.length>0&&kidsOf(s).length>0,
 ctx:s=>{const a=s.arts.slice().sort((x,y)=>(y.tier||0)-(x.tier||0))[0];return{a}},
 text:c=>T(`Your hands are not what they were. If ${c.a.n} (${c.a.cn}) is going to outlive you, it will have to be on paper. It would take a winter to write it down properly.`,`你的手不比当年了。${c.a.cn}要想活得比你长，就得落到纸上。要好好写下来，得花一整个冬天。`),
 opts:[{l:T('Write it all, and address it to your children','全写下来，写给孩子们'),out:[{t:T('You draw every move and fill the margins with things you never said out loud. You wrap it in oilcloth and put it in the trunk. Someone will find it.','每一招你都画了出来，页边写满了从没当面说过的话。你用油布包好，放进箱底。总会有人找到的。'),c:'gold',fx:(s,c)=>({happy:4,flag:'b3_manual',f:s=>{s.b3manual={n:c.a.n,cn:c.a.cn,tier:c.a.tier}}})}]},
  {l:T('Teach it in person instead','不写了，当面教'),out:[{t:T('Paper forgets nothing and understands nothing. You would rather teach someone who can ask questions.','纸什么都记得，却什么都不懂。你宁可教一个能开口问的人。'),c:'muted',fx:{f:s=>kidsOf(s).forEach(k=>{addBond(k,5);k.lv+=rint(2,6)})}}]}]});
