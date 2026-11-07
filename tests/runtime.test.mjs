import test from 'node:test';import assert from 'node:assert/strict';
import {clockState,advance,seek,reset,parameterValue} from '../dist/cases/runtime-core.mjs';
test('reduced motion begins paused',()=>{assert.equal(clockState(12,true).playing,false)});
test('clock advances only while playing and wraps at duration',()=>{let s=clockState(12);assert.equal(advance(s,2).t,2);assert.equal(advance({...s,t:11},2).t,1);assert.equal(advance({...s,playing:false},2).t,0)});
test('seek clamps finite values and pauses',()=>{let s=clockState(12);assert.equal(seek(s,14).t,12);assert.equal(seek(s,-2).t,0);assert.equal(seek(s,NaN).t,0);assert.equal(seek(s,5).playing,false)});
test('reset preserves explicit play state',()=>{assert.deepEqual(reset({...clockState(12),t:4}),clockState(12))});
test('parameter clamps range and uses default for invalid data',()=>{let p={min:1,max:8,value:3};assert.equal(parameterValue(-3,p),1);assert.equal(parameterValue(9,p),8);assert.equal(parameterValue(NaN,p),3)});
