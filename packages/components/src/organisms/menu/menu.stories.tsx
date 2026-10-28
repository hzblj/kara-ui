import type {Meta, StoryObj} from '@storybook/react-native'
import {fn} from 'storybook/test'

import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {insideIsland} from '../../utils/story-decorators'
import {Menu} from './menu'
import type {MenuAction} from './menu.types'

const DEMO_ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

const SHARE_ONLY: MenuAction[] = [{icon: 'share', label: 'Share', onPress: fn()}]

const WITH_DISABLED: MenuAction[] = [
  {label: 'Copy', onPress: fn()},
  {disabled: true, label: 'Paste', onPress: fn()},
  {destructive: true, disabled: true, label: 'Delete', onPress: fn()},
]

const meta = {
  args: {actions: DEMO_ACTIONS, label: 'Open menu'},
  component: Menu,
  decorators: [insideIsland],
  parameters: {
    notes:
      'A SwiftUI `Menu` / Material dropdown, opened by its own trigger: text, an icon and text, or an icon alone. ' +
      'Both platforms draw each action’s icon before its label. For the long-press variant on arbitrary content, use ' +
      '`ContextMenu`.',
  },
  title: 'Organisms/Menu',
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleAction: Story = {args: {actions: SHARE_ONLY, label: 'Share'}}

export const IconAndLabel: Story = {
  args: {icon: 'more', label: 'Options'},
  parameters: {
    notes:
      'The icon sits before the text, in the same colour: the menu’s tint on iOS, the accent with a chevron on Android.',
  },
}

export const IconOnly: Story = {
  parameters: {
    notes:
      'With an icon and no label the trigger is drawn as an `IconButton` (`content.primary`, a 44pt target on iOS, ' +
      'Material’s 48dp icon button on Android), and `accessibilityLabel` is required: it is what VoiceOver and ' +
      'TalkBack say for it.',
  },
  render: args => (
    <HStack align="center" spacing="s8" wide>
      <Text variant="headline">Order #1042</Text>
      <Menu accessibilityLabel="More options" actions={args.actions} icon="more" />
    </HStack>
  ),
}

export const DisabledActions: Story = {
  args: {actions: WITH_DISABLED, label: 'Edit'},
  parameters: {
    notes:
      'A `disabled` action stays in the list, greyed, and does not respond: SwiftUI’s disabled button on iOS, an ' +
      'item with `enabled` off in `btn.content.disabled` on Android.',
  },
}
