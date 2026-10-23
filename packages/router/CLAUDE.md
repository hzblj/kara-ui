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

**kara's tokens over `@hzblj/expo-zoom-transition`** (`../expo-zoom-transition`, its own repo): `zoom-transition.tsx`
maps a radius token to the Android corners, a duration token to the transform and a colour token to the scrim, and
passes everything else through; `ZOOM_TRANSITION_PARAM`, `useZoomTransitionParam`, `useZoomTransitionSourceId` and
`withZoomTransition` are re-exported as they are. Everything native, and every platform rule (the enabler renders
first and unconditionally, the Android pop is played from `beforeRemove`), is the package's: change it there, release
it, then bump it here.

**`zoom-transition.types.ts` stays a full copy of the contract, in tokens.** The website builds the props tables from
this repo's `*.types.ts` and cannot follow an import into the package, so a prop added there is added here too, with
its JSDoc. Keep the shape: shared props at the top, platform props under `ios` / `android`.

**One file, no platform split**: the package resolves the platforms. The story documents the contract only: a push
cannot happen inside Storybook; the live demo is the example's catalogue page (`apps/example/src/catalog/zoom/`).
