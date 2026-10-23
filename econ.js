/* 江湖一生 · money as a game: how well you live, what you trade where, who you lend to, land and shops that need decisions,
   small ways to earn a living, and things worth spending on */
'use strict';
ACT_CATS.splice(ACT_CATS.findIndex(c=>c[0]==='work')+1,0,['money',T('Make money','生财')],['spend',T('Spend','花销')]);
Object.assign(LCAT,{trade:T('Trading','贩货'),lend:T('Moneylending','放贷'),land:T('Farmland','田产'),spend:T('Spending','花销'),style:T('Lifestyle','排场'),earn:T('Odd jobs','零活')});
const econPay=(s,n,tag)=>payT(s,Math.round(n),tag);

/* ---------- 1. how well you live ---------- */
const STYLES=[[T('Frugal','清贫度日'),T('Spend as little as possible. Cheaper, but harder on body and spirits.','能省则省。花得少，身心都吃些苦。'),.5],
 [T('Ordinary','寻常过活'),T('Live like most people do.','和大多数人一样过日子。'),1],
 [T('Comfortable','体面讲究'),T('Good food, good clothes, a little respect. Twice the cost.','吃穿讲究，叫人高看一眼。花销翻倍。'),2.2],
 [T('Lavish','挥金如土'),T('Banquets, silk and servants. Very expensive; people notice.','宴饮、绫罗、仆从。花钱如流水，人人看在眼里。'),5]];
const styleOf=s=>s.style??1;
addAct({id:'style',ap:0,cat:'spend',n:T('Set how you live','定下日子的排场'),d:T('Frugal, ordinary, comfortable or lavish. It changes your yearly costs and how you feel.','清贫、寻常、体面、阔绰。决定每年开销，也影响身心和名声。'),ok:s=>needAge(s,16),
 run(s){ask(s,'style',{},STYLES.map((x,i)=>({k:'s'+i,l:T(x[0].en+(i===styleOf(s)?' (now)':''),x[0].zh+(i===styleOf(s)?'（现在）':'')),sub:x[1]})))},
 choose(s,k){const i=+k.slice(1);s.style=i;say(s,`From now on: ${STYLES[i][0].en.toLowerCase()}.`,`从今往后：${STYLES[i][0].zh}。`,'muted')}});
livingCost=function(s){
  if(s.age<16||s.jail>0)return;const st=styleOf(s);
  const fam=family(s),home=parents2(s)&&s.age<22&&!spouseOf(s);
  let base=s.sect&&!s.retired?3:home?2:fam.rich>=4&&s.age<25?0:7;if(st>=2)base=Math.max(base,6);
  const cost=Math.round(base*STYLES[st][2]*s.world.p);
  if(cost&&s.money>=cost){payT(s,-cost,'living');if(s.world.p>=1.5&&st<=1)say(s,`Food alone costs you ${cost} taels this year.`,`光是吃饭，今年就花了${cost}两。`,'muted')}
  else if(cost&&parents2(s)&&s.age<30){pay(s,-s.money);happy(s,-2);say(s,'You are short of money; your parents quietly feed you again.','你手头紧，爹娘又默默管了你的饭。','muted')}
  else if(cost){pay(s,-s.money);if(st>=2){s.style=1;say(s,'You cannot keep up appearances any more. The servants go first, then the silk.','排场撑不下去了。先辞了仆人，再当了绸缎。','bad')}
    else{happy(s,-6);s.health=Math.max(Math.min(s.health,12),s.health-rint(3,8));say(s,'You cannot afford enough to eat. Some days there is nothing at all.','你吃不饱饭，有些日子干脆什么也没得吃。','bad')}return}
  if(st===0){happy(s,-2);if(chance(.25))s.health=Math.max(1,s.health-rint(1,4))}
  else if(st===2){happy(s,2);if(chance(.3))s.fame+=1}
  else if(st===3){happy(s,4);s.fame+=1;if(chance(.25)){s.health=Math.max(1,s.health-rint(1,3));say(s,'Too many banquets. Your belt has moved two holes.','宴席太多，腰带松了两个扣眼。','muted')}}};

/* ---------- 2. trading: buy where it is cheap, carry it, sell where it is dear ---------- */
const GOODS={
 tea:[T('tea','茶叶'),10,{jiangnan:.6,shu:.7,miao:.8,north:1.6,west:1.9,capital:1.3}],
 salt:[T('salt','盐'),8,{east:.5,central:1,west:1.8,shu:1.4,miao:1.6,north:1.3}],
 silk:[T('silk','丝绸'),30,{jiangnan:.6,central:.9,capital:1.3,west:2,north:1.5}],
 horses:[T('horses','马匹'),60,{north:.6,west:.7,central:1.2,jiangnan:1.6,east:1.5,shu:1.4}],
 herbs:[T('medicinal herbs','药材'),15,{miao:.5,shu:.6,west:.9,capital:1.6,east:1.3,jiangnan:1.2}],
 furs:[T('furs','皮货'),20,{north:.5,west:.7,jiangnan:1.6,capital:1.5,east:1.4}],
 china:[T('porcelain','瓷器'),25,{jiangnan:.7,central:.8,east:.9,west:2.1,north:1.5}]};
