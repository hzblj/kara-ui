import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {insideIsland} from '../../story-decorators'
import {HStack} from '../h-stack'
import {VStack} from '../v-stack'
import {Fab} from './fab'

const meta = {
  args: {accessibilityLabel: 'Add', name: 'add', onPress: fn()},
  argTypes: {
    name: {control: 'select', options: ['add', 'search', 'share', 'star', 'trash']},
    size: {control: 'radio', options: ['small', 'regular', 'large']},
  },
  component: Fab,
  decorators: [insideIsland],
  parameters: {
    notes:
      'The Material floating action button, and its SwiftUI counterpart. A real screen pins it to the bottom trailing corner; here it sits inline so the shape is visible.',
  },
  title: 'Atoms/Fab',
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Row: Story = {
  render: () => (
    <HStack spacing="s12">
      <Fab accessibilityLabel="Add" name="add" />
      <Fab accessibilityLabel="Search" name="search" />
      <Fab accessibilityLabel="Share" name="share" />
    </HStack>
  ),
}

export const Sizes: Story = {
  parameters: {
    notes:
      'Material’s small, regular and large FABs on Android (40, 56 and 96dp, the large one with a 36dp icon), the ' +
      'same sizes of accent circle on iOS.',
  },
  render: () => (
    <HStack align="center" spacing="s12">
      <Fab accessibilityLabel="Search" name="search" size="small" />
      <Fab accessibilityLabel="Add" name="add" />
      <Fab accessibilityLabel="Share" name="share" size="large" />
    </HStack>
  ),
}

export const Extended: Story = {
  args: {accessibilityLabel: 'New post', label: 'New post'},
  parameters: {
    notes:
      'With a `label`, Material’s `ExtendedFloatingActionButton` on Android. iOS draws it in its own FAB’s language: ' +
      'the same accent and shadow, 56pt tall, as a capsule. Screen readers say `accessibilityLabel` for the whole ' +
      'button rather than the label as well; `size` does not apply.',
  },
}

export const ExtendedBesideRegular: Story = {
  render: () => (
    <VStack align="end" spacing="s12">
      <Fab accessibilityLabel="Search" name="search" size="small" />
      <Fab accessibilityLabel="Compose" label="Compose" name="add" />
    </VStack>
  ),
}
