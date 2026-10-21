/* 江湖一生 · a wider jianghu: more sects, and the sects acting on each other — contests, defections, stolen relics,
   successions, framed crimes, joint defence, and wars that last years and that you can be caught up in */
'use strict';

Object.assign(SECTS,{
 tiejian:{cn:'铁剑山庄',en:'Iron Sword Manor',align:1,wpn:T('Sword','剑'),arts:[['Iron Sword Style','铁剑剑法','pojia'],['Anvil Stance','铁砧桩','jinzhong'],['Forge-Fire Breath','炉火吐纳','jianqi']],blurb:T('A family of swordsmiths who fight with what they forge.','铸剑世家，用自己打的剑练自己的剑法。')},
 qinhuai:{cn:'秦淮水榭',en:'the Qinhuai Water Pavilion',align:0,female:1,wpn:T('Flute','箫'),arts:[['Willow Flute Strikes','柳箫点穴','dianxue'],['Painted-Boat Step','画舫步','lingbo'],['Soul-Stirring Song','惊魂曲','shehun']],blurb:T('Singers of the Qinhuai river who hear everything said in the pleasure boats, and sell it.','秦淮河上的歌女，画舫里说的话她们都听得见，也都卖得出价钱。')},
 qingyang:{cn:'青羊宫',en:'the Green Goat Temple',align:2,wpn:T('Staff','杖'),arts:[['Whisk-Staff Style','拂尘杖法','yiyu'],['Cloud-Walking Step','步虚','lingbo'],['Green Goat Inner Alchemy','青羊内丹','heal']],blurb:T('Daoists of Chengdu, gentle with pilgrims and very hard on thieves.','成都的道观，对香客和气，对贼人极狠。')},
 taihang:{cn:'太行刀寨',en:'the Taihang Saber Stockade',align:-1,wpn:T('Saber','刀'),easy:.2,arts:[['Mountain-Splitting Saber','劈山刀','kuangbao'],['Ridge Runner','跑山步','lingbo'],['Stone Skin','石皮功','jinzhong']],blurb:T('Mountain men of Taihang: bandits in bad years, border guards in worse ones.','太行山里的汉子：荒年做强盗，乱世守边关。')},
 wutai:{cn:'五台清凉寺',en:'Qingliang Temple of Wutai',align:2,male:1,wpn:T('Staff','棍'),arts:[['Wutai Staff','五台棍法','pojia'],['Cool-Mind Meditation','清凉禅','heal'],['Vajra Body','金刚身','jinzhong']],blurb:T('Monks of the northern holy mountain, rivals of Shaolin in staff and in scripture.','北地圣山的僧人，棍法和经义都与少林较劲。')},
 yingchou:{cn:'鹰愁堡',en:'Eagle’s Despair Fort',align:0,wpn:T('Spear','枪'),arts:[['Fort Spear','鹰愁枪法','kuaijian'],['Cliff Wall Climb','壁虎游墙','lingbo'],['Sand Wind Breath','风沙吐纳','jinzhong']],blurb:T('A fort on the western road that charges every caravan and protects the ones that pay.','西陲道上的堡子，过路商队都得交钱，交了钱的他们管到底。')},
 shuiyue:{cn:'水月庵',en:'the Water Moon Nunnery',align:2,female:1,wpn:T('Sword','剑'),arts:[['Water Moon Sword','水月剑法','yiyu'],['Lake Mist Step','洱海雾步','fenshen'],['Still Water Heart','止水心法','heal']],blurb:T('Nuns on the shore of Erhai who take in women with nowhere else to go.','洱海边的尼庵，收留无处可去的女子。')},
 wuyi:{cn:'武夷剑派',en:'the Wuyi Sword School',align:1,wpn:T('Sword','剑'),arts:[['Nine-Bend Sword','九曲剑法','lianhuan'],['Tea-Cliff Step','茶崖步','lingbo'],['Rock-Tea Breath','岩茶吐纳','jianqi']],blurb:T('Swordsmen of the tea cliffs, as proud of their tea as of their blades.','茶山上的剑客，对自家的岩茶跟对剑法一样骄傲。')},
 nanshaolin:{cn:'南少林',en:'Southern Shaolin',align:2,male:1,wpn:T('Fist','拳'),arts:[['Southern Fist','南拳','pojia'],['Five Animals Form','五形拳','lianhuan'],['Iron Thread','铁线功','jinzhong']],blurb:T('The southern branch: shorter stances, harder hands, and less patience for the north.','南边的分支：桩矮，手硬，对北边那一套也没多少耐心。')},
 bagua:{cn:'八卦门',en:'the Eight Trigrams Gate',align:1,wpn:T('Palm','掌'),arts:[['Eight Trigrams Palm','八卦游身掌','yiyu'],['Circle Walking','走转','lingbo'],['Trigram Heart Art','八卦心诀','fanzhen']],blurb:T('Palm boxers of the capital who fight walking in circles.','京城的掌门，打起来绕着圈走。')},
 shensuan:{cn:'神算门',en:'the Divine Reckoning Gate',align:0,wpn:T('Brush','笔'),arts:[['Abacus Point Strikes','算盘打穴','dianxue'],['Fortune Step','卦步','fenshen'],['Calculating Mind','神算心法','yiyu']],blurb:T('Diviners and accountants who sell the future and keep the books of half the jianghu.','算命的、算账的，卖的是将来，管的是半个江湖的账本。')},
 xuanbing:{cn:'玄冰宫',en:'the Dark Ice Palace',align:-1,female:1,wpn:T('Palm','掌'),arts:[['Dark Ice Palm','玄冰掌','neishang'],['Snowdrift Step','雪落无声','fenshen'],['Frost Heart','寒心诀','jinzhong']],blurb:T('Cold women of the northern ice who trust no man and few women.','北方冰原上的冷女子，不信男人，也不大信女人。')},
 qianmian:{cn:'千面门',en:'the Thousand Faces Gate',align:-3,wpn:T('Dagger','匕'),arts:[['Mask Dagger','易容匕','anqi'],['Borrowed Face','易容术','shehun'],['Shadow Step','鬼影步','fenshen']],blurb:T('Masters of disguise. Nobody knows how many of them there are, which is the point.','精于易容。没人知道他们有多少人，这正是他们要的。')},
 heishui:{cn:'黑水坞',en:'the Black Water Dock',align:-3,wpn:T('Saber','刀'),arts:[['River Pirate Saber','水匪刀','kuangbao'],['Diving Strike','翻江刺','pojia'],['Cold River Breath','寒江吐纳','heal']],blurb:T('River pirates of the Yangtze gorges.','长江峡里的水匪。')}});
