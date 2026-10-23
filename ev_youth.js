/* 江湖一生 · childhood, youth and family: kites in the wrong tree, the school ruler, first letters, fires, debts,
   the family trade, the secrets parents keep, and later the children of your own who do exactly what you did */
'use strict';
const YT_kid=(s,a,b)=>living(s,'child').filter(p=>p.age>=a&&p.age<=b);
const YT_par=s=>living(s,'father')[0]||living(s,'mother')[0];
const YT_pn=p=>p.rel==='father'?T('your father','你爹'):T('your mother','你娘');
const YT_kn=k=>T(`your ${k.sex==='m'?'son':'daughter'} ${k.n.py}`,`你${k.sex==='m'?'儿子':'女儿'}${k.n.cn}`);
const YT_sn=p=>T(`your ${p.sex==='m'?'brother':'sister'} ${p.n.py}`,`${p.sex==='m'?'哥哥':'姐姐'}${p.n.cn}`);
const YT_sb=(c,t)=>{const m=c.p&&c.p.sex==='m';const f=x=>x.replace(/\{S\}/g,m?'brother':'sister').replace(/\{H\}/g,m?'him':'her').replace(/\{he\}/g,m?'he':'she');return T(f(t.en),t.zh.replace(/\{S\}/g,m?'哥哥':'姐姐'))};
const YT_opp=s=>s.gender==='m'?'f':'m';
const YT_FEST={
 central:[T('the temple fair, where the boys race on stilts down the main street','庙会上，半大孩子踩着高跷沿大街赛跑'),'power'],
 jiangnan:[T('the Double Fifth, when dragon boats race on the canal and anyone young enough can grab an oar','端午节赛龙舟，半大孩子谁抢到桨谁就能上船'),'power'],
 shu:[T('the Lantern Festival, with a riddle contest under the old banyan by the bridge','元宵灯会，桥头老黄桷树底下摆了猜灯谜的擂台'),'smarts'],
 north:[T('the summer fair out past the wall, with a horse race for anyone under twenty','关外的夏日集会，有一场专给二十岁以下的人跑的赛马'),'power'],
 west:[T('the oasis harvest feast, with a dancing contest under the grape arbour','绿洲的丰收宴，葡萄架下比跳舞'),'looks'],
 miao:[T('the Sisters’ Meal festival, when the young people sing to each other across the river','姊妹节，青年男女隔着河对歌'),'looks'],
 east:[T('the sea-god festival, with a swim out to the red buoy and back','祭海节，比谁先游到红浮标再游回来'),'power'],
 capital:[T('the Lantern Festival in the capital, where rich houses hang prizes under the hardest riddles','京城元宵灯会，大户人家在最难的灯谜底下挂了彩头'),'smarts']};
const YT_fw=s=>{const f=(YT_FEST[s.region]||YT_FEST.central)[1];return f==='smarts'?s.smarts/22:f==='looks'?s.looks/22:power(s)/12+s.t.root*.15};

/* ======================= small moments ======================= */
I({id:'yt_kite',age:[5,10],cd:20,w:1.2,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:s.gender==='m'?21:20,age:s.age});return c},
 text:()=>T('Your kite snaps its string and comes down in the courtyard of the richest house on the street, tangled in an old locust tree.','你的风筝断了线，一头栽进街上最阔气那户人家的院子，挂在一棵老槐树上。'),
 opts:[{l:T('Climb the wall','翻墙进去'),out:[
   {w:s=>.6+s.t.luck*.15,t:T('Over the wall, up the tree, back over the wall. Nobody sees. You feel like a cat burglar for a week.','翻墙，上树，再翻回来，神不知鬼不觉。你得意了整整一个礼拜，觉得自己是个飞贼。'),c:'good',fx:{happy:4}},
   {w:1.1,t:T('A branch gives way. You land in their fishpond, and the steward hauls you home by the ear.','树枝断了，你掉进人家的鱼池，被管家揪着耳朵送回了家。'),c:'bad',fx:{happy:-3,hurt:[2,6],cause:T('a fall from a tree','从树上摔下')}},
   {w:s=>s.t.heart*.08,t:c=>T(`The family’s child, ${c.npc.en}, catches you in the tree, and instead of shouting, climbs up to help. You fly the kite together all afternoon.`,`那家的孩子${c.npc.zh}撞见你骑在树上，非但没喊人，还爬上来帮你解线。那天下午你们俩一起放风筝。`),c:'good',fx:{happy:5,meet:'friend',bond:55}}]},
  {l:T('Knock at the gate and ask','规规矩矩去敲门'),out:[
   {w:s=>s.looks/35+s.smarts/50,t:T('The old gatekeeper fetches it with a bamboo pole and gives you a sesame cake for your manners.','看门的老头拿竹竿替你够了下来，还夸你懂礼数，塞给你一块芝麻饼。'),c:'good',fx:{happy:4}},
   {w:1.3,t:T('The gate slams in your face. Next morning your kite is lying in the street, stamped flat.','大门砰地关上了。第二天一早，你的风筝躺在街上，被踩得稀烂。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Go home and build a better one','回家做个更好的'),out:[
   {w:s=>s.smarts/30,t:T('You split the bamboo thinner and paste the paper tighter. The new kite climbs higher than anyone’s on the street.','你把竹篾削得更细，糊纸糊得更紧。新风筝飞得比整条街谁的都高。'),c:'good',fx:{smarts:2,happy:3}},
   {w:1,t:T('It is heavier than the last one and refuses to leave the ground. You learn a great deal about wind.','新做的比旧的还沉，死活飞不起来。你倒是把风琢磨透了。'),c:'muted',fx:{smarts:1,happy:-1}}]}]});

I({id:'yt_pet',age:[4,12],cd:20,w:1.1,
 text:()=>T('Ahuang, the yellow dog who has slept at the foot of your bed since you could walk, has been gone for three days.','阿黄是条大黄狗，从你会走路起就趴在你床脚睡。它已经三天没回来了。'),
 opts:[{l:T('Search the hills','上山去找'),out:[
   {w:s=>.6+s.t.luck*.2,t:T('You find him on the second ridge with his leg in a hunter’s snare, thin and furious. You work him loose and carry him half the way home.','你在第二道山梁上找到它，一条腿卡在猎户的套子里，饿瘦了，脾气大得很。你把它解下来，一半路是抱着回来的。'),c:'good',fx:{happy:6,align:1}},
   {w:1,t:T('A monk at the hill temple has been feeding him. Ahuang comes home with you, fat and smelling of incense, and visits the temple every week after that.','原来山上庙里的和尚一直在喂它。阿黄跟你回了家，胖了一圈，一身香火味，从此每个礼拜都要往庙里跑一趟。'),c:'muted',fx:{happy:3}},
   {w:.7,t:T('You get lost yourself and spend a cold night under a rock. When you finally stumble home, Ahuang is asleep on your bed.','你自己倒先迷了路，在石头底下冻了一夜。等你一瘸一拐回到家，阿黄正睡在你床上。'),c:'bad',fx:{happy:-2,ill:'cold'}}]},
  {l:T('Put up a notice by the well','在井边贴告示'),out:[
   {w:s=>s.smarts/25,t:T('The butcher’s boy reads it and says he saw a yellow dog by the mill. He is right.','屠户家的小子看了告示，说在磨坊边见过一条黄狗。还真是。'),c:'good',fx:{happy:5,smarts:1}},
   {w:1.2,t:T('Your handwriting is so bad that people think a child has gone missing. Half the village turns out to search. Ahuang trots home on his own at dusk, and everyone looks at you.','你的字写得实在太丑，大伙儿以为是谁家孩子丢了，半个村子都出来找。傍晚阿黄自己溜达回来了，所有人都看着你。'),c:'muted',fx:{happy:-1,fame:1}}]},
  {l:T('Wait for him at the gate','守在门口等'),out:[
   {w:s=>s.t.heart*.2,t:T('On the fifth night he limps in, tail going, as if nothing happened.','第五天夜里，它一瘸一拐地回来了，尾巴摇得欢，好像什么事都没有。'),c:'good',fx:{happy:5}},
   {w:1,t:T('He never comes back. Your grandmother says old dogs go away so the children won’t have to watch. You wait at the gate for a long time anyway.','它再也没回来。奶奶说，老狗是怕孩子看着难过，才自己走远的。你还是在门口守了很久。'),c:'bad',fx:{happy:-6,smarts:1}}]}]});

I({id:'yt_ruler',age:[6,12],cd:6,w:1.2,when:s=>s.family!=='beggar',
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:1,sex:'m',age:rint(50,66)});c.kid=npc(s,{occ:21,sex:'m',age:s.age});return c},
 text:c=>T(`At the village school, Master ${c.npc.n.sur[1]} catches you with a storybook about swordsmen tucked inside your copy of the Analects. He holds out his hand for the ruler.`,`村塾里，${c.npc.n.sur[0]}先生发现你把一本武侠话本夹在《论语》里偷看。他伸手去拿戒尺。`),
 opts:[{l:T('Hold out your palm','伸出手掌'),out:[
   {w:s=>s.t.heart*.25,t:T('After the third stroke he stops, flips through the book, and asks if you have reached the part where the swordsman repays his debt. He keeps the book. The next day there is a note in it with his own opinion of the ending.','打到第三下他停了手，翻了翻那本书，问你看到那剑客报恩那一回没有。书他没收了。第二天书还回来，里头夹了张纸条，写着他对结局的看法。'),c:'good',fx:{smarts:2,happy:1}},
   {w:1.3,t:T('Ten strokes. Your palm is so swollen you hold your chopsticks in the wrong hand for three days.','整整十下。手掌肿得老高，你左手拿了三天筷子。'),c:'bad',fx:{happy:-4,hurt:[1,3],cause:T('the teacher’s ruler','先生的戒尺')}}]},
  {l:T('Recite today’s lesson to prove you were listening','把今天的课背一遍，证明你在听'),out:[
   {w:s=>s.smarts/22,t:T('Word-perfect. The room goes silent. He puts the ruler down without a word, and next week you have been moved to the front row.','一字不差。满屋鸦雀无声。他一句话没说，把戒尺放下了。下个礼拜，你被调到了头一排。'),c:'good',fx:{smarts:3,happy:3}},
   {w:1.2,t:T('You stumble on the second line. Double strokes, and the whole afternoon standing in the yard.','第二句就卡壳了。戒尺加倍，还在院子里罚站了一下午。'),c:'bad',fx:{happy:-5}}]},
  {l:T('Say it belongs to the boy next to you','说是旁边那个男孩的'),out:[
   {w:s=>s.smarts/45+s.t.luck*.08,t:c=>T(`He believes you. ${c.kid.en} gets the ruler; you keep the book. Somehow the rest of it is not as good as the beginning.`,`先生信了。挨打的是${c.kid.zh}，书留在了你手里。不知怎么，后半本远没有前半本好看。`),c:'muted',fx:{align:-3,happy:1}},
   {w:1.4,t:c=>T(`${c.kid.en}’s ears go red. He reaches into your desk and pulls out volume two. You are beaten twice, and he does not speak to you again for years.`,`${c.kid.zh}的耳朵涨得通红，伸手从你桌肚里掏出了下一册。你挨了两顿打，他好几年没再跟你说过话。`),c:'bad',fx:{align:-2,happy:-4,f:(s,c)=>storeNpc(s,{npc:c.kid},'rival',20)}}]}]});

I({id:'yt_fairlost',age:[4,8],cd:30,once:1,w:1.2,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,sex:'m',age:rint(55,70)});return c},
 text:()=>T('At the fair you let go of your mother’s hand to watch a man swallow a sword. When you turn round, the crowd is a forest of legs, and none of them are hers.','赶集那天，你松开娘的手去看一个汉子吞宝剑。等你回过头，眼前全是大人的腿，没有一条是娘的。'),
 opts:[{l:T('Stay exactly where you are','站在原地不动'),out:[
   {w:s=>1+s.t.luck*.2,t:T('She finds you inside the hour, smacks you once and holds on so tight it hurts.','不到一个时辰娘就找来了，先给了你一巴掌，又把你搂得生疼。'),c:'good',fx:{happy:2}},
   {w:.8,t:T('A woman in a fine jacket offers you candy and says she knows where your mother is. A constable’s dog starts barking at her, and she is suddenly gone. Your mother finds you at dusk. You never forget that woman’s smile.','一个穿得体面的女人塞给你糖，说知道你娘在哪儿。旁边一个捕快牵的狗冲她狂吠，她一下子就不见了。天擦黑娘才找到你。那女人的笑，你一辈子都忘不了。'),c:'bad',fx:{happy:-4,f:s=>addCond(s,'shaken',1)}}]},
  {l:T('Follow a kind-looking old man','跟着一个面善的老爷爷走'),out:[
   {w:s=>.6+s.t.luck*.15+s.align/100,t:c=>T(`${c.npc.en} buys you a sugar figure and walks you to the opera stage, where the announcer bellows your description over the crowd. Your mother comes running.`,`${c.npc.zh}给你买了个糖人，领你到戏台边上。报幕的扯着嗓子把你的模样喊了一遍，娘就从人堆里跑过来了。`),c:'good',fx:{happy:4,meet:'acq',bond:50}},
   {w:1,t:T('He walks you away from the crowd, towards the river, and his grip gets tighter. You bite his hand as hard as you can and run. You find your own way home at midnight.','他领着你离人群越来越远，往河边走，手越攥越紧。你使出吃奶的劲咬了他一口，撒腿就跑。半夜，你自己摸回了家。'),c:'bad',fx:{happy:-5,smarts:2,f:s=>addCond(s,'shaken',1)}}]},
  {l:T('Climb onto the opera stage to look for her','爬上戏台去找她'),out:[
   {w:s=>.4+s.looks/35,t:T('The actors let you stand at the front of the stage while the whole fair laughs. Your mother sees you from a mile off. The troupe master pinches your cheek: “This one has a face for the stage.”','戏班的人让你站在台口，满场都在笑。娘老远就看见了你。班主捏了捏你的脸："这孩子，天生一张唱戏的脸。"'),c:'good',fx:{happy:4,looks:1}},
   {w:1,t:T('You trip over a drum in the middle of a battle scene and bring down half the scenery. Your mother hears the commotion from the noodle stall.','你在一场武戏中间绊倒了大鼓，撞塌了半边布景。娘在面摊那头听见动静，赶了过来。'),c:'muted',fx:{happy:-1,hurt:[1,4],cause:T('a fall from a stage','从戏台上摔下')}}]}]});

