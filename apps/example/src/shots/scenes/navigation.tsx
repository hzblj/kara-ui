import {Box, Button, Island, NavigationBar, type NavigationBarItem, RnText, Sheet, Text, VStack} from '@hzblj/kara-ui'

import {Platform} from 'react-native'

import type {Scene} from '../shot.types'
import {useOpened} from '../use-timeline'

const noop = () => undefined
const BACK: NavigationBarItem[] = [{onPress: noop, type: 'back'}]
const CLOSE: NavigationBarItem[] = [{onPress: noop, type: 'close'}]
const PRODUCT: NavigationBarItem[] = [
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

const NavigationBarScene: Scene = () => (
  <Box gap="s16">
    <Bar>
      <NavigationBar leadingItems={BACK} title="Checkout" trailingItems={CLOSE} />
    </Bar>
    <Bar>
      <NavigationBar leadingItems={BACK} title="Air Max 90" trailingItems={PRODUCT} />
    </Bar>
  </Box>
)

const SheetScene: Scene = ({step}) => {
  const visible = useOpened(step === 0)

  return (
    <>
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <VStack align="start" spacing="s2">
            <Text variant="headline">Air Max 90</Text>
            <Text color="content.secondary" variant="footnote">
              €139 · Leather and mesh
            </Text>
          </VStack>
          <Button label="Choose a size" wide />
        </VStack>
      </Island>
      <Sheet onDismiss={noop} visible={visible}>
        <Sheet.Header title="Choose a size" trailingItems={CLOSE} />
        <Box gap="s16" pb="s32" px="s20">
          <RnText color="content.secondary" variant="body">
            The sheet sizes itself to this content. The bar above is a real navigation bar.
          </RnText>
          <Island>
            <Button label="Done" wide />
          </Island>
        </Box>
      </Sheet>
    </>
  )
}

export const NAVIGATION_SCENES = {
  'navigation-bar': NavigationBarScene,
  sheet: SheetScene,
}
