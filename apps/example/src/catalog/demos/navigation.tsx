import {Box, Button, Island, NavigationBar, type NavigationBarItem, RnText, Sheet, Text, VStack} from '@hzblj/kara-ui'
import {useMemo, useState} from 'react'
import {Platform} from 'react-native'

import {LinkList, Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {ZoomTransitionDemo} from '../zoom'
import {KARA_MODULE} from './tags'

type SheetDemoId = 'actions' | 'large' | 'leading' | 'plain' | 'search' | 'title'

const STORES = Array.from({length: 30}, (_, index) => `Store ${index + 1} · Prague ${(index % 10) + 1}`)

const StoreRow = ({label}: {label: string}) => (
  <Box borderBottomWidth={1} borderColor="border.tertiary" py="s12">
    <RnText variant="body">{label}</RnText>
  </Box>
)

const SheetDemo = () => {
  const [open, setOpen] = useState<SheetDemoId | null>(null)
  const [query, setQuery] = useState('')
  const close = () => setOpen(null)

  const closeItem = useMemo<NavigationBarItem[]>(() => [{onPress: () => setOpen(null), type: 'close'}], [])
  const backItem = useMemo<NavigationBarItem[]>(() => [{onPress: () => setOpen(null), type: 'back'}], [])
  const productItems = useMemo<NavigationBarItem[]>(
    () => [
      {icon: 'share', label: 'Share', onPress: () => undefined, type: 'icon'},
      {icon: 'heart', label: 'Add to favourites', onPress: () => undefined, type: 'icon'},
      {onPress: () => setOpen(null), separated: true, type: 'close'},
    ],
    []
  )
  const search = useMemo(() => ({onChangeText: setQuery, placeholder: 'Search stores'}), [])
  const found = STORES.filter(store => store.toLowerCase().includes(query.toLowerCase()))

  const rows: {id: SheetDemoId; subtitle: string; title: string}[] = [
    {id: 'title', subtitle: 'Fits its content', title: 'Title and close'},
    {id: 'large', subtitle: 'Scrolls under the bar', title: 'Large title'},
    {id: 'actions', subtitle: 'Grouped glass on iOS 26', title: 'Back, actions and close'},
    {id: 'leading', subtitle: 'Close on the left', title: 'Leading title'},
    ...(Platform.OS === 'ios' ? [{id: 'search' as const, subtitle: 'In place of the title', title: 'Search'}] : []),
    {id: 'plain', subtitle: 'Just the grabber', title: 'No header'},
  ]

  return (
    <>
      <Section caption="Each opens a native sheet with a native header.">
        <LinkList rows={rows.map(row => ({...row, onPress: () => setOpen(row.id)}))} />
      </Section>

      <Sheet onDismiss={close} visible={open === 'title'}>
        <Sheet.Header title="Choose a size" trailingItems={closeItem} />
        <Box gap="s16" pb="s32" px="s20">
          <RnText color="content.secondary" variant="body">
            The sheet sizes itself to this content. The bar above is a real navigation bar.
          </RnText>
          <Island>
            <Button label="Done" onPress={close} />
          </Island>
        </Box>
      </Sheet>

      <Sheet detents={[0.6, 1]} onDismiss={close} scrollable visible={open === 'large'}>
        <Sheet.Header title="Nearby stores" titleStyle="large" trailingItems={closeItem} />
        <Sheet.ScrollView content={{pb: 's32', px: 's20'}}>
          {STORES.map(store => (
            <StoreRow key={store} label={store} />
          ))}
        </Sheet.ScrollView>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'actions'}>
        <Sheet.Header leadingItems={backItem} title="Air Max 90" trailingItems={productItems} />
        <Box pb="s32" px="s20">
          <RnText color="content.secondary" variant="body">
            On iOS 26 share and favourite share one glass capsule; the close is separated, so it gets its own.
          </RnText>
        </Box>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'leading'}>
        <Sheet.Header leadingItems={closeItem} title="Filters" titleStyle="leading" />
        <Box pb="s32" px="s20">
          <RnText color="content.secondary" variant="body">
            Items go wherever you put them — a close on the left works as well as on the right.
          </RnText>
        </Box>
      </Sheet>

      <Sheet detents={[1]} onDismiss={close} scrollable visible={open === 'search'}>
        <Sheet.Header search={search} trailingItems={closeItem} />
        <Sheet.ScrollView content={{pb: 's32', px: 's20'}} keyboardShouldPersistTaps="handled">
          {found.map(store => (
            <StoreRow key={store} label={store} />
          ))}
        </Sheet.ScrollView>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'plain'}>
        <Box gap="s8" pb="s32" pt="s24" px="s20">
          <RnText variant="headingXs">No header</RnText>
          <RnText color="content.secondary" variant="body">
            Swipe down or tap outside to close.
          </RnText>
        </Box>
      </Sheet>
    </>
  )
}

