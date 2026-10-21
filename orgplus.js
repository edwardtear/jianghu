/* 江湖一生 · running your own house: named people who help you run it, a yearly focus you choose, and a fairer mix of good years,
   hard choices and real crises (roughly 45 / 30 / 25) */
'use strict';

/* ---------- the people who run the house with you ---------- */
const STAFF_ROLES={
 sect:{senior:[T('senior disciple','大弟子'),'disciple',{age:[20,30]}],steward:[T('steward','管事'),'acq',{occ:26,age:[40,60]}],elder:[T('elder','长老'),'friend',{age:[50,70]}]},
 escort:{senior:[T('chief escort','总镖头'),'friend',{age:[30,45]}],steward:[T('bookkeeper','账房先生'),'acq',{occ:1,age:[40,60]}]}};
function orgStaff(s){const o=s.org;if(!o)return;o.staff=o.staff||{};const R0=STAFF_ROLES[o.type]||STAFF_ROLES.sect;
  for(const k in R0){if(k==='elder'&&o.lv<3)continue;const cur=o.staff[k]&&person(s,o.staff[k]);if(cur&&cur.alive&&!cur.gone)continue;
    const [title,rel,opt]=R0[k];const p=mkPerson(s,Object.assign({rel,bond:rint(55,75),age:rint(opt.age[0],opt.age[1]),lv:k==='steward'?rint(5,25):Math.max(10,Math.round(power(s)*(.4+R()*.3)))},opt.occ!=null?{occ:opt.occ}:{}));
    p.role=k;p.sect=null;s.people.push(p);
    if(o.staff[k])say(s,`${p.n.py} becomes the new ${title.en} of ${o.name.en}.`,`${p.n.cn}接任${o.name.zh}的${title.zh}。`,'muted');
    o.staff[k]=p.id}}
const staffP=(s,k)=>{const o=s.org;if(!o||!o.staff)return null;const p=o.staff[k]&&person(s,o.staff[k]);return p&&p.alive?p:null};
function stf(s,k){const p=staffP(s,k);const R0=(STAFF_ROLES[s.org&&s.org.type]||STAFF_ROLES.sect)[k]||STAFF_ROLES.sect[k];
  if(!p)return T(`your ${R0[0].en}`,`你的${R0[0].zh}`);return T(`${R0[0].en} ${surPy(p)}`,`${R0[0].zh}${p.n.cn}`)}
const Stf=(s,k)=>Cap(stf(s,k));

/* ---------- this year’s focus ---------- */
const FOCI={
 recruit:[T('Take in new people','广纳人手'),T('More hands; quality varies.','人多了，良莠不齐。')],
 train:[T('Drill everyone hard','苦练本领'),T('Better fighters, a better name.','本事更硬，名声更响。')],
 trade:[T('Mind the money','打理生计'),T('More silver this year.','今年多些进项。')],
 charity:[T('Do good in the district','行善乡里'),T('Costs silver; earns goodwill.','花银子，换人心。')],
 ally:[T('Make friends and allies','结交同道'),T('Fewer enemies, more doors open.','少树敌，多条路。')]};
const orgFocus=s=>s.org&&s.org.focus&&FOCI[s.org.focus]?s.org.focus:null;
const focusName=k=>FOCI[k]?FOCI[k][0]:T('none','未定');