['qianmian','heishui'].forEach(k=>{SECTS[k].evil=1});
const ADD_MAP={central:{sects:['tiejian'],more:[],evil:[]},jiangnan:{sects:[],more:['qinhuai'],evil:['qianmian']},shu:{sects:['qingyang'],more:[],evil:['heishui']},
 north:{sects:['wutai'],more:['taihang','xuanbing'],evil:[]},west:{sects:[],more:['yingchou'],evil:[]},miao:{sects:['shuiyue'],more:[],evil:[]},east:{sects:['wuyi','nanshaolin'],more:[],evil:[]},capital:{sects:['bagua'],more:['shensuan'],evil:[]}};
REGIONS.forEach(r=>{const m=ADD_MAP[r.id];if(!m)return;r.sects=r.sects.concat(m.sects);MORE_SECTS[r.id]=(MORE_SECTS[r.id]||[]).concat(m.more);EVIL_SECTS[r.id]=(EVIL_SECTS[r.id]||[]).concat(m.evil)});
[['wutai','shaolin',-1],['nanshaolin','shaolin',1],['nanshaolin','wuyi',1],['tiejian','jianlu',-1],['tiejian','huashan',1],['qinhuai','yihua',1],['qinhuai','lingshi',-1],['qingyang','emei',1],['qingyang','tang',-1],
 ['taihang','yanmen',-1],['taihang','shuofeng',1],['xuanbing','hengn',-1],['xuanbing','tianchi',1],['yingchou','kongtong',1],['yingchou','tuoling',-2],['shuiyue','yulong',1],['shuiyue','cangshan',1],['bagua','zhenyuan',-1],['bagua','tianji',1],
 ['shensuan','jinqian',1],['shensuan','tianji',-1],['qianmian','qinhuai',-1],['heishui','qingcheng',-2],['heishui','taihu',1]]
 .forEach(([a,b,v])=>{(SREL[a]=SREL[a]||{})[b]=v;(SREL[b]=SREL[b]||{})[a]=v});
