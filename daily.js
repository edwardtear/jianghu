/* 江湖一生 · ordinary days built from your own life: the people you actually know, the places you go, the festivals of the year,
   the small business of your rank in your sect, and a handful of small firsts that happen once in a life */
'use strict';

/* ---------- how the narration addresses someone ---------- */
const givenOf=p=>{const c=p.n.cn,s=p.n.sur?p.n.sur[0]:'';return s&&c.startsWith(s)&&c.length>s.length?c.slice(s.length):c};
const givenPy=p=>{const y=p.n.py,s=p.n.sur?p.n.sur[1]:'';return s&&y.startsWith(s+' ')?y.slice(s.length+1):y};
const surPy=p=>p.n.sur?p.n.sur[1]:p.n.py.split(' ')[0];
const surCn=p=>p.n.sur?p.n.sur[0]:p.n.cn[0];
function addr(s,p){
  const m=p.sex==='m',older=p.age>s.age;
  switch(p.rel){
    case'father':return T('your father','父亲');
    case'mother':return T('your mother','母亲');
    case'sibling':return T(`your ${older?'elder':'younger'} ${m?'brother':'sister'} ${givenPy(p)}`,`${older?(m?'哥哥':'姐姐'):(m?'弟弟':'妹妹')}${givenOf(p)}`);
    case'spouse':return T(m?'your husband':'your wife',m?'丈夫':'妻子');
    case'child':return T(`your ${m?'son':'daughter'} ${givenPy(p)}`,`${m?'儿子':'女儿'}${givenOf(p)}`);
    case'master':return T('your master','师父');
    case'disciple':return T(`your disciple ${givenPy(p)}`,`徒弟${givenOf(p)}`);
    case'fellow':return T(`${m?'Brother':'Sister'} ${surPy(p)}`,`${surCn(p)}${older?(m?'师兄':'师姐'):(m?'师弟':'师妹')}`);
    default:return T(p.n.py,p.n.cn);
  }}
const A_=(s,p)=>addr(s,p);
const Cap=t=>T(t.en[0].toUpperCase()+t.en.slice(1),t.zh);
const bondUp=(p,n)=>{p.bond=clamp(p.bond+n,0,100)};

