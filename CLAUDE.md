# kara-ui

Turborepo + Yarn 4 workspaces for **`@hzblj/kara-ui`**, a native-first design system for Expo whose components
render **real SwiftUI and Jetpack Compose views** through `@expo/ui`, styled by one token-typed `sx` engine. React
Native and Expo only — no web target in this phase.

Every package has its own `CLAUDE.md` — read that one before touching it.

## Map

| Path | Package | What lives there |
| --- | --- | --- |
| `packages/theme/` | `@hzblj/kara-theme` | Tokens, palette, typography, `ThemeConfig` overrides (`colors`, `fonts`, `materialSeed`, `dynamicColor`), the platform colour resolvers, `KaraProvider`, breakpoints. |
| `packages/sx/` | `@hzblj/kara-sx` | The `sx` engine: one surface → SwiftUI modifiers, Compose modifiers or a React Native style. |
| `packages/native/` | `@hzblj/kara-native` | The `KaraUI` Expo native module (Swift/Kotlin) and its raw bindings (`/swift-ui`, `/jetpack-compose`). |
| `packages/components/` | `@hzblj/kara-components` | Atoms, molecules, organisms, `Screen` — and a story beside every component. |
| `packages/router/` | `@hzblj/kara-router` | `Tabs` and `navigationTheme`, apart so nothing else imports expo-router. |
| `packages/expo-plugin/` | `@hzblj/kara-expo-plugin` | The optional config plugin (`iosSemanticColors`), compiled for Node. |
| `packages/kara-ui/` | `@hzblj/kara-ui` | The umbrella consumers install: re-exports only, the public entry points, the npm README. |
| `apps/example/` | — | The example app: Showcase, Gallery, on-device Storybook. Runs every package from **source**. Private. |
| `scripts/` | — | `fallback-declarations.mjs` (a per-package build step) and `pack-check.mjs` (tarballs + a throwaway consumer). |
| `.changeset/`, `.github/workflows/` | — | Release notes (`yarn changeset`), CI (biome, typecheck, pack check) and the changesets → npm release. |

Dependencies point one way: `theme` ← `sx` ← `components` ← `router`, with `native` beside `theme` (a pure platform
layer) and `kara-ui` on top of all of them. Nothing imports upwards, and nothing reaches past another package's
`exports`. All packages are versioned together (`fixed` in `.changeset/config.json`). A website is planned as a second
app under `apps/`.

## Commands

```bash
yarn ios / yarn android      # run the example (dev client)
yarn prebuild                # clean `expo prebuild` of the example — after native or config changes
yarn typecheck               # turbo: tsc per workspace, iOS and Android resolutions both
yarn lint                    # turbo: biome + tsc
yarn biome:fix               # apply safe lint/format fixes
yarn build                   # turbo, in dependency order: bob (JS) + tsc (declarations) per package
yarn pack:check              # pack every package as npm will get it and type-check a throwaway consumer
yarn changeset               # describe a change for the next release
```

## Conventions that bite

**Relative imports inside a package, package names across them.** No path aliases — they would not survive
publishing. `@hzblj/kara-components` imports `@hzblj/kara-theme`, never `../../theme/src/…`. Consumers (and the
example) import `@hzblj/kara-ui` and its subpaths only.

**Workspaces run each other's source; the world runs `lib/`.** Every package's `exports` names a `source` entry.
`tsconfig.base.json` adds the `source` condition, so `yarn typecheck` needs no build; `tsconfig.build.json` drops it,
so declarations build against the dependencies' published types (turbo builds `^build` first). The example's
`metro.config.js` maps every workspace entry to its `source` for Fast Refresh. A new entry point goes into a package's
`exports` with `source`, `types` and `default`, and both follow.

**Publish through Yarn, tag through changesets.** `yarn release` runs `yarn npm publish` in every public workspace —
Yarn rewrites `workspace:^` into real ranges, the same way `yarn pack` does for `yarn pack:check` — and then
`changeset tag`, whose `New tag:` lines the release action reads to push tags and create GitHub releases. Never go
back to `changeset publish`: its CLI (pinned to 2.x for those tag lines) calls npm, which ships `workspace:^` verbatim
and makes the release uninstallable, as 0.2.0 was.

**Platform split has no fallback file.** A split component is `x.ios.tsx` + `x.android.tsx` with a shared
`x.types.ts` and a `contract.check.ts` that assigns both to the same component type. There is deliberately no plain
`x.tsx`; resolution depends on `moduleSuffixes` (`tsconfig.ios.json` / `tsconfig.android.json` per workspace, which
`yarn typecheck` runs). The published declarations get a generated `x.d.ts` (`scripts/fallback-declarations.mjs`), so
consumers need no `moduleSuffixes`.

**Style through `sx` props, never raw values.** `p="s16"`, `bg="surface.primary"`, `borderRadius="large"` — a raw
number or hex does not type-check. Layout keys also take `{base, sm, md, lg, xl}`.

**The theme is the library's defaults; apps override values, not names.** `KaraProvider theme={...}` takes a
`ThemeConfig` (`defineTheme`): colour overrides, the app's own font faces, the Android seed, `dynamicColor` (Material
You). Text is set in the platform's face (SF Pro / Roboto) unless the app names its own — the library ships no fonts.

**Icons are the app's SVGs, never the library's.** `plugins: [['@hzblj/kara-ui', {icons: {source}}]]` turns every
SVG into an iOS asset-catalog image and an Android vector drawable at prebuild, and writes `kara-icons.d.ts` (the
global `KaraIcons`) whenever the config is read. No `@expo/vector-icons`, no icon font. The few glyphs kara's own
chrome draws are internal (`packages/native/glyphs.json`).

**Native views need a host.** `@expo/ui`-backed atoms only render inside `<Screen>` or `<Island>`; outside one they
silently disappear (dev warns via `useHostGuard`).

**Every component has a story beside it**, mounted by `apps/example/.rnstorybook`, and a section in the example's
Gallery.

Code style is Biome-enforced (`@hzblj/biome-config`): 2 spaces, 120 cols, single quotes, no semicolons, sorted imports
and object keys. Named exports and `const` arrow functions everywhere; `type` over `interface`.
