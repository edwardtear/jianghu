/* 江湖一生 · core: helpers, world data, character creation */
'use strict';
const R=Math.random;
const rint=(a,b)=>a+Math.floor(R()*(b-a+1));
const pick=a=>a[Math.floor(R()*a.length)];
const chance=p=>R()<p;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const T=(en,zh)=>({en,zh});
const P=a=>T(a[0],a[1]);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function wpick(list,wf){let tot=0;const ws=list.map(x=>{const w=Math.max(0,(wf?wf(x):x.w)||0);tot+=w;return w});
  if(tot<=0)return null;let r=R()*tot;for(let i=0;i<list.length;i++){r-=ws[i];if(r<=0&&ws[i]>0)return list[i]}return list[list.length-1]}
const DIG='零一二三四五六七八九';
function cnNum(n){n=Math.round(n);if(n<0)return'负'+cnNum(-n);if(n<10)return DIG[n];if(n<20)return'十'+(n%10?DIG[n%10]:'');
  if(n<100)return DIG[Math.floor(n/10)]+'十'+(n%10?DIG[n%10]:'');
  if(n<1000){const h=Math.floor(n/100),r=n%100;return DIG[h]+'百'+(r?(r<10?'零'+DIG[r]:(r<20?'一'+cnNum(r):cnNum(r))):'')}
  return String(n)}
