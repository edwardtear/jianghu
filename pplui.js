/* 江湖一生 · a person's page: 相处 first, the big decisions after it, and everyday actions folded under 更多 */
'use strict';
(()=>{const ph=personHTML;personHTML=function(id){let h=ph(id);const s=S,p=person(s,id);if(!p||!p.alive)return h;
  const mk='<div class="rows" style="margin-top:12px">',i=h.indexOf(mk);if(i<0)return h;const j=h.indexOf('</div>',i);if(j<0)return h;
  const inner=h.slice(i+mk.length,j),btns=inner.match(/<button[\s\S]*?<\/button>/g)||[];
  const idOf=b=>(b.match(/data-pa="([^"]+)"/)||[])[1];const main=btns.filter(b=>!PACT_MINOR.has(idOf(b))),minor=btns.filter(b=>PACT_MINOR.has(idOf(b)));
  const hang=main.filter(b=>idOf(b)==='hang').map(b=>b.replace('class="rowb"','class="rowb hangbtn"').replace(/<b>([^<]*)<\/b>/,(m,x)=>`<b>${x}</b><span class="muted" style="font-size:12.5px;display:block">${zh()?'一起过一段日子，发生什么由不得你':'Spend a while together and see what the day brings'}</span>`));
  const rest=main.filter(b=>idOf(b)!=='hang');
  const more=minor.length?`<details class="moreacts"${SHEET&&SHEET.moreOpen?' open':''}><summary>${zh()?`更多（${cnNum(minor.length)}）`:`More (${minor.length})`}</summary><div class="rows">${minor.join('')}</div></details>`:'';
  return h.slice(0,i)+mk+hang.join('')+rest.join('')+'</div>'+more+h.slice(j+6)}})();
document.addEventListener('toggle',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('moreacts')&&SHEET)SHEET.moreOpen=e.target.open},true);
