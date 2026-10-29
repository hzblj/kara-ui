---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

`ScrollEdgeContainer` sets its scroll view's top inset natively as soon as the top bar is laid out, so a list no longer starts under its bar for a few frames and then jumps (most visible on a tab rendered before it is first shown). On iOS a `List` is its screen's content scroll view, so a large title in the header collapses as the list scrolls. Run a prebuild after upgrading.
