/* 江湖一生 · great events. Some are fated at birth (a war, an upheaval in the jianghu, a family catastrophe) and only some lives get them;
   others only happen when the life you have lived leads there (the exam, a forced marriage, a return home, choosing an heir). */
'use strict';

/* ---------- fate, drawn once per life ---------- */
function fate(s){
  if(s.fate)return s.fate;
  const fam=s.family,a0=Math.max(0,s.age),later=(lo,hi)=>{const a=rint(lo,hi);return a>=a0?a:null};
  const f={};
  if(chance(.4))f.war=later(6,70);                                       /* a war or rebellion sweeps through your region */
  if(chance(.35))f.chaos=later(18,65);                                   /* a legendary manual surfaces and the jianghu goes mad */
  const mass={clan:.3,escort:.25,cult:.3,merchant:.07,noble:.08}[fam]||0;
  if(chance(mass))f.massacre=later(6,19);                                /* an old enemy of the family comes in the night */
  const ruin={merchant:.18,noble:.25,scholar:.18}[fam]||0;
  if(!f.massacre&&chance(ruin))f.ruin=later(6,35);                       /* the family is caught up in a case and stripped of everything */
  s.fate=f;return f;
}
const fated=(k,cond)=>s=>{const f=fate(s);return f[k]!=null&&s.age>=f[k]&&s.jail<=0&&(!cond||cond(s))};
const parents=s=>s.people.filter(p=>p.alive&&(p.rel==='father'||p.rel==='mother'));

/* ---------- war ---------- */
QHINT.b_war={t:T('War is raging across the region.','战火正在这片土地上蔓延。'),done:'b_warend'};
const WARS=[[T('The Prince of Ning has risen in rebellion','宁王起兵造反'),T('the Prince of Ning’s rebels','宁王叛军')],[T('A peasant army under a "Dashing King" has risen','闯王揭竿而起'),T('the Dashing King’s army','闯王的义军')],
 [T('Steppe horsemen have broken through the passes','草原铁骑破关南下'),T('the steppe horsemen','草原铁骑')],[T('The White Lotus sect has raised an army','白莲教聚众起事'),T('the White Lotus army','白莲教军')]];
