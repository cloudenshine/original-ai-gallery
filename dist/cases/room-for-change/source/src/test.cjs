const assert=require('assert'), T=require('./timeline.cjs');
assert.equal(T.FPS,24);assert.equal(T.DUR,40);assert.equal(T.BPM,96);
const expected=['A','B','C','D','E','F','G','H','N'].sort();
for(let frame=0;frame<960;frame++){
 const t=frame/24,s=T.state(t);assert.deepEqual(s.map(o=>o.id).sort(),expected);
 for(const o of s){assert(Number.isFinite(o.x)&&Number.isFinite(o.y));assert(o.scale>0&&o.scale<=1);}
 const settled=s.filter(o=>o.zone==='today'&&!o.moving);assert.equal(new Set(settled.map(o=>o.slot)).size,settled.length);
}
const end=T.state(39.9);assert.equal(end.filter(o=>o.zone==='today').length,7);assert.equal(end.filter(o=>o.zone==='tomorrow').length,2);
assert.equal(end.find(o=>o.id==='N').slot,4);assert.equal(end.find(o=>o.id==='F').slot,5);assert.equal(end.find(o=>o.id==='H').slot,6);
assert(end.filter(o=>o.zone==='today').every(o=>o.slot!==7));
for(const e of T.EV){assert.equal(Math.round(e.t*24),e.t*24);}
for(let i=0;i<=100;i++){let x=T.ease(i/100);assert(x>=0&&x<=1);if(i>0)assert(x>=T.ease((i-1)/100));}
console.log('PASS: identity, quantity, slot uniqueness, time grid, deterministic ease');
// Crossing a non-moving strip or a fixed time label would obscure its identity.
function overlap(a,b){return Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>.01&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>.01;}
for(let frame=0;frame<960;frame++){
 const s=T.state(frame/24);
 for(const o of s.filter(o=>o.moving)){
  for(const b of s.filter(b=>!b.moving&&b.id!==o.id))assert(!overlap({...o,w:288,h:72},{...b,w:288,h:72}),`task collision ${frame} ${o.id} ${b.id}`);
  for(let i=0;i<8;i++){let p=T.slotPos(i);assert(!overlap({...o,w:288,h:72},{x:p.x-88,y:p.y-32,w:76,h:27}),`time collision ${frame} ${o.id} slot${i}`);}
 }
}
console.log('PASS: moving task strips never obscure stationary tasks or fixed times');
