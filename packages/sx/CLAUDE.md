# @hzblj/kara-sx

The styling engine. One token-typed `sx` surface resolved into **three targets**: SwiftUI modifiers,
Compose modifiers, or a React Native style. This is why `@hzblj/kara-components` call sites never branch on
platform and never write a raw value.

## Map

| File | Job |
| --- | --- |
| `src/sx.types.ts` | `SxCore` (keys all three targets honour with the same meaning) plus the `ios` / `android` buckets for what only one side can express. |
| `src/view-sx.types.ts` | `ViewSx` — the React Native-only surface (flexbox, per-corner radii, margins). |
| `src/responsive-sx.ts` | Which keys accept `{base, sm, md, lg, xl}`. Layout only — colours, radii, shadows and the buckets stay scalar. |
| `src/responsive.types.ts` | The `ResponsiveOf` mapping. |
| `src/flatten-sx.ts` | Collapses responsive values to the active breakpoint, mobile-first — deliberately upstream of the caches so cache keys stay flat. |
| `src/sx-to-modifiers.ios.ts` / `.android.ts` | `sx` → native modifier array. |
| `src/use-sx-modifiers.ios.ts` / `.android.ts` | The memoised hook the components' native atoms call. |
| `src/sx-to-style.ts`, `view-sx-to-style.ts` | `sx` → React Native `ViewStyle`, plus the view cache. |
| `src/use-sx.ts` | `useSx` and `useSplitSx` — for components that own their `style` prop. |
| `src/with-sx.tsx` | `sx(Component)` — wraps any style-taking component, memoised. |
| `src/resolve-cache.ts`, `sx-key.ts`, `value-key.ts`, `present-keys.ts`, `sx-keys.ts` | The cache: stable style objects shared across components, keyed by flattened values + theme variant. Keys are built from the props a component set, not by walking the key lists. |
| `src/sx-padding.ts` | The padding cascade (`pt` beats `py` beats `p`). |
| `src/accessibility.types.ts` | `AccessibilityProps` (`accessibilityLabel`, `accessibilityHint`, `accessibilityRole`, `accessibilityValue`, `accessibilityHidden`, `accessible`), `AccessibilityRole`, and `splitAccessibility`, which takes them out of a props spread before it becomes `sx`. |
| `src/use-accessibility-modifiers.ios.ts` / `.android.ts` | The same props as SwiftUI accessibility modifiers, or as one `karaAccessibility` Compose modifier (`@hzblj/kara-native`). `pressable` makes a view a `button` unless told otherwise. |
| `src/accessibility-props.ts` | `accessibilityProps`: the same props as React Native's own, for a React Native tier component. |

## Rules

**Adding an `sx` key means touching more than the type.** Keys are mirrored into
`SX_CORE_KEY_RECORD` / `CORNER_KEY_RECORD` with `satisfies`, so the compiler catches a key added to
the type but missing from the list — a gap there would leak the prop into the wrapped component's
own props. Then wire it into every resolver that can express it.

**Only layout keys may become responsive.** `flattenSx` identifies a responsive value by the
presence of `base`, which works only because no responsive-capable key takes an object. Admitting
`scale` or a platform bucket would make that test ambiguous.

**Cache correctness before micro-optimisation.** Anything that widens what a key can hold must also
be representable by `valueKey`, or two different values will share one cache entry.

**The cache key is the variant *and* the palette resolver.** Almost every colour resolves through
the theme's platform resolver, which on Android closes over a Material scheme generated at runtime and
can change while the variant stays put. `resolve-cache.ts` therefore keys on `theme.resolver`'s identity
too — a `WeakMap` id, which the provider memoises per variant.

**A resolved colour is a `ColorValue`, not a `string`.** On iOS a system token becomes an opaque
`PlatformColor`. The modifier and style paths take that as-is; the few `@expo/ui` props still declared
`string` upstream go through `theme.colorString`.

**Accessibility rides beside `sx`, not in it.** The style caches key on style keys only, so the accessibility props are
split off (`splitAccessibility`) and turned into modifiers of their own, which the component places: last on iOS
(`accessibilityElement` wraps what precedes it), after the `clickable` and before the padding on Android (a label that
replaces the children's clears the semantics inside it, and the click must stay outside). A pressable role (`button`,
`link`) reads the children as one element on both platforms.

The `.ios`/`.android` files have no fallback — `tsconfig.ios.json` and `tsconfig.android.json` are
both checked by `yarn typecheck`.
