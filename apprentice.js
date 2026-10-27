/* 江湖一生 · an apprentice's 资质: every would-be disciple has bones (根骨) and insight (悟性), fixed for that person, and a
   temperament. You can see them before you decide to take someone on, and they decide how fast a disciple grows. */
'use strict';
function potOf(n){const nm=(n&&(n.n&&n.n.cn||n.zh||n.cn))||'?';const r=seeded('pot:'+nm+':'+(n&&n.sex||''));const roll=()=>clamp(Math.round(1+((r()+r()+r())/3)*9+(r()<.06?2:0)),1,10);return{root:roll(),wit:roll()}}
const potWord=v=>v>=9?T('one in ten thousand','万中无一'):v>=7?T('excellent','上佳'):v>=5?T('above average','中上'):v>=3?T('fair','尚可'):T('poor','平庸');
const TRAIT_LOYAL={devoted:1,upright:1,gentle:1,cheerful:.5,timid:.3,bold:.3,'a heavy drinker':0,eccentric:0,greedy:-.5,arrogant:-.5,cold:-.3,scheming:-1};
function potVerdict(o){const p=o.pot||potOf(o),tk=(TRAITS[o.trait]||TRAITS[0])[0],sum=p.root+p.wit,loy=TRAIT_LOYAL[tk]??0;
  const gift=sum>=16?T('a rare talent','难得的奇才'):sum>=12?T('worth teaching','值得一教'):sum>=8?T('ordinary, but trainable','资质平平，肯练也能成'):T('hard going','学起来会很吃力');
  const heart=loy>=1?T('likely to be loyal','多半忠心'):loy<=-.5?T('may not stay loyal','未必靠得住'):T('hard to say how loyal','忠心与否难说');
  return T(`${gift.en}; ${heart.en}`,`${gift.zh}，${heart.zh}`)}
function potHTML(o){const p=o.pot||potOf(o),Z=zh(),t=TRAITS[o.trait]||TRAITS[0];
  return`<div class="potbox"><b>${Z?'资质':'Potential'}</b> ${Z?'根骨':'Bones'}：${tr(potWord(p.root))}（${p.root}） · ${Z?'悟性':'Insight'}：${tr(potWord(p.wit))}（${p.wit}） · ${Z?'性情':'Temperament'}：${Z?t[1]:t[0]}<br><span class="muted">${tr(potVerdict(o))}</span></div>`}
/* a disciple keeps the potential they were seen with */
(()=>{const s0=storeNpc;storeNpc=function(s,c,rel,bond){const p=s0.apply(this,arguments);if(p&&rel==='disciple'&&!p.pot)p.pot=potOf(c&&c.npc||p);return p}})();
(()=>{const a=PACT_BY.disciple;if(!a)return;const r0=a.run;a.run=function(s,p){if(!p.pot)p.pot=potOf(p);return r0.apply(this,arguments)}})();
/* good bones and insight grow faster; poor ones slower */
(()=>{const y=yearly;yearly=function(s){const r=y.apply(this,arguments);if(!s.alive)return r;
  (s.people||[]).forEach(p=>{if(!p.alive||p.rel!=='disciple'||p.age>=40)return;const q=p.pot||(p.pot=potOf(p));const b=(q.root+q.wit-10)/5;if(b>0)p.lv+=Math.floor(b)+(chance(b%1)?1:0);else if(b<0&&chance(-b/2))p.lv=Math.max(1,p.lv-1)});return r}})();
(()=>{const a=PACT_BY.teachkid;if(!a)return;const r0=a.run;a.run=function(s,p){const r=r0.apply(this,arguments);if(p.rel==='disciple'){const q=p.pot||(p.pot=potOf(p));p.lv+=Math.max(0,Math.round((q.root+q.wit-10)/3))}return r}})();