const RXY={central:[0,0],capital:[0,2],north:[0,3.5],jiangnan:[2,-1],east:[3.5,0],shu:[-2,-1],miao:[-1.5,-3],west:[-4.5,1]};
const dist=(a,b)=>{const p=RXY[a]||[0,0],q=RXY[b]||[0,0];return Math.max(1,Math.round(Math.hypot(p[0]-q[0],p[1]-q[1])))};
const regName=id=>{const r=REGIONS.find(x=>x.id===id);return r?T(r.en,r.cn):T(id,id)};
function mkt(s){s.mkt=s.mkt||{};for(const g in GOODS)if(s.mkt[g]==null)s.mkt[g]=1;return s.mkt}
const priceAt=(s,g,reg)=>GOODS[g][1]*(1+((GOODS[g][2][reg]||1)-1)*.65)*mkt(s)[g];
const quote=(s,g,reg)=>Math.max(1,Math.round(priceAt(s,g,reg)*(1+(R()-.5)*clamp(.5-s.smarts/250-(s.tradeXP||0)*.03,.08,.5))));
addAct({id:'trade',ap:2,cat:'money',n:T('Run goods to another region','贩货'),d:T('Buy cheap here, carry it far, sell dear. Prices move; roads are dangerous.','在本地低价买进，运去别处高价卖出。行情会变，路上有风险。'),
 ok:s=>s.age<16?needAge(s,16):s.money<40?T('Needs at least 40 taels','至少需四十两本钱'):s.jail>0?notJail(s):true,
 run(s){const opts=Object.keys(GOODS).map(g=>{const p=Math.round(priceAt(s,g,s.region));const best=Object.keys(RXY).filter(r=>r!==s.region).sort((a,b)=>priceAt(s,g,b)-priceAt(s,g,a))[0];
    return{k:g,l:T(`${GOODS[g][0].en}: ${p} taels a load here`,`${GOODS[g][0].zh}：本地每担${p}两`),sub:T(`Said to fetch most in ${regName(best).en}`,`听说${regName(best).zh}卖得最贵`),p}}).sort((a,b)=>(GOODS[a.k][2][s.region]||1)-(GOODS[b.k][2][s.region]||1)).slice(0,4);
   ask(s,'trade',{step:1},opts.map(o=>({k:o.k,l:o.l,sub:o.sub})).concat([{k:'leave',l:T('Not this year','今年不做')}]))},
 choose(s,k,c){if(k==='leave')return;
   if(c.step===1){const g=k;const buy=Math.round(priceAt(s,g,s.region));const dests=Object.keys(RXY).filter(r=>r!==s.region).map(r=>({r,q:quote(s,g,r),d:dist(s.region,r)})).sort((a,b)=>b.q-a.q).slice(0,4);
     return{c:{step:2,g,buy},opts:dests.map(x=>({k:x.r,l:T(`To ${regName(x.r).en}: heard ${x.q} a load`,`运往${regName(x.r).zh}：听说每担${x.q}两`),sub:T(`${x.d} stages of road · ${x.d>=4?'long and risky':x.d>=2?'a fair way':'close'}`,`路程${cnNum(x.d)}站 · ${x.d>=4?'路远险多':x.d>=2?'不近不远':'很近'}`)})).concat([{k:'sellhere',l:T('Never mind','算了')}])}}
   if(c.step===2){if(k==='sellhere')return;const d=dist(s.region,k);const mx=Math.floor((s.money-8*d)/(c.buy*(1+.03*d+.12)));if(mx<1){say(s,'You cannot afford even one load and the road.','连一担货加路费都凑不出来。','muted');return}
     const sz=[Math.max(1,Math.min(mx,Math.round(60/c.buy))),Math.max(1,Math.min(mx,Math.round(250/c.buy))),mx].filter((v,i,a)=>a.indexOf(v)===i);
     const opts=[];sz.forEach(q=>{const hl=Math.round(q*c.buy*.03*d)+8*d;opts.push({k:'s'+q,l:T(`${q} loads (${q*c.buy} taels + ${hl} haulage), guard it yourself`,`进${cnNum(q)}担（${q*c.buy}两，脚力${hl}两），自己押运`)});opts.push({k:'e'+q,l:T(`${q} loads, hire escorts (+${Math.round(q*c.buy*.12)+5} taels)`,`进${cnNum(q)}担，雇镖师护送（另付${Math.round(q*c.buy*.12)+5}两）`)})});
     return{c:Object.assign({},c,{step:3,dest:k,d}),opts:opts.concat([{k:'leave',l:T('Too risky. Forget it','风险太大，算了')}])}}
   if(c.step===3){const esc=k[0]==='e',q=+k.slice(1),g=c.g,d=c.d;const haul=Math.round(q*c.buy*.03*d)+8*d;const cost=q*c.buy+haul+(esc?Math.round(q*c.buy*.12)+5:0);if(s.money<cost){say(s,'You come up short at the warehouse.','到了货栈才发现钱不够。','muted');return}
     econPay(s,-cost,'trade');let loads=q;const name=GOODS[g][0];
     const pr=(.05+.06*(s.world?s.world.u:0)+.03*d+Math.min(.2,q/400))*(esc?.35:1);
     if(chance(pr)){if(esc){const lost=Math.ceil(loads*rint(15,40)/100);loads-=lost;say(s,`Bandits hit the caravan. Your escorts beat them off, but ${lost} load${lost>1?'s':''} are lost.`,`半路遇劫。镖师们打退了强盗，可还是丢了${cnNum(lost)}担。`,'bad')}
       else{const r=fightLife(s,{name:pick([T('road bandits','拦路山贼'),T('a band of deserters','一伙逃兵'),T('salt-road robbers','盐道劫匪')]),lv:PW(.9,4)(s)},{stakes:'injury',title:T('Robbers on the road','路遇劫匪'),cause:T('robbers on a trade road','贩货遇劫')});
         if(!r.win){const lost=Math.ceil(loads*rint(50,100)/100);loads-=lost;say(s,loads?`They take ${lost} loads and leave you the rest.`:'They take everything.',loads?`他们抢走了${cnNum(lost)}担，剩下的留给了你。`:'他们把货全抢走了。','bad')}else say(s,'You drive them off. The cargo is safe.','你把他们打跑了。货保住了。','good')}}
     if(loads<=0){s.tradeXP=(s.tradeXP||0)+1;return}
     let p=priceAt(s,g,c.dest)*(.78+R()*.5);const ev=R();let note=null;
     if(ev<.08){p*=.6;note=T(`A glut: three other caravans of ${name.en} arrived the week before you.`,`货多压价：你到之前一个礼拜，已经来了三队${name.zh}。`)}
     else if(ev<.16){p*=1.6;note=T(`A shortage: nobody else got through this season, and buyers fight over your ${name.en}.`,`货源紧缺：这一季别人都没运到，买家抢着要你的${name.zh}。`)}
     p*=1/(1+loads/120);if(loads>=60&&chance(.6))note=note||T('So much at once floods the market; buyers know you must sell.','一下子运去这么多，行情被你自己压垮了，买家都知道你急着脱手。');
     if(['tea','salt','herbs'].includes(g))p*=(.8+.2*(s.world?s.world.p:1));
     const take=Math.round(loads*p);econPay(s,take,'trade');s.tradeXP=(s.tradeXP||0)+1;
     if(note)say(s,note.en,note.zh,'muted');const net=take-cost;
     say(s,`You sell ${loads} loads of ${name.en} in ${regName(c.dest).en} for ${take} taels. ${net>=0?`Profit: ${net}.`:`Loss: ${-net}.`}`,`你在${regName(c.dest).zh}卖掉${cnNum(loads)}担${name.zh}，得${take}两。${net>=0?`净赚${net}两。`:`亏了${-net}两。`}`,net>=0?'good':'bad');
     if(net>=300)deed(s,`Made ${net} taels on a single trade run`,`一趟贩货净赚${net}两`)}}});

