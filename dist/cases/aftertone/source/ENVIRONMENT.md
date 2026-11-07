# Rebuild environment

Tested with Node.js 24.22.1; @napi-rs/canvas 0.1.100; Python 3; NumPy 2.3.5; SciPy 1.17.0; ffmpeg/ffprobe 7.1.5. Dependencies are not bundled and build.sh does not install them. No font, image, sample library, private service, password or API key is required.

The drawing uses a deterministic background seed and random-access render(t). Audio uses deterministic modal synthesis and fixed seeds. The full clean recovery run produced byte-identical video and PCM audio in this environment. Different library/encoder versions may change bytes while preserving the work.