I({id:'yt_grandstory',age:[6,16],once:1,w:1,
 ctx:s=>{const c=scene();c.gm=chance(.6);return c},
 text:c=>T(`Your ${c.gm?'grandmother':'grandfather'} is dying, and of all the grandchildren asks for you to sit by the bed. “I’ll tell you one I never told anyone.”`,`${c.gm?'奶奶':'爷爷'}快不行了，那么多孙辈，偏偏叫你守在床边。"给你讲个我从没跟人讲过的。"`),
 opts:[{l:T('Sit and listen all night','守着听了一整夜'),out:[
   {w:s=>s.t.heart*.25,t:c=>T(`It is about ${c.gm?'her':'his'} own youth: a knife-thrower in a travelling show, a pursuit across three provinces, a choice made on a bridge in the rain. By morning ${c.gm?'she is':'he is'} gone, and you understand the old scar on ${c.gm?'her':'his'} wrist.`,`讲的是${c.gm?'她':'他'}年轻时候的事：在走江湖的杂耍班子里扔飞刀，被人追了三个省，雨夜里在一座桥上做了个决定。天亮时${c.gm?'她':'他'}走了。你这才明白${c.gm?'她':'他'}手腕上那道老疤是怎么来的。`),c:'good',fx:{happy:-3,smarts:2,align:2}},
   {w:1,t:T('Halfway through, the voice drifts into sleep and does not come back. For years you try to make up the ending.','讲到一半，声音慢慢弱下去，再没醒来。往后好多年，你一直在替这个故事编结局。'),c:'muted',fx:{happy:-4,smarts:1}},
   {w:s=>s.t.luck*.1,t:T('The story ends with a jar of silver buried under the plum tree “for whoever listened to the end.” You dig. It is there.','故事的结尾，是梅树底下埋着一坛银子，"留给听到最后的那个人"。你去挖了，真有。'),c:'gold',fx:{happy:2,money:[30,80]}}]},
  {l:T('Slip out to play with your cousins','溜出去和表兄弟们玩'),out:[
   {w:1.5,t:T('By dawn it is too late. At the funeral the grown-ups argue in low voices about “the story” and look at you strangely.','天亮时已经晚了。出殡那天，大人们压低了声音争论"那个故事"，一边拿眼睛瞟你。'),c:'bad',fx:{happy:-6,align:-1}},
   {w:s=>s.t.luck*.15,t:T('Still alive at dawn, and laughing at you. You get a shorter version, mostly about a stolen chicken. A few days later the house is quiet.','天亮时还在，还笑话你。你听到的是个短得多的版本，大半是在讲偷鸡。过了几天，家里安静了。'),c:'muted',fx:{happy:-2}}]}]});

I({id:'yt_letter',age:[13,19],cd:8,w:1.2,tags:['town'],when:s=>!spouseOf(s),
 ctx:s=>{const c=scene();c.npc=npc(s,{sex:YT_opp(s),age:clamp(s.age+rint(-1,2),13,22),occ:s.gender==='m'?pick([12,20,6]):pick([1,11,13])});return c},
 text:c=>T(`You have written three drafts of a letter to ${c.npc.en}, who lives across the lane. The fourth is in your sleeve.`,`你给住在对门巷子的${c.npc.zh}写了三遍信，第四遍揣在袖子里。`),
 opts:[{l:T('Hand it over yourself','亲手交给对方'),out:[
   {w:s=>s.looks/30+s.t.heart*.1,t:c=>T(`${c.npc.en} reads it right there, goes red, and writes on the back: “Tomorrow, by the well.”`,`${c.npc.zh}当场就看了，脸一下红了，在信背面写了一行："明天，井边。"`),c:'good',fx:{happy:7,meet:'lover',bond:55}},
   {w:1.3,t:c=>T(`${c.npc.en} reads it, and says no, kindly. That is almost worse. ${c.npc.He} keeps the letter, though.`,`${c.npc.zh}看完，很客气地拒绝了。这比不客气还难受。不过那封信，${c.npc.ta}留下了。`),c:'muted',fx:{happy:-4}}]},
  {l:T('Get a friend to pass it on','托朋友转交'),out:[
   {w:1,t:T('Your friend reads it aloud to the whole lane first. You will hear your own sentences quoted back at you until you are thirty.','朋友先在整条巷子里大声念了一遍。往后十几年，你都会时不时听见有人背你信里的句子。'),c:'bad',fx:{happy:-6,fame:1}},
   {w:s=>s.t.luck*.2,t:c=>T(`Your friend does it properly, for once. A reply comes back the same way, folded into a tiny square. ${c.npc.en} has terrible handwriting and wonderful things to say.`,`朋友难得靠谱了一回。回信也是这么递回来的，折成小小一方。${c.npc.zh}字写得很丑，话说得很好。`),c:'good',fx:{happy:6,meet:'lover',bond:45}}]},
  {l:T('Rewrite it as a poem','改写成一首诗'),out:[
   {w:s=>s.smarts/25,t:c=>T(`It is a good poem. ${c.npc.en} copies it out in ${c.npc.his} own hand and keeps it in a box for the rest of ${c.npc.his} life.`,`那是首好诗。${c.npc.zh}亲手抄了一遍，放在匣子里收了一辈子。`),c:'good',fx:{smarts:1,happy:5,meet:'lover',bond:50}},
   {w:1.2,t:c=>T(`It is not a good poem. ${c.npc.en}’s father finds it first and brings it round to read to your parents.`,`那可算不上好诗。偏偏让${c.npc.zh}的爹先看见了，拿着上门念给你爹娘听。`),c:'bad',fx:{happy:-5}}]},
  {l:T('Burn it','烧了'),out:[
   {w:1,t:T('You watch the ashes go up the chimney. Years later you still remember the last line.','你看着纸灰顺着烟囱飘上去。多年以后，最后那句你还记得。'),c:'muted',fx:{happy:-2,smarts:1}},
   {w:s=>s.t.luck*.12,t:c=>T(`The wind lifts one half-burnt page over the wall into ${c.npc.en}’s yard. For weeks ${c.npc.he} smiles at you in a way you cannot explain.`,`一阵风把一张烧了一半的信纸刮过墙，落进了${c.npc.zh}家院子。好几个礼拜，${c.npc.ta}见了你总是笑，笑得你莫名其妙。`),c:'good',fx:{happy:3,meet:'lover',bond:40}}]}]});

I({id:'yt_sibblame',age:[6,14],cd:8,w:1.1,when:s=>living(s,'sibling').length>0&&!!YT_par(s),
 ctx:s=>({p:pick(living(s,'sibling')),par:YT_par(s)}),
 text:c=>T(`${YT_pn(c.par).en[0].toUpperCase()+YT_pn(c.par).en.slice(1)}’s favourite teapot lies in pieces on the floor. ${YT_sn(c.p).en[0].toUpperCase()+YT_sn(c.p).en.slice(1)} points straight at you.`,`${YT_pn(c.par).zh}最心爱的那把紫砂壶碎了一地。${YT_sn(c.p).zh}伸手就指着你。`),
 opts:[{l:T('Take the blame','认了'),out:[
   {w:s=>s.t.heart*.25,t:c=>YT_sb(c,T('You are punished. For a month afterwards your {S} quietly slides meat into your bowl at every meal.','你挨了罚。之后一个月，{S}每顿饭都悄悄往你碗里拨肉。')),c:'good',fx:{align:2,happy:-1,f:(s,c)=>addBond(c.p,15)}},
   {w:1,t:T('You are punished. Next month it happens again, with a vase.','你挨了罚。下个月，又碎了一只花瓶，又是你。'),c:'bad',fx:{align:1,happy:-4,f:(s,c)=>addBond(c.p,-3)}}]},
  {l:T('Tell the truth','说实话'),out:[
   {w:s=>.4+s.smarts/30,t:c=>YT_sb(c,T('You point out the tea stains on your {S}’s sleeve. Case closed. Your {S} sulks for a week.','你指了指{S}袖口上的茶渍，真相大白。{S}跟你怄了一个礼拜的气。')),c:'muted',fx:{happy:1,f:(s,c)=>addBond(c.p,-8)}},
   {w:1.2,t:T('Nobody believes either of you, so you are both punished. Kneeling side by side, you start giggling and cannot stop.','谁也不信谁，干脆两个一起罚。并排跪着跪着，你们俩憋不住笑了起来，越笑越停不下。'),c:'muted',fx:{happy:-1,f:(s,c)=>addBond(c.p,5)}}]},
  {l:c=>YT_sb(c,T('Make a deal with your {S}','跟{S}私下讲条件')),out:[
   {w:s=>s.smarts/30,t:T('You both swear the cat did it. The cat is banished to the woodshed for a week, and you owe each other forever.','你们俩一口咬定是猫干的。猫被关进柴房一个礼拜，你们俩从此互相欠着一笔账。'),c:'good',fx:{happy:3,f:(s,c)=>addBond(c.p,8)}},
   {w:1,t:T('The price of silence is your new pocket knife. You pay it, and are punished anyway when the story leaks.','封口费是你那把新小刀。刀给了，事情还是漏了，罚也照样挨。'),c:'bad',fx:{happy:-3,f:(s,c)=>addBond(c.p,2)}}]}]});

I({id:'yt_festival',age:[6,18],cd:5,w:1,
 ctx:s=>{const c=scene();c.f=(YT_FEST[s.region]||YT_FEST.central)[0];c.npc=npc(s,{occ:s.age<14?pick([20,21]):pick([1,13,14,15,17]),age:clamp(s.age+rint(-2,2),6,20)});return c},
 text:c=>T(`It is ${c.f.en}.`,`正赶上${c.f.zh}。`),
 opts:[{l:T('Enter the contest','报名参加'),out:[
   {w:s=>YT_fw(s),t:T('You win. A prize, a cheer, and for a few days the other children walk a little behind you.','你赢了。拿了彩头，满场喝彩，那几天别的孩子走路都落你半步。'),c:'gold',fx:{happy:6,fame:1,money:[5,20]}},
   {w:1.3,t:T('You come nowhere, but you come nowhere loudly, and an old woman gives you a dumpling for effort.','你连名次都没摸着，不过输得很热闹，一位老婆婆说你卖力气，赏了你一个粽子。'),c:'muted',fx:{happy:1}},
   {w:.4,t:T('You go at it too hard and come away with a twisted ankle and a story.','你使过了劲，扭了脚脖子，捞回来一段谈资。'),c:'bad',fx:{hurt:[2,5],cause:T('a festival contest','节庆比赛'),happy:-1}}]},
  {l:T('Watch from the side with a bag of snacks','揣一包零嘴在边上看'),out:[
   {w:1,t:T('A long, bright, greasy day. You fall asleep on the way home.','热闹、油乎乎、亮堂堂的一天。回家路上你就睡着了。'),c:'muted',fx:{happy:3}},
   {w:s=>s.t.luck*.12+s.looks/80,t:c=>T(`${c.npc.en}, also watching, keeps stealing your snacks and then offers you half a skewer of candied haws as payment. You are friends by sunset.`,`边上同样在看热闹的${c.npc.zh}一直偷吃你的零嘴，后来分了你半串糖葫芦算是赔账。太阳落山前，你们已经成了朋友。`),c:'good',fx:{happy:4,meet:'friend',bond:50}}]}]});

I({id:'yt_market',age:[8,14],cd:8,w:1.1,when:s=>!['noble','temple'].includes(s.family),
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:17,sex:'m',age:rint(30,50)});c.g=s.family==='hunter'?T('two rabbit pelts','两张兔皮'):s.family==='merchant'?T('a basket of tea bricks','一筐茶砖'):T('a basket of eggs','一篮鸡蛋');return c},
 text:c=>T(`You are sent to market alone with ${c.g.en}. A smooth-talking peddler, ${c.npc.en}, offers you a packet of “golden melon seeds” for the lot.`,`家里头一回让你一个人拿着${c.g.zh}上集。一个油嘴滑舌的货郎${c.npc.zh}凑过来，要拿一包"金瓜籽"换你全部的东西。`),
 opts:[{l:T('Make the trade','换了'),out:[
   {w:s=>s.t.luck*.12,t:T('Against all reason, the seeds grow into the biggest melons the village has ever seen. Your family never lets you forget it, in a good way.','说来没道理，那包籽真结出了村里从没见过的大瓜。家里人从此逢人就提这事，提得很得意。'),c:'gold',fx:{happy:5,money:[20,45]}},
   {w:2,t:T('They are pumpkin seeds dyed with turmeric. The beating at home is memorable. So is the lesson.','是拿姜黄染过的南瓜子。回家那顿打记忆犹新，那个教训也是。'),c:'bad',fx:{happy:-5,smarts:2}}]},
  {l:T('Sell your goods properly','老老实实做买卖'),out:[
   {w:s=>s.smarts/25,t:T('You haggle like an old aunt and sell out by noon. Even the peddler buys some, shaking his head.','你砍起价来像个老婶子，不到晌午就卖光了。连那货郎都摇着头买了几个。'),c:'good',fx:{money:[5,15],smarts:1,happy:2}},
   {w:1,t:T('A cart clips your basket. You sell what is left at half price and walk home slowly.','一辆车蹭翻了你的筐。剩下的你半价卖了，慢吞吞走回家。'),c:'muted',fx:{money:2,happy:-2}}]},
  {l:T('Follow him and watch what he does','跟着他，看他干什么'),out:[
   {w:s=>s.smarts/30+s.t.wit*.1,t:T('You watch him cheat a widow out of her hens, and run for the constable. You get a string of coins and a pat on the head.','你亲眼看着他把一个寡妇的母鸡骗走了，撒腿去叫了捕快。你得了一串铜钱，还被摸了摸脑袋。'),c:'good',fx:{money:10,align:3,fame:1}},
   {w:1,t:T('He spots you tailing him and cuffs your ear so hard it rings until evening.','他发现你在后头跟着，一巴掌扇在你耳朵上，嗡嗡响到天黑。'),c:'bad',fx:{happy:-2,hurt:[1,4],cause:T('a peddler’s cuff','货郎一巴掌')}}]}]});

