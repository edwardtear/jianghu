/* 江湖一生 · weapons follow the art: a swordsman gets full use of a sword, a palm or fist fighter of gauntlets, a staff
   fighter of a staff. The wrong weapon in your hands gives only half its edge. The market stocks a different spread each year. */
'use strict';

/* weapon classes, and which characters in a sect's weapon or an art's name point to them */
const WCLS={'剑':'sword','刀':'saber','掌':'fist','拳':'fist','爪':'fist','指':'fist','手':'fist','棒':'staff','杖':'staff','棍':'staff','枪':'spear','鞭':'whip','钩':'hook','刺':'pierce','匕':'pierce','箫':'flute','笛':'flute','环':'ring','轮':'wheel','令':'brush','笔':'brush','弓':'bow'};
const WNAME={sword:T('sword','剑'),saber:T('saber','刀'),fist:T('fist and palm','拳掌'),staff:T('staff','棍杖'),spear:T('spear','枪'),whip:T('whip','鞭'),hook:T('hooks','钩'),pierce:T('short blades','短刺'),flute:T('flute','箫笛'),ring:T('rings','环'),wheel:T('wheels','轮'),brush:T('brush','笔'),bow:T('bow','弓')};
/* the weapons of the jianghu, old and new */
const W_CLASS={woodsword:'sword',ironsword:'sword',steelsword:'sword',heavysword:'sword',yitian:'sword',mastersword:'sword',coldsaber:'saber',ghostsaber:'saber',tulong:'saber',spear:'spear',chainwhip:'whip',brush:'brush',twinhooks:'hook'};
Object.assign(ITEMS,{
 softsword:{cat:'weapon',n:T('Soft Sword','缠腰软剑'),price:420,atk:15,rare:.6},
 podao:{cat:'weapon',n:T('Broad Saber','朴刀'),price:50,atk:7},
 yanling:{cat:'weapon',n:T('Goose-Feather Saber','雁翎刀'),price:210,atk:13},
 fistwrap:{cat:'weapon',n:T('Leather Fist Wraps','牛皮拳套'),price:25,atk:4},
 knuckles:{cat:'weapon',n:T('Iron Knuckles','铁指虎'),price:80,atk:8},
 gauntlet:{cat:'weapon',n:T('Steel Gauntlets','精钢护手'),price:280,atk:14},
 silkglove:{cat:'weapon',n:T('Ice-Silk Gloves','冰蚕手套'),price:1800,atk:26,rare:.35},
 qimeigun:{cat:'weapon',n:T('Eyebrow-High Staff','齐眉棍'),price:20,atk:5},
 chanzhang:{cat:'weapon',n:T('Iron Monk’s Staff','镔铁禅杖'),price:250,atk:14},
 baila:{cat:'weapon',n:T('Waxwood Spear','白蜡杆枪'),price:60,atk:7},
 emeici:{cat:'weapon',n:T('Emei Piercers','峨眉刺'),price:120,atk:9},
 dagger:{cat:'weapon',n:T('Dagger','匕首'),price:40,atk:6},
 ironxiao:{cat:'weapon',n:T('Iron Flute','铁箫'),price:90,atk:8},
 qiankun:{cat:'weapon',n:T('Heaven-and-Earth Rings','乾坤圈'),price:320,atk:13,rare:.6},
 feilun:{cat:'weapon',n:T('Flying Wheels','飞轮'),price:300,atk:12,rare:.6},
 huntbow:{cat:'weapon',n:T('Hunting Bow','猎弓'),price:50,atk:6}});
Object.assign(W_CLASS,{softsword:'sword',podao:'saber',yanling:'saber',fistwrap:'fist',knuckles:'fist',gauntlet:'fist',silkglove:'fist',qimeigun:'staff',chanzhang:'staff',baila:'spear',emeici:'pierce',dagger:'pierce',ironxiao:'flute',qiankun:'ring',feilun:'wheel',huntbow:'bow'});
const W_COMMON=['woodsword','ironsword','steelsword','podao','ghostsaber','yanling','fistwrap','knuckles','gauntlet','qimeigun','chanzhang','baila','spear','chainwhip','emeici','dagger','ironxiao','huntbow'];
const W_RARE=['softsword','silkglove','qiankun','feilun','brush','twinhooks','coldsaber','heavysword'];

