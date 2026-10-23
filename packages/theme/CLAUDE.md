# @hzblj/kara-theme

The design tokens and the theme. Every value `@hzblj/kara-sx` can resolve originates here — this is
the package that makes raw numbers and hex strings fail to type-check elsewhere.

The defaults live here; an app changes them through `ThemeConfig` (`KaraProvider theme={...}`), never by
editing the library: colour overrides merged over the palette, its own typeface, the Android seed.

Almost nothing here is a colour we picked. Most entries are references the platform resolves — UIKit
semantic colours on iOS, Material 3 roles on Android — and the few we do own are written so the platform
still chooses between their light and dark values.

Tokens are named by what a colour is *for*, never by who owns it: whether an entry is the platform's is
the value's business, and reading `content.accent` should not require knowing.

## Map

| Path | What it is |
| --- | --- |
| `src/primitives/` | The scales: `colors`, `spacing` (`s0`…`s96`), `radii`, `shadows`, `opacity`, `zIndex`, `typography` (`textStyles`, `FontsConfig`, `resolveTypography`, `fontFace`), `duration` (transitions.dev's scale, named by what the motion does: `micro` 80 ms to `verySlow` 500 ms, plus `stagger` and `none`), `easing` (`smoothOut`, `inOut`, `out`, `linear` as bézier points), `springs` (SwiftUI's set: `interactive`, `smooth`, `snappy`, `bouncy`, a perceptual duration and a bounce each; `springPhysics(name)` is the mass, stiffness and damping every platform runs), `breakpoints`, `color-source`. |
| `src/primitives/color-source.ts` | The three kinds an entry can be: `native({ios?, android?, light?, dark?})`, `adaptive({light, dark, highContrast*})`, or a plain hex. Plus `MAX_CONTRAST_SURFACE` / `MAX_CONTRAST_CONTENT` and `defaultMaterialSeed`. |
| `src/primitives/shadows.ts` | `shadowGeometry` as a nested scale; `ShadowName` is derived from it as a dotted path (`btn.accent`, `card`), and `ShadowTreeOf` gives the palette the same shape so the two cannot drift. |
| `src/primitives/breakpoints.ts` | `BREAKPOINT_ORDER` (sm→xl) and `breakpointFor(width)`; `Breakpoint` derives from the array so the scale and the cascade order cannot drift. |
| `src/theme.types.ts` | `Theme`, `ColorToken`, `DimmableToken` — all derived from the palette's own shape via `typeof`, none written by hand. |
| `src/theme-config.ts` | `ThemeConfig` (what an app may override), `PaletteOverrides`, `defineTheme`, and `mergePalette` — overrides replace whole colours, never merge into one. |
| `src/themes/palette.ts` | The palette — the source of truth; `Palette` is `typeof palette`. One file, because no entry in it chooses between appearances — the platform does, and where it cannot the resolver does from the active variant. |
| `src/themes/rgba-palette.ts` | Mirrors every dimmable colour into `theme.rgba.*(opacitySize)`, each a call to `theme.color('<token>:oNN')`; UIKit semantic references are skipped, in the mirror and in `AlphaGroup` alike. |
| `src/themes/dynamic-accent.ts` | `withDynamicAccent` — what `dynamicColor` does to the palette: the accent tokens' Android side handed to Material roles. |
| `src/hooks/`, `src/provider/` | `BreakpointProvider` / `useBreakpoint`, `useAppearanceOverride`, `ReducedMotionProvider` / `useReducedMotion`, and `KaraProvider` — breakpoint + reduced motion + theme + appearance override, the one root an app mounts. |
| `src/system/` | `isDynamicColorSupported`, and `usePaletteResolver(variant, seedColor)` / `paletteResolver`, split `.ios`/`.android` with a `contract.check.ts`. The only place a platform colour API is touched: `PlatformColor` and `DynamicColorIOS` on one side, the Material scheme on the other. |
| `src/theme-context.tsx` | `AppThemeProvider` joins the merged palette, the resolved typography and the seed to the platform resolver and the active variant; `useAppTheme` (defaults to the light default theme without a provider, built lazily). Apps mount it through `KaraProvider`. |
| `src/utils/resolve-color.ts` | The resolver behind `theme.color` and `theme.colorString`, plus `resolvePaletteColor` and `withOpacity`. |
| `src/utils/resolve-shadow.ts` | `ShadowName` → its geometry and colours, by walking the dotted name. |

