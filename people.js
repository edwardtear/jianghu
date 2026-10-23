/* 江湖一生 · the people you know are people, not menus. Three things live here:
   1. Chatting lets you choose what to talk about (three topics drawn from what is really going on), plus a few new ones:
      asking their advice, talking about the future, paying them a compliment.
   2. They come to you: to ask for help, to invite you to things, to give you things, to warn you, to drag you into
      their quarrels. Who asks for what depends on who they are (a smith, a merchant, an old mother, a sworn brother).
   3. You can ask them for things (请托): a loan, a job, a match, treatment, a word with the yamen, advice, a bed. */
'use strict';
const PE_OCC=p=>p.occ==null?null:OCC_GROUP(p.occ);
const peNpc=(s,p)=>Object.assign(npc(s),{en:p.n.py,zh:p.n.cn,n:p.n,sex:p.sex,he:PRON[p.sex].he,him:PRON[p.sex].him,his:PRON[p.sex].his,He:PRON[p.sex].He,His:PRON[p.sex].His,ta:PRON[p.sex].ta,occ:p.occ,age:p.age,lv:p.lv});
const peFam=p=>['father','mother','sibling','spouse','child','grandparent'].includes(p.rel);
const peSpend=(s,n)=>{if(s.ap>0)s.ap=Math.max(0,s.ap-n)};
/* a decision can be saved and reloaded: always act on the real person, not the copy stored with it */
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){if(q&&q.c&&q.c.pid&&/^(pk_|pe_)/.test(q.id)){const p=person(s,q.c.pid);if(p)q.c.p=p}return ci.apply(this,arguments)}})();

/* ---------- 1. choosing what to talk about ---------- */
const TOPIC_LB=[[/近况/,T('Ask how things are','问问对方近况')],[/话题转到了/,T('Talk about someone you both know','聊聊你们都认识的人')],[/身子不好/,T('Talk about your health','说说你最近的身子')],[/告示上/,T('Talk about the wanted notice','说说你被通缉的事')],[/入了哪个门派/,T('Talk about the sect you joined','说说你入的门派')],
 [/问起.+的事。$/,T('Talk about sect life','聊聊门派里的事')],[/外头怎么说你/,T('Answer the rumours about you','说说外头那些传言')],[/名号传到/,T('Talk about your reputation','聊聊你的名声')],[/^对方问起.+。$/,T('Talk about your family','聊聊家里人')],
 [/成亲的事/,T('Talk about marriage','聊聊终身大事')],[/有多厉害/,T('Talk about your martial arts','聊聊你的武功')],[/宽裕/,T('Talk about how you make your living','聊聊你的营生')],[/你们说起/,T('Talk about your history together','聊聊你们的往事')],
 [/已经.+年了/,T('Remember how you met','回忆你们是怎么认识的')],[/结拜那天/,T('Talk about the day you swore the oath','说起结拜那天')],[/倾诉|有多难/,T('Pour your heart out','向对方倾诉心事')],[/开玩笑|学.+说话/,T('Make a joke','开个玩笑')]];
function topicLabel(t){if(t.lb)return t.lb;for(const[re,l]of TOPIC_LB)if(re.test(t.me.zh))return l;return T('Talk about this and that','东拉西扯')}
/* three more things you can bring up */
function extraTopics(s,p){const L=[],tr=tkTrait(p),stronger=p.lv>power(s)+10,occ=PE_OCC(p);
  L.push({w:1.6,lb:T('Ask their advice','向对方讨教'),me:T(`You ask ${p.n.py} for advice.`,`你向${p.n.cn}讨教。`),
   q:stronger?[T('Your weight is on your heels. Fix that first; everything else follows.','你的分量压在脚后跟上。先改这个，别的都跟着顺了。'),T('You attack like someone who wants it over with. Learn to enjoy being patient.','你出手像是急着收场。学着享受耐心。'),T('Stop watching the blade. Watch the shoulder.','别盯着刀，盯着肩膀。'),T('You breathe in when you strike. Breathe out.','你出招时在吸气。该呼气。')]
    :occ==='trade'?[T('Never buy what everyone is buying. By the time you hear about it, it is too late.','别人都在买的东西，你别买。等你听说，已经晚了。'),T('Always know who pays the boatman.','永远弄清楚船钱是谁付的。'),T('A small profit every year beats a big one once.','年年小赚，强过一回大赚。')]
    :['father','mother','grandparent'].includes(p.rel)?[T('Eat properly, sleep early, and do not lend money to anyone who calls you brother.','好好吃饭，早点睡，管你叫兄弟的人借钱，一概别借。'),T('Choose friends who tell you when you are wrong.','交那种你错了会直说的朋友。'),T('Whatever you are carrying, put it down for one night and see if you still want it in the morning.','不管心里压着什么，先放下睡一晚，看看天亮了还想不想要。')]
    :p.rel==='master'?[T('You are trying to be clever. Be correct first.','你想耍聪明。先把对的练会。'),T('A hundred more repetitions. Then ask me again.','再练一百遍。然后再来问我。')]
    :[T('Do the thing you are afraid of first. The rest of the day is easier.','先做你最怕的那件事，一天剩下的就好过了。'),T('If you cannot decide, it does not matter much. Pick one.','拿不定主意，说明哪个都差不多。挑一个就是。'),T('Ask someone older. Then ignore half of it.','去问年纪大的人。然后忘掉一半。'),T('Nobody is watching you as closely as you think.','没人像你以为的那样盯着你。')],
   fit:{arrogant:.8,upright:.5,gentle:.4,cold:-.5,timid:-.3},good:stronger?T('You try it that evening. They are right.','当晚你就试了。对方说得对。'):T('It is good advice. You may even take it.','是句好话。说不定你真会照做。'),fx:stronger?{skill:[1,2]}:{smarts:1}});
  if(p.age>=16)L.push({w:1.2,lb:T('Talk about the future','聊聊将来的打算'),me:T(`You and ${p.n.py} talk about what comes next.`,`你和${p.n.cn}聊起往后的打算。`),
   q:[T('I want a small house with a big tree in the yard. That is all. Is that too much?','我就想要个小院子，院里有棵大树。就这些。算多吗？'),T('One day I will see the sea. You will come with me.','总有一天我要去看海。到时候你得陪我去。'),T('I do not think about the future. It has never once listened to me.','我不想将来的事。将来从来没听过我一回。'),T('I want to be remembered for something. I do not know what yet.','我想让人记住我点什么。还不知道是什么。'),T('I want to open a noodle shop. A good one. Do not laugh.','我想开家面馆。好面馆。不许笑。'),T('Honestly? I would like one quiet year. Just one.','说实话？我就想过一年安生日子。一年就行。'),T('I am going to learn to read properly before I die.','我死之前，一定要把字认全。')],
   fit:{devoted:.7,cheerful:.4,bold:.4,cold:-.6,eccentric:.3},good:T(`You make a promise, half joking, that you both mean.`,`你们半开玩笑地许了个约，其实都当了真。`)});
  L.push({w:1,lb:T('Pay them a compliment','夸对方几句'),me:T(`You tell ${p.n.py} something you admire about ${PRON[p.sex].him}.`,`你说起佩服${p.n.cn}的地方。`),
   q:{arrogant:T('Finally, someone notices.','总算有人看出来了。'),upright:T('Flattery does not suit you. But thank you.','恭维话不像你说的。不过，谢谢。'),cold:T('…Hm.','……嗯。'),timid:T('Me? Really? You are just being kind.','我？真的吗？你就是客气。'),greedy:T('Kind words are cheap. I like them anyway.','好话不值钱，不过我爱听。')}[tr]||T('You are going to make me blush.','你这么说，我都不好意思了。'),
   fit:{arrogant:1.2,timid:.6,gentle:.5,upright:-.8,scheming:-.5,cold:-.4},bad:T(`${p.n.py} wonders, aloud, what you want.`,`${p.n.cn}直接问你：“说吧，有什么事求我？”`)});
  return L}
