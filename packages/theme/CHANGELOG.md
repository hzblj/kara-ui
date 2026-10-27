# @hzblj/kara-theme

## 0.16.0

## 0.15.4

## 0.15.3

## 0.15.2

## 0.15.1

## 0.15.0

### Minor Changes

- [#43](https://github.com/hzblj/kara-ui/pull/43) [`2ff941d`](https://github.com/hzblj/kara-ui/commit/2ff941d989cef86f8cdea39483945e760153a90f) Thanks [@hzblj](https://github.com/hzblj)! - `Text` and `RnText` take `monospaced` and `monospacedDigit`. `monospaced` sets the text in the theme's fixed-width face at its variant's size and weight: a new `fonts.mono` role in `ThemeConfig` for a face of the app's own (JetBrains Mono beside Inter, say), else Menlo on iOS and `monospace` on Android, the same face in both tiers. `monospacedDigit` keeps whatever face the text has and asks it for tabular figures, so a price or a counter does not shift as it changes: SwiftUI's `monospacedDigit()`, React Native's `fontVariant: ['tabular-nums']`, and `tnum` on Compose. `theme.monoTypography` is the scale `monospaced` reads. `ios.monospacedDigit` is gone from `sx`: use the `monospacedDigit` prop, which now works on Android too. Rebuild the native app.

## 0.14.2

## 0.14.1

## 0.14.0

## 0.13.2

## 0.13.1

## 0.13.0

## 0.12.0

### Minor Changes

- [#28](https://github.com/hzblj/kara-ui/pull/28) [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8) Thanks [@hzblj](https://github.com/hzblj)! - Motion in the engine. Every `sx` view (`Box`, `Image`, anything wrapped with `sx()`), `RnText` and `Pressable` take `entering`, `exiting`, `layout` and `animate`, and become a Reanimated view by themselves when they do, or when their `style` comes from `useAnimatedStyle`. Without them a `Box` stays a plain `View` and costs nothing more. `ABox` is gone: use `Box`, and pass `animated` to one whose animated style only arrives after it mounts.

  - `entering` and `exiting` take a preset named by the way the view moves (`fade`, `fadeUp`, `fadeDown`, `scale`), a preset adjusted (`{preset: 'scale', duration: 'slow', delay: 120}`, or with a `spring`), or Reanimated's own builder. Arriving takes `fast` and leaving `quick`; with motion reduced every preset fades.
  - `animate` carries a change of the colours, `opacity` and the transform over to the new value on the UI thread, through Reanimated's CSS transitions: `animate`, `animate="slow"`, `animate="snappy"` or a config whose `keys` can add sizes, radii and blur. On iOS the UIKit colours a transition cannot read are resolved to the values UIKit draws (`resolveSystemColor` in `@hzblj/kara-native`, a native rebuild picks it up), so a selected row blends on both platforms.
  - `layout` moves a view into its new place on the `smooth` spring, or a spring token, a timed config or Reanimated's own transition. It snaps with motion reduced.
  - The native views take `animate` too: SwiftUI's `.animation(_:value:)` on iOS, animated `graphicsLayer` values, a `background` animation spec and `animateContentSize` on Android, on the same tokens.

  New `Stagger`: a `Box` whose children arrive one after another, a step (`interval`, `stagger` by default) apart. Only the children that arrive together take turns, so the next page of a list staggers while an item added on its own appears at once. A `Box`, `RnText` or `Pressable` child takes the motion directly; any other is wrapped in a `Box`.

  Springs as tokens: `springs` in `@hzblj/kara-theme` holds SwiftUI's set (`interactive`, `smooth`, `snappy`, `bouncy`), a perceptual duration and a bounce each, and `springPhysics` turns one into the physics every platform runs, so a token is one curve in Reanimated, in a CSS transition, in SwiftUI and in Compose. `spring(name)` and `timing(size, curve)` (moved here from the components) give `withSpring` and `withTiming` configs, and `useEntering`, `useExiting` and `useLayoutTransition` hand kara's presets to a Reanimated view of your own.

  `Pressable` presses on springs, down on `interactive` and back on `smooth`, so a press let go halfway eases back instead of turning on the spot. `Snackbar`'s `entering` and `exiting` take the presets too.

### Patch Changes

- [#28](https://github.com/hzblj/kara-ui/pull/28) [`84ddbac`](https://github.com/hzblj/kara-ui/commit/84ddbacba9f35d578fa7dfce3e9f696ae09771f8) Thanks [@hzblj](https://github.com/hzblj)! - Faster styling. A resolved React Native style carries only the keys a call site set, where it used to carry forty-odd more as `undefined`, each walked on every mount. Views with the same native `sx` share one resolved modifier array, as they already shared a style, and `sx()` splits its props, the motion props included, in a single walk. `RnText` reads the user's text size from one subscription at the root (`useFontScale`, provided with the breakpoint) instead of one per text, and shares its text style the way `sx` shares its own.

  `RnText` no longer loses its last line on iOS when React Native lays the paragraph out a hair shorter than its lines need, which happened depending on where the text sat on the page.

## 0.11.0

### Minor Changes

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Accessibility props in the engine: `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` (`button`, `header`, `image`, `link`, `text`), `accessibilityValue`, `accessibilityHidden` and `accessible`, one set for both platforms. `@hzblj/kara-sx` turns them into SwiftUI's accessibility modifiers on iOS and into Compose semantics on Android, through a new `karaAccessibility` modifier in `@hzblj/kara-native` (a native rebuild picks it up). The stacks, `Text`, `Card`, `Surface`, `ListItem`, `RnListItem`, `LabeledContent`, `Link` and `Pressable` take all of them; `Button` takes a hint, and `Avatar`, `Progress` and `ActivityIndicator` a label.

  What the components do by themselves: a stack with `onPress` is read as one button, `Pressable` is a button, list rows and a `LabeledContent` with a value are read as one element, `Link` is a link, and `Skeleton` and an `Avatar` without a label are hidden. `IconButton`, `Fab` and `FabMenu` now require an `accessibilityLabel`, since an icon has nothing of its own for VoiceOver or TalkBack to say; `Snackbar`'s close button is labelled.

  Reduce Motion: `useReducedMotion()` follows the device's Reduce Motion (iOS) or Remove animations (Android) setting live, and `KaraProvider reduceMotion` can force it (`always`) or ignore it (`never`). With motion reduced, `Pressable` dims instead of scaling, `Snackbar` only fades, `Skeleton` holds still, Android's `Collapsible` fades and snaps its chevron, and iOS's `Stepper` cross-fades its value.

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Motion tokens on transitions.dev's scale, in place of the `d0` to `d10000` steps, of which six were ever used. Durations are named by what the motion does: `micro` (80 ms, what answers a touch), `quick` (150 ms, something leaving or swapped in place), `fast` (250 ms, something arriving), `medium` (350 ms, a larger surface leaving), `slow` (400 ms, a larger surface arriving), `verySlow` (500 ms, an emphasised moment), `stagger` (40 ms, the offset between items) and `none`. Pick a step by what the motion does, not by the number it had: as a rule of thumb, `d100` is `micro`, `d150` `quick`, `d200` `quick` or `fast`, `d250` and `d300` `fast`, `d400` `slow` and `d500` `verySlow`. `ZoomTransition`'s Android `duration` takes the same names and, unset, keeps Material's own 450 ms.

  New `easing` tokens carry the curves as cubic-bézier points, ready for `Easing.bezier(...easing.smoothOut)`: `smoothOut` for arriving and leaving alike, `inOut` for a swap in place, `out` for a small fade, `linear` for what loops.

  The components use them: `Pressable` eases its scale down in `quick` and back in `fast` with no bounce, and dims in `micro`; `Snackbar` arrives in `fast` and leaves in `quick` on `smoothOut`; `Image` fades in over `quick`.

  `content.on.bg` is `content.on.accent`, which is what it sits on (Material's `onPrimary` under `dynamicColor`). The opacity and spacing scales keep their values and are documented now: the opacity ramp's tens and quarters, and spacing's 4 pt grid with half steps where small gaps need them.

## 0.10.0

## 0.9.0

## 0.8.0

### Minor Changes

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - Android gets glass and a scroll edge of its own.

  - `GlassView` is frosted glass on Android: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface (or its `tint`) and a light hairline, the blurred surfaces Android 16 gives its own system UI. It was an almost clear capsule that left its content unreadable over a photo. Below Android 12 the same colours are drawn near-opaque. kara-native's new `BackdropBlurView` (`/jetpack-compose`) does the blur (blurred, then saturated, as iOS lifts the colour under its materials): a plain view, no host, and an idle screen draws no frames.
  - `ScrollEdgeContainer` on Android behaves like a Material top app bar on scroll: the bars stay transparent at rest and fill with the scrolled container colour once content scrolls under the top one, the bottom one while there is more below. Its scroll view also takes the room between the bars now; before, it grew to its content's height, ran under the bottom bar and could not scroll.
  - New token `surface.secondary`, a step above `surface.primary`: Material's `surfaceContainer` on Android, `tertiarySystemGroupedBackgroundColor` on iOS.

## 0.7.0

## 0.6.0

## 0.5.0

### Minor Changes

- [#8](https://github.com/hzblj/kara-ui/pull/8) [`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8) Thanks [@hzblj](https://github.com/hzblj)! - `ZoomTransition`: a push that grows out of the photo it was opened from and shrinks back into it.

  - iOS 18: UIKit's zoom transition, with the interactive dismissal (swipe down, edge swipe, pinch) gated on the scroll views under the finger. Below iOS 18 the push stays a slide. Android: Material's container transform, both ways.
  - Three pieces from `@hzblj/kara-ui/router`, tied by one identifier: `ZoomTransition.Source` on the list, `ZoomTransition.Enabler` and `ZoomTransition.Target` on the pushed screen; `useZoomTransitionSourceId`, `ZOOM_TRANSITION_PARAM`, `useZoomTransitionParam` and `withZoomTransition` (an Android fade under the transform) around them.
  - Settings both platforms honour sit at the top (`scrim`); the rest is typed apart under `ios` (`dismissGesture`, `blur`, the target's `fit`) and `android` (`duration`, `easing`, `fade`, `path`, corner radii, the target's `fit` and `flex`).
  - `ContextMenu`: with a `ZoomTransition.Source` in the trigger, a tap on the iOS preview zooms the preview's photo straight into the pushed screen. `previewTransition` (`zoom`, `pop`, `dismiss`) picks how the preview leaves.
  - `DurationSize`, the keys of `duration`.

## 0.4.1

## 0.4.0

## 0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

## 0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides (colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android). Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.
