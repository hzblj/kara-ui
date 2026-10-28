---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`SegmentedControl` takes its track and its labels through the `sx` names: `bg` colours the track, `p` is the room between the track's edge and the selected pill, and `variant` sets the labels in a typography variant, as `Text` does. On iOS a `bg` track is kara-native's own view, a capsule in exactly that colour under a clear `UISegmentedControl`, because UIKit renders a control's own background translucent; the pill stays the system's (Liquid Glass on iOS 26) and the track grows by `p`. Android fills the unselected segments with `bg`; Material draws no pill to inset. kara-native's `SegmentedControl` binding gains `trackPadding`, `fontWeight` (the system face's weight, so a regular variant is no longer drawn medium) and `letterSpacing`.
