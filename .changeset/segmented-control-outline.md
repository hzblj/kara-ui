---
"@hzblj/kara-components": patch
"@hzblj/kara-ui": patch
---

`SegmentedControl` on Android draws one outline around every segment, the selected one too. Its accent border used to run the fill out over the line the other segments draw inside, so the selected segment looked taller than its neighbours.
