# Kara UI

[![npm version][npm-badge]][npm-url]
[![License: MIT][license-badge]][license-url]
[![Platforms: iOS · Android][platforms-badge]][docs-url]

[npm-badge]: https://img.shields.io/npm/v/@hzblj/kara-ui?labelColor=27272a&color=ff5700&label=%40hzblj%2Fkara-ui
[npm-url]: https://www.npmjs.com/package/@hzblj/kara-ui
[license-badge]: https://img.shields.io/badge/license-MIT-ff5700?labelColor=27272a
[license-url]: https://github.com/hzblj/kara-ui/blob/main/LICENSE
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

## Learn more

- [Styling with `sx`](https://www.kara.janblazej.dev/docs/styling) — tokens in place of raw values
- [Theming](https://www.kara.janblazej.dev/docs/theming) — your colours, your typefaces, Material You
- [Icons](https://www.kara.janblazej.dev/docs/icons) — your own SVGs, as native icons on both platforms
- [Expo Router](https://www.kara.janblazej.dev/docs/router) — native tabs and the zoom transition
- [Components](https://www.kara.janblazej.dev/docs/components) — the whole catalogue
- [Changelog](https://www.kara.janblazej.dev/docs/changelog)

## Sponsorship

<a href="https://www.buymeacoffee.com/hzblj"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="48"></a>

## License

MIT © Jan Blazej
