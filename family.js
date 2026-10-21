/* 江湖一生 · children and sworn siblings as things that last a lifetime: a pregnancy and a birth, a child's first
   grab and schooling and quarrels and marriage, grandchildren, and at the end the chance to go on living as your heir;
   a sworn oath with its ceremony and rank, the duties it brings, godchildren, a broken oath, and a sworn sibling to avenge */
'use strict';

REL.grandchild=T('Grandchild','孙辈');REL.godchild=T('Godchild','义子女');REL_GROUPS[0][2].push('grandchild','godchild');
(()=>{const r0=relLabel;relLabel=function(s,p){
  if(p.rel==='sworn'){const older=p.age>s.age||(p.age===s.age&&p.swOlder);return p.sex==='m'?(older?T('Sworn elder brother','义兄'):T('Sworn younger brother','义弟')):(older?T('Sworn elder sister','义姐'):T('Sworn younger sister','义妹'))}
  if(p.rel==='grandchild')return p.sex==='m'?T('Grandson','孙子'):T('Granddaughter','孙女');
  if(p.rel==='godchild')return p.sex==='m'?T('Godson','义子'):T('Goddaughter','义女');
  return r0(s,p)}})();
const kidsOf=s=>s.people.filter(p=>p.rel==='child'&&p.alive);
const kidN=p=>T(p.n.py,p.n.cn),kHe=p=>PRON[p.sex];

/* ---------- a child is carried, then born ---------- */
(()=>{const P=PACTS.find(a=>a.id==='baby');if(!P)return;const if0=P.if;P.if=(s,p)=>if0(s,p)&&!s.preg;
  P.run=function(s,p){p.talked=s.age;if(chance(.5)){s.preg={due:s.age+1,pid:p.id};happy(s,6);say(s,s.gender==='f'?'You are with child. The family starts sewing small clothes.':`${p.n.py} is with child. The family starts sewing small clothes.`,s.gender==='f'?'你有喜了。家里开始缝小衣裳。':`${p.n.cn}有喜了。家里开始缝小衣裳。`,'gold')}
    else say(s,'No luck this year.','今年没能如愿。','muted')}})();
const kidTal=(s,p)=>{const a=s.t||{};const m=k=>clamp(Math.round(((a[k]||5)+(rint(2,9)))/2+rint(-1,1)),1,10);return{root:m('root'),wit:m('wit')}};
function bearChild(s,other,extra){const g=chance(.5)?'m':'f';const sur=s.gender==='m'?s.sur:(other&&other.n?other.n.sur:s.sur);
  let c,tries=0;do{c=mkPerson(s,Object.assign({rel:'child',sex:g,sur,age:0,bond:rint(75,95),lv:1},extra||{}))}while(tries++<8&&s.people.some(p=>p.n&&p.n.cn===c.n.cn));c.kid=kidTal(s,other);s.people.push(c);return c}
I({id:'fm_birth',only:1,noThread:1,noRipple:1,ctx:s=>{const c=scene();c.p=person(s,s.preg.pid);return c},
 text:(c,s)=>T(s.gender==='f'?'Your time has come. The midwife is sent for at midnight.':`${c.p?c.p.n.py:'Your wife'}’s time has come. You pace the yard until dawn.`,s.gender==='f'?'临盆了。半夜里派人去请稳婆。':`${c.p?c.p.n.cn:'妻子'}要生了。你在院子里来回走到天亮。`),
 opts:[{l:T('Send for the best midwife in town (20 taels)','请城里最好的稳婆（二十两）'),cost:20,out:[{w:6,t:T('A healthy child, and an easy birth.','孩子很健康，生得也顺。'),c:'gold',fx:{f:(s,c)=>{const k=bearChild(s,c.p);c.kidp=k;bornLine(s,k)}}},{w:1,t:T('Twins! The midwife earns her fee twice over.','双胞胎！稳婆这钱挣得值。'),c:'gold',fx:{f:(s,c)=>{const a=bearChild(s,c.p),b=bearChild(s,c.p);b.twin=1;a.twin=1;bornLine(s,a);bornLine(s,b)}}},{w:1,t:T('A long, hard night; mother and child both live.','熬了一整夜，母子平安。'),c:'good',fx:{f:(s,c)=>{const k=bearChild(s,c.p);bornLine(s,k);if(s.gender==='f')s.health=Math.max(5,s.health-15)}}}]},
  {l:T('Trust the village woman','请村里的接生婆'),out:[{w:4,t:T('A healthy child.','孩子很健康。'),c:'gold',fx:{f:(s,c)=>{const k=bearChild(s,c.p);bornLine(s,k)}}},{w:1.4,t:T('A hard birth. The child lives; the mother takes months to recover.','难产。孩子保住了，大人养了好几个月才缓过来。'),c:'bad',fx:{f:(s,c)=>{const k=bearChild(s,c.p);bornLine(s,k);if(s.gender==='f')s.health=Math.max(5,s.health-25);else if(c.p)addBond(c.p,5)}}},
   {w:.35,t:T('The child does not live through the first night.','孩子没能熬过第一夜。'),c:'bad',fx:{happy:-20}}]}]});
