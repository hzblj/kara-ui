import {
  Avatar,
  Badge,
  type BlurMaterial,
  BlurView,
  Box,
  Button,
  Card,
  EmptyState,
  GlassView,
  HStack,
  Icon,
  type IconEffect,
  type IconName,
  Image,
  Island,
  Label,
  LabeledContent,
  Pressable,
  RnIcon,
  RnText,
  Surface,
  Switch,
  Text,
  VStack,
} from '@hzblj/kara-ui'
import {useEffect, useState} from 'react'

import {InsetDivider, Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {PHOTOS} from '../zoom/photos'
import {KARA_MODULE, NATIVE, REACT_NATIVE} from './tags'

const KARAOKE = 'Box box, box this lap. We are going to plan B, the tyres are gone.'.split(' ')

/** A sentence lit word by word, as a transcript is while its audio plays: each span eases to its colour. */
const Karaoke = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setIndex(current => (current + 1) % (KARAOKE.length + 1)), 420)
    return () => clearInterval(timer)
  }, [])

  return (
    <Text animate color="content.tertiary" variant="headline">
      {KARAOKE.map((word, position) => (
        <Text
          color={position < index ? 'content.primary' : position === index ? 'content.accent' : 'content.tertiary'}
          key={word + String(position)}
        >
          {`${word} `}
        </Text>
      ))}
    </Text>
  )
}

const TextDemo = () => (
  <>
    <Section caption="Nineteen variants in all; see Design › Typography." title="Variants">
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s4" wide>
          <Text variant="headingL">Heading</Text>
          <Text variant="headline">Headline</Text>
          <Text variant="body">Body text for paragraphs.</Text>
          <Text variant="footnote">Footnote</Text>
          <Text variant="caption">Caption</Text>
        </VStack>
      </Island>
    </Section>
    <Section title="Colour and style">
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s4" wide>
          <Text color="content.accent">Accent</Text>
          <Text color="content.success">Success</Text>
          <Text color="content.destructive">Destructive</Text>
          <Text color="content.tertiary">Tertiary</Text>
          <Text transform="uppercase">Uppercase</Text>
          <Text decoration="underline">Underlined</Text>
          <Text decoration="strikethrough">Struck through</Text>
          <Text numberOfLines={1}>A long line that is cut to one line, however much text it is given to show.</Text>
          <Text numberOfLines={1} truncation="middle">
            Documents/Invoices/2027/January/kara-ui-invoice-0042.pdf
          </Text>
        </VStack>
      </Island>
    </Section>
    <Section
      caption="Nested Text are spans: one paragraph, a colour each. With animate, a span that changes colour eases there."
      title="Spans"
    >
      <Island>
        <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <Text>
            Box, box. <Text color="content.accent">Box this lap</Text>, plan B.
          </Text>
          <Karaoke />
        </VStack>
      </Island>
    </Section>
  </>
)

const LabelDemo = () => (
  <Section>
    <Island>
      <VStack align="start" bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
        <Label icon="home" title="Home" />
        <Label color="content.accent" icon="star" title="Featured" variant="labelMedium" />
        <Label color="content.destructive" icon="warning" title="Out of stock" variant="footnoteMedium" />
        <Label icon="calendar" iconSize="s16" title="Delivered on Friday" variant="footnote" />
      </VStack>
    </Island>
  </Section>
)

const LabeledContentDemo = () => {
  const [backup, setBackup] = useState(true)

  return (
    <Section caption="The rows of a settings screen: a label, and a value or a control.">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" wide>
          <LabeledContent label="Version" px="s16" value="2.4.0" />
          <InsetDivider />
          <LabeledContent icon="notification" label="Notifications" px="s16" value="On" />
          <InsetDivider />
          <LabeledContent label="Account" onPress={() => undefined} px="s16" value="you@example.com" />
          <InsetDivider />
          <LabeledContent label="Back up photos" px="s16">
            <Switch onValueChange={setBackup} value={backup} />
          </LabeledContent>
        </VStack>
      </Island>
    </Section>
  )
}

