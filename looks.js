/* 江湖一生 · looks, yours and everyone else's.
   Yours (s.looks, 0–100) already rise and fall with growing up, age, scars and illness. Here: clothes and ornaments that
   lift them while you own them (each kind counts once), a scar-fading ointment that gives back part of what scars took,
   a grooming activity, and scenes where looks cut both ways. Other people's looks (fixed at first meeting) now fade with
   age, and fighters can come home scarred. */
'use strict';
/* ---------- other people: looks worked out once, then kept, aged and scarred ---------- */
function looksOf(p){if(p.looks==null){let h=7;for(const ch of String((p.n&&p.n.cn)||'')+p.id)h=(h*31+ch.charCodeAt(0))>>>0;p.looks=Math.round(((h%100)+((h>>>8)%100))/2);
    if(p.age>40)p.looks=Math.max(0,p.looks-Math.round((p.age-40)*.4))}return p.looks}
function looksLabel(p){const v=looksOf(p),f=p.sex==='f';
  const b=v>=85?(f?T('Stunning','倾城之貌'):T('Strikingly handsome','俊美非凡')):v>=68?(f?T('Lovely','容貌秀丽'):T('Handsome','相貌英俊')):v>=40?T('Pleasant-looking','相貌端正'):v>=20?T('Plain','相貌平平'):T('Homely','其貌不扬');
  return p.scar?T(`${b.en}, scarred`,`${b.zh}，带着疤`):b}
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive)return;
  (s.people||[]).forEach(p=>{if(!p.alive)return;const v=looksOf(p);
    if(p.age>40&&chance(.5))p.looks=Math.max(0,v-rint(0,2));
    if(!p.scar&&p.lv>=25&&p.age>=18&&['friend','sworn','rival','fellow','master','spouse','lover','enemy','nemesis','disciple'].includes(p.rel)&&chance(.012)){p.scar=1;p.looks=Math.max(0,looksOf(p)-rint(4,10));
      if(['friend','sworn','spouse','lover','disciple'].includes(p.rel))say(s,`${p.n.py} comes back from a fight with a scar across the face, and laughs about it more than you would.`,`${p.n.cn}打了一架回来，脸上多了一道疤，自己倒比你还笑得开。`,'muted')}})}})();

/* ---------- your own scars: what fights and accidents took, a balm can partly give back ---------- */
(()=>{const a0=applyFx;applyFx=function(s,e,c){const before=s&&s.looks;const r=a0.apply(this,arguments);
  if(s&&e&&e.looks!=null&&before!=null&&s.looks<before&&s.age>=6)s.scarLoss=(s.scarLoss||0)+(before-s.looks);return r}})();

/* ---------- clothes and ornaments: worn well, they lift your looks while you own them ---------- */
Object.assign(ITEMS,{
 cottongown:{cat:'attire',n:T('Clean Cotton Gown','青布长衫'),price:20,lk:1,desc:T('Plain, well cut, always clean. It is surprising how much that does.','料子普通，剪裁合身，洗得干净。这点讲究，效果出奇地好。')},
 silkfan:{cat:'attire',n:T('Painted Folding Fan','描金折扇'),price:45,lk:1,desc:T('Something to do with your hands while you think. Scholars and dandies alike.','想事情的时候，手里总算有了着落。书生和公子哥都爱。')},
 brocade:{cat:'attire',n:T('Brocade Robe','锦缎衣裳'),price:180,lk:3,desc:T('Rich colours and fine embroidery. People assume you are someone.','颜色富丽，绣工精细。旁人一看，都当你是个人物。')},
 jadepin:{cat:'attire',n:T('Jade Hairpin','白玉发簪'),price:130,lk:2,desc:T('A single pin of white jade holding your hair. Quiet, and expensive.','一支白玉簪子挽住头发。不张扬，但贵。')},
 pearlset:{cat:'attire',n:T('String of Pearls','南珠串'),price:900,lk:4,rare:.4,desc:T('Pearls from the southern sea, all the same size. Heads turn, and so do thieves.','南海的珠子，颗颗一般大。路人回头，贼也回头。')},
 scarbalm:{cat:'pill',n:T('Scar-Fading Balm','祛疤膏'),price:320,rare:.5,use:{balm:1},desc:T('A jade-green paste from a palace physician’s family. Gives back some of what scars and pockmarks have taken from your looks.','御医世家传出来的碧色药膏。能把伤疤和麻子夺走的容貌，找回一部分。')}});
MARKET.push('cottongown','silkfan','brocade','jadepin');RARE.push('pearlset','scarbalm');
/* buying one lifts your looks (each kind counts once); selling it takes that back */
(()=>{const b0=buy;buy=function(s,id){const n=s.items.length;const r=b0.apply(this,arguments);const d=itemDef(id);
  if(r===true&&d&&d.cat==='attire'&&s.items.length>n){s.attireGot=s.attireGot||{};if(!s.attireGot[id]){const it=s.items[s.items.length-1];it.lk=d.lk;s.attireGot[id]=1;s.looks=clamp(s.looks+d.lk,0,100);say(s,`You look better in it. (Looks +${d.lk})`,`穿戴上了，人也精神了几分。（容貌+${d.lk}）`,'good')}}
  return r}})();
