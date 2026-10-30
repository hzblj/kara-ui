---
'@hzblj/kara-native': patch
'@hzblj/kara-ui': patch
---

Closing a native-stack header's integrated search button in a modal presented over another modal brings the search button's glyph back at once instead of leaving an empty circle for a moment: the search reports its close as soon as it dismisses. Run a prebuild after upgrading.
