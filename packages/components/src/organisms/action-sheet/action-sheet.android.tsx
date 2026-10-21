import {Divider} from '../../atoms/divider'
import {HStack} from '../../atoms/h-stack'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import {Sheet} from '../sheet'
import type {ActionSheetComponent, ActionSheetProps} from './action-sheet.types'

export const ActionSheet: ActionSheetComponent = ({actions, onDismiss, title, visible}: ActionSheetProps) => {
  useHostGuard('ActionSheet')

  return (
    <Sheet onDismiss={onDismiss} visible={visible}>
      <VStack p="s16" spacing="s4" wide>
        <Text color="content.secondary" variant="labelMedium">
          {title}
        </Text>
        <Divider />
        {actions.map(action => (
          <HStack
            key={action.label}
            onPress={() => {
              onDismiss()
              action.onPress()
            }}
            py="s12"
            wide
          >
            <Text color={action.destructive ? 'content.destructive' : 'content.primary'}>{action.label}</Text>
          </HStack>
        ))}
      </VStack>
    </Sheet>
  )
}
