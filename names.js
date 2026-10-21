/* 江湖一生 · how people are named: ordinary folk have ordinary names, jianghu people have plain two- or three-character names,
   only old noble houses use compound surnames, and only the famous earn an epithet */
'use strict';

const SUR_COMMON=('王Wang 李Li 张Zhang 刘Liu 陈Chen 杨Yang 赵Zhao 黄Huang 周Zhou 吴Wu 徐Xu 孙Sun 胡Hu 朱Zhu 高Gao 林Lin 何He 郭Guo 马Ma 罗Luo '+
 '梁Liang 宋Song 郑Zheng 谢Xie 韩Han 唐Tang 冯Feng 于Yu 董Dong 萧Xiao 程Cheng 曹Cao 袁Yuan 邓Deng 许Xu 傅Fu 沈Shen 曾Zeng 彭Peng 吕Lü '+
 '苏Su 卢Lu 蒋Jiang 蔡Cai 贾Jia 丁Ding 魏Wei 薛Xue 叶Ye 余Yu 潘Pan 杜Du 戴Dai 夏Xia 钟Zhong 汪Wang 田Tian 任Ren 姜Jiang 范Fan '+
 '方Fang 石Shi 姚Yao 谭Tan 廖Liao 邹Zou 熊Xiong 金Jin 陆Lu 郝Hao 孔Kong 白Bai 崔Cui 康Kang 毛Mao 邱Qiu 秦Qin 江Jiang 史Shi 顾Gu '+
 '侯Hou 邵Shao 孟Meng 万Wan 段Duan 雷Lei 钱Qian 汤Tang 尹Yin 易Yi 常Chang 乔Qiao 贺He 文Wen 柳Liu 燕Yan 岳Yue 齐Qi 霍Huo 严Yan').split(' ').map(x=>[x[0],x.slice(1)]);
