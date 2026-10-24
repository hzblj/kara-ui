import {type TextVariant, textStyles} from '@hzblj/kara-theme'
import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from './rn-text'

const VARIANTS = Object.keys(textStyles) as TextVariant[]

const meta = {
  args: {children: 'The quick brown fox jumps over the lazy dog'},
  argTypes: {
    align: {control: 'radio', options: ['left', 'center', 'right']},
    color: {
      control: 'select',
      options: ['content.primary', 'content.secondary', 'content.tertiary', 'content.accent', 'content.destructive'],
    },
    monospaced: {control: 'boolean'},
    monospacedDigit: {control: 'boolean'},
    variant: {control: 'select', options: VARIANTS},
  },
  component: RnText,
  parameters: {
    notes:
      'The React Native half of `Text`: same tokens, same variants, but a real RN text node. Use it outside a host; inside one, use `Text`.',
  },
  title: 'Atoms/RnText',
} satisfies Meta<typeof RnText>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => (
    <Box gap="s2">
      {VARIANTS.map(variant => (
        <RnText key={variant} variant={variant}>
          {variant}
        </RnText>
      ))}
    </Box>
  ),
}

export const Truncated: Story = {args: {numberOfLines: 1}}

export const Monospaced: Story = {
  parameters: {
    notes:
      '`monospaced` sets the same fixed-width face as `Text`; `monospacedDigit` is React Native’s ' +
      "`fontVariant: ['tabular-nums']`, in whatever face the text has.",
  },
  render: () => (
    <Box gap="s12">
      <RnText monospaced variant="footnote">
        npx expo install @hzblj/kara-ui
      </RnText>
      <Box gap="s2">
        <RnText monospacedDigit>£1,118.40</RnText>
        <RnText monospacedDigit>£911.11</RnText>
      </Box>
    </Box>
  ),
}
