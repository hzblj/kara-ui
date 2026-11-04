---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`largeTitle: 'inline'` on `useHeader` and `useHeaderOptions` puts the large title on the leading side of the bar row, next to the actions, as the Apple TV app's tabs have it (iOS 17), instead of in a row of its own under the bar. Render the result's new `inlineLargeTitle` after the list. Android shows the bar's plain title. The view behind it is `InlineLargeTitle` in `@hzblj/kara-native/swift-ui`, and `useHeaderScrollToTop` takes the same `largeTitle` value.
