/* 江湖一生 · the sects of the jianghu, the dark factions, sect life and merit, founding your own sect or escort agency, more jobs */
'use strict';

/* ---------- more sects ---------- */
Object.assign(SECTS,{
 quanzhen:{cn:'玄真观',en:'the Xuanzhen Abbey',align:2,wpn:T('Sword','剑'),arts:[['Xuanzhen Sword','玄真剑法','lianhuan'],['Cloud-Riding Step','凌云步','lingbo'],['Innate Qi','先天罡气','jinzhong']],blurb:T('Daoists of Mount Zhongnan, famous for the Dipper Sword Array.','终南山道家正宗，北斗剑阵天下闻名。')},
 gumu:{cn:'幽兰谷',en:'Hidden Orchid Valley',align:1,wpn:T('Sword','剑'),easy:-.1,arts:[['Twin Hearts Sword','双心剑法','kuaijian'],['Heaven-and-Earth Net','拦雀手','lingbo'],['Orchid Heart Sutra','幽兰心经','heal']],blurb:T('A sect that lives inside a tomb, keeps orchid bees, and takes almost no one.','住在幽兰谷里，养幽兰蜂，几乎不收弟子。')},
 mingjiao:{cn:'圣火教',en:'the Sacred Flame Cult',align:0,wpn:T('Token','令'),arts:[['Sky-Burning Palm','焚天掌','kuangbao'],['Cold Ice Palm','寒冰掌','neishang'],['Great Shifting Hand','大挪移手','fanzhen']],blurb:T('Fire-worshippers from Persia. Called a demon cult, often the poor’s last defenders.','源自波斯的拜火之教。被正道斥为魔教，却常是穷苦人最后的依靠。')},
 yihua:{cn:'花影宫',en:'the Flower Shadow Palace',align:0,wpn:T('Palm','掌'),easy:-.1,female:1,arts:[['Falling Flower Palm','落花掌','lianhuan'],['Ice Jade Skill','冰肌玉骨功','jianqi'],['Borrowed Force Hand','借力回春手','fanzhen']],blurb:T('A palace of beautiful, merciless women. Men are rarely let in, and rarely let out.','宫中尽是绝色而无情的女子。男子难进，进了更难出。')},
 xiaoyao:{cn:'云外宗',en:'the Beyond-the-Clouds Sect',align:0,hidden:1,wpn:T('Palm','掌'),arts:[['Six Yang Palm','六阳掌','dianxue'],['Formless Heart Art','无相心法','fanzhen'],['Sea-Swallowing Art','吞海神功','xixing']],blurb:T('A hidden sect. It finds you; you do not find it.','隐世门派。只有它找你，没有你找它。')},
 xingxiu:{cn:'七煞门',en:'the Seven Fiends Sect',align:-3,evil:1,wpn:T('Poison','毒'),easy:.2,arts:[['Bone-Eating Palm','蚀骨掌','neishang'],['Corpse Poison','尸毒','poison'],['Essence-Melting Art','化元功','xixing']],blurb:T('Disciples sing their master’s praises all day and poison everyone else.','弟子们整天高唱师父圣明，对外人只会下毒。')},
 xuedao:{cn:'赤刃门',en:'the Red Blade Sect',align:-4,evil:1,wpn:T('Saber','刀'),easy:.15,arts:[['Red Blade Style','赤刃刀法','kuangbao'],['Red Shadow Step','赤影步','lingbo'],['Red Sea Canon','赤海心经','huiguang']],blurb:T('Monks of the snowy plateau who kill for the pleasure of it.','雪域番僧，以杀人为乐。')},
 erengu:{cn:'不归谷',en:'the Valley of No Return',align:-4,evil:1,wpn:T('Saber','刀'),easy:.3,arts:[['Throat-Cutting Saber','断喉刀','pojia'],['Smiling Dagger','笑里藏刀','anqi'],['Cocoon-Breaking Art','破茧功','jianqi']],blurb:T('Where the worst people under heaven hide. The Ten Fiends of the valley rule it.','天下恶人的藏身之所，谷中十凶坐镇。')},
 qinglong:{cn:'夜枭会',en:'the Night Owl Society',align:-3,evil:1,wpn:T('Hook','钩'),arts:[['Owl Claw','枭爪','longzhang'],['Night Owl Hook','夜枭钩','kuaijian'],['Hidden Scale Art','隐鳞心法','neishang']],blurb:T('365 branches, one for every day of the year. Nobody has seen its head.','一年三百六十五天，夜枭会便有三百六十五处分坛。无人见过它的首领。')},
 jinqian:{cn:'通宝帮',en:'the Coin Gang',align:-3,evil:1,wpn:T('Rings','环'),arts:[['Golden Coin Darts','金钱镖','anqi'],['Mother-and-Child Rings','子母双环','lianhuan'],['Coin Heart Art','通宝心法','jinzhong']],blurb:T('Money is its only law. It owns half the jianghu and wants the rest.','以钱为法。半个江湖都是它的，它还想要另一半。')},
 haisha:{cn:'黑潮帮',en:'the Black Tide Gang',align:-2,evil:1,wpn:T('Saber','刀'),easy:.3,arts:[['Salt Smuggler’s Saber','盐枭刀法','kuangbao'],['Black Tide Poison','黑潮毒','poison'],['Wave-Treading Step','踏浪步','lingbo']],blurb:T('Salt smugglers and pirates of the eastern coast.','东海沿岸的私盐贩子和海盗。')}
});
SECTS.wudu.evil=1;SECTS.sunmoon.evil=1;
/* what each region has beyond the three sects that recruit children at ten */
const MORE_SECTS={central:['quanzhen','gumu'],jiangnan:['yihua'],shu:[],north:['mingjiao'],west:['mingjiao'],miao:[],east:[],capital:['quanzhen']};
const EVIL_SECTS={central:['jinqian'],jiangnan:['qinglong','haisha'],shu:['erengu'],north:['xuedao','sunmoon'],west:['xingxiu','xuedao'],miao:['erengu','wudu'],east:['haisha'],capital:['jinqian','qinglong']};
/* ---------- one jianghu, one era: the rest of the sects under heaven ---------- */
Object.assign(SECTS,{
 songshan:{cn:'嵩山派',en:'Mount Song',align:1,wpn:T('Sword','剑'),arts:[['Mount Song Sword','嵩山剑法','pojia'],['Junji Palm','峻极掌','neishang'],['Cold Frost Palm','寒霜掌','jinzhong']],blurb:T('The strongest of the Five Peaks Sword League, and the most ambitious.','五峰剑盟中最强的一派，也是野心最大的一派。')},
 taishan:{cn:'泰山派',en:'Mount Tai',align:2,wpn:T('Sword','剑'),arts:[['Mount Tai Sword','泰山剑法','jinzhong'],['Eighteen Pines Palm','十八盘掌','pojia'],['Rising Sun Breath','日观心法','heal']],blurb:T('Old, proud and quarrelsome. Its elders argue more than they train.','门派古老，自视甚高，长老们吵架比练剑还勤。')},
 hengs:{cn:'衡山派',en:'Mount Heng (South)',align:2,wpn:T('Sword','剑'),arts:[['Hengshan Sword','衡山剑法','kuaijian'],['Hundred Changes Sword','百变剑法','yiyu'],['Cloud-and-Mist Sword','云雾剑','lianhuan']],blurb:T('Swordsmen of the southern peak. Their swords are as tricky as their music is sad.','南岳剑客。剑法诡谲，琴声凄凉。')},
 hengn:{cn:'恒山派',en:'Mount Heng (North)',align:3,wpn:T('Sword','剑'),mostlyFemale:1,arts:[['Hengshan Sword Net','恒山剑阵','yiyu'],['Compassion Palm','慈悲掌','heal'],['Still Water Heart','止水心法','fanzhen']],blurb:T('A northern sect of nuns and lay sisters. Gentle, until you threaten someone weaker.','北岳多为女尼与俗家女弟子。为人和善，除非你欺负弱小。')},
 kongtong:{cn:'崆峒派',en:'Kongtong',align:1,wpn:T('Fist','拳'),arts:[['Kongtong Fist','崆峒拳','kuangbao'],['Five Elements Fist','五行拳','lianhuan'],['Iron Bone Art','铁骨功','jinzhong']],blurb:T('Hard fists from the dry northwest. They train in sandstorms on purpose.','西北硬派拳法，故意在沙暴里练功。')},
 qingcheng:{cn:'青城派',en:'Mount Qingcheng',align:1,wpn:T('Sword','剑'),arts:[['Qingcheng Sword','青城剑法','kuaijian'],['Pine Wind Palm','松风掌','pojia'],['Green Mist Breath','青霞心法','heal']],blurb:T('A rich Daoist sect of Shu that collects friends, favours and grudges.','蜀中富庶的道家门派，交朋友、讨人情、记仇，样样都在行。')},
 tiequan:{cn:'铁拳帮',en:'the Iron Fist Gang',align:-1,evil:1,wpn:T('Fist','拳'),easy:.35,arts:[['Iron Fist','铁拳','pojia'],['Sand Palm','铁砂掌','kuangbao'],['Brass Skin','铜皮功','jinzhong']],blurb:T('A river-town gang that pays the magistrate and owns the docks.','河镇上的帮会，孝敬县太爷，霸着码头。')},
 lingshi:{cn:'烟雨楼凌氏',en:'the Ling Clan of Misty Rain Tower',align:0,wpn:T('Sword','剑'),easy:-.15,arts:[['Misty Rain Sword','烟雨剑法','yiyu'],['Turnabout Palm','回手掌','fanzhen'],['Ling Family Heart Art','凌家心法','jianqi']],blurb:T('An old Jiangnan clan with a library of every sect’s arts and a dream of lost glory.','江南旧世家，藏尽天下武学，梦想重振祖上荣光。')},
 qinglian:{cn:'青莲会',en:'the Blue Lotus Society',align:3,wpn:T('Saber','刀'),easy:.2,arts:[['Lotus Saber','青莲刀','lianhuan'],['Meteor Hammer','流星锤','anqi'],['Lotus Heart Art','莲心诀','heal']],blurb:T('A secret brotherhood that helps the poor and hates corrupt officials.','劫富济贫、痛恨贪官的秘密会社。')},
 feiying:{cn:'飞鹰帮',en:'the Flying Hawk Gang',align:-2,evil:1,wpn:T('Claw','爪'),easy:.3,arts:[['Hawk Claw','飞鹰爪','pojia'],['Rooftop Step','飞檐步','lingbo'],['Hawk Eye Darts','鹰眼镖','anqi']],blurb:T('Waterway bandits of the lakes. They take tolls from every boat that passes.','湖上水寇，过往船只都得交买路钱。')},
 jianlu:{cn:'剑庐',en:'the Sword Forge',align:1,wpn:T('Sword','剑'),arts:[['Forge Sword','铸剑式','pojia'],['Fire and Water Sword','水火剑','jianqi'],['Tempering Breath','淬锋心法','jinzhong']],blurb:T('Swordsmiths first, swordsmen second. Every disciple forges their own blade.','先铸剑，后学剑。每个弟子都得亲手打一柄自己的剑。')},
 wangyou:{cn:'忘忧谷',en:'the Valley of Forgetting',align:0,wpn:T('Sword','剑'),easy:-.05,arts:[['Sorrowless Sword','忘忧剑','kuaijian'],['Forgetting Flower Poison','忘忧花毒','poison'],['Heartless Art','绝念心法','shehun']],blurb:T('A beautiful valley whose people swear off love. Its flowers poison those who break the vow.','谷中风景如画，人人立誓断情。破誓的人，会被谷里的花毒死。')},
 leihuo:{cn:'雷火堂',en:'the Thunder Fire Hall',align:0,wpn:T('Powder','火'),arts:[['Thunder Pellets','霹雳弹','anqi'],['Fire Dragon Palm','火龙掌','kuangbao'],['Smoke Step','烟遁步','lingbo']],blurb:T('A family of gunpowder makers. Everyone respects them; nobody sits near them.','世代制火药。人人敬他们三分，没人愿意挨着他们坐。')},
 lingyu:{cn:'翎羽山庄',en:'Feather Manor',align:1,wpn:T('Bow','弓'),arts:[['Feather Arrow','翎羽箭','anqi'],['Northern Spear','塞北枪法','pojia'],['Horseback Breath','马背心法','jinzhong']],blurb:T('Frontier archers who guard the passes when the army will not.','塞北的弓手山庄。官军不守的关隘，他们守。')},
 tianchi:{cn:'天池宫',en:'the Heavenly Pool Palace',align:0,wpn:T('Palm','掌'),female:1,easy:-.1,arts:[['Winter Plum Hand','寒梅手','dianxue'],['Frost Talisman','寒冰符','neishang'],['Ice Heart Formula','冰心诀','xixing']],blurb:T('A palace of women on a glacier lake. Its servants obey because of the frost in their veins.','冰湖之上，一座只收女子的宫殿。属下听话，是因为血里种着寒冰符。')},
 tuoling:{cn:'驼铃山庄',en:'Camel Bell Manor',align:-2,evil:1,wpn:T('Staff','杖'),arts:[['Snake Staff','蛇杖','poison'],['Desert Wind Palm','大漠风掌','neishang'],['Crouching Toad Breath','伏蟾气','longzhang']],blurb:T('A desert clan of snake-keepers and poisoners. Their caravans never get robbed.','大漠里养蛇用毒的世家。他们的商队从来没人敢劫。')},
 xueshan:{cn:'雪山寺',en:'the Snow Mountain Monastery',align:0,male:1,wpn:T('Wheel','轮'),arts:[['Bronze Wheel','铜轮','pojia'],['Blazing Palm','烈焰掌','jianqi'],['Elephant-Taming Art','伏象功','longzhang']],blurb:T('Plateau monks with bronze wheels and slow, crushing strength.','雪域高原的番僧，用铜轮，力大无穷而又慢条斯理。')},
 cangshan:{cn:'苍山蒙氏',en:'the Meng Clan of Cangshan',align:2,wpn:T('Finger','指'),easy:-.1,arts:[['Cangshan Sword','苍山剑法','lianhuan'],['Pure Yang Finger','纯阳指','dianxue'],['Erhai Breath','洱海心法','heal']],blurb:T('A royal clan of the southwest. Half its masters end up as monks.','西南的王族世家，一半高手最后都出了家。')},
 baicao:{cn:'百草谷',en:'the Hundred Herbs Valley',align:2,wpn:T('Needle','针'),easy:.1,arts:[['Acupuncture Needles','金针术','dianxue'],['Hundred Herbs Lore','百草经','heal'],['Antidote Palm','解毒掌','poison']],blurb:T('Doctors who will cure anyone, for a price that is never money.','什么人都肯救的大夫，要的报酬却从来不是银子。')},
 haijiao:{cn:'海蛟教',en:'the Sea Serpent Cult',align:-3,evil:1,wpn:T('Dagger','匕'),easy:.25,arts:[['Serpent Dagger','蛟刺','kuaijian'],['Tide Palm','怒潮掌','neishang'],['Serpent Pill Art','蛟丹术','poison']],blurb:T('An island cult. Its followers swallow the leader’s pills and shout his praises every dawn.','孤岛上的邪教。教众吞着教主的药丸，天天一早高呼教主圣明。')}
});
SECTS.xuedao.male=1;
Object.assign(SECTS.gumu,{blurb:T('Women who live in a hidden valley, keep orchid bees, and vow never to leave.','隐居山谷的女子们，养幽兰蜂，立誓终身不出谷。')});
/* who recruits children in each region, and who only takes adults */
const SECT_MAP={
 central:{sects:['shaolin','wudang','huashan','songshan','beggar'],more:['quanzhen','gumu'],evil:['tiequan']},
 jiangnan:{sects:['hengs','jianlu','beggar'],more:['yihua','qinglian','lingshi'],evil:['feiying','qinglong']},
 shu:{sects:['emei','qingcheng','tang'],more:['wangyou','leihuo'],evil:['qinglong']},
 north:{sects:['hengn','lingyu','shaolin'],more:['mingjiao'],evil:['sunmoon']},
 west:{sects:['kunlun','kongtong','tianshan'],more:['tianchi','mingjiao','xueshan'],evil:['xingxiu','xuedao','tuoling']},
 miao:{sects:['cangshan','baicao','emei'],more:[],evil:['wudu','erengu']},
 east:{sects:['taishan','peach','beggar'],more:[],evil:['haisha','haijiao']},
 capital:{sects:['shaolin','wudang','beggar'],more:['quanzhen'],evil:['jinqian','qinglong']}};
