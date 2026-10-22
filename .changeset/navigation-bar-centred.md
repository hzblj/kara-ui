---
"@hzblj/kara-ui": patch
"@hzblj/kara-native": patch
---

`NavigationBar` and `Sheet.Header` on iOS 26 centre their title and glass items. UIKit's bar is 54 pt with its 44 pt row of items at the top, so centring the bar left the row 5 pt high; it is the row that is centred now.
