/* 江湖一生 · the market: every item says what it is, and buying takes two taps (look first, then buy) */
'use strict';
/* descriptions for everything that had only numbers */
const ITEM_DESC={
 leather:T('Boiled leather over the chest and shoulders. Turns a glancing blade, not a direct one.','熟牛皮护住胸口和双肩。挡得住擦过来的刀，挡不住捅过来的。'),
 rattan:T('Rattan soaked in oil and dried for a year. Light, springy, and surprisingly hard to cut.','藤条浸油晒足一年编成。轻、有弹性，出奇地难砍透。'),
 mirror:T('A polished bronze plate worn over the heart. Cheap, heavy, and it has saved more lives than anyone admits.','一块磨亮的铜板，挂在心口。便宜、沉，救下的命比谁肯承认的都多。'),
 chain:T('Thousands of iron rings. Heavy enough that you feel it at the end of the day, strong enough that you are still alive at the end of it.','成千上万个铁环串成。穿一天下来肩膀发沉，可一天下来人还活着。'),
 hedgehog:T('Gold thread woven with fine steel wire, worn under the clothes. Nobody knows you have it on until a blade slides off.','金线掺着细钢丝织成，穿在衣服里头。直到刀刃滑开之前，谁也不知道你穿着它。'),
 goldsilk:T('Said to have been woven for a prince who never needed it. Almost nothing gets through.','据说是给一位王爷织的，他一辈子没用上。几乎没有什么能穿透它。'),
 donkey:T('Slow, stubborn and cheap to feed. Makes travelling a little easier, and will sometimes carry you out of a lost fight.','慢、倔、吃得少。出门省点力气，打输了偶尔还能驮着你跑掉。'),
 horse:T('A sound yellow horse. Travel is easier, and in a fight to the death there is a fair chance of riding away from it.','一匹结实的黄骠马。出门省力；生死相搏时，有不小的机会骑马脱身。'),
 bloodhorse:T('A horse from beyond the western passes that sweats red. Very fast, very expensive, very much admired.','西域来的宝马，出的汗是红的。极快、极贵、人人眼馋。'),
 hut:T('Four walls and a roof that mostly keeps the rain out. Better than an inn.','四面墙，一个顶，雨大多漏不进来。总比住客栈强。'),
 courtyard:T('A small courtyard house with a well and a tree. A place to come back to.','一座带井带树的小院。是个能回去的地方。'),
 mansion:T('A great house with servants’ quarters. People take you more seriously when they hear where you live, and the upkeep is real.','一座带下人房的大宅。人家一听你住哪儿，就对你另眼相看。开销也是实打实的。'),
 manor:T('A walled estate in the hills, with fields and its own gate. The upkeep would feed a village.','山里一座有围墙、有田、有自家大门的山庄。一年的开销够养活一个村子。'),
 teastall:T('A stove, three tables and a kettle by the road. Small money, almost no risk.','路边一口炉子、三张桌子、一把壶。挣得少，几乎不担风险。'),
 grocery:T('Salt, oil, needles and gossip. Steady, small income.','卖盐、卖油、卖针线，顺带卖闲话。进项不多，胜在稳当。'),
 herbshop:T('Dried roots and a scale that weighs to the grain. People always get sick, so it rarely has a bad year.','一屋子干草根，一杆称得准到厘的秤。人总会生病，所以很少有坏年景。'),
 dyeworks:T('Vats of indigo and madder, and hands that are blue for life. Good money when silk sells.','一缸缸靛蓝茜红，一双手一辈子都是蓝的。丝绸好卖的年头很赚钱。'),
 tavern:T('Two floors of wine and noise. Can make a great deal, and some years it loses money.','两层楼的酒和吵闹。赚得多，有些年也会亏。'),
 inn:T('Rooms, stables and a kitchen on a busy road. Good income, and every kind of guest.','大路边的客房、马厩、灶房。进项好，什么样的客人都有。'),
 pawnshop:T('A high counter and a long memory. Profitable, and you will see a lot of people on their worst day.','高高的柜台，记得清清楚楚的账。很赚钱，也会看见很多人最难的那一天。'),
 escortco:T('An escort agency with its own banner and guards. Big profits, and when a shipment is lost, big losses.','有自家镖旗和镖师的镖局。赚得多；丢一趟镖，赔得也多。'),
 boatline:T('A fleet of river boats. Floods, pirates and tolls make it a gamble, but a rich one.','一队江船。水患、水匪、关卡，都让它像一场赌博，可赌注很肥。'),
 bank:T('A money shop with branches in three cities. Enormous income, and the respect of everyone who owes you.','一家在三座城有分号的钱庄。进项极大，欠你钱的人都对你客客气气。'),
 salve:T('The standard thing for cuts: smear it on and bind it. Heals a little and treats an open wound.','治刀伤的寻常药：抹上，包扎好。回点气血，治开放的伤口。'),
 bonepaste:T('A black paste that smells of pine and something worse. Helps broken bones knit.','一种黑膏药，闻着有松香味，还有股更难闻的味儿。帮断骨长好。'),
 antidote:T('A general antidote. Does not cure everything, but buys time against most poisons.','通用的解毒丹。不是什么毒都解，但大多数毒都能拖住。'),
 incense:T('Burned at night beside the pillow. Steadies a shaken mind.','夜里点在枕边。让受了惊的心定下来。'),
 hushin:T('Protects the heart meridian after an internal injury, and restores some strength.','受了内伤后护住心脉，还能回些气血。'),
 jadedew:T('An expensive pill that heals a great deal and cures illness, wounds, poison and internal injury in one.','一颗很贵的药丸，大补气血，病、伤、毒、内伤都能治。'),
 bigreturn:T('A rare pill that adds to your inner energy and helps an internal injury heal.','罕见的丹药，增长内力，也帮内伤痊愈。'),
 meridianpill:T('For damaged meridians, the injury most fighters never recover from. Very rare.','治经脉受损。这种伤，多数武人一辈子都好不了。极罕见。'),
 lifepill:T('Adds years to your life. Nobody quite knows how many sellers of these are frauds; this one is said to be real.','能延年益寿。卖这种药的骗子有多少，没人说得清；这一颗据说是真的。'),
 dog:T('A scruffy dog who decides you are his. Cheap, loyal, and happy to see you every single time.','一条土狗，认定你是它的主人。便宜、忠心，每回见你都高兴得不得了。'),
 cat:T('A lazy cat who allows you to live in its house.','一只懒猫，恩准你住在它的屋里。'),
 monkey:T('A clever monkey that steals fruit, picks locks and makes everyone laugh.','一只机灵的猴子，会偷果子、会开锁，逗得谁都笑。'),
 falcon:T('A trained hunting falcon. Sits on your wrist and makes you look like someone important.','一只训好的猎鹰。往你腕子上一站，你就像个人物了。'),
 crane:T('A white crane, long-lived and elegant. A scholar’s pet, and a good omen.','一只白鹤，长寿又风雅。是文人养的，也是个好兆头。')};
