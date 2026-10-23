import {
  Box,
  Checkbox,
  Chip,
  ColorPicker,
  DatePicker,
  HStack,
  Island,
  Picker,
  RadioGroup,
  RnText,
  SearchBar,
  SegmentedControl,
  Slider,
  Spacer,
  Stepper,
  Switch,
  Text,
  TextField,
  VStack,
} from '@hzblj/kara-ui'

import type {Scene} from '../shot.types'

const noop = () => undefined

const SwitchScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
      <Switch label="Wi-Fi" onValueChange={noop} value />
      <Switch label="Bluetooth" onValueChange={noop} value={step === 1} />
      <Switch disabled label="Airplane mode" value={false} />
    </VStack>
  </Island>
)

const CheckboxScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
      <Checkbox label="I agree to the terms" onValueChange={noop} value={step === 1} />
      <Checkbox label="Send me the newsletter" onValueChange={noop} value />
      <Checkbox disabled label="Required" value />
    </VStack>
  </Island>
)

const DELIVERY = [
  {label: 'Standard · 3–5 days', value: 'standard'},
  {label: 'Express · tomorrow', value: 'express'},
  {label: 'Pick up in store', value: 'store'},
]

const RadioGroupScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
      <RadioGroup onValueChange={noop} options={DELIVERY} value={DELIVERY[step]?.value ?? 'standard'} />
    </VStack>
  </Island>
)

/** Rests at 40 %, then sweeps up and back down through it — a drag, minus the finger. */
const SliderScene: Scene = ({phase}) => {
  const volume = 0.4 + 0.35 * Math.sin(phase * Math.PI * 2)

  return (
    <Island>
      <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
        <HStack wide>
          <Text variant="labelMedium">Volume</Text>
          <Spacer />
          <Text color="content.secondary" variant="labelMedium">{`${Math.round(volume * 100)} %`}</Text>
        </HStack>
        <Slider onValueChange={noop} value={volume} />
      </VStack>
    </Island>
  )
}

const QUANTITIES = [1, 2, 3, 4, 3, 2]

const StepperScene: Scene = ({step}) => (
  <Island>
    <VStack bg="surface.primary" borderRadius="large" px="s16" py="s8" wide>
      <Stepper label="Quantity" max={5} min={1} onValueChange={noop} value={QUANTITIES[step] ?? 1} />
    </VStack>
  </Island>
)

const SegmentedControlScene: Scene = ({step}) => (
  <SegmentedControl onChange={noop} selectedIndex={[1, 2, 0][step] ?? 1} values={['Day', 'Week', 'Month']} />
)

const SIZES = [
  {label: 'EU 41', value: '41'},
  {label: 'EU 42', value: '42'},
  {label: 'EU 43', value: '43'},
  {label: 'EU 44', value: '44'},
]

const PickerScene: Scene = ({step}) => (
  <Box bg="surface.primary" borderRadius="large" p="s12">
    <Picker onValueChange={noop} options={SIZES} value={['42', '43', '41'][step] ?? '42'} />
  </Box>
)

/** A settings row: the label takes the line, the field — sized to its value — sits at the end of it. */
const DatePickerScene: Scene = () => (
  <Box align="center" bg="surface.primary" borderRadius="large" flexDirection="row" gap="s12" px="s16" py="s12">
    <Box flex={1}>
      <RnText variant="body">Delivery date</RnText>
    </Box>
    <DatePicker onValueChange={noop} value={new Date(2027, 0, 1)} />
  </Box>
)

/**
 * A whole-screen shot, because the picker's sheet needs the room: the rows sit in the middle of the screen, where a
 * stage would put them, and the flow opens the second one's sheet.
 */
const ColorPickerScene: Scene = () => (
  <Box bg="surface.base" flex={1} justify="center" px="s24">
    <Island>
      <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s8" wide>
        <ColorPicker label="Accent" onValueChange={noop} value="#FF5700" />
        <ColorPicker label="With opacity" onValueChange={noop} supportsOpacity value="#4F46E5" />
      </VStack>
    </Island>
  </Box>
)

const EMAIL = 'you@example.com'

/** The address as typed so far: whole for the still, then empty, then one letter more each step. */
const TYPED = [EMAIL, '', ...Array.from({length: EMAIL.length - 1}, (_, index) => EMAIL.slice(0, index + 1))]

/**
 * Typed by the timeline rather than a keyboard: the field is uncontrolled, so each step mounts it again with one
 * letter more. Nothing is focused, so no keyboard rises over the shot.
 */
const TextFieldScene: Scene = ({step}) => {
  const typed = TYPED[step] ?? EMAIL

  return (
    <Island>
      <VStack spacing="s16" wide>
        <TextField defaultValue={typed} key={typed} label="Email" />
        <TextField label="Password" secure />
        <TextField defaultValue="110" error="A postcode has five digits." label="Postcode" />
      </VStack>
    </Island>
  )
}

const QUERIES = ['Air Max', '', 'A', 'Ai', 'Air', 'Air ', 'Air M', 'Air Ma']

const SearchBarScene: Scene = ({step}) => <SearchBar onChangeText={noop} value={QUERIES[step] ?? ''} />

const TOPICS = ['Sneakers', 'Running', 'Lifestyle', 'Basketball', 'Kids']
const PICKED = [['Sneakers'], ['Sneakers', 'Running'], ['Running'], ['Running', 'Lifestyle']]

const ChipScene: Scene = ({step}) => (
  <Box flexDirection="row" gap="s8" wrap="wrap">
    {TOPICS.map(topic => (
      <Chip key={topic} label={topic} onPress={noop} selected={PICKED[step]?.includes(topic)} />
    ))}
  </Box>
)

export const SELECTION_SCENES = {
  checkbox: CheckboxScene,
  chip: ChipScene,
  'color-picker': ColorPickerScene,
  'date-picker': DatePickerScene,
  picker: PickerScene,
  'radio-group': RadioGroupScene,
  'search-bar': SearchBarScene,
  'segmented-control': SegmentedControlScene,
  slider: SliderScene,
  stepper: StepperScene,
  switch: SwitchScene,
  'text-field': TextFieldScene,
}