REGIONS.forEach(r=>{const m=SECT_MAP[r.id];if(!m)return;r.sects=m.sects;MORE_SECTS[r.id]=m.more;EVIL_SECTS[r.id]=m.evil});
/* the Five Peaks Sword League */
const FIVE_PEAKS=['huashan','songshan','taishan','hengs','hengn'];
const isEvil=id=>!!(id&&SECTS[id]&&SECTS[id].evil);
const RANKS_EVIL=[T('follower','教众'),T('incense master','香主'),T('hall master','堂主'),T('guardian','护法'),T('lord','教主')];
function rankName(s,i){i=i??s.rank;return(isEvil(s.sect)?RANKS_EVIL:RANKS)[i]}

/* ---------- merit (门派贡献): earned by chores and missions, needed to rise ---------- */
const MERIT_NEED=[10,30,60];
const _applyFx=applyFx;
applyFx=function(s,e,c){_applyFx(s,e,c);if(e&&e.merit!=null&&s.sect){const v=Array.isArray(e.merit)?rint(e.merit[0],e.merit[1]):e.merit;s.merit=Math.max(0,(s.merit||0)+v)}};
const _joinSect=joinSect;
joinSect=function(s,id){_joinSect(s,id);s.merit=0};
const _leaveSect=leaveSect;
leaveSect=function(s){const was=s.sect;_leaveSect(s);s.merit=0;if(isEvil(was))s.flags.deserter=s.age};
QHINT.deserter={t:T('Your old faction does not forgive deserters.','你背弃的那个邪派，从不放过叛徒。'),done:'deserter_hunt'};

