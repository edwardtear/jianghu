/* 江湖一生 · accounts, cloud saves and feedback. Uses Firebase (Google or email sign-in, Firestore). Does nothing until
   window.FIREBASE_CONFIG is set (see firebase-config.js), so the game still runs anywhere without it. */
'use strict';
const CLOUD={on:false,user:null,db:null,auth:null,timer:null,status:''};
const FB_V='10.12.2',FB_URL=n=>`https://cdn.jsdelivr.net/npm/firebase@${FB_V}/${n}-compat.js`;
const cz=()=>typeof zh==='function'&&zh();
const loadJS=src=>new Promise((ok,no)=>{const e=document.createElement('script');e.src=src;e.onload=ok;e.onerror=no;document.head.appendChild(e)});

/* ---------- top-bar buttons ---------- */
function cloudBar(){const nb=$('b-new');if(!nb)return;let fb=$('b-fb'),ac=$('b-acct');
  if(!fb){fb=document.createElement('button');fb.className='chip';fb.id='b-fb';nb.parentNode.insertBefore(fb,nb)}
  fb.textContent=cz()?'✉ 反馈':'✉ Feedback';fb.hidden=!window.FIREBASE_CONFIG;
  if(!ac){ac=document.createElement('button');ac.className='chip';ac.id='b-acct';nb.parentNode.insertBefore(ac,nb)}
  ac.hidden=!CLOUD.on;ac.textContent=CLOUD.user?('☁ '+(CLOUD.user.displayName||(CLOUD.user.email||'').split('@')[0]||(cz()?'已登录':'Signed in'))):(cz()?'登录':'Sign in')}

/* ---------- start Firebase ---------- */
async function cloudInit(){if(!window.FIREBASE_CONFIG)return;
  try{await loadJS(FB_URL('firebase-app'));await loadJS(FB_URL('firebase-auth'));await loadJS(FB_URL('firebase-firestore'))}catch(e){CLOUD.status='load';return}
  firebase.initializeApp(window.FIREBASE_CONFIG);CLOUD.auth=firebase.auth();CLOUD.db=firebase.firestore();CLOUD.on=true;cloudBar();
  CLOUD.auth.onAuthStateChanged(async u=>{CLOUD.user=u;cloudBar();if(u)await cloudPull();if(SHEET&&SHEET.kind==='acct')renderSheet()})}

/* ---------- saves: the newer of this device and the cloud wins, slot by slot ----------
   slot 1 lives in users/{uid} (as it always has, with the hall and the book); slots 2 and 3 in users/{uid}/slots/{n} */
const SL=typeof SLOT_N!=='undefined';
const localStamp=i=>+(localStorage.getItem(SL?slotStampKey(i):'jh4_upd')||0);
const slotDoc=i=>i?CLOUD.db.collection('users').doc(CLOUD.user.uid).collection('slots').doc(String(i)):CLOUD.db.collection('users').doc(CLOUD.user.uid);
function takeRemote(i,x){const sv=x.save?JSON.parse(x.save):null;const cur=!SL||i===SLOT;
  if(sv&&sv.v===4&&sv.log){if(cur){S=sv;lastLen=S.log.length}store.set(SL?slotKey(i):'jh4_save',sv)}else if(!cur)localStorage.removeItem(slotKey(i));
  localStorage.setItem(SL?slotStampKey(i):'jh4_upd',String(x.updated||0));return cur&&sv}
async function cloudPull(){const u=CLOUD.user;if(!u)return;let reload=false;
  try{const d=await slotDoc(0).get();const x=d.exists?d.data():null;
    if(x&&x.hall)store.set('jh4_hall',JSON.parse(x.hall));if(x&&x.lore)store.set('jh4_lore',JSON.parse(x.lore));
    if(x&&x.save&&(x.updated||0)>localStamp(0)){if(takeRemote(0,x))reload=true}else cloudPush(true,0)}catch(e){CLOUD.status='err'}
  if(SL)for(let i=1;i<SLOT_N;i++){try{const d=await slotDoc(i).get();const x=d.exists?d.data():null;
    if(x&&(x.updated||0)>localStamp(i)){if(takeRemote(i,x))reload=true}else if(store.get(slotKey(i),null))cloudPush(true,i)}catch(e){CLOUD.slotErr=1}}
  if(reload){closeSheet();update(false)}CLOUD.status=CLOUD.status==='err'?'err':'pulled'}
