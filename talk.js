/* 江湖一生 · talking with the people in your life. A chat picks something real to talk about: what is going on in their
   life, what is going on in yours, something you went through together, someone you both know, or how you are feeling.
   They answer in their own voice (a bold friend and a cold one do not sound alike), and when a conversation goes badly
   there is a reason you can see, not a dice roll. */
'use strict';
const tkN=p=>T(p.n.py,p.n.cn);
const tkP=p=>PRON[p.sex]||PRON.m;
/* how each temperament says things */
const VOICE={
 bold:[(n,q)=>`${n} slaps the table. “${q}”`,(n,q)=>`${n}一拍桌子：“${q}”`],
 scheming:[(n,q)=>`${n} narrows ${'their'} eyes. “${q}”`,(n,q)=>`${n}眯起眼睛：“${q}”`],
 gentle:[(n,q)=>`${n} says softly, “${q}”`,(n,q)=>`${n}轻声道：“${q}”`],
 greedy:[(n,q)=>`${n} rubs ${'their'} hands. “${q}”`,(n,q)=>`${n}搓着手：“${q}”`],
 devoted:[(n,q)=>`${n} is quiet a moment. “${q}”`,(n,q)=>`${n}出了会儿神：“${q}”`],
 'a heavy drinker':[(n,q)=>`${n} takes a long swallow of wine. “${q}”`,(n,q)=>`${n}灌了一大口酒：“${q}”`],
 eccentric:[(n,q)=>`${n} says to the ceiling, “${q}”`,(n,q)=>`${n}盯着房梁说：“${q}”`],
 upright:[(n,q)=>`${n} says plainly, “${q}”`,(n,q)=>`${n}正色道：“${q}”`],
 timid:[(n,q)=>`${n} lowers ${'their'} voice. “${q}”`,(n,q)=>`${n}压低了声音：“${q}”`],
 arrogant:[(n,q)=>`${n} sniffs. “${q}”`,(n,q)=>`${n}哼了一声：“${q}”`],
 cheerful:[(n,q)=>`${n} grins. “${q}”`,(n,q)=>`${n}笑嘻嘻地说：“${q}”`],
 cold:[(n,q)=>`${n} says flatly, “${q}”`,(n,q)=>`${n}淡淡地说：“${q}”`]};
const tkTrait=p=>(TRAITS[p.trait]||TRAITS[0])[0];
/* when it matters, people drop their usual manner */
const VOICE2={bold:[n=>`${n} drops the big voice for once.`,n=>`${n}难得收起了大嗓门：`],scheming:[n=>`${n}, for once, says it straight.`,n=>`${n}难得没绕弯子：`],greedy:[n=>`${n}, for once not talking about money:`,n=>`${n}难得没提钱：`],
 'a heavy drinker':[n=>`${n} puts the wine down.`,n=>`${n}放下了酒碗：`],eccentric:[n=>`${n}, unusually serious:`,n=>`${n}难得正经了一回：`],arrogant:[n=>`${n}, dropping the airs for once:`,n=>`${n}难得没摆架子：`],
 cheerful:[n=>`${n} stops smiling.`,n=>`${n}收起了笑：`],cold:[n=>`${n} pauses, and the voice softens a little.`,n=>`${n}顿了顿，语气软了些：`]};
function voice(p,q,tone){const t=tkTrait(p),P=tkP(p);
  if(tone==='care'&&VOICE2[t])return T(`${VOICE2[t][0](p.n.py)} “${q.en}”`,`${VOICE2[t][1](p.n.cn)}“${q.zh}”`);
  const v=VOICE[t]||VOICE.gentle;return T(v[0](p.n.py,q.en).replace(/\btheir\b/,P.his),v[1](p.n.cn,q.zh))}
