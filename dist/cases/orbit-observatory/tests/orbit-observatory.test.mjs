import test from 'node:test';
import assert from 'node:assert/strict';
const mod = await import('../scene.mjs').catch(() => ({}));
test('orbit-observatory: model exists',()=>assert.equal(typeof mod.orbitalState,'function'));
test('orbit-observatory: parameter changes geometry or illumination',()=>{
 const a=mod.orbitalState(0,0), b=mod.orbitalState(0,100); assert.notDeepEqual(a,b); assert.ok(b.rings[4].rx > a.rings[4].rx); for (const r of a.rings) assert.ok(r.rx > r.ry && r.ry > 0);
});
test('orbit-observatory: time advances and all numbers stay finite',()=>{
 assert.notDeepEqual(mod.orbitalState(0,50),mod.orbitalState(2,50));
 const check=v=>{if(typeof v==='number') assert.ok(Number.isFinite(v));else if(v&&typeof v==='object') Object.values(v).forEach(check);};
 for(const t of [0,1,20,1000]) for(const p of [0,50,100]) check(mod.orbitalState(t,p));
});
test('orbit-observatory: each moving node stays exactly on its ellipse',()=>{
 for(const t of [0,5,24]) for(const value of [0,50,100]) for(const r of mod.orbitalState(t,value).rings) assert.ok(Math.abs((r.x/r.rx)**2+(r.y/r.ry)**2-1)<1e-12);
});
test('orbit-observatory: positions join at duration without a seam',()=>{
 for(const value of [0,65,100]){const a=mod.orbitalState(0,value),b=mod.orbitalState(mod.config.duration,value);a.rings.forEach((r,i)=>{assert.ok(Math.abs(r.x-b.rings[i].x)<1e-8);assert.ok(Math.abs(r.y-b.rings[i].y)<1e-8);});}
});
