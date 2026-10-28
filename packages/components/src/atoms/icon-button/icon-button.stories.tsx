import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../utils/story-decorators'
import {HStack} from '../h-stack'
import {VStack} from '../v-stack'
import {IconButton} from './icon-button'
import type {IconButtonVariant} from './icon-button.types'

const VARIANTS: IconButtonVariant[] = ['plain', 'filled', 'tonal', 'outlined', 'glass']

const meta = {
  args: {accessibilityLabel: 'Add', name: 'add', onPress: fn()},
  argTypes: {
    color: {
      control: 'select',
      options: [undefined, 'content.accent', 'content.destructive', 'fill.accent.primary', 'fill.success.primary'],
    },
    name: {control: 'select', options: ['add', 'close', 'heart', 'lock', 'more', 'search', 'share', 'star', 'trash']},
    variant: {control: 'radio', options: VARIANTS},
  },
  component: IconButton,
  decorators: [insideIsland],
  parameters: {
    notes:
      'iOS draws `filled`, `tonal` and `glass` as SwiftUI’s `borderedProminent`, `bordered` and `glass` styles in a ' +
      'circle, and `outlined` as a plain button in a hairline ring (SwiftUI has no outlined style). Android draws ' +
      'Material’s `FilledIconButton`, `FilledTonalIconButton` and `OutlinedIconButton`; Material has no glass, so ' +
      '`glass` is the tonal one there.',
  },
  title: 'Atoms/IconButton',
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Disabled: Story = {args: {accessibilityLabel: 'Locked', disabled: true, name: 'lock'}}

export const Filled: Story = {args: {accessibilityLabel: 'Add', variant: 'filled'}}

export const Tonal: Story = {args: {accessibilityLabel: 'Share', name: 'share', variant: 'tonal'}}

export const Outlined: Story = {args: {accessibilityLabel: 'More', name: 'more', variant: 'outlined'}}

export const Glass: Story = {
  args: {accessibilityLabel: 'Close', name: 'close', variant: 'glass'},
  parameters: {
    notes:
      'Liquid Glass on iOS 26, the tonal circle below it. Android has no glass and draws the tonal button: a ' +
      'contained one, which still reads over a photo or a map where an outline would not.',
  },
}

export const Coloured: Story = {
  parameters: {
    notes:
      '`color` is the icon’s colour, except on `filled`, where it is the fill and the icon picks a colour that ' +
      'reads on it, as a `Button`’s `tint` does. On iOS a `tonal` circle takes a pale shade of it.',
  },
  render: () => (
    <HStack spacing="s8">
      <IconButton accessibilityLabel="Like" color="content.destructive" name="heart" />
      <IconButton accessibilityLabel="Delete" color="fill.destructive.primary" name="trash" variant="filled" />
      <IconButton accessibilityLabel="Favourite" color="content.accent" name="star" variant="tonal" />
    </HStack>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <VStack spacing="s8">
      <HStack spacing="s8">
        {VARIANTS.map(variant => (
          <IconButton accessibilityLabel={variant} key={variant} name="add" variant={variant} />
        ))}
      </HStack>
      <HStack spacing="s8">
        {VARIANTS.map(variant => (
          <IconButton accessibilityLabel={variant} disabled key={variant} name="add" variant={variant} />
        ))}
      </HStack>
    </VStack>
  ),
}

export const Row: Story = {
  render: () => (
    <HStack spacing="s8">
      <IconButton accessibilityLabel="Add" name="add" />
      <IconButton accessibilityLabel="Share" name="share" />
      <IconButton accessibilityLabel="Delete" name="trash" />
      <IconButton accessibilityLabel="Locked" disabled name="lock" />
    </HStack>
  ),
}