/* ---------- your own children: small ---------- */
I({id:'yt_kidfever',age:[20,65],cd:6,w:5,when:s=>YT_kid(s,0,12).length>0,
 ctx:s=>({k:pick(YT_kid(s,0,12))}),
 text:c=>T(`In the middle of the night ${YT_kn(c.k).en} is burning with fever and will not stop crying. It is pouring rain.`,`半夜里，${YT_kn(c.k).zh}烧得滚烫，哭个不停。外头下着瓢泼大雨。`),
 opts:[{l:T('Run for the doctor','冒雨去请大夫'),out:[
   {w:s=>.8+Math.min(2,s.money/150)+s.fame/60,t:T('The doctor comes, grumbling, with a lantern and a bag of bitter roots. By dawn the fever has broken.','大夫嘟嘟囔囔地来了，提着灯笼和一包苦药根。天亮时烧退了。'),c:'good',fx:{happy:3,f:(s,c)=>{pay(s,-Math.min(s.money,rint(8,30)));addBond(c.k,4)}}},
   {w:s=>s.t.luck<5?1.2:.6,t:T('The doctor is dead drunk. You carry him on your back through the rain. The fever breaks on its own before he wakes up, and you are the one who catches cold.','大夫喝得烂醉。你把他背在背上冒雨往回赶。还没等他醒，孩子的烧自己退了，倒是你着了凉。'),c:'muted',fx:{ill:'cold',f:(s,c)=>addBond(c.k,2)}}]},
  {l:T('Use the old remedy your mother taught you','用你娘教过的土方子'),out:[
   {w:s=>s.smarts/35+s.t.luck*.1,t:T('Ginger, a cold cloth, and you singing the same song four hundred times. It works.','姜汤，冷毛巾，外加你把同一支曲子哼了四百遍。管用了。'),c:'good',fx:{happy:4,f:(s,c)=>addBond(c.k,6)}},
   {w:1,t:T('By dawn it is worse, and you run for the doctor anyway, in daylight, at twice the price.','天亮时烧得更凶了，你还是得去请大夫，白天出诊，价钱翻倍。'),c:'bad',fx:{happy:-4,f:s=>pay(s,-Math.min(s.money,rint(15,45)))}}]},
  {l:T('Push your own qi into the child','以自身内力为孩子退烧'),if:s=>power(s)>=40,out:[
   {w:s=>power(s)/50,t:T('A thread of warmth, slowly, slowly. The child sleeps. You sit up till morning, emptied and very happy.','一缕暖意，慢慢地，慢慢地送进去。孩子睡着了。你坐到天明，浑身发虚，心里却满满的。'),c:'good',fx:{happy:5,qi:-1,f:(s,c)=>addBond(c.k,8)}},
   {w:1,t:T('You push too hard. The fever breaks, but something in your own chest tears.','你用力过猛。孩子的烧退了，你胸口却像有什么撕开了一道口子。'),c:'bad',fx:{happy:1,f:(s,c)=>{addCond(s,'inner',1);addBond(c.k,6)}}}]}]});

I({id:'yt_kidprank',age:[24,70],cd:6,w:5,tags:['town'],when:s=>YT_kid(s,5,13).length>0,
 ctx:s=>{const c=scene();c.k=pick(YT_kid(s,5,13));c.npc=npc(s,{occ:19,age:rint(45,70)});c.what=rint(0,2);return c},
 text:c=>{const w=[['painted a tortoise on his front door','在他家大门上画了只王八'],['let all his chickens out into the street','把他家的鸡全放到了街上'],['put a frog in his teapot','往他茶壶里塞了只青蛙']][c.what];return T(`Your neighbour ${c.npc.en} storms in: ${YT_kn(c.k).en} has ${w[0]}.`,`邻居${c.npc.zh}气冲冲地找上门来：${YT_kn(c.k).zh}${w[1]}。`)},
 opts:[{l:T('Punish the child in front of him','当着他的面教训孩子'),out:[
   {w:1,t:T('The neighbour leaves satisfied. The child does not speak to you until supper.','邻居心满意足地走了。孩子到吃晚饭都不跟你说话。'),c:'muted',fx:{f:(s,c)=>addBond(c.k,-5)}},
   {w:s=>s.t.heart*.15,t:T('The child apologises properly, bowing. The neighbour softens and ends up giving them a sweet. Somehow this becomes a friendship.','孩子规规矩矩鞠躬道了歉。邻居的脸色缓了，最后反倒塞了块糖给孩子。一老一小，竟就此交上了朋友。'),c:'good',fx:{align:1,f:(s,c)=>addBond(c.k,2)}}]},
  {l:T('Pay for the damage','赔钱了事'),out:[
   {w:1,t:T('A few coins and a bow. Behind your back, the child grins, which tells you this will happen again.','赔了几个钱，作了个揖。孩子在你身后咧嘴笑，你就知道这事还没完。'),c:'muted',fx:{money:-10,f:(s,c)=>addBond(c.k,3)}},
   {w:s=>s.fame/30,t:T('He refuses the money: for someone with your name, he says, it is nothing. Then he tells everyone in the street that you offered.','他不肯收钱，说冲你的名头，这算什么。转头就跟整条街的人说你要赔他钱。'),c:'good',fx:{fame:1,f:(s,c)=>addBond(c.k,2)}}]},
  {l:T('Privately admire the work','背地里欣赏一下孩子的手艺'),out:[
   {w:s=>s.smarts/30,t:T('Honestly, it was well done. You buy the child a proper brush, or a proper slingshot, and a direction for all that mischief.','说实话，干得挺漂亮。你给孩子买了支好毛笔，或是一把好弹弓，给那股淘气劲儿指了条正路。'),c:'good',fx:{happy:4,f:(s,c)=>addBond(c.k,8)}},
   {w:1,t:T('Encouraged, the child does it again on the magistrate’s wall. That costs a good deal more.','受了鼓励，孩子转头就在县太爷家墙上又来了一回。这回赔得可就多了。'),c:'bad',fx:{align:-1,f:(s,c)=>{pay(s,-Math.min(s.money,rint(20,50)));addBond(c.k,5)}}}]}]});

/* ======================= medium ======================= */
I({id:'yt_bully',age:[7,14],once:1,w:1.3,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:21,sex:'m',age:s.age+2});return c},
 text:c=>T(`${c.npc.en}, the butcher’s son, has taken your lunch every day for a month. Today he is waiting by the willow again, cracking his knuckles.`,`屠户家的儿子${c.npc.zh}抢了你一个月的午饭。今天他又在柳树底下等着，把指节捏得咔咔响。`),
 opts:[{l:T('Fight him','跟他干一架'),fight:FG(PW(1.05,3),'light',T('Behind the school','学堂后头'),T('the butcher’s son','屠户家的小子')),
   win:[{w:1,t:T('He goes down in the mud and runs off howling. The younger children follow you around for weeks.','他一屁股坐进泥里，嚎着跑了。往后几个礼拜，小孩子们都跟在你屁股后头转。'),c:'good',fx:{happy:5,fame:1}},
    {w:s=>s.t.heart*.15,t:T('When he is down, you offer him a hand up. He stares, takes it, and from then on he walks to school with you.','他倒在地上时，你伸手拉了他一把。他愣了半天，还是握住了。从那以后，他天天跟你一起上学。'),c:'good',fx:{happy:4,meet:'friend',bond:55}}],
   lose:[{w:1,t:T('A black eye, a split lip, and no lunch. Your father asks who did it, and you do not say.','乌眼青，破嘴唇，午饭照样没了。爹问是谁干的，你没说。'),c:'bad',fx:{happy:-4}},
    {w:s=>s.t.heart*.15,t:T('You lose, but you get up three times. After that he leaves you alone, and once, much later, nods at you in the street.','你输了，可你爬起来了三回。从那以后他再没找过你麻烦。很多年后有一回在街上碰见，他还冲你点了点头。'),c:'muted',fx:{happy:1,meet:'rival',bond:40}}]},
  {l:T('Trick him','给他下个套'),out:[
   {w:s=>s.smarts/25,t:T('You fill your dumplings with chilli paste. He eats all four before he understands. He never touches your lunch again.','你往包子里塞满了辣椒酱。他一口气吃了四个才回过味来。从此再没碰过你的饭。'),c:'good',fx:{smarts:2,happy:4}},
   {w:1,t:T('He smells it, and makes you eat them yourself while he watches.','他闻出来了，逼着你当着他的面一个一个吃下去。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Tell the grown-ups','告诉大人'),out:[
   {w:s=>.5+s.t.luck*.1,t:T('His father, red-faced, drags him round to apologise and brings a pound of pork by way of apology.','他爹涨红了脸，揪着他上门赔不是，还拎来一斤猪肉。'),c:'good',fx:{happy:3}},
   {w:1.2,t:T('It gets worse. Now you are a tattletale as well as lunchless.','事情更糟了。如今你不光没饭吃，还落了个告状精的名声。'),c:'bad',fx:{happy:-5}}]},
  {l:T('Share your lunch with him','把午饭分他一半'),out:[
   {w:s=>s.t.heart*.25,t:T('It turns out he is hungry because his father drinks the money. You eat together under the willow every day after that.','原来他是真饿：他爹把钱都喝了酒。从那以后，你们天天在柳树底下一起吃饭。'),c:'good',fx:{align:3,happy:3,meet:'friend',bond:60}},
   {w:1,t:T('He takes your half and then the other half too, laughing.','他接过一半，笑着又把另一半也抢走了。'),c:'bad',fx:{align:1,happy:-3}}]}]});

I({id:'yt_fire',age:[5,16],once:1,w:1.1,when:s=>!!YT_par(s),
 ctx:s=>({p:pick(living(s,'sibling'))||null}),
 text:()=>T('You wake to smoke and an orange light under the door. The house is on fire.','你被呛醒了，门缝底下透着橘红的火光。家里着火了。'),
 opts:[{l:c=>T(`Go back in for ${YT_sn(c.p).en}`,`冲回去找${YT_sn(c.p).zh}`),if:(s,c)=>!!c.p,out:[
   {w:s=>.8+s.t.luck*.15+power(s)/30,t:c=>YT_sb(c,T('You find your {S} coughing under the bed and drag {H} out by the collar. Your arm is burned. Neither of you will ever forget that night.','你在床底下找到咳成一团的{S}，揪着领子拖了出来。你的胳膊烧伤了。这一夜，你们俩谁也忘不掉。')),c:'good',fx:{align:3,fame:1,looks:-1,hurt:[5,12],cause:T('a house fire','家中失火'),deed:T('Pulled a sibling from a burning house','火场中救出手足'),f:(s,c)=>addBond(c.p,20)}},
   {w:1,t:c=>YT_sb(c,T('A beam comes down. A neighbour drags you both out, your back is cut open, and your {S} holds your hand the whole time the doctor stitches it.','一根房梁砸了下来。是邻居把你们俩拖出来的。你后背划开一道大口子，大夫缝针的时候，{S}一直攥着你的手。')),c:'bad',fx:{looks:-3,hurt:[8,15],cause:T('a falling beam','坠落的房梁'),f:(s,c)=>{addCond(s,'wound',1);addBond(c.p,15)}}}]},
  {l:T('Go back in for the money box','冲回去抢钱匣子'),if:(s,c)=>!c.p,out:[
   {w:s=>.6+s.t.luck*.15,t:T('You come out with the box clutched to your chest and your eyebrows gone. Your parents do not know whether to beat you or hug you, and do both.','你抱着钱匣子冲出来，眉毛都烧没了。爹娘不知道该打你还是抱你，干脆两样都来了。'),c:'muted',fx:{money:[10,30],hurt:[3,8],cause:T('a house fire','家中失火')}},
   {w:1,t:T('The smoke gets you halfway. Your father carries you out. The box is ashes.','烟呛得你走不到一半就倒了，是爹把你扛出来的。钱匣子烧成了灰。'),c:'bad',fx:{hurt:[6,12],cause:T('smoke','浓烟'),happy:-4}}]},
  {l:T('Run outside and raise the alarm','冲出去喊人'),out:[
   {w:s=>.5+s.smarts/30,t:T('You bang on every door and get a bucket line going from the well. Half the house is saved, and the old men of the street talk about you for a month.','你挨家挨户砸门，招呼大伙儿从井边排成一溜传水。房子保住了一半，街上的老人们夸了你一个月。'),c:'good',fx:{fame:1,smarts:1,happy:-1}},
   {w:1,t:T('By the time anyone comes, it is too late. You stand in the street in your nightclothes and watch everything go.','等人来了已经晚了。你穿着单衣站在街上，眼看着一切都烧没了。'),c:'bad',fx:{happy:-8,f:s=>pay(s,-Math.min(s.money,rint(10,40)))}}]},
  {l:T('Freeze','吓呆了'),out:[
   {w:1,t:T('Someone scoops you up. You watch the roof fall in from the next yard over. For a long time afterwards you cannot sleep with the lamp out.','有人一把把你抱走了。你在隔壁院子里看着房顶塌下去。那以后很久，你不点灯就睡不着。'),c:'bad',fx:{happy:-6,f:s=>addCond(s,'shaken',1)}},
   {w:s=>s.t.luck*.15,t:T('Then the sky opens: a sudden summer storm. The fire hisses out. Your grandmother says the kitchen god owed the family a favour.','就在这时老天爷开了口子，一场急雨浇下来，火嗤嗤地灭了。奶奶说，这是灶王爷还了咱家一个人情。'),c:'good',fx:{happy:3}}]}]});