/* small, immediate stories for each focus: good, a trade-off you decide, or a crisis */
const OGF=(on,s)=>on||T('your house','你的门户');
const FOCUS_EV={
 recruit:{good:[
   s=>({t:T(`Four brothers from the next valley walk in together and ask to join ${s.org.name.en}. Their mother sends a basket of eggs with them.`,`隔壁山谷的四兄弟一起找上门，要投${s.org.name.zh}。他们的娘还让带来一篮鸡蛋。`),fx:()=>ogAdj(s,2,3)}),
   s=>({t:T(`${Stf(s,'senior').en} brings back two orphans from the market town. One of them turns out to have remarkable bones.`,`${stf(s,'senior').zh}从镇上领回两个孤儿，其中一个根骨奇佳。`),fx:()=>ogAdj(s,3,2)}),
   s=>({t:T('A retired constable asks for a room and offers to teach the juniors to track and tie knots. He is worth three new disciples.','一个告老的捕快来讨间屋子住，愿意教小辈追踪和打绳结。他一个人顶三个新弟子。'),fx:()=>ogAdj(s,4,1)})],
  crisis:[
   s=>({t:T('A new recruit turns out to be a runaway with a price on his head. The magistrate’s men are at your gate, and you pay to make it go away.','新来的一个原来是背着案子的逃犯。县衙的人堵在门口，你花钱才了了此事。'),fx:()=>{payT(s,-Math.min(s.money,60*s.org.lv),'org');ogAdj(s,-4,-1)}}),
   s=>({t:T('Too many new mouths and not enough rice. Three of the newcomers leave before winter.','新人太多，米不够吃。入冬前有三个走了。'),fx:()=>ogAdj(s,-2,-3)})],
  trade:'og_f_recruit'},
 train:{good:[
   s=>({t:T(`Your people put on a demonstration at the county fair. By evening, three families have asked to enrol their sons.`,`你的人在县里庙会上露了一手。到傍晚，已有三户人家来问能不能送孩子入门。`),fx:()=>ogAdj(s,5,2)}),
   s=>({t:T(`${Stf(s,'senior').en} breaks through a barrier that has stopped them for years, and bows to you in front of everyone.`,`${stf(s,'senior').zh}突破了困住多年的关口，当着众人向你行了大礼。`),fx:()=>{ogAdj(s,4,0);const p=staffP(s,'senior');if(p){p.lv+=rint(5,12);addBond(p,6)}}}),
   s=>({t:T('A whole season of hard training. Nobody remarkable, but nobody weak. Bandits on your roads start going the long way round.','苦练了一整季。没出什么奇才，可也没一个软脚虾。你地界上的山贼开始绕道走了。'),fx:()=>ogAdj(s,4,0)})],
  crisis:[
   s=>({t:T('A training accident: a junior falls from the plum-blossom posts and breaks his leg badly. The doctor is expensive and the parents are angry.','练功出了事：一个小弟子从梅花桩上摔下来，腿断得厉害。郎中贵，家长也不依。'),fx:()=>{payT(s,-Math.min(s.money,40*s.org.lv),'org');ogAdj(s,-3,-1)}})],
  trade:'og_f_train'},
 trade:{good:[
   s=>({t:T(`${Stf(s,'steward').en} finds a cheaper rice merchant and a better price for your herbs. The books close with a surplus.`,`${stf(s,'steward').zh}找了家更便宜的米行，草药也卖了个好价钱。年底账上有了盈余。`),fx:()=>payT(s,50*s.org.lv,'org')}),
   s=>({t:T('A merchant caravan pays for your people to see it through the pass. Easy silver.','一支商队花钱请你的人护送过山口。银子来得轻松。'),fx:()=>{payT(s,40*s.org.lv,'org');ogAdj(s,1,0)}}),
   s=>({t:T('The vegetable plots, the tea bushes and the mill all have a good year at once.','菜地、茶园和磨坊同一年都有了好收成。'),fx:()=>payT(s,30*s.org.lv,'org')})],
  crisis:[
   s=>({t:T(`The accounts do not add up. ${Stf(s,'steward').en} swears it was an honest mistake. Some silver is simply gone.`,`账对不上。${stf(s,'steward').zh}赌咒发誓说是无心之失。总之，有一笔银子不见了。`),fx:()=>{payT(s,-Math.min(s.money,50*s.org.lv),'org');const p=staffP(s,'steward');if(p)addBond(p,-10)}})],
  trade:'og_f_trade'},
 charity:{good:[
   s=>({t:T('You open a soup kitchen through the hard months. The county does not forget who fed it.','青黄不接的几个月，你开了粥棚。乡里记住了是谁让大家没饿死。'),fx:()=>{payT(s,-Math.min(s.money,25*s.org.lv),'org');ogAdj(s,6,0);s.align=clamp(s.align+3,-100,100)}}),
   s=>({t:T('A family you helped last year sends their son to join you, with a pig as his entrance gift.','去年你帮过的一户人家，把儿子送来入门，还牵来一头猪当拜师礼。'),fx:()=>{ogAdj(s,3,1)}}),
   s=>({t:T('Your people rebuild the washed-out bridge below the mountain. Strangers start calling your house by name.','你的人把山下冲垮的桥重新修好了。连外乡人都叫得出你门户的名号了。'),fx:()=>{payT(s,-Math.min(s.money,20*s.org.lv),'org');ogAdj(s,5,0);s.fame+=1}})],
  crisis:[
   s=>({t:T('Word of your kindness spreads too far. Beggars from three counties arrive, and the stores are empty by spring.','你行善的名声传得太远。三个县的叫花子都来了，开春前粮仓就空了。'),fx:()=>{payT(s,-Math.min(s.money,40*s.org.lv),'org');ogAdj(s,2,0)}})],
  trade:'og_f_charity'},
 ally:{good:[
   s=>({t:T('A neighbouring master invites you to a banquet. You agree to exchange two disciples for a year. Both houses gain from it.','邻近一派的掌门请你赴宴。你们约定互换两名弟子学艺一年，两家都得了好处。'),fx:()=>{ogAdj(s,4,0);s.fame+=1}}),
   s=>({t:T('The merchants’ guild names your house as its preferred guard. Contracts follow.','商会把你家定为首选护卫，生意接踵而来。'),fx:()=>{payT(s,30*s.org.lv,'org');ogAdj(s,2,0)}}),
   s=>({t:T('An old rival of your house sends a gift and an apology. You will never be friends, but you will not have to fight.','你门户的一个老对头送来礼物和一封致歉信。做不成朋友，可也不必再打了。'),fx:()=>{ogAdj(s,3,0);s.align=clamp(s.align+1,-100,100)}})],
  crisis:[
   s=>({t:T('Your new ally drags you into a feud you knew nothing about. You end up fighting for a grudge that is not yours.','新结的盟友把你拖进了一场你毫不知情的世仇。你最后为别人的恩怨动了刀。'),fx:()=>{const r=fightLife(s,{name:foeName(),lv:PW(.95,4)(s)},{stakes:'injury',title:T('Someone else’s feud','别人的恩怨'),cause:T('an ally’s feud','盟友的世仇')});ogAdj(s,r.win?2:-4,0)}})],
  trade:'og_f_ally'}};
