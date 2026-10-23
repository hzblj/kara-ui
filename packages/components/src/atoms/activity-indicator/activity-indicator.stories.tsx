import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {ActivityIndicator} from './activity-indicator'

const meta = {
  argTypes: {
    color: {control: 'select', options: ['fill.accent.primary', 'content.primary', 'content.secondary']},
    size: {control: 'radio', options: ['small', 'large']},
  },
  component: ActivityIndicator,
  parameters: {
    notes:
      'UIKit’s spinner on iOS, Material 3’s expressive loading indicator on Android, whose shapes morph as it ' +
      'turns. Tinted `fill.accent.primary` unless `color` says otherwise; it needs no host. For how far along ' +
      'something is, use `Progress`.',
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