if(typeof WCLS!=='undefined'){WCLS['拂']='staff'}

/* ---------- sects acting on each other ---------- */
const anyPair=(s,want,local)=>{const ks=(local?regSects(s):Object.keys(SECTS)).filter(k=>!SECTS[k].hidden);const ps=[];ks.forEach(a=>ks.forEach(b=>{if(a<b&&want(sectRel(a,b),a,b))ps.push([a,b])}));return ps.length?pick(ps).sort(()=>R()-.5):null};
const mine=s=>s.sect&&!s.retired?s.sect:null;

/* a contest between two schools, with you in it if one of them is yours */
SI({id:'sx_contest',age:[14,50],cd:7,w:1.4,when:s=>!!(mine(s)&&Object.keys(SECTS).some(k=>k!==s.sect&&regSects(s).includes(k))),
 ctx:s=>{const c=scene();const ks=regSects(s).filter(k=>k!==s.sect&&!isEvil(k));c.a=pick(ks.length?ks:Object.keys(SECTS).filter(k=>!isEvil(k)&&k!==s.sect&&!SECTS[k].hidden));c.npc=sdisc(s,c.a,{m:1.05,r:5});return c},
 text:(c,s)=>T(`${SECTS[s.sect].en} and ${SN(c.a).en} hold an exchange of skills before witnesses from half the province. Your name is drawn against ${c.npc.en}. The sects are ${RELNAME[sectRel(s.sect,c.a)].en}.`,`${SECTS[s.sect].cn}与${SN(c.a).zh}当着半省武林的面切磋交流。你抽中的对手是${c.npc.zh}。两派${RELNAME[sectRel(s.sect,c.a)].zh}。`),
 opts:[{l:T('Fight to win','全力求胜'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:c.npc.lv},stakes:'spar',title:T('Between two schools','两派切磋'),cause:T('a contest between sects','两派比试')}),
   win:[{w:2,t:T('You win. Your sect drinks to you that night.','你赢了。那晚全门上下都为你喝了一杯。'),c:'good',fx:{merit:6,fame:3,f:(s,c)=>sAdj(s,c.a,sectRel(s.sect,c.a)>=0?2:-3,1)}},{w:1,t:c=>T(`You win, and ${c.npc.en} asks to be your friend afterwards.`,`你赢了，${c.npc.zh}事后说想交你这个朋友。`),c:'good',fx:{merit:5,fame:2,meet:'friend',bond:60,f:(s,c)=>sAdj(s,c.a,4,1)}}],
   lose:[{w:1,t:T('You lose cleanly. Your master says nothing all the way home.','你输得干脆。回去的一路上，师父一句话也没说。'),c:'bad',fx:{merit:-2,skill:1}}]},
  {l:T('Fight to make friends','以武会友，点到为止'),out:[{w:2,t:c=>T(`A draw, by agreement. You and ${c.npc.en} part as friends; the two sects a little warmer.`,`说好了打成平手。你和${c.npc.zh}成了朋友，两派也暖了几分。`),c:'good',fx:{meet:'friend',bond:65,f:(s,c)=>sAdj(s,c.a,6)}},{w:1,t:T('Your elders think you held back on purpose, and say so.','长老们觉得你是故意放水，当面说了出来。'),c:'muted',fx:{merit:-3,f:(s,c)=>sAdj(s,c.a,3,1)}}]}]});

