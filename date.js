/* 江湖一生 · dates: you choose where to go from a few ideas, and how it goes depends on who they are, how things
   stand between you, and whether you have done it before. A spouse of thirty years is not courted like a new love. */
'use strict';
const dN=p=>[p.n.py,p.n.cn],dP=p=>tkP(p);
/* each outing: when it is possible, what it costs, who enjoys it (by temperament), and how it can go */
const DATES=[
 {id:'lotus',n:T('Row out among the lotus','划船进荷塘'),fit:{gentle:1,devoted:.8,timid:.4,'a heavy drinker':-.3},
  go:p=>T(`You row ${p.n.py} out into the lotus pond.`,`你划着小船，载着${p.n.cn}钻进荷叶深处。`),
  good:[p=>T(`${p.n.py} picks a lotus pod and feeds you the seeds one by one. The boat drifts wherever it likes.`,`${p.n.cn}摘了个莲蓬，一颗一颗剥给你吃。船爱往哪漂就往哪漂。`),p=>T(`A heron lands on the bow and neither of you dares breathe. It stays a long time.`,`一只白鹭落在船头，你们俩大气都不敢出。它待了好久。`)],
  bad:[p=>T(`You row in circles for an hour. ${p.n.py} is too polite to say anything, which is worse.`,`你在塘里转了一个时辰的圈。${p.n.cn}客气得一句话也不说，这比说出来还难受。`)],
  mid:[p=>T('The mosquitoes find you before the lotus does. It is still a nice evening.','荷花还没看着，蚊子先找上来了。不过，这一晚还是挺好。')]},
 {id:'lantern',n:T('Float lanterns on the river','去河边放河灯'),fit:{devoted:1.2,gentle:.8,eccentric:.4,cold:-.5},
  go:p=>T(`You and ${p.n.py} each write a wish on a paper lantern and set it on the water.`,`你和${p.n.cn}各在一盏河灯上写了心愿，放进水里。`),
  good:[p=>T(`The two lanterns bump together and float off side by side. ${p.n.py} pretends not to have noticed, and holds your hand all the way home.`,`两盏灯碰在一起，并排漂走了。${p.n.cn}装作没看见，回家一路都牵着你的手。`),p=>T(`${p.n.py} will not tell you what ${dP(p).he} wished for. ${dP(p).He} smiles about it for days.`,`${p.n.cn}死活不肯说许了什么愿，一连好几天想起来就笑。`)],
  bad:[p=>T(`${p.n.py}'s lantern catches fire and sinks at once. ${dP(p).He} takes it as an omen and is quiet all evening.`,`${p.n.cn}的河灯刚放下就烧着沉了。${dP(p).ta}觉得是个兆头，一晚上都闷闷的。`)],
  mid:[p=>T('The river is crowded with other couples doing the same thing. You laugh about that.','河边挤满了一对一对放灯的人。你们为这个笑了一阵。')]},
 {id:'stars',n:T('Climb a hill to watch the stars','爬上山坡看星星'),fit:{eccentric:1,devoted:.6,bold:.4,timid:-.4},
  go:p=>T(`You climb the hill behind town with ${p.n.py} and lie in the grass.`,`你和${p.n.cn}爬上镇后的山坡，躺在草地上。`),
  good:[p=>T(`${p.n.py} names the stars, half of them wrongly and the other half invented. You let ${dP(p).him}.`,`${p.n.cn}给你指星星，一半叫错了，一半是自己编的。你也不拆穿。`),p=>T('A shooting star. You both make a wish and then argue about whose it was.','一颗流星划过。你们都许了愿，然后争了半天那颗星算谁的。')],
  bad:[p=>T('Clouds come in. Then rain. You walk down the hill soaked and not speaking.','云上来了，接着下起了雨。你们淋得透湿走下山，谁也不吭声。')],
  mid:[p=>T('It is colder up there than you planned for. You share one coat.','山上比你想的冷。两个人裹着一件外衣。')]},
 {id:'market',n:T('Wander the night market','逛夜市'),cost:10,fit:{greedy:1,cheerful:1,bold:.4,cold:-.6,timid:-.2},
  go:p=>T(`You take ${p.n.py} to the night market.`,`你带${p.n.cn}去逛夜市。`),
  good:[p=>T(`${p.n.py} haggles a hairpin down to half price and is prouder of that than of anything you have seen ${dP(p).him} do.`,`${p.n.cn}把一支簪子砍到了半价，那股得意劲儿，你从没见${dP(p).ta}这么得意过。`),p=>T('You eat your way from one end to the other: sugar figures, lamb skewers, sweet soup. Neither of you can face breakfast.','你们从街头吃到街尾：糖人、羊肉串、甜汤。第二天早饭谁都吃不下。')],
  bad:[p=>T(`A pickpocket takes your purse in the crowd. ${p.n.py} spends the rest of the night telling you to be more careful.`,`人堆里被扒手摸走了钱袋。剩下的一晚上，${p.n.cn}都在数落你不小心。`)],
  mid:[p=>T('Too crowded to talk, but you buy each other something small.','人太多，说不上几句话，不过你们各给对方买了个小玩意儿。')]},
 {id:'opera',n:T('Go to the opera','去听戏'),cost:15,fit:{eccentric:.8,gentle:.8,devoted:.6,bold:-.3,cold:-.4},
  go:p=>T(`You buy two seats at the opera for yourself and ${p.n.py}.`,`你买了两张戏票，和${p.n.cn}去听戏。`),
  good:[p=>T(`It is a sad one. ${p.n.py} cries at the parting scene and then denies it.`,`唱的是出悲戏。${p.n.cn}在离别那一折哭了，出来却死不承认。`),p=>T(`${p.n.py} hums the tune for a month afterwards, badly.`,`那以后一个月，${p.n.cn}都在哼那段唱腔，哼得很难听。`)],
  bad:[p=>T(`${p.n.py} falls asleep in the second act and snores in the third.`,`第二折${p.n.cn}就睡着了，第三折还打起了呼。`)],
  mid:[p=>T('The leading actor forgets his lines. The audience enjoys that more than the play.','台上的名角忘了词。底下看得比正戏还高兴。')]},
 {id:'drink',n:T('Share a jar of wine','找个酒楼喝两盅'),cost:10,fit:{'a heavy drinker':1.6,bold:1,cheerful:.4,timid:-.6,upright:-.2},
  go:p=>T(`You and ${p.n.py} take a table upstairs at a wine house.`,`你和${p.n.cn}在酒楼楼上要了张桌子。`),
  good:[p=>T(`Three cups in, ${p.n.py} tells you things ${dP(p).he} has never told anyone.`,`三杯下肚，${p.n.cn}跟你说了些从没跟人说过的话。`),p=>T('You drink until the waiter starts stacking chairs around you, and walk home singing.','你们一直喝到伙计开始在旁边摞椅子，一路唱着回了家。')],
  bad:[p=>T(`${p.n.py} drinks too much and says something you will both pretend was not said.`,`${p.n.cn}喝多了，说了句你们俩以后都会装作没听过的话。`)],
  mid:[p=>T('Good wine, a bit expensive. You talk about nothing much.','酒不错，就是贵了点。聊的都是些没要紧的事。')]},
 {id:'ride',n:T('Ride out of the city together','骑马出城'),fit:{bold:1.2,cheerful:.6,eccentric:.4,timid:-1,gentle:-.2},
  go:p=>T(`You borrow two horses and ride out of the city with ${p.n.py}.`,`你借了两匹马，和${p.n.cn}骑出城去。`),
  good:[p=>T(`${p.n.py} races you to the old pagoda and wins, and laughs about it all the way back.`,`${p.n.cn}跟你赛马到古塔，赢了，一路笑着回来。`),p=>T('You find a stream nobody else seems to know about and stay until dark.','你们找到一条好像没人知道的小溪，一直待到天黑。')],
  bad:[p=>T(`${p.n.py}'s horse bolts. Nobody is hurt, but the day is over.`,`${p.n.cn}的马惊了。人没事，这一天也就到此为止了。`)],
  mid:[p=>T('Sore legs, sunburn, and a good day.','腿酸了，脸晒红了，日子过得不赖。')]},
 {id:'temple',n:T('Burn incense and draw lots at the temple','去庙里上香求签'),fit:{devoted:1,timid:.6,gentle:.5,upright:.3,eccentric:-.2},
  go:p=>T(`You take ${p.n.py} to the temple to burn incense and draw lots together.`,`你陪${p.n.cn}去庙里上香，一起求了支签。`),
  good:[p=>T('The lot is the highest kind. The monk congratulates you both. You give him more silver than you meant to.','抽了支上上签。老和尚连声道喜，你给的香火钱比原本打算的多了不少。'),p=>T(`${p.n.py} prays a long time. On the way out ${dP(p).he} says ${dP(p).he} asked for you, not for ${dP(p).him}self.`,`${p.n.cn}跪了很久。出来时说，求的是你，不是自己。`)],
  bad:[p=>T(`The lot is the worst kind. ${p.n.py} insists on drawing again, and again, until the monk asks you to leave.`,`抽了支下下签。${p.n.cn}非要重抽，一抽再抽，直到和尚请你们出去。`)],
  mid:[p=>T('The lot says something vague about patience. You both decide it is good.','签文含含糊糊说了些要耐心的话。你们都决定当它是好签。')]},
 {id:'spar',n:T('Practise swordplay together','一起练剑对招'),if:(s,p)=>s.age<60&&p.age<60&&(p.lv>=10||power(s)>=10),fit:{bold:1.2,upright:.6,arrogant:.4,timid:-.8,gentle:-.2},
  go:p=>T(`You and ${p.n.py} take two practice swords out to the courtyard.`,`你和${p.n.cn}拿了两把木剑到院子里对招。`),
  good:[p=>T(`${p.n.py} finds a gap in your guard you never knew was there, and shows you how to close it.`,`${p.n.cn}找出了你剑招里一个你自己都不知道的破绽，还教你怎么补上。`),p=>T('It turns into a game, then a chase, then nobody is practising anything.','练着练着成了打闹，后来变成满院子追，谁也没在练了。')],
  bad:[p=>T(`You win too easily and do not hide it. ${p.n.py} puts the sword down and goes inside.`,`你赢得太轻松，还没藏住得意。${p.n.cn}把剑一放，进屋去了。`)],
  mid:[p=>T('A good sweat. You are both a little better at it.','出了一身好汗，两个人都长进了一点。')],fx:{skill:.3}},
 {id:'cook',n:T('Cook a meal together','一起下厨做顿饭'),fit:{gentle:1,devoted:.8,cheerful:.6,arrogant:-.6,greedy:.2},
  go:p=>T(`You and ${p.n.py} take over the kitchen for an evening.`,`你和${p.n.cn}占了一晚上灶房。`),
  good:[p=>T(`${p.n.py} makes the dish ${dP(p).his} mother used to make, and tells you about her while it cooks.`,`${p.n.cn}做了${dP(p).ta}娘以前常做的那道菜，一边炖一边跟你讲${dP(p).ta}娘的事。`),p=>T('Flour everywhere, one dish burnt, one dish wonderful. You eat the wonderful one standing up in the kitchen.','面粉撒了一地，一道菜糊了，一道菜好吃极了。你们站在灶边就把好吃的那道吃光了。')],
  bad:[p=>T(`You argue about how much salt. Then about everything else.`,`你们为放多少盐吵了起来，然后吵到了别的事上。`)],
  mid:[p=>T('An ordinary supper, eaten together. That is most of what a life is.','一顿家常饭，两个人一起吃。日子大半就是这样过的。')]},
 {id:'fish',n:T('Go fishing and say very little','去钓鱼，不怎么说话'),fit:{cold:1.2,timid:.8,upright:.4,cheerful:-.6,bold:-.4},
  go:p=>T(`You sit on the riverbank with ${p.n.py}, two rods, and no plans.`,`你和${p.n.cn}坐在河边，两根钓竿，什么打算也没有。`),
  good:[p=>T(`Hours pass. ${p.n.py} leans against your shoulder at some point and you do not move for the rest of the afternoon.`,`几个时辰过去了。不知什么时候，${p.n.cn}靠在了你肩上。整个下午你都没敢动。`),p=>T('You catch nothing. It is one of the best days in a long while.','一条鱼也没钓着。却是很久以来最好的一天。')],
  bad:[p=>T(`${p.n.py} is bored by the end of the first hour and lets you know it.`,`不到一个时辰${p.n.cn}就嫌闷了，还明明白白让你知道。`)],
  mid:[p=>T('Two small fish, cooked on a fire by the water.','钓了两条小鱼，就在河边生火烤了。')]},
 {id:'brush',n:T('Paint and write poems together','一起写字作画'),if:(s,p)=>s.smarts>=30||p.occ===1,fit:{eccentric:1,gentle:.8,devoted:.4,bold:-.6,'a heavy drinker':.2},
  go:p=>T(`You spread paper on the table and grind ink with ${p.n.py}.`,`你在桌上铺开纸，和${p.n.cn}一起磨墨。`),
  good:[p=>T(`${p.n.py} paints you a plum branch, and you write a line of poem beside it. It goes on the wall.`,`${p.n.cn}给你画了一枝梅，你在旁边题了一句诗。挂到了墙上。`),p=>T(`You write ${p.n.py} a poem. It is not good. ${dP(p).He} keeps it anyway, folded small.`,`你给${p.n.cn}写了首诗，写得不好。${dP(p).ta}还是叠得小小的收了起来。`)],
  bad:[p=>T(`${p.n.py} criticises your brushwork, at length, correctly.`,`${p.n.cn}把你的字从头挑剔到尾，句句在理。`)],
  mid:[p=>T('More ink on your sleeves than on the paper.','袖子上的墨比纸上的还多。')]},
 {id:'spring',n:T('Soak at the hot springs','去泡温泉'),cost:20,fit:{'a heavy drinker':.6,cheerful:.6,gentle:.6,devoted:.6,timid:-.3},
  go:p=>T(`You take ${p.n.py} up to the hot springs in the hills.`,`你带${p.n.cn}上山泡温泉。`),
  good:[p=>T('Snow falls into the steaming water. Neither of you wants to ever get out.','雪落进冒着热气的泉水里。谁也不想起来。'),p=>T(`The old aches in ${p.n.py}'s shoulders ease for the first time in years.`,`${p.n.cn}肩上的老毛病，多年来头一回松快了。`)],
  bad:[p=>T('The place is full of loud merchants talking about rice prices.','池子里全是大声谈米价的商人。')],
  mid:[p=>T('Warm, sleepy, and a long walk home.','泡得暖洋洋、昏昏欲睡，回家的路走得很长。')]},
 {id:'kite',n:T('Fly a kite in the fields','去田野放风筝'),fit:{cheerful:1.2,eccentric:.6,bold:.4,cold:-.6,arrogant:-.4},
  go:p=>T(`You make a kite and take ${p.n.py} out to the fields.`,`你扎了只风筝，带${p.n.cn}去田野里放。`),
  good:[p=>T(`It goes up and up until it is a dot. ${p.n.py} runs like a child.`,`风筝越飞越高，成了一个小点。${p.n.cn}跑得像个孩子。`)],
  bad:[p=>T('No wind. You run up and down a field dragging a kite for an hour.','一丝风都没有。你拖着风筝在田里来回跑了一个时辰。')],
  mid:[p=>T('It lands in a tree. Getting it down is half the fun.','风筝挂到了树上。爬上去取，倒成了一半的乐子。')]},
 {id:'fair',n:T('Go to the temple fair','去逛庙会'),cost:5,fit:{cheerful:1,greedy:.6,bold:.4,cold:-.4},
  go:p=>T(`It is fair day. You and ${p.n.py} go with half the town.`,`赶上庙会，你和${p.n.cn}跟着半个镇子的人去凑热闹。`),
  good:[p=>T(`You win ${p.n.py} a clay rabbit at the ring toss. ${dP(p).He} keeps it on the windowsill for years.`,`你套圈给${p.n.cn}套中了一只泥兔子。${dP(p).ta}在窗台上摆了好多年。`),p=>T('A fortune-teller says you two will grow old together. You both act as if you do not care.','算命的说你们俩会白头到老。两个人都装作不在意。')],
  bad:[p=>T('You lose each other in the crowd and spend the evening looking.','人太多，你们走散了，一晚上都在找对方。')],
  mid:[p=>T('Noise, smoke, candied hawthorn. A good day out.','吵吵嚷嚷，烟火缭绕，冰糖葫芦。是个好日子。')]},
 /* for a husband or wife */
 {id:'kids',n:T('Take the children out for the day','带上孩子出去玩一天'),if:(s,p)=>p.rel==='spouse'&&kidsOf(s).some(k=>k.age<16),fit:{cheerful:1,gentle:.8,devoted:.6,cold:-.4},
  go:p=>T(`You and ${p.n.py} take the children out for the day.`,`你和${p.n.cn}带着孩子出去玩了一整天。`),
  good:[p=>T(`On the way home the children fall asleep, one on each of you. ${p.n.py} looks at you over their heads.`,`回来的路上孩子们睡着了，一人身上趴一个。${p.n.cn}隔着孩子的脑袋看了你一眼。`)],
  bad:[p=>T('Somebody cries, somebody is sick, somebody is lost for a terrible quarter of an hour.','有人哭，有人吐，还有一个丢了一刻钟，吓得半死。')],
  mid:[p=>T('Exhausting. You would do it again.','累坏了。下回还去。')]},
 {id:'courtyard',n:T('Sit in the courtyard all afternoon','在院子里坐一下午'),if:(s,p)=>p.rel==='spouse'&&s.age>=40,fit:{gentle:1,cold:.6,devoted:.8,timid:.4,bold:-.4},
  go:p=>T(`You bring two chairs out into the courtyard and sit with ${p.n.py} in the sun.`,`你搬了两把椅子到院子里，和${p.n.cn}一起晒太阳。`),
  good:[p=>T(`You talk about the year you met. You remember it differently. You both like ${dP(p).his} version better.`,`你们聊起刚认识的那一年。两个人记得不一样。都更喜欢${dP(p).ta}记的那个版本。`),p=>T(`${p.n.py} falls asleep mid-sentence. You finish the sentence for ${dP(p).him}, quietly.`,`${p.n.cn}话说到一半睡着了。你轻轻替${dP(p).ta}把那句话说完。`)],
  bad:[p=>T('An old argument comes back, worn smooth with use.','一桩老架又翻了出来，吵了这么多年，早吵熟了。')],
  mid:[p=>T('The shadows move across the courtyard. Not much is said. Not much needs to be.','影子在院子里一点点挪过去。话不多，也不需要多。')]},
 {id:'oldplace',n:T('Go back to where you first met','回你们初识的地方看看'),if:(s,p)=>(s.age-(p.met??s.age))>=8,fit:{devoted:1.4,gentle:.8,eccentric:.4,cold:-.2},
  go:p=>T(`You take ${p.n.py} back to where the two of you first met.`,`你带${p.n.cn}回到你们第一次见面的地方。`),
  good:[p=>T('It has changed completely. You stand where it used to be and it does not matter at all.','那里全变了样。你们站在原来的位置，一点也不觉得可惜。'),p=>T(`${p.n.py} remembers what you were wearing that day. You did not know ${dP(p).he} had noticed.`,`${p.n.cn}还记得那天你穿的什么衣裳。你从不知道${dP(p).ta}留意过。`)],
  bad:[p=>T(`${p.n.py} does not remember it the way you do, and that hurts more than you expected.`,`${p.n.cn}记得的跟你记得的不一样。这比你想的还要难受。`)],
  mid:[p=>T('A quiet walk round an old place. More moving than either of you says.','在老地方静静走了一圈。心里的波动，比说出口的多。')]}];