/* the same line twice in a row with the same person is what makes conversations feel canned */
function tkPick(s,p,key,list){p.tkSeen=p.tkSeen||[];const fresh=list.map((x,i)=>({x,k:key+i})).filter(o=>!p.tkSeen.includes(o.k));const o=pick(fresh.length?fresh:list.map((x,i)=>({x,k:key+i})));
  p.tkSeen.push(o.k);if(p.tkSeen.length>12)p.tkSeen.shift();return o.x}
const harvestBad=s=>s.world&&s.world.h<=-1;

/* ---------- what is going on in their life ---------- */
const OCC_NEWS={
 trade:[T('Prices on the river are crazy this year. I bought low, for once.','今年江上行情疯了。难得一回，我买在了低处。'),T('A partner of mine ran off owing me money. Never trust a man who laughs at his own jokes.','有个合伙的欠了我的钱跑了。笑自己笑话的人，信不得。'),T('I am thinking of opening a second shop. Or a teahouse. Or neither.','我想再开一间铺子。或者开个茶馆。或者都不开。')],
 martial:[T('Just back from a run to the west. Sand in everything I own.','刚走完一趟西边的镖回来，浑身上下哪儿都是沙子。'),T('A youngster challenged me last month. I let him lose slowly, so he would learn something.','上个月有个毛头小子找我比划。我让他输得慢一点，好让他学到点东西。'),T('My knee tells me when it is going to rain now. The jianghu is for the young.','我这膝盖如今能报天气了。江湖啊，是年轻人的。')],
 scholar:[T('I failed the exam again. My calligraphy was praised. My answer was not.','又落榜了。字写得被夸了，文章没有。'),T('I found a book nobody has opened in a hundred years. The worms had opened it first.','我淘到一本百来年没人翻过的书。蛀虫倒是先翻过了。')],
 religious:[T('The temple roof leaks onto the Buddha. We are taking it as a sign, of what we are not sure.','庙顶漏雨，正漏在佛像头上。我们当它是个兆头，至于兆的什么，还没想明白。'),T('A pilgrim left a bag of silver and a confession. I am keeping both safe.','有个香客留下一袋银子和一番忏悔。两样我都替他收好了。')],
 labour:[T('The rain came at the right time this year. You can hear the rice growing.','今年雨水来得正是时候，你都能听见稻子在长。'),T('My back is bad, the work is good, and the boss is a fool. Same as always.','腰不好，活儿不错，东家是个糊涂蛋。老样子。'),T('I caught a fish as long as my arm. Nobody believes me. You believe me.','我钓到一条胳膊那么长的鱼。没人信。你信吧。')],
 entertain:[T('A rich man wants me to sing only for him. I said my voice belongs to the street.','有个阔老爷想让我只给他一个人唱。我说我的嗓子是街上的。'),T('I learned a new piece. Sit; you are going to hear it whether you like it or not.','我新学了一段。坐下，你爱不爱听都得听。')],
 official:[T('The new magistrate is honest. Everyone at the yamen is terrified.','新来的县官是个清官。衙门上下都吓坏了。'),T('Three cases this month, all the same family, all about one goat.','这个月三桩案子，都是同一家人，都是为了一只羊。')],
 doctor:[T('I set a bone this week that I am rather proud of.','这礼拜接了一根骨头，我自己都挺得意。'),T('Half my patients need rest, not medicine. Nobody wants to hear that.','我的病人有一半要的是歇着，不是吃药。可没人爱听这话。')],
 rich:[T('My family has arranged a match with someone I have never met. I have met the horse that comes with it, and I like the horse.','家里给我说了门亲，对方的面我都没见过。随亲事送来的那匹马我倒见了，比人招人喜欢。'),T('I lost forty taels at dice and told my father I gave it to a temple. He was proud of me.','我赌钱输了四十两，跟我爹说捐给了庙里。他还夸我了。')],
 beggar:[T('A cook at the big inn gives me the burnt rice. Burnt rice is underrated.','大客栈的厨子把锅巴留给我。锅巴这东西，被人小看了。'),T('Someone dropped a whole bun today. I am having a good year.','今天有人掉了一整个馒头。我今年运气不错。')],
 elder:[T('My grandson can recite the Three Character Classic. Backwards, mostly.','我孙子会背《三字经》了。多半是倒着背的。'),T('My knees are old, my teeth are old, but my memory is fine. Mostly fine.','膝盖老了，牙也老了，记性还行。大体还行。')],
 kid:[T('I can climb the big tree now. All the way. Almost.','我能爬上那棵大树了。一直爬到顶。差一点点。'),T('There is a cat that lives under the bridge and I have named it General.','桥底下住着一只猫，我给它起名叫“大将军”。')]};
