import {
  Box,
  type Haptic,
  Island,
  Pressable,
  RnText,
  SegmentedControl,
  Slider,
  Stepper,
  Switch,
  useHapticFeedback,
  VStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'

import {CodeBlock, Section} from '../../ui'

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

const PERIODS = ['Day', 'Week', 'Month']

const USAGE = [
  'haptics.success()',
  'haptics.light({intensity: 0.6})',
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
    <Section caption="Android has no warning of its own, so it plays the same rejection as an error." title="Outcomes">
      <Tiles names={['success', 'warning', 'error']} />
    </Section>
    <Section
      caption="A threshold is a gesture's point of no return: a full swipe, a pull far enough to refresh."
      title="Gestures"
    >
      <Tiles names={['longPress', 'dragStart', 'thresholdActivate', 'thresholdDeactivate', 'keyPress']} />
    </Section>
    <Section caption="For a collision no name above describes. On iOS, `intensity` scales them." title="Impacts">
      <Tiles names={['soft', 'light', 'medium', 'rigid', 'heavy']} />
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
    <Section caption="The Haptics switch on Home is wired to setEnabled." title="In use">
      <CodeBlock code={USAGE} />
    </Section>
  </>
)
