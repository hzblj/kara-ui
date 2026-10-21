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
| `android/src/main/java/expo/modules/kara/ui/` | `KaraUIModule.kt` plus one package per component (`countdown`, `fab`, `modifiers`, `ripple`, `tooltip`). |
| `src/swift-ui/`, `src/jetpack-compose/` | `requireKaraView` bindings and typed wrappers per view, the modifiers' JS side. The `/swift-ui` and `/jetpack-compose` entries. |
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

**The module name `KaraUI` is also the Swift module name.** An app whose Xcode target is named `KaraUI` would collide;
that is why the example is called "Kara Example".
