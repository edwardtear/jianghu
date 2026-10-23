/* 江湖一生 · story series (奇遇): stories that unfold over years. Each one keeps a single record in the save
   (s.story[id]): where it stands, when it may move on, who is in it, and the facts your choices created. Later stages
   read those facts, so the ending is the sum of what you did, not one dice roll. A stage usually happens when you do
   the matching activity; if you never do, it comes to you anyway a year or so later. Stories can end well, badly,
   or just peter out, and every ending you reach is kept in the 江湖奇遇录 across lives. */
'use strict';
const STORY={},STORY_ORDER=[];
/* d: {n:title, theme, ends:{key:{n,tone:'good'|'mixed'|'bad'}}, hint:{stage:T|fn(s,r)}, lapse:T, exp:years} */
function SDEF(id,d){STORY[id]=d;STORY_ORDER.push(id)}
const stRec=(s,id)=>(s.story||{})[id];
const stF=(s,id)=>(stRec(s,id)||{}).facts||{};
const stLive=s=>Object.keys(s.story||{}).filter(k=>s.story[k].st==='on');
const dly=d=>Array.isArray(d)?rint(d[0],d[1]):(d??1);
/* a new story may start if this life has not had it and is not already juggling three */
function stCan(s,id){return!stRec(s,id)&&stLive(s).length<3&&s.jail<=0}
function stBegin(s,id,c,stage,facts,delay){s.story=s.story||{};
  const n=c&&c.npc,r={st:'on',stage,at:s.age,adv:s.age,next:s.age+dly(delay),reg:s.region,facts:Object.assign({},facts||{}),path:[]};
  if(n&&n.n)r.who={n:n.n,sex:n.sex,occ:n.occ,age:n.age,lv:n.lv};if(c&&c.pid)r.pid=c.pid;
  s.story[id]=r;s.flags['st_'+id]=s.age;return r}
function stGo(s,id,stage,facts,delay){const r=stRec(s,id);if(!r||r.st!=='on')return;Object.assign(r.facts,facts||{});r.path.push(r.stage);r.stage=stage;r.adv=s.age;r.next=s.age+dly(delay)}
function stSet(s,id,facts){const r=stRec(s,id);if(r)Object.assign(r.facts,facts)}
function stEnd(s,id,end,facts){const r=stRec(s,id),D=STORY[id];if(!r||r.st!=='on')return;Object.assign(r.facts,facts||{});
  const E=D.ends[end]||{n:T('Unfinished','不了了之'),tone:'mixed'};r.path.push(r.stage);r.stage=null;r.end=end;r.st=E.tone==='bad'?'failed':'done';r.done=s.age;delete s.flags['st_'+id];
  say(s,`【${D.n.en}】 Ending: ${E.n.en}.`,`【${D.n.zh}】结局：${E.n.zh}。`,E.tone==='bad'?'bad':'gold');
  (s.loreNew=s.loreNew||[]).push([id,end])}
/* the people in a story keep their names and grow older with you */
function stCtx(s,id){const r=stRec(s,id);const c=scene();if(!r)return c;const yrs=s.age-r.at;
  if(r.who){const w=r.who,p=r.pid&&person(s,r.pid);c.npc=npc(s,{name:w.n,sex:w.sex,occ:w.occ,age:(w.age||25)+yrs,lv:w.lv||10});if(p){c.pid=p.id;c.p=p;c.npc.lv=p.lv}}
  else c.npc=npc(s);
  c.r=r;c.f=r.facts;c.yrs=yrs;c.since=s.age-r.adv;c.sid=id;return c}
/* the two kinds of incident a story is made of: an opening that can happen to anyone, and the stages that follow */
function SOPEN(id,d){d.id=d.id||id+'_open';d.once=1;d.noThread=1;d.noRipple=1;d.sopen=id;const w=d.when;d.when=s=>stCan(s,id)&&(!w||w(s));I(d)}
function STI(id,stage,d){d.id=id+'_'+stage;d.only=1;d.cd=0;d.noThread=1;d.noRipple=1;d.story=id;d.stage=stage;d.need='st_'+id;d.tags=d.tags||[];
  const w=d.when;d.when=s=>{const r=stRec(s,id);return!!r&&r.st==='on'&&r.stage===stage&&s.age>=r.next&&(!w||w(s,r))};d.ctx=d.ctx||(s=>stCtx(s,id));I(d);return d}