I({id:'yt_troupe',age:[8,15],once:1,w:1.2,when:s=>!s.sect,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:30,age:rint(45,60)});return c},
 text:c=>T(`A travelling opera troupe has been in town for a week, and you have been at every show. The troupe master, ${c.npc.en}, has watched you copying the actors’ moves in the alley. “Come with us,” ${c.npc.he} says. “I can make something of you.”`,`一个跑码头的戏班在镇上唱了七天，你一场没落下。班主${c.npc.zh}在巷子里看见你学台上的身段，对你说："跟我们走吧，我能把你调教出来。"`),
 opts:[{l:T('Run away with the troupe','跟戏班走'),out:[
   {w:s=>s.looks/30+s.t.wit*.1,t:T('A season on the road: tumbling at dawn, singing till your throat bleeds, sleeping on the cart. You come home at New Year taller, louder and full of stories.','跑了一季码头：天不亮就翻跟头，唱到嗓子出血，夜里睡在车上。过年回家时，你长高了，嗓门大了，一肚子的故事。'),c:'good',fx:{looks:2,happy:6,skill:1,meet:'friend',bond:60,f:s=>{const p=YT_par(s);if(p)addBond(p,-8)}}},
   {w:1,t:T('The senior actors beat you, the food is thin and the winter is cruel. After three months you walk home, and nobody says I told you so, which is worse.','师兄们打你，饭食又稀，冬天冷得要命。三个月后你自己走回了家。家里没人说"早告诉过你"，可这比说了还难受。'),c:'bad',fx:{happy:-4,maxHealth:1}},
   {w:s=>s.t.luck*.08,t:T('In a river town a rich patron hears you sing a single verse and showers the stage with silver. Your share comes home with you.','在一个水码头，有个阔老爷听你唱了一句，往台上撒了一把银子。你分到的那份带回了家。'),c:'gold',fx:{money:[30,60],fame:2,happy:5}}]},
  {l:T('Say no','不去'),out:[
   {w:1,t:T('The carts roll out at dawn. For years you hum their tunes without meaning to.','天亮时戏班的车走了。往后好些年，你哼着哼着就是他们的调子。'),c:'muted',fx:{happy:-2}},
   {w:s=>s.t.heart*.1,t:c=>T(`${c.npc.en} gives you a small painted mask. “For when you change your mind.” You keep it all your life.`,`${c.npc.zh}送了你一个画好的小脸谱。"等你哪天改了主意。"那个脸谱你留了一辈子。`),c:'good',fx:{happy:2,flag:'yt_mask'}}]},
  {l:T('Ask to learn one trick before they go','求班主走前教你一手'),out:[
   {w:s=>s.t.wit*.2+s.smarts/50,t:T('You learn how to fall without getting hurt. It turns out to be the most useful thing anyone ever teaches you.','你学会了怎么摔跤不受伤。后来才发现，这是这辈子别人教你最有用的一样本事。'),c:'good',fx:{maxHealth:1,skill:1,happy:3}},
   {w:1,t:T('You practise the somersault and land on your face. The master laughs until he cries and says to keep at it.','你练空翻，脸先着了地。班主笑出了眼泪，说接着练。'),c:'muted',fx:{hurt:[2,5],cause:T('a botched somersault','空翻失手'),happy:1}}]}]});

I({id:'yt_debt',age:[16,25],once:1,w:2.5,when:s=>!['noble','temple','beggar'].includes(s.family),
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:5,sex:'m',age:rint(45,60)});c.amt=rint(60,150);c.lv=PW(.95,3)(s);c.dead=!living(s,'father').length;return c},
 text:c=>T(`${c.npc.en}, a merchant from the county town, arrives with two large men and a note bearing ${c.dead?'your late father’s':'your father’s'} thumbprint: a debt of ${c.amt} taels, years overdue. ${c.dead?'It falls to you now.':'Your father cannot pay. He looks at you.'}`,`县城来的商人${c.npc.zh}领着两个大汉上了门，手里一张欠条，按着${c.dead?'你亡父':'你爹'}的手印：欠银${c.amt}两，拖了好些年。${c.dead?'如今这笔账落到了你头上。':'你爹拿不出来，转头看着你。'}`),
 opts:[{l:T('Pay it all','如数还清'),if:(s,c)=>s.money>=c.amt,out:[
   {w:1,t:T('He counts it twice and tears up the note. Your family can hold its head up in the market again.','他数了两遍，把欠条撕了。你们家在集上又能抬起头来了。'),c:'muted',fx:(s,c)=>({money:-c.amt,align:2,happy:-2})},
   {w:s=>s.t.luck*.12+s.align/80,t:T('He looks at you a long moment and pushes a third of it back. “Your father’s word was good once. I see yours is too.”','他盯着你看了半天，把三成推了回来。"你爹当年说话算话。看来你也是。"'),c:'good',fx:(s,c)=>({money:-Math.round(c.amt*2/3),fame:1,align:2,meet:'acq',bond:55})}]},
  {l:T('Offer to work it off in his warehouse','去他货栈里做工抵债'),out:[
   {w:s=>s.t.heart*.2+s.smarts/50,t:T('A year of lifting sacks. At the end he burns the note in front of you and offers you a paid job. Your shoulders are twice the size.','扛了一年的麻袋。年底他当着你的面把欠条烧了，还说要正经雇你。你的肩膀宽了一倍。'),c:'good',fx:{maxHealth:1,smarts:1,happy:-1,money:[10,30],meet:'acq',bond:50}},
   {w:1,t:T('Every month he finds new interest. After a year you owe more than you started with. You walk out and spit on his doorstep.','他每个月都能算出新的利息来。干了一年，欠得比原先还多。你甩手走人，在他门槛上啐了一口。'),c:'bad',fx:{happy:-6,align:-1,meet:'enemy',bond:15}}]},
  {l:T('Examine the note closely','仔细验看欠条'),out:[
   {w:s=>s.smarts/25,t:T('The thumbprint is from a right hand. Your father lost the top of his right thumb to a threshing flail when he was twelve. The merchant leaves very quickly.','这是右手的手印。可你爹十二岁那年被连枷打掉了右手拇指的一截。商人走得飞快。'),c:'good',fx:{smarts:2,fame:1,meet:'enemy',bond:10}},
   {w:1.2,t:T('It is perfectly genuine, and now you have insulted him in front of the neighbours. The sum, he says, has just gone up.','欠条千真万确，你却当着街坊的面让人下不来台。他说，这数目刚刚又涨了。'),c:'bad',fx:(s,c)=>({happy:-4,f:s=>pay(s,-Math.min(s.money,Math.round(c.amt*1.2)))})}]},
  {l:T('Throw them out','把人轰出去'),fight:FG((s,c)=>c.lv,'light',T('A debt collector at the door','上门讨债'),T('the debt collector’s men','讨债的打手'),()=>T('the hired muscle','讨债打手')),
   win:[{w:1,t:T('They leave at a run. The debt is never collected, but people in the market look at your family differently now.','几个人连滚带爬地跑了。这笔债再没人来讨，可集上的人看你们家的眼神不一样了。'),c:'muted',fx:{align:-3,fame:1}},
    {w:s=>s.t.luck<4?1:.4,t:T('Two days later the magistrate summons you for assault. The merchant’s cousin is his clerk.','两天后县衙传你去问殴人之罪。原来那商人的表兄就在衙门里当书办。'),c:'bad',fx:{jail:1,align:-2}}],
   lose:[{w:1,t:c=>T(`They beat you and take the ox. ${c.npc.en} writes “paid in part” on the note and leaves it on your chest.`,`他们把你揍了一顿，牵走了家里的牛。${c.npc.zh}在欠条上写了"已还部分"，丢在你胸口上。`),c:'bad',fx:(s,c)=>({happy:-6,f:s=>pay(s,-Math.min(s.money,c.amt))})}]}]});

I({id:'yt_capping',age:[15,20],once:1,w:3,
 ctx:s=>{const c=scene();c.npc=npc(s,{occ:19,sex:'m',age:rint(60,78)});return c},
 text:(c,s)=>{const r={north:['you must also put an arrow through a hanging ring','还得一箭射穿吊着的铜环'],miao:['your aunts have spent a month on your silver headdress','几位婶娘花了一个月替你打银饰'],west:['the whole oasis is invited to the feast','整个绿洲的人都请来吃席'],east:['the boats are dressed in red ribbons','渔船上都系了红绸'],jiangnan:['there is a boat on the canal for the feast','席面摆在河上的画舫里'],shu:['there are three kinds of chilli at every table','每桌都摆了三样辣子']}[s.region]||['the ancestral hall has been swept for the first time in a year','祠堂一年来头一回打扫干净'];
  return T(`Your coming-of-age ceremony. ${s.gender==='m'?'You are to be capped':'Your hair is to be pinned up'}, ${r[0]}, and old Uncle ${c.npc.n.sur[1]}, the eldest of the clan, will give you your courtesy name.`,`你的${s.gender==='m'?'冠礼':'及笄礼'}到了。${r[1]}，族里辈分最高的${c.npc.n.sur[0]}老太爷要给你取字。`)},
 opts:[{l:T('Ask for a grand name','求个气派的字'),out:[
   {w:s=>.4+s.fame/20+power(s)/60+s.looks/80,t:T('He gives you one that means “riding the clouds.” It suits you, oddly. People remember it.','他给你取了个"凌云"的意思。说来也怪，还真衬你。人家一听就记住了。'),c:'good',fx:{fame:2,happy:3}},
   {w:1.2,t:T('He gives you one that means “riding the clouds,” and you trip on the steps on your way down. Your cousins will call you that, in that tone, forever.','他给你取了个"凌云"的意思，你下台阶时就绊了一跤。表兄弟们从此都拿那个腔调叫你这个字。'),c:'muted',fx:{happy:-3,fame:1}}]},
  {l:T('Accept whatever he chooses','老太爷取什么就是什么'),out:[
   {w:s=>s.t.heart*.2,t:T('He chooses a plain one that means “steadfast,” and his voice shakes when he says it. You find out later it was his own father’s.','他取了个朴素的字，意思是"守恒"，念的时候声音都在抖。后来你才知道，那是他亲爹的字。'),c:'good',fx:{align:2,happy:3}},
   {w:1,t:T('He has been at the rice wine since noon and gives you, with great ceremony, the name of his late dog. Nobody dares correct him.','老太爷从晌午就开始喝米酒，郑重其事地给你取了个字，正是他家死了的那条狗的名字。谁也不敢纠正他。'),c:'muted',fx:{happy:-1}}]},
  {l:T('Choose one yourself from a book','自己从书里挑一个'),out:[
   {w:s=>s.smarts/25,t:T('A visiting scholar hears it and nods slowly. “Who taught you that line?” You are suddenly the clever one in the family.','来观礼的一位读书人听了，慢慢点了点头："这句是谁教你的？"你一下子成了家里最有学问的那个。'),c:'good',fx:{smarts:2,fame:1}},
   {w:1,t:T('It turns out to be the name of a famous bandit from a ballad everyone but you seems to know.','原来那是一首人人会唱的小曲里一个大盗的名字，只有你不知道。'),c:'muted',fx:{happy:-2,align:-1}}]}]});

I({id:'yt_matchmaker',age:[17,30],cd:6,w:1.1,tags:['town'],when:s=>!spouseOf(s),
 ctx:s=>{const c=scene();c.npc=npc(s,{sex:YT_opp(s),age:clamp(s.age+rint(-3,2),16,32)});return c},
 text:c=>T(`Auntie Wang the matchmaker has arranged for you to meet ${c.npc.en} at the teahouse. Both mothers are sitting at the next table, not listening very hard.`,`媒婆王大娘给你说合了${c.npc.zh}，约在茶楼见面。两家的娘就坐在隔壁桌，装作没在听。`),
 opts:[{l:T('Just be yourself','就做你自己'),out:[
   {w:s=>s.t.heart*.2+s.looks/50,t:c=>T(`You talk until the tea goes cold and the mothers have to cough. ${c.npc.en} laughs at the right things.`,`你们聊到茶都凉了，两家的娘直咳嗽。${c.npc.zh}笑的地方都笑在点子上。`),c:'good',fx:{happy:6,meet:'lover',bond:50}},
   {w:1,t:c=>T(`Too honest: you mention you mean to go off and roam the jianghu. ${c.npc.en}’s mother has ${c.npc.him} out of the door before the dumplings arrive.`,`太实在了：你说你打算去闯江湖。点心还没上，${c.npc.zh}的娘就把${c.npc.ta}拽走了。`),c:'muted',fx:{happy:-3}}]},
  {l:T('Talk up your family’s fortune','把家底往大了吹'),out:[
   {w:s=>s.smarts/40+s.t.luck*.1,t:c=>T(`${c.npc.en} is impressed, or kind enough to pretend. You agree to meet again, and spend the walk home working out how to keep the story straight.`,`${c.npc.zh}听得很是佩服，或者说很给面子。你们约了下回再见。回家路上你一直在琢磨，这谎往后怎么圆。`),c:'muted',fx:{align:-1,meet:'lover',bond:40}},
   {w:1.3,t:T('It turns out the other family’s uncle lives two doors from you. “Rich?” he says, loudly, from the doorway.','偏巧对方的舅舅就住在你家隔两户。"阔？"他站在门口，嗓门大得整个茶楼都听见了。'),c:'bad',fx:{happy:-5}}]},
  {l:T('Slip out through the kitchen','从后厨溜走'),out:[
   {w:1,t:T('Auntie Wang tells everyone you are cursed. No matchmaker will touch you for a year, which suits you fine.','王大娘逢人就说你命里犯冲。一整年没有媒婆敢上门，你倒乐得清静。'),c:'muted',fx:{happy:1}},
   {w:s=>s.t.luck*.15+s.looks/90,t:c=>T(`In the back alley you run straight into ${c.npc.en}, also escaping. You both burst out laughing and share a bowl of noodles on the riverbank instead.`,`在后巷里你正撞上同样溜出来的${c.npc.zh}。你们俩笑得直不起腰，干脆一起到河边吃了碗面。`),c:'good',fx:{happy:6,meet:'lover',bond:55}}]}]});