/* someone leaves one sect for another */
SI({id:'sx_defector',age:[16,65],cd:10,w:1.1,when:s=>!!anyPair(s,v=>v<=-1,1),
 ctx:s=>{const c=scene();const pr=anyPair(s,v=>v<=-1,1);c.a=pr[0];c.b=pr[1];c.npc=sdisc(s,c.a);return c},
 text:c=>T(`${c.npc.en} has left ${SN(c.a).en} for ${SN(c.b).en}, taking a manual. ${SN(c.a).en} wants them back; ${SN(c.b).en} says they came freely. Both sides ask you to carry a message.`,`${c.npc.zh}带着一本秘籍，从${SN(c.a).zh}投了${SN(c.b).zh}。${SN(c.a).zh}要人；${SN(c.b).zh}说人是自愿来的。两边都托你传话。`),
 opts:[{l:c=>T(`Carry ${SECTS[c.a].en}'s demand, sternly`,`替${SECTS[c.a].cn}严词要人`),out:[{w:s=>1+s.fame/40,t:T('The manual comes back; the defector stays. Everyone calls it a fair end.','秘籍还回来了，人留下了。都说这样收场还算公道。'),c:'good',fx:{fame:2,f:(s,c)=>{sAdj(s,c.a,6);sAdj(s,c.b,2)}}},{w:1,t:c=>T(`${SN(c.b).en} takes your tone badly.`,`${SN(c.b).zh}不喜欢你的口气。`),c:'muted',fx:{f:(s,c)=>{sAdj(s,c.a,4);sAdj(s,c.b,-8)}}}]},
  {l:T('Propose that the manual be returned and the person released','提议还书放人'),out:[{w:s=>1+s.smarts/35,t:T('Both sides accept, grumbling. You have a name now as someone who settles things.','两边都嘟囔着答应了。从此你有了个会断事的名声。'),c:'gold',fx:{fame:4,f:(s,c)=>{sAdj(s,c.a,5);sAdj(s,c.b,5)}}},{w:1,t:T('Neither side listens. You wasted a month.','两边都不听。白跑了一个月。'),c:'muted'}]},
  {l:T('Decline to be involved','推了不管'),out:[{w:1,t:T('They find another messenger.','他们另找了人传话。'),c:'muted'},{w:1,t:T('It ends in a fight on a bridge. Two are dead.','最后在一座桥上打了起来，死了两个人。'),c:'muted',fx:{happy:-2}}]}]});

