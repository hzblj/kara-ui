---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

New `@hzblj/kara-ui/header` entry for a native stack screen's header, for React Navigation and Expo Router alike: it imports neither and builds the native stack's own options. `useHeader(navigation, {leadingActions, trailingActions, backHidden})` (or `useHeaderOptions` for static `options`) puts actions on both sides: back, close, icons with a spinner, a badge or a selected state, text actions and menus with sections. iOS draws them as the navigation bar's own items, glass and overflow menu included; Android draws them as Material buttons and dropdowns. `useStackScreenOptions()` themes a whole stack (`LARGE_TITLE_SCREEN_OPTIONS` and `HIDDEN_HEADER_SCREEN_OPTIONS` come with it). `HeaderInset` and `useHeaderBarInset()` place content under a transparent header without waiting for it to be measured, and `useHeaderScrollToTop` makes `useScrollToTop` land on an expanded large title. `react-native-screens` and `react-native-safe-area-context` are optional peers that only this entry needs.
