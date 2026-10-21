---
"@hzblj/kara-ui": minor
"@hzblj/kara-components": minor
"@hzblj/kara-native": minor
---

Leaner, reusable-only components. `Countdown` is gone, with its native views. There is one `ContextMenu` now — the native module's long-press menu on React Native content, with a custom preview on iOS (formerly `RnContextMenu`); the `@expo/ui`-based one is removed.

Android, reworked to look and behave like Material while honouring the theme:

- `Button`, `Badge` and `Alert` render their labels; `Button` keeps Material's own shape (no iOS ring), takes `tint` as its fill with a label that contrasts with it, and draws `glass` as Material's outlined button.
- `Alert` is built from `AlertDialog`'s slots — title, message, the confirm action (destructive when asked) and Cancel — instead of drawing empty.
- `Menu` presents its actions in Material's dropdown popup, with their icons, instead of laying them out over the trigger.
- `Picker` is a themed Material exposed dropdown the width of its container.
- `Switch`, `Checkbox` and `RadioGroup` are tinted with the accent, and with a label are full-width rows that toggle as a whole; `Form` sections span the form's width.
- `Surface` pads its content instead of its background, and stacks its children in a column.
- `Fab` shows its icon, `DatePicker` opens its dialog on a tap (in the accent colour) instead of on mount, `GlassView`'s fallback is the translucent glass fill, and the `List` docs spell out that it needs a bounded height.
