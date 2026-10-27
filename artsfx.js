/* 江湖一生 · what each kind of art does in a fight.
   外功 always attack: an outer art whose technique was defensive gets an attack that fits its weapon instead.
   内功 add a passive (armour of qi, a deep reservoir of qi, steady healing, resistance to poison, or stronger inner blows)
   on top of any technique of their own; the higher the tier and mastery, the stronger.
   轻功 differ by tier: speed and dodging grow clearly, and better arts add moving first, a counter after a dodge and,
   at the top, the odd extra move.
   Every art names the weapon that suits it; fighting with that weapon makes its technique 15% stronger. */
'use strict';
const ATTACK_SK=new Set(['jianqi','lianhuan','dianxue','xixing','anqi','poison','pojia','neishang','longzhang','shehun','shihou','pizhan','chuanxin','hengsao','zhenshan','qinna','fenyan','hanbing']);
const WCLS2=Object.assign({},WCLS,{'腿':'fist','脚':'fist','斧':'saber','锤':'saber','戟':'spear','弓':'bow','箭':'bow','扇':'brush'});
const W_EN=[[/sword/i,'sword'],[/saber|blade|axe|hammer/i,'saber'],[/spear|halberd/i,'spear'],[/staff|cudgel|pole/i,'staff'],[/whip/i,'whip'],[/hook/i,'hook'],[/dagger|knife|thorn|piercer/i,'pierce'],[/flute/i,'flute'],[/brush|fan/i,'brush'],[/bow|arrow/i,'bow'],[/fist|palm|finger|claw|kick|hand|boxing|grapple/i,'fist']];
WNAME.saber=WNAME.saber||T('saber','刀');if(!WNAME.bow)WNAME.bow=T('bow','弓');
/* the weapon an art is made for, or null for arts that need none (inner and lightness arts, poisons) */
function artWeapon(a){const c=artCat(a);if(c==='nei'||c==='qing')return null;if(c==='anqi')return'anqi';
  const ch=[...(a.cn||'')].find(x=>WCLS2[x]);if(ch)return WCLS2[ch];const m=W_EN.find(([re])=>re.test(a.n||''));return m?m[1]:'fist'}
const weaponName=w=>w==='anqi'?T('hidden weapons','暗器'):(WNAME[w]||T(w,w));
/* the technique an art actually uses in a fight */
function effSk(a){if(!a||!a.sk)return a&&a.sk;const c=artCat(a),cn=a.cn||'';if(c!=='wai')return a.sk;
  /* fire and frost arts burn and chill, whatever they were before */
  if((!ATTACK_SK.has(a.sk)||a.sk==='lianhuan'||a.sk==='pojia')&&/火|炎|焰|烈|焚|赤/.test(cn))return'fenyan';
  if((!ATTACK_SK.has(a.sk)||a.sk==='lianhuan'||a.sk==='pojia')&&/寒|冰|雪|霜|玄冥|冷/.test(cn))return'hanbing';
  if(ATTACK_SK.has(a.sk))return a.sk;
  const w=artWeapon(a);
  if(/指/.test(cn))return'dianxue';if(/爪|钩/.test(cn))return'qinna';
  return{sword:'chuanxin',saber:'pizhan',fist:'zhenshan',staff:'hengsao',spear:'hengsao',whip:'hengsao',wheel:'hengsao',ring:'hengsao',pierce:'chuanxin',hook:'qinna',flute:'shihou',brush:'dianxue',bow:'chuanxin'}[w]||'lianhuan'}
/* the passive an inner art gives, from what it is called */
const NEI_PAS={huti:{n:T('Armour of qi','护体真气'),d:T('Takes less damage from physical blows','减少所受外力伤害')},huiqi:{n:T('Sea of qi','气海充盈'),d:T('Recovers qi faster each turn','每回合回复更多真气')},
  sheng:{n:T('Endless life','生生不息'),d:T('Heals a little every turn','每回合恢复少许气血')},baidu:{n:T('Proof against poison','百毒不侵'),d:T('Often shrugs off poison','常能化解毒性')},zhenqi:{n:T('Qi made visible','真气外放'),d:T('Inner-force blows hit harder','内力伤害更重')}};
function neiPasKey(a){const cn=a.cn||'',en=a.n||'';
  if(/罩|衫|金钟|铁布|金刚|不坏|硬功|铁/.test(cn)||/bell|shirt|iron|body/i.test(en))return'huti';
  if(/毒|蛊|避|百草|药/.test(cn)||/poison|venom/i.test(en))return'baidu';
  if(/春|生|长|养|龟|寿|愈/.test(cn)||/spring|life|turtle|heal/i.test(en))return'sheng';
  if(/息|吐纳|气海|周天|禅|坐|静/.test(cn)||/breath|meditat|zen/i.test(en))return'huiqi';
  if(/神|阳|阴|真|玄|混元|乾坤|太|罡|雷/.test(cn))return'zhenqi';
  let h=0;for(const ch of cn)h=(h*31+ch.charCodeAt(0))>>>0;return['huti','huiqi','sheng','baidu','zhenqi'][h%5]}
