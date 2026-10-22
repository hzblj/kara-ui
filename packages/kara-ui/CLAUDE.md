# @hzblj/kara-ui

The package consumers install — an umbrella with no code of its own. `src/` only re-exports the building blocks, and
its `package.json` is where the public entry points are defined.

| Entry | Re-exports |
| --- | --- |
| `@hzblj/kara-ui` | `@hzblj/kara-components`, `@hzblj/kara-sx`, `@hzblj/kara-theme` |
| `@hzblj/kara-ui/router` | `@hzblj/kara-router` — `Tabs`, `navigationTheme`, `ZoomTransition` |
| `@hzblj/kara-ui/swift-ui`, `/jetpack-compose` | `@hzblj/kara-native/swift-ui`, `/jetpack-compose` |
| `@hzblj/kara-ui/app.plugin.js` | `@hzblj/kara-expo-plugin` |

`README.md` here is the npm landing page: a quick overview — what kara is, install, a minimal use, theme, icons, the
entry points. Nothing component- or feature-specific (sheets, transitions, haptics…): those are documented in the
example app and the packages' own docs. Keep it current only when one of those overview topics changes.

**Peers are the union of the building blocks' peers**, so a consumer installing only this package is told what to
install. `expo-router` is optional — only `/router` needs it.
