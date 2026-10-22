---
"@hzblj/kara-ui": patch
"@hzblj/kara-native": patch
---

`ScrollEdgeContainer` on iOS keeps its scroll view and top bar when a screen showing it is opened again. Its bars switched SwiftUI's structure once they had measured themselves, so SwiftUI rebuilt the hosted React Native views; on a remount it made several containers for each and dropped the last, which took the view with it.
