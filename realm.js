/* 江湖一生 · nine realms of four stages each; crossing into a higher realm takes a breakthrough, not just more training;
   and four attributes (力道, 根骨, 身法, 内功), shaped by the choices you make each time you advance */
'use strict';

/* ---------- realms and stages ---------- */
const REALM9=[[0,'不通武艺','Untrained'],[8,'不入流','Unranked'],[22,'三流','Third-rate'],[45,'二流','Second-rate'],[75,'一流','First-rate'],[110,'超一流','Beyond first-rate'],
 [150,'绝顶','Peerless'],[200,'宗师','Grandmaster'],[260,'大宗师','Great grandmaster'],[330,'天下第一','First under heaven']];
const REALM_TOP=420;
const STAGES=[['初入','entry'],['小成','minor'],['大成','major'],['圆满','perfected']];
const REALM_REF=['Ordinary people','A few years of drills','Escorts, constables, martial hall instructors','Elite sect disciples, chief escorts','Sect elders, local strongmen','Masters of lesser sects','Masters of the great sects','Founders of sects','Legends of an age','One person in a generation'];
const REALM_REF_ZH=['寻常百姓','练过几年把式','镖师、捕快、武馆教头','门派精英、镖局总镖头','门派长老、一方豪强','小门派的掌门','大派掌门','开宗立派之人','一代传奇','一个时代只有一人'];
/* the legacy seven-step ladder stays for older code (titles and checks), re-pinned to the new thresholds */
REALMS.splice(0,REALMS.length,[0,'不通武艺','Untrained'],[22,'三流好手','Third-rate fighter'],[45,'二流好手','Second-rate fighter'],[75,'一流高手','First-rate fighter'],[150,'绝顶高手','Peerless master'],[200,'一代宗师','Grandmaster'],[330,'天下第一','First under heaven']);
const r9Of=p=>{let i=0;REALM9.forEach((r,k)=>{if(p>=r[0])i=k});return i};
function stageOf(p){const i=r9Of(p);if(i===0)return{i,st:0,lvl:0};const lo=REALM9[i][0],hi=REALM9[i+1]?REALM9[i+1][0]:REALM_TOP;const st=clamp(Math.floor((p-lo)/(hi-lo)*4),0,3);return{i,st,lvl:1+(i-1)*4+st,lo,hi}}
const stageName=p=>{const x=stageOf(p);return x.i===0?T('Untrained','不通武艺'):T(`${REALM9[x.i][2]} (${STAGES[x.st][1]})`,`${REALM9[x.i][1]}·${STAGES[x.st][0]}`)};
/* martial power cannot run past the realm you have broken into; what you train beyond it waits for the breakthrough */
const rawPower=power;
power=function(s){const raw=rawPower(s);if(s.brk==null)return raw;const nx=REALM9[s.brk+1];return nx?Math.min(raw,nx[0]-1):raw};
const bottled=s=>s.brk!=null&&REALM9[s.brk+1]&&rawPower(s)>=REALM9[s.brk+1][0];
rname=function(s){const p=power(s);if(p<8&&s.arts&&s.arts.length)return[0,'初学乍练','Novice'];const n=stageName(p);return[p,n.zh,n.en]};
/* training is slower the higher you climb */
const _trainGain=trainGain,_qiGain=qiGain;
trainGain=function(s,f){return _trainGain(s,f)*.8/(1+Math.max(0,s.skill-50)/140)};
qiGain=function(s,f){return _qiGain(s,f)*.8/(1+Math.max(0,s.qi-40)/160)};

/* everyone else in the jianghu follows the same, harder ladder: most people are untrained or third-rate, masters are rare */
worldLv=function(){const r=R();return r<.5?rint(3,30):r<.78?rint(30,60):r<.92?rint(60,100):r<.982?rint(100,150):r<.997?rint(150,220):rint(220,330)};
/* ---------- the four attributes ---------- */
const ATTR=['li','gen','shen','nei'];
const ATN={li:T('Strength','力道'),gen:T('Constitution','根骨'),shen:T('Agility','身法'),nei:T('Inner force','内功')};
const ATD={li:T('Attack and critical hits. For hard-hitting outer arts.','攻击与暴击。适合刚猛外功。'),gen:T('Health and defence. Keeps you alive.','气血与防御。保命之本。'),
 shen:T('Speed and dodging. Act first, get hit less.','出手速度与闪避。先发制人，少挨打。'),nei:T('True qi, how fast it gathers, and the force of qi techniques.','真气上限、气聚速度和内劲。招式要耗真气。')};
