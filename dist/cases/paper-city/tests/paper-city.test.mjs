import test from 'node:test';
import assert from 'node:assert/strict';
const mod = await import('../scene.mjs').catch(() => ({}));
test('paper-city: model exists',()=>assert.equal(typeof mod.cityState,'function'));
test('paper-city: parameter changes geometry or illumination',()=>{
 const a=mod.cityState(0,0), b=mod.cityState(0,100); assert.notDeepEqual(a,b); assert.ok(b.dusk > a.dusk); assert.equal(a.buildings.length,25); for(const b of a.buildings) assert.ok(b.height > 0);
});
test('paper-city: time advances and all numbers stay finite',()=>{
 assert.notDeepEqual(mod.cityState(0,50),mod.cityState(2,50));
 const check=v=>{if(typeof v==='number') assert.ok(Number.isFinite(v));else if(v&&typeof v==='object') Object.values(v).forEach(check);};
 for(const t of [0,1,20,1000]) for(const p of [0,50,100]) check(mod.cityState(t,p));
});
test('paper-city: day and night preserve architecture and change window illumination',()=>{
 const day=mod.cityState(2,0),night=mod.cityState(2,100);
 assert.equal(day.buildings.filter(b=>b.lit).length,0);assert.equal(night.buildings.filter(b=>b.lit).length,25);
 assert.deepEqual(day.buildings.map(({lit,...b})=>b),night.buildings.map(({lit,...b})=>b));assert.ok(day.lightSweep>=0&&day.lightSweep<=1);assert.ok(day.tram>=0&&day.tram<1);
});
test('paper-city: light and tram join continuously at duration',()=>{
 const a=mod.cityState(0,62),b=mod.cityState(mod.config.duration,62);assert.ok(Math.abs(a.lightSweep-b.lightSweep)<1e-8);assert.ok(Math.abs(a.tram-b.tram)<1e-8);
});
test('paper-city: tram occupies the visible front perimeter, outside building lots',()=>{assert.ok(mod.cityState(3,62).tramU>4.5);});
