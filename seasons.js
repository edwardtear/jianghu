/* 江湖一生 · 四季: from the age of six, every year passes in four seasons (春夏秋冬).
   Spring opens the year as before (the yearly accounts, milestones and one or two happenings). Each later season can
   bring a happening of its own and a scene of the season. The year's energy is shared out across the seasons; an
   activity that costs more than this season has left borrows from the next (acts.js apAvail/apSpend). */
'use strict';
const SEASON_N=[T('Spring','春'),T('Summer','夏'),T('Autumn','秋'),T('Winter','冬')];
function apSplit(n){const b=Math.floor(n/4),r=n%4;return[0,1,2,3].map(i=>b+(i<r?1:0))}
function seasonOn(s){return!!(s&&s.alive&&s.age>=6&&Array.isArray(s.apSeas))}
function seasonMark(s){say(s,`· ${SEASON_N[s.season|0].en} ·`,`· ${SEASON_N[s.season|0].zh} ·`,'season')}
/* the yearly accounts are done in spring: share the year's energy out and mark the season */
(()=>{const y0=yearly;yearly=function(s){const r=y0.apply(this,arguments);
  if(s.age>=6){const n=s.apMax;s.apYear=n;s.apSeas=apSplit(n);s.season=0;s.apDebt=0;s.ap=s.apMax=s.apSeas[0];seasonMark(s)}
  else{delete s.apSeas;s.season=0}
  return r}})();
/* seasons fixed to a festival or a time of year only come up then */
const INC_SEASON={lantern:0,l2_maskedlantern:0,qingming:0,newyear:0,firecracker:0,babyfire:0,cranestays:0,dragonboat:1,doubleseventh:2,moonfestival:2};
(()=>{const e0=eligible;eligible=function(s,i,tag){if(!e0.apply(this,arguments))return false;
  const k=i.season??INC_SEASON[i.id];return k==null||!seasonOn(s)||(s.season|0)===k}})();
/* the next season; after winter, the next year */
function nextSeason(s){
  if(!s.alive||s.queue.length)return;
  if(!seasonOn(s)||(s.season|0)>=3){ageUp(s);return}
  s.season=(s.season|0)+1;const E=s.log[s.log.length-1],n0=E?E.lines.length:0;seasonMark(s);
  const a=s.apSeas[s.season],d=Math.min(a,s.apDebt||0);s.apDebt=(s.apDebt||0)-d;s.apMax=a;s.ap=a-d;
  if(d){if(s.seclAt===s.age)say(s,'You are still in seclusion.','你仍在闭关之中。','muted');else say(s,`You are still busy with last season’s business: ${d} less energy this season.`,`上一季的事还没忙完，这一季少了${d}点行动力。`,'muted')}
  if(s.jail>0){if(chance(.12)){const i=pickIncident(s);if(i)runIncident(s,i)}}
  else{
    if(chance(.12)){const i=pickIncident(s);if(i)runIncident(s,i)}
    if(s.health>s.maxHealth*.35&&chance(.4)){const i=pickIncident(s,'season');if(i)runIncident(s,i)}
  }
  if(E&&E.lines.length===n0+1+(d?1:0)&&!s.queue.length){const q=SEASON_QUIET[s.season];const l=pick(s.jail>0?SEASON_JAIL:q);say(s,l[0],l[1],'muted')}
  after(s);
}
const SEASON_QUIET=[[],
 [['The cicadas never stop. Nothing else happens all summer.','蝉叫了一整个夏天，别的什么也没发生。'],['A summer of thunderstorms in the afternoon and cool evenings.','一个午后雷雨、傍晚凉快的夏天。'],['You sleep on a bamboo mat in the courtyard most nights.','这个夏天，你多半夜里睡在院中的竹席上。'],['The river runs low and warm. Children swim in it all day.','河水又浅又暖，孩子们整天泡在里面。']],
 [['The leaves turn and fall. A quiet autumn.','叶子黄了又落了。一个安静的秋天。'],['The harvest is ordinary, and so is the autumn.','收成一般，这个秋天也一般。'],['Wild geese pass overhead, heading south.','大雁从头顶飞过，往南去了。'],['You eat persimmons until you are sick of them.','你吃柿子吃到看见就怕。']],
 [['A long, grey winter. You stay close to the fire.','漫长灰暗的冬天，你守着炉火过。'],['Snow comes early and stays late.','雪下得早，化得晚。'],['The well freezes over twice. Otherwise, a quiet winter.','井水冻了两回。除此之外，冬天很安静。'],['The year ends with firecrackers and the smell of smoke.','这一年在爆竹声和硝烟味里结束了。']]];
