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
      'The same `MenuAction` list as `Menu` and `ContextMenu`, presented as a confirmation dialog from the bottom edge.',
  },
  render: ControlledActionSheet,
  title: 'Organisms/ActionSheet',
} satisfies Meta<typeof ActionSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenOnMount: Story = {args: {visible: true}}