for(const k in ITEM_DESC)if(ITEMS[k]&&!ITEMS[k].desc)ITEMS[k].desc=ITEM_DESC[k];
/* weapons: what each one is like, beside the note on whether it suits your style */
const WEAPON_LORE={
 woodsword:T('A practice sword of jujube wood. Every master started with one, and most still have theirs.','枣木练习剑。哪位高手都是从它开始的，多数人至今还留着自己那一把。'),
 ironsword:T('Plain iron, honestly made. It holds an edge if you look after it.','普通铁剑，老老实实打出来的。勤加保养，刃口就钝不了。'),
 steelsword:T('Green-tinged steel, folded many times. A real swordsman’s sword, without being anyone’s heirloom.','青钢百炼，剑身泛着青光。是真正剑客用的剑，只是还算不上谁家的传家宝。'),
 softsword:T('A sword so thin and flexible it is worn coiled around the waist as a belt. Strikes from angles nobody expects.','剑身极薄极软，平时缠在腰间当腰带。出手的角度谁也料不到。'),
 heavysword:T('Black-gold steel, broad and blunt. It does not need an edge; it relies on its weight.','乌金铸成，又宽又钝。用不着开刃，靠的是分量。'),
 mastersword:T('Forged by a famous smith for a season. You can hear it when it leaves the scabbard.','名匠闭门锻了一季的剑。出鞘的时候，听得见它响。'),
 yitian:T('A sword with a name, and a story longer than most people’s lives. People who know swords stop talking when they see it.','一把有名号的剑，背后的故事比多数人的一辈子还长。懂剑的人见了它都不说话了。'),
 podao:T('A long-handled field saber, the kind farmers and bandits both carry. Ugly and reliable.','长柄朴刀，庄稼汉和强盗都拿它。难看，可靠得住。'),
 ghostsaber:T('A heavy saber with a ghost’s face on the hilt. Executioners favour it; so do people who want to look like one.','刀柄上铸着鬼头的重刀。刽子手爱用，想让人以为自己是刽子手的也爱用。'),
 yanling:T('Shaped like a wild goose’s feather, light and quick. The standard saber of officers and escorts.','形如雁翎，又轻又快。军官和镖师用的都是这种刀。'),
 coldsaber:T('Cold iron from the bottom of a northern lake. The blade frosts over in summer.','北地湖底捞上来的寒铁打成。大夏天刀身上都结一层霜。'),
 tulong:T('A saber with a name that people lower their voices to say. Whoever carries it is challenged constantly.','一把说起名字来人人都压低声音的刀。谁带着它，谁就天天有人来挑战。'),
 spear:T('A spear with a red horsehair tassel that hides the point’s movement. The king of weapons, soldiers say.','枪头系着红缨，晃起来看不清枪尖往哪儿走。当兵的都说枪是百兵之王。'),
 baila:T('A white-wax-wood shaft that bends without breaking. Cheap, light, and nastier than it looks.','白蜡杆的枪，弯而不折。便宜、轻，比看上去难缠得多。'),
 chainwhip:T('Nine steel sections joined by rings. Hard to learn, hard to block, and easy to hit yourself with.','九节钢段用环连着。难学，难挡，也容易抽到自己。'),
 brush:T('An iron calligraphy brush, the weapon of scholars who fight for pressure points. Looks harmless on a desk.','一支铁铸的判官笔，专打穴道的书生用它。摆在书桌上一点也不起眼。'),
 twinhooks:T('A pair of hooked swords with guarded handles. They catch, trap and pull another weapon away.','一对带护手的钩。能钩、能锁，能把对手的兵器夺过来。'),
 fistwrap:T('Oxhide wrapped around the knuckles. Saves your hands; does not do much else.','牛皮缠在拳头上。护得住手，别的用处不大。'),
 knuckles:T('Iron rings across the fingers. Tavern brawlers love them, and so do constables.','套在指节上的铁环。酒馆打架的爱用，捕快也爱用。'),
 gauntlet:T('Fine steel gauntlets that let a palm fighter block a blade.','精钢打的护手，练掌法的人戴上能空手接刀。'),
 silkglove:T('Woven from the silk of ice worms. Poison and blades slide off them, and palm strikes land like hammers.','冰蚕丝织成的手套。刀刃毒物都沾不上，一掌打出去像锤子一样重。'),
 qimeigun:T('An eyebrow-height staff, the first weapon of temple monks. It teaches you distance.','齐眉高的棍子，寺里和尚学的头一样兵器。练的是分寸。'),
 chanzhang:T('A monk’s iron staff with a crescent blade at one end. Heavy enough to break a horse’s leg.','镔铁禅杖，一头带月牙铲。分量足以打断马腿。'),
 emeici:T('A pair of short spikes spun on the finger. Quick, close and quiet; Emei nuns made them famous.','一对套在手指上转的短刺。又快又近又悄无声息；是峨眉的师太们让它出了名。'),
 dagger:T('A short blade that goes everywhere with you. Nobody notices it until it matters.','一把随身的短刀。不到要紧的时候，谁也注意不到它。'),
 ironxiao:T('An iron flute you can actually play. Scholars who fight carry it so they can deny they are carrying a weapon.','一支真能吹的铁箫。会武的书生带着它，为的是可以说自己没带兵器。'),
 qiankun:T('A steel ring with a sharpened outer edge, thrown or held. Unusual enough that most people have never fought one.','外缘开了刃的钢圈，能扔能握。少见到多数人从没跟它交过手。'),
 feilun:T('A bladed wheel, thrown spinning. Comes back sometimes; not always to your hand.','带刃的轮子，旋着扔出去。有时会飞回来，不一定回到你手里。'),
 huntbow:T('A hunter’s bow of horn and mulberry wood. Strikes from a distance, before anyone reaches you.','牛角桑木做的猎弓。人还没近身，箭已经到了。')};
