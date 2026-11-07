import * as THREE from './vendor/three.module.min.js';
import {SVGRenderer} from './vendor/SVGRenderer.js';
import {DEFAULTS,sanitize,sampleField,wavelength,snapProbe,ringRadius,viewDistance} from './model.mjs?v=5';
const $=id=>document.getElementById(id),stage=$('stage');
let params={...DEFAULTS},probe={x:0,z:1.8},playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,dirty=true,frames=0,fieldRevision=0;
let svgMode=false,lastPaint=0;
let renderer,scene,camera,mesh,wire,probeMarker,probeStem,sources=[],rings=[],audioContext,oscillator,gain,audioOn=false;
let azimuth=.65,elevation=.84,phaseTime=0,previous=performance.now(),rendered=0;
const sourceLabels=['A','B'].map(text=>{const el=document.createElement('span');el.className='world-label';el.textContent=text;el.style.cssText='position:absolute;pointer-events:none;color:#f5c393;font:12px monospace;transform:translate(-50%,-50%)';stage.append(el);return el;});
const renderState=()=>{ $('render-state').textContent=`真实运行：Three.js r${THREE.REVISION} · ${svgMode?'SVG 3D 备用':renderer?.capabilities?.isWebGL2?'WebGL 2':'WebGL 1'} · ${mesh?.geometry.attributes.position.count||0} 网格顶点 · 场更新 ${fieldRevision} 次 · 已绘制 ${frames} 帧 · ${playing?'波纹播放':'波纹暂停'}。`;};
function refreshReadings(){
 for(const key of ['frequency','separation','phase']){$(key).value=params[key];$(key+'-out').textContent=key==='frequency'?params[key]+' Hz':key==='separation'?params[key].toFixed(2)+' m':params[key]+'°';}
 $('wavelength-out').innerHTML=wavelength(params.frequency).toFixed(2)+' <small>m</small>';
 $('probe-x').value=probe.x.toFixed(1);$('probe-z').value=probe.z.toFixed(1);
 const value=sampleField(probe.x,probe.z,params),percent=Math.round(value.intensity*100);
 $('intensity').innerHTML=percent+'<span>%</span>';$('db').textContent=(value.decibels<=-79.9?'≤ −80':value.decibels.toFixed(1))+' dB';$('meter').style.width=(value.intensity*100)+'%';
 $('accessible-reading').textContent=`探针声强 ${percent}%，相对当地最大声强 ${value.decibels<=-79.9?"低于或等于负80":value.decibels.toFixed(1)} 分贝。`;$('probe-caption').textContent=value.intensity<.015?'接近相消：两道波在此几乎抵消。':value.intensity>.985?'接近相长：两道波在此几乎同向叠加。':`路程差 ${value.pathDifference.toFixed(2)} m · 部分相消，仍有声音。`;
 if(probeMarker){probeMarker.position.set(probe.x,1.72,probe.z);probeStem.position.set(probe.x,.87,probe.z);}
 if(audioOn&&audioContext){oscillator.frequency.setTargetAtTime(params.frequency,audioContext.currentTime,.035);gain.gain.setTargetAtTime(.07*value.amplitude,audioContext.currentTime,.045);}
 dirty=true;
}
function updateField(){
 if(mesh){const pos=mesh.geometry.attributes.position,col=mesh.geometry.attributes.color;const cool=new THREE.Color('#22424f'),mid=new THREE.Color('#67978e'),warm=new THREE.Color('#ecd4a0');
 for(let i=0;i<pos.count;i++){const q=sampleField(pos.getX(i),pos.getZ(i),params),h=q.intensity;pos.setY(i,.06+1.08*h);const color=h<.5?cool.clone().lerp(mid,h*2):mid.clone().lerp(warm,(h-.5)*2);col.setXYZ(i,color.r,color.g,color.b);}
 pos.needsUpdate=true;col.needsUpdate=true;mesh.geometry.computeVertexNormals();sources.forEach((s,i)=>{s.position.x=(i?1:-1)*params.separation/2;});rings.forEach(r=>r.position.x=(r.userData.source?1:-1)*params.separation/2);fieldRevision++;
 }
 refreshReadings();
 document.querySelectorAll('[data-preset]').forEach(b=>{const n=b.dataset.preset;b.setAttribute('aria-pressed',String(params.separation===2.4&&params.frequency===(n==='short'?440:220)&&params.phase===(n==='opposed'?180:0)));});
}
function updateCamera(){
 const distance=viewDistance(camera.aspect);
 camera.position.set(distance*Math.cos(elevation)*Math.sin(azimuth),distance*Math.sin(elevation),distance*Math.cos(elevation)*Math.cos(azimuth));camera.lookAt(0,.32,0);dirty=true;
 $('top').setAttribute('aria-pressed',String(elevation>1.45));$('oblique').setAttribute('aria-pressed',String(elevation<=1.45));
}
function setup(){
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor('#121e27');renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;}catch{svgMode=true;renderer=new SVGRenderer();renderer.setPrecision(2);renderer.setQuality('high');renderer.setClearColor(new THREE.Color('#121e27'));}renderer.outputColorSpace=THREE.SRGBColorSpace;stage.prepend(renderer.domElement);
 scene=new THREE.Scene();scene.fog=new THREE.Fog('#121e27',16,30);camera=new THREE.PerspectiveCamera(40,1,.1,60);scene.add(svgMode?new THREE.AmbientLight('#c3d9dc',.5):new THREE.HemisphereLight('#edf5e7','#152933',2.1));const key=new THREE.DirectionalLight('#fff0d3',svgMode?.85:2.6);key.position.set(-3,7,5);scene.add(key);const rim=new THREE.DirectionalLight('#779ca8',svgMode?.35:1.5);rim.position.set(5,3,-5);scene.add(rim);
 const geometry=new THREE.BufferGeometry(),positions=[],colors=[],indices=[];const nx=svgMode?48:120,nz=svgMode?36:90;
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){positions.push(-4+i*8/nx,0,-3+j*6/nz);colors.push(1,1,1);}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;indices.push(a,c,b,b,c,d);}
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.setIndex(indices);
 mesh=new THREE.Mesh(geometry,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));scene.add(mesh);
 wire=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:'#adc5b0',wireframe:true,transparent:true,opacity:.085,depthWrite:false}));wire.position.y=.007;if(!svgMode)scene.add(wire);
 const base=new THREE.Mesh(new THREE.BoxGeometry(8.09,.12,6.09),new THREE.MeshLambertMaterial({color:'#1b333c'}));base.position.y=-.03;if(!svgMode)scene.add(base);
 const grid=new THREE.GridHelper(10,20,'#51645f','#263b40');grid.position.y=-.095;if(!svgMode)scene.add(grid);
 for(let i=0;i<2;i++){
 const group=new THREE.Group();const sphere=new THREE.Mesh(new THREE.SphereGeometry(.095,svgMode?12:24,svgMode?8:16),new THREE.MeshLambertMaterial({color:'#f3b77c',emissive:'#ba5c28',emissiveIntensity:.55}));sphere.position.y=1.48;group.add(sphere);
 const stem=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,1.46,8),new THREE.MeshBasicMaterial({color:'#d29c6c',transparent:true,opacity:.7}));stem.position.y=.75;group.add(stem);
 const collar=new THREE.Mesh(new THREE.TorusGeometry(.17,.006,6,56),new THREE.MeshBasicMaterial({color:'#edc49d'}));collar.rotation.x=Math.PI/2;collar.position.y=1.48;group.add(collar);scene.add(group);sources.push(group);
 for(let j=0;j<9;j++){const ring=svgMode?new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:72},(_,n)=>new THREE.Vector3(Math.cos(n/72*Math.PI*2),Math.sin(n/72*Math.PI*2),0))),new THREE.LineBasicMaterial({color:i?'#e7b982':'#9cbdba',transparent:true,opacity:.13})):new THREE.Mesh(new THREE.TorusGeometry(1,.003,3,150),new THREE.MeshBasicMaterial({color:i?'#e7b982':'#9cbdba',transparent:true,opacity:.13,depthWrite:false}));ring.rotation.x=Math.PI/2;ring.position.y=1.24;ring.userData={source:i,index:j};scene.add(ring);rings.push(ring);}
 }
 probeMarker=new THREE.Mesh(new THREE.OctahedronGeometry(.095),new THREE.MeshBasicMaterial({color:'#f7f3d1'}));scene.add(probeMarker);probeStem=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,1.7,6),new THREE.MeshBasicMaterial({color:'#f7f3d1',transparent:true,opacity:.65}));scene.add(probeStem);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();updateCamera();dirty=true;};new ResizeObserver(resize).observe(stage);resize();updateCamera();updateField();
 $('engine').textContent=`Three.js r${THREE.REVISION} · ${svgMode?'SVG 3D 备用':renderer.capabilities.isWebGL2?'WebGL 2':'WebGL 1'}`;
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();playing=false;$('failure').hidden=false;$('failure').querySelector('h2').textContent='三维绘图连接已中断';$('failure').querySelector('p').textContent='数值仍可操作。重新载入页面可尝试恢复 WebGL。';mute();});
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;down={x:e.clientX,y:e.clientY,az:azimuth,el:elevation};stage.setPointerCapture(e.pointerId);});
 stage.addEventListener('pointermove',e=>{if(!down)return;azimuth=down.az-(e.clientX-down.x)*.006;elevation=Math.min(1.54,Math.max(.28,down.el+(e.clientY-down.y)*.005));updateCamera();});
 stage.addEventListener('pointerup',e=>{if(!down)return;const movement=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);if(movement>5)return;const r=stage.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObject(mesh)[0];if(hit){probe=snapProbe(hit.point.x,hit.point.z);refreshReadings();}});
 stage.addEventListener('pointercancel',()=>{down=null;});
 requestAnimationFrame(loop);
}
function loop(now){
 const dt=Math.min(.1,(now-previous)/1000);previous=now;if(playing&&!document.hidden)phaseTime+=dt;
 if(!document.hidden&&(dirty||(playing&&(!svgMode||now-lastPaint>100)))){
 lastPaint=now;
 rings.forEach(r=>{const radius=ringRadius(phaseTime,r.userData.index,r.userData.source,params);r.visible=radius<4.7;r.scale.setScalar(radius);r.material.opacity=.12*(1-radius/5);});
 renderer.render(scene,camera);frames++;sources.forEach((source,i)=>{const point=new THREE.Vector3(source.position.x,1.8,0).project(camera);sourceLabels[i].style.left=(point.x*.5+.5)*stage.clientWidth+'px';sourceLabels[i].style.top=(-point.y*.5+.5)*stage.clientHeight+'px';});dirty=false;
 }if(now-rendered>500){renderState();rendered=now;}requestAnimationFrame(loop);
}
for(const key of ['frequency','separation','phase'])$(key).addEventListener('input',()=>{const requestedPhase=Number($('phase').value);params=sanitize({...params,[key]:Number($(key).value)});if(requestedPhase===360)params.phase=360;updateField();});
for(const axis of ['x','z'])$('probe-'+axis).addEventListener('change',()=>{const v=Number($('probe-'+axis).value);probe=snapProbe(axis==='x'?v:probe.x,axis==='z'?v:probe.z);refreshReadings();});
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{params={...DEFAULTS,frequency:b.dataset.preset==='short'?440:220,phase:b.dataset.preset==='opposed'?180:0};updateField();}));
$('center').addEventListener('click',()=>{probe={x:0,z:1.8};refreshReadings();});
$('reset').addEventListener('click',()=>{params={...DEFAULTS};probe={x:0,z:1.8};azimuth=.65;elevation=.84;phaseTime=0;if(camera)updateCamera();updateField();mute();});
$('top').addEventListener('click',()=>{elevation=1.54;azimuth=0;if(camera)updateCamera();});$('oblique').addEventListener('click',()=>{elevation=.84;azimuth=.65;if(camera)updateCamera();});
function updatePause(){ $('pause').textContent=playing?'暂停波纹':'播放波纹';$('pause').setAttribute('aria-pressed',String(!playing));dirty=true;}
$('pause').addEventListener('click',()=>{playing=!playing;updatePause();});updatePause();
async function mute(){audioOn=false;if(gain&&audioContext)gain.gain.setTargetAtTime(0,audioContext.currentTime,.025);$('audio').setAttribute('aria-pressed','false');$('audio').innerHTML='开启探针声音 <span>默认静音</span>';}
$('audio').addEventListener('click',async()=>{if(audioOn){mute();return;}try{if(!audioContext){const Context=window.AudioContext||window.webkitAudioContext;audioContext=new Context();oscillator=audioContext.createOscillator();gain=audioContext.createGain();gain.gain.value=0;oscillator.type='sine';oscillator.connect(gain).connect(audioContext.destination);oscillator.start();}await audioContext.resume();audioOn=true;$('audio').setAttribute('aria-pressed','true');$('audio').innerHTML='关闭探针声音 <span>纯音已开启</span>';refreshReadings();}catch{ $('audio').textContent='此浏览器无法开启声音';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)mute();dirty=true;});
try{setup();}catch(error){$('failure').hidden=false;$('engine').textContent='3D 未就绪';$('render-state').textContent='三维初始化失败：'+error.message;console.error(error);refreshReadings();}
// A standard downloadable canvas render, generated locally without external upload.
const save=document.createElement('button');save.id='save-frame';save.textContent='保存画面';save.style.cssText='font-size:10px;border:0;border-bottom:1px solid #b4b8ac;background:none;color:inherit;padding:0 3px 3px;margin-right:10px';$('render-state').before(save);
save.addEventListener('click',()=>{
 if(!renderer)return;renderer.render(scene,camera);
 const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1050;const ctx=canvas.getContext('2d');
 const paint=src=>{ctx.fillStyle='#121e27';ctx.fillRect(0,0,1600,1050);const sw=svgMode?stage.clientWidth:src.width,sh=svgMode?stage.clientHeight:src.height,scale=Math.min(1600/sw,850/sh),w=sw*scale,h=sh*scale;ctx.drawImage(src,(1600-w)/2,100+(850-h)/2,w,h);ctx.fillStyle='#e9e5d4';ctx.font='42px sans-serif';ctx.fillText('让安静有形',65,77);ctx.fillStyle='#a9b9b3';ctx.font='18px monospace';ctx.fillText('A FIELD OF QUIET / THREE.JS r160 / '+(svgMode?'SVG 3D':'WebGL'),65,997);ctx.textAlign='right';ctx.fillText(`${params.frequency} Hz  |  ${params.separation.toFixed(1)} m  |  ${params.phase}°`,1535,997);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='field-of-quiet.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');};
 if(svgMode){const serialized=new XMLSerializer().serializeToString(renderer.domElement),url=URL.createObjectURL(new Blob([serialized],{type:'image/svg+xml'})),img=new Image();img.onload=()=>{paint(img);URL.revokeObjectURL(url);};img.onerror=()=>{URL.revokeObjectURL(url);$('render-state').textContent='当前浏览器未能导出PNG；三维交互仍可继续。';};img.src=url;}else paint(renderer.domElement);
});