## Rules

**Resolve through the theme: `theme.color('surface.base')`.** That is the one public way — the free
`resolveColor` is not exported, so there is no second one. `theme.colorString(...)` is the same call
narrowed for the `@expo/ui` props still declared `string` upstream.

**Three kinds of entry, and the choice is the value — not the token name.**

`native({ios, android})` is the platform's colour on both sides. `native({ios, light, dark})` is the
platform's where it has a name for this and ours where it does not — the asymmetric case, e.g. iOS has
`systemGreenColor` and Material has no green role. `adaptive({light, dark})` is ours on both platforms,
still switched by the platform on iOS. A plain hex is for a colour identical in both appearances.

The two platform names are independent and optional, so a designer hands a token to iOS, to Android, to
both, or to neither. Where both are named the type refuses light/dark values — nothing would read them,
and dead values that *look* like they define the colour are worse than none.

Swapping a token's kind is one edit, in the palette: the constructor an entry is written with *is* its
declaration, and `ColorToken`, `DimmableToken` and `theme.rgba` all follow through `typeof`. No call site
changes, because no call site ever knew.

**A token with companions groups them; one without stands alone.** `fill.accent.base` sits beside
`disabled` and `primary`; `content.accent` has no companion yet, so there is no `.base` under it — the
group arrives with the companion, not in advance of it.

**Add a token to the scale, not to a call site.** A new spacing step goes in `primitives/`, a new colour
in the palette; consumers then get it for free through `sx`.

**To take a colour back from the platform, swap the kind.** `native(...)` → `adaptive({light, dark})` in
the palette: the token keeps its native switch on iOS and gains its `:oNN` suffix and its `theme.rgba`
entry, because now we know the hexes. No `brand.*` family, because ownership is not a semantic category.

**An app overrides values, never names.** `ThemeConfig.colors` has the palette's shape with every colour
optional; the token set stays the library's, so every `sx` prop, component and story keeps type-checking.
A token that can be dimmed only accepts `adaptive(...)` or a hex as its override — handing it to the
platform would leave `:oNN` with no alpha to multiply — so `DimmableToken` stays sound under any config.
An override replaces the whole entry (`native` → hex swaps the reference out, it does not sit beside it).

**The `sx` caches key on the palette's identity as well as the resolver's.** A config change produces a
new merged palette, which is what invalidates styles resolved from the old one. That is also why the
config must be referentially stable — `defineTheme` at module scope, or memoised.

**This does not redefine the platform's colour.** `native({ios: 'labelColor'})` *uses* the UIKit semantic;
it does not change what it is. A true override is possible on iOS only — both bridges try
`UIColor(named:)` first, so an asset-catalog entry named `labelColor` wins app-wide — and that is what the
package's config plugin (`iosSemanticColors`) writes. Android has no equivalent: `@expo/ui` computes its
Material scheme from the wallpaper, the seed or the M3 baseline, none of which an app can reach into.

**A UIKit semantic colour cannot be dimmed; everything else can.** `surface.base:o50` is a compile error,
because on iOS it resolves to an opaque `PlatformColor` with no alpha channel to scale. This is also the
platform's own advice: `secondaryLabel` *is* a pre-dimmed `label`, so name the quieter colour instead. A
hex, an `adaptive(...)` pair (dimmed branch by branch) and a `native({android, light, dark})` reference
(Android hands Material roles back as hexes) all dim. `native()` keeps its source's literal shape in the
type, which is how `DimmableToken` tells `native({ios: …})` from `native({android: …, light, dark})`.

