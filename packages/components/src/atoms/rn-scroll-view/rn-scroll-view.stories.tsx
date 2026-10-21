import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnText} from '../rn-text'
import {RnScrollView} from './rn-scroll-view'

const ROWS = Array.from({length: 20}, (_, index) => `Row ${index + 1}`)

const meta = {
  args: {content: {gap: 's8', p: 's12'}, nestedScrollEnabled: true},
  component: RnScrollView,
  decorators: [
    Story => (
      <Box bg="surface.primary" borderRadius="medium" h={220} overflow="hidden">
        <Story />
      </Box>
    ),
  ],
  parameters: {
    notes:
      'The React Native scroll container, and the one a screen full of `Island`s wants — the gallery screen is ' +
      'built on it. Top-level `sx` styles the viewport, `content` styles the scrolling content container, so ' +
      'padding and gap belong in `content`.',
  },
  title: 'Atoms/RnScrollView',
} satisfies Meta<typeof RnScrollView>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  render: args => (
    <RnScrollView {...args}>
      {ROWS.map(row => (
        <RnText key={row} variant="label">
          {row}
        </RnText>
      ))}
    </RnScrollView>
  ),
}

export const Horizontal: Story = {
  args: {axis: 'horizontal'},
  render: args => (
    <RnScrollView {...args}>
      {ROWS.map(row => (
        <Box bg="fill.tertiary" borderRadius="small" key={row} px="s12" py="s8">
          <RnText variant="label">{row}</RnText>
        </Box>
      ))}
    </RnScrollView>
  ),
}

export const WithoutIndicators: Story = {args: {showsIndicators: false}, render: Vertical.render}