/* the chat menu */
I({id:'pk_chat',only:1,noRipple:1,noThread:1,tags:['rel'],
 text:c=>T(`You sit down with ${c.npc.en}. What do you talk about?`,`你和${c.npc.zh}坐下来说话。聊点什么？`),
 opts:[0,1,2].map(i=>({l:c=>topicLabel(c.tp[i]),if:(s,c)=>!!c.tp[i],out:[{t:T('',''),fx:{f:(s,c)=>talkDo(s,c.p,c.tp[i])}}]})).concat([
  {l:T('Just chat, and see where it goes','随便聊聊，聊到哪儿算哪儿'),out:[{t:T('',''),fx:{f:(s,c)=>{if(!c.p)return;const used=s.tkYr===s.age?(s.tkUsed||[]):[];const fr=c.all.filter(t=>!used.includes(t.lb.zh));talkDo(s,c.p,pick(fr.length?fr:c.all))}}}]}])});
/* say() ignores empty lines so the hidden outcome text above prints nothing */
(()=>{const s0=say;say=function(s,en,zh){if(en===''&&zh==='')return;return s0.apply(this,arguments)}})();
function talkTopics(s,p){const T0=[];const news=newsOf(s,p);T0.push({w:2.5,news:1,me:T(`You ask ${p.n.py} how things are.`,`你问起${p.n.cn}的近况。`),q:tkPick(s,p,'n'+p.rel,news),fit:{}});
  T0.push(...aboutYou(s,p),...sharedPast(s,p),...gossip(s,p),...yourMood(s,p),...tease(s,p),...extraTopics(s,p));
  T0.forEach(t=>{if(Array.isArray(t.q))t.q=tkPick(s,p,'q'+t.me.zh.length,t.q);t.lb=topicLabel(t)});return T0}
function talkDo(s,p,topic){if(!p||!topic)return;p.tkLast=topic.me.zh;
  const tr=tkTrait(p);const score=(topic.fit[tr]||0)+(p.bond-50)/45+(R()-.5)*.8;
  say(s,topic.me.en.replace(/^They (notice|know|ask|have)\b/,(m,v)=>p.n.py+' '+(v==='have'?'has':v+'s')),topic.me.zh.replace(/^对方/,p.n.cn),'muted');sayT(s,voice(p,topic.q,topic.tone));
  if(score<-.75){addBond(p,-rint(2,5));sayT(s,topic.bad||T(`Somewhere the conversation turns. ${p.n.py} grows quiet and leaves early.`,`说着说着，话头不知怎么就拧了。${p.n.cn}沉默下来，早早走了。`),'muted');return}
  if(score>1.05){addBond(p,rint(7,12));happy(s,topic.mood?rint(topic.mood[0],topic.mood[1]):3);if(topic.fx)applyFx(s,topic.fx,{});
    sayT(s,topic.good||T(`It turns into the best talk you have had with ${p.n.py} in years.`,`聊着聊着，成了你和${p.n.cn}这几年最痛快的一回。`),'good');
    if(chance(.3)){if(chance(.5)&&typeof relKinds==='function'&&relKinds(s,p).includes('confide'))relEvent(s,p,'confide');else peMaybe(s,p,1)}return}
  addBond(p,rint(2,6));happy(s,topic.mood?rint(1,topic.mood[0]):1);if(topic.fx&&score>.3)applyFx(s,topic.fx,{})}
/* talk.js's chat now opens the menu instead of picking for you */
talkRun=function(s,p){if(s.age<13&&p.age<16||(p.rel==='child'&&p.age<10))return false;
  const all=talkTopics(s,p),last=p.tkLast,tp=[];const pool=all.slice();
  while(tp.length<3&&pool.length){const t=wpick(pool,t=>t.w*(last&&t.me.zh===last?.2:1));pool.splice(pool.indexOf(t),1);if(!tp.some(x=>x.lb.zh===t.lb.zh))tp.push(t)}
  const c=scene();c.pid=p.id;c.p=p;c.npc=peNpc(s,p);c.tp=tp;c.all=all;runIncident(s,INC_BY.pk_chat,c);return true};

/* ---------- 2. they come to you ---------- */
const PE={};const PE_ORDER=[];
function PEV(id,d){d.id='pe_'+id;d.only=1;d.tags=['rel'];d.noRipple=1;PE[id]=d;PE_ORDER.push(id);I(d)}
function peCands(s,p){if(!p.alive||hostile(p)||p.bond<30||p.age<14)return[];if(p.peLast!=null&&s.age-p.peLast<3)return[];
  return PE_ORDER.filter(id=>{const d=PE[id];const last=(s.peSeen||{})[id];return(last==null||s.age-last>=(d.gap||6))&&(!d.who||d.who(s,p))})}
function peRun(s,p,id){const inc=INC_BY['pe_'+id];if(!inc)return false;const c=Object.assign(scene(),inc.ctx?inc.ctx(s,p):{});c.pid=p.id;c.p=p;c.npc=peNpc(s,p);
  p.peLast=s.age;(s.peSeen=s.peSeen||{})[id]=s.age;runIncident(s,inc,c);const q=s.queue[s.queue.length-1];if(q&&q.id===inc.id)q.tagline=T(`From ${p.n.py} · ${relLabel(s,p).en}`,`${relLabel(s,p).zh} · ${p.n.cn}`);return true}
function peMaybe(s,p,force){if(!s.alive||s.jail>0||s.queue.length>1)return false;const ids=peCands(s,p);if(!ids.length)return false;return peRun(s,p,wpick(ids,id=>PE[id].w||1))}
/* about one year in three, someone you know comes to you with something */
(()=>{const y0=yearly;yearly=function(s){y0(s);try{if(!s.alive||s.jail>0||s.age<12||s.queue.length>1)return;
  /* a parent's or master's big birthday does not wait for a random year */
  const bd=near(s).find(p=>['father','mother','grandparent','master'].includes(p.rel)&&p.age>=60&&p.age%10===0&&p.bdDone!==p.age);if(bd&&chance(.75)){bd.bdDone=bd.age;peRun(s,bd,'birthday');return}
  if(!chance(.27))return;
  const ps=near(s).filter(p=>peCands(s,p).length);if(!ps.length)return;const p=wpick(ps,p=>.5+p.bond/40);peMaybe(s,p)}catch(e){console.error(e)}}})();
const jobFor=p=>({trade:'clerk',martial:'escort',official:'constable',doctor:'doctor',scholar:'tutor',entertain:'actor'}[PE_OCC(p)]||(p.occ===25?'smith':p.occ===26?'waiter':null));

