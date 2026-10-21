/* 江湖一生 · memory: every meaningful choice leaves a record of who was there, where, what you did and how it went.
   The people in those records keep their names; some of them come back, a year or two later or many years later,
   and the game says exactly what they are coming back about. Callbacks are built from the record, never invented. */
'use strict';

/* ---------- the record ---------- */
/* a short summary of the scene: the opening sentence, and the sentence that names the person if that is a different one */
const memSnip=(t,nm)=>{const pickS=(v,re,name,n)=>{v=String(v||'').replace(/\s+/g,' ').trim();const ss=v.match(re)||[v];let out=ss[0];
    if(name&&!out.includes(name)){const w=ss.find(x=>x.includes(name));if(w)out=(out.length+w.length<=n?out:'')+w}
    return out.length>n?out.slice(0,n)+'…':out};
  return T(pickS(t.en,/[^.!?]+[.!?]+["”]?\s*/g,nm&&nm.en,170).trim(),pickS(t.zh,/[^。！？]+[。！？]+[”"]?/g,nm&&nm.zh,60))};
function memRec(s,r){s.mem=s.mem||[];s.memN=(s.memN||0)+1;r.id=s.memN;s.mem.push(r);if(s.mem.length>80)s.mem.shift();return r}
const memById=(s,id)=>(s.mem||[]).find(r=>r.id===id);
const MEM_SKIP=/^(th_|mem_|rp_|af_)/;
const memKindLabel={helped:T('you helped them','你帮过对方'),wronged:T('you wronged them','你亏欠过对方'),beat:T('you beat them','你打赢过对方'),lostTo:T('they beat you','对方打赢过你'),met:T('you crossed paths','你们打过交道')};

(()=>{const ci=chooseInc;chooseInc=function(s,q,k){
  const c=q.c,inc=INC_BY[q.id],o=inc&&inc.opts&&inc.opts[k];const a0=s.align,m0=s.money;
  const L=s.log[s.log.length-1],i0=L?L.lines.length:0;const r=ci(s,q,k);
  if(!s.alive||!c||!c.npc||!c.npc.n||!inc||MEM_SKIP.test(q.id)||inc.noThread||s.age<10)return r;
  /* the record can link back to a callback that is now resolved */
  const da=s.align-a0,fw=c.fightWon,nm=c.npc,qt=q.text?(q.text.zh||'')+(q.text.en||''):'';
  const named=!!(nm.zh&&qt.includes(nm.zh))||!!(nm.en&&qt.includes(nm.en));
  const f=c['f'+k],fn=f&&f.foe&&f.foe.name,foeIsNpc=!!fn&&!f.foe.beast&&(fn.zh===nm.zh||fn.en===nm.en);
  let kind=null;
  if(fw===true&&foeIsNpc)kind='beat';else if(fw===false&&foeIsNpc)kind='lostTo';
  else if(fw==null&&named&&da>=2)kind='helped';else if(fw==null&&named&&(da<=-3||(s.money-m0>=40&&da<0)))kind='wronged';
  else if(named&&c.pid)kind='met';
  if(!kind)return r;
  const E=s.log[s.log.length-1],ls=(E&&E===L?E.lines.slice(i0):E?E.lines:[]).filter(l=>!/prompt|you/.test(l.c||''));
  const rec=memRec(s,{at:s.age,reg:s.region,kind,who:{n:nm.n,sex:nm.sex,occ:nm.occ,lv:nm.lv,age:nm.age},pid:c.pid||null,
    what:q.text?memSnip(q.text,nm):T('',''),chose:o?lab(o.l,c,s):T('',''),out:ls[0]?memSnip(ls[0].t):null});
  memSchedule(s,rec);return r}})();

/* ---------- when it comes back: soon, years later, or never ---------- */
const MEM_PLAN={helped:[['short','th_grateful',.2],['long','mem_prosper',.2]],wronged:[['short','th_grudge',.25],['long','mem_risen',.2]],
  beat:[['short','th_admirer',.12],['long','mem_returns',.18]],lostTo:[['short','th_rematch',.22],['long','mem_oldfoe',.16]],met:[]};
function memSchedule(s,rec){s.memDue=s.memDue||[];if(s.memDue.length>=6)return;
  for(const [h,id,p] of MEM_PLAN[rec.kind]||[]){if(!chance(p))continue;
    s.memDue.push({rid:rec.id,id,due:s.age+(h==='short'?rint(1,3):rint(6,16))});return}}
/* the old one-off thread system now runs through this record */
if(typeof addThread==='function')addThread=function(){};

