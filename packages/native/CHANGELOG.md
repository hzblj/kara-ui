# @hzblj/kara-native

## 0.6.0

### Minor Changes

- [#10](https://github.com/hzblj/kara-ui/pull/10) [`62b7131`](https://github.com/hzblj/kara-ui/commit/62b713143bd03872ecdd89ca8de42d98fe589617) Thanks [@hzblj](https://github.com/hzblj)! - Haptics: kara's own, native on both platforms, named for what happened.

  - `haptics.success()`, `haptics.selection()`, … — one function per haptic — and `haptics.play(name)` for a name that arrives as data. `selection`, `tick`, `toggleOn`/`toggleOff`, `success`/`warning`/`error`, `longPress`, `dragStart`, `thresholdActivate`/`thresholdDeactivate`, `keyPress`, and the impacts `soft`, `light`, `medium`, `rigid`, `heavy` (`intensity` scales them on iOS). Synchronous, nothing to await.
  - iOS: UIKit's feedback generators, kept alive and warmed up with `haptics.prepare` — `Pressable` prepares its haptic on press-in. Android: the system's own haptic feedback (`View.performHapticFeedback`), with Android 14's constants falling back to older ones — never a raw vibration. Both follow the user's system setting.
  - `useHapticFeedback(trigger, haptic)` plays on every change of a value, never on mount; a function of the previous and next value picks a haptic per change.
  - `haptics.setEnabled(false)` silences every kara haptic, the components' own included.
  - `Pressable`'s `haptic` takes a name as well as `true` (a `light` impact); `Chip` plays `selection`.
  - On Android, where Compose's Material controls play nothing: `Switch` plays `toggleOn`/`toggleOff`, a stepped `Slider` ticks at every stop, `SegmentedControl` plays `selection`. iOS keeps its native controls' own feedback.
  - `Slider`: `step` is the increment on Android too — it was passed to Compose as the number of stops.
  - `expo-haptics` is no longer a peer dependency.

## 0.5.0

### Minor Changes

- [#8](https://github.com/hzblj/kara-ui/pull/8) [`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8) Thanks [@hzblj](https://github.com/hzblj)! - `ZoomTransition`: a push that grows out of the photo it was opened from and shrinks back into it.

  - iOS 18: UIKit's zoom transition, with the interactive dismissal (swipe down, edge swipe, pinch) gated on the scroll views under the finger. Below iOS 18 the push stays a slide. Android: Material's container transform, both ways.
  - Three pieces from `@hzblj/kara-ui/router`, tied by one identifier: `ZoomTransition.Source` on the list, `ZoomTransition.Enabler` and `ZoomTransition.Target` on the pushed screen; `useZoomTransitionSourceId`, `ZOOM_TRANSITION_PARAM`, `useZoomTransitionParam` and `withZoomTransition` (an Android fade under the transform) around them.
  - Settings both platforms honour sit at the top (`scrim`); the rest is typed apart under `ios` (`dismissGesture`, `blur`, the target's `fit`) and `android` (`duration`, `easing`, `fade`, `path`, corner radii, the target's `fit` and `flex`).
  - `ContextMenu`: with a `ZoomTransition.Source` in the trigger, a tap on the iOS preview zooms the preview's photo straight into the pushed screen. `previewTransition` (`zoom`, `pop`, `dismiss`) picks how the preview leaves.
  - `DurationSize`, the keys of `duration`.

## 0.4.1

### Patch Changes

- [#6](https://github.com/hzblj/kara-ui/pull/6) [`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b) Thanks [@hzblj](https://github.com/hzblj)! - `GlassView` always shows its glass. Glass mounted under a React Native view at opacity 0 — the first row of a Legend List opened from cache, content fading in from 0 — used to stay without it, because React Native changes opacity past UIKit, which then kept the subtree marked as hidden. React Native opacity changes that cross UIKit's hidden threshold now go through `UIView.alpha`, so this holds for every Liquid Glass view in the app. The glass is also set at once instead of polling until every ancestor is fully opaque, and its content no longer waits for it.

## 0.4.0

## 0.3.0

### Minor Changes

- [`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28) Thanks [@hzblj](https://github.com/hzblj)! - Native sheets with a native header. `Sheet` is now a TrueSheet (`@lodev09/react-native-true-sheet`, a new peer dependency) with `<Sheet.Header>` — a real navigation bar with a centred, leading or large title that hands over to the bar as it scrolls away, items on either side, and on iOS 26 the content scrolls under it with the soft edge effect — plus `<Sheet.ScrollView>`, `useSheetScroll`, detents, a footer and a ref (`present`/`dismiss`/`resize`). It is React Native tier now: no host, native atoms inside go in an `Island`. `fitToContents` is replaced by `detents` (`['auto']` by default).

  `NavigationBar` takes `leadingItems` / `trailingItems` instead of `onBack` / `onClose`: `back`, `close` or an app `icon`, on either side and in any order; on iOS 26 neighbours share a glass capsule unless an item is `separated`. Also `titleAlignment`, `titleVisible`, `inverted` and an iOS `search` field. On Android it is now Material's native top app bar.

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

## 0.2.0

### Minor Changes

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Icons are now fully native and the app's own: `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]` turns every SVG in the folder into an iOS asset-catalog template image and an Android vector drawable at prebuild (`x.ios.svg` / `x.android.svg` for per-platform glyphs), and writes `kara-icons.d.ts` so `name` only accepts icons that exist; `npx kara-icons` does the same for CI. `Icon` draws them in a host, the new `RnIcon` anywhere, and `Tabs` passes them as `xcasset` / `drawable`. The built-in SF Symbol / Material icon names and the `@expo/vector-icons` peer dependency are gone.

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Leaner, reusable-only components. `Countdown` is gone, with its native views. There is one `ContextMenu` now — the native module's long-press menu on React Native content, with a custom preview on iOS (formerly `RnContextMenu`); the `@expo/ui`-based one is removed.

  Android, reworked to look and behave like Material while honouring the theme:

  - `Button`, `Badge` and `Alert` render their labels; `Button` keeps Material's own shape (no iOS ring), takes `tint` as its fill with a label that contrasts with it, and draws `glass` as Material's outlined button.
  - `Alert` is built from `AlertDialog`'s slots — title, message, the confirm action (destructive when asked) and Cancel — instead of drawing empty.
  - `Menu` presents its actions in Material's dropdown popup, with their icons, instead of laying them out over the trigger.
  - `Picker` is a themed Material exposed dropdown the width of its container.
  - `Switch`, `Checkbox` and `RadioGroup` are tinted with the accent, and with a label are full-width rows that toggle as a whole; `Form` sections span the form's width.
  - `Surface` pads its content instead of its background, and stacks its children in a column.
  - `Fab` shows its icon, `DatePicker` opens its dialog on a tap (in the accent colour) instead of on mount, `GlassView`'s fallback is the translucent glass fill, and the `List` docs spell out that it needs a bounded height.

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides — colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android. Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.