function runFocus(s,k){const P0=FOCUS_EV[k];if(!P0||!s.org)return;const r=R();
  if(r<.45){const e=pick(P0.good)(s);say(s,e.t.en,e.t.zh,'good');e.fx&&e.fx();return}
  if(r<.75&&INC_BY[P0.trade]){runIncident(s,INC_BY[P0.trade]);return}
  const e=pick(P0.crisis)(s);say(s,e.t.en,e.t.zh,'bad');e.fx&&e.fx()}

/* the decisions a focus brings: no right answer, only what you value */
const OF=['orgfocus'];
I({id:'og_f_recruit',only:1,tags:OF,ctx:ogC(s=>({occ:11,age:16})),
 text:c=>T(`One place left this year. ${c.npc.en}, the son of a rich family, comes with a purse and no talent. A barefoot girl from the hills comes with nothing and great talent.`,`今年只剩一个名额。富家子弟${c.npc.zh}带着一袋银子来，资质平平；一个山里来的赤脚女孩什么也没带，资质极好。`),
 opts:[{l:T('Take the rich boy’s silver','收富家子的银子'),out:[{t:T('The silver repairs the roof. The boy is no fighter, but he is cheerful, and his father has friends.','这笔银子修好了屋顶。那孩子不是练武的料，倒是开朗，他爹还有些门路。'),c:'muted',fx:{money:150,f:OG(-1,1)}}]},
  {l:T('Take the girl','收那女孩'),out:[{t:T('In three years she is the best of her year. The rich family tells everyone you are proud and poor.','三年后，她是同辈里最出色的。那户富人家逢人便说你清高又穷酸。'),c:'good',fx:{f:OG(4,1),align:2}}]},
  {l:T('Take both, and squeeze','两个都收，挤一挤'),out:[{t:T('Everyone sleeps three to a bed for a year. Nobody is happy, but nobody leaves.','一年里人人三个挤一张床。谁也不痛快，可谁也没走。'),c:'muted',fx:{money:150,f:OG(1,2),happy:-2}}]}]});
