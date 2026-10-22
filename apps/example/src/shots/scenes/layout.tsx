import {
  Box,
  Collapsible,
  Divider,
  Form,
  HStack,
  Island,
  List,
  ListItem,
  Pager,
  RnScrollView,
  RnText,
  RnView,
  ScrollEdgeContainer,
  Spacer,
  Switch,
  Text,
  TextField,
  VStack,
} from '@hzblj/kara-ui'
import {Platform} from 'react-native'

import type {Scene} from '../shot.types'

const noop = () => undefined

const StacksScene: Scene = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
      <VStack align="start" spacing="s4">
        <Text variant="headline">Order #1024</Text>
        <Text color="content.secondary">Shipped · arrives Friday</Text>
      </VStack>
      <Divider />
      <HStack wide>
        <Text>Subtotal</Text>
        <Spacer />
        <Text variant="headline">€129</Text>
      </HStack>
    </VStack>
  </Island>
)

const IslandScene: Scene = () => (
  <Island h={120} matchContents={false}>
    <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
      <Text variant="labelMedium">Native layout, React Native inside:</Text>
      <RnView>
        <Box flexDirection="row" gap="s8">
          <Box bg="fill.accent.primary" borderRadius="small" h={36} w={36} />
          <Box bg="fill.destructive.primary" borderRadius="small" h={36} w={36} />
          <Box bg="fill.success.primary" borderRadius="small" h={36} w={36} />
        </Box>
      </RnView>
    </VStack>
  </Island>
)

/** Tall enough for all three rows and the grouped list's own insets above and below them. */
const ListScene: Scene = () => (
  <Island h={292} matchContents={false}>
    <List>
      <ListItem icon="user" onPress={noop} subtitle="Name, email, password" title="Account" />
      <ListItem icon="notification" onPress={noop} subtitle="Orders, offers" title="Notifications" />
      <ListItem icon="lock" subtitle="Face ID is on" title="Privacy" />
    </List>
  </Island>
)

const ListItemScene: Scene = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" wide>
      <ListItem icon="shopping-bag" onPress={noop} px="s16" subtitle="2 in progress" title="Orders" />
      <VStack px="s16" wide>
        <Divider />
      </VStack>
      <ListItem icon="heart" onPress={noop} px="s16" subtitle="12 items" title="Wishlist" />
    </VStack>
  </Island>
)

/** SwiftUI's form scrolls like a list and needs a height; Android's is a column of cards that sizes itself. */
const FORM_ISLAND = Platform.OS === 'ios' ? {matchContents: false, style: {height: 280}} : {}

const FormScene: Scene = () => (
  <Island {...FORM_ISLAND}>
    <Form>
      <Form.Section footer="We only send what you ask for." title="Notifications">
        <Switch label="Order updates" value />
        <Switch label="Offers" value={false} />
      </Form.Section>
      <Form.Section title="Profile">
        <TextField label="Display name" />
      </Form.Section>
    </Form>
  </Island>
)

const CollapsibleScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
      <Collapsible expanded={step === 0} label="Shipping and returns" onExpandedChange={noop}>
        <Text color="content.secondary" variant="subheadline">
          Free shipping over €50. Returns within 30 days, no questions asked.
        </Text>
      </Collapsible>
    </VStack>
  </Island>
)

const SCROLL_ROWS = Array.from({length: 24}, (_, index) => `Row ${index + 1}`)

const ScrollEdgeContainerScene: Scene = () => (
  <Box borderRadius="large" h={260} overflow="hidden">
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
      <RnScrollView bg="surface.primary" content={{gap: 's12', p: 's16'}}>
        {SCROLL_ROWS.map(row => (
          <RnText key={row} variant="body">
            {row}
          </RnText>
        ))}
      </RnScrollView>
    </ScrollEdgeContainer>
  </Box>
)

const PAGES = [
  {bg: 'fill.accent.primary', title: 'New in'},
  {bg: 'fill.success.primary', title: 'Running'},
  {bg: 'fill.destructive.primary', title: 'Sale'},
] as const

const PagerScene: Scene = ({step}) => (
  <Island h={220} matchContents={false}>
    <Pager indicators onPageChange={noop} page={step}>
      {PAGES.map(page => (
        <VStack align="center" bg={page.bg} borderRadius="large" key={page.title} tall wide>
          <Spacer />
          <Text color="content.on.bg" variant="headingS">
            {page.title}
          </Text>
          <Spacer />
        </VStack>
      ))}
    </Pager>
  </Island>
)

export const LAYOUT_SCENES = {
  collapsible: CollapsibleScene,
  form: FormScene,
  island: IslandScene,
  list: ListScene,
  'list-item': ListItemScene,
  pager: PagerScene,
  'scroll-edge-container': ScrollEdgeContainerScene,
  stacks: StacksScene,
}
