import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {ActivityIndicator} from './activity-indicator'

const meta = {
  argTypes: {size: {control: 'radio', options: ['small', 'large']}},
  component: ActivityIndicator,
  parameters: {
    notes:
      'React Native’s own spinner, pre-tinted with `fill.accent.primary`. For a native determinate bar reach for `Progress` instead.',
  },
  title: 'Atoms/ActivityIndicator',
} satisfies Meta<typeof ActivityIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = {args: {size: 'small'}}

export const Large: Story = {args: {size: 'large'}}

export const OnSurface: Story = {
  render: () => (
    <Box align="center" bg="surface.primary" borderRadius="medium" justify="center" p="s32" wide>
      <ActivityIndicator size="large" />
    </Box>
  ),
}
