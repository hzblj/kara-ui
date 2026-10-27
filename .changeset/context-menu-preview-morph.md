---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

A tapped `ContextMenu` preview can morph into a screen that is already loaded, the way Apple's apps open a preview. Preload the detail in the new `onOpenChange` (React Navigation's `preload`) and pass its route key as `preloadedScreenId`: the screen is pushed natively in the same frame, and with `zoom` the whole preview grows into it, rounded and shadowed like the menu's platter, while the menu fades away. `pop` and `dismiss` push it as soon as UIKit's commit animation ends. Needs `@hzblj/expo-zoom-transition` 0.2.
