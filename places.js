/* 江湖一生 · places: every region has towns and its own sects, so the map is not the same everywhere; you can travel for
   a season or move for good, and the world gives you reasons to do both */
'use strict';

/* ---------- more sects, each rooted in one place ---------- */
Object.assign(SECTS,{
 jindao:{cn:'金刀门',en:'the Golden Saber Gate',align:1,wpn:T('Saber','刀'),arts:[['Golden Saber Style','金刀刀法','pojia'],['Horse-Mounted Saber','马上刀','kuangbao'],['Unbroken Edge','不卷刃心法','jinzhong']],blurb:T('A Luoyang saber house that guards the old capital’s caravans.','洛阳的刀门，世代护着古都的商队。')},
 guanchao:{cn:'观潮剑派',en:'the Tide-Watching Sword School',align:1,wpn:T('Sword','剑'),arts:[['Tidal Bore Sword','钱塘潮剑','lianhuan'],['Ebb Step','退潮步','lingbo'],['Moon-Tide Heart Art','月潮心法','jianqi']],blurb:T('Swordsmen who train on the seawall at Qiantang when the great tide comes in.','在钱塘海塘上迎着大潮练剑的剑客。')},
 taihu:{cn:'太湖水寨',en:'the Taihu Lake Stockade',align:-1,wpn:T('Saber','刀'),easy:.15,arts:[['Reed-Bed Saber','芦苇荡刀法','kuangbao'],['Underwater Breath','水底换气术','heal'],['Boat-Hook Grapple','挠钩擒拿','pojia']],blurb:T('Lake men, half smugglers and half heroes, depending on the year.','太湖上的汉子，一半是私盐贩子，一半是好汉，看年景。')},
 jianmen:{cn:'剑门派',en:'the Sword Gate School',align:1,wpn:T('Sword','剑'),arts:[['Plank-Road Sword','栈道剑法','kuaijian'],['Cliff Wind Step','崖风步','lingbo'],['Gate-Keeper Sword Qi','守关剑气','jianqi']],blurb:T('They keep the narrow pass into Shu, and their sword is as narrow as the road.','守着入蜀的险关，剑法也跟那条路一样窄而险。')},
 yanmen:{cn:'雁门堂',en:'the Wild Goose Pass Hall',align:2,wpn:T('Saber','刀'),arts:[['Frontier Saber','雁门刀','pojia'],['Wall-Keeper’s Stance','守城桩','jinzhong'],['Beacon Breath','烽火吐纳','heal']],blurb:T('Frontier fighters who man the beacons when the army is short of men.','守边的武人，官军人手不够时，便替他们点烽火。')},
 shuofeng:{cn:'朔风马帮',en:'the North Wind Horse Gang',align:0,wpn:T('Whip','鞭'),easy:.1,arts:[['Herder’s Whip','牧鞭法','lianhuan'],['Saddle Leap','马背腾挪','lingbo'],['Steppe Endurance','耐寒功','jinzhong']],blurb:T('Horse traders and caravan guards of the northern steppe road.','北方草原商道上的马贩子和护队人。')},
 feitian:{cn:'飞天阁',en:'the Flying Apsara Pavilion',align:1,female:1,wpn:T('Rings','环'),arts:[['Apsara Ribbon Rings','飞天环','yiyu'],['Cave-Painting Step','壁画步','fenshen'],['Desert Moon Art','大漠月心法','heal']],blurb:T('Women of Dunhuang who learned their art from the cave paintings.','敦煌的女子们，据说武功是从石窟壁画里悟出来的。')},
 yuezhai:{cn:'银月寨',en:'the Silver Moon Stockade',align:0,wpn:T('Saber','刀'),arts:[['Silver Moon Saber','银月弯刀','kuaijian'],['Mountain Song Step','山歌步','lingbo'],['Gu-Ward Art','避蛊心法','heal']],blurb:T('A Miao hill stockade whose silversmiths are also its swordsmen.','苗岭上的山寨，打银的匠人也是寨里的刀客。')},
 yulong:{cn:'玉龙雪山派',en:'the Jade Dragon Snow Mountain School',align:1,wpn:T('Sword','剑'),arts:[['Snowline Sword','雪线剑法','kuaijian'],['Glacier Breath','冰川吐纳','jinzhong'],['Jade Dragon Sword Qi','玉龙剑气','jianqi']],blurb:T('A small school under the snow peak at Lijiang, famous for patience.','丽江雪山下的小门派，以耐性出名。')},
 haiyun:{cn:'海云阁',en:'the Sea Cloud Pavilion',align:1,wpn:T('Flute','笛'),arts:[['Sea Cloud Flute Strikes','海云笛法','dianxue'],['Spray Step','浪花步','lingbo'],['Tide Sound Art','潮音功','shihou']],blurb:T('Scholars of the coast who fight with iron flutes and hate pirates.','海边的读书人，使铁笛，最恨海盗。')},
 penglai:{cn:'蓬莱剑派',en:'the Penglai Sword School',align:1,wpn:T('Sword','剑'),arts:[['Immortal Isle Sword','蓬莱剑法','yiyu'],['Mist Step','海雾步','fenshen'],['Elixir Breath','丹气诀','heal']],blurb:T('An island school that claims descent from immortals and charges for the boat.','海岛上的剑派，自称仙人之后，渡船要收钱。')},
 tianji:{cn:'天机书院',en:'the Heavenly Mechanism Academy',align:2,wpn:T('Brush','笔'),arts:[['Calligraphy Point Strikes','书法点穴','dianxue'],['Chessboard Step','棋盘步','fenshen'],['Scholar’s Clear Heart','清心诀','yiyu']],blurb:T('A capital academy where examination candidates also learn to fight.','京城的书院，赶考的举子在这里也学武。')},
 zhenyuan:{cn:'镇远武馆',en:'the Zhenyuan Martial Hall',align:1,wpn:T('Fist','拳'),easy:.2,arts:[['Long Fist','长拳','pojia'],['Iron Bridge Stance','铁桥桩','jinzhong'],['Thousand-Blow Fist','千锤拳','kuangbao']],blurb:T('The busiest martial hall in the capital. They take almost anyone who pays.','京城最热闹的武馆，交得起学费的差不多都收。')}});
