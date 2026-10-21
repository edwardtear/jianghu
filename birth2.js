/* 江湖一生 · not every child is born to two parents at home: some lose a parent before they can remember, some are
   raised by grandparents, some are taken in, some arrive with a twin. And every birth has more ways to be told. */
'use strict';

REL.grandparent=T('Grandparent','祖辈');
REL_GROUPS[0][2].push('grandparent');
(()=>{const r0=relLabel;relLabel=function(s,p){
  if(p.rel==='grandparent')return p.sex==='m'?T('Grandfather','爷爷'):T('Grandmother','奶奶');
  if(p.twin&&p.rel==='sibling')return p.sex==='m'?T('Twin brother','孪生兄弟'):T('Twin sister','孪生姐妹');
  if(p.adoptive&&p.rel==='father')return T('Adoptive father','养父');if(p.adoptive&&p.rel==='mother')return T('Adoptive mother','养母');
  return r0(s,p)}})();

/* the shape of the family you are born into */
const SHAPES=[['both',64],['motherdied',6],['posthumous',6],['single',5],['grand',4],['adopted',5],['twin',4],['faraway',6]];
const F_CAUSE=[T('killed in the border wars','战死边关'),T('lost in a flood','死于洪水'),T('taken by a fever','病故'),T('killed by bandits on the road','死于山贼之手'),T('drowned at a ferry','渡河落水')];
(()=>{const n0=newLife;newLife=function(){const s=n0.apply(this,arguments);const fam=family(s);
  const fa=s.people.find(p=>p.rel==='father'),mo=s.people.find(p=>p.rel==='mother');
  let shape='both';if(fa&&mo){shape=wpick(SHAPES,x=>x[1])[0];if(s.hero&&['motherdied','posthumous','single','grand','adopted'].includes(shape))shape='both'}
  s.shape=shape;const dead=(p,c)=>{p.alive=false;p.diedAt=-1;p.cause=c;p.causeSet=1;p.age=Math.max(p.age,18)};
  if(shape==='motherdied')dead(mo,T('in childbirth','难产'));
  if(shape==='posthumous'){const c=pick(F_CAUSE);dead(fa,c);s.fCause=c}
  if(shape==='single'){s.people=s.people.filter(p=>p!==fa);s.people.filter(p=>p.rel==='sibling').forEach(p=>{if(chance(.6))s.people.splice(s.people.indexOf(p),1)});s.flags.fatherUnknown=1}
  if(shape==='grand'){const c=chance(.5)?T('in an epidemic','死于瘟疫'):T('in a fire','死于一场大火');dead(fa,c);dead(mo,c);s.gCause=c}
  if(shape==='adopted'){fa.adoptive=mo.adoptive=true;s.flags.adopted=1;s.people.filter(p=>p.rel==='sibling').forEach(p=>p.adoptive=true)}
  if(shape==='twin')s.people.push(mkPerson(s,{rel:'sibling',sur:s.sur,age:0,bond:rint(70,90),lv:1,extra:{twin:1}}));
  if(['motherdied','grand'].includes(shape)||(shape==='posthumous'&&chance(.4))){const g=mkPerson(s,{rel:'grandparent',sex:chance(.65)?'f':'m',sur:shape==='grand'||chance(.5)?s.sur:null,age:rint(50,66),bond:rint(70,92),lv:rint(1,10)});s.people.push(g)}
  return s}})();

/* more ways for a birth to be told */
B_HOW.push(
 {w:3,t:['A wandering midwife happens to be lodging next door. Everyone calls it luck.','恰好有个游方的稳婆借住在隔壁。大家都说是运气。']},
 {w:2,t:['The cord is around your neck. The midwife works fast and swears a great deal.','脐带绕在你脖子上。接生婆手脚飞快，嘴里一直骂个不停。'],fx:{maxHealth:-2}},
 {w:2,t:['You are born in the back of a cart on the way to the next town.','你是在去邻镇的牛车上生下来的。']},
 {w:2,t:['You are born so quietly that the midwife thinks for a moment you are not breathing. Then you sneeze.','你生得太安静了，接生婆一时以为你没气了。接着你打了个喷嚏。']},
 {w:1,t:['Your mother gives birth alone, before anyone arrives, and has already wrapped you by the time they do.','人还没赶到，母亲已经一个人把你生了下来，等大家进门时，你都包好了。'],fx:{talent:{root:1}}},
 {w:2,t:['The rain is so loud nobody hears your first cry. Your mother does.','雨下得太响，谁都没听见你的第一声哭。只有母亲听见了。']});
