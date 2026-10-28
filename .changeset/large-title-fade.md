---
"@hzblj/kara-native": minor
"@hzblj/kara-components": minor
"@hzblj/kara-ui": minor
---

`HeaderLargeTitleFade` (`@hzblj/kara-ui/header`) fades content under the header, like segments or chips, out and back with the large title while the header search is open, in step with UIKit's animation (iOS). `ScrollViewZPosition` is removed: a large title stays in the bar when the screen's first view is not a scroll view, so the empty anchor scroll view it kept visible is no longer needed.
