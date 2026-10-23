import type {Meta, StoryObj} from '@storybook/react-native'

import {insideIslandOfHeight} from '../../story-decorators'
import {Box} from '../box'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {RnView} from '.'

/**
 * No `component` here, unlike every other story in this package.
 *
 * `RnViewProps.children` is a required `ReactElement`, so `args` would have to carry one — and a React
 * element must never sit in `args`: Storybook walks them to serialise the Controls panel, and in a dev
 * build that walk reaches React's element internals. There is nothing worth controlling on this atom
 * anyway, so the story builds the whole subtree itself.
 */
const meta = {
  decorators: [insideIslandOfHeight(96)],
  parameters: {
    notes:
      'Carries a React Native subtree back *into* a native host. Two rules come with it: the child must be a ' +
      'view and never bare text (a raw string has no component view and takes the app down at the host ' +
      'boundary), and the island around it must have `matchContents` off with an explicit height, or the two ' +
      'measurement passes chase each other until the main thread hangs.',
  },
  title: 'Atoms/RnView',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s8" spacing="s8" wide>
      <Text variant="label">SwiftUI text, then React Native boxes</Text>
      <RnView>
        <Box bg="fill.quaternary" borderRadius="small" flexDirection="row" gap="s8" p="s12">
          <Box bg="fill.accent.primary" borderRadius="small" h={24} w={24} />
          <Box bg="fill.destructive.primary" borderRadius="small" h={24} w={24} />
          <Box bg="fill.success.primary" borderRadius="small" h={24} w={24} />
        </Box>
      </RnView>
    </VStack>
  ),
}
