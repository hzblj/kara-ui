import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {insideIsland} from '../../utils/story-decorators'
import {VStack} from '../v-stack'
import {Checkbox} from './checkbox'
import type {CheckboxProps} from './checkbox.types'

const ControlledCheckbox = (args: CheckboxProps) => {
  const [, updateArgs] = useArgs<CheckboxProps>()

  return <Checkbox {...args} onValueChange={value => updateArgs({value})} />
}

const meta = {
  args: {label: 'I agree', value: false},
  component: Checkbox,
  decorators: [insideIsland],
  render: ControlledCheckbox,
  title: 'Atoms/Checkbox',
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Checked: Story = {args: {value: true}}

export const Disabled: Story = {args: {disabled: true, label: 'Checkbox disabled'}}

export const States: Story = {
  render: () => (
    <VStack spacing="s12" wide>
      <Checkbox label="Checked" value />
      <Checkbox label="Unchecked" value={false} />
      <Checkbox disabled label="Disabled checked" value />
      <Checkbox disabled label="Disabled unchecked" value={false} />
    </VStack>
  ),
}
