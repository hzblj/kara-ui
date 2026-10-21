import type {Meta, StoryObj} from '@storybook/react-native'

import {RnText} from '../rn-text'
import {Box} from './box'

const meta = {
  component: Box,
  parameters: {
    notes:
      'A React Native `View` wearing the `sx` props — the escape hatch for layout a native stack cannot ' +
      'express. It takes `ResponsiveViewSx`, the wider of the two surfaces: `flexDirection`, `gap`, margins, ' +
      'flex and per-corner radii all work here and on none of the native atoms.',
  },
  title: 'Atoms/Box',
} satisfies Meta<typeof Box>

export default meta

type Story = StoryObj<typeof meta>

export const Radii: Story = {
  render: () => (
    <Box flexDirection="row" gap="s8" wrap="wrap">
      <Box bg="fill.accent.primary" borderRadius="none" h={48} w={48} />
      <Box bg="fill.accent.primary" borderRadius="small" h={48} w={48} />
      <Box bg="fill.accent.primary" borderRadius="medium" h={48} w={48} />
      <Box bg="fill.accent.primary" borderRadius="large" h={48} w={48} />
      <Box bg="fill.accent.primary" borderRadius="full" h={48} w={48} />
    </Box>
  ),
}

export const CornerRadii: Story = {
  render: () => (
    <Box gap="s8">
      <Box align="center" bg="fill.tertiary" borderTopRadius="large" h={48} justify="center" wide>
        <RnText variant="labelMedium">borderTopRadius large</RnText>
      </Box>
      <Box align="center" bg="fill.tertiary" borderBottomRadius="large" h={48} justify="center" wide>
        <RnText variant="labelMedium">borderBottomRadius large</RnText>
      </Box>
      <Box align="center" bg="fill.tertiary" borderTopLeftRadius="full" h={48} justify="center" wide>
        <RnText variant="labelMedium">borderTopLeftRadius full</RnText>
      </Box>
    </Box>
  ),
}

export const Borders: Story = {
  render: () => (
    <Box gap="s8">
      <Box borderBottomWidth={1} borderColor="border.secondary.muted" pb="s8" wide>
        <RnText variant="labelMedium">borderBottomWidth 1 — a one-sided divider</RnText>
      </Box>
      <Box borderColor="content.accent" borderLeftWidth={3} pl="s8" wide>
        <RnText variant="labelMedium">borderLeftWidth 3 — a quote rule</RnText>
      </Box>
      <Box borderColor="fill.quaternary" borderRadius="medium" borderStyle="dashed" borderWidth={1} p="s12" wide>
        <RnText variant="labelMedium">borderStyle dashed</RnText>
      </Box>
    </Box>
  ),
}

export const Sizing: Story = {
  render: () => (
    <Box gap="s8">
      <Box bg="fill.quaternary" borderRadius="small" p="s8" w="50%">
        <RnText variant="labelMedium">w 50%</RnText>
      </Box>
      <Box align="center" aspectRatio={3} bg="fill.success.primary" borderRadius="small" justify="center" wide>
        <RnText color="content.on.bg" variant="labelMedium">
          aspectRatio 3
        </RnText>
      </Box>
      <Box bg="fill.tertiary" borderRadius="small" maxW={200} minH={56} p="s8">
        <RnText variant="labelMedium">minH 56 · maxW 200</RnText>
      </Box>
    </Box>
  ),
}

export const RowWithGap: Story = {
  render: () => (
    <Box bg="fill.quaternary" borderRadius="small" flexDirection="row" gap="s8" p="s12" wide>
      <Box bg="fill.accent.primary" borderRadius="small" h={24} w={24} />
      <Box bg="fill.destructive.primary" borderRadius="small" h={24} w={24} />
      <Box bg="fill.success.primary" borderRadius="small" h={24} w={24} />
    </Box>
  ),
}
