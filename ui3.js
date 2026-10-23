/* 江湖一生 · 江湖奇遇录: every story series, which endings you have found across all your lives, and where this life stands */
'use strict';
/* endings found are kept on this device (and in the cloud when signed in), not in the life */
function loreSync(){if(!S)return;let L=null;
  const get=()=>L||(L=store.get('jh4_lore',{}));
  if(S.loreNew&&S.loreNew.length){get();S.loreNew.forEach(([id,e])=>{if(!STORY[id])return;if(e==='lapsed'&&loreDup(id))e=loreDup(id);const x=L[id]=L[id]||{ends:{},met:0};x.ends[e]=(x.ends[e]||0)+1});S.loreNew=[]}
  if(S.story){S._loreMet=S._loreMet||[];for(const id in S.story)if(!S._loreMet.includes(id)){get();const x=L[id]=L[id]||{ends:{},met:0};x.met++;S._loreMet.push(id)}}
  if(L)store.set('jh4_lore',L)}
/* "lapsed" shares its name with another ending in some stories; count those as one */
const loreDup=id=>{const E=STORY[id].ends;return E.lapsed&&Object.keys(E).find(j=>j!=='lapsed'&&E[j].n.zh===E.lapsed.n.zh)};
const loreEnds=id=>Object.keys(STORY[id].ends).filter(k=>k!=='lapsed'||!loreDup(id));
function loreCount(){const L=store.get('jh4_lore',{});let got=0,all=0;STORY_ORDER.forEach(id=>loreEnds(id).forEach(k=>{all++;if(L[id]&&L[id].ends[k])got++}));return[got,all]}
function loreHTML(){const L=store.get('jh4_lore',{}),Z=zh(),[got,all]=loreCount();
  return`<p class="muted" style="margin-top:0;font-size:14px">${Z?`每一世只会遇到其中几段。你走过的结局会记在这里，转世也不会忘。已解锁结局 <b>${got}</b> / ${all}。`:`Each life meets only a few of these. Every ending you reach is kept here, across lives. Endings found: <b>${got}</b> / ${all}.`}</p>`+
   STORY_ORDER.map(id=>{const D=STORY[id],x=L[id]||{ends:{},met:0},r=S&&S.story&&S.story[id];
    const now=!r?'':r.st==='on'?`<span class="lore-now on">${Z?'这一世：进行中':'This life: in progress'}</span>`:`<span class="lore-now">${Z?'这一世：':'This life: '}${tr((D.ends[r.end]||{n:T('Unfinished','不了了之')}).n)}</span>`;
    const seen=x.met||r;
    return`<div class="lore${seen?'':' unseen'}"><div class="lore-h"><b>${tr(D.n)}</b>${now}</div>
     <p class="muted">${seen?tr(D.theme):(Z?'尚未遇到。':'Not yet met.')}</p>
     <ul class="lore-ends">${loreEnds(id).map(k=>{const E=D.ends[k],n=x.ends[k];return`<li class="${n?'t-'+E.tone:'locked'}">${n?tr(E.n)+(n>1?` <small>×${n}</small>`:''):'？？？'}</li>`}).join('')}</ul></div>`}).join('')}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='lore'){$('veil').innerHTML=sheetFrame(zh()?'江湖奇遇录':'Book of Encounters',loreHTML());return}rs()}})();
(()=>{const s0=sideHTML;sideHTML=function(s){const h=s0.apply(this,arguments);if(!s||s.age<10)return h;const[g,a]=loreCount();
  const b=`<button class="chip lorebtn" data-lore>📜 ${zh()?'江湖奇遇录':'Book of Encounters'} · ${g}/${a}</button>`;const i=h.indexOf('<details class="sec"');return i<0?h+b:h.slice(0,i)+b+h.slice(i)}})();
(()=>{const u0=update;update=function(){try{loreSync()}catch(e){}return u0.apply(this,arguments)}})();
document.addEventListener('click',e=>{if(e.target.closest('[data-lore]'))openSheet('lore')});
