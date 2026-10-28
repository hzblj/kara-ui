---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

New `@hzblj/kara-ui/header` entry for a native stack screen's header, for React Navigation and Expo Router alike. It imports neither library and builds the native stack's own options.

- **`useHeader` / `useHeaderOptions`:** `useHeader(navigation, params)` applies the header through either library's `useNavigation()`, and `useHeaderOptions` returns the options for static `options`. Both cover the title (centred, leading with a subtitle, revealed on scroll, or large), a search field and actions on both sides. Actions can be back, close, icons with a spinner, badge or selected state, text and menus with sections. iOS draws them as the navigation bar's own items, Android as Material buttons and dropdowns.
- **Large title on Android:** the native stack has none there, so it becomes a collapsing first row of the list.
- **Subtitle on iOS 26:** it is the navigation item's own, through the new `NavigationItemSubtitle` view in `@hzblj/kara-native/swift-ui`.
- **`useHeroHeader`:** a transparent bar over a full-bleed image that fades in as the image scrolls away. It brings its own background and tint, and returns the status bar style.
- **`useHeaderSearch`:** UIKit's stacked search bar on iOS, a row with the new Material `SearchField` (`@hzblj/kara-native/jetpack-compose`) on Android, and a scrim over the content.
- **Stack and content helpers:** `useStackScreenOptions()` themes a stack, with the `LARGE_TITLE_SCREEN_OPTIONS`, `HIDDEN_HEADER_SCREEN_OPTIONS` and `HERO_HEADER_SCREEN_OPTIONS` presets. `HeaderInset` and `useHeaderBarInset()` place content under a transparent header without measuring it. `useHeaderScrollToTop` makes `useScrollToTop` land on an expanded large title.
- **Peers:** `react-native-screens` and `react-native-safe-area-context` are optional peers that only this entry needs. `react-native-worklets`, which Reanimated 4 already requires, is now a peer as well.