function cloudPush(now,slot){if(!CLOUD.user||!CLOUD.db)return;const i=slot??(SL?SLOT:0);
  const go=()=>{const t=Date.now();const sv=i===(SL?SLOT:0)?S:store.get(slotKey(i),null);try{localStorage.setItem(SL?slotStampKey(i):'jh4_upd',String(t))}catch(e){}
    const shared={hall:JSON.stringify(store.get('jh4_hall',[])),lore:JSON.stringify(store.get('jh4_lore',{}))};
    const mine={save:sv?JSON.stringify(sv):null,updated:t,name:sv?sv.cn||'':'',age:sv?sv.age||0:0};
    const w=i?Promise.all([slotDoc(i).set(mine),slotDoc(0).set(shared,{merge:true})]):slotDoc(0).set(Object.assign(mine,shared),{merge:true});
    w.then(()=>{CLOUD.status='saved'}).catch(()=>{if(i)CLOUD.slotErr=1;else CLOUD.status='err'})};
  if(now)go();else{clearTimeout(CLOUD.timer);CLOUD.timer=setTimeout(go,4000)}}
function cloudClearSlot(i){if(CLOUD.user&&CLOUD.db)cloudPush(true,i)}
(()=>{const u0=update;update=function(){const r=u0.apply(this,arguments);try{localStorage.setItem(SL?slotStampKey():'jh4_upd',String(Date.now()))}catch(e){}cloudPush(false);return r}})();

/* ---------- the account sheet ---------- */
function acctHTML(){const Z=cz(),u=CLOUD.user;
  if(u)return`<p>${Z?'已登录：':'Signed in as '}<b>${esc(u.displayName||u.email||'')}</b></p><p class="muted" style="font-size:14px">${Z?'你的人生进度和往生录会自动保存到云端，换手机、换电脑都能接着玩。':'Your current life and your hall of past lives are saved to the cloud automatically, so you can continue on any device.'}</p>
    <p class="muted" style="font-size:13px">${CLOUD.slotErr?(Z?'⚠ 存档2、3还没能同步到云端（需要更新数据库规则）。存档1正常。':'⚠ Slots 2 and 3 could not sync yet (the database rules need updating). Slot 1 is fine.'):CLOUD.status==='err'?(Z?'⚠ 最近一次同步失败，稍后会再试。':'⚠ The last sync failed; it will retry.'):CLOUD.status==='saved'||CLOUD.status==='pulled'?(Z?'✓ 已同步':'✓ Synced'):''}</p>
    <button class="btn" id="b-signout" style="margin-top:10px">${Z?'退出登录':'Sign out'}</button>`;
  return`<p class="muted" style="font-size:14px;margin-top:0">${Z?'登录后，进度会保存在云端，换设备也能接着玩。不登录也能照常玩，进度只存在这台设备上。':'Sign in to keep your progress in the cloud and play on any device. You can also play without an account; progress then stays on this device.'}</p>
   <button class="btn main" id="b-google" style="width:100%;margin:6px 0 14px">${Z?'用 Google 账号登录':'Continue with Google'}</button>
   <div class="grp"><h4>${Z?'或用邮箱':'Or with email'}</h4>
   <input id="in-email" type="email" placeholder="${Z?'邮箱':'Email'}" autocomplete="email" class="fin">
   <input id="in-pass" type="password" placeholder="${Z?'密码（至少6位）':'Password (6+ characters)'}" autocomplete="current-password" class="fin">
   <div style="display:flex;gap:8px;margin-top:8px"><button class="btn" id="b-esignin" style="flex:1">${Z?'登录':'Sign in'}</button><button class="btn" id="b-esignup" style="flex:1">${Z?'注册':'Create account'}</button></div>
   <button class="chip" id="b-reset" style="margin-top:10px">${Z?'忘记密码':'Forgot password'}</button>
   <p class="muted" id="acct-msg" style="font-size:13px;margin-top:8px"></p></div>`}
/* ---------- the feedback sheet ---------- */
function fbHTML(){const Z=cz();const k=SHEET.fbk||'idea';
  if(SHEET.sent)return`<p>${Z?'谢谢！你的留言已经送到。':'Thank you! Your message has been delivered.'}</p><button class="btn" data-close>${Z?'关闭':'Close'}</button>`;
  return`<p class="muted" style="font-size:14px;margin-top:0">${Z?'有 bug、建议，或者想合作？写在这里，作者会看到。':'Found a bug, have an idea, or want to collaborate? Write it here and the author will read it.'}</p>
   <div class="chips" style="margin-bottom:8px">${[['bug',Z?'问题/bug':'Bug'],['idea',Z?'建议':'Suggestion'],['collab',Z?'合作':'Collaboration'],['other',Z?'其他':'Other']].map(([v,l])=>`<button class="chip${k===v?' on':''}" data-fbk="${v}">${l}</button>`).join('')}</div>
   <textarea id="in-fb" class="fin" rows="6" maxlength="4000" placeholder="${Z?'想说的话……':'Your message…'}"></textarea>
   <input id="in-fbmail" type="email" class="fin" placeholder="${Z?'联系方式（选填，方便回复你）':'Your email (optional, so the author can reply)'}" value="${esc((CLOUD.user&&CLOUD.user.email)||'')}">
   <label style="display:flex;gap:6px;align-items:center;font-size:13px;margin-top:6px"><input type="checkbox" id="in-fblife" checked>${Z?'附上当前这一世的概况（帮助排查问题）':'Attach a summary of your current life (helps with bugs)'}</label>
   <button class="btn main" id="b-fbsend" style="width:100%;margin-top:10px">${Z?'发送':'Send'}</button><p class="muted" id="fb-msg" style="font-size:13px"></p>`}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='acct'){$('veil').innerHTML=sheetFrame(cz()?'账号':'Account',acctHTML());return}
  if(SHEET&&SHEET.kind==='fb'){$('veil').innerHTML=sheetFrame(cz()?'意见反馈':'Feedback',fbHTML());return}rs()}})();
