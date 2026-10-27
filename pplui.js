/* 江湖一生 · a person's page: 相处 first, the big decisions after it, and everyday actions folded under 更多 */
'use strict';
(()=>{const ph=personHTML;personHTML=function(id){let h=ph(id);const s=S,p=person(s,id);if(!p||!p.alive)return h;
  const mk='<div class="rows" style="margin-top:12px">';{const k=h.indexOf(mk);if(k>=0&&typeof potHTML==='function'&&(p.rel==='disciple'||(p.age<30&&p.age>=8&&['acq','friend','godchild','child','nephew'].includes(p.rel))))h=h.slice(0,k)+potHTML(p)+h.slice(k)}
  const i=h.indexOf(mk);if(i<0)return h;const j=h.indexOf('</div>',i);if(j<0)return h;
  const inner=h.slice(i+mk.length,j),btns=inner.match(/<button[\s\S]*?<\/button>/g)||[];
  const idOf=b=>(b.match(/data-pa="([^"]+)"/)||[])[1];const main=btns.filter(b=>!PACT_MINOR.has(idOf(b))),minor=btns.filter(b=>PACT_MINOR.has(idOf(b)));
  const sub=(b,zhL,enL,zhS,enS)=>b.replace('class="rowb"','class="rowb hangbtn"').replace(/<b>([^<]*)<\/b>/,()=>`<b>${zh()?zhL:enL}</b><span class="muted" style="font-size:12.5px;display:block">${zh()?zhS:enS}</span>`);
  const hang=main.filter(b=>idOf(b)==='hang').map(b=>sub(b,'相处','Spend time together','聊聊天，或一起过一天，由不得你 · 不耗行动力，每季一次','A talk, or a day together: you will see · free, once a season'));
  const rest=main.filter(b=>idOf(b)!=='hang');
  const more=minor.length?`<details class="moreacts"${SHEET&&SHEET.moreOpen?' open':''}><summary>${zh()?`更多（${cnNum(minor.length)}）`:`More (${minor.length})`}</summary><div class="rows">${minor.join('')}</div></details>`:'';
  return h.slice(0,i)+mk+hang.join('')+rest.join('')+'</div>'+more+h.slice(j+6)}})();
document.addEventListener('toggle',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('moreacts')&&SHEET)SHEET.moreOpen=e.target.open},true);
