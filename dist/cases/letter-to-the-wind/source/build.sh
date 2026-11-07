#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p qa
mkdir -p qa
# Requires pre-installed Node.js, @napi-rs/canvas, Python 3 + numpy/scipy/Pillow, FFmpeg.
# This script does not install packages, access a network, or spend credits.
node src/render-native.cjs stills
node src/render-native.cjs determinism
python src/sound.py
node src/render-native.cjs video
python src/master.py
node src/render-native.cjs strip
python src/verify.py