const noop = () => undefined
const BACK: NavigationBarItem[] = [{onPress: noop, type: 'back'}]
const CLOSE: NavigationBarItem[] = [{onPress: noop, type: 'close'}]
const PRODUCT: NavigationBarItem[] = [
  {icon: 'share', label: 'Share', onPress: noop, type: 'icon'},
  {icon: 'heart', label: 'Add to favourites', onPress: noop, type: 'icon'},
  {onPress: noop, separated: true, type: 'close'},
]

/**
 * The card a bar sits on. Not clipped on iOS: a pressed glass item swells past the bar, and a clip would cut it off —
 * Android's top app bar is drawn flat and stays inside the corners only when clipped.
 */
const Bar = ({children}: {children: React.ReactNode}) => (
  <Box bg="surface.primary" borderRadius="large" overflow={Platform.OS === 'android' ? 'hidden' : undefined}>
    {children}
  </Box>
)

const NavigationBarDemo = () => (
  <>
    <Section title="Back and close">
      <Bar>
        <NavigationBar leadingItems={BACK} title="Checkout" trailingItems={CLOSE} />
      </Bar>
    </Section>
    <Section
      caption="Neighbours share one glass capsule on iOS 26; a separated item gets its own."
      title="Grouped actions"
    >
      <Bar>
        <NavigationBar leadingItems={BACK} title="Air Max 90" trailingItems={PRODUCT} />
      </Bar>
    </Section>
    <Section title="Leading title">
      <Bar>
        <NavigationBar leadingItems={CLOSE} title="Filters" titleAlignment="leading" />
      </Bar>
    </Section>
  </>
)

const TabsDemo = () => (
  <Section caption="This app’s own tab bar is kara’s Tabs: native tabs on Expo Router, with your icons.">
    <Island>
      <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s4" wide>
        <Text variant="headline">Look down</Text>
        <Text color="content.secondary">Home, Components and Design are Tabs.Screen entries.</Text>
      </VStack>
    </Island>
  </Section>
)

export const NAVIGATION: CatalogEntry[] = [
  {
    code: '<Sheet visible={open} onDismiss={close}>\n  <Sheet.Header title="Choose a size" trailingItems={[{type: \'close\', onPress: close}]} />\n  <SizeList />\n</Sheet>',
    Demo: SheetDemo,
    id: 'sheet',
    name: 'Sheet',
    summary: 'A native sheet with a native header: titles, back, close and actions, detents and a large title.',
    tags: ['UIKit', 'Jetpack Compose', 'TrueSheet'],
  },
  {
    code: "<NavigationBar\n  title=\"Checkout\"\n  leadingItems={[{type: 'back', onPress: back}]}\n  trailingItems={[{type: 'close', onPress: close}]}\n/>",
    Demo: NavigationBarDemo,
    id: 'navigation-bar',
    name: 'NavigationBar',
    summary: 'A title with items on either side — a real navigation bar outside a navigation stack.',
    tags: KARA_MODULE,
  },
  {
    code: '<Tabs>\n  <Tabs.Screen name="index" title="Home" icon="home" selectedIcon="home-filled" />\n</Tabs>',
    Demo: TabsDemo,
    id: 'tabs',
    name: 'Tabs',
    summary: 'Native tabs for Expo Router.',
    tags: ['UIKit', 'Material'],
  },
  {
    code: "// the list\nconst zoomId = useZoomTransitionSourceId(photo.id)\nconst open = () => router.push({pathname: '/photo/[id]', params: {id: photo.id, [ZOOM_TRANSITION_PARAM]: zoomId}})\n\n<Pressable onPress={open}>\n  <ZoomTransition.Source identifier={zoomId} android={{borderRadius: 'large'}}>\n    <Photo />\n  </ZoomTransition.Source>\n</Pressable>\n\n// the pushed screen\nconst zoomId = useZoomTransitionParam()\n\n<ZoomTransition.Enabler sourceIdentifier={zoomId} ios={{dismissGesture: 'vertical'}} android={{duration: 'd300'}} />\n<ZoomTransition.Target identifier={zoomId} android={{borderRadius: 'large'}}>\n  <Photo />\n</ZoomTransition.Target>\n\n// its layout\n<Stack.Screen name=\"photo/[id]\" options={withZoomTransition({title: 'Photo'})} />",
    Demo: ZoomTransitionDemo,
    id: 'zoom-transition',
    name: 'ZoomTransition',
    summary:
      'A push that grows out of the photo it was opened from and shrinks back into it: UIKit’s zoom on iOS 18, Material’s container transform on Android.',
    tags: ['UIKit', 'Material', 'Expo Router'],
  },
]
