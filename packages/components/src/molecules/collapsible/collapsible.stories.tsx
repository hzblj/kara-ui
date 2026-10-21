import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'

import {Text} from '../../atoms/text'
import {insideIsland} from '../../story-decorators'
import {Collapsible} from './collapsible'
import type {CollapsibleProps} from './collapsible.types'

const ControlledCollapsible = (args: CollapsibleProps) => {
  const [, updateArgs] = useArgs<CollapsibleProps>()

  return (
    <Collapsible {...args} onExpandedChange={expanded => updateArgs({expanded})}>
      <Text color="content.secondary" variant="footnote">
        Hidden content, revealed by a SwiftUI `DisclosureGroup` on iOS and Compose’s `AnimatedVisibility` on Android.
      </Text>
    </Collapsible>
  )
}

/** `children` is `null` here on purpose — see `list.stories.tsx`; the body comes from the render. */
const meta = {
  args: {children: null, expanded: false, label: 'Show details', onExpandedChange: () => undefined},
  component: Collapsible,
  decorators: [insideIsland],
  render: ControlledCollapsible,
  title: 'Molecules/Collapsible',
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Collapsed: Story = {}

export const Expanded: Story = {args: {expanded: true}}
