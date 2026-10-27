---
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`Button` takes `variant="plain"`, a text button in the accent with no fill, for the lesser action beside a prominent one ("Skip", "Forgot password?"): SwiftUI's `borderless` style on iOS, padded to a 44pt tap target that the whole label area takes, and Material's `TextButton` on Android. A `tint` colours its label. `Button` also takes `icon`, one of the app's icons before the label and in its colour: a SwiftUI `Label` in the button on iOS, the icon in the button's content row on Android, with Material's tighter padding on the icon side. Screen readers still read the label alone.

`IconButton` takes `variant`: `plain` (as before, and the default), `filled`, `tonal`, `outlined` or `glass`. iOS draws them as SwiftUI's `borderedProminent`, `bordered` and `glass` styles in a circle, and `outlined` as a plain button in a hairline ring, since SwiftUI has no outlined style; below iOS 26 `glass` is the `bordered` circle. Android draws Material's `FilledIconButton`, `FilledTonalIconButton` and `OutlinedIconButton`, and `glass` as the tonal one: Material has no glass, and a contained button still reads over a photo where an outline would not. A new `color` is the icon's colour, or on `filled` the fill, with the icon picking a colour that reads on it, as a `Button`'s `tint` does.

`List` takes `variant` and `separators`. `insetGrouped` sets the rows in a rounded card inset from the edges (SwiftUI's `insetGrouped` list style; on Android a `Card` inside the column, as `Form` draws a section), `plain` runs them edge to edge. Each platform keeps its own list by default, `insetGrouped` on iOS and `plain` on Android, so nothing changes until you ask. `separators={false}` drops the lines between rows: iOS hides each row's separator, Android draws no `Divider`.

`Fab` takes `label`, which makes it an extended FAB with the text beside the icon: Material's `ExtendedFloatingActionButton` on Android, and on iOS kara's own FAB as a 56pt accent capsule. Screen readers say `accessibilityLabel` for the whole button, so give it the label's words. It also takes `size`: `small` (40), `regular` (56, the default) or `large` (96, with a 36 icon), Material's `SmallFloatingActionButton` and `LargeFloatingActionButton` on Android and circles of the same sizes on iOS.