/* each region: who recruits children, who takes grown people, who lurks */
const SECT_MAP2={
 central:{sects:['shaolin','songshan','huashan','jindao'],more:['quanzhen','gumu'],evil:['tiequan']},
 jiangnan:{sects:['guanchao','jianlu','lingshi'],more:['yihua','qinglian','taihu','hengs'],evil:['feiying']},
 shu:{sects:['emei','qingcheng','tang','jianmen'],more:['wangyou','leihuo'],evil:['qinglong']},
 north:{sects:['hengn','yanmen','lingyu'],more:['shuofeng','mingjiao'],evil:['sunmoon']},
 west:{sects:['kunlun','kongtong','tianshan'],more:['feitian','tianchi','xueshan'],evil:['xingxiu','xuedao','tuoling']},
 miao:{sects:['cangshan','baicao','yuezhai'],more:['yulong'],evil:['wudu','erengu']},
 east:{sects:['taishan','peach','haiyun'],more:['penglai'],evil:['haisha','haijiao']},
 capital:{sects:['wudang','beggar','zhenyuan'],more:['tianji'],evil:['jinqian','qinglong']}};
REGIONS.forEach(r=>{const m=SECT_MAP2[r.id];if(!m)return;r.sects=m.sects;MORE_SECTS[r.id]=m.more;EVIL_SECTS[r.id]=m.evil});
[['jindao','shaolin',1],['guanchao','jianlu',1],['taihu','guanchao',-1],['jianmen','qingcheng',1],['jianmen','tang',-1],['yanmen','hengn',1],['yanmen','lingyu',1],['shuofeng','yanmen',1],
 ['feitian','tianchi',1],['feitian','xueshan',-1],['yuezhai','cangshan',1],['yulong','xueshan',-1],['haiyun','penglai',1],['penglai','peach',-1],['tianji','wudang',1],['zhenyuan','beggar',1],['tianji','zhenyuan',1],['jindao','huashan',1]]
 .forEach(([a,b,v])=>{(SREL[a]=SREL[a]||{})[b]=v;(SREL[b]=SREL[b]||{})[a]=v});