function bornLine(s,k){say(s,`A ${k.sex==='m'?'son':'daughter'}: ${k.n.py}.`,`${k.sex==='m'?'是个儿子':'是个女儿'}，取名${k.n.cn}。`,'gold');happy(s,10);if(!s.flags.firstKid){s.flags.firstKid=s.age;deed(s,`Became a ${s.gender==='f'?'mother':'father'}`,`为人${s.gender==='f'?'母':'父'}`)}}
(()=>{const y=yearly;yearly=function(s){y(s);if(s.preg&&s.alive&&s.age>=s.preg.due){const ok=s.preg.pid&&person(s,s.preg.pid);if(ok||s.gender==='f')runIncident(s,INC_BY.fm_birth);delete s.preg}}})();
/* a child can also come from a lover */
I({id:'fm_loverchild',age:[17,45],cd:20,w:1,when:s=>living(s,'lover').length>0&&!spouseOf(s)&&!s.preg,ctx:s=>{const c=scene();c.p=pick(living(s,'lover'));return c},
 text:(c,s)=>T(s.gender==='f'?`You are carrying ${c.p.n.py}’s child, and you are not married.`:`${c.p.n.py} is carrying your child, and you are not married.`,s.gender==='f'?`你怀了${c.p.n.cn}的孩子，可你们还没成亲。`:`${c.p.n.cn}怀了你的孩子，可你们还没成亲。`),
 opts:[{l:T('Marry at once','立刻成亲'),out:[{w:3,t:T('A hurried wedding, and nobody counts the months aloud.','婚事办得匆忙，也没人把月份掰着指头算出来。'),c:'good',fx:{f:(s,c)=>{c.p.rel='spouse';addBond(c.p,10);s.preg={due:s.age+1,pid:c.p.id};deed(s,`Married ${c.p.n.py}`,`与${c.p.n.cn}结为夫妻`)}}},{w:1,t:T('You marry, and the family never quite forgives either of you.','婚是成了，可家里始终没完全原谅你们。'),c:'muted',fx:{f:(s,c)=>{c.p.rel='spouse';s.preg={due:s.age+1,pid:c.p.id};s.fame=Math.max(0,s.fame-2)}}}]},
  {l:T('Raise the child, but do not marry','孩子生下来，但不成亲'),out:[{w:1,t:T('The town talks for a year. The child does not care.','镇上议论了一整年。孩子才不在乎。'),c:'muted',fx:{fame:-3,f:(s,c)=>{s.preg={due:s.age+1,pid:c.p.id}}}},{w:1,t:T('The lover leaves before the birth.','孩子还没生，那人就走了。'),c:'bad',fx:{happy:-8,f:(s,c)=>{c.p.rel='ex';if(s.gender==='f')s.preg={due:s.age+1,pid:null}}}}]}]});

/* ---------- growing up: each child walks their own road, and you have a say ---------- */
const kidInc=(id,d)=>{d.id=id;d.only=1;d.noThread=1;d.noRipple=1;I(d)};
kidInc('fk_grab',{ctx:s=>({}),text:c=>T(`At ${c.k.n.py}’s first-birthday grab, the family lays out a sword, a brush, an abacus and a seal.`,`${c.k.n.cn}周岁抓周，家里摆了剑、笔、算盘和官印。`),
 opts:[{l:T('Watch what they grab','看孩子抓什么'),out:[{w:1,t:c=>T(`${c.k.n.py} grabs the sword and will not let go.`,`${c.k.n.cn}一把抓住剑，死活不撒手。`),c:'good',fx:{f:(s,c)=>{c.k.path='sword';c.k.lv+=2}}},{w:1,t:c=>T(`${c.k.n.py} grabs the brush and paints the dog.`,`${c.k.n.cn}抓起毛笔，把狗画了个花脸。`),c:'good',fx:{f:(s,c)=>{c.k.path='book'}}},{w:1,t:c=>T(`${c.k.n.py} shakes the abacus like a rattle.`,`${c.k.n.cn}把算盘当拨浪鼓摇。`),c:'good',fx:{f:(s,c)=>{c.k.path='trade'}}},{w:.7,t:c=>T(`${c.k.n.py} sits on the seal and laughs.`,`${c.k.n.cn}一屁股坐在官印上，咯咯直笑。`),c:'good',fx:{f:(s,c)=>{c.k.path='office'}}}]}]});