const OCC_GROUP=o=>o==null?null:[5,17,23,26].includes(o)?'trade':[8,13,14,28].includes(o)?'martial':[1,24].includes(o)?'scholar':[2,3,4,22].includes(o)?'religious':[0,15,16,25,29].includes(o)?'labour':[6,30].includes(o)?'entertain':[9,31].includes(o)?'official':o===10?'doctor':[11,12].includes(o)?'rich':o===7?'beggar':[18,19].includes(o)?'elder':[20,21].includes(o)?'kid':null;
function newsOf(s,p){const r=p.rel,a=p.age;
  if(['father','mother'].includes(r))return a>=62?[T('My legs are not what they were. The stairs and I have an understanding.','腿脚不如从前了。我跟那道台阶，算是讲和了。'),T('I can no longer thread a needle. I make your cousin do it, and she complains.','针眼穿不进去了。我叫你表妹穿，她老抱怨。'),T('I dreamed about your grandfather. He was annoyed about something, as usual.','我梦见你爷爷了。他又在为什么事生气，跟活着时一样。')]
    :harvestBad(s)?[T('The harvest is bad. We will manage. We always manage.','收成不好。会熬过去的，哪回不是熬过去的。'),T('Rice is dear this year. Do not send money. Well. Maybe a little.','今年米贵。别寄钱回来。嗯……寄一点也行。')]
    :[T('The neighbours’ son got married. Very nice wedding. Very loud.','隔壁家儿子成亲了。婚事办得很体面，也很吵。'),T('The roof is fixed. The well is fine. The chickens are plotting something.','屋顶修好了，井也没事。鸡在密谋什么。'),T('Everyone in the village asks about you. I tell them you are doing well. Are you?','村里人都问起你。我说你过得好。是吧？')];
  if(r==='spouse'){const k=living(s,'child');return[T('The rice jar is getting low and the neighbour’s dog got into the garden again.','米缸快见底了，隔壁的狗又钻进菜园子了。'),k.length?T(`${k[0].n.py} said something so clever today I nearly cried.`,`今天${k[0].n.cn}说了句话，聪明得我差点掉眼泪。`):T('I have been thinking about getting a cat. Or a goose. A goose would guard the house.','我在想养只猫，或者养只鹅。鹅还能看家。'),T('I walked past the place where we first met. It is a noodle shop now.','我路过我们初见的地方。如今开成面馆了。')]}
  if(r==='child')return a<6?[T('Look! A bug!','你看！有虫子！'),T('Why is the moon following us?','月亮为什么跟着我们走？')]:a<16?[T('The teacher hit my hand again. I only said what everyone was thinking.','先生又打我手心了。我只是说了大家心里想的。'),T('I can do the move you showed me. Watch. Watch! You did not watch.','你教我那招我会了。看。快看！你又没看。')]:[T('I am thinking about what to do with my life. I have decided not to decide yet.','我在想这辈子要干什么。我决定先不决定。'),T('There is someone I like. No, I will not tell you who.','我有喜欢的人了。不，我不告诉你是谁。')];
  if(r==='sibling')return[T('My little one has started walking and is now in everything.','我家小的会走路了，如今什么都要碰。'),T('Mother keeps asking me why I cannot be more like you. I tell her I am trying not to be.','娘总问我为什么不能学学你。我说我正努力别学你。'),T('Work is work. Life is life. The two are not speaking to each other.','活是活，日子是日子。这俩谁也不理谁。')];
  if(r==='master')return[T('The disciples this year are lazy. Except one. I will not tell you which.','今年这批弟子懒得很。只有一个例外。我不说是谁。'),T('I have been thinking about a move I got wrong forty years ago.','我在琢磨一招四十年前练错了的功夫。')];
  if(a>=65)return OCC_NEWS.elder;if(a<13)return OCC_NEWS.kid;
  return OCC_NEWS[OCC_GROUP(p.occ)]||OCC_NEWS.labour}

