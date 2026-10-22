# @hzblj/kara-ui

The package consumers install — an umbrella with no code of its own. `src/` only re-exports the building blocks, and
its `package.json` is where the public entry points are defined.

| Entry | Re-exports |
| --- | --- |
| `@hzblj/kara-ui` | `@hzblj/kara-components`, `@hzblj/kara-sx`, `@hzblj/kara-theme` |
| `@hzblj/kara-ui/router` | `@hzblj/kara-router` — `Tabs`, `navigationTheme`, `ZoomTransition` |
| `@hzblj/kara-ui/swift-ui`, `/jetpack-compose` | `@hzblj/kara-native/swift-ui`, `/jetpack-compose` |
| `@hzblj/kara-ui/app.plugin.js` | `@hzblj/kara-expo-plugin` |

`README.md` here is the npm landing page, in zyplot's shape: badges, the banner (`https://www.kara.janblazej.dev/og.png`,
the site's own OG image for its home page, rewritten there from `/og/index` in `apps/website/next.config.ts`), what kara is, install, a minimal use, and links into the docs at
www.kara.janblazej.dev. Everything else — theme, icons, entry points, any component or feature — is documented on the site,
not here. The root `README.md` is the same page plus the packages table and the development commands; each building
block's README keeps the same header, says to install `@hzblj/kara-ui` instead, and links to its docs pages.

**Peers are the union of the building blocks' peers**, so a consumer installing only this package is told what to
install. `expo-router` is optional — only `/router` needs it.
