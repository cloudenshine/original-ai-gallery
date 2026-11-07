"""Restore repository-local binary parts with verified hashes and atomic replacement."""
from pathlib import Path
import hashlib,json,os,tempfile
ROOT=Path(__file__).resolve().parents[1]
def safe_path(root,relative):
    p=Path(relative)
    if p.is_absolute() or '..' in p.parts: raise ValueError('Unsafe manifest path')
    target=(root/p).resolve()
    if not target.is_relative_to(root.resolve()): raise ValueError('Path escapes repository')
    return target

def restore(root=ROOT):
    entries=json.loads((root/'binary-parts/manifest.json').read_text())
    for entry in entries:
        target=safe_path(root,entry['target']); target.parent.mkdir(parents=True,exist_ok=True)
        fd,name=tempfile.mkstemp(prefix='.restore-',dir=target.parent)
        try:
            digest=hashlib.sha256();size=0
            with os.fdopen(fd,'wb') as output:
                for part in entry['parts']:
                    raw=safe_path(root,part['path']).read_bytes()
                    if len(raw)!=part['bytes'] or hashlib.sha256(raw).hexdigest()!=part['sha256']:
                        raise ValueError('Invalid part: '+part['path'])
                    output.write(raw);digest.update(raw);size+=len(raw)
                output.flush();os.fsync(output.fileno())
            if size!=entry['bytes'] or digest.hexdigest()!=entry['sha256']:
                raise ValueError('Invalid restored file: '+entry['target'])
            os.replace(name,target)
        finally:
            if os.path.exists(name):os.unlink(name)
    return len(entries)
if __name__=='__main__':print(f'Restored and verified {restore()} binary files')
