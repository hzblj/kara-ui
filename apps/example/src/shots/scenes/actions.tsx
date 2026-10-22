import {
  ActionSheet,
  Box,
  Button,
  ContextMenu,
  Fab,
  FabMenu,
  HStack,
  IconButton,
  Island,
  Link,
  List,
  ListItem,
  Menu,
  type MenuAction,
  Pressable,
  RnText,
  Spacer,
  SwipeActions,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {Platform} from 'react-native'

import type {Scene} from '../shot.types'
import {useOpened} from '../use-timeline'

const noop = () => undefined

const ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: noop},
  {icon: 'heart', label: 'Add to favourites', onPress: noop},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: noop},
]

const ButtonScene: Scene = () => (
  <Island>
    <VStack spacing="s12" wide>
      <Button label="Continue" wide />
      <Button label="Add to wishlist" variant="secondary" wide />
      <Button label="Delete account" variant="destructive" wide />
    </VStack>
  </Island>
)

const IconButtonScene: Scene = () => (
  <Island>
    <HStack bg="surface.primary" borderRadius="large" p="s16" spacing="s8" wide>
      <VStack align="start" spacing="s2">
        <Text variant="headline">Air Max 90</Text>
        <Text color="content.secondary" variant="footnote">
          €139
        </Text>
      </VStack>
      <Spacer />
      <IconButton name="share" onPress={noop} />
      <IconButton name="heart" onPress={noop} />
      <IconButton disabled name="lock" />
    </HStack>
  </Island>
)

const FabScene: Scene = () => (
  <Island>
    <HStack spacing="s20">
      <Fab name="add" onPress={noop} />
      <Fab name="search" onPress={noop} />
    </HStack>
  </Island>
)

/** At the bottom of the stage, so the actions rising out of it stay inside the band. */
const FabMenuScene: Scene = () => (
  <Box h={280} justify="flex-end">
    <Island>
      <FabMenu actions={ACTIONS} testID="shot-fab-menu" />
    </Island>
  </Box>
)

const LinkScene: Scene = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s20" spacing="s16" wide>
      <Link label="expo.dev" url="https://expo.dev" />
      <Link icon="info" label="Read the docs" url="https://github.com/hzblj/kara-ui" />
    </VStack>
  </Island>
)

/**
 * iOS unfolds the menu upwards out of its label and Android drops it down, so the label sits at the edge of the stage
 * the menu grows away from — and the open menu stays inside the band the still is cropped to.
 */
const MenuScene: Scene = () => (
  <Box h={260} justify={Platform.OS === 'ios' ? 'flex-end' : 'flex-start'}>
    <Island>
      <Menu actions={ACTIONS} label="More options" />
    </Island>
  </Box>
)

/**
 * iOS 26 opens the dialog as a popover above its anchor, so there the card is only the button, at the foot of the
 * stage — the popover then has the stage's height to grow into. Android's rises from the screen's bottom edge, over
 * the whole card.
 */
const ActionSheetScene: Scene = ({step}) => {
  const visible = useOpened(step === 0)
  const isIos = Platform.OS === 'ios'

  return (
    <Box h={isIos ? 280 : undefined} justify="flex-end">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          {isIos ? null : (
            <VStack align="start" spacing="s2" wide>
              <Text variant="headline">Air Max 90</Text>
              <Text color="content.secondary" variant="footnote">
                In your wishlist
              </Text>
            </VStack>
          )}
          <Button label="Show actions" variant="secondary" wide />
          {/* Centred under the button: the popover points at this spot. */}
          <HStack wide>
            <Spacer />
            <ActionSheet actions={ACTIONS} onDismiss={noop} title="Air Max 90" visible={visible} />
            <Spacer />
          </HStack>
        </VStack>
      </Island>
    </Box>
  )
}

/** At the top of the stage: the lifted preview stays in place and the menu opens under it, inside the band. */
const ContextMenuScene: Scene = () => (
  <Box h={270}>
    <ContextMenu
      actions={ACTIONS}
      bg="surface.primary"
      borderRadius="large"
      gap="s4"
      p="s20"
      preview={
        <Box bg="surface.primary" gap="s8" p="s24" w={280}>
          <RnText variant="headingXs">Air Max 90</RnText>
          <RnText color="content.secondary" variant="subheadline">
            Leather, mesh and a visible Air unit.
          </RnText>
        </Box>
      }
      testID="shot-context-menu"
    >
      <RnText variant="headline">Air Max 90</RnText>
      <RnText color="content.secondary" variant="footnote">
        Press and hold for options
      </RnText>
    </ContextMenu>
  </Box>
)

/** The flow swipes the first row open toward the leading edge, then the second toward the trailing one. */
const SwipeActionsScene: Scene = () => (
  <Island matchContents={false} style={{height: 200}}>
    <List>
      <SwipeActions
        trailing={[
          {destructive: true, icon: 'trash', label: 'Delete', onPress: noop},
          {icon: 'share', label: 'Share', onPress: noop},
        ]}
      >
        <ListItem subtitle="Shipped · arrives Friday" title="Order #1024" />
      </SwipeActions>
      <SwipeActions allowsFullSwipe={false} leading={[{icon: 'star', label: 'Pin', onPress: noop}]}>
        <ListItem subtitle="Delivered on Monday" title="Order #1025" />
      </SwipeActions>
    </List>
  </Island>
)

const PressableScene: Scene = () => (
  <Pressable align="center" bg="fill.accent.primary" borderRadius="large" haptic onPress={noop} p="s24" wide>
    <RnText color="content.on.bg" variant="headline">
      Press me
    </RnText>
  </Pressable>
)

export const ACTION_SCENES = {
  'action-sheet': ActionSheetScene,
  button: ButtonScene,
  'context-menu': ContextMenuScene,
  fab: FabScene,
  'fab-menu': FabMenuScene,
  'icon-button': IconButtonScene,
  link: LinkScene,
  menu: MenuScene,
  pressable: PressableScene,
  'swipe-actions': SwipeActionsScene,
}
