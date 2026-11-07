// Original film source: procedural geometry and animation. No upstream demo code.
'use strict';
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const W=1920,H=1080,PI=Math.PI,INK='#271e18';canvas.width=W;canvas.height=H;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,p)=>a+(b-a)*p;
const smooth=p=>{p=clamp(p);return p*p*(3-2*p)};
const seg=(t,a,b)=>smooth((t-a)/(b-a));
function random(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=random(73116);
function bez(a,b,c,d,n=80){let p=[];for(let i=0;i<=n;i++){let t=i/n,u=1-t;p.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]])}return p}
function join(...s){return s.flatMap((x,i)=>i?x.slice(1):x)}
function ellipse(x,y,rx,ry,a=0,b=PI*2,n=100){return Array.from({length:n+1},(_,i)=>[x+rx*Math.cos(lerp(a,b,i/n)),y+ry*Math.sin(lerp(a,b,i/n))])}
function linePath(c,p){c.beginPath();p.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));}
function swollen(c,p,w=1,progress=1,alpha=1){
 if(progress<=0||p.length<2)return;let n=Math.max(2,Math.floor((p.length-1)*clamp(progress))+1);p=p.slice(0,n);let l=[],r=[];
 for(let i=0;i<p.length;i++){let prev=p[Math.max(0,i-1)],next=p[Math.min(p.length-1,i+1)],dx=next[0]-prev[0],dy=next[1]-prev[1],m=Math.hypot(dx,dy)||1;let u=i/(p.length-1),width=w*(.16+.84*Math.pow(Math.sin(PI*u),.72));l.push([p[i][0]-dy/m*width/2,p[i][1]+dx/m*width/2]);r.push([p[i][0]+dy/m*width/2,p[i][1]-dx/m*width/2]);}
 c.globalAlpha=alpha;linePath(c,[...l,...r.reverse()]);c.closePath();c.fill();c.globalAlpha=1;
}
function outlineParts(p,w=2.2){let arr=[];for(let i=0;i<p.length-1;i+=22)arr.push({p:p.slice(i,Math.min(p.length,i+26)),w,g:0});return arr}
function makeComp(width,height,origin,paths,drawTimes=[0,1,2],clipBoundaries=null){
 let cv=document.createElement('canvas');cv.width=width*2;cv.height=height*2;const c=cv.getContext('2d');let last=-1; const endTime=Math.max(...paths.map(s=>drawTimes[s.g]+(s.delay||0)+(s.dur||.65)));
 return {cv,origin,width,height,draw(t){if(t>=endTime&&last===999)return cv;const quant=Math.floor(t*24)/24;if(quant===last)return cv;last=quant;c.setTransform(2,0,0,2,origin[0]*2,origin[1]*2);c.clearRect(-origin[0],-origin[1],width,height);c.save();if(clipBoundaries){c.beginPath();for(const boundary of clipBoundaries){boundary.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();}c.clip();}c.fillStyle=INK;for(let i=0;i<paths.length;i++){let s=paths[i],start=drawTimes[s.g]+(s.delay||0);swollen(c,s.p,s.w,clamp((t-start)/(s.dur||.65)),s.alpha||1)}c.restore();if(t>=endTime)last=999;return cv},paths};
}
function drawComp(c,obj,t,x,y,rot=0,s=1,flip=1){c.save();c.translate(x,y);c.rotate(rot);c.scale(s*flip,s);c.drawImage(obj.draw(t),-obj.origin[0],-obj.origin[1],obj.width,obj.height);c.restore()}
// Shell valve: an asymmetrical ridged, tapering pod with curved hatch ribbons.
let valveBoundary=join(bez([0,0],[-52,-60],[-150,-153],[-59,-250]),bez([-59,-250],[-28,-285],[-3,-310],[0,-334]),bez([0,-334],[13,-224],[30,-94],[0,0]));
let vp=outlineParts(valveBoundary,2.4);
for(let j=0;j<58;j++){let u=(j+1)/60,y=-u*325,span=89*Math.pow(Math.sin(PI*u),.95)*(1-.35*u);let p=bez([-span,y+18],[ -span*.75,y-4],[-span*.3,y-18],[5*(1-u),y-26],46);vp.push({p,w:.45+1.2*Math.pow(1-u,.6),g:1,delay:j*.016,dur:.45});}
for(let j=0;j<22;j++){let u=(j+1)/24;vp.push({p:bez([-4,-12-u*293],[-28,-20-u*290],[-48,-38-u*245],[-49,-48-u*220],38),w:.65,g:2,delay:j*.018,dur:.45})}
for(let k=0;k<7;k++){let a=k/6;vp.push({p:bez([0,0],[-12-a*28,-74],[-65+a*53,-186],[0,-334]),w:1.5-a*.7,g:1,delay:k*.035,dur:.8});}
const valve=makeComp(260,400,[155,365],vp,[-1,-.8,.8],[valveBoundary]);
// Stem and lanceolate leaves, drawn specifically for this film.
let sp=[];let stem=bez([710,880],[728,790],[821,750],[885,635],130);sp.push(...outlineParts(stem,4.1));sp.push({p:bez([715,880],[737,790],[831,750],[889,636]),w:1.3,g:1});
function leaf(base,tip,bend,width,delay){let [bx,by]=base,[tx,ty]=tip,dx=tx-bx,dy=ty-by,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;let f=(u,v)=>[bx+dx*u+nx*(Math.sin(PI*u)*bend+v),by+dy*u+ny*(Math.sin(PI*u)*bend+v)];let edge=[];for(let i=0;i<=60;i++){let u=i/60;edge.push(f(u,Math.sin(PI*u)*width*(1+.07*Math.sin(u*PI*10))))}for(let i=60;i>=0;i--){let u=i/60;edge.push(f(u,-Math.sin(PI*u)*width*.65))}sp.push(...outlineParts(edge,1.8).map(s=>({...s,delay})));for(let j=1;j<62;j++){let u=j/64;for(let side of [-1,1]){let p=[];for(let k=0;k<=16;k++){let v=k/16,uv=clamp(u+.12*v);p.push(f(uv,side*Math.sin(PI*uv)*width*v*(side<0?.65:1)))}sp.push({p,w:side>0?.8:1.2,g:1,delay:delay+j*.009,dur:.3})}}let vein=[];for(let i=0;i<=80;i++)vein.push(f(i/80,0));sp.push({p:vein,w:1.65,g:1,delay,dur:.6});}
leaf([761,791],[443,547],-22,38,.1);leaf([806,727],[1121,638],-18,31,.25);leaf([842,692],[646,430],19,38,.55);leaf([740,838],[487,809],-10,25,.8);
const plant=makeComp(900,720,[-350,-260],sp,[3.5,4.3,5.5]);
// A spiral samara. Shape and vein topology are original, fictional morphology.
const wingBoundary=join(bez([0,15],[15,-36],[38,-82],[95,-110]),bez([95,-110],[151,-141],[245,-146],[287,-205]),bez([287,-205],[283,-99],[228,-37],[157,-24]),bez([157,-24],[86,-10],[30,29],[0,15]));
let wp=outlineParts(wingBoundary,1.8);
const root=[0,15];
for(let j=0;j<70;j++){let u=(j+.5)/71;let end=[lerp(32,283,u),-21-183*Math.pow(u,3.1)];let c1=[25+150*u,-20-85*u],c2=[55+190*u,-22-125*Math.pow(u,2)];wp.push({p:bez(root,c1,c2,end,55),w:.35+.8*(1-u),g:1,delay:j*.006,dur:.6});}
for(let j=0;j<26;j++){let u=j/27;wp.push({p:bez([38+130*u,-25-18*u],[40+153*u,-43-22*u],[52+154*u,-63-43*u],[73+169*u,-91-82*u],34),w:.5,g:2,delay:j*.01,dur:.45});}
let seedBoundary=join(bez([0,25],[-45,9],[-27,-51],[-3,-49]),bez([-3,-49],[31,-36],[34,7],[0,25]));wp.push(...outlineParts(seedBoundary,2.4));
for(let j=0;j<31;j++){let u=(j+1)/33,y=-46+u*70,w=25*Math.sin(PI*u);wp.push({p:bez([-w,y],[-w*.3,y+8],[w*.4,y+9],[w,y-3]),w:.5+1.2*u,g:1,delay:j*.012,dur:.4});}
for(let j=0;j<14;j++){let u=j/13;wp.push({p:bez([-16+u*30,-42],[-25+u*48,-15],[-10+u*33,8],[0,23]),w:.7,g:2,delay:j*.01,dur:.4});}
const wing=makeComp(370,290,[55,230],wp,[-4,-3,-1],[wingBoundary,seedBoundary]);
const paper=document.createElement('canvas');paper.width=W;paper.height=H;const pc=paper.getContext('2d');pc.fillStyle='#f0e8d5';pc.fillRect(0,0,W,H);
let id=pc.getImageData(0,0,W,H);for(let y=0;y<H;y++)for(let x=0;x<W;x++){let i=(y*W+x)*4,n=(rnd()-.5)*3.8+1.5*Math.sin(y*.73)+.8*Math.sin(x*.013+y*.004);id.data[i]+=n;id.data[i+1]+=n;id.data[i+2]+=n;}pc.putImageData(id,0,0);
for(let i=0;i<4200;i++){let x=rnd()*W,y=rnd()*H;pc.strokeStyle=`rgba(113,93,56,${.015+rnd()*.04})`;pc.lineWidth=.4;pc.beginPath();pc.moveTo(x,y);pc.lineTo(x+2+rnd()*11,y+(rnd()-.5)*2);pc.stroke()}
pc.strokeStyle='rgba(89,66,39,.12)';pc.lineWidth=2;pc.strokeRect(70,50,1780,976);pc.strokeStyle='rgba(255,255,255,.6)';pc.strokeRect(73,53,1774,970);pc.strokeStyle='rgba(51,36,23,.75)';pc.lineWidth=1.5;pc.strokeRect(88,70,1744,934);pc.lineWidth=.6;pc.strokeRect(96,78,1728,918);
function track(t,keys){for(let i=1;i<keys.length;i++){if(t<=keys[i][0]){let a=keys[i-1],b=keys[i],p=seg(t,a[0],b[0]);return a.slice(1).map((v,j)=>j===2?Math.exp(lerp(Math.log(v),Math.log(b[j+1]),p)):lerp(v,b[j+1],p));}}return keys.at(-1).slice(1)}
const CAM=[[0,882,452,4.6,-.025],[3.7,884,385,3.5,0],[8.5,883,555,1.04,0],[10.8,1050,490,1.52,.015],[14,970,470,1.72,0],[17.7,970,470,1.72,0],[22,1190,440,1.62,-.035],[26,1192,480,1.28,0],[29,960,540,1,0],[36,960,540,1.015,0]];
function inkText(c,text,x,y,size,at,t,{italic=false,spacing=0,align='center',font='Latin',weight=400}={}){let n=Math.floor(clamp((t-at)/.65)*text.length);if(n<=0)return;c.font=`${italic?'italic ':''}${weight} ${size}px ${font}`;c.fillStyle=INK;c.textAlign='left';let widths=[...text].map(ch=>c.measureText(ch).width+spacing),total=widths.reduce((a,b)=>a+b,0)-spacing;let xx=align==='center'?x-total/2:align==='right'?x-total:x;for(let i=0;i<Math.min(n,text.length);i++){c.fillText(text[i],xx,y);xx+=widths[i]}}
function stroke(c,p,w=1){c.strokeStyle=INK;c.lineWidth=w;linePath(c,p);c.stroke()}
function wash(c,t){let p=seg(t,22.2,25);if(p<=0)return;c.save();linePath(c,wingBoundary);c.closePath();c.clip();c.globalCompositeOperation='multiply';let reach=440*p;c.beginPath();for(let i=0;i<=120;i++){let a=i/120*2*PI,r=reach*(1+.035*Math.sin(i*1.7)+.016*Math.sin(i*3.1));let x=22+Math.cos(a)*r,y=-18+Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y)}c.closePath();let g=c.createRadialGradient(23,-20,10,23,-20,320);g.addColorStop(0,'rgba(160,73,61,.37)');g.addColorStop(.65,'rgba(179,82,74,.24)');g.addColorStop(1,'rgba(148,53,55,.36)');c.fillStyle=g;c.fill();c.strokeStyle='rgba(134,51,46,.15)';c.lineWidth=2.1;c.stroke();for(let j=0;j<130;j++){let x=(j*77.72)%300,y=-((j*49.19)%200);if(Math.hypot(x-22,y+18)<reach){c.fillStyle=`rgba(110,50,40,${.012+(j%5)*.004})`;c.beginPath();c.ellipse(x,y,2+(j%4),1.1,0,0,PI*2);c.fill()}}c.restore()}
function wingState(t){let f=seg(t,17,26),un=seg(t,17.2,21);return {x:885+f*430,y:505-f*115-45*Math.sin(PI*f),r:lerp(-1.1,-.08,un)+.07*Math.sin(f*PI*3)*Math.sin(PI*f),s:lerp(.42,1.05,un)}}
function drawSeed(c,t){if(t<15.4)return;let a=wingState(t);c.save();c.translate(a.x,a.y);c.rotate(a.r);c.scale(a.s,a.s);wash(c,t);c.drawImage(wing.draw(t),-55,-230,370,290);c.restore()}
function roundel(c,t){let p=seg(t,10,11.5);if(p<=0)return;const final=seg(t,25,29),x=lerp(1330,1374,final),y=lerp(540,760,final),r=lerp(82,103,final)*p;c.save();c.beginPath();c.arc(x,y,r,0,PI*2);c.fillStyle='#f0e8d5';c.fill();c.strokeStyle=INK;c.lineWidth=1.5;c.stroke();c.beginPath();c.arc(x,y,r-5,0,PI*2);c.lineWidth=.65;c.stroke();c.clip();for(let y0=y-100;y0<=y+100;y0+=9)stroke(c,[[x-105,y0],[x+105,y0]],.25);c.translate(x-45,y+28);c.scale(.49,.49);drawComp(c,wing,99,0,0,-.18,1);c.restore();if(t>11.2){let lp=clamp((t-11.2)/.8);let lead=[[1002,479],[1150,510],[x-45,y-r*.7]];stroke(c,lead.slice(0,1+Math.ceil(lp*2)),.7)}inkText(c,'I · PLICA',x,y+r+30,20,11.5,t,{spacing:2});inkText(c,'叠翼',x,y+r+62,25,11.5,t,{font:'CJK'});}
function windLines(c,t){let f=seg(t,18,26);if(f<=0)return;for(let j=0;j<4;j++){let p=bez([1000+j*10,520+j*38],[1120,470+j*32],[1410,540+j*26],[1670,370+j*43],130);c.fillStyle=INK;swollen(c,p,.4+.15*j,f,.45)}for(let j=0;j<3;j++){let x=1490+j*55,y=586-j*25;stroke(c,[[x,y],[x+35,y-11],[x+25,y-11]],.6)}}
function plateLabels(c,t){if(t<28.5)return;inkText(c,'空荚',875,928,25,28.5,t,{font:'CJK'});inkText(c,'DEHISCENTIA',875,892,19,28.5,t,{spacing:2});inkText(c,'S E M E N',1470,605,20,28.5,t,{spacing:1});inkText(c,'想象植物图志  ·  01',143,140,22,28.5,t,{font:'CJK',align:'left'});inkText(c,'FICTITIOUS SPECIMEN',143,172,16,28.5,t,{spacing:1.5,align:'left'});inkText(c,'PL. I',1773,141,22,28.5,t,{italic:true,align:'right'});inkText(c,'风 的 信',960,140,58,28.5,t,{font:'CJK'});inkText(c,'LETTER TO THE WIND',960,184,25,28.5,t,{spacing:5});inkText(c,'ORIGINAL CODE FILM',143,972,16,28.5,t,{spacing:2,align:'left'});inkText(c,'INTAGLIO STUDY · 2026',1774,972,16,28.5,t,{spacing:1.8,align:'right'});}
const captions=[{a:5,b:10.5,text:'先把远方，折进身体。'},{a:18,b:24,text:'再把离开，交给一阵风。'},{a:28,b:36,text:'空下来的地方，也是一封回信。'}];
function subtitle(c,t){for(let s of captions){if(t<s.a||t>=s.b)continue;const ww=820,hh=76,x=960-ww/2,y=950;c.fillStyle='#f4edde';c.shadowColor='rgba(55,37,14,.14)';c.shadowBlur=3;c.shadowOffsetY=2;c.beginPath();for(let i=0;i<=40;i++){let xx=x+i*ww/40,yy=y+(i%3)*.65;i?c.lineTo(xx,yy):c.moveTo(xx,yy)}for(let i=40;i>=0;i--)c.lineTo(x+i*ww/40,y+hh+(i%3)*.5);c.closePath();c.fill();c.shadowColor='transparent';c.shadowBlur=0;inkText(c,s.text,960,1000,33,s.a,t,{font:'CJK'});}}
function render(t){t=clamp(t,0,36);ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#f0e8d5';ctx.fillRect(0,0,W,H);let [cx,cy,z,r]=track(t,CAM);ctx.save();ctx.translate(W/2,H/2);ctx.rotate(r);ctx.scale(z,z);ctx.translate(-cx,-cy);ctx.drawImage(paper,0,0);drawComp(ctx,plant,t,0,0);roundel(ctx,t);windLines(ctx,t);drawSeed(ctx,t);
 const open=seg(t,15.4,18.2),anticipate=.025*Math.sin(seg(t,14.2,15.4)*PI);for(let side of [1,-1]){ctx.save();ctx.translate(885,635);ctx.rotate(side*(open*.95-anticipate));ctx.scale(side,1); // Paper occlusion behind each intaglio valve.
 linePath(ctx,valveBoundary);ctx.closePath();ctx.fillStyle='#f0e8d5';ctx.fill();ctx.drawImage(valve.draw(t),-155,-365,260,400);ctx.restore()}
 // The seam is established in the opening before the whole form reveals itself.
 if(open<.5){ctx.fillStyle=INK;swollen(ctx,bez([885,635],[900,535],[882,415],[885,301],100),1.5,1-open*2)}
 plateLabels(ctx,t);ctx.restore();subtitle(ctx,t);window._state={t,camera:[cx,cy,z,r],seed:wingState(t),opening:open};}
window.render=render;window.DUR=36;window.EV=[{t:0,type:'engrave'},{t:5,type:'plant_build'},{t:10,type:'ring'},{t:13.7,type:'paper_jcut'},{t:14.5,type:'silence_start'},{t:15.4,type:'open_pod'},{t:17,type:'release'},{t:18,type:'wind_lcut'},{t:21.5,type:'silence_start'},{t:22.2,type:'wash'},{t:27.2,type:'title'},{t:28,type:'final_note'}];
window.TEXTS=t=>captions.filter(s=>t>=s.a&&t<s.b).map((s,i)=>({id:'caption'+s.a,text:s.text,x0:550,y0:950,x1:1370,y1:1026}));
document.fonts.ready.then(()=>{window.READY=true;render(0)});
