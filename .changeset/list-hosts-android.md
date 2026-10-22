---
"@hzblj/kara-ui": patch
"@hzblj/kara-components": patch
---

`RnFlatList` and `RnSectionList` keep rows that host native views on Android. React Native's Android default, `removeClippedSubviews`, detached a host measured at zero height before its first layout, and the row stayed empty; it is off unless you turn it on.