/* --- they ask --- */
PEV('move',{w:1,who:(s,p)=>p.age>=18&&s.age>=14,
 text:c=>T(`${c.npc.en} is moving house and has more furniture than friends. Could you give a hand for a day?`,`${c.npc.zh}要搬家，家具比朋友还多。能来搭把手吗？`),
 opts:[{l:T('Help (1 energy)','去帮忙（一点行动力）'),out:[{w:3,t:c=>T(`A long day of carrying things down stairs. ${c.npc.en} feeds you twice.`,`扛了一整天的家什上下楼。${c.npc.zh}管了你两顿饭。`),c:'good',fx:{bond:8,f:s=>peSpend(s,1)}},
   {w:1,t:c=>T(`Clearing out an old chest, ${c.npc.en} finds something and presses it on you: “Take it, I will never use it.”`,`清一只旧箱子时，${c.npc.zh}翻出一样东西硬塞给你：“拿着，我用不上。”`),c:'good',fx:(s,c)=>({bond:8,item:pick(['jadecharm','beads','salve','ironsword']),f:s=>peSpend(s,1)})}]},
  {l:T('Say you are busy','推说没空'),out:[{t:T('They manage without you. They mention it later.','没你他们也搬完了。后来还提起过。'),c:'muted',fx:{bond:-3}}]}]});
PEV('borrow',{w:1,who:(s,p)=>(!peFam(p)||p.rel==='sibling')&&!!(eqItem(s,'weapon')||eqItem(s,'mount')),ctx:(s,p)=>{const w=eqItem(s,'weapon'),m=eqItem(s,'mount');const it=m&&chance(.5)?m:w||m;return{it:it?it.id:null}},
 text:c=>{const d=itemDef(c.it);return T(`${c.npc.en} has a long journey ahead and asks to borrow your ${d.n.en}. “A month. Two at most.”`,`${c.npc.zh}要出远门，想借你的${d.n.zh}用用。“一个月，最多两个月。”`)},
 opts:[{l:T('Lend it','借给对方'),out:[{w:(s,c)=>['greedy','scheming'].includes(tkTrait(c.p))?1:4,t:c=>T(`It comes back on time, cleaned and oiled, with a jar of wine tied to it.`,`东西按时还了回来，擦得锃亮，还拴着一坛酒。`),c:'good',fx:{bond:12,happy:2}},
   {w:(s,c)=>['greedy','scheming'].includes(tkTrait(c.p))?3:1,t:c=>T(`It does not come back. ${c.npc.en} says it was stolen on the road, and pays you half.`,`东西没回来。${c.npc.zh}说路上被偷了，赔了你一半的钱。`),c:'bad',fx:(s,c)=>{const i=s.items.findIndex(x=>x.id===c.it);const d=itemDef(c.it);if(i>=0)s.items.splice(i,1);return{money:Math.round((d.price||40)/2),bond:-8}}}]},
  {l:T('Refuse','不借'),out:[{t:T('They understand. Mostly.','对方表示理解。大体上。'),c:'muted',fx:{bond:-4}}]}]});
PEV('escort',{w:1,who:(s,p)=>p.age>=16&&s.age>=16&&power(s)>=15,ctx:(s,p)=>{const L=(CITIES[s.region]||[]).filter(x=>x[1]!==s.city);const t=L.length?pick(L):['the next town','邻县'];return{to:T(t[0],t[1]),lv:stFoe(s,.85,8)}},
 text:c=>T(`${c.npc.en} has to take something valuable to ${c.to.en} and does not trust the road. Would you go along?`,`${c.npc.zh}要送一样贵重东西去${c.to.zh}，信不过路上。你能陪着走一趟吗？`),
 opts:[{l:T('Go along (2 energy)','陪着去（两点行动力）'),out:[{w:2,t:c=>T(`An uneventful trip and long talks on the road. ${c.npc.en} insists on paying for every meal.`,`一路平安，路上聊了很多。${c.npc.zh}每顿饭都抢着付账。`),c:'good',fx:{bond:10,f:s=>peSpend(s,2)}},{w:1,t:T('Bandits at a ford. You see them off.','渡口遇上劫道的，被你打发了。'),c:'good',fx:{bond:15,fame:1,f:s=>peSpend(s,2)}}]},
  {l:T('You cannot this time','这回去不了'),out:[{w:3,t:T('They go alone and arrive safe.','对方一个人去了，平安到了。'),c:'muted',fx:{bond:-2}},{w:1,t:c=>T(`They are robbed on the way. ${c.npc.en} does not blame you, out loud.`,`对方路上被劫了。${c.npc.zh}嘴上没怪你。`),c:'bad',fx:{bond:-6}}]}]});
PEV('court',{w:1,who:(s,p)=>p.age>=17&&p.age<=35&&!p.wed&&['friend','sworn','sibling','fellow','acq'].includes(p.rel),
 text:c=>T(`${c.npc.en} has fallen for someone, badly, and wants your help: a letter, a word with the family, anything.`,`${c.npc.zh}看上了一个人，魂都丢了，想请你帮忙：写封信，去对方家里说说话，什么都行。`),
 opts:[{l:T('Write the letter for them','替对方写信'),out:[{w:s=>s.smarts/30,t:T('Your letter works. There will be a wedding.','你的信管用了。要办喜事了。'),c:'good',fx:{bond:12,f:(s,c)=>{if(c.p)c.p.wed=s.age}}},{w:1,t:T('The reply is polite and final.','回信很客气，也很决绝。'),c:'muted',fx:{bond:3}}]},
  {l:T('Go and speak to the family','登门去说'),out:[{w:s=>1+s.fame/30,t:T('Your name opens the door. The match is agreed.','凭你的名头进了门。亲事成了。'),c:'good',fx:{bond:14,f:(s,c)=>{if(c.p)c.p.wed=s.age}}},{w:1,t:T('The father does not like the look of you, or of them.','对方的爹既看不上你，也看不上他。'),c:'muted',fx:{bond:2}}]},
  {l:T('Tell them to do their own courting','叫对方自己去'),out:[{t:T('They do, badly, and it works anyway.','对方自己去了，笨手笨脚的，居然也成了。'),c:'muted',fx:{bond:-2,f:(s,c)=>{if(c.p&&chance(.4))c.p.wed=s.age}}}]}]});
PEV('wedding',{w:3,gap:2,who:(s,p)=>!p.wedDone&&!peFam(p)&&(p.wed!=null||(p.age>=19&&p.age<=34&&p.rel!=='lover'&&p.rel!=='ex')),
 text:c=>T(`An invitation in red: ${c.npc.en} is getting married, and you are on the list of guests who must not miss it.`,`一张大红请帖：${c.npc.zh}要成亲了，你在“务必到场”的名单上。`),
 opts:[{l:T('Go, with a generous gift (40 taels)','去，随一份厚礼（四十两）'),cost:40,out:[{t:T('You drink too much and make a speech. People remember it fondly.','你喝多了，还讲了一番话。大家都记得，记得的都是好的。'),c:'good',fx:{bond:15,happy:5,fame:1,f:(s,c)=>{if(c.p)c.p.wedDone=1}}}]},
  {l:T('Go, with what you can afford','去，量力随礼'),out:[{w:2,t:T('A loud, happy evening. You meet half the town.','热热闹闹的一晚。你认识了半个镇的人。'),c:'good',fx:{bond:8,happy:4,f:(s,c)=>{if(c.p)c.p.wedDone=1;c.npc=npc(s,{age:s.age+rint(-5,5)});applyFx(s,{meet:'acq',bond:50},c)}}},{w:1,t:T('You end up at the children’s table. It is the best table.','你被安排在了小孩那桌。那是最好的一桌。'),c:'good',fx:{bond:8,happy:5,f:(s,c)=>{if(c.p)c.p.wedDone=1}}}]},
  {l:T('Send apologies','托人带句歉意'),out:[{t:T('They notice the empty seat.','对方看见了那个空座。'),c:'muted',fx:{bond:-8,f:(s,c)=>{if(c.p)c.p.wedDone=1}}}]}]});