const BadgeDemo = () => (
  <Section>
    <Island>
      <HStack spacing="s8" wide>
        <Badge label="New" />
        <Badge label="Sale" tone="accent" />
        <Badge label="In stock" tone="success" />
        <Badge label="Sold out" tone="destructive" />
      </HStack>
    </Island>
  </Section>
)

const AvatarDemo = () => (
  <Section caption="Small, medium and large.">
    <Box align="center" flexDirection="row" gap="s12">
      <Avatar initials="AB" size="sm" />
      <Avatar initials="CD" size="md" />
      <Avatar initials="EF" size="lg" />
    </Box>
  </Section>
)

const ICONS: IconName[] = ['home', 'search', 'heart', 'star', 'share', 'notification', 'settings', 'user', 'trash']

const EFFECTS: {effect: IconEffect; name: IconName}[] = [
  {effect: {type: 'pulse'}, name: 'notification'},
  {effect: {repeat: 'continuous', type: 'rotate'}, name: 'settings'},
  {effect: {style: 'pulse', type: 'breathe'}, name: 'star'},
  {effect: {type: 'wiggle'}, name: 'share'},
  {effect: {type: 'bounce'}, name: 'heart'},
]

const IconDemo = () => (
  <>
    <Section caption="Icon draws inside a native island, RnIcon anywhere in React Native layout." title="Both tiers">
      <Island>
        <HStack spacing="s16" wide>
          {ICONS.map(name => (
            <Icon key={name} name={name} />
          ))}
        </HStack>
      </Island>
      <Box flexDirection="row" gap="s16">
        {ICONS.map(name => (
          <RnIcon key={name} name={name} />
        ))}
      </Box>
    </Section>
    <Section caption="These are this app’s own SVGs, made native at build time. See Design › Icons." title="Colour">
      <Box flexDirection="row" gap="s16">
        <RnIcon color="content.accent" name="heart" />
        <RnIcon color="content.success" name="check" />
        <RnIcon color="content.destructive" name="warning" />
      </Box>
    </Section>
    <Section
      caption="SF Symbols effects on the app’s own icons, in both tiers and on both platforms: pulse, rotate, breathe, wiggle and bounce, running while effectActive."
      title="Effects"
    >
      <Island>
        <HStack spacing="s16" wide>
          {EFFECTS.map(({effect, name}) => (
            <Icon color="content.accent" effect={effect} key={effect.type} name={name} />
          ))}
        </HStack>
      </Island>
      <Box flexDirection="row" gap="s16">
        {EFFECTS.map(({effect, name}) => (
          <RnIcon color="content.accent" effect={effect} key={effect.type} name={name} />
        ))}
      </Box>
    </Section>
  </>
)

const CardDemo = () => (
  <Section>
    <Island>
      <Card>
        <VStack align="start" spacing="s4">
          <Text variant="headingXs">Air Max 90</Text>
          <Text color="content.secondary" variant="subheadline">
            Leather, mesh and a visible Air unit.
          </Text>
        </VStack>
      </Card>
    </Island>
  </Section>
)

const SurfaceDemo = () => (
  <Section caption="Glass is Liquid Glass on iOS 26 and a tonal surface on Android.">
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
  </Section>
)

const MATERIALS: BlurMaterial[] = ['ultraThin', 'thin', 'regular', 'thick', 'ultraThick']

const BlurViewDemo = () => (
  <Section caption="The five system materials over a photo: iOS's own blur, Android's backdrop blur under a Material tonal surface as thick as the material.">
    <Box borderRadius="large" gap="s8" overflow="hidden" p="s16">
      <Image
        cachePolicy="memory-disk"
        contentFit="cover"
        inset={0}
        position="absolute"
        source={{uri: PHOTOS[1]?.uri}}
      />
      {MATERIALS.map(material => (
        <BlurView borderRadius="medium" key={material} material={material} px="s16" py="s12">
          <RnText variant="labelMedium">{material}</RnText>
        </BlurView>
      ))}
    </Box>
  </Section>
)

