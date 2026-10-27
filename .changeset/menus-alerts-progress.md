---
'@hzblj/kara-components': minor
'@hzblj/kara-native': minor
'@hzblj/kara-ui': minor
---

`Alert` takes `cancelLabel`: the cancel button's label, so an app in another language no longer shows an English "Cancel" beside its own confirm label. `Cancel` stays the default, and `null` leaves the button out, for an alert that only informs and is closed by its confirm button alone.

`ActionSheet` takes a `message`: the confirmation dialog's own message under the title on iOS, a line under the title on Android. The title now shows on iOS too, where SwiftUI hid it by default and the actions lost what they were about.

`Menu` can open from an icon. `icon` sits before the `label` in the same colour, or stands alone as an `IconButton` that opens the menu, with an `accessibilityLabel` the types require when there is no label. iOS now draws each action's `icon` in the menu, as Android already did.

`MenuAction` takes `disabled`: the action stays in the list, greyed, and does not respond. `Menu`, `ActionSheet` and `ContextMenu` honour it on both platforms (the iOS context menu marks its `UIAction` disabled in kara-native's `ContextMenuView`, so it needs a native rebuild), `FabMenu` on iOS only, since Material's FAB menu items have no disabled state.

`Progress` takes `color`, any colour token: `fill.destructive.primary` for storage nearly full, `fill.success.primary` for a goal reached. `fill.accent.primary` stays the default. On Android a bar in another colour gets a track in that colour, faded, rather than Material's pale accent under it.