/* ---------- small helpers for adding to the menus ---------- */
function addAct(a){ACTS.push(a);ACT_BY[a.id]=a}
function addOpp(o){OPPS.push(o);addAct(Object.assign({cat:'opp',if0:o.if},o,{if:s=>(s.opps||[]).includes(o.id),run:(fn=>s=>{s.opps=(s.opps||[]).filter(x=>x!==o.id);fn(s)})(o.run)}))}
ACT_CATS.splice(ACT_CATS.findIndex(c=>c[0]==='sect')+1,0,['org',T('Your own house','自家门户')]);

/* ---------- joining: the righteous sects nearby, and the dark ones ---------- */
(()=>{const J=ACT_BY.joinsect;const run0=J.choose;
 J.run=s=>ask(s,'joinsect',{},region(s).sects.concat(MORE_SECTS[s.region]||[]).filter((x,i,a)=>a.indexOf(x)===i&&!isEvil(x)).map(id=>({k:id,l:T(SE(id),SZ(id)),sub:SECTS[id].blurb})).concat([{k:'leave',l:T('Not now','改日再说')}]));
 J.choose=(s,k,c)=>{if(k!=='leave'&&SECTS[k].female&&s.gender==='m'&&!chance(.05)){say(s,'The palace maids look you up and down, and close the gate.','宫女们把你上下打量一番，关上了宫门。','bad');return}run0(s,k,c)};
})();
addAct({id:'joinevil',ap:2,cat:'crime',n:T('Join a dark faction','投靠邪派'),d:T('The righteous sects will call you a demon. The pay is better.','名门正派会骂你是魔头。不过待遇好得多。'),
 ok:s=>s.sect?T('Leave your sect first','须先脱离门派'):s.age<14?needAge(s,14):s.age>50?T('Too old to start','年纪太大了'):true,
 run(s){const ids=(EVIL_SECTS[s.region]||[]).concat(s.wanted>=2?['erengu']:[],s.job==='assassin'?['qinglong']:[]).filter((x,i,a)=>a.indexOf(x)===i);
   ask(s,'joinevil',{},ids.map(id=>({k:id,l:T(SE(id),SZ(id)),sub:SECTS[id].blurb})).concat([{k:'leave',l:T('Think better of it','还是算了')}]))},
 choose(s,k){if(k==='leave'){say(s,'You walk away from the meeting place. Nobody follows. Probably.','你从接头的地方走开了。应该没人跟着。','muted');return}
   const S=SECTS[k];const p=clamp(.2+power(s)/150+Math.max(0,-s.align)/150+s.wanted*.06+(S.easy||0),.05,.9);
   if(chance(p)){joinSect(s,k);s.align=clamp(s.align-5,-100,100);say(s,`They test you with a job nobody decent would do. You do it. You are now a ${rankName(s).en} of ${SE(k)}.`,`他们拿一件正经人不干的差事试你，你干了。你成了${SZ(k)}的${rankName(s).zh}。`,'bad')}
   else say(s,'"Too soft," says the man with the scarred face, and they leave you on the road.','"太嫩了。"刀疤脸说完，他们把你丢在了路边。','muted')}});

