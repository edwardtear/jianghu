/* 江湖一生 · sound. Everything is made in the browser with the Web Audio API: no audio files, nothing to download.
   Music: a plucked qin-like string, a breathy xiao-like flute and the odd temple bell, composed as it plays on Chinese
   pentatonic modes, so it never loops the same way. Its mood follows the life: sparse and bright in childhood, fuller
   in your prime, slow and low in old age, darker when you are hurt or walking a crooked road. Effects: taps, the turn of
   a year, silver, good and bad news, breakthroughs, fights, and a bell when a life ends.
   Browsers allow sound only after the player has touched the page, so nothing plays before the first tap. */
'use strict';
const SND={ctx:null,master:null,music:null,sfx:null,verb:null,on:{music:true,sfx:true},vol:1,next:0,timer:null,step:0,last:null,phrase:[],lastMoney:null,lastLines:null};
try{const o=JSON.parse(localStorage.getItem('jh4_snd')||'null');if(o){SND.on.music=o.music!==false;SND.on.sfx=o.sfx!==false;if(typeof o.vol==='number')SND.vol=o.vol}}catch(e){}
const sndSave=()=>{try{localStorage.setItem('jh4_snd',JSON.stringify({music:SND.on.music,sfx:SND.on.sfx,vol:SND.vol}))}catch(e){}};

function sndInit(){if(SND.ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  const c=SND.ctx=new AC();SND.master=c.createGain();SND.master.gain.value=SND.vol;
  /* a gentle limiter so nothing ever clips */
  const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;comp.attack.value=.004;comp.release.value=.25;
  SND.master.connect(comp);comp.connect(c.destination);
  SND.music=c.createGain();SND.music.gain.value=SND.on.music?.6:0;SND.music.connect(SND.master);
  SND.sfx=c.createGain();SND.sfx.gain.value=SND.on.sfx?.55:0;SND.sfx.connect(SND.master);
  /* a hall-like reverb from decaying noise */
  const len=c.sampleRate*2.6,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  SND.verb=c.createConvolver();SND.verb.buffer=ir;const vg=c.createGain();vg.gain.value=.32;SND.verb.connect(vg);vg.connect(SND.master);
  return true}
const now=()=>SND.ctx.currentTime;
function out(node,bus,wet){node.connect(bus);if(wet){const g=SND.ctx.createGain();g.gain.value=wet;node.connect(g);g.connect(SND.verb)}}
function noiseBuf(){if(SND.nb)return SND.nb;const c=SND.ctx,b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return SND.nb=b}
function env(g,t,a,peak,dec,sus){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(Math.max(.0001,sus||.0001),t+a+dec)}

/* ---------- instruments ---------- */
/* a plucked silk string: bright attack, a filter that closes as it rings, and sometimes a slide into the note (滑音) */
function qin(f,t,dur,vel,bus,slide){const c=SND.ctx;const g=c.createGain(),lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=1.2;
  lp.frequency.setValueAtTime(Math.min(6000,f*9),t);lp.frequency.exponentialRampToValueAtTime(Math.max(300,f*1.6),t+dur*.8);
  [[1,'triangle',1],[2,'sine',.35],[3.01,'sine',.12]].forEach(([m,w,a])=>{const o=c.createOscillator();o.type=w;
    if(slide){o.frequency.setValueAtTime(f*m*Math.pow(2,-slide/12),t);o.frequency.exponentialRampToValueAtTime(f*m,t+.12)}else o.frequency.setValueAtTime(f*m,t);
    const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.1)});
  env(g,t,.005,vel,dur);lp.connect(g);out(g,bus||SND.music,.45)}
/* an end-blown bamboo flute: soft attack, slow vibrato, a little breath */
function xiao(f,t,dur,vel){const c=SND.ctx;const g=c.createGain(),o=c.createOscillator(),v=c.createOscillator(),vg=c.createGain();o.type='sine';o.frequency.value=f;
  v.frequency.value=4.6;vg.gain.value=f*.006;v.connect(vg);vg.connect(o.frequency);
  const n=c.createBufferSource();n.buffer=noiseBuf();n.loop=true;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2;bp.Q.value=3;const ng=c.createGain();ng.gain.value=.18;n.connect(bp);bp.connect(ng);ng.connect(g);
  o.connect(g);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vel,t+.35);g.gain.setValueAtTime(vel,t+dur-.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  [o,v,n].forEach(x=>{x.start(t);x.stop(t+dur+.05)});out(g,SND.music,.6)}
