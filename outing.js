/* 江湖一生 · 出门走走: one activity in place of ten. Roaming the jianghu, a teahouse, a tavern, a pleasure trip, a
   sparring bout, a visit to a famous master, a good deed, the arena stage, seeking a master and a longer journey are folded into a single outing, and the day decides which it becomes (the ones
   that fit your life and the season are likelier). Outings have their own allowance, three a season, and cost no energy.
   The ten still exist underneath, so stories that send you roaming still work. */
'use strict';
const OUT_PER_SEASON=3;
const OUT_KINDS=[
 ['wander',(s)=>3+(s.fame>=30?1:0),[T('You head out with no plan at all, which is the plan.','你出了门，什么打算都没有，这就是打算。'),T('Your feet choose the road today.','今天往哪儿走，由脚说了算。')]],
 ['teahouse',(s)=>2,[T('Rain drives you into a teahouse just as the storyteller begins.','一场雨把你赶进了茶馆，说书先生正好开讲。'),T('You end up at the teahouse, the way you often do.','你又晃到了茶馆，跟往常一样。')]],
 ['tavern',(s)=>s.happy<40?2.4:1.4,[T('A tavern sign creaks in the wind and you go in.','酒旗在风里吱呀作响，你走了进去。'),T('An old friend’s favourite tavern is on the way. You stop.','路过一家老友爱去的酒楼，你停下了脚。')]],
 ['sparring',(s)=>(typeof bottled==='function'&&bottled(s)?2.6:2)+(s.sect?.5:0),[T('You hear training shouts from a martial hall and cannot help yourself.','听见武馆里传出操练的吆喝声，你忍不住走了进去。'),T('Someone at the crossroads is looking for a bout. So are you.','路口有人在找人比划。正好你也手痒。')]],
 ['sightsee',(s)=>[0,2].includes(HSEA(s))?2:1.1,[T('The weather is too good to waste in town.','天气好得不该窝在城里。'),T('You hear the plum blossom is out in the hills, and go to see.','听说山里的梅花开了，你去看了看。')]],
 ['gooddeed',(s)=>s.align>=30?2.6:1.6,[T('A commotion down the lane. Someone needs help.','巷子里一阵吵嚷，有人需要帮忙。'),T('You see a face in the crowd that looks like trouble, and someone who looks like its victim.','人群里有张脸，一看就是要生事的，旁边还有个一看就要吃亏的。')]],
 ['arena',(s)=>(s.fame>=30?1.7:1.2)+(power(s)>=60?.4:0),[T('Drums from the square: a challenge stage is open today.','广场上鼓声咚咚：今天有人摆了擂台。'),T('A crowd has gathered round a fighting stage. The prize is posted on a red banner.','一群人围着一座擂台，奖金写在红布条上。')]],
 ['master',(s)=>s.age<40?1.4:.5,[T('In a roadside village people speak of an old recluse in the hills who once taught kings.','路边村子里，人们说起山里一位隐居的老人，据说当年教过王侯。'),T('A stranger at an inn watches you practise in the yard, and nods.','客栈院子里，一个陌生人看你练功，点了点头。')]],
 ['seekmaster',(s)=>2.2,[T('You hear a famous master lives nearby, and go to ask for a few exchanges.','听说附近住着一位成名多年的高手，你登门求教几招。'),T('A great name is passing through town. You send in your card.','一位大名鼎鼎的人物路过此地。你递上了名帖。')]],
 ['journey',(s)=>.5,[T('A caravan is leaving for distant parts, and they have room for one more.','有支商队要远行，正好还空着一个位置。'),T('Someone mentions a far province, and you find you want to see it.','有人说起一个遥远的地方，你发现自己想去看看。')]]];
const outLeft=s=>{const t=tIdx(s);if(s.outT!==t){s.outT=t;s.outN=0}return Math.max(0,OUT_PER_SEASON-(s.outN||0))};
const outOk=(s,id)=>{const a=ACT_BY[id];return a&&(!a.if||a.if(s))&&actOk(s,a)===true};
addAct({id:'outing',ap:0,cat:'jh',n:T('Head out','出门走走'),
 get d(){const s=typeof S!=='undefined'?S:null,n=s?outLeft(s):OUT_PER_SEASON;return T(`Let the day decide: roaming, a teahouse or tavern, a bout, a pleasure trip, or a longer journey. No energy · ${n} left this season.`,`去哪儿由不得你：闯荡江湖、茶馆酒楼、切磋、行侠仗义、打擂台、寻访名师、游山玩水，或是一趟远行。不耗行动力 · 本季还能出门${cnNum(n)}次。`)},
 ok:s=>s.age<6?needAge(s,6):s.jail>0?notJail(s):outLeft(s)<=0?T('You have been out enough this season','这一季出门够多了'):OUT_KINDS.some(k=>outOk(s,k[0]))?true:T('Nowhere to go right now','眼下哪儿也去不了'),
 run(s){outLeft(s);s.outN=(s.outN||0)+1;const ok=OUT_KINDS.filter(k=>outOk(s,k[0]));const k=wpick(ok,x=>x[1](s));if(!k)return;
   const l=pick(k[2]);say(s,l.en,l.zh,'muted');ACT_BY[k[0]].run(s)}});
/* move it to the top of 江湖, and take the ten out of the list */
/* while you are stuck at a bottleneck, a year of seclusion would be wasted: 冲击瓶颈 stands in for it */
(()=>{const a=ACT_BY.seclusion;if(!a)return;const if0=a.if;a.if=s=>(!if0||if0(s))&&!(typeof bottled==='function'&&bottled(s))})();
(()=>{const i=ACTS.findIndex(a=>a.id==='outing');const a=ACTS.splice(i,1)[0];const j=ACTS.findIndex(x=>x.cat==='jh');ACTS.splice(j<0?ACTS.length:j,0,a);
  OUT_KINDS.forEach(([id])=>{const x=ACT_BY[id];if(x){x.cat0=x.cat;x.cat='outing_in'}})})();
