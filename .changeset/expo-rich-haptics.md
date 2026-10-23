---
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
"@hzblj/kara-ui": minor
---

Haptics move to a package of their own, [`@hzblj/expo-rich-haptics`](https://github.com/hzblj/expo-rich-haptics), which kara now depends on, so any Expo app can use them. kara no longer exports `haptics`, `useHapticFeedback`, `Haptic` or `HAPTICS`: add the package to your app (`npx expo install @hzblj/expo-rich-haptics`) and import them from it. The names and calls are the same, and the components play the same haptics. The package adds patterns of your own (Android's haptic primitives on a timeline, which iOS plays through Core Haptics), plus `intensity` and a warning of its own on Android devices that have primitives. `@hzblj/kara-native` drops `playHaptic`, `prepareHaptic` and `HAPTICS`. Rebuild the native app to pick up the new module.
