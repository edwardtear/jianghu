/* 江湖一生 · interface for grouped relationships, causes of death, grouped assets and the yearly ledger */
'use strict';

peopleHTML=function(){
  const s=S,L=u();const al=s.people.filter(p=>p.alive);const dead=s.people.filter(p=>!p.alive&&!p.gone).slice(-12).reverse();
  if(!al.length&&!dead.length)return`<p class="muted">${L.noPeople}</p>`;
  const row=p=>`<button class="rowb" data-p="${p.id}"><span class="av${p.alive?'':' dead'}">${p.n.sur[0][0]}</span><span class="main"><b>${zh()?p.n.cn:esc(p.n.py)} <span class="muted" style="font-weight:400">· ${tr(relLabel(s,p))}</span></b><span>${p.alive?(zh()?`${cnNum(p.age)}岁 · ${TRAITS[p.trait][1]}${p.sect&&SECTS[p.sect]?' · '+SECTS[p.sect].cn:''}`:`${p.age} · ${TRAITS[p.trait][0]}${p.sect&&SECTS[p.sect]?' · '+SECTS[p.sect].en:''}`):(zh()?`享年${cnNum(p.age)}岁 · 死于${p.cause?p.cause.zh:'不详'}`:`died at ${p.age} · ${p.cause?p.cause.en:'cause unknown'}`)}</span>${p.alive?`<span class="bond${p.bond<30?' low':''}"><i style="width:${p.bond}%"></i></span>`:''}</span><span class="side">${p.alive?(hostile(p)?`<span class="warnrow">${zh()?'敌对':'hostile'}</span>`:p.bond<25?(zh()?'冷淡':'cold'):`${L.lvl} ${p.lv}`):'†'}</span></button>`;
  let h='';
  REL_GROUPS.forEach(([k,name,rels])=>{const g=al.filter(p=>rels.includes(p.rel)).sort((a,b)=>rels.indexOf(a.rel)-rels.indexOf(b.rel)||b.bond-a.bond);if(g.length)h+=`<div class="grp"><h4>${tr(name)} <span class="muted">(${g.length})</span></h4><div class="rows">${g.map(row).join('')}</div></div>`});
  const rest=al.filter(p=>!REL_GROUPS.some(g=>g[2].includes(p.rel)));if(rest.length)h+=`<div class="grp"><h4>${zh()?'其他':'Others'}</h4><div class="rows">${rest.map(row).join('')}</div></div>`;
  if(dead.length)h+=`<div class="grp"><h4>${L.dead2}</h4><div class="rows">${dead.map(row).join('')}</div></div>`;
  return h;
};
const _personHTML=personHTML;
personHTML=function(id){const p=person(S,id);let h=_personHTML(id);
  if(p&&!p.alive&&!p.gone)h+=`<p class="muted" style="margin-top:12px">${zh()?`${p.n.cn}享年${cnNum(p.age)}岁，死于${p.cause?p.cause.zh:'不详'}。`:`${esc(p.n.py)} died at ${p.age}, of ${p.cause?p.cause.en:'unknown causes'}.`}</p>`;
  if(p&&p.alive&&hostile(p))h=h.replace('<div class="rows" style="margin-top:12px">',`<p class="warnrow" style="margin:10px 0 0">${zh()?'你们是仇人。闲聊送礼这些就别想了。':'You are enemies. Small talk and gifts are out of the question.'}</p><div class="rows" style="margin-top:12px">`);
  return h};