function neiPasVal(k,t,l){return{huti:.04+.02*t+.004*l,huiqi:2+1.2*t+.3*l,sheng:.008+.004*t+.001*l,baidu:.4+.12*t+.02*l,zhenqi:.05+.03*t+.007*l}[k]}
const pctTxt=(k,v)=>k==='huiqi'?`+${Math.round(v)}`:`${Math.round(v*(k==='sheng'?1000:100))/(k==='sheng'?10:1)}%`;
/* what a lightness art adds, by tier */
function qingFx(t,l){return{spd:Math.round(1+t+.25*l),dodge:.012*t+.001*l,first:t>=1?15+10*t:0,counter:t>=2?.08+.03*(t-2)+.006*l:0,extra:t>=3?.05+.004*l:0}}
function qingTxt(t,l){const q=qingFx(t,l),o=[];o.push(T(`speed +${q.spd+Math.round(1+t+l*.3)}, dodge +${Math.round((q.dodge+.005*(1+t)+.002*l)*100)}%`,`身法+${q.spd+Math.round(1+t+l*.3)}，闪避+${Math.round((q.dodge+.005*(1+t)+.002*l)*100)}%`));
  if(q.first)o.push(T('often moves first','常能抢先出手'));if(q.counter)o.push(T(`${Math.round(q.counter*100)}% counter after a dodge`,`闪开后${Math.round(q.counter*100)}%反击`));if(q.extra)o.push(T(`${Math.round(q.extra*100)}% chance of an extra move`,`${Math.round(q.extra*100)}%几率多动一次`));
  return T(o.map(x=>x.en).join('; '),o.map(x=>x.zh).join('，'))}
/* the weapon in your hands, as a class (null for none) */
function heldClass(s){const w=typeof eqItem==='function'?eqItem(s,'weapon'):null;return w&&W_CLASS[w.id]||null}
function artFits(s,a){const w=artWeapon(a);if(!w||w==='anqi')return false;const h=heldClass(s);return h===w||(w==='fist'&&!h)}
/* passives from a set of arts, for anyone */
function artPassives(arts){const p={};arts.forEach(a=>{const c=artCat(a),t=a.tier||0,l=a.lv??3;
  if(c==='nei'){const k=neiPasKey(a),v=neiPasVal(k,t,l);p[k]=Math.max(p[k]||0,v)}
  if(c==='qing'){const q=qingFx(t,l);['first','counter','extra'].forEach(k=>{if(q[k])p[k]=Math.max(p[k]||0,q[k])});if(l>=5)p.s_deft=Math.max(p.s_deft||0,l>=10?2:1)}
  if(c==='nei'&&l>=10)p.s_guard=Math.max(p.s_guard||0,1);if(c==='nei'&&l>=5&&neiPasKey(a)==='zhenqi')p.s_focus=Math.max(p.s_focus||0,1)});
  if(p.huti)p.huti=Math.min(.25,p.huti);if(p.baidu)p.baidu=Math.min(.95,p.baidu);if(p.sheng)p.sheng=Math.min(.05,p.sheng);return p}
(()=>{const y0=youFighter;youFighter=function(s){const f=y0(s);const use=combatArts(s),byName=new Map(use.map(a=>[a.cn,a]));
  f.skills=f.skills.map(x=>{if(x.innate||!x.label)return x;const a=byName.get(x.label.zh);if(!a)return x;const id=effSk(a);const fit=artFits(s,a);
    const l=artLv(a);return Object.assign({},x,{id,pw:(x.pw||1)*(fit?1.15:1),fit:fit?1:0,m5:l>=5?1:0,m10:l>=10?1:0})});
  f.pas=artPassives(use);
  use.forEach(a=>{if(artCat(a)!=='qing')return;const q=qingFx(a.tier||0,artLv(a));f.spd+=q.spd;f.dodge=clamp(f.dodge+q.dodge,0,.5)});
  return f}})();
/* people you fight use their arts the same way */
(()=>{const n0=npcFighter;npcFighter=function(nameT,lv,extra){if(extra&&extra.arts&&extra.arts.length){const arts=extra.arts.map(a=>Object.assign({},a,{sk:effSk(a)}));
    const f=n0.call(this,nameT,lv,Object.assign({},extra,{arts}));f.pas=artPassives(arts);return f}return n0.apply(this,arguments)}})();
/* what reaching 五成 and 十成 火候 adds, technique by technique */
const SK_MS={pizhan:[T('breaks 2 armour','破甲两层'),T('bleeding is worse','流血更重')],chuanxin:[T('builds 2 intent','剑意积两层'),T('intent bursts harder','剑意迸发更猛')],hengsao:[T('braces 2','铁壁两层'),T('also breaks armour','横扫时破甲')],
  zhenshan:[T('builds 2 force','蓄势两层'),T('stuns more often','更易震晕')],qinna:[T('3 weakness','力竭三层'),T('always draws blood','必定见血')],fenyan:[T('3 burning','灼烧三层'),T('adds a grave wound','附加重创')],hanbing:[T('3 chill','寒气三层'),T('drains qi','削去真气')],
  lianhuan:[T('blows draw blood more often','更易见血'),T('each use focuses you','每用一次凝神一层')],pojia:[T('breaks 3 armour','破甲三层'),T('breaks 4 armour','破甲四层')],longzhang:[T('adds a grave wound','附加重创'),T('stronger','威力更强')],jianqi:[T('builds sword intent','积累剑意'),T('stronger','威力更强')]};
function artMilestones(a){const c=artCat(a);if(c==='qing')return[T('start each fight nimble (1)','开战即灵动一层'),T('start nimble (2)','开战即灵动两层')];
  if(c==='nei')return[neiPasKey(a)==='zhenqi'?T('start each fight focused (1)','开战即凝神一层'):T('passive grows','被动增强'),T('start each fight braced (1)','开战即铁壁一层')];
  const m=SK_MS[effSk(a)];return m||[T('stronger','威力增强'),T('stronger still','威力再增')]}
/* everyone you fight has had the same schooling: a small lift so the new techniques do not make the world easier */
(()=>{const n0=npcFighter;npcFighter=function(){const f=n0.apply(this,arguments);if(f&&!f.you){f.atk=Math.round(f.atk*1.05);f.nei=Math.round(f.nei*1.05);f.maxHp=Math.round(f.maxHp*1.05);f.hp=f.maxHp}return f}})();
