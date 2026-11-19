---
"@hzblj/kara-native": patch
"@hzblj/kara-components": patch
"@hzblj/kara-ui": patch
---

Swipe actions take their label and icon colours from the theme on iOS 26 (`content.secondary`, `content.on.accent`, `content.on.destructive`), through the new `configureSwipeActionAppearance` in kara-native, since SwiftUI has no API for them.
