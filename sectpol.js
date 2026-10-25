/* 江湖一生 · 门派纷争: the sects are alive. In every life their relations drift: feuds over a stolen manual or a killed
   disciple, alliances sealed by marriage or a common enemy. A feud can become a war that runs over several years
   (skirmishes, spies and raids, a siege that decides it, then terms), and a sect head's death opens a succession fight.
   If it is your sect, you are called on; if you have no sect, the warring sides want to hire you; otherwise you hear
   the news. State: s.srel (relation overrides for this life), s.swar (the war under way), s.swarPast. */
'use strict';
var SP_S=null;
const spN=k=>T(SECTS[k].en,SECTS[k].cn);
const srKey=(a,b)=>a<b?a+'|'+b:b+'|'+a;
/* relations can change during a life */
(()=>{const r0=sectRel;sectRel=function(a,b){const o=(typeof S!=='undefined'&&S)||SP_S;if(o&&o.srel&&a&&b&&a!==b){const v=o.srel[srKey(a,b)];if(v!=null)return v}return r0(a,b)}})();
function srSet(s,a,b,v){s.srel=s.srel||{};s.srel[srKey(a,b)]=clamp(v,-2,2)}
const spSects=s=>{const ks=typeof regSects==='function'?regSects(s):[];if(s.sect&&!ks.includes(s.sect))ks.push(s.sect);return ks.filter(k=>SECTS[k]&&!SECTS[k].hidden)};
const FEUD_WHY=[T('a stolen manual','一本被盗的秘籍'),T('a disciple killed in a tavern brawl','一名弟子在酒楼斗殴中被杀'),T('a broken marriage pact','一桩毁了的婚约'),T('a quarrel over a mountain pass and its tolls','一处山口和它的过路钱'),T('an old insult at a martial assembly','一次武林大会上的旧怨'),T('a defector who took secrets with him','一个带着秘密叛逃的弟子')];
const ALLY_WHY=[T('a marriage between the two heads’ families','两家掌门结了儿女亲家'),T('a common enemy','共同的敌人'),T('an exchange of disciples','互派弟子交流'),T('a debt of gratitude from years ago','多年前欠下的一份恩情')];
/* how strong a sect is in a war: its standing, any recent defeat, and what you did for it */
const spStr=(s,k)=>1+(SECTS[k].evil?.1:0)+((s.sweak&&s.sweak[k]&&s.age-s.sweak[k]<12)?-.35:0)+R()*.6;
const SPI=d=>{d.only=1;d.noThread=1;d.noRipple=1;d.cd=0;I(d)};
const spCtx=s=>{const w=s.swar,c=scene();c.w=w;c.A=spN(w.a);c.B=spN(w.b);const mine=s.sect===w.a?w.a:s.sect===w.b?w.b:null;c.my=mine;c.foe=mine?(mine===w.a?w.b:w.a):null;c.F=c.foe?spN(c.foe):null;c.M=mine?spN(mine):null;c.npc=npc(s,{age:rint(20,45)});return c};
const spFoe=(c,s,m)=>({name:T(`${c.F.en} disciple`,`${c.F.zh}弟子`),lv:Math.max(4,Math.round(power(s)*(m||.9)*(.9+R()*.2))),fixed:1});
const spScore=(s,n)=>{if(s.swar)s.swar.score=(s.swar.score||0)+n};

