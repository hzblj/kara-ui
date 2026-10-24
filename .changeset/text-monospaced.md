---
'@hzblj/kara-components': minor
'@hzblj/kara-native': minor
'@hzblj/kara-sx': minor
'@hzblj/kara-theme': minor
'@hzblj/kara-ui': minor
---

`Text` and `RnText` take `monospaced` and `monospacedDigit`. `monospaced` sets the text in the theme's fixed-width face at its variant's size and weight: a new `fonts.mono` role in `ThemeConfig` for a face of the app's own (JetBrains Mono beside Inter, say), else Menlo on iOS and `monospace` on Android, the same face in both tiers. `monospacedDigit` keeps whatever face the text has and asks it for tabular figures, so a price or a counter does not shift as it changes: SwiftUI's `monospacedDigit()`, React Native's `fontVariant: ['tabular-nums']`, and `tnum` on Compose. `theme.monoTypography` is the scale `monospaced` reads. `ios.monospacedDigit` is gone from `sx`: use the `monospacedDigit` prop, which now works on Android too. Rebuild the native app.
