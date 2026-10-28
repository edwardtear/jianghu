/* 江湖一生 · a master who sees you are ready does not wait to be asked. When a season turns and your cultivation has
   reached the point where the next art is within reach, your master may call you over and teach it: the next art of
   your sect, or their own art, or something to fill a gap (a lightness art, an inner art, hidden weapons). */
'use strict';
const MT_POW=[8,40,90,150];
function mtNext(s,m){
  /* the sect's own arts, in order, as your power allows */
  if(s.sect&&SECTS[s.sect]&&(!m.sect||m.sect===s.sect)){const i=sectArtCount(s);if(i<3&&SECTS[s.sect].arts&&SECTS[s.sect].arts[i]&&power(s)>=MT_POW[i]&&i<=(s.rank||0)+1)return{a:sectArt(s.sect,i),sect:1}}
  /* the master's own art */
  if(m.art&&ARTS[m.art]&&!s.arts.some(a=>a.cn===ARTS[m.art].cn)&&power(s)>=MT_POW[Math.min(3,ARTS[m.art].tier||0)])return{a:ARTS[m.art]};
  /* something you lack */
  if(s.arts.length>=5)return null;const have=new Set(s.arts.map(a=>artCat(a)));const want=['qing','nei','anqi','wai'].filter(k=>!have.has(k));
  const maxT=power(s)>=MT_POW[2]?2:power(s)>=MT_POW[1]?1:0;
  for(const k of want){const ks=Object.keys(ARTS).filter(x=>{const a=ARTS[x];return!a.rare&&!a.bad&&artCat(a)===k&&(a.tier||0)<=Math.max(1,maxT)&&!s.arts.some(y=>y.cn===a.cn)&&!['familysword','escortsaber','prisonart','street'].includes(x)});if(ks.length)return{a:ARTS[pick(ks)],gap:k}}
  return null}
I({id:'ms_teach',sys:1,noThread:1,
 text:c=>T(`${c.mn.en} calls you over after the morning drills. “Your foundation is ready. It is time you learned ${c.an.en}.”`,`早课散了，${c.mn.zh}把你叫到跟前：“你的根基到了。是时候学${c.an.zh}了。”`),
 opts:[{l:T('Learn it, respectfully','恭恭敬敬地学'),out:[{t:c=>T(`For the whole season ${c.mn.en} teaches you by hand, move by move.`,`这一季，${c.mn.zh}手把手地教你，一招一式都不放过。`),c:'gold',
   fx:(s,c)=>({f:s=>{const m=masterOf(s);if(m)addBond(m,rint(3,6));const a=c.sect&&s.sect?sectArt(s.sect,c.si):(c.key&&ARTS[c.key]);if(!a)return;
     if(learn(s,a)){say(s,`You have learned ${a.n} (${a.cn}).`,`你学会了${a.cn}。`,'gold');if(c.sect&&a.tier===2)deed(s,`Mastered ${a.n} (${a.cn})`,`练成${SZ(s.sect)}绝学${a.cn}`)}}})}]},
  {l:T('Ask to polish what you have first','先把手上的练熟'),out:[{t:c=>T(`${c.mn.en} nods, pleased. “Good. Come back when you are ready.”`,`${c.mn.zh}点点头，挺满意：“好。准备好了再来找我。”`),c:'muted',fx:(s,c)=>({skill:.5,f:s=>{const m=masterOf(s);if(m)addBond(m,2)}})}]}]});
(()=>{const n0=nextSeason;nextSeason=function(s){const r=n0.apply(this,arguments);try{
  if(!s.alive||s.age<10||s.jail>0||s.queue.length>=3)return r;const m=masterOf(s);if(!m||m.bond<40)return r;
  const t=tIdx(s);if(s.mtT!=null&&t-s.mtT<8)return r;const x=mtNext(s,m);if(!x||!chance(.3))return r;
  s.mtT=t;const key=x.sect?null:Object.keys(ARTS).find(k=>ARTS[k].cn===x.a.cn);
  runIncident(s,INC_BY.ms_teach,Object.assign(scene(),{mn:T(m.n.py,m.n.cn),an:T(x.a.n,x.a.cn),sect:x.sect?1:0,si:x.sect?sectArtCount(s):null,key}))}catch(e){}return r}})();