PEV('birthday',{w:4,gap:3,who:(s,p)=>['father','mother','grandparent','master'].includes(p.rel)&&p.age>=60&&p.age%10===0,
 text:c=>T(`${c.npc.en} turns ${c.npc.age}. The family wants a proper celebration, and everyone is looking at you.`,`${c.npc.zh}${cnNum(c.npc.age)}大寿。家里想好好办一场，大家都看着你。`),
 opts:[{l:T('Throw a feast (60 taels)','大摆寿宴（六十两）'),cost:60,out:[{t:c=>T(`Longevity noodles, a peach-shaped bun the size of a head, and ${c.npc.en} pretending not to cry.`,`长寿面，比脑袋还大的寿桃，还有${c.npc.zh}假装没哭的样子。`),c:'gold',fx:{bond:15,happy:8,fame:1}}]},
  {l:T('A small dinner, just family','一家人吃顿便饭'),out:[{t:T('Quiet, and exactly right.','清清静静的，刚刚好。'),c:'good',fx:{bond:8,happy:5}}]},
  {l:T('You cannot make it home','回不去'),out:[{t:T('You send a letter. It is read aloud at the table, twice.','你寄了封信。席上被念了两遍。'),c:'muted',fx:{bond:-5}}]}]});
PEV('venture',{w:1.2,who:(s,p)=>PE_OCC(p)==='trade'&&s.age>=18,
 text:c=>T(`${c.npc.en} has a scheme: buy tea in the hills before the merchants get there. ${c.npc.He} needs one more partner.`,`${c.npc.zh}有个主意：赶在茶商之前进山收茶。还差一个合伙的。`),
 opts:[{l:T('Put in 80 taels','入八十两'),cost:80,out:[{w:s=>2+s.t.luck*.2,t:T('The tea sells at twice the price in the city.','茶到城里卖了双倍的价。'),c:'gold',fx:{money:[150,200],bond:10}},{w:1.5,t:T('Rain spoils half the tea. You get back what you put in, just.','雨水泡坏了一半的茶。本钱勉强回来了。'),c:'muted',fx:{money:[70,85],bond:4}},{w:1,t:c=>T(`It fails. ${c.npc.en} is so ashamed ${c.npc.he} avoids you for a month.`,`赔了。${c.npc.zh}羞得躲了你一个月。`),c:'bad',fx:{money:[0,20]}}]},
  {l:T('Wish them luck','祝对方好运'),out:[{t:T('No hard feelings.','对方没往心里去。'),c:'muted'}]}]});
PEV('feud',{w:1.4,gap:5,who:(s,p)=>near(s).some(o=>o.id!==p.id&&o.age>=14&&!hostile(o)),ctx:(s,p)=>{const os=near(s).filter(o=>o.id!==p.id&&o.age>=14&&!hostile(o));const o=pick(os.length?os:[p]);return{oid:o.id,o:T(o.n.py,o.n.cn),orl:relLabel(s,o),why:pick([T('a boundary wall','一堵界墙'),T('a debt','一笔账'),T('something said at a funeral','丧礼上的一句话'),T('a stolen chicken','一只丢了的鸡')])}},
 text:c=>T(`${c.npc.en} and ${c.o.en} (your ${c.orl.en.toLowerCase()}) have fallen out over ${c.why.en}. Both have come to tell you their side, separately.`,`${c.npc.zh}和你的${c.orl.zh}${c.o.zh}为了${c.why.zh}闹翻了。两个人分头来找你，各说各的理。`),
 opts:[{l:c=>T(`Side with ${c.npc.en}`,`站在${c.npc.zh}这边`),out:[{t:c=>T(`${c.npc.en} is grateful. ${c.o.en} stops speaking to you.`,`${c.npc.zh}很感激。${c.o.zh}不理你了。`),c:'muted',fx:{bond:10,f:(s,c)=>{const o=person(s,c.oid);if(o)addBond(o,-15)}}}]},
  {l:c=>T(`Side with ${c.o.en}`,`站在${c.o.zh}那边`),out:[{t:c=>T(`${c.o.en} is grateful. ${c.npc.en} feels betrayed.`,`${c.o.zh}很感激。${c.npc.zh}觉得被你出卖了。`),c:'muted',fx:{bond:-15,f:(s,c)=>{const o=person(s,c.oid);if(o)addBond(o,10)}}}]},
  {l:T('Get them in one room and make peace','把两人叫到一起说和'),out:[{w:s=>1+s.smarts/40+s.t.heart*.15,t:T('It takes all evening and a lot of wine. They shake hands.','费了一整晚和好几坛酒。两人握手言和了。'),c:'good',fx:{bond:8,fame:1,f:(s,c)=>{const o=person(s,c.oid);if(o)addBond(o,8)}}},{w:1,t:T('It gets worse in front of you. Now they are both annoyed with you.','当着你的面吵得更凶了。这下两人都怪上了你。'),c:'bad',fx:{bond:-6,f:(s,c)=>{const o=person(s,c.oid);if(o)addBond(o,-6)}}}]},
  {l:T('Stay out of it','两边都不掺和'),out:[{t:T('Both think you should have backed them.','两人都觉得你该帮自己。'),c:'muted',fx:{bond:-3,f:(s,c)=>{const o=person(s,c.oid);if(o)addBond(o,-3)}}}]}]});
PEV('vouch',{w:1,who:(s,p)=>p.age>=20&&s.age>=20&&!peFam(p),
 text:c=>T(`${c.npc.en} needs a guarantor for a loan of a hundred taels, and the moneylender wants your name on the paper.`,`${c.npc.zh}借一百两银子，要个保人。放债的点名要你在契上画押。`),
 opts:[{l:T('Sign','画押'),out:[{w:(s,c)=>['greedy','scheming','a heavy drinker'].includes(tkTrait(c.p))?1:3,t:T('They pay it back on time. You forget you ever signed.','对方按时还清了。你都忘了自己画过押。'),c:'good',fx:{bond:10}},{w:(s,c)=>['greedy','scheming','a heavy drinker'].includes(tkTrait(c.p))?2:1,t:c=>T(`${c.npc.en} cannot pay. The moneylender comes to you.`,`${c.npc.zh}还不上。放债的找上了你。`),c:'bad',fx:{money:-100,bond:-10}}]},
  {l:T('Decline, politely','婉言推辞'),out:[{t:T('They find someone else. Things are cooler between you for a while.','对方另找了人。你们之间冷了一阵子。'),c:'muted',fx:{bond:-6}}]}]});
PEV('witness',{w:.8,who:(s,p)=>p.age>=20&&s.age>=18,ctx:()=>({right:chance(.5)}),
 text:c=>T(`${c.npc.en} is in a dispute before the magistrate and asks you to say you saw what happened. You did not.`,`${c.npc.zh}在县衙里打官司，求你出堂作证，说你亲眼看见了。可你并没看见。`),
 opts:[{l:T('Testify for them anyway','还是替对方作证'),out:[{w:3,t:T('You say your piece. They win.','你说完了，对方赢了官司。'),c:'muted',fx:{bond:14,align:-3}},{w:1,t:T('The magistrate sees through it. You are fined and lectured.','县官一眼看穿。你被罚了钱，还挨了一顿训。'),c:'bad',fx:{bond:6,align:-3,money:-30,wanted:1}}]},
  {l:T('Tell the court only what you know','只说你知道的'),out:[{t:(c)=>c.right?T('The truth turns out to be on their side anyway.','结果真相本来就站在对方那边。'):T('They lose, and you were part of why.','对方输了，你也算原因之一。'),c:'muted',fx:(s,c)=>({bond:c.right?6:-12,align:2})}]},
  {l:T('Refuse to get involved','不掺和'),out:[{t:T('They do not ask you for anything again for a long while.','此后很久，对方再没求过你。'),c:'muted',fx:{bond:-8}}]}]});
