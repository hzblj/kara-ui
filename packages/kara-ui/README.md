# @hzblj/kara-ui

A native-first design system for Expo. Components render real SwiftUI and Jetpack Compose views, styled through one
token-typed `sx` surface. Platform colours and typeface by default, your own through the theme.

iOS and Android, Expo SDK 57, development build required.

## Install

```bash
npx expo install @hzblj/kara-ui @expo/ui @lodev09/react-native-true-sheet @shopify/flash-list expo-haptics expo-image react-native-reanimated react-native-worklets
npx expo install expo-router   # optional, for native tabs
```

## Use

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

Native components render inside `<Screen>` or `<Island>`. The `Rn*` components (`RnText`, `RnScrollView`, …) are plain
React Native views with the same `sx` props.

## Theme

```tsx
const theme = defineTheme({
  colors: {fill: {accent: {primary: '#4f46e5'}}},
  fonts: {text: {regular: 'Inter-Regular', medium: 'Inter-Medium'}},
  dynamicColor: true, // Material You on Android 12+
})

<KaraProvider theme={theme} themePreference="system">…</KaraProvider>
```

## Icons

```ts
// app.config.ts
plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]
```

Every SVG in the folder becomes a native icon at prebuild: `bolt.svg` → `<Icon name="bolt" />`.

## Sheets

```tsx
<Sheet onDismiss={close} visible={open}>
  <Sheet.Header title="Choose a size" trailingItems={[{type: 'close', onPress: close}]} />
  <Content />
</Sheet>
```

The header is a real navigation bar: `back`, `close` and icon items on either side, a centred, leading or large title.

## Entry points

`@hzblj/kara-ui` (everything), `@hzblj/kara-ui/router` (native tabs), `@hzblj/kara-ui/swift-ui` and
`@hzblj/kara-ui/jetpack-compose` (the raw native views).

[Example app and source](https://github.com/hzblj/kara-ui) · MIT
