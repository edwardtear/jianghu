/* 江湖一生 · the 武学 sheet: every art you know with its level and progress, and which ones you take into a fight */
'use strict';
const TIER_NM=[T('Common','寻常武学'),T('Intermediate','中乘武学'),T('Advanced','上乘武学'),T('Supreme','绝世武学')];
function artsSheetHTML(){const s=S,Z=zh(),n=artSlots(s),use=combatArts(s),auto=!Array.isArray(s.loadout);
  const arts=(s.arts||[]).slice().sort((a,b)=>(use.includes(b)-use.includes(a))||((b.tier||0)-(a.tier||0))||(artLv(b)-artLv(a)));
  if(!arts.length)return`<p class="muted">${Z?'还没学会任何武功。':'You have not learned any arts yet.'}</p>`;
  let h=`<p class="muted" style="margin:0 0 8px;font-size:14px">${Z?`出战武学 <b style="color:var(--ink)">${use.length} / ${n}</b>。境界越高，能带进战斗的武学越多。只有出战的武学会在练功和打斗中长进；没出战的照样算进功力。`:`Fighting arts: <b style="color:var(--ink)">${use.length} / ${n}</b>. Higher realms let you bring more. Only fighting arts improve from training and fights; the rest still count toward your power.`}</p>`;
  h+=`<p class="muted" style="margin:0 0 10px;font-size:13px">${auto?(Z?'现在是自动：总用最强的几门。点「出战」或「撤下」就改成你自己挑。':'Currently automatic: your strongest arts are used. Tap Fight or Bench to choose yourself.'):(Z?'由你挑选。':'Chosen by you.')} ${auto?'':`<button class="chip" data-artauto>${Z?'改回自动':'Back to automatic'}</button>`}</p><div class="rows">`;
  h+=arts.map(a=>{const lv=artLv(a),on=use.includes(a),need=artNeed(a),pct=lv>=10?100:Math.round((a.xp||0)/need*100);
    const fit=a.sect&&a.sect===s.sect,sk=a.sk&&SK[a.sk];
    const btn=!a.sk?'':on?`<button class="chip on" data-artoff="${esc(a.cn)}">${Z?'出战中 · 撤下':'Fighting · bench'}</button>`:`<button class="chip" data-arton="${esc(a.cn)}"${use.length>=n?' disabled':''}>${Z?'出战':'Fight'}</button>`;
    return`<div class="rowb artrow${on?' on':''}" style="cursor:default"><span class="main"><b>${artName(a)} <span class="pill">${tr(ART_LV[lv])}</span></b>
      <span>${tr(TIER_NM[a.tier||0])}${sk?' · '+(Z?'招式：':'technique: ')+tr(sk.n):''}${fit?(Z?' · 本门武学，练得更快':' · your sect’s art, learns faster'):''}</span>
      ${sk&&SKD[a.sk]?`<span class="muted" style="font-size:12.5px">${tr(SKD[a.sk])}</span>`:''}
      <span class="artbar" title="${pct}%"><i style="width:${pct}%"></i></span><span class="muted" style="font-size:12px">${lv>=10?(Z?'已臻十成火候，登峰造极':'Fully mastered'):(Z?`距下一成 ${pct}%`:`${pct}% to the next level`)}</span></span>
      <span class="side">${btn}</span></div>`}).join('')+'</div>';
  h+=`<p class="muted" style="margin-top:10px;font-size:12.5px">${Z?`长进快慢看根骨（${s.t.root}）和悟性（${s.t.wit}），本门武学快三成，品阶越高越慢。`:`How fast you improve depends on Bones (${s.t.root}) and Insight (${s.t.wit}); your own sect’s arts are 30% faster; higher tiers are slower.`}</p>`;
  return h}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='arts'){$('veil').innerHTML=sheetFrame(zh()?'武学':'Martial arts',artsSheetHTML());return}rs()}})();
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!S)return;
  if(t.dataset.artsheet!=null){openSheet('arts');return}
  if(!SHEET||SHEET.kind!=='arts')return;
  const keep=()=>{const b=$('veil').querySelector('.sh-body'),y=b?b.scrollTop:0;store.set(slotKey(),S);renderSheet();update(false);const b2=$('veil').querySelector('.sh-body');if(b2)b2.scrollTop=y};
  if(t.dataset.arton){if(!Array.isArray(S.loadout))S.loadout=combatArts(S).map(a=>a.cn);if(S.loadout.length<artSlots(S)&&!S.loadout.includes(t.dataset.arton))S.loadout.push(t.dataset.arton);keep();return}
  if(t.dataset.artoff){if(!Array.isArray(S.loadout))S.loadout=combatArts(S).map(a=>a.cn);S.loadout=S.loadout.filter(x=>x!==t.dataset.artoff);keep();return}
  if(t.dataset.artauto!=null){delete S.loadout;keep();return}});
/* a way in: from the fighting stats and from the list of arts */
(()=>{const f0=fightHTML;fightHTML=function(s){const h=f0.apply(this,arguments);if(!h||!s.arts||!s.arts.length)return h;
  const i=h.indexOf('<div class="ftech">');const b=`<button class="chip artbtn" data-artsheet>${zh()?`⚔ 武学与出战（${combatArts(s).length}/${artSlots(s)}）`:`⚔ Arts & loadout (${combatArts(s).length}/${artSlots(s)})`}</button>`;
  return i<0?h+b:h.slice(0,i)+b+h.slice(i)}})();
