import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../utils/story-decorators'
import {HStack} from '../h-stack'
import {VStack} from '../v-stack'
import {Progress} from './progress'

const meta = {
  argTypes: {
    color: {control: 'select', options: ['fill.accent.primary', 'fill.destructive.primary', 'fill.success.primary']},
    value: {control: {max: 1, min: 0, step: 0.01, type: 'range'}},
  },
  component: Progress,
  decorators: [insideIsland],
  parameters: {notes: 'Leave `value` unset for the indeterminate spinner; pass 0–1 for a determinate bar.'},
  title: 'Atoms/Progress',
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

export const Determinate: Story = {args: {value: 0.35}}

export const Indeterminate: Story = {}

export const Circular: Story = {args: {circular: true, value: 0.6}}

export const Colors: Story = {
  parameters: {
    notes:
      '`color` takes any colour token: `fill.destructive.primary` for storage nearly full, `fill.success.primary` for ' +
      'a goal reached. iOS tints the bar with it over the system track. Android draws the indicator in it and, for ' +
      'any colour but the accent, the track in the same colour faded; the accent keeps Material’s own track.',
  },
  render: () => (
    <VStack spacing="s16" wide>
      <Progress accessibilityLabel="Uploading" value={0.35} />
      <Progress accessibilityLabel="Storage used" color="fill.destructive.primary" value={0.92} />
      <Progress accessibilityLabel="Daily goal" color="fill.success.primary" value={1} />
      <HStack spacing="s16">
        <Progress circular color="fill.destructive.primary" value={0.92} />
        <Progress circular color="fill.success.primary" value={0.6} />
        <Progress circular color="fill.success.primary" />
      </HStack>
    </VStack>
  ),
}

export const AllShapes: Story = {
  render: () => (
    <VStack spacing="s16" wide>
      <Progress value={0.35} />
      <Progress />
      <HStack spacing="s16">
        <Progress circular value={0.6} />
        <Progress circular />
      </HStack>
    </VStack>
  ),
}
