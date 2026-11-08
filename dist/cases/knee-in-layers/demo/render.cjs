// Local reproduction: node render.cjs [--stills]. Requires installed sharp and @napi-rs/canvas, ffmpeg.
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');const sharp=require('sharp');
const ROOT=__dirname;GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','NotoCJK');
const spec=JSON.parse(fs.readFileSync(path.join(ROOT,'cues.json')));const html=fs.readFileSync(path.join(ROOT,'source/index.html'),'utf8');
const svg=html.match(/<svg[\s\S]*?<\/svg>/)[0];const defs=svg.match(/<defs>[\s\S]*?<\/defs>/)[0];
const groups=[...svg.matchAll(/<g data-shape="([^"]+)">([\s\S]*?)<\/g>/g)];
const c=createCanvas(1280,720),ctx=c.getContext('2d');
function txt(t,x,y,size=24,color='#173b34'){ctx.font=`${size}px NotoCJK`;ctx.fillStyle=color;ctx.fillText(t,x,y);}
function lines(t,x,y,width,size,line,color){ctx.font=`${size}px NotoCJK`;let s='';for(const ch of t){if(ctx.measureText(s+ch).width>width){if('，。；：！？、）》'.includes(ch)){const last=s.slice(-1);txt(s.slice(0,-1),x,y,size,color);y+=line;s=last;}else{txt(s,x,y,size,color);y+=line;s='';}}s+=ch;}if(s)txt(s,x,y,size,color);return y+line;}
(async()=>{const {lesson}=await import('./source/learning.mjs');const images={};for(const [_,id,g] of groups){const s=`<svg xmlns="http://www.w3.org/2000/svg" width="580" height="580" viewBox="0 0 580 580"><style>text{font-family:Noto Sans CJK SC,sans-serif;font-size:16px;fill:#dbe3d8}.latin{font-size:10px;fill:#a3b8a8}</style>${defs}<g>${g}</g></svg>`;images[id]=await loadImage(await sharp(Buffer.from(s)).png().toBuffer());}
const still=process.argv.includes('--stills');let proc;if(!still)proc=spawn('ffmpeg',['-y','-f','rawvideo','-pix_fmt','rgba','-s','1280x720','-r','24','-i','pipe:0','-i',path.join(ROOT,'audio/mix.flac'),'-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',path.join(ROOT,'demo.mp4')],{stdio:['pipe','inherit','inherit']});
const points=still?[0,18,18.3,18.7,36,36.3,36.7,53]:Array.from({length:54*24},(_,i)=>i/24);
for(const t of points){let k=Math.min(2,Math.floor(t/18)),l=lesson(spec.storyboard[k].topic);ctx.fillStyle='#f1f0e7';ctx.fillRect(0,0,1280,720);ctx.fillStyle='#17352f';ctx.fillRect(0,0,660,654);
txt('KNEE IN LAYERS  /  二维分层导览',36,48,20,'#dbe3d8');txt('原创 SVG 关系图 · 非等比例 · 非医学影像',36,78,16,'#a3b8a8');
ctx.strokeStyle='rgba(255,255,255,.045)';ctx.lineWidth=1;for(let i=0;i<580;i+=28){ctx.beginPath();ctx.moveTo(40+i,88);ctx.lineTo(40+i,654);ctx.stroke();ctx.beginPath();ctx.moveTo(40,88+i);ctx.lineTo(620,88+i);ctx.stroke();}
let a=Math.min(1,(t-k*18)/.6);a=a*a*(3-2*a);for(const [_,id]of groups){const now=+l.visible.includes(id),prev=k?+lesson(spec.storyboard[k-1].topic).visible.includes(id):now;ctx.globalAlpha=prev+(now-prev)*a;ctx.drawImage(images[id],40,82);}ctx.globalAlpha=1;
for(let j=0;j<3;j++){ctx.fillStyle=j===k?'#173b34':'#dfe3d8';ctx.fillRect(700+j*174,38,160,44);txt(['01 骨骼','02 半月板','03 肌肉'][j],718+j*174,67,19,j===k?'#f1f0e7':'#64776c');}
txt(l.eyebrow,704,135,18,'#64776c');txt(l.title,704,189,34);let yy=lines(l.text,704,246,526,26,43,'#173b34');ctx.fillStyle='#d5dccf';ctx.fillRect(704,yy+12,526,1);lines(l.note,704,yy+56,526,21,35,'#53695e');txt('原页面学习内容 · 可暂停阅读',704,618,17,'#64776c');
ctx.fillStyle='#e1e6db';ctx.fillRect(0,654,1280,66);txt('二维关系示意，非Anatomy 3D模型，非屈伸实录',36,695,23);txt(`${String(Math.floor(t)).padStart(2,'0')} / 54s`,1120,695,18,'#64776c');
if(still)fs.writeFileSync(path.join(ROOT,`frame-${String(t).replace('.','_')}.png`),c.toBuffer('image/png'));else{const data=ctx.getImageData(0,0,1280,720).data;if(!proc.stdin.write(Buffer.from(data.buffer)))await new Promise(r=>proc.stdin.once('drain',r));}}
if(proc){proc.stdin.end();await new Promise((resolve,reject)=>proc.on('exit',n=>n===0?resolve():reject(Error(n))));}})();
