import {CodeBlock} from '../../ui/code-block'
import type {Guide} from './guide'
import {Callout, Hero, P, Section, Table} from './parts'

const THEME = `import {adaptive, defineTheme} from '@hzblj/kara-ui'

export const theme = defineTheme({
  colors: {
    border: {accent: '#4f46e5'},
    content: {accent: adaptive({dark: '#a5b4fc', light: '#4338ca'})},
    fill: {
      accent: {
        base: adaptive({dark: '#6366f133', light: '#eef2ff'}),
        disabled: adaptive({dark: '#6366f11f', light: '#e0e7ff'}),
        primary: '#4f46e5',
      },
    },
  },
  materialSeed: '#4f46e5',
})`

const PROVIDER = `<KaraProvider theme={theme} themePreference="system">
  <App />
</KaraProvider>`

const KINDS = `import {adaptive, native} from '@hzblj/kara-ui'

// The platform's own colour, on both sides.
native({android: 'surface', ios: 'systemGroupedBackgroundColor'})

// iOS has a name for it, Android does not — so there the hexes are ours.
native({dark: '#3ddc84', ios: 'systemGreenColor', light: '#00a546'})

// Ours on both platforms, still switched by the platform on iOS.
adaptive({dark: '#171717', light: '#ffffff'})

// The same in both appearances.
'#ff5700'`

const FONTS = `const theme = defineTheme({
  fonts: {
    display: {medium: 'InterDisplay-Medium'},
    text: {medium: 'Inter-Medium', regular: 'Inter-Regular', semibold: 'Inter-SemiBold'},
  },
})`

const READ = `import {useAppTheme} from '@hzblj/kara-ui'

const Badge = () => {
  const theme = useAppTheme()

  return <View style={{backgroundColor: theme.color('fill.accent.base'), borderColor: theme.color('border.accent')}} />
}`

const SEMANTIC = `plugins: [
  ['@hzblj/kara-ui', {
    iosSemanticColors: {
      colors: {systemGroupedBackgroundColor: {dark: '#0b0b0f', light: '#f4f4f6'}},
    },
  }],
]`

export const theming: Guide = {
  Content: () => (
    <>
      <Hero id="theming" kicker="Core concepts" title="Theming">
        <P>
          {
            'The library’s palette is mostly references the platform resolves — UIKit semantic colours on iOS, Material 3 roles on Android — so kara looks native before you change anything. A theme overrides **values, never names**: the token set stays the library’s, and every `sx` prop and component keeps type-checking.'
          }
        </P>
      </Hero>

      <Section id="define" title="A theme">
        <P>{'`defineTheme` at module scope, so the config stays referentially stable — the `sx` caches key on it.'}</P>
        <CodeBlock code={THEME} title="theme.ts" />
        <CodeBlock code={PROVIDER} title="app/_layout.tsx" />
        <Table
          columns={['Key', 'What it does']}
          rows={[
            ['`colors`', 'Overrides merged over the palette, in its own shape. An override replaces the whole entry.'],
            ['`fonts`', 'Your own typeface, by role and weight. Omitted, text is set in SF Pro and Roboto.'],
            [
              '`materialSeed`',
              'The colour Android’s Material 3 scheme grows from — every Material role and Compose control. Defaults to the accent.',
            ],
            [
              '`dynamicColor`',
              'Material You on Android 12+: the scheme follows the wallpaper and the accent tokens take Material’s `primary` roles. iOS keeps the palette’s accent.',
            ],
          ]}
        />
      </Section>

      <Section id="colour-kinds" title="Three kinds of colour">
        <P>{'An entry is one of three kinds, and the kind is the value — no call site ever knows which.'}</P>
        <CodeBlock code={KINDS} language="ts" />
        <Callout>
          {
            'A token that can be dimmed (`fill.accent.base:o50`) only takes a hex, `adaptive(...)` or `native({android, light, dark})` as its override: a UIKit semantic colour would leave the `:oNN` suffix nothing to multiply on iOS. The types enforce it.'
          }
        </Callout>
      </Section>

      <Section id="appearance" title="Light and dark">
        <P>
          {
            '`themePreference` is `system` by default. `light` and `dark` pin the app to one appearance — on the platform as well as in React, so `PlatformColor`s in the React Native tier and the SwiftUI and Compose hosts agree.'
          }
        </P>
      </Section>

      <Section id="fonts" title="Your own typeface">
        <P>
          {
            'kara ships no fonts. Register your faces with `expo-font`, then name them by role — `display` for headings and the large sizes, `text` for the rest — and weight. A missing weight falls back to the role’s `regular`, then to the platform face. Every variant still grows with Dynamic Type.'
          }
        </P>
        <CodeBlock code={FONTS} language="ts" />
      </Section>

      <Section id="reading" title="Reading the theme">
        <P>
          {
            '`useAppTheme()` returns the resolved theme. `theme.color(token)` is the one way to resolve a token — to a hex, or on iOS to an opaque `PlatformColor` for a system reference. `theme.dark`, `theme.typography` and `theme.dynamicColor` are there too.'
          }
        </P>
        <CodeBlock code={READ} />
      </Section>

      <Section id="semantic-colours" title="Redefining a UIKit colour">
        <P>
          {
            'The theme changes what a token resolves to, not what UIKit’s colours are. To redefine a semantic colour app-wide — for every token that names it and every piece of UIKit — the config plugin writes it into the asset catalog at prebuild. Android has no equivalent: its roles come from the seed or the wallpaper.'
          }
        </P>
        <CodeBlock code={SEMANTIC} language="ts" title="app.config.ts" />
      </Section>
    </>
  ),
  headings: [
    {id: 'theming', label: 'Theming'},
    {id: 'define', label: 'A theme'},
    {id: 'colour-kinds', label: 'Three kinds of colour'},
    {id: 'appearance', label: 'Light and dark'},
    {id: 'fonts', label: 'Your own typeface'},
    {id: 'reading', label: 'Reading the theme'},
    {id: 'semantic-colours', label: 'Redefining a UIKit colour'},
  ],
  id: 'theming',
}
