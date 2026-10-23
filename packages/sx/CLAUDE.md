# @hzblj/kara-sx

The styling engine. One token-typed `sx` surface resolved into **three targets**: SwiftUI modifiers,
Compose modifiers, or a React Native style. This is why `@hzblj/kara-components` call sites never branch on
platform and never write a raw value. The React Native path also carries **motion**: `entering`, `exiting`,
`layout` and `animate`, resolved against the motion tokens and Reduce Motion, which make a view its Reanimated twin
by themselves.

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
| `src/use-sx.ts` | `useSx`, `useSplitSx` and `useSplitSxMotion` (one walk: `sx`, motion, rest) — for components that own their `style` prop. |
| `src/with-sx.tsx` | `sx(Component)` — wraps any style-taking component, memoised, and renders its Reanimated twin when the props ask for motion. |
| `src/motion.types.ts` | `MotionProps` (`entering`, `exiting`, `layout`, `animate`, `animated`), `MotionPreset` (`fade`, `fadeUp`, `fadeDown`, `scale`), `SxAnimate`, `AnimatableKey`. |
| `src/motion-presets.ts` | Presets → one shared worklet per config (`fadeUp` from `s12`, `scale` from 0.92; arriving `fast`, leaving `quick`, or on a `spring`), every one a fade with motion reduced; `layout: true` → `LinearTransition` on the `smooth` spring, a spring token or a timed config. |
| `src/animate-style.ts`, `src/static-color.ts` | `animate` → Reanimated's CSS transition properties, plus the iOS colour overlay: transitioned colours as values (`DynamicColorIOS` branch, or UIKit's hex via `resolveSystemColor` in `@hzblj/kara-native`). |
| `src/use-motion.ts` | `useMotion` (motion props → what the twin takes), `MOTION_KEYS`, and `useEntering` / `useExiting` / `useLayoutTransition` for a Reanimated view of the app's own. |
| `src/animated-twin.ts` | `animatedTwin` (one `createAnimatedComponent` per component, React Native's own reused), `isAnimatedStyle`, `useAnimatedLatch`, and the `markMotionComponent` registry `Stagger` reads. |
| `src/timing.ts`, `src/spring-curve.ts` | `timing(size, curve)` and `spring(name)` (`withTiming` / `withSpring` configs from the tokens, `ReduceMotion.Never`), `curve(name)`, and `springCurve(name)`: a spring token sampled into CSS `linear()` over its rest time, for `animate`. |
| `src/native-animate.ts` | `animate` for the native resolvers: `animateConfig`, `nativeAnimate` (config and covered keys after Reduce Motion) and `animatedValue`, the covered values hashed for SwiftUI's `.animation(_:value:)`. |
| `src/modifier-cache.ts` | Resolved modifier arrays shared across views with the same `sx` (frozen in development). |
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

**A view picks Reanimated when it mounts, and keeps it.** `useAnimatedLatch` reads the props of the first render
(any motion prop, even `false`, an animated `style`, `animatedProps`) and holds the answer: switching component type
later would remount the subtree and replay its `entering`. A view without motion renders the plain component, so the
engine costs a plain `Box` nothing. Twins are made once per component (`animatedTwin`), never per render.

**Presets resolve where `useReducedMotion` can be read.** That is why they are names and configs rather than builders:
the view resolves them, a fade when motion is reduced, and shares one worklet per config. Reanimated's own builders pass
through untouched; never mutate one (`.delay()` on an instance changes it for every holder).

**`animate` never transitions an opaque colour.** Reanimated's CSS transitions read colours as numbers and throw on
the UI thread for a `PlatformColor`. `animateStyle` puts the appearance's value in its place (`staticColor`: the
`DynamicColorIOS` branch, or UIKit's hex through `resolveSystemColor`) and drops a colour it cannot resolve from the
transition. The high-contrast branches are not followed. Text `color` is not animatable for the same reason.

**`animate` is native on native views.** `Sx.animate` (outside `SxCore`, so the style split never takes it) becomes
`.animation(curve, value:)` last in the iOS chain, the value being the covered keys hashed (a change of anything else
alone does not animate), and on Android one `graphicsLayer` of animated values in place of `offset`/`rotate`/`alpha`,
a `background` with an animation spec, and `animateContentSize` before the size modifiers when sizes are covered.
`smoothOut` is a no-bounce spring over its duration on both (`.smooth`), since `@expo/ui` takes no bézier; `useSxModifiers`
reads `useReducedMotion` and the modifier cache keys on it only for an `sx` with `animate`.

**Shorthands give way to what they stand for.** `row`, `center`, `fill`, `absolute` (`position: absolute` and
`inset: 0`) and `size` are written by `putShorthands` before the direct keys, so `flexDirection`, `align`, `flex`,
`position`, a side or `w`/`h` set beside them win. `wrap`, `grow` and `shrink` take a boolean through `directValue`.

**`animate` defaults to what the compositor moves.** Colours, `opacity` and the transform. Sizes and radii go through
layout on every frame, so they animate only when `keys` names them; with motion reduced only colours, `opacity` and
`blur` keep their transition.

**A resolved style carries only the keys that were set.** `viewSxToStyle` writes through `put` and the `DIRECT`
record (held to every view-only key with `satisfies`); an `undefined` key is walked by React Native on every mount and
can shadow one written earlier.

The `.ios`/`.android` files have no fallback — `tsconfig.ios.json` and `tsconfig.android.json` are
both checked by `yarn typecheck`.