I({id:'b_war',force:1,when:fated('war'),ctx:s=>{const w=pick(WARS);return{war:w[0],foe:w[1]}},
 text:(c,s)=>T(`${c.war.en}. Within months, the fighting reaches ${region(s).en}.`,`${c.war.zh}。不出几个月，战火就烧到了${region(s).cn}。`),
 opts:[
  {l:T('Flee with the family','随家人逃难'),if:s=>s.age<14,out:[{w:3,t:T('You walk south for forty days with everything you own on a handcart.','你们推着装满家当的独轮车，往南走了四十天。'),fx:{money:-10,happy:-6,flag:'b_war'}},
    {w:1,t:T('On the road, you lose a parent to fever.','逃难路上，爹娘中的一个染上热病走了。'),c:'bad',fx:{happy:-8,flag:'b_war',f:s=>{const p=parents(s);if(p.length){const x=pick(p);x.alive=false;onDeath(s,x)}}}},
    {w:1,t:T('A soldier shares his rations with you. You never forget his face.','一个士兵把口粮分给了你。你一辈子都记得他的脸。'),c:'good',fx:{align:4,flag:'b_war'}}]},
  {l:T('Join the imperial army','投军平乱'),sub:T('Glory, pay, and a good chance of dying.','功名、军饷，还有不小的送命机会。'),if:s=>s.age>=14&&s.age<55&&s.align>-30,
   fight:(s,c)=>({foe:{name:T('a rebel captain','叛军头目'),lv:PW(1,6)(s)},stakes:'injury',title:T('The battlefield','沙场'),cause:T('the war','战乱')}),
   win:[{t:T('You hold the line when others break. Your name reaches the general.','别人溃退时你守住了阵线，名字传到了将军耳中。'),c:'gold',fx:{fame:6,money:40,flag:['b_war','b_war_army']}}],
   lose:[{t:T('You are carried off the field. The war goes on without you for a while.','你被抬下了战场。仗还在打，暂时没你的事了。'),c:'bad',fx:{flag:['b_war','b_war_army']}}]},
  {l:T('Join the rebels','投奔义军'),sub:T('If they win, a new dynasty. If not, the executioner.','成了是开国功臣，败了是刀下之鬼。'),if:s=>s.age>=14&&s.age<55&&s.align<60,
   fight:(s,c)=>({foe:{name:T('an imperial officer','官军校尉'),lv:PW(1,6)(s)},stakes:'injury',title:T('The uprising','起义'),cause:T('the war','战乱')}),
   win:[{t:T('You storm a county granary and hand out the grain.','你攻破了县里的粮仓，把粮食分给了百姓。'),c:'gold',fx:{fame:6,align:4,wanted:2,flag:['b_war','b_war_rebel']}}],
   lose:[{t:T('Your company is routed. You hide in a ditch for two days.','你所在的队伍被打散了，你在水沟里躲了两天。'),c:'bad',fx:{wanted:1,flag:['b_war','b_war_rebel']}}]},
  {l:T('Defend your village','守护乡里'),if:s=>s.age>=16&&power(s)>=25,
   fight:(s,c)=>({foe:{name:T('a band of deserters','一伙溃兵'),lv:PW(.95,4)(s)},stakes:'injury',title:T('The village wall','守村'),cause:T('deserters','溃兵')}),
   win:[{t:T('Deserters come looking for food and find you instead. The village keeps its harvest.','溃兵进村抢粮，碰上了你。乡亲们保住了收成。'),c:'good',fx:{fame:4,align:6,flag:'b_war'}}],
   lose:[{t:T('They take the grain. Nobody blames you, which is worse.','粮食还是被抢走了。没人怪你，这反而更难受。'),c:'bad',fx:{align:3,flag:'b_war'}}]},
  {l:T('Sell grain and weapons to both sides','两头倒卖粮草兵器'),if:s=>s.age>=18&&s.money>=150,out:[{w:2,t:T('War is very good for business.','打仗真是好买卖。'),c:'bad',fx:{money:[150,500],align:-10,flag:['b_war','b_war_profit']}},{w:1,t:T('Both sides decide you are a spy.','两边都认定你是奸细。'),c:'bad',fx:{money:-100,hurt:[10,25],cause:T('the war','战乱'),flag:'b_war'}}]},
  {l:T('Hide in the hills until it passes','躲进深山避乱'),if:s=>s.age>=14,out:[{w:3,t:T('You live on roots and rumours.','你靠草根和传言过活。'),c:'muted',fx:{money:-20,happy:-5,flag:'b_war'}},{w:1,t:T('In the hills you meet a hermit who also fled the world.','山里你遇到一位同样避世的隐士。'),c:'good',fx:{qi:5,flag:'b_war'}}]}]});
I({id:'b_waryear',need:'b_war',w:5,cd:1,age:[0,110],when:s=>s.seen.b_warend==null&&s.age>s.flags.b_war,text:()=>T('The war goes on.','战事仍在继续。'),
 out:[{w:2,t:T('Rice costs five times what it did. Everyone is thinner.','米价涨了五倍，人人都瘦了一圈。'),fx:{money:[-15,-5],happy:-3}},{w:1,t:T('Press gangs come through. You hide in the well.','抓壮丁的来了。你躲进了井里。'),c:'muted',fx:{happy:-2}},
  {w:1,t:T('A refugee family sleeps in your doorway. You feed them.','一户难民睡在你家门口，你给了他们饭吃。'),fx:{align:2,money:-3}},{w:1,t:T('Rumours of a great battle up north. Nobody knows who won.','传言北边打了一场大仗，谁也不知道谁赢了。'),c:'muted'}]});
