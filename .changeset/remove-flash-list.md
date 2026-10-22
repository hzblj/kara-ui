---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
---

**Breaking:** `FlashList` is gone, and `@shopify/flash-list` is no longer a peer dependency. kara's list for React Native content is `RnFlatList` (and `RnSectionList`): React Native's own virtualized lists, whose cells stay in normal flow, so rows that host native views keep them in place — a recycling list moves its cells, which an `@expo/ui` host does not survive. An app that wants FlashList for plain data rows installs and imports it itself.
