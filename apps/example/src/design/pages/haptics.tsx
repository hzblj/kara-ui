import {type Haptic, type HapticPattern, haptics, useHapticFeedback} from '@hzblj/expo-rich-haptics'
import {Box, Island, Pressable, RnText, SegmentedControl, Slider, Stepper, Switch, VStack} from '@hzblj/kara-ui'
import {useState} from 'react'

import {CodeBlock, Section} from '../../ui'

const Tile = ({label, onPress}: {label: string; onPress: () => void}) => (
  <Pressable bg="surface.primary" borderRadius="medium" onPress={onPress} px="s16" py="s12">
    <RnText variant="labelMedium">{label}</RnText>
  </Pressable>
)

/** One tile per haptic: `Pressable` plays it by itself, there is no `onPress`. */
const Tiles = ({names}: {names: readonly Haptic[]}) => (
  <Box flexDirection="row" gap="s8" wrap="wrap">
    {names.map(name => (
      <Pressable bg="surface.primary" borderRadius="medium" haptic={name} key={name} px="s16" py="s12">
        <RnText variant="labelMedium">{name}</RnText>
      </Pressable>
    ))}
  </Box>
)

const INTENSITIES = [0.25, 0.5, 1]

const Intensities = () => (
  <Box flexDirection="row" gap="s8" wrap="wrap">
    {INTENSITIES.map(intensity => (
      <Tile key={intensity} label={`medium ${intensity}`} onPress={() => haptics.medium({intensity})} />
    ))}
  </Box>
)

const PATTERNS: {name: string; pattern: HapticPattern}[] = [
  {
    name: 'Heartbeat',
    pattern: [{primitive: 'thud'}, {at: 140, intensity: 0.6, primitive: 'thud'}],
  },
  {
    name: 'Charge',
    pattern: [{primitive: 'slowRise'}, {at: 500, primitive: 'click'}],
  },
  {
    name: 'Ratchet',
    pattern: [0.4, 0.55, 0.7, 0.85, 1].map((intensity, index) => ({at: index * 60, intensity, primitive: 'tick'})),
  },
  {
    name: 'Landing',
    pattern: [{primitive: 'quickRise'}, {at: 170, primitive: 'thud'}],
  },
  {
    name: 'Whirl',
    pattern: [{primitive: 'spin'}, {at: 160, intensity: 0.6, primitive: 'spin'}, {at: 330, primitive: 'lowTick'}],
  },
]

const Patterns = () => (
  <Box flexDirection="row" gap="s8" wrap="wrap">
    {PATTERNS.map(({name, pattern}) => (
      <Tile key={name} label={name} onPress={() => haptics.play(pattern)} />
    ))}
  </Box>
)

const PERIODS = ['Day', 'Week', 'Month']

const USAGE = [
  "import {haptics, useHapticFeedback} from '@hzblj/expo-rich-haptics'",
  '',
  'haptics.success()',
  'haptics.light({intensity: 0.6})',
  "haptics.play([{primitive: 'thud'}, {at: 140, intensity: 0.6, primitive: 'thud'}])",
  "useHapticFeedback(tab, 'selection')",
  'haptics.setEnabled(preference)',
  '',
  '<Pressable haptic="selection" onPress={pick}>',
].join('\n')

const Controls = () => {
  const [period, setPeriod] = useState(0)
  const [updates, setUpdates] = useState(true)
  const [size, setSize] = useState(4)

  return (
    <Box gap="s12">
      <SegmentedControl onChange={setPeriod} selectedIndex={period} values={PERIODS} />
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s16" wide>
          <Switch label="Order updates" onValueChange={setUpdates} value={updates} />
          <Slider max={10} min={0} onValueChange={setSize} step={1} value={size} />
        </VStack>
      </Island>
    </Box>
  )
}

const Quantity = () => {
  const [quantity, setQuantity] = useState(1)

  useHapticFeedback(quantity, (before, after) => (after > before ? 'tick' : 'soft'))

  return (
    <Island>
      <VStack bg="surface.primary" borderRadius="large" px="s16" py="s8" wide>
        <Stepper label="Quantity" max={9} min={1} onValueChange={setQuantity} value={quantity} />
      </VStack>
    </Island>
  )
}

export const HapticsPage = () => (
  <>
    <Section
      caption="Tap to feel each one. Silent in the simulator and the emulator: haptics need a device."
      title="Choices and steps"
    >
      <Tiles names={['selection', 'tick']} />
    </Section>
    <Section
      caption="Android 14 has a feedback made for switches; iOS plays a crisp and a soft impact."
      title="Toggles"
    >
      <Tiles names={['toggleOn', 'toggleOff']} />
    </Section>
    <Section
      caption="Android has no warning constant: it plays two clicks where the device has primitives, and the same rejection as an error where it has none."
      title="Outcomes"
    >
      <Tiles names={['success', 'warning', 'error']} />
    </Section>
    <Section
      caption="A threshold is a gesture's point of no return: a full swipe, a pull far enough to refresh."
      title="Gestures"
    >
      <Tiles names={['longPress', 'dragStart', 'thresholdActivate', 'thresholdDeactivate', 'keyPress']} />
    </Section>
    <Section caption="For a collision no name above describes." title="Impacts">
      <Tiles names={['soft', 'light', 'medium', 'rigid', 'heavy']} />
    </Section>
    <Section
      caption="An impact scales on both platforms. On Android it plays as a primitive, where the device has them."
      title="Intensity"
    >
      <Intensities />
    </Section>
    <Section
      caption="Your own, from Android's haptic primitives on a timeline. iOS plays the same primitives through Core Haptics."
      title="Patterns"
    >
      <Patterns />
    </Section>
    <Section
      caption="On Android the segments, the switch and every stop of a stepped slider play their haptic. On iOS the native controls give their own feedback, or none, as the system's do."
      title="In components"
    >
      <Controls />
    </Section>
    <Section caption="useHapticFeedback plays on every change of a value: up ticks, down is soft." title="On a change">
      <Quantity />
    </Section>
    <Section
      caption="kara plays its haptics through @hzblj/expo-rich-haptics. The Haptics switch on Home is wired to setEnabled."
      title="In use"
    >
      <CodeBlock code={USAGE} />
    </Section>
  </>
)