/* a relic stolen, and found where it should not be */
SI({id:'sx_relic',age:[16,70],cd:12,w:.9,when:s=>!!anyPair(s,v=>v<=-1,1),
 ctx:s=>{const c=scene();const pr=anyPair(s,v=>v<=-1,1);c.a=pr[0];c.b=pr[1];c.obj=pick([T('a founder’s sword','祖师爷的佩剑'),T('a jade seal of office','掌门玉印'),T('a lacquered sutra box','漆金经匣'),T('an iron token','号令铁牌')]);c.lv=PW(1,5)(s);return c},
 text:c=>T(`${SN(c.a).en}'s ${c.obj.en} has been stolen. You find it wrapped in oilcloth under a bridge on ${SN(c.b).en}'s land. Someone wants it found there.`,`${SN(c.a).zh}的${c.obj.zh}被盗了。你在${SN(c.b).zh}地界上的一座桥下，发现它裹在油布里。有人存心要它在这里被找到。`),
 opts:[{l:c=>T(`Return it to ${SECTS[c.a].en}, quietly`,`悄悄送还${SECTS[c.a].cn}`),out:[{w:2,t:c=>T(`${SN(c.a).en} is grateful and, for now, does not blame ${SN(c.b).en}.`,`${SN(c.a).zh}很是感激，暂时也没有怪罪${SN(c.b).zh}。`),c:'good',fx:{f:(s,c)=>{sAdj(s,c.a,12);sAdj(s,c.b,3,1)}}},{w:1,t:T('They are grateful, and convinced the other sect did it.','他们很感激，也认定就是对头干的。'),c:'muted',fx:{f:(s,c)=>sAdj(s,c.a,10)}}]},
  {l:T('Watch the bridge to see who comes back for it','守在桥边，看谁回来取'),out:[{w:s=>.8+s.smarts/40,t:T('A man in a borrowed face comes at midnight: a Thousand Faces agent, sowing war. Both sects owe you.','半夜来了个易了容的人：千面门的探子，存心挑起两派战火。两派都欠了你一个人情。'),c:'gold',fx:{fame:4,f:(s,c)=>{sAdj(s,c.a,12);sAdj(s,c.b,12);sAdj(s,'qianmian',-15,1)}}},{w:1,t:T('Nobody comes. When you leave, the relic is gone.','谁也没来。等你一走，东西也不见了。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,-4,1)}}]},
  {l:T('Sell it at the ghost market','拿去鬼市卖了'),out:[{w:2,t:T('It fetches a fine price. You do not ask what happens next.','卖了个好价钱。之后的事，你没去打听。'),c:'muted',fx:{money:[120,300],align:-6}},{w:1,t:c=>T(`${SN(c.a).en} traces the sale to you.`,`${SN(c.a).zh}顺着买家查到了你头上。`),c:'bad',fx:{money:[80,150],align:-6,f:(s,c)=>sAdj(s,c.a,-30)}}]}]});

/* a well poisoned and a rival blamed */
SI({id:'sx_framed',age:[18,75],cd:15,w:.7,when:s=>!!anyPair(s,v=>v<=0,1),
 ctx:s=>{const c=scene();const pr=anyPair(s,v=>v<=0,1);c.a=pr[0];c.b=pr[1];return c},
 text:c=>T(`Three of ${SN(c.a).en}'s disciples died after drinking from their own well. A ${SECTS[c.b].en} token was found beside it. ${SN(c.a).en} is sharpening its swords.`,`${SN(c.a).zh}三个弟子喝了自家井水后死了。井边捡到一块${SECTS[c.b].cn}的腰牌。${SN(c.a).zh}正在磨刀。`),
 opts:[{l:T('Look into it before blood is spilled','赶在流血前查个明白'),out:[{w:s=>.6+s.smarts/30+s.t.wit*.1,t:T('The token is new, the poison is from the Miao hills, and the buyer was neither sect. War is averted; your name is spoken in both halls.','腰牌是新做的，毒是苗疆的，买毒的人两派都不是。一场仗没打起来，两派的大堂里都在念你的名字。'),c:'gold',fx:{fame:6,smarts:1,f:(s,c)=>{sAdj(s,c.a,15);sAdj(s,c.b,15)}}},{w:1,t:T('You find nothing in time. The swords come out.','你没能及时查出什么。刀剑还是出了鞘。'),c:'bad',fx:{f:(s,c)=>startWar(s,c.a,c.b)}}]},
  {l:T('Stay well out of it','躲得远远的'),out:[{w:1,t:T('The war that follows lasts years.','随后那场仗，打了好几年。'),c:'muted',fx:{f:(s,c)=>startWar(s,c.a,c.b)}},{w:1,t:T('Wiser heads prevail, without you.','没有你，也有明白人压住了局面。'),c:'muted'}]}]});

/* a master dies; who comes next */
SI({id:'sx_succession',age:[20,80],cd:12,w:1,when:s=>regSects(s).some(k=>!isEvil(k)),
 ctx:s=>{const c=scene();const ks=regSects(s).filter(k=>!isEvil(k));c.a=s.sect&&ks.includes(s.sect)&&chance(.4)?s.sect:pick(ks);c.x=sdisc(s,c.a,{age:rint(35,50),m:1.2});c.y=sdisc(s,c.a,{age:rint(28,45),m:1.1});c.npc=c.y;return c},
 text:c=>T(`The master of ${SN(c.a).en} has died without naming an heir. ${c.x.en}, the senior, has the elders; ${c.y.en}, the gifted, has the young. Both send gifts to your door.`,`${SN(c.a).zh}掌门去世，没有留下传位的话。年长的${c.x.zh}有长老撑腰，天分高的${c.y.zh}有年轻弟子拥护。两人都往你家送了礼。`),
 opts:[{l:c=>T(`Back ${c.x.en}`,`支持${c.x.zh}`),out:[{w:2,t:c=>T(`${c.x.en} becomes master and remembers who stood by them.`,`${c.x.zh}当上了掌门，记着谁站在自己这边。`),c:'good',fx:{f:(s,c)=>sAdj(s,c.a,8)}},{w:1,t:c=>T(`${c.x.en} wins, and ${c.y.en} leaves with half the young disciples. They do not forget you either.`,`${c.x.zh}赢了，${c.y.zh}带着一半年轻弟子出走。他们也记住了你。`),c:'muted',fx:{enemy:1,f:(s,c)=>sAdj(s,c.a,5)}}]},
  {l:c=>T(`Back ${c.y.en}`,`支持${c.y.zh}`),out:[{w:1,t:c=>T(`${c.y.en} takes the seat against the odds. You are a friend of the new master.`,`${c.y.zh}出人意料地坐上了掌门之位。你成了新掌门的朋友。`),c:'gold',fx:{meet:'friend',bond:70,f:(s,c)=>sAdj(s,c.a,12)}},{w:1.5,t:T('The elders win. You backed the wrong side, and everyone knows.','长老那边赢了。你押错了宝，人人都知道。'),c:'bad',fx:{f:(s,c)=>sAdj(s,c.a,-10)}}]},
  {l:T('Send both gifts back','两份礼都退回去'),out:[{w:1,t:T('Neither side thanks you, and neither side blames you.','两边都没谢你，也都没怪你。'),c:'muted'},{w:1,t:T('The new master, whoever it is, respects that.','不管谁当上掌门，都敬重你这份分寸。'),c:'good',fx:{f:(s,c)=>sAdj(s,c.a,4,1)}}]}]});

/* the righteous sects band together */
SI({id:'sx_league',age:[16,70],cd:10,w:1,when:s=>(EVIL_SECTS[s.region]||[]).length>0&&!isEvil(s.sect),
 ctx:s=>{const c=scene();c.e=pick(EVIL_SECTS[s.region]);const ks=regSects(s).filter(k=>!isEvil(k));c.a=pick(ks);c.b=pick(ks.filter(k=>k!==c.a))||c.a;c.lv=PW(1.1,6)(s);return c},
 text:c=>T(`${SN(c.e).en} has burned a market town. ${SN(c.a).en} and ${SN(c.b).en}, who rarely agree on anything, call for every fighter in the region to march.`,`${SN(c.e).zh}烧了一个集镇。平日里谁也不服谁的${SN(c.a).zh}和${SN(c.b).zh}，这回联名号召本地武林一同讨伐。`),
 opts:[{l:T('March with them','随众出征'),fight:(s,c)=>({foe:{name:T(`fighters of ${SECTS[c.e].en}`,`${SECTS[c.e].cn}的人马`),lv:c.lv,fixed:1},stakes:'injury',title:T('The righteous league','正道联手'),cause:T('the war against a dark sect','讨伐邪派')}),
   win:[{w:2,t:T('Their stronghold falls. For a while the righteous sects remember they are on the same side.','邪派的据点被攻破了。有那么一阵子，正道各派记起了彼此是同路人。'),c:'gold',fx:{fame:5,align:4,f:(s,c)=>{sAdj(s,c.a,8);sAdj(s,c.b,8);sAdj(s,c.e,-15,1)}}}],
   lose:[{w:1,t:T('The league breaks at the first charge. Each sect blames the other.','联军第一阵就散了。各派互相埋怨。'),c:'bad',fx:{f:(s,c)=>{sAdj(s,c.a,2,1);sAdj(s,c.e,-8,1)}}}]},
  {l:T('Bring food and medicine instead','改去送粮送药'),out:[{w:2,t:T('Less glory, more thanks.','名声少些，感激多些。'),c:'good',fx:{align:3,money:-30,f:(s,c)=>{sAdj(s,c.a,4,1);sAdj(s,c.b,4,1)}}},{w:1,t:T('Your supply cart is raided on the road.','你的粮车在路上被劫了。'),c:'bad',fx:{money:-40}}]},
  {l:T('Stay out of it','不去'),out:[{w:1,t:T('You are not the only one. Still, people notice.','不去的不止你一个。可人家还是看在眼里。'),c:'muted',fx:{fame:-1}}]}]});

/* ---------- sect wars: they start, last years, draw you in, and end ---------- */
function startWar(s,a,b){if(s.swar||!a||!b||a===b)return;s.swar={a,b,since:s.age,until:s.age+rint(2,5),sc:0};
  say(s,`[Jianghu] War between ${SECTS[a].en} and ${SECTS[b].en}. Travellers avoid the roads between them.`,`【江湖】${SECTS[a].cn}与${SECTS[b].cn}开战了。两派之间的路，没人敢走。`,'news')}
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.age<10)return;const w=s.swar;
  if(!w){if(chance(.03)){const pr=anyPair(s,v=>v<=-2,1)||(chance(.4)&&anyPair(s,v=>v<=-1,1));if(pr)startWar(s,pr[0],pr[1])}return}
  if(s.age>=w.until){delete s.swar;const win=w.sc>1?w.a:w.sc<-1?w.b:null;
    say(s,win?`[Jianghu] The war ends: ${SECTS[win].en} has the upper hand, and ${SECTS[win===w.a?w.b:w.a].en} withdraws from the disputed land.`:`[Jianghu] Exhausted, ${SECTS[w.a].en} and ${SECTS[w.b].en} make peace. Nobody won.`,
      win?`【江湖】一场仗打完了：${SECTS[win].cn}占了上风，${SECTS[win===w.a?w.b:w.a].cn}退出了争夺之地。`:`【江湖】${SECTS[w.a].cn}与${SECTS[w.b].cn}都打不动了，只好讲和。谁也没赢。`,'news');return}
  w.sc+=R()<.5?1:-1;if(chance(.6))say(s,`[Jianghu] The war between ${SECTS[w.a].en} and ${SECTS[w.b].en} goes on.`,`【江湖】${SECTS[w.a].cn}与${SECTS[w.b].cn}之战仍在继续。`,'news');
  if(s.queue.length<3&&chance(.4)){const side=s.sect===w.a?'a':s.sect===w.b?'b':null;const id=side?'sw_call':(s.fame>=30&&chance(.5)?'sw_mediate':'sw_caught');const inc=INC_BY[id];if(inc){const c=scene();c.w=w;c.side=side;c.me=side?w[side]:null;c.foe=side?w[side==='a'?'b':'a']:null;c.lv=PW(1.05,6)(s);c.npc=sdisc(s,side?c.foe:pick([w.a,w.b]));runIncident(s,inc,c)}}}})();