function memAgo(s,r){const n=s.age-r.at,R=REGIONS.find(x=>x.id===r.reg);const ago=n>0?T(`${n} year${n>1?'s':''} ago`,`${cnNum(n)}年前`):T('Earlier this year','今年早些时候');if(n===2)ago.zh='两年前';
  return T(`${ago.en}${R?' in '+R.en:''}: ${r.what.en}${r.chose&&r.chose.en?` You chose: ${r.chose.en}.`:''}`,`${ago.zh}${R?'在'+R.cn:''}：${r.what.zh}${r.chose&&r.chose.zh?`你选择了「${r.chose.zh}」。`:''}`)}
function memCtx(s,r){const w=r.who,p=r.pid&&person(s,r.pid);if(p&&!p.alive)return null;
  const yrs=s.age-r.at,age=Math.max(8,(w.age||25)+yrs);
  const c=scene();c.npc=npc(s,{name:w.n,sex:w.sex,occ:w.occ,age,lv:Math.max(2,Math.round((w.lv||10)*(age<45?1+yrs*.06:1)))});
  if(p){c.pid=p.id;c.p=p;c.npc.lv=p.lv}c.rec=r;c.yrs=yrs;
  const g=genName(chance(.6)?'m':'f',w.n.sur);c.kin=T(g.py,g.cn);c.rel=pick([T('brother','兄弟'),T('sister','姐妹'),T('father','父亲'),T('son','儿子'),T('master','师父')]);
  return c}
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.jail>0||!s.memDue||!s.memDue.length||s.queue.length>2)return;
  const due=s.memDue.filter(d=>d.due<=s.age);if(!due.length)return;const d=due[0];s.memDue=s.memDue.filter(x=>x!==d);
  const r=memById(s,d.rid),inc=INC_BY[d.id];if(!r||!inc)return;if(inc.mage&&(s.age<inc.mage))return;
  const c=memCtx(s,r);if(!c)return;if(inc.cctx)Object.assign(c,inc.cctx(s,c));
  runIncident(s,inc,c);const q=s.queue[s.queue.length-1];
  if(q&&q.id===inc.id&&q.text){const a=memAgo(s,r);q.text=T(`${a.en} ${q.text.en}`,`${a.zh}${q.text.zh}`);q.follow=1;q.from=T(`${memKindLabel[r.kind].en}, ${s.age-r.at} years ago`,`${cnYrs(s.age-r.at)}年前，${memKindLabel[r.kind].zh}`)}
  r.came=(r.came||0)+1}})();
/* whoever comes back and stays becomes a real person in your life, tied to the old record */
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){const r=ci(s,q,k);const c=q.c;if(c&&c.rec&&c.pid){const rec=memById(s,c.rec.id);if(rec)rec.pid=c.pid}return r}})();

/* ---------- the long-term callbacks ---------- */
const MI=d=>{d.only=1;d.noThread=1;d.noRipple=1;I(d)};
/* someone you helped has done well */
MI({id:'mem_prosper',cctx:(s,c)=>({v:[5,17,23,26,11,12].includes(c.npc.occ)?0:c.npc.age<30||[1,9].includes(c.npc.occ)?1:2}),
 text:c=>[T(`${c.npc.en} has done well since: a trading house now, with boats on three rivers. ${c.npc.He} has come to settle an old debt, and to offer you a share.`,`${c.npc.zh}这些年发达了：开了商号，三条江上都有船。${c.npc.ta}是来还当年那份情的，想分你一股。`),
   T(`${c.npc.en} wears an official's cap now. ${c.npc.He} has never forgotten, and asks what ${c.npc.he} can do for you.`,`${c.npc.zh}如今戴上了官帽。${c.npc.ta}一直没忘，问你有什么能帮上忙的。`),
   T(`${c.npc.en} has become a swordsman with a name of ${c.npc.his} own, and says ${c.npc.he} owes you that too.`,`${c.npc.zh}如今是个有名号的剑客了，说这也有你一份功劳。`)][c.v],
 opts:[{l:T('Accept, gratefully','欣然接受'),out:[
   {w:3,if:(s,c)=>c.v===0,t:T('The share pays well, year after year.','这一股年年都有进项。'),c:'gold',fx:{money:[150,450],meet:'friend',bond:80}},
   {w:1,if:(s,c)=>c.v===0,t:T('The share comes with a partner’s debts. You learn this later.','那一股连着合伙人的债，你是后来才知道的。'),c:'muted',fx:{money:[20,80],meet:'friend',bond:65}},
   {w:3,if:(s,c)=>c.v===1,t:(c,s)=>s.wanted>0?T('A word in the right ear, and your name comes off the wanted list.','在该说话的人耳边说了句话，你的名字就从通缉榜上撤了。'):T('A letter of introduction opens doors you did not know were there.','一封引荐信，替你推开了好几扇你都不知道存在的门。'),c:'gold',fx:{f:s=>{if(s.wanted>0)s.wanted=0;else s.fame+=4},meet:'friend',bond:80}},
   {w:1,if:(s,c)=>c.v===1,t:T('The favour is done, and later someone asks the official to explain it. Your name comes up.','忙是帮了，后来却有人追究这位大人，你的名字也被扯了进去。'),c:'bad',fx:{fame:-2,meet:'friend',bond:70}},
   {w:3,if:(s,c)=>c.v===2,t:T('You train together for a season and both come away better.','你们一起练了一季，都长进了。'),c:'good',fx:{skill:[2,4],meet:'sworn',bond:80}},
   {w:1,if:(s,c)=>c.v===2,t:T('They bring their enemies with them, and now those are yours too.','对方把自己的仇家也带来了，如今也成了你的仇家。'),c:'muted',fx:{meet:'friend',bond:75,enemy:1}}]},
  {l:T('Say the debt was paid long ago','说那份情早就两清了'),out:[{w:2,t:T('They insist on staying for dinner. You part as friends.','对方坚持留下吃了顿饭。你们成了朋友。'),c:'good',fx:{meet:'friend',bond:70,align:1}},{w:1,t:T('They seem relieved. People change.','对方像是松了口气。人是会变的。'),c:'muted'}]}]});