(()=>{const s0=sell;sell=function(s,idx){const it=s.items[idx];const lk=it&&it.lk;const r=s0.apply(this,arguments);if(lk){s.looks=clamp(s.looks-lk,0,100);if(s.attireGot&&it)delete s.attireGot[it.id]}return r}})();
/* the balm */
(()=>{const u0=useItem;useItem=function(s,idx){const it=s.items[idx];const d=it&&itemDef(it.id);if(!d||!d.use||!d.use.balm)return u0.apply(this,arguments);
  s.items.splice(idx,1);const lost=s.scarLoss||0;
  if(lost<=0){say(s,'You rub it in faithfully for a month. Your skin is very soft. Nothing else changes; there was nothing to fade.','你认认真真抹了一个月。皮肤滑了不少，别的没什么变化：本来也没有疤可去。','muted');after(s);return}
  const g=Math.min(lost,rint(3,7));s.scarLoss=lost-g;s.looks=clamp(s.looks+g,0,100);
  say(s,`A month of the balm, and the worst of the marks have faded. (Looks +${g})`,`抹了一个月，最显眼的疤痕淡了下去。（容貌+${g}）`,'good');after(s)}})();

/* ---------- grooming: a little silver, kept up, keeps you looking your best ---------- */
addAct({id:'groom',cat:'health',n:T('Look after your appearance','打扮养颜'),d:T('15 taels. Barber, bathhouse, a tailor’s fitting. A small lift; after forty, it slows the years.','十五两。剃头、泡澡、量体裁衣。容貌稍有起色；过了四十，还能让岁月慢一点。'),
 ok:s=>s.age<14?needAge(s,14):s.money<15?T('Needs 15 taels','需十五两'):true,
 run(s){pay(s,-15);const cap=s.age>40?62:80;let g=s.looks>=cap?(chance(.25)?1:0):rint(1,2);if(s.age>38)s.groomAt=s.age;
   s.looks=clamp(s.looks+g,0,100);happy(s,3);
   const L=pick([['A shave, a long bath and a new collar. You catch yourself in a shop window and do not mind it.','剃了头，泡了个长澡，换了新领子。路过店铺的窗子，你瞥见自己，竟不讨厌。'],['The tailor pins and tuts for an hour. The result is worth the tutting.','裁缝别了一小时针，啧了一小时嘴。做出来的衣裳，值得那些啧啧声。'],['Cucumber on the eyes and a woman who talks the whole time. You come out glowing and knowing everyone’s secrets.','眼睛上敷着黄瓜片，旁边的大娘说个不停。出来时你容光焕发，还知道了全城的秘密。']]);
   say(s,L[0]+(g?` (Looks +${g})`:''),L[1]+(g?`（容貌+${g}）`:''),g?'good':'muted')}});
/* the years are kinder to someone who keeps grooming: half of this year's decline comes back */
(()=>{const y=yearly;yearly=function(s){const b=s.looks;y(s);if(s.alive&&s.age>38&&s.groomAt!=null&&s.age-s.groomAt<=1&&s.looks<b)s.looks+=Math.ceil((b-s.looks)/2)}})();

/* ---------- looks cut both ways ---------- */
const LKI=d=>{d.cd=d.cd??6;I(d)};
LKI({id:'lk_admirer',age:[16,50],w:1.2,when:s=>s.looks>=70,ctx:s=>{const c=scene();c.npc=npc(s,{sex:s.gender==='m'?'f':'m',age:clamp(s.age+rint(-6,4),16,60)});return c},
 text:c=>T(`A note, folded small, left on your table at the inn: ${c.npc.en} has been watching you for a week and would like to meet you by the willow at dusk.`,`客栈桌上压着一张折得小小的字条：${c.npc.zh}已经偷偷看了你一个礼拜，想约你黄昏时在柳树下见一面。`),
 opts:[{l:T('Go to the willow','去柳树下'),out:[{w:2,t:c=>T(`${c.npc.en} is shy, funny, and talks for two hours. You agree to meet again.`,`${c.npc.zh}又害羞又有趣，一聊就是两个时辰。你们约好了再见。`),c:'good',fx:{meet:'acq',bond:60,happy:4}},{w:1,t:c=>T(`${c.npc.en} turns out to want a loan more than a sweetheart.`,`原来${c.npc.zh}想要的是借钱，不是心上人。`),c:'muted',fx:{happy:-2}}]},
  {l:T('Send a kind refusal','回一张字条，婉言谢绝'),out:[{t:T('You write it three times before it sounds kind enough.','你写了三遍，才觉得够委婉。'),c:'muted',fx:{align:1}}]},
  {l:T('Ignore it','不理'),out:[{t:T('The willow waits alone.','柳树下空等了一场。'),c:'muted',fx:{}}]}]});
