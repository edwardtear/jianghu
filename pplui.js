/* 江湖一生 · a person's page: 相处 first, the big decisions after it, and everyday actions folded under 更多 */
'use strict';
(()=>{const ph=personHTML;personHTML=function(id){let h=ph(id);const s=S,p=person(s,id);if(!p||!p.alive)return h;
  const mk='<div class="rows" style="margin-top:12px">';{const k=h.indexOf(mk);if(k>=0&&typeof potHTML==='function'&&(p.rel==='disciple'||(p.age<30&&p.age>=8&&['acq','friend','godchild','child','nephew'].includes(p.rel))))h=h.slice(0,k)+potHTML(p)+h.slice(k)}
  const i=h.indexOf(mk);if(i<0)return h;const j=h.indexOf('</div>',i);if(j<0)return h;
  const inner=h.slice(i+mk.length,j),btns=inner.match(/<button[\s\S]*?<\/button>/g)||[];
  const idOf=b=>(b.match(/data-pa="([^"]+)"/)||[])[1];const main=btns.filter(b=>!PACT_MINOR.has(idOf(b))),minor=btns.filter(b=>PACT_MINOR.has(idOf(b)));
  const sub=(b,zhL,enL,zhS,enS)=>b.replace('class="rowb"','class="rowb hangbtn"').replace(/<b>([^<]*)<\/b>/,()=>`<b>${zh()?zhL:enL}</b><span class="muted" style="font-size:12.5px;display:block">${zh()?zhS:enS}</span>`);
  const talkB=main.filter(b=>idOf(b)==='chat').map(b=>sub(b,'坐下来聊聊','Sit and talk','聊什么你来定','You choose what to talk about'));
  const dayB=main.filter(b=>idOf(b)==='hang').map(b=>sub(b,'一起过一天','Spend the day together','发生什么由不得你','See what the day brings'));
  const hang=talkB.length||dayB.length?[`<div class="hangpair"><span class="hp-h">${zh()?'相处 · 不耗行动力，每季一次':'Time together · free, once a season'}</span>${talkB.join('')}${dayB.join('')}</div>`]:[];
  const rest=main.filter(b=>!['hang','chat'].includes(idOf(b)));
  const more=minor.length?`<details class="moreacts"${SHEET&&SHEET.moreOpen?' open':''}><summary>${zh()?`更多（${cnNum(minor.length)}）`:`More (${minor.length})`}</summary><div class="rows">${minor.join('')}</div></details>`:'';
  return h.slice(0,i)+mk+hang.join('')+rest.join('')+'</div>'+more+h.slice(j+6)}})();
document.addEventListener('toggle',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('moreacts')&&SHEET)SHEET.moreOpen=e.target.open},true);
