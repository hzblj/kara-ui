---
"@hzblj/kara-ui": patch
"@hzblj/kara-native": patch
---

`ScrollEdgeContainer` on iOS 27 blurs under the whole bar again. iOS 27 stopped counting the invisible button each bar sits on as a scroll edge element, so the blur stopped at the status bar or the navigation bar and content under the bar stayed sharp; a hidden text element now counts for it, and iOS 26 measures as before.

`ScrollViewZPosition` (`@hzblj/kara-ui/swift-ui`) raises the React Native scroll view it sits in above its later siblings without reordering them, which Fabric's `zIndex` does. A large title anchored in an empty scroll view under the content stays visible on iOS 27, whose edge effect blurs only what lies under it.
