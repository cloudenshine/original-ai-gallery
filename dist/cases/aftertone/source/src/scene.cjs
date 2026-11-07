'use strict';
// Original deterministic drawing for Aftertone. No time-dependent random source.
const {createCanvas} = require('@napi-rs/canvas');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const win=(t,a,b)=>smooth((t-a)/(b-a));
const lerp=(a,b,t)=>a+(b-a)*t;
const fract=x=>x-Math.floor(x);
function intersection(a,b){
 const [x1,y1]=a.p0,[x2,y2]=a.p1,[x3,y3]=b.p0,[x4,y4]=b.p1;
 const d=(x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
 const ua=((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/d;
 const ub=((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/d;
 return {xy:[lerp(x1,x2,ua),lerp(y1,y2,ua)],u:[ua,ub]};
}
function makeScene(T){
 const W=T.width,H=T.height,E=T.events,L=T.lines;
 const C={C01:intersection(L[0],L[1]),C12:intersection(L[1],L[2]),C03:intersection(L[0],L[3]),C13:intersection(L[1],L[3])};
 const pinEvents=[['C01',E.contact01,0,1],['C12',E.contact12,1,2],['C03',E.contact03,0,3],['C01',E.reply1,0,1],['C12',25.2,1,2],['C13',25.5,1,3],['C01',E.returnA,0,1],['C01',E.returnB,0,1]];
 const starts=[E.release,E.response1,E.response2,E.response3];
 const bg=createCanvas(W,H),b=bg.getContext('2d');
 const grad=b.createRadialGradient(W*.51,H*.51,20,W*.51,H*.51,W*.65);
 grad.addColorStop(0,'#111518');grad.addColorStop(.7,'#090d10');grad.addColorStop(1,'#070a0d');b.fillStyle=grad;b.fillRect(0,0,W,H);
 let seed=T.seed>>>0;function rng(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}
 // Sub-visible fixed material grain, never glitter or moving particles.
 for(let i=0;i<22000;i++){const x=rng()*W,y=rng()*H;b.fillStyle=`rgba(182,165,133,${.01+rng()*.016})`;b.fillRect(x,y,1+rng()*2,.45);}
 function reflect(x){x=((x%2)+2)%2;return x<=1?x:2-x}
 function packet(u,c,w,a){const d=(u-c)/w;return a*Math.exp(-d*d*2.6)*Math.cos(d*Math.PI*.7)}
 function rawDis(i,u,t){
  const st=starts[i],dt=t-st,edge=Math.sin(Math.PI*u); if(dt<0){
   if(i===0){let p=win(t,.75,1.5)*(1-win(t,E.release,E.release+.10));return 43.2*p*(u<.3?u/.3:(1-u)/.7)}return 0;
  }
  let d=0;
  if(i===0){
   const amp=43.2*Math.exp(-dt*.62);
   const initial=(u<.3?u/.3:(1-u)/.7)/Math.max(edge,1e-9);
   d=amp*Math.cos(dt*5.4)*initial+18*win(dt,0,.12)*Math.exp(-dt*.24)*(packet(u,reflect(.3+dt*.4),.095,1)-packet(u,reflect(.3-dt*.4),.075,1));
   if(t>7.5)d+=packet(u,C.C01.u[0]-(t-E.reply1)*.22,.065,13)*Math.exp(-Math.max(0,t-9)*1.2);
   const collective=win(t,13.5,16)*(1-win(t,23,27));
   d+=collective*(22*Math.sin(u*12.4-t*1.8)+9*Math.sin(u*22.1+t*1.06))*edge;
   for(const [at,arrival,amp]of [[E.returnA,E.markA,24],[E.returnB,E.markB,15]])if(t>=at){const v=(C.C01.u[0]-.3)/(arrival-at);d+=packet(u,C.C01.u[0]-(t-at)*v,.075,amp)*Math.exp(-Math.max(0,t-arrival)*1.0)}
   if(t>27.5)d+=win(t,27.5,28)*(3*Math.sin((t-28)*4.3+u*10)+1.5*Math.sin((t-28)*6.9+u*16))*Math.exp(-Math.max(0,t-28)*.85)*edge;
  }else{
   const attack=win(t,st,st+.28),collective=win(t,14.25,17.5)*(1-win(t,23,27));
   const decay=Math.exp(-dt*.16),wave=(Math.sin(u*(11+i*1.7)-dt*(3.1-i*.35))*19+Math.sin(u*20+dt*1.3)*5);
   d=attack*edge*wave*(.7*decay+.8*collective);
   const cu=i===1?C.C01.u[1]:i===2?C.C12.u[1]:C.C03.u[1];
   d+=attack*packet(u,reflect(cu+dt*.24),.08,12)*Math.exp(-dt*.3);
  }
  for(const [id,at,ia,ib]of pinEvents){const side=i===ia?0:i===ib?1:-1;if(side<0)continue; const tc=(t-at)/.14;
   if(Math.abs(tc)<4)d*=1-Math.exp(-tc*tc*3)*Math.exp(-Math.pow((u-C[id].u[side])/.07,2)*4);
  }
  return d*edge;
 }
 function point(i,u,t){const q=L[i],dx=(q.p1[0]-q.p0[0])*W,dy=(q.p1[1]-q.p0[1])*H,n=Math.hypot(dx,dy),d=rawDis(i,u,t);return [lerp(q.p0[0],q.p1[0],u)*W-dy/n*d,lerp(q.p0[1],q.p1[1],u)*H+dx/n*d]}
 function active(i,t){if(i===0)return 1;const times=[0,4,9,11];return win(t,times[i],times[i]+.75)*(1-win(t,27.5,28));}
 function path(ctx,pts){ctx.beginPath();for(let i=0;i<pts.length;i++){if(i===0)ctx.moveTo(...pts[i]);else ctx.lineTo(...pts[i]);}}
 function lineSegment(ctx,i,a,b,t,color,width,alpha=1){if(alpha<=.001||b<=a)return;const ps=[];const steps=Math.max(8,Math.ceil((b-a)*240));for(let k=0;k<=steps;k++)ps.push(point(i,lerp(a,b,k/steps),t));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=alpha;path(ctx,ps);ctx.stroke();ctx.globalAlpha=1;}
 function drawTraces(ctx,t){
  if(t<14.25||t>=25.2)return;
  const roots=[C.C01.u[0],C.C12.u[0],C.C12.u[1],C.C03.u[1]];
  // Each family is rooted in an already established contact on its parent.
  const families=[];
  for(let i=0;i<4;i++)for(let k=0;k<34;k++){
   const v=(k-16.5)/16.5,birth=14.25+Math.abs(v)*1.5+i*.21;
   const grow=win(t,birth,birth+2.2);
   const retract=1-win(t,23+((1-Math.abs(v))*.38)+(i===0?.4:0),24.4+(i===0?.7:0));
   const length=grow*retract;if(length<=.002)continue;
   const depth=win(t,16.5,18)*(1-win(t,23.8,25));
   const root=roots[i],tipL=root*(.72+.28*Math.abs(v))*length,tipR=(1-root)*(.72+.28*Math.abs(v))*length;
   families.push({i,k,v,depth,length,root,a:root-tipL,z:root+tipR});
  }
  families.sort((a,b)=>a.v-b.v);
  for(const f of families){const {i,k,v,depth,length,root,a,z}=f,q=L[i],dx=(q.p1[0]-q.p0[0])*W,dy=(q.p1[1]-q.p0[1])*H,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
   const ps=[],count=116;for(let j=0;j<=count;j++){const u=lerp(a,z,j/count),r=(u-root),at=point(i,u,t),edge=Math.sin(Math.PI*(u-a)/(z-a));
    const memory=rawDis(i,u,Math.max(starts[i],t-Math.abs(v)*1.65)) - rawDis(i,u,t);
    const roll=Math.sin(r*9.0+t*.18+i*.8)*Math.sin(Math.PI*u);
    // In-plane curvature plus <=45px projected depth; both vanish at the root.
    const off=(memory*(1.4+Math.abs(v)) + v*92*Math.sin(r*7.5)*Math.sin(Math.PI*u))*depth*length;
    const dep=v*43*depth*edge*Math.sin(r*8.6);
    ps.push([at[0]+nx*off+dep*.75,at[1]+ny*off+dep*.28]);
   }
   let brightness=1.15*(.32+.26*(1-Math.abs(v)));brightness*=1+.11*(Math.exp(-Math.pow((t-E.crest1)/.3,2))+Math.exp(-Math.pow((t-E.crest2)/.3,2))+Math.exp(-Math.pow((t-E.crest3)/.3,2)));
   // Multiple thin runs taper, avoiding uniform wire-like thickness.
   for(let seg=0;seg<6;seg++){const p=ps.slice(Math.floor(seg*count/6),Math.floor((seg+1)*count/6)+1),mid=p[Math.floor(p.length/2)];const avoid=1-.9*Math.exp(-Math.pow((mid[0]/W-.345)/.055,2)-Math.pow((mid[1]/H-.53)/.1,2));
    ctx.globalAlpha=brightness*avoid;ctx.strokeStyle=(k%7===0)?'#e4c78c':(i%2?'#a9926b':'#c8aa76');ctx.lineWidth=(.42+.45*Math.sin(Math.PI*(seg+.5)/6))*(1-.18*Math.abs(v));path(ctx,p);ctx.stroke();
   }
   // Retrospective cross-grain: short paired fragments, never a whole mesh opacity reveal.
   if(k%5===0){ctx.globalAlpha=.12;ctx.strokeStyle='#e8d8b7';ctx.lineWidth=.7;path(ctx,ps);ctx.stroke()}
  }ctx.globalAlpha=1;
 }
 const A=[{line:2,u0:(.77-L[2].p0[0])/(L[2].p1[0]-L[2].p0[0]),u1:C.C12.u[1],t0:25,t1:25.2},{line:1,u0:C.C12.u[0],u1:C.C01.u[1],t0:25.2,t1:E.returnA},{line:0,u0:C.C01.u[0],u1:.3,t0:E.returnA,t1:E.markA}];
 const B=[{line:3,u0:(.58-L[3].p0[0])/(L[3].p1[0]-L[3].p0[0]),u1:C.C13.u[1],t0:25.2,t1:25.5},{line:1,u0:C.C13.u[0],u1:C.C01.u[1],t0:25.5,t1:E.returnB},{line:0,u0:C.C01.u[0],u1:.3,t0:E.returnB,t1:E.markB}];
 function routePoint(route,t){const l=route.find(x=>t>=x.t0&&t<=x.t1);if(!l)return null;return {p:point(l.line,lerp(l.u0,l.u1,clamp((t-l.t0)/(l.t1-l.t0))),t),line:l.line,u:lerp(l.u0,l.u1,clamp((t-l.t0)/(l.t1-l.t0)))};}
 function drawRoute(ctx,route,t,intensity){const head=routePoint(route,t);if(!head)return;const pts=[];for(let dt=.15;dt>=0;dt-=.01){const p=routePoint(route,t-dt);if(p)pts.push(p.p)}if(pts.length>1){ctx.strokeStyle='#dfc28c';ctx.lineWidth=3.5*intensity;ctx.globalAlpha=.55;path(ctx,pts);ctx.stroke();}lineSegment(ctx,head.line,clamp(head.u-.009),clamp(head.u+.009),t,'#f5e6bf',2.8*intensity,.95);ctx.globalAlpha=1;}
 function drawContact(ctx,id,t,at){const age=t-at;if(age<0||age>.55)return;const c=C[id],x=c.xy[0]*W,y=c.xy[1]*H,a=Math.exp(-age*7);ctx.globalAlpha=.6*a;ctx.strokeStyle='#e4c78c';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(x,y,3+age*14,2+age*8,0,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
 function render(ctx,t){t=clamp(t,0,32);ctx.clearRect(0,0,W,H);ctx.drawImage(bg,0,0);ctx.lineCap='round';ctx.lineJoin='round';drawTraces(ctx,t);
  for(let i=3;i>=0;i--){const a=active(i,t);if(a<=.001)continue;lineSegment(ctx,i,0,1,t,L[i].color,L[i].width+4,a*.035);lineSegment(ctx,i,0,1,t,L[i].color,L[i].width,a);
   // Restrained anchor dimples, not UI labels.
   for(const u of [0,1]){const p=point(i,u,t);ctx.fillStyle=i===0?'#73695a':'#3b3a36';ctx.globalAlpha=a;ctx.beginPath();ctx.arc(...p,i===0?2.6:1.7,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  }
  // Short gold remnants precede the large afterimage field.
  if(t>=E.response2&&t<25)lineSegment(ctx,1,C.C12.u[0]-.008,C.C12.u[0]+.008+.08*win(t,14.25,15),t,'#bd995b',2.1,1-win(t,23.6,25));
  if(t>=E.response3&&t<25)lineSegment(ctx,0,C.C03.u[0]-.008,C.C03.u[0]+.008+.09*win(t,14.25,15),t,'#bd995b',2.6,1-win(t,24,25));
  for(const [id,at]of [['C01',E.contact01],['C12',E.contact12],['C03',E.contact03],['C01',E.crest1],['C12',E.crest2],['C03',E.crest3]])drawContact(ctx,id,t,at);
  drawRoute(ctx,A,t,1);drawRoute(ctx,B,t,.76);
  const red=point(0,.3,t);lineSegment(ctx,0,.290,.310,t,'#de6853',7.2,1);ctx.fillStyle='#df7562';ctx.globalAlpha=.35;ctx.beginPath();ctx.arc(...red,2.2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  for(const [at,x0,x1]of [[E.markA,.355,.373],[E.markB,.386,.404]])if(t>=at){const a=(x0-.1)/.8,b=(x1-.1)/.8;lineSegment(ctx,0,a,lerp(a,b,win(t,at,at+.16)),t,'#dfbf7a',6.0,1)}
  return {physicalStringCount:4,redMarkCount:1,goldMarks:Number(t>=E.markA)+Number(t>=E.markB),t};
 }
 return {render,point,rawDis,contacts:C,routes:{A,B},routePoint,active,metadata:{duration:32,physicalStrings:4,redMarks:1}};
}
module.exports={makeScene,intersection};