/* ---------- sect life ---------- */
const CHORE_LINES={
 good:[['You haul water up the mountain stairs, two buckets at a time.','你挑着两桶水爬山门的石阶。'],['You sweep the training yard before the bell.','晨钟响前，你把练武场扫得干干净净。'],['You copy sutras in the library until your wrist aches.','你在藏经阁抄经，抄到手腕发酸。'],['You stand guard at the mountain gate all night.','你在山门前守了一夜。'],['You chop firewood for the kitchens.','你给伙房劈柴。'],['You help the elders sort medicinal herbs.','你帮长老们分拣药材。']],
 evil:[['You collect “protection money” from the market stalls.','你去集市上收"保护费"。'],['You test new poisons on rats, then on less lucky things.','你拿老鼠试新毒，后来换了更倒霉的东西。'],['You stand guard over prisoners in the cellar.','你在地牢看守囚犯。'],['You polish the lord’s throne and do not look at the stains.','你擦拭教主的宝座，不去看上面的污渍。'],['You carry messages that you are told not to read.','你送信，上头吩咐不许看。'],['You sing praises of the lord at the morning assembly, loudly.','早会上你大声唱颂教主圣明。']]
};
addAct({id:'sectchores',cat:'sect',n:T('Do sect duties','门派杂务'),d:T('The daily work of a sect. Earns merit (贡献).','门派里的日常差事，可攒门派贡献。'),if:s=>!!s.sect,ok:s=>needAge(s,10),run(s){
  const i=chance(.55)&&pickIncident(s,'chore');if(i){runIncident(s,i);s.merit=(s.merit||0)+2}
  else{const l=pick(CHORE_LINES[isEvil(s.sect)?'evil':'good']);flv(s,isEvil(s.sect)?'chore_evil':'chore',l[0],l[1]);const m=rint(3,5);s.merit=(s.merit||0)+m;s.skill+=.2;say(s,`Merit +${m}.`,`门派贡献+${m}。`,'muted')}}});
