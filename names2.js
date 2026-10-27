/* 江湖一生 · more names: more surnames, more given names of every kind, more epithets for the people who come at you */
'use strict';
nl('龚Gong 黎Li 韦Wei 钟Zhong 盛Sheng 骆Luo 洪Hong 祝Zhu 车Che 葛Ge 卓Zhuo 蓝Lan 阮Ruan 庞Pang 柴Chai 甘Gan 管Guan 祁Qi 纪Ji 舒Shu '+
 '屈Qu 项Xiang 晏Yan 牛Niu 鲁Lu 鲍Bao 包Bao 窦Dou 章Zhang 华Hua 申Shen 欧Ou 樊Fan 凌Ling 霍Huo 闻Wen 宁Ning 莫Mo 时Shi 季Ji '+
 '温Wen 关Guan 封Feng 柯Ke 裴Pei 翁Weng 涂Tu 喻Yu 游You 冷Leng 辛Xin 简Jian 储Chu 狄Di 岑Cen 边Bian 嵇Ji 习Xi 聂Nie 古Gu').forEach(x=>{if(!SUR_COMMON.some(y=>y[0]===x[0]))SUR_COMMON.push(x)});
[['慕容','Murong'],['东方','Dongfang'],['令狐','Linghu'],['独孤','Dugu'],['长孙','Zhangsun'],['尉迟','Yuchi'],['澹台','Tantai'],['端木','Duanmu'],['西门','Ximen'],['轩辕','Xuanyuan'],['百里','Baili'],['呼延','Huyan']].forEach(x=>{if(!SUR_NOBLE.some(y=>y[0]===x[0]))SUR_NOBLE.push(x)});
SUR.length=0;SUR_COMMON.forEach(x=>SUR.push(x));
const _add=(k,s)=>nl(s).forEach(x=>{if(!GIVEN[k].some(y=>y[0]===x[0]))GIVEN[k].push(x)});
_add('common_m','三宝Sanbao 狗剩Gousheng 栓柱Shuanzhu 石柱Shizhu 冬生Dongsheng 夏生Xiasheng 留根Liugen 天赐Tianci 招财Zhaocai 进宝Jinbao 保国Baoguo 守田Shoutian 大壮Dazhuang 二虎Erhu 小牛Xiaoniu 光宗Guangzong 耀祖Yaozu 来顺Laishun 长生Changsheng 丰收Fengshou 喜旺Xiwang 宝山Baoshan 铁蛋Tiedan 锁子Suozi 憨子Hanzi 石匠Shijiang 庆余Qingyu 双喜Shuangxi 年丰Nianfeng 有田Youtian');
_add('common_f','二丫Erya 小翠Xiaocui 杏花Xinghua 梨花Lihua 腊梅Lamei 春兰Chunlan 秋月Qiuyue 彩凤Caifeng 金花Jinhua 银杏Yinxing 来娣Laidi 盼儿Pan’er 喜妹Ximei 小满Xiaoman 冬梅Dongmei 香草Xiangcao 枣花Zaohua 桃儿Tao’er 麦穗Maisui 莲子Lianzi 秀姑Xiugu 玉珍Yuzhen 巧云Qiaoyun 凤英Fengying 素芬Sufen 采莲Cailian 绣娘Xiuniang 小桃Xiaotao 春妮Chunni 菱角Lingjiao');
_add('ah','阿旺A-Wang 阿根A-Gen 阿木A-Mu 阿水A-Shui 阿吉A-Ji 阿七A-Qi 阿祥A-Xiang 阿泰A-Tai');
_add('jh_m','惊鸿Jinghong 无忌Wuji 破军Pojun 重阳Chongyang 行云Xingyun 断水Duanshui 剑秋Jianqiu 啸天Xiaotian 一刀Yidao 孤城Gucheng 寒江Hanjiang 北辰Beichen 南山Nanshan 东篱Dongli 西楼Xilou 慕白Mubai 怀瑾Huaijin 承志Chengzhi 若愚Ruoyu 清风Qingfeng '+
 '万里Wanli 千山Qianshan 百川Baichuan 九霄Jiuxiao 长歌Changge 问天Wentian 观澜Guanlan 逐鹿Zhulu 平之Pingzhi 冲Chong 靖Jing 过Guo 峥Zheng 骁Xiao 锋Feng 烈Lie 恒Heng 越Yue 舟Zhou 戟Ji '+
 '守正Shouzheng 怀仁Huairen 知行Zhixing 敬亭Jingting 鹤年Henian 松年Songnian 振声Zhensheng 耀庭Yaoting 啸林Xiaolin 铁衣Tieyi 寒山Hanshan 青崖Qingya 星河Xinghe 沧海Canghai 浩然Haoran 无名Wuming 归云Guiyun 半山Banshan 不凡Bufan 三省Sanxing');
_add('jh_f','素素Susu 灵儿Ling’er 飞燕Feiyan 红绡Hongxiao 青鸾Qingluan 雪鸢Xueyuan 落英Luoying 听雨Tingyu 疏影Shuying 寒烟Hanyan 凌霜Lingshuang 盈盈Yingying 无双Wushuang 惜弱Xiruo 晚晴Wanqing 念慈Nianci 小昭Xiaozhao 冰清Bingqing 如烟Ruyan '+
 '若水Ruoshui 云裳Yunshang 绿萼Lü’e 紫鹃Zijuan 白芷Baizhi 红药Hongyao 杏娘Xingniang 三娘Sanniang 十一娘Shiyiniang 月华Yuehua 锦瑟Jinse 绛珠Jiangzhu 琴心Qinxin 剑娥Jian’e 晴川Qingchuan 秋娘Qiuniang 蘅芜Hengwu 鸣珂Mingke 霁月Jiyue 清歌Qingge');
[['尘','chen'],['澈','che'],['渊','yuan'],['衡','heng'],['昭','zhao'],['珩','heng'],['骞','qian'],['湛','zhan'],['钧','jun'],['弈','yi'],['晏','yan'],['琛','chen'],['瑾','jin'],['穆','mu'],['朔','shuo']].forEach(x=>{if(!GM.some(y=>y[0]===x[0]))GM.push(x)});
[['璃','li'],['棠','tang'],['筠','yun'],['蘅','heng'],['绾','wan'],['娆','rao'],['黛','dai'],['湘','xiang'],['宛','wan'],['绮','qi'],['姝','shu'],['妍','yan'],['瑜','yu'],['菀','wan'],['蘅','heng']].forEach(x=>{if(!GF.some(y=>y[0]===x[0]))GF.push(x)});
[['Three-Legged Toad','三脚蟾'],['Silver Hook','银钩'],['Hundred-Poison','百毒'],['Iron Ox','铁牛'],['Night Owl','夜枭'],['Flying Rat','飞天鼠'],['Red Fox','赤狐'],['Bone-Breaker','断骨手'],['White Snake','白蛇'],['Grey Wolf','灰狼'],
 ['Mountain Bear','山熊'],['Cloud Dragon','云中龙'],['Laughing Buddha','笑弥勒'],['Ghost Lantern','鬼灯'],['Twin Blades','双刀'],['Copper Head','铜头'],['River Ghost','水鬼'],['Seven Steps','七步'],['Black Widow','黑寡妇'],['Golden Fist','金拳']].forEach(x=>{if(!EPI.some(y=>y[1]===x[1]))EPI.push(x)});
