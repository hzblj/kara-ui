import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIslandOfHeight} from '../../story-decorators'
import {Surface} from '../surface'
import {Text} from '../text'
import {ScrollView} from './scroll-view'

const ROWS = Array.from({length: 20}, (_, index) => `Row ${index + 1}`)

const settle = () => new Promise<void>(resolve => setTimeout(resolve, 1200))

const meta = {
  component: ScrollView,
  decorators: [insideIslandOfHeight(220)],
  parameters: {
    notes:
      'The native scroll container — a SwiftUI `ScrollView` / Compose scrollable column, for a subtree that is ' +
      'native all the way down. Its `sx` styles the scrolling *content*, the way `contentContainerStyle` does. ' +
      'For a React Native subtree reach for `RnScrollView` instead. The island here is given a fixed height ' +
      'because a scroll view has no intrinsic one to measure.',
  },
  title: 'Atoms/ScrollView',
} satisfies Meta<typeof ScrollView>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: () => (
    <ScrollView p="s12" spacing="s8">
      {ROWS.map(row => (
        <Text key={row} variant="label">
          {row}
        </Text>
      ))}
    </ScrollView>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollView axis="horizontal" p="s12" spacing="s8">
      {ROWS.map(row => (
        <Surface key={row}>
          <Text variant="label">{row}</Text>
        </Surface>
      ))}
    </ScrollView>
  ),
}

export const PullToRefresh: Story = {
  render: () => (
    <ScrollView onRefresh={settle} p="s12" spacing="s8">
      {ROWS.map(row => (
        <Text key={row} variant="label">
          {row}
        </Text>
      ))}
    </ScrollView>
  ),
}
