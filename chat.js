/* 江湖一生 · how good a start you drew, and conversations that depend on who you are talking to */
'use strict';

/* ---------- the start you drew: background, talent, and where that puts you among everyone born that year ---------- */
function startScore(s){const f=FAMILIES.find(x=>x.id===s.family)||{rich:1};const t=s.t;
  return f.rich*9+(f.martial||0)*4+(t.root+t.wit+t.luck+t.heart)*1.6+(s.looks||50)/12+(s.smarts||50)/12}
let START_POOL=null;
function startPct(s){
  if(!START_POOL){START_POOL=[];for(let i=0;i<1500;i++){const x=newLife();START_POOL.push(startScore(x))}START_POOL.sort((a,b)=>a-b)}
  const v=startScore(s);let lo=0;while(lo<START_POOL.length&&START_POOL[lo]<v)lo++;return Math.round(lo/START_POOL.length*100)}
const BG_LBL=[T('destitute','赤贫'),T('humble','寒微'),T('comfortable','小康'),T('well-off','富足'),T('wealthy','富足'),T('illustrious','显赫')];
function talentLbl(s){const n=s.t.root+s.t.wit+s.t.luck+s.t.heart;return n<16?T('ordinary','平庸'):n<22?T('fair','中等'):n<28?T('gifted','上佳'):T('extraordinary','天纵奇才')}
function startHTML(s){
  const f=FAMILIES.find(x=>x.id===s.family)||{rich:1},pct=startPct(s),bg=BG_LBL[f.rich]||BG_LBL[1],tl=talentLbl(s);
  const hint=pct>=75?T('Heaven has been generous. Try not to waste it.','老天待你不薄，别糟蹋了。'):pct>=40?T('A decent hand. What you make of it is up to you.','一手不错的牌，怎么打看你自己。'):pct>=15?T('A hard start. Many great heroes began lower.','起点不高。许多大侠出身更低。'):T('About as hard as a start gets. Every step up will be your own.','开局艰难至极。往后每一步，都是你自己挣的。');
  return zh()?`<p class="odds">出身<b>${bg.zh}</b> · 天资<b>${tl.zh}</b> · 开局胜过同年出生的 <b>${pct}%</b> 的人。<br><span class="muted">${hint.zh}</span></p>`
   :`<p class="odds">Background <b>${bg.en}</b> · talent <b>${tl.en}</b> · a better start than <b>${pct}%</b> of those born that year.<br><span class="muted">${hint.en}</span></p>`;
}

