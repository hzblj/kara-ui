# @hzblj/kara-native

The `KaraUI` Expo native module — Swift in `ios/`, Kotlin in `android/` — and its raw JS bindings. Pure platform
layer: it depends on nothing else in the repo, and `@hzblj/kara-components` wraps each piece into one cross-platform
component. Autolinked into any app that installs `@hzblj/kara-ui` (a transitive dependency is enough).

## Map

| Path | What it is |
| --- | --- |
| `ios/KaraUIModule.swift` | Only composes the module: functions, `OnCreate` (modifier registration), one `<View>.definition()` per view. |
| `ios/Views/<Component>/` | `<Name>View.swift`, its records/helpers and `<Name>View+Definition.swift` (events and props). |
| `ios/Modifiers/` | SwiftUI modifiers registered into `@expo/ui`'s registry: `scaledFont`, `underline`, `counterBadge`, all in `ModifierRegistration` (once per process). |
| `android/.../modifiers/` | Compose modifiers registered into `@expo/ui`'s registry: `underline`, and `karaAccessibility` (content and state descriptions, a role or heading, the click action's label, merging or clearing descendants), which `@hzblj/kara-sx` maps the accessibility props onto. `@expo/ui`'s own `semantics` carries only a content description. Both in `ModifierRegistration` (once per process). |
| `ios/Fabric/` | Runtime fixes to React Native's own component views, installed from `OnCreate`: `OpacityVisibilitySync`. |
| `android/src/main/java/expo/modules/kara/ui/` | `KaraUIModule.kt` plus one package per component (`blur`, `colorpicker`, `fab`, `icon`, `modifiers`, `ripple`, `swipe`, `tooltip`, `topappbar`). |
| `src/swift-ui/`, `src/jetpack-compose/` | `requireKaraView` bindings and typed wrappers per view, the modifiers' JS side. The `/swift-ui` and `/jetpack-compose` entries. |
| `ios/Views/Icon/`, `android/.../icon/` | iOS `IconView` (an SF Symbol in a `UIImageView`, the React Native tier of a glyph) and Android's `DrawableIconView` (Compose `Icon` over a drawable by name, inside a host: an app icon or a glyph). The app's icons outside a host, and Android glyphs, are `@hzblj/expo-native-icons`' `NativeIconView`; their names come from its `iconResourceName`. |
| `glyphs.json`, `scripts/generate-glyphs.mjs`, `src/glyphs.ts` | The few glyphs kara's components draw: SF Symbol + Material Symbol per name. `yarn glyphs:generate` writes `android/src/main/res/drawable/kara_glyph_*.xml` and `src/glyphs.ts` (both committed) from `@material-symbols/svg-400`; `THIRD_PARTY_NOTICES.md` carries the Apache 2.0 notice. |
| `ios/Views/NavigationBar/`, `android/.../topappbar/` | The bar under `NavigationBar` and `Sheet.Header`: a standalone `UINavigationBar` (items as records, grouped into iOS 26 glass capsules unless `separated`, a centred or leading title view, an optional `UISearchBar`) and Material's `TopAppBar` (`navigationIcon` / `actions` slots). Both report presses as `onItemPress` with placement and index; the handlers stay in JS. |
| `ios/Views/ScrollViewZPosition/` | `ScrollViewZPositionView`: zero-size, placed inside a React Native scroll view. While in a window it sets `layer.zPosition` (`layerZPosition`) on the scroll view's outer view (`RCTScrollViewComponentView`), and 0 again when it leaves, so a recycled scroll view never keeps it. The scroll view draws above its later siblings but keeps its place among the subviews, which UIKit's large title (`subviews[0]`) and hit testing go by; Fabric's `zIndex` reorders them. iOS 27's edge effect blurs only what is under it, so a large title in an empty anchor scroll view under the content needs this to stay visible. Ported from Footshop's platform-ui. |
| `ios/Views/SegmentedControl/` | `SegmentedControlView`: a `UISegmentedControl` with the pill, both label colours, the track and the font set from outside — the system control tints only the pill. Plain `UIView` (no host); it reports UIKit's height to its shadow node (`setShadowNodeSize`, width left to layout). Controlled by `selectedValue`: a tap moves the pill at once and goes back after 0.5 s unless the prop follows. Android needs no counterpart — `@expo/ui`'s segmented buttons take colours. |
| `android/.../blur/` | `BackdropBlurView`, behind `GlassView` and `BlurView` (`@hzblj/kara-components`) on Android: a plain view (no host) holding React Native children. Before each frame it records what lies *behind* it into a `RenderNode` — from the root down, each ancestor's background and the siblings drawn before its branch, never its own branch (its display list holds the node) — and draws it through a `RenderEffect` blur under a tint and a hairline, clipped to its outline. Re-recording the node needs no invalidate, so an idle screen draws no frames. API 31+; below, the tint near-opaque. |
| `android/.../text/` | `AnimatedTextView`: Compose `Text` over spans, each easing to its next colour (`animateColorAsState`, keyed by position) on a spring or a bézier tween, with kara's typography, `modifiers` applied through `@expo/ui`'s `ModifierRegistry`. What `Text` (`@hzblj/kara-components`) draws on Android with `animate`, since `@expo/ui`'s text animates no span, and with `monospacedDigit` (`fontFeatureSettings` `tnum`), since it sets no font features; without an `animation` a colour switches. Internal: no component of its own. |
| `android/.../colorpicker/` | `ColorWellView`: the colour picker Compose lacks, in the iOS picker's shape. A well with a rainbow ring opens a Material bottom sheet with three tabs (a 12 × 10 grid of swatches, a spectrum with the hues top to bottom, tints to the left and shades to the right, as iOS draws it, RGB sliders), an opacity slider with `supportsOpacity`, and the colour with its hex at the foot. Its own HSVA state leads while the sheet is open, so a grey keeps its hue; every change goes out as `onValueChange` (`#RRGGBB`, or `#RRGGBBAA` with opacity). No library: those on offer draw a wheel, and the maintained one needs a newer Kotlin than Expo builds with. |
| `android/.../swipe/` | `SwipeActionsBoxView`: the swipe actions Compose lacks, ported from Footshop's. `AnchoredDraggableState` with three rests (closed, leading, trailing), each edge's slot measured and anchored at its width; the actions draw only in the strip the row has vacated and fade in; a tap on an open row closes it. Controlled by `openEdge`, reported by `onOpenChange`. |
| `src/availability.ts` | `isLiquidGlassAvailable` / `isScrollEdgeEffectAvailable` — one native call, cached; `false` on Android. |
| `src/require-view.ts` | `requireKaraView` — lazy, so a view one platform lacks fails only when rendered there, never on import. |