const _ownHTML=ownHTML;
ownHTML=function(){
  const s=S,L=u();const tab=SHEET.tab||'shop';
  const tabs=`<div class="tabs"><button class="chip${tab==='shop'?' on':''}" data-tab="shop">${L.shop}</button><button class="chip${tab==='inv'?' on':''}" data-tab="inv">${L.inv} (${s.items.length})</button><button class="chip${tab==='ledger'?' on':''}" data-tab="ledger">${zh()?'收支':'Income & expenses'}</button></div>`;
  const fix=h=>h.replace(/^<div class="tabs">[\s\S]*?<\/div>/,tabs);
  if(tab==='shop')return fix(_ownHTML());
  if(tab==='inv'){
    let h=fix(_ownHTML());if(!s.items.length)return h;
    /* rebuild the item list grouped by category */
    const start=h.indexOf('<div class="rows">');const head=h.slice(0,start);const body=h.slice(start);
    const R0='<div class="rowb" style="cursor:default">';const rows=body.split(R0).slice(1).map(x=>R0+x);if(rows.length)rows[rows.length-1]=rows[rows.length-1].replace(/<\/div>\s*$/,'');
    const by={};s.items.forEach((it,i)=>{const c=itemDef(it.id).cat;(by[c]=by[c]||[]).push(rows[i]||'')});
    return head+Object.keys(L.cats).filter(c=>by[c]).map(c=>`<div class="grp"><h4>${L.cats[c]} <span class="muted">(${by[c].length})</span></h4><div class="rows">${by[c].join('')}</div></div>`).join('');
  }
  const book=(lg,title)=>{if(!lg)return'';const it=Object.entries(lg.items).filter(([k,v])=>v);const inc=it.filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]),exp=it.filter(([k,v])=>v<0).sort((a,b)=>a[1]-b[1]);
    const ti=inc.reduce((t,x)=>t+x[1],0),te=exp.reduce((t,x)=>t+x[1],0);const nm=k=>tr(LCAT[k]||LCAT.other);
    const line=([k,v])=>`<div class="lgrow"><span>${nm(k)}</span><b class="${v>0?'pos':'neg'}">${v>0?'+':'−'}${num(Math.abs(v))}</b></div>`;
    return`<div class="grp"><h4>${title}</h4><div class="ledger"><div><span class="lbl">${zh()?'收入':'Income'}</span>${inc.length?inc.map(line).join(''):`<p class="muted">${zh()?'无':'None'}</p>`}</div><div><span class="lbl">${zh()?'支出':'Expenses'}</span>${exp.length?exp.map(line).join(''):`<p class="muted">${zh()?'无':'None'}</p>`}</div></div>
     <div class="lgrow total"><span>${zh()?'净额':'Net'}</span><b class="${ti+te>=0?'pos':'neg'}">${ti+te>=0?'+':'−'}${num(Math.abs(ti+te))} ${L.taels}</b></div></div>`};
  const worth=s.money+s.items.reduce((t,it)=>t+sellPrice(s,it),0)+(s.land||0)*130+(s.loans||[]).reduce((t,x)=>t+x.amt,0);
  const yearly=[...owned(s,'biz').map(b=>[tr(b.n),zh()?`年入${b.inc[0]}–${b.inc[1]}两`:`earns ${b.inc[0]}–${b.inc[1]}/yr`]),...owned(s,'house').map(h=>[tr(h.n),zh()?`年耗${h.upkeep}两`:`upkeep ${h.upkeep}/yr`]),...owned(s,'mount').filter(m=>m.upkeep).map(m=>[tr(m.n),zh()?`草料约${m.upkeep}两/年`:`feed about ${m.upkeep}/yr`]),...(typeof econLines==='function'?econLines(s):[]),...(s.job?[[tr(JOBS[s.job].n[s.jobLv]),zh()?`年俸${JOBS[s.job].pay[s.jobLv]}两`:`${JOBS[s.job].pay[s.jobLv]}/yr wages`]]:[])];
  return tabs+`<p class="muted" style="margin:0 0 8px">${L.networth}: <b style="color:var(--ink)">${num(worth)}</b> ${L.taels} · ${zh()?'现银':'silver'} ${num(s.money)}</p>`+
   (yearly.length?`<div class="grp"><h4>${zh()?'固定进出':'Regular income & costs'}</h4>${yearly.map(([a,b])=>`<div class="lgrow"><span>${a}</span><span class="muted">${b}</span></div>`).join('')}</div>`:'')+
   book(s.ledger,zh()?`今年（${cnNum(s.ledger?s.ledger.age:s.age)}岁）至今`:`This year (age ${s.ledger?s.ledger.age:s.age}) so far`)+book(s.ledgerLast,zh()?'去年':'Last year');
};

