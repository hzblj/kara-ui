import {Button, ConfirmationDialog} from '@expo/ui/swift-ui'

import {useHostGuard} from '../../host-context'
import type {ActionSheetComponent, ActionSheetProps} from './action-sheet.types'

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
      {actions.map(action => (
        <Button
          key={action.label}
          label={action.label}
          onPress={action.onPress}
          role={action.destructive ? 'destructive' : 'default'}
        />
      ))}
    </ConfirmationDialog>
  )
}