B_OMEN.push(['A crow sits on the gate post all day and will not be driven off.','一只乌鸦在门柱上蹲了一整天，怎么赶也不走。'],['A traveling monk stops to drink water, looks at you, and gives your mother a copper amulet.','一个化缘的和尚停下讨水喝，看了你一眼，给了你娘一枚铜护身符。'],
 ['The old well, dry for years, has water in it the next morning.','干了多年的老井，第二天早上又有了水。'],['A fox is seen watching the house from the edge of the field.','有人看见一只狐狸在田边望着这户人家。'],['Every lamp in the house flickers at once, though there is no wind.','明明没有风，家里的灯却一齐晃了一下。'],
 ['A swallow builds a nest above your cradle that same week.','那个礼拜，一只燕子在你摇篮上方筑了窝。']);
B_NAME.push(['Your name is chosen by drawing lots at the ancestral shrine.','你的名字是在祠堂里抽签抽出来的。'],['A passing scholar names you in return for a night’s lodging.','一个路过的读书人借宿一晚，给你起了名字当作答谢。'],
 ['Your name is borrowed from a hero in a story your mother loves.','你的名字借自母亲最爱听的一个故事里的英雄。'],['Nobody can agree, so you go nameless until you are one.','谁也说服不了谁，你一直到周岁才有了名字。'],['Your grandmother names you after the season.','奶奶照着时节给你起了名字。']);
B_WHEN.push(['On the night of the Lantern Festival, with the whole street out watching the lights','元宵夜里，整条街的人都在外头看灯'],['In the middle of a wedding next door, between toasts','隔壁正办喜事，敬酒声里'],
 ['As a funeral procession passed the gate','一支送葬的队伍正从门口经过'],['During a sandstorm that buried the road','一场沙暴把路都埋了的时候'],['On the morning the river froze','河面封冻的那天早上'],['In the week the new magistrate arrived','新县官上任的那个礼拜']);
const B_WHO=[['The midwife is the only one awake.','接生婆是唯一醒着的人。'],['Half the village crowds the doorway to hear the first cry.','半个村子的人挤在门口，等着听第一声哭。'],
 ['A neighbour boils water and nobody remembers to ask her to stop.','邻居一直在烧水，谁也想不起来叫她停下。'],['The family dog will not leave the doorstep.','家里的狗守在门槛上，怎么也不肯走。'],
 ['Your grandmother takes you first, and is reluctant to hand you over.','奶奶头一个把你抱过去，好半天都不肯撒手。'],['A cousin is sent running for the doctor and gets lost.','派了个表亲跑去请大夫，结果他自己迷了路。']];
const B_MONTH=[['At three days old you are bathed in herbs and given a silver lock for long life.','洗三那天，家人用草药给你洗了澡，挂上一把长命银锁。'],['Your full-month feast has more guests than the family can afford.','满月酒来的客人，比家里请得起的还多。'],
 ['There is no feast for your first month. Your mother sings to you instead.','满月没摆酒。母亲给你唱了一支歌。'],['At your hundred-days, an uncle gives you a wooden sword, and is scolded for it.','百日那天，一位叔伯送了你一把木剑，挨了一顿骂。'],
 ['Your first month passes in a borrowed room, the family between homes.','你的第一个月是在借来的屋子里过的，家里正四处搬。'],['A fortune teller is paid to read your eight characters, and says something nobody repeats.','家里花钱请人批了你的八字。算命先生说了一句话，谁也没再提起。']];
