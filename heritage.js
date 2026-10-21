/* 江湖一生 · a name you are born with: great families start with a reputation, and a few children are born to a famous
   hero, which brings a head start, comparisons, and the hero's old enemies */
'use strict';

/* how well known the family name is, before you have done anything */
const FAM_FAME={noble:20,clan:15,cult:10,escort:8,scholar:5,merchant:3};
/* how likely a famous hero is your father or mother */
const HERO_P={clan:.3,escort:.12,hunter:.03,peasant:.02,scholar:.03,merchant:.03,noble:.04};
const HERO_EP=[['Iron Palm','铁掌'],['Swift Sword','快剑'],['Golden Saber','金刀'],['Divine Fist','神拳'],['White-Robed','白衣'],['Wind-Chaser','追风'],['One-Finger','一指'],['Thunder Spear','霹雳枪'],['Jade Flute','玉笛'],['Snow Blade','雪刀']];
const heroOf=s=>s.hero&&person(s,s.hero.pid);
const heroName=(s,h)=>{const p=person(s,h.pid);return p?T(`"${h.ep.en}" ${p.n.py}`,`「${h.ep.zh}」${p.n.cn}`):T('your parent','你的父母')};

(()=>{const n0=newLife;newLife=function(){const s=n0.apply(this,arguments);
  s.fame=(FAM_FAME[s.family]||0)+rint(0,3);
  if(chance(HERO_P[s.family]||0)){const ps=s.people.filter(p=>p.rel==='father'||p.rel==='mother');
    const p=ps.find(x=>x.rel==='father'&&chance(.75))||pick(ps);
    if(p){const e=pick(HERO_EP);p.lv=rint(150,260);p.age=Math.max(p.age,rint(28,45));s.hero={pid:p.id,ep:T(e[0],e[1])};s.fame+=15}}
  return s}})();

/* the birth line: everyone hears about it */
(()=>{const b0=birth;birth=function(s){b0(s);const h=s.hero;if(!h)return;const p=heroOf(s);if(!p)return;const n=heroName(s,h);
  say(s,`The news travels fast: ${n.en} has a child. Half the jianghu sends gifts. The other half takes note.`,`消息传得飞快：${n.zh}有后了。半个江湖送来贺礼，另外半个江湖记下了这件事。`,'gold')}})();
/* your family name is spoken in your parent's house, so it does not fade while you are a child */
(()=>{const y=yearly;yearly=function(s){const f0=s.fame;y(s);if(s.age<16&&s.fame<f0)s.fame=f0}})();

/* growing up in a hero's shadow */
I({id:'hr_shadow',age:[10,17],once:1,w:8,when:s=>!!heroOf(s),ctx:s=>{const c=scene();c.hn=heroName(s,s.hero);return c},
 text:c=>T(`At a gathering, a guest looks you up and down. "So this is ${c.hn.en}'s child? I expected more."`,`一次聚会上，有位客人把你上下打量了一番："这就是${c.hn.zh}的孩子？我还以为会更像样些。"`),
 opts:[{l:T('Show them what you can do','露一手给他看'),fight:(s,c)=>({foe:{name:T('the guest','那位客人'),lv:Math.max(6,Math.round(power(s)*(1+R()*.4)))},stakes:'spar',title:T('A hero’s child','名门之后'),cause:T('a test','考校')}),
   win:[{w:2,t:T('The guest bows. By the end of the month, the story has reached the next county.','那位客人拱手认了。不到一个月，这事就传到了邻县。'),c:'good',fx:{fame:4,happy:4}},{w:1,t:T('You win, and hear later the guest let you. You are not sure which is worse.','你赢了，后来却听说是对方让着你。你说不清哪样更难受。'),c:'muted',fx:{fame:1,smarts:1}}],
   lose:[{w:2,t:T('You lose in front of everyone. Your parent says nothing, which is worse than anything they could say.','你当众输了。爹娘一句话也没说，这比说什么都难受。'),c:'bad',fx:{fame:-3,happy:-6,skill:1}},{w:1,t:T('You lose, but the guest says you have the right stubbornness.','你输了，可那位客人说，你身上有那股倔劲儿。'),c:'muted',fx:{skill:1}}]},
  {l:T('Say you will be your own person','说你要走自己的路'),out:[{w:s=>1+s.smarts/40,t:T('The room goes quiet, then someone laughs approvingly. It is a good answer.','满座先是一静，接着有人赞许地笑了。答得好。'),c:'good',fx:{fame:2,smarts:1}},{w:1,t:T('It comes out sullen. People nod politely and talk about you afterwards.','话说出口带着气。大家客气地点点头，事后在背后议论你。'),c:'muted',fx:{fame:-1,happy:-2}}]},
  {l:T('Say nothing and leave','一言不发地离开'),out:[{w:1,t:T('You train until midnight. It is the first of many such nights.','你练到半夜。这样的夜晚，从此还有很多。'),c:'muted',fx:{skill:1,happy:-2}},{w:1,t:T('Your parent finds you later and says, quietly, that they were once told the same thing.','后来爹娘找到你，低声说，他们当年也被人这么说过。'),c:'good',fx:{happy:3}}]}]});
