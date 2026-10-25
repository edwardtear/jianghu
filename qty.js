/* 江湖一生 · buying and using several at once. Medicine, gear like smoke bombs, and hidden weapons can be bought in a
   chosen quantity; identical medicines in your belongings are shown as one stack that you can take one or several of. */
'use strict';
const stackable=d=>!!d&&(!!d.use||d.cat==='tool'||d.cat==='anqi');
const QTY_MAX=20;
function qtyOf(key){if(!SHEET)return 1;if(SHEET.qtyFor!==key){SHEET.qtyFor=key;SHEET.qty=1}return SHEET.qty||1}
function qtyHTML(n,max){const Z=zh();return`<span class="qty"><button class="chip" data-qty="-1"${n<=1?' disabled':''} aria-label="${Z?'少一个':'One less'}">−</button><b>${n}</b><button class="chip" data-qty="1"${n>=max?' disabled':''} aria-label="${Z?'多一个':'One more'}">＋</button><button class="chip" data-qty="max"${n>=max?' disabled':''}>${Z?'最多':'Max'}</button></span>`}

/* buy n: one line in the log, one small lift in mood (not n of them) */
function buyN(s,id,n){const d=itemDef(id);if(!d)return false;n=Math.max(1,Math.min(QTY_MAX,n|0));if(n===1)return buy(s,id);
  const E=s.log[s.log.length-1],i0=E?E.lines.length:0,m0=s.money,h0=s.happy;let k=0,r=true;
  for(;k<n;k++){r=buy(s,id);if(r!==true)break}
  if(!k)return r;
  if(E){const nz=d.n.zh,ne=d.n.en;E.lines=E.lines.slice(0,i0).concat(E.lines.slice(i0).filter(l=>!(l.t&&l.t.zh&&l.t.zh.startsWith('你花')&&l.t.zh.includes(nz))))}
  s.happy=Math.min(s.happy,clamp(h0+3,0,100));
  const spent=m0-s.money,unit=d.cat==='pill'?T('','颗'):T('','件');
  say(s,`You buy ${k} × ${d.n.en} for ${fmtMoney(spent)} taels.`,`你花${fmtMoney(spent)}两买下了${cnNum(k)}${unit.zh||'件'}${d.n.zh}。`);
  if(k<n)say(s,`You could only afford ${k}.`,`钱只够买${cnNum(k)}${unit.zh||'件'}。`,'muted');
  return true}
/* use n of the same thing: repeated lines are folded into one with a count */
function useN(s,id,n){n=Math.max(1,n|0);const E=s.log[s.log.length-1],i0=E?E.lines.length:0;let k=0;
  for(;k<n&&s.alive;k++){const i=s.items.findIndex(x=>x.id===id);if(i<0)break;useItem(s,i)}
  const E2=s.log[s.log.length-1];if(E2&&E2===E&&k>1){const add=E.lines.slice(i0),out=[];
    add.forEach(l=>{const p=out[out.length-1];if(p&&p.t&&l.t&&p.t.zh===l.t.zh&&p.c===l.c){p.n=(p.n||1)+1}else out.push(Object.assign({},l))});
    out.forEach(l=>{if(l.n>1){l.t=T(`${l.t.en} (×${l.n})`,`${l.t.zh}（×${l.n}）`);delete l.n}});
    E.lines=E.lines.slice(0,i0).concat(out)}
  return true}

/* the shop: a quantity picker under the details of anything you can stack */
(()=>{const s0=shopHTML;shopHTML=function(){let h=s0.apply(this,arguments);const s=S,pk=SHEET&&SHEET.pick,d=pk&&itemDef(pk);if(!d||!stackable(d))return h;
  const price=shopPrice(s,d),Z=zh(),max=Math.max(1,Math.min(QTY_MAX,Math.floor(s.money/Math.max(1,price))));let n=Math.min(qtyOf('buy:'+pk),max);SHEET.qty=n;
  const re=new RegExp(`<button class="btn main" data-buy="${pk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"([^>]*)>[^<]*</button>`);
  return h.replace(re,(m,attr)=>`${qtyHTML(n,max)}<button class="btn main" data-buyn="${pk}"${attr}>${Z?`买${cnNum(n)}${d.cat==='pill'?'颗':'件'} · ${num(price*n)}两`:`Buy ${n} for ${num(price*n)} taels`}</button>`)}})();

