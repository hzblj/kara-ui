# @hzblj/kara-native

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
