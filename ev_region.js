/* 江湖一生 · regional life (customs, landscapes and hazards of each region) and later life and legacy (45–90) */
'use strict';
const RGW=['wander'];
const inRg=r=>s=>s.region===r;
const rgPN=p=>T(p.n.py,p.n.cn);
function rgDie(s,p,cause){if(!p||!p.alive)return;p.alive=false;p.diedAt=s.age;p.cause=cause||T('old age','寿终正寝');p.causeSet=1;onDeath(s,p)}

/* ======================================================================
   (A) REGIONAL LIFE
   ====================================================================== */

/* ---------- central plains ---------- */
I({id:'rg_flood',age:[12,80],cd:14,w:1.2,tags:RGW,when:inRg('central'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,age:rint(55,75)});return c},
 text:c=>T(`After a week of rain the Yellow River is the colour of strong tea and running level with the dike. The village elder, ${c.npc.en}, is ringing the gong: the earthworks by the old ferry are starting to weep.`,`连下了七天雨，黄河水浓得像酽茶，已经快漫上堤顶。村里的老人${c.npc.zh}敲着铜锣满村喊：老渡口那段堤开始渗水了。`),
 opts:[{l:T('Carry sandbags all night','连夜扛沙袋'),out:[
   {w:s=>1+power(s)/50+s.t.heart*.15,t:T('By dawn your shoulders are raw and the dike is still standing. The village cooks you a pot of noodles the size of a cartwheel.','天亮时你的肩膀磨得血肉模糊，堤还立着。村里给你下了一锅车轮那么大的面。'),c:'good',fx:{align:4,fame:2,hurt:[2,6],cause:T('a night on the dike','守堤一夜')}},
   {w:1.2,t:T('The dike gives way twenty paces from you. You are swept half a mile before a willow catches you by the collar.','大堤在你身边二十步外决了口。你被冲出去半里地，才被一棵柳树勾住了衣领。'),c:'bad',fx:{hurt:[10,22],cause:T('the Yellow River in flood','黄河决堤'),ill:'cold',align:2}}]},
  {l:T('Get the old and the children onto the temple hill','把老人孩子送上庙山'),out:[
   {w:s=>1+s.smarts/40+s.fame/50,t:T('People listen to you. When the water comes, everyone you warned is sitting on the temple steps, wet and alive.','大家肯听你的。洪水来时，你喊过的人都坐在庙前台阶上，浑身湿透，一个不少。'),c:'good',fx:{align:5,fame:3,happy:3}},
   {w:1,t:T('Half the village refuses to leave their pigs. You save who you can and lie awake counting the rest.','半个村子舍不得自家的猪，不肯走。你救了能救的，夜里睁着眼数那些没走的人。'),c:'muted',fx:{align:3,happy:-5}}]},
  {l:T('Pack your silver and leave','收拾银子先走'),out:[
   {w:s=>1+s.t.luck*.15,t:T('You are on high ground before the first breach. Nobody stops you. Nobody waves, either.','第一处决口之前，你已经站在高处。没人拦你，也没人跟你招手。'),c:'muted',fx:{align:-3}},
   {w:1,t:T('You are too slow anyway. The river takes your bundle and leaves you a mouthful of mud.','你还是慢了一步。河水卷走了你的包袱，只给你留了一嘴泥。'),c:'bad',fx:{align:-3,money:-30,hurt:[3,8],cause:T('the Yellow River in flood','黄河决堤')}}]}]});