/* deterministic hashing so the same name always gets the same body and talents */
function hashStr(str){let h1=0xdeadbeef,h2=0x41c6ce57;for(const ch of String(str)){const c=ch.codePointAt(0);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return(h1>>>0)^((h2>>>0)*7)}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const seeded=str=>mulberry(hashStr(str));

/* ---------- world ---------- */
const REGIONS=[
 {id:'central',cn:'中原',en:'the Central Plains',w:28,sects:['shaolin','huashan','beggar'],desc:T('where the Yellow River bends past old capitals and older temples','黄河九曲，古都与古刹并立之地')},
 {id:'jiangnan',cn:'江南',en:'Jiangnan',w:22,sects:['wudang','beggar','peach'],desc:T('a land of canals, rain and silk','小桥流水、烟雨丝绸之乡')},
 {id:'shu',cn:'蜀中',en:'Shu',w:12,sects:['emei','tang'],desc:T('behind mountain roads so steep they are said to climb into the sky','蜀道之难，难于上青天')},
 {id:'north',cn:'塞北',en:'the Northern Frontier',w:10,sects:['sunmoon','shaolin'],desc:T('where the Great Wall holds back the steppe','长城之外，朔风卷着草原')},
 {id:'west',cn:'西域',en:'the Western Regions',w:6,sects:['tianshan','kunlun'],desc:T('among the oasis towns of the Silk Road','丝路上的绿洲城邦之间')},
 {id:'miao',cn:'苗疆',en:'the Miao Borderlands',w:6,sects:['wudu','emei'],desc:T('in misty southwestern valleys famous for poison and Gu','西南雾谷之中，以毒与蛊闻名')},
 {id:'east',cn:'东海',en:'the Eastern Sea',w:5,sects:['peach','beggar'],desc:T('on a fishing isle off the eastern coast','东海外的一座渔岛上')},
 {id:'capital',cn:'京城',en:'the Capital',w:11,sects:['shaolin','huashan','beggar'],desc:T('inside the walls of the imperial city','天子脚下的皇城之内')}
];
const FAMILIES=[
 {id:'peasant',cn:'农家',en:'a peasant family',w:40,money:5,align:0,line:T('Your parents farm a rented plot. The harvest decides whether winter is hungry.','爹娘租种着几亩薄田。收成好坏，决定这个冬天会不会挨饿。'),birth:'你生在一户佃农人家。',rich:1},
 {id:'hunter',cn:'猎户',en:'a hunter’s family',w:10,money:8,align:0,line:T('Your father hunts the hills. You learn early how to move quietly.','父亲靠打猎为生。你很早就学会了怎样悄无声息地走路。'),birth:'你生在山脚下一户猎户家。',rich:1},
 {id:'merchant',cn:'商贾',en:'a merchant family',w:12,money:120,align:-2,line:T('Your family trades salt and tea. There is always money, and always worry about money.','家里贩盐贩茶。钱从来不缺，为钱发愁也从来不缺。'),birth:'你生在一户商贾人家。',rich:3},
 {id:'scholar',cn:'书香门第',en:'a family of scholars',w:8,money:60,align:5,line:T('Your grandfather passed the imperial exams. Books outnumber the furniture.','祖父当年中过进士。家里的书比家具还多。'),birth:'你生在一户书香门第。',rich:2},
 {id:'beggar',cn:'乞丐',en:'a beggar woman',w:7,money:0,align:0,line:T('You were born under a bridge. Nobody wrote down the date.','没有人记下你出生的日子。'),birth:'你生在桥洞底下，娘是个乞丐。',rich:0,nofather:1},
 {id:'escort',cn:'镖局',en:'a family that runs an escort agency',w:6,money:80,align:5,line:T('Your father’s escort agency guards silver on the roads. Its banner and its name are its only real capital.','父亲开镖局，替人押送银两。镖旗和名号，就是镖局全部的本钱。'),birth:'你生在一家镖局里。',rich:2,martial:1},
 {id:'temple',cn:'弃婴',en:'no one; you were a foundling',w:5,money:0,align:8,line:T('You were left in a basket at a temple gate. The monks took you in.','寺里的和尚收留了你。'),birth:'你是个弃婴，被人放在竹篮里，搁在一座寺庙门口。',rich:0,orphan:1},
 {id:'clan',cn:'武林世家',en:'an old martial clan',w:4,money:200,align:5,line:T('Your clan has produced swordsmen for six generations. The expectations arrived before your first tooth.','你家六代都出剑客。你还没长出第一颗牙，家里的期望就已经压了下来。'),birth:'你生在一个古老的武林世家。',rich:3,martial:2},
 {id:'cult',cn:'魔教世家',en:'a family sworn to the Crimson Sky Cult',w:2,money:60,align:-25,line:T('Your parents serve the Crimson Sky Cult. The righteous sects call your family demons.','名门正派都管你们家叫魔头。'),birth:'你生在一户效忠赤霄教的人家。',rich:2,martial:1},
 {id:'noble',cn:'王侯',en:'a princely house',w:1,money:2000,align:0,line:T('You were born in a prince’s mansion: a hundred servants and a thousand rules.','上百个仆人，上千条规矩。'),birth:'你生在一座王府里。',rich:5}
];
/* each sect art carries the battle skill it unlocks */
const SECTS={
 shaolin:{cn:'少林寺',en:'Shaolin Temple',align:2,wpn:T('Palm','掌'),arts:[['Arhat Fist','罗汉拳','pojia'],['Great Diamond Palm','大金刚掌','jinzhong'],['Sinew-Changing Classic','易筋经','fanzhen']],blurb:T('The root of all martial arts. Strict, Buddhist, patient.','天下武功出少林。戒律森严，讲究耐心。')},
 wudang:{cn:'武当派',en:'Wudang',align:2,wpn:T('Sword','剑'),arts:[['Wudang Long Fist','武当长拳','lianhuan'],['Taiji Sword','太极剑','yiyu'],['Pure Yang Skill','纯阳功','jianqi']],blurb:T('Daoist masters of softness overcoming hardness. Rewards insight.','道家门派，以柔克刚。最看重悟性。')},
 emei:{cn:'峨眉派',en:'Emei',align:2,wpn:T('Thorn','刺'),arts:[['Emei Thorns','峨眉刺','anqi'],['Golden Summit Palm','金顶掌','dianxue'],['Emei Heart Art','峨眉心法','heal']],blurb:T('A mountain sect famed for its swordswomen and its discipline.','名山大派，以女侠和门规著称。')},
 huashan:{cn:'华山派',en:'Mount Hua',align:1,wpn:T('Sword','剑'),arts:[['Mount Hua Sword','华山剑法','lianhuan'],['Eastern Purple Qi','紫气东来功','jianqi'],['Nine Edge-Breaking Forms','破锋九式','pojia']],blurb:T('Proud swordsmen on a perilous peak. Politics run as sharp as the cliffs.','险峰上的骄傲剑客。门内争斗和悬崖一样险。')},
 beggar:{cn:'丐帮',en:'the Beggars’ Sect',align:2,wpn:T('Staff','棒'),easy:.35,arts:[['Green Bamboo Staff','青竹棒法','dianxue'],['Lotus Palm','莲花掌','pojia'],['Nine Azure Dragon Palms','苍龙九掌','longzhang']],blurb:T('The largest sect under heaven. Anyone may join; few rise.','天下第一大帮。人人可入，出头者少。')},
 tang:{cn:'唐门',en:'the Tang Clan',align:0,wpn:T('Needle','针'),arts:[['Hidden Needles','暗器手法','anqi'],['Tang Poison Canon','唐门毒经','poison'],['Rain of Flowers','满天花雨','shihou']],blurb:T('Hidden weapons and poisons. Neither righteous nor evil, only feared.','暗器与毒药。不正不邪，只叫人畏惧。')},
 tianshan:{cn:'天山派',en:'Tianshan',align:1,wpn:T('Plum','梅'),arts:[['Tianshan Sword','天山剑法','jianqi'],['Winter Plum Hand','寒梅手','dianxue'],['Ice Heart Formula','冰心诀','xixing']],blurb:T('A remote sect among glaciers. Few visitors, strange arts.','冰川之间的偏远门派。访客稀少，武功古怪。')},
 kunlun:{cn:'昆仑派',en:'Kunlun',align:1,wpn:T('Sword','剑'),arts:[['Kunlun Sword','昆仑剑法','jianqi'],['Cloud-Ladder Leap','云梯纵','kuaijian'],['Two Forms Sword','两仪剑法','lianhuan']],blurb:T('Swordsmen of the far western mountains, aloof and proud.','西域群山中的剑客，清高孤傲。')},
 wudu:{cn:'五毒教',en:'the Five Venoms Sect',align:-2,wpn:T('Venom','毒'),easy:.25,arts:[['Venom Sand Palm','毒砂掌','poison'],['Gu Raising','养蛊术','shehun'],['Ten-Thousand Venom Hand','万毒手','neishang']],blurb:T('Scorpions, centipedes, toads, snakes and spiders. The righteous call it evil.','蝎、蜈蚣、蟾蜍、蛇、蜘蛛。正道称之为邪教。')},
 sunmoon:{cn:'赤霄教',en:'the Crimson Sky Cult',align:-3,wpn:T('Needle','针'),easy:.25,arts:[['Crimson Sky Sword','赤霄剑法','pojia'],['Essence-Devouring Art','噬元大法','xixing'],['Night Bloom Codex','夜昙秘录','lianhuan']],blurb:T('Feared across the jianghu. Power is given freely and paid back forever.','江湖闻之色变。力量白给，却要你还一辈子。')},
 peach:{cn:'听潮岛',en:'Tide-Listening Isle',align:0,wpn:T('Flute','箫'),arts:[['Tide-Listening Palm','听潮掌','lianhuan'],['Song of the Tides','潮音曲','shihou'],['Flicking Finger','弹指劲','anqi']],blurb:T('An eccentric master on an island maze. Brilliance over rules.','迷阵海岛上的怪杰。才情胜过规矩。')}
};
/* arts that can be found, bought or taught outside the sects */
const ARTS={
 turtle:{n:'Turtle Breathing',cn:'龟息功',tier:1,sk:'heal'},
 goose:{n:'Wild Goose Sword',cn:'雁行剑',tier:1,sk:'kuaijian'},
 street:{n:'Street Brawling',cn:'野路子',tier:0,sk:'kuangbao'},
 ironshirt:{n:'Iron Shirt',cn:'铁布衫',tier:1,sk:'jinzhong'},
 eagle:{n:'Eagle Claw',cn:'鹰爪功',tier:1,sk:'pojia'},
 bagua:{n:'Eight Trigrams Palm',cn:'八卦掌',tier:1,sk:'yiyu'},
 swallow:{n:'Swallow Skims Water',cn:'燕子三抄水',tier:1,sk:'lingbo'},
 vajra:{n:'Vajra Finger',cn:'金刚指',tier:1,sk:'dianxue'},
 knives:{n:'Flying Knives',cn:'飞刀术',tier:1,sk:'anqi'},
 roar:{n:'Lion’s Roar',cn:'狮吼功',tier:2,sk:'shihou'},
 shadow:{n:'Shadow Clone Steps',cn:'分身幻影',tier:2,sk:'fenshen'},
 spring:{n:'Spring Return Art',cn:'回春功',tier:1,sk:'heal'},
 heartlure:{n:'Heart-Luring Art',cn:'摄心术',tier:2,sk:'shehun'},
 lastlight:{n:'Last Light Secret',cn:'回光诀',tier:2,sk:'huiguang'},
 drunk:{n:'Drunken Fist',cn:'醉拳',tier:1,sk:'lianhuan'},
 poisonfog:{n:'Poison Mist Palm',cn:'化骨掌',tier:2,sk:'poison'},
 heartbreak:{n:'Heart-Shaking Palm',cn:'震心掌',tier:2,sk:'neishang'},
 lightning:{n:'Lightning Saber',cn:'快刀',tier:2,sk:'kuaijian'},
 ninesun:{n:'Great Sun Manual',cn:'大日真经',tier:3,sk:'heal'},
 nineyin:{n:'Profound Yin Manual',cn:'玄阴真经',tier:3,sk:'neishang'},
 beiming:{n:'Sea-Swallowing Art',cn:'吞海神功',tier:3,sk:'xixing'},
 lingboweibu:{n:'Wave-Treading Steps',cn:'踏波步',tier:3,sk:'lingbo'},
 sixmeridian:{n:'Six-Qi Sword Finger',cn:'六气剑指',tier:3,sk:'jianqi'},
 bloodsaber:{n:'Red Blade Classic',cn:'赤刃经',tier:3,sk:'kuangbao',bad:1},
 familysword:{n:'Family Sword',cn:'家传剑法',tier:1,sk:'lianhuan'},
 escortsaber:{n:'Escort Saber',cn:'镖局刀法',tier:0,sk:'pojia'},
 prisonart:{n:'Ever-Bright Classic',cn:'长明经',tier:3,sk:'huiguang'}
};
const RANKS=[T('outer disciple','外门弟子'),T('inner disciple','内门弟子'),T('personal disciple','亲传弟子'),T('elder','长老'),T('sect master','掌门')];
const REALMS=[[0,'不通武艺','Untrained'],[15,'三流好手','Third-rate fighter'],[40,'二流好手','Second-rate fighter'],[85,'一流高手','First-rate fighter'],[150,'绝顶高手','Peerless master'],[215,'一代宗师','Grandmaster'],[310,'天下第一','First under heaven']];
const rlm=i=>T(REALMS[i][2],REALMS[i][1]);
const TIERS=[{b:3,m:1.15},{b:7,m:1.35},{b:14,m:1.65},{b:24,m:2}];
const ERAS=[['承平','Chengping'],['永安','Yong’an'],['乾元','Qianyuan'],['景和','Jinghe'],['天祐','Tianyou'],['建兴','Jianxing'],['太和','Taihe'],['宣德','Xuande']];
const SUR=[['李','Li'],['王','Wang'],['张','Zhang'],['林','Lin'],['陈','Chen'],['杨','Yang'],['赵','Zhao'],['萧','Xiao'],['沈','Shen'],['叶','Ye'],['段','Duan'],['燕','Yan'],['谢','Xie'],['苏','Su'],['柳','Liu'],['顾','Gu'],['陆','Lu'],['白','Bai'],['花','Hua'],['云','Yun'],['慕容','Murong'],['欧阳','Ouyang'],['令狐','Linghu'],['上官','Shangguan'],['独孤','Dugu'],['司马','Sima'],['南宫','Nangong'],['东方','Dongfang']];
const GM=[['云','yun'],['风','feng'],['寒','han'],['舟','zhou'],['远','yuan'],['天','tian'],['明','ming'],['逸','yi'],['尘','chen'],['青','qing'],['山','shan'],['剑','jian'],['行','xing'],['白','bai'],['啸','xiao'],['峰','feng'],['岳','yue'],['松','song'],['海','hai'],['龙','long']];
const GF=[['雪','xue'],['若','ruo'],['清','qing'],['兰','lan'],['婉','wan'],['月','yue'],['灵','ling'],['霜','shuang'],['烟','yan'],['芷','zhi'],['瑶','yao'],['音','yin'],['蓉','rong'],['萱','xuan'],['素','su'],['蝶','die']];
const EPI=[['Iron-Fan','铁扇'],['One-Eyed','独眼'],['Jade-Faced','玉面'],['Bloody-Hand','血手'],['Mad Blade','狂刀'],['Black Kite','黑鸢'],['Smiling Tiger','笑面虎'],['Ghost-Step','鬼影'],['Cold Spear','冷枪'],['Nine-Ring Saber','九环刀'],['Golden Abacus','金算盘'],['Poison Scorpion','毒蝎'],['Black Crane','黑鹤'],['Thousand-Hand','千手'],['Drunken Monk','醉僧'],['Snow Wolf','雪狼']];
const TALENT_W=[3,6,10,14,17,17,14,10,6,3];
const TRAITS=[['bold','豪爽'],['scheming','阴险'],['gentle','温柔'],['greedy','贪财'],['devoted','痴情'],['a heavy drinker','好酒'],['eccentric','古怪'],['upright','正直'],['timid','胆小'],['arrogant','傲慢'],['cheerful','开朗'],['cold','冷漠']];
const OCC=[['a woodcutter','樵夫','m'],['a poor scholar','穷书生','m'],['a Daoist priest','道士','m'],['a Buddhist nun','尼姑','f'],['a monk','和尚','m'],['a salt merchant','盐商','x'],['a singing girl','歌女','f'],['a beggar','乞丐','x'],['an escort guard','镖师','x'],['a constable','捕快','x'],['a country doctor','郎中','x'],['a rich young master','富家公子','m'],['a rich young lady','大小姐','f'],['a wandering swordsman','游侠','m'],['a wandering swordswoman','女侠','f'],['a hunter','猎户','x'],['a ferryman','船夫','x'],['a peddler','货郎','x'],['an old woman','老婆婆','f'],['an old man','老头','m'],['a little girl','小姑娘','f'],['a little boy','小男孩','m'],['a foreign monk','番僧','m'],['a Persian merchant','波斯商人','x'],['a fortune teller','算命先生','m'],['a blacksmith','铁匠','m'],['an innkeeper','客栈掌柜','x'],['a widow','寡妇','f'],['a deserter','逃兵','m'],['a herbalist','采药人','x'],['an actress','戏子','f'],['a court eunuch','太监','m']];
const PLACES=[['a riverside teahouse','河边茶馆'],['the ferry crossing','渡口'],['a ruined temple','破庙'],['a bamboo forest','竹林'],['the market','集市'],['a roadside inn','路边客栈'],['a mountain pass','山口'],['an old pagoda','古塔下'],['the city gate','城门口'],['a misty lake','烟波湖上'],['a plum orchard','梅林'],['a gambling den','赌坊'],['a pawnshop','当铺'],['a theatre stage','戏台下'],['an abandoned fort','废弃的关隘'],['a fishing village','渔村'],['the county yamen','县衙门口'],['a hot spring','温泉边'],['a snowfield','雪原'],['a night market','夜市'],['a Daoist abbey','道观'],['a burial ground','乱葬岗'],['a tea plantation','茶园'],['a cliffside path','悬崖栈道'],['a wine shop','酒肆'],['a stone bridge','石桥上'],['a horse fair','马市'],['a lotus pond','荷塘边']];
const INTROS=[['In a spring drizzle','春雨绵绵'],['On a sweltering summer noon','盛夏正午'],['Under a cold autumn moon','秋月清冷'],['In the first snow of winter','初冬落雪'],['At dawn, in thick fog','拂晓浓雾中'],['On the night of the Lantern Festival','元宵之夜'],['During the Dragon Boat Festival','端午时节'],['On a windy dusk','黄昏风起'],['After three days of rain','连下三天雨后'],['Under a blood-red sunset','残阳如血'],['On a quiet afternoon','一个闲散的午后'],['At midnight','三更半夜'],['On the Double Ninth Festival','重阳节'],['On a moonless night','月黑风高夜']];
const OBJECTS=[['a jade pendant','一块玉佩'],['a broken sword','一柄断剑'],['a sealed letter','一封密信'],['a bloodstained map','一张染血的地图'],['a silver hairpin','一支银簪'],['a lacquered box','一只漆盒'],['a strange seed','一颗奇怪的种子'],['an iron token','一枚铁令牌'],['a bundle of herbs','一捆草药'],['a bamboo flute','一支竹笛'],['a ledger','一本账簿'],['a pearl the size of an eye','一颗眼珠大的珍珠'],['a rusted key','一把生锈的钥匙'],['a child’s shoe','一只童鞋'],['a scroll painting','一幅画轴'],['a bronze mirror','一面铜镜'],['a gourd of wine','一葫芦酒'],['a half-burnt manual','半本烧焦的秘籍']];

/* ---------- names & people ---------- */
const cap=x=>x[0].toUpperCase()+x.slice(1);
function genGiven(g){const L=g==='f'?GF:GM,n=chance(.6)?2:1,p=[];while(p.length<n){const c=pick(L);if(!p.includes(c))p.push(c)}
  return{cn:p.map(x=>x[0]).join(''),py:cap(p.map(x=>x[1]).join(''))}}
function genName(g,sur){const s=sur||pick(SUR),gv=genGiven(g);return{cn:s[0]+gv.cn,py:s[1]+' '+gv.py,sur:s}}
const nmT=n=>T(n.py,n.cn);
function foeName(){const e=pick(EPI),p=genName(chance(.5)?'m':'f');return T(`${e[0]} ${p.py}`,e[1]+p.cn)}
function rollTalent(){return wpick(TALENT_W.map((w,i)=>({w,i}))).i+1}
const PRON={m:{he:'he',him:'him',his:'his',He:'He',His:'His',ta:'他'},f:{he:'she',him:'her',his:'her',He:'She',His:'Her',ta:'她'}};

/* a person who can live in your relationship list */
/* how strong a random person in the jianghu is: most are ordinary, true masters are rare, and none of this depends on how strong you are */
function worldLv(){const r=R();return r<.55?rint(3,35):r<.82?rint(35,80):r<.94?rint(80,140):r<.985?rint(140,210):rint(210,300)}
function mkPerson(s,o={}){
  const occ=o.occ!=null?OCC[o.occ]:null;
  const sex=o.sex||(occ&&occ[2]!=='x'?occ[2]:(chance(.5)?'m':'f'));
  const n=o.name||genName(sex,o.sur);
  const sur=n.sur&&n.sur[0]?n.sur:[(n.cn||'?')[0],String(n.py||'').split(' ')[0]||''];
  return Object.assign({id:++s.pid,n:{cn:n.cn,py:n.py,sur},sex,age:o.age??rint(16,45),rel:o.rel||'acq',bond:o.bond??rint(35,60),alive:true,
    trait:o.trait??Math.floor(R()*TRAITS.length),lv:o.lv??worldLv(),occ:o.occ??null,met:s?s.age:0,talked:-1},o.extra||{});
}
/* a throwaway character for one incident (not stored unless you befriend them) */
function npc(s,o={}){
  const oi=o.occ!=null?o.occ:Math.floor(R()*OCC.length);
  const p=mkPerson(s,Object.assign({},o,{occ:oi}));p.temp=true;s.pid--;p.id=0;
  const pr=PRON[p.sex];
  p.en=p.n.py;p.zh=p.n.cn;p.he=pr.he;p.him=pr.him;p.his=pr.his;p.He=pr.He;p.His=pr.His;p.ta=pr.ta;
  p.desc=T(OCC[oi][0],OCC[oi][1]);p.tr=P(TRAITS[p.trait]);
  return p;
}
function scene(){return{intro:P(pick(INTROS)),place:P(pick(PLACES)),obj:P(pick(OBJECTS))}}

/* ---------- character ---------- */
function power(s){return Math.round(s.skill+s.qi*.5+s.arts.reduce((t,a)=>t+TIERS[a.tier].b*(.85+.035*(a.lv??3)),0))}
function mult(s){return s.arts.reduce((m,a)=>Math.max(m,TIERS[a.tier].m),1)}
/* the realm shown to the player: someone who has learned an art is a novice, not untrained */
function rname(s){return s.realm===0&&s.arts&&s.arts.length?[0,'初学乍练','Novice']:REALMS[s.realm]}
function realmOf(s){const p=power(s);let i=0;REALMS.forEach((r,k)=>{if(p>=r[0])i=k});return i}
function learn(s,art){if(s.arts.some(a=>a.cn===art.cn))return false;s.arts.push(Object.assign({},art));return true}
function sectArt(id,i){const a=SECTS[id].arts[i];return{n:a[0],cn:a[1],tier:i,sk:a[2],sect:id}}
function sectArtCount(s){return s.sect?s.arts.filter(a=>a.sect===s.sect).length:0}
const SE=id=>`${SECTS[id].en} (${SECTS[id].cn})`;
const SZ=id=>SECTS[id].cn;
const region=s=>REGIONS.find(r=>r.id===s.region);
const family=s=>FAMILIES.find(f=>f.id===s.family);
const person=(s,id)=>s.people.find(p=>p.id===id);
/* a nemesis (nemesis.js) has a story of its own, so the general enemy scenes leave them out */
const living=(s,rel)=>s.people.filter(p=>p.alive&&(!rel||(Array.isArray(rel)?rel.includes(p.rel):p.rel===rel))&&!(p.nem&&rel&&(rel==='enemy'||(Array.isArray(rel)&&rel.includes('enemy')))));
const spouseOf=s=>living(s,'spouse')[0];
const masterOf=s=>s.people.find(p=>p.alive&&p.rel==='master');

/* what the player chose before birth (null = leave it to fate) */
let START_OPT=null;
function newLife(){
  const o=START_OPT||{};
  const reg=REGIONS.find(r=>r.id===o.region)||wpick(REGIONS),fam=FAMILIES.find(f=>f.id===o.family)||wpick(FAMILIES),g=o.g==='m'||o.g==='f'?o.g:(chance(.5)?'m':'f'),n=genName(g);
  const t={root:rollTalent(),wit:rollTalent(),luck:rollTalent(),heart:rollTalent()};
  const tot=a=>a.reduce((x,y)=>x+y.w,0);
  let p=reg.w/tot(REGIONS)*fam.w/tot(FAMILIES)*.5;for(const k in t)p*=TALENT_W[t[k]-1]/100;
  const era=pick(ERAS);
  const s={v:4,name:n.py,cn:n.cn,sur:n.sur,gender:g,region:reg.id,family:fam.id,t,odds:Math.round(1/p),
    age:-1,health:80+t.root*2,maxHealth:80+t.root*2,happy:70,smarts:clamp(t.wit*8+rint(-10,10),5,95),looks:rint(15,90),
    skill:0,qi:0,arts:[],fame:0,align:clamp(fam.align+(t.heart-5.5)*3,-100,100),money:fam.money,
    sect:null,rank:0,job:null,jobLv:0,jobYears:0,perf:50,ap:0,apMax:0,
    pid:0,people:[],items:[],ill:null,wanted:0,jail:0,retired:false,
    flags:{},seen:{},deeds:[],log:[],alive:true,queue:[],lifespan:55+t.root*2+rint(0,12),realm:0,cause:T('',''),
    era:{cn:era[0],py:era[1]},eraYear:rint(1,18),eraLen:rint(20,42),cal:rint(1,9),nick:null,stock:null,bt:0,hist:[],trail:[reg.id],focus:null,pace:null};
  /* family */
  if(!fam.orphan){
    if(!fam.nofather)s.people.push(mkPerson(s,{rel:'father',sex:'m',sur:n.sur,age:rint(20,42),bond:rint(55,85),lv:fam.martial?rint(30,90):rint(3,20)}));
    s.people.push(mkPerson(s,{rel:'mother',sex:'f',age:rint(17,36),bond:rint(65,95),lv:rint(1,15)}));
    const sib=fam.id==='beggar'?rint(0,1):rint(0,3);
    for(let i=0;i<sib;i++)s.people.push(mkPerson(s,{rel:'sibling',sur:n.sur,age:rint(1,8),bond:rint(40,80),lv:1}));
  }
  return s;
}