kidInc('fk_school',{text:c=>T(`${c.k.n.py} is six. Time to decide how ${kHe(c.k).he} will be raised.`,`${c.k.n.cn}六岁了，该定下怎么培养${kHe(c.k).ta}了。`),
 opts:[{l:T('Village school (30 taels)','送进私塾（三十两）'),cost:30,out:[{w:s=>2+(s.smarts>60?1:0),t:c=>T(`${c.k.n.py} takes to the books.`,`${c.k.n.cn}读书很上心。`),c:'good',fx:{f:(s,c)=>{c.k.path=c.k.path||'book';c.k.smart=1;addBond(c.k,3)}}},{w:1,t:c=>T(`${c.k.n.py} spends more time fighting in the yard than reading.`,`${c.k.n.cn}在院子里打架的时间，比读书的时间多。`),c:'muted',fx:{f:(s,c)=>{c.k.lv+=2}}}]},
  {l:T('Teach them martial arts yourself','亲自教武'),if:s=>power(s)>=15,out:[{w:3,t:c=>T(`Every dawn, you and ${c.k.n.py} in the yard.`,`每天天不亮，你和${c.k.n.cn}都在院子里。`),c:'good',fx:{f:(s,c)=>{c.k.lv+=4+Math.round(power(s)/30);c.k.path='sword';addBond(c.k,8)}}},{w:1,t:T('You are a harder teacher than you meant to be.','你当师父，比自己想的要严厉。'),c:'muted',fx:{f:(s,c)=>{c.k.lv+=5;addBond(c.k,-6)}}}]},
  {l:T('Send them to a sect','送进门派'),if:s=>localSects(s).length>0,out:[{w:2,t:c=>T(`${c.k.n.py} is accepted by ${SECTS[c.sk].en}. The house is very quiet.`,`${c.k.n.cn}被${SECTS[c.sk].cn}收下了。家里一下子静了。`),c:'good',fx:{f:(s,c)=>{c.k.sect=c.sk;c.k.lv+=5;c.k.path='sword';happy(s,-3)}}},{w:1,t:T('They are turned away at the gate. Too soft, the examiner says.','在山门口就被打发了回来。考官说孩子太娇气。'),c:'muted',fx:{f:(s,c)=>addBond(c.k,2)}}]},
  {l:T('Let them run free','放养'),out:[{w:1,t:c=>T(`${c.k.n.py} knows every tree and every dog in the district.`,`方圆几里的树和狗，${c.k.n.cn}都认得。`),c:'good',fx:{f:(s,c)=>{addBond(c.k,4);c.k.lv+=1}}},{w:1,t:c=>T(`${c.k.n.py} falls in with the wrong children.`,`${c.k.n.cn}跟一帮野孩子混在了一起。`),c:'bad',fx:{f:(s,c)=>{c.k.wild=1}}}]}],
 cctx:s=>({sk:pick(localSects(s).length?localSects(s):['shaolin'])})});
kidInc('fk_dream',{text:c=>T(`${c.k.n.py}, fifteen, announces a plan: ${c.d.en}`,`十五岁的${c.k.n.cn}宣布了一个打算：${c.d.zh}`),
 cctx:(s,c)=>({d:pick([T('to leave home and roam the jianghu.','离家去闯荡江湖。'),T('to sit the imperial exams.','去考科举。'),T('to marry someone you have never met.','娶（嫁）一个你从没见过的人。'),T('to join a sect your own sect dislikes.','去投一个和你门派不对付的门派。')])}),
 opts:[{l:T('Give your blessing','由着孩子去'),out:[{w:2,t:T('They hug you at the gate, and go.','孩子在门口抱了抱你，走了。'),c:'good',fx:{f:(s,c)=>{addBond(c.k,10);c.k.free=1;c.k.lv+=2}}},{w:1,t:T('It goes badly for them, and they come home, and you do not say anything.','孩子在外头碰了壁，回了家。你什么也没说。'),c:'muted',fx:{f:(s,c)=>addBond(c.k,6)}}]},
  {l:T('Forbid it','不许'),out:[{w:1,t:T('They obey, and are quiet at dinner for a year.','孩子听了话，整整一年饭桌上都不吭声。'),c:'muted',fx:{f:(s,c)=>addBond(c.k,-10)}},{w:1,t:T('They go anyway, at night, through the window.','孩子还是走了，半夜从窗户跳出去的。'),c:'bad',fx:{f:(s,c)=>{addBond(c.k,-15);c.k.free=1}}}]},
  {l:T('Talk it through','坐下来好好谈'),out:[{w:s=>1+s.smarts/40,t:T('You find a middle road. Neither of you entirely likes it, which is how you know it is fair.','你们找到了一条折中的路。两个人都不太满意，这正说明公平。'),c:'good',fx:{f:(s,c)=>addBond(c.k,6)}},{w:1,t:T('You both say things you regret.','两人都说了让自己后悔的话。'),c:'bad',fx:{f:(s,c)=>addBond(c.k,-8)}}]}]});
kidInc('fk_match',{text:c=>T(`${c.k.n.py} is of age. Three families have sent matchmakers.`,`${c.k.n.cn}到了婚嫁的年纪。三户人家托了媒人上门。`),
 opts:[{l:T('The rich merchant’s family','富商之家'),out:[{w:2,t:T('A splendid wedding and a generous family-in-law.','婚礼风光，亲家也大方。'),c:'good',fx:{money:[50,200],f:(s,c)=>{c.k.married=1;addBond(c.k,2)}}},{w:1,t:T('A splendid wedding and a miserable marriage.','婚礼风光，日子却过得憋屈。'),c:'bad',fx:{money:[30,100],f:(s,c)=>{c.k.married=1;addBond(c.k,-10)}}}]},
  {l:T('A martial family','武林世家'),out:[{w:2,t:T('Your families become allies; both houses grow stronger.','两家结了亲，都更有底气了。'),c:'good',fx:{fame:3,f:(s,c)=>{c.k.married=1;c.k.lv+=3}}},{w:1,t:T('The in-laws have enemies, and now so do you.','亲家有仇人，如今也成了你的仇人。'),c:'muted',fx:{enemy:1,f:(s,c)=>{c.k.married=1}}}]},
  {l:T('Let them choose their own sweetheart','让孩子自己选心上人'),out:[{w:3,t:T('A small wedding, and a happy one.','婚礼不大，日子挺美。'),c:'good',fx:{f:(s,c)=>{c.k.married=1;addBond(c.k,12)}}},{w:1,t:T('The sweetheart is poorer than you hoped. You keep that to yourself.','心上人比你盼的穷些。你把这话咽了回去。'),c:'muted',fx:{f:(s,c)=>{c.k.married=1;addBond(c.k,8)}}}]}]});
