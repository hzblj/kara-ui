---
"@hzblj/kara-native": patch
"@hzblj/kara-ui": patch
---

`GlassView` always shows its glass. Glass mounted under a React Native view at opacity 0 — the first row of a Legend List opened from cache, content fading in from 0 — used to stay without it, because React Native changes opacity past UIKit, which then kept the subtree marked as hidden. React Native opacity changes that cross UIKit's hidden threshold now go through `UIView.alpha`, so this holds for every Liquid Glass view in the app. The glass is also set at once instead of polling until every ancestor is fully opaque, and its content no longer waits for it.