const SEASON_JAIL=[['Another season behind bars.','又一个季节在牢里过去了。'],['The light through the high window changes. That is how you know the season has turned.','高窗透进来的光变了，你才知道换了季节。']];

/* ---------- scenes of the season (only come up in their season) ---------- */
const SNS=(k,d)=>I(Object.assign({only:1,tags:['season'],season:k,cd:12},d));
const kin=s=>living(s,['father','mother','spouse','child','sibling','grandparent']).filter(p=>!p.gone);
/* spring */
SNS(0,{id:'ss_plough',age:[12,70],text:()=>T('Planting time. Your neighbour’s ox has gone lame, and the field is still unploughed.','春耕时节，邻居家的牛瘸了腿，地还没犁。'),
 opts:[{l:T('Pull the plough yourself','自己去拉犁'),out:[{t:T('Three days in the mud. Your back aches and the field is sown. The neighbour brings you eggs all summer.','在泥里干了三天，腰都直不起来，地总算种上了。邻居一整个夏天都给你送鸡蛋。'),c:'good',fx:{align:1,skill:1,happy:2}}]},
  {l:T('Pay to hire an ox','花钱雇头牛'),cost:10,out:[{t:T('Ten taels, and the planting is done on time.','花了十两，地按时种上了。'),c:'good',fx:{align:2,fame:1}}]},
  {l:T('It is not your field','又不是你的地'),out:[{t:T('You walk past. The field is planted late, and the crop is thin.','你走了过去。那块地种晚了，收成很薄。'),c:'muted',fx:{align:-1}}]}]});