I({id:'b_warend',need:'b_war',once:1,w:9,age:[0,110],when:s=>s.age-s.flags.b_war>=rint(2,4),ctx:s=>({rebelsWon:chance(.35)}),
 text:c=>c.rebelsWon?T('The rebels take the capital. The old emperor hangs himself from a tree. A new dynasty begins.','义军攻进京城，老皇帝自缢于煤山。新朝建立了。'):T('The rebellion is crushed. Heads hang on the city gates for a month.','叛乱被平定了。城门上挂了一个月的人头。'),
 out:[{if:(s,c)=>s.flags.b_war_rebel!=null&&c.rebelsWon,t:T('You fought for the winning side. The new court gives you land and a title.','你站对了边。新朝赐你田地和爵位。'),c:'gold',fx:{money:[300,800],fame:12,wanted:-5,unflag:'b_war',deed:T('Fought in the uprising that founded a dynasty','随义军开国'),f:s=>newEra(s)}},
  {if:(s,c)=>s.flags.b_war_rebel!=null&&!c.rebelsWon,t:T('You fought for the losing side. Your name is on the wanted lists.','你站错了边，名字上了通缉榜。'),c:'bad',fx:{wanted:3,unflag:'b_war'}},
  {if:(s,c)=>s.flags.b_war_army!=null&&!c.rebelsWon,t:T('The general remembers you. A reward, and an offer of a post.','将军记得你。赏银之外，还许你一官半职。'),c:'gold',fx:{money:[150,400],fame:8,unflag:'b_war',deed:T('Fought to put down a great rebellion','平定叛乱有功')}},
  {if:(s,c)=>s.flags.b_war_army!=null&&c.rebelsWon,t:T('Your army is disbanded. You go home with your armour and nothing else.','你的军队被遣散了。你只带着一身甲回了家。'),c:'muted',fx:{unflag:'b_war',f:s=>newEra(s)}},
  {if:(s,c)=>s.flags.b_war_profit!=null,t:T('You come out of the war rich. Some neighbours no longer greet you.','这场仗让你发了家。有些邻居不再跟你打招呼了。'),c:'muted',fx:{unflag:'b_war',f:(s,c)=>{if(c.rebelsWon)newEra(s)}}},
  {if:s=>s.flags.b_war_rebel==null&&s.flags.b_war_army==null&&s.flags.b_war_profit==null,t:T('You go home. The house is still standing. Not everyone’s is.','你回了家。房子还在，不是家家都这么幸运。'),fx:{happy:4,unflag:'b_war',f:(s,c)=>{if(c.rebelsWon)newEra(s)}}}]});
function newEra(s){const e=pick(ERAS.filter(x=>x[0]!==s.era.cn));s.era={cn:e[0],py:e[1]};s.eraYear=1;s.eraLen=rint(20,40);say(s,`The new reign is named ${e[1]} (${e[0]}).`,`新朝改元${e[0]}。`,'muted')}

/* ---------- upheaval in the jianghu: who gets dragged in depends on who you are ---------- */
QHINT.b_chaos={t:T('Every sect is hunting the War Sage’s Testament.','各大门派都在争夺《兵圣遗书》。'),done:'b_chaosend'};
const inJianghu=s=>power(s)>=40||!!s.sect||s.fame>=25;
I({id:'b_chaos_rumour',force:1,when:fated('chaos',s=>!inJianghu(s)&&s.seen.b_chaos==null),text:()=>T('Word reaches even your door: the lost War Sage’s Testament (兵圣遗书) has surfaced, and the sects are killing each other for it.','连你这里都听说了：失传的《兵圣遗书》重现江湖，各派为之杀红了眼。'),
 out:[{w:3,t:T('It is nothing to do with you. You bar the door at night anyway.','这与你无关。不过夜里你还是闩上了门。'),c:'muted'},{w:1,t:T('A wounded swordsman dies in your street, clutching an empty box.','一个负伤的剑客死在你家街口，手里攥着一只空匣子。'),c:'muted',fx:{happy:-3}}]});