(()=>{const M=ACT_BY.sectmission;M.d=T('Missions for the sect: silver, merit, risk.','替门派办事：有银子、有贡献，也有风险。');
 M.run=s=>{const i=pickIncident(s,'sect');s.merit=(s.merit||0)+3;
   if(i){runIncident(s,i);return}
   const r=fightLife(s,{name:foeName(),lv:PW(.9,4)(s)},{stakes:'injury',title:T('Sect mission','门派任务'),cause:T('a sect mission','门派任务')});
   if(r.win){pay(s,rint(10,40));s.merit+=5;say(s,'The mission is done. The elders note your name.','任务完成，长老记下了你的名字。','good')}else say(s,'The mission fails. You come back with nothing but bruises.','任务失败，你只带回一身伤。','muted')}})();
(()=>{const P=ACT_BY.promotion;P.ok=s=>s.rank>=2?T('Higher ranks come with age and deeds','更高职位要靠资历和功绩'):s.age<12?needAge(s,12):(s.merit||0)<MERIT_NEED[s.rank]?T(`Needs ${MERIT_NEED[s.rank]} merit (you have ${s.merit||0})`,`需门派贡献${MERIT_NEED[s.rank]}（现有${s.merit||0}）`):true;
 const run0=P.run;P.run=s=>{const r0=s.rank;run0(s);if(s.rank>r0)s.merit=Math.max(0,(s.merit||0)-MERIT_NEED[r0])}})();
addAct({id:'sectteach',cat:'sect',n:T('Instruct junior disciples','指点师弟师妹'),d:T('Teach the younger ones. Merit and a good name.','教导后辈。得贡献，也得人望。'),if:s=>!!s.sect&&s.rank>=2,run(s){
  const m=rint(4,7);s.merit=(s.merit||0)+m;s.fame+=1;s.skill+=.3*fatigue(s,'train');say(s,`You correct a dozen stances and one bad attitude. Merit +${m}.`,`你纠正了十来个架势，还有一个坏脾气。门派贡献+${m}。`,'good')}});
addAct({id:'sectlib',cat:'sect',n:T('Study in the sect library (25 merit)','入藏经阁研读（25贡献）'),d:T('Spend merit for rare reading. A chance at an outside art.','花贡献换一次读秘籍的机会，或许能学到外门武功。'),if:s=>!!s.sect,ok:s=>(s.merit||0)<25?T('Needs 25 merit','需25门派贡献'):true,run(s){
  s.merit-=25;s.skill+=trainGain(s,.8)+.5;s.smarts=clamp(s.smarts+2,0,100);
  const can=['ironshirt','eagle','bagua','swallow','vajra','knives','spring','goose','turtle','roar','shadow'].filter(k=>ARTS[k]&&!s.arts.some(a=>a.cn===ARTS[k].cn));
  if(can.length&&chance(.18+s.t.wit/50)){const k=pick(can);learn(s,ARTS[k]);say(s,`Among the dusty scrolls you find ${ARTS[k].n} (${ARTS[k].cn}), and work it out.`,`在落满灰尘的卷轴里，你找到了${ARTS[k].cn}，并参透了它。`,'gold')}
  else say(s,'You read until the lamp gutters. Your understanding deepens.','你一直读到油灯将灭，领悟又深了一层。','good')}});

/* ---------- founding your own house ---------- */
const ORG_NAMES={
 sect:[['Azure Cloud','青云'],['Heaven Sword','天剑'],['Black Gold','乌金'],['Sunset Glow','落霞'],['Cloud-Piercing','凌霄'],['Listening Rain','听雨'],['Severed Stream','断水'],['Soaring Hawk','飞鹰'],['Green Pine','苍松'],['White Deer','白鹿']],
 sectx:[['Pavilion','派'],['Gate','门'],['Sword Sect','剑派'],['School','宗']],
 evil:[['Blood Shadow','血影'],['Black Fiend','黑煞'],['Netherworld','幽冥'],['Ten Thousand Venoms','万毒'],['Heavenly Demon','天魔'],['Ghost King','鬼王'],['Asura','修罗'],['Crimson Flame','赤焰']],
 evilx:[['Cult','教'],['Gate','门'],['Palace','宫'],['Gang','帮']],
 escort:[['Mighty Reach','威远'],['Long Wind','长风'],['Dragon Gate','龙门'],['Prosperous Might','昌威'],['Far-Shaking','振远'],['Four Seas','四海'],['Frontier-Guarding','镇远'],['Golden Lion','金狮']]
};
function orgNameOpts(s,type){
  if(type==='escort')return shuffle(ORG_NAMES.escort).slice(0,3).map(a=>T(`${a[0]} Escort Agency`,`${a[1]}镖局`)).concat([T(`${s.sur[1]} Family Escort Agency`,`${s.sur[0]}家镖局`)]);
  const ev=s.align<=-30,A=ev?ORG_NAMES.evil:ORG_NAMES.sect,X=ev?ORG_NAMES.evilx:ORG_NAMES.sectx;
  return shuffle(A).slice(0,4).map(a=>{const x=pick(X);return T(`${a[0]} ${x[0]}`,a[1]+x[1])});
}
const orgName=s=>s.org?s.org.name:null;
addAct({id:'foundsect',ap:2,cat:'jh',n:T('Found your own sect','自立门派'),d:T('Raise your own banner. 800 taels to buy land and build halls.','开宗立派。买地建屋需八百两。'),
 if:s=>!s.org&&s.age>=20,
 ok:s=>s.age<25?needAge(s,25):power(s)<85?T('Needs power 85+ (first-rate)','需功力85以上（一流高手）'):s.fame<25?T('Needs fame 25+','需名望25以上'):s.money<800?T('Needs 800 taels','需八百两'):s.jail>0?notJail(s):true,
 run(s){const c={names:orgNameOpts(s,'sect')};ask(s,'foundsect',c,c.names.map((n,i)=>({k:'n'+i,l:n,sub:s.sect?T(`You will leave ${SE(s.sect)}.`,`你将脱离${SZ(s.sect)}。`):null})).concat([{k:'leave',l:T('Not yet','时候未到')}]))},
 choose(s,k,c){if(k==='leave')return;const name=c.names[+k.slice(1)];
   if(s.sect){const m=masterOf(s);if(m)addBond(m,-30);say(s,`You bow to ${SE(s.sect)} one last time.`,`你最后一次向${SZ(s.sect)}行礼。`);leaveSect(s)}
   pay(s,-800);s.org={type:'sect',name,evil:s.align<=-30,age0:s.age,members:3+Math.round(s.fame/12),rep:20,lv:1};
   say(s,`You raise the banner of ${name.en} (${name.zh}). ${s.org.members} disciples kneel before you.`,`你竖起了「${name.zh}」的大旗，${cnNum(s.org.members)}名弟子跪拜行礼。`,'gold');
   deed(s,`Founded ${name.en} (${name.zh})`,`开宗立派，创立${name.zh}`);s.fame+=8}});