/* your belongings: identical medicine and gear stack into one card */
invHTML=function(){const s=S,L=u(),Z=zh(),pk=SHEET.ipick;if(!s.items.length)return`<p class="muted">${L.empty}</p>`;
  Object.keys(SLOTS).forEach(k=>eqItem(s,k));const worth=s.money+s.items.reduce((t,it)=>t+sellPrice(s,it),0);
  let h=`<p class="muted" style="margin:0 0 8px">${L.networth}: <b style="color:var(--ink)">${num(worth)}</b> ${L.taels}<br><span style="font-size:12.5px">${Z?'每一类装备各只能用一件，其余放着。同样的丹药会叠在一起。点一下看详情。':'You can use one item of each kind of gear at a time; the rest stay in storage. Identical medicines stack. Tap an item for details.'}</span></p>`;
  const by={},seen={};s.items.forEach((it,i)=>{const d=itemDef(it.id);if(!d)return;const st=stackable(d)&&d.cat!=='anqi';
    if(st&&seen[it.id]){seen[it.id].n++;return}const g={it,i,d,n:1};if(st)seen[it.id]=g;(by[d.cat]=by[d.cat]||[]).push(g)});
  Object.keys(L.cats).filter(c=>by[c]).concat(Object.keys(by).filter(c=>!L.cats[c])).forEach(cat=>{const cnt=by[cat].reduce((t,g)=>t+g.n,0);
    h+=`<div class="grp"><h4>${L.cats[cat]||cat} <span class="muted">(${cnt})</span></h4><div class="rows">${by[cat].map(({it,i,d,n})=>{const eq=!!(SLOTS[d.cat]&&it.eq),on=pk===i,ff=itemFacts(s,d);
      const card=`<div class="rowb invrow${on?' on':''}" data-ipick="${i}" title="${esc(tr(d.lore||d.desc||T('','')))}"><span class="main"><b>${tr(d.n)}${it.cnt!=null?` ×${it.cnt}`:n>1?` ×${n}`:''} ${eq?`<span class="pill eq">${L.equipped}</span>`:''}</b>${cardText(d,ff)}</span><span class="side" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${d.use?`<button class="chip" data-use="${i}">${L.use}</button>`:''}${SLOTS[d.cat]&&!eq?`<button class="chip" data-equip="${i}">${Z?'换上':'Equip'}</button>`:''}<button class="chip" data-sell="${i}">${L.sell(num(sellPrice(s,it)))}</button></span></div>`;
      if(!on)return card;
      let more='';if(d.use&&n>1&&s.alive){const q=Math.min(qtyOf('use:'+it.id),n);SHEET.qty=q;more=`<div class="sd-b">${qtyHTML(q,n)}<button class="btn main" data-usen="${it.id}"${s.queue.length?' disabled':''}>${Z?`服用${cnNum(q)}${d.cat==='pill'?'颗':'件'}`:`Take ${q}`}</button></div>`}
      return card+`<div class="shopdet">${(d.lore||d.desc)?`<p class="sd-desc">${tr(d.lore||d.desc)}</p>`:''}<ul class="sd-facts">${ff.map(x=>`<li>${x}</li>`).join('')}${n>1?`<li>${Z?`一共${cnNum(n)}${d.cat==='pill'?'颗':'件'}`:`${n} in all`}</li>`:''}${it.paid?`<li>${Z?`当初花了${num(it.paid)}两`:`you paid ${num(it.paid)} taels`}</li>`:''}</ul>${more}</div>`}).join('')}</div></div>`});
  return h};

if(typeof document!=='undefined')document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!SHEET||SHEET.kind!=='own')return;
  if(t.dataset.qty){const v=t.dataset.qty,cur=SHEET.qty||1;SHEET.qty=v==='max'?QTY_MAX:Math.max(1,cur+(+v));
    const b=$('veil').querySelector('.sh-body'),y=b?b.scrollTop:0;renderSheet();const b2=$('veil').querySelector('.sh-body');if(b2)b2.scrollTop=y;return}
  if(t.dataset.buyn){const id=t.dataset.buyn,n=SHEET.qty||1;act(()=>buyN(S,id,n));return}
  if(t.dataset.usen){const id=t.dataset.usen,n=SHEET.qty||1;act(()=>useN(S,id,n));return}});

/* labels and numbers for the two new gear slots (gear.js) */
['en','zh'].forEach(l=>{const c=U[l].cats,o={};const add={en:{boots:'Boots',bracer:'Bracers',attire:'Clothes & ornaments'},zh:{boots:'靴子',bracer:'护腕',attire:'衣饰'}}[l];
  Object.keys(c).forEach(k=>{o[k]=c[k];if(k==='armor')Object.assign(o,add)});U[l].cats=o});
(()=>{const f0=itemFacts;itemFacts=function(s,d){const f=f0(s,d),Z=zh(),at=f.findIndex(x=>/one of this kind|同类只能用一件/.test(x)),extra=[];
  if(d.dodge)extra.push(Z?`闪避+${Math.round(d.dodge*100)}%`:`+${Math.round(d.dodge*100)}% dodge`);if(d.crit)extra.push(Z?`会心+${Math.round(d.crit*100)}%`:`+${Math.round(d.crit*100)}% critical hits`);
  if(d.id==='poisonpearl'||d===ITEMS.poisonpearl)extra.push(Z?'打斗后六成的毒不会留在身上':'60% of poisonings after a fight do not take hold');
  if(d===ITEMS.coldjade)extra.push(Z?'抵御内劲+25%':'+25% resistance to inner force');
  if(d.lk)extra.push(Z?`容貌+${d.lk}（同一种只算一次，卖掉就没了）`:`+${d.lk} looks (each kind counts once; gone if sold)`);
  if(at>=0)f.splice(at,0,...extra);else f.push(...extra);return f}})();