I({id:'rg_templefair',age:[6,90],cd:6,w:1,tags:['town'],when:inRg('central'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:24,age:rint(45,75)});return c},
 text:c=>T(`The great temple fair: incense smoke so thick the stone lions look like they are breathing, sugar figures, a man swallowing swords, and a fortune teller, ${c.npc.en}, who calls out that your face has “a story in it”.`,`大庙会：香火浓得石狮子都像在喘气，吹糖人的、吞宝剑的挤成一片。算命先生${c.npc.zh}冲你招手，说你这张脸“有故事”。`),
 opts:[{l:T('Draw a fortune stick','求一支签'),cost:5,out:[
   {w:s=>1+s.t.luck*.2,t:T('Upper-upper. The fortune teller reads it twice and gives you your coins back, for luck. You walk taller all day.','上上签。算命的看了两遍，把卦钱退给你，说沾沾喜气。你一整天走路都带风。'),c:'good',fx:{happy:5}},
   {w:1,t:T('Lower-lower. “Beware of water and of friends who borrow,” he says. You think about it far more than you want to.','下下签。“当心水，当心借钱的朋友。”他说。你琢磨得比自己想的久多了。'),c:'muted',fx:{happy:-3,smarts:1}}]},
  {l:T('Push through the crowd to the main hall','挤进正殿上香'),out:[
   {w:1,t:T('You light your incense. Something in the quiet of the hall stays with you for a week.','你上了香。殿里的那份清静，在你心里留了好几天。'),c:'good',fx:{happy:3,align:1}},
   {w:s=>2-s.smarts/60,t:T('Somewhere between the sugar figures and the sword swallower, your purse leaves you.','在吹糖人和吞宝剑之间的某个地方，你的钱袋离你而去。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,rint(10,40)))}}]}]});

/* ---------- jiangnan: the stolen silk (big) ---------- */
I({id:'rg_silk1',age:[16,60],cd:12,w:1.8,tags:RGW,when:inRg('jiangnan'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:12,sex:'f',age:rint(24,40)});c.lv=PW(.95,4)(s);return c},
 text:c=>T(`Before dawn on the canal, a silk house’s barge drifts past with its rope cut and its hold empty. On the bank, ${c.npc.en}, who runs the house, is white with fury. “Forty bolts of brocade for the autumn tribute. If they are not back in three days, my family is finished.”`,`天还没亮，运河上漂过一条丝行的货船，缆绳被割断，舱里空空如也。岸上，掌管丝行的${c.npc.zh}气得脸色发白：“四十匹秋贡的织锦。三天之内找不回来，我家就完了。”`),
 opts:[{l:T('Take a boat and follow the drift','借条船顺水去追'),out:[
   {w:s=>1+power(s)/60,t:T('You find scrape marks on a bridge pier and a sodden thread of gold. They went east, into the water lanes.','你在一座桥墩上找到刮痕，还有一缕湿透的金线。他们往东去了，钻进了水巷。'),c:'muted',next:'rg_silk2',keep:1},
   {w:1,t:T('The fog is so thick you row in a circle for an hour. When it lifts, a fisherman points the way, laughing at you.','雾太大，你划了一个时辰的圈子。雾散了，一个渔翁笑着给你指了路。'),c:'muted',fx:{happy:-1},next:'rg_silk2',keep:1}]},
  {l:T('Ask the boat folk what they saw','向船家打听'),out:[
   {w:s=>s.smarts/25+s.fame/50,t:T('An old boatwoman, chewing melon seeds, tells you whose boat was out without lanterns last night. You know exactly where to go.','一个嗑瓜子的老船娘告诉你，昨夜谁家的船没点灯出过门。你一下子知道该去哪了。'),c:'good',fx:{f:(s,c)=>{c.adv=1}},next:'rg_silk2',keep:1},
   {w:1.2,t:T('The boat folk close ranks against a stranger. Nobody saw anything, and nobody will.','船家们对外乡人一个口径：什么都没看见，以后也不会看见。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Wish her luck','祝她好运'),out:[
   {w:1,t:T('A month later the silk house is shuttered and its looms are for sale.','一个月后，那家丝行关了门，织机都挂牌出售。'),c:'muted',fx:{align:-1}},
   {w:s=>s.t.luck*.15,t:T('She finds the silk herself, and tells everyone in the market how useless you were.','她自己把丝找了回来，还在集市上跟人说你有多不中用。'),c:'muted',fx:{fame:-1}}]}]});
I({id:'rg_silk2',only:1,noThread:1,
 text:c=>T(`Under a hump-backed stone bridge, in a water lane barely wider than a boat, three men are passing bundles of brocade up into a warehouse window. ${c.adv?'You are here before they have finished.':'They are nearly done.'}`,`一座驼背石桥底下，水巷窄得只容一条船。三个汉子正把一捆捆织锦往仓房窗口里递。${c.adv?'你赶到时他们才搬了一半。':'他们差不多快搬完了。'}`),
 opts:[{l:T('Jump down onto their boat','从桥上跳下去'),fight:FG((s,c)=>c.lv*(c.adv?.85:1),'injury',T('Under the stone bridge','石桥之下'),T('silk thieves','盗丝贼'),()=>T('the silk thieves','盗丝贼')),
   win:[{w:2,t:T('Two go into the canal, one goes through the window. Inside, among the bales, you find something you did not expect.','两个落了水，一个撞进了窗户。仓里那堆丝绸中间，你看到了意想不到的东西。'),c:'good',next:'rg_silk3',keep:1},
    {w:1,t:T('You win, but a boathook opens your arm. You bind it with a strip of tribute brocade and go inside.','你赢了，胳膊却被船钩豁开一道口子。你扯了一截贡锦把伤口裹上，钻进仓房。'),c:'muted',fx:{f:s=>addCond(s,'wound',1)},next:'rg_silk3',keep:1}],
   lose:[{w:1,t:T('You end up in the canal with a split lip. When you climb out, boat, men and silk are gone.','你被打进河里，嘴角开了花。爬上岸时，船、人和丝都没了。'),c:'bad',fx:{hurt:[8,18],cause:T('a fight in a water lane','水巷斗殴'),ill:'cold'}},
    {w:1,t:T('They leave you tied to the bridge pier for the morning market to find. Jiangnan will talk about this for a while.','他们把你绑在桥墩上，留给赶早市的人发现。这事够江南人说上一阵子了。'),c:'bad',fx:{fame:-3,happy:-4}}]},
  {l:T('Slip into the water and cut their boat loose','潜下水去割他们的缆绳'),out:[
   {w:s=>s.t.luck*.2+s.smarts/40,t:T('Their boat drifts off with half the silk. While they curse and wade, you slip into the warehouse.','船载着一半丝绸漂走了。趁他们骂骂咧咧下水去追，你溜进了仓房。'),c:'good',next:'rg_silk3',keep:1},
   {w:1,t:T('The canal in autumn is colder than any water has a right to be. You cut the rope, and also your hand, and you shake for a week.','秋天的运河水冷得没天理。缆绳割断了，手也割破了，你哆嗦了一个星期。'),c:'bad',fx:{ill:'fever',hurt:[4,10],cause:T('a cold canal','寒夜运河')}}]}]});
I({id:'rg_silk3',only:1,noThread:1,
 text:c=>T(`The warehouse belongs to ${c.npc.en}’s own cousin. In his ledger, the forty bolts were never declared for tribute at all: half of them were going to be sold under the table, by both of them.`,`这间仓房是${c.npc.zh}的亲表兄的。账本上写得明白：这四十匹锦根本没全报进贡单，有一半本来就打算私下卖掉——两个人都有份。`),
 opts:[{l:T('Bring the silk back to her and say nothing','把丝送回去，一字不提'),out:[
   {w:s=>1+s.t.luck*.15,t:T('She pays you handsomely and looks at you a long moment. She knows you know.','她重重谢了你，盯着你看了好一会儿。她知道你知道。'),c:'good',fx:{money:[80,160],fame:1}},
   {w:1,t:T('She pays you, then has a quiet word with the guild. Somehow, no silk house in town will hire you again.','她付了钱，又悄悄跟行会打了招呼。不知怎么的，镇上再没有丝行肯雇你。'),c:'muted',fx:{money:60,fame:-1}}]},
  {l:T('Take the ledger to the magistrate','把账本交给县衙'),out:[
   {w:s=>1+s.align/40+s.fame/50,t:T('Both cousins are fined into poverty. The weavers they cheated buy you wine for a month.','表兄妹俩被罚得倾家荡产。被他们克扣过的织工们请你喝了一个月的酒。'),c:'good',fx:{align:6,fame:3,happy:2}},
   {w:1,t:T('The magistrate takes the ledger, and a gift from the silk house, and the case quietly dies. Her people remember your face.','县官收了账本，也收了丝行的礼，案子不了了之。她的人记住了你的脸。'),c:'bad',fx:{align:3,enemy:1}}]},
  {l:T('Keep a few bolts as your fee','留几匹锦当酬劳'),out:[
   {w:s=>1+s.smarts/40,t:T('Nobody counts tribute silk that was never declared. You sell three bolts in another town.','没报过贡的丝，谁也不会去点数。你在别的镇子卖了三匹。'),c:'muted',fx:{money:[120,200],align:-4}},
   {w:1,t:T('The brocade has the imperial weave in it. The first shop you try calls the constables.','那锦里织着贡纹。你头一家去卖，掌柜就喊来了捕快。'),c:'bad',fx:{money:40,align:-4,wanted:1}}]}]});

I({id:'rg_canalboat',age:[10,85],cd:8,w:1,tags:RGW,when:inRg('jiangnan'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:16,sex:'f',age:rint(30,60)});return c},
 text:c=>T(`A slow passenger boat through the water towns, rain ticking on the awning. The boatwoman, ${c.npc.en}, sells you a bowl of wine-soaked crabs and asks if you want to hear something sad or something funny.`,`一条慢悠悠的客船穿过水乡，雨点敲着船篷。船娘${c.npc.zh}卖给你一碗醉蟹，问你想听个伤心的，还是好笑的。`),
 opts:[{l:T('Something sad','伤心的'),out:[
   {w:s=>1+s.t.heart*.2,t:T('It is about a girl who waited at a bridge for forty years. You stare at the rain long after she finishes.','讲的是一个在桥头等了四十年的姑娘。她讲完了，你还盯着雨看了很久。'),c:'muted',fx:{happy:-1,smarts:1}},
   {w:1,t:T('Halfway through, she bursts out laughing at her own story, and so do you.','讲到一半，她自己先笑场了，你也跟着笑了起来。'),c:'good',fx:{happy:4}}]},
  {l:T('Something funny','好笑的'),out:[
   {w:1,t:T('A magistrate, a goose and a borrowed hat. You laugh so hard you nearly tip the boat.','一个县太爷，一只鹅，一顶借来的帽子。你笑得差点把船弄翻。'),c:'good',fx:{happy:5}},
   {w:s=>2-s.t.luck*.15,t:T('You laugh so hard you do tip the boat. The crabs survive. Your dignity does not.','你笑得太厉害，真把船弄翻了。醉蟹没事，你的面子没了。'),c:'muted',fx:{happy:2,ill:'cold'}}]}]});

/* ---------- shu ---------- */
I({id:'rg_hotpot',age:[12,85],cd:6,w:1.8,tags:['town'],when:inRg('shu'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:26,age:rint(35,60)});return c},
 text:c=>T(`A riverside hotpot stall, red oil boiling over a heap of dried chillies and peppercorns. ${c.npc.en}, the owner, has a bet running: finish a bowl of the “Nine Hells” broth without water and eat free for a month.`,`江边一家火锅摊，红油在一堆干辣椒和花椒里翻滚。掌柜${c.npc.zh}立了个赌：不喝一口水吃完一碗“九重地狱”，一个月饭钱全免。`),
 opts:[{l:T('Take the bet','接下赌约'),out:[
   {w:s=>1+s.qi/40+s.t.heart*.15,t:T('Sweat runs into your eyes and your lips stop being lips. You finish it. The whole stall bangs the tables for you.','汗水流进眼睛，嘴唇早就不是自己的了。可你吃完了。整个摊子的人拍着桌子给你叫好。'),c:'good',fx:{happy:5,fame:1,money:15}},
   {w:1.2,t:T('Four mouthfuls in, you are weeping. On the sixth, you grab the teapot and drink straight from the spout.','吃到第四口你就哭了。第六口，你抓起茶壶对着壶嘴猛灌。'),c:'muted',fx:{happy:-1,money:-5}},
   {w:.5,t:T('You win the bet and lose the next three days to your stomach.','赌是赢了，接下来三天你都交给了肚子。'),c:'muted',fx:{money:15,hurt:[3,7],cause:T('a bowl of Nine Hells broth','一碗九重地狱')}}]},
  {l:T('Order a mild one and watch','点个微辣，看热闹'),out:[
   {w:1,t:T('A Shu “mild” is still enough to make your ears ring. You watch a burly escort guard lose the bet in tears.','蜀地的“微辣”照样辣得你耳朵嗡嗡响。你看着一个膀大腰圆的镖师哭着输了赌。'),c:'good',fx:{happy:3}},
   {w:s=>s.smarts/40,t:T('Watching closely, you notice the owner keeps a pot of honey water under the counter for the ones about to faint. Shu people are kinder than their food.','你看得仔细：掌柜柜台底下备着一罐蜂蜜水，专给快晕过去的人。蜀人心比菜软。'),c:'good',fx:{happy:2,smarts:1}}]}]});

I({id:'rg_plank1',age:[14,70],cd:10,w:2,tags:RGW,when:inRg('shu'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:0,sex:'m',age:rint(30,55)});return c},
 text:c=>T(`On the plank road, a ledge of wooden beams driven into a sheer cliff with the river roaring far below, a salt porter named ${c.npc.en} is ahead of you with a load twice his size. A beam cracks under his foot.`,`栈道就是钉在绝壁上的一排木梁，脚下很远处江水在吼。前面一个背盐的挑夫${c.npc.zh}，背篓比人还大。他脚下一根木梁“咔”地裂了。`),
 opts:[{l:T('Grab him','一把拽住他'),out:[
   {w:s=>1+power(s)/45,t:T('You catch his basket strap and hold. For a long breath the two of you hang there. Then he is back on the planks, shaking.','你抓住了他的背带，死死撑住。两个人悬了好长一口气，他才重新踩回木板上，浑身发抖。'),c:'good',next:'rg_plank2',keep:1},
   {w:1,t:T('You catch him, but the beam under you goes too. You both end up on the ledge below, bruised and alive.','你拉住了他，可你脚下的木梁也断了。两人一起摔到下一层崖台上，鼻青脸肿，好歹活着。'),c:'muted',fx:{hurt:[8,16],cause:T('a fall on the plank road','栈道失足')},next:'rg_plank2',keep:1}]},
  {l:T('Shout for him to drop the load','喊他扔掉背篓'),out:[
   {w:s=>1+s.smarts/40,t:T('He shrugs off the basket and leaps. A season’s salt goes into the river. He sits on the planks and swears at the gorge.','他甩掉背篓一跃而过。一季的盐全进了江里。他坐在木板上，冲着峡谷骂了半天。'),c:'muted',fx:{align:1},next:'rg_plank2',keep:1},
   {w:1,t:T('He will not let go of the salt. He and the basket go over together. You hear the river take them.','他死也不肯撒手。人和背篓一起掉了下去。你听着江水把他们吞没。'),c:'bad',fx:{happy:-8,f:s=>addCond(s,'shaken',1)}}]}]});
I({id:'rg_plank2',only:1,noThread:1,
 text:c=>T(`At the next waystation, a hut clinging to the cliff, ${c.npc.en} sits by the fire, chewing on pickled chillies. “Every porter on this road owes the cliff a life. Today it wasn’t mine. Let me give you something.”`,`下一个歇脚的驿棚挂在崖壁上。${c.npc.zh}坐在火边嚼着泡椒：“这条路上的挑夫，个个都欠悬崖一条命。今天不是我的。我得给你点什么。”`),
 opts:[{l:T('Ask about the road ahead','问前面的路'),out:[
   {w:s=>1+s.smarts/40,t:T('He tells you which beams the porters never trust and where the monkeys steal food. On that road, it is worth more than silver.','他告诉你哪几段木梁挑夫们从来不踩，哪里有猴子抢吃的。在这条路上，这比银子值钱。'),c:'good',fx:{smarts:2,maxHealth:1}},
   {w:1,t:T('He gets drunk on corn liquor and tells you about his three wives instead, none of whom know about each other.','他喝多了苞谷酒，倒跟你讲起了他的三个老婆，三个人互相都不知道。'),c:'muted',fx:{happy:3}}]},
  {l:T('Accept his gift of salt','收下他的盐'),out:[
   {w:1,t:T('A brick of salt wrapped in bamboo leaf. You sell it in the next town for more than you expected.','一块竹叶包着的盐砖。你在下一个镇上卖了，比想的值钱。'),c:'good',fx:{money:[20,45]}},
   {w:s=>s.t.heart*.2,t:T('You refuse it in the end. He makes you a friend instead, which on the plank roads is the same as kin.','你最后还是推了。他便认了你这个朋友——在栈道上，朋友和亲人是一回事。'),c:'good',fx:{meet:'friend',bond:65,align:2}}]}]});