/* ---------- small moments with the people in your life ---------- */
/* each: {rels, age:[a,b], w, t:(s,p,pl)=>T} ; pl is a place */
const MOMENTS=[
 {rels:['father'],age:[3,15],t:(s,p)=>T('Your father lets you hold the reins on the way back from market. The ox ignores you completely.','从集上回来的路上，父亲让你牵缰绳。那头牛压根不理你。')},
 {rels:['father'],age:[6,20],t:(s,p)=>T('Your father mends the roof and you hand up the tiles. He does not say much. He does not need to.','父亲补屋顶，你在下面递瓦。他话不多，也用不着多说。')},
 {rels:['father'],age:[16,60],when:s=>s.age>=16,t:(s,p)=>T('You notice your father climbs the stairs more slowly now. You take the heavy end of the load without asking.','你发现父亲上台阶慢了。你没问，就把重的那头扛了过来。')},
 {rels:['mother'],age:[2,14],t:(s,p)=>T('Your mother sews a padded jacket for winter, holding it against you every few stitches to check the size.','母亲给你缝过冬的棉袄，缝几针就拿到你身上比一比。')},
 {rels:['mother'],age:[15,60],t:(s,p)=>T('A parcel from your mother: dried meat, two pairs of cloth shoes and a note someone wrote for her. "Eat properly."','母亲托人捎来一个包袱：腊肉，两双布鞋，一张请人代写的字条："好好吃饭。"')},
 {rels:['mother'],age:[20,70],t:(s,p)=>T('You go home for a few days. Your mother cooks far too much and watches you eat all of it.','你回家住了几天。母亲做了一大桌菜，看着你一口一口吃完。')},
 {rels:['sibling'],age:[4,16],t:(s,p,pl)=>T(`You and ${A_(s,p).en} catch crickets by ${pl.en} until it is too dark to see.`,`你和${A_(s,p).zh}在${pl.zh}捉蟋蟀，一直捉到天黑看不见。`)},
 {rels:['sibling'],age:[4,16],t:(s,p)=>T(`${Cap(A_(s,p)).en} breaks a bowl and blames you. You take the beating, and later get paid back in sweets.`,`${A_(s,p).zh}打碎了碗，赖在你头上。你替着挨了顿打，后来得了几块糖作补偿。`)},
 {rels:['sibling'],age:[17,80],t:(s,p)=>T(`A letter from ${A_(s,p).en}: a new child, a bad harvest, and a question about whether you are eating enough.`,`${A_(s,p).zh}来信：添了个孩子，收成不好，还问你吃得饱不饱。`)},
 {rels:['sibling'],age:[17,80],t:(s,p)=>T(`${Cap(A_(s,p)).en} needs to borrow money and is too proud to say so. You leave a purse on the table and leave.`,`${A_(s,p).zh}手头紧，又拉不下脸开口。你把一袋钱放在桌上，走了。`),fx:(s,p)=>{if(s.money>=20){payT(s,-Math.min(30,Math.round(s.money*.05)),'people');bondUp(p,6)}}},
 {rels:['spouse'],age:[18,90],t:(s,p)=>T(`${Cap(A_(s,p)).en} has kept your supper warm in the pot again. You eat it standing up in the kitchen, talking about nothing.`,`${A_(s,p).zh}又把晚饭温在锅里等你。你站在灶边吃，两人说些不相干的闲话。`),fx:(s,p)=>bondUp(p,2)},
 {rels:['spouse'],age:[18,90],t:(s,p)=>T(`You quarrel with ${A_(s,p).en} about money, of all things. By evening neither of you remembers who started it.`,`你和${A_(s,p).zh}为了钱拌嘴。到了晚上，谁也记不起是谁先开的头。`)},
 {rels:['spouse'],age:[40,95],t:(s,p)=>T(`You find a grey hair on ${A_(s,p).en}’s head, and pull it out, and say nothing about the others.`,`你在${A_(s,p).zh}头上发现一根白发，拔了下来，没提其余的。`),fx:(s,p)=>bondUp(p,2)},
 {rels:['child'],age:[18,90],when:(s,p)=>p.age<12,t:(s,p)=>T(`${Cap(A_(s,p)).en} copies your stance in the yard with a stick for a sword, very seriously, and falls over.`,`${A_(s,p).zh}拿根树枝当剑，在院子里一本正经地学你的架势，然后摔了一跤。`),fx:(s,p)=>bondUp(p,3)},
 {rels:['child'],age:[18,90],when:(s,p)=>p.age<14,t:(s,p)=>T(`${Cap(A_(s,p)).en} has a fever all night. You sit up with a wet cloth until it breaks at dawn.`,`${A_(s,p).zh}烧了一整夜。你拿着湿布守到天亮，烧才退了。`),fx:(s,p)=>bondUp(p,4)},
 {rels:['child'],age:[30,99],when:(s,p)=>p.age>=16,t:(s,p)=>T(`${Cap(A_(s,p)).en} argues with you about something you once said yourself, word for word, to your own parents.`,`${A_(s,p).zh}跟你顶嘴，说的话一字不差，正是你当年对爹娘说过的。`)},
 {rels:['master'],age:[8,70],t:(s,p)=>T('Your master corrects your grip with two fingers and walks away without a word. It is the best lesson all month.','师父用两根手指把你的握法拨正，一言不发地走了。这是这个月最好的一课。'),fx:(s,p)=>{bondUp(p,2);s.skill+=1}},
 {rels:['master'],age:[8,70],t:(s,p)=>T('Your master is in a foul mood and makes everyone run the mountain steps twice. Nobody dares ask why.','师父心情不好，罚所有人把山阶跑两遍。没人敢问为什么。')},
 {rels:['master'],age:[14,80],when:(s,p)=>p.age>=60,t:(s,p)=>T('Your master’s cough is worse this winter. You take over his morning lesson without being asked, and he lets you.','师父这个冬天咳得更厉害了。你没等吩咐就替他上了早课，他也由着你。'),fx:(s,p)=>bondUp(p,4)},
 {rels:['fellow'],age:[8,60],t:(s,p,pl)=>T(`${A_(s,p).en} sneaks out to ${pl.en} after lights-out and comes back with wine. You share it on the roof.`,`${A_(s,p).zh}熄灯后偷偷溜去${pl.zh}，带回一壶酒。你们在屋顶上分着喝了。`),fx:(s,p)=>bondUp(p,3)},
 {rels:['fellow'],age:[8,60],t:(s,p)=>T(`${A_(s,p).en} has the bunk by the window and snores like a saw. You have opinions about this.`,`${A_(s,p).zh}睡靠窗的铺，打鼾像拉锯。你对此很有意见。`)},
 {rels:['fellow'],age:[10,60],t:(s,p)=>T(`You spar with ${A_(s,p).en} at dawn. Neither of you wins; both of you limp to breakfast.`,`天刚亮你和${A_(s,p).zh}拆招。谁也没赢，两人都一瘸一拐地去吃早饭。`),fx:(s,p)=>{s.skill+=1}},
 {rels:['fellow'],age:[10,60],t:(s,p)=>T(`${A_(s,p).en} is homesick and pretends not to be. You pretend not to notice.`,`${A_(s,p).zh}想家，又装作不想。你也装作没看出来。`),fx:(s,p)=>bondUp(p,2)},
 {rels:['disciple'],age:[25,95],t:(s,p)=>T(`${Cap(A_(s,p)).en} asks a question you cannot answer. You say "think about it yourself" and go and think about it yourself.`,`${A_(s,p).zh}问了个你答不上来的问题。你说"自己想"，然后自己回屋去想了。`),fx:(s,p)=>{s.smarts=clamp(s.smarts+1,0,100)}},
 {rels:['disciple'],age:[25,95],t:(s,p)=>T(`You watch ${A_(s,p).en} practise and see your own worst habit, perfectly copied.`,`你看${A_(s,p).zh}练功，看见了自己最坏的那个毛病，学得一模一样。`)},
 {rels:['friend','sworn'],age:[12,95],t:(s,p,pl)=>T(`You run into ${p.n.py} at ${pl.en} and lose the whole afternoon to talk.`,`你在${pl.zh}碰见${p.n.cn}，一聊就是一下午。`),fx:(s,p)=>bondUp(p,3)},
 {rels:['friend','sworn'],age:[16,95],t:(s,p)=>T(`${p.n.py} sends a jar of wine from home with a note: "Not as good as last year’s. Drink it anyway."`,`${p.n.cn}从家乡捎来一坛酒，附了张字条："不如去年的好。照喝。"`),fx:(s,p)=>bondUp(p,2)},
 {rels:['friend','sworn'],age:[16,95],t:(s,p)=>T(`${p.n.py} loses at dice to you three nights running and swears never to play you again. On the fourth night, ${PRON[p.sex].he} is back.`,`${p.n.cn}连着三晚掷骰子输给你，发誓再也不跟你赌了。第四晚${PRON[p.sex].ta}又来了。`)},
 {rels:['friend','sworn'],age:[30,95],t:(s,p)=>T(`You and ${p.n.py} agree that the young people today have no manners, and then remember you said the same at their age.`,`你和${p.n.cn}一致认为如今的年轻人没规矩，随即想起自己年轻时也这么被人说过。`)},
 {rels:['lover'],age:[14,60],t:(s,p,pl)=>T(`You meet ${p.n.py} at ${pl.en} by "accident", for the third time this month.`,`你在${pl.zh}"碰巧"遇见${p.n.cn}，这个月已经是第三回了。`),fx:(s,p)=>bondUp(p,3)},
 {rels:['lover'],age:[14,60],t:(s,p)=>T(`${p.n.py} gives you a sachet ${PRON[p.sex].he} stitched badly on purpose, so you would know nobody else made it.`,`${p.n.cn}送你一个香囊，故意缝得歪歪扭扭，好让你知道不是别人做的。`),fx:(s,p)=>bondUp(p,3)},
 {rels:['rival'],age:[12,80],t:(s,p)=>T(`You hear ${p.n.py} has been training twice as hard since your last meeting. You get up an hour earlier.`,`听说${p.n.cn}自上回之后加倍苦练。你也每天早起了一个时辰。`),fx:(s,p)=>{s.skill+=1}},
 {rels:['enemy'],age:[14,90],t:(s,p,pl)=>T(`You glimpse ${p.n.py} across ${pl.en}. You both pretend not to see each other, and both check behind you on the way home.`,`你在${pl.zh}对面瞥见了${p.n.cn}。两人都装作没看见，回家路上都回头看了好几次。`)},
 {rels:['acq'],age:[12,90],t:(s,p,pl)=>T(`${p.n.py}, whom you hardly know, waves to you at ${pl.en} as if you were old friends. You wave back. Perhaps you are now.`,`你跟${p.n.cn}本不太熟，${PRON[p.sex].ta}却在${pl.zh}像老朋友一样朝你招手。你也招了招手。也许从此就算朋友了。`),fx:(s,p)=>bondUp(p,4)}
];
function momentFor(s){
  const al=s.people.filter(p=>p.alive&&!p.temp);if(!al.length)return null;
  s.momSeen=s.momSeen||[];
  const ok=[];MOMENTS.forEach((m,i)=>{if(s.age<m.age[0]||s.age>m.age[1])return;const ps=al.filter(p=>m.rels.includes(p.rel)&&(!m.when||m.when(s,p)));if(ps.length)ok.push({m,i,ps})});
  if(!ok.length)return null;
  const fresh=ok.filter(o=>!s.momSeen.includes(o.i));const o=pick(fresh.length?fresh:ok);
  s.momSeen.push(o.i);if(s.momSeen.length>Math.min(24,MOMENTS.length-4))s.momSeen.shift();
  const p=pick(o.ps),pl=P(pick(PLACES));return{t:o.m.t(s,p,pl),fx:o.m.fx?()=>o.m.fx(s,p):null};
}

