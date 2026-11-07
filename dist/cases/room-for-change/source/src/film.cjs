const T=require('./timeline.cjs');
const PAPER='#F2F0EA',INK='#141414',GREY='#77756F',LINE='#CBC8C0',SIGNAL='#FF5A00';
function draw(ctx,t){
 function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h);}
 function line(x,y,x2,y2,c=LINE,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
 // Anchor actual ink, not em boxes. All labels stay in one family.
 function txt(s,x,top,size=28,bold=false,color=INK){ctx.fillStyle=color;ctx.font=`${bold?700:400} ${size}px Swiss`;ctx.textBaseline='alphabetic';ctx.textAlign='left';const m=ctx.measureText(s);ctx.fillText(s,x+m.actualBoundingBoxLeft,top+m.actualBoundingBoxAscent);}
 rect(0,0,1920,1080,PAPER);ctx.save();ctx.translate(960,540);ctx.scale(1,1);ctx.translate(-960,-540);
 line(96,216,1824,216,INK,1.5);for(let i=0;i<12;i++){let x=96+i*146;line(x,208,x,216,LINE,1);}line(1824,208,1824,216,LINE,1);
 txt('今日',704,168,52,true);txt('明日',1536,168,52,true);
 rect(1504,240,344,744,'#FAF9F5');ctx.strokeStyle=LINE;ctx.lineWidth=1;ctx.strokeRect(1504,240,344,744);
 for(let i=0;i<8;i++){let p=T.slotPos(i);ctx.strokeStyle='#B7B3A9';ctx.lineWidth=1.5;ctx.strokeRect(p.x,p.y,288,72);txt(T.TIMES[i],p.x-88,p.y-32,25);}
 const state=T.state(t);
 const card=o=>{rect(o.x,o.y,288,72,o.id==='N'?SIGNAL:INK);const fs=o.id==='N'?32:40;ctx.font=`700 ${fs}px Swiss`;const m=ctx.measureText(o.label),inkH=m.actualBoundingBoxAscent+m.actualBoundingBoxDescent;txt(o.label,o.x+24+(o.labelDx||0),o.y+(72-inkH)/2,fs,true,o.id==='N'?INK:PAPER);
 if(t>=10&&t<12.5&&['C','G'].includes(o.id)){rect(o.x+168,o.y+20,96,32,'#BCB9B1');txt('可改期',o.x+180,o.y+24,24);}
 };
 for(const o of state.filter(o=>!o.moving))card(o);for(const o of state.filter(o=>o.moving))card(o);
 if(t<5){txt('虚构日程实验',96,96,32);txt('半小时一格',96,144,28);}
 if(t>=12.5&&t<17.5){rect(1388,368,148,44,PAPER);txt('改期至明日',1392,376,28);}
 let n=t<13.75?0:t<16.25?1:t<25?2:1;txt(String(n),96,264,400,true);txt('余量 / 格',96,600,28);
 if(t>=30)txt('今日 7 件 / 明日 2 件 / 余量 1 格',96,960,28);
 if(t>=35)txt('给变化，留一格。',96,768,56,true);
 if(t>=36.875)txt('意美浮云',96,864,40);
 ctx.restore();
}
module.exports={draw};
