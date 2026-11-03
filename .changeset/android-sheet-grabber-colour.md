---
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

`Sheet`'s grabber on Android follows the app's theme: Material's handle colour at 40 %, light under an `inverted` header. It used to follow the phone's dark mode, so a light app on a dark phone drew a white grabber on a white sheet. A `Sheet.Header` without a bar starts below the grabber instead of under it.
