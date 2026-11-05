---
"@hzblj/kara-native": minor
"@hzblj/kara-components": minor
"@hzblj/kara-ui": minor
---

- `GlassView` takes its shape from `borderRadius`: a capsule as before without one, rounded corners of the theme radius with one, on iOS 26 (Liquid Glass), on Android (frosted glass) and in the fallback below iOS 26. The native view (`@hzblj/kara-native/swift-ui`) takes it as `cornerRadius`.
- `GlassView` takes `variant="clear"`, the more transparent glass for photos, video and maps (`UIGlassEffect`'s `clear`; on Android a thinner surface over the blur). The native view takes it as `glassStyle`.