/* ---------- north ---------- */
I({id:'rg_horsefair',age:[14,75],cd:8,w:1.2,tags:['town','wander'],when:inRg('north'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:17,age:rint(30,60)});return c},
 text:c=>T(`The autumn horse fair outside the frontier fort: dust, shouting, a thousand horses steaming in the cold. A trader called ${c.npc.en} leads out a shaggy steppe mare and names a price that seems too low.`,`边堡外的秋季马市：尘土飞扬，吆喝声震天，上千匹马在寒气里冒着白汽。马贩子${c.npc.zh}牵出一匹毛蓬蓬的草原母马，开的价低得可疑。`),
 opts:[{l:T('Check her teeth and legs first','先看牙口，再摸腿'),cost:40,out:[
   {w:s=>1+s.smarts/35,t:T('You find nothing wrong because there is nothing wrong. He needed silver before the snow came. She is a fine, stubborn horse.','你没挑出毛病，因为本来就没毛病。他只是想赶在下雪前换点银子。是匹好马，脾气倔得很。'),c:'good',fx:{item:'horse',happy:3}},
   {w:1,t:T('Her teeth are fine. Her hooves are painted. She goes lame on the road home, and you sell her to a farmer for a quarter of the price.','牙口没问题，蹄子是染过色的。回去路上她就瘸了，你只好四分之一的价钱卖给了一个庄稼汉。'),c:'bad',fx:{money:10,happy:-3}}]},
  {l:T('Bargain like a northerner','学北方人砍价'),out:[
   {w:s=>s.fame/30+s.smarts/50+.5,t:T('Two hours, three bowls of milk liquor and one fake walk-away later, you shake hands at half his price. He seems to respect you for it.','磨了两个时辰，喝了三碗奶酒，假装走了一回，最后半价成交。他倒像是更看得起你了。'),c:'good',fx:{money:-20,item:'horse'}},
   {w:1,t:T('You drink the milk liquor. You do not remember the bargaining. You wake with no horse and a headache the size of the steppe.','奶酒你是喝了，砍价的事全不记得。醒来时马没有，头疼得像整片草原压在脑门上。'),c:'muted',fx:{money:-10,happy:-2}}]},
  {l:T('Just watch the horses','只看看马'),out:[
   {w:1,t:T('A herd boy rides a wild colt standing on its back. You will remember it when you are old.','一个放马的少年站在野马驹背上骑了一圈。你老了以后还记得那一幕。'),c:'good',fx:{happy:3}},
   {w:s=>2-s.t.luck*.2,t:T('A loose stallion kicks you clean over a fence.','一匹脱缰的儿马一蹄子把你踢过了栅栏。'),c:'bad',fx:{hurt:[5,12],cause:T('a kick at the horse fair','马市上挨了一蹄子')}}]}]});

I({id:'rg_raid1',age:[16,60],cd:12,w:1.9,tags:RGW,when:inRg('north'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:15,age:rint(20,45)});c.lv=PW(1,5)(s);return c},
 text:c=>T(`Black smoke over the next valley. ${c.npc.en}, a hunter from the village there, gallops up with an arrow in his saddle. “Steppe riders. Twenty, maybe more. They’re taking the women and the herds north.”`,`隔壁山谷升起黑烟。那村里的猎户${c.npc.zh}打马奔来，马鞍上还插着一支箭：“草原上的马贼！二十来个，只多不少。正把女人和牲口往北赶。”`),
 opts:[{l:T('Ride after them','追上去'),out:[
   {w:s=>1+s.t.heart*.15,t:T('You ride north through the night, following the trampled snow.','你连夜往北，顺着被踩烂的雪地追去。'),c:'muted',next:'rg_raid2',keep:1},
   {w:s=>1+s.t.luck*.1,t:T('Halfway there, others join you: two herdsmen and a deserter with a rusty sword. Better than nothing.','半路上又来了几个人：两个牧人，一个拿着锈刀的逃兵。聊胜于无。'),c:'muted',fx:{f:(s,c)=>{c.lv*=.85}},next:'rg_raid2',keep:1}]},
  {l:T('Ride to the fort for soldiers','去边堡搬兵'),out:[
   {w:s=>s.fame/30+s.smarts/40+.4,t:T('The captain knows your name and turns out his cavalry. They catch the raiders at the river. Most of the captives come home.','守将知道你的名号，当即点了骑兵。马贼在河边被截住，大半人质回了家。'),c:'good',fx:{fame:2,align:4}},
   {w:1.2,t:T('The captain will not move without orders from the prefecture. By the time they come, the riders are three days into the steppe.','守将说没有府里的军令不能出兵。等军令到了，马贼已经进草原三天了。'),c:'bad',fx:{happy:-5,align:1}}]},
  {l:T('It is not your fight','这不是你的事'),out:[
   {w:1,t:T('You stay away. That winter, the village is half-empty, and nobody there will sell you anything.','你没去。那个冬天，村子空了一半，村里人什么东西都不肯卖给你。'),c:'muted',fx:{align:-3}},
   {w:s=>s.t.luck*.15,t:T('Others go instead. They come back with most of the captives, and a song that does not mention you.','别人去了，救回了大半人质，还编了首歌，歌里没有你。'),c:'muted',fx:{align:-2}}]}]});
I({id:'rg_raid2',only:1,noThread:1,
 text:c=>T('At dawn you find their camp in a frozen gully: tethered horses, a smoking fire, captives roped together. Their leader is a big man in a wolfskin, already on his feet, already looking at you.','天亮时，你在一条结冰的沟里找到他们的营地：拴着的马，冒烟的火堆，绳子串起的人质。头领是个披狼皮的大汉，已经站了起来，正盯着你。'),
 opts:[{l:T('Challenge the leader','挑战头领'),fight:FG((s,c)=>c.lv,'injury',T('The frozen gully','冰沟之战'),T('a steppe raider','草原马贼'),()=>T('the wolfskin chief','狼皮头领')),
   win:[{w:2,t:T('He falls in the snow. The others mount and scatter, but one, a boy of fifteen, is too slow.','他倒在雪地里。其余的人上马四散，只有一个十五六岁的少年慢了一步。'),c:'good',fx:{fame:3},next:'rg_raid3',keep:1},
    {w:1,t:T('You win, but the cold has gone into your bones. The others flee; a boy is left behind, tangled in his own reins.','你赢了，寒气却钻进了骨头。其余的人跑了，一个少年被自己的缰绳缠住，落在后面。'),c:'muted',fx:{ill:'rheum'},next:'rg_raid3',keep:1}],
   lose:[{w:1,t:T('His axe handle breaks your arm. They leave you in the snow, which out here is meant as a kindness.','他的斧柄砸断了你的胳膊。他们把你扔在雪地里——在这地方，这已经算是手下留情。'),c:'bad',fx:{f:s=>addCond(s,'fracture',2),hurt:[10,20],cause:T('a steppe raider’s axe','马贼的斧头')}},
    {w:1,t:T('You lose, but while they deal with you, half the captives cut their ropes and run.','你输了。可他们对付你的工夫，一半人质割断绳子跑掉了。'),c:'muted',fx:{hurt:[10,18],cause:T('a steppe raider’s axe','马贼的斧头'),align:4}}]},
  {l:T('Stampede their horses at night','趁夜惊散马群'),out:[
   {w:s=>s.smarts/30+s.t.luck*.1,t:T('You cut the tethers and fire a tent. Horses everywhere, men everywhere. When it settles, the captives are free and one raider is sitting in the snow, unhorsed.','你割断缰绳，点着了一顶帐篷。满地是马，满地是人。等安静下来，人质都解了绳，一个马贼坐在雪地里，马早跑了。'),c:'good',next:'rg_raid3',keep:1},
   {w:1,t:T('A dog barks. They are on you before you reach the horses.','一条狗叫了起来。你还没摸到马群，他们就扑了上来。'),c:'bad',fx:{hurt:[12,22],cause:T('a raiders’ camp','马贼营地'),f:s=>addCond(s,'wound',1)}}]}]});
I({id:'rg_raid3',only:1,noThread:1,
 text:c=>T(`The boy they left behind turns out to be the chief’s son. The freed villagers, and ${c.npc.en}, want him dead. He stares at you without a word of your language.`,`落下的那个少年，原来是头领的儿子。被救的村民，还有${c.npc.zh}，都要他偿命。他一句汉话也不会，只是瞪着你。`),
 opts:[{l:T('Give him to the villagers','交给村民'),out:[
   {w:1,t:T('You do not watch. The village feeds you for a week and the hunter calls you brother.','你没去看。村里供了你一个星期的饭，猎户管你叫兄弟。'),c:'muted',fx:{align:-2,meet:'sworn',bond:60}},
   {w:s=>s.t.heart*.15,t:T('You do not watch, but you hear it. For years afterwards, you hear it.','你没去看，可你听见了。此后好些年，你都还能听见。'),c:'bad',fx:{happy:-6,f:s=>addCond(s,'shaken',1)}}]},
  {l:T('Let him go','放他走'),out:[
   {w:s=>1+s.t.luck*.2+s.align/50,t:T('Next spring, a dozen fine horses are found tethered outside the village with no one near them. No raids come that year, or the next.','第二年开春，村外拴着十几匹好马，周围一个人影也没有。那一年没有马贼来，第二年也没有。'),c:'gold',fx:{align:6,fame:3,item:'horse'}},
   {w:1,t:T('The villagers never forgive you. And you are never quite sure he did not ride with the raiders who came back in autumn.','村民再也没原谅你。秋天马贼又来了，你始终说不准里面有没有他。'),c:'muted',fx:{align:2,fame:-2}}]},
  {l:T('Ransom him for the stolen herds','拿他换回被抢的牲口'),out:[
   {w:s=>s.smarts/30+s.fame/50,t:T('You send a captive rider north with terms. Ten days later every stolen animal comes back down the valley, and the boy rides home.','你放一个俘虏回去传话。十天后，被抢的牲口一头不少地赶回了山谷，少年也骑马回去了。'),c:'good',fx:{align:4,fame:2,money:[30,60]}},
   {w:1,t:T('The answer comes back as an arrow with a lock of the messenger’s hair. The boy is kept as a herdsman, and a hostage.','回信是一支箭，箭上系着信使的一缕头发。少年被留下放牧，也当人质。'),c:'muted',fx:{align:1}}]}]});

/* ---------- west ---------- */
I({id:'rg_sandstorm',age:[14,75],cd:10,w:2,tags:RGW,when:inRg('west'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:23,age:rint(35,60)});return c},
 text:c=>T(`Three days out from the oasis, the camels kneel and will not get up. The Persian caravan master, ${c.npc.en}, looks at a yellow wall rising on the horizon and says one word: “Down.”`,`离开绿洲第三天，骆驼全跪了下来，怎么也不肯起身。波斯商队首领${c.npc.zh}望着天边升起的一道黄墙，只说了一个字：“趴下。”`),
 opts:[{l:T('Do exactly what the camels do','骆驼怎么做，你就怎么做'),out:[
   {w:s=>1+s.smarts/40+s.t.luck*.1,t:T('You lie in the lee of a camel with your face in your sleeve for half a day. When you dig yourself out, the whole caravan is alive, and the dunes have moved.','你躲在骆驼背风处，脸埋在袖子里趴了半天。挖出来时，整支商队都还活着，沙丘却挪了地方。'),c:'good',fx:{happy:2,smarts:1}},
   {w:1,t:T('The sand gets into everything: your eyes, your lungs, your soul. You cough for a month.','沙子钻进一切：眼睛、肺、魂。你咳了一个月。'),c:'bad',fx:{ill:'lung',hurt:[4,10],cause:T('a desert sandstorm','大漠风沙')}}]},
  {l:T('Go back for a straggler','回去找掉队的人'),out:[
   {w:s=>1+power(s)/60+s.t.heart*.15,t:T('You find the cook’s boy by his crying and drag him back by the collar. The caravan master gives you a silver bowl from his own pack.','你循着哭声找到了伙夫家的小子，揪着领子拖了回来。首领从自己的行囊里拿出一只银碗送你。'),c:'gold',fx:{align:5,money:[50,90],fame:1}},
   {w:1,t:T('You find him, but lose the caravan. Two days later, half-blind and cracked with thirst, you both stumble into a well-keeper’s hut.','人找到了，商队却丢了。两天后，你们俩眼睛半瞎，嗓子渴得开裂，跌跌撞撞摸进一个守井人的小屋。'),c:'muted',fx:{align:4,hurt:[10,20],cause:T('thirst in the desert','大漠焦渴'),looks:-2}}]}]});

