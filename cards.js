/* 江湖一生 · decision cards: every decision shows as a card with a tag (what kind of matter it is), when it happens,
   and an ink-wash scene drawn here in SVG (original, no image files). Picking an answer takes two taps: choose, then
   confirm, so a stray tap on a phone never decides a life. */
'use strict';
/* ---------- what kind of matter, and where it happens ---------- */
const CARD_TAG={season:T('Seasonal','时令'),nem:T('Nemesis','宿敌'),sectwar:T('Sect affairs','门派风云'),big:T('Great events','江湖大事'),
  story:T('Adventure','奇遇'),ppl:T('People','人情'),sect:T('Sect','门派'),org:T('Your house','自家门户'),jail:T('Prison','牢狱'),
  act:T('Consequences','行事余波'),road:T('On the road','江湖路上'),town:T('Town life','市井'),home:T('Home','家常'),dec:T('A decision','抉择'),inc:T('Encounter','际遇')};
function cardKind(q){const inc=q.src==='inc'?INC_BY[q.id]:null,id=q.id||'',tg=(inc&&inc.tags)||[];
  if(tg.includes('season'))return'season';if(/^nm_/.test(id))return'nem';if(/^sp_/.test(id))return'sectwar';if(/^bev/.test(id))return'big';
  if(tg.includes('jail'))return'jail';if(inc&&(inc.story||inc.sopen))return'story';if(/^pe_/.test(id)||tg.includes('rel'))return'ppl';
  if(tg.includes('sect'))return'sect';if(tg.includes('org')||tg.includes('orgfocus'))return'org';if(/^af_/.test(id)||tg.some(t=>/^af_/.test(t)))return'act';
  if(tg.includes('wander'))return'road';if(tg.includes('town'))return'town';if(tg.includes('chore'))return'home';return q.src==='act'?'dec':'inc'}
const SCN_RE=[['prison',/牢|狱|囚|枷/],['snow',/雪|冰|寒冬|腊月/],['rain',/雨|雷|暴风/],['river',/河|江边|江上|湖上|湖边|船|渡口|码头|水边/],
  ['temple',/庙|寺|道观|佛|和尚|道士|尼姑|香火/],['court',/衙|县令|知府|知县|朝廷|圣旨|官府|公堂|皇上/],['battle',/交战|厮杀|围攻|大军|官兵|战场|血战|拼杀/],
  ['sect',/门派|掌门|师父|师兄|师姐|同门|长老|武馆|山门|弟子/],['town',/酒楼|客栈|酒肆|茶馆|集市|街上|铺子|城里|庙会|赌坊|当铺/],
  ['home',/家里|爹|(?<![姑新大])娘|妻子|丈夫|孩子|儿子|女儿|院子|邻居|老家/],['road',/山|林|路上|荒野|关外|大漠|驿/]];
function cardScene(q,kind){const s=S,tx=(q.text&&q.text.zh)||'';
  if(kind==='jail'||s.jail>0)return'prison';
  for(const [k,re] of SCN_RE)if(re.test(tx))return k;
  return{season:['road','river','road','snow'][s.season|0],sect:'sect',sectwar:'battle',nem:'road',big:'battle',org:'sect',road:'road',town:'town',home:'home',ppl:'home'}[kind]||['road','river','road','snow'][s.season|0]}
