/* 江湖一生 · going after a breakthrough yourself: when your power has reached the end of its realm, 冲击瓶颈 under
   Training lets you face the wall now, once a year, instead of waiting for it to come up on its own. */
'use strict';
addAct({id:'breakwall',cat:'train',ap:2,n:T('Break through the bottleneck','冲击瓶颈'),d:T('You are at the end of your realm. Face the wall now: seclusion, a strong opponent, a teacher, or patience.','功力已到本境尽头。现在就去冲关：闭关、寻强敌一战、请教过来人，或者顺其自然。'),
 if:s=>typeof bottled==='function'&&bottled(s)&&s.age>=14,ok:s=>s.brkAct===s.age?T('Once a year','一年只能冲一次'):s.jail>0?T('Not in prison','身在牢中'):true,
 run(s){s.brkAct=s.age;s.brkCd=s.age+rint(2,3);runIncident(s,INC_BY.rz_bottle)}});