/* the hero's old enemies */
I({id:'hr_enemy',age:[15,45],once:1,w:5,when:s=>!!s.hero,ctx:s=>{const c=scene();c.hn=heroName(s,s.hero);const hp=heroOf(s);c.par=hp&&hp.rel==='mother'?T('mother','你娘'):T('father','你爹');c.foe=foeName();c.lv=Math.max(10,Math.round(power(s)*(.9+R()*.4)));return c},
 text:c=>T(`${c.foe.en} stops you on the road. "Twenty years ago ${c.hn.en} crippled my brother. I have waited long enough. You will do."`,`${c.foe.zh}在路上拦住了你："二十年前，${c.hn.zh}废了我兄弟。我等得够久了，就拿你抵。"`),
 opts:[{l:T('Fight','动手'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv,fixed:1},stakes:'injury',title:T('An old feud','上一辈的恩怨'),cause:T('your parent’s old enemy','父辈的仇家')}),
   win:[{w:2,t:T('You beat them. When you tell your parent, they are quiet for a long time, then pour you a cup of wine.','你打赢了。你说给爹娘听，对方沉默了很久，然后给你倒了一杯酒。'),c:'gold',fx:{fame:5,happy:3}},{w:1,t:T('You win. They swear their sons will come next.','你赢了。对方发誓，下回来的是他儿子。'),c:'muted',fx:{fame:3,enemy:1}}],
   lose:[{w:1,t:c=>T(`They leave you bleeding in the road. "Tell your ${c.par.en} I said hello."`,`对方把你打得倒在路边流血。"替我向${c.par.zh}问好。"`),c:'bad',fx:{fame:-2}}]},
  {l:T('Ask what really happened','问清当年到底怎么回事'),out:[{w:s=>1+s.smarts/30,t:T('The story they tell is not the one you grew up with. You walk away together, and you do not know what to think of your parent.','对方讲的，和你从小听的不一样。你们一起走了一段路，你不知道该怎么看待爹娘了。'),c:'muted',fx:{smarts:2,align:2}},{w:1,t:T('They are not here to talk.','对方不是来说话的。'),c:'bad',fx:{hurt:[8,18],cause:T('your parent’s old enemy','父辈的仇家')}}]},
  {l:T('Run home','跑回家'),out:[{w:2,t:T('You get away. Your parent hears, picks up a sword they have not touched in years, and goes out alone.','你逃掉了。爹娘听说后，拿起一把多年没碰过的剑，一个人出了门。'),c:'muted',fx:{fame:-2}},{w:1,t:T('They are faster than you.','对方比你快。'),c:'bad',fx:{hurt:[6,15],cause:T('your parent’s old enemy','父辈的仇家'),fame:-2}}]}]});
/* when the hero dies, the jianghu notices */
(()=>{const d0=onDeath;onDeath=function(s,p){d0(s,p);if(s.hero&&s.hero.pid===p.id&&!s.hero.mourned){s.hero.mourned=1;const n=heroName(s,s.hero);
  say(s,`${n.en}'s funeral fills the road for a mile. People you have never met tell you what your parent did for them. The name is yours to carry now.`,`${n.zh}出殡那天，送葬的人排出一里地。好些素不相识的人，跟你讲起你爹娘当年为他们做过的事。这个名号，如今该你来担了。`,'gold');s.fame+=3}}})();