/* someone you wronged has risen */
MI({id:'mem_risen',cctx:(s,c)=>({v:pick([0,1,2]),lv2:Math.max(12,Math.round(power(s)*(.95+R()*.35)))}),
 text:c=>[T(`${c.npc.en} runs the docks of this county now, and ${c.npc.his} men have stopped you in the street. ${c.npc.He} remembers.`,`${c.npc.zh}如今管着这一县的码头，${c.npc.ta}的手下在街上拦住了你。${c.npc.ta}记得。`),
   T(`The new magistrate is ${c.npc.en}. ${c.npc.He} recognises you at once.`,`新来的县官是${c.npc.zh}。${c.npc.ta}一眼就认出了你。`),
   T(`${c.npc.en} is an elder of a sect now, and has come with two disciples to talk about the past.`,`${c.npc.zh}如今是一派长老了，带着两个弟子来找你叙叙旧。`)][c.v],
 opts:[{l:T('Apologise, and mean it','诚心赔罪'),out:[{w:s=>1+Math.max(0,s.align)/25,t:T('It takes a long time. At the end, they nod. It is not friendship, but it is over.','说了很久。最后，对方点了点头。算不上和好，可这事了了。'),c:'good',fx:{align:3,money:[-80,-20],happy:3}},{w:1.2,t:T('“Twenty years too late.” They leave you standing there.','"晚了二十年。"对方把你晾在原地，走了。'),c:'bad',fx:{fame:-2,happy:-4,enemy:1}}]},
  {l:T('Stand your ground','寸步不让'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.lv2,fixed:1},stakes:'injury',title:T('An old debt','旧账'),cause:T('an old wrong come back','旧怨找上门')}),
   win:[{w:2,t:T('You win, and make a powerful enemy for the rest of your life.','你赢了，也给自己结下了一个一辈子的强敌。'),c:'muted',fx:{fame:2,enemy:1}},{w:1,t:T('You win. Afterwards they say, quietly, that they had wanted to know if you were still the same. You are not sure.','你赢了。事后对方低声说，只是想看看你还是不是当年那个人。你也说不准。'),c:'muted',fx:{fame:2}}],
   lose:[{w:1,t:T('They let you live, which is its own sentence.','对方饶了你一命，这本身就是惩罚。'),c:'bad',fx:{fame:-4,happy:-6}}]},
  {l:T('Leave the county','离开这个县'),out:[{w:2,t:T('You move on. Some places are closed to you now.','你走了。有些地方，从此去不得了。'),c:'muted',fx:{money:[-40,-10],happy:-3}},{w:1,t:T('Their reach is longer than you thought.','对方的手伸得比你想的长。'),c:'bad',fx:{money:[-80,-30],wanted:1}}]}]});