const stStage=(id,st)=>INC_BY[id+'_'+st];
/* label the decision so you know which story it belongs to */
(()=>{const ri=runIncident;runIncident=function(s,inc,c){const r=ri.apply(this,arguments);
  if(r&&inc&&(inc.story||inc.sopen)){const q=s.queue[s.queue.length-1];const D=STORY[inc.story||inc.sopen];
    if(q&&q.id===inc.id&&D)q.tagline=inc.story?T(`Story · ${D.n.en} (continued)`,`奇遇 · ${D.n.zh}（续）`):T(`Story · ${D.n.en}`,`奇遇 · ${D.n.zh}`)}return r}})();
/* doing the matching activity usually brings the next stage */
(()=>{const af=actFollow;actFollow=function(s,id){if(s.alive&&!s.queue.length&&s.jail<=0){
    const due=INC.filter(i=>i.story&&(i.tags||[]).includes('af_'+id)&&eligible(s,i,'af_'+id));
    if(due.length&&chance(.8)){runIncident(s,pick(due));return}}
  return af.apply(this,arguments)}})();
/* each year: people who die take their part of a story with them, a story nobody follows up on lapses, and a stage
   left waiting comes to you by itself, taking the place of one of the year's ordinary events */
function storyKeep(s){if(!s.alive||!s.story)return;
  for(const id of stLive(s)){const r=s.story[id],D=STORY[id];if(!D){r.st='lapsed';continue}
    if(r.pid){const p=person(s,r.pid);if(p&&!p.alive){if(D.gone)D.gone(s,r,p);else stEnd(s,id,'lapsed');continue}}
    if(D.check&&D.check(s,r)===false)continue;
    const exp=D.exp??12;if(s.age>r.next+exp){if(D.lapseF)D.lapseF(s,r);else{if(D.lapse)sayT(s,D.lapse,'muted');stEnd(s,id,'lapsed')}}}}
function storyDue(s){if(!s.alive||!s.story||s.jail>0||s._styr===s.age)return null;
  const due=stLive(s).map(id=>stStage(id,s.story[id].stage)).filter(i=>i&&i.when(s)&&(i.self||s.age>=s.story[i.story].next+1));
  if(!due.length)return null;const i=pick(due);return chance(i.self?.8:.55)?i:null}
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);try{storyKeep(s)}catch(e){console.error(e)}return r}})();
(()=>{const pk=pickIncident;pickIncident=function(s,tag){if(!tag){const i=storyDue(s);if(i){s._styr=s.age;return i}}return pk.apply(this,arguments)}})();
/* a year taken up by milestones still lets a waiting story through, if nothing else is pending */
(()=>{const a0=ageUp;ageUp=function(s){const before=s.age;const r=a0.apply(this,arguments);
  if(s.age!==before&&s.alive&&!s.queue.length){const i=storyDue(s);if(i){s._styr=s.age;runIncident(s,i)}}return r}})();
/* unfinished business: one line per story in progress, with a shortcut to where its next step happens */
const ST_HINTS=new Map();
(()=>{const oq=openQuests;openQuests=function(s){const q=oq(s);if(!s.alive)return q;
  for(const id of stLive(s)){const r=s.story[id],D=STORY[id];if(!D||!D.hint)continue;let h=D.hint[r.stage];if(typeof h==='function')h=h(s,r,stCtx(s,id));if(!h)continue;
    const key=id+':'+r.stage+':'+h.zh;let o=ST_HINTS.get(key);
    if(!o){o=T(`${D.n.en}: ${h.en}`,`【${D.n.zh}】${h.zh}`);ST_HINTS.set(key,o);const inc=stStage(id,r.stage);
      if(inc&&typeof QGO!=='undefined'){const tags=(inc.tags||[]).slice();tags.forEach(t=>{if(/^af_/.test(t)&&!QACT[t]&&ACT_BY[t.slice(3)])QACT[t]=t.slice(3)});QGO.set(o,{k:'st_'+id,tags})}}
    q.push(o)}
  return q}})();
