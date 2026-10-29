---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`ScrollEdgeContainer` catches up with Footshop's: it sets the scroll view's top inset natively as soon as the top bar is laid out, so a list no longer starts under its bar for a few frames and then jumps (most visible on a tab rendered before it is first shown); `initialTopBarHeight` / `initialBottomBarHeight` give the first frame its insets; `contentScrollView` lets the iOS 26 tab bar minimise with this scroll view; `topEdgeEffectHidden` drops the top blur. A list remounted by `key` keeps its inset and edge effects, and a bottom bar no longer jumps while the keyboard animates. On iOS a `List` is its screen's content scroll view, so a large title in the header collapses as the list scrolls. Run a prebuild after upgrading.