const SUR_NOBLE=[['司马','Sima'],['上官','Shangguan'],['欧阳','Ouyang'],['南宫','Nangong'],['诸葛','Zhuge'],['皇甫','Huangfu'],['公孙','Gongsun'],['宇文','Yuwen'],['夏侯','Xiahou']];
/* the old list is used all over the code for "Elder Wang", "Senior Brother Li": keep it, but only with common surnames */
SUR.length=0;SUR_COMMON.forEach(x=>SUR.push(x));
const nl=s=>s.split(' ').map(x=>{const m=x.match(/^([^A-Za-z’'-]+)(.+)$/);return[m[1],m[2]]});
const GIVEN={
 common_m:nl('大牛Daniu 二牛Erniu 铁柱Tiezhu 石头Shitou 根生Gensheng 来福Laifu 春生Chunsheng 秋生Qiusheng 有财Youcai 富贵Fugui 长顺Changshun 水生Shuisheng 德胜Desheng 金宝Jinbao 二柱Erzhu 满仓Mancang 福生Fusheng 平安Ping’an 大山Dashan 小虎Xiaohu 老实Laoshi 旺财Wangcai 黑子Heizi 顺子Shunzi'),
 common_f:nl('春花Chunhua 秀英Xiuying 桂兰Guilan 翠儿Cui’er 小红Xiaohong 二妹Ermei 招娣Zhaodi 玉梅Yumei 月娥Yue’e 巧儿Qiao’er 杏儿Xing’er 荷花Hehua 大妞Daniu 银凤Yinfeng 喜儿Xi’er 菊香Juxiang 秋菊Qiuju 秀莲Xiulian 凤姑Fenggu 满月Manyue'),
 order:nl('大Da 二Er 三San 四Si 五Wu 六Liu 七Qi 老三Laosan 小六Xiaoliu'),
 ah:nl('阿福A-Fu 阿贵A-Gui 阿四A-Si 阿牛A-Niu 阿宝A-Bao 阿香A-Xiang 阿秀A-Xiu 阿莲A-Lian 阿珠A-Zhu 阿月A-Yue'),
 jh_m:nl('松Song 春山Chunshan 定远Dingyuan 文彬Wenbin 志刚Zhigang 振南Zhennan 德明Deming 正平Zhengping 立Li 安An 鹏Peng 峰Feng 涛Tao 青Qing 岳Yue 海Hai 守义Shouyi 承宗Chengzong 天佑Tianyou 子明Ziming 少华Shaohua 景行Jingxing 怀远Huaiyuan 一鸣Yiming 长风Changfeng 敬之Jingzhi 伯安Bo’an 云飞Yunfei 铁山Tieshan 剑平Jianping 汉Han 勇Yong 毅Yi 刚Gang 达Da 远Yuan 思齐Siqi 孟山Mengshan 启Qi 明远Mingyuan 开山Kaishan 守拙Shouzhuo 秉义Bingyi 崇山Chongshan 克勤Keqin 叔平Shuping 继先Jixian 广德Guangde'),
 jh_f:nl('兰Lan 梅Mei 雪Xue 霜Shuang 婉Wan 秀Xiu 莲Lian 素Su 清Qing 月Yue 玉Yu 慧Hui 珊Shan 宁Ning 瑶Yao 若兰Ruolan 秀云Xiuyun 玉霜Yushuang 素心Suxin 采薇Caiwei 静Jing 晓Xiao 春燕Chunyan 红叶Hongye 紫烟Ziyan 映雪Yingxue 青萍Qingping 小蝶Xiaodie 文君Wenjun 芸Yun 碧Bi 秋水Qiushui 三娘Sanniang 九妹Jiumei 小环Xiaohuan 凤仪Fengyi')};
const COMMON_OCC=[0,5,6,7,9,10,15,16,17,18,19,20,21,25,26,27,28,29,30];
let NAME_STYLE=null,NAME_ONCE=null;
function nameStyle(){const r=R();return r<.42?'common':r<.97?'jh':'noble'}
genName=function(g,sur,style){
  if(!style&&NAME_ONCE){style=NAME_ONCE;NAME_ONCE=null}
  style=style||NAME_STYLE||nameStyle();
  const f=g==='f';
  if(style==='noble'){const s=sur||(chance(.7)?pick(SUR_NOBLE):pick(SUR_COMMON)),gv=genGiven(g);return{cn:s[0]+gv.cn,py:s[1]+' '+gv.py,sur:s}}
  const s=sur||pick(SUR_COMMON);
  if(style==='common'){const r=R();
    if(r<.15){const a=pick(GIVEN.ah.filter(x=>f===['香','秀','莲','珠','月'].some(c=>x[0].includes(c))));return{cn:a[0],py:a[1],sur:s}}
    if(r<.4&&!f){const o=pick(GIVEN.order);return{cn:s[0]+o[0],py:s[1]+' '+o[1],sur:s}}
    const gv=pick(f?GIVEN.common_f:GIVEN.common_m);return{cn:s[0]+gv[0],py:s[1]+' '+gv[1],sur:s}}
  const gv=pick(f?GIVEN.jh_f:GIVEN.jh_m);return{cn:s[0]+gv[0],py:s[1]+' '+gv[1],sur:s};
};
/* only some of the people who come at you have a name worth an epithet */
foeName=function(){const p=genName(chance(.7)?'m':'f',null,'jh');if(chance(.35)){const e=pick(EPI);return T(`${e[0]} ${p.py}`,`「${e[1]}」${p.cn}`)}return T(p.py,p.cn)};

/* who someone is decides what they are called, and which sect, if any, they belong to */
const _mkPerson=mkPerson;
mkPerson=function(s,o={}){
  if(!o.name&&!NAME_STYLE){let st=null;const fam=s&&s.family;
    if(['father','mother','sibling','grandparent','uncle','aunt','cousin'].includes(o.rel))st=['peasant','hunter','beggar'].includes(fam)?(chance(.75)?'common':'jh'):fam==='noble'||fam==='clan'?(chance(.5)?'noble':'jh'):'jh';
    else if(o.occ!=null)st=COMMON_OCC.includes(o.occ)?(chance(.8)?'common':'jh'):(o.occ===11||o.occ===12)?(chance(.3)?'noble':'jh'):'jh';
    else if(['master','fellow','disciple','rival'].includes(o.rel))st=chance(.04)?'noble':'jh';
    NAME_STYLE=st;}
  let p;try{p=_mkPerson(s,o)}finally{NAME_STYLE=null}
  /* martial people often belong somewhere */
  if(s&&s.region&&!p.sect&&p.lv>=30&&!['father','mother','sibling','child','spouse'].includes(p.rel)&&(o.occ==null||!COMMON_OCC.includes(o.occ))&&chance(.45)){
    const r=REGIONS.find(x=>x.id===s.region)||REGIONS[0];
    const pool=chance(p.trait===1||p.trait===3?.45:.15)?(EVIL_SECTS[r.id]||[]):r.sects.concat(MORE_SECTS[r.id]||[]);
    const ok=pool.filter(k=>SECTS[k]&&!SECTS[k].hidden&&(!SECTS[k].male||p.sex==='m')&&(!SECTS[k].female||p.sex==='f'));
    if(ok.length)p.sect=pick(ok)}
  return p};
const _newLife=newLife;
newLife=function(){NAME_ONCE='jh';let s;try{s=_newLife()}finally{NAME_ONCE=null}
  if(s.family==='noble'&&chance(.5)){const n=genName(s.gender,null,'noble');s.name=n.py;s.cn=n.cn;s.sur=n.sur;s.people.forEach(p=>{if(p.rel==='father'||p.rel==='sibling'){p.n.cn=n.sur[0]+p.n.cn.slice(p.n.sur[0].length);p.n.py=n.sur[1]+p.n.py.slice(p.n.sur[1].length);p.n.sur=n.sur}})}
  return s};
const sectTag=p=>p&&p.sect&&SECTS[p.sect]?T(SECTS[p.sect].en,SECTS[p.sect].cn):null;
