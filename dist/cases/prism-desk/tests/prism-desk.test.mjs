import test from 'node:test';import assert from 'node:assert/strict';
const m=await import('../scene.mjs').catch(()=>({}));
test('prism model exists',()=>assert.equal(typeof m.prismState,'function'));
test('seven ordered bands share entry and exit boundary',()=>{const s=m.prismState(0,20);assert.equal(s.bands.length,7);s.bands.forEach((b,i)=>{assert.ok(b.x>555&&b.x<697);assert.ok(Number.isFinite(b.endY));if(i)assert.ok(b.endY>s.bands[i-1].endY);});});
test('angle changes fan; time changes pulse, not geometry',()=>{const a=m.prismState(0,10),b=m.prismState(1,10),c=m.prismState(0,40);assert.notEqual(a.pulse,b.pulse);assert.deepEqual(a.bands,b.bands);assert.notDeepEqual(a.bands,c.bands);});
test('input and output meet prism faces over full slider range',()=>{for(let a=10;a<=40;a++){const s=m.prismState(0,a);assert.equal(s.entryX,555-(s.entryY-256)/2);s.bands.forEach(b=>assert.equal(b.x,555+(b.y-256)/2));}});
test('canvas declares an explicit CJK font fallback',async()=>{const {readFile}=await import('node:fs/promises');const source=await readFile(new URL('../scene.mjs',import.meta.url),'utf8');assert.match(source,/Noto Sans CJK SC/);});
