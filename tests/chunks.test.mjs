import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('binary-parts/manifest.json',root)));
const hash=b=>createHash('sha256').update(b).digest('hex');
test('five chunked files preserve every part and full original hash',()=>{assert.equal(manifest.length,5);for(const e of manifest){let chunks=[];for(const p of e.parts){const b=fs.readFileSync(new URL(p.path,root));assert.equal(b.length,p.bytes);assert.ok(b.length<=9000000);assert.equal(hash(b),p.sha256);chunks.push(b)}const raw=Buffer.concat(chunks);assert.equal(raw.length,e.bytes);assert.equal(hash(raw),e.sha256);assert.equal(hash(fs.readFileSync(new URL(e.target,root))),e.sha256)}});
test('restore rejects corrupt chunks without replacing existing target',()=>{execFileSync('python3',['-c',`import importlib.util,tempfile,json,pathlib,hashlib
spec=importlib.util.spec_from_file_location('restore','scripts/restore-binaries.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
with tempfile.TemporaryDirectory() as t:
 r=pathlib.Path(t);(r/'binary-parts').mkdir();(r/'binary-parts/p.bin').write_bytes(b'bad');(r/'out').write_bytes(b'keep')
 (r/'binary-parts/manifest.json').write_text(json.dumps([{'target':'out','bytes':4,'sha256':hashlib.sha256(b'good').hexdigest(),'parts':[{'path':'binary-parts/p.bin','bytes':4,'sha256':hashlib.sha256(b'good').hexdigest()}]}]))
 try:m.restore(r);raise AssertionError('corruption accepted')
 except ValueError:pass
 assert (r/'out').read_bytes()==b'keep'
 assert not list(r.glob('.restore-*'))
`],{cwd:root})});
