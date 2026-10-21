import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {RnIcon} from './rn-icon'

const meta = {
  args: {name: 'star'},
  argTypes: {
    color: {
      control: 'select',
      options: ['content.primary', 'content.secondary', 'content.accent', 'content.destructive', 'content.success'],
    },
    name: {control: 'select', options: ['star', 'heart', 'home', 'share', 'bolt', 'trash', 'settings']},
    size: {control: 'select', options: ['s12', 's16', 's20', 's24', 's32', 's48']},
  },
  component: RnIcon,
  parameters: {
    notes:
      'The React Native tier: a `UIImageView` / `ImageView` over the same asset `Icon` draws inside a host, so it needs ' +
      'no `Screen` or `Island` and costs next to nothing in a list row.',
  },
  title: 'Atoms/RnIcon',
} satisfies Meta<typeof RnIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const InARow: Story = {
  render: () => (
    <Box align="center" flexDirection="row" gap="s8">
      <RnIcon color="content.accent" name="bolt" size="s20" />
      <RnText variant="body">Text beside an icon, no host in sight</RnText>
    </Box>
  ),
}
