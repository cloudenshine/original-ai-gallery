#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p out audio review
python src/score.py --timeline src/timeline.json --out-dir audio
node src/test_scene.cjs
node src/render.cjs --out out/picture.mp4
ffmpeg -y -v error -i out/picture.mp4 -i audio/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 256k -af volume=3dB -ar 48000 -t 32 -movflags +faststart out/aftertone-final.mp4
ffmpeg -v error -i out/aftertone-final.mp4 -f null -