for(const k in WEAPON_LORE)if(ITEMS[k])ITEMS[k].lore=WEAPON_LORE[k];

/* the numbers and notes for one item, shared by the shop and your belongings */
function itemFacts(s,d){const L=u(),Z=zh(),f=[];if(d.lore&&d.desc)f.push(tr(d.desc));
  if(d.atk)f.push(`+${d.atk} ${L.stat.atk}`);if(d.def)f.push(`+${d.def} ${L.stat.def}`);if(d.hp)f.push(`+${d.hp} ${L.stat.hp}`);if(d.spd)f.push(`+${d.spd} ${L.stat.spd}`);
  if(d.travel)f.push(Z?'出行少耗一点行动力':'travel costs 1 less energy');
  if(d.flee)f.push(Z?`生死关头${Math.round(d.flee*100)}%能骑马脱身`:`${Math.round(d.flee*100)}% chance to ride out of a losing death fight`);
  if(d.happy)f.push(`+${d.happy} ${L.joy}`);if(d.upkeep)f.push(Z?`年耗${d.upkeep}两`:`upkeep ${d.upkeep}/yr`);
  if(d.inc)f.push(Z?`年入${d.inc[0]}–${d.inc[1]}两`:`earns ${d.inc[0]}–${d.inc[1]}/yr`);
  if(d.risk)f.push(Z?`每年约${Math.round(d.risk*100)}%会亏一笔`:`about ${Math.round(d.risk*100)}% chance of a losing year`);
  if(d.life&&['pet','mount'].includes(d.cat))f.push(Z?`能陪你大约${cnNum(d.life)}年`:`lives about ${d.life} years`);
  if(d.use){const x=d.use;if(x.heal)f.push(`+${x.heal} ${L.health}`);if(x.qi)f.push(Z?`内力+${x.qi}`:`+${x.qi} inner power`);if(x.life)f.push(Z?`寿元+${x.life}`:`+${x.life} years of life`);
    if(x.cond&&typeof CONDS!=='undefined')f.push((Z?'治':'treats ')+[].concat(x.cond).map(k=>CONDS[k]?tr(CONDS[k].n):k).join(Z?'、':', '));if(x.cure)f.push(Z?'治病':'cures illness');f.push(Z?'用一次就没了':'used up when taken')}
  if(d.art&&typeof ARTS!=='undefined'&&ARTS[d.art])f.push(Z?`品阶${cnNum(ARTS[d.art].tier)} · 研读后可习得`:`tier ${ARTS[d.art].tier} · study to learn`);
  if(SLOTS[d.cat])f.push(Z?'同类只能用一件':'one of this kind in use at a time');
  return f}
