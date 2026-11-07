# Verification scope

Browser interaction, mobile layouts and real-device performance have not been verified. Completed checks include deterministic scene-model tests, actual event-handler and clock tests with a minimal DOM and no-op drawing surface, native Canvas frames, time samples across every loop, and complete decoding of eight silent technical previews. Neither the test harness nor native rendering is a browser test.

The silent files are technical previews for checking picture and loop behavior, not completed films or sound-design reviews. No music, narration or event sound was produced. Small canvas annotations are supplemental; accessible descriptions and controls are separate HTML elements.

## Re-run

`npm test` uses Node built-ins. Optional native rendering uses `@napi-rs/canvas`, ffmpeg and the Noto CJK/DejaVu fonts at paths stated in scripts/render-native.cjs. Optional browser QA uses Python Playwright, Pillow and Chromium. Serve dist/ at port 8767, then run python scripts/browser-qa.py. Browser captures are written to evidence/, not over the published posters.
