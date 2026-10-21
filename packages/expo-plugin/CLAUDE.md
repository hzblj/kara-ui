# @hzblj/kara-expo-plugin

The optional config plugin, compiled for Node (`tsc` → `build/`, CommonJS). Re-exported by `@hzblj/kara-ui/app.plugin.js`,
so apps write `plugins: [['@hzblj/kara-ui', {...}]]`. The library needs no native configuration to run; this exists for
the one override the theme cannot make from JS.

| File | What it does |
| --- | --- |
| `src/index.ts` | `withKaraUI` — the entry, run once per prebuild. |
| `src/ios-semantic-colors.ts` | Writes a `<name>.colorset` per configured UIKit semantic colour into the generated asset catalog. Both bridges look a semantic name up with `UIColor(named:)` first, so the asset wins app-wide. |

**The semantic-name list duplicates the theme's `IosSemanticColor` on purpose** — this package compiles for Node on its
own, and the theme sits behind platform-split files only Metro resolves. A name added there and not here fails loudly at
prebuild, listing what is known.

**It cleans up after itself.** Every colour set it writes carries `"author": "@hzblj/kara-ui"`, and a run removes any
set with that stamp that is no longer configured. A set added by hand is never touched. There is no Android
counterpart — Material roles come from the wallpaper or the seed.