/* a small temple bell, or a big one */
function bell(f,t,vel,bus,long){const c=SND.ctx;[[1,1],[2.76,.45],[5.4,.22],[8.93,.1]].forEach(([m,a])=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f*m;
  env(g,t,.003,vel*a,(long?6:2.4)/Math.sqrt(m));o.connect(g);out(g,bus||SND.music,.7);o.start(t);o.stop(t+(long?6.5:3))})}
function gong(t,vel){const c=SND.ctx;[[110,1],[163,.6],[237,.45],[311,.3],[452,.18]].forEach(([f,a])=>{const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f*1.02,t);o.frequency.exponentialRampToValueAtTime(f,t+1.5);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vel*a,t+.25);g.gain.exponentialRampToValueAtTime(.0001,t+4.5);o.connect(g);out(g,SND.sfx,.6);o.start(t);o.stop(t+4.6)})}
function drum(t,vel,f0){const c=SND.ctx;const o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(f0||120,t);o.frequency.exponentialRampToValueAtTime(42,t+.3);env(g,t,.004,vel,.45);o.connect(g);out(g,SND.sfx,.25);o.start(t);o.stop(t+.6)}
function noiseHit(t,vel,freq,dur,q,type){const c=SND.ctx;const n=c.createBufferSource();n.buffer=noiseBuf();const f=c.createBiquadFilter();f.type=type||'bandpass';f.frequency.value=freq;f.Q.value=q||1;const g=c.createGain();env(g,t,.002,vel,dur);n.connect(f);f.connect(g);out(g,SND.sfx,.2);n.start(t);n.stop(t+dur+.05)}
function metal(t,vel){const c=SND.ctx;[1,1.48,2.21,3.07].forEach((m,i)=>{const o=c.createOscillator(),g=c.createGain();o.type='square';o.frequency.value=1650*m*(0.98+Math.random()*.04);env(g,t,.001,vel*.12/(i+1),.25+Math.random()*.15);
  const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1200;o.connect(hp);hp.connect(g);out(g,SND.sfx,.35);o.start(t);o.stop(t+.5)});noiseHit(t,vel*.5,3500,.08,2)}

/* ---------- music ---------- */
/* five-note modes: 宫 (bright), 徵, 羽 (melancholy), 商 */
const MODES={gong:[0,2,4,7,9],zhi:[0,2,5,7,10],yu:[0,3,5,7,10],shang:[0,2,5,7,9]};
const midiF=m=>440*Math.pow(2,(m-69)/12);
function mood(){const s=typeof S!=='undefined'?S:null;if(!s||s.age<0)return{mode:'gong',root:62,gap:.62,dens:.45,reg:12,xiao:.1,bell:.04,lp:1};
  const hurt=s.health<s.maxHealth*.45||(s.ill&&s.ill!=='cold'),dark=s.align<=-35||(s.sect&&SECTS[s.sect]&&SECTS[s.sect].evil),old=s.age>=60,kid=s.age<14;
  return{mode:dark?'yu':hurt?'shang':kid?'gong':old?'zhi':(s.happy>=60?'gong':'zhi'),root:dark?57:old?55:kid?64:60,gap:old?.9:kid?.6:s.age<40?.5:.7,
    dens:old?.32:kid?.4:.55,reg:old?7:12,xiao:old||hurt?.25:.15,bell:dark?.02:.05,lp:hurt?.8:1}}
function compose(m){/* a phrase: a few notes moving mostly by step, ending on a long note near the tonic */
  const sc=MODES[m.mode],len=4+Math.floor(Math.random()*5),ph=[];let idx=2+Math.floor(Math.random()*4);
  for(let i=0;i<len;i++){idx+=[-2,-1,-1,1,1,2,0][Math.floor(Math.random()*7)];idx=Math.max(0,Math.min(9,idx));const oct=Math.floor(idx/5),deg=sc[idx%5];
    ph.push({m:m.root+deg+12*oct-(m.reg<10?12:0),d:Math.random()<.25?2:1,slide:Math.random()<.18?2:0})}
  ph[ph.length-1].d=3;ph[ph.length-1].m=m.root+(Math.random()<.5?0:sc[2]);return ph}
