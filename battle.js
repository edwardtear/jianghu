/* 江湖一生 · battle: Namerena-style auto battles. A name decides your body; your level and arts decide the rest. */
'use strict';
const SK={
 jianqi:{n:T('Sword Qi','剑气纵横'),act:1},
 lianhuan:{n:T('Flurry','连环快剑'),act:1},
 dianxue:{n:T('Pressure Point','点穴'),act:1},
 xixing:{n:T('Life Drain','噬元大法'),act:1},
 anqi:{n:T('Hidden Darts','暗器'),act:1},
 poison:{n:T('Venom Palm','毒掌'),act:1},
 heal:{n:T('Healing Qi','运功疗伤'),act:1},
 jinzhong:{n:T('Golden Bell','金钟罩'),act:1},
 shihou:{n:T('Lion’s Roar','狮子吼'),act:1},
 lingbo:{n:T('Wave-Treading Step','踏波步'),act:1},
 kuangbao:{n:T('Berserk','狂暴'),act:1},
 shehun:{n:T('Soul Lure','摄魂大法'),act:1},
 pojia:{n:T('Armor Break','破甲'),act:1},
 neishang:{n:T('Heart Shock','震伤心脉'),act:1},
 fenshen:{n:T('Shadow Clone','分身'),act:1},
 kuaijian:{n:T('Gale Speed','疾风'),act:1},
 longzhang:{n:T('Dragon Palm','苍龙掌'),act:1},
 fanzhen:{n:T('Recoil','反震'),act:0},
 huiguang:{n:T('Last Light','回光返照'),act:0},
 yiyu:{n:T('Soft Redirect','以柔克刚'),act:0}
};
const SKD={
 jianqi:T('Heavy inner-power blow that cannot be dodged.','以内力伤敌，无法闪避。'),
 lianhuan:T('Two or more quick strikes; each can be dodged.','连出两招以上，每招都可被闪避。'),
 dianxue:T('Inner-power hit that may freeze the target for 1–2 turns.','内力伤敌，并可能令对手定身一至两回合。'),
 xixing:T('Inner-power hit that heals you for 60% of the damage.','内力伤敌，并吸回六成伤害为己用。'),
 anqi:T('One to three darts that cannot be dodged; may poison.','打出一至三枚暗器，无法闪避，可能带毒。'),
 poison:T('Inner-power hit plus poison for 3 turns.','内力伤敌，并使对手中毒三回合。'),
 heal:T('Below 55% health: recover health and cure poison.','气血低于五成五时，恢复气血并解毒。'),
 jinzhong:T('Raises a qi shield that absorbs damage.','罩上一层护体真气，抵挡伤害。'),
 shihou:T('Hits every enemy at once; may daze them.','同时伤及所有敌人，可能令其眩晕。'),
 lingbo:T('Greatly raises dodge for 3 turns.','三回合内大幅提高闪避。'),
 kuangbao:T('Below half health: attack up, defence down for 4 turns.','气血过半受损时，四回合内攻升防降。'),
 shehun:T('May confuse the target for 2 turns, so they hit their own side.','可能摄住对手心神两回合，使其敌我不分。'),
 pojia:T('Heavy strike that lowers the target’s defence for 3 turns.','重击，并在三回合内削弱对手防御。'),
 neishang:T('Inner-power hit that cuts maximum health by 8%.','内力伤敌，并削去对手一成弱的气血上限。'),
 fenshen:T('Once per fight, summons a shadow with 40% of your strength.','每场一次，分出一道四成功力的身影助战。'),
 kuaijian:T('Speed ×1.5 or more for 3 turns.','三回合内速度提升五成以上。'),
 longzhang:T('Very heavy inner-power blow.','极重的内力一击。'),
 fanzhen:T('Passive: throws part of any physical blow back at the attacker.','被动：反震部分外力伤害给出手者。'),
 huiguang:T('Passive: once per fight, rise again with about a third of your health.','被动：每场一次，倒下后以约三成气血重新站起。'),
 yiyu:T('Passive: a chance to turn a physical attack back on the attacker.','被动：有几率借力打力，把攻击还给对方。')
};
const SKILL_IDS=Object.keys(SK);

