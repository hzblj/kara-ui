---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

Android integrated search: the bar's search closes on its first Cancel (the field's focus event now carries `hasText`, since it reached JS a frame before the emptied text), the hidden `TopAppBar` under the open search no longer takes taps or TalkBack focus at the field's edges, and `autoFocus` shows the keyboard only once the field really has focus.