I({id:'og_f_train',only:1,tags:OF,ctx:ogC(),
 text:c=>T(`Your ${c.sr.en} wants to drill the juniors the way the great sects do: before dawn, in snow, until they drop. "Soft training makes soft people."`,`${c.sr.zh}想照大派的规矩操练小辈：天不亮就起，雪里练，练到趴下为止。"练得软，人就软。"`),
 opts:[{l:T('Let them','由着他'),out:[{w:2,t:T('By spring they are hard as nails. Two of them went home in the winter and did not come back.','到开春，个个硬得像钉子。有两个冬天回了家，没再回来。'),c:'muted',fx:{f:OG(5,-2)}},{w:1,t:T('It works, and the juniors worship your senior disciple for it. You feel a little left out.','这法子管用，小辈们对大弟子佩服得五体投地。你倒有点被冷落的感觉。'),c:'good',fx:{f:OG(6,0)}}]},
  {l:T('Keep your own gentler way','照你自己的温和路子'),out:[{t:T('Nobody leaves, and nobody improves much. Your senior disciple sulks for a month.','没人走，也没人长进多少。大弟子闷闷不乐了一个月。'),c:'muted',fx:{f:OG(1,0)}}]},
  {l:T('Train them yourself, hard but fair','自己来带，严而有度'),out:[{t:T('It takes all your time this year, and your own training suffers. Your people are better for it.','这一年你的工夫全搭了进去，自己的功夫落下了。你的人倒是强了。'),c:'good',fx:{f:OG(5,0),skill:-1}}]}]});
INC_BY.og_f_train.ctx=s=>{const c=ogC()(s);c.sr=stf(s,'senior');return c};
I({id:'og_f_trade',only:1,tags:OF,ctx:ogC(s=>({occ:5,age:50})),
 text:c=>T(`A salt merchant, ${c.npc.en}, offers to pay your house’s expenses for five years, if his family name is carved on the gate beside yours.`,`盐商${c.npc.zh}提出包下你门户五年的开销，条件是把他家的姓刻在大门上，挨着你家的名号。`),
 opts:[{l:T('Accept','答应'),out:[{t:T('The silver is real and steady. In the teahouses, people start calling you the salt merchant’s house.','银子实打实，月月按时到。茶馆里开始有人管你们叫"盐商家的门户"。'),c:'muted',fx:{money:400,f:OG(-5,0)}}]},
  {l:T('Refuse politely','婉言谢绝'),out:[{t:T('He smiles and leaves. Later you learn he made the same offer to your rival, who accepted.','他笑着走了。后来你听说，他把同样的条件开给了你的对头，对方答应了。'),c:'muted',fx:{f:OG(2,0)}}]},
  {l:T('Counter: his name inside, on a donor’s tablet','还价：名字刻在门内的功德碑上'),if:s=>s.smarts>=40,out:[{t:T('He haggles, then agrees. Half the silver, none of the shame.','他讨价还价一番，答应了。银子减半，脸面全保。'),c:'good',fx:{money:200,f:OG(1,0)}}]}]});