/* ---------- towns ---------- */
const CITIES={central:[['Luoyang','洛阳'],['Bianliang','汴梁'],['Nanyang','南阳'],['Dengfeng','登封']],jiangnan:[['Suzhou','苏州'],['Hangzhou','杭州'],['Yangzhou','扬州'],['Jinling','金陵']],
 shu:[['Chengdu','成都'],['Yuzhou','渝州'],['Jiazhou','嘉州']],north:[['Datong','大同'],['Taiyuan','太原'],['Yanmen','雁门关']],west:[['Dunhuang','敦煌'],['Liangzhou','凉州'],['Yumen','玉门']],
 miao:[['Dali','大理'],['Lijiang','丽江'],['the Miao hills','苗岭']],east:[['Quanzhou','泉州'],['Dengzhou','登州'],['Mingzhou','明州']],capital:[['the Capital','京城'],['Tongzhou','通州']]};
const cityOf=s=>{const L=CITIES[s.region]||[];return L.find(c=>c[1]===s.city)||null};
function setCity(s,name){const L=CITIES[s.region]||[];s.city=name&&L.some(c=>c[1]===name)?name:(L.length?pick(L)[1]:null)}
const placeName=s=>{const r=region(s),c=cityOf(s);return T(`${c?c[0]+', ':''}${r.en}`,`${r.cn}${c?'·'+c[1]:''}`)};
(()=>{const n0=newLife;newLife=function(){const s=n0.apply(this,arguments);setCity(s);s.home=s.region;return s}})();
/* if the birth scene names a town, that is where you live */
(()=>{const b0=birth;birth=function(s){b0(s);const E=s.log[s.log.length-1];const z=E&&E.lines[0]&&E.lines[0].t.zh||'';const hit=(CITIES[s.region]||[]).find(c=>z.includes(c[1]));if(hit)s.city=hit[1]}})();
/* moving region always lands you in a town */
(()=>{const A=ACT_BY.travel;if(!A)return;const c0=A.choose,r0=A.run;
  A.run=function(s){r0.call(A,s);const q=s.queue[s.queue.length-1];if(!q||q.id!=='travel')return;const other=(CITIES[s.region]||[]).filter(c=>c[1]!==s.city);
    if(other.length)q.opts.splice(q.opts.length-1,0,{k:'local',l:T(`Move to another town in ${region(s).en}`,`在${region(s).cn}换个城住`),sub:T(other.map(c=>c[0]).join(', '),other.map(c=>c[1]).join('、'))})};
  A.choose=function(s,k,c){if(k==='local'){const other=(CITIES[s.region]||[]).filter(x=>x[1]!==s.city);const n=pick(other);pay(s,-10);s.city=n[1];delete s.visit;say(s,`You move to ${n[0]}.`,`你搬到了${n[1]}。`,'good');happy(s,2);return}
    const r=c0.call(A,s,k,c);if(k!=='leave'){setCity(s);delete s.visit;s.home=s.region;const cc=cityOf(s);if(cc)say(s,`You settle in ${cc[0]}.`,`你在${cc[1]}落了脚。`,'muted')}return r}})();

/* ---------- a season away: you go, the place is different for a while, then you come home ---------- */
function goAway(s,reg,yrs,why){if(!reg||reg===s.region)return;if(!s.visit)s.visit={home:s.region,homeCity:s.city};s.visit.until=s.age+yrs;s.visit.why=why||null;
  s.region=reg;setCity(s);(s.trail=s.trail||[]).push(reg)}
