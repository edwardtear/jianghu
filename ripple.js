/* 江湖一生 · ripples: what happens next depends on how it just went. After a choice resolves, sometimes the same people
   come back at once: thanks or a request after a good deed, a witness or a relative after a bad one, a would-be student
   after a win, mockery or an offer after a loss. */
'use strict';
const RP=[];const rp=d=>{d.only=1;d.noThread=1;d.noRipple=1;RP.push(d);I(d)};
/* --- after a good outcome --- */
rp({id:'rp_g_thanks',kind:'good',who:1,text:c=>T(`A few days later ${c.npc.en}, from that business just now, comes looking for you.`,`过了几天，上回那件事里的${c.npc.zh}找上门来，说是为了那件事。`),
 opts:[{l:T('Hear them out','听对方说'),out:[{w:2,t:c=>T(`${c.npc.en} has brought a gift and will not take it back.`,`${c.npc.zh}带来一份谢礼，怎么也不肯收回。`),c:'good',fx:{money:[10,60],meet:'acq',bond:65}},
   {w:1,t:c=>T(`${c.npc.en} is grateful, and has one more favour to ask. It is a big one.`,`${c.npc.zh}很感激，还想再求你一件事，而且是件大事。`),c:'muted',next:'rp_g_favour',keep:1},
   {w:s=>s.looks/60,t:c=>T(`${c.npc.en} stays longer than gratitude requires.`,`${c.npc.zh}待的时间，比道谢需要的长多了。`),c:'good',fx:{meet:'friend',bond:70,happy:3}}]},
  {l:T('Say there is no need','说不必了'),out:[{w:2,t:T('They bow and go. You hear later that they told everyone.','对方行礼告辞。后来你听说，这事被对方讲给了所有人。'),c:'good',fx:{fame:2,align:1}},{w:1,t:T('They look hurt. They had wanted to repay you.','对方有些失落，本来是想报答你的。'),c:'muted'}]}]});
rp({id:'rp_g_copycat',kind:'good',text:()=>T('Word of what you did spreads. Now a stranger at your door claims to need exactly the same kind of help.','你做的事传开了。如今有个陌生人找上门，说他也需要同样的帮助。'),
 opts:[{l:T('Help again','再帮一回'),out:[{w:s=>2+s.smarts/40,t:T('The need is real. You help, and your name grows.','对方确有难处。你帮了，名声又涨了一些。'),c:'good',fx:{fame:2,align:2,money:-15}},{w:s=>Math.max(.4,(60-s.smarts)/30),t:T('It is a con. Your kindness has a price on it now.','是个骗局。你的好心，如今被人标了价。'),c:'bad',fx:{money:[-60,-20],smarts:1}}]},
  {l:T('Ask some questions first','先问几句'),out:[{w:s=>s.smarts/30,t:T('His story does not hold. He leaves quickly.','他的话编不圆，很快走了。'),c:'good',fx:{smarts:1}},{w:1,t:T('He is genuine, and offended. You help anyway.','对方是真有难处，还被你问得很不痛快。你最后还是帮了。'),c:'muted',fx:{align:1,money:-10}}]}]});
rp({id:'rp_g_credit',kind:'good',text:()=>T('Someone else is telling the story of what you did, with themself as the hero.','有人在到处讲你做的这件事，只不过主角换成了他自己。'),
 opts:[{l:T('Set the record straight','出面澄清'),out:[{w:s=>s.fame/20+1,t:T('People believe you. The braggart leaves town.','大家信了你。吹牛的人离开了镇子。'),c:'good',fx:{fame:2}},{w:1,t:T('It turns into a squabble. Both of you look petty.','吵成了一场口水仗，两人都显得小气。'),c:'bad',fx:{fame:-1}}]},
  {l:T('Let him have it','由他去'),out:[{w:2,t:T('The truth comes out on its own, as it often does.','真相自己浮出了水面，很多事都是这样。'),c:'good',fx:{fame:1,align:1}},{w:1,t:T('He gets the reward that should have been yours. You find you do not mind much.','本该归你的赏赐落到了他手里。你发现自己也没那么在意。'),c:'muted',fx:{happy:1}}]}]});
