import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Divider} from './divider'

const meta = {
  argTypes: {
    color: {control: 'select', options: ['border.secondary.base', 'border.secondary.muted', 'border.accent']},
  },
  component: Divider,
  decorators: [insideIsland],
  title: 'Atoms/Divider',
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <VStack spacing="s8" wide>
      <Text variant="label">above</Text>
      <Divider {...args} />
      <Text variant="label">below</Text>
    </VStack>
  ),
}

export const Accent: Story = {
  args: {color: 'border.accent'},
  render: Default.render,
}
