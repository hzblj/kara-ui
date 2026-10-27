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
  SearchBar,
  SegmentedControl,
  Slider,
  Spacer,
  Stepper,
  Switch,
  Text,
  TextField,
  type TextFieldRef,
  VStack,
} from '@hzblj/kara-ui'
import {useRef, useState} from 'react'

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
    <>
      <Section>
        <Island>
          <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
            <RadioGroup onValueChange={setDelivery} options={DELIVERY} value={delivery} />
          </VStack>
        </Island>
      </Section>
      <Section caption="Disabled: the options dim and the choice stays as it is.">
        <Island>
          <VStack bg="surface.primary" borderRadius="large" p="s16" wide>
            <RadioGroup disabled options={DELIVERY} value="express" />
          </VStack>
        </Island>
      </Section>
    </>
  )
}

const SliderDemo = () => {
  const [volume, setVolume] = useState(0.4)
  const [position, setPosition] = useState(0.25)
  const [seeked, setSeeked] = useState(0.25)

  return (
    <>
      <Section caption={`Volume ${Math.round(volume * 100)} %`}>
        <Island>
          <VStack spacing="s16" wide>
            <Slider onValueChange={setVolume} value={volume} />
            <Slider disabled value={0.7} />
          </VStack>
        </Island>
      </Section>
      <Section
        caption={`The position follows the thumb; the player seeks to ${Math.round(seeked * 100)} % once the finger lifts.`}
      >
        <Island>
          <Slider onValueChange={setPosition} onValueChangeEnd={setSeeked} value={position} />
        </Island>
      </Section>
    </>
  )
}

const StepperDemo = () => {
  const [count, setCount] = useState(1)
  const [tickets, setTickets] = useState(2)

  return (
    <>
      <Section caption="Between 1 and 5.">
        <Island>
          <VStack bg="surface.primary" borderRadius="large" px="s16" py="s8" wide>
            <Stepper label="Quantity" max={5} min={1} onValueChange={setCount} value={count} />
          </VStack>
        </Island>
      </Section>
      <Section caption="Disabled, the row dims. On Android TalkBack reads decrementLabel and incrementLabel for the buttons.">
        <Island>
          <VStack bg="surface.primary" borderRadius="large" px="s16" py="s8" wide>
            <Stepper
              decrementLabel="Remove a ticket"
              incrementLabel="Add a ticket"
              label="Tickets"
              max={6}
              min={1}
              onValueChange={setTickets}
              value={tickets}
            />
            <Stepper disabled label="Guests" onValueChange={() => undefined} value={2} />
          </VStack>
        </Island>
      </Section>
    </>
  )
}

const COURIER_NOTE =
  'Ring twice, the bell is quiet.\nIf nobody answers, leave it with the neighbours at number 12.\nThe gate code is 4021.'