I({id:'rg_oasis',age:[10,85],cd:7,w:2,tags:['town','wander'],when:inRg('west'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([23,20,19]),age:rint(12,60)});return c},
 text:c=>T(`In the oasis town the grapes are drying on lattices of mud brick and the canals run underground. At the well, ${c.npc.en} is arguing with a caravan’s camel men: they want to water two hundred animals before the town’s own people.`,`绿洲城里，葡萄晾在土坯镂空的晾房里，水渠都走在地下。井边，${c.npc.zh}正和商队的驼夫们争得面红耳赤：他们要先饮两百头牲口，再让城里人打水。`),
 opts:[{l:T('Settle it','出面说和'),out:[
   {w:s=>s.fame/30+s.smarts/40+.4,t:T('You get them to agree: people at dawn, camels at noon, and the caravan pays for the well rope. Everyone grumbles, which means it is fair.','你让双方定下规矩：天亮人先打水，正午再饮骆驼，商队出井绳钱。人人都嘟囔，说明这事公道。'),c:'good',fx:{fame:2,align:2,smarts:1}},
   {w:1,t:T('The camel men think you are taking sides and push you into the trough.','驼夫们觉得你偏袒，把你推进了饮马槽。'),c:'muted',fx:{happy:-2,fame:-1}}]},
  {l:T('Buy a bag of raisins and stay out of it','买一袋葡萄干，不掺和'),cost:5,out:[
   {w:1,t:T('The raisins are green and sweet and you finish the bag before sunset.','葡萄干是绿的，甜得发腻，太阳还没落山你就吃完了一袋。'),c:'good',fx:{happy:3}},
   {w:s=>s.t.luck*.15,t:T('The seller, pleased you did not interfere, slips you a jar of grape wine as well. It is extremely strong.','卖葡萄干的见你不多事，又塞给你一罐葡萄酒。劲儿大得吓人。'),c:'good',fx:{happy:5}}]}]});

/* ---------- miao borderlands ---------- */
I({id:'rg_gu1',age:[16,60],cd:12,w:2.2,tags:RGW,when:inRg('miao'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([20,27,18]),sex:'f',age:rint(20,60)});return c},
 text:c=>T(`You eat a bowl of sour fish soup in a stilt house and pay too little, laughing that it is all you have. That night something crawls under your skin. In the morning there is a dark line running from your wrist toward your heart. The cook, ${c.npc.en}, is nowhere to be found.`,`你在一座吊脚楼里吃了碗酸汤鱼，付钱时少给了，还笑说身上就这么多。当夜，皮肤底下像有东西在爬。第二天早上，一道黑线从手腕往心口爬。煮汤的${c.npc.zh}，不见了踪影。`),
 opts:[{l:T('Go looking for her','去找她'),out:[
   {w:s=>1+s.smarts/40+s.fame/60,t:T('A child points you up the valley to her family’s rice terraces.','一个小孩给你指了路：她家的梯田在山谷上头。'),c:'muted',next:'rg_gu2',keep:1},
   {w:1,t:T('Three villages say they have never heard of her. The fourth looks at your wrist and sends you up the valley.','三个寨子都说没听过这个人。第四个寨子的人看了看你的手腕，让你往山谷上头去。'),c:'muted',fx:{hurt:[3,8],cause:T('Gu poison','蛊毒')},next:'rg_gu2',keep:1}]},
  {l:T('Force it out with inner energy','运功逼毒'),out:[
   {w:s=>s.qi/25+s.t.root*.1,t:T('You sit for two days and two nights. On the third morning you vomit something black and wriggling into the fire. You never tell anyone what it looked like.','你坐了两天两夜。第三天早上，你吐出一团黑乎乎还在扭动的东西，扔进了火里。它长什么样，你一辈子没跟人说过。'),c:'good',fx:{qi:2,hurt:[5,10],cause:T('Gu poison','蛊毒')}},
   {w:1.3,t:T('The line stops at your elbow, but it does not go back. Your hand is never quite warm again.','黑线停在了手肘，却再没退回去。从此你那只手总是暖不过来。'),c:'bad',fx:{f:s=>addCond(s,'poison',2),maxHealth:-2}}]}]});
I({id:'rg_gu2',only:1,noThread:1,
 text:c=>T(`${c.npc.en} is weeding a terrace in the rain. She looks at your wrist, and at you. “In these mountains, you don’t cheat a woman who keeps a gu jar.”`,`${c.npc.zh}正在雨里薅梯田的草。她看看你的手腕，又看看你：“在这山里，养蛊的女人，你也敢赖账？”`),
 opts:[{l:T('Apologise and pay her properly','赔礼，把钱补上'),cost:20,out:[
   {w:s=>1+s.t.heart*.2+s.looks/50,t:T('She takes the silver, then a pinch of something from her sleeve, and blows it into your face. You sneeze for an hour. The line is gone.','她收了银子，从袖子里捏出一撮什么东西，往你脸上一吹。你打了一个时辰喷嚏，黑线没了。'),c:'good',fx:{heal:8,happy:3,align:2}},
   {w:1,t:T('She cures you, but slowly, to make a point. A month of bitter tea before the line fades.','她给你解了，却解得很慢，存心让你长记性。苦茶喝了一个月，黑线才消。'),c:'muted',fx:{hurt:[3,8],cause:T('Gu poison','蛊毒'),smarts:1}}]},
  {l:T('Threaten her','威胁她'),out:[
   {w:s=>power(s)/60,t:T('She cures you with her mouth shut tight. Every village in the valley knows your face by sundown.','她咬着嘴唇给你解了蛊。天黑之前，山谷里每个寨子都认得你这张脸了。'),c:'muted',fx:{align:-5,fame:-2}},
   {w:1.5,t:T('She laughs. The line on your arm moves an inch while she does. You end up paying three times over.','她笑了。她笑的时候，你胳膊上的黑线往上爬了一寸。最后你赔了三倍的钱。'),c:'bad',fx:{f:s=>{pay(s,-Math.min(s.money,60));addCond(s,'poison',1)},align:-2}}]}]});

I({id:'rg_festival',age:[12,70],cd:6,w:2,tags:['town','wander'],when:inRg('miao'),ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-4,4),16,60)});return c},
 text:c=>T(`The new-year festival in the valley: reed pipes taller than the men blowing them, girls in so much silver they chime when they turn, and buffalo fights in the paddies. ${c.npc.en} pulls you into the circle dance.`,`山谷里过苗年：芦笙比吹它的汉子还高，姑娘们戴的银饰多得一转身就叮当响，水田里还在斗牛。${c.npc.zh}一把把你拉进了踩堂的圈子。`),
 opts:[{l:T('Dance','跳'),out:[
   {w:s=>1+s.looks/40+s.t.heart*.1,t:c=>T(`You get the steps wrong in a way that everyone finds charming. ${c.npc.en} keeps finding you in the crowd all night.`,`你跳错了步子，错得大家都觉得可爱。整整一夜，${c.npc.zh}总能在人群里找到你。`),c:'good',fx:{happy:6,looks:1}},
   {w:1,t:T('You step on four feet and one chicken. They give you a cup of rice wine for being brave and let you sit down.','你踩了四只脚，还有一只鸡。大家敬你一碗米酒，夸你胆子大，然后让你坐下歇着。'),c:'muted',fx:{happy:3}}]},
  {l:T('Watch the buffalo fight','看斗牛'),out:[
   {w:1,t:T('Two black bulls lock horns in the mud for an hour. You shout yourself hoarse with the whole valley.','两头黑牯牛在泥里顶了一个时辰的角。你跟着全山谷的人喊哑了嗓子。'),c:'good',fx:{happy:4}},
   {w:s=>2-s.t.luck*.2,t:T('The losing bull runs straight through the crowd. You are in its way.','输了的那头牛冲进了人群。你正好挡在它前头。'),c:'bad',fx:{hurt:[6,14],cause:T('a runaway buffalo','受惊的水牛'),f:s=>{if(chance(.4))addCond(s,'fracture',1)}}}]}]});

/* ---------- east sea ---------- */
I({id:'rg_pirate1',age:[16,65],cd:12,w:2,tags:RGW,when:inRg('east'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,age:rint(35,60)});c.lv=PW(1,4)(s);return c},
 text:c=>T(`On the salt flats, where the sea is boiled down in iron pans, ${c.npc.en} the salt boss is paying off a man with a pirate’s tattoo. A month later the pirates land, and only his sheds are spared.`,`海边盐场，海水在铁锅里熬成盐。你看见盐场主${c.npc.zh}给一个刺着海盗刺青的汉子塞银子。一个月后海盗上岸，唯独他的盐棚没被烧。`),
 opts:[{l:T('Track down the pirate go-between','去找那个牵线的海盗'),out:[
   {w:s=>1+s.smarts/40,t:T('You find him in a fishing village, drunk, boasting about the next landing.','你在一个渔村找到他，醉醺醺的，正吹嘘下一回在哪儿上岸。'),c:'muted',next:'rg_pirate2',keep:1},
   {w:1,t:T('He finds you first, with friends.','倒是他先找上了你，还带了帮手。'),c:'bad',fx:{f:(s,c)=>{c.lv*=1.1}},next:'rg_pirate2',keep:1}]},
  {l:T('Tell the salt workers','告诉盐工们'),out:[
   {w:s=>1+s.fame/40,t:T('The salt workers walk off the pans. Without them, the boss’s salt is worth nothing, and he has to answer for it.','盐工们撂了挑子。没有人熬盐，盐场主的盐一文不值，只好出来给个说法。'),c:'good',fx:{align:4,fame:2}},
   {w:1,t:T('Nobody wants to believe it. The boss pays their wages. You are the one who gets run out of town.','没人愿意信。工钱是盐场主发的。最后被赶出镇子的是你。'),c:'bad',fx:{fame:-2,happy:-3}}]}]});