/* ---------- conversations ---------- */
const HE=p=>p.sex==='f'?['She','她','her','hers']:['He','他','him','his'];
const CHAT={
 father:[p=>['He asks how your training is going and listens to the whole answer.','他问你功夫练得怎样，从头到尾听你说完。'],p=>['He tells you about a fight he lost when he was young, and what it taught him.','他讲起年轻时输掉的一场架，还有那次学到的东西。'],p=>['He tells you about the year the river froze and he walked across it to market.','他跟你讲那年河面结冰，他踩着冰走去赶集的事。'],p=>['He asks what you plan to do with your life, then answers for you.','他问你这辈子打算干什么，然后自己替你答了。'],p=>['He shows you how to sharpen a blade properly. He is very particular about it.','他教你怎么把刀磨好，讲究得很。'],p=>['You talk about the harvest. He worries about money and pretends not to.','你们聊收成。他为钱发愁，又装作不在意。'],p=>['He tells a story about your grandfather that you have never heard before.','他讲了一个你从没听过的祖父的故事。'],p=>['You argue about nothing, and both enjoy it.','你们为鸡毛蒜皮吵了一架，两个人都挺开心。']],
 mother:[p=>['She asks about your friends, and remembers all their names.','她问起你的朋友，每个人的名字都记得。'],p=>['She tells you not to fight. Then she tells you how to win if you must.','她叫你别跟人打架，又教你非打不可时怎么打赢。'],p=>['She mends your clothes while you talk and finds three more holes.','你们说话时她给你补衣服，又找出三个破洞。'],p=>['She asks if you are eating properly. You lie.','她问你吃得好不好，你撒了谎。'],p=>['She tells you which neighbour’s child is getting married, and looks at you meaningfully.','她说起邻居家谁要成亲了，然后意味深长地看着你。'],p=>['She teaches you how to make her dumplings. You get it wrong on purpose so she keeps teaching.','她教你包她拿手的饺子。你故意包错，好让她多教一会儿。'],p=>['She tells you about the night you were born.','她跟你讲你出生那晚的事。'],p=>['She hums an old song while she works. You realise you know all the words.','她边干活边哼一首老歌，你发现自己每个字都会唱。']],
 sibling:[p=>['You cover for each other about something your parents must never know.','你们互相打掩护，有件事绝不能让爹娘知道。'],p=>['You compare who your mother loves more. You both lose.','你们比谁更得娘的疼，结果谁都没赢。'],p=>['You bicker over who ate the last rice cake.','你们为谁吃了最后一块年糕吵起来。'],p=>['You trade secrets about your parents.','你们互相透露爹娘的小秘密。'],p=>['You make up a game with rules only the two of you understand.','你们编了个只有你俩懂规矩的游戏。'],p=>['You talk about what you will both be when you grow up.','你们聊长大以后各自要当什么。'],p=>['They borrow money and promise to pay it back. They will not.','对方借了钱，说一定还。不会还的。'],p=>['You sit on the roof together and count boats on the river.','你们一起坐在屋顶上，数河上的船。']],
 spouse:[p=>['You talk late into the night about nothing in particular.','你们聊到深夜，聊的也没什么要紧事。'],p=>['You plan a trip you will probably never take.','你们计划了一趟多半成不了行的远游。'],p=>['You argue about money, then about who started arguing.','你们为钱吵，又为谁先吵起来的吵。'],p=>['They tell you about their day. It is funnier than yours.','对方讲今天的事，比你的有意思多了。'],p=>['You sit together in the courtyard and watch the moon come up.','你们并肩坐在院里，看月亮升起来。'],p=>['They notice something is wrong before you say a word.','你还没开口，对方就看出你有心事。']],
 child:[p=>['They ask why the sky is blue. You make something up.','孩子问天为什么是蓝的，你胡编了一个答案。'],p=>['They show you a drawing of you with a very large sword.','孩子给你看一幅画：你拿着一把特别大的剑。'],p=>['You tell them a story about your youth. They do not believe it.','你给孩子讲年轻时的事，孩子不信。'],p=>['They tell you what they want to be. It changes every week.','孩子说长大想当什么，每个礼拜都不一样。'],p=>['You teach them to tie a knot your father taught you.','你教孩子打一个当年父亲教你的绳结。'],p=>['They complain about their tutor. You secretly agree.','孩子抱怨先生，你心里暗暗同意。']],
 master:[p=>['Your master talks about the founder of your style, and the mistakes he made.','师父讲起本门开山祖师，还有他犯过的错。'],p=>['You ask about a move you cannot get right. Your master answers with a question.','你问一招总练不对的功夫，师父用一个问题回答你。'],p=>['Your master is in a rare good mood and tells you about their own master.','师父难得高兴，讲起了自己的师父。'],p=>['You drink tea in silence. It is somehow a lesson.','你们默默喝茶。不知怎的，这也算一课。'],p=>['Your master warns you about a rival school. The warning is very specific.','师父提醒你提防某家门派，说得非常具体。']],
 lover:[p=>['You walk along the river until the lanterns go out.','你们沿着河边一直走，走到灯笼都灭了。'],p=>['You exchange small gifts and pretend they were cheap.','你们交换了小礼物，都装作不值钱。'],p=>['They laugh at your jokes, even the bad ones.','你讲的笑话，连冷的那些对方都笑了。'],p=>['You talk about the future, carefully.','你们小心翼翼地聊起将来。']],
 friend:[p=>['You share a jar of wine and too many opinions.','你们分了一坛酒，还有一大堆高见。'],p=>['They tell you a rumour about a hidden manual in the western hills.','对方跟你说西山里藏着一本秘籍的传闻。'],p=>['You go fishing and catch nothing. It is a good day.','你们去钓鱼，一条也没钓到。日子挺好。'],p=>['They complain about their work. You complain about yours. Both feel better.','对方抱怨差事，你也抱怨你的，两人都舒坦了。'],p=>['You play a game of xiangqi that lasts until dark.','你们下了一盘象棋，一直下到天黑。'],p=>['They ask your advice about a girl, or a debt, or both.','对方请你出主意，为一个姑娘，或一笔债，或两样都有。'],p=>['You reminisce about the first time you met.','你们回忆起第一次见面的情形。']],
 old:[p=>[`${HE(p)[0]} tells you the same story as last time. You let ${HE(p)[2]}.`,`${HE(p)[1]}讲的还是上回那个故事，你由着${HE(p)[1]}讲。`],p=>[`${HE(p)[0]} talks about friends who are gone.`,`${HE(p)[1]}说起那些已经不在的老朋友。`],p=>[`${HE(p)[0]} gives you advice you will only understand in twenty years.`,`${HE(p)[1]}给了你一句要二十年后才懂的忠告。`]],
 kid:[p=>['You play at being heroes of the jianghu with sticks for swords.','你们拿树枝当剑，扮江湖大侠。'],p=>['You hunt for crickets together.','你们一起去捉蛐蛐。'],p=>['You whisper about the strange old man at the end of the street.','你们窃窃私语，说街尾那个古怪老头。'],p=>['You trade marbles and swear eternal friendship.','你们交换弹珠，发誓做一辈子的朋友。']],
 any:[p=>['You talk about the weather and the price of rice.','你们聊了天气和米价。'],p=>['You trade stories late into the night.','你们聊到深夜。'],p=>['You laugh about something stupid from years ago.','你们笑起多年前的一件蠢事。'],p=>[`${HE(p)[0]} tells you a secret and swears you to silence.`,`${HE(p)[1]}告诉你一个秘密，要你发誓保密。`],p=>['You talk about the news from the capital, most of it wrong.','你们聊京城传来的消息，多半是讹传。'],p=>['You compare scars and the stories behind them.','你们比各自身上的伤疤，还有伤疤背后的故事。'],p=>['You walk to the market together and buy nothing.','你们一起逛集市，什么也没买。'],p=>[`${HE(p)[0]} asks about your family. You ask about ${HE(p)[3]}.`,`${HE(p)[1]}问起你家里的事，你也问起${HE(p)[1]}家里的事。`]]
};
/* a few conversations change something small */
const CHAT_FX=[
 {if:(s,p)=>p.rel==='master',w:.25,run:(s,p)=>{s.skill+=.6;say(s,'Something your master said makes a move finally click (technique +0.6).','师父一句话，让你终于想通了一招（外功+0.6）。','good')}},
 {if:(s,p)=>['father','mother'].includes(p.rel)&&s.age<16,w:.15,run:(s,p)=>{s.smarts=clamp(s.smarts+2,0,100);say(s,'You learn something you did not expect to (smarts +2).','你学到了意想不到的东西（学识+2）。','good')}},
 {if:(s,p)=>['friend','sworn'].includes(p.rel)&&s.age>=14,w:.12,run:(s,p)=>{const i=pickIncident(s,'wander');if(i){say(s,'They tell you about something they heard on the road. You go and see.','对方说起路上听来的一件事，你决定去看看。','muted');runIncident(s,i)}}},
 {if:(s,p)=>p.rel==='spouse'&&s.health<s.maxHealth*.6,w:.4,run:(s,p)=>{heal(s,6);say(s,'They make you rest and cook you soup (health +6).','对方逼你歇着，还给你炖了汤（气血+6）。','good')}}
];
(()=>{const C=PACTS.find(a=>a.id==='chat');if(!C)return;
 C.run=(s,p)=>{p.talked=s.age;
  /* a real conversation when there is something to talk about (talk.js); the old one-liners for small children */
  if(typeof talkRun==='function'&&talkRun(s,p)!==false){const fx=CHAT_FX.filter(e=>e.if(s,p));for(const e of fx)if(chance(e.w)){e.run(s,p);break}return}
  addBond(p,rint(2,7));happy(s,1);
  const g=s.age<13&&p.age<16?'kid':CHAT[p.rel]?p.rel:['sworn'].includes(p.rel)?'friend':p.age>=65?'old':'any';
  const FAM=['father','mother','sibling','spouse','child'];const pool=CHAT[g].concat(['friend','lover','master'].includes(g)?CHAT.any.slice(4,7):[]).concat(p.age>=65&&g!=='old'&&g!=='kid'?CHAT.old:[]);
  s.chatSeen=s.chatSeen||[];const fresh=pool.map((f,i)=>({f,k:g+i})).filter(x=>!s.chatSeen.includes(x.k));const x=pick(fresh.length?fresh:pool.map((f,i)=>({f,k:g+i})));
  s.chatSeen.push(x.k);if(s.chatSeen.length>14)s.chatSeen.shift();
  const l=x.f(p);say(s,l[0],l[1]);
  const fx=CHAT_FX.filter(e=>e.if(s,p));for(const e of fx)if(chance(e.w)){e.run(s,p);break}}})();
