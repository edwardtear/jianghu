/* 江湖一生 · activities that depend on the world, not a fixed menu: an arena only when someone holds one,
   sparring only with people you actually have, manuals only when you own one, and a scripture library only in the few
   sects that keep one */
'use strict';

/* ---------- the arena: someone has to put up a stage ---------- */
const ARENA_HOSTS=[
 [T('For the temple fair, a local magnate has put up an arena stage with prize silver.','庙会上，本地豪绅搭了擂台，设了彩头。')],
 [T('An escort agency has put up a stage to find new guards. Win and they will remember you.','一家镖局摆擂招镖师。赢了，他们会记住你。')],
 [T('A boxer from out of town has set up a stage, swearing no one in the county can beat him.','外地来的拳师摆下擂台，扬言全县没人打得过他。')],
 [T('Two rival martial halls settle their quarrel on a public stage, and anyone may join in.','两家武馆闹翻了，当众搭台比武，谁都可以上去。')],
 [T('The county celebrates a good year with a martial contest on the square.','县里为庆丰年，在广场上办了一场比武。')]];
const ARENA_P={central:.4,jiangnan:.4,capital:.45,shu:.3,north:.25,west:.18,miao:.15,east:.18};
function arenaNow(s){return s.arena&&s.arena.age===s.age?s.arena:null}
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive||s.age<14)return;
  if(chance(ARENA_P[s.region]??.3))s.arena={age:s.age,h:rint(0,ARENA_HOSTS.length-1),done:0}}})();
(()=>{const A=ACT_BY.arena;if(!A)return;const r0=A.run,c0=A.choose;
  A.if=s=>!!arenaNow(s);
  const ok0=A.ok;A.ok=s=>{const a=arenaNow(s);if(a&&a.done)return T('You have had your turn on this year’s stage','今年的擂台你已经上过了');return ok0?ok0(s):true};
  Object.defineProperty(A,'d',{get(){const s=typeof S!=='undefined'?S:null,a=s&&arenaNow(s);return a?ARENA_HOSTS[a.h][0]:T('Pick an opponent. Win silver and fame.','挑一个对手，赢银子和名声。')}});
  A.run=function(s){const a=arenaNow(s);if(a)a.done=1;return r0.call(A,s)}})();
/* hearing of a stage is news worth a line */
(()=>{const y=yearly;yearly=function(s){y(s);const a=arenaNow(s);if(a&&!a.told&&s.alive){a.told=1;const t=ARENA_HOSTS[a.h][0];say(s,'[Arena] '+t.en,'【擂台】'+t.zh,'news')}}})();

/* ---------- sparring: with people you actually have ---------- */
const HALL_REG=['central','jiangnan','capital','shu','north'];
function sparPartners(s){const out=[],p=Math.max(4,power(s));
  if(s.sect&&!s.retired){const sx=SECTS[s.sect];
    for(let i=0;i<2;i++){const sex=chance(.5)?'m':'f',n=genName(sex),older=chance(.5);
      const ttl=older?(sex==='m'?T('Senior brother','师兄'):T('Senior sister','师姐')):(sex==='m'?T('Junior brother','师弟'):T('Junior sister','师妹'));
      out.push({name:T(`${ttl.en} ${n.py}`,`${ttl.zh}${n.cn}`),lv:Math.max(3,Math.min(200,Math.round(p*(older?1.1+R()*.3:.65+R()*.25)))),sub:T(`Of ${sx.en}.`,`同门，${sx.cn}。`)})}}
  const known=living(s,['master','fellow','sworn','friend','sibling','spouse','disciple','rival','father','mother']).filter(x=>!x.temp&&x.age>=8&&x.age<75&&x.lv>=3&&!(typeof hostile==='function'&&hostile(x)));
  known.sort(()=>R()-.5).slice(0,2).forEach(x=>out.push({pid:x.id,name:pn(x),lv:x.lv}));
  if(!s.sect&&HALL_REG.includes(s.region)&&s.money>=5){
    [[T('a student at the martial hall','武馆里的学徒'),.85],[T('the martial hall’s instructor','武馆教头'),1.3]].forEach(([name,m],i)=>{if(i===1&&chance(.4))return;
      out.push({name,lv:Math.max(3,Math.min(i?75:40,Math.round(p*m*(.9+R()*.2)))),fee:5,sub:T('The martial hall charges 5 taels.','武馆收五两。')})})}
  return out}
(()=>{const A=ACT_BY.sparring;if(!A)return;const c0=A.choose;
  A.if=s=>s.age>=8&&((s.sect&&!s.retired)||living(s,['master','fellow','sworn','friend','sibling','spouse','disciple','rival','father','mother']).some(x=>!x.temp&&x.age>=8&&x.age<75&&x.lv>=3)||(!s.sect&&HALL_REG.includes(s.region)&&s.money>=5));
  A.run=function(s){const os=sparPartners(s);if(!os.length){say(s,'There is nobody to spar with today.','今天找不到人切磋。','muted');return}
    const c={opts:os};ask(s,'sparring',c,os.map((o,i)=>({k:'o'+i,l:T(o.name.en.replace(/^./,m=>m.toUpperCase()),o.name.zh),sub:o.sub||(o.pid?T('Someone you know.','你认识的人。'):null),fight:{foe:o.lv,me:power(s),stakes:'spar'}})))};
  A.choose=function(s,k,c){const o=c.opts[+String(k).slice(1)];if(o&&o.fee){if(s.money<o.fee){say(s,'You cannot pay the hall’s fee.','你付不起武馆的钱。','muted');return}pay(s,-o.fee)}return c0.call(A,s,k,c)}})();