/* ---------- your sect at war ---------- */
SPI({id:'sp_summon',text:c=>T(`The bell on the mountain rings three times: ${c.M.en} is at war with ${c.F.en}. Every disciple is called back.`,`山上的钟连响三声：${c.M.zh}与${c.F.zh}开战了。所有弟子即刻回山。`),
 opts:[{l:T('Answer the call and fight','应召出战'),fight:(s,c)=>({foe:spFoe(c,s,.9),stakes:'injury',title:T('The first clash','初战'),cause:T('a clash between sects','门派之间的厮杀')}),
   win:[{t:c=>T(`You hold the river crossing. The elders note your name.`,`你守住了渡口。长老们记下了你的名字。`),c:'good',fx:{fame:3,f:(s,c)=>{spScore(s,2);sAdj(s,c.my,8,1);sAdj(s,c.foe,-8,1)}}}],
   lose:[{t:T('You are carried back from the crossing on a door.','你是被人用门板从渡口抬回来的。'),c:'bad',fx:{f:(s,c)=>{spScore(s,-1);sAdj(s,c.my,3,1)}}}]},
  {l:T('Make an excuse and stay away','找个借口不去'),out:[{t:T('Nobody says anything. Everybody notices.','没人说什么。人人都看在眼里。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.my,-12,1)}}]},
  {l:T('Try to talk the two sides down','设法劝两边罢手'),out:[{w:s=>.3+s.t.wit*.08+s.fame/100,t:T('Against all odds, both sides agree to a month’s truce. It is a start.','出乎所有人意料，两边答应先停战一个月。总算是个开头。'),c:'gold',fx:{fame:4,f:s=>{if(s.swar)s.swar.heat=(s.swar.heat||0)-2}}},{w:1,t:T('Your own sect calls you soft, and theirs calls you a spy.','本门说你软弱，对方说你是奸细。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.my,-6,1);sAdj(s,c.foe,-4,1)}}}]}]});
SPI({id:'sp_spy',ctx:s=>{const c=spCtx(s);const f=living(s,'fellow')[0];c.spy=f?T(f.n.py,f.n.cn):T(c.npc.en,c.npc.zh);c.spyId=f?f.id:null;return c},
 text:c=>T(`You see ${c.spy.en}, one of your own sect, slipping a letter to a rider wearing ${c.F.en} colours.`,`你看见同门${c.spy.zh}把一封信塞给一个穿着${c.F.zh}服色的骑手。`),
 opts:[{l:T('Expose them to the elders','报给长老'),out:[{w:3,t:c=>T(`The letter holds the plans for the spring offensive. ${c.spy.en} is expelled, and you are trusted.`,`信里是开春进攻的部署。${c.spy.zh}被逐出师门，你得了信任。`),c:'good',fx:{f:(s,c)=>{spScore(s,2);sAdj(s,c.my,10,1);const p=c.spyId&&person(s,c.spyId);if(p){p.rel='enemy';p.bond=5}}}},{w:1,t:c=>T(`${c.spy.en} has friends among the elders. Somehow it is you who is questioned.`,`${c.spy.zh}在长老里有人。不知怎么，被盘问的反倒成了你。`),c:'bad',fx:{f:(s,c)=>sAdj(s,c.my,-6,1)}}]},
  {l:T('Confront them alone','私下找对方问个明白'),out:[{w:1,t:c=>T(`${c.spy.en} breaks down: the other side holds ${c.spy.en.split(' ')[0]}’s family. You help get them out, quietly.`,`${c.spy.zh}崩溃了：对方扣着${c.spy.zh}的家人。你悄悄帮着把人救了出来。`),c:'gold',fx:{align:5,f:(s,c)=>{spScore(s,1);const p=c.spyId&&person(s,c.spyId);if(p)addBond(p,25)}}},{w:1,t:c=>T(`${c.spy.en} draws a knife. You win, but the letter is gone.`,`${c.spy.zh}拔出了刀。你赢了，信却没了。`),c:'muted',fx:{hurt:[3,9],cause:T('a knife in the dark','暗处的一刀')}}]},
  {l:T('Say nothing','什么也不说'),out:[{t:T('In spring the enemy knows exactly where to strike.','开春时，敌人对哪里下手一清二楚。'),c:'bad',fx:{f:s=>spScore(s,-2)}}]}]});
SPI({id:'sp_raid',text:c=>T(`${c.F.en} raiders hit the sect’s lower farm at night. The barns are burning and the junior disciples have nothing to fight with.`,`${c.F.zh}的人趁夜袭了山下的田庄。谷仓起了火，低辈弟子手里连兵器都没有。`),
 opts:[{l:T('Lead the juniors against them','带着师弟师妹迎上去'),fight:(s,c)=>({foe:spFoe(c,s,.85),allies:[{name:T('Junior disciple','师弟'),lv:Math.max(3,Math.round(power(s)*.4))}],stakes:'injury',title:T('The raid','夜袭'),cause:T('a night raid','一场夜袭')}),
   win:[{t:T('The raiders flee into the dark. The juniors talk about it for years.','袭击者逃进了夜色。师弟师妹们为这件事念叨了好多年。'),c:'gold',fx:{fame:4,f:(s,c)=>{spScore(s,3);sAdj(s,c.my,10,1);living(s,'fellow').forEach(p=>addBond(p,4))}}}],
   lose:[{t:T('The farm burns. Everyone gets out alive, which is what matters.','田庄烧了。好在人都活着出来了。'),c:'bad',fx:{f:s=>spScore(s,-1)}}]},
  {l:T('Get the juniors out, let the barns go','先把人带走，谷仓不要了'),out:[{t:T('Not one life lost. The sect goes hungry that winter.','一个人都没丢。那年冬天，门里饿了肚子。'),c:'muted',fx:{align:3,f:(s,c)=>sAdj(s,c.my,3,1)}}]}]});
SPI({id:'sp_siege',text:c=>T(`${c.F.en} comes in force and lays siege to the mountain gate. This is the battle that decides the war.`,`${c.F.zh}倾巢而出，围住了山门。这一仗，决定整场战事的胜负。`),
 opts:[{l:T('Hold the gate','死守山门'),fight:(s,c)=>({foe:Object.assign(spFoe(c,s,1.05),{extra:[spFoe(c,s,.7)]}),allies:living(s,'fellow').slice(0,2).map(p=>({name:T(p.n.py,p.n.cn),lv:p.lv})),stakes:'death',title:T('The siege','山门之战'),cause:T('the siege of the mountain gate','山门之战')}),
   win:[{t:T('At dusk their banner goes down. You are standing in the gate when it does.','黄昏时分，对方的大旗倒了。那一刻，你就站在山门口。'),c:'gold',fx:{fame:10,deed:T('Held the mountain gate in a sect war','门派大战中死守山门'),f:(s,c)=>{spScore(s,5);sAdj(s,c.my,15,1)}}}],
   lose:[{t:T('The gate falls. You are dragged out of the rubble by your own juniors.','山门破了。你是被师弟师妹从瓦砾里拖出来的。'),c:'bad',fx:{f:s=>spScore(s,-3)}}]},
  {l:T('Lead a party round the back to burn their camp','带人绕到后面去烧对方的营'),out:[{w:s=>.4+s.t.wit*.07+s.t.luck*.05,t:T('Their camp goes up in flames and the siege breaks by morning.','对方营地火光冲天，天亮前就撤了围。'),c:'gold',fx:{fame:8,f:(s,c)=>{spScore(s,5);sAdj(s,c.my,12,1)}}},{w:1,t:T('They were waiting for you.','对方早有防备。'),c:'bad',fx:{hurt:[10,20],cause:T('an ambush in a sect war','门派战事中的伏击'),f:s=>spScore(s,-2)}}]}]});
SPI({id:'sp_envoy',when:s=>s.rank>=3,text:c=>T(`The head of ${c.M.en} asks you to go to ${c.F.en} and talk terms.`,`${c.M.zh}掌门派你去${c.F.zh}谈和。`),
 opts:[{l:T('Ask for a fair peace','求一个公道的和局'),out:[{w:s=>.5+s.t.wit*.1,t:T('A fair peace, signed at a ferry in the rain. Neither side is happy; both are alive.','雨中在渡口签下了和约，还算公道。两边都不满意，可都活着。'),c:'gold',fx:{fame:6,f:s=>{if(s.swar)s.swar.peace=1}}},{w:1,t:T('They keep you waiting three days and send you home with nothing.','对方晾了你三天，让你空手回去。'),c:'bad',fx:{fame:-2}}]},
  {l:T('Demand reparations','要对方赔偿'),out:[{w:1,t:T('You come back with silver and a promise. The war ends; the hatred does not.','你带回了银子和一纸承诺。仗打完了，恨还在。'),c:'good',fx:{money:[60,200],f:s=>{if(s.swar){s.swar.peace=1;s.swar.score=(s.swar.score||0)+2}}}},{w:1,t:T('Talks collapse. The fighting resumes the next week.','谈崩了。下个礼拜又打了起来。'),c:'bad',fx:{f:s=>spScore(s,-1)}}]}]});
/* ---------- no sect: the warring sides want you ---------- */
SPI({id:'sp_hire',text:c=>T(`${c.A.en} and ${c.B.en} are at war, and both have sent someone to the inn with silver, looking for blades.`,`${c.A.zh}和${c.B.zh}打起来了，两边都派人带着银子到客栈来招揽好手。`),
 opts:[{l:c=>T(`Fight for ${c.A.en} (80 taels)`,`替${c.A.zh}出手（八十两）`),fight:(s,c)=>({foe:{name:T(`${c.B.en} disciple`,`${c.B.zh}弟子`),lv:Math.round(power(s)*.9),fixed:1},stakes:'injury',title:T('A hired blade','受雇出战'),cause:T('fighting in a sect war','卷入门派战事')}),
   win:[{t:T('You earn your silver and a sect’s gratitude.','你挣到了银子，也得了一派的人情。'),c:'good',fx:{money:80,f:(s,c)=>{sAdj(s,c.w.a,10,1);sAdj(s,c.w.b,-10,1)}}}],lose:[{t:T('You are paid half, and the bruises are free.','你只拿到一半，伤是白挨的。'),c:'bad',fx:{money:40}}]},
  {l:c=>T(`Fight for ${c.B.en} (80 taels)`,`替${c.B.zh}出手（八十两）`),fight:(s,c)=>({foe:{name:T(`${c.A.en} disciple`,`${c.A.zh}弟子`),lv:Math.round(power(s)*.9),fixed:1},stakes:'injury',title:T('A hired blade','受雇出战'),cause:T('fighting in a sect war','卷入门派战事')}),
   win:[{t:T('You earn your silver and a sect’s gratitude.','你挣到了银子，也得了一派的人情。'),c:'good',fx:{money:80,f:(s,c)=>{sAdj(s,c.w.b,10,1);sAdj(s,c.w.a,-10,1)}}}],lose:[{t:T('You are paid half, and the bruises are free.','你只拿到一半，伤是白挨的。'),c:'bad',fx:{money:40}}]},
  {l:T('Stay out of it','不蹚这浑水'),out:[{t:T('Wise, probably. Both sides remember that you said no.','大概是明智的。两边都记得你拒绝过。'),c:'muted',fx:{}}]}]});
SPI({id:'sp_refugee',ctx:s=>{const c=scene();const l=s.swarPast&&s.swarPast[s.swarPast.length-1];c.L=l?spN(l.loser):T('a beaten sect','一个战败的门派');c.lk=l?l.loser:null;c.npc=npc(s,{age:rint(15,22)});return c},
 text:c=>T(`Two young disciples of ${c.L.en}, which lost the war, turn up at your door: hungry, hunted, and asking for one night.`,`两个${c.L.zh}的年轻弟子找上了门：门派打输了，他们又饿又被人追，只求借宿一夜。`),
 opts:[{l:T('Take them in','收留他们'),out:[{t:T('One night becomes a winter. They leave in spring, and swear they will not forget.','一夜变成了一整个冬天。开春他们走了，发誓不会忘记。'),c:'good',fx:{align:6,f:(s,c)=>{if(c.lk)sAdj(s,c.lk,15,1)}}}]},
  {l:T('Give them food and send them on','给些吃的，打发走'),out:[{t:T('They thank you and go. You do not ask where.','他们道了谢就走了。你没问去哪儿。'),c:'muted',fx:{align:2}}]},
  {l:T('Turn them over to the victors','交给打赢的那一方'),out:[{t:T('The victors pay well. You do not sleep well.','打赢的那一方给了不少钱。你却睡不好了。'),c:'bad',fx:{money:[40,100],align:-10}}]}]});
/* ---------- a sect head dies ---------- */
SPI({id:'sp_succ',ctx:s=>{const c=scene();c.M=spN(s.sect);const a=npc(s,{sex:'m',age:rint(40,55)}),b=npc(s,{sex:'f',age:rint(36,50)});c.a=T(a.n.py,a.n.cn);c.b=T(b.n.py,b.n.cn);c.npc=a;return c},
 text:c=>T(`The head of ${c.M.en} has died. Two successors: the senior brother ${c.a.en}, who wants war with every rival, and the senior sister ${c.b.en}, who wants the sect to keep its head down and grow. The sect is splitting.`,`${c.M.zh}掌门仙逝。继任的有两人：大师兄${c.a.zh}，主张跟所有对头开战；二师姐${c.b.zh}，主张韬光养晦。门里分成了两派。`),
 opts:[{l:c=>T(`Back ${c.a.en}`,`支持${c.a.zh}`),out:[{w:1,t:c=>T(`${c.a.en} takes the seat, and remembers who stood with him.`,`${c.a.zh}坐上了掌门之位，也记住了谁站在他这边。`),c:'good',fx:{f:s=>{s.rank=Math.min(4,s.rank+1);s.flags.spHawk=s.age}}},{w:1,t:c=>T(`${c.b.en} wins. You are given the worst duties for years.`,`${c.b.zh}赢了。之后好几年，最苦的差事都落在你头上。`),c:'bad',fx:{f:s=>sAdj(s,s.sect,-10,1)}}]},
  {l:c=>T(`Back ${c.b.en}`,`支持${c.b.zh}`),out:[{w:1,t:c=>T(`${c.b.en} takes the seat, and the sect has ten quiet years.`,`${c.b.zh}继任，门里过了十年安稳日子。`),c:'good',fx:{f:s=>{s.rank=Math.min(4,s.rank+1);s.flags.spDove=s.age}}},{w:1,t:c=>T(`${c.a.en} wins, and calls you a coward in front of the whole hall.`,`${c.a.zh}赢了，当着满堂的人骂你是懦夫。`),c:'bad',fx:{f:s=>sAdj(s,s.sect,-10,1)}}]},
  {l:T('Put yourself forward','自己出来争'),if:s=>s.rank>=3,out:[{w:s=>.3+s.fame/80+power(s)/300,t:T('The hall votes, and the seat is yours.','众人公推，掌门之位落到了你身上。'),c:'gold',fx:{fame:12,deed:T('Became head of the sect','接任掌门'),f:s=>{s.rank=4}}},{w:1,t:T('You lose, and both of them now distrust you.','你没争到，两边从此都防着你。'),c:'bad',fx:{f:s=>sAdj(s,s.sect,-15,1)}}]},
  {l:T('Stay out of it','两不相帮'),out:[{t:T('Whoever wins, you are nobody’s enemy and nobody’s friend.','不管谁赢，你都不是谁的敌人，也不是谁的朋友。'),c:'muted',fx:{}}]}]});

/* ---------- the world turns each year ---------- */
function spNews(s,en,zh,mine){say(s,`【Sects】 ${en}`,`【门派】${zh}`,mine?'gold':'muted')}
function spEndWar(s){const w=s.swar;if(!w)return;let win;
  if(w.peace)win=null;else{const sa=spStr(s,w.a)+(s.sect===w.a?(w.score||0)*.12:0)+(s.sect===w.b?-(w.score||0)*.12:0),sb=spStr(s,w.b);win=sa>=sb?w.a:w.b}
  const lose=win?(win===w.a?w.b:w.a):null;
  if(win){spNews(s,`The war is over: ${SECTS[win].en} has beaten ${SECTS[lose].en}.`,`战事结束：${SECTS[win].cn}打败了${SECTS[lose].cn}。`,s.sect===win||s.sect===lose);(s.sweak=s.sweak||{})[lose]=s.age;
    if(s.sect===win){s.fame+=4;happy(s,6)}if(s.sect===lose){happy(s,-8);s.fame=Math.max(0,s.fame-2)}}
  else spNews(s,`${SECTS[w.a].en} and ${SECTS[w.b].en} make peace.`,`${SECTS[w.a].cn}与${SECTS[w.b].cn}议和了。`,s.sect===w.a||s.sect===w.b);
  srSet(s,w.a,w.b,-1);(s.swarPast=s.swarPast||[]).push({a:w.a,b:w.b,at:w.at,end:s.age,winner:win,loser:lose});s.swar=null}
function spRun(s,id){const inc=INC_BY[id];if(!inc)return;if(inc.when&&!inc.when(s))return;const c=Object.assign(s.swar?spCtx(s):scene(),inc.ctx?inc.ctx(s):{});if(!c.npc)c.npc=npc(s);runIncident(s,inc,c)}
(()=>{const y=yearly;yearly=function(s){y(s);SP_S=s;if(!s.alive||s.age<12)return;const ks=spSects(s);if(ks.length<2&&!s.swar)return;
  /* relations drift */
  if(chance(.22)&&ks.length>=2){const a=pick(ks),b=pick(ks.filter(k=>k!==a));if(b){const v=sectRel(a,b),mine=s.sect===a||s.sect===b;
    if(chance(v>=1?.35:.6)&&v>-2){srSet(s,a,b,v-1);const w=pick(FEUD_WHY);spNews(s,`${SECTS[a].en} and ${SECTS[b].en} have fallen out over ${w.en}.`,`${SECTS[a].cn}与${SECTS[b].cn}因为${w.zh}翻了脸。`,mine)}
    else if(v<2){srSet(s,a,b,v+1);const w=pick(ALLY_WHY);spNews(s,`${SECTS[a].en} and ${SECTS[b].en} have drawn closer, through ${w.en}.`,`${SECTS[a].cn}与${SECTS[b].cn}因为${w.zh}走近了。`,mine)}}}
  /* a feud becomes a war */
  if(!s.swar&&s.age>=14){const pairs=[];ks.forEach(a=>ks.forEach(b=>{if(a<b&&sectRel(a,b)<=-2)pairs.push([a,b])}));
    const p=pairs.find(([a,b])=>s.sect===a||s.sect===b)||pick(pairs);
    if(p&&chance(p.includes(s.sect)?.14:.07)){s.swar={a:p[0],b:p[1],at:s.age,stage:0,score:0};const mine=p.includes(s.sect);
      spNews(s,`${SECTS[p[0]].en} and ${SECTS[p[1]].en} are at war.`,`${SECTS[p[0]].cn}与${SECTS[p[1]].cn}正式开战了。`,mine);if(s.queue.length<=1){if(mine)spRun(s,'sp_summon');else if(!s.sect&&s.age>=16)spRun(s,'sp_hire')}return}}
  /* the war goes on */
  const w=s.swar;if(w){if(!SECTS[w.a]||!SECTS[w.b]){s.swar=null;return}const mine=s.sect===w.a||s.sect===w.b;if(w.peace||s.age-w.at>=6){spEndWar(s);if(!mine&&s.queue.length<=1&&chance(.35))spRun(s,'sp_refugee');return}
    if(!chance(.65))return;w.stage++;
    if(w.stage>=3){if(mine&&s.queue.length<=1&&!s.jail)spRun(s,'sp_siege');spEndWar(s);return}
    if(mine&&s.queue.length<=1&&!s.jail){if(w.stage===2&&s.rank>=3&&chance(.4))spRun(s,'sp_envoy');else spRun(s,pick(['sp_spy','sp_raid']))}
    else if(!s.sect&&s.queue.length<=1&&chance(.4)&&s.age>=16)spRun(s,'sp_hire');
    else{const L=pick([[`Fighting between ${SECTS[w.a].en} and ${SECTS[w.b].en} spreads to the roads.`,`${SECTS[w.a].cn}和${SECTS[w.b].cn}的仗打到了官道上。`],[`Travellers avoid the hills where ${SECTS[w.a].en} and ${SECTS[w.b].en} are fighting.`,`过路的人都绕开${SECTS[w.a].cn}和${SECTS[w.b].cn}交战的那片山。`],[`Both ${SECTS[w.a].en} and ${SECTS[w.b].en} are recruiting; the price of a good sword has doubled.`,`${SECTS[w.a].cn}和${SECTS[w.b].cn}都在招人，一把好剑的价钱翻了一倍。`]]);spNews(s,L[0],L[1],false)}return}
  /* a sect head dies */
  if(s.sect&&s.rank>=1&&s.queue.length<=1&&!s.jail&&chance(.025)&&(s.flags.spSucc==null||s.age-s.flags.spSucc>=20)){s.flags.spSucc=s.age;const inc=INC_BY.sp_succ;runIncident(s,inc)}}})();