/* ---------- before birth: choose gender and birthplace, or leave them to fate; family is always heaven’s choice ---------- */
const SETUP_FAM_NOTE={peasant:T('poor, ordinary','清贫，平常'),hunter:T('poor; quick and quiet','清贫，身手灵便'),merchant:T('money from the start','一出生就有钱'),scholar:T('books and some money','有书读，有些家底'),beggar:T('nothing at all; hard','一无所有，很难'),escort:T('a fighting family','走镖人家，自小习武'),temple:T('raised by monks','和尚养大'),clan:T('martial clan; strong start','武林世家，起点高'),cult:T('the demonic path','魔教出身，正派不容'),noble:T('rich and bound by rules','富贵，规矩多')};
function setupHTML(){
  const o=SHEET.opt||(SHEET.opt=(()=>{const x=store.get('jh4_start',{})||{};return{g:x.g||'',region:x.region||''}})()),sel=(k,v)=>o[k]===v?' on':'',Z=zh();
  const chip=(k,v,label)=>`<button class="chip${sel(k,v)}" data-su="${k}" data-v="${v}">${label}</button>`;
  const fate=Z?'随天意':'Leave it to fate';
  const sectNames=r=>r.sects.filter(x=>SECTS[x]&&!SECTS[x].hidden).slice(0,4).map(x=>Z?SECTS[x].cn:SECTS[x].en).join(Z?'、':', ');
  return`<p class="muted" style="margin:0 0 10px">${Z?'选好你想要的，其余交给天意。天赋永远是天定的。':'Choose what you like and leave the rest to fate. Talents are always drawn by heaven.'}</p>
   <div class="grp"><h4>${Z?'性别':'Gender'}</h4><div class="chips">${chip('g','','🎲 '+fate)}${chip('g','m',Z?'男':'Male')}${chip('g','f',Z?'女':'Female')}</div></div>
   <div class="grp"><h4>${Z?'出生地':'Birthplace'}</h4><div class="rows">
     <button class="rowb${sel('region','')}" data-su="region" data-v=""><span class="main"><b>🎲 ${fate}</b><span>${Z?'按各地人口随机':'Weighted by population'}</span></span></button>
     ${REGIONS.map(r=>`<button class="rowb${sel('region',r.id)}" data-su="region" data-v="${r.id}"><span class="main"><b>${Z?r.cn:r.en}</b><span>${Z?'附近：':'Nearby: '}${sectNames(r)}</span></span></button>`).join('')}</div></div>
   <p class="muted" style="font-size:13px;margin:12px 0 0">${Z?'出身由天定：生在什么人家，你选不了。':'Your family is decided by heaven. Nobody chooses who they are born to.'}</p>
   <button class="btn main" id="b-born" style="margin-top:14px;width:100%">${Z?'投胎':'Be born'}</button>`;
}
function bornWith(o){store.set('jh4_start',o);START_OPT={g:o.g||null,region:o.region||null};try{S=newLife()}finally{START_OPT=null}
  S.chose=!!(o.g||o.region);SHEET=null;lastLen=0;SHOW.length=0;update(false);openSheet('birth')}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='setup'){$('veil').innerHTML=sheetFrame(zh()?'投胎':'Before you are born',setupHTML());return}rs()}})();
(()=>{const cs=closeSheet;closeSheet=function(){const k=SHEET&&SHEET.kind,o=SHEET&&SHEET.opt;cs();if(k==='setup'&&S&&S.age<0)bornWith(o||{})}})();
function openSetup(){openSheet('setup')}
reborn=function(){closeSheet();lastLen=0;SHOW.length=0;S=newLife();update(false);openSetup();window.scrollTo({top:0})};
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!SHEET||SHEET.kind!=='setup')return;
  if(t.dataset.su){SHEET.opt[t.dataset.su]=t.dataset.v;const y=$('veil').querySelector('.sh-body')?.scrollTop;renderSheet();const b=$('veil').querySelector('.sh-body');if(b&&y!=null)b.scrollTop=y;return}
  if(t.id==='b-born'){const o=SHEET.opt;SHEET=null;$('veil').hidden=true;$('veil').innerHTML='';document.body.style.overflow='';bornWith(o)}});
