---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`BlurView` takes `intensity`, from 0 (no material) to 1 (the full material, the default). On iOS it works the way UIKit fades a material in: a paused effect animation at that fraction, since UIKit has no blur radius. On Android it scales the blur, the saturation and the surface. Pass a Reanimated shared value to animate it on the UI thread, for example a bar's background coming in as content scrolls under it. A plain number sets it.
