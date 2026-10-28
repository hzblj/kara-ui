import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../utils/story-decorators'
import {HStack} from '../h-stack'
import {Text} from '../text'
import {Spacer} from './spacer'

const meta = {
  argTypes: {min: {control: 'select', options: ['s8', 's16', 's32', 's64']}},
  component: Spacer,
  decorators: [insideIsland],
  parameters: {
    notes:
      'Eats the free space in a stack rather than adding a fixed gap (that is what `spacing` is for). `min` sets the floor it may never shrink below.',
  },
  title: 'Atoms/Spacer',
} satisfies Meta<typeof Spacer>

export default meta

type Story = StoryObj<typeof meta>

export const PushesApart: Story = {
  render: args => (
    <HStack bg="surface.primary" borderRadius="medium" p="s12" wide>
      <Text variant="label">leading</Text>
      <Spacer {...args} />
      <Text variant="label">trailing</Text>
    </HStack>
  ),
}

export const WithMinimum: Story = {
  args: {min: 's64'},
  render: PushesApart.render,
}
