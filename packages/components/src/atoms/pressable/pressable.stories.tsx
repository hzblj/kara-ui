import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {RnText} from '../rn-text'
import {Pressable} from './pressable'

const meta = {
  args: {
    align: 'center',
    bg: 'fill.accent.primary',
    borderRadius: 'medium',
    onPress: fn(),
    p: 's16',
    wide: true,
  },
  component: Pressable,
  parameters: {
    notes:
      'Scales to 0.96 while held and can fire a haptic with it. Takes the full `ResponsiveViewSx` surface, ' +
      'so it styles like a `Box`.',
  },
  render: args => (
    <Pressable {...args}>
      <RnText color="content.on.bg" variant="body">
        Press me
      </RnText>
    </Pressable>
  ),
  title: 'Atoms/Pressable',
} satisfies Meta<typeof Pressable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHaptic: Story = {args: {haptic: true}}

export const Disabled: Story = {args: {bg: 'fill.quaternary', disabled: true}}
