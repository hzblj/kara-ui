import {
  Box,
  Checkbox,
  Chip,
  ColorPicker,
  DatePicker,
  Island,
  Picker,
  RadioGroup,
  SearchBar,
  SegmentedControl,
  Slider,
  Stepper,
  Switch,
  TextField,
  VStack,
} from '@hzblj/kara-ui'
import {useState} from 'react'

import {Section} from '../../ui'
import type {CatalogEntry} from '../catalog.types'
import {KARA_MODULE, NATIVE, REACT_NATIVE} from './tags'

const SwitchDemo = () => {
  const [wifi, setWifi] = useState(true)
  const [bluetooth, setBluetooth] = useState(false)

  return (
    <Section caption="With a label, the whole row toggles.">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <Switch label="Wi-Fi" onValueChange={setWifi} value={wifi} />
          <Switch label="Bluetooth" onValueChange={setBluetooth} value={bluetooth} />
          <Switch disabled label="Airplane mode" value={false} />
        </VStack>
      </Island>
    </Section>
  )
}

const CheckboxDemo = () => {
  const [terms, setTerms] = useState(false)
  const [news, setNews] = useState(true)

  return (
    <Section caption="iOS has no checkbox of its own, so there it is a switch.">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s12" wide>
          <Checkbox label="I agree to the terms" onValueChange={setTerms} value={terms} />
          <Checkbox label="Send me the newsletter" onValueChange={setNews} value={news} />
          <Checkbox disabled label="Required" value />
        </VStack>
      </Island>
    </Section>
  )
}

const DELIVERY = [
  {label: 'Standard · 3–5 days', value: 'standard'},
  {label: 'Express · tomorrow', value: 'express'},
  {label: 'Pick up in store', value: 'store'},
]

const RadioGroupDemo = () => {
  const [delivery, setDelivery] = useState('standard')

  return (
    <Section>
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
          <RadioGroup onValueChange={setDelivery} options={DELIVERY} value={delivery} />
        </VStack>
      </Island>
    </Section>
  )
}

const SliderDemo = () => {
  const [volume, setVolume] = useState(0.4)

  return (
    <Section caption={`Volume ${Math.round(volume * 100)} %`}>
      <Island>
        <VStack spacing="s16" wide>
          <Slider onValueChange={setVolume} value={volume} />
          <Slider disabled value={0.7} />
        </VStack>
      </Island>
    </Section>
  )
}

const StepperDemo = () => {
  const [count, setCount] = useState(1)

  return (
    <Section caption="Between 1 and 5.">
      <Island>
        <VStack bg="surface.primary" borderRadius="large" px="s16" py="s8" wide>
          <Stepper label="Quantity" max={5} min={1} onValueChange={setCount} value={count} />
        </VStack>
      </Island>
    </Section>
  )
}

const SegmentedControlDemo = () => {
  const [index, setIndex] = useState(1)

  return (
    <Section caption={`Showing the ${['day', 'week', 'month'][index]}.`}>
      <SegmentedControl onChange={setIndex} selectedIndex={index} values={['Day', 'Week', 'Month']} />
    </Section>
  )
}

const SIZES = [
  {label: 'EU 41', value: '41'},
  {label: 'EU 42', value: '42'},
  {label: 'EU 43', value: '43'},
  {label: 'EU 44', value: '44'},
]

const PickerDemo = () => {
  const [size, setSize] = useState('42')

  return (
    <Section caption="A wheel on iOS, a dropdown on Android.">
      <Box bg="surface.primary" borderRadius="large" p="s12">
        <Picker onValueChange={setSize} options={SIZES} value={size} />
      </Box>
    </Section>
  )
}

const DatePickerDemo = () => {
  const [date, setDate] = useState(new Date(2027, 0, 1))

  return (
    <Section caption={`Selected: ${date.toDateString()}`}>
      <Box bg="surface.primary" borderRadius="large" p="s12">
        <DatePicker onValueChange={setDate} value={date} />
      </Box>
    </Section>
  )
}

const ColorPickerDemo = () => {
  const [color, setColor] = useState<string | null>('#FF5A1F')

  return (
    <Section
      caption={`Selected: ${color}. Tap a well: iOS opens its own picker, Android kara’s sheet in the same shape.`}
    >
      <Island>
        <VStack bg="surface.primary" borderRadius="large" p="s16" spacing="s8" wide>
          <ColorPicker label="Accent" onValueChange={setColor} value={color} />
          <ColorPicker label="With opacity" onValueChange={setColor} supportsOpacity value={color} />
        </VStack>
      </Island>
    </Section>
  )
}

