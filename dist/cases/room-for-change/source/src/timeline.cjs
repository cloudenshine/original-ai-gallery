/* Original state machine. Time is always in seconds; one beat = 15 output frames. */
(function(root){
const FPS=24,DUR=40,BPM=96,BEAT=60/BPM;
const TASKS=[['A','提案',0],['B','设计',1],['C','归档',2],['D','校对',3],['E','备会',4],['F','记录',5],['G','整理',6],['H','复核',7],['N','15:00 新增会',null]].map(([id,label,slot])=>({id,label,slot}));
const TIMES=['13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30'];
const EV=[
{t:.625,type:'align',id:'H'}, {t:5.625,type:'arrive',id:'N'}, {t:6.875,type:'slide-start',id:'N',duration:.625}, {t:7.5,type:'blocked',id:'N'}, {t:8.125,type:'slide-start',id:'N',duration:.625},
{t:12.5,type:'label',id:'defer'}, {t:13.125,type:'slide-start',id:'C',duration:.625}, {t:13.75,type:'archive',id:'C'},
{t:15.625,type:'slide-start',id:'G',duration:.625}, {t:16.25,type:'archive',id:'G'},
{t:17.5,type:'slide-start',id:'D',duration:1.25}, {t:18.75,type:'reflow',id:'D',pitch:65},
{t:20,type:'slide-start',id:'E',duration:1.25}, {t:21.25,type:'reflow',id:'E',pitch:69},
{t:23.75,type:'slide-start',id:'N',duration:1.25}, {t:25,type:'meeting',id:'N',pitch:72},
{t:27.5,type:'slide-start',id:'H',duration:1.25}, {t:28.75,type:'reflow',id:'H',pitch:74},
{t:30,type:'label',id:'summary'}, {t:35,type:'label',id:'title'}];
const SILENCES=[[10,11.25],[22.5,23.75]];
const clamp=x=>Math.min(1,Math.max(0,x));
function ease(x){x=clamp(x);let a=0,b=1,u=x;for(let i=0;i<22;i++){u=(a+b)/2;let v=3*(1-u)*(1-u)*u*.7+3*(1-u)*u*u*.2+u*u*u;if(v<x)a=u;else b=u;}return 3*(1-u)*u*u+u*u*u;}
function mix(a,b,u){return a+(b-a)*u;}
function slotPos(i){return {x:704+(i%2)*392,y:280+Math.floor(i/2)*184};}
function pathAt(points,u){const lens=points.slice(1).map((v,i)=>Math.hypot(v.x-points[i].x,v.y-points[i].y)),total=lens.reduce((a,b)=>a+b,0);let d=clamp(u)*total;for(let i=0;i<lens.length;i++){if(d<=lens[i]||i===lens.length-1)return{x:mix(points[i].x,points[i+1].x,d/lens[i]),y:mix(points[i].y,points[i+1].y,d/lens[i])};d-=lens[i];}return points.at(-1);}
const MOVES={C:{from:13.125,to:13.75,zone:'tomorrow',slot:null,path:[slotPos(2),{x:704,y:540},{x:1536,y:540},{x:1536,y:464}]},G:{from:15.625,to:16.25,zone:'tomorrow',slot:null,path:[slotPos(6),{x:704,y:908},{x:1536,y:908},{x:1536,y:648}]},D:{from:17.5,to:18.75,zone:'today',slot:2,path:[slotPos(3),{x:1096,y:540},{x:704,y:540},slotPos(2)]},E:{from:20,to:21.25,zone:'today',slot:3,path:[slotPos(4),{x:704,y:540},{x:1096,y:540},slotPos(3)]},H:{from:27.5,to:28.75,zone:'today',slot:6,path:[slotPos(7),{x:1096,y:908},{x:704,y:908},slotPos(6)]}};
function state(t){return TASKS.map(o=>{let r={...o,...(o.slot===null?{x:-296,y:648}:slotPos(o.slot)),zone:o.id==='N'?'pending':'today',scale:1,moving:false};
 if(o.id==='H'&&t<.625){r.labelDx=12*(1-ease(t/.625));}
 if(o.id==='N'){
  if(t>=5&&t<5.625){r.x=mix(-296,192,(t-5)/.625);r.moving=true;}
  else if(t>=5.625&&t<6.875)r.x=192;
  else if(t>=6.875&&t<7.5){r.x=mix(192,416,(t-6.875)/.625);r.moving=true;}
  else if(t>=7.5&&t<8.125)r.x=416;
  else if(t>=8.125&&t<8.75){r.x=mix(416,192,(t-8.125)/.625);r.moving=true;}
  else if(t>=8.75&&t<23.75)r.x=192;
  else if(t>=23.75&&t<25){r.x=mix(192,704,(t-23.75)/1.25);r.moving=true;}
  else if(t>=25){r.x=704;r.zone='today';r.slot=4;}
 }else if(MOVES[o.id]){const m=MOVES[o.id];if(t>=m.from){const u=ease((t-m.from)/(m.to-m.from));Object.assign(r,pathAt(m.path,u));r.moving=t<m.to;if(r.moving){r.zone='transit';r.slot=null;}else{r.zone=m.zone;r.slot=m.slot;}}}
 return r;});}
function occupancy(t){let n=0;for(const o of state(t))if(o.zone==='today')n++;return n;}
const api={FPS,DUR,BPM,BEAT,TASKS,TIMES,EV,SILENCES,clamp,ease,mix,slotPos,pathAt,MOVES,state,occupancy};if(typeof module!=='undefined')module.exports=api;root.TIMELINE=api;
})(typeof window!=='undefined'?window:globalThis);
