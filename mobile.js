/* 江湖一生 · phones: a slim status strip pinned at the top (tap it for the full status sheet), the decision and the
   chronicle straight after it, a compact header once a life has begun, and energy shown as numbers when dots won't fit */
'use strict';
const isPhone=()=>window.matchMedia('(max-width:620px)').matches;
function miniHTML(s){const Z=zh(),L=u();const pw=power(s);const q=s.alive?openQuests(s).length:0;
  const b=(lab,v,max,cls)=>`<span class="mb"><span class="ml">${lab}</span><span class="mt"><i class="${cls}" style="width:${Math.max(0,Math.min(100,Math.round(100*v/Math.max(1,max))))}%"></i></span></span>`;
  return`<button class="mini" id="b-mini" aria-label="${Z?'查看完整状态':'Open full status'}">
   <span class="mtop"><b>${Z?s.cn:esc(s.name)}</b><span>${Z?cnNum(Math.max(0,s.age))+'岁':Math.max(0,s.age)+' yrs'}</span><span class="mrealm">${Z?rname(s)[1]:rname(s)[2]}</span><span class="mmoney">${num(s.money)}${Z?'两':'t'}</span>${q?`<span class="mq">${Z?'未了':'tasks'} ${q}</span>`:''}<span class="mmore">${Z?'详情':'more'} ›</span></span>
   <span class="mbars">${b(L.health,s.health,s.maxHealth,'f-hp')}${b(L.joy,s.happy,100,'f-joy')}${b(L.power,pw,typeof REALM9!=='undefined'?(REALM9[r9Of(pw)+1]||[REALM_TOP])[0]:310,'f-pw')}</span></button>`}
function renderMini(){let m=document.getElementById('ministat');const ch=document.getElementById('chron');if(!ch)return;
  if(!m){m=document.createElement('div');m.id='ministat';ch.parentNode.insertBefore(m,ch)}
  if(!S||S.age<0){m.innerHTML='';return}m.innerHTML=miniHTML(S)}
(()=>{const u0=update;update=function(){const r=u0.apply(this,arguments);try{renderMini();document.body.classList.toggle('jh-play',!!S&&S.age>=1);document.body.classList.toggle('jh-grown',!!S&&S.age>=3)}catch(e){}return r}})();
/* the full status as a sheet on phones */
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='status'){$('veil').innerHTML=sheetFrame(zh()?'状态':'Status',`<div class="sidesheet">${sideHTML(S,false)}</div>`);return}rs()}})();
document.addEventListener('click',e=>{const t=e.target.closest('#b-mini');if(t){openSheet('status');return}
  const g=e.target.closest('[data-qgo]');if(g&&SHEET&&SHEET.kind==='status')closeSheet()},true);
/* energy as numbers when the dots would wrap */
(()=>{const rd=renderDock;renderDock=function(){rd.apply(this,arguments);const d=$('d-ap');if(d&&S&&S.alive&&S.apMax>6&&isPhone())d.textContent=`${S.ap}/${S.apMax}`}})();
window.addEventListener('resize',()=>{try{renderDock()}catch(e){}});
renderMini();