rp({id:'rp_g_favour',kind:'stage',text:c=>T(`${c.npc.en} lowers ${c.npc.his} voice: a brother has fallen in with a gang and owes them, and they mean to collect next week. Would you go with ${c.npc.him}?`,`${c.npc.zh}压低声音说：家里兄弟跟一伙人混在一起，欠了债，对方下礼拜就要上门讨。想请你陪${c.npc.ta}走一趟。`),
 opts:[{l:T('Go along','陪着去'),fight:FG(PW(.9,3),'injury',T('Debt collectors','讨债的人'),T('a debt brawl','讨债斗殴'),()=>T('A debt collector','讨债的打手')),
   win:[{w:2,t:c=>T(`The collectors back off. ${c.npc.en} will not stop thanking you.`,`讨债的人退了。${c.npc.zh}千恩万谢。`),c:'good',fx:{meet:'friend',bond:75,align:2,fame:1}},{w:1,t:T('They back off, but their boss now knows your face.','对方退了，可他们老大从此记住了你的脸。'),c:'muted',fx:{enemy:1,align:1}}],
   lose:[{w:1,t:c=>T(`It goes badly. ${c.npc.en} pays the debt in the end and sees you to a doctor.`,`没打过。最后还是${c.npc.zh}还了债，把你送去看大夫。`),c:'bad',fx:{bond:60}}]},
  {l:T('Lend the money instead (40 taels)','借钱给对方还债（四十两）'),cost:40,out:[{w:s=>1+s.t.luck*.2,t:c=>T(`${c.npc.en} pays you back within the year, with a little extra.`,`不到一年，${c.npc.zh}就把钱还上了，还多给了些。`),c:'good',fx:{money:50,meet:'friend',bond:70}},{w:1,t:T('The money is gone, and so, soon, are they.','钱没了，没多久人也不见了。'),c:'bad'}]},
  {l:T('Say it is not your business','说这不关你的事'),out:[{w:1,t:T('They nod, and do not come again.','对方点点头，再没来过。'),c:'muted'},{w:1,t:T('Later you hear it ended badly for the brother.','后来听说，那兄弟的下场不太好。'),c:'muted',fx:{happy:-2}}]}]});
/* --- after a bad outcome --- */
rp({id:'rp_b_witness',kind:'bad',text:()=>T('That evening a thin man stops you in the street. "I saw what happened," he says. "I could forget it, for a price."','当晚，一个瘦子在街上拦住你："刚才的事，我都看见了。给个价钱，我可以忘掉。"'),
 opts:[{l:T('Pay him (30 taels)','给他三十两'),cost:30,out:[{w:2,t:T('He pockets it and is never seen again.','他收了钱，从此再没露面。'),c:'muted'},{w:1,t:T('He is back next month, asking for more.','下个月他又来了，要得更多。'),c:'bad',fx:{money:-30}}]},
  {l:T('Threaten him','吓唬他'),out:[{w:s=>power(s)/40+1,t:T('He goes white and swears he saw nothing.','他脸都白了，发誓什么也没看见。'),c:'muted',fx:{align:-1}},{w:1,t:T('He runs straight to the yamen.','他扭头就去了衙门。'),c:'bad',fx:{wanted:1}}]},
  {l:T('Shrug: let him tell','随他说去'),out:[{w:1,t:T('He tells. People talk for a week, then forget.','他说出去了。人们议论了一个礼拜，就忘了。'),c:'muted',fx:{fame:-1}},{w:1,t:T('Nobody believes a man like him.','谁会信他那种人。'),c:'muted'}]}]});
rp({id:'rp_b_guilt',kind:'bad',text:()=>T('You cannot stop thinking about how that went. It sits on your chest at night.','你一直放不下那件事。夜里它压在你胸口。'),
 opts:[{l:T('Try to make amends','设法弥补'),out:[{w:s=>s.t.heart*.3,t:T('It costs you, and it is not enough, but it helps.','代价不小，也弥补不了全部，可总归有用。'),c:'good',fx:{money:[-50,-10],align:3,happy:3}},{w:1,t:T('The people you wronged will not see you.','你亏欠的人，不肯见你。'),c:'muted',fx:{align:1,happy:-2}}]},
  {l:T('Harden your heart','硬起心肠'),out:[{w:1,t:T('After a while it stops bothering you. That bothers you more.','过了一阵就不怎么在意了。这反倒更让你在意。'),c:'muted',fx:{align:-2}},{w:1,t:T('It works. You sleep fine.','管用。你睡得挺好。'),c:'muted',fx:{align:-3,happy:2}}]}]});
