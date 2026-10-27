/* 江湖一生 · you cannot wear an official's robe and be on the wanted list at once. Posts that serve the law (magistrate,
   constable, embroidered guard) are closed to anyone who is wanted, and if a warrant goes out while you hold one, it
   lands on your own desk and you have to decide what to do about it. */
'use strict';
const LAW_JOBS=['official','constable','jinyiwei'];
(()=>{const j=JOBS.official;if(!j)return;const r0=j.req;j.req=s=>r0(s)&&s.wanted===0;j.rq=T('Pass the imperial exam; not wanted','须金榜题名，未被通缉')})();
I({id:'law_wanted',sys:1,noThread:1,ctx:s=>({j:JOBS[s.job].n[s.jobLv],w:s.wanted,cost:60+s.wanted*80}),
 text:c=>T(`A warrant reaches the yamen, and the name on it is yours. You are the ${c.j.en}, and you are also wanted. It cannot stay that way for long.`,
  `一纸海捕文书送进了衙门，上面写的是你的名字。你是${c.j.zh}，同时也是通缉犯。这样下去，撑不了多久。`),
 opts:[{l:T('Use your seal to bury it','动用官印把它压下来'),if:(s,c)=>s.money>=c.cost,sub:c=>T(`${c.cost} taels to the right people. The more stars, the likelier it leaks.`,`打点${c.cost}两。通缉越重，越容易走漏。`),
   out:[{w:(s,c)=>Math.max(.5,6-c.w*1.2),t:T('The file goes into a drawer, and then into the stove. Nobody mentions it again.','那份文书先进了抽屉，后来进了炉子。没人再提起。'),c:'muted',fx:{align:-4,f:(s,c)=>{pay(s,-c.cost);s.wanted=0}}},
    {w:(s,c)=>1+c.w,t:T('A clerk talks. You are stripped of your post in front of the whole yamen, and the warrant gets worse.','有个书吏说了出去。你当着满衙门的人被革了职，通缉还加重了一等。'),c:'bad',fx:{fame:-6,happy:-8,f:(s,c)=>{pay(s,-c.cost);s.job=null;s.wanted=Math.min(5,s.wanted+1)}}}]},
  {l:T('Resign and leave before they come','辞官，赶在他们来之前离开'),out:[{t:T('You hang up your cap, leave the seal on the desk and are gone by night. Still wanted, but no longer pretending.','你挂冠封印，连夜走了。通缉还在，但至少不用再装了。'),c:'muted',fx:{happy:-5,f:s=>{s.job=null}}}]},
  {l:T('Give yourself up','投案自首'),sub:T('You lose the post and serve a short sentence; the warrant is cleared.','丢官，坐一阵子牢，通缉一笔勾销。'),
   out:[{t:T('You walk into your own court and kneel. The judge from the next county hears the case. People talk about it for years.','你走进自己的公堂，跪了下去。邻县的官来审这桩案子。这件事人们说了好些年。'),c:'muted',fx:(s,c)=>({align:3,fame:2,jail:Math.max(1,c.w-1),f:s=>{s.wanted=0}})}]}]});
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);
  if(s.alive&&s.job&&LAW_JOBS.includes(s.job)&&s.wanted>0&&s.jail<=0&&s.queue.length<4&&INC_BY.law_wanted)runIncident(s,INC_BY.law_wanted);return r}})();
