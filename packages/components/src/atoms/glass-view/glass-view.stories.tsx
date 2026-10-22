import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {Box} from '../box'
import {Pressable} from '../pressable'
import {RnText} from '../rn-text'
import {GlassView} from './glass-view'

const meta = {
  args: {interactive: true, px: 's20', py: 's12'},
  argTypes: {tint: {control: 'select', options: [undefined, 'fill.accent.base', 'fill.tertiary', 'surface.primary']}},
  component: GlassView,
  parameters: {
    notes:
      'Liquid Glass on iOS 26, as a UIKit view — no host, so it is cheap enough for every cell of a list. On Android ' +
      'it is frosted glass: what lies behind, blurred and saturated (Android 12+), under a translucent tonal surface. ' +
      'Below iOS 26 it is a plain capsule of the tint (or the translucent glass fill). Interactive glass swells toward ' +
      'the finger on iOS; the press itself belongs to a `Pressable` around it, whose ripple keeps to the capsule on ' +
      'Android with `borderRadius="full"`.',
  },
  render: args => (
    <Box align="center" bg="fill.accent.primary" borderRadius="large" p="s24">
      <Pressable borderRadius="full" onPress={fn()}>
        <GlassView {...args}>
          <Box pointerEvents="none">
            <RnText variant="labelMedium">Glass capsule</RnText>
          </Box>
        </GlassView>
      </Pressable>
    </Box>
  ),
  title: 'Atoms/GlassView',
} satisfies Meta<typeof GlassView>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive: Story = {}

export const Tinted: Story = {args: {tint: 'fill.accent.base'}}

export const Static: Story = {args: {interactive: false}}
