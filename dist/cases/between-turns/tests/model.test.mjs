import test from 'node:test';import assert from 'node:assert/strict';
const module=await import('../model.mjs').catch(()=>({}));
test('kinematics API exists',()=>assert.equal(typeof module.pose,'function'));
test('fixed ring gives 3:1 reduction',()=>{const p=module.pose(360,'ring');assert.equal(p.carrier,120);assert.equal(p.ring,0);assert.equal(p.planet,-360);});
test('fixed carrier reverses ring at half speed',()=>{const p=module.pose(360,'carrier');assert.equal(p.carrier,0);assert.equal(p.ring,-180);assert.equal(p.planet,-720);});
test('Willis relation holds including reverse input',()=>{for(const m of ['ring','carrier'])for(let s=-1080;s<=1080;s+=7){const p=module.pose(s,m);assert.ok(Math.abs(24*(p.sun-p.carrier)+48*(p.ring-p.carrier))<1e-8);}});
test('three planet centers keep exact distances',()=>{for(let s=0;s<1080;s+=11){const p=module.pose(s,'ring');for(const q of p.centers)assert.ok(Math.abs(Math.hypot(q.x,q.y)-180)<1e-8);}});
test('invalid input rejected',()=>{assert.throws(()=>module.pose(NaN,'ring'));assert.throws(()=>module.pose(0,'no'));});
test('tooth count matches polygon lobes',()=>{for(const n of [12,24,48])assert.equal(module.gear(n,n*5).split('L').length,n*4);});
