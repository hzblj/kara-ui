import {Box, HStack, Island, type MotionPreset, Pressable, RnIcon, RnText, Stagger, Text} from '@hzblj/kara-ui'
import {useState} from 'react'

import {CodeBlock, Section} from '../../ui'

const PRESETS: readonly MotionPreset[] = ['fade', 'fadeUp', 'fadeDown', 'scale']

/** A plain button for the page's own controls: what it does is the demo next to it. */
const Action = ({label, layout, onPress}: {label: string; layout?: boolean; onPress: () => void}) => (
  <Pressable
    alignSelf="flex-start"
    bg="fill.tertiary"
    borderRadius="full"
    layout={layout}
    onPress={onPress}
    px="s16"
    py="s8"
  >
    <RnText variant="labelMedium">{label}</RnText>
  </Pressable>
)

const Arriving = () => {
  const [round, setRound] = useState(0)

  return (
    <Box gap="s12">
      <Box flexDirection="row" gap="s8">
        {PRESETS.map(preset => (
          <Box
            align="center"
            aspectRatio={1}
            bg="fill.accent.base"
            borderRadius="medium"
            entering={preset}
            flex={1}
            justify="center"
            key={`${preset}-${round}`}
          >
            <RnText color="content.accent" variant="caption">
              {preset}
            </RnText>
          </Box>
        ))}
      </Box>
      <Action label="Play again" onPress={() => setRound(value => value + 1)} />
    </Box>
  )
}

const Leaving = () => {
  const [shown, setShown] = useState(true)

  return (
    <Box gap="s12" minH={136}>
      <Action label={shown ? 'Dismiss' : 'Show again'} onPress={() => setShown(value => !value)} />
      {shown ? (
        <Box bg="surface.primary" borderRadius="large" entering="fadeUp" exiting="fadeDown" gap="s4" p="s16">
          <RnText variant="headline">Your order has shipped</RnText>
          <RnText color="content.secondary" variant="subheadline">
            Arriving Thursday, between 9 and 12.
          </RnText>
        </Box>
      ) : null}
    </Box>
  )
}

const DELIVERY = [
  {detail: 'Thursday · Free', id: 'standard', title: 'Standard'},
  {detail: 'Tomorrow · €4.90', id: 'express', title: 'Express'},
  {detail: 'Today from 4 pm · Free', id: 'pickup', title: 'Pick up in store'},
] as const

const Delivery = () => {
  const [picked, setPicked] = useState<string>('standard')

  return (
    <Box gap="s8">
      {DELIVERY.map(option => {
        const selected = option.id === picked

        return (
          <Pressable
            animate
            bg={selected ? 'fill.accent.base' : 'surface.primary'}
            borderColor={selected ? 'content.accent' : 'border.tertiary'}
            borderRadius="large"
            borderWidth={1}
            haptic="selection"
            key={option.id}
            onPress={() => setPicked(option.id)}
            p="s16"
          >
            <RnText variant="headline">{option.title}</RnText>
            <RnText color="content.secondary" variant="subheadline">
              {option.detail}
            </RnText>
          </Pressable>
        )
      })}
    </Box>
  )
}

const Details = () => {
  const [open, setOpen] = useState(false)

  return (
    <Box gap="s12">
      <Action label={open ? 'Hide the note' : 'Show the note'} onPress={() => setOpen(value => !value)} />
      <Box
        animate
        bg="surface.primary"
        borderRadius="large"
        offsetY={open ? 0 : 8}
        opacity={open ? 'o100' : 'o0'}
        p="s16"
        pointerEvents={open ? 'auto' : 'none'}
        scale={open ? 1 : 0.98}
      >
        <RnText variant="subheadline">Leave it with the neighbour at number 12 if nobody answers.</RnText>
      </Box>
    </Box>
  )
}

