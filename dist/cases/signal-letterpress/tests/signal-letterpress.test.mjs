import test from 'node:test';import assert from 'node:assert/strict';
const m=await import('../scene.mjs').catch(()=>({}));
test('letter model exists',()=>assert.equal(typeof m.letterState,'function'));
test('letters assemble and hold',()=>{const a=m.letterState(0,70),b=m.letterState(5,70),c=m.letterState(7,70);assert.equal(a.length,17);assert.notDeepEqual(a,b);assert.deepEqual(b,c);assert.ok(b.every(l=>l.rotation===0));});
test('spread changes starting positions but not hold',()=>{assert.notDeepEqual(m.letterState(0,10),m.letterState(0,90));assert.deepEqual(m.letterState(5,10),m.letterState(5,90));for(const l of m.letterState(2,100))assert.ok([l.x,l.y,l.rotation].every(Number.isFinite));});
test('letters smoothly return to scatter before loop boundary',()=>{const start=m.letterState(0,65),end=m.letterState(9.9999,65),late=m.letterState(9,65);assert.notDeepEqual(late,m.letterState(7,65));for(let i=0;i<start.length;i++){assert.ok(Math.abs(start[i].x-end[i].x)<.01);assert.ok(Math.abs(start[i].y-end[i].y)<.01);}});
test('canvas declares an explicit CJK font fallback',async()=>{const {readFile}=await import('node:fs/promises');const source=await readFile(new URL('../scene.mjs',import.meta.url),'utf8');assert.match(source,/Noto Sans CJK SC/);});
