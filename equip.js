/* 江湖一生 · every piece of gear is its own piece. When you buy or find a weapon, armour, boots, bracers or headgear, it
   comes out of the forge with a quality (粗制 to 神品), its numbers rolled a little up or down, and, for the better pieces,
   one to three extra lines (词条) such as a keen edge, a chance to draw blood, or a lining that turns blows. Two swords of the
   same name can be quite different. Things you owned before this keep their old, plain numbers. A new slot: headgear. */
'use strict';
const GRADES=[{n:T('Crude','粗制'),m:.85,v:.7,c:'g0'},{n:T('Common','寻常'),m:1,v:1,c:'g1'},{n:T('Fine','精良'),m:1.15,v:1.4,c:'g2'},{n:T('Superior','上品'),m:1.3,v:2,c:'g3'},{n:T('Peerless','神品'),m:1.5,v:3.5,c:'g4'}];
const ROLL_CATS=new Set(['weapon','armor','boots','bracer','head']);
/* the extra lines each kind of gear can carry; v(base item) gives the value */
const AFX={
 keen:{n:T('Keen','锋锐'),cats:['weapon','bracer'],v:d=>Math.max(1,Math.round((d.atk||4)*(.08+R()*.12))),k:'atk',t:(v,Z)=>Z?`攻击+${v}`:`+${v} attack`},
 crit:{n:T('Deadly','会心'),cats:['weapon','bracer'],v:()=>Math.round((.02+R()*.04)*100)/100,k:'crit',t:(v,Z)=>Z?`会心+${Math.round(v*100)}%`:`+${Math.round(v*100)}% critical hits`},
 swift:{n:T('Swift','迅捷'),cats:['weapon','boots'],v:()=>rint(1,3),k:'spd',t:(v,Z)=>Z?`身法+${v}`:`+${v} speed`},
 bleed:{n:T('Bloodletting','嗜血'),cats:['weapon'],v:()=>Math.round((.12+R()*.13)*100)/100,w:'bleed',t:(v,Z)=>Z?`命中时${Math.round(v*100)}%令对手流血`:`${Math.round(v*100)}% chance to draw blood on a hit`},
 venom:{n:T('Envenomed','淬毒'),cats:['weapon'],v:()=>Math.round((.1+R()*.1)*100)/100,w:'poison',t:(v,Z)=>Z?`命中时${Math.round(v*100)}%令对手中毒`:`${Math.round(v*100)}% chance to poison on a hit`},
 sunder:{n:T('Sundering','破甲'),cats:['weapon','bracer'],v:()=>Math.round((.15+R()*.1)*100)/100,w:'brk',t:(v,Z)=>Z?`命中时${Math.round(v*100)}%破甲一层`:`${Math.round(v*100)}% chance to break armour on a hit`},
 leech:{n:T('Thirsting','饮血'),cats:['weapon'],v:()=>Math.round((.04+R()*.05)*100)/100,w:'steal',t:(v,Z)=>Z?`命中回复伤害的${Math.round(v*100)}%`:`heals ${Math.round(v*100)}% of damage dealt`},
 tough:{n:T('Sturdy','坚韧'),cats:['armor','boots','head'],v:d=>Math.max(1,Math.round((d.def||3)*(.1+R()*.15))),k:'def',t:(v,Z)=>Z?`防御+${v}`:`+${v} defence`},
 thick:{n:T('Padded','厚实'),cats:['armor','head'],v:d=>Math.max(2,Math.round((d.hp||8)*(.1+R()*.2))),k:'hp',t:(v,Z)=>Z?`气血+${v}`:`+${v} health`},
 ward:{n:T('Warding','护心'),cats:['armor'],v:()=>Math.round((.03+R()*.05)*100)/100,p:'huti',t:(v,Z)=>Z?`所受外力伤害-${Math.round(v*100)}%`:`-${Math.round(v*100)}% physical damage taken`},
 nimble:{n:T('Nimble','灵巧'),cats:['armor','boots'],v:()=>Math.round((.01+R()*.02)*100)/100,k:'dodge',t:(v,Z)=>Z?`闪避+${Math.round(v*100)}%`:`+${Math.round(v*100)}% dodge`},
 calm:{n:T('Clear-minded','凝神'),cats:['head'],v:()=>1,p:'s_focus',t:(v,Z)=>Z?`开战即凝神${cnNum(v)}层`:`start each fight focused (${v})`},
 steady:{n:T('Steadfast','铁壁'),cats:['head','armor'],v:()=>1,p:'s_guard',t:(v,Z)=>Z?`开战即铁壁${cnNum(v)}层`:`start each fight braced (${v})`}};
