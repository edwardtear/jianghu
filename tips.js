/* 江湖一生 · tap any label in the status panel to see what it means, so the guide is only needed for the full picture.
   The guide itself moves to the top bar; the dock's first tab now opens the status sheet. */
'use strict';
const TIP_EXTRA={
  zh:{'身份':'你现在过的是什么日子：务农、做工、读书、当差、行走江湖……会随你的选择改变。','门派':'你所属的门派和身份。门派之间有交好、有宿怨，会牵动你遇到的人和事。门派贡献可用来晋升。',
    '家室':'婚姻与子女。成家后心情更稳；儿女长大后可以继承你的衣钵（传承）。','病痛':'正在害的病。不治会一年年耗掉气血，可以找大夫或名医。','官府':'官府追捕你的力度（通缉）。每年都有可能被捕快找上门。',
    '抗打':'你能挨多少打。来自气血上限，再加护甲。','年景':'今年的收成、世道和米价。荒年米贵，乱世路上多劫匪。'},
  en:{'status':'What your days are spent on: farming, labour, study, office, the jianghu… It changes with your choices.','sect':'Your sect and your place in it. Sects have friends and feuds, which shape who you meet. Sect merit gets you promoted.',
    'family':'Marriage and children. A family steadies your mood; grown children can carry on your line after you die.','illness':'An illness you have now. Untreated, it wears down your health each year; see a doctor or a famous physician.','the law':'How hard the law is hunting you. Constables may come for you any year.',
    'Toughness':'How much punishment you can take. Comes from your maximum health, plus armour.'}};
const tipKey=x=>String(x||'').replace(/[（(][^）)]*[）)]/g,'').replace(/[★●ⓘ]/g,'').trim().toLowerCase();
function tipMap(){const M={},G=GUIDE[LANG]||GUIDE.en;
  Object.values(G).forEach(v=>{if(Array.isArray(v))v[1].forEach(([n,d])=>{M[tipKey(n)]=M[tipKey(n)]||d;const m=n.match(/[（(]([^）)]+)[）)]/);if(m)M[tipKey(m[1])]=M[tipKey(m[1])]||d})});
  Object.entries(TIP_EXTRA[LANG]||{}).forEach(([n,d])=>M[tipKey(n)]=M[tipKey(n)]||d);
  const L=u();[['health','Health','气血'],['joy','Happiness','心情'],['smarts','Smarts','学识'],['looks','Looks','容貌'],['power','Martial power','功力'],['silver','Silver','银两']].forEach(([k,en,cn])=>{const d=M[tipKey(zh()?cn:en)];if(d&&L[k])M[tipKey(L[k])]=d});
  if(L.dt){M[tipKey(L.dt.align)]=M[tipKey(L.dt.align)]||M[tipKey(zh()?'正邪':'Alignment')];M[tipKey(L.dt.fame)]=M[tipKey(L.dt.fame)]||M[tipKey(zh()?'名望':'Fame')];M[tipKey(L.dt.arts)]=M[tipKey(L.dt.arts)]||M[tipKey(zh()?'武学':'Arts')]}
  return M}
/* mark every label we can explain */
function markTips(html){const M=tipMap(),t=document.createElement('template');t.innerHTML=html;
  t.content.querySelectorAll('.bar .row>span:first-child,.money .lbl,.tal .t>span,dl.st dt,.attr4>div>span,.fightbox [title]>span:first-child,.realm .cn').forEach(e=>{
    const host=e.closest('[title]');const name=e.classList.contains('cn')&&e.closest('.realm')?(zh()?'境界':'Realm'):e.textContent;
    if(/^\s*·/.test(name))return;const d=(host&&host.getAttribute('title'))||M[tipKey(name)];if(!d)return;e.classList.add('tip');e.dataset.tipN=String(name).trim();e.dataset.tip=d});
  return t.innerHTML}
(()=>{const s0=sideHTML;sideHTML=function(){const h=s0.apply(this,arguments);try{return markTips(h)}catch(e){return h}}})();
function hideTip(){const c=document.getElementById('tipcard');if(c)c.remove()}
document.addEventListener('click',e=>{const t=e.target.closest('.tip');const open=document.getElementById('tipcard');
  if(!t){if(open&&!e.target.closest('#tipcard'))hideTip();else if(e.target.closest('#tipcard [data-guide]'))hideTip();return}
  e.preventDefault();e.stopPropagation();const same=open&&open.dataset.for===t.dataset.tipN;hideTip();if(same)return;
  const c=document.createElement('div');c.id='tipcard';c.dataset.for=t.dataset.tipN;c.setAttribute('role','tooltip');
  c.innerHTML=`<b>${esc(t.dataset.tipN)}</b><p>${esc(t.dataset.tip)}</p><button class="info" data-guide>ⓘ ${zh()?'完整说明':'Full guide'}</button>`;
  document.body.appendChild(c);tipAt=Date.now();const r=t.getBoundingClientRect(),vw=Math.min(innerWidth,document.documentElement.clientWidth||innerWidth);
  /* phones: span the screen with a margin; wider screens: a 300px card near the label, kept on screen */
  if(vw<620){c.style.left='12px';c.style.right='12px'}else{const w=300;c.style.width=w+'px';c.style.left=Math.max(12,Math.min(vw-w-12,r.left))+'px'}const below=r.bottom+8,h=c.offsetHeight;
  c.style.top=(below+h<innerHeight-8?below:Math.max(8,r.top-h-8))+'px'},true);
let tipAt=0;addEventListener('scroll',()=>{if(Date.now()-tipAt>400)hideTip()},true);addEventListener('resize',hideTip);
/* the guide lives in the top bar now */
function guideChip(){const nb=$('b-new');if(!nb)return;let g=$('b-guide');
  if(!g){g=document.createElement('button');g.className='chip';g.id='b-guide';g.onclick=()=>{hideTip();openSheet('guide')};const fb=$('b-fb');nb.parentNode.insertBefore(g,fb||nb)}
  g.textContent=zh()?'？说明':'? Guide'}
(()=>{const a0=applyLang;applyLang=function(){const r=a0.apply(this,arguments);try{guideChip()}catch(e){}return r}})();
(()=>{const c0=closeSheet;closeSheet=function(){hideTip();return c0.apply(this,arguments)}})();
guideChip();
