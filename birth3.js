/* 江湖一生 · the first birthday as each family would really keep it, and more ways to describe a family and a birthplace */
'use strict';

/* ---------- 抓周: a custom of families with something to lay out ---------- */
(()=>{const z=INC_BY.zhuazhou;if(!z)return;const w0=z.when;z.when=s=>['merchant','scholar','clan','escort','cult','noble'].includes(s.family)&&(!w0||w0(s))})();
I({id:'zz_poor',force:1,age:[1,1],when:s=>['peasant','hunter'].includes(s.family)&&chance(.5),
 text:(c,s)=>T(`There is not much for a first-birthday grab, but the family scrapes together what they can: ${s.family==='hunter'?'a little wooden bow':'a child-sized hoe'}, a worn brush, three copper coins and a carved wooden sword.`,`抓周没什么好摆的，家里东拼西凑：${s.family==='hunter'?'一张小木弓':'一把小锄头'}、一支秃了毛的笔、三枚铜钱，还有一柄削出来的木剑。`),
 out:[{w:s=>s.t.root,t:T('You grab the wooden sword and bang it on the table. Your father pretends not to be pleased.','你抓起木剑往桌上敲。父亲装作不在意，嘴角却翘了起来。'),fx:{skill:1,flag:'zz_sword'}},
  {w:s=>s.t.wit,t:T('You grab the brush and chew it. The village teacher, passing, says you will read one day.','你抓起毛笔就往嘴里塞。路过的教书先生说，这孩子将来是要识字的。'),fx:{smarts:3}},
  {w:s=>s.t.luck,t:T('You clutch the three coins and will not open your fist. "At least this one will not be poor," your mother says.','你攥紧三枚铜钱，死活不松手。"这孩子将来起码不会穷。"母亲说。'),fx:{money:3}},
  {w:2,t:c=>T('You grab the tool your parents use every day. Everyone laughs, a little sadly.','你抓起了爹娘天天用的那件家伙。大家笑了，笑得有点心酸。'),fx:{happy:2,maxHealth:1}}]});
I({id:'zz_temple',force:1,age:[1,1],when:s=>s.family==='temple'&&chance(.6),
 text:()=>T('Nobody knows your birthday, so the monks count it from the day they found you. For your first year they set out a wooden fish, a sutra, a broom and a staff.','谁也不知道你哪天生的，和尚们就把捡到你的那天当生日。满一岁时，他们摆了木鱼、经卷、扫帚和一根棍。'),
 out:[{w:s=>s.t.heart,t:T('You crawl to the wooden fish and tap it. The old abbot says nothing, but smiles.','你爬过去敲了敲木鱼。老方丈没说话，只是笑了。'),fx:{align:2,happy:2}},
  {w:s=>s.t.root,t:T('You seize the staff, which is twice your size. The martial monks cheer.','你抱住了那根比你还高一倍的棍子。武僧们一片叫好。'),fx:{skill:1}},
  {w:s=>s.t.wit,t:T('You tear a page out of the sutra. The librarian monk forgives you, eventually.','你撕下了一页经文。管经书的和尚后来原谅了你。'),fx:{smarts:3}},
  {w:1,t:T('You grab the broom. "Good," says the abbot. "We are short of sweepers."','你抓起了扫帚。"好，"方丈说，"寺里正缺扫地的。"'),fx:{happy:3}}]});
I({id:'zz_beggar',force:1,age:[1,1],when:s=>s.family==='beggar',
 text:()=>T('Nobody keeps your first birthday.','没人给你过周岁。'),
 out:[{w:2,t:T('Your mother begs half a white steamed bun, the first you have ever tasted, and calls it your birthday.','娘讨来半个白面馒头，是你头一回尝到白面，就算给你过了生日。'),c:'muted',fx:{happy:2}},
  {w:1,t:T('An old beggar carves you a whistle from a reed and says it is the finest present in the city.','一个老乞丐用芦苇给你削了只哨子，说这是全城最好的礼物。'),c:'muted',fx:{happy:3}},
  {w:1,t:T('It is a cold day, and you spend it wrapped against your mother under the bridge. That is the whole celebration.','那天很冷，你裹在娘怀里，在桥洞底下过了一天。这就是全部的庆祝了。'),c:'muted'}]});
/* your own children: a grab only if the house can afford one */
(()=>{const y=yearly;yearly=function(s){if(s&&s.alive)s.people.forEach(k=>{if(k.rel==='child'&&k.age===0&&!(k.done&&k.done.fk_grab)&&s.money<40&&!['merchant','scholar','clan','escort','cult','noble'].includes(s.family)&&chance(.5))(k.done=k.done||{}).fk_grab=s.age});return y(s)}})();

