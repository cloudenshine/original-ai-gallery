import test from 'node:test';
import assert from 'node:assert/strict';
import {categories,artifactLabel,filterCases} from '../dist/js/catalog-core.mjs';
test('Blender rendered films have a distinct discovery category',()=>{
 assert.ok(categories.some(([id,name])=>id==='blender-film'&&name.includes('Blender')));
});
test('Blender film opens as a viewable film, not a runnable 2D example',()=>{
 assert.equal(artifactLabel({category:'blender-film',method:'3d-render'}),'观看有声影片 ↗');
});
test('Blender discovery remains separate from coding motion',()=>{
 const cases=[{id:'arch',category:'blender-film',title:'借力',summary:'石拱',engine:'Blender',model:'procedural',useCase:'结构解释',tags:[]},{id:'canvas',category:'coding-motion',title:'其他',summary:'',engine:'Canvas',model:'code',useCase:'',tags:[]}];
 assert.deepEqual(filterCases(cases,{category:'blender-film'}).map(x=>x.id),['arch']);
});
