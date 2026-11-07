import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, cp, mkdir, copyFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {filterCases} from '../dist/js/catalog-core.mjs';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('dist/cases.json',root),'utf8'));
test('Anatomy can be found from the main catalog by tool and Chinese title',()=>{
  assert.ok(filterCases(data.cases,{query:'Anatomy'}).some(c=>c.id==='knee-in-layers'));
  assert.ok(filterCases(data.cases,{category:'interactive',query:'膝关节'}).some(c=>c.id==='knee-in-layers'));
  assert.equal(data.cases.filter(c=>c.id==='knee-in-layers').length,1);
});
test('catalog rebuild retains the Anatomy entry and all previously published works',async()=>{
  const target=await mkdtemp(join(tmpdir(),'anatomy-catalog-'));
  await mkdir(join(target,'scripts'),{recursive:true});
  await copyFile(new URL('scripts/assemble.py',root),join(target,'scripts/assemble.py'));
  await cp(new URL('data',root),join(target,'data'),{recursive:true});
  await copyFile(new URL('publication.json',root),join(target,'publication.json'));
  await cp(new URL('dist/cases',root),join(target,'dist/cases'),{recursive:true});
  execFileSync('python3',[join(target,'scripts/assemble.py')]);
  const out=JSON.parse(await readFile(join(target,'dist/cases.json'),'utf8'));
  const before=data.cases.map(c=>c.id);
  for(const id of before)assert.ok(out.cases.some(c=>c.id===id),id);
  assert.equal(out.cases.filter(c=>c.id==='knee-in-layers').length,1);
  const c=out.cases.find(c=>c.id==='knee-in-layers');
  assert.equal(c.artifact,'cases/knee-in-layers/index.html');
  assert.equal(c.source,'cases/knee-in-layers/scene.json');
  const provenance=JSON.parse(await readFile(join(target,'dist',c.provenance),'utf8'));
  assert.equal(provenance.nativeSceneAccepted,true);
  assert.equal(provenance.nativeViewerDisplayed,false);
});

test('all twenty-five earlier works remain registered when Anatomy is added',()=>{
  const baseline=['folded-dusk', 'contour-atlas', 'phase-garden', 'spring-lab', 'night-transit', 'orbit-observatory', 'overprint-studio', 'paper-city', 'prism-desk', 'rain-study', 'signal-letterpress', 'tidal-weave', 'image-amber-limestone', 'image-tidal-reading-room', 'image-seed-courier', 'image-seed-library', 'image-rain-garden', 'making-winter-smaller', 'negative-of-a-moon', 'borrowed-moonlight', 'aftertone', 'tidal-memory', 'letter-to-the-wind', 'sunset-in-a-box', 'room-for-change'];
  for(const id of baseline)assert.equal(data.cases.filter(c=>c.id===id).length,1,id);
});