I({id:'og_f_charity',only:1,tags:OF,ctx:ogC(s=>({occ:31,age:45})),
 text:c=>T(`The county magistrate sends word that your soup kitchen makes his administration look bad. He would like it closed, "for public order".`,`县太爷派人传话：你的粥棚让他的政绩很难看。他希望你"为地方安宁计"关了它。`),
 opts:[{l:T('Close it','关了'),out:[{t:T('The magistrate is grateful and useful. The hungry go elsewhere, and some of them remember.','县太爷很领情，以后也帮得上忙。饿肚子的人去了别处，有些人记住了。'),c:'muted',fx:{align:-3,f:OG(-2,0),money:60}}]},
  {l:T('Keep it open','照开不误'),out:[{w:2,t:T('He fumes, but the whole county is watching. He cannot touch you.','他气得够呛，可全县都看着，他动不了你。'),c:'good',fx:{align:4,f:OG(5,0)}},{w:1,t:T('He finds a tax you have not paid. It costs you, and you keep the kitchen open anyway.','他翻出一笔你没缴的税。破了财，粥棚你照样开着。'),c:'muted',fx:{align:4,money:-120,f:OG(3,0)}}]},
  {l:T('Move it under his name','挂上县衙的名义'),out:[{t:T('"The Magistrate’s Benevolent Kitchen". He takes the credit; the hungry still eat.','"县衙义粥"。功劳归了他，饿的人照样有饭吃。'),c:'good',fx:{align:2,f:OG(1,0)}}]}]});
I({id:'og_f_ally',only:1,tags:OF,ctx:ogC(s=>({occ:12,age:18,sex:'f'})),
 text:c=>T(`A powerful family proposes a match: their daughter, ${c.npc.en}, for your ${c.sr.en}. The alliance would protect your house for a generation. Your ${c.sr.en} has someone else in mind.`,`一户有权有势的人家来提亲：把女儿${c.npc.zh}许给${c.sr.zh}。这门亲事能保你门户一代平安。可${c.sr.zh}心里另有其人。`),
 opts:[{l:T('Press for the match','力促这门亲事'),out:[{t:T('The wedding is splendid and the alliance holds. Your senior disciple does as told, and never quite smiles at you again.','婚礼风光，联盟也稳了。大弟子听了你的话，从此对你再没真心笑过。'),c:'muted',fx:{f:s=>{ogAdj(s,6,0);const p=staffP(s,'senior');if(p)addBond(p,-20)}}}]},
  {l:T('Let your disciple choose','让弟子自己做主'),out:[{t:T('The family is offended. Your senior disciple marries for love and would now die for you.','对方觉得受了冷落。大弟子娶了心上人，从此愿意为你赴死。'),c:'good',fx:{f:s=>{ogAdj(s,-2,0);const p=staffP(s,'senior');if(p)addBond(p,20)}}}]}]});
INC_BY.og_f_ally.ctx=s=>{const c=ogC({occ:12,age:18,sex:'f'})(s);c.sr=stf(s,'senior');return c};

