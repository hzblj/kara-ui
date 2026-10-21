import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {FlashList} from './flash-list'

type DemoRow = {
  id: string
  label: string
}

const ROWS: DemoRow[] = Array.from({length: 60}, (_, index) => ({
  id: String(index),
  label: `Row ${index + 1}`,
}))

const DemoRowItem = ({label}: {label: string}) => (
  <Box px="s12" py="s8">
    <RnText variant="footnote">{label}</RnText>
  </Box>
)

const renderRow = ({item}: {item: DemoRow}) => <DemoRowItem label={item.label} />

const rowKey = (item: DemoRow) => item.id

const meta = {
  args: {data: ROWS, keyExtractor: rowKey, nestedScrollEnabled: true, renderItem: renderRow},
  component: FlashList,
  decorators: [
    Story => (
      <Box bg="surface.primary" borderRadius="medium" h={240} overflow="hidden">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    notes:
      'The default list here: it recycles rows, so a long list costs the same as a short one. That is also why ' +
      'it cannot hold native atoms — recycled, absolutely positioned cells leave an `@expo/ui` host drawn ' +
      'where the layout no longer is. Rows with native views belong in `RnFlatList` or `RnSectionList`. ' +
      'Padding goes in `content`, never in the top-level `sx`, which FlashList measures its rows against.',
  },
  title: 'Atoms/FlashList',
} satisfies Meta<typeof FlashList<DemoRow>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PaddedContent: Story = {args: {content: {py: 's12'}}}
