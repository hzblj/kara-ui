---
'@hzblj/kara-theme': minor
'@hzblj/kara-ui': minor
---

`ThemeConfig` takes `typography`: change any variant of the type scale (its `fontSize`, `lineHeight`, `weight`, `role` or `scalesWith`) by name, e.g. `{headline: {fontSize: 16, lineHeight: 24}}` for smaller header titles. Fields left out keep kara's values. The change reaches `Text`, `RnText`, the native headers and `theme.monoTypography` alike, since they all read the resolved scale.
