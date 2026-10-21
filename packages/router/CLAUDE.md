# @hzblj/kara-router

The Expo Router pieces, kept apart so `@hzblj/kara-ui`'s main entry never imports `expo-router`: `Tabs` (native tabs
over Expo Router's `NativeTabs`, SF Symbols on iOS and Material icons on Android from the components' icon map) and
`navigationTheme(theme)` for expo-router's `ThemeProvider`. Reached by consumers as `@hzblj/kara-ui/router`.

**Nothing here may come from the standalone `@react-navigation/*` packages.** Expo Router vendors its own fork of them,
so a navigator built against the npm copies registers into a context tree that never exists and throws "Couldn't
register the navigator" the moment the layout mounts.

**`Tabs.Screen` renders nothing itself.** The navigator collects its tabs by matching the child element type exactly,
so a component that merely renders a trigger is invisible to it.