const TextFieldDemo = () => (
  <Section>
    <Island>
      <VStack spacing="s16" wide>
        <TextField label="Email" />
        <TextField label="Password" secure />
        <TextField defaultValue="110" error="A postcode has five digits." label="Postcode" />
        <TextField disabled label="Country" />
      </VStack>
    </Island>
  </Section>
)

const SearchBarDemo = () => {
  const [query, setQuery] = useState('')

  return (
    <Section caption={query ? `Searching for “${query}”` : 'Type to search.'}>
      <SearchBar onChangeText={setQuery} value={query} />
    </Section>
  )
}

const TOPICS = ['Sneakers', 'Running', 'Lifestyle', 'Basketball', 'Kids']

const ChipDemo = () => {
  const [selected, setSelected] = useState<string[]>(['Sneakers'])
  const toggle = (topic: string) =>
    setSelected(current => (current.includes(topic) ? current.filter(item => item !== topic) : [...current, topic]))

  return (
    <Section caption="Tap to toggle.">
      <Box flexDirection="row" gap="s8" wrap="wrap">
        {TOPICS.map(topic => (
          <Chip key={topic} label={topic} onPress={() => toggle(topic)} selected={selected.includes(topic)} />
        ))}
      </Box>
    </Section>
  )
}

export const SELECTION: CatalogEntry[] = [
  {
    code: '<Switch label="Wi-Fi" value={on} onValueChange={setOn} />',
    Demo: SwitchDemo,
    id: 'switch',
    name: 'Switch',
    summary: 'An on/off setting, tinted with your accent.',
    tags: NATIVE,
  },
  {
    code: '<Checkbox label="I agree to the terms" value={agreed} onValueChange={setAgreed} />',
    Demo: CheckboxDemo,
    id: 'checkbox',
    name: 'Checkbox',
    summary: 'A yes/no choice, usually one of several in a form.',
    tags: NATIVE,
  },
  {
    code: '<RadioGroup options={options} value={delivery} onValueChange={setDelivery} />',
    Demo: RadioGroupDemo,
    id: 'radio-group',
    name: 'RadioGroup',
    summary: 'One choice out of a few, all visible at once.',
    tags: NATIVE,
  },
  {
    code: '<Slider value={volume} onValueChange={setVolume} />',
    Demo: SliderDemo,
    id: 'slider',
    name: 'Slider',
    summary: 'A value along a range, picked by dragging.',
    tags: NATIVE,
  },
  {
    code: '<Stepper label="Quantity" min={1} max={5} value={count} onValueChange={setCount} />',
    Demo: StepperDemo,
    id: 'stepper',
    name: 'Stepper',
    summary: 'A number nudged up and down.',
    tags: NATIVE,
  },
  {
    code: "<SegmentedControl values={['Day', 'Week', 'Month']} selectedIndex={index} onChange={setIndex} />",
    Demo: SegmentedControlDemo,
    id: 'segmented-control',
    name: 'SegmentedControl',
    summary: 'Switches between a few views of the same thing.',
    tags: KARA_MODULE,
  },
  {
    code: '<Picker options={sizes} value={size} onValueChange={setSize} />',
    Demo: PickerDemo,
    id: 'picker',
    name: 'Picker',
    summary: 'One choice out of a longer list.',
    tags: NATIVE,
  },
  {
    code: '<DatePicker value={date} onValueChange={setDate} />',
    Demo: DatePickerDemo,
    id: 'date-picker',
    name: 'DatePicker',
    summary: 'A date, picked from the platform’s own calendar.',
    tags: NATIVE,
  },
  {
    code: '<ColorPicker label="Accent" value={color} onValueChange={setColor} />',
    Demo: ColorPickerDemo,
    id: 'color-picker',
    name: 'ColorPicker',
    summary: 'A colour from a grid, a spectrum or sliders.',
    tags: NATIVE,
  },
  {
    code: '<TextField label="Email" onChangeText={setEmail} />',
    Demo: TextFieldDemo,
    id: 'text-field',
    name: 'TextField',
    summary: 'Text input with a label, for secure entry and errors too.',
    tags: NATIVE,
  },
  {
    code: '<SearchBar value={query} onChangeText={setQuery} />',
    Demo: SearchBarDemo,
    id: 'search-bar',
    name: 'SearchBar',
    summary: 'A search field with the platform’s look.',
    tags: REACT_NATIVE,
  },
  {
    code: '<Chip label="Sneakers" selected={on} onPress={toggle} />',
    Demo: ChipDemo,
    id: 'chip',
    name: 'Chip',
    summary: 'Compact toggles for filters and tags.',
    tags: REACT_NATIVE,
  },
]
