import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {SegmentedControl} from './segmented-control'
import type {SegmentedControlProps} from './segmented-control.types'

const ControlledSegmentedControl = (args: SegmentedControlProps) => {
  const [, updateArgs] = useArgs<SegmentedControlProps>()

  return <SegmentedControl {...args} onChange={selectedIndex => updateArgs({selectedIndex})} />
}

const meta = {
  args: {selectedIndex: 0, values: ['Day', 'Week', 'Month']},
  component: SegmentedControl,
  parameters: {
    notes:
      "kara's own `UISegmentedControl` on iOS, Material segmented buttons on Android — the selected segment in the " +
      'accent on both. It needs no `Screen` or `Island`.',
  },
  render: ControlledSegmentedControl,
  title: 'Atoms/SegmentedControl',
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoSegments: Story = {args: {values: ['Light', 'Dark']}}

export const Disabled: Story = {args: {disabled: true}}