I({id:'rg_pirate2',only:1,noThread:1,
 text:c=>T('The go-between is on the beach by the pirates’ skiff, a crooked smile, a short curved blade. Behind him, out on the grey water, a junk with patched red sails is waiting.','牵线的人站在海盗的小艇边，歪着嘴笑，手里一把短弯刀。他身后灰蒙蒙的海面上，一条打着补丁的红帆船在等。'),
 opts:[{l:T('Fight him on the sand','在沙滩上动手'),fight:FG((s,c)=>c.lv,'injury',T('Pirate on the beach','海滩斗海盗'),T('a pirate’s blade','海盗的弯刀'),()=>T('the pirate go-between','海盗眼线')),
   win:[{w:2,t:T('You drag him to the magistrate with the salt boss’s silver still in his belt. The boss loses his licence; the salt workers give you a sack of the best salt.','你把他拖到县衙，腰带里还揣着盐场主的银子。盐场主丢了盐引，盐工们送了你一袋最好的盐。'),c:'good',fx:{fame:4,align:5,money:30}},
    {w:1,t:T('He goes into the surf and swims for the junk. You keep his blade and his ledger of names, which the coast guard pays well for.','他扑进浪里朝大船游去。你留下了他的刀，还有一本名册，海防营出了好价钱买。'),c:'good',fx:{fame:2,money:[60,100]}}],
   lose:[{w:1,t:T('He opens your cheek with the curved blade and rows away laughing.','他一刀划开你的脸颊，大笑着划船走了。'),c:'bad',fx:{looks:-5,f:s=>addCond(s,'wound',1)}},
    {w:1,t:T('You lose, and wake on the junk’s deck. They ransom you back to the shore for everything in your purse.','你输了，醒来时已经躺在大船的甲板上。他们把你赎回岸上，要了你钱袋里所有的钱。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,rint(50,150))),happy:-5}}]},
  {l:T('Offer him more than the salt boss does','出比盐场主更高的价'),cost:60,out:[
   {w:s=>s.smarts/30+s.t.luck*.1,t:T('He sells you the date of the next landing. The village is ready, and the pirates sail off without stepping ashore.','他把下回上岸的日子卖给了你。村里早有准备，海盗没上岸就扬帆走了。'),c:'good',fx:{align:4,fame:2}},
   {w:1,t:T('He takes your silver and sells your name to the salt boss as well. Pirates are businessmen.','他收了你的银子，转手又把你的名字卖给了盐场主。海盗也是生意人。'),c:'bad',fx:{enemy:1}}]}]});

I({id:'rg_typhoon',age:[8,90],cd:8,w:1.3,tags:RGW,when:inRg('east'),
 text:()=>T('The sky goes the colour of a bruise and the gulls fly inland. By evening a typhoon is tearing the roofs off the fishing village and throwing boats up the street.','天色青得像淤血，海鸥都往岸上飞。到傍晚，台风已经在掀渔村的屋顶，把渔船一条条扔上街。'),
 opts:[{l:T('Help lash down the boats','帮着绑船'),out:[
   {w:s=>1+power(s)/50,t:T('You haul on wet ropes until your palms bleed. In the morning the village has lost three roofs and no boats. They call you “Anchor” for a year.','你拽着湿缆绳，手掌磨出了血。第二天，村里掀了三间屋顶，船一条没丢。大家叫了你一年的“锚哥”。'),c:'good',fx:{align:3,fame:1,hurt:[2,6],cause:T('a typhoon','台风')}},
   {w:1,t:T('A loose mast swings round and catches you in the ribs.','一根松脱的桅杆横扫过来，正撞在你肋骨上。'),c:'bad',fx:{hurt:[10,18],cause:T('a typhoon','台风'),f:s=>{if(chance(.5))addCond(s,'fracture',1)}}}]},
  {l:T('Bar the door and wait it out','闩上门硬扛'),out:[
   {w:s=>1+s.t.luck*.2,t:T('You spend the night listening to the sea try to get in. It doesn’t.','你听了一夜大海想破门而入。它没进来。'),c:'muted',fx:{happy:-1}},
   {w:1,t:T('The roof goes at midnight. You spend the rest of the night under a table with a goat that is not yours.','半夜屋顶没了。剩下半夜你缩在桌子底下，身边还有一只不是你家的羊。'),c:'muted',fx:{money:-20,ill:'cold'}}]}]});

/* ---------- capital: lanterns and the sealed memorial (big) ---------- */
I({id:'rg_lantern',age:[8,90],cd:5,w:1.1,tags:['town'],when:inRg('capital'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([12,11,1]),age:rint(16,40)});return c},
 text:c=>T(`Lantern night in the capital. Ten thousand lanterns on the main avenue, riddles hanging from every one. ${c.npc.en} is standing under a carp lantern with a riddle nobody has solved all evening, and a prize of a jade ring.`,`京城元宵夜。御街上挂了上万盏灯，每盏灯下都垂着灯谜。${c.npc.zh}站在一盏鲤鱼灯下，那条谜一晚上没人猜中，彩头是一枚玉戒。`),
 opts:[{l:T('Try the riddle','猜猜看'),out:[
   {w:s=>s.smarts/25,t:c=>T(`You get it on the second reading. The crowd groans; ${c.npc.en} laughs and asks where you studied.`,`你读第二遍就猜中了。人群一片哀叹，${c.npc.zh}笑着问你是在哪儿念的书。`),c:'good',fx:{money:[30,60],smarts:1,fame:1,happy:3}},
   {w:1.5,t:T('Your answer is so wrong that it becomes the joke of the night. Strangers repeat it to you on the way home.','你的答案错得离谱，成了当晚的笑话。回家路上，还有陌生人学给你听。'),c:'muted',fx:{happy:1}}]},
  {l:T('Just walk the lanterns','只看灯'),out:[
   {w:1,t:T('You walk until the candles gutter. It is the most beautiful thing you have ever seen in a city.','你一直走到灯烛将尽。这是你在城里见过最美的景象。'),c:'good',fx:{happy:4}},
   {w:s=>1.2-s.smarts/100,t:T('In the crush on the bridge, a lantern sets your sleeve alight. You put it out in the moat, to applause.','桥上挤得水泄不通，一盏灯点着了你的袖子。你跳进护城河灭了火，赢得一片喝彩。'),c:'muted',fx:{hurt:[2,6],cause:T('a lantern fire','灯会失火'),ill:'cold'}}]}]});

I({id:'rg_court1',age:[18,70],cd:12,w:1.9,tags:['town','wander'],when:inRg('capital'),ctx:s=>{const c=scene();c.npc=npc(s,{occ:31,sex:'m',age:rint(40,65)});c.lv=PW(1,6)(s);return c},
 text:c=>T(`A palace eunuch, ${c.npc.en}, all soft hands and hard eyes, finds you in a wine shop. He wants a sealed memorial carried tonight to a censor’s house across the city. “Someone the palace guards don’t know. Fifty taels now, fifty after.”`,`一个宫里的太监${c.npc.zh}在酒肆里找到你，手是软的，眼神是硬的。他要你今夜把一封密封的奏折送到城那头一位御史家里。“得是宫里侍卫不认得的人。先付五十两，事成再给五十两。”`),
 opts:[{l:T('Take the job','接下'),out:[
   {w:1,t:T('He counts the silver into your hand, coin by coin. The seal on the memorial is yellow.','他把银子一枚一枚数进你手心。奏折上的封印是黄色的。'),c:'muted',fx:{money:50},next:'rg_court2',keep:1},
   {w:s=>s.t.luck*.1,t:T('He pays, and adds: “If they stop you, you have never heard my name.” You begin to understand.','他付了钱，又补了一句：“要是被拦下，你从没听过咱家的名字。”你开始明白了。'),c:'muted',fx:{money:50,smarts:1},next:'rg_court2',keep:1}]},
  {l:T('Take it, and read it on the way','接下，路上偷看'),out:[
   {w:s=>s.smarts/30,t:T('You lift the seal with a hot knife and put it back. It impeaches a grand secretary for selling frontier posts. Now you know what you are carrying.','你用烧热的刀挑开封印又按了回去。奏折弹劾一位大学士卖官鬻爵，连边关的职位都卖。现在你知道自己揣着什么了。'),c:'muted',fx:{money:50,f:(s,c)=>{c.read=1}},next:'rg_court2',keep:1},
   {w:1,t:T('The seal cracks in two. You go back to the wine shop. The eunuch is gone, and there are men asking for you by description.','封印裂成了两半。你回到酒肆，太监已经走了，有几个人正拿着你的样貌四处打听。'),c:'bad',fx:{money:50,wanted:1,happy:-3}}]},
  {l:T('Refuse','推辞'),out:[
   {w:1,t:T('He smiles as if you have done him a favour and leaves. You drink alone and feel watched.','他笑得像是你帮了他一个忙，起身走了。你一个人喝酒，总觉得有人在看。'),c:'muted'},
   {w:s=>s.smarts/60,t:T('A month later, a messenger is found in the canal with a broken seal in his hand. You were right to say no.','一个月后，有个送信的人被人从河里捞上来，手里攥着一枚碎封印。你推得对。'),c:'muted',fx:{smarts:1}}]}]});
I({id:'rg_court2',only:1,noThread:1,
 text:c=>T('Halfway across the city, in an alley of shuttered silk shops, four men in black step out. They wear the embroidered boots of the palace’s secret watch. “The letter. Now.”','走到城中间，一条丝绸铺子都上了门板的巷子里，钻出四个黑衣人。脚上穿着宫中密探的绣花靴。“信，交出来。”'),
 opts:[{l:T('Fight your way through','杀出去'),fight:FG((s,c)=>c.lv,'injury',T('The alley of shuttered shops','闭门巷'),T('the palace’s secret watch','宫中密探'),()=>T('the secret watch','密探')),
   win:[{t:T('You leave them in the gutter and run the rest of the way. The censor himself opens the door.','你把他们撂在阴沟里，一路跑完剩下的路。开门的是御史本人。'),c:'good',next:'rg_court3',keep:1},
    {w:.6,t:T('You get through, but a thrown dart is still in your shoulder when you knock on the censor’s door.','你冲了过去，敲御史家门的时候，肩上还插着一枚飞镖。'),c:'muted',fx:{f:s=>addCond(s,'poison',1)},next:'rg_court3',keep:1}],
   lose:[{w:1,t:T('They take the memorial and leave you bleeding. By morning there is a picture of your face at every gate.','他们夺了奏折，把你扔在血泊里。第二天一早，每座城门都贴上了你的画像。'),c:'bad',fx:{wanted:2,f:s=>addCond(s,'wound',2)}},
    {w:1,t:T('They take the memorial and break your hand, slowly, so you remember.','他们夺了奏折，慢慢地折断了你的手，好让你长记性。'),c:'bad',fx:{wanted:1,f:s=>addCond(s,'fracture',1)}}]},
  {l:T('Bluff','虚张声势'),out:[
   {w:s=>s.smarts/30+s.fame/50+(s.region==='capital'?.2:0),t:(c,s)=>c.read?T('You tell them you know exactly what is in the letter, and so does a friend who will open his own copy at dawn if you are not home. They step aside.','你说你清楚信里写了什么，有个朋友手里还有一份，你天亮不回去他就拆开。他们让开了路。'):T('You tell them you are carrying the grand secretary’s laundry list. They hesitate long enough for you to vault a wall.','你说你送的是大学士府上的洗衣单。他们愣了一下，够你翻过一道墙了。'),c:'good',next:'rg_court3',keep:1},
   {w:1,t:T('They do not believe a word. They take the memorial and walk you to the prefecture jail.','他们一个字也不信，夺了奏折，把你押进了府衙大牢。'),c:'bad',fx:{jail:1}}]},
  {l:T('Drop it and run','扔下就跑'),out:[
   {w:s=>1+s.t.luck*.15,t:T('They let you go. They have what they wanted. You still have fifty taels and your skin.','他们放你走了，要的东西已经到手。你还剩五十两银子和一身完好的皮。'),c:'muted',fx:{align:-2}},
   {w:1,t:T('They let you go, which is worse: the eunuch’s people will think you sold them. You stay off the streets for a year.','他们放你走了。这更糟：太监那边会以为是你出卖了他们。你一整年不敢上街。'),c:'bad',fx:{enemy:1,happy:-4}}]}]});
I({id:'rg_court3',only:1,noThread:1,
 text:c=>T('The censor, an old man in a patched robe, reads the memorial twice by one candle. “This will be heard in court in three days. Someone will have to say how it came here. Will you?”','御史是个穿着补丁袍子的老人。他就着一支蜡烛把奏折读了两遍：“三天后朝上要议此事，总得有人说清这封折子是怎么来的。你肯不肯？”'),
 opts:[{l:T('Testify','出面作证'),out:[
   {w:s=>1+s.align/40+s.t.luck*.15,t:T('You kneel in the outer court and tell it plainly. The grand secretary falls within the month. Your name is in every teahouse in the capital.','你跪在外朝，把事情一五一十说了。不出一月，那位大学士倒了台。京城每间茶馆都在说你的名字。'),c:'gold',fx:{fame:8,align:6,money:50,deed:T('Carried the memorial that brought down a corrupt grand secretary','冒死送出弹劾奸相的奏折')}},
   {w:1,t:T('The grand secretary survives. You do too, barely, but his people follow you for years.','大学士没倒，你也勉强活了下来。可他的人盯了你好些年。'),c:'bad',fx:{fame:4,align:4,enemy:1,f:s=>addCond(s,'shaken',1)}}]},
  {l:T('Take the second fifty and vanish','拿了剩下五十两就走'),out:[
   {w:s=>1+s.smarts/40,t:T('The eunuch pays, as promised. The grand secretary falls without you. Nobody in the capital ever learns your name, which is what you wanted.','太监如约付了钱。大学士没你也照样倒了。京城里没人知道你的名字——这正是你要的。'),c:'good',fx:{money:50}},
   {w:1,t:T('The eunuch pays. A week later, so does the grand secretary’s steward, to find out who you are. You leave the capital for a while.','太监付了钱。一个星期后，大学士府的管家也找上门来出钱，要打听你是谁。你只好离京避一阵。'),c:'muted',fx:{money:50,wanted:1}}]}]});

/* ======================================================================
   (B) LATER LIFE AND LEGACY
   ====================================================================== */

/* an old rival, at the end */
I({id:'rg_oldrival',age:[50,88],cd:20,w:1.2,ctx:s=>{const c=scene();const p=pick(living(s,['rival','enemy']));
   c.npc=npc(s,{age:clamp(s.age+rint(-5,5),45,95),lv:Math.round(PW(.95,0)(s))});
   if(p){c.pid=p.id;c.nm=rgPN(p);c.ta=PRON[p.sex].ta;c.he=PRON[p.sex].he;c.lv=Math.max(10,p.lv*.85)}else{c.nm=T(c.npc.en,c.npc.zh);c.ta=c.npc.ta;c.he=c.npc.he;c.lv=c.npc.lv}return c},
 text:c=>T(`An old man’s cart stops at your gate. Out climbs ${c.nm.en}, white-haired now, the one you fought with half your life. “We are both nearly done. I came to end it, one way or the other.”`,`一辆车停在你家门口。下来的是${c.nm.zh}，头发全白了，这半辈子跟你斗来斗去的那个人。“咱们都快到头了。我来，是要做个了断——怎么了断，你说。”`),
 opts:[{l:T('Make peace over tea','煮茶言和'),out:[
   {w:s=>1+s.t.heart*.2+s.align/50,t:c=>T(`You talk until the tea goes cold, about everyone who is dead now. When ${c.he} leaves, you are surprised to find you will miss ${c.he==='he'?'him':'her'}.`,`你们一直说到茶凉，说的全是如今已经不在的人。${c.ta}走的时候，你才发现自己竟会想念${c.ta}。`),c:'good',fx:{happy:6,align:3,f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='friend';p.bond=Math.max(p.bond,60)}}}},
   {w:s=>1.2-s.smarts/120,t:T('The tea is very good. It is also not the tea you brewed. You are sick for a month, and you never see your visitor again.','茶很好，只是已经不是你泡的那壶了。你病了一个月，那位客人再也没露过面。'),c:'bad',fx:{f:s=>addCond(s,'poison',2),hurt:[8,16],cause:T('poisoned tea from an old rival','宿敌的毒茶')}}]},
  {l:T('One last duel','最后一战'),fight:FG((s,c)=>c.lv,'injury',T('The last duel','最后一战'),T('an old rival','宿敌'),c=>c&&c.nm?c.nm:T('your old rival','宿敌')),
   win:[{w:2,t:T('You win, and help your old rival up. Neither of you can remember any more what it was all about.','你赢了，伸手把老对头扶起来。两个人都想不起来当年到底争的是什么了。'),c:'good',fx:{fame:3,happy:4,f:(s,c)=>{const p=person(s,c.pid);if(p){p.rel='acq';p.bond=55}}}},
    {w:1,t:T('You win. Your rival bows, deeply, and walks away. A year later word comes that they died content.','你赢了。对方深深一揖，转身离去。一年后传来消息，说那人走得很安详。'),c:'muted',fx:{fame:3,f:(s,c)=>{const p=person(s,c.pid);if(p)rgDie(s,p)}}}],
   lose:[{w:1,t:T('You lose, at the very end. Your knee never quite recovers. Strangely, it does not hurt as much as you feared.','到最后你还是输了。膝盖从此没好利索。说来也怪，没你想的那么疼。'),c:'bad',fx:{f:s=>addCond(s,'fracture',1),fame:-2,happy:-2}},
    {w:1,t:T('You lose. Your rival sits down beside you in the dirt and laughs until coughing. It is over.','你输了。对手在你身边的土里坐下，笑得直咳嗽。到此为止了。'),c:'muted',fx:{happy:2}}]},
  {l:T('Keep the gate shut','闭门不见'),out:[
   {w:1,t:T('The cart waits until dusk and then goes. You are not sure whether you won.','车在门口等到天黑才走。你说不清自己算不算赢了。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.t.luck*.15,t:T('Next morning there is a box on your step: the sword you lost to them forty years ago.','第二天一早，门口放着一只匣子：四十年前你输给对方的那把剑。'),c:'good',fx:{happy:4}}]}]});

/* a grandchild */
I({id:'rg_grandchild',age:[45,90],cd:10,w:1.8,when:s=>living(s,'child').some(p=>p.age>=17),
 ctx:s=>{const c=scene();c.ch=pick(living(s,'child').filter(p=>p.age>=17));c.npc=npc(s,{age:rint(5,9),sur:c.ch.n.sur});return c},
 text:c=>T(`${rgPN(c.ch).en} brings ${PRON[c.ch.sex].his} child to stay for the summer: ${c.npc.en}, who is ${c.npc.age}, has never once stopped asking questions, and wants to know if you have really killed anybody.`,`${rgPN(c.ch).zh}把孩子送来过暑天。${c.npc.zh}今年${c.npc.age}岁，嘴就没停过，一来就问你是不是真的杀过人。`),
 opts:[{l:T('Teach the child a stance','教孩子扎个马步'),out:[
   {w:s=>1+s.t.heart*.15+power(s)/150,t:c=>T(`${c.npc.en} stands in the yard every morning until the end of summer, legs shaking, refusing to quit. You have not been this proud in years.`,`${c.npc.zh}一整个夏天每天早上都在院子里扎马步，两腿直打颤，就是不肯认输。你好些年没这么得意过了。`),c:'good',fx:{happy:7,meet:'disciple',bond:75}},
   {w:1,t:c=>T(`${c.npc.en} lasts three days, then discovers the river and you never see the stance again.`,`${c.npc.zh}坚持了三天，后来发现了河边，马步就再也没见着了。`),c:'muted',fx:{happy:3}}]},
  {l:T('Tell true stories','讲真事'),out:[
   {w:s=>1+s.smarts/40+s.fame/60,t:T('You tell the stories plainly, the losses as well. The child listens with a seriousness that frightens you a little.','你把故事照实说了，连输的那些也说了。孩子听得那么认真，倒让你有点心惊。'),c:'good',fx:{happy:5,smarts:1}},
   {w:1,t:c=>T(`The child repeats the bloodiest one at dinner. ${rgPN(c.ch).en} gives you a look you remember giving your own parents.`,`孩子在饭桌上把最血腥的那段学了一遍。${rgPN(c.ch).zh}瞪了你一眼——那眼神，你当年也这样瞪过自己的爹娘。`),c:'muted',fx:{happy:3,f:(s,c)=>addBond(c.ch,-2)}}]},
  {l:T('Spoil the child with sweets','给孩子买糖吃'),cost:10,out:[
   {w:1,t:T('Sugar figures, candied haws, a paper kite. The child declares you the best person alive.','糖人、冰糖葫芦、纸风筝。孩子宣布你是天底下最好的人。'),c:'good',fx:{happy:5,f:(s,c)=>addBond(c.ch,3)}},
   {w:s=>1-s.t.luck*.05,t:T('The child is sick on the way home and you are the one who has to explain it.','孩子回去路上吐了，挨数落的是你。'),c:'muted',fx:{happy:2,f:(s,c)=>addBond(c.ch,-3)}}]}]});

/* memoirs that people dispute */
I({id:'rg_memoir1',age:[52,88],cd:30,once:1,w:1.1,when:s=>s.fame>=15||s.smarts>=45,ctx:s=>{const c=scene();c.npc=npc(s,{occ:pick([1,19,13,14]),age:clamp(s.age+rint(-6,4),45,95)});c.lv=PW(.85,0)(s);return c},
 text:()=>T('A bookseller offers to print your memoirs. “People want to know what the jianghu was really like.” You sit down with a pot of ink and fifty years.','一个书商要给你刻印回忆录。“大家都想知道江湖当年到底什么样。”你守着一砚墨，和五十年的往事坐了下来。'),
 opts:[{l:T('Write it honestly, even the ugly parts','照实写，丑事也写'),out:[
   {w:s=>1+s.smarts/40,t:T('It sells slowly and lasts. Young people come to your door to ask about one chapter or another.','卖得慢，却经得起看。不时有年轻人上门，来问这一章那一章的事。'),c:'good',fx:{fame:3,smarts:2,f:(s,c)=>{c.hon=1}},next:'rg_memoir2',keep:1},
   {w:1,t:T('Some of the ugly parts belonged to other people too.','有些丑事，可不止是你一个人的。'),c:'muted',fx:{fame:2,f:(s,c)=>{c.hon=1}},next:'rg_memoir2',keep:1}]},
  {l:T('Make it a little grander than it was','写得比当年风光一点'),out:[
   {w:s=>1+s.fame/40,t:T('Your book is a sensation. Storytellers in three provinces perform it. You did, after all, beat seven men on that bridge. Or was it three?','你的书一下子轰动了，三个省的说书人都在讲。那座桥上你毕竟打败了七个人。还是三个来着？'),c:'good',fx:{fame:6,money:[40,90]},next:'rg_memoir2',keep:1},
   {w:1,t:T('It sells well enough. Then the letters start arriving.','卖得还行。接着，信就开始一封封寄来了。'),c:'muted',fx:{fame:2,money:30},next:'rg_memoir2',keep:1}]}]});
I({id:'rg_memoir2',only:1,noThread:1,
 text:c=>T(`${c.npc.en} turns up at your door with your book under one arm, a page torn out and folded. “That is not what happened. You know it is not. I was there.”`,`${c.npc.zh}找上门来，胳膊底下夹着你的书，有一页被撕下来折好了。“事情根本不是这样。你心里清楚。我当时就在场。”`),
 opts:[{l:T('Hear them out','听对方说完'),out:[
   {w:s=>1+s.t.heart*.15+s.smarts/50,t:c=>T(`${c.npc.en}’s version is worse for you and better for someone who died. You print a second edition with a new chapter. Readers like it more.`,`${c.npc.zh}讲的那个版本，对你更难看，对一个已经过世的人更公道。你加印了第二版，补了一章。读者反倒更喜欢了。`),c:'good',fx:{align:4,fame:2,happy:2}},
   {w:1,t:c=>T(`You listen. You still remember it your way. You part politely, each sure the other is an old fool.`,`你听完了。可你记得的还是你那个样子。两人客客气气地告别，各自认定对方是个老糊涂。`),c:'muted',fx:{happy:-1}}]},
  {l:T('Stand by every word','一字不改'),out:[
   {w:(s,c)=>s.fame/40+(c.hon?1:.3),t:T('The public sides with you. The visitor leaves muttering, and a little later the whole thing becomes part of your legend.','众人都站在你这边。来人嘟囔着走了。没过多久，这场争执本身也成了你传奇的一部分。'),c:'muted',fx:{fame:2,align:-1}},
   {w:(s,c)=>(c.hon?.4:1.2)+s.smarts/80,t:T('The visitor brings witnesses to the teahouses. Your book becomes a joke, and you a liar, at seventy.','来人把当年的见证人都请到茶馆里。你的书成了笑话，你七老八十还成了骗子。'),c:'bad',fx:{fame:-6,happy:-6}}]},
  {l:T('Settle it with fists, like old times','像当年那样，拳头上见'),fight:FG((s,c)=>c.lv,'light',T('A dispute over a memoir','回忆录之争'),T('an old witness','老见证人')),
   win:[{t:T('You win. Two old fools brawling in the street over a book. That becomes the most famous chapter of all.','你赢了。两个老糊涂为了一本书在街上打架——这成了全书最出名的一章。'),c:'muted',fx:{fame:3,happy:3}},
    {w:.5,t:T('You win, and throw your back out doing it.','你赢了，腰也闪了。'),c:'muted',fx:{fame:1,hurt:[4,10],cause:T('a brawl in old age','老来斗殴')}}],
   lose:[{t:T('You lose, in public. The teahouses decide the visitor’s version must be the true one.','你当众输了。茶馆里的人一致认为，来人说的才是真的。'),c:'bad',fx:{fame:-4,hurt:[4,10],cause:T('a brawl in old age','老来斗殴')}}]}]});

/* choosing an heir for your arts (big: two steps now, the reckoning years later) */
const RG_HEIRS=[
 {k:0,en:'a fiercely gifted youth who already knows how good he is',zh:'天赋惊人、自己也心知肚明的少年',occ:13,sex:'m'},
 {k:1,en:'a slow, stubborn girl who has swept your yard every day for three years without being asked',zh:'资质平平却倔得出奇、三年来天天不请自来替你扫院子的姑娘',occ:20,sex:'f'},
 {k:2,en:'a clever young scholar who wants to write your art down before it dies with you',zh:'聪明的年轻书生，想趁你还在把功夫写成谱',occ:1,sex:'m'}];
I({id:'rg_heir1',age:[50,85],cd:30,once:1,w:1.2,when:s=>power(s)>=40&&s.arts.length>0,
 text:()=>T('Your hands are not what they were. Three young people want to carry on your art, and you can only truly teach one of them.','你的手不比当年了。有三个年轻人想继承你的功夫，可你能真正倾囊相授的只有一个。'),
 opts:RG_HEIRS.map(h=>({l:T(`Choose ${h.en}`,`选那个${h.zh}`),out:[
   {w:s=>1+s.smarts/50,t:T('You tell the other two. One cries; one shrugs. Then the real teaching begins.','你跟另外两个说了。一个哭了，一个耸耸肩。接着，真正的传授开始了。'),c:'muted',fx:{f:(s,c)=>{c.k=h.k;c.npc=npc(s,{occ:h.occ,sex:h.sex,age:rint(16,22)})}},next:'rg_heir2',keep:1},
   {w:s=>s.t.luck*.1,t:T('The other two take it better than you feared. One of them even stays on to cook.','另外两个比你想的看得开。其中一个还留下来给你们做饭。'),c:'good',fx:{happy:2,f:(s,c)=>{c.k=h.k;c.npc=npc(s,{occ:h.occ,sex:h.sex,age:rint(16,22)})}},next:'rg_heir2',keep:1}]}))});
I({id:'rg_heir2',only:1,noThread:1,
 text:c=>T(`A year of teaching ${c.npc.en}. The day comes to pass on the part of your art you have never shown anyone: the move that won your hardest fight.`,`教了${c.npc.zh}一年。终于到了要传那一招的时候——你从没给任何人看过、赢下你这辈子最难一战的那一招。`),
 opts:[{l:T('Teach everything','倾囊相授'),out:[
   {w:s=>1+s.t.heart*.1+(s.smarts/60),t:c=>T(`${c.npc.en} gets it on the ninth try. You sit down on the practice ground and, to your surprise, weep.`,`${c.npc.zh}练到第九遍，成了。你在练武场上坐下来，竟然哭了。`),c:'gold',fx:{happy:8,meet:'disciple',bond:85,flag:'q_rgheir_1',f:(s,c)=>{s.flags.rgheir_k=c.k;s.flags.rgheir_all=1},deed:T('Passed on a lifetime’s art to a chosen heir','把一生所学传给了亲选的传人')}},
   {w:1,t:c=>T(`Showing it again after so many years tears something in your chest. ${c.npc.en} learns it anyway, from watching you fall.`,`隔了这么多年再使这一招，你胸口像撕裂了一样。${c.npc.zh}还是学会了——看着你倒下学会的。`),c:'muted',fx:{meet:'disciple',bond:85,flag:'q_rgheir_1',f:(s,c)=>{s.flags.rgheir_k=c.k;s.flags.rgheir_all=1;addCond(s,'inner',1)}}}]},
  {l:T('Hold the last move back','留一手'),out:[
   {w:s=>1+s.smarts/50,t:c=>T(`You teach ${c.npc.en} all but one thing. “Not yet,” you say. Maybe you mean it.`,`你把一切都教给了${c.npc.zh}，只差一样。“还不到时候。”你说。也许你是真这么想的。`),c:'muted',fx:{meet:'disciple',bond:65,flag:'q_rgheir_1',f:(s,c)=>{s.flags.rgheir_k=c.k}}},
   {w:1,t:c=>T(`${c.npc.en} knows you are holding something back and says nothing, which is worse.`,`${c.npc.zh}知道你留了一手，却一句不提——这更让人难受。`),c:'muted',fx:{meet:'disciple',bond:50,flag:'q_rgheir_1',happy:-2,f:(s,c)=>{s.flags.rgheir_k=c.k}}}]}]});
QHINT.q_rgheir_1=T('Your chosen heir is out in the jianghu. One day you will hear what they made of your art.','你亲选的传人已经闯荡江湖去了。总有一天，你会听说他把你的功夫用成了什么样。');
I({id:'rg_heir3',age:[51,95],once:1,w:6,need:'q_rgheir_1',when:s=>s.age-s.flags.q_rgheir_1>=2,
 text:s=>T('News of your heir comes up the road with a travelling peddler.','一个货郎走街串巷，把你那个传人的消息带了上来。'),
 opts:[{l:T('Listen','听他说'),out:[
   {w:s=>{const k=s.flags.rgheir_k;return (k===1?2.5:k===2?1.8:1.2)+(s.flags.rgheir_all?.8:0)+s.t.luck*.1},t:(c,s)=>s.flags.rgheir_k===2?T('Your heir’s manual of your art is copied in three cities. Young people you will never meet are practising your moves, some of them badly, all of them in your name.','你那传人写的拳谱，已经在三座城里传抄开了。你一辈子见不着的年轻人在练你的招式，有的练得歪七扭八，可都挂着你的名号。'):T('Your heir has opened a school by the river and refuses to take fees from the poor. When asked who taught them, they say your name first.','你那传人在河边开了间武馆，穷人家的孩子一律不收钱。有人问师承，第一个说的就是你的名字。'),c:'gold',fx:{fame:6,happy:8,unflag:'q_rgheir_1',f:s=>{delete s.flags.rgheir_k},deed:T('Their art lives on through a worthy heir','一身所学后继有人')}},
   {w:s=>{const k=s.flags.rgheir_k;return (k===0?2:.6)+(s.flags.rgheir_all?0:.6)},t:T('Your heir has become famous and cruel, a hired blade for a salt baron. People who suffered from it now curse the one who taught them.','你那传人出了名，也变得狠毒了，给一个盐霸当打手。吃过亏的人，连带着教他的师父一起骂。'),c:'bad',fx:{fame:-3,align:-3,happy:-8,unflag:'q_rgheir_1',f:s=>{delete s.flags.rgheir_k;addCond(s,'shaken',1)}}},
   {w:.8,t:T('Your heir died young, in somebody else’s quarrel, using your best move to save a stranger. You burn incense for a month.','你那传人年纪轻轻就死了，死在别人的纷争里，用你最好的那一招救了一个陌生人。你上了一个月的香。'),c:'muted',fx:{happy:-6,align:3,unflag:'q_rgheir_1',f:s=>{delete s.flags.rgheir_k;const p=living(s,'disciple').sort((a,b)=>b.met-a.met)[0];if(p)rgDie(s,p,T('a stranger’s quarrel','为陌生人赴难'))}}}]}]});

/* a last journey */
I({id:'rg_lastjourney',age:[62,92],cd:30,once:1,w:1.3,
 text:()=>T('You wake one morning knowing that if you are ever going to see it, the place you always meant to go, it has to be this year.','一天早上醒来，你忽然明白：那个你一直想去的地方，要去就得是今年了。'),
 opts:[{l:T('The sea at the edge of the world','去天尽头看海'),cost:40,out:[
   {w:s=>1+s.health/50+s.t.luck*.1,t:T('You stand on the rocks with salt in your beard and the whole sky moving. You do not need anything else after that.','你站在礁石上，胡子上全是盐，整片天都在动。从那以后，你什么都不缺了。'),c:'gold',fx:{happy:12,lifespan:1}},
   {w:1,t:T('You reach the sea, and the journey home takes everything you have left in your knees.','海是看到了，回来的路却把你膝盖里剩下的力气耗光了。'),c:'muted',fx:{happy:6,maxHealth:-3,f:s=>addCond(s,'fracture',1)}}]},
  {l:T('The snow mountain where your master once trained','师父当年练功的雪山'),cost:30,out:[
   {w:s=>1+s.qi/40,t:T('In the cave you find old marks on the wall, sword cuts in a pattern you suddenly understand. Seventy years late, and still worth it.','山洞的石壁上有旧痕，是一道道剑痕，你忽然看懂了它们的路数。晚了七十年，依然值得。'),c:'gold',fx:{happy:8,skill:3,qi:2}},
   {w:1,t:T('The cold gets into your lungs on the second night. You get down the mountain alive, which at your age is its own victory.','第二天夜里寒气钻进了肺。你总算活着下了山——到你这把年纪，这本身就是一场胜仗。'),c:'bad',fx:{ill:'lung',happy:3,hurt:[8,16],cause:T('a snow mountain in old age','老来登雪山')}}]},
  {l:T('Stay home after all','到底还是没去'),out:[
   {w:1,t:T('You plant a tree instead. It is not the sea, but it is something.','你种了一棵树。不是大海，但也算一点什么。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.t.heart*.15,t:T('You describe the place so often to the neighbours’ children that one of them grows up and goes there for you.','你跟邻居家的孩子讲那个地方讲了太多遍，后来其中一个长大了，替你去了。'),c:'good',fx:{happy:4}}]}]});

/* old friends’ funerals */
I({id:'rg_funeral',age:[50,95],cd:6,w:1.8,when:s=>living(s,['friend','sworn']).some(p=>p.age>=45),ctx:s=>{const c=scene();c.p=pick(living(s,['friend','sworn']).filter(p=>p.age>=45));return c},
 text:c=>T(`A letter edged in white: ${rgPN(c.p).en} has died, quietly, in ${PRON[c.p.sex].his} sleep. The funeral is in five days, three hundred miles away.`,`一封白边的信：${rgPN(c.p).zh}走了，睡梦里走的，走得很安静。五天后出殡，在三百里外。`),
 opts:[{l:T('Go, whatever it costs','不管多远都要去'),cost:20,out:[
   {w:s=>1+s.t.heart*.15,t:T('You arrive on the last morning. You say a few words that make everyone laugh, and then nobody can stop crying.','你在最后一天早上赶到了。你说了几句话，说得大家都笑了，然后谁也止不住哭。'),c:'good',fx:{happy:-4,align:2,f:(s,c)=>rgDie(s,c.p)}},
   {w:s=>1.1-s.health/200,t:T('The road nearly kills you. You arrive a day late and sit by the fresh grave until dark.','这一路差点要了你的命。你晚到了一天，在新坟边坐到天黑。'),c:'muted',fx:{happy:-7,hurt:[5,12],cause:T('a long road in old age','老来远行'),f:(s,c)=>rgDie(s,c.p)}}]},
  {l:T('Pour a cup of wine at home','在家里洒一杯酒'),out:[
   {w:1,t:T('You pour two cups, as you always did, and drink them both.','你像从前一样倒了两杯，自己一杯一杯都喝了。'),c:'muted',fx:{happy:-6,f:(s,c)=>rgDie(s,c.p)}},
   {w:s=>s.smarts/60,t:T('You write a long letter to the family about who your friend was when young. They read it at the graveside.','你给那家人写了一封长信，讲你朋友年轻时是什么样子。他们在坟前念了。'),c:'good',fx:{happy:-3,align:1,f:(s,c)=>rgDie(s,c.p)}}]}]});

/* a young stranger who says they are your child */
I({id:'rg_claimchild',age:[45,80],cd:40,once:1,w:1,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(18,28)});c.real=chance(.25+s.t.luck*.01+(living(s,['ex','lover']).length?.2:0));return c},
 text:c=>T(`A young stranger, ${c.npc.en}, stands at your gate with a faded token: something you gave away a lifetime ago. “My mother said that if I ever needed anything, I should find the person who left this.”`,`门口站着一个陌生的年轻人${c.npc.zh}，手里攥着一件褪了色的信物——是你大半辈子前送出去的东西。“我娘说，要是哪天走投无路，就去找留下这个的人。”`),
 opts:[{l:T('Take them in','收留'),out:[
   {w:1,t:(c,s)=>c.real?T('It takes a year for either of you to say the word. When it comes it feels like something you always knew.','两个人花了一年才叫出那个称呼。叫出口时，好像本来就该这样。'):T('Whether it is true or not stops mattering. You have someone at your table who calls you family.','真的假的，后来都不重要了。你的饭桌上，多了一个把你当家人的人。'),c:'good',fx:{happy:7,meet:'child',bond:65}},
   {w:s=>1-s.smarts/120,t:T('Six months later the young stranger is gone, and so is the silver under your floor. The token, you notice, was left behind.','半年后，那年轻人走了，你埋在地板下的银子也跟着走了。那件信物倒是留下了。'),c:'bad',fx:{f:s=>pay(s,-Math.min(s.money,Math.round(s.money*.4)+20)),happy:-6}}]},
  {l:T('Ask questions only the truth could answer','问几件只有真相才答得上的事'),out:[
   {w:(s,c)=>(c.real?3:1)*(s.smarts/40),t:(c,s)=>c.real?T('The answers are right: the river, the song, the name of a dog. Your knees give way. You have a child.','答得全对：那条河，那首歌，那条狗的名字。你腿一软——你真有个孩子。'):T('The answers are wrong in small, rehearsed ways. You give the young con artist ten taels and a lecture.','答案处处差一点，像是背过的。你给了这小骗子十两银子，外加一顿教训。'),c:'muted',fx:(s,c)=>c.real?{happy:8,meet:'child',bond:55}:{money:-10,smarts:1}},
   {w:1,t:T('The young stranger hears the suspicion in your voice and walks away before you finish. You never learn the truth.','年轻人听出了你话里的怀疑，你话还没问完就转身走了。真相你一辈子也没弄清。'),c:'muted',fx:{happy:-4}}]},
  {l:T('Send them away','打发走'),out:[
   {w:1,t:T('You close the gate. It is a long time before you can sleep.','你关上了门。很久很久才睡着。'),c:'muted',fx:{happy:-3,align:-2}},
   {w:s=>s.t.luck*.1,t:T('Years later you hear of a young escort guard with your eyes and your temper. You never go to find out.','多年以后，你听说有个年轻镖师，眼睛像你，脾气也像你。你始终没去打听。'),c:'muted',fx:{happy:-5}}]}]});

/* returning to your birthplace */
I({id:'rg_homecoming',age:[50,90],cd:25,once:1,w:1.2,
 text:()=>T('You go back to the village where you were born. The well is where it was. Almost nothing else is.','你回到了出生的村子。井还在老地方，别的几乎全变了。'),
 opts:[{l:T('Find someone who remembers you','找个还记得你的人'),out:[
   {w:s=>1+s.fame/40+s.t.luck*.1,t:T('An old woman squints at you and says your childhood name, the embarrassing one. You laugh until you have to sit on the well.','一个老太太眯着眼瞧了你半天，叫出了你的小名——最丢人的那个。你笑得只好扶着井沿坐下。'),c:'good',fx:{happy:8}},
   {w:1,t:T('Nobody does. You are a stranger asking odd questions. You buy a bowl of noodles at a stall where your house used to be.','一个也没有。你只是个打听怪事的外乡人。你在你家老宅原址上的面摊吃了碗面。'),c:'muted',fx:{happy:-3}}]},
  {l:T('Pay for the village school','出钱修村塾'),cost:80,out:[
   {w:s=>1+s.align/40,t:T('They carve your name on the gate, spelled wrong. You decide not to correct it.','他们把你的名字刻在门楣上，刻错了一个字。你决定不去纠正。'),c:'good',fx:{fame:2,align:5,happy:5}},
   {w:1,t:T('The headman spends half of it on his own roof. The school gets built anyway, smaller than you hoped.','村长拿一半钱修了自家屋顶。学堂还是盖起来了，比你想的小。'),c:'muted',fx:{align:3,happy:1}}]}]});

/* dividing your property */
I({id:'rg_estate',age:[58,92],cd:20,w:1.2,when:s=>s.money>=300||owned(s,'house').length>0,
 text:()=>T('The family gathers more often these days, and the talk keeps drifting to what you will leave behind.','这些日子家里人来得勤了，说着说着，话头总往你身后的东西上绕。'),
 opts:[{l:T('Divide it fairly now, while you are alive','趁活着，公平分好'),out:[
   {w:s=>1+s.smarts/40+s.t.heart*.1,t:T('You write it out plainly, read it aloud, and keep enough to live on. Everyone grumbles a little, equally. Peace returns to the house.','你写得明明白白，当众念了，自己留足养老的钱。人人都嘟囔几句，一样多。家里又太平了。'),c:'good',fx:{happy:5,f:s=>pay(s,-Math.round(s.money*.4))}},
   {w:1,t:T('The fair shares turn out to be unfair to everyone. Two of them stop speaking to each other, and you are blamed for it.','公平分下来，结果谁都觉得不公平。有两个从此不说话了，还都怪你。'),c:'bad',fx:{happy:-5,f:s=>{pay(s,-Math.round(s.money*.4));living(s,'child').forEach(p=>addBond(p,-6))}}}]},
  {l:T('Give it to a temple and a free clinic instead','捐给寺庙和义诊堂'),out:[
   {w:s=>1+s.align/40,t:T('The abbot weeps; your relatives do not. But the clinic treats a thousand people the next winter.','方丈哭了，你的亲戚们可没哭。可那间义诊堂第二年冬天救治了上千人。'),c:'good',fx:{align:8,fame:3,f:s=>{pay(s,-Math.round(s.money*.6));living(s,['child','sibling']).forEach(p=>addBond(p,-10))}}},
   {w:1,t:T('Your relatives take the temple to court. The case outlives your patience, and nearly you.','亲戚们把寺庙告上了公堂。官司拖得你心力交瘁，差点比你命还长。'),c:'muted',fx:{align:4,happy:-6,f:s=>pay(s,-Math.round(s.money*.3))}}]},
  {l:T('Keep everything and say nothing','什么都不分，一字不提'),out:[
   {w:s=>1+s.t.luck*.1,t:T('The visits continue, very attentive. You enjoy being courted far more than you should.','家里人照来不误，殷勤得很。被人这么巴结着，你享受得有点过分了。'),c:'muted',fx:{happy:3}},
   {w:1,t:T('Someone starts going through your chests when they think you are asleep. You buy a very good lock.','有人趁你睡着翻你的箱子。你买了一把上好的锁。'),c:'bad',fx:{happy:-4,money:-10}}]}]});
