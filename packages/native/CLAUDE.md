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
| `android/src/main/java/expo/modules/kara/ui/` | `KaraUIModule.kt` plus one package per component (`fab`, `icon`, `modifiers`, `ripple`, `tooltip`, `topappbar`). |
| `src/swift-ui/`, `src/jetpack-compose/` | `requireKaraView` bindings and typed wrappers per view, the modifiers' JS side. The `/swift-ui` and `/jetpack-compose` entries. |
| `ios/Views/Icon/`, `android/.../icon/` | `IconView` (UIKit `UIImageView` / Android `ImageView`, the React Native tier) and Android's `DrawableIconView` (Compose `Icon`, inside a host): an app icon by asset/resource name, or an SF Symbol. |
| `src/icons.ts` | `iconResourceName(name)` → `kara_icon_<name>`, the name the config plugin gives an app icon on both platforms. Mirrors the plugin's own copy, which runs in Node. |
| `glyphs.json`, `scripts/generate-glyphs.mjs`, `src/glyphs.ts` | The few glyphs kara's components draw: SF Symbol + Material Symbol per name. `yarn glyphs:generate` writes `android/src/main/res/drawable/kara_glyph_*.xml` and `src/glyphs.ts` (both committed) from `@material-symbols/svg-400`; `THIRD_PARTY_NOTICES.md` carries the Apache 2.0 notice. |
| `ios/Views/NavigationBar/`, `android/.../topappbar/` | The bar under `NavigationBar` and `Sheet.Header`: a standalone `UINavigationBar` (items as records, grouped into iOS 26 glass capsules unless `separated`, a centred or leading title view, an optional `UISearchBar`) and Material's `TopAppBar` (`navigationIcon` / `actions` slots). Both report presses as `onItemPress` with placement and index; the handlers stay in JS. |
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

**The module name `KaraUI` is also the Swift module name.** An app whose Xcode target is named `KaraUI` would collide;
that is why the example is called "Kara Example".