/* ---------- 处理门中事务 becomes: set this year’s focus, and see what comes of it ---------- */
(()=>{const A=ACT_BY.org_venture;if(!A)return;
 Object.assign(A,{n:T('Set this year’s focus for your house','定下今年门中要务'),d:T('Recruit, train, earn, do good or make allies. The focus stays until you change it.','招人、练兵、生财、行善或结盟。定下后一直有效，直到你更改。'),
  run(s){orgStaff(s);const cur=orgFocus(s);ask(s,'org_venture',{},Object.keys(FOCI).filter(k=>k!=='charity'||!s.org.evil).map(k=>({k,l:T(FOCI[k][0].en+(k===cur?' (current)':''),FOCI[k][0].zh+(k===cur?'（当前）':'')),sub:FOCI[k][1]})).concat([{k:'leave',l:T('Leave things as they are','维持现状')}]))},
  choose(s,k){if(k==='leave'||!FOCI[k]||!s.org)return;s.org.focus=k;
   say(s,`This year ${s.org.name.en} will ${FOCI[k][0].en.toLowerCase()}.`,`今年${s.org.name.zh}的要务：${FOCI[k][0].zh}。`,'muted');runFocus(s,k)}});
})();
/* evil houses keep their own crimes; a focus still shapes their year */
const _yearlyOrg=yearly;
yearly=function(s){
  _yearlyOrg(s);
  if(!s.alive||!s.org)return;orgStaff(s);const o=s.org,k=orgFocus(s);
  if(k==='recruit')ogAdj(s,0,rint(0,2));
  else if(k==='train'){ogAdj(s,1,0);if(o.type==='sect'&&!s.retired)s.skill+=.2}
  else if(k==='trade'){const v=Math.round(o.members*2*o.lv);if(v)payT(s,v,'org')}
  else if(k==='charity'){ogAdj(s,2,0);s.align=clamp(s.align+1,-100,100);if(s.money>=10*o.lv)payT(s,-10*o.lv,'org')}
  else if(k==='ally'){ogAdj(s,1,0)}
  /* a focus is worked at every year, not only when you ask about it */
  if(k&&s.jail<=0&&chance(.3))runFocus(s,k);
  /* the people who run it with you have lives too */
  if(chance(.25)){const p=staffP(s,pick(['senior','steward','elder']));if(p){const L=[
     [`${p.n.py} takes a wife this year. The whole house eats well for three days.`,`${p.n.cn}今年成了亲。全门上下吃了三天好的。`],
     [`${p.n.py} asks for leave to bury a parent. You give silver for the funeral.`,`${p.n.cn}告假回乡奔丧。你给了一份丧仪。`],
     [`${p.n.py} has opinions about how things should be done. Some of them are right.`,`${p.n.cn}对门里的事有一堆主意。有几条还真对。`],
     [`${p.n.py} quietly settles a quarrel before it reaches you. You only hear about it afterwards.`,`${p.n.cn}悄悄把一桩纠纷摆平了，事后你才听说。`]];const l=pick(L);say(s,l[0],l[1],'muted');addBond(p,2)}}
};

/* ---------- good years happen too ---------- */
I({id:'og_g_return',age:[30,95],cd:12,w:1.6,tags:OGT,when:s=>ogA(s)&&s.org.age0!=null&&s.age-s.org.age0>=8,ctx:ogC(s=>({age:rint(28,40)})),
 text:c=>T(`${c.npc.en}, who trained under you years ago and left to trade, comes back rich, and asks what the house needs.`,`当年在你门下待过、后来弃武从商的${c.npc.zh}发了财，回来问门里缺什么。`),
 opts:[{l:T('New halls','添几间屋'),out:[{t:T('The carpenters are there by spring.','开春木匠就来了。'),c:'good',fx:{f:s=>{if(!s.org)return;if(s.org.lv<5){s.org.lv++;say(s,`${s.org.name.en} grows to size ${s.org.lv}.`,`${s.org.name.zh}扩到了${cnNum(s.org.lv)}级。`,'good')}else payT(s,300,'org')}}}]},
  {l:T('Nothing. Visit more often','什么也不缺，常回来看看'),out:[{t:T('He laughs, and sends silver anyway, and visits every New Year after.','他笑了，银子照送，此后每年过年都回来。'),c:'good',fx:{money:200,f:OG(3,0),meet:'friend',bond:70}}]}]});
I({id:'og_g_guest',age:[28,95],cd:10,w:1.4,tags:OGT,when:s=>ogA(s)&&s.org.rep>=20,ctx:ogC(s=>({age:rint(55,75),lv:rint(120,220)})),
 text:c=>T(`A famous old master, ${c.npc.en}, passing through, stays three nights at ${OGN(c).en} and watches your people train.`,`一位成名多年的老前辈${c.npc.zh}路过，在${OGN(c).zh}住了三晚，看你的人练功。`),
 opts:[{l:T('Ask for a word of advice','请前辈指点一二'),out:[{t:T('"Your people are honest. Do not let them become clever." You think about it for years.','"你的人老实。别让他们变得太机灵。"这句话你琢磨了好几年。'),c:'good',fx:{qi:3,f:OG(4,0)}}]},
  {l:T('Host a banquet in his honour','设宴款待'),out:[{t:T('Word gets round that the old master ate at your table. Families start asking about your house.','老前辈在你家吃过饭的消息传开了。开始有人家来打听你的门户。'),c:'good',fx:{money:-40,f:OG(6,1)}}]}]});