/* ---------- the year’s festivals, spent with whoever is still around ---------- */
const FEST=[
 {n:T('New Year','过年'),t:s=>{const f=living(s,['father','mother','spouse','child']);return f.length?T(`New Year’s Eve. Dumplings, firecrackers, and ${f.length>2?'a crowded table':'a small table'}. ${Cap(A_(s,pick(f))).en} stays up the whole night with you.`,`除夕。饺子，爆竹，${f.length>2?'一大桌人':'一小桌人'}。${A_(s,pick(f)).zh}陪你守了一整夜的岁。`):T('New Year’s Eve, alone. You buy a string of firecrackers anyway and light them for nobody.','一个人过的除夕。你还是买了一串爆竹，点给没人听。')}},
 {n:T('Lantern Festival','元宵'),t:s=>{const c=living(s,['child','spouse','lover']);return c.length?T(`The Lantern Festival. ${Cap(A_(s,pick(c))).en} wants a rabbit lantern and gets one.`,`元宵节。${A_(s,pick(c)).zh}要一盏兔子灯，你买了。`):T('The Lantern Festival. You guess three riddles on the lanterns and win a bag of sweets.','元宵节。你猜中了三个灯谜，赢了一包糖。')}},
 {n:T('Qingming','清明'),when:s=>s.people.some(p=>!p.alive&&!p.gone),t:s=>{const d=pick(s.people.filter(p=>!p.alive&&!p.gone));return T(`Qingming. You sweep the grave of ${d.n.py}, pull the weeds, and stay longer than you meant to.`,`清明。你去给${d.n.cn}扫墓，拔了坟头的草，待得比打算的久。`)}},
 {n:T('Dragon Boat Festival','端午'),t:s=>T('The Dragon Boat races. You shout yourself hoarse for a boat from the wrong village.','端午赛龙舟。你替别村的船喊哑了嗓子。')},
 {n:T('Qixi','七夕'),age:[14,40],t:s=>{const l=living(s,['lover','spouse']);return l.length?T(`Qixi. ${Cap(A_(s,l[0])).en} and you look for the Weaver Star and argue about which one it is.`,`七夕。你和${A_(s,l[0]).zh}找织女星，争了半天到底是哪一颗。`):T('Qixi. Couples everywhere. You eat noodles alone and pretend the evening is for noodles.','七夕。满街成双成对。你一个人吃了碗面，假装今晚就是为了吃面。')}},
 {n:T('Mid-Autumn','中秋'),t:s=>{const away=living(s,['father','mother','sibling']).filter(()=>s.age>=16);return away.length&&s.age>=16?T(`Mid-Autumn. The moon is enormous. Somewhere ${A_(s,pick(away)).en} is looking at the same one.`,`中秋。月亮大得出奇。${A_(s,pick(away)).zh}此刻大概也在看着同一个月亮。`):T('Mid-Autumn. Mooncakes too sweet to finish, and a moon too bright to sleep under.','中秋。月饼甜得吃不完，月亮亮得睡不着。')}},
 {n:T('Double Ninth','重阳'),age:[40,99],t:s=>T('The Double Ninth. You climb a hill with a sprig of dogwood, slower than last year, and look at how far you can see.','重阳登高。你插着茱萸爬上小山，比去年慢了些，看了看能望多远。')},
 {n:T('Winter Solstice','冬至'),t:s=>T('Winter Solstice: the longest night. Everyone eats dumplings so their ears will not freeze off.','冬至，一年里最长的夜。人人吃饺子，说是不吃会冻掉耳朵。')}
];
function festivalFor(s){const ok=FEST.filter(f=>(!f.age||(s.age>=f.age[0]&&s.age<=f.age[1]))&&(!f.when||f.when(s)));s.festSeen=s.festSeen||[];
  const fresh=ok.filter(f=>!s.festSeen.includes(FEST.indexOf(f)));const f=pick(fresh.length?fresh:ok);if(!f)return null;
  s.festSeen.push(FEST.indexOf(f));if(s.festSeen.length>5)s.festSeen.shift();return{t:f.t(s)}}