I({id:'yt_wedding',age:[14,40],once:1,w:2,when:s=>living(s,'sibling').some(p=>p.age>=18&&p.age<=32),
 ctx:s=>{const c=scene();c.p=pick(living(s,'sibling').filter(p=>p.age>=18&&p.age<=32));c.npc=npc(s,{occ:11,sex:'m',age:c.p.age+rint(-2,3),lv:PW(.9,4)(s)});return c},
 text:c=>T(`${YT_sn(c.p).en[0].toUpperCase()+YT_sn(c.p).en.slice(1)} is getting married. Halfway to the bridegroom’s house, the bridal procession is blocked by ${c.npc.en}, a jilted suitor, and a dozen of his friends, all drunk. “The marriage was promised to ME.”`,`${YT_sn(c.p).zh}办喜事。迎亲的队伍走到半路，被一个被退了亲的公子哥${c.npc.zh}拦住了，后头跟着十几个狐朋狗友，个个喝得东倒西歪。"这门亲事，本来是许给我的！"`),
 opts:[{l:T('Clear the road','把路清开'),fight:FG((s,c)=>c.npc.lv,'light',T('A blocked wedding road','拦路抢亲'),T('a drunken suitor','醉酒的公子哥')),
   win:[{w:1,t:T('You put him in the ditch and his friends sober up remarkably fast. At the banquet, you are toasted almost as often as the couple.','你把他掀进了水沟，他那帮朋友的酒一下子全醒了。喜宴上，敬你的酒差不多跟敬新人的一样多。'),c:'good',fx:{fame:2,happy:4,f:(s,c)=>addBond(c.p,10)}},
    {w:s=>s.t.luck<5?.8:.3,t:T('It turns out he is the magistrate’s nephew. The wedding goes on. So, for months, does the feud.','原来他是县太爷的侄子。喜事照办，梁子也结下了，一结就是好几个月。'),c:'muted',fx:{meet:'enemy',bond:10,f:(s,c)=>addBond(c.p,8)}}],
   lose:[{w:1,t:c=>YT_sb(c,T('You end up in the ditch instead, in your best clothes. The procession takes a longer road and arrives after the lucky hour. Your {S} is still grateful you tried.','掉进水沟的倒成了你，还穿着最体面的那身衣裳。迎亲的队伍绕了远路，误了吉时。可{S}还是记着你出过头。')),c:'bad',fx:{happy:-3,f:(s,c)=>addBond(c.p,4)}}]},
  {l:T('Talk him down','好言相劝'),out:[
   {w:s=>s.smarts/30+s.t.heart*.1,t:c=>T(`You get him talking, then crying, then drinking from your own flask. He lets the procession through and sings at the banquet. You and ${c.npc.en} stay drinking friends for years.`,`你先让他开了口，又让他哭了出来，再递上自己的酒壶。他放了行，喜宴上还唱了一段。往后好些年，你跟${c.npc.zh}一直是酒友。`),c:'good',fx:{happy:3,meet:'friend',bond:50,f:(s,c)=>addBond(c.p,6)}},
   {w:1,t:T('He will not listen. The procession goes the long way round and arrives after the lucky hour. The elders mutter about omens all evening.','他油盐不进。迎亲的队伍只好绕远路，误了吉时。老人们一晚上都在嘀咕兆头不好。'),c:'muted',fx:{happy:-3,f:(s,c)=>addBond(c.p,2)}}]},
  {l:T('Buy him off','拿钱打发'),cost:30,out:[
   {w:1,t:c=>YT_sb(c,T('He takes the silver and staggers away. Your {S} looks back at you and grins.','他接过银子，晃晃悠悠地走了。{S}回过头，冲你咧嘴一笑。')),c:'muted',fx:{money:-30,f:(s,c)=>addBond(c.p,6)}},
   {w:s=>s.t.luck*.1,t:T('He takes the silver, then turns up at the banquet anyway and spends it all on wine for everyone. It becomes the most talked-about wedding in years.','他收了银子，转头又跑来喜宴，把钱全拿来请大伙儿喝酒。这成了好几年里最有人说道的一场喜事。'),c:'good',fx:{money:-30,happy:4,f:(s,c)=>addBond(c.p,5)}}]}]});

I({id:'yt_prodigy',age:[26,65],once:1,w:6,when:s=>YT_kid(s,5,13).length>0,
 ctx:s=>{const c=scene();c.k=pick(YT_kid(s,5,13));c.npc=npc(s,{occ:pick([2,13,4]),age:rint(50,75),lv:PW(1.15,6)(s)});return c},
 text:c=>T(`A wandering ${c.npc.desc.en.toLowerCase()} named ${c.npc.en} watches ${YT_kn(c.k).en} play in the yard for a long time, then turns to you. “That child has a root I see once in twenty years. Let me take them to the mountain. Ten years, and you will not know them.”`,`一个云游的${c.npc.desc.zh}${c.npc.zh}在院外看${YT_kn(c.k).zh}玩了很久，转身对你说："这孩子的根骨，我二十年才见一回。让我带上山去，十年之后，你都认不出来。"`),
 opts:[{l:T('Let them go','让孩子跟去'),out:[
   {w:s=>.8+s.t.luck*.15,t:T('The letters that come back are neat and confident. Every New Year the child comes home a little taller and a little further away, and people begin to mention your name with theirs.','捎回来的信字迹工整，口气笃定。每年过年孩子回来，都高了一截，也远了一截。渐渐地，人们提起孩子时，也会捎上你的名字。'),c:'good',fx:{fame:2,happy:-2,f:(s,c)=>addBond(c.k,-3)}},
   {w:1,t:T('The letters are homesick and smudged. After two years you go up the mountain and bring the child back. Neither of you is sorry.','捎回来的信都是想家的话，字被泪水洇花了。过了两年，你上山把孩子接了回来。谁也不后悔。'),c:'muted',fx:{happy:-1,f:(s,c)=>addBond(c.k,6)}}]},
  {l:T('Refuse','不让'),out:[
   {w:1,t:T('The child heard everything and sulks for a month. “I could have been someone.”','孩子全听见了，跟你怄了一个月的气。"我本来能有出息的。"'),c:'muted',fx:{f:(s,c)=>addBond(c.k,-6)}},
   {w:s=>s.smarts/30+power(s)/80,t:T('You start teaching the child yourself, an hour every dawn. It is the best hour of your day for years.','你开始自己教，每天天亮时教一个时辰。往后好几年，那都是你一天里最好的一个时辰。'),c:'good',fx:{happy:4,smarts:1,f:(s,c)=>addBond(c.k,10)}}]},
  {l:T('Ask the child','问孩子自己的意思'),out:[
   {w:s=>s.t.heart*.15+.5,t:T('The child thinks very seriously, and says: “Not yet. When I am twelve.” The old wanderer laughs and promises to come back. Whether they do is another story.','孩子很认真地想了想，说："现在不去，等我十二岁。"老人哈哈大笑，答应到时候再来。来没来，那是后话。'),c:'good',fx:{happy:3,f:(s,c)=>addBond(c.k,8)}},
   {w:1,t:T('The child is out of the gate with a bundle before you have finished the question. You stand there with the rest of the sentence.','你话还没问完，孩子已经背着包袱出了门。你站在原地，后半句话卡在嘴里。'),c:'muted',fx:{happy:-3,f:(s,c)=>addBond(c.k,3)}}]},
  {l:T('Test the stranger first','先试试来人的斤两'),if:s=>power(s)>=30,fight:FG((s,c)=>c.npc.lv,'spar',T('Testing a would-be teacher','试来人的斤两'),T('the wandering master','云游高人')),
   win:[{w:1,t:T('He bows. “Then the child already has a teacher.” He leaves a few pages of notes on the table for you both.','来人拱手道："原来这孩子已经有师父了。"他在桌上留了几页心得，给你们俩的。'),c:'good',fx:{fame:2,skill:1,f:(s,c)=>addBond(c.k,6)}},
    {w:s=>s.t.luck*.1,t:T('He was holding back, and you both know it. He laughs, and leaves an address in the mountains in case you change your mind.','他是让着你的，你们俩心里都清楚。他笑着留下一个山里的地址，说哪天改了主意就去找他。'),c:'muted',fx:{happy:1}}],
   lose:[{w:1,t:T('He puts you on your back in three moves, very gently, in front of your child. He leaves without them. The child watches you differently after that, and not entirely worse.','他三招就把你轻轻放倒在地，当着孩子的面。他没带走孩子。只是从那以后，孩子看你的眼神变了，倒也不全是坏事。'),c:'muted',fx:{happy:-2,f:(s,c)=>addBond(c.k,2)}}]}]});

/* ======================= big, multi-step ======================= */
/* ---- 1. the family trade ---- */
const YT_TRADE={
 peasant:{n:T('the farm','家里那几亩地'),test:T('bring in the whole lower field alone before the autumn rains','秋雨来之前，一个人把下边那块田收完'),hand:T('an old man who has worked these fields for forty years','给你家种了四十年地的老长工'),st:s=>s.maxHealth/60+s.t.heart*.1},
 hunter:{n:T('the hunting grounds','家里的猎场'),test:T('go up the north ridge alone and come back with a deer','一个人上北山梁，扛一头鹿回来'),hand:T('the old trapper who taught your father','教过你爹的老猎人'),st:s=>power(s)/30+s.t.luck*.1},
 merchant:{n:T('the shop','家里的铺子'),test:T('run the shop alone for a month and show a profit','一个人看一个月铺子，还得见利'),hand:T('the head clerk, who has kept the books for twenty years','管了二十年账的老掌柜'),st:s=>s.smarts/25},
 scholar:{n:T('the family name for learning','家里的书香名声'),test:T('pass the county examination on your first try','头一回下场就考过县试'),hand:T('your grandfather’s old student, now a tutor','祖父当年的学生，如今在教私塾'),st:s=>s.smarts/22},
 escort:{n:T('the escort agency','家里的镖局'),test:T('lead a small escort to the next county and back without losing a tael','带一趟小镖去邻县，一两银子都不能少'),hand:T('the agency’s oldest escort, who has a limp and a long memory','镖局里最老的镖师，腿瘸了，记性却好'),st:s=>power(s)/30+s.fame/40},
 clan:{n:T('the clan’s sword hall','族里的剑堂'),test:T('hold your own against your uncle in the courtyard for fifty moves','在院子里跟你叔父过五十招不落败'),hand:T('the hall’s old sword servant','剑堂里伺候了三代人的老剑仆'),st:s=>power(s)/25},
 cult:{n:T('your family’s place in the cult','家里在教中的位子'),test:T('carry a sealed message through three righteous-sect checkpoints','带一封密信闯过名门正派的三道关卡'),hand:T('your father’s silent bodyguard','你爹身边那个不说话的护卫'),st:s=>s.smarts/35+power(s)/40}};
I({id:'yt_trade1',age:[15,22],once:1,w:4,when:s=>!s.sect&&!!YT_par(s)&&!!YT_TRADE[s.family],
 ctx:s=>({par:YT_par(s),p:pick(living(s,'sibling'))||null,tr:YT_TRADE[s.family]}),
 text:c=>{const P=YT_pn(c.par);return T(`${P.en[0].toUpperCase()+P.en.slice(1)} calls you in after supper. “I’m not getting younger. Someone has to take over ${c.tr.n.en}.”${c.p?` ${YT_sn(c.p).en[0].toUpperCase()+YT_sn(c.p).en.slice(1)} is listening at the door, and wants it badly.`:''} And you have been dreaming of the jianghu for years.`,`吃过晚饭，${P.zh}把你叫进屋："我老了。${c.tr.n.zh}，总得有人接。"${c.p?`${YT_sn(c.p).zh}在门外偷听，心里想要得很。`:''}可你惦记江湖，已经惦记了好些年。`)},
 opts:[{l:T('Ask what you must do to prove yourself','问要怎样才算接得住'),out:[
   {w:1,t:c=>T(`“Simple. ${c.tr.test.en[0].toUpperCase()+c.tr.test.en.slice(1)}.”`,`"简单。${c.tr.test.zh}。"`),c:'muted',next:'yt_trade2',keep:1},
   {w:s=>s.t.heart*.12,t:c=>T(`A long look. “I had already decided. But the others must see you earn it: ${c.tr.test.en}.”`,`${YT_pn(c.par).zh}看了你好久："我心里早定了。可得让旁人看着你挣下来：${c.tr.test.zh}。"`),c:'good',fx:{f:(s,c)=>{addBond(c.par,5);c.fav=1}},next:'yt_trade2',keep:1}]},
  {l:T('Tell them you want the jianghu','说你想去闯江湖'),out:[
   {w:(s,c)=>s.t.heart*.12+c.par.bond/60,t:T('A long silence. Then an old travelling cloak is taken down from the rafters and laid in your arms, with a little purse tied to it.','屋里静了好久。随后，房梁上那件旧行路斗篷被取了下来，放进你怀里，上头系着个小钱袋。'),c:'good',fx:{money:20,happy:3},next:'yt_trade3',keep:1},
   {w:1,t:T('Shouting. A bowl breaks. “Then go, and don’t come back asking for rice!”','一阵吵嚷，一只碗摔碎了。"那你走！往后别回来要饭吃！"'),c:'bad',fx:{happy:-3,f:(s,c)=>{addBond(c.par,-15);c.cold=1}},next:'yt_trade3',keep:1}]},
  {l:c=>YT_sb(c,T('Say your {S} should have it','说该让{S}来接')),if:(s,c)=>!!c.p,out:[
   {w:s=>s.t.heart*.2,t:c=>YT_sb(c,T('Your {S} bursts in from the doorway and hugs you hard enough to hurt.','守在门外的{S}一下冲进来，抱得你骨头都疼。')),c:'good',fx:{f:(s,c)=>{addBond(c.p,15);c.sib=1}},next:'yt_trade3',keep:1},
   {w:1,t:c=>T(`“Your sibling is not you,” says ${YT_pn(c.par).en}, too loudly. Outside the door, someone walks away fast.`,`"那孩子不是你。"${YT_pn(c.par).zh}这话说得太响了。门外，有人快步走开了。`),c:'muted',fx:{f:(s,c)=>{addBond(c.p,-6);c.sib=1}},next:'yt_trade3',keep:1}]}]});
