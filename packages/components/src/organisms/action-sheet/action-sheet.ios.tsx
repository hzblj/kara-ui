import {Button, ConfirmationDialog, Spacer} from '@expo/ui/swift-ui'
import {frame} from '@expo/ui/swift-ui/modifiers'

import {useHostGuard} from '../../host-context'
import type {ActionSheetComponent, ActionSheetProps} from './action-sheet.types'

/**
 * `@expo/ui` hangs the dialog on its `Trigger` and reads the buttons from its `Actions` slot. Without a trigger it
 * attaches to an `EmptyView`, which SwiftUI never presents from — a spacer framed to nothing is a real view that takes
 * no room.
 */
const ANCHOR = [frame({height: 0, width: 0})]

export const ActionSheet: ActionSheetComponent = ({actions, onDismiss, title, visible}: ActionSheetProps) => {
  useHostGuard('ActionSheet')

  return (
    <ConfirmationDialog
      isPresented={visible}
      onIsPresentedChange={next => {
        if (!next) {
          onDismiss()
        }
      }}
      title={title}
    >
      <ConfirmationDialog.Trigger>
        <Spacer modifiers={ANCHOR} />
      </ConfirmationDialog.Trigger>
      <ConfirmationDialog.Actions>
        {actions.map(action => (
          <Button
            key={action.label}
            label={action.label}
            onPress={action.onPress}
            role={action.destructive ? 'destructive' : 'default'}
          />
        ))}
      </ConfirmationDialog.Actions>
    </ConfirmationDialog>
  )
}
