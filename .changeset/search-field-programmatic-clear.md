---
'@hzblj/kara-native': patch
'@hzblj/kara-components': patch
'@hzblj/kara-ui': patch
---

A header search field that is emptied from code (its cancel, a clear command) shows the microphone again instead of keeping the clear cross. The accessory looked at the text only on typing and on the start and end of editing, and the cancel clears the text after editing has ended.
