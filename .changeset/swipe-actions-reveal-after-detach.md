---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

Android: a `SwipeActions` row swiped after another screen was pushed on top and popped shows its actions again, instead of sliding over an empty strip. The reveal's alpha and clip are now read in composition: Compose drops the snapshot reads of `graphicsLayer` and draw lambdas when react-native-screens detaches the screen below a push.