/* ---------- manuals: the activity only exists when you have one to read ---------- */
(()=>{const A=ACT_BY.study;if(!A)return;A.if=s=>A.ok(s)===true})();

/* ---------- the scripture library: only a few great temples keep one ---------- */
const SECT_LIB={shaolin:T('the Sutra Pavilion','藏经阁'),emei:T('the Sutra Hall','藏经楼'),quanzhen:T('the Hall of Scriptures','藏经殿')};
(()=>{const A=ACT_BY.sectlib;if(!A)return;const ok0=A.ok;
  A.if=s=>!!s.sect&&!!SECT_LIB[s.sect]&&!s.retired;
  A.ok=s=>(s.rank||0)<1?T('Only inner disciples may enter','只有内门弟子才能进去'):ok0(s);
  Object.defineProperty(A,'n',{get(){const s=typeof S!=='undefined'?S:null,L=s&&SECT_LIB[s.sect];return L?T(`Study in ${L.en} (25 merit)`,`入${L.zh}研读（25贡献）`):T('Study in the sect library (25 merit)','入藏经阁研读（25贡献）')}});})();
INC_BY.sectlibrary&&(()=>{const i=INC_BY.sectlibrary,w0=i.when;i.when=s=>!!SECT_LIB[s.sect]&&(!w0||w0(s))})();

/* ---------- the rest of the menu, by the same rule: a thing is only on offer when the world would offer it ---------- */
const hideIf=(id,f)=>{const A=ACT_BY[id];if(!A)return;const i0=A.if;A.if=s=>(!i0||i0(s))&&f(s)};
const needOk=(id,f)=>{const A=ACT_BY[id];if(!A)return;const o0=A.ok;A.ok=s=>{const r=o0?o0(s):true;return r!==true?r:f(s)}};
/* you look for a master only when you have none, and a sect only when one nearby takes people like you */
hideIf('master',s=>!masterOf(s));
hideIf('joinsect',s=>!s.sect&&!s.retired&&localSects(s).length>0);
/* dark factions only recruit where they have a hall */
hideIf('joinevil',s=>!s.sect&&(EVIL_SECTS[s.region]||[]).length>0||s.wanted>=2);
/* nobody hands an assassination contract to a stranger */
hideIf('contract',s=>isEvil(s.sect)||s.align<=-20||s.wanted>0||s.job==='assassin');
/* robbing an armed convoy alone takes real skill; burglary takes light feet */
needOk('robconvoy',s=>power(s)<25&&!isEvil(s.sect)?T('Alone? You would need power 25+','单枪匹马劫镖，至少要功力25'):true);
needOk('burgle',s=>power(s)<10?T('Needs power 10+ to get over the walls','翻墙入院，至少要功力10'):true);
/* a banquet needs guests */
hideIf('banquet',s=>living(s,['friend','sworn','acq','fellow','sibling','master','disciple','spouse']).filter(p=>!p.temp).length>=2);
/* a famous physician is somewhere; this year you may hear where */
const DOC_P={capital:.4,jiangnan:.35,central:.3,shu:.3,north:.2,west:.15,miao:.25,east:.2};
const DOC_AT=[T('a mountain hermitage','山中草庐'),T('a temple three days away','三日路外的一座寺庙'),T('a boat on the river','江上一条船'),T('a herb garden in the next prefecture','邻府的一座药圃')];
function docNow(s){return s.doc&&s.doc.age===s.age?s.doc:null}
(()=>{const y=yearly;yearly=function(s){y(s);if(!s.alive)return;if(chance((DOC_P[s.region]??.25)+(s.fame>=60?.3:0)))s.doc={age:s.age,at:rint(0,DOC_AT.length-1)}}})();
(()=>{const A=ACT_BY.famousdoc;if(!A)return;hideIf('famousdoc',s=>!!docNow(s));
  Object.defineProperty(A,'d',{get(){const s=typeof S!=='undefined'?S:null,d=s&&docNow(s);return d?T(`A famous physician is said to be at ${DOC_AT[d.at].en}. 300 taels; cures almost anything.`,`听说有位神医在${DOC_AT[d.at].zh}。三百两，几乎药到病除。`):T('300 taels. Cures almost anything.','三百两。几乎药到病除。')}})})();
/* the examination halls do not admit women: a woman who sits must disguise herself, and being found out is a crime against the throne */
(()=>{const A=ACT_BY.exam;if(!A)return;const r0=A.run;
  Object.defineProperty(A,'d',{get(){const s=typeof S!=='undefined'?S:null;return s&&s.gender==='f'?T('Women may not sit. You could go disguised as a man; being found out is a crime against the throne.','女子不得应试。要考，只能女扮男装；被识破就是欺君之罪。'):T('Three days in a tiny cell. Held every third year.','号舍里考三天三夜。三年一考。')}});
  A.run=function(s){if(s.gender!=='f')return r0.call(A,s);
    if(chance(clamp(.35-s.smarts/400-s.t.luck*.015,.08,.35))){s.flags.exam=s.age;s.fame+=4;s.wanted=Math.min(5,(s.wanted||0)+1);s.health=Math.max(1,s.health-rint(8,15));
      say(s,'On the second day a proctor notices your ears are pierced. You are flogged and thrown out, and your name is posted at the gate. Half the town calls you shameless; the other half wants to meet you.','第二天，监考官注意到你耳朵上有耳洞。你挨了一顿板子，被逐出考场，名字贴在了贡院门口。半个城骂你不知羞耻，另外半个城都想见见你。','bad');return}
    const f0=s.flags.exam;r0.call(A,s);if(s.flags.exam&&s.flags.exam!==f0)s.deeds[s.deeds.length-1]=T('Passed the imperial examination disguised as a man','女扮男装，金榜题名')}})();