addAct({id:'foundescort',ap:2,cat:'work',n:T('Open your own escort agency','自开镖局'),d:T('Hire escorts and guard silver on the roads. 600 taels, or free if you own an agency.','招镖师、走镖路。需六百两；已有镖局则免。'),
 if:s=>!s.org&&s.age>=18,
 ok:s=>s.age<20?needAge(s,20):power(s)<40?T('Needs power 40+','需功力40以上'):s.money<600&&!owned(s,'escortco').length?T('Needs 600 taels','需六百两'):s.jail>0?notJail(s):true,
 run(s){const c={names:orgNameOpts(s,'escort')};ask(s,'foundescort',c,c.names.map((n,i)=>({k:'n'+i,l:n})).concat([{k:'leave',l:T('Not yet','时候未到')}]))},
 choose(s,k,c){if(k==='leave')return;const name=c.names[+k.slice(1)];
   const it=s.items.findIndex(i=>i.id==='escortco');if(it>=0)s.items.splice(it,1);else pay(s,-600);
   s.org={type:'escort',name,evil:false,age0:s.age,members:4,rep:15,lv:it>=0?2:1};if(s.job==='escort')s.job=null;
   say(s,`The banner of ${name.en} (${name.zh}) goes up over the gate. Firecrackers, lions, and a line of nervous new escorts.`,`「${name.zh}」的镖旗挂上了门楼。鞭炮、舞狮，还有一排紧张的新镖师。`,'gold');
   deed(s,`Founded ${name.en}`,`创办${name.zh}`);s.fame+=4}});

const isSectOrg=s=>s.org&&s.org.type==='sect',isEscortOrg=s=>s.org&&s.org.type==='escort';
const orgCap=s=>s.org.lv*15;
addAct({id:'org_recruit',cat:'org',n:T('Take in new people','广纳人手'),d:T('Recruit disciples or escorts. Fame helps.','招收弟子或镖师，名望越高越容易。'),if:s=>!!s.org,ok:s=>s.org.members>=orgCap(s)?T('No room: build more first','地方不够，先扩建'):true,run(s){
  const n=Math.min(orgCap(s)-s.org.members,rint(1,3)+Math.floor(s.fame/40)+Math.floor(s.org.rep/30));s.org.members+=n;
  say(s,isSectOrg(s)?`${n} new disciple${n>1?'s':''} kneel at your gate.`:`${n} new escort${n>1?'s':''} sign on.`,isSectOrg(s)?`又有${cnNum(n)}名弟子拜入门下。`:`新招了${cnNum(n)}名镖师。`,'good')}});
addAct({id:'org_build',cat:'org',n:T('Expand','扩建'),d:T('More halls, horses and room. Costs 300 taels × current size.','添屋舍、添车马。花费三百两×现有规模。'),if:s=>!!s.org,ok:s=>s.org.lv>=5?T('Already at full size','规模已到顶'):s.money<300*s.org.lv?T(`Needs ${300*s.org.lv} taels`,`需${300*s.org.lv}两`):true,run(s){
  pay(s,-300*s.org.lv);s.org.lv++;s.org.rep=clamp(s.org.rep+5,0,100);say(s,`You expand ${s.org.name.en}. It is now size ${s.org.lv} of 5.`,`你扩建了${s.org.name.zh}，规模升至${cnNum(s.org.lv)}级（满级五）。`,'good')}});
addAct({id:'org_teach',cat:'org',n:T('Teach your disciples','亲传武艺'),d:T('Your disciples grow stronger, and so does your name.','弟子们变强，门派名声也跟着涨。'),if:isSectOrg,run(s){
  s.org.rep=clamp(s.org.rep+rint(2,5),0,100);s.skill+=.4*fatigue(s,'train');say(s,'You walk the rows of disciples correcting stances. The best of them is almost good.','你在弟子们中间来回走，逐一纠正架势。最好的那个已经有点样子了。','good')}});
addAct({id:'org_venture',ap:2,cat:'org',n:T('Look after your house’s affairs','处理门中事务'),d:T('Whatever needs the master’s hand this year.','今年需要你亲自出面的事。'),if:s=>!!s.org,run(s){
  const i=pickIncident(s,'org');if(i){runIncident(s,i);return}
  s.org.rep=clamp(s.org.rep+2,0,100);say(s,'You settle disputes, sign ledgers and drink a great deal of tea.','你调解纠纷、签账本，喝了很多茶。','muted')}});