(()=>{const y=yearly;yearly=function(s){y(s);const v=s.visit;if(!v||!s.alive||s.age<v.until)return;delete s.visit;if(s.region===v.home)return;
  s.region=v.home;s.city=v.homeCity;(s.trail=s.trail||[]).push(v.home);const c=cityOf(s);say(s,`You come home to ${c?c[0]:region(s).en}. It looks smaller than you remember.`,`你回到了${c?c[1]:region(s).cn}。家乡好像比记忆里小了些。`,'muted')}})();
addAct({id:'journey',ap:2,cat:'jh',n:T('Travel for a season','远行'),d:T('Go somewhere for a while and come home next year. 20 taels.','出门走一趟，明年回家。盘缠二十两。'),
 ok:s=>s.age<14?needAge(s,14):s.money<20?T('Needs 20 taels','需二十两'):s.visit?T('You are already away from home','你已在外'):true,
 run(s){ask(s,'journey',{},REGIONS.filter(r=>r.id!==s.region).map(r=>({k:r.id,l:T(r.en,r.cn),sub:T(`${(CITIES[r.id]||[]).map(c=>c[0]).join(', ')}. ${r.desc.en}`,`${(CITIES[r.id]||[]).map(c=>c[1]).join('、')}。${r.desc.zh}`)})).concat([{k:'leave',l:T('Stay home','留在家里')}]))},
 choose(s,k){if(k==='leave')return;pay(s,-20);goAway(s,k,1,'journey');const c=cityOf(s);happy(s,5);s.smarts=clamp(s.smarts+1,0,100);
  say(s,`You set out for ${c?c[0]+', ':''}${region(s).en}, meaning to stay until next year.`,`你动身去了${region(s).cn}${c?'·'+c[1]:''}，打算待到明年再回。`,'good');
  if(chance(.5)){const i=pickIncident(s,'wander');if(i)runIncident(s,i)}}});

