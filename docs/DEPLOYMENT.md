# Online portfolio

[Open 造物案例馆](https://cloudenshine.github.io/original-ai-gallery/)

The collection contains 24 works. The separate existing website is unchanged. GitHub Pages uses GitHub Actions as its source. The workflow restores large files, runs `npm test && npm run build`, uploads only `dist`, and deploys it. A successful workflow and live HTTP checks are required before claiming this collection is online.

## Offline binary restoration

Five large files are committed as chunks of at most 9,000,000 bytes under `binary-parts/`. `binary-parts/manifest.json` records every target path, original size and SHA-256, plus each chunk's size and SHA-256. Run:

`python3 scripts/restore-binaries.py`

This command needs no network. It validates every chunk and the complete assembled bytes, then atomically replaces the target. Both `npm test` and `npm run build` invoke restoration automatically. Exact `.gitignore` entries exclude the five generated large files; commit their chunks and manifest instead. The restored Pages artifact contains normal directly downloadable source ZIPs, the wind film and its full-resolution master. No download service or external asset release is required.

All site links are relative, supporting both `/` and `/original-ai-gallery/`. README download links use the Pages URLs rather than nonexistent individual Git blobs. Seven later works are registered in `data/batch-03.json`. Their media pages preserve film audio, distinguish code-produced GIF animation from native model output, and retain honest viewing/listening limitations. Text-only source views include a notice identifying binary dependencies in the complete source archive.

Public display grants no blanket reuse license. Third-party fonts and references retain their own attribution and terms.

## Verification

58 Node tests and phase-garden checks pass, including every chunk and reconstructed file hash and rejection of corrupt chunks without overwriting an existing file. Build passes. `python3 scripts/check-publication.py` validates all 88 source ZIP members and 108 registered resources plus linked HTML assets at both URL bases, including the full master download. Original 17 catalog records are unchanged. ffprobe confirms audio in all three coding films; moonlight animation is silent. Continuous full-speed viewing and subjective listening remain unverified.