kidInc('fk_grandkid',{text:c=>T(`${c.k.n.py} has a child of ${kHe(c.k).his} own. You are a grandparent.`,`${c.k.n.cn}有孩子了。你当上了祖辈。`),
 opts:[{l:T('Hold the baby','抱抱孩子'),out:[{w:3,t:T('Smaller than you remembered babies being.','比你记忆里的婴儿还要小。'),c:'gold',fx:{happy:8,f:(s,c)=>{const g=mkPerson(s,{rel:'grandchild',sur:c.k.sex==='m'?c.k.n.sur:null,age:0,bond:rint(70,90),lv:1});s.people.push(g)}}},{w:1,t:T('It cries the moment you take it. Everyone laughs.','你一接过来它就哭。大家都笑了。'),c:'good',fx:{happy:5,f:(s,c)=>{const g=mkPerson(s,{rel:'grandchild',sur:c.k.sex==='m'?c.k.n.sur:null,age:0,bond:rint(60,85),lv:1});s.people.push(g)}}}]}]});
kidInc('fk_kidnap',{text:c=>T(`A note under your door: ${c.k.n.py} has been taken. ${c.foe.en} names a place and a price, and says to come alone.`,`门缝里塞进一张纸条：${c.k.n.cn}被人掳走了。${c.foe.zh}写明了地点和赎金，要你独自前去。`),
 cctx:(s,c)=>{const en=living(s,'enemy')[0];return{foe:en?T(en.n.py,en.n.cn):foeName(),lv:en?Math.max(en.lv,Math.round(power(s)*.95)):PW(1.05,6)(s)}},
 opts:[{l:T('Go alone, as told','照对方说的，独自前往'),fight:(s,c)=>({foe:{name:c.foe,lv:c.lv,fixed:1},stakes:'death',title:T('For your child','为了孩子'),cause:T('a kidnapper','绑匪')}),
   win:[{w:1,t:c=>T(`You carry ${c.k.n.py} home on your back. ${kHe(c.k).He} sleeps the whole way.`,`你把${c.k.n.cn}背回了家。${kHe(c.k).ta}一路上都睡着。`),c:'gold',fx:{fame:4,f:(s,c)=>addBond(c.k,20)}}],
   lose:[{w:1,t:c=>T(`You lose, but the kidnapper, shaken, lets ${c.k.n.py} go.`,`你输了，可绑匪也被吓住了，放了${c.k.n.cn}。`),c:'bad',fx:{f:(s,c)=>addBond(c.k,10)}}]},
  {l:T('Pay the ransom (200 taels)','付赎金（二百两）'),cost:200,out:[{w:3,t:c=>T(`${c.k.n.py} comes home thin and silent.`,`${c.k.n.cn}回来了，瘦了，也不怎么说话了。`),c:'muted',fx:{f:(s,c)=>addBond(c.k,6)}},{w:1,t:T('They take the money and ask for more.','对方收了钱，又要更多。'),c:'bad',fx:{money:-100}}]},
  {l:T('Go to your sworn siblings and friends','去找结义兄弟和朋友帮忙'),if:s=>living(s,['sworn','friend']).length>=2,out:[{w:s=>1+living(s,'sworn').length*.6,t:T('Five of you come over the wall at dawn. It is over quickly.','天亮时你们五个人翻墙而入，很快就了结了。'),c:'gold',fx:{fame:3,f:(s,c)=>{addBond(c.k,15);living(s,['sworn','friend']).forEach(p=>addBond(p,4))}}},{w:1,t:T('The kidnapper sees you coming and runs, dragging the child. It takes a month to find them.','绑匪远远看见人多，拖着孩子跑了。找了一个月才找回来。'),c:'muted',fx:{happy:-6,f:(s,c)=>addBond(c.k,8)}}]}]});
kidInc('fk_fame',{text:c=>T(`[Family] ${c.k.n.py}, your ${c.k.sex==='m'?'son':'daughter'}, has made a name in the jianghu. People now call you "${c.k.n.py}’s ${s_par(c)}".`,`【人情】你的${c.k.sex==='m'?'儿子':'女儿'}${c.k.n.cn}在江湖上闯出了名号。如今别人提起你，都说"那是${c.k.n.cn}的${s_parZ(c)}"。`),
 opts:[{l:T('Be proud','由衷自豪'),out:[{w:1,t:T('You buy everyone a drink.','你请了满堂的酒。'),c:'gold',fx:{fame:3,happy:6}},{w:1,t:T('You worry, quietly, about the enemies a name brings.','你暗暗担心：名气大了，仇家也多。'),c:'muted',fx:{fame:2,happy:2}}]}]});
const s_par=c=>c.pg==='f'?'mother':'father',s_parZ=c=>c.pg==='f'?'娘':'爹';
kidInc('fk_care',{text:c=>T(`You are old now. ${c.k.n.py} wants you to come and live in ${kHe(c.k).his} house.`,`你老了。${c.k.n.cn}想接你去${kHe(c.k).ta}家里住。`),
 opts:[{l:T('Go','去'),out:[{w:3,t:T('Grandchildren underfoot and soup on the stove. It is a good end.','孙辈绕膝，灶上有汤。这样的晚年，挺好。'),c:'gold',fx:{happy:10,health:6}},{w:1,t:T('You and your child’s spouse do not get along.','你和孩子的另一半处不来。'),c:'muted',fx:{happy:-3}}]},
  {l:T('Stay in your own house','留在自己家'),out:[{w:1,t:T('They visit every month, and you pretend not to be glad.','孩子每个月都来看你，你装作并不怎么高兴。'),c:'good',fx:{happy:4}},{w:1,t:T('The house is very quiet.','屋子里很安静。'),c:'muted',fx:{happy:-2}}]}]});