function musicTick(){if(!SND.ctx||!SND.on.music)return;const c=SND.ctx;const ahead=c.currentTime+.6;
  while(SND.next<ahead){const m=mood();const t=Math.max(SND.next,c.currentTime+.02);
    if(!SND.phrase.length){/* rest between phrases, then maybe a low open string or a bell to mark it */
      SND.phrase=compose(m);SND.next=t+m.gap*(2+Math.random()*3);
      if(Math.random()<.6)qin(midiF(m.root-12),SND.next,3.2,.22,SND.music,0);
      if(Math.random()<m.bell)bell(midiF(m.root+24),SND.next+.3,.07);
      if(Math.random()<m.xiao){const sc=MODES[m.mode];xiao(midiF(m.root+12+sc[Math.floor(Math.random()*5)]),SND.next+.5,3+Math.random()*2,.07)}
      continue}
    const n=SND.phrase.shift();if(Math.random()<m.dens+.35)qin(midiF(n.m),t,1.4+n.d*.6,.2+Math.random()*.08,SND.music,n.slide);
    SND.next=t+m.gap*n.d*(0.85+Math.random()*.3)}}
function musicStart(){if(!sndInit())return;if(SND.ctx.state==='suspended')SND.ctx.resume();if(SND.timer)return;SND.next=SND.ctx.currentTime+.3;SND.timer=setInterval(musicTick,150)}

/* ---------- effects ---------- */
const FX={
 tap:t=>noiseHit(t,.05,2400,.03,4),
 year:t=>{noiseHit(t,.12,1800,.18,.6,'bandpass');noiseHit(t+.06,.08,900,.25,.5,'lowpass')},
 coin:t=>{[0,.07,.15].forEach((d,i)=>bell(2600+i*320,t+d,.05,SND.sfx))},
 good:t=>{const r=74;qin(midiF(r),t,1.2,.2,SND.sfx);qin(midiF(r+4),t+.12,1.4,.2,SND.sfx);qin(midiF(r+7),t+.24,1.8,.2,SND.sfx)},
 gold:t=>{bell(midiF(86),t,.08,SND.sfx);bell(midiF(91),t+.18,.07,SND.sfx);qin(midiF(74),t,2,.18,SND.sfx)},
 bad:t=>{drum(t,.32,95);qin(midiF(50),t+.05,1.8,.16,SND.sfx,1)},
 breakthrough:t=>{gong(t,.35);bell(midiF(79),t+.5,.06,SND.sfx)},
 death:t=>{bell(midiF(43),t,.28,SND.sfx,1);bell(midiF(43),t+5,.18,SND.sfx,1)},
 hit:(t,v)=>{noiseHit(t,.3*v,700,.12,.8,'lowpass');drum(t,.18*v,160)},
 clash:(t,v)=>metal(t,.6*v),
 swish:t=>noiseHit(t,.12,2600,.16,.7,'highpass'),
 ko:t=>{drum(t,.4,80);noiseHit(t,.15,500,.35,.6,'lowpass')}};
function sfx(k,v){if(!SND.on.sfx||!sndInit())return;if(SND.ctx.state==='suspended')SND.ctx.resume();try{FX[k](SND.ctx.currentTime+.01,v||1)}catch(e){}}

/* ---------- hooks into the game ---------- */
/* first touch unlocks sound */
addEventListener('pointerdown',function first(){if(SND.on.music||SND.on.sfx){musicStart()}removeEventListener('pointerdown',first,true)},true);
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||b.id==='d-age'||b.id==='b-snd')return;sfx('tap')},true);
/* what just got written to the chronicle decides the sound: one cue per update, the most important one */
(()=>{const u0=update;update=function(){const r=u0.apply(this,arguments);try{if(S){const n=S.log.length,E=S.log[n-1],len=E?E.lines.length:0,P=SND.lastLines;SND.lastLines={n,len};
  if(SND.ctx&&P&&E){const fresh=P.n===n?E.lines.slice(P.len):E.lines;if(fresh.length){const cs=fresh.map(l=>l.c||''),zs=fresh.map(l=>l.t&&l.t.zh||'');
    let cue=null;if(!S.alive&&!SND.dead){cue='death';SND.dead=1}else if(zs.some(z=>/踏入了新的境界|突破了境界/.test(z)))cue='breakthrough';else if(cs.includes('gold'))cue='gold';else if(cs.includes('bad'))cue='bad';else if(cs.includes('good'))cue='good';
    if(SND.lastMoney!=null&&S.money-SND.lastMoney>=20&&(!cue||cue==='good'))cue='coin';if(cue)setTimeout(()=>sfx(cue),60)}}
  if(S.alive)SND.dead=0;SND.lastMoney=S.money}}catch(e){}return r}})();