SNS(0,{id:'ss_kite',age:[8,40],text:()=>T('A child’s kite is caught at the top of an old locust tree. The child is crying.','一个孩子的风筝挂在老槐树顶上，孩子哭个不停。'),
 opts:[{l:T('Climb up','爬上去'),out:[{w:s=>2+power(s)/30,t:T('You bring it down without a tear in the paper. The child stares at you as if you could fly.','你把风筝取了下来，纸都没破。孩子看你的眼神，好像你会飞。'),c:'good',fx:{happy:4,fame:1}},{w:1,t:T('A branch snaps. You land on your back with the kite on your chest.','树枝断了。你摔了个仰面朝天，风筝落在胸口。'),c:'bad',fx:{hurt:[2,6],cause:T('a fall from a tree','从树上摔下'),happy:1}}]},
  {l:T('Knock it down with a stone','用石子打下来'),out:[{w:s=>1+power(s)/40,t:T('One stone, and the kite drifts down. The child claps.','一颗石子，风筝就飘了下来。孩子直拍手。'),c:'good',fx:{happy:3}},{w:1,t:T('The stone goes through the kite. Now the child cries louder.','石子把风筝打穿了。孩子哭得更响了。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Walk on','走开'),out:[{t:T('Somebody else will help. Probably.','总会有人帮的。大概吧。'),c:'muted'}]}]});
SNS(0,{id:'ss_peach',age:[15,60],text:c=>T(`The peach trees outside town are in full bloom. Under one of them, ${c.npc.en}, ${c.npc.desc.en}, is reading alone.`,`城外桃花开得正盛。一棵树下，${c.npc.desc.zh}${c.npc.zh}独自在看书。`),
 opts:[{l:T('Start a conversation','上前搭话'),out:[{w:3,t:c=>T(`You talk until the light goes. ${c.npc.en} asks where to find you.`,`你们一直聊到天色暗下来。${c.npc.zh}问你住在哪里。`),c:'good',fx:{meet:'friend',bond:60,happy:4}},{w:1,t:T('You say something clumsy. The book goes up like a wall.','你说了句不得体的话，对方把书一举，像竖起一堵墙。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Just enjoy the blossom','只看花'),out:[{t:T('Petals fall on your sleeves. You stay until evening.','花瓣落满了衣袖，你一直待到傍晚。'),c:'good',fx:{happy:5}}]}]});
SNS(0,{id:'ss_flood',age:[12,70],text:()=>T('The spring melt swells the river overnight. The dyke above the village is starting to seep.','春汛一夜之间涨了起来，村子上游的堤坝开始渗水。'),
 opts:[{l:T('Help carry sandbags','去扛沙袋'),out:[{w:3,t:T('All night in the rain. By dawn the dyke holds. The village headman remembers your name.','冒雨干了一整夜，天亮时堤保住了。村长记住了你的名字。'),c:'good',fx:{align:2,fame:2,happy:-2}},{w:1,t:T('The bank gives way under your feet and the water takes you a hundred paces before you catch a root.','脚下的堤岸塌了，水把你冲出去百来步，才抓住一根树根。'),c:'bad',fx:{hurt:[4,10],cause:T('a spring flood','春汛'),align:2}}]},
  {l:T('Move your own things to high ground','先把自家东西搬到高处'),out:[{t:T('The dyke holds without you. Your things are dry. Nobody says anything, but people noticed.','堤坝没有你也保住了，你的东西也没湿。没人说什么，可大家都看见了。'),c:'muted',fx:{align:-1}}]}]});
/* summer */
SNS(1,{id:'ss_heat',age:[12,80],text:()=>T('On a blazing road, a traveller collapses in the dust from the heat.','烈日当头的大路上，一个行人中了暑，倒在尘土里。'),
 opts:[{l:T('Carry them into the shade','把人扶到树荫下'),out:[{w:2,t:c=>T(`You give water and fan them until they come round. It is ${c.npc.en}, who insists on knowing your name.`,`你喂水扇风，等那人醒过来。原来是${c.npc.zh}，非要问你的名字不可。`),c:'good',fx:{meet:'acq',bond:55,align:1}},{w:2,t:T('They come round, thank you, and go on their way.','那人醒过来，道了谢，继续赶路了。'),c:'good',fx:{align:1,happy:2}}]},
  {l:T('Leave them','不管'),out:[{t:T('Someone else stops. You do not look back.','有别人停了下来。你没有回头。'),c:'muted',fx:{align:-2}}]}]});
SNS(1,{id:'ss_storm',age:[14,80],text:c=>T(`A summer thunderstorm drives you into a ruined temple. ${c.npc.en}, ${c.npc.desc.en}, is already there, with a sword across their knees.`,`一场夏日雷雨把你赶进一座破庙。${c.npc.desc.zh}${c.npc.zh}已经在里面了，膝上横着一把剑。`),
 opts:[{l:T('Share the fire and talk','一起烤火聊天'),out:[{w:2,t:c=>T(`By the time the rain stops you have swapped stories of half the jianghu. ${c.npc.en} says you will meet again.`,`雨停的时候，你们已经把半个江湖的故事都讲了一遍。${c.npc.zh}说后会有期。`),c:'good',fx:{meet:'acq',bond:55,happy:3}},{w:1,t:T('They talk about a hidden cave in the hills, then fall asleep. You remember every word.','对方说起山里一处隐秘的山洞，然后就睡着了。你把每个字都记住了。'),c:'good',fx:{skill:1,happy:2}}]},
  {l:T('Keep to your own corner','各占一角'),out:[{t:T('Neither of you sleeps. At first light, you both leave without a word.','两人谁也没睡。天一亮，各走各路，一句话都没说。'),c:'muted'}]}]});
SNS(1,{id:'ss_melon',age:[10,70],text:()=>T('At night you catch two ragged boys stealing melons from a farmer’s field.','夜里你撞见两个衣衫破烂的少年在偷瓜田里的瓜。'),
 opts:[{l:T('Pay the farmer for the melons','替他们付瓜钱'),cost:3,out:[{t:T('The farmer laughs and tells the boys to come and work for him instead. They do.','瓜农笑了，叫两个孩子以后来给他干活。他们真来了。'),c:'good',fx:{align:2,happy:3}}]},
  {l:T('Drag them to the farmer','把他们揪到瓜农那里'),out:[{t:T('The farmer beats them with a bamboo pole. You wonder if that was what you wanted.','瓜农用竹竿抽了他们一顿。你心想，这是不是你想要的。'),c:'muted',fx:{align:1,happy:-1}}]},
  {l:T('Pretend you saw nothing','装没看见'),out:[{t:T('They run off with a melon each. It was a very hot summer.','他们一人抱着一个瓜跑了。那年夏天很热。'),c:'muted'}]}]});
SNS(1,{id:'ss_fever',age:[14,80],text:()=>T('Summer fever spreads through the lower town. The only doctor has not slept in three days and asks for help.','夏季时疫在下城蔓延。唯一的大夫三天没合眼了，向人求助。'),
 opts:[{l:T('Help nurse the sick','去帮忙照顾病人'),out:[{w:3,t:T('Weeks of boiling water and bitter herbs. The fever passes, and the lower town does not forget who came.','熬了几个星期的开水和苦药，时疫总算过去了。下城的人记住了是谁来帮的忙。'),c:'good',fx:{align:2,fame:2,happy:-2}},{w:1,t:T('You catch it too, and spend a miserable month in bed.','你也染上了，在床上难受了一个月。'),c:'bad',fx:{hurt:[4,10],cause:T('a summer fever','夏季时疫'),align:2}}]},
  {l:T('Give money for medicine','捐钱买药'),cost:15,out:[{t:T('Your silver buys a cartload of herbs. The doctor writes your name on the clinic wall.','你的银子买了一车草药。大夫把你的名字写在了医馆墙上。'),c:'good',fx:{align:2,fame:1}}]},
  {l:T('Stay away from the lower town','躲着下城走'),out:[{t:T('You stay healthy, and a little ashamed.','你没染病，只是有点惭愧。'),c:'muted'}]}]});
/* autumn */
SNS(2,{id:'ss_letter',age:[16,90],when:s=>living(s,['friend','sworn','acq','fellow']).some(p=>!p.gone&&s.age-(p.met??s.age)>=3),
 ctx:s=>{const c=scene();const p=pick(living(s,['friend','sworn','acq','fellow']).filter(p=>!p.gone&&s.age-(p.met??s.age)>=3));c.pid=p.id;c.npc=T(p.n.py,p.n.cn);return c},
 text:c=>T(`An autumn letter arrives from ${c.npc.en}. The handwriting is shakier than you remember. “The osmanthus is blooming here. I thought of you.”`,`秋天，${c.npc.zh}来了一封信。字迹比你记得的抖了些。"这里的桂花开了，想起了你。"`),
 opts:[{l:T('Write a long reply','回一封长信'),out:[{t:T('You write until the candle is gone. A reply comes back within the month.','你写到蜡烛燃尽。不到一个月，回信就来了。'),c:'good',fx:{bond:8,happy:3}}]},
  {l:T('Go and visit','亲自去看看'),cost:8,out:[{t:c=>T(`You arrive unannounced. ${c.npc.en} drops a teacup, then laughs for a long time.`,`你没打招呼就到了。${c.npc.zh}手里的茶杯都掉了，然后笑了好久。`),c:'good',fx:{bond:14,happy:5}}]},
  {l:T('Put it in a drawer','收进抽屉'),out:[{t:T('You mean to answer. The winter comes first.','你本想回的，冬天却先来了。'),c:'muted',fx:{bond:-3}}]}]});
SNS(2,{id:'ss_poetry',age:[14,80],text:()=>T('A chrysanthemum gathering at the scholar’s garden: wine, crabs, and everyone must make a verse.','书生的园子里办赏菊会：有酒、有蟹，人人都得作一首诗。'),
 opts:[{l:T('Compose a verse','作一首'),out:[{w:s=>s.smarts/25,t:T('Your verse is copied out and passed around. Someone asks to frame it.','你的诗被人抄去传看，还有人要裱起来。'),c:'gold',fx:{fame:3,happy:5}},{w:2,t:T('Polite silence, then someone changes the subject.','一阵客气的沉默，接着有人岔开了话题。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Just eat the crabs','只管吃蟹'),out:[{t:T('Eleven crabs. Nobody asks you for a verse.','你吃了十一只蟹。没人再叫你作诗。'),c:'good',fx:{happy:4}}]}]});
SNS(2,{id:'ss_taxrunner',age:[16,80],text:()=>T('After the harvest, a tax runner is taking grain from a widow’s granary, far more than she owes.','秋收过后，一个催粮的衙役在一个寡妇家的粮仓里搬粮，远远多过她该交的。'),
 opts:[{l:T('Stop him','拦住他'),out:[{w:s=>1+power(s)/35,t:T('One look at you and he puts half the sacks back. He mutters about the magistrate, but goes.','他看了你一眼，把一半粮袋放了回去，嘴里嘟囔着县太爷，还是走了。'),c:'good',fx:{align:2,fame:2}},{w:1,t:T('He brings two friends with clubs. You win, but they report you.','他叫来两个拿棍子的帮手。你打赢了，可他们告了你一状。'),c:'bad',fx:{hurt:[3,8],cause:T('a brawl with tax runners','与催粮衙役斗殴'),align:2}}]},
  {l:T('Argue the law with him','跟他讲道理'),out:[{w:s=>s.smarts/30,t:T('You quote the tax rate back at him, and the neighbours gather. He backs down.','你把税额一条条念给他听，邻居们都围了过来。他只好作罢。'),c:'good',fx:{align:2,fame:1}},{w:1,t:T('He laughs and takes the grain anyway.','他笑了笑，照样把粮搬走了。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Not your business','不关你的事'),out:[{t:T('The widow does not ask you for anything. That is somehow worse.','寡妇什么也没求你。不知怎的，这反倒更难受。'),c:'muted',fx:{align:-1}}]}]});
SNS(2,{id:'ss_hunt',age:[14,65],text:()=>T('The autumn hunt: the hills are full of deer and boar before the snows, and the villagers are going up together.','秋猎时节，下雪前山里满是鹿和野猪，村里人要一起上山。'),
 opts:[{l:T('Join the hunt','一起去'),out:[{w:3,t:T('You bring down a stag. Your share of the meat and hide sells well.','你射倒了一头雄鹿。分到的肉和皮卖了个好价钱。'),c:'good',fx:{money:[15,35],happy:3}},{w:1,t:T('A wounded boar turns on you.','一头受伤的野猪朝你冲了过来。'),c:'bad',fx:{hurt:[4,10],cause:T('a boar in the autumn hunt','秋猎时的野猪')}}]},
  {l:T('Stay home','不去'),out:[{t:T('They bring you a leg of venison anyway.','他们还是给你送来一条鹿腿。'),c:'muted',fx:{happy:1}}]}]});
/* winter */
SNS(3,{id:'ss_snowinn',age:[14,80],text:()=>T('A blizzard traps you at a mountain inn with a dozen strangers. The food will not last.','暴风雪把你和十几个陌生人困在山间客栈里，存粮撑不了几天。'),
 opts:[{l:T('Share what you carry','把自己的干粮分出来'),out:[{w:2,t:c=>T(`Everyone eats a little. ${c.npc.en}, who had nothing, will not forget it.`,`每人都吃上了一点。身无分文的${c.npc.zh}，不会忘记这件事。`),c:'good',fx:{meet:'friend',bond:60,align:1}},{w:2,t:T('Everyone eats a little, and the snow stops on the fourth day.','每人都吃上了一点，第四天雪停了。'),c:'good',fx:{align:1,happy:2}}]},
  {l:T('Keep your food to yourself','自己的干粮自己吃'),out:[{t:T('You eat in your room. The others are hungry and quiet when you leave.','你在屋里吃。你走的时候，别人都饿着肚子，一声不吭。'),c:'muted',fx:{align:-3}}]}]});
SNS(3,{id:'ss_debtor',age:[18,90],when:s=>s.money>=30,text:c=>T(`Before the New Year, ${c.npc.en}, who owes you 20 taels, comes to beg for more time. Their children are waiting outside in the snow.`,`年关将近，欠你二十两的${c.npc.zh}来求你宽限些日子。孩子们在外头的雪地里等着。`),
 opts:[{l:T('Forgive the debt','这笔债就算了'),out:[{t:T('They bow until their forehead touches the floor. Word gets round.','对方磕头磕到了地上。这事传了出去。'),c:'good',fx:{align:3,happy:3,fame:1}}]},
  {l:T('Give them until spring','宽限到开春'),out:[{w:2,t:T('In spring they pay, every coin, with a jar of pickles.','开春时，对方一文不少地还了，还送来一坛咸菜。'),c:'good',fx:{money:20,align:2}},{w:1,t:T('By spring they have moved away.','到了开春，对方已经搬走了。'),c:'muted'}]},
  {l:T('Demand it now','现在就还'),out:[{t:T('They sell their winter coats to pay you. You count it twice.','对方卖了过冬的棉衣还你。你数了两遍。'),c:'muted',fx:{money:20,align:-5}}]}]});
SNS(3,{id:'ss_reunion',age:[14,90],when:s=>kin(s).length>0,
 text:()=>T('The New Year is coming. The roads home are crowded with people carrying gifts.','快过年了，回家的路上挤满了提着年货的人。'),
 opts:[{l:T('Go home for the New Year','回家过年'),cost:5,out:[{t:T('Dumplings, firecrackers, and the same old arguments. It is good to be home.','饺子、爆竹，还有吵了多少年的那几句。回家真好。'),c:'good',fx:{happy:6,f:s=>kin(s).forEach(p=>addBond(p,6))}}]},
  {l:T('Stay and train through the holiday','留下来过年练功'),out:[{t:T('The courtyard is silent. You train alone while the town celebrates.','院子里静悄悄的。全城都在过年，你一个人练功。'),c:'muted',fx:{skill:2,happy:-4,f:s=>kin(s).forEach(p=>addBond(p,-3))}}]}]});
SNS(3,{id:'ss_ice',age:[12,70],text:()=>T('A child falls through the ice on the frozen river.','一个孩子掉进了结冰的河里。'),
 opts:[{l:T('Go in after them','跳下去救'),out:[{w:s=>2+s.t.root/3,t:T('You come out blue with cold and holding the child. The family burns incense for you every New Year after.','你冻得浑身发青，怀里抱着孩子爬了上来。那家人往后每年过年都为你烧香。'),c:'good',fx:{align:3,fame:3}},{w:1,t:T('The cold nearly takes you both. You get the child out, and lie sick for a month.','冰水差点把你们俩都吞了。孩子救上来了，你病了一个月。'),c:'bad',fx:{align:3,fame:2,hurt:[4,9],cause:T('the frozen river','冰河')}}]},
  {l:T('Run for a rope and help','去找绳子叫人'),out:[{w:2,t:T('The rope arrives in time. The child is saved.','绳子及时送到，孩子救上来了。'),c:'good',fx:{align:1}},{w:1,t:T('By the time you are back, the child is gone under the ice.','等你回来，孩子已经沉到冰下去了。'),c:'bad',fx:{happy:-8}}]}]});

/* spring has its scenes too, after the year's own happenings */
(()=>{const a0=ageUp;ageUp=function(s){const r=a0.apply(this,arguments);
  if(seasonOn(s)&&(s.season|0)===0&&s.jail<=0&&s.health>s.maxHealth*.35&&chance(.35)){const i=pickIncident(s,'season');if(i){runIncident(s,i);after(s)}}
  return r}})();
/* ---------- things to do in each season: one each, shown in the activities under 时令 ---------- */
ACT_CATS.unshift(['season',T('This season','时令')]);
const SACT=(k,d)=>addAct(Object.assign({cat:'season',ap:1},d,{if:s=>seasonOn(s)&&(s.season|0)===k&&s.jail<=0&&(s.sdone||{})[d.id]!==s.age&&(!d.if||d.if(s)),
  run:s=>{(s.sdone=s.sdone||{})[d.id]=s.age;d.run(s)}}));
SACT(0,{id:'sa_outing',n:T('Spring outing','踏青'),d:T('A day in the hills. Lifts your mood; you may meet someone.','到郊外走一走。心情变好，也许会遇到什么人。'),ok:s=>needAge(s,6),
 run(s){happy(s,6);if(s.age>=14&&chance(.3)){const c=scene();c.npc=npc(s);storeNpc(s,c,'acq',rint(45,60));say(s,`Among the willows you fall into conversation with ${c.npc.en}.`,`柳树下，你和${c.npc.zh}攀谈了起来。`,'good')}else{const l=pick([['Willow catkins everywhere. You come home sneezing and happy.','柳絮漫天飞。你打着喷嚏，高高兴兴地回了家。'],['You climb to the old pavilion and watch the fields turn green.','你爬上旧亭子，看着田野一点点变绿。']]);say(s,l[0],l[1],'good')}}});
SACT(1,{id:'sa_swim',n:T('Cool off at the river','下河消暑'),d:T('Swimming in the summer heat: a little health and mood.','夏日下河游水：养些气血，心情也好。'),ok:s=>needAge(s,6),
 run(s){heal(s,6);happy(s,4);say(s,'You swim until your fingers wrinkle, then lie on a warm rock to dry.','你在水里泡到手指发皱，再躺在晒热的石头上晾干。','good')}});
SACT(2,{id:'sa_climb',n:T('Climb the heights','重阳登高'),d:T('A climb for the Double Ninth: mood, and a little strength.','重阳节登高：心情变好，也长些力气。'),ok:s=>needAge(s,6),
 run(s){happy(s,4);s.skill+=.6;say(s,'At the top you drink chrysanthemum wine and look out over the whole county.','在山顶喝了一杯菊花酒，整个县城尽收眼底。','good')}});
SACT(3,{id:'sa_coldtrain',n:T('Train in the deep cold','冬练三九'),d:T('Training in the bitter cold: more progress than usual, but it is hard on the body.','三九天里练功：长进比平时多，但很伤身子。'),ok:s=>needAge(s,10),
 run(s){s.skill+=trainGain(s,1.4);happy(s,-2);if(chance(.15))wound(s,3,8,T('training in the bitter cold','三九天练功'));say(s,'Frost on your eyebrows, steam rising off your back. The cold teaches you something the summer never did.','眉毛上结了霜，背上冒着热气。严寒教给你的，是夏天学不到的。','good')}});
/* festival and harvest chances among this year's opportunities only open in their season */
const OPP_SEASON={o_harvest:2,o_wx_lantern:0,o_wx_laba:3};
Object.entries(OPP_SEASON).forEach(([id,k])=>{const a=ACT_BY[id];if(!a)return;const ok0=a.ok;
  a.ok=s=>seasonOn(s)&&(s.season|0)!==k?T(`Only in ${SEASON_N[k].en.toLowerCase()}`,`${SEASON_N[k].zh}季才有`):ok0?ok0(s):true});