I({id:'b_chaos',force:1,when:fated('chaos',s=>inJianghu(s)&&s.seen.b_chaos_rumour==null),text:()=>T('The lost War Sage’s Testament (兵圣遗书) has surfaced. Within a month, three sect masters are dead and every road is full of armed men.','失传的《兵圣遗书》重现江湖。不到一个月，三位掌门横死，处处都是持刀带剑的人。'),
 opts:[{l:T('Hunt for it yourself','亲自去夺'),sub:T('The strong will be tested. The weak will be buried.','强者受考验，弱者埋黄土。'),out:[{t:T('You pick up the trail at a burned-out inn.','你在一家烧毁的客栈里找到了线索。'),fx:{flag:['b_chaos','b_chaos_hunt'],align:-2}}]},
  {l:T('Protect the innocent caught in between','护住被卷进来的无辜'),out:[{t:T('You escort villagers out of a valley the sects have turned into a battlefield.','你护送村民离开那条被各派打成战场的山谷。'),c:'good',fx:{flag:['b_chaos','b_chaos_guard'],align:5,fame:2}}]},
  {l:T('Stay out of it','置身事外'),out:[{w:2,t:T('You keep your head down. It is the wisest thing you do all decade.','你低头过日子。这是你这十年做得最聪明的事。'),c:'muted',fx:{flag:'b_chaos'}},{if:s=>!!s.sect,w:2,t:T('Your sect calls you a coward and gives you the worst duties.','门派骂你是懦夫，派你干最苦的差事。'),c:'bad',fx:{flag:'b_chaos',happy:-5}}]}]});
I({id:'b_chaos2',need:'b_chaos_hunt',once:1,w:9,age:[18,90],when:s=>s.age-s.flags.b_chaos_hunt>=1,ctx:s=>({foe:foeName()}),text:c=>T(`The trail ends at a cliff temple, where ${c.foe.en} already holds the iron box.`,`线索的尽头是一座悬崖古寺，${c.foe.zh}已经抱着那只铁匣。`),
 opts:[{l:T('Take it from them','夺过来'),fight:(s,c)=>({foe:{name:c.foe,lv:PW(1.1,10)(s)},stakes:'death',title:T('The War Sage’s Testament','兵圣遗书'),cause:T('the hunt for the War Sage’s Testament','争夺兵圣遗书')}),
   win:[{t:T('The box is yours. Inside: a general’s treatise on war and on the inner arts.','铁匣到手。里面是一位名将的兵法与内功心法。'),c:'gold',fx:{qi:20,skill:10,fame:12,smarts:6,unflag:'b_chaos_hunt',flag:'b_chaos_won',deed:T('Won the War Sage’s Testament','夺得兵圣遗书')}}],
   lose:[{t:T('You crawl away down the mountain. Someone else will have it.','你爬着逃下了山。那东西归别人了。'),c:'bad',fx:{unflag:'b_chaos_hunt',flag:'b_chaos_lost'}}]},
  {l:T('Propose a truce: burn it, so nobody has it','提议休兵：烧了它，谁都别要'),out:[{w:s=>s.fame/20+s.smarts/40,t:T('Incredibly, they agree. The pages burn on the temple altar.','难以置信，对方竟答应了。书页在佛前化为灰烬。'),c:'gold',fx:{fame:10,align:8,unflag:'b_chaos_hunt',flag:'b_chaos_burned',deed:T('Ended the war over the War Sage’s Testament by burning it','焚毁兵圣遗书，平息江湖纷争')}},
   {w:2,t:T('They laugh and run. You let them.','对方大笑着跑了，你没有追。'),c:'muted',fx:{unflag:'b_chaos_hunt',flag:'b_chaos_lost'}}]}]});
I({id:'b_chaosend',need:'b_chaos',once:1,w:9,age:[18,100],when:s=>s.age-s.flags.b_chaos>=2&&s.flags.b_chaos_hunt==null,
 text:()=>T('The madness over the War Sage’s Testament finally ends.','围绕《兵圣遗书》的腥风血雨，终于平息了。'),
 out:[{if:s=>s.flags.b_chaos_won!=null,t:T('Everyone knows you have it. Challengers come for years. So does respect.','人人都知道东西在你手里。此后多年挑战者不断，敬畏也不断。'),c:'gold',fx:{fame:6,unflag:'b_chaos'}},
  {if:s=>s.flags.b_chaos_burned!=null,t:T('They call it the Truce of Ashes. Your name is in the story.','后人称之为"灰烬之盟"，故事里有你的名字。'),c:'good',fx:{happy:6,unflag:'b_chaos'}},
  {if:s=>s.flags.b_chaos_lost!=null,t:T('The man who won it calls himself Lord of the Wulin now. You remember his face.','夺得它的人如今自封武林至尊。你记得他的脸。'),c:'muted',fx:{unflag:'b_chaos',f:s=>storeNpc(s,{npc:npc(s,{lv:Math.round(power(s)*1.3+20)})},'enemy',0)}},
  {if:s=>s.flags.b_chaos_guard!=null,t:T('The villages you protected put up a shrine. It has your name on it, spelled wrong.','你护过的村子给你立了个生祠，名字还写错了。'),c:'good',fx:{fame:4,align:4,unflag:'b_chaos'}},
  {if:s=>['b_chaos_won','b_chaos_burned','b_chaos_lost','b_chaos_guard'].every(k=>s.flags[k]==null),t:T('Three sects are gone. Yours, if you have one, is not. You count that as a victory.','三个门派就此覆灭。你还活着，这就算赢了。'),c:'muted',fx:{unflag:'b_chaos'}}]});