kidInc('fk_inherit',{text:c=>T(`Your children are already quarrelling over what you will leave them, and you are still alive.`,`你还活着，孩子们就已经为家产吵起来了。`),
 opts:[{l:T('Divide it now, fairly','现在就分，分得公平'),out:[{w:2,t:T('Nobody is happy, so it is probably fair.','谁都不满意，那大概就是公平了。'),c:'muted',fx:{money:[-200,-50],f:s=>kidsOf(s).forEach(k=>addBond(k,2))}},{w:1,t:T('One of them stops speaking to the rest.','有一个从此不跟其他人说话了。'),c:'bad',fx:{happy:-5}}]},
  {l:T('Leave it all to the most deserving','全留给最孝顺的那个'),out:[{w:1,t:T('The others call you unjust; the favoured one weeps.','其余的说你偏心；得了家产的那个哭了。'),c:'muted',fx:{f:s=>{const ks=kidsOf(s).sort((a,b)=>b.bond-a.bond);ks.forEach((k,i)=>addBond(k,i?-10:12))}}}]},
  {l:T('Spend it all on yourself','全花在自己身上'),out:[{w:1,t:T('A splendid old age. Your children are speechless.','晚年过得风光。孩子们哑口无言。'),c:'good',fx:{happy:8,money:[-300,-100]}}]}]});
/* when each of these happens */
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.queue.length>2)return;const ks=kidsOf(s);
  const go=(id,k,ex)=>{const inc=INC_BY[id];if(!inc)return false;const c=Object.assign(scene(),{k,pg:s.gender,pid:k.id},ex||{});c.npc=npc(s);c.npc.n=k.n;c.npc.en=k.n.py;c.npc.zh=k.n.cn;if(inc.cctx)Object.assign(c,inc.cctx(s,c));runIncident(s,inc,c);(k.done=k.done||{})[id]=s.age;return true};
  for(const k of ks){const d=k.done||{};
    if(k.age===1&&!d.fk_grab&&go('fk_grab',k))return;
    if(k.age===6&&!d.fk_school&&go('fk_school',k))return;
    if(k.age===15&&!d.fk_dream&&chance(.7)&&go('fk_dream',k))return;
    if(k.age>=18&&k.age<=28&&!k.married&&!d.fk_match&&chance(.35)&&go('fk_match',k))return;
    if(k.married&&k.age>=20&&k.age<=40&&chance(.12)&&(s.people.filter(p=>p.rel==='grandchild').length<8)&&go('fk_grandkid',k))return;
    if(k.age>=4&&k.age<=20&&!d.fk_kidnap&&chance((living(s,'enemy').length?.05:.012)+(s.fame>=50?.02:0))&&go('fk_kidnap',k))return;
    if(k.age>=20&&!d.fk_fame&&k.lv>=Math.max(60,power(s)*.6)&&chance(.25)&&go('fk_fame',k))return}
  if(s.age>=62&&ks.some(k=>k.age>=25&&k.bond>=55)&&!s.flags.fkcare&&chance(.2)){s.flags.fkcare=1;go('fk_care',ks.filter(k=>k.age>=25).sort((a,b)=>b.bond-a.bond)[0])}
  else if(s.age>=55&&ks.filter(k=>k.age>=18).length>=2&&s.money>=300&&!s.flags.fkinh&&chance(.08)){s.flags.fkinh=1;go('fk_inherit',ks[0])}
  /* children grow in power by their road */
  ks.forEach(k=>{if(k.age>=6&&k.age<=40)k.lv+=Math.round((k.path==='sword'||k.sect?rint(0,3):rint(0,1))*((k.kid&&k.kid.root)||5)/6)})}})();

/* ---------- sworn siblings ---------- */
(()=>{const P=PACTS.find(a=>a.id==='sworn');if(!P)return;
  P.run=function(s,p){const third=living(s,['friend','acq','fellow']).filter(x=>x!==p&&x.bond>=60&&x.age>=14&&!x.temp);const c=Object.assign(scene(),{pid:p.id,p,third:third[0]||null});
    c.npc=npc(s);c.npc.n=p.n;c.npc.en=p.n.py;c.npc.zh=p.n.cn;runIncident(s,INC_BY.sb_oath,c)}})();