I({id:'og_g_wedding',age:[28,95],cd:10,w:1.4,tags:OGT,when:s=>ogA(s)&&s.org.members>=4,ctx:ogC(),
 text:c=>T(`Two of your people want to marry each other. The whole house has known for a year; they think it is a secret.`,`你门下有两人想结为夫妻。全门上下一年前就知道了，就他俩以为瞒得挺好。`),
 opts:[{l:T('Host the wedding yourself','亲自主婚'),out:[{t:T('You give them the east room and a set of bowls. Everyone gets drunk. It is the best day of the year.','你把东厢房给了他们，又送了一套碗。全门的人都喝醉了。这是一年里最好的一天。'),c:'good',fx:{money:-30,happy:6,f:OG(4,0)}}]},
  {l:T('Pretend to be surprised','装作吃惊'),out:[{t:T('Your acting is terrible. They are delighted anyway.','你装得太假了。他们照样高兴得不得了。'),c:'good',fx:{happy:4,f:OG(2,0)}}]}]});
I({id:'og_g_quiet',age:[25,95],cd:6,w:1.3,tags:OGT,when:ogA,ctx:ogC(),
 text:c=>T(`A quiet, prosperous year at ${OGN(c).en}. The gate needs painting; that is the worst news.`,`${OGN(c).zh}平平安安、红红火火地过了一年。最坏的消息是大门该刷漆了。`),
 opts:[{l:T('Paint the gate red','把大门刷成红的'),out:[{t:T('It looks magnificent. A rival house paints theirs the following month.','气派极了。下个月对头家也刷了。'),c:'good',fx:{money:-15,f:OG(2,0)}}]},
  {l:T('Give everyone a holiday','给大家放几天假'),out:[{t:T('They come back rested and a little fond of you.','回来时人人精神饱满，对你也亲近了几分。'),c:'good',fx:{happy:3,f:OG(3,0)}}]}]});
I({id:'og_g_juniorwin',age:[28,95],cd:8,w:1.3,tags:OGT,when:s=>ogA(s)&&s.org.members>=3,ctx:ogC(s=>({age:rint(17,24)})),
 text:c=>T(`${c.npc.en}, one of your juniors, enters the county tournament without telling you, and wins it.`,`门下小辈${c.npc.zh}瞒着你报名参加了县里的比武，还拿了头名。`),
 opts:[{l:T('Scold, then celebrate','先训一顿，再庆贺'),out:[{t:T('You scold for exactly as long as it takes to keep a straight face. Then wine.','你板着脸训到憋不住笑为止。然后上酒。'),c:'good',fx:{f:OG(5,1)}}]},
  {l:T('Just celebrate','直接庆贺'),out:[{t:T('Three more juniors sign up for next year’s tournament.','又有三个小辈报了明年的比武。'),c:'good',fx:{f:OG(4,0)}}]}]});
I({id:'og_g_gift',age:[25,95],cd:10,w:1.2,tags:OGT,when:s=>ogA(s)&&s.align>=10,ctx:ogC(s=>({occ:19,age:70})),
 text:c=>T(`An old villager, ${c.npc.en}, whose grandson your people pulled from the river, arrives with a cart of rice and will not take it back.`,`你的人从河里救过一个孩子。孩子的爷爷${c.npc.zh}拉来一车米，怎么也不肯拉回去。`),
 opts:[{l:T('Accept, with thanks','收下，道谢'),out:[{t:T('Rice for a season. The story of the river goes round the county.','够吃一季的米。救人的事在县里传开了。'),c:'good',fx:{money:60,f:OG(3,0)}}]},
  {l:T('Accept half, return half','收一半，退一半'),out:[{t:T('He grumbles that you are stubborn, and tells everyone.','他嘟囔着说你死脑筋，逢人便讲。'),c:'good',fx:{money:30,f:OG(4,0),align:1}}]}]});