function attrW(s){if(!s.aw)s.aw={li:10+s.t.root*.8,gen:10+s.t.root*1.2,shen:10+s.t.luck*.6+s.t.wit*.4,nei:10+s.t.heart*1.2};return s.aw}
function attrsOf(s){const L=Math.max(3,power(s)),w=attrW(s),sw=w.li+w.gen+w.shen+w.nei,P=attrTotal(L),o={};ATTR.forEach(k=>o[k]=Math.round(P*w[k]/sw));return o}
/* how you compare with everyone else in the jianghu */
const ATTR_REF=(()=>{const a=[];for(let i=0;i<800;i++)a.push(attrTotal(worldLv())*(.18+R()*.14));return a.sort((x,y)=>x-y)})();
const attrPct=v=>{let lo=0,hi=ATTR_REF.length;while(lo<hi){const m=(lo+hi)>>1;if(ATTR_REF[m]<v)lo=m+1;else hi=m}return Math.round(lo/ATTR_REF.length*100)};
addAct({id:'attrpick',cat:'train',n:T('Advance','精进'),d:'',if:()=>false,run(){},
 choose(s,k,c){if(!ATN[k])return;const w=attrW(s);w[k]+=4*c.n;say(s,`Your ${ATN[k].en.toLowerCase()} improves.`,`你的${ATN[k].zh}有了长进。`,'good')}});

/* ---------- stage announcements, and a choice of where to put the gain ---------- */
const _after9=after;
after=function(s){
  if(s.alive&&s.age>=0){const r=realmOf(s);if(r>s.realm)s.realm=r;
    const x=stageOf(power(s));s.lvl9=s.lvl9??x.lvl;
    if(x.lvl>s.lvl9){const n=x.lvl-s.lvl9;s.lvl9=x.lvl;s.lvPend=(s.lvPend||0)+n;const nm=stageName(power(s));
      if(x.st===0)say(s,`You enter a new realm: ${nm.en}.`,`你踏入了新的境界：「${nm.zh}」。`,'gold');else say(s,`Your cultivation deepens: ${nm.en}.`,`你的修为精进到「${nm.zh}」。`,'good');
      if(x.i>=6&&x.st===0)deed(s,`Reached the realm of ${REALM9[x.i][2]} (${REALM9[x.i][1]})`,`臻至${REALM9[x.i][1]}之境`)}}
  return _after9(s)};
/* each year, put what you gained into one of the four */
function offerAttrPick(s){if(!s.lvPend||s.queue.length>3)return;const n=s.lvPend;s.lvPend=0;const A=attrsOf(s);
  s.queue.push({src:'act',id:'attrpick',c:{n},text:T(`You have advanced ${n} stage${n>1?'s':''} this year. Where has the progress gone?`,`今年修为精进了${cnNum(n)}阶。这份长进，落在了哪里？`),
    opts:ATTR.map(k=>({k,l:T(`${ATN[k].en} (now ${A[k]})`,`${ATN[k].zh}（现为${A[k]}）`),sub:ATD[k]}))})}

/* ---------- breakthroughs ---------- */
const BRK_BASE={4:.12,5:.22,6:.45,7:.5,8:.25,9:.12};
/* how far your talent is likely to carry you: ordinary talent tops out around First-rate */
const potential=s=>3+(s.t.root+s.t.wit+s.t.heart-15)/4;
function brkChance(s,k){const a=s.age;const ageM=a<20?.8:a<=50?1:a<=65?.7:.4;const over=Math.max(0,k-potential(s));
  const top=s.arts.some(x=>x.tier>=3)?1.25:1;return clamp((BRK_BASE[k]||.02)*Math.pow(.5,over)*ageM*top*(1+Math.min(3,(s.brkTry||0)*.2)),.005,.9)}
/* insight from failed attempts: enough of it, and the next win breaks the wall for certain */
const BRK_SURE=10;
function breakThrough(s){const k=s.brk+1;s.brkCd=0;s.brk=k;s.brkTry=0;const w=attrW(s);ATTR.forEach(x=>w[x]+=1);
  say(s,`The wall gives way. You have broken through into the realm of ${REALM9[k][2]} (${REALM9[k][1]}).`,`瓶颈豁然冲开，你踏入了「${REALM9[k][1]}」之境！`,'gold');
  if(k>=7)s.fame+=k*2}
