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
      'A `UISegmentedControl` / Material segmented button. It brings its own host, so it renders outside `Screen` and `Island` as well.',
  },
  render: ControlledSegmentedControl,
  title: 'Atoms/SegmentedControl',
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TwoSegments: Story = {args: {values: ['Light', 'Dark']}}

export const Disabled: Story = {args: {disabled: true}}