const swWin=(s,c,n)=>{if(!s.swar)return;s.swar.sc+=c.side==='a'?n:-n};
MV({id:'sw_call',only:1,noThread:1,text:c=>T(`${SECTS[c.me].en} calls on every disciple: ${SN(c.foe).en} is raiding the outlying farms. You are given a unit of twelve.`,`${SECTS[c.me].cn}召集所有弟子：${SN(c.foe).zh}在袭扰门下的田庄。你领了十二个人。`),
 opts:[{l:T('Lead them out','领人出击'),fight:(s,c)=>({foe:{name:T(`men of ${SECTS[c.foe].en}`,`${SECTS[c.foe].cn}的人`),lv:c.lv,fixed:1},stakes:'injury',title:T('Sect war','门派之战'),cause:T('a sect war','门派之战')}),
   win:[{w:2,t:T('You drive them off without losing anyone. The elders take note.','你把对方打退了，自己一个人没折。长老们记下了。'),c:'gold',fx:{merit:10,fame:3,f:(s,c)=>{swWin(s,c,2);sAdj(s,c.foe,-6,1)}}},{w:1,t:T('You win, but two of your twelve do not come home.','打赢了，可你那十二个人里，有两个没能回来。'),c:'muted',fx:{merit:6,happy:-6,f:(s,c)=>swWin(s,c,1)}}],
   lose:[{w:1,t:T('You are routed. The farms burn.','你被打散了。田庄被烧了。'),c:'bad',fx:{merit:-3,f:(s,c)=>swWin(s,c,-1)}}]},
  {l:T('Hold the walls and wait','守住围墙，等着'),out:[{w:2,t:T('They tire of it and go. Nothing gained, nothing lost.','对方耗不起，走了。没得什么，也没丢什么。'),c:'muted',fx:{merit:2}},{w:1,t:T('The elders call it cowardice.','长老们说这是怯战。'),c:'bad',fx:{merit:-5}}]},
  {l:T('Slip away to the other camp and ask for terms','偷偷去对面营里谈条件'),out:[{w:s=>.5+s.smarts/40,t:T('They listen. A truce is arranged, and nobody admits you arranged it.','对方肯听。停战谈成了，只是谁也不承认是你谈的。'),c:'good',fx:{fame:2,align:3,f:(s,c)=>{if(s.swar)s.swar.until=s.age;sAdj(s,c.foe,8)}}},{w:1,t:T('Your own side finds out. You are called a traitor.','自己人知道了。你被骂作叛徒。'),c:'bad',fx:{merit:-15,f:(s,c)=>sAdj(s,c.me,-15,1)}}]}]});