/* ---------- what is going on in yours, as they see it ---------- */
function aboutYou(s,p){const L=[],up=tkTrait(p)==='upright',P=tkP(p);
  if(s.ill||condKeys(s).length||s.health<s.maxHealth*.5)L.push({w:3,tone:'care',me:T('They notice you are not well.','对方看出你身子不好。'),q:[T('You look terrible. Sit down. No, sit down properly.','你脸色太难看了。坐下。不，给我好好坐下。'),T('Have you seen a doctor? A real one, not the one who sells dog plasters.','看大夫了没有？正经大夫，不是卖狗皮膏药的那种。'),T('You always do this. You push until something breaks, and then you are surprised.','你老是这样。硬撑到撑不住了，又一脸意外。')],fit:{gentle:1,devoted:1,cold:-.3},good:T('They fuss over you all evening, and you let them.','对方围着你忙了一晚上，你也由着。')});
  if(s.wanted>0)L.push({w:3,me:T('They have seen your face on a notice.','对方在告示上见过你的画像。'),q:T('There is a picture of you at the city gate. It is not a good likeness, but still.','城门口贴着你的画像。画得不太像，可还是……'),fit:{timid:-1.2,bold:.6,upright:-.6},bad:T(`${p.n.py} is frightened of being seen with you, and keeps glancing at the door.`,`${p.n.cn}怕跟你在一起被人瞧见，眼睛一直往门口瞟。`)});
  const insider=['master','fellow','disciple'].includes(p.rel)||p.sect===s.sect;
  if(s.sect&&SECTS[s.sect]&&SECTS[s.sect].evil&&up&&!insider)L.push({w:4,me:T(`They know which sect you have joined.`,`对方知道你入了哪个门派。`),q:T(`${cap(SECTS[s.sect].en)}? I did not think you were that kind of person.`,`${SECTS[s.sect].cn}？我没想到你是这种人。`),fit:{upright:-1.5},bad:T(`${p.n.py} cannot let it go, and the talk ends badly.`,`${p.n.cn}心里过不去这道坎，话越说越僵。`)});
  else if(s.sect&&SECTS[s.sect]&&!insider)L.push({w:1.5,me:T(`They ask about ${SECTS[s.sect].en}.`,`对方问起${SECTS[s.sect].cn}的事。`),q:[T('Is it true what they say, that you all get up before the roosters?','听说你们门里的人都比鸡起得还早，真的假的？'),T('Do they feed you properly up there? You look thin.','门里管饭管饱吗？你看着瘦了。'),T('Is your master as frightening as people say?','你师父真像外头说的那么吓人？')],fit:{cheerful:.4}});
  if(s.align<=-40&&up&&!(s.sect&&SECTS[s.sect]&&SECTS[s.sect].evil))L.push({w:3,me:T('They have heard what people say about you.','对方听说了外头怎么说你。'),q:T('People are saying things about you. Bad things. Tell me they are lying.','外头都在说你的事，难听得很。你告诉我那都是瞎说。'),fit:{upright:-1},bad:T(`${p.n.py} does not like your answer.`,`${p.n.cn}不喜欢你的回答。`)});
  if(s.fame>=40)L.push({w:2,me:T('Your name has come up in their part of town.','你的名号传到了对方那一带。'),q:[T('Someone at the teahouse was telling a story about you. I said I knew you. Nobody believed me.','茶馆里有人在讲你的故事。我说我认识你，没人信。'),T('A stranger asked me if it is true you can walk on water. I said only when it is frozen.','有个生人问我，你是不是真能水上漂。我说结冰的时候能。'),T('Do people bow to you in the street now? Tell me the truth.','如今街上有人给你作揖了吧？说实话。')],fit:{cheerful:.6,arrogant:-.6,greedy:.3},bad:T(`${p.n.py} is a little sour about it. Fame changes people, ${P.he} says, looking at you.`,`${p.n.cn}有点酸溜溜的。“人一出名就变了。”说着看了你一眼。`)});
  const sp=spouseOf(s);if(sp&&sp.id!==p.id)L.push({w:1.5,me:T(`They ask after ${sp.n.py}.`,`对方问起${sp.n.cn}。`),q:T(`How is ${sp.n.py}? Still putting up with you?`,`${sp.n.cn}还好吗？还忍得了你？`),fit:{cheerful:.4,devoted:.3}});
  else if(!sp&&s.age>=22&&s.age<=40)L.push({w:['father','mother'].includes(p.rel)?4:1.2,me:T('The subject of marriage comes up.','说着说着，扯到了成亲的事。'),q:['father','mother'].includes(p.rel)?(s.gender==='f'?T('The Zhangs’ son is still not married, you know. I am only saying.','张家公子还没娶亲呢。我就随口一说。'):T('The Wangs’ daughter is still unmarried, you know. I am only saying.','王家闺女还没许人家呢。我就随口一说。')):[T('Still alone? You should do something about that before you are too old and strange.','还一个人呢？趁还没老到古怪，赶紧想想办法。'),T('I know someone you should meet. No, do not make that face.','我认识个人，你该见见。别，别摆那副脸。')],fit:{cheerful:.3,arrogant:-.3},bad:T('You change the subject. It does not stay changed.','你岔开了话题。没岔开多久。')});
  if(s.realm>=4)L.push({w:1.5,me:T('They ask, half joking, how strong you have become.','对方半开玩笑地问你如今有多厉害。'),q:[T('Could you knock that wall down? Do not, I am just asking.','你能一掌把那堵墙拍倒吗？别真拍，我就问问。'),T('They say people like you can hear a needle drop across a courtyard. Can you?','听说你们这种人，隔着一个院子都能听见针掉在地上。真的？'),T('Do you ever get bored, being that strong?','厉害成这样，你不会闷得慌吗？')],fit:{cheerful:.4,bold:.4,arrogant:-.5},bad:T(`${p.n.py} seems to feel small next to you, and goes quiet.`,`${p.n.cn}在你面前像是矮了一截，不吭声了。`)});
  if(s.money>=1500)L.push({w:1.2,me:T('They have noticed you are doing well.','对方看出你如今宽裕了。'),q:T('You must be doing well. I am not asking. I am only noticing.','你如今日子不错啊。我不是要什么，我就是看见了。'),fit:{greedy:-.6,cheerful:.3},bad:T(`${p.n.py} spends the rest of the evening hinting about money.`,`${p.n.cn}剩下的工夫都在旁敲侧击地提钱。`)});
  return L}