I({id:'sb_oath',only:1,noThread:1,noRipple:1,text:c=>T(`You and ${c.p.n.py} decide to become sworn siblings. How will you swear it?`,`你和${c.p.n.cn}决定结为异姓兄弟姐妹。怎么个结拜法？`),
 opts:[{l:T('Burn incense before heaven and earth','焚香对天地叩拜'),out:[{w:1,t:c=>T(`Three bows to heaven, three to earth, one to each other. ${c.p.n.py} is family now.`,`三拜天，三拜地，再对拜一拜。从此${c.p.n.cn}就是一家人了。`),c:'gold',fx:{happy:6,f:(s,c)=>swear(s,c.p)}}]},
  {l:T('A blood oath, cut palms pressed together','歃血为盟，割掌相握'),out:[{w:3,t:T('Blood oaths are not for show. Neither of you will forget this one.','血誓不是做样子的。这一回，谁也忘不掉。'),c:'gold',fx:{f:(s,c)=>{swear(s,c.p,1);c.p.blood=1}}},{w:1,t:T('The cut festers. The oath holds; the hand takes a month to heal.','伤口化了脓。誓言作数，手却养了一个月。'),c:'muted',fx:{health:-6,f:(s,c)=>{swear(s,c.p,1);c.p.blood=1}}}]},
  {l:c=>c.third?T(`Invite ${c.third.n.py} too, and swear as three`,`把${c.third.n.cn}也叫上，三人一起结拜`):T('Invite a third friend','再叫一个朋友'),if:(s,c)=>!!c.third,out:[{w:3,t:c=>T(`In a peach orchard, three of you kneel together. You are ranked by age: the eldest is the eldest from now on.`,`在一片桃林里，三人一同跪下，按年齿排了大小。从此长幼有序。`),c:'gold',fx:{fame:2,f:(s,c)=>{swear(s,c.p);swear(s,c.third)}}},{w:1,t:c=>T(`${c.third.n.py} backs out halfway through the oath. You finish it as two.`,`誓词念到一半，${c.third.n.cn}打了退堂鼓。最后只有你们俩结成了。`),c:'muted',fx:{f:(s,c)=>{swear(s,c.p);addBond(c.third,-8)}}}]}]});
function swear(s,p,blood){p.rel='sworn';addBond(p,blood?18:12);p.swAt=s.age;if(p.age===s.age)p.swOlder=chance(.5);
  const rk=relLabel(s,p);say(s,`From today ${p.n.py} is your ${rk.en.toLowerCase()}.`,`从今天起，${p.n.cn}就是你的${rk.zh}了。`,'gold');deed(s,`Swore brotherhood with ${p.n.py}`,`与${p.n.cn}义结金兰`)}
const swInc=(id,d)=>{d.id=id;d.only=1;d.noThread=1;d.noRipple=1;I(d)};
swInc('sb_call',{text:c=>T(`A rider brings word from ${c.p.n.py}, your sworn ${c.p.sex==='m'?'brother':'sister'}: "I am in trouble at ${c.place.en}. Come if you can." The oath says you come.`,`有人快马送来${c.p.n.cn}的口信："我在${c.place.zh}遇上了麻烦，能来就来。"誓言说，你得去。`),
 cctx:s=>({lv:PW(1.05,6)(s)}),
 opts:[{l:T('Ride at once','即刻动身'),fight:(s,c)=>({foe:{name:foeName(),lv:c.lv},stakes:'injury',title:T('For a sworn sibling','为了结义兄弟'),cause:T('a fight for a sworn sibling','为义兄弟出头')}),
   win:[{w:2,t:c=>T(`You arrive in time. ${c.p.n.py} says nothing; just grips your arm.`,`你赶到得正是时候。${c.p.n.cn}什么也没说，只是攥紧了你的胳膊。`),c:'gold',fx:{fame:2,f:(s,c)=>addBond(c.p,15)}}],
   lose:[{w:1,t:T('You are both beaten, together. It counts for something.','你们俩一起挨了打。可这也算数。'),c:'muted',fx:{f:(s,c)=>addBond(c.p,10)}}]},
  {l:T('Send money instead (60 taels)','改送银子（六十两）'),cost:60,out:[{w:1,t:T('The money helps. The absence is noticed.','钱是帮上了。人没到，对方也记下了。'),c:'muted',fx:{f:(s,c)=>addBond(c.p,-4)}},{w:1,t:T('It is enough. They write that they understand.','够用了。对方回信说能理解。'),c:'good',fx:{f:(s,c)=>addBond(c.p,2)}}]},
  {l:T('Do not go','不去'),out:[{w:1,t:T('Word gets around that you broke faith with your sworn kin.','江湖上传开了：说你背弃了结义之情。'),c:'bad',fx:{fame:-5,align:-3,f:(s,c)=>addBond(c.p,-30)}}]}]});
swInc('sb_godchild',{text:c=>T(`${c.p.n.py} has a newborn and asks you to be the child’s godparent.`,`${c.p.n.cn}添了孩子，请你做孩子的干${c.pg==='f'?'娘':'爹'}。`),
 opts:[{l:T('Accept, with a silver lock for the child','答应，给孩子送一把银锁'),cost:20,out:[{w:1,t:T('The child is named after you, a little.','孩子的名字里，带了你名字里的一个字。'),c:'gold',fx:{happy:5,f:(s,c)=>{addBond(c.p,8);s.people.push(mkPerson(s,{rel:'godchild',sur:c.p.n.sur,age:0,bond:75,lv:1}))}}}]},
  {l:T('Accept','答应'),out:[{w:1,t:T('A new small person who calls you by a special name.','多了一个小人儿，用一个特别的称呼叫你。'),c:'good',fx:{happy:4,f:(s,c)=>{addBond(c.p,5);s.people.push(mkPerson(s,{rel:'godchild',sur:c.p.n.sur,age:0,bond:65,lv:1}))}}}]}]});
