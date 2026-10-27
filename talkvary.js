/* 江湖一生 · 相处 costs no energy and comes in two kinds: sit and talk (you pick the topic) or spend the day together
   (the day picks the scene). Either one, once per person per season. Conversations open, are offered and close in many
   different words, so no two chats read the same. */
'use strict';
const SEASON_LBL=[T('spring','春'),T('summer','夏'),T('autumn','秋'),T('winter','冬')];
const hangDone=(s,p)=>p.hangT===tIdx(s);
const HANG_DONE=T('Already spent time together this season','这一季已经陪过了');
(()=>{const h=PACT_BY.hang;if(!h)return;h.ap=0;const ok0=h.ok;h.ok=(s,p)=>hangDone(s,p)?HANG_DONE:ok0?ok0(s,p):true;
  const c=PACT_BY.chat;if(!c)return;c.ap=0;c.ok=(s,p)=>hangDone(s,p)?HANG_DONE:true;const r0=c.run;c.run=function(s,p){p.hangT=tIdx(s);return r0.apply(this,arguments)};
  /* talking is chosen on purpose now, not drawn as one of the day's scenes */
  const t=HANG.find(x=>x.id==='talk');if(t)t.w=()=>0})();
PACT_MINOR.delete('chat');
/* ---------- how a conversation opens ---------- */
const TK_OPEN=[
 [s=>true,(n,se)=>T(`You sit down with ${n.en}. What do you talk about?`,`你和${n.zh}坐下来说话。聊点什么？`)],
 [s=>true,(n,se)=>T(`${n.en} pours two cups of tea and waits for you to begin.`,`${n.zh}斟了两碗茶，等你先开口。`)],
 [s=>true,(n,se)=>T(`You find ${n.en} at home with nothing much to do. Good. Time to talk.`,`你去找${n.zh}，正赶上${n.zh}闲着。正好，说说话。`)],
 [s=>true,(n,se)=>T(`You and ${n.en} walk the long way round, talking as you go.`,`你和${n.zh}绕远路慢慢走，边走边聊。`)],
 [s=>true,(n,se)=>T(`A bench outside the teahouse, a plate of melon seeds, ${n.en}. What shall it be?`,`茶馆外的长凳，一碟瓜子，还有${n.zh}。聊什么好？`)],
 [s=>true,(n,se)=>T(`${n.en} clears a space on the table for you. “So. Talk.”`,`${n.zh}在桌上给你腾出块地方：“说吧。”`)],
 [s=>true,(n,se)=>T(`You run into ${n.en} in the market and end up talking under an awning.`,`你在集上碰见了${n.zh}，两人站在棚子底下就聊开了。`)],
 [s=>(s.season|0)===0,(n,se)=>T(`Spring rain on the eaves. You and ${n.en} sit under them and watch it.`,`春雨顺着屋檐往下滴。你和${n.zh}坐在檐下看雨。`)],
 [s=>(s.season|0)===0,(n,se)=>T(`The peach trees are out. ${n.en} insists you sit under one.`,`桃花开了。${n.zh}非要拉你到树底下坐坐。`)],
 [s=>(s.season|0)===1,(n,se)=>T(`A hot evening. You and ${n.en} sit out in the yard with fans, waiting for a breeze.`,`闷热的晚上，你和${n.zh}摇着扇子坐在院里等风。`)],
 [s=>(s.season|0)===1,(n,se)=>T(`${n.en} cuts a watermelon in half and hands you a spoon.`,`${n.zh}把西瓜一切两半，递给你一把勺子。`)],
 [s=>(s.season|0)===2,(n,se)=>T(`Osmanthus in the air. You and ${n.en} sit on the steps with a pot of tea.`,`满院桂花香。你和${n.zh}坐在台阶上，守着一壶茶。`)],
 [s=>(s.season|0)===2,(n,se)=>T(`The moon is very round tonight. ${n.en} says it is a waste not to talk under it.`,`今晚的月亮很圆。${n.zh}说，不在底下说说话太可惜了。`)],
 [s=>(s.season|0)===3,(n,se)=>T(`Snow outside. You and ${n.en} pull stools up to the brazier.`,`外头下着雪。你和${n.zh}把凳子拖到炭盆边上。`)],
 [s=>(s.season|0)===3,(n,se)=>T(`${n.en} warms a pot of wine on the stove. Cold nights are for talking.`,`${n.zh}在炉子上温了壶酒。冷天的夜里，就该说说话。`)]];
