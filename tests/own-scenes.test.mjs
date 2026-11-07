import test from 'node:test';import assert from 'node:assert/strict';
import {pointOnRoute,transitState,routes} from '../dist/cases/night-transit/scene.mjs';
import {printState,registration} from '../dist/cases/overprint-studio/scene.mjs';
test('transit route interpolation preserves endpoints',()=>{let p=[[0,0],[10,0],[10,10]];assert.deepEqual(pointOnRoute(p,0),[0,0]);assert.deepEqual(pointOnRoute(p,1),[10,10]);assert.deepEqual(pointOnRoute(p,.5),[10,0])});
test('transit density changes count while time changes points',()=>{let a=transitState(1,1),b=transitState(1,5);assert.ok(b.length>a.length);assert.notDeepEqual(a,transitState(3,1));assert.deepEqual(a,transitState(1,1))});
test('transit coordinates finite over whole cycle and extremes',()=>{for(let v of [1,3,6])for(let t=0;t<=20;t+=.25)for(let p of transitState(t,v)){assert.ok(p.point.every(Number.isFinite));assert.ok(p.route>=0&&p.route<routes.length)}});
test('print reveal has held complete impression and reproducible loop',()=>{assert.equal(printState(0).reveal,0);assert.equal(printState(5).reveal,1);assert.equal(printState(7).reveal,1);assert.deepEqual(printState(0),printState(12));assert.ok(printState(3).reveal>0)});
test('registration affects opposite color separation and clamps',()=>{assert.equal(registration(0),0);assert.equal(registration(12),12);assert.equal(registration(99),18);assert.equal(registration(-5),0)});
