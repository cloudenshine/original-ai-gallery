import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const file=new URL('../learning.mjs',import.meta.url);
const api=fs.existsSync(file)?await import(file.href):{};
test('choosing each topic yields the correct visible family and question',()=>{
  assert.equal(typeof api.lesson,'function');
  assert.deepEqual(api.lesson('meniscus').visible,['femur','tibia','menisci']);
  assert.equal(api.lesson('meniscus').answer,'menisci');
  assert.equal(api.lesson('bone').answer,'patella');
});
test('quiz distinguishes wrong answers from right ones without accumulating attempts',()=>{
  assert.equal(typeof api.checkAnswer,'function');
  assert.equal(api.checkAnswer('bone','tibia').correct,false);
  assert.equal(api.checkAnswer('bone','patella').correct,true);
  assert.equal(api.checkAnswer('meniscus','menisci').correct,true);
});
test('unknown topic safely falls back to initial lesson',()=>{
  assert.equal(typeof api.lesson,'function');
  assert.equal(api.lesson('not-real').id,'bone');
});