/* ---------- sect life by rank ---------- */
const SECT_DAY={
 0:[T('Outer disciples eat last. Tonight the rice runs out two places before you.','外门弟子最后吃饭。今晚饭到你前面两个人就没了。'),T('You carry water for the inner disciples’ bath and listen to them talk about techniques you are not allowed to learn yet.','你给内门弟子挑洗澡水，听他们谈论你还不准学的功夫。'),T('An inspection: your bedding folded wrong. Thirty laps of the training yard.','查房：被子叠得不对。罚跑练武场三十圈。'),T('You are trusted, for the first time, to ring the dawn bell. You are so nervous you ring it early.','头一回让你敲晨钟。你紧张得敲早了。')],
 1:[T('As an inner disciple you finally get a sword of your own from the armoury. It is old, nicked and yours.','升了内门，你终于从兵器房领到自己的剑。旧的，有缺口，可它是你的。'),T('You are asked to show the outer disciples a form. Half of them watch your feet, half watch your face. You blush.','让你给外门弟子示范一式。一半人看你的脚，一半人看你的脸。你脸红了。'),T('An elder you barely know remembers your name. You walk on air for a week.','一位你几乎不认识的长老叫出了你的名字。你飘飘然了一个星期。')],
 2:[T('As a personal disciple you take tea with the master each morning. Mostly you listen to the master complain about the elders.','做了亲传弟子，每天早上陪掌门喝茶。多半是听掌门数落各位长老。'),T('Juniors start bringing their quarrels to you to settle. You discover you are not always fair.','师弟师妹们开始找你评理。你发现自己并不总是公道。')],
 3:[T('As an elder you spend more days on ledgers than on the training ground. The sect’s rice bill is a martial art of its own.','做了长老，算账的日子比练功的日子多。门派的米钱，本身就是一门武功。'),T('Two disciples’ families are feuding and both have written to you. You answer both letters the same way.','两个弟子的家里结了仇，都写信给你。你两封信回得一字不差。')],
 4:[T('As sect master you cannot walk across the yard without three people needing a decision.','做了掌门，你穿过院子都会被三个人拦下来要你拿主意。'),T('You lie awake counting the sect’s enemies and the sect’s debts, and decide the debts are worse.','你睁着眼睛数门派的仇家和门派的债，觉得债更可怕。')]};