/* --- they invite --- */
PEV('hunt',{w:1,who:(s,p)=>(p.occ===15||PE_OCC(p)==='martial'||PE_OCC(p)==='rich')&&s.age>=14,ctx:s=>({lv:stFoe(s,.75,8)}),
 text:c=>T(`${c.npc.en} is going hunting in the hills and wants company.`,`${c.npc.zh}要进山打猎，想拉你作伴。`),
 opts:[{l:T('Go (1 energy)','去（一点行动力）'),fight:(s,c)=>({foe:{name:T('a wild boar','野猪'),lv:c.lv,fixed:1,beast:1},stakes:'light',title:T('The hunt','打猎'),cause:T('a hunting accident','打猎出了意外')}),
   win:[{t:T('You bring down a boar. The village eats well, and talks about it.','你放倒了一头野猪。全村吃了顿好的，还念叨了好久。'),c:'good',fx:{bond:10,happy:5,money:[10,30],f:s=>peSpend(s,1)}}],lose:[{t:T('The boar wins the argument. You limp home laughing.','野猪占了上风。你一瘸一拐地笑着回了家。'),c:'muted',fx:{bond:6,f:s=>peSpend(s,1)}}]},
  {l:T('Not this time','这回不去'),out:[{t:T('They bring you back a hare anyway.','对方还是给你捎回了一只野兔。'),c:'muted',fx:{bond:1}}]}]});
PEV('drink',{w:1.3,who:(s,p)=>p.age>=18&&s.age>=16&&!['father','mother','grandparent'].includes(p.rel),
 text:c=>T(`${c.npc.en} turns up at your door with two jars of wine and no plan for the evening.`,`${c.npc.zh}拎着两坛酒找上门来，今晚没打算走。`),
 opts:[{l:T('Open the jars','开坛'),out:[{w:3,t:T('You talk until the birds start. The hangover is worth it.','一直聊到鸟叫。宿醉也值了。'),c:'good',fx:{bond:9,happy:5}},{w:1,t:T('Somewhere after the second jar, you both decide to go and fight the river. The river wins.','第二坛下肚，你们决定去跟江水较劲。江水赢了。'),c:'muted',fx:{bond:10,happy:4,hurt:[2,6],cause:T('a very bad idea','一个馊主意')}},{w:(s,c)=>tkTrait(c.p)==='a heavy drinker'?2:.3,t:c=>T(`${c.npc.en} starts a fight with the night watch. You spend the night in the cells together.`,`${c.npc.zh}跟巡夜的打了起来。你们一起在牢里过了一夜。`),c:'bad',fx:{bond:6,money:-15}}]},
  {l:T('Send them home','打发对方回去'),out:[{t:T('They leave one jar on your step.','对方在你门口留下了一坛。'),c:'muted',fx:{bond:-2}}]}]});
/* --- they give --- */
PEV('gift',{w:2,gap:3,who:(s,p)=>p.bond>=55,ctx:(s,p)=>{const o=PE_OCC(p);const opts=[['food',T('a basket of the season’s best','一篮时令鲜货')]];
  if(p.occ===25)opts.push(['item:ironsword',T('a sword from their own forge','亲手打的一柄剑')]);if(o==='doctor')opts.push(['item:jadedew',T('a bottle of good medicine','一瓶上好的药')]);if(o==='religious')opts.push(['item:beads',T('a string of prayer beads','一串念珠')]);
  if(p.occ===15)opts.push(['item:leather',T('a leather jerkin','一件皮甲')]);if(o==='trade'||o==='rich')opts.push(['money',T('a red envelope','一个红包')]);if(['father','mother','grandparent'].includes(p.rel))opts.push(['item:jadecharm',T('a jade pendant they have kept for years','一块珍藏多年的玉佩')]);
  const g=pick(opts.length>1?opts.slice(1).concat([opts[0]]):opts);return{g:g[0],gn:g[1]}},
 text:c=>T(`${c.npc.en} sends you ${c.gn.en}, with a note that says only: “Saw this and thought of you.”`,`${c.npc.zh}给你送来${c.gn.zh}，附了张字条，只写着：“见了就想到你。”`),
 opts:[{l:T('Accept, and send something back (20 taels)','收下，回一份礼（二十两）'),cost:20,out:[{t:T('A small exchange that means more than either gift.','礼尚往来，比礼物本身更要紧。'),c:'good',fx:(s,c)=>({bond:10,happy:3,item:c.g.startsWith('item:')?c.g.slice(5):null,money:c.g==='money'?[30,80]:0})}]},
  {l:T('Accept with thanks','道谢收下'),out:[{t:T('You write a long thank-you letter.','你写了封长长的谢信。'),c:'good',fx:(s,c)=>({bond:5,happy:3,item:c.g.startsWith('item:')?c.g.slice(5):null,money:c.g==='money'?[30,80]:0})}]}]});
PEV('job',{w:2,gap:5,who:(s,p)=>!s.job&&s.age>=16&&!!jobFor(p)&&JOBS[jobFor(p)]&&JOBS[jobFor(p)].req(s),
 text:c=>{const J=JOBS[jobFor(c.p)];return T(`${c.npc.en} has heard of an opening: ${J.n[0].en}. ${c.npc.He} can put in a word, if you want it.`,`${c.npc.zh}听说有个缺：${J.n[0].zh}。你要是想干，${c.npc.ta}可以替你说句话。`)},
 opts:[{l:T('Take it','干'),out:[{t:c=>T(`Thanks to ${c.npc.en}, you start next month.`,`托${c.npc.zh}的福，你下个月就上工了。`),c:'good',fx:{bond:6,f:(s,c)=>{const k=jobFor(c.p);if(k&&JOBS[k]){s.job=k;s.jobLv=0;s.jobYears=0;s.perf=55}}}}]},
  {l:T('Thank them, but no','谢过，不去'),out:[{t:T('They shrug. The offer stands.','对方耸耸肩，说话一直算数。'),c:'muted'}]}]});
PEV('intro',{w:1.6,gap:5,who:(s,p)=>s.age>=17&&s.age<=40&&!spouseOf(s)&&!living(s,'lover').length,ctx:(s,p)=>{const g=s.gender==='m'?'f':'m';return{cand:npc(s,{sex:g,age:clamp(s.age+rint(-4,4),16,60)})}},
 text:c=>T(`${c.npc.en} has someone ${c.npc.he} thinks you should meet: ${c.cand.en}, ${c.cand.desc.en}, “and, I promise, not boring.”`,`${c.npc.zh}想给你介绍一个人：${c.cand.zh}，${c.cand.desc.zh}。“我保证，不闷。”`),
 opts:[{l:T('Meet them','见见'),out:[{w:s=>1+s.looks/50,t:c=>T(`You meet over tea. It runs into dinner. ${c.npc.en} looks very pleased with ${c.npc.him}self.`,`本来只是喝杯茶，结果聊到了晚饭。${c.npc.zh}一脸得意。`),c:'good',fx:{bond:6,happy:4,f:(s,c)=>{const n=c.npc;c.npc=c.cand;applyFx(s,{meet:'acq',bond:65},c);c.npc=n}}},
   {w:1,t:T('You have nothing to say to each other. You both blame the matchmaker, fondly.','你们俩相对无言。事后都怪介绍人，倒也不恼。'),c:'muted',fx:{bond:2}}]},
  {l:T('Not interested','没兴趣'),out:[{t:T('They will try again. They always do.','对方还会再介绍的。一向如此。'),c:'muted'}]}]});