swInc('sb_test',{text:c=>T(`${c.p.n.py} asks you to stand with ${kHe(c.p).him} against ${c.foe.en} — but ${c.foe.en} is in the right, and you know it.`,`${c.p.n.cn}要你帮着去对付${c.foe.zh}——可理在${c.foe.zh}那边，你心里清楚。`),
 cctx:s=>({foe:foeName()}),
 opts:[{l:T('Stand by your sworn sibling anyway','还是站在结义兄弟这边'),out:[{w:2,t:T('You do what the oath asks and not what is right. It sits badly.','你照誓言做了，没照道理做。心里不是滋味。'),c:'muted',fx:{align:-5,f:(s,c)=>addBond(c.p,10)}},{w:1,t:T('It goes wrong, and you both carry the blame.','事情办砸了，罪名你俩一起担。'),c:'bad',fx:{align:-4,fame:-3,f:(s,c)=>addBond(c.p,8)}}]},
  {l:T('Tell them they are wrong','直说对方错了'),out:[{w:s=>1+(s.t.heart||5)*.15,t:T('They are furious for a week, then come back and admit it.','对方气了一个礼拜，后来回来认了错。'),c:'good',fx:{align:3,f:(s,c)=>addBond(c.p,6)}},{w:1,t:T('"So that is what our oath is worth." They leave.','"原来咱们的誓言就值这些。"对方走了。'),c:'bad',fx:{align:3,f:(s,c)=>addBond(c.p,-20)}}]}]});
swInc('sb_reunion',{text:c=>T(`Years apart, and then ${c.p.n.py} is at your door, greyer and louder, with a jar of wine.`,`分别多年，${c.p.n.cn}忽然出现在你家门口，头发白了，嗓门大了，手里提着一坛酒。`),
 opts:[{l:T('Drink until dawn','喝到天亮'),out:[{w:3,t:T('Every old story, told again, better.','把所有的旧事又讲了一遍，讲得比当年还精彩。'),c:'gold',fx:{happy:8,f:(s,c)=>addBond(c.p,12)}},{w:1,t:T('You find you have little to say to each other now. You drink anyway.','你发现两人如今已没多少话可说了。酒还是喝了。'),c:'muted',fx:{happy:1,f:(s,c)=>addBond(c.p,2)}}]}]});
swInc('sb_break',{text:c=>T(`Between you and ${c.p.n.py} there has been nothing but bitterness for years. ${kHe(c.p).He} comes with a knife, not to fight, but to cut the hem of ${kHe(c.p).his} robe.`,`你和${c.p.n.cn}之间，这些年只剩下怨气。${c.p.n.cn}带着一把刀来了，不是来打架，是来割袍。`),
 opts:[{l:T('Let them cut it: the oath is over','由对方割：恩断义绝'),out:[{w:1,t:T('A strip of cloth on the ground, and nothing else between you.','地上一条布，你们之间再无别的。'),c:'bad',fx:{fame:-2,happy:-8,f:(s,c)=>{c.p.rel='enemy';c.p.bond=10}}}]},
  {l:T('Stop their hand and ask for one more talk','按住对方的手，求再谈一次'),out:[{w:s=>.6+(s.t.heart||5)*.12,t:T('You talk until the knife is put away. It is not what it was, but it is not over.','谈到对方把刀收了起来。回不到从前，可也没断。'),c:'good',fx:{f:(s,c)=>{c.p.bond=45}}},{w:1,t:T('They cut it anyway.','对方还是割了。'),c:'bad',fx:{happy:-8,f:(s,c)=>{c.p.rel='enemy';c.p.bond=5}}}]}]});
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.age<16||s.queue.length>2)return;const sw=living(s,'sworn').filter(p=>!p.temp);if(!sw.length||!chance(.18))return;
  const p=pick(sw);const c=Object.assign(scene(),{p,pid:p.id,pg:s.gender});c.npc=npc(s);c.npc.n=p.n;c.npc.en=p.n.py;c.npc.zh=p.n.cn;
  const id=p.bond<20?'sb_break':wpick([['sb_call',3],['sb_godchild',p.age<=45&&!(p.done||{}).sb_godchild?1.5:0],['sb_test',1.2],['sb_reunion',s.age-(p.swAt||s.age)>=10?1.5:0]],x=>x[1])[0];
  const inc=INC_BY[id];if(!inc)return;if(inc.cctx)Object.assign(c,inc.cctx(s,c));runIncident(s,inc,c);(p.done=p.done||{})[id]=s.age}})();
/* a sworn sibling killed must be avenged */
QHINT.sb_avenge=T('Your sworn sibling was murdered. Find the killer. (Next: roam the jianghu.)','结义兄弟遭人杀害，凶手还在世上。（下一步：去「闯荡江湖」）');
if(typeof QGO!=='undefined')QGO.set(QHINT.sb_avenge,{k:'sb_avenge',tags:['wander']});
(()=>{const d0=onDeath;onDeath=function(s,p){d0(s,p);if(p.rel==='sworn'&&s.alive&&s.age>=16&&!s.flags.sb_avenge&&chance(.35)){const f=foeName();s.swAv={who:T(p.n.py,p.n.cn),foe:f,lv:Math.max(12,Math.round(Math.max(p.lv,power(s))*(1+R()*.25)))};s.flags.sb_avenge=s.age;p.cause=T(`murdered by ${f.en}`,`被${f.zh}所杀`);
  say(s,`It was no accident: ${p.n.py} was murdered, by ${f.en}. You knelt at the grave and swore it.`,`这不是意外：${p.n.cn}是被${f.zh}害死的。你在坟前跪下，立了誓。`,'bad')}}})();
