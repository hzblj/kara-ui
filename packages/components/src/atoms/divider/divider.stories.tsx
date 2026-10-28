import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../utils/story-decorators'
import {HStack} from '../h-stack'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Divider} from './divider'

const meta = {
  argTypes: {
    axis: {control: 'radio', options: ['horizontal', 'vertical']},
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

export const Vertical: Story = {
  args: {axis: 'vertical'},
  parameters: {
    notes:
      'Between the children of an `HStack`, as tall as the stack: give it a height (`h`). SwiftUI’s divider turns by ' +
      'itself in an `HStack`, so iOS ignores `axis`; Compose’s does not, so Android needs `axis="vertical"` to draw a ' +
      '`VerticalDivider`.',
  },
  render: args => (
    <HStack align="center" h={24} spacing="s12">
      <Text variant="label">12 km</Text>
      <Divider {...args} />
      <Text variant="label">48 min</Text>
      <Divider {...args} />
      <Text variant="label">320 m climb</Text>
    </HStack>
  ),
}
