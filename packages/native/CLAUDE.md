# @hzblj/kara-native

The `KaraUI` Expo native module — Swift in `ios/`, Kotlin in `android/` — and its raw JS bindings. Pure platform
layer: it depends on nothing else in the repo, and `@hzblj/kara-components` wraps each piece into one cross-platform
component. Autolinked into any app that installs `@hzblj/kara-ui` (a transitive dependency is enough).

## Map

| Path | What it is |
| --- | --- |
| `ios/KaraUIModule.swift` | Only composes the module: functions, `OnCreate` (modifier registration), one `<View>.definition()` per view. |
| `ios/Views/<Component>/` | `<Name>View.swift`, its records/helpers and `<Name>View+Definition.swift` (events and props). |
| `ios/Modifiers/` | SwiftUI modifiers registered into `@expo/ui`'s registry: `scaledFont`, `underline`, `counterBadge`. |
| `ios/Fabric/` | Runtime fixes to React Native's own component views, installed from `OnCreate`: `OpacityVisibilitySync`. |
| `android/src/main/java/expo/modules/kara/ui/` | `KaraUIModule.kt` plus one package per component (`blur`, `fab`, `haptics`, `icon`, `modifiers`, `ripple`, `swipe`, `tooltip`, `topappbar`, `zoomtransition`). |
| `src/swift-ui/`, `src/jetpack-compose/` | `requireKaraView` bindings and typed wrappers per view, the modifiers' JS side. The `/swift-ui` and `/jetpack-compose` entries. |
| `ios/Views/Icon/`, `android/.../icon/` | `IconView` (UIKit `UIImageView` / Android `ImageView`, the React Native tier) and Android's `DrawableIconView` (Compose `Icon`, inside a host): an app icon by asset/resource name, or an SF Symbol. |
| `src/icons.ts` | `iconResourceName(name)` → `kara_icon_<name>`, the name the config plugin gives an app icon on both platforms. Mirrors the plugin's own copy, which runs in Node. |
| `glyphs.json`, `scripts/generate-glyphs.mjs`, `src/glyphs.ts` | The few glyphs kara's components draw: SF Symbol + Material Symbol per name. `yarn glyphs:generate` writes `android/src/main/res/drawable/kara_glyph_*.xml` and `src/glyphs.ts` (both committed) from `@material-symbols/svg-400`; `THIRD_PARTY_NOTICES.md` carries the Apache 2.0 notice. |
| `ios/Views/NavigationBar/`, `android/.../topappbar/` | The bar under `NavigationBar` and `Sheet.Header`: a standalone `UINavigationBar` (items as records, grouped into iOS 26 glass capsules unless `separated`, a centred or leading title view, an optional `UISearchBar`) and Material's `TopAppBar` (`navigationIcon` / `actions` slots). Both report presses as `onItemPress` with placement and index; the handlers stay in JS. |
| `ios/Views/SegmentedControl/` | `SegmentedControlView`: a `UISegmentedControl` with the pill, both label colours, the track and the font set from outside — the system control tints only the pill. Plain `UIView` (no host); it reports UIKit's height to its shadow node (`setShadowNodeSize`, width left to layout). Controlled by `selectedValue`: a tap moves the pill at once and goes back after 0.5 s unless the prop follows. Android needs no counterpart — `@expo/ui`'s segmented buttons take colours. |
| `android/.../blur/` | `BackdropBlurView`, behind `GlassView` and `BlurView` (`@hzblj/kara-components`) on Android: a plain view (no host) holding React Native children. Before each frame it records what lies *behind* it into a `RenderNode` — from the root down, each ancestor's background and the siblings drawn before its branch, never its own branch (its display list holds the node) — and draws it through a `RenderEffect` blur under a tint and a hairline, clipped to its outline. Re-recording the node needs no invalidate, so an idle screen draws no frames. API 31+; below, the tint near-opaque. |
| `android/.../swipe/` | `SwipeActionsBoxView`: the swipe actions Compose lacks, ported from Footshop's. `AnchoredDraggableState` with three rests (closed, leading, trailing), each edge's slot measured and anchored at its width; the actions draw only in the strip the row has vacated and fade in; a tap on an open row closes it. Controlled by `openEdge`, reported by `onOpenChange`. |
| `ios/Views/ZoomTransition/`, `android/.../zoomtransition/` | The zoom push behind `ZoomTransition` (`@hzblj/kara-router`): iOS 18's `preferredTransition = .zoom`, Material's `MaterialContainerTransform` on Android. Source, target and enabler views tied by an identifier through one registry of weak views; `reverseZoomTransition` (Android) plays the way back. See "Zoom transition" below. |
| `ios/Haptics/`, `android/.../haptics/`, `src/haptics.ts` | `playHaptic` / `prepareHaptic`: synchronous module functions that hop to the main thread. Each `Haptic` name maps to one of UIKit's feedback generators, and to a chain of `HapticFeedbackConstants` on Android. `HAPTICS` lists the names. |
| `src/availability.ts` | `isLiquidGlassAvailable` / `isScrollEdgeEffectAvailable` — one native call, cached; `false` on Android. |
| `src/require-view.ts` | `requireKaraView` — lazy, so a view one platform lacks fails only when rendered there, never on import. |

## Rules

**Never name a native prop after a React Native style key** (`width`, `backgroundColor`, `shadowColor`…): Fabric
reads it as layout or style. Prefix it (`bubbleWidth`).

**Adding a view:** iOS — a folder in `ios/Views/` with the view and `+Definition.swift`, one line in
`KaraUIModule.swift`. Android — a package with an `ExpoComposeView` subclass registered by class in
`KaraUIModule.kt` (the functional registration shares one `viewType` with `@expo/ui` and drops events). JS — a folder
in `src/<platform>/` exported from its `index.ts`. Then the cross-platform component in `@hzblj/kara-components`.

