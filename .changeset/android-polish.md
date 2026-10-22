---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-router": minor
---

Android polish, and a new `RnListItem`.

- `ContextMenu` on Android is a proper long-press menu: a ripple and the long-press haptic, then a Material dropdown where the finger is, with the actions' icons and the trigger highlighted while it is open. The ripple and highlight stay inside rounded corners.
- A pressable `HStack`, `VStack` or `ZStack` ripples across its whole shape, padding included; `ListItem` and `LabeledContent` take `px` so a row in a card can carry the card's padding inside its press area.
- `ListItem` keeps its chevron when the subtitle fills the line.
- `Tabs` take the theme's colours: on Android the bar, active indicator, icons, labels and ripple come from tokens instead of the wallpaper scheme; on iOS the selected item takes the accent.
- New `RnListItem`: `ListItem`'s row in the React Native tier, cheap to mount by the dozen, with a full-row ripple on Android and a highlight on iOS.
