const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'..');for(const w of ['Regular','Bold'])GlobalFonts.registerFromPath(`${root}/assets/NotoSansSC-${w}.otf`,'Swiss');
const T=require('./timeline.cjs'),{draw}=require('./film.cjs');const canvas=createCanvas(1920,1080),ctx=canvas.getContext('2d');
function render(t){draw(ctx,t);return canvas;}
async function main(){const mode=process.argv[2]||'stills';
 if(mode==='stills'){for(const t of [0,3,5.625,7.5,10.5,13.5,14.5,16.5,18,19,20.625,22,24.5,25.5,28,29,32,36,39.5]){render(t);fs.writeFileSync(`${root}/qa/frame-${t.toFixed(3)}.png`,canvas.toBuffer('image/png'));}console.log('style frames ready');}
 if(mode==='frame'){let t=Number(process.argv[3]),out=process.argv[4];render(t);fs.writeFileSync(out,canvas.toBuffer('image/png'));}
 if(mode==='video'){const p=spawn('ffmpeg',['-y','-v','warning','-f','image2pipe','-vcodec','mjpeg','-r','24','-i','pipe:0','-an','-vf','scale=in_range=pc:out_range=tv','-color_range','tv','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',`${root}/picture.mp4`],{stdio:['pipe','inherit','inherit']});const done=new Promise((r,j)=>p.on('close',x=>x===0?r():j(new Error('ffmpeg '+x))));for(let i=0;i<960;i++){render(i/24);const b=canvas.toBuffer('image/jpeg',96);if(!p.stdin.write(b))await new Promise(r=>p.stdin.once('drain',r));if(i%120===0)console.log(i+'/960');}p.stdin.end();await done;console.log('960 picture frames rendered');}
 if(mode==='determinism'){render(24.5);let a=canvas.toBuffer('image/png');render(5);render(24.5);let b=canvas.toBuffer('image/png');fs.writeFileSync(`${root}/qa/determinism.json`,JSON.stringify({same:a.equals(b),bytes:a.length}));}
 fs.writeFileSync(root+'/timeline.json',JSON.stringify({fps:T.FPS,duration:T.DUR,bpm:T.BPM,events:T.EV,silences:T.SILENCES},null,2));
}
if(require.main===module)main().catch(e=>{console.error(e);process.exit(1)});module.exports={render};
