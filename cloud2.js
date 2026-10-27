/* 江湖一生 · a second, sturdier home for save slots 2 and 3. Besides their own records (users/{uid}/slots/{n}), each is
   also kept compressed inside the main account record (users/{uid}, fields bk1 and bk2), which slot 1 already proves
   can be written. Reading takes whichever copy is newer. The 存档 sheet gets two buttons: upload everything now, and
   read everything from the cloud now, each reporting what happened slot by slot. */
'use strict';
async function zpack(str){if(typeof CompressionStream==='undefined')return'r:'+str;
  const buf=new Uint8Array(await new Response(new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
  let bin='';for(let i=0;i<buf.length;i+=0x8000)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000));return'z:'+btoa(bin)}
async function zunpack(v){if(!v)return null;if(v.startsWith('r:'))return v.slice(2);const bin=atob(v.slice(2)),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'))).text()}
const slotSv=i=>i===(SL?SLOT:0)?S:store.get(slotKey(i),null);
/* the backup copy of one slot, written into the main record */
async function cloudBackup(i){if(!i||!CLOUD.user||!CLOUD.db||!CLOUD.ready)return false;const sv=slotSv(i);
  try{const z=sv?await zpack(JSON.stringify(sv)):null;await slotDoc(0).set({['bk'+i]:{z,updated:localStamp(i)||Date.now(),name:sv?sv.cn||'':'',age:sv?sv.age||0:0}},{merge:true});CLOUD.bkOk=1;return true}
  catch(e){CLOUD.bkErr=String(e&&e.message||e);return false}}
(()=>{const p0=cloudPush;cloudPush=function(now,slot,sharedOnly){p0.apply(this,arguments);if(sharedOnly||!CLOUD.user||!CLOUD.ready)return;const i=slot??(SL?SLOT:0);if(!i)return;
  clearTimeout(CLOUD['bkT'+i]);CLOUD['bkT'+i]=setTimeout(()=>cloudBackup(i),now?50:4500)}})();
/* after the usual read, look at the backups: take one that is newer than what this device has */
async function cloudReadBackups(force){const out=[];if(!CLOUD.user||!CLOUD.db)return out;let d;try{d=(await slotDoc(0).get()).data()||{}}catch(e){return[[0,'err']]}
  let reload=false;
  for(let i=1;i<(SL?SLOT_N:1);i++){const b=d['bk'+i];if(!b||!b.z){out.push([i,'none']);continue}
    let sv=null;try{sv=JSON.parse(await zunpack(b.z))}catch(e){out.push([i,'bad']);continue}if(!okSave(sv)){out.push([i,'none']);continue}
    const loc=localSave(i);
    if(loc&&lifeId(loc)===lifeId(sv)&&localStamp(i)>=(b.updated||0)&&!force){out.push([i,'same']);continue}
    if(loc&&lifeId(loc)===lifeId(sv)&&loc.age>sv.age&&force){out.push([i,'newer-here']);continue}
    if(loc&&lifeId(loc)!==lifeId(sv)&&loc.age>=1)setAside(loc);
    if(takeRemote(i,{save:JSON.stringify(sv),updated:b.updated}))reload=true;out.push([i,'took'])}
  if(reload){closeSheet();update(false)}return out}
(()=>{const p0=cloudPull;cloudPull=async function(){const r=await p0.apply(this,arguments);try{if(CLOUD.user&&CLOUD.ready)await cloudReadBackups(false)}catch(e){}return r}})();
/* the two buttons */
async function cloudUploadAll(){const Z=cz(),lines=[];if(!CLOUD.user)return[Z?'请先登录。':'Sign in first.'];if(!CLOUD.ready)await cloudPull();
  for(let i=0;i<(SL?SLOT_N:1);i++){const sv=slotSv(i);if(!okSave(sv)){lines.push(Z?`存档${i+1}：空，跳过`:`Slot ${i+1}: empty, skipped`);continue}
    try{localStorage.setItem(SL?slotStampKey(i):'jh4_upd',String(Date.now()))}catch(e){}
    let main=false,bk=true;try{const mine={save:JSON.stringify(sv),updated:localStamp(i),name:sv.cn||'',age:sv.age||0};if(i)await slotDoc(i).set(mine);else await slotDoc(0).set(mine,{merge:true});main=true}catch(e){main=false}
    if(i)bk=await cloudBackup(i);
    lines.push(Z?`存档${i+1}（${sv.cn}，${cnNum(Math.max(0,sv.age))}岁）：${main?'已上传':bk?'已上传（经备份通道）':'上传失败'}`:`Slot ${i+1} (${sv.name}, age ${sv.age}): ${main?'uploaded':bk?'uploaded (via backup)':'failed'}`)}
  return lines}
async function cloudDownloadAll(){const Z=cz();if(!CLOUD.user)return[Z?'请先登录。':'Sign in first.'];await cloudPull();const r=await cloudReadBackups(true);
  const name={took:Z?'已从云端读取':'loaded from the cloud',same:Z?'和云端一致':'already the same as the cloud','newer-here':Z?'这台设备上的更新，保留':'newer on this device, kept',none:Z?'云端没有备份':'no backup in the cloud',bad:Z?'云端备份损坏':'cloud backup damaged',err:Z?'读取失败':'could not read'};
  return r.map(([i,k])=>i?(Z?`存档${i+1}：${name[k]}`:`Slot ${i+1}: ${name[k]}`):name[k]).concat([Z?'存档1随登录自动同步。':'Slot 1 syncs on sign-in.'])}
addEventListener('load',()=>{if(typeof slotsHTML!=='function')return;const sh=slotsHTML;slotsHTML=function(){let h=sh();if(!CLOUD.user)return h;const Z=cz();
  return`<div class="grp cloudbox"><h4>${Z?'云端存档':'Cloud saves'}</h4><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn main" id="b-cup">${Z?'☁ 上传到云端':'☁ Upload to cloud'}</button><button class="btn" id="b-cdown">${Z?'☁ 从云端读取':'☁ Load from cloud'}</button></div>
   <p class="muted" style="font-size:12.5px;margin:6px 0 0">${Z?'换设备前先在旧设备上「上传」，到新设备上「读取」。读取时如果两边是不同的人生，这台设备上的会另存起来，不会丢。':'Before switching devices, Upload on the old one, then Load on the new one. If the two hold different lives, the one on this device is set aside, not lost.'}</p>
   <div id="cloud-msg" class="muted" style="font-size:13px;margin-top:6px">${(SHEET&&SHEET.cmsg)||''}</div></div>`+h}});
document.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t||!['b-cup','b-cdown'].includes(t.id))return;const Z=cz();
  t.disabled=true;const m=$('cloud-msg');if(m)m.textContent=Z?'处理中……':'Working…';
  let lines;try{lines=t.id==='b-cup'?await cloudUploadAll():await cloudDownloadAll()}catch(err){lines=[(Z?'出错了：':'Error: ')+(err&&err.message||err)]}
  if(SHEET){SHEET.cmsg=lines.map(x=>esc(x)).join('<br>');if(SHEET.kind==='slots')renderSheet();else openSheet('slots')}});
