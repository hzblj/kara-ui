import {CodeBlock} from '../../ui/code-block'
import type {Guide} from './guide'
import {Callout, Hero, List, P, Section, Table} from './parts'

const SETUP = `import {useStackScreenOptions} from '@hzblj/kara-ui/header'
import {Stack} from 'expo-router'

export default function Layout() {
  const screenOptions = useStackScreenOptions()

  return <Stack screenOptions={screenOptions} />
}`

const ACTIONS = `import {type HeaderAction, useHeader} from '@hzblj/kara-ui/header'
import {useNavigation} from 'expo-router' // or @react-navigation/native

export default function Product() {
  const navigation = useNavigation()

  const trailingActions = useMemo<HeaderAction[]>(() => [
    {type: 'icon', icon: 'share', label: 'Share', onPress: share},
    {type: 'menu', icon: 'more', label: 'More', items: [
      {type: 'action', label: 'Delete', destructive: true, onPress: remove},
    ]},
  ], [])

  useHeader(navigation, {title: 'Product', trailingActions})

  return <ProductDetail />
}`

const STATIC_OPTIONS = `const header = useHeaderOptions({title: 'Product', trailingActions})

<Stack.Screen options={header.options} />`

const LARGE_TITLE = `const header = useHeader(navigation, {title: 'Countries', largeTitle: true})

const onScroll = useAnimatedScrollHandler({
  onScroll: event => header.onScroll(event.contentOffset.y),
})

<Animated.FlatList
  contentInsetAdjustmentBehavior={header.contentInsetAdjustmentBehavior}
  ListHeaderComponent={header.largeTitle}
  onScroll={onScroll}
  data={countries}
  renderItem={renderCountry}
/>`

const SEARCH = `const search = useHeaderSearch({placeholder: 'Search countries'})
const header = useHeader(navigation, {title: 'Countries', search: search.searchBar})

const found = countries.filter(country => country.includes(search.query))

<>
  <FlatList
    ListHeaderComponent={<>{header.largeTitle}{search.searchInput}</>}
    data={found}
    renderItem={renderCountry}
  />
  {search.scrim}
</>`

const HERO = `// layout: <Stack.Screen name="place" options={HERO_HEADER_SCREEN_OPTIONS} />

export default function Place() {
  const navigation = useNavigation()
  const hero = useHeroHeader(navigation, {title: 'Northern lights', heroHeight: 460})

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => hero.onScroll(event.contentOffset.y),
  })

  return (
    <>
      <Animated.ScrollView contentInsetAdjustmentBehavior="never" onScroll={onScroll}>
        <Image h={460} source={photo} />
        <Story />
      </Animated.ScrollView>
      {hero.background}
    </>
  )
}`

export const header: Guide = {
  Content: () => (
    <>
      <Hero id="header" kicker="Core concepts" title="Header">
        <P>
          {
            'Native screen headers from `@hzblj/kara-ui/header`: titles, search and actions on both sides. Works with React Navigation and Expo Router.'
          }
        </P>
      </Hero>

      <Section id="setup" title="Setup">
        <P>{'Theme the whole stack once.'}</P>
        <CodeBlock code={SETUP} title="app/_layout.tsx" />
      </Section>

      <Section id="actions" title="Actions">
        <P>{'Pass your screen’s `navigation` to `useHeader`.'}</P>
        <CodeBlock code={ACTIONS} />
        <Table
          columns={['Type', 'What it is']}
          rows={[
            ['`back`, `close`', 'The platform’s chevron or cross. `icon` swaps in your own.'],
            ['`icon`', 'One of your icons. `loading`, `badge` (iOS 26), `selected`, `color`.'],
            ['`text`', 'A label: “Edit”, “Done”. `prominent` on iOS.'],
            ['`menu`', 'An icon that opens a menu. Rows, sections (`submenu`), `checked`, `destructive`.'],
            ['`custom`', 'Any React Native element.'],
          ]}
        />
        <List
          items={[
            '`leadingActions` and `trailingActions`, in screen order.',
            '`separated: true` gives an action its own glass on iOS 26.',
            '`backHidden: true` hides the back button. On Android a trailing `close` moves to the start.',
            'Memoize the arrays.',
          ]}
        />
        <P>{'Actions the screen has from the start can go into static options:'}</P>
        <CodeBlock code={STATIC_OPTIONS} />
      </Section>

      <Section id="titles" title="Titles">
        <Table
          columns={['Param', 'What it does']}
          rows={[
            ['`title`', 'The title in the bar.'],
            ['`subtitle`', 'Title and subtitle on the leading side.'],
            ['`largeTitle`', 'A large title that collapses into the bar.'],
            ['`titleRevealProgress`', 'Fades the title in, 0 to 1. For a title that shows after scrolling.'],
            ['`titleHidden`', 'The bar without a title.'],
          ]}
        />
        <P>
          {
            'Android has no native large title. Render `header.largeTitle` as the first row and feed `header.onScroll` the scroll offset.'
          }
        </P>
        <CodeBlock code={LARGE_TITLE} />
      </Section>

      <Section id="search" title="Search">
        <P>
          {
            'iOS puts the field under the title. Android gets a row (`searchInput`) to place under the bar. `scrim` dims the content while the field is empty.'
          }
        </P>
        <CodeBlock code={SEARCH} />
      </Section>

      <Section id="hero" title="Hero header">
        <P>
          {
            'A transparent bar over a full-width image. The title, the bar and the status bar come in as the image scrolls away. Render `hero.background` after the list.'
          }
        </P>
        <CodeBlock code={HERO} />
        <P>
          {'`revealedTrailingActions` join the bar once the title shows. `overHeroStyle: "dark"` for a light image.'}
        </P>
      </Section>

      <Section id="helpers" title="Helpers">
        <Table
          columns={['Export', 'Use it for']}
          rows={[
            ['`HeaderInset`', 'Content right under a transparent header.'],
            ['`useHeaderBarInset()`', 'The header’s height, as a number.'],
            [
              '`useHeaderScrollToTop(ref, {largeTitle})`',
              'Pass to `useScrollToTop`. A tab press lands on the expanded title.',
            ],
            ['`LARGE_TITLE_SCREEN_OPTIONS`', 'Static options for a large-title screen.'],
            ['`HERO_HEADER_SCREEN_OPTIONS`', 'Static options for a hero screen.'],
            ['`HIDDEN_HEADER_SCREEN_OPTIONS`', 'No header.'],
          ]}
        />
        <Callout>
          {'Needs `react-native-screens` and `react-native-safe-area-context`. Every native stack has them already.'}
        </Callout>
      </Section>
    </>
  ),
  headings: [
    {id: 'header', label: 'Header'},
    {id: 'setup', label: 'Setup'},
    {id: 'actions', label: 'Actions'},
    {id: 'titles', label: 'Titles'},
    {id: 'search', label: 'Search'},
    {id: 'hero', label: 'Hero header'},
    {id: 'helpers', label: 'Helpers'},
  ],
  id: 'header',
}
