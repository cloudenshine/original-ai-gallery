import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('homepage requests fresh catalog data instead of reusing the previous deployment',async()=>{
  const source=await readFile(new URL('../dist/js/gallery.mjs',import.meta.url),'utf8');
  const executable=source.slice(source.indexOf(';')+1);
  const nodes=new Map();
  const document={querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{});return nodes.get(selector);}};
  let request;
  const fetch=async(url,options)=>{request={url,options};return {ok:false};};
  const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
  await new AsyncFunction('document','fetch','console',executable)(document,fetch,{error(){}});
  assert.equal(request.url,'cases.json');
  assert.equal(request.options?.cache,'no-store');
});