/* ---------- something you went through together ---------- */
function sharedPast(s,p){const L=[];const mem=(s.mem||[]).filter(r=>r.pid===p.id&&r.what&&r.what.zh);
  if(mem.length){const r=pick(mem),n=s.age-r.at;L.push({w:4,me:T(`You talk about ${n>0?n+' years ago':'earlier this year'}: ${r.what.en.replace(/["”]+$/,'')}`,`你们说起${n>0?cnYrs(n)+'年前':'今年早些时候'}的事：${r.what.zh.replace(/["”]+$/,'')}`),q:{helped:T('I never thanked you properly for that. Thank you.','那件事我一直没好好谢过你。谢谢。'),wronged:T('I still think about that. I am trying not to.','那件事我到现在还会想起。我在努力不去想。'),beat:T('I still say I slipped.','我到现在还说，那回是我脚下滑了。'),lostTo:T('You were not bad, for a beginner.','对一个新手来说，你那回还不算差。'),met:T('Strange how things turn out.','事情的走向，真是说不准。')}[r.kind]||T('Strange how things turn out.','事情的走向，真是说不准。'),fit:r.kind==='wronged'?{gentle:.3,cold:-1,arrogant:-.8,devoted:-.3}:{devoted:.6,gentle:.4,cheerful:.3},bad:r.kind==='wronged'?T('It was a mistake to bring it up.','提这件事是个错误。'):null})}
  const yrs=s.age-(p.met??s.age);if(yrs>=8&&!['father','mother','child','sibling'].includes(p.rel))L.push({w:2,me:T(`You realise you have known ${p.n.py} for ${yrs} years.`,`你忽然意识到，你认识${p.n.cn}已经${cnYrs(yrs)}年了。`),q:T(`When we met, you were ${p.met} and thought you knew everything.`,`我们刚认识那会儿，你才${cnNum(p.met)}岁，自以为什么都懂。`),fit:{devoted:.6,cheerful:.4,cold:-.2}});
  if(p.rel==='sworn')L.push({w:1.5,me:T('You talk about the day you swore the oath.','你们说起结拜那天。'),q:T('The incense was cheap and the wine was worse. I would do it again.','香是便宜货，酒更差。可让我再来一回，我还结。'),fit:{bold:.6,devoted:.6}});
  return L}