(()=>{const a0=ageUp;ageUp=function(s){const r=a0.apply(this,arguments);if(s===S&&SND.ctx)sfx('year');return r}})();
/* fights: a clash, a hit or a miss for each exchange, and a thud when someone goes down */
(()=>{const st=stepBattle;stepBattle=function(silent){const before=BT&&BT.hp?BT.hp.slice():null;const r=st.apply(this,arguments);
  if(!silent&&BT&&before){let drop=0,ko=false;BT.hp.forEach((h,i)=>{const d=(before[i]||0)-h;if(d>0)drop+=d;if(before[i]>0&&h<=0)ko=true});
    const mx=Math.max(...BT.mx);if(ko)sfx('ko');else if(drop>0){sfx(drop>mx*.15?'hit':'clash',Math.min(1.4,.6+drop/Math.max(1,mx)*4))}else if(Math.random()<.5)sfx('swish')}return r}})();

/* ---------- the sound button ---------- */
function sndHTML(){const Z=zh();const sw=(k,l)=>`<label class="sndrow"><span>${l}</span><button class="chip${SND.on[k]?' on':''}" data-snd="${k}">${SND.on[k]?(Z?'开':'On'):(Z?'关':'Off')}</button></label>`;
  return`${sw('music',Z?'背景音乐':'Music')}${sw('sfx',Z?'音效':'Sound effects')}
   <label class="sndrow"><span>${Z?'音量':'Volume'}</span><input type="range" id="snd-vol" min="0" max="100" value="${Math.round(SND.vol*100)}"></label>
   <p class="muted" style="font-size:13px">${Z?'所有声音都是即时合成的：古琴般的拨弦、箫声和钟声，曲子随你的人生境遇变化，每次都不一样。':'Every sound is made as you play: a plucked qin-like string, a bamboo flute and temple bells. The music follows the mood of your life and never repeats exactly.'}</p>`}
(()=>{const rs=renderSheet;renderSheet=function(){if(SHEET&&SHEET.kind==='snd'){$('veil').innerHTML=sheetFrame(zh()?'声音':'Sound',sndHTML());const v=$('snd-vol');if(v)v.oninput=()=>{SND.vol=v.value/100;if(SND.master)SND.master.gain.value=SND.vol;sndSave()};return}rs()}})();
function sndApply(){if(!SND.ctx)return;SND.music.gain.setTargetAtTime(SND.on.music?.6:0,SND.ctx.currentTime,.3);SND.sfx.gain.setTargetAtTime(SND.on.sfx?.55:0,SND.ctx.currentTime,.05)}
function sndChip(){const nb=$('b-new');if(!nb)return;let b=$('b-snd');if(!b){b=document.createElement('button');b.className='chip';b.id='b-snd';b.setAttribute('aria-label',zh()?'声音':'Sound');nb.parentNode.insertBefore(b,$('b-guide')||nb)}
  b.textContent=SND.on.music||SND.on.sfx?'🔊':'🔇'}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
  if(t.id==='b-snd'){musicStart();openSheet('snd');return}
  if(t.dataset.snd){const k=t.dataset.snd;SND.on[k]=!SND.on[k];sndSave();musicStart();sndApply();renderSheet();sndChip()}});
(()=>{const a0=applyLang;applyLang=function(){const r=a0.apply(this,arguments);try{sndChip()}catch(e){}return r}})();
/* pause in the background, resume when the player comes back */
document.addEventListener('visibilitychange',()=>{if(!SND.ctx)return;if(document.hidden)SND.ctx.suspend();else if(SND.on.music||SND.on.sfx)SND.ctx.resume()});
sndChip();
