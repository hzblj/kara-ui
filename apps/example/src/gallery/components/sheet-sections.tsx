import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Island,
  type NavigationBarItem,
  RnText,
  Sheet,
  Spacer,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {Fragment, useMemo, useState} from 'react'
import {Platform} from 'react-native'

type SheetDemo = 'actions' | 'large' | 'leading' | 'plain' | 'search' | 'title'

const DEMOS: {id: SheetDemo; label: string}[] = [
  {id: 'title', label: 'Title and close · fits its content'},
  {id: 'large', label: 'Large title · scrolls under the bar'},
  {id: 'actions', label: 'Back, grouped actions, separate close'},
  {id: 'leading', label: 'Leading title · close on the left'},
  ...(Platform.OS === 'ios' ? [{id: 'search' as const, label: 'Search in the bar'}] : []),
  {id: 'plain', label: 'No header · grabber only'},
]

const STORES = Array.from({length: 30}, (_, index) => `Store ${index + 1} · Prague ${(index % 10) + 1}`)

const Row = ({label}: {label: string}) => (
  <Box borderBottomWidth={1} borderColor="border.tertiary" py="s12">
    <RnText variant="body">{label}</RnText>
  </Box>
)

export const SheetSection = () => {
  const [open, setOpen] = useState<SheetDemo | null>(null)
  const [query, setQuery] = useState('')
  const close = () => setOpen(null)

  const closeItem = useMemo<NavigationBarItem[]>(() => [{onPress: () => setOpen(null), type: 'close'}], [])
  const backItem = useMemo<NavigationBarItem[]>(() => [{onPress: () => setOpen(null), type: 'back'}], [])
  const actionItems = useMemo<NavigationBarItem[]>(
    () => [
      {icon: 'share', label: 'Share', onPress: () => undefined, type: 'icon'},
      {icon: 'heart', label: 'Favourite', onPress: () => undefined, type: 'icon'},
      {onPress: () => setOpen(null), separated: true, type: 'close'},
    ],
    []
  )
  const search = useMemo(() => ({onChangeText: setQuery, placeholder: 'Search stores'}), [])
  const found = STORES.filter(store => store.toLowerCase().includes(query.toLowerCase()))

  return (
    <>
      <Island>
        <VStack spacing="s8" wide>
          {DEMOS.map(({id, label}, index) => (
            <Fragment key={id}>
              {index > 0 ? <Divider /> : null}
              <HStack onPress={() => setOpen(id)} py="s8" wide>
                <Text color="content.accent">{label}</Text>
                <Spacer />
                <Icon color="content.accent" name="chevron-right" size="s16" />
              </HStack>
            </Fragment>
          ))}
        </VStack>
      </Island>

      <Sheet onDismiss={close} visible={open === 'title'}>
        <Sheet.Header title="Choose a size" trailingItems={closeItem} />
        <Box gap="s16" pb="s32" px="s16">
          <RnText color="content.secondary" variant="body">
            The header is native — a UINavigationBar on iOS, Material's top app bar on Android — and the sheet sizes
            itself to this content.
          </RnText>
          <Island>
            <Button label="Done" onPress={close} />
          </Island>
        </Box>
      </Sheet>

      <Sheet detents={[0.6, 1]} onDismiss={close} scrollable visible={open === 'large'}>
        <Sheet.Header title="Nearby stores" titleStyle="large" trailingItems={closeItem} />
        <Sheet.ScrollView content={{pb: 's32', px: 's16'}}>
          {STORES.map(store => (
            <Row key={store} label={store} />
          ))}
        </Sheet.ScrollView>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'actions'}>
        <Sheet.Header leadingItems={backItem} title="Air Max 90" trailingItems={actionItems} />
        <Box gap="s8" pb="s32" px="s16">
          <RnText color="content.secondary" variant="body">
            On iOS 26 share and favourite share one glass capsule; the close is `separated`, so it gets its own.
          </RnText>
        </Box>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'leading'}>
        <Sheet.Header leadingItems={closeItem} title="Filters" titleStyle="leading" />
        <Box pb="s32" px="s16">
          <RnText color="content.secondary" variant="body">
            Items go where the caller puts them — the API takes a close on either side.
          </RnText>
        </Box>
      </Sheet>

      <Sheet detents={[1]} onDismiss={close} scrollable visible={open === 'search'}>
        <Sheet.Header search={search} trailingItems={closeItem} />
        <Sheet.ScrollView content={{pb: 's32', px: 's16'}} keyboardShouldPersistTaps="handled">
          {found.map(store => (
            <Row key={store} label={store} />
          ))}
        </Sheet.ScrollView>
      </Sheet>

      <Sheet onDismiss={close} visible={open === 'plain'}>
        <Box gap="s8" pb="s32" pt="s24" px="s16">
          <RnText variant="headingXs">No header</RnText>
          <RnText color="content.secondary" variant="body">
            Swipe down or tap outside to close.
          </RnText>
        </Box>
      </Sheet>
    </>
  )
}
