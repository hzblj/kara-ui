---
"@hzblj/kara-ui": patch
"@hzblj/kara-components": patch
---

`ActionSheet` on Android renders its rows in a host of its own — they were Compose views straight inside the sheet, which has none, and threw "must be rendered inside a Host". The rows are Material's bottom-sheet menu now: full width, with each action's `icon` before its label.

`SearchBar` on iOS centres its text beside the magnifier. The type scale's line height sat the text at the bottom of a taller line in a single-line `UITextField`.