## Rules

**Never name a native prop after a React Native style key** (`width`, `backgroundColor`, `shadowColor`…): Fabric
reads it as layout or style. Prefix it (`bubbleWidth`).

**Adding a view:** iOS — a folder in `ios/Views/` with the view and `+Definition.swift`, one line in
`KaraUIModule.swift`. Android — a package with an `ExpoComposeView` subclass registered by class in
`KaraUIModule.kt` (the functional registration shares one `viewType` with `@expo/ui` and drops events). JS — a folder
in `src/<platform>/` exported from its `index.ts`. Then the cross-platform component in `@hzblj/kara-components`.

**Process-wide setup happens once per process.** Every React runtime gets its own `AppContext` and runs `OnCreate`,
and two can be alive or initialising at the same time (a dev client opened by its deep link while it launches, a
reload during startup, brownfield hosts). `@expo/ui`'s modifier registries are maps with no lock on both platforms:
concurrent registration on iOS crashed in `Dictionary._Variant.setValue`. A new modifier is registered inside
`ModifierRegistration` (iOS: its `static let`; Android: its `SYNCHRONIZED` lazy), never straight from `OnCreate`, and
never unregistered in `OnDestroy` (another runtime may still draw it). A swizzle or any other global gets the same
treatment (`OpacityVisibilitySync`).

**Native changes need a native rebuild** of the app (`yarn prebuild` in the repo, then run); a new view also needs a
pod install / Gradle sync. Swift/Kotlin are not type-checked by `yarn typecheck` — build the example to verify.

**Resources by name are looked up in the app.** `UIImage(named:)` / `getIdentifier(…, "drawable", packageName)` find
the plugin's `native_icon_*` (`@hzblj/expo-native-icons`) in the app's own catalog and resources, and Gradle merges the module's `kara_glyph_*`
drawables into the same place. An iOS asset catalog shipped by this pod would not build (two `Assets.car`), which is
why app icons are generated into the app and iOS glyphs are SF Symbols.

**React Native opacity reaches UIKit through `OpacityVisibilitySync`.** Fabric writes `opacity` to `layer.opacity`,
past `alpha`, so a subtree mounted under a view at opacity 0 (Legend List containers before their first layout,
fades from 0) stayed hidden for UIKit, and Liquid Glass in it never rendered — the first row of a list opened from
cache lost its glass. The module wraps `RCTViewComponentView`'s `updateProps:oldProps:`, `invalidateLayer` and
`prepareForRecycle` and replays a change across UIKit's 0.01 threshold through `alpha`. That is why `GlassView` sets
its effect at once and never waits for its ancestors. Check the three selectors after a React Native upgrade. To
debug missing glass, compare `isInHiddenAncestor` in the effect view's `_ivarDescription` (lldb) with a working one.

**Haptics are not here.** They live in `@hzblj/expo-rich-haptics`, a package of its own in its own repo
(`hzblj/expo-rich-haptics`), which `@hzblj/kara-components` depends on. Change them there and release them there.

**The module name `KaraUI` is also the Swift module name.** An app whose Xcode target is named `KaraUI` would collide;
that is why the example is called "Kara Example".

## Zoom transition

**It lives in `@hzblj/expo-zoom-transition`** (`../expo-zoom-transition`, its own repo and pod `ExpoZoomTransition`);
this package depends on it so the pod is always there. One piece stays here: **a tapped context menu preview zooms.**
With a zoom source inside the trigger, `ContextMenuView` (`import ExpoZoomTransition`, `s.dependency` in the podspec)
renders the preview to an image, finds where UIKit shows it (a `_UIPortalView` whose `sourceView` is the preview
controller's view) and lays a copy of its photo there as a transient source (`ZoomTransitionRegistry.shared`,
`ZoomTransitionTransientSource`), under a frozen snapshot of the window, then fires `onPreviewPress` at once. The
enabler hands that copy to UIKit and fades the snapshot over 0.3 s; the copy goes when the push completes, or after 3 s
without one. `previewTransition` picks `zoom`, `pop` or `dismiss`. Those registry calls are the package's public API:
bump it together with this file.
