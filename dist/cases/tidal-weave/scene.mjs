export const config={id:'tidal-weave',title:'潮汐织场',subtitle:'WARP / WEFT / WATER',description:'经纬丝带沿共同的波面起伏，交叉处严格交替穿插，织幅参数控制波动强度。',category:'coding-motion',useCase:'纺织品牌视觉、抽象艺术海报、参数化设计展示',accent:'#df7659',duration:20,parameter:{label:'潮汐织幅',min:0,max:100,step:1,value:66,unit:'%'}};
export function weaveState(t,value){const amplitude=5+Math.max(0,Math.min(100,value))*.32;return {amplitude,phase:t*Math.PI*2/config.duration,warps:Array.from({length:13},(_,i)=>i),wefts:Array.from({length:11},(_,i)=>i)};}
export function weavePoint(u,v,t,value){const {amplitude:a,phase:p}=weaveState(t,value);return {x:252+u*58+Math.sin(v*.5+p)*a,y:182+v*42+Math.sin(u*.42-p)*a+Math.sin(v*.6+u*.4+p)*a*.28};}
function ribbon(c,axis,index,start,end,t,value,color,thickness=23){const points=[];const count=Math.ceil((end-start)*12);for(let i=0;i<=count;i++){const k=start+(end-start)*i/count;points.push(weavePoint(axis==='warp'?index:k,axis==='warp'?k:index,t,value));}c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.lineWidth=thickness;c.strokeStyle=color;c.lineCap='butt';c.stroke();c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x-3,p.y-3):c.moveTo(p.x-3,p.y-3));c.lineWidth=1;c.strokeStyle='#fff5d533';c.stroke();}
function label(c,s,x,y,size=12,color='#e8dfca'){c.fillStyle=color;c.font=`${size}px "Noto Sans CJK SC", ui-monospace, monospace`;c.fillText(s,x,y);}
export function render(c,{t,value,width,height}){c.save();c.scale(width/1200,height/800);c.fillStyle='#172a2a';c.fillRect(0,0,1200,800);const bg=c.createRadialGradient(600,410,10,600,410,590);bg.addColorStop(0,'#30423a');bg.addColorStop(1,'#122324');c.fillStyle=bg;c.fillRect(0,0,1200,800);
label(c,'TEXTILE STUDIES / 03',48,53,13,'#d5ac85');label(c,'潮汐织场',48,100,34);label(c,'WARP / WEFT / WATER',850,53,16);label(c,'A COMPUTATIONAL WOVEN SURFACE',850,78,11,'#a9b3a2');
const st=weaveState(t,value);c.save();c.translate(0,20);c.shadowColor='#051b1b';c.shadowBlur=18;c.shadowOffsetY=15;
for(const u of st.warps)ribbon(c,'warp',u,-.7,10.7,t,value,u%3===0?'#e8d9b4':'#a8b8a5',24);c.shadowBlur=0;c.shadowOffsetY=0;
for(const v of st.wefts)ribbon(c,'weft',v,-.6,12.6,t,value,v%3===0?'#e7a46b':'#c8664b',24);
// Restore alternating warp crossings. The same coordinate field is used for both
// directions, so crossings remain attached as the fabric moves.
for(const u of st.warps)for(const v of st.wefts)if((u+v)%2===0){ribbon(c,'warp',u,v-.33,v+.33,t,value,'#152927',29);ribbon(c,'warp',u,v-.35,v+.35,t,value,u%3===0?'#e8d9b4':'#a8b8a5',24);}
// Fine parallel filaments give each broad strip a material rather than particle texture.
for(const u of st.warps){for(const v of [-.85,10.85]){const p=weavePoint(u,v,t,value);c.strokeStyle='#e2dbbd77';c.lineWidth=1;for(let j=-2;j<=2;j++){c.beginPath();c.moveTo(p.x+j*4,p.y);c.lineTo(p.x+j*4+Math.sin(st.phase+u+j)*3,p.y+(v<0?-15:15));c.stroke();}}}
c.restore();
label(c,'经 / WARP',48,349,12,'#c8d6bb');label(c,'纬 / WEFT',48,375,12,'#e69b70');c.fillStyle='#b8c2a9';c.fillRect(48,398,52,7);c.fillStyle='#cc7653';c.fillRect(48,413,52,7);label(c,'OVER',1030,355,12);label(c,'UNDER',1030,378,12);label(c,'REPEAT',1030,401,12,'#d5ac85');
c.strokeStyle='#f2d9ab33';c.beginPath();c.moveTo(48,724);c.lineTo(1152,724);c.stroke();label(c,'An imagined tide passing through an ordered weave.',48,765,13,'#b7c1b4');label(c,`WEAVE ${Math.round(value)}%`,1000,765,14,'#e7b38a');c.restore();}
