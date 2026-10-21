import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Avatar} from './avatar'

const PHOTO = {uri: 'https://picsum.photos/seed/kara-ui/128/128'}

const meta = {
  args: {initials: 'JB'},
  argTypes: {size: {control: 'radio', options: ['sm', 'md', 'lg']}},
  component: Avatar,
  parameters: {notes: 'Falls back to `initials` whenever `source` is absent or still loading.'},
  title: 'Atoms/Avatar',
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Initials: Story = {}

export const Photo: Story = {args: {size: 'lg', source: PHOTO}}

export const Sizes: Story = {
  render: () => (
    <Box align="center" flexDirection="row" gap="s12">
      <Avatar initials="JB" size="sm" />
      <Avatar initials="JB" size="md" />
      <Avatar initials="JB" size="lg" />
    </Box>
  ),
}