const shopPrice=(s,d)=>Math.round(d.price*(['house','biz'].includes(d.cat)?s.stock.mkt:1));
function shopHTML(){const s=S,L=u(),Z=zh(),pk=SHEET.pick;const by={};s.stock.ids.forEach(id=>{const d=itemDef(id);if(d)(by[d.cat]=by[d.cat]||[]).push([id,d])});
  let h=`<p class="muted" style="margin:0 0 6px;font-size:14px">${L.stockNote} ${Z?'点一下看看是什么，再决定买不买。':'Tap an item to see what it is before you buy.'}</p>`;
  Object.keys(L.cats).forEach(cat=>{if(!by[cat])return;h+=`<div class="grp"><h4>${L.cats[cat]}</h4><div class="rows">${by[cat].map(([id,d])=>{const price=shopPrice(s,d),on=pk===id,ff=itemFacts(s,d);
    const why=!s.alive?'':s.queue.length?(Z?'先做完眼前的决定':'Decide first'):s.money<price?(Z?`还差${num(price-s.money)}两`:`${num(price-s.money)} taels short`):s.age<10&&d.cat!=='pet'&&d.cat!=='pill'?(Z?'年纪太小':'Too young to buy this'):'';
    const row=`<button class="rowb shoprow${on?' on':''}" data-pick="${id}" title="${esc(tr(d.lore||d.desc||T('','')))}"><span class="main"><b>${tr(d.n)}</b><span>${ff.filter(x=>!/one of this kind|同类只能用一件|used up when taken|用一次就没了/.test(x)).slice(0,2).join(' · ')||(d.desc?tr(d.desc):'')}</span></span><span class="side"><span class="price">${num(price)}</span> ${L.taels} <span class="caret">${on?'▴':'▾'}</span></span></button>`;
    if(!on)return row;
    return row+`<div class="shopdet">${(d.lore||d.desc)?`<p class="sd-desc">${tr(d.lore||d.desc)}</p>`:''}<ul class="sd-facts">${ff.map(x=>`<li>${x}</li>`).join('')}</ul>
      <div class="sd-b"><button class="btn main" data-buy="${id}"${why?' disabled':''}>${Z?`买下 · ${num(price)}两`:`Buy for ${num(price)} taels`}</button>${why?`<span class="muted">${why}</span>`:''}</div></div>`}).join('')}</div></div>`});
  return h}
