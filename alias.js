/* 江湖一生 · 江湖绰号: once enough people know your name, the jianghu gives you a nickname, and you do not get a say.
   It comes from what you are actually known for (the weapon you fight with, how many fights you have won, the blood on
   your hands, your face, your trade, where you are from) and it can change when your life does: a much bigger name, or
   a fall from the righteous path. People use it, it sits under your name, and it goes on your tombstone. */
'use strict';
/* what you are known for: fights won, lost, and killed in */
(()=>{const f0=fightLife;fightLife=function(s,foe,o){const r=f0.apply(this,arguments);if(r&&s){if(r.win){s.nkW=(s.nkW||0)+1;if(o&&o.stakes==='death')s.nkK=(s.nkK||0)+1}else s.nkL=(s.nkL||0)+1}return r}})();
const NK_W={sword:['剑','Sword'],saber:['刀','Blade'],fist:['拳','Fist'],staff:['棍','Staff'],spear:['枪','Spear'],whip:['鞭','Whip'],hook:['钩','Hook'],pierce:['刺','Dagger'],flute:['笛','Flute'],ring:['环','Ring'],wheel:['轮','Wheel'],brush:['笔','Brush'],bow:['箭','Arrow'],anqi:['镖','Dart']};
/* the weapon people picture when they hear of you */
function nkWeapon(s){const arts=(typeof combatArts==='function'?combatArts(s):s.arts||[]).filter(a=>typeof artCat!=='function'||['wai','anqi'].includes(artCat(a)));
  const a=arts.slice().sort((x,y)=>((y.lv||0)+(y.tier||0)*2)-((x.lv||0)+(x.tier||0)*2))[0];
  if(a){const cn=a.cn||'';if(/掌/.test(cn))return['掌','Palm'];if(/指/.test(cn))return['指','Finger'];if(/腿|脚/.test(cn))return['腿','Kick'];const w=typeof artWeapon==='function'?artWeapon(a):null;if(w&&NK_W[w])return NK_W[w]}
  const h=typeof heldClass==='function'?heldClass(s):null;return NK_W[h]||(s.sect&&SECTS[s.sect].wpn?[SECTS[s.sect].wpn.zh.slice(0,1),SECTS[s.sect].wpn.en]:['剑','Sword'])}
const NK_ADJ={good:[['玉','Jade'],['清风','Pure Wind'],['白云','White Cloud'],['正气','Righteous'],['青衫','Blue Robe'],['孤鸿','Lone Goose'],['春雷','Spring Thunder']],
  evil:[['血','Bloody'],['黑','Black'],['鬼','Ghost'],['毒','Venom'],['九幽','Nine Hells'],['夺命','Life-Taking'],['阴风','Dark Wind']],
  mid:[['浪子','Wanderer’s'],['醉','Drunken'],['孤','Lonely'],['笑面','Smiling'],['灰衣','Grey Robe'],['疯','Mad'],['独行','Lone Road']]};
