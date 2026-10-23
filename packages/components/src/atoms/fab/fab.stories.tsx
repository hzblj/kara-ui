import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {HStack} from '../h-stack'
import {Fab} from './fab'

const meta = {
  args: {accessibilityLabel: 'Add', name: 'add', onPress: fn()},
  argTypes: {name: {control: 'select', options: ['add', 'search', 'share', 'star', 'trash']}},
  component: Fab,
  decorators: [insideIsland],
  parameters: {
    notes:
      'The Material floating action button, and its SwiftUI counterpart. A real screen pins it to the bottom trailing corner; here it sits inline so the shape is visible.',
  },
  title: 'Atoms/Fab',
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Row: Story = {
  render: () => (
    <HStack spacing="s12">
      <Fab accessibilityLabel="Add" name="add" />
      <Fab accessibilityLabel="Search" name="search" />
      <Fab accessibilityLabel="Share" name="share" />
    </HStack>
  ),
}