/* quality: what the forge gives you. Rare finds and the secret seller lean better */
function rollGrade(luck,better){const r=R()+(luck-5)*.01+(better||0);return r<.15?0:r<.65?1:r<.9?2:r<.99?3:4}
function rollItem(s,it,better){const d=ITEMS[it.id];if(!d||!ROLL_CATS.has(d.cat)||it.q!=null)return it;
  const g=rollGrade(s&&s.t?s.t.luck:5,better),G=GRADES[g],jit=()=>.9+R()*.2;it.q=g;
  ['atk','def','hp','spd'].forEach(k=>{if(d[k])it[k]=Math.max(1,Math.round(d[k]*G.m*jit()))});
  ['dodge','crit'].forEach(k=>{if(d[k])it[k]=Math.round(d[k]*G.m*jit()*1000)/1000});
  const n=[0,R()<.4?1:0,1,2,3][g];const pool=Object.keys(AFX).filter(k=>AFX[k].cats.includes(d.cat));it.fx={};
  for(let i=0;i<n&&pool.length;i++){const k=pool.splice(Math.floor(R()*pool.length),1)[0];it.fx[k]=AFX[k].v(d)}
  if(!Object.keys(it.fx).length)delete it.fx;return it}
/* the piece as it actually is: its kind, with its own numbers and a name that says its quality */
function instDef(it){const d=itemDef(it.id);if(!d||it.q==null)return d;const o=Object.assign({},d);['atk','def','hp','spd','dodge','crit'].forEach(k=>{if(it[k]!=null)o[k]=it[k]});
  const G=GRADES[it.q];o.n=it.q===1?d.n:T(`${G.n.en} ${d.n.en}`,`${G.n.zh}·${d.n.zh}`);o.q=it.q;o.fx=it.fx;o.price=Math.round(d.price*G.v);return o}
/* extra lines that are flat numbers count straight into the piece */
const fxSum=(it,k)=>Object.entries(it&&it.fx||{}).reduce((t,[a,v])=>t+(AFX[a]&&AFX[a].k===k?v:0),0);
/* new gear arrives rolled: bought, found, given */
(()=>{const b0=buy;buy=function(s,id){const n0=s.items.length;const r=b0.apply(this,arguments);if(r===true)for(let i=n0;i<s.items.length;i++)rollItem(s,s.items[i]);return r}})();
(()=>{const a0=applyFx;applyFx=function(s,e,c){const n0=s&&s.items?s.items.length:0;const r=a0.apply(this,arguments);if(s&&s.items)for(let i=n0;i<s.items.length;i++)rollItem(s,s.items[i],.12);return r}})();
(()=>{const s0=sellPrice;sellPrice=function(s,it){const v=s0.apply(this,arguments);return it&&it.q!=null?Math.round(v*GRADES[it.q].v):v}})();
/* in a fight: flat lines add to your numbers, the rest act on each hit or protect you */
(()=>{const y0=youFighter;youFighter=function(s){const f=y0(s);const eq=['weapon','armor','boots','bracer','head'].map(c=>eqItem(s,c)).filter(Boolean);
  /* health from gear makes you tougher in a fight, the same way armour does */
  const head=eqItem(s,'head'),realMax=Math.max(1,s.maxHealth);if(head){f.def+=head.def||0;if(head.hp)f.tough=(f.tough||1)+head.hp/realMax}
  eq.forEach(e=>{f.atk+=fxSum(e,'atk');f.def+=fxSum(e,'def');f.spd+=fxSum(e,'spd');f.crit=clamp(f.crit+fxSum(e,'crit'),.03,.5);f.dodge=clamp(f.dodge+fxSum(e,'dodge'),0,.5);
    const hp=fxSum(e,'hp');if(hp)f.tough=(f.tough||1)+hp/realMax;
    for(const [a,v] of Object.entries(e.fx||{})){const A=AFX[a];if(!A)continue;if(A.w){f.wfx=f.wfx||{};f.wfx[A.w]=Math.max(f.wfx[A.w]||0,v)}
      if(A.p){f.pas=f.pas||{};f.pas[A.p]=(A.p==='huti'?Math.min(.3,(f.pas.huti||0)+v):Math.max(f.pas[A.p]||0,v))}}});
  return f}})();
