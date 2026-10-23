import {HAPTICS} from '@hzblj/kara-native'
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
  argTypes: {
    haptic: {control: 'select', options: [false, true, ...HAPTICS]},
    pressEffect: {control: 'radio', options: ['scale', 'opacity', 'none']},
    pressedOpacity: {control: 'select', options: ['o40', 'o60', 'o80']},
  },
  component: Pressable,
  parameters: {
    notes:
      'Presses the platform’s way by default: an ease down to 0.96 on iOS, Material’s ripple on Android. `pressEffect` ' +
      'picks `scale`, `opacity` or `none` on both, and Android keeps the ripple on top unless `ripple` is off. A ' +
      'haptic can play on press: `true` for a light impact, or any haptic by name; iOS prepares it on press-in. ' +
      'With motion reduced, `scale` dims instead. Takes the full `ResponsiveViewSx` surface, so it styles like a `Box`.',
  },
  render: args => (
    <Pressable {...args}>
      <RnText color="content.on.accent" variant="body">
        Press me
      </RnText>
    </Pressable>
  ),
  title: 'Atoms/Pressable',
} satisfies Meta<typeof Pressable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Scale: Story = {args: {pressEffect: 'scale'}}

export const Opacity: Story = {args: {pressEffect: 'opacity'}}

export const RippleOnly: Story = {args: {pressEffect: 'none'}}

export const WithHaptic: Story = {args: {haptic: true}}

export const WithSelectionHaptic: Story = {args: {haptic: 'selection'}}

export const Disabled: Story = {args: {bg: 'fill.quaternary', disabled: true}}