PEV('warn',{w:3,gap:5,who:(s,p)=>near(s).some(o=>o.rel==='enemy'),ctx:(s,p)=>{const e=pick(near(s).filter(o=>o.rel==='enemy'));return{eid:e.id,e:T(e.n.py,e.n.cn),lv:e.lv}},
 text:c=>T(`${c.npc.en} comes at night, out of breath: ${c.e.en} has been asking around about where you live, and is not alone.`,`${c.npc.zh}连夜赶来，气喘吁吁：${c.e.zh}在四处打听你的住处，身边还带着人。`),
 opts:[{l:T('Thank them and prepare','谢过，早做准备'),out:[{t:T('When they come, you are ready, and they think better of it.','对方来的时候，你早有防备。他们掂量了一下，走了。'),c:'good',fx:{bond:10}}]},
  {l:T('Go to them first','先下手为强'),fight:(s,c)=>({foe:{name:c.e,lv:c.lv,fixed:1},stakes:'injury',title:T('Forewarned','先发制人'),cause:T('an old enemy','宿敌')}),
   win:[{t:c=>T(`${c.e.en} will not be asking around about you again.`,`${c.e.zh}再也不会打听你的住处了。`),c:'good',fx:{bond:10,fame:2}}],lose:[{t:T('It goes badly, but you chose the ground, and you walk away.','打得很狼狈，好在地方是你挑的，你还走得掉。'),c:'bad',fx:{bond:6}}]}]});
PEV('doctor',{w:4,gap:3,who:(s,p)=>PE_OCC(p)==='doctor'&&(!!s.ill||s.health<s.maxHealth*.5),
 text:c=>T(`${c.npc.en} has heard you are unwell and turns up with ${c.npc.his} medicine box, unasked.`,`${c.npc.zh}听说你病了，没等你开口，就提着药箱上门了。`),
 opts:[{l:T('Let them treat you','让对方诊治'),out:[{w:3,t:T('A week of their medicine and their nagging. You are better.','吃了一个礼拜的药，挨了一个礼拜的唠叨。你好了。'),c:'good',fx:{cure:1,heal:30,bond:8}},{w:1,t:T('They do what they can. It helps, a little.','对方尽了力。多少有点用。'),c:'muted',fx:{heal:12,bond:6}}]}]});
PEV('visit',{w:1.2,who:(s,p)=>!['child'].includes(p.rel)&&p.age>=16,
 text:c=>T(`${c.npc.en} arrives unannounced “for a day or two”, with luggage for a month.`,`${c.npc.zh}不打招呼就来了，说是“住一两天”，带的行李够住一个月。`),
 opts:[{l:T('Make them welcome','好好招待'),out:[{w:(s,c)=>['cheerful','gentle','devoted','bold'].includes(tkTrait(c.p))?3:1,t:T('It is the best month you have had in years.','这是你好几年来最开心的一个月。'),c:'good',fx:{bond:12,happy:6,money:-15}},{w:(s,c)=>['arrogant','greedy','eccentric','cold'].includes(tkTrait(c.p))?3:1,t:c=>T(`By the third week ${c.npc.en} has rearranged your kitchen and criticised your cooking. You love ${c.npc.him} anyway. Mostly.`,`到第三个礼拜，${c.npc.zh}已经把你的厨房重新摆了一遍，还嫌你做饭难吃。你还是喜欢${c.npc.ta}的。大体上。`),c:'muted',fx:{bond:6,happy:-1,money:-20}}]},
  {l:T('Find them an inn','给对方找家客栈'),out:[{t:T('They take the hint, with dignity.','对方明白了，走得很体面。'),c:'muted',fx:{bond:-5}}]}]});
PEV('owed',{w:5,gap:2,who:(s,p)=>(p.owed||0)>0&&s.age-(p.owedAt||0)>=2,
 text:c=>T(`${c.npc.en} brings up, awkwardly, the ${c.p.owed} taels you borrowed.`,`${c.npc.zh}有些难为情地提起你借的那${c.p.owed}两银子。`),
 opts:[{l:T('Pay it back','还上'),if:(s,c)=>s.money>=c.p.owed,out:[{t:T('Settled, and nothing lost between you.','账清了，情分一点没少。'),c:'good',fx:{bond:6,f:(s,c)=>{pay(s,-c.p.owed);c.p.owed=0}}}]},
  {l:T('Ask for more time','请对方再宽限些'),out:[{w:(s,c)=>c.p.bond/30,t:T('“Next year, then.”','“那就明年吧。”'),c:'muted',fx:{bond:-3,f:(s,c)=>{c.p.owedAt=s.age}}},{w:1,t:T('They are hurt that you seem to have forgotten.','对方觉得你像是忘了这回事，心里很不是滋味。'),c:'bad',fx:{bond:-10,f:(s,c)=>{c.p.owedAt=s.age}}}]}]});

