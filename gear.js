/* 江湖一生 · more to ride and more to wear. New mounts differ in how often they carry you out of a lost fight, how much
   joy they bring, what they eat and how long they live. Two new gear slots: boots (speed and dodging) and bracers
   (striking power and clean hits). A few more armours and two charms that actually do something. */
'use strict';
Object.assign(ITEMS,{
 /* mounts: all of them save a point of energy on journeys (realism.js) */
 ox:{cat:'mount',n:T('Old Ox','老黄牛'),price:30,spd:0,travel:1,flee:.03,happy:3,upkeep:2,life:18,desc:T('Slow, patient and stubborn. It will carry you anywhere, eventually, and never out of a fight.','又慢又犟，脾气倒好。哪里都驮得到，就是慢；打输了想骑它跑，别指望。')},
 mule:{cat:'mount',n:T('Mule','骡子'),price:45,spd:0,travel:1,flee:.12,happy:2,upkeep:3,life:24,desc:T('Surer on a mountain path than any horse, and cheaper to feed. Not much to look at.','走山路比马稳，吃得也比马省。就是长得不怎么样。')},
 camel:{cat:'mount',n:T('Bactrian Camel','双峰骆驼'),price:220,spd:0,travel:1,flee:.22,happy:3,upkeep:4,life:30,desc:T('Bought from a caravan off the western roads. Goes days without water and lives longer than most horses.','从西边商队手里买来的。几天不喝水也走得动，活得比大多数马都长。')},
 dapple:{cat:'mount',n:T('Dapple-Grey Steed','青骢马'),price:620,spd:0,travel:1,flee:.4,happy:4,upkeep:12,life:18,desc:T('A fast, even-tempered horse that does not panic at the sound of steel.','脚程快，性子稳，听见兵刃响也不惊。')},
 carriage:{cat:'mount',n:T('Covered Carriage','马车'),price:950,spd:0,travel:1,flee:.05,happy:7,upkeep:30,life:25,desc:T('Two horses and a curtained cabin. The most comfortable way to travel, and the worst way to escape.','两匹马拉一个带帘子的车厢。出门最舒服，逃命最不中用。')},
 whitesteed:{cat:'mount',n:T('Night-Lighting Lion','照夜玉狮子'),price:5200,spd:0,travel:1,flee:.65,happy:8,upkeep:30,life:22,rare:.2,desc:T('Snow-white from mane to hoof. It has outrun arrows before, and it knows it.','从鬃毛到马蹄一身雪白。它躲过箭，自己也知道。')},
 deer:{cat:'mount',n:T('Spotted Deer','梅花鹿'),price:800,spd:0,travel:1,flee:.2,happy:9,upkeep:6,life:20,rare:.3,desc:T('Ridden by hermits in paintings and, now, by you. Children follow you down the street.','画里的隐士才骑的东西，如今你也骑上了。走在街上，孩子们跟着跑。')},
 /* boots: a new slot */
 clothshoes:{cat:'boots',n:T('Cloth Shoes','千层底布鞋'),price:6,spd:1,desc:T('Many-layered soles stitched by hand. Quiet on a wooden floor.','手纳的千层底。踩在木地板上没有声音。')},
 swiftboots:{cat:'boots',n:T('Courier’s Boots','快靴'),price:120,spd:3,dodge:.02,desc:T('Soft leather, laced tight, the kind runners and constables wear.','软皮紧绑，跑腿的和捕快都穿这种。')},
 ironboots:{cat:'boots',n:T('Iron-Toed Boots','铁尖靴'),price:260,spd:1,def:3,desc:T('Steel in the toe and the heel. A kick in these breaks shins.','靴尖靴跟都包了铁。穿着它踢一脚，能踢断人的小腿。')},
 snowboots:{cat:'boots',n:T('Trackless Snow Boots','踏雪无痕靴'),price:2600,spd:6,dodge:.05,rare:.25,desc:T('So light you leave no prints on fresh snow, or so the seller swore.','轻得踩在新雪上不留脚印，卖家是这么发誓的。')},
 /* bracers: a new slot */
 clothwrap:{cat:'bracer',n:T('Cloth Wrist Wraps','布护腕'),price:8,atk:1,desc:T('Keeps the wrists from turning on a hard block.','硬接一招时手腕不至于扭伤。')},
 leatherbr:{cat:'bracer',n:T('Leather Bracers','皮护腕'),price:90,atk:2,crit:.02,desc:T('Stiff leather from wrist to elbow. Your strikes land cleaner.','从手腕护到手肘的硬皮。出手更干脆。')},
 steelbr:{cat:'bracer',n:T('Steel Bracers','精钢护臂'),price:420,atk:4,def:2,crit:.03,desc:T('Steel plates over the forearm: block a blade, then hit back hard.','小臂上覆着钢片：先格住刀，再狠狠还手。')},
 dragonbr:{cat:'bracer',n:T('Dragon-Scale Armguards','龙鳞护臂'),price:3800,atk:8,def:3,crit:.06,rare:.2,desc:T('Scales from some great river fish, sewn overlapping. Nobody knows which fish.','某种大江鱼的鳞片，一片压一片缝成。没人知道是什么鱼。')},
 /* armour */
 paddedrobe:{cat:'armor',n:T('Padded Cotton Robe','棉袍'),price:14,def:2,hp:6,desc:T('Thick enough to turn a cudgel, warm enough for winter.','厚得能挡一记闷棍，冬天也暖和。')},
 rhino:{cat:'armor',n:T('Rhino-Hide Armour','犀皮甲'),price:780,def:14,hp:35,desc:T('Hide from the far south, lacquered black. Heavy, and nearly as good as steel.','南方来的犀牛皮，上了黑漆。很重，几乎和铁甲一样结实。')},
 /* charms with a real effect */
 poisonpearl:{cat:'charm',n:T('Poison-Warding Pearl','避毒珠'),price:700,happy:1,rare:.4,desc:T('Worn on a cord at the throat. Most poisons that would settle in you pass through instead.','用绳子挂在喉间。大多数本该留在身上的毒，都散掉了。')},
 coldjade:{cat:'charm',n:T('Cold Jade Pendant','寒玉佩'),price:520,happy:1,rare:.5,desc:T('Always cool to the touch. Steadies your qi against an opponent’s inner force.','摸上去总是凉的。能稳住真气，挡一挡对手的内劲。')}
});
SLOTS.boots='spd';SLOTS.bracer='atk';
MARKET.push('ox','mule','camel','dapple','carriage','clothshoes','swiftboots','ironboots','clothwrap','leatherbr','steelbr','paddedrobe','rhino');
RARE.push('whitesteed','deer','snowboots','dragonbr','poisonpearl','coldjade');

/* boots and bracers in a fight */
(()=>{const y0=youFighter;youFighter=function(s){const f=y0(s);const b=eqItem(s,'boots'),w=eqItem(s,'bracer');
  [b,w].forEach(e=>{if(!e)return;f.spd+=e.spd||0;f.atk+=e.atk||0;f.def+=e.def||0;f.dodge=clamp(f.dodge+(e.dodge||0),0,.45);f.crit=clamp(f.crit+(e.crit||0),.03,.45)});
  if(eqHas(s,'coldjade'))f.res=Math.round(f.res*1.25);
  return f}})();
/* the pearl keeps most poison from settling in you after a fight */
(()=>{const a0=addCond;addCond=function(s,k,sev,quiet){if(k==='poison'&&s&&eqHas(s,'poisonpearl')&&chance(.6))return;return a0.apply(this,arguments)}})();