/* body from a name: always the same for the same name */
function genes(name){
  const r=seeded('jh:'+name),g=()=>.75+r()*.5;
  const gs={hp:g(),atk:g(),def:g(),spd:g(),agi:g(),nei:g(),res:g(),int:.2+r()*.22,lv:Math.round(30+r()*70)};
  const n=1+Math.floor(r()*3),pool=SKILL_IDS.slice(),inn=[];
  for(let i=0;i<n;i++){const k=pool.splice(Math.floor(r()*pool.length),1)[0];inn.push({id:k,lv:1+Math.floor(r()*3)})}
  gs.innate=inn;return gs;
}
/* the four attributes (力道 strength, 根骨 constitution, 身法 agility, 内功 inner force) decide every fighting stat;
   people who are not you get theirs from their level, shaped by their body */
const attrTotal=L=>20+L*.9;
function npcAttrs(g,L){const w={li:g.atk,gen:(g.hp+g.def)/2,shen:(g.spd+g.agi)/2,nei:(g.nei+g.res)/2},sw=w.li+w.gen+w.shen+w.nei,P=attrTotal(L),o={};for(const k in w)o[k]=Math.round(P*w[k]/sw);return o}
function mkFighter(name,L,g,skills,eq,A){
  eq=eq||{};A=A||npcAttrs(g,L);
  const f={name,team:0,lv:L,A,
    maxHp:Math.round(60+L*.6+A.gen*4.5+(eq.hp||0)),atk:Math.round(8+L*.2+A.li*1.2+(eq.atk||0)),def:Math.round(4+L*.1+A.gen*.7+(eq.def||0)),
    crit:clamp(.03+A.li*.0012,.03,.4),dodge:clamp(A.shen*.0035,0,.4),acc:A.shen*.0012,
    spd:Math.round(10+L*.05+A.shen*.3+(eq.spd||0)),agi:A.shen,nei:Math.round(6+L*.15+A.nei*1.1),res:Math.round(4+L*.1+A.gen*.4+A.nei*.3),
    mpMax:Math.round(20+A.nei*6),regen:Math.round((2+A.nei*.3)*10)/10,
    int:g.int*(1+Math.min(L,310)/310*.5)*1.15,skills:skills,st:{}};
  f.hp=f.maxHp;f.mp=f.mpMax;return f;
}
/* a name typed into the arena */
function nameFighter(name){
  const g=genes(name);
  return mkFighter(name,g.lv,g,g.innate.map(x=>({id:x.id,lv:x.lv,label:SK[x.id].n})));
}
/* someone in the story: a name pair and a level */
function npcFighter(nameT,lv,extra){
  const g=genes(nameT.zh||nameT);extra=extra||{};
  /* animals fight with tooth and claw; ordinary people only show a knack once they are real fighters */
  const inn=extra.beast||lv<15?[]:lv<40?g.innate.slice(0,1):g.innate;
  const skills=inn.map(x=>({id:x.id,lv:Math.min(4,lv<40?1:x.lv+(lv>120?1:0)),label:SK[x.id].n}));
  (extra.arts||[]).forEach(a=>skills.push({id:a.sk,lv:a.tier+1,label:T(a.n,a.cn)}));
  return mkFighter(nameT,lv,g,skills,extra.eq);
}
/* you: your name sets your body, power sets the scale, arts give techniques, gear adds the rest */
function youFighter(s){
  const g=genes(s.cn),L=Math.max(3,power(s));
  const skills=[];
  s.arts.forEach(a=>{if(a.sk&&!skills.some(x=>x.id===a.sk&&x.lv>a.tier))skills.push({id:a.sk,lv:a.tier+1,label:T(a.n,a.cn)})});
  /* the knack your name gives you only shows once you can actually fight (Third-rate and up) */
  if(g.innate[0]&&L>=15&&!skills.some(x=>x.id===g.innate[0].id))skills.push({id:g.innate[0].id,lv:1,label:SK[g.innate[0].id].n,innate:1});
  const eq=gearStats(s);
  const f=mkFighter(T(s.name,s.cn),L,g,skills,eq,typeof attrsOf==='function'?attrsOf(s):null);
  f.tough=Math.max(1,f.maxHp/s.maxHealth);f.maxHp=Math.round(s.maxHealth);f.hp=Math.max(1,Math.round(s.health));
  f.you=1;return f;
}

