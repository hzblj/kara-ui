import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {Island} from '../island'
import {Text} from '../text'
import {RnFlatList} from './rn-flat-list'

type DemoRow = {
  id: string
  label: string
}

const ROWS: DemoRow[] = Array.from({length: 20}, (_, index) => ({
  id: String(index),
  label: `Native row ${index + 1}`,
}))

const NativeRow = ({label}: {label: string}) => (
  <Island>
    <Text variant="label">{label}</Text>
  </Island>
)

const renderRow = ({item}: {item: DemoRow}) => <NativeRow label={item.label} />

const rowKey = (item: DemoRow) => item.id

const meta = {
  args: {data: ROWS, keyExtractor: rowKey, nestedScrollEnabled: true, renderItem: renderRow},
  component: RnFlatList,
  decorators: [
    Story => (
      <Box bg="surface.primary" borderRadius="medium" h={240} overflow="hidden">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    notes:
      'kara’s list for React Native content — every row here is its own `Island`. It renders cells in normal ' +
      'flow inside a scroll view, so a hosted view stays where the layout put it, which no recycling list ' +
      'can promise.',
  },
  title: 'Atoms/RnFlatList',
} satisfies Meta<typeof RnFlatList<DemoRow>>

export default meta

type Story = StoryObj<typeof meta>

export const NativeRows: Story = {}

export const PaddedContent: Story = {args: {content: {gap: 's8', p: 's12'}}}
