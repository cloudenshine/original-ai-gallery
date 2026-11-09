import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const rows=JSON.parse(readFileSync(new URL('../dist/cases.json',import.meta.url))).cases;
test('Orange Morning is a traceable static image, not a motion or named model claim',()=>{
 const c=rows.find(c=>c.id==='orange-morning');
 assert.equal(rows.filter(c=>c.id==='orange-morning').length,1);
 assert.equal(c.category,'image-generation');assert.equal(c.method,'image-model');
 assert.match(c.model,/未披露/);assert.doesNotMatch(c.model,/image-2.6/);
 const root=new URL('../dist/cases/orange-morning/',import.meta.url);
 const p=JSON.parse(readFileSync(new URL('provenance.json',root)));
 const img=readFileSync(new URL('original.png',root));
 assert.equal(createHash('sha256').update(img).digest('hex'),p.sha256);
 assert.equal(img.readUInt32BE(16),1536);assert.equal(img.readUInt32BE(20),1024);
 assert.equal(p.generationAttemptsTotal,1);assert.match(p.referenceUse,/未将参考图输入/);
 assert.ok(readFileSync(new URL('prompt.txt',root)).length);
 assert.match(readFileSync(new URL('review.md',root),'utf8'),/通过/);
});