/* ---------- 3. moneylending ---------- */
const BORROW=[{k:'tenant',n:T('a tenant farmer','佃户'),amt:40,rate:.2,risk:.12,harv:1},{k:'merchant',n:T('a small merchant','小商人'),amt:200,rate:.15,risk:.1},
 {k:'heir',n:T('a spendthrift young master','败家公子'),amt:400,rate:.35,risk:.3},{k:'gambler',n:T('a gambler','赌徒'),amt:100,rate:.6,risk:.45}];
addAct({id:'lend',cat:'money',n:T('Lend money at interest','放贷'),d:T('Higher interest, higher risk. Some debts have to be collected.','利息越高，风险越大。有些债得上门去讨。'),
 ok:s=>s.age<20?needAge(s,20):s.money<40?T('Needs at least 40 taels','至少需四十两'):(s.loans||[]).length>=4?T('You already have four loans out','已放出四笔债'):true,
 run(s){ask(s,'lend',{},BORROW.filter(b=>s.money>=b.amt).map(b=>({k:b.k,l:T(`${b.amt} taels to ${b.n.en}`,`借${b.amt}两给${b.n.zh}`),sub:T(`${Math.round(b.rate*100)}% interest a year · ${b.risk>=.3?'often defaults':b.risk>=.12?'sometimes defaults':'usually pays'}`,`年息${Math.round(b.rate*100)}分 · ${b.risk>=.3?'常常赖账':b.risk>=.12?'偶尔赖账':'大多守信'}`)})).concat([{k:'leave',l:T('Keep your silver','钱还是自己攥着')}]))},
 choose(s,k){if(k==='leave')return;const b=BORROW.find(x=>x.k===k);const p=npc(s,{occ:b.k==='tenant'?0:b.k==='merchant'?17:b.k==='heir'?11:7});
   econPay(s,-b.amt,'lend');(s.loans=s.loans||[]).push({k:b.k,amt:b.amt,rate:b.rate,risk:b.risk,due:s.age+rint(1,2),n:{en:p.en,zh:p.zh},yrs:0});
   if(b.k==='tenant'&&chance(.5))s.align-=1;say(s,`${p.en} signs the note with a thumbprint.`,`${p.zh}按了手印。`,'muted')}});
