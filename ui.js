/* 江湖一生 · ui */
'use strict';
const $=id=>document.getElementById(id);
let S=null,LANG='en',WATCH=true,/* fights always play first */lastLen=0,SHEET=null;
const DEFER={on:false,scroll:false,arena:false};
const tr=x=>x==null?'':typeof x==='string'?x:(x[LANG]??x.en);
const zh=()=>LANG==='zh';
const esc=v=>String(v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const num=n=>Math.round(n).toLocaleString(zh()?'zh-CN':'en-US');
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
/* three save slots: slot 0 keeps the original keys so older saves carry over */
const SLOT_N=3;let SLOT=(()=>{try{const v=+localStorage.getItem('jh4_slot');return v>=0&&v<SLOT_N?v:0}catch(e){return 0}})();
const slotKey=i=>{i=i??SLOT;return i?'jh4_save'+i:'jh4_save'};
const slotStampKey=i=>{i=i??SLOT;return i?'jh4_upd'+i:'jh4_upd'};
const U={
 en:{tag:'one life in the jianghu',intro:'Heaven picks where you are born. Train, fight, love, gamble and scheme one year at a time; the chronicle records what became of you.',
  me:'Status',act:'Activities',ppl:'People',own:'Assets',age:'Next year',arena:'Name Arena',nw:'New life',sure:'Start over?',
  odds:n=>`Of every <b>${n}</b> children born under heaven that year, one began life exactly as you did.`,dead:'deceased',
  health:'Health',joy:'Happiness',smarts:'Smarts',looks:'Looks',power:'Martial power',silver:'Silver',taels:'taels',
  TN:{root:'Bones',wit:'Insight',luck:'Fortune',heart:'Composure'},
  dt:{path:'status',sect:'sect',align:'alignment',fame:'fame',fam:'family',arts:'arts',law:'the law',ill:'illness'},
  evil:'evil',good:'righteous',noSect:'None',former:'former',jail:n=>`In prison · ${n} year${n>1?'s':''} left`,wanted:n=>'Wanted '+'★'.repeat(n),
  unmarried:'Unmarried',married:p=>'Married to '+p,kids:n=>` · ${n} child${n>1?'ren':''}`,noArts:'None yet',
  idle:'Free',jobAs:j=>j,sectAs:(s,r)=>`${s}, ${r}`,
  choose:'the road divides · choose',you:'Your power',foe:'Opponent',
  here:'here lies',years:'years',fameL:'fame',wealth:'silver',deeds:'deeds remembered',none:'No deeds were remembered. Most lives are like this, and they are still lives.',again:'Live another life',past:'Past lives',
  apLeft:(a,m)=>`${a}/${m} energy left this year`,noAp:'Out of energy. Age up to continue.',
  watch:'Watch',fightsOn:'Auto-play fights',skip:'Skip to end',speed:'Speed',close:'Close',
  cats:{weapon:'Weapons',anqi:'Hidden weapons',armor:'Armour',charm:'Charms',tool:'Gear',mount:'Mounts',house:'Property',biz:'Businesses',pill:'Medicine',pet:'Pets',book:'Manuals'},
  shop:'Market',inv:'Your belongings',buy:'Buy',sell:n=>`Sell · ${n}`,use:'Use',equipped:'in use',empty:'You own nothing yet.',networth:'Net worth',stockNote:'The market sells everyday goods. Rare weapons, armour, elixirs, manuals and pets never sit on a stall: they come through encounters, masters and secret sellers.',
  dead2:'The departed',noPeople:'Nobody yet. People arrive through incidents, the tavern, sects and the matchmaker.',bond:'Bond',traitL:'temperament',lvl:'power',age2:'age',
  fstats:'Your fighting body',fnote:'Your name decides your body (the same name always gets the same stats). Power scales it; arts give techniques; gear adds the rest.',
  stat:{hp:'HP',atk:'Attack',def:'Defence',crit:'Critical',dodge:'Dodge',spd:'Speed',mp:'True qi',nei:'Qi force',agi:'Agility',res:'Resistance',int:'Technique rate'},
  arenaTitle:'Name Arena 名字论剑',arenaHelp:'Type names, one per line. Every name gets its own fixed body and techniques. Separate teams with a blank line; with no blank lines it is every fighter for themselves.',
  fight:'Fight!',addMe:'Add me',rand:'Random names',preview:'Fighters',stakes:{spar:'friendly bout',light:'not lethal',injury:'dangerous',death:'to the death'},
  confirmDeath:'Close'},
 zh:{tag:'人生只有一回',intro:'生在何处，由天不由你。练功、比武、恋爱、赌钱、闯荡，一年一年地活，史书会记下你的一生。',
  me:'状态',act:'活动',ppl:'人脉',own:'家当',age:'过一年',arena:'名字论剑',nw:'重新投胎',sure:'确定重来？',
  odds:n=>`普天之下，那一年每 <b>${n}</b> 个新生儿中，只有一个与你同样开局。`,dead:'已辞世',
  health:'气血',joy:'心情',smarts:'学识',looks:'容貌',power:'功力',silver:'银两',taels:'两',
  TN:{root:'体质',wit:'悟性',luck:'福缘',heart:'定力'},
  dt:{path:'身份',sect:'门派',align:'正邪',fame:'名望',fam:'家室',arts:'武学',law:'官府',ill:'病痛'},
  evil:'邪',good:'正',noSect:'无门无派',former:'已离开',jail:n=>`身陷囹圄 · 尚余${cnNum(n)}年`,wanted:n=>'通缉 '+'★'.repeat(n),
  unmarried:'未婚',married:p=>'配偶 '+p,kids:n=>` · 子女${cnNum(n)}人`,noArts:'尚未习得',
  idle:'闲散',jobAs:j=>j,sectAs:(s,r)=>`${s}${r}`,
  choose:'岔路口 · 请抉择',you:'你的功力',foe:'对手',
  here:'此处长眠',years:'享年',fameL:'名望',wealth:'银两',deeds:'生平事迹',none:'一生无事可记。世上大多数人都是这样过的，那也是一生。',again:'再入轮回',past:'前世',
  apLeft:(a,m)=>`今年行动力 ${a}/${m}`,noAp:'行动力用完了，过一年再说。',
  watch:'观战',fightsOn:'自动播放战斗',skip:'跳到结局',speed:'速度',close:'关闭',
  cats:{weapon:'兵器',anqi:'暗器',armor:'护甲',charm:'饰物',tool:'杂物',mount:'坐骑',house:'房产',biz:'产业',pill:'丹药',pet:'宠物',book:'秘籍'},
  shop:'集市',inv:'随身家当',buy:'买',sell:n=>`卖 · ${n}`,use:'服用',equipped:'在用',empty:'你还什么都没有。',networth:'身家',stockNote:'集市只卖寻常货物。神兵宝甲、灵丹秘籍、珍禽异兽从不摆在摊上，只能靠奇遇、师父和神秘卖家。',
  dead2:'已故之人',noPeople:'还没有人。人脉来自各种际遇、酒楼、门派和媒婆。',bond:'交情',traitL:'性情',lvl:'功力',age2:'年纪',
  fstats:'你的战斗之躯',fnote:'名字决定根本（同一个名字永远是同样的属性），功力决定高低，武学带来招式，兵器护甲再添几分。',
  stat:{hp:'气血',atk:'攻击',def:'防御',crit:'暴击',dodge:'闪避',spd:'速度',mp:'真气',nei:'内劲',agi:'敏',res:'抗',int:'出招率'},
  arenaTitle:'名字论剑',arenaHelp:'输入名字，一行一个。每个名字都有固定的身体和招式。空一行分队；不空行就是各自为战。',
  fight:'开战！',addMe:'加入自己',rand:'随机名字',preview:'参战者',stakes:{spar:'点到为止',light:'不伤性命',injury:'凶险',death:'生死相搏'},
  confirmDeath:'关闭'}
};
const u=()=>U[LANG];

/* ---------- rendering ---------- */
function pips(v){let h='';for(let i=1;i<=10;i++)h+=`<i class="${i<=v?'on':''}${i<=v&&v>=8?' hi':''}"></i>`;return h}
const artName=a=>zh()?a.cn:`${esc(a.n)} <span class="cn">${a.cn}</span>`;
const nameOf=s=>zh()?s.cn:s.name;
function bar(label,v,max,cls,wide){return`<div class="bar${wide?' wide':''}"><div class="row"><span>${label}</span><b>${Math.max(0,Math.round(v))}${max!==100?' / '+Math.round(max):''}</b></div><div class="track"><div class="fill ${cls}" style="width:${clamp(v/max*100,0,100)}%"></div></div></div>`}
function statusText(s){
  const L=u();if(s.jail>0)return`<span class="warnrow">${L.jail(s.jail)}</span>`;
  const parts=[];if(s.job){const J=JOBS[s.job];parts.push(tr(J.n[s.jobLv])+(zh()?`（年俸${J.pay[s.jobLv]}两）`:` (${J.pay[s.jobLv]} taels/yr)`))}
  if(s.retired)parts.push(zh()?'已金盆洗手':'Retired');
  return parts.join(' · ')||L.idle}
function sectText(s){const L=u();if(!s.sect)return s.flags.formerSect?`${zh()?SZ(s.flags.formerSect):SECTS[s.flags.formerSect].en} (${L.former})`:L.noSect;
  const ev=isEvil(s.sect)?(zh()?' <span class="warnrow">邪派</span>':' <span class="warnrow">dark faction</span>'):'';const m=zh()?` · 贡献${s.merit||0}`:` · merit ${s.merit||0}`;
  return zh()?`${SZ(s.sect)} · ${rankName(s).zh}${m}${ev}`:`${SECTS[s.sect].en} <span class="cn">${SECTS[s.sect].cn}</span> · ${rankName(s).en}${m}${ev}`}
let sideHTML=function(s,full){
  const L=u(),reg=region(s),fam=family(s),age=Math.max(0,s.age),pw=power(s),sp=spouseOf(s);
  const sealTxt=s.cn.length===2?s.cn+'之印':s.cn.length===3?s.cn+'印':s.cn;
  return`<div class="who"><div class="seal" aria-hidden="true">${sealTxt}</div>
   <div><h2>${nameOf(s)}</h2>${(()=>{const br=REGIONS.find(r=>r.id===((s.trail&&s.trail[0])||s.region))||reg,pl=typeof placeName==='function'?placeName(s):T(reg.en,reg.cn),v=s.visit,home=v&&REGIONS.find(r=>r.id===v.home);
   return zh()?`<p>${s.gender==='f'?'女':'男'} · 生于${br.cn} · ${fam.cn}出身</p><p class="loc">📍 现居${pl.zh}${v&&home?`（在外，${v.until-s.age>0?cnNum(v.until-s.age)+'年后':'今年'}回${home.cn}）`:''}</p>`:`<p><span class="cn">${s.cn}</span> · ${s.gender==='f'?'Female':'Male'} · born in ${br.en}</p><p>Born to ${fam.en}</p><p class="loc">📍 Living in ${pl.en}${v&&home?` (away; back to ${home.en} ${v.until-s.age>0?'in '+(v.until-s.age)+' yr':'this year'})`:''}</p>`})()}</div></div>
  ${startHTML(s)}
  <div class="agebox"><div><span class="cnage">${cnNum(age)}岁</span><div class="lbl">${s.alive?tr(eraLabel(s)):L.dead}</div></div>
   <div class="realm"><span class="cn">${rname(s)[1]}</span>${zh()?'':`<small>${rname(s)[2]}</small>`}</div></div>
  <div class="bars">${bar(L.health,s.health,s.maxHealth,'f-hp')}${bar(L.joy,s.happy,100,'f-joy')}${bar(L.smarts,s.smarts,100,'f-sm')}${bar(L.looks,s.looks,100,'f-lk')}${bar(L.power,pw,typeof REALM9!=='undefined'?(REALM9[r9Of(pw)+1]||[REALM_TOP])[0]:310,'f-pw',1)}</div>
  <div class="money"><span class="lbl">${L.silver}</span><b>${num(s.money)} <span class="cn" style="font-size:14px">${zh()?'两':'taels'}</span></b></div>
  ${s.world&&s.age>=6?`<p class="worldln">${zh()?`年景 <b>${HARVEST[s.world.h+2].zh}</b> · 世道 <b>${UNREST[s.world.u].zh}</b> · 米价 <b>×${s.world.p}</b>`:`Year: <b>${HARVEST[s.world.h+2].en}</b> · roads: <b>${UNREST[s.world.u].en}</b> · rice ×<b>${s.world.p}</b>`}</p>`:''}
  ${s.org?`<div class="orgbox"><span class="lbl">${s.org.type==='sect'?(zh()?'自创门派':'your sect'):(zh()?'自家镖局':'your escort agency')}</span><b>${tr(s.org.name)}</b>${s.org.evil?(zh()?' <span class="warnrow">邪派</span>':' <span class="warnrow">dark</span>'):''}<div class="orgst"><span>${zh()?'人手':'people'} <b>${s.org.members}/${s.org.lv*15}</b></span><span>${zh()?'声望':'reputation'} <b>${Math.round(s.org.rep)}</b></span><span>${zh()?'规模':'size'} <b>${s.org.lv}/5</b></span></div>${typeof orgFocus==='function'?`<div class="orgst"><span>${zh()?'要务':'focus'} <b>${tr(focusName(orgFocus(s)))}</b></span>${['senior','steward','elder'].map(k=>{const p=staffP(s,k);return p?`<span>${tr((STAFF_ROLES[s.org.type]||STAFF_ROLES.sect)[k][0])} <b>${zh()?p.n.cn:esc(p.n.py)}</b></span>`:''}).join('')}</div>`:''}</div>`:''}
  ${typeof condBox==='function'?condBox(s):''}${(()=>{const q=s.alive?openQuests(s):[];return q.length?`<div class="quests"><span class="lbl">${zh()?'未了之事':'Unfinished business'}</span><ul>${q.map(x=>`<li>${tr(x)}${typeof questGo==='function'?(()=>{const g=questGo(s,x);return g?`<div class="qgos">${g}</div>`:''})():''}</li>`).join('')}</ul></div>`:''})()}
  ${s.age>=3?`<details class="sec" data-sec="fight"${secOpen('fight')?' open':''}><summary>${zh()?'武学与战斗属性':'Martial power & fighting stats'}</summary>${fightHTML(s)}</details>`:''}
  <details class="sec" data-sec="more"${secOpen('more')?' open':''}><summary>${zh()?'天赋、身份与江湖地位':'Talents, status & standing'}</summary>
  <div class="tal">${Object.keys(L.TN).map(k=>`<div><div class="t"><span>${L.TN[k]}</span><b>${s.t[k]}</b></div><div class="pips">${pips(s.t[k])}</div></div>`).join('')}</div>
  <dl class="st">
   <dt>${L.dt.path}</dt><dd>${statusText(s)}</dd>
   <dt>${L.dt.sect}</dt><dd>${sectText(s)}</dd>
   <dt>${L.dt.align}</dt><dd><div class="align"><i style="left:${(s.align+100)/2}%"></i></div><div class="alignlbl"><span>${L.evil}</span><span>${tr(alignLabel(s.align))}</span><span>${L.good}</span></div></dd>
   <dt>${L.dt.fame}</dt><dd>${tr(fameLabel(s.fame))} <span class="muted">(${Math.round(s.fame)})</span></dd>
   <dt>${L.dt.fam}</dt><dd>${sp?L.married(zh()?sp.n.cn:sp.n.py):L.unmarried}${living(s,'child').length?L.kids(living(s,'child').length):''}</dd>
   ${s.wanted>0?`<dt>${L.dt.law}</dt><dd class="warnrow">${L.wanted(s.wanted)}</dd>`:''}
   ${s.ill?`<dt>${L.dt.ill}</dt><dd class="warnrow">${tr(ILLS[s.ill].cause)}</dd>`:''}
   <dt>${L.dt.arts}</dt><dd><div class="arts">${s.arts.length?s.arts.map(a=>`<span class="art t${a.tier}${a.bad?' bad':''}">${artName(a)}</span>`).join(''):`<span class="muted">${L.noArts}</span>`}</div></dd>
  </dl></details>`;
}
/* the folding sections remember whether you left them open; on a phone they start folded so the year's events stay in view */
function secOpen(k){const v=store.get('jh4_sec_'+k,null);return v===null?!matchMedia('(max-width:880px)').matches:v}
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.sec'))store.set('jh4_sec_'+d.dataset.sec,d.open)},true);
function riskHTML(f){const L=u();const r=f.foe/Math.max(1,f.me);const cls=r<.85?'r0':r<1.15?'r1':'r2';
  return`<span class="risk ${cls}">${L.foe} ${f.foe} · ${L.you} ${f.me} · ${L.stakes[f.stakes]}</span>`}
function lineHTML(l){return`<p class="${l.c||''}">${tr(l.t)}${l.b&&BATTLES[l.b]?` <button class="watch" data-b="${l.b}">▶ ${u().watch}</button>`:''}</p>`}
/* within a year, the newest event comes first; each event (its prompt, your choice, what came of it and its follow-ups) still reads top to bottom */
function newestFirst(lines){const B=[[]];lines.forEach(l=>{const c=l.c||'';if((/\bprompt\b/.test(c)&&!/\bfollow\b/.test(c))||c==='act'){if(B[B.length-1].length)B.push([])}B[B.length-1].push(l)});
  return B.filter(b=>b.length).reverse().map((b,i)=>`<div class="ev${i===0&&B.length>1?' new':''}">${b.map(lineHTML).join('')}</div>`).join('')}
let renderChron=function(){
  const s=S,L=u();
  const n=s.log.length;
  let h=s.log.map((E,i)=>`<article class="yr${i===n-1?' latest':''}"${i<lastLen-1?' style="animation:none"':''}><div class="yh"><span class="cnage">${E.age===0?'诞生':cnNum(E.age)+'岁'}</span><small>${zh()?E.era.zh:`<span class="cn">${E.era.zh}</span><br>${E.age===0?'Birth':'Age '+E.age}`}</small></div>
    <div class="yl">${newestFirst(E.lines)}</div></article>`).reverse().join('');
  const q=s.queue[0];let top='';
  /* show what the last choice led to before the next decision */
  const H=s._hold,HE=s.log[s.log.length-1];const hl=H&&HE&&!AUTO?HE.lines.slice(H.i0,H.i1).filter(l=>!['prompt','act'].includes(l.c)):[];
  const ppl=q&&typeof queuePeople==='function'?queuePeople(s,q):[];
  const pplH=ppl.length?`<div class="qppl"><span class="muted">${zh()?'相关人物（点开看交情再决定）':'People involved (tap to see where you stand)'}</span>${ppl.map(p=>`<button class="pchip" data-pp="${p.id}">${zh()?p.n.cn:esc(p.n.py)}${typeof sxMark==='function'?sxMark(p):''} · ${tr(relLabel(s,p))} · ${zh()?'交情':'bond'} ${Math.round(p.bond)}</button>`).join('')}</div>`:'';
  if(q&&hl.some(l=>l.c!=='you'))top=`<div class="choices outcome" role="group"><span class="lbl">${zh()?'结果':'What happened'}</span><div class="olines">${hl.map(lineHTML).join('')}</div><button class="choice cont" data-cont="1"><b>${zh()?'继续':'Continue'}</b></button></div>`;
  else if(q)top=`<div class="choices" role="group"><span class="lbl">${L.choose}${s.queue.length>1?` · 1/${s.queue.length}`:''}</span>${q.tagline?`<p class="qfrom qtale">✦ ${tr(q.tagline)}</p>`:''}${q.follow&&q.from?`<p class="qfrom">↳ ${tr(T('Follow-up · after: ','后续 · 接上文：'))}${tr(q.from)}</p>`:''}${q.text?`<p class="qtext">${tr(q.text)}</p>`:''}${pplH}${q.opts.map(o=>`<button class="choice" data-k="${o.k}"><b>${tr(o.l)}</b>${o.sub?`<span>${tr(o.sub)}</span>`:''}${o.fight?riskHTML(o.fight):''}</button>`).join('')}</div>`;
  if(!s.alive)top=epitaph(s);
  $('chron').innerHTML=top+h;lastLen=s.log.length;
}
let epitaph=function(s){
  const L=u(),t=titleOf(s),reg=region(s),fam=family(s),fl=fameLabel(s.fame),sid=s.sect||s.flags.formerSect;
  let txt;
  if(zh()){txt=`${fam.cn}出身，生于${reg.cn}。`;if(sid)txt+=`${cnNum(s.joinedAt||10)}岁入${SZ(sid)}${s.rank>=3?`，官至${rankName(s).zh}`:''}。`;
    txt+=`一生修为至「${rname(s)[1]}」，${fl.zh}。享年${cnNum(s.age)}岁，${s.cause.zh}。`}
  else{txt=`Born to ${fam.en} in ${reg.en}.`;if(sid)txt+=` Joined ${SECTS[sid].en} at ${s.joinedAt||10}${s.rank>=3?`, and rose to ${rankName(s).en}`:''}.`;
    txt+=` Reached the realm of ${rname(s)[2]} and was ${fl.en.toLowerCase()}. Died at ${s.age}, of ${s.cause.en}.`}
  const nick=s.nick?(zh()?` <span class="muted">人称「${s.nick.zh}」</span>`:` <span class="muted">“${esc(s.nick.en)}”</span>`):'';
  const hall=store.get('jh4_hall',[]);
  return`<div class="tomb"><div class="stele" aria-hidden="true">${s.cn}之墓</div><div class="ep">
   <span class="lbl">${L.here}</span><h3>${nameOf(s)}${nick}</h3>
   <div class="title">${zh()?t[0].zh+' · '+t[1].zh:t[0].en+' · '+t[1].en}</div><p>${txt}</p>
   <div class="grid3"><div><span class="lbl">${L.years}</span><b>${s.age}</b></div><div><span class="lbl">${L.power}</span><b>${power(s)}</b></div><div><span class="lbl">${L.fameL}</span><b>${Math.round(s.fame)}</b></div><div><span class="lbl">${L.wealth}</span><b>${num(s.money)}</b></div></div>
   ${s.deeds.length?`<span class="lbl">${L.deeds}</span><ul>${s.deeds.map(d=>`<li>${tr(d)}</li>`).join('')}</ul>`:`<p class="muted">${L.none}</p>`}
   <button class="btn main" id="b-again">${L.again}</button>
   ${hall.length?`<div class="hall"><h4>${L.past}</h4><ol>${hall.map(x=>`<li><span>${zh()?x.cn:esc(x.name)+' <span class="cn">'+x.cn+'</span>'} · ${tr(x.title)}</span><span>${zh()?'享年'+x.age:x.age+' yrs'} · ${zh()?x.realm[1]:x.realm[2]}</span></li>`).join('')}</ol></div>`:''}
  </div></div>`;
}
function renderDock(){
  const s=S,L=u();
  $('t-me').textContent=L.me;$('t-act').textContent=L.act;$('t-ppl').textContent=L.ppl;$('t-own').textContent=L.own;$('t-age').textContent=s.alive?(zh()?'':L.age):L.dead;
  $('d-ap').textContent=s.alive&&s.apMax?'●'.repeat(s.ap)+'○'.repeat(Math.max(0,s.apMax-s.ap)):'';
  $('d-age').disabled=!s.alive||s.queue.length>0;
}
function update(scroll){
  if(!S.alive&&!S.recorded){S.recorded=1;const t=titleOf(S);const h=store.get('jh4_hall',[]);h.unshift({name:S.name,cn:S.cn,title:T(t[1].en,t[0].zh),age:S.age,realm:rname(S)});store.set('jh4_hall',h.slice(0,10))}
  store.set(slotKey(),S);
  if(!WATCH)SHOW.length=0;
  /* a fight just happened: play it first, and only reveal what it led to afterwards */
  if(SHOW.length&&!DEFER.arena){DEFER.on=true;DEFER.scroll=DEFER.scroll||scroll;renderDock();playShows();return}
  $('side').innerHTML=sideHTML(S,false);renderChron();renderDock();
  if(SHEET)SHEET.render();
  if(scroll){const el=$('chron');const top=el.getBoundingClientRect().top;
    if(top<0||top>innerHeight*.6)el.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
  playShows();
}
function toast(t){const el=$('toast');el.textContent=tr(t);el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}

/* ---------- fighting stats on the main page, and what every number means ---------- */
const GUIDE={
 en:{title:'What the numbers mean',
  life:['Body and life',[
   ['Health','Your life. Wounds, illness and old age take it away; rest, doctors and medicine give it back. At zero you die. Your maximum shrinks after 45.'],
   ['Happiness','How your life feels. It drifts toward what your home, spouse, money, health and freedom deserve.'],
   ['Smarts','Learning. Opens jobs, the imperial exam and better odds when studying manuals.'],
   ['Looks','How others see you. Helps with love, the matchmaker and some jobs.'],
   ['Silver','Money, in taels. Earned from jobs, businesses, fights and deeds; spent at the market, the doctor and the gambling den.'],
   ['Energy (●)','How many things you can do this year. Usually eight for adults, three for children, six for teenagers, seven after 60 and five after 75. Being hurt, ill or miserable costs you some; high spirits or a lucky year add one. Activities cost 1–3, and seclusion takes the whole year.'],
   ['Healing','Every year you recover 8 + your Bones by yourself. Rest (free, one energy) heals 10 + Bones. A doctor (20 taels) heals 25 and may cure illness; a famous physician (300 taels) heals 80 and cures it. Wound salve and other medicine can be used from Assets. Hot springs and the "Enjoy life" focus help too.'],
   ['Opportunities','Each year a few chances are going around the jianghu: a sword tomb, a secret auction, a ship to a strange island. You hear about them while roaming and decide whether to go; tips picked up in teahouses come back to you on the road.']]],
  tal:['Talents (born with, 1–10)',[
   ['Bones (体质)','Natural body. Health, how fast you train, how long you live, and where your Constitution and Strength start.'],
   ['Insight (悟性)','Understanding. How fast you train and learn new arts.'],
   ['Fortune (福缘)','Luck. Lucky encounters, hidden manuals, better rolls.'],
   ['Composure (定力)','A steady mind. It raises your Inner force, how fast your inner energy grows and how far your cultivation can go. In many events it helps you keep calm, let things go and treat people with patience. A settled mind is harder to lead astray, so you start a little nearer the righteous path.']]],
  mar:['Martial arts',[
   ['Martial power (功力)','Your overall strength, and your experience: technique (from practice, sparring and sect training) + half your inner energy (from meditation, seclusion and elixirs) + a bonus for every art you know (basic +3, intermediate +7, advanced +14, legendary +24). Gains are bigger when you are young and talented, and slow down as you improve. After each action the chronicle shows exactly what changed.'],
   ['Realm (境界)','Nine realms, each in four stages (entry, minor, major, perfected). Stages come with training. Crossing into a new realm from First-rate upward needs a breakthrough: when you hit the wall, you choose how to try, and it can fail. Talent decides how far you are likely to get. See the ladder below.'],
   ['Arts (武学)','Each art you learn becomes a technique in battle, and its tier sets the technique level (Lv1–Lv4).'],
   ['Natural knack','Your name gives you one technique, as in Name Arena. It only appears once you reach Third-rate.']]],
  fig:['Fighting stats (used in every fight)',[
   ['HP','Fights use your real health. The ×number is your toughness: damage you take is divided by it, and it grows with martial power, Constitution and armour. A friendly bout ends when someone yields; a dangerous fight can kill.'],
   ['Attack','Damage of strikes. Mostly from Strength, plus your weapon.'],['Defence','Reduces damage from strikes. Mostly from Constitution, plus armour.'],
   ['Critical','Chance of a critical hit (1.6× damage). From Strength.'],['Dodge','Chance to slip a blow entirely. From Agility; a quick opponent lowers it a little.'],
   ['Speed (in Agility)','How often you act. Not shown separately: it comes from Agility.'],['True qi','Every technique costs true qi (more for higher-level techniques). It refills a little each turn; how much depends on Inner force. Run dry and you can only strike plainly.'],
   ['Qi force (in Inner force)','Damage of qi techniques, and some resistance to them. Not shown separately: it comes from Inner force.'],
   ['Technique rate','How eager you are to use a technique when you have the qi for it. More arts, more chances.'],
   ['The four attributes','Strength (力道), Constitution (根骨), Agility (身法) and Inner force (内功). Their total grows with martial power; how it is split is up to you: each time you advance a stage you choose which one grows. The percentage shows how you compare with everyone in the jianghu.'],
   ['Where they come from','Your talents set your starting leanings, martial power sets the total, your choices shape the split, and weapons, armour and mounts add the rest. Other people get theirs from their level and their build.']]],
  std:['Standing in the jianghu',[
   ['Alignment','From demonic to heroic. Your choices move it; it changes who trusts you and how you are remembered.'],
   ['Fame','How well known you are. Opens duels, invitations and titles.'],
   ['Wanted (★)','How hard the law is looking for you. Each year there is a chance constables come.'],
   ['Focus','Where your attention goes this year. It adds a small effect every year until you change it.'],
   ['Sect merit (贡献)','Earned by sect duties and missions. Promotions need 10 and then 30 merit; the elders only consider someone with 60. Shaolin, Emei and the Xuanzhen Temple keep scripture libraries; inner disciples there can spend 25 to study in one.'],
   ['Making and spending money','Under Make money you can run goods between regions (buy cheap, sell dear; prices move, roads have robbers, escorts cost extra), lend at interest (higher interest, more defaults, and you decide how to collect), buy farmland (rent follows the harvest), sell at a stall, perform in the street or write letters. Under Spend you set your lifestyle, host banquets, buy tonics, commission weapons, give to the poor or send money home. Shops you own will sometimes need decisions: expand, fight a rival, chase a thief, or sell.'],
   ['Manuals and arts','Finding a manual or being shown an art is not the same as learning it. With good wits, bones and learning you may grasp it at once; otherwise you only have the opening, and must work at it through Cultivate or Study a manual, with a wall to get past halfway.'],
   ['Dark factions','The Crimson Sky Cult, Five Venoms, Seven Fiends, Red Blade, Valley of No Return, Night Owl Society, Coin Gang, Black Tide Gang, Sea Serpent Cult, Camel Bell Manor, Iron Fist Gang and Flying Hawk Gang. Each region has its own. Join through Crime → Join a dark faction, or when they come for you. Better pay, worse company; deserters are hunted.'],
   ['Your own house','At 25+, power 85+, fame 25+ and 800 taels you can found your own sect; at 20+, power 40+ and 600 taels, your own escort agency. Recruit, expand, take contracts, and set a yearly focus (recruit, train, earn, do good, make allies). A senior disciple and a steward help you run it. It earns silver every year if its reputation holds.']]],
  ladder:'Realm ladder',novice:'Knows at least one art, power under 15'},
 zh:{title:'各项数值说明',
  life:['身体与生活',[
   ['气血','你的性命。受伤、生病、衰老都会消耗；休养、看大夫、服药可以恢复。归零即死。四十五岁后上限逐年下降。'],
   ['心情','日子过得如何。会慢慢趋向你的住处、配偶、钱财、身体与自由所应得的水平。'],
   ['学识','读书识字的程度。决定能做哪些差事、能否科举，以及研读秘籍的成功率。'],
   ['容貌','旁人眼中的你。影响恋爱、说亲和某些差事。'],
   ['银两','钱财，以两计。靠差事、产业、比武和际遇挣来；花在集市、医馆和赌坊。'],
   ['行动力（●）','今年还能做几件事。成年人通常八点，孩童三点，少年六点，六十岁后七点，七十五岁后五点。受伤、生病、心情差会减少；意气风发或运气好的年份多一点。各项活动耗一到三点，闭关耗尽全年。'],
   ['疗伤','每年自然恢复8＋根骨。休养（不花钱，耗一点行动力）恢复10＋根骨。看大夫（二十两）恢复25，或能治病；求访神医（三百两）恢复80并治好病。金疮药等丹药可在家当里服用。泡温泉、"逍遥"重心也有帮助。'],
   ['机缘','每年总有两三件机会在江湖上流传：剑冢、秘密拍卖、远航海岛……闯荡江湖时会听人说起，由你决定去不去；在茶馆里打听到的消息也会在路上应验。']]],
  tal:['天赋（生来注定，1–10）',[
   ['体质','天生的体魄。影响气血、练功快慢、寿命，以及战斗属性「根骨」和「力道」的起点。'],['悟性','领悟。影响练功快慢和学新武功。'],
   ['福缘','运气。影响奇遇、秘籍和各种机缘。'],['定力','心定不乱。影响内功、内力增长的快慢，以及修为能走多远。许多事情里，定力高的人更沉得住气、放得下，待人也更有耐性。心定的人不易走上歪路，起初也更偏向正道一些。']]],
  mar:['武学',[
   ['功力','你的整体实力，也就是你的"经验"：外功（修炼、切磋、门派修炼所得）＋一半内力（修炼、闭关、丹药所得）＋每门武学的加成（入门+3，中乘+7，上乘+14，绝学+24）。年轻、天赋好时长得快，越往上越慢。每次行动后，史书里都会写明变化。'],
   ['境界','九大境界，每境分初入、小成、大成、圆满四阶。阶靠苦练；从二流往上，每跨一个大境界都要突破瓶颈：撞上瓶颈时由你选怎么冲，也可能失败。天资决定你大概能走多远。见下方阶梯。'],
   ['武学','每学会一门武功，战斗中就多一招，品阶决定招式等级（Lv1–Lv4）。'],
   ['天赋招式','你的名字会给你一招，和名字论剑一样。要到三流好手才会显现。']]],
  fig:['战斗属性（每场战斗都用到）',[
   ['气血','战斗用的就是你的气血。后面的×数字是「抗打」：所受伤害要除以它，它随功力、根骨和护甲增长。切磋点到为止，有人认输就停；凶险的打斗可能送命。'],
   ['攻击','普通招式的伤害。主要来自力道，再加兵器。'],['防御','减少普通招式的伤害。主要来自根骨，再加护甲。'],
   ['暴击','打出会心一击（1.6倍伤害）的几率。来自力道。'],['闪避','完全躲开一击的几率。来自身法；对手出手越快，越难躲。'],
   ['速度（含在身法里）','出手的频率。不单独显示，由身法决定。'],['真气','每使一招都要耗真气，招式越高耗得越多。每回合按「气聚」恢复一些，多少取决于内功。真气耗尽，就只能出普通招式。'],
   ['内劲（含在内功里）','内功招式的伤害，也能抵挡对方的内功。不单独显示，由内功决定。'],
   ['出招率','真气够用时，你有多想出招。武功学得越多，机会越多。'],
   ['四维','力道、根骨、身法、内功。总量随功力增长，怎么分配由你：每精进一阶，选一项长进。百分比表示你在整个江湖里胜过多少人。'],
   ['从何而来','天赋决定起初的偏向，功力决定总量，你的选择决定分配，兵器、护甲、坐骑再添几分。别人的四维由其功力和体格决定。']]],
  std:['江湖地位',[
   ['正邪','从魔道到侠义。你的选择会推动它，影响谁信任你、后人如何记得你。'],
   ['名望','你有多出名。决定会不会有人下战书、请你赴宴、给你封号。'],
   ['通缉（★）','官府追捕你的力度。每年都有可能被捕快找上门。'],
   ['本年重心','今年的心思放在哪里。每年都会带来一点额外效果，直到你更换。'],
   ['门派贡献','做门派杂务、领门派任务可得。晋升先要10点、再要30点；长老之位要60点才有人考虑。少林、峨眉、玄真观这几家有藏经阁，内门弟子可花25点入阁研读。'],
   ['生财与花销','「生财」里可以贩货（低买高卖，看行情，路上有劫匪，可雇镖师）、放贷（利息越高越容易赖账，到期要你决定怎么讨）、买卖田地（租子看收成）、摆摊、卖艺、代写书信。「花销」里可以定日子的排场、设宴、进补、打造兵器、施粥修桥、寄钱回家。铺子产业偶尔会有扩张、对手压价、伙计卷款、有人出价收购等事要你拿主意。'],
   ['秘籍与武功','得到秘籍或奇遇传授，不等于学会。悟性、根骨、学识越高，越可能当场领悟；否则只摸到门径，要靠「修炼」或「研读秘籍」慢慢下工夫，练到一半还会遇到瓶颈。'],
   ['邪派','赤霄教、五毒教、七煞门、赤刃门、不归谷、夜枭会、通宝帮、黑潮帮、海蛟教、驼铃山庄、铁拳帮、飞鹰帮。各地不同。可在「黑道 → 投靠邪派」加入，或者等他们来找你。待遇优厚，同伴凶险；叛逃者会被追杀。'],
   ['自家门户','二十五岁以上、功力85+、名望25+、有八百两，可以自立门派；二十岁以上、功力40+、有六百两，可以自开镖局。招人、扩建、接镖，每年定下门中要务（招人、练兵、生财、行善、结盟）。大弟子、管事等人会帮你打理。声望撑得住，每年都有进账。']]],
  ladder:'境界阶梯',novice:'学过武功，但功力未满15'}
};
const TIPS={hp:1,atk:2,def:3,crit:4,dodge:5,spd:6,mp:7,nei:8,int:9,agi:5,res:3};
function fightHTML(s){
  if(s.age<3)return'';
  const f=youFighter(s),L=u(),G=GUIDE[LANG].fig[1];
  const cell=(k,v)=>`<div title="${esc(G[TIPS[k]-1][1])}"><span>${k==='hp'?(zh()?'抗打':'Toughness'):L.stat[k]}</span><b>${v}</b></div>`;
  const arts=f.skills.filter(x=>!x.innate),knack=f.skills.find(x=>x.innate);
  return`${powerBreak(s)}<div class="fightbox"><div class="fhead"><span class="lbl">${zh()?'战斗属性':'fighting stats'}</span><button class="info" data-guide>ⓘ ${zh()?'说明':'What these mean'}</button></div>
   ${fightBars(f)}
   <div class="ftech">${arts.length?arts.map(x=>skillChip(x)).join(''):`<span class="muted">${zh()?'未学武功，只会乱打一气。':'No arts yet. You just swing your fists.'}</span>`}${knack?`<span class="skc knack" title="${esc(tr(SKD[knack.id]))}">${zh()?'天赋':'Knack'}: ${esc(tr(SK[knack.id].n))}</span>`:''}</div>
   ${f.skills.length?`<ul class="sklist">${f.skills.map(x=>`<li><b>${esc(tr(x.label))}</b> <span class="lvl">Lv${x.lv}</span>${tr(x.label)!==tr(SK[x.id].n)?` <span class="muted">· ${tr(SK[x.id].n)}</span>`:''}<br><span class="muted">${tr(SKD[x.id])}</span></li>`).join('')}</ul>`:''}</div>`;
}
/* the four attributes, each measured against everyone else in the jianghu */
function attrBlock(s){const A=attrsOf(s);return`<div class="attr4">${ATTR.map(k=>`<div title="${esc(tr(ATD[k]))}"><span>${tr(ATN[k])}</span><b>${A[k]}</b><small>${zh()?`胜过江湖中${attrPct(A[k])}%的人`:`better than ${attrPct(A[k])}% of the jianghu`}</small></div>`).join('')}</div>`}
/* fighting stats as bars: each one measured against what a grandmaster reaches */
const FCAP={hp:10,atk:200,def:90,crit:40,dodge:40,spd:50,mp:650,nei:160};
const FCOL={hp:'f-hp',atk:'f-atk',def:'f-sm',crit:'f-joy',dodge:'f-lk',spd:'f-spd',mp:'f-res',nei:'f-pw'};
function fightBars(f){
  const L=u(),G=GUIDE[LANG].fig[1];
  const val={hp:Math.round(f.tough*10)/10,atk:f.atk,def:f.def,crit:Math.round(f.crit*100),dodge:Math.round(f.dodge*100),spd:f.spd,mp:f.mpMax,nei:f.nei};
  const txt={hp:`${Math.round(f.hp)}/${f.maxHp}`+(val.hp>1?` ×${val.hp}`:''),crit:val.crit+'%',dodge:val.dodge+'%',mp:val.mp+(zh()?` (每回合+${f.regen})`:` (+${f.regen}/turn)`)};
  const name=k=>L.stat[k];
  return`${typeof attrsOf==='function'&&f.you&&S?attrBlock(S):''}<div class="fbars">${['hp','mp','atk','def','crit','dodge'].map(k=>`<div class="bar" title="${esc(G[TIPS[k]-1][1])}"><div class="row"><span>${name(k)}</span><b>${txt[k]||val[k]}</b></div><div class="track"><div class="fill ${FCOL[k]}" style="width:${clamp((k==='hp'?f.hp/f.maxHp:val[k]/FCAP[k])*100,2,100)}%"></div></div></div>`).join('')}</div>
   <p class="fnote">${zh()?'满格约为宗师中偏擅此道者的水平。招式每次耗真气，真气每回合按气聚恢复。':'A full bar is roughly a grandmaster who specialises in it. Techniques cost true qi, which regathers each turn.'}</p>`;
}
/* what martial power is made of, and how far the next realm is */
function powerBreak(s){
  const sk=Math.round(s.skill),qi=Math.round(s.qi),ab=s.arts.reduce((t,a)=>t+TIERS[a.tier].b,0),pw=power(s),raw=typeof rawPower==='function'?rawPower(s):pw;
  const x=stageOf(pw);const next=x.i===0?8:x.lo+(x.hi-x.lo)*(x.st+1)/4;const prog=x.i===0?pw/8*100:clamp((pw-(x.lo+(x.hi-x.lo)*x.st/4))/((x.hi-x.lo)/4)*100,0,100);
  const nxName=x.i===0?T(REALM9[1][2],REALM9[1][1]):x.st<3?T(`${REALM9[x.i][2]} (${STAGES[x.st+1][1]})`,`${REALM9[x.i][1]}·${STAGES[x.st+1][0]}`):REALM9[x.i+1]?T(REALM9[x.i+1][2],REALM9[x.i+1][1]):null;
  const cap=typeof bottled==='function'&&bottled(s);
  return`<div class="pwb"><div class="pwparts"><span title="${zh()?'修炼、切磋、门派修炼所得':'From cultivation, sparring and sect training'}">${zh()?'外功':'Technique'} <b>${sk}</b></span><span>+</span><span title="${zh()?'修炼、闭关、丹药所得，计一半':'From cultivation, seclusion and elixirs; counts half'}">${zh()?'内力':'Inner energy'} <b>${qi}</b>÷2</span><span>+</span><span title="${zh()?'每门武学按品阶加成':'Each art adds by tier'}">${zh()?'武学':'Arts'} <b>${ab}</b></span><span>=</span><span><b>${raw}</b></span></div>
   ${cap?`<p class="warnrow" style="margin:6px 0">${zh()?`瓶颈：功力已到「${REALM9[s.brk][1]}」的尽头（计为${pw}），须突破方能踏入「${REALM9[s.brk+1][1]}」。`:`Bottleneck: you are at the limit of ${REALM9[s.brk][2]} (counts as ${pw}); you must break through to reach ${REALM9[s.brk+1][2]}.`}</p>`
   :nxName?`<div class="bar"><div class="row"><span>${zh()?`距「${nxName.zh}」`:`To ${nxName.en}`}</span><b>${zh()?'还差 ':''}${Math.max(1,Math.ceil(next-pw))}${zh()?'':' to go'}</b></div><div class="track"><div class="fill f-joy" style="width:${prog}%"></div></div></div>`:`<p class="fnote">${zh()?'已至武学巅峰。':'You stand at the summit of the martial world.'}</p>`}</div>`;
}
function guideHTML(){
  const G=GUIDE[LANG];const sec=x=>`<div class="grp"><h4>${x[0]}</h4><dl class="gd">${x[1].map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div>`;
  const ladder=REALM9.map((r,i)=>[r[0],r[1],r[2],i]);
  return sec(G.life)+sec(G.tal)+sec(G.mar)+`<div class="grp"><h4>${G.ladder}</h4><table class="ladder"><tbody>${ladder.map((r,i)=>`<tr${S&&typeof stageOf==='function'&&stageOf(power(S)).i===i?' class="me"':''}><td class="cn">${r[1]}</td>${zh()?'':`<td>${r[2]}</td>`}<td>${zh()?'功力 '+r[0]+'+':'Power '+r[0]+'+'}<br><span class="muted">${zh()?REALM_REF_ZH[i]:REALM_REF[i]}</span></td></tr>`).join('')}</tbody></table></div>`+sec(G.fig)+sec(G.std);
}

/* ---------- sheets ---------- */
function openSheet(kind,arg){SHEET={kind,arg,render(){renderSheet()},res:null};renderSheet();$('veil').hidden=false;document.body.style.overflow='hidden'}
let closeSheet=function(){SHEET=null;$('veil').hidden=true;$('veil').innerHTML='';document.body.style.overflow=''}
function sheetFrame(title,body,extra){return`<div class="sheet${extra||''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sh-head"><h3>${title}</h3><button class="x" data-close aria-label="${u().close}">✕</button></div><div class="sh-body">${body}</div></div>`}
function resultHTML(){if(!SHEET||!SHEET.res||!SHEET.res.length)return'';return`<div class="result">${SHEET.res.map(l=>`<p class="${l.c||''}">${tr(l.t)}</p>`).join('')}</div>`}
/* run something and capture what it wrote this year, for the result box */
function act(fn){
  const E=S.log[S.log.length-1];const before=E?E.lines.length:0;const r=fn();
  if(r!==true&&r!==undefined&&r!==false){toast(r);return}
  const E2=S.log[S.log.length-1];if(SHEET)SHEET.res=(E2&&E2===E?E2.lines.slice(before):E2?E2.lines:[]).filter(l=>l.c!=='act');
  if(S.queue.length||!S.alive){closeSheet();update(true)}else update(false);
}
let renderSheet=function(){
  if(!SHEET)return;const L=u(),s=S;let title='',body='',cls='';
  if(SHEET.kind==='me'){title=nameOf(s);body=sideHTML(s,true)+fighterCard()}
  if(SHEET.kind==='act'){title=`${L.act} · <span class="muted" style="font-size:15px">${L.apLeft(s.ap,s.apMax)}</span>`;body=resultHTML()+actsHTML()}
  if(SHEET.kind==='ppl'){title=L.ppl;body=resultHTML()+(SHEET.arg?personHTML(SHEET.arg):peopleHTML())}
  if(SHEET.kind==='own'){title=`${L.own} · ${num(s.money)} ${L.taels}`;body=resultHTML()+ownHTML()}
  if(SHEET.kind==='arena'){title=L.arenaTitle;body=arenaHTML()}
  if(SHEET.kind==='guide'){title=GUIDE[LANG].title;body=guideHTML()}
  $('veil').innerHTML=sheetFrame(title,body,cls);
}
function actsHTML(){
  const s=S;let h='';if(s.queue.length)h+=`<p class="result">${zh()?'先在史书里做完眼前的抉择。':'Make the decision waiting in your chronicle first.'}</p>`;else if(s.ap<=0&&s.alive)h+=`<p class="muted">${u().noAp}</p>`;
  ACT_CATS.forEach(([cat,name])=>{
    const items=ACTS.filter(a=>a.cat===cat&&(!a.if||a.if(s))&&(cat!=='jail'||s.jail>0)&&(cat==='jail'||cat==='train'||a.id==='doctor'||s.jail<=0));
    if(!items.length)return;
    h+=`<div class="grp"><h4>${tr(name)}</h4><div class="rows">${items.map(a=>{const ok=canAct(s,a);const cost=actCost(s,a);
      return`<button class="rowb" data-act="${a.id}"${ok===true?'':' disabled'}><span class="main"><b>${tr(a.n)}</b><span>${tr(a.d)}</span></span><span class="side">${ok===true||ok===false?(cost?'●'.repeat(Math.min(cost,6)):(zh()?'不耗行动':'free')):tr(ok)}</span></button>`}).join('')}</div></div>`});
  return h;
}
const REL_ORDER=['spouse','lover','father','mother','sibling','child','master','sworn','disciple','friend','fellow','acq','rival','enemy','ex'];
function peopleHTML(){
  const s=S,L=u();const al=s.people.filter(p=>p.alive).sort((a,b)=>REL_ORDER.indexOf(a.rel)-REL_ORDER.indexOf(b.rel)||b.bond-a.bond);
  const dead=s.people.filter(p=>!p.alive&&!p.gone).slice(-8).reverse();
  if(!al.length&&!dead.length)return`<p class="muted">${L.noPeople}</p>`;
  const row=p=>`<button class="rowb" data-p="${p.id}"><span class="av${p.alive?'':' dead'}">${p.n.sur[0][0]}</span><span class="main"><b>${zh()?p.n.cn:esc(p.n.py)} <span class="muted" style="font-weight:400">· ${tr(relLabel(s,p))}</span></b><span>${zh()?`${cnNum(p.age)}岁 · ${TRAITS[p.trait][1]}`:`${p.age} · ${TRAITS[p.trait][0]}`}${p.alive?'':' · †'}</span>${p.alive?`<span class="bond${p.bond<30?' low':''}"><i style="width:${p.bond}%"></i></span>`:''}</span><span class="side">${L.lvl} ${p.lv}</span></button>`;
  return`<div class="rows">${al.map(row).join('')}</div>${dead.length?`<div class="grp"><h4>${L.dead2}</h4><div class="rows">${dead.map(row).join('')}</div></div>`:''}`;
}
function personHTML(id){
  const s=S,L=u(),p=person(s,id);if(!p)return'';
  const acts=PACTS.filter(a=>!a.if||a.if(s,p));
  return`<button class="chip" data-back>← ${L.ppl}</button>
   <div class="who" style="margin-top:12px"><span class="av sx-${p.sex}" style="width:52px;height:52px;font-size:26px">${p.n.sur[0][0]}</span><div><h2>${zh()?p.n.cn:esc(p.n.py)+` <span class="cn muted" style="font-size:17px">${p.n.cn}</span>`}${typeof sxMark==='function'?sxMark(p):''}</h2><p>${tr(relLabel(s,p))} · ${p.sex==='f'?(zh()?'女':'female'):(zh()?'男':'male')} · ${L.age2} ${p.age} · ${L.traitL}: ${tr(P(TRAITS[p.trait]))} · ${L.lvl} ${p.lv}${p.alive?'':' · †'}</p></div></div>
   ${p.alive?`<div class="bar" style="margin:10px 0 4px"><div class="row"><span>${L.bond}</span><b>${p.bond}</b></div><div class="track"><div class="fill f-pw" style="width:${p.bond}%"></div></div></div>
   <div class="rows" style="margin-top:12px">${acts.map(a=>{const ok=canPact(s,p,a);return`<button class="rowb" data-pa="${a.id}" data-pid="${p.id}"${ok===true?'':' disabled'}><span class="main"><b>${tr(a.n)}</b></span><span class="side">${ok===true||ok===false?((a.ap??1)?'●':(zh()?'不耗行动':'free')):tr(ok)}</span></button>`}).join('')}</div>`:''}`;
}
function ownHTML(){
  const s=S,L=u();const tab=SHEET.tab||'shop';
  let h=`<div class="tabs"><button class="chip${tab==='shop'?' on':''}" data-tab="shop">${L.shop}</button><button class="chip${tab==='inv'?' on':''}" data-tab="inv">${L.inv} (${s.items.length})</button></div>`;
  const eff=d=>[d.atk?`+${d.atk} ${L.stat.atk}`:'',d.def?`+${d.def} ${L.stat.def}`:'',d.hp?`+${d.hp} ${L.stat.hp}`:'',d.spd?`+${d.spd} ${L.stat.spd}`:'',d.travel?(zh()?'出行少耗一点行动力':'travel costs 1 less energy'):'',d.flee?(zh()?`生死关头${Math.round(d.flee*100)}%能骑马脱身`:`${Math.round(d.flee*100)}% chance to ride out of a losing death fight`):'',d.happy?`+${d.happy} ${L.joy}`:'',d.upkeep?(zh()?`年耗${d.upkeep}两`:`upkeep ${d.upkeep}/yr`):'',d.inc?(zh()?`年入${d.inc[0]}–${d.inc[1]}两`:`earns ${d.inc[0]}–${d.inc[1]}/yr`):'',d.use?[d.use.heal?`+${d.use.heal} ${L.health}`:d.use.qi?(zh()?`内力+${d.use.qi}`:`+${d.use.qi} inner power`):d.use.life?(zh()?`寿元+${d.use.life}`:`+${d.use.life} years of life`):'',d.use.cond&&typeof CONDS!=='undefined'?(zh()?'治':'treats ')+[].concat(d.use.cond).map(k=>tr(CONDS[k].n)).join(zh()?'、':', '):''].filter(Boolean).join(' · '):'',d.desc?tr(d.desc):'',d.art?(zh()?`品阶${cnNum(ARTS[d.art].tier)} · 研读后可习得`:`tier ${ARTS[d.art].tier} · study to learn`):''].filter(Boolean).join(' · ');
  if(tab==='shop'){
    const by={};s.stock.ids.forEach(id=>{const d=itemDef(id);(by[d.cat]=by[d.cat]||[]).push([id,d])});
    h+=`<p class="muted" style="margin:0 0 6px;font-size:14px">${L.stockNote}</p>`;
    Object.keys(L.cats).forEach(cat=>{if(!by[cat])return;h+=`<div class="grp"><h4>${L.cats[cat]}</h4><div class="rows">${by[cat].map(([id,d])=>{const price=Math.round(d.price*(['house','biz'].includes(d.cat)?s.stock.mkt:1));const can=s.alive&&!s.queue.length&&s.money>=price;
      return`<button class="rowb" data-buy="${id}"${can?'':' disabled'}><span class="main"><b>${tr(d.n)}</b><span>${eff(d)}</span></span><span class="side"><span class="price">${num(price)}</span> ${L.taels}</span></button>`}).join('')}</div></div>`});
  }else{
    if(!s.items.length)return h+`<p class="muted">${L.empty}</p>`;
    const g=gearStats(s);Object.keys(SLOTS).forEach(k=>eqItem(s,k));
    const worth=s.money+s.items.reduce((t,it)=>t+sellPrice(s,it),0);
    h+=`<p class="muted" style="margin:0 0 8px">${L.networth}: <b style="color:var(--ink)">${num(worth)}</b> ${L.taels}<br><span style="font-size:12.5px">${zh()?'兵器、护甲、坐骑、饰物、暗器各只能用一件，其余放着。':'You can use one weapon, one armour, one mount, one charm and one kind of hidden weapon at a time; the rest stay in storage.'}</span></p><div class="rows">`;
    s.items.forEach((it,i)=>{const d=itemDef(it.id);const eq=!!(SLOTS[d.cat]&&it.eq);
      h+=`<div class="rowb" style="cursor:default"><span class="main"><b>${tr(d.n)}${it.cnt!=null?` ×${it.cnt}`:''} ${eq?`<span class="pill eq">${L.equipped}</span>`:''}</b><span>${L.cats[d.cat]} · ${eff(d)}</span></span><span class="side" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${d.use?`<button class="chip" data-use="${i}">${L.use}</button>`:''}${SLOTS[d.cat]&&!eq?`<button class="chip" data-equip="${i}">${zh()?'换上':'Equip'}</button>`:''}<button class="chip" data-sell="${i}">${L.sell(num(sellPrice(s,it)))}</button></span></div>`});
    h+='</div>';
  }
  return h;
}
function fighterCard(){
  const L=u(),f=youFighter(S);
  return`<div class="grp"><h4>${L.fstats}</h4>${bar(L.health,f.hp,f.maxHp,'f-hp',1)}${fightBars(f)}
   <ul class="sklist">${f.skills.map(x=>`<li><b>${esc(tr(x.label))}</b> <span class="lvl">Lv${x.lv}</span>${tr(x.label)!==tr(SK[x.id].n)?` <span class="muted">· ${tr(SK[x.id].n)}</span>`:''}<br><span class="muted">${tr(SKD[x.id])}</span></li>`).join('')}</ul><p class="muted" style="font-size:14px;margin:6px 0 0">${L.fnote}</p></div>`;
}

/* ---------- battles ---------- */
let BT=null;
function playShows(){if(!WATCH||BT||!SHOW.length)return;const id=SHOW.shift();if(BATTLES[id])openBattle(BATTLES[id]);else playShows()}
function nmHTML(r,i){const f=r.fighters[i];return`<b class="f${f.team%5}">${esc(tr(f.name))}</b>`}
function fmtLine(r,t){return tr(t).replace(/@(\d+)@/g,(_,i)=>nmHTML(r,+i))}
function openBattle(r,keep){
  if(BT)clearTimeout(BT.timer);
  BT={r,i:0,speed:store.get('jh4_speed',1),timer:null};
  const L=u();
  const veil=document.createElement('div');veil.className='veil';veil.id='bveil';veil.style.zIndex=50;
  veil.innerHTML=`<div class="sheet bt" role="dialog" aria-modal="true"><div class="sh-head"><h3>⚔ ${esc(tr(r.title||T('Fight','交手')))}</h3>
    <div class="bctl"><button class="chip" id="bt-speed">${L.speed} ×${BT.speed}</button><button class="chip" id="bt-skip">${L.skip}</button></div>
    <button class="x" id="bt-close" aria-label="${L.close}">✕</button></div>
    <div class="sh-body"><div class="teams" id="bt-teams"></div><div class="blog" id="bt-log"></div><div class="bend" id="bt-end" hidden><button class="btn main" id="bt-cont">${r.arena?L.close:(SHOW.length?(zh()?'下一场 →':'Next fight →'):(zh()?'看看结果 →':'See what happens →'))}</button></div></div></div>`;
  document.body.appendChild(veil);
  $('bt-close').onclick=closeBattle;$('bt-cont').onclick=closeBattle;$('bt-skip').onclick=()=>{clearTimeout(BT.timer);while(BT&&BT.i<BT.r.frames.length)stepBattle(true);drawTeams();$('bt-end').hidden=false;$('bt-cont').focus()};
  $('bt-speed').onclick=()=>{BT.speed=BT.speed===1?3:BT.speed===3?8:1;store.set('jh4_speed',BT.speed);$('bt-speed').textContent=`${u().speed} ×${BT.speed}`};

  veil.addEventListener('click',e=>{if(e.target===veil)closeBattle()});
  BT.hp=r.fighters.map(f=>f.maxHp);BT.mx=r.fighters.map(f=>f.maxHp);BT.mp=null;BT.mmx=null;BT.ss=null;BT.n=r.fighters.filter((f,i)=>!r.frames.some(fr=>fr.add&&false)).length;
  BT.visible=countInitial(r);
  drawTeams();tick();
}
function countInitial(r){let n=r.fighters.length;r.frames.forEach(fr=>{if(fr.add)n--});return n}
function drawTeams(){
  if(!BT)return;const r=BT.r;const teams={};
  for(let i=0;i<BT.visible;i++){const f=r.fighters[i];(teams[f.team]=teams[f.team]||[]).push(i)}
  $('bt-teams').innerHTML=Object.keys(teams).map(t=>`<div class="team">${teams[t].map(i=>{const f=r.fighters[i],hp=BT.hp[i],mx=BT.mx[i];
    const mp=BT.mp?BT.mp[i]:f.mpMax,mmx=BT.mmx?BT.mmx[i]:f.mpMax,ss=BT.ss?BT.ss[i]:(f.conds||[]).map(k=>'c_'+k);
    return`<div class="fc${hp<=0?' dead':''}"><div class="nm">${nmHTML(r,i)}<span class="num">${hp} / ${mx}</span></div><div class="hp"><i class="b${f.team%5}" style="width:${clamp(hp/mx*100,0,100)}%"></i></div>${mmx?`<div class="mpb" title="${zh()?'真气':'True qi'} ${mp}/${mmx}"><i style="width:${clamp(mp/mmx*100,0,100)}%"></i></div>`:''}${ss&&ss.length&&typeof stChips==='function'?`<div class="stl">${stChips(ss)}</div>`:''}${f.st?`<div class="sline">${statLine(f.st)}</div>`:''}<div class="sks">${(f.skills||[]).map(x=>skillChip(x)).join('')}</div></div>`}).join('')}</div>`).join('');
}
function stepBattle(silent){
  const r=BT.r,fr=r.frames[BT.i++];if(!fr)return;
  if(fr.add)BT.visible++;
  BT.hp=fr.hp.slice();BT.mx=fr.mx.slice();if(fr.mp){BT.mp=fr.mp.slice();BT.mmx=fr.mmx.slice()}if(fr.ss)BT.ss=fr.ss.map(x=>x.slice());
  const log=$('bt-log');const p=document.createElement('p');p.className=fr.c||'';p.innerHTML=fmtLine(r,fr.t);log.appendChild(p);
  if(!silent){log.scrollTop=log.scrollHeight;drawTeams()}else log.scrollTop=log.scrollHeight;
}
function tick(){if(!BT)return;if(BT.i>=BT.r.frames.length){drawTeams();$('bt-end').hidden=false;$('bt-cont').focus();return}stepBattle(false);BT.timer=setTimeout(tick,Math.round((matchMedia('(prefers-reduced-motion: reduce)').matches?160:520)/BT.speed))}
function closeBattle(){if(BT)clearTimeout(BT.timer);BT=null;const v=$('bveil');if(v)v.remove();
  setTimeout(()=>{if(SHOW.length&&WATCH){playShows();return}SHOW.length=0;if(DEFER.on){const sc=DEFER.scroll;DEFER.on=false;DEFER.scroll=false;update(sc)}},60)}

/* ---------- stat cards ---------- */
const STAT_KEYS=['hp','mp','atk','def','crit','dodge'];const PCTK=['crit','dodge','int'];
function statLine(st){const L=u().stat;return`<span>${zh()?'功力':'Power'} <b>${st.lv}</b></span>`+STAT_KEYS.slice(1).map(k=>`<span>${L[k]} <b>${st[k]}${PCTK.includes(k)?'%':''}</b></span>`).join('')}
function skillChip(x){const lb=x.label?tr(x.label):tr(x);const id=x.id;const base=id&&SK[id]?tr(SK[id].n):'';const lv=x.lv?` <b>${'Lv'+x.lv}</b>`:'';
  return`<span class="skc" title="${id&&SKD[id]?esc(tr(SKD[id])):''}">${esc(lb)}${base&&base!==lb?` <span class="muted">· ${esc(base)}</span>`:''}${lv}</span>`}
function statCard(name,f,team,mx){
  const L=u(),st=fstats(f);
  return`<div class="scard"><div class="nm"><b class="f${team%5}">${esc(name)}</b><span class="muted">${zh()?'功力':'Power'} ${st.lv}</span></div>
   <div class="sgrid">${STAT_KEYS.map(k=>`<div class="srow"><span>${L.stat[k]}</span><span class="sbar"><i class="b${team%5}" style="width:${clamp(st[k]/(mx[k]||1)*100,4,100)}%"></i></span><b>${st[k]}${PCTK.includes(k)?'%':''}</b></div>`).join('')}</div>
   <ul class="sklist">${f.skills.map(x=>`<li><b>${esc(tr(x.label))}</b> <span class="lvl">Lv${x.lv}</span>${tr(x.label)!==tr(SK[x.id].n)?` <span class="muted">· ${tr(SK[x.id].n)}</span>`:''}<br><span class="muted">${tr(SKD[x.id])}</span></li>`).join('')}</ul></div>`;
}

/* ---------- name arena ---------- */
const SAMPLE='沈青山\n柳寒烟\n\n陈铁牛\n苏小婉\n\n叶远舟\n白若霜';
function arenaHTML(){const L=u();const txt=SHEET.text??store.get('jh4_arena',SAMPLE);
  const teams=parseTeams(txt);
  return`<p style="margin:0 0 8px">${L.arenaHelp}</p><textarea class="names" id="ar-txt" aria-label="${L.arena}">${esc(txt)}</textarea>
  <div class="bctl" style="margin:8px 0 12px"><button class="btn main" id="ar-go">${L.fight}</button><button class="btn" id="ar-me"${S?'':' disabled'}>${L.addMe}</button><button class="btn" id="ar-rand">${L.rand}</button></div>
  ${arenaCards(teams)}`}
function arenaFighter(n){return S&&S.alive&&n===S.cn?Object.assign(youFighter(S),{hp:youFighter(S).maxHp}):nameFighter(n)}
function arenaCards(teams){
  const L=u(),list=[];teams.slice(0,8).forEach((b,ti)=>b.slice(0,6).forEach(n=>list.push({n,ti,f:arenaFighter(n)})));
  if(!list.length)return'';const mx={};STAT_KEYS.forEach(k=>mx[k]=Math.max(...list.map(x=>fstats(x.f)[k])));
  return`<div class="grp"><h4>${L.preview}${teams.length>1?` · ${zh()?cnNum(teams.length)+'队':teams.length+' sides'}`:''}</h4><div class="scards">${list.map(x=>statCard(x.n,x.f,x.ti,mx)).join('')}</div></div>`}
function parseTeams(txt){const blocks=txt.split(/\n\s*\n/).map(b=>b.split('\n').map(x=>x.trim()).filter(Boolean)).filter(b=>b.length);
  if(blocks.length===1)return blocks[0].map(n=>[n]);return blocks}
function arenaFight(){
  const txt=$('ar-txt').value;store.set('jh4_arena',txt);SHEET.text=txt;
  const teams=parseTeams(txt).slice(0,8).map(b=>b.slice(0,6));if(teams.length<2){toast(T('Enter at least two names.','至少输入两个名字。'));return}
  const me=S?S.cn:null;
  const r=runBattle(teams.map(b=>b.map(n=>Object.assign(arenaFighter(n),{name:n}))),{open:T('The names step into the ring.','众人登台。')});
  r.title=T('Name Arena','名字论剑');r.arena=1;DEFER.arena=true;openBattle(r);DEFER.arena=false;
}

/* ---------- wiring ---------- */
document.addEventListener('click',e=>{
  const t=e.target.closest('button,[data-close]');if(!t)return;
  if(t.matches('[data-close]')){closeSheet();return}
  if(t.dataset.k!=null&&t.classList.contains('choice')){choose(S,isNaN(+t.dataset.k)?t.dataset.k:+t.dataset.k);update(true);return}
  if(t.dataset.cont){delete S._hold;update(false);return}
  if(t.dataset.pp){openSheet('ppl');SHEET.arg=+t.dataset.pp;SHEET.res=null;renderSheet();return}
  if(t.dataset.b){const r=BATTLES[t.dataset.b];if(r)openBattle(r);return}
  if(t.dataset.guide!=null){openSheet('guide');return}
  if(t.dataset.act){act(()=>doAct(S,t.dataset.act));return}
  if(t.dataset.qgo){const r=doAct(S,t.dataset.qgo);if(r!==true&&r!==undefined&&r!==false){toast(r);return}update(true);return}
  if(t.dataset.p){SHEET.arg=+t.dataset.p;SHEET.res=null;renderSheet();return}
  if(t.dataset.back!=null){SHEET.arg=null;SHEET.res=null;renderSheet();return}
  if(t.dataset.pa){act(()=>doPact(S,+t.dataset.pid,t.dataset.pa));return}
  if(t.dataset.tab){SHEET.tab=t.dataset.tab;SHEET.res=null;renderSheet();return}
  if(t.dataset.buy){act(()=>buy(S,t.dataset.buy));return}
  if(t.dataset.sell!=null){act(()=>{sell(S,+t.dataset.sell);return true});return}
  if(t.dataset.equip!=null){act(()=>{equip(S,+t.dataset.equip);const d=itemDef(S.items[+t.dataset.equip].id);say(S,`You switch to ${d.n.en}.`,`你换上了${d.n.zh}。`,'muted');return true});return}
  if(t.dataset.use!=null){act(()=>{useItem(S,+t.dataset.use);return true});return}
  if(t.id==='b-again'){reborn();return}
  if(t.id==='ar-go'){arenaFight();return}
  if(t.id==='ar-me'){const ta=$('ar-txt');ta.value=(S.cn+'\n\n'+ta.value).trim();SHEET.text=ta.value;renderSheet();return}
  if(t.id==='ar-rand'){const a=[0,1,2,3].map(()=>genName(chance(.5)?'m':'f').cn);SHEET.text=`${a[0]}\n${a[1]}\n\n${a[2]}\n${a[3]}`;renderSheet();return}
});
document.addEventListener('input',e=>{if(e.target.id==='ar-txt'){SHEET.text=e.target.value}});
$('veil').addEventListener('click',e=>{if(e.target.id==='veil')closeSheet()});
$('d-age').onclick=()=>{if(!S.alive||S.queue.length)return;ageUp(S);update(true)};
$('d-me').onclick=()=>openSheet('status');$('d-act').onclick=()=>openSheet('act');$('d-ppl').onclick=()=>openSheet('ppl');$('d-own').onclick=()=>openSheet('own');

$('b-new').onclick=()=>{const b=$('b-new');if(!S.alive||b.dataset.sure){delete b.dataset.sure;reborn();return}b.dataset.sure=1;b.textContent=u().sure;setTimeout(()=>{delete b.dataset.sure;b.textContent=u().nw},3000)};
$('l-en').onclick=()=>applyLang('en');$('l-zh').onclick=()=>applyLang('zh');
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(BT)closeBattle();else if(SHEET)closeSheet();return}
  if(e.code==='Space'&&!SHEET&&!BT&&!['BUTTON','INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();$('d-age').click()}});
let reborn=function(){closeSheet();lastLen=0;SHOW.length=0;S=newLife();ageUp(S);update(false);window.scrollTo({top:0})}
function applyLang(l){
  LANG=l;const L=u();document.documentElement.lang=l==='zh'?'zh-CN':'en';document.body.classList.toggle('zh',l==='zh');
  $('l-en').setAttribute('aria-pressed',l==='en');$('l-zh').setAttribute('aria-pressed',l==='zh');
  $('t-tag').textContent=L.tag;$('t-intro').textContent=L.intro;$('b-new').textContent=L.nw;
  document.title=l==='zh'?'江湖一生':'One Life in the Jianghu';store.set('jh4_lang',l);
  if(S){lastLen=S.log.length+1;update(false)}
}

/* ink-wash hills */
function drawHills(){const c=$('hills'),r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;const g=c.getContext('2d');g.scale(d,d);
  const cs=getComputedStyle(document.documentElement),ink=cs.getPropertyValue('--ink').trim()||'#1a201f',paper=cs.getPropertyValue('--paper').trim()||'#e5e9e0';
  g.fillStyle=paper;g.fillRect(0,0,r.width,r.height);let seed=7;const rn=()=>(seed=(seed*16807)%2147483647)/2147483647;
  [{y:.38,a:.06,amp:.22},{y:.5,a:.1,amp:.2},{y:.64,a:.15,amp:.16},{y:.8,a:.22,amp:.1}].forEach((L,li)=>{const ph=[rn()*9,rn()*9,rn()*9];g.beginPath();g.moveTo(0,r.height);
    for(let x=0;x<=r.width;x+=4){const q=x/r.width;const h=Math.sin(q*3.1+ph[0])*.5+Math.sin(q*7.3+ph[1])*.3+Math.sin(q*17+ph[2])*.12;const peak=li===0?Math.exp(-Math.pow((q-.78)*4,2))*.35:0;g.lineTo(x,r.height*(L.y-h*L.amp-peak))}
    g.lineTo(r.width,r.height);g.closePath();const gr=g.createLinearGradient(0,r.height*(L.y-L.amp-.2),0,r.height);gr.addColorStop(0,hexA(ink,L.a));gr.addColorStop(1,hexA(ink,0));g.fillStyle=gr;g.fill()})}
function hexA(h,a){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
addEventListener('resize',drawHills);
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>setTimeout(drawHills,30));
new MutationObserver(()=>setTimeout(drawHills,30)).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

function start(data){
  setTimeout(()=>{if(S&&S.age<0&&!SHEET){if(typeof openSetup==='function')openSetup();else openSheet('birth')}},0);
  WATCH=true;
  let l=store.get('jh4_lang',null);if(l!=='en'&&l!=='zh')l=window.JH_DEFAULT_LANG||((navigator.language||'').toLowerCase().startsWith('zh')?'zh':'en');
  const saved=data&&data.S&&data.S.v===4?data.S:store.get(slotKey(),null);
  if(saved&&saved.v===4&&saved.log){S=saved;lastLen=S.log.length}else{S=newLife()}
  applyLang(data&&data.LANG||l);drawHills();update(false);
}

/* ===================== 1in8B layer: birth draw, flowing time, focus, life record ===================== */
const U2={
 en:{draw:'Heaven draws your lot…',bornIn:'Born in',births:n=>`1 in ${n} births`,famOdds:n=>`1 in ${n} families`,talents:'Talents',overall:n=>`Altogether: one in ${n}.`,
  paceQ:'How should time pass?',pace:{manual:['Turn by turn','You press “next year” yourself.'],30:['A 30-minute life','Years flow on their own, about 26 seconds each.'],60:['A 60-minute life','About 51 seconds a year.'],90:['A 90-minute life','About 77 seconds a year. Slow and thoughtful.']},
  focus:"this year's focus",noFocus:'No particular focus',play:'Resume',pause:'Pause',auto:'Auto',autoTip:'Let fate decide every choice',fate:'Let fate decide',
  rec:'Life record',curve:'The curve of a life',surv:'Those born the same year',survLine:p=>`You outlived ${p}% of the children born the same year as you.`,trail:'Footsteps',table:'Show the numbers',share:'Copy life summary',copied:'Copied. Paste it anywhere.',
  ser:{h:'Health %',j:'Happiness',p:'Martial power',m:'Silver (taels)'},alive:'still alive',ageL:'age',yearOf:'year'},
 zh:{draw:'天意抽签……',bornIn:'生于',births:n=>`每 ${n} 个婴儿中的一个`,famOdds:n=>`每 ${n} 户人家中的一户`,talents:'天赋',overall:n=>`合起来，是 ${n} 分之一。`,
  paceQ:'光阴怎么过？',pace:{manual:['逐年推进','由你亲手按下"过一年"。'],30:['三十分钟一生','岁月自己流淌，约二十六秒一年。'],60:['六十分钟一生','约五十一秒一年。'],90:['九十分钟一生','约七十七秒一年，慢慢体会。']},
  focus:'本年重心',noFocus:'随遇而安',play:'继续',pause:'暂停',auto:'自动',autoTip:'所有抉择都交给天意',fate:'听天由命',
  rec:'人生记录',curve:'人生曲线',surv:'同年出生的人',survLine:p=>`你活过了同年出生者中的 ${p}%。`,trail:'足迹',table:'查看数据',share:'复制人生小结',copied:'已复制，可以粘贴分享了。',
  ser:{h:'气血 %',j:'心情',p:'功力',m:'银两'},alive:'仍在世',ageL:'岁',yearOf:'年'}
};
const u2=()=>U2[LANG];
let AUTO=store.get('jh4_auto',false);
const CLOCK={on:true,acc:0,speed:store.get('jh4_tspeed',1),last:0,fate:0};
const yearMs=()=>S&&typeof S.pace==='number'?S.pace*60000/70:0;

/* birth draw */
function birthHTML(){
  const s=S,L=u2(),reg=region(s),fam=family(s),tot=a=>a.reduce((x,y)=>x+y.w,0);
  const ro=Math.round(tot(REGIONS)/reg.w*10)/10,fo=Math.round(tot(FAMILIES)/fam.w*10)/10;
  const TN=u().TN;
  return`<div class="reveal">
   <p class="rv" style="--d:0">${L.draw}</p>
   <div class="rv draw" style="--d:1"><span class="lbl">${L.bornIn}</span><b class="big">${reg.cn}</b>${zh()?'':`<span>${reg.en}</span>`}<span class="muted">${L.births(ro)}</span></div>
   <div class="rv draw" style="--d:2"><b>${zh()?fam.cn:esc(fam.en)}</b><span class="muted">${L.famOdds(fo)}</span></div>
   <div class="rv draw" style="--d:3"><b class="big">${s.cn}</b>${zh()?'':`<span>${esc(s.name)}</span>`}<span class="muted">${s.gender==='f'?(zh()?'女':'girl'):(zh()?'男':'boy')}</span></div>
   <div class="rv" style="--d:4"><span class="lbl">${L.talents}</span><div class="tal">${Object.keys(TN).map(k=>`<div><div class="t"><span>${TN[k]}</span><b>${s.t[k]}</b></div><div class="pips">${pips(s.t[k])}</div></div>`).join('')}</div></div>
   <div class="rv" style="--d:5">${startHTML(s)}</div>
   <div class="rv" style="--d:6"><div class="grp"><h4>${L.paceQ}</h4><div class="rows">${['manual',30,60,90].map(k=>`<button class="rowb" data-pace="${k}"><span class="main"><b>${L.pace[k][0]}</b><span>${L.pace[k][1]}</span></span></button>`).join('')}</div></div></div>
  </div>`;
}
function beginLife(pace){S.pace=pace==='manual'?'manual':+pace;CLOCK.acc=0;CLOCK.on=true;SHEET=null;$('veil').hidden=true;$('veil').innerHTML='';document.body.style.overflow='';if(S.age<0)ageUp(S);update(false)}

/* the clock: years flow on their own in a timed life, and wait for decisions */
function clockBlocked(){return!S||!S.alive||S.age<0||!!SHEET||!!BT||S.queue.length>0}
function renderClock(){
  const tb=$('timebar');if(!tb)return;const timed=!!yearMs()&&S&&S.alive&&S.age>=0;tb.hidden=!timed;if(!timed)return;
  $('tb-fill').style.width=clamp(CLOCK.acc/yearMs()*100,0,100)+'%';
  $('tb-play').textContent=CLOCK.on?'⏸ '+u2().pause:'▶ '+u2().play;$('tb-speed').textContent='×'+CLOCK.speed;
  $('tb-auto').textContent=u2().auto;$('tb-auto').classList.toggle('on',AUTO);$('tb-auto').setAttribute('aria-pressed',AUTO);$('tb-auto').title=u2().autoTip;
}
function letFate(){const q=S.queue[0];if(!q)return;const o=q.opts[Math.floor(Math.random()*q.opts.length)];choose(S,o.k);update(true)}
setInterval(()=>{
  const now=performance.now(),dt=Math.min(500,now-(CLOCK.last||now));CLOCK.last=now;
  if(!S||!yearMs()){renderClock();return}
  if(AUTO&&CLOCK.on&&S.alive&&S.queue.length&&!SHEET&&!BT){CLOCK.fate+=dt;if(CLOCK.fate>1400){CLOCK.fate=0;letFate()}}
  if(CLOCK.on&&!clockBlocked()){CLOCK.acc+=dt*CLOCK.speed;if(CLOCK.acc>=yearMs()){CLOCK.acc=0;ageUp(S);update(true)}}
  renderClock();
},100);

/* focus */
function focusHTML(s){
  if(!s.alive||s.age<6)return'';const L=u2();const f=s.focus&&FOCUS[s.focus];
  return`<div class="focus focusbar"><span class="lbl">${L.focus}</span><div class="fchips">${Object.keys(FOCUS).filter(k=>s.age>=FOCUS[k].min).map(k=>`<button class="chip${s.focus===k?' on':''}" data-focus="${k}" aria-pressed="${s.focus===k}">${tr(FOCUS[k].n)}</button>`).join('')}</div><p class="muted fdesc">${f?tr(f.d):L.noFocus}</p></div>`;
}

/* life record: small multiples, the survival curve, the map */
function niceMax(v){if(v<=10)return 10;const p=Math.pow(10,Math.floor(Math.log10(v)));const m=v/p;return(m<=1?1:m<=2?2:m<=5?5:10)*p}
function lineChart(id,label,pts,max,opt){
  opt=opt||{};const W=300,H=118,pl=36,pr=12,pt=12,pb=24,a0=pts[0].a,a1=Math.max(pts[pts.length-1].a,a0+1);
  max=max||niceMax(Math.max(1,...pts.map(p=>p.v)));
  const X=a=>pl+(a-a0)/(a1-a0)*(W-pl-pr),Y=v=>pt+(1-clamp(v,0,max)/max)*(H-pt-pb);
  const d=pts.map((p,i)=>`${i?'L':'M'}${X(p.a).toFixed(1)},${Y(p.v).toFixed(1)}`).join('');
  const area=`${d}L${X(pts[pts.length-1].a).toFixed(1)},${Y(0)}L${X(a0).toFixed(1)},${Y(0)}Z`;
  const last=opt.mark!=null?pts.find(p=>p.a===opt.mark)||pts[pts.length-1]:pts[pts.length-1];
  const fmtv=v=>v>=10000?Math.round(v/1000)+'k':Math.round(v);
  return`<figure class="lc" data-id="${id}" data-a0="${a0}" data-a1="${a1}" data-max="${max}" data-pts='${JSON.stringify(pts.map(p=>[p.a,Math.round(p.v)]))}' data-fmt="${opt.pct?'%':''}">
   <figcaption>${label}</figcaption>
   <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
    ${[0,.5,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(max*f)}" y2="${Y(max*f)}" class="grid"/><text x="${pl-6}" y="${Y(max*f)+4}" class="ax" text-anchor="end">${fmtv(max*f)}${opt.pct?'%':''}</text>`).join('')}
    <text x="${pl}" y="${H-6}" class="ax">${a0}</text><text x="${W-pr}" y="${H-6}" class="ax" text-anchor="end">${a1}</text>
    <path d="${area}" class="area${opt.alt?' alt':''}"/><path d="${d}" class="ln${opt.alt?' alt':''}"/>
    ${opt.mark!=null?`<line x1="${X(last.a)}" x2="${X(last.a)}" y1="${pt}" y2="${Y(0)}" class="mk"/>`:''}
    <circle cx="${X(last.a)}" cy="${Y(last.v)}" r="4.5" class="dot${opt.mark!=null?' mkdot':''}"/>
    <line class="xh" x1="0" x2="0" y1="${pt}" y2="${Y(0)}" visibility="hidden"/><rect class="hit" x="${pl}" y="0" width="${W-pl-pr}" height="${H}"/>
   </svg><div class="tip" hidden></div></figure>`;
}
document.addEventListener('pointermove',e=>{
  const fig=e.target.closest&&e.target.closest('.lc');document.querySelectorAll('.lc .tip').forEach(t=>{if(!fig||!fig.contains(t)){t.hidden=true;const xh=t.parentNode.querySelector('.xh');if(xh)xh.setAttribute('visibility','hidden')}});
  if(!fig)return;const svg=fig.querySelector('svg'),r=svg.getBoundingClientRect(),W=300,pl=36,pr=12;
  const a0=+fig.dataset.a0,a1=+fig.dataset.a1,pts=JSON.parse(fig.dataset.pts);
  const x=(e.clientX-r.left)/r.width*W;const a=a0+(x-pl)/(W-pl-pr)*(a1-a0);
  let best=pts[0];pts.forEach(p=>{if(Math.abs(p[0]-a)<Math.abs(best[0]-a))best=p});
  const px=pl+(best[0]-a0)/(a1-a0)*(W-pl-pr);const xh=fig.querySelector('.xh');xh.setAttribute('x1',px);xh.setAttribute('x2',px);xh.setAttribute('visibility','visible');
  const tip=fig.querySelector('.tip');tip.hidden=false;tip.innerHTML=`<b>${num(best[1])}${fig.dataset.fmt}</b> · ${zh()?cnNum(best[0])+'岁':'age '+best[0]}`;
  tip.style.left=clamp(px/W*100,12,88)+'%';
});
const MAPXY={west:[44,92],north:[176,34],capital:[222,70],central:[182,108],shu:[112,140],miao:[92,190],jiangnan:[236,150],east:[292,124]};
function mapSVG(s){
  const tr2=(s.trail&&s.trail.length?s.trail:[s.region]).filter((r,i,a)=>i===0||a[i-1]!==r);
  const pts=tr2.map(r=>MAPXY[r]);const d=pts.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join('');
  return`<svg class="map" viewBox="0 0 330 220" role="img" aria-label="${esc(u2().trail)}">
   <path d="M20,60 C80,20 160,10 230,30 S320,80 316,150 S250,212 160,208 S30,190 18,130 Z" class="land"/>
   <path d="M60,96 C110,90 150,112 190,110 S260,96 300,104" class="river"/><path d="M80,150 C130,150 170,160 210,154 S270,140 300,130" class="river"/>
   ${tr2.length>1?`<path d="${d}" class="route"/>`:''}
   ${REGIONS.map(r=>{const[x,y]=MAPXY[r.id];const on=tr2.includes(r.id);return`<g class="reg${on?' on':''}"><circle cx="${x}" cy="${y}" r="${on?6:3.5}"/><text x="${x}" y="${y-11}" text-anchor="middle" class="rn">${r.cn}</text>${zh()?'':`<text x="${x}" y="${y+18}" text-anchor="middle" class="re">${esc(r.en.replace(/^the /,''))}</text>`}</g>`}).join('')}
   <g class="pin"><circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="9"/><text x="${pts[0][0]}" y="${pts[0][1]+4}" text-anchor="middle">生</text></g>
   ${!s.alive?`<g class="pin end"><circle cx="${pts[pts.length-1][0]+(tr2.length>1?0:16)}" cy="${pts[pts.length-1][1]}" r="9"/><text x="${pts[pts.length-1][0]+(tr2.length>1?0:16)}" y="${pts[pts.length-1][1]+4}" text-anchor="middle">卒</text></g>`:''}
  </svg>`;
}
function recordHTML(s){
  const L=u2(),h=(s.hist||[]).filter(x=>x.a>=0);if(h.length<2)return'';
  const ser=k=>h.map(x=>({a:x.a,v:x[k]}));
  const surv=[];for(let a=0;a<=Math.max(90,s.age+5);a+=1)surv.push({a,v:SURVIVAL[Math.min(a,110)]*100});
  const step=Math.max(1,Math.round(h.length/20));
  return`<div class="rec"><h4 class="rech">${L.rec}</h4>
   <span class="lbl">${L.curve}</span>
   <div class="mults">${lineChart('h',L.ser.h,ser('h'),100,{pct:1})}${lineChart('j',L.ser.j,ser('j'),100)}${lineChart('p',L.ser.p,ser('p'))}${lineChart('m',L.ser.m,ser('m'))}</div>
   <div class="rec2"><div><span class="lbl">${L.surv}</span>${lineChart('s','',surv,100,{pct:1,mark:s.age,alt:1})}<p class="survp">${L.survLine(outlived(s.age))}</p></div>
   <div><span class="lbl">${L.trail}</span>${mapSVG(s)}</div></div>
   <details><summary>${L.table}</summary><div class="tblw"><table><thead><tr><th>${zh()?'年纪':'Age'}</th>${['h','j','p','m'].map(k=>`<th>${L.ser[k]}</th>`).join('')}</tr></thead><tbody>${h.filter((x,i)=>i%step===0||i===h.length-1).map(x=>`<tr><td>${x.a}</td><td>${x.h}</td><td>${x.j}</td><td>${x.p}</td><td>${num(x.m)}</td></tr>`).join('')}</tbody></table></div></details>
   <button class="btn" id="b-share">${L.share}</button></div>`;
}
function summaryText(s){
  const t=titleOf(s),reg=region(s);
  return zh()?`【江湖一生】${s.cn}，生于${reg.cn}（开局胜过${startPct(s)}%的人）。${t[0].zh}·${t[1].zh}。修为「${rname(s)[1]}」，享年${s.age}岁，${s.cause.zh}。活过了同年出生者中的${outlived(s.age)}%。${s.deeds.slice(0,3).map(d=>d.zh).join('；')}`
   :`[One Life in the Jianghu] ${s.name} (${s.cn}), born in ${reg.en} (a better start than ${startPct(s)}%). ${t[1].en}. Realm: ${rname(s)[2]}. Died at ${s.age}, of ${s.cause.en}. Outlived ${outlived(s.age)}% of those born the same year. ${s.deeds.slice(0,3).map(d=>d.en).join('; ')}`;
}

/* hook the new pieces into the existing renderers */
;
const _epitaph=epitaph;epitaph=function(s){const h=_epitaph(s);const i=h.indexOf('<button class="btn main" id="b-again">');return h.slice(0,i)+recordHTML(s)+h.slice(i)};
const _renderSheet=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='birth'){$('veil').innerHTML=sheetFrame(nameOf(S),birthHTML());return}_renderSheet()};
const _closeSheet=closeSheet;closeSheet=function(){const b=SHEET&&SHEET.kind==='birth';_closeSheet();if(b&&S.age<0)beginLife('manual')};
const _renderChron=renderChron;renderChron=function(){_renderChron();if(S.alive&&S.age>=6){const tp=$('chron').querySelector(':scope>.choices');if(tp)tp.insertAdjacentHTML('afterend',focusHTML(S));else $('chron').insertAdjacentHTML('afterbegin',focusHTML(S))}const c=$('chron').querySelector('.choices');if(c){const b=document.createElement('button');b.className='chip fate';b.dataset.fate='1';b.textContent='☯ '+u2().fate;c.appendChild(b)}};
reborn=function(){closeSheet();lastLen=0;SHOW.length=0;S=newLife();update(false);openSheet('birth');window.scrollTo({top:0})};
const _closeBattle=closeBattle;
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.dataset.pace){beginLife(t.dataset.pace);return}
  if(t.dataset.focus){S.focus=S.focus===t.dataset.focus?null:t.dataset.focus;update(false);return}
  if(t.dataset.fate){letFate();return}
  if(t.id==='tb-play'){CLOCK.on=!CLOCK.on;renderClock();return}
  if(t.id==='tb-speed'){const sp=[1,2,4,8,16];CLOCK.speed=sp[(sp.indexOf(CLOCK.speed)+1)%sp.length];store.set('jh4_tspeed',CLOCK.speed);renderClock();return}
  if(t.id==='tb-auto'){AUTO=!AUTO;store.set('jh4_auto',AUTO);renderClock();return}
  if(t.id==='b-share'){const txt=summaryText(S);const ok=()=>toast(T(U2.en.copied,U2.zh.copied));
    try{navigator.clipboard.writeText(txt).then(ok,()=>{prompt2(txt)})}catch(err){prompt2(txt)}return}
});
function prompt2(txt){const ta=document.createElement('textarea');ta.value=txt;ta.className='names';ta.style.marginTop='8px';$('b-share').after(ta);ta.select()}
/* in auto mode, a finished fight closes itself so the life keeps flowing */
setInterval(()=>{if(AUTO&&BT&&BT.i>=BT.r.frames.length&&yearMs()){BT.doneT=(BT.doneT||0)+500;if(BT.doneT>2500)closeBattle()}},500);

window.claude?.hot?.snapshot?.(()=>({S,LANG}));
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
