---
"@hzblj/kara-native": patch
"@hzblj/kara-ui": patch
---

- Android 7 (API 24/25) no longer crashes on a tinted `DrawableIcon`, a `BackdropBlurView` colour or the toolbar search's close ripple: colour props are read through Expo's `ColorCompat` instead of `Color` methods that exist only from Android 8 (expo-modules-core 57.0.4+).
- iOS: content under the header search (`LargeTitleFade`) no longer swallows taps while it is hidden: the view turns its own touch handling off, not only its inner container's, so taps reach what lies under it.
