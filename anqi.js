/* 江湖一生 · hidden weapons (暗器): one kind ready in the pouch at a time, with a count that runs down.
   Anyone can throw a stone; knives and needles only really bite in trained hands; poison works best and costs you your name. */
'use strict';
Object.assign(ITEMS,{
 darts:{cat:'anqi',n:T('Throwing Stones','飞蝗石'),price:15,cnt0:10,dmg:.06,sk:1.3,desc:T('A bag of ten. Anyone can throw them; they do a little.','一袋十枚。谁都会扔，伤不了多少。')},
 xiujian:{cat:'anqi',n:T('Sleeve Arrows','袖箭'),price:70,cnt0:8,dmg:.11,sk:1.3,desc:T('Eight bolts from a spring tube. Strong even untrained.','簧管里八支短箭。不会暗器的人用也有劲。')},
 feidao:{cat:'anqi',n:T('Willow-Leaf Knives','柳叶飞刀'),price:90,cnt0:12,dmg:.05,sk:3,desc:T('Twelve knives. Weak in untrained hands, deadly with a hidden-weapon art.','十二把。不会暗器的人扔不出名堂，会的人用来极狠。')},
 yinzhen:{cat:'anqi',n:T('Silver Needles','银针'),price:60,cnt0:20,dmg:.04,sk:3.2,desc:T('Twenty needles. Almost useless untrained; in a Tang hand, terrible.','二十根。不会的人几乎没用；到了行家手里，可怕得很。')},
 duji:{cat:'anqi',n:T('Poisoned Caltrops','毒蒺藜'),price:140,cnt0:6,dmg:.08,sk:1.6,poison:1,rare:.4,desc:T('Six, venom-soaked. Very effective; the righteous call it a coward’s weapon.','六枚，喂过毒。极管用，可名门正派都说这是小人的兵器。')}});
SLOTS.anqi='dmg';
['xiujian','feidao','yinzhen','duji'].forEach(id=>{if(!MARKET.includes(id))MARKET.push(id)});
const anqiSkill=s=>(s.arts||[]).some(a=>a.sk==='anqi');
/* buying more of what you already carry tops up the pouch */
(()=>{const b0=buy;buy=function(s,id){const n=s.items.length;const r=b0(s,id);const d=itemDef(id);
  if(r===true&&d&&d.cat==='anqi'&&s.items.length>n){const it=s.items[s.items.length-1];it.cnt=d.cnt0;const old=s.items.find(x=>x!==it&&x.id===id);if(old){old.cnt=(old.cnt??d.cnt0)+d.cnt0;s.items.splice(s.items.indexOf(it),1)}}
  return r}})();
(()=>{const sp=sellPrice;sellPrice=function(s,it){const d=itemDef(it.id);const p=sp(s,it);return d&&d.cat==='anqi'&&d.cnt0?Math.round(p*(it.cnt??d.cnt0)/d.cnt0):p}})();
/* in a real fight, a volley from the pouch before the first exchange */
(()=>{const rb=runBattle;runBattle=function(teams,opts){
  const ctx=FIGHT_CTX,me=teams[0]&&teams[0][0];const pre=[];
  if(ctx&&me&&me.you&&ctx.stakes!=='spar'&&ctx.s){const s=ctx.s,foes=teams.slice(1).flat(),e=eqItem(s,'anqi');
    if(e&&foes.length){const it=s.items.find(x=>x.eq&&itemDef(x.id).cat==='anqi');const sk=anqiSkill(s);
      if(it&&chance(sk?.85:.6)){const f0=foes[0];let d=Math.round(f0.maxHp*e.dmg*(sk?e.sk:1)*(.8+R()*.4));if(e.poison)d+=Math.round(f0.maxHp*.05);
        f0.hp=Math.max(1,f0.hp-d);it.cnt=(it.cnt??e.cnt0)-1;if(it.cnt<=0)s.items.splice(s.items.indexOf(it),1);
        pre.push(sk?T(`Before the first exchange your ${e.n.en.toLowerCase()} are already in the air: ${d} damage.`,`还没交手，你的${e.n.zh}已经出手了，伤敌${d}点。`)
          :T(`You throw ${e.n.en.toLowerCase()} first: ${d} damage.`,`你先扔出${e.n.zh}，伤敌${d}点。`));
        if(e.poison){s.align=clamp(s.align-2,-100,100);if(s.fame>=30&&chance(.3)){s.fame=Math.max(0,s.fame-2);pre.push(T('Word gets around that you fight with poison.','江湖上传开了：说你暗箭伤人，用的还是毒。'))}}}}}
  const r=rb(teams,opts);
  if(pre.length&&r.frames.length){const f0=r.frames[0];pre.reverse().forEach(t=>r.frames.unshift(Object.assign({},f0,{t,c:'sk'})))}
  return r}})();