const SHAPE_LINE={
 motherdied:['Your mother dies the night you are born. You are given to a wet nurse, and later to your grandmother.','母亲在你出生那夜去世了。你先被托给奶娘，后来由奶奶带大。'],
 posthumous:[`Your father died before you were born, %C. You will know him only from other people's stories.`,`父亲在你出生前就%C了。你对他的了解，只能来自别人的讲述。`],
 single:['Your mother is not married, and will not say who your father is. The neighbours have theories.','母亲没有成亲，也不肯说你父亲是谁。邻居们各有各的猜测。'],
 grand:['Your parents are both gone before your first birthday, %C. Your grandparents raise you.','你不满周岁，爹娘就%C，双双离世。是祖辈把你拉扯大的。'],
 adopted:['You are not born into this family. You are taken in as a baby, and nobody tells you so.','你并不是这家亲生的。你还在襁褓里就被抱了来，可没人告诉过你。'],
 twin:['You are not alone: a twin follows you a quarter-hour later.','你不是一个人来的：一刻钟后，又生下了一个孪生的。'],
 faraway:['Your father is working far away and does not see you until you are almost two.','父亲在远方做工，直到你快两岁才第一次见到你。']};
(()=>{const b0=birth;birth=function(s){
  /* the family line must not talk about a parent who is not there */
  const fam=s.family,noF=!s.people.some(p=>p.rel==='father'&&p.alive),noM=!s.people.some(p=>p.rel==='mother'&&p.alive);
  const bad=x=>{const t=JSON.stringify(x);return(noF&&/父|爹|father/i.test(t))||(noM&&/母亲|娘|mother/i.test(t))};
  const saved=[B_FAMILY[fam],B_HOW.slice(),B_NAME.slice(),B_OMEN.slice()];
  if(noF||noM){const fk=(B_FAMILY[fam]||[]).filter(x=>!bad(x));B_FAMILY[fam]=fk.length?fk:[family(s).rich<=1?['Times are hard at home.','家里的日子过得紧巴巴的。']:['The house is comfortable enough.','家里的日子还算宽裕。']];
    [B_HOW,B_NAME,B_OMEN].forEach(A=>{const k=A.filter(x=>!bad(x));if(k.length){A.length=0;A.push(...k)}})}
  try{b0(s)}finally{B_FAMILY[fam]=saved[0];[B_HOW,B_NAME,B_OMEN].forEach((A,i)=>{A.length=0;A.push(...saved[i+1])})}
  const E=s.log[s.log.length-1];const L=SHAPE_LINE[s.shape];
  if(L&&E){const c=s.fCause||s.gCause||T('','');const l={t:T(L[0].replace('%C',c.en),L[1].replace('%C',c.zh)),c:s.shape==='twin'?'good':s.shape==='faraway'?'muted':'bad'};E.lines.splice(Math.min(2,E.lines.length),0,l)}
  if(noM&&E)E.lines.forEach(l=>{if(l.t&&/Your mother finds it a little uncanny/.test(l.t.en))l.t=T(l.t.en.replace('Your mother finds','The grown-ups find'),l.t.zh.replace('母亲觉得','大人们觉得'))});
  const ok=a=>a.filter(x=>!bad(x));if(chance(.5))sayT(s,P(pick(ok(B_WHO))),'muted');const m=ok(B_MONTH);if(m.length&&chance(.6))sayT(s,P(pick(m)),'muted')}})();