/* ---------- 3. you ask them (请托) ---------- */
I({id:'pk_ask',only:1,noRipple:1,noThread:1,tags:['rel'],
 text:c=>T(`You go to see ${c.npc.en} with something to ask.`,`你登门去找${c.npc.zh}，有事相求。`),
 opts:[
  {l:T('Borrow some money','借点银子'),if:(s,c)=>!(c.p.owed>0),out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p,rich=['trade','rich'].includes(PE_OCC(p))||p.occ===23,tr=tkTrait(p);const amt=rich?rint(8,20)*10:rint(2,6)*10;
     const ch=clamp(.2+p.bond/100+(['devoted','gentle','bold','cheerful'].includes(tr)?.15:0)-(['greedy','cold'].includes(tr)?.25:0)-(peFam(p)?-.1:0),.05,.95);
     if(chance(ch)){pay(s,amt);p.owed=amt;p.owedAt=s.age;sayT(s,voice(p,pick([T('Here. Pay me back when you can, not before.','拿着。手头宽了再还，别勉强。'),T('Take it. I know where you live.','拿去吧。反正我知道你住哪儿。')])),'good');say(s,`${p.n.py} lends you ${amt} taels.`,`${p.n.cn}借给你${amt}两。`,'good')}
     else{addBond(p,-3);sayT(s,voice(p,tr==='greedy'?T('Money and friendship do not mix. I would like to keep one of them.','钱和交情掺不得。我想留住其中一样。'):T('I would if I could. I cannot, this year.','能借我一定借。今年实在不行。')),'muted')}}}}]},
  {l:c=>T(`Ask about work (${JOBS[jobFor(c.p)].n[0].en})`,`托对方找份差事（${JOBS[jobFor(c.p)].n[0].zh}）`),if:(s,c)=>!s.job&&!!jobFor(c.p)&&!!JOBS[jobFor(c.p)]&&JOBS[jobFor(c.p)].req(s),out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p,k=jobFor(p);
     if(chance(.35+p.bond/150)){s.job=k;s.jobLv=0;s.jobYears=0;s.perf=55;sayT(s,voice(p,T('Start on the first of the month. Do not make me look bad.','月初上工。别给我丢人。')),'good');say(s,`You are hired as ${JOBS[k].n[0].en}.`,`你当上了${JOBS[k].n[0].zh}。`,'good')}
     else sayT(s,voice(p,T('They have someone already. I will keep my ears open.','人家已经有人了。我替你留意着。')),'muted')}}}]},
  {l:T('Ask them to find you a match','托对方给你说门亲'),if:(s,c)=>!spouseOf(s)&&s.age>=17&&s.age<=50&&!living(s,'lover').length,out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;
     if(chance(.4+p.bond/200)){const g=s.gender==='m'?'f':'m',cand=npc(s,{sex:g,age:clamp(s.age+rint(-4,4),16,60)});sayT(s,voice(p,T(`There is someone: ${cand.n.py}, ${cand.desc.en}. Leave it to me.`,`有一个：${cand.n.cn}，${cand.desc.zh}。包在我身上。`)),'good');const n=c.npc;c.npc=cand;applyFx(s,{meet:'acq',bond:60},c);c.npc=n}
     else sayT(s,voice(p,T('For you? Give me time. A lot of time.','给你说亲？给我点时间。很多时间。')),'muted')}}}]},
  {l:T('Ask them to treat you','请对方给你治病'),if:(s,c)=>PE_OCC(c.p)==='doctor'&&(!!s.ill||s.health<s.maxHealth*.8||condKeys(s).length>0),out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;sayT(s,voice(p,T('Sit. Tongue out. Hm. Hm. Yes.','坐下。舌头伸出来。嗯。嗯。好。')));applyFx(s,{heal:25,cure:chance(.6)?1:null},c);if(typeof easeCond==='function')condKeys(s).slice(0,1).forEach(k=>easeCond(s,k,1));say(s,'It costs you nothing but a lecture.','分文未取，只换来一顿数落。','good');addBond(p,2)}}}]},
  {l:T('Ask them to put in a word at the yamen','托对方去衙门说句话'),if:(s,c)=>s.wanted>0&&PE_OCC(c.p)==='official',out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;if(chance(.3+p.bond/150)){s.wanted=Math.max(0,s.wanted-1);sayT(s,voice(p,T('Your file has wandered off. These things happen.','你的卷宗不知怎么就找不着了。常有的事。')),'good');addBond(p,-5)}
     else sayT(s,voice(p,T('Not even I can make this one go away. Lie low.','这回我也压不下来。先躲躲吧。')),'muted')}}}]},
  {l:T('Ask them to look at your swordwork','请对方指点武功'),if:(s,c)=>c.p.lv>power(s)+5&&!['master'].includes(c.p.rel),out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;if(chance(.45+p.bond/200)){const g=trainGain(s,.6)+.5;s.skill+=g;sayT(s,voice(p,T('Again. Slower. Again.','再来。慢点。再来。')),'good');say(s,`An afternoon of corrections (technique +${g.toFixed(1)}).`,`被纠正了一下午（外功+${g.toFixed(1)}）。`,'good')}
     else sayT(s,voice(p,T('I do not teach. Watch me sometime, if you like.','我不教人。你想看，哪天来看我练就是。')),'muted')}}}]},
  {l:T('Ask for a bed and a meal for a while','求对方收留一阵子'),if:s=>s.money<25&&s.age>=14,out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;if(chance(.4+p.bond/120)){happy(s,6);heal(s,8);sayT(s,voice(p,T('The back room is yours. Do not mind the cat.','后屋归你了。别理那只猫。')),'good')}
     else{addBond(p,-2);sayT(s,voice(p,T('I have barely enough for myself.','我自己都快揭不开锅了。')),'muted')}}}}]},
  {l:T('Just ask what they think you should do','只是问问对方，你该怎么办'),out:[{t:T('',''),fx:{f:(s,c)=>{const p=c.p;sayT(s,voice(p,pick([T('Stop asking other people what to do. Including me.','别老问别人该怎么办。包括我。'),T('Whatever you choose, choose it all the way.','不管选什么，选了就别回头。'),T('Go home and sleep. Things look smaller in the morning.','回去睡一觉。天亮了，事情就显得小了。')])));happy(s,2);addBond(p,2)}}}]}]});
PACTS.push({id:'ask',n:T('Ask a favour','请托'),ap:0,if:(s,p)=>s.age>=12&&p.age>=14&&p.alive&&!hostile(p),ok:(s,p)=>p.askedAt===s.age?T('Already asked this year','今年已经求过了'):true,
 run(s,p){p.askedAt=s.age;const c=scene();c.pid=p.id;c.p=p;c.npc=peNpc(s,p);runIncident(s,INC_BY.pk_ask,c)}});
PACT_BY.ask=PACTS[PACTS.length-1];

/* ---------- talking about someone you both know ----------
   What they say depends on who that person is to you, what that person is like, how they get on with you, and who is
   doing the talking. A line used with one person is not reused with another for a while. */
const GOS_TRAIT={bold:[T('Loud, that one. But when it matters, first through the door.','嗓门大，可到了要紧时候，第一个冲上去的就是他。')],
 scheming:[T('Watch what they do, not what they say. That is all I will say.','看那人做什么，别听那人说什么。我就说这么多。'),T('Clever. Maybe too clever.','聪明。也许太聪明了点。')],
 gentle:[T('I have never once heard them raise their voice.','我就没听那人大声说过一句话。')],greedy:[T('Easy to borrow from? No. Easy to lend to? Very.','找那人借钱？难。借钱给那人？容易得很。'),T('Counts the change twice. Every time.','找零都要数两遍。回回如此。')],
 devoted:[T('Once they care about you, that is it. For life.','那人一旦认准了你，就是一辈子。')],'a heavy drinker':[T('Good company until the third jar. After that, a different person.','头两坛还是个好伴，第三坛下去，就换了个人。')],
 eccentric:[T('Odd. Wonderful, but odd. Did you know they talk to their chickens?','古怪。好人，可是古怪。你知道那人跟鸡说话吗？')],upright:[T('Straight as a ruler. Exhausting, sometimes.','直得跟尺子似的。有时候挺累人。')],
 timid:[T('Jumps at shadows, that one. Kind, though.','那人见了影子都要吓一跳。心倒是好的。')],arrogant:[T('Thinks rather well of themselves, does that one.','那人可是挺把自己当回事的。')],
 cheerful:[T('Never a dull hour with that one around.','有那人在，就没有冷场的时候。')],cold:[T('Cold as well water. Reliable as well water, too.','冷得跟井水似的。不过，也跟井水一样靠得住。')]};