/* ---------- someone you both know ---------- */
function gossip(s,p){const others=near(s).filter(o=>o.id!==p.id&&o.age>=12);if(!others.length)return[];
  const o=pick(others),rl=relLabel(s,o);
  return[{w:1.5,me:T(`Talk turns to ${o.n.py}, your ${rl.en.toLowerCase()}.`,`话题转到了你的${rl.zh}${o.n.cn}身上。`),q:o.bond>=60?T(`${o.n.py}? Good sort. You could do worse.`,`${o.n.cn}？人不错。你身边有这样的人，是福气。`):T(`${o.n.py}? I would watch that one, if I were you.`,`${o.n.cn}？换了我，可得防着点。`),fit:{scheming:.6,cheerful:.3,upright:-.5},bad:T(`${p.n.py} does not like talking about people behind their backs, and says so.`,`${p.n.cn}不爱在背后议论人，直说了。`)}]}

/* ---------- how you are ---------- */
function yourMood(s,p){if(s.happy>=35)return[];
  return[{w:4,tone:'care',me:T('You find yourself telling them how hard things have been.','你不知不觉跟对方说起了这些日子有多难。'),q:{gentle:T('Come here. You do not have to say any more.','过来。不用再说了。'),devoted:T('Why did you not come to me sooner?','怎么不早点来找我？'),bold:T('Then we drink until it is better. Or until we forget.','那就喝，喝到好受为止，或者喝到忘了为止。'),cheerful:T('Right. Tomorrow we go and do something stupid. Trust me.','行。明天咱们去干件傻事。信我。'),cold:T('Everyone has hard years.','谁都有难的时候。'),arrogant:T('You will get over it. I always do.','会过去的。我每回都过去了。'),scheming:T('Tell me who is responsible. I am only asking.','告诉我是谁害的。我就问问。'),greedy:T('Money trouble? I hope it is not money trouble.','是缺钱吗？可别是缺钱。')}[tkTrait(p)]||T('I am listening.','我在听。'),
   fit:{gentle:1.2,devoted:1,bold:.6,cheerful:.6,cold:-.9,arrogant:-.6,greedy:-.5},good:T('You feel lighter walking home.','回去的路上，你心里轻了许多。'),bad:T('It does not help. You wish you had not said anything.','没什么用。你后悔说了。'),mood:[4,8]}]}