/* what those beginnings lead to */
I({id:'bf_adopted',age:[10,30],once:1,w:6,when:s=>!!s.flags.adopted&&s.people.some(p=>p.adoptive),ctx:s=>{const c=scene();c.reg=pick(REGIONS);return c},
 text:c=>T(`An old neighbour, drunk at a wedding, lets it slip: you were brought to this house as a baby, from somewhere in ${c.reg.en}.`,`一个老邻居在喜宴上喝多了，说漏了嘴：你是襁褓里从${c.reg.cn}那边抱来的。`),
 opts:[{l:T('Set out to find your birth parents','动身去寻亲生父母'),out:[{w:2,t:T('You find your birth mother, poor and grey, in a village that barely remembers her. She cries for an hour.','你在一个几乎没人记得她的村子里，找到了生母。她又穷又老，哭了一个时辰。'),c:'good',fx:{meet:'acq',bond:70,happy:4,money:-20}},
   {w:1,t:T('Your birth parents are long dead. You stand at two unmarked graves and do not know what to feel.','亲生父母早就不在了。你站在两座无名坟前，不知道该是什么心情。'),c:'muted',fx:{happy:-4,money:-20}},
   {w:1,t:T('The trail leads to a sect that will not discuss it. Someone there knows more than they say.','线索指向一个门派，对方闭口不谈。那里有人知道的比说出来的多。'),c:'muted',fx:{money:-20,smarts:1}}]},
  {l:T('Ask the parents who raised you','去问养大你的爹娘'),out:[{w:3,t:T('They tell you everything, and then: "You are ours anyway." You find you agree.','他们把一切都告诉了你，然后说："反正你就是我们的孩子。"你发现自己也这么想。'),c:'good',fx:{happy:3,f:s=>s.people.filter(p=>p.adoptive&&p.alive).forEach(p=>addBond(p,10))}},{w:1,t:T('They deny it, badly. Something between you cools.','他们矢口否认，说得很勉强。你们之间有什么东西冷了下来。'),c:'bad',fx:{f:s=>s.people.filter(p=>p.adoptive&&p.alive).forEach(p=>addBond(p,-12))}}]},
  {l:T('Let it lie','就当没听见'),out:[{w:1,t:T('You never mention it. Some nights you wonder.','你从没提起。只是有些夜里，会忍不住想。'),c:'muted',fx:{happy:-1}},{w:1,t:T('It changes nothing. They are your parents.','这改变不了什么。他们就是你的爹娘。'),c:'good',fx:{happy:1}}]}]});
I({id:'bf_father',age:[8,30],once:1,w:5,when:s=>!!s.flags.fatherUnknown,ctx:s=>{const c=scene();c.npc=npc(s,{sex:'m',age:s.age+rint(20,32),occ:pick([5,8,13,11,1]),lv:PW(1.1,6)(s)});return c},
 text:c=>T(`A stranger, ${c.npc.desc.en.replace(/^an? /,'')} ${c.npc.en}, comes to the door and asks for your mother by her girlhood name. He looks at you a long time.`,`一个陌生人登门，是${c.npc.desc.zh}${c.npc.zh}，开口就叫你母亲做姑娘时的名字。他盯着你看了很久。`),
 opts:[{l:T('Let him in','请他进门'),out:[{w:2,t:c=>T(`${c.npc.en} is your father. He did not know you existed. He stays for dinner, and keeps coming back.`,`${c.npc.zh}是你的生父。他一直不知道有你。那天他留下吃了饭，后来常常来。`),c:'good',fx:{meet:'acq',bond:65,happy:3}},{w:1,t:c=>T(`${c.npc.en} is your father, and wants something: money, or a place to hide. Your mother sends him away.`,`${c.npc.zh}是你的生父，可他是有所求的：要钱，或者要个藏身的地方。母亲把他赶走了。`),c:'bad',fx:{happy:-3}}]},
  {l:T('Send him away','把他打发走'),out:[{w:1,t:T('He goes without arguing. Years later you wish you had asked his name.','他没争辩就走了。多年以后，你后悔当初没问他的名字。'),c:'muted',fx:{happy:-2}},{w:1,t:T('Your mother thanks you, and cries that night.','母亲谢了你，那晚却哭了。'),c:'muted'}]}]});
/* a father far away comes home */
(()=>{const y=yearly;yearly=function(s){y(s);if(s.shape==='faraway'&&s.age===2&&!s.fBack){s.fBack=1;const f=s.people.find(p=>p.rel==='father'&&p.alive);if(f){addBond(f,10);say(s,`Your father comes home. You hide behind your mother and refuse to look at him for a week.`,`父亲回来了。你躲在母亲身后，一个礼拜都不肯正眼看他。`,'muted')}}}})();

