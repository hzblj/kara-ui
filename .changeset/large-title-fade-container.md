---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

`LargeTitleFade` (iOS) keeps its content hidden while the header search is open: it fades an inner container instead of its own `alpha`, which React Native set back to full opacity whenever the view's frame changed.
