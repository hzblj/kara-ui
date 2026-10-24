import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Island} from '../island'
import {TextField} from '../text-field'
import {VStack} from '../v-stack'
import {SegmentedControl} from './segmented-control'
import type {SegmentedControlProps} from './segmented-control.types'

const ControlledSegmentedControl = (args: SegmentedControlProps) => {
  const [, updateArgs] = useArgs<SegmentedControlProps>()

  return <SegmentedControl {...args} onChange={selectedIndex => updateArgs({selectedIndex})} />
}

const NOTE = 'Ring twice, the bell is quiet.\nIf nobody answers, leave it with the neighbours at number 12.'

const SegmentedControlInIsland = (args: SegmentedControlProps) => {
  const [, updateArgs] = useArgs<SegmentedControlProps>()

  return (
    <Island>
      <VStack spacing="s12" wide>
        <TextField defaultValue={NOTE} label="Note for the courier" multiline />
        <SegmentedControl {...args} onChange={selectedIndex => updateArgs({selectedIndex})} />
      </VStack>
    </Island>
  )
}

const meta = {
  args: {selectedIndex: 0, values: ['Day', 'Week', 'Month']},
  component: SegmentedControl,
  parameters: {
    notes:
      "kara's own `UISegmentedControl` on iOS, Material segmented buttons on Android, with the selected segment " +
      'in the accent on both. It needs no `Screen` or `Island`.',
  },
  render: ControlledSegmentedControl,
  title: 'Atoms/SegmentedControl',
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoSegments: Story = {args: {values: ['Light', 'Dark']}}

export const Disabled: Story = {args: {disabled: true}}

export const InsideAnIsland: Story = {
  args: {values: ['Door', 'Locker', 'Pickup']},
  parameters: {
    notes:
      'On its own the control needs no host. Inside a `Screen` or `Island` it joins that host instead, so it ' +
      'shares a stack with other native views, a multiline `TextField` here.',
  },
  render: SegmentedControlInIsland,
}
