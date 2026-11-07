'use strict';
const assert=require('assert'),fs=require('fs'),crypto=require('crypto');
const {createCanvas}=require('@napi-rs/canvas'),{makeScene}=require('./scene.cjs');
const T=JSON.parse(fs.readFileSync(__dirname+'/timeline.json')),S=makeScene(T),C=createCanvas(T.width,T.height),ctx=C.getContext('2d');
const checks=[];function check(name,f){f();checks.push({name,passed:true})}
const hash=(s,t)=>{s.render(ctx,t);return crypto.createHash('sha256').update(C.data()).digest('hex')};
check('four physical strings and one origin mark',()=>{assert.equal(S.metadata.physicalStrings,4);assert.equal(S.metadata.redMarks,1)});
check('960 frame duration',()=>assert.equal(T.fps*T.duration,960));
for(let i=0;i<4;i++)check('fixed endpoints '+i,()=>{for(const t of [0,1.5,1.75,5.25,10,17,22,26,31.9])for(const u of [0,1]){const p=S.point(i,u,t),p0=T.lines[i][u===0?'p0':'p1'];assert(Math.hypot(p[0]-p0[0]*T.width,p[1]-p0[1]*T.height)<1e-7)}});
for(let i=1;i<4;i++)check('no early auxiliary excitation '+i,()=>{const e=[0,T.events.response1,T.events.response2,T.events.response3][i];for(let u=.01;u<1;u+=.01)assert.equal(S.rawDis(i,u,e-.001),0)});
check('release has no state jump',()=>{for(let u=.01;u<1;u+=.01){let a=S.point(0,u,T.events.release-1e-6),b=S.point(0,u,T.events.release+1e-6);assert(Math.hypot(a[0]-b[0],a[1]-b[1])<.001)}});
for(const [name,r]of Object.entries(S.routes))check('continuous return path '+name,()=>{for(let k=0;k<r.length-1;k++){let t=r[k].t1,a=S.routePoint(r,t-1e-6).p,b=S.routePoint(r,t+1e-6).p;assert(Math.hypot(a[0]-b[0],a[1]-b[1])<.02)}});
check('gold arrivals 0 then 1 then 2',()=>{assert.equal(S.render(ctx,26.99).goldMarks,0);assert.equal(S.render(ctx,27.25).goldMarks,1);assert.equal(S.render(ctx,27.75).goldMarks,2)});
check('out of order deterministic frames',()=>{let h=hash(S,21.9);hash(S,31.5);hash(S,1.5);assert.equal(h,hash(S,21.9))});
check('shared contact cue mutation changes picture',()=>{const alt=JSON.parse(JSON.stringify(T));alt.events.contact01+=.05;assert.notEqual(hash(S,5.27),hash(makeScene(alt),5.27))});
fs.writeFileSync(__dirname+'/../review/scene-tests.json',JSON.stringify({checks,passed:checks.length,scope:'Source function geometry/determinism checks, not artistic or full playback acceptance'},null,2));console.log('PASS',checks.length);
