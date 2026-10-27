import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {VStack} from '../v-stack'
import {Button} from './button'
import type {ButtonVariant} from './button.types'

const VARIANTS: ButtonVariant[] = ['accent', 'secondary', 'destructive', 'glass', 'plain']

const meta = {
  args: {label: 'Continue', onPress: fn()},
  argTypes: {
    buttonStyle: {
      control: 'select',
      options: ['automatic', 'bordered', 'borderedProminent', 'borderless', 'glass', 'glassProminent', 'plain'],
    },
    controlSize: {control: 'select', options: ['mini', 'small', 'regular', 'large', 'extraLarge']},
    icon: {control: 'select', options: [undefined, 'add', 'arrow-right', 'heart', 'share', 'trash']},
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

export const Plain: Story = {
  args: {label: 'Forgot password?', variant: 'plain'},
  parameters: {
    notes:
      'A text button in the accent, with no fill: SwiftUI’s `borderless` style on iOS, padded to a 44pt tap target ' +
      'that the whole label area takes, and Material’s `TextButton` on Android. A `tint` colours the label.',
  },
}

export const WithIcon: Story = {
  args: {icon: 'share', label: 'Share'},
  parameters: {
    notes:
      'The icon leads the label in the label’s colour: a SwiftUI `Label` in the button on iOS, the icon in the ' +
      'button’s content row on Android, with Material’s tighter padding on the icon side.',
  },
}

export const Disabled: Story = {args: {disabled: true}}

export const Wide: Story = {args: {wide: true}}

export const Tinted: Story = {
  args: {buttonStyle: 'glassProminent', label: 'Tinted', tint: 'fill.accent.primary'},
}

export const PlainBesidePrimary: Story = {
  render: () => (
    <VStack spacing="s8" wide>
      <Button icon="arrow-right" label="Continue" />
      <Button label="Skip" variant="plain" />
    </VStack>
  ),
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
