import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {RnSectionList} from './rn-section-list'

type DemoRow = {
  id: string
  label: string
}

type DemoSection = {
  data: DemoRow[]
  title: string
}

const section = (title: string, prefix: string): DemoSection => ({
  data: Array.from({length: 4}, (_, index) => ({id: `${prefix}-${index}`, label: `${title} item ${index + 1}`})),
  title,
})

const SECTIONS: DemoSection[] = [section('Atoms', 'a'), section('Molecules', 'm'), section('Organisms', 'o')]

const SectionHeader = ({title}: {title: string}) => (
  <Box bg="surface.base" px="s12" py="s8">
    <RnText color="content.tertiary" variant="captionMedium">
      {title.toUpperCase()}
    </RnText>
  </Box>
)

const renderSectionHeader = ({section: {title}}: {section: DemoSection}) => <SectionHeader title={title} />

const RowItem = ({label}: {label: string}) => (
  <Box px="s12" py="s8">
    <RnText variant="footnote">{label}</RnText>
  </Box>
)

const renderRow = ({item}: {item: DemoRow}) => <RowItem label={item.label} />

const rowKey = (item: DemoRow) => item.id

const meta = {
  args: {
    keyExtractor: rowKey,
    nestedScrollEnabled: true,
    renderItem: renderRow,
    renderSectionHeader,
    sections: SECTIONS,
  },
  component: RnSectionList,
  decorators: [
    Story => (
      <Box bg="surface.primary" borderRadius="medium" h={280} overflow="hidden">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    notes:
      'Sticky headers default to off here, unlike React Native, where they are on for vertical lists — a header ' +
      'that detaches and floats over the content is a deliberate effect, not something a list should do unasked.',
  },
  title: 'Atoms/RnSectionList',
} satisfies Meta<typeof RnSectionList<DemoRow, DemoSection>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const StickyHeaders: Story = {args: {stickySectionHeadersEnabled: true}}