const SECT_DAY_EVIL=[T('A follower is flogged in the square for a word out of place. Everyone watches. Everyone is meant to.','一个教众说错一句话，在广场上挨鞭子。人人都在看。本来就是要人看的。'),T('You are given a new name in the faction, and are expected to forget the old one.','你在教中有了新名号，旧名字最好忘掉。'),T('The faction’s pay arrives on time, in full, with a smile you do not trust.','教中的饷银准时足额送到，还附带一个让你信不过的笑脸。')];
function sectDayFor(s){if(!s.sect||s.retired)return null;const pool=(isEvil(s.sect)?SECT_DAY_EVIL.concat(SECT_DAY[Math.min(1,s.rank)]):SECT_DAY[Math.min(4,s.rank)]||SECT_DAY[0]);
  s.sdSeen=s.sdSeen||[];const fresh=pool.filter(t=>!s.sdSeen.includes(t.en));const t=pick(fresh.length?fresh:pool);s.sdSeen.push(t.en);if(s.sdSeen.length>12)s.sdSeen.shift();
  const sn=SECTS[s.sect];return{t:T(t.en,t.zh)}}

/* ---------- small firsts: once in a life ---------- */
const FIRSTS=[
 {id:'tooth',age:[5,7],t:T('Your first tooth falls out in a bun. Your mother throws it onto the roof so the new one grows straight.','你的第一颗乳牙掉在了馒头里。母亲把它扔上屋顶，说这样新牙才长得直。')},
 {id:'swim',age:[7,13],t:T('You learn to swim the hard way: someone pushes you into the river and laughs, and then has to jump in after you.','你学会游泳全靠被人推下河。推你的人笑完了，又只好跳下来捞你。')},
 {id:'voice',age:[13,15],gender:'m',t:T('Your voice cracks in the middle of reciting a lesson. The whole room hears it.','背书背到一半，你的嗓子破了音。满屋子人都听见了。')},
 {id:'hairpin',age:[14,16],gender:'f',t:T('The hairpin ceremony: someone pins up your hair and tells you that you are a woman now. You do not feel any different.','及笄之礼：有人替你挽起头发，说从今往后你是大姑娘了。你没觉得有什么不一样。')},
 {id:'drunk',age:[14,22],t:T('You get drunk for the first time and tell everyone how much you love them. Nobody lets you forget it.','你头一回喝醉，挨个告诉别人你有多喜欢他们。从此再没人让你忘了这事。')},
 {id:'funeral',age:[8,30],t:T('Your first funeral: an old neighbour. The paper money burns very fast and the crying goes on very long.','你头一回去吊丧：隔壁的老人家。纸钱烧得很快，哭声却很长。')},
 {id:'ride',age:[12,30],t:T('You ride a horse for the first time, and the horse decides where you are going.','你头一回骑马。去哪儿是马说了算。')},
 {id:'grey',age:[35,50],t:T('In a basin of water, the first grey hair. You look at it for a long time.','对着一盆水，你看见了第一根白发。你看了很久。')},
 {id:'glasses',age:[45,60],t:T('Small writing has become a blur. You hold the book at arm’s length like your father used to.','小字看不清了。你把书伸直了手臂拿远看，跟当年父亲一模一样。')},
 {id:'stairs',age:[60,75],t:T('You stop to rest halfway up the mountain steps, and a child runs past you. You remember being that child.','山阶爬到一半，你停下来歇脚，一个孩子从你身边跑了过去。你记得自己也曾是那个孩子。')},
 {id:'cane',age:[70,90],t:T('Someone gives you a walking stick. You are insulted for a month and then use it every day.','有人送你一根拐杖。你生了一个月的气，后来天天拄着。')}
];
FIRSTS.forEach(f=>TEXTURE.push({age:f.age,w:3,when:s=>!(s.firsts||[]).includes(f.id)&&(!f.gender||s.gender===f.gender),t:s=>{(s.firsts=s.firsts||[]).push(f.id);return f.t}}));

/* ---------- a year with nothing remarkable is still somebody’s year ---------- */
const _quietYear=quietYear;
quietYear=function(s){
  const r=R();let m=null;
  if(s.age>=3&&r<.55)m=momentFor(s);
  else if(s.age>=4&&r<.75)m=festivalFor(s);
  else if(r<.9)m=sectDayFor(s);
  if(m&&m.t&&m.t.en){say(s,m.t.en,m.t.zh,'muted');if(m.fx)m.fx();return}
  _quietYear(s)};