if(typeof ownHTML==='function')(()=>{const o0=ownHTML;ownHTML=function(){const h=o0.apply(this,arguments);if((SHEET.tab||'shop')!=='shop')return h;
  const m=h.match(/^<div class="tabs">[\s\S]*?<\/div>/);return(m?m[0]:'')+shopHTML()}})();
if(typeof document!=='undefined')document.addEventListener('click',e=>{const t=e.target.closest('[data-pick]');if(!t||!SHEET||SHEET.kind!=='own')return;
  SHEET.pick=SHEET.pick===t.dataset.pick?null:t.dataset.pick;const b=$('veil').querySelector('.sh-body'),y=b?b.scrollTop:0;renderSheet();const b2=$('veil').querySelector('.sh-body');if(b2)b2.scrollTop=y});
/* after buying, close the details */
(()=>{const b0=buy;buy=function(){const r=b0.apply(this,arguments);if(r===true&&SHEET)SHEET.pick=null;return r}})();
/* your belongings: tap one to read it in full; selling asks twice */
function invHTML(){const s=S,L=u(),Z=zh(),pk=SHEET.ipick;if(!s.items.length)return`<p class="muted">${L.empty}</p>`;
  Object.keys(SLOTS).forEach(k=>eqItem(s,k));const worth=s.money+s.items.reduce((t,it)=>t+sellPrice(s,it),0);
  let h=`<p class="muted" style="margin:0 0 8px">${L.networth}: <b style="color:var(--ink)">${num(worth)}</b> ${L.taels}<br><span style="font-size:12.5px">${Z?'兵器、护甲、坐骑、饰物、暗器各只能用一件，其余放着。点一下看详情。':'You can use one weapon, one armour, one mount, one charm and one kind of hidden weapon at a time; the rest stay in storage. Tap an item for details.'}</span></p>`;
  const by={};s.items.forEach((it,i)=>{const d=itemDef(it.id);if(d)(by[d.cat]=by[d.cat]||[]).push([it,i,d])});
  Object.keys(L.cats).filter(c=>by[c]).concat(Object.keys(by).filter(c=>!L.cats[c])).forEach(cat=>{
    h+=`<div class="grp"><h4>${L.cats[cat]||cat} <span class="muted">(${by[cat].length})</span></h4><div class="rows">${by[cat].map(([it,i,d])=>{const eq=!!(SLOTS[d.cat]&&it.eq),on=pk===i,ff=itemFacts(s,d);
      const sum=ff.filter(x=>!/one of this kind|同类只能用一件|used up when taken|用一次就没了/.test(x)).slice(0,2).join(' · ')||(d.desc?tr(d.desc):'');
      const card=`<div class="rowb invrow${on?' on':''}" data-ipick="${i}" title="${esc(tr(d.lore||d.desc||T('','')))}"><span class="main"><b>${tr(d.n)}${it.cnt!=null?` ×${it.cnt}`:''} ${eq?`<span class="pill eq">${L.equipped}</span>`:''}</b><span>${sum}</span></span><span class="side" style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${d.use?`<button class="chip" data-use="${i}">${L.use}</button>`:''}${SLOTS[d.cat]&&!eq?`<button class="chip" data-equip="${i}">${Z?'换上':'Equip'}</button>`:''}<button class="chip" data-sell="${i}">${L.sell(num(sellPrice(s,it)))}</button></span></div>`;
      return on?card+`<div class="shopdet">${(d.lore||d.desc)?`<p class="sd-desc">${tr(d.lore||d.desc)}</p>`:''}<ul class="sd-facts">${ff.map(x=>`<li>${x}</li>`).join('')}${it.paid?`<li>${Z?`当初花了${num(it.paid)}两`:`you paid ${num(it.paid)} taels`}</li>`:''}</ul></div>`:card}).join('')}</div></div>`});
  return h}
