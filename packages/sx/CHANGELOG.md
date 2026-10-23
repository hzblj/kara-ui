# @hzblj/kara-sx

## 0.11.0

### Minor Changes

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Accessibility props in the engine: `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` (`button`, `header`, `image`, `link`, `text`), `accessibilityValue`, `accessibilityHidden` and `accessible`, one set for both platforms. `@hzblj/kara-sx` turns them into SwiftUI's accessibility modifiers on iOS and into Compose semantics on Android, through a new `karaAccessibility` modifier in `@hzblj/kara-native` (a native rebuild picks it up). The stacks, `Text`, `Card`, `Surface`, `ListItem`, `RnListItem`, `LabeledContent`, `Link` and `Pressable` take all of them; `Button` takes a hint, and `Avatar`, `Progress` and `ActivityIndicator` a label.

  What the components do by themselves: a stack with `onPress` is read as one button, `Pressable` is a button, list rows and a `LabeledContent` with a value are read as one element, `Link` is a link, and `Skeleton` and an `Avatar` without a label are hidden. `IconButton`, `Fab` and `FabMenu` now require an `accessibilityLabel`, since an icon has nothing of its own for VoiceOver or TalkBack to say; `Snackbar`'s close button is labelled.

  Reduce Motion: `useReducedMotion()` follows the device's Reduce Motion (iOS) or Remove animations (Android) setting live, and `KaraProvider reduceMotion` can force it (`always`) or ignore it (`never`). With motion reduced, `Pressable` dims instead of scaling, `Snackbar` only fades, `Skeleton` holds still, Android's `Collapsible` fades and snaps its chevron, and iOS's `Stepper` cross-fades its value.

### Patch Changes

- Updated dependencies [[`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047), [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047)]:
  - @hzblj/kara-native@0.11.0
  - @hzblj/kara-theme@0.11.0

## 0.10.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.9.0

## 0.8.0

### Minor Changes

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `sx` reaches the components that still took raw styles or none:

  - `Text` takes the native `sx` surface: padding, a background, a frame (`wide` puts the text on the side `align` names) and the `ios` bucket. `ios.contentTransition` with the new `ios.animation` rolls a number to its next value, and `ios.monospacedDigit` keeps it from shifting what follows. `Stepper` on iOS is built on it.
  - `RnText` takes `Box`'s `sx` props for its own box (margins, `flex`, padding), all but `align`, which still aligns its lines.
  - `Image` is `sx(expo-image)`, the way `Box` is `sx(View)`: `w`, `h`, `aspectRatio`, `borderRadius`, `position`… instead of a `style` object. Its props are exported as `ImageProps`.
  - `Island` takes the same `sx` props for where it sits in React Native layout: `<Island h={240} matchContents={false}>`. An explicit `style` still wins.
  - `Skeleton` is sized with the `sx` names, `h` and `w` (was `height` and `width`), and `w` takes a percentage: `<Skeleton h={12} w="60%" />` for a line that ends early.
  - The React Native surface gains `inset`, all four edges at once: `position="absolute" inset={0}` fills the parent.

### Patch Changes

- Updated dependencies [[`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29)]:
  - @hzblj/kara-theme@0.8.0

## 0.7.0

### Patch Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `sx` costs less on every render. The style cache, the responsive flattening and the key behind `useSxModifiers` used to go through every key the surface has, about seventy for a `Box`, even when a component set two or three of them. Now they go through only the props that are set, and the theme's part of the cache key is worked out once per theme rather than on every render. Without a JIT, as on Hermes, an `sx()` view resolves its style 2.5–5× faster and a native atom 2–4.5× faster.

- Updated dependencies []:
  - @hzblj/kara-theme@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [[`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8)]:
  - @hzblj/kara-theme@0.5.0

## 0.4.1

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

- Updated dependencies [[`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268)]:
  - @hzblj/kara-theme@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies []:
  - @hzblj/kara-theme@0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides (colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android). Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.

### Patch Changes

- Updated dependencies [[`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1)]:
  - @hzblj/kara-theme@0.1.0
