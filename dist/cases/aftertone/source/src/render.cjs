'use strict';
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const {createCanvas}=require('@napi-rs/canvas');
const {makeScene}=require('./scene.cjs');
const args=process.argv.slice(2),arg=(x,d)=>args.includes(x)?args[args.indexOf(x)+1]:d;
const root=path.resolve(__dirname,'..');
const T=JSON.parse(fs.readFileSync(arg('--timeline',path.join(__dirname,'timeline.json'))));
const scene=makeScene(T),can=createCanvas(T.width,T.height),ctx=can.getContext('2d');
(async()=>{
if(args.includes('--stills')){let out=path.resolve(arg('--out-dir',path.join(root,'review')));fs.mkdirSync(out,{recursive:true});for(let t of arg('--stills','1.5,21.9,31.5').split(',').map(Number)){scene.render(ctx,t);fs.writeFileSync(path.join(out,`frame-${t.toFixed(3)}.png`),can.toBuffer('image/png'));}return;}
const out=path.resolve(arg('--out',path.join(root,'out','picture.mp4')));fs.mkdirSync(path.dirname(out),{recursive:true});
const enc=spawn('ffmpeg',['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-s',`${T.width}x${T.height}`,'-r',String(T.fps),'-i','-','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
enc.stdin.on('error',e=>{console.error(e);process.exitCode=1});
for(let f=0;f<T.duration*T.fps;f++){scene.render(ctx,f/T.fps);const b=can.data();if(!enc.stdin.write(b))await new Promise(r=>enc.stdin.once('drain',r));if(f%120===0)console.error('frame',f);}
enc.stdin.end();await new Promise((res,rej)=>enc.on('exit',c=>c===0?res():rej(new Error('encoder '+c))));console.error(out);
})().catch(e=>{console.error(e);process.exitCode=1});
