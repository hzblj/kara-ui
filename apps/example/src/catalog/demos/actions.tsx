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
  SwipeActions,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {useMemo, useState} from 'react'
import {Platform} from 'react-native'

import {Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {IOS_ONLY, KARA_MODULE, NATIVE, REACT_NATIVE} from './tags'

const noop = () => undefined

const useActions = (onAction: (name: string) => void): MenuAction[] =>
  useMemo(
    () => [
      {icon: 'share', label: 'Share', onPress: () => onAction('Share')},
      {icon: 'heart', label: 'Add to favourites', onPress: () => onAction('Add to favourites')},
      {destructive: true, icon: 'trash', label: 'Delete', onPress: () => onAction('Delete')},
    ],
    [onAction]
  )

const ButtonDemo = () => (
  <>
    <Section title="Variants">
      <Island>
        <VStack spacing="s8" wide>
          <Button label="Continue" />
          <Button label="Add to wishlist" variant="secondary" />
          <Button label="Delete account" variant="destructive" />
          <Button label="Not now" variant="glass" />
        </VStack>
      </Island>
    </Section>
    <Section title="Disabled">
      <Island>
        <VStack spacing="s8" wide>
          <Button disabled label="Continue" />
          <Button disabled label="Add to wishlist" variant="secondary" />
        </VStack>
      </Island>
    </Section>
    <Section
      caption="Any colour token can fill a button, and the label picks a colour that reads on it. On iOS 26 a tinted glass button stays glass."
      title="Tinted"
    >
      <Island>
        <VStack spacing="s8" wide>
          <Button label="Tinted glass" tint="fill.accent.primary" variant="glass" />
          <Button buttonStyle="glassProminent" label="Prominent" tint="fill.accent.primary" />
          <Button buttonStyle="glassProminent" label="Prominent, muted" tint="fill.accent.base" />
        </VStack>
      </Island>
    </Section>
  </>
)

const IconButtonDemo = () => (
  <Section caption="Disabled buttons dim and stop responding.">
    <Island>
      <HStack spacing="s8">
        <IconButton name="add" onPress={noop} />
        <IconButton name="share" onPress={noop} />
        <IconButton name="heart" onPress={noop} />
        <IconButton disabled name="lock" />
      </HStack>
    </Island>
  </Section>
)

const FabDemo = () => (
  <Section caption="Material's floating action button on Android, a round prominent button on iOS.">
    <Island>
      <HStack spacing="s12">
        <Fab name="add" onPress={noop} />
        <Fab name="search" onPress={noop} />
      </HStack>
    </Island>
  </Section>
)

const FabMenuDemo = () => (
  <Section caption="Tap it: Material 3 Expressive's FAB menu on Android, a native menu on iOS.">
    <Island>
      <FabMenu actions={useActions(noop)} />
    </Island>
  </Section>
)

const LinkDemo = () => (
  <Section caption="Opens in the system browser.">
    <Island>
      <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
        <Link label="expo.dev" url="https://expo.dev" />
        <Link icon="info" label="Read the docs" url="https://github.com/hzblj/kara-ui" />
      </VStack>
    </Island>
  </Section>
)

const MenuDemo = () => {
  const [picked, setPicked] = useState('Nothing yet')

  return (
    <Section caption={`Picked: ${picked}`}>
      <Island>
        <Menu actions={useActions(setPicked)} label="More options" />
      </Island>
    </Section>
  )
}

const ActionSheetDemo = () => {
  const [visible, setVisible] = useState(false)
  const [picked, setPicked] = useState('Nothing yet')

  return (
    <Section caption={`Picked: ${picked}`}>
      <Island>
        <VStack wide>
          <Button label="Show actions" onPress={() => setVisible(true)} variant="secondary" />
          <ActionSheet
            actions={useActions(setPicked)}
            onDismiss={() => setVisible(false)}
            title="Air Max 90"
            visible={visible}
          />
        </VStack>
      </Island>
    </Section>
  )
}

const ContextMenuDemo = () => (
  <Section caption="Press and hold the card. On iOS it lifts into a custom preview above the menu.">
    <ContextMenu
      actions={useActions(noop)}
      bg="surface.primary"
      borderRadius="large"
      p="s16"
      preview={
        <Box bg="surface.primary" gap="s8" p="s24" w={280}>
          <RnText variant="headingXs">Air Max 90</RnText>
          <RnText color="content.secondary" variant="subheadline">
            The preview is any React Native view, mounted only when the menu opens.
          </RnText>
        </Box>
      }
    >
      <RnText variant="headline">Air Max 90</RnText>
      <RnText color="content.secondary" variant="footnote">
        Press and hold for options
      </RnText>
    </ContextMenu>
  </Section>
)

const SwipeActionsDemo = () =>
  Platform.OS === 'ios' ? (
    <Section caption="Swipe a row left or right.">
      <Island matchContents={false} style={{height: 200}}>
        <List>
          <SwipeActions>
            <ListItem subtitle="Swipe left to delete" title="Order #1024" />
            <SwipeActions.Actions>
              <Button label="Delete" variant="destructive" />
            </SwipeActions.Actions>
          </SwipeActions>
          <SwipeActions>
            <ListItem subtitle="Swipe right to pin" title="Order #1025" />
            <SwipeActions.Actions allowsFullSwipe={false} edge="leading">
              <Button label="Pin" variant="secondary" />
            </SwipeActions.Actions>
          </SwipeActions>
        </List>
      </Island>
    </Section>
  ) : (
    <Section caption="SwiftUI has swipe actions and Compose does not, so on Android the row stays and the actions do not appear.">
      <Island>
        <Text color="content.secondary">Available on iOS.</Text>
      </Island>
    </Section>
  )

const PressableDemo = () => {
  const [count, setCount] = useState(0)

  return (
    <Section caption="Any React Native content, with a gentle press scale and haptic feedback.">
      <Pressable
        align="center"
        bg="fill.accent.primary"
        borderRadius="large"
        haptic
        onPress={() => setCount(value => value + 1)}
        p="s20"
        wide
      >
        <RnText color="content.on.bg" variant="headline">
          {count === 0 ? 'Press me' : `Pressed ${count}×`}
        </RnText>
      </Pressable>
    </Section>
  )
}

export const ACTIONS: CatalogEntry[] = [
  {
    code: '<Button label="Continue" onPress={next} />\n<Button label="Not now" variant="glass" />',
    Demo: ButtonDemo,
    id: 'button',
    name: 'Button',
    summary: 'The platform’s own button, in four variants: accent, secondary, destructive and glass.',
    tags: NATIVE,
  },
  {
    code: '<IconButton name="share" onPress={share} />',
    Demo: IconButtonDemo,
    id: 'icon-button',
    name: 'IconButton',
    summary: 'A button that is just an icon, for toolbars and compact rows.',
    tags: NATIVE,
  },
  {
    code: '<Fab name="add" onPress={create} />',
    Demo: FabDemo,
    id: 'fab',
    name: 'Fab',
    summary: 'The screen’s primary action, floating above the content.',
    tags: NATIVE,
  },
  {
    code: '<FabMenu actions={actions} />',
    Demo: FabMenuDemo,
    id: 'fab-menu',
    name: 'FabMenu',
    summary: 'A floating button that opens a few related actions.',
    tags: KARA_MODULE,
  },
  {
    code: '<Link label="expo.dev" url="https://expo.dev" />',
    Demo: LinkDemo,
    id: 'link',
    name: 'Link',
    summary: 'Text that opens a URL.',
    tags: NATIVE,
  },
  {
    code: '<Menu label="More options" actions={actions} />',
    Demo: MenuDemo,
    id: 'menu',
    name: 'Menu',
    summary: 'A list of actions that drops down from a label.',
    tags: NATIVE,
  },
  {
    code: '<ActionSheet title="Air Max 90" actions={actions} visible={open} onDismiss={close} />',
    Demo: ActionSheetDemo,
    id: 'action-sheet',
    name: 'ActionSheet',
    summary: 'Actions that slide up from the bottom of the screen.',
    tags: NATIVE,
  },
  {
    code: '<ContextMenu actions={actions} preview={<Preview />}>\n  <ProductCard />\n</ContextMenu>',
    Demo: ContextMenuDemo,
    id: 'context-menu',
    name: 'ContextMenu',
    summary: 'A long-press menu on any React Native content, with a custom preview on iOS.',
    tags: KARA_MODULE,
  },
  {
    code: '<SwipeActions>\n  <ListItem title="Order #1024" />\n  <SwipeActions.Actions>\n    <Button label="Delete" variant="destructive" />\n  </SwipeActions.Actions>\n</SwipeActions>',
    Demo: SwipeActionsDemo,
    id: 'swipe-actions',
    name: 'SwipeActions',
    summary: 'Buttons revealed by swiping a list row.',
    tags: IOS_ONLY,
  },
  {
    code: '<Pressable haptic onPress={open} p="s16">\n  <RnText>Anything</RnText>\n</Pressable>',
    Demo: PressableDemo,
    id: 'pressable',
    name: 'Pressable',
    summary: 'Makes any React Native content tappable, with press feedback built in.',
    tags: REACT_NATIVE,
  },
]