/* ---------- the same topic, offered in different words ---------- */
const TK_LB_ALT={
 '问问对方近况':[T('Ask how things are going','问问最近过得怎样'),T('Ask what has been happening','打听打听最近的事')],
 '聊聊你们都认识的人':[T('Talk about a mutual acquaintance','说说你们共同的熟人'),T('Catch up on someone you both know','聊起一个你们都认识的人')],
 '说说你最近的身子':[T('Admit you have not been well','说起自己身子不大好'),T('Talk about your health','说说你的身体')],
 '聊聊你们的往事':[T('Talk about old times','说说从前的事'),T('Go back over the years together','翻翻这些年的旧账')],
 '回忆你们是怎么认识的':[T('Remember the day you met','说起初次见面那天'),T('Talk about how it all started','聊聊你们怎么认识的')],
 '聊聊终身大事':[T('Talk about marriage','说说成家的事'),T('Let the talk turn to marriage','让话题转到婚事上')],
 '聊聊你的武功':[T('Talk about your training','说说你练功的事'),T('Talk martial arts','谈谈武艺')],
 '聊聊你的营生':[T('Talk about work and money','说说营生和银子'),T('Talk about how you get by','聊聊怎么过日子')],
 '聊聊门派里的事':[T('Talk about your sect','说说门里的事'),T('Trade sect gossip','聊聊门派里的闲话')],
 '向对方讨教':[T('Ask for advice','请对方指点指点'),T('Ask what they would do','问问对方的看法')],
 '开个玩笑':[T('Tease them a little','逗逗对方'),T('Lighten the mood','说个笑话')],
 '夸对方几句':[T('Say something kind','说几句好话'),T('Tell them what you admire','说说你佩服对方哪一点')],
 '聊聊将来的打算':[T('Talk about plans','说说往后的打算'),T('Talk about what comes next','聊聊以后')],
 '聊聊家里人':[T('Talk about family','说说家里'),T('Ask after the family','问问家里人')],
 '向对方倾诉心事':[T('Tell them what is on your mind','把心里话说出来'),T('Unburden yourself','倒倒心里的苦水')],
 '东拉西扯':[T('Talk about nothing in particular','随口闲扯'),T('Let the talk wander','想到哪说到哪')]};
const TK_FREE=[T('Just chat, and see where it goes','随便聊聊，聊到哪儿算哪儿'),T('No topic. Just talk.','不挑话题，就聊天'),T('Let the conversation find itself','话说到哪儿算哪儿'),T('Talk about whatever comes up','有什么聊什么')];
(()=>{const ri=runIncident;runIncident=function(s,inc,c){if(inc&&inc.id==='pk_chat'&&c&&c.p&&!c.op){const p=c.p,n=T(p.n.py,p.n.cn),pool=TK_OPEN.filter(o=>o[0](s));
    let i=Math.floor(R()*pool.length);if(pool[i]&&p.tkOpen===TK_OPEN.indexOf(pool[i])&&pool.length>1)i=(i+1)%pool.length;p.tkOpen=TK_OPEN.indexOf(pool[i]);c.op=pool[i][1](n);
    c.lv=(c.tp||[]).map(t=>{const l=topicLabel(t),alt=TK_LB_ALT[l.zh];return alt&&R()<.67?pick(alt):l});c.fl=pick(TK_FREE)}
  return ri.apply(this,arguments)}})();
(()=>{const inc=INC_BY.pk_chat;if(!inc)return;const t0=inc.text;inc.text=c=>c&&c.op?c.op:t0(c);
  inc.opts.forEach((o,i)=>{const l0=o.l;if(i<3)o.l=c=>c&&c.lv&&c.lv[i]?c.lv[i]:(typeof l0==='function'?l0(c):l0);else o.l=c=>c&&c.fl?c.fl:(typeof l0==='function'?l0(c):l0)})})();
/* ---------- how it ends ---------- */
const TK_END=[T('The tea is refilled three times, and then you have said what there was to say.','茶续了三回，该说的话也说得差不多了。'),T('At dusk, {n} walks you to the gate.','天擦黑时，{n}送你到门口。'),
 T('After that neither of you says much. You just sit a while. That is fine too.','后来两人都没再开口，就那么坐了一会儿。也挺好。'),T('Someone calls {n} away before you finish. Next time.','话没说完，{n}就被人叫走了。下回再接着说。'),
 T('{n} makes you stay for a simple meal before letting you go.','{n}留你吃了顿便饭，才放你走。'),T('When you look back from the corner, {n} is still standing in the doorway.','走到街角回头看，{n}还站在门口。'),
 T('The pot runs dry and you go your separate ways.','一壶茶喝干，各自散了。'),T('You talk about a dozen other things after that. You forget most of them by morning, and feel lighter anyway.','后来又东拉西扯了半天，说了什么转头就忘了，心里却松快了不少。')];