// Made-up carriers' logos as SVG data URIs: what an app would get from its API as URLs, drawn in their own colours.
const svg = (body: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24">${body}</svg>`)}`

const CARRIERS = [
  {
    image: {
      uri: svg(
        '<rect x="2" y="3" width="44" height="18" rx="5" fill="#FF6A00"/><path d="M14 9h20v6H14z" fill="#fff"/>'
      ),
    },
    label: 'Parcel box',
  },
  {
    image: {uri: svg('<circle cx="17" cy="12" r="8" fill="#1F6FEB"/><circle cx="31" cy="12" r="8" fill="#FFC300"/>')},
    label: 'Post',
  },
  {image: {uri: svg('<path d="M6 19 18 5h8L14 19zM22 19 34 5h8L30 19z" fill="#12A37F"/>')}, label: 'Courier'},
]

const SegmentedControlDemo = () => {
  const [index, setIndex] = useState(1)
  const [delivery, setDelivery] = useState(0)
  const [carrier, setCarrier] = useState(0)
  const [view, setView] = useState(0)

  return (
    <>
      <Section caption={`Showing the ${['day', 'week', 'month'][index]}.`}>
        <SegmentedControl onChange={setIndex} selectedIndex={index} values={['Day', 'Week', 'Month']} />
      </Section>
      <Section caption="Inside an island it joins the island’s stack, here under a note that wraps over several lines.">
        <Island>
          <VStack spacing="s12" wide>
            <TextField defaultValue={COURIER_NOTE} label="Note for the courier" multiline />
            <SegmentedControl onChange={setDelivery} selectedIndex={delivery} values={['Door', 'Locker', 'Pickup']} />
          </VStack>
        </Island>
      </Section>
      <Section caption="One of your icons before each label, in the label’s colour. iconSize and spacing make the control bigger.">
        <SegmentedControl
          iconSize="s24"
          onChange={setView}
          selectedIndex={view}
          spacing="s12"
          values={[
            {icon: 'grid', label: 'Grid'},
            {icon: 'star', label: 'Saved'},
            {icon: 'heart', label: 'Liked'},
          ]}
        />
      </Section>
      <Section
        caption={`Images in their own colours, carriers’ logos here (SVG, loaded natively). ${CARRIERS[carrier]?.label} is selected; screen readers say each label.`}
      >
        <SegmentedControl onChange={setCarrier} selectedIndex={carrier} spacing="s8" values={CARRIERS} />
      </Section>
    </>
  )
}

const SIZES = [
  {label: 'EU 41', value: '41'},
  {label: 'EU 42', value: '42'},
  {label: 'EU 43', value: '43'},
  {label: 'EU 44', value: '44'},
]

const SLOTS = [
  {label: 'Morning', value: 'morning'},
  {label: 'Afternoon', value: 'afternoon'},
  {label: 'Evening', value: 'evening'},
]

const PickerDemo = () => {
  const [size, setSize] = useState('42')
  const [slot, setSlot] = useState('afternoon')
  const [menuSize, setMenuSize] = useState('42')

  return (
    <>
      <Section caption="A wheel on iOS, a dropdown on Android.">
        <Box bg="surface.primary" borderRadius="large" p="s12">
          <Picker onValueChange={setSize} options={SIZES} value={size} />
        </Box>
      </Section>
      <Section caption="With pickerStyle menu, iOS shows a button with the selection that opens the options as a menu, for a screen with more than one picker. Android’s dropdown is the same either way.">
        <Box bg="surface.primary" borderRadius="large" p="s12">
          <Picker onValueChange={setMenuSize} options={SIZES} pickerStyle="menu" value={menuSize} />
        </Box>
      </Section>
      <Section caption="Inside an island it joins the island’s stack, here under a note that wraps over several lines.">
        <Island>
          <VStack spacing="s12" wide>
            <TextField defaultValue={COURIER_NOTE} label="Note for the courier" multiline />
            <Picker onValueChange={setSlot} options={SLOTS} value={slot} />
          </VStack>
        </Island>
      </Section>
    </>
  )
}

const DatePickerDemo = () => {
  const [date, setDate] = useState(new Date(2027, 0, 1))
  const [delivery, setDelivery] = useState(new Date(2027, 0, 4))
  const [day, setDay] = useState(new Date(2027, 0, 12))

  return (
    <>
      <Section caption={`Selected: ${date.toDateString()}`}>
        <Box bg="surface.primary" borderRadius="large" p="s12">
          <DatePicker onValueChange={setDate} value={date} />
        </Box>
      </Section>
      <Section caption="With datePickerStyle graphical the calendar is in place: SwiftUI’s on iOS, Material’s on Android.">
        <Box bg="surface.primary" borderRadius="large" p="s12">
          <DatePicker datePickerStyle="graphical" min={new Date(2027, 0, 1)} onValueChange={setDay} value={day} />
        </Box>
      </Section>
      <Section caption="Inside an island it joins the island’s stack, here under a note that wraps over several lines.">
        <Island>
          <VStack spacing="s12" wide>
            <TextField defaultValue={COURIER_NOTE} label="Note for the courier" multiline />
            <HStack align="center" spacing="s12">
              <Text>Delivery date</Text>
              <Spacer />
              <DatePicker onValueChange={setDelivery} value={delivery} />
            </HStack>
          </VStack>
        </Island>
      </Section>
    </>
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
          <ColorPicker disabled label="Set by the theme" value={color} />
        </VStack>
      </Island>
    </Section>
  )
}

const TextFieldDemo = () => {
  const password = useRef<TextFieldRef>(null)

  return (
    <>
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
      <Section caption="Set up for what it takes: the email keyboard without capitals or corrections, AutoFill for the account, and Next moving on to the password through a ref. The code field takes six digits.">
        <Island>
          <VStack spacing="s16" wide>
            <TextField
              contentType="username"
              keyboard="email"
              label="Email"
              onSubmit={() => password.current?.focus()}
              placeholder="name@example.com"
              submitLabel="next"
            />
            <TextField contentType="password" label="Password" ref={password} secure submitLabel="done" />
            <TextField
              contentType="oneTimeCode"
              keyboard="number"
              label="Verification code"
              maxLength={6}
              placeholder="6 digits"
            />
          </VStack>
        </Island>
      </Section>
    </>
  )
}

const SearchBarDemo = () => {
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')

  return (
    <Section
      caption={
        submitted
          ? `Searched for “${submitted}”`
          : query
            ? `Searching for “${query}”`
            : 'Type, then press Search on the keyboard.'
      }
    >
      <SearchBar onChangeText={setQuery} onSubmit={setSubmitted} placeholder="Search stores" value={query} />
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
