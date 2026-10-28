import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Button} from '../../atoms/button'
import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../utils/story-decorators'
import {EmptyState} from './empty-state'

const CLEAR_FILTERS = <Button label="Clear filters" onPress={fn()} variant="secondary" />

const meta = {
  args: {
    description: 'Try a different query or clear the filters you have applied.',
    icon: 'search',
    title: 'No results',
  },
  argTypes: {icon: {control: 'select', options: ['search', 'notification', 'heart', 'warning', 'trash']}},
  component: EmptyState,
  decorators: [insideIsland],
  title: 'Molecules/EmptyState',
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {args: {description: undefined, icon: undefined}}

export const WithDescription: Story = {}

export const WithAction: Story = {
  render: args => (
    <VStack bg="surface.primary" borderRadius="medium" wide>
      <EmptyState {...args} action={CLEAR_FILTERS} />
    </VStack>
  ),
}