function gosLines(s,p,o){const ozh=o.n.cn,oen=o.n.py,L=[],r=o.rel,famP=['father','mother','sibling','spouse','child','grandparent'].includes(p.rel);
  if(['father','mother'].includes(r)){const ma=r==='mother';
    if(['sibling'].includes(p.rel))L.push(T(`${ma?'Mother':'Father'} asks about you every time I visit. Every single time.`,`我每回回去，${ma?'娘':'爹'}都要问起你。回回都问。`),T(`${ma?'Mother':'Father'} is getting older. Have you noticed? I have.`,`${ma?'娘':'爹'}老了。你看出来没有？我看出来了。`));
    else if(p.rel==='spouse')L.push(T(`Your ${ma?'mother':'father'} and I had a long talk. About you, mostly.`,`我跟你${ma?'娘':'爹'}聊了好久。聊的多半是你。`));
    else L.push(T(`I saw your ${ma?'mother':'father'} at the market. Spent half an hour boasting about you.`,`我在集上碰见你${ma?'娘':'爹'}了，夸你夸了足足半个时辰。`),T(`Is your ${ma?'mother':'father'} still as strict as people say?`,`你${ma?'娘':'爹'}还像大家说的那么严吗？`))}
  else if(r==='sibling'){const elder=o.age>s.age,f=o.sex==='f';const zhw=f?(elder?'姐姐':'妹妹'):(elder?'哥哥':'弟弟'),enw=f?'sister':'brother';
    L.push(famP?T(`Your ${enw} is up to something again. I will let ${f?'her':'him'} tell you.`,`你${zhw}又在捣鼓什么了。让${f?'她':'他'}自己跟你说吧。`):T(`Your ${enw} ${oen}? You two are nothing alike. Or exactly alike.`,`你${zhw}${ozh}？你们俩一点也不像。又或者一模一样。`),T(`${oen} was asking about you. ${f?'She':'He'} worries, you know.`,`${ozh}前两天还问起你。${f?'她':'他'}是惦记你的。`))}
  else if(r==='spouse')L.push(T(`How does ${oen} put up with you? Tell me the secret.`,`${ozh}怎么受得了你的？教教我。`),T(`${oen} came by the other day. You married well. Better than you deserve.`,`${ozh}前几天来过。你娶得好（嫁得好），比你配得上的还好。`.replace('娶得好（嫁得好）',s.gender==='m'?'娶得好':'嫁得好')));
  else if(r==='child')L.push(T(`${oen} is the image of you. Heaven help everyone.`,`${ozh}跟你一个模子刻出来的。老天保佑大伙儿吧。`),T(`${oen} told me what ${o.sex==='f'?'she':'he'} wants to be. You should ask.`,`${ozh}跟我说了将来想干什么。你该去问问。`));
  else if(r==='master')L.push(T(`Your master ${oen}? People lower their voices when they say that name.`,`你师父${ozh}？大家提这个名字都压低了声音。`),T(`Does ${oen} ever smile? Has anyone seen it?`,`${ozh}笑过没有？有人见过吗？`));
  else if(r==='disciple')L.push(T(`That student of yours, ${oen}, practises at dawn outside my window. Every day.`,`你那个徒弟${ozh}，天天天不亮就在我窗外练功。`));
  else if(['rival','enemy'].includes(r))L.push(T(`${oen} has been saying things about you. I did not believe a word.`,`${ozh}在外头说你坏话。我一个字都没信。`),T(`I heard ${oen} lost a fight last month. I am not saying I was pleased.`,`听说${ozh}上个月输了一场。我可没说我高兴。`));
  else if(['lover'].includes(r))L.push(T(`So. ${oen}. When were you going to tell me?`,`所以，${ozh}。你打算什么时候告诉我？`));
  L.push(...(GOS_TRAIT[(TRAITS[o.trait]||TRAITS[0])[0]]||[]));
  if(o.bond<30)L.push(T(`Have you two fallen out? ${oen} goes quiet when your name comes up.`,`你们俩闹别扭了？一提起你，${ozh}就不吭声。`));
  return L}
gossip=function(s,p){const others=near(s).filter(o=>o.id!==p.id&&o.age>=12);if(!others.length)return[];
  const o=wpick(others,o=>1+(s.tkGos&&s.tkGos.includes(o.id)?0:2)),rl=relLabel(s,o);
  return[{w:1.4,gos:o.id,me:T(`Talk turns to ${o.n.py}, your ${rl.en.toLowerCase()}.`,`话题转到了你的${rl.zh}${o.n.cn}身上。`),q:tkLife(s,'g'+o.id+':',gosLines(s,p,o)),
   fit:{scheming:.6,cheerful:.3,upright:-.5},bad:T(`${p.n.py} does not like talking about people behind their backs, and says so.`,`${p.n.cn}不爱在背后议论人，直说了。`)}]};
/* pick a line nobody has said to you lately, whoever said it */
function tkLife(s,key,list){s.tkLife=s.tkLife||[];const fresh=list.filter(x=>!s.tkLife.includes(x.zh));const o=pick(fresh.length?fresh:list);s.tkLife.push(o.zh);if(s.tkLife.length>40)s.tkLife.shift();return o}
(()=>{const tp=tkPick;tkPick=function(s,p,key,list){s.tkLife=s.tkLife||[];const fresh=list.filter(x=>!s.tkLife.includes(x.zh));const o=tp(s,p,key,fresh.length?fresh:list);s.tkLife.push(o.zh);if(s.tkLife.length>40)s.tkLife.shift();return o}})();
/* the same kind of topic does not come up with everyone in one year */
(()=>{const td=talkDo;talkDo=function(s,p,topic){if(topic){if(s.tkYr!==s.age){s.tkYr=s.age;s.tkUsed=[]}s.tkUsed.push(topic.lb.zh);if(topic.gos){s.tkGos=(s.tkGos||[]).concat(topic.gos).slice(-6)}}return td.apply(this,arguments)}})();
(()=>{const tr0=talkRun;talkRun=function(s,p){if(s.age<13&&p.age<16||(p.rel==='child'&&p.age<10))return false;
  const used=s.tkYr===s.age?(s.tkUsed||[]):[];const all=talkTopics(s,p),last=p.tkLast,tp=[];const pool=all.slice();
  while(tp.length<3&&pool.length){const t=wpick(pool,t=>t.w*(last&&t.me.zh===last?.2:1)*(used.includes(t.lb.zh)?.2:1));pool.splice(pool.indexOf(t),1);if(!tp.some(x=>x.lb.zh===t.lb.zh))tp.push(t)}
  const c=scene();c.pid=p.id;c.p=p;c.npc=peNpc(s,p);c.tp=tp;c.all=all;runIncident(s,INC_BY.pk_chat,c);return true}})();
/* a friend's tip from a chat waits until you go roaming, and the scene says who sent you */
const tipPerson=s=>{const t=s.roadTip;if(!t||s.age-t.age>3)return null;const p=person(s,t.pid);return p&&p.alive?p:null};
(()=>{const W=ACT_BY.wander;if(!W)return;const r0=W.run;W.run=function(s){const p=tipPerson(s);delete s.roadTip;
  if(p){const i=pickIncident(s,'wander');if(i){say(s,`You remember what ${p.n.py} told you and go to find it.`,`你想起${p.n.cn}说过的那件事，循着找了过去。`,'muted');const n=s.queue.length;runIncident(s,i);
    const q=s.queue[n];if(q)q.tagline=T(`Heard from ${p.n.py}`,`听${p.n.cn}说起的`);return}}
  return r0.call(W,s)}})();
const TIP_H=new Map();
(()=>{const oq=openQuests;openQuests=function(s){const q=oq(s);const p=s.alive&&tipPerson(s);if(!p)return q;
  const k=p.id+':'+s.roadTip.age;let o=TIP_H.get(k);if(!o){o=T(`${p.n.py} told you about something on the road. Go roaming to find it.`,`${p.n.cn}说起路上的一件怪事，闯荡江湖时可以去看看。`);TIP_H.set(k,o);if(typeof QGO!=='undefined')QGO.set(o,{k:'tip',tags:['wander']})}
  q.push(o);return q}})();
