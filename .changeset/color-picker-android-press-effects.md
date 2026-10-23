---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

`ColorPicker` works on Android. Compose ships no colour picker, so kara draws its own in the iOS picker's shape: a well with a rainbow ring beside the label, and a Material bottom sheet with a grid of swatches, a spectrum and RGB sliders, an opacity slider with `supportsOpacity`, and the colour with its hex at the foot. It reports every change through `onValueChange`, as `#RRGGBB` or, with opacity, `#RRGGBBAA`. It needs no extra dependency.

`Pressable` takes a `pressEffect`: `scale` springs the content down to `pressedScale` (0.96), `opacity` dims it to `pressedOpacity` (`o60`), `none` holds it still. Each platform keeps its own by default, a spring on iOS and the ripple on Android, and Android keeps the ripple on top of any effect unless `ripple` is off.

`IconButton` on iOS sits in a 44pt tap target with the icon centred, as Android's sits in Material's 48dp, so a row of them spaces itself the same way on both. A disabled one is dimmed once, by SwiftUI, instead of twice.
