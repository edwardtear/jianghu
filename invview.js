/* 江湖一生 · the belongings page, easier to read: what you are wearing sits at the top, slot by slot, with the gear's
   combined effect; filters narrow the list to gear, medicine, property or the rest; and in each kind of gear the piece
   you are using comes first. */
'use strict';
const INV_SLOT_ORDER=['weapon','anqi','head','armor','bracer','boots','charm','mount'];
const INV_FILT={gear:c=>!!SLOTS[c],pill:c=>c==='pill',prop:c=>['house','biz','pet'].includes(c),other:c=>!SLOTS[c]&&!['pill','house','biz','pet'].includes(c)};
function wornHTML(s){const L=u(),Z=zh(),ks=INV_SLOT_ORDER.filter(k=>SLOTS[k]).concat(Object.keys(SLOTS).filter(k=>!INV_SLOT_ORDER.includes(k)));
  const cell=k=>{const it=eqItem(s,k),d=it&&(typeof instDef==='function'?instDef(it):itemDef(it.id));const i=it?s.items.indexOf(it):-1;
    const g=d&&d.q!=null&&typeof GRADES!=='undefined'?GRADES[d.q].c:'';
    return`<div class="wcell${d?'':' empty'}"${i>=0?` data-ipick="${i}"`:''}><span class="wk">${L.cats[k]||k}</span><b class="${g?'gq '+g:''}">${d?tr(d.n)+(it.cnt!=null?` ×${it.cnt}`:''):(Z?'—空—':'— none —')}</b></div>`};
  const f=youFighter(s),bits=[[L.stat.atk,f.atk],[L.stat.def,f.def],[L.stat.spd,f.spd]];
  return`<div class="grp worn"><h4>${Z?'身上穿戴':'What you are wearing'}</h4><div class="wgrid">${ks.map(cell).join('')}</div>
   <p class="muted" style="font-size:12.5px;margin:6px 0 0">${Z?'穿戴后的身手：':'With this gear: '}${bits.map(([a,b])=>`${a} <b style="color:var(--ink)">${b}</b>`).join(' · ')}</p></div>`}
(()=>{const i0=invHTML;invHTML=function(){const h=i0.apply(this,arguments),s=S,L=u(),Z=zh();if(!s.items.length)return h;
  const fl=SHEET.ifilt||'all',cnt=k=>s.items.filter(it=>{const d=itemDef(it.id);return d&&(k==='all'||INV_FILT[k](d.cat))}).length;
  const chips=`<div class="chips invfilt">${[['all',Z?'全部':'All'],['gear',Z?'装备':'Gear'],['pill',Z?'丹药':'Medicine'],['prop',Z?'房产产业':'Property'],['other',Z?'其他':'Other']].filter(([k])=>k==='all'||cnt(k)).map(([k,n])=>`<button class="chip${fl===k?' on':''}" data-ifilt="${k}">${n} (${cnt(k)})</button>`).join('')}</div>`;
  const parts=h.split('<div class="grp"><h4>'),head=parts.shift();const catOf=lbl=>Object.keys(L.cats).find(c=>lbl.startsWith(L.cats[c]+' '))||'';
  let groups=parts.map(p=>({c:catOf(p),h:'<div class="grp"><h4>'+p}));
  if(fl!=='all')groups=groups.filter(g=>g.c&&INV_FILT[fl](g.c));
  /* gear first, in slot order, then medicine, property and the rest */
  const rank=c=>{const i=INV_SLOT_ORDER.indexOf(c);return SLOTS[c]?(i<0?50:i):c==='pill'?60:INV_FILT.prop(c)?70:80};
  groups.sort((a,b)=>rank(a.c)-rank(b.c));
  /* the piece in use leads its group */
  groups.forEach(g=>{if(!SLOTS[g.c])return;const m=g.h.match(/^([\s\S]*?<div class="rows">)([\s\S]*)(<\/div><\/div>)$/);if(!m)return;
    const rows=m[2].split(/(?=<div class="rowb invrow)/);const k=rows.findIndex(r=>r.includes('class="pill eq"'));if(k>0){rows.unshift(rows.splice(k,1)[0]);g.h=m[1]+rows.join('')+m[3]}});
  return head+(fl==='all'||fl==='gear'?wornHTML(s):'')+chips+groups.map(g=>g.h).join('')}})();
if(typeof document!=='undefined')document.addEventListener('click',e=>{const t=e.target.closest('[data-ifilt]');if(!t||!SHEET||SHEET.kind!=='own')return;
  SHEET.ifilt=t.dataset.ifilt;SHEET.ipick=null;const b=$('veil').querySelector('.sh-body'),y=b?b.scrollTop:0;renderSheet();const b2=$('veil').querySelector('.sh-body');if(b2)b2.scrollTop=y});
/* an item card: quality, then its plain numbers, then its extra lines, one to a line */
cardText=function(d,ff){const keep=ff.filter(x=>!/one of this kind|同类只能用一件|used up when taken|用一次就没了|suits your style|not your style|any weapon serves|合你的路数|不合你的路数|什么兵器都一样用/.test(x));
  const w=x=>/class="gq/.test(x)?0:/class="gfx/.test(x)?2:1;const st=keep.sort((a,b)=>w(a)-w(b)).slice(0,4).map(x=>`<span class="cf">${x}</span>`).join('');
  const ds=d.lore||d.desc;return(st?`<span class="cstat">${st}</span>`:'')+(ds?`<span class="cdesc">${tr(ds)}</span>`:'')};
