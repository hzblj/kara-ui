# @hzblj/kara-ui

A native-first design system for Expo. Components render **real SwiftUI and Jetpack Compose views**
through [`@expo/ui`](https://docs.expo.dev/versions/latest/sdk/ui/), not styled `View`s, and every
one of them is styled through one token-typed `sx` surface — `p="s16"`, `bg="surface.primary"`,
`borderRadius="large"`. A raw number or hex does not type-check.

- **Platform colours by default.** Most tokens resolve to UIKit semantic colours on iOS and Material 3
  roles on Android, so light/dark, increased contrast and Material You are the platform's job.
- **The platform's typeface by default.** SF Pro on iOS, Roboto on Android, with your own exact sizes
  that still follow Dynamic Type. Bring your own font with one config entry.
- **Override anything, keep the types.** Colours, fonts and the Android seed are set once on the
  provider; every token name stays the same, so every component keeps type-checking.
- **Atomic tiers.** Atoms, molecules, organisms and a `Screen` template — plus a React Native tier
  (`Box`, `RnView`, `RnText`, lists) with the same `sx` surface for layouts that host native views.

React Native and Expo only (iOS and Android), Expo SDK 57. A development build is required — the
package includes a native module.

## Install

```bash
npx expo install @hzblj/kara-ui @expo/ui @shopify/flash-list expo-haptics expo-image react-native-reanimated react-native-worklets
# optional, for `@hzblj/kara-ui/router` (native tabs)
npx expo install expo-router
```

Then rebuild the native app (`npx expo prebuild` / `npx expo run:ios`).

## Use

```tsx
import {Button, KaraProvider, Screen, Text, VStack} from '@hzblj/kara-ui'

export default function App() {
  return (
    <KaraProvider>
      <Screen>
        <VStack p="s16" spacing="s12" wide>
          <Text variant="headingS">Hello</Text>
          <Button label="Continue" variant="accent" wide />
        </VStack>
      </Screen>
    </KaraProvider>
  )
}
```

**Native views need a host.** `@expo/ui`-backed components render inside `<Screen>` (full-bleed,
one per screen) or `<Island>` (a native island inside React Native layout). Outside one they do not
appear, and development builds warn.

`KaraProvider` takes `themePreference` (`'system' | 'light' | 'dark'`). A pinned preference is pushed
down to the platform too, so the SwiftUI/Compose hosts and every `PlatformColor` agree.

## Theme

Pass a theme to the provider. Declare it at module scope so its identity is stable:

```tsx
import {adaptive, defineTheme, KaraProvider} from '@hzblj/kara-ui'

const theme = defineTheme({
  // Override any token's value — a hex, `adaptive({light, dark})`, or `native({ios, android})`.
  colors: {
    content: {accent: adaptive({dark: '#a5b4fc', light: '#4338ca'})},
    fill: {accent: {primary: '#4f46e5'}},
  },
  // Your own typeface, by role and weight — the names you registered the files under (e.g. with expo-font).
  fonts: {
    text: {regular: 'Inter-Regular', medium: 'Inter-Medium', semibold: 'Inter-SemiBold', bold: 'Inter-Bold'},
    display: {medium: 'InterDisplay-Medium'}, // headings; falls back to `text`
  },
  // The colour Android's Material 3 scheme grows from.
  materialSeed: '#4f46e5',
})

export const App = ({children}) => <KaraProvider theme={theme}>{children}</KaraProvider>
```

- **Colours** are merged over the defaults; you override values, never token names. A token that
  supports dimming (`fill.accent.base:o50`) only accepts a value that stays dimmable — a hex,
  `adaptive(...)`, or `native({android, light, dark})` — never a UIKit semantic colour.
- **Fonts** are optional. Without them, text uses the platform's face. With them, each text variant
  picks the face for its weight (falling back to the role's `regular`). Native text keeps scaling with
  Dynamic Type either way.
- Read the resolved theme anywhere with `useAppTheme()`: `theme.color('content.accent')`,
  `theme.typography.body`, `theme.dark`.

### Material You (Android)

```tsx
const theme = defineTheme({dynamicColor: true})
```

On Android 12+ the whole Material scheme follows the device wallpaper, and the accent tokens take
Material's `primary` roles — buttons, switches, links, FABs and tinted backgrounds move with it. A new
wallpaper is picked up when the app returns to the foreground, without a restart. Below Android 12 the
scheme grows from `materialSeed` instead. iOS has no wallpaper colours and keeps your accent; every
dimmed token (`:o50`) keeps working on both. `theme.dynamicColor` tells whether it is active on this
device.

`materialSeed: null` is the halfway house: the wallpaper's neutrals and controls, your own accent.

### iOS semantic colours

The theme decides which colour a token *uses*. To redefine what a UIKit semantic colour *is*, app-wide
and natively (e.g. `labelColor`), use the config plugin:

```ts
plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}, iosSemanticColors: {file: './ios-colors.json'}}]]
```

`ios-colors.json` maps semantic names (with their `Color` suffix) to `{light, dark, highContrastLight?, highContrastDark?}`.
It has no Android counterpart; use `colors` in the theme for both platforms.

## Icons

kara-ui ships no icon set — your app brings its own SVGs, and kara turns them into **native assets** on both
platforms. No icon font, no JavaScript rendering.

```ts
// app.config.ts
plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]]
```

```
assets/icons/
  bolt.svg            → <Icon name="bolt" />
  share.svg           → iOS
  share.android.svg   → Android's own share glyph
```

```tsx
<Icon name="bolt" />                       // inside <Screen> / <Island>: SwiftUI Image · Compose Icon
<RnIcon name="bolt" color="content.accent" />  // anywhere: UIImageView · ImageView
<Tabs.Screen icon="home" selectedIcon="home-filled" name="index" title="Home" />
```

- At prebuild every SVG becomes a template image set in the iOS asset catalog (vector data kept, so it scales crisply)
  and a vector drawable in Android's resources. A new or changed icon needs `npx expo prebuild`.
- Whenever the app config is read — `expo start` included — the plugin writes `kara-icons.d.ts`, so `name` only accepts
  icons that exist. `npx kara-icons ./assets/icons` does the same without Expo (CI).
- One single-colour glyph per file, made of `<path>`s (`fill-rule="evenodd"` is fine). Groups, clips, masks and strokes
  must be flattened first — the plugin fails loudly rather than shipping a broken icon. The platform tints every icon
  with the `color` token.
- `x.ios.svg` / `x.android.svg` replace `x.svg` on that platform, for glyphs that differ (share, back).

## Components

| Tier | |
| --- | --- |
| Atoms | `Box`, `Text`, `Button`, `IconButton`, `TextField`, `Switch`, `Checkbox`, `Slider`, `Picker`, `DatePicker`, `ColorPicker`, `SegmentedControl`, `Icon`, `Image`, `Avatar`, `Badge`, `Chip`, `Card`, `Surface`, `Progress`, `ActivityIndicator`, `Skeleton`, `Fab`, `Divider`, `Spacer`, `VStack` / `HStack` / `ZStack`, `ScrollView`, `List`, `Island`, `Pressable`, `GlassView` |
| React Native tier | `RnView`, `RnText`, `RnIcon`, `RnScrollView`, `RnFlatList`, `RnSectionList`, `FlashList` — the same `sx` surface on plain React Native views |
| Molecules | `Label`, `LabeledContent`, `ListItem`, `Link`, `SearchBar`, `EmptyState`, `Collapsible`, `Pager`, `RadioGroup`, `Stepper`, `Tooltip`, `RnTooltip`, `NavigationBar`, `ScrollEdgeContainer` |
| Organisms | `Sheet`, `ActionSheet`, `Alert`, `Menu`, `ContextMenu`, `Form`, `SwipeActions`, `Snackbar`, `FabMenu` |
| Templates | `Screen` |

A few come from the package's own native module rather than `@expo/ui`: `GlassView` (iOS 26 Liquid
Glass around React Native children), `ScrollEdgeContainer` (the iOS 26 scroll edge effect under your
bars), `NavigationBar` (real `UINavigationBar` items in a sheet), `ContextMenu` (long-press menu
with a custom preview), `RnTooltip` (rich,
controlled tooltip) and `FabMenu` (Material 3 Expressive on Android). Each falls back gracefully where
the platform lacks the feature.

## Entry points

| Import | What it is |
| --- | --- |
| `@hzblj/kara-ui` | Components, `sx`, theme, `KaraProvider`, hooks. |
| `@hzblj/kara-ui/router` | `Tabs` (native tabs on Expo Router) and `navigationTheme(theme)` for expo-router's `ThemeProvider`. Needs `expo-router`. |
| `@hzblj/kara-ui/swift-ui` | The raw SwiftUI/UIKit views and modifiers of the native module (iOS only). |
| `@hzblj/kara-ui/jetpack-compose` | The raw Compose views and modifiers of the native module (Android only). |

## Packages

`@hzblj/kara-ui` is all you install. It is built from scoped packages, versioned together, which you
never need to depend on directly:

| Package | |
| --- | --- |
| `@hzblj/kara-theme` | Tokens, palette, typography, `defineTheme`, `KaraProvider` |
| `@hzblj/kara-sx` | The `sx` styling engine |
| `@hzblj/kara-native` | The `KaraUI` Expo native module (Swift/Kotlin) and its bindings |
| `@hzblj/kara-components` | Atoms, molecules, organisms, templates |
| `@hzblj/kara-router` | `Tabs`, `navigationTheme` |
| `@hzblj/kara-expo-plugin` | The config plugin (icons, iOS semantic colours) and the `kara-icons` CLI |

## Development

All of them live in the [kara-ui monorepo](https://github.com/hzblj/kara-ui) together with an example
app (Showcase, Gallery and on-device Storybook). See the repository README.

## License

MIT