/* ---------- just being silly ---------- */
function tease(s,p){if(['father','mother','master'].includes(p.rel)||p.age<6)return[];
  return[{w:1.2,me:pick([T(`You tease ${p.n.py} about ${tkP(p).his} cooking.`,`你拿${p.n.cn}的厨艺开玩笑。`),T(`You tease ${p.n.py} about the time ${tkP(p).he} fell in the river.`,`你拿${p.n.cn}那回掉进河里的事开玩笑。`),T(`You tease ${p.n.py} about ${tkP(p).his} terrible singing.`,`你拿${p.n.cn}那副破锣嗓子开玩笑。`),T(`You do an impression of ${p.n.py}.`,`你学${p.n.cn}说话的样子。`)]),q:[T('You are never going to let that go, are you?','这事你是要念叨一辈子了是吧？'),T('That was one time. One time!','就那么一回！就一回！'),T('Say that again and I will tell everyone about the goose.','你再说，我就把那只鹅的事告诉所有人。')],fit:{cheerful:1,bold:.6,arrogant:-1.4,cold:-1,timid:-.4},good:T('You both laugh until you cannot breathe.','你们俩笑得喘不上气。'),bad:T(`${p.n.py} does not find it funny. You picked the wrong thing to joke about.`,`${p.n.cn}一点也不觉得好笑。你拿错了事开玩笑。`)}]}

/* ---------- the conversation ---------- */
function talkRun(s,p){
  /* small children and the old family pools keep their charm */
  if(s.age<13&&p.age<16||(p.rel==='child'&&p.age<10))return false;
  const T0=[];const news=newsOf(s,p);T0.push({w:2.5,news:1,me:T(`You ask ${p.n.py} how things are.`,`你问起${p.n.cn}的近况。`),q:tkPick(s,p,'n'+p.rel,news),fit:{}});
  T0.push(...aboutYou(s,p),...sharedPast(s,p),...gossip(s,p),...yourMood(s,p),...tease(s,p));
  const last=p.tkLast;const topic=wpick(T0,t=>t.w*(last&&t.me.zh===last?.2:1));p.tkLast=topic.me.zh;
  if(Array.isArray(topic.q))topic.q=tkPick(s,p,'q'+topic.me.zh.length,topic.q);const tr=tkTrait(p);const score=(topic.fit[tr]||0)+(p.bond-50)/45+(R()-.5)*.8;
  say(s,topic.me.en.replace(/^They (notice|know|ask|have)\b/,(m,v)=>p.n.py+' '+(v==='have'?'has':v+'s')),topic.me.zh.replace(/^对方/,p.n.cn),'muted');sayT(s,voice(p,topic.q,topic.tone));
  if(score<-.75){addBond(p,-rint(2,5));if(topic.bad)sayT(s,topic.bad,'muted');else say(s,`Somewhere the conversation turns. ${p.n.py} grows quiet and leaves early.`,`说着说着，话头不知怎么就拧了。${p.n.cn}沉默下来，早早走了。`,'muted');return true}
  if(score>1.05){addBond(p,rint(7,12));happy(s,topic.mood?rint(topic.mood[0],topic.mood[1]):3);sayT(s,topic.good||T(`It turns into the best talk you have had with ${p.n.py} in years.`,`聊着聊着，成了你和${p.n.cn}这几年最痛快的一回。`),'good');if(chance(.35)&&typeof relKinds==='function'&&relKinds(s,p).includes('confide'))relEvent(s,p,'confide');return true}
  addBond(p,rint(2,6));happy(s,topic.mood?rint(1,topic.mood[0]):1);return true}
