---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

Native sheets with a native header. `Sheet` is now a TrueSheet (`@lodev09/react-native-true-sheet`, a new peer dependency) with `<Sheet.Header>` — a real navigation bar with a centred, leading or large title that hands over to the bar as it scrolls away, items on either side, and on iOS 26 the content scrolls under it with the soft edge effect — plus `<Sheet.ScrollView>`, `useSheetScroll`, detents, a footer and a ref (`present`/`dismiss`/`resize`). It is React Native tier now: no host, native atoms inside go in an `Island`. `fitToContents` is replaced by `detents` (`['auto']` by default).

`NavigationBar` takes `leadingItems` / `trailingItems` instead of `onBack` / `onClose`: `back`, `close` or an app `icon`, on either side and in any order; on iOS 26 neighbours share a glass capsule unless an item is `separated`. Also `titleAlignment`, `titleVisible`, `inverted` and an iOS `search` field. On Android it is now Material's native top app bar.
