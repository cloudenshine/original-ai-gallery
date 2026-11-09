import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
test('Borrowed Evening Light preserves image integrity and candidate provenance',()=>{
 const row=JSON.parse(readFileSync('data/batch-borrowed-evening-light.json','utf8'))[0];
 const live=JSON.parse(readFileSync('dist/cases.json','utf8')).cases.find(x=>x.id===row.id);
 assert.equal(live.category,'image-generation');
 assert.equal(row.extraProvenance.generationAttemptsTotal,1);
 assert.equal(row.extraProvenance.editAttemptsTotal,1);
 assert.equal(row.extraProvenance.userApproved,false);
 const bytes=readFileSync('dist/cases/borrowed-evening-light/original.png');
 assert.equal(createHash('sha256').update(bytes).digest('hex'),row.extraProvenance.sha256);
 assert.equal(bytes.length,row.extraProvenance.bytes);
 for(const name of ['prompt-v1.txt','prompt-v2.txt']) assert.ok(readFileSync(`dist/cases/borrowed-evening-light/${name}`,'utf8').length>500);
 assert.match(live.verification,/候选/);
});
