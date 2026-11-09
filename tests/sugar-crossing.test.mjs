import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const rows=JSON.parse(readFileSync(new URL('../dist/cases.json',import.meta.url))).cases;
test('Sugar Crossing is a traceable static image, not a motion or named model claim',()=>{
 const c=rows.find(c=>c.id==='sugar-crossing');
 assert.equal(rows.filter(c=>c.id==='sugar-crossing').length,1);
 assert.equal(c.category,'image-generation');assert.equal(c.method,'image-model');
 assert.match(c.model,/未披露/);assert.doesNotMatch(c.model,/image-2.6/);
 const root=new URL('../dist/cases/sugar-crossing/',import.meta.url);
 const p=JSON.parse(readFileSync(new URL('provenance.json',root)));
 const img=readFileSync(new URL('original.png',root));
 assert.equal(createHash('sha256').update(img).digest('hex'),p.sha256);
 assert.equal(img.readUInt32BE(16),1536);assert.equal(img.readUInt32BE(20),1024);
 assert.equal(p.generationAttemptsTotal,1);assert.equal(p.referenceImageInputs,0);assert.match(p.fiction,/不是实拍/);
 assert.ok(readFileSync(new URL('prompt.txt',root)).length);
 assert.match(readFileSync(new URL('review.md',root),'utf8'),/通过/);
});
