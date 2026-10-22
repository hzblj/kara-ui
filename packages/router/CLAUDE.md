# @hzblj/kara-router

The Expo Router pieces, kept apart so `@hzblj/kara-ui`'s main entry never imports `expo-router`: `Tabs` (native tabs
over Expo Router's `NativeTabs`, SF Symbols on iOS and Material icons on Android from the components' icon map),
`navigationTheme(theme)` for expo-router's `ThemeProvider`, and `ZoomTransition` (a push that grows out of the view it
was opened from). Reached by consumers as `@hzblj/kara-ui/router`.

**Nothing here may come from the standalone `@react-navigation/*` packages.** Expo Router vendors its own fork of them,
so a navigator built against the npm copies registers into a context tree that never exists and throws "Couldn't
register the navigator" the moment the layout mounts.

**`Tabs.Screen` renders nothing itself.** The navigator collects its tabs by matching the child element type exactly,
so a component that merely renders a trigger is invisible to it.

## ZoomTransition

**Three pieces, one identifier.** `Source` on the screen you push from, `Enabler` and `Target` on the pushed screen;
the identifier travels in the route params (`ZOOM_TRANSITION_PARAM`, read back with `useZoomTransitionParam`). The
native views (`@hzblj/kara-native`) look each other up through a registry, so neither screen references the other.
It lives here, not in components, because Android's enabler listens to the navigator: the pop is native, so the way
back is played from `beforeRemove` (`reverseZoomTransition`), while the target is still on screen.

**The enabler renders first and unconditionally.** On iOS it sets the screen's `preferredTransition` in a
`dispatch_async` from its first mount, which react-native-screens' push runs after. Rendered later — behind a loading
state — the push is already a slide. The target may come later, once data arrives.

**Shared props at the top, platform props under `ios` / `android`.** Every top-level prop works on both platforms
(`identifier`, `sourceIdentifier`, `scrim`); what only one can do is typed apart (`ZoomTransition*IosOptions`,
`ZoomTransition*AndroidOptions`) and ignored on the other. Keep it that way when adding a setting: a call site should
read which platform honours what. Defaults differ where the platforms do — the target's `fit` is `source` on iOS (no
stretching) and `target` on Android (the transform cross-fades, so it never stretches).

**`withZoomTransition` only touches Android.** A push carrying the param becomes a 300 ms fade, so the container
transform reads as the transition; the caller's options win. iOS needs nothing — UIKit replaces the push animation.

**Platform files, no fallback.** `zoom-transition.ios.tsx` / `.android.tsx` with `contract.check.ts`, like the
components. The story documents the contract only: a push cannot happen inside Storybook; the live demo is the
example's catalogue page (`apps/example/src/catalog/zoom/`).