/* and the ordinary moments between events lean on real people too */
TEXTURE.push({rep:1,age:[4,99],w:4,when:s=>s.people.some(p=>p.alive&&!p.temp),t:s=>{const m=momentFor(s);if(!m)return null;if(m.fx)m.fx();return m.t}});
TEXTURE.push({rep:1,age:[4,99],w:2,t:s=>{const m=festivalFor(s);return m?m.t:null}});
TEXTURE.push({rep:1,age:[8,99],w:2,when:s=>!!s.sect&&!s.retired,t:s=>{const m=sectDayFor(s);return m?m.t:null}});
/* repeatable entries draw fresh content each time, so they are never marked as seen */
texture=function(s){
  const pool=TEXTURE.filter(x=>(!x.age||(s.age>=x.age[0]&&s.age<=x.age[1]))&&(!x.when||x.when(s)));if(!pool.length)return;
  s.texSeen=s.texSeen||[];const fresh=pool.filter(x=>x.rep||!s.texSeen.includes(TEXTURE.indexOf(x)));const x=wpick(fresh.length?fresh:pool,x=>x.w??1);if(!x)return;
  if(!x.rep){s.texSeen.push(TEXTURE.indexOf(x));if(s.texSeen.length>80)s.texSeen.shift()}const t=x.t(s);if(t&&t.en)say(s,t.en,t.zh,'muted')};

/* ---------- training, sitting, resting and reading, assembled from parts so no two days read the same ---------- */
const P2=a=>T(a[0],a[1]);
const OPEN=[['At first light','天刚亮'],['Before dawn','天还没亮'],['In a fine drizzle','细雨里'],['Under a hard noon sun','正午的毒日头下'],['On a windy afternoon','起风的下午'],['As the sun goes down','太阳落山时'],['By lantern light','提着一盏灯'],['On a muggy evening','闷热的傍晚'],['After a long day of chores','忙完一天的活计'],['Long after everyone else is asleep','等别人都睡下了'],['Still feeling last night’s wine','带着昨夜的酒意'],['In thick morning fog','晨雾浓得化不开'],['On the first warm day of spring','开春头一个暖和天'],['In a cold autumn wind','秋风正凉'],['With snow coming down','下着雪'],['On a holiday when nobody else trains','过节没人练功的日子']];
const SPOT_SECT=[['in the training yard','练武场上'],['on the back hill','后山上'],['in front of the empty main hall','空荡荡的大殿前'],['on the stone steps below the gate','山门下的石阶上']];
const SPOT=[['in the courtyard','院子里'],['on the riverbank','河滩上'],['in a pine wood','松林里'],['on the threshing floor','打谷场上'],['in a ruined temple yard','破庙院里'],['on the roof','屋顶上'],['in a bamboo grove','竹林里'],['in a dry creek bed','干河床上']];
const DRILL={any:[['hold the horse stance and count to a thousand','扎着马步数到一千'],['take one move apart and put it back together a hundred times','把一招拆开又拼上，来回一百遍'],['walk the Eight Trigrams footwork','按八卦方位走步法'],['strike a post wrapped in rope until the rope frays','对着缠草绳的木桩出手，打到草绳起毛'],['practise falling until it stops hurting','一遍遍练摔，摔到不疼'],['run the whole sequence with your eyes shut','闭着眼把整套走一遍'],['fight an imaginary opponent who is better than you','跟一个比你强的假想敌拆招'],['carry two buckets of stones up and down a slope','挑两桶石头上坡下坡'],['repeat the opening move until it is the only thing in the world','把起手式练到天地间只剩这一式']],
 Sword:[['cut falling leaves without touching the branch','削落叶而不碰枝'],['thrust at a candle flame until it bends without going out','对着烛火刺剑，刺到火苗只弯不灭']],
 Saber:[['chop through bundles of bamboo','劈一捆捆竹子'],['practise the draw until the saber is out before you think it','练拔刀，练到念头没起刀已出鞘']],
 Palm:[['push at a water butt until the surface ripples without a drop spilling','对着水缸推掌，推到水面起纹一滴不溅'],['strike a sandbag of iron filings','打装满铁砂的沙袋']],
 Fist:[['hit a sandbag of iron filings','打装满铁砂的沙袋'],['punch the air until your shoulders burn','空击到肩膀火辣辣地疼']],
 Needle:[['throw needles at a row of beans','对着一排豆子掷针'],['catch flies with chopsticks','用筷子夹苍蝇']]};
