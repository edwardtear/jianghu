/* 江湖一生 · the sects and each other: who is allied, who is cold, who has an old feud; and how each sect regards you.
   What you do to a sect's people moves that sect's opinion of you, and a little of its friends' and enemies' too. */
'use strict';

/* ---------- how the sects stand with each other: +2 allied, +1 friendly, 0 neutral, -1 cold, -2 feud ---------- */
const SECT_PAIRS=[
 ['shaolin','wudang',2],['shaolin','beggar',2],['wudang','beggar',1],['emei','wudang',1],['emei','shaolin',1],['hengs','hengn',2],['huashan','taishan',1],['songshan','taishan',1],
 ['huashan','songshan',-2],['emei','qingcheng',-1],['tang','qingcheng',-1],['tang','leihuo',-1],['tang','emei',-1],['tianshan','kunlun',-2],['kongtong','kunlun',-1],
 ['quanzhen','gumu',-1],['mingjiao','shaolin',-1],['mingjiao','wudang',-1],['mingjiao','emei',-2],['mingjiao','kongtong',-1],['xueshan','tianchi',-1],['yihua','lingshi',-1],
 ['cangshan','baicao',1],['baicao','emei',1],['jianlu','lingshi',1],['lingyu','hengn',1],['peach','beggar',1],['wangyou','qingcheng',1],['tianshan','tianchi',1],
 ['wudu','erengu',1],['xingxiu','xuedao',1],['haisha','haijiao',-2],['qinglong','jinqian',1],['tiequan','feiying',1],['sunmoon','qinglong',1],['xuedao','tuoling',1]];
const SREL={};SECT_PAIRS.forEach(([a,b,v])=>{(SREL[a]=SREL[a]||{})[b]=v;(SREL[b]=SREL[b]||{})[a]=v});
const LONER=['peach','wangyou','xiaoyao','gumu'];
function sectRel(a,b){if(!a||!b||!SECTS[a]||!SECTS[b])return 0;if(a===b)return 2;const v=SREL[a]&&SREL[a][b];if(v!=null)return v;
  const ea=isEvil(a),eb=isEvil(b);if(ea&&eb)return -1;if(ea!==eb)return LONER.includes(ea?b:a)?-1:-2;return 0}
const RELNAME={2:T('allied','同盟'),1:T('on good terms','交好'),0:T('neutral','互不往来'),'-1':T('cold','不和'),'-2':T('old enemies','世仇')};

/* ---------- how each sect regards you ---------- */
const sst=(s,id)=>(s.sst&&s.sst[id])||0;
function sAdj(s,id,n,quiet){if(!id||!SECTS[id]||!n)return;s.sst=s.sst||{};
  const one=(k,v)=>{s.sst[k]=clamp(Math.round((s.sst[k]||0)+v),-100,100)};one(id,n);
  Object.keys(SECTS).forEach(k=>{if(k===id)return;const r=sectRel(id,k);if(r>=1)one(k,n*(r===2?.5:.25));else if(r<=-1&&n>0)one(k,-n*(r===-2?.35:.15))});
  if(!quiet&&Math.abs(n)>=6)say(s,n>0?`${SECTS[id].en} will remember this kindly.`:`${SECTS[id].en} will not forget this.`,n>0?`${SECTS[id].cn}会记着你的好。`:`${SECTS[id].cn}记下了这笔账。`,'muted')}