/* ---------- family catastrophes ---------- */
QHINT.b_revenge={t:T('Your family’s killer is still out there.','灭你满门的仇人还活在世上。'),done:'b_revenge2'};
I({id:'b_massacre',force:1,when:fated('massacre',s=>parents(s).length>0),ctx:s=>({foe:foeName()}),
 text:c=>T(`In the night, men in black come over the walls. Their leader, ${c.foe.en}, calls out your father’s name like a debt being collected.`,`夜里，一群黑衣人翻墙而入。为首的${c.foe.zh}高喊你父亲的名字，像是来讨一笔旧债。`),
 out:[{w:s=>2+s.t.luck/2,t:T('Your mother pushes you into the cellar and pulls the rice jar over the trapdoor. When you climb out at dawn, you are alone.','母亲把你推进地窖，又把米缸挪过来压住了活板门。天亮你爬出来时，家里只剩你一个人了。'),c:'bad',
   fx:{happy:-25,flag:'b_revenge',f:(s,c)=>{parents(s).forEach(p=>{p.alive=false});s.people.filter(p=>p.alive&&p.rel==='sibling'&&chance(.6)).forEach(p=>{p.alive=false});
     const e=storeNpc(s,{npc:Object.assign(npc(s),{n:{cn:c.foe.zh,py:c.foe.en,sur:['','']}})},'enemy',0);if(e)e.lv=Math.max(90,Math.round(power(s)*1.5+rint(80,140)));s.flags.b_revenge_lv=e?e.lv:120;s.money=Math.round(s.money*.1)}}},
  {w:s=>s.t.root/3,t:T('You fight. You are a child. A blade opens your face, and your father’s old servant carries you away through the smoke.','你扑了上去，可你还只是个孩子。一刀划破了你的脸，父亲的老仆背着你冲出了火海。'),c:'bad',
   fx:{happy:-25,looks:-10,hurt:[15,30],cause:T('the night your family died','灭门之夜'),flag:'b_revenge',f:(s,c)=>{parents(s).forEach(p=>{p.alive=false});const e=storeNpc(s,{npc:npc(s)},'enemy',0);if(e){e.n={cn:c.foe.zh,py:c.foe.en,sur:['','']};e.lv=Math.max(90,Math.round(power(s)*1.5+rint(80,140)))}s.flags.b_revenge_lv=e?e.lv:120;s.money=Math.round(s.money*.1);
     const m=mkPerson(s,{rel:'master',age:rint(55,75),bond:70,lv:rint(80,140)});s.people.push(m);s.skill+=3}}}]});
I({id:'b_revenge1',need:'b_revenge',once:1,w:4,age:[14,60],when:s=>s.age-s.flags.b_revenge>=4,text:()=>T('You hear that your family’s killer is living openly, under another name, in a city two provinces away.','你听说灭你满门的仇人改名换姓，就在两省之外的一座城里逍遥度日。'),
 opts:[{l:T('Train harder. Not yet.','苦练，时候未到'),out:[{t:T('You train until your hands bleed.','你练到手上见血。'),fx:{skill:4,qi:3,happy:-3}}]},{l:T('Go and look at him','去看他一眼'),out:[{w:2,t:T('He is old, fat and kind to his grandchildren. You hate him more.','他又老又胖，对孙辈慈眉善目。你更恨了。'),c:'muted',fx:{skill:2}},{w:1,t:T('He sees you, and smiles. He knows.','他看见了你，笑了笑。他认出你了。'),c:'bad',fx:{happy:-5}}]}]});