addAct({id:'org_challenge',cat:'org',n:T('Challenge another sect','登门挑战'),d:T('Defeat a rival master. Win: reputation and disciples. Lose: the opposite.','挑战他派掌门。赢了名望弟子双收，输了反之。'),if:isSectOrg,ok:s=>s.jail>0?notJail(s):true,run(s){
  const foe={name:T(`the master of ${pick(['the Iron Fist Hall','the Five Tigers Gate','the Wind-Thunder Pavilion','the Green Bamboo Gang'])}`,`${pick(['铁拳堂','五虎门','风雷阁','青竹帮'])}掌门`),lv:PW(rint(9,12)/10,5)(s)};
  const r=fightLife(s,foe,{stakes:'light',title:T('Sect challenge','登门挑战'),cause:T('a sect challenge','门派之争')});
  if(r.win){s.org.rep=clamp(s.org.rep+8,0,100);s.fame+=4;const n=rint(1,3);s.org.members=Math.min(orgCap(s),s.org.members+n);say(s,`You win. ${n} of their disciples follow you home.`,`你赢了。对方有${cnNum(n)}名弟子跟着你回了山门。`,'gold')}
  else{s.org.rep=clamp(s.org.rep-6,0,100);say(s,'You lose, in front of everyone. Your disciples look at their feet.','你当众落败。弟子们都低头看着脚尖。','bad')}}});
addAct({id:'org_contract',ap:2,cat:'org',n:T('Take an escort contract','接镖'),d:T('Choose a run. Bigger silver, bigger risk.','挑一趟镖。银子越多，风险越大。'),if:isEscortOrg,ok:s=>s.jail>0?notJail(s):true,run(s){
  const L=s.org.lv;const c={runs:[[T('A short run to the next county','近镖：送到邻县'),80*L,.2,.75],[T('A long run across three provinces','远镖：横跨三省'),220*L,.4,.95],[T('“Red goods”: jewels for a prince','红货镖：替王爷押运珠宝'),600*L,.65,1.2]]};
  ask(s,'org_contract',c,c.runs.map((r,i)=>({k:'r'+i,l:r[0],sub:T(`Fee ${r[1]} taels · risk ${Math.round(r[2]*100*(s.org.safe>=s.age?.6:1))}%`,`镖银${r[1]}两 · 风险${Math.round(r[2]*100*(s.org.safe>=s.age?.6:1))}%`)})).concat([{k:'leave',l:T('Turn them all down','都推了')}]))},
 choose(s,k,c){if(k==='leave')return;const [lab,fee,risk,m]=c.runs[+k.slice(1)];
   if(chance(risk*(s.org.safe>=s.age?.6:1))){const r=fightLife(s,{name:pick([T('the Black Wind Ridge bandits','黑风岭山贼'),T('masked robbers','蒙面劫匪'),T('a famous lone bandit','独行大盗')]),lv:PW(m,6)(s)},{stakes:'injury',title:T('Robbery on the road','劫镖'),cause:T('robbers on an escort run','劫镖的强盗')});
     if(r.win){pay(s,fee);s.org.rep=clamp(s.org.rep+6,0,100);s.fame+=2;say(s,`Robbers strike and are beaten off. The goods arrive. ${fee} taels.`,`半路遇劫，被你打退了。镖货安然送到，得镖银${fee}两。`,'gold')}
     else{const loss=Math.round(fee*.6);pay(s,-loss);s.org.rep=clamp(s.org.rep-12,0,100);if(chance(.4)&&s.org.members>1){s.org.members--;say(s,'One of your escorts does not come home.','有一名镖师没能回来。','bad')}say(s,`The goods are lost. You pay ${loss} taels in compensation, and the banner loses face.`,`镖丢了。你赔了${loss}两，镖局的名号也跌了。`,'bad')}}
   else{pay(s,fee);s.org.rep=clamp(s.org.rep+3,0,100);say(s,`An uneventful run. ${fee} taels.`,`一路平安，得镖银${fee}两。`,'good')}}});
addAct({id:'org_bandits',cat:'org',n:T('Pay respects to the mountain strongholds (100 taels)','拜山（一百两）'),d:T('Gifts to the bandit chiefs on your routes. Less robbery for three years.','给沿途山寨送礼，三年内少遭劫。'),if:isEscortOrg,ok:s=>s.money<100?T('Needs 100 taels','需一百两'):s.org.safe>=s.age?T('Your gifts still hold','礼还管用'):true,run(s){
  pay(s,-100);s.org.safe=s.age+3;say(s,'You drink with three bandit chiefs and leave with a token from each.','你和三位寨主喝了酒，各讨了一枚令牌回来。','good')}});
addAct({id:'org_close',ap:0,cat:'org',n:T('Close your house','关门散伙'),d:T('Disband and send everyone home.','解散众人，各回各家。'),if:s=>!!s.org,run(s){ask(s,'org_close',{},[{k:'go',l:T('Disband','解散')},{k:'no',l:T('Keep going','继续撑下去')}])},
 choose(s,k){if(k!=='go')return;say(s,`You take down the banner of ${s.org.name.en}. Some of your people cry.`,`你摘下了「${s.org.name.zh}」的旗号，有人哭了。`,'muted');s.flags.formerOrg=s.org.name;s.org=null;happy(s,-6)}});

