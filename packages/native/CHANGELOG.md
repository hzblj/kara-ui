# @hzblj/kara-native

## 0.14.1

## 0.14.0

### Minor Changes

- [#38](https://github.com/hzblj/kara-ui/pull/38) [`40ddb25`](https://github.com/hzblj/kara-ui/commit/40ddb254b85e95c4e86d79f5ce71c3c004598a59) Thanks [@hzblj](https://github.com/hzblj)! - `Text` takes spans and eases their colours. Nested `Text` children are runs of one paragraph, each in a `color` of its own (`<Text>Box, box. <Text color="content.accent">Box this lap</Text></Text>`), and with `animate` a colour that changes, the text's or a span's, eases to its new value on the motion tokens instead of switching: a word lit as it is said, a phrase brought forward. SwiftUI interpolates the text; on Android each span animates its colour natively. Colours keep easing with Reduce Motion on. Rebuild the native app.

## 0.13.2

### Patch Changes

- [#36](https://github.com/hzblj/kara-ui/pull/36) [`cef8ad3`](https://github.com/hzblj/kara-ui/commit/cef8ad3f70d2dbf598c31a91bc524dde8f85a761) Thanks [@hzblj](https://github.com/hzblj)! - Fixed a crash at launch on iOS when two React runtimes start at the same time, as when a dev client is opened through its deep link while it launches, or the app reloads during startup. Each runtime registered kara's native modifiers into `@expo/ui`'s shared registry, and two registering at once corrupted it. On both platforms the modifiers are now registered once per process, whichever runtime comes first, and a reload no longer registers them again. On Android, a runtime that goes away no longer unregisters `underline` and the accessibility modifier while another runtime still uses them. Rebuild the native app.

## 0.13.1

## 0.13.0

### Minor Changes

- [#30](https://github.com/hzblj/kara-ui/pull/30) [`5d5265a`](https://github.com/hzblj/kara-ui/commit/5d5265a5da215c3e5559ba5144b27d53d1e3690f) Thanks [@hzblj](https://github.com/hzblj)! - Haptics move to a package of their own, [`@hzblj/expo-rich-haptics`](https://github.com/hzblj/expo-rich-haptics), which kara now depends on, so any Expo app can use them. kara no longer exports `haptics`, `useHapticFeedback`, `Haptic` or `HAPTICS`: add the package to your app (`npx expo install @hzblj/expo-rich-haptics`) and import them from it. The names and calls are the same, and the components play the same haptics. The package adds patterns of your own (Android's haptic primitives on a timeline, which iOS plays through Core Haptics), plus `intensity` and a warning of its own on Android devices that have primitives. `@hzblj/kara-native` drops `playHaptic`, `prepareHaptic` and `HAPTICS`. Rebuild the native app to pick up the new module.

- [#31](https://github.com/hzblj/kara-ui/pull/31) [`4b20462`](https://github.com/hzblj/kara-ui/commit/4b204621670b6f640fc04bffa527007dda9e06a8) Thanks [@hzblj](https://github.com/hzblj)! - Icons and the zoom transition now come from two standalone packages, which work without kara too.

  - **Icons: [@hzblj/expo-native-icons](https://www.npmjs.com/package/@hzblj/expo-native-icons).** The config plugin is the same (`plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`, the same options, `npx kara-icons` still works). The names change: the declaration is now `native-icons.d.ts` with the global `NativeIcons` (it was `kara-icons.d.ts` and `KaraIcons`), and each icon is `native_icon_<name>` natively (it was `kara_icon_<name>`). Delete the old `kara-icons.d.ts`, and run `expo prebuild --clean` once so the old assets go. `RnIcon` is now the package's `NativeIcon`: on Android it draws the drawable itself instead of hosting an `ImageView`, and remembers each icon's resource lookup, so a list of rows does less work. A glyph with a non-square viewBox no longer stretches on Android.
  - **Zoom transition: [@hzblj/expo-zoom-transition](https://www.npmjs.com/package/@hzblj/expo-zoom-transition).** `ZoomTransition` and its helpers from `@hzblj/kara-ui/router` are unchanged: kara's tokens over the package. The native code moved out of `@hzblj/kara-native` into the package's own module, which `@hzblj/kara-native` depends on, so autolinking picks it up. A tapped context menu preview still zooms. Rebuild the native app.
  - `iconResourceName` moved from `@hzblj/kara-native` to `@hzblj/expo-native-icons`, and `@hzblj/kara-expo-plugin` no longer exports the icon generator or `./cli`: import them from `@hzblj/expo-native-icons/plugin` and `@hzblj/expo-native-icons/cli`.

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

## 0.11.0

### Minor Changes

- [#25](https://github.com/hzblj/kara-ui/pull/25) [`6828522`](https://github.com/hzblj/kara-ui/commit/68285220a725ccfcd2c2bd9a4bcc7eb3a7f8a047) Thanks [@hzblj](https://github.com/hzblj)! - Accessibility props in the engine: `accessibilityLabel`, `accessibilityHint`, `accessibilityRole` (`button`, `header`, `image`, `link`, `text`), `accessibilityValue`, `accessibilityHidden` and `accessible`, one set for both platforms. `@hzblj/kara-sx` turns them into SwiftUI's accessibility modifiers on iOS and into Compose semantics on Android, through a new `karaAccessibility` modifier in `@hzblj/kara-native` (a native rebuild picks it up). The stacks, `Text`, `Card`, `Surface`, `ListItem`, `RnListItem`, `LabeledContent`, `Link` and `Pressable` take all of them; `Button` takes a hint, and `Avatar`, `Progress` and `ActivityIndicator` a label.

  What the components do by themselves: a stack with `onPress` is read as one button, `Pressable` is a button, list rows and a `LabeledContent` with a value are read as one element, `Link` is a link, and `Skeleton` and an `Avatar` without a label are hidden. `IconButton`, `Fab` and `FabMenu` now require an `accessibilityLabel`, since an icon has nothing of its own for VoiceOver or TalkBack to say; `Snackbar`'s close button is labelled.

  Reduce Motion: `useReducedMotion()` follows the device's Reduce Motion (iOS) or Remove animations (Android) setting live, and `KaraProvider reduceMotion` can force it (`always`) or ignore it (`never`). With motion reduced, `Pressable` dims instead of scaling, `Snackbar` only fades, `Skeleton` holds still, Android's `Collapsible` fades and snaps its chevron, and iOS's `Stepper` cross-fades its value.

## 0.10.0

### Minor Changes

- [#23](https://github.com/hzblj/kara-ui/pull/23) [`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717) Thanks [@hzblj](https://github.com/hzblj)! - `ColorPicker` works on Android. Compose ships no colour picker, so kara draws its own in the iOS picker's shape: a well with a rainbow ring beside the label, and a Material bottom sheet with a grid of swatches, a spectrum and RGB sliders, an opacity slider with `supportsOpacity`, and the colour with its hex at the foot. It reports every change through `onValueChange`, as `#RRGGBB` or, with opacity, `#RRGGBBAA`. It needs no extra dependency.

  `Pressable` takes a `pressEffect`: `scale` springs the content down to `pressedScale` (0.96), `opacity` dims it to `pressedOpacity` (`o60`), `none` holds it still. Each platform keeps its own by default, a spring on iOS and the ripple on Android, and Android keeps the ripple on top of any effect unless `ripple` is off.

  `IconButton` on iOS sits in a 44pt tap target with the icon centred, as Android's sits in Material's 48dp, so a row of them spaces itself the same way on both. A disabled one is dimmed once, by SwiftUI, instead of twice.

### Patch Changes

- [#23](https://github.com/hzblj/kara-ui/pull/23) [`26f1651`](https://github.com/hzblj/kara-ui/commit/26f1651b6a8be9fc2d7af6bbe29bd2335605a717) Thanks [@hzblj](https://github.com/hzblj)! - `ScrollEdgeContainer` on iOS 27 blurs under the whole bar again. iOS 27 stopped counting the invisible button each bar sits on as a scroll edge element, so the blur stopped at the status bar or the navigation bar and content under the bar stayed sharp; a hidden text element now counts for it, and iOS 26 measures as before.

  `ScrollViewZPosition` (`@hzblj/kara-ui/swift-ui`) raises the React Native scroll view it sits in above its later siblings without reordering them, which Fabric's `zIndex` does. A large title anchored in an empty scroll view under the content stays visible on iOS 27, whose edge effect blurs only what lies under it.

## 0.9.0

### Minor Changes

- [#21](https://github.com/hzblj/kara-ui/pull/21) [`356c00f`](https://github.com/hzblj/kara-ui/commit/356c00f76eee8323c4eb65ed4cbcda121c3af627) Thanks [@hzblj](https://github.com/hzblj)! - `TextField`'s `error` takes a message: `error="A postcode has five digits."` shows it under the field (Material's supporting text beside its error icon on Android), so an error never rests on colour alone, which in dark mode Material draws a pale red. `error` alone still marks the field. kara's glyphs gain `error` for it.

  `Tabs` on iOS tint their icons: the selected one takes the accent and the rest the label colour. Expo Router tints an asset-catalog icon only when both states have an icon colour, so with the accent alone every icon kept its SVG's black, selected or not, in dark mode too.

  `Surface` on iOS sits on `surface.primary` unless told otherwise, as it does on Android; a plain one drew nothing behind its content. `Progress` with `circular` and a `value` is a ring that fills on iOS (a SwiftUI capacity `Gauge`), where a circular `ProgressView` ignored the value and spun.

## 0.8.0

### Minor Changes

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - Android gets glass and a scroll edge of its own.

  - `GlassView` is frosted glass on Android: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface (or its `tint`) and a light hairline, the blurred surfaces Android 16 gives its own system UI. It was an almost clear capsule that left its content unreadable over a photo. Below Android 12 the same colours are drawn near-opaque. kara-native's new `BackdropBlurView` (`/jetpack-compose`) does the blur (blurred, then saturated, as iOS lifts the colour under its materials): a plain view, no host, and an idle screen draws no frames.
  - `ScrollEdgeContainer` on Android behaves like a Material top app bar on scroll: the bars stay transparent at rest and fill with the scrolled container colour once content scrolls under the top one, the bottom one while there is more below. Its scroll view also takes the room between the bars now; before, it grew to its content's height, ran under the bottom bar and could not scroll.
  - New token `surface.secondary`, a step above `surface.primary`: Material's `surfaceContainer` on Android, `tertiarySystemGroupedBackgroundColor` on iOS.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - New `BlurView`: the system materials, by SwiftUI's names (`ultraThin`, `thin`, `regular`, `thick`, `ultraThick`).

  - iOS: UIKit's `system*Material` blur as a plain view (no SwiftUI host, cheap enough for a list cell), with `vibrancy` (`primary` to `quaternary`, `fill`, `separator`) to draw the content the way iOS draws its own on a material.
  - Android: what lies behind, blurred and saturated (Android 12+), under a Material tonal surface that rises from `surface` to `surfaceContainerHighest` as the material thickens; below Android 12 the surface alone.
  - `appearance` pins a material to light or dark whatever the app's; `borderRadius` shapes it and clips the content.

  kara-native adds `BlurView` (`/swift-ui`).

### Patch Changes

- [#15](https://github.com/hzblj/kara-ui/pull/15) [`bf2e70c`](https://github.com/hzblj/kara-ui/commit/bf2e70c8ae5a07fffb6433bd2ce08e371695ec50) Thanks [@hzblj](https://github.com/hzblj)! - `ScrollEdgeContainer` on iOS keeps its scroll view and top bar when a screen showing it is opened again. Its bars switched SwiftUI's structure once they had measured themselves, so SwiftUI rebuilt the hosted React Native views; on a remount it made several containers for each and dropped the last, which took the view with it.

## 0.7.0

### Minor Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SegmentedControl` draws its selected segment in the accent on both platforms. iOS renders kara's own `UISegmentedControl` (`SegmentedControl` in `@hzblj/kara-native/swift-ui`), whose pill, labels and track take colours; the system control tints only the pill, SwiftUI's segmented picker not even that. Android colours Material's segmented buttons, equal widths. `onChange` now fires for a new segment only on Android too.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SwipeActions` works on Android, and takes its buttons as data. **Breaking:** `SwipeActions.Actions` and its `Button` children are gone. Pass `leading` and/or `trailing`, each a list of `{icon, label, onPress, destructive?, tint?}`, and `allowsFullSwipe` on the row:

  ```tsx
  <SwipeActions
    trailing={[
      { destructive: true, icon: "trash", label: "Delete", onPress: remove },
    ]}
  >
    <ListItem title="Order [#1024](https://github.com/hzblj/kara-ui/issues/1024)" />
  </SwipeActions>
  ```

  iOS renders SwiftUI's `swipeActions`, each action its icon on a button in its tint (round, with the label under it, on iOS 26). Android, where Compose has no swipe actions, gets kara's own `SwipeActionsBox` (`@hzblj/kara-native/jetpack-compose`): the row slides on an anchored drag, and filled icon buttons with their labels show in the strip it leaves. One row is open at a time on both, and a tap on an open row closes it.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `Tooltip` is controlled on Android too: `visible` shows Material's plain tooltip, centred above the anchor and kept inside the window, and `onDismiss` reports a touch outside it or the anchor scrolling away. It used to open only on a long press and hide itself, ignoring both props, and Material's own placement let it run off the edge of the screen. Nothing opens it on a long press any more; wire one to `visible` if you want it.

  `TooltipBox` (`@hzblj/kara-native/jetpack-compose`) takes `plain` for that style, and hides when `isPresented` turns false.

### Patch Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `NavigationBar` and `Sheet.Header` on iOS 26 centre their title and glass items. UIKit's bar is 54 pt with its 44 pt row of items at the top, so centring the bar left the row 5 pt high; it is the row that is centred now.

## 0.6.0

### Minor Changes

- [#10](https://github.com/hzblj/kara-ui/pull/10) [`62b7131`](https://github.com/hzblj/kara-ui/commit/62b713143bd03872ecdd89ca8de42d98fe589617) Thanks [@hzblj](https://github.com/hzblj)! - Haptics: kara's own, native on both platforms, named for what happened.

  - One function per haptic (`haptics.success()`, `haptics.selection()`, …) and `haptics.play(name)` for a name that arrives as data. `selection`, `tick`, `toggleOn`/`toggleOff`, `success`/`warning`/`error`, `longPress`, `dragStart`, `thresholdActivate`/`thresholdDeactivate`, `keyPress`, and the impacts `soft`, `light`, `medium`, `rigid`, `heavy` (`intensity` scales them on iOS). Synchronous, nothing to await.
  - iOS: UIKit's feedback generators, kept alive and warmed up with `haptics.prepare` (`Pressable` prepares its haptic on press-in). Android: the system's own haptic feedback (`View.performHapticFeedback`), with Android 14's constants falling back to older ones, never a raw vibration. Both follow the user's system setting.
  - `useHapticFeedback(trigger, haptic)` plays on every change of a value, never on mount; a function of the previous and next value picks a haptic per change.
  - `haptics.setEnabled(false)` silences every kara haptic, the components' own included.
  - `Pressable`'s `haptic` takes a name as well as `true` (a `light` impact); `Chip` plays `selection`.
  - On Android, where Compose's Material controls play nothing: `Switch` plays `toggleOn`/`toggleOff`, a stepped `Slider` ticks at every stop, `SegmentedControl` plays `selection`. iOS keeps its native controls' own feedback.
  - `Slider`: `step` is the increment on Android too. It was passed to Compose as the number of stops.
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

- [#6](https://github.com/hzblj/kara-ui/pull/6) [`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b) Thanks [@hzblj](https://github.com/hzblj)! - `GlassView` always shows its glass. Glass mounted under a React Native view at opacity 0 (the first row of a Legend List opened from cache, content fading in from 0) used to stay without it, because React Native changes opacity past UIKit, which then kept the subtree marked as hidden. React Native opacity changes that cross UIKit's hidden threshold now go through `UIView.alpha`, so this holds for every Liquid Glass view in the app. The glass is also set at once instead of polling until every ancestor is fully opaque, and its content no longer waits for it.

## 0.4.0

## 0.3.0

### Minor Changes

- [`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28) Thanks [@hzblj](https://github.com/hzblj)! - Native sheets with a native header. `Sheet` is now a TrueSheet (`@lodev09/react-native-true-sheet`, a new peer dependency) with `<Sheet.Header>`, `<Sheet.ScrollView>`, `useSheetScroll`, detents, a footer and a ref (`present`/`dismiss`/`resize`). `<Sheet.Header>` is a real navigation bar with a centred, leading or large title that hands over to the bar as it scrolls away, items on either side, and on iOS 26 the content scrolls under it with the soft edge effect. It is React Native tier now: no host, native atoms inside go in an `Island`. `fitToContents` is replaced by `detents` (`['auto']` by default).

  `NavigationBar` takes `leadingItems` / `trailingItems` instead of `onBack` / `onClose`: `back`, `close` or an app `icon`, on either side and in any order; on iOS 26 neighbours share a glass capsule unless an item is `separated`. Also `titleAlignment`, `titleVisible`, `inverted` and an iOS `search` field. On Android it is now Material's native top app bar.

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

## 0.2.0

### Minor Changes

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Icons are now fully native and the app's own: `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]` turns every SVG in the folder into an iOS asset-catalog template image and an Android vector drawable at prebuild (`x.ios.svg` / `x.android.svg` for per-platform glyphs), and writes `kara-icons.d.ts` so `name` only accepts icons that exist; `npx kara-icons` does the same for CI. `Icon` draws them in a host, the new `RnIcon` anywhere, and `Tabs` passes them as `xcasset` / `drawable`. The built-in SF Symbol / Material icon names and the `@expo/vector-icons` peer dependency are gone.

- [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f) Thanks [@hzblj](https://github.com/hzblj)! - Leaner, reusable-only components. `Countdown` is gone, with its native views. There is one `ContextMenu` now: the native module's long-press menu on React Native content, with a custom preview on iOS (formerly `RnContextMenu`); the `@expo/ui`-based one is removed.

  Android, reworked to look and behave like Material while honouring the theme:

  - `Button`, `Badge` and `Alert` render their labels; `Button` keeps Material's own shape (no iOS ring), takes `tint` as its fill with a label that contrasts with it, and draws `glass` as Material's outlined button.
  - `Alert` is built from `AlertDialog`'s slots instead of drawing empty: title, message, the confirm action (destructive when asked) and Cancel.
  - `Menu` presents its actions in Material's dropdown popup, with their icons, instead of laying them out over the trigger.
  - `Picker` is a themed Material exposed dropdown the width of its container.
  - `Switch`, `Checkbox` and `RadioGroup` are tinted with the accent, and with a label are full-width rows that toggle as a whole; `Form` sections span the form's width.
  - `Surface` pads its content instead of its background, and stacks its children in a column.
  - `Fab` shows its icon, `DatePicker` opens its dialog on a tap (in the accent colour) instead of on mount, `GlassView`'s fallback is the translucent glass fill, and the `List` docs spell out that it needs a bounded height.

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides (colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android). Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.
