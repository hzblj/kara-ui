# @hzblj/kara-expo-plugin

The config plugin and its Node tooling, compiled for Node (`tsc` → `build/`, CommonJS). Re-exported by
`@hzblj/kara-ui/app.plugin.js`, so apps write `plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]`; the
`kara-icons` CLI ships as `@hzblj/kara-ui`'s bin. It does what the library cannot ship itself: the app's icons as
native assets, and the one colour override the theme cannot make from JS.

| File | What it does |
| --- | --- |
| `src/index.ts` | `withKaraUI` — the entry, run once per prebuild; re-exports the icon helpers for the native package's glyph script. |
| `src/icons.ts` | The icon generator: `readIconFolder` (platform variants `x.ios.svg` / `x.android.svg`), `parseSvgIcon` (only `<path>`, fails on anything else), `iosImageset` (template SVG, vector kept), `androidVectorDrawable` (moves a non-zero viewBox origin into a group), `iconTypes`, `iconResourceName`. |
| `src/with-icons.ts` | `withIcons`: image sets into the app's `Images.xcassets` and drawables into `res/drawable` at prebuild, stale `kara_icon_*` removed; `kara-icons.d.ts` rewritten whenever the config is read. |
| `src/cli.ts` | `kara-icons <source> [--out]` — the same validation and declaration without Expo, for CI. |
| `src/ios-semantic-colors.ts` | Writes a `<name>.colorset` per configured UIKit semantic colour into the generated asset catalog. Both bridges look a semantic name up with `UIColor(named:)` first, so the asset wins app-wide. |

**The semantic-name list duplicates the theme's `IosSemanticColor` on purpose** — this package compiles for Node on its
own, and the theme sits behind platform-split files only Metro resolves. A name added there and not here fails loudly at
prebuild, listing what is known.

**It cleans up after itself.** Every colour set it writes carries `"author": "@hzblj/kara-ui"`, and a run removes any
set with that stamp that is no longer configured. A set added by hand is never touched. There is no Android
counterpart — Material roles come from the wallpaper or the seed.

**Icon types are written while the config is evaluated, not in a mod.** Mods run only at prebuild; `expo start` reads
the config too, so writing `kara-icons.d.ts` from the plugin's body is what keeps names current the moment an SVG is
added. It writes only when the content changed. The native assets still need a prebuild.

**`iconResourceName` exists twice** — here, and in `@hzblj/kara-native` for the runtime. This package compiles for
Node alone and cannot import that one; the two must produce the same `kara_icon_<snake_name>`.

