#!/bin/sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$HERE"
node src/test.cjs
node src/render.cjs stills
node src/render.cjs determinism
node src/render.cjs video
python3 src/sound.py
python3 src/master.py
python3 src/verify.py
