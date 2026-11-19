---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

A press on a header action that morphs on iOS 26 reaches its `onPress` again. The morph replaced the bar item and kept only a weak reference to it, so nothing held the item any more and the press had nowhere to go.
