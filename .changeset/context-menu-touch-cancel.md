---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

A long press on a `ContextMenu` trigger opens only its menu on iOS. Lifting the finger after the menu appears no longer also fires a `Pressable` inside the trigger, so a card no longer opens its screen under the menu. On iOS 27 a tapped preview zooms into the pushed screen again instead of closing the menu first.
