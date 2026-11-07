"""Check package integrity and serve the artifact at both supported URL bases."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from urllib.request import urlopen, Request
from urllib.parse import urljoin, urlparse
from html.parser import HTMLParser
import json, hashlib, zipfile

root = Path(__file__).resolve().parents[1] / 'dist'
class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.paths = []
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('src', 'href') and value and not value.startswith(('#', 'http:', 'https:')):
                self.paths.append(value)
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(root), **kwargs)
    def translate_path(self, path):
        if path.startswith('/original-ai-gallery/'):
            path = path[len('/original-ai-gallery'):]
        return super().translate_path(path)
    def log_message(self, *args): pass

count=0
for archive in root.glob('cases/*/source.zip'):
    with zipfile.ZipFile(archive) as z:
        manifest=json.loads(z.read('SOURCE-MANIFEST.json'))
        assert set(manifest) == set(z.namelist()) - {'SOURCE-MANIFEST.json'}
        for name, record in manifest.items():
            assert not name.startswith('/') and '..' not in Path(name).parts
            raw=z.read(name)
            assert len(raw)==record['bytes']
            assert hashlib.sha256(raw).hexdigest()==record['sha256']
            count += 1
print(f'PASS: {count} source archive members match complete manifests')
server=ThreadingHTTPServer(('127.0.0.1', 0), Handler)
Thread(target=server.serve_forever, daemon=True).start()
try:
    for base in ['/', '/original-ai-gallery/']:
        origin=f'http://127.0.0.1:{server.server_port}{base}'
        with urlopen(origin+'cases.json') as response: cases=json.load(response)['cases']
        assert len(cases)==25
        paths={'index.html','cases.json','js/catalog-core.mjs'}
        for case in cases:
            paths.update(case[k] for k in ('artifact','source','poster','provenance'))
            paths.update(case[k] for k in ('preview','offline') if case.get(k))
        # Check each local HTML link, including media, back navigation and GIF.
        for path in list(paths):
            if path.endswith('.html'):
                parser=Links();parser.feed((root/path).read_text())
                for link in parser.paths:
                    absolute=urljoin(origin+path,link)
                    assert urlparse(absolute).path.startswith(base)
                    with urlopen(Request(absolute,method='HEAD')) as response: assert response.status==200
        for path in paths:
            with urlopen(Request(origin+path,method='HEAD')) as response: assert response.status==200
        print(f'PASS: {base} serves 25 cases, {len(paths)} registered resources and all linked HTML assets')
finally: server.shutdown();server.server_close()
