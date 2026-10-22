# @hzblj/kara-ui

A native-first design system for Expo. Components render real SwiftUI and Jetpack Compose views, styled through one
token-typed `sx` surface. Platform colours and typeface by default, your own through the theme.

iOS and Android, Expo SDK 57, development build required.

## Install

```bash
npx expo install @hzblj/kara-ui @expo/ui @lodev09/react-native-true-sheet @shopify/flash-list expo-haptics expo-image react-native-reanimated react-native-worklets
npx expo install expo-router   # optional, for native tabs and the zoom transition
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

## Zoom transition

A push that grows out of the photo it was opened from and shrinks back into it — UIKit's zoom on iOS 18 (a slide
below), Material's container transform on Android. Any Expo Router stack screen.

```tsx
import {
  useZoomTransitionParam,
  useZoomTransitionSourceId,
  withZoomTransition,
  ZOOM_TRANSITION_PARAM,
  ZoomTransition,
} from '@hzblj/kara-ui/router'

// The list
const zoomId = useZoomTransitionSourceId(product.id)
const open = () => router.push({pathname: '/product/[id]', params: {id: product.id, [ZOOM_TRANSITION_PARAM]: zoomId}})

<Pressable onPress={open}>
  <ZoomTransition.Source identifier={zoomId} android={{borderRadius: 'large'}}>
    <ProductPhoto />
  </ZoomTransition.Source>
</Pressable>

// The pushed screen — the enabler first, before any loading state
const zoomId = useZoomTransitionParam()

<ZoomTransition.Enabler sourceIdentifier={zoomId} />
<ZoomTransition.Target identifier={zoomId} android={{borderRadius: 'large'}}>
  <ProductPhoto />
</ZoomTransition.Target>

// Its layout: on Android the push fades under the transform
<Stack.Screen name="product/[id]" options={withZoomTransition({title: 'Product'})} />
```

Props at the top work on both platforms; the rest is typed apart under `ios` and `android`:

```tsx
<ZoomTransition.Enabler
  sourceIdentifier={zoomId}
  scrim="fill.accent.primary:o20"
  ios={{dismissGesture: 'vertical', blur: 'thin'}}
  android={{duration: 'd300', easing: 'standard', fade: 'through', path: 'linear'}}
/>
```

Inside a `ContextMenu`, a tap on the iOS preview zooms the preview's photo straight into the pushed screen
(`previewTransition` picks `zoom`, `pop` or `dismiss`).

On iOS 18+ react-native-screens (4.30 and older) reports a zoom pop ~0.5 s late, so a tap right after it is lost —
[react-native-screens#4711](https://github.com/software-mansion/react-native-screens/issues/4711); the example app
carries the fix as a Yarn patch (`.yarn/patches/` in the repo).

## Entry points

`@hzblj/kara-ui` (everything), `@hzblj/kara-ui/router` (native tabs, zoom transition), `@hzblj/kara-ui/swift-ui` and
`@hzblj/kara-ui/jetpack-compose` (the raw native views).

[Example app and source](https://github.com/hzblj/kara-ui) · MIT
