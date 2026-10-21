import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Box} from '../box'
import {Picker} from './picker'
import type {PickerProps} from './picker.types'

const OPTIONS = [
  {label: 'Small', value: 'sm'},
  {label: 'Medium', value: 'md'},
  {label: 'Large', value: 'lg'},
]

const ControlledPicker = (args: PickerProps) => {
  const [, updateArgs] = useArgs<PickerProps>()

  return (
    <Box bg="surface.primary" borderRadius="medium" p="s12">
      <Picker {...args} onValueChange={value => updateArgs({value})} />
    </Box>
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