const NativeChange = () => {
  const [saved, setSaved] = useState(false)

  return (
    <Island>
      <HStack
        animate="snappy"
        bg={saved ? 'fill.accent.base' : 'surface.primary'}
        borderRadius="large"
        onPress={() => setSaved(value => !value)}
        p="s16"
        scale={saved ? 1 : 0.97}
        spacing="s12"
        wide
      >
        <Text color={saved ? 'content.accent' : 'content.primary'} variant="headline">
          {saved ? 'Saved for later' : 'Save for later'}
        </Text>
      </HStack>
    </Island>
  )
}

const LINES = ['Linen shirt', 'Canvas tote', 'Wool socks, 2 pairs', 'Leather belt', 'Gift wrap']

const OneAfterAnother = () => {
  const [round, setRound] = useState(0)

  return (
    <Box gap="s12">
      <Stagger gap="s8" key={round}>
        {LINES.map(line => (
          <Box bg="surface.primary" borderRadius="medium" key={line} px="s16" py="s12">
            <RnText variant="body">{line}</RnText>
          </Box>
        ))}
      </Stagger>
      <Action label="Play again" onPress={() => setRound(value => value + 1)} />
    </Box>
  )
}

const PANTRY = ['Espresso beans', 'Oat milk', 'Croissants', 'Sourdough', 'Blueberries', 'Honey']

const MakingRoom = () => {
  const [items, setItems] = useState(PANTRY)

  return (
    <Box gap="s12" layout>
      <Stagger entering="scale" exiting="scale" gap="s8" layout row wrap>
        {items.map(item => (
          <Pressable
            accessibilityHint="removes it"
            align="center"
            bg="surface.primary"
            borderRadius="full"
            gap="s6"
            key={item}
            onPress={() => setItems(current => current.filter(other => other !== item))}
            pl="s16"
            pr="s12"
            py="s8"
            row
          >
            <RnText variant="labelMedium">{item}</RnText>
            <RnIcon color="content.tertiary" name="close" size="s12" />
          </Pressable>
        ))}
      </Stagger>
      <Action label="Fill it up again" layout onPress={() => setItems(PANTRY)} />
    </Box>
  )
}

const USAGE = [
  '<Box entering="fadeUp" exiting="fade" />',
  "<Box entering={{preset: 'scale', duration: 'slow'}} />",
  '',
  "<Pressable animate bg={selected ? 'fill.accent.base' : 'surface.primary'} />",
  "<Box animate offsetY={open ? 0 : 8} opacity={open ? 'o100' : 'o0'} />",
  '',
  '<Stagger gap="s8" layout row wrap>{chips}</Stagger>',
].join('\n')

export const MotionPage = () => (
  <>
    <Section
      caption="A preset by name, timed by the motion tokens: arriving takes fast, leaving takes quick. With Reduce Motion on, every one of them only fades."
      title="Arriving"
    >
      <Arriving />
    </Section>
    <Section caption="exiting plays when the view is the one removed." title="Leaving">
      <Leaving />
    </Section>
    <Section
      caption="animate carries a change of the colours, the opacity or the transform over to the new value, on the UI thread. With Reduce Motion on, the colours still blend and nothing moves."
      title="A change of state"
    >
      <Delivery />
      <Details />
    </Section>
    <Section
      caption="A native stack takes animate too: SwiftUI's own animation on iOS, Compose's animated values on Android, on the same spring."
      title="Natively"
    >
      <NativeChange />
    </Section>
    <Section
      caption="Stagger plays its children's entering one step apart. A child that is a Box, an RnText or a Pressable takes it directly, with no view added around it."
      title="One after another"
    >
      <OneAfterAnother />
    </Section>
    <Section
      caption="Tap one to take it out. With layout, the others move into place on a spring, across lines too, and so does what sits below. Filled up again, the ones coming back take turns."
      layout
      title="Making room"
    >
      <MakingRoom />
    </Section>
    <Section
      caption="Any of these makes a Box a Reanimated view by itself; without them it stays a plain View."
      title="In use"
    >
      <CodeBlock code={USAGE} />
    </Section>
  </>
)