const nkSide=s=>s.align>=25?'good':s.align<=-25?'evil':'mid';
/* every nickname the jianghu could give you right now, each with how likely it is and why */
function nkCands(s){const C=[],w=nkWeapon(s),side=nkSide(s),f=s.gender==='f',reg=region(s),W=s.nkW||0,L=s.nkL||0,K=s.nkK||0,job=s.job,P=s.sur||[s.cn.slice(0,1),s.name.split(' ')[0]];
  const add=(zh,en,why,wt)=>{if(wt>0)C.push({zh,en,why,w:wt})};
  const a=pick(NK_ADJ[side]);add(a[0]+w[0],`the ${a[1]} ${w[1]}`,T(`for the way you fight with the ${w[1].toLowerCase()}`,`因为你那一手${w[0]}上的功夫`),2);
  if(reg)add(`${reg.cn}一${w[0]}`,`the One ${w[1]} of ${reg.en}`,T(`because no one in ${reg.en} can match you`,`因为${reg.cn}地界，没人比得过你`),s.fame>=50?2.5:.6);
  if(W>=12&&L<=W*.25)add(`不败${w[0]}`,`the Unbeaten ${w[1]}`,T(`because in ${W} fights you have hardly ever lost`,`因为你打了${W}场，几乎没输过`),4);
  if(K>=4&&s.align<=-30)add(pick([`血手人屠`,`${w[0]}阎罗`]),pick(['the Red-Handed Butcher',`the ${w[1]} of Hell`]),T(`because of how many have died at your hands`,`因为死在你手下的人太多了`),4);
  if(s.align>=55&&s.fame>=50)add(`${P[0]}大侠`,`Great Hero ${P[1]||s.name}`,T('because of all the people you have helped','因为你帮过的人实在太多'),2.5);
  if(s.align>=60&&s.money<200)add('活菩萨','the Living Bodhisattva',T('because you give away more than you keep','因为你给出去的比留下的还多'),2);
  if(s.looks>=75)add(f?pick(['白衣仙子','凌波仙子']):'玉面郎君',f?pick(['the Fairy in White','the Fairy Who Walks on Waves']):'the Jade-Faced Gentleman',T('because of your face, mostly','多半是因为你那张脸'),3);
  if(job==='official')add(s.align>=0?`铁面${JOBS.official.n[s.jobLv||0].zh}`:`糊涂${JOBS.official.n[s.jobLv||0].zh}`,s.align>=0?`the Iron-Faced ${JOBS.official.n[s.jobLv||0].en}`:`the Muddled ${JOBS.official.n[s.jobLv||0].en}`,T('because of how you run your court','因为你断案的样子'),3);
  if(job==='constable')add('神捕','the Divine Constable',T('because no one you chase gets away','因为你追的人没有跑掉的'),3);
  if(job==='doctor')add('妙手神医','the Miracle Doctor',T('because of the patients you saved','因为你救回来的那些病人'),3);
  if(job==='assassin')add(pick(['无影','夜叉']),pick(['the Shadowless','the Night Demon']),T('because no one ever sees you coming','因为从没人看见你是怎么来的'),3);
  if(s.money>=6000)add('金算盘','the Golden Abacus',T('because of how much silver passes through your hands','因为过你手的银子实在太多'),2);
  const esc=[s.org,s.org2].find(o=>o&&o.type==='escort');if(esc&&esc.rep>=50)add('镖王','King of Escorts',T(`because ${esc.name.en} never loses a load`,`因为${esc.name.zh}从没丢过镖`),3);
  const qg=(s.arts||[]).filter(x=>typeof artCat==='function'&&artCat(x)==='qing').sort((x,y)=>(y.tier||0)-(x.tier||0))[0];if(qg&&(qg.tier||0)>=2)add(pick(['踏雪无痕','草上飞']),pick(['Tracks-Not-in-Snow','Flies Over Grass']),T(`because of your ${qg.n}`,`因为你那一身${qg.cn}`),2);
  if(s.age>=60)add(side==='evil'?`${w[0]}老怪`:`${a[0]}老人`,side==='evil'?`the Old ${w[1]} Fiend`:`the Old ${a[1]} Master`,T('because you have been around a long time','因为你在江湖上混得太久了'),2);
  if(f&&side==='evil')add('女魔头','the She-Devil',T('because of what you have done','因为你做过的那些事'),2);
  return C}
