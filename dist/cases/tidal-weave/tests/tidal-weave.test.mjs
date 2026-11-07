import test from 'node:test';
import assert from 'node:assert/strict';
const mod = await import('../scene.mjs').catch(() => ({}));
test('tidal-weave: model exists',()=>assert.equal(typeof mod.weaveState,'function'));
test('tidal-weave: parameter changes geometry or illumination',()=>{
 const a=mod.weaveState(0,0), b=mod.weaveState(0,100); assert.notDeepEqual(a,b); assert.ok(b.amplitude > a.amplitude); assert.equal(a.warps.length,13); assert.equal(a.wefts.length,11);
});
test('tidal-weave: time advances and all numbers stay finite',()=>{
 assert.notDeepEqual(mod.weaveState(0,50),mod.weaveState(2,50));
 const check=v=>{if(typeof v==='number') assert.ok(Number.isFinite(v));else if(v&&typeof v==='object') Object.values(v).forEach(check);};
 for(const t of [0,1,20,1000]) for(const p of [0,50,100]) check(mod.weaveState(t,p));
});
test('tidal-weave: shared crossing coordinates remain ordered and within the composition',()=>{
 for(const t of [0,2,20]) for(const v of [0,50,100]) for(let u=0;u<12;u++) for(let w=0;w<10;w++){
 const p=mod.weavePoint(u,w,t,v), nextU=mod.weavePoint(u+1,w,t,v),nextV=mod.weavePoint(u,w+1,t,v);
 assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));assert.ok(nextU.x>p.x);assert.ok(nextV.y>p.y);assert.ok(p.x>150&&p.x<1050&&p.y>100&&p.y<700);
 }
});
test('tidal-weave: surface joins at duration without a seam',()=>{
 for(let u=0;u<13;u++)for(let v=0;v<11;v++){const a=mod.weavePoint(u,v,0,66),b=mod.weavePoint(u,v,mod.config.duration,66);assert.ok(Math.abs(a.x-b.x)<1e-8);assert.ok(Math.abs(a.y-b.y)<1e-8);}
});
