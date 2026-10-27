import type {Meta, StoryObj} from '@storybook/react-native'
import {useArgs} from 'storybook/preview-api'
import {fn} from 'storybook/test'

import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {insideIsland} from '../../story-decorators'
import type {MenuAction} from '../menu'
import {ActionSheet} from './action-sheet'
import type {ActionSheetProps} from './action-sheet.types'

const ACTIONS: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

const WITH_DISABLED: MenuAction[] = [
  {icon: 'share', label: 'Share', onPress: fn()},
  {disabled: true, icon: 'star', label: 'Favourite', onPress: fn()},
  {destructive: true, icon: 'trash', label: 'Delete', onPress: fn()},
]

const ControlledActionSheet = (args: ActionSheetProps) => {
  const [, updateArgs] = useArgs<ActionSheetProps>()

  return (
    <VStack spacing="s8" wide>
      <HStack onPress={() => updateArgs({visible: true})} py="s8" wide>
        <Text color="content.accent">Open action sheet</Text>
      </HStack>
      <ActionSheet {...args} onDismiss={() => updateArgs({visible: false})} />
    </VStack>
  )
}

const meta = {
  args: {actions: ACTIONS, onDismiss: () => undefined, title: 'Choose an action', visible: false},
  component: ActionSheet,
  decorators: [insideIsland],
  parameters: {
    notes:
      'The same `MenuAction` list as `Menu` and `ContextMenu`, presented as a confirmation dialog from the bottom edge. ' +
      'The title shows on both platforms. Icons are Android’s only: an iOS confirmation dialog draws text alone.',
  },
  render: ControlledActionSheet,
  title: 'Organisms/ActionSheet',
} satisfies Meta<typeof ActionSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithMessage: Story = {
  args: {message: 'The photo will be removed from all your devices.', title: 'Delete this photo?'},
  parameters: {
    notes:
      '`message` is the confirmation dialog’s own message on iOS, under the title; on Android a line under the ' +
      'title, at its size and lighter.',
  },
}

export const DisabledAction: Story = {
  args: {actions: WITH_DISABLED},
  parameters: {
    notes:
      'A `disabled` action stays in the list, greyed, and does not respond: SwiftUI’s disabled button on iOS, a row ' +
      'in `btn.content.disabled` with no press on Android.',
  },
}

export const OpenOnMount: Story = {args: {visible: true}}
