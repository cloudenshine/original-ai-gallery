import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as core from '../dist/js/catalog-core.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('dist/cases.json'));
const ids=['making-winter-smaller','negative-of-a-moon','borrowed-moonlight','aftertone','tidal-memory','letter-to-the-wind','sunset-in-a-box'];
test('seven authorized batch works remain present as the gallery grows',()=>{for(const id of ids)assert.ok(data.cases.find(c=>c.id===id),id)});
test('new media have honest categories and playable local outputs',()=>{for(const id of ids){const c=data.cases.find(c=>c.id===id);assert.ok(c,id);assert.ok(core.categories.some(([id])=>id===c.category));assert.ok(!c.preview);assert.match(read('dist/'+c.artifact),c.category==='coding-film'||id==='borrowed-moonlight'?/<video[^>]*controls/:/<img/);assert.ok(fs.statSync(new URL('../dist/'+c.source,import.meta.url)).size>0)}assert.equal(core.artifactLabel({category:'coding-film'}),'观看有声影片 ↗');assert.equal(core.artifactLabel({category:'image-code-animation'}),'观看动画与 GIF ↗')});
test('code films preserve audio and source manifests',()=>{for(const id of ['aftertone','letter-to-the-wind','sunset-in-a-box']){const c=data.cases.find(c=>c.id===id);assert.ok(c,id);assert.equal(c.audio,true);assert.match(c.verification,/未完成/)} });

