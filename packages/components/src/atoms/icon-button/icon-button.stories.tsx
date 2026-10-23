import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {HStack} from '../h-stack'
import {IconButton} from './icon-button'

const meta = {
  args: {accessibilityLabel: 'Add', name: 'add', onPress: fn()},
  argTypes: {
    name: {control: 'select', options: ['add', 'close', 'heart', 'lock', 'more', 'search', 'share', 'star', 'trash']},
  },
  component: IconButton,
  decorators: [insideIsland],
  title: 'Atoms/IconButton',
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {args: {accessibilityLabel: 'Locked', disabled: true, name: 'lock'}}

export const Row: Story = {
  render: () => (
    <HStack spacing="s8">
      <IconButton accessibilityLabel="Add" name="add" />
      <IconButton accessibilityLabel="Share" name="share" />
      <IconButton accessibilityLabel="Delete" name="trash" />
      <IconButton accessibilityLabel="Locked" disabled name="lock" />
    </HStack>
  ),
}
