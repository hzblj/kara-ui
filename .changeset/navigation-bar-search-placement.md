---
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

`NavigationBar` (and so `Sheet.Header`) places its search the way a native-stack header does. `search.placement` is `stacked` by default, a row of its own under the title with the title and items kept, or `integratedButton`, a search item beside the trailing items that turns the whole bar into the field. A focused field now gets a cancel item that empties it and ends the search; `UISearchBar`'s own cancel button did nothing in a standalone bar. The field is laid out on the item row, so it lines up with the cancel item instead of sitting 5 pt lower. `back` and `close` items take an optional `icon`, and the search item and the cancel `search.buttonIcon` / `search.cancelIcon`, in place of the system glyphs. The bar also centres its item row again on iOS 27, where the old lookup by the glass platters' class name found nothing and left the title and items 5 pt high.