rp({id:'rp_b_kin',kind:'bad',who:1,text:c=>T(`A relative of ${c.npc.en} turns up asking questions about what happened.`,`${c.npc.zh}的一个亲戚找上门来，打听那件事的经过。`),
 opts:[{l:T('Tell the truth','照实说'),out:[{w:s=>1+s.align/30,t:T('They listen, and are angry, and leave. It is cleaner this way.','对方听完，很生气，走了。这样反而干净。'),c:'muted',fx:{align:2}},{w:1,t:T('They swear they will not forget it.','对方发誓，这事没完。'),c:'bad',fx:{enemy:1}}]},
  {l:T('Lie smoothly','编个说法'),out:[{w:s=>s.smarts/30,t:T('They believe you.','对方信了。'),c:'muted',fx:{align:-2}},{w:1,t:T('They do not believe you, and now you are a liar as well.','对方不信。这下你还多了个骗子的名声。'),c:'bad',fx:{align:-2,fame:-1,enemy:1}}]},
  {l:T('Refuse to talk','闭口不谈'),out:[{w:1,t:T('They leave, unsatisfied. You will see them again.','对方悻悻而去。你们还会再见的。'),c:'muted'},{w:1,t:T('They give up.','对方放弃了。'),c:'muted'}]}]});
/* --- after a fight --- */
rp({id:'rp_w_student',kind:'win',text:()=>T('A young onlooker who watched the fight follows you for a mile, then asks to be taught.','一个看完打斗的年轻人跟了你一里路，终于开口求你收他为徒。'),
 opts:[{l:T('Take them on','收下'),if:s=>s.age>=20,out:[{w:2,t:T('Eager, clumsy and loyal.','热心、笨拙，而且忠心。'),c:'good',fx:{meet:'disciple',bond:65}},{w:1,t:T('Within a month they steal your purse and vanish.','不到一个月，对方偷了你的钱袋，跑了。'),c:'bad',fx:{money:[-40,-10]}}]},
  {l:T('Send them home','打发回家'),out:[{w:1,t:T('They go, disappointed. Maybe they will try someone else.','对方失望地走了，也许会去拜别人。'),c:'muted'},{w:1,t:T('They come back three more times. On the fourth you give in.','对方又来了三回。第四回你松了口。'),c:'good',fx:{meet:'disciple',bond:70}}]}]});
rp({id:'rp_w_test',kind:'win',ctx:s=>({lv:PW(.95,4)(s)}),text:()=>T('News of your win travels. A swordsman arrives at your inn the next day, wanting to see for himself.','你赢了的消息传开了。第二天，一个剑客找到你下榻的客栈，想亲眼见识见识。'),
 opts:[{l:T('Cross swords, lightly','点到为止，过几招'),fight:(s,c)=>({foe:{name:foeName(),lv:c.lv},stakes:'spar',title:T('A test','试招'),cause:T('a friendly bout','切磋')}),
   win:[{w:2,t:T('He bows and buys the wine.','他拱手认输，请了酒。'),c:'good',fx:{fame:1,meet:'acq',bond:60}},{w:1,t:T('He goes away thoughtful, and tells others.','他若有所思地走了，又讲给了别人。'),c:'good',fx:{fame:2}}],
   lose:[{t:T('He wins, and says the first fight must have been luck.','他赢了，说你上一场大概是运气。'),c:'muted',fx:{fame:-1}}]},
  {l:T('Decline','婉拒'),out:[{w:1,t:T('He shrugs and leaves.','他耸耸肩，走了。'),c:'muted'},{w:1,t:T('He tells people you were afraid.','他到处说你怕了。'),c:'muted',fx:{fame:-1}}]}]});
