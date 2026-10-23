import {Icon, Island, Text, VStack} from '@hzblj/kara-components'
import type {Meta, StoryObj} from '@storybook/react-native'

/**
 * A transition between two screens, so there is nothing a story can push: it documents the contract, and the live demo
 * is the example's catalogue page (Components → ZoomTransition), with the settings to try.
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
      '// the list',
      'const zoomId = useZoomTransitionSourceId(photo.id)',
      "<ZoomTransition.Source identifier={zoomId} android={{borderRadius: 'large'}}>",
      '  <Photo />',
      '</ZoomTransition.Source>',
      '',
      '// the pushed screen',
      'const zoomId = useZoomTransitionParam()',
      "<ZoomTransition.Enabler sourceIdentifier={zoomId} ios={{dismissGesture: 'vertical'}} android={{duration: 'slow'}} />",
      "<ZoomTransition.Target identifier={zoomId} android={{borderRadius: 'large'}}>",
      '  <Photo />',
      '</ZoomTransition.Target>',
      '```',
      '',
      '- Push with `params: {[ZOOM_TRANSITION_PARAM]: zoomId}`, and give the pushed screen',
      '  `options={withZoomTransition(...)}` so the Android push fades under the transform.',
      '- The enabler renders first and unconditionally: on iOS it must exist in the screen’s first commit.',
      '- Top-level props work on both platforms (`scrim`); `ios` and `android` hold what only one honours.',
      '- iOS 18 and later; below it the push stays a slide. Inside a `ContextMenu`, a tap on the preview',
      '  zooms the preview’s photo.',
    ].join('\n'),
  },
  title: 'Organisms/ZoomTransition',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Contract: Story = {
  render: () => (
    <VStack bg="surface.primary" borderRadius="medium" p="s16" spacing="s8" wide>
      <Icon color="content.accent" name="widgets" size="s32" />
      <Text variant="headingXs">ZoomTransition is a push</Text>
      <Text color="content.secondary" variant="footnote">
        It runs between two screens of a stack, so a story cannot show it. The Notes tab holds the contract; try it on
        the ZoomTransition page of the component catalogue.
      </Text>
    </VStack>
  ),
}