I({id:'yt_trade2',only:1,noThread:1,
 text:c=>T(`The test: ${c.tr.test.en}. ${c.tr.hand.en[0].toUpperCase()+c.tr.hand.en.slice(1)} watches you set off and says nothing.`,`考题是：${c.tr.test.zh}。${c.tr.hand.zh}看着你出门，一声不吭。`),
 opts:[{l:T('Do it the hard, honest way','老老实实，下死功夫'),out:[
   {w:(s,c)=>YT_TRADE[s.family].st(s)+(c.fav?.4:0),t:T('It nearly breaks you. It does not. You come back thinner, with exactly what was asked for.','差点把你累垮，可到底没垮。你回来时瘦了一圈，要的东西一样不差。'),c:'good',fx:{maxHealth:1,f:(s,c)=>{c.pass=1}},next:'yt_trade3',keep:1},
   {w:1.1,t:T('You give it everything and fall just short. Close is not the same.','你拼尽了全力，差了那么一点点。差一点，就是没成。'),c:'bad',fx:{happy:-3,f:(s,c)=>{c.pass=0}},next:'yt_trade3',keep:1}]},
  {l:T('Find a clever shortcut','找条巧路子'),out:[
   {w:s=>s.smarts/30+s.t.luck*.1,t:T('Nobody said you could not hire help, or borrow, or bargain. It works, and you are not entirely sure it was fair.','又没人说不许雇人、不许借、不许讲价。成了。你自己也说不准，这算不算公道。'),c:'muted',fx:{smarts:2,f:(s,c)=>{c.pass=1;c.cheat=1}},next:'yt_trade3',keep:1},
   {w:1,t:T('The shortcut collapses, in public. Everyone hears about it by evening.','巧路子当众砸了锅。到傍晚，全家上下都知道了。'),c:'bad',fx:{happy:-4,f:(s,c)=>{c.pass=0}},next:'yt_trade3',keep:1}]},
  {l:c=>T(`Ask the old hand for help`,`去请教${c.tr.hand.zh}`),out:[
   {w:s=>s.t.heart*.2+s.looks/100,t:T('The old hand looks at you for a long time and then tells you, in ten words, what took them forty years to learn. It is enough.','那位老人打量你半天，用十来个字，把他花了几十年才琢磨出来的东西告诉了你。够用了。'),c:'good',fx:{smarts:1,f:(s,c)=>{c.pass=1}},next:'yt_trade3',keep:1},
   {w:(s,c)=>c.p?1.2:.8,t:T('The advice is careful, wise, and wrong. Later you wonder whose side the old hand was on.','给你的主意周全、老到，偏偏是错的。后来你忍不住想，那老人到底向着谁。'),c:'bad',fx:{f:(s,c)=>{c.pass=0}},next:'yt_trade3',keep:1}]}]});
I({id:'yt_trade3',only:1,noThread:1,
 text:c=>{const P=YT_pn(c.par);
  if(c.sib)return YT_sb(c,T(`It is settled: ${c.tr.n.en} will go to your {S}. That leaves the question of you.`,`事情定了：${c.tr.n.zh}归{S}。剩下的，是你自己怎么办。`));
  if(c.pass==null)return T(`Your bundle is packed. ${c.cold?'Nobody comes to the gate.':P.en[0].toUpperCase()+P.en.slice(1)+' stands at the gate, not quite looking at you.'}`,`包袱收拾好了。${c.cold?'没有一个人来门口送你。':P.zh+'站在门口，眼睛没怎么看你。'}`);
  if(c.pass)return T(`You passed. The family gathers in the main room. ${P.en[0].toUpperCase()+P.en.slice(1)} holds out the keys${c.cheat?', and looks at you a moment longer than needed':''}.`,`你过了。一家人聚在堂屋里，${P.zh}把钥匙递给你${c.cheat?'，眼神在你脸上多停了一会儿':''}。`);
  return T(`You failed. The family gathers in the main room anyway, and everyone is very polite.`,`你没过。一家人还是聚在了堂屋里，个个都客客气气的。`)},
 opts:[
  {l:T('Take it on','接下来'),if:(s,c)=>!c.sib&&c.pass===1,out:[
   {w:s=>.5+s.t.heart*.2,t:c=>T(`You settle into it. It is not the jianghu, but it is yours, and it pays. ${YT_pn(c.par).en[0].toUpperCase()+YT_pn(c.par).en.slice(1)} starts taking afternoon naps.`,`你安下心来做了。这不是江湖，可这是你的，也养得活人。${YT_pn(c.par).zh}开始睡午觉了。`),c:'good',fx:{money:[50,120],happy:5,flag:'yt_heir',deed:T('Took over the family trade','接下了家业'),f:(s,c)=>addBond(c.par,10)}},
   {w:1,t:T('The first year is a disaster of weather and bad luck, and you learn more than in all the years before.','头一年天公不作美，又处处走背运，可你学到的比前头那些年加起来还多。'),c:'muted',fx:{money:15,smarts:2,happy:-2,flag:'yt_heir'}}]},
  {l:c=>YT_sb(c,T('Hand it to your {S} anyway and go','还是让给{S}，自己走')),if:(s,c)=>!c.sib&&c.pass===1&&!!c.p,out:[
   {w:s=>s.t.heart*.2,t:c=>YT_sb(c,T('Your {S} cannot speak. Years later, whenever you need a roof, there is always one.','{S}半天说不出话来。往后多少年，你什么时候需要个落脚的地方，那里总有一间屋子留着。')),c:'good',fx:{align:3,happy:3,f:(s,c)=>addBond(c.p,20)}},
   {w:1,t:c=>YT_sb(c,T('Your {S} thinks it is pity and never quite forgives you for it.','{S}觉得你这是在施舍，这口气一直没咽下去。')),c:'muted',fx:{happy:-2,f:(s,c)=>addBond(c.p,-6)}}]},
  {l:T('Accept the verdict','认了'),if:(s,c)=>!c.sib&&c.pass===0,out:[
   {w:s=>s.t.heart*.2,t:c=>T(`Later, alone, ${YT_pn(c.par).en} says: “A trade is not the only thing a person can be.” It helps more than you expected.`,`后来没人的时候，${YT_pn(c.par).zh}对你说："一个人能做的，不只这一门手艺。"这话比你想的管用。`),c:'good',fx:{happy:1,f:(s,c)=>addBond(c.par,6)}},
   {w:1,t:T('Someone else takes it on. For a while you feel very small, and then you start looking at the road.','家业交给了别人。有那么一阵，你觉得自己矮了半截。再后来，你开始望着门外那条路出神。'),c:'bad',fx:{happy:-5,smarts:1}}]},
  {l:T('Demand a second chance','再求一次机会'),if:(s,c)=>!c.sib&&c.pass===0,out:[
   {w:(s,c)=>YT_TRADE[s.family].st(s)*.6+s.t.luck*.1,t:T('Second time, you do it. Nobody mentions the first time again, at least to your face.','第二回，你做成了。头一回的事再没人提，至少没人当着你的面提。'),c:'good',fx:{money:[30,70],happy:4,flag:'yt_heir'}},
   {w:1,t:T('You fail again, in front of more people. You leave home that winter.','又没成，这回看的人更多。那年冬天，你离了家。'),c:'bad',fx:{happy:-6,f:(s,c)=>addBond(c.par,-5)}}]},
  {l:T('Set out at dawn','天一亮就上路'),if:(s,c)=>c.pass==null||c.sib,out:[
   {w:s=>.5+s.t.luck*.15+power(s)/60,t:T('On the first night out you share a fire with another young fool going the same way. You travel together for a month.','头一夜在野外，你跟另一个同样犯傻的年轻人凑着一堆火。你们结伴走了一个月。'),c:'good',fx:{happy:5,skill:1,meet:'friend',bond:55}},
   {w:1,t:T('In the first week you are robbed of everything but your shoes. Welcome to the jianghu.','头一个礼拜，你就被人抢得只剩一双鞋。欢迎来到江湖。'),c:'bad',fx:{happy:-3,smarts:1,f:s=>pay(s,-Math.min(s.money,rint(10,40)))}}]},
  {l:T('Stay one more year first','先留一年再走'),if:(s,c)=>c.pass==null||c.sib,out:[
   {w:s=>s.t.heart*.25,t:c=>T(`You work beside ${c.sib?'your '+(c.p&&c.p.sex==='m'?'brother':'sister'):YT_pn(c.par).en} for a year. When you finally leave in spring, it is with a blessing and a full purse.`,`你在${c.sib?(c.p&&c.p.sex==='m'?'哥哥':'姐姐'):YT_pn(c.par).zh}身边帮了一年。开春真走的时候，带着一句祝福和一个鼓鼓的钱袋。`),c:'good',fx:{money:[20,50],happy:3,f:(s,c)=>{addBond(c.par,10);if(c.p)addBond(c.p,5)}}},
   {w:1,t:T('One more year turns, in your head, into always. You catch yourself staring at the road.','"再留一年"在你心里慢慢变成了"一辈子"。你常发觉自己盯着那条路发呆。'),c:'muted',fx:{happy:-4}}]}]});

/* ---- 2. a father’s past ---- */
I({id:'yt_secret1',age:[10,20],once:1,w:1.3,when:s=>living(s,'father').length>0&&s.family!=='noble',
 ctx:s=>{const c=scene();c.f=living(s,'father')[0];c.npc=npc(s,{occ:pick([13,28,8]),sex:'m',age:rint(40,55),lv:PW(1.1,6)(s)});return c},
 text:c=>T(`Hunting for your old slingshot in the loft, you find a box wrapped in oilcloth. Inside: a rusted iron token with the Nine Rivers Gang’s mark, and a yellowed wanted notice. The young face on it is your father’s. The name is not.`,`你上阁楼翻找小时候的弹弓，翻出一个油布裹着的木匣。里头是一块锈了的铁牌，刻着九河帮的记号，还有一张发黄的海捕文书。画上那张年轻的脸是你爹，名字却不是。`),
 opts:[{l:T('Ask your father straight out','直接去问你爹'),out:[
   {w:(s,c)=>s.t.heart*.15+c.f.bond/50,t:T('He sits you down and tells it all: twenty years ago he rode with the gang, and one night on the river he did something he left them for. He has been waiting all your life for this conversation.','他让你坐下，原原本本说了：二十年前他在帮里混过，有一夜在河上做了件事，从此离了帮。你长这么大，他一直在等这场谈话。'),c:'muted',fx:{f:(s,c)=>{c.told=1;addBond(c.f,6)}},next:'yt_secret2',keep:1},
   {w:1,t:T('He goes white, burns the notice in the stove, and forbids you ever to mention it.','他脸色煞白，把文书塞进灶膛烧了，不许你再提一个字。'),c:'muted',fx:{f:(s,c)=>{c.told=0;addBond(c.f,-5)}},next:'yt_secret2',keep:1}]},
  {l:T('Put it back and say nothing','放回原处，一字不提'),out:[
   {w:s=>s.smarts/30,t:T('Now you notice things: he sleeps with a knife, never sits with his back to a door, goes quiet when riverboats pass.','从此你留了心：他枕头底下压着刀，从不背对门坐，河上一过船他就不吭声。'),c:'muted',fx:{smarts:1,f:(s,c)=>{c.told=0}},next:'yt_secret2',keep:1},
   {w:1,t:T('You try to forget it. It does not let you.','你想把这事忘了，可它不肯放过你。'),c:'muted',fx:{happy:-2,f:(s,c)=>{c.told=0}},next:'yt_secret2',keep:1}]},
  {l:T('Show the token to the teahouse storyteller','把铁牌拿给茶馆说书的看'),out:[
   {w:s=>s.smarts/30+s.t.luck*.1,t:T('He turns pale and pulls you into a corner. The Nine Rivers Gang, he whispers, broke up the year one of its own sank the leader’s boat to save a village. Nobody knows who that was.','说书先生脸都白了，把你拽到墙角。他压着嗓子说：九河帮散伙那年，是帮里有人凿沉了帮主的船，救下了一村子人。那人是谁，谁也不知道。'),c:'muted',fx:{f:(s,c)=>{c.told=1;c.hero=1}},next:'yt_secret2',keep:1},
   {w:1,t:T('He tells half the teahouse before you are out of the door. By evening the town is whispering about your father.','你还没出门，他已经讲给半个茶馆听了。到了傍晚，全镇都在嚼你爹的舌根。'),c:'bad',fx:{f:(s,c)=>{c.told=1;addBond(c.f,-10)}},next:'yt_secret2',keep:1}]}]});
I({id:'yt_secret2',only:1,noThread:1,
 text:c=>T(`Months later a stranger, ${c.npc.en}, stops at your gate and asks for your father by the name on the notice. There is an old sword on ${c.npc.his} back and an older grief in ${c.npc.his} face. “He drowned my brother.”`,`过了几个月，一个叫${c.npc.zh}的陌生人停在你家门口，报出文书上的那个名字，问人在不在。${c.npc.ta}背着一把旧剑，脸上的悲恨比剑还旧。"他淹死了我哥哥。"`),
 opts:[{l:T('Say nobody of that name lives here','说这里没这个人'),out:[
   {w:s=>s.smarts/25+s.looks/60,t:T('The stranger studies you, nods, and walks on down the road.','那人打量了你一阵，点点头，顺着大路走了。'),c:'muted',fx:{f:(s,c)=>{c.res='gone'}},next:'yt_secret3',keep:1},
   {w:1.2,t:T('“You have his eyes,” the stranger says, and sits down on your doorstep to wait.','"你的眼睛跟他一模一样。"那人说完，就在你家门槛上坐下等着。'),c:'bad',fx:{f:(s,c)=>{c.res='fight'}},next:'yt_secret3',keep:1}]},
  {l:T('Warn your father','去给你爹报信'),out:[
   {w:1,t:T('He takes down a sword from the beam that you never knew was there, and goes out into the yard.','他从房梁上取下一把剑，你从来不知道那里藏着剑。他走进了院子。'),c:'muted',fx:{f:(s,c)=>{c.res='fight'}},next:'yt_secret3',keep:1},
   {w:(s,c)=>s.t.heart*.15+(c.told?.5:0),t:T('“I knew this day would come.” He goes out with a jar of wine instead of a blade.','"我就知道有这一天。"他没拿刀，拎着一坛酒走了出去。'),c:'muted',fx:{f:(s,c)=>{c.res='talk'}},next:'yt_secret3',keep:1}]},
  {l:T('Stand in the gateway yourself','自己堵在门口'),fight:FG(PW(1.05,3),'light',T('At your own gate','家门口'),T('a stranger with a grudge','寻仇的陌生人')),
   win:[{w:1,t:T('The stranger steps back, lowers the sword, and almost smiles. “You have his spirit, too. Fetch him. I only want to talk.”','那人退了一步，放下剑，嘴角几乎带了点笑意。"连那股劲儿都像。去叫他吧，我只想说几句话。"'),c:'good',fx:{fame:1,f:(s,c)=>{c.res='talk'}},next:'yt_secret3',keep:1}],
   lose:[{w:1,t:T('You end up in the dust. Your father comes out at the noise, and his face, when he sees you down, is one you have never seen.','你被打翻在尘土里。你爹听见动静出来，看见你倒在地上，那张脸你从没见过。'),c:'bad',fx:{f:(s,c)=>{c.res='fight'}},next:'yt_secret3',keep:1}]}]});
