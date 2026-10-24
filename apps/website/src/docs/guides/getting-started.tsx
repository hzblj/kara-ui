import {LIBRARIES_URL} from '../../site'
import {CodeBlock} from '../../ui/code-block'
import {COMPONENTS} from '../components/registry'
import type {Guide} from './guide'
import {Callout, Hero, NextLinks, P, Section, Table} from './parts'

const PEERS = [
  '@expo/ui',
  '@lodev09/react-native-true-sheet',
  'expo-image',
  'react-native-reanimated',
  'react-native-worklets',
]

export const INSTALL_COMMAND = `npx expo install @hzblj/kara-ui ${PEERS.join(' ')}`

/** The same command, one package a line, for a code block a reader can take in at a glance. */
const INSTALL_BLOCK = ['npx expo install @hzblj/kara-ui', ...PEERS].join(' \\\n  ')

const FIRST_SCREEN = `import {Button, KaraProvider, Screen, Text, VStack} from '@hzblj/kara-ui'

export const App = () => (
  <KaraProvider>
    <Screen>
      <VStack p="s16" spacing="s12" wide>
        <Text variant="headingS">Hello</Text>
        <Button label="Continue" onPress={next} wide />
      </VStack>
    </Screen>
  </KaraProvider>
)`

const MIXED = `import {Box, Button, Island, RnScrollView, RnText} from '@hzblj/kara-ui'

export const Checkout = () => (
  <RnScrollView content={{gap: 's24', p: 's20'}}>
    <RnText variant="headingS">Checkout</RnText>
    <Box bg="surface.primary" borderRadius="large" p="s16">
      <RnText color="content.secondary">2 items · €129</RnText>
    </Box>
    <Island>
      <Button label="Pay €129" onPress={pay} wide />
    </Island>
  </RnScrollView>
)`

export const introduction: Guide = {
  Content: () => (
    <>
      <Hero id="introduction" kicker="Getting started" title="Native UI for Expo">
        <P>
          {
            'kara is a design system for Expo made of **real SwiftUI and Jetpack Compose views**: [@expo/ui](https://docs.expo.dev/versions/latest/sdk/ui/)’s, and kara’s own native components where @expo/ui has none (swipe actions, blur materials, a tintable segmented control, navigation bars, a zoom transition). Over both sits the **sx engine**, one token-typed styling surface that resolves into SwiftUI modifiers, Compose modifiers or React Native styles, so every component takes the same spacing, colours, radii and type, and the whole set reads as one design system on iOS and Android. The platform’s colours and typeface by default; yours through the theme.'
          }
        </P>
      </Hero>

      <Section id="first-screen" title="A first screen">
        <P>
          {
            'Mount `KaraProvider` once at the root. A screen of native views starts with `Screen`; everything inside lays out natively and takes `sx` props resolved from the theme’s tokens.'
          }
        </P>
        <CodeBlock code={FIRST_SCREEN} title="App.tsx" />
        <Callout>
          {
            'kara needs a **development build**: its views are native code, so Expo Go cannot run them. iOS and Android, Expo SDK 57. There is no web target.'
          }
        </Callout>
      </Section>

      <Section id="tiers" title="Two tiers">
        <P>
          {
            'Native views live in a native host. Most of kara is that **native tier**; the rest is a **React Native tier** of plain React Native views with the same `sx` props, for layout, long lists and the pieces a native host does not suit.'
          }
        </P>
        <Table
          columns={['Tier', 'Renders', 'Where it goes', 'Examples']}
          rows={[
            [
              'Native',
              'SwiftUI on iOS, Jetpack Compose on Android',
              'Inside a `Screen` or an `Island`',
              '`Button`, `Switch`, `Text`, `VStack`, `List`',
            ],
            [
              'React Native',
              'React Native views, some backed by kara’s own UIKit and Compose views',
              'Anywhere',
              '`Box`, `RnText`, `Pressable`, `Sheet`, `ContextMenu`, `GlassView`',
            ],
          ]}
        />
        <P>{'A page that is mostly React Native drops native views in where it needs them, each in an `Island`:'}</P>
        <CodeBlock code={MIXED} title="checkout.tsx" />
      </Section>

      <Section id="next" title="Next">
        <NextLinks
          links={[
            {
              copy: 'The package, its peers, the config plugin and the provider.',
              href: '/docs/installation',
              title: 'Installation',
            },
            {
              copy: 'When to reach for a Screen, an Island or neither.',
              href: '/docs/hosts',
              title: 'Screen and Island',
            },
            {copy: 'Every prop that styles, and the tokens it takes.', href: '/docs/styling', title: 'Styling with sx'},
            {
              copy: `All ${COMPONENTS.length}, on both platforms.`,
              href: '/docs/components',
              title: 'Components',
            },
          ]}
        />
      </Section>

      <Section id="more-libraries" title="More libraries">
        <P>
          {`kara is one of a set of native libraries for Expo: haptics, native icons, app icons, a zoom transition, speech and more, each with an example app built with kara. You find them all at [libraries.janblazej.dev](${LIBRARIES_URL}).`}
        </P>
      </Section>
    </>
  ),
  headings: [
    {id: 'introduction', label: 'Introduction'},
    {id: 'first-screen', label: 'A first screen'},
    {id: 'tiers', label: 'Two tiers'},
    {id: 'next', label: 'Next'},
    {id: 'more-libraries', label: 'More libraries'},
  ],
  id: 'introduction',
}