I({id:'rz_bottle',only:1,noThread:1,ctx:s=>({k:s.brk+1}),
 text:c=>T(`Your training has hit a wall. To go from ${REALM9[c.k-1][2]} to ${REALM9[c.k][2]} takes more than practice: something has to break.`,`你的修为卡住了。从「${REALM9[c.k-1][1]}」到「${REALM9[c.k][1]}」，光靠苦练已经不够，得有什么东西被打破。`),
 opts:[{l:T('Go into seclusion and force it','闭关冲关'),sub:(c,s)=>T(`About ${Math.round(brkChance(s,c.k)*100)}% if it goes well; failure can injure you.`,`顺利的话约有${Math.round(brkChance(s,c.k)*100)}%的把握；失败可能受伤。`),
   out:[{t:T('You shut the door behind you.','你关上了门。'),c:'muted',sure:1,fx:{f:(s,c)=>{if(chance(brkChance(s,c.k)))breakThrough(s);else{s.brkTry=(s.brkTry||0)+1;if(chance(.4)){const w=wound(s,6,14,T('qi deviation in seclusion','闭关时走火入魔'));s.health=Math.max(s.health,Math.round(s.maxHealth*.2));s.skill=Math.max(0,s.skill-3);say(s,`Your qi turns on you (${w.en}). You come out weaker than you went in.`,`真气反噬（${w.zh}），你出关时反倒弱了些。`,'bad')}else say(s,'Months in the dark, and the wall holds. Next time you will know it better.','黑暗中枯坐数月，那堵墙纹丝不动。下一回，你会更了解它。','muted')}}}}]},
  {l:T('Seek out a stronger opponent','寻一位强敌生死一搏'),sub:(c,s)=>(s.brkTry||0)>=BRK_SURE?T('Your insight is full: win, and you break through.','感悟已满：打赢这一战，必能破境。'):T(`Win, and about ${Math.round(Math.min(.95,brkChance(s,c.k)*1.8)*100)}% to break through. Insight ${s.brkTry||0}/${BRK_SURE}.`,`打赢了约有${Math.round(Math.min(.95,brkChance(s,c.k)*1.8)*100)}%能破境。感悟${cnNum(s.brkTry||0)}/${cnNum(BRK_SURE)}。`),
   fight:(s,c)=>({foe:{name:foeName(),lv:REALM9[c.k][0]+rint(0,15),fixed:1},stakes:'injury',title:T('A fight at the edge','生死边缘'),cause:T('a fight to break a barrier','以战破境')}),
   win:[{t:T('In the last exchange you see what you could not see before.','最后一招交错之际，你看见了以前看不见的东西。'),c:'good',sure:1,fx:{f:(s,c)=>{if((s.brkTry||0)>=BRK_SURE||chance(Math.min(.95,brkChance(s,c.k)*1.8)))breakThrough(s);else{s.brkTry=(s.brkTry||0)+2;say(s,`Close. Very close. (Insight ${s.brkTry}/${BRK_SURE}: the next attempt is likelier.)`,`差一点。就差一点。（感悟${cnNum(Math.min(s.brkTry,BRK_SURE))}/${cnNum(BRK_SURE)}，下次把握更大。）`,'muted')}}}}],
   lose:[{t:T('You are beaten, and the wall is still there.','你败了，那堵墙还在。'),c:'bad',sure:1,fx:{f:s=>{s.brkTry=(s.brkTry||0)+1}}}]},
  {l:T('Ask someone who has crossed it','请教过来人'),if:s=>!!masterOf(s)||s.money>=150,sub:T('Safer and slower. Your master, or 150 taels for a teacher.','稳妥但慢。找师父，或花一百五十两请人指点。'),
   out:[{t:T('You listen more than you talk.','你听得多，说得少。'),c:'muted',sure:1,fx:{f:(s,c)=>{if(!masterOf(s))pay(s,-150);if(chance(brkChance(s,c.k)*.8))breakThrough(s);else{s.brkTry=(s.brkTry||0)+2;say(s,'You understand the road better, but have not walked it yet.','路看得更清了，可还没走过去。','muted')}}}}]},
  {l:T('Let it come in its own time','顺其自然'),out:[{t:T('Some walls fall on their own. Some never do.','有些墙会自己倒，有些永远不会。'),c:'muted',sure:1,fx:{f:(s,c)=>{if(chance(brkChance(s,c.k)*.25))breakThrough(s);else s.brkTry=(s.brkTry||0)+1}}}]}]});

/* ---------- each year ---------- */
const _newLife9=newLife;
newLife=function(){const s=_newLife9();s.brk=3;s.lvl9=0;attrW(s);return s};
const _yearly9=yearly;
yearly=function(s){_yearly9(s);if(!s.alive)return;
  if(s.brk==null)s.brk=Math.max(3,r9Of(rawPower(s)));
  offerAttrPick(s);
  if(bottled(s)&&s.age>=14&&s.jail<=0&&s.queue.length<3&&s.age>=(s.brkCd||0)&&chance(.55)&&INC_BY.rz_bottle){s.brkCd=s.age+rint(3,4);runIncident(s,INC_BY.rz_bottle)}};
