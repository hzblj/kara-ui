import {
  Box,
  Collapsible,
  Divider,
  Form,
  HStack,
  Island,
  List,
  ListItem,
  RnScrollView,
  RnText,
  RnView,
  ScrollEdgeContainer,
  Spacer,
  Switch,
  Text,
  TextField,
  VStack,
  ZStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'
import {Platform} from 'react-native'

import {Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {KARA_MODULE, NATIVE} from './tags'

const StacksDemo = () => (
  <>
    <Section caption="Children one under another, spaced by a token." title="VStack">
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s8" wide>
          <Text variant="headline">Order #1024</Text>
          <Text color="content.secondary">Shipped · arrives Friday</Text>
        </VStack>
      </Island>
    </Section>
    <Section caption="A Spacer pushes the two ends apart." title="HStack">
      <Island>
        <HStack bg="surface.primary" borderRadius="large" p="s16" wide>
          <Text>Subtotal</Text>
          <Spacer />
          <Text variant="headline">€129</Text>
        </HStack>
      </Island>
    </Section>
    <Section caption="Children layered on top of each other." title="ZStack">
      <Island>
        <ZStack align="center" bg="fill.accent.primary" borderRadius="large" h={96} wide>
          <Text color="content.on.bg" variant="headingXs">
            On top
          </Text>
        </ZStack>
      </Island>
    </Section>
    <Section title="Divider">
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <Text>Above</Text>
          <Divider />
          <Text>Below</Text>
        </VStack>
      </Island>
    </Section>
  </>
)

const IslandDemo = () => (
  <>
    <Section
      caption="An Island is a native host inside React Native layout. Native components only render inside one (or a Screen)."
      title="Island"
    >
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
          <Text>A SwiftUI or Compose view, sized to its content.</Text>
        </VStack>
      </Island>
    </Section>
    <Section caption="RnView carries React Native content back into a native layout." title="RnView">
      <Island h={96} matchContents={false}>
        <VStack bg="surface.primary" borderRadius="large" p="s12" spacing="s8" wide>
          <Text variant="footnote">Three React Native boxes:</Text>
          <RnView>
            <Box flexDirection="row" gap="s8">
              <Box bg="fill.accent.primary" borderRadius="small" h={32} w={32} />
              <Box bg="fill.destructive.primary" borderRadius="small" h={32} w={32} />
              <Box bg="fill.success.primary" borderRadius="small" h={32} w={32} />
            </Box>
          </RnView>
        </VStack>
      </Island>
    </Section>
  </>
)

const ListDemo = () => (
  <Section caption="A list scrolls, so it needs a height — here, the island’s.">
    <Island h={240} matchContents={false}>
      <List>
        <ListItem icon="user" onPress={() => undefined} subtitle="Name, email, password" title="Account" />
        <ListItem icon="notification" onPress={() => undefined} subtitle="Orders, offers" title="Notifications" />
        <ListItem icon="lock" subtitle="Face ID is on" title="Privacy" />
      </List>
    </Island>
  </Section>
)

/** SwiftUI's form scrolls like a list and needs a height; Android's is a column of cards that sizes itself. */
const FORM_ISLAND = Platform.OS === 'ios' ? {h: 400, matchContents: false} : {}

const FormDemo = () => (
  <Section>
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
  </Section>
)

const CollapsibleDemo = () => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Section>
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
          <Collapsible expanded={expanded} label="Shipping and returns" onExpandedChange={setExpanded}>
            <Text color="content.secondary" variant="subheadline">
              Free shipping over €50. Returns within 30 days, no questions asked.
            </Text>
          </Collapsible>
        </VStack>
      </Island>
    </Section>
  )
}

const SCROLL_ROWS = Array.from({length: 24}, (_, index) => `Row ${index + 1}`)

const ScrollEdgeContainerDemo = () => (
  <Section caption="Scroll it: on iOS 26 the content blurs softly under the bars; on Android they fill, as a Material top app bar does.">
    <Box borderRadius="large" h={300} overflow="hidden">
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
  </Section>
)

export const LAYOUT: CatalogEntry[] = [
  {
    code: '<VStack spacing="s8">\n  <Text>Order #1024</Text>\n  <Text>Shipped</Text>\n</VStack>',
    Demo: StacksDemo,
    id: 'stacks',
    name: 'Stacks',
    summary: 'VStack, HStack and ZStack lay native views out in a column, a row or layers.',
    tags: NATIVE,
  },
  {
    code: '<Island>\n  <Button label="Continue" />\n</Island>',
    Demo: IslandDemo,
    id: 'island',
    name: 'Island',
    summary: 'Where native views meet React Native layout.',
    tags: NATIVE,
  },
  {
    code: '<List>\n  <ListItem icon="user" title="Account" onPress={open} />\n</List>',
    Demo: ListDemo,
    id: 'list',
    name: 'List',
    summary: 'A native scrolling list of rows.',
    tags: NATIVE,
  },
  {
    code: '<Form>\n  <Form.Section title="Notifications">\n    <Switch label="Order updates" value />\n  </Form.Section>\n</Form>',
    Demo: FormDemo,
    id: 'form',
    name: 'Form',
    summary: 'Grouped sections of settings and fields.',
    tags: NATIVE,
  },
  {
    code: '<Collapsible label="Shipping and returns" expanded={open} onExpandedChange={setOpen}>\n  <Text>…</Text>\n</Collapsible>',
    Demo: CollapsibleDemo,
    id: 'collapsible',
    name: 'Collapsible',
    summary: 'Content that expands under its label.',
    tags: NATIVE,
  },
  {
    code: '<ScrollEdgeContainer topBar={<Toolbar />}>\n  <RnScrollView>{content}</RnScrollView>\n</ScrollEdgeContainer>',
    Demo: ScrollEdgeContainerDemo,
    id: 'scroll-edge-container',
    name: 'ScrollEdgeContainer',
    summary: 'Bars over a scroll view, with the iOS 26 scroll edge effect under them.',
    tags: KARA_MODULE,
  },
]