I({id:'sb_avenge_end',need:'sb_avenge',age:[16,95],w:6,once:1,tags:['wander'],when:s=>!!s.swAv&&s.age-s.flags.sb_avenge>=1,ctx:s=>{const c=scene();c.av=s.swAv;return c},
 text:c=>T(`At ${c.place.en} you find ${c.av.foe.en}, the one who killed ${c.av.who.en}.`,`在${c.place.zh}，你找到了害死${c.av.who.zh}的${c.av.foe.zh}。`),
 opts:[{l:T('Fight for your sworn sibling','为义兄弟一战'),fight:(s,c)=>({foe:{name:c.av.foe,lv:c.av.lv,fixed:1},stakes:'death',title:T('Vengeance','报仇'),cause:T('a vengeance duel','复仇之战')}),
   win:[{t:c=>T(`It is done. You pour a cup of wine on ${c.av.who.en}’s grave and sit there until dark.`,`了结了。你在${c.av.who.zh}坟前洒了一杯酒，一直坐到天黑。`),c:'gold',fx:{fame:6,unflag:'sb_avenge',deed:T('Avenged a sworn sibling','为结义兄弟报了血仇'),f:s=>{delete s.swAv}}}],
   lose:[{t:T('You are beaten, and the killer walks away.','你败了，凶手扬长而去。'),c:'bad',fx:{happy:-8}}]},
  {l:T('Hand them to the magistrate','押送官府'),out:[{w:s=>1+s.fame/40,t:T('The magistrate hangs the killer. It is slower than a sword, and as final.','县官判了绞刑。比一剑慢些，结局一样。'),c:'good',fx:{fame:3,align:4,unflag:'sb_avenge',f:s=>{delete s.swAv}}},{w:1,t:T('The killer bribes their way out.','凶手花钱脱了身。'),c:'bad',fx:{happy:-6}}]}]});

/* ---------- live on as your heir ---------- */
function heirs(s){return s.people.filter(p=>p.rel==='child'&&p.alive&&p.age>=14)}
function heirLife(prev,pid){const k=person(prev,pid);if(!k)return null;
  START_OPT={g:k.sex,region:prev.region};let s;try{s=newLife()}finally{START_OPT=null}
  s.name=k.n.py;s.cn=k.n.cn;s.sur=k.n.sur;s.gender=k.sex;s.family=prev.family;s.city=prev.city;s.home=prev.region;s.trail=[prev.region];
  const kt=k.kid||{};['root','wit','luck','heart'].forEach(x=>{s.t[x]=kt[x]||clamp(Math.round(((prev.t[x]||5)+rollTalent())/2),1,10)});
  s.people=[];const par=mkPerson(s,{rel:prev.gender==='m'?'father':'mother',sex:prev.gender,name:{cn:prev.cn,py:prev.name,sur:prev.sur},age:prev.age,bond:Math.max(40,k.bond),lv:power(prev)});par.alive=false;par.diedAt=k.age;par.cause=prev.cause;s.people.push(par);
  const sp=prev.people.find(p=>p.rel==='spouse'&&p.alive);if(sp){const o=mkPerson(s,{rel:sp.sex==='m'?'father':'mother',sex:sp.sex,name:sp.n,age:sp.age,bond:70,lv:sp.lv});s.people.push(o)}
  prev.people.filter(p=>p.rel==='child'&&p.alive&&p.id!==k.id).forEach(o=>s.people.push(mkPerson(s,{rel:'sibling',sex:o.sex,name:o.n,age:o.age,bond:o.bond,lv:o.lv})));
  prev.people.filter(p=>['enemy'].includes(p.rel)&&p.alive).slice(0,2).forEach(e=>s.people.push(mkPerson(s,{rel:'enemy',sex:e.sex,name:e.n,age:e.age,bond:10,lv:e.lv})));
  const inh=Math.round(prev.money*.7);s.money=inh;s.fame=Math.round(prev.fame*.3+(k.lv>=60?10:0));s.align=clamp(Math.round(prev.align*.3),-100,100);
  s.items=prev.items.filter(it=>{const d=itemDef(it.id);return d&&['house','biz','weapon','armor','mount','charm','anqi'].includes(d.cat)}).map(it=>Object.assign({},it,{eq:it.eq}));
  s.skill=Math.round(k.lv*.75);s.qi=Math.round(k.lv*.5);const fam=(prev.arts||[]).slice().sort((a,b)=>(a.tier||0)-(b.tier||0))[0];if(fam&&k.age>=10)learn(s,fam);
  if(typeof r9Of==='function')s.brk=Math.max(3,r9Of(rawPower(s)));if(typeof attrW==='function')attrW(s);
  s.sst={};Object.keys(prev.sst||{}).forEach(x=>s.sst[x]=Math.round(prev.sst[x]*.5));
  s.gen=(prev.gen||1)+1;s.heirOf={cn:prev.cn,py:prev.name,nick:prev.nick||null};s.hero=prev.fame>=50?{pid:par.id,ep:prev.nick?T(prev.nick.en,prev.nick.zh):T('the hero','大侠')}:null;
  s.age=k.age-1;s.log=[];s.queue=[];s.chose=true;rollStock(s);
  if(k.sect&&SECTS[k.sect]&&sectTakes(s,k.sect)){joinSect(s,k.sect);s.joinedAt=Math.min(k.age,10)}
  ageUp(s);const E=s.log[s.log.length-1];
  E.lines.unshift({t:T(`${prev.name} is dead. You, ${s.name}, carry the family on: you inherit ${inh} taels and what was left in the house. This is the family’s generation ${s.gen}.`,`${prev.cn}去世了。家业由你${s.cn}接下：继承银两${inh}两，以及家中的旧物。这是这个家的第${cnNum(s.gen)}代。`),c:'gold'});
  return s}
