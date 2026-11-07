import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {categories,filterCases} from '../dist/js/catalog-core.mjs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=JSON.parse(read('dist/cases.json'));
test('Three.js has its own category, keeps earlier batches and is findable',()=>{
 const c=data.cases.find(c=>c.id==='field-of-quiet');assert.ok(c);assert.equal(c.category,'interactive-3d');assert.equal(c.method,'code');assert.ok(categories.some(([id])=>id===c.category));
 for(const id of ['folded-dusk','phase-garden','room-for-change','knee-in-layers','weight-we-share'])assert.ok(data.cases.some(c=>c.id===id),id);
 assert.deepEqual(filterCases(data.cases,{category:'interactive-3d',query:'Three.js'}).map(c=>c.id),['field-of-quiet']);
});
test('runtime is self-contained, pinned and has honest rendering limits',()=>{
 const c=data.cases.find(c=>c.id==='field-of-quiet'),p=JSON.parse(read('dist/'+c.provenance));
 assert.match(c.engine,/Three.js r160/);assert.match(c.verification,/SVG/);assert.match(c.verification,/WebGL.*未/);
 for(const dep of p.dependencies){const raw=fs.readFileSync(new URL('dist/cases/field-of-quiet/'+dep.path,root));assert.equal(raw.length,dep.bytes);assert.equal(createHash('sha256').update(raw).digest('hex'),dep.sha256);}
 assert.match(read('dist/cases/field-of-quiet/vendor/LICENSE-THREE.txt'),/MIT License/);
 const app=read('dist/cases/field-of-quiet/app.mjs');assert.doesNotMatch(app,/https:\/\/.*\.js/);assert.match(app,/THREE.Raycaster/);assert.match(app,/new SVGRenderer/);
});
