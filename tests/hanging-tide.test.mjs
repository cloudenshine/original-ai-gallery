import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
test('Hanging Tide preserves selected original and honest image provenance', async()=>{
 const root=new URL('../dist/',import.meta.url);
 const data=JSON.parse(await readFile(new URL('cases.json',root)));
 const c=data.cases.find(c=>c.id==='hanging-tide');
 assert.equal(c.category,'image-generation');assert.equal(c.method,'image-model');
 const p=JSON.parse(await readFile(new URL(c.provenance,root)));
 const raw=await readFile(new URL(c.poster,root));
 assert.equal(raw.length,2510396);assert.equal(raw.readUInt32BE(16),1122);assert.equal(raw.readUInt32BE(20),1402);
 assert.equal(createHash('sha256').update(raw).digest('hex'),'665dc507d459103be0c0569df69bad2bbe6f7a23f6d18746766850eb934dae32');
 assert.equal(p.selectedAttempt,1);assert.equal(p.generationAttemptsTotal,2);assert.equal(p.visualInspection,true);
 assert.ok(p.rights.includes('未作为图像生成输入'));assert.equal(p.limitations.length,3);
});