**`dynamicColor` is Material You for the accent.** On Android 12+ the scheme comes from the wallpaper
(seed `undefined`), and `themes/dynamic-accent.ts` hands the accent tokens to Material roles —
`primary`, `onPrimary`, `primaryContainer`, and a neutral `surfaceContainerHighest` for disabled —
*after* the app's overrides, keeping each entry's iOS side as it was. Below Android 12 the same roles
grow from `materialSeed`. The Android resolver re-reads the wallpaper when the app returns to the
foreground and rebuilds only if it moved. `materialSeed: null` is the halfway house: wallpaper scheme,
our own accent.

**Content on a fill names the fill.** `content.on.accent` sits on the accent fill, `content.on.destructive`
on `fill.destructive.primary` — Material's `error`, which turns light in dark mode and so needs
`onError` on Android rather than white.

**The platform's face by default; the app's own by config.** No family is named in `textStyles` — a
variant carries a size, a line height, a `weight` and a `role` (`text` | `display`). `resolveTypography`
turns that into `theme.typography.<variant>`: with no `fonts`, a numeric `fontWeight` on the platform's
face (SF Pro / Roboto); with `fonts`, the face registered for that role and weight (falling back to the
role's `regular`, and `display` to `text`), and no `fontWeight`, because the face *is* the weight.
Components read `theme.typography`, never `textStyles` — the latter is the unresolved scale.

**A text variant sets its size *and* the axis it grows on.** `scalesWith` names the platform text style a
variant scales with — it does not set the size, ours stays exact; it picks the *rate*. An app face scales
through `Font.custom(_:size:relativeTo:)`; the platform face through the package's own `scaledFont` SwiftUI
modifier (`UIFontMetrics` against the environment's Dynamic Type size), because `@expo/ui`'s `font()` can
give the system face an exact size *or* Dynamic Type, not both. Android needs nothing: Compose reads `sp`,
and the OS scales it.

`MAX_DYNAMIC_TYPE_SIZE` caps growth on the SwiftUI hosts and `MAX_FONT_SCALE` — derived from it, not
hand-picked — caps the React Native tier, so the two stop in the same place. Capping rather than opting out
is Apple's guidance: a capped layout still answers the setting.

**One spring is one curve everywhere.** `springPhysics` is the only place a spring token becomes physics, and every path
reads it: Reanimated's `withSpring` and layout transitions, the CSS `linear()` an `animate` samples, SwiftUI's
`.spring(response:dampingFraction:)` and Compose's `spring(dampingRatio, stiffness)`. Never hand Reanimated a perceptual
`duration` for one: its own formula would draw a different curve from the other three.

**Motion is picked by usage, and reduced by the user.** A component takes a duration by what the motion does
(arriving `fast`, leaving `quick`, a touch `micro`), never by the number it used to have, and `smoothOut` unless it is a
swap (`inOut`), a small fade (`out`) or a loop (`linear`). `useReducedMotion` is the device's Reduce Motion / Remove
animations setting, followed live through `AccessibilityInfo`, unless `KaraProvider reduceMotion` pins it; with it on,
nothing slides, scales, turns or loops, and what needs a transition fades.

**Palette hexes must be `#rrggbb` or `#rrggbbaa`** — the only forms both native sides parse.

**iOS semantic names carry their `Color` suffix** (`labelColor`, not `label`). React Native looks the
name up in a table keyed that way while `expo-modules-core` appends the suffix, so this is the only
spelling both bridges accept — and both are in play.

**`theme.materialSeed` has two consumers that must agree**: the Android palette resolver, and the
`seedColor` that `Screen`/`Island` hand to `<Host>`. A Material control colours itself from the host's
scheme, so two seeds would put its controls and our surfaces on different tones. Both read it off the
theme — never `defaultMaterialSeed` directly — so an app's seed (or `null`, for the wallpaper) reaches both.

Depends on nothing else in the repo. Consumed by `@hzblj/kara-sx`, `@hzblj/kara-components` and `@hzblj/kara-router`;
consumers reach it through `@hzblj/kara-ui`.
