---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`SegmentedControl` segments can show more than a label: `{label, icon}` leads with one of the app's icons in the label's colour, and `{label, image}` shows an image in its own colours instead, such as a carrier's logo from a URL, raster or SVG. `iconSize` sets their height (`s20` by default) and `spacing` the space above and below the content, for a taller control. The images load natively, as Footshop's platform-ui loads them: kara-native now depends on SDWebImage and SDWebImageSVGCoder on iOS and on androidsvg on Android, and its new `NativeImage` draws such an image in a Compose host. The label stays what screen readers say, and is shown if the image cannot be loaded.