addAct({id:'loancol',cat:'money',n:T('Collect a debt','讨债'),d:'',if:()=>false,run(){},
 choose(s,k,c){s.loans=s.loans||[];let i=s.loans.indexOf(c.L);if(i<0)i=s.loans.findIndex(x=>c.L&&x.amt===c.L.amt&&x.n.zh===c.L.n.zh);if(i<0){say(s,'That debt has already been settled.','那笔债已经了结了。','muted');return}const L=s.loans[i];
   if(k==='press'){const r=R();if(r<.45+s.fame/300){econPay(s,Math.round(L.amt*(1+L.rate)),'lend');s.align-=1;say(s,`${L.n.en} scrapes it together under your eye.`,`在你的注视下，${L.n.zh}东拼西凑把钱还上了。`,'muted');s.loans.splice(i,1)}
     else if(r<.7){econPay(s,Math.round(L.amt*.5),'lend');say(s,`You get half. There is nothing else in the house to take.`,`只讨回一半。屋里再没什么能拿的了。`,'muted');s.loans.splice(i,1)}
     else{const f=fightLife(s,{name:T(`${L.n.en}’s brothers`,`${L.n.zh}的兄弟们`),lv:PW(.8,3)(s)},{stakes:'light',title:T('A debt collection','上门讨债'),cause:T('a debt collection gone wrong','讨债')});if(f.win){econPay(s,L.amt,'lend');say(s,'You get your principal back, and a reputation.','本钱讨回来了，名声也传出去了。','muted')}s.loans.splice(i,1)}}
   else if(k==='wait'){L.due=s.age+1;L.amt=Math.round(L.amt*(1+L.rate*.5));s.align+=1;say(s,`You give ${L.n.en} another year.`,`你给了${L.n.zh}一年宽限。`,'muted')}
   else if(k==='forgive'){s.loans.splice(i,1);s.align+=4;s.fame+=1;say(s,`You burn the note in front of ${L.n.en}. They will tell this story for years.`,`你当着${L.n.zh}的面把借据烧了。这事对方会讲上好多年。`,'good')}
   else if(k==='sell'){s.loans.splice(i,1);econPay(s,Math.round(L.amt*.35),'lend');s.align-=3;say(s,`You sell the note to a debt collector with a scarred face. What happens next is not your business.`,`你把借据卖给了一个脸上带疤的讨债人。接下来的事，与你无关了。`,'muted')}}});
function loansYear(s){if(!s.loans||!s.loans.length)return;const h=s.world?s.world.h:0;
  for(const L of [...s.loans]){if(s.age<L.due)continue;const risk=L.risk+(L.k==='tenant'&&h<=-1?.25:0);
    if(!chance(risk)){const back=Math.round(L.amt*(1+L.rate*Math.max(1,s.age-L.due+1)));econPay(s,back,'lend');say(s,`${L.n.en} repays: ${back} taels.`,`${L.n.zh}还了债：${back}两。`,'good');s.loans.splice(s.loans.indexOf(L),1)}
    else if(s.queue.length<3)s.queue.push({src:'act',id:'loancol',c:{L},text:T(`${L.n.en} cannot repay the ${L.amt} taels.${L.k==='tenant'&&h<=-1?' The harvest failed.':''}`,`${L.n.zh}还不上那${L.amt}两。${L.k==='tenant'&&h<=-1?'今年颗粒无收。':''}`),
      opts:[{k:'press',l:T('Press for it','上门催讨')},{k:'wait',l:T('Give another year','宽限一年')},{k:'forgive',l:T('Forgive the debt','把债免了')},{k:'sell',l:T('Sell the note to a collector','把借据卖给讨债的')}]})}}

/* ---------- 4. farmland ---------- */
addAct({id:'land',cat:'money',n:T('Buy or sell farmland','买卖田地'),d:T('Ten mu at a time. Rent depends on the harvest; turmoil can take it away.','十亩一块。租子看收成，世道乱了也可能保不住。'),ok:s=>needAge(s,18),
 run(s){const p=Math.round(150*(s.world?Math.max(.8,s.world.p*.9):1));const L=s.land||0;
  ask(s,'land',{p},[{k:'buy',l:T(`Buy ten mu (${p} taels)`,`买十亩（${p}两）`),sub:T(`You own ${L*10} mu.`,`你现有${cnNum(L*10)}亩。`)},...(L?[{k:'sell',l:T(`Sell ten mu (${Math.round(p*.85)} taels)`,`卖十亩（${Math.round(p*.85)}两）`)}]:[]),{k:'leave',l:T('Leave it','不动')}])},
 choose(s,k,c){if(k==='buy'){if(s.money<c.p){say(s,'Not enough silver.','银子不够。','muted');return}econPay(s,-c.p,'land');s.land=(s.land||0)+1;say(s,`You walk the boundary stones of your new fields.`,`你沿着新买的田界走了一圈。`,'good')}
  else if(k==='sell'&&s.land){s.land--;econPay(s,Math.round(c.p*.85),'land');say(s,'You sign the land away.','你签字画押，卖了地。','muted')}}});
function landYear(s){if(!s.land)return;const h=s.world?s.world.h:0,u=s.world?s.world.u:0;
  if(u>=3&&chance(.15)){s.land--;say(s,'In the turmoil, soldiers take ten mu of your land for their camp. No one will compensate you.','兵荒马乱，官军占了你十亩地扎营。没人给你一文钱。','bad');if(!s.land)return}
  const rent=Math.round(s.land*rint(10,16)*[.3,.7,1,1.2,1.4][h+2]-s.land*2);econPay(s,rent,'land');
  if(chance(.35))say(s,rent>=0?`Your ${s.land*10} mu bring in ${rent} taels of rent after tax.`:`Your land costs you ${-rent} taels this year.`,rent>=0?`${cnNum(s.land*10)}亩田，交完税收了${rent}两租子。`:`今年田地倒贴了${-rent}两。`,'muted')}

