/* 江湖一生 · keeping to the customs of the jianghu: who a sect will take, and how sects really recruit */
'use strict';

/* Shaolin takes only men; Emei and the Flower Shadow Palace only women; Hidden Orchid Valley almost never takes a man */
SECTS.shaolin.male=1;SECTS.emei.female=1;SECTS.yihua.female=1;SECTS.gumu.mostlyFemale=1;
function sectTakes(s,id){const S=SECTS[id];if(!S)return false;if(S.male&&s.gender!=='m')return false;if(S.female&&s.gender!=='f')return false;return true}
const recruitW=(s,id)=>sectTakes(s,id)?(SECTS[id].mostlyFemale&&s.gender==='m'?.15:1):0;
/* a safety net: if anything tries to put someone in a sect that would never take them, send them to the nearest one that would */
const _joinSect2=joinSect;
joinSect=function(s,id){if(!sectTakes(s,id))id=s.gender==='f'?'emei':'shaolin';_joinSect2(s,id)};

/* the sects that might come looking for a child here: one at a time, never a crowd */
const localSects=s=>region(s).sects.concat(MORE_SECTS[s.region]||[]).filter((x,i,a)=>a.indexOf(x)===i&&!isEvil(x)&&!SECTS[x].hidden&&sectTakes(s,x));
const RECRUITER=[[T('an elder','一位长老'),T('elder','长老')],[T('a senior disciple','一位大弟子'),T('senior disciple','大弟子')],[T('the master’s own younger brother','掌门师弟'),T('master’s brother','掌门师弟')]];
(()=>{const I0=INC_BY.trial;if(!I0)return;
 Object.assign(I0,{age:[8,14],when:s=>!s.sect&&!['temple','cult'].includes(s.family)&&s.seen.trial==null&&localSects(s).length>0&&chance(s.age>=13?.5:.2),
  ctx:s=>{const ids=localSects(s);const sid=wpick(ids,id=>recruitW(s,id)*(region(s).sects.includes(id)?2:1))||ids[0];const r=pick(RECRUITER);return{sid,who:r[0]}},
  text:(c,s)=>T(`${c.who.en[0].toUpperCase()+c.who.en.slice(1)} of ${SE(c.sid)} passes through on the sect’s business and stops in the town square. Word goes round that ${SECTS[c.sid].en} is looking for children with good bones.`,
    `${SZ(c.sid)}的${c.who.zh}为门中事务路过此地，在镇上广场歇脚。消息传开：${SZ(c.sid)}要挑几个根骨好的孩子。`),
  opts:[{l:(c,s)=>T('Go and have your bones read','去摸骨'),sub:(c,s)=>SECTS[c.sid].blurb,
    out:[{w:(s,c)=>3+(s.t.root+s.t.wit)/2+(SECTS[c.sid].easy?6:0)+(s.family==='clan'?4:0),t:c=>T(`The examiner holds your wrist a long moment, then nods. You are now an outer disciple of ${SE(c.sid)}.`,`考官握着你的手腕许久，终于点了点头。你成了${SZ(c.sid)}的外门弟子。`),c:'good',fx:{f:(s,c)=>joinSect(s,c.sid)}},
     {w:6,t:T('The examiner presses your wrist and shakes his head. "Ordinary bones." You walk home without looking back.','考官捏了捏你的手腕，摇了摇头："根骨平平。"你头也不回地走回了家。'),c:'bad',fx:{happy:-8}},
     {w:s=>s.t.luck/3,t:T('You fail the bone reading, but an old sweeper at the inn says, "Come find me at the back hill."','你没通过摸骨，可客栈门口扫地的老头低声说："来后山找我。"'),c:'gold',fx:{f:s=>{const m=mkPerson(s,{rel:'master',age:rint(70,90),bond:65,lv:rint(140,200),extra:{art:pick(['vajra','bagua','spring','swallow'])}});s.people.push(m)}}}]},
   {l:(c,s)=>s.family==='scholar'?T('Stay home and study for the exams','留在家中，苦读应考'):T('Stay with your family','留在爹娘身边'),sub:T('A quieter road. Maybe a longer one.','一条更平静的路，也许更长。'),
    out:[{t:T('You stay home. By evening the square is empty again.','你没去。傍晚时，广场上又空了。'),c:'muted',fx:{smarts:3}}]}]});
})();
/* a foundling girl is left at a nunnery, not a monastery */
(()=>{const I0=INC_BY.temple;if(!I0)return;
 I0.text=(c,s)=>s.gender==='f'?T('The convent that took you in turns out to be a lower house of Emei.','收留你的庵堂，原来是峨眉派的下院。'):T('The temple turns out to be a branch of Shaolin.','原来这座寺是少林的下院。');
 I0.out=[{t:(c,s)=>s.gender==='f'?T('The abbess cuts your hair short and enrols you as a novice.','师太为你剪短头发，收你做了小尼姑。'):T('The abbot shaves your head and enrols you as a novice.','方丈为你剃度，收你做了小沙弥。'),c:'good',fx:{f:s=>joinSect(s,s.gender==='f'?'emei':'shaolin')}}];
})();
/* an elder who sees you fight belongs to a sect that would take you */
(()=>{const I0=INC_BY.mountainsect;if(!I0)return;I0.ctx=s=>{const ks=Object.keys(SECTS).filter(k=>!isEvil(k)&&!SECTS[k].hidden&&sectTakes(s,k));return{sid:pick(ks)}}})();
/* the sect gate: only the sects that would take you are worth the walk */
(()=>{const J=ACT_BY.joinsect;const ch=J.choose;
 J.run=s=>ask(s,'joinsect',{},localSects(s).map(id=>({k:id,l:T(SE(id),SZ(id)),sub:SECTS[id].blurb})).concat([{k:'leave',l:T('Not now','改日再说')}]));
 J.choose=(s,k,c)=>{if(k!=='leave'&&SECTS[k]&&SECTS[k].mostlyFemale&&s.gender==='m'&&!chance(.15)){say(s,'Nobody answers at the valley gate. An orchid bee circles you, then leaves.','幽兰谷无人应门。一只幽兰蜂绕着你飞了一圈，飞走了。','muted');return}return ch(s,k,c)}})();