const DATE_BY=Object.fromEntries(DATES.map(d=>[d.id,d]));
/* lines you have already seen with this person are passed over while there are others */
const dLine=(p,d,k)=>{p.dtSeen=p.dtSeen||[];const L=d[k];const fresh=L.map((f,i)=>i).filter(i=>!p.dtSeen.includes(d.id+k+i));const i=pick(fresh.length?fresh:L.map((f,i)=>i));p.dtSeen.push(d.id+k+i);if(p.dtSeen.length>30)p.dtSeen.shift();return L[i](p)};
function dateGo(s,p,d,theirs){if(!p||!d)return;if(d.cost)pay(s,-Math.min(s.money,d.cost));
  p.dtLast=p.dtLast||[];const again=p.dtLast.filter(x=>x===d.id).length;p.dtLast.push(d.id);if(p.dtLast.length>4)p.dtLast.shift();
  sayT(s,d.go(p),'muted');
  /* their favourite kind of evening, how close you are, and doing the same thing over and over */
  const score=(d.fit[tkTrait(p)]||0)+(p.bond-55)/45-again*.45+(theirs?.5:0)+(R()-.5)*.9;
  if(score<-.55){addBond(p,-rint(1,4));happy(s,-1);sayT(s,dLine(p,d,'bad'),'bad');return}
  if(score>.95){addBond(p,rint(8,13));happy(s,rint(5,9));sayT(s,dLine(p,d,'good'),'good');if(d.fx)applyFx(s,d.fx,{});
    if(p.rel==='lover'&&p.bond>=85&&chance(.25))say(s,`Walking home, you realise you want this every evening, for the rest of your life.`,`回家的路上，你忽然想：往后余生，每个晚上都想这样过。`,'gold');return}
  addBond(p,rint(3,7));happy(s,3);sayT(s,dLine(p,d,'mid'))}
