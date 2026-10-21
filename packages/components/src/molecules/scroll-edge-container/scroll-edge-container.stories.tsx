import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../../atoms/box'
import {RnScrollView} from '../../atoms/rn-scroll-view'
import {RnText} from '../../atoms/rn-text'
import {ScrollEdgeContainer} from './scroll-edge-container'

const ROWS = Array.from({length: 24}, (_, index) => `Row ${index + 1}`)

const Bar = ({label}: {label: string}) => (
  <Box align="center" p="s16">
    <RnText variant="labelMedium">{label}</RnText>
  </Box>
)

/**
 * No `component`, like `RnView`'s story: the props that matter here — the scroll view and both bars — are React
 * elements, and those never go in `args`. The story builds the whole subtree itself.
 */
const meta = {
  parameters: {
    notes:
      'iOS 26 gives both bars the system scroll edge effect — the progressive blur under content scrolling past ' +
      'them. Below iOS 26 the bars are still inset, without the effect (check `isScrollEdgeEffectAvailable()` and ' +
      'give them a background). Android has no effect and no `contentInset`, so the bars stack above and below the ' +
      'scroll view instead of over it.',
  },
  title: 'Molecules/ScrollEdgeContainer',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TopAndBottomBars: Story = {
  render: () => (
    <ScrollEdgeContainer
      bottomBar={<Bar label="Bottom bar" />}
      borderRadius="medium"
      h={360}
      topBar={<Bar label="Top bar" />}
    >
      <RnScrollView content={{gap: 's8', p: 's16'}}>
        {ROWS.map(row => (
          <Box bg="surface.primary" borderRadius="small" key={row} p="s12">
            <RnText>{row}</RnText>
          </Box>
        ))}
      </RnScrollView>
    </ScrollEdgeContainer>
  ),
}
