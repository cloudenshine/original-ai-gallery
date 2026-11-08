# 转动之间 / Between turns
Original procedural SVG and JavaScript study, created 2026-11-08.
Serve this directory using a static server; open index.html. No dependencies or external assets.
Tests: node --test tests/*.test.mjs
Poster: import scene() from scene.mjs and save its returned SVG.

The ideal gear train uses 24 sun teeth, 12 planet teeth, and 48 ring teeth. Willis relation follows from no-slip pitch-circle velocity constraints. The planetary shaft centers remain 180 display units from the center. The simplified trapezoid tooth silhouettes are illustration only, NOT involute profiles, manufacturing plans, contact or torque simulations.

Controls: toggle fixed member (resets and pauses), play/pause, reset, reverse speed, and scrub input angle 0–2160°. Reduced-motion preference starts paused.

Verification: 11 Node tests cover kinematics and actual control callbacks with a minimal DOM harness. SVG still rasterized and visually reviewed. Browser launch failed due to environment socket permissions; no actual browser, mobile-device, or continuous-playback acceptance claimed. A separate 34-second H.264/AAC demo is now included; original interactive controls are preserved. Full browser playback and subjective listening remain unverified.
Original source and visual work is publicly displayed without granting a reuse license. No blanket copyright guarantee is made.

## Playable demo

Open index.html#demo or demo.mp4. 1280×720,24fps,34s. Original synthesized BGM and a separate non-realistic switch chime at16s, not mechanical recording. See demo-source/README.md and source.zip for reproducible sources, audio stems, and limitations.
