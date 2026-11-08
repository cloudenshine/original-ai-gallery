import {pose} from './model.mjs';import {scene} from './scene.mjs';
const $=id=>document.getElementById(id);let mode='ring',sun=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=null;
function draw(){const p=pose(sun,mode);$('drawing').innerHTML=scene(sun,mode);$('phase').value=sun;$('angle').value=sun.toFixed(1)+'°';for(const k of ['sun','carrier','ring'])$(k+'Read').textContent=p[k].toFixed(1)+'°';$('play').textContent=playing?'暂停':'播放';$('play').setAttribute('aria-pressed',String(playing));}
for(const m of ['ring','carrier'])$(m).addEventListener('click',()=>{mode=m;sun=0;playing=false;for(const v of ['ring','carrier'])$(v).setAttribute('aria-pressed',String(v===m));$('outputLabel').textContent=m==='ring'?'行星架 / 输入':'齿圈 / 输入';$('ratio').textContent=m==='ring'?'+ 1 / 3':'− 1 / 2';$('explain').textContent=m==='ring'?'同向减速。太阳轮转三圈，行星架转一圈。':'反向传动。太阳轮转两圈，齿圈反转一圈。';draw();});
$('play').onclick=()=>{playing=!playing;draw();};$('reset').onclick=()=>{sun=0;playing=false;draw();};$('phase').oninput=e=>{sun=Number(e.target.value);playing=false;draw();};
document.addEventListener('visibilitychange',()=>{last=null;});
function frame(now){if(last!==null&&playing&&!document.hidden){sun=(sun+Math.min((now-last)/1000,.1)*Number($('speed').value)+2160)%2160;draw();}last=now;requestAnimationFrame(frame);}draw();requestAnimationFrame(frame);
