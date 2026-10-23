/* 江湖一生 · story series, third batch: a sword grave, a poison doctor's price, an escort's orphan, the informant,
   an old friend's child, half a treasure map, and a price on your head. Plus one more encounter for every region. */
'use strict';
const prT=(sex,k)=>T(PRON[sex||'m'][k],sex==='f'?'她':'他');

/* ===================== 剑冢 · The Sword Grave ===================== */
SDEF('sword',{n:T('The Sword Grave','剑冢'),theme:T('A dying swordsman gives you his sword. Whoever comes for it tells you who he really was.','一个垂死的剑客把剑交给了你。来找这把剑的人，会告诉你他到底是谁。'),
 ends:{returned:{n:T('Returned with honour','完璧归宗'),tone:'good'},inherited:{n:T('Passed to his child','交到了他孩子手里'),tone:'good'},defended:{n:T('You stood by a dead man','你替死人挡了一刀'),tone:'mixed'},
  broken:{n:T('The sword broken over his grave','剑折在他坟前'),tone:'mixed'},kept:{n:T('You kept it','剑归了你'),tone:'mixed'},taken:{n:T('Taken from you','被人夺走'),tone:'bad'},desecrated:{n:T('His grave dug up','坟被刨了'),tone:'bad'},lapsed:{n:T('Nobody ever came','始终没人来'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`Someone will come for ${r.facts.who.en}'s sword.`,`总会有人来找${r.facts.who.zh}的剑。`)},exp:10});
SOPEN('sword',{age:[16,60],w:2.5,tags:['wander'],
 ctx:s=>{const g=chance(.7)?'m':'f';return{npc:npc(s,{occ:g==='m'?13:14,sex:g,age:rint(40,60),lv:rint(90,180)})}},
 text:c=>T(`In a bamboo grove, a ${c.npc.sex==='f'?'swordswoman':'swordsman'} is sitting against a stalk, dying, very calmly. ${c.npc.He} holds out a sword in its scabbard. “${c.npc.en}. Bury me where no one will look. Someone will come for this.”`,`竹林里，一个${c.npc.sex==='f'?'女剑客':'剑客'}靠着竹子坐着，快死了，却很平静。${c.npc.ta}把一柄带鞘的剑递给你。“我叫${c.npc.zh}。把我埋在没人找得到的地方。会有人来找这把剑的。”`),
 opts:[{l:T('Bury them, and keep the sword safe','埋了，把剑收好'),out:[{t:T('You dig until dark. The sword is heavier than it looks.','你挖到天黑。那把剑比看上去沉。'),c:'muted',fx:{item:'coldsaber',f:(s,c)=>stBegin(s,'sword',c,'b',{who:nmOf(c.npc.n),sex:c.npc.sex,took:1},[1,3])}}]},
  {l:T('Bury the sword with them','把剑一起埋了'),out:[{t:T('Blade and owner, under the bamboo.','剑和人，一起埋在竹林底下。'),c:'muted',fx:{align:1,f:(s,c)=>stBegin(s,'sword',c,'b',{who:nmOf(c.npc.n),sex:c.npc.sex,grave:1},[1,3])}}]},
  {l:T('Take the sword and go','拿了剑就走'),out:[{t:T('You do not bury anyone.','你没埋任何人。'),c:'bad',fx:{item:'coldsaber',align:-3,f:(s,c)=>stBegin(s,'sword',c,'b',{who:nmOf(c.npc.n),sex:c.npc.sex,took:1,unburied:1},[1,3])}}]}]});
STI('sword','b',{self:1,
 ctx:s=>{const c=stCtx(s,'sword');c.v=pick([0,0,1,1,2]);c.lv=stFoe(s,1,15);c.has=s.items.some(x=>x.id==='coldsaber');return c},
 text:c=>{const w=c.f.who,p=prT(c.f.sex,'he'),pz=c.f.sex==='f'?'她':'他';return[
  T(`Three elders of a righteous sect find you. ${w.en} was their best, they say; ${p.en} left to avenge a wrong and never came back. They have come for the sword, and for the grave.`,`一个名门正派的三位长老找上门来。他们说${w.zh}是门中最出色的弟子，当年为报一桩冤仇出走，再没回来。他们是来取剑的，也是来寻坟的。`),
  T(`A family in mourning white finds you. ${w.en}, they say, killed their father and two sons. They want the sword, to break it.`,`一家披麻戴孝的人找上门来。他们说${w.zh}杀了他们的父亲和两个儿子。他们要那把剑，要亲手折断它。`),
  T(`A fifteen-year-old with ${w.en}'s eyes finds you. “I am ${w.en}'s child. I heard you were the last to see ${pz}.”`,`一个十五岁的孩子找上门来，眉眼跟${w.zh}一模一样。“我是${w.zh}的孩子。听说${pz}最后见的人是你。”`)][c.v]},
 opts:[{l:T('Give it back, and show them the grave','把剑还给他们，带他们去坟前'),if:(s,c)=>c.v===0&&(c.has||c.f.grave),out:[{t:T('They bow at the grave, then to you. Your name is spoken well in their hall from now on.','他们在坟前拜了，又向你拜了。从此他们门中提起你，都是好话。'),c:'gold',fx:{fame:3,align:2,f:(s,c)=>{const i=s.items.findIndex(x=>x.id==='coldsaber');if(i>=0)s.items.splice(i,1);stEnd(s,'sword','returned')}}}]},
  {l:T('Keep the sword','剑不给'),if:(s,c)=>c.v===0&&c.has,fight:(s,c)=>({foe:{name:T('the eldest of the three','三人中的大长老'),lv:c.lv,fixed:1},stakes:'light',title:T('The sword','那把剑'),cause:T('a dispute over a sword','争剑')}),
   win:[{t:T('They leave without it, and remember your face.','他们空手走了，记住了你的脸。'),c:'muted',fx:{fame:1,f:(s,c)=>stEnd(s,'sword','kept')}}],
   lose:[{t:T('They take it. They leave you your life.','剑被他们拿走了，你的命他们留下了。'),c:'bad',fx:{f:(s,c)=>{const i=s.items.findIndex(x=>x.id==='coldsaber');if(i>=0)s.items.splice(i,1);stEnd(s,'sword','taken')}}}]},
  {l:T('Hand them the sword','把剑交给他们'),if:(s,c)=>c.v===1&&c.has,out:[{t:T('They break it across a stone and walk away lighter.','他们在石头上折断了那把剑，走的时候像是轻了许多。'),c:'muted',fx:{f:(s,c)=>{const i=s.items.findIndex(x=>x.id==='coldsaber');if(i>=0)s.items.splice(i,1);stEnd(s,'sword','broken')}}}]},
  {l:T('Tell them where the grave is','告诉他们坟在哪'),if:(s,c)=>c.v===1&&!c.f.unburied,out:[{t:T('You hear later what they did to it.','后来你听说了他们对那座坟做了什么。'),c:'bad',fx:{align:-3,f:(s,c)=>stEnd(s,'sword','desecrated')}}]},
  {l:T('Refuse. The dead have paid','不给。人已经死了'),if:(s,c)=>c.v===1,fight:(s,c)=>({foe:{name:T('the eldest son','长子'),lv:Math.round(c.lv*.85),fixed:1},stakes:'injury',title:T('A dead man’s debts','死人的债'),cause:T('a dead man’s debts','死人的债')}),
   win:[{t:T('They go. You are not sure you were right.','他们走了。你不确定自己做得对。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'sword','defended')}}],
   lose:[{t:T('They take the sword, and break it in front of you.','他们夺了剑，当着你的面折断了。'),c:'bad',fx:{f:(s,c)=>{const i=s.items.findIndex(x=>x.id==='coldsaber');if(i>=0)s.items.splice(i,1);stEnd(s,'sword','broken')}}}]},
  {l:T('Give the child the sword, and everything you know','把剑和你知道的一切都交给孩子'),if:(s,c)=>c.v===2&&(c.has||c.f.grave),out:[{t:T('The child kneels at the grave a long time. Before leaving, they bow to you as to an elder.','孩子在坟前跪了很久。临走，向你行了晚辈之礼。'),c:'gold',fx:{align:3,meet:'friend',bond:70,f:(s,c)=>{const i=s.items.findIndex(x=>x.id==='coldsaber');if(i>=0)s.items.splice(i,1);stEnd(s,'sword','inherited')}}}]},
  {l:T('Keep the sword; send the child home','剑留下，打发孩子回家'),if:(s,c)=>c.v===2&&c.has,out:[{t:T('The child goes. The sword stays on your wall, and you stop looking at it.','孩子走了。剑挂在你墙上，你不再去看它。'),c:'bad',fx:{align:-3,f:(s,c)=>stEnd(s,'sword','kept')}}]},
  {l:T('Take them to the grave','带去坟前'),if:(s,c)=>(c.v!==1)&&!c.has&&!c.f.grave,out:[{t:T('There is no grave. You left the body. You say so.','没有坟。你当年没埋。你照实说了。'),c:'bad',fx:{align:-2,f:(s,c)=>stEnd(s,'sword','desecrated')}}]}]});

/* ===================== 毒医之约 · The Poison Doctor's Price ===================== */
SDEF('poison',{n:T('The Poison Doctor’s Price','毒医之约'),theme:T('A healer from a poison school cures you. The price is a favour, named later.','毒门出身的大夫治好了你。代价是一个人情，日后再说。'),
 ends:{repaid:{n:T('Debt paid, no harm done','人情还了，没伤着谁'),tone:'good'},complicit:{n:T('You carried the poison','毒是你送去的'),tone:'bad'},blood:{n:T('Paid in someone else’s blood','拿别人的血来还'),tone:'bad'},
  reneged:{n:T('You refused, and paid for it','你没还，也付出了代价'),tone:'mixed'},betrayed:{n:T('You handed her over','你把她交了出去'),tone:'mixed'},lapsed:{n:T('She never came to collect','她再没来讨'),tone:'good'}},
 hint:{b:(s,r)=>T(`You owe ${r.facts.who.en} a favour. ${r.facts.sexF?'She':'He'} will come for it.`,`你欠${r.facts.who.zh}一个人情。${r.facts.sexF?'她':'他'}会来讨的。`)},exp:12});
SOPEN('poison',{age:[18,70],w:10,when:s=>!!s.ill&&s.ill!=='cold',
 ctx:s=>{const g=chance(.6)?'f':'m';return{npc:npc(s,{occ:10,sex:g,age:rint(30,45)}),ill:ILLS[s.ill].get}},
 text:c=>T(`A doctor in black with a silver snake on ${c.npc.his} sleeve stops you in the street: ${c.npc.en}. “I can cure that. Ordinary doctors cannot. The price is one favour, which I will name later.”`,`一个黑衣大夫在街上拦住了你，袖口绣着一条银蛇：${c.npc.zh}。“你这病，我能治，寻常大夫治不了。诊金是一个人情，以后再说。”`),
 opts:[{l:T('Accept','答应'),out:[{t:T('The medicine is bitter and strange, and it works.','药又苦又怪，可真管用。'),c:'good',fx:{cure:1,heal:20,f:(s,c)=>stBegin(s,'poison',c,'b',{who:nmOf(c.npc.n),sexF:c.npc.sex==='f'?1:0},[3,7])}}]},
  {l:T('Refuse','不要'),out:[{t:T('“As you like.” The snake on the sleeve seems to watch you go.','“随你。”袖口那条蛇像是在目送你。'),c:'muted'}]}]});
STI('poison','b',{self:1,
 ctx:s=>{const c=stCtx(s,'poison');c.v=pick([0,0,1,2]);c.lv=stFoe(s,1.05,15);return c},
 text:c=>{const w=c.f.who;return[T(`${w.en} comes to collect. A sealed box, to be taken to a house in the next county, unopened.`,`${w.zh}来讨人情了：把一只封好的盒子送到邻县一户人家，不许打开。`),
  T(`${w.en} comes to collect. There is a herb that grows only in a certain sect's garden. ${c.npc.He} wants it.`,`${w.zh}来讨人情了：有一种草药，只长在某个门派的药圃里。${c.npc.ta}要它。`),
  T(`${w.en} comes to collect. The magistrate who hanged ${c.npc.his} brother on false evidence is travelling through next week. ${c.npc.He} wants him dead.`,`${w.zh}来讨人情了：当年凭假证据吊死${c.npc.ta}哥哥的那个县官，下礼拜要路过这里。${c.npc.ta}要他死。`)][c.v]},
 opts:[{l:T('Deliver it unopened','原封不动送去'),if:(s,c)=>c.v===0,out:[{w:3,t:T('Inside, you learn later, was the only antidote for a dying child. The family names the child after you.','后来你才知道，盒子里是一个垂死孩子唯一的解药。那家人用你的名字给孩子起了名。'),c:'gold',fx:{align:3,f:(s,c)=>stEnd(s,'poison','repaid')}},{w:2,t:T('The man of the house is dead within the week. People ask who brought the box.','不出七天，那家的男主人就死了。有人在打听，盒子是谁送来的。'),c:'bad',fx:{align:-5,wanted:1,f:(s,c)=>stEnd(s,'poison','complicit')}}]},
  {l:T('Open it first','先打开看看'),if:(s,c)=>c.v===0,out:[{w:3,t:T('Medicine, by the smell of it. You deliver it. It saves a child.','闻着像药。你送了过去，救了一个孩子。'),c:'good',fx:{f:(s,c)=>stEnd(s,'poison','repaid')}},{w:2,t:T('Poison, by the smell of it. You throw it in the river. That winter, your old illness comes back.','闻着是毒。你把它扔进了河里。那年冬天，你的旧病又犯了。'),c:'muted',fx:{align:3,ill:'inner',f:(s,c)=>stEnd(s,'poison','reneged')}}]},
  {l:T('Steal the herb','去偷药'),if:(s,c)=>c.v===1,out:[{w:s=>1+power(s)/60,t:T('In and out at night. Nobody knows.','夜里进去又出来，神不知鬼不觉。'),c:'muted',fx:{align:-2,f:(s,c)=>stEnd(s,'poison','repaid')}},{w:1,t:T('You are caught on the wall and beaten off the property, but you have the herb.','你在墙头被逮住，挨了一顿打赶了出来，药倒是到手了。'),c:'muted',fx:{hurt:[8,16],cause:T('a theft gone wrong','偷东西失了手'),align:-2,f:(s,c)=>stEnd(s,'poison','repaid')}}]},
  {l:T('Ambush the magistrate','伏击县官'),if:(s,c)=>c.v===2,fight:(s,c)=>({foe:{name:T('the magistrate’s guards','县官的护卫'),lv:c.lv,fixed:1},stakes:'injury',title:T('A poison doctor’s price','毒医的诊金'),cause:T('an ambush','行刺')}),
   win:[{t:T('It is done. The doctor nods once and disappears. Your name goes up on the wanted lists.','事成了。大夫点了下头，就不见了。你的名字上了通缉榜。'),c:'bad',fx:{align:-10,wanted:2,f:(s,c)=>stEnd(s,'poison','blood')}}],
   lose:[{t:T('You fail, and run. The doctor is not pleased, and your illness comes back.','你失了手，逃了。大夫很不高兴，你的旧病也回来了。'),c:'bad',fx:{wanted:1,ill:'inner',f:(s,c)=>stEnd(s,'poison','reneged')}}]},
  {l:T('Refuse','拒绝'),out:[{t:T('“Then I take back what I gave.” By spring, the illness is back.','“那我就把给你的收回来。”到了开春，病又回来了。'),c:'muted',fx:{ill:'inner',align:2,f:(s,c)=>stEnd(s,'poison','reneged')}}]},
  {l:T('Turn the doctor over to the constables','把大夫交给官府'),if:(s,c)=>c.v===2,fight:(s,c)=>({foe:{name:c.f.who,lv:Math.round(c.lv*.9),fixed:1},stakes:'injury',title:T('The poison doctor','毒医'),cause:T('poison','中毒')}),
   win:[{t:T('You bring the doctor in. The magistrate thanks you, and never learns what you saved him from.','你把大夫押去了官府。县官谢了你，却始终不知道你替他挡下了什么。'),c:'muted',fx:{fame:2,f:(s,c)=>stEnd(s,'poison','betrayed')}}],
   lose:[{t:T('A scratch from a needle. You are sick for a year.','被针划了一下。你病了整整一年。'),c:'bad',fx:{ill:'inner',hurt:[10,20],cause:T('poison','中毒'),f:(s,c)=>stEnd(s,'poison','reneged')}}]}]});

/* ===================== 镖局遗孤 · The Escort's Orphan ===================== */
SDEF('orphan',{n:T('The Escort’s Orphan','镖局遗孤'),theme:T('A child survives a convoy robbery. Whether you were the robber decides almost everything.','一场劫镖里活下来一个孩子。劫镖的是不是你，几乎决定了一切。'),
 ends:{grateful:{n:T('An escort agency in your honour','一家为你而开的镖局'),tone:'good'},avenged:{n:T('The robbers brought to account','劫匪伏法'),tone:'good'},raised:{n:T('Raised as your own','视如己出'),tone:'good'},forgiven:{n:T('Forgiven by the one you orphaned','被你害成孤儿的人原谅了你'),tone:'mixed'},
  bled:{n:T('Paid in blood','血债血偿'),tone:'bad'},slain:{n:T('You cut down your past','你亲手斩断了过去'),tone:'bad'},lapsed:{n:T('A child grown and gone','孩子长大，走远了'),tone:'mixed'}},
 hint:{r:(s,r)=>T(`${r.facts.kid.en} is growing up in your house.`,`${r.facts.kid.zh}在你家里一天天长大。`),h:(s,r)=>T(`Somewhere, ${r.facts.kid.en} is growing up, and remembers you.`,`某个地方，${r.facts.kid.zh}在长大，记着你。`),g:(s,r)=>T(`You left ${r.facts.kid.en} at a temple.`,`你把${r.facts.kid.zh}留在了寺里。`)},exp:16});
const orphanKid=()=>{const g=chance(.65)?'m':'f',n=genName(g);return{en:n.py,zh:n.cn,sex:g}};
SOPEN('orphan',{id:'orphan_rob',age:[16,60],w:8,tags:['af_robconvoy'],when:()=>chance(.2),
 ctx:s=>({kid:orphanKid()}),
 text:c=>T(`When it is over, a child of eight is clinging to the dead escort chief and staring at your face, learning it.`,`劫完了，一个八岁的孩子抱着死去的总镖头，直勾勾盯着你的脸，像要把它刻进心里。`),
 opts:[{l:T('Leave the child','不管那孩子'),out:[{t:T('You ride off. The stare follows you a long way.','你骑马走了。那道目光跟了你很远。'),c:'bad',fx:{f:(s,c)=>stBegin(s,'orphan',c,'h',{kid:c.kid,robbed:1},[10,14])}}]},
  {l:T('Leave the child at a temple, with silver','把孩子连同银子送到庙里'),out:[{t:T('The monks take the child and the silver and do not ask.','和尚收下了孩子和银子，什么也没问。'),c:'muted',fx:{money:-30,f:(s,c)=>stBegin(s,'orphan',c,'h',{kid:c.kid,robbed:1,temple:1},[10,14])}}]},
  {l:T('Take the child home and raise them','把孩子带回家养'),out:[{t:T('The child does not speak for a month.','孩子一个月没开口说话。'),c:'muted',fx:{f:(s,c)=>{c.npc=npc(s,{name:genName(c.kid.sex,null),sex:c.kid.sex,age:8,occ:c.kid.sex==='m'?21:20,lv:3});c.npc.n={cn:c.kid.zh,py:c.kid.en,sur:null};applyFx(s,{meet:'disciple',bond:30},c);stBegin(s,'orphan',c,'r',{kid:c.kid,robbed:1},[6,9])}}}]}]});
SOPEN('orphan',{id:'orphan_road',age:[16,60],w:2,tags:['wander'],
 ctx:s=>({kid:orphanKid()}),
 text:c=>T(`On the road: an overturned escort cart, dead guards, and a child of eight hiding under the wheels. The robbers are long gone.`,`路上：一辆翻倒的镖车，几个死去的镖师，车轮底下躲着一个八岁的孩子。劫匪早跑了。`),
 opts:[{l:T('Take the child home and raise them','带回家养'),out:[{t:T('The child holds your sleeve the whole way.','孩子一路攥着你的袖子。'),c:'good',fx:{f:(s,c)=>{c.npc=npc(s,{sex:c.kid.sex,age:8,occ:c.kid.sex==='m'?21:20,lv:3});c.npc.n={cn:c.kid.zh,py:c.kid.en,sur:null};applyFx(s,{meet:'disciple',bond:60},c);stBegin(s,'orphan',c,'r',{kid:c.kid},[6,9])}}}]},
  {l:T('Bring the child to a temple','送去庙里'),out:[{t:T('You leave some silver with the monks.','你给和尚留了些银子。'),c:'good',fx:{money:-20,align:2,f:(s,c)=>stBegin(s,'orphan',c,'g',{kid:c.kid},[12,16])}}]},
  {l:T('Ride on','走你的路'),out:[{t:T('Someone else will find the child. Probably.','会有别人发现那孩子的。大概吧。'),c:'muted',fx:{align:-2}}]}]});
STI('orphan','r',{self:1,
 ctx:s=>{const c=stCtx(s,'orphan');c.lv=stFoe(s,.9,12);return c},
 text:c=>c.f.robbed?T(`${c.f.kid.en} is grown, and asks you straight out, at dinner: “Who robbed my father’s convoy? You were there. I remember.”`,`${c.f.kid.zh}长大了。吃饭时直截了当地问你：“劫我爹镖车的是谁？你当时在场。我记得。”`)
  :T(`${c.f.kid.en} is grown, and has found out which gang robbed the convoy. They are still on the same road. “Will you come with me?”`,`${c.f.kid.zh}长大了，查出了当年劫镖的是哪伙人。他们还在那条道上。“你陪我去吗？”`),
 opts:[{l:T('Tell the truth','说实话'),if:(s,c)=>c.f.robbed,out:[{w:s=>s.t.heart*.4+(s.align>0?2:0),t:T('A long silence. “You raised me. I cannot undo either thing.” They stay.','良久的沉默。“你养大了我。这两件事，哪件我都抹不掉。”孩子留了下来。'),c:'gold',fx:{bond:5,f:(s,c)=>stEnd(s,'orphan','forgiven')}},
   {w:2,t:T('They leave that night with nothing but a knife. You know you will see them again.','孩子当晚就走了，只带了一把刀。你知道还会再见的。'),c:'bad',fx:{bond:-50,f:(s,c)=>stGo(s,'orphan','h',{told:1},[3,6])}}]},
  {l:T('Lie','撒谎'),if:(s,c)=>c.f.robbed,out:[{t:T('They believe you. For now.','孩子信了。暂时。'),c:'muted',fx:{f:(s,c)=>stGo(s,'orphan','h',{lied:1},[3,7])}}]},
  {l:T('Ride with them','陪着去'),if:(s,c)=>!c.f.robbed,fight:(s,c)=>({foe:{name:T('the convoy robbers','当年的劫匪'),lv:c.lv,fixed:1},stakes:'injury',title:T('For the convoy','为了那趟镖'),cause:T('robbers','劫匪')}),
   win:[{t:T('Side by side, it is done. They call you parent for the first time.','并肩把事了了。孩子头一回叫了你一声爹娘。'),c:'gold',fx:{fame:3,bond:20,f:(s,c)=>stEnd(s,'orphan','avenged')}}],
   lose:[{t:T('You both barely get away. “Next time,” they say, and mean it, but they are alive, and so are you.','你们俩差点没逃出来。“下回再来。”孩子说，是认真的。可你们都还活着。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'orphan','raised')}}]},
  {l:T('Talk them out of it','劝孩子放下'),if:(s,c)=>!c.f.robbed,out:[{t:T('They are angry for a year. Then they start an honest escort business instead, and do well.','孩子气了一年。后来开了家正经镖局，生意不错。'),c:'good',fx:{f:(s,c)=>stEnd(s,'orphan','raised')}}]}]});
STI('orphan','h',{self:1,
 ctx:s=>{const c=stCtx(s,'orphan');c.lv=Math.max(stFoe(s,1.1,20),30);return c},
 text:c=>T(`A ${c.f.kid.sex==='f'?'woman':'man'} is waiting outside your door with a blade: ${c.f.kid.en}, the child from the convoy, grown. ${c.f.lied?'“You lied to me.”':'“I have practised for this every day.”'}`,`门外站着一个人，手里握着刀：${c.f.kid.zh}，当年镖车旁的那个孩子，长大了。${c.f.lied?'“你骗了我。”':'“为了这一天，我每天都在练。”'}`),
 opts:[{l:T('Fight','动手'),fight:(s,c)=>({foe:{name:T(c.f.kid.en,c.f.kid.zh),lv:c.lv,fixed:1},stakes:'injury',title:T('The convoy’s child','镖车旁的孩子'),cause:T('an old robbery','当年那趟劫镖')}),
   win:[{t:T('You win. It does not feel like winning.','你赢了，却一点也不像赢了。'),c:'bad',fx:{align:-3,happy:-8,f:(s,c)=>{const p=c.pid&&person(s,c.pid);if(p){p.rel='enemy';p.bond=0}stEnd(s,'orphan','slain')}}}],
   lose:[{t:T('They leave you alive, which is their choice to make.','对方留了你一条命。这是对方的选择。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'orphan','bled')}}]},
  {l:T('Lay down your weapon and confess','放下兵器，认罪'),out:[{w:s=>s.t.heart*.3,t:T('The blade stops at your throat. “Live with it, then.” They go.','刀停在你喉咙前。“那你就带着它活下去吧。”说完走了。'),c:'muted',fx:{align:3,f:(s,c)=>stEnd(s,'orphan','forgiven')}},{w:2,t:T('The blade does not stop in time.','刀没能及时停住。'),c:'bad',fx:{hurt:[25,45],cause:T('an old robbery repaid','当年劫镖的报应'),f:(s,c)=>stEnd(s,'orphan','bled')}}]}]});
STI('orphan','g',{tags:['town','wander'],self:1,
 text:c=>T(`A new escort agency has opened, its chief young and well spoken of. You realise it is ${c.f.kid.en}, from the temple. There is a plaque in the hall with a line about a stranger on the road.`,`新开了一家镖局，总镖头年纪轻轻，口碑却好。你这才认出来，是庙里的那个${c.f.kid.zh}。大堂里挂着一块匾，写着一句关于路上那个陌生人的话。`),
 opts:[{l:T('Go in and say hello','进去打个招呼'),out:[{t:T('From then on, your goods travel free.','从此你的货走镖分文不取。'),c:'gold',fx:{meet:'friend',bond:80,happy:6,f:(s,c)=>stEnd(s,'orphan','grateful')}}]},
  {l:T('Walk on, pleased','心里高兴，没进去'),out:[{t:T('You never tell them. You do not need to.','你没告诉对方。也用不着。'),c:'good',fx:{happy:5,f:(s,c)=>stEnd(s,'orphan','grateful')}}]}]});

/* ===================== 官府线人 · The Informant ===================== */
SDEF('inf',{n:T('The Informant','官府线人'),theme:T('The constables will forget your crimes if you tell them about your friends.','捕快说，只要你肯说说朋友们的事，你的案子就一笔勾销。'),
 ends:{double:{n:T('You played both sides, and won','两头都应付过去了'),tone:'good'},clean:{n:T('You walked away','你抽身走了'),tone:'mixed'},informer:{n:T('Known as an informer','落了个线人的名声'),tone:'bad'},jailed:{n:T('Caught in the middle','两头不是人'),tone:'bad'},lapsed:{n:T('Forgotten by the yamen','衙门把你忘了'),tone:'good'}},
 hint:{b:T('Constable Li expects your first report. (Visit town.)','李捕头等着你的第一份消息。（下一步：进城）'),c:T('Your deal with the constables is not finished.','你跟捕快的交易还没了。')},exp:8});
SOPEN('inf',{age:[18,65],w:9,tags:['town'],when:s=>s.wanted>=1,
 text:(c,s)=>T(`Constable Li catches you alone in an alley. Instead of arresting you, he lights a pipe. “Your wanted notice could disappear. All I want is to hear, now and then, what your friends in the jianghu are up to.”`,`李捕头在巷子里堵住了你。他没抓你，反倒点了一袋烟。“你的海捕文书，可以没了。我只想时不时听你说说，你那些江湖朋友在忙什么。”`),
 opts:[{l:T('Take the deal','答应'),out:[{t:T('Your notice comes down the next day.','第二天，你的通缉告示就撕了。'),c:'muted',fx:{f:(s,c)=>{s.wanted=0;stBegin(s,'inf',c,'b',{},[1,2])}}}]},
  {l:T('Refuse','不干'),out:[{w:2,t:T('He shrugs and knocks out his pipe. “Your choice.”','他耸耸肩，磕了磕烟袋。“随你。”'),c:'muted'},{w:1,t:T('He arrests you on the spot.','他当场就把你拿下了。'),c:'bad',fx:{jail:1}}]}]});
STI('inf','b',{tags:['town'],self:1,
 ctx:s=>{const c=stCtx(s,'inf');const fr=living(s,['friend','sworn','fellow']);c.fr=fr.length?pick(fr):null;return c},
 text:c=>c.fr?T(`Constable Li wants to know where ${c.fr.n.py} has been going at night.`,`李捕头想知道，${c.fr.n.cn}夜里都去了哪儿。`):T(`Constable Li wants names: who runs the smuggling on the river.`,`李捕头要名字：江上的私货是谁在做。`),
 opts:[{l:c=>c.fr?T('Tell him the truth','照实说'):T('Give him the names','把名字给他'),out:[{t:T('He writes it down and pays you. You feel nothing, at first.','他记下来，给了你钱。一开始，你什么感觉也没有。'),c:'bad',fx:{money:[30,60],align:-4,f:(s,c)=>{if(c.fr){c.fr.bond=Math.max(0,c.fr.bond-30)}stGo(s,'inf','c',{told:1,fr:c.fr?c.fr.id:null},[1,3])}}}]},
  {l:T('Feed him something false','给他编一套'),out:[{t:T('You give him a story that sends him the wrong way.','你编了个故事，把他引到岔路上去。'),c:'muted',fx:{f:(s,c)=>stGo(s,'inf','c',{lied:1},[1,3])}}]},
  {l:T('Tell him the deal is off','跟他说不干了'),out:[{t:T('He puts your notice back up, and adds a line to it.','他把你的告示又贴了回去，还添了一行字。'),c:'muted',fx:{wanted:2,f:(s,c)=>stEnd(s,'inf','clean')}}]}]});
STI('inf','c',{self:1,
 text:c=>c.f.told?T(`Word has got out in the jianghu that someone has been talking to Constable Li. People are looking at each other.`,`江湖上传开了，说有人在给李捕头递消息。大家你看我、我看你。`):T(`Constable Li has worked out that your story was a lie.`,`李捕头琢磨过来了：你那套话是编的。`),
 opts:[{l:T('Keep your head down','低头不吭声'),if:(s,c)=>c.f.told,out:[{w:2,t:T('It comes out anyway. Doors close to you all over the county.','还是露了馅。全县的江湖人都对你关上了门。'),c:'bad',fx:{fame:-3,align:-3,f:(s,c)=>{const p=c.f.fr&&person(s,c.f.fr);if(p){p.rel='enemy';p.bond=0}stEnd(s,'inf','informer')}}},{w:1,t:T('Suspicion falls on someone else. You do not correct it.','怀疑落到了别人头上。你没吭声。'),c:'muted',fx:{align:-3,f:(s,c)=>stEnd(s,'inf','informer')}}]},
  {l:T('Talk your way out','靠一张嘴糊弄过去'),if:(s,c)=>c.f.lied,out:[{w:s=>s.smarts/30,t:T('You convince him you were lied to as well. He thanks you for your honesty.','你让他相信你也是被骗的。他还谢你老实。'),c:'gold',fx:{f:(s,c)=>stEnd(s,'inf','double')}},{w:1,t:T('He does not believe a word.','他一个字也不信。'),c:'bad',fx:{jail:[1,2],f:(s,c)=>stEnd(s,'inf','jailed')}}]},
  {l:T('Leave the county','离开这个县'),out:[{t:T('You leave before either side can make up its mind about you.','趁两边都还没拿定主意，你先走了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'inf','clean')}}]}]});

/* ===================== 故人之子 · The Old Friend's Child ===================== */
SDEF('fchild',{n:T('The Old Friend’s Child','故人之子'),theme:T('A friend dies and their child arrives at your door with a letter: look after them.','故人去世，孩子拿着一封信找上门来：请你照看。'),
 ends:{family:{n:T('A second family','又多了一个家人'),tone:'good'},avenged:{n:T('The parent’s death answered','故人之仇得报'),tone:'good'},independent:{n:T('Grown and on their own','长大了，自立门户'),tone:'good'},
  stranger:{n:T('A stranger who owes you nothing','一个什么也不欠你的陌生人'),tone:'mixed'},lost:{n:T('Lost to the jianghu','被江湖吞没了'),tone:'bad'},lapsed:{n:T('Lost touch','断了音信'),tone:'mixed'}},
 hint:{b:(s,r)=>T(`${r.facts.kid.en}, ${r.facts.dead.en}'s child, is growing up.`,`${r.facts.dead.zh}的孩子${r.facts.kid.zh}，在一天天长大。`)},exp:14,
 gone:(s,r,p)=>{if(p.gone){stEnd(s,'fchild','stranger');return}say(s,`${p.n.py}, ${r.facts.dead.en}'s child, has died.`,`${r.facts.dead.zh}的孩子${p.n.cn}没了。`,'bad');happy(s,-10);stEnd(s,'fchild','lost')}});
(()=>{const d0=onDeath;onDeath=function(s,p){d0(s,p);try{if(s.alive&&s.age>=22&&(!s._fcPend||s.age-s._fcPend.at>3)&&stCan(s,'fchild')&&['friend','sworn','fellow'].includes(p.rel)&&p.bond>=40&&p.age<70&&chance(.55))
  s._fcPend={dead:T(p.n.py,p.n.cn),sur:p.n.sur||null,killed:!!(p.cause&&/kill|slain|murder|杀|刺/.test((p.cause.en||'')+(p.cause.zh||''))),at:s.age}}catch(e){}}})();
SOPEN('fchild',{w:12,when:s=>!!s._fcPend&&s.age-s._fcPend.at<=2,
 ctx:s=>{const P=s._fcPend,g=chance(.5)?'m':'f',n=genName(g,P.sur);return{dead:P.dead,killed:P.killed,kid:{en:n.py,zh:n.cn,sex:g},npc:npc(s,{name:n,sex:g,age:rint(8,13),occ:g==='m'?21:20,lv:3})}},
 text:c=>T(`A child is at your door with a bundle and a letter in ${c.dead.en}'s hand: “If you are reading this, I am gone. Please look after ${c.kid.en}.”`,`门口站着一个孩子，背着包袱，手里拿着一封${c.dead.zh}的亲笔信：“你读到这封信时，我已经不在了。求你照看${c.kid.zh}。”`),
 opts:[{l:T('Take the child in','收下'),out:[{t:T('You make up a bed. The child sleeps for two days.','你铺了张床。孩子睡了整整两天。'),c:'good',fx:{meet:'disciple',bond:60,f:(s,c)=>{stBegin(s,'fchild',c,'b',{dead:c.dead,kid:c.kid,killed:c.killed?1:0,took:1},[6,9]);delete s._fcPend}}}]},
  {l:T('Pay for an apprenticeship with a craftsman (40 taels)','出钱送去学门手艺（四十两）'),cost:40,out:[{t:T('A good carpenter, a fair man. You visit at New Year.','是个好木匠，为人厚道。过年你去看看。'),c:'good',fx:{f:(s,c)=>{stBegin(s,'fchild',c,'b',{dead:c.dead,kid:c.kid,killed:c.killed?1:0,apprenticed:1},[6,9]);delete s._fcPend}}}]},
  {l:T('Give the child some silver and send them away','给些银子，打发走'),out:[{t:T('The child takes the silver without a word.','孩子一声不吭地接过银子。'),c:'muted',fx:{money:-15,f:(s,c)=>{stBegin(s,'fchild',c,'b',{dead:c.dead,kid:c.kid,killed:c.killed?1:0,sent:1},[8,12]);delete s._fcPend}}}]}]});
STI('fchild','b',{self:1,tags:['town'],
 ctx:s=>{const c=stCtx(s,'fchild');c.lv=stFoe(s,1,15);return c},
 text:c=>{const k=c.f.kid,d=c.f.dead;if(c.f.sent)return T(`A young ${k.sex==='f'?'woman':'man'} passes you in the street and nods coolly: ${k.en}. ${d.en}'s child. Doing fine, apparently, without you.`,`街上一个年轻${k.sex==='f'?'姑娘':'人'}从你身边走过，冷冷地点了点头：${k.zh}，${d.zh}的孩子。看样子，没有你也过得不错。`);
  if(c.f.killed)return T(`${k.en} is grown, and has found the one who killed ${d.en}. “I am going. With you or without you.”`,`${k.zh}长大了，查到了害死${d.zh}的人。“我要去。你陪不陪我都去。”`);
  return T(`${k.en} is grown, and wants to marry. The family wants a proper betrothal gift, and ${k.en} has nobody else to ask.`,`${k.zh}长大了，想成亲。对方家里要一份像样的聘礼，${k.zh}除了你，没人可求。`)},
 opts:[{l:T('Say hello properly','好好打个招呼'),if:(s,c)=>c.f.sent,out:[{t:T('A cup of tea, polite and short. You both know what you did.','喝了杯茶，客气，简短。你们心里都清楚当年的事。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'fchild','stranger')}}]},
  {l:T('Go together','一起去'),if:(s,c)=>!c.f.sent&&c.f.killed,fight:(s,c)=>({foe:{name:T('the killer','凶手'),lv:c.lv,fixed:1},stakes:'injury',title:T('For an old friend','为了故人'),cause:T('an old friend’s killer','故人的仇家')}),
   win:[{t:c=>T(`It is done. At ${c.f.dead.en}'s grave, the child says, “Now I have one parent left, and it is you.”`,`事了了。在${c.f.dead.zh}坟前，孩子说：“如今我就剩一个亲人了，就是你。”`),c:'gold',fx:{fame:2,bond:20,f:(s,c)=>stEnd(s,'fchild','avenged')}}],
   lose:[{t:T('You both survive, barely. The killer is still out there, but you are family now, whatever happens.','你们俩都捡回一条命。凶手还在外面，可不管怎样，你们已经是一家人了。'),c:'muted',fx:{bond:15,f:(s,c)=>stEnd(s,'fchild','family')}}]},
  {l:T('Talk them out of it','劝住'),if:(s,c)=>!c.f.sent&&c.f.killed,out:[{w:2,t:T('They stay, and stay angry, and in time stop being angry.','孩子留下了，气了很久，后来也就不气了。'),c:'good',fx:{f:(s,c)=>stEnd(s,'fchild','independent')}},{w:1,t:T('They go alone, and do not come back.','孩子一个人去了，再没回来。'),c:'bad',fx:{happy:-10,f:(s,c)=>stEnd(s,'fchild','lost')}}]},
  {l:T('Pay the betrothal gift (100 taels)','出聘礼（一百两）'),if:(s,c)=>!c.f.sent&&!c.f.killed,cost:100,out:[{t:T('You sit in the parent’s seat at the wedding. Nobody thinks it is strange.','婚礼上，你坐在了高堂的位置。没人觉得奇怪。'),c:'gold',fx:{happy:10,f:(s,c)=>{const p=c.pid&&person(s,c.pid);if(p){p.rel='friend';p.bond=Math.max(p.bond,85)}stEnd(s,'fchild','family')}}}]},
  {l:T('Say they must earn it themselves','让孩子自己挣'),if:(s,c)=>!c.f.sent&&!c.f.killed,out:[{t:T('They do, in three years. They invite you anyway.','孩子三年就挣够了。婚礼还是请了你。'),c:'good',fx:{f:(s,c)=>stEnd(s,'fchild','independent')}}]}]});

/* ===================== 藏宝图的另一半 · The Other Half of the Map ===================== */
SDEF('map',{n:T('The Other Half of the Map','藏宝图的另一半'),theme:T('Half a treasure map, and a stranger with the other half.','半张藏宝图，和拿着另一半的陌生人。'),
 ends:{shared:{n:T('Treasure split fairly','宝藏平分'),tone:'good'},all:{n:T('All of it, for you','全归了你'),tone:'mixed'},betrayed:{n:T('Betrayed at the last step','最后一步被出卖'),tone:'bad'},
  empty:{n:T('An empty chest and a joke','一只空箱子和一句玩笑'),tone:'mixed'},sold:{n:T('Sold your half','把你那一半卖了'),tone:'mixed'},lapsed:{n:T('Half a map in a drawer','抽屉里的半张图'),tone:'mixed'}},
 hint:{b:T('Somewhere is the other half of your map. (Roam, travel or visit town.)','你那半张图的另一半，总在什么地方。（下一步：游历、远行或进城）'),c:(s,r)=>T(`You and ${r.facts.who?r.facts.who.en:'your partner'} have the whole map. (Roam or travel.)`,`你和${r.facts.who?r.facts.who.zh:'同伴'}凑齐了整张图。（下一步：游历或远行）`)},exp:10});
SOPEN('map',{age:[15,65],w:2.5,tags:['town','wander'],
 text:T('A drunk old sailor sells you half of a map for the price of his next drink. The half has a river, three pines and an X with nothing round it.','一个喝醉的老水手拿半张图换他下一壶酒钱。这半张上有条河、三棵松，还有一个孤零零的叉。'),
 opts:[{l:T('Buy it (5 taels)','买下（五两）'),cost:5,out:[{t:T('He is asleep before you have folded it.','你还没叠好，他已经睡着了。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'map',c,'b',{},[1,2])}}]},{l:T('Not interested','没兴趣'),out:[{t:T('He offers it to the next table.','他转身又去问下一桌了。'),c:'muted'}]}]});
STI('map','b',{tags:['wander','af_travel','town'],
 ctx:s=>{const c=stCtx(s,'map');c.npc=npc(s,{age:rint(25,50)});c.lv=stFoe(s,.9,10);return c},
 text:c=>T(`At an inn, ${c.npc.en}, ${c.npc.desc.en}, is studying a scrap of paper by the lamp: three pines, a river, and the other half of your X.`,`客栈里，${c.npc.zh}，${c.npc.desc.zh}，正就着灯看一张纸片：三棵松、一条河，还有你那个叉的另一半。`),
 opts:[{l:T('Propose a partnership','提议合伙'),out:[{t:T('You shake on halves. Neither of you lets go of your paper.','你们说好对半分，握了手。谁也没松开自己那张纸。'),c:'muted',fx:{f:(s,c)=>stGo(s,'map','c',{who:nmOf(c.npc.n),trait:c.npc.trait,partner:1},[0,1])}}]},
  {l:T('Buy their half (60 taels)','买下对方那一半（六十两）'),cost:60,out:[{t:T('They sell quickly. Too quickly?','对方卖得很痛快。太痛快了？'),c:'muted',fx:{f:(s,c)=>stGo(s,'map','c',{who:nmOf(c.npc.n),bought:1},[0,1])}}]},
  {l:T('Take it from them','抢过来'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.lv,fixed:1},stakes:'light',title:T('Half a map','半张图'),cause:T('a fight over a map','争图')}),
   win:[{t:T('Now you have both halves, and an enemy.','现在两半都在你手里了，外加一个仇人。'),c:'bad',fx:{align:-4,enemy:1,f:(s,c)=>stGo(s,'map','c',{stole:1},[0,1])}}],lose:[{t:T('Now they have both halves.','现在两半都在对方手里了。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'map','sold')}}]},
  {l:T('Sell them your half (40 taels)','把你那一半卖给对方（四十两）'),out:[{t:T('Silver in hand is worth more than an X on paper. Probably.','到手的银子总比纸上的叉值钱。大概吧。'),c:'muted',fx:{money:40,f:(s,c)=>stEnd(s,'map','sold')}}]}]});
STI('map','c',{tags:['wander','af_travel'],
 ctx:s=>{const c=stCtx(s,'map');c.v=wpick([{v:0,w:5},{v:1,w:2},{v:2,w:2}]).v;c.bad=c.f.partner&&[1,3,9,11].includes(c.f.trait)&&chance(.6);c.lv=stFoe(s,.95,12);return c},
 text:c=>{const t=[T('The chest is full of old silver ingots.','箱子里满是旧银锭。'),T('The chest holds a suit of fine armour and a sect’s lost seal.','箱子里是一副上好的软甲，和某个门派失落的印信。'),T('The chest holds a single sheet: “Too slow. —A friend.”','箱子里只有一张纸：“来晚了。——一位朋友”')][c.v];
  return T(`Three pines, a river, an X. You dig. ${t.en}${c.bad&&c.v<2?` Behind you, ${c.f.who.en} draws a knife.`:''}`,`三棵松，一条河，一个叉。你挖了下去。${t.zh}${c.bad&&c.v<2?`身后，${c.f.who.zh}拔出了刀。`:''}`)},
 opts:[{l:T('Defend yourself','自卫'),if:(s,c)=>c.bad&&c.v<2,fight:(s,c)=>({foe:{name:c.f.who,lv:c.lv,fixed:1},stakes:'injury',title:T('Treasure','宝藏'),cause:T('a treasure hunt gone wrong','寻宝反目')}),
   win:[{t:T('You walk away with all of it.','你带着全部宝藏走了。'),c:'muted',fx:(s,c)=>({money:c.v===0?[300,600]:0,item:c.v===1?'hedgehog':null,f:(s,c)=>stEnd(s,'map','all')})}],
   lose:[{t:T('You wake up in the hole, alone.','你在坑里醒来，只剩你一个。'),c:'bad',fx:{f:(s,c)=>stEnd(s,'map','betrayed')}}]},
  {l:T('Split it fairly','平分'),if:(s,c)=>!c.bad&&c.f.partner&&c.v<2,out:[{t:T('Half each, as agreed. You drink to it.','说好的，一人一半。你们为此喝了一杯。'),c:'gold',fx:(s,c)=>({money:c.v===0?[150,300]:80,meet:'friend',bond:60,f:(s,c)=>stEnd(s,'map','shared')})}]},
  {l:T('Take it all while they are not looking','趁对方不注意，全拿走'),if:(s,c)=>!c.bad&&c.f.partner&&c.v<2,out:[{t:T('You are three villages away before they notice.','等对方发觉，你已经跑出三个村子了。'),c:'bad',fx:(s,c)=>({money:c.v===0?[300,600]:0,item:c.v===1?'hedgehog':null,align:-8,f:(s,c)=>stEnd(s,'map','all')})}]},
  {l:T('Take it','收下'),if:(s,c)=>!c.f.partner&&c.v<2,out:[{t:T('All yours.','全归你了。'),c:'gold',fx:(s,c)=>({money:c.v===0?[300,600]:0,item:c.v===1?'hedgehog':null,f:(s,c)=>stEnd(s,'map','all')})}]},
  {l:T('Laugh','只能笑了'),if:(s,c)=>c.v===2,out:[{t:T('Somebody, somewhere, is very pleased with themselves.','某个地方，有个人一定很得意。'),c:'muted',fx:{happy:2,f:(s,c)=>stEnd(s,'map','empty')}}]}]});

/* ===================== 悬赏 · The Price on Your Head ===================== */
SDEF('bounty',{n:T('The Price on Your Head','悬赏'),theme:T('Someone has put a price on you. Hunters keep coming until you find out who, and why.','有人悬赏你的人头。赏金猎人一个接一个地来，直到你查出是谁、为什么。'),
 ends:{lifted:{n:T('The bounty withdrawn','悬赏撤了'),tone:'good'},reconciled:{n:T('An old wrong put right','旧怨了结'),tone:'good'},blood:{n:T('Ended in blood','以血收场'),tone:'bad'},
  hunted:{n:T('Hunted for years','被追杀了许多年'),tone:'bad'},lapsed:{n:T('Hunted for years','被追杀了许多年'),tone:'bad'}},
 hint:{b:T('There is a price on your head. Hunters will come.','你的人头被人悬了赏。猎人会来的。'),c:T('Find out who posted the bounty. (Visit town or roam.)','查出是谁悬的赏。（下一步：进城或游历）'),d:(s,r)=>T(`You know who wants you dead: ${r.facts.who.en}.`,`你知道是谁要你的命了：${r.facts.who.zh}。`)},
 exp:6,lapseF:(s,r)=>{say(s,'Year after year, the hunters keep coming. You learn to sleep lightly.','一年又一年，赏金猎人没断过。你学会了睡觉也睁着一只眼。','bad');s.happy=Math.max(0,s.happy-8);stEnd(s,'bounty','hunted')}});
SOPEN('bounty',{age:[25,70],w:3,when:s=>s.fame>=40||(s.mem||[]).some(r=>r.kind==='wronged'&&s.age-r.at>=4),
 ctx:s=>({amt:rint(3,10)*100}),
 text:c=>T(`A friend slips you a note from the black market: a bounty of ${c.amt} taels has been posted on your head. No name on it.`,`一个朋友偷偷塞给你一张黑市上的纸条：有人出${c.amt}两悬赏你的人头。没有署名。`),
 opts:[{l:T('Prepare','做好准备'),out:[{t:T('You sharpen everything you own.','你把能磨的都磨了一遍。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'bounty',c,'b',{amt:c.amt},[0,1])}}]},{l:T('Laugh it off','一笑置之'),out:[{t:T('It is not, in the end, very funny.','这事到头来可一点也不好笑。'),c:'muted',fx:{f:(s,c)=>stBegin(s,'bounty',c,'b',{amt:c.amt,careless:1},[0,1])}}]}]});
STI('bounty','b',{self:1,
 ctx:s=>{const c=stCtx(s,'bounty');c.h=foeName();c.lv=stFoe(s,c.f.careless?1.05:.9,15);return c},
 text:c=>T(`The first hunter comes at night: ${c.h.en}, with a crossbow and a copy of your description.`,`第一个猎人夜里来了：${c.h.zh}，手里端着弩，怀里揣着你的画像。`),
 opts:[{l:T('Fight','迎战'),fight:(s,c)=>({foe:{name:c.h,lv:c.lv,fixed:1},stakes:'injury',title:T('Bounty hunter','赏金猎人'),cause:T('a bounty hunter','赏金猎人')}),
   win:[{t:T('Before he dies he tells you which teahouse the bounty was paid through.','他临死前说了，赏金是经哪家茶馆过的手。'),c:'muted',fx:{f:(s,c)=>stGo(s,'bounty','c',{lead:1},[0,1])}}],
   lose:[{t:T('You get away, bleeding. There will be more.','你带着伤逃了。还会有下一个的。'),c:'bad',fx:{f:(s,c)=>stGo(s,'bounty','c',{},[0,1])}}]}]});
STI('bounty','c',{tags:['town','wander'],
 ctx:s=>{const c=stCtx(s,'bounty');const m=(s.mem||[]).filter(r=>r.kind==='wronged').pop();
  if(m){c.who=T(m.who.n.py,m.who.n.cn);c.why=T(`${s.age-m.at} years ago: ${m.what.en}`,`${cnYrs(s.age-m.at)}年前：${m.what.zh}`);c.old=1}
  else{const n=genName('m');c.who=T(n.py,n.cn);c.why=T('You humiliated his son in a fight he does not even remember the reason for.','你在一场比武里让他儿子丢了脸，连为什么打的你都不记得了。');c.old=0}return c},
 text:c=>T(`The teahouse keeper, with some persuasion, gives you a name: ${c.who.en}. ${c.why.en}`,`茶馆掌柜经不住你软硬兼施，说出了一个名字：${c.who.zh}。${c.why.zh}`),
 opts:[{l:T('Go and face them','找上门去'),out:[{t:T('You know where to find them.','你知道去哪儿找。'),c:'muted',fx:{f:(s,c)=>stGo(s,'bounty','d',{who:c.who,old:c.old},[0,1])}}]},
  {l:T('Post a bigger bounty on them (300 taels)','反过来悬赏对方（三百两）'),cost:300,out:[{t:T('Within the season, the bounty on you is withdrawn. Nobody asks why.','不出一季，你头上的悬赏就撤了。没人问为什么。'),c:'bad',fx:{align:-6,f:(s,c)=>stEnd(s,'bounty','blood')}}]}]});
STI('bounty','d',{tags:['town','wander','af_travel'],self:1,
 ctx:s=>{const c=stCtx(s,'bounty');c.lv=stFoe(s,.7,10);return c},
 text:c=>T(`${c.f.who.en} is older and smaller than you imagined, and does not run. “${c.f.old?'You do not even remember what you did.':'My son has not left the house since.'}”`,`${c.f.who.zh}比你想的更老、更瘦小，也没有逃。“${c.f.old?'你连自己干过什么都不记得了吧。':'我儿子从那以后就没出过门。'}”`),
 opts:[{l:T('Apologise, and mean it','赔罪，真心实意'),out:[{w:s=>1+s.t.heart*.3,t:T('It takes all night. In the morning, the bounty is withdrawn.','说了一整夜。第二天早上，悬赏撤了。'),c:'gold',fx:{align:4,f:(s,c)=>stEnd(s,'bounty','reconciled')}},{w:1,t:T('“Too late,” they say, and you believe them. But the bounty comes down anyway.','“晚了。”对方说。你信。可悬赏还是撤了。'),c:'muted',fx:{f:(s,c)=>stEnd(s,'bounty','lifted')}}]},
  {l:T('Make them withdraw it','逼对方撤掉'),out:[{t:T('You do not have to do much. They are very afraid.','你没费多大劲。对方怕得厉害。'),c:'muted',fx:{align:-2,f:(s,c)=>stEnd(s,'bounty','lifted')}}]},
  {l:T('End it permanently','一劳永逸'),out:[{t:T('No more hunters come. You sleep fine. Mostly.','再也没有猎人来了。你睡得挺好。大多数时候。'),c:'bad',fx:{align:-12,wanted:2,f:(s,c)=>stEnd(s,'bounty','blood')}}]}]});

/* ---------- one more encounter for every region ---------- */
EN({id:'icecross',g:'central',n:T('Crossing the Frozen River','踏冰过河'),age:[12,80],tags:['wander','af_travel'],
 text:T('The Yellow River has frozen. Carts are crossing on the ice, and in the middle a cart has gone through. A family is in the water.','黄河封冻，车马都从冰上过。河心一辆车陷了下去，一家人掉进了冰窟窿。'),
 opts:[{l:T('Go out on the ice','冲上冰面'),out:[{w:s=>1+s.t.root*.2,t:T('You pull out two children and their mother. The father you cannot reach.','你拉上来两个孩子和他们的娘。孩子爹你够不着了。'),c:'good',fx:{align:4,fame:1,hurt:[4,10],cause:T('the frozen river','冰河')}},{w:1,t:T('The ice gives under you too. You are pulled out by the next cart.','冰在你脚下也裂了。后面一辆车把你拖了上来。'),c:'bad',fx:{hurt:[12,24],cause:T('the frozen river','冰河'),align:3}}]},
  {l:T('Throw a rope from the edge','站在冰边上扔绳子'),out:[{t:T('Slow, careful, and everyone lives.','慢慢地、小心地，一个都没少。'),c:'good',fx:{align:3}}]}]});
EN({id:'lotus',g:'jiangnan',n:T('Picking Lotus','采莲'),age:[10,60],tags:['wander','af_sightsee'],
 text:T('Lotus season. Girls in tub-boats are picking seed pods and singing, and one of them is stuck in the reeds, laughing at herself.','采莲时节。姑娘们划着木盆采莲蓬，一边唱歌。有个姑娘卡在芦苇里，自己笑个不停。'),
 opts:[{l:T('Wade in and push her free','下水把她推出来'),out:[{t:T('You are soaked to the waist and paid in lotus seeds.','你湿到了腰，换来一兜莲子。'),c:'good',fx:{happy:6}}]},{l:T('Sit on the bank and listen','坐在岸边听歌'),out:[{t:T('The song is about a fool on a bank. You enjoy it anyway.','歌里唱的是岸上一个傻子。你听得照样高兴。'),c:'good',fx:{happy:4}}]}]});
EN({id:'panda',g:'shu',n:T('The Iron-Eating Beast','食铁兽'),age:[6,90],tags:['wander','af_sightsee'],
 text:T('A fat black-and-white bear ambles out of the bamboo, sits down beside you, and eats your lunch, slowly, while making eye contact.','一头黑白相间的胖熊从竹林里晃出来，在你身边坐下，盯着你的眼睛，慢悠悠地吃掉了你的午饭。'),
 opts:[{l:T('Let it','由它吃'),out:[{t:T('It finishes, sighs, and leans on you for a nap. You do not move for an hour.','它吃完，叹了口气，靠着你打起了盹。你一个时辰没敢动。'),c:'gold',fx:{happy:10}}]},{l:T('Try to take your lunch back','想把午饭抢回来'),out:[{t:T('It is much stronger than it looks.','它比看上去有劲得多。'),c:'muted',fx:{hurt:[2,6],cause:T('a bear','一头熊'),happy:3}}]}]});
EN({id:'horsefair',g:'north',n:T('The Horse Fair','马市'),age:[14,70],tags:['town'],
 text:T('At the frontier horse fair, a wild black stallion has thrown every buyer. The trader says whoever stays on can have him for nothing.','边关马市上，一匹野性的黑马把买主一个个都甩了下来。马贩说，谁骑得住，白送。'),
 opts:[{l:T('Get on','翻身上马'),out:[{w:s=>s.t.root*.2+power(s)/80,t:T('A long, violent minute. Then he stands still, breathing hard, and he is yours.','漫长又凶险的一阵子。然后它站住了，喘着粗气。它是你的了。'),c:'gold',fx:{item:'horse',fame:1}},{w:2,t:T('You are thrown into the trader’s tea stall.','你被甩进了马贩的茶摊里。'),c:'bad',fx:{hurt:[6,14],cause:T('a wild horse','一匹烈马')}}]},
  {l:T('Watch other people try','看别人上'),out:[{t:T('Better than any opera.','比看戏还过瘾。'),c:'good',fx:{happy:4}}]}]});
EN({id:'singingsand',g:'west',n:T('The Singing Sands','鸣沙山'),age:[8,90],tags:['wander','af_sightsee'],
 text:T('You slide down the Singing Sand dune at dusk and the whole hill hums under you like a temple bell. Below is a crescent of spring water that never dries.','黄昏时你从鸣沙山上滑下来，整座沙山在你身下嗡嗡作响，像寺里的钟。山脚下是一弯从不干涸的泉水。'),
 opts:[{l:T('Climb up and do it again','爬上去再滑一次'),out:[{t:T('And again. And again. Your boots are full of sand for a month.','再一次，再一次。你的靴子里灌了一个月的沙。'),c:'good',fx:{happy:8}}]},{l:T('Sit by the crescent spring','坐在月牙泉边'),out:[{t:T('You think about nothing at all, for the first time in years.','好些年来，你第一次什么也没想。'),c:'good',fx:{happy:5,qi:1}}]}]});
EN({id:'stilthouse',g:'miao',n:T('Fire in the Stilt Houses','吊脚楼走水'),age:[14,70],tags:['town','wander'],
 text:T('Fire in the wooden stilt houses on the hillside. They are packed close together, and the wind is up.','山坡上的吊脚楼着火了。木楼一栋挨着一栋，风正大。'),
 opts:[{l:T('Cut a firebreak','砍出一道隔火带'),out:[{w:s=>1+power(s)/60,t:T('You bring down two empty houses with your bare hands. The rest of the village stands.','你徒手推倒了两栋空楼。村子其余的都保住了。'),c:'gold',fx:{fame:3,align:3}},{w:1,t:T('Half the village burns. Nobody dies, partly because of you.','烧了半个寨子。没死人，多少有你的功劳。'),c:'good',fx:{align:2,hurt:[5,12],cause:T('a fire','火灾')}}]},{l:T('Carry the old people out','背老人出来'),out:[{t:T('Four trips. The fourth time your eyebrows go.','跑了四趟。第四趟眉毛烧没了。'),c:'good',fx:{align:4,looks:-2}}]}]});
EN({id:'mazu',g:'east',n:T('The Sea Goddess’s Feast','妈祖诞'),age:[8,90],tags:['town'],
 text:T('The sea goddess’s birthday. The fishing fleet is in, the statue is carried through the streets, and an old woman insists on telling your fortune by the waves.','妈祖诞辰。渔船都回港了，神像抬着游街。一个老婆婆非要看着海浪给你算命。'),
 opts:[{l:T('Let her','让她算'),out:[{t:(c,s)=>s.t.luck>=6?T('“The sea likes you,” she says. You decide to believe her.','“海喜欢你。”她说。你决定信她。'):T('“The sea does not care about you either way,” she says. Oddly, this is comforting.','“海不在乎你。”她说。说来也怪，这话倒让人宽心。'),c:'good',fx:{happy:5}}]},{l:T('Help carry the statue','帮着抬神像'),out:[{t:T('Your shoulder aches for a week. The fishermen buy you drinks for a month.','肩膀疼了一个礼拜。渔民们请你喝了一个月的酒。'),c:'good',fx:{happy:4,fame:1}}]}]});
EN({id:'examleak',g:'capital',n:T('The Exam Leak','考题泄露'),age:[16,60],tags:['town'],
 text:T('A man in an alley near the examination hall is selling this year’s questions. He has several versions, which is suspicious in itself.','贡院附近的巷子里，有人在卖今年的考题。他手里有好几个版本，这本身就很可疑。'),
 opts:[{l:T('Report him','去举报'),out:[{w:2,t:T('He is arrested. He turns out to be a known swindler; none of the questions were real.','他被抓了。原来是个惯骗，题目没一道是真的。'),c:'good',fx:{fame:1,align:2}},{w:1,t:T('He is arrested, and one version turns out to be real. Heads roll at the Ministry. You are thanked quietly.','他被抓了，有一版居然是真的。礼部有人掉了脑袋。有人悄悄谢了你。'),c:'gold',fx:{fame:3,align:3,money:50}}]},
  {l:T('Buy a copy, for curiosity (5 taels)','买一份看看（五两）'),cost:5,out:[{t:T('It asks you to discuss the virtue of not buying exam questions in alleys.','题目要你论一论“不在巷子里买考题”的德行。'),c:'muted',fx:{happy:3}}]}]});