I({id:'b_revenge2',need:'b_revenge',once:1,w:8,age:[16,80],when:s=>s.age-s.flags.b_revenge>=6&&(power(s)>=(s.flags.b_revenge_lv||120)*.85||s.age>=45),
 ctx:s=>{const e=s.people.find(p=>p.rel==='enemy'&&p.alive&&p.lv>=(s.flags.b_revenge_lv||0)-5);return{pid:e?e.id:0,foe:e?T(e.n.py,e.n.cn):foeName(),lv:e?e.lv:(s.flags.b_revenge_lv||120)}},
 text:c=>T(`At last you stand in front of ${c.foe.en}, the man who killed your family.`,`你终于站在了${c.foe.zh}面前——那个杀你全家的人。`),
 opts:[{l:T('Take your revenge','报仇雪恨'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv},stakes:'death',title:T('Blood debt','血债血偿'),cause:T('the man who killed your family','灭门仇人')}),
   win:[{t:T('It is over. You kneel at your parents’ graves and tell them.','一切都结束了。你跪在爹娘坟前，告诉了他们。'),c:'gold',fx:{fame:10,happy:15,unflag:'b_revenge',deed:T('Avenged your murdered family','报了灭门之仇'),f:(s,c)=>{const p=c.pid&&person(s,c.pid);if(p)p.alive=false}}}],
   lose:[{t:T('He spares you, the way you would spare a dog. That is worse.','他饶了你，就像饶一条狗。这比死还难受。'),c:'bad',fx:{happy:-10}}]},
  {l:T('Ask him why','问他为什么'),out:[{w:1,t:T('Your father betrayed his brother thirty years ago. He shows you the letters. You do not know what to feel.','三十年前，你父亲出卖了他的兄弟。他给你看了那些书信。你不知该作何感想。'),c:'muted',fx:{align:4,unflag:'b_revenge',happy:-4}},{w:1,t:T('"Money." That is all. You leave him alive, because he is not worth it.','"为了钱。"就这么一句。你留了他一命，因为他不值得。'),c:'muted',fx:{align:6,qi:5,unflag:'b_revenge'}}]},
  {l:T('Walk away','转身离开'),out:[{t:T('You have carried this long enough. You put it down.','这份仇你背得够久了。你放下了。'),c:'good',fx:{qi:8,align:5,happy:5,unflag:'b_revenge'}}]}]});

QHINT.b_ruin={t:T('Your family’s name could still be cleared.','家族的冤屈或许还有昭雪之日。'),done:'b_ruin2'};
I({id:'b_ruin',force:1,when:fated('ruin',s=>parents(s).length>0),text:()=>T('Constables seal the gates. Your father is named in a corruption case at court. Everything you own is listed and carted away.','捕快封了大门。你父亲被卷进朝中一桩贪墨大案，家产一一登记造册，被尽数抄没。'),
 opts:[{l:T('Bribe the investigating censor','贿赂查案的御史'),if:s=>s.age>=16&&s.money>=100,out:[{w:1,t:T('Your father is released, a poorer and quieter man.','父亲被放了出来，穷了，也沉默了。'),c:'good',fx:{f:s=>{s.money=Math.round(s.money*.3)}}},{w:2,t:T('The censor takes the silver and adds bribery to the charges.','御史收了银子，又给你家添了一条行贿的罪名。'),c:'bad',fx:{f:s=>{s.money=Math.round(s.money*.1);const p=parents(s).find(p=>p.rel==='father');if(p){p.alive=false;onDeath(s,p)}},flag:'b_ruin'}}]},
  {l:T('Accept it','认命'),out:[{t:T('Your father is exiled to the frontier. You move into two rented rooms.','父亲被发配边疆。你们搬进了租来的两间小屋。'),c:'bad',fx:{happy:-15,flag:'b_ruin',f:s=>{s.money=Math.round(s.money*.1);s.items=s.items.filter(i=>!['courtyard','mansion','manor'].includes(i.id));const p=parents(s).find(p=>p.rel==='father');if(p)p.bond=Math.max(0,p.bond-10)}}}]}]});
