---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
---

`Pressable` on Android presses the Material way: a ripple over the content — the pressed state layer — clipped to the pressable's shape, and nothing scales. iOS keeps its spring to 96%. Give the `Pressable` the `borderRadius` of what it wraps (`full` around a `GlassView`) and the ripple follows it.

`Collapsible` on Android expands down from its row with a fade, and its chevron turns toward the content; it grew from a corner and the chevron jumped.
