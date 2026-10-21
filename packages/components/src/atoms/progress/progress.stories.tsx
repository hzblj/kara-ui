import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIsland} from '../../story-decorators'
import {HStack} from '../h-stack'
import {VStack} from '../v-stack'
import {Progress} from './progress'

const meta = {
  argTypes: {value: {control: {max: 1, min: 0, step: 0.01, type: 'range'}}},
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