/* the yearly life of your house, and of your sect if you belong to one */
const _yearly=yearly;
yearly=function(s){
  _yearly(s);
  if(s.org&&s.alive){const o=s.org;
    let inc=o.type==='escort'?o.members*8*(o.rep/50):o.evil?o.members*7*o.lv:o.members*3*o.lv*(o.rep/50);const up=o.members*2;inc=Math.round(inc-up);
    if(inc)payT(s,inc,'org');say(s,inc>=0?`${o.name.en} brings in ${inc} taels this year.`:`${o.name.en} costs you ${-inc} taels this year.`,inc>=0?`${o.name.zh}今年进账${inc}两。`:`${o.name.zh}今年亏了${-inc}两。`,'muted');
    if(o.evil){s.align=clamp(s.align-2,-100,100);if(chance(.2))s.wanted=Math.min(5,s.wanted+1)}
    if(o.type==='sect'&&!s.retired)s.skill+=trainGain(s,.2);
    if(o.rep<10&&o.members>0&&chance(.5)){o.members--;say(s,'A disciple slips away in the night. Your house’s name is not worth much now.','有个弟子半夜走了。你门户的名声如今不值什么。','bad')}
    o.rep=clamp(o.rep+(o.rep>40?-1:0),0,100);
    if(s.retired&&o.members>0&&chance(.2))o.rep=clamp(o.rep-2,0,100);
    if(o.members<=0){say(s,`${o.name.en} has no one left. It is over.`,`${o.name.zh}已经没人了，就此散了。`,'bad');s.flags.formerOrg=o.name;s.org=null}
  }
  /* sect life comes to you whether you ask for it or not */
  if(s.sect&&!s.retired&&s.jail<=0&&s.age>=11&&s.alive&&chance(.5)){const i=pickIncident(s,'chore');if(i){runIncident(s,i);s.merit=(s.merit||0)+1}}
  if(s.org&&s.alive&&s.jail<=0&&chance(.35)){const i=pickIncident(s,'org');if(i)runIncident(s,i)}
};
/* the elders only consider those who have served */
(()=>{const e=INC_BY.elder;if(e){const w0=e.when;e.when=s=>w0(s)&&(s.merit||0)>=MERIT_NEED[2]}})();

/* ---------- more ways to earn a living ---------- */
Object.assign(JOBS,{
 boatman:{n:[T('Ferryman','船夫'),T('Boat Owner','船老大'),T('Shipping Master','漕帮舵主')],pay:[22,60,200],req:s=>s.age>=13,rq:T('Age 13+','年满十三岁'),year:s=>{s.skill+=.3}},
 cook:{n:[T('Kitchen Hand','帮厨'),T('Cook','大厨'),T('Famous Chef','名厨')],pay:[20,55,160],req:s=>s.age>=12,rq:T('Age 12+','年满十二岁'),year:s=>happy(s,1)},
 herbalist:{n:[T('Herb Gatherer','采药人'),T('Apothecary','药铺伙计'),T('Pharmacy Owner','药铺东家')],pay:[20,55,150],req:s=>s.age>=12&&s.smarts>=30,rq:T('Smarts 30+','学识30+'),year:s=>{heal(s,2)}},
 hunter:{n:[T('Hunter','猎户'),T('Master Hunter','老猎手'),T('Head of the Hunt','围场总管')],pay:[25,60,140],req:s=>s.age>=14&&s.t.root>=4,rq:T('Bones 4+','根骨4+'),year:s=>{s.skill+=.6;if(chance(.08))wound(s,4,12,T('a hunting accident','打猎受伤'))}},
 courier:{n:[T('Post Rider','驿卒'),T('Post Station Chief','驿丞'),T('Courier Commander','急递铺总管')],pay:[30,70,160],req:s=>s.age>=16,rq:T('Age 16+','年满十六岁'),year:s=>{s.skill+=.3}},
 fortune:{n:[T('Street Fortune Teller','街头算命'),T('Diviner','卦师'),T('Imperial Astrologer','钦天监')],pay:[20,80,260],req:s=>s.age>=18&&s.smarts>=45,rq:T('Smarts 45+','学识45+'),year:s=>{s.qi+=.3}},
 merchant:{n:[T('Tea Trader','茶商'),T('Merchant','行商'),T('Great Merchant','大商贾')],pay:[50,150,500],req:s=>s.age>=18&&s.smarts>=40&&s.money>=200,rq:T('Smarts 40+, 200 taels capital','学识40+，本钱二百两'),year:s=>{if(chance(.12)){const l=rint(40,160);pay(s,-l);say(s,`A shipment is lost on the river (−${l} taels).`,`一批货沉在江里，亏了${l}两。`,'bad')}}},
 instructor:{n:[T('Martial Hall Instructor','武馆教头'),T('Hall Master','武馆馆主'),T('Famous Teacher','一代名师')],pay:[60,140,300],req:s=>s.age>=20&&power(s)>=60,rq:T('Power 60+','功力60+'),year:s=>{s.skill+=.5;s.fame+=1}},
 bounty:{n:[T('Bounty Hunter','赏金猎人'),T('Famous Bounty Hunter','名捕赏金客'),T('King of Bounties','追魂使')],pay:[90,240,600],req:s=>s.age>=18&&power(s)>=45,rq:T('Power 45+','功力45+'),year:s=>{s.skill+=.8;if(chance(.2))wound(s,6,20,T('a bounty that fought back','负隅顽抗的通缉犯'))}},
 enforcer:{n:[T('Gambling Den Thug','赌坊打手'),T('Head Thug','打手头目'),T('Den Boss','赌坊老板')],pay:[45,110,350],req:s=>s.age>=16&&power(s)>=20&&s.align<=10,rq:T('Power 20+, not too upright','功力20+，不太正派'),year:s=>{s.align-=1;s.skill+=.4}},
 smuggler:{n:[T('Salt Runner','私盐贩子'),T('Salt Boss','盐枭'),T('King of the Salt Roads','盐帮帮主')],pay:[80,260,900],req:s=>s.age>=16&&s.align<=0,rq:T('Unorthodox (alignment ≤ 0)','行事偏邪（正邪≤0）'),year:s=>{s.align-=1;if(chance(.18))s.wanted=Math.min(5,s.wanted+1)}},
 jinyiwei:{n:[T('Embroidered Guard','锦衣卫'),T('Hundred-Household Commander','锦衣卫百户'),T('Commander of the Embroidered Guard','锦衣卫指挥使')],pay:[120,330,1000],req:s=>s.age>=18&&power(s)>=70&&s.wanted===0,rq:T('Power 70+, not wanted','功力70+，未被通缉'),year:s=>{s.align-=1;s.fame+=1}}
});