const CODA=[['Your knuckles split; you wrap them and keep going.','指节裂了，裹上布接着练。'],['Something clicks on the last attempt. You do not dare stop in case it unclicks.','最后一遍忽然通了。你不敢停，怕它又不通。'],['Nothing clicks. Some days are like that.','什么也没练通。有些日子就是这样。'],['A dog watches the whole time and seems unimpressed.','一条狗从头看到尾，似乎不以为然。'],['Afterwards you eat three bowls of rice.','练完你吃了三大碗饭。'],['Your legs shake all the way home.','回去的路上，两腿直打颤。'],['That night you sleep like a stone.','那晚你睡得像块石头。'],['Children gather to watch, then get bored.','几个孩子围过来看，看一会儿就腻了。'],['A blister bursts. You are oddly proud of it.','磨破了一个水泡，你竟有点得意。'],['You go over your mistakes all through supper.','吃晚饭时你还在琢磨哪里错了。'],['By the end your breathing is slow and even.','练到最后，呼吸又慢又匀。'],['Your shadow looks better at it than you do.','你的影子练得比你还像样。']];
const WITH=[[['master'],(a)=>[`${a.en} watches for a while, says "elbow", and leaves.`,`${a.zh}看了一会儿，说了句"手肘"，走了。`]],[['fellow'],(a)=>[`${a.en} joins you halfway and you push each other further than either would go alone.`,`${a.zh}半路加进来，两人互相较劲，都比一个人时练得狠。`]],[['disciple'],(a)=>[`${a.en} copies every move a beat behind you, like an echo.`,`${a.zh}跟在你后面一招一式地学，像个慢半拍的回声。`]],[['child'],(a)=>[`${a.en} sits on the wall and counts your mistakes out loud.`,`${a.zh}坐在墙头上，大声数你出了几回错。`]],[['spouse','lover'],(a)=>[`${a.en} brings you water and pretends not to be watching.`,`${a.zh}给你送水来，假装没在看。`]]];
function withLine(s,ch){if(!chance(ch))return null;const opts=WITH.map(([r,f])=>{const ps=living(s,r).filter(p=>!p.temp);return ps.length?f(Cap(A_(s,pick(ps)))):null}).filter(Boolean);return opts.length?pick(opts):null}
/* children do not wake up with a hangover */
const pk=(s,a)=>{const k=s.age<16?a.filter(x=>!/酒|wine|drunk|tavern|inn|客栈|赌|brothel|青楼/i.test(JSON.stringify(x))):a;return pick(k.length?k:a)};
const GEN={
 practice:s=>{const o=P2(pk(s,OPEN)),sp=P2(pk(s,s.sect&&!s.retired&&chance(.6)?SPOT_SECT:SPOT));const k=s.sect&&SECTS[s.sect]?SECTS[s.sect].wpn.en:'';const d=P2(pk(s,DRILL.any.concat(chance(.5)&&DRILL[k]?DRILL[k]:[]))),c=P2(pk(s,CODA));const w=withLine(s,.25);
   return T(`${o.en} you ${d.en} ${sp.en}. ${w?w[0]:c.en}`,`${o.zh}，你在${sp.zh}${d.zh}。${w?w[1]:c.zh}`)},
 meditate:s=>{const o=P2(pk(s,OPEN));const sp=P2(pk(s,[['on a flat rock by the stream','在溪边一块平石上'],['in your room with the shutters closed','关起窗在屋里'],['under the eaves','在屋檐下'],['facing a bare wall','面对一堵白墙'],['on a worn mat in the hall','在殿里磨旧的蒲团上'],['at the edge of a cliff','在崖边'],['beside a sleeping household','在一屋子的鼾声里']]));
   const e=P2(pk(s,[['your qi moves like warm water along your spine','真气像温水一样沿着脊背走'],['your mind keeps running to an old quarrel and you keep bringing it back','心思老往一桩旧事上跑，你一次次把它拉回来'],['you count your breaths and lose count at ninety','数着呼吸，数到九十就乱了'],['your legs go numb long before your mind goes quiet','心还没静，腿先麻了'],['you hear every sound in the house one by one, and then none','屋里的声音一样样听见，又一样样听不见了'],['a mosquito tests your concentration and wins','一只蚊子考验你的定力，它赢了'],['the qi sticks at the same point in your chest as always','真气照旧卡在胸口那一处'],['for a moment the qi slips past the old blockage','有那么一瞬，真气滑过了那处旧阻滞']]));
   const c=P2(pk(s,[['Afterwards everything looks very sharp.','坐完之后，看什么都格外清楚。'],['Standing up is the hardest part.','最难的是坐完站起来。'],['You are calmer at supper than anyone can remember.','晚饭时你平静得叫人吃惊。'],['When you open your eyes it is dark.','睁眼时天已经黑了。'],['Your stomach growls and that is the end of it.','肚子一叫，就再也坐不下去了。'],['You feel lighter, or think you do.','你觉得身子轻了些，或者只是觉得。']]));
   return T(`${o.en} you sit ${sp.en}, and ${e.en}. ${c.en}`,`${o.zh}，你${sp.zh}盘膝而坐，${e.zh}。${c.zh}`)},
 rest:s=>{const acts=[['sleep until noon','一觉睡到晌午'],['soak in hot water with ginger and salt','泡在姜盐热水里'],['lie in the yard watching clouds','躺在院子里看云'],['fish without caring whether anything bites','钓鱼，咬不咬钩都无所谓'],['play terrible chess with a neighbour','跟邻居下臭棋'],['eat a whole steamed fish','吃了一整条清蒸鱼'],['listen to the rain on the roof','听雨打屋檐'],['mend your clothes and your sandals','补衣裳，补草鞋'],['take long walks to nowhere','漫无目的地走很远'],['nap in the shade of a willow','在柳荫下打盹']];
   const a=P2(pk(s,acts));let b=P2(pk(s,acts));if(b.en===a.en)b=P2(acts[0]===a?acts[1]:acts[0]);
   const w=withLine(s,.3),c=P2(pk(s,[['Your bruises fade.','身上的瘀青消了。'],['The old ache in your back eases.','腰上的老毛病松快了些。'],['You had forgotten how long a day can be.','你都忘了一天可以有这么长。'],['By the end you are itching to train again.','到月底，你手又痒了。'],['Nobody needs anything from you, which is the best medicine.','没人找你办事，这就是最好的药。']]));
   return T(`For a month you ${a.en} and ${b.en}. ${w?w[0]:c.en}`,`这个月你${a.zh}，又${b.zh}。${w?w[1]:c.zh}`)},
 read:s=>{const o=P2(pk(s,OPEN));const b=P2(pk(s,[['a book of old poems','一本旧诗集'],['a military treatise','一部兵书'],['an illustrated herbal','一本草药图谱'],['a county gazetteer','一部县志'],['a collection of ghost stories','一本志怪小说'],['the Analects','《论语》'],['a merchant’s arithmetic primer','一本商家算学'],['a travel diary someone left at an inn','客栈里捡来的游记'],['a history of the last dynasty','一部前朝史书'],['a book of Go openings','一本围棋定式谱'],['a medical classic with half its pages missing','一部缺了一半的医书']]));
   const r=P2(pk(s,[['and underline half of it','划了一半的句子'],['and argue with it in the margins','在页边跟作者吵架'],['and fall asleep on page nine','读到第九页就睡着了'],['and copy out the best passages','把好句子抄了下来'],['twice, because the first time made no sense','读了两遍，头一遍没读懂'],['and read the good parts aloud to anyone who will listen','把好段落念给愿意听的人听']]));
   return T(`${o.en} you read ${b.en}, ${r.en}.`,`${o.zh}，你读${b.zh}，${r.zh}。`)}};