I({id:'pk_date',only:1,noRipple:1,noThread:1,tags:['rel'],
 text:c=>T(`Where will you take ${c.npc.en}?`,`带${c.npc.zh}去哪儿？`),
 opts:[0,1,2].map(i=>({l:c=>c.ds[i]?DATE_BY[c.ds[i]].n:T('',''),sub:c=>c.ds[i]&&DATE_BY[c.ds[i]].cost?T(`${DATE_BY[c.ds[i]].cost} taels`,`花${DATE_BY[c.ds[i]].cost}两`):null,if:(s,c)=>!!c.ds[i],out:[{t:T('',''),fx:{f:(s,c)=>dateGo(s,c.p,DATE_BY[c.ds[i]])}}]})).concat([
  {l:c=>T(`Let ${c.npc.en} choose`,`让${c.npc.zh}来定`),out:[{t:T('',''),fx:{f:(s,c)=>{if(!c.p)return;const t=tkTrait(c.p);const ok=DATES.filter(d=>(!d.if||d.if(s,c.p))&&(!d.cost||s.money>=d.cost));
    const d=wpick(ok,d=>Math.max(.05,(d.fit[t]||0)+.4)*((c.p.dtLast||[]).includes(d.id)?.3:1));say(s,`${c.p.n.py} knows exactly where ${tkP(c.p).he} wants to go.`,`${c.p.n.cn}早就想好了要去哪儿。`,'muted');dateGo(s,c.p,d,1)}}}]}])});
/* (the menu keeps only ids, so a save made mid-decision reloads cleanly) */
/* the date opens the menu; the rare bad night and the jealous scene from before still happen now and then */
(()=>{const D=PACT_BY.date;if(!D)return;D.run=function(s,p){
  if(p.rel==='lover'&&chance(.07)&&!(s.relCd&&s.relCd.jealous!=null&&s.age-s.relCd.jealous<3)&&typeof relEvent==='function'&&relEvent(s,p,'jealous'))return;
  const last=p.dtLast||[],ok=DATES.filter(d=>(!d.if||d.if(s,p))&&(!d.cost||s.money>=d.cost)),ds=[];const pool=ok.slice();
  while(ds.length<3&&pool.length){const d=wpick(pool,d=>last.includes(d.id)?.15:1);pool.splice(pool.indexOf(d),1);ds.push(d.id)}
  const c=scene();c.pid=p.id;c.p=p;c.npc=peNpc(s,p);c.ds=ds;runIncident(s,INC_BY.pk_date,c)}})();
