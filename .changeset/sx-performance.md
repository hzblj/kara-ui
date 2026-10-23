---
"@hzblj/kara-sx": patch
"@hzblj/kara-components": patch
"@hzblj/kara-theme": patch
"@hzblj/kara-ui": patch
---

Faster styling. A resolved React Native style carries only the keys a call site set, where it used to carry forty-odd more as `undefined`, each walked on every mount. Views with the same native `sx` share one resolved modifier array, as they already shared a style, and `sx()` splits its props, the motion props included, in a single walk. `RnText` reads the user's text size from one subscription at the root (`useFontScale`, provided with the breakpoint) instead of one per text, and shares its text style the way `sx` shares its own.

`RnText` no longer loses its last line on iOS when React Native lays the paragraph out a hair shorter than its lines need, which happened depending on where the text sat on the page.
