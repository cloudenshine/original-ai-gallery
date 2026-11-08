// Deterministic export of the existing SVG scene; original interaction stays unchanged.
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const spec=require('./timeline.json');
const root=path.resolve(__dirname,'..');
function state(t){return t<spec.switchAt?{sun:Math.min(360,Math.max(0,(t-spec.firstStart)*30)),mode:'ring'}:{sun:Math.min(360,Math.max(0,(t-spec.secondStart)*30)),mode:'carrier'}}
function labels(t){
 if(t<2)return [['转动之间',40],['同一组行星齿轮',25],['换一个固定部件',25]];
 if(t<8)return [['① 固定齿圈',30],['太阳轮顺时针转动',30],['看编号 1：',25],['它的中心在移动',25]];
 if(t<14)return [['行星架带着三个中心',30],['绕太阳轮转动',30]];
 if(t<16)return [['太阳轮 +360°',30],['行星架 +120°',30],['齿圈 0°',30]];
 if(t<18)return [['重置到起点',25],['② 改为固定行星架',30]];
 if(t<24)return [['太阳轮仍顺时针转动',30],['看编号 1：',25],['中心留在原处',30]];
 return [['三个中心不再绕行',30],['外侧齿圈逆时针转动',30]];
}
async function main(){
 const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');const sharp=require('sharp');
 GlobalFonts.registerFromPath(process.env.CJK_FONT||'/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','Noto Sans CJK SC');
GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf','monospace');

 const {scene}=await import(path.join(root,'scene.mjs'));
 const canvas=createCanvas(spec.width,spec.height),ctx=canvas.getContext('2d');
 const bounds=[];
 function text(s,x,y,size,color='#f5efdf',weight='400'){
  ctx.font=`${weight} ${size}px "Noto Sans CJK SC"`;ctx.fillStyle=color;
  const w=ctx.measureText(s).width;if(x+w>1240)throw Error(`Overflow: ${s} ${w}`);
  ctx.fillText(s,x,y);bounds.push(w);
 }
 async function paint(t){
  const s=state(t);let svg=scene(s.sun,s.mode),count=0;
  svg=svg.replace(/<text x="0" y="4" text-anchor="middle" font-family="monospace" font-size="10" fill="#f5efdf">([123])<\/text>/g,(_,n)=>{count++;return `<text x="0" y="5" text-anchor="middle" font-family="monospace" font-size="16" fill="#f5efdf">${n}</text>`});
  if(count!==3)throw Error('Planet-label selector must match exactly three numbers');
  // Equivalent SVG angles avoid a native rasterizer large-angle group omission.
  svg=svg.replace(/rotate\(([-\d.]+)\)/g,(_,a)=>`rotate(${((Number(a)%360)+360)%360})`);
  ctx.fillStyle='#102e2c';ctx.fillRect(0,0,1280,720);ctx.drawImage(await loadImage(await sharp(Buffer.from(svg)).resize(680,680).png().toBuffer()),20,20,680,680);
  ctx.strokeStyle='#42665f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(720,80);ctx.lineTo(720,610);ctx.stroke();
  if(t>=30){text('太阳轮同样转一圈',740,130,22,'#a9bcb1');text('固定齿圈：',740,220,24);text('行星架顺转 120°',740,270,34,'#e8d5a7','700');text('固定行星架：',740,365,24);text('齿圈反转 180°',740,415,34,'#e8d5a7','700');text('固定谁，改变了谁在转。',740,540,22,'#a9bcb1');}
  else {let y=160;for(const [s,size]of labels(t)){text(s,740,y,size,(t>=14&&t<16)?'#e8d5a7':'#f5efdf');y+=size*1.5+25;}}
  text('理想运动学示意',740,646,18,'#a9bcb1');text('声音为设计配乐，非机械实录',740,674,18,'#a9bcb1');
 }
 if(process.argv.includes('--stills')){for(const t of [0,5,13,14,16,20,29,31]){await paint(t);fs.writeFileSync(path.join(root,`demo-frame-${t}.png`),canvas.toBuffer('image/png'));}return;}
 const out=path.join(root,'demo-silent-v2.mp4');if(fs.existsSync(out))throw Error('Refusing to overwrite export');
 const ff=spawn('ffmpeg',['-v','error','-f','rawvideo','-pix_fmt','rgba','-s','1280x720','-r','24','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',out]);
 let error='';ff.stderr.on('data',d=>error+=d);const done=new Promise((resolve,reject)=>{ff.on('error',reject);ff.on('close',c=>c?reject(Error(error)):resolve())});
 for(let n=0;n<816;n++){await paint(n/24);if(!ff.stdin.write(Buffer.from(ctx.getImageData(0,0,1280,720).data)))await new Promise(r=>ff.stdin.once('drain',r));if(n%240===0)console.log(`frame ${n}/816`);}
 ff.stdin.end();await done;console.log(JSON.stringify({frames:816,maxTextWidth:Math.max(...bounds),width:1280,height:720}));
}
module.exports={state,labels};if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1});
