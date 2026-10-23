import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Text} from '../text'
import {VStack} from './v-stack'

const meta = {
  args: {spacing: 's8'},
  argTypes: {
    align: {control: 'radio', options: ['start', 'center', 'end']},
    spacing: {control: 'select', options: ['s0', 's4', 's8', 's16', 's24', 's32']},
  },
  component: VStack,
  decorators: [insideIsland],
  parameters: {
    notes:
      'A SwiftUI `VStack` / Compose `Column`, so it takes `spacing`, not `gap`. The React Native style keys ' +
      'live on `Box` and the `Rn*` tier instead, and reaching for one here does not compile.',
  },
  title: 'Atoms/VStack',
} satisfies Meta<typeof VStack>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <VStack {...args} bg="surface.primary" borderRadius="medium" p="s12" wide>
      <Text variant="label">first</Text>
      <Text variant="label">second</Text>
      <Text variant="label">third</Text>
    </VStack>
  ),
}

export const Centered: Story = {args: {align: 'center'}, render: Default.render}

export const Trailing: Story = {args: {align: 'end'}, render: Default.render}

export const Roomy: Story = {args: {spacing: 's32'}, render: Default.render}
