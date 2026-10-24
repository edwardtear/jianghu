/* 江湖一生 · 因果: on the tombstone, three to five moments where something you chose came back later. Built only from
   records the game kept at the time (memory records with rec.back, story records with picks and an ending); a moment
   with no record is never shown, so short lives may show fewer or none. */
'use strict';
function causesOf(s){const out=[],Z=zh();
  const where=reg=>{const R=REGIONS.find(x=>x.id===reg);return R?T(` in ${R.en}`,`在${R.cn}`):T('','')};
  /* someone came back */
  (s.mem||[]).forEach(r=>{if(!r.back||!r.back.length)return;const b=r.back[0],p=r.pid&&person(s,r.pid);
    const nm=p?T(p.n.py,p.n.cn):r.who&&r.who.n?T(r.who.n.py,r.who.n.cn):T('someone','某人');
    const w=where(r.reg);
    const cause=T(`At ${r.at}${w.en}: ${r.what.en}${r.chose&&r.chose.en?` You chose: “${r.chose.en}”.`:''}`,`${cnNum(r.at)}岁${w.zh}：${r.what.zh}${r.chose&&r.chose.zh?`你选择了「${r.chose.zh}」。`:''}`);
    const yrs=b.at-r.at;
    const eff=T(`${yrs>0?yrs+' years later':'The same year'}, ${nm.en} came back.${b.chose&&b.chose.en?` You chose: “${b.chose.en}”.`:''}${b.out&&b.out.en?' '+b.out.en:''}`,
      `${yrs>0?cnNum(yrs)+'年后':'同一年'}，${nm.zh}又找上门来。${b.chose&&b.chose.zh?`你选择了「${b.chose.zh}」。`:''}${b.out&&b.out.zh?b.out.zh:''}`);
    out.push({at:r.at,sc:3+(r.back.length>1?1:0)+(p&&['sworn','spouse','lover','enemy','disciple'].includes(p.rel)?1:0),cause,eff,effAt:b.at})});
  /* a story series that reached an ending */
  Object.entries(s.story||{}).forEach(([id,r])=>{const D=STORY[id];if(!D||!r.end)return;const E=D.ends[r.end];if(!E)return;
    const pk=r.picks||[],first=pk[0],last=pk.length>1?pk[pk.length-1]:null,w=where(r.reg);
    const cause=T(`At ${r.at}${w.en}, 【${D.n.en}】 began.${first&&first.chose&&first.chose.en?` You chose: “${first.chose.en}”.`:''}`,`${cnNum(r.at)}岁${w.zh}，【${D.n.zh}】开始了。${first&&first.chose&&first.chose.zh?`你选择了「${first.chose.zh}」。`:''}`);
    const end=r.done??r.at;
    const lc=last&&last.chose&&last.chose.zh?last:null,same=lc&&lc.at===end;
    const eff=T(`${lc?`At ${lc.at} you chose “${lc.chose.en}”${same?', and it ended':'. At '+end+' it ended'}`:`At ${end} it ended`}: ${E.n.en}.`,
      `${lc?`${cnNum(lc.at)}岁时你选择了「${lc.chose.zh}」，${same?'':cnNum(end)+'岁，'}`:`${cnNum(end)}岁，`}结局：${E.n.zh}。`);
    out.push({at:r.at,sc:2+(pk.length?1:0)+(E.tone==='bad'?.5:0),cause,eff,effAt:end,tone:E.tone})});
  return out.sort((a,b)=>b.sc-a.sc||a.at-b.at).slice(0,5).sort((a,b)=>a.at-b.at)}
function causesHTML(s){const cs=causesOf(s);if(!cs.length)return'';const Z=zh();
  return`<div class="causes"><h4>${Z?'前因后果':'Cause and effect'}</h4><ol>${cs.map(x=>`<li><p class="c-cause">${esc(tr(x.cause))}</p><p class="c-eff${x.tone==='bad'?' bad':''}">→ ${esc(tr(x.eff))}</p></li>`).join('')}</ol></div>`}
(()=>{const ep=epitaph;epitaph=function(s){const h=ep(s);let c='';try{c=causesHTML(s)}catch(e){c=''}if(!c)return h;
  const i=h.indexOf('<div class="grid3">');return i<0?h:h.slice(0,i)+c+h.slice(i)}})();
