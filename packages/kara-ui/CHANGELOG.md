# @hzblj/kara-ui

## 0.9.0

### Minor Changes

- [#21](https://github.com/hzblj/kara-ui/pull/21) [`356c00f`](https://github.com/hzblj/kara-ui/commit/356c00f76eee8323c4eb65ed4cbcda121c3af627) Thanks [@hzblj](https://github.com/hzblj)! - `TextField`'s `error` takes a message: `error="A postcode has five digits."` shows it under the field — Material's supporting text beside its error icon on Android — so an error never rests on colour alone, which in dark mode Material draws a pale red. `error` alone still marks the field. kara's glyphs gain `error` for it.

  `Tabs` on iOS tint their icons: the selected one takes the accent and the rest the label colour. Expo Router tints an asset-catalog icon only when both states have an icon colour, so with the accent alone every icon kept its SVG's black, selected or not, in dark mode too.

  `Surface` on iOS sits on `surface.primary` unless told otherwise, as it does on Android; a plain one drew nothing behind its content. `Progress` with `circular` and a `value` is a ring that fills on iOS — a SwiftUI capacity `Gauge` — where a circular `ProgressView` ignored the value and spun.

### Patch Changes

- Updated dependencies [[`356c00f`](https://github.com/hzblj/kara-ui/commit/356c00f76eee8323c4eb65ed4cbcda121c3af627)]:
  - @hzblj/kara-components@0.9.0
  - @hzblj/kara-native@0.9.0
  - @hzblj/kara-router@0.9.0
  - @hzblj/kara-theme@0.9.0
  - @hzblj/kara-sx@0.9.0
  - @hzblj/kara-expo-plugin@0.9.0

## 0.8.0

### Minor Changes

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `ActivityIndicator` plays Material 3's expressive `LoadingIndicator` on Android — its shapes morph as it turns — in a host of its own, so it still renders anywhere; iOS keeps UIKit's spinner. It takes the design system's props now, not React Native's: `color` is a token (`fill.accent.primary` by default), `size` is `small` or `large`.

  `Collapsible` on Android spans its parent, the chevron at the far end, and its row is never shorter than Material's 48dp touch target; the chevron sat right after the label. `Pager`'s dots on Android are centred under the pages.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - Android gets glass and a scroll edge of its own.

  - `GlassView` is frosted glass on Android: what lies behind the capsule, blurred (Android 12+), under a translucent tonal surface — or its `tint` — and a light hairline, the blurred surfaces Android 16 gives its own system UI. It was an almost clear capsule that left its content unreadable over a photo. Below Android 12 the same colours are drawn near-opaque. kara-native's new `BackdropBlurView` (`/jetpack-compose`) does the blur — blurred, then saturated, as iOS lifts the colour under its materials: a plain view, no host, and an idle screen draws no frames.
  - `ScrollEdgeContainer` on Android behaves like a Material top app bar on scroll: the bars stay transparent at rest and fill with the scrolled container colour once content scrolls under the top one, the bottom one while there is more below. Its scroll view also takes the room between the bars now — it grew to its content's height, ran under the bottom bar and could not scroll.
  - New token `surface.secondary`: Material's `surfaceContainer` on Android, `tertiarySystemGroupedBackgroundColor` on iOS — a step above `surface.primary`.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `Pressable` on Android presses the Material way: a ripple over the content — the pressed state layer — clipped to the pressable's shape, and nothing scales. iOS keeps its spring to 96%. Give the `Pressable` the `borderRadius` of what it wraps (`full` around a `GlassView`) and the ripple follows it.

  `Collapsible` on Android expands down from its row with a fade, and its chevron turns toward the content; it grew from a corner and the chevron jumped.

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - New `BlurView`: the system materials, by SwiftUI's names — `ultraThin`, `thin`, `regular`, `thick`, `ultraThick`.

  - iOS: UIKit's `system*Material` blur as a plain view — no SwiftUI host, cheap enough for a list cell — with `vibrancy` (`primary` to `quaternary`, `fill`, `separator`) to draw the content the way iOS draws its own on a material.
  - Android: what lies behind, blurred and saturated (Android 12+), under a Material tonal surface that rises from `surface` to `surfaceContainerHighest` as the material thickens; below Android 12 the surface alone.
  - `appearance` pins a material to light or dark whatever the app's; `borderRadius` shapes it and clips the content.

  kara-native adds `BlurView` (`/swift-ui`).

- [#17](https://github.com/hzblj/kara-ui/pull/17) [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29) Thanks [@hzblj](https://github.com/hzblj)! - `sx` reaches the components that still took raw styles or none:

  - `Text` takes the native `sx` surface — padding, a background, a frame (`wide` puts the text on the side `align` names) and the `ios` bucket. `ios.contentTransition` with the new `ios.animation` rolls a number to its next value, and `ios.monospacedDigit` keeps it from shifting what follows. `Stepper` on iOS is built on it.
  - `RnText` takes `Box`'s `sx` props for its own box — margins, `flex`, padding — all but `align`, which still aligns its lines.
  - `Image` is `sx(expo-image)`, the way `Box` is `sx(View)`: `w`, `h`, `aspectRatio`, `borderRadius`, `position`… instead of a `style` object. Its props are exported as `ImageProps`.
  - `Island` takes the same `sx` props for where it sits in React Native layout: `<Island h={240} matchContents={false}>`. An explicit `style` still wins.
  - `Skeleton` is sized with the `sx` names, `h` and `w` (was `height` and `width`), and `w` takes a percentage: `<Skeleton h={12} w="60%" />` for a line that ends early.
  - The React Native surface gains `inset`, all four edges at once: `position="absolute" inset={0}` fills the parent.

### Patch Changes

- [#15](https://github.com/hzblj/kara-ui/pull/15) [`bf2e70c`](https://github.com/hzblj/kara-ui/commit/bf2e70c8ae5a07fffb6433bd2ce08e371695ec50) Thanks [@hzblj](https://github.com/hzblj)! - `ScrollEdgeContainer` on iOS keeps its scroll view and top bar when a screen showing it is opened again. Its bars switched SwiftUI's structure once they had measured themselves, so SwiftUI rebuilt the hosted React Native views; on a remount it made several containers for each and dropped the last, which took the view with it.

- Updated dependencies [[`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29), [`bf2e70c`](https://github.com/hzblj/kara-ui/commit/bf2e70c8ae5a07fffb6433bd2ce08e371695ec50), [`4c7eaa0`](https://github.com/hzblj/kara-ui/commit/4c7eaa021ee4a4b0475e1dfb420fa5803c21ba29)]:
  - @hzblj/kara-components@0.8.0
  - @hzblj/kara-native@0.8.0
  - @hzblj/kara-theme@0.8.0
  - @hzblj/kara-sx@0.8.0
  - @hzblj/kara-router@0.8.0
  - @hzblj/kara-expo-plugin@0.8.0

## 0.7.0

### Minor Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SwipeActions` works on Android, and takes its buttons as data. **Breaking:** `SwipeActions.Actions` and its `Button` children are gone — pass `leading` and/or `trailing`, each a list of `{icon, label, onPress, destructive?, tint?}`, and `allowsFullSwipe` on the row:

  ```tsx
  <SwipeActions
    trailing={[
      { destructive: true, icon: "trash", label: "Delete", onPress: remove },
    ]}
  >
    <ListItem title="Order [#1024](https://github.com/hzblj/kara-ui/issues/1024)" />
  </SwipeActions>
  ```

  iOS renders SwiftUI's `swipeActions`, each action its icon on a button in its tint — round, with the label under it, on iOS 26. Android, where Compose has no swipe actions, gets kara's own `SwipeActionsBox` (`@hzblj/kara-native/jetpack-compose`): the row slides on an anchored drag, and filled icon buttons with their labels show in the strip it leaves. One row is open at a time on both, and a tap on an open row closes it.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - **Breaking:** `FlashList` is gone, and `@shopify/flash-list` is no longer a peer dependency. kara's list for React Native content is `RnFlatList` (and `RnSectionList`): React Native's own virtualized lists, whose cells stay in normal flow, so rows that host native views keep them in place — a recycling list moves its cells, which an `@expo/ui` host does not survive. An app that wants FlashList for plain data rows installs and imports it itself.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `Tooltip` is controlled on Android too: `visible` shows Material's plain tooltip, centred above the anchor and kept inside the window, and `onDismiss` reports a touch outside it or the anchor scrolling away. It used to open only on a long press and hide itself, ignoring both props — and Material's own placement let it run off the edge of the screen. Nothing opens it on a long press any more; wire one to `visible` if you want it.

  `TooltipBox` (`@hzblj/kara-native/jetpack-compose`) takes `plain` for that style, and hides when `isPresented` turns false.

### Patch Changes

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `ActionSheet` on Android renders its rows in a host of its own — they were Compose views straight inside the sheet, which has none, and threw "must be rendered inside a Host". The rows are Material's bottom-sheet menu now: full width, with each action's `icon` before its label.

  `SearchBar` on iOS centres its text beside the magnifier. The type scale's line height sat the text at the bottom of a taller line in a single-line `UITextField`.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - Android layout fixes:

  - `Screen` keeps its content clear of the status bar when nothing sits above it, as a SwiftUI host keeps to the safe area — it drew under it. Under a navigation bar nothing changes; the background still runs to the edges.
  - `Form` is inset from its container on every side, with section titles and footers indented to the cards' content, like SwiftUI's grouped form — in a `Screen` its cards ran into the screen's edges.
  - A disabled or read-only `Checkbox` or `Switch` keeps Material's 48dp touch target, so it lines up with the enabled ones instead of shifting toward the edge.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `DatePicker` on iOS sizes itself to its value. Its host took the width it was given and laid the compact field out against the far edge of it — past its container's, in a row. The calendar is in the accent now.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `Alert` and `ActionSheet` appear on iOS. Both hung their SwiftUI presentation on an `EmptyView` — `@expo/ui` uses one when there is no trigger, and SwiftUI never presents from it — so `visible` changed nothing. Each now has a trigger that takes no room, and `ActionSheet` passes its buttons through the dialog's `Actions` slot.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `RnFlatList` and `RnSectionList` keep rows that host native views on Android. React Native's Android default, `removeClippedSubviews`, detached a host measured at zero height before its first layout, and the row stayed empty; it is off unless you turn it on.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `SegmentedControl` draws its selected segment in the accent on both platforms. iOS renders kara's own `UISegmentedControl` (`SegmentedControl` in `@hzblj/kara-native/swift-ui`), whose pill, labels and track take colours — the system control tints only the pill, SwiftUI's segmented picker not even that. Android colours Material's segmented buttons, equal widths. `onChange` now fires for a new segment only on Android too.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `NavigationBar` and `Sheet.Header` on iOS 26 centre their title and glass items. UIKit's bar is 54 pt with its 44 pt row of items at the top, so centring the bar left the row 5 pt high; it is the row that is centred now.

- [#12](https://github.com/hzblj/kara-ui/pull/12) [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490) Thanks [@hzblj](https://github.com/hzblj)! - `sx` costs less on every render. The style cache, the responsive flattening and the key behind `useSxModifiers` used to go through every key the surface has, about seventy for a `Box`, even when a component set two or three of them. Now they go through only the props that are set, and the theme's part of the cache key is worked out once per theme rather than on every render. Without a JIT, as on Hermes, an `sx()` view resolves its style 2.5–5× faster and a native atom 2–4.5× faster.

- Updated dependencies [[`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490), [`2a6595f`](https://github.com/hzblj/kara-ui/commit/2a6595f79176a3450610d361a02001aac9530490)]:
  - @hzblj/kara-components@0.7.0
  - @hzblj/kara-native@0.7.0
  - @hzblj/kara-sx@0.7.0
  - @hzblj/kara-router@0.7.0
  - @hzblj/kara-theme@0.7.0
  - @hzblj/kara-expo-plugin@0.7.0

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

### Patch Changes

- Updated dependencies [[`62b7131`](https://github.com/hzblj/kara-ui/commit/62b713143bd03872ecdd89ca8de42d98fe589617)]:
  - @hzblj/kara-native@0.6.0
  - @hzblj/kara-components@0.6.0
  - @hzblj/kara-router@0.6.0
  - @hzblj/kara-theme@0.6.0
  - @hzblj/kara-sx@0.6.0
  - @hzblj/kara-expo-plugin@0.6.0

## 0.5.0

### Minor Changes

- [#8](https://github.com/hzblj/kara-ui/pull/8) [`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8) Thanks [@hzblj](https://github.com/hzblj)! - `ZoomTransition`: a push that grows out of the photo it was opened from and shrinks back into it.

  - iOS 18: UIKit's zoom transition, with the interactive dismissal (swipe down, edge swipe, pinch) gated on the scroll views under the finger. Below iOS 18 the push stays a slide. Android: Material's container transform, both ways.
  - Three pieces from `@hzblj/kara-ui/router`, tied by one identifier: `ZoomTransition.Source` on the list, `ZoomTransition.Enabler` and `ZoomTransition.Target` on the pushed screen; `useZoomTransitionSourceId`, `ZOOM_TRANSITION_PARAM`, `useZoomTransitionParam` and `withZoomTransition` (an Android fade under the transform) around them.
  - Settings both platforms honour sit at the top (`scrim`); the rest is typed apart under `ios` (`dismissGesture`, `blur`, the target's `fit`) and `android` (`duration`, `easing`, `fade`, `path`, corner radii, the target's `fit` and `flex`).
  - `ContextMenu`: with a `ZoomTransition.Source` in the trigger, a tap on the iOS preview zooms the preview's photo straight into the pushed screen. `previewTransition` (`zoom`, `pop`, `dismiss`) picks how the preview leaves.
  - `DurationSize`, the keys of `duration`.

### Patch Changes

- Updated dependencies [[`3b0a6fb`](https://github.com/hzblj/kara-ui/commit/3b0a6fbc49559720023fece2b5c6189ad4d88bc8)]:
  - @hzblj/kara-router@0.5.0
  - @hzblj/kara-native@0.5.0
  - @hzblj/kara-components@0.5.0
  - @hzblj/kara-theme@0.5.0
  - @hzblj/kara-sx@0.5.0
  - @hzblj/kara-expo-plugin@0.5.0

## 0.4.1

### Patch Changes

- [#6](https://github.com/hzblj/kara-ui/pull/6) [`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b) Thanks [@hzblj](https://github.com/hzblj)! - `GlassView` always shows its glass. Glass mounted under a React Native view at opacity 0 — the first row of a Legend List opened from cache, content fading in from 0 — used to stay without it, because React Native changes opacity past UIKit, which then kept the subtree marked as hidden. React Native opacity changes that cross UIKit's hidden threshold now go through `UIView.alpha`, so this holds for every Liquid Glass view in the app. The glass is also set at once instead of polling until every ancestor is fully opaque, and its content no longer waits for it.

- Updated dependencies [[`d14bdd3`](https://github.com/hzblj/kara-ui/commit/d14bdd37bede9fef80f4d3af4621ea5d60b2b16b)]:
  - @hzblj/kara-native@0.4.1
  - @hzblj/kara-theme@0.4.1
  - @hzblj/kara-sx@0.4.1
  - @hzblj/kara-components@0.4.1
  - @hzblj/kara-router@0.4.1
  - @hzblj/kara-expo-plugin@0.4.1

## 0.4.0

### Minor Changes

- [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03) Thanks [@hzblj](https://github.com/hzblj)! - Android polish, and a new `RnListItem`.

  - `ContextMenu` on Android is a proper long-press menu: a ripple and the long-press haptic, then a Material dropdown where the finger is, with the actions' icons and the trigger highlighted while it is open. The ripple and highlight stay inside rounded corners.
  - A pressable `HStack`, `VStack` or `ZStack` ripples across its whole shape, padding included; `ListItem` and `LabeledContent` take `px` so a row in a card can carry the card's padding inside its press area.
  - `ListItem` keeps its chevron when the subtitle fills the line.
  - `Tabs` take the theme's colours: on Android the bar, active indicator, icons, labels and ripple come from tokens instead of the wallpaper scheme; on iOS the selected item takes the accent.
  - New `RnListItem`: `ListItem`'s row in the React Native tier, cheap to mount by the dozen, with a full-row ripple on Android and a highlight on iOS.

### Patch Changes

- [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03) Thanks [@hzblj](https://github.com/hzblj)! - `npx kara-icons ./assets/icons` works without `--out` — it used to skip the folder and print its usage.

- Updated dependencies [[`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03), [`6e7903a`](https://github.com/hzblj/kara-ui/commit/6e7903afa3d3442e04a48a6e24399f9f03559a03)]:
  - @hzblj/kara-components@0.4.0
  - @hzblj/kara-router@0.4.0
  - @hzblj/kara-expo-plugin@0.4.0
  - @hzblj/kara-theme@0.4.0
  - @hzblj/kara-sx@0.4.0
  - @hzblj/kara-native@0.4.0

## 0.3.0

### Minor Changes

- [`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28) Thanks [@hzblj](https://github.com/hzblj)! - Native sheets with a native header. `Sheet` is now a TrueSheet (`@lodev09/react-native-true-sheet`, a new peer dependency) with `<Sheet.Header>` — a real navigation bar with a centred, leading or large title that hands over to the bar as it scrolls away, items on either side, and on iOS 26 the content scrolls under it with the soft edge effect — plus `<Sheet.ScrollView>`, `useSheetScroll`, detents, a footer and a ref (`present`/`dismiss`/`resize`). It is React Native tier now: no host, native atoms inside go in an `Island`. `fitToContents` is replaced by `detents` (`['auto']` by default).

  `NavigationBar` takes `leadingItems` / `trailingItems` instead of `onBack` / `onClose`: `back`, `close` or an app `icon`, on either side and in any order; on iOS 26 neighbours share a glass capsule unless an item is `separated`. Also `titleAlignment`, `titleVisible`, `inverted` and an iOS `search` field. On Android it is now Material's native top app bar.

### Patch Changes

- Updated dependencies [[`f84ffd5`](https://github.com/hzblj/kara-ui/commit/f84ffd52954a5e7052541c8682787137de205a28)]:
  - @hzblj/kara-components@0.3.0
  - @hzblj/kara-native@0.3.0
  - @hzblj/kara-router@0.3.0
  - @hzblj/kara-theme@0.3.0
  - @hzblj/kara-sx@0.3.0
  - @hzblj/kara-expo-plugin@0.3.0

## 0.2.1

### Patch Changes

- [`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268) Thanks [@hzblj](https://github.com/hzblj)! - Installable again: 0.2.0 was published with `workspace:^` ranges between the kara packages, which no package manager outside this repository resolves. The packages now go out through Yarn, which writes the real version ranges.

- Updated dependencies [[`be5be81`](https://github.com/hzblj/kara-ui/commit/be5be81a3764dfbd199c3c3cf90deadc6e53d268)]:
  - @hzblj/kara-components@0.2.1
  - @hzblj/kara-native@0.2.1
  - @hzblj/kara-router@0.2.1
  - @hzblj/kara-expo-plugin@0.2.1
  - @hzblj/kara-sx@0.2.1
  - @hzblj/kara-theme@0.2.1

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

### Patch Changes

- Updated dependencies [[`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f), [`c30bef6`](https://github.com/hzblj/kara-ui/commit/c30bef6be2639deb6d385ad209d1a2799b5b656f)]:
  - @hzblj/kara-components@0.2.0
  - @hzblj/kara-native@0.2.0
  - @hzblj/kara-router@0.2.0
  - @hzblj/kara-expo-plugin@0.2.0
  - @hzblj/kara-theme@0.2.0
  - @hzblj/kara-sx@0.2.0

## 0.1.0

### Minor Changes

- [`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1) Thanks [@hzblj](https://github.com/hzblj)! - First release of the kara-ui design system: theme and tokens, the `sx` engine, atoms, molecules, organisms and `Screen`, native tabs (`@hzblj/kara-ui/router`), the KaraUI native module (Liquid Glass, scroll edge effect, native countdown, context menu with preview, rich tooltip, FAB menu), and `KaraProvider` with theme overrides — colours, the app's own fonts, the Material seed, and Material You dynamic colour on Android. Text uses the platform's face by default. Install `@hzblj/kara-ui`; the scoped packages are its building blocks.

### Patch Changes

- Updated dependencies [[`f919c7b`](https://github.com/hzblj/kara-ui/commit/f919c7b06f3798cebd58eef1581076bf1ee61cd1)]:
  - @hzblj/kara-theme@0.1.0
  - @hzblj/kara-sx@0.1.0
  - @hzblj/kara-native@0.1.0
  - @hzblj/kara-components@0.1.0
  - @hzblj/kara-router@0.1.0
  - @hzblj/kara-expo-plugin@0.1.0
