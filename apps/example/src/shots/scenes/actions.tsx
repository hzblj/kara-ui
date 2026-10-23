import {
  ActionSheet,
  Box,
  Button,
  ContextMenu,
  Fab,
  FabMenu,
  HStack,
  IconButton,
  Image,
  Island,
  Link,
  List,
  ListItem,
  Menu,
  type MenuAction,
  Pressable,
  RnIcon,
  RnText,
  Spacer,
  SwipeActions,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {Platform} from 'react-native'

import {PHOTOS} from '../../catalog/zoom/photos'
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
      <IconButton accessibilityLabel="Share" name="share" onPress={noop} />
      <IconButton accessibilityLabel="Like" name="heart" onPress={noop} />
      <IconButton accessibilityLabel="Locked" disabled name="lock" />
    </HStack>
  </Island>
)

const FabScene: Scene = () => (
  <Island>
    <HStack spacing="s20">
      <Fab accessibilityLabel="Add" name="add" onPress={noop} />
      <Fab accessibilityLabel="Search" name="search" onPress={noop} />
    </HStack>
  </Island>
)

/** At the bottom of the stage, so the actions rising out of it stay inside the band. */
const FabMenuScene: Scene = () => (
  <Box h={280} justify="flex-end">
    <Island>
      <FabMenu accessibilityLabel="Create" actions={ACTIONS} testID="shot-fab-menu" />
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
const MENU_PHOTO = PHOTOS[1]

/**
 * A photo card from a board, held for its menu. iOS lifts a larger preview of it above the menu, which needs the
 * whole screen (the shot's `frame` is `screen` there); Android opens Material's menu under the card, within the band.
 */
const ContextMenuScene: Scene = () => (
  <Box align="center" bg="surface.base" flex={1} justify="center">
    <ContextMenu
      actions={ACTIONS}
      bg="surface.primary"
      borderRadius="large"
      overflow="hidden"
      preview={
        <Box bg="surface.primary" w={300}>
          <Image cachePolicy="memory-disk" contentFit="cover" h={225} source={{uri: MENU_PHOTO?.uri}} w={300} />
          <Box gap="s4" p="s16">
            <RnText variant="headline">{MENU_PHOTO?.title}</RnText>
            <RnText color="content.secondary" variant="footnote">
              Saved to your board
            </RnText>
          </Box>
        </Box>
      }
      testID="shot-context-menu"
      w={210}
    >
      <Image cachePolicy="memory-disk" contentFit="cover" h={150} source={{uri: MENU_PHOTO?.uri}} w={210} />
      <Box gap="s2" px="s12" py="s10">
        <RnText variant="headline">{MENU_PHOTO?.title}</RnText>
        <RnText color="content.secondary" variant="footnote">
          Press and hold for options
        </RnText>
      </Box>
    </ContextMenu>
  </Box>
)

/** The flow swipes the first row open toward the leading edge, then the second toward the trailing one. */
const SwipeActionsScene: Scene = () => (
  <Island h={200} matchContents={false}>
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

const PRESS_PHOTO = PHOTOS[2]?.uri

/**
 * Each way a press can answer, held one after the other by the flow, top to bottom: a card that eases down, a row
 * that dims, and a button on the platform's own (a spring on iOS, the ripple alone on Android, which ripples under all
 * three).
 */
const PressableScene: Scene = () => (
  <Box gap="s12">
    <Pressable
      align="center"
      bg="surface.primary"
      borderRadius="large"
      flexDirection="row"
      gap="s12"
      onPress={noop}
      p="s12"
      pressEffect="scale"
    >
      <Image
        borderRadius="medium"
        cachePolicy="memory-disk"
        contentFit="cover"
        h={52}
        source={{uri: PRESS_PHOTO}}
        w={52}
      />
      <Box flex={1} gap="s2">
        <RnText variant="headline">Air Max 90</RnText>
        <RnText color="content.secondary" variant="footnote">
          scale · eases down while held
        </RnText>
      </Box>
      <RnText variant="headline">€129</RnText>
    </Pressable>
    <Pressable
      align="center"
      bg="surface.primary"
      borderRadius="large"
      flexDirection="row"
      gap="s12"
      onPress={noop}
      p="s16"
      pressEffect="opacity"
    >
      <RnIcon name="shopping-bag" size="s20" />
      <Box flex={1} gap="s2">
        <RnText variant="headline">Order #1024</RnText>
        <RnText color="content.secondary" variant="footnote">
          opacity · dims while held
        </RnText>
      </Box>
      <RnIcon color="content.tertiary" name="chevron-right" size="s20" />
    </Pressable>
    <Pressable align="center" bg="fill.accent.primary" borderRadius="full" onPress={noop} p="s16">
      <RnText color="content.on.accent" variant="headline">
        Add to bag
      </RnText>
    </Pressable>
  </Box>
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
