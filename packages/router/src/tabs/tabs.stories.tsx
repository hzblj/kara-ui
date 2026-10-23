import {Icon, Island, Text, VStack} from '@hzblj/kara-components'
import type {Meta, StoryObj} from '@storybook/react-native'

/**
 * The one organism a story cannot mount.
 *
 * `Tabs` wraps Expo Router's own `NativeTabs`, which registers itself into the router's navigator tree — the
 * component *is* a route layout, and outside one it throws rather than rendering. So this story documents the
 * contract instead of pretending to demonstrate it; the live tab bar is the app's own, in
 * `app/(protected)/(tabs)/_layout.tsx`.
 */
const meta = {
  decorators: [
    Story => (
      <Island>
        <Story />
      </Island>
    ),
  ],
  parameters: {
    notes: [
      '```tsx',
      '<Tabs>',
      '  <Tabs.Screen icon="home" name="index" title={t(\'general.home\')} />',
      '  <Tabs.Screen icon="grid" name="gallery" title={t(\'general.gallery\')} />',
      '</Tabs>',
      '```',
      '',
      '- `Tabs.Screen` renders nothing itself: `Tabs` reads its props and emits the trigger. The navigator',
      '  matches children by element type exactly, so a component that merely *renders* a trigger is invisible',
      '  to it and the bar comes up empty.',
      '- `hidden` drops a tab from the bar *and* makes the route unreachable. Pass a build constant: toggling it',
      '  at runtime remounts the navigator.',
      '- `minimizeBehavior` is off by default, unlike the system. Minimizing changes the bar’s height mid-gesture',
      '  and a native tabs screen re-insets the first scroll view to match, so content shifts under the finger',
      '  every time the scroll direction changes.',
    ].join('\n'),
  },
  title: 'Organisms/Tabs',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Contract: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s16" spacing="s8" wide>
      <Icon color="content.accent" name="grid" size="s32" />
      <Text variant="headingXs">Tabs is a route layout</Text>
      <Text color="content.secondary" variant="footnote">
        It registers into Expo Router’s navigator tree, so it only exists as the layout of a route group; there is
        nothing a story can mount. The Notes tab holds the contract; the live tab bar is the app’s own.
      </Text>
    </VStack>
  ),
}
