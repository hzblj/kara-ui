import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Skeleton} from './skeleton'

const meta = {
  args: {height: 20, width: 160},
  argTypes: {borderRadius: {control: 'select', options: ['none', 'small', 'medium', 'large', 'full']}},
  component: Skeleton,
  parameters: {notes: 'Leave `width` unset and it fills the row — that is the usual shape for a text placeholder.'},
  title: 'Atoms/Skeleton',
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Circle: Story = {args: {borderRadius: 'full', height: 48, width: 48}}

export const LoadingCard: Story = {
  render: () => (
    <Box bg="surface.primary" borderRadius="medium" gap="s8" p="s16" wide>
      <Box align="center" flexDirection="row" gap="s12">
        <Skeleton borderRadius="full" height={48} width={48} />
        <Box flex={1} gap="s8">
          <Skeleton height={16} width={120} />
          <Skeleton height={12} width={80} />
        </Box>
      </Box>
      <Skeleton height={12} />
      <Skeleton height={12} />
      <Skeleton height={12} width={220} />
    </Box>
  ),
}
