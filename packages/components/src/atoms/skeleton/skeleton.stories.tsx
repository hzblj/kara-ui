import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Skeleton} from './skeleton'

const meta = {
  args: {h: 20, w: 160},
  argTypes: {borderRadius: {control: 'select', options: ['none', 'small', 'medium', 'large', 'full']}},
  component: Skeleton,
  parameters: {notes: 'Leave `w` unset and it fills the row — that is the usual shape for a text placeholder.'},
  title: 'Atoms/Skeleton',
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Circle: Story = {args: {borderRadius: 'full', h: 48, w: 48}}

export const LoadingCard: Story = {
  render: () => (
    <Box bg="surface.primary" borderRadius="medium" gap="s8" p="s16" wide>
      <Box align="center" flexDirection="row" gap="s12">
        <Skeleton borderRadius="full" h={48} w={48} />
        <Box flex={1} gap="s8">
          <Skeleton h={16} w={120} />
          <Skeleton h={12} w={80} />
        </Box>
      </Box>
      <Skeleton h={12} />
      <Skeleton h={12} />
      <Skeleton h={12} w={220} />
    </Box>
  ),
}