if(typeof ownHTML==='function')(()=>{const o0=ownHTML;ownHTML=function(){const h=o0.apply(this,arguments);if(SHEET.tab!=='inv')return h;
  const m=h.match(/^<div class="tabs">[\s\S]*?<\/div>/);return(m?m[0]:'')+invHTML()}})();
if(typeof document!=='undefined'){
  document.addEventListener('click',e=>{if(e.target.closest('button'))return;const t=e.target.closest('[data-ipick]');if(!t||!SHEET||SHEET.kind!=='own')return;const i=+t.dataset.ipick;
    SHEET.ipick=SHEET.ipick===i?null:i;const b=$('veil').querySelector('.sh-body'),y=b?b.scrollTop:0;renderSheet();const b2=$('veil').querySelector('.sh-body');if(b2)b2.scrollTop=y});
  /* the first tap on Sell only asks; the second sells */
  document.addEventListener('click',e=>{const t=e.target.closest('[data-sell]');if(!t||t.dataset.sure)return;e.stopImmediatePropagation();e.preventDefault();
    const old=t.textContent;t.dataset.sure=1;t.textContent=zh()?'确定卖？':'Really sell?';t.classList.add('warn');
    setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent=old;t.classList.remove('warn')}},3000)},true);}
/* selling or using shifts the list, so close any open details */
['sell','useItem'].forEach(f=>{const g=globalThis[f];if(typeof g!=='function')return;globalThis[f]=function(){const r=g.apply(this,arguments);if(typeof SHEET!=='undefined'&&SHEET)SHEET.ipick=null;return r}});