/* your style: what your sect fights with, and what your arts are named for */
function fightStyle(s){const sc={};const add=(c,w)=>{if(c)sc[c]=(sc[c]||0)+w};
  const sid=s.sect||s.leftSect||s.flags.formerSect;if(sid&&SECTS[sid]&&SECTS[sid].wpn)add(WCLS[SECTS[sid].wpn.zh],3);
  (s.arts||[]).forEach(a=>{const ch=[...(a.cn||'')].find(x=>WCLS[x]);if(ch)add(WCLS[ch],1+(a.tier||0))});
  const ks=Object.keys(sc).sort((a,b)=>sc[b]-sc[a]);if(!ks.length)return[];return ks.filter(k=>sc[k]>=sc[ks[0]]*.6).slice(0,2)}
function weaponFit(s,id){const c=W_CLASS[id];if(!c)return 1;const st=fightStyle(s);if(!st.length)return 1;return st.includes(c)?1:.5}
/* only a matching weapon gives its full edge */
(()=>{const g0=gearStats;gearStats=function(s){const g=g0(s);const w=eqItem(s,'weapon');if(w)g.atk=Math.round((w.atk||0)*weaponFit(s,w.id));return g}})();
/* what the shop and your belongings say about each weapon */
Object.keys(W_CLASS).forEach(id=>{const d=ITEMS[id];if(!d)return;const base=d.desc;
  Object.defineProperty(d,'desc',{configurable:true,get(){const s=typeof S!=='undefined'?S:null;const c=WNAME[W_CLASS[id]];
    if(!s)return base||T(`A ${c.en} weapon.`,`${c.zh}类兵器。`);const st=fightStyle(s);
    const fit=!st.length?T(`${c.en}; any weapon serves until you have a style`,`${c.zh}类；你还没有武功路数，什么兵器都一样用`):st.includes(W_CLASS[id])?T(`${c.en}; suits your style`,`${c.zh}类；合你的路数`):T(`${c.en}; not your style, half its edge`,`${c.zh}类；不合你的路数，只能发挥一半`);
    return base?T(`${fit.en}. ${base.en}`,`${fit.zh}。${base.zh}`):fit}})});
/* the market: a different spread of weapons every year, with a better chance of what suits you, and rarer pieces in big cities */
const W_REG={capital:.5,jiangnan:.4,central:.35,shu:.3,north:.3,west:.25,miao:.2,east:.25};
(()=>{const rs=rollStock;rollStock=function(s){rs(s);
  s.stock.ids=s.stock.ids.filter(id=>!W_CLASS[id]);const pool=W_COMMON.slice().sort(()=>R()-.5);const pickN=pool.slice(0,rint(5,7));
  const st=fightStyle(s);st.forEach(c=>{const m=W_COMMON.filter(id=>W_CLASS[id]===c&&!pickN.includes(id));if(m.length)pickN.push(pick(m))});
  if(chance(W_REG[s.region]??.3)){const r=pick(W_RARE);if(!pickN.includes(r))pickN.push(r)}
  s.stock.ids=pickN.concat(s.stock.ids)}})();
/* when nothing is chosen yet, the weapon put to use is the one that hits hardest in your hands */
(()=>{const e0=eqItem;eqItem=function(s,cat){if(cat==='weapon'&&!s.items.some(x=>x.eq&&itemDef(x.id).cat==='weapon')){const ws=s.items.filter(x=>itemDef(x.id).cat==='weapon');
  if(ws.length){const b=ws.slice().sort((a,b)=>(itemDef(b.id).atk||0)*weaponFit(s,b.id)-(itemDef(a.id).atk||0)*weaponFit(s,a.id))[0];b.eq=true}}return e0(s,cat)}})();
