/* 江湖一生 · every decision card carries a title (the story it belongs to, the fight it leads to, or the gist of what
   is happening), and when a season brings more than one decision, the card lists all of them first, so you can see
   what this season holds before you start on it. */
'use strict';
function qGist(t,zhx){const s=(t||'').replace(/^【[^】]*】/,'').trim();if(zhx){const m=s.split(/[，。：！？；]/)[0]||s;return m.length>14?m.slice(0,12)+'…':m}
  const m=s.split(/[,.:;!?]/)[0]||s;return m.length>42?m.slice(0,40).replace(/\s+\S*$/,'')+'…':m}
function qTitle(q){if(!q)return null;const inc=q.src==='inc'?INC_BY[q.id]:null;
  if(inc&&(inc.story||inc.sopen)&&typeof STORY!=='undefined'){const st=STORY[inc.story||inc.sopen];if(st&&st.n)return st.n}
  if(inc&&inc.title)return typeof inc.title==='function'?inc.title(q.c):inc.title;
  if(q.c){for(const k in q.c){if(/^f\d+$/.test(k)&&q.c[k]&&q.c[k].title)return q.c[k].title}}
  if(q.id==='kl_mercy')return T('Kill or spare','生死一念');if(q.id==='ms_teach')return T('Your master teaches','师父传艺');if(q.id==='org_pick')return T('Which house?','哪一家？');
  if(q.src==='act'&&ACT_BY[q.id]&&ACT_BY[q.id].n)return ACT_BY[q.id].n;
  const t=q.text;if(!t)return null;return T(qGist(t.en,false),qGist(t.zh,true))}
(()=>{const rc=renderChron;renderChron=function(){rc.apply(this,arguments);const s=S,q=s&&s.alive&&s.queue[0];if(!q)return;
  const box=$('chron').querySelector(':scope>.choices.card:not(.outcome)');if(!box||box.querySelector('.qtitle'))return;const head=box.querySelector('.qhead');if(!head)return;
  const tt=qTitle(q),Z=zh();let h=tt?`<div class="qtitle">${esc(tr(tt))}</div>`:'';
  if(s.queue.length>1){const items=s.queue.map((x,i)=>{const t=qTitle(x);return`<li class="${i===0?'now':''}">${t?esc(tr(t)):(Z?'一件事':'Something')}${i===0?(Z?' <span class="muted">（眼前）</span>':' <span class="muted">(now)</span>'):''}</li>`}).join('');
    h+=`<div class="qagenda"><span class="lbl">${Z?`这一季待决的事（${cnNum(s.queue.length)}）`:`Waiting this season (${s.queue.length})`}</span><ol>${items}</ol></div>`}
  head.insertAdjacentHTML('afterend',h)}})();
