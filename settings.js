/* 江湖一生 · one ⚙ Settings button in the top bar. The old top-bar chips (guide, slots, sound, feedback, account,
   new life, language) still exist but live in a hidden holder; the settings sheet lists them and taps them for you. */
'use strict';
function setChip(){const b=$('b-set');if(b)b.textContent=zh()?'⚙ 设置':'⚙ Settings'}
function setHTML(){const Z=zh(),c=typeof CLOUD!=='undefined'?CLOUD:null;
  const row=(id,ic,l,sub)=>`<button class="setrow" data-go="${id}"><span class="si">${ic}</span><span class="st"><b>${l}</b>${sub?`<small>${sub}</small>`:''}</span><span class="sa">›</span></button>`;
  const snd=typeof SND!=='undefined'&&(SND.on.music||SND.on.sfx);
  let h=`<div class="setlang"><span>${Z?'语言':'Language'}</span><div class="seg"><button class="chip" data-setlang="en" aria-pressed="${LANG==='en'}">EN</button><button class="chip" data-setlang="zh" aria-pressed="${LANG==='zh'}">中文</button></div></div>`;
  h+=row('b-guide','？',Z?'说明':'Guide',Z?'怎么玩，各项数值是什么意思':'How to play and what the numbers mean');
  if($('b-slot'))h+=row('b-slot','💾',Z?'存档':'Save slots',Z?`当前：存档${SLOT+1}`:`Current: slot ${SLOT+1}`);
  if($('b-snd'))h+=row('b-snd',snd?'🔊':'🔇',Z?'声音':'Sound',snd?(Z?'开着':'On'):(Z?'关着':'Off'));
  if(c&&c.on)h+=row('b-acct','☁',Z?'账号与云存档':'Account & cloud saves',c.user?(c.user.displayName||(c.user.email||'').split('@')[0]):(Z?'未登录':'Not signed in'));
  if(window.FIREBASE_CONFIG)h+=row('b-fb','✉',Z?'反馈':'Feedback',Z?'告诉我们哪里不对、想要什么':'Tell us what is wrong or what you want');
  h+=`<button class="setrow danger" data-setnew><span class="si">↻</span><span class="st"><b>${Z?'重新投胎':'New life'}</b><small>${S&&S.alive?(Z?'放弃这一世，重新开始（要按两次）':'Give up this life and start over (tap twice)'):(Z?'开始新的一世':'Start a new life')}</small></span></button>`;
  return h}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='set'){$('veil').innerHTML=sheetFrame(zh()?'设置':'Settings',setHTML());return}rs()}})();
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='b-set'){openSheet('set');return}
  if(t.dataset.setlang){applyLang(t.dataset.setlang);if(SHEET&&SHEET.kind==='set')renderSheet();return}
  if(t.dataset.go){const b=$(t.dataset.go);if(b)b.click();return}
  if(t.dataset.setnew!=null){if(!S.alive||t.dataset.sure){reborn();return}t.dataset.sure=1;t.querySelector('b').textContent=zh()?'真的要重新投胎？再按一次':'Really start over? Tap again';
    setTimeout(()=>{if(t.isConnected&&SHEET&&SHEET.kind==='set')renderSheet()},3000)}});
(()=>{const a0=applyLang;applyLang=function(){const r=a0.apply(this,arguments);try{setChip()}catch(e){}return r}})();
setChip();