const LAYOUT = `import {KaraProvider, useAppTheme} from '@hzblj/kara-ui'
import {navigationTheme} from '@hzblj/kara-ui/router'
import {Stack, ThemeProvider} from 'expo-router'
import {type ReactNode, useMemo} from 'react'

const Navigation = ({children}: {children: ReactNode}) => {
  const theme = useAppTheme()
  const value = useMemo(() => navigationTheme(theme), [theme])

  return <ThemeProvider value={value}>{children}</ThemeProvider>
}

export default function RootLayout() {
  return (
    <KaraProvider themePreference="system">
      <Navigation>
        <Stack />
      </Navigation>
    </KaraProvider>
  )
}`

export const installation: Guide = {
  Content: () => (
    <>
      <Hero id="installation" kicker="Getting started" title="Installation">
        <P>{'One package, a handful of peers, and a config plugin for your icons.'}</P>
      </Hero>

      <Section id="install" title="Install">
        <CodeBlock code={INSTALL_BLOCK} language="bash" title="Terminal" />
        <P>{'For the router pieces (`Tabs`, `navigationTheme` and `ZoomTransition`), add Expo Router too:'}</P>
        <CodeBlock code="npx expo install expo-router" language="bash" title="Terminal" />
        <Table
          columns={['Peer', 'Why']}
          rows={[
            ['`@expo/ui`', 'The SwiftUI and Jetpack Compose views the native tier renders.'],
            ['`@lodev09/react-native-true-sheet`', '`Sheet` and the sheets built on it.'],
            ['`expo-image`', '`Image`, `Avatar` and the photos in a `ZoomTransition`.'],
            [
              '`react-native-reanimated`, `react-native-worklets`',
              '`Pressable`’s press on iOS, `ScrollEdgeContainer` on Android, `Skeleton`, `Snackbar`.',
            ],
            ['`expo-router` (optional)', '`@hzblj/kara-ui/router`.'],
          ]}
        />
      </Section>

      <Section id="config-plugin" title="Config plugin">
        <P>
          {
            'The plugin turns a folder of SVGs into native icons at prebuild and writes their names as types. Add it to the app config, then prebuild and build a development client.'
          }
        </P>
        <CodeBlock
          code={`export default {
  plugins: [['@hzblj/kara-ui', {icons: {source: './assets/icons'}}]],
}`}
          language="ts"
          title="app.config.ts"
        />
        <CodeBlock code={'npx expo prebuild\nnpx expo run:ios     # or run:android'} language="bash" title="Terminal" />
        <P>
          {
            'A new SVG, a change to the plugin’s options or a kara upgrade with native changes all need a prebuild and a native run, not a Metro reload. See [Icons](/docs/icons).'
          }
        </P>
      </Section>

      <Section id="provider" title="Provider">
        <P>
          {
            '`KaraProvider` goes at the root, once. It carries the theme, the active breakpoint for responsive `sx`, and the appearance, pinned to light or dark on the platform too, so native and React Native views agree. With Expo Router, hand `navigationTheme(theme)` to its `ThemeProvider` so headers and tab bars take the same colours.'
          }
        </P>
        <CodeBlock code={LAYOUT} title="app/_layout.tsx" />
      </Section>

      <Section id="entry-points" title="Entry points">
        <Table
          columns={['Import', 'What it holds']}
          rows={[
            ['`@hzblj/kara-ui`', 'Every component, the `sx` engine and the theme.'],
            [
              '`@hzblj/kara-ui/router`',
              '`Tabs`, `navigationTheme`, `ZoomTransition`: everything that needs Expo Router.',
            ],
            ['`@hzblj/kara-ui/swift-ui`', 'kara’s raw SwiftUI and UIKit views, for building your own.'],
            ['`@hzblj/kara-ui/jetpack-compose`', 'kara’s raw Compose views.'],
          ]}
        />
      </Section>
    </>
  ),
  headings: [
    {id: 'installation', label: 'Installation'},
    {id: 'install', label: 'Install'},
    {id: 'config-plugin', label: 'Config plugin'},
    {id: 'provider', label: 'Provider'},
    {id: 'entry-points', label: 'Entry points'},
  ],
  id: 'installation',
}