/* ---------- 5. more shops to own, and the decisions that come with them ---------- */
Object.assign(ITEMS,{grocery:{cat:'biz',n:T('Grocery','杂货铺'),price:300,inc:[8,60],risk:.05},herbshop:{cat:'biz',n:T('Herb Shop','药铺'),price:900,inc:[25,160],risk:.05},
 dyeworks:{cat:'biz',n:T('Dye Works','染坊'),price:1300,inc:[30,240],risk:.07},inn:{cat:'biz',n:T('Inn','客栈'),price:2600,inc:[60,430],risk:.08},
 pawnshop:{cat:'biz',n:T('Pawnshop','当铺'),price:3500,inc:[90,560],risk:.1},boatline:{cat:'biz',n:T('River Boat Line','船行'),price:6500,inc:[160,1150],risk:.15},
 mastersword:{cat:'weapon',n:T('Master-forged Sword','名匠宝剑'),price:3500,atk:40,rare:.2}});
MARKET.push('grocery','herbshop','dyeworks');RARE.push('inn','pawnshop','boatline');
const _rollStock=rollStock;rollStock=function(s){_rollStock(s);['inn','pawnshop','boatline'].forEach((k,i)=>{if(chance([.5,.35,.2][i]))s.stock.ids.push(k)})};
addAct({id:'bizdec',cat:'money',n:T('Business','生意'),d:'',if:()=>false,run(){},
 choose(s,k,c){const it=s.items.includes(c.it)?c.it:s.items.find(x=>c.it&&x.id===c.it.id&&x.age===c.it.age)||s.items.find(x=>c.it&&x.id===c.it.id);if(!it){say(s,'The shop is no longer yours to worry about.','那间铺子已经不归你管了。','muted');return}const d=itemDef(it.id);if(!d||!d.inc)return;const inc=it.inc||d.inc;
  if(k==='expand'){const cost=Math.round(d.price*.4);if(s.money<cost){say(s,'You do not have the silver.','银子不够。','muted');return}econPay(s,-cost,'biz');
    if(chance(.7)){it.inc=[Math.round(inc[0]*1.35),Math.round(inc[1]*1.35)];say(s,`The expansion pays off. Your ${d.n.en} does better business.`,`扩张见了成效，${d.n.zh}的生意更好了。`,'good')}else say(s,`The expansion is a mistake: new rent, no new customers.`,`扩张失算了：房租涨了，客人没多。`,'bad')}
  else if(k==='pricewar'){if(chance(.5+s.smarts/300)){econPay(s,-rint(20,60),'biz');say(s,'You undercut them until they fold. It costs you a season’s profit.','你压价压到对方关门。代价是一季的利润。','muted')}else{it.inc=[Math.round(inc[0]*.8),Math.round(inc[1]*.8)];say(s,'They outlast you. Your trade shrinks.','对方撑得比你久。你的生意缩了。','bad')}}
  else if(k==='quality'){if(chance(.6)){it.inc=[inc[0],Math.round(inc[1]*1.15)];say(s,'Customers notice the difference, slowly.','客人慢慢觉出了不同。','good')}else say(s,'Nobody notices.','没人在意。','muted')}
  else if(k==='report'){if(chance(.5)){econPay(s,Math.round(d.price*.08),'biz');say(s,'The constables catch him with half the money.','捕快抓住了他，追回一半的钱。','good')}else say(s,'He is never found.','人始终没抓到。','muted')}
  else if(k==='hunt'){const f=fightLife(s,{name:T('the runaway clerk and his friends','卷款的伙计和他的同伙'),lv:PW(.7,2)(s)},{stakes:'light',title:T('Chasing a thief','追讨卷款'),cause:T('chasing a thief','追讨卷款')});if(f.win){econPay(s,Math.round(d.price*.12),'biz');say(s,'You get it all back, and then some.','钱全追回来了，还多拿了一点。','good')}}
  else if(k==='sellbiz'){const v=Math.round(c.offer);s.items.splice(s.items.indexOf(it),1);econPay(s,v,'sell');say(s,`You sell your ${d.n.en} for ${v} taels.`,`你以${v}两卖掉了${d.n.zh}。`,'muted')}}});
