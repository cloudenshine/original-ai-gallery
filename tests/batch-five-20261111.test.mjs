import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../dist/',import.meta.url);
const expected=[
 ['landing-for-a-seed','coding-film','4ebf9e5055c779395395d2e0b6895767092a302042a4159b6e27b3ca1684402f'],
 ['mineral-tide','image-generation','24cf74334a9266d605fcff11c4e471f7b8b3a6f86e36af9d091317b8eb763eb3'],
 ['one-arc-rises','blender-film','00ace2d0a96320d142a85214b66617011e02f81e975df8b57a273375ecee3c69'],
 ['the-seam-remembers','image-generation','64395bf0cebb76f0ec1e0614a9fab931fd03951b99feaf0686063bdb3d7190e2'],
 ['the-other-side-of-gravity','blender-film','e0319561f1fb161c6c9ecb02c86dd984870c6c0e9e1c2446323685ccb20d349d']
];
test('five new independent works resolve to the approved artifact bytes without counting derivatives',async()=>{
 const {cases}=JSON.parse(await readFile(new URL('cases.json',root)));
 for(const [id,category,sha] of expected){
  const matches=cases.filter(c=>c.id===id); assert.equal(matches.length,1,`missing or duplicate ${id}`);
  const c=matches[0];assert.equal(c.category,category);
  const raw=await readFile(new URL(`cases/${id}/${c.media}`,root));assert.equal(createHash('sha256').update(raw).digest('hex'),sha);
  const p=JSON.parse(await readFile(new URL(c.provenance,root)));assert.equal(p.sha256,sha);
  assert.equal(p.userApproved,id==='mineral-tide');
  assert.ok((await readFile(new URL(c.source,root))).length>0);
 }
 assert.equal(cases.filter(c=>c.batch==='five-20261111').length,5);
});
test('new publication exposes missing-prompt and audiovisual review limits honestly',async()=>{
 const {cases}=JSON.parse(await readFile(new URL('cases.json',root)));
 const mineral=cases.find(c=>c.id==='mineral-tide');assert.ok(mineral,'mineral-tide missing');
 const m=JSON.parse(await readFile(new URL(mineral.provenance,root)));assert.equal(m.originalPromptAvailable,false);
 assert.equal(mineral.source,'cases/mineral-tide/source-notes.md');
 for(const id of ['landing-for-a-seed','one-arc-rises','the-other-side-of-gravity']){
  const c=cases.find(c=>c.id===id);assert.ok(c,id);const p=JSON.parse(await readFile(new URL(c.provenance,root)));
  assert.equal(p.subjectiveListeningVerified,false);assert.equal(p.fullSpeedViewingVerified,false);
 }
 const p=JSON.parse(await readFile(new URL('cases/the-other-side-of-gravity/provenance.json',root)));
 assert.equal(p.blendContainsCompleteAnimation,false);
});