/* the new slot, and new pieces of every kind */
SLOTS.head='def';
Object.assign(ITEMS,{
 qingfeng:{cat:'weapon',n:T('Green-Edge Sword','青锋剑'),price:130,atk:10},
 longquan:{cat:'weapon',n:T('Longquan Sword','龙泉剑'),price:380,atk:15},
 qiushui:{cat:'weapon',n:T('Autumn-Water Sword','秋水剑'),price:950,atk:19,rare:.6},
 kaishan:{cat:'weapon',n:T('Mountain-Splitter Saber','开山刀'),price:140,atk:10},
 zhanma:{cat:'weapon',n:T('Horse-Cutting Saber','斩马刀'),price:520,atk:17},
 tiezhang:{cat:'weapon',n:T('Iron Palm Guards','铁掌套'),price:60,atk:6},
 jingang:{cat:'weapon',n:T('Vajra Finger Rings','金刚指环'),price:720,atk:18,rare:.6},
 shutong:{cat:'weapon',n:T('Bronze-Bound Staff','熟铜棍'),price:160,atk:11},
 lihua:{cat:'weapon',n:T('Pear-Blossom Spear','梨花枪'),price:400,atk:15},
 fangtian:{cat:'weapon',n:T('Sky-Piercing Halberd','方天画戟'),price:1600,atk:22,rare:.4},
 ruanbian:{cat:'weapon',n:T('Soft Leather Whip','软鞭'),price:120,atk:9},
 yuchang:{cat:'weapon',n:T('Fish-Gut Short Sword','鱼肠短剑'),price:680,atk:16,rare:.5},
 yuxiao:{cat:'weapon',n:T('Jade Flute','玉箫'),price:600,atk:14,rare:.6},
 tieshan:{cat:'weapon',n:T('Iron-Ribbed Fan','铁骨扇'),price:240,atk:11},
 bujia:{cat:'armor',n:T('Quilted Cloth Armour','布甲'),price:30,def:3,hp:8},
 daopao:{cat:'armor',n:T('Taoist Robe','道袍'),price:90,def:4,hp:12},
 yulin:{cat:'armor',n:T('Fish-Scale Armour','鱼鳞甲'),price:540,def:12,hp:28},
 caoxie:{cat:'boots',n:T('Straw Sandals','草鞋'),price:2,dodge:.01},
 lupi:{cat:'boots',n:T('Deerskin Boots','鹿皮靴'),price:180,spd:2,dodge:.03},
 yunwen:{cat:'boots',n:T('Cloud-Pattern Boots','云纹靴'),price:950,spd:4,dodge:.04,def:2,rare:.5},
 tiehw:{cat:'bracer',n:T('Iron Bracers','铁护腕'),price:160,atk:3,def:1},
 douli:{cat:'head',n:T('Bamboo Rain Hat','斗笠'),price:12,def:1,hp:4,desc:T('Keeps off sun, rain and the gaze of strangers.','遮日挡雨，也挡生人的目光。')},
 moe:{cat:'head',n:T('Leather Brow Band','皮抹额'),price:60,def:2,hp:6},
 fangjin:{cat:'head',n:T('Scholar’s Cap','方巾'),price:25,hp:5,desc:T('Worn by scholars; makes you look like you have read something.','读书人戴的；戴上像是读过几本书。')},
 tiekui:{cat:'head',n:T('Iron Helmet','铁盔'),price:220,def:5,hp:12},
 jinguan:{cat:'head',n:T('Gold Hair Crown','束发金冠'),price:1300,def:3,hp:10,rare:.4,desc:T('A crown worth a farm, holding up a topknot.','一顶能换一座庄子的发冠，只为挽住一个发髻。')}});
['qingfeng','longquan','qiushui'].forEach(id=>W_CLASS[id]='sword');['kaishan','zhanma'].forEach(id=>W_CLASS[id]='saber');['tiezhang','jingang'].forEach(id=>W_CLASS[id]='fist');
W_CLASS.shutong='staff';['lihua','fangtian'].forEach(id=>W_CLASS[id]='spear');W_CLASS.ruanbian='whip';W_CLASS.yuchang='pierce';W_CLASS.yuxiao='flute';W_CLASS.tieshan='brush';
W_COMMON.push('qingfeng','longquan','kaishan','zhanma','tiezhang','shutong','lihua','ruanbian','tieshan');W_RARE.push('qiushui','jingang','fangtian','yuchang','yuxiao');
MARKET.push('bujia','daopao','yulin','caoxie','lupi','tiehw','douli','moe','fangjin','tiekui');RARE.push('yunwen','jinguan');
