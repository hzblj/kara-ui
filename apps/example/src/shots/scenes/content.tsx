import {
  Avatar,
  Badge,
  type BlurMaterial,
  BlurView,
  Box,
  Button,
  Card,
  Divider,
  EmptyState,
  GlassView,
  HStack,
  Icon,
  type IconName,
  Image,
  Island,
  Label,
  LabeledContent,
  Pressable,
  RnIcon,
  RnText,
  Spacer,
  Surface,
  Switch,
  Text,
  VStack,
} from '@hzblj/kara-ui'

import {PHOTOS} from '../../catalog/zoom/photos'
import type {Scene} from '../shot.types'

const noop = () => undefined

const InsetDivider = () => (
  <VStack px="s16" wide>
    <Divider />
  </VStack>
)

const TextScene: Scene = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s20" spacing="s4" wide>
      <Text variant="headingL">Order summary</Text>
      <Text variant="headline">Air Max 90 · EU 42</Text>
      <Text color="content.secondary" variant="body">
        Arrives Friday, free returns within 30 days.
      </Text>
      <Text color="content.accent" variant="footnoteMedium">
        Track parcel
      </Text>
    </VStack>
  </Island>
)

const LabelScene: Scene = () => (
  <Island>
    <VStack align="start" bg="surface.primary" borderRadius="large" p="s20" spacing="s16" wide>
      <Label icon="home" title="Home" />
      <Label color="content.accent" icon="star" title="Featured" variant="labelMedium" />
      <Label color="content.destructive" icon="warning" title="Out of stock" variant="footnoteMedium" />
      <Label icon="calendar" iconSize="s16" title="Delivered on Friday" variant="footnote" />
    </VStack>
  </Island>
)

const LabeledContentScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" wide>
      <LabeledContent label="Version" px="s16" value="2.4.0" />
      <InsetDivider />
      <LabeledContent icon="notification" label="Notifications" px="s16" value="On" />
      <InsetDivider />
      <LabeledContent label="Account" onPress={noop} px="s16" value="you@example.com" />
      <InsetDivider />
      <LabeledContent label="Back up photos" px="s16">
        <Switch onValueChange={noop} value={step === 0} />
      </LabeledContent>
    </VStack>
  </Island>
)

const BADGED = [
  {label: 'New', product: 'Air Max 90', tone: 'neutral'},
  {label: 'Sale', product: 'Gel-Kayano 14', tone: 'accent'},
  {label: 'In stock', product: 'Samba OG', tone: 'success'},
  {label: 'Sold out', product: 'Jordan 1 High', tone: 'destructive'},
] as const

const BadgeScene: Scene = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
      {BADGED.map(row => (
        <HStack key={row.product} wide>
          <Text>{row.product}</Text>
          <Spacer />
          <Badge label={row.label} tone={row.tone} />
        </HStack>
      ))}
    </VStack>
  </Island>
)

const PEOPLE = [
  {initials: 'AN', name: 'Anna Novak', role: 'Ordered 2 items'},
  {initials: 'TB', name: 'Tomas Berg', role: 'Wrote a review'},
]

const AvatarScene: Scene = () => (
  <Box bg="surface.primary" borderRadius="large" gap="s16" p="s16">
    {PEOPLE.map(person => (
      <Box align="center" flexDirection="row" gap="s12" key={person.name}>
        <Avatar initials={person.initials} size="lg" />
        <Box gap="s2">
          <RnText variant="headline">{person.name}</RnText>
          <RnText color="content.secondary" variant="footnote">
            {person.role}
          </RnText>
        </Box>
      </Box>
    ))}
    <Box flexDirection="row" gap="s8">
      <Avatar initials="AB" size="sm" />
      <Avatar initials="CD" size="md" />
      <Avatar initials="EF" size="lg" />
    </Box>
  </Box>
)

const ICONS: IconName[] = ['home', 'search', 'heart', 'star', 'share', 'settings']

