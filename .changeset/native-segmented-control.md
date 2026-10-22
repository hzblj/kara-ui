---
"@hzblj/kara-ui": patch
"@hzblj/kara-components": patch
"@hzblj/kara-native": minor
---

`SegmentedControl` draws its selected segment in the accent on both platforms. iOS renders kara's own `UISegmentedControl` (`SegmentedControl` in `@hzblj/kara-native/swift-ui`), whose pill, labels and track take colours — the system control tints only the pill, SwiftUI's segmented picker not even that. Android colours Material's segmented buttons, equal widths. `onChange` now fires for a new segment only on Android too.
