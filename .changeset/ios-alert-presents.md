---
"@hzblj/kara-ui": patch
"@hzblj/kara-components": patch
---

`Alert` and `ActionSheet` appear on iOS. Both hung their SwiftUI presentation on an `EmptyView` — `@expo/ui` uses one when there is no trigger, and SwiftUI never presents from it — so `visible` changed nothing. Each now has a trigger that takes no room, and `ActionSheet` passes its buttons through the dialog's `Actions` slot.
