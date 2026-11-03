---
'@hzblj/kara-theme': minor
'@hzblj/kara-native': minor
'@hzblj/kara-components': minor
'@hzblj/kara-ui': minor
---

Android catches up with iOS:

- Every ripple on Android takes the new `fill.ripple` token, Compose controls and pressables alike, instead of each control's content colour. Override it in your theme like any colour.
- `useHeaderSearch({placement: 'integratedButton'})` is the toolbar's own search on Android too: a magnifier in the bar's corner that expands over the title, with the microphone in the field. Pass `searchBar` to `useHeader` on both platforms.
- `NavigationBar` and `Sheet.Header` take `search` on Android: a field in a row under the bar, or a search item that grows into the field over the bar and closes once the field is cancelled, cleared or left empty.
- `NavigationItemSearch` has an Android side, `TopAppBar` a `Search` slot with `searchActive`, and `SearchField` an `autoFocus`.
- A `TopAppBar` that loses its leading or trailing items drops them instead of keeping the last ones.
