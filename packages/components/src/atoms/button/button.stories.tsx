import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {VStack} from '../v-stack'
import {Button} from './button'
import type {ButtonVariant} from './button.types'

const VARIANTS: ButtonVariant[] = ['accent', 'secondary', 'destructive', 'glass']

const meta = {
  args: {label: 'Continue', onPress: fn()},
  argTypes: {
    buttonStyle: {
      control: 'select',
      options: ['automatic', 'bordered', 'borderedProminent', 'borderless', 'glass', 'glassProminent', 'plain'],
    },
    controlSize: {control: 'select', options: ['mini', 'small', 'regular', 'large', 'extraLarge']},
    tint: {
      control: 'select',
      options: ['fill.accent.primary', 'fill.accent.base', 'fill.destructive.primary', 'fill.success.primary'],
    },
    variant: {control: 'radio', options: VARIANTS},
  },
  component: Button,
  decorators: [insideIsland],
  parameters: {
    notes:
      '`buttonStyle` and `controlSize` map onto SwiftUI `ButtonStyle` and `ControlSize`. Compose has no ' +
      'equivalent for either, so Android ignores them and keeps rendering the variant tokens.',
  },
  title: 'Atoms/Button',
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Accent: Story = {args: {variant: 'accent'}}

export const Secondary: Story = {args: {variant: 'secondary'}}

export const Destructive: Story = {args: {label: 'Delete', variant: 'destructive'}}

export const Glass: Story = {args: {variant: 'glass'}}

export const Disabled: Story = {args: {disabled: true}}

export const Wide: Story = {args: {wide: true}}

export const Tinted: Story = {
  args: {buttonStyle: 'glassProminent', label: 'Tinted', tint: 'fill.accent.primary'},
}

export const AllVariants: Story = {
  render: () => (
    <VStack spacing="s8" wide>
      {VARIANTS.map(variant => (
        <Button key={variant} label={variant} variant={variant} />
      ))}
      {VARIANTS.map(variant => (
        <Button disabled key={`${variant}-disabled`} label={`${variant} disabled`} variant={variant} />
      ))}
    </VStack>
  ),
}
