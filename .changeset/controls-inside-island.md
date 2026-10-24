---
"@hzblj/kara-components": patch
"@hzblj/kara-ui": patch
---

`SegmentedControl`, `ActivityIndicator` and `DatePicker` work inside a `Screen` or `Island`, next to other native views, the way `Picker` now does. Each is made to drop into React Native layout on its own, so it brought a host of its own or was a plain React Native view, and inside an island that broke the island. On Android a `SegmentedControl` left the views beside it no width (a multiline `TextField` vanished and the island ran past the screen), an `ActivityIndicator` emptied the island, and a `DatePicker` field did not show. On iOS the segmented control swelled and squashed the field above it, the spinner drifted off its row, and the date pill came loose from its label. Inside a host each now renders into that host; on its own nothing changes.
