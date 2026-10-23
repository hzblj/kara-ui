---
"@hzblj/kara-sx": minor
"@hzblj/kara-components": minor
"@hzblj/kara-theme": minor
"@hzblj/kara-native": minor
"@hzblj/kara-ui": minor
---

Motion in the engine. Every `sx` view (`Box`, `Image`, anything wrapped with `sx()`), `RnText` and `Pressable` take `entering`, `exiting`, `layout` and `animate`, and become a Reanimated view by themselves when they do, or when their `style` comes from `useAnimatedStyle`. Without them a `Box` stays a plain `View` and costs nothing more. `ABox` is gone: use `Box`, and pass `animated` to one whose animated style only arrives after it mounts.

- `entering` and `exiting` take a preset named by the way the view moves (`fade`, `fadeUp`, `fadeDown`, `scale`), a preset adjusted (`{preset: 'scale', duration: 'slow', delay: 120}`, or with a `spring`), or Reanimated's own builder. Arriving takes `fast` and leaving `quick`; with motion reduced every preset fades.
- `animate` carries a change of the colours, `opacity` and the transform over to the new value on the UI thread, through Reanimated's CSS transitions: `animate`, `animate="slow"`, `animate="snappy"` or a config whose `keys` can add sizes, radii and blur. On iOS the UIKit colours a transition cannot read are resolved to the values UIKit draws (`resolveSystemColor` in `@hzblj/kara-native`, a native rebuild picks it up), so a selected row blends on both platforms.
- `layout` moves a view into its new place on the `smooth` spring, or a spring token, a timed config or Reanimated's own transition. It snaps with motion reduced.
- The native views take `animate` too: SwiftUI's `.animation(_:value:)` on iOS, animated `graphicsLayer` values, a `background` animation spec and `animateContentSize` on Android, on the same tokens.

New `Stagger`: a `Box` whose children arrive one after another, a step (`interval`, `stagger` by default) apart. Only the children that arrive together take turns, so the next page of a list staggers while an item added on its own appears at once. A `Box`, `RnText` or `Pressable` child takes the motion directly; any other is wrapped in a `Box`.

Springs as tokens: `springs` in `@hzblj/kara-theme` holds SwiftUI's set (`interactive`, `smooth`, `snappy`, `bouncy`), a perceptual duration and a bounce each, and `springPhysics` turns one into the physics every platform runs, so a token is one curve in Reanimated, in a CSS transition, in SwiftUI and in Compose. `spring(name)` and `timing(size, curve)` (moved here from the components) give `withSpring` and `withTiming` configs, and `useEntering`, `useExiting` and `useLayoutTransition` hand kara's presets to a Reanimated view of your own.

`Pressable` presses on springs, down on `interactive` and back on `smooth`, so a press let go halfway eases back instead of turning on the spot. `Snackbar`'s `entering` and `exiting` take the presets too.