function bizYear(s){if(s.queue.length>2)return;s.items.forEach((it,i)=>{const d=itemDef(it.id);if(!d||d.cat!=='biz'||!chance(.14))return;const r=R();
  if(r<.3)s.queue.push({src:'act',id:'bizdec',c:{it},text:T(`The shop next to your ${d.n.en} is for rent. You could expand.`,`你${d.n.zh}隔壁的铺面要出租。可以扩张。`),opts:[{k:'expand',l:T(`Expand (${Math.round(d.price*.4)} taels)`,`扩张（${Math.round(d.price*.4)}两）`)},{k:'no',l:T('Stay as you are','维持现状')}]});
  else if(r<.55)s.queue.push({src:'act',id:'bizdec',c:{it},text:T(`A rival opens across the street from your ${d.n.en}, selling cheaper.`,`你${d.n.zh}对面新开了一家，卖得更便宜。`),opts:[{k:'pricewar',l:T('Undercut them','跟他拼价钱')},{k:'quality',l:T('Compete on quality','拼货色和手艺')},{k:'no',l:T('Ignore them','不理会')}]});
  else if(r<.75){const offer=d.price*(.8+R()*.6);s.queue.push({src:'act',id:'bizdec',c:{it,offer},text:T(`A buyer offers ${Math.round(offer)} taels for your ${d.n.en}.`,`有人出${Math.round(offer)}两要买你的${d.n.zh}。`),opts:[{k:'sellbiz',l:T('Sell','卖')},{k:'no',l:T('Not for sale','不卖')}]})}
  else s.queue.push({src:'act',id:'bizdec',c:{it},text:T(`Your clerk at the ${d.n.en} has vanished with the till.`,`${d.n.zh}的伙计卷了柜上的钱跑了。`),opts:[{k:'report',l:T('Report it','报官')},{k:'hunt',l:T('Hunt him down yourself','亲自去追')},{k:'no',l:T('Write it off','自认倒霉')}]})})}

/* ---------- 6. small ways to earn ---------- */
addAct({id:'peddle',cat:'money',n:T('Sell at a market stall','摆摊做小买卖'),d:T('Twenty taels of stock. Your wits decide the rest.','二十两本钱进货，赚赔看你的眼光。'),ok:s=>s.age<12?needAge(s,12):s.money<20?T('Needs 20 taels','需二十两'):s.jail>0?notJail(s):true,
 run(s){econPay(s,-20,'earn');const g=Math.round(20*(.5+R()*1.1+s.smarts/120+s.t.luck*.03));econPay(s,g,'earn');const what=pick([['straw sandals','草鞋'],['steamed buns','包子'],['cheap hairpins','便宜发簪'],['candied hawthorn','糖葫芦'],['paper kites','纸鸢']]);
  say(s,`You sell ${what[0]} at the market. ${g>=20?`Profit: ${g-20} taels.`:`Loss: ${20-g} taels.`}`,`你在集上卖${what[1]}。${g>=20?`赚了${g-20}两。`:`亏了${20-g}两。`}`,g>=20?'good':'muted');if(chance(.08)){const i=pickIncident(s,'town');if(i)runIncident(s,i)}}});
addAct({id:'perform',cat:'money',n:T('Perform martial arts in the street','街头卖艺'),d:T('Show your skill for coins. The better you are, the more you earn; local toughs may object.','当街练一套，赚些赏钱。功夫越好赏钱越多，地头蛇可能找茬。'),ok:s=>s.age<12?needAge(s,12):power(s)<15?T('Needs power 15+','需功力15以上'):s.jail>0?notJail(s):true,
 run(s){const g=Math.round(rint(3,12)+power(s)*.25+s.looks*.08);
  if(chance(.15)){const f=fightLife(s,{name:T('the local tough','地头蛇'),lv:PW(.85,3)(s)},{stakes:'light',title:T('Whose street is it','谁的地盘'),cause:T('a street fight','街头斗殴')});if(f.win){econPay(s,g+10,'earn');s.fame+=1;say(s,`The local tough wanted a cut. Now the crowd pays double.`,`地头蛇想抽成，被你打跑了。看客赏得更多了。`,'good')}else say(s,'The local tough takes your takings.','赏钱全被地头蛇抢了。','bad');return}
  econPay(s,g,'earn');say(s,`A crowd gathers for your sword dance, and ${g} taels in coins land in the bowl.`,`你当街舞了一套，围了一圈人。碗里落了${g}两赏钱。`,'muted')}});
addAct({id:'scribe',cat:'money',n:T('Write letters for hire','代写书信'),d:T('Read and write for those who cannot. Steady, small, and you hear things.','替不识字的人读信写信。钱不多，但稳当，还能听到不少事。'),ok:s=>s.age<12?needAge(s,12):s.smarts<40?T('Needs learning 40+','需学识40以上'):true,
 run(s){const g=rint(8,22)+Math.round(s.smarts/10);econPay(s,g,'earn');s.smarts=clamp(s.smarts+1,0,100);
  const l=pick([['a soldier’s letter home that you have to make sound braver than he is','替一个兵写家书，得写得比他本人勇敢些'],['a love letter for a shy butcher','替一个害羞的屠户写情书'],['a petition to the magistrate about a stolen ox','替人给县太爷写状子，告人偷了牛'],['a will, for an old woman who keeps changing her mind','替一个老太太写遗嘱，她改了一遍又一遍']]);
  say(s,`You earn ${g} taels writing letters. The strangest: ${l[0]}.`,`你代写书信赚了${g}两。最有意思的一封：${l[1]}。`,'muted');if(chance(.1)&&INC_BY.rl_confide){const i=pickIncident(s,'town');if(i)runIncident(s,i)}}});