const IconScene: Scene = () => (
  <Box gap="s24">
    <Island>
      <HStack spacing="s24">
        {ICONS.map(name => (
          <Icon key={name} name={name} />
        ))}
      </HStack>
    </Island>
    <Box flexDirection="row" gap="s24" justify="center">
      <RnIcon color="content.accent" name="heart" />
      <RnIcon color="content.success" name="check" />
      <RnIcon color="content.destructive" name="warning" />
      <RnIcon color="content.secondary" name="notification" />
    </Box>
  </Box>
)

const CardScene: Scene = () => (
  <Island>
    <Card>
      <VStack align="start" spacing="s4">
        <Text variant="headingXs">Air Max 90</Text>
        <Text color="content.secondary" variant="subheadline">
          Leather, mesh and a visible Air unit.
        </Text>
        <Text color="content.accent" variant="labelMedium">
          €139
        </Text>
      </VStack>
    </Card>
  </Island>
)

const SurfaceScene: Scene = () => (
  <Island>
    <VStack spacing="s12" wide>
      <Surface wide>
        <Text variant="labelMedium">Plain surface</Text>
      </Surface>
      <Surface bg="fill.accent.base" glass wide>
        <Text variant="labelMedium">Glass surface</Text>
      </Surface>
    </VStack>
  </Island>
)

const PHOTO = PHOTOS[0]?.uri

const GlassViewScene: Scene = () => (
  <Box borderRadius="large" h={220} overflow="hidden">
    <Image cachePolicy="memory-disk" contentFit="cover" inset={0} position="absolute" source={{uri: PHOTO}} />
    <Box align="center" flex={1} flexDirection="row" gap="s12" justify="center">
      {/* `borderRadius="full"`: Android's ripple keeps to the capsule. */}
      <Pressable borderRadius="full" onPress={noop}>
        <GlassView interactive px="s20" py="s12">
          <RnText pointerEvents="none" variant="labelMedium">
            Glass
          </RnText>
        </GlassView>
      </Pressable>
      <Pressable borderRadius="full" onPress={noop}>
        <GlassView interactive px="s20" py="s12" tint="fill.accent.primary">
          <RnText color="content.on.bg" pointerEvents="none" variant="labelMedium">
            Tinted
          </RnText>
        </GlassView>
      </Pressable>
    </Box>
  </Box>
)

const MATERIALS: BlurMaterial[] = ['ultraThin', 'thin', 'regular', 'thick', 'ultraThick']

/** All five materials over the same photo, thinnest first: how much each lets through is the whole point. */
const BlurViewScene: Scene = () => (
  <Box borderRadius="large" gap="s8" h={260} justify="center" overflow="hidden" px="s16">
    <Image cachePolicy="memory-disk" contentFit="cover" inset={0} position="absolute" source={{uri: PHOTO}} />
    {MATERIALS.map(material => (
      <BlurView borderRadius="medium" key={material} material={material} px="s16" py="s8">
        <RnText variant="labelMedium">{material}</RnText>
      </BlurView>
    ))}
  </Box>
)

const EmptyStateScene: Scene = () => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" wide>
      <EmptyState
        action={<Button label="Clear filters" variant="secondary" />}
        description="Try a different search, or clear the filters."
        icon="search"
        title="No results"
      />
    </VStack>
  </Island>
)

const ImageScene: Scene = () => (
  <Image borderRadius="large" cachePolicy="memory-disk" contentFit="cover" h={220} source={{uri: PHOTO}} w="100%" />
)

export const CONTENT_SCENES = {
  avatar: AvatarScene,
  badge: BadgeScene,
  'blur-view': BlurViewScene,
  card: CardScene,
  'empty-state': EmptyStateScene,
  'glass-view': GlassViewScene,
  icon: IconScene,
  image: ImageScene,
  label: LabelScene,
  'labeled-content': LabeledContentScene,
  surface: SurfaceScene,
  text: TextScene,
}