MV({id:'sw_caught',only:1,noThread:1,text:c=>T(`Fighting between ${SECTS[c.w.a].en} and ${SECTS[c.w.b].en} has reached your town. ${c.npc.en}, one of ${SN(c.npc.sect).en}, is wounded in your street, and the other side is coming.`,`${SECTS[c.w.a].cn}和${SECTS[c.w.b].cn}打到了你住的镇上。${SN(c.npc.sect).zh}的${c.npc.zh}伤倒在你家门口的街上，另一边的人正追过来。`),
 opts:[{l:T('Drag them inside','把人拖进屋'),out:[{w:2,t:c=>T(`${SN(c.npc.sect).en} will remember it. The other side may too.`,`${SN(c.npc.sect).zh}会记得这份情。另一边大概也会记得。`),c:'good',fx:{align:3,meet:'acq',bond:70,f:(s,c)=>{sAdj(s,c.npc.sect,10);sAdj(s,c.npc.sect===c.w.a?c.w.b:c.w.a,-6,1)}}},{w:1,t:T('They break your door down looking.','他们为了搜人，砸破了你家的门。'),c:'bad',fx:{money:[-40,-10],hurt:[5,12],cause:T('a sect war','门派之战')}}]},
  {l:T('Bar your door','关紧门'),out:[{w:1,t:T('You hear it end in the street. You do not look.','你听着外面的事了结。你没有去看。'),c:'muted',fx:{happy:-3}},{w:1,t:T('The fighting moves on. Your house is untouched.','打斗转去了别处。你家毫发无损。'),c:'muted'}]}]});