const SSTN=v=>v>=60?T('revere you','敬重你'):v>=25?T('are friendly','对你友善'):v>-25?T('are neutral','对你无感'):v>-60?T('dislike you','对你不满'):T('are hostile','视你为敌');
/* joining and leaving shape it; a sect with a deep grudge will not take you */
(()=>{const j0=joinSect;joinSect=function(s,id){const r=j0.apply(this,arguments);sAdj(s,id,30,1);return r}})();
(()=>{const l0=leaveSect;leaveSect=function(s){const id=s.sect;const r=l0.apply(this,arguments);if(id)sAdj(s,id,-25,1);return r}})();
(()=>{const t0=sectTakes;sectTakes=function(s,id){return t0(s,id)&&sst(s,id)>-40}})();
(()=>{const A=ACT_BY.joinsect;if(!A)return;const r0=A.run;A.run=function(s){r0.call(A,s);const q=s.queue[s.queue.length-1];if(!q||q.id!=='joinsect')return;
  q.opts=q.opts.filter(o=>o.k==='leave'||sst(s,o.k)>-40);q.opts.forEach(o=>{if(o.k!=='leave'&&sst(s,o.k)>=25)o.sub=T(`${o.sub?o.sub.en+' ':''}They think well of you.`,`${o.sub?o.sub.zh+' ':''}该派对你印象不错。`)})};
  const c0=A.choose;A.choose=function(s,k,c){if(k!=='leave'&&sst(s,k)>=25&&!s.sect&&chance(.35)){joinSect(s,k);say(s,`They have heard of you. The examiner waves you through.`,`他们听说过你。考官摆摆手，让你直接进了门。`,'good');return}return c0.call(A,s,k,c)}})();
/* what you do to a sect's people, the sect remembers: hooked to the life record */
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){const c=q.c;
  const r=ci(s,q,k);if(c&&c.npc&&c.npc.sect&&!/^sx_/.test(q.id)&&s.mem&&s.mem.length){const last=s.mem[s.mem.length-1];if(last&&last.at===s.age&&last.who&&last.who.n===c.npc.n&&!last.who.sect){last.who.sect=c.npc.sect;sAdj(s,c.npc.sect,{helped:8,wronged:-12,beat:-3}[last.kind]||0)}}return r}})();

/* ---------- people of the sects: encounters built from who is around and how their sects get on ---------- */
const regSects=s=>{const r=REGIONS.find(x=>x.id===s.region)||REGIONS[0];return r.sects.concat(MORE_SECTS[r.id]||[],EVIL_SECTS[r.id]||[]).filter((k,i,a)=>a.indexOf(k)===i&&SECTS[k]&&!SECTS[k].hidden)};
function sectPair(s,want){const ks=regSects(s);const ps=[];ks.forEach(a=>ks.forEach(b=>{if(a<b&&want(sectRel(a,b)))ps.push([a,b])}));
  if(!ps.length)SECT_PAIRS.forEach(([a,b,v])=>{if(want(v)&&!SECTS[a].hidden&&!SECTS[b].hidden)ps.push([a,b])});return ps.length?pick(ps).sort(()=>R()-.5):null}
const sdisc=(s,id,o={})=>{const p=npc(s,Object.assign({occ:SECTS[id]&&SECTS[id].female?14:pick([13,14]),age:rint(18,40),lv:PW(o.m||.95,o.r||5)(s)},o));p.sect=id;
  const t=T(SECTS[id].en,SECTS[id].cn);p.desc=T(`a disciple of ${t.en}`,`${t.zh}弟子`);return p};
const SN=id=>T(SECTS[id].en,SECTS[id].cn);
const SI=d=>{d.tags=d.tags||[];I(d)};