/* ---------- more ways to tell where and to whom you are born ---------- */
const FAM_BIRTH={
 peasant:[['tenant farmers','你生在一户佃农人家。'],['a farming family with one ox and three fields','你生在一户有一头牛、三块田的庄户人家。'],['a family of rice growers','你生在一户种稻的人家。'],['farmers who rent from the temple','你生在一户租种庙田的人家。'],['a family of vegetable growers outside the town wall','你生在城墙根下一户种菜的人家。']],
 hunter:[['a hunter’s family','你生在山脚下一户猎户家。'],['trappers in the deep hills','你生在深山里一户下套子的猎户家。'],['a family that hunts and sells herbs','你生在一户打猎兼采药的人家。'],['a hunter’s family at the edge of the forest','你生在林子边上的一户猎户家。']],
 merchant:[['a merchant family','你生在一户商贾人家。'],['a family of cloth merchants','你生在一户开布庄的人家。'],['the owners of a busy inn','你生在一家生意红火的客栈里。'],['a family that runs a pawnshop','你生在一户开当铺的人家。'],['travelling traders','你生在一户走南闯北的行商人家。']],
 scholar:[['a family of scholars','你生在一户书香门第。'],['a schoolteacher’s family','你生在一位私塾先生的家里。'],['a family of retired officials','你生在一户告老还乡的官宦人家。'],['a family of calligraphers','你生在一户以书法闻名的人家。']],
 beggar:[['a beggar woman','你生在桥洞底下，娘是个乞丐。'],['a beggar woman in a ruined temple','你生在一座破庙里，娘是个讨饭的。'],['a beggar woman under the eaves of a pawnshop','你生在当铺屋檐下，娘是个乞丐。'],['a beggar woman in the reeds by the river','你生在河边的芦苇丛里，娘是个讨饭的。']],
 escort:[['a family that runs an escort agency','你生在一家镖局里。'],['the chief escort’s family','你生在总镖头的家里。'],['a family of escort guards','你生在一户世代走镖的人家。'],['an escort family, the night a convoy came home','你生在一家镖局里，那晚正好有一趟镖平安回来。']],
 temple:[['no one; you were a foundling','你是个弃婴，被人放在竹篮里，搁在一座寺庙门口。'],['no one; you were left on the steps of a mountain monastery','你是个弃婴，被人留在一座山寺的台阶上。'],['no one; you were found in the snow outside a temple wall','你是个弃婴，被人发现在一座寺院墙外的雪地里。']],
 clan:[['an old martial clan','你生在一个古老的武林世家。'],['a clan whose name is carved over a famous gate','你生在一个名号刻在门匾上的武林世家。'],['a martial clan past its glory','你生在一个家道中落的武林世家。'],['a clan of famous swordsmen','你生在一个出过好几位名剑客的世家。']],
 cult:[['a family sworn to the Crimson Sky Cult','你生在一户效忠赤霄教的人家。'],['a family hiding their loyalty to the Crimson Sky Cult','你生在一户暗中效忠赤霄教的人家。'],['the household of a Crimson Sky Cult elder','你生在赤霄教一位长老的家里。']],
 noble:[['a princely house','你生在一座王府里。'],['a marquis’s household','你生在一座侯府里。'],['a branch of the imperial clan','你生在一户皇亲国戚的府第里。']]};
