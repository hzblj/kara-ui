import {
  Box,
  ContextMenu,
  FabMenu,
  GlassView,
  Island,
  type MenuAction,
  NavigationBar,
  type NavigationBarItem,
  Pressable,
  RnScrollView,
  RnText,
  RnTooltip,
  ScrollEdgeContainer,
} from '@hzblj/kara-ui'
import {useState} from 'react'

const noop = () => undefined

const MENU_ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: noop},
  {icon: 'star', label: 'Favourite', onPress: noop},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: noop},
]

const SCROLL_ROWS = Array.from({length: 24}, (_, index) => `Row ${index + 1}`)

export const GlassViewSection = () => (
  <Box bg="fill.accent.primary" borderRadius="large" flexDirection="row" gap="s12" p="s20">
    <GlassView px="s16" py="s8">
      <RnText color="content.on.bg" variant="labelMedium">
        Clear
      </RnText>
    </GlassView>
    <Pressable onPress={noop}>
      <GlassView interactive px="s16" py="s8">
        <RnText color="content.on.bg" pointerEvents="none" variant="labelMedium">
          Interactive
        </RnText>
      </GlassView>
    </Pressable>
  </Box>
)

const BAR_BACK: NavigationBarItem[] = [{onPress: noop, type: 'back'}]
const BAR_CLOSE: NavigationBarItem[] = [{onPress: noop, type: 'close'}]
const BAR_ACTIONS: NavigationBarItem[] = [
  {icon: 'share', label: 'Share', onPress: noop, type: 'icon'},
  {icon: 'heart', label: 'Favourite', onPress: noop, type: 'icon'},
  {onPress: noop, separated: true, type: 'close'},
]

export const NavigationBarSection = () => (
  <Box gap="s8">
    <Box bg="surface.primary" borderRadius="medium" overflow="hidden">
      <NavigationBar leadingItems={BAR_BACK} title="Back and close" trailingItems={BAR_CLOSE} />
    </Box>
    <Box bg="surface.primary" borderRadius="medium" overflow="hidden">
      <NavigationBar leadingItems={BAR_BACK} title="Grouped actions" trailingItems={BAR_ACTIONS} />
    </Box>
    <Box bg="surface.primary" borderRadius="medium" overflow="hidden">
      <NavigationBar leadingItems={BAR_CLOSE} title="Leading title" titleAlignment="leading" />
    </Box>
  </Box>
)

export const ScrollEdgeContainerSection = () => (
  <Box borderRadius="medium" h={260} overflow="hidden">
    <ScrollEdgeContainer
      bottomBar={
        <Box align="center" p="s12">
          <RnText variant="footnoteMedium">Bottom bar</RnText>
        </Box>
      }
      flex={1}
      topBar={
        <Box align="center" p="s12">
          <RnText variant="footnoteMedium">Top bar</RnText>
        </Box>
      }
    >
      <RnScrollView bg="surface.primary" content={{gap: 's8', p: 's12'}}>
        {SCROLL_ROWS.map(row => (
          <RnText key={row} variant="body">
            {row}
          </RnText>
        ))}
      </RnScrollView>
    </ScrollEdgeContainer>
  </Box>
)

export const RnTooltipSection = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Box align="flex-start">
      <RnTooltip
        actions={[{label: 'Got it', onPress: () => setVisible(false)}]}
        message="Anchored below a React Native view, drawn above every sibling."
        onDismiss={() => setVisible(false)}
        title="Rich tooltip"
        visible={visible}
      >
        <Pressable bg="fill.tertiary" borderRadius="medium" onPress={() => setVisible(true)} p="s12">
          <RnText variant="labelMedium">Show tooltip</RnText>
        </Pressable>
      </RnTooltip>
    </Box>
  )
}

export const ContextMenuSection = () => (
  <ContextMenu
    actions={MENU_ACTIONS}
    bg="surface.primary"
    borderRadius="medium"
    p="s16"
    preview={
      <Box bg="surface.primary" gap="s8" p="s24" w={280}>
        <RnText variant="headingXs">Card preview</RnText>
        <RnText color="content.secondary" variant="subheadline">
          Mounted only once a finger rests on the card.
        </RnText>
      </Box>
    }
  >
    <RnText variant="labelMedium">Long-press this card</RnText>
    <RnText color="content.secondary" variant="footnote">
      A React Native subtree with a native context menu and a custom preview.
    </RnText>
  </ContextMenu>
)

export const FabMenuSection = () => (
  <Island>
    <FabMenu actions={MENU_ACTIONS} />
  </Island>
)
