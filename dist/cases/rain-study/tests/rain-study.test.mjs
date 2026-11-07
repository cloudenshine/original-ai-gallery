import test from 'node:test';
import assert from 'node:assert/strict';
const m=await import('../scene.mjs').catch(()=>({}));
test('rain model exists',()=>assert.equal(typeof m.rainState,'function'));
test('density changes count; drops and ripples stay bounded',()=>{const a=m.rainState(2,20),b=m.rainState(2,100);assert.ok(b.length>a.length);for(const d of b){assert.ok(d.x>=0&&d.x<=1200);assert.ok(d.y>=130&&d.y<=700);assert.ok(d.radius>=0&&Number.isFinite(d.radius));}});
test('rain changes with time and is periodic',()=>{assert.notDeepEqual(m.rainState(1,60),m.rainState(2,60));assert.deepEqual(m.rainState(0,60),m.rainState(12,60));});
test('steam and reflection motions share the twelve-second period',()=>{assert.equal(typeof m.rainAmbience,'function');assert.deepEqual(m.rainAmbience(0),m.rainAmbience(12));assert.notDeepEqual(m.rainAmbience(0),m.rainAmbience(3));});
test('canvas declares an explicit CJK font fallback',async()=>{const {readFile}=await import('node:fs/promises');const source=await readFile(new URL('../scene.mjs',import.meta.url),'utf8');assert.match(source,/Noto Sans CJK SC/);});
