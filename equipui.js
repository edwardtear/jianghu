/* 江湖一生 · how a rolled piece of gear reads: its quality, its own numbers and its extra lines; and in the shop, a note
   that what you buy comes out of the forge differently every time. */
'use strict';
(()=>{const f0=itemFacts;itemFacts=function(s,d){const f=f0(s,d),Z=zh();if(!d)return f;
  if(d.q!=null){const G=GRADES[d.q];f.unshift(`<span class="gq ${G.c}">${Z?'品质：':'Quality: '}${tr(G.n)}</span>`);
    Object.entries(d.fx||{}).forEach(([k,v])=>{const A=AFX[k];if(A)f.splice(1,0,`<span class="gfx">【${tr(A.n)}】${A.t(v,Z)}</span>`)})}
  else if(ROLL_CATS.has(d.cat)&&SHEET&&SHEET.kind==='own'&&SHEET.tab!=='inv')f.push(Z?'买到手的品质随机：粗制到神品，数值上下浮动，好的还带词条':'Quality is rolled when you buy: crude to peerless, numbers vary, better pieces carry extra lines');
  return f}})();
['en','zh'].forEach(l=>{const c=U[l].cats;if(c&&!c.head)c.head=l==='zh'?'头饰':'Headgear'});
