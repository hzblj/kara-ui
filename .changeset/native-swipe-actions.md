---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

`SwipeActions` works on Android, and takes its buttons as data. **Breaking:** `SwipeActions.Actions` and its `Button` children are gone — pass `leading` and/or `trailing`, each a list of `{icon, label, onPress, destructive?, tint?}`, and `allowsFullSwipe` on the row:

```tsx
<SwipeActions trailing={[{destructive: true, icon: 'trash', label: 'Delete', onPress: remove}]}>
  <ListItem title="Order #1024" />
</SwipeActions>
```

iOS renders SwiftUI's `swipeActions`, each action its icon on a button in its tint — round, with the label under it, on iOS 26. Android, where Compose has no swipe actions, gets kara's own `SwipeActionsBox` (`@hzblj/kara-native/jetpack-compose`): the row slides on an anchored drag, and filled icon buttons with their labels show in the strip it leaves. One row is open at a time on both, and a tap on an open row closes it.
