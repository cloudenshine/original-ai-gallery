import test from 'node:test';import assert from 'node:assert/strict';import {execFileSync} from 'node:child_process';
test('publication link parser checks local assets and ignores inline data resources',()=>{
 const code=`import ast,json\nfrom pathlib import Path\nfrom html.parser import HTMLParser\nfrom urllib.parse import urlparse\ns=ast.parse(Path('scripts/check-publication.py').read_text())\nnode=next(n for n in s.body if isinstance(n,ast.ClassDef) and n.name=='Links')\nexec(compile(ast.Module(body=[node],type_ignores=[]),'<actual Links>','exec'))\np=Links();p.feed('<link href="data:,"><script src="app.mjs?v=5"></script><a href="#note">Note</a><a href="https://example.com">External</a><img src="poster.png">')\nprint(json.dumps(p.paths))`;
 const result=execFileSync('python3',['-c',code],{cwd:new URL('../',import.meta.url),encoding:'utf8'});
 assert.deepEqual(JSON.parse(result),['app.mjs?v=5','poster.png']);
});