**Native changes need a native rebuild** of the app (`yarn prebuild` in the repo, then run); a new view also needs a
pod install / Gradle sync. Swift/Kotlin are not type-checked by `yarn typecheck` — build the example to verify.

**Resources by name are looked up in the app.** `UIImage(named:)` / `getIdentifier(…, "drawable", packageName)` find
the plugin's `kara_icon_*` in the app's own catalog and resources, and Gradle merges the module's `kara_glyph_*`
drawables into the same place. An iOS asset catalog shipped by this pod would not build (two `Assets.car`), which is
why app icons are generated into the app and iOS glyphs are SF Symbols.

**React Native opacity reaches UIKit through `OpacityVisibilitySync`.** Fabric writes `opacity` to `layer.opacity`,
past `alpha`, so a subtree mounted under a view at opacity 0 (Legend List containers before their first layout,
fades from 0) stayed hidden for UIKit, and Liquid Glass in it never rendered — the first row of a list opened from
cache lost its glass. The module wraps `RCTViewComponentView`'s `updateProps:oldProps:`, `invalidateLayer` and
`prepareForRecycle` and replays a change across UIKit's 0.01 threshold through `alpha`. That is why `GlassView` sets
its effect at once and never waits for its ancestors. Check the three selectors after a React Native upgrade. To
debug missing glass, compare `isInHiddenAncestor` in the effect view's `_ivarDescription` (lldb) with a working one.

**Haptics never touch `Vibrator`.** Android plays `View.performHapticFeedback` on the current activity's decor view;
each name is a chain of constants, newest first — Android 14's say what happened (`TOGGLE_ON`, `SEGMENT_TICK`…), the
older ones stand in where the OS lacks one or the device answers `false`. A vibrator pattern would feel the same on
every phone and ignore the user's touch-feedback setting. iOS uses UIKit's feedback generators, not Core Haptics, for
the same reason: they follow the System Haptics setting. A new name goes into all three — the Swift enum, the Kotlin
enum and `HAPTICS` — or the native side rejects it.

**The module name `KaraUI` is also the Swift module name.** An app whose Xcode target is named `KaraUI` would collide;
that is why the example is called "Kara Example".

## Zoom transition

**Adapted from expo-router on iOS — keep the notice.** The iOS split and the aspect-ratio alignment come from
expo-router's `Link.AppleZoom` (MIT); `THIRD_PARTY_NOTICES.md` carries its licence. expo-router's own version only works
with its `Link`; ours sets the transition on whatever `UIViewController` owns the enabler, so it works with any
react-native-screens stack.

**iOS: three `display: contents` views.** `ZoomTransitionSourceView` and `ZoomTransitionTargetView` register their
single child (`mountChildComponentView`) in `ZoomTransitionRegistry`; `ZoomTransitionEnablerView` sets its controller's
`preferredTransition` from `didMoveToSuperview` in a `dispatch_async`, which react-native-screens' push (queued after
the mount transaction) runs after — so the enabler must be in the pushed screen's first commit. `disableForceFlatten`
(read by `ExpoViewShadowNode`) keeps them as native views without a layout box. Below iOS 18 nothing is set.
`alignmentRectProvider` matches the source's aspect ratio unless the target says otherwise; `dimmingColor` and
`dimmingBlur` go to `ZoomOptions`; changing them re-runs the setup, because UIKit copies the options.

**The interactive dismissal goes through `ZoomTransitionDismissGate`**, like Photos and the App Store: down only when
no scroll view under the finger can still scroll up, right only when no horizontal one can still scroll back, never up
or left. It only answers; it never restarts a recognizer.

**A tapped context menu preview zooms.** With a zoom source inside the trigger, `ContextMenuView` renders the preview to
an image, finds where UIKit shows it (a `_UIPortalView` whose `sourceView` is the preview controller's view) and lays a
copy of its photo there as a transient source, under a frozen snapshot of the window, then fires `onPreviewPress`
at once. The enabler hands that copy to UIKit and fades the snapshot over 0.3 s; the copy goes when the push completes,
or after 3 s without one. `previewTransition` picks `zoom`, `pop` or `dismiss`.

**Android: Material's container transform, not Compose shared elements** — `SharedTransitionLayout` animates within
one Compose tree, and every screen is its own fragment. The target hides itself on attach and transforms from the
registered source on its first pre-draw with a size; options come from the pushed screen's `ZoomTransitionEnablerView`
through the registry (it draws nothing). The pop is native and starts before JavaScript hears of it, so the router's
enabler calls `reverseZoomTransition` from `beforeRemove`: the target is drawn into a bitmap by hand (Fabric views are
never `isLaidOut`, `drawToBitmap` throws) and replayed as a ghost into the source once that is attached again. Both
ends of a fitted transform are `ZoomTransitionFrameView`s in `android:id/content` — the transform throws for an end
outside it. The source and target override `onLayout` with a no-op: `ExpoView` is a `LinearLayout` and the visibility
toggle re-laid the children out at 0,0. Never hide an end yourself before Material does, or the photo blinks for a
frame. Depends on `com.google.android.material:material` (react-native-screens already does).

**Known app-side issues, not fixable here.** On iOS 18+ a zoom pop finishes ~0.5 s after the duration UIKit declares
and react-native-screens 4.26 reports the dismissal only then, so a tap on the screen below is swallowed meanwhile
(react-native-screens#4711; the example carries it as a Yarn patch). In a dev client, `expo-dev-menu`'s three-finger
recogniser on the window joins every drag and the interactive dismissal pops without following the finger
(expo/expo#43338; patched in the example too). Release builds never have the second one.

