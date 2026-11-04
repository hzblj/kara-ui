---
'@hzblj/kara-native': minor
'@hzblj/kara-router': minor
'@hzblj/kara-ui': minor
---

`Tabs` takes `expandsOnScrollUp`: with `minimizeBehavior: 'onScrollDown'`, the iOS 26 tab bar expands again with the system's own animation as soon as the content is dragged back up, instead of only once the list is back at its top. The view behind it is `TabBarExpandOnScrollUp` in `@hzblj/kara-native/swift-ui`, for tabs that are not kara's.