MV({id:'sw_mediate',only:1,noThread:1,text:c=>T(`Both ${SECTS[c.w.a].en} and ${SECTS[c.w.b].en} have lost too many. Someone suggests you, a known name with no stake, to broker a peace.`,`${SECTS[c.w.a].cn}和${SECTS[c.w.b].cn}都死伤太多了。有人提议，请你这个有名望、又不偏帮的人出面说和。`),
 opts:[{l:T('Broker the peace','出面说和'),out:[{w:s=>.6+s.fame/50+s.smarts/80,t:T('Over three days of tea and shouting, you get both seals on one paper. The war is over.','喝了三天茶，吵了三天架，你让两方的印盖在了同一张纸上。仗打完了。'),c:'gold',fx:{fame:8,align:4,deed:T('Ended a war between two sects','平息了一场门派之战'),f:(s,c)=>{if(s.swar)s.swar.until=s.age;sAdj(s,c.w.a,12);sAdj(s,c.w.b,12)}}},{w:1,t:T('Both sides accuse you of favouring the other.','两边都说你偏向对方。'),c:'bad',fx:{fame:-2,f:(s,c)=>{sAdj(s,c.w.a,-5,1);sAdj(s,c.w.b,-5,1)}}}]},
  {l:T('Decline: it is not your war','推辞：这不是你的仗'),out:[{w:1,t:T('Someone else tries, and fails.','换了别人去说，没说成。'),c:'muted'}]}]});