I({id:'yt_secret3',only:1,noThread:1,
 text:c=>c.res==='gone'?T('The stranger is gone, but your father heard the voice at the gate. That night he does not sleep at all.','那人走了，可你爹听见了门口的声音。那一夜，他一眼没合。')
  :c.res==='talk'?T(`Your father and ${c.npc.en} sit under the date tree with the wine between them, talking low, long into the night.`,`你爹和${c.npc.zh}坐在枣树底下，中间搁着那坛酒，压低了声音，一直说到深夜。`)
  :T(`In the yard at dusk, your father and ${c.npc.en} face each other with drawn swords. Neither is young.`,`黄昏的院子里，你爹和${c.npc.zh}拔剑相对。两个人都不年轻了。`),
 opts:[
  {l:T('Tell your father everything you know','把你知道的全告诉你爹'),if:(s,c)=>c.res==='gone',out:[
   {w:s=>s.t.heart*.2+.3,t:T('He holds your shoulder for a long time. Then he tells you where the stranger’s brother is buried, and that he goes there every spring. You go with him that year.','他攥着你的肩膀，攥了很久。然后他告诉你，那人的哥哥埋在哪里，他每年开春都去。那一年，你跟着他一起去了。'),c:'good',fx:{align:3,happy:2,f:(s,c)=>addBond(c.f,15)}},
   {w:1,t:T('He thanks you, and is packing to move the family within the month.','他谢了你，一个月不到，就开始收拾东西准备搬家。'),c:'muted',fx:{happy:-3,f:(s,c)=>{addBond(c.f,5);pay(s,-Math.min(s.money,rint(5,25)))}}}]},
  {l:T('Keep it to yourself','自己藏在心里'),if:(s,c)=>c.res==='gone',out:[
   {w:1,t:T('You carry it alone. It makes you older than your friends in some way you cannot explain.','你一个人扛着这件事。说不清为什么，它让你比同龄人老成了些。'),c:'muted',fx:{smarts:1,happy:-2}},
   {w:s=>s.t.luck*.1,t:T('Years later the stranger’s name turns up in a list of the dead from a river flood. You burn incense for both brothers, quietly.','多年以后，那人的名字出现在一场河汛的遇难名单上。你悄悄给兄弟俩都上了炷香。'),c:'muted',fx:{align:2}}]},
  {l:T('Listen at the door','趴在门边偷听'),if:(s,c)=>c.res==='talk',out:[
   {w:s=>s.smarts/30+.3,t:c=>T(`You hear it all. The drowned brother was the gang’s leader, and the boat your father sank was carrying a hundred people to be sold. ${c.npc.en} weeps, and then, unexpectedly, laughs.`,`你全听见了。淹死的那位哥哥正是帮主，你爹凿沉的那条船上，装着一百个要被卖掉的人。${c.npc.zh}哭了，哭着哭着，竟笑了起来。`),c:'good',fx:{align:4,smarts:1,f:(s,c)=>{addBond(c.f,12);storeNpc(s,c,'acq',55)}}},
   {w:1,t:T('You fall asleep against the door. In the morning the stranger is gone, and there is an old sword leaning against your bed with a note: “For the one who stood at the gate.”','你靠着门板睡着了。早上醒来，那人已经走了，你床边靠着一把旧剑，上头压着张字条："给那个守门的孩子。"'),c:'good',fx:{skill:1,happy:3}}]},
  {l:T('Leave them to it','由他们去说'),if:(s,c)=>c.res==='talk',out:[
   {w:s=>s.t.heart*.2,t:T('At breakfast your father looks ten years younger. He never tells you what was said, and you find you do not need to know.','吃早饭时，你爹像年轻了十岁。他一直没告诉你那晚说了什么，你发觉自己也不需要知道。'),c:'good',fx:{happy:4,f:(s,c)=>addBond(c.f,8)}},
   {w:1,t:T('In the morning they are both gone. Your father comes back a week later with a new scar and no explanation.','第二天一早两个人都不见了。一个礼拜后你爹回来了，身上多了道新疤，什么也没解释。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Throw yourself between them','扑到两人中间'),if:(s,c)=>c.res==='fight',out:[
   {w:s=>s.t.heart*.2+s.looks/80,t:c=>T(`Both blades stop a hand’s width from you. ${c.npc.en} stares at you, then at your father, spits in the dust and walks away. Your father drops his sword and sits down on the ground.`,`两把剑都停在离你一巴掌远的地方。${c.npc.zh}看看你，又看看你爹，往地上啐了一口，转身走了。你爹扔下剑，一屁股坐在了地上。`),c:'good',fx:{align:4,fame:1,f:(s,c)=>addBond(c.f,18)}},
   {w:1,t:T('One blade does not stop in time. The cut across your side is long and shallow, and it ends the fight: the stranger, appalled, is gone before your father finishes shouting for the doctor.','有一把剑没收住。你肋下被划了长长一道，好在不深。这一剑也了结了这场架：那人吓坏了，你爹喊大夫的声音还没落，人已经没了影。'),c:'bad',fx:{looks:-2,hurt:[6,12],cause:T('a sword cut','剑伤'),f:(s,c)=>{addCond(s,'wound',1);addBond(c.f,12)}}}]},
  {l:T('Run for the constable','跑去叫捕快'),if:(s,c)=>c.res==='fight',out:[
   {w:s=>s.smarts/30+.4,t:T('The constables come with torches. The stranger is gone over the wall. Your father’s old name is now known all over town, and he never quite forgives you, or himself.','捕快们举着火把来了，那人早翻墙走了。你爹的旧名字从此传遍了全镇，他始终没能原谅你，也没能原谅自己。'),c:'muted',fx:{f:(s,c)=>addBond(c.f,-10)}},
   {w:1,t:T('By the time you are back, it is over. Your father is bleeding from the arm and alive; the stranger is gone. “He could have killed me,” your father says. “He didn’t.”','等你回来，一切都结束了。你爹胳膊上淌着血，人还活着；那人走了。"他本可以杀了我，"你爹说，"他没有。"'),c:'muted',fx:{happy:-3,f:(s,c)=>addBond(c.f,4)}}]}]});

/* ---- 3. the apprenticeship ---- */
const YT_CRAFT=[
 {occ:25,n:T('blacksmith','铁匠'),task:T('forge a single nail, “perfect,” and nothing else all day','一整天只许打一根钉子，要"打到最好"'),trap:T('a bar of silver left beside the quench tub','淬火桶边上搁着的一锭银子')},
 {occ:10,n:T('physician','郎中'),task:T('sort a heap of dried roots, one of which is deadly and looks like the rest','分拣一堆干药根，里头混着一味剧毒的，长得跟别的一模一样'),trap:T('a purse of copper the master “forgot” on the counter','师父"忘"在柜台上的一袋铜钱')},
 {occ:26,n:T('cook','大厨'),task:T('cook one bowl of plain rice, and nothing else, until it is right','只煮一碗白米饭，煮到对了为止'),trap:T('a jar of saffron worth more than your family’s house','一罐藏红花，比你家房子还值钱')}];
I({id:'yt_appr1',age:[11,16],once:1,w:2.5,when:s=>!s.sect&&!['noble','clan','cult'].includes(s.family),
 ctx:s=>{const c=scene();c.cr=pick(YT_CRAFT);c.npc=npc(s,{occ:c.cr.occ,sex:'m',age:rint(50,68)});c.sc=0;return c},
 text:c=>T(`The best ${c.cr.n.en} in the county, old ${c.npc.en}, takes one apprentice a decade. You go to ask. It is snowing, and the gate stays shut.`,`全县最好的${c.cr.n.zh}${c.npc.zh}，十年才收一个徒弟。你去求师。天下着雪，大门一直关着。`),
 opts:[{l:T('Kneel at the gate and wait','跪在门口等'),out:[
   {w:s=>s.t.heart*.25+s.maxHealth/120,t:T('On the third morning the gate opens. He looks at the snow piled on your shoulders and says: “Come in, then.”','第三天早上门开了。他看看你肩上积的雪，说："那就进来吧。"'),c:'good',fx:{f:(s,c)=>{c.sc+=1}},next:'yt_appr2',keep:1},
   {w:1,t:T('You collapse with fever on the second night. You wake up inside, under his blankets, and he is scowling at you.','第二夜你烧得晕了过去。醒来时人已经在屋里，盖着他的被子，他正瞪着你。'),c:'muted',fx:{ill:'cold'},next:'yt_appr2',keep:1}]},
  {l:T('Climb in the back and just start working','从后墙翻进去，直接开始干活'),out:[
   {w:s=>s.smarts/30+s.t.wit*.1,t:T('He finds you at dawn, having swept the shop and sorted his tools better than he does. He laughs, once, like a door creaking.','天亮时他发现你已经把铺子扫了，工具也理得比他自己还齐整。他笑了一声，像扇老门吱呀了一下。'),c:'good',fx:{f:(s,c)=>{c.sc+=1}},next:'yt_appr2',keep:1},
   {w:1,t:T('His dog finds you first. He throws you out over the same wall with a bitten leg.','他家的狗先发现了你。他把咬伤了腿的你从原来那堵墙扔了出去。'),c:'bad',fx:{happy:-4,hurt:[2,6],cause:T('a guard dog','看门狗')}}]},
  {l:T('Give up and go home','算了，回家'),out:[
   {w:1,t:T('You go home. The snow fills your footprints behind you.','你回家了。身后的脚印，很快被雪填平了。'),c:'muted',fx:{happy:-1}},
   {w:s=>s.t.luck*.15,t:T(`On the way home you pass a shabby little workshop whose owner is sweeping snow, and on a whim you ask. Not the best in the county, but you are welcome. It is a good few years.`,`回家路上经过一间破旧的小作坊，掌柜正在扫雪，你一时兴起开口问了。人家不是全县最好的，可愿意收你。那几年过得挺好。`),c:'good',fx:{smarts:1,happy:2,maxHealth:1}}]}]});
I({id:'yt_appr2',only:1,noThread:1,
 text:c=>T(`Your first task: ${c.cr.task.en}.`,`头一样活计：${c.cr.task.zh}。`),
 opts:[{l:T('Do exactly as told, again and again','照吩咐做，做一遍再做一遍'),out:[
   {w:s=>s.t.heart*.2+.3,t:T('By evening your hands know something your head does not. He looks at the result and grunts. It is the best grunt of your life.','到傍晚，你的手已经懂了脑子还不懂的东西。他看了看，哼了一声。那是你这辈子听过最好听的一声哼。'),c:'good',fx:{f:(s,c)=>{c.sc+=2}},next:'yt_appr3',keep:1},
   {w:1,t:T('By evening you have done it a hundred times and it is still not right. He says nothing. You do not know if that is good.','到傍晚你已经做了上百遍，还是不对。他什么也没说。你不知道这算好算坏。'),c:'muted',fx:{f:(s,c)=>{c.sc+=1}},next:'yt_appr3',keep:1}]},
  {l:T('Ask him why','问他为什么'),out:[
   {w:s=>s.smarts/30,t:T('He looks surprised, then tells you, at length, and you realise the question was the test.','他先是一愣，然后说了好长一大段。你这才明白，问这一句才是考题。'),c:'good',fx:{smarts:2,f:(s,c)=>{c.sc+=2}},next:'yt_appr3',keep:1},
   {w:1,t:T('“Because I said so.” You do it in silence after that, with burning ears.','"因为我说的。"之后你一声不吭地干，耳朵烧得通红。'),c:'muted',next:'yt_appr3',keep:1}]},
  {l:T('Do it your own way','照自己的法子来'),out:[
   {w:s=>s.t.wit*.12+s.t.luck*.08,t:T('Your way is strange and it works. He stares at it for a long time, then puts it on the shelf where he keeps the things he is proud of.','你的法子古怪，可是管用。他盯着看了好久，把它摆上了他放得意之作的那层架子。'),c:'gold',fx:{smarts:2,f:(s,c)=>{c.sc+=3}},next:'yt_appr3',keep:1},
   {w:1.2,t:T('Your way is a disaster. He makes you clean it up without a word, which is somehow worse than shouting.','你的法子一塌糊涂。他一句话不说，让你自己收拾干净。这比挨骂还难受。'),c:'bad',fx:{happy:-3},next:'yt_appr3',keep:1}]}]});
I({id:'yt_appr3',only:1,noThread:1,
 text:c=>T(`A month in, you are alone in the workshop and notice ${c.cr.trap.en}. Nobody else is around. The door is open.`,`过了一个月，有天作坊里就你一个人，你瞧见了${c.cr.trap.zh}。四下无人，门开着。`),
 opts:[{l:T('Leave it exactly where it is','原样不动'),out:[
   {w:(s,c)=>.5+c.sc*.4+s.align/60,t:c=>T(`That night ${c.npc.en} puts it back in the strongbox and tells you that you are his apprentice now, properly. He was behind the screen the whole time.`,`当晚${c.npc.zh}把东西收回了箱子，告诉你从今往后，你正式是他的徒弟了。原来他一直躲在屏风后头。`),c:'gold',fx:{smarts:3,maxHealth:1,happy:6,flag:'yt_craft',meet:'friend',bond:65,deed:(c,s)=>T(`Apprenticed to a master ${c.cr.n.en}`,`拜名${c.cr.n.zh}为师`)}},
   {w:1,t:T('He never mentions it. But a week later he tells you that you have learned what he can teach a child, and to come back when you are grown. You are not sure whether you passed.','他一个字没提。可过了一个礼拜，他说孩子能学的你都学了，等长大了再来。你也说不清自己到底算没算过关。'),c:'muted',fx:{smarts:2,happy:1}}]},
  {l:T('Take it to him at once','马上拿去交给他'),out:[
   {w:(s,c)=>.4+c.sc*.35+s.t.heart*.1,t:T('“I left it there on purpose,” he says. “Most of them take a little, and put the rest back.” He takes you on.','"那是我故意放的，"他说，"大多数人会拿一点，再把剩下的放回去。"他收下了你。'),c:'good',fx:{smarts:2,maxHealth:1,happy:5,align:2,flag:'yt_craft',meet:'friend',bond:60,deed:(c,s)=>T(`Apprenticed to a master ${c.cr.n.en}`,`拜名${c.cr.n.zh}为师`)}},
   {w:1,t:T('He seems almost disappointed that you noticed it at all. You stay on, but as a servant more than a student.','你居然留意到了，他好像反而有点失望。你留了下来，可更像个使唤的，不大像个徒弟。'),c:'muted',fx:{smarts:1,money:[5,15]}}]},
  {l:T('Take just a little','只拿一点点'),out:[
   {w:s=>s.t.luck*.1,t:T('Nobody notices. You buy your mother a hairpin. Every time she wears it, you feel sick.','没人发觉。你给娘买了根簪子。她每戴一回，你心里就翻腾一回。'),c:'muted',fx:{money:[10,20],align:-3,happy:-2}},
   {w:1.5,t:c=>T(`He was behind the screen. He does not shout. He just opens the gate, and ${c.npc.en}’s name will close every other workshop in the county to you.`,`他就在屏风后头。他没骂，只是把大门打开了。有${c.npc.zh}这句话在，全县再没有哪家作坊肯收你。`),c:'bad',fx:{align:-4,happy:-6,fame:-1}}]}]});

/* ---- 4. your child runs away to the jianghu ---- */
I({id:'yt_run1',age:[26,70],once:1,w:6,when:s=>YT_kid(s,10,16).length>0,
 ctx:s=>{const c=scene();c.k=pick(YT_kid(s,10,16));c.truth=wpick([{k:'fraud',w:3},{k:'real',w:2},{k:'troupe',w:1.5}],x=>x.w).k;c.npc=npc(s,{occ:c.truth==='troupe'?30:pick([13,28]),age:rint(30,50),lv:PW(c.truth==='real'?1.15:.9,4)(s)});return c},
 text:c=>T(`On ${YT_kn(c.k).en}’s pillow, a note in careful characters: “Gone to become a great hero. Do not look for me.”`,`${YT_kn(c.k).zh}的枕头上压着张字条，一笔一画写得很用心："我去当大侠了。别找我。"`),
 opts:[{l:T('Go after them at once','立刻去追'),out:[
   {w:s=>s.smarts/30+s.t.luck*.12,t:T('A ferryman remembers a child with a bundle twice their size. You are on the trail by noon.','一个摆渡的记得有个孩子背着比人还大的包袱过了河。不到晌午，你已经追上了踪迹。'),c:'muted',fx:{f:(s,c)=>{c.fast=1}},next:'yt_run2',keep:1},
   {w:1,t:T('Two days lost on the wrong road before a tea-seller points you back the way you came.','你在岔路上白跑了两天，才有个卖茶的给你指了回头路。'),c:'muted',fx:{happy:-2},next:'yt_run2',keep:1}]},
  {l:T('Wait: they will be back when they are hungry','等着，饿了自然回来'),out:[
   {w:s=>s.t.luck*.15+.3,t:T('Three days later the child is at the back door, filthy, starving and very much not a great hero yet. Neither of you mentions the note.','三天后，孩子出现在后门口，浑身脏兮兮，饿得前胸贴后背，离"大侠"还差得远。谁也没再提那张字条。'),c:'good',fx:{happy:2,f:(s,c)=>addBond(c.k,4)}},
   {w:1,t:T('A week passes. Then you go, cursing yourself the whole way.','一个礼拜过去了。你这才动身，一路上把自己骂了个遍。'),c:'bad',fx:{happy:-4},next:'yt_run2',keep:1}]},
  {l:T('Send word through people you know','托熟人放出话去'),out:[
   {w:s=>s.fame/20+living(s,['friend','sworn']).length*.3,t:T('Within two days someone sends word: your child is at an inn by the river, three towns down, with a stranger.','两天之内就有人捎信来：孩子在下游三个镇外的一家河边客栈，跟一个陌生人在一起。'),c:'muted',fx:{f:(s,c)=>{c.fast=1}},next:'yt_run2',keep:1},
   {w:1,t:T('Nobody has seen anything. You set out yourself, late.','谁也没瞧见。你只好自己动身，已经晚了。'),c:'muted',next:'yt_run2',keep:1}]}]});
I({id:'yt_run2',only:1,noThread:1,
 text:c=>T(`At a riverside inn you find them: ${YT_kn(c.k).en}, eating noodles, hanging on every word of ${c.npc.en}, who claims to be ${c.truth==='troupe'?'the greatest stage swordsman in the south':'a famous swordsman'}.${c.truth==='fraud'?' There is a covered boat at the jetty, and you can hear other children inside it.':''}`,`在一家河边客栈里，你找到了人：${YT_kn(c.k).zh}正吃着面，听${c.npc.zh}讲得两眼放光。那人自称是${c.truth==='troupe'?'南边戏台上第一号的剑客':'鼎鼎大名的剑客'}。${c.truth==='fraud'?'码头上泊着一条篷船，里头传出别的孩子的声音。':''}`),
 opts:[{l:T('Watch for a while first','先在暗处看一阵'),out:[
   {w:s=>s.smarts/25+s.t.wit*.1,t:c=>c.truth==='fraud'?T('You watch him check the boat’s ropes, count the children with his eyes, and lie fluently. You know exactly what he is.','你看着他去查篷船的缆绳，拿眼睛清点孩子，张口就是谎话。你一下就明白他是干什么的了。'):c.truth==='real'?T('You watch the stranger correct your child’s stance, gently, three times. Whatever else, this one is real.','你看着那人三次轻轻纠正孩子的架势。不管怎样，这人是真有本事的。'):T('You watch the stranger juggle three knives for the inn and pass a hat. Not a swordsman. Not a bad person, either.','你看着那人在客栈里耍三把飞刀，耍完拿帽子讨赏。不是剑客，倒也不是坏人。'),c:'muted',fx:{f:(s,c)=>{c.seen=1}},next:'yt_run3',keep:1},
   {w:1,t:T('The child spots you through the window and the moment is gone.','孩子隔着窗户瞧见了你，再想看也看不成了。'),c:'muted',next:'yt_run3',keep:1}]},
  {l:T('March in and take your child','冲进去把孩子拽走'),out:[
   {w:s=>.5+power(s)/40,t:T('You haul the child out by the collar. They scream that you have ruined their life. The stranger does not try to stop you.','你揪着衣领把孩子拖了出来。孩子尖叫着说你毁了这辈子。那人没敢拦。'),c:'muted',fx:{f:(s,c)=>{addBond(c.k,-8);c.grab=1}},next:'yt_run3',keep:1},
   {w:1,t:T('The child ducks behind the stranger. “You don’t understand anything!”','孩子一闪躲到了那人身后。"你什么都不懂！"'),c:'bad',fx:{f:(s,c)=>addBond(c.k,-4)},next:'yt_run3',keep:1}]},
  {l:T('Challenge the “master” in front of your child','当着孩子的面挑战这位"师父"'),fight:FG((s,c)=>c.npc.lv,'injury',T('A riverside inn','河边客栈'),T('the stranger at the inn','客栈里的陌生人')),
   win:[{w:1,t:c=>c.truth==='real'?T('You win, barely. The stranger bows to you, and your child looks at you as if seeing you for the first time.','你险胜。那人向你抱拳行礼，孩子看你的样子，就像头一回认识你。'):T('He goes down in four moves, and his story goes down with him. Your child goes very quiet.','他四招就倒了，那套说辞也跟着倒了。孩子一下子不吭声了。'),c:'good',fx:{fame:1,f:(s,c)=>{addBond(c.k,6);c.won=1}},next:'yt_run3',keep:1}],
   lose:[{w:1,t:T('You end up on the inn floor. Your child, horrified, kneels beside you crying, and is suddenly very ready to go home.','你被打翻在客栈地上。孩子吓坏了，跪在你身边哭，忽然就一心只想回家了。'),c:'bad',fx:{f:(s,c)=>{addBond(c.k,4);c.lost=1}},next:'yt_run3',keep:1}]}]});
I({id:'yt_run3',only:1,noThread:1,
 text:c=>c.truth==='fraud'?T(`When it is over you learn the truth: ${c.npc.en} sells children to the salt works down the coast. Your child is safe. The others in the boat are not yours.`,`事后你弄清了真相：${c.npc.zh}专把孩子拐去卖给沿海的盐场。你的孩子平安了。可篷船里那些孩子，不是你的。`)
  :c.truth==='real'?T(`${c.npc.en} is exactly who ${c.npc.he} says, and would teach your child if you allowed it. ${YT_kn(c.k).en[0].toUpperCase()+YT_kn(c.k).en.slice(1)} is looking at you.`,`${c.npc.zh}确实是${c.npc.ta}自己说的那个人，你若点头，${c.npc.ta}愿意教这孩子。${YT_kn(c.k).zh}正望着你。`)
  :T(`${c.npc.en} is a stage fighter with a travelling troupe, kind and broke, who could not quite bring themselves to send the child home. Your child is looking at you.`,`${c.npc.zh}原来是个跑江湖戏班的武生，心肠好，兜里空，实在狠不下心把孩子撵回家。孩子正望着你。`),
 opts:[
  {l:T('Free the other children too','把其他孩子也救出来'),if:(s,c)=>c.truth==='fraud',out:[
   {w:s=>.5+power(s)/50+s.smarts/60,t:T('You cut the boat loose and walk seven children back to the nearest yamen. Your own child carries the smallest one the whole way and does not mention heroes again for a long time.','你砍断缆绳，领着七个孩子走到最近的衙门。你自己的孩子一路背着最小的那个，往后很久都没再提过当大侠。'),c:'gold',fx:{align:6,fame:3,deed:T('Freed a boat of stolen children','救下一船被拐的孩子'),f:(s,c)=>addBond(c.k,12)}},
   {w:1,t:T('His partners come back as you are untying the boat. You get the children out, but not cleanly.','你正解缆绳，他的同伙回来了。孩子是救出来了，可你也挂了彩。'),c:'muted',fx:{align:5,fame:2,hurt:[6,14],cause:T('child-sellers','人贩子'),f:(s,c)=>{addCond(s,'wound',1);addBond(c.k,10)}}}]},
  {l:T('Just take your child home','只带自己的孩子回家'),if:(s,c)=>c.truth==='fraud',out:[
   {w:1,t:T('You go home. The child asks, once, about the others. You do not have an answer you like.','你回了家。孩子问过一回那些孩子怎么样了。你给不出一个自己听着都过意不去的回答。'),c:'muted',fx:{align:-3,happy:-2,f:(s,c)=>addBond(c.k,-2)}},
   {w:s=>s.smarts/40,t:T('You report the boat to the constable on the way home. Whether they act, you never learn.','回家路上你去捕快那儿报了案。官府到底管没管，你一直没打听到。'),c:'muted',fx:{align:1,f:(s,c)=>addBond(c.k,3)}}]},
  {l:T('Let your child stay with them','让孩子跟着去'),if:(s,c)=>c.truth!=='fraud',out:[
   {w:s=>s.t.heart*.15+s.t.luck*.1,t:c=>T(`You make ${c.npc.en} swear an oath, and the child writes every month. Each letter is a little less childish. ${c.truth==='real'?'Some years later you start hearing your child’s name in teahouses.':'Some years later you see your child on a stage, flying.'}`,`你逼${c.npc.zh}发了誓。孩子每月都写信回来，一封比一封老成。${c.truth==='real'?'几年后，你开始在茶馆里听人说起你孩子的名字。':'几年后，你在一座戏台上看见了你的孩子，翻得像要飞起来。'}`),c:'good',fx:{happy:2,fame:1,f:(s,c)=>{addBond(c.k,10);storeNpc(s,c,'acq',55)}}},
   {w:1,t:T('The letters stop after a year. You go looking and find the child doing fine, and furious that you came. That is how it is with them.','一年后信断了。你去找，发现孩子过得好好的，只是气你又找来了。孩子大了，就是这样。'),c:'muted',fx:{happy:-3,f:(s,c)=>addBond(c.k,-3)}}]},
  {l:T('Bring your child home','带孩子回家'),if:(s,c)=>c.truth!=='fraud',out:[
   {w:s=>s.t.heart*.15+(power(s)>=40?1:0),t:T('On the walk home you promise to teach the child yourself, properly, every morning. You keep the promise. It changes both of you.','回家路上你答应孩子，以后每天早上正经教。你说到做到。这改变了你们俩。'),c:'good',fx:{happy:4,skill:1,f:(s,c)=>addBond(c.k,12)}},
   {w:1,t:T('The child comes home, and does not forgive you for a whole year, and then one day does, without saying so.','孩子跟你回了家，整整一年没原谅你。后来有一天，什么也没说，就原谅了。'),c:'muted',fx:{happy:-1,f:(s,c)=>addBond(c.k,2)}}]}]});
