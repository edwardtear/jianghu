/* 江湖一生 · 四季 in the life story: each season's happenings sit under its own heading, the latest season on top */
'use strict';
(()=>{const nf0=newestFirst;newestFirst=function(lines){if(!lines.some(l=>l.c==='season'))return nf0(lines);
  const isM=l=>/\bmoney\b/.test(l.c||''),M=lines.filter(isM),G=[[]];
  lines.filter(l=>!isM(l)).forEach(l=>{if(l.c==='season')G.push([l]);else G[G.length-1].push(l)});
  return M.map(lineHTML).join('')+G.filter(g=>g.length).reverse().map(g=>g[0].c==='season'?`<div class="sgrp">${lineHTML(g[0])}${nf0(g.slice(1))}</div>`:nf0(g)).join('')}})();
