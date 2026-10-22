---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
---

`ActivityIndicator` plays Material 3's expressive `LoadingIndicator` on Android — its shapes morph as it turns — in a host of its own, so it still renders anywhere; iOS keeps UIKit's spinner. It takes the design system's props now, not React Native's: `color` is a token (`fill.accent.primary` by default), `size` is `small` or `large`.

`Collapsible` on Android spans its parent, the chevron at the far end, and its row is never shorter than Material's 48dp touch target; the chevron sat right after the label. `Pager`'s dots on Android are centred under the pages.