/* in a fight your health is shown on the same scale as everyone else's: real health × toughness. The fight is the
   same either way; afterwards fightLife converts what you lost back into real health */
function effFighter(f){const k=f.tough||1;f.k=k;f.maxHp=Math.round(f.maxHp*k);f.hp=Math.max(1,Math.round(f.hp*k));f.tough=1;return f}
/* ---------- the fight ---------- */
function runBattle(teams,opts){
  opts=opts||{};
  const F=[];teams.forEach((tm,ti)=>tm.forEach(f=>{f.team=ti;f.idx=F.length;f.gauge=R()*50;f.st={};F.push(f)}));
  const START=F.map(fstats);
  const frames=[];
  const hp=()=>F.map(f=>Math.max(0,Math.round(f.hp)));
  /* what each fighter is suffering from or benefiting by, shown on the battle screen */
  const stTags=f=>{const a=[],s=f.st||{};if(s.poison)a.push('poison');if(s.stun)a.push('stun');if(s.conf)a.push('conf');if(s.dodge)a.push('dodge');if(s.shield>0)a.push('shield');
    (s.buffs||[]).forEach(b=>a.push(b.k==='atk'?(b.m>1?'atkUp':'atkDown'):b.k==='def'?(b.m>1?'defUp':'defDown'):b.k==='spd'?(b.m>1?'spdUp':'spdDown'):''));
    if(f.mpMax&&f.mp<16)a.push('noqi');(f.conds||[]).forEach(k=>a.push('c_'+k));return a.filter(Boolean)};
  let over=false;
  const line=(en,zh,c,force)=>{if(over&&!force)return;frames.push({t:T(en,zh),hp:hp(),mx:F.map(f=>f.maxHp),mp:F.map(f=>Math.round(f.mp||0)),mmx:F.map(f=>f.mpMax||0),ss:F.map(stTags),c})};
  const nm=f=>'@'+f.idx+'@';
  const alive=t=>F.filter(f=>f.hp>0&&!f.out&&(t==null||f.team===t));
  const teamsAlive=()=>new Set(alive().map(f=>f.team)).size;
  const has=(f,id)=>f.skills.find(s=>s.id===id);
  const buff=(f,k)=>{let m=1;(f.st.buffs||[]).forEach(b=>{if(b.k===k)m*=b.m});return m};
  const pot=sk=>sk&&sk.pw?sk.pw:1+.28*((sk&&sk.lv||1)-1);
  const rnd=()=>.85+R()*.3;
  const eff=(d,v)=>Math.max(1,Math.round(v/(d&&d.tough||1)));
  const Y={spar:.5,light:.4,injury:.3}[opts.stakes];
  if(Y)F.forEach(f=>f.yieldAt=Math.round(Math.min(Y*f.maxHp,f.hp*.6)));
  const lbl=sk=>sk.label;
  function enemyOf(a){const es=alive().filter(f=>f.team!==a.team);return es.length?pick(es):null}
  function kill(d,by){
    const hg=has(d,'huiguang');
    if(hg&&!d.st.revived){d.st.revived=1;d.hp=Math.round(d.maxHp*(.25+.08*hg.lv));line(`${nm(d)} falls, then rises again with 【${lbl(hg).en}】!`,`${nm(d)}倒下了，却以【${lbl(hg).zh}】重新站起！`,'gold');return}
    line(`${nm(d)} is defeated.`,`${nm(d)}倒下了。`,'bad');if(teamsAlive()<=1)over=true;
  }
  function hurt(a,d,amt,phys){
    if(over||d.hp<=0)return 0;
    if(d.out)return 0;
    if(d.st.shield>0){const ab=Math.min(d.st.shield,amt);d.st.shield-=ab;amt-=ab;if(ab>0&&amt<=0){line(`${nm(d)}’s qi shield absorbs the blow.`,`${nm(d)}的护体真气挡下了这一击。`);return 0}}
    d.hp-=amt;if(a&&amt>0){if(phys){if(amt>d.maxHp*.16)d.bigHits=(d.bigHits||0)+1}else d.qiTaken=(d.qiTaken||0)+amt}
    if(phys&&a&&a.hp>0&&!a.out){const fz=has(d,'fanzhen');if(fz&&d.hp>0){const back=eff(a,amt*(d.tough||1)*.12*pot(fz));a.hp-=back;line(`【${lbl(fz).en}】 throws <i>${back}</i> back at ${nm(a)}.`,`【${lbl(fz).zh}】反震，${nm(a)}受到<i>${back}</i>点伤害。`);down(a)}}
    down(d);
    return amt;
  }
  /* out of the fight: a friendly or dangerous bout ends when someone yields; only real fights kill */
  function down(d){
    if(d.out||!(d.hp<=0||(d.yieldAt!=null&&d.hp<=d.yieldAt)))return;
    if(d.yieldAt!=null){d.hp=Math.max(1,d.hp);d.out=1;line(`${nm(d)} can fight no more and yields.`,`${nm(d)}支撑不住，认输了。`,'bad');if(teamsAlive()<=1)over=true;return}
    kill(d);
  }
  function strike(a,d,m,label){
    if(over||!d||d.hp<=0||d.out||a.hp<=0||a.out)return;
    const dodge=clamp(.03+(d.dodge||0)*(d.st.dodge?1.6:1)+(d.st.dodge?.18:0)-(a.acc||0),.02,.55);
    if(R()<dodge){line(`${nm(d)} slips aside${label?'':''}.`,`${nm(d)}身形一晃，闪开了。`);return}
    const yy=has(d,'yiyu');
    if(yy&&R()<.1+.05*yy.lv){const dmg=eff(a,a.atk*m*rnd()*.6);line(`${nm(d)} turns the force aside with 【${lbl(yy).en}】; ${nm(a)} takes <i>${dmg}</i>.`,`${nm(d)}以【${lbl(yy).zh}】借力打力，${nm(a)}反受<i>${dmg}</i>点伤害。`);hurt(d,a,dmg,false);return}
    let dmg=Math.max(1,Math.round(a.atk*buff(a,'atk')*m*rnd()*60/(60+d.def*buff(d,'def'))));
    const crit=R()<(a.crit??.05);if(crit)dmg=Math.round(dmg*1.6);
    dmg=eff(d,dmg);
    line(`${nm(a)} hits ${nm(d)} for <i>${dmg}</i>.${crit?' Critical!':''}`,`${nm(a)}击中${nm(d)}，造成<i>${dmg}</i>点伤害。${crit?'会心一击！':''}`,crit?'crit':'');
    hurt(a,d,dmg,true);
  }
  const neiRaw=(a,d,m)=>a.nei*m*rnd()*60/(60+d.res);
  const neiDmg=(a,d,m)=>eff(d,neiRaw(a,d,m));
  function useSkill(a,sk){
    const P=pot(sk),L=lbl(sk),d=enemyOf(a);
    const say=(en,zh,c)=>line(`${nm(a)} uses 【${L.en}】! ${en}`,`${nm(a)}使出【${L.zh}】！${zh}`,c||'sk');
    switch(sk.id){
      case'jianqi':case'longzhang':{if(!d)return false;const dm=neiDmg(a,d,(sk.id==='longzhang'?1.75:1.3)*P);say(`${nm(d)} takes <i>${dm}</i>.`,`${nm(d)}受到<i>${dm}</i>点伤害。`);hurt(a,d,dm,false);return true}
      case'lianhuan':{if(!d)return false;const n=2+Math.floor(R()*(1+sk.lv));line(`${nm(a)} unleashes 【${L.en}】: ${n} blows!`,`${nm(a)}施展【${L.zh}】，连出${cnNum(n)}招！`,'sk');for(let i=0;i<n;i++){if(over)break;const t=d.hp>0&&!d.out?d:enemyOf(a);if(!t)break;strike(a,t,.5+.05*sk.lv)}return true}
      case'dianxue':{if(!d||d.st.stun)return false;const dm=neiDmg(a,d,.55*P);const ok=R()<.55+.08*sk.lv;say(ok?`${nm(d)} is frozen in place (<i>${dm}</i>).`:`${nm(d)} shakes it off (<i>${dm}</i>).`,ok?`${nm(d)}被点中穴道，动弹不得（<i>${dm}</i>）。`:`${nm(d)}运气冲开了穴道（<i>${dm}</i>）。`);if(ok)d.st.stun=1+(sk.lv>=3?1:0);hurt(a,d,dm,false);return true}
      case'xixing':{if(!d)return false;d.drained=1;const raw=neiRaw(a,d,.9*P);const dm=eff(d,raw);const h=Math.max(1,Math.round(raw*.6/(a.tough||1)));a.hp=Math.min(a.maxHp,a.hp+h);say(`${nm(a)} drains <i>${dm}</i> and recovers ${h}.`,`${nm(a)}吸走<i>${dm}</i>点，自身恢复${h}。`);hurt(a,d,dm,false);return true}
      case'anqi':{if(!d)return false;const n=1+Math.floor(R()*3);let tot=0;for(let i=0;i<n;i++)tot+=eff(d,a.atk*.45*P*rnd()*60/(60+d.def));const po=R()<.3;if(po)d.st.poison={d:eff(d,a.nei*.15*P+2),t:3};say(`${n===1?'A dart strikes':n+' darts strike'} ${nm(d)} for <i>${tot}</i>${po?', poisoned':''}.`,`${cnNum(n)}枚暗器打中${nm(d)}，共<i>${tot}</i>点伤害${po?'，还淬了毒':''}。`);hurt(a,d,tot,false);return true}
      case'poison':{if(!d||d.st.poison)return false;const dm=neiDmg(a,d,.55*P);d.st.poison={d:eff(d,a.nei*.22*P+2),t:3};say(`${nm(d)} takes <i>${dm}</i> and is poisoned.`,`${nm(d)}受到<i>${dm}</i>点伤害，中了剧毒。`,'bad');hurt(a,d,dm,false);return true}
      case'heal':{if(a.hp>a.maxHp*.55)return false;const h=Math.round(a.maxHp*(.18+.05*sk.lv));a.hp=Math.min(a.maxHp,a.hp+h);delete a.st.poison;say(`${nm(a)} recovers <i>${h}</i>.`,`${nm(a)}恢复了<i>${h}</i>点气血。`,'good');return true}
      case'jinzhong':{if(a.st.shield>0)return false;a.st.shield=Math.round(a.nei*1.3*P/(a.tough||1));say(`A shield of qi (${a.st.shield}) surrounds ${nm(a)}.`,`周身罩上一层护体真气（${a.st.shield}）。`,'good');return true}
      case'shihou':{const es=alive().filter(f=>f.team!==a.team);if(!es.length)return false;say('The roar shakes everyone.','声震四野！');es.forEach(e=>{if(over||e.out||e.hp<=0)return;const dm=neiDmg(a,e,.65*P);const dz=R()<.22;if(dz)e.st.stun=1;line(`${nm(e)} takes <i>${dm}</i>${dz?' and reels':''}.`,`${nm(e)}受到<i>${dm}</i>点伤害${dz?'，头晕目眩':''}。`);hurt(a,e,dm,false)});return true}
      case'lingbo':{if(a.st.dodge)return false;a.st.dodge=3;say(`${nm(a)} moves like drifting smoke.`,`${nm(a)}身形飘忽，如烟似雾。`,'good');return true}
      case'kuaijian':{if((a.st.buffs||[]).some(b=>b.k==='spd'))return false;(a.st.buffs=a.st.buffs||[]).push({k:'spd',m:1.5+.1*sk.lv,t:3});say(`${nm(a)} speeds up.`,`${nm(a)}身法陡然加快。`,'good');return true}
      case'kuangbao':{if(a.hp>a.maxHp*.5||(a.st.buffs||[]).some(b=>b.k==='atk'))return false;(a.st.buffs=a.st.buffs||[]).push({k:'atk',m:1.4+.1*sk.lv,t:4},{k:'def',m:.7,t:4});say(`${nm(a)}’s eyes turn red.`,`${nm(a)}双目赤红，状若疯虎。`,'bad');return true}
      case'shehun':{if(!d||d.st.conf)return false;const dm=neiDmg(a,d,.35*P);const ok=R()<.5+.08*sk.lv;if(ok)d.st.conf=2;say(ok?`${nm(d)} loses their mind (<i>${dm}</i>).`:`${nm(d)} resists (<i>${dm}</i>).`,ok?`${nm(d)}心神被摄，敌我不分（<i>${dm}</i>）。`:`${nm(d)}守住了心神（<i>${dm}</i>）。`);hurt(a,d,dm,false);return true}
      case'pojia':{if(!d)return false;line(`${nm(a)} uses 【${L.en}】!`,`${nm(a)}使出【${L.zh}】！`,'sk');strike(a,d,1.1*P);if(d.hp>0&&!d.out&&!over){(d.st.buffs=d.st.buffs||[]).push({k:'def',m:.6,t:3});line(`${nm(d)}’s guard is broken.`,`${nm(d)}的防御被破。`)}return true}
      case'neishang':{if(!d)return false;const dm=neiDmg(a,d,1*P);const cut=Math.round(d.maxHp*.08);d.maxHp-=cut;d.hp=Math.min(d.hp,d.maxHp);say(`${nm(d)} takes <i>${dm}</i>; ${d.sex===undefined?'their':'their'} meridians are hurt (max HP -${cut}).`,`${nm(d)}受到<i>${dm}</i>点伤害，心脉受损（气血上限-${cut}）。`,'bad');hurt(a,d,dm,false);return true}
      case'fenshen':{if(a.st.cloned||a.clone)return false;a.st.cloned=1;const c=Object.assign({},a,{st:{},skills:a.skills.filter(x=>x.id!=='fenshen'),clone:1,gauge:0});
        c.name=typeof a.name==='string'?a.name+'·影':T(a.name.en+'’s shadow',a.name.zh+'·影');c.maxHp=Math.round(a.maxHp*.4);c.hp=c.maxHp;c.yieldAt=null;c.out=0;c.atk=Math.round(a.atk*.6);c.nei=Math.round(a.nei*.6);c.idx=F.length;F.push(c);
        frames.push({add:{name:c.name,team:c.team,maxHp:c.maxHp},hp:hp(),mx:F.map(f=>f.maxHp),t:T(`${nm(a)} uses 【${L.en}】! A shadow steps out of ${nm(a)}.`,`${nm(a)}使出【${L.zh}】！一道身影从${nm(a)}身上分了出来。`),c:'sk'});return true}
    }
    return false;
  }
  function act(a){
    const st=a.st;
    if(st.poison){a.poisoned=1;const p=st.poison;line(`Poison eats at ${nm(a)} (<i>${p.d}</i>).`,`${nm(a)}毒性发作，损失<i>${p.d}</i>点气血。`,'bad');hurt(null,a,p.d,false);if(--p.t<=0)delete st.poison;if(a.hp<=0||a.out||over)return}
    if(st.buffs){st.buffs.forEach(b=>b.t--);st.buffs=st.buffs.filter(b=>b.t>0)}
    if(st.dodge&&--st.dodge<=0)delete st.dodge;
    if(st.stun){st.stun--;line(`${nm(a)} cannot move.`,`${nm(a)}动弹不得。`);return}
    if(st.conf){a.shaken=1;st.conf--;const others=alive().filter(f=>f!==a&&f.team===a.team);const t=others.length?pick(others):a;
      if(t===a){const dm=eff(a,a.atk*.6*rnd());line(`${nm(a)}, confused, strikes themself for <i>${dm}</i>.`,`${nm(a)}神志不清，一掌拍在自己身上，损失<i>${dm}</i>点气血。`);hurt(null,a,dm,false)}
      else{line(`${nm(a)}, confused, attacks an ally!`,`${nm(a)}神志不清，竟向同伴出手！`);strike(a,t,1)}return}
    const acts=shuffle(a.skills.filter(x=>SK[x.id]&&SK[x.id].act));
    if(a.mpMax)a.mp=Math.min(a.mpMax,a.mp+a.regen);
    for(const sk of acts){const cost=12+4*(sk.lv||1);if(a.mpMax&&a.mp<cost)continue;if(R()<a.int*.6&&useSkill(a,sk)){if(a.mpMax)a.mp-=cost;return}}
    strike(a,enemyOf(a),1);
  }
  const names=F.map(f=>f.name);
  line(opts.open?opts.open.en:'The fight begins.',opts.open?opts.open.zh:'交手开始。','muted');
  let guard=0;
  while(teamsAlive()>1&&guard++<600){
    let ready=alive().filter(f=>f.gauge>=100);
    if(!ready.length){alive().forEach(f=>f.gauge+=f.spd*buff(f,'spd'));continue}
    ready.sort((x,y)=>y.gauge-x.gauge);
    const a=ready[0];a.gauge-=100;act(a);
    if(frames.length>420)break;
  }
  let winner;
  if(teamsAlive()===1)winner=alive()[0].team;
  else{const sc=teams.map((_,ti)=>F.filter(f=>f.team===ti).reduce((t,f)=>t+Math.max(0,f.hp)/f.maxHp,0));winner=sc.indexOf(Math.max(...sc));
    line('Both sides are spent. The judges call it.','双方力竭，由旁人判定胜负。','muted',1)}
  const wn=alive(winner).filter(f=>!f.clone)[0]||F.find(f=>f.team===winner);
  line(`${nm(wn)}${teams[winner].length>1?'’s side':''} wins.`,`${nm(wn)}${teams[winner].length>1?'一方':''}获胜。`,'gold',1);
  return{winner,frames,fighters:F.map(f=>({name:f.name,team:f.team,maxHp:f.maxHp,k:f.k,mpMax:f.mpMax||0,conds:f.conds||[],you:f.you,clone:f.clone,skills:f.skills.map(x=>({label:x.label,id:x.id,lv:x.lv,innate:x.innate})),lv:f.lv,st:START[f.idx]||fstats(f)})),
    names,final:F.map(f=>({hp:Math.max(0,f.hp),maxHp:f.maxHp,you:f.you}))};
}

/* the numbers shown on cards: taken before the fight starts */
/* chance per turn of using some technique: each active technique gets its own roll */
function techRate(f){const n=(f.skills||[]).filter(x=>SK[x.id]&&SK[x.id].act).length;return Math.round(100*(1-Math.pow(1-f.int*.6,n)))}
function fstats(f){return{lv:Math.round(f.lv),tough:Math.round((f.tough||1)*10)/10,hp:f.maxHp,atk:f.atk,def:f.def,crit:Math.round((f.crit||0)*100),dodge:Math.round((f.dodge||0)*100),spd:f.spd,mp:f.mpMax||0,nei:f.nei,res:f.res,agi:f.agi,int:techRate(f)}}
/* quick estimate for betting odds */
function winRate(mkA,mkB,n){let w=0;for(let i=0;i<n;i++){if(runBattle([[mkA()],[mkB()]]).winner===0)w++}return w/n}
