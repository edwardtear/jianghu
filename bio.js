/* 江湖一生 · a biography at death, written from what actually happened: the record of choices, the people who stayed,
   the grudges left open. Nothing in it is invented; every sentence comes from the saved life. */
'use strict';
(()=>{const l0=leaveSect;leaveSect=function(s){if(s.sect){s.leftAt=s.age;s.leftSect=s.sect}return l0.apply(this,arguments)}})();

function biography(s){
  const he=s.gender==='f'?T('She','她'):T('He','他'),his=s.gender==='f'?T('her','她'):T('his','他'),reg=REGIONS.find(r=>r.id===((s.trail&&s.trail[0])||s.region))||region(s),fam=family(s);
  const EN=[],ZH=[];const add=(en,zh)=>{if(en)EN.push(en);if(zh)ZH.push(zh)};
  const nm=p=>T(p.n.py,p.n.cn),yrs=n=>T(`${n}`,cnNum(n));
  /* origins */
  const hp=s.hero&&person(s,s.hero.pid);
  add(`${s.name} was born in ${reg.en}, to ${fam.en}${hp?`, the child of the famous ${s.hero.ep.en} ${hp.n.py}`:''}.`,
      `${s.cn}生于${reg.cn}，${fam.cn}出身${hp?`，是名震一方的「${s.hero.ep.zh}」${hp.n.cn}的孩子`:''}。`);
  /* sect */
  const sid=s.sect||s.leftSect||s.flags.formerSect;
  if(sid&&SECTS[sid]){const left=!s.sect&&s.leftAt!=null;
    add(`At ${s.joinedAt??10} ${he.en.toLowerCase()} entered ${SECTS[sid].en}${s.rank>=3&&s.sect?`, and rose to ${rankName(s).en}`:''}${left?`; at ${s.leftAt} ${he.en.toLowerCase()} left it`:''}.`,
        `${cnNum(s.joinedAt??10)}岁入${SECTS[sid].cn}${s.rank>=3&&s.sect?`，后来做到了${rankName(s).zh}`:''}${left?`；${cnNum(s.leftAt)}岁那年离开了师门`:''}。`)}
  else if(s.age>=20)add(`${he.en} never belonged to a sect.`,`${he.zh}一生没有拜入任何门派。`);
  if(s.org)add(`${he.en} founded ${s.org.name.en}.`,`${he.zh}亲手创立了${s.org.name.zh}。`);
  /* the turning points, from the record: the ones that came back, and the ones that made a lasting tie */
  const close=['sworn','spouse','friend','disciple','lover'],hostileR=['enemy','rival'];
  const recs=(s.mem||[]).filter(r=>r.kind!=='met').map(r=>{const p=r.pid&&person(s,r.pid);let sc=(r.came||0)*3+(p?(close.includes(p.rel)?3:hostileR.includes(p.rel)?2:0):0)+(r.kind==='wronged'?1:0);return{r,p,sc}})
    .filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc||a.r.at-b.r.at).slice(0,3).sort((a,b)=>a.r.at-b.r.at);
  const V={helped:[['helped %N when it mattered','在要紧关头帮过%N'],['stood by %N in a hard hour','在%N最难的时候站了出来'],['did %N a kindness that was not forgotten','对%N施过一份没被忘记的恩']],
    wronged:[['wronged %N','亏欠了%N'],['did %N a wrong','做了一件对不起%N的事'],['crossed %N badly','狠狠得罪了%N']],
    beat:[['defeated %N','打败了%N'],['bested %N in a fight','在一场比斗里胜过了%N'],['beat %N in front of witnesses','当众赢了%N']],
    lostTo:[['lost to %N, and remembered it for years','败给了%N，这一败记了很多年'],['was beaten by %N','被%N打败了'],['fell before %N','栽在了%N手里']]},used={};
  /* only what is true at the end: the relationship as it stands, never a guess at what caused it */
  recs.forEach(({r,p})=>{const R=REGIONS.find(x=>x.id===r.reg),n=p?nm(p):T(r.who.n.py,r.who.n.cn),at=r.at,w=R?T(` in ${R.en}`,`在${R.cn}`):T('','');
    const k=r.kind,i=used[k]=(used[k]??-1)+1,v=V[k][i%V[k].length];
    const rl=p&&(close.includes(p.rel)||hostileR.includes(p.rel))?relLabel(s,p):null;
    let af=rl?[`By the end, ${n.en} was ${his.en} ${rl.en.toLowerCase()}.`,`到最后，${n.zh}是${his.zh}的${rl.zh}。`]:r.came?['Years later, it came back to find %M.','多年以后，这件事又找上了%H。']:['',''];
    const fill=(x,L)=>x.replace('%N',L==='en'?n.en:n.zh).replace('%H',L==='en'?his.en:his.zh).replace('%M',L==='en'?(s.gender==='f'?'her':'him'):his.zh);
    add(`At ${at}${w.en}, ${he.en.toLowerCase()} ${fill(v[0],'en')}. ${fill(af[0],'en')}`.trim(),`${cnNum(at)}岁那年${w.zh}，${he.zh}${fill(v[1],'zh')}。${fill(af[1],'zh')}`)});
  /* the people who stayed */
  const sp=s.people.find(p=>p.rel==='spouse'),sw=s.people.filter(p=>p.rel==='sworn'),dis=s.people.filter(p=>p.rel==='disciple'),kids=s.people.filter(p=>p.rel==='child');
  if(sp)add(`${he.en} married ${sp.n.py}${kids.length?` and raised ${kids.length} child${kids.length>1?'ren':''}`:''}.`,`${he.zh}与${sp.n.cn}结为夫妻${kids.length?`，养大了${kids.length===2?'两':cnNum(kids.length)}个孩子`:''}。`);
  else if(s.age>=30)add(`${he.en} never married.`,`${he.zh}终身未娶未嫁。`.replace('未娶未嫁',s.gender==='f'?'未嫁':'未娶'));
  if(sw.length)add(`${he.en} had ${sw.length} sworn sibling${sw.length>1?'s':''}: ${sw.slice(0,3).map(p=>p.n.py).join(', ')}.`,`${he.zh}有${sw.length===2?'两':cnNum(sw.length)}位结义${sw.every(p=>p.sex==='m')?'兄弟':sw.every(p=>p.sex==='f')?'姐妹':'兄弟姐妹'}：${sw.slice(0,3).map(p=>p.n.cn).join('、')}。`);
  if(dis.length)add(`${dis.length===1?'One disciple':dis.length+' disciples'} carried on what ${he.en.toLowerCase()} taught.`,`${dis.length===2?'两':cnNum(dis.length)}名弟子传下了${he.zh}的武功。`);
  /* martial art and name */
  const top=(s.arts||[]).slice().sort((a,b)=>(b.tier||0)-(a.tier||0))[0];
  add(`${he.en} reached the realm of ${rname(s)[2]}${top?`; ${his.en} finest art was ${top.n}`:''}. In the end ${he.en.toLowerCase()} was ${fameLabel(s.fame).en.toLowerCase()}.`,`修为至「${rname(s)[1]}」${top?`，最得意的武功是${top.cn}`:''}，${fameLabel(s.fame).zh}。`);
  /* what was left open */
  const enemies=s.people.filter(p=>p.alive&&p.rel==='enemy');const owed=(s.mem||[]).filter(r=>r.kind==='wronged'&&!r.came);
  if(enemies.length)add(`When ${he.en.toLowerCase()} died, ${enemies.length} sworn enem${enemies.length>1?'ies were':'y was'} still alive.`,`${he.zh}去世时，仍有${enemies.length===2?'两':cnNum(enemies.length)}个仇人在世。`);
  else if(owed.length)add(`Some of the people ${he.en.toLowerCase()} wronged never came back to collect.`,`${he.zh}亏欠过的一些人，始终没有回来讨这笔账。`);
  add(`${he.en} died at ${s.age}, of ${s.cause.en}.`,`享年${cnNum(s.age)}岁，${s.cause.zh}。`);
  return T(EN.join(' '),ZH.join(''));
}
