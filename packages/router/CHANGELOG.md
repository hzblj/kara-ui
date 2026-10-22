# @hzblj/kara-router

## 0.4.1

### Patch Changes

- Updated dependencies [[`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b)]:
  - @hzblj/kara-native@0.4.1
  - @hzblj/kara-theme@0.4.1
  - @hzblj/kara-components@0.4.1

## 0.4.0

### Minor Changes

- [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03) Thanks [@hzblj](https://github.com/hzblj)! - Android polish, and a new `RnListItem`.

  - `ContextMenu` on Android is a proper long-press menu: a ripple and the long-press haptic, then a Material dropdown where the finger is, with the actions' icons and the trigger highlighted while it is open. The ripple and highlight stay inside rounded corners.
  - A pressable `HStack`, `VStack` or `ZStack` ripples across its whole shape, padding included; `ListItem` and `LabeledContent` take `px` so a row in a card can carry the card's padding inside its press area.
  - `ListItem` keeps its chevron when the subtitle fills the line.
  - `Tabs` take the theme's colours: on Android the bar, active indicator, icons, labels and ripple come from tokens instead of the wallpaper scheme; on iOS the selected item takes the accent.
  - New `RnListItem`: `ListItem`'s row in the React Native tier, cheap to mount by the dozen, with a full-row ripple on Android and a highlight on iOS.

### Patch Changes

- Updated dependencies [[`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03)]:
  - @hzblj/kara-components@0.4.0
  - @hzblj/kara-theme@0.4.0
  - @hzblj/kara-native@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [[`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28)]:
  - @hzblj/kara-components@0.3.0
  - @hzblj/kara-native@0.3.0
  - @hzblj/kara-theme@0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

- Updated dependencies [[`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268)]:
  - @hzblj/kara-components@0.2.1
  - @hzblj/kara-native@0.2.1
  - @hzblj/kara-theme@0.2.1

## 0.2.0

### Minor Changes

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Icons are now fully native and the app's own: `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]` turns every SVG in the folder into an iOS asset-catalog template image and an Android vector drawable at prebuild (`x.ios.svg` / `x.android.svg` for per-platform glyphs), and writes `kara-icons.d.ts` so `name` only accepts icons that exist; `npx kara-icons` does the same for CI. `Icon` draws them in a host, the new `RnIcon` anywhere, and `Tabs` passes them as `xcasset` / `drawable`. The built-in SF Symbol / Material icon names and the `@expo/vector-icons` peer dependency are gone.

### Patch Changes

- Updated dependencies [[`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f), [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f)]:
  - @hzblj/kara-components@0.2.0
  - @hzblj/kara-native@0.2.0
  - @hzblj/kara-theme@0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides — colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android. Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.

### Patch Changes

- Updated dependencies [[`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1)]:
  - @hzblj/kara-theme@0.1.0
  - @hzblj/kara-components@0.1.0