const nkTier=s=>s.fame>=150?3:s.fame>=80?2:s.fame>=30?1:0;
function giveAlias(s,first){const old=s.alias;const C=nkCands(s).filter(c=>!old||c.zh!==old.zh);const c=wpick(C,x=>x.w);if(!c)return;
  s.alias={zh:c.zh,en:c.en,at:s.age,ev:s.align<=-40};(s.aliases=s.aliases||[]).push(s.alias);s.aliasTier=nkTier(s);
  if(!old)say(s,`One day you realise the jianghu has started calling you “${c.en}”, ${c.why.en}.`,`不知从哪天起，江湖上开始管你叫「${c.zh}」，${c.why.zh}。`,'gold');
  else say(s,`People call you something new now: “${c.en}”, ${c.why.en}. Hardly anyone says “${old.en}” any more.`,`江湖上的人改口了。如今提起你，都叫「${c.zh}」，${c.why.zh}。「${old.zh}」这个名号，渐渐没人提了。`,'gold');
  deed(s,`Known in the jianghu as “${c.en}”`,`江湖人称「${c.zh}」`)}
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);if(!s.alive||s.age<14)return r;const t=nkTier(s);
  if(!s.alias){if(t>=1)giveAlias(s,true);return r}
  const since=s.age-(s.alias.at||0);
  if(t>(s.aliasTier||1)){if(since>=4&&chance(.6))giveAlias(s);else s.aliasTier=t}
  else if(since>=5&&s.alias.ev!==(s.align<=-40)&&Math.abs(s.align)>=40&&chance(.5))giveAlias(s);
  return r}})();
/* the tombstone keeps the name you were known by */
(()=>{const d0=die;die=function(s){const r=d0.apply(this,arguments);if(s.alias)s.nick={zh:s.alias.zh,en:s.alias.en};return r}})();
/* people use it */
const NK_USE=[(p,a)=>T(`${p.n.py} greets you as “${a.en}” loud enough for the whole street to hear.`,`${p.n.cn}一见面就喊你「${a.zh}」，喊得整条街都听见了。`),
 (p,a)=>T(`“${a.en},” ${p.n.py} says, just to watch you wince.`,`“${a.zh}。”${p.n.cn}故意这么叫你，就为了看你皱眉。`),
 (p,a)=>T(`${p.n.py} says the storyteller at the teahouse has started on the tales of “${a.en}”.`,`${p.n.cn}说，茶馆里说书的已经开始讲「${a.zh}」的故事了。`),
 (p,a)=>T(`A child runs past shouting “${a.en}!” and ${p.n.py} laughs at your face.`,`有个孩子边跑边喊「${a.zh}」，${p.n.cn}看着你的脸直笑。`)];
const NK_FAM=(p,a)=>T(`“${a.en}? At home you are still just you,” ${p.n.py} says.`,`${p.n.cn}说：“什么「${a.zh}」，在家里你还是你。”`);
(()=>{const h=PACT_BY.hang;if(!h)return;const r0=h.run;h.run=function(s,p){const r=r0.apply(this,arguments);if(s.alias&&p&&p.age>=8&&chance(.1)){const t=['father','mother','spouse','sibling','grandparent'].includes(p.rel)?NK_FAM(p,s.alias):pick(NK_USE)(p,s.alias);say(s,t.en,t.zh,'muted')}return r}})();
/* under your name on the character sheet */
if(typeof addEventListener==='function')addEventListener('load',()=>{if(typeof sideHTML!=='function')return;const h0=sideHTML;sideHTML=function(s){const h=h0.apply(this,arguments);if(!s.alias)return h;
  const tag=zh()?`<p class="nickln">人称「<b>${s.alias.zh}</b>」</p>`:`<p class="nickln">Known as “<b>${esc(s.alias.en)}</b>”</p>`;const i=h.indexOf('</h2>');return i<0?h:h.slice(0,i+5)+tag+h.slice(i+5)};if(typeof miniHTML==='function'){const m0=miniHTML;miniHTML=function(s){const h=m0.apply(this,arguments);if(!s.alias)return h;const i=h.indexOf('</b>');
    return i<0?h:h.slice(0,i+4)+`<span class="mnick">${zh()?'「'+s.alias.zh+'」':'“'+esc(s.alias.en)+'”'}</span>`+h.slice(i+4)}}
  try{update(false)}catch(e){}});