SI({id:'sx_brawl',age:[14,70],cd:6,w:1.3,when:s=>!!sectPair(s,v=>v<=-1),
 ctx:s=>{const c=scene();const pr=sectPair(s,v=>v<=-1);c.a=pr[0];c.b=pr[1];c.npc=sdisc(s,c.a);c.foe2=sdisc(s,c.b);return c},
 text:c=>T(`At ${c.place.en}, ${c.npc.en} of ${SN(c.a).en} and ${c.foe2.en} of ${SN(c.b).en} are at each other's throats. The two sects are ${RELNAME[sectRel(c.a,c.b)].en}, and everyone else has backed away.`,`${c.place.zh}，${SN(c.a).zh}的${c.npc.zh}和${SN(c.b).zh}的${c.foe2.zh}吵得要动手。两派${RELNAME[sectRel(c.a,c.b)].zh}，旁人都躲得远远的。`),
 opts:[{l:c=>T(`Side with ${SN(c.a).en}`,`帮${SN(c.a).zh}`),fight:(s,c)=>({foe:{name:T(c.foe2.en,c.foe2.zh),lv:c.foe2.lv},stakes:'light',title:T('Taking sides','拔刀相助'),cause:T('a sect quarrel','门派之争')}),
   win:[{w:2,t:c=>T(`${c.foe2.en} retreats. ${c.npc.en} thanks you warmly, and so, later, does ${SN(c.a).en}.`,`${c.foe2.zh}退走了。${c.npc.zh}再三道谢，后来${SN(c.a).zh}也记下了你的人情。`),c:'good',fx:{f:(s,c)=>{sAdj(s,c.a,8);sAdj(s,c.b,-8)},meet:'acq',bond:65}},
     {w:1,t:c=>T(`You win, but ${c.foe2.en} goes straight back to ${SN(c.b).en} and tells it badly.`,`你赢了，可${c.foe2.zh}转头就回${SN(c.b).zh}添油加醋说了一通。`),c:'muted',fx:{f:(s,c)=>{sAdj(s,c.a,5);sAdj(s,c.b,-12)}}}],
   lose:[{w:1,t:T('You are both beaten. At least you were on the same side.','你们俩都挨了打。好歹是站在一边挨的。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.a,4);sAdj(s,c.b,-4)}}}]},
  {l:c=>T(`Side with ${SN(c.b).en}`,`帮${SN(c.b).zh}`),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.npc.lv},stakes:'light',title:T('Taking sides','拔刀相助'),cause:T('a sect quarrel','门派之争')}),
   win:[{w:2,t:c=>T(`${c.npc.en} retreats. ${SN(c.b).en} hears of it and is grateful.`,`${c.npc.zh}退走了。${SN(c.b).zh}听说后，很是承情。`),c:'good',fx:{f:(s,c)=>{sAdj(s,c.b,8);sAdj(s,c.a,-8)}}}],
   lose:[{w:1,t:T('You lose, and both sects think less of you.','你输了，两派都看轻了你。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.a,-5);sAdj(s,c.b,2)}}}]},
  {l:T('Step between them and make peace','上前劝和'),out:[{w:s=>.6+s.fame/40+s.smarts/80,t:T('Somehow you talk them both down. Each goes home and mentions your name.','你居然把两边都劝住了。两人回去都提起了你的名字。'),c:'good',fx:{fame:2,f:(s,c)=>{sAdj(s,c.a,4);sAdj(s,c.b,4)}}},{w:1,t:T('Both of them turn on you instead.','两人反倒一起冲你来了。'),c:'bad',fx:{hurt:[5,14],cause:T('a sect quarrel','门派之争'),f:(s,c)=>{sAdj(s,c.a,-3);sAdj(s,c.b,-3)}}}]},
  {l:T('Keep out of it','不掺和'),out:[{w:2,t:T('It ends in bruises and a broken table. Not your business.','最后打碎了一张桌子，各自挂了彩。不关你的事。'),c:'muted'},{w:1,t:T('Someone is badly hurt. You wonder if you should have stepped in.','有人伤得很重。你想，刚才是不是该出手。'),c:'muted',fx:{happy:-2}}]}]});

SI({id:'sx_hidden',age:[15,70],cd:10,w:1,when:s=>!!sectPair(s,v=>v<=-2),
 ctx:s=>{const c=scene();const pr=sectPair(s,v=>v<=-2);c.a=pr[0];c.b=pr[1];c.npc=sdisc(s,c.a,{m:.8});c.lv2=PW(1,6)(s);return c},
 text:c=>T(`${c.npc.en}, a wounded disciple of ${SN(c.a).en}, stumbles into your yard at night. Torches on the road: men of ${SN(c.b).en} are searching. The two sects are old enemies.`,`深夜，${SN(c.a).zh}一个受了伤的弟子${c.npc.zh}跌进了你家院子。路上火把晃动，是${SN(c.b).zh}的人在搜。两派是世仇。`),
 opts:[{l:T('Hide them','把人藏起来'),out:[{w:s=>1.2+s.smarts/60,t:c=>T(`The torches pass. At dawn ${c.npc.en} bows to the ground and goes. ${SN(c.a).en} will hear of this.`,`火把过去了。天亮时${c.npc.zh}给你磕了个头，走了。${SN(c.a).zh}会知道这件事的。`),c:'good',fx:{align:3,meet:'acq',bond:75,f:(s,c)=>sAdj(s,c.a,12)}},
   {w:1,t:c=>T(`They search the yard and find ${c.npc.en}. Now ${SN(c.b).en} counts you among its enemies.`,`他们搜了院子，找到了${c.npc.zh}。如今${SN(c.b).zh}把你也算作了仇人。`),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.a,6);sAdj(s,c.b,-15)}}}]},
  {l:T('Hand them over','把人交出去'),out:[{w:2,t:c=>T(`${SN(c.b).en} thanks you coldly. You do not sleep well.`,`${SN(c.b).zh}冷冷地谢了你。你那晚没睡好。`),c:'bad',fx:{align:-5,f:(s,c)=>{sAdj(s,c.b,6);sAdj(s,c.a,-15)}}},{w:1,t:c=>T(`${c.npc.en} escapes on the way. Both sects now think the worst of you.`,`${c.npc.zh}在半路上逃了。如今两派都把你想得很坏。`),c:'bad',fx:{align:-3,f:(s,c)=>{sAdj(s,c.b,-4);sAdj(s,c.a,-10)}}}]},
  {l:T('Stand in the gate and send the searchers away','站在门口，把搜的人挡回去'),fight:(s,c)=>({foe:{name:T(`men of ${SECTS[c.b].en}`,`${SECTS[c.b].cn}的人`),lv:c.lv2,fixed:1},stakes:'injury',title:T('At the gate','门口'),cause:T('a sect feud','门派仇杀')}),
   win:[{w:1,t:c=>T(`They leave, promising to come back. ${SN(c.a).en} will owe you for this.`,`他们走了，扬言还会回来。${SN(c.a).zh}欠你一个大人情。`),c:'gold',fx:{fame:3,meet:'friend',bond:80,f:(s,c)=>{sAdj(s,c.a,18);sAdj(s,c.b,-18)}}}],
   lose:[{w:1,t:T('They beat you and take the wounded one away.','他们打倒了你，把伤者带走了。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.a,6);sAdj(s,c.b,-10)}}}]}]});

SI({id:'sx_sneer',age:[14,60],cd:6,w:2.5,when:s=>!!s.sect&&!s.retired&&Object.keys(SECTS).some(k=>sectRel(s.sect,k)<=-1),
 ctx:s=>{const c=scene();const ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&sectRel(s.sect,k)<=-1);const loc=ks.filter(k=>regSects(s).includes(k));c.a=pick(loc.length?loc:ks);c.my=s.sect;c.npc=sdisc(s,c.a,{m:1});return c},
 text:(c,s)=>T(`${c.npc.en} of ${SN(c.a).en} sees the ${SECTS[s.sect].en} badge on you and laughs. "So this is what ${SECTS[s.sect].en} passes off as a disciple now." Your sects are ${RELNAME[sectRel(s.sect,c.a)].en}.`,`${SN(c.a).zh}的${c.npc.zh}看见你身上${SECTS[s.sect].cn}的标记，笑出了声："${SECTS[s.sect].cn}如今就收这种货色？"两派${RELNAME[sectRel(s.sect,c.a)].zh}。`),
 opts:[{l:T('Settle it with a bout','比试一场'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.npc.lv},stakes:'light',title:T('Sect honour','门派颜面'),cause:T('a quarrel between sects','两派口角')}),
   win:[{w:2,t:(c,s)=>T(`You win, and the story reaches ${SECTS[c.my||s.sect].en} before you do.`,`你赢了，这事比你先一步传回了${SECTS[c.my||s.sect].cn}。`),c:'good',fx:{fame:2,merit:3,f:(s,c)=>sAdj(s,c.a,-4,1)}},{w:1,t:T('You win. The elders are pleased, and a little worried about what comes next.','你赢了。长老们很高兴，也有点担心后头的事。'),c:'muted',fx:{merit:2,f:(s,c)=>sAdj(s,c.a,-6,1)}}],
   lose:[{w:1,t:T('You lose, and your sect hears about it.','你输了，门里也听说了。'),c:'bad',fx:{fame:-2,merit:-2}}]},
  {l:T('Answer with wit, not fists','动口不动手'),out:[{w:s=>s.smarts/30+s.t.wit*.1,t:T('Your reply gets a laugh from the whole street, at their expense.','你一句话，整条街都笑了，笑的是对方。'),c:'good',fx:{fame:1}},{w:1,t:T('It falls flat. They laugh harder.','话没接住，对方笑得更欢了。'),c:'muted',fx:{fame:-1}}]},
  {l:T('Let it go','忍了'),out:[{w:1,t:T('You walk on. It is harder than fighting.','你走开了。这比打一架还难。'),c:'muted',fx:{happy:-2}},{w:1,t:c=>T(`Later you hear ${c.npc.en} was surprised, and a little ashamed.`,`后来你听说，${c.npc.zh}有些意外，也有点惭愧。`),c:'good',fx:{f:(s,c)=>sAdj(s,c.a,3,1)}}]}]});

SI({id:'sx_allytask',age:[16,60],cd:6,w:2.5,when:s=>!!s.sect&&!s.retired&&Object.keys(SECTS).some(k=>k!==s.sect&&sectRel(s.sect,k)>=1),
 ctx:s=>{const c=scene();const ks=Object.keys(SECTS).filter(k=>k!==s.sect&&!SECTS[k].hidden&&sectRel(s.sect,k)>=1);c.a=pick(ks);c.npc=sdisc(s,c.a);const ev=Object.keys(SECTS).filter(k=>isEvil(k)&&!SECTS[k].hidden);c.e=pick(ev);c.lv2=PW(1.05,6)(s);return c},
 text:(c,s)=>T(`${SN(c.a).en}, friends of ${SECTS[s.sect].en}, sends ${c.npc.en} to ask for help: ${SN(c.e).en} has been raiding their caravans.`,`与${SECTS[s.sect].cn}交好的${SN(c.a).zh}派${c.npc.zh}来求援：${SN(c.e).zh}屡屡劫他们的货。`),
 opts:[{l:T('Go with them','随对方同去'),fight:(s,c)=>({foe:{name:T(`raiders of ${SECTS[c.e].en}`,`${SECTS[c.e].cn}的人马`),lv:c.lv2,fixed:1},stakes:'injury',title:T('Allies','同道之谊'),cause:T('a raid on a caravan','劫货的贼人')}),
   win:[{w:2,t:c=>T(`The raiders scatter. ${SN(c.a).en} sends a letter of thanks to your master.`,`贼人四散。${SN(c.a).zh}给你师父送来一封谢函。`),c:'gold',fx:{merit:8,fame:2,meet:'friend',bond:70,f:(s,c)=>{sAdj(s,c.a,12);sAdj(s,c.e,-10,1)}}},{w:1,t:T('You win, but one of their disciples dies. The thanks are quiet.','打赢了，可对方折了一个弟子。谢意也就淡淡的。'),c:'muted',fx:{merit:4,f:(s,c)=>sAdj(s,c.a,5)}}],
   lose:[{w:1,t:T('It goes badly. Still, they remember that you came.','打得很糟。不过，对方记得你来了。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,5)}}]},
  {l:T('Say your sect cannot spare you','说门里抽不开身'),out:[{w:1,t:c=>T(`${c.npc.en} leaves, polite and disappointed.`,`${c.npc.zh}客客气气地走了，看得出很失望。`),c:'muted',fx:{f:(s,c)=>sAdj(s,c.a,-4,1)}},{w:1,t:T('They manage without you, and say so.','他们没有你也办成了，还特意说了一声。'),c:'muted',fx:{f:(s,c)=>sAdj(s,c.a,-6)}}]}]});

SI({id:'sx_love',age:[16,32],cd:15,once:1,w:1.6,when:s=>!!s.sect&&!s.retired&&!spouseOf(s)&&Object.keys(SECTS).some(k=>sectRel(s.sect,k)<=-1),
 ctx:s=>{const c=scene();const ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&sectRel(s.sect,k)<=-1&&(!SECTS[k].female||s.gender==='m')&&(!SECTS[k].male||s.gender==='f'));c.a=pick(ks.length?ks:['tang']);c.npc=sdisc(s,c.a,{sex:s.gender==='m'?'f':'m',age:rint(Math.max(16,s.age-4),s.age+4)});return c},
 text:(c,s)=>T(`You keep meeting ${c.npc.en} of ${SN(c.a).en} on the same mountain path, by accident and then not by accident. Your sects are ${RELNAME[sectRel(s.sect,c.a)].en}.`,`你总在同一条山路上碰见${SN(c.a).zh}的${c.npc.zh}，先是碰巧，后来就不是碰巧了。两派${RELNAME[sectRel(s.sect,c.a)].zh}。`),
 opts:[{l:T('Keep meeting in secret','偷偷来往'),out:[{w:2,t:T('For a season it is the best secret of your life.','那一季，是你这辈子最好的秘密。'),c:'good',fx:{meet:'lover',bond:80,happy:6}},{w:1,t:T('Someone sees. Both sects are furious; your elders punish you.','被人撞见了。两派都气坏了，长老罚了你。'),c:'bad',fx:{meet:'lover',bond:85,merit:-10,f:(s,c)=>{sAdj(s,c.a,-8);sAdj(s,s.sect,-10,1)}}}]},
  {l:T('Ask both masters for permission','去求两边的师父'),out:[{w:s=>.4+s.fame/60+sst(s,s.sect)/80,t:T('Against all expectation, they agree. People say it may even mend things between the sects.','出乎所有人意料，两边都点了头。有人说，这说不定还能让两派和缓些。'),c:'gold',fx:{meet:'lover',bond:85,fame:3,f:(s,c)=>sAdj(s,c.a,10)}},{w:1,t:T('Both refuse. You are forbidden to see each other.','两边都不答应。你们被禁止再见面。'),c:'bad',fx:{happy:-10,f:(s,c)=>sAdj(s,c.a,-4,1)}}]},
  {l:T('End it before it starts','趁早断了'),out:[{w:1,t:T('You take a different path to practice. It is the right thing, probably.','你换了条路去练功。大概是对的吧。'),c:'muted',fx:{happy:-4}},{w:1,t:c=>T(`Years later you hear ${c.npc.en} never married. You are not sure what to do with that.`,`多年后你听说，${c.npc.zh}终身没有嫁娶。你不知道该怎么想这件事。`),c:'muted',fx:{happy:-3}}]}]});

SI({id:'sx_envoy',age:[18,85],cd:6,w:3,when:s=>Object.keys(SECTS).some(k=>k!==s.sect&&sst(s,k)>=20),
 ctx:s=>{const c=scene();const ks=Object.keys(SECTS).filter(k=>k!==s.sect&&!SECTS[k].hidden&&sst(s,k)>=20);c.a=pick(ks);c.npc=sdisc(s,c.a,{age:rint(35,60)});return c},
 text:c=>T(`${SN(c.a).en} sends ${c.npc.en} to your door with a gift and a letter. They have not forgotten what you did for them, and their gates are open to you.`,`${SN(c.a).zh}派${c.npc.zh}登门，带来一份礼和一封信。他们没忘记你做过的事，山门随时为你敞开。`),
 opts:[{l:T('Visit them','登门拜访'),out:[{w:2,t:c=>T(`You spend a month as their guest. An elder shows you something few outsiders see.`,`你在那里做了一个月的客。一位长老给你看了外人少见的东西。`),c:'gold',fx:{skill:[2,4],fame:2,f:(s,c)=>sAdj(s,c.a,5,1)}},{w:1,t:T('The visit is warm and dull. You eat very well.','这一趟热情又平淡。你吃得很好。'),c:'good',fx:{happy:4,f:(s,c)=>sAdj(s,c.a,3,1)}}]},
  {l:T('Accept the gift with thanks','收下礼，致谢'),out:[{w:1,t:T('A fine gift.','一份厚礼。'),c:'good',fx:{money:[40,160]}},{w:1,t:T('The gift is a sword of good steel.','礼是一把好钢打的剑。'),c:'good',fx:{money:[20,60],skill:1}}]}]});

SI({id:'sx_grudge',age:[16,85],cd:5,w:3,when:s=>Object.keys(SECTS).some(k=>sst(s,k)<=-25&&!SECTS[k].hidden),
 ctx:s=>{const c=scene();const ks=Object.keys(SECTS).filter(k=>!SECTS[k].hidden&&sst(s,k)<=-25);c.a=pick(ks);c.npc=sdisc(s,c.a,{m:1.1,r:6});c.ally=Object.keys(SECTS).filter(k=>k!==c.a&&sst(s,k)>=30&&sectRel(k,c.a)>=0)[0]||null;return c},
 text:c=>T(`Three disciples of ${SN(c.a).en}, led by ${c.npc.en}, block the road. "${SECTS[c.a].en} has a long memory. Today you answer for it."`,`${SN(c.a).zh}的三名弟子拦住了路，领头的是${c.npc.zh}。"${SECTS[c.a].cn}记性好得很。今天你得给个交代。"`),
 opts:[{l:T('Fight','动手'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.npc.lv},stakes:'injury',title:T('A sect’s grudge','一派的旧账'),cause:T('a sect’s grudge','门派寻仇')}),
   win:[{w:2,t:c=>T(`You send them home. ${SN(c.a).en} hates you a little more, and fears you a little more.`,`你把他们打了回去。${SN(c.a).zh}更恨你了，也更怕你了。`),c:'muted',fx:{fame:2,f:(s,c)=>sAdj(s,c.a,-5,1)}}],
   lose:[{w:1,t:T('They leave you in the road. For them, the account is a little more even.','他们把你撂在路上走了。在他们看来，账算平了一点。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,8,1)}}]},
  {l:T('Pay reparations (100 taels)','赔一百两'),cost:100,out:[{w:2,t:T('They take it. It is a start.','他们收下了。总算开了个头。'),c:'muted',fx:{f:(s,c)=>sAdj(s,c.a,20,1)}},{w:1,t:T('They take it and spit at your feet.','他们收了钱，朝你脚边啐了一口。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,8,1)}}]},
  {l:c=>c.ally?T(`Ask ${SECTS[c.ally].en} to speak for you`,`请${SECTS[c.ally].cn}出面说和`):T('Ask a famous friend to speak for you','请有名望的朋友出面说和'),if:(s,c)=>!!c.ally||s.fame>=50,out:[{w:2,t:T('A word from the right people, and the matter is set aside.','有分量的人出面说了几句，这事就搁下了。'),c:'good',fx:{f:(s,c)=>sAdj(s,c.a,25,1)}},{w:1,t:T('They will not hear it.','对方不买账。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,-3,1)}}]}]});

SI({id:'sx_manual',age:[16,70],cd:12,w:.8,when:s=>!!sectPair(s,v=>v<=-1),
 ctx:s=>{const c=scene();const pr=sectPair(s,v=>v<=-1);c.a=pr[0];c.b=pr[1];c.npc=sdisc(s,c.a);return c},
 text:c=>T(`${c.npc.en} of ${SN(c.a).en} offers, quietly, to sell you pages copied from ${SN(c.b).en}'s manuals. Eighty taels. "They are our enemies anyway."`,`${SN(c.a).zh}的${c.npc.zh}悄悄要卖你几页从${SN(c.b).zh}秘籍里抄来的东西，八十两。"反正是我们的仇家。"`),
 opts:[{l:T('Buy them (80 taels)','买下（八十两）'),cost:80,out:[{w:2,t:T('Real pages. You learn something from them, and keep it to yourself.','是真东西。你从里头学到了些，也闭紧了嘴。'),c:'good',fx:{skill:[2,4],f:(s,c)=>sAdj(s,c.a,2,1)}},{w:1,t:c=>T(`${SN(c.b).en} finds out who bought them.`,`${SN(c.b).zh}查出了是谁买的。`),c:'bad',fx:{skill:[1,2],f:(s,c)=>sAdj(s,c.b,-20)}},{w:1,t:T('Nonsense, copied from a market storybook.','全是胡编，从集市上的话本里抄的。'),c:'muted',fx:{smarts:1}}]},
  {l:c=>T(`Warn ${SECTS[c.b].en}`,`去给${SECTS[c.b].cn}报信`),out:[{w:2,t:c=>T(`${SN(c.b).en} is grateful. ${SN(c.a).en} is not.`,`${SN(c.b).zh}很感激，${SN(c.a).zh}可不。`),c:'good',fx:{align:2,f:(s,c)=>{sAdj(s,c.b,12);sAdj(s,c.a,-10)}}},{w:1,t:T('They think you are trying to sell them something too.','他们以为你也是来卖东西的。'),c:'muted',fx:{f:(s,c)=>sAdj(s,c.b,-2,1)}}]},
  {l:T('Refuse','不要'),out:[{w:1,t:T('He shrugs and finds another buyer.','他耸耸肩，找下一个买主去了。'),c:'muted'},{w:1,t:T('Later you hear he was caught.','后来你听说，他被抓了。'),c:'muted'}]}]});

/* the sects in the news, and sometimes they change their minds about each other */
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.age<8||!chance(.3))return;const ks=regSects(s);if(ks.length<2)return;
  const a=pick(ks),b=pick(ks.filter(k=>k!==a));const r=sectRel(a,b);
  const L=r<=-2?[`Men of ${SECTS[a].en} and ${SECTS[b].en} fought at a ferry; three are dead, and the feud goes on.`,`${SECTS[a].cn}与${SECTS[b].cn}的人在渡口械斗，死了三个，两派的仇又深了一层。`]
   :r<=-1?[`${SECTS[a].en} and ${SECTS[b].en} trade insults over a disputed hillside.`,`${SECTS[a].cn}和${SECTS[b].cn}为一片山地互相指责。`]
   :r>=2?[`${SECTS[a].en} and ${SECTS[b].en} hold a joint ceremony; their masters drink from one cup.`,`${SECTS[a].cn}与${SECTS[b].cn}合办大典，两位掌门同饮一杯。`]
   :r>=1?[`Disciples of ${SECTS[a].en} and ${SECTS[b].en} marry. Both sects send gifts.`,`${SECTS[a].cn}与${SECTS[b].cn}的弟子结了亲，两派都送了礼。`]
   :[`${SECTS[a].en} and ${SECTS[b].en} keep to their own mountains, as always.`,`${SECTS[a].cn}与${SECTS[b].cn}照旧各守各的山头。`];
  if(r!==0||chance(.3))say(s,'[Jianghu] '+L[0],'【江湖】'+L[1],'news')}})();
