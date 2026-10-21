import type {Meta, StoryObj} from '@storybook/react-native'

import {Box} from '../box'
import {RnView} from '../rn-view'
import {Text} from '../text'
import {VStack} from '../v-stack'
import {Island} from './island'

const FIXED_HEIGHT = {height: 76}

const meta = {
  component: Island,
  parameters: {
    notes:
      'The host every other native atom needs — a SwiftUI `Host` / Compose view that the `@expo/ui` tree is ' +
      'mounted into. Outside one, a native atom silently renders nothing and `useHostGuard` warns in dev. ' +
      'This story carries no host decorator of its own, because the subject *is* the host.',
  },
  title: 'Atoms/Island',
} satisfies Meta<typeof Island>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Island>
      <VStack bg="surface.primary" borderRadius="medium" p="s12" spacing="s4" wide>
        <Text variant="headingXs">Inside the island</Text>
        <Text color="content.secondary" variant="footnote">
          matchContents on — the height follows the native content, the width comes from the parent.
        </Text>
      </VStack>
    </Island>
  ),
}

export const HostingReactNative: Story = {
  parameters: {
    notes:
      'An island holding an `RnView` must turn `matchContents` off and be given an explicit height: the view ' +
      'drives its SwiftUI frame from the child’s Yoga bounds while an auto-sizing island writes its measured ' +
      'size back into that same Yoga style, and the two loop until the main thread hangs.',
  },
  render: () => (
    <Island matchContents={false} style={FIXED_HEIGHT}>
      <VStack bg="surface.primary" borderRadius="medium" p="s8" spacing="s8" wide>
        <Text variant="label">React Native boxes below</Text>
        <RnView>
          <Box bg="fill.quaternary" borderRadius="small" flexDirection="row" gap="s8" p="s12">
            <Box bg="fill.accent.primary" borderRadius="small" h={24} w={24} />
            <Box bg="fill.destructive.primary" borderRadius="small" h={24} w={24} />
            <Box bg="fill.success.primary" borderRadius="small" h={24} w={24} />
          </Box>
        </RnView>
      </VStack>
    </Island>
  ),
}
