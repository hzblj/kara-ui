---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

An SVG in `NativeImage` on Android (a logo in a segmented button) fills the height it is drawn at, instead of keeping its own `width`/`height` in the top-left corner.