const authErr=e=>{const c=(e&&e.code)||'',Z=cz();const m={'auth/invalid-email':['That email does not look right.','邮箱格式不对。'],'auth/wrong-password':['Wrong password.','密码不对。'],'auth/invalid-credential':['Wrong email or password.','邮箱或密码不对。'],'auth/user-not-found':['No account with that email.','没有这个邮箱的账号。'],'auth/email-already-in-use':['That email already has an account. Sign in instead.','这个邮箱已经注册过了，直接登录吧。'],'auth/weak-password':['Password needs at least 6 characters.','密码至少要6位。'],'auth/popup-closed-by-user':['Sign-in window closed.','登录窗口被关掉了。']}[c];return m?(Z?m[1]:m[0]):(Z?'出了点问题：':'Something went wrong: ')+c};
document.addEventListener('click',async e=>{const t=e.target.closest('button');if(!t)return;const msg=x=>{const m=$('acct-msg');if(m)m.textContent=x};
  if(t.id==='b-acct'){openSheet('acct');return}
  if(t.id==='b-fb'){openSheet('fb');return}
  if(t.id==='b-google'){try{await CLOUD.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}catch(err){if(err&&err.code==='auth/popup-blocked'){CLOUD.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}else msg(authErr(err))}return}
  if(t.id==='b-esignin'||t.id==='b-esignup'){const em=$('in-email').value.trim(),pw=$('in-pass').value;try{if(t.id==='b-esignup')await CLOUD.auth.createUserWithEmailAndPassword(em,pw);else await CLOUD.auth.signInWithEmailAndPassword(em,pw)}catch(err){msg(authErr(err))}return}
  if(t.id==='b-reset'){const em=$('in-email').value.trim();if(!em){msg(cz()?'先填上邮箱。':'Enter your email first.');return}try{await CLOUD.auth.sendPasswordResetEmail(em);msg(cz()?'重置密码的邮件已发出。':'A reset email is on its way.')}catch(err){msg(authErr(err))}return}
  if(t.id==='b-signout'){await CLOUD.auth.signOut();closeSheet();return}
  if(t.dataset.fbk){const v=$('in-fb')&&$('in-fb').value,m=$('in-fbmail')&&$('in-fbmail').value;SHEET.fbk=t.dataset.fbk;renderSheet();if($('in-fb'))$('in-fb').value=v||'';if($('in-fbmail')&&m!=null)$('in-fbmail').value=m;return}
  if(t.id==='b-fbsend'){const text=($('in-fb').value||'').trim(),fm=$('fb-msg');if(text.length<3){fm.textContent=cz()?'多写几个字吧。':'Please write a little more.';return}
    t.disabled=true;const life=$('in-fblife').checked&&S?`${S.cn} · ${S.gender} · age ${S.age} · ${S.region} · ${S.family} · sect ${S.sect||'-'} · power ${typeof power==='function'?power(S):''} · ${S.alive?'alive':'dead'}`:'';
    try{await CLOUD.db.collection('feedback').add({type:SHEET.fbk||'idea',text:text.slice(0,4000),contact:($('in-fbmail').value||'').trim().slice(0,200),life,lang:cz()?'zh':'en',uid:CLOUD.user?CLOUD.user.uid:null,ua:navigator.userAgent.slice(0,200),at:firebase.firestore.FieldValue.serverTimestamp()});SHEET.sent=1;renderSheet()}
    catch(err){t.disabled=false;fm.textContent=(cz()?'发送失败，请稍后再试。':'Could not send; please try again later.')}}});
/* keep the buttons in the current language */
(()=>{const a0=typeof applyLang==='function'?applyLang:null;if(!a0)return;applyLang=function(){const r=a0.apply(this,arguments);cloudBar();return r}})();
cloudBar();cloudInit();
