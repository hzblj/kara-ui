# Kara UI

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]
[![Platforms: iOS · Android][platforms-badge]][docs-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-ui?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-ui
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-ui
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: ./LICENSE
[platforms-badge]: https://img.shields.io/badge/platforms-iOS%20%C2%B7%20Android-ff5700?labelColor=27272a
[docs-url]: https://www.kara.janblazej.dev/docs

<a href="https://www.kara.janblazej.dev"><img src="https://www.kara.janblazej.dev/og.png" alt="Kara — native UI for Expo: real SwiftUI and Jetpack Compose views" width="720"></a>

A native-first design system for Expo. Kara's components render **real SwiftUI and Jetpack Compose views** — a
`Switch` is a SwiftUI `Toggle` on iOS and a Material `Switch` on Android — styled through one token-typed `sx`
surface. The platform's colours and typeface by default, yours through the theme.

## Documentation

**[www.kara.janblazej.dev/docs](https://www.kara.janblazej.dev/docs)** — the guides, the design tokens, and every component
photographed on iOS and Android, in light and dark.

## Install

```bash
npx expo install @hzblj/kara-ui @expo/ui @lodev09/react-native-true-sheet \
  expo-image react-native-reanimated react-native-worklets
```

Expo SDK 57 and a [development build](https://docs.expo.dev/develop/development-builds/introduction/) — Kara ships
native code, so it does not run in Expo Go. The [installation guide](https://www.kara.janblazej.dev/docs/installation)
covers the config plugin and the provider.

## Quick start

```tsx
import {Button, KaraProvider, Screen, Text, VStack} from '@hzblj/kara-ui'

export const App = () => (
  <KaraProvider>
    <Screen>
      <VStack p="s16" spacing="s12" wide>
        <Text variant="headingS">Hello</Text>
        <Button label="Continue" />
      </VStack>
    </Screen>
  </KaraProvider>
)
```

Native views render inside a [`Screen` or an `Island`](https://www.kara.janblazej.dev/docs/hosts); the `Rn*` components
are plain React Native views with the same `sx` props.

## Packages

[`@hzblj/kara-ui`](./packages/kara-ui) is the one to install — it re-exports the rest, which are published so its
types resolve.

| Package | What it holds |
| --- | --- |
| [`@hzblj/kara-ui`](./packages/kara-ui) | The umbrella: every public entry point. |
| [`@hzblj/kara-theme`](./packages/theme) | Tokens, palette, typography, `KaraProvider`. |
| [`@hzblj/kara-sx`](./packages/sx) | The `sx` engine: one surface for SwiftUI modifiers, Compose modifiers and React Native styles. |
| [`@hzblj/kara-components`](./packages/components) | The components and `Screen`. |
| [`@hzblj/kara-router`](./packages/router) | `Tabs`, `navigationTheme` and `ZoomTransition` for Expo Router. |
| [`@hzblj/kara-native`](./packages/native) | The `KaraUI` native module, in Swift and Kotlin. |
| [`@hzblj/kara-expo-plugin`](./packages/expo-plugin) | The config plugin: your SVGs as native icons, iOS semantic colours. |

## Development

The repository is a Turborepo of Yarn 4 workspaces. [`apps/example`](./apps/example) runs every component from source,
with on-device Storybook; [`apps/website`](./apps/website) is
[www.kara.janblazej.dev](https://www.kara.janblazej.dev).

```bash
yarn                # install
yarn ios            # the example app, on iOS (yarn android for Android)
yarn site           # the website and docs, on http://localhost:4300
yarn lint           # biome and tsc, every workspace
yarn changeset      # describe a change for the next release
```

## Sponsorship

<a href="https://www.buymeacoffee.com/hzblj"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="48"></a>

## License

MIT © Jan Blazej
