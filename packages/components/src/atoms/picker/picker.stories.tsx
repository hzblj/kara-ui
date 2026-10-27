import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Box} from '../box'
import {Island} from '../island'
import {TextField} from '../text-field'
import {VStack} from '../v-stack'
import {Picker} from './picker'
import type {PickerProps} from './picker.types'

const OPTIONS = [
  {label: 'Small', value: 'sm'},
  {label: 'Medium', value: 'md'},
  {label: 'Large', value: 'lg'},
]

const NOTE = 'Ring twice, the bell is quiet.\nIf nobody answers, leave it with the neighbours at number 12.'

const ControlledPicker = (args: PickerProps) => {
  const [, updateArgs] = useArgs<PickerProps>()

  return (
    <Box bg="surface.primary" borderRadius="medium" p="s12">
      <Picker {...args} onValueChange={value => updateArgs({value})} />
    </Box>
  )
}

const PickerInIsland = (args: PickerProps) => {
  const [, updateArgs] = useArgs<PickerProps>()

  return (
    <Island>
      <VStack spacing="s12" wide>
        <TextField defaultValue={NOTE} label="Note for the courier" multiline />
        <Picker {...args} onValueChange={value => updateArgs({value})} />
      </VStack>
    </Island>
  )
}

const meta = {
  args: {options: OPTIONS, value: 'md'},
  component: Picker,
  render: ControlledPicker,
  title: 'Atoms/Picker',
} satisfies Meta<typeof Picker>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {args: {disabled: true}}

export const Menu: Story = {
  args: {pickerStyle: 'menu'},
  parameters: {
    notes:
      'iOS only: `pickerStyle="menu"` is a button with the selection, in the accent, that opens the options as a ' +
      'menu, where a wheel would take the screen. Android ignores it: its exposed dropdown is a menu already.',
  },
}

export const InsideAnIsland: Story = {
  parameters: {
    notes:
      'On its own the picker brings a host of its own. Inside a `Screen` or `Island` it renders into that host ' +
      'instead, so it shares a stack with other native views, a multiline `TextField` here. A host nested in ' +
      'another would take the whole width on Android and leave the island none, and on iOS the wheel would get ' +
      'no height and spill over the field.',
  },
  render: PickerInIsland,
}
