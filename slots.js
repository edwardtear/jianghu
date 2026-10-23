/* 江湖一生 · three save slots: three lives side by side, switch between them any time. The hall of past lives and the
   江湖奇遇录 are shared by all three. Slot 1 is the original save, so an existing life carries over untouched. */
'use strict';
function slotSave(i){const sv=i===SLOT?S:store.get(slotKey(i),null);return sv&&sv.v===4&&sv.log?sv:null}
function slotCard(i){const Z=zh(),sv=slotSave(i),cur=i===SLOT,n=Z?`存档 ${i+1}`:`Slot ${i+1}`;
  if(!sv||sv.age<0)return`<div class="slot${cur?' cur':''}"><div class="slot-h"><b>${n}</b>${cur?`<span class="muted">${Z?'当前':'current'}</span>`:''}</div><p class="muted">${Z?'空。一段还没开始的人生。':'Empty. A life not yet begun.'}</p>
    <button class="btn${cur?'':' main'}" data-slot="${i}">${cur?(Z?'正在这里':'You are here'):(Z?'在这里开始新的一世':'Start a new life here')}</button></div>`;
  const reg=REGIONS.find(r=>r.id===sv.region),pl=typeof placeName==='function'?placeName(sv):T(reg.en,reg.cn),rn=rname(sv);
  const who=Z?`${sv.cn} · ${sv.gender==='f'?'女':'男'} · ${sv.alive?cnNum(Math.max(0,sv.age))+'岁':'已故，享年'+cnNum(sv.age)+'岁'}`:`${esc(sv.name)} · ${sv.gender==='f'?'female':'male'} · ${sv.alive?'age '+Math.max(0,sv.age):'died at '+sv.age}`;
  return`<div class="slot${cur?' cur':''}"><div class="slot-h"><b>${n}</b>${cur?`<span class="muted">${Z?'当前':'current'}</span>`:''}</div>
   <p class="slot-who">${who}</p><p class="muted">${Z?rn[1]:rn[2]} · ${tr(pl)}${sv.sect&&SECTS[sv.sect]?' · '+tr(T(SECTS[sv.sect].en,SECTS[sv.sect].cn)):''}</p>
   <div class="slot-b"><button class="btn${cur?'':' main'}" data-slot="${i}">${cur?(Z?'正在这里':'You are here'):(Z?'切换到这一世':'Switch to this life')}</button>${cur?'':`<button class="chip" data-slotdel="${i}">${Z?'清空':'Clear'}</button>`}</div></div>`}
function slotsHTML(){const Z=zh();return`<p class="muted" style="margin-top:0;font-size:14px">${Z?'三个存档，三段人生，随时切换。往生录和江湖奇遇录三个存档共用。':'Three slots, three lives; switch any time. The hall of past lives and the Book of Encounters are shared by all three.'}${typeof CLOUD!=='undefined'&&CLOUD.user?(Z?'已登录，三个存档都会同步到云端。':' Signed in: all three slots are saved to the cloud.'):''}</p>`+[0,1,2].map(slotCard).join('')}
function switchSlot(i){if(i===SLOT){closeSheet();return}
  try{store.set(slotKey(),S)}catch(e){}const sv=store.get(slotKey(i),null);SLOT=i;try{localStorage.setItem('jh4_slot',String(i))}catch(e){}closeSheet();SHOW.length=0;try{closeBattle()}catch(e){}
  if(sv&&sv.v===4&&sv.log&&sv.age>=0){S=sv;lastLen=S.log.length;update(false)}else{lastLen=0;S=newLife();update(false);if(typeof openSetup==='function')openSetup();else openSheet('birth')}
  slotChip();window.scrollTo({top:0})}
function clearSlot(i){if(i===SLOT)return;try{localStorage.removeItem(slotKey(i));localStorage.setItem(slotStampKey(i),String(Date.now()))}catch(e){}
  if(typeof cloudClearSlot==='function')cloudClearSlot(i);renderSheet()}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='slots'){$('veil').innerHTML=sheetFrame(zh()?'存档':'Save slots',slotsHTML());return}rs()}})();
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='b-slot'){openSheet('slots');return}
  if(t.dataset.slot!=null){switchSlot(+t.dataset.slot);return}
  if(t.dataset.slotdel!=null){if(t.dataset.sure){clearSlot(+t.dataset.slotdel);return}t.dataset.sure=1;t.textContent=zh()?'确定清空？':'Really clear?';setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent=zh()?'清空':'Clear'}},3000)}});
function slotChip(){const nb=$('b-new');if(!nb)return;let b=$('b-slot');
  if(!b){b=document.createElement('button');b.className='chip';b.id='b-slot';const fb=$('b-fb');nb.parentNode.insertBefore(b,fb||nb)}
  b.textContent=zh()?`💾 存档${SLOT+1}`:`💾 Slot ${SLOT+1}`}
(()=>{const a0=applyLang;applyLang=function(){const r=a0.apply(this,arguments);try{slotChip()}catch(e){}return r}})();
slotChip();
