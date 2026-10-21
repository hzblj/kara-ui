import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {VStack} from '../v-stack'
import {TextField} from './text-field'

const meta = {
  args: {label: 'Display name', onChangeText: fn()},
  component: TextField,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Uncontrolled on purpose — it seeds from `defaultValue` and reports through `onChangeText`, so neither platform has to round-trip every keystroke through JS.',
  },
  title: 'Atoms/TextField',
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Prefilled: Story = {args: {defaultValue: 'Jan'}}

export const Secure: Story = {args: {label: 'Password', secure: true}}

export const Multiline: Story = {args: {label: 'Notes', multiline: true}}

export const WithError: Story = {args: {error: true, label: 'With error'}}

export const Disabled: Story = {args: {disabled: true, label: 'Disabled'}}

export const AllStates: Story = {
  render: () => (
    <VStack spacing="s12" wide>
      <TextField label="Label" />
      <TextField label="Secure" secure />
      <TextField error label="With error" />
      <TextField disabled label="Disabled" />
    </VStack>
  ),
}