/* someone you beat has trained ever since */
MI({id:'mem_returns',cctx:(s,c)=>({lv2:Math.max(10,Math.round(power(s)*(1+R()*.3)))}),
 text:c=>T(`${c.npc.en} has trained every day for ${c.yrs} years for this. ${c.npc.He} has come to ask for the return match, in front of witnesses.`,`${c.npc.zh}为了这一天，整整苦练了${cnYrs(c.yrs)}年。${c.npc.ta}当着众人的面，请你再赐一战。`),
 opts:[{l:T('Accept','应战'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.lv2,fixed:1},stakes:'light',title:T('The return match','再战'),cause:T('a return match','重逢再战')}),
   win:[{w:2,t:T('You win again. This time they laugh, and ask you to drink with them.','你又赢了。这一回对方大笑起来，拉你去喝酒。'),c:'good',fx:{fame:3,meet:'friend',bond:70}},{w:1,t:T('You win again. They walk away without a word, and you know they will be back.','你又赢了。对方一言不发地走了，你知道他还会再来。'),c:'muted',fx:{fame:3,meet:'rival',bond:25}}],
   lose:[{w:2,t:T('They have earned it. The crowd knows it, and so do you.','这一场是对方挣来的。众人心里有数，你也有数。'),c:'muted',fx:{fame:-2,meet:'rival',bond:50,skill:1}},{w:1,t:T('They win, and spare you the speech. It is almost kind.','对方赢了，也没说什么风凉话。几乎算得上厚道。'),c:'muted',fx:{fame:-1,meet:'acq',bond:55}}]},
  {l:T('Concede that they are the better fighter now','承认如今对方更强'),out:[{w:s=>1+s.t.heart*.15,t:T('It costs you some face and earns you their respect.','你丢了些面子，却换来了对方的敬重。'),c:'good',fx:{fame:-1,meet:'friend',bond:65,align:1}},{w:1,t:T('They wanted a fight, not a bow. They leave, contemptuous.','对方要的是一场架，不是一个揖。对方轻蔑地走了。'),c:'muted',fx:{fame:-3}}]}]});
/* someone who beat you, years on */
MI({id:'mem_oldfoe',cctx:(s,c)=>({old:c.npc.age>=62}),
 text:c=>c.old?T(`You meet ${c.npc.en} again, old now and slow. ${c.npc.He} remembers the fight, and you, better than you expected.`,`你又遇见了${c.npc.zh}，如今老了，也慢了。那一战，还有你，${c.npc.ta}都记得比你想的清楚。`)
   :T(`${c.npc.en}, who beat you ${c.yrs} years ago, is famous now. You find yourself at the same banquet.`,`${cnYrs(c.yrs)}年前打赢过你的${c.npc.zh}，如今已是成名人物。你们在同一场宴席上碰了面。`),
 opts:[{l:T('Ask for the match you have waited for','提出你等了多年的那一战'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.max(8,Math.round(c.old?c.npc.lv*.7:c.npc.lv)),fixed:1},stakes:'light',title:T('Years later','多年以后'),cause:T('an old rematch','多年后的再战')}),
   win:[{w:2,t:(c)=>c.old?T('You win. It does not feel the way you imagined it would; you were fighting someone who no longer exists.','你赢了。感觉和你想象的不一样：你打的那个人，早已不在了。'):T('You win, in front of everyone. The years were worth it.','你当众赢了。这些年，没白练。'),c:'good',fx:{fame:3,meet:'acq',bond:55}},{w:1,t:T('You win. They bow, and tell you who taught them. You go and find that teacher.','你赢了。对方拱手，告诉你当年是谁教的他。你后来去找了那位师父。'),c:'good',fx:{fame:2,skill:2}}],
   lose:[{w:1,t:T('They beat you again. Some people are simply better.','对方又赢了。有些人就是比你强。'),c:'muted',fx:{fame:-1,happy:-3,skill:1}}]},
  {l:T('Raise a cup instead','改为敬一杯酒'),out:[{w:2,t:T('You talk about that day until the lamps burn down. It turns out you both remember it.','你们聊那天的事，一直聊到灯油燃尽。原来两个人都还记得。'),c:'good',fx:{meet:'friend',bond:65,happy:4}},{w:1,t:T('They have forgotten you entirely. You laugh about it later, mostly.','对方早把你忘得一干二净。你事后多半是笑着说起这事的。'),c:'muted',fx:{happy:-1}}]}]});
/* the short-term callbacks read the record too: someone you know does not say "you won't remember me", and a year is not "years ago" */
const cnYrs=n=>n===2?'两':cnNum(n);
(()=>{const G=INC_BY.th_grateful,R=INC_BY.th_rematch;
  if(G){const t0=G.text;G.text=(c,s)=>c.rec&&(c.pid||c.yrs<=3)?T(`${c.npc.en} comes to see you. ${c.npc.He} has not forgotten what you did, and wants to repay it.`,`${c.npc.zh}特地来找你。那件事${c.npc.ta}一直记在心上，想报答你。`):t0(c,s)}
  if(R){const t0=R.text;R.text=(c,s)=>c.rec&&c.yrs<=3?T(`${c.npc.en}, who beat you last time, is drinking in the same inn. They raise their cup to you, smiling.`,`上回打赢你的${c.npc.zh}正在同一家客栈喝酒，笑着冲你举了举杯。`):t0(c,s)}})();