const FAM_MORE={
 peasant:[['The roof leaks in three places, and the family knows exactly where to put the bowls.','屋顶有三处漏雨，家里人闭着眼都知道该把碗放在哪儿。'],['Your mother weaves at night to pay the rent.','母亲夜里织布，好凑够租子。'],['The landlord’s steward visits more often than the neighbours.','地主家的管事，来得比邻居还勤。']],
 hunter:[['Smoked meat hangs from every beam.','每根房梁上都挂着熏肉。'],['Your father can track a deer for three days and never lose it.','父亲追一头鹿，能追三天也不跟丢。']],
 merchant:[['The ledger is the most important book in the house.','家里最要紧的书，是那本账簿。'],['Guests from four provinces sleep under your roof.','你家屋檐下，住过四个省份来的客人。'],['Your grandmother counts coins faster than anyone in town.','你奶奶数铜钱，比镇上谁都快。']],
 scholar:[['There is never quite enough money, but there is always ink.','家里的钱总是不太够，可墨从来不缺。'],['Your father reads aloud to you before you can understand a word.','你还一个字都听不懂，父亲就念书给你听。']],
 beggar:[['Your blanket is a sack that once held rice.','你的被子是一只装过米的麻袋。'],['The beggars of the street take turns holding you so your mother can beg.','街上的乞丐轮流抱着你，好让你娘腾出手去讨饭。']],
 escort:[['The courtyard rings with weapons from dawn.','天一亮，院子里就是兵器的声音。'],['Your cradle sits under the agency’s banner.','你的摇篮就放在镖旗底下。']],
 temple:[['Your first sound is the morning bell.','你听到的第一个声音，是晨钟。'],['A monk who has taken a vow of silence is the one who rocks you to sleep.','哄你睡觉的，是一位发了禁语愿的和尚。']],
 clan:[['The family sword hangs in the hall, and nobody touches it.','家传宝剑挂在堂上，谁也不碰。'],['Three uncles argue over who will teach you first.','三位叔伯为了谁先教你，吵了起来。']],
 cult:[['Strangers come to the back door after dark.','天黑以后，总有生人从后门进来。'],['Your family’s name is not one to say loudly in town.','你家的姓氏，在镇上是不能大声说的。']],
 noble:[['Your wet nurse has a wet nurse of her own, for her own child.','你的奶娘，自己的孩子也有奶娘带。'],['You will not touch the ground with your own feet for a year.','头一年，你的脚几乎没沾过地。']]};
Object.keys(FAM_MORE).forEach(k=>{if(B_FAMILY[k])B_FAMILY[k].push(...FAM_MORE[k])});
const PLACE_MORE={
 central:[['a courtyard house in Luoyang, behind the peony market','洛阳城牡丹市后头的一座小院'],['a canal lane in Bianliang','汴梁城里一条临河的小巷'],['a village on the road to Nanyang','去南阳的大路边一个村子'],['the shade of Dengfeng’s old pagodas','登封古塔林的影子里']],
 jiangnan:[['a garden house in Suzhou with a pond too small for its fish','苏州一座小园子，池塘小得装不下里头的鱼'],['a lane in Hangzhou where the lotus smell reaches from the lake','杭州一条闻得见西湖荷香的巷子'],['a salt merchants’ street in Yangzhou','扬州盐商聚居的一条街'],['a house under the old walls of Jinling','金陵古城墙下的一户人家']],
 shu:[['a bamboo house outside Chengdu where the tea is always on','成都城外一座竹屋，茶从来没断过'],['a stilt house on the cliffs above the river at Yuzhou','渝州江边峭壁上的一座吊脚楼'],['a town at Jiazhou where the great Buddha watches the river','嘉州大佛望着江水的那个镇子']],
 north:[['a mud-brick house in Datong where the wind never stops','大同一座终年风不停的土坯房'],['a coal town near Taiyuan','太原附近一个挖煤的镇子'],['a garrison village below Yanmen Pass','雁门关下的一个屯兵村']],
 west:[['an oasis inn at Dunhuang, among camels and painted caves','敦煌绿洲上的一家客店，周围是骆驼和石窟'],['a walled town at Liangzhou on the horse road','凉州马道上的一座土城'],['the last village before Yumen Pass','玉门关前的最后一个村子']],
 miao:[['a house by the lake at Dali, looking at the snow mountains','大理洱海边一户望得见雪山的人家'],['a lane of Lijiang with water running past every door','丽江一条家家门前流着水的小巷'],['a Miao village where the silver bells ring all day','一个银铃终日作响的苗寨']],
 east:[['a harbour lane in Quanzhou full of foreign sailors','泉州港边一条满是番邦水手的巷子'],['a fishing village outside Dengzhou','登州城外的一个渔村'],['a tea house on the river at Mingzhou','明州江边的一座茶楼']],
 capital:[['a hutong in the Capital, two lanes from the imperial wall','京城一条胡同，离皇城墙只隔两条街'],['a canal town at Tongzhou where the grain barges unload','通州运河边卸漕粮的一个镇子'],['a crowded courtyard in the Capital’s outer city','京城外城一座挤满人家的大杂院']]};
Object.keys(PLACE_MORE).forEach(k=>{if(B_PLACE[k])B_PLACE[k].push(...PLACE_MORE[k])});
/* the opening line picks one of these each time */
(()=>{const b0=birth;birth=function(s){const fam=family(s),V=FAM_BIRTH[fam.id];if(!V)return b0(s);const o={en:fam.en,birth:fam.birth},v=pick(V);fam.en=v[0];fam.birth=v[1];try{return b0(s)}finally{fam.en=o.en;fam.birth=o.birth}}})();