/* ---------- 7. things worth spending on ---------- */
addAct({id:'banquet',cat:'spend',n:T('Host a banquet','设宴请客'),d:T('Friends, neighbours, useful people. Costs silver; earns goodwill, sometimes trouble.','请朋友、邻里、用得着的人吃饭。花银子，换人情，有时也惹麻烦。'),ok:s=>s.age<18?needAge(s,18):s.money<40?T('Needs 40 taels','需四十两'):true,
 run(s){ask(s,'banquet',{},[{k:'small',l:T('A small dinner (40 taels)','小酌一桌（四十两）')},...(s.money>=250?[{k:'big',l:T('A great feast (250 taels)','大摆筵席（二百五十两）')}]:[]),{k:'leave',l:T('Not now','改日')}])},
 choose(s,k){if(k==='leave')return;const big=k==='big';econPay(s,big?-250:-40,'spend');const ps=s.people.filter(p=>p.alive&&!p.temp&&!hostile(p));shuffle(ps).slice(0,big?6:3).forEach(p=>addBond(p,rint(3,big?10:6)));happy(s,big?6:3);if(big)s.fame+=2;
  const r=R();if(r<.25){const q=mkPerson(s,{rel:'acq',bond:rint(50,65),lv:worldLv()});s.people.push(q);say(s,`Among the guests is ${q.n.py}, whom you are glad to have met.`,`宾客中有一位${q.n.cn}，结识了很是高兴。`,'good')}
  else if(r<.37){const f=fightLife(s,{name:T('a drunk guest','喝醉的客人'),lv:PW(.6,2)(s)},{stakes:'light',title:T('A banquet brawl','宴席上的斗殴'),cause:T('a banquet brawl','宴席斗殴')});say(s,'Two guests come to blows over an old grudge. The feast ends early.','两位客人因旧怨动了手。宴席草草收场。','muted')}
  else if(r<.47){econPay(s,big?-80:-15,'spend');say(s,'The wine runs out and you have to send for more. It costs more than you planned.','酒喝光了，只好再去买。花得比打算的多。','muted')}
  else say(s,big?'A feast people will talk about for a year.':'A warm evening, too much food, good company.',big?'一场让人说上一年的盛宴。':'一个热闹的晚上，菜太多，人很好。','good')}});
addAct({id:'tonic',cat:'spend',n:T('Buy tonics and see a herbalist','进补调养'),d:T('Ginseng, deer antler and advice. Good for the body, if the seller is honest.','人参、鹿茸，外加大夫的叮嘱。补身子——前提是卖家不骗你。'),ok:s=>s.age<16?needAge(s,16):s.money<60?T('Needs 60 taels','需六十两'):true,
 run(s){ask(s,'tonic',{},[{k:'a',l:T('Ordinary tonics (60 taels)','寻常补药（六十两）')},...(s.money>=300?[{k:'b',l:T('Old mountain ginseng (300 taels)','百年老山参（三百两）')}]:[]),{k:'leave',l:T('Not now','改日')}])},
 choose(s,k){if(k==='leave')return;const b=k==='b';econPay(s,b?-300:-60,'spend');const r=R();
  if(r<.15){say(s,b?'The “hundred-year ginseng” is a carved radish. You find out too late.':'The tonic is mostly liquorice and hope.',b?'那根"百年老参"是萝卜雕的。你发现时已经晚了。':'补药里大半是甘草，剩下的是心理作用。','bad');return}
  heal(s,b?30:12);if(b&&chance(.5))s.maxHealth=clamp(s.maxHealth+2,20,140);if(b&&chance(.25))s.lifespan+=1;s.qi+=b?3:1;
  say(s,b?'Warmth spreads through you for a week. You feel years younger.':'You sleep better and your old aches ease.',b?'一个礼拜里，暖意在周身流转。你觉得年轻了好几岁。':'你睡得好了，旧伤也不那么疼了。','good')}});
addAct({id:'forge',cat:'spend',n:T('Commission a weapon','请匠人打造兵器'),d:T('Pay a smith and hope. Sometimes a masterpiece, sometimes a disappointment.','付钱给铁匠，然后盼着。有时打出神兵，有时叫人失望。'),ok:s=>s.age<14?needAge(s,14):s.money<180?T('Needs 180 taels','需一百八十两'):true,
 run(s){ask(s,'forge',{},[{k:'t1',l:T('A good steel blade (180 taels)','好钢打一柄（一百八十两）')},...(s.money>=600?[{k:'t2',l:T('A famous smith (600 taels)','请名匠（六百两）')}]:[]),...(s.money>=2200?[{k:'t3',l:T('A master of the Sword Forge (2,200 taels)','请剑庐的大师（两千二百两）')}]:[]),{k:'leave',l:T('Not now','改日')}])},
 choose(s,k){if(k==='leave')return;const tiers={t1:[180,['ironsword','steelsword','coldsaber']],t2:[600,['steelsword','coldsaber','heavysword']],t3:[2200,['coldsaber','heavysword','mastersword']]};const [cost,ids]=tiers[k];econPay(s,-cost,'spend');
  const r=R()+s.t.luck*.015;const id=r<.2?ids[0]:r<.88?ids[1]:ids[2];s.items.push({id,age:s.age});const it=itemDef(id);
  say(s,id===ids[2]?`The smith works for a season and comes out pale: a ${it.n.en}, better than anything he has made. He will not take more money.`:id===ids[0]?`The ${it.n.en} is serviceable, and no better. The smith blames the iron.`:`A fine ${it.n.en}, exactly what you paid for.`,id===ids[2]?`匠人闭门打了一季，出来时脸色苍白：一柄${it.n.zh}，是他平生最好的作品。他坚决不肯多收钱。`:id===ids[0]?`一柄${it.n.zh}，能用而已。匠人怪铁料不好。`:`一柄上好的${it.n.zh}，物有所值。`,id===ids[2]?'gold':id===ids[0]?'muted':'good')}});