(()=>{const bh=birthHTML;birthHTML=function(){const h=bh();return S&&S.chose?h.replace('<p class="rv" style="--d:0">'+u2().draw+'</p>',`<p class="rv" style="--d:0">${zh()?'你挑好了出身，天赋仍由天定……':'You chose where to begin. Heaven still draws your talents…'}</p>`):h}})();
/* a brand-new game may already be showing the birth draw before this file loads: start with the choices instead */
setTimeout(()=>{if(S&&S.age<0&&!S.chose&&(!SHEET||SHEET.kind==='birth')){SHEET=null;openSetup()}},0);
/* a famous parent is shown as the jianghu knows them */
(()=>{const ph=personHTML;personHTML=function(id){let h=ph(id);const s=S;if(s.hero&&s.hero.pid===id){const e=s.hero.ep;h=h.replace('</p></div></div>',`</p><p style="margin:2px 0 0;color:var(--gold)">${zh()?`江湖人称「${e.zh}」，名震一方的大侠`:`Known in the jianghu as "${e.en}", a famous hero`}</p></div></div>`)}return h}})();
/* the history you share with someone, from the record */
function memFor(s,p){return(s.mem||[]).filter(r=>r.pid===p.id||(!r.pid&&r.who&&r.who.n&&r.who.n.cn===p.n.cn)).slice(-6).reverse()}
(()=>{const ph=personHTML;personHTML=function(id){let h=ph(id);const s=S,p=person(s,id);if(!p)return h;const ms=memFor(s,p);if(!ms.length)return h;
  const Z=zh(),li=ms.map(r=>{const n=s.age-r.at,R=REGIONS.find(x=>x.id===r.reg);const when=n>0?(Z?`${cnNum(n)}年前`:`${n} yr ago`):(Z?'今年':'this year');
    return`<li>${tr(r.what)}${r.chose&&r.chose.zh?` <span class="muted">${Z?'你选择了「'+r.chose.zh+'」':'You chose: '+esc(r.chose.en)}</span>`:''}<small>${when}${R?' · '+(Z?R.cn:R.en):''} · ${tr(memKindLabel[r.kind])}${r.out?' · '+tr(r.out):''}</small></li>`}).join('');
  return h+`<div class="grp" style="margin-top:14px"><h4>${Z?'你们的往事':'Your history together'}</h4><ul class="memlist">${li}</ul></div>`}})();
/* the biography goes on the tombstone, under the one-line summary */
(()=>{const ep=epitaph;epitaph=function(s){const h=ep(s);if(typeof biography!=='function')return h;let b;try{b=biography(s)}catch(e){return h}
  const i=h.indexOf('<div class="grid3">');if(i<0)return h;return h.slice(0,i)+`<div class="bio"><h4>${zh()?'生平':'A life'}</h4>${esc(tr(b))}</div>`+h.slice(i)}})();
/* how the sects regard you, and how they stand with your own */
(()=>{const ph=peopleHTML;peopleHTML=function(){let h=ph();const s=S;if(typeof sst!=='function')return h;const Z=zh();
  const near=regSects(s);let ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&(k===s.sect||Math.abs(sst(s,k))>=25||(near.includes(k)&&(Math.abs(sst(s,k))>=5||(s.sect&&sectRel(s.sect,k)!==0)))));
  if(!ks.length)return h;ks.sort((a,b)=>(b===s.sect)-(a===s.sect)||sst(s,b)-sst(s,a));ks=ks.slice(0,12);
  const row=k=>{const v=sst(s,k),r=s.sect&&k!==s.sect?sectRel(s.sect,k):null;return`<div class="rowb" style="cursor:default"><span class="main"><b>${Z?SECTS[k].cn:SECTS[k].en}${k===s.sect?(Z?'（本门）':' (yours)'):''}</b><span>${tr(SSTN(v))} · ${v>0?'+':''}${v}</span>${r!=null?`<span>${Z?'与本门':'With your sect'}：${tr(RELNAME[r])}</span>`:''}</span></div>`};
  return h+`<div class="grp"><h4>${Z?'各派对你的态度':'How the sects see you'}</h4><div class="rows">${ks.map(row).join('')}</div></div>`}})();
