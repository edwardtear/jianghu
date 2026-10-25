/* 江湖一生 · 故人: everyone you have lost stays in the book. The People sheet gets two tabs, the living and the departed;
   the departed tab lists every person who died in this life (grouped like the living), plus the people you cut ties with. */
'use strict';
(()=>{const ph=peopleHTML;peopleHTML=function(){const s=S,Z=zh(),L=u();if(typeof fixSibSects==='function')fixSibSects(s);
  const dead=s.people.filter(p=>!p.alive&&!p.gone),cut=s.people.filter(p=>!p.alive&&p.gone);
  const tab=SHEET&&SHEET.tab==='dead'?'dead':'live',nAl=s.people.filter(p=>p.alive).length;
  const tabs=`<div class="tabs"><button class="chip${tab==='live'?' on':''}" data-tab="live">${Z?'在世':'Living'} (${nAl})</button><button class="chip${tab==='dead'?' on':''}" data-tab="dead">${Z?'故人':'The departed'} (${dead.length})</button></div>`;
  if(tab==='live'){let h=ph();const k=`<div class="grp"><h4>${L.dead2}</h4><div class="rows">`,i=h.indexOf(k);
    if(i>=0){const j=h.indexOf('</div></div>',i);if(j>=0)h=h.slice(0,i)+h.slice(j+12)}
    return tabs+h}
  if(!dead.length&&!cut.length)return tabs+`<p class="muted">${Z?'还没有故去的人。':'Nobody has died yet.'}</p>`;
  const ago=p=>{const d=p.diedAt;if(d==null)return'';if(d<0)return Z?'你出生前':'before you were born';const n=s.age-d;return n<=0?(Z?'今年':'this year'):(Z?`${cnNum(n)}年前`:`${n} yr ago`)};
  const row=p=>`<button class="rowb" data-p="${p.id}"><span class="av sx-${p.sex} dead">${avChar(p)}</span><span class="main"><b>${Z?p.n.cn:esc(p.n.py)}${typeof sxMark==='function'?sxMark(p):''} <span class="muted" style="font-weight:400">· ${tr(relLabel(s,p))}</span></b><span>${p.gone?(Z?'断了来往':'ties cut'):(Z?`享年${cnNum(p.age)}岁 · ${p.cause?p.cause.zh:'死因不详'}`:`died at ${p.age} · ${p.cause?esc(p.cause.en):'cause unknown'}`)}</span></span><span class="side">${p.gone?'':ago(p)}</span></button>`;
  const byDeath=(a,b)=>(b.diedAt??-99)-(a.diedAt??-99);let h=tabs;
  REL_GROUPS.forEach(([k,name,rels])=>{const g=dead.filter(p=>rels.includes(p.rel)).sort(byDeath);if(g.length)h+=`<div class="grp"><h4>${tr(name)} <span class="muted">(${g.length})</span></h4><div class="rows">${g.map(row).join('')}</div></div>`});
  const rest=dead.filter(p=>!REL_GROUPS.some(g=>g[2].includes(p.rel))).sort(byDeath);
  if(rest.length)h+=`<div class="grp"><h4>${Z?'其他':'Others'} <span class="muted">(${rest.length})</span></h4><div class="rows">${rest.map(row).join('')}</div></div>`;
  if(cut.length)h+=`<div class="grp"><h4>${Z?'断了来往的人':'People you cut ties with'} <span class="muted">(${cut.length})</span></h4><div class="rows">${cut.map(row).join('')}</div></div>`;
  return h}})();