LKI({id:'lk_jealous',age:[18,60],w:1,when:s=>s.looks>=72&&!!spouseOf(s),ctx:s=>{const c=scene();c.p=spouseOf(s);c.pid=c.p.id;c.npc=npc(s);return c},
 text:c=>T(`${c.p.n.py} has heard, from three different neighbours, about the people who keep smiling at you in the market.`,`${c.p.n.cn}从三个不同的邻居嘴里，听说了集市上总有人冲你笑的事。`),
 opts:[{l:T('Laugh and take them to market with you','笑着拉上对方一起去赶集'),out:[{w:2,t:T('The smiling stops when they see who you are with. Your spouse is very pleased with this.','人家一看你身边站着谁，就都不笑了。你的另一半对此十分满意。'),c:'good',fx:{bond:6,happy:3}},{w:1,t:T('Someone smiles anyway. It is a long walk home.','还是有人冲你笑。回家的路走得格外漫长。'),c:'bad',fx:{bond:-6}}]},
  {l:T('Promise to keep your eyes down','保证以后目不斜视'),out:[{t:T('A promise is a promise. The market becomes very boring.','说到做到。赶集从此变得非常无聊。'),c:'muted',fx:{bond:3,happy:-2}}]}]});
LKI({id:'lk_gossip',age:[16,60],w:.8,when:s=>s.looks>=75,text:()=>T('A rumour goes round that you got where you are on your face alone.','有人在背后嚼舌根，说你能有今天，全凭一张脸。'),
 opts:[{l:T('Prove them wrong','用本事堵他们的嘴'),out:[{w:s=>.5+power(s)/120+s.smarts/120,t:T('A year of hard work later, nobody says it within your hearing.','苦干了一年，再没人敢当着你的面这么说。'),c:'good',fx:{fame:3,skill:1}},{w:1,t:T('You work hard. They keep talking. Such is the world.','你埋头苦干，他们照说不误。世道如此。'),c:'muted',fx:{happy:-2}}]},
  {l:T('Shrug: a face is not nothing','一笑了之：脸好看也不是什么罪过'),out:[{t:T('Your good humour wins over half of them.','你这份豁达，倒收服了一半的人。'),c:'good',fx:{happy:2,fame:1}}]}]});
LKI({id:'lk_mock',age:[12,70],w:1,when:s=>s.looks<=28,ctx:s=>{const c=scene();c.npc=npc(s,{age:rint(16,30)});return c},
 text:c=>T(`A young dandy, ${c.npc.en}, makes a joke about your face loud enough for the whole street.`,`一个公子哥${c.npc.zh}拿你的长相开玩笑，嗓门大得整条街都听见了。`),
 opts:[{l:T('Laugh louder than he does','笑得比他还大声'),out:[{w:s=>.6+s.t.heart*.12,t:T('Your joke about his hat is better. The street is on your side by the end.','你拿他的帽子回敬了一句，比他的笑话好笑。到最后，整条街都站在你这边。'),c:'good',fx:{fame:2,happy:4}},{w:1,t:T('Nobody laughs at all. You go home.','谁也没笑。你回家了。'),c:'muted',fx:{happy:-3}}]},
  {l:T('Teach him some manners','教教他什么叫礼数'),fight:(s,c)=>({foe:{name:T(c.npc.en,c.npc.zh),lv:Math.max(3,Math.round(power(s)*.6)),fixed:1},stakes:'spar',title:T('Manners','礼数'),cause:T('a street quarrel','街头口角')}),
   win:[{t:c=>T(`${c.npc.en} apologises, rather quickly.`,`${c.npc.zh}赔了不是，赔得挺快。`),c:'good',fx:{fame:1}}],lose:[{t:T('He is better with his fists than with jokes.','他拳头比笑话强。'),c:'bad',fx:{happy:-4}}]},
  {l:T('Walk on','不理他，走开'),out:[{t:T('By evening you have forgotten him. He has not forgotten that you did not care.','到傍晚你就把他忘了。他倒一直记着你根本不在乎。'),c:'muted',fx:{align:1}}]}]});
LKI({id:'lk_portrait',age:[18,45],w:.6,once:1,when:s=>s.looks>=80,ctx:s=>{const c=scene();c.npc=npc(s,{occ:6,age:rint(30,60)});return c},
 text:(c,s)=>T(`A painter, ${c.npc.en}, begs to paint you for a set of famous ${s.gender==='f'?'beauties':'gentlemen'} of the age.`,`画师${c.npc.zh}求你给他当模特，要画进一套《当世${s.gender==='f'?'名姝':'名士'}图》里。`),
 opts:[{l:T('Sit for it','答应'),out:[{t:T('The scroll sells to a rich collector. For years strangers will know your face before your name.','这幅画卖给了一位有钱的藏家。此后多年，陌生人认得你的脸，比认得你的名字还早。'),c:'gold',fx:{fame:5,happy:4}}]},
  {l:T('Decline','婉拒'),out:[{t:T('He sketches you from memory anyway. It is not very good.','他还是凭记忆画了一张。画得不怎么样。'),c:'muted',fx:{}}]}]});
