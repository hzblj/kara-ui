import {HStack} from '../../atoms/h-stack'
import {Icon} from '../../atoms/icon'
import {Island} from '../../atoms/island'
import {Text} from '../../atoms/text'
import {VStack} from '../../atoms/v-stack'
import {useHostGuard} from '../../host-context'
import {menuActionColor} from '../menu/menu-parts'
import {Sheet} from '../sheet'
import type {ActionSheetComponent, ActionSheetProps} from './action-sheet.types'

/**
 * Material's bottom-sheet menu: the title and the message, then a full-width row per action, its icon leading. The
 * sheet is the React Native tier, so the rows — Compose views — sit in an `Island` of their own; rendered straight into
 * the sheet they had no host and threw. A disabled row is greyed and has no press at all, so it neither ripples nor
 * reads as a button.
 */
export const ActionSheet: ActionSheetComponent = ({actions, message, onDismiss, title, visible}: ActionSheetProps) => {
  useHostGuard('ActionSheet')

  return (
    <Sheet onDismiss={onDismiss} visible={visible}>
      <Island>
        <VStack pb="s16" wide>
          {/* The message at the title's size, lighter: the iOS dialog's own pairing. */}
          <VStack px="s24" py="s12" spacing="s4" wide>
            <Text color="content.secondary" variant="labelMedium">
              {title}
            </Text>
            {message ? (
              <Text color="content.secondary" variant="label">
                {message}
              </Text>
            ) : null}
          </VStack>
          {actions.map(action => {
            const color = menuActionColor(action)

            return (
              <HStack
                key={action.label}
                onPress={
                  action.disabled
                    ? undefined
                    : () => {
                        onDismiss()
                        action.onPress()
                      }
                }
                px="s24"
                py="s16"
                spacing="s16"
                wide
              >
                {action.icon ? <Icon color={color} name={action.icon} /> : null}
                <Text color={color} variant="body">
                  {action.label}
                </Text>
              </HStack>
            )
          })}
        </VStack>
      </Island>
    </Sheet>
  )
}