/* ---------- the ink-wash scene ---------- */
function cardSVG(scn,season,night,seed){let x=seed>>>0||1;const r=()=>(x=(x*1664525+1013904223)>>>0)/4294967296;
  const W=360,H=150,ink='var(--ink)',pp='var(--paper)',seal='var(--seal)';let o='';
  const ridge=(y,amp,n,op)=>{let d=`M0 ${H}L0 ${y}`;for(let i=1;i<=n;i++){const xx=W*i/n;d+=` Q${xx-W/n/2+(r()-.5)*20} ${y-amp*(.4+r())} ${xx} ${y+(r()-.5)*amp*.6}`}return`<path d="${d}L${W} ${H}Z" style="fill:${ink};fill-opacity:${op}"/>`};
  const roof=(cx,y,w,h,op)=>`<path d="M${cx-w/2-6} ${y+2}Q${cx-w/2} ${y} ${cx-w/2+4} ${y-h*.35}L${cx-w*.18} ${y-h}L${cx+w*.18} ${y-h}L${cx+w/2-4} ${y-h*.35}Q${cx+w/2} ${y} ${cx+w/2+6} ${y+2}Z" style="fill:${ink};fill-opacity:${op}"/>`;
  const house=(cx,y,w,op)=>roof(cx,y-w*.45,w,w*.32,op)+`<rect x="${cx-w*.4}" y="${y-w*.45}" width="${w*.8}" height="${w*.45}" style="fill:${ink};fill-opacity:${op*.75}"/>`;
  const lantern=(cx,y)=>`<line x1="${cx}" y1="${y-7}" x2="${cx}" y2="${y-3}" style="stroke:${ink};stroke-opacity:.5"/><ellipse cx="${cx}" cy="${y}" rx="2.6" ry="3.4" style="fill:${seal};fill-opacity:.85"/>`;
  const fig=(cx,y,sc,op)=>`<g transform="translate(${cx} ${y}) scale(${sc})" style="fill:${ink};fill-opacity:${op}"><path d="M-9 -26L0 -32L9 -26Z"/><path d="M-4 -26L4 -26L6 -12L5 0L1 0L0 -10L-1 0L-5 0L-6 -12Z"/><line x1="4" y1="-20" x2="14" y2="-4" style="stroke:${ink};stroke-opacity:${op};stroke-width:1.2"/></g>`;
  const tree=(cx,y,sc,op)=>{let t=`<path d="M${cx} ${y}L${cx+2*sc} ${y-30*sc}L${cx-6*sc} ${y-46*sc}M${cx+1*sc} ${y-28*sc}L${cx+12*sc} ${y-40*sc}" style="stroke:${ink};stroke-opacity:${op};stroke-width:${2.4*sc};fill:none"/>`;
    for(let i=0;i<7;i++)t+=`<circle cx="${cx+(r()-.5)*30*sc}" cy="${y-(38+r()*16)*sc}" r="${(5+r()*6)*sc}" style="fill:${ink};fill-opacity:${op*.55}"/>`;return t};
  /* sky, sun or moon, distant hills and mist */
  o+=`<defs><linearGradient id="cg${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--paper-3)"/><stop offset="1" style="stop-color:${pp}"/></linearGradient><linearGradient id="cm${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${pp};stop-opacity:0"/><stop offset="1" style="stop-color:${pp};stop-opacity:.9"/></linearGradient></defs>`;
  o+=`<rect width="${W}" height="${H}" fill="url(#cg${seed})"/>`;
  if(night)o+=`<rect width="${W}" height="${H}" style="fill:${ink};fill-opacity:.22"/>`;
  const cx0=40+r()*280;
  if(scn!=='prison'&&scn!=='rain'){if(night||season===2)o+=`<circle cx="${cx0}" cy="30" r="13" style="fill:#EEF0E8;stroke:${ink};stroke-opacity:.15"/>`;else if(season===1)o+=`<circle cx="${cx0}" cy="32" r="14" style="fill:${seal};fill-opacity:.5"/>`;else o+=`<circle cx="${cx0}" cy="34" r="11" style="fill:${seal};fill-opacity:.28"/>`}
  o+=ridge(82,26,4,.12)+ridge(100,20,5,.2)+`<rect y="78" width="${W}" height="40" fill="url(#cm${seed})"/>`;
  /* the place */
  const gy=128;
  if(scn==='river'){o+=ridge(112,10,6,.3);o+=`<rect y="116" width="${W}" height="${H-116}" style="fill:${pp};fill-opacity:.6"/>`;for(let i=0;i<9;i++){const y=120+r()*26,x1=r()*W;o+=`<line x1="${x1}" y1="${y}" x2="${x1+20+r()*50}" y2="${y}" style="stroke:${ink};stroke-opacity:.25"/>`}
    const bx=80+r()*200;o+=`<path d="M${bx-26} 128Q${bx} 140 ${bx+26} 128Z" style="fill:${ink};fill-opacity:.7"/>`+fig(bx+4,129,.55,.75)+`<line x1="${bx-12}" y1="128" x2="${bx-28}" y2="104" style="stroke:${ink};stroke-opacity:.6"/>`}
  else{o+=ridge(120,12,6,.42)+`<rect y="${gy}" width="${W}" height="${H-gy}" style="fill:${ink};fill-opacity:.5"/>`}
  if(scn==='town'){[[70,62],[150,74],[235,58],[305,66]].forEach(([c,w])=>{o+=house(c+(r()-.5)*14,gy,w,.62)});for(let i=0;i<5;i++)o+=lantern(50+i*62+r()*20,gy-30-r()*10);o+=fig(130+r()*120,gy+8,.75,.85)}
  else if(scn==='sect'){o+=`<path d="M120 ${gy}L132 ${gy-14}L228 ${gy-14}L240 ${gy}Z" style="fill:${ink};fill-opacity:.55"/>`+roof(180,gy-44,130,36,.75)+`<rect x="132" y="${gy-44}" width="96" height="30" style="fill:${ink};fill-opacity:.55"/>`+roof(180,gy-74,80,26,.7);
    for(let i=0;i<5;i++)o+=`<line x1="${150+i*3}" y1="${gy+i*4}" x2="${210-i*3}" y2="${gy+i*4}" style="stroke:${pp};stroke-opacity:.5"/>`;o+=tree(60,gy,1.1,.6)+tree(310,gy,.9,.55)+fig(180,gy+18,.7,.85)}
  else if(scn==='temple'){for(let i=0;i<5;i++){const w=70-i*11,y=gy-i*16;o+=roof(250,y-4,w,14,.68)+`<rect x="${250-w*.3}" y="${y-6}" width="${w*.6}" height="6" style="fill:${ink};fill-opacity:.5"/>`}o+=`<line x1="250" y1="${gy-84}" x2="250" y2="${gy-98}" style="stroke:${ink};stroke-opacity:.7;stroke-width:2"/>`+tree(90,gy,1.2,.6)+fig(150,gy+8,.75,.85)}
  else if(scn==='court'){o+=roof(180,gy-52,150,30,.8)+`<rect x="120" y="${gy-52}" width="120" height="52" style="fill:${ink};fill-opacity:.6"/><rect x="164" y="${gy-40}" width="32" height="40" style="fill:${pp};fill-opacity:.25"/>`+lantern(140,gy-36)+lantern(220,gy-36);
    o+=`<circle cx="100" cy="${gy-16}" r="12" style="fill:${seal};fill-opacity:.55"/><line x1="100" y1="${gy-4}" x2="100" y2="${gy}" style="stroke:${ink}"/>`+fig(260,gy+8,.75,.85)}
  else if(scn==='home'){o+=`<rect x="20" y="${gy-26}" width="200" height="26" style="fill:${ink};fill-opacity:.4"/>`+roof(120,gy-26,210,12,.62)+house(270,gy,90,.6)+tree(70,gy-20,1,.6)+lantern(250,gy-46);o+=fig(170,gy+8,.7,.85)}
  else if(scn==='battle'){for(let i=0;i<6;i++){const fx=30+i*58+r()*16,fy=gy+2;o+=`<line x1="${fx}" y1="${fy}" x2="${fx}" y2="${fy-60-r()*20}" style="stroke:${ink};stroke-opacity:.6;stroke-width:1.5"/><path d="M${fx} ${fy-58-r()*16}l${16+r()*8} 6l${-16-r()*8} 6Z" style="fill:${i%2?ink:seal};fill-opacity:.55"/>`}o+=fig(160,gy+10,.85,.9)+`<g transform="translate(205 ${gy+10}) scale(-.85 .85)">${fig(0,0,1,.9)}</g>`;for(let i=0;i<10;i++)o+=`<circle cx="${r()*W}" cy="${gy-10-r()*40}" r="${1+r()*2}" style="fill:${seal};fill-opacity:.4"/>`}
  else if(scn==='prison'){o+=`<rect x="140" y="30" width="80" height="44" style="fill:${pp};fill-opacity:.45"/>`;for(let i=0;i<13;i++)o+=`<rect x="${i*30}" y="0" width="7" height="${H}" style="fill:${ink};fill-opacity:.7"/>`;o+=`<rect y="0" width="${W}" height="10" style="fill:${ink};fill-opacity:.7"/>`+fig(180,gy+10,.8,.6)}
  else if(scn!=='river'){/* the road through the hills */o+=`<path d="M${W*.55} ${gy}Q${W*.45} ${gy+8} ${W*.5} ${H}L${W*.62} ${H}Q${W*.54} ${gy+8} ${W*.6} ${gy}Z" style="fill:${pp};fill-opacity:.35"/>`+tree(60+r()*40,gy,1.2,.62)+tree(300-r()*30,gy,.8,.5);
    if(scn==='snow'||scn==='rain'||scn==='road')o+=house(250,gy-4,40,.45);o+=fig(190+r()*20,gy+6,.8,.88)}
  /* weather and season */
  if(scn==='snow'||(season===3&&scn!=='prison')){o+=`<rect y="${gy}" width="${W}" height="${H-gy}" style="fill:#EEF0E8;fill-opacity:.55"/>`;for(let i=0;i<70;i++)o+=`<circle cx="${r()*W}" cy="${r()*H}" r="${.6+r()*1.4}" style="fill:#F4F6F0;fill-opacity:.9"/>`}
  if(scn==='rain'){for(let i=0;i<90;i++){const a=r()*W,b=r()*H;o+=`<line x1="${a}" y1="${b}" x2="${a-6}" y2="${b+14}" style="stroke:${ink};stroke-opacity:.22"/>`}}
  if(season===0&&scn!=='prison'){let d=`M${W} 0Q${W-50} 14 ${W-96} 30`;o+=`<path d="${d}M${W-60} 18Q${W-70} 34 ${W-84} 44" style="stroke:${ink};stroke-opacity:.6;stroke-width:2;fill:none"/>`;for(let i=0;i<16;i++)o+=`<circle cx="${W-20-r()*80}" cy="${4+r()*40}" r="${1.8+r()*1.8}" style="fill:${seal};fill-opacity:.45"/>`}
  if(season===2&&scn!=='prison')for(let i=0;i<12;i++){const ex=r()*W,ey=r()*gy;o+=`<ellipse cx="${ex}" cy="${ey}" rx="2.4" ry="1.2" transform="rotate(${r()*180} ${ex} ${ey})" style="fill:var(--gold);fill-opacity:.55"/>`}
  return`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">${o}</svg>`}