const _flv=flv;
flv=function(s,key,en,zh,cls){if(GEN[key]&&chance(.8)){const t=GEN[key](s);if(t&&t.en){say(s,t.en,t.zh,cls);return}}_flv(s,key,en,zh,cls)};

/* ---------- the teahouse talks about the actual world ---------- */
(()=>{const A=ACT_BY.teahouse;if(!A)return;
 const sk=()=>pick(Object.keys(SECTS).filter(k=>!SECTS[k].hidden));
 const TALK=[
  s=>{const k=sk();return T(`The storyteller does the founding of ${SECTS[k].en}, with three battles nobody else has heard of.`,`说书人讲${SECTS[k].cn}开山立派的故事，平白多出三场谁也没听过的大战。`)},
  s=>{const k=sk();return T(`Rumour: the master of ${SECTS[k].en} is ill, and the elders are already counting votes.`,`有传言说，${SECTS[k].cn}掌门病了，长老们已经在暗中拉票。`)},
  s=>{const a=sk(),b=sk();return a===b?null:T(`Two men at the next table nearly come to blows over whether ${SECTS[a].en} or ${SECTS[b].en} has the better sword.`,`邻桌两人为了${SECTS[a].cn}和${SECTS[b].cn}谁的剑法高，差点动起手来。`)},
  s=>{const k=pick(Object.keys(SECTS).filter(k=>SECTS[k].evil));return T(`Everyone lowers their voice to talk about ${SECTS[k].en}. Someone’s cousin’s neighbour has vanished.`,`说起${SECTS[k].cn}，满座都压低了嗓子。谁家表亲的邻居又失踪了。`)},
  s=>T(`The price of rice, the price of salt, the magistrate’s new concubine. The teahouse covers the essentials.`,`米价、盐价、县太爷新纳的小妾。茶馆里该聊的都聊到了。`),
  s=>T(`A blind storyteller does the voices of a whole battle with one wooden clapper. You forget your tea.`,`一个瞎眼说书人，凭一块醒木把一整场大战说得千军万马。你忘了喝茶。`),
  s=>{const p=pick(s.people.filter(p=>p.alive&&!p.temp&&p.rel!=='father'&&p.rel!=='mother'));return p?T(`Somebody mentions ${p.n.py}. You keep your face still and listen to what they say.`,`有人提起了${p.n.cn}。你不动声色，听他们怎么说。`):null},
  s=>s.fame>=25?T('The storyteller tells a tale about you. It is mostly wrong, and you come off better than you deserve.','说书人讲了一段你的故事。大半是瞎编的，把你说得比你本人强。'):null,
  s=>s.fame>=60?T('Someone recognises you and the whole room goes quiet. You pay for your tea and leave.','有人认出了你，满屋子一下安静了。你付了茶钱就走。'):null,
  s=>{const w=s.world;return w&&w.h<=-1?T('All the talk is of the harvest, and none of it is good.','满座都在说收成，没一句好话。'):w&&w.u>=2?T('Bandits on the north road again. A merchant shows the scar to prove it.','北边的道上又闹土匪了。一个商人撩起衣服给人看伤疤。'):null}];
 A._talk=s=>{for(let k=0;k<8;k++){const x=TALK[Math.floor(R()*TALK.length)](s);if(x)return x}return TALK[5](s)};
 A.run=function(s){happy(s,5);s.thSeen=s.thSeen||[];let t=null;for(let k=0;k<6&&!t;k++){const i=Math.floor(R()*TALK.length);if(s.thSeen.includes(i)&&k<5)continue;t=TALK[i](s);if(t){s.thSeen.push(i);if(s.thSeen.length>5)s.thSeen.shift()}}
  if(!t)t=TALK[5](s);say(s,t.en,t.zh);if(chance(.3)){const i=pickIncident(s,'town');if(i)runIncident(s,i)}};
})();