I({id:'b_ruin2',need:'b_ruin',once:1,w:5,age:[18,80],when:s=>s.age-s.flags.b_ruin>=5,text:()=>T('A retired clerk finds you. He kept copies of the real ledgers in the case that ruined your family.','一个告老的书吏找到你。当年那桩让你家破人亡的案子，他留着真账本的抄本。'),
 opts:[{l:T('Take it to the capital','进京申冤'),out:[{w:s=>1+s.smarts/40+s.fame/40,t:T('The case is reopened. Your father’s name is cleared, and part of the property returned.','案子重审，父亲沉冤得雪，家产也发还了一部分。'),c:'gold',fx:{money:[200,800],fame:6,happy:12,unflag:'b_ruin',deed:T('Cleared your family’s name','为家族洗清冤屈')}},
   {w:2,t:T('The real culprit is now a minister. The ledgers disappear, and so nearly do you.','真凶如今已是尚书。账本不翼而飞，你也险些跟着消失。'),c:'bad',fx:{hurt:[10,25],cause:T('a minister’s assassins','尚书派来的刺客'),unflag:'b_ruin',enemy:1}}]},
  {l:T('Sell the ledgers to the guilty minister','把账本卖给那位尚书'),out:[{t:T('He pays very well. You tell yourself it is what your father would have wanted.','他出手极其大方。你告诉自己，父亲也会希望如此。'),c:'bad',fx:{money:[300,900],align:-12,unflag:'b_ruin'}}]},
  {l:T('Let the past lie','让往事过去'),out:[{t:T('You burn the pages. The clerk weeps.','你烧了那些纸。老书吏哭了。'),c:'muted',fx:{unflag:'b_ruin',qi:2}}]}]});

/* ---------- turning points that only come if your life leads there ---------- */
I({id:'b_exam',once:1,w:s=>s.family==='scholar'?6:2,age:[16,24],when:s=>s.cal%3===0&&s.flags.exam==null&&!s.sect&&(s.family==='scholar'||s.smarts>=60)&&parents(s).length>0,
 text:()=>T('Your family has saved for years to send you to the provincial examination. Everyone in the clan is watching.','家里攒了好几年的钱，就为送你去考乡试。全族的人都在看着。'),
 opts:[{l:T('Go, and give it everything','去，全力一搏'),out:[{w:s=>Math.max(.3,(s.smarts-40)/15),t:T('Your name is on the golden list. Firecrackers all down the street. You are appointed a county magistrate.','金榜题名！整条街放起鞭炮。你被授为一县县令。'),c:'gold',fx:{fame:10,happy:12,f:s=>{s.flags.exam=s.age;s.job='official';s.jobLv=0;s.jobYears=0;s.perf=55},deed:T('Passed the imperial examination','金榜题名')}},
   {w:2,t:T('You fail. On the road home, you rehearse what to say to your father.','你落榜了。回家路上，你反复想着该怎么跟父亲开口。'),c:'bad',fx:{happy:-8,smarts:2}},{w:.5,t:T('You faint in your cell on the second day and are carried out.','第二天你在号舍里晕倒，被抬了出去。'),c:'bad',fx:{hurt:[5,12],cause:T('the examination cell','考场号舍'),happy:-5}}]},
  {l:T('Refuse: you want the jianghu, not an office','拒绝：你要的是江湖，不是官场'),out:[{t:T('Your father does not speak to you for a year.','父亲一年没跟你说话。'),c:'muted',fx:{happy:-4,skill:1,f:s=>parents(s).forEach(p=>p.bond=Math.max(0,p.bond-15))}}]}]});