/* a child without a father or mother hears "your father" from the world's old stories: the person who actually raised
   you takes that place in the text (grandparents, an uncle or aunt, or the monks for a temple foundling) */
const P_SKIP=/去世|已故|生前|亡|坟|遗|祭|忌日|守孝|出殡|生父|生母|亲生|养父|养母|died|dead|death|grave|late |birth father|birth mother|adoptive/i;
function careSubs(s){if(s.age>17)return null;const fa=s.people.some(p=>p.rel==='father'&&p.alive),mo=s.people.some(p=>p.rel==='mother'&&p.alive);if(fa&&mo)return null;
  const gp=s.people.filter(p=>p.rel==='grandparent'&&p.alive),gm=gp.find(p=>p.sex==='f'),gf=gp.find(p=>p.sex==='m');const temple=s.family==='temple';
  const F=temple?['old monk','老和尚']:gf?['grandfather','爷爷']:['uncle','舅舅'],M=temple?['old monk','老和尚']:gm?['grandmother','奶奶']:mo?null:['aunt','婶婶'];
  const both=temple?['the monks','和尚们']:gp.length?['grandparents','祖辈']:fa?['father','父亲']:mo?['mother','娘']:['family','家里人'];
  return{fa,mo,F,M,both}}
function careFix(s,t){if(!t||!t.zh)return t;const c=careSubs(s);if(!c||P_SKIP.test(t.zh+' '+t.en))return t;let zh=t.zh,en=t.en;
  if(!c.fa||!c.mo){zh=zh.replace(/爹娘/g,c.both[1]);en=en.replace(/\byour parents\b/g,'your '+c.both[0]).replace(/\bYour parents\b/g,'Your '+c.both[0]).replace(/\bparents\b/g,c.both[0])}
  if(!c.fa){zh=zh.replace(/你父亲|父亲|你爹|爹爹/g,m=>(m.startsWith('你')?'你':'')+c.F[1]);en=en.replace(/\b([Yy])our father\b/g,(m,y)=>`${y}our ${c.F[0]}`).replace(/\bfather\b/g,c.F[0]).replace(/\bFather\b/g,c.F[0].replace(/^./,x=>x.toUpperCase()))}
  if(!c.mo&&c.M){zh=zh.replace(/你娘|母亲/g,m=>(m.startsWith('你')?'你':'')+c.M[1]);en=en.replace(/\b([Yy])our mother\b/g,(m,y)=>`${y}our ${c.M[0]}`).replace(/\bmother\b/g,c.M[0]).replace(/\bMother\b/g,c.M[0].replace(/^./,x=>x.toUpperCase()))}
  return zh===t.zh&&en===t.en?t:T(en,zh)}
(()=>{const s0=say;say=function(s,en,zh,c,extra){if(s&&s.age<=17&&s.age>=1){const t=careFix(s,T(en,zh));en=t.en;zh=t.zh}return s0(s,en,zh,c,extra)}})();
(()=>{const r0=runIncident;runIncident=function(s,inc,c){const n=s.queue.length;const r=r0(s,inc,c);if(s.age<=17&&s.age>=1)s.queue.slice(n).forEach(q=>{if(q.text)q.text=careFix(s,q.text);(q.opts||[]).forEach(o=>{o.l=careFix(s,o.l);if(o.sub)o.sub=careFix(s,o.sub)})});return r}})();
/* a grandparent's deathbed needs a family with grandparents: not the temple foundling, not the beggar's child */
(()=>{const i=INC_BY.yt_grandstory||INC.find(x=>/grandchildren asks for you/.test(String(x.text)));if(!i)return;const w0=i.when;i.when=s=>!['temple','beggar'].includes(s.family)&&s.shape!=='adopted'&&(!w0||w0(s))})();