addAct({id:'charity',cat:'spend',n:T('Give to the poor','施粥修桥'),d:T('Feed the hungry, mend a bridge, fund a school. Silver for goodwill, if it reaches the right hands.','施粥、修桥、办义学。拿银子换人心——前提是钱真到了该到的地方。'),ok:s=>s.age<16?needAge(s,16):s.money<50?T('Needs 50 taels','需五十两'):true,
 run(s){const g=s.money>=400?200:50;econPay(s,-g,'spend');const r=R();
  if(r<.2){s.align+=1;say(s,'Half the silver vanishes into the hands of the clerk who “organised” it.','一半的银子，落进了"经手"的书办腰包。','muted')}
  else{s.align+=g>=200?6:3;s.fame+=g>=200?2:1;say(s,g>=200?'The new bridge is named after you, which embarrasses you more than you expected.':'A winter’s worth of rice porridge for the poorest street in town.',g>=200?'新修的桥用了你的名字命名，你比预想的还要难为情。':'城里最穷的那条街，一个冬天都有粥喝。','good');if(chance(.2)&&typeof addThread==='function'){const c={npc:npc(s,{occ:pick([7,18,20])})};addThread(s,'grateful',c,T('You fed the poor one hard winter.','那年冬天，你施过粥。'))}}}});
addAct({id:'sendhome',cat:'spend',n:T('Send money home','寄钱回家'),d:T('For your parents, or your family.','孝敬爹娘，接济家里。'),if:s=>s.age>=16&&s.people.some(p=>p.alive&&['father','mother'].includes(p.rel)),ok:s=>s.money<30?T('Needs 30 taels','需三十两'):true,
 run(s){const g=s.money>=300?100:30;econPay(s,-g,'family');const ps=s.people.filter(p=>p.alive&&['father','mother'].includes(p.rel));ps.forEach(p=>addBond(p,rint(4,9)));
  if(chance(.15)){(s.flags.homeSaved=(s.flags.homeSaved||0)+g);say(s,'Your mother writes that she has put it aside “for when you need it”. You will see it again one day.','母亲来信说，这钱她给你攒着，"等你用得着的时候"。总有一天你会再见到它。','muted')}
  else say(s,'A letter comes back: new roof tiles, and your father has stopped coughing.','回信说：屋顶换了新瓦，父亲也不怎么咳了。','good')}});

/* ---------- the year’s money ---------- */
const _yearlyEcon=yearly;
yearly=function(s){_yearlyEcon(s);if(!s.alive)return;
  const m=mkt(s);for(const g in m)m[g]=clamp(m[g]*(.85+R()*.32),.6,1.6);
  if(s.flags.homeSaved&&!s.people.some(p=>p.alive&&['father','mother'].includes(p.rel))){econPay(s,s.flags.homeSaved,'family');say(s,`Going through your mother’s things you find a purse with every tael you ever sent home: ${s.flags.homeSaved}.`,`收拾母亲的遗物时，你发现一个钱袋，里面是你寄回家的每一两银子：${s.flags.homeSaved}两。`,'gold');delete s.flags.homeSaved}
  if(s.jail>0)return;loansYear(s);landYear(s);bizYear(s)};
/* a rumour about the markets now and then */
TEXTURE.push({rep:1,age:[16,99],w:1,when:s=>s.age>=16,t:s=>{const g=pick(Object.keys(GOODS)),r=pick(Object.keys(RXY));const up=mkt(s)[g]>=1.15,dn=mkt(s)[g]<=.85;if(!up&&!dn)return null;
  return T(`Merchants say ${GOODS[g][0].en} prices are ${up?'up':'down'} this year, in ${regName(r).en} especially.`,`商人们说今年${GOODS[g][0].zh}的价钱${up?'看涨':'看跌'}，${regName(r).zh}尤甚。`)}});
/* what you own and owe, for the ledger page */
function econLines(s){const L=[];if(s.land)L.push([zh()?`田产${cnNum(s.land*10)}亩`:`${s.land*10} mu of farmland`,zh()?'年租约看收成':'rent depends on the harvest']);
  (s.loans||[]).forEach(x=>L.push([zh()?`借给${x.n.zh}${x.amt}两`:`${x.amt} lent to ${x.n.en}`,zh()?`年息${Math.round(x.rate*100)}分，${x.due<=s.age?'已到期':cnNum(x.due-s.age)+'年后到期'}`:`${Math.round(x.rate*100)}% · due ${x.due<=s.age?'now':'in '+(x.due-s.age)+' yr'}`]));
  L.push([zh()?'排场':'Lifestyle',tr(STYLES[styleOf(s)][0])]);return L}

/* money from a shop's decisions is booked to that shop */
(()=>{const B=ACT_BY.bizdec,c0=B.choose;B.choose=function(s,k,c){const d=c&&c.it&&itemDef(c.it.id);const o=LSUB;LSUB=d?d.n:null;try{return c0.apply(this,arguments)}finally{LSUB=o}}})();