I({id:'b_match',once:1,w:3,age:[18,27],when:s=>!spouseOf(s)&&parents(s).length>0&&s.sect!=='shaolin'&&s.jail<=0,ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-3,2),16,40),occ:s.gender==='m'?12:11});return c},
 text:c=>T(`Your parents have arranged a match with ${c.npc.en}, from a family richer than yours. The betrothal gifts are already in the hall.`,`爹娘给你说定了一门亲事，对方是${c.npc.zh}，家境比你家好。聘礼已经摆在堂上了。`),
 opts:[{l:T('Agree, as a dutiful child','遵从父母之命'),out:[{w:2,t:T('You meet on the wedding day. It could be worse. Over the years, it becomes rather good.','成亲那天你们才头一回见面。还算不坏，日子久了竟过得挺好。'),c:'good',fx:{f:(s,c)=>{storeNpc(s,c,'spouse',60)},money:[20,60],happy:4}},
   {w:1,t:T('You meet on the wedding day. It is worse.','成亲那天你们才头一回见面。比想象的还糟。'),c:'bad',fx:{f:(s,c)=>{storeNpc(s,c,'spouse',25)},money:[20,60],happy:-8}}]},
  {l:T('Refuse','回绝'),out:[{w:2,t:T('The gifts are sent back. Your mother cries; your father shouts; then it is over.','聘礼退了回去。母亲哭，父亲骂，事情也就过去了。'),c:'muted',fx:{happy:-3,f:s=>parents(s).forEach(p=>p.bond=Math.max(0,p.bond-10))}},{w:1,t:T('The other family takes it as an insult. Their sons come looking for you.','对方觉得受了羞辱，家里的儿子们找上门来了。'),c:'bad',fx:{enemy:1}}]},
  {l:T('Run away on the night before','成亲前一夜出逃'),out:[{t:T('You climb out of the window with a bundle and a sword. The jianghu, at last.','你背着包袱、提着剑翻窗而出。江湖，终于来了。'),c:'gold',fx:{happy:6,fame:1,align:2,f:s=>parents(s).forEach(p=>p.bond=Math.max(0,p.bond-25)),flag:'ranaway'}}]}]});
I({id:'b_home',once:1,w:2,age:[45,70],when:s=>(s.trail||[]).length>=2,text:(c,s)=>T(`You go back to ${region(s).en}, where you were born, for the first time in decades.`,`几十年后，你第一次回到了出生的地方——${region(s).cn}。`),
 out:[{w:2,t:T('The house is gone. A noodle shop stands there. The noodles are good.','老屋没了，原地开了一家面馆。面倒是不错。'),c:'muted',fx:{happy:2}},{w:2,t:T('The children you played with are grandparents now. One of them still owes you a copper.','当年的玩伴都当了祖父祖母，其中一个还欠你一文钱。'),c:'good',fx:{happy:6}},
  {w:1,t:T('Nobody remembers you. You stand in the square for a long time.','没人记得你了。你在广场上站了很久。'),c:'muted',fx:{happy:-3,qi:2}},{w:1,if:s=>s.fame>=40,t:T('They have heard of you. The whole town turns out, and an old teacher weeps.','乡亲们都听说过你。全镇的人都出来迎你，老先生流下了眼泪。'),c:'gold',fx:{happy:10,fame:2}}]});
I({id:'b_heir',once:1,w:3,age:[62,100],when:s=>living(s,'child').length+s.people.filter(p=>p.alive&&p.rel==='disciple').length>0||s.rank>=3,
 text:()=>T('You are old enough now that people ask who will carry on after you.','你年纪大了，开始有人问：你身后，谁来接手？'),
 opts:[{l:T('Pass it to a child','传给子女'),if:s=>living(s,'child').length>0,out:[{w:2,t:T('They accept, solemnly. You see your own young face in theirs.','孩子郑重地接了下来。你在那张脸上看见了年轻时的自己。'),c:'good',fx:{happy:8,deed:T('Passed on the family legacy','传承家业')}},{w:1,t:T('Your other children never forgive the choice.','其他几个孩子始终不能释怀。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Pass it to a disciple','传给徒弟'),if:s=>s.people.some(p=>p.alive&&p.rel==='disciple'),out:[{t:T('You give them your sword and your last lesson: when not to use it.','你把剑交给了徒弟，还有最后一课：什么时候不该拔剑。'),c:'gold',fx:{happy:8,qi:4,deed:T('Named a successor to carry on your arts','为武学传承择定衣钵传人')}}]},
  {l:T('Let it end with you','到我为止'),out:[{t:T('Some things are meant to have an end.','有些东西，本就该有个尽头。'),c:'muted',fx:{qi:5}}]}]});
