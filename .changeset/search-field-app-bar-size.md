---
'@hzblj/kara-native': minor
'@hzblj/kara-ui': minor
---

`SearchField` (Android) takes `appBarSize`, after Material 3's top app bars: `small` puts a search header's title in the bar row, centred in `toolbarHeight` (64 dp by default) and level with an avatar or actions laid over that row, `large` (the default, as before) keeps it on a row of its own under the bar. Without a `titleFontSize` the title now takes Material's `titleLarge` or `headlineMedium` instead of the bare default text size.
