import {Button, ConfirmationDialog, Spacer, Text as SwiftUIText} from '@expo/ui/swift-ui'
import {disabled, frame} from '@expo/ui/swift-ui/modifiers'

import {useHostGuard} from '../../host-context'
import type {ActionSheetComponent, ActionSheetProps} from './action-sheet.types'

/**
 * `@expo/ui` hangs the dialog on its `Trigger` and reads the buttons from its `Actions` slot. Without a trigger it
 * attaches to an `EmptyView`, which SwiftUI never presents from — a spacer framed to nothing is a real view that takes
 * no room.
 */
const ANCHOR = [frame({height: 0, width: 0})]

const DISABLED = [disabled(true)]

/**
 * `titleVisibility="visible"`: left to `automatic`, SwiftUI drops the title of a dialog presented as an action sheet,
 * and the actions lose what they are about.
 */
export const ActionSheet: ActionSheetComponent = ({actions, message, onDismiss, title, visible}: ActionSheetProps) => {
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
      titleVisibility="visible"
    >
      <ConfirmationDialog.Trigger>
        <Spacer modifiers={ANCHOR} />
      </ConfirmationDialog.Trigger>
      <ConfirmationDialog.Actions>
        {actions.map(action => (
          <Button
            key={action.label}
            label={action.label}
            modifiers={action.disabled ? DISABLED : undefined}
            onPress={action.onPress}
            role={action.destructive ? 'destructive' : 'default'}
          />
        ))}
      </ConfirmationDialog.Actions>
      {/*
        A native slot view, which cannot hold a bare string (see `Alert`): the dialog mounts while dismissed, so an
        unwrapped string would crash on mount. Plain SwiftUI `Text`, so the message keeps the system's styling.
      */}
      {message ? (
        <ConfirmationDialog.Message>
          <SwiftUIText>{message}</SwiftUIText>
        </ConfirmationDialog.Message>
      ) : null}
    </ConfirmationDialog>
  )
}
