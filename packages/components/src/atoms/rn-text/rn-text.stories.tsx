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