/* ---------- the world gives reasons to go ---------- */
const otherReg=s=>pick(REGIONS.filter(r=>r.id!==s.region));
const MV=d=>{d.tags=d.tags||[];I(d)};
MV({id:'mv_post',age:[18,55],cd:12,w:.9,when:s=>!s.visit&&(s.job||s.money<200),ctx:s=>{const c=scene();c.r=otherReg(s);c.cc=pick(CITIES[c.r.id]);c.npc=npc(s,{occ:pick([5,26,23])});c.pay=rint(60,160);return c},
 text:c=>T(`${c.npc.en}, ${c.npc.desc.en}, offers you steady work in ${c.cc[0]}, ${c.r.en}: ${c.pay} taels a year to start.`,`${c.npc.desc.zh}${c.npc.zh}请你去${c.r.cn}的${c.cc[1]}做事，头一年给${c.pay}两。`),
 opts:[{l:T('Move there','搬过去'),out:[{w:3,t:c=>T(`You settle in ${c.cc[0]}. The work is real, and so is the pay.`,`你在${c.cc[1]}安了家。活是真的，工钱也是真的。`),c:'good',fx:{f:(s,c)=>{delete s.visit;s.region=c.r.id;s.city=c.cc[1];s.home=s.region;(s.trail=s.trail||[]).push(c.r.id);payT(s,c.pay,'work')}}},
   {w:1,t:c=>T(`You arrive in ${c.cc[0]} to find the business already failing. You stay anyway.`,`你到了${c.cc[1]}，才发现那买卖已经不行了。你还是留了下来。`),c:'muted',fx:{f:(s,c)=>{delete s.visit;s.region=c.r.id;s.city=c.cc[1];s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}}]},
  {l:T('Go for a year and see','先去一年看看'),out:[{w:2,t:T('A year away. You come back with silver and stories.','在外一年，带回了银子，也带回了故事。'),c:'good',fx:{f:(s,c)=>{goAway(s,c.r.id,1,'work');s.city=c.cc[1];payT(s,Math.round(c.pay*.8),'work')}}},{w:1,t:T('The job is worse than promised. You will be glad to come home.','活比说好的差。你会很高兴回家的。'),c:'muted',fx:{f:(s,c)=>{goAway(s,c.r.id,1,'work');s.city=c.cc[1]}}}]},
  {l:T('Stay where you are','留在原地'),out:[{w:1,t:T('You stay. Somebody else takes it.','你没走。差事给了别人。'),c:'muted'},{w:1,t:T('A year later you hear the business made its people rich.','一年后你听说，那买卖让跟去的人都发了财。'),c:'muted',fx:{happy:-2}}]}]});
MV({id:'mv_relative',age:[8,70],cd:10,w:.8,when:s=>!s.visit,ctx:s=>{const c=scene();c.r=otherReg(s);c.cc=pick(CITIES[c.r.id]);c.who=pick([T('an aunt','一位姑母'),T('a cousin','一位表亲'),T('an old uncle','一位老舅'),T('your mother’s old friend','母亲的一位旧友')]);return c},
 text:c=>T(`A letter from ${c.who.en} in ${c.cc[0]}, ${c.r.en}: come and stay for a season.`,`${c.r.cn}${c.cc[1]}的${c.who.zh}来信，请你过去住一阵。`),
 opts:[{l:T('Go','去'),out:[{w:3,t:T('A season among different food, different weather and a different way of talking.','一季的光景，换了吃食，换了天气，也换了说话的腔调。'),c:'good',fx:{happy:5,smarts:1,f:(s,c)=>{goAway(s,c.r.id,1,'relative');s.city=c.cc[1]}}},{w:1,t:T('You arrive to find the relative ill. You stay to nurse them.','到了才知道亲戚病了。你留下来照顾了一阵。'),c:'muted',fx:{align:2,f:(s,c)=>{goAway(s,c.r.id,1,'relative');s.city=c.cc[1]}}}]},
  {l:T('Write back that you cannot','回信说去不了'),out:[{w:1,t:T('Another letter comes the next year, shorter.','第二年又来了一封信，比上回短。'),c:'muted'},{w:1,t:T('You never hear from them again.','后来再没有消息了。'),c:'muted'}]}]});
MV({id:'mv_refugee',age:[6,80],cd:15,w:2,when:s=>!s.visit&&s.world&&(s.world.h<=-2||s.world.u>=3),ctx:s=>{const c=scene();c.r=otherReg(s);return c},
 text:c=>T(`Half the town is leaving: carts and bundles on the road toward ${c.r.en}, where they say there is food and no fighting.`,`半个镇子的人都在逃：车子和包袱挤满了往${c.r.cn}去的路，听说那边有粮，也不打仗。`),
 opts:[{l:T('Go with them','跟着走'),out:[{w:2,t:c=>T(`Weeks on the road, and then a new life in ${c.r.en}.`,`路上走了好几个礼拜，然后在${c.r.cn}重新开始。`),c:'muted',fx:{hurt:[3,10],cause:T('the refugee road','逃荒路上'),f:(s,c)=>{delete s.visit;s.region=c.r.id;setCity(s);s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}},{w:1,t:T('Bandits fall on the column. You arrive with less than you left with.','流民队伍遭了劫。你到的时候，比出发时还穷。'),c:'bad',fx:{money:[-60,-10],f:(s,c)=>{delete s.visit;s.region=c.r.id;setCity(s);s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}}]},
  {l:T('Stay and endure','留下来硬撑'),out:[{w:s=>1+s.t.root*.2,t:T('You hold out. When the others come back, you are still here.','你撑过来了。等别人回来，你还在。'),c:'good',fx:{fame:1}},{w:1,t:T('It is a terrible year to stay.','留下来的那一年，太难熬了。'),c:'bad',fx:{hurt:[10,22],cause:T('a hard year','荒年')}}]}]});
MV({id:'mv_branch',age:[18,55],cd:12,w:2.2,when:s=>!s.visit&&!!s.sect&&!s.retired&&(s.rank||0)>=1,ctx:s=>{const c=scene();c.r=otherReg(s);return c},
 text:(c,s)=>T(`${SECTS[s.sect].en} is opening a branch hall in ${c.r.en}, and wants you there for two years.`,`${SECTS[s.sect].cn}要在${c.r.cn}开一处分堂，想派你去坐镇两年。`),
 opts:[{l:T('Accept the posting','领命前往'),out:[{w:3,t:T('Two years of hard work far from home. The elders take note.','离家两年，事情难办。长老们都看在眼里。'),c:'good',fx:{merit:12,fame:2,f:(s,c)=>goAway(s,c.r.id,2,'branch')}},{w:1,t:T('The locals do not want you there, and say so with fists.','当地人不欢迎你们，还用拳头表示了这一点。'),c:'muted',fx:{merit:8,hurt:[5,15],cause:T('a hostile welcome','当地人的“欢迎”'),f:(s,c)=>goAway(s,c.r.id,2,'branch')}}]},
  {l:T('Ask to stay','请求留下'),out:[{w:1,t:T('Someone else goes, and is promoted for it.','换了别人去，后来那人因此升了一级。'),c:'muted',fx:{merit:-3}},{w:1,t:T('The elders understand.','长老们表示理解。'),c:'muted'}]}]});
MV({id:'mv_spouse',age:[22,70],cd:20,once:1,w:1.8,when:s=>!s.visit&&!!spouseOf(s),ctx:s=>{const c=scene();c.r=otherReg(s);c.p=spouseOf(s);return c},
 text:c=>T(`${c.p.n.py} wants to move back to ${c.r.en}, where ${PRON[c.p.sex].his} family is, and has wanted to for years.`,`${c.p.n.cn}想搬回${c.r.cn}去，那边是${PRON[c.p.sex].ta}的娘家人。这个念头，${PRON[c.p.sex].ta}已经憋了好多年。`),
 opts:[{l:T('Move together','一起搬过去'),out:[{w:3,t:T('It is the right decision for your marriage, if not for you.','对你们的婚姻来说，这是对的，对你自己就未必。'),c:'good',fx:{f:(s,c)=>{addBond(c.p,15);delete s.visit;s.region=c.r.id;setCity(s);s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}},{w:1,t:T('The in-laws are worse than expected.','岳家（婆家）比想的还难相处。'),c:'muted',fx:{happy:-4,f:(s,c)=>{addBond(c.p,8);delete s.visit;s.region=c.r.id;setCity(s);s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}}]},
  {l:T('Refuse','不肯'),out:[{w:1,t:T('It is not mentioned again. That is not the same as forgotten.','后来没再提起。可没提，不等于忘了。'),c:'muted',fx:{f:(s,c)=>addBond(c.p,-12)}},{w:1,t:T('A long argument, and a compromise: a visit every few years.','吵了很久，最后各退一步：每隔几年回去一趟。'),c:'muted',fx:{f:(s,c)=>addBond(c.p,-3)}}]}]});
MV({id:'mv_flee',age:[16,80],cd:8,w:3,when:s=>!s.visit&&s.wanted>=2,ctx:s=>{const c=scene();c.r=otherReg(s);return c},
 text:c=>T('Your face is on a notice by the city gate. A friend at the yamen sends word: leave tonight.','城门口贴出了画着你脸的告示。衙门里的熟人捎来口信：今晚就走。'),
 opts:[{l:c=>T(`Flee to ${c.r.en}`,`连夜逃往${c.r.cn}`),out:[{w:3,t:T('You are gone before the constables arrive. A new place, and an old name you no longer use.','捕快到时，你已经走了。换了个地方，旧名字也不再用了。'),c:'muted',fx:{f:(s,c)=>{s.wanted=Math.max(0,s.wanted-2);delete s.visit;s.region=c.r.id;setCity(s);s.home=s.region;(s.trail=s.trail||[]).push(c.r.id)}}},{w:1,t:T('They catch you at the ferry.','你在渡口被截住了。'),c:'bad',fx:{jail:1}}]},
  {l:T('Lie low in the city','在城里躲着'),out:[{w:s=>1+s.smarts/40,t:T('You vanish into the back streets. In a year it blows over.','你钻进了后街小巷。过了一年，风头就过了。'),c:'good',fx:{f:s=>{s.wanted=Math.max(0,s.wanted-1)}}},{w:1,t:T('Someone sells you out.','有人把你卖了。'),c:'bad',fx:{jail:2}}]}]});
MV({id:'mv_pilgrim',age:[35,85],cd:15,w:.7,when:s=>!s.visit,ctx:s=>{const P=[['central','Mount Song','嵩山'],['shu','Mount Emei','峨眉山'],['capital','the Western Hills','西山'],['east','Mount Tai','泰山'],['west','the Kunlun range','昆仑山'],['miao','Jade Dragon Snow Mountain','玉龙雪山']].filter(x=>x[0]!==s.region);const c=scene();c.m=pick(P);return c},
 text:c=>T(`You feel a pull to climb ${c.m[1]} once before you are too old.`,`你忽然很想趁着还走得动，去登一回${c.m[2]}。`),
 opts:[{l:T('Make the pilgrimage','动身朝山'),out:[{w:3,t:T('At the summit, above the clouds, something in your chest unknots.','站在云层之上的山顶，你胸口有个结解开了。'),c:'good',fx:{qi:3,happy:6,f:(s,c)=>goAway(s,c.m[0],1,'pilgrim')}},{w:1,t:T('Your knees give out halfway. You see the summit from a tea stall, which is almost as good.','半路上膝盖就不行了。你在一个茶摊上望见了山顶，也算差不多。'),c:'muted',fx:{happy:3,f:(s,c)=>goAway(s,c.m[0],1,'pilgrim')}}]},
  {l:T('Another year, perhaps','也许明年吧'),out:[{w:1,t:T('Perhaps.','也许吧。'),c:'muted'}]}]});
MV({id:'mv_caravan',age:[16,40],cd:10,w:.9,when:s=>!s.visit,ctx:s=>{const c=scene();c.r=pick(REGIONS.filter(r=>['west','north','miao'].includes(r.id)&&r.id!==s.region));c.lv=PW(1,5)(s);return c},
 text:c=>T(`A caravan bound for ${c.r.en} needs one more guard for the season. Good pay; long roads.`,`一支去${c.r.cn}的商队还缺一个护卫，跑一季。工钱好，路也远。`),
 opts:[{l:T('Sign on','应下'),fight:(s,c)=>({foe:{name:T('desert raiders','劫道的马贼'),lv:c.lv,fixed:1},stakes:'injury',title:T('On the caravan road','商道上'),cause:T('raiders on the caravan road','商道上的马贼')}),
   win:[{w:2,t:T('You beat off the raiders and see the far side of the empire. The merchant pays double.','你打退了马贼，也见到了天下的另一头。商人给了双倍工钱。'),c:'gold',fx:{money:[80,200],fame:2,f:(s,c)=>goAway(s,c.r.id,1,'caravan')}}],
   lose:[{w:1,t:T('The raiders take half the goods. You are paid half, and sent home early.','马贼抢走了一半货。你只拿到一半工钱，提前被打发回了家。'),c:'bad',fx:{money:[20,50]}}]},
  {l:T('Not this year','今年不去了'),out:[{w:1,t:T('They leave at dawn without you.','天亮时，商队没带上你就走了。'),c:'muted'}]}]});

if(typeof TRAVEL_ACTS!=='undefined'&&!TRAVEL_ACTS.includes('journey'))TRAVEL_ACTS.push('journey');
/* lives begun before towns existed get one */
(()=>{const y=yearly;yearly=function(s){if(s&&!s.city)setCity(s);if(s&&!s.home)s.home=s.region;return y(s)}})();