rp({id:'rp_l_mock',kind:'lose',text:()=>T('By the next market day everyone has heard you lost. Children reenact it in the street.','到下个集日，人人都知道你输了。孩子们在街上演给彼此看。'),
 opts:[{l:T('Laugh along','跟着一起笑'),out:[{w:s=>s.t.heart*.3,t:T('Laughing at yourself takes the sting out. People like you better for it.','能自嘲，刺就拔了。大家反倒更喜欢你了。'),c:'good',fx:{happy:2,fame:1}},{w:1,t:T('It still stings.','还是刺痛。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Train harder, say nothing','闭门苦练，一言不发'),out:[{w:2,t:T('A month of dawn practice. The memory becomes fuel.','一个月的晨练。那份难堪变成了劲头。'),c:'good',fx:{skill:1}},{w:1,t:T('You push too hard, too angry.','你练得太急，心里憋着火。'),c:'bad',fx:{f:s=>{if(typeof addCond==='function'&&chance(.4))addCond(s,'wound',1)}}}]}]});
rp({id:'rp_l_offer',kind:'lose',text:()=>T('An old man who watched the fight says he saw exactly what you did wrong, and will tell you for ten taels.','一个看了打斗的老头说，他看清了你错在哪里，十两银子就告诉你。'),
 opts:[{l:T('Pay','给钱'),cost:10,out:[{w:2,t:T('He is right. It is a small thing, and it was costing you everything.','他说得对。是个小毛病，却害你满盘皆输。'),c:'good',fx:{skill:2}},{w:1,t:T('He says “try harder” and walks off with your silver.','他说了句"再努力些"，拿着银子走了。'),c:'muted',fx:{smarts:1}}]},
  {l:T('Refuse','不给'),out:[{w:1,t:T('He tells you anyway, for free. It is useful.','他还是免费告诉了你，挺有用。'),c:'good',fx:{skill:1}},{w:1,t:T('He spits and leaves.','他啐了一口，走了。'),c:'muted'}]}]});

/* pick a ripple after a choice resolves, and only when nothing else is already waiting */
(()=>{const ci=chooseInc;chooseInc=function(s,q,k){
  const L=s.log[s.log.length-1],i0=L?L.lines.length:0,a0=s.align;const r=ci(s,q,k);const da=s.align-a0,fo=q.c&&q.c['f'+k]&&q.c['f'+k].foe;
  const inc=INC_BY[q.id];if(!s.alive||!inc||inc.noRipple||s.queue.length||String(q.id).startsWith('th_')||!chance(.22))return r;
  const ls=(s.log[s.log.length-1]||{lines:[]}).lines.slice(i0);const cs=ls.map(l=>l.c||'');
  const human=fo&&!fo.beast,fw=q.c&&q.c.fightWon;
  /* a win or loss in front of people; a wrong you did; a kindness you did. Bad luck that simply happened to you brings no blackmailer */
  const kind=fw===true&&human?'win':fw===false&&human?'lose':fw==null&&da<=-3?'bad':fw==null&&da>=2?'good':null;
  if(!kind)return r;const nm=q.c&&q.c.npc,qt=q.text?(q.text.zh||'')+(q.text.en||''):'',named=nm&&((nm.zh&&qt.includes(nm.zh))||(nm.en&&qt.includes(nm.en)));
  const pool=RP.filter(x=>x.kind===kind&&(s.age>=14||x.id==='rp_b_guilt')&&(x.id!=='rp_w_student'||s.age>=20)&&(!x.who||named)&&(s.seen[x.id]==null||s.age-s.seen[x.id]>=10));if(!pool.length)return r;
  const nx=pick(pool);const c=Object.assign({},q.c||{});if(!c.npc)c.npc=npc(s);Object.assign(c,nx.ctx?nx.ctx(s):{});runIncident(s,nx,c);return r}})();

/* remember what the last choice produced, so the screen can show the outcome before the next decision */
(()=>{const ch=choose;choose=function(s,k){const E=s.log[s.log.length-1],i0=E?E.lines.length:0,n=s.log.length;const r=ch(s,k);
  if(s.queue.length&&s.log.length===n&&s.alive)s._hold={i0,i1:s.log[s.log.length-1].lines.length};else delete s._hold;return r}})();
/* people already in your life who appear in a pending decision */
function queuePeople(s,q){if(!q)return[];const ids=new Set();const c=q.c||{};if(c.pid)ids.add(c.pid);if(c.p&&c.p.id)ids.add(c.p.id);if(c.L&&c.L.pid)ids.add(c.L.pid);
  const txt=q.text?(q.text.zh||'')+' '+(q.text.en||''):'';
  s.people.forEach(p=>{if(!p.alive||p.temp||!p.n)return;if((p.n.cn&&p.n.cn.length>=2&&txt.includes(p.n.cn))||(p.n.py&&p.n.py.length>=4&&txt.includes(p.n.py)))ids.add(p.id)});
  return[...ids].map(id=>person(s,id)).filter(p=>p&&p.alive)}

/* anything a choice or an activity sets off is marked as a follow-up, with a reminder of what it follows */
const snip=x=>{const f=(v,n)=>{v=String(v||'').replace(/\s+/g,' ');return v.length>n?v.slice(0,n)+'…':v};return T(f(x.en,48),f(x.zh,20))};
function markFollow(s,old,from){if(!from)return;s.queue.forEach(q=>{if(!old.has(q)&&q.text&&!q.follow){q.follow=1;q.from=from}})}
(()=>{const ch=choose;choose=function(s,k){const q=s.queue[0],old=new Set(s.queue),E=s.log[s.log.length-1],i0=E?E.lines.length:0,n=s.log.length;const r=ch(s,k);
  if(q&&q.src==='inc'&&s.alive&&s.log.length===n&&E&&!E.lines.slice(i0).some(l=>!/prompt|you/.test(l.c||''))&&!s.queue.some(x=>!old.has(x)))say(s,'Nothing much comes of it.','这事就这么过去了，没起什么波澜。','muted');
  if(q)markFollow(s,old,q.text?snip(q.text):q.from||(ACT_BY[q.id]&&ACT_BY[q.id].n));return r}})();
(()=>{const af=actFollow;actFollow=function(s,id){const old=new Set(s.queue);af(s,id);if(ACT_BY[id])markFollow(s,old,ACT_BY[id].n)}})();

/* each piece of unfinished business says where it will pick up again */
const QGO=new Map(),QACT={wander:'wander',town:'teahouse',chore:'sectchores',sect:'sectmission'};
(()=>{const W={wander:T('roam the jianghu','去「闯荡江湖」'),town:T('go to the teahouse and see what the shouting at the next table is about','去「茶馆酒楼」，看看邻桌在吵什么'),chore:T('do sect duties','做「门派杂务」'),sect:T('take a sect mission','「领取门派任务」'),yearly:T('It will come to you as the years pass','过几年自会找上门')};
 Object.keys(QHINT).forEach(k=>{const tags=[...new Set(INC.filter(i=>i.need===k).map(i=>(i.tags||[]).find(t=>W[t])||'yearly'))];if(!tags.length)return;
  const w=tags.map(t=>W[t]),en=w.map(x=>x.en).join(' or '),zh=w.map(x=>x.zh).join('或');
  const add=t=>T(`${t.en} (${tags[0]==='yearly'&&tags.length===1?'':'Next: '}${en}.)`,`${t.zh}（${tags.length===1&&tags[0]==='yearly'?'':'下一步：'}${zh}）`);
  const h=QHINT[k];let o;if(h&&h.t){h.t=add(h.t);o=h.t}else if(h){QHINT[k]=add(h);o=QHINT[k]}
  if(o)QGO.set(o,{k,tags})})})();
/* the shortcut beside each line of unfinished business: go straight to where the next step happens */
function questGo(s,h){const g=QGO.get(h);if(!g||!s.alive)return'';const t=g.tags.find(x=>QACT[x]);if(!t)return'';
  const a=ACT_BY[QACT[t]];if(!a||(a.if&&!a.if(s)))return'';
  if(!INC.some(i=>i.need===g.k&&eligible(s,i,t)))return`<span class="qwait">${tr(T('Not yet. Give it a year.','时机未到，过一年再说'))}</span>`;
  const ok=canAct(s,a),cost=actCost(s,a);
  return`<button class="chip qgo" data-qgo="${a.id}"${ok===true&&!s.queue.length?'':' disabled'}>${tr(T('Go: ','前往：'))}${tr(a.n)}${cost?' '+'●'.repeat(Math.min(cost,6)):''}</button>${ok!==true&&ok!==false&&ok?`<span class="qwait">${tr(ok)}</span>`:''}`}
/* a story you are in the middle of comes first: when you go where its next step happens, it usually does */
(()=>{const pk=pickIncident;pickIncident=function(s,tag){
  if(tag&&!/^af_/.test(tag)){const qs=INC.filter(i=>i.need&&s.flags[i.need]!=null&&eligible(s,i,tag));if(qs.length&&chance(.75))return pick(qs)}
  return pk(s,tag)}})();
function townQuest(s){return INC.some(i=>i.need&&s.flags[i.need]!=null&&(i.tags||[]).includes('town')&&eligible(s,i,'town'))}
/* roaming while a story waits on the road: most of the time, the road leads there */
(()=>{const W=ACT_BY.wander;if(!W)return;const r0=W.run;W.run=function(s){const qs=INC.filter(i=>i.need&&s.flags[i.need]!=null&&eligible(s,i,'wander'));
  if(qs.length&&chance(.75)){runIncident(s,pick(qs));return}return r0.call(W,s)}})();
