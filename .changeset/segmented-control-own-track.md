---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

A `SegmentedControl` with `bg` now shows exactly that colour on iOS. UIKit drew its own track over a grey system fill on top of kara's, whatever colour the control was given, so a white track showed grey inside a white rim. The control now hides those track images (alpha 0 after each of its layouts) while kara draws the track, and the Liquid Glass pill stays the system's.
