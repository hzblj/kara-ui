import {
  Avatar,
  Box,
  Divider,
  Form,
  Island,
  RnFlatList,
  RnScrollView,
  RnText,
  Screen,
  ScrollView,
  Stagger,
  Switch,
  Text,
  TextField,
  VStack,
} from '@hzblj/kara-ui'

import type {Scene} from '../shot.types'

const BoxScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" gap="s16" p="s16">
    <Box align="center" flexDirection="row" gap="s12">
      <Avatar initials="AN" size="lg" />
      <Box flex={1} gap="s2">
        <RnText variant="headline">Anna Novak</RnText>
        <RnText color="content.secondary" variant="footnote">
          Prague · member since 2021
        </RnText>
      </Box>
    </Box>
    <Box flexDirection="row" gap="s8">
      <Box align="center" bg="fill.accent.base" borderRadius="medium" flex={1} gap="s2" py="s12">
        <RnText color="content.accent" variant="headline">
          12
        </RnText>
        <RnText color="content.secondary" variant="label">
          Orders
        </RnText>
      </Box>
      <Box align="center" bg="fill.tertiary" borderRadius="medium" flex={1} gap="s2" py="s12">
        <RnText variant="headline">34</RnText>
        <RnText color="content.secondary" variant="label">
          Wishlist
        </RnText>
      </Box>
    </Box>
  </Box>
)

const RnTextScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" gap="s4" p="s20">
    <RnText variant="headingS">Order summary</RnText>
    <RnText color="content.secondary" variant="body">
      2 items · arrives Friday
    </RnText>
    <RnText color="content.accent" variant="footnoteMedium">
      Track parcel
    </RnText>
  </Box>
)

const ROWS = Array.from({length: 12}, (_, index) => `Order #${1024 + index}`)

const RnScrollViewScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" h={250} overflow="hidden">
    <RnScrollView content={{gap: 's12', p: 's16'}}>
      {ROWS.map(row => (
        <Box borderBottomWidth={1} borderColor="border.tertiary" gap="s2" key={row} pb="s12">
          <RnText variant="headline">{row}</RnText>
          <RnText color="content.secondary" variant="footnote">
            Shipped · arrives Friday
          </RnText>
        </Box>
      ))}
    </RnScrollView>
  </Box>
)

const ORDERS = ROWS.slice(0, 6).map(title => ({id: title, title}))

const RnFlatListScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" h={250} overflow="hidden">
    <RnFlatList
      data={ORDERS}
      keyExtractor={order => order.id}
      renderItem={({item}) => (
        <Island>
          <VStack align="start" px="s16" py="s12" spacing="s2" wide>
            <Text variant="headline">{item.title}</Text>
            <Text color="content.secondary" variant="footnote">
              Native row, in a React Native list
            </Text>
          </VStack>
        </Island>
      )}
    />
  </Box>
)

const ScrollViewScene: Scene = () => (
  <Island h={250} matchContents={false}>
    <ScrollView bg="surface.primary" borderRadius="large" p="s16" spacing="s12">
      {ROWS.slice(0, 8).map(row => (
        <VStack align="start" key={row} spacing="s8" wide>
          <Text variant="headline">{row}</Text>
          <Divider />
        </VStack>
      ))}
    </ScrollView>
  </Island>
)

/** A whole native screen: `Screen` owns the viewport, so this one is shot full-bleed rather than on a stage. */
const ScreenScene: Scene = () => (
  <Screen>
    <Form>
      <Form.Section footer="We only send what you ask for." title="Notifications">
        <Switch label="Order updates" onValueChange={() => undefined} value />
        <Switch label="Offers" onValueChange={() => undefined} value={false} />
      </Form.Section>
      <Form.Section title="Profile">
        <TextField defaultValue="Anna Novak" label="Display name" />
        <TextField defaultValue="you@example.com" label="Email" />
      </Form.Section>
    </Form>
  </Screen>
)

const STAGGER_LINES = ['Linen shirt', 'Canvas tote', 'Wool socks, 2 pairs', 'Leather belt']

/**
 * Shown (the still), gone, then arriving one after another: the last step ends where the first began, shown, so the
 * loop has no seam and the arrival plays inside it.
 */
const StaggerScene: Scene = ({step}) => (
  <Box h={232}>
    {step !== 1 ? (
      <Stagger exiting="fade" gap="s8">
        {STAGGER_LINES.map(line => (
          <Box bg="surface.primary" borderRadius="medium" key={line} px="s16" py="s12">
            <RnText variant="body">{line}</RnText>
          </Box>
        ))}
      </Stagger>
    ) : null}
  </Box>
)

export const PRIMITIVE_SCENES = {
  box: BoxScene,
  'rn-flat-list': RnFlatListScene,
  'rn-scroll-view': RnScrollViewScene,
  'rn-text': RnTextScene,
  screen: ScreenScene,
  'scroll-view': ScrollViewScene,
  stagger: StaggerScene,
}
