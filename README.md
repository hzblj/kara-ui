# kara-ui

The monorepo behind [`@hzblj/kara-ui`](./packages/kara-ui) — a native-first design system for Expo:
real SwiftUI and Jetpack Compose views through `@expo/ui`, styled by one token-typed `sx` engine.

| Workspace | |
| --- | --- |
| [`packages/kara-ui`](./packages/kara-ui) | `@hzblj/kara-ui` — what consumers install. Usage docs live in its README. |
| [`packages/theme`](./packages/theme) | `@hzblj/kara-theme` — tokens, palette, typography, theme overrides, `KaraProvider` |
| [`packages/sx`](./packages/sx) | `@hzblj/kara-sx` — the `sx` styling engine |
| [`packages/native`](./packages/native) | `@hzblj/kara-native` — the `KaraUI` Expo native module (Swift/Kotlin) |
| [`packages/components`](./packages/components) | `@hzblj/kara-components` — atoms, molecules, organisms, templates |
| [`packages/router`](./packages/router) | `@hzblj/kara-router` — native tabs, navigation theme |
| [`packages/expo-plugin`](./packages/expo-plugin) | `@hzblj/kara-expo-plugin` — the optional config plugin |
| [`apps/example`](./apps/example) | The example app: a Showcase, the Gallery (every component in one scroll) and on-device Storybook. |

## Getting started

Requires Node 22, Yarn 4 (via Corepack), Xcode and/or Android Studio.

```bash
corepack enable
yarn install
yarn prebuild          # generate the example's native projects
yarn ios               # or: yarn android
```

The example runs every package straight from its `src/`, so edits reach the app through Fast Refresh.
Changes to native code (`packages/native/ios`, `packages/native/android`) need a native rebuild.

## Scripts

| Script | |
| --- | --- |
| `yarn ios` / `yarn android` | Run the example on a simulator or device. |
| `yarn start` | Metro for an installed dev client. |
| `yarn prebuild` | Clean `expo prebuild` of the example. |
| `yarn typecheck` | TypeScript per workspace, against both the iOS and the Android resolution. |
| `yarn lint` / `yarn biome:fix` | Biome + TypeScript / apply safe fixes. |
| `yarn build` | Build every package, in dependency order (`lib/`, declarations, config plugin). |
| `yarn pack:check` | Pack every package the way npm receives it and type-check a throwaway consumer. |

## Releasing

Releases go through [Changesets](https://github.com/changesets/changesets). Describe a change with
`yarn changeset` and commit the file with it. On `main`, the Release workflow opens a "version
packages" PR; merging it publishes every package, at one shared version, to npm (needs the `NPM_TOKEN` secret).

## License

MIT