const SCREEN = `export default function Settings() {
  return (
    <Screen>
      <Form>
        <Form.Section title="Notifications">
          <Switch label="Order updates" onValueChange={setUpdates} value={updates} />
        </Form.Section>
      </Form>
    </Screen>
  )
}`

const ISLAND_HEIGHT = `<Island h={240} matchContents={false}>
  <List>
    <ListItem title="Account" />
    <ListItem title="Privacy" />
  </List>
</Island>`

const RN_VIEW = `<VStack spacing="s8">
  <Text variant="footnote">Three React Native boxes:</Text>
  <RnView>
    <Box flexDirection="row" gap="s8">{swatches}</Box>
  </RnView>
</VStack>`

export const hosts: Guide = {
  Content: () => (
    <>
      <Hero id="hosts" kicker="Core concepts" title="Screen and Island">
        <P>
          {
            'A SwiftUI or Compose view only exists inside a native host. `Screen` is a whole screen of them; `Island` is one patch of native layout inside React Native. Outside either, a native component renders nothing; in development, `useHostGuard` warns which one it was.'
          }
        </P>
      </Hero>

      <Section id="screen" title="Screen">
        <P>
          {
            'The full-bleed host a native screen starts with. Its children lay out in a column filling the screen, natively all the way down.'
          }
        </P>
        <CodeBlock code={SCREEN} title="app/settings.tsx" />
      </Section>

      <Section id="island" title="Island">
        <P>
          {
            'A native host inside React Native layout: a scroll view of React Native sections with a native control here and there. It sizes its height to its native content, and takes its width from the parent.'
          }
        </P>
        <Callout>
          {
            'Some native views have no height of their own: `List`, `Form` on iOS, `Pager`, `ScrollView`. In an island they need `matchContents={false}` and an explicit height, or they show nothing (Compose throws on an infinite height).'
          }
        </Callout>
        <CodeBlock code={ISLAND_HEIGHT} />
        <P>
          {
            'Keep a page to a few islands. Dozens of Compose hosts in one frame stall Android’s main thread; a long list of rows belongs in a list, not in a column of islands.'
          }
        </P>
      </Section>

      <Section id="rn-view" title="React Native inside native">
        <P>
          {
            '`RnView` carries one React Native view back into a native layout. Native text belongs inside the host as `Text`; a bare string under `RnView` cannot cross the boundary.'
          }
        </P>
        <CodeBlock code={RN_VIEW} />
        <P>
          {
            'An island whose content contains an `RnView` needs `matchContents={false}` and a height, or the two measurements chase each other.'
          }
        </P>
      </Section>

      <Section id="lists" title="Lists">
        <Table
          columns={['Rows are', 'Use']}
          rows={[
            ['Native views, in a native screen', '`List` with `ListItem`s, in a `Screen`.'],
            [
              'React Native content, many of them (hosts in them included)',
              '`RnFlatList` or `RnSectionList`: React Native’s own virtualized lists, cells in normal flow, so a hosted view stays where the layout put it. Bring your own recycling list for plain data rows if you need one; recycled cells move, which a host does not survive.',
            ],
            ['A handful that should not scroll', 'A `VStack` (native) or a `Box` (React Native).'],
          ]}
        />
      </Section>
    </>
  ),
  headings: [
    {id: 'hosts', label: 'Screen and Island'},
    {id: 'screen', label: 'Screen'},
    {id: 'island', label: 'Island'},
    {id: 'rn-view', label: 'React Native inside native'},
    {id: 'lists', label: 'Lists'},
  ],
  id: 'hosts',
}

export const GETTING_STARTED_GUIDES = [introduction, installation, hosts]