const GlassViewDemo = () => (
  <Section caption="Liquid Glass around React Native content on iOS 26, frosted glass on Android (what lies behind, blurred). Pressed, iOS glass swells and Android ripples.">
    <Box bg="fill.accent.primary" borderRadius="large" flexDirection="row" gap="s12" p="s24">
      <GlassView px="s16" py="s8">
        <RnText color="content.on.accent" variant="labelMedium">
          Glass
        </RnText>
      </GlassView>
      <Pressable borderRadius="full" onPress={() => undefined}>
        <GlassView interactive px="s16" py="s8">
          <RnText color="content.on.accent" pointerEvents="none" variant="labelMedium">
            Interactive
          </RnText>
        </GlassView>
      </Pressable>
    </Box>
  </Section>
)

const EmptyStateDemo = () => (
  <Section>
    <Island>
      <VStack bg="surface.primary" borderRadius="large" wide>
        <EmptyState
          action={<Button label="Clear filters" variant="secondary" />}
          description="Try a different search, or clear the filters you have applied."
          icon="search"
          title="No results"
        />
      </VStack>
    </Island>
  </Section>
)

export const CONTENT: CatalogEntry[] = [
  {
    code: '<Text variant="headline">Order summary</Text>\n<Text color="content.secondary">2 items</Text>',
    Demo: TextDemo,
    id: 'text',
    name: 'Text',
    summary: 'Text in the type scale, coloured by token.',
    tags: NATIVE,
  },
  {
    code: '<Label icon="star" title="Featured" />',
    Demo: LabelDemo,
    id: 'label',
    name: 'Label',
    summary: 'An icon and a short text, aligned.',
    tags: NATIVE,
  },
  {
    code: '<LabeledContent label="Version" value="2.4.0" />',
    Demo: LabeledContentDemo,
    id: 'labeled-content',
    name: 'LabeledContent',
    summary: 'A label with a value or a control beside it.',
    tags: NATIVE,
  },
  {
    code: '<Badge label="Sale" tone="accent" />',
    Demo: BadgeDemo,
    id: 'badge',
    name: 'Badge',
    summary: 'A small status label.',
    tags: NATIVE,
  },
  {
    code: '<Avatar initials="AB" size="md" />',
    Demo: AvatarDemo,
    id: 'avatar',
    name: 'Avatar',
    summary: 'A person’s initials in a circle.',
    tags: REACT_NATIVE,
  },
  {
    code: '<Icon name="heart" color="content.accent" />\n<RnIcon name="heart" />',
    Demo: IconDemo,
    id: 'icon',
    name: 'Icon',
    summary: 'Your own SVG icons, drawn natively in both tiers.',
    tags: NATIVE,
  },
  {
    code: '<Card>\n  <Text variant="headingXs">Air Max 90</Text>\n</Card>',
    Demo: CardDemo,
    id: 'card',
    name: 'Card',
    summary: 'A raised container for one piece of content.',
    tags: NATIVE,
  },
  {
    code: '<Surface glass>\n  <Text>Glass surface</Text>\n</Surface>',
    Demo: SurfaceDemo,
    id: 'surface',
    name: 'Surface',
    summary: 'A coloured, rounded background, plain or glass.',
    tags: NATIVE,
  },
  {
    code: '<BlurView material="thin" borderRadius="large" p="s16">\n  <RnText>On the material</RnText>\n</BlurView>',
    Demo: BlurViewDemo,
    id: 'blur-view',
    name: 'BlurView',
    summary: 'The system materials: what sheets, bars and HUDs are made of.',
    tags: KARA_MODULE,
  },
  {
    code: '<GlassView interactive px="s16" py="s8">\n  <RnText>Glass</RnText>\n</GlassView>',
    Demo: GlassViewDemo,
    id: 'glass-view',
    name: 'GlassView',
    summary: 'Liquid Glass around any React Native content.',
    tags: KARA_MODULE,
  },
  {
    code: '<EmptyState icon="search" title="No results" description="Try a different search." />',
    Demo: EmptyStateDemo,
    id: 'empty-state',
    name: 'EmptyState',
    summary: 'What to show when there is nothing to show.',
    tags: NATIVE,
  },
]