function hashStr(t){let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
/* ---------- the card around the decision ---------- */
(()=>{const rc=renderChron;renderChron=function(){rc.apply(this,arguments);const s=S,q=s&&s.alive&&s.queue[0];if(!q)return;
  const box=$('chron').querySelector(':scope>.choices:not(.outcome)');if(!box||box.classList.contains('card'))return;
  const Z=zh(),kind=cardKind(q),scn=cardScene(q,kind),tx=(q.text&&q.text.zh)||'',night=/夜|月下|三更|灯下|黄昏/.test(tx);
  const sea=typeof seasonOn==='function'&&seasonOn(s)?s.season|0:-1;
  const when=Z?`${cnNum(s.age)}岁${sea>=0?' · '+SEASON_N[sea].zh:''}`:`Age ${s.age}${sea>=0?' · '+SEASON_N[sea].en:''}`;
  const n=s.queue.length>1?` · 1/${s.queue.length}`:'';
  box.classList.add('card','k-'+kind);const lbl=box.querySelector(':scope>.lbl');if(lbl)lbl.remove();
  box.insertAdjacentHTML('afterbegin',`<div class="qhead"><span class="qtag">${tr(CARD_TAG[kind])}</span><span class="qwhen">${when}${n}</span></div><div class="qpic">${cardSVG(scn,sea>=0?sea:1,night,hashStr((q.id||'')+s.age))}</div>`)}})();
/* choose, then confirm */
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('.choices.card .choice');if(!t||t.classList.contains('cont'))return;
  if(t.classList.contains('cfm'))return;
  const box=t.closest('.choices');if(t.classList.contains('sel')&&!box.querySelector('.cfm'))return;
  e.stopPropagation();e.preventDefault();
  box.querySelectorAll('.choice.sel').forEach(b=>b.classList.remove('sel'));t.classList.add('sel');
  let c=box.querySelector('.cfm');if(!c){box.insertAdjacentHTML('beforeend',`<button class="choice cfm"></button>`);c=box.querySelector('.cfm')}
  c.dataset.k=t.dataset.k;c.innerHTML=`<b>${zh()?'就这么办':'Go with this'}</b>`;
  const f=box.querySelector('.fate');if(f)box.appendChild(f)},true);
