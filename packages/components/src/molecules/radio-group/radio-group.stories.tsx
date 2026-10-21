import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../story-decorators'
import {RadioGroup} from './radio-group'
import type {RadioGroupProps} from './radio-group.types'

const OPTIONS = [
  {label: 'Automatic', value: 'auto'},
  {label: 'Always on', value: 'on'},
  {label: 'Always off', value: 'off'},
]

const ControlledRadioGroup = (args: RadioGroupProps) => {
  const [, updateArgs] = useArgs<RadioGroupProps>()

  return <RadioGroup {...args} onValueChange={value => updateArgs({value})} />
}

const meta = {
  args: {options: OPTIONS, value: 'auto'},
  component: RadioGroup,
  decorators: [insideIsland],
  parameters: {
    notes: 'Exactly one option is selected at all times — for an independent on/off, use `Switch` or `Checkbox`.',
  },
  render: ControlledRadioGroup,
  title: 'Molecules/RadioGroup',
} satisfies Meta<typeof RadioGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoOptions: Story = {
  args: {
    options: [
      {label: 'Light', value: 'light'},
      {label: 'Dark', value: 'dark'},
    ],
    value: 'dark',
  },
}
