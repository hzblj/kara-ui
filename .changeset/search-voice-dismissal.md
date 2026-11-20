---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

Closing a header search while the voice is listening no longer jumps: the meter and the stop button fade into the microphone during the search's own dismissal, instead of after the bar has landed, when the app's `listening` arrives through JS.
