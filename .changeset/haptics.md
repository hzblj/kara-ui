---
"@hzblj/kara-ui": minor
"@hzblj/kara-native": minor
"@hzblj/kara-components": minor
---

Haptics: kara's own, native on both platforms, named for what happened.

- `haptics.success()`, `haptics.selection()`, … — one function per haptic — and `haptics.play(name)` for a name that arrives as data. `selection`, `tick`, `toggleOn`/`toggleOff`, `success`/`warning`/`error`, `longPress`, `dragStart`, `thresholdActivate`/`thresholdDeactivate`, `keyPress`, and the impacts `soft`, `light`, `medium`, `rigid`, `heavy` (`intensity` scales them on iOS). Synchronous, nothing to await.
- iOS: UIKit's feedback generators, kept alive and warmed up with `haptics.prepare` — `Pressable` prepares its haptic on press-in. Android: the system's own haptic feedback (`View.performHapticFeedback`), with Android 14's constants falling back to older ones — never a raw vibration. Both follow the user's system setting.
- `useHapticFeedback(trigger, haptic)` plays on every change of a value, never on mount; a function of the previous and next value picks a haptic per change.
- `haptics.setEnabled(false)` silences every kara haptic, the components' own included.
- `Pressable`'s `haptic` takes a name as well as `true` (a `light` impact); `Chip` plays `selection`.
- On Android, where Compose's Material controls play nothing: `Switch` plays `toggleOn`/`toggleOff`, a stepped `Slider` ticks at every stop, `SegmentedControl` plays `selection`. iOS keeps its native controls' own feedback.
- `Slider`: `step` is the increment on Android too — it was passed to Compose as the number of stops.
- `expo-haptics` is no longer a peer dependency.