const TK_END_SEA=[[T('Outside, the rain has not stopped.','窗外的雨一直没停。'),T('Petals blow in through the open door.','门开着，花瓣一阵阵飘进来。')],[T('The cicadas never stop all afternoon.','知了叫了一下午。'),T('The ice in the bowl has long since melted.','碗里的冰早化了。')],
 [T('The osmanthus in the yard has dropped all over the ground.','院里的桂花落了一地。'),T('The geese go over, heading south.','头顶有雁往南飞。')],[T('The charcoal in the brazier slowly dies down.','炭盆里的火慢慢暗了下去。'),T('Snow has covered your footprints by the time you leave.','你走的时候，来时的脚印已经被雪盖住了。')]];
const TK_GOOD=[T('It turns into the best talk you have had with {n} in years.','聊着聊着，成了你和{n}这几年最痛快的一回。'),T('You talk until the lamp needs filling twice.','这一聊就聊到深夜，灯油添了两回。'),
 T('{n} laughs until {n} has to wipe their eyes, and says it has been too long.','{n}笑得直抹眼泪，说好久没这么痛快过了。'),T('As you leave, {n} grips your shoulder and says nothing. You understand.','临走时{n}按了按你的肩膀，什么也没说。你懂。'),
 T('You agree to do this again, and both of you mean it.','你们约好了下回还要这样坐着说话，两人都是真心的。'),T('You smile all the way home.','回去的一路上，你都在笑。')];
const TK_BAD=[T('Somewhere the conversation turns. {n} grows quiet and leaves early.','说着说着，话头不知怎么就拧了。{n}沉默下来，早早走了。'),T('{n}’s face closes. Soon there is somewhere {n} has to be.','{n}的脸色淡了下来，没多久就推说有事。'),
 T('The talk dies halfway through a sentence. You both look at other things.','话说到一半就冷了场，两人各自看着别处。'),T('{n} gets up to pour tea and comes back talking about something else. You know you said the wrong thing.','{n}起身倒茶，回来时已经换了个话题。你知道自己说错话了。'),
 T('{n} sees you out very politely. Too politely.','{n}客客气气地把你送了出去，客气得让人难受。')];
/* the good endings of particular topics, in more than one form */
const TK_GOOD_ALT={
 '对方围着你忙了一晚上，你也由着。':[T('{n} fusses over you all evening, and you let them.','{n}围着你忙了一晚上，你也由着。'),T('{n} sends you home with a bag of herbs and strict orders.','{n}塞给你一包草药，又叮嘱了一大堆，才放你回去。'),T('{n} makes you a bowl of soup and watches you drink every drop.','{n}给你熬了碗汤，看着你一口一口喝完。'),T('{n} scolds you for an hour. It is the nicest thing anyone has done for you in months.','{n}数落了你足足一个时辰。这是你几个月来遇到的最暖心的事。')],
 '是句好话。说不定你真会照做。':[T('It is good advice. You may even take it.','是句好话。说不定你真会照做。'),T('You turn it over in your head all the way home.','回去的一路上，你都在琢磨这句话。'),T('You write it down so you will not forget.','你把这句话记了下来，免得忘了。'),T('Annoyingly, {n} is right.','可气的是，{n}说得对。')],
 '当晚你就试了。对方说得对。':[T('You try it that evening. {n} is right.','当晚你就试了。{n}说得对。'),T('Next morning you try it in the yard. It works.','第二天一早你在院里试了试，果然管用。'),T('It takes you a week to admit it, but {n} is right.','你花了七天才肯承认：{n}说得对。')]};
const tkFill=(t,p)=>T(t.en.replace(/\{n\}/g,p.n.py).replace(/\btheir\b/,(PRON[p.sex]||PRON.m).his),t.zh.replace(/\{n\}/g,p.n.cn));
(()=>{const td=talkDo;talkDo=function(s,p,topic){const E=s.log&&s.log[s.log.length-1],n0=E?E.lines.length:0;const r=td.apply(this,arguments);if(!p||!topic||!E)return r;
  const L=E.lines.slice(n0);const g=TK_GOOD[0],b=TK_BAD[0];const gz=tkFill(g,p).zh,bz=tkFill(b,p).zh;
  const last=E.lines[E.lines.length-1];
  if(last&&last.t&&TK_GOOD_ALT[last.t.zh])last.t=tkFill(pick(TK_GOOD_ALT[last.t.zh]),p);
  else if(last&&last.t&&last.t.zh===gz)last.t=tkFill(pick(TK_GOOD),p);
  else if(last&&last.t&&last.t.zh===bz)last.t=tkFill(pick(TK_BAD),p);
  else if(L.length<=2&&chance(.8)){let e=tkFill(pick(TK_END),p);if(chance(.4)){const x=pick(TK_END_SEA[(s.season|0)%4]);e=T(e.en+' '+x.en,e.zh+x.zh)}say(s,e.en,e.zh,'muted')}
  return r}})();
