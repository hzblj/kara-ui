---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
"@hzblj/kara-theme": minor
---

Android gets glass and a scroll edge of its own.

- `GlassView` is frosted glass on Android: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface — or its `tint` — and a light hairline, the blurred surfaces Android 16 gives its own system UI. It was an almost clear capsule that left its content unreadable over a photo. Below Android 12 the same colours are drawn near-opaque. kara-native's new `BackdropBlurView` (`/jetpack-compose`) does the blur — blurred, then saturated, as iOS lifts the colour under its materials: a plain view, no host, and an idle screen draws no frames.
- `ScrollEdgeContainer` on Android behaves like a Material top app bar on scroll: the bars stay transparent at rest and fill with the scrolled container colour once content scrolls under the top one, the bottom one while there is more below. Its scroll view also takes the room between the bars now — it grew to its content's height, ran under the bottom bar and could not scroll.
- New token `surface.secondary`: Material's `surfaceContainer` on Android, `tertiarySystemGroupedBackgroundColor` on iOS — a step above `surface.primary`.
